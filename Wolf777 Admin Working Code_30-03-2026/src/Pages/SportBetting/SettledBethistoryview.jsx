import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { MdFilterListAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
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
export default function AccountStatement() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [betType, setBetType] = useState("all");

  const [filterOpen, setFilterOpen] = useState(false);

  const baseUrl = process.env.REACT_APP_API_URL;
  const eventId = localStorage.getItem("event_id");
  const admin_id = localStorage.getItem("admin_id");

  // API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.post(`${baseUrl}/match-profit-loss-bet-list`, {
        event_id: eventId,
        admin_id,
        page,
        limit,
        // bet_type: betType !== "all" ? betType : undefined,
        bet_type: betType,
      });

      if (res.data.status_code === 1) {
        setData(res.data.data || []);
        setSummary(res.data.summary || {});
      } else {
        setData([]);
        setError(res.data.message || "No Data");
      }
    } catch (err) {
      setError("Server Error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, betType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // DATA MAPPING
  const rows = useMemo(() => {
    return data.map((item, i) => {
      // let win = 0,
      //   loss = 0,
      //   status = "PENDING";
      const win = Number(item.win_amount) || 0;
      const loss = Number(item.loss_amount) || 0;
      // if (item.match_status === "1") {
      //   win = Number(item.bet_win_amount) || 0;
      //   status = "WIN";
      // } else if (item.match_status === "2") {
      //   loss = Number(item.stake) || 0;
      //   status = "LOSS";
      // }

      // ✅ match_status mapping
      let status = "PENDING";

      if (item.match_status === "1") {
        status = "LOSS";   // ✅ uppercase
      }
      else if (item.match_status === "2") {
        status = "WIN";   
      }
      else if (item.match_status === "3") {
        status = "PENDING";
      }
      const net = win - loss;
      const { date, time } = formatDateTime(item.created_at);

      return {
        id: item._id || i,
        sn: (page - 1) * limit + i + 1,
        date,
        time,
        team: item.team_name || item.market_name,
        mobile: item.mobile,
        betType: item.bet_type,
        stake: item.stake,
        win: item.win_amount,
        loss: item.loss_amount,
        net,
        status
      };
    });
  }, [data, page, limit]);

  const badge = (status) => {
    if (status === "WIN") {
      return <span className="badge bg-success">WIN</span>;
    }
    if (status === "LOSS") {
      return <span className="badge bg-danger">LOSS</span>;
    }
    return <span className="badge bg-warning text-dark">PENDING</span>;
  };

  return (
    <div className="card mt-3">
      {/* HEADER */}
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">

        {/* LEFT SIDE */}
        <h4 className="text-white mb-0">Admin Bet History</h4>

        {/* RIGHT SIDE BUTTONS */}
        <div className="d-flex align-items-center gap-2">

          <button
            className="refeshbutton"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <MdFilterListAlt /> Filter
          </button>

          <button
            className="refeshbutton"
            onClick={() => navigate(-1)}
          >
            Back
          </button>

        </div>

      </div>

      <div className="card-body">

        {/* FILTER */}
        {filterOpen && (
          <div className="card card-body bg-light mb-3">
            <div className="d-flex gap-2 align-items-end">

              <div>
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

              <div>
                <label>Limit</label>
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
              <button className="btn btn-primary" onClick={fetchData}>
                Apply
              </button>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        <div className="row mb-3">
          <div className="col-md-4 text-success">
            <b>Win:</b> ₹{currency(summary.total_win_amount)}
          </div>
          <div className="col-md-4 text-danger">
            <b>Loss:</b> ₹{currency(summary.total_loss_amount)}
          </div>
          <div className="col-md-4">
            <b>Profit:</b> ₹{currency(summary.total_profit)}
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
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Team</th>
                  <th>Mobile</th>
                  <th>Type</th>
                  {/* <th>Stake</th> */}
                  <th>Win</th>
                  <th>Loss</th>
                  {/* <th>Net</th> */}
                  <th>Status</th>
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

                      <td>{r.team}</td>
                      <td>{r.mobile}</td>
                      <td>{r.betType}</td>

                      {/* <td>₹{currency(r.stake)}</td> */}

                      <td className="text-success">
                        {r.win ? `₹${currency(r.win)}` : "-"}
                      </td>

                      <td className="text-danger">
                        {r.loss ? `₹${currency(r.loss)}` : "-"}
                      </td>

                      {/* <td>
                        {r.net !== 0
                          ? `₹${currency(Math.abs(r.net))} ${r.net > 0 ? "P" : "L"
                          }`
                          : "-"}
                      </td> */}

                      <td>{badge(r.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button
            className="btn btn-outline-secondary"
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>


      </div>
    </div>
  );
}