import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Col, Row, Statistic, Button, Spin } from 'antd';
import { FaRupeeSign } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { RiArrowLeftRightLine } from "react-icons/ri";
import DatePicker from 'components/DatePicker';
import {
	Wallet,
	Chart,
	Buy,
	TickSquare,
	Swap
} from 'react-iconly';
import dayjs from 'dayjs';
import { formatCurrency } from 'utils/common';
// request
import { getOverviewSummary } from 'requests/statistic';
import { toast } from 'react-toast';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const OverviewCardByDate = (props) => {
	const [dates, setDates] = useState([dayjs(), dayjs()]);
	const [mode, setMode] = useState('today');
	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);

	const availableModes = [
		{ key: 'today', label: 'Today' },
		{ key: 'yesterday', label: 'Yesterday' },
		{ key: 'last7days', label: 'Last 7 days' },
		{ key: 'last30days', label: 'Last 30 days' },
		{ key: 'last90days', label: 'Last 90 days' },
	];

	useEffect(() => {
		getData(dates);
	}, [dates]);

	const getData = async (dates) => {
		try {
			setLoading(true);
			const filters = {
				start: dates[0].format('YYYY-MM-DD'),
				end: dates[1].format('YYYY-MM-DD'),
			};

			const response = await getOverviewSummary(filters);
			setData(response);
		} catch (err) {
			toast.error('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	}

	const onSetDatesByDatePicker = (dates) => {
		setMode('custom');
		setDates(dates);
	}

	const onSetDatesByMode = (mode) => {
		setMode(mode);

		if (mode === 'today') {
			setDates([dayjs(), dayjs()]);
		} else if (mode === 'yesterday') {
			setDates([dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')]);
		}else if (mode === 'last7days') {
			setDates([dayjs().subtract(7, 'day'), dayjs()]);
		} else if (mode === 'last30days') {
			setDates([dayjs().subtract(30, 'day'), dayjs()]);
		}
		else if (mode === 'last90days') {
			setDates([dayjs().subtract(90, 'day'), dayjs()]);
		}
	}

	return (
		<Card className='settlement-content'>
			<Row gutter={[8, 8]} align='middle' style={{ justifyContent: 'space-around' }}>

				{
					availableModes.map((item) => (
						<Col>
							<Button
								size="large"
								type={mode == item.key ? 'primary' : 'default'}
								onClick={() => onSetDatesByMode(item.key)}
							>
								{item.label}
							</Button>
						</Col>
					))
				}

				<RangePicker
					value={dates}
					onCalendarChange={(newDates) => onSetDatesByDatePicker(newDates)}
				/>
			</Row>
			<Spin spinning={loading}>
				{/* <Row className='mt-16' gutter={[16, 16]}>
					<Col xs={24} sm={24} md={12} lg={6}>
						<Card className='statistic-card--orange red-border box4'>
							<Statistic
								title="Number of Success Orders Bank"
								value={data.paidOrderCount}
								prefix={<Buy set="light" width={36} height={36} />}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={12} lg={6}>
						<Card className='statistic-card--green red-border box1'>
							<Statistic
								title="Success Orders Amount Bank"
								value={data.paidTotalAmount}
								prefix={<Buy set="light" width={36} height={36} />}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={12} lg={6}>
						<Card className='statistic-card--orange red-border box2'>
							<Statistic
								title="Success Order Amount Payout"
								value={data.transferToPayoutAmt}
								prefix={<Buy set="light" width={36} height={36} />}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={12} lg={6}>
						<Card className='statistic-card--purple red-border box3'>
							<Statistic
								title="Success Payout Order Bank"
								value={data.transferToBankAmt}
								prefix={<Buy set="light" width={36} height={36} />}
							/>
						</Card>
					</Col>
				</Row> */}



<Row className='mt-16' gutter={[16, 16]}>
					{/* <Col xs={24} sm={24} md={6} lg={6}>
						<Card className='statistic-card--orange red-border'>
							<Statistic
								title="Number of Success Transaction"
								value={data.paidOrderCount}
								prefix={<Buy set="light" width={36} height={36} />}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={6} lg={6}>
						<Card className='statistic-card--green red-border'>
							<Statistic
								title="Success Transaction Amount"
								value={formatCurrency(data.paidTotalAmount)}
								prefix={<TickSquare set="light" width={36} height={36} />}
								formatter={(value) => {
									if (value.length > 15) return <span className='statistic-value--small'>{value}</span>;
									return <span>{value}</span>
								}}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={6} lg={6}>
						<Card className='statistic-card--red red-border'>
							<Statistic
								title="Settlement Amount"
								value={formatCurrency(data.settledAmount)}
								prefix={<Wallet set="light" width={36} height={36} />}
								formatter={(value) => {
									if (value.length > 15) return <span className='statistic-value--small'>{value}</span>;
									return <span>{value}</span>
								}}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={6} lg={6}>
						<Card className='statistic-card--purple red-border'>
							<Statistic
								title="Chargeback Record"
								value={formatCurrency(data.chargebackAmount)}
								prefix={<Swap set="light" width={36} height={36} />}
								formatter={(value) => {
									if (value.length > 15) return <span className='statistic-value--small'>{value}</span>;
									return <span>{value}</span>
								}}
							/>
						</Card>
					</Col> */}
					<Col xs={24} sm={24} md={12} lg={6}>
						<Card className='statistic-card--orange red-border box1'>
							<Statistic
								title="No of Success Transaction"
								value={data.paidOrderCount}
								prefix={<RiArrowLeftRightLine set="light" width={36} height={36} />}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={12} lg={6}>
						<Card className='statistic-card--green red-border box2'>
							<Statistic
								title="Success Amount"
								value={data.paidTotalAmount}
								prefix={<FaRupeeSign set="light" width={36} height={36} />}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={12} lg={6}>
						<Card className='statistic-card--orange red-border box3'>
							<Statistic
								title="Transfer To Bank"
								value={data.transferToBankAmt}
								prefix={<FaRupeeSign set="light" width={36} height={36} />}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={12} lg={6}>
						<Card className='statistic-card--purple red-border box4'>
							<Statistic
								title="Transfer to Payout"
								value={data.transferToPayoutAmt}
								prefix={<FaRupeeSign set="light" width={36} height={36} />}
							/>
						</Card>
					</Col>
				</Row>
			</Spin>
		</Card>
	);
}

OverviewCardByDate.propTypes = {};

export default OverviewCardByDate;
