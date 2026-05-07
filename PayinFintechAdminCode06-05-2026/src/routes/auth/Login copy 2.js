import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
// components
import { Row, Col, Form, Input, Button, Alert, Checkbox } from "antd";
// images
import { CiMail } from "react-icons/ci";
import { IoCall } from "react-icons/io5";

// images
// import authenticationImage from 'assets/images/login yumpe.png';
import loginImage from "assets/images/login.png";
import logo from "assets/images/logo.png";
// actions
import { loginAction as login } from "redux/actions/auth";
import { getConfigAction as getConfig } from "redux/actions/config";

const Login = () => {
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const authUser = useSelector((state) => state.auth.authUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authUser) {
      const from = location.state?.from?.pathname || "/";

      dispatch(getConfig());
      // redirect to home
      navigate(from, { replace: true });
    }
  }, [authUser]);

  const onSubmit = async (data) => {
    try {
      setIsError(false);
      setLoading(true);
      await dispatch(login(data));
      setLoading(false);
    } catch (err) {
      setIsError(true);
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
                                        <h2>Login</h2>
                                        <div className='titlelogin'>Login to your Merchant Dashboard Account</div>
                                    </div>
                                    {/* Form */}
                                 {isError ? (
              <Alert
                message="Email or password is incorrect. Please try again."
                type="error"
              />
            ) : null}
            <Form layout="vertical" onFinish={onSubmit}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input className="login-form--input" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true }]}
              >
                <Input.Password className="login-form--input" />
              </Form.Item>
              <Row justify="space-between" align="middle" className="mb-16">
                <Link to="#">Forgot your password?</Link>
                <Checkbox>Keep me signed in</Checkbox>
              </Row>
              <Button
                htmlType="submit"
                type="primary"
                className="login-form--button"
                loading={loading}
              >
                Login
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
    {/* <div className="Login_Page">
      <Row className="login-wrapper">
        <Col lg={12} md={10} sm={24} xs={24} >
        <div className="d-flex justify-content-center">

          <img src={loginImage} alt="login-bg" className="Login_Left" />
        </div>
        </Col>
        <Col lg={12} md={14} sm={24} xs={24}>
          <div className="login-form">
           
            <h1>Login</h1>
            {isError ? (
              <Alert
                message="Email or password is incorrect. Please try again."
                type="error"
              />
            ) : null}
            <Form layout="vertical" onFinish={onSubmit}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input className="login-form--input" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true }]}
              >
                <Input.Password className="login-form--input" />
              </Form.Item>
              <Row justify="space-between" align="middle" className="mb-16">
                <Link to="#">Forgot your password?</Link>
                <Checkbox>Keep me signed in</Checkbox>
              </Row>
              <Button
                htmlType="submit"
                type="primary"
                className="login-form--button"
                loading={loading}
              >
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div> */}
    </>
  );
};

export default Login;
