import { Button, Col, Form, Input, message, Row, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getNotificationConfig, getWhatsappNumbers, setNotificationConfig } from 'requests/notification';

const { Title } = Typography;

export default function GeneralSettings() {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState();
    const [whatsappNumbers, setWhatsappNumbers] = useState([]);

    const [form] = Form.useForm();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/notifications/settings/whatsapp/config') {
            getData();
        }
    }, [location.pathname]);

    const getData = async () => {
        try {
            setLoading(true);
            const configData = await getNotificationConfig();
            setConfig(configData);

            const data = await getWhatsappNumbers();
            const options = data.data.map((e) => ({
                value: e.id,
                label: e.display_phone_number,
            }));

            setWhatsappNumbers(options);
        } catch (err) {
            message.error(err.response?.data.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (config?.whatsapp.settings && whatsappNumbers.length) {
            form.setFieldsValue(config?.whatsapp.settings);
        }
    }, [config, form, whatsappNumbers]);

    const handleSave = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            if (config?.whatsapp?.settings) {
                config.whatsapp.settings = values;
            } else {
                throw new Error('Invalid config');
            }

            await setNotificationConfig(config);
        } catch (err) {
            message.error(err.response?.data.message || err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Form
                className="general-settings"
                form={form}
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
                labelAlign="left"
                initialValues={config?.whatsapp?.settings}
            >
                <div className="section">
                    <Title level={5}>Select sending numbers</Title>
                    <Form.Item name="sending_number.transactional" label="Transactional">
                        <Select options={whatsappNumbers}></Select>
                    </Form.Item>
                    <Form.Item name="sending_number.marketing" label="Marketing">
                        <Select options={whatsappNumbers}></Select>
                    </Form.Item>
                </div>
                <div className="section">
                    <Title level={5}>Send a copy of message to phone number</Title>
                    <Form.Item
                        name="send_copy.phone_number"
                        label="Your phone number"
                        rules={[
                            {
                                pattern: /^[\d\s+-]*$/,
                                message: 'Invalid phone number',
                            },
                        ]}
                    >
                        <Input allowClear/>
                    </Form.Item>
                </div>
                <Row>
                    <Col span={24} className="save-btn">
                        <Button type="primary" loading={loading} onClick={handleSave}>
                            Save
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}
