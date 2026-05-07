import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row, Modal, Table, Button, Switch, Tag, Form, Input, Select, Alert } from 'antd';
import EmailEditor from 'react-email-editor';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import PageTitle from 'components/PageTitle';
import BaseSelect from 'components/Elements/BaseSelect';
import Loading from 'components/Loading';
// requests
import {
    getEmailTemplate,
    updateEmailTemplate
} from 'requests/emailTemplate';
import { toast } from 'react-toast';


const EmailTemplateDetail = () => {
    const [loading, setLoading] = useState(true);
    const [titles, setTitles] = useState([
        { path: '/config', title: 'Config' },
        { path: '/config/email-templates', title: 'Email Templates' },
    ]);
    const [record, setRecord] = useState(null);
    const [emailEditorReady, setEmailEditorReady] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const emailEditorRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const config = useSelector(state => state.config);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            setLoading(true);

            const record = await getEmailTemplate(params.id);
            setTitles([
                { path: '/config', title: 'Config' },
                { path: '/config/email-templates', title: 'Email Templates' },
                { path: location.pathname, title: record.name }
            ]);
            setRecord(record);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const onLoad = () => {
        // editor instance is created
        // you can load your template here;
        if (record) {
            const interval = setInterval(() => {
                if (emailEditorRef.current) {
                    clearInterval(interval);
                    const templateJson = record.json_content ? JSON.parse(record.json_content) : null;
                    if (templateJson) emailEditorRef.current.editor.loadDesign(templateJson);
                }
            }, 500);

        }
    }

    const onReady = () => {
        // editor is ready
        setEmailEditorReady(true);
    };

    const onSubmit = async (formData) => {
        try {
            setLoadingSubmit(true);

            var payload = {
                ...formData
            };

            payload.status = Number(formData.status);

            await emailEditorRef.current.editor.exportHtml(async (data) => {
                const { design, html } = data;
                payload.json_content = JSON.stringify(design);
                payload.html_content = html;

                await updateEmailTemplate(params.id, payload);
                toast.success('Template is saved successfully!');
            });
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingSubmit(false);
        }
    }

    if (loading && !emailEditorReady) return <Loading />;

    return (
        <div>
            <PageTitle titles={titles} />
            <Alert
                message="Supported variables in subject and content"
                description={
                    <div>
                        <code>[name], [email], [mobile], [plan], [frequency], [expiry_date], [days_left], [plan_benefits]</code>
                    </div>
                }
                type="info"
                showIcon
            />
            <Form
                layout='vertical'
                initialValues={{ ...record, type: Number(record.type) }}
                className="mt-36"
                onFinish={onSubmit}
            >
                <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                    <BaseSelect
                        options={config.email_template_types}
                        optionLabel="display"
                        optionValue='value'
                        disabled
                    />
                </Form.Item>
                <Form.Item name="status" label="Status" valuePropName='checked' rules={[{ required: true }]}>
                    <Switch />
                </Form.Item>
                <Form.Item label="Content">
                    <EmailEditor ref={emailEditorRef} onLoad={onLoad} onReady={onReady} />
                </Form.Item>

                <Row className='mt-16' justify='end'>
                    <Button type="primary" htmlType='submit' loading={loadingSubmit}>Save</Button>
                </Row>
            </Form>

        </div>
    )
}

export default EmailTemplateDetail;