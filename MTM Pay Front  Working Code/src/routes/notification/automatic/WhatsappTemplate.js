import { Form, Input, Modal, Select, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea.js';
import HTMLReactParser from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toast';
import { parse } from 'utils/whatsappMessageParser.js';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { getWhatsappMessageTemplates } from '../../../requests/notification.js';

const { Title } = Typography;

export default function WhatsappTemplate(props) {
    const { visible, event, onClose, onSubmit } = props;

    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState();
    const [previewTemplate, setPreviewTemplate] = useState();
    const [components, setComponents] = useState({
        header: [],
        body: [],
        footer: [],
        buttons: [],
    });

    const [form] = Form.useForm();

    useEffect(() => {
        getTemplateData();
    }, []);

    const getTemplateData = async () => {
        try {
            const data = await getWhatsappMessageTemplates({ status: 'APPROVED' });

            const templateData = data.data;
            for (const each of templateData) {
                each.value = JSON.stringify({
                    name: each.name,
                    language: {
                        code: each.language,
                    },
                });

                each.label = `${each.language}-${each.name}`;
            }

            setTemplates(templateData);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        form.resetFields();
        if (!event) {
            setSelectedTemplate(null);
            setPreviewTemplate(null);
            setComponents({
                header: [],
                body: [],
                footer: [],
                buttons: [],
            });
            return;
        }

        const whatsappTemplate = event.whatsapp_default_template;
        if (whatsappTemplate) {
            setSelectedTemplate(JSON.stringify(whatsappTemplate));
        }

        const whatsappContent = event.settings.whatsapp_content || event.whatsapp_default_content;
        if (whatsappContent) {
            const count = {};
            const data = {};
            for (const component of whatsappContent) {
                let prefix = component.type;
                if (component.type === 'button') {
                    prefix += '.' + component.index;
                }

                if (!count[prefix]) {
                    count[prefix] = 1;
                }

                for (const parameter of component.parameters) {
                    const type = parameter.type;
                    if (prefix === 'header' && type !== 'text') {
                        data.header = parameter[type];
                        continue;
                    }

                    data[`${prefix}.{{${count[prefix]++}}}`] = parameter[type];
                }
            }
            form.setFieldsValue(data);
        }
    }, [event, form]);

    useEffect(() => {
        if (selectedTemplate) {
            form.setFieldsValue({
                template: selectedTemplate,
            });
        }

        for (const each of templates) {
            if (each.value === selectedTemplate) {
                const formFields = {};

                // check for variables in template
                for (const component of each.components) {
                    if (component.type === 'HEADER') {
                        if (component.format === 'TEXT') {
                            const variables = component.text.match(/\{\{\d+\}\}/g) || [];
                            formFields.header = variables.map((e) => ({
                                name: 'header.' + e,
                                type: 'text',
                                label: e,
                            }));
                        } else {
                            formFields.header = [
                                {
                                    name: 'header',
                                    type: component.format,
                                    label: component.format,
                                },
                            ];
                        }
                    } else if (component.type === 'BODY') {
                        const variables = component.text.match(/\{\{\d+\}\}/g) || [];
                        formFields.body = variables.map((e) => ({
                            name: 'body.' + e,
                            type: 'text',
                            label: e,
                        }));
                    } else if (component.type === 'FOOTER') {
                        const variables = component.text.match(/\{\{\d+\}\}/g) || [];
                        formFields.footer = variables.map((e) => ({
                            name: 'footer.' + e,
                            type: 'text',
                            label: e,
                        }));
                    } else if (component.type === 'BUTTONS') {
                        const variables = [];

                        component.buttons.forEach((button, index) => {
                            const urlVars = button.url.match(/\{\{\d+\}\}/g) || [];
                            variables.push(
                                ...urlVars.map((e) => ({
                                    name: `button.${index}.${e}`,
                                    type: 'text',
                                    label: `(${button.url})`,
                                    index,
                                })),
                            );

                            const textVars = button.text.match(/\{\{\d+\}\}/g) || [];
                            variables.push(
                                ...textVars.map((e) => ({
                                    name: `button.${index}.${e}`,
                                    type: 'text',
                                    label: `(${button.text})`,
                                    index,
                                })),
                            );
                        });

                        formFields.buttons = variables;
                    }
                }

                setPreviewTemplate(each);
                setComponents(formFields);
                break;
            }
        }
    }, [selectedTemplate, templates, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const content = [];

            for (const part of ['header', 'body', 'footer']) {
                const variables = components[part];
                if (!variables?.length) continue;

                const component = {
                    type: part,
                    parameters: [],
                };
                for (const variable of variables) {
                    const type = variable.type.toLowerCase();
                    component.parameters.push({
                        type,
                        [type]: values[variable.name],
                    });
                }

                content.push(component);
            }

            const buttons = [];
            for (const variable of components.buttons || []) {
                if (!buttons[variable.index]) {
                    buttons[variable.index] = {
                        type: 'button',
                        sub_type: 'url',
                        parameters: [],
                        index: String(variable.index),
                    };
                }

                buttons[variable.index].parameters.push({
                    type: 'text',
                    text: values[variable.name],
                });
            }

            content.push(...buttons);

            const data = {
                whatsapp_template: JSON.parse(values.template),
                whatsapp_content: content,
            };

            onSubmit(data);
            onClose();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleFormChange = (values) => {
        setPreviewTemplate({ ...previewTemplate });
    };

    // map template into preview and pass parameters
    const preview = {};
    for (const component of previewTemplate?.components || []) {
        if (component.type === 'HEADER') {
            preview.header = {
                format: component.format,
                text: parse(component.text) || component.format,
            };

            if (component.format === 'TEXT') {
                const variables = preview.header.text.match(/\{\{\d+\}\}/g) || [];
                for (const variable of variables) {
                    const value = form.getFieldValue('header.' + variable);
                    if (value) preview.header.text = preview.header.text.replace(variable, value);
                }
            }
        } else if (component.type === 'BODY') {
            preview.body = component.text;

            const variables = preview.body.match(/\{\{\d+\}\}/g) || [];
            for (const variable of variables) {
                const value = form.getFieldValue('body.' + variable);
                if (value) preview.body = preview.body.replace(variable, value);
            }

            preview.body = parse(preview.body);
        } else if (component.type === 'FOOTER') {
            preview.footer = component.text;

            const variables = preview.footer.match(/\{\{\d+\}\}/g) || [];
            for (const variable of variables) {
                const value = form.getFieldValue('footer.' + variable);
                if (value) preview.footer = preview.footer.replace(variable, value);
            }

            preview.footer = parse(preview.footer);
        } else if (component.type === 'BUTTONS') {
            preview.buttons = component.buttons.map((button, index) => {
                const variables = button.url.match(/\{\{\d+\}\}/g) || [];
                let url = button.url;
                for (const variable of variables) {
                    const value = form.getFieldValue(`button.${index}.${variable}`);
                    if (value) url = url.replace(variable, value);
                }

                return {
                    text: button.text,
                    href: url || button.phone_number,
                };
            });
        }
    }

    if (!event) return <></>;

    return (
        <Modal visible={visible} onCancel={onClose} onOk={handleSubmit} className="edit-whatsapp-content" width={1000}>
            <div className="edit-whatsapp-content">
                <Title level={3}>{event.name} &gt; Whatsapp template</Title>
                <Form form={form} onValuesChange={handleFormChange} layout="vertical">
                    <div className="template-select mb-16">
                        <Form.Item
                            name="template"
                            rules={[{ required: true, message: 'This field is required' }]}
                            type="hidden"
                        >
                            <Select
                                size="middle"
                                options={templates}
                                optionLabelProp="label"
                                disabled={true}
                            />
                        </Form.Item>
                    </div>
                    <div className="edit-preview mt-16">
                        <div className="edit">
                            <Title level={4}>Edit template content</Title>
                            {event?.variables?.length > 0 && (
                                <>
                                    <p>Following variables can be used for this template</p>
                                    {event.variables.map((e, i) => (
                                        <React.Fragment key={i}>
                                            {i !== 0 && <span>, </span>}
                                            <span className="variable">{`{{${e}}}`}</span>
                                        </React.Fragment>
                                    ))}
                                </>
                            )}
                            {components.header?.length > 0 && (
                                <>
                                    <Title level={5}>Header</Title>
                                    {components.header.map((e, i) => {
                                        switch (e.type) {
                                            case 'TEXT': {
                                                return (
                                                    <Form.Item
                                                        key={i}
                                                        name={e.name}
                                                        label={`Edit content for variable ${e.label}`}
                                                        rules={[{ required: true, message: 'This field is required' }]}
                                                    >
                                                        <Input placeholder="Type content here..." />
                                                    </Form.Item>
                                                );
                                            }
                                            case 'DOCUMENT': {
                                                return (
                                                    <Form.Item
                                                        key={i}
                                                        name={e.name}
                                                        label={`Edit content for variable ${e.label}`}
                                                        rules={[{ required: true, message: 'This field is required' }]}
                                                    >
                                                        <Select options={documentOptions} />
                                                    </Form.Item>
                                                );
                                            }
                                            case 'IMAGE': {
                                                return (
                                                    <Form.Item
                                                        key={i}
                                                        name={e.name}
                                                        label={`Edit content for variable ${e.label}`}
                                                        rules={[{ required: true, message: 'This field is required' }]}
                                                    >
                                                        <Select options={imageOptions} />
                                                    </Form.Item>
                                                );
                                            }
                                            default: {
                                                return <></>;
                                            }
                                        }
                                    })}
                                </>
                            )}
                            {components.body?.length > 0 && (
                                <>
                                    <Title level={5}>Body</Title>
                                    {components.body.map((e, i) => (
                                        <Form.Item
                                            key={i}
                                            name={e.name}
                                            label={`Edit content for variable ${e.label}`}
                                            rules={[{ required: true, message: 'This field is required' }]}
                                        >
                                            <TextArea placeholder="Type content here..." />
                                        </Form.Item>
                                    ))}
                                </>
                            )}
                            {components.footer?.length > 0 && (
                                <>
                                    <Title level={5}>Footer</Title>
                                    {components.body.map((e, i) => (
                                        <Form.Item
                                            key={i}
                                            name={e.name}
                                            label={`Edit content for variable ${e.label}`}
                                            rules={[{ required: true, message: 'This field is required' }]}
                                        >
                                            <Input placeholder="Type content here..." />
                                        </Form.Item>
                                    ))}
                                </>
                            )}
                            {components.buttons?.length > 0 && (
                                <>
                                    <Title level={5}>Buttons</Title>
                                    {components.buttons.map((e, i) => (
                                        <Form.Item
                                            key={i}
                                            name={e.name}
                                            label={`Edit content for variable ${e.label}`}
                                            rules={[{ required: true, message: 'This field is required' }]}
                                        >
                                            <Input placeholder="Type content here..." />
                                        </Form.Item>
                                    ))}
                                </>
                            )}
                        </div>
                        {previewTemplate && selectedTemplate && (
                            <div className="preview">
                                <Title level={4}>Preview</Title>
                                <div className="preview-box">
                                    <div className="message">
                                        {preview.header && (
                                            <div className={`header ${preview.header.format}`}>
                                                {HTMLReactParser(preview.header.text)}
                                            </div>
                                        )}
                                        {preview.body && <div className="body">{HTMLReactParser(preview.body)}</div>}
                                        {preview.footer && (
                                            <div className="footer">{HTMLReactParser(preview.footer)}</div>
                                        )}
                                        {preview.buttons && (
                                            <div className="buttons">
                                                {preview.buttons.map((e, i) => (
                                                    <a className="url-button" href={e.href} title={e.href} key={i}>
                                                        <FaExternalLinkAlt />
                                                        {e.text}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Form>
            </div>
        </Modal>
    );
}

const documentOptions = [
    { label: 'Order confirmation', value: 'order_confirmation' },
    { label: 'Invoice', value: 'invoice' },
];
const imageOptions = [{ label: 'Product image', value: 'product_image' }];
