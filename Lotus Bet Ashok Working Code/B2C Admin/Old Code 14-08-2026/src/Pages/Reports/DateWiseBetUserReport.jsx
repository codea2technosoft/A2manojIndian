import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getdatewiseBetUserReport } from "../../Server/api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { MdFilterListAlt, MdRemoveRedEye } from "react-icons/md";

// ---------------- HELPERS ----------------
const currency = (n = 0) =>
  parseFloat(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDateTime = (d) => {
  if (!d) return { date: "-", time: "-" };
  const date = new Date(d);
  return {
    date: date.toLocaleDateString("en-IN"),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

// ---------------- COMPONENT ----------------
export default function DateWiseBetUserReport() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0); // total records across all pages
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(200);
  const [betType, setBetType] = useState("all");

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });
  const { eventId } = useParams();

  // Compute total pages based on total count and limit
  const totalPages = useMemo(() => Math.ceil(totalCount / limit) || 1, [totalCount, limit]);

  // Reset to page 1 when limit or betType changes (so we don't stay on an out-of-range page)
  useEffect(() => {
    setPage(1);
  }, [limit, betType]);

  // If current page exceeds totalPages after filter change, reset to last valid page
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // ---------------- API CALL ----------------
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        event_id: eventId,
        page,
        limit,
        bet_type: betType,
        from_date: filters.from_date,
        to_date: filters.to_date,
      };
      const res = await getdatewiseBetUserReport(payload);

      if (res.data?.status_code === 1) {
        setData(res.data.data || []);
        setSummary(res.data.summary || {});
        // Assuming backend returns total count as total_records or total_count
        // Adjust according to your actual API response key
        const total = res.data.total_count || res.data.total || 0;
        setTotalCount(total);
      } else {
        setData([]);
        setTotalCount(0);
        setError(res.data?.message || "No data found");
      }
    } catch (err) {
      console.error(err);
      setError("Server Error");
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [eventId, page, limit, betType, filters.from_date, filters.to_date]);

  // Pagination handlers
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = () => {
    setPage(1);
    setFilters({
      from_date: selectedStartDate,
      to_date: selectedEndDate,
    });
  };

  const handleReset = () => {
    setSelectedStartDate("");
    setSelectedEndDate("");
    setFilters({
      from_date: "",
      to_date: "",
    });
    setBetType("all");
    setLimit(200);
    setFilterOpen(false);
    setPage(1);
  };

  // ---------------- DATA ----------------
  const rows = useMemo(() => {
    return data.map((item, i) => {
      let win = 0,
        loss = 0,
        status = "PENDING";

      if (item.match_status === "1") {
        win = Number(item.loss_amount) || 0;
        status = "WIN";
      } else if (item.match_status === "2") {
        loss = Number(item.win_amount) || 0;
        status = "LOSS";
      }

      const { date, time } = formatDateTime(item.created_at);

      return {
        id: item._id || i,
        sn: (page - 1) * limit + i + 1,
        date,
        time,
        team: item.team_name,
        mobile: item.mobile,
        betType: item.bet_type,
        stake: item.stake,
        amount: item.amount,
        bet_on: item.bet_on,
        odd: item.odd,
        total: item.total,
        market_id: item.market_id,
        bet_type: item.bet_type,
        win: item.win_amount,
        loss: item.loss_amount,
        net: item.amount,
        status,
        match_status: item.match_status,
      };
    });
  }, [data, page, limit]);

  // ---------------- STATUS BADGE ----------------
  const getStatusBadge = (status) => {
    if (status === "WIN") return <span className="badge bg-success">WIN</span>;
    if (status === "LOSS") return <span className="badge bg-danger">LOSS</span>;
    return <span className="badge bg-warning text-dark">PENDING</span>;
  };

  return (
    <div className="card">
      {/* HEADER */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="card-title">Bet Report</h3>
        <div className="d-flex gap-2">
          <button
            className="btn btn-light"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <MdFilterListAlt /> Filter
          </button>
          <button className="btn btn-light" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* FILTER */}
        {filterOpen && (
          <div className="row mb-3">
            <div className="col-md-12 d-flex gap-2 align-items-end">
              <div className="w-100">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedStartDate}
                  onChange={(e) => setSelectedStartDate(e.target.value)}
                />
              </div>

              <div className="w-100">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedEndDate}
                  onChange={(e) => setSelectedEndDate(e.target.value)}
                />
              </div>

              <div className="w-100">
                <label>Bet Type</label>
                <select
                  className="form-control"
                  value={betType}
                  onChange={(e) => setBetType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="fancy">Fancy</option>
                  <option value="bookmaker">Bookmaker</option>
                </select>
              </div>

              <div className="w-100">
                <label>Limit</label>
                <select
                  className="form-control"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={300}>300</option>
                  <option value={400}>400</option>
                  <option value={2000}>2000</option>
                </select>
              </div>

              <button className="btn btn-primary" onClick={handleFilter}>
                Apply
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        <div className="row mb-3">
          <div className="col-md-4 text-success">
            <b> User Win:</b> ₹{currency(summary.admin_win_amount)}
          </div>
          <div className="col-md-4 text-danger">
            <b> User Loss:</b> ₹{currency(summary.admin_loss_amount)}
          </div>
   <div className="col-md-4">
  <b
    className={
      summary.total_profit < 0 ? "text-danger" : "text-success"
    }
  >
    {summary.total_profit < 0
      ? `User Loss: ₹${currency(Math.abs(summary.total_profit))}`
      : `User Profit: ₹${currency(summary.total_profit)}`}
  </b>
</div>
        </div>

        {/* LOADER */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border"></div>
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Team</th>
                  {/* <th>Phone</th> */}
                  <th>Type</th>
                  {/* <th>odd</th>
                  <th>Stake</th> */}
                  <th>P/L</th>
                  {/* <th>Status</th> */}
                  <th>View</th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td>{r.sn}</td>
                      <td>
                        {r.date}
                        <br />
                        <small>{r.time}</small>
                      </td>
                      <td>
                        {r.team}
                        {/* <span
                          className={
                            r.bet_on?.toLowerCase() === "lay"
                              ? "text-danger fw-bold"
                              : "text-success fw-bold"
                          }
                        >
                          {r.bet_on}
                        </span> */}
                      </td>
                      {/* <td>{r.mobile}</td> */}
                      <td>{r.betType}</td>
                      {/* <td>
                        {r.odd}/ {r.total}
                      </td>
                      <td>₹{currency(r.stake)}</td> */}
                      <td
                        className={
                          r.amount > 0 ? "text-success" : "text-danger"
                        }
                      >
                        {r.amount > 0 ? "User Plus " + r.amount : "User Minus " + r.amount}
                        {/* {r.match_status === "1" ? r.stake : -r.win} */}
                      </td>
                      {/* <td>{getStatusBadge(r.status)}</td> */}
                      <td className="text-center">
                        <MdRemoveRedEye
                          size={22}
                          title="View Details"
                          onClick={() => navigate(`/Getfancysettled/${r.market_id}/${r.bet_type}`)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ENHANCED PAGINATION - exactly matching the requested UI snippet */}
        {totalCount > 0 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted small">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalCount)} of {totalCount}
            </span>

            <ul className="custom-pagination pagination mb-0">
              {/* Prev Button */}
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={goToPreviousPage}
                  disabled={page === 1 || loading}
                >
                  &laquo;
                </button>
              </li>

              {/* Dynamic Page Numbers (current-1, current, current+1) */}
              {[page - 1, page, page + 1]
                .filter((p) => p > 0 && p <= totalPages)
                .map((p) => (
                  <li
                    key={p}
                    className={`page-item ${page === p ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => goToPage(p)}
                      disabled={loading}
                    >
                      {p}
                    </button>
                  </li>
                ))}

              {/* Next Button */}
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={goToNextPage}
                  disabled={page === totalPages || loading}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}