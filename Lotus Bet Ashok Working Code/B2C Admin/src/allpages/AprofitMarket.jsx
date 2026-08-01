import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

import {
    getProfitLossByMarket,
    showBetsLossByMarket
} from "../Server/api";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function AprofitMarket() {
    const [activeTab, setActiveTab] = useState('Cricket');
    const [expandedRows, setExpandedRows] = useState({});
    const [tableData, setTableData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [grandTotal, setGrandTotal] = useState(null);

    const [fromDate, setFromDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toDate, setToDate] = useState('');
    const [toTime, setToTime] = useState('');

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        per_page: 50,
    });


    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.total_pages) return;

        fetchProfitLossData(
            activeTab,
            !!(fromDate && toDate),
            page
        );
    };



    const tabs = ['Cricket', 'Soccer', 'Tenis', 'International Casino'];
    const sportIdMap = {
        'Cricket': '4',
        'Soccer': '1',
        'Tenis': '2',
        // 'Indian Casino': '5',
        'International Casino': '10'
    };

    const fetchProfitLossData = async (market = activeTab, applyDateFilter = false) => {
        setLoading(true);
        setError(null);

        const adminId = localStorage.getItem("admin_id");
        const sportId = sportIdMap[market] || '';

        try {
            const params = {
                sport_id: sportId,
            };

            // ✅ SIRF TAB DATES BHEJO JAB APPLY DATE FILTER TRUE HO
            if (applyDateFilter) {
                if (fromDate) {
                    params.from_date = fromDate;
                }
                if (toDate) {
                    params.to_date = toDate;
                }
            }

            console.log("📤 Sending params:", params);
            const response = await getProfitLossByMarket(params);

            console.log("Full Response:", response);

            const result = response?.data;

            if (result?.success) {
                console.log("API Result:", result);
                setGrandTotal(result.grandTotal || null);

                const apiData = result.data || [];
                console.log("API Data:", apiData);

                const transformedData = apiData.map(item => ({
                    id: item.event_id || Math.random(),
                    matchName: item.market_name || "Unknown Match",
                    date: item.created_at || "",
                    downlinePL: formatNumber(item.downlinePL || 0),
                    playerPL: formatNumber(item.playerPL || 0),
                    comm: formatNumber(item.commission || 0),
                    uplinePL: formatNumber(item.uplinePL || 0),
                    isPositive: Number(item.uplinePL) >= 0,
                    bets: item.bets || [],
                    betType: item.bet_type || "",
                    sport_id: item.sport_id || "",
                    totalBets: item.totalBets || 0,
                    totalStake: item.totalStake || 0,
                    showBets: item.showBets || false,
                    totalBackBets: item.totalBackBets || 0,
                    totalLayBets: item.totalLayBets || 0,
                }));

                console.log("Transformed:", transformedData);

                setTableData(prev => ({
                    ...prev,
                    [market]: transformedData,
                }));

            } else {
                setError(result?.message || "Failed to fetch data");
                setTableData(prev => ({
                    ...prev,
                    [market]: [],
                }));
            }

        } catch (err) {
            console.error(err);
            setError("Failed to fetch data.");
            setTableData(prev => ({
                ...prev,
                [market]: [],
            }));
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format numbers with commas
    const formatNumber = (num) => {
        if (num === null || num === undefined || isNaN(num)) return '0.00';
        const formatted = parseFloat(num).toFixed(2);
        const parts = formatted.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    // ✅ Initial data load - Auto fetch with NO dates (All data)
    useEffect(() => {
        if (!tableData[activeTab]) {
            fetchProfitLossData(activeTab, false);
        }
    }, [activeTab]);

    // ✅ Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setExpandedRows({});
        if (!tableData[tab]) {
            if (fromDate && toDate) {
                fetchProfitLossData(tab, true);
            } else {
                fetchProfitLossData(tab, false);
            }
        }
    };

    // ✅ Handle search - WITH DATE FILTERS
    const handleSearch = () => {
        if (!fromDate || !toDate) {
            setError("Please select From and To dates");
            return;
        }
        setError(null);
        fetchProfitLossData(activeTab, true);
    };

    // ✅ Handle Reset
    const handleReset = () => {
        setFromDate('');
        setFromTime('');
        setToDate('');
        setToTime('');
        setError(null);
        setTableData(prev => ({
            ...prev,
            [activeTab]: []
        }));
        setGrandTotal(null);
        // ✅ Auto fetch without dates
        setTimeout(() => {
            fetchProfitLossData(activeTab, false);
        }, 100);
    };

    // ✅ Handle Just For Today - Aaj ki date
    const handleJustForToday = () => {
        const today = new Date();
        const formatDate = (date) => date.toISOString().split('T')[0];

        setFromDate(formatDate(today));
        setFromTime('00:00');
        setToDate(formatDate(today));
        setToTime('23:59');

        setTimeout(() => {
            fetchProfitLossData(activeTab, true);
        }, 100);
    };

    // ✅ Handle From Yesterday - Kal ki date
    const handleFromYesterday = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const formatDate = (date) => date.toISOString().split('T')[0];

        setFromDate(formatDate(yesterday));
        setFromTime('00:00');
        setToDate(formatDate(yesterday));
        setToTime('23:59');

        setTimeout(() => {
            fetchProfitLossData(activeTab, true);
        }, 100);
    };

    // Toggle row expansion
    const toggleRow = (id) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Get current data based on active tab
    const currentData = tableData[activeTab] || [];
    console.warn("currentData", currentData);

    // Calculate totals from current data
    const calculateTotals = () => {
        let totalDownlinePL = 0;
        let totalPlayerPL = 0;
        let totalComm = 0;
        let totalUplinePL = 0;

        currentData.forEach(item => {
            totalDownlinePL += parseFloat(item.downlinePL.replace(/,/g, '')) || 0;
            totalPlayerPL += parseFloat(item.playerPL.replace(/,/g, '')) || 0;
            totalComm += parseFloat(item.comm.replace(/,/g, '')) || 0;
            totalUplinePL += parseFloat(item.uplinePL.replace(/,/g, '')) || 0;
        });

        return {
            downlinePL: totalDownlinePL.toFixed(2),
            playerPL: totalPlayerPL.toFixed(2),
            comm: totalComm.toFixed(2),
            uplinePL: totalUplinePL.toFixed(2)
        };
    };

    const totals = calculateTotals();
    const displayGrandTotal = grandTotal || totals;

    // Handle input changes for date/time
    const handleFromDateChange = (e) => setFromDate(e.target.value);
    const handleFromTimeChange = (e) => setFromTime(e.target.value);
    const handleToDateChange = (e) => setToDate(e.target.value);
    const handleToTimeChange = (e) => setToTime(e.target.value);

    // ✅ Render sub-table for expanded row
    const renderSubTable = (item) => {
        if (!item.bets || item.bets.length === 0) {
            return (
                <tr>
                    <td colSpan="7" className="text-center">No bets available</td>
                </tr>
            );
        }

        const groupedBets = item.bets.reduce((acc, bet) => {
            const key = bet.bet_type || bet.type || 'unknown';
            if (!acc[key]) acc[key] = [];
            acc[key].push(bet);
            return acc;
        }, {});

        return Object.keys(groupedBets).map((betType, index) => {
            const bets = groupedBets[betType];
            const totalProfitLoss = bets.reduce((sum, bet) => sum + (parseFloat(bet.profit_loss) || 0), 0);

            const userIds = bets.map(bet => bet.user_id).filter(id => id);
            const uniqueUserIds = [...new Set(userIds)];
            const userIdParam = uniqueUserIds.length > 0 ? `?user_id=${uniqueUserIds[0]}` : '';

            return (
                <tr key={index}>
                    <td>{betType.charAt(0).toUpperCase() + betType.slice(1)}</td>
                    <td>{bets.length}</td>
                    <td>
                        <span className={totalProfitLoss >= 0 ? 'text-success' : 'text-danger'}>
                            {formatNumber(totalProfitLoss)}
                        </span>
                    </td>
                    <td>
                        <span className={totalProfitLoss >= 0 ? 'text-danger' : 'text-success'}>
                            {formatNumber(-totalProfitLoss)}
                        </span>
                    </td>
                    <td>0.00</td>
                    <td>
                        <span className={totalProfitLoss >= 0 ? 'text-success' : 'text-danger'}>
                            {formatNumber(totalProfitLoss)}
                        </span>
                    </td>
                    <td style={{ minWidth: "120px" }}>
                        <Link
                            style={{ padding: "5px", textDecoration: "none" }}
                            className="me-0 theme_light_btn theme_dark_btn"
                            to={`/match-market-bets/${item.id}${userIdParam}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Show Bets
                        </Link>
                    </td>
                </tr>
            );
        });
    };

    return (
        <div className='allcommon'>
            <section className="main-inner-outer py-4">
                <div className="container-fluid">
                    <div className="row">
                        <div className="db-sec">
                            <h2 className="common-heading">Profit/Loss Report by Market</h2>
                        </div>
                        <div className="col-md-12">
                            <div className="inner-wrapper">
                                <form className="bet_status" onSubmit={(e) => e.preventDefault()}>
                                    <div className="row">
                                        <div className="col-xl-12 col-md-12">
                                            <div className="row">
                                                <div className="mb-lg-0 mb-2 flex-grow-0 pe-2 col-lg-3 col-sm-6">
                                                    <div className="bet-sec bet-period">
                                                        <label className="px-2 form-label">From</label>
                                                        <div className="form-group d-flex">
                                                            <input
                                                                type="date"
                                                                className="small_form_control form-control"
                                                                value={fromDate}
                                                                onChange={handleFromDateChange}
                                                            />
                                                            <input
                                                                placeholder="00:00"
                                                                type="time"
                                                                className="small_form_control form-control ms-2"
                                                                value={fromTime}
                                                                onChange={handleFromTimeChange}
                                                                style={{ width: 80 }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-lg-0 mb-2 flex-grow-0 ps-2 col-lg-3 col-sm-6">
                                                    <div className="bet-sec bet-period">
                                                        <label className="px-2 form-label">To</label>
                                                        <div className="form-group d-flex">
                                                            <input
                                                                type="date"
                                                                className="small_form_control form-control"
                                                                value={toDate}
                                                                onChange={handleToDateChange}
                                                            />
                                                            <input
                                                                placeholder="00:00"
                                                                type="time"
                                                                className="small_form_control form-control ms-2"
                                                                value={toTime}
                                                                onChange={handleToTimeChange}
                                                                style={{ width: 80 }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="history-btn mt-2">
                                        <ul className="list-unstyled mb-0 d-flex flex-wrap">
                                            <li>
                                                <button
                                                    type="button"
                                                    className="me-2 theme_light_btn btn btn-primary"
                                                    onClick={handleJustForToday}
                                                >
                                                    Just For Today
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="me-2 theme_light_btn btn btn-primary"
                                                    onClick={handleFromYesterday}
                                                >
                                                    From Yesterday
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="me-2 theme_dark_btn btn btn-primary"
                                                    onClick={handleSearch}
                                                >
                                                    Search
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    className="me-0 theme_light_btn btn btn-primary"
                                                    onClick={handleReset}
                                                >
                                                    Reset
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex flex-wrap live-match-bat justify-sm-content-end">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        className={`mb-2 mx-1 btn btn-primary ${activeTab === tab ? 'green-btn' : 'theme_light_btn'}`}
                                        onClick={() => handleTabChange(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
                            <section className="account-table aprofit-downline aprofit-market w-100">
                                <div className="responsive transaction-history table-color">
                                    {loading ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p>Loading data...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="alert alert-danger m-3">{error}</div>
                                    ) : currentData.length === 0 ? (
                                        // ✅ Empty table with headers
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">UID</th>
                                                    <th scope="col">Downline P/L</th>
                                                    <th scope="col">Player P/L</th>
                                                    <th scope="col">Comm.</th>
                                                    <th scope="col" colSpan={2}>
                                                        Upline P/L
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4">
                                                        No data available for {activeTab}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    ) : (
                                        // ✅ Data table
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">UID</th>
                                                    <th scope="col">Downline P/L</th>
                                                    <th scope="col">Player P/L</th>
                                                    <th scope="col">Comm.</th>
                                                    <th scope="col" colSpan={2}>
                                                        Upline P/L
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentData.map((item) => (
                                                    <React.Fragment key={item.id}>
                                                        <tr>
                                                            <td>
                                                                <i
                                                                    className={`fas fa-${expandedRows[item.id] ? 'minus' : 'plus'}-square pe-2`}
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => toggleRow(item.id)}
                                                                />
                                                                <Link to={`/profit-loss-report-sports-wise-downline/${item.id}`}>
                                                                    {item.matchName} ▸ {item.id} ▸ {item.date}
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <span className={item.isPositive ? 'text-success' : 'text-danger'}>
                                                                    {item.isPositive ? item.downlinePL : `(${item.downlinePL})`}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={!item.isPositive ? 'text-success' : 'text-danger'}>
                                                                    {!item.isPositive ? item.playerPL : `(${item.playerPL})`}
                                                                </span>
                                                            </td>
                                                            <td>{item.comm}</td>
                                                            <td>
                                                                <span className={item.isPositive ? 'text-success' : 'text-danger'}>
                                                                    {item.isPositive ? item.uplinePL : `(${item.uplinePL})`}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        {expandedRows[item.id] && (
                                                            <tr>
                                                                <td colSpan="7" className="abc">
                                                                    <table width="100%" className="sub-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Bet Type</th>
                                                                                <th>Total Bets</th>
                                                                                <th>P/L</th>
                                                                                <th>Player P/L</th>
                                                                                <th>Comm.</th>
                                                                                <th>Upline P/L</th>
                                                                                <th>Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {renderSubTable(item)}
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                                {/* Grand Total Row */}
                                                <tr style={{ fontWeight: 'bold', backgroundColor: '#e9ecef' }}>
                                                    <th scope="col">Total</th>
                                                    <th>
                                                        <span className={parseFloat(displayGrandTotal.downlinePL) >= 0 ? 'text-success' : 'text-danger'}>
                                                            {parseFloat(displayGrandTotal.downlinePL) >= 0
                                                                ? formatNumber(displayGrandTotal.downlinePL)
                                                                : `(${formatNumber(displayGrandTotal.downlinePL)})`}
                                                        </span>
                                                    </th>
                                                    <th>
                                                        <span className={parseFloat(displayGrandTotal.playerPL) >= 0 ? 'text-success' : 'text-danger'}>
                                                            {parseFloat(displayGrandTotal.playerPL) >= 0
                                                                ? formatNumber(displayGrandTotal.playerPL)
                                                                : `(${formatNumber(displayGrandTotal.playerPL)})`}
                                                        </span>
                                                    </th>
                                                    <th>{formatNumber(displayGrandTotal.commission || 0)}</th>
                                                    <th>
                                                        <span className={parseFloat(displayGrandTotal.uplinePL) >= 0 ? 'text-success' : 'text-danger'}>
                                                            {parseFloat(displayGrandTotal.uplinePL) >= 0
                                                                ? formatNumber(displayGrandTotal.uplinePL)
                                                                : `(${formatNumber(displayGrandTotal.uplinePL)})`}
                                                        </span>
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}
                                    {pagination.total_records >= 0 && (
                                        <div className="bottom-pagination d-flex justify-content-center align-items-center">
                                            <ul className="pagination mb-0 gap-0">
                                                <li className={`previous ${pagination.current_page === 1 ? "disabled" : ""}`}>
                                                    <Link className="" onClick={() => handlePageChange(pagination.current_page - 1)}>
                                                        <FaChevronLeft />
                                                    </Link>
                                                </li>
                                                {[
                                                    pagination.current_page - 1,
                                                    pagination.current_page,
                                                    pagination.current_page + 1,
                                                ]
                                                    .filter((p) => p > 0 && p <= pagination.total_pages)
                                                    .map((p) => (
                                                        <li key={p} className={`p-0 ${pagination.current_page === p ? "active" : ""}`}>
                                                            <Link className="pagintion-li" onClick={() => handlePageChange(p)}>
                                                                {p}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                <li className={`next ${pagination.current_page === pagination.total_pages ? "disabled" : ""}`}>
                                                    <Link className="" onClick={() => handlePageChange(pagination.current_page + 1)}>
                                                        <FaChevronRight />
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AprofitMarket;