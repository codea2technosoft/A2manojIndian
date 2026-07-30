// import { useEffect, useState } from 'react';
// import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { Button, Card, Col, Row, Form, Divider, Typography, Input, Checkbox } from 'antd';
// import { toast } from 'react-toast';
// import api from 'utils/api';
// import { CiMail } from "react-icons/ci";
// import { IoCall } from "react-icons/io5";

// // images
// import logo from 'assets/images/logo.png';
// import authenticationImage from 'assets/images/login yumpe.png';
// // requests
// import { loginAction as login } from 'redux/actions/auth';

// const { Title } = Typography;

// const Signin = () => {
//     const [data, setData] = useState({
//         email: '',
//         password: '',
//         otp: '',
//         type: 'payin',
//     });

//     const [loading, setLoading] = useState(false);
//     const [formRef] = Form.useForm();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const [searchParams] = useSearchParams();
//     const [verifyOtpMode, setVerifyOtpMode] = useState(false);
//     const [mobile, setmobile] = useState(null);
//     const [mobileMSG, setMobileMSG] = useState(null);
//     const isError = Number(searchParams.get('error'));
//     const user = useSelector((state) => state.auth.authUser);

//     useEffect(() => {
//         if (isError === 1) navigate('/401', { replace: true });
//     }, [isError]);

//     useEffect(() => {
//         if (user) {
//             let redirectPath = localStorage.getItem('originPath');
//             if (!redirectPath || redirectPath.startsWith('/signin') || redirectPath.startsWith('/signup'))
//                 redirectPath = '/';
//             if (user.status === 0) redirectPath = '/otp-verification';
//             // remove origin path
//             localStorage.removeItem('originPath');

//             navigate(redirectPath, { replace: true });
//         }
//     }, [user]);

//     const onSubmit = async (formData) => {
//         try {
//             setLoading(true);
//             if (verifyOtpMode) {
//                 const verifyResponse = await dispatch(login({
//                     otp: formData.otp,
//                     mobile: mobile,
//                 }));
//                 console.warn(verifyResponse.status_code);
//                 if (verifyResponse.status_code == '500') {
//                     toast.error(verifyResponse.message);
//                 } else {
//                     console.warn(verifyResponse);
//                     toast.success('OTP Verified successfully!');
//                 }
//             } else {
//                 const response = await api.post('/login-merchant', {
//                     email: formData.email,
//                     password: formData.password,
//                 });
//                 console.warn(response.data);
//                 setmobile(response.data.mobile);
//                 setMobileMSG(response.data.mobilenumber);
//                 if (response.data.status == true) {
//                     toast.success(response.data.message);
//                     setData({
//                         email: formData.email,
//                         password: formData.password,
//                     });
//                     setVerifyOtpMode(true);
//                 } else {
//                     toast.error(response.data.message);
//                     setVerifyOtpMode(false);
//                 }
//             }
//         } catch (error) {
//             toast.error('An error occurs. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <div className='container-fluid p-0 overflow-hidden'>
//                 <div className="row login_container">
//                     <div className='col-md-5 bg-dark'>
//                         <div className=''>
//                             <div className='login_content'>
//                                 <div className='logo_new'>
//                                     <img src={logo} className="" alt="logo" />
//                                 </div>
//                                 <div className='image_login'>
//                                     <img src="https://partner.sabpaisa.in/static/media/login-banner.06a6f096c49a5e6f84c00927fc5c0da9.svg" />
//                                 </div>
//                                 <div className='text-center logindashboard'>
//                                     <h2 className='text-white'>Login to Your Dashboard</h2>
//                                     <p className='text-white'>One Payment Gateway for all your needs</p>
//                                     <div className='need_call align-items-center justify-content-center d-flex'>
//                                         <span className='line_design'></span>
//                                         <p className='text-white'>Need help? Contact us</p>
//                                         <span className='line_design'></span>
//                                     </div>
//                                     <div className='need_call align-items-center justify-content-center d-flex'>
//                                         <div className='contect_design d-flex align-items-center'>
//                                             <div className='iconlogin'>
//                                                 <CiMail />
//                                             </div>
//                                             <span className='text-white'>sales@payinfintech.com</span>
//                                         </div>
//                                         {/* <div className='contect_design d-flex align-items-center'>
//                                             <div className='iconlogin'>
//                                                 <IoCall />
//                                             </div>
//                                             <span className='text-white'>9999999999</span>
//                                         </div> */}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className='col-md-7 d-flex align-items-center bg-white bg-image position-relative'>

