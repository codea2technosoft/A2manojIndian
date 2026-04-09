import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, Space, Divider, Row, Col } from 'antd';

const { Title } = Typography;

const fakeData = [
	{
		title: 'Orders',
		description: '145',
	},
	{
		title: 'Sales',
		description: '₹ 237 K',
	},
	{
		title: 'Orders',
		description: '145',
	},
	{
		title: 'Orders',
		description: '145',
	},
	{
		title: 'Orders',
		description: '145',
	},
	{
		title: 'Orders',
		description: '145',
	},
	{
		title: 'Orders',
		description: '145',
	},
	{
		title: 'Orders',
		description: '145',
	},
	{
		title: 'Orders',
		description: '145',
	},
];

function OverviewCardSumary(props) {
	return (
		<Card className="overview-order-sumary">
			<Title level={3}>Orders summary</Title>
			<Divider />
			<Row gutter={[24, 24]}>
				{fakeData.map((item, index) => {
					return (
						<Col span={8} key={index}>
							<Space direction="vertical">
								<span>{item.title}</span>
								<span className="weight-7">{item.description}</span>
							</Space>
						</Col>
					);
				})}
			</Row>
		</Card>
	);
}

OverviewCardSumary.propTypes = {};

export default OverviewCardSumary;
