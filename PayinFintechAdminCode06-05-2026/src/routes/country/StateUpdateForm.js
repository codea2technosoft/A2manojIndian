import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, Typography, Form, Input } from 'antd';

const { Title } = Typography;

const StateUpdateForm = (props) => {
    const { record, visible, onClose, onSubmit } = props;

    const [loading, setLoading] = useState(false);

    const [formRef] = Form.useForm();

    const onSubmitData = () => {
        formRef.validateFields().then(async data => {
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
    }

    const onCancel = () => {
        // clear form
        formRef.resetFields();

        onClose();
    }

    return (
        <Modal
            visible={visible}
            closable={false}
            onCancel={onCancel}
            onOk={onSubmitData}
            okButtonProps={{
                loading: loading
            }}
            okText="Submit"
        >
            <Title level={4}>Update state</Title>
            <Form
                layout='vertical'
                form={formRef}
                initialValues={record}
            >
                <Form.Item name="name" label="Name" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
                <Form.Item name="code" label="Code" rules={[{required: true}]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

StateUpdateForm.propTypes = {
    record: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default StateUpdateForm;