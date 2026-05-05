import { Tabs } from 'antd';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GeneralSettings from './GeneralSettings';
import MessageTemplates from './MessageTemplates';

const { TabPane } = Tabs;

export default function WhatsappSettings() {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (params.service === 'whatsapp') {
            if (!params.tab) {
                navigate('/notifications/settings/whatsapp/config');
            }
        }
    }, [location.pathname]);

    return (
        <Tabs
            tabPosition="left"
            className="whatsapp"
            activeKey={params.tab}
            defaultActiveKey={params.tab}
            destroyInactiveTabPane={true}
            onChange={(key) => navigate(`/notifications/settings/whatsapp/${key}`)}
        >
            <TabPane tab="General settings" key="config">
                <GeneralSettings />
            </TabPane>

            <TabPane tab="Templates" key="templates">
                <h1>Message templates</h1>
                <MessageTemplates />
            </TabPane>
        </Tabs>
    );
}
