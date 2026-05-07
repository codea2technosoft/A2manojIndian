import React, { useEffect, useState } from "react";
import { Row, Button, Form, Switch, Col } from "antd";
import { generateFormElement } from "utils/common";
import { toast } from "react-toast";

const ServiceForm = ({ service, initialValues, onSubmit }) => {
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const onSubmitForm = async (data) => {
        try {
            setLoadingSubmit(true);
            await onSubmit(data);
            toast.success("Config is saved successfully");
        } catch (err) {
            console.log(err);
            toast.error("An error occurs");
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <div>
            {
                service.config.form_fields ? (
                    <Form
                        layout="vertical"
                        initialValues={initialValues}
                        onFinish={onSubmitForm}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item name="status" label="Status" valuePropName="checked" rules={[{ required: true }]}>
                                    <Switch />
                                </Form.Item>
                            </Col>
                            {
                                service.config.form_fields.map((field, index) => (
                                    <Col xs={24} sm={24} md={12} lg={12}>
                                        {generateFormElement(field)}
                                    </Col>
                                ))
                            }
                        </Row>
                        <Row justify="end">
                            <Button type="primary" htmlType="submit" size="large" loading={loadingSubmit}>Save</Button>
                        </Row>
                    </Form>
                ) : null
            }
        </div>
    )
}

export default ServiceForm;