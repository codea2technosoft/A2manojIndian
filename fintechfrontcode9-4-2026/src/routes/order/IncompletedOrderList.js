import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Space, Row, Divider, Select, Modal } from 'antd';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import FilterActionBar from './FilterActionBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import FilterDrawer from './FilterDrawer';
import { omitBy, isEmpty } from 'lodash';
import { ChevronDownIcon, RefreshIcon, MenuAlt1Icon, ViewGridIcon } from '@heroicons/react/outline';
import OrderCardView from './OrderCardView';
import OrderListView from './OrderListView';
// styles
import 'assets/styles/orders.scss';
// request
import { getOrders } from 'requests/order';

const titles = [{ path: '/abandoned-carts', title: 'Abandoned Carts' }];

function IncompletedOrderList() {
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
	const [view, setView] = useState('card');
	const [filter, setFilter] = useState(null);
	const [selectedRecords, setSelectedRecords] = useState([]);

	useEffect(() => {
		const query = parseQueryParams(location);
        query.payment_status = 6;

		setFilter(query);
		getRecords(query);
	}, [location]);

	const getRecords = async (query) => {
		try {
			setIsTableLoading(true);
			const response = await getOrders(query);
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
		setView('card');
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

	return (
		<div className="wrap-orders">
			<PageTitle titles={titles} />
			<TableBar
				placeholderInput="Order ID/Customer details/tax invoice/item details"
				children={null}
				onSearch={onSearch}
				onFilter={onToggleFilter}
				isActiveFilter={isShowFilter}
				inputRef={searchRef}
			/>
			<Row className="mt8 mb-24" align='middle'>
				<span className="weight-6 size-16 ">Currently viewing: </span>
				<div className="weight-6 size-16 link ml-8">
					All Orders
				</div>
				<Divider type="vertical" />
				<Select value={view} onChange={onChangeView} bordered={false}>
					<Select.Option value={'card'}>
						<Button className="weight-6 size-16" type="link" icon={<ViewGridIcon className="mr-8 icon-btn" />}>
							Card view
						</Button>
					</Select.Option>
					<Select.Option value={'list'}>
						<Button className="weight-6 size-16" type="link" icon={<MenuAlt1Icon className="mr-8 icon-btn" />}>
							List view
						</Button>
					</Select.Option>
				</Select>

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
			<FilterDrawer
                isCartFilter={true}
				orders={orderOverview}
				visible={isShowFilter}
				onClose={onToggleFilter}
				onSaveFilter={onSaveFilter}
				filterData={filter}
				onChangeFilter={onChangeFilter}
			/>
		</div>
	);
}

export default IncompletedOrderList;
