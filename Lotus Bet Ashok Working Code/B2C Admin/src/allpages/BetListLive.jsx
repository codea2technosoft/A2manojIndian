import React, { useState, useEffect, useCallback } from 'react';
import Heading from '../Layout/Heading';
import moment from 'moment';
import {
    getBetListlive,
} from "../Server/api";

function BetListLive() {
    const [betData, setBetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        sport: 'all',
        marketType: 'all',
        orderBy: 'amount',
        orderDirection: 'desc',
        betStatus: 'active'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBets, setTotalBets] = useState(0);
    const [summary, setSummary] = useState(null);
    const limit = 35; // ✅ Changed to 10 for better pagination

    // ✅ Memoize fetchBetList to prevent unnecessary re-renders
    const fetchBetList = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                sport: searchParams.sport !== 'all' ? searchParams.sport : '',
                market_type: searchParams.marketType !== 'all' ? searchParams.marketType : '',
                bet_status: searchParams.betStatus || 'active',
                from_date: '',
                to_date: '',
                bet_on: '',
                team: '',
                keyword: '',
                order_by: searchParams.orderBy === 'amount' ? 'stake' : 'time',
                order_direction: searchParams.orderDirection || 'desc',
                page: currentPage,
                limit: limit,
                // ✅ Add user_id if needed
                // user_id: localStorage.getItem("user_id") || '',
            };

            console.log("📡 Fetching bets with params:", params);

            const response = await getBetListlive(params);
            console.log("✅ API Response:", response);

            let bets = [];
            let total = 0;
            let totalPagesCount = 1;
            let summaryData = null;

            // ✅ Handle all possible response structures
            if (response?.success) {
                bets = response.data || [];
                total = response.pagination?.total || 0;
                totalPagesCount = response.pagination?.totalPages || 1;
                summaryData = response.summary || null;
            } else if (response?.data?.success) {
                const result = response.data;
                bets = result.data || [];
                total = result.pagination?.total || 0;
                totalPagesCount = result.pagination?.totalPages || 1;
                summaryData = result.summary || null;
            } else if (response?.data) {
                const result = response.data;
                bets = result.data || result.bets || result.results || [];
                total = result.pagination?.total || result.total || bets.length;
                totalPagesCount = result.pagination?.totalPages || Math.ceil(total / limit) || 1;
                summaryData = result.summary || null;
            } else if (Array.isArray(response)) {
                bets = response;
                total = bets.length;
                totalPagesCount = Math.ceil(total / limit);
            } else {
                bets = [];
            }

            console.log("📊 Extracted data:", { betsCount: bets.length, total, totalPagesCount });

            // ✅ Map data to match table structure
            const mappedData = bets.map((item) => ({
                user: item.pl_id || item.user?.username || item.user_id || 'N/A',
                id: item.bet_id || item._id || 'N/A',
                date: item.bet_placed || item.created_at ?
                    moment(item.bet_placed || item.created_at).local().format('M/D/YYYY, h:mm:ss A') :
                    'N/A',
                ip: item.ip_address || item.ip || 'N/A',
                match: item.market || item.game_name || 'N/A',
                selection: item.selection || item.team || 'N/A',
                type: item.type || item.bet_on || 'N/A',
                odds: item.odds_req || item.odd || 0,
                stake: item.stake || 0,
                total: item.liability || 0,
                profit: item.profit_loss || 0,
            }));

            setBetData(mappedData);
            setTotalPages(totalPagesCount || 1);
            setTotalBets(total || mappedData.length);
            setSummary(summaryData);

        } catch (error) {
            console.error("❌ Fetch Error:", error);
            setBetData([]);
            setTotalPages(1);
            setTotalBets(0);
            setSummary(null);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchParams, limit]);

    // ✅ Fetch bets when dependencies change
    useEffect(() => {
        fetchBetList();
    }, [fetchBetList]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ Handle search - Reset to page 1
    const handleSearch = () => {
        setCurrentPage(1);
        // fetchBetList will be called automatically due to useEffect
    };

    // ✅ Handle reset - Reset all filters and page
    const handleReset = () => {
        setSearchParams({
            sport: 'all',
            marketType: 'all',
            orderBy: 'amount',
            orderDirection: 'desc',
            betStatus: 'active'
        });
        setCurrentPage(1);
        // fetchBetList will be called automatically due to useEffect
    };

    // Pagination handlers
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ✅ Go to specific page
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div>
            <div className="find-member-sec py-3">
                <div className="container-fluid">
                    <Heading title="BetListLive" />
                    <div className="inner-wrapper">
                        <div className="common-container">
                            <form className="bet_status p-0 bet-list-live d-flex flex-column w-100 align-items-start">
                                <div className="bet_outer betlist-n w-100">
                                    <div className="bet-sec">
                                        <label className="form-label">Select Sport:</label>
                                        <select
                                            name="sport"
                                            aria-label="Default select example"
                                            className="small_select form-select"
                                            value={searchParams.sport}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="all">All</option>
                                            <option value="4">Cricket</option>
                                            <option value="2">Tennis</option>
                                            <option value="1">Soccer</option>
                                            <option value="3">Casino</option>
                                            <option value="4339">Greyhound</option>
                                            <option value="7">Horse</option>
                                        </select>
                                    </div>
                                    <div className="bet-sec">
                                        <label className="form-label">Select Market Type:</label>
                                        <select
                                            name="marketType"
                                            aria-label="Default select example"
                                            className="small_select form-select"
                                            value={searchParams.marketType}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="all">All</option>
                                            <option value="match_odds">Match Odds</option>
                                            <option value="bookmaker">Bookmaker</option>
                                            <option value="fancy">Fancy</option>
                                            <option value="betfair">Bet Fair</option>
                                            <option value="toss">Toss</option>
                                            <option value="lottery">Lottery</option>
                                        </select>
                                    </div>
                                    <div className="bet-sec">
                                        <label className="form-label">Order of display:</label>
                                        <select
                                            name="orderBy"
                                            aria-label="Default select example"
                                            className="small_select form-select"
                                            value={searchParams.orderBy}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="amount">Stake</option>
                                            <option value="timeInserted">Time</option>
                                        </select>
                                    </div>
                                    <div className="bet-sec bet-period">
                                        <label className="form-label">of</label>
                                        <select
                                            name="orderDirection"
                                            aria-label="Default select example"
                                            className="small_select form-select"
                                            value={searchParams.orderDirection}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                    </div>
                                    <div className="bet-sec">
                                        <label className="form-label">Bet Status:</label>
                                        <select
                                            name="betStatus"
                                            aria-label="Default select example"
                                            className="small_select form-select"
                                            value={searchParams.betStatus}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="all">All</option>
                                            <option value="settled">Settled</option>
                                            <option value="active">Active</option>
                                            <option value="unsettled">Unsettled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="betList-bottom">
                                    <div className="betlist_btn" style={{ display: "flex" }}>
                                        <button
                                            type="button"
                                            className="theme_dark_btn btn"
                                            style={{ marginRight: 10 }}
                                            onClick={handleSearch}
                                        >
                                            Search
                                        </button>
                                        <button
                                            type="button"
                                            className="theme_light_btn btn"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* ✅ Summary Section - Uncommented */}
                                    {summary && (
                                        <div className="summary-section mb-3 p-3 bg-light rounded">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <strong>Total Bets:</strong> {summary.totalBets || 0}
                                                </div>
                                                <div className="col-md-3">
                                                    <strong>Total Stake:</strong> {summary.totalStake || 0}
                                                </div>
                                                <div className="col-md-3">
                                                    <strong>Total Liability:</strong> {summary.totalLiability || 0}
                                                </div>
                                                <div className="col-md-3">
                                                    <strong>Total Profit/Loss:</strong> 
                                                    <span className={summary.totalLiability >= 0 ? 'text-success' : 'text-danger'}>
                                                        {summary.totalLiability || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="table-responsive">
                                        <table className="all-bets-dialog-tabel table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">PL ID</th>
                                                    <th scope="col">Bet ID</th>
                                                    <th scope="col">Bet placed</th>
                                                    <th scope="col">IP Address</th>
                                                    <th scope="col">Market</th>
                                                    <th scope="col">Selection</th>
                                                    <th scope="col">Type</th>
                                                    <th scope="col">Odds req.</th>
                                                    <th scope="col">Stake</th>
                                                    <th scope="col">Liability</th>
                                                    <th scope="col">Profit/Loss</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {betData.length > 0 ? (
                                                    betData.map((item, index) => {
                                                        const profit = Number(item.profit);
                                                        const rowStyle = {
                                                            backgroundColor: profit >= 0 ? "#72BBEF" : "#FAA9BA",
                                                        };

                                                        return (
                                                            <tr key={item.id || index} style={rowStyle}>
                                                                <td>{item.user}</td>
                                                                <td>{item.id}</td>
                                                                <td>{item.date}</td>
                                                                <td>{item.ip}</td>
                                                                <td className="text-start">{item.match}</td>
                                                                <td>{item.selection}</td>
                                                                <td>{item.type}</td>
                                                                <td>{item.odds}</td>
                                                                <td>{Number(item.stake || 0).toFixed(2)}</td>
                                                                <td>{Number(item.total || 0).toFixed(2)}</td>
                                                                <td>
                                                                    <span className={profit >= 0 ? "text-success" : "text-danger"}>
                                                                        {profit >= 0
                                                                            ? Number(profit).toFixed(2)
                                                                            : `-(${Math.abs(Number(profit)).toFixed(2)})`}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="11" className="text-center py-3">
                                                            <div className="text-muted">
                                                                No bets found. Please try different filters.
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* ✅ Pagination - Enhanced */}
                                    {betData.length > 0 && totalPages > 1 && (
                                        <div className="card-footer d-flex justify-content-between align-items-center">
                                            <span className="text-muted small">
                                                Showing {(currentPage - 1) * limit + 1} to{" "}
                                                {Math.min(currentPage * limit, totalBets)} of{" "}
                                                {totalBets} bets
                                            </span>

                                            <ul className="custom-pagination pagination mb-0">
                                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                                    <button className="page-link" onClick={handlePrev}>
                                                        &laquo;
                                                    </button>
                                                </li>

                                                {/* Show page numbers with ellipsis */}
                                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                    .filter(p => {
                                                        if (totalPages <= 7) return true;
                                                        if (p === 1 || p === totalPages) return true;
                                                        if (p >= currentPage - 1 && p <= currentPage + 1) return true;
                                                        return false;
                                                    })
                                                    .map((p, index, array) => {
                                                        // Add ellipsis
                                                        if (index > 0 && p - array[index - 1] > 1) {
                                                            return (
                                                                <li key={`ellipsis-${p}`} className="page-item disabled">
                                                                    <span className="page-link">…</span>
                                                                </li>
                                                            );
                                                        }
                                                        return (
                                                            <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                                                                <button className="page-link" onClick={() => goToPage(p)}>
                                                                    {p}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}

                                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                                    <button className="page-link" onClick={handleNext}>
                                                        &raquo;
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}

                                    {/* ✅ Show total count even with 1 page */}
                                    {betData.length > 0 && (
                                        <div className="text-muted mt-2 text-center" style={{ fontSize: '14px' }}>
                                            Showing {betData.length} bets | Page {currentPage} of {totalPages}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BetListLive;