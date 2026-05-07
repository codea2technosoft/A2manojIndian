import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Row, Col, DatePicker, Switch } from 'antd';
import { getCountries } from 'requests/country';
import { getRoles } from 'requests/role';
import BaseSelect from 'components/Elements/BaseSelect';
import { DEFAULT_QUERY } from 'constants/common';

const { Title } = Typography;

const UserUpdateForm = (props) => {
	const { record, visible, onClose, onSubmit } = props;
	const [countries, setCountries] = useState([]);
	const [roles, setRoles] = useState([]);
	const [query, setQuery] = useState(DEFAULT_QUERY);
	const [formKey, setFormKey] = useState(Date.now());

	const [loading, setLoading] = useState(false);

	const [formRef] = Form.useForm();

	useEffect(() => {
		const botIframe = record.config?.notification?.whatsapp?.settings?.bot_iframe;
		const chatIframe = record.config?.notification?.whatsapp?.settings?.chat_iframe;
		const defaultValues = {
			...record,
			whatsapp_chat_iframe: chatIframe,
			whatsapp_bot_iframe: botIframe
		}
		formRef.setFieldsValue(defaultValues);
	}, [record]);

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
			setFormKey(Date.now());
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

	const onScrollEnd = () => {
		setQuery((preState) => {
			return { ...preState, page: preState.page + 1 };
		});
	};

	const onCancel = () => {
		// clear form
		formRef.resetFields();
		// setRoles([]);
		// setCountries([]);
		// setQuery(DEFAULT_QUERY);
		onClose();
	};

	console.log(formKey)

	return (
		<Modal
		   title={'Update User'}
			visible={visible}
			closable={false}
			onCancel={onCancel}
			onOk={onSubmitData}
			okButtonProps={{
				loading: loading,
			}}
			okText="Submit"
		>
			{/* <Title level={4}>Update User</Title> */}
			<Form layout="vertical" form={formRef} initialValues={record} key={formKey}>
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="full_name" label="Full name" rules={[{ required: true }]}>
							<Input />
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
						<Form.Item name="status" label="Status" valuePropName='checked' rules={[{ required: true }]}>
							<Switch />
						</Form.Item>
					</Col>
				</Row>


				
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="min_order_amount" label="Minimum order amount" rules={[{ required: false }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="max_order_amount" label="Maximum order amount" rules={[{ required: false }]}>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="role" label="Role" rules={[{ required: true }]}>
							<BaseSelect
								options={roles}
								fetching
								optionValue="id"
								optionLabel="name"
								onScrollEnd={onScrollEnd}
							/>
						</Form.Item>
					</Col>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="partner_referral_code" label="Partner referral code" rules={[{ required: false }]}>
							<Input />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name="whatsapp_chat_iframe" label="Whatsapp chat iframe" rules={[{ required: false }]}>
					<Input />
				</Form.Item>
				<Form.Item name="whatsapp_bot_iframe" label="Whatsapp bot iframe" rules={[{ required: false }]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

UserUpdateForm.propTypes = {
	record: PropTypes.object.isRequired,
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default UserUpdateForm;
