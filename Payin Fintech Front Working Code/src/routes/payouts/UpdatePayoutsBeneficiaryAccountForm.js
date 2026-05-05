import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Typography, Row, Col, Form, Button, Input, Modal } from 'antd';
import PageTitle from 'components/PageTitle';
import { BaseSelect } from 'components/Elements';

const UpdatePayoutsBeneficiaryAccountForm = ({ record, users, visible, onClose, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [formRef] = Form.useForm();

    useEffect(() => {
        if (record && Object.keys(record).length > 0) {
            // Auto fill form with record data
            formRef.setFieldsValue({
                name: record.name || '',
                bank_name: record.bank_name || '',
                ifsc_code: record.ifsc_code || '',
                account_number: record.account_number || '',
            });
        }
    }, [record, formRef]);

    const onCancel = () => {
        formRef.resetFields();
        onClose();
    }

    const onOk = () => {
        try {
            setLoading(true);
            formRef.validateFields().then(async (formData) => {
                // Prepare data for update API
                const updateData = {
                    name: formData.name,
                    bank_name: formData.bank_name,
                    ifsc_code: formData.ifsc_code,
                    account_number: formData.account_number,
                };
                await onSubmit(updateData);
                onCancel();
            });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title="Update Bank Details"
            open={visible}
            closable={false}
            onCancel={onCancel}
            width={600}
            footer={[
                // LEFT side → Update button
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={onOk}
                >
                    Update
                </Button>,

                // RIGHT side → Cancel button
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>
            ]}
        >
            <Form
                form={formRef}
                layout='vertical'
            >
                {/* <Form.Item 
                    label="Beneficiary Name" 
                    name="name" 
                    rules={[{ required: true, message: 'Please enter beneficiary name' }]}
                >
                    <Input placeholder="Enter beneficiary name" />
                </Form.Item> */}

                <Form.Item
                    label="Bank Name"
                    name="bank_name"
                    rules={[{ required: true, message: 'Please enter bank name' }]}
                >
                    <Input placeholder="Enter bank name" />
                </Form.Item>

                <Form.Item
                    label="IFSC Code"
                    name="ifsc_code"
                    rules={[{ required: true, message: 'Please enter IFSC code' }]}
                >
                    <Input placeholder="Enter IFSC code" />
                </Form.Item>

                {/* <Form.Item 
                    label="Account Number" 
                    name="account_number" 
                    rules={[{ required: true, message: 'Please enter account number' }]}
                >
                    <Input placeholder="Enter account number" />
                </Form.Item> */}
            </Form>
        </Modal>
    );
};

export default UpdatePayoutsBeneficiaryAccountForm;