import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Row, Col, DatePicker } from 'antd';
import dayjs from 'dayjs';
// import BaseSelect from 'components/Elements/BaseSelect';

const { Title } = Typography;

const ChargebackUpdateForm = (props) => {
    const { record, visible, users, onClose, onSubmit } = props;

    const [loading, setLoading] = useState(false);

    const [formRef] = Form.useForm();


    const onSubmitData = () => {
        formRef.validateFields().then(async (data) => {
            try {
                setLoading(true);
                await onSubmit(data);
                // close modal
                onCancel();
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        });
    };

    const onCancel = () => {
        // clear form
        formRef.resetFields();
        onClose();
    };

    React.useEffect(() => {
        formRef.resetFields();
        formRef.setFieldsValue({
            user_id: props.record.user_id ?? '',
            tx_id: props.record.tx_id ?? '',
            amount: props.record.amount ?? '',
            chargeback_at: props.record.chargeback_at ? dayjs(props.record.chargeback_at) : null,
            note: props.record.note ?? '',
        });
    }, [props.record]);

    return (
        <Modal
            visible={visible}
            closable={false}
            onCancel={onCancel}
            onOk={onSubmitData}
            okButtonProps={{
                loading: loading,
            }}
            okText="Submit"
        >
            <Title level={4}>{`Update transaction ${props.record.tx_id ?? ''}`}</Title>
            <Form layout="vertical" form={formRef}>
                {/* <Form.Item name="user_id" label="User" rules={[{ required: true }]}>
                    <BaseSelect
                        options={users}
                        optionValue="id"
                        optionLabel="full_name"
                        additionalLabel="email"
                    />
                </Form.Item> */}
                <Row gutter={[16, 16]}>
                    <Col g={12} md={12} sm={24} xs={24}>
                        <Form.Item name="tx_id" label="Transaction ID" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col g={12} md={12} sm={24} xs={24}>
                        <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                            <Input prefix="₹" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="chargeback_at" label="Chargeback at" rules={[{ required: true }]}>
                    <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="note" label="Note" rules={[{ required: false }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

ChargebackUpdateForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    users: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
};

export default ChargebackUpdateForm;
