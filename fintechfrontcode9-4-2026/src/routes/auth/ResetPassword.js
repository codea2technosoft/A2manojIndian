import React, { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button, Card, Col, Row, Form, Divider, Typography, Input, Alert } from "antd";
// images
import logo from 'assets/images/logo.png';
import authenticationImage from 'assets/images/authentication_graphic.png';
// requests
import { resetPassword } from "requests/auth";

const { Title } = Typography;

const ResetPassword = () => {
    const [data, setData] = useState({
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [timer, setTimer] = useState(10);

    const [formRef] = Form.useForm();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) setErrorMessage('The reset password link has expired or is not valid.');
    }, []);

    useEffect(() => {
        let interval; 

        if (isSuccess) {
            interval = setInterval(() => {
                if (timer >= 1) setTimer(timer => timer - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isSuccess]);

    useEffect(() => {
        if (timer === 0) navigate('/signin');
    }, [timer]);

    const onSubmit = async (formData) => {
        if (formData.password !== formData.confirm_password) {
            formRef.setFields([
                {
                    name: "confirm_password",
                    errors: ["The password confirmation does not match"]
                }
            ]);
            return;
        }

        const payload = {
            ...formData,
            token: token
        };
        delete payload.confirm_password;

        try {
            setErrorMessage('');
            setLoading(true);
            await resetPassword(payload);
            setIsSuccess(true);
        } catch (error) {
            setErrorMessage(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="authentication-container">
            <Row className="authentication-header--wrapper" justify="space-between" align="middle">
                <img src={logo} className="logo" alt="logo" />
            </Row>
            <Row className="authentication-content--wrapper" gutter={48} justify="space-between" align="middle">
                <Col xs={24} sm={24} md={12} lg={10}>
                    <Card className="authentication-content">
                        <Title level={3}>Change password</Title>
                        {
                            errorMessage ? <Alert className="mt-16 mb-16" message={errorMessage} type="error" showIcon /> : null
                        }
                        {
                            isSuccess ? (
                                <Alert
                                    className="mt-16 mb-16"
                                    message={<div>Your password is changed successfully. You will be redirected to signin page in <b>{timer}</b> second(s)...</div>}
                                    type="success"
                                    showIcon
                                />
                            ) : null
                        }
                        <p>Please create a new password for your account.</p>
                        {/* Form */}
                        <Form
                            className="mt-32"
                            layout="vertical"
                            autoComplete="off"
                            form={formRef}
                            initialValues={data}
                            onFinish={onSubmit}
                        >
                            <Form.Item name="password" rules={[{ required: true }]}>
                                <Input.Password placeholder='New password' />
                            </Form.Item>
                            <Form.Item name="confirm_password" rules={[{ required: true }]}>
                                <Input.Password placeholder='Re-type new password' />
                            </Form.Item>
                            <Button
                                htmlType='submit'
                                type="primary"
                                size="large"
                                className='w-100 mt-16'
                                loading={loading}
                            >
                                Change password
                            </Button>
                        </Form>
                        <Divider>or</Divider>
                        <Link to='/signup'>
                            <Button type="primary" ghost size="large" className="w-100">Create new Step2Pay account</Button>
                        </Link>
                        <Link to='/signin'>
                            <Button type="primary" ghost size="large" className="w-100 mt-16">Signin</Button>
                        </Link>
                    </Card>
                </Col>
                <Col className="authentication-block--img" xs={24} sm={24} md={12} lg={12}>
                    <Title level={3}>How Step2Pay can help?</Title>
                    <p className="mt-24">We enjoy adapting our strategies to offer every client the best solutions that are at the forefront of the industry.</p>
                    <img src={authenticationImage} className="mt-24" width="80%" />
                    <div className="mt-32">Need help? We are just a click away. <a href="#">Contact Us</a></div>
                </Col>
            </Row>
        </div >
    )
}

export default ResetPassword;