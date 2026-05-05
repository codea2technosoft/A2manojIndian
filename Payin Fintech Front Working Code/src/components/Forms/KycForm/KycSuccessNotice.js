import { useNavigate } from "react-router-dom";
import { Typography, Button, Row } from "antd";

const { Title } = Typography;

const KycSuccessNotice = (props) => {
    const { onClose } = props;

    const navigate = useNavigate();

    const onLink = () => {
        onClose();
        navigate('/pricing');
    }

    return (
        <div className="kyc-notice">
            <div className="kyc-notice--title">
                <Title level={4}>KYC details submitted successfully</Title>
            </div>
            <div className="kyc-notice--content">
                <p>
                    We have received all the required information to onboard you with our multiple partners.
                    In case we need more information, our team will contact you soon. You can now proceed to
                    link your existing accounts, if already signed up earlier.
                </p>
                <Row justify="center" className="mt-24">
                    <Button type="primary" size="large" onClick={onLink}>Link now</Button>
                </Row>
            </div>

        </div>
    )
}

export default KycSuccessNotice;