import { useEffect, useState } from 'react';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Col, Row, Form, Divider, Typography, Input, Checkbox } from 'antd';
import { toast } from 'react-toast';

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
        type: 'payin',
    });
    const [loading, setLoading] = useState(false);
    const [formRef] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const isError = Number(searchParams.get('error'));
    const user = useSelector((state) => state.auth.authUser);
    useEffect(() => {
        if (isError === 1) navigate('/401', { replace: true });
    }, [isError]);
    useEffect(() => {
        if (user) {
            // check if origin path is existed or not
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
            await dispatch(login(formData));
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
                        <img src={logo} className="logo" alt="logo" />
                        <div className="authentication-block--img">
                            <img src={authenticationImage} className="mt-24" />
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={10}>
                        <Card className="authentication-content border-black">
                            <Title level={3}>Log In</Title>
                            {/* Form */}
                            <Form className="mt-32" layout="vertical" autoComplete="off" form={formRef} 
                            initialValues={data} onFinish={onSubmit}>
                                <label>Email</label>
                                <Form.Item name="email" rules={[{ required: true }]}>
                                    <Input placeholder="Email" />
                                </Form.Item>
                                <label>Password</label>
                                <Form.Item name="password" rules={[{ required: true }]}>
                                    <Input.Password placeholder="Password" />
                                </Form.Item>

                                <Form.Item label="Username" hidden={true} name="type">
                                    <Input type="text" value="payin" />
                                </Form.Item>

                                <Row justify="space-between" align="middle" >
                                    <Link to="#">Forgot your password?</Link>
                                    <Checkbox>Keep me signed in</Checkbox>
                                </Row>
                                <Button htmlType="submit" type="primary" size="large" className="w-100 mt-16"
                                 loading={loading} >Sign In</Button>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Signin;
