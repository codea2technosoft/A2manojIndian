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
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [allBets, setAllBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [betTypeFilter, setBetTypeFilter] = useState("all"); // "all", "match", "fancy"
  const [showFilters, setShowFilters] = useState(false);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API || "http://localhost:9001/api/users";
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

    const baseUrl = process.env.REACT_APP_BACKEND_API;


  const userId = localStorage.getItem("user_id");

  // Format date for API
  const formatDateForAPI = (dateString) => {
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      const today = new Date();
      return `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    }
  };

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
        start_date: formatDateForAPI(fromDate),
        end_date: formatDateForAPI(toDateState),
      };

      console.log("📡 API Request:", {
        url: `${baseUrl}/user-exposure`,
        payload: requestPayload
      });

      const res = await axios.post(`${baseUrl}/user-exposure`, requestPayload);

      console.log("✅ Full API Response:", res.data);
      console.log("📊 Data Structure:", {
        user_exposure_count: res.data?.data?.user_exposure?.length || 0,
        fancy_exposure_count: res.data?.data?.fancy_exposure?.length || 0,
        has_user_exposure: !!res.data?.data?.user_exposure,
        has_fancy_exposure: !!res.data?.data?.fancy_exposure
      });

      if (res.data?.status_code === 1) {
        const userExposure = res.data.data?.user_exposure || [];
        const fancyExposure = res.data.data?.fancy_exposure || [];
        
        console.log("🔍 User Exposure Raw:", userExposure);
        console.log("🎲 Fancy Exposure Raw:", fancyExposure);

        // Map user_exposure data
        const mappedUserBets = userExposure.map((item, index) => ({
          _id: item._id || `user-${index}-${Date.now()}`,
          user_id: item.user_id || userId,
          sport_id: item.sport_id || 4,
          event_id: item.event_id || "N/A",
          fancy_id: null, // Not applicable for user_exposure
          bet_type: "Match",
          bet_on: item.exp < 0 ? "lay" : "back",
          team: `Event ${item.event_id || "Unknown"}`,
          odd: "N/A",
          stake: "N/A",
          total: Math.abs(item.exp || 0),
          match_status: "Open",
          created_at: item.created_at || item.createdAt || new Date().toISOString(),
          updated_at: item.updated_at || item.updatedAt || new Date().toISOString(),
          delete_amount: item.delete_amount || 0,
          exp_main: item.exp_main || 0,
          exp: item.exp || 0,
          exposure_type: "match" // Mark as match exposure
        }));

        // Map fancy_exposure data
        const mappedFancyBets = fancyExposure.map((item, index) => ({
          _id: item._id || `fancy-${index}-${Date.now()}`,
          user_id: item.user_id || userId,
          sport_id: 4, // Assuming fancy bets are for cricket/baseball
          event_id: item.fancy_id ? item.fancy_id.split('-')[0] : "N/A",
          fancy_id: item.fancy_id || "N/A",
          bet_type: "Fancy",
          bet_on: item.exp < 0 ? "lay" : "back",
          team: `Fancy ${item.fancy_id || "Unknown"}`,
          odd: "N/A",
          stake: "N/A",
          total: Math.abs(item.exp || 0),
          match_status: "Open",
          created_at: item.createdAt || item.created_at || new Date().toISOString(),
          updated_at: item.updatedAt || item.updated_at || new Date().toISOString(),
          delete_amount: 0, // Fancy might not have delete_amount
          exp_main: item.exp || 0, // For fancy, exp_main is same as exp
          exp: item.exp || 0,
          exposure_type: "fancy" // Mark as fancy exposure
        }));

        // Combine both arrays
        const combinedBets = [...mappedUserBets, ...mappedFancyBets];
        
        console.log("🎯 Combined Bets:", {
          total: combinedBets.length,
          match_bets: mappedUserBets.length,
          fancy_bets: mappedFancyBets.length,
          sample_match: mappedUserBets[0],
          sample_fancy: mappedFancyBets[0]
        });

        setAllBets(combinedBets);
        
        if (combinedBets.length === 0) {
          console.log("⚠️ No exposure data found at all");
        }
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

  useEffect(() => {
    fetchData();
  }, []);

  // Filter bets based on selected type
  const filteredBets = useMemo(() => {
    if (betTypeFilter === "all") return allBets;
    if (betTypeFilter === "match") return allBets.filter(bet => bet.exposure_type === "match");
    if (betTypeFilter === "fancy") return allBets.filter(bet => bet.exposure_type === "fancy");
    return allBets;
  }, [allBets, betTypeFilter]);

  // Pagination calculations
  const { totalPages, currentPageData, startIndex, endIndex } = useMemo(() => {
    const totalItems = filteredBets.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = filteredBets.slice(startIndex, endIndex);

    return {
      totalPages,
      currentPageData,
      startIndex,
      endIndex,
      totalItems
    };
  }, [filteredBets, currentPage, pageSize]);

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
  const getBetTypeBadge = (betType) => {
    switch (betType) {
      case "Match":
        return "bg-primary";
      case "Fancy":
        return "bg-purple"; // Add purple to your CSS or use another color
      default:
        return "bg-secondary";
    }
  };

  // Get row background color
  const getRowBackgroundColor = (bet) => {
    if (bet.exposure_type === "fancy") {
      return bet.bet_on === "back" ? "#e8f4fd" : "#fef2f5";
    } else {
      return bet.bet_on === "back" ? "#f0f9ff" : "#fff5f7";
    }
  };

  return (
    <section className="account-statement">
      <div className="container-fluid p-0">
        <div className="card radius-0 bg-transparent shadow-none border-0">
        
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
                <div className="loader-6">
                  <div className="set-one">
                    <div className="circle "></div>
                    <div className="circle circle1"></div>
                  </div>
                  <div className="set-two">
                    <div className="circle circle2"></div>
                    <div className="circle circle3"></div>
                  </div>
                </div>
                <p className="mt-3 text-muted">Loading open bets...</p>
              </div>
            ) : (
              <>
                <div className="table-responsive" style={{whiteSpace:"nowrap"}}>
                  <table className="table table-hover align-middle table-bordered">
                    <thead className="table-primary-custum">
                      <tr>
                        <th>#</th>
                        {/* <th>Type</th> */}
                        {/* <th>Sport</th> */}
                        {/* <th>Bet On</th> */}
                        {/* <th>Event/Fancy ID</th> */}
                        <th>Exposure</th>
                        <th>Main Exp</th>
                        <th>Delete Amt</th>
                        <th>Status</th>
                        {/* <th>Created At</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageData.length === 0 ? (
                        <tr>
                          <td colSpan="10" className="text-center text-muted py-4">
                            {error ? "Failed to load data" : "No open bets found for the selected period."}
                            {!error && (
                              <div>
                                <p className="mb-2">Try adjusting your filters or</p>
                                <button className="btn btn-sm btn-primary" onClick={fetchData}>
                                  Refresh Data
                                </button>
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
                              borderLeft: b.exposure_type === "fancy" ? "4px solid #6f42c1" : "4px solid #20c997"
                            }}
                          >
                            <td>{startIndex + index + 1}</td>
                            {/* <td>
                              <span className={`badge text-capitalize text-white ${getBetTypeBadge(b.bet_type)}`}>
                                {b.bet_type}
                              </span>
                            </td> */}
                            {/* <td>
                              <span className="badge bg-info text-capitalize text-white">
                                {getSportName(b.sport_id)}
                              </span>
                            </td> */}
                            {/* <td>
                              <span
                                className={`text-capitalize badge ${b.bet_on === "back" ? "bg-success" : "bg-danger"}`}
                              >
                                {b.bet_on}
                              </span>
                            </td> */}
                            {/* <td className="fw-bold">
                              {b.exposure_type === "fancy" ? (
                                <div>
                                  <div>Fancy: {b.fancy_id}</div>
                                  <small className="text-muted">Event: {b.event_id}</small>
                                </div>
                              ) : (
                                <div>Event: {b.event_id}</div>
                              )}
                            </td> */}
                            <td className={`fw-bold ${b.exp < 0 ? 'text-danger' : 'text-success'}`}>
                              {b.exp.toFixed(2)}
                            </td>
                            <td className={`fw-bold ${b.exp_main < 0 ? 'text-danger' : 'text-success'}`}>
                              {b.exp_main.toFixed(2)}
                            </td>
                            <td className="fw-bold text-muted">
                              {b.delete_amount?.toFixed(2) || "0.00"}
                            </td>
                            <td>
                              <span className="badge bg-warning text-dark">
                                {b.match_status}
                              </span>
                            </td>
                            {/* <td><small>{formatDate(b.created_at)}</small></td> */}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Statistics */}
                {/* {filteredBets.length > 0 && (
                  <div className="p-3 border-top bg-light">
                    <div className="row">
                      <div className="col-md-2">
                        <small className="text-muted">Total Bets:</small>
                        <h6 className="mb-0">{filteredBets.length}</h6>
                      </div>
                      <div className="col-md-2">
                        <small className="text-muted">Match Bets:</small>
                        <h6 className="mb-0 text-primary">
                          {filteredBets.filter(b => b.exposure_type === "match").length}
                        </h6>
                      </div>
                      <div className="col-md-2">
                        <small className="text-muted">Fancy Bets:</small>
                        <h6 className="mb-0 text-purple">
                          {filteredBets.filter(b => b.exposure_type === "fancy").length}
                        </h6>
                      </div>
                      <div className="col-md-2">
                        <small className="text-muted">Total Exposure:</small>
                        <h6 className={`mb-0 ${filteredBets.reduce((sum, bet) => sum + (bet.exp || 0), 0) < 0 ? 'text-danger' : 'text-success'}`}>
                          {filteredBets.reduce((sum, bet) => sum + (bet.exp || 0), 0).toFixed(2)}
                        </h6>
                      </div>
                      <div className="col-md-2">
                        <small className="text-muted">Total Main Exp:</small>
                        <h6 className={`mb-0 ${filteredBets.reduce((sum, bet) => sum + (bet.exp_main || 0), 0) < 0 ? 'text-danger' : 'text-success'}`}>
                          {filteredBets.reduce((sum, bet) => sum + (bet.exp_main || 0), 0).toFixed(2)}
                        </h6>
                      </div>
                      <div className="col-md-2">
                        <small className="text-muted">Back/Lay Ratio:</small>
                        <h6 className="mb-0">
                          {filteredBets.filter(b => b.bet_on === "back").length} / {filteredBets.filter(b => b.bet_on === "lay").length}
                        </h6>
                      </div>
                    </div>
                  </div>
                )} */}

                {/* Pagination */}
                {filteredBets.length > 0 && totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <div>
                      <p className="mb-0 text-muted">
                        Showing {currentPageData.length > 0 ? startIndex + 1 : 0} to{" "}
                        {Math.min(endIndex, filteredBets.length)} of {filteredBets.length} entries
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