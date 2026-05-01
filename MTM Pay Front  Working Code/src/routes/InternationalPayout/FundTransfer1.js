import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Tabs } from 'antd';
import 'assets/styles/orders.scss';
import InstantTransfer1 from './InstantTransfer1';
import BulkTransfer1 from './BulkTransfer1';

function FundTransfer1() {
    return <InstantTransfer1 />;
}

export default FundTransfer1;
