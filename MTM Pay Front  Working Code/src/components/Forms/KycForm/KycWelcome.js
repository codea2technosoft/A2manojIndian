import { useEffect, useState } from 'react';
import { Col, Row, Typography, Button } from 'antd';
import { useNavigate } from "react-router-dom";
import { Wallet } from 'react-iconly';
// request
import { getSubscription } from 'requests/auth';

const { Title } = Typography;

const KycWelcome = (props) => {
    const { onContinue, onClose } = props;

    const [isSubscribed, setIsSubscribed] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            const response = await getSubscription();
            if (response.subscription) setIsSubscribed(true);
        }

        getData();
    }, []);

    const onTryoutDashboard = () => {
        if (!isSubscribed) {
            navigate('/pricing');
        }
        onClose();
    }

    return (
        <Row className='kyc-welcome'>
            <Col xs={24} sm={24} md={16} lg={16} className='kyc-welcome--content'>
                <Title level={5}>Welcome to Step2Pay</Title>
                <Title level={3}>You are just one step away from ease of doing business</Title>
                <Title level={3} type="secondary" className="mt-24">Activate your account and find the right product for your business needs</Title>
                <Row align='middle' className="mt-36 kyc-welcome--content-integration">
                    <div className="kyc-welcome--icon">
                        <Wallet set='light' />
                    </div>
                    <div>
                        <Title level={5}>Fully integrated solutions</Title>
                        <Title level={5} type="secondary">no-coding required</Title>
                    </div>
                </Row>
                <Row justify='space-between' className='mt-36'>
                    <Button size='large' type='primary' onClick={onContinue}>Activate your account</Button>
                    <Button size='large' type='default' onClick={onTryoutDashboard}>Try out the dashboard</Button>
                </Row>
            </Col>
            <Col xs={0} sm={0} md={8} lg={8} className="kyc-welcome--image"></Col>
        </Row>
    )
}

export default KycWelcome;