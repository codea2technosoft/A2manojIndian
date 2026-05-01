import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Space, Row, Divider, DatePicker, Modal, Card, Col } from 'antd';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import FilterActionBar from './FilterActionBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { toast } from 'react-toast';
import { omitBy, isEmpty, debounce } from 'lodash';
import { ChevronDownIcon, RefreshIcon, MenuAlt1Icon, ViewGridIcon } from '@heroicons/react/outline';
import { BaseSelect } from 'components/Elements';
import OrderCardView from './OrderCardView';
import OrderListView from './OrderListView';
// styles
import 'assets/styles/orders.scss';
// request
import { getOrders, getOrderspending, exportOrders } from 'requests/order';

const { RangePicker } = DatePicker;

const titles = [{ title: 'Pending Transaction' }];

function PendingTransactionList() {
    const location = useLocation();
    const navigate = useNavigate();

    const searchRef = useRef(null);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
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

    const config = useSelector((state) => state.config);
    const [dates, setDates] = useState([dayjs(), dayjs()]);

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
            const response = await getOrderspending(query);
            // alert(response.total_records)
            setOrderOverview({
                total_records: response.total_records,
                unpaid_records: response.unpaid_records,
                paid_records: response.paid_records,
                fulfillment_processing_records: response.fulfillment_processing_records,
            });
            setRecords(response.records);
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
            // console.log(query);
            setIsTableLoading(true);
            const response = await exportOrders(query);

            if (response && response.filepath) {
                
                window.open(`https://api.step2pay.online/files/${response.filepath}`, '_blank');
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

    
    return (
        <div className="wrap-orders transaction">
            
            {view === 'card' ? (
                <OrderCardView
                    view={view}
                    records={records}
                    isTableLoading={isTableLoading}
                    pagination={{
                        pageSize: perPage,
                        total: totalCount,
                        current: page,
                        onChange: (page, pageSize) => onChangeTable({ current: page, pageSize: pageSize }, {}, {}, {}),
                    }}
                    selectedRecords={selectedRecords}
                    onSelectRecords={setSelectedRecords}
                />
            ) : (
                <OrderListView
                    records={records}
                    isTableLoading={isTableLoading}
                    pagination={{
                        pageSize: perPage,
                        total: totalCount,
                        current: page,
                        // onChange: onChangeTable
                    }}
                    selectedRecords={selectedRecords}
                    onChangeTable={onChangeTable}
                    onSelectRecords={setSelectedRecords}
                />
            )}
            {/* <FilterDrawer
				isCartFilter={false}
				orders={orderOverview}
				visible={isShowFilter}
				onClose={onToggleFilter}
				onSaveFilter={onSaveFilter}
				filterData={filter}
				onChangeFilter={onChangeFilter}
			/> */}
        </div>
    );
}

export default PendingTransactionList;
