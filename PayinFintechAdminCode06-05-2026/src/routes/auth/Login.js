import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
// components
import { Row, Col, Form, Input, Button, Alert, Checkbox } from "antd";
// images
import loginImage from "assets/images/login.png";
import logo from "assets/images/logo_registered.png";
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
    <div className="Login_Page">
      <Row className="login-wrapper">
        <Col lg={12} md={10} sm={24} xs={24} >
        <div className="d-flex justify-content-center">

          <img src={loginImage} alt="login-bg" className="Login_Left" />
        </div>
        </Col>
        <Col lg={12} md={14} sm={24} xs={24}>
          <div className="login-form">
            {/* <div className="logoo">
              <img src={logo} className="logo login_Logo" alt="logo" />
            </div> */}
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
    </div>
  );
};

export default Login;
