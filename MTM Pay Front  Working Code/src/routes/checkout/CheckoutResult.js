import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Typography, Radio, Card, Divider, Space, Button } from "antd";
import PageTitle from "components/PageTitle";
import Parse from 'html-react-parser';
import { CreditCardIcon, LibraryIcon } from '@heroicons/react/outline';
import { Wallet, Scan, ChevronRight, ChevronDown } from 'react-iconly';
import dayjs from "dayjs";
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import Loading from 'components/Loading';
// images
// import successImg from 'assets/images/subscription_successfull.svg';
// import failedImg from 'assets/images/subscription_failed.svg';
// request
import { getSubscriptionResult } from 'requests/subscribe';

const { Title } = Typography;

const CheckoutResult = () => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = parseQueryParams(location);

        if (query.tx_id) {
            getResult(query.tx_id);
        } else {
            navigate('/404', { replace: true });
        }
    }, [location]);

    const getResult = async (txId) => {
        try {
            setLoading(true);
            const response = await getSubscriptionResult(txId);
            setResult(response);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <div className='checkout-result-wrapper'>
            {
                result && result.status ? (
                    <Card className='checkout-result-card'>
                        {/* <img src={successImg} alt="success" className='checkout-result-img' /> */}
                        <Title level={4}>Congratulations!</Title>
                        <div>You have successfully subscribed to <b>{result.plan_name}</b> plan. Now you can use all features of the <b>{result.plan_name}</b> plan!</div>
                        <Button type="primary" className='mt-36' onClick={() => navigate('/')}>Back to home</Button>
                    </Card>
                ) : (
                    <Card className='checkout-result-card'>
                        {/* <img src={failedImg} alt="failed" className='checkout-result-img' /> */}
                        <Title level={4}>Oops! Something went wrong!</Title>
                        <div>Your subscription is not existed. Please try again.</div>
                        <Button type="primary" danger className='mt-36' onClick={() => navigate('/pricing')}>Try again</Button>
                    </Card>
                )
            }
        </div>
    );
}

export default CheckoutResult;