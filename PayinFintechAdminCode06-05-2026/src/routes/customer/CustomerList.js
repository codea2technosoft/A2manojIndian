import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Modal, Table, Button } from 'antd';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import {
	getCustomers,
	deleteCustomer,
	createCustomer,
	deleteCustomerAddress,
	createCustomerAddress,
} from 'requests/customer';
import CustomerCreateForm from 'routes/customer/CustomerCreateForm';
import { TrashIcon } from '@heroicons/react/outline';
import PageTitle from 'components/PageTitle';
import CustomerAddressList from 'routes/customer/CustomerAddressList';

const CustomerList = () => {
	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
	const [totalCount, setTotalCount] = useState(0);
	const [records, setRecords] = useState([]);
	const [addresses, setAddresses] = useState([]);
	const [visibleCreateForm, setVisibleCreateForm] = useState(false);
	const [visibleAddressList, setVisibleAddressList] = useState(false);
	const [customerId, setCustomerId] = useState(null);

	const location = useLocation();
	const navigate = useNavigate();

	const titles = [{ path: '/customers', title: 'Customers' }];

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			render: (text, record) => <Link to={`${location.pathname}/${record.id}`}>{text}</Link>,
		},
		{
			title: 'Count Order',
			dataIndex: 'count_order',
			key: 'count_order',
			align: 'center',
		},
		{
			title: 'Group',
			dataIndex: 'group',
			key: 'group',
		},
		{
			title: 'Channel',
			dataIndex: 'channel',
			key: 'channel',
		},

		{
			title: 'Addresses',
			dataIndex: 'address',
			key: 'adress',
			align: 'center',
			render: (text, records) => {
				const length = records.addresses ? records.addresses.length : 0;
				if (!length) return null;
				const street = records.addresses[0]?.street || '';
				const city = records.addresses[0]?.city || '';
				return (
					<div>
						<div>{length ? `${street} / ${city}` : ''}</div>
						{length > 1 && (
							<Button
								type="link"
								onClick={() => {
									onToggleAddressLits(records.addresses);
									setCustomerId(records.id);
								}}
							>
								View more
							</Button>
						)}
					</div>
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

	const onChangePagination = (page, pageSize) => {
		let query = parseQueryParams(location);
		query = {
			...query,
			page,
			per_page: pageSize,
		};

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
			const response = await getCustomers(query);
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

	const onToggleAddressLits = (data) => {
		setAddresses(data ? data : []);
		setVisibleAddressList(!visibleAddressList);
	};

	const onCreate = async (data) => {
		try {
			await createCustomer(data);
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
				await deleteCustomer(id);
				// refresh list
				navigate({
					pathname: location.pathname,
					search: stringifyQueryParams({}),
				});
			},
		});
	};

	const onDeleteAddress = (customerId, id) => {
		Modal.confirm({
			title: 'Warning',
			content: 'Are you sure to delete this record?',
			onOk: async () => {
				try {
					await deleteCustomerAddress(customerId, id);
					setAddresses((prevState) => {
						return prevState.filter((item) => item.id !== id);
					});
					// refresh list
					navigate({
						pathname: location.pathname,
						search: stringifyQueryParams({}),
					});
				} catch (error) {
					console.log(error);
				}
			},
		});
	};

	const onCreateAddress = async (data) => {
		try {
			const response = await createCustomerAddress(customerId, data);
			setAddresses([...addresses, response]);
			// refresh list
			navigate({
				pathname: location.pathname,
				search: stringifyQueryParams({}),
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<PageTitle titles={titles} />
			<TableBar showFilter={false} onSearch={onSearch} />
			<Row className="mb-16" justify="end">
				<Button type="primary" onClick={onToggleCreateForm}>
					Create new customer
				</Button>
			</Row>
			<Table
				columns={columns}
				dataSource={records}
				rowKey="id"
				pagination={{
					pageSize: perPage,
					total: totalCount,
					current: page,
					onChange: onChangePagination,
				}}
			/>
			<CustomerCreateForm visible={visibleCreateForm} onClose={onToggleCreateForm} onSubmit={onCreate} />
			<CustomerAddressList
				visible={visibleAddressList}
				onClose={onToggleAddressLits}
				data={addresses}
				onDelete={onDeleteAddress}
				onCreate={onCreateAddress}
			/>
		</div>
	);
};

export default CustomerList;
