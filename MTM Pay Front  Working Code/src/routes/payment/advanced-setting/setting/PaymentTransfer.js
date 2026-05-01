import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Switch } from 'antd';

const { Title } = Typography;

const PaymentTransfer = (props) => {
    const { data, onUpdateData } = props;

    return (
        <div>
            <Card>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                        <Row justify='space-between'>
                            <Title level={5}>Transfer funds in route linked account</Title>
                            <Switch
                                defaultChecked={!!data.transfer_funds_linked_account}
                                onChange={(checked) => onUpdateData(`partner.transfer_funds_linked_account`, Number(checked))}
                            />
                        </Row>
                        <p style={{ textAlign: 'justify' }}>
                            <span>Note: If enabled, the funds will be settled in the linked bank account via transfer APIs. </span>
                            <span>You have to add the linked bank account in the gateway dashboard and fill the linked bank account ID in the Merchants &#62; Onboarding settings.</span>
                        </p>
                        <p style={{ textAlign: 'justify' }}>
                            If disabled, the funds will be settled in the original bank account linked with the merchant accounts.
                        </p>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default PaymentTransfer;
