import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Modal, Table, Button, Switch } from 'antd';
import parse from 'html-react-parser';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { TrashIcon } from '@heroicons/react/outline';
import PageTitle from 'components/PageTitle';
import PlanCreateForm from 'routes/plan/PlanCreateForm';
// request
import { getCurrencies } from 'requests/currency';
import { getPlans, createPlan, deletePlan, updatePlan } from 'requests/plan';
import PlanUpdateForm from './PlanUpdateForm';

const PlanList = () => {
	const [currencies, setCurrencies] = useState([]);
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
	const [totalCount, setTotalCount] = useState(0);
	const [records, setRecords] = useState([]);
	const [visibleCreateForm, setVisibleCreateForm] = useState(false);
	const [visibleUpdateForm, setVisibleUpdateForm] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState(null);
	const config = useSelector((state) => state.config);

	const location = useLocation();
	const navigate = useNavigate();

	const planTypeOptions = config.plan_types;

	const titles = [{ path: location.pathname, title: 'Plans' }];

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			sorter: true,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text, record) => (
				<Button className="p-0" type="link" onClick={() => onEdit(record)}>
					{text}
				</Button>
			),
			sorter: true,
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			render: (text) => (
				<div>{parse(text)}</div>
			)
		},
		{
			title: 'Price',
			dataIndex: 'monthly_price',
			key: 'monthly_price',
			render: (text, record) => (
				<div>
					<div><strong>{text}{record.currency?.symbol}</strong>/mo</div>
					<div><strong>{record.monthly_price_paid_annual}{record.currency?.symbol}</strong>/mo paid annual</div>
				</div>
			)
		},
		{
			title: 'Discount',
			dataIndex: 'discount',
			key: 'discount',
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			render: (text) => {
				const types = planTypeOptions.filter((item) => item.value === text);
				return <span>{types[0]?.display}</span>;
			},
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
			title: 'Actions',
			render: (text, record) => (
				<Button danger type="link" size="small" onClick={() => onDelete(record.id)}>
					<TrashIcon width={24} height={24} />
				</Button>
			),
		},
	];

	useEffect(() => {
		const fetchCurrencies = async () => {
			try {
				const data = await getCurrencies({ is_paginate: 0 });
				setCurrencies(data.records);
			} catch (error) {
				console.log(error);
			}
		};
		fetchCurrencies();
	}, []);

	useEffect(() => {
		const query = parseQueryParams(location);
		getRecords(query);
	}, [location]);

	const onUpdateStatus = async (data) => {
		try {
			await updatePlan(data.id, { status: data.status === 0 ? 1 : 0 });

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
			const response = await getPlans(query);
			setRecords(response.records);
			setPage(response.page);
			setPerPage(response.per_page);
			setTotalCount(response.total_records);
		} catch (err) {
			console.log(err);
		}
	};

	const onToggleCreateForm = () => {
		setVisibleCreateForm(!visibleCreateForm);
	};

	const onCreate = async (data) => {
		try {
			await createPlan(data);

			// refresh list
			navigate({
				pathname: location.pathname,
				search: stringifyQueryParams({}),
			});
		} catch (err) {
			console.log(err);
		}
	};

	const onEdit = (plan) => {
		setSelectedPlan(plan);
		onToggleUpdateForm();
	};

	const onToggleUpdateForm = () => {
		// in case hide update form, set selected module is null
		if (visibleUpdateForm) setSelectedPlan(null);

		setVisibleUpdateForm(!visibleUpdateForm);
	};

	const onUpdate = async (data) => {
		try {
			await updatePlan(selectedPlan.id, data);

			// refresh list
			navigate({
				pathname: location.pathname,
				search: stringifyQueryParams({}),
			});
		} catch (err) {
			console.log(err);
		}
	};

	const onDelete = (id) => {
		Modal.confirm({
			title: 'Warning',
			content: 'Are you sure to delete this record?',
			onOk: async () => {
				await deletePlan(id);
				// refresh list
				navigate({
					pathname: location.pathname,
					search: stringifyQueryParams({}),
				});
			},
		});
	};

	return (
		<div>
			<PageTitle titles={titles} />
			<TableBar showFilter={false} onSearch={onSearch} />
			<Row className="mb-16" justify="end">
				<Button type="primary" onClick={onToggleCreateForm}>
					Create new plan
				</Button>
			</Row>
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
			<PlanCreateForm
				currencies={currencies}
				visible={visibleCreateForm}
				onClose={onToggleCreateForm}
				onSubmit={onCreate}
			/>
			{selectedPlan ? (
				<PlanUpdateForm
					currencies={currencies}
					record={selectedPlan}
					visible={visibleUpdateForm}
					onClose={onToggleUpdateForm}
					onSubmit={onUpdate}
				/>
			) : null}
		</div>
	);
};

export default PlanList;
