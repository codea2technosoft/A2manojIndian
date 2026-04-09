import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Switch } from 'antd';
// requests
import { getServices } from 'requests/service';

function PaymentGateway(props) {
	const { platform, gateways, onUpdateData } = props;

	const columns = [
		{
			title: 'Available payment gateway',
			render: (text, record) => (
				<strong>{record.name}</strong>
			)
		},
		{
			title: 'Status',
			render: (text, record) => (
				<Switch
					defaultChecked={record.status}
					onChange={(checked) => onUpdateData(`platform.${platform}.gateway.${record.name}.status`, Number(checked))}
				/>
			)
		},
	];
	const [items, setItems] = useState([]);

	useEffect(() => {
		const items = [];
		Object.keys(gateways).forEach(key => {
			let item = {
				index: items.length,
				name: gateways[key].name,
				status: !!gateways[key].status,
			};

			items.push(item);
		});
		setItems(items);
	}, [gateways]);

	return (
		<Table
			rowKey={'index'}
			dataSource={items}
			columns={columns}
			pagination={false}
		/>
	);
}

PaymentGateway.propTypes = {};

export default PaymentGateway;


// const PaymentGateway = () => {
// 	const columns = [
// 		{
// 			title: 'Available payment gateway',
// 			render: (text, record) => (
// 				<strong>{record.name}</strong>
// 			)
// 		},
// 		{
// 			title: 'Status',
// 			render: (text, record) => (
// 				<Switch
// 					defaultChecked={true}
// 					onChange={(checked) => onUpdateData(`platform.${platform}.gateway.${record.name}.status`, Number(checked))}
// 				/>
// 			)
// 		},
// 	];

// 	useEffect(() => {
// 		const getData = async () => {
// 			const services = await getServices(1, { is_paginate: 0, order_by: 'id', order_type: 'asc' });

// 			console.log(services);
// 		}

// 		getData();
// 	}, []);

// 	return (
// 		<div></div>
// 	)
// }

// export default PaymentGateway;