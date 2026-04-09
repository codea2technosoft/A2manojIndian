import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Switch, Input, message, DatePicker, Modal, Row, Col, Space } from 'antd';
import dayjs from 'dayjs';
import TableBar from 'components/TableBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import api from 'utils/api';
import PageTitle from 'components/PageTitle';
import { WalletOutlined } from '@ant-design/icons';

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
            )
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

    const fetchManagerList = async (keyword, created_at_date_min, created_at_date_max, page, per_page) => {
        setIsTableLoading(true);
        try {
            if (!created_at_date_min) {
                const today = new Date().toISOString().split('T')[0];
                created_at_date_min = today;
            }

            if (!created_at_date_max) {
                const today = new Date().toISOString().split('T')[0];
                created_at_date_max = today;
            }
            


            const response = await api.get('/Amount-settlement-payin-to-payout-list', {
                params: {
                  page,
                  per_page: per_page,
                  created_at_date_min:created_at_date_min,
                  created_at_date_max:created_at_date_max,
                  keyword,
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
            keyword: keyword,
        };
    
        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    
        fetchManagerList(keyword);
    };

    const onChangeDates = (dates) => {
        setDates(dates);
        const urlParams = new URLSearchParams(window.location.search);
        let keyword = urlParams.get('keyword');
        let query = parseQueryParams(location);
    
        if (dates != undefined) {
            if (dates[0] && dates[1]) {
                query = {
                    ...query,
                    created_at_date_min: dayjs(dates[0]).format('YYYY-MM-DD'),
                    created_at_date_max: dayjs(dates[1]).format('YYYY-MM-DD'),
                    page: 1,
                    perPage: 10,
                };
    
                fetchManagerList(
                    keyword,
                    dayjs(dates[0]).format('YYYY-MM-DD'),
                    dayjs(dates[1]).format('YYYY-MM-DD'),
                    query.page,
                    query.perPage
                );
            } else {
                delete query.created_at_date_min;
                delete query.created_at_date_max;
                delete query.page;
                delete query.perPage;
                
                const today = dayjs().format('YYYY-MM-DD');
                query.created_at_date_min = today;
                query.created_at_date_max = today;
            }
        } else {
            delete query.created_at_date_min;
            delete query.created_at_date_max;
            delete query.page;
            delete query.perPage;
        }
    
        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };
    

    const onChangeTable = (pagination, sorter) => {
        const { current, pageSize } = pagination;
        const newPage = current;
        const newPerPage = pageSize;
    
        const query = {
            page: newPage,
            per_page: newPerPage,
            created_at_date_min: dayjs(dates[0]).format('YYYY-MM-DD'),
            created_at_date_max: dayjs(dates[1]).format('YYYY-MM-DD'),
        };
    
    
        if (sorter.order) {
            query.order_by = sorter.field;
            query.order_type = sorter.order === 'ascend' ? 'asc' : 'desc';
        } else {
            delete query.order_by;
            delete query.order_type;
        }
    
        setPage(newPage);
        setPerPage(newPerPage);
    
        
        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    
        fetchManagerList(
            dayjs(dates[0]).format('YYYY-MM-DD'),
            dayjs(dates[1]).format('YYYY-MM-DD'),
            newPage,
            newPerPage
        );
    };
    

    // const onChangeTable = (newPage, pageSize) => {
    //     setPage(newPage);
    //     setPerPage(per_page);
    //     fetchManagerList(newPage);
        
    //   };





    useEffect(() => {
        fetchManagerList(searchKeyword, created_at_date_min, created_at_date_max, page, per_page);
    }, []);




    return (
        <div className="transfer_payout">
            <Card className="mb-16 topbox-shadow">
                <Row gutter={[16, 16]} justify={'space-between'}>
                    <Col xs={24} sm={24} md={24} lg={12}>
                        <PageTitle titles={titles} />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} span={4}>
                        <TableBar showFilter={false} onSearch={onSearch} className="mb-0" />
                    </Col>
                </Row>

                <Row gutter={[16, 16]} justify={'space-between'} style={{ alignItems: 'baseline' }}>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <Row style={{ alignItems: 'baseline' }}>
                            <Col xs={24} sm={24} md={24} lg={16}>
                                <Input
                                    className="mb-8"
                                    placeholder="Amount"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                    type="number"
                                />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={8}>
                                <Button
                                    type="primary"
                                    className="mb-8 ml-8"
                                    onClick={handleTransfer}
                                    loading={isLoading}
                                    disabled={isButtonDisabled}
                                    style={{
                                        height: '48px',
                                        display: isButtonVisible ? 'block' : 'none',
                                    }}
                                >
                                    Transfer
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <div className="statistic-card--purple d-flex red-border totaltransfer">
                            <h4>Total Transfer Payout</h4>
                            <Space
                                className="walletdesign"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <WalletOutlined className="titlewallet" />
                                <span className="ml-8">{totalAmount}</span>
                            </Space>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8}>
                        <RangePicker value={dates} onCalendarChange={(newDates) => onChangeDates(newDates)}
                            style={{ height: '50px', width: '100%' }}
                        />
                    </Col>
                    {/* <Button type="primary" size='large' onClick={onExport}>Export</Button> */}
                </Row>
            </Card>
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
