import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Switch, Input, message, Row, Col } from 'antd';
import TableBar from 'components/TableBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import api from 'utils/api';
const BankTransfarList = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState();
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [keyword, setkeyword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [transferAmount, setTransferAmount] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    // const columns = [
    //   {
    //     title: 'Created at',
    //     key: 'created_at',
    //     dataIndex: 'created_at',
    //     render: (text, record) => {
    //       const date = new Date(text);
    //       const formattedDate = date.toLocaleDateString();
    //       const formattedTime = date.toLocaleTimeString();

    //       return (
    //         <div>
    //           <div>{formattedDate}</div>
    //           <div>{formattedTime}</div>
    //         </div>
    //       );
    //     },
    //   },
    //   {
    //     title: 'Order ID',
    //     key: 'orderid',
    //     dataIndex: 'tid',
    //   },
    //   {
    //     title: 'Refrence Details',
    //     key: 'type',
    //     dataIndex: 'type',
    //   },
    //   {
    //     title: 'Amount',
    //     key: 'amount',
    //     dataIndex: 'amount',
    //   },
    //   {
    //     title: 'Status',
    //     key: 'status',
    //     dataIndex: 'status',
    //     render: (text) => {
    //       let color = '';
    //       if (text === 'success') {
    //         color = 'green';
    //       } else if (text === 'faild') {
    //         color = 'red';
    //       }
    //       return <span style={{ color }}>{text}</span>;
    //     }
    //   },
    // ];

    const columns = [
        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text, record) => {
                const date = new Date(text);
                const formattedDate = date.toLocaleDateString();
                const formattedTime = date.toLocaleTimeString();

                return (
                    <div>
                        <div>{formattedDate}</div>
                        <div>{formattedTime}</div>
                    </div>
                );
            },
        },
        {
            title: 'Order ID',
            key: 'orderid',
            dataIndex: 'orderid',
            render: (text, record) => (
                <div>
                    <div>{record.order_number}</div>
                    <div style={{ color: '#6C5DD3' }}>{record.orderid}</div>
                    <div style={{ color: '#6C5DD3' }}>{record.tid}</div>
                </div>
            ),
        },
        {
            title: 'Refrence Details',
            key: 'type',
            dataIndex: 'type',
        },
        {
            title: 'Amount',
            key: 'amount',
            dataIndex: 'amount',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text) => {
                let color = '';
                if (text === 'success') {
                    color = 'green';
                } else if (text === 'faild') {
                    color = 'red';
                }
                return <span style={{ color }}>{text}</span>;
            },
        },
    ];

    const handleTransfer = async () => {
        try {
            const response = await api.post('/Amount-settlement-payin-to-payout', {
                amount: transferAmount,
                type: 'account',
            });
            console.log('Transfer successful:', response.data);
            message.success('Transfer successful!');
            setIsTableLoading(true);
            fetchManagerList(searchKeyword);
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error('Error transferring:', error);
        }
    };

    const fetchManagerList = async (keyword, page, per_page) => {
        setIsTableLoading(true);
        try {
            // const response = await api.get(`/Amount-settlement-payin-to-payout-list?page=${page}&perPage=${per_page}`);
            const response = await api.get('/Amount-settlement-payin-to-payout-list', {
                params: {
                    page,
                    per_page: per_page,
                    keyword,
                },
            });
            const data = response.data.data;
            console.warn(response.data.total_records);
            const filteredRecords = keyword
                ? data.filter((record) => record.tid.toLowerCase().includes(keyword.toLowerCase()))
                : data;
            setRecords(filteredRecords);
            setPerPage(response.data.per_page);
            setTotalCount(response.data.total_records);
        } catch (error) {
            console.error('Error fetching TransfarList:', error);
        }
        setIsTableLoading(false);
    };

    useEffect(() => {
        fetchManagerList(searchKeyword);
        onSearch();
    }, []);

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
        // const urlParams = new URLSearchParams(window.location.search);
        fetchManagerList(keyword);
    };

    const onChangeTable = (pagination, filters, sorter, extra) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: pagination.current,
            per_page: pagination.pageSize,
        };

        if (sorter.order) {
            query = {
                ...query,
                order_by: sorter.field,
                order_type: sorter.order === 'ascend' ? 'asc' : 'desc',
            };
        } else {
            delete query.order_by;
            delete query.order_type;
        }
        fetchManagerList(' ', pagination.current, pagination.pageSize);
        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const onToggleFilter = () => {
        setIsShowFilter(!isShowFilter);
    };
    const [isShowFilter, setIsShowFilter] = useState(false);
    const searchRef = useRef(null);
    return (
        <div className="settlement">
            <Row
                className="mt-24 mb-16"
                style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline' }}
            >
                <Col xs={24} sm={24} md={16} lg={15} xl={18}>
                    <h2 className="mt-8" style={{ fontWeight: 700 }}>
                        Transfer to Payout Transaction History
                    </h2>
                </Col>
                <Col xs={24} sm={24} md={8} lg={9} xl={6}>
                    <TableBar
                        placeholderInput="Order ID"
                        onSearch={onSearch}
                        onFilter={onToggleFilter}
                        isActiveFilter={isShowFilter}
                        inputRef={searchRef}
                        showFilter={false}
                    />
                </Col>
            </Row>
            <Table
                className="mt-8"
                loading={isTableLoading}
                dataSource={records}
                columns={columns}
                rowKey="id"
                pagination={{
                    pageSize: perPage,
                    total: totalCount,
                    current: page,
                    onChange: (page, pageSize) => onChangeTable({ current: page, pageSize: pageSize }, {}, {}, {}),
                }}
                scroll={{
                    x: true,
                }}
            />
        </div>
    );
};
export default BankTransfarList;
