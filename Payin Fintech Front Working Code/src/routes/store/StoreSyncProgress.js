import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import Loading from "components/Loading";
import { Row, Result, Button, Table, Empty, Progress } from "antd";
import PageTitle from "components/PageTitle";
import pusher from 'utils/pusher';
import dayjs from 'dayjs';
import {
    CheckIcon,
    ClockIcon
} from '@heroicons/react/outline';
// styles
import 'assets/styles/store.scss';
// request
import { getStoreDetail, getSyncStoreProgress } from 'requests/store';
// images
// import doneImg from 'assets/images/done.png';

const StoreSyncProgress = () => {
    const [loading, setLoading] = useState(true);
    const [titles, setTitles] = useState([{ path: '/stores', title: 'Stores' }]);
    const [store, setStore] = useState({});
    const [isWaiting, setIsWaiting] = useState(false);
    const [items, setItems] = useState([]);
    const [finishedItems, setFinishedItems] = useState([]);
    const [visibleResult, setVisibleResult] = useState(false);

    const location = useLocation();
    const params = useParams();

    const user = useSelector(state => state.auth.authUser);

    const columns = [
        {
            title: 'No.',
            render: (text, record, index) => (
                <div>{index + 1}</div>
            ),
            width: 100
        },
        {
            title: 'Process',
            dataIndex: 'name',
            key: 'name',
            width: '40%'
        },
        {
            title: 'Status',
            render: (text, record) => {
                if (record.hasOwnProperty('progress')) {
                    return (
                        <div>
                            <Progress percent={record.progress} size="small" status={record.progress < 100 ? 'active' : 'success'} />
                            <div>
                                <small>Success count: <span>{record.success}</span> | Error count: <span>{record.error}</span></small>
                            </div>
                        </div>
                    );
                } else {
                    if (record.last_sync_at) {
                        return (
                            <Row align="middle" className="text-success">
                                <CheckIcon width={24} height={24} />
                                <span className="ml-8">Last synchronized at: {dayjs(record.last_sync_at).format('YYYY-MM-DD HH:mm:ss')}</span>
                            </Row>
                        );
                    } else {
                        return (
                            <div>Never synchronized</div>
                        )
                    }

                }
            }
        },
    ];

    useEffect(() => {
        const getData = async () => {
            const response = await getStoreDetail(params.id);
            setStore({
                ...response.record,
                ...response.record.params
            });
            setTitles([
                { path: '/stores', title: 'Stores' },
                { path: `/stores/${response.record.id}`, title: response.record.store_name },
                { path: location.pathname, title: 'Sync progress' },
            ]);
            setLoading(false);
        }

        getData();
    }, []);

    useEffect(() => {
        const value = sessionStorage.getItem('isSynchronizing');
        setIsWaiting(value === '1');
        sessionStorage.removeItem('isSynchronizing');
    }, []);

    useEffect(() => {
        if (store.sync_status === 1) {
            const interval = setInterval(async () => {
                const response = await getSyncStoreProgress(params.id);

                const newItems = [];
                const finishedItems = [];

                for (let key in response.results) {
                    const tmp = {
                        key: key,
                        ...response.results[key]
                    };

                    newItems.push(tmp);
                    if (tmp.progress === 100) finishedItems.push(tmp);
                }

                setItems(newItems);
                setFinishedItems(finishedItems);

                if (isWaiting) setIsWaiting(false);
            }, 3000);

            return () => clearInterval(interval);
        } else if (store.sync_status === 2) {
            const newItems = [
                { name: 'Synchronizing orders', key: 'order', last_sync_at: store.last_sync_orders_at },
                { name: 'Synchronizing product categories', key: 'category', last_sync_at: store.last_sync_categories_at },
                { name: 'Synchronizing products', key: 'product', last_sync_at: store.last_sync_products_at },
                { name: 'Synchronizing customer groups', key: 'customer_group', last_sync_at: store.last_sync_customer_group_at },
                { name: 'Synchronizing customers', key: 'customer', last_sync_at: store.last_sync_customers_at },
            ];

            setItems(newItems);
        }
    }, [store]);

    useEffect(() => {
        if (finishedItems.length === items.length && items.length > 0) {
            const timer = setTimeout(() => {
                setVisibleResult(true);
            }, 1000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [finishedItems]);

    if (loading) return (<Loading />);

    return (
        <div className="mb-36">
            <PageTitle titles={titles} />
            {
                // never sync
                store.sync_status === 0 ? (
                    <Empty
                        description="This store haven't been synchronized before"
                    />
                ) : (
                    <React.Fragment>
                        {
                            // sync in progress
                            store.sync_status === 1 ? (
                                <div>
                                    {
                                        visibleResult ? (
                                            <div>
                                                <Result
                                                    // icon={<img src={doneImg} width={360} />}
                                                    title="Great, all the synchronizing processes have done!"
                                                    extra={
                                                        <Link to='/overview'>
                                                            <Button type="primary">Go to Overview</Button>
                                                        </Link>
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                {
                                                    isWaiting ? (
                                                        <Loading />
                                                    ) : (
                                                        <Table
                                                            columns={columns}
                                                            dataSource={items}
                                                            rowKey='key'
                                                            pagination={false}
                                                        />
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </div>

                            ) : (
                                // synchronized
                                <Table
                                    columns={columns}
                                    dataSource={items}
                                    rowKey='key'
                                    pagination={false}
                                />
                            )
                        }
                    </React.Fragment>
                )
            }
        </div>
    )
}

export default StoreSyncProgress;