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
import { getOrders, getSuccessreport, exportOrdersSuccess } from 'requests/order';

const { RangePicker } = DatePicker;

const titles = [{ title: 'All Transaction' }];

const columns = [
    {
        title: 'Order Id',
        key: 'orderid',
        dataIndex: 'orderid',
    },

    {
        title: 'Account Number',
        key: 'accountnumber',
        dataIndex: 'accountnumber',
    },

    {
        title: 'Amount',
        key: 'subtotal',
        dataIndex: 'subtotal',
    },
    {
        title: 'GST',
        key: 'gst',
        dataIndex: 'gst',
    },
    {
        title: 'Fees',
        key: 'fees',
        dataIndex: 'fees',
    },
    {
        title: 'Total',
        key: 'amount',
        dataIndex: 'amount',
    },

    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
    },

    {
        title: 'Payment Method',
        key: 'mode',
        dataIndex: 'mode',
    },

    {
        title: 'Date',
        key: 'created_at',
        dataIndex: 'created_at',
    },
];

function SuccessTransaction() {
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

    const config = useSelector((state) => state.config);

    useEffect(() => {
        const query = parseQueryParams(location);
        if (query.start && query.end) {
            getRecords(query);
        } else {
            const today = dayjs();
            const defaultDateMin = today.startOf('day');
            const defaultDateMax = today.endOf('day');
            query.start = defaultDateMin.format('YYYY-MM-DD');
            query.end = defaultDateMax.format('YYYY-MM-DD');
            setFilter(query);
            getRecords(query);
        }
    }, [location]);

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getSuccessreport(query);

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
            if (query.start && query.end) {
                const response = await exportOrdersSuccess(query);
                if (response && response.filepath) {
                    window.open(`https://api.payinfintech.com/files/${response.filepath}`, '_blank');
                } else {
                    throw new Error('Invalid response data');
                }
            } else {
                const today = dayjs();
                const defaultDateMin = today.startOf('day');
                const defaultDateMax = today.endOf('day');
                query.start = defaultDateMin.format('YYYY-MM-DD');
                query.end = defaultDateMax.format('YYYY-MM-DD');
                const response = await exportOrdersSuccess(query);

                if (response && response.filepath) {
                    // alert(process.env.REACT_APP_ASSET_URL);
                    // alert(response.filepath);
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

    const onChangeDates = (dates) => {
        setDates(dates);
        let query = parseQueryParams(location);

        if (dates && dates[0] && dates[1]) {
            query.start = dayjs(dates[0]).startOf('day').format('YYYY-MM-DD');
            query.end = dayjs(dates[1]).endOf('day').format('YYYY-MM-DD');
        } else {
            delete query.start;
            delete query.end;
        }

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

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

export default SuccessTransaction;
