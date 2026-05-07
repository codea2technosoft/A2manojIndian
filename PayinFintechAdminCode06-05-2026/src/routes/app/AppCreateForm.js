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
import { createApp } from 'requests/app';
import { getModules } from 'requests/module';

const { Title } = Typography;

const AppCreateForm = () => {
    const [loading, setLoading] = useState(false);
    const [titles, setTitles] = useState([{ path: '/apps', title: 'Apps' }, { path: '/apps/create', title: 'Create' }]);
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

    const [formRef] = Form.useForm();

    const navigate = useNavigate();

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
                await createApp(data);
                navigate('/apps');
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
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status" valuePropName="checked" rules={[{ required: true }]}>
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                    <Form.Item name="js_url" label="JS URL" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="css_url" label="CSS URL" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: false }]}>
                        <Input.TextArea />
                    </Form.Item>
                </Form>
                <Title level={3}>Setup page</Title>
                <p>You can create form fields, buttons or write instructions / terms of app here.</p>
                <div className="mt-36">
                    <Divider orientation="left" orientationMargin={0}>Instructions / Terms of App</Divider>
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

export default AppCreateForm;