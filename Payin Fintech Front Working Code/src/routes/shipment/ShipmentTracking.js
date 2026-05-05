import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Typography } from "antd";
import _ from 'lodash';
import Loading from "components/Loading";
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
// style
import 'assets/styles/shipment.scss';
// img
import sellonboardLogo from 'assets/images/logo_registered.png';
// request
import { getTrackingStatus } from 'requests/shipment';
import { generateShipmentTrackingUrl } from "utils/common";

const { Title } = Typography;

const ShipmentTracking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [title, setTitle] = useState('Tracking Order');
    const [loading, setLoading] = useState(true);
    const [trackingUrl, setTrackingUrl] = useState('');

    useEffect(() => {
        const query = parseQueryParams(location);
        if (!query.awb) {
            navigate('/404');
        }

        getData(query.awb);
    }, [location]);

    const getData = async (awb) => {
        try {
            setLoading(true);

            if (awb) {
                const response = await getTrackingStatus({ awb: awb });

                const url = generateShipmentTrackingUrl(response.service_id, awb);
                setTrackingUrl(url);
                setTitle(`Tracking Order #${response.order_number}`);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="shipment-tracking-wrapper">
            <Row className="shipment-tracking-header" align="middle" justify="space-between" gutter={[16, 16]}>
                <Title level={4} className="mb-0">{title}</Title>
                <Row align="middle" className="shipment-tracking-powered">
                    <Title level={4} className="mb-0">Powered by</Title>
                    <a href="https://sellonboard.com/">
                        <img src={sellonboardLogo} className="ml-8" />
                    </a>
                </Row>
            </Row>
            {
                loading ? (
                    <Loading />
                ) : (
                    <iframe src={trackingUrl} className="shipment-tracking-iframe" />
                )
            }
        </div>
    )
}

export default ShipmentTracking;