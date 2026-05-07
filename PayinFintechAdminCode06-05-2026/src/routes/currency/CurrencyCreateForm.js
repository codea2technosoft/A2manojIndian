import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Typography, Form, Input, InputNumber, Select, Row, Col } from 'antd';

const { Title } = Typography;

const CurrencyCreateForm = (props) => {
	const { visible, onClose, onSubmit } = props;

	const [loading, setLoading] = useState(false);

	const [formRef] = Form.useForm();

	const config = useSelector((state) => state.config);

	const displayTypeOptions = config.currency_symbol_positions.map((item) => {
		return { label: item.display, value: item.value };
	});

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
			<Title level={4}>Create new currency</Title>
			<Form layout="vertical" form={formRef}>
				<Form.Item name="name" label="Name" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name="symbol" label="Symbol" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Row gutter={[16, 16]}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item name="thousand" label="Thousand" rules={[{ required: true }]}>
							<InputNumber
								className="w-100"
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item name="display_type" label="Display type" rules={[{ required: true }]}>
							<Select options={displayTypeOptions} />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name="exchange_rate" label="Exchange rate" rules={[{ required: true }]}>
					<InputNumber
						className="w-100"
						formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

CurrencyCreateForm.propTypes = {
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default CurrencyCreateForm;
