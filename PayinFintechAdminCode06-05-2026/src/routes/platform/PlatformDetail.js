import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageTitle from 'components/PageTitle';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Form, Row, Col, Input, Select, Button, Divider, Card, Typography, Switch, Spin } from 'antd';
import _ from 'lodash';
import Loading from 'components/Loading';
import ConfigFormItems from "components/ConfigForm/ConfigFormItems";
import ConfigButtons from "components/ConfigForm/ConfigButtons";
import UploadArea from "components/UploadArea";
// request
import { getPlatform, updatePlatform } from 'requests/platform';

const { Title } = Typography;

const PlatformDetail = () => {
    const [loading, setLoading] = useState(true);
    const [record, setRecord] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [titles, setTitles] = useState([{ path: '/platforms', title: 'Platforms' }]);
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

    const [formRef] = Form.useForm();

    const location = useLocation();
    const params = useParams();

    const config = useSelector(state => state.config);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const record = await getPlatform(params.id);
            setTitles([
                { path: '/platforms', title: 'Platforms' },
                { path: location.pathname, title: record.name }
            ]);
            setRecord(record);

            const platformConfig = record.config;
            if (platformConfig) {
                if (platformConfig.form_fields) setFormItems(platformConfig.form_fields);
                if (platformConfig.buttons) setButtons(platformConfig.buttons);
                if (platformConfig.information) setInformation(platformConfig.information);
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
        updatePlatform(params.id, {[name]: ''})
    }

    const onUpdate = async (data) => {
        try {
            setLoadingUpdate(true);
            await updatePlatform(params.id, data)
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
            await updatePlatform(params.id, { config: data })
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
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item name="status" label="Status" valuePropName="checked" rules={[{ required: true }]}>
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
                    <Form.Item name="description" label="Description" rules={[{ required: false }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Row justify='end'>
                        <Button type='primary' htmlType='submit'>Update</Button>
                    </Row>
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
                    <Button type='primary' onClick={onSaveSettings}>Save settings</Button>
                </Row>
            </Spin>
        </div>
    )
}

export default PlatformDetail;