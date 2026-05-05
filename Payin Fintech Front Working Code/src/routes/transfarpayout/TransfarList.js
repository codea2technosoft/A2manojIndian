import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Switch, Input, message, DatePicker, Modal, Row, Col, Space } from 'antd';
import dayjs from 'dayjs';
import TableBar from 'components/TableBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import api from 'utils/api';
import PageTitle from 'components/PageTitle';
import { CiWallet } from 'react-icons/ci';

const { RangePicker } = DatePicker;
const titles = [{ path: '/transfarpayout', title: 'Transfer to Payout' }];

const TransfarList = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [transaction_to_payout, settransaction_to_payout] = useState();
    const [per_page, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [totalAmount, setTotelAmt] = useState(0);
    const [records, setRecords] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [transferAmount, setTransferAmount] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [created_at_date_min, setcreated_at_date_min] = useState('');
    const [created_at_date_max, setcreated_at_date_max] = useState('');
    const [keyword, setkeyword] = useState('');
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
    const [dates, setDates] = useState([dayjs(), dayjs()]);
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
                        <div>{formattedDate}</div>
                        <div>{formattedTime}</div>
                    </div>
                );
            },
        },
        {
            title: 'Order ID',
            key: 'orderid',
            dataIndex: 'orderid',
            render: (text, record) => (
                <div>
                    <div>{record.order_number}</div>
                    <div style={{ color: '#6C5DD3' }}>{record.orderid}</div>
                    <div style={{ color: '#6C5DD3' }}>{record.tid}</div>
                </div>
            ),
        },
        {
            title: 'Refrence Details',
            key: 'type',
            dataIndex: 'type',
        },
        {
            title: 'Amount',
            key: 'amount',
            dataIndex: 'amount',
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

    const handleTransfer = async () => {
        if (isLoading || isButtonDisabled) {
            return;
        }

        if (!/^[+]?\d+(\.\d+)?$/.test(transferAmount) || parseFloat(transferAmount) <= 0) {
            message.success({
                content: 'Invalid Transfer Amount ',
                duration: 2,
                className: 'custom-success-message succesful',
            });
            return;
        }
        setIsLoading(true);
        setIsButtonDisabled(true);

        try {
            setIsLoading(true);
            const response = await api.post('/Payment-transfer-payin-payout', {
                amount: transferAmount,
                type: 'account',
            });

            message.success({
                content: 'Transfer successful!',
                duration: 2,
                className: 'custom-success-message succesful',
            });
            setIsTableLoading(true);
            setIsButtonVisible(false);
            fetchManagerList(searchKeyword);
            setTimeout(() => {
                window.location.reload();
            }, 200);
        } catch (error) {
            setIsTableLoading(false);
            console.error('Error transferring:', error);
        }
    };

    const fetchManagerList = async (page, dateRange, keyword) => {
        let start, end;
        if (Array.isArray(dateRange) && dateRange.length === 2) {
            start = dateRange[0].toISOString().slice(0, 10);
            end = dateRange[1].toISOString().slice(0, 10);
        } else {
            start = new Date().toISOString().slice(0, 10);
            end = start;
        }
        setIsTableLoading(true);

        try {
            const response = await api.get('/Amount-settlement-payin-to-payout-list', {
                params: {
                    page: 1,
                    per_page: per_page,
                    created_at_date_min: start,
                    created_at_date_max: end,
                    keyword: keyword,
                },
            });
            const data = response.data.data;
            const filteredRecords = keyword
                ? data.filter((record) => record.tid.toLowerCase().includes(keyword.toLowerCase()))
                : data;
            const totalAmount = response.data.transaction_to_payout;
            setTotelAmt(totalAmount);
            setRecords(filteredRecords);
            console.warn(response.data.total_records);
            setTotalCount(response.data.total_records);
        } catch (error) {
            console.error('Error fetching TransfarList:', error);
        }
        setIsTableLoading(false);
    };

    const onSearch = (keyword) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: 1,
        };
        fetchManagerList(query.page, query.dateRange, keyword);
    };

    const onChangeDates = (dates) => {
        if (!dates || dates.length === 0) {
            setDateRange('');
        } else {
            setDateRange(dates);
        }
        setPage(1);
        fetchManagerList(1, dates);
    };

    useEffect(() => {
        fetchManagerList(page, dateRange);
    }, []);

    const onChangeTable = (newPage, pageSize) => {
        setPage(newPage);
        setPerPage(pageSize);
        fetchManagerList(newPage, dateRange);
    };

    return (
        <div className="transfer_payout">
            

            <Row gutter={[16, 8]} justify={'space-between'} align={'middle'}>
                <Col xs={24} sm={24} md={24} lg={11} xl={8}>
                    <Card className="round_card">
                        <Row gutter={[16, 8]} align={'middle'}>
                            <Col xs={24} sm={24} md={24} lg={17} xl={16}>
                                <Input
                                    placeholder="Amount"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                    type="number"
                                />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={7} xl={8}>
                                <Button
                                    type="primary"
                                    onClick={handleTransfer}
                                    loading={isLoading}
                                    disabled={isButtonDisabled}
                                    style={{
                                        display: isButtonVisible ? 'block' : 'none',
                                    }}
                                >
                                    Transfer
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={24} lg={10} xl={8}>
                    <Card className="round_card">
                        <RangePicker value={dates} onCalendarChange={(newDates) => onChangeDates(newDates)} style={{height:'45px'}}/>
                    </Card>
                </Col>
                {/* <Button type="primary" size='large' onClick={onExport}>Export</Button> */}
            </Row>
            {/* </Card> */}

            <Table
                loading={isTableLoading}
                dataSource={records}
                columns={columns}
                rowKey="id"
                pagination={{
                    current: page,
                    pageSize: per_page,
                    total: totalCount,
                    onChange: onChangeTable,
                }}
                scroll={{
                    x: true,
                }}
            />
        </div>
    );
};
export default TransfarList;
