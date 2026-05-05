import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Row, Col, Card, Space, Divider, Button } from 'antd';
import { ChevronRightIcon } from '@heroicons/react/outline';
// import image from 'assets/images/overview_card.png';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
// request
import { getSubscription } from 'requests/auth'

const { Title } = Typography;

const OverviewCardPlan = (props) => {
	const [subscription, setSubscription] = useState(null);
	const [pendingSubscription, setPendingSubscription] = useState(null);
	const [subscriptionType, setSubscriptionType] = useState('monthly');
	const [pendingSubscriptionType, setPendingSubscriptionType] = useState('monthly');

	useEffect(() => {
		const getData = async () => {
			const response = await getSubscription();
			if (response.subscription) {
				if (dayjs(response.subscription.end_date).diff(response.subscription.start_date, 'month') > 1) setSubscriptionType('annual');
				setSubscription(response.subscription);
			}
			if (response.pending) {
				setPendingSubscription(response.pending);
			}
		}

		getData();
	}, []);

	return (
		<Card className="overview-card">
			{/* <img className="card-image" src={image} /> */}
			{
				subscription ? (
					<React.Fragment>
						<Title level={3}>Active Plan <span className='uppercase'>{subscription.plan_name}</span></Title>
						<Space className="mt-8 mb-16">
							<span>Activated on </span>
							<span className="weight-5">{dayjs(subscription.start_date).format('ddd, MMM D, YYYY')}</span>
							<span> for </span>
							<span className="weight-5">{subscription.amount ? (subscriptionType === 'annual' ? `INR ${subscription.amount}/year` : `INR ${subscription.amount}/month`) : 'Free'}</span>
						</Space>
						<Card className="card-plan">
							{
								pendingSubscription ? (
									<Row gutter={[12, 12]} justify="space-between" align="middle">
										<Col md={24} lg={24}>
											<div className="mt-8">
												<span className="weight-7 purple-color">
													Current <span className='uppercase'>{subscription.plan_name}</span> plan will be {subscription.monthly_price < pendingSubscription.monthly_price ? 'upgraded' : 'downgraded'} to <span className='uppercase'>{pendingSubscription.plan_name}</span> plan on {dayjs(subscription.end_date).format('ddd, MMM D, YYYY')}.
												</span>
											</div>
											<div className="mt-8 mb-8">
												<span className="weight-7 purple-color">Next Charge for {pendingSubscription.plan_name} - {pendingSubscription.plan_type} due on {dayjs(pendingSubscription.end_date).format('ddd, MMM D, YYYY')} for </span>
												<span className="weight-7 purple-color">{pendingSubscriptionType === 'annual' ? `INR ${pendingSubscription.monthly_price_paid_annual * 1.18}/year` : `INR ${pendingSubscription.monthly_price * 1.18}/month`}</span>
											</div>
										</Col>
									</Row>
								) : (
									<Row gutter={[12, 12]} justify="space-between" align="middle">
										<Col md={18} lg={16}>
											{
												subscription.amount ? (
													<Space className="mt-8 mb-16">
														<span className="weight-7 purple-color">
															<span>Next Charge for {subscription.plan_name} - {subscription.plan_type} due on {dayjs(subscription.end_date).format('ddd, MMM D, YYYY')} for </span>
															<span>{subscriptionType === 'annual' ? `INR ${subscription.monthly_price_paid_annual * 1.18}/year` : `INR ${subscription.monthly_price * 1.18}/month`}</span>
														</span>
													</Space>
												) : (
													<Space className="mt-8 mb-16">
														<span className="weight-7 purple-color">{subscription.plan_name} plan will expire on {dayjs(subscription.end_date).format('ddd, MMM D, YYYY')}. To resume services, upgrade to paid plan.</span>
													</Space>
												)
											}
										</Col>
										<Link to='/pricing'>
											<Button type="primary" className="weight-6">
												Manage Plan
											</Button>
										</Link>
									</Row>
								)
							}

							<Divider style={{ margin: 2 }} />
							<Row gutter={[12, 12]} justify="end">
								<Space direction="vertical" className="mt-16">
									<Link to='/subscriptions'>
										<Button type="link" size="small" className="weight-6">
											<span>View payment history</span>
											<ChevronRightIcon width={14} height={14} className="ml-8 weight-6" />
										</Button>
									</Link>
								</Space>
							</Row>
						</Card>
					</React.Fragment>
				) : (
					<React.Fragment>
						<Title level={3}>You haven't subscribed any Plan</Title>
						<Space className="mt-8 mb-16">
							<span></span>
						</Space>
						<Card className="card-plan">
							<Row className='mb-16' gutter={[12, 12]} justify="space-between" align="middle">
								<div>
									<div className="weight-5 red-color">Subscribe plan to use all features of Step2Pay</div>
								</div>
								<Link to='/pricing'>
									<Button type="primary" className="weight-6">
										Subscribe Plan
									</Button>
								</Link>
							</Row>
						</Card>
					</React.Fragment>
				)
			}

			<div className="card-footer">Need help ? Read our Billing FAQ or email us at support@sellonboard.com</div>
		</Card>
	);
}

OverviewCardPlan.propTypes = {};

export default OverviewCardPlan;
