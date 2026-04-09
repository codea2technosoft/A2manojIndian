import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AllBetHistory() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
    limit: 20
  });

  // ✅ Default start date (one month ago)
  const defaultStartDate = "2026-01-01";
  const defaultEndDate = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [error, setError] = useState("");
  const [mobileShowFilters, setMobileShowFilters] = useState(false);

  const userId = localStorage.getItem("user_id");
  const baseUrl = process.env.REACT_APP_BACKEND_API;

  // ✅ Fetch Bets with pagination
  const fetchMyBets = async (page = 1) => {
    try {
      if (!userId) {
        setError("User not logged in");
        return;
      }
      setLoading(true);
      setError("");

      // ✅ Date validation
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end)) {
        setError("Invalid date");
        setLoading(false);
        return;
      }

      if (start > end) {
        setError("Start date cannot be greater than end date");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${baseUrl}/all-bet`,
        {
          user_id: userId,
          start_date: startDate,
          end_date: endDate,
          page: page, // Add page parameter
          limit: pagination.limit // Add limit parameter
        },
        { timeout: 15000 }
      );

      if (res.data?.status_code === 1) {
        setBets(res.data.data || []);
        // Update pagination from API response
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      } else {
        setBets([]);
        setPagination({
          current_page: 1,
          total_pages: 1,
          total_records: 0,
          limit: 20
        });
        setError(res.data?.message || "No data found");
      }
    } catch (err) {
      setError(err.message || "API Error");
      setBets([]);
      setPagination({
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        limit: 20
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch bets when component mounts or when dates change
  useEffect(() => {
    fetchMyBets(1); // Always fetch page 1 on date change
  }, [startDate, endDate]);

  // ✅ Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchMyBets(page);
    }
  };

  // ✅ RESET FUNCTION
  const handleReset = () => {
    // ✅ Date को default values पर reset करें
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);

    // ✅ Error clear करें
    setError("");

    // ✅ Fetch first page
    fetchMyBets(1);

    // ✅ Filters को close करें (mobile के लिए)
    setMobileShowFilters(false);
  };

  // ✅ Utils
  const formatDate = (d) =>
    new Date(d).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(v || 0);

  const profitLoss = (b) =>
    b.bet_type === "fancy"
      ? (b.fancy_withdraw || 0) - (b.fancy_deposit || 0)
      : b.liability || 0;

  // ✅ Generate page numbers for pagination
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
    <section className="pt-3">
      <div className="container-fluid">
        <div className="card shadow">

          {/* HEADER */}
          <div className="card-header p-2 d-flex justify-content-between align-items-center">
            <h5 className="text-light mb-0">All Bet History</h5>
            <div className="d-flex align-items-center">
              <span className="text-light me-3 d-none d-md-block">
                Total: {pagination.total_records} bets
              </span>
              <button
                className="btn btn-sm btn-light d-md-none"
                onClick={() => setMobileShowFilters(!mobileShowFilters)}
              >
                Filters
              </button>
            </div>
          </div>

          {/* FILTERS */}
          <div className={`card-body border-bottom ${mobileShowFilters ? "" : "d-none d-md-block"}`}>
            <div className="row g-2">
              <div className="col-md-4">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="col-md-4 d-flex align-items-end gap-2">
                <button
                  className="btn btn-primary w-50"
                  onClick={() => fetchMyBets(1)}
                >
                  Search
                </button>
                <button
                  className="btn btn-secondary w-50"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="alert alert-danger m-3">{error}</div>
          )}

          {/* TABLE */}
          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading bets...</p>
              </div>
            ) : bets.length === 0 ? (
              <p className="text-center text-muted py-4">No bets found</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ color: "white" }}>#</th>
                        <th style={{ color: "white" }}>Team</th>
                        <th style={{ color: "white" }}>Bet On</th>
                        <th style={{ color: "white" }}>Price</th>
                        <th style={{ color: "white" }}>Amount</th>
                        <th style={{ color: "white" }}>P/L</th>
                        <th style={{ color: "white" }}>Status</th>
                        <th style={{ color: "white" }}>Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {bets.map((b, i) => {
                        const pl = profitLoss(b);
                        const index = (pagination.current_page - 1) * pagination.limit + i + 1;

                        return (
                          <tr key={b._id || i}>
                            <td>{index}</td>
                            <td>{b.team}</td>
                            <td
                              className={`fw-bold ${b.bet_on === "back" ? "text-success" : "text-danger"}`}
                            >
                              {/* {b.bet_on === "back" ? "Yes" : "No"} */}

                                   <span
  className={`badge ${
    b.bet_on === "back" ? "bg-success" : "bg-danger"
  }`}
>
  {
    b.bet_type === "bookmaker"
      ? (b.bet_on === "back" ? "LAGAI" : "KHAI")
      : (b.bet_on === "lay" ? "No" : "Yes")
  }
</span>
                            </td>
                            <td>{b.odd}/{b.total}</td>

                            <td>{formatCurrency(b.stake)}</td>
                            <td>
                              {((b.bet_win_amount || 0) + (b.comissionAmount || 0)).toFixed(2)}
                            </td>
                            <td>
                              <span className={`badge ${b.match_status === "1" ? "bg-success" : b.match_status === "2" ? "bg-danger" : "bg-warning"}`}>
                                {b.match_status === "1" ? "Win" : b.match_status === "2" ? "Loss" : "Pending"}
                              </span>
                            </td>
                            <td>{formatDate(b.created_at)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted d-none d-md-block">
                    Showing {(pagination.current_page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(pagination.current_page * pagination.limit, pagination.total_records)} of{" "}
                    {pagination.total_records} bets
                  </div>

                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${pagination.current_page === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1}
                        >
                          Previous
                        </button>
                      </li>

                      {getPageNumbers().map((page) => (
                        <li key={page} className={`page-item ${page === pagination.current_page ? "active" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                      <li className={`page-item ${pagination.current_page === pagination.total_pages ? "disabled" : ""}`}>
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

                {/* Mobile pagination info */}
                <div className="d-block d-md-none text-center mt-3">
                  <div className="text-muted mb-2">
                    Page {pagination.current_page} of {pagination.total_pages} • {pagination.total_records} total bets
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}