import { Checkbox, Form, Input, Select } from 'antd';
import { clone, debounce } from 'lodash';
import React from 'react';

export default function AdditionalSettings({ settings, onChange }) {
    const [form] = Form.useForm();

    const handleChange = () => {
        const values = form.getFieldsValue(true);
        console.log(values);

        const newSettings = clone(settings);
        for (const key in settings) {
            newSettings[key].status = values[key + '.status'];
            newSettings[key].value = values[key + '.value'];
        }

        onChange(newSettings);
    };

    const inputChange = debounce(() => handleChange(), 400);

    if (!settings) return <></>;

    const formInitial = {};
    for (const key in settings) {
        formInitial[key + '.status'] = settings[key].status;
        formInitial[key + '.value'] = settings[key].value;
    }

    return (
        <div className="additional-settings">
            <Form form={form} initialValues={formInitial}>
                {Object.keys(settings).map((key) => {
                    const setting = settings[key];
                    if (setting.type === 'checkbox') {
                        return (
                            <Form.Item name={key + '.status'} valuePropName="checked" key={key}>
                                <Checkbox onChange={handleChange}>{setting.display}</Checkbox>
                            </Form.Item>
                        );
                    } else if (setting.type === 'checkbox|select') {
                        const texts = setting.display.split('{{value}}');
                        return (
                            <div className="checkbox-select" key={key}>
                                <Form.Item name={key + '.status'} valuePropName="checked">
                                    <Checkbox onChange={handleChange}></Checkbox>
                                </Form.Item>
                                <span className="checkbox-label">
                                    <span>{texts[0]}</span>
                                    <Form.Item name={key + '.value'}>
                                        <Select
                                            size="small"
                                            options={setting.options.map((e) => ({ value: e }))}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                    <span>{texts[1]}</span>
                                </span>
                            </div>
                        );
                    } else if (setting.type === 'checkbox|text') {
                        return (
                            <div className="checkbox-text" key={key}>
                                <Form.Item name={key + '.status'} valuePropName="checked">
                                    <Checkbox onChange={handleChange}>{setting.display}</Checkbox>
                                </Form.Item>
                                <Form.Item name={key + '.value'} style={{ marginLeft: 24 }}>
                                    <Input onChange={inputChange} placeholder={setting.placeholder} />
                                </Form.Item>
                            </div>
                        );
                    } else {
                        return <></>;
                    }
                })}
            </Form>
        </div>
    );
}
