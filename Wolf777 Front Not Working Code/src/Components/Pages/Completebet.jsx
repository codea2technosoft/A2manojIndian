import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaCheck
} from "react-icons/fa";
import "./AccountStatement.css";

// HELPER FUNCTIONS
function currency(n) {
  if (n === undefined || n === null) return "0.00";
  const num = typeof n === "string" ? parseFloat(n) : n;
  return num?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// MAIN COMPONENT
export default function Completebets() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobile, setShowMobile] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDateState, setToDate] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [applied, setApplied] = useState({
    from: "",
    to: "",
    size: 10,
  });

  const [bets, setBets] = useState([]);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


    const baseUrl = process.env.REACT_APP_BACKEND_API;


  const userId = localStorage.getItem("user_id");
  const admin_id = localStorage.getItem("admin_id");
const event_id = localStorage.getItem("event_id");

  // Helper to get date in MM-DD-YYYY format
  const formatDateForAPI = (date) => {
    if (!date) return "";
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

  // Get status badge
  const getStatusBadge = (matchStatus, matchedStatus, isSettled) => {
    if (isSettled === "1") {
      return <span className="badge bg-success">Settled</span>;
    }

    if (matchedStatus === "matched") {
      return <span className="badge bg-warning">Matched</span>;
    } else if (matchedStatus === "unmatched") {
      return <span className="badge bg-secondary">Unmatched</span>;
    } else if (matchedStatus === "cancelled") {
      return <span className="badge bg-danger">Cancelled</span>;
    }

    return <span className="badge bg-info">Pending</span>;
  };

  // Calculate bet result
  const calculateBetResult = (bet) => {
    if (bet.bet_type === "fancy") {
      const deposit = parseFloat(bet.fancy_deposit) || 0;
      const withdraw = parseFloat(bet.fancy_withdraw) || 0;

      if (deposit > 0 && withdraw > 0) {
        const netAmount = withdraw - deposit;
        return {
          net: netAmount,
          display: netAmount >= 0 ? `+₹${currency(netAmount)}` : `-₹${currency(Math.abs(netAmount))}`,
          type: netAmount > 0 ? "profit" : netAmount < 0 ? "loss" : "neutral"
        };
      }
    }

    const stake = parseFloat(bet.stake) || 0;
    const odd = parseFloat(bet.odd) || 0;

    if (bet.bet_on === "back") {
      const profit = (stake * odd) - stake;
      return {
        net: profit,
        display: profit >= 0 ? `+₹${currency(profit)}` : `-₹${currency(Math.abs(profit))}`,
        type: "profit"
      };
    } else if (bet.bet_on === "lay") {
      const liability = parseFloat(bet.liability) || 0;
      return {
        net: -liability,
        display: `-₹${currency(liability)}`,
        type: "loss"
      };
    }

    return { net: 0, display: "₹0.00", type: "neutral" };
  };

  // Get result badge
  const getResultBadge = (bet) => {
    const result = calculateBetResult(bet);

    if (bet.is_settled === "1") {
      if (result.net > 0) {
        return <span className="badge bg-success">Won</span>;
      } else if (result.net < 0) {
        return <span className="badge bg-danger">Lost</span>;
      } else {
        return <span className="badge bg-info">Push</span>;
      }
    } else {
      if (result.net > 0) {
        return <span className="badge bg-warning">To Win</span>;
      } else if (result.net < 0) {
        return <span className="badge bg-secondary">To Lose</span>;
      } else {
        return <span className="badge bg-light text-dark">Even</span>;
      }
    }
  };

  // Fetch bets
  const fetchBets = useCallback(async () => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const startDate = fromDate && toDateState ? formatDateForAPI(fromDate) : formatDateForAPI(defaultFrom);
      const endDate = fromDate && toDateState ? formatDateForAPI(toDateState) : formatDateForAPI(defaultTo);

      const params = {
        user_id: userId,
        admin_id: admin_id,
        event_id: event_id,
        start_date: startDate,
        end_date: endDate,
        page: currentPage,
        limit: applied.size,
      };

      

      const res = await axios.post(`${baseUrl}/complet-bet-history`, params);


      if (res.data.status_code === 1) {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setBets(list);
        setTotalItems(res.data.pagination?.total_records || list.length);
        setTotalPages(res.data.pagination?.total_pages || 1);
      } else {
        setBets([]);
        setTotalItems(0);
        setTotalPages(1);
        setError(res.data.message || "No bets found");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Network error. Try again.");
      setBets([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, userId, admin_id, applied, currentPage, fromDate, toDateState, defaultFrom, defaultTo]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  // Apply filters
  const applyFilters = () => {
    const newFrom = fromDate || defaultFrom;
    const newTo = toDateState || defaultTo;

    setApplied({
      from: newFrom,
      to: newTo,
      size: pageSize,
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setPageSize(10);
    setApplied({
      from: defaultFrom,
      to: defaultTo,
      size: 10,
    });
    setCurrentPage(1);
  };

  // Pagination
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

  // Get value for display
  const getDisplayValue = (bet) => {
    if (bet.bet_type === "fancy") {
      return `₹${currency(bet.fancy_deposit || bet.stake)}`;
    }
    return `₹${currency(bet.stake)}`;
  };
  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <section className="account_statement completebetalldesignnewa">
      <div className="container-fluid p-0">
        {/* {error && (
          <div className="alert alert-danger m-3">
            {error}
            <button
              className="btn-close float-end"
              onClick={() => setError(null)}
            ></button>
          </div>
        )} */}

        <div className="card border-0">
          {/* <div className="card-header w-100 p-2">
            <div className="d-none d-md-flex w-100 align-items-center">
              <div className="w-100 d-flex align-items-end gap-2 justify-content-between">
                <div className="form-group mb-0 position-relative">
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

                <div className="form-group mb-0 position-relative">
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

                <div className="form-group mb-0 position-relative">
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

            <div className="d-flex align-items-center d-md-none justify-content-between w-100">
              <div className="title">
                <h3 className=" mb-0">Bet History</h3>
              </div>
              <button
                className="gobutton fillterbutton text-white"
                onClick={() => setShowMobile(!showMobile)}
              >
                <FaFilter /> Filters
              </button>
            </div>

            {showMobile && (
              <div className="d-md-none mt-2 d-flex flex-wrap gap-2 p-2 align-items-end border rounded">
                <div className="form-group width_50 mb-2 position-relative">
                  <label className="text-dark">From:</label>
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

                <div className="form-group width_50 mb-2 position-relative">
                  <label className="text-dark">To:</label>
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

                <div className="form-group width_50 mb-2 position-relative">
                  <label className="text-dark">Show:</label>
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
                <div className="form-group width_50 mb-2 position-relative">
                  <div className="d-flex gap-2 flex-colummobile">
                    <button
                      className="w-100 btn btn-secondary"
                      onClick={applyFilters}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Go"}
                    </button>
                    <button
                      className="w-100 btn btn-warning"
                      onClick={resetFilters}
                      disabled={loading}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div> */}

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
                  <table className="table mb-0 table-striped" width="100%">
                    <thead className="thead-dark">
                      <tr>
                        <th>#</th>
                        <th>Runner Name</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Amount</th>
                        {/* <th>Result</th> */}
                        <th>result Value</th>
                        <th>Stutes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bets.length === 0 ? (
                        <tr>
                          <td colSpan="8" className=" py-4">
                            No bets found in the selected range.
                          </td>
                        </tr>
                      ) : (
                        bets.map((bet, index) => {
                          const result = calculateBetResult(bet);
                          const rowNumber = (currentPage - 1) * applied.size + index + 1;

                          return (
                            <tr key={bet._id} className={bet.is_settled === 1 ? "table-success-light" : ""}>
                              <td className="fw-medium ">{index + 1}</td>
                              <td>
                                <div className="d-flex flex-column">
                                  <span className="fw-medium">{bet.team || "N/A"}</span>
                                  {bet.event_id && (
                                    <small className="text-muted"></small>
                                  )}
                                </div>
                              </td>
                              {/* <td className="text-center">
                                <span
                                  className={`badge ${bet.bet_on?.toLowerCase() === "back" ? "bg-success-custum" : "bg-danger-custum"}`}
                                >
                                  {bet.bet_on?.toUpperCase() || "N/A"}
                                </span>
                              </td> */}

                              <td>
                                {/* <span
                                  className={`badge ${bet.bet_on === "back" ? "bg-success" : "bg-danger"
                                    }`}
                                >
                                  {bet.bet_on === "back" ? "YES" : bet.bet_on === "lay" ? "NO" : "N/A"}
                                  
                                </span> */}

                                <span
                                  className={`badge ${bet.bet_on === "back" ? "bg-success" : "bg-danger"
                                    }`}
                                >
                                  {
                                    bet.bet_type === "bookmaker"
                                      ? (bet.bet_on === "back" ? "LAGAI" : "KHAI")
                                      : (bet.bet_on === "lay" ? "No" : "Yes")
                                  }
                                </span>

                              </td>
                              <td className=" fw-bold">
                                {bet.odd}/{bet.total}
                              </td>
                              <td className="text-end fw-medium">
                                <span className="text-primary">{bet.stake}</span>
                              </td>
                              {/* <td className="text-end fw-medium">
                                                            <span className="text-info">{formatCurrency(bet.total)}</span>
                                                        </td> */}
                              {/* <td>
                                {bet.profitLoss}
                              </td> */}

                              {/* <td className="text-center">
                                                            <small className="text-muted">{marketType}</small>
                                                        </td> */}

                              <td>
                                <small>{bet.result_val}</small>
                              </td>
                              <td className="">
                                <span
                                  className={`badge ${bet.match_status === "1"
                                      ? "bg-success"
                                      : bet.match_status === "2"
                                        ? "bg-danger"
                                        : "bg-warning text-dark"
                                    }`}
                                >
                                  {bet.match_status === "1"
                                    ? "WIN"
                                    : bet.match_status === "2"
                                      ? "LOSS"
                                      : "PENDING"}
                                </span>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between mt-3 p-3">
                    {/* <p className="text-muted mb-0">
                      Showing {(currentPage - 1) * applied.size + 1} to{" "}
                      {Math.min(currentPage * applied.size, totalItems)} of{" "}
                      {totalItems} entries
                    </p> */}

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
      </div>
    </section>
  );
}