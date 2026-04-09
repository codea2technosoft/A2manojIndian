import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Switch, Input, InputNumber } from 'antd';
// request
import { BaseSelect } from 'components/Elements';

const { Title } = Typography;

const PaymentSettlements = (props) => {
    const { data, onUpdateData } = props;

    const settlementOptions = [
        {
            label: 'Instant',
            value: '0'
        },
        {
            label: 'Every 2 mins',
            value: '2m'
        },
        {
            label: 'Every 15 mins',
            value: '15m'
        },
        // {
        //     label: 'Every 30 mins',
        //     value: '30m'
        // },
        // {
        //     label: 'Every hour',
        //     value: '1h'
        // },
        // {
        //     label: 'Every 6 hours',
        //     value: '6h'
        // },
        // {
        //     label: 'Every 12 hours',
        //     value: '12h'
        // }
    ];

    return (
        <div>
            <Card>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Row justify='space-between' gutter={8}>
                        <Col xs={20} sm={20} md={20} lg={22}>
                            <Title level={5}>Auto Settlements</Title>
                            <p>
                            Note: If enabled, amount will be settled every 15 minutes. Make sure your account is enabled for instant settlement for this  feature to work properly.
                           </p>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={2}>
                            <Switch
                                defaultChecked={!!data.auto_settlements}
                                onChange={(checked) => onUpdateData(`partner.auto_settlements`, Number(checked))}
                            />
                            </Col>

                        <Col xs={24} sm={24} md={12} lg={8}>
                           <BaseSelect
                            className="w-100"
                            options={settlementOptions}
                            defaultValue={data.auto_settlements_option}
                            onChange={(value) => onUpdateData(`partner.auto_settlements_option`, value)}
                        />
                        </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Row justify='space-between' className='mt-16' gutter={8}>
                        <Col xs={20} sm={20} md={20} lg={22}>
                            <Title level={5}>Auto disable MID if creating settlement failed</Title>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={2}>
                            <Switch
                                defaultChecked={!!data.disable_mid_if_settlement_failed}
                                onChange={(checked) => onUpdateData(`partner.disable_mid_if_settlement_failed`, Number(checked))}
                            />
                        </Col>
                        </Row>
                        <p style={{ textAlign: 'justify' }}>
                            If creating settlement failed, then auto disable MID to avoid failed at next time
                        </p>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default PaymentSettlements;
