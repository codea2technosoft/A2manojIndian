import React, { useState } from 'react';
import { Typography, Row, Col, Card, Form, Input, Button, message, Modal } from 'antd';
import api from 'utils/api';
import { Message } from 'react-iconly';

const { Title } = Typography;

const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};

const ChangePassword = () => {
    const [merchantProfile, setMerchantProfile] = useState({});
    const [form] = Form.useForm();
    const [newPassword, setNewPassword] = useState('');

    const handlePasswordChange = async () => {
        try {
            const values = await form.validateFields();
            const response = await api.post('/change-password-dashboard', {
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
            });

            if (response.data.status == true) {
                Modal.success({
                    title: 'Change Password',
                    content: `${response.data.message}`,
                    onOk: () => {
                        Modal.destroyAll();
                        window.location.reload();
                    },
                });

            } else {
                Modal.error({
                    title: 'Change Password',
                    content: `${response.data.message}`,
                    onOk: () => {
                       
                    },
                });
            }

        } catch (error) {
            Modal.error('Failed to change password. Please try again.');
        }
    };

    const validateConfirmPassword = (_, value) => {
        if (value && value !== form.getFieldValue('newPassword')) {
            return Promise.reject('Passwords do not match');
        } else {
            return Promise.resolve();
        }
    };

    return (
        <div className="changePassword">
            <Card>
                {/* <div className='profile_header'>
                    <h3>Change Password</h3>
                </div> */}
                <Row gutter={[8, 16]}>
                    <Col xs={24} md={24} lg={24}>
                        <Form form={form} className="profile_form" {...layout} name="change-password-form">
                            <Form.Item
                                label="Current Password"
                                name="currentPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your current password',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                label="New Password"
                                name="newPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your new password',
                                    },
                                ]}
                            >
                                <Input.Password
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password',
                                    },
                                    {
                                        validator: validateConfirmPassword,
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                                <Button type="primary" onClick={handlePasswordChange}>
                                    Change Password
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ChangePassword;
