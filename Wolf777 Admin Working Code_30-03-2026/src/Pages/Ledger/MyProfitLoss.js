import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import moment from "moment";

import { getMatchLedger } from "../../Server/api";

function MyProfitAndLoss() {
  const navigate = useNavigate();

  // ---------------- STATES ----------------
  const admin_id = localStorage.getItem("admin_id");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("all");

  const [totalRecords, setTotalRecords] = useState(0);

  const [summary, setSummary] = useState({
    lena: 0,
    dena: 0,
    balance: 0,
  });

  // ---------------- API CALL ----------------
  const fetchMatchLedger = async () => {
    try {
      setLoading(true);

      const payload = {
        admin_id,
        page,
        limit,
        start_date: startDate,
        end_date: endDate,
      };

      const res = await getMatchLedger(payload);
      console.log("Profit & Loss API:", res);

      if (res?.data?.success) {
        // ✅ REAL ARRAY
        setRows(res.data.data?.data || []);
        setTotalRecords(res.data.data?.total || 0);

        // ✅ SUMMARY
        setSummary({
          lena: res.data.lena || 0,
          dena: res.data.dena || 0,
          balance: res.data.balance || 0,
        });
      } else {
        setRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Match Ledger Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- USE EFFECT ----------------
  useEffect(() => {
    fetchMatchLedger();
  }, [page, limit]);

  // ---------------- PAGINATION ----------------
  const totalPages =
    limit === "all" ? 1 : Math.ceil(totalRecords / Number(limit));

  // ---------------- JSX ----------------
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">

          {/* HEADER */}
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white mb-0">MATCH PROFIT  LOSS</h3>

              <div
                className="backbutton"
                onClick={() => navigate(-1)}
              >
                <BsArrowLeft className="me-1" /> Back
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="card-body">

            {/* FILTERS */}
            <div className="row mb-4 align-items-end">
              {/* <div className="col-md-3">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label>&nbsp;</label>
                <Button
                  className="w-100"
                  style={{ backgroundColor: "#000", borderColor: "#000" }}
                  onClick={() => {
                    setPage(1);
                    fetchMatchLedger();
                  }}
                >
                  Search
                </Button>
              </div> */}

              <div className="col-md-3 text-start">
                <h4 className="totalprofitloss">
                  TOTAL:{" "}
                  <span
                    style={{
                      color:
                        summary.balance >= 0 ? "#28a745" : "#dc3545",
                    }}
                  >
                    {summary.balance.toFixed(2)}
                  </span>
                </h4>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    {/* <th>Date</th> */}
                    <th>Tittle</th>
                    <th>PL</th>
                    <th>COMM+</th>
                    <th>COMM-</th>
                    <th>NET PL</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-4">
                        <strong>Loading...</strong>
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4">
                        <strong>No Data Found</strong>
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r._id}>
                        <td>
                          {/* {moment(r.created_at).format("DD-MM-YYYY")} */}
                        </td>

                        <td>{r.comment}</td>

                        <td>
                          <span className="fw-bold text-primary">
                            {r.winner || "-"}
                          </span>
                        </td>

                        <td className="fw-bold text-success">
                          {r.credit > 0 ? r.credit : "-"}
                        </td>

                        <td className="fw-bold text-danger">
                          {r.debit > 0 ? r.debit : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="d-flex justify-content-end mt-3 gap-2">
              <button
                className="btn btn-light"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <MdOutlineKeyboardArrowLeft size={20} />
              </button>

              <button
                className="btn btn-light"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <MdOutlineKeyboardArrowRight size={20} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfitAndLoss;
