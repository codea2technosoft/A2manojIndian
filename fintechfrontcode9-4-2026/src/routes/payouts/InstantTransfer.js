import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import api from 'utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Col, DatePicker, Card, Tabs, Table, Tag, message, Modal, Select, Form, Input } from 'antd';
import walletIcon from 'assets/images/Wallet 1.png';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { toast } from 'react-toast';
import { omitBy, isEmpty, debounce } from 'lodash';
import 'assets/styles/orders.scss';
// request
import { getBanklist, payinPayoutList, exportOrders } from 'requests/order';

const { RangePicker } = DatePicker;
const titles = [{ title: 'Fund Transfer' }];

function InstantTransfer() {
    const [dates, setDates] = useState([dayjs(), dayjs()]);
    const location = useLocation();
    const navigate = useNavigate();
    const [isTransferAmountVisible, setIsTransferAmountVisible] = useState(false);
    const hideTransferAmountPopup = () => {
        setIsTransferAmountVisible(false);
    };

    const searchRef = useRef(null);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [AvailableAmount, setAvailableAmount] = useState(0);
    const [records, setRecords] = useState([]);
    const [RecordsSuccessBankList, setRecordsSuccessBankList] = useState([]);
    const [isShowFilter, setIsShowFilter] = useState(false);
    const [orderOverview, setOrderOverview] = useState({
        total_records: 0,
        unpaid_records: 0,
        paid_records: 0,
        fulfillment_processing_records: 0,
    });
    const [view, setView] = useState('list');
    const [filter, setFilter] = useState(null);
    const config = useSelector((state) => state.config);

    useEffect(() => {
        const query = parseQueryParams(location);
        setFilter(query);
        getRecords();
        getBanklists(query);
    }, [location]);

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await payinPayoutList(query);
            setAvailableAmount(response.AvailableAmount);
            setRecords(response.data);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    };

    const getBanklists = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getBanklist(query);
            setRecordsSuccessBankList(response.bank_detail_success);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    };

    const onRefresh = () => {
        setView('list');
        setTimeout(() => {
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({}),
            });
            if (searchRef.current?.input.value) {
                searchRef.current.handleReset();
            }
        }, 1000);
    };

    const onSetDatesByDatePicker = (newDates) => {
        if (!newDates || newDates.length !== 2) {
            console.error('Invalid newDates:', newDates);
            return;
        }

        setDates(newDates);
        const created_at_date_min = newDates[0]?.toISOString().split('T')[0];
        const created_at_date_max = newDates[1]?.toISOString().split('T')[0];

        getRecords({ created_at_date_min, created_at_date_max });
    };

    const onExport = async () => {
        try {
            let query = parseQueryParams(location);
            // console.log(query);
            setIsTableLoading(true);
            const response = await exportOrders(query);

            if (response && response.filepath) {
                window.open(`https://api.payinfintech.com/files/${response.filepath}`, '_blank');
            } else {
                throw new Error('Invalid response data');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsTableLoading(false);
        }
    };

    // const onChangeTable = (pagination, filters, sorter, extra) => {
    //     let query = parseQueryParams(location);
    //     query = {
    //         ...query,
    //         page: pagination.current,
    //         per_page: pagination.pageSize,
    //     };

    //     if (sorter.order) {
    //         query = {
    //             ...query,
    //             order_by: sorter.field,
    //             order_type: sorter.order === 'ascend' ? 'asc' : 'desc',
    //         };
    //     } else {
    //         delete query.order_by;
    //         delete query.order_type;
    //     }

    //     navigate({
    //         pathname: location.pathname,
    //         search: stringifyQueryParams(query),
    //     });
    // };

    const onChangeTable = (pagination, filters, sorter, extra) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: pagination.current,
            per_page: pagination.pageSize,
        };

        if (sorter.order) {
            query = {
                ...query,
                order_by: sorter.field,
                order_type: sorter.order === 'ascend' ? 'asc' : 'desc',
            };
        } else {
            delete query.order_by;
            delete query.order_type;
        }
        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
        getRecords(query);
    };

    const onSaveFilter = () => {
        const saveFilterData = omitBy(filter, isEmpty);
        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(saveFilterData),
        });
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
    };

    const onToggleFilter = () => {
        setIsShowFilter(!isShowFilter);
    };

    const onChangeFilter = (name, e, isMuilty = false) => {
        if (isMuilty) {
            setFilter((preState) => ({ ...preState, [name]: e.join(',') }));
        } else {
            setFilter((preState) => ({ ...preState, [name]: e }));
        }
    };

    const onChangeView = (value) => {
        setView(value);
    };

    const onChangePaymentStatus = (value) => {
        let query = parseQueryParams(location);

        if (value) {
            query = {
                ...query,
                payment_status: value,
            };
        } else {
            delete query.payment_status;
        }

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const onChangeDates = (dates) => {
        let query = parseQueryParams(location);

        if (dates[0] && dates[1]) {
            query = {
                ...query,
                created_at_date_min: dayjs(dates[0]).format('YYYY-MM-DD'),
                created_at_date_max: dayjs(dates[1]).format('YYYY-MM-DD'),
            };
        } else {
            delete query.created_at_date_min;
            delete query.created_at_date_max;
        }

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const onChange = (key) => {
        console.log(key);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    const [isTransferLoading, setIsTransferLoading] = useState(false);
    const [form] = Form.useForm();

    const handleTransfer = async () => {
        try {
            setIsTransferLoading(true);
            // Validate the form fields
            const values = await form.validateFields();
            const { amount, bank_id, mode } = values;
            const response = await api.post('/Payment-transfer-payout-bank', {
                amount,
                bank_id,
                mode,
            });
            console.warn(response);
            if (response.data.status == true) {
                Modal.success({
                    title: 'Payment Transfer ',
                    content: `${response.data.message}`,
                });
                setIsModalOpen(false);
                setTimeout(() => {
                    Modal.destroyAll();
                    window.location.reload();
                }, 2000);
            } else {
                Modal.error({
                    title: 'Payment Transfer Error',
                    content: `${response.data.message}`,
                });
                setIsModalOpen(false);
                setTimeout(() => {
                    Modal.destroyAll();
                    window.location.reload();
                }, 2000);
            }
        } catch (errorInfo) {
            console.log('Error in handleTransfer:', errorInfo);
            // setIsModalOpen(false);
            //     setTimeout(() => {
            //       Modal.destroyAll();
            //       window.location.reload();
            // }, 2000);
        } finally {
            setIsTransferLoading(false);
        }
    };

    const props = {
        name: 'file',
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

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

    const columns = [
        {
            title: 'Payment ID / Date',
            key: 'paymentid',
            render: (text, record, index) => (
                <div>
                    <div>
                        {index + 1}
                        <br />
                    </div>
                    <div>{new Date(record.created_at).toLocaleDateString()}</div>
                    <div>{new Date(record.created_at).toLocaleTimeString()}</div>
                    <div>{record.transaction ? record.transaction.data.utr : null}</div>
                </div>
            ),
        },
        {
            title: 'Bank Details',
            key: 'bankDetails',
            render: (text, record) => (
                <div>
                     Benifical Name : {record.benificalname}
                    <br></br>

                    Account : {record.accountnumber}
                    <br></br>
                    Bank : {record.bankname}
                    <br></br>
                    IFSC : {record.Ifsc}
                    <br></br>
                    Mode : {record.mode}
                </div>
            ),
        },
        {
            title: 'Transaction Details',
            key: 'transactionDetails',
            render: (text, record) => (
                <div>
                    Order ID: {record.orderid}
                    <br></br>Txn ID: {record.tid}
                    <br></br>UTR Number: {record.utr ? record.utr : 'null'}
                </div>
            ),
        },
        {
            title: 'Amount',
            key: 'amount',
            render: (text, record) => (
                <div>
                    Total: {record.amount}
                    <br></br>
                    Settled Amt: {record.subtotal}
                    <br></br>
                    Fees Amt: {record.fees}
                    <br></br>
                    GST Amt: {record.gst}
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'Status',
            render: (text, record) => (
                <div style={{ color: color[record.status] }}>
                    {record.status === 'pending' ? 'initiated' : record.status.toUpperCase()}
                    {record.status === 'pending' || record.status === 'inprocess' ? (
                        <div>
                            <p
                                id={`cchkstttu_${record.orderid}`}
                                onClick={() => chhkstatus(record.orderid)}
                                style={{
                                    padding: '5px 10px',
                                    cursor: 'pointer',
                                    backgroundColor: '#0dcaf0',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                }}
                            >
                                Check Status
                            </p>
                            <img
                                id={`cchkstttu11_${record.orderid}`}
                                // src={dancingloader}
                                style={{
                                    display: 'none',
                                    height: '10px',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                    WebkitTransform: 'scale(1.9)',
                                    transform: 'scale(1.9)',
                                    width: '100%',
                                }}
                            />
                        </div>
                    ) : (
                        <p></p>
                    )}
                </div>
            ),
        },
    ];

    const chhkstatus = async (orderId) => {
        const statusElement = document.getElementById(`cchkstttu_${orderId}`);
        const loaderElement = document.getElementById(`cchkstttu11_${orderId}`);
        if (statusElement && loaderElement) {
            statusElement.style.display = 'none';
            loaderElement.style.display = 'block';

            try {
                const response = await api.post(process.env.REACT_APP_API_URL + 'webhook/payout/checkstatus', {
                    orderid: orderId,
                });
                statusElement.style.display = 'block';
                loaderElement.style.display = 'none';
                getRecords();
            } catch (error) {
                console.error('Error fetching data:', error);
                statusElement.style.display = 'block';
                loaderElement.style.display = 'none';
            }
        }
    };

    return (
        <div className="wrap-orders">
            <Row gutter={[8, 8]} align="middle" justify={{ md: 'center', lg: 'space-between' }}>
                <Col xs={24} md={14} lg={8} xl={6}>
                    <Card className="round_card">
                        <div className="walletamount">
                            <img src={walletIcon} className="walletimg mr-8" />
                            <p>
                                Available Amount
                                <br />
                                <b> Rs. {AvailableAmount}</b>
                            </p>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={15} lg={8} xl={7}>
                    <Card className="round_card">
                        <RangePicker
                            value={dates}
                            onCalendarChange={(newDates) => onSetDatesByDatePicker(newDates)}
                            style={{ height: '45px' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} md={9} lg={6} xl={5}>
                    <Card className="round_card">
                        <Button type="primary" size="large" onClick={showModal}>
                            Instant Transfer
                        </Button>
                    </Card>
                </Col>
            </Row>
            {/* </Card> */}
            <Table
                rowKey="id"
                columns={columns}
                dataSource={records}
                className="mt-16"
                pagination={{
                    pageSize: perPage,
                    total: totalCount,
                    current: page,
                    onChange: (page, pageSize) => onChangeTable({ current: page, pageSize: pageSize }, {}, {}, {}),
                }}
                onChange={onChangeTable}
                scroll={{
                    x: true,
                }}
            />
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                title="Transfer Amount"
                visible={isTransferAmountVisible}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                        {' '}
                        Close{' '}
                    </Button>,
                    <Button key="transfer" type="primary" onClick={handleTransfer} disabled={isTransferLoading}>
                        Transfer
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="bank_id"
                        label="Bank Account"
                        rules={[{ required: true, message: 'Please select a bank account' }]}
                    >
                        {/* <Select placeholder="Please Select Bank">
                            {RecordsSuccessBankList.map((bank) => (
                                <Select.Option key={bank.id} value={bank.id}>
                                    {bank.name}({bank.bank_name}/{bank.account_number})
                                </Select.Option>
                            ))}
                                
                        </Select> */}

                        <Select
                            mode="single"
                            placeholder="Please Select Bank"
                            showSearch
                            filterOption={(input, option) => {
                                const label = option?.label || option?.children;
                                return (label?.toString()?.toLowerCase() || '').includes(input?.toLowerCase() || '');
                            }}
                        >
                            {RecordsSuccessBankList.map((bank) => (
                                <Select.Option
                                    key={bank.id}
                                    value={bank.id}
                                    label={`${bank.name}(${bank.bank_name}/${bank.account_number})`}
                                >
                                    {bank.name}({bank.bank_name}/{bank.account_number})
                                </Select.Option>
                            ))}
                        </Select>

                    </Form.Item>

                    <Form.Item
                        name="mode"
                        label="Payment Mode"
                        rules={[{ required: true, message: 'Please select a payment mode' }]}
                    >
                        <Select placeholder="Please Select Payment Mode">
                            <Select.Option value="">Please Select Payment Mode</Select.Option>
                            <Select.Option value="NEFT">NEFT</Select.Option>
                            <Select.Option value="IMPS">IMPS</Select.Option>
                            {/* <Select.Option value="RTGS">RTGS</Select.Option> */}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[{ required: true, message: 'Please enter the amount' }]}
                    >
                        <Input placeholder="Enter your Amount" type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default InstantTransfer;
