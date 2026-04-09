import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Space, Divider, Button, Row, } from 'antd';
// request
import { getOrderSummary } from 'requests/statistic'

const { Title } = Typography;

const OverviewCardOrders = (props) => {
	const [data, setData] = useState({});

	useEffect(() => {
		const getData = async () => {
			const response = await getOrderSummary();
			setData(response);
		}

		getData();
	}, []);

	return (
		<Card className="overview-orders">
			<Title level={3}>Orders</Title>
			<Divider />
			<Row justify="space-between" align='middle' className='mb-16'>
				<Row justify="start" align='middle'>
					<Space
						size={1}
						direction="vertical"
						align="center"
						className="weight-7 count-list orange-box"
					>
						<span>{data.awaiting_count || 0}</span>
						<span className="">Orders</span>
					</Space>
					<span className="ml-16 weight-5">Pending ₹{data.awaiting_amount || 0}</span>
				</Row>
				<Link to='/orders?payment_status=1'>
					<Button>
						<span className="list-button">Open</span>
					</Button>
				</Link>
			</Row>
			<Row justify="space-between" align='middle' className='mb-16'>
				<Row justify="start" align='middle'>
					<Space
						size={1}
						direction="vertical"
						align="center"
						className="weight-7 count-list green-box"
					>
						<span>{data.paid_count || 0}</span>
						<span className="">Orders</span>
					</Space>
					<span className="ml-16 weight-5">Paid ₹{data.paid_amount || 0}</span>
				</Row>
				<Link to='/orders?payment_status=2'>
					<Button>
						<span className="list-button">Open</span>
					</Button>
				</Link>
			</Row>
			<Row justify="space-between" align='middle'>
				<Row justify="start" align='middle'>
					<Space
						size={1}
						direction="vertical"
						align="center"
						className="weight-7 count-list red-box"
					>
						<span>{data.failed_count || 0}</span>
						<span className="">Orders</span>
					</Space>
					<span className="ml-16 weight-5">Failed ₹{data.failed_amount || 0}</span>
				</Row>
				<Link to='/orders?payment_status=7'>
					<Button key="action-list">
						<span className="list-button">Open</span>
					</Button>
				</Link>
			</Row>
		</Card>
	);
}

OverviewCardOrders.propTypes = {};

export default OverviewCardOrders;
