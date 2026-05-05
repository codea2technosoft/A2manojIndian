import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Divider, Space, Switch, Button, Input, Select, Row, Col, Tabs, Card } from 'antd';
import PlatformLabel from "components/PlatformLabel";
import { BaseSelect } from 'components/Elements';
// import lightImg from 'assets/images/light.png';
import { SearchIcon } from '@heroicons/react/outline';
import PaymentGateway from './setting/PaymentGateway';
import PaymentMode from './setting/PaymentMode';
// request
import { getPlatforms } from 'requests/platform';


const { Option } = Select;
const { TabPane } = Tabs;

const Channels = (props) => {
	const { settings, onUpdateData } = props;

	const [availablePlatforms, setAvailablePlatforms] = useState([]);
	const [platform, setPlatform] = useState('');
	const [data, setData] = useState({});

	const config = useSelector(state => state.config);

	useEffect(() => {
		const getData = async () => {
			const platformResponse = await getPlatforms();
			setAvailablePlatforms(platformResponse.records);
			if (platformResponse.records.length) {
				setPlatform(platformResponse.records[0].id);
			}
		}

		getData();
	}, []);

	useEffect(() => {
		setData(settings);
	}, [settings]);

	return (
		<>
			<p>Manage the channels and their settings from this page.</p>
			<Tabs defaultActiveKey={platform} onChange={setPlatform}>
				{
					availablePlatforms.map(item => (
						<TabPane tab={<PlatformLabel type={item.id} />} key={item.id} />
					))
				}
			</Tabs>
			<Divider />
			<Card>
				<Row className='mb-16' gutter={[32, 32]}>
					<Col xs={24} sm={24} md={12} lg={12}>
						<Row justify="space-between" align="middle" className="mb-16">
							<label>Enable test mode</label>
							<Switch
								checked={!!data[platform]?.test_mode}
								onChange={(checked) => onUpdateData(`platform.${platform}.test_mode`, Number(checked))}
							/>
						</Row>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12}>
						<Row justify="space-between" align="middle" className="mb-16">
							<label>Pass on gateway charges to the customer</label>
							<Switch
								checked={!!data[platform]?.charge_fee_customer}
								onChange={(checked) => onUpdateData(`platform.${platform}.charge_fee_customer`, Number(checked))}
							/>
						</Row>
					</Col>
				</Row>
				<Row className='mb-16' gutter={[32, 32]}>
					<Col xs={24} sm={12} md={6} lg={6}>
						<div className='mb-8'>Checkout type</div>
						<BaseSelect
							className="w-100"
							options={config.payment_checkout_types || []}
							optionLabel='display'
							optionValue='value'
							value={data[platform]?.checkout_type}
							onChange={(value) => onUpdateData(`platform.${platform}.checkout_type`, value)}
						/>
					</Col>
					<Col xs={24} sm={12} md={6} lg={6}>
						<div className='mb-8'>Gateway routing</div>
						<BaseSelect
							className="w-100"
							options={config.payment_gateway_routings || []}
							optionLabel='display'
							optionValue='value'
							value={data[platform]?.gateway_routing}
							onChange={(value) => onUpdateData(`platform.${platform}.gateway_routing`, value)}
						/>
					</Col>
					<Col xs={24} sm={12} md={6} lg={6}>
						<div className='mb-8'>Failover routing</div>
						<BaseSelect
							className="w-100"
							options={config.payment_failover_routings || []}
							optionLabel='display'
							optionValue='value'
							value={data[platform]?.failover_routing}
							onChange={(value) => onUpdateData(`platform.${platform}.failover_routing`, value)}
						/>
					</Col>
					<Col xs={24} sm={12} md={6} lg={6}>
						<div className='mb-8'>Default payment mode</div>
						<BaseSelect
							className="w-100"
							options={config.payment_modes || []}
							optionLabel='display'
							optionValue='value'
							value={data[platform]?.default_payment_mode}
							onChange={(value) => onUpdateData(`platform.${platform}.default_payment_mode`, value)}
						/>
					</Col>
				</Row>
				<Divider />
				<Tabs>
					<TabPane tab='Payment mode' key={'mode'}>
						<PaymentMode 
							platform={platform}
							records={data[platform]?.rate_item || []} 
							onUpdateData={onUpdateData}
						/>
					</TabPane>
					<TabPane tab='Payment gateway' key={'gateway'}>
						<PaymentGateway 
							platform={platform}
							gateways={data[platform]?.gateway || []} 
							onUpdateData={onUpdateData}
						/>
					</TabPane>
				</Tabs>
			</Card>
		</>
	);
}

export default Channels;
