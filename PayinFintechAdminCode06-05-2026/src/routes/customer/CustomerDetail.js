import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Divider, Descriptions, Modal } from 'antd';
import _ from 'lodash';
import { getCustomer, createCustomerAddress, deleteCustomerAddress } from 'requests/customer';
import PageTitle from 'components/PageTitle';
import Loading from 'components/Loading';
import AddressList from './address/AddressList';
import moment from 'moment';
import { stringifyQueryParams } from 'utils/url';

const CustomerDetail = () => {
	const [loading, setLoading] = useState(true);
	const [record, setRecord] = useState(null);
	const [titles, setTitles] = useState([{ path: '/customers', title: 'Customers' }]);

	const location = useLocation();

	const navigate = useNavigate();
	const params = useParams();

	useEffect(() => {
		getData();
	}, [params]);

	const getData = async () => {
		try {
			const record = await getCustomer(params.id);
			setTitles([{ path: '/customers', title: 'Customers' }]);
			setRecord(record);
			setLoading(false);
		} catch (err) {
			console.log(err);
		}
	};

	const onDeleteAddress = (customerId, id) => {
		Modal.confirm({
			title: 'Warning',
			content: 'Are you sure to delete this record?',
			onOk: async () => {
				try {
					await deleteCustomerAddress(customerId, id);
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
			await createCustomerAddress(record.id, data);
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
			{loading ? (
				<Loading />
			) : (
				<React.Fragment>
					<PageTitle titles={titles} />

					<Divider orientation="left" orientationMargin={0}>
						Detail
					</Divider>
					<Descriptions>
						<Descriptions.Item label="Email">{record.email}</Descriptions.Item>
						<Descriptions.Item label="Default Address">{record.default_address}</Descriptions.Item>
						<Descriptions.Item label="Group">{record.group}</Descriptions.Item>
						<Descriptions.Item label="Channel">{record.channel}</Descriptions.Item>
						<Descriptions.Item label="Count Order">{record.count_order}</Descriptions.Item>
						<Descriptions.Item label="Created At">
							{moment(record.created_at).format('YYYY-MM-DD HH:mm')}
						</Descriptions.Item>
						<Descriptions.Item label="Updated At">
							{moment(record.updated_at).format('YYYY-MM-DD HH:mm')}
						</Descriptions.Item>
					</Descriptions>
					<Divider orientation="left" orientationMargin={0}>
						Addresses
					</Divider>
					<AddressList data={record.addresses} onCreate={onCreateAddress} onDelete={onDeleteAddress} />
				</React.Fragment>
			)}
		</div>
	);
};

export default CustomerDetail;
