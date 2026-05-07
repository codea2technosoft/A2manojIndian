import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageTitle from 'components/PageTitle';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Form, Row, Col, Input, Radio, Button, Divider, Card, Typography, Switch, Spin } from 'antd';
import _ from 'lodash';
import Loading from 'components/Loading';
import ConfigFormItems from "components/ConfigForm/ConfigFormItems";
import ConfigButtons from "components/ConfigForm/ConfigButtons";
import BaseSelect from "components/Elements/BaseSelect";
import JoditEditor from "jodit-react";
import UploadArea from "components/UploadArea";
// request
import { getService, updateService } from 'requests/service';
import { getModules } from 'requests/module';

const { Title } = Typography;

const ServiceDetail = () => {
    const [loading, setLoading] = useState(true);
    const [record, setRecord] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [titles, setTitles] = useState([{ path: '/services', title: 'Services' }]);
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
            url: '',
            type: 'primary'
        }
    ]);
    const [information, setInformation] = useState('');
    const [modules, setModules] = useState([]);

    const location = useLocation();
    const params = useParams();

    const [formRef] = Form.useForm();

    const config = useSelector(state => state.config);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const record = await getService(params.id);
            const moduleResponse = await getModules({ is_paginate: 0 });
            record.module_ids = record.modules.map(module => module.id);
            setTitles([
                { path: '/services', title: 'Services' },
                { path: location.pathname, title: record.name }
            ]);
            setRecord(record);
            setModules(moduleResponse.records);

            const serviceConfig = record.config;
            if (serviceConfig) {
                if (serviceConfig.form_fields) setFormItems(serviceConfig.form_fields);
                if (serviceConfig.buttons) setButtons(serviceConfig.buttons);
                if (serviceConfig.information) setInformation(serviceConfig.information);
            }

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
        updateService(params.id, {[name]: ''})
    }

    const onUpdate = async (data) => {
        try {
            setLoadingUpdate(true);
            await updateService(params.id, data)
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingUpdate(false);
        }
    }

    const onSaveSettings = async () => {
        try {
            setLoadingUpdate(true);
            const data = {
                information: information,
                form_fields: formItems,
                buttons: buttons
            };
            await updateService(params.id, { config: data })
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingUpdate(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <div>
            <PageTitle titles={titles} />
            <Spin spinning={loadingUpdate}>
                <Title level={3}>General</Title>
                <Form
                    form={formRef}
                    layout='vertical'
                    initialValues={record}
                    onFinish={onUpdate}
                    className='mt-24'
                >
                    <Row gutter={[24, 24]}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                <BaseSelect
                                    options={config.service_types}
                                    optionLabel="display"
                                    optionValue="value"
                                />
                            </Form.Item>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item name="status" label="Status" valuePropName="checked" rules={[{ required: true }]}>
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
                    <Form.Item name="can_onboarding" label="Onboarding" rules={[{ required: false }]}>
                        <Radio.Group>
                            <Radio value={0}>Not supported</Radio>
                            <Radio value={1}>Supported</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Row justify='end'>
                        <Button type='primary' htmlType='submit'>Update</Button>
                    </Row>
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
                    <Button type='primary' onClick={onSaveSettings}>Save settings</Button>
                </Row>
            </Spin>
        </div>
    )
}

export default ServiceDetail;