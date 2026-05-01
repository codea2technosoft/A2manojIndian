import { useEffect, useState } from "react";
import { Tabs, Card, Divider, Row, Col, Switch, Input, Collapse, Button } from "antd";
import PageTitle from "components/PageTitle";
import PlatformLabel from "components/PlatformLabel";
import { BaseSelect } from 'components/Elements';
import RateSettingsForm from "./settings/RateSettingsForm";
import BackendSettingForm from "./settings/BackendSettingForm";
import CarrierTable from "./settings/CarrierTable";
// styles
import 'assets/styles/shipment.scss';
// request
import { getPlatforms } from 'requests/platform';
import { getShipmentSettings, updateShipmentSettings } from 'requests/shipment';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const ShipmentAdvancedSettings = () => {
    const titles = [
        { path: 'shipments', title: 'Shipment Advanced Settings' },
    ];
    const orderTypes = [
        { label: 'Prepaid', value: 'prepaid' },
        { label: 'COD', value: 'cod' },
        { label: 'CCOD', value: 'ccod' }
    ];
    const modes = [
        { label: 'Air', value: 'air' },
        { label: 'Surface', value: 'surface' }
    ];
    const cartTotalOptions = [
        { label: 'Subtotal only', value: 'subtotal' },
        { label: 'Subtotal, taxes and shipping fees', value: 'estimated_order' }
    ];

    const [availablePlatforms, setAvailablePlatforms] = useState([]);
    const [platform, setPlatform] = useState('');
    const [type, setType] = useState('storefront');
    const [orderType, setOrderType] = useState('prepaid');
    const [mode, setMode] = useState('air');
    const [data, setData] = useState({});
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        const getData = async () => {
            const platformResponse = await getPlatforms();
            const response = await getShipmentSettings();
            setAvailablePlatforms(platformResponse.records);
            if (platformResponse.records.length) {
                setPlatform(platformResponse.records[0].id);
            }
            setData(response.platform);
        }

        getData();
    }, []);

    useEffect(() => {
        console.log(data)
    }, [data])

    const updateData = (namePath, value) => {
        const newData = { ...data };
        const paths = namePath.split('.');

        let subData = newData;
        const length = paths.length;
        for (let i = 0; i < length - 1; i++) {
            let elem = paths[i];
            if (!subData[elem]) subData[elem] = {};
            subData = subData[elem];
        }
        subData[paths[length - 1]] = value;

        setData(newData);
    }

    const onSubmit = async () => {
        try {
            setLoadingSubmit(true);
            const settings = {
                shipment: {
                    platform: data
                }
            };
            await updateShipmentSettings(settings);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingSubmit(false);
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <div>Manage the channels and their settings from this page.</div>
            <Tabs defaultActiveKey={platform} onChange={setPlatform}>
                {
                    availablePlatforms.map(item => (
                        <TabPane tab={<PlatformLabel type={item.id} />} key={item.id}></TabPane>
                    ))
                }
            </Tabs>
            <Divider />
            <Tabs defaultActiveKey={type} onChange={setType}>
                <TabPane tab="Storefront settings" key='storefront'>
                    <Card>
                        <Row className='mb-16' gutter={[32, 32]}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Row justify="space-between" align="middle">
                                    <label>Default order type</label>
                                    <Col xs={12} sm={12} md={12} lg={12}>
                                        <BaseSelect
                                            className="w-100"
                                            options={orderTypes}
                                            value={data[platform]?.storefront?.default_order_type}
                                            onChange={(value) => updateData(`${platform}.storefront.default_order_type`, value)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Row justify="space-between" align="middle">
                                    <label>Default mode type</label>
                                    <Col xs={12} sm={12} md={12} lg={12}>
                                        <BaseSelect
                                            className="w-100"
                                            options={modes}
                                            value={data[platform]?.storefront?.default_mode}
                                            onChange={(value) => updateData(`${platform}.storefront.default_mode`, value)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='mb-16' align="middle" gutter={[32, 32]}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Row justify="space-between" align="middle">
                                    <label>Showing estimated delivery date at checkout</label>
                                    <Switch
                                        checked={data[platform]?.storefront?.showing_estimated_date}
                                        onChange={(checked) => updateData(`${platform}.storefront.showing_estimated_date`, checked)}
                                    />
                                </Row>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Row justify="space-between" align="middle">
                                    <label>Cart total based on</label>
                                    <Col xs={12} sm={12} md={12} lg={12}>
                                        <BaseSelect
                                            className="w-100"
                                            options={cartTotalOptions}
                                            value={data[platform]?.storefront?.cart_total_based_on}
                                            onChange={(value) => updateData(`${platform}.storefront.cart_total_based_on`, value)}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Tabs className="mt-16" defaultActiveKey={orderType} onChange={setOrderType}>
                            <TabPane tab="Prepaid orders" key='prepaid'></TabPane>
                            <TabPane tab="Offline orders (COD)" key='cod'></TabPane>
                            <TabPane tab="Pay on Delivery (CCOD)" key='ccod'></TabPane>
                        </Tabs>

                        <div>
                            <Row gutter={[32, 32]} align="middle">
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Row justify="space-between" align="middle">
                                        <label>Allow this shipment type</label>
                                        <Switch
                                            checked={data[platform]?.storefront?.[orderType]?.status}
                                            onChange={(checked) => updateData(`${platform}.storefront.${orderType}.status`, checked)}
                                        />
                                    </Row>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Row justify="space-between" align="middle">
                                        <label>Name to display at checkout</label>
                                        <Col xs={12} sm={12} md={12} lg={12}>
                                            <Input
                                                value={data[platform]?.storefront?.[orderType]?.name}
                                                onChange={(e) => updateData(`${platform}.storefront.${orderType}.name`, e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div className='mb-16'>
                                <div>
                                    <span className='mr-16'>Use smart rates</span>
                                    <Switch
                                        size='small'
                                        checked={data[platform]?.storefront?.[orderType]?.enable_smart_rates}
                                        onChange={(checked) => updateData(`${platform}.storefront.${orderType}.enable_smart_rates`, checked)}
                                    />
                                </div>
                                <BaseSelect
                                    className='w-100 mt-8'
                                    placeholder="Smart rate mode"
                                    options={[
                                        { value: 'lowest_cost_each_mode', label: 'Show lowest cost for each mode' },
                                        { value: 'lowest_cost_all_mode', label: 'Show lowest cost amongst all modes' },
                                    ]}
                                    value={data[platform]?.storefront?.[orderType]?.smart_rates_mode}
                                    onChange={(value) => updateData(`${platform}.storefront.${orderType}.smart_rates_mode`, value)}
                                />
                            </div>
                        </div>

                        <Card className="mt-24">
                            <Tabs defaultActiveKey={mode} onChange={setMode}>
                                <TabPane tab="Air" key='air'></TabPane>
                                <TabPane tab="Surface" key='surface'></TabPane>
                                <TabPane tab="Hyperlocal" key='hyperlocal'></TabPane>
                            </Tabs>

                            <div>
                                <Row gutter={[32, 32]} align="middle" className="mb-16">
                                    <Col xs={24} sm={24} md={12} lg={12}>
                                        <Row justify="space-between" align="middle">
                                            <label>Allow this shipment type</label>
                                            <Switch
                                                checked={data[platform]?.storefront?.[orderType]?.[mode]?.status}
                                                onChange={(checked) => updateData(`${platform}.storefront.${orderType}.${mode}.status`, checked)}
                                            />
                                        </Row>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12}>
                                        <Row justify="space-between" align="middle">
                                            <label>Name to display at checkout</label>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <Input
                                                    value={data[platform]?.storefront?.[orderType]?.[mode]?.name}
                                                    onChange={(e) => updateData(`${platform}.storefront.${orderType}.${mode}.name`, e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row justify="space-between" align="middle" className="mb-16" >
                                    <label>Set range to show this shipment option at the checkout</label>
                                    <Col xs={12} sm={12} md={12} lg={12}>
                                        <Row gutter={16}>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <Input
                                                    value={data[platform]?.storefront?.[orderType]?.[mode]?.min_cart_total}
                                                    placeholder="Minimal cart total"
                                                    onChange={(e) => updateData(`${platform}.storefront.${orderType}.${mode}.min_cart_total`, e.target.value)}
                                                />
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12}>
                                                <Input
                                                    value={data[platform]?.storefront?.[orderType]?.[mode]?.max_cart_total}
                                                    placeholder="Maximum cart subtotal"
                                                    onChange={(e) => updateData(`${platform}.storefront.${orderType}.${mode}.max_cart_total`, e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>

                            <Collapse accordion>
                                <Panel header="Carrier settings" key="carrier">
                                    <CarrierTable
                                        platform={platform}
                                        orderType={orderType}
                                        mode={mode}
                                        data={data[platform]?.storefront?.[orderType]?.[mode]?.exclude_carriers || {}}
                                        onChange={updateData}
                                    />
                                </Panel>
                                <Panel header="Rate settings" key="rate">
                                    <RateSettingsForm
                                        platform={platform}
                                        orderType={orderType}
                                        mode={mode}
                                        data={data[platform]?.storefront?.[orderType]?.[mode]?.rate || {}}
                                        onChange={updateData}
                                    />
                                </Panel>
                            </Collapse>
                        </Card>
                    </Card>
                </TabPane>
                <TabPane tab="Backend settings" key='backend'>
                    <Card>
                        <BackendSettingForm
                            platform={platform}
                            data={data[platform]?.backend || {}}
                            onChange={updateData}
                        />
                    </Card>
                </TabPane>
            </Tabs>

            <Row justify='end' className='mt-16'>
                <Button type="primary" size="large" loading={loadingSubmit} onClick={onSubmit}>Save</Button>
            </Row>
        </div>
    )
}

export default ShipmentAdvancedSettings; 