import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaSortDown,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
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

function formatDate(d) {
  if (!d) return "";
  try {
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return d;
  }
}

function formatTime(d) {
  if (!d) return "";
  try {
    const date = new Date(d);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return "";
  }
}

// ------------------- MAIN COMPONENT -------------------
export default function AccountStatement() {
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
  const [pageSize, setPageSize] = useState(50);
  const [betTypeFilter, setBetTypeFilter] = useState("all");
  const [applied, setApplied] = useState({
    from: defaultFrom,
    to: defaultTo,
    size: 50,
    bet_type: "all"
  });

  const [allData, setAllData] = useState([]);

  const [summary, setSummary] = useState({
    total_win_amount: 0,
    total_loss_amount: 0,
    total_profit: 0
  });

  const baseUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("user_id");
  const admin_id = localStorage.getItem("admin_id");
  const eventId = localStorage.getItem("event_id");

  // ------------------- FETCH ALL TRANSACTIONS (match-profit-loss-bet-list) -------------------
  const fetchAllData = useCallback(async () => {
    // if (!userId) {
    //   setError("User not logged in");
    //   setLoading(false);
    //   return;
    // }

    try {
      setLoading(true);
      setError(null);

      const startDate = formatDateForAPI(applied.from);
      const endDate = formatDateForAPI(applied.to);

      const params = {
        // user_id: userId,
        event_id: eventId,
        admin_id: admin_id,
        start_date: startDate,
        end_date: endDate,
        page: currentPage,
        limit: applied.size,
        bet_type: applied.bet_type !== "all" ? applied.bet_type : undefined
      };

      console.log("API Params:", params);
      
      const res = await axios.post(`${baseUrl}/match-profit-loss-bet-list`, params);
      
      console.log("API Response:", res.data);

      if (res.data.status_code === 1) {
        // Data array from response
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setAllData(list);
        
        // Set summary if available
        if (res.data.summary) {
          setSummary({
            total_win_amount: res.data.summary.total_win_amount || 0,
            total_loss_amount: res.data.summary.total_loss_amount || 0,
            total_profit: res.data.summary.total_profit || 0
          });
        }
        
        // Set pagination info
        setTotalItems(res.data.totalRecords || list.length);
        setTotalPages(Math.ceil((res.data.totalRecords || list.length) / applied.size));
      } else {
        setAllData([]);
        setSummary({
          total_win_amount: 0,
          total_loss_amount: 0,
          total_profit: 0
        });
        setTotalItems(0);
        setTotalPages(1);
        if (res.data.message) {
          setError(res.data.message);
        }
      }
    } catch (err) {
      console.error("Fetch All Error:", err);
      setError("Network error. Try again.");
      setAllData([]);
      setSummary({
        total_win_amount: 0,
        total_loss_amount: 0,
        total_profit: 0
      });
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, admin_id, eventId, applied, currentPage]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
      bet_type: betTypeFilter,
    });
  };

  const resetFilters = () => {
    setFromDate(defaultFrom);
    setToDate(defaultTo);
    setPageSize(10);
    setBetTypeFilter("all");
    setApplied({
      from: defaultFrom,
      to: defaultTo,
      size: 10,
      bet_type: "all"
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

  // Calculate rows for table - match-profit-loss-bet-list API data
  // Updated with proper win/loss handling based on match_status
  const rows = useMemo(() => {
    return allData.map((item, idx) => {
      const sn = (currentPage - 1) * applied.size + idx + 1;
      
      // Determine status based on match_status
      // match_status: "1" = WIN, "2" = LOSS, anything else = PENDING/OTHER
      let status = "PENDING";
      let winAmt = 0;
      let lossAmt = 0;
      
      if (item.match_status === "1") {
        status = "WIN";
        // Use bet_win_amount for wins (as per your requirement)
        winAmt = parseFloat(item.bet_win_amount) || 0;
        lossAmt = 0;
      } else if (item.match_status === "2") {
        status = "LOSS";
        winAmt = 0;
        // For loss, show stake as loss amount
        lossAmt = parseFloat(item.stake) || 0;
      } else {
        // PENDING or other status
        winAmt = 0;
        lossAmt = 0;
      }
      
      const netAmount = winAmt - lossAmt;
      
      return {
        sn,
        id: item._id || idx,
        date: formatDate(item.created_at),
        time: formatTime(item.created_at),
        betType: item.bet_type || "N/A",
        betOn: item.bet_on || "N/A",
        team: item.team || item.market_name || "N/A",
        mobile: item.mobile || item.mobile || "N/A",
        odds: item.odd || 0,
        stake: item.stake || 0,
        winAmount: winAmt,
        lossAmount: lossAmt,
        netAmount: netAmount,
        status: status,
        result: item.result_val || "N/A",
        commission: item.comissionAmount || 0,
        matchedStatus: item.matched_status || "N/A",
        matchStatus: item.match_status || "N/A" // Keep original if needed
      };
    });
  }, [allData, currentPage, applied]);

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

        <div style={styles.tabContent}>
          {/* ALL TAB - match-profit-loss-bet-list data */}
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

                  <div style={styles.filterGroup}>
                    <label style={styles.filterLabel}>Bet Type:</label>
                    <div style={styles.inputIcon}>
                      <select
                        style={styles.selectInput}
                        value={betTypeFilter}
                        onChange={(e) => setBetTypeFilter(e.target.value)}
                      >
                        <option value="all">All</option>
                        <option value="fancy">Fancy</option>
                        <option value="match">Match Odds</option>
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
                  <h3 style={styles.mobileTitle}>Bet List</h3>
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
                    <label style={styles.mobileFilterLabel}>Bet Type:</label>
                    <div style={styles.inputIcon}>
                      <select
                        style={styles.mobileSelectInput}
                        value={betTypeFilter}
                        onChange={(e) => setBetTypeFilter(e.target.value)}
                      >
                        <option value="all">All</option>
                        <option value="fancy">Fancy</option>
                        <option value="bookmaker">bookmaker</option>
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

            {/* Summary Section - from API summary */}
            {!loading && allData.length > 0 && (
              <div style={styles.summaryContainer}>
                <div style={styles.summaryCard}>
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>Total Win Amount:</span>
                    <span style={{...styles.summaryValue, ...styles.winText}}>
                      ₹{currency(summary.total_win_amount)}
                    </span>
                  </div>
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>Total Loss Amount:</span>
                    <span style={{...styles.summaryValue, ...styles.lossText}}>
                      ₹{currency(summary.total_loss_amount)}
                    </span>
                  </div>
                  <div style={styles.summaryItem}>
                    <span style={styles.summaryLabel}>Net Profit:</span>
                    <span style={{
                      ...styles.summaryValue,
                      color: summary.total_profit >= 0 ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      ₹{currency(summary.total_profit)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div style={styles.cardBody}>
              {loading ? (
                <div style={styles.loaderContainer}>
                  <div style={styles.loader}>
                    <div style={styles.circle}></div>
                    <div style={styles.circle1}></div>
                    <div style={styles.circle2}></div>
                    <div style={styles.circle3}></div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={styles.tableResponsive}>
                    <table style={styles.table}>
                      <thead style={styles.tableHead}>
                        <tr>
                          <th style={styles.tableHeader}>#</th>
                          <th style={styles.tableHeader}>Date & Time</th>
                          <th style={styles.tableHeader}>Team/Market</th>
                          <th style={styles.tableHeader}>Phone</th>
                          <th style={styles.tableHeader}>Bet Type</th>
                          <th style={styles.tableHeader}>Bet On</th>
                          <th style={styles.tableHeader}>Odds</th>
                          <th style={styles.tableHeader}>Stake (₹)</th>
                          <th style={styles.tableHeader}>Win Amount (₹)</th>
                          <th style={styles.tableHeader}>Loss Amount (₹)</th>
                          <th style={styles.tableHeader}>Net (₹)</th>
                          <th style={styles.tableHeader}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan="11" style={styles.emptyState}>
                              No bets found in the selected range.
                            </td>
                          </tr>
                        ) : (
                          rows.map((r) => (
                            <tr key={r.id} style={styles.tableRow}>
                              <td style={styles.tableCell}>{r.sn}</td>
                              <td style={styles.tableCell}>
                                <div>{r.date}</div>
                                <small style={styles.timeText}>{r.time}</small>
                              </td>
                              <td style={styles.tableCell}>{r.team}</td>
                              <td style={styles.tableCell}>{r.mobile}</td>
                              <td style={styles.tableCell}>
                                <span style={{
                                  ...styles.badge,
                                  backgroundColor: r.betType === 'fancy' ? '#17a2b8' : '#007bff'
                                }}>
                                  {r.betType.toUpperCase()}
                                </span>
                              </td>
                              <td style={styles.tableCell}>
                                <span style={{
                                  ...styles.badge,
                                  backgroundColor: r.betOn === 'back' ? '#28a745' : '#dc3545'
                                }}>
                                  {r.betOn.toUpperCase()}
                                </span>
                              </td>
                              <td style={{...styles.tableCell, textAlign: 'right'}}>{r.odds}</td>
                              <td style={{...styles.tableCell, textAlign: 'right'}}>₹{currency(r.stake)}</td>
                              <td style={{...styles.tableCell, textAlign: 'right', ...styles.winText}}>
                                {r.winAmount > 0 ? `₹${currency(r.winAmount)}` : "—"}
                              </td>
                              <td style={{...styles.tableCell, textAlign: 'right', ...styles.lossText}}>
                                {r.lossAmount > 0 ? `₹${currency(r.lossAmount)}` : "—"}
                              </td>
                              <td style={{
                                ...styles.tableCell,
                                textAlign: 'right',
                                fontWeight: 'bold',
                                color: r.netAmount > 0 ? '#28a745' : (r.netAmount < 0 ? '#dc3545' : '#666')
                              }}>
                                {r.netAmount !== 0 ? `₹${currency(Math.abs(r.netAmount))}` : "—"}
                                {r.netAmount > 0 ? ' P' : (r.netAmount < 0 ? ' L' : '')}
                              </td>
                              <td style={styles.tableCell}>
                                <span style={{
                                  ...styles.statusBadge,
                                  backgroundColor: r.status === 'WIN' ? '#d4edda' : 
                                                    (r.status === 'LOSS' ? '#f8d7da' : '#fff3cd'),
                                  color: r.status === 'WIN' ? '#155724' : 
                                          (r.status === 'LOSS' ? '#721c24' : '#856404'),
                                  border: `1px solid ${r.status === 'WIN' ? '#c3e6cb' : 
                                                        (r.status === 'LOSS' ? '#f5c6cb' : '#ffeeba')}`
                                }}>
                                  {r.status}
                                </span>
                              </td>
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
                            <button 
                              style={styles.pageLink} 
                              onClick={() => goToPage(p)}
                            >
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
    display: 'none',
    '@media (min-width: 768px)': {
      display: 'block'
    }
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
    width: '100%',
    '@media (min-width: 768px)': {
      display: 'none'
    }
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
  circle: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    backgroundColor: '#007bff',
    borderRadius: '50%',
    top: '0',
    left: '0',
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
    border: '1px solid #454d55',
    whiteSpace: 'nowrap'
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
  badge: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    minWidth: '50px'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    textAlign: 'center',
    minWidth: '60px'
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
  timeText: {
    fontSize: '11px',
    color: '#6c757d',
    display: 'block'
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    padding: '15px',
    flexWrap: 'wrap',
    gap: '10px'
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
    borderColor: '#007bff',
    color: 'white'
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
  
  .table-responsive::-webkit-scrollbar {
    height: 6px;
  }
  
  .table-responsive::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .table-responsive::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  .table-responsive::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media (min-width: 768px) {
    .desktop-filters {
      display: block !important;
    }
    .mobile-filter-toggle {
      display: none !important;
    }
  }
`;
document.head.appendChild(styleSheet);