import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Table, Button, Modal, Typography, Divider } from "antd";
import PageTitle from 'components/PageTitle';
import Loading from 'components/Loading';
import ServiceCard from 'components/ServiceCard';
import ServiceForm from 'components/ServiceForm';
import BaseSelect from 'components/Elements/BaseSelect';
// requests
import { getActivedPaymentServices } from 'requests/service';
import { saveConfigAction as saveConfig } from 'redux/actions/config';

const BillingConfig = () => {
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [visibleServiceForm, setVisibleServiceForm] = useState(false);
    const [billingConfig, setBillingConfig] = useState({});
    const [activedServices, setActivedServices] = useState([]);

    const config = useSelector(state => state.config);

    const dispatch = useDispatch();

    const location = useLocation();

    const titles = [
        { path: '/config', title: 'Config' },
        { path: location.pathname, title: 'Billing' },
    ];

    useEffect(() => {
        getPaymentServices();
        // load current config
        if (config?.billing_services) setBillingConfig(JSON.parse(config?.billing_services));
    }, []);

    useEffect(() => {
        if (services.length) {
            const activedServices = [];
            services.forEach(service => {
                if (billingConfig[service.id] && billingConfig[service.id]['status']) {
                    activedServices.push({
                        label: service.name,
                        value: String(service.id)
                    });
                }
            });
            setActivedServices(activedServices);
        }
    }, [services, billingConfig]);

    useEffect(() => {
        setVisibleServiceForm(!!selectedService);
    }, [selectedService]);

    const getPaymentServices = async () => {
        try {
            setLoading(true);
            const response = await getActivedPaymentServices();
            setServices(response.records);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const changeServiceStatus = async (serviceId, status) => {
        const newBillingConfig = { ...billingConfig };
        newBillingConfig[serviceId] = {
            ...newBillingConfig[serviceId],
            status: status
        }

        await dispatch(saveConfig({ name: 'billing_services', value: JSON.stringify(newBillingConfig) }));
        setBillingConfig(newBillingConfig);
    }

    const saveServiceConfig = async (data) => {
        const newBillingConfig = { ...billingConfig };
        newBillingConfig[selectedService.id] = {
            ...newBillingConfig[selectedService.id],
            ...data
        }

        await dispatch(saveConfig({ name: 'billing_services', value: JSON.stringify(newBillingConfig) }));
        setBillingConfig(newBillingConfig);
        setSelectedService(null);
    }

    const onChangeDefaultService = async (serviceId) => {
        await dispatch(saveConfig({ name: 'default_billing_service', value: String(serviceId) }));
    }


    return (
        <div>
            <PageTitle titles={titles} />
            <p>Config payment services for billing workflow at merchant dashboard.</p>
            {
                loading ? (
                    <Loading />
                ) : (
                    <div>
                        <Row align='middle' gutter={[16, 16]}>
                            <Col>
                                <div>Choose default service for billing workflow:</div>
                            </Col>
                            <Col xs={24} sm={24} md={6} lg={6}>
                                <BaseSelect
                                    defaultText='Select one'
                                    defaultValue={config.default_billing_service}
                                    options={activedServices}
                                    style={{ width: 200 }}
                                    onChange={onChangeDefaultService}
                                />
                            </Col>
                        </Row>
                        <Divider orientation='left' orientationMargin={0}>Setup payment services</Divider>
                        <Row gutter={[16, 16]}>
                            {
                                services.map(service => (
                                    <Col xs={24} sm={24} md={6} lg={6} key={service.id}>
                                        <ServiceCard
                                            service={service}
                                            defaultChecked={billingConfig && billingConfig[service.id] ? billingConfig[service.id]['status'] : false}
                                            onToggle={(checked) => changeServiceStatus(service.id, checked)}
                                            onClick={() => setSelectedService(service)}
                                        />
                                    </Col>
                                ))
                            }
                        </Row>
                    </div>
                )
            }
            <Modal
                visible={visibleServiceForm}
                footer={null}
                width={1000}
                title={selectedService?.name}
                onCancel={() => setSelectedService(null)}
            >
                {
                    selectedService && (
                        <ServiceForm
                            service={selectedService}
                            initialValues={billingConfig[selectedService.id]}
                            onSubmit={saveServiceConfig}
                        />
                    )
                }
            </Modal>
        </div>
    );
}

export default BillingConfig;