import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Pages/EventBets.css";

function GetEventBets() {
  const admin_id = localStorage.getItem("admin_id");
  const event_id = localStorage.getItem("event_id");
  const token = localStorage.getItem("token");

  const [betsData, setBetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEventBets = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-sessions-pl`,
        {
          admin_id: admin_id,
          event_id: event_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Event Bets API Response:", res.data);

      if (res.data && res.data.status_code === 1 && Array.isArray(res.data.data)) {
        // 從響應中移除最後一個 TOTAL 對象（如果有）
        const userData = res.data.data.filter(item => item.username !== "TOTAL");
        setBetsData(userData);
      } else {
        setBetsData([]);
      }
    } catch (error) {
      console.error("Error fetching event bets", error?.response?.data || error.message);
      // setError("Failed to fetch event bets. Please try again.");
      setBetsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventBets();
  }, []);

  const formatNumber = (num) => {
    return num ? num.toFixed(2) : "0.00";
  };

  // 計算總計
  const calculateTotals = () => {
    return betsData.reduce(
      (acc, bet) => ({
        session_amt: acc.session_amt + (bet.session_amt || 0),
        total: acc.total + (bet.total || 0),
        session_comm: acc.session_comm + (bet.session_comm || 0),
        total_comm: acc.total_comm + (bet.total_comm || 0),
        my_share: acc.my_share + (bet.my_share || 0),
        net_pl: acc.net_pl + (bet.net_pl || 0),
      }),
      {
        session_amt: 0,
        total: 0,
        session_comm: 0,
        total_comm: 0,
        my_share: 0,
        net_pl: 0
      }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="card mt-4">
      <div className="card-header bg-color-black text-white">
        <h3 className="card-title text-white mb-0">Clients Session PL</h3>
      </div>
      
      <div className="card-body">
        <div className="event-bets-container">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="loading text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading event bets...</p>
            </div>
          ) : betsData.length === 0 ? (
            <div className="no-data-message text-center py-5">
              <h4 className="text-muted">NO DATA FOUND</h4>
              <p className="text-muted">No session PL data available</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="bets-table table table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                    <th className="text-white">CLIENT</th>
                    <th className="text-white">SESSION AMT.</th>
                    <th className="text-white">TOTAL</th>
                    <th className="text-white">SESSION COMM</th>
                    <th className="text-white">TOTAL COMM</th>
                    <th className="text-white">MY SHARE</th>
                    <th className="text-white">NET PL</th>
                  </tr>
                </thead>
                <tbody>
                  {betsData.map((bet, index) => (
                    <tr key={index}>
                      <td>{bet.username || "N/A"}</td>
                      <td>{formatNumber(bet.session_amt)}</td>
                      <td>{formatNumber(bet.total)}</td>
                      <td>{formatNumber(bet.session_comm)}</td>
                      <td>{formatNumber(bet.total_comm)}</td>
                      <td>{formatNumber(bet.my_share)}</td>
                      <td>
                        <span className={`${(bet.net_pl || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                          {formatNumber(bet.net_pl)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-secondary">
                    <td><strong>TOTAL</strong></td>
                    <td>{formatNumber(totals.session_amt)}</td>
                    <td>{formatNumber(totals.total)}</td>
                    <td>{formatNumber(totals.session_comm)}</td>
                    <td>{formatNumber(totals.total_comm)}</td>
                    <td>{formatNumber(totals.my_share)}</td>
                    <td>
                      <span className={`${totals.net_pl >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatNumber(totals.net_pl)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetEventBets;