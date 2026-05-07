import React, { useState, useEffect, useRef } from 'react';
import {Row, Col,Tabs } from 'antd';
import 'assets/styles/orders.scss';
import ManualSettlementsPending from './ManualSettlementsPending';
import ManualSettlementsPayout from './ManualSettlementsPayout';
import ManualSettlementsPayin  from './ManualSettlementsPayin';

function ManualSettlementsData() {

  const onChange = (key) => {
    console.log(key);
};

const items = [
    // {
    //     key: '1',
    //     label: 'Pending',
    //     children: (
    //         <>
    //           <WalletPending/>
    //         </>
    //     ),
    // },
    {
        key: '2',
        label: 'Payin',
        children: (
            <>
              <ManualSettlementsPayin />
            </>
        ),
    },
    {
        key: '3',
        label: 'Payout',
        children: (
            <>
                <ManualSettlementsPayout/>
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

export default ManualSettlementsData;
