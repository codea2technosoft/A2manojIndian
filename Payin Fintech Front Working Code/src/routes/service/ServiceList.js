import { useEffect, useState } from "react";
import { Card, Col, Row, Skeleton, Switch, Typography } from "antd";
import ServiceCard from "components/ServiceCard";
// requests
import { getServices, getActivedServices, activeService, updateService } from 'requests/service';

const { Title } = Typography;

const ServiceList = (props) => {
    const { moduleId } = props;

    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [activedServices, setActivedServices] = useState([]);
    const [activedServiceIds, setActivedServiceIds] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await getServices(moduleId, { is_paginate: 0 });
            setServices(response.records);
            const activedServicesResponse = await getActivedServices(moduleId, { is_paginate: 0 });
            const activedIds = activedServicesResponse.records.map(record => record.service_id);
            setActivedServices(activedServicesResponse.records);
            setActivedServiceIds(activedIds);

            setLoading(false);
        }

        getData();
    }, [moduleId]);

    const onToggleService = async (serviceId, checked) => {
        const status = checked ? 1 : 0;

        activeService({
            service_id: serviceId,
            status: status,
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
        <Row gutter={[16, 16]}>
            {
                services.map(service => (
                    <Col xs={24} sm={24} md={6} lg={6} key={service.id}>
                        <ServiceCard
                            service={service}
                            defaultChecked={activedServiceIds.includes(service.id)}
                            onToggle={(checked) => onToggleService(service.id, checked)}
                        />
                    </Col>
                ))
            }
        </Row>
    )
}

export default ServiceList;