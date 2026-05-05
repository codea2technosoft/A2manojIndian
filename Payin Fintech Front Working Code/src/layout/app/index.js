import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import AppSidebar from "layout/app/AppSidebar";
import AppHeader from "layout/app/AppHeader";
import AppFooter from "layout/app/AppFooter";
import KycForm from 'components/Forms/KycForm';
// request
import { getShipmentSettings } from 'requests/shipment';

const { Content } = Layout;

const AppLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const user = useSelector(state => state.auth.authUser);

    useEffect(() => {
        if (user) {
            if (!user.config || !user.config.shipment) {
                // setup default shipment settings
                getShipmentSettings();
            }
        }
    }, [user]);

    return (
        <Layout>
            <AppSidebar
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
            <Layout className={`main ${isCollapsed ? 'main-expanded' : ''}`}>
                <AppHeader />
                <Content>
                    <div>
                        {children}
                        {/* <KycForm /> */}
                    </div>
                </Content>
                <AppFooter />
            </Layout>
        </Layout>
    )
}

export default AppLayout;