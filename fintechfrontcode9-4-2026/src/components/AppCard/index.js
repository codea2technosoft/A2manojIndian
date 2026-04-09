import { useState } from "react";
import { Button, Card, Col, Row, Switch, Typography } from "antd";
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const AppCard = (props) => {
    const { app, onToggle, defaultChecked } = props;

    const [enabled, setEnabled] = useState(defaultChecked);

    const onChangeStatus = (checked) => {
        setEnabled(checked);
        onToggle(checked);
    }

    return (
        <Card className="h-100">
            <Row justify="space-between" align="top">
                <Title level={5}>{app.name}</Title>
                <Switch defaultChecked={defaultChecked} onChange={(checked) => onChangeStatus(checked)} />
            </Row>
            <Paragraph
                className="mt-8"
                ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
            >
                {app.description}
            </Paragraph>
            <Link to={`/apps/${app.id}`}>
                <Button type="primary" size="small" disabled={!enabled}>Config</Button>
            </Link>

        </Card>
    )
}

export default AppCard;