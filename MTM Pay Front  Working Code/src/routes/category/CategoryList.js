import { Spin, Table, Button, Typography } from 'antd';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getCategories } from 'requests/category';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import CurrenViewing from 'routes/category/CurrentViewing';

const { Text } = Typography;

const CategoryList = () => {
	const [isTableLoading, setIsTableLoading] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const [perPage, setPerPage] = React.useState(process.env.REACT_APP_RECORDS_PER_PAGE);
	const [totalCount, setTotalCount] = React.useState(0);
	const [records, setRecords] = React.useState([]);
	const searchRef = useRef(null);
	const location = useLocation();
	const navigate = useNavigate();

	const titles = [{ path: location.pathname, title: 'Categories' }];

	const columns = [
		{
			title: 'ID',
			key: 'id',
			dataIndex: 'id',
		},
		{
			title: 'Name',
			key: 'name',
			dataIndex: 'name',
			render: (text, record) => {
				return <Button type="link">{text}</Button>;
			},
			width: 250,
		},
		{
			title: 'Store Name',
			key: 'store_name',
			dataIndex: 'store_name',
			render: (text, record) => {
				return <Link to={`/stores/${record.store_id}`}>{record.store?.store_name}</Link>;
			},
		},

		{
			title: 'Parent name',
			key: 'parent_name',
			dataIndex: 'parent_name',
			render: (text, record) => {
				return record.parent ? record.parent.name : '';
			},
		},

		{
			title: 'Product count',
			key: 'product_count',
			dataIndex: 'product_count',
			align: 'center',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (text, record) => (
				<div>{text ? <Text type="success">Active</Text> : <Text type="danger">Inactived</Text>}</div>
			),
		},
	];

	const getRecords = async (query) => {
		try {
			setIsTableLoading(true);
			const response = await getCategories(query);
			setIsTableLoading(false);
			setRecords(response.records);
			setPage(response.page);
			setPerPage(response.per_page);
			setTotalCount(response.total_records);
		} catch (err) {
			console.log(err);
		}
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

	const onRefresh = () => {
		let query = parseQueryParams(location);
		query = {
			page: 1,
			keyword: '',
		};

		navigate({
			pathname: location.pathname,
			search: stringifyQueryParams(query),
		});

		if (searchRef.current?.input.value) {
			searchRef.current.handleReset();
		}
	};

	useEffect(() => {
		const query = parseQueryParams(location);
		getRecords(query);
	}, [location]);

	const onChangeTable = (pagination) => {
		console.log(pagination);

		let query = parseQueryParams(location);
		query = {
			...query,
			page: pagination.current,
			per_page: pagination.pageSize,
		};

		navigate({
			pathname: location.pathname,
			search: stringifyQueryParams(query),
		});
	};
	return (
		<div>
			<PageTitle titles={titles} />
			<TableBar onSearch={onSearch} showFilter={false} inputRef={searchRef} />
			<CurrenViewing onRefresh={onRefresh} />
			<Spin spinning={isTableLoading}>
				<Table
					style={{ marginTop: '10px' }}
					dataSource={records}
					columns={columns}
					onChange={onChangeTable}
					rowKey={'id'}
					pagination={{
						pageSize: perPage,
						total: totalCount,
						current: page,
					}}
				/>
			</Spin>
		</div>
	);
};

export default CategoryList;
