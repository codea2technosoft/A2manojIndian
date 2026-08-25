import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdFilterListAlt, MdRemoveRedEye } from "react-icons/md";
import axios from "axios";

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
  const { eventId ,bet_type } = useParams();

  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
          console.warn("res.data.summary ",summary )

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [betType, setBetType] = useState("all");

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });

  // ---------------- API CALL ----------------
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const payload = {
        fancy_id: eventId,
        bet_type: bet_type ,
        page,
        limit,
        // bet_type: betType,
        from_date: filters.from_date,
        to_date: filters.to_date,
      };

      const res = await axios.post(
        // "http://192.168.1.33:9005/api/admin/get-fancy-settled",
        `${process.env.REACT_APP_API_URL}/get-fancy-settled`,

        payload
      );

      // ✅ FIXED RESPONSE
      if (res.data?.success) {
        setData(res.data.market || []);
        setSummary(res.data.summary || {});
        console.warn("res.data.summary ",res )
        setTotalPages(res.data.totalPages || 1);
      } else {
        setData([]);
        setError(res.data?.message || "No data found");
      }
    } catch (err) {
      console.error(err);
      setError("Server Error");
    } finally {
      setLoading(false);
    }
  }, [eventId, page, limit, betType, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------------- FILTER ----------------
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
    setFilters({ from_date: "", to_date: "" });
    setPage(1);
    setFilterOpen(false);
  };

  // ---------------- PAGINATION ----------------
  const goToPreviousPage = () => page > 1 && setPage(page - 1);
  const goToNextPage = () => page < totalPages && setPage(page + 1);

  // ---------------- DATA MAPPING ----------------
  const rows = useMemo(() => {
    return data.map((item, i) => {
      let status = "PENDING";

      if (item.match_status === "1") status = "LOSS";
      else if (item.match_status === "2") status = "WIN";

      const { date, time } = formatDateTime(item.created_at);

      return {
        id: item._id || i,
        sn: (page - 1) * limit + i + 1,
        date,
        time,
        team: item.team,
        created_at: item.created_at,
        mobile: item.mobile,
        betType: item.bet_type,
        stake: item.stake,
        bet_on: item.bet_on,
        odd: item.odd,
        bet_on: item.bet_on,
        total: item.total,
        win: item.bet_win_amount,
        loss: item.fancy_withdraw,
        result_val: item.result_val,
        net: item.total,
        status,
        event_id: item.event_id,
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
      <div className="card-header d-flex justify-content-between">
        <h3>Bet  User Report</h3>
        <div>
          <button
            className="btn btn-light me-2"
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
            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                value={selectedEndDate}
                onChange={(e) => setSelectedEndDate(e.target.value)}
              />
            </div>

            <div className="col-md-2">
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

            <div className="col-md-2">
              <select
                className="form-control"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button className="btn btn-primary" onClick={handleFilter}>
                Apply
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {/* <div className="row mb-3">
          <div className="col text-success">
            Win: ₹{currency(summary.admin_win_amount)}
          </div>
          <div className="col text-danger">
            Loss: ₹{currency(summary.admin_loss_amount)}
          </div>
          <div className="col">
            Profit: ₹{currency(summary.total_profit)}
          </div>
        </div> */}

        {/* TABLE */}
        {loading ? (
          <div className="text-center">
            <div className="spinner-border"></div>
          </div>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Team</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Odd</th>
                <th>Stake</th>
                <th>Result </th>
                {/* <th>Win</th>
                <th>Loss</th>
                <th>Net</th>
                <th>Status</th> */}
                {/* <th>View</th> */}
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center">
                    No Data
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id}>
                    <td>{r.sn}</td>
                    <td>
                      {new Date(r.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </td>                    <td>{r.team}</td>
                    <td>{r.mobile}</td>
                    <td>
                      <span style={{ fontWeight: "bold" }}>
                        {r.betType} /
                      </span>
                      <span style={{ color: r.bet_on === "lay" ? "red" : "green" }}>
                        {r.bet_on}
                      </span>
                    </td>                    <td>{r.odd}/ {r.total}</td>
                    <td>₹{currency(r.stake)}</td>
                    <td>{r.result_val}</td>
                    {/* <td className="text-success">
                      {r.win ? `₹${currency(r.win)}` : "-"}
                    </td>
                    <td className="text-danger">
                      {r.loss ? `₹${currency(r.loss)}` : "-"}
                    </td>
                    <td>₹{currency(r.net)}</td>
                    <td>{getStatusBadge(r.status)}</td> */}
                    {/* <td>
                      <MdRemoveRedEye
                        size={20}
                        onClick={() =>
                          navigate(`/datewise_bet_user_report/${r.event_id}`)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-end">
            <button onClick={goToPreviousPage} disabled={page === 1}>
              Prev
            </button>
            <span className="mx-2">{page}</span>
            <button onClick={goToNextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}