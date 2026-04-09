import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, Typography, Switch, Button, Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import pusher from 'utils/pusher';
// styles
import styleVariables from 'assets/styles/variables.scss';
// requests
import { getServices, onboardServices } from 'requests/service';


const { Title } = Typography;
const { Step } = Steps;

const Services = (props) => {
    const { modules, onNext } = props;

    const [current, setCurrent] = useState(0);
    const [services, setServices] = useState([]);
    const [onboardedServices, setOnboardedServices] = useState([]);
    const [pusherData, setPusherData] = useState({});

    const user = useSelector(state => state.auth.authUser);

    useEffect(() => {
        const channel = pusher.subscribe(`sob_channel_user_${user.id}`);
        channel.bind('onboarding-service', function (data) {
            const response = JSON.parse(data.message);

            setPusherData(response);
        });
    }, []);

    useEffect(() => {
        const getData = async () => {
            const response = await getServices(modules[current].id, { is_paginate: 0 });
            const ids = response.records.map(record => record.id);

            setServices(response.records);
            setOnboardedServices([]);
            // onboard
            onboardServices({service_ids: ids});
        }

        if (current < modules.length) getData();
        else onNext();
    }, [current]);

    useEffect(() => {
        if (services.length) {
            const newServices = [...services];
            const index = newServices.findIndex(service => service.id === pusherData.service_id);
            newServices[index] = {
                ...newServices[index],
                onboarding_status: pusherData.status
            };
    
            setServices(newServices);
            setOnboardedServices([...onboardedServices, newServices[index]]);
        }
    }, [pusherData]);

    useEffect(() => {
        if (services.length && onboardedServices.length) {
            if (services.length === onboardedServices.length) {
                setTimeout(() => {
                    setCurrent(current + 1);
                }, 1000);
            }
        }
    }, [services, onboardedServices]);

    return (
        <div>
            <p>We will onboard you with our partners. If you already have an account with them, you can link your existing account later.</p>
            <Steps current={current}>
                {
                    modules.map(module => (
                        <Step key={module.id} title={module.name} />
                    ))
                }
            </Steps>
            <Row gutter={[16, 16]} className="mt-36">
                {
                    services.map(service => (
                        <Col xs={24} sm={24} md={6} lg={6} key={service.id}>
                            <Card>
                                <Row justify='space-between' align='middle'>
                                    <Title level={5} className="mb-0">{service.name}</Title>
                                    {
                                        service.onboarding_status === undefined ? (
                                            <LoadingOutlined className="loading-icon" />
                                        ) : (
                                            <React.Fragment>
                                                {
                                                    service.onboarding_status === 1 ? (
                                                        <CheckIcon width={24} height={24} color={styleVariables.successColor} />
                                                    ) : (
                                                        <XIcon width={24} height={24} color={styleVariables.secondaryColor} />
                                                    )
                                                }
                                            </React.Fragment>
                                        )
                                    }


                                </Row>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </div>
    )
}

export default Services;