import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Divider, Button, Checkbox, Space } from 'antd';
import {
	TruckIcon,
	CreditCardIcon,
	TicketIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	PrinterIcon,
} from '@heroicons/react/outline';
import dayjs from 'dayjs';
import ProductList from '../product/ProductList';

function OrderItem({ data }) {
	const [showProduct, setShowProduct] = useState(false);
	const billingPerson = JSON.parse(data.billing_person);
	return (
		<div>
			<Row gutter={[24, 24]}>
				<Col span={16}>
					<div style={{ display: 'flex' }}>
						<div className="mr-16">
							<Checkbox />
						</div>
						<div>
							<div>
								<span className="size-16 weight-7 mr-16">#{data?.order_number}</span>
								<span>
									{data?.created_at
										? dayjs(data?.created_at).format('dddd, MMMM D, YYYY h:mm A')
										: ''}
								</span>
							</div>
							<div className="mt-16 mb-8">
								<span className="size-16 weight-5 mr-16" style={{ color: '#4C9F64' }}>
									{data?.payment_status}
								</span>
								<span className="size-16 weight-5" style={{ color: '#E1092A' }}>
									{data?.fulfillment_status}
								</span>
							</div>
							<div>
								<span className="size-16 weight-7 mr-8">{data?.billing_person_name}</span>
								<span className="size-16 weight-5" style={{ color: '#0E4BFB' }}>
									{data?.email}
								</span>
							</div>
							<div>
								<div className="size-16">{`${billingPerson.street}, ${billingPerson.stateOrProvinceName},`}</div>
								<span className="size-16">{` ${billingPerson.city}, ${billingPerson.countryName}`}</span>
							</div>
							<div>
								<span className="size-16 weight-7 mr-8">Mobile nuber :</span>
								<span className="size-16 weight-5" style={{ color: '#0E4BFB' }}>
									{data?.billing_person_mobile}
								</span>
							</div>
						</div>
					</div>
				</Col>
				<Col span={8}>
					<Space>
						<span className="size-16 weight-7">
							{data?.total} {data?.currency}
						</span>
						<Button type="primary" icon={<PrinterIcon className="icon-btn" />}>
							Print order
						</Button>
						<Button>Update</Button>
					</Space>
				</Col>
			</Row>

			<div className="mt-24 ml-16">
				<Button style={{}} type="link" onClick={() => setShowProduct(!showProduct)}>
					<span className="size-16 weight-7" style={{ color: '#0E4BFB' }}>
						{data?.items.length} Products
						{!showProduct ? (
							<ChevronDownIcon className="ml-8 icon-btn" />
						) : (
							<ChevronUpIcon className=" ml-8 icon-btn" />
						)}
					</span>
				</Button>
			</div>
			{showProduct ? (
				<ProductList data={data} isShowHeader={false} />
			) : (
				<div className="ml-24">
					{data.items.map((item, index) => (
						<img
							alt="product"
							src={item.image}
							className="ml-8"
							style={{ width: '24px', height: '24px' }}
						/>
					))}
				</div>
			)}
			<Divider />
			<Row gutter={[24, 24]}>
				<Col span={8}>
					<div>
						<TruckIcon width={28} height={28} className="mr-8" style={{ verticalAlign: 'middle' }} />
						<span className="size-16 weight-7">Shipments</span>
					</div>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Shipment method</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6 primary-color ">{data?.shipping_method}</span>
						</Col>
					</Row>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Estimated Cost</span>
						</Col>
						<Col span={8}>
							<span className="size-14 weight-6 ">
								{data?.total} {data?.currency}
							</span>
						</Col>
					</Row>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Tracking ID</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6 ">{data?.shipping_person_mobile}</span>
						</Col>
					</Row>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Manifest ID</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6 ">{data?.store_id}</span>
						</Col>
					</Row>
				</Col>
				<Col span={8}>
					<CreditCardIcon width={28} height={28} className="mr-8" style={{ verticalAlign: 'middle' }} />
					<span className="size-16 weight-7">Payment</span>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Payment method</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6" style={{ color: '#33824A' }}>
								{data?.payment_method}
							</span>
						</Col>
					</Row>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Transaction Cost</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6 ">
								{data?.total} {data.currency}
							</span>
						</Col>
					</Row>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Payment ID</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6 ">{data?.payment_tx_id}</span>
						</Col>
					</Row>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Payment Mode</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6 ">{data?.payment_mode}</span>
						</Col>
					</Row>
				</Col>
				<Col span={8}>
					<TicketIcon width={28} height={28} className="mr-8" style={{ verticalAlign: 'middle' }} />
					<span className="size-16 weight-7">Invoicing</span>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Invoice method</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6" style={{ color: '#FF5F00' }}>
								{data?.subscribe_tx_id}
							</span>
						</Col>
					</Row>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Invoice Date</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6 ">
								{data?.created_at ? dayjs(data?.created_at).format('DD-MM-YYYY') : ''}
							</span>
						</Col>
					</Row>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Subscription ID</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6 ">{data?.subscribe_tx_id}</span>
						</Col>
					</Row>
					<Row className="mt-16">
						<Col span={8}>
							<span className="size-14">Next due on</span>
						</Col>
						<Col span={16}>
							<span className="size-14 weight-6 "></span>
						</Col>
					</Row>
				</Col>
			</Row>
		</div>
	);
}

OrderItem.propTypes = {
	data: PropTypes.object.isRequired,
};

export default OrderItem;
