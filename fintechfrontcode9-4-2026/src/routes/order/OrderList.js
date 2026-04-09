import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Space, Row, Divider, DatePicker, Modal } from 'antd';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import FilterActionBar from './FilterActionBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { toast } from 'react-toast';
import { omitBy, isEmpty, debounce } from 'lodash';
import { ChevronDownIcon, RefreshIcon, MenuAlt1Icon, ViewGridIcon } from '@heroicons/react/outline';
import { BaseSelect } from 'components/Elements';
import OrderCardView from './OrderCardView';
import OrderListView from './OrderListView';
// styles
import 'assets/styles/orders.scss';
// request
import { getOrders, exportOrders } from 'requests/order';

const { RangePicker } = DatePicker;

const titles = [{ path: '/transaction', title: 'Transaction' }];

function OrderList() {
	const location = useLocation();
	const navigate = useNavigate();

	const searchRef = useRef(null);
	const [isTableLoading, setIsTableLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
	const [totalCount, setTotalCount] = useState(0);
	const [records, setRecords] = useState([]);
	const [isShowFilter, setIsShowFilter] = useState(false);
	const [orderOverview, setOrderOverview] = useState({
		total_records: 0,
		unpaid_records: 0,
		paid_records: 0,
		fulfillment_processing_records: 0,
	});
	const [view, setView] = useState('list');
	const [filter, setFilter] = useState(null);
	const [selectedRecords, setSelectedRecords] = useState([]);

	const config = useSelector(state => state.config);

	useEffect(() => {
		const query = parseQueryParams(location);
		setFilter(query);
		getRecords(query);
	}, [location]);

	const getRecords = async (query) => {
		try {
			setIsTableLoading(true);
			const response = await getOrders(query);
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

	const onRefresh = () => {
		setView('list');
		setTimeout(() => {
			navigate({
				pathname: location.pathname,
				search: stringifyQueryParams({}),
			});
			if (searchRef.current?.input.value) {
				searchRef.current.handleReset();
			}
		}, 1000);
	};


	// const onExport = async () => {
	// 	try {
	// 		let query = parseQueryParams(location);
	// 		console.log(query);
	// 		setIsTableLoading(true);
	// 		const response = await exportOrders(query);
	// 		alert(response.filepath);
	// 		window.open(`${process.env.REACT_APP_ASSET_URL}${response.filepath}`, '_blank');

	// 	} catch (err) {
	// 		toast.error('An error occurred. Please try again.');
	// 	} finally {
	// 		setIsTableLoading(false);
	// 	}
	// }


	const onExport = async () => {
		try {
			let query = parseQueryParams(location);
			// console.log(query);
			setIsTableLoading(true);
			const response = await exportOrders(query);
	
			if (response && response.filepath) {
				// alert(process.env.REACT_APP_ASSET_URL);
				// alert(response.filepath);
				window.open(`https://api.step2pay.online/files/${response.filepath}`, '_blank');
				
			} else {
				throw new Error('Invalid response data');
			}
		} catch (err) {
			console.error(err);
			toast.error('An error occurred. Please try again.');
		} finally {
			setIsTableLoading(false);
		}
	};



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

	const onSaveFilter = () => {
		const saveFilterData = omitBy(filter, isEmpty);
		navigate({
			pathname: location.pathname,
			search: stringifyQueryParams(saveFilterData),
		});
	};

	const onSearch = (keyword) => {
		let query = parseQueryParams(location);
		query = {
			...query,
			page: 1,
			keyword: keyword,
		};

		navigate({
			pathname: location.pathname,
			search: stringifyQueryParams(query),
		});
	};

	const onToggleFilter = () => {
		setIsShowFilter(!isShowFilter);
	};

	const onChangeFilter = (name, e, isMuilty = false) => {
		if (isMuilty) {
			setFilter((preState) => ({ ...preState, [name]: e.join(',') }));
		} else {
			setFilter((preState) => ({ ...preState, [name]: e }));
		}
	};

	const onChangeView = (value) => {
		setView(value);
	};

	const onChangePaymentStatus = (value) => {
		let query = parseQueryParams(location);

		if (value) {
			query = {
				...query,
				payment_status: value
			};
		} else {
			delete query.payment_status;
		}
		
		navigate({
			pathname: location.pathname,
			search: stringifyQueryParams(query),
		});
	}

	const onChangeDates = (dates) => {
		let query = parseQueryParams(location);

		if (dates[0] && dates[1]) {
			query = {
				...query,
				created_at_date_min: dayjs(dates[0]).format('YYYY-MM-DD'),
				created_at_date_max: dayjs(dates[1]).format('YYYY-MM-DD'),
			};
		} else {
			delete query.created_at_date_min;
			delete query.created_at_date_max;
		}
		
		navigate({
			pathname: location.pathname,
			search: stringifyQueryParams(query),
		});
	}

	// const onExport = async () => {
	// 	try {
	// 		let query = parseQueryParams(location);

	// 		setIsTableLoading(true);
	// 		const response = await exportOrders(query);
	// 		window.open(`${process.env.REACT_APP_ASSET_URL}${response.filepath}`, '_blank');
	// 	} catch (err) {
	// 		toast.error('An error occurred. Please try again.');
	// 	} finally {
	// 		setIsTableLoading(false);
	// 	}
	// }
	
	

	return (
		<div className="wrap-orders">
			<PageTitle titles={titles} />
			<TableBar
				placeholderInput="Order ID/Customer details/tax invoice/item details"
				children={
					<Space className="mb-8 action-button">
						<BaseSelect 
							options={config.pay_statuses}
							optionLabel='display'
							optionValue='value'
							defaultText='All Transaction'
							selected=''
							className='mr-32 radius-0'
							style={{ width: '230px',borderRadius:'0px' }} 
							onChange={(value) => onChangePaymentStatus(value)}
						/>
						<RangePicker
						onCalendarChange={(newDates) => onChangeDates(newDates)}
						style={{ height: '50px' }}
						/>
						<Button type="primary" size='large' onClick={onExport}>Export</Button>
					</Space>
				}
				onSearch={onSearch}
				onFilter={onToggleFilter}
				isActiveFilter={isShowFilter}
				inputRef={searchRef}
				showFilter={false}
			/>
			<Row className="mt8 mb-24" align='middle'>
				<span className="weight-6 size-16 ">Currently viewing: </span>
				<div className="weight-6 size-16 link ml-8">
				All Transaction
				</div>

				<Divider type="vertical" />
				<Button
					type="primary"
					className="btn1"
					onClick={onRefresh}
					icon={<RefreshIcon className="mr-8 icon-btn" />}
				>
					Refresh
				</Button>
			</Row>
			{
				view === 'card' ? (
					<OrderCardView
						view={view}
						records={records}
						isTableLoading={isTableLoading}
						pagination={{
							pageSize: perPage,
							total: totalCount,
							current: page,
							onChange: (page, pageSize) => onChangeTable({ current: page, pageSize: pageSize }, {}, {}, {})
						}}
						selectedRecords={selectedRecords}
						onSelectRecords={setSelectedRecords}
					/>
				) : (
					<OrderListView
						records={records}
						isTableLoading={isTableLoading}
						pagination={{
							pageSize: perPage,
							total: totalCount,
							current: page,
							// onChange: onChangeTable
						}}
						selectedRecords={selectedRecords}
						onChangeTable={onChangeTable}
						onSelectRecords={setSelectedRecords}
					/>
				)
			}
			{/* <FilterDrawer
				isCartFilter={false}
				orders={orderOverview}
				visible={isShowFilter}
				onClose={onToggleFilter}
				onSaveFilter={onSaveFilter}
				filterData={filter}
				onChangeFilter={onChangeFilter}
			/> */}
		</div>
	);
}

export default OrderList;
