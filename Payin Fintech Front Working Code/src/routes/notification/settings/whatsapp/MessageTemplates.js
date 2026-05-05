import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Table, Tag } from 'antd';
import _ from 'lodash';
import { parse, stringify } from 'qs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getWhatsappMessageTemplates } from 'requests/notification';
import { langMap, whatsappTemplateCategories, whatsappTemplateStatus } from 'utils/notification';

export default function MessageTemplates() {
    const columns = [
        {
            title: 'Template name',
            render: (_, record) => (
                <div>
                    <div>{record.name}</div>
                    <div className="faint">{record.category}</div>
                </div>
            ),
        },
        {
            title: 'Language',
            render: (_, record) => (
                <div>
                    <div className="template-name">{langMap[record.language] || record.language}</div>
                    <div className=" faint template">{record.components?.find((e) => e.type === 'BODY')?.text}</div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => (
                <Tag
                    style={{ borderRadius: 100 }}
                    color={status === 'APPROVED' ? 'green' : status === 'REJECTED' ? 'red' : 'yellow'}
                >
                    {status}
                </Tag>
            ),
        },
    ];

    const [loading, setLoading] = useState(false);
    const [messageTemplates, setMessageTemplates] = useState();
    const [requestQuery, setRequestQuery] = useState({});

    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === '/notifications/settings/whatsapp/templates') {
            getData();
        }
    }, [location.pathname, location.search]);

    const getData = async () => {
        try {
            setLoading(true);

            const queryString = location.search.slice(1);
            const query = parse(queryString);
            setRequestQuery(query);

            const templates = await getWhatsappMessageTemplates(query);
            setMessageTemplates(templates);
        } catch (err) {
            message.error(err.response?.data.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const navigateQuery = (query) => {
        const queryString = stringify(query);

        navigate({
            search: `?${queryString}`,
        });
    };

    const setRequestQueryDebounce = _.debounce((values) => {
        navigateQuery(values);
    }, 400);

    const handleFormChange = () => {
        const values = form.getFieldsValue();
        for (const key in values) {
            if (!values[key]) {
                delete values[key];
            }
        }

        if (_.isEqual(values, requestQuery)) {
            return;
        }

        if (values.search !== requestQuery.search) {
            return setRequestQueryDebounce(values);
        }

        navigateQuery(values);
    };

    const handleClear = () => {
        navigate({
            search: '',
        });
        setRequestQuery({});
        form.setFieldsValue({
            search: null,
            category: null,
            language: null,
            status: null,
        });
    };

    useEffect(() => {
        const values = form.getFieldsValue();

        if (!_.isEqual({ ...requestQuery, ...values }, requestQuery)) {
            form.setFieldsValue(requestQuery);
        }
    }, [requestQuery]);

    return (
        <div className="templates">
            <div className="util-bar">
                <Form
                    className="filter mb-24 p-12"
                    layout="inline"
                    form={form}
                    onValuesChange={handleFormChange}
                    initialValues={requestQuery}
                >
                    <Form.Item name="search" className="search">
                        <Input placeholder="Search" prefix={<SearchOutlined />} />
                    </Form.Item>
                    <Form.Item name="category" className="select">
                        <Select
                            showSearch={true}
                            placeholder="Category"
                            options={whatsappTemplateCategories.map((e) => ({ id: e, value: e }))}
                        />
                    </Form.Item>
                    <Form.Item name="language" className="select">
                        <Select
                            showSearch={true}
                            placeholder="Language"
                            filterOption={(input, option) =>
                                (option.label + option.value).toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={Object.keys(langMap).map((key) => ({ value: key, label: langMap[key] }))}
                        />
                    </Form.Item>
                    <Form.Item name="status" className="select">
                        <Select
                            showSearch={true}
                            placeholder="Status"
                            options={whatsappTemplateStatus.map((e) => ({ id: e, value: e }))}
                        />
                    </Form.Item>
                    <Button onClick={handleClear}>Clear</Button>
                </Form>
            </div>
            <Table
                loading={loading}
                className="template-message"
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={messageTemplates?.data || []}
                pagination={false}
            />
        </div>
    );
}
