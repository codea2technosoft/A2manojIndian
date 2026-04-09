import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { Card, Form, Row, Col, Input, Button, Modal, Divider, Select, Table, Switch, TextArea } from 'antd';
import { generateRandomString } from 'utils/common';
import { RefreshIcon } from '@heroicons/react/outline';
import { ToastContainer, toast } from 'react-toastify';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'components/DatePicker';
import dayjs from 'dayjs';
import { createOrder } from 'requests/order';
import PaymentLinkTable from './paymentlink';
import FileSearch from 'components/FileSearch';

const PaymentLinkss = () => {
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState('');
    const [qrImageUrl, setQrImageUrl] = useState('');
    const { TextArea } = Input;
    const searchRef = useRef(null);
    const [isShowFilter, setIsShowFilter] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const titles = [{ path: location.pathname, title: 'Payment Links' }];
    const [formRef] = Form.useForm();
    const initialValues = {
        order_number: generateRandomString(8),
        name: 'Test User',
        email: 'testuser@test.com',
        phone: '9999999999',
        subtotal: 200,
        // tax: 0,
        // currency: 'INR',
    };

    const onSubmit = async (formData) => {
        try {
            setLoading(true);

            const payload = {
                ...formData,
                total: formData.subtotal,
                order_number: generateRandomString(8),
                // fulfillment_status: '1', // awaiting
                // payment_status: '1', // awaiting
                // type: '3', // partner
                // platform_id: '0',
                portal_entry: 'patner_payin',
                return_url: 'https://merchant.payinfintech.com/payin-dashboard',
            };

            const response = await createOrder(payload);
            console.warn('sadsf', response);
            if (response.Status_code != 106) {
                toast(response.message);
                return;
            }
            if (response.data.pg_checkout == 'yes') {
                // window.open(response.url);
                window.location.href = response.data.url;
            } else {
                const checkoutUrl = `${process.env.REACT_APP_API_URL}payment/checkout/general?order_id=${response.data.id}`;
                if (response.qr_image_url) {
                    setCheckoutUrl(checkoutUrl);
                    setQrImageUrl(response.data.qr_image_url);
                    setVisibleModal(true);
                } else {
                    window.open(checkoutUrl, '_blank');
                }
            }

            // formRef.setFieldsValue({
            //     ...initialValues,
            //     order_number: generateRandomString(8),
            // });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const onToggleFilter = () => {
        setIsShowFilter(!isShowFilter);
    };

    const onOpenCheckoutUrl = () => {
        window.open(checkoutUrl, '_blank');
    };

    const onSearch = (keyword) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: 1,
            keyword: keyword,
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const onSetDatesByDatePicker = (dates) => {
        setMode('custom');
        setDates(dates);
    };
    const [dates, setDates] = useState([dayjs(), dayjs()]);
    const [mode, setMode] = useState('today');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModal2 = () => {
        setIsModal2Open(true);
    };

    const handleOk2 = () => {
        setIsModal2Open(false);
    };

    const handleCancel2 = () => {
        setIsModal2Open(false);
    };

    return (
        <div className="Links">
            <ToastContainer />
            {/* <Card className="mt-16 topbox-shadow"> */}
            <Row gutter={[8, 8]} justify={'space-between'} className="bgred">
                {/* <Col xs={24} sm={24} md={24} lg={12}>
                        <PageTitle titles={titles} />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xl={6} span={6}>
                        <TableBar placeholderInput="Transaction Detail" showFilter={false} />
                    </Col> */}

                <Col xs={24} sm={24} md={14} lg={9} xl={7}>
                    <Card className="wallet_box">
                        <RangePicker
                            value={dates}
                            onCalendarChange={(newDates) => onSetDatesByDatePicker(newDates)}
                            style={{ height: '45px' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={10} lg={6} xl={6}>
                    <Card className="wallet_box">
                        <TableBar
                            type="text"
                            placeholder="Search"
                            onSearch={onSearch}
                            onFilter={onToggleFilter}
                            isActiveFilter={isShowFilter}
                            inputRef={searchRef}
                            showFilter={false}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={9} xl={6}>
                    <Card className="wallet_box">
                        <Button onClick={showModal} className="ant-btn-primary create-pay-link">
                            Quick Payment Link
                        </Button>
                    </Card>
                </Col>
            </Row>
            {/* </Card> */}

            {/* <Modal title="Quick Payment Link" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <Form layout="vertical" form={formRef} initialValues={initialValues} onFinish={onSubmit}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                name="billing_person_name"
                                label="Billing Person Name"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="subtotal" label="Amount" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} style={{ display: 'none' }}>
                            <Form.Item name="tax" label="Tax" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]} style={{ display: 'none' }}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="return_url" label="Return URL" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end">
                        <Button type="primary" htmlType="submit" loading={loading}> 
                        <Button type="primary" loading={loading}>
                            Create Link
                        </Button>
                    </Row>
                </Form>
            </Modal> */}
            <Modal title="Quick Payment Link" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false}>
                <Form layout="vertical" form={formRef} initialValues={initialValues} onFinish={onSubmit}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="name" label="Billing Person Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="device" label="Device" rules={[{ required: true }]}>
                                <Select placeholder="Select a device">
                                    <Select.Option value="android">Android</Select.Option>
                                    <Select.Option value="ios">IOS</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="subtotal" label="Amount" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        {/* <Col xs={24} sm={24} md={12} lg={12} style={{ display: 'none' }}>
                            <Form.Item name="tax" label="Tax" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col> */}
                    </Row>
                    {/* <Row gutter={[16, 16]} style={{ display: 'none' }}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name="return_url" label="Return URL" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row> */}
                    <Row justify="end">
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Quick Payment Link
                        </Button>
                    </Row>
                </Form>
            </Modal>

            <div>
                <PaymentLinkTable />
            </div>

            <Modal open={visibleModal} title="Checkout" footer={null} closable onCancel={() => setVisibleModal(false)}>
                <Row justify="center">
                    <Button type="primary" onClick={onOpenCheckoutUrl}>
                        Open checkout URL
                    </Button>
                </Row>
                <Divider>or</Divider>
                <Row justify="center">
                    <img width={200} src={qrImageUrl} alt="QR" />
                </Row>
            </Modal>
        </div>
    );
};

export default PaymentLinkss;
