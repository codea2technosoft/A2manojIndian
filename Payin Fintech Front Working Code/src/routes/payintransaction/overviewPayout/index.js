import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Row, Col } from 'antd';
import OverviewCardPlan from './OverviewCardPlan';
import OverviewCardOrders from './OverviewCardOrders';
import OverviewCardSumary from './OverViewCardSummary';
// css
import 'assets/styles/overview.scss';
import 'assets/styles/statistic.scss';
import OverviewCardSettlement from './OverviewCardSettlement';
import OverviewCardByDate from './OverviewCardByDate';
import PaymentChart from './PaymentChart';
import RecentTransactionList from './RecentTransactionList';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { useLocation, useNavigate } from 'react-router-dom';
  
import { getPayoutOrders, exportOrders } from 'requests/order';

const { Title } = Typography;

const Overview = () => {
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [totalCount, setTotalCount] = useState(0);
	const [records, setRecords] = useState([]);
	const [selectedRecords, setSelectedRecords] = useState([]);
	const [filter, setFilter] = useState(null);
	const location = useLocation();
	const navigate = useNavigate();

	const authUser = useSelector((state) => state.auth.authUser);


	const [orderOverview, setOrderOverview] = useState({
		total_records: 0,
		unpaid_records: 0,
		paid_records: 0,
		fulfillment_processing_records: 0,
	});

	const onChangeTable = (pagination, filters, sorter, extra) => {
		let query = parseQueryParams(location);
		query = {
			...query,
			page: pagination.current,
			per_page: pagination.pageSize,
		};

		if (sorter.order) {
			query = {
				...query,
				order_by: sorter.field,
				order_type: sorter.order === 'ascend' ? 'asc' : 'desc',
			};
		} else {
			delete query.order_by;
			delete query.order_type;
		}

		navigate({
			pathname: location.pathname,
			search: stringifyQueryParams(query),
		});
	};

	const getRecords = async (query) => {
		try {
			setIsTableLoading(true);
			const response = await getPayoutOrders(query);
			// alert(response.total_records)
			setOrderOverview({
				total_records: response.total_records,
				unpaid_records: response.unpaid_records,
				paid_records: response.paid_records,
				fulfillment_processing_records: response.fulfillment_processing_records,
				
			});
			setRecords(response.records);
			setPage(response.page);
			setPerPage(response.per_page);
			setTotalCount(response.total_records);
		} catch (err) {
			console.log(err);
		} finally {
			setIsTableLoading(false);
		}
	};

	useEffect(() => {
		const query = parseQueryParams(location);
		setFilter(query);
		getRecords(query);
	}, [location]);



	return (
		<div className="overview-content">
			
			<div className="overview-main">
				<div>
					<OverviewCardByDate />
				</div>
				<div className='mt-16'>
					<PaymentChart />
				</div>
				
			</div>
		</div>
	);
};

export default Overview;
