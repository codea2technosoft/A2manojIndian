import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Form, Input, Button } from 'antd';
import api from 'utils/api';
const { Title } = Typography;
const layout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 20,
    },
};

const Profile = () => {
    const [merchantProfile, setMerchantProfile] = useState({});
    useEffect(() => {
        fetchMerchantProfile();
    }, []);

    const fetchMerchantProfile = async () => {
        try {
            const response = await api.get('/merchant-profile');
            console.warn(response.data.data);
            setMerchantProfile(response.data.data);
        } catch (error) {
            console.error('Error fetching merchant profile:', error);
        }
    };

    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err) => console.error('Error copying to clipboard:', err));
    };

    return (
        <div className="profile">
            <Card>
                <div className='profile_header'> <h3>Personal Information</h3> </div>
                <Row gutter={[8, 16]}>
                    <Col xs={12} md={12} lg={12}>
                        <Form className="profile_form" {...layout} name="nest-messages" >
                            <Form.Item name={['user', 'name']} label="Name">
                                <Input placeholder={merchantProfile.full_name} disabled />
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col xs={12} md={12} lg={12}>
                        <Form className="profile_form" {...layout} name="nest-messages" >
                            <Form.Item name={['user', 'Website']} label="Website">
                                <Input placeholder={merchantProfile.Website} disabled />
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col xs={12} md={12} lg={12}>
                        <Form className="profile_form" {...layout} name="nest-messages" >
                            <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email', },]}>
                                <Input placeholder={merchantProfile.email} disabled />
                            </Form.Item>


                        </Form>
                    </Col>

                    <Col xs={12} md={12} lg={12}>
                        <Form className="profile_form" {...layout} name="nest-messages" >
                            <Form.Item name={['user', 'mobile']} label="Mobile" rules={[{ type: 'mobile', },]}>
                                <Input placeholder={merchantProfile.mobile} disabled />
                            </Form.Item>
                        </Form>
                    </Col>


                    <Col xs={12} md={12} lg={12}>
                        <Form className="profile_form" {...layout} name="nest-messages" >
                            <Form.Item name={['user', 'address']} label="Address" rules={[{ type: 'address', },]}>
                                <Input placeholder={merchantProfile.Address} disabled />
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col xs={12} md={12} lg={12}>
                        <Form className="profile_form" {...layout} name="nest-messages" >
                            <Form.Item name={['user', 'pan']} label="PAN/GST" rules={[{ type: 'pan', },]}>
                                <Input placeholder={merchantProfile.PAN_GST} disabled />
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col xs={12} md={12} lg={12}>
                        <Form className="profile_form" {...layout} name="nest-messages">
                            <Form.Item name={['user', 'mid']} label="Client ID" rules={[{ type: 'mid' },]}>
                                <Input
                                    placeholder={merchantProfile.mid}
                                    readOnly
                                    suffix={
                                        <Button onClick={() => copyToClipboard(merchantProfile.mid)}>Copy</Button>
                                    }
                                />
                            </Form.Item>
                        </Form>
                    </Col>

                    <Col xs={12} md={12} lg={12}>
                        <Form className="profile_form" {...layout} name="nest-messages">
                            <Form.Item name={['user', 'secret_id']} label="Secret ID" rules={[{ type: 'secret_id' }]}>
                                <Input
                                    placeholder={merchantProfile.secret_id}
                                    readOnly
                                    suffix={
                                        <Button onClick={() => copyToClipboard(merchantProfile.secret_id)}>Copy</Button>
                                    }
                                />
                            </Form.Item>
                        </Form>
                    </Col>

                    {copied && <p>Value copied to clipboard!</p>}

                </Row>
            </Card>
        </div>
    );
};

export default Profile;
