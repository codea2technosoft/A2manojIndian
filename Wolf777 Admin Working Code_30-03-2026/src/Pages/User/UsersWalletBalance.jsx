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
  console.warn("1111",plData)
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

      // const res = await axios.post(`${baseUrl}/get-statement-user`, params);
      const res = await axios.post(`${baseUrl}/get-statement-user-ladger`, params);

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
        balance: t.balance || 0,
        tr_status: t.tr_status || 0
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
      totalCredit: allData.reduce((sum, t) => sum + (parseFloat(t.credit) || 0), 0),
      totalDebit: allData.reduce((sum, t) => sum + (parseFloat(t.debit) || 0), 0),
      totalBalance: allData.reduce((sum, t) => sum + (parseFloat(t.balance) || 0), 0)
    };
  }, [allData]);

  const plTabTotals = useMemo(() => {
    return {
      totalWins: plData
        .filter(t => t.win_loss === "WIN")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
      totalLosses: plData
        .filter(t => t.win_loss === "LOSS")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
      netPL: plData.reduce((sum, t) => {
        if (t.win_loss === "WIN") return sum + (parseFloat(t.amount) || 0);
        if (t.win_loss === "LOSS") return sum - (parseFloat(t.amount) || 0);
        return sum;
      }, 0)
    };
  }, [plData]);

  const accountTabTotals = useMemo(() => {
    return {
      totalCredit: accountData
        .filter(t => t.type === "deposit" || t.type === "bonus" || t.type === "commission")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
      totalDebit: accountData
        .filter(t => t.type === "withdraw" || t.type === "transfer")
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
      netBalance: accountData.reduce((sum, t) => {
        const amount = parseFloat(t.amount) || 0;
        if (t.type === "deposit" || t.type === "bonus" || t.type === "commission") {
          return sum + amount;
        } else if (t.type === "withdraw" || t.type === "transfer") {
          return sum - amount;
        }
        return sum;
      }, 0)
    };
  }, [accountData]);

  // ----------------- RENDER ------------------
  return (
    <section style={styles.accountStatement}>
      <div style={styles.container}>
        <button
          style={styles.backButton}
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        {/* <div style={styles.headerPage}>
          <h3 style={styles.headerTitle}>MY ACCOUNT STATEMENT</h3>
        </div> */}

        {error && (
          <div style={styles.alert}>
            {error}
            <button
              style={styles.alertClose}
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        <div style={styles.tabsContainer}>
          <div
            style={{...styles.tabItem, ...(activeTab === "all" ? styles.activeTab : {})}}
            onClick={() => handleTabChange("all")}
          >
            All
          </div>
          <div
            style={{...styles.tabItem, ...(activeTab === "pl" ? styles.activeTab : {})}}
            onClick={() => handleTabChange("pl")}
          >
            P&L
          </div>
          <div
            style={{...styles.tabItem, ...(activeTab === "account" ? styles.activeTab : {})}}
            onClick={() => handleTabChange("account")}
          >
            Account
          </div>
        </div>

        <div style={styles.tabContent}>
          {/* ALL TAB */}
          {activeTab === "all" && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                {/* Desktop Filters */}
                <div style={styles.desktopFilters}>
                  <div style={styles.filterRow}>
                    <div style={styles.filterGroup}>
                      <label style={styles.filterLabel}>From:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.dateInput}
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.filterGroup}>
                      <label style={styles.filterLabel}>To:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.dateInput}
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.filterGroup}>
                      <label style={styles.filterLabel}>Show:</label>
                      <div style={styles.inputIcon}>
                        <select
                          style={styles.selectInput}
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.buttonGroup}>
                      <button
                        style={styles.goButton}
                        onClick={applyFilters}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Go"}
                      </button>
                      <button
                        style={styles.resetButton}
                        onClick={resetFilters}
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div style={styles.mobileFilterToggle}>
                  <div style={styles.title}>
                    <h3 style={styles.mobileTitle}>Account Statement</h3>
                  </div>
                  <button
                    style={styles.filterButton}
                    onClick={() => setShowMobile(!showMobile)}
                  >
                    <FaFilter /> Filters
                  </button>
                </div>

                {/* Mobile Filters Panel */}
                {showMobile && (
                  <div style={styles.mobileFilters}>
                    <div style={styles.mobileFilterGroup}>
                      <label style={styles.mobileFilterLabel}>From:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.mobileDateInput}
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.mobileFilterGroup}>
                      <label style={styles.mobileFilterLabel}>To:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.mobileDateInput}
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.mobileFilterGroup}>
                      <label style={styles.mobileFilterLabel}>Show:</label>
                      <div style={styles.inputIcon}>
                        <select
                          style={styles.mobileSelectInput}
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.mobileFilterGroup}>
                      <div style={styles.mobileButtonGroup}>
                        <button
                          style={styles.mobileGoButton}
                          onClick={applyFilters}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Go"}
                        </button>
                        <button
                          style={styles.mobileResetButton}
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

              {/* Summary Section for All Tab */}
              {/* {!loading && allData.length > 0 && (
                <div style={styles.summaryContainer}>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Total Credit:</span>
                      <span style={{...styles.summaryValue, ...styles.creditText}}>
                        ₹{currency(allTabTotals.totalCredit)}
                      </span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Total Debit:</span>
                      <span style={{...styles.summaryValue, ...styles.debitText}}>
                        ₹{currency(allTabTotals.totalDebit)}
                      </span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Net Balance:</span>
                      <span style={{...styles.summaryValue, fontWeight: 'bold'}}>
                        ₹{currency(allTabTotals.totalBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              )} */}

              <div style={styles.cardBody}>
                {loading ? (
                  <div style={styles.loaderContainer}>
                    <div style={styles.loader}>
                      <div style={styles.loaderSetOne}>
                        <div style={styles.circle}></div>
                        <div style={{...styles.circle, ...styles.circle1}}></div>
                      </div>
                      <div style={styles.loaderSetTwo}>
                        <div style={{...styles.circle, ...styles.circle2}}></div>
                        <div style={{...styles.circle, ...styles.circle3}}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.tableResponsive}>
                      <table style={styles.table}>
                        <thead style={styles.tableHead}>
                          <tr>
                            <th style={styles.tableHeader}>S.NO</th>
                            <th style={styles.tableHeader}>Date</th>
                            <th style={styles.tableHeader}>Description</th>
                            <th style={styles.tableHeader}>Prev Balance</th>
                            <th style={styles.tableHeader}>Credit</th>
                            <th style={styles.tableHeader}>Debit</th>
                            {/* <th style={styles.tableHeader}>Commission</th> */}
                            <th style={styles.tableHeader}>Balance</th>
                            <th style={styles.tableHeader}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.length === 0 ? (
                            <tr>
                              <td colSpan="8" style={styles.emptyState}>
                                No transactions in the selected range.
                              </td>
                            </tr>
                          ) : (
                            rows.map((r) => (
                              <tr key={r.id} style={styles.tableRow}>
                                <td style={styles.tableCell}>{r.sn}</td>
                                <td style={styles.tableCell}>{r.date}</td>
                                <td style={{...styles.tableCell, textAlign: 'left'}}>{r.description}</td>
                                <td style={{...styles.tableCell, textAlign: 'right'}}>₹{currency(r.prev_balance)}</td>
                                <td style={{...styles.tableCell, textAlign: 'right', ...(r.credit > 0 ? styles.creditText : {})}}>
                                  {r.credit > 0 ? `+ ₹${currency(r.credit)}` : "—"}
                                </td>
                                <td style={{...styles.tableCell, textAlign: 'right', ...(r.debit > 0 ? styles.debitText : {})}}>
                                  {r.debit > 0 ? `- ₹${currency(r.debit)}` : "—"}
                                </td>
                                {/* <td style={{...styles.tableCell, textAlign: 'right'}}>
                                  {r.commission > 0 ? `₹${currency(r.commission)}` : "—"}
                                </td> */}
                                <td style={{...styles.tableCell, textAlign: 'right', fontWeight: 'bold'}}>₹{currency(r.balance)}</td>
                                <td style={{...styles.tableCell, textAlign: 'right', fontWeight: 'bold'}}>{r.tr_status}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div style={styles.paginationContainer}>
                        <p style={styles.paginationInfo}>
                          Showing {(currentPage - 1) * applied.size + 1} to{" "}
                          {Math.min(currentPage * applied.size, totalItems)} of{" "}
                          {totalItems} entries
                        </p>

                        <ul style={styles.pagination}>
                          <li style={{...styles.pageItem, ...(currentPage === 1 ? styles.disabled : {})}}>
                            <button
                              style={styles.pageLink}
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <FaChevronLeft />
                            </button>
                          </li>

                          {getPageNumbers().map((p) => (
                            <li key={p} style={{...styles.pageItem, ...(currentPage === p ? styles.activePage : {})}}>
                              <button style={styles.pageLink} onClick={() => goToPage(p)}>
                                {p}
                              </button>
                            </li>
                          ))}

                          <li style={{...styles.pageItem, ...(currentPage === totalPages ? styles.disabled : {})}}>
                            <button
                              style={styles.pageLink}
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
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                {/* Desktop Filters */}
                <div style={styles.desktopFilters}>
                  <div style={styles.filterRow}>
                    <div style={styles.filterGroup}>
                      <label style={styles.filterLabel}>From:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.dateInput}
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          max={toDateState || todayStr}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.filterGroup}>
                      <label style={styles.filterLabel}>To:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.dateInput}
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          min={fromDate}
                          max={todayStr}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.filterGroup}>
                      <label style={styles.filterLabel}>Show:</label>
                      <div style={styles.inputIcon}>
                        <select
                          style={styles.selectInput}
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.buttonGroup}>
                      <button
                        style={styles.goButton}
                        onClick={applyFilters}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Go"}
                      </button>
                      <button
                        style={styles.resetButton}
                        onClick={resetFilters}
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div style={styles.mobileFilterToggle}>
                  <div style={styles.title}>
                    <h3 style={styles.mobileTitle}>Profit & Loss Statement</h3>
                  </div>
                  <button
                    style={styles.filterButton}
                    onClick={() => setShowMobile(!showMobile)}
                  >
                    <FaFilter /> Filters
                  </button>
                </div>

                {/* Mobile Filters Panel */}
                {showMobile && (
                  <div style={styles.mobileFilters}>
                    <div style={styles.mobileFilterGroup}>
                      <label style={styles.mobileFilterLabel}>From:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.mobileDateInput}
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          max={toDateState || todayStr}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.mobileFilterGroup}>
                      <label style={styles.mobileFilterLabel}>To:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.mobileDateInput}
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          min={fromDate}
                          max={todayStr}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.mobileFilterGroup}>
                      <label style={styles.mobileFilterLabel}>Show:</label>
                      <div style={styles.inputIcon}>
                        <select
                          style={styles.mobileSelectInput}
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.mobileFilterGroup}>
                      <div style={styles.mobileButtonGroup}>
                        <button
                          style={styles.mobileGoButton}
                          onClick={applyFilters}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Go"}
                        </button>
                        <button
                          style={styles.mobileResetButton}
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

              {/* Summary Section for P&L Tab */}
              {/* {!loading && plData.length > 0 && (
                <div style={styles.summaryContainer}>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Total Wins:</span>
                      <span style={{...styles.summaryValue, ...styles.winText}}>
                        ₹{currency(plTabTotals.totalWins)}
                      </span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Total Losses:</span>
                      <span style={{...styles.summaryValue, ...styles.lossText}}>
                        ₹{currency(plTabTotals.totalLosses)}
                      </span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Net P&L:</span>
                      <span style={{
                        ...styles.summaryValue, 
                        fontWeight: 'bold',
                        color: plTabTotals.netPL >= 0 ? '#28a745' : '#dc3545'
                      }}>
                        ₹{currency(plTabTotals.netPL)}
                      </span>
                    </div>
                  </div>
                </div>
              )} */}

              <div style={styles.cardBody}>
                {loading ? (
                  <div style={styles.loaderContainer}>
                    <div style={styles.loader}>
                      <div style={styles.loaderSetOne}>
                        <div style={styles.circle}></div>
                        <div style={{...styles.circle, ...styles.circle1}}></div>
                      </div>
                      <div style={styles.loaderSetTwo}>
                        <div style={{...styles.circle, ...styles.circle2}}></div>
                        <div style={{...styles.circle, ...styles.circle3}}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.tableResponsive}>
                      <table style={styles.table}>
                        <thead style={styles.tableHead}>
                          <tr>
                            <th style={styles.tableHeader}>Date & Time</th>
                            <th style={styles.tableHeader}>Description</th>
                            <th style={styles.tableHeader}>Prev.Bal</th>
                            <th style={styles.tableHeader}>Credit</th>
                            <th style={styles.tableHeader}>Debit</th>
                            {/* <th style={styles.tableHeader}>Commission</th> */}
                            <th style={styles.tableHeader}>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plData.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={styles.emptyState}>
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
                                <tr key={t._id || i} style={styles.tableRow}>
                                  <td style={styles.tableCell}>
                                    <div>{formatDisplayDate(t.created_at)}</div>
                                    <small style={styles.timeText}>{formatDisplayTime(t.created_at)}</small>
                                  </td>
                                  <td style={styles.tableCell}>
                                    {t.win_loss || "N/A"} //
                                    {t.full_team_name || t.remark}
                                  </td>
                                  <td style={{...styles.tableCell, textAlign: 'right'}}>
                                    {t.before_balance_from}
                                  </td>
                                  <td style={{...styles.tableCell, textAlign: 'right', ...(t.win_loss === "WIN" ? styles.winText : styles.secondaryText)}}>
                                    {t.win_loss === "WIN" ? t.amount : "-"}
                                  </td>
                                  <td style={{...styles.tableCell, textAlign: 'right', ...(t.win_loss === "LOSS" ? styles.lossText : styles.secondaryText)}}>
                                    {t.win_loss === "LOSS" ? t.amount : "-"}
                                  </td>
                                  {/* <td style={{...styles.tableCell, textAlign: 'center'}}>{t.bet_comsiinos_amount}</td> */}
                                  <td style={{...styles.tableCell, textAlign: 'center'}}>{t.wallet_amount || "N/A"}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination for P&L */}
                    {totalPages > 1 && (
                      <div style={styles.paginationContainer}>
                        <p style={styles.paginationInfo}>
                          Showing {(currentPage - 1) * applied.size + 1} to{" "}
                          {Math.min(currentPage * applied.size, totalItems)} of{" "}
                          {totalItems} entries
                        </p>

                        <ul style={styles.pagination}>
                          <li style={{...styles.pageItem, ...(currentPage === 1 ? styles.disabled : {})}}>
                            <button
                              style={styles.pageLink}
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <FaChevronLeft />
                            </button>
                          </li>

                          {getPageNumbers().map((p) => (
                            <li key={p} style={{...styles.pageItem, ...(currentPage === p ? styles.activePage : {})}}>
                              <button style={styles.pageLink} onClick={() => goToPage(p)}>
                                {p}
                              </button>
                            </li>
                          ))}

                          <li style={{...styles.pageItem, ...(currentPage === totalPages ? styles.disabled : {})}}>
                            <button
                              style={styles.pageLink}
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
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                {/* Desktop Filters */}
                <div style={styles.desktopFilters}>
                  <div style={styles.filterRow}>
                    <div style={styles.filterGroup}>
                      <label style={styles.filterLabel}>From:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.dateInput}
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          max={toDateState || todayStr}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.filterGroup}>
                      <label style={styles.filterLabel}>To:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.dateInput}
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          min={fromDate}
                          max={todayStr}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.filterGroup}>
                      <label style={styles.filterLabel}>Show:</label>
                      <div style={styles.inputIcon}>
                        <select
                          style={styles.selectInput}
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.buttonGroup}>
                      <button
                        style={styles.goButton}
                        onClick={applyFilters}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Go"}
                      </button>
                      <button
                        style={styles.resetButton}
                        onClick={resetFilters}
                        disabled={loading}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Toggle */}
                <div style={styles.mobileFilterToggle}>
                  <div style={styles.title}>
                    <h3 style={styles.mobileTitle}>Account Summary</h3>
                  </div>
                  <button
                    style={styles.filterButton}
                    onClick={() => setShowMobile(!showMobile)}
                  >
                    <FaFilter /> Filters
                  </button>
                </div>

                {/* Mobile Filters Panel */}
                {showMobile && (
                  <div style={styles.mobileFilters}>
                    <div style={styles.mobileFilterGroup}>
                      <label style={styles.mobileFilterLabel}>From:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.mobileDateInput}
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          max={toDateState || todayStr}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.mobileFilterGroup}>
                      <label style={styles.mobileFilterLabel}>To:</label>
                      <div style={styles.inputIcon}>
                        <input
                          type="date"
                          style={styles.mobileDateInput}
                          value={toDateState}
                          onChange={(e) => setToDate(e.target.value)}
                          min={fromDate}
                          max={todayStr}
                        />
                        <FaCalendarAlt style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.mobileFilterGroup}>
                      <label style={styles.mobileFilterLabel}>Show:</label>
                      <div style={styles.inputIcon}>
                        <select
                          style={styles.mobileSelectInput}
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <FaSortDown style={styles.inputIconIcon} />
                      </div>
                    </div>

                    <div style={styles.mobileFilterGroup}>
                      <div style={styles.mobileButtonGroup}>
                        <button
                          style={styles.mobileGoButton}
                          onClick={applyFilters}
                          disabled={loading}
                        >
                          {loading ? "Loading..." : "Go"}
                        </button>
                        <button
                          style={styles.mobileResetButton}
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

              {/* Summary Section for Account Tab */}
              {/* {!loading && accountData.length > 0 && (
                <div style={styles.summaryContainer}>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Total Credit:</span>
                      <span style={{...styles.summaryValue, ...styles.creditText}}>
                        ₹{currency(accountTabTotals.totalCredit)}
                      </span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Total Debit:</span>
                      <span style={{...styles.summaryValue, ...styles.debitText}}>
                        ₹{currency(accountTabTotals.totalDebit)}
                      </span>
                    </div>
                    <div style={styles.summaryItem}>
                      <span style={styles.summaryLabel}>Net Balance:</span>
                      <span style={{...styles.summaryValue, fontWeight: 'bold'}}>
                        ₹{currency(accountTabTotals.netBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              )} */}

              <div style={styles.cardBody}>
                {loading ? (
                  <div style={styles.loaderContainer}>
                    <div style={styles.loader}>
                      <div style={styles.loaderSetOne}>
                        <div style={styles.circle}></div>
                        <div style={{...styles.circle, ...styles.circle1}}></div>
                      </div>
                      <div style={styles.loaderSetTwo}>
                        <div style={{...styles.circle, ...styles.circle2}}></div>
                        <div style={{...styles.circle, ...styles.circle3}}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={styles.tableResponsive}>
                      <table style={{...styles.table, ...styles.customTable}}>
                        <thead style={styles.darkTableHead}>
                          <tr>
                            <th style={styles.darkTableHeader}>Date</th>
                            <th style={styles.darkTableHeader}>Category</th>
                            <th style={styles.darkTableHeader}>From/To</th>
                            <th style={styles.darkTableHeader}>Credit</th>
                            <th style={styles.darkTableHeader}>Debit</th>
                            {/* <th style={styles.darkTableHeader}>Balance</th> */}
                            <th style={styles.darkTableHeader}>Remarks</th>
                            <th style={styles.darkTableHeader}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accountData.length === 0 ? (
                            <tr>
                              <td colSpan="7" style={styles.emptyState}>
                                No transactions available
                              </td>
                            </tr>
                          ) : (
                            accountData.map((t, i) => {
                              const sn = (currentPage - 1) * applied.size + i + 1;
                              const isCredit = t.type === "deposit" || t.type === "bonus" || t.type === "commission";
                              const isDebit = t.type === "withdraw" || t.type === "transfer";
                              const amount = parseFloat(t.amount) || 0;
                              const balance = t.after_balance_to || t.after_balance_from || 0;

                              let categoryStyle = styles.mutedText;
                              if (t.type === "deposit") categoryStyle = styles.depositText;
                              else if (t.type === "withdraw") categoryStyle = styles.withdrawText;
                              else if (t.type === "bonus") categoryStyle = styles.bonusText;
                              else if (t.type === "commission") categoryStyle = styles.commissionText;
                              else if (t.type === "transfer") categoryStyle = styles.transferText;

                              return (
                                <tr key={t._id || i} style={styles.tableRow}>
                                  <td style={styles.tableCell}>{formatDisplayDate(t.created_at)}</td>
                                  <td style={styles.tableCell}>
                                    <span style={{...styles.categoryText, ...categoryStyle}}>
                                      {t.type?.charAt(0).toUpperCase() + t.type?.slice(1) || "N/A"}
                                    </span>
                                  </td>
                                  <td style={{...styles.tableCell, textAlign: 'center'}}>
                                    {t.from_username || t.to_username || "System"}
                                  </td>
                                  <td style={{...styles.tableCell, textAlign: 'center', ...styles.creditText}}>
                                    {isCredit ? `₹${currency(amount)}` : "—"}
                                  </td>
                                  <td style={{...styles.tableCell, textAlign: 'center', ...styles.debitText}}>
                                    {isDebit ? `₹${currency(amount)}` : "—"}
                                  </td>
                                  {/* <td style={{...styles.tableCell, textAlign: 'center'}}>₹{currency(balance)}</td> */}
                                  <td style={{...styles.tableCell, textAlign: 'center'}}>{t.remark || "N/A"}</td>
                                  <td style={{...styles.tableCell, textAlign: 'center'}}>{t.tr_status || "N/A"}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination for Account */}
                    {totalPages > 1 && (
                      <div style={styles.paginationContainer}>
                        <p style={styles.paginationInfo}>
                          Showing {(currentPage - 1) * applied.size + 1} to{" "}
                          {Math.min(currentPage * applied.size, totalItems)} of{" "}
                          {totalItems} entries
                        </p>

                        <ul style={styles.pagination}>
                          <li style={{...styles.pageItem, ...(currentPage === 1 ? styles.disabled : {})}}>
                            <button
                              style={styles.pageLink}
                              onClick={() => goToPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <FaChevronLeft />
                            </button>
                          </li>

                          {getPageNumbers().map((p) => (
                            <li key={p} style={{...styles.pageItem, ...(currentPage === p ? styles.activePage : {})}}>
                              <button style={styles.pageLink} onClick={() => goToPage(p)}>
                                {p}
                              </button>
                            </li>
                          ))}

                          <li style={{...styles.pageItem, ...(currentPage === totalPages ? styles.disabled : {})}}>
                            <button
                              style={styles.pageLink}
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

// ------------------- INLINE STYLES -------------------
const styles = {
  accountStatement: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    padding: '20px 0'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 15px'
  },
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s'
  },
  headerPage: {
    marginBottom: '25px',
    textAlign: 'center'
  },
  headerTitle: {
    fontSize: '28px',
    color: '#333',
    margin: 0,
    fontWeight: '600'
  },
  alert: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px 20px',
    borderRadius: '5px',
    marginBottom: '20px',
    position: 'relative',
    border: '1px solid #f5c6cb'
  },
  alertClose: {
    position: 'absolute',
    top: '50%',
    right: '15px',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#721c24',
    fontWeight: 'bold'
  },
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #dee2e6',
    paddingBottom: '10px'
  },
  tabItem: {
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    borderRadius: '5px 5px 0 0',
    transition: 'all 0.3s',
    backgroundColor: '#f8f9fa'
  },
  activeTab: {
    color: '#fff',
    backgroundColor: '#007bff',
    borderBottom: '3px solid #0056b3'
  },
  tabContent: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  card: {
    border: 'none',
    backgroundColor: '#fff'
  },
  cardHeader: {
    padding: '15px',
    borderBottom: '1px solid #dee2e6',
    backgroundColor: '#fff'
  },
  desktopFilters: {
    display: 'none'
  },
  filterRow: {
    display: 'flex',
    width: '100%',
    alignItems: 'flex-end',
    gap: '10px',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  filterGroup: {
    marginBottom: '0',
    position: 'relative',
    flex: '1 1 auto',
    minWidth: '150px'
  },
  filterLabel: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#666',
    fontWeight: '500'
  },
  inputIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  dateInput: {
    width: '100%',
    padding: '8px 35px 8px 12px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#333',
    backgroundColor: '#fff'
  },
  selectInput: {
    width: '100%',
    padding: '8px 35px 8px 12px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#333',
    backgroundColor: '#fff',
    appearance: 'none'
  },
  inputIconIcon: {
    position: 'absolute',
    right: '10px',
    color: '#6c757d',
    pointerEvents: 'none'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  },
  goButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s'
  },
  resetButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s'
  },
  mobileFilterToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  title: {
    flex: 1
  },
  mobileTitle: {
    fontSize: '18px',
    color: '#333',
    margin: 0,
    fontWeight: '500'
  },
  filterButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  mobileFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '15px',
    marginTop: '15px',
    border: '1px solid #dee2e6',
    borderRadius: '5px',
    backgroundColor: '#fff'
  },
  mobileFilterGroup: {
    width: 'calc(50% - 5px)',
    marginBottom: '10px',
    position: 'relative'
  },
  mobileFilterLabel: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '13px',
    color: '#666',
    fontWeight: '500'
  },
  mobileDateInput: {
    width: '100%',
    padding: '6px 30px 6px 10px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '13px'
  },
  mobileSelectInput: {
    width: '100%',
    padding: '6px 30px 6px 10px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '13px',
    appearance: 'none'
  },
  mobileButtonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  mobileGoButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '6px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    flex: 1
  },
  mobileResetButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '6px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    flex: 1
  },
  // New summary styles
  summaryContainer: {
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #dee2e6'
  },
  summaryCard: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '150px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px'
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '5px',
    fontWeight: '500'
  },
  summaryValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  cardBody: {
    padding: '15px'
  },
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px'
  },
  loader: {
    position: 'relative',
    width: '60px',
    height: '60px'
  },
  loaderSetOne: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%'
  },
  loaderSetTwo: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    transform: 'rotate(45deg)'
  },
  circle: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    backgroundColor: '#007bff',
    borderRadius: '50%',
    animation: 'loaderAnimation 1.5s infinite ease-in-out'
  },
  circle1: {
    top: '0',
    right: '0',
    animationDelay: '0.2s'
  },
  circle2: {
    bottom: '0',
    left: '0',
    animationDelay: '0.4s'
  },
  circle3: {
    bottom: '0',
    right: '0',
    animationDelay: '0.6s'
  },
  tableResponsive: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '0',
    border: '1px solid #dee2e6'
  },
  tableHead: {
    backgroundColor: '#343a40'
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    border: '1px solid #454d55'
  },
  tableRow: {
    borderBottom: '1px solid #dee2e6',
    transition: 'background-color 0.2s'
  },
  tableCell: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #dee2e6',
    verticalAlign: 'middle'
  },
  emptyState: {
    padding: '30px',
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '16px',
    border: '1px solid #dee2e6'
  },
  creditText: {
    color: '#28a745',
    fontWeight: 'bold'
  },
  debitText: {
    color: '#dc3545',
    fontWeight: 'bold'
  },
  winText: {
    color: '#28a745',
    fontWeight: 'bold'
  },
  lossText: {
    color: '#dc3545',
    fontWeight: 'bold'
  },
  secondaryText: {
    color: '#6c757d'
  },
  timeText: {
    fontSize: '12px',
    color: '#6c757d'
  },
  customTable: {
    borderCollapse: 'collapse'
  },
  darkTableHead: {
    backgroundColor: '#343a40'
  },
  darkTableHeader: {
    padding: '12px',
    textAlign: 'left',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    border: '1px solid #454d55'
  },
  categoryText: {
    fontWeight: 'bold'
  },
  depositText: {
    color: '#28a745'
  },
  withdrawText: {
    color: '#dc3545'
  },
  bonusText: {
    color: '#ffc107'
  },
  commissionText: {
    color: '#17a2b8'
  },
  transferText: {
    color: '#007bff'
  },
  mutedText: {
    color: '#6c757d'
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    padding: '15px'
  },
  paginationInfo: {
    color: '#6c757d',
    margin: 0,
    fontSize: '14px'
  },
  pagination: {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    gap: '5px'
  },
  pageItem: {
    margin: 0
  },
  pageLink: {
    padding: '6px 12px',
    border: '1px solid #dee2e6',
    backgroundColor: '#fff',
    color: '#007bff',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'all 0.2s',
    minWidth: '35px',
    textAlign: 'center'
  },
  disabled: {
    opacity: '0.5',
    pointerEvents: 'none'
  },
  activePage: {
    backgroundColor: '#007bff',
    borderColor: '#007bff'
  },
  '@media (min-width: 768px)': {
    desktopFilters: {
      display: 'block'
    },
    mobileFilterToggle: {
      display: 'none'
    }
  }
};

// Add keyframes for loader animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes loaderAnimation {
    0%, 100% {
      transform: scale(0.5);
      opacity: 0.5;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);