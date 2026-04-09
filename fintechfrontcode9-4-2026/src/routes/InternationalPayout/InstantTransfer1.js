import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
// import { Form } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
// import { FaRegEdit, FaEye, FaSearch } from "react-icons/fa";
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import api from 'utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, DatePicker, Card, Tabs, Table, Tag, message, Modal, Select, Form, Input } from 'antd';
import { Button } from 'antd';
import walletIcon from 'assets/images/Wallet 1.png';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { toast } from 'react-toast';
import { omitBy, isEmpty, debounce } from 'lodash';
import 'assets/styles/orders.scss';
// request
import { getBanklist, payinPayoutList, exportOrders } from 'requests/order';

// const { RangePicker } = DatePicker;
const titles = [{ title: 'Fund Transfer' }];

const InstantTransfer1 = () => {
    const isRendered = useRef(false);
    const [currencyCode, setCurrencyCode] = useState('');
    const [currencyCode1, setCurrencyCode1] = useState('EUR');
    const [bankList, setBankList] = useState([]);
    const [permissionbank, setPermissionBank] = useState(null);
    const [permissionpayout, setPermissionPayout] = useState(null);

    const [data1, setData] = useState([]);
    const [getdata, setgetData] = useState([]);
    // console.warn(getdata);
    const [cur001, setCur001] = useState([]);
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchData1();
        fetchBankList();
    }, []);
    const fetchData1 = async (keyword) => {
        try {
            const response = await api.get('/paypal-transaction-all');
            const data = response.data;
            setData(data.data);

            console.warn(data.data.id);
        } catch (error) {
            console.error('Error fetching bank list:', error);
        }
    };
    const Submit = async (paypal_id) => {
        console.warn(paypal_id);
        try {
            const url = `https://pnode.mtmpay.in/order-checkstatus`;
            const payload = {
                orderid: paypal_id,
            };
            const response = await axios.post(url, payload);
            // setModalData(response.data);
            if (response.data.status === 'COMPLETED') {
                fetchData1();
            } else {
                toast.error(response.data.message);
            }
            console.warn(response.data.status);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const [formData, setFormData] = useState({
        amount: '',
        product_name: '',
        quantity: '',
    });

    const handleChangeAmount = (e) => {
        const { id, value, name } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [id]: value,
        }));
    };

    const fetchBankList = async (keyword) => {
        try {
            const response = await api.get('/get-user');
            const data = response.data;
            setgetData(data.data);

            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${data.data.paypal_client_id}`;
            script.setAttribute('data-partner-attribution-id', 'MTMPaymentServicesPvtLtd_SI');
            script.async = true;
            document.body.appendChild(script);

            // console.warn(data.data.id);
        } catch (error) {
            console.error('Error fetching bank list:', error);
        }
    };

    const handleChangeCurrency = (event) => {
        setCurrencyCode(event.target.value);

        var inputBox = document.getElementById('cur01');

        // Set the value of the input box
        inputBox.value = event.target.value; // Replace 'Your desired value' with the value you want to set
        const newCurrencyCode = event.target.value;
        setCurrencyCode1(newCurrencyCode);
        setCur001(event.target.value);

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${getdata.paypal_client_id}&currency=${newCurrencyCode}`;
        script.async = true;
        console.warn(script);
        // Load script and add to the document body
        document.body.appendChild(script);

        // Clean up function to remove the script when component unmounts or currency code changes
        return () => {
            document.body.removeChild(script);
        };
    };

    useEffect(() => {
        // Create script element for PayPal SDK
        // const script = document.createElement('script');
        // script.src = `https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=${currencyCode1}`;
        // script.async = true;
        // // Load script and add to the document body
        // document.body.appendChild(script);
        // // Clean up function to remove the script when component unmounts or currency code changes
        // return () => {
        //     document.body.removeChild(script);
        // };
    }, [currencyCode1]); // useEffect will re-run whenever currencyCode changes

    const [eorderData, SetorderData] = useState('');
    useEffect(() => {
        // alert(currencyCode)
        const renderPayPalButtons = () => {
            const orderData = {
                currency_code: currencyCode,
                amount: formData.amount,
                product_name: formData.product_name,
                quantity: formData.quantity,
            };

            if (
                currencyCode === '' ||
                formData.amount === '' ||
                formData.product_name === '' ||
                formData.quantity === ''
            ) {
                return;
            }
            localStorage.setItem('currency_code', currencyCode);
            localStorage.setItem('amount', formData.amount);
            localStorage.setItem('product_name', formData.product_name);
            localStorage.setItem('quantity', formData.quantity);
            // SetorderData(orderData);

            if (isRendered.current) return;

            window.paypal
                .Buttons({
                    createOrder: async (data, actions) => {
                        const currency_code = localStorage.getItem('currency_code');
                        const amount = localStorage.getItem('amount');
                        const product_name = localStorage.getItem('product_name');
                        const quantity = localStorage.getItem('quantity');
                        const orderData = {
                            currency_code: currency_code,
                            amount: amount,
                            product_name: product_name,
                            quantity: quantity,
                            // id: getdata.id,
                            full_name: getdata.full_name,
                            userid: getdata.id,
                        };
                        // &id=${getdata.id}&full_name=${getdata.full_name}
                        // console.warn("formData", orderData)
                        // alert(orderData)
                        try {
                            const response = await axios.post('https://pnode.mtmpay.in/api/orders', orderData);
                            return response.data.id; // Return the order ID
                        } catch (error) {
                            console.error('Create Order Error:', error);
                            throw new Error('Failed to create order');
                        }
                    },
                    onApprove: async (data, actions) => {
                        try {
                            const response = await axios.post(
                                `https://pnode.mtmpay.in/api/orders/${data.orderID}/capture/${getdata.id}/${getdata.full_name}`,
                            );
                            console.warn('Capture result', response.data);
                            alert('Payment successful!');
                        } catch (error) {
                            console.error('Capture Order Error:', error);
                            alert('Payment failed!');
                        }
                    },
                })
                .render('#paypal-buttons-container');

            isRendered.current = true;
        };

        // console.warn("formData", formData);

        if (window.paypal) {
            renderPayPalButtons();
        } else {
            window.addEventListener('load', renderPayPalButtons);
        }

        return () => {
            window.removeEventListener('load', renderPayPalButtons);
        };
    }, [formData, currencyCode]);
    const isFormValid = () => {
        return formData.amount && formData.product_name && formData.quantity && currencyCode;
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'badge bg-success';
            case 'PENDING':
                return 'badge bg-warning text-dark';
            case 'FAILED':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    };

    const [showform, setShowform] = useState(false);

    const handleCloseform = () => setShowform(false);
    const handleShowform = () => setShowform(true);
    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [isModalOpen1, setIsModalOpen1] = useState(false);

    const showModal1 = () => {
        setIsModalOpen1(true);
    };

    const handleOk1 = () => {
        setIsModalOpen1(false);
    };

    const handleCancel1 = () => {
        setIsModalOpen1(false);
    };

    const columns = [
        {
            title: 'PayPal ID',
            dataIndex: 'paypal_id',
            key: 'paypal_id',
        },
        {
            title: 'Captures',
            key: 'captures',
            render: (text, record) => (
                <>
                    Id: {record.captures_id} <br />
                    Amount: {record.captures_amount} <br />
                    C.code: {record.captures_currency_code} <br />
                    Status: {record.captures_status}
                </>
            ),
        },
        {
            title: 'Payer Given Name',
            key: 'payer_given_name',
            render: (text, record) => (
                <>
                    {record.payer_given_name} {record.payer_surname}
                </>
            ),
        },
        {
            title: 'Payer',
            key: 'payer',
            render: (text, record) => (
                <>
                    Email: {record.payer_email_address} <br />
                    PayerId: {record.payer_payer_id}
                </>
            ),
        },
        {
            title: 'PayPal',
            key: 'paypal',
            render: (text, record) => (
                <>
                    {record.paypal_email_address} <br />
                    Status: {record.paypal_account_status}
                </>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (text, record) => (
                <div className="text-center">
                    <span className={getStatusClass(record.captures_status)}>{record.captures_status}</span>
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div className="text-center">
                    <OverlayTrigger key="View" placement="top" overlay={<Tooltip id={`View`}>Check Status</Tooltip>}>
                        <Button
                            type="primary"
                            size="md"
                            onClick={() => {
                                Submit(record.paypal_id);
                                // showModal1();
                            }}
                        >
                            Check Status
                        </Button>
                    </OverlayTrigger>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="wrap-orders">
                <Row gutter={[8, 8]} align="middle" justify={{ md: 'center', lg: 'space-between' }}>
                    <Col xs={24} md={9} lg={6} xl={5}>
                        <Card className="round_card">
                            <Button type="primary" size="large" onClick={showModal}>
                                Pay Now
                            </Button>
                        </Card>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={data1} rowKey="id" bordered className="table" />
            </div>

            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalData ? <pre>{JSON.stringify(modalData, null, 2)}</pre> : 'Loading...'}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* <Form className="row g-3">
                <Modal show={showform} onHide={handleCloseform}>
                    <Modal.Header closeButton>
                        <Modal.Title>Instant Transfer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-2 col-md-12 form_details">
                            <select
                                id="currencyDropdown"
                                className="form-select"
                                name="currencyCode"
                                value={currencyCode}
                                onChange={handleChangeCurrency}
                            >
                                <option value="AUD">Australian Dollar (AUD)</option>
                                <option value="BRL">Brazilian Real 2 (BRL)</option>
                                <option value="CAD">Canadian Dollar (CAD)</option>
                                <option value="CNY">Chinese Renmenbi 4 (CNY)</option>
                                <option value="CZK">Czech Koruna (CZK)</option>
                                <option value="DKK">Danish Krone (DKK)</option>
                                <option value="EUR">Euro (EUR)</option>
                                <option value="HKD">Hong Kong Dollar (HKD)</option>
                                <option value="HUF">Hungarian Forint 1 (HUF)</option>
                                <option value="ILS">Israeli New Shekel (ILS)</option>
                                <option value="JPY">Japanese Yen 1 (JPY)</option>
                                <option value="MYR">Malaysian Ringgit 3 (MYR)</option>
                                <option value="MXN">Mexican Peso (MXN)</option>
                                <option value="TWD">New Taiwan Dollar 1 (TWD)</option>
                                <option value="NZD">New Zealand Dollar (NZD)</option>
                                <option value="NOK">Norwegian Krone (NOK)</option>
                                <option value="PHP">Philippine Peso (PHP)</option>
                                <option value="PLN">Polish Złoty (PLN)</option>
                                <option value="GBP">Pound Sterling (GBP)</option>
                                <option value="SGD">Singapore Dollar (SGD)</option>
                                <option value="SEK">Swedish Krona (SEK)</option>
                                <option value="CHF">Swiss Franc (CHF)</option>
                                <option value="THB">Thai Baht (THB)</option>
                                <option value="USD">United States Dollar (USD)</option>
                            </select>
                        </Form.Group>
                        <Form.Group className="mb-2 col-md-12 form_details ">
                            <Form.Control
                                className="form-control_custom"
                                type="text"
                                id="amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChangeAmount}
                                placeholder="Enter amount"
                            />
                        </Form.Group>

                        <Form.Group className="mb-2 col-md-12 form_details">
                            <Form.Control
                                className="form-control_custom"
                                type="text"
                                id="product_name"
                                name="product_name"
                                value={formData.product_name}
                                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                                placeholder="Enter product name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-2 col-md-12 form_details">
                            <Form.Control
                                className="form-control_custom"
                                type="text"
                                id="quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                placeholder="Enter quantity"
                            />
                        </Form.Group>

                        <Form.Group className="mb-2 col-md-6 form_details ">
                            <Form.Control
                                className="form-control_custom"
                                type="hidden"
                                id="cur01"
                                name="cur01"
                                placeholder="Enter cur01"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <div
                            id="paypal-buttons-container"
                            disabled={!isFormValid}
                            className="col-md-12 form_details"
                        ></div>
                    </Modal.Footer>
                </Modal>
            </Form> */}

            <Modal
                open={isModalOpen1}
                onOk={handleOk1}
                onCancel={handleCancel1}
                title="Order Details"
                footer={[
                    <Button variant="secondary" onClick={handleCancel1}>
                        Close
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    {modalData ? <pre>{JSON.stringify(modalData, null, 2)}</pre> : 'Loading...'}
                </Form>
            </Modal>

            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                title="Transfer Amount"
                footer={[
                    <div
                        id="paypal-buttons-container"
                        disabled={!isFormValid}
                        className="col-md-12 form_details"
                    ></div>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item>
                        <select
                            id="currencyDropdown"
                            className="form-select form-control_custom"
                            name="currencyCode"
                            value={currencyCode}
                            onChange={handleChangeCurrency}
                        >
                            <option value="AUD">Australian Dollar (AUD)</option>
                            <option value="BRL">Brazilian Real 2 (BRL)</option>
                            <option value="CAD">Canadian Dollar (CAD)</option>
                            <option value="CNY">Chinese Renmenbi 4 (CNY)</option>
                            <option value="CZK">Czech Koruna (CZK)</option>
                            <option value="DKK">Danish Krone (DKK)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="HKD">Hong Kong Dollar (HKD)</option>
                            <option value="HUF">Hungarian Forint 1 (HUF)</option>
                            <option value="ILS">Israeli New Shekel (ILS)</option>
                            <option value="JPY">Japanese Yen 1 (JPY)</option>
                            <option value="MYR">Malaysian Ringgit 3 (MYR)</option>
                            <option value="MXN">Mexican Peso (MXN)</option>
                            <option value="TWD">New Taiwan Dollar 1 (TWD)</option>
                            <option value="NZD">New Zealand Dollar (NZD)</option>
                            <option value="NOK">Norwegian Krone (NOK)</option>
                            <option value="PHP">Philippine Peso (PHP)</option>
                            <option value="PLN">Polish Złoty (PLN)</option>
                            <option value="GBP">Pound Sterling (GBP)</option>
                            <option value="SGD">Singapore Dollar (SGD)</option>
                            <option value="SEK">Swedish Krona (SEK)</option>
                            <option value="CHF">Swiss Franc (CHF)</option>
                            <option value="THB">Thai Baht (THB)</option>
                            <option value="USD">United States Dollar (USD)</option>
                        </select>
                    </Form.Item>

                    <Form.Item rules={[{ required: true, message: 'Please Enter amount' }]}>
                        <Input
                            className="form-control_custom"
                            type="text"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChangeAmount}
                            placeholder="Enter amount"
                        />
                    </Form.Item>

                    <Form.Item rules={[{ required: true, message: 'Please enter product name' }]}>
                        <Input
                            className="form-control_custom"
                            type="text"
                            id="product_name"
                            name="product_name"
                            value={formData.product_name}
                            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                            placeholder="Enter product name"
                        />
                    </Form.Item>
                    <Form.Item rules={[{ required: true, message: 'Please enter quantity' }]}>
                        <Input
                            className="form-control_custom"
                            type="text"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            placeholder="Enter quantity"
                        />
                    </Form.Item>
                    <Form.Item rules={[{ required: true, message: 'Please enter cur01' }]}>
                        <Input
                            className="form-control_custom"
                            type="hidden"
                            id="cur01"
                            name="cur01"
                            placeholder="Enter cur01"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default InstantTransfer1;
