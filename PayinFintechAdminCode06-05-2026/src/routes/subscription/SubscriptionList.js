import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import { Table, Switch, Tag } from 'antd';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import PageTitle from 'components/PageTitle';
// requests
import { getSubscriptions, updateSubscription } from 'requests/subscription';

const SubscriptionList = () => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
	const [totalCount, setTotalCount] = useState(0);
	const [records, setRecords] = useState([]);

	const location = useLocation();
	const navigate = useNavigate();

	const titles = [{ path: location.pathname, title: 'Subscriptions' }];

	useEffect(() => {
		const query = parseQueryParams(location);
		getRecords(query);
	}, [location]);

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			sorter: true,
		},
		{
			title: 'User',
			render: (text, record) => (
				<div>
                    <Link to={`/users/${record.user.id}`}>{record.user.full_name}</Link>
                    <div><small>{record.user.email}</small></div>
                    <div><small>{record.user.mobile}</small></div>
                </div>
			)
		},
		{
			title: 'Plan',
			render: (text, record) => (
				<div>
                    <div>{record.plan.name}</div>
                    <div>{record.plan.is_trial_plan ? <Tag color="purple">trial</Tag> : null}</div>
                </div>
			)
		},
        {
			title: 'Start date',
			dataIndex: 'start_date',
			key: 'start_date',
		},
		{
			title: 'End date',
			dataIndex: 'end_date',
			key: 'end_date',
		},
        {
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
            render: (text, record) => (
                <div>{record.plan.currency.symbol}{text}</div>
            )
		},
        {
			title: 'Type',
			dataIndex: 'plan_type',
			key: 'plan_type',
            render: (text) => (
                <Tag color={text === 'monthly' ? 'cyan' : 'gold'}>{text}</Tag>
            )
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (text, record) => {
				return (
					<Switch
						checked={text === 0 ? false : true}
						checkedChildren="Active"
						unCheckedChildren="Inactive"
						onChange={() => onUpdateStatus(record)}
					/>
				);
			},
		},
        {
			title: 'Subscribed at',
			dataIndex: 'created_at',
			key: 'created_at',
            render: (text) => (
                <div>{moment(text).format('YYYY-MM-DD HH:mm')}</div>
            )
		},
	];

	const onUpdateStatus = async (data) => {
		try {
			await updateSubscription(data.id, { status: data.status === 0 ? 1 : 0 });

			// refresh list
			navigate({
				pathname: location.pathname,
				search: stringifyQueryParams({}),
			});
		} catch (err) {
			console.log(err);
		}
	};

	const onChangeTable = (pagination, filters, sorter, extra) => {
		console.log(pagination, filters, sorter, extra);

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

	const getRecords = async (query) => {
		try {
			const response = await getSubscriptions(query);
			setRecords(response.records);
			setPage(response.page);
			setPerPage(response.per_page);
			setTotalCount(response.total_records);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<PageTitle titles={titles} />
			<Table
				columns={columns}
				dataSource={records}
				rowKey="id"
				onChange={onChangeTable}
				pagination={{
					pageSize: perPage,
					total: totalCount,
					current: page,
				}}
			/>
		</div>
	);
};

export default SubscriptionList;
