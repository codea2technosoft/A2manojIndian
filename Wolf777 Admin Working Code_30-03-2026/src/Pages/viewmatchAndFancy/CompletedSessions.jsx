import React, { useState, useEffect } from "react";
import axios from "axios";
import "../viewmatchAndFancy/Eventcss.scss";

function GetEventBets() {
  const admin_id = localStorage.getItem("admin_id");
  const event_id = localStorage.getItem("event_id");
  const token = localStorage.getItem("token");

  const [betsData, setBetsData] = useState([]);
  const [totals, setTotals] = useState({
    totalCommPlus: 0,
    totalCommMinus: 0,
    totalPL: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 15
  });

  const getEventBets = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-sessions-complete-pl`,
        {
          admin_id,
          event_id,
          page,
          limit: pagination.pageSize
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data?.status_code === 1) {
        const dataArr = Array.isArray(res.data.data) ? res.data.data : [];
        setBetsData(dataArr);
        calculateTotals(dataArr);

        if (res.data.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: res.data.pagination.currentPage || page,
            totalPages: res.data.pagination.totalPages || 1,
            totalRecords: res.data.pagination.totalRecords || 0
          }));
        }
      } else {
        setBetsData([]);
      }
    } catch (err) {
      setError("Failed to fetch event bets. Please try again.");
      setBetsData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    if (!data.length) {
      setTotals({ totalCommPlus: 0, totalCommMinus: 0, totalPL: 0 });
      return;
    }

    const totals = data.reduce(
      (acc, bet) => ({
        totalCommPlus: acc.totalCommPlus + (bet.comm_plus || 0),
        totalCommMinus: acc.totalCommMinus + (bet.comm_minus || 0),
        totalPL: acc.totalPL + (bet.pl || 0)
      }),
      { totalCommPlus: 0, totalCommMinus: 0, totalPL: 0 }
    );

    setTotals(totals);
  };

  useEffect(() => {
    getEventBets(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      getEventBets(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, pageSize: newSize, currentPage: 1 }));
    setTimeout(() => getEventBets(1), 0);
  };

  const formatNumber = (num) => {
    return num ? parseFloat(num).toFixed(2) : "0.00";
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let start = Math.max(1, pagination.currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(pagination.totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    if (start > 1)
      buttons.push(<button key="first" onClick={() => handlePageChange(1)} className="pagination-btn">«</button>);

    if (pagination.currentPage > 1)
      buttons.push(<button key="prev" onClick={() => handlePageChange(pagination.currentPage - 1)} className="pagination-btn">‹</button>);

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${pagination.currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (pagination.currentPage < pagination.totalPages)
      buttons.push(<button key="next" onClick={() => handlePageChange(pagination.currentPage + 1)} className="pagination-btn">›</button>);

    if (end < pagination.totalPages)
      buttons.push(<button key="last" onClick={() => handlePageChange(pagination.totalPages)} className="pagination-btn">»</button>);

    return buttons;
  };

  return (
    <div className="card mt-4">

      {/* HEADER */}
      <div className="card-header bg-color-black text-white d-flex justify-content-between align-items-center">
        <h3 className="card-title text-white mb-0 ">Completed Sessions</h3>

        <select
          value={pagination.pageSize}
          onChange={handlePageSizeChange}
          className="form-select form-select-sm"
          style={{ width: "80px" }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div className="card-body">

        {/* ERROR */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* LOADING UI */}
        {loading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary"></div>
            <p className="mt-2">Loading event bets...</p>
          </div>
        ) : betsData.length === 0 ? (
          <>
            <h4 className="text-muted text-center p-4">NO DATA FOUND</h4>

            <table className="table table-striped">
              <tbody>
                <tr className="table-info">
                  <td><strong>TOTAL</strong></td>
                  <td>-</td>
                  <td>0.00</td>
                  <td>0.00</td>
                  <td>0.00</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>
            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Runner Name</th>
                    {/* <th>Status</th> */}
                    <th>Comm+</th>
                    <th>Comm-</th>
                    <th>PL</th>
                  </tr>
                </thead>

                <tbody>
                  {betsData.map((bet, index) => (
                    <tr key={index}>
                      <td>{index + 1 + (pagination.currentPage - 1) * pagination.pageSize}</td>
                      <td>{bet.runner_name || "N/A"}</td>

                      {/* match_status nahi mil raha → safer fixed value */}
                      {/* <td>N/A</td> */}

                      <td className={bet.comm_plus > 0 ? "text-success fw-bold" : ""}>
                        {formatNumber(bet.commission)}
                      </td>

                      <td className={bet.comm_minus < 0 ? "text-danger fw-bold" : ""}>
                        {formatNumber(bet.commission)}
                      </td>

                      <td
                        className={
                          bet.pl > 0 ? "text-success fw-bold" :
                          bet.pl < 0 ? "text-danger fw-bold" : ""
                        }
                      >
                        {formatNumber(bet.pl)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="table-info fw-bold">
                    <td colSpan="2" className="text-end">TOTAL</td>
                    <td>{formatNumber(totals.totalCommPlus)}</td>
                    <td>{formatNumber(totals.totalCommMinus)}</td>
                    <td>{formatNumber(totals.totalPL)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-between mt-3">
                <small>
                  Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{" "}
                  {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{" "}
                  {pagination.totalRecords}
                </small>

                <div className="pagination-controls">{renderPaginationButtons()}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GetEventBets;
