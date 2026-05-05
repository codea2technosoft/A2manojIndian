import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useParams, Link } from 'react-router-dom';
import PageTitle from "components/PageTitle";
import { Col, Row, Card, Typography, Divider, Avatar, Descriptions, Tooltip, Modal, Form, Input, Button } from "antd";
import Loading from "components/Loading";
import dayjs from "dayjs";
import { EditSquare } from 'react-iconly';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import OrderPaymentStatusDropdown from "components/OrderPaymentStatusDropdown";
import OrderFulfillmentStatusDropdown from "components/OrderFulfillmentStatusDropdown";
import OrderItem from "components/OrderItem";
import { generateShipmentTrackingUrl } from 'utils/common';
// request
import { getOrderDetail, updateOrderDetail } from 'requests/order';
import { getCountries } from 'requests/country';
import { BaseSelect } from "components/Elements";

const { Title } = Typography;

const OrderDetail = () => {
    const [titles, setTitles] = useState([{ path: '/orders', title: 'Orders' }]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState({});
    const [orderShipment, setOrderShipment] = useState({});
    const [shippingAddress, setShippingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [modalType, setModalType] = useState('shipping');
    const [visibleUpdateModal, setVisibleUpdateModal] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [countries, setCountries] = useState([]);

    const config = useSelector(state => state.config);

    const location = useLocation();
    const params = useParams();

    useEffect(() => {
        const getData = async () => {
            // get countries
            const countryResponse = await getCountries({ is_paginate: 0 });
            setCountries(countryResponse.records);

            // get order details
            const orderResponse = await getOrderDetail(params.id);
            setTitles([
                { path: '/orders', title: 'Orders' },
                { path: location.pathname, title: orderResponse.order_number }
            ])
            setOrder(orderResponse);

            // handle order shipment
            if (orderResponse.shipments.length) {
                const shipment = orderResponse.shipments[orderResponse.shipments.length - 1];
                shipment.selectedCarrier = config.carriers.find(item => item.value === Number(shipment.carrier));
                setOrderShipment(shipment);
            }

            // handle address
            const shippingAddressItems = [orderResponse.shipping_person_street, orderResponse.shipping_person_city, orderResponse.shipping_person_state, orderResponse.shipping_person_portal_code];
            if (orderResponse.shipping_person_country) shippingAddressItems.push(orderResponse.shipping_person_country.name);
            const formattedShippingAddress = shippingAddressItems.filter(item => item).join(', ');
            setShippingAddress(formattedShippingAddress);

            const billingAddressItems = [orderResponse.billing_person_street, orderResponse.billing_person_city, orderResponse.billing_person_state, orderResponse.billing_person_portal_code];
            if (orderResponse.billing_person_country) billingAddressItems.push(orderResponse.billing_person_country.name);
            const formattedBillingAddress = billingAddressItems.filter(item => item).join(', ');
            setBillingAddress(formattedBillingAddress);

            setLoading(false);
        }

        getData();
    }, []);

    const onOpenUpdateModal = (type) => {
        setModalType(type);
        setVisibleUpdateModal(true);
    }

    const onUpdateOrder = async (data) => {
        try {
            setLoadingUpdate(true);
            const orderResponse = await updateOrderDetail(order.id, data);
            setOrder(orderResponse);
            setVisibleUpdateModal(false);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingUpdate(false);
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            {
                loading ? (
                    <Loading />
                ) : (
                    <Row gutter={[16, 16]} className="mb-36">
                        <Col xs={24} sm={24} md={16} lg={16}>
                            <Card>
                                <Title level={3}>{order.currency} {order.total} - {dayjs(order.created_at).format('MMM DD, YYYY HH:mm')}</Title>
                                <Divider />
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <div>Payment status</div>
                                        <OrderPaymentStatusDropdown
                                            orderId={order.id}
                                            defaultValue={order.payment_status}
                                        />
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={8}>
                                        <div>Fulfillment status</div>
                                        <OrderFulfillmentStatusDropdown
                                            orderId={order.id}
                                            defaultValue={order.fulfillment_status}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                            {
                                order.note ? (
                                    <Card className="mt-24">
                                        <Title level={5} className="text-gray">Note</Title>
                                        <div>{order.note}</div>
                                    </Card>
                                ) : null
                            }
                            <Card className="mt-24">
                                <Title level={5} className="text-gray">Order items: {order.items.length}</Title>
                                {
                                    order.items.map(item => (
                                        <OrderItem orderItem={item} currency={order.currency} key={item.id} />
                                    ))
                                }
                                <Divider />
                                <Row justify="end">
                                    <Col xs={24} sm={24} md={12} lg={12}>
                                        <Row justify="space-between" align="middle">
                                            <div>Subtotal</div>
                                            <strong>{order.currency} {order.subtotal}</strong>
                                        </Row>
                                        <Row justify="space-between" align="middle">
                                            <div>Tax</div>
                                            <strong>{order.currency} {order.tax}</strong>
                                        </Row>
                                        <Row justify="space-between" align="middle" className="mt-8">
                                            <strong>Total</strong>
                                            <strong>{order.currency} {order.total}</strong>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                            <Card>
                                <Title level={5} className="text-gray">Store</Title>
                                <div>
                                    <Link to={`/stores/${order.user_store_id}`}>{order.user_store?.store_name}</Link>
                                </div>
                            </Card>
                            <Card className="mt-24">
                                <Row justify="space-between">
                                    <div>
                                        <Title level={5} className="text-gray">Customer</Title>
                                        <Title level={5}>{order.shipping_person_name}</Title>
                                        <div>
                                            <div>
                                                <span className="mr-8">Email:</span><a href={`mailto:${order.email}`}>{order.email}</a>
                                            </div>
                                            {
                                                order.shipping_person_mobile ? (
                                                    <div>
                                                        <span className="mr-8">Phone:</span><a href={`tel:${order.shipping_person_mobile}`}>{order.shipping_person_mobile}</a>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                    </div>
                                    {
                                        order.shipping_person_name ? <Avatar size={48}>{order.shipping_person_name[0]}</Avatar> : null
                                    }
                                </Row>
                                <Divider />
                                <Row justify="space-between">
                                    <Title level={5} className="text-gray">Shipping details</Title>
                                    <Tooltip title="Edit shipping details" placement="topRight">
                                        <EditSquare className="link" set="light" width={20} height={20} onClick={() => onOpenUpdateModal('shipping')} />
                                    </Tooltip>
                                </Row>
                                <Descriptions column={1} size="small" layout="vertical">
                                    <Descriptions.Item label="Shipping method">{order.shipping_method}</Descriptions.Item>
                                    {
                                        order.shipping_person_name ? <Descriptions.Item label="Shipping customer">{order.shipping_person_name}</Descriptions.Item> : null
                                    }
                                    {
                                        order.shipping_person_mobile ? <Descriptions.Item label="Shipping phone">{order.shipping_person_mobile}</Descriptions.Item> : null
                                    }
                                    {
                                        order.shipping_company_name ? <Descriptions.Item label="Shipping company">{order.shipping_company_name}</Descriptions.Item> : null
                                    }
                                    <Descriptions.Item label="Shipping address">{shippingAddress}</Descriptions.Item>
                                    {
                                        orderShipment ? (
                                            <React.Fragment>
                                                {
                                                    orderShipment.selectedCarrier && <Descriptions.Item label="Carrier">{orderShipment.selectedCarrier.display}</Descriptions.Item>
                                                }
                                                {
                                                    orderShipment.awb_code && (
                                                        <Descriptions.Item label="Tracking number">
                                                            <Link to={`/shipment/tracking?awb=${orderShipment.awb_code}`} target="_blank">
                                                                <span className="mr-8">{orderShipment.awb_code}</span>
                                                                <ExternalLinkIcon width={16} height={16} />
                                                            </Link>
                                                        </Descriptions.Item>
                                                    )
                                                }
                                            </React.Fragment>
                                        ) : null
                                    }

                                </Descriptions>
                                <Divider />
                                <Row justify="space-between">
                                    <Title level={5} className="text-gray">Payment details</Title>
                                    <Tooltip title="Edit shipping details" placement="topRight">
                                        <EditSquare className="link" set="light" width={20} height={20} onClick={() => onOpenUpdateModal('billing')} />
                                    </Tooltip>
                                </Row>
                                <Descriptions column={1} size="small" layout="vertical">
                                    <Descriptions.Item label="Payment method">{order.payment_method}</Descriptions.Item>
                                    {
                                        order.billing_person_name ? <Descriptions.Item label="Billing customer">{order.billing_person_name}</Descriptions.Item> : null
                                    }
                                    {
                                        order.billing_person_mobile ? <Descriptions.Item label="Billing phone">{order.billing_person_mobile}</Descriptions.Item> : null
                                    }
                                    {
                                        order.billing_company_name ? <Descriptions.Item label="Billing company">{order.billing_company_name}</Descriptions.Item> : null
                                    }
                                    <Descriptions.Item label="Billing address">{billingAddress}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                        </Col>
                    </Row>
                )
            }
            <Modal
                title="Update shipping details"
                visible={visibleUpdateModal}
                closable={false}
                footer={null}
                width={800}
            >
                <Form
                    initialValues={{
                        ...order,
                        shipping_person_country_id: Number(order.shipping_person_country_id),
                        billing_person_country_id: Number(order.billing_person_country_id)
                    }}
                    layout='vertical'
                    onFinish={onUpdateOrder}
                >
                    {
                        modalType === 'shipping' ? (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item name="shipping_person_name" label="Shipping person name">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="shipping_person_mobile" label="Shipping person phone number">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="shipping_person_street" label="Shipping street">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="shipping_company_name" label="Shipping company name">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item name="shipping_person_city" label="Shipping city">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="shipping_person_portal_code" label="Shipping postal code">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="shipping_person_state" label="Shipping state">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="shipping_person_country_id" label="Shipping country">
                                        <BaseSelect
                                            options={countries}
                                            optionLabel="name"
                                            optionValue="id"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        ) : (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item name="billing_person_name" label="Billing person name">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="billing_person_mobile" label="Billing person phone number">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="billing_person_street" label="Billing street">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="billing_company_name" label="Billing company name">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12}>
                                    <Form.Item name="billing_person_city" label="Billing city">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="billing_person_portal_code" label="Billing postal code">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="billing_person_state" label="Billing state">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="billing_person_country_id" label="Billing country">
                                        <BaseSelect
                                            options={countries}
                                            optionLabel="name"
                                            optionValue="id"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )
                    }
                    <Row justify="end">
                        <Button className="mr-8" disabled={loadingUpdate} onClick={() => setVisibleUpdateModal(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update</Button>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
}


export default OrderDetail;