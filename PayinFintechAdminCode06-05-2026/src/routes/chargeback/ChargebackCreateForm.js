import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Row, Col, DatePicker } from 'antd';
// import BaseSelect from 'components/Elements/BaseSelect';


const { Title } = Typography;

const ChargebackCreateForm = (props) => {
	const { visible, users, onClose, onSubmit } = props;

	const [loading, setLoading] = useState(false);
	const [query, setQuery] = useState({});

	const [formRef] = Form.useForm();

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
			<Title level={4}>Create new chargeback</Title>
			<Form layout="vertical" form={formRef}>
				{/* <Form.Item name="partner_id" label="User" rules={[{ required: true }]}>
					<BaseSelect
						defaultText='Choose one user'
						options={users}
						optionValue="id"
						optionLabel="full_name"
						additionalLabel="email"
					/>
				</Form.Item> */}
				<Row gutter={[16, 16]}>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="tx_id" label="Transaction ID" rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					</Col>
					<Col g={12} md={12} sm={24} xs={24}>
						<Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
							<Input prefix="₹" />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name="chargeback_at" label="Chargeback at" rules={[{ required: true }]}>
					<DatePicker showTime style={{width: '100%'}} />
				</Form.Item>
				<Form.Item name="note" label="Note" rules={[{ required: false }]}>
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	);
};

ChargebackCreateForm.propTypes = {
	visible: PropTypes.bool.isRequired,
	users: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default ChargebackCreateForm;
