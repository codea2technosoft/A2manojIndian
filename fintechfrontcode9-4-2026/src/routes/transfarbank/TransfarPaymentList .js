import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Switch, Form, Input, Row, Col, Space, Select, DatePicker, message, Card } from 'antd';
import { useSelector } from 'react-redux';
import TableBar from 'components/TableBar';
import api from 'utils/api';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import dancingloader from '../../assets/images/dancingloader.gif';
const { RangePicker } = DatePicker;

const TransfarPaymentbankList = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [keyword, setKeyword] = useState('');
    //const [dates, setDates] = useState([dayjs(), dayjs()]);
    const [dates, setDates] = useState([dayjs(), dayjs()]);
    const [mode, setMode] = useState('today');
    const { Search } = Input;

    const location = useLocation();
    const navigate = useNavigate();

    const columns = [
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
            title: 'Action',
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => {
                let color = {
                    pending: '#ffa940',
                    success: 'green',
                    faild: 'red',
                    inprocess: '#ffa940',
                    reversed: 'blue',
                    6: 'blue',
                    7: 'red',
                    8: 'green',
                };
                const displayStatus = record.status === 'pending' ? 'INITIATE' : record.status.toUpperCase();
                return (
                    <div style={{ color: color[record.status] }}>
                        {displayStatus}
                        {record.status === 'pending' || record.status === 'inprocess' ? (
                            <div>
                                {
                                    /* <p id="cchkstttu" style={{ color: "black", fontWeight: "500", cursor: "pointer", textAlign: "center", backgroundColor: "#0dcaf0" }} onClick={() => shoot(record.id)} >Check Status</p>*/
                                    <a
                                        id={record.orderid}
                                        style={{
                                            border: '1px solid',
                                            padding: '3px',
                                            marginTop: '0px',
                                            borderRadius: '5px',
                                            width: '100%',
                                            display: 'block',
                                            textAlign: 'center',
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            shoot(record.orderid);
                                        }}
                                    >
                                        Check Status
                                    </a>
                                }
                                <img
                                    id="cchkstttu11"
                                    src={dancingloader}
                                    style={{
                                        height: '10px',
                                        width: '100%',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                        transform: 'scale(1.9)',
                                        display: 'none',
                                    }}
                                />
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div>
                );
            },
        },
    ];

    const shoot = (a) => {
        const button = document.getElementById(a);
        button.setAttribute('disabled', '');

        const loader = document.getElementById('loader');
        api.post('/webhook/payment/payout/ChkOrderStatus', {
            orderid: a,
        })
            .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    window.location.reload();
                }
            })
            .catch((err) => {});
    };

    const fetchBankList = async (dates, keyword, page, perPage) => {
        setIsTableLoading(true);

        const start = dates && dates[0] ? dates[0].format('YYYY-MM-DD') : null;
        const end = dates && dates[1] ? dates[1].format('YYYY-MM-DD') : null;

        try {
            const response = await api.get('/Payout-payin-bank-transaction-list', {
                params: {
                    page,
                    per_page: perPage,
                    start: start,
                    end: end,
                    keyword,
                },
            });
            console.warn(response);
            const data = response.data;
            const filteredRecords = keyword
                ? data.data.filter((record) => record.tid.toLowerCase().includes(keyword.toLowerCase()))
                : data.data;
            setRecords(filteredRecords);
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

    const handleDateChange = (date, dateString) => {
        setDates(date);
    };

    const handleSearch = (value) => {
        setKeyword(value);
    };

    useEffect(() => {
        fetchBankList(dates, keyword, page, perPage);
    }, [page, perPage, dates, keyword]);

    const onChangeTable = (pagination) => {
        setPage(pagination.current);
        setPerPage(pagination.pageSize);
    };

    return (
        <div className="transferpayment bank">
            <Card className="mb-16 topbox-shadow">
                <Row gutter={[16, 16]} justify={'space-between'} style={{ alignItems: 'baseline' }}>
                    <Col xs={24} sm={24} md={12} lg={10} xl={8} span={4}>
                        <RangePicker
                            value={dates}
                            onChange={handleDateChange}
                            style={{ height: '50px', width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={10} xl={8}>
                        <TableBar
                            justify={'end'}
                            showFilter={false}
                            onSearch={handleSearch}
                            className="mb-0"
                            style={{ textAlign: 'right' }}
                        />
                    </Col>
                </Row>
            </Card>

            <Table
                className="mb-16"
                loading={isTableLoading}
                dataSource={records}
                columns={columns}
                onChange={onChangeTable}
                rowKey={'id'}
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
export default TransfarPaymentbankList;
