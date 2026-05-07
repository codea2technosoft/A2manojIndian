import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, Typography, Form, Input, Select, Row, Col } from 'antd';
import { MODULES_TYPES } from 'constants/common';

const { Title } = Typography;

const ModuleUpdateForm = (props) => {
	const { record, visible, onClose, onSubmit, moduleData, types } = props;

	const [loading, setLoading] = useState(false);

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
			<Title level={4}>Update Module</Title>
			<Form layout="vertical" form={formRef} initialValues={record}>
				<Form.Item name="name" label="Name" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name="description" label="Description" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name="icon_url" label="Icon URL" rules={[]}>
					<Input />
				</Form.Item>
				<Form.Item name="parent_id" label="Parent" rules={[]}>
					<Select>
						<Select.Option value={null}>--Select Parent--</Select.Option>
						{moduleData.map((item, index) => (
							<Select.Option value={item.id}>{item.name}</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Row gutter={[16, 16]}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item name="type" label="Type" rules={[{ required: true }]}>
							<Select>
								{types.map((item, index) => (
									<Select.Option value={item.value}>{item.display}</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item name="status" label="Status" rules={[{ required: true }]}>
							<Select>
								<Select.Option value={0}>Inactive</Select.Option>
								<Select.Option value={1}>Active</Select.Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

ModuleUpdateForm.propTypes = {
	record: PropTypes.object.isRequired,
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	moduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
	types: PropTypes.array.isRequired,
};

export default ModuleUpdateForm;
