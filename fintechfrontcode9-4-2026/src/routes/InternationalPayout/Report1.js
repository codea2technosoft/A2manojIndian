import React, { useState, useEffect, useRef } from 'react';
import {Row, Col,Tabs } from 'antd';
import 'assets/styles/orders.scss';
import PendingTransaction from './PendingTransaction';
import SuccessTransaction from './SuccessTransaction';
import FailedTransaction from './FailedTransaction';

function Report() {
    
    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: '1',
            label: 'Pending',
            children: (
                <>
                  <PendingTransaction/>
                </>
            ),
        },
        {
            key: '2',
            label: 'Failed',
            children: (
                <>
                  <FailedTransaction/>
                </>
            ),
        },
        {
            key: '3',
            label: 'Success',
            children: (
                <>
                    <SuccessTransaction/>
                </>
            ),
        },
    ];

    return (
        <div className="wrap-orders">
            <Row>
                <Col xs={24}>
                    <Tabs
                        defaultActiveKey="1"
                        items={items}
                        onChange={onChange}
                        indicatorSize={(origin) => origin - 16}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Report;
