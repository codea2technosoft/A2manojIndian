import PropTypes from 'prop-types';
import { useState } from 'react';
import { Modal, Typography, Form, Input, Select } from 'antd';

const { Title } = Typography;

const ModuleCreateForm = (props) => {
	const { visible, onClose, onSubmit, moduleData, types } = props;

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
			<Title level={4}>Create new module</Title>
			<Form layout="vertical" form={formRef}>
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
				<Form.Item name="type" label="Type" rules={[{ required: true }]}>
					<Select>
						{types.map((item, index) => (
							<Select.Option value={item.value}>{item.display}</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>
	);
};

ModuleCreateForm.propTypes = {
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	moduleData: PropTypes.arrayOf(PropTypes.object).isRequired,
	types: PropTypes.array.isRequired,
};

export default ModuleCreateForm;
