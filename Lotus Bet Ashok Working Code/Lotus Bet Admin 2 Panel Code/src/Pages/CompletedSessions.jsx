import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Pages/EventBets.css";

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
        // `${process.env.REACT_APP_API_URL}/get-sessions-complete-pl`,
        `${process.env.REACT_APP_API_URL}/complete-game-session-pl`,
        {
          admin_id: admin_id,
          event_id: event_id,
          page: page,
          limit: pagination.pageSize
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Event Bets API Response:", res.data);

      if (res.data && res.data.status_code === 1) {
        if (Array.isArray(res.data.data)) {
          setBetsData(res.data.data);
          calculateTotals(res.data.data);
        } else {
          setBetsData([]);
        }

        if (res.data.pagination) {
          setPagination(prev => ({
            ...prev,
            currentPage: res.data.pagination.currentPage || page,
            totalPages: res.data.pagination.totalPages || 1,
            totalRecords: res.data.pagination.totalRecords || 0
          }));
        }
      } else {
        console.log("No data found or invalid response structure:", res.data);
        setBetsData([]);
      }
    } catch (error) {
      console.error(
        "Error fetching event bets",
        error?.response?.data || error.message
      );
      setError("Failed to fetch event bets. Please try again.");
      setBetsData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    if (!data || data.length === 0) {
      setTotals({
        totalCommPlus: 0,
        totalCommMinus: 0,
        totalPL: 0
      });
      return;
    }

    const totals = data.reduce(
      (acc, bet) => ({
        totalCommPlus: acc.totalCommPlus + (bet.comm_plus || 0),
        totalCommMinus: acc.totalCommMinus + (bet.comm_minus || 0),
        totalPL: acc.totalPL + (bet.pl || 0)
      }),
      {
        totalCommPlus: 0,
        totalCommMinus: 0,
        totalPL: 0
      }
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
    setPagination(prev => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1
    }));
    setTimeout(() => getEventBets(1), 0);
  };

  const formatNumber = (num) => {
    return num ? parseFloat(num).toFixed(2) : "0.00";
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key="first"
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          «
        </button>
      );
    }

    if (pagination.currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          className="pagination-btn"
        >
          ‹
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${pagination.currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (pagination.currentPage < pagination.totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          className="pagination-btn"
        >
          ›
        </button>
      );
    }

    if (endPage < pagination.totalPages) {
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(pagination.totalPages)}
          className="pagination-btn"
        >
          »
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="card mt-4">

      <div className="  card-header bg-color-black text-white d-flex justify-content-between flex-row align-items-center flex-md-nowrap">
        <h3 className="card-title text-white mb-0">Completed Sessions</h3>
        <div className="page-size-selector">
          <label htmlFor="pageSize" className="me-2 mb-0 text-white">Show:</label>
          <select
            id="pageSize"
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
            className="form-select form-select-sm"
            style={{ width: "50px" }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <div className="card-body">
        <div className="event-bets-container">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading event bets...</p>
            </div>
          ) : (
            <>
              {betsData.length === 0 ? (
                <div className="no-data-section">
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th className="text-white">S.No</th>
                          <th className="text-white">Runner Name</th>
                          <th className="text-white">Winrar</th>
                          <th className="text-white">Comm+</th>
                          <th className="text-white">Comm-</th>
                          <th className="text-white">PL</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                  <div className="text-center p-5">
                    <h4 className="text-muted">NO DATA FOUND</h4>
                    <p className="text-muted">There are no completed sessions to display.</p>
                  </div>
                  <div className="table-responsive">
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
                  </div>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th style={{color:"white"}}>S.No</th>
                          <th style={{color:"white"}}>Runner Name</th>
                          <th style={{color:"white"}}>Winrar</th>
                          <th style={{color:"white"}}>Comm+</th>
                          <th style={{color:"white"}}>Comm-</th>
                          <th style={{color:"white"}}>PL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {betsData.map((bet, index) => (
                          <tr key={index}>
                            <td>{bet.s_no || index + 1 + (pagination.currentPage - 1) * pagination.pageSize}</td>
                            <td>{bet.runner_name || "N/A"}</td>
                            <td>{bet.result_val || "N/A"}</td>
                            <td className={bet.comm_plus > 0 ? 'text-success fw-bold' : ''}>
                              {formatNumber(bet.comm_plus)}
                            </td>
                            <td className={bet.comm_minus > 0 ? 'text-danger fw-bold' : ''}>
                              {formatNumber(bet.comm_minus)}
                            </td>
                            <td className={bet.pl > 0 ? 'text-success fw-bold' : bet.pl < 0 ? 'text-danger fw-bold' : ''}>
                              {formatNumber(bet.pl)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="table-info fw-bold">
                          <td colSpan="2" className="text-end">TOTAL</td>
                          <td className={totals.totalCommPlus > 0 ? 'text-success' : ''}>
                            {formatNumber(totals.totalCommPlus)}
                          </td>
                          <td className={totals.totalCommMinus > 0 ? 'text-danger' : ''}>
                            {formatNumber(totals.totalCommMinus)}
                          </td>
                          <td className={totals.totalPL > 0 ? 'text-success' : totals.totalPL < 0 ? 'text-danger' : ''}>
                            {formatNumber(totals.totalPL)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  {pagination.totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <div className="text-muted">
                        Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{" "}
                        {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{" "}
                        {pagination.totalRecords} entries
                      </div>
                      <nav>
                        <ul className="pagination mb-0">
                          {renderPaginationButtons()}
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GetEventBets;