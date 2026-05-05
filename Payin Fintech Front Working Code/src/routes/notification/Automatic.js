import { FaEdit } from 'react-icons/fa';
import { Collapse, message, Switch, Table, Tabs } from 'antd';
import PageTitle from 'components/PageTitle';
import HTMLReactParser from 'html-react-parser';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getNotificationEvents, setNotificationEventSettings } from 'requests/notification';
import AdditionalSettings from './automatic/AdditionalSettings.js';
import WhatsappTemplate from './automatic/WhatsappTemplate.js';

const { TabPane } = Tabs;

export default function NotificationsAutomatic() {
    const [loading, setLoading] = useState();
    const [events, setEvents] = useState();
    const [visibleWhatsappTemplate, setVisibleWhatsappTemplate] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState();

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!params.type) {
            return navigate('/notifications/automatic/order');
        }
    }, [location.pathname]);

    useEffect(() => {
        getData();
    }, [params.type]);

    const getData = async () => {
        try {
            setLoading(true);

            const data = await getNotificationEvents(params.type);

            setEvents(data);
        } catch (err) {
            message.error(err.response?.data.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = async (index, body) => {
        try {
            const id = events[index].id;
            const data = await setNotificationEventSettings(id, body);

            events[index].settings = data;
            setEvents([...events]);
        } catch (err) {
            message.error(err.response?.data.message || err.message);
        }
    };

    const handleWhatsappTemplateOpen = (event) => {
        setVisibleWhatsappTemplate(true);
        setSelectedEvent(event);
    };

    const handleWhatsappTemplateClose = () => {
        setVisibleWhatsappTemplate(false);
        setSelectedEvent(null);
    };

    const handleWhatsappTemplateSubmit = async (body) => {
        try {
            const data = await setNotificationEventSettings(selectedEvent.id, body);

            selectedEvent.settings = data;
            setEvents([...events]);
        } catch (err) {
            console.log(err);
        }
    };

    const columns = [
        {
            title: 'Events',
            dataIndex: 'name',
            render: (name) => <span className="event-name">{name}</span>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            render: (desc, record, index) => (
                <div className="additional-settings-container">
                    <span className="description">{HTMLReactParser(desc)}</span>
                    {record.settings.config && (
                        <Collapse ghost defaultActiveKey={0}>
                            <Collapse.Panel header={<span className="highlight">Additional Settings</span>} key={0}>
                                <AdditionalSettings
                                    settings={record.settings.config}
                                    onChange={(config) => handleChange(index, { config })}
                                />
                            </Collapse.Panel>
                        </Collapse>
                    )}
                </div>
            ),
        },
        {
            title: 'Notification channels',
            dataIndex: 'settings',
            render: (settings, record, index) => (
                <div className="notification-channels">
                    <div className="channel">
                        <Switch
                            defaultChecked={!!settings.whatsapp_status}
                            onChange={(checked) => handleChange(index, { whatsapp_status: checked })}
                        />{' '}
                        WhatsApp
                    </div>
                    {/* <div className="channel">
                        <Switch
                            defaultChecked={!!settings.sms_status}
                            onChange={(checked) => handleChange(index, { sms_status: checked })}
                        />{' '}
                        SMS
                    </div>
                    <div className="channel">
                        <Switch
                            defaultChecked={!!settings.email_status}
                            onChange={(checked) => handleChange(index, { email_status: checked })}
                        />{' '}
                        Email
                    </div> */}
                </div>
            ),
        },
        {
            title: 'Template',
            dataIndex: 'settings',
            render: (settings, record, index) => (
                <div className="notification-template">
                    <div className="template-action">
                        <FaEdit className="ml-12" onClick={() => handleWhatsappTemplateOpen(record)} />
                    </div>
                    {/* <div className="template-action">
                        <EditFilled className="ml-12" />
                    </div>
                    <div className="template-action">
                        <EditFilled className="ml-12" />
                    </div> */}
                </div>
            ),
        },
    ];

    return (
        <div className="notification-automatic">
            <PageTitle
                titles={[
                    { path: '/notifications', title: 'Notifications' },
                    { path: '/notifications/automatic', title: 'Automatic' },
                ]}
            />
            <Tabs
                activeKey={params.type}
                defaultActiveKey={params.type}
                onChange={(key) => navigate(`/notifications/automatic/${key}`)}
            >
                <TabPane tab="Order" key="order"></TabPane>
                <TabPane tab="Shipment" key="shipment"></TabPane>
                <TabPane tab="Product" key="product"></TabPane>
            </Tabs>
            <Table
                className="notification-events"
                rowKey="id"
                columns={columns}
                dataSource={events}
                loading={loading}
                pagination={false}
            />
            <WhatsappTemplate
                visible={visibleWhatsappTemplate}
                event={selectedEvent}
                onClose={handleWhatsappTemplateClose}
                onSubmit={handleWhatsappTemplateSubmit}
            />
        </div>
    );
}
