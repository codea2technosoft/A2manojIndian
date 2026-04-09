import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaCalendarAlt, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

// Helper functions
function currency(n) {
    const num = parseFloat(n);
    if (isNaN(num)) return "0.00";
    return num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatDateTime(date) {
    return new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

// Helper to format date to YYYY-MM-DD
function formatDateForAPI(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Main Component
export default function AccountStatement() {
    // API Configuration
    const baseUrl = process.env.REACT_APP_BACKEND_API;

    // State
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [ledgerData, setLedgerData] = useState([]);
    const [summary, setSummary] = useState({
        credit: 0,
        debit: 0,
        balance: 0
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 10,
        total_pages: 1,
        from: 1,
        to: 0
    });

    // Filter States
    const [filters, setFilters] = useState({
        payment_type: "all",
        from_date: "",
        to_date: "",
        page: "1",
        limit: "50"
    });

    // Use a ref to prevent initial double call
    const isInitialMount = useRef(true);

    // Get admin_id from localStorage
    const adminId = localStorage.getItem("admin_id") || localStorage.getItem("user_id") || "";

    // Fetch ledger data
    const fetchLedgerData = async () => {
        if (!adminId) {
            console.error("Admin/User ID not found");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Validate date range
            if (filters.from_date && filters.to_date) {
                const fromDate = new Date(filters.from_date);
                const toDate = new Date(filters.to_date);
                if (fromDate > toDate) {
                    alert("From date cannot be after To date");
                    return;
                }
            }

            const requestData = {
                admin_id: adminId,
                payment_type: filters.payment_type === "all" ? "" : filters.payment_type,
                page: parseInt(filters.page),
                limit: parseInt(filters.limit)
            };

            // Add date filters if provided
            if (filters.from_date) {
                requestData.from_date = formatDateForAPI(filters.from_date);
            }
            if (filters.to_date) {
                requestData.to_date = formatDateForAPI(filters.to_date);
            }

            console.log("Request Data:", requestData); // Debug log

            const res = await axios.post(`${baseUrl}/get-my-ledger`, requestData);

            console.log("API Response:", res.data); // Debug log

            if (res.data?.success) {
                setLedgerData(res.data.data?.data || []);
                setSummary({
                    credit: res.data.lena || 0,
                    debit: res.data.dena || 0,
                    balance: res.data.balance || 0
                });

                // Set pagination data from API response
                const apiData = res.data.data;
                setPagination({
                    current_page: res.data.current_page || 1,
                    total: apiData?.total || 0,
                    per_page: apiData?.per_page || 10,
                    total_pages: Math.ceil((apiData?.total || 0) / (apiData?.per_page || 10)),
                    from: apiData?.from || 1,
                    to: apiData?.to || 0
                });
            } else {
                setLedgerData([]);
                setSummary({ credit: 0, debit: 0, balance: 0 });
                setPagination({
                    current_page: 1,
                    total: 0,
                    per_page: 10,
                    total_pages: 1,
                    from: 1,
                    to: 0
                });
                console.log("API returned unsuccessful:", res.data);
            }
        } catch (error) {
            console.error("Error fetching ledger data:", error);
            setLedgerData([]);
            setSummary({ credit: 0, debit: 0, balance: 0 });
            setPagination({
                current_page: 1,
                total: 0,
                per_page: 10,
                total_pages: 1,
                from: 1,
                to: 0
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch data only when filters change, not on initial mount
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        fetchLedgerData();
    }, [filters.page, filters.limit, filters.payment_type]);

    // Initial fetch with a slight delay
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLedgerData();
        }, 100);
        return () => clearTimeout(timer);
    }, [adminId]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key !== "page" ? "1" : value
        }));
    };

    // Apply filters for dates (manual trigger)
    const applyFilters = () => {
        // Reset to page 1 when applying date filters
        setFilters(prev => ({ ...prev, page: "1" }));

        // Trigger fetch after a short delay
        setTimeout(() => {
            fetchLedgerData();
        }, 100);
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            payment_type: "all",
            from_date: "",
            to_date: "",
            page: "1",
            limit: "10"
        });

        // Fetch data after reset
        setTimeout(() => {
            fetchLedgerData();
        }, 100);
    };

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            setFilters(prev => ({ ...prev, page: newPage.toString() }));
        }
    };

    const navigate = useNavigate();

    // Format amount with color
    const renderAmount = (amount, isCredit = true) => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return "0.00";

        const color = numAmount === 0 ? "text-muted" :
            isCredit ? "text-success" : "text-danger";

        return (
            <span className={color} style={{ fontWeight: "bold" }}>
                {currency(numAmount)}
            </span>
        );
    };

    // Format balance with color
    const renderBalance = (balance) => {
        const numBalance = parseFloat(balance);
        if (isNaN(numBalance)) return "0.00";

        const color = numBalance === 0 ? "text-muted" :
            numBalance > 0 ? "text-success" : "text-danger";

        return (
            <span className={color} style={{ fontWeight: "bold" }}>
                {currency(numBalance)}
            </span>
        );
    };



    const handleView = (adminId, eventId, _id) => {
        localStorage.setItem("admin_idviev", adminId);
        localStorage.setItem("event_idview", eventId);
        localStorage.setItem("_idview", _id);
        navigate("/ViewHisttory");
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        const { current_page, total_pages } = pagination;

        if (total_pages <= maxPagesToShow) {
            for (let i = 1; i <= total_pages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, current_page - Math.floor(maxPagesToShow / 2));
            let endPage = startPage + maxPagesToShow - 1;

            if (endPage > total_pages) {
                endPage = total_pages;
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    return (
        <section className="account_statement">
            <button
                className="backtomenu"
                onClick={() => navigate("/indexpage")}
            >
                Back To Main Menu
            </button>
            <div className="container-fluid">
                {/* Header */}
                <div className="header_page d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0">MY LEDGER</h3>

                    {/* फ़िल्टर्स टॉगल बटन */}
                    {/* <div
                        className="p-2 bg-dark text-white d-flex align-items-center justify-content-between"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <div className="d-flex align-items-center">
                            <FaFilter className="me-2" />
                            <span>Filters</span>
                        </div>
                        <div className="ms-2">
                            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                    </div> */}
                </div>

                {/* फ़िल्टर्स सेक्शन - क्लिक करने पर दिखेगा/छिपेगा */}
                {showFilters && (
                    <div className="card">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-2 mt-0">
                                    <label className="form-label text-dark">Transaction Type</label>
                                    <select
                                        className="form-select"
                                        value={filters.payment_type}
                                        onChange={(e) =>
                                            handleFilterChange("payment_type", e.target.value)
                                        }
                                    >
                                        <option value="all">All Transactions</option>
                                        <option value="credit">Credits Only</option>
                                        <option value="debit">Debits Only</option>
                                    </select>
                                </div>

                                <div className="col-md-2 mt-0">
                                    <label className="form-label text-dark">From Date</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaCalendarAlt />
                                        </span>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={filters.from_date}
                                            onChange={(e) =>
                                                setFilters(prev => ({ ...prev, from_date: e.target.value }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-2 mt-0">
                                    <label className="form-label text-dark">To Date</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <FaCalendarAlt />
                                        </span>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={filters.to_date}
                                            onChange={(e) =>
                                                setFilters(prev => ({ ...prev, to_date: e.target.value }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="col-md-2 mt-0">
                                    <label className="form-label text-dark">Rows per page</label>
                                    <select
                                        className="form-select"
                                        value={filters.limit}
                                        onChange={(e) =>
                                            handleFilterChange("limit", e.target.value)
                                        }
                                    >
                                        <option value="10">10</option>
                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </select>
                                </div>

                                <div className="col-md-1 mt-0 d-flex align-items-end">
                                    <div className="d-flex gap-2">
                                        <button
                                            className="refreshbutton"
                                            onClick={applyFilters}
                                            disabled={loading}
                                        >
                                            {loading ? "Applying..." : "Apply"}
                                        </button>
                                        <button
                                            className="backbutton"
                                            onClick={resetFilters}
                                            disabled={loading}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Bar */}
                <div className="card mb-3">
                    <div className="card-body py-2">
                        <div className="summary-bar d-flex border-0 justify-content-between align-items-center p-1">
                            <span className="credit-cell text-success">LENA  <strong>{currency(summary.credit)}</strong></span>
                            <span className="debit-cell text-danger">DENA  <strong>{currency(summary.debit)}</strong></span>
                            <span className="total-cell text-primary">BALANCE &nbsp;
                                <strong className={`mb-0 ${summary.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {currency(summary.balance)}
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle text-nowrap w-100 custom-table mb-0">
                                <colgroup>
                                    <col style={{ width: "50px" }} />
                                    <col style={{ width: "150px" }} />
                                    <col style={{ width: "200px" }} />
                                    <col />
                                    <col style={{ width: "100px" }} />
                                    <col style={{ width: "100px" }} />
                                    <col style={{ width: "100px" }} />
                                </colgroup>

                                <thead className="table-dark">
                                    <tr>
                                        <th className="text-center text-white">#</th>
                                        <th className="text-center text-white">Date & Time</th>
                                        <th className="text-center text-white">Event</th>
                                        <th className="text-center text-white">Description</th>
                                        <th className="text-center text-white">Winner</th>
                                        <th className="text-center text-white">Credit (Lena)</th>
                                        <th className="text-center text-white">Debit (Dena)</th>
                                        <th className="text-center text-white">Balance (Hisaab)</th>
                                        <th className="text-center text-white">View</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4">
                                                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                Loading ledger data...
                                            </td>
                                        </tr>
                                    ) : ledgerData.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="text-center py-4 text-muted">
                                                No ledger transactions found
                                            </td>
                                        </tr>
                                    ) : (
                                        ledgerData.map((item, index) => (
                                            <tr key={item._id || index}>
                                                <td className="text-center">
                                                    {(pagination.current_page - 1) * pagination.per_page + index + 1}
                                                </td>
                                                <td className="text-center">
                                                    {formatDateTime(item.created_at)}
                                                </td>
                                                <td className="text-center">
                                                    {item.comment}
                                                </td>
                                                <td className="text-start">
                                                    <div>
                                                        <strong>{item.remarks}</strong>
                                                        <div className="text-muted small">
                                                            {item.comment || "No description"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    {item.winner || "N/A"}
                                                </td>
                                                <td className="text-center">
                                                    {renderAmount(item.credit, true)}
                                                </td>
                                                <td className="text-center">
                                                    {renderAmount(item.debit, false)}
                                                </td>
                                                <td className="text-center">
                                                    {renderBalance(item.balance || 0)}
                                                </td>
                                                <td>
                                                    {item.winner && (
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleView(item.admin_id, item.event_id, item._id)}
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    )}
                                                </td>




                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {!loading && ledgerData.length > 0 && pagination.total > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <small className="text-muted">
                                Showing {pagination.from || 1} to {pagination.to || pagination.total} of{" "}
                                {pagination.total} entries
                            </small>
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page === 1}
                                    >
                                        Previous
                                    </button>
                                </li>

                                {getPageNumbers().map((pageNum) => (
                                    <li
                                        key={pageNum}
                                        className={`page-item ${pagination.current_page === pageNum ? 'active' : ''}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${pagination.current_page === pagination.total_pages ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page === pagination.total_pages}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        {/* <div className="text-muted d-none d-md-block">
                            Page {pagination.current_page} of {pagination.total_pages}
                        </div> */}
                    </div>
                )}

                {/* Footer Summary */}
                <div className="mt-3 text-center">
                    <small className="text-muted">
                        Data as of {new Date().toLocaleString()}
                    </small>
                </div>
            </div>
        </section>
    );
}