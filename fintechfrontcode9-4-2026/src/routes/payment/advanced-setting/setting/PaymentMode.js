import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Switch } from 'antd';

function PaymentMode(props) {
	const { platform, records, onUpdateData } = props;
	const columns = [
		{
			title: 'Payment modes',
			render: (text, record) => (
				<strong>{record.name}</strong>
			)
		},
		{
			title: 'Status',
			render: (text, record) => (
				<Switch
					defaultChecked={record.status}
					onChange={(checked) => onUpdateData(`platform.${platform}.rate_item.${record.index}.status`, Number(checked))}
				/>
			)
		},
		{
			title: 'Gateway',
			dataIndex: 'gateway',
			key: 'gateway'
		},
		{
			title: 'Rate',
			dataIndex: 'rate',
			key: 'rate'
		},
		{
			title: 'Failover',
			dataIndex: 'failover',
			key: 'failover'
		},
	];
	const [items, setItems] = useState([]);

	useEffect(() => {
		const items = [];
		Object.keys(records).forEach(key => {
			let item = {
				index: key,
				name: records[key].name,
				status: !!records[key].status,
				gateway: records[key].gateway.name,
				rate: records[key].gateway.data.value,
				failover: records[key].failover.name,
			};

			items.push(item);
		});
		setItems(items);
	}, [records]);

	return (
		<Table
			rowKey={'index'}
			dataSource={items}
			columns={columns}
			pagination={false}
		/>
	);
}

PaymentMode.propTypes = {};

export default PaymentMode;
