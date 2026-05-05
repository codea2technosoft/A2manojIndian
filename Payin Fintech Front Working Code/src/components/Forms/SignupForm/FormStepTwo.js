import React from 'react';
import { Button, Form, Input, Typography } from "antd";

const { Title } = Typography;

const FormStepTwo = (props) => {
    const { loading, onBack } = props;

    return (
        <React.Fragment>
            <Title level={3}>Welcome to Yumype</Title>
            <p>Sign up to create an account with us.</p>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                rules={[
                    { required: true },
                    {
                        pattern: "^(?=.*[A-Za-z])(?=.*?[0-9]).{8,}$",
                        message: "Password must contains at least 8 character, includes at least 1 letter and 1 number"
                    }
                ]}
            >
                <Input.Password placeholder='Min 8 characters, 1 letter, 1 number' autoComplete='off' />
            </Form.Item>
            <Button htmlType='submit' type="primary" size="large" className="w-100 mt-16" loading={loading}>Next</Button>
            <div className="mt-16">
                <div className='link' onClick={onBack}>Use another signup option</div>
            </div>
        </React.Fragment>
    )
}

export default FormStepTwo;