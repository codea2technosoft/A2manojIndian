import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Form, Input, Radio, Typography, Col, Tooltip } from "antd";
import { BaseSelect } from 'components/Elements';
import regex from 'utils/regex';
import { capitalizeFirstLetter } from 'utils/common';

const { Title } = Typography;

const FormKycBusinessOverview = (props) => {
    const { formRef, defaultAcceptPayment } = props;

    const [acceptPayment, setAcceptPayment] = useState(0);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [subcategoryOptions, setSubcategoryOptions] = useState([]);

    const config = useSelector(state => state.config);

    useEffect(() => {
        setSelectedCategoryId(formRef.getFieldValue('business_category'));
    }, []);

    useEffect(() => {
        setAcceptPayment(defaultAcceptPayment);
    }, [defaultAcceptPayment]);

    useEffect(() => {
        let subcategories = [];
        const tmp = config.user_business_categories.find(item => Number(item.value) === Number(selectedCategoryId));

        if (tmp) {
            if (tmp.subcategories) {
                subcategories = tmp.subcategories.split(',');
                subcategories = subcategories.map(item => {
                    const value = item.trim();
                    const display = capitalizeFirstLetter(value.replaceAll('_', ' '));

                    return { display, value };
                })
            }
        }

        setSubcategoryOptions(subcategories);
    }, [selectedCategoryId]);

    const onChangeCategory = (value) => {
        formRef.setFieldsValue({
            business_subcategory: ''
        });

        setSelectedCategoryId(value);
    }

    return (
        <React.Fragment>
            <Title level={3}>Business Overview</Title>
            <Form.Item
                name="business_type"
                label="Business Type"
                rules={[{ required: true }]}
                tooltip={{
                    title: "Unregistered business type is for freelancers or small businesses who have not yet registered as a company. Don't choose this option if your business is already registered. Business type cannot be changedonce submitted.",
                    placement: "right"
                }}
            >
                <BaseSelect
                    options={config.user_business_types}
                    optionLabel='display'
                    optionValue='value'
                    defaultText="Select one"
                />
            </Form.Item>
            <Form.Item name="business_category" label="Business Category" rules={[{ required: true }]}>
                <BaseSelect
                    options={config.user_business_categories}
                    optionLabel='display'
                    optionValue='value'
                    defaultText="Select one"
                    onChange={onChangeCategory}
                />
            </Form.Item>
            {
                subcategoryOptions.length ? (
                    <Form.Item name="business_subcategory" label="Business Subcategory" rules={[{ required: true }]}>
                        <BaseSelect
                            options={subcategoryOptions}
                            optionLabel='display'
                            optionValue='value'
                            defaultText="Select one"
                        />
                    </Form.Item>
                ) : null
            }
            <Form.Item
                name="business_description"
                label="Business Description"
                extra="Please give a brief description of the nature of your business. Please include examples of products you sell, the business category you operate under, your customers and the channels you primarily use to conduct your business(Website, offline retail etc)."
                rules={[{ required: true, min: 50, pattern: regex.stringWithoutSpacesAtStartAndEnd }]}
            >
                <Input.TextArea placeholder='Minimum 50 characters'></Input.TextArea>
            </Form.Item>
            <Form.Item name="accept_payment" label="How do you wish to accept payments" rules={[{ required: true }]}>
                <Radio.Group onChange={(e) => setAcceptPayment(e.target.value)}>
                    <Radio value='0'>Without website/app</Radio>
                    <Radio value='1'>On my website/app</Radio>
                </Radio.Group>
            </Form.Item>
            {
                acceptPayment === '1' ? (
                    <div>
                        <Form.Item name="website_url" label="Accept payments on Website" rules={[{ required: true, type: "url" }]}>
                            <Input placeholder='Enter Website Link' />
                        </Form.Item>
                        <Form.Item name="app_url" label="Accept payments on app (optional)" rules={[{ required: false, type: "url" }]}>
                            <Input placeholder='Enter App Link' />
                        </Form.Item>

                        <div>We need to verify your website/app to provide you the live API keys. It should contain:</div>
                        <Row gutter={16}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <ul>
                                    <li className='link'>About Us</li>
                                    <li className='link'>Contact Us</li>
                                    <li className='link'>Pricing</li>
                                </ul>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <ul>
                                    <li className='link'>Privacy Policy</li>
                                    <li className='link'>Term & Conditions</li>
                                    <li className='link'>Cancellation/Refund Policy</li>
                                </ul>
                            </Col>
                        </Row>
                    </div>
                ) : null
            }
        </React.Fragment>
    )
}

export default FormKycBusinessOverview;