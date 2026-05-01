import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Loading from "components/Loading";
import { Typography, Row, Col, Card, Button, Form, Switch } from "antd";
import Parse from 'html-react-parser';
import PageTitle from "components/PageTitle";
import pusher from 'utils/pusher';
import { toast } from "react-toast";
import { generateFormElement } from "utils/common";
// styles
import 'assets/styles/store.scss';
// request
import { getAppDetail, updateApp } from 'requests/app';
import { handleButtonUrl } from "requests/common";

const { Title } = Typography;

const AppDetail = () => {
    const [loading, setLoading] = useState(true);
    const [titles, setTitles] = useState([{ path: '/apps', title: 'Apps' }]);
    const [record, setRecord] = useState({});
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [aboveButtons, setAboveButtons] = useState([]);
    const [belowButtons, setBelowButtons] = useState([]);

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    const user = useSelector(state => state.auth.authUser);

    useEffect(() => {
        const getData = async () => {
            const appDetail = await getAppDetail(params.id);

            setRecord(appDetail);
            setTitles([
                { path: '/apps', title: 'Apps' },
                { path: location.pathname, title: appDetail.app.name }
            ]);
            setLoading(false);
        }

        getData();
    }, []);

    useEffect(() => {
        if (record && record.app && record.app.config && record.app.config.buttons) {
            const aboveButtons = [], belowButtons = [];
            record.app.config.buttons.forEach(item => {
                if (item.position === 'below_form') belowButtons.push(item);
                else aboveButtons.push(item);
            });

            setAboveButtons(aboveButtons);
            setBelowButtons(belowButtons);
        }
    }, [record]);

    const onClickAppButton = async (url, type) => {
        try {
            const response = await handleButtonUrl(url);

            if (type === 'oauth' && response.redirect_url) {
                const newWindow = window.open(response.redirect_url, '_blank');
                // setOauthWindow(newWindow);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const onSubmit = async (data) => {
        try {
            setLoadingSubmit(true);

            const { status, ...restData } = data;
            await updateApp(record.id, {
                status: status ? 1 : 0,
                config: {
                    ...record.config,
                    ...restData
                }
            });
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <div className="mb-36">
            <PageTitle titles={titles} />
            {
                loading ? (
                    <Loading />
                ) : (
                    <div>
                        {
                            record.app.config ? (
                                <div>
                                    {
                                        record.app.config.information ? (
                                            <div>{Parse(record.app.config.information)}</div>
                                        ) : null
                                    }
                                    {
                                        aboveButtons.map((item, index) => (
                                            <Card key={index} className="mb-16">
                                                <Row justify="space-between" align="middle" gutter={16}>
                                                    <Col span={18}>{item.description}</Col>
                                                    <Button type={item.type !== 'default' ? 'primary' : 'default'} onClick={() => onClickAppButton(item.url, item.type)}>{item.label}</Button>
                                                </Row>
                                            </Card>
                                        ))
                                    }
                                    {
                                        record.app.config.form_fields ? (
                                            <Card
                                                className="mb-16"
                                                title="Config app"
                                            >
                                                <Form
                                                    layout="vertical"
                                                    initialValues={{ status: record.status, ...record.config }}
                                                    onFinish={onSubmit}
                                                >
                                                    <Form.Item name="status" label="Status" valuePropName="checked" rules={[{ required: true }]}>
                                                        <Switch />
                                                    </Form.Item>
                                                    {
                                                        record.app.config.form_fields.map((field, index) => (
                                                            <React.Fragment key={index}>
                                                                {generateFormElement(field)}
                                                            </React.Fragment>
                                                        ))
                                                    }

                                                    <Row justify="end">
                                                        <Button type="primary" htmlType="submit" size="large" loading={loadingSubmit}>Save</Button>
                                                    </Row>
                                                </Form>
                                            </Card>
                                        ) : null
                                    }
                                    {
                                        belowButtons.map((item, index) => (
                                            <Card key={index} className="mb-16">
                                                <Row justify="space-between" align="middle" gutter={16}>
                                                    <Col span={18}>{item.description}</Col>
                                                    <Button type={item.type !== 'default' ? 'primary' : 'default'} onClick={() => onClickAppButton(item.url, item.type)}>{item.label}</Button>
                                                </Row>
                                            </Card>
                                        ))
                                    }
                                </div>
                            ) : null
                        }
                    </div>
                )
            }
        </div>
    )
}

export default AppDetail;