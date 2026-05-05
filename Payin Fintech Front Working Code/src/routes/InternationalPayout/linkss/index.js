import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { Card, Form, Row, Col, Input, Button, Modal, Select, Space, Table, Tag } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'components/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';

const PaymentLinkss = () => {
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [paymentLink, setpaymentLink] = useState();
    const [formData, setFormData] = useState({
        amount: '',
        product_name: '',
        quantity: '',
        currencyCode: 'USD',
    });

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const isFormValid = () => {
        return formData.amount && formData.product_name && formData.quantity && formData.currencyCode;
    };

    const handleChangeCurrency = (value) => {
        setFormData(prev => ({ ...prev, currencyCode: value }));
    };

    const showModal = () => {
        setVisibleModal(true);
    };

    const handleOk = () => {
        setVisibleModal(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setVisibleModal(false);
        // window.location
        window.location.reload() 

    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Order ID',
            dataIndex: 'orderid',
            key: 'orderid',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Payment Link',
            dataIndex: 'payment_link',
            key: 'payment_link',
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Quantity',
            dataIndex: 'qty',
            key: 'qty',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
        },
    ];

    const generateLink = async () => {
        if (!isFormValid()) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            setLoading(true);
            const token = Cookies.get('sob_token');
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(
                'https://api.payinfintech.com/merchant-Paypal-payment-link',
                formData, // Sending formData in the request body
                { headers }
            );

            const paymentLink = response.data?.records;
            setpaymentLink(paymentLink)
            if (paymentLink) {
                toast.success('Payment link generated successfully!');
                // Open the payment link or handle it as needed
                // window.open(paymentLink, '_blank');
            } else {
                toast.error('Failed to generate payment link.');
            }
        } catch (error) {
            console.error('Error generating payment link:', error);
            toast.error('An error occurred while generating the payment link.');
        } finally {
            setLoading(false);
        }
    };


    const copyLinkToClipboard = () => {
        if (paymentLink) {
            navigator.clipboard.writeText(paymentLink)
                .then(() => {
                    toast.success('Link copied to clipboard!');
                })
                .catch((err) => {
                    console.error('Failed to copy link: ', err);
                    toast.error('Failed to copy link.');
                });
        }
    };



    const [setPaymentLinksss, setsetPaymentLinkss] = useState("")
    console.warn(setPaymentLinksss)

    const dataLink = async () => {
        try {
            const token = Cookies.get('sob_token');
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(
                'https://api.payinfintech.com/merchant-Paypal-payment-link-list',
                { headers }
            );

            const paymentLink = response.data?.records || [];
            setsetPaymentLinkss(paymentLink); // Store the data in state

        } catch (error) {
            console.error('Error generating payment link:', error);
            toast.error('An error occurred while generating the payment link.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        dataLink();
    }, []);

    return (
        <div className="Links">
            <ToastContainer />
            <Row gutter={[8, 8]} justify={'space-between'} className="bgred">
                <Col xs={24} sm={24} md={14} lg={9} xl={7}>
                    <Card className="wallet_box">
                        <RangePicker
                            value={[dayjs(), dayjs()]}
                            style={{ height: '45px' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={10} lg={6} xl={6}>
                    <Card className="wallet_box">
                        <TableBar
                            type="text"
                            placeholder="Search"
                            onSearch={(keyword) => {
                                let query = parseQueryParams(location);
                                query = { ...query, page: 1, keyword };
                                navigate({ pathname: location.pathname, search: stringifyQueryParams(query) });
                            }}
                            onFilter={() => { }}
                            isActiveFilter={false}
                            inputRef={useRef(null)}
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
            <Modal
                title="Quick Payment Link"
                open={visibleModal}
                onCancel={handleCancel}
                footer={false}
            >
                <Form layout="vertical" form={form} onFinish={generateLink}>
                    <Form.Item
                        name="currencyCode"
                        label="Currency"
                        rules={[{ required: true, message: 'Please select a currency!' }]}
                    >
                        <Select
                            defaultValue="USD"
                            onChange={handleChangeCurrency}
                        >
                            <Select.Option value="AUD">Australian Dollar (AUD)</Select.Option>
                            <Select.Option value="BRL">Brazilian Real (BRL)</Select.Option>
                            <Select.Option value="CAD">Canadian Dollar (CAD)</Select.Option>
                            <Select.Option value="CNY">Chinese Renmenbi (CNY)</Select.Option>
                            <Select.Option value="CZK">Czech Koruna (CZK)</Select.Option>
                            <Select.Option value="DKK">Danish Krone (DKK)</Select.Option>
                            <Select.Option value="EUR">Euro (EUR)</Select.Option>
                            <Select.Option value="HKD">Hong Kong Dollar (HKD)</Select.Option>
                            <Select.Option value="HUF">Hungarian Forint (HUF)</Select.Option>
                            <Select.Option value="ILS">Israeli New Shekel (ILS)</Select.Option>
                            <Select.Option value="JPY">Japanese Yen (JPY)</Select.Option>
                            <Select.Option value="MYR">Malaysian Ringgit (MYR)</Select.Option>
                            <Select.Option value="NOK">Norwegian Krone (NOK)</Select.Option>
                            <Select.Option value="NZD">New Zealand Dollar (NZD)</Select.Option>
                            <Select.Option value="PHP">Philippine Peso (PHP)</Select.Option>
                            <Select.Option value="PLN">Polish Zloty (PLN)</Select.Option>
                            <Select.Option value="SGD">Singapore Dollar (SGD)</Select.Option>
                            <Select.Option value="THB">Thai Baht (THB)</Select.Option>
                            <Select.Option value="TRY">Turkish Lira (TRY)</Select.Option>
                            <Select.Option value="USD">US Dollar (USD)</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please enter an amount!' }]}
                    >
                        <Input
                            type="text"
                            placeholder="Amount"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item
                        name="product_name"
                        label="Product Name"
                        rules={[{ required: true, message: 'Please enter a product name!' }]}
                    >
                        <Input
                            type="text"
                            placeholder="Product Name"
                            value={formData.product_name}
                            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true, message: 'Please enter a quantity!' }]}
                    >
                        <Input
                            type="number"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={!isFormValid()}
                        >
                            Generate Link
                        </Button>
                    </Form.Item>


                    {paymentLink   
                                    && (
                        <Form.Item
                            name="Link"
                            label="Link"
                        >
                            <Input
                                type="text"
                                placeholder="Link"
                                value={paymentLink}
                                readOnly // Optional: Make input read-only since it's a generated link
                            />
                            <Button
                                className='position-absolute end-0 mx-1 my-1'
                                type="primary"
                                onClick={copyLinkToClipboard}
                            >
                                Copy Link
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            <div>

                <Table
                    columns={columns}
                    dataSource={setPaymentLinksss && setPaymentLinksss.map((link, index) => ({
                        key: index,
                        id: link.id,
                        orderid: link.orderid,
                        amount: link.amount,
                        payment_link: link.payment_link,
                        currency: link.currency,
                        product_name: link.product_name,
                        qty: link.qty,
                        created_at: link.created_at,
                    }))}
                />

            </div>
        </div>
    );
};

export default PaymentLinkss;
