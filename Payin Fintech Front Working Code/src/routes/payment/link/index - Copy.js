import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageTitle from 'components/PageTitle';
import { Card, Form, Row, Col, Input, Button, Modal, Divider } from 'antd';
import { generateRandomString } from 'utils/common';
import { RefreshIcon } from '@heroicons/react/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// requests
import { createOrder } from 'requests/order';

const PaymentLink = () => {
    const [loading, setLoading] = useState(false);
    const [visibleModal, setVisibleModal] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState('');
    const [qrImageUrl, setQrImageUrl] = useState('');


    const location = useLocation();

    const titles = [{ path: location.pathname, title: 'Payment Links' }];

    const [formRef] = Form.useForm();

    const initialValues = {
        order_number: generateRandomString(8),
        billing_person_name: 'John Smith',
        email: 'test@test.com',
        phone: '8989898989',
        subtotal: 100,
        tax: 0,
        currency: 'INR',
        return_url: 'https://www.google.com'
    }

    const onSubmit = async (formData) => {
        try {
            setLoading(true);

            const payload = {
                ...formData,
                total: Number(formData.subtotal) + Number(formData.tax),
                fulfillment_status: "1", // awaiting
                payment_status: "1", // awaiting
                type: "3", // partner
                platform_id: "0"
            };

            const response = await createOrder(payload);
            if(response.status_code == 400){
                toast(response.message);
                return;
            }
            const checkoutUrl = `${process.env.REACT_APP_API_URL}payment/checkout/general?order_id=${response.id}`;
            // const checkoutUrl = `${process.env.REACT_APP_CHECKOUT_URL}/payment/checkout/general?order_id=${response.id}`;

            if (response.qr_image_url) {
                setCheckoutUrl(checkoutUrl);
                setQrImageUrl(response.qr_image_url);
                setVisibleModal(true);
            } else {
                window.open(checkoutUrl, '_blank');
            }

    
            formRef.setFieldsValue({
                ...initialValues,
                order_number: generateRandomString(8)
            })
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const onOpenCheckoutUrl = () => {
        window.open(checkoutUrl, '_blank');
    }

    return (
        <div>
            <ToastContainer />
            <PageTitle titles={titles} />
            <Card>
                <Form
                    layout='vertical'
                    form={formRef}
                    initialValues={initialValues}
                    onFinish={onSubmit}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name='order_number' label='Order number' rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name='billing_person_name' label='Billing person name' rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name='email' label='Email' rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name='phone' label='Phone' rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name='subtotal' label='Subtotal' rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name='tax' label='Tax' rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name='currency' label='Currency' rules={[{ required: true }]}>
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item name='return_url' label='Return URL' rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify='end'>
                        <Button type='primary' htmlType='submit' loading={loading}>Submit and checkout</Button>
                    </Row>
                </Form>
            </Card>
            <Modal
                open={visibleModal}
                title="Checkout"
                footer={null}
                closable
                onCancel={() => setVisibleModal(false)}
            >
                <Row justify='center'>
                    <Button type='primary' onClick={onOpenCheckoutUrl}>Open checkout URL</Button>
                </Row>
                <Divider>or</Divider>
                <Row justify='center'>
                <img width={200} src={qrImageUrl} alt='QR' />
                </Row>
            </Modal>
        </div>
    )
}

export default PaymentLink;