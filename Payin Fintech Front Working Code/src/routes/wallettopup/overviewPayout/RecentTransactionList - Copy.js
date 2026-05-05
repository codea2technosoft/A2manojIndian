import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Card, Col, Row, Statistic } from 'antd';
import _ from 'lodash';
import dayjs from 'dayjs';
import OrderPaymentStatusDropdown from 'components/OrderPaymentStatusDropdown';
// request
import { getRecentTransactions } from 'requests/transaction';

const RecentTransactionList = () => {
    const [records, setRecords] = useState([]);

    const columns = [
        {
            title: 'Amount',
            key: 'total',
            dataIndex: 'total',
        },
        {
            title: 'Transaction ID',
            key: 'tx_id',
            dataIndex: 'tx_id',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text) => (
                <OrderPaymentStatusDropdown 
                    orderID={null}
                    defaultValue={text} 
                    readonly
                />
            )
        },
        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text) => (
                <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>
            )
        },
    ]

    useEffect(() => {
        const getData = async () => {
            const response = await getRecentTransactions();
            setRecords(response.records);
        }

        getData();
    }, []);

    return (
        <Card
            title='Recent Transactions'
        >
            <Table 
                dataSource={records}
                columns={columns}
                pagination={false}
                scroll={{
                    x: 'max-content'
                }}
            />
        </Card>
    )
}

export default RecentTransactionList;