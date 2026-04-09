import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Typography, Row, Col, Card, Divider, Button, Spin } from "antd";
import parse from 'html-react-parser';
import { toast } from 'react-toast';
import CornerRibbon from "react-corner-ribbon";
import dayjs from "dayjs";
import _ from 'lodash';
import PageTitle from "components/PageTitle";
import PlanFeatureTable from "components/PlanFeatureTable";
// styles
import styleVariables from 'assets/styles/variables.scss';
import 'assets/styles/pricing.scss';
// images
// import trialImage from 'assets/images/trial.svg';
// requests
import { getPlans } from 'requests/plan';
import { subscribeTrialPlan } from 'requests/subscribe';
import { getSubscription } from 'requests/auth';
import { setConfigAction as setConfig } from "redux/actions/config";

const { Title } = Typography;

const Pricing = () => {
    const titles = [{ path: '/pricing', title: 'Pricing' }];

    const [loading, setLoading] = useState(false);
    const [trialPlans, setTrialPlans] = useState([]);
    const [paidPlans, setPaidPlans] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [currentActivatedPaidPlanIndex, setCurrentActivatedPaidPlanIndex] = useState(-1);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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

            const response = await getPlans();

            const trialPlans = [];
            let paidPlans = [];
            response.records.forEach(item => {
                if (item.is_trial_plan) trialPlans.push(item);
                else paidPlans.push(item);
            });

            paidPlans = _.sortBy(paidPlans, 'monthly_price');

            setTrialPlans(trialPlans);
            setPaidPlans(paidPlans);
            dispatch(setConfig(headerConfig));
        }

        getData();
    }, []);

    useEffect(() => {
        console.log(subscription)
        if (subscription && paidPlans.length) {
            const tmp = paidPlans.findIndex(item => subscription.plan_id === item.id);

            setCurrentActivatedPaidPlanIndex(tmp);
        }
    }, [subscription, paidPlans]);

    const generateSubscribeText = (plan, index) => {
        if (!currentActivatedPaidPlanIndex) return "Get started";

        if (index < currentActivatedPaidPlanIndex) {
            return `Downgrade to ${plan.name}`;
        } else if (index > currentActivatedPaidPlanIndex) {
            return `Upgrade to ${plan.name}`;
        } else {
            if (subscription.plan_type === 'monthly') return `Switch to Annual`;
            return `Switch to Monthly`;
        }
    }

    const onSubscribePaidPlan = async (planId) => {
        const selectedPlanIndex = paidPlans.findIndex(item => item.id === Number(planId));

        let type = 'monthly';
        if (selectedPlanIndex === currentActivatedPaidPlanIndex) {
            if (subscription.plan_type === 'monthly') type = 'annual';
        }
        navigate('/checkout', {
            state: { selectedPlan: paidPlans[selectedPlanIndex], type: type }
        });
    }

    const onSubscribeTrialPlan = async (planId) => {
        try {
            setLoading(true);
            await subscribeTrialPlan(planId);
            // redirect to create store page
            navigate('/stores/create');
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <Spin spinning={loading} size="large">
                <Row gutter={[24, 16]}>
                    {
                        paidPlans.map((plan, index) => {
                            const isActivated = currentActivatedPaidPlanIndex === index;

                            return (
                                <Col xs={24} sm={24} md={8} lg={8} key={plan.id}>
                                    <Card className={`plan-pricing-card ${isActivated ? 'plan-pricing-card--actived' : ''}`}>
                                        {
                                            isActivated && (
                                                <CornerRibbon
                                                    position="top-right"
                                                    fontColor={styleVariables.whiteColor}
                                                    backgroundColor={styleVariables.primaryColor}
                                                >
                                                    ACTIVATED
                                                </CornerRibbon>
                                            )
                                        }
                                        <Title level={3}>{plan.name}</Title>
                                        <Row align="bottom">
                                            <Title level={1} className="mb-0">{plan.currency.symbol}{plan.monthly_price}</Title>
                                            <span className="ml-8 month-marker">/mo</span>
                                        </Row>
                                        <div className="mt-16">
                                            <strong>{plan.currency.symbol} {plan.monthly_price_paid_annual}/mo</strong>
                                            <span> paid annually</span>
                                        </div>
                                        <Divider />
                                        <div className="plan-content-wrapper">
                                            <div className="plan-description">{parse(plan.description)}</div>
                                            <Button type="primary" className="w-100 mt-36" onClick={() => onSubscribePaidPlan(plan.id)}>
                                                {generateSubscribeText(plan, index)}
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
                <Row justify="center" align="middle" className="mt-24">
                    <small>Step2Pay collects the India sales tax because it's required by law. All prices on this page do not include taxes.</small>
                </Row>
                {
                    (!subscription || currentActivatedPaidPlanIndex < 0) ? (
                        <div>
                            {
                                trialPlans.map((plan) => (
                                    <Card className="mt-32 plan-trial-card">
                                        <Row justify="space-between" align="middle">
                                            {
                                                subscription && subscription.plan_id === plan.id ? (
                                                    <div>
                                                        <Title level={2}>{plan.name} activated</Title>
                                                        <Title level={5}>You have subscribed to this plan on {dayjs(subscription.start_date).format('ddd, MMM D, YYYY')}</Title>
                                                        <Title level={5}>
                                                            <span>Your current plan will expire on {dayjs(subscription.end_date).format('ddd, MMM D, YYYY')}. </span>
                                                            <span>Remaining {Math.ceil(dayjs(subscription.end_date).diff(dayjs(), 'hour') / 24)} day(s)</span>
                                                        </Title>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Title level={2}>Start {config.trial_days} Days Free Trial</Title>
                                                        <Title level={4}>Try Step2Pay first & decide later, no credit card require.</Title>
                                                        <Button type="primary" size="large" className="mt-24" onClick={() => onSubscribeTrialPlan(plan.id)}>
                                                            Start Trial Now
                                                        </Button>
                                                    </div>
                                                )
                                            }

                                            {/* <img src={trialImage} alt="trial" /> */}
                                        </Row>
                                    </Card>
                                ))
                            }
                        </div>
                    ) : null
                }

            </Spin>
            <div className="mt-36 mb-36">
                <Title level={4}>Compare plans</Title>
                <PlanFeatureTable />
            </div>
        </div>
    )
}

export default Pricing;