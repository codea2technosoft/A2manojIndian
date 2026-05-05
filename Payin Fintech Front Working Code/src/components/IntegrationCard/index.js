import { Button, Card, Col, Row, Switch, Typography } from "antd";
import { Swap } from 'react-iconly';
// images
import sellonboardLogo from 'assets/images/logo.png';
// styles
import 'assets/styles/components/integration-card.scss';

const { Title } = Typography;

const IntegrationCard = (props) => {
    const { logo, name, description, buttonTitle, onClick } = props;

    return (
        <Card className="integration-card">
            <Row justify="center" align="middle">
                <img src={sellonboardLogo} className="integration-logo" />
                <span className="integration-connect-icon">
                <Swap set="light" />
                </span>
                <img src={logo} className="integration-logo" />
            </Row>
            <Row justify="center" className="mt-8">
                <Title level={4}>Connect Step2Pay to your {name} account</Title>
            </Row>
            <div className="mt-8">
                {description}
            </div>
            <div className="mt-16">
                <small>
                    By clicking on {buttonTitle}, you authorize Step2Pay to use your {name} information in accordance 
                    with its Privacy Policy. You can stop it at anytime by remove Step2Pay app from your {name}.
                </small>
            </div>
            <Row justify="end" className="mt-16">
                <Button type="primary" onClick={onClick}>{buttonTitle}</Button>
            </Row>
        </Card>
    )
}

export default IntegrationCard;