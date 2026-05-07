import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageTitle from 'components/PageTitle';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Form, Row, Col, Input, Select, Button, Divider, Card, Typography, Switch, Spin } from 'antd';
import _ from 'lodash';
import Loading from 'components/Loading';
import ConfigFormItems from "components/ConfigForm/ConfigFormItems";
import ConfigButtons from "components/ConfigForm/ConfigButtons";
import BaseSelect from "components/Elements/BaseSelect";
import JoditEditor from "jodit-react";
import UploadArea from "components/UploadArea";
// request
import { getApp, updateApp } from 'requests/app';

const { Title } = Typography;

const AppDetail = () => {
    const [loading, setLoading] = useState(true);
    const [record, setRecord] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [titles, setTitles] = useState([{ path: '/apps', title: 'Apps' }]);
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

    const location = useLocation();
    const params = useParams();

    const [formRef] = Form.useForm();

    const config = useSelector(state => state.config);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const record = await getApp(params.id);

            setTitles([
                { path: '/apps', title: 'Apps' },
                { path: location.pathname, title: record.name }
            ]);
            setRecord(record);

            const appConfig = record.config;
            if (appConfig) {
                if (appConfig.form_fields) setFormItems(appConfig.form_fields);
                if (appConfig.buttons) setButtons(appConfig.buttons);
                if (appConfig.information) setInformation(appConfig.information);
            }

            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const onUpdate = async (data) => {
        try {
            setLoadingUpdate(true);
            await updateApp(params.id, data)
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
            await updateApp(params.id, { config: data })
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
                    <Form.Item name="name" label="Name" rules={[{ required: false }]}>
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
                    <Row justify='end'>
                        <Button type='primary' htmlType='submit'>Update</Button>
                    </Row>
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
                    <Button type='primary' onClick={onSaveSettings}>Save settings</Button>
                </Row>
            </Spin>
        </div>
    )
}

export default AppDetail;