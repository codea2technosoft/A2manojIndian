import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageTitle from 'components/PageTitle';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, Row, Col, Input, Select, Button, Divider, Card, Typography, Switch, Spin } from 'antd';
import _ from 'lodash';
import ConfigFormItems from "components/ConfigForm/ConfigFormItems";
import ConfigButtons from "components/ConfigForm/ConfigButtons";
import BaseSelect from "components/Elements/BaseSelect";
import UploadArea from "components/UploadArea";
// request
import { createPlatform } from 'requests/platform';

const { Title } = Typography;

const PlatformCreateForm = () => {
    const [loading, setLoading] = useState(false);
    const [titles, setTitles] = useState([{ path: '/platforms', title: 'Platforms' }, { path: '/platforms/create', title: 'Create' }]);
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

    const config = useSelector(state => state.config);

    const [formRef] = Form.useForm();

    const navigate = useNavigate();

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
                        form_fields: formItems,
                        buttons: buttons
                    }
                }
                await createPlatform(data);
                navigate('/platforms');
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
            <Title level={3}>General</Title>
            <Form
                form={formRef}
                layout='vertical'
                className='mt-24'
            >
                <Row gutter={[24, 24]}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <Form.Item name="status" label="Status" valuePropName="checked" rules={[{ required: false }]}>
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="logo" label="Logo" rules={[{ required: false }]}>
                    <UploadArea
                        accept=".jpg,.jpeg,.png"
                        onChangeFiles={(data) => onUploadFile('logo', data)}
                        onRemove={() => onRemoveFile('logo')}
                    />
                </Form.Item>
                <Form.Item name="type" label="Platform type" rules={[{ required: true }]}>
                    <BaseSelect
                        options={config.platform_types}
                        optionLabel='display'
                        optionValue="value"
                        defaultText="Select one"
                    />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: false }]}>
                    <Input.TextArea />
                </Form.Item>
            </Form>
            <Title level={3}>Setup page</Title>
            <p>You can create form fields, buttons or write instructions / terms of platform here.</p>
            <div className="mt-36">
                <Divider orientation="left" orientationMargin={0}>Form fields</Divider>
                <ConfigFormItems items={formItems} setItems={setFormItems} />
            </div>
            <div className="mt-36 mb-36">
                <Divider orientation="left" orientationMargin={0}>Buttons</Divider>
                <ConfigButtons items={buttons} setItems={setButtons} />
            </div>
            <Row justify='end'>
                <Button type='primary' loading={loading} onClick={onSubmit}>Create</Button>
            </Row>
        </div>
    )
}

export default PlatformCreateForm;