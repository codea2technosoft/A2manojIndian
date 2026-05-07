import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCurrencies } from 'requests/currency';
import { Modal, Typography, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import BaseSelect from 'components/Elements/BaseSelect';
import JoditEditor from "jodit-react";

const { Title } = Typography;

const PlanCreateForm = (props) => {
	const { currencies, visible, onClose, onSubmit } = props;

	const [loading, setLoading] = useState(false);

	const [formRef] = Form.useForm();

	const config = useSelector((state) => state.config);

	const planTypeOptions = config.plan_types.map((item) => {
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
			<Title level={4}>Create new plan</Title>
			<Form layout="vertical" form={formRef}>
				<Form.Item name="name" label="Name" rules={[{ required: true }]}>
					<Input />
				</Form.Item>
				<Form.Item name="description" label="Description" rules={[{ required: true }]}>
					<JoditEditor
                        config={{ readonly: false }}
                        tabIndex={1} // tabIndex of textarea
                    />
				</Form.Item>
				<Row gutter={[16, 16]}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item name="monthly_price" label="Monthly price" rules={[{ required: true }]}>
							<InputNumber
								className="w-100"
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item name="monthly_price_paid_annual" label="Monthly price paid annual" rules={[{ required: true }]}>
							<InputNumber
								className="w-100"
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item name="currency_id" label="Currency" rules={[{ required: true }]}>
							<BaseSelect
								options={currencies}
								fetching
								optionValue="id"
								optionLabel="name"
								additionalLabel="symbol"
								defaultText='Select one'
							/>
						</Form.Item>
					</Col>
					<Col lg={12} md={12} sm={24} xs={24}>
						<Form.Item name="type" label="Plan Type" rules={[{ required: true }]}>
							<Select options={planTypeOptions} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

PlanCreateForm.propTypes = {
	visible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
};

export default PlanCreateForm;
