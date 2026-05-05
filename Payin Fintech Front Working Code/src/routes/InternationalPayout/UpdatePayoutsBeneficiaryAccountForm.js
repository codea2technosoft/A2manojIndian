import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Typography, Row, Col, Form, Button, Input, Modal } from 'antd';
import PageTitle from 'components/PageTitle';
import { BaseSelect } from 'components/Elements';

const UpdatePayoutsBeneficiaryAccountForm = ({ record, users, visible, onClose, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('bank_account');

    const typeOptions = [
        { label: 'Bank account', value: 'bank_account' },
        { label: 'VPA', value: 'vpa' },
    ];

    const [formRef] = Form.useForm();

    useEffect(() => {
        setType(record.type);
        formRef.resetFields();
        formRef.setFieldsValue(record);
    }, [record]);

    const onCancel = () => {
        // clear form
        formRef.resetFields();
        onClose();
    }

    const onOk = () => {
        try {
            setLoading(true);

            formRef.validateFields().then(async (formData) => {
                await onSubmit(formData);

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
            title="Add Beneficiary"
            open={visible}
            closable={false}
            onCancel={onCancel}
            onOk={onOk}
            okButtonProps={{
                loading: loading,
            }}
            okText="Submit"
        >
            <Form
                form={formRef}
                layout='vertical'
                initialValues={{ type }}
            >
                <Form.Item label="User" name="user_id" rules={[{ required: true }]}>
                    <BaseSelect
                        options={users}
                        defaultText='Choose one'
                        optionLabel='full_name'
                        additionalLabel='email'
                        optionValue='id'
                    />
                </Form.Item>
                <Form.Item label="Type" name="type" rules={[{ required: true }]}>
                    <BaseSelect
                        options={typeOptions}
                        defaultText='Choose one'
                        onChange={(value) => setType(value)}
                    />
                </Form.Item>

                {
                    type === 'bank_account' ? (
                        <React.Fragment>
                            <Form.Item label="Account name" name="bank_account_name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="IFSC" name="bank_ifsc" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Account number" name="bank_account_number" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
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

export default UpdatePayoutsBeneficiaryAccountForm;
