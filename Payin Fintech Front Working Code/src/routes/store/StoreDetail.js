import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import Loading from "components/Loading";
import { Typography, Row, Col, Card, Button, Form, Input, Descriptions, Switch, Checkbox, Divider, DatePicker, Modal, Radio } from "antd";
import PageTitle from "components/PageTitle";
import { generateFormElement } from "utils/common";
import { toast } from "react-toast";
import pusher from 'utils/pusher';
import dayjs from 'dayjs';
import {
    Home
} from 'react-iconly';
// styles
import 'assets/styles/store.scss';
// request
import { getStoreDetail, syncStoreData, updateStoreDetail, updateStoreStatus } from 'requests/store';
// images
// import syncDataImg from 'assets/images/sync-data.png';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const StoreDetail = () => {
    const [loading, setLoading] = useState(true);
    const [titles, setTitles] = useState([{ path: '/stores', title: 'Stores' }]);
    const [record, setRecord] = useState({});
    const [status, setStatus] = useState(false);
    const [pusherData, setPusherData] = useState(null);
    const [syncOptions, setSyncOptions] = useState({
        order: {},
        product: {},
        customer: {}
    });
    const [visibleResultModal, setVisibleResultModal] = useState(false);

    const location = useLocation();
    const params = useParams();

    const navigate = useNavigate();

    const user = useSelector(state => state.auth.authUser);
    const config = useSelector(state => state.config);

    useEffect(() => {
        const channel = pusher.subscribe(`sob_channel_user_${user.id}`);
        channel.bind('platform-oauth', function (data) {
            const response = JSON.parse(data.message);
            setPusherData(response);
        });
    }, []);

    useEffect(() => {
        const getData = async () => {
            const response = await getStoreDetail(params.id);
            setRecord({
                ...response.record,
                ...response.record.params
            });
            setStatus(!!response.record.status);
            setTitles([{ path: '/stores', title: 'Stores' }, { path: location.pathname, title: response.record.store_name }]);
            setLoading(false);
        }

        getData();
    }, []);

    const onChangeStatus = async (isEnabled, event) => {
        try {
            event.preventDefault();
            event.stopPropagation();

            Modal.confirm({
                title: 'Do you want to change store status?',
                onOk: async () => {
                    await updateStoreStatus(params.id, {
                        status: isEnabled ? 1 : 0
                    });
                    setStatus(isEnabled);
                }
            });
        } catch (err) {
            setStatus(!isEnabled);
            console.log(err);
        }
    }

    const onToggleSelectSyncOption = (name) => {
        const newOptions = { ...syncOptions };

        if (newOptions[name]) delete newOptions[name];
        else newOptions[name] = {};

        setSyncOptions(newOptions);
    }

    const onChangeSyncOptionValue = (option, name, value) => {
        setSyncOptions({
            ...syncOptions,
            [option]: {
                ...syncOptions[option],
                [name]: value
            }
        });
    }

    const onSubmit = async () => {
        try {
            const data = { ...syncOptions };
            const options = Object.keys(data);
            options.forEach(option => {
                if (data[option] && data[option]['created'] && data[option]['created'].length) {
                    data[option] = {
                        ...data[option],
                        'created_from': dayjs(data[option]['created'][0]).format('YYYY-MM-DD'),
                        'created_to': dayjs(data[option]['created'][1]).format('YYYY-MM-DD')
                    };
                }
            });

            console.log(data);

            Modal.confirm({
                title: 'Do you want to sync data from this store to Step2Pay?',
                onOk: async () => {
                    // // save to session storage, this is used for progress screen
                    sessionStorage.setItem('isSynchronizing', 1);

                    await syncStoreData(params.id, data);
                    setVisibleResultModal(true);
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    if (loading) return (<Loading />);

    return (
        <div className="mb-36">
            <PageTitle titles={titles} />
            <Row gutter={16}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    {/* Status card */}
                    <Card className="store-detail__status">
                        <Row justify="space-between" align="middle">
                            <Row className="store-detail__status-content" align="middle">
                                <Home set="light" size={48} />
                                <div className="store-detail__status-text">
                                    <Title level={4}>Set store status</Title>
                                    <div>Enable/Disable store easily with one click. You can set status anytime. When store is disabled, new orders will not come to Step2Pay dashboard.</div>
                                </div>
                            </Row>
                            <Switch checked={status} onClick={(checked, event) => onChangeStatus(checked, event)} />
                        </Row>
                    </Card>
                    {/* Detail card */}
                    <Card className="mt-24">
                        <Title level={4}>Store details</Title>
                        <Descriptions column={1}>
                            <Descriptions.Item label="Store name">{record.store_name}</Descriptions.Item>
                            <Descriptions.Item label="Store ID">{record.store_id}</Descriptions.Item>
                            <Descriptions.Item label="Storefront URL"><a href={record.store_url} target="_blank">{record.store_url}</a></Descriptions.Item>
                            <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
                            <Descriptions.Item label="Mobile">{record.mobile}</Descriptions.Item>
                            <Descriptions.Item label="Prices include tax">{record.prices_include_tax ? 'Yes' : 'No'}</Descriptions.Item>
                            <Descriptions.Item label="Connected at">{dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Card>
                        <Title level={4}>Sync data</Title>
                        <div className="mb-24">
                            <Divider orientation="left" orientationMargin={0}>
                                <Checkbox checked={!!syncOptions.order} onChange={() => onToggleSelectSyncOption('order')}>Sync orders</Checkbox>
                            </Divider>
                            {
                                syncOptions.order ? (
                                    <div className="ml-24">
                                        <div className="mb-8">
                                            <div className="mb-8">Created in date range (leave it blank if you want sync all)</div>
                                            <RangePicker onChange={(dates) => onChangeSyncOptionValue('order', 'created', dates)} />
                                        </div>
                                        <Row>
                                            <Col xs={24} sm={24} md={24} lg={24}>
                                                <div className="mb-8">Statuses</div>
                                                {/* <Checkbox.Group
                                                    defaultValue={config.fulfillment_statuses.map(item => item.value)}
                                                    onChange={(values) => onChangeSyncOptionValue('order', 'payment_statuses', values)}
                                                >
                                                    <div>
                                                        <Checkbox value=''>All orders</Checkbox>
                                                    </div>
                                                    <div>
                                                        <Checkbox value='6'>Incomplete orders only (Abandoned carts)</Checkbox>
                                                    </div>
                                                </Checkbox.Group> */}
                                                <Radio.Group 
                                                    defaultValue={''} 
                                                    onChange={(e) => onChangeSyncOptionValue('order', 'payment_statuses', e.target.value)}
                                                >
                                                    <div>
                                                        <Radio value=''>All orders</Radio>
                                                    </div>
                                                    <div>
                                                        <Radio value='6'>Incomplete orders only (Abandoned carts)</Radio>
                                                    </div>
                                                </Radio.Group>
                                            </Col>
                                        </Row>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="mb-24">
                            <Divider orientation="left" orientationMargin={0}>
                                <Checkbox checked={!!syncOptions.product} onChange={() => onToggleSelectSyncOption('product')}>Sync products (included groups)</Checkbox>
                            </Divider>
                            {
                                syncOptions.product ? (
                                    <div className="ml-24">
                                        <div className="mb-8">
                                            <div className="mb-8">Created in date range (leave it blank if you want sync all)</div>
                                            <RangePicker onChange={(dates) => onChangeSyncOptionValue('product', 'created', dates)} />
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                        <div className="mb-24">
                            <Divider orientation="left" orientationMargin={0}>
                                <Checkbox checked={!!syncOptions.customer} onChange={() => onToggleSelectSyncOption('customer')}>Sync customers (included groups)</Checkbox>
                            </Divider>
                            {
                                syncOptions.customer ? (
                                    <div className="ml-24">
                                        <div className="mb-8">
                                            <div className="mb-8">Created in date range (leave it blank if you want sync all)</div>
                                            <RangePicker onChange={(dates) => onChangeSyncOptionValue('customer', 'created', dates)} />
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                        <Row justify="end">
                            <Button type="primary" onClick={onSubmit}>Sync now</Button>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Modal
                visible={visibleResultModal}
                footer={null}
                width={800}
                closable={false}
            >
                <Row justify="space-between" align="middle" gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Title level={3}>Your data is synchronizing...</Title>
                        <p className="mt-36">Keep calm and wait. The synchronizing progress will take time. This progress is running in background, so you can go back to overview screen.</p>
                        <Row justify="start" align="middle" className="mt-24">
                            <Link to="/overview">
                                <Button type="primary" className="mr-16">Go to overview</Button>
                            </Link>
                            <Link to={`/stores/${record.id}/sync-progress`}>
                                <Button type="default">View sync progress</Button>
                            </Link>
                        </Row>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        {/* <img src={syncDataImg} alt="sync data" className="w-100" /> */}
                    </Col>
                </Row>
            </Modal>
        </div>
    )
}

export default StoreDetail;