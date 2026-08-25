import React, { useState, useEffect } from "react";
import { getMetchwiseReport } from "../Server/api";

export default function Profitlossreportsportswisedownline() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0
    });
    const [summary, setSummary] = useState({
        total_win_amount: 0,
        total_loss_amount: 0,
        total_stake: 0,
        total_profit: 0
    });

    // ✅ Helper functions for dates
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getYesterdayDate = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    };

    // ✅ Filter states - WITH DEFAULT DATES
    const [filters, setFilters] = useState({
        from_date: getYesterdayDate(),  // ✅ Default yesterday
        from_time: "00:00",             // ✅ Default time
        to_date: getTodayDate(),        // ✅ Default today
        to_time: "23:59",               // ✅ Default time
        search: "",
        sport_id: "",
        page: 1,
        limit: 50
    });

    // ✅ Auto fetch on component mount
    useEffect(() => {
        fetchData(filters);
    }, []);

    // Fetch data function
    const fetchData = async (filterParams = null) => {
        setLoading(true);
        setError(null);
        try {
            const params = filterParams || filters;

            const payload = {
                search: params.search || "",
                sport_id: params.sport_id || "",
                page: params.page || 1,
                limit: params.limit || 50
            };

            // ✅ Sirf tab dates bhejo jab empty na ho
            if (params.from_date && params.from_date.trim() !== "") {
                payload.from_date = params.from_date;
            }
            if (params.to_date && params.to_date.trim() !== "") {
                payload.to_date = params.to_date;
            }
            if (params.from_time && params.from_time.trim() !== "") {
                payload.from_time = params.from_time;
            }
            if (params.to_time && params.to_time.trim() !== "") {
                payload.to_time = params.to_time;
            }

            console.log("API Payload:", payload);
            const response = await getMetchwiseReport(payload);
            console.log("API Response:", response);

            if (response && response.data) {
                let responseData = [];
                let responsePagination = null;
                let responseSummary = null;

                // ✅ Extract data from response
                if (response.data && Array.isArray(response.data)) {
                    responseData = response.data;
                    responsePagination = response.pagination;
                    responseSummary = response.summary;
                } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    responseData = response.data.data;
                    responsePagination = response.data.pagination;
                    responseSummary = response.data.summary;
                } else if (Array.isArray(response)) {
                    responseData = response;
                }

                setData(responseData);

                if (responsePagination) {
                    setPagination(responsePagination);
                }

                if (responseSummary) {
                    setSummary({
                        total_win_amount: responseSummary.total_win_amount || 0,
                        total_loss_amount: responseSummary.total_loss_amount || 0,
                        total_stake: responseSummary.total_stake || 0,
                        total_profit: responseSummary.total_profit || 0
                    });
                }

                if (responsePagination && responsePagination.page) {
                    setFilters(prev => ({
                        ...prev,
                        page: responsePagination.page
                    }));
                }
            } else {
                setData([]);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleDateTimeChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: value,
            page: 1
        }));
    };

    // Handle Search
    const handleSearch = () => {
        if (!filters.from_date || !filters.to_date) {
            setError("Please select From and To dates");
            return;
        }
        const searchFilters = {
            ...filters,
            page: 1
        };
        setFilters(searchFilters);
        fetchData(searchFilters);
    };

    // Handle Reset
    const handleReset = () => {
        const emptyFilters = {
            from_date: getYesterdayDate(),  // ✅ Reset par bhi default dates
            from_time: "00:00",
            to_date: getTodayDate(),
            to_time: "23:59",
            search: "",
            sport_id: "",
            page: 1,
            limit: 50
        };
        setFilters(emptyFilters);
        fetchData(emptyFilters);  // ✅ Reset par bhi data fetch
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        const newFilters = {
            ...filters,
            page: newPage
        };
        setFilters(newFilters);
        fetchData(newFilters);
    };

    // Format currency
    const formatCurrency = (value) => {
        if (value === undefined || value === null) return "0.00";
        const num = parseFloat(value);
        if (isNaN(num)) return "0.00";
        if (num < 0) {
            return `(${Math.abs(num).toFixed(2)})`;
        }
        return num.toFixed(2);
    };

    // Get color class based on value
    const getColorClass = (value) => {
        if (value === undefined || value === null) return "";
        const num = parseFloat(value);
        if (isNaN(num)) return "";
        return num < 0 ? "text-danger" : "text-success";
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="allcommon">
            <section className="main-inner-outer py-4">
                <div className="container-fluid">
                    <div className="row">
                        <div className="db-sec">
                            <h2 className="common-heading">Profit/Loss Report by Downline</h2>
                        </div>
                        <div className="col-md-12">
                            <div className="inner-wrapper">
                                <form className="bet_status" onSubmit={(e) => e.preventDefault()}>
                                    <div className="row">
                                        <div className="col-xl-12 col-md-12">
                                            <div className="row">
                                                {/* From Date */}
                                                <div className="mb-lg-0 mb-2 flex-grow-0 pe-2 col-lg-3 col-sm-6">
                                                    <div className="bet-sec bet-period">
                                                        <label className="px-2 form-label">From</label>
                                                        <div className="form-group d-flex">
                                                            <input
                                                                type="date"
                                                                className="small_form_control form-control"
                                                                value={filters.from_date}
                                                                onChange={(e) => handleDateTimeChange('from_date', e.target.value)}
                                                                onKeyPress={handleKeyPress}
                                                            />
                                                            <input
                                                                placeholder="00:00"
                                                                type="time"
                                                                className="small_form_control form-control ms-2"
                                                                value={filters.from_time}
                                                                onChange={(e) => handleDateTimeChange('from_time', e.target.value)}
                                                                onKeyPress={handleKeyPress}
                                                                style={{ width: 80 }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* To Date */}
                                                <div className="mb-lg-0 mb-2 flex-grow-0 ps-2 col-lg-3 col-sm-6">
                                                    <div className="bet-sec bet-period">
                                                        <label className="px-2 form-label">To</label>
                                                        <div className="form-group d-flex">
                                                            <input
                                                                type="date"
                                                                className="small_form_control form-control"
                                                                value={filters.to_date}
                                                                onChange={(e) => handleDateTimeChange('to_date', e.target.value)}
                                                                onKeyPress={handleKeyPress}
                                                            />
                                                            <input
                                                                placeholder="00:00"
                                                                type="time"
                                                                className="small_form_control form-control ms-2"
                                                                value={filters.to_time}
                                                                onChange={(e) => handleDateTimeChange('to_time', e.target.value)}
                                                                onKeyPress={handleKeyPress}
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
                                                    className="theme_dark_btn btn btn-primary"
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

                        <div className="mt-2 col-lg-12 col-md-12 col-sm-12">
                            <section className="account-table w-100">
                                <div className="responsive transaction-history">
                                    {loading ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <div className="alert alert-danger m-3">{error}</div>
                                    ) : data && data.length > 0 ? (
                                        <>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Sport</th>
                                                        <th scope="col">Match Name</th>
                                                        <th scope="col">Match Date</th>
                                                        <th scope="col">Win Amount</th>
                                                        <th scope="col">Loss Amount</th>
                                                        <th scope="col">Total P/L</th>
                                                        <th scope="col">Players</th>
                                                        <th scope="col">Stake</th>
                                                    </tr>
                                                </thead>
                                                {/* <tbody>
                                                    {data.map((item, index) => (
                                                        <tr key={item.event_id || index}>
                                                            <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                                                            <td>
                                                                <span className="badge bg-primary">
                                                                    {item.game_name || '-'}
                                                                </span>
                                                            </td>
                                                            <td>{item.market_name || item.match_name || '-'}</td>
                                                            <td>{formatDate(item.match_start_date)}</td>
                                                            <td className="text-success">
                                                                {formatCurrency(item.admin_win_amount)}
                                                            </td>
                                                            <td className="text-danger">
                                                                {formatCurrency(item.admin_loss_amount)}
                                                            </td>
                                                            <td className={getColorClass(item.total_pl)}>
                                                                <strong>{formatCurrency(item.total_pl)}</strong>
                                                            </td>
                                                            <td>{item.no_of_players || 0}</td>
                                                            <td>{formatCurrency(item.total_stake)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody> */}
                                                <tbody>
                                                    {data.map((item, index) => {
                                                        // ✅ Safe calculation with fallback
                                                        const page = pagination?.page || 1;
                                                        const limit = pagination?.limit || 50;
                                                        const serialNo = (page - 1) * limit + index + 1;

                                                        return (
                                                            <tr key={item.event_id || index}>
                                                                <td>{serialNo}</td>
                                                                <td>

                                                                    {item.game_name || '-'}

                                                                </td>
                                                                <td>{item.market_name || item.match_name || '-'}</td>
                                                                <td>{formatDate(item.match_start_date)}</td>
                                                                <td className="text-success">
                                                                    {formatCurrency(item.admin_win_amount)}
                                                                </td>
                                                                <td className="text-danger">
                                                                    {formatCurrency(item.admin_loss_amount)}
                                                                </td>
                                                                <td className={getColorClass(item.total_pl)}>
                                                                    <strong>{formatCurrency(item.total_pl)}</strong>
                                                                </td>
                                                                <td>{item.no_of_players || 0}</td>
                                                                <td>{formatCurrency(item.total_stake)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                                {/* Summary Row */}
                                                <tfoot>
                                                    <tr className="table-active fw-bold">
                                                        <td colSpan="4" className="text-end">Total</td>
                                                        <td className="text-success">
                                                            {formatCurrency(summary.total_win_amount)}
                                                        </td>
                                                        <td className="text-danger">
                                                            {formatCurrency(summary.total_loss_amount)}
                                                        </td>
                                                        <td className={getColorClass(summary.total_profit)}>
                                                            {formatCurrency(summary.total_profit)}
                                                        </td>
                                                        <td>-</td>
                                                        <td>
                                                            {formatCurrency(summary.total_stake)}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>

                                            {/* Pagination */}
                                            {pagination.totalPages > 0 && (
                                                <div className="bottom-pagination">
                                                    <ul role="navigation" aria-label="Pagination">
                                                        <li className={`previous ${pagination.page <= 1 ? 'disabled' : ''}`}>
                                                            <a
                                                                className=""
                                                                tabIndex={pagination.page <= 1 ? -1 : 0}
                                                                role="button"
                                                                aria-disabled={pagination.page <= 1}
                                                                aria-label="Previous page"
                                                                rel="prev"
                                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                                style={{ cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer' }}
                                                            >
                                                                &lt;{" "}
                                                            </a>
                                                        </li>
                                                        <li className="page-info">
                                                            <span>
                                                                Page {pagination.page} of {pagination.totalPages}
                                                                ({pagination.total_records || pagination.total || 0} records)
                                                            </span>
                                                        </li>
                                                        <li className={`next ${pagination.page >= pagination.totalPages ? 'disabled' : ''}`}>
                                                            <a
                                                                className=""
                                                                tabIndex={pagination.page >= pagination.totalPages ? -1 : 0}
                                                                role="button"
                                                                aria-disabled={pagination.page >= pagination.totalPages}
                                                                aria-label="Next page"
                                                                rel="next"
                                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                                style={{ cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
                                                            >
                                                                {" "}
                                                                &gt;
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Sport</th>
                                                    <th scope="col">Match Name</th>
                                                    <th scope="col">Match Date</th>
                                                    <th scope="col">Win Amount</th>
                                                    <th scope="col">Loss Amount</th>
                                                    <th scope="col">Total P/L</th>
                                                    <th scope="col">Players</th>
                                                    <th scope="col">Stake</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td colSpan="9" className="text-center py-4">
                                                        <span>No records found for the selected date range.</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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