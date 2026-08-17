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
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { BsArrowLeft } from "react-icons/bs";

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
  const [filter, setFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showMobile, setShowMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDateState, setToDate] = useState(defaultTo);
  const [pageSize, setPageSize] = useState(100);
  const [applied, setApplied] = useState({
    from: defaultFrom,
    to: defaultTo,
    size: 100,
  });

  const [allData, setAllData] = useState([]);
  const [plData, setPlData] = useState([]);
  console.warn("1111", plData);
  const [accountData, setAccountData] = useState([]);

  const [plSummary, setPlSummary] = useState({
    lena: 0,
    dena: 0,
    balance: 0,
  });

  const [accountSummary, setAccountSummary] = useState({
    credit: 0,
    debit: 0,
    total: 0,
  });

  const baseUrl = process.env.REACT_APP_API_URL;
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

      const res = await axios.post(`${baseUrl}/all-statement-ladger`, params);

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
          balance: res.data.balance || 0,
        });

        // Get the data array
        const list = Array.isArray(res.data.data?.data)
          ? res.data.data.data
          : Array.isArray(res.data.data)
            ? res.data.data
            : [];

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

      // const res = await axios.post(`${baseUrl}/get-statement-user`, params);
      const res = await axios.post(
        `${baseUrl}/get-statement-user-ladger`,
        params,
      );

      if (res.data.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setAccountData(list);

        // Calculate account summary
        let credit = 0;
        let debit = 0;

        list.forEach((t) => {
          const amount = parseFloat(t.amount) || 0;
          const isCredit =
            t.type === "deposit" ||
            t.type === "bonus" ||
            t.type === "commission";
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
          total: credit - debit,
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
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // AM/PM format
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
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
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
        balance: t.balance || 0,
        tr_status: t.tr_status || 0,
      };
    });
  }, [allData, activeTab, currentPage, applied]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Calculate totals for each tab
  const allTabTotals = useMemo(() => {
    return {
      totalCredit: allData.reduce(
        (sum, t) => sum + (parseFloat(t.credit) || 0),
        0,
      ),
      totalDebit: allData.reduce(
        (sum, t) => sum + (parseFloat(t.debit) || 0),
        0,
      ),
      totalBalance: allData.reduce(
        (sum, t) => sum + (parseFloat(t.balance) || 0),
        0,
      ),
    };
  }, [allData]);

  const plTabTotals = useMemo(() => {
    return {
      totalWins: plData
        .filter((t) => t.win_loss === "WIN")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
      totalLosses: plData
        .filter((t) => t.win_loss === "LOSS")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
      netPL: plData.reduce((sum, t) => {
        if (t.win_loss === "WIN") return sum + (parseFloat(t.amount) || 0);
        if (t.win_loss === "LOSS") return sum - (parseFloat(t.amount) || 0);
        return sum;
      }, 0),
    };
  }, [plData]);

  const accountTabTotals = useMemo(() => {
    return {
      totalCredit: accountData
        .filter(
          (t) =>
            t.type === "deposit" ||
            t.type === "bonus" ||
            t.type === "commission",
        )
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
      totalDebit: accountData
        .filter((t) => t.type === "withdraw" || t.type === "transfer")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
      netBalance: accountData.reduce((sum, t) => {
        const amount = parseFloat(t.amount) || 0;
        if (
          t.type === "deposit" ||
          t.type === "bonus" ||
          t.type === "commission"
        ) {
          return sum + amount;
        } else if (t.type === "withdraw" || t.type === "transfer") {
          return sum - amount;
        }
        return sum;
      }, 0),
    };
  }, [accountData]);

  return (
    <section>
      <div className="">
        <div className="py-3 d-flex align-items-center justify-content-between">
          {/* Tabs */}
          <div className="d-flex gap-2">
            {["all", "pl", "account"].map((tab) => (
              <div
                key={tab}
                className={`px-3 py-2 rounded cursor-pointer ${
                  activeTab === tab ? "btn btn-light theme_dark_btn" : "bg-light text-dark"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab === "all" ? "All" : tab === "pl" ? "P&L" : "Account"}
              </div>
            ))}
          </div>
          <div className="d-flex align-items-center gap-2 justify-content-end">
            <button className="btn btn-dark" onClick={() => navigate(-1)}>
              <BsArrowLeft /> Back
            </button>
            <button
              className="btn btn-light theme_dark_btn"
              onClick={() => setFilter((prev) => !prev)}
            >
              <MdFilterListAlt /> Filter
            </button>
          </div>
        </div>
      </div>
      {/* Error */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          {filter && (
            <div className="row g-2 align-items-end mb-3">
              <div className="col-md-3">
                <label className="form-label">From</label>
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">To</label>
                <input
                  type="date"
                  className="form-control"
                  value={toDateState}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Show</label>
                <select
                  className="form-select"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div className="col-md-2">
                <button
                  className="btn btn-primary w-50"
                  onClick={applyFilters}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Go"}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  {/* ALL TAB */}
                  {activeTab === "all" && (
                    <>
                      <thead className="table-dark">
                        <tr>
                          <th>S.NO</th>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Prev Balance</th>
                          <th>Credit</th>
                          <th>Debit</th>
                          <th>Balance</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              No transactions
                            </td>
                          </tr>
                        ) : (
                          rows.map((r) => (
                            <tr key={r.id}>
                              <td>{r.sn}</td>
                              <td>{r.date}</td>
                              <td>{r.description}</td>
                              <td className="text-end">
                                ₹{currency(r.prev_balance)}
                              </td>

                              <td className="text-end text-success">
                                {r.credit > 0
                                  ? `+ ₹${currency(r.credit)}`
                                  : "-"}
                              </td>

                              <td className="text-end text-danger">
                                {r.debit > 0 ? `- ₹${currency(r.debit)}` : "-"}
                              </td>

                              <td className="text-end fw-bold">
                                ₹{currency(r.balance)}
                              </td>

                              <td>{r.tr_status}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </>
                  )}

                  {/* P&L TAB */}
                  {activeTab === "pl" && (
                    <>
                      <thead className="table-dark">
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Prev Bal</th>
                          <th>Credit</th>
                          <th>Debit</th>
                          <th>Balance</th>
                        </tr>
                      </thead>

                      <tbody>
                        {plData.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              No P&L Data
                            </td>
                          </tr>
                        ) : (
                          plData.map((t, i) => (
                            <tr key={i}>
                              <td>{formatDisplayDate(t.created_at)}</td>
                              <td>{t.remark}</td>
                              <td>{t.before_balance_from}</td>

                              <td className="text-success">
                                {t.win_loss === "WIN" ? t.amount : "-"}
                              </td>

                              <td className="text-danger">
                                {t.win_loss === "LOSS" ? t.amount : "-"}
                              </td>

                              <td>{t.wallet_amount}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </>
                  )}

                  {/* ACCOUNT TAB */}
                  {activeTab === "account" && (
                    <>
                      <thead className="table-dark">
                        <tr>
                          <th>Date</th>
                          <th>Category</th>
                          <th>From/To</th>
                          <th>Credit</th>
                          <th>Debit</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {accountData.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              No Data
                            </td>
                          </tr>
                        ) : (
                          accountData.map((t, i) => (
                            <tr key={i}>
                              <td>{formatDisplayDate(t.created_at)}</td>

                              <td className="fw-bold">{t.type}</td>

                              <td>
                                {t.from_username || t.to_username || "System"}
                              </td>

                              <td className="text-success">
                                {t.type === "deposit" ? `₹${t.amount}` : "-"}
                              </td>

                              <td className="text-danger">
                                {t.type === "withdraw" ? `₹${t.amount}` : "-"}
                              </td>

                              <td>{t.tr_status}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </>
                  )}
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span>
                    Showing {currentPage} of {totalPages}
                  </span>

                  <ul className="pagination mb-0">
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                    </li>

                    <li className="page-item active">
                      <button className="page-link">{currentPage}</button>
                    </li>

                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
