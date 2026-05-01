import { useEffect, useState } from 'react';
import { useNavigate, Navigate, Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Card, Col, Row, Form, Divider, Typography, Input, Checkbox } from 'antd';
import { toast } from 'react-toast';
import api from 'utils/api';
import successloader from '../../assets/images/success_loader.gif';
import info from '../../assets/images/info.gif';
import failed_file from '../../assets/images/failed_file.gif';
import { FaArrowRight } from 'react-icons/fa6';

// images
import logo from 'assets/images/logo.png';
import authenticationImage from 'assets/images/login yumpe.png';
// requests
import { loginAction as login } from 'redux/actions/auth';

const { Title } = Typography;

const Response = () => {
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const [data, setdata] = useState([]);

    useEffect(() => {
        // alert('opp');
        // alert(searchParams.get('id'));
        dataGET();
    }, []);

    const dataGET = async () => {
        // alert('oppp');
        try {
            var id = searchParams.get('id');
            const response = await api.get(`/webhook/payment/ChkOrderStatus/${id}`);
            console.warn(response.data.data);
            setdata(response.data.data);
        } catch (error) {
            // toast.error('An error occurs. Please try again.');
        } finally {
            // setLoading(false);
        }
    };

    return (
        <div className="bg_reponscepage">
            <div className="container_success">
                <div className="logo_design">
                    <img src={logo} />
                </div>
                {data.payment_status == 2 ? (
                    <div className="paymentmode">
                        <div className="message-box _success">
                            <div className="successloader">
                                <img className="successimage" src={successloader} />
                            </div>
                            <h2 style={{ fontFamily: 'cursive', fontWeight: 800 }}>Order ID : {data.order_number}</h2>
                            <h2 style={{ fontFamily: 'cursive' }}>Your payment was successful</h2>
                            <p>Thank you for your payment.</p>
                        </div>
                        <div className="text-center">
                            <Link className="backtowebsite" to={data.retrun_url}>
                                Back to Home <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                ) : data.payment_status == 7 ? (
                    <div className="paymentmode">
                        <div className="message-box _failed">
                            <div className="successloader">
                                <img className="successimage" src={failed_file} />
                            </div>
                            <h2 style={{ fontFamily: 'cursive', fontWeight: 800 }}>Order ID : {data.order_number}</h2>
                            <h2 style={{ fontFamily: 'cursive' }}>Your payment failed</h2>
                            <p>Please Try Again.</p>
                        </div>
                        <div className="text-center">
                            <Link className="backtowebsite" to={data.retrun_url}>
                                Back to Home <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                ) : data.payment_status == 1 ? (
                    <div className="paymentmode">
                        <div className="message-box _failed">
                            <div className="successloader">
                                <img className="successimage" src={info} />
                            </div>
                            <h2 style={{ fontFamily: 'cursive', fontWeight: 800 }}>Order ID : {data.order_number}</h2>
                            <h2 style={{ fontFamily: 'cursive' }}>Your payment Pending</h2>
                            <p>
                                Your payment is pending. Please allow some time for processing, or contact support if it
                                isn't completed soon.
                            </p>
                        </div>
                        <div className="text-center">
                            <Link className="backtowebsite" to={data.retrun_url}>
                                Back to Home <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default Response;
