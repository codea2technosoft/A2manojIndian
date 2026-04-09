import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Typography, Row, Col, Form, Button, Input, Modal, message } from 'antd';
import PageTitle from 'components/PageTitle';
import { BaseSelect } from 'components/Elements';
import api from 'utils/api';
const CreatePayoutsBeneficiaryAccountForm = ({ users, visible, onClose, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('bank_account');
    const [accountNumberValid, setAccountNumberValid] = useState(false);
    const typeOptions = [
        { label: 'Bank account', value: 'bank_account' },
        { label: 'VPA', value: 'vpa' },
    ];

    const [formRef] = Form.useForm();

    const onCancel = () => {
        // clear form
        formRef.resetFields();
        onClose();
    }

    const onOk = async () => {
        try {
            setLoading(true);
            formRef.setFields([{ name: 'type', value: type, touched: true }]);
            const formData = await formRef.validateFields();
            await onSubmit(formData);
            onCancel();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };


    const handleVerifyAccountNumber = async () => {
        try {
            const formData = await formRef.validateFields();
            const response = await api.post('/check-banifically-add-account', formData);
    
            console.warn(response.data);
            console.warn(response.data.message);
    
            if (response.data.response_message === "SUCCESS") {
                formRef.setFieldsValue({
                    name: response.data.beneName,
                    bank_name: response.data.beneBankName,
                    ifsc_code: response.data.beneifsc,
                    account_number: response.data.beneAccountNo
                });
    
                setAccountNumberValid(true);
                message.success(response.data.statusDesc);
                setTimeout(() => {
                    message.destroy();
                }, 2000);
            } else {
                setAccountNumberValid(false);
                message.error(response.data.statusDesc);
    
                setTimeout(() => {
                    message.destroy();
                }, 2000);
            }
            if(response.data.message === false)
            {
                message.success(response.data.respMessage);
                setTimeout(() => {
                    message.destroy();
                }, 2000);
            }
        } catch (error) {
            console.error('Error during account number verification:', error);
        }
    };
    
    
    
    return (
        <Modal
            title="Add Beneficiary"
            open={visible}
            closable={true}
            onCancel={onCancel}
            onOk={onOk}
            okButtonProps={{ loading: loading, disabled: loading }}
            okText="Submit"
        >
            <Form form={formRef} layout='vertical' initialValues={{ type }}>
                <Row gutter={[8,8]}>
                <Col xs={24} md={24} lg={24}>
                <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                    <BaseSelect options={typeOptions} defaultText='Choose one' onChange={(value) => setType(value)}/>
                </Form.Item>
                </Col>
                </Row>
                {
                    type === 'bank_account' ? (
                        <React.Fragment>
                            <Row gutter={[8,8]}>
                            <Col xs={24} md={12} lg={12}>
                            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={12}>
                            <Form.Item label="Bank name" name="bank_name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={12}>
                            <Form.Item label="IFSC" name="ifsc_code" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            </Col>
                           
                        <Col xs={24} md={12} lg={12}>
                            <Form.Item label="Account number" name="account_number" className="last" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            {/* <Button type="primary" onClick={handleVerifyAccountNumber} className='mt-8'>
                                    Verify Account Number
                            </Button> */}
                        </Col>
                        </Row>
                        </React.Fragment>
                    ) : (
                        <Form.Item label="UPI address" name="vpa" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    )
                }
            </Form>
        </Modal>
    );
};

export default CreatePayoutsBeneficiaryAccountForm;
