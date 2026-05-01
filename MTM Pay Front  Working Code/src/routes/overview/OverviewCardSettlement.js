import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Space, Divider, Button, Row, } from 'antd';
// request
import { getSettlementSummary } from 'requests/statistic'

const { Title } = Typography;

const OverviewCardSettlement = (props) => {
	const [data, setData] = useState({});

	useEffect(() => {
		const getData = async () => {
			const response = await getSettlementSummary();
			setData(response);
		}

		getData();
	}, []);

	return (
		<Card className="overview-orders">
			<Title level={3}>Settlements</Title>
			<Divider />
			<Row justify="space-between" align='middle' className='mb-16'>
				<Row justify="start" align='middle'>
					<Space
						size={1}
						direction="vertical"
						align="center"
						className="weight-7 count-list green-box"
					>
						<span>{data.processed_count || 0}</span>
						<span className="">Settlements</span>
					</Space>
					<span className="ml-16 weight-5">Processed ₹{data.processed_amount || 0}</span>
				</Row>
				<Link to='/settlements?status=4'>
					<Button>
						<span className="list-button">Open</span>
					</Button>
				</Link>
			</Row>
		</Card>
	);
}

OverviewCardSettlement.propTypes = {};

export default OverviewCardSettlement;