//                         <div className='row align-items-start flex-grow-1'>
//                             <div className='logotop d-block d-md-none'>
//                                 <div className='logo_new '>
//                                     <img src={logo} className="" alt="logo" />
//                                 </div>
//                             </div>
//                             <div className='col-lg-3 col-md-2 col-sm-2 col-1'></div>
//                             <div className='col-lg-6'>

//                                 <div className='form_login'>
//                                     <div className='text-center'>
//                                         <Title level={3}>Login</Title>
//                                         <div className='titlelogin'>Login to your Merchant Dashboard Account</div>
//                                     </div>
//                                     {/* Form */}
//                                     <Form
//                                         className="mt-32"
//                                         layout="vertical"
//                                         autoComplete="off"
//                                         form={formRef}
//                                         initialValues={data}
//                                         onFinish={onSubmit}
//                                     >
//                                         <label>Username</label>
//                                         <Form.Item
//                                             name="email"
//                                             rules={[
//                                                 { required: true, message: 'Please enter your username' },
//                                             ]}
//                                         >
//                                             <Input placeholder="Username" />
//                                         </Form.Item>

//                                         <label>Password</label>
//                                         <Form.Item
//                                             name="password"
//                                             rules={[
//                                                 { required: true, message: 'Please enter your password' },
//                                             ]}
//                                         >
//                                             <Input.Password placeholder="Password" />
//                                         </Form.Item>

//                                         {verifyOtpMode && (
//                                             <>
//                                                 <label>OTP</label>
//                                                 <Form.Item className="inputdesignall" name="otp" rules={[{ required: true, message: 'Please enter the OTP' }]}>
//                                                     <Input placeholder="OTP" />
//                                                 </Form.Item>
//                                                 <p style={{ color: "red" }}>Note:{mobileMSG}</p>
//                                             </>
//                                         )}

//                                         <Button
//                                             style={{
//                                                 background: '#01cc61',
//                                                 borderColor: 'white',

//                                             }}
//                                             htmlType="submit"
//                                             type="primary"
//                                             size="large"
//                                             className="w-100 mt-16"
//                                             loading={loading}
//                                         >
//                                             {verifyOtpMode ? 'Verify OTP' : 'Send OTP'}
//                                         </Button>
//                                     </Form>
//                                     <div className='text-center dontaccount mt-4'>
//                                         <h3>Don’t have an account with Payinfintech</h3>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='col-lg-3 col-md-2 col-sm-2 col-1'></div>

//                         </div>
//                         {/* <div className='footer_login'>
//                                 <h3>Copyright @ 2025 Payinfintech All Rights Reserved version 1.0</h3>
//                             </div> */}

//                     </div>


//                 </div>
//             </div>
//             {/* <div className="authentication-container SignIn">
//                 <div className="authentication-content--wrapper">
//                     <Row gutter={48} justify={'space-around'}>
//                         <Col xs={24} sm={24} md={12} lg={12}>
//                             <div className="authentication-block--img">
//                                 <img src={authenticationImage} className="" />
//                             </div>
//                         </Col>
//                         <Col xs={24} sm={24} md={12} lg={10}>
//                             <Card className="authentication-content border-black">
//                                 <Title level={3}>Log In</Title>
//                                 <Form
//                                     className="mt-32"
//                                     layout="vertical"
//                                     autoComplete="off"
//                                     form={formRef}
//                                     initialValues={data}
//                                     onFinish={onSubmit}
//                                 >
//                                     <label>Username</label>
//                                     <Form.Item
//                                         name="email"
//                                         rules={[
//                                             { required: true, message: 'Please enter your username' },
//                                         ]}
//                                     >
//                                         <Input placeholder="Username" />
//                                     </Form.Item>

//                                     <label>Password</label>
//                                     <Form.Item
//                                         name="password"
//                                         rules={[
//                                             { required: true, message: 'Please enter your password' },
//                                         ]}
//                                     >
//                                         <Input.Password placeholder="Password" />
//                                     </Form.Item>

//                                     {verifyOtpMode && (
//                                         <>
//                                             <label>OTP</label>
//                                             <Form.Item name="otp" rules={[{ required: true, message: 'Please enter the OTP' }]}>
//                                                 <Input placeholder="OTP" />
//                                             </Form.Item>
//                                             <p style={{ color: "red" }}>Note:{mobileMSG}</p>
//                                         </>
//                                     )}

//                                     <Button
//                                         style={{
//                                             background: '#01cc61',
//                                             borderColor: 'white',

