import { useState, useEffect } from 'react';
import { Layout } from "antd";
import AppSidebar from "layout/AppSidebar";
import AppHeader from "./AppHeader";

const { Content } = Layout;

const AppLayout = ({children}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <Layout>
            <AppSidebar 
                isCollapsed={isCollapsed}
                toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
            <Layout className={`main ${isCollapsed ? 'main-expanded' : ''}`}>
                <AppHeader />
                <Content>{children}</Content>
            </Layout>
        </Layout>
    )
}

export default AppLayout;