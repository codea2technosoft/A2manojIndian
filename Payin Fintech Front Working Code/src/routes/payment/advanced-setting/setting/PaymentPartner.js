import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Switch, Input } from 'antd';
// request
import { getUsers } from 'requests/user';
import { BaseSelect } from 'components/Elements';

const { Title } = Typography;

const PaymentPartner = (props) => {
    const { data, onUpdateData } = props;

    const [usingSingleAccount, setUsingSingleAccount] = useState(false);
    const [subUserOptions, setSubUserOptions] = useState([]);

    const config = useSelector(state => state.config);

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = async () => {
        const response = await getUsers({ is_paginate: 0 });
        const options = response.records.map((item) => ({
            label: item.full_name,
            value: item.id
        }));
        setSubUserOptions(options);
    }

    return (
        <div>
            <Card>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={20} md={20} lg={20}>
                        <Title level={5}>Enable manual payment method</Title>
                        <p>
                            Note: If enabled, you have to check payment manually.
                        </p>
                    </Col>
                    <Col xs={24} sm={4} md={4} lg={4}>
                        <Switch
                            defaultChecked={!!data.enable_manual_payment}
                            onChange={(checked) => onUpdateData(`partner.enable_manual_payment`, Number(checked))}
                        />
                    </Col>
                </Row>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={20} md={20} lg={20}>
                        <Title level={5}>Enable random payment gateway</Title>
                        <p>
                            Note: If enabled, customer will checkout with random payment gateway. Else only gateway with lowest rate will be chosen.
                        </p>
                    </Col>
                    <Col xs={24} sm={4} md={4} lg={4}>
                        <Switch
                            defaultChecked={!!data.random_payment_gateway}
                            onChange={(checked) => onUpdateData(`partner.random_payment_gateway`, Number(checked))}
                        />
                    </Col>
                </Row>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={20} md={20} lg={20}>
                        <Title level={5}>Payments redirection via merchant domains</Title>
                        <p>
                            Note: If disabled, all payments will be routed via pay.sellonboard.com and you are required to whitelist this URL with the gateway for integration purposes
                        </p>
                    </Col>
                    <Col xs={24} sm={4} md={4} lg={4}>
                        <Switch
                            defaultChecked={!!data.redirection}
                            onChange={(checked) => onUpdateData(`partner.redirection`, Number(checked))}
                        />
                    </Col>
                </Row>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={24} md={20} lg={20}>
                        <Title level={5}>Use single merchant account for order API</Title>
                        <p>
                            Note: If disabled, system will auto route the transactions with multiple MIDs for load balancing. Accounts with settlement status as enabled will only be used
                        </p>
                    </Col>
                    <Col xs={24} sm={24} md={4} lg={4}>
                        <Switch
                            defaultChecked={!!data.using_single_payment_account}
                            onChange={(checked) => onUpdateData(`partner.using_single_payment_account`, Number(checked))}
                        />
                        <div className='mt-16'>
                            <BaseSelect
                                className="w-100"
                                options={subUserOptions}
                                defaultValue={data.default_payment_account}
                                onChange={(value) => onUpdateData(`partner.default_payment_account`, value)}
                            />
                        </div>
                    </Col>
                </Row>
                {/* <Row gutter={[24, 24]}>
                    <Col xs={20} sm={20} md={16} lg={16}>
                        <Title level={5}>Disable payment methods</Title>
                        <BaseSelect
                            defaultValue={data.disabled_payment_methods}
                            mode='multiple'
                            optionLabel='display'
                            optionValue='value'
                            className="w-100"
                            options={config.payment_modes}
                            onChange={(value) => onUpdateData(`partner.disabled_payment_methods`, value)}
                        />
                    </Col>
                </Row> */}
                <div className='mt-16'>
                    <Title level={5}>Webhook receiver URL</Title>
                    <Input
                        defaultValue={data.webhook_url}
                        onChange={(e) => onUpdateData(`partner.webhook_url`, e.target.value)}
                    />
                </div>
            </Card>
        </div>
    )
}

export default PaymentPartner;
