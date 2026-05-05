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
import { getOrders, getWalletFailedreport, exportOrders } from 'requests/order';

const { RangePicker } = DatePicker;

const titles = [{ title: 'All Transaction' }];

function WalletFailedTransaction() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [isShowFilter, setIsShowFilter] = useState(false);
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
            const response = await getWalletFailedreport(query);
            setImageURL(response.url)
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

    // const columns = [
    //     {
    //         title: 'Date',
    //         key: 'created_at',
    //         dataIndex: 'created_at'
    //     },
      
    //     {
    //         title: 'Image',
    //         key: 'image',
    //         dataIndex: 'image',
    //         render: (text, record) => (
    //           <img src={`${imageURL}/${record.image}`} style={{ maxWidth: '50px', maxHeight: '50px' }}/>
    //         ),
    //       },
      
    //   {
    //     title: 'Amount',
    //     key: 'amount',
    //     dataIndex: 'amount'
    //   },

    //   {
    //     title: 'reason',
    //     key: 'remark',
    //     dataIndex: 'remark'
    //   },
      
    //   {
    //       title: 'Status',
    //       key: 'status',
    //       dataIndex: 'status'
    //     },
        
    // ];


    const columns = [
        {
            title: 'Date',
            key: 'created_at',
            dataIndex: 'created_at'
        },
      
        {
            title: 'Bank Name',
            key: 'Bank_Name ',
            dataIndex: 'Bank_Name'
          },

          {
            title: 'TRN/RRN Number',
            key: 'rrn_number ',
            dataIndex: 'rrn_number'
          },

          {
            title: 'Payment Method',
            key: 'mode',
            dataIndex: 'mode'
          },

          {
            title: 'Amount',
            key: 'amount',
            dataIndex: 'amount'
          },

        {
            title: 'Receipt',
            key: 'image',
            dataIndex: 'image',
            render: (text, record) => (
              <img src={`${imageURL}/${record.image}`} style={{ maxWidth: '50px', maxHeight: '50px' }}/>
            ),
          },
      
          {
            title: 'Reason',
            key: 'remark',
            dataIndex: 'remark'
         },
      
        {
          title: 'Status',
          key: 'status',
          dataIndex: 'status'
        },
        
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
                        <Row gutter={[8,8]}>
                            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                <RangePicker
                                    value={dates}
                                    onCalendarChange={(newDates) => onChangeDates(newDates)}
                                />
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={onExport}
                                >
                                    Export
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>


            <Table
                rowKey='id'
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
                    x: true
                }}
            />


          
        </div>
    );
}

export default WalletFailedTransaction;
