import { useEffect, useState } from "react";
import { Card, Col, Row, Skeleton, Switch, Typography } from "antd";
import AppCard from "components/AppCard";
import PageTitle from "components/PageTitle";
// requests
import { getApps, getActivedApps, activeApp, updateApp } from 'requests/app';

const AppList = () => {
    const titles = [{ path: '/apps', title: 'Apps' }];

    const [loading, setLoading] = useState(true);
    const [apps, setApps] = useState([]);
    const [activedApps, setActivedApps] = useState([]);
    const [activedAppIds, setActivedAppIds] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await getApps({ is_paginate: 0 });
            setApps(response.records);
            const activedAppsResponse = await getActivedApps({ is_paginate: 0 });
            const activedIds = activedAppsResponse.records.map(record => record.app_id);
            setActivedApps(activedAppsResponse.records);
            setActivedAppIds(activedIds);

            setLoading(false);
        }

        getData();
    }, []);

    const onToggleApp = async (appId, checked) => {
        const status = checked ? 1 : 0;

        setActivedApps({
            app_id: appId,
            status: status,
        });

        activeApp({
            app_id: appId,
            status: status
        });
    }

    if (loading) {
        return (
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={6} lg={6}>
                    <Card>
                        <Skeleton />
                    </Card>
                </Col>
            </Row>
        )
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <p>Available apps you can use to customize your storefront.</p>
            <Row gutter={[16, 16]} className="mt-36">
                {
                    apps.map(app => (
                        <Col xs={24} sm={24} md={6} lg={6} key={app.id}>
                            <AppCard
                                app={app}
                                defaultChecked={activedAppIds.includes(app.id)}
                                onToggle={(checked) => onToggleApp(app.id, checked)}
                            />
                        </Col>
                    ))
                }
            </Row>
        </div>
    )
}

export default AppList;