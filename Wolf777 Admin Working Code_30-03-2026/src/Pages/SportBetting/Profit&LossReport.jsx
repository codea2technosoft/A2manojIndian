import React, { useState } from "react";
import "../viewmatchAndFancy/Eventcss.scss"; // keep your existing styles
import { useNavigate } from "react-router-dom";
function ProfitAndLossReport() {
    const navigate = useNavigate();
  // Static data exactly matching your screenshot
  const staticBets = [
    {
      username: "CLI1 (C56396)",
      runner_name: "14 OVER RUN OMA",
      bet_type: "(NOT)",
      bet_price: "103",
      bet_size: "100",
      bet_amount: "100",
      status: "LOSS",
      winner: "111",
      place_time: "03-02-26 03:44:45", // adjusted year to match pattern
    },
    {
      username: "CLI1 (C56396)",
      runner_name: "15 OVER RUNS OMA",
      bet_type: "(NOT)",
      bet_price: "111",
      bet_size: "100",
      bet_amount: "200",
      status: "LOSS",
      winner: "116",
      place_time: "03-02-26 03:44:43",
    },
  ];

  const [betsData] = useState(staticBets);
  const [selectedSession] = useState("all"); // dummy - you can make it interactive later

  const formatNumber = (num) => {
    return num || "0";
  };

  return (
    <div className="card mt-4">
      {/* Top blue header like in image */}
      <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Bet Filter</h4>
        <button className="btn btn-sm btn-light"
           onClick={() => navigate(-1)}
        >Back</button>
      </div>

      {/* Filter section */}
      <div className="p-3 border-bottom">
        <div className="row  align-items-end">
          <div className="col-md-2">
            <label className="form-label fw-bold">SESSIONS *</label>
            <select className="form-select" value={selectedSession}>
              <option value="all">SELECT SESSION</option>
              {/* You can add more options later */}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">MASTER*</label>
            <select className="form-select">
              <option>SELECT MASTER</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">SUPER*</label>
            <select className="form-select">
              <option>SELECT SUPER</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">AGENT*</label>
            <select className="form-select">
              <option>SELECT AGENT</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label fw-bold">CLIENT*</label>
            <select className="form-select">
              <option>SELECT CLIENT</option>
            </select>
          </div>

          <div className="col-md-2">
            <button class="btn btn-primary">Reset</button>
          </div>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-bordered table-striped mb-0 bets-table">
            <thead className="bg-primary text-white">
              <tr>
                <th>USERNAME</th>
                <th>RUNNER NAME</th>
                <th>BET TYPE</th>
                <th>BET PRICE</th>
                <th>BET SIZE</th>
                <th>BET AMOUNT</th>
                <th>STATUS</th>
                <th>WINNER</th>
                <th>PLACE TIME</th>
              </tr>
            </thead>
            <tbody>
              {betsData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    NO DATA FOUND
                  </td>
                </tr>
              ) : (
                betsData.map((bet, index) => (
                  <tr key={index}>
                    <td>{bet.username}</td>
                    <td>{bet.runner_name}</td>
                    <td className="text-danger fw-bold">{bet.bet_type}</td>
                    <td>{formatNumber(bet.bet_price)}</td>
                    <td>{formatNumber(bet.bet_size)}</td>
                    <td>{formatNumber(bet.bet_amount)}</td>
                    <td className="text-danger fw-bold">{bet.status}</td>
                    <td>{bet.winner}</td>
                    <td>{bet.place_time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLossReport;