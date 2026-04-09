import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Modal, Table, Button, Typography, Tag } from "antd";
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import PageTitle from 'components/PageTitle';
import dayjs from 'dayjs';
// requests
import { getSubscriptionsHistory } from 'requests/subscribe';

const { Title, Text } = Typography;

const SubscriptionList = () => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Subscriptions History' }];

    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => (
                <div>{index + 1}</div>
            )
        },
        {
            title: 'Plan',
            render: (text, record) => (
                <div>{record.plan.name}</div>
            )
        },
        {
            title: 'Frequency',
            dataIndex: 'plan_type',
            key: 'plan_type',
            render: (text) => {
                return (
                    <div>
                        {
                            text === 'monthly' ? <Tag color='purple'>monthly</Tag> : <Tag color='orange'>annual</Tag>
                        }
                    </div>
                )
            }
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text, record) => {
                const currencyCode = record.plan.currency?.symbol;
                if (currencyCode) return (<div>{currencyCode} {record.amount}</div>);

                return (<div>{record.amount}</div>);
            }
        },
        {
            title: 'Start date',
            dataIndex: 'start_date',
            key: 'start_date'
        },
        {
            title: 'End date',
            dataIndex: 'end_date',
            key: 'end_date'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                if (text == 0) return <Tag color='red'>Inactive</Tag>;
                else if (text == 1) return <Tag color='success'>Active</Tag>;
                else if (text == 2) return <Tag color='magenta'>Expired</Tag>;
                else if (text == 3) return <Tag color='blue'>Pending</Tag>;
            }
        },
        {
            title: 'Subscribed at',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => {
                return (
                    <div>{dayjs(text).format('YYYY-MM-DD HH:mm')}</div>
                )
            }
        },
    ];

    useEffect(() => {
        const getData = async () => {
            const query = parseQueryParams(location);
            getRecords(query);
        }

        getData();
    }, [location]);

    const onChangeTable = (pagination, filters, sorter, extra) => {
        console.log(pagination, filters, sorter, extra)

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
                order_type: sorter.order === 'ascend' ? 'asc' : 'desc'
            }
        } else {
            delete query.order_by;
            delete query.order_type;
        }

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query)
        });
    }

    const getRecords = async (query) => {
        try {
            setLoading(true);
            const response = await getSubscriptionsHistory(query);
            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <Table
                loading={loading}
                columns={columns}
                dataSource={records}
                rowKey='id'
                onChange={onChangeTable}
                pagination={{
                    pageSize: perPage,
                    total: totalCount,
                    current: page,
                }}
            />
        </div>
    )
}

export default SubscriptionList;