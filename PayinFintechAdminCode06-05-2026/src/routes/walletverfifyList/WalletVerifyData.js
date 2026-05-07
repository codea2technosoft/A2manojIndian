import React, { useState, useEffect, useRef } from 'react';
import {Row, Col,Tabs } from 'antd';
import 'assets/styles/orders.scss';
import WalletPending from './WalletPending';
import WalletFailed from './WalletFailed';
import WalletSuccess from './WalletSuccess';

function WalletVerifyData() {

  const onChange = (key) => {
    console.log(key);
};

const items = [
    {
        key: '1',
        label: 'Pending',
        children: (
            <>
              <WalletPending/>
            </>
        ),
    },
    {
        key: '2',
        label: 'Failed',
        children: (
            <>
              <WalletFailed/>
            </>
        ),
    },
    {
        key: '3',
        label: 'Success',
        children: (
            <>
                <WalletSuccess/>
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

export default WalletVerifyData;
