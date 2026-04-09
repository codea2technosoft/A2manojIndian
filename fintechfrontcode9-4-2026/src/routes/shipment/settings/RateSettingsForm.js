import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Select, Switch, Row, Col, Button } from 'antd';
import ShipmentRateTable from 'components/ShipmentRateTable';
import { BaseSelect } from 'components/Elements';

const RateSettingsForm = (props) => {
    const { platform, orderType, mode, data, onChange } = props;

    const [rateMode, setRateMode] = useState(data?.mode || 'live');

    useEffect(() => {
        setRateMode(data?.mode || 'live');
    }, [data]);

    const onChangeRateMode = (value) => {
        setRateMode(value);
        onChange(`${platform}.storefront.${orderType}.${mode}.rate.mode`, value);
    }

    return (
        <div>
            <Row gutter={[16, 16]} className="mb-16">
                <Col xs={24} sm={24} md={12} lg={12}>
                    <div className='mb-8'>How to get rates?</div>
                    <Radio.Group value={rateMode} onChange={(e) => onChangeRateMode(e.target.value)}>
                        <Radio value="live">Use live rates from the carrier</Radio>
                        <Radio value="fixed">Use fixed shipping rates</Radio>
                    </Radio.Group>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <div className='mb-8'>Add handling charges</div>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <BaseSelect
                                className='w-100'
                                placeholder="Mode"
                                options={[
                                    { value: 'fixed', label: 'Fixed' },
                                    { value: 'percentage', label: 'Percentage' },
                                ]}
                                onChange={(value) => onChange(`${platform}.storefront.${orderType}.${mode}.rate.handling_charges_mode`, value)}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Input
                                placeholder="Percent charge"
                                value={data?.handling_charges}
                                onChange={(e) => onChange(`${platform}.storefront.${orderType}.${mode}.rate.handling_charges`, e.target.value)}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {
                rateMode === 'live' ? (
                    <React.Fragment>
                        <div className='mb-16'>
                            <div>
                                <span className='mr-16'>Add markup over live rates</span>
                                <Switch
                                    size='small'
                                    checked={data?.enable_markup_over_live_rates}
                                    onChange={(checked) => onChange(`${platform}.storefront.${orderType}.${mode}.rate.enable_markup_over_live_rates`, checked)}
                                />
                            </div>
                            <Row gutter={[16, 16]} className="mt-8">
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <BaseSelect
                                        className='w-100'
                                        placeholder="Mode"
                                        options={[
                                            { value: 'fixed', label: 'Fixed' },
                                            { value: 'percentage', label: 'Percentage' },
                                        ]}
                                        value={data?.markup_mode}
                                        onChange={(value) => onChange(`${platform}.storefront.${orderType}.${mode}.rate.markup_mode`, value)}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Input
                                        value={data?.markup_value}
                                        onChange={(e) => onChange(`${platform}.storefront.${orderType}.${mode}.rate.markup_value`, e.target.value)}
                                        placeholder="Markup value"
                                    />
                                </Col>
                            </Row>
                        </div>
                    </React.Fragment>
                ) : (
                    <ShipmentRateTable
                        {...props}
                    />
                )
            }
        </div>
    )
}

export default RateSettingsForm;