import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Space, Row, Divider, DatePicker, Modal, Card, Col } from 'antd';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { toast } from 'react-toast';
import { omitBy, isEmpty, debounce } from 'lodash';
import { Table } from 'antd';

// styles
import 'assets/styles/orders.scss';
// request
import { getOrders, getPayinSuccessreport, exportOrders } from 'requests/order';

const { RangePicker } = DatePicker;

const titles = [{ title: 'All Transaction' }];

function PayinSuccessTransaction() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [isShowFilter, setIsShowFilter] = useState(false);
    const [orderOverview, setOrderOverview] = useState({
        total_records: 0,
        unpaid_records: 0,
        paid_records: 0,
        fulfillment_processing_records: 0,
    });
    const [view, setView] = useState('list');
    const [filter, setFilter] = useState(null);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [dates, setDates] = useState([dayjs(), dayjs()]);
    const [imageURL, setImageURL] = useState([]);
    const config = useSelector((state) => state.config);

    useEffect(() => {
        const query = parseQueryParams(location);
        if (query.created_at_date_min && query.created_at_date_max) {
            getRecords(query);
        } else {
            const today = dayjs();
            const defaultDateMin = today.startOf('day');
            const defaultDateMax = today.endOf('day');
            query.created_at_date_min = defaultDateMin.format('YYYY-MM-DD');
            query.created_at_date_max = defaultDateMax.format('YYYY-MM-DD');
            setFilter(query);
            getRecords(query);
        }
    }, [location]);

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getPayinSuccessreport(query);
            setImageURL(response.url);
            setOrderOverview({
                total_records: response.total_records,
                unpaid_records: response.unpaid_records,
                paid_records: response.paid_records,
                fulfillment_processing_records: response.fulfillment_processing_records,
            });
            console.warn(response.data);
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

    const onExport = async () => {
        try {
            let query = parseQueryParams(location);
            setIsTableLoading(true);
            if (query.created_at_date_min && query.created_at_date_max) {
                const response = await exportOrders(query);
                if (response && response.filepath) {
                    window.open(`https://api.payinfintech.com/files/${response.filepath}`, '_blank');
                } else {
                    throw new Error('Invalid response data');
                }
            } else {
                const today = dayjs();
                const defaultDateMin = today.startOf('day');
                const defaultDateMax = today.endOf('day');
                query.created_at_date_min = defaultDateMin.format('YYYY-MM-DD');
                query.created_at_date_max = defaultDateMax.format('YYYY-MM-DD');
                const response = await exportOrders(query);
                if (response && response.filepath) {
                    window.open(`https://api.payinfintech.com/files/${response.filepath}`, '_blank');
                } else {
                    throw new Error('Invalid response data');
                }
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsTableLoading(false);
        }
    };

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
    const refundAmount = async (orderId) => {
        const statusElement = document.getElementById(`cchkstttu_${orderId}`);
        const loaderElement = document.getElementById(`cchkstttu11_${orderId}`);

        if (statusElement && loaderElement) {
            statusElement.style.display = 'none';
            loaderElement.style.display = 'block';
            try {
                const response = await fetch('https://api.payinfintech.com/webhook/payment/phonePay-refund', {
                    method: 'POST', // Specify POST method
                    headers: {
                        'Content-Type': 'application/json', // Set content type for JSON
                    },
                    body: JSON.stringify({
                        orderId: orderId, // Include your payload here
                        // Add other properties if needed
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Response data:', data);

                statusElement.style.display = 'block';
                loaderElement.style.display = 'none';
                getRecords();
            } catch (error) {
                console.error('Error fetching data:', error);
                statusElement.style.display = 'block';
                loaderElement.style.display = 'none';
            }

            // try {
            //     const response = await fetch(`https://api.payinfintech.com/webhook/payment/phonePay-refund/${orderId}`);

            //     if (!response.ok) {
            //         throw new Error(`HTTP error! status: ${response.status}`);
            //     }

            //     const data = await response.json();
            //     console.log('Response data:', data);

            //     statusElement.style.display = 'block';
            //     loaderElement.style.display = 'none';
            //     getRecords();
            // } catch (error) {
            //     console.error('Error fetching data:', error);
            //     statusElement.style.display = 'block';
            //     loaderElement.style.display = 'none';
            // }
        }
    };
    const refundCheckStatus = async (orderId) => {
        const statusElement = document.getElementById(`cchkstttu_${orderId}`);
        const loaderElement = document.getElementById(`cchkstttu11_${orderId}`);

        if (statusElement && loaderElement) {
            statusElement.style.display = 'none';
            loaderElement.style.display = 'block';
            try {
                const response = await fetch('https://api.payinfintech.com/webhook/payment/phonePay-refund-status', {
                    method: 'POST', // Specify POST method
                    headers: {
                        'Content-Type': 'application/json', // Set content type for JSON
                    },
                    body: JSON.stringify({
                        orderId: orderId, // Include your payload here
                        // Add other properties if needed
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Response data:', data);

                statusElement.style.display = 'block';
                loaderElement.style.display = 'none';
                getRecords();
            } catch (error) {
                console.error('Error fetching data:', error);
                statusElement.style.display = 'block';
                loaderElement.style.display = 'none';
            }

            // try {
            //     const response = await fetch(`https://api.payinfintech.com/webhook/payment/phonePay-refund/${orderId}`);

            //     if (!response.ok) {
            //         throw new Error(`HTTP error! status: ${response.status}`);
            //     }

            //     const data = await response.json();
            //     console.log('Response data:', data);

            //     statusElement.style.display = 'block';
            //     loaderElement.style.display = 'none';
            //     getRecords();
            // } catch (error) {
            //     console.error('Error fetching data:', error);
            //     statusElement.style.display = 'block';
            //     loaderElement.style.display = 'none';
            // }
        }
    };

    const onChangeDates = (dates) => {
        setDates(dates);
        let query = parseQueryParams(location);

        if (dates && dates[0] && dates[1]) {
            query.created_at_date_min = dayjs(dates[0]).startOf('day').format('YYYY-MM-DD');
            query.created_at_date_max = dayjs(dates[1]).endOf('day').format('YYYY-MM-DD');
        } else {
            delete query.created_at_date_min;
            delete query.created_at_date_max;
        }

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
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
            title: 'Date',
            key: 'created_at',
            dataIndex: 'created_at',
        },

        {
            title: 'Name',
            key: 'name',
            render: (text, record) => (
                <div>
                    {record.name}
                    <br></br>
                    {record.email}
                </div>
            ),
        },

        {
            title: 'Pay Amount',
            key: 'total',
            dataIndex: 'total',
        },
        {
            title: 'Settle Amount',
            key: 'subtotal',
            dataIndex: 'subtotal',
        },

        {
            title: 'Order Number',
            key: 'order_number',
            dataIndex: 'order_number',
        },

        {
            title: 'Status',
            key: 'payment_status',
            dataIndex: 'payment_status',
            render: (payment_status) =>
                payment_status === 2 ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>Success</span>
                ) : (
                    payment_status
                ),
        },
        // {
        //     title: 'Refund',
        //     key: 'refund_status',
        //     render: (text, record) => (
        //         <div style={{ color: color[record.refund_status] }}>
        //             {record.refund_status == 'not_applie' || record.refund_status == 'not_applie' ? (
        //                 <div style={{ color: color[record.refund_status] }}>
        //                     <p
        //                         id={`cchkstttu_${record.order_number}`}
        //                         onClick={() => refundAmount(record.order_number)}
        //                         style={{
        //                             padding: '5px 10px',
        //                             cursor: 'pointer',
        //                             backgroundColor: '#0dcaf0',
        //                             color: 'white',
        //                             border: 'none',
        //                             borderRadius: '5px',
        //                             textAlign: 'center',
        //                             width: '100px',
        //                         }}
        //                     >
        //                         Refund
        //                     </p>
        //                     <img
        //                         id={`cchkstttu11_${record.order_number}`}
        //                         // src={dancingloader}
        //                         style={{
        //                             display: 'none',
        //                             height: '10px',
        //                             objectFit: 'cover',
        //                             objectPosition: 'center',
        //                             WebkitTransform: 'scale(1.9)',
        //                             transform: 'scale(1.9)',
        //                             width: '100%',
        //                         }}
        //                     />
        //                 </div>
        //             ) : record.refund_status == 'pending' ? (
        //                 <>
        //                     <div style={{ color: color[record.refund_status] }}>
        //                         <p
        //                             id={`cchkstttu_${record.order_number}`}
        //                             onClick={() => refundCheckStatus(record.order_number)}
        //                             style={{
        //                                 padding: '5px 10px',
        //                                 cursor: 'pointer',
        //                                 backgroundColor: '#0dcaf0',
        //                                 color: 'white',
        //                                 border: 'none',
        //                                 borderRadius: '5px',
        //                                 textAlign: 'center',
        //                                 width: '100px',
        //                             }}
        //                         >
        //                             Pending
        //                         </p>
        //                         <img
        //                             id={`cchkstttu11_${record.order_number}`}
        //                             // src={dancingloader}
        //                             style={{
        //                                 display: 'none',
        //                                 height: '10px',
        //                                 objectFit: 'cover',
        //                                 objectPosition: 'center',
        //                                 WebkitTransform: 'scale(1.9)',
        //                                 transform: 'scale(1.9)',
        //                                 width: '100%',
        //                             }}
        //                         />
        //                     </div>
        //                     <span>Refund Id : {record.refund_id}</span>
        //                 </>
        //             ) : record.refund_status == 'success' ? (
        //                 <>
        //                     <p>Status : Success</p>
        //                     <p>Refund Id : {record.refund_id}</p>
        //                 </>
        //             ) : record.refund_status == 'faild' ? (
        //                 <>
        //                     <p>Status : Failed</p>
        //                     <p>Refund Id : {record.refund_id}</p>
        //                 </>
        //             ) : (
        //                 <p></p>
        //             )}
        //         </div>
        //     ),
        // },
    ];

    return (
        <div className="wrap-orders transaction">
            {/* <PageTitle titles={titles} /> */}
            <Row gutter={[16, 16]} justify={'space-between'} align={'middle'}>
                <Col xs={24} sm={24} md={24} lg={6} xl={8}>
                    <Card className="round_card">
                        <TableBar
                            className="mb-0"
                            placeholderInput="Search Records"
                            onSearch={onSearch}
                            onFilter={onToggleFilter}
                            isActiveFilter={isShowFilter}
                            inputRef={searchRef}
                            showFilter={false}
                        />
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={9}>
                    <Card className="round_card">
                        <Row gutter={[8, 8]}>
                            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                <RangePicker value={dates} onCalendarChange={(newDates) => onChangeDates(newDates)} />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <Button type="primary" size="large" onClick={onExport}>
                                    Export
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={records}
                loading={isTableLoading}
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
        </div>
    );
}

export default PayinSuccessTransaction;
