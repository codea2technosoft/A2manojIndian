import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loading from "components/Loading";
import { Typography, Row, Col, Card, Button, Alert } from "antd";
import PageTitle from "components/PageTitle";
import { generateFormElement } from "utils/common";
import pusher from 'utils/pusher';
import { toast } from "react-toast";
// styles
import 'assets/styles/store.scss';
// request
import { getPlatforms } from 'requests/platform';
import { createStore } from 'requests/store';
import { handleButtonUrl } from "requests/common";
import IntegrationCard from "components/IntegrationCard";

const { Title } = Typography;

const StoreCreateForm = () => {
    const [loading, setLoading] = useState(true);
    const [platforms, setPlatforms] = useState([]);
    const [selectedPlatform, setSelectedPlaform] = useState({});
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [oauthWindow, setOauthWindow] = useState(null);
    const [pusherData, setPusherData] = useState(null);

    const navigate = useNavigate();

    const user = useSelector(state => state.auth.authUser);

    useEffect(() => {
        const channel = pusher.subscribe(`sob_channel_user_${user.id}`);
        channel.bind('platform-oauth', function (data) {
            const response = JSON.parse(data.message);
            setPusherData(response);
        });
    }, []);

    useEffect(() => {
        const getData = async () => {
            const response = await getPlatforms({ is_paginate: 0 });
            setPlatforms(response.records);
            setLoading(false);
        }

        getData();
    }, []);

    useEffect(() => {
        if (pusherData) {
            oauthWindow.close();

            if (pusherData.result) {
                navigate(`/stores/${pusherData.id}`);
            } else {
                toast.error(pusherData.message);
            }
        }
    }, [pusherData]);

    const onChoosePlatform = (platform) => {
        setSelectedPlaform(platform)
    }

    const onClickPlatformButton = async (url, type) => {
        try {
            const response = await handleButtonUrl(url);

            if (type === 'oauth' && response.url) {
                const newWindow = window.open(response.url, '_blank');
                setOauthWindow(newWindow);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const onSubmit = async (data) => {
        try {
            if (!selectedPlatform.id) {
                toast.error('You have to choose platform first');
                return;
            }

            setLoadingSubmit(true);

            const { store_name, platform_store_id, ...restData } = data;

            await createStore({
                platform_id: selectedPlatform.id,
                store_name: store_name,
                platform_store_id: platform_store_id,
                params: restData
            });
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingSubmit(false);
        }
    }

    if (loading) return (<Loading />);

    return (
        <div className="mb-36">
            <PageTitle titles={[{ path: '/store', title: 'Link your store with Step2Pay' }]} />
            <Alert message="Make sure that you have subscribed any plan before linking your store with Step2Pay" type="info" showIcon />
            <div className="mt-16 mb-16">Select your store's platform.</div>
            <Row gutter={[16, 16]}>
                {
                    platforms.map(platform => (
                        <Col xs={24} sm={24} md={4} lg={4}>
                            <Card
                                key={platform.id}
                                className={`card-selectable ${selectedPlatform.id === platform.id ? 'active' : ''}`}
                                onClick={() => onChoosePlatform(platform)}
                            >
                                <img src={process.env.REACT_APP_ASSET_URL + platform.logo} alt="logo" />
                                {/* <Title level={4} className="mb-0 mt-16">{platform.name}</Title> */}
                            </Card>
                        </Col>
                    ))
                }
            </Row>
            {/* <Title level={3} className="mt-36">Fill store information</Title> */}
            <Row gutter={16} className="mt-36">
                <Col xs={24} sm={24} md={18} lg={16}>
                    {
                        selectedPlatform.config && selectedPlatform.config.buttons ? (
                            <div>
                                {
                                    selectedPlatform.config.buttons.map((item, index) => {
                                        if (item.type === 'oauth') {
                                            return (
                                                <IntegrationCard
                                                    name={selectedPlatform.name}
                                                    logo={process.env.REACT_APP_ASSET_URL + selectedPlatform.logo}
                                                    description={item.description}
                                                    buttonTitle={item.label}
                                                    onClick={() => onClickPlatformButton(item.url, item.type)}
                                                />
                                            )
                                        } else {
                                            return (
                                                <Card key={index} className="mb-16">
                                                    <Row justify="space-between" align="middle" gutter={16}>
                                                        <Col span={18}>{item.description}</Col>
                                                        <Button type={item.type !== 'default' ? 'primary' : 'default'} onClick={() => onClickPlatformButton(item.url, item.type)}>{item.label}</Button>
                                                    </Row>
                                                </Card>
                                            )
                                        }
                                    })
                                }
                            </div>
                        ) : null
                    }
                    {/* <Card>
                        <Form
                            layout="vertical"
                            onFinish={onSubmit}
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item name="store_name" label="Store name" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item name="platform_store_id" label="Store ID" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {
                                selectedPlatform.config && selectedPlatform.config.form_fields ? (
                                    selectedPlatform.config.form_fields.map((field, index) => (
                                        <React.Fragment key={index}>
                                            {generateFormElement(field)}
                                        </React.Fragment>
                                    ))
                                ) : null
                            }
                            <Row justify="end">
                                <Button type="primary" htmlType="submit" loading={loadingSubmit}>Link store</Button>
                            </Row>
                        </Form>
                    </Card> */}
                </Col>
            </Row>

        </div>
    )
}

export default StoreCreateForm;