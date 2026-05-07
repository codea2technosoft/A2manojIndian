import PropTypes from 'prop-types';
import { useState } from 'react';
import JoditEditor from 'jodit-react';
import { Modal, Typography, Form, Select } from 'antd';
import { EVENT_TYPES } from 'constants/common';
import { useSelector } from 'react-redux';

const { Title } = Typography;

const EventCreateForm = (props) => {
    const { visible, onClose, onSubmit } = props;

    const [loading, setLoading] = useState(false);

    const [formRef] = Form.useForm();

    const eventNameOptions = useSelector((state) => state.config.notification_event_names);

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
            <Title level={4}>Create new event</Title>
            <Form layout="vertical" form={formRef}>
                <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                    <Select options={eventNameOptions} showSearch />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                    <JoditEditor
                        config={{ readonly: false }}
                        tabIndex={1} // tabIndex of textarea
                    />
                </Form.Item>
                <Form.Item name="variables" label="Variables">
                    <Select mode="multiple" options={varOptions} />
                </Form.Item>
                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                    <Select>
                        {EVENT_TYPES.map((item, index) => (
                            <Select.Option value={item.value} key={index}>
                                {item.display}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export const varOptions = [
    { value: 'customer_name' },
    { value: 'customer_email' },
    { value: 'customer_mobile' },
    { value: 'store_name' },
    { value: 'store_number' },
    { value: 'order_id' },
    { value: 'cart_id' },
    { value: 'cart_total' },
    { value: 'cart_items' },
    { value: 'cart_items_all' },
    { value: 'cart_url' },
    { value: 'order_date_time' },
    { value: 'order_fulfilment_status' },
    { value: 'order_payment_status' },
    { value: 'order_total' },
    { value: 'order_items' },
    { value: 'order_items_all' },
    { value: 'customer_billing_address' },
    { value: 'customer_shipping_address' },
    { value: 'payment_method' },
    { value: 'payment_method_txn_id' },
    { value: 'shipping_method' },
    { value: 'shipping_method_awb' },
    { value: 'offline_order_confirm_url' },
    { value: 'order_process_confirm_url' },
];

EventCreateForm.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default EventCreateForm;
