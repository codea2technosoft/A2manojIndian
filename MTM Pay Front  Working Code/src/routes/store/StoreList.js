import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Modal, Table, Button, Typography, Tooltip } from "antd";
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import PageTitle from 'components/PageTitle';
import { LinkIcon } from '@heroicons/react/outline';
// requests
import { getStores } from 'requests/store';
import { getSubscription } from 'requests/auth';

const { Title, Text } = Typography;

const StoreList = () => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Stores' }];

    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => (
                <div>{index + 1}</div>
            )
        },
        {
            title: 'Name',
            dataIndex: 'store_name',
            key: 'store_name',
            render: (text, record) => (
                <div>
                    <Link to={`/stores/${record.id}`}>{text}</Link>
                    <Tooltip className='ml-8' title="View storefront">
                        <a href={record.store_url} target='_blank'>
                            <LinkIcon className='view-store-icon' width={18} height={18} />
                        </a>
                    </Tooltip>
                </div>
            )
        },
        {
            title: 'Store ID',
            dataIndex: 'platform_store_id',
            key: 'platform_store_id'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile'
        },
        {
            title: 'Platform',
            render: (text, record) => (
                <div>
                    <img src={process.env.REACT_APP_ASSET_URL + record.platform.logo} height={20} />
                    {/* {record.platform.name} */}
                </div>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                <div>
                    {text ? <Text type="success">Active</Text> : <Text type="danger">Inactived</Text>}
                </div>
            )
        },
    ];

    useEffect(() => {
        const getData = async () => {
            const query = parseQueryParams(location);
            getRecords(query);
            // check subscription
            const response = await getSubscription();
            if (response.subscription) {
                setIsSubscribed(true);
            }
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
            const response = await getStores(query);
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
            <Row className='mt-16 mb-16'>
                <Link to={isSubscribed ? '/stores/create' : '/pricing'}>
                    <Button type='primary'>Link more store</Button>
                </Link>
            </Row>
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

export default StoreList;