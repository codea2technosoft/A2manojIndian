import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaCalendarAlt, FaSortDown, FaRedoAlt, FaSearch, FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";
import "./AccountStatement.css";

export default function Unsettledbet() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const defaultFrom = "2025-10-30";
  const defaultTo = todayStr;

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDateState, setToDate] = useState(defaultTo);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [allBets, setAllBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [betTypeFilter, setBetTypeFilter] = useState("fancy"); // "all", "match", "fancy", "match_odds"
  const [showFilters, setShowFilters] = useState(false);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API || "http://localhost:9001/api/users";
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const baseUrl = process.env.REACT_APP_BACKEND_API;


  const userId = localStorage.getItem("user_id");

  // ✅ Fetch API Data
  const fetchData = async () => {
    if (!userId) {
      console.error("User ID not found");
      setError("User ID not found. Please login again.");
      setAllBets([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestPayload = {
        user_id: userId,
      };

      console.log("📡 API Request:", {
        url: `${baseUrl}/unselleted-bet-all`,
        payload: requestPayload
      });

      const res = await axios.post(`${baseUrl}/unselleted-bet-all
 `, requestPayload);

      console.log("✅ Full API Response:", res.data);

      if (res.data?.status_code === 1) {
        const betsData = res.data.data || [];

        console.log("📊 Bets Data Received:", {
          count: betsData.length,
          betTypes: betsData.map(b => b.bet_type),
          uniqueBetTypes: [...new Set(betsData.map(b => b.bet_type))]
        });

        // Map the bets data to our format
        const mappedBets = betsData.map((item, index) => {
          // Calculate exposure based on bet type
          let exp = 0;
          let exp_main = 0;

          if (item.bet_on === "lay") {
            exp = item.total * (item.odd - 1);
            exp_main = item.total;
          } else if (item.bet_on === "back") {
            exp = -item.total * (item.odd - 1);
            exp_main = -item.total;
          }

          // Determine display bet type and exposure type
          let displayBetType = "Unknown";
          let exposure_type = "other";

          switch (item.bet_type) {
            case "bookmaker":
              displayBetType = "Bookmaker";
              exposure_type = "match";
              break;
            case "match_odds":
              displayBetType = "Match Odds";
              exposure_type = "match";
              break;
            case "fancy":
              displayBetType = "Fancy";
              exposure_type = "fancy";
              break;
            default:
              displayBetType = item.bet_type;
              exposure_type = "other";
          }

          // Get match status text
          const match_status = getMatchStatusText(item.match_status);

          return {
            _id: item._id || `bet-${index}-${Date.now()}`,
            user_id: item.user_id || userId,
            super_admin_id: item.super_admin_id || "N/A",
            admin_id: item.admin_id || "N/A",
            agent_id: item.agent_id || "N/A",
            original_bet_type: item.bet_type, // Keep original for reference
            bet_type: displayBetType,
            exposure_type: exposure_type,
            bet_on: item.bet_on || "N/A",
            sport_id: item.sport_id || 4,
            event_id: item.event_id || "N/A",
            market_id: item.market_id || "N/A",
            team: item.team || "N/A",
            team_id: item.team_id || "N/A",
            odd: parseFloat(item.odd) || 0,
            stake: parseFloat(item.stake) || 0,
            exposer: parseFloat(item.exposer) || 0,
            total: parseFloat(item.total) || 0,
            liability: parseFloat(item.liability) || 0,
            c_total: parseFloat(item.c_total) || 0,
            match_status: match_status,
            matched_status: item.matched_status || "N/A",
            is_settled: item.is_settled || 0,
            user_comsiinos: item.user_comsiinos || "0",
            agent_comsiinos: item.agent_comsiinos || "0",
            admin_comsiinos: item.admin_comsiinos || "0",
            master_comsiinos: item.master_comsiinos || "0",
            super_agent_comsiinos: item.super_agent_comsiinos || "0",
            created_at: item.created_at || new Date().toISOString(),
            exp: exp,
            exp_main: exp_main,
            delete_amount: 0,
            raw_data: item // Keep raw data for debugging
          };
        });

        console.log("🎯 Mapped Bets Summary:", {
          total: mappedBets.length,
          byBetType: mappedBets.reduce((acc, bet) => {
            acc[bet.original_bet_type] = (acc[bet.original_bet_type] || 0) + 1;
            return acc;
          }, {}),
          byExposureType: mappedBets.reduce((acc, bet) => {
            acc[bet.exposure_type] = (acc[bet.exposure_type] || 0) + 1;
            return acc;
          }, {})
        });

        setAllBets(mappedBets);

        // if (mappedBets.length === 0) {
        //   console.log("⚠️ No bet data found");
        //   setError("No bet data available.");
        // }
      } else {
        console.log("❌ API returned non-success status:", res.data?.message);
        setError(`API Error: ${res.data?.message || "Unknown error"}`);
        setAllBets([]);
      }
    } catch (error) {
      console.error("💥 Error fetching unsettled bets:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError(`Failed to load data: ${error.message}`);
      setAllBets([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get match status text
  const getMatchStatusText = (statusCode) => {
    const statusMap = {
      "1": "Not Started",
      "2": "In Play",
      "3": "Suspended",
      "4": "Ended",
      "5": "Closed",
      "6": "Abandoned"
    };
    return statusMap[statusCode] || "Unknown";
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter bets based on selected type - UPDATED FOR ALL BET TYPES
  const filteredBets = useMemo(() => {
    if (betTypeFilter === "all") return allBets;
    if (betTypeFilter === "match") {
      // Include both bookmaker and match_odds as "match"
      return allBets.filter(bet =>
        bet.exposure_type === "match" ||
        bet.original_bet_type === "bookmaker" ||
        bet.original_bet_type === "match_odds"
      );
    }
    if (betTypeFilter === "fancy") {
      return allBets.filter(bet =>
        bet.exposure_type === "fancy" ||
        bet.original_bet_type === "fancy"
      );
    }
    if (betTypeFilter === "bookmaker") {
      return allBets.filter(bet => bet.original_bet_type === "bookmaker");
    }
    if (betTypeFilter === "match_odds") {
      return allBets.filter(bet => bet.original_bet_type === "match_odds");
    }
    return allBets;
  }, [allBets, betTypeFilter]);

  // Filter only unsettled bets (is_settled === 0)
  const unsettledBets = useMemo(() => {
    return filteredBets.filter(bet => bet.is_settled === 0);
  }, [filteredBets]);

  // Get count of bets by type for filter options
  const betTypeCounts = useMemo(() => {
    const counts = {
      all: allBets.filter(b => b.is_settled === 0).length,
      match: allBets.filter(b =>
        (b.exposure_type === "match" || b.original_bet_type === "bookmaker" || b.original_bet_type === "match_odds") &&
        b.is_settled === 0
      ).length,
      fancy: allBets.filter(b =>
        (b.exposure_type === "fancy" || b.original_bet_type === "fancy") &&
        b.is_settled === 0
      ).length,
      bookmaker: allBets.filter(b =>
        b.original_bet_type === "bookmaker" && b.is_settled === 0
      ).length,
      match_odds: allBets.filter(b =>
        b.original_bet_type === "match_odds" && b.is_settled === 0
      ).length,
    };
    return counts;
  }, [allBets]);

  // Pagination calculations
  const { totalPages, currentPageData, startIndex, endIndex, totalItems } = useMemo(() => {
    const totalItems = unsettledBets.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = unsettledBets.slice(startIndex, endIndex);

    return {
      totalPages,
      currentPageData,
      startIndex,
      endIndex,
      totalItems
    };
  }, [unsettledBets, currentPage, pageSize]);

  const applyFilters = () => {
    setCurrentPage(1);
    fetchData();
  };

  const resetFilters = () => {
    setFromDate(defaultFrom);
    setToDate(defaultTo);
    setPageSize(10);
    setBetTypeFilter("all");
    setCurrentPage(1);
    fetchData();
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Get sport name based on sport_id
  const getSportName = (sportId) => {
    const sports = {
      1: "Soccer",
      2: "Tennis",
      3: "Cricket",
      4: "Baseball",
      5: "Basketball",
      6: "Football",
      7: "Hockey",
      8: "Volleyball"
    };
    return sports[sportId] || `Sport ${sportId}`;
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Get badge color based on bet type
  const getBetTypeBadge = (betType, originalBetType) => {
    switch (originalBetType) {
      case "bookmaker":
        return "bg-primary"; // Blue
      case "match_odds":
        return "bg-info text-dark"; // Light blue
      case "fancy":
        return "bg-purple"; // Purple
      default:
        return "bg-secondary"; // Gray
    }
  };

  // Get match status badge color



  // Get row background color
  const getRowBackgroundColor = (bet) => {
    // Different colors for different bet types
    if (bet.original_bet_type === "fancy") {
      return bet.bet_on === "back" ? "#f0e6ff" : "#fff0f7";
    } else if (bet.original_bet_type === "bookmaker") {
      return bet.bet_on === "back" ? "#e6f7ff" : "#fff0f0";
    } else if (bet.original_bet_type === "match_odds") {
      return bet.bet_on === "back" ? "#e6fff2" : "#fff9e6";
    }
    return bet.bet_on === "back" ? "#f0f9ff" : "#fff5f7";
  };

  // Get border color based on bet type
  const getBorderColor = (bet) => {
    if (bet.original_bet_type === "fancy") {
      return "4px solid #6f42c1"; // Purple
    } else if (bet.original_bet_type === "bookmaker") {
      return "4px solid #007bff"; // Blue
    } else if (bet.original_bet_type === "match_odds") {
      return "4px solid #17a2b8"; // Teal
    }
    return "4px solid #20c997"; // Green
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalExposure = unsettledBets.reduce((sum, bet) => sum + (bet.exp || 0), 0);
    const totalMainExposure = unsettledBets.reduce((sum, bet) => sum + (bet.exp_main || 0), 0);
    const totalStake = unsettledBets.reduce((sum, bet) => sum + (bet.stake || 0), 0);
    const totalLiability = unsettledBets.reduce((sum, bet) => sum + (bet.liability || 0), 0);
    const backBets = unsettledBets.filter(b => b.bet_on === "back").length;
    const layBets = unsettledBets.filter(b => b.bet_on === "lay").length;

    // Count by bet type
    const bookmakerBets = unsettledBets.filter(b => b.original_bet_type === "bookmaker").length;
    const matchOddsBets = unsettledBets.filter(b => b.original_bet_type === "match_odds").length;
    const fancyBets = unsettledBets.filter(b => b.original_bet_type === "fancy").length;

    return {
      totalExposure,
      totalMainExposure,
      totalStake,
      totalLiability,
      backBets,
      layBets,
      bookmakerBets,
      matchOddsBets,
      fancyBets
    };
  }, [unsettledBets]);

  const getStatusBadge = (status) => {
    switch (Number(status)) {
      case 1:
        return { text: "Win", class: "bg-success" };
      case 2:
        return { text: "Loss", class: "bg-danger" };
      case 3:
        return { text: "Pending", class: "bg-warning text-dark" };
      default:
        return { text: "Unknown", class: "bg-secondary" };
    }
  };


  return (
    <section className="account-statement">
      <div className="container-fluid p-0">
        <div className="card radius-0 bg-transparent shadow-none border-0">



          {/* Filters Section */}
          <div className="px-4 pb-3 border-bottom">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">Bet Type Filter</label>
                <select
                  className="form-select form-select-sm"
                  value={betTypeFilter}
                  onChange={(e) => {
                    setBetTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {/* <option value="all">
                    All
                  </option> */}
        
                  <option value="bookmaker">
                    Bookmaker ({betTypeCounts.bookmaker})
                  </option>
            
                  <option value="fancy">
                    Fancy ({betTypeCounts.fancy})
                  </option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small fw-bold">Page Size</label>
                <select
                  className="form-select form-select-sm"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                </select>
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button
                  className="btn btn-primary btn-sm me-2 flex-fill d-flex align-items-center justify-content-center"
                  onClick={applyFilters}
                >
                  <FaSearch className="me-2" />
                  Apply
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm flex-fill d-flex align-items-center justify-content-center"
                  onClick={resetFilters}
                >
                  <FaRedoAlt className="me-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger m-3" role="alert">
              <strong>Error:</strong> {error}
              <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchData}>
                Retry
              </button>
            </div>
          )}


          {/* Table */}
          <div className="card-body p-0 bg-white">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading unsettled bets...</p>
              </div>
            ) : (
              <>
                <div className="table-responsive" style={{ whiteSpace: "nowrap" }}>
                  <table className="table table-hover align-middle table-bordered">
                    <thead className="table-primary-custum">
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Team/Event</th>
                        <th>Bet On dsds</th>
                        <th>Odd </th>
                        {/* <th>Stake</th> */}
                        <th>Amount</th>
                        <th>Exposure</th>
                        {/* <th>Status</th> */}
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageData.length === 0 ? (
                        <tr>
                          <td colSpan="12" className="text-center text-muted py-5">
                            {allBets.length === 0 ? (
                              <div>
                                <p className="mb-3">No bet data found.</p>
                                <button
                                  className="btn btn-primary"
                                  onClick={fetchData}
                                >
                                  <FaRedoAlt className="me-2" />
                                  Fetch Data
                                </button>
                              </div>
                            ) : unsettledBets.length === 0 ? (
                              <div>
                                <p className="mb-2">All bets are settled.</p>
                                <p className="text-muted small">
                                  Total Bets: {allBets.length} |
                                  Settled: {allBets.filter(b => b.is_settled === 1).length}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="mb-2">No bets match the current filter.</p>
                                <p className="text-muted small">
                                  Try selecting a different bet type filter.
                                </p>
                              </div>
                            )}
                          </td>
                        </tr>
                      ) : (
                        currentPageData.map((b, index) => (
                          <tr
                            key={b._id}
                            style={{
                              backgroundColor: getRowBackgroundColor(b),
                              borderLeft: getBorderColor(b)
                            }}
                          >
                            <td className="fw-bold">{startIndex + index + 1}</td>
                            <td>
                              <span
                                className={`badge text-capitalize text-white ${getBetTypeBadge(b.bet_type, b.original_bet_type)}`}
                                title={`Original Type: ${b.original_bet_type}`}
                              >
                                {b.bet_type}
                              </span>
                            </td>

                            <td className="fw-bold">
                              <div>{b.team}</div>
                              {/* <small className="text-muted">
                                Event: {b.event_id} {b.market_id && `| Market: ${b.market_id}`}
                              </small> */}
                            </td>
                            <td>
                              <span
                                className={`badge ${b.bet_on === "back" ? "bg-success" : "bg-danger"}`}
                              >
                                {/* {b.bet_on == "lay" ? "No" : "Yes"} */}

                                {
                                  b.bet_type == "Bookmaker"
                                    ? (b.bet_on == "back" ? "LAGAI" : "KHAI")
                                    : (b.bet_on == "lay" ? "No" : "Yes")
                                }
                              </span>
                            </td>
                            <td className="fw-bold">{b.odd}/{b.total.toFixed(2)}</td>
                            {/* <td className="fw-bold">{b.stake.toFixed(2)}</td> */}
                            <td className="fw-bold">  {b.stake.toFixed(2)}</td>
                            <td className={`fw-bold ${b.exposer < 0 ? 'text-danger' : 'text-success'}`}>
                              {b.exposer}
                            </td>



                            {/* <td>
                              <small>
                                {b.match_status === 1
                                  ? "Win"
                                  : b.match_status === 2
                                    ? "Loss"
                                    : b.match_status === 3
                                      ? "Pending"
                                      : ""}
                              </small>
                            </td> */}
                            <td><small>{formatDate(b.created_at)}</small></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {unsettledBets.length > 0 && totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <div>
                      <p className="mb-0 text-muted">
                        {/* Showing {startIndex + 1} to {Math.min(endIndex, unsettledBets.length)} of {unsettledBets.length} entries
                        <span className="ms-3">
                          (Filter: {betTypeFilter} | Total: {allBets.length})
                        </span> */}
                      </p>
                    </div>
                    <nav>
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={goToPreviousPage}>
                            <FaChevronLeft />
                          </button>
                        </li>

                        {getPageNumbers().map((page) => (
                          <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                            <button className="page-link" onClick={() => goToPage(page)}>
                              {page}
                            </button>
                          </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={goToNextPage}>
                            <FaChevronRight />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}