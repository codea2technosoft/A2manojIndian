import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaSortDown,
  FaRedoAlt,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import "./AccountStatement.css";
import { useNavigate } from "react-router-dom";

// ------------------- HELPER FUNCTIONS -------------------
function currency(n) {
  if (n === undefined || n === null) return "0.00";
  return parseFloat(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
function toDate(d) {
  return typeof d === "string" ? new Date(d + "T00:00:00") : d;
}
function isValid(s) {
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}
// ------------------- MAIN COMPONENT -------------------

export default function AccountStatement() {
  const [activeTab, setActiveTab] = useState("all");
  const [showMobile, setShowMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  console.warn("setCurrentPage0111",setCurrentPage)
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Helper to get date in MM-DD-YYYY format
  const formatDateForAPI = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  // Get today's date
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Calculate date 1 month ago
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  const oneMonthAgoStr = oneMonthAgo.toISOString().slice(0, 10);

  // Default values - last 1 month
  const defaultFrom = oneMonthAgoStr;
  const defaultTo = todayStr;

  // const [fromDate, setFromDate] = useState(defaultFrom);
  // const [toDateState, setToDate] = useState(defaultTo);
  const [fromDate, setFromDate] = useState();
  const [toDateState, setToDate] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [applied, setApplied] = useState({
    from: defaultFrom,
    to: defaultTo,
    size: 50,
  });

  const [allData, setAllData] = useState([]);
  const [plData, setPlData] = useState([]);
  const [accountData, setAccountData] = useState([]);

  const [plSummary, setPlSummary] = useState({
    lena: 0,
    dena: 0,
    balance: 0
  });

  const [accountSummary, setAccountSummary] = useState({
    credit: 0,
    debit: 0,
    total: 0
  });

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const baseUrl = process.env.REACT_APP_BACKEND_API;
  const userId = localStorage.getItem("user_id");
  const admin_id = localStorage.getItem("admin_id");

  // ------------------- FETCH ALL TRANSACTIONS -------------------
  const fetchAllData = useCallback(async () => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const startDate = formatDateForAPI(applied.from);
      const endDate = formatDateForAPI(applied.to);

      const params = {
        user_id: userId,
        admin_id: admin_id,
        start_date: startDate,
        end_date: endDate,
        page: currentPage,
        limit: applied.size,
      };

      const res = await axios.post(`${baseUrl}/all-statement`, params);

      if (res.data.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setAllData(list);
        setTotalItems(res.data.pagination?.total_records || list.length);
        setTotalPages(res.data.pagination?.total_pages || 1);
      } else {
        setAllData([]);
        setTotalItems(0);
        setTotalPages(1);
        setError(res.data.message || "No data found");
      }
    } catch (err) {
      console.error("Fetch All Error:", err);
      setError("Network error. Try again.");
      setAllData([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, userId, admin_id, applied, currentPage]);

  // ------------------- FETCH P&L DATA -------------------
// ------------------- FETCH P&L DATA -------------------
const fetchPLData = useCallback(async () => {
  if (!userId) {
    setError("User not logged in");
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const startDate = formatDateForAPI(applied.from);
    const endDate = formatDateForAPI(applied.to);

    const params = {
      user_id: userId,
      admin_id: admin_id,
      start_date: startDate,
      end_date: endDate,
      page: currentPage,
      limit: applied.size,
    };

    const res = await axios.post(`${baseUrl}/user-profit-loss`, params);

    if (res.data.success) {
      // Set P&L summary if available
      setPlSummary({
        lena: res.data.lena || 0,
        dena: res.data.dena || 0,
        balance: res.data.balance || 0
      });

      // Get the data array
      const list = Array.isArray(res.data.data?.data) 
        ? res.data.data.data 
        : (Array.isArray(res.data.data) 
          ? res.data.data 
          : []);

      setPlData(list);

      // CORRECTED: Use pagination from res.data.pagination
      if (res.data.pagination) {
        setTotalItems(res.data.pagination.total_records || 0);
        setTotalPages(res.data.pagination.total_pages || 1);
      } else if (res.data.data?.pagination) {
        // Fallback if pagination is nested in data
        setTotalItems(res.data.data.pagination.total_records || 0);
        setTotalPages(res.data.data.pagination.total_pages || 1);
      } else {
        // Default fallback
        setTotalItems(list.length);
        setTotalPages(1);
      }
    } else {
      setPlData([]);
      setPlSummary({ lena: 0, dena: 0, balance: 0 });
      setTotalItems(0);
      setTotalPages(1);
      setError(res.data.message || "No P&L data found");
    }
  } catch (err) {
    console.error("P&L Fetch Error:", err);
    setError("Network error while fetching P&L data.");
    setPlData([]);
    setPlSummary({ lena: 0, dena: 0, balance: 0 });
    setTotalItems(0);
    setTotalPages(1);
  } finally {
    setLoading(false);
  }
}, [baseUrl, userId, admin_id, applied, currentPage]);

  // ------------------- FETCH ACCOUNT DATA -------------------
  const fetchAccountData = useCallback(async () => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const startDate = formatDateForAPI(applied.from);
      const endDate = formatDateForAPI(applied.to);

      const params = {
        user_id: userId,
        admin_id: admin_id,
        start_date: startDate,
        end_date: endDate,
        page: currentPage,
        limit: applied.size,
      };

      const res = await axios.post(`${baseUrl}/get-statement-user`, params);

      if (res.data.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setAccountData(list);

        // Calculate account summary
        let credit = 0;
        let debit = 0;

        list.forEach(t => {
          const amount = parseFloat(t.amount) || 0;
          const isCredit = t.type === "deposit" || t.type === "bonus" || t.type === "commission";
          const isDebit = t.type === "withdraw" || t.type === "transfer";

          if (isCredit) {
            credit += amount;
          } else if (isDebit) {
            debit += amount;
          }
        });

        setAccountSummary({
          credit,
          debit,
          total: credit - debit
        });

        setTotalItems(res.data.pagination?.total_records || list.length);
        setTotalPages(res.data.pagination?.total_pages || 1);
      } else {
        setAccountData([]);
        setAccountSummary({ credit: 0, debit: 0, total: 0 });
        setError(res.data.message || "No account data found");
      }
    } catch (err) {
      console.error("Account Fetch Error:", err);
      setError("Network error while fetching account data.");
      setAccountData([]);
      setAccountSummary({ credit: 0, debit: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  }, [baseUrl, userId, admin_id, applied, currentPage]);

  // Fetch data when dependencies change
  useEffect(() => {
    switch (activeTab) {
      case "all":
        fetchAllData();
        break;
      case "pl":
        fetchPLData();
        break;
      case "account":
        fetchAccountData();
        break;
      default:
        fetchAllData();
    }
  }, [activeTab, fetchAllData, fetchPLData, fetchAccountData]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [applied]);

  // -------------------- APPLY FILTERS -----------------------
  const applyFilters = () => {
    const newFrom = fromDate || defaultFrom;
    const newTo = toDateState || defaultTo;

    setApplied({
      from: newFrom,
      to: newTo,
      size: pageSize,
    });
  };

  const resetFilters = () => {
    setFromDate(defaultFrom);
    setToDate(defaultTo);
    setPageSize(10);
    setApplied({
      from: defaultFrom,
      to: defaultTo,
      size: 50,
    });
  };

  // ----------------- PAGINATION ------------------
  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + max - 1);

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Format time for display
  const formatDisplayTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return "";
    }
  };

  // Calculate rows for "all" tab - EXACT API FIELDS
  const rows = useMemo(() => {
    if (activeTab !== "all") return [];

    return allData.map((t, idx) => {
      const sn = (currentPage - 1) * applied.size + idx + 1;

      return {
        sn,
        id: t._id || idx,
        date: formatDisplayDate(t.date),
        description: t.description || "N/A",
        prev_balance: t.prev_balance || 0,
        credit: t.credit || 0,
        debit: t.debit || 0,
        commission: t.commission || 0,
        balance: t.balance || 0
      };
    });
  }, [allData, activeTab, currentPage, applied]);

  const handleTabChange = (tab) => {
  setActiveTab(tab);
  setCurrentPage(1);
};


  // ----------------- RENDER ------------------
  return (
    <section className="account_statement">
      <div className="container-fluid">
        <button
          className="backtomenu"
          onClick={() => navigate("/indexpage")}
        >
          Back To Main Menu
        </button>
        <div className="header_page">
          <h3>MY ACCOUNT STATEMENT</h3>
        </div>

        {error && (
          <div className="alert alert-danger m-3">
            {error}
            <button
              className="btn-close float-end"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

      <div className="tabs_account d-flex gap-2">
  <div
    className={activeTab === "all" ? "tab_item active" : "tab_item"}
    onClick={() => handleTabChange("all")}
  >
    All
  </div>

  <div
    className={activeTab === "pl" ? "tab_item active" : "tab_item"}
    onClick={() => handleTabChange("pl")}
  >
    P&amp;L
  </div>

  <div
    className={activeTab === "account" ? "tab_item active" : "tab_item"}
    onClick={() => handleTabChange("account")}
  >
    Account
  </div>
</div>


        <div className="tab_content">
          {/* ALL TAB */}
          {activeTab === "all" && (
            <div className="card border-0 mt-2">
              <div className="card-header w-100 p-2">
                {/* Desktop Filters */}
                <div className="d-none d-md-flex w-100 align-items-center">
                  <div className="w-100 d-flex textw-hiteall align-items-end gap-2 justify-content-between">
                    <div className="form-group mb-0 position-relative">
                      <label className="text-whiteall">From:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control text-white"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          // max={toDateState || todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group mb-0 position-relative">
                      <label className="text-whiteall">To:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control text-white"
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          // min={fromDate}
                          // max={todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group mb-0 position-relative">
                      <label className="text-whiteall">Show:</label>
                      <div className="input-icon">
                        <select
                          className="form-control text-white"
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="refreshbuttonnew"
                        onClick={applyFilters}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Go"}
                      </button>
                      <button
                        className="refreshbuttonnew"
                        onClick={resetFilters}
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="d-flex align-items-center d-md-none justify-content-between w-100">
                  <div className="title">
                    <h3 className="text-white mb-0">Account Statement</h3>
                  </div>
                  <button
                    className="fillterbutton_new"
                    onClick={() => setShowMobile(!showMobile)}
                  >
                    <FaFilter /> Filters
                  </button>
                </div>

                {/* Mobile Filters Panel */}
                {showMobile && (
                  <div className="d-md-none d-flex flex-wrap gap-2 p-2 align-items-end border rounded bg-white">
                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <label>From:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          // max={toDateState || todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <label>To:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control"
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          // min={fromDate}
                          // max={todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <label>Show:</label>
                      <div className="input-icon">
                        <select
                          className="form-control"
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown className="input-icon-icon" />
                      </div>
                    </div>
                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <div className="d-flex gap-2 flex-colummobile">
                        <button
                          className="refreshbuttonnew"
                          onClick={applyFilters}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Go"}
                        </button>
                        <button
                          className="refreshbuttonnew"
                          onClick={resetFilters}
                          disabled={loading}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <div className="loader-6">
                    <div className="set-one">
                      <div className="circle"></div>
                      <div className="circle circle1"></div>
                    </div>
                    <div className="set-two">
                      <div className="circle circle2"></div>
                      <div className="circle circle3"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table border="1" cellPadding="8" className="table mb-0 table-bordered" width="100%">
                        <thead className="thead-dark">
                          <tr>
                            <th>S.NO</th>
                            <th>Date</th>
                            <th>Description </th>
                            <th>Prev Balance</th>
                            <th>Credit</th>
                            <th>Debit</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.length === 0 ? (
                            <tr>
                              <td colSpan="8" className="text-center py-4">
                                No transactions in the selected range.
                              </td>
                            </tr>
                          ) : (
                            rows.map((r) => (
                              <tr key={r.id}>
                                <td>{r.sn}</td>
                                <td>{r.date}</td>
                                <td className="text-start">{r.description}</td>
                                <td className="text-end">₹{currency(r.prev_balance)}</td>
                                <td className={`text-end ${r.credit > 0 ? "text-success fw-bold" : ""}`}>
                                  {r.credit > 0 ? `+ ₹${currency(r.credit)}` : "—"}
                                </td>
                                <td className={`text-end ${r.debit > 0 ? "text-danger fw-bold" : ""}`}>
                                  {r.debit > 0 ? `- ₹${currency(r.debit)}` : "—"}
                                </td>
                                {/* <td className="text-end">
                                  {r.commission > 0 ? `₹${currency(r.commission)}` : "—"}
                                </td> */}
                                <td className="text-end fw-bold">₹{currency(r.balance)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between mt-3 p-3">
                        <p className="text-muted mb-0">
                          Showing {(currentPage - 1) * applied.size + 1} to{" "}
                          {Math.min(currentPage * applied.size, totalItems)} of{" "}
                          {totalItems} entries
                        </p>

                        <ul className="pagination mb-0">
                          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <FaChevronLeft />
                            </button>
                          </li>

                          {getPageNumbers().map((p) => (
                            <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                              <button className="page-link" onClick={() => goToPage(p)}>
                                {p}
                              </button>
                            </li>
                          ))}

                          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => goToPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <FaChevronRight />
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* P&L TAB */}
          {activeTab === "pl" && (
            <div className="card border-0 mt-2">
              <div className="card-header w-100 p-2 mb-2">
                {/* Desktop Filters */}
                <div className="d-none d-md-flex w-100 align-items-center">
                  <div className="w-100 d-flex textw-hiteall align-items-end gap-2 justify-content-between">
                    <div className="form-group mb-0 position-relative">
                      <label className="text-whiteall">From:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control text-white"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          max={toDateState || todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group mb-0 position-relative">
                      <label className="text-whiteall">To:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control text-white"
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          min={fromDate}
                          max={todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group mb-0 position-relative">
                      <label className="text-whiteall">Show:</label>
                      <div className="input-icon">
                        <select
                          className="form-control text-white"
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="gobutton fillterbutton"
                        onClick={applyFilters}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Go"}
                      </button>
                      <button
                        className="resetbutton fillterbutton"
                        onClick={resetFilters}
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="d-flex align-items-center d-md-none justify-content-between w-100">
                  <div className="title">
                    <h3 className="text-white mb-0">Profit & Loss Statement</h3>
                  </div>
                  <button
                    className="fillterbutton_new"
                    onClick={() => setShowMobile(!showMobile)}
                  >
                    <FaFilter /> Filters
                  </button>
                </div>

                {/* Mobile Filters Panel */}
                {showMobile && (
                  <div className="d-md-none mt-2 d-flex flex-wrap gap-2 p-2 align-items-end border rounded bg-white">
                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <label>From:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          max={toDateState || todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <label>To:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control"
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          min={fromDate}
                          max={todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <label>Show:</label>
                      <div className="input-icon">
                        <select
                          className="form-control"
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown className="input-icon-icon" />
                      </div>
                    </div>
                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <div className="d-flex gap-2 flex-colummobile">
                        <button
                          className="refreshbuttonnew"
                          onClick={applyFilters}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Go"}
                        </button>
                        <button
                          className="refreshbuttonnew"
                          onClick={resetFilters}
                          disabled={loading}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <div className="loader-6 py-5">
                    <div className="set-one">
                      <div className="circle"></div>
                      <div className="circle circle1"></div>
                    </div>
                    <div className="set-two">
                      <div className="circle circle2"></div>
                      <div className="circle circle3"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-bordered align-middle text-nowrap w-100">
                        <thead className="thead-dark">
                          <tr>
                            <th className="text-start">Date & Time</th>
                            <th className="text-start">Description</th>
                            <th className="text-start">Prev.Bal</th>
                            <th className="text-center">Credit</th>
                            <th className="text-center">Debit</th>
                            {/* <th className="text-center">Commission</th> */}
                            <th className="text-center">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plData.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center py-4 text-muted">
                                No P&L data available
                              </td>
                            </tr>
                          ) : (
                            plData.map((t, i) => {
                              const sn = (currentPage - 1) * applied.size + i + 1;
                              const credit = parseFloat(t.credit) || 0;
                              const debit = parseFloat(t.debit) || 0;
                              const balance = parseFloat(t.balance) || 0;

                              return (
                                <tr key={t._id || i}>
                                  <td>
                                    <div>{formatDisplayDate(t.created_at)}</div>
                                    <small className="text-muted">{formatDisplayTime(t.created_at)}</small>
                                  </td>
                                  <td>
                                    {t.win_loss || "N/A"} //
                                    {t.full_team_name || t.remark}
                                  </td>
                                  <td className={`text-end `}>
                                    {t.before_balance_from}
                                  </td>
                                  <td
                                    className={`text-end ${t.win_loss === "WIN" ? "text-success fw-bold" : "text-secondary"
                                      }`}
                                  >
                                    {t.win_loss === "WIN" ? t.amount : "-"}
                                  </td>

                                  <td
                                    className={`text-end ${t.win_loss === "LOSS" ? "text-danger fw-bold" : "text-secondary"
                                      }`}
                                  >
                                    {t.win_loss === "LOSS" ? t.amount : "-"}
                                  </td>

                                  {/* <td className="text-center">{t.bet_comsiinos_amount}</td> */}
                                  <td className="text-center">{t.wallet_amount || "N/A"}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination for P&L */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between mt-3 p-3">
                        <p className="text-muted mb-0">
                          Showing {(currentPage - 1) * applied.size + 1} to{" "}
                          {Math.min(currentPage * applied.size, totalItems)} of{" "}
                          {totalItems} entries
                        </p>

                        <ul className="pagination mb-0">
                          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <FaChevronLeft />
                            </button>
                          </li>

                          {getPageNumbers().map((p) => (
                            <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                              <button className="page-link" onClick={() => goToPage(p)}>
                                {p}
                              </button>
                            </li>
                          ))}

                          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => goToPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <FaChevronRight />
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="card border-0 mt-2">
              <div className="card-header w-100 p-2 mb-2">
                {/* Desktop Filters */}
                <div className="d-none d-md-flex w-100 align-items-center">
                  <div className="w-100 d-flex textw-hiteall align-items-end gap-2 justify-content-between">
                    <div className="form-group mb-0 position-relative">
                      <label className="text-whiteall">From:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control text-white"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          max={toDateState || todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group mb-0 position-relative">
                      <label className="text-whiteall">To:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control text-white"
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          min={fromDate}
                          max={todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group mb-0 position-relative">
                      <label className="text-whiteall">Show:</label>
                      <div className="input-icon">
                        <select
                          className="form-control text-white"
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="gobutton fillterbutton"
                        onClick={applyFilters}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Go"}
                      </button>
                      <button
                        className="resetbutton fillterbutton"
                        onClick={resetFilters}
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="d-flex align-items-center d-md-none justify-content-between w-100">
                  <div className="title">
                    <h3 className="text-white mb-0">Account Summary</h3>
                  </div>
                  <button
                    className="fillterbutton_new"
                    onClick={() => setShowMobile(!showMobile)}
                  >
                    <FaFilter /> Filters
                  </button>
                </div>

                {/* Mobile Filters Panel */}
                {showMobile && (
                  <div className="d-md-none mt-2 d-flex flex-wrap gap-2 p-2 align-items-end border rounded bg-white">
                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <label>From:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          max={toDateState || todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <label>To:</label>
                      <div className="input-icon">
                        <input
                          type="date"
                          className="form-control"
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          min={fromDate}
                          max={todayStr}
                        />
                        <FaCalendarAlt className="input-icon-icon" />
                      </div>
                    </div>

                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <label>Show:</label>
                      <div className="input-icon">
                        <select
                          className="form-control"
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown className="input-icon-icon" />
                      </div>
                    </div>
                    <div className="form-group width_50 mb-2 position-relative mb-0">
                      <div className="d-flex gap-2 flex-colummobile">
                        <button
                          className="refreshbuttonnew"
                          onClick={applyFilters}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Go"}
                        </button>
                        <button
                          className="refreshbuttonnew"
                          onClick={resetFilters}
                          disabled={loading}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <div className="loader-6 py-5">
                    <div className="set-one">
                      <div className="circle"></div>
                      <div className="circle circle1"></div>
                    </div>
                    <div className="set-two">
                      <div className="circle circle2"></div>
                      <div className="circle circle3"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-bordered align-middle text-nowrap w-100 custom-table">
                        <thead className="table-dark">
                          <tr>
                            <th className="text-start text-white">Date</th>
                            <th className="text-start text-white">Category</th>
                            <th className="text-center text-white">From/To</th>
                            <th className="text-center text-white">Credit</th>
                            <th className="text-center text-white">Debit</th>
                            <th className="text-center text-white">Balance</th>
                            <th className="text-center text-white">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accountData.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center py-4 text-muted">
                                No transactions available
                              </td>
                            </tr>
                          ) : (
                            accountData.map((t, i) => {
                              const sn = (currentPage - 1) * applied.size + i + 1;
                              const isCredit = t.type === "deposit" || t.type === "bonus" || t.type === "commission";
                              const isDebit = t.type === "withdraw" || t.type === "transfer";
                              const amount = parseFloat(t.amount) || 0;
                              const wallet_amount = parseFloat(t.wallet_amount) || 0;
                              const balance = t.after_balance_to || t.after_balance_from || 0;

                              return (
                                <tr key={t._id || i}>
                                  <td>{formatDisplayDate(t.created_at)}</td>
                                  <td>
                                    <span className={`fw-bold ${t.type === "deposit" ? "text-success" :
                                      t.type === "withdraw" ? "text-danger" :
                                        t.type === "bonus" ? "text-warning" :
                                          t.type === "commission" ? "text-info" :
                                            t.type === "transfer" ? "text-primary" : "text-muted"
                                      }`}>
                                      {t.type?.charAt(0).toUpperCase() + t.type?.slice(1) || "N/A"}
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    {t.from_username || t.to_username || "System"}
                                  </td>
                                  <td className="text-center text-success">
                                    {isCredit ? `₹${currency(amount)}` : "—"}
                                  </td>
                                  <td className="text-center text-danger">
                                    {isDebit ? `₹${currency(amount)}` : "—"}
                                  </td>
                                  <td className="text-center">₹{currency(wallet_amount)}</td>
                                  <td className="text-center">{t.remark || "N/A"}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination for Account */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between mt-3 p-3">
                        <p className="text-muted mb-0">
                          Showing {(currentPage - 1) * applied.size + 1} to{" "}
                          {Math.min(currentPage * applied.size, totalItems)} of{" "}
                          {totalItems} entries
                        </p>

                        <ul className="pagination mb-0">
                          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <FaChevronLeft />
                            </button>
                          </li>

                          {getPageNumbers().map((p) => (
                            <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                              <button className="page-link" onClick={() => goToPage(p)}>
                                {p}
                              </button>
                            </li>
                          ))}

                          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => goToPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <FaChevronRight />
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}