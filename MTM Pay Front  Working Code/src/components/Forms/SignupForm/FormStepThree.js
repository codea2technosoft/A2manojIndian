import React, { useState } from 'react';
import { Button, Form, Input, Col, Row, Typography } from "antd";
import { PhoneInput } from 'components/Elements';
import regex from 'utils/regex';

const { Title } = Typography;

const FormStepThree = (props) => {
    const { loading, countries, defaultCountry, onSelectCountry, onBack } = props;
    const [showCouponInput, setShowCouponInput] = useState(false);

    return (
        <React.Fragment>
            <Title level={3}>Your contact details</Title>
            <Form.Item name="full_name" label="Name" rules={[{ required: true }]}>
                <Input placeholder='Enter name' />
            </Form.Item>
            <Form.Item name="mobile" label="Contact number" rules={[{ required: true, pattern: regex.phone }]}>
                <PhoneInput 
                    placeholder='Mobile number without country code' 
                    countries={countries} 
                    defaultCountry={defaultCountry}
                    onSelectCountry={onSelectCountry} 
                />
            </Form.Item>
            {
                showCouponInput ? (
                    <Form.Item name="coupon_code" label="Coupon code">
                        <Input placeholder='Enter coupon code' />
                    </Form.Item>
                ) : (
                    <div className='link' onClick={() => setShowCouponInput(true)}>Got a coupon code?</div>
                )
            }
            <Row className='mt-16' justify='space-between' gutter={24}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Button type="default" size="large" className='w-100' onClick={onBack}>Back</Button>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Button htmlType='submit' type="primary" size="large" className='w-100' loading={loading}>Next</Button>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default FormStepThree;