import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Input, Modal, Select, Table } from 'antd';
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

const ConfigItems = (props) => {
    const { items, setItems } = props;

    const [selectedItemId, setSelectedItemId] = useState(null);
    const [options, setOptions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const typeOptions = [
        { value: 'text', label: "Text input" },
        { value: 'textarea', label: "Textarea" },
        { value: 'select', label: "Select box" },
        { value: 'checkbox', label: "Checkbox" },
        { value: 'hidden', label: "Hidden" },
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
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <Input defaultValue={text} onChange={(e) => onChangeItem(record.id, 'name', e.target.value)} />
            )
        },
        {
            title: 'Label',
            dataIndex: 'label',
            render: (text, record) => (
                <Input defaultValue={text} onChange={(e) => onChangeItem(record.id, 'label', e.target.value)} />
            )
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
            title: 'Options',
            dataIndex: 'options',
            width: 200,
            render: (text, record) => {
                if (['select', 'checkbox'].includes(record.type)) {
                    return (
                        <div>
                            <Button onClick={() => onOpenOptionModal(record)}>Setup options</Button>
                        </div>
                    )
                }

                return null;
            }
        },
        {
            title: 'Required?',
            dataIndex: 'is_required',
            width: 100,
            render: (text, record) => (
                <Checkbox defaultChecked={text} onChange={(e) => onChangeItem(record.id, 'is_required', e.target.checked)} />
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
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <Button type="primary" danger onClick={() => onRemoveItem(record.id)}>Remove</Button>
                </div>
            )
        },
    ];

    const optionColumns = [
        {
            title: 'Value',
            dataIndex: 'value',
            render: (text, record) => (
                <Input defaultValue={text} onChange={(e) => onChangeOption(record.id, 'value', e.target.value)} />
            )
        },
        {
            title: 'Label',
            dataIndex: 'label',
            render: (text, record) => (
                <Input defaultValue={text} onChange={(e) => onChangeOption(record.id, 'label', e.target.value)} />
            )
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <Button type="primary" danger onClick={() => onRemoveOption(record.id)}>Remove</Button>
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
                name: '',
                type: 'text',
                is_required: true,
                description: '',
                label: ''
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

    // options
    const onOpenOptionModal = (record) => {
        const defaultOptions = record && record.options ? record.options : [];
        setSelectedItemId(record.id);
        setOptions([...defaultOptions]);
        setModalVisible(true);
        console.log(defaultOptions, record)
    }

    const onCloseOptionModal = () => {
        setModalVisible(false);
        setOptions([]);
        setSelectedItemId(null);
    }

    const onAddOption = () => {
        setOptions([
            ...options,
            {
                id: options.length,
                value: '',
                label: ''
            }
        ]);
    }

    const onRemoveOption = (id) => {
        const newOptions = [...options];

        const index = newOptions.findIndex(option => option.id === id);
        newOptions.splice(index, 1);

        setOptions(newOptions);
    }

    const onChangeOption = _.debounce((id, name, value) => {
        const newOptions = [...options];

        const index = newOptions.findIndex(option => option.id === id);
        if (index >= 0) {
            newOptions[index][name] = value;
            setOptions(newOptions);
        }
    }, 200);

    const onSaveOptions = () => {
        onChangeItem(selectedItemId, 'options', options);
        onCloseOptionModal();
    }

    return (
        <div>
            <Button type='primary' className='mb-16' onClick={onAddItem}>Add more item</Button>
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
            <Modal
                title="Setup options"
                width={800}
                visible={modalVisible}
                onCancel={onCloseOptionModal}
                onOk={onSaveOptions}
                key={selectedItemId}
            >
                <Button type='primary' className='mb-16' onClick={onAddOption}>Add more option</Button>
                <Table
                    pagination={false}
                    dataSource={options}
                    columns={optionColumns}
                    rowKey="id"
                />
            </Modal>
        </div>
    )
}

ConfigItems.propTypes = {
    items: PropTypes.array,
    setItems: PropTypes.func,
}

ConfigItems.defaultProps = {
    items: [],
    setItems: () => { }
}

export default ConfigItems;