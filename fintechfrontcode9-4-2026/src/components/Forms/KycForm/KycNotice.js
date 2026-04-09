import { Typography, Button, Row } from "antd";

const { Title } = Typography;

const KycNotice = (props) => {
    const { onContinue } = props;

    return (
        <div className="kyc-notice">
            <div className="kyc-notice--title">
                <Title level={4}>Few more details required</Title>
            </div>
            <div className="kyc-notice--content">
                <p>
                    For your business model we need a few more KYC details to onboard you with us
                </p>
                <Row justify="center" className="mt-24">
                    <Button type="primary" size="large" onClick={onContinue}>Complete KYC</Button>
                </Row>
            </div>

        </div>
    )
}

export default KycNotice;