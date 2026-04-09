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
import { useNavigate } from "react-router-dom";


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
export default function ViewHisttory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobile, setShowMobile] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDateState, setToDate] = useState("");
  const [pageSize, setPageSize] = useState(1000);
  const [applied, setApplied] = useState({
    from: "",
    to: "",
    size: 1000,
  });
  const navigate = useNavigate();

  const [matchBets, setMatchBets] = useState([]);
  const [total, setMatchBetstotal] = useState([]);
  const [Mattotal_commission, setMattotal_commission] = useState([]);
  const [Matchtotal_pl, setMatchtotal_pl] = useState([]);
  // alert(total)
  const [sessionBets, setSessionBets] = useState([]);
  const [rejectedBets, setRejectedBets] = useState([]);
  const [eventData, setEventData] = useState(null);

  const baseUrl = process.env.REACT_APP_BACKEND_API;

  const userId = localStorage.getItem("user_id");
  const admin_id = localStorage.getItem("admin_idviev");
  const event_id = localStorage.getItem("event_idview");

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

  // Fetch bets
  const fetchBetsmatchBets = useCallback(async () => {
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
        // start_date: startDate,
        // end_date: endDate,
        page: currentPage,
        limit: applied.size,
      };

      const res = await axios.post(`${baseUrl}/get-user-match-details`, params);

      if (res.data.success && res.data.data) {

        // Set match bets
        setMatchBets(res.data.success && res.data.data);
        setMatchBetstotal(res.data.total)
        setMatchtotal_pl(res.data.total_pl)
        setMattotal_commission(res.data.total_commission)

        // Set session bets

        // Set rejected bets

        // Calculate total items for pagination
        const total = (res.data.data.match_bets?.length || 0) +
          (res.data.data.session_bets?.length || 0) +
          (res.data.data.rejected_bets?.length || 0);
        setTotalItems(total);
        setTotalPages(Math.ceil(total / applied.size));
      } else {
        setMatchBets([]);
     
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Network error. Try again.");
      setMatchBets([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, userId, admin_id, event_id, applied, currentPage, fromDate, toDateState, defaultFrom, defaultTo]);



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
        // start_date: startDate,
        // end_date: endDate,
        page: currentPage,
        limit: applied.size,
      };

      const res = await axios.post(`${baseUrl}/get-user-ledger-details`, params);

      if (res.data.success && res.data.data) {
        setEventData(res.data.data);

        // Set match bets
        // setMatchBets(Array.isArray(res.data.data.match_bets) ? res.data.data.match_bets : []);

        // Set session bets
        setSessionBets(Array.isArray(res.data.data.session_bets) ? res.data.data.session_bets : []);

        // Set rejected bets
        setRejectedBets(Array.isArray(res.data.data.rejected_bets) ? res.data.data.rejected_bets : []);

        // Calculate total items for pagination
        const total = (res.data.data.match_bets?.length || 0) +
          (res.data.data.session_bets?.length || 0) +
          (res.data.data.rejected_bets?.length || 0);
        setTotalItems(total);
        setTotalPages(Math.ceil(total / applied.size));
      } else {
        setMatchBets([]);
        setSessionBets([]);
        setRejectedBets([]);
        setTotalItems(0);
        setTotalPages(1);
        setError(res.data.message || "No bets found");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Network error. Try again.");
      setMatchBets([]);
      setSessionBets([]);
      setRejectedBets([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, userId, admin_id, event_id, applied, currentPage, fromDate, toDateState, defaultFrom, defaultTo]);

  useEffect(() => {
    fetchBets();
    fetchBetsmatchBets();
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

  function formatDateTime(dateString) {
    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }


  // Calculate PL for a bet
  const calculatePL = (bet) => {
    if (bet.bet_type === "fancy") {
      const deposit = parseFloat(bet.fancy_deposit) || 0;
      const withdraw = parseFloat(bet.fancy_withdraw) || 0;
      return withdraw - deposit;
    }

    const stake = parseFloat(bet.stake) || 0;
    const odd = parseFloat(bet.odd) || 0;

    if (bet.bet_on === "back") {
      return (stake * odd) - stake;
    } else if (bet.bet_on === "lay") {
      return - (parseFloat(bet.liability) || stake);
    }

    return 0;
  };

  // ---- SESSION TOTALS ----
  const sessionTotals = sessionBets.reduce(
    (acc, bet) => {
      const stake = Number(bet.stake) || 0;

      if (bet.match_status === "1") {
        acc.totalWin += Number(bet.bet_win_amount) || 0;
      } else if (bet.match_status === "2") {
        acc.totalLoss += Number(bet.fancy_withdraw) || 0;
      }

      acc.totalStake += stake;
      return acc;
    },
    { totalStake: 0, totalWin: 0, totalLoss: 0 }
  );

  const sessionNetPL = sessionTotals.totalWin - sessionTotals.totalLoss;

  // ---- MATCH TOTALS ----
  const matchTotals = matchBets.reduce(
    (acc, bet) => {
      const stake = Number(bet.stake) || 0;

      if (bet.match_status === "1") {
        acc.totalWin += Number(bet.bet_win_amount) || 0;
      } else if (bet.match_status === "2") {
        acc.totalLoss += Number(bet.stake) || 0; // For match bets, loss is usually the stake
      }

      acc.totalStake += stake;
      return acc;
    },
    { totalStake: 0, totalWin: 0, totalLoss: 0 }
  );

  const matchNetPL = matchTotals.totalWin - matchTotals.totalLoss;

  return (
    <section className="account_statement completebetalldesignnewa">
      <div className="container-fluid p-0">
        <div className="card border-0">
          {/* Header with Event Title */}
          <div className="card-header gradientbg text-white">
            <h4 className="">
              MY LEDGER DETAILS ({eventData?.event_name || "PAKISTAN V USA - PAKISTAN"})
            </h4>
          </div>

          {/* Summary Stats */}
          <div className="row m-0 p-2 bg-light border-bottom">
            <div className="col-md-3">
              <small className="text-muted">MATCH PLUS MINUS</small>
              <h6 className="mb-0">₹{currency(Matchtotal_pl)}</h6>
            </div>
            <div className="col-md-3">
              <small className="text-muted">SESSION PLUS MINUS</small>
              <h6 className="mb-0">₹{currency(eventData?.session_pl || 0)}</h6>
            </div>
            <div className="col-md-3">
              <small className="text-muted">TOTAL COMMISSION</small>
              <h6 className="mb-0">₹{currency(eventData?.total_comm || 0)}</h6>
            </div>
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
                {/* SESSION BETS TABLE */}
                {sessionBets.length > 0 && (
                  <>
                    <div className="gradientbg p-2 fw-bold">
                      SESSION BETS
                    </div>
                    <div className="table-responsive">
                      <table className="table mb-0 table-striped" width="100%">
                        <thead className="tablebggg text-white">
                          <tr>
                            <th>RUNNER</th>
                            <th>DATE & TIME</th>
                            <th>RATE</th>
                            <th>VOLUME</th>
                            <th>RESULT</th>
                            <th>AMOUNT</th>
                            <th>Win/Loss</th>
                            <th>MODE</th>
                            <th>PL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessionBets.map((bet, index) => {
                            const pl = calculatePL(bet);
                            return (
                              <tr key={bet._id || index}>
                                <td>{bet.team || "N/A"}</td>
                                <td>{formatDateTime(bet.created_at)}</td>
                                <td>{bet.odd}</td>
                                <td>{bet.total}</td>
                                <td>{bet.result_val}</td>
                                <td>₹{currency(bet.stake)}</td>
                                <td
                                  style={{
                                    color: bet.match_status === "1" ? "green" : "red",
                                    fontWeight: "bold"
                                  }}
                                >
                                  {bet.match_status == "1" ? "Win" : "Loss"}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${bet.bet_on === "back" ? "bg-success" : "bg-danger"}`}
                                  >
                                    {
                                      bet.bet_type === "bookmaker"
                                        ? (bet.bet_on === "back" ? "LAGAI" : "KHAI")
                                        : (bet.bet_on === "lay" ? "No" : "Yes")
                                    }
                                  </span>
                                </td>
                                <td
                                  className={
                                    bet.match_status === "1"
                                      ? "text-success"
                                      : bet.match_status === "2"
                                        ? "text-danger"
                                        : ""
                                  }
                                >
                                  {bet.match_status === "1"
                                    ? `+${currency(bet.bet_win_amount)}`
                                    : bet.match_status === "2"
                                      ? `-${currency(bet.fancy_withdraw)}`
                                      : currency(pl)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* SESSION TOTAL SUMMARY */}
                    <div className="p-3 bg-light border-top">
                      <div className="row text-center fw-bold">
                        <div className="col">
                          Total Amount: ₹{currency(sessionTotals.totalStake)}
                        </div>
                        <div className="col text-success">
                          Total Win: ₹{currency(sessionTotals.totalWin)}
                        </div>
                        <div className="col text-danger">
                          Total Loss: ₹{currency(sessionTotals.totalLoss)}
                        </div>
                        <div
                          className={`col ${
                            sessionNetPL >= 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          Net P/L: {sessionNetPL >= 0 ? "+" : "-"}₹
                          {currency(Math.abs(sessionNetPL))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* MATCH BETS TABLE */}
                {matchBets.length > 0 && (
                  <>
                    <div className="gradientbg p-2 fw-bold mt-3">
                      MATCH BETS
                    </div>
                    <div className="table-responsive">
                      <table className="table mb-0 table-striped" width="100%">
                        <thead className="tablebggg text-white">
                          <tr>
                            <th>RUNNER</th>
                            <th>DATE & TIME</th>
                            {/* <th>RATE</th>
                            <th>VOLUME</th> */}
                            <th>Comission</th>
                            {/* <th>Win/Loss</th> */}
                            {/* <th>MODE</th> */}
                            <th>PL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matchBets.map((bet, index) => {
                            const pl = calculatePL(bet);
                            return (
                              <tr key={bet._id || index}>
                                <td>{bet.team || "N/A"}</td>
                                <td>{formatDateTime(bet.created_at)}</td>
                                {/* <td>{bet.odd}</td> */}
                                {/* <td>{bet.total}</td> */}
                                <td>₹{currency(bet.comission)}</td>
                                <td>₹{bet.amount}</td>
                                {/* <td
                                  style={{
                                    color: bet.match_status == "1" ? "green" : "red",
                                    fontWeight: "bold"
                                  }}
                                >
                                  {bet.match_status === "1" ? "Win" : "Loss"}
                                </td> */}
                                {/* <td>
                                  <span
                                    className={`badge ${bet.bet_on === "back" ? "bg-success" : "bg-danger"}`}
                                  >
                                    {
                                      bet.bet_type == "Bookmaker"
                                        ? (bet.bet_on === "back" ? "LAGAI" : "KHAI")
                                        : (bet.bet_on === "lay" ? "No" : "Yes")
                                    }
                                  </span>
                                </td> */}
                                {/* <td className={bet.match_status === "1" ? "text-success" : "text-danger"}>
                                  {bet.match_status === "1" 
                                    ? `+${currency(bet.amount || pl)}` 
                                    : `-${currency(bet.amount || Math.abs(pl))}`}
                                </td> */}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* MATCH TOTAL SUMMARY */}
                    <div className="p-3 bg-light border-top">
                      <div className="row text-center fw-bold">
                        {/* <div className="col">
                          Total Amount: ₹{total}
                        </div> */}
                        <div className="col text-success">
                          Commission: ₹{Mattotal_commission}
                        </div>
                    
                        <div
                          className={`col ${
                            Matchtotal_pl >= 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          Net P/L: {Matchtotal_pl >= 0 ? "+" : "-"}₹
                          {/* Net P/L: ₹ */}
                          {Matchtotal_pl}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* REJECTED BETS TABLE */}
                {rejectedBets.length > 0 && (
                  <>
                    <div className="gradientbg p-2 fw-bold mt-3">
                      REJECTED BETS
                    </div>
                    <div className="table-responsive">
                      <table className="table mb-0 table-striped" width="100%">
                        <thead className="tablebggg text-white">
                          <tr>
                            <th>RUNNER</th>
                            <th>DATE & TIME</th>
                            <th>RATE</th>
                            <th>VOLUME</th>
                            <th>RESULT</th>
                            <th>AMOUNT</th>
                            <th>MODE</th>
                            <th>PL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rejectedBets.map((bet, index) => {
                            const pl = calculatePL(bet);
                            return (
                              <tr key={bet._id || index}>
                                <td>{bet.team || "N/A"}</td>
                                <td>{formatDateTime(bet.created_at || bet.createdAt)}</td>
                                <td>{bet.odd}</td>
                                <td>{bet.total}</td>
                                <td>{bet.result_val}</td>
                                <td>₹{currency(bet.stake)}</td>
                                <td>
                                  <span
                                    className={`badge ${bet.bet_on === "back" ? "bg-success" : "bg-danger"}`}
                                  >
                                    {
                                      bet.bet_type === "bookmaker"
                                        ? (bet.bet_on === "back" ? "LAGAI" : "KHAI")
                                        : (bet.bet_on === "lay" ? "No" : "Yes")
                                    }
                                  </span>
                                </td>
                                <td className={pl >= 0 ? "text-success" : "text-danger"}>
                                  {pl >= 0 ? '+' : ''}{currency(pl)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {sessionBets.length === 0 && matchBets.length === 0 && rejectedBets.length === 0 && (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">No bets found in the selected range.</p>
                  </div>
                )}

                {/* Back To Main Menu Button */}
                <div className="p-3 text-center border-top">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Back To Main Menu
                  </button>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3 p-3">
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
      </div>
    </section>
  );
}