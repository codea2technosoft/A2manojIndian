import { useEffect, useState } from 'react';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Col, Row, Form, Divider, Typography, Input, Checkbox } from 'antd';
import { toast } from 'react-toast';
import api from 'utils/api';
import { CiMail } from "react-icons/ci";
import { IoCall } from "react-icons/io5";

// images
import logo from 'assets/images/logo.png';
import authenticationImage from 'assets/images/login yumpe.png';
// requests
import { loginAction as login } from 'redux/actions/auth';

const { Title } = Typography;

const Signin = () => {
    const [data, setData] = useState({
        email: '',
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
    const [mobileMSG, setMobileMSG] = useState(null);
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
                const verifyResponse = await dispatch(login({
                    otp: formData.otp,
                    mobile: mobile,
                }));
                console.warn(verifyResponse.status_code);
                if (verifyResponse.status_code == '500') {
                    toast.error(verifyResponse.message);
                } else {
                    console.warn(verifyResponse);
                    toast.success('OTP Verified successfully!');
                }
            } else {
                const response = await api.post('/login-merchant', {
                    email: formData.email,
                    password: formData.password,
                });
                console.warn(response.data);
                setmobile(response.data.mobile);
                setMobileMSG(response.data.mobilenumber);
                if (response.data.status == true) {
                    toast.success(response.data.message);
                    setData({
                        email: formData.email,
                        password: formData.password,
                    });
                    setVerifyOtpMode(true);
                } else {
                    toast.error(response.data.message);
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
        <>
            <div className='container-fluid p-0 overflow-hidden'>
                <div className="row login_container">
                    <div className='col-md-5 bg-dark'>
                        <div className=''>
                            <div className='login_content'>
                                <div className='logo_new'>
                                    <img src={logo} className="" alt="logo" />
                                </div>
                                <div className='image_login'>
                                    <img src="https://partner.sabpaisa.in/static/media/login-banner.06a6f096c49a5e6f84c00927fc5c0da9.svg" />
                                </div>
                                <div className='text-center logindashboard'>
                                    <h2 className='text-white'>Login to Your Dashboard</h2>
                                    <p className='text-white'>One Payment Gateway for all your needs</p>
                                    <div className='need_call align-items-center justify-content-center d-flex'>
                                        <span className='line_design'></span>
                                        <p className='text-white'>Need help? Contact us</p>
                                        <span className='line_design'></span>
                                    </div>
                                    <div className='need_call align-items-center justify-content-center d-flex'>
                                        <div className='contect_design d-flex align-items-center'>
                                            <div className='iconlogin'>
                                                <CiMail />
                                            </div>
                                            <span className='text-white'>sales@payinfintech.com</span>
                                        </div>
                                        {/* <div className='contect_design d-flex align-items-center'>
                                            <div className='iconlogin'>
                                                <IoCall />
                                            </div>
                                            <span className='text-white'>9999999999</span>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-7 d-flex align-items-center bg-white bg-image position-relative'>
                        
                        <div className='row align-items-start flex-grow-1'>
                            <div className='logotop d-block d-md-none'>
                                <div className='logo_new '>
                                    <img src={logo} className="" alt="logo" />
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-2 col-sm-2 col-1'></div>
                            <div className='col-lg-6'>
                                  
                                <div className='form_login'>
                                    <div className='text-center'>
                                        <Title level={3}>Login</Title>
                                        <div className='titlelogin'>Login to your Merchant Dashboard Account</div>
                                    </div>
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
                                            name="email"
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
                                                <Form.Item className="inputdesignall" name="otp" rules={[{ required: true, message: 'Please enter the OTP' }]}>
                                                    <Input placeholder="OTP" />
                                                </Form.Item>
                                                <p style={{ color: "red" }}>Note:{mobileMSG}</p>
                                            </>
                                        )}

                                        <Button
                                            style={{
                                                background: '#01cc61',
                                                borderColor: 'white',

                                            }}
                                            htmlType="submit"
                                            type="primary"
                                            size="large"
                                            className="w-100 mt-16"
                                            loading={loading}
                                        >
                                            {verifyOtpMode ? 'Verify OTP' : 'Send OTP'}
                                        </Button>
                                    </Form>
                                    <div className='text-center dontaccount mt-4'>
                                        <h3>Don’t have an account with Payinfintech</h3>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-3 col-md-2 col-sm-2 col-1'></div>
                          
                        </div>
                        {/* <div className='footer_login'>
                                <h3>Copyright @ 2025 Payinfintech All Rights Reserved version 1.0</h3>
                            </div> */}

                    </div>


                </div>
            </div>
            {/* <div className="authentication-container SignIn">
                <div className="authentication-content--wrapper">
                    <Row gutter={48} justify={'space-around'}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <div className="authentication-block--img">
                                <img src={authenticationImage} className="" />
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={10}>
                            <Card className="authentication-content border-black">
                                <Title level={3}>Log In</Title>
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
                                        name="email"
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
                                            <p style={{ color: "red" }}>Note:{mobileMSG}</p>
                                        </>
                                    )}

                                    <Button
                                        style={{
                                            background: '#01cc61',
                                            borderColor: 'white',

                                        }}
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
            </div> */}
        </>
    );
};

export default Signin;

