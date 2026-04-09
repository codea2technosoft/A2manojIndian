import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Switch, Form, Input, Row, Col, Select, InputNumber, message } from 'antd';
import TableBar from 'components/TableBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import api from 'utils/api';
const { Option } = Select;

const BankListView = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [records1, setRecords1] = useState([]);
    const location = useLocation();
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();
    const [bankList, setBankList] = useState([]);
    const columns1 = [
        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text, record) => {
                const date = new Date(text);
                const formattedDate = date.toLocaleDateString();
                const formattedTime = date.toLocaleTimeString();

                return (
                    <div>
                        <div>Payout</div>
                        {record.id ? <div>SN: {record.id}</div> : null}
                        <div>
                            <div>{formattedDate}</div>
                            <div>{formattedTime}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Transaction Details',
            key: 'bank_name',
            dataIndex: 'bank_name',
            render: (text, record) => {
                return (
                    <div>
                        {record.bankname ? <div>Bank: {record.bankname}</div> : null}
                        {record.accountnumber ? <div>Account: {record.accountnumber}</div> : null}
                        {record.Ifsc ? <div>IFSC: {record.Ifsc}</div> : null}
                        {record.mode ? <div>Mode: {record.mode}</div> : null}
                    </div>
                );
            },
        },
        {
            title: 'Refrence Details',
            key: 'accountnumber',
            dataIndex: 'accountnumber',
            render: (text, record) => {
                return (
                    <div>
                        <div>Order ID : {record.orderid}</div>

                        {record.rrn_trx_id ? <div>Refrence: {record.rrn_trx_id}</div> : null}
                        {record.tid ? <div>Txn Id: {record.tid}</div> : null}
                    </div>
                );
            },
        },

        {
            title: 'Amount',
            key: 'Amount',
            dataIndex: 'Amount',
            render: (text, record) => {
                return (
                    <div>
                        {record.amount ? <div>Totel: {record.amount}</div> : null}
                        {record.subtotal ? <div>Settled Amt: {record.subtotal}</div> : null}
                        {record.fees ? <div>Fees Amt: {record.fees}</div> : null}
                        {record.gst ? <div>GST Amt: {record.gst}</div> : null}
                    </div>
                );
            },
        },

        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text) => {
                let color = '';
                if (text === 'success') {
                    color = 'green';
                } else if (text === 'faild') {
                    color = 'red';
                }
                return <span style={{ color }}>{text}</span>;
            },
        },
    ];

    const fetchBankList = async (keyword, page, perPage) => {
        setIsTableLoading(true);

        try {
            const response = await api.get('/Payout-settlement-transaction-list', {
                params: {
                    page,
                    per_page: perPage,
                    keyword,
                },
            });
            console.warn(response);
            const data = response.data;
            const filteredRecords = keyword
                ? data.data.filter((record) => record.tid.toLowerCase().includes(keyword.toLowerCase()))
                : data.data;
            setRecords1(filteredRecords);
            setTotalCount(filteredRecords.length);
            setTotalCount(response.data.total_records);

            if (Array.isArray(data.data)) {
                setBankList(data.data);
            } else {
                console.error('Invalid bank list format:', data.bankList);
            }
        } catch (error) {
            console.error('Error fetching bank list:', error);
        }
        setIsTableLoading(false);
    };

    const handleSearch = (value) => {
        setKeyword(value);
    };

    useEffect(() => {
        fetchBankList(keyword, page, perPage);
    }, [page, perPage, keyword]);

    const onChangeTable = (pagination) => {
        setPage(pagination.current);
        setPerPage(pagination.pageSize);
    };

    return (
        <div className="settlement">
            <Row
                style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline' }}
                className="mb-16"
            >
                <Col xs={24} sm={24} md={16} lg={15} xl={18}>
                    <h2 className="mt-16" style={{ fontWeight: 700 }}>
                        Transfer to Bank Transaction History
                    </h2>
                </Col>
                <Col xs={24} sm={24} md={8} lg={9} xl={6}>
                    <TableBar placeholderInput="Transaction ID" onSearch={handleSearch} showFilter={false} />
                </Col>
            </Row>
            <Table
                className="mt-8"
                loading={isTableLoading}
                dataSource={records1}
                columns={columns1}
                onChange={onChangeTable}
                rowKey="id"
                pagination={{
                    pageSize: perPage,
                    total: totalCount,
                    current: page,
                }}
                scroll={{
                    x: true,
                }}
            />
        </div>
    );
};
export default BankListView;
