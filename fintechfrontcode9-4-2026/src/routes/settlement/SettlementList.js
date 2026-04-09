import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Spin, Table, Popover, Card, Col, Row, Dropdown, Statistic, Tabs, Menu,DatePicker } from 'antd';
import { useLocation, useNavigate, Link, NavLink } from 'react-router-dom';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { TimeCircle } from 'react-iconly';
import { formatCurrency, generateServiceName, generateSettlementStatusLabel } from 'utils/common';
import BankListView from './BankListView';
import BankTransfarList from './BankTransfarList';
import OverviewCardByDate from './OverviewCardByDate';
import wallet from 'assets/images/Wallet 1.png';

// request
import { getSettlements } from 'requests/order';
import { getSettlementSummary } from 'requests/statistic';
import TransfarbankList from 'routes/transfarbank/TransfarbankList';
import TransfarList from 'routes/transfarpayout/TransfarList';

const SettlementList = () => {
    const [isTableLoading, setIsTableLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = React.useState(0);
    const [records, setRecords] = React.useState([]);
    const [summaryData, setSummaryData] = React.useState({});
    const [visibleCycleDetail, setVisibleCycleDetail] = React.useState(false);
    const { RangePicker } = DatePicker;
    const config = useSelector((state) => state.config);
    const authUser = useSelector((state) => state.auth.authUser);

    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Settlements' }];

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'UTR',
            key: 'settlement_id',
            dataIndex: 'settlement_id',
            render: (text, record) => <div>{text}</div>,
        },
        {
            title: 'User',
            key: 'user_id',
            dataIndex: 'user_id',
        },
        {
            title: 'Amount',
            render: (text, record) => (
                <div>
                    {formatCurrency(
                        record.platform_gross_amount - record.platform_management_fee - record.platform_reserve_amount,
                    )}
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text) => generateSettlementStatusLabel(text),
        },
        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
        },
    ];

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
        getSummaryData();
    }, [location]);

    const getSummaryData = async () => {
        const response = await getSettlementSummary();
        setSummaryData(response);
    };

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getSettlements(query);

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

    const DropdownWallet2 = () => (
        <Menu>
            <Menu.Item>
                <NavLink onClick="#" className="ant-btn ant-btn-primary" style={{ color: '#fff' }}>
                    Self Withdrawl
                </NavLink>
            </Menu.Item>

            <Menu.Item>
                <NavLink onClick="#" className="ant-btn ant-btn-primary" style={{ color: '#fff' }}>
                    Transfer to Payout
                </NavLink>
            </Menu.Item>
        </Menu>
    );

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

    const onRefresh = () => {
        let query = parseQueryParams(location);
        query = {
            page: 1,
            keyword: '',
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });

        if (searchRef.current?.input.value) {
            searchRef.current.handleReset();
        }
    };

    const onChangeTable = (pagination) => {
        console.log(pagination);

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

    const handleVisibleCycleDetail = (visible) => {
        setVisibleCycleDetail(visible);
    };

    const onChange = (key) => {
        console.log(key);
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

    const items = [
        {
            key: '1',
            label: 'Self Withdrawl',
            children: ( 
                <>
                    {/* <Row gutter={[8, 8]} justify={{ md: 'center', lg: 'space-between' }} className='mb-16'>
                        <Col xs={24} md={16} lg={8} xl={6}>
                            <RangePicker onCalendarChange={(newDates) => onChangeDates(newDates)} />
                        </Col>
                        <Col xs={24} md={3} lg={3} xl={3}>
                            <Card className="wallet_box">
                                <Dropdown overlay={DropdownWallet2} placement="bottomLeft">
                                    <img src={wallet} alt="wallet" className="wallet" />
                                </Dropdown>
                            </Card>
                        </Col>
                    </Row> */}
                    <TransfarbankList/>
                </>
            ),
        },
        {
            key: '2',
            label: 'Transfer To Payout',
            children: (
                <>
                    <TransfarList/>
                </>
            ),
        },
    ];

    return (
        <div>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} indicatorSize={(origin) => origin - 16} />
        </div>
    );
};

export default SettlementList;
