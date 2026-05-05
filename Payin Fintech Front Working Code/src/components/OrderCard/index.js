import React, { useEffect, useState } from 'react';
import { Row, Col, Checkbox, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { Discovery, Wallet, ChevronDown, ChevronUp, ChevronRight } from 'react-iconly';
import OrderFulfillmentStatusDropdown from 'components/OrderFulfillmentStatusDropdown';
import OrderPaymentStatusDropdown from 'components/OrderPaymentStatusDropdown';
import OrderItem from 'components/OrderItem';

const { Title, Text } = Typography;

const OrderCard = (props) => {
    const { order, selected, onToggleSelectOrder } = props;

    const [address, setAddress] = useState('');
    const [visibleOrderItems, setVisibleOrderItems] = useState(false); // <=== use in case order items length > 2

    useEffect(() => {
        const addressItems = [order.shipping_person_street, order.shipping_person_city, order.shipping_person_state, order.shipping_person_portal_code];
        if (order.shipping_person_country) addressItems.push(order.shipping_person_country.name);

        const formattedAddress = addressItems.filter(item => item).join(', ');
        setAddress(formattedAddress);
    }, [order]);

    const toggleVisibleOrderItems = () => {
        setVisibleOrderItems(!visibleOrderItems);
    }

    const renderOrderItems = (items, currency) => {
        if (items.length) {
            if (items.length === 1) {
                return <OrderItem orderItem={items[0]} currency={currency} />
            }

            const images = [];
            for (let item of items) {
                if (item.image) images.push(item.image);
            }

            return (
                <div>
                    <Row className='link mb-8' align='middle' onClick={toggleVisibleOrderItems}>
                        <span className='mr-8'>{items.length} items</span>
                        {visibleOrderItems ? <ChevronUp set='light' size={16} /> : <ChevronDown set='light' size={16} />}
                    </Row>
                    {
                        visibleOrderItems ? (
                            <React.Fragment>
                                {
                                    items.map((item, index) => (
                                        <OrderItem key={index} orderItem={item} currency={currency} />
                                    ))
                                }
                            </React.Fragment>
                        ) : (
                            <Avatar.Group maxCount={2}>
                                {
                                    images.map((image, index) => (
                                        <Avatar key={index} shape="square" size={36} src={image} className="mr-8" />
                                    ))
                                }
                            </Avatar.Group>
                        )
                    }
                </div>
            )
        }

        return null;
    }

    return (
        <Row gutter={[16, 16]}>
            <Col xs={0} sm={0} md={1} lg={1}>
                <Checkbox checked={selected} onChange={() => onToggleSelectOrder(order.id)} />
            </Col>
            <Col xs={12} sm={12} md={11} lg={11}>
                <Row align="middle">
                    <Title level={3} className="mb-0 mr-16">#{order.order_number}</Title>
                    <Title level={4} type="secondary" className='mt-0 mb-0'>{new Date(order.created_at).toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Title>
                </Row>
                <Row className='mt-8'>
                    <OrderPaymentStatusDropdown
                        orderId={order.id}
                        defaultValue={order.payment_status}
                    />
                    <OrderFulfillmentStatusDropdown
                        orderId={order.id}
                        defaultValue={order.fulfillment_status}
                    />
                </Row>
                <div className='mt-8'>
                    <div>
                        {
                            order.shipping_person_name ? (
                                <span className='mr-16'>{order.shipping_person_name}</span>
                            ) : null
                        }

                        <span>
                            <a href={`mailto:${order.email}`}>{order.email}</a>
                        </span>
                    </div>
                    <div>{address}</div>
                    {
                        order.shipping_person_mobile ? <div>Phone:<span className='ml-8'>{order.shipping_person_mobile}</span></div> : null
                    }
                </div>
                <Row className='mt-8'>
                    <Row align='middle' className='mr-36'>
                        <Discovery set='light' size={18} />
                        <div className='ml-8'>{order.shipping_method}</div>
                    </Row>
                    <Row align='middle'>
                        <Wallet set='light' size={18} />
                        <div className='ml-8'>{order.payment_method}</div>
                    </Row>
                </Row>
                <Row className='mt-16'>
                    {renderOrderItems(order.items, order.currency)}
                </Row>
            </Col>
            <Col xs={12} sm={12} md={10} lg={10}>
                <Row justify='end'>
                    <Title level={3}>{order.currency} {order.total}</Title>
                </Row>
            </Col>
            <Col xs={0} sm={0} md={2} lg={2}>
                <Row justify='end' className='card-order--detail-btn'>
                    <Link to={`/orders/${order.id}`}>
                        <ChevronRight set='light' size={40} />
                    </Link>
                </Row>
            </Col>
        </Row>
    )
}

export default OrderCard;