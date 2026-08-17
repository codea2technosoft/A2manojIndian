import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CompleteGameSessionPL } from "../../Server/api";

function MatchAndSessionPl() {
  const { event_id } = useParams();
  const admin_id = localStorage.getItem("admin_id");

  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===================== API CALL =======================
  const getEventBets = async () => {
    try {
      setLoading(true);

      const payload = {
        admin_id,
        event_id,
        page: 1,
        limit: 15,
      };

      const res = await CompleteGameSessionPL(payload);
      setFilteredData(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch event bets.");
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventBets();
  }, []);

  const getColor = (val) => {
    if (val > 0) return "limegreen";
    if (val < 0) return "red";
    return "black";
  };

  // ============= TOTAL CALCULATION ==================
  const total = filteredData.reduce(
    (acc, row) => {
      const matchAmt = Number(row.match_amt) || 0;
      const sessionAmt = Number(row.session_amt) || 0;

      const matchComm = Number(row.match_comm) || 0;
      const sessionComm = Number(row.session_comm) || 0;

      const totalComm = matchComm + sessionComm;

      acc.matchAmt += matchAmt;
      acc.sessionAmt += sessionAmt;
      // acc.total += matchAmt + sessionAmt;
      acc.total += Math.abs(matchAmt) + Math.abs(sessionAmt);
      acc.matchComm += matchComm;
      acc.sessionComm += sessionComm;
      acc.totalAmount += totalComm;

      return acc;
    },
    {
      matchAmt: 0,
      sessionAmt: 0,
      total: 0,
      matchComm: 0,
      sessionComm: 0,
      totalAmount: 0,
    }
  );

  return (
    <div className="card mt-4">
      <div className="card-header bg-color-black text-white d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">MATCH & SESSION P&L</h3>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>USERNAME</th>
                <th>MATCH AMT</th>
                <th>SESSION AMT</th>
                <th>TOTAL (MATCH + SESSION)</th>
                <th>MATCH COMM</th>
                <th>SESSION COMM</th>
                <th>TOTAL COMM</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="9">Loading...</td>
                </tr>
              )}

              {error && !loading && (
                <tr>
                  <td colSpan="9" style={{ color: "red" }}>
                    {error}
                  </td>
                </tr>
              )}

              {!loading &&
                filteredData.length > 0 &&
                filteredData.map((item, i) => {
                  const matchAmt = Number(item.match_amt) || 0;
                  const sessionAmt = Number(item.session_amt) || 0;

                  const matchComm = Number(item.match_comm) || 0;
                  const sessionComm = Number(item.session_comm) || 0;

                  const totalComm = matchComm + sessionComm;

                  const totalMatchSession =
                    Math.abs(matchAmt) + Math.abs(sessionAmt);

                  return (
                    <tr key={i}>
                      <td>{item.username}</td>

                      <td style={{ color: getColor(matchAmt) }}>
                        {matchAmt.toFixed(2)}
                      </td>

                      <td style={{ color: getColor(sessionAmt) }}>
                        {sessionAmt.toFixed(2)}
                      </td>

                      <td style={{ color: getColor(totalMatchSession) }}>
                        {totalMatchSession.toFixed(2)}
                      </td>

                      <td style={{ color: getColor(matchComm) }}>
                        {matchComm.toFixed(2)}
                      </td>

                      <td style={{ color: getColor(sessionComm) }}>
                        {sessionComm.toFixed(2)}
                      </td>

                      <td style={{ color: getColor(totalComm) }}>
                        {totalComm.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}

              {!loading && filteredData.length === 0 && (
                <tr>
                  <td colSpan="9">No Data Found</td>
                </tr>
              )}

              {!loading && filteredData.length > 0 && (
                <tr style={{ fontWeight: "bold", background: "#f7f7f7" }}>
                  <td>TOTAL</td>

                  <td style={{ color: getColor(total.matchAmt) }}>
                    {total.matchAmt.toFixed(2)}
                  </td>

                  <td style={{ color: getColor(total.sessionAmt) }}>
                    {total.sessionAmt.toFixed(2)}
                  </td>

                  <td style={{ color: getColor(total.total) }}>
                    {total.total.toFixed(2)}
                  </td>

                  <td style={{ color: getColor(total.matchComm) }}>
                    {total.matchComm.toFixed(2)}
                  </td>

                  <td style={{ color: getColor(total.sessionComm) }}>
                    {total.sessionComm.toFixed(2)}
                  </td>

                  <td style={{ color: getColor(total.totalAmount) }}>
                    {total.totalAmount.toFixed(2)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MatchAndSessionPl;