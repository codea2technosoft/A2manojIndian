import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CompleteGameSessionPL } from "../../Server/api";
import "../viewmatchAndFancy/Eventcss.scss";

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

  // const getColor = (val) => {
  //   if (val > 0) return "limegreen";
  //   if (val < 0) return "red";
  //   return "black";
  // };

  // ============= TOTAL CALCULATION ==================
  const total = filteredData.reduce(
    (acc, row) => {
      acc.sessionAmt += Number(row.session_amt) || 0;
      acc.total += Number(row.total) || 0;

      acc.sessionComm += Number(row.session_comm) || 0;
      acc.totalComm += Number(row.total_comm) || 0;

      acc.totalAmount += Number(row.total_amount) || 0;
      acc.myShare += Number(row.my_share) || 0;
      acc.netPL += Number(row.net_pl) || 0;

      return acc;
    },
    {
      sessionAmt: 0,
      total: 0,
      sessionComm: 0,
      totalComm: 0,
      totalAmount: 0,
      myShare: 0,
      netPL: 0,
    }
  );

  return (
    <div className="card mt-4">
      <div className="card-header bg-color-black text-white d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0"> SESSION P&L</h3>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>USERNAME</th>
                {/* <th>MATCH AMT</th> */}
                <th>SESSION AMT</th>
                <th>TOTAL</th>
                {/* <th>MATCH COMM</th> */}
                <th>SESSION COMM</th>
                <th>TOTAL COMM</th>
                <th>TOTAL AMOUNT</th>
                <th>MY SHARE</th>
                <th>NET PL</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="10">Loading...</td>
                </tr>
              )}

              {error && !loading && (
                <tr>
                  <td colSpan="10" style={{ color: "red" }}>{error}</td>
                </tr>
              )}

              {!loading &&
                filteredData.length > 0 &&
                filteredData.map((item, i) => {
                  const data = {
                    matchAmt: 0,
                    sessionAmt: Number(item.session_amt) || 0,
                    total: Number(item.total) || 0,
                    sessionComm: Number(item.session_comm) || 0,
                    totalComm: Number(item.total_comm) || 0,
                    totalAmount: Number(item.total_amount) || 0,
                    myShare: Number(item.my_share) || 0,
                    netPL: Number(item.net_pl) || 0,
                  };

                  return (
                    <tr key={i}>
                      <td>{item.username}</td>

                      {/* <td style={{ color: "red" }}>0.00</td> */}

                      <td>
                        {data.sessionAmt.toFixed(2)}
                      </td>

                      <td >
                        {data.total.toFixed(2)}
                      </td>

                      {/* <td style={{ color: "red" }}>0.00</td> */}

                      <td >
                        {data.sessionComm.toFixed(2)}
                      </td>

                      <td >
                        {data.totalComm.toFixed(2)}
                      </td>

                      <td >
                        {data.totalAmount.toFixed(2)}
                      </td>

                      <td >
                        {data.myShare.toFixed(2)}
                      </td>

                      <td>
                        {data.netPL.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}

              {!loading && filteredData.length === 0 && (
                <tr>
                  <td colSpan="10">No Data Found</td>
                </tr>
              )}

              {!loading && filteredData.length > 0 && (
                <tr style={{ fontWeight: "bold", background: "#f7f7f7" }}>
                  <td>TOTAL</td>

                  {/* <td style={{ color: "red" }}>0.00</td> */}

                  <td >
                    {total.sessionAmt.toFixed(2)}
                  </td>

                  <td>
                    {total.total.toFixed(2)}
                  </td>

                  {/* <td style={{ color: "red" }}>0.00</td> */}

                  <td>
                    {total.sessionComm.toFixed(2)}
                  </td>

                  <td>
                    {total.totalComm.toFixed(2)}
                  </td>

                  <td>
                    {total.totalAmount.toFixed(2)}
                  </td>

                  <td >
                    {total.myShare.toFixed(2)}
                  </td>

                  <td>
                    {total.netPL.toFixed(2)}
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
