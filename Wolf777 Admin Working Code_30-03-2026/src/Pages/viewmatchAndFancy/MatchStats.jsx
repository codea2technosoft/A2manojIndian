import React, { useState, useEffect } from "react";
import axios from "axios";
import "../viewmatchAndFancy/Eventcss.scss"
function GetEventBets() {
  const admin_id = localStorage.getItem("admin_id");
  const event_id = localStorage.getItem("event_id");
  const token = localStorage.getItem("token");

  const [betsData, setBetsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBetType, setSelectedBetType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 15
  });

  const [betTypes, setBetTypes] = useState([]);

  const getEventBets = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-event-bets`,
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

      if (res.data && res.data.status_code === 1) {
        if (Array.isArray(res.data.data) && res.data.data.length > 0) {
          const apiData = res.data.data;
          const formattedData = apiData.map(bet => ({
            ...bet,
            place_time: bet.created_at || "N/A",
            username: `USER ${bet.user_id?.substring(0, 6) || "N/A"}`,
            runner_name: bet.team || bet.runner_name || "N/A",
            bet_type: bet.bet_type?.toUpperCase() || "N/A",
            bet_price: bet.odd || 0,
            bet_value: bet.total || 0,
            bet_amount: bet.stake || bet.amount || 0,
            bet_action: bet.bet_on === "lay" ? "LAGAI" : "BACK"
          }));

          setBetsData(formattedData);
          setFilteredData(formattedData);

          const uniqueBetTypes = [...new Set(formattedData.map(bet => bet.bet_type || "").filter(type => type !== ""))];
          setBetTypes(uniqueBetTypes);

          if (res.data.pagination) {
            setPagination(prev => ({
              ...prev,
              currentPage: res.data.pagination.currentPage || page,
              totalPages: res.data.pagination.totalPages || 1,
              totalRecords: res.data.pagination.totalRecords || formattedData.length
            }));
          }
        } else {
          setBetsData([]);
          setFilteredData([]);
          setBetTypes([]);

          if (res.data.pagination) {
            setPagination(prev => ({
              ...prev,
              currentPage: res.data.pagination.currentPage || page,
              totalPages: res.data.pagination.totalPages || 1,
              totalRecords: res.data.pagination.totalRecords || 0
            }));
          }
        }
      } else {
        setBetsData([]);
        setFilteredData([]);
        setBetTypes([]);
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0
        }));

        if (res.data && res.data.message) {
          setError(res.data.message);
        } else {
          setError("No data available");
        }
      }
    } catch (error) {
      console.error(
        "Error fetching event bets",
        error?.response?.data || error.message
      );
      setError("Failed to fetch event bets. Please try again.");
      setBetsData([]);
      setFilteredData([]);
      setBetTypes([]);
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventBets(1);
  }, []);

  const handleBetTypeFilter = (betType) => {
    setSelectedBetType(betType);

    if (betType === "all") {
      setFilteredData(betsData);
    } else {
      const filtered = betsData.filter(bet => bet.bet_type.toLowerCase() === betType.toLowerCase());
      setFilteredData(filtered);
    }
  };

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
    if (num === null || num === undefined) return "0.00";
    return typeof num === 'number' ? num.toFixed(2) : num;
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }) + " " + date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatBetType = (betType) => {
    switch (betType.toLowerCase()) {
      case "bookmaker":
        return "BOOKMAKER";
      case "match_odds":
        return "MATCH ODDS";
      case "fancy":
        return "FANCY";
      default:
        return betType.toUpperCase() || "N/A";
    }
  };

  const getBadgeClass = (betType) => {
    const type = betType.toLowerCase();
    switch (type) {
      case "bookmaker":
        return "bg-primary";
      case "match_odds":
        return "bg-success";
      case "fancy":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  const getActionClass = (action) => {
    if (action === "LAGAI") return "bg-danger";
    if (action === "BACK") return "bg-success";
    return "bg-secondary";
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
      <div className="card-header bg-color-black text-white d-flex justify-content-between align-items-md-center align-items-start">
        <h3 className="card-title text-white mb-0">MATCH STATS</h3>

        <div className="filter-controls gap-2 d-flex align-items-center mobilewidthh">
          <div className="bet-type-filter">
            <select
              className="form-select form-select-sm"
              value={selectedBetType}
              onChange={(e) => handleBetTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {betTypes.map((type, index) => (
                <option key={index} value={type}>
                  {formatBetType(type)}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => {
              setSelectedBetType("all");
              setFilteredData(betsData);
            }}
          >
            Reset Filter
          </button>
        </div>
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
          ) : (
            <>
              {filteredData.length === 0 ? (
                <div className="no-data-section">
                  <div className="no-data-header table-responsive">
                    <table className="bets-table table table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th style={{ color: "white" }}>PLACE TIME</th>
                          <th style={{ color: "white" }}>USERNAME</th>
                          <th style={{ color: "white" }}>Phone Number</th>
                          <th style={{ color: "white" }}>RUNNER NAME</th>
                          <th style={{ color: "white" }}>BET TYPE</th>
                          <th style={{ color: "white" }}>BET PRICE</th>
                          <th style={{ color: "white" }}>BET VALUE</th>
                          <th style={{ color: "white" }}>BET AMOUNT</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                  <div className="no-data-message text-center py-5">
                    <h4 className="text-muted">NO DATA FOUND</h4>
                    <p className="text-muted">
                      {selectedBetType !== "all" ?
                        `No bets found for bet type: ${selectedBetType}` :
                        "No bets available"}
                    </p>
                    {selectedBetType !== "all" && (
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleBetTypeFilter("all")}
                      >
                        Show All Bets
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="data-section table-responsive">
                    <table className="bets-table table table-hover table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th className="text-white">PLACE TIME</th>
                          <th className="text-white">USERNAME</th>
                                                    <th style={{ color: "white" }}>Phone Number</th>

                          <th className="text-white">RUNNER NAME</th>
                          <th className="text-white">BET ON</th>
                          <th className="text-white">BET TYPE</th>
                          <th className="text-white">BET PRICE</th>
                          <th className="text-white">BET VALUE</th>
                          <th className="text-white">BET AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((bet, index) => (
                          <tr key={index}>
                            <td>{formatDate(bet.place_time || bet.created_at)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                {/* <span className={`badge ${getActionClass(bet.bet_action)} me-2`}>
                                  {bet.bet_action || "N/A"}
                                </span> */}
                                {`${bet.admin_id?.substring(0, 6) || "N/A"}`}
                              </div>
                            </td>
                                                        <td>{bet.mobile}</td>

                            <td>{bet.runner_name || bet.team || "N/A"}</td>
                            
                            <td>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor:
                                    bet.bet_on?.toLowerCase() === "back"
                                      ? "#28a745"   // Green → Lagai
                                      : bet.bet_on?.toLowerCase() === "lay"
                                        ? "#dc3545" // Red → Khai
                                        : "#6c757d", 
                                  color: "#fff",
                                  padding: "6px 10px",
                                  fontSize: "13px",
                                  borderRadius: "6px",
                                }}
                              >
                                {bet.bet_on?.toLowerCase() === "back"
                                  ? "Yes"
                                  : bet.bet_on?.toLowerCase() === "lay"
                                    ? "No"
                                    : bet.bet_on}
                              </span>
                            </td>
                            <td>{bet.bet_type}</td>
                            <td>{formatNumber(bet.bet_price || bet.odd)}</td>
                            <td>{formatNumber(bet.bet_value || bet.total)}</td>
                            <td>{formatNumber(bet.bet_amount || bet.stake || bet.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {pagination.totalPages > 1 && (
                    <div className="pagination-section mt-3">
                      <div className="row align-items-center justify-content-between w-100">
                        <div className="col-md-6 col-6">
                          <div className="pagination-info">
                            <small>
                              Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{" "}
                              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords)} of{" "}
                              {pagination.totalRecords} entries
                            </small>
                          </div>
                        </div>
                        <div className="col-md-6 col-6">
                          <div className="pagination-controls d-flex justify-content-end">
                            {renderPaginationButtons()}
                          </div>
                        </div>
                      </div>
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