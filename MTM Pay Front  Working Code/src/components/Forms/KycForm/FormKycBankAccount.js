import React from 'react';
import { Form, Input, Tooltip, Typography } from "antd";
import regex from 'utils/regex';

const { Title } = Typography;

const FormKycBankAccount = () => {
    return (
        <React.Fragment>
            <Title level={3}>Company Bank Account</Title>
            <div className='mb-24'>Enter Bank Account details of your company's bank account. Your KYC will be rejected it you enter personal bank account details.</div>
            <Form.Item
                name="beneficiary_name"
                label="Beneficiary Name"
                rules={[{ required: true }]}
                extra="We will deposit a small amount of money in your account to verify the account."
                tooltip={{
                    title: "Bank A/c Beneficlary Name should be the same as Business Pan Name.",
                    placement: "right"
                }}
            >
                <Input placeholder='Enter beneficiary name' />
            </Form.Item>
            <Form.Item name="branch_ifsc_code" label="Branch IFSC Code" rules={[{ required: true, pattern: regex.ifsc }]}>
                <Input placeholder='Enter Branch IFSC Code' />
            </Form.Item>
            <Form.Item
                name="bank_account_number"
                label="Account Number"
                rules={[{ required: true }]}
                tooltip={{
                    title: "Should be a current bank account of the company to which your payments will be settled.",
                    placement: "right"
                }}
            >
                <Input placeholder='Your Account Number' />
            </Form.Item>
        </React.Fragment>
    )
}

export default FormKycBankAccount;