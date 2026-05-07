import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Row, Col, Table,Button,DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
// import { Button, Space, Row, Divider, DatePicker, Modal } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import TableBar from 'components/TableBar';
import { toast } from 'react-toast';
import { BaseSelect } from 'components/Elements';
// css
import 'assets/styles/overview.scss';
// request
import { getPartnerSummary } from 'requests/statistic';
import { formatCurrency } from 'utils/common';

import { getOrders, exportOrders } from 'requests/order';

const { Title } = Typography;

const OverviewPartners = (props) => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const searchRef = useRef(null);
    const [isShowFilter, setIsShowFilter] = useState(false);
    const [filter, setFilter] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;    
    const config = useSelector(state => state.config);
    
    const columns = [
        {
            title: 'Partner Name',
            key: 'full_name',
            dataIndex: 'full_name'
        },
        {
            title: 'Total Order Amount',
            key: 'order_amount',
            dataIndex: 'order_amount',
            render: (text, record) => (
                <div>{formatCurrency(record.order_amount)}</div>
            )
        },
        {
            title: 'Paid Order Amount',
            key: 'paid_order_amount',
            dataIndex: 'paid_order_amount',
            render: (text, record) => (
                <div>{formatCurrency(record.paid_order_amount)}</div>
            )
        },
        // {
        //     title: 'Gateway Fees',
        //     key: 'gateway_fees',
        //     dataIndex: 'gateway_fees',
        // },
        // {
        //     title: 'Amount Settled',
        //     key: 'settled_amount',
        //     dataIndex: 'settled_amount',
        // },
        // {
        //     title: 'Platform Fees',
        //     key: 'paid_order_fees',
        //     dataIndex: 'paid_order_fees',
        // },
        {
            title: 'Settled Amount',
            key: 'settled_amount',
            dataIndex: 'settled_amount',
            render: (text, record) => (
                <div>{formatCurrency(record.settled_amount)}</div>
            )
        },
        {
            title: 'Order Fees',
            render: (text, record) => (
                <div>{formatCurrency(Number(record.paid_order_reserve_amount) + Number(record.paid_order_fees))}</div>
            )
        },
        {
            title: 'Available balance',
            render: (text, record) => (
                <div>
                    {formatCurrency(Number(record.paid_order_amount) - Number(record.paid_order_reserve_amount) - Number(record.paid_order_fees) - Number(record.settled_amount) - Number(record.chargeback_amount))}
                </div>
            )
        },
        {
            title: 'Reseller Amount',
            key: 'paid_order_reserve_amount',
            dataIndex: 'paid_order_reserve_amount',
            render: (text, record) => (
                <div>{formatCurrency(record.paid_order_reserve_amount)}</div>
            )
        },
        {
            title: 'Chargeback Amount',
            render: (text, record) => (
                <div>{formatCurrency(record.chargeback_amount)}</div>
            )
        },
        
       
       
        // {
        //     title: 'Amount Withdrawn',
        //     key: 'withdrawn_amount',
        //     dataIndex: 'withdrawn_amount',
        // },
        // {
        //     title: 'Payout Fees',
        //     key: 'payouts_fees',
        //     dataIndex: 'payouts_fees',
        // },
        // {
        //     title: 'Net Earnings',
        //     render: (text, record) => (
        //         <div>{Number(record.paid_order_fees - record.gateway_fees).toFixed(2)}</div>
        //     )
        // },
    ];

    useEffect(() => {
        const query = parseQueryParams(location);
        getData(query);
    }, [location]);

    const getData = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getPartnerSummary(query);

            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    }

    const onChangeTable = (pagination) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: pagination.current,
            per_page: pagination.pageSize,
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const onToggleFilter = () => {
		setIsShowFilter(!isShowFilter);
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

    const onChangeDates = (dates) => {
		let query = parseQueryParams(location);

		if (dates) {
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
	}

    const onExport = async () => {
		try {
			let query = parseQueryParams(location);

			setIsTableLoading(true);
			const response = await exportOrders(query);
			window.open(`${process.env.REACT_APP_ASSET_URL}${response.filepath}`, '_blank');
		} catch (err) {
			toast.error('An error occurred. Please try again.');
		} finally {
			setIsTableLoading(false);
		}
	}

   

	const onChangeFilter = (name, e, isMuilty = false) => {
		if (isMuilty) {
			setFilter((preState) => ({ ...preState, [name]: e.join(',') }));
		} else {
			setFilter((preState) => ({ ...preState, [name]: e }));
		}
	};

	const onChangePaymentStatus = (value) => {
		let query = parseQueryParams(location);

		if (value) {
			query = {
				...query,
				payment_status: value
			};
		} else {
			delete query.payment_status;
		}
		
		navigate({
			pathname: location.pathname,
			search: stringifyQueryParams(query),
		});
	}

    return (
<div>
        <Row justify={'space-between'} align={'middle'}>
            <TableBar
                id="tablescrool"
				placeholderInput="Partner Name/Settled Amount/Paid Order Amount/"
				onSearch={onSearch}
				onFilter={onToggleFilter}
				isActiveFilter={isShowFilter}
				inputRef={searchRef}
				showFilter={false}
			/>

                    <Space className="mb-8">
						<RangePicker onCalendarChange={(newDates) => onChangeDates(newDates)} />
						<Button type="primary" size='large' onClick={onExport}>Export</Button>
					</Space>

                    </Row>
        <Table
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
                x: true
            }}
        />
</div>
    );
}

export default OverviewPartners;
