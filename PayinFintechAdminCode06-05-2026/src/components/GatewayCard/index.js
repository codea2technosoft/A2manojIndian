import { useState } from "react";
import { Button, Card, Col, Row, Switch, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title, Paragraph } = Typography;

const segment = window.location.pathname.split("/");
// alert(segment[2]);
const idParam = segment[2];

const GatewayCard = (props) => {
  const { service, onToggle, defaultChecked } = props;

  const [enabled, setEnabled] = useState(defaultChecked);

  const onChangeStatus = (checked) => {
    setEnabled(checked);
    onToggle(checked);
  };

  return (
    <Card className="h-100">
      <Row justify="space-between" align="top">
        <Title level={5}>{service.name}</Title>
        <Switch
          defaultChecked={defaultChecked}
          onChange={(checked) => onChangeStatus(checked)}
        />
      </Row>
      <Paragraph
        className="mt-8"
        ellipsis={{ rows: 3, expandable: true, symbol: "more" }}
      >
        {service.description}
      </Paragraph>
      <Link to={`/gateway/${service.id}/${idParam}`}>
        <Button type="primary" size="small" disabled={!enabled}>
          Config
        </Button>
      </Link>
    </Card>
  );
};

export default GatewayCard;
