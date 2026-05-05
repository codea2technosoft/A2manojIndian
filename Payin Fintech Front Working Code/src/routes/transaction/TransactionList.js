import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Table, Row, Col, Statistic, Card } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import OrderPaymentStatusDropdown from 'components/OrderPaymentStatusDropdown';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import pusher from 'utils/pusher';
// request
import { getTransactions, updateTransaction } from 'requests/transaction';
import { getTransactionSummary } from 'requests/statistic';

const TransactionList = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(100);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [summary, setSummary] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        failed: 0
    });

    const user = useSelector(state => state.auth.authUser);

    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Transactions' }];

    useEffect(() => {
        const channel = pusher.subscribe(`sob_channel_user_${user.id}`);
        
        channel.bind('new-transaction', function (data) {
            onRefresh();
        });

        channel.bind('update-transaction', function (data) {
            onRefresh();
        });
    }, []);


    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Order ID',
            key: 'order_id',
            dataIndex: 'order_id',
        },
        {
            title: 'Transaction ID',
            key: 'order_id',
            dataIndex: 'order_id',
            render: (text, record) => (
                <div>{record.order.order_number}</div>
            )
        },
        {
            title: 'Customer',
            render: (text, record) => (
                <div>
                    <div>
                        <a href={`mailto:${record.order.email}`}>{record.order.email}</a>
                    </div>
                    <div>
                        <a href={`tel:${record.order.phone}`}>{record.order.phone}</a>
                    </div>
                </div>
            )
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => (
                <OrderPaymentStatusDropdown
                    orderId={record.id}
                    defaultValue={text}
                    onChangeStatus={(value) => onUpdateTransaction(record.id, { status: value })}
                />
            )
        },
        {
            title: 'Amount',
            key: 'total',
            dataIndex: 'total'
        },
        {
            title: 'Fees',
            key: 'fees',
            dataIndex: 'fees',
        },
        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text) => (
                <span>{new Date(text).toLocaleString('en-GB')}</span>
            )
        },
    ];

    useEffect(() => {
        const summary = async () => {
            const response = await getTransactionSummary();

            setSummary(response);
        }

        summary();
    }, []);

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getTransactions(query);

            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    };

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

    const onRefresh = async () => {
        let query = parseQueryParams(location);
        query = {
            page: 1,
            keyword: '',
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });

        // get summary again
        const response = await getTransactionSummary();
        setSummary(response);

        if (searchRef.current?.input.value) {
            searchRef.current.handleReset();
        }
    };

    const onChangeTable = (pagination) => {
        console.log(pagination);

        let query = parseQueryParams(location);
        query = {
            ...query,
            page: pagination.current,
            per_page: pagination.pageSize,
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const onUpdateTransaction = async (id, data) => {
        try {
            setIsTableLoading(true);
            const response = await updateTransaction(id, data);
            onRefresh();
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <TableBar
                onSearch={onSearch}
                showFilter={false}
                placeholderInput="Search..."
                inputRef={searchRef}
            />
            <Card>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Statistic title="Pending" value={summary.pending} />
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Statistic title="Approved" value={summary.approved} />
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Statistic title="Rejected" value={summary.rejected} />
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <Statistic title="Failed" value={summary.failed} />
                    </Col>
                </Row>
            </Card>
            <Spin spinning={isTableLoading}>
                <Table
                    style={{ marginTop: '10px' }}
                    dataSource={records}
                    columns={columns}
                    onChange={onChangeTable}
                    rowKey={'id'}
                    pagination={{
                        pageSize: perPage,
                        total: totalCount,
                        current: page,
                    }}
                />
            </Spin>
        </div>
    );
};

export default TransactionList;
