import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Row, Col } from 'antd';
import { getCountries } from 'requests/country';
import { getRoles } from 'requests/role';
import BaseSelect from 'components/Elements/BaseSelect';
import { DEFAULT_QUERY } from 'constants/common';

const { Title } = Typography;

const UserCreateForm = (props) => {
	const { visible, onClose, onSubmit } = props;

	const [loading, setLoading] = useState(false);
	const [countries, setCountries] = useState([]);
	const [roles, setRoles] = useState([]);
	const [query, setQuery] = useState(DEFAULT_QUERY);
	const [selectedRole, setSelectedRole] = useState(null);

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

	useEffect(() => {
		if (visible) {
			const fetchRoles = async () => {
				try {
					const data = await getRoles({ per_page: 20 });
					setRoles([...roles, ...data.records]);
				} catch (error) {
					console.log(error);
				}
			};
			fetchRoles();
		}
	}, [visible]);

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
		setRoles([]);
		setCountries([]);
		setQuery(DEFAULT_QUERY);

		onClose();
	};

	const onScrollEnd = () => {
		setQuery((preState) => {
			return { ...preState, page: preState.page + 1 };
		});
	};

	return (
		<Modal
		    title={'Create new user'}
			visible={visible}
			closable={false}
			onCancel={onCancel}
			onOk={onSubmitData}
			okButtonProps={{
				loading: loading,
			}}
			okText="Submit"
			width={700}
		>
			{/* <Title level={4}>Create new user</Title> */}
			<Form layout="vertical" form={formRef} autoComplete='new-password' key={Date.now}>
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="full_name" label="Full name" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="client_name" label="Client Name" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="email" label="Email" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="password" label="Password" rules={[{ required: true }]}>
							<Input.Password />
						</Form.Item>
					</Col>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>

					<Col g={12} md={12} sm={24} xs={24}>
							<Form.Item name="PAN_GST" label="PAN_GST" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
					</Col>

					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="role" label="Role" rules={[{ required: true }]} className='mb-0'>
							<BaseSelect
								options={roles}
								fetching
								optionValue="id"
								optionLabel="name"
								defaultText='Select one'
								onChange={(value) => setSelectedRole(value)}
							/>
						</Form.Item>
					</Col>
					{/* <Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="country_id" label="Country" rules={[{ required: true }]}>
							<BaseSelect
								options={countries}
								fetching
								optionValue="id"
								optionLabel="name"
								defaultText='Select one'
								onScrollEnd={onScrollEnd}
							/>
						</Form.Item>
					</Col> */}
				</Row>
				<Row gutter={[16, 16]}>

					<Col g={12} md={12} sm={24} xs={24}>
							<Form.Item name="Website" label="Website" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
					</Col>

					<Col g={12} md={12} sm={24} xs={24}>
							<Form.Item name="Address" label="Address" rules={[{ required: true }]}>
								<Input />
							</Form.Item>
					</Col>

					
					
				</Row>
				{
					selectedRole === 4 ? (
						<Form.Item name="partner_referral_code" label="Partner referral code" rules={[{ required: false }]}>
							<Input />
						</Form.Item>
					) : null
				}

			</Form>
		</Modal>
	);
};

UserCreateForm.propTypes = {
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default UserCreateForm;
