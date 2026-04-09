import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, Col, Row, Form, Progress, Typography, Input } from "antd";
import { toast } from "react-toast";
import Countdown, { zeroPad } from 'react-countdown';
import { getCookie, setCookie } from "utils/cookie";
// images
import logo from 'assets/images/logo_registered.png';
import authenticationImage from 'assets/images/authentication_graphic.png';
// requests
import { sendOtpViaEmail, sendOtpViaMobile, verifyOtp } from "requests/auth";

const { Title } = Typography;

const CountdownTimer = (props) => (
    <Countdown
        {...props}
        zeroPadTime={2}
        renderer={({ minutes, seconds }) => (
            <span>
                {zeroPad(minutes)}:{zeroPad(seconds)}
            </span>
        )}
    />
)

const UserVerification = () => {
    const otpTimeout = 60000; // 60s

    const [data, setData] = useState({
        email_otp_code: '',
        mobile_otp_code: ''
    });
    const [loadingSentEmail, setLoadingSentEmail] = useState(false);
    const [isShowEmailCoundown, setIsShowEmailCoundown] = useState(true);
    const [loadingSentMobile, setLoadingSentMobile] = useState(false);
    const [isShowMobileCoundown, setIsShowMobileCoundown] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [emailCountdownDate, setEmailCountdownDate] = useState(Date.now() + otpTimeout);
    const [mobileCountdownDate, setMobileCountdownDate] = useState(Date.now() + otpTimeout);

    const navigate = useNavigate();

    const [formRef] = Form.useForm();

    const user = useSelector(state => state.auth.authUser);

    useEffect(() => {
        if (user) {
            if (user.email_verified_at && user.mobile_verified_at) {
                navigate('/', { replace: true });
            } else {
                if (!user.email_verified_at) onSendOtpEmail();
                if (!user.mobile_verified_at) onSendOtpMobile();
            }
        } else {
            navigate('/signin', { replace: true });
        }
    }, [user]);

    const onSendOtpEmail = async () => {
        const lastSentAt = getCookie('__sob_loe');
        // to prevent auto sending when reload, check last time email was sent. 
        // if timeout more than 1 minutes, then email will be sent again.
        if (!lastSentAt) {
            try {
                setLoadingSentEmail(true);
                await sendOtpViaEmail();
                toast.success("OTP code is sent to your mail box.");
                setCookie('__sob_loe', Date.now(), 1 / (24 * 60)); // <== last time of email was sent, valid in 1 minute
            } catch (error) {
                toast.error("An error occurs. Please try again.");
            } finally {
                setLoadingSentEmail(false);
                setEmailCountdownDate(Date.now() + otpTimeout);
                setIsShowEmailCoundown(true);
            }
        } else {
            setEmailCountdownDate(Number(lastSentAt) + otpTimeout);
            setIsShowEmailCoundown(true);
        }
    }

    const onSendOtpMobile = async () => {
        const lastSentAt = getCookie('__sob_lom');
        // to prevent auto sending when reload, check last time message was sent. 
        // if timeout more than 1 minutes, then message will be sent again.
        if (!lastSentAt) {
            try {
                setLoadingSentMobile(true);
                await sendOtpViaMobile();
                toast.success("OTP code is sent to your mobile number.");
                setCookie('__sob_lom', Date.now(), 1 / (24 * 60)); // <== last time of message was sent, valid in 1 minute

            } catch (error) {
                toast.error("An error occurs. Please try again.");
            } finally {
                setLoadingSentMobile(false);
                setMobileCountdownDate(Date.now() + otpTimeout);
                setIsShowMobileCoundown(true);
            }
        } else {
            setMobileCountdownDate(Number(lastSentAt) + otpTimeout);
            setIsShowMobileCoundown(true);
        }
    }

    const onSubmit = async (formData) => {
        try {
            setLoadingSubmit(true);
            await verifyOtp(formData);
            window.location.href = '/';
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingSubmit(false);
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
                        <Progress
                            className="authentication-progress-bar"
                            percent={80} // fixed value is 80% because signup steps = 3, verification is fourth step, and success state is last step
                            size="small"
                            trailColor="#FFFFFF"
                            strokeColor="#6C5DD3"
                            showInfo={false}
                        />

                        {
                            user.email_verified_at ? (
                                <React.Fragment>
                                    <Title level={3}>Verify your mobile number</Title>
                                    <p>A verification code has been sent to your mobile number <b>{user.mobile}</b></p>
                                </React.Fragment>

                            ) : (
                                <React.Fragment>
                                    <Title level={3}>Verify your email & mobile number</Title>
                                    <p>A verification code has been sent to your email id <b>{user.email}</b> and mobile number <b>{user.mobile}</b></p>
                                </React.Fragment>
                            )
                        }
                        {/* Form */}
                        <Form
                            className="mt-32"
                            layout="vertical"
                            autoComplete="off"
                            form={formRef}
                            initialValues={data}
                            onFinish={onSubmit}
                        >
                            {
                                !user.email_verified_at ? (
                                    <Form.Item
                                        name="email_otp_code"
                                        label={
                                            <Row justify="space-between" align="middle" className="w-100">
                                                <div>Enter your email verification code</div>
                                                <div>
                                                    {
                                                        isShowEmailCoundown ? (
                                                            <CountdownTimer date={emailCountdownDate} onComplete={() => setIsShowEmailCoundown(false)} />
                                                        ) : (
                                                            <Button type="link" className="p-0" loading={loadingSentEmail} onClick={onSendOtpEmail}>Re-send</Button>
                                                        )
                                                    }
                                                </div>
                                            </Row>
                                        }
                                        rules={[{ required: true, len: 6 }]}
                                    >
                                        <Input placeholder='6 digit verification code' />
                                    </Form.Item>
                                ) : null
                            }
                            {
                                !user.mobile_verified_at ? (
                                    <Form.Item
                                        name="mobile_otp_code"
                                        label={
                                            <Row justify="space-between" align="middle" className="w-100">
                                                <div>Enter your mobile verification code</div>
                                                <div>
                                                    {
                                                        isShowMobileCoundown ? (
                                                            <CountdownTimer date={mobileCountdownDate} onComplete={() => setIsShowMobileCoundown(false)} />
                                                        ) : (
                                                            <Button type="link" className="p-0" loading={loadingSentMobile} onClick={onSendOtpMobile}>Re-send</Button>
                                                        )
                                                    }
                                                </div>
                                            </Row>
                                        }
                                        rules={[{ required: true, len: 6 }]}
                                    >
                                        <Input placeholder='6 digit verification code' />
                                    </Form.Item>
                                ) : null
                            }

                            <Button htmlType='submit' type="primary" size="large" className='w-100 mt-16' loading={loadingSubmit}>Verify</Button>
                        </Form>
                    </Card>
                </Col>
                <Col className="authentication-block--img" xs={24} sm={24} md={12} lg={12}>
                    <Title level={3}>How Step2Pay can help?</Title>
                    <p className="mt-24">We enjoy adapting our strategies to offer every client the best solutions that are at the forefront of the industry.</p>
                    <img src={authenticationImage} className="mt-24" width="80%" />
                    <div className="mt-32">Need help? We are just a click away. <a href="#">Contact Us</a></div>
                </Col>
            </Row>
        </div>
    )
}

export default UserVerification;