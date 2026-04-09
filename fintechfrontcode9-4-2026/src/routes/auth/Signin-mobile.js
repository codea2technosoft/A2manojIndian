import { useEffect, useState } from 'react';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Col, Row, Form, Divider, Typography, Input, Checkbox } from 'antd';
import { toast } from 'react-toast';
import api from 'utils/api';

// images
import logo from 'assets/images/logo.png';
import authenticationImage from 'assets/images/login yumpe.png';
// requests
import { loginAction as login } from 'redux/actions/auth';

const { Title } = Typography;

const Signin = () => {
    const [data, setData] = useState({
        username: '',
        password: '',
        otp: '',
        type: 'payin',
    });

    const [loading, setLoading] = useState(false);
    const [formRef] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [verifyOtpMode, setVerifyOtpMode] = useState(false);
    const [mobile, setmobile] = useState(null);
    const isError = Number(searchParams.get('error'));
    const user = useSelector((state) => state.auth.authUser);

    useEffect(() => {
        if (isError === 1) navigate('/401', { replace: true });
    }, [isError]);

    useEffect(() => {
        if (user) {
            let redirectPath = localStorage.getItem('originPath');
            if (!redirectPath || redirectPath.startsWith('/signin') || redirectPath.startsWith('/signup'))
                redirectPath = '/';
            if (user.status === 0) redirectPath = '/otp-verification';
            // remove origin path
            localStorage.removeItem('originPath');

            navigate(redirectPath, { replace: true });
        }
    }, [user]);

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            if (verifyOtpMode) {
                const verifyResponse = await api.post('/sendotp-merchant', {
                    otp: formData.otp,
                    mobile:mobile,
                });
                console.warn(verifyResponse);
                if (verifyResponse.status_code === '500') {
                    
                    toast.error(verifyResponse.message);
                } else {
                    console.warn(verifyResponse);
                    toast.success('OTP Verified successfully!');
                }
            } else {
                const response = await dispatch(login({
                    full_name: formData.username,
                    password: formData.password,
                }));
                console.warn(response.mobile);
                setmobile(response.mobile);
                if (response.status == true) {
                    toast.success(response.message);
                    setData({
                        full_name: formData.username,
                        password: formData.password,
                    });
                    setVerifyOtpMode(true);
                } else {
                    toast.error(response.message);
                    alert(response.message);
                    setVerifyOtpMode(false);
                }
            }
        } catch (error) {
            toast.error('An error occurs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authentication-container SignIn">
            <div className="authentication-content--wrapper">
                <Row gutter={48} justify={'space-around'}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        {/* ... (existing content) */}
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={10}>
                        <Card className="authentication-content border-black">
                            <Title level={3}>Log In</Title>
                            {/* Form */}
                            <Form
                                className="mt-32"
                                layout="vertical"
                                autoComplete="off"
                                form={formRef}
                                initialValues={data}
                                onFinish={onSubmit}
                            >
                                <label>Username</label>
                                <Form.Item
                                    name="username"
                                    rules={[
                                        { required: true, message: 'Please enter your username' },
                                    ]}
                                >
                                    <Input placeholder="Username" />
                                </Form.Item>

                                <label>Password</label>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Please enter your password' },
                                    ]}
                                >
                                    <Input.Password placeholder="Password" />
                                </Form.Item>

                                {verifyOtpMode && (
                                    <>
                                        <label>OTP</label>
                                        <Form.Item name="otp" rules={[{ required: true, message: 'Please enter the OTP' }]}>
                                            <Input placeholder="OTP" />
                                        </Form.Item>
                                    </>
                                )}

                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    size="large"
                                    className="w-100 mt-16"
                                    loading={loading}
                                >
                                    {verifyOtpMode ? 'Verify OTP' : 'Send OTP'}
                                </Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Signin;

