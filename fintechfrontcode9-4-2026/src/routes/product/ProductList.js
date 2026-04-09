import { Spin, Table, Image } from 'antd';

import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getProducts } from 'requests/product';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import CurrenViewing from 'routes/product/CurrentViewing';

const ProductList = () => {
	const [isTableLoading, setIsTableLoading] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const [perPage, setPerPage] = React.useState(process.env.REACT_APP_RECORDS_PER_PAGE);
	const [totalCount, setTotalCount] = React.useState(0);
	const [records, setRecords] = React.useState([]);
	const searchRef = useRef(null);
	const location = useLocation();
	const navigate = useNavigate();

	const titles = [{ path: location.pathname, title: 'Products' }];

	const columns = [
		{
			title: 'ID',
			key: 'id',
			dataIndex: 'id',
		},
		{
			title: 'Image',
			key: 'image',
			render: (text, record) => {
				if (record.image) {
					return <Image src={record.image} width={61} />;
				} else {
					return '';
				}
			},
		},
		{
			title: 'SKU',
			key: 'sku',
			dataIndex: 'sku',
		},
		{
			title: 'Name',
			key: 'name',
			dataIndex: 'name',
			render: (text, record) => <Link to={`${location.pathname}/${record.id}`}>{text}</Link>,
			width: 250,
		},
		{
			title: 'Length',
			key: 'length',
			dataIndex: 'length',
		},
		{
			title: 'Width',
			key: 'width',
			dataIndex: 'width',
		},
		{
			title: 'Height',
			key: 'height',
			dataIndex: 'height',
		},
		{
			title: 'Weight',
			key: 'weight',
			dataIndex: 'weight',
		},
		{
			title: 'Quantity',
			key: 'quantity',
			dataIndex: 'quantity',
		},
		{
			title: 'Price',
			key: 'price',
			dataIndex: 'price',
		},
		// {
		// 	title: 'Tax rate',
		// 	key: 'tax',
		// 	dataIndex: 'tax',
		// },
		{
			title: 'HSN/SAC',
			key: 'hsn',
			dataIndex: 'hsn',
		},
		{
			title: 'Variations',
			key: 'variations',
			dataIndex: 'variations',
			render: (text, record) => {
				return record.variations ? record.variations.length : 0;
			},
			align: 'center',
		},
	];

	const getRecords = async (query) => {
		try {
			setIsTableLoading(true);
			const response = await getProducts(query);
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
			<TableBar
				onSearch={onSearch}
				showFilter={false}
				placeholderInput="Order ID/Customer details/tax invoice/item details"
				inputRef={searchRef}
			/>
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

export default ProductList;
