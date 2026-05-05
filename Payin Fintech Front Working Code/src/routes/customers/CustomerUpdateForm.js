import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Row, Col } from 'antd';


const { Title } = Typography;

const CustomerUpdateForm = (props) => {
    const { visible, onClose, onSubmit } = props;

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
            group: props.record.group ?? '',
            channel: props.record.channel ?? ''
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
            <Title level={4}>{`Update customer ${props.record.email ?? ''}`}</Title>
            <Form layout="vertical" form={formRef}>
                <Form.Item name="group" label="Group" rules={[]}>
                    <Input />
                </Form.Item>
                <Form.Item name="channel" label="Channel" rules={[{ required: false }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

CustomerUpdateForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    record: PropTypes.object.isRequired,
};

export default CustomerUpdateForm;
