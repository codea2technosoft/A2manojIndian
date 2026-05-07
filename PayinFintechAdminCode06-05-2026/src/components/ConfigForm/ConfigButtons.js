import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, Checkbox, Input, Modal, Select, Table } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import _ from 'lodash';
import { MenuOutlined } from '@ant-design/icons';

const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
    const type = 'DraggableBodyRow';

    const ref = useRef();

    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: monitor => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
            };
        },
        drop: item => {
            moveRow(item.index, index);
        },
    });

    const [, drag] = useDrag({
        type,
        item: { index },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drop(drag(ref));

    return (
        <tr
            ref={ref}
            className={`${className}${isOver ? dropClassName : ''}`}
            style={{ cursor: 'move', ...style }}
            {...restProps}
        />
    );
};

const ConfigButtons = (props) => {
    const { items, setItems } = props;

    const typeOptions = [
        { value: 'oauth', label: "OAuth" },
        { value: 'onboarding', label: "Onboarding" },
        { value: 'default', label: "Default" }
    ];

    const positionOptions = [
        { value: 'above_form', label: "Above config form" },
        { value: 'below_form', label: "Below config form" },
    ];

    const columns = [
        {
            title: 'Sort',
            dataIndex: 'sort',
            width: 30,
            className: 'drag-visible',
            render: () => <MenuOutlined />,
        },
        {
            title: 'Label',
            dataIndex: 'label',
            render: (text, record) => (
                <Input defaultValue={text} onChange={(e) => onChangeItem(record.id, 'label', e.target.value)} />
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: (text, record) => (
                <Input defaultValue={text} onChange={(e) => onChangeItem(record.id, 'description', e.target.value)} />
            )
        },
        {
            title: 'URL',
            dataIndex: 'url',
            render: (text, record) => {
                if (record.type === 'onboarding') {
                    return null;
                }

                return (
                    <Input defaultValue={text} onChange={(e) => onChangeItem(record.id, 'url', e.target.value)} />
                )
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: 200,
            render: (text, record) => (
                <Select
                    options={typeOptions}
                    defaultValue={text}
                    style={{ width: '100%' }}
                    onChange={(value) => onChangeItem(record.id, 'type', value)}
                />
            )
        },
        {
            title: 'Position',
            dataIndex: 'position',
            width: 200,
            render: (text, record) => (
                <Select
                    options={positionOptions}
                    defaultValue={text}
                    style={{ width: '100%' }}
                    onChange={(value) => onChangeItem(record.id, 'position', value)}
                />
            )
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <Button type="primary" danger onClick={() => onRemoveItem(record.id)}>Remove</Button>
                </div>
            )
        },
    ];

    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const dragRow = items[dragIndex];
            setItems(
                update(items, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragRow],
                    ],
                }),
            );
        },
        [items],
    );

    const onAddItem = () => {
        const newItems = [
            ...items,
            {
                id: items.length,
                label: '',
                url: '',
                type: 'default'
            }
        ];

        setItems(newItems);
    }

    const onChangeItem = _.debounce((id, name, value) => {
        const newItems = [...items];

        const index = newItems.findIndex(item => item.id === id);
        if (index >= 0) {
            newItems[index][name] = value;
            setItems(newItems);
        }
    }, 200);

    const onRemoveItem = (id) => {
        const newItems = [...items];

        const index = newItems.findIndex(item => item.id === id);
        newItems.splice(index, 1);

        setItems(newItems);
    }

    return (
        <div>
            <Button type='primary' className='mb-16' onClick={onAddItem}>Add more button</Button>
            <Alert 
                type='warning' 
                showIcon 
                className='mb-16'
                message={
                    <span>Button type <b>Onboarding</b> can be used for service which supports onboarding only.</span>
                }
            />
            <DndProvider backend={HTML5Backend}>
                <Table
                    pagination={false}
                    dataSource={items}
                    columns={columns}
                    rowKey="id"
                    components={{
                        body: {
                            row: DraggableBodyRow,
                        },
                    }}
                    onRow={(record, index) => ({
                        index,
                        moveRow,
                    })}
                />
            </DndProvider>
        </div>
    )
}

ConfigButtons.propTypes = {
    items: PropTypes.array,
    setItems: PropTypes.func,
}

ConfigButtons.defaultProps = {
    items: [],
    setItems: () => { }
}

export default ConfigButtons;