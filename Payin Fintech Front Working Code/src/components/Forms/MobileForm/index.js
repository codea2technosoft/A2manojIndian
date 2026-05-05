import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Modal, Row, Typography, Form, Button, Menu, Spin } from "antd";
import { PhoneInput } from 'components/Elements';
import regex from 'utils/regex';
// request
import { getIpInfo } from "requests/common";
import { getCountries } from 'requests/country';
import { updateAuthUserAction as updateAuthUser } from 'redux/actions/auth';
import { toast } from 'react-toast';

const MobileForm = (props) => {
    const { defaultVisible, onClose } = props;

    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const dispatch = useDispatch();

    const [form] = Form.useForm();

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
        }

        getData();
    }, []);

    const onSelectCountry = (country) => {
        setSelectedCountry(country);
    }

    const onUpdate = async (data) => {
        try {
            setLoading(true);

            if (selectedCountry) {
                const payload = {
                    ...data,
                    country_id: selectedCountry.id
                }

                await dispatch(updateAuthUser(payload));
                onClose();
            } else {
                form.setFields([
                    {
                        name: 'mobile',
                        errors: ['Please select country'],
                    },
                ]);
            }
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title="Update your mobile number"
            visible={defaultVisible}
            closable={false}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout='vertical'
                onFinish={onUpdate}
            >
                <Form.Item name="mobile" label="Update your mobile number" rules={[{ required: true, pattern: regex.phone }]}>
                    <PhoneInput
                        placeholder='Mobile number without country code'
                        countries={countries}
                        defaultCountry={selectedCountry}
                        onSelectCountry={onSelectCountry}
                    />
                </Form.Item>
                <Row justify='end'>
                    <Button type="primary" htmlType='submit' loading={loading}>Update</Button>
                </Row>
            </Form>
        </Modal>
    )
}

export default MobileForm;