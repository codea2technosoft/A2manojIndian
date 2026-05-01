import React, { useState, useEffect, useRef } from 'react';
import {Row, Col,Tabs } from 'antd';
import 'assets/styles/orders.scss';
import AllTransactionList from 'routes/alltransaction/AllTransactionList';
import PendingTransactionList from 'routes/pendingtransaction/PendingTransactionList';
import ChargebackList from 'routes/chargeback/ChargebackList';

function OrderList() {
    
    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: '1',
            label: 'All Transactions',
            children: (
                <>
                  <AllTransactionList/>
                </>
            ),
        },
        {
            key: '2',
            label: 'Pending Transaction',
            children: (
                <>
                  <PendingTransactionList/>
                </>
            ),
        },
        {
            key: '3',
            label: 'Chargebacks',
            children: (
                <>
                    <ChargebackList/>
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

export default OrderList;
