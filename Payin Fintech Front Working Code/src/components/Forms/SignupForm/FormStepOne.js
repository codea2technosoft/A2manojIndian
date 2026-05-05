import React from 'react';
import { Button, Form, Input, Divider, Typography } from "antd";
import FacebookButton from "components/SocialAuthenticationButtons/FacebookButton";
import GoogleButton from "components/SocialAuthenticationButtons/GoogleButton";

const { Title } = Typography;

const FormStepOne = (props) => {
    const {loading} = props;

    return (
        <React.Fragment>
            <Title level={3}>Welcome to Yumype</Title>
            <p>Sign up to create an account with us.</p>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                <Input placeholder='Enter your email ID' />
            </Form.Item>
            <Button htmlType='submit' type="primary" size="large" className="w-100 mt-16" loading={loading}>Next</Button>
            <Divider>or</Divider>
            <FacebookButton title="Signup via Facebook" />
            <GoogleButton className="mt-16" title="Signup via Google" />
        </React.Fragment>
    )
}

export default FormStepOne;