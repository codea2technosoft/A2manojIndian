import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from "react-router-dom";
import { Form, Row, Card, Col, Typography, Button } from 'antd';
import Loading from "components/Loading";
import { PhoneInput } from 'components/Elements';
import { setCookie } from "utils/cookie";
import regex from "utils/regex";
import { toast } from "react-toast";
// images
import logo from 'assets/images/logo_registered.png';
import authenticationImage from 'assets/images/authentication_graphic.png';
// actions
import { getAuthUserAction as getAuthUser, updateAuthUserAction as updateAuthUser } from 'redux/actions/auth';
import { getIpInfo } from "requests/common";
import { getCountries } from 'requests/country';

const { Title } = Typography;

const UserSetToken = () => {
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({});
    const [data, setData] = useState({});

    const [searchParams] = useSearchParams();
    const token = searchParams.get('access_token');

    const user = useSelector(state => state.auth.authUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            navigate('/404', { replace: true });
        }

        setCookie(process.env.REACT_APP_TOKEN_NAME, token, 1);
        setTimeout(() => {
            getCurrentUser();
        });
    }, [token]);

    useEffect(() => {
        if (user) {
            if (user.email_verified_at && user.mobile_verified_at) navigate('/', { replace: true });
            else {
                if (user.mobile) navigate('/otp-verification', { replace: true });
                else getCountriesData();
            }
        }
    }, [user]);

    const getCurrentUser = async () => {
        await dispatch(getAuthUser());
    }

    const getCountriesData = async () => {
        const initialData = {};

        const countryResponse = await getCountries({ is_paginate: 0 }); // get all countries
        setCountries(countryResponse.records);

        const ipResponse = await getIpInfo();
        if (ipResponse.data && ipResponse.data.country) {
            setSelectedCountry(ipResponse.data.country);
            initialData.country_id = ipResponse.data.country.id;
        }

        setData(initialData);
        setLoading(false);
    }

    const onSelectCountry = (country) => {
        setSelectedCountry(country);
    }

    const onSubmit = async (data) => {
        try {
            const formData = { ...data, country_id: selectedCountry.id };
            setLoadingSubmit(true);
            await dispatch(updateAuthUser(formData));
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <div>
            {
                loading ? (
                    <Loading />
                ) : (
                    <div className="authentication-container">
                        <Row className="authentication-header--wrapper" justify="space-between" align="middle">
                            <img src={logo} className="logo" alt="logo" />
                        </Row>
                        <Row className="authentication-content--wrapper" gutter={48} justify="space-between" align="middle">
                            <Col xs={24} sm={24} md={12} lg={10}>
                                <Card className="authentication-content">
                                    <Title level={3}>Update your mobile number</Title>
                                    <p>We will reach out to this phone for any account related issues.</p>
                                    {/* Form */}
                                    <Form
                                        className="mt-32"
                                        layout="vertical"
                                        autoComplete="off"
                                        initialValues={data}
                                        onFinish={onSubmit}
                                    >
                                        <Form.Item name="mobile" label="Contact number" rules={[{ required: true, pattern: regex.phone }]}>
                                            <PhoneInput
                                                placeholder='Mobile number without country code'
                                                countries={countries}
                                                defaultCountry={selectedCountry}
                                                onSelectCountry={onSelectCountry}
                                            />
                                        </Form.Item>
                                        <Button htmlType='submit' type="primary" size="large" className="w-100 mt-16" loading={loadingSubmit}>Next</Button>
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
        </div>
    )
}

export default UserSetToken;