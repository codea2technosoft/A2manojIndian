import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Row, Col, Card, Divider, Button, Spin } from "antd";
import parse from 'html-react-parser';
import { toast } from 'react-toast';
import PageTitle from "components/PageTitle";
import ServiceList from "./ServiceList";
// requests
import { getModules } from 'requests/module';
import { activeManyServices } from 'requests/service';

const { Title } = Typography;

const Services = () => {
    const titles = [{ path: '/services', title: 'Services' }];

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [modules, setModules] = useState([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const response = await getModules();
            setModules(response.records);
            setLoading(false);
        }

        getData();
    }, []);

    const onUpdateSelectedServices = (serviceId, isAdd) => {
        const currentServiceIds = [...selectedServiceIds];
        if (isAdd) {
            setSelectedServiceIds([...currentServiceIds, serviceId]);
        } else {
            const index = currentServiceIds.findIndex(id => id === serviceId);
            currentServiceIds.splice(index, 1);
            setSelectedServiceIds(currentServiceIds);
        }
    }

    const onChooseServices = async () => {
        try {
            setLoadingSubmit(true);
            await activeManyServices({ service_ids: selectedServiceIds });
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            {
                modules.map((module) => (
                    <div className="mb-24" key={module.id}>
                        <Divider orientation="left" orientationMargin={0}>{module.name}</Divider>
                        <ServiceList
                            moduleId={module.id}
                            // onToggleService={onUpdateSelectedServices}
                        />
                    </div>
                ))
            }
            {/* <Row justify="end" className="mt-24">
                <Button 
                    type="primary" 
                    size="large" 
                    disabled={!selectedServiceIds.length}
                    loading={loadingSubmit} 
                    onClick={onChooseServices}
                >
                    Choose services
                </Button>
            </Row> */}
        </div>
    )
}

export default Services;