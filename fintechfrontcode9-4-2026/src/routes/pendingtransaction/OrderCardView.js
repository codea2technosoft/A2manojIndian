import React, { useEffect, useState } from 'react';
import { Row, Space, Checkbox, List, Pagination } from 'antd';
import PropTypes from 'prop-types';
import OrderCard from 'components/OrderCard';

const OrderCardView = ({ records, isTableLoading, pagination, selectedRecords, onSelectRecords }) => {
	const [selectedOrders, setSelectedOrders] = useState([]);

	useEffect(() => {
		setSelectedOrders(selectedRecords);
	}, [selectedRecords]);

	const onToggleSelectOrder = (orderId) => {
		let newSelectedOrders = [...selectedRecords];
		if (newSelectedOrders.includes(orderId)) {
			// remove order
			newSelectedOrders = newSelectedOrders.filter(item => item !== orderId);
		} else {
			// add order
			newSelectedOrders.push(orderId);
		}

		onSelectRecords(newSelectedOrders);
	}

	return (
		<div>
			<List
				className='order-card-list'
				itemLayout="vertical"
				size='large'
				bordered
				loading={isTableLoading}
				dataSource={records}
				renderItem={item => (
					<List.Item>
						<OrderCard
							selected={selectedOrders.includes(item.id)}
							order={item}
							onToggleSelectOrder={onToggleSelectOrder}
						/>
					</List.Item>
				)}
			/>
			<Row justify='end' className='mt-24'>
				<Pagination {...pagination} />
			</Row>
		</div>
	)
}

OrderCardView.propTypes = {
	records: PropTypes.arrayOf(PropTypes.object).isRequired,
	isTableLoading: PropTypes.bool.isRequired,
	pagination: PropTypes.object.isRequired,
	onSelectOrders: PropTypes.func
};

export default OrderCardView;
