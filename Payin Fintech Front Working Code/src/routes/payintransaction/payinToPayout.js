import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Card, Modal, Form, Input, Table } from 'antd';
import api from 'utils/api';
import { useLocation } from 'react-router-dom';

function PayinToPayout() {
    const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
    const [isSettleLoading, setIsSettleLoading] = useState(false);
    const [settleForm] = Form.useForm();
    const [records, setRecords] = useState([]);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0); 
    const [status, setStatus] = useState('pending'); // status filter
    const [page, setPage] = useState(1); 
    const [perPage, setPerPage] = useState(10); 
    const [totalCount, setTotalCount] = useState(0); 

    const location = useLocation();

    useEffect(() => {
        fetchRecords();
        fetchAvailableAmount();
    }, [location, status, page, perPage]);

    // Fetch records with status & pagination
    const fetchRecords = async () => {
        try {
            setIsTableLoading(true);
            const response = await api.get('Amount-settlement-payin-to-payout-list', {
                params: { status, page, per_page: perPage },
            });
            setRecords(response.data.data || []);
            setTotalCount(response.data.total_records || 0);
        } catch (err) {
            console.error('Error fetching records:', err);
        } finally {
            setIsTableLoading(false);
        }
    };

    // Fetch available total_amt from API
  // Fetch available total_amt from API
const fetchAvailableAmount = async () => {
    try {
        const response = await api.get('Amount-settlement-payin-to-payout-list');
        // Access nested payin_amount_settlement correctly
        const amt = response.data?.PayinAviableAmount?.payin_amount_settlement || "0.00";
        setTotalAmount(Number(amt.replace(/,/g, '')));
    } catch (err) {
        console.error('Error fetching total amount:', err);
    }
};


    // Handle Settle Amount
    const handleSettleAmount = async () => {
        try {
            setIsSettleLoading(true);
            const values = await settleForm.validateFields();
            const { amount } = values;

            const response = await api.post('Amount-settlement-payin-to-payout', { amount });

            const resStatus = response.data.status?.toString().toLowerCase();
            if (resStatus === 'true' || resStatus === 'success' || resStatus === '1') {
                Modal.success({
                    title: '🎉 Payment Settled!',
                    content: `₹${amount} has been successfully transferred to payout.`,
                });
                setIsSettleModalOpen(false);
                settleForm.resetFields();
                fetchRecords();
                fetchAvailableAmount();
            } else {
                Modal.error({
                    title: '⚠️ Settlement Failed',
                    content: `Oops! Something went wrong. Please try again or contact support.`,
                });
            }
        } catch (err) {
            console.error(err);
            Modal.error({
                title: 'Settlement Failed',
                content: 'Please Enter Available Wallet Amount!',
            });
        } finally {
            setIsSettleLoading(false);
        }
    };

    // Table columns
    const columns = [
        {
            title: 'Created At',
            key: 'created_at',
            render: (_, record) => (
                <div>
                    <div>ID: {record.id}</div>
                    <div>{new Date(record.created_at).toLocaleDateString()}</div>
                    <div>{new Date(record.created_at).toLocaleTimeString()}</div>
                    {/* <div>UTR: {record.transaction?.data?.utr || '-'}</div> */}
                </div>
            ),
        },
        // {
        //     title: 'Transaction Details',
        //     key: 'transactionDetails',
        //     render: (_, record) => (
        //         <div>
        //             Order ID: {record.orderid}<br />
        //             Txn ID: {record.tid}
        //         </div>
        //     ),
        // },
        {
            title: 'Amount',
            key: 'amount',
            render: (_, record) => (
                <div>
                    Total: {record.amount} <br />
                    {/* Settled: {record.subtotal} <br />
                    Fees: {record.fees} <br />
                    GST: {record.gst} */}
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <span
                    style={{
                        color:
                            record.status === 'pending' ? 'orange' :
                            record.status === 'success' ? 'green' :
                            record.status === 'faild' ? 'red' : 'black'
                    }}
                >
                    {record.status === 'faild'
                        ? 'Failed'
                        : record.status.charAt(0).toUpperCase() + record.status.slice(1).toLowerCase()}
                </span>
            ),
        },
    ];

    return (
        <div className="wrap-orders">
            <Row gutter={[8, 8]} className="mb-16">
                <Col xs={24} md={6}>
                    <Card className="round_card">
                        <Button type="primary" size="large" onClick={() => setIsSettleModalOpen(true)}>
                            Settle Amount
                        </Button>
                    </Card>
                </Col>
            </Row>

            {/* Status filter buttons */}
           <div className='tabs_button' style={{ marginBottom: '16px' }}>
                {['pending', 'success', 'faild'].map((s) => (
                    <Button
                        key={s}
                        type={status === s ? 'active' : 'default'}
                        onClick={() => { setStatus(s); setPage(1); }}
                        style={{ marginRight: '8px' }}
                    >
                        {s === 'faild' ? 'Failed' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </Button>
                ))}
            </div>

            <Table
                columns={columns}
                dataSource={records}
                rowKey="id"
                loading={isTableLoading}
                className="mt-16"
                pagination={{
                    current: page,
                    pageSize: perPage,
                    total: totalCount,
                    onChange: (p, size) => { setPage(p); setPerPage(size); },
                }}
            />

            {/* Settle Amount Modal */}
            <Modal
                open={isSettleModalOpen}
                onCancel={() => setIsSettleModalOpen(false)}
                title="Settle Amount"
                footer={[
                    <Button key="cancel" onClick={() => setIsSettleModalOpen(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" loading={isSettleLoading} onClick={handleSettleAmount}>
                        Submit
                    </Button>,
                ]}
            >
               <p>Available Amount : ₹ {totalAmount.toLocaleString()}</p>
<Form form={settleForm} layout="vertical">
    <Form.Item
        name="amount"
        label="Enter Settlement Amount"
        rules={[
            { required: true, message: 'Please enter settlement amount' },
            {
                validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const numericValue = Number(value);
                    if (numericValue <= 0) return Promise.reject('Amount must be greater than 0');
                    if (numericValue > totalAmount) return Promise.reject(`Amount cannot exceed ₹${totalAmount.toLocaleString()}`);
                    return Promise.resolve();
                },
            },
        ]}
    >
        <Input
            placeholder="Please enter settlement amount"
            value={settleForm.getFieldValue('amount')}
            onChange={(e) => {
                let value = e.target.value;
                // Remove non-digit characters
                value = value.replace(/\D/g, '');
                // Remove leading zeros
                value = value.replace(/^0+/, '');
                // Don't allow input more than available totalAmount
                if (Number(value) > totalAmount) {
                    value = totalAmount.toString();
                }
                settleForm.setFieldsValue({ amount: value });
            }}
        />
    </Form.Item>
</Form>

            </Modal>
        </div>
    );
}

export default PayinToPayout;
