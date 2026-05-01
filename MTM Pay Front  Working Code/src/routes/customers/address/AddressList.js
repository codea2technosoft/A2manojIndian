import PropTypes from 'prop-types';
import { useState } from 'react';
import { Table, Button, Row } from 'antd';
import { TrashIcon, CheckIcon } from '@heroicons/react/outline';
import AddressCreateForm from 'routes/customers/address/AddressCreateForm';

const AddressList = (props) => {
	const { data, onDelete, onCreate } = props;

	const [visibleCreateForm, setVisibleCreateForm] = useState(false);

	const onToggleCreateForm = () => {
		setVisibleCreateForm(!visibleCreateForm);
	};

	const columns = [
		{
			title: 'First Name',
			dataIndex: 'first_name',
			key: 'first_name',
		},
		{
			title: 'Last Name',
			dataIndex: 'last_name',
			key: 'last_name',
		},
		{
			title: 'Mobile',
			dataIndex: 'mobile',
			key: 'mobile',
		},
		{
			title: 'Street',
			dataIndex: 'street',
			key: 'street',
		},
		{
			title: 'City',
			dataIndex: 'city',
			key: 'city',
		},

		{
			title: 'Country',
			dataIndex: 'country_name',
			key: 'country_name',
		},
		{
			title: 'Postal Code',
			dataIndex: 'postal_code',
			key: 'postal_code',
		},
		{
			title: 'Default',
			dataIndex: 'is_default',
			key: 'is_default',
			render: (is_default) => 
				is_default == 1? <CheckIcon className='icon-btn text-primary'/> : <></>
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

	return (
		<div>
			<Row className="mb-16" justify="end" onClick={() => onToggleCreateForm()}>
				<Button type="primary">Create new address</Button>
			</Row>
			<Table columns={columns} dataSource={data} rowKey="id" />
			<AddressCreateForm visible={visibleCreateForm} onClose={onToggleCreateForm} onSubmit={onCreate} />
		</div>
	);
};

AddressList.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	onDelete: PropTypes.func,
	onCreate: PropTypes.func,
};

AddressList.defaultProp = {
	onDelete: () => {},
	onCreate: () => {},
};

export default AddressList;
