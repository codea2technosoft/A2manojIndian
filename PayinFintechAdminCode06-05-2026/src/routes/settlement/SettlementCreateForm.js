import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Modal, Typography, Form, Input, Row, Col, DatePicker } from 'antd';
// import BaseSelect from 'components/Elements/BaseSelect';

const { Title } = Typography;

const SettlementCreateForm = (props) => {
	const { 
        visible, 
        partners, 
        users, 
        paymentServices,
        settlementStatuses,
        onClose, 
        onSubmit, 
        onChangePartner, 
        onSearchPartners 
    } = props;

    const defaultNewSettlement = {
        amount_requested: 0,
        amount_pending: 0,
        amount_settled: 0,
        amount_reversed: 0,
        fees: 0,
        tax: 0,
        status: 4,
        platform_gross_amount: 0,
        platform_management_fee: 0,
        platform_settlement_fee: 0,
        platform_reserve_amount: 0,
    };

	const [loading, setLoading] = useState(false);

	const [formRef] = Form.useForm();

	const onSubmitData = () => {
		formRef.validateFields().then(async (formData) => {
			try {
				setLoading(true);
                const data = {
                    ...formData,
                    platform_gross_amount: formData.amount_requested,
                    amount_settled: formData.status == 4 ? formData.amount_requested : 0
                }
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

    const handleChangePartner = (value) => {
        formRef.setFieldValue('user_id', '');
        onChangePartner(value);
    }

	return (
		<Modal
			open={visible}
			closable={false}
			onCancel={onCancel}
			onOk={onSubmitData}
			okButtonProps={{
				loading: loading,
			}}
			okText="Submit"
            width={800}
		>
			<Title level={4}>Create new settlement</Title>
			<Form
                    layout='vertical'
                    initialValues={defaultNewSettlement}
                    form={formRef}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            {/* <Form.Item name="partner_id" label="Partner" rules={[{ required: true }]}>
                                <BaseSelect
                                    options={partners}
                                    optionLabel='full_name'
                                    optionValue='id'
                                    defaultText='Please choose'
                                    showSearch
                                    onChange={handleChangePartner}
                                    onSearch={onSearchPartners}
                                />
                            </Form.Item> */}
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            {/* <Form.Item name="user_id" label="Merchant" rules={[{ required: true }]}>
                                <BaseSelect
                                    options={users}
                                    optionLabel='full_name'
                                    optionValue='id'
                                    defaultText='Please choose'
                                />
                            </Form.Item> */}
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            {/* <Form.Item name="service_id" label="Service" rules={[{ required: true }]}>
                                <BaseSelect
                                    options={paymentServices}
                                    optionLabel='name'
                                    optionValue='id'
                                    defaultText='Please choose'
                                />
                            </Form.Item> */}
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="settlement_id" label="Settlement ID" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="amount_requested" label="Amount" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            {/* <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                <BaseSelect
                                    options={settlementStatuses}
                                    optionLabel="display"
                                    optionValue="value"
                                />
                            </Form.Item> */}
                        </Col>
                    </Row>
                    <Form.Item hidden name="amount_settled" label="Amount settled" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item hidden name="amount_pending" label="Amount pending" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item hidden name="amount_reversed" label="Amount reversed" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item hidden name="fees" label="Fees" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item hidden name="tax" label="Tax" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item hidden name="platform_gross_amount" label="Platform gross amount" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item hidden name="platform_management_fee" label="Platform management fee" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item hidden name="platform_settlement_fee" label="Platform settlement fee" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item hidden name="platform_reserve_amount" label="Platform reverse amount" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
		</Modal>
	);
};

SettlementCreateForm.propTypes = {
	visible: PropTypes.bool.isRequired,
    partners: PropTypes.array.isRequired,
	users: PropTypes.array.isRequired,
    paymentServices: PropTypes.array.isRequired,
    settlementStatuses: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
    onChangePartner: PropTypes.func.isRequired,
    onSearchPartners: PropTypes.func.isRequired
};

export default SettlementCreateForm;
