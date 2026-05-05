import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Button, Card, Col, Row, Form, Progress, Typography } from 'antd';
import { FormStepOne, FormStepTwo, FormStepThree } from 'components/Forms/SignupForm';
import { toast } from 'react-toast';
// images
import logo from 'assets/images/logo.png';
import authenticationImage from 'assets/images/authentication_graphic.png';
// requests
import { checkEmailExisted } from 'requests/auth';
import { getCountries } from 'requests/country';
import { getIpInfo } from 'requests/common';
import { registerAction as register } from 'redux/actions/auth';

const { Title } = Typography;
const signupSteps = 4;

const Signup = () => {
    const [data, setData] = useState({
        email: '',
        password: '',
        full_name: '',
        mobile: '',
        coupon_code: '',
        country_id: '',
    });
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [formRef] = Form.useForm();

    const user = useSelector((state) => state.auth.authUser);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getCountries({ is_paginate: 0 }); // get all countries
                const ipResponse = await getIpInfo();

                setCountries(response.records);
                if (ipResponse.data && ipResponse.data.country) {
                    setSelectedCountry(ipResponse.data.country);
                }
            } catch (error) {
                console.log(error);
            }
        };

        getData();
    }, []);

    const renderFormStep = () => {
        switch (step) {
            case 1:
                return <FormStepOne loading={loading} />;
            case 2:
                return <FormStepTwo loading={loading} onBack={goPreviousStep} />;
            case 3:
                return (
                    <FormStepThree
                        loading={loading}
                        countries={countries}
                        defaultCountry={selectedCountry}
                        onSelectCountry={onSelectCountry}
                        onBack={goPreviousStep}
                    />
                );
            default:
                return null;
        }
    };

    const onSelectCountry = (country) => {
        console.log(country);
        setSelectedCountry(country);
    };

    const goNextStep = async () => {
        formRef.validateFields().then(async (formData) => {
            try {
                setLoading(true);

                const newData = {
                    ...data,
                    ...formData,
                    country_id: selectedCountry ? selectedCountry.id : '',
                };
                // update global form data
                setData(newData);

                if (step === 1) {
                    // check email exist
                    const response = await checkEmailExisted(formData.email);

                    if (response.is_existed) {
                        toast.error('Email is existed.');
                        return;
                    }
                } else if (step === 3) {
                    if (!selectedCountry) {
                        formRef.setFields([
                            {
                                name: 'mobile',
                                errors: ['You have to choose country'],
                            },
                        ]);

                        return;
                    }
                    // create new account
                    // // attach country code to mobile
                    // newData.mobile = `${selectedCountry.mobile_code}${newData.mobile}`
                    await dispatch(register(newData));
                    navigate('/otp-verification', { replace: true });
                }

                if (step < 3) setStep(step + 1);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        });
    };

    const goPreviousStep = () => {
        setStep(step - 1);
    };

    if (user) return <Navigate to="/" replace />;

    return (
        <div className="authentication-container">
            <Row className="authentication-header--wrapper" justify="space-between" align="middle">
                <img src={logo} className="logo" alt="logo" />
                <div className='d-flex'>
                    <span className="mr-24">Already a user?</span>
                    <Link to="/signin">
                        <Button type="primary" size="large">
                            Signin
                        </Button>
                    </Link>
                </div>
            </Row>
            <Row className="authentication-content--wrapper signup" gutter={48} justify="space-between" align="middle">
                <Col xs={24} sm={24} md={12} lg={10}>
                    <Card className="authentication-content">
                        <Progress
                            className="authentication-progress-bar"
                            percent={((step - 1) / signupSteps) * 100}
                            size="small"
                            trailColor="#FFFFFF"
                            strokeColor="#6C5DD3"
                            showInfo={false}
                        />
                        {/* Form */}
                        <Form
                            className="mt-32"
                            layout="vertical"
                            autoComplete="off"
                            form={formRef}
                            initialValues={data}
                            onFinish={goNextStep}
                        >
                            {renderFormStep()}
                        </Form>
                    </Card>
                </Col>
                <Col className="authentication-block--img" xs={24} sm={24} md={12} lg={12}>
                    {/* <Title level={3}>How Yumype can help?</Title>
                    <p className="mt-24">
                        We enjoy adapting our strategies to offer every client the best solutions that are at the
                        forefront of the industry.
                    </p> */}
                    <img src={authenticationImage} className="mt-24" width="80%" />
                    {/* <div className="mt-32">
                        Need help? We are just a click away. <a href="#">Contact Us</a>
                    </div> */}
                </Col>
            </Row>
        </div>
    );
};

export default Signup;
