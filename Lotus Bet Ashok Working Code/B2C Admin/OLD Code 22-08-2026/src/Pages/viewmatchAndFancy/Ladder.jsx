import React, { useState, useEffect } from "react";
import axios from "axios";
// import "../Pages/EventBets.css";

function Ladder() {
  const admin_id = localStorage.getItem("admin_id");
  const event_id = localStorage.getItem("event_id");
  const token = localStorage.getItem("token");
  const fancyId_new = localStorage.getItem("fancyId");

  const [betsData, setBetsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({
    totalSessionAmount: 0,
    totalSessionComm: 0,
    totalComm: 0,
    totalAmount: 0,
    myShare: 0,
    netPL: 0
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
        `${process.env.REACT_APP_API_URL}/get-event-bets-fancy`,
        {
          admin_id: admin_id,
          event_id: event_id, 
          fancy_id: fancyId_new,
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
          const fancyBets = res.data.data.filter(bet => bet.bet_type === "fancy");
          setBetsData(fancyBets);
          setFilteredData(fancyBets);
          calculateTotals(fancyBets);
        } else {
          setBetsData([]);
          setFilteredData([]);
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
        setFilteredData([]);
      }
    } catch (error) {
      console.error(
        "Error fetching event bets",
        error?.response?.data || error.message
      );
      setError("Failed to fetch event bets. Please try again.");
      setBetsData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (bets) => {
    let totalSessionAmount = 0;
    let totalSessionComm = 0;
    let totalComm = 0;
    let totalAmount = 0;
    let myShare = 0;
    let netPL = 0;

    bets.forEach(bet => {
      totalSessionAmount += parseFloat(bet.bet_amount || bet.stake || bet.amount || 0);
      totalSessionComm += parseFloat(bet.commission || 0);
      totalAmount += parseFloat(bet.total || bet.bet_value || 0);
    });

    totalComm = totalSessionComm;
    myShare = totalAmount * 0.2; // Assuming 20% share, adjust as needed
    netPL = totalAmount - totalSessionAmount - totalComm;

    setTotals({
      totalSessionAmount,
      totalSessionComm,
      totalComm,
      totalAmount,
      myShare,
      netPL
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    const number = parseFloat(num);
    if (isNaN(number)) return "0";
    return number.toFixed(2);
  };

  const getBadgeClass = (betType) => {
    if (!betType) return "bg-secondary";
    const type = betType.toLowerCase();
    if (type === "back" || type === "Yes") return "bg-success";
    if (type === "lay" || type === "No") return "bg-danger";
    return "bg-secondary";
  };

  const getActionClass = (action) => {
    if (!action) return "bg-secondary";
    const act = action.toLowerCase();
    if (act === "back" || act === "Yes") return "bg-success";
    if (act === "lay" || act === "No") return "bg-danger";
    return "bg-secondary";
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 1) return null;

    // Previous button
    buttons.push(
      <button
        key="prev"
        className={`btn btn-sm ${currentPage === 1 ? 'btn-outline-secondary disabled' : 'btn-outline-primary'}`}
        onClick={() => currentPage > 1 && getEventBets(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo; Prev
      </button>
    );

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`btn btn-sm ${currentPage === i ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => getEventBets(i)}
        >
          {i}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        className={`btn btn-sm ${currentPage === totalPages ? 'btn-outline-secondary disabled' : 'btn-outline-primary'}`}
        onClick={() => currentPage < totalPages && getEventBets(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &raquo;
      </button>
    );

    return buttons;
  };

  useEffect(() => {
    getEventBets();
  }, []);

  

  return (
    <div className="card">
      {/*<div className="card-header bg-color-black text-white d-flex justify-content-between align-items-md-center align-items-start">
         <h3 className="card-title text-white mb-0">Clients Session PL</h3> */}
              {/* <button className="close-btn" onClick={closeLadder}>
                ×
              </button> 
      </div>*/}
      
      <div className="card-body p-0">
        <div className="event-bets-container">
          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading bets data...</p>
            </div>
          ) : (
            <>
              {/* Totals Summary */}
        

              {/* Table Section */}
              <div className="data-section table-responsive">
                <table className="bets-table table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th className="text-white">PLACE TIME</th>
                      <th className="text-white">USERNAME</th>
                      <th className="text-white">RUNNER NAME</th>
                      <th className="text-white">BET TYPE</th>
                      <th className="text-white">BET PRICE</th>
                      <th className="text-white">BET VALUE</th>
                      <th className="text-white">BET AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((bet, index) => (
                        <tr key={index}>
                          <td>{formatDate(bet.place_time || bet.created_at)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className={`badge ${getActionClass(bet.bet_action)} me-2`}>
                                {/* {bet.bet_action || "N/A"} */}
                              </span>
                              {`USER ${bet.user_id?.substring(0, 6) || "N/A"}`}
                            </div>
                          </td>
                          <td>{bet.runner_name || bet.team || "N/A"}</td>
                          <td>
                            <span className={`badge ${getBadgeClass(bet.bet_on)}`}>
                              {bet.bet_on?.toLowerCase() === "back"
                                ? "Yes"
                                : bet.bet_on?.toLowerCase() === "lay"
                                  ? "No"
                                  : bet.bet_on || "N/A"}
                            </span>
                          </td>
                          <td>{formatNumber(bet.bet_price || bet.odd)}</td>
                          <td>{formatNumber(bet.bet_value || bet.total)}</td>
                          <td>{formatNumber(bet.bet_amount || bet.stake || bet.amount)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <div className="text-muted">
                            <i className="fas fa-inbox fa-2x mb-2"></i>
                            <p>No bets data available</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredData.length > 0 && (
                <div className="pagination-section mt-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{" "}
                      {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{" "}
                      {pagination.totalRecords} entries
                    </div>
                    <div className="btn-group" role="group">
                      {renderPaginationButtons()}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Ladder;