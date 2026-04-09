import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Input } from 'antd';

function TransactionRate(props) {
	const { services, rates, onUpdateData } = props;

	const [columns, setColumns] = useState([
		{
			title: 'Payment modes',
			render: (text, record) => (
				<strong>{record.name}</strong>
			)
		}
	]);
	const [items, setItems] = useState([]);

	useEffect(() => {
		const serviceColumns = services.map(service => {
			return {
				title: service.name,
				render: (text, record) => (
					<Input 
						defaultValue={record[service.name]} 
						onChange={(e) => onUpdateData(`rate.${record.index}.data.${service.name}.data.value`, e.target.value)}
					/>
				)
			}
		});

		setColumns([...columns, ...serviceColumns]);
	}, []);

	useEffect(() => {
		const items = [];
		Object.keys(rates).forEach(key => {
			let item = {
				index: key,
				name: rates[key].name
			}
			Object.values(rates[key].data).forEach(elem => {
				item[elem.name] = elem?.data?.value || 0;
			});

			items.push(item);
		});
		setItems(items);
	}, [rates]);

	return (
		<div>
			<p>
				You are required to set the transaction rates approved for your account by the payment gateway. By
				default normal transaction rates will be auto filled for each enabled gateway. If you have applied for
				the gateways via our platform, then the discounted transaction rates will apply automatically.
			</p>
			<Table
				rowKey={'index'}
				dataSource={items}
				columns={columns}
				pagination={false}
			/>
		</div>
	);
}

export default TransactionRate;
