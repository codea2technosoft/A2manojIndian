import PropTypes from 'prop-types';
import { useState } from 'react';
import JoditEditor from 'jodit-react';
import { Modal, Typography, Form, Select, Row, Col } from 'antd';
import { EVENT_TYPES } from 'constants/common';
import { varOptions } from './EventCreateForm.js';
import { useSelector } from 'react-redux';

const { Title } = Typography;

const EventUpdateForm = (props) => {
    const { record, visible, onClose, onSubmit } = props;

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
            <Title level={4}>Update Module</Title>
            <Form
                layout="vertical"
                form={formRef}
                initialValues={{
                    ...record,
                    variables: record.variables || undefined,
                }}
            >
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
                <Row gutter={[16, 16]}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                            <Select>
                                {EVENT_TYPES.map((item, index) => (
                                    <Select.Option value={item.value}>{item.display}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value={false}>Inactive</Select.Option>
                                <Select.Option value={true}>Active</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

EventUpdateForm.propTypes = {
    record: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    moduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default EventUpdateForm;
