import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, Button, Collapse, List, Checkbox, DatePicker, Row, Col, Input } from 'antd';
import { useSelector } from 'react-redux';
import { SearchIcon } from '@heroicons/react/outline';
import { CaretRightOutlined } from '@ant-design/icons';
import { ORDERTYPE } from 'utils/common';

const { Panel } = Collapse;

const PanelHeader = ({ title }) => {
	return <div className="weight-6 size-16 gray-color">{title}</div>;
};

function FilterDrawer({ isCartFilter, orders, visible, onClose, onSaveFilter, filterData, onChangeFilter }) {
	const orderData = Object.entries(orders).map((item) => ({
		title: ORDERTYPE[item[0]],
		count: item[1],
		active: true,
	}));

	// const orderStatuses = useSelector((state) => state.config.orderStatuses);
	const payStatuses = useSelector((state) => state.config.pay_statuses);
	const fulfillmentStatuses = useSelector((state) => state.config.fulfillment_statuses);
	const serviceTypes = useSelector((state) => state.config.service_types);

	return (
		<Drawer className="filter-drawer" placement="right" onClose={onClose} visible={visible} closable={false}>
			<p className="weight-6 size-20 mb-18">Filter</p>
			{
				!isCartFilter && (
					<List
						dataSource={orderData}
						renderItem={(item, index) => (
							<List.Item key={`l-${index}`}>
								<List.Item.Meta
									title={
										<div className={`gray-color ${item.active ? 'weight-6 size-16' : ''}`}>
											{item.title}
										</div>
									}
								/>
								<div className={`gray-color ${item.active ? 'weight-6 size-16' : ''}`}>{item.count}</div>
							</List.Item>
						)}
					/>
				)
			}
			<Collapse
				className="mt-8"
				bordered={false}
				expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
				expandIconPosition="right"
			>
				<Panel header={<PanelHeader title="Date" />} key="1">
					<DatePicker placeholder="From" style={{ width: '100%', marginBottom: '8px' }} />
					<DatePicker placeholder="To" style={{ width: '100%', marginBottom: '8px' }} />
					<Row gutter={[12, 12]}>
						<Col span={12}>
							<Button className="button-date">Today</Button>
						</Col>
						<Col span={12}>
							<Button className="button-date">Yesterday</Button>
						</Col>
						<Col span={12}>
							<Button className="button-date">Last 24 Hrs</Button>
						</Col>
						<Col span={12}>
							<Button className="button-date">This week</Button>
						</Col>
						<Col span={12}>
							<Button className="button-date">Last 30 days</Button>
						</Col>
						<Col span={12}>
							<Button className="button-date">This month</Button>
						</Col>
						<Col span={24}>
							<Button className="button-date">Lifetime</Button>
						</Col>
					</Row>
				</Panel>
				{
					!isCartFilter && (
						<React.Fragment>
							<Panel header={<PanelHeader title="Payment Status" />} key="2">
								<Checkbox.Group
									defaultValue={filterData?.payment_status || ['']}
									onChange={(e) => onChangeFilter('payment_status', e, true)}
								>
									{payStatuses?.map((item) => (
										<div key={item.value}>
											<Checkbox value={item.value} className="mt-8 mb-8 size-16">
												{item.display}
											</Checkbox>
											<br />
										</div>
									))}
								</Checkbox.Group>
							</Panel>
							<Panel header={<PanelHeader title="Subscription status" />} key="3">
								<Checkbox.Group
									defaultValue={['']}
								// onChange={onChange}
								>
									{[
										{ label: 'Created', value: 'Created' },
										{ label: 'Cancelled', value: 'Cancelled' },
									].map((item, index) => (
										<div key={index}>
											<Checkbox value={item.value} className="mt-8 mb-8 size-16">
												{item.label}
											</Checkbox>
											<br />
										</div>
									))}
								</Checkbox.Group>
							</Panel>
							<Panel header={<PanelHeader title="Fulfliment status" />} key="4">
								<Checkbox.Group
									defaultValue={filterData?.fulfillment_status || ['']}
									onChange={(e) => onChangeFilter('fulfillment_status', e, true)}
								>
									{fulfillmentStatuses?.map((item, index) => (
										<div key={index}>
											<Checkbox value={item.value} className="mt-8 mb-8 size-16">
												{item.display}
											</Checkbox>
											<br />
										</div>
									))}
								</Checkbox.Group>
							</Panel>
						</React.Fragment>
					)
				}
				<Panel header={<PanelHeader title="Payment methods" />} key="5">
					<Checkbox.Group
						defaultValue={filterData?.payment_method || ['']}
						onChange={(e) => onChangeFilter('payment_method', e, true)}
					>
						{serviceTypes?.map((item, index) => (
							<div key={index}>
								<Checkbox value={item.display} key={index} className="mt-8 mb-8 size-16">
									{item.display}
								</Checkbox>
								<br />
							</div>
						))}
					</Checkbox.Group>
				</Panel>
				<Panel header={<PanelHeader title="Shipment methods" />} key="6">
					<Checkbox.Group
						defaultValue={['']}
					// onChange={onChange}
					>
						{[
							{ label: 'Flat rate', value: 'Flat rate' },
							{ label: 'Shyplite prepaid (Air)', value: 'Shyplite prepaid (Air)' },
							{ label: 'Free shipping', value: 'Free shipping' },
							{ label: 'wiz ship', value: 'wiz ship' },
							{ label: 'Shyplite COD', value: 'Shyplite COD' },
						].map((item, index) => (
							<div key={index}>
								<Checkbox value={item.value} key={index} className="mt-8 mb-8 size-16">
									{item.label}
								</Checkbox>
								<br />
							</div>
						))}
					</Checkbox.Group>
				</Panel>
				{
					!isCartFilter && (
						<Panel header={<PanelHeader title="Tracking status" />} key="7">
							<DatePicker placeholder="From" style={{ width: '100%', marginBottom: '8px' }} />
							<DatePicker placeholder="To" style={{ width: '100%', marginBottom: '8px' }} />
							<Row gutter={[12, 12]}>
								<Col span={12}>
									<Button className="button-date">Next 3 hours</Button>
								</Col>
								<Col span={12}>
									<Button className="button-date">Next 24 hours</Button>
								</Col>
								<Col span={12}>
									<Button className="button-date">Today</Button>
								</Col>
								<Col span={12}>
									<Button className="button-date">Next 3 days</Button>
								</Col>
							</Row>
						</Panel>
					)
				}
				<Panel header={<PanelHeader title="Products" />} key="8">
					<Input placeholder="Product name or SKU" prefix={<SearchIcon width={12} height={12} />} />
				</Panel>
				{/* <Panel header={<PanelHeader title="Sync status" />} key="9"></Panel>
				<Panel header={<PanelHeader title="Notification status" />} key="10"></Panel> */}
			</Collapse>
			<Button type="primary" size="large" className="button-filter" onClick={onSaveFilter}>
				Save Filter
			</Button>
		</Drawer>
	);
}

FilterDrawer.propTypes = {
	onClose: PropTypes.func.isRequired,
	visible: PropTypes.bool.isRequired,
	orders: PropTypes.object,
	onSaveFilter: PropTypes.func,
	filterData: PropTypes.object,
};

FilterDrawer.defaultProps = {
	orders: {},
	onSaveFilter: () => { },
	filterData: null,
};

export default FilterDrawer;
