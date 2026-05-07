import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, Col, Row, Statistic, Button, Spin, Space } from 'antd';
import DatePicker from 'components/DatePicker';
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
			toast.error('An error occurred. Please try again.')
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
		} else if (mode === 'this_week') {
			setDates([dayjs().startOf('week'), dayjs()]);
		} else if (mode === 'last7days') {
			setDates([dayjs().subtract(7, 'day'), dayjs()]);
		} else if (mode === 'last30days') {
			setDates([dayjs().subtract(30, 'day'), dayjs()]);
		}
	}

	return (
		<Card className='mb-24'>
			<Row gutter={[8, 8]} align='middle' style={{justifyContent:'space-around'}}>
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
					onCalendarChange={(newDates) => onSetDatesByDatePicker(newDates)} className='h-height'
				/>
			</Row>
		</Card>
	);
}

OverviewCardByDate.propTypes = {};

export default OverviewCardByDate;
