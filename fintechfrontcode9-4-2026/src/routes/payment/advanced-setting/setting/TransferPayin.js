import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
    Card,
    Row,
    Col,
    Typography,
    Button,
    Input,
    Collapse,
    Modal,
    DatePicker,
    Table,
    columns,
    Tag,
    Space,
} from 'antd';
import TableBar from 'components/TableBar';
import { getUsers } from 'requests/user';
import { BaseSelect } from 'components/Elements';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { useLocation, useNavigate } from 'react-router-dom';
import { LiaFileDownloadSolid } from 'react-icons/lia';
const { RangePicker } = DatePicker;

const { Title } = Typography;

const TransferPayin = (props) => {
    const { s, onUpdateData } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [usingSingleAccount, setUsingSingleAccount] = useState(false);
    const [subUserOptions, setSubUserOptions] = useState([]);

    const config = useSelector((state) => state.config);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchRef = useRef(null);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const [dates, setDates] = useState([dayjs(), dayjs()]);
    const onSetDatesByDatePicker = (dates) => {
        // setMode("custom");
        setDates(dates);
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const { Panel } = Collapse;
    const getAllUsers = async () => {
        const response = await getUsers({ is_paginate: 0 });
        const options = response.records.map((item) => ({
            label: item.full_name,
            value: item.id,
        }));
        setSubUserOptions(options);
    };
    const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
    const items = [
        {
            key: '1',
            label: 'This is panel header 1',
            children: <p>{text}</p>,
        },
        {
            key: '2',
            label: 'This is panel header 2',
            children: <p>{text}</p>,
        },
        {
            key: '3',
            label: 'This is panel header 3',
            children: <p>{text}</p>,
        },
    ];

    const onSearch = (keyword) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: 1,
            keyword: keyword,
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a>Invite {record.name}</a>
                    <Button type="primary" danger>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];
    const datas = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sydney No. 1 Lake Park',
            tags: ['cool'],
        },
    ];

    return (
        <div>
            
                <Row gutter={[8, 8]} align="middle" justify={'space-between'}>
                <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                <Card className='round_card'>
                    <TableBar
                        onSearch={onSearch}
                        showFilter={false}
                        placeholderInput="Search..."
                        inputRef={searchRef}
                    />
                    </Card>
                    </Col>
                    <Col xs={24} sm={24} md={9} lg={6} xl={5}>
                        <Card className='round_card'>
                        <Button type="primary" onClick={showModal} className="download">
                            <LiaFileDownloadSolid />
                            Download Report
                        </Button>
                        </Card>
                    </Col>

                    <Modal
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        title="Download Report"
                        footer={[
                            <Button key="close" onClick={handleCancel}>
                                Close
                            </Button>,
                            <Button key="transfer" type="primary">
                                {' '}
                                Download{' '}
                            </Button>,
                        ]}
                    >
                        <RangePicker
                            value={dates}
                            onCalendarChange={(newDates) => onSetDatesByDatePicker(newDates)}
                            className="w-100"
                        />
                    </Modal>
                </Row>
            <Table columns={columns} dataSource={datas} className="mt-16" />
        </div>
    );
};

export default TransferPayin;
