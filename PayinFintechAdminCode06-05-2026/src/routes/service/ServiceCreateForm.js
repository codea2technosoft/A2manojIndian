import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageTitle from 'components/PageTitle';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, Row, Col, Input, Select, Button, Divider, Card, Typography, Switch, Spin } from 'antd';
import _ from 'lodash';
import Loading from 'components/Loading';
import ConfigFormItems from "components/ConfigForm/ConfigFormItems";
import ConfigButtons from "components/ConfigForm/ConfigButtons";
import BaseSelect from "components/Elements/BaseSelect";
import JoditEditor from "jodit-react";
import UploadArea from "components/UploadArea";
// request
import { createService } from 'requests/service';
import { getModules } from 'requests/module';

const { Title } = Typography;

const ServiceCreateForm = () => {
    const [loading, setLoading] = useState(true);
    const [titles, setTitles] = useState([{ path: '/services', title: 'Services' }, { path: '/services/create', title: 'Create' }]);
    const [formItems, setFormItems] = useState([
        {
            id: 0,
            name: '',
            type: 'text',
            is_required: true,
            description: ''
        }
    ]);
    const [buttons, setButtons] = useState([
        {
            id: 0,
            label: '',
            description: '',
            url: '',
            type: 'primary'
        }
    ]);
    const [information, setInformation] = useState('');
    const [modules, setModules] = useState([]);

    const [formRef] = Form.useForm();

    const navigate = useNavigate();

    const config = useSelector(state => state.config);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const moduleResponse = await getModules({is_paginate: 0});
            console.log(moduleResponse.records)
            setModules(moduleResponse.records);

            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const onUploadFile = async (name, data) => {
        formRef.setFieldsValue({ [name]: data.path[0] });
    }

    const onRemoveFile = async (name) => {
        formRef.setFieldsValue({ [name]: null });
    }

    const onSubmit = async () => {
        try {
            setLoading(true);

            formRef.validateFields().then(async (formData) => {
                const data = {
                    ...formData,
                    status: formData.status ? 1 : 0,
                    config: {
                        information: information,
                        form_fields: formItems,
                        buttons: buttons
                    }
                }
                await createService(data);
                navigate('/services');
            })
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <Spin spinning={loading}>
                <Title level={3}>General</Title>
                <Form
                    form={formRef}
                    layout='vertical'
                    className='mt-24'
                >
                    <Row gutter={[24, 24]}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                <BaseSelect 
                                    options={config.service_types}
                                    optionLabel="display"
                                    optionValue="value"
                                    defaultText="Select one"
                                />
                            </Form.Item>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item name="status" label="Status" valuePropName="checked" rules={[{ required: false }]}>
                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="module_ids" label="Modules" rules={[{ required: true }]}>
                        <BaseSelect
                            options={modules}
                            optionLabel="name"
                            optionValue="id"
                            mode="multiple"
                        />
                    </Form.Item>
                    <Form.Item name="logo" label="Logo" rules={[{ required: false }]}>
                        <UploadArea
                            accept=".jpg,.jpeg,.png"
                            onChangeFiles={(data) => onUploadFile('logo', data)}
                            onRemove={() => onRemoveFile('logo')}
                        />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: false }]}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
                <Title level={3}>Setup page</Title>
                <p>You can create form fields, buttons or write instructions / terms of service here.</p>
                <div className="mt-36">
                    <Divider orientation="left" orientationMargin={0}>Instructions / Terms of Service</Divider>
                    <JoditEditor
                        value={information}
                        config={{ readonly: false }}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={newContent => setInformation(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                </div>
                <div className="mt-36">
                    <Divider orientation="left" orientationMargin={0}>Form fields</Divider>
                    <ConfigFormItems items={formItems} setItems={setFormItems} />
                </div>
                <div className="mt-36 mb-36">
                    <Divider orientation="left" orientationMargin={0}>Buttons</Divider>
                    <ConfigButtons items={buttons} setItems={setButtons} />
                </div>
                <Row justify='end'>
                    <Button type='primary' onClick={onSubmit}>Submit</Button>
                </Row>
            </Spin>
        </div>
    )
}

export default ServiceCreateForm;