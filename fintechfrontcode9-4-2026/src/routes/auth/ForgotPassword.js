import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, Col, Row, Form, Divider, Typography, Input } from "antd";
import _ from 'lodash';
import { XIcon, CheckIcon } from "@heroicons/react/outline";
import { toast } from "react-toast";
// images
import logo from 'assets/images/logo.png';
// import mailCheckIcon from 'assets/images/mail-check.png';
import authenticationImage from 'assets/images/authentication_graphic.png';
// requests
import { checkEmailExisted, forgotPassword } from "requests/auth";

const { Title } = Typography;

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: ''
    });
    const [validEmail, setValidEmail] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const [formRef] = Form.useForm();

    const user = useSelector(state => state.auth.authUser);
    if (user) return <Navigate to="/" replace />;

    const renderInputSuffix = () => {
        if (data.email) {
            if (validEmail) return <CheckIcon width={24} height={24} color="#33824A" />;
            else return <XIcon width={24} height={24} color="#ff4d4f" />;
        }

        return null;
    }

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            await forgotPassword(formData);
            setIsSent(true);
        } catch (error) {
            toast.error("An error occurs. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const onValidateEmail = _.debounce(async (email) => {
        try {
            // update state
            setData({ email: email });

            const response = await checkEmailExisted(email);
            setValidEmail(response.is_existed);
        } catch (error) {
            setValidEmail(false);
        }
    }, 1000);

    return (
        <div className="authentication-container">
            <Row className="authentication-header--wrapper" justify="space-between" align="middle">
                <img src={logo} className="logo" alt="logo" />
            </Row>
            <Row className="authentication-content--wrapper" gutter={48} justify="space-between" align="middle">
                <Col xs={24} sm={24} md={12} lg={10}>
                    <Card className="authentication-content">
                        <Title level={3}>Password Reset</Title>
                        {
                            isSent ? (
                                <React.Fragment>
                                    {/* <p>We've sent you an email with instructions to reset your password</p>
                                    <Row justify="center" className="mt-24 mb-24"> */}
                                        {/* <img src={mailCheckIcon} /> */}
                                    {/* </Row> */}
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <p>We’ll send a password reset link to this email</p>
                                    {/* Form */}
                                    <Form
                                        className="mt-32"
                                        layout="vertical"
                                        autoComplete="off"
                                        form={formRef}
                                        initialValues={data}
                                        onFinish={onSubmit}
                                    >
                                        <Form.Item name="email" rules={[{ required: true }]}>
                                            {/* <Tooltip placement="right" title={<ErrorMessage />} visible={!validEmail} color="#FFEBE5"> */}
                                                <Input
                                                    placeholder='Email'
                                                    suffix={renderInputSuffix()}
                                                    onChange={(e) => onValidateEmail(e.target.value)}
                                                />
                                            {/* </Tooltip> */}
                                        </Form.Item>
                                        <Button htmlType='submit' type="primary" size="large" className='w-100 mt-16' loading={loading} disabled={!validEmail}>Reset password</Button>
                                    </Form>
                                </React.Fragment>
                            )
                        }
                        <Divider>or</Divider>
                        <Link to='/signup'>
                            <Button type="primary" ghost size="large" className="w-100">Create new Yumype account</Button>
                        </Link>
                        <Link to='/signin'>
                            <Button type="primary" ghost size="large" className="w-100 mt-16">Signin</Button>
                        </Link>
                    </Card>
                </Col>
                <Col className="authentication-block--img" xs={24} sm={24} md={12} lg={12}>
                    {/* <Title level={3}>How Yumype can help?</Title>
                    <p className="mt-24">We enjoy adapting our strategies to offer every client the best solutions that are at the forefront of the industry.</p> */}
                    <img src={authenticationImage} className="mt-24" width="80%" />
                    {/* <div className="mt-32">Need help? We are just a click away. <a href="#">Contact Us</a></div> */}
                </Col>
            </Row>
        </div >
    )
}

export default ForgotPassword;