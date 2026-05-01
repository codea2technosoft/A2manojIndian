import React from 'react';
import { CheckIcon } from '@heroicons/react/outline';
import { Row, Col, Collapse, Typography, Divider } from 'antd';
// styles
import styleVariables from 'assets/styles/variables.scss';
import 'assets/styles/components/plan-feature-table.scss';

const { Panel } = Collapse;
const { Title } = Typography;

const featureSettings = [
    {
        title: 'Payments',
        features: [
            {
                name: 'Payment Gateways Integration',
                items: [
                    { value: true, note: 'Limited' },
                    { value: true, note: 'All' },
                    { value: true, note: 'All' },
                ],
            },
            {
                name: 'Advanced Logics',
                items: [{ value: false }, { value: true }, { value: true }],
            },
            {
                name: 'Transaction rates',
                items: [
                    { value: false, note: 'Standard' },
                    { value: true, note: 'Better rates' },
                    { value: true, note: 'Lowest rates' },
                ],
            },
        ],
    },
    {
        title: 'Shipments',
        features: [
            {
                name: 'Shipment Gateways Integration',
                items: [
                    { value: true, note: 'Limited' },
                    { value: true, note: 'All' },
                    { value: true, note: 'All' },
                ],
            },
            {
                name: 'Advanced Logics',
                items: [{ value: false }, { value: true }, { value: true }],
            },
        ],
    },
    {
        title: 'Accounting',
        features: [
            {
                name: 'Invoicing',
                children: [
                    {
                        name: 'Online orders',
                        items: [{ value: true }, { value: true }, { value: true }],
                    },
                    {
                        name: 'Offline orders',
                        items: [{ value: true }, { value: true }, { value: true }],
                    },
                    {
                        name: 'OCR based',
                        items: [
                            { value: false, note: '' },
                            { value: true, note: 'Free 50/month' },
                            { value: true, note: 'Free 100/month' },
                        ],
                    },
                    {
                        name: 'GSTN import/ e-invoicing/ eway bills',
                        items: [{ value: false }, { value: true }, { value: true }],
                    },
                    {
                        name: 'Accounts Manager',
                        items: [{ value: false }, { value: false }, { value: true }],
                    },
                ],
            },
            {
                name: 'Accounting',
                children: [
                    {
                        name: 'Cloud based dashboard',
                        items: [{ value: false }, { value: true }, { value: true }],
                    },
                    {
                        name: 'Third party integrations',
                        items: [{ value: false }, { value: false }, { value: true }],
                    },
                ],
            },
        ],
    },
    {
        title: 'Notifications',
        features: [
            {
                name: 'Channels',
                children: [
                    {
                        name: 'SMS',
                        items: [
                            { value: true, note: 'Free 500/month' },
                            { value: true, note: 'Free 1000/month' },
                            { value: true, note: 'Free 1000/month' },
                        ],
                    },
                    {
                        name: 'Emails',
                        items: [{ value: true }, { value: true }, { value: true }],
                    },
                    {
                        name: 'WhatsApp - Messages',
                        items: [
                            { value: true, note: 'Free 100/month' },
                            { value: true, note: 'Free 1000/month*' },
                            { value: true, note: 'Free 1000/month*' },
                        ],
                    },
                    {
                        name: 'WhatsApp - Storefront chat widget',
                        items: [{ value: true }, { value: true }, { value: true }],
                    },
                    {
                        name: 'WhatsApp - Link your own number',
                        items: [{ value: false }, { value: true }, { value: true }],
                    },
                ],
            },
            {
                name: 'Communication',
                children: [
                    {
                        name: 'Campaigns',
                        items: [{ value: false }, { value: true }, { value: true }],
                    },
                    {
                        name: 'WhatsApp Chat Interface and Bot',
                        items: [{ value: false }, { value: true }, { value: true }],
                    },
                ],
            },
        ],
    },
    {
        title: 'Other Features',
        features: [
            {
                name: 'Users and Roles',
                items: [{ value: false }, { value: true }, { value: true }],
            },
            {
                name: 'Inventory Management',
                items: [{ value: false }, { value: true }, { value: true }],
            },
            {
                name: 'Google APIs (Calendar sync, google meet)',
                items: [{ value: false }, { value: false }, { value: true }],
            },
            {
                name: 'APIs access',
                items: [{ value: false }, { value: false }, { value: true }],
            },
        ],
    },
    {
        title: 'Support',
        features: [
            {
                name: 'Chat',
                items: [{ value: true }, { value: true }, { value: true }],
            },
            {
                name: 'Phone',
                items: [{ value: false }, { value: true }, { value: true }],
            },
            {
                name: 'Priority Support',
                items: [{ value: false }, { value: false }, { value: true }],
            },
            {
                name: 'Free Customisation',
                items: [
                    { value: false, note: '' },
                    { value: true, note: '2 hours' },
                    { value: true, note: '12 hours' },
                ],
            },
        ],
    },
];

const PlanFeatureTable = () => {
    console.log(featureSettings);
    return (
        <div>
            <Row className="plan-header-row">
                <Col md={12} lg={12}></Col>
                <Col className="plan-name" md={4} lg={4}>
                    BASIC
                </Col>
                <Col className="plan-name" md={4} lg={4}>
                    PRO
                </Col>
                <Col className="plan-name" md={4} lg={4}>
                    ULTRA
                </Col>
            </Row>
            {featureSettings.map((group, groupIndex) => (
                <div key={groupIndex}>
                    <Row className="feature-group-title">
                        <Title level={5}>{group.title}</Title>
                    </Row>
                    {group.features.map((feature, featureIndex) => (
                        <React.Fragment key={featureIndex}>
                            {feature.children ? (
                                <div>
                                    <Divider orientation="left" orientationMargin={16}>
                                        {feature.name}
                                    </Divider>
                                    {feature.children.map((children, childrenIndex) => (
                                        <Row
                                            className={`feature-row feature-row--subgroup ${
                                                (childrenIndex + 1) % 2 ? 'feature-row--odd' : 'feature-row--even'
                                            }`}
                                            key={childrenIndex}
                                        >
                                            <Col md={12} lg={12}>
                                                {children.name}
                                            </Col>
                                            {children.items.map((item, itemIndex) => (
                                                <Col className="feature-cell--center" md={4} lg={4} key={itemIndex}>
                                                    {item.value ? (
                                                        <CheckIcon
                                                            width={24}
                                                            height={24}
                                                            color={styleVariables.successColor}
                                                        />
                                                    ) : null}
                                                    <div className="size-12">{item.note}</div>
                                                </Col>
                                            ))}
                                        </Row>
                                    ))}
                                </div>
                            ) : (
                                <Row
                                    className={`feature-row ${
                                        (featureIndex + 1) % 2 ? 'feature-row--odd' : 'feature-row--even'
                                    }`}
                                >
                                    <Col md={12} lg={12}>
                                        {feature.name}
                                    </Col>
                                    {feature.items.map((item, itemIndex) => (
                                        <Col className="feature-cell--center" md={4} lg={4} key={itemIndex}>
                                            {item.value ? (
                                                <CheckIcon width={24} height={24} color={styleVariables.successColor} />
                                            ) : null}
                                            <div className="size-12">{item.note}</div>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PlanFeatureTable;