//                                         }}
//                                         htmlType="submit"
//                                         type="primary"
//                                         size="large"
//                                         className="w-100 mt-16"
//                                         loading={loading}
//                                     >
//                                         {verifyOtpMode ? 'Verify OTP' : 'Send OTP'}
//                                     </Button>
//                                 </Form>
//                             </Card>
//                         </Col>
//                     </Row>
//                 </div>
//             </div> */}
//         </>
//     );
// };

// export default Signin;




import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, Typography, Input, Modal } from 'antd';
import { toast } from 'react-toast';
import api from 'utils/api';
import { CiMail } from "react-icons/ci";

import logo from 'assets/images/logo.png';
import { loginAction as login } from 'redux/actions/auth';

const { Title } = Typography;

const Signin = () => {
    const [data, setData] = useState({
        email: '',
        password: '',
        otp: '',
        type: 'payin',
        latitude: null,
        longitude: null,
        device_type: '',
        device_name: '',
        browser: '',
        browser_version: '',
        os: '',
        os_version: '',
        screen_width: null,
        screen_height: null,
        user_agent: '',
        is_mobile: false,
        is_tablet: false,
        is_desktop: false,
    });

    const [loading, setLoading] = useState(false);
    const [formRef] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const [verifyOtpMode, setVerifyOtpMode] = useState(false);
    const [mobile, setmobile] = useState(null);
    const [mobileMSG, setMobileMSG] = useState(null);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const isError = Number(searchParams.get('error'));
    const user = useSelector((state) => state.auth.authUser);

    const getDeviceDetails = () => {
        const userAgent = navigator.userAgent;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent) || (screenWidth >= 768 && screenWidth <= 1024);
        const isDesktop = !isMobile && !isTablet;

        let browser = 'Unknown';
        let browserVersion = 'Unknown';
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) {
            browser = 'Chrome';
            const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        } else if (userAgent.indexOf('Firefox') > -1) {
            browser = 'Firefox';
            const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            browser = 'Safari';
            const match = userAgent.match(/Version\/(\d+\.\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        } else if (userAgent.indexOf('Edg') > -1) {
            browser = 'Edge';
            const match = userAgent.match(/Edg\/(\d+\.\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
            browser = 'Opera';
            const match = userAgent.match(/Opera\/(\d+\.\d+)/) || userAgent.match(/OPR\/(\d+\.\d+)/);
            browserVersion = match ? match[1] : 'Unknown';
        }

        let os = 'Unknown';
        let osVersion = 'Unknown';
        if (userAgent.indexOf('Windows') > -1) {
            os = 'Windows';
            const match = userAgent.match(/Windows NT (\d+\.\d+)/);
            if (match) {
                const versionMap = {
                    '10.0': '10/11',
                    '6.3': '8.1',
                    '6.2': '8',
                    '6.1': '7',
                    '6.0': 'Vista',
                    '5.1': 'XP'
                };
                osVersion = versionMap[match[1]] || match[1];
            }
        } else if (userAgent.indexOf('Mac OS X') > -1) {
            os = 'macOS';
            const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
            if (match) {
                const versionMap = {
                    '10.15': 'Catalina',
                    '10.14': 'Mojave',
                    '10.13': 'High Sierra',
                    '10.12': 'Sierra',
                    '10.11': 'El Capitan',
                    '10.10': 'Yosemite'
                };
                osVersion = versionMap[match[1].replace('_', '.')] || match[1].replace('_', '.');
            }
        } else if (userAgent.indexOf('Android') > -1) {
            os = 'Android';
            const match = userAgent.match(/Android (\d+\.\d+)/);
            osVersion = match ? match[1] : 'Unknown';
        } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
            os = 'iOS';
            const match = userAgent.match(/OS (\d+[._]\d+)/);
            osVersion = match ? match[1].replace('_', '.') : 'Unknown';
        } else if (userAgent.indexOf('Linux') > -1) {
            os = 'Linux';
            osVersion = 'Unknown';
        }

        let deviceName = 'Unknown';
        if (isMobile) {
            const match = userAgent.match(/\((.*?)\)/);
            if (match) {
                const parts = match[1].split(';');
                for (let part of parts) {
                    if (part.trim().match(/[A-Z][a-z]+/)) {
                        deviceName = part.trim();
                        break;
                    }
                }
            }
        } else if (isTablet) {
            deviceName = 'Tablet';
        } else {
            deviceName = 'Desktop Computer';
        }

        return {
            device_type: isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop',
            device_name: deviceName,
            browser: browser,
            browser_version: browserVersion,
            os: os,
            os_version: osVersion,
            screen_width: screenWidth,
            screen_height: screenHeight,
            user_agent: userAgent,
            is_mobile: isMobile,
            is_tablet: isTablet,
            is_desktop: isDesktop,
        };
    };

    // 🔥 SIMPLE: Get current location - Fast and reliable
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    };

    useEffect(() => {
        if (isError === 1) navigate('/401', { replace: true });
    }, [isError]);

    useEffect(() => {
        if (user) {
            let redirectPath = localStorage.getItem('originPath');
            if (!redirectPath || redirectPath.startsWith('/signin') || redirectPath.startsWith('/signup'))
                redirectPath = '/';
            if (user.status === 0) redirectPath = '/otp-verification';
            localStorage.removeItem('originPath');
            navigate(redirectPath, { replace: true });
        }
    }, [user]);

    // 🔥 On mount - try to get location silently
    useEffect(() => {
        const init = async () => {
            const deviceDetails = getDeviceDetails();
            setData(prev => ({ ...prev, ...deviceDetails }));

            // Try to get location silently
            try {
                const location = await getCurrentLocation();
                setData(prev => ({
                    ...prev,
                    latitude: location.latitude,
                    longitude: location.longitude,
                }));
                setLocationEnabled(true);
                console.log('✅ Location detected on mount');
            } catch (error) {
                console.log('⏳ Location not available on mount');
                setLocationEnabled(false);
            }
        };
        init();
    }, []);

    // 🔥 Enable Location function - for modal button
    const enableLocation = async () => {
        setShowLocationModal(false);
        try {
            const location = await getCurrentLocation();
            setData(prev => ({
                ...prev,
                latitude: location.latitude,
                longitude: location.longitude,
            }));
            setLocationEnabled(true);
            toast.success('✅ Location enabled!');
            return true;
        } catch (error) {
            console.error('❌ Location error:', error);
            if (error.code === 1) {
                toast.warn('⚠️ Please allow location in browser popup');
            } else {
                toast.warn('⚠️ Unable to get location. Please try again.');
            }
            return false;
        }
    };

    const onSubmit = async (formData) => {
        console.log('🔵 Submit clicked');

        // 🔥 Check if we already have location
        if (!data.latitude || !data.longitude || data.latitude === 0) {
            console.log('🟡 No location found, trying to get...');

            // Try to get location
            try {
                const location = await getCurrentLocation();
                setData(prev => ({
                    ...prev,
                    latitude: location.latitude,
                    longitude: location.longitude,
                }));
                setLocationEnabled(true);
                console.log('✅ Location fetched on submit');
            } catch (error) {
                console.log('❌ Location error on submit:', error);
                setShowLocationModal(true);
                return;
            }
        }

        // 🔥 Double check location
        if (!data.latitude || !data.longitude || data.latitude === 0) {
            console.log('🔴 No location after fetch, showing modal');
            setShowLocationModal(true);
            return;
        }

        // 🔥 Start loading
        setLoading(true);

        try {
            const deviceDetails = getDeviceDetails();

            const locationData = {
                latitude: data.latitude,
                longitude: data.longitude,
            };

            console.log('📤 Sending with location:', locationData);

            if (verifyOtpMode) {
                const verifyResponse = await dispatch(login({
                    otp: formData.otp,
                    mobile: mobile,
                    latitude: locationData.latitude || 0,
                    longitude: locationData.longitude || 0,
                    type: 'payin',
                    device_type: deviceDetails.device_type,
                    device_name: deviceDetails.device_name,
                    browser: deviceDetails.browser,
                    browser_version: deviceDetails.browser_version,
                    os: deviceDetails.os,
                    os_version: deviceDetails.os_version,
                    screen_width: deviceDetails.screen_width,
                    screen_height: deviceDetails.screen_height,
                    user_agent: deviceDetails.user_agent,
                    is_mobile: deviceDetails.is_mobile,
                    is_tablet: deviceDetails.is_tablet,
                    is_desktop: deviceDetails.is_desktop,
                }));
                if (verifyResponse.status_code == '500') {
                    toast.error(verifyResponse.message);
                } else {
                    toast.success('OTP Verified successfully!');
                }
            } else {
                const response = await api.post('/login-merchant', {
                    email: formData.email,
                    password: formData.password,
                    latitude: locationData.latitude || 0,
                    longitude: locationData.longitude || 0,
                    type: 'payin',
                    device_type: deviceDetails.device_type,
                    device_name: deviceDetails.device_name,
                    browser: deviceDetails.browser,
                    browser_version: deviceDetails.browser_version,
                    os: deviceDetails.os,
                    os_version: deviceDetails.os_version,
                    screen_width: deviceDetails.screen_width,
                    screen_height: deviceDetails.screen_height,
                    user_agent: deviceDetails.user_agent,
                    is_mobile: deviceDetails.is_mobile,
                    is_tablet: deviceDetails.is_tablet,
                    is_desktop: deviceDetails.is_desktop,
                });
                setmobile(response.data.mobile);
                setMobileMSG(response.data.mobilenumber);
                if (response.data.status == true) {
                    toast.success(response.data.message);
                    setData({
                        email: formData.email,
                        password: formData.password,
                        otp: '',
                        type: 'payin',
                        latitude: locationData.latitude || 0,
                        longitude: locationData.longitude || 0,
                        ...deviceDetails,
                    });
                    setVerifyOtpMode(true);
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            console.error('❌ Error:', error);
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
                        <div className='login_content'>
                            <div className='logo_new'>
                                <img src={logo} className="" alt="logo" />
                            </div>
                            <div className='image_login'>
                                <img src="https://partner.sabpaisa.in/static/media/login-banner.06a6f096c49a5e6f84c00927fc5c0da9.svg" alt="login banner" />
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-7 d-flex align-items-center bg-white bg-image position-relative'>
                        <div className='row align-items-start flex-grow-1'>
                            <div className='logotop d-block d-md-none'>
                                <div className='logo_new'>
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
                                            rules={[{ required: true, message: 'Please enter your username' }]}
                                        >
                                            <Input placeholder="Username" />
                                        </Form.Item>

                                        <label>Password</label>
                                        <Form.Item
                                            name="password"
                                            rules={[{ required: true, message: 'Please enter your password' }]}
                                        >
                                            <Input.Password placeholder="Password" />
                                        </Form.Item>

                                        {verifyOtpMode && (
                                            <>
                                                <label>OTP</label>
                                                <Form.Item name="otp" rules={[{ required: true, message: 'Please enter the OTP' }]}>
                                                    <Input placeholder="OTP" />
                                                </Form.Item>
                                                <p style={{ color: "red" }}>Note: {mobileMSG}</p>
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
                    </div>
                </div>
            </div>

            {/* 🔥 Location Required Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '28px' }}>📍</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Location Required</span>
                    </div>
                }
                open={showLocationModal}
                onCancel={() => setShowLocationModal(false)}
                footer={null}
                centered
                width={420}
            >
                <div style={{ padding: '10px 0' }}>
                    <p style={{ fontSize: '15px', color: '#333', marginBottom: '15px' }}>
                        Please enable location access to continue.
                    </p>

                    <div style={{
                        background: '#f8f9fa',
                        padding: '12px 15px',
                        borderRadius: '6px',
                        marginBottom: '15px'
                    }}>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                            <b>Step 1:</b> Click <b>"Enable Location"</b> below
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                            <b>Step 2:</b> Select <b>"Allow"</b> in browser popup
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>
                            <b>Step 3:</b> Come back and click <b>"Send OTP"</b> again
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        {/* <Button
                            type="primary"
                            style={{
                                background: '#01cc61',
                                borderColor: '#01cc61',
                                padding: '0 30px',
                                height: '40px',
                                fontSize: '15px',
                                fontWeight: 'bold'
                            }}
                            onClick={async () => {
                                const enabled = await enableLocation();
                                if (enabled) {
                                    setShowLocationModal(false);
                                }
                            }}
                        >
                            🌍 Enable Location
                        </Button> */}

                        <Button
                            type="primary"
                            style={{
                                background: '#01cc61',
                                borderColor: '#01cc61',
                                padding: '0 30px',
                                height: '40px',
                                fontSize: '15px',
                                fontWeight: 'bold'
                            }}
                            onClick={async () => {
                                // 🔥 First try to enable location
                                const enabled = await enableLocation();
                                if (enabled) {
                                    setShowLocationModal(false);
                                } else {
                                    // 🔥 If not enabled, reload page to trigger popup again
                                    toast.info('🔄 Refreshing page to enable location...');
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 500);
                                }
                            }}
                        >
                            🌍 Enable Location
                        </Button>

                        {/* <Button
                            style={{
                                borderColor: '#6c757d',
                                color: '#6c757d',
                                height: '40px'
                            }}
                            onClick={() => setShowLocationModal(false)}
                        >
                            Cancel
                        </Button> */}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Signin;