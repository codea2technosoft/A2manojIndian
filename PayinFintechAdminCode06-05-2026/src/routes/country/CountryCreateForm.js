import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, Typography, Form, Input, Select } from 'antd';

const { Title } = Typography;

const CountryCreateForm = (props) => {
    const { visible, onClose, onSubmit } = props;

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
            <Title level={4}>Create new country</Title>
            <Form
                layout='vertical'
                form={formRef}
            >
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="mobile_code" label="Mobile code" rules={[{ required: true }]} extra="Should include + sign at start">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}

CountryCreateForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default CountryCreateForm;