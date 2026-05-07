import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Modal, Table, Button, Switch } from 'antd';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { getModules, createModule, deleteModule, updateModule } from 'requests/module';
import { TrashIcon } from '@heroicons/react/outline';
import PageTitle from 'components/PageTitle';
import ModuleCreateForm from 'routes/module/ModuleCreateForm';
import ModuleUpdateForm from 'routes/module/ModuleUpdateForm';
import { useSelector } from 'react-redux';

const Module = () => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
	const [totalCount, setTotalCount] = useState(0);
	const [records, setRecords] = useState([]);
	const [moduleParent, setModuleParent] = useState([]);
	const [visibleCreateForm, setVisibleCreateForm] = useState(false);
	const [visibleUpdateForm, setVisibleUpdateForm] = useState(false);
	const [selectedModule, setSelectedModule] = useState(null);

	const config = useSelector(state => state.config);

	const location = useLocation();
	const navigate = useNavigate();

	const titles = [{ path: location.pathname, title: 'Modules' }];

	const onUpdateStatus = async (data) => {
		try {
			await updateModule(data.id, { status: data.status === 0 ? 1 : 0 });

			// refresh list
			navigate({
				pathname: location.pathname,
				search: stringifyQueryParams({}),
			});
		} catch (err) {
			console.log(err);
		}
	};

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
		},
		{
			title: 'Icon URL',
			dataIndex: 'icon_url',
			key: 'icon_url',
		},
		{
			title: 'Type',
			dataIndex: 'type',
			key: 'type',
			render: (text, record) => {
				const type = config.module_types.filter((item) => item.value === record.type);
				return <div>{type[0]?.display}</div>;
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
		const query = parseQueryParams(location);
		getRecords(query);
	}, [location]);

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
			const response = await getModules(query);
			const tranData = response.records.map((item) => {
				if (item.children.length === 0) {
					delete item.children;
				}
				return item;
			});
			const moduleFilter = response.records
				.filter((item) => item.parent_id === null)
				.map((item) => ({ id: item.id, name: item.name }));
			setRecords(tranData);
			setModuleParent(moduleFilter);
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
			await createModule(data);

			// refresh list
			navigate({
				pathname: location.pathname,
				search: stringifyQueryParams({}),
			});
		} catch (err) {
			console.log(err);
		}
	};

	const onEdit = (module) => {
		setSelectedModule(module);
		onToggleUpdateForm();
	};

	const onToggleUpdateForm = () => {
		// in case hide update form, set selected module is null
		if (visibleUpdateForm) setSelectedModule(null);

		setVisibleUpdateForm(!visibleUpdateForm);
	};

	const onUpdate = async (data) => {
		try {
			await updateModule(selectedModule.id, data);

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
				await deleteModule(id);
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
					Create new module
				</Button>
			</Row>
			<Table
				columns={columns}
				dataSource={records}
				rowKey="id"
				onChange={onChangeTable}
				indentSize={25}
				pagination={{
					pageSize: perPage,
					total: totalCount,
					current: page,
				}}
			/>
			<ModuleCreateForm
				visible={visibleCreateForm}
				onClose={onToggleCreateForm}
				onSubmit={onCreate}
				moduleData={moduleParent}
				types={config.module_types}
			/>
			{selectedModule ? (
				<ModuleUpdateForm
					record={selectedModule}
					visible={visibleUpdateForm}
					onClose={onToggleUpdateForm}
					onSubmit={onUpdate}
					moduleData={moduleParent}
					types={config.module_types}
				/>
			) : null}
		</div>
	);
};

export default Module;
