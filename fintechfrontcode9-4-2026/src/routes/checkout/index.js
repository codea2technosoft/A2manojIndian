import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Typography, Radio, Card, Divider, Space, Button, Switch } from "antd";
import PageTitle from "components/PageTitle";
import Parse from 'html-react-parser';
import { CreditCardIcon, LibraryIcon } from '@heroicons/react/outline';
import { Wallet, Scan, ChevronRight, ChevronDown } from 'react-iconly';
import dayjs from "dayjs";
// styles
import 'assets/styles/checkout.scss';
// requests
import { subscribePaidPlan } from 'requests/subscribe';
import { getSubscription } from 'requests/auth';
import { setConfigAction as setConfig } from "redux/actions/config";

const { Title } = Typography;

const Checkout = () => {
    const titles = [{ path: '/checkout', title: 'Checkout' }];

    // these values are set up in enum at backend
    const paymentOptions = [
        {
            title: 'Credit/Debit/ATM Card',
            value: 'cc',
            icon: <CreditCardIcon width={28} height={28} />
        },
        {
            title: 'UPI / QR',
            value: 'upi',
            icon: <Scan set='light' size={28} />
        },
        {
            title: 'Net Banking',
            value: 'bank',
            icon: <LibraryIcon width={28} height={28} />
        },
        {
            title: 'Wallet',
            value: 'wallet',
            icon: <Wallet set='light' size={28} />
        }
    ]

    const [loading, setLoading] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [selectedType, setSelectedType] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState({ currency: {} });
    const [estimatedSubtotal, setEstimatedSubtotal] = useState(0);
    const [estimatedExpiredDate, setEstimatedExpiredDate] = useState(dayjs());
    const [selectedPaymentOption, setSelectedPaymentOption] = useState('cc');
    const [autoRenew, setAutoRenew] = useState(false);
    const [disabledOption, setDisabledOption] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    const config = useSelector(state => state.config);

    useEffect(() => {
        const getData = async () => {
            let headerConfig = { show_back_button: false };
            // check current subscription
            const subscriptionResponse = await getSubscription();
            if (subscriptionResponse.subscription) {
                setSubscription(subscriptionResponse.subscription);
                headerConfig = { show_back_button: true };
            }

            dispatch(setConfig(headerConfig));
        }

        getData();
    }, []);

    useEffect(() => {
        if (state.selectedPlan) {
            setSelectedPlan(state.selectedPlan);
            setSelectedType(state.type);
        } else {
            navigate('/404', { replace: true });
        }
    }, [state]);

    useEffect(() => {
        if (selectedType === 'monthly') {
            setEstimatedSubtotal(Number(selectedPlan.monthly_price));
            setEstimatedExpiredDate(dayjs().add(1, 'month'));
        } else {
            setEstimatedSubtotal(Number(selectedPlan.monthly_price_paid_annual) * 12);
            setEstimatedExpiredDate(dayjs().add(1, 'year'));
        }
    }, [selectedPlan, selectedType]);

    useEffect(() => {
        if (subscription && selectedPlan) {
            if (subscription.plan_id === selectedPlan.id) {
                setDisabledOption(subscription.plan_type);
            }
        }
    }, [subscription, selectedPlan]);

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const response = await subscribePaidPlan(selectedPlan.id, selectedType, autoRenew ? 1 : 0);
            if (response.order) {
                window.open(`${process.env.REACT_APP_CHECKOUT_URL}/payment/checkout/${selectedPaymentOption}?order_id=${response.order.id}`, '_self');
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <Card className="mb-24">
                        {
                            subscription ? (
                                <Row align="middle">
                                    <div className="mr-32">
                                        <div><small className="uppercase">from</small></div>
                                        <Title level={4}>{subscription.plan_name}</Title>
                                    </div>
                                    <ChevronRight set="light" />
                                    <div className="ml-32">
                                        <div><small className="uppercase">change to</small></div>
                                        <Title level={4}>{selectedPlan.name}</Title>
                                    </div>
                                </Row>
                            ) : (
                                <div>
                                    <div><small className="uppercase">selected plan</small></div>
                                    <Title level={4}>{selectedPlan.name}</Title>
                                </div>
                            )
                        }
                        <Divider />
                        <Row justify="space-between">
                            <Radio.Group value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                <Space direction="vertical">
                                    <Radio value='monthly' disabled={disabledOption === 'monthly'}>
                                        <div>Monthly Plan</div>
                                        <div><small>{selectedPlan.currency.symbol}{selectedPlan.monthly_price} billed monthly</small></div>
                                    </Radio>
                                    <Radio value='annual' disabled={disabledOption === 'annual'}>
                                        <div>Annual Plan</div>
                                        <div><small>{selectedPlan.currency.symbol}{selectedPlan.monthly_price_paid_annual}/mo billed annual. <b>Save {selectedPlan.currency.symbol}{(Number(selectedPlan.monthly_price) - Number(selectedPlan.monthly_price_paid_annual)) * 12}</b></small></div>
                                    </Radio>
                                </Space>
                            </Radio.Group>
                            <div>
                                <small className="uppercase">till {estimatedExpiredDate.format('ddd, MMM D, YYYY')}</small>
                                <Title level={4} className="mb-0">{selectedPlan.currency.symbol}{estimatedSubtotal}</Title>
                            </div>
                        </Row>
                    </Card>
                    {/* Enable auto renew card */}
                    {/* <Card className="mb-24">
                        <Row justify="space-between" align="middle">
                            <Title level={5}>Enable auto renew</Title>
                            <Switch defaultChecked={autoRenew} onChange={(checked) => setAutoRenew(checked)} />
                        </Row>
                        <p>If this option is enabled, your current subscription will be renewed automatically when it is expired.</p>
                    </Card> */}
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Title level={4} className="mb-24">{selectedPlan.name}</Title>
                    <div>
                        {Parse(selectedPlan.description || '')}
                    </div>
                </Col>
            </Row>
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={24} md={16} lg={16}>
                    <div className="mb-24">
                        <Title level={4} className="mb-24">Payment options</Title>
                        {
                            paymentOptions.map(option => {
                                const isSelected = selectedPaymentOption === option.value;

                                return (
                                    <React.Fragment key={option.value}>
                                        <Card
                                            className={`mb-8 selectable-card ${isSelected ? 'selected-card' : ''}`}
                                            onClick={() => setSelectedPaymentOption(option.value)}
                                        >
                                            <Row align="middle" justify="space-between">
                                                <Row align="middle">
                                                    {option.icon}
                                                    <div className="ml-8">{option.title}</div>
                                                </Row>
                                            </Row>
                                        </Card>
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
                    <div className="mb-24">
                        <Button type="primary" size="large" onClick={onSubscribe}>Pay {selectedPlan.currency.symbol}{estimatedSubtotal * 1.18} and Upgrade</Button>
                        <div><small>The next charge will be made on <b>{estimatedExpiredDate.format('ddd, MMM D, YYYY')}</b></small></div>
                    </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Title level={4} className="mb-24">Summary</Title>
                    <Card>
                        <Row justify="space-between" align="middle">
                            <div>Subtotal</div>
                            <div><b>{selectedPlan.currency.symbol}{estimatedSubtotal}</b></div>
                        </Row>
                        <Row justify="space-between" align="middle" className="mt-16">
                            <div>Tax (18%)</div>
                            <div><b>{selectedPlan.currency.symbol}{estimatedSubtotal * 0.18}</b></div>
                        </Row>
                        <Divider />
                        <Row justify="space-between" align="middle">
                            <Title level={5}>Total</Title>
                            <Title level={5}>{selectedPlan.currency.symbol}{estimatedSubtotal * 1.18}</Title>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Checkout;