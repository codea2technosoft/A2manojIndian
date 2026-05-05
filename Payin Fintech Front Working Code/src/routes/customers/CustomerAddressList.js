import PropTypes from 'prop-types';
import { Modal, Typography } from 'antd';
import AddressList from 'routes/customers/address/AddressList';

const { Title } = Typography;

const CustomerAddressList = (props) => {
	const { visible, onClose, data, onDelete, onCreate } = props;

	const onCancel = () => {
		onClose();
	};

	return (
		<Modal visible={visible} onCancel={onCancel} footer={null} width={900}>
			<Title level={4}>List Address</Title>
			<AddressList data={data} onCreate={onCreate} onDelete={onDelete} />
		</Modal>
	);
};

CustomerAddressList.propTypes = {
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	onDelete: PropTypes.func,
	onCreate: PropTypes.func,
};

CustomerAddressList.defaultProp = {
	onDelete: () => {},
	onCreate: () => {},
};

export default CustomerAddressList;
