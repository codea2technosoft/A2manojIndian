import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Row, Col } from 'antd';
import { getCountries } from 'requests/country';
import { getRoles } from 'requests/role';
import BaseSelect from 'components/Elements/BaseSelect';
// import { DEFAULT_QUERY } from 'constants/common';

const { Title } = Typography;

const UserCreateForm = (props) => {
	const { visible, onClose, onSubmit } = props;
	const [loading, setLoading] = useState(false);
	const [formRef] = Form.useForm();

	return (
		<Modal
			visible={visible}
			closable={false}
			// onCancel={onCancel}
			// onOk={onSubmitData}
			okButtonProps={{
				loading: loading,
			}}
			okText="Submit"
			width={700}
		>
			<Title level={4}>Create new user</Title>
			<Form layout="vertical" form={formRef} autoComplete='new-password' key={Date.now}>
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="full_name" label="Full name" rules={[{ required: true }]}>
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
