import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Typography, Card, Col, Row, Statistic, Menu, Button, Spin, Dropdown, Space, Popover } from 'antd';
import { FaRupeeSign } from 'react-icons/fa';
import { GrTransaction } from 'react-icons/gr';
import { RiArrowLeftRightLine } from 'react-icons/ri';
import wallet from 'assets/images/wallet2.png';
import DatePicker from 'components/DatePicker';
import { Wallet, Chart, Buy, TickSquare, Swap } from 'react-iconly';
import dayjs from 'dayjs';
// import walletIcon from 'assets/images/SDFDSAFSD.png';
import { formatCurrency } from 'utils/common';
// request
import { getOverviewSummary } from 'requests/statistic';
import { toast } from 'react-toast';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Meta } = Card;
const text = <h3>Available Balance</h3>;
const buttonWidth = 80;
const content = <p>₹ 2500</p>;
const OverviewCardByDate = (props) => {
    const [dates, setDates] = useState([dayjs(), dayjs()]);
    const [mode, setMode] = useState('today');
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [TotalAmts, TotalAmt_show] = useState('0');

    const availableModes = [
        { key: 'today', label: 'Today' },
        { key: 'yesterday', label: 'Yesterday' },
        // { key: 'last7days', label: 'Last 7 days' },
        { key: 'last30days', label: 'Last 30 days' },
        // { key: 'last90days', label: 'Last 90 days' },
    ];

    useEffect(() => {
        getData(dates);
    }, [dates]);

    const getData = async (dates) => {
        try {
            setLoading(true);
            const filters = {
                start: dates[0].format('YYYY-MM-DD'),
                end: dates[1].format('YYYY-MM-DD'),
            };

            const response = await getOverviewSummary(filters);
            setData(response);
        } catch (err) {
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onSetDatesByDatePicker = (dates) => {
        setMode('custom');
        setDates(dates);
    };

    const onSetDatesByMode = (mode) => {
        setMode(mode);

        if (mode === 'today') {
            setDates([dayjs(), dayjs()]);
        } else if (mode === 'yesterday') {
            setDates([dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')]);
        } else if (mode === 'last7days') {
            setDates([dayjs().subtract(7, 'day'), dayjs()]);
        } else if (mode === 'last30days') {
            setDates([dayjs().subtract(30, 'day'), dayjs()]);
        } else if (mode === 'last90days') {
            setDates([dayjs().subtract(90, 'day'), dayjs()]);
        }
    };

    const items = [
        { key: 'today', label: 'Today' },
        { key: 'yesterday', label: 'Yesterday' },
        { key: 'last7days', label: 'Last 7 days' },
        { key: 'last30days', label: 'Last 30 days' },
        { key: 'last90days', label: 'Last 90 days' },
    ];

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
    const [arrow, setArrow] = useState('Show');
    const mergedArrow = useMemo(() => {
        if (arrow === 'Hide') {
            return false;
        }
        if (arrow === 'Show') {
            return true;
        }
        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    return (
        <div>
            <Row gutter={[8, 8]} align="middle" justify={{ md: 'center', lg: 'space-between' }} className='bgred'>
                <Col xs={24} md={24} lg={15} xl={17}>
                    <Row gutter={[8, 8]} justify={{ md: 'center', lg: 'space-between' }} align={'middle'}>
                        <Col xs={24} sm={20} md={18} lg={15} xl={12}>
                            <Card className="filter">
                                {availableModes.map((item) => (
                                    <div className="filter_buttons">
                                        <Button
                                            size="large"
                                            type={mode == item.key ? 'primary' : 'default'}
                                            onClick={() => onSetDatesByMode(item.key)}
                                        >
                                            {item.label}
                                        </Button>
                                    </div>
                                ))}
                            </Card>
                        </Col>
                        <Col xs={24} sm={4} md={4} lg={4} xl={3}>
                            <Card className="wallet_box overview_Wallet">
                                <Popover placement="bottom" title={text} content={content} arrow={mergedArrow}>
                                    <img src={wallet} alt="wallet" className="wallet" />
                                </Popover>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col xs={24} md={16} lg={9} xl={7}>
                    <Card className="wallet_box">
                        <RangePicker value={dates} onCalendarChange={(newDates) => onSetDatesByDatePicker(newDates)} />
                    </Card>
                </Col>
            </Row>
            <Spin spinning={loading}>
                <Row className="mt-16" gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Card className="box1 stats">
                            <div className="data">
                                <div className="icon">
                                    <RiArrowLeftRightLine set="light" width={36} height={36} />
                                </div>
                                <div><p className="value">{data.paidOrderCount}</p></div>
                            </div>
                            <div className='title'>
                                <p className="name">No of Success Transaction</p>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Card className="box2 stats">
                            <div className="data">
                                <div className="icon">
                                    <FaRupeeSign set="light" width={36} height={36} />
                                </div>
                                    <p className="value">{data.paidTotalAmount}</p>
                            </div>
                                <div  className='title'>
                                    <p className="name">Success Amount</p>
                                </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Card className="box3 stats">
                            <div className="data">
                                <div className="icon">
                                    <FaRupeeSign set="light" width={36} height={36} />
                                </div>
                                    <p className="value">{data.transferToBankAmt}</p>
                            </div>
                                <div className='title'>
                                    <p className="name">Transfer To Bank</p>
                                </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={6}>
                        <Card className="box4 stats">
                            <div className="data">
                                <div className="icon">
                                    <FaRupeeSign set="light" width={36} height={36} />
                                </div>
                                    <p className="value">{data.transferToPayoutAmt}</p>
                            </div>
                                <div className='title'>
                                    <p className="name">Transfer to Payout</p>
                                </div>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

OverviewCardByDate.propTypes = {};

export default OverviewCardByDate;
