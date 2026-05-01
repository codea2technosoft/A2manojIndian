import React, { useState, useEffect, useRef } from 'react';
import {Row, Col,Tabs } from 'antd';
import 'assets/styles/orders.scss';
import InstantTransfer from './InstantTransfer';
import BulkTransfer from './BulkTransfer';

function FundTransfer() {
    
    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: '1',
            label: 'Instant Transfer',
            children: (
                <>
                  <InstantTransfer/>
                </>
            ),
        },
        
        {
            key: '2',
            label: 'Bulk Transfer',
            children: (
                <>
                  <BulkTransfer/>
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

export default FundTransfer;
