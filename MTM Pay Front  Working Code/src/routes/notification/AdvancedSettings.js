import { Tabs } from 'antd';
import PageTitle from 'components/PageTitle';
import WhatsappSettings from './settings/whatsapp/Whatsapp';
import 'assets/styles/notification.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const { TabPane } = Tabs;

export default function NotificationsAdvancedSettings() {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!params.service) {
            return navigate('/notifications/settings/whatsapp');
        }
    }, [location.pathname]);

    return (
        <div className="notification-settings">
            <PageTitle
                titles={[
                    { path: '/notifications', title: 'Notifications' },
                    { path: '/notifications/settings', title: 'Advanced settings' },
                ]}
            />
            <Tabs
                activeKey={params.service}
                defaultActiveKey={params.service}
                destroyInactiveTabPane={true}
                onChange={(key) => navigate(`/notifications/settings/${key}`)}
            >
                <TabPane tab="Whatsapp" key="whatsapp">
                    <WhatsappSettings />
                </TabPane>

                <TabPane tab="SMS" key="sms">
                    <h1>Coming soon</h1>
                </TabPane>

                <TabPane tab="Email" key="email">
                    <h1>Coming soon</h1>
                </TabPane>
            </Tabs>
        </div>
    );
}
