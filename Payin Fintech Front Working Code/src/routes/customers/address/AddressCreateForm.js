import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Row, Col } from 'antd';
import { getCountries } from 'requests/country';
import BaseSelect from 'components/Elements/BaseSelect';

const { Title } = Typography;

const AddressCreateForm = (props) => {
	const { visible, onClose, onSubmit } = props;

	const [loading, setLoading] = useState(false);
	const [countries, setCountries] = useState([]);
	const [query, setQuery] = useState({
		page: 1,
		per_page: 10,
	});

	const [formRef] = Form.useForm();

	useEffect(() => {
		if (visible) {
			const fetchCountries = async () => {
				try {
					const data = await getCountries(query);
					setCountries([...countries, ...data.records]);
				} catch (error) {
					console.log(error);
				}
			};
			fetchCountries();
		}
	}, [visible, query]);

	const onSubmitData = () => {
		formRef.validateFields().then(async (data) => {
			try {
				setLoading(true);
				await onSubmit(data);
				// close modal
				onCancel();
			} catch (err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		});
	};

	const onCancel = () => {
		// clear form
		formRef.resetFields();

		onClose();
	};

	const onScrollEnd = () => {
		setQuery((preState) => {
			return { ...preState, page: preState.page + 1 };
		});
	};

	return (
		<Modal
			visible={visible}
			closable={false}
			onCancel={onCancel}
			onOk={onSubmitData}
			okButtonProps={{
				loading: loading,
			}}
			okText="Submit"
		>
			<Title level={4}>Create new Address</Title>
			<Form layout="vertical" form={formRef}>
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="postal_code" label="Postal Code" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="company" label="Company" rules={[{ required: false }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col g={12} md={12} sm={24} xs={24}>

						<Form.Item name="tax_id" label="Tax ID" rules={[{ required: false }]}>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name="street" label="Street" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name="city" label="City" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name="country_id" label="Country" rules={[{ required: true }]}>
					<BaseSelect
						options={countries}
						fetching
						optionValue="id"
						optionLabel="name"
						onScrollEnd={onScrollEnd}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

AddressCreateForm.propTypes = {
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default AddressCreateForm;
