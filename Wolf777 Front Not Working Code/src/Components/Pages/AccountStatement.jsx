import React, { useEffect, useState, useCallback } from "react";
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

// ------------------- HELPER FUNCTIONS -------------------
function currency(n) {
  return n?.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ------------------- MAIN COMPONENT -------------------
export default function AccountStatement() {
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get date in MM-DD-YYYY format
  const formatDateForAPI = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
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

  const [fromDate, setFromDate] = useState("");
  const [toDateState, setToDate] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [applied, setApplied] = useState({
    from: defaultFrom,
    to: defaultTo,
    size: 10,
  });

  const [transactions, setTransactions] = useState([]);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


    const baseUrl = process.env.REACT_APP_BACKEND_API;


  const userId = localStorage.getItem("user_id");

  // ------------------- FETCH TRANSACTIONS -------------------
  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // If fromDate or toDate are empty, use default values (last 1 month)
      const startDate = fromDate && toDateState
        ? formatDateForAPI(fromDate)
        : formatDateForAPI(defaultFrom);

      const endDate = fromDate && toDateState
        ? formatDateForAPI(toDateState)
        : formatDateForAPI(defaultTo);

      const params = {
        userId: userId,
        start_date: startDate,
        end_date: endDate,
        page: currentPage,
        limit: applied.size,
      };

      const res = await axios.get(`${baseUrl}/wallet-history`, { params });
      console.log(res.data);

      if (res.data.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setTransactions(list);
        setTotalItems(res.data.total || list.length);
        setTotalPages(Math.max(1, Math.ceil((res.data.total || list.length) / applied.size)));
      } else {
        setTransactions([]);
        setTotalItems(0);
        setTotalPages(1);
        setError(res.data.message || "No data found");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Network error. Try again.");
      setTransactions([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, userId, applied, currentPage, fromDate, toDateState, defaultFrom, defaultTo]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // -------------------- APPLY FILTERS -----------------------
  const applyFilters = () => {
    // If dates are empty, use default values (last 1 month)
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
    // Reset to empty inputs, but API will use last 1 month
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

  // ----------------- RENDER ------------------
  return (
    <section className="account-statement pt-3">
      <div className="container-fluid">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-header bg-gradient-color text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Account Statement</h5>
            <button
              className="btn btn-outline-light"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>

          {/* ------------------ FILTERS ------------------ */}
          {showFilters && (
            <div className="p-3 bg-light border-bottom d-flex gap-3 flex-wrap">
              <div>
                {/* <label>From (Leave empty for last 1 month)</label> */}
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  max={toDateState || todayStr}
                />
              </div>

              <div>
                {/* <label>To (Leave empty for today)</label> */}
                <input
                  type="date"
                  className="form-control"
                  value={toDateState}
                  onChange={(e) => setToDate(e.target.value)}
                  min={fromDate}
                  max={todayStr}
                />
              </div>

              <div>
                {/* <label>Show</label> */}
                <select
                  className="form-control"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>

              <div className="d-flex align-items-end gap-2">
                <button
                  className="btn btn-primary"
                  onClick={applyFilters}
                  disabled={loading}
                >
                  <FaSearch /> Apply
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={resetFilters}
                  disabled={loading}
                >
                  <FaRedoAlt /> Reset
                </button>
              </div>

              <div className="w-100 mt-2">
                {/* <small className="text-muted">
                  Note: Leaving dates empty will show data from last 1 month
                </small> */}
              </div>
            </div>
          )}

          {/* ------------------ ERROR ------------------ */}
          {error && (
            <div className="alert alert-danger m-3">
              {error}
              <button
                className="btn-close float-end"
                onClick={() => setError(null)}
              ></button>
            </div>
          )}

          {/* ------------------ TABLE ------------------ */}
          <div className="card-body">
            {loading ? (
              // <div className="text-center py-5">
              //   <div className="spinner-border text-primary"></div>
              //   <p>Loading...</p>
              // </div>

              <div className="loader-6">
                <div className="set-one">
                  <div className="circle "></div>
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
                  <table className="table table-bordered table-hover">
                    <thead className="table-primary">
                      <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Remark</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>From</th>
                      </tr>
                    </thead>

                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4 text-muted">
                            No data found
                          </td>
                        </tr>
                      ) : (
                        transactions.map((t, i) => (
                          <tr key={i}>
                            <td>{(currentPage - 1) * applied.size + i + 1}</td>
                            <td>
                              <span className={`fw-bold ${t.category === "Deposit" ? "text-success" :
                                t.category === "Withdraw" || t.category === "Withdrawal" ? "text-danger" :
                                  t.category === "Bonus" ? "text-warning" :
                                    t.category === "Commission" ? "text-info" :
                                      t.category === "Transfer" ? "text-primary" :
                                        "text-muted"
                                }`}>
                                {t.category || "N/A"}
                              </span>
                            </td>                            <td>{t.type}</td>
                            <td>{t.remark}</td>
                            <td>
                              <b
                                className={
                                  t.type === "Success" || t.category === "Deposit"
                                    ? "text-success"
                                    : "text-danger"
                                }
                              >
                                ₹{currency(t.amount)}
                              </b>
                            </td>
                            <td>{t.createdat?.slice(0, 10)}</td>
                            <td>{t.from || "System"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ------------------ PAGINATION ------------------ */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between mt-3">
                    <p className="text-muted">
                      Showing {(currentPage - 1) * applied.size + 1} to{" "}
                      {Math.min(currentPage * applied.size, totalItems)} of{" "}
                      {totalItems}
                    </p>

                    <ul className="pagination">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(currentPage - 1)}
                        >
                          <FaChevronLeft />
                        </button>
                      </li>

                      {getPageNumbers().map((p) => (
                        <li
                          key={p}
                          className={`page-item ${currentPage === p ? "active" : ""}`}
                        >
                          <button className="page-link" onClick={() => goToPage(p)}>
                            {p}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(currentPage + 1)}
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