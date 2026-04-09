import React, { useEffect, useState, useCallback } from "react";
import { 
  MdFilterListAlt, 
  MdVisibility, 
  MdDelete, 
  MdRefresh,
  MdSearch,
  MdCalendarToday,
  MdToday 
} from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaRedoAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getAllpending,
  getBetById,
  deleteBets
} from "../../Server/api";

// Helper function to format date for API
const formatDateForAPI = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`; // DD-MM-YYYY format as per your example
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current date-time for display
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toLocaleString();
};

// Date formatter utility with time
const formatDateTime = (dateStr) => {
  if (!dateStr) return "NA";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    
    // Format time in 12-hour format
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, "0");
    
    return (
      <div>
        <div>{`${day}-${month}-${year}`}</div>
        <div className="text-muted small">{`${formattedHours}:${minutes}:${seconds} ${ampm}`}</div>
      </div>
    );
  } catch (error) {
    console.error("Date formatting error:", error);
    return "NA";
  }
};

// Check if date is today
const isToday = (dateString) => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  } catch (error) {
    return false;
  }
};

function PendingBet() {
  // Get today's date using the utility function
  const todayStr = getTodayDate();
  
  // Calculate date 1 month ago
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthAgoStr = oneMonthAgo.toISOString().slice(0, 10);

  // Default values - last 1 month
  const defaultFrom = oneMonthAgoStr;
  const defaultTo = todayStr;

  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ 
    mobile: "", 
    bet_type: "",
    event_id: "",
    is_settled: "", // Changed to empty string to match API response
    status: "",
    start_date: "",
    end_date: ""
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBets, setTotalBets] = useState(0);
  const [filterVisible, setFilterVisible] = useState(false);
  const [mobile, setMobile] = useState("");
  const [betType, setBetType] = useState("");
  const [eventId, setEventId] = useState("");
  const [selectedBet, setSelectedBet] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isSettled, setIsSettled] = useState(""); // Changed to string
  const [startDate, setStartDate] = useState(defaultFrom); // Set default
  const [endDate, setEndDate] = useState(defaultTo); // Set default
  const [pageSize, setPageSize] = useState(10);
  const [appliedFilters, setAppliedFilters] = useState({
    from: defaultFrom,
    to: defaultTo,
    size: 10,
    mobile: "",
    bet_type: "",
    is_settled: ""
  });
  
  // Add today's summary state
  const [todaysPending, setTodaysPending] = useState(0);
  const [todaysStake, setTodaysStake] = useState(0);

  // Fetch bets function with useCallback to prevent infinite re-renders
  const fetchAllBets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare params with filters
      const params = {
        page,
        limit: appliedFilters.size
      };
      
      // Add date filters - always include dates
      const startDateFilter = formatDateForAPI(appliedFilters.from);
      const endDateFilter = formatDateForAPI(appliedFilters.to);
      
      params.start_date = startDateFilter;
      params.end_date = endDateFilter;
      
      // Add other filters if they have values
      if (appliedFilters.mobile) params.mobile = appliedFilters.mobile;
      if (appliedFilters.bet_type) params.bet_type = appliedFilters.bet_type;
      if (appliedFilters.is_settled !== "") params.is_settled = appliedFilters.is_settled;
      
      // Add event_id from filters object if exists
      if (filters.event_id) params.event_id = filters.event_id;

      console.log("Fetching pending bets with params:", params); // Debug log
      
      const res = await getAllpending(params);
      console.log("API Response:", res?.data); // Debug log
      
      if (res?.data?.success) {
        setBets(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalBets(res.data.total || 0);
        setError(null);
        
        // Calculate today's pending bets and stake if filtering for today
        if (appliedFilters.from === todayStr && appliedFilters.to === todayStr) {
          const todayData = res.data.data || [];
          const todayPendingCount = todayData.length;
          const todayStakeTotal = todayData.reduce((sum, bet) => {
            return sum + Number(bet.stake || 0);
          }, 0);
          
          setTodaysPending(todayPendingCount);
          setTodaysStake(todayStakeTotal);
        } else {
          // Otherwise, fetch today's data separately
          calculateTodaysSummary();
        }
      } else {
        setBets([]);
        setTotalPages(1);
        setTotalBets(0);
        setTodaysPending(0);
        setTodaysStake(0);
        setError(res?.data?.message || "No pending bets found");
      }
    } catch (error) {
      console.log("Error fetching pending bets:", error);
      const errorMsg = error.response?.data?.message || "Failed to load pending bets";
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg
      });
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters]);

  // Calculate today's pending summary
  const calculateTodaysSummary = async () => {
    try {
      const today = getTodayDate();
      console.log("Calculating today's pending summary for date:", today);
      
      // Fetch today's pending bets data
      const params = {
        page: 1,
        limit: 100,
        start_date: formatDateForAPI(today),
        end_date: formatDateForAPI(today)
      };

      const res = await getAllpending(params);
      
      if (res?.data?.success) {
        const todayData = res.data.data || [];
        const todayPendingCount = todayData.length;
        const todayStakeTotal = todayData.reduce((sum, bet) => {
          return sum + Number(bet.stake || 0);
        }, 0);
        
        console.log("Today's pending bets count:", todayPendingCount);
        console.log("Today's pending stake total:", todayStakeTotal);
        
        setTodaysPending(todayPendingCount);
        setTodaysStake(todayStakeTotal);
      } else {
        console.log("No today's pending data found");
        setTodaysPending(0);
        setTodaysStake(0);
      }
    } catch (error) {
      console.error("Error calculating today's summary:", error);
      setTodaysPending(0);
      setTodaysStake(0);
    }
  };

  useEffect(() => {
    fetchAllBets();
  }, [fetchAllBets]);

  // Initial fetch and calculate today's summary
  useEffect(() => {
    fetchAllBets();
    calculateTodaysSummary();
  }, []);

  const handleMobileNumber = (e) => {
    const value = e.target.value;
    setMobile(value);
    setFilters(prev => ({ ...prev, mobile: value }));
  };

  const handleBetType = (e) => {
    const value = e.target.value;
    setBetType(value);
    setFilters(prev => ({ ...prev, bet_type: value }));
  };

  const handleEventId = (e) => {
    const value = e.target.value;
    setEventId(value);
    setFilters(prev => ({ ...prev, event_id: value }));
  };

  const handleIsSettled = (e) => {
    const value = e.target.value;
    setIsSettled(value);
    setFilters(prev => ({ ...prev, is_settled: value }));
  };

  const handleStartDate = (e) => {
    const value = e.target.value;
    setStartDate(value);
  };

  const handleEndDate = (e) => {
    const value = e.target.value;
    setEndDate(value);
  };

  const handlePageSize = (e) => {
    setPageSize(Number(e.target.value));
  };

  const applyFilters = () => {
    // Use provided dates or defaults
    const newFrom = startDate || defaultFrom;
    const newTo = endDate || defaultTo;

    // Convert is_settled to string for API
    const isSettledFilter = isSettled === "" ? "" : String(isSettled);

    setAppliedFilters({
      from: newFrom,
      to: newTo,
      size: pageSize,
      mobile: filters.mobile,
      bet_type: filters.bet_type,
      is_settled: isSettledFilter // Pass as string
    });
    setPage(1);
  };

  // Add today's filter button handler
  const handleTodayFilter = () => {
    const today = getTodayDate();
    setStartDate(today);
    setEndDate(today);
    setAppliedFilters({
      from: today,
      to: today,
      size: pageSize,
      mobile: filters.mobile,
      bet_type: filters.bet_type,
      is_settled: isSettled
    });
    setPage(1);
  };

  const resetFilters = () => {
    // Reset all filters to empty/default
    setFilters({ 
      mobile: "", 
      bet_type: "",
      event_id: "",
      is_settled: "",
      status: "",
      start_date: "",
      end_date: ""
    });
    setMobile("");
    setBetType("");
    setEventId("");
    setIsSettled("");
    setStartDate(defaultFrom);
    setEndDate(defaultTo);
    setPageSize(10);
    
    // Set applied filters to default (last 1 month)
    setAppliedFilters({
      from: defaultFrom,
      to: defaultTo,
      size: 10,
      mobile: "",
      bet_type: "",
      is_settled: ""
    });
    setPage(1);
  };

  // View bet details
  const handleViewBet = async (betId) => {
    if (!betId) {
      Swal.fire("Error", "Invalid Bet ID", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await getBetById(betId);
      if (res?.data?.success) {
        setSelectedBet(res.data.data);
        setShowViewModal(true);
      } else {
        Swal.fire("Error", res?.data?.message || "Failed to load bet details", "error");
      }
    } catch (error) {
      console.log("Error fetching bet details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load bet details"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete bet
  const handleDeleteBet = async (betId) => {
    if (!betId) {
      Swal.fire("Error", "Invalid Bet ID", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This bet will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteBets(betId);
        if (res?.data?.success) {
          Swal.fire("Deleted!", "Bet has been deleted successfully.", "success");
          fetchAllBets(); // Refresh the list
        } else {
          Swal.fire("Error", res?.data?.message || "Failed to delete bet", "error");
        }
      } catch (error) {
        console.log("Error deleting bet:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to delete bet"
        });
      }
    }
  };

  // Get status badge color
  const getStatusColor = (isSettled, matchStatus) => {
    if (isSettled === "1" || isSettled === 1) return "activebadge";
    if (matchStatus === "4" || matchStatus === 4) return "inactivebadge"; // Match cancelled
    if (matchStatus === "3" || matchStatus === 3) return "bonusbadge"; // Match pending
    return "secondary";
  };

  // Get status text
  const getStatusText = (isSettled, matchStatus) => {
    if (isSettled === "1" || isSettled === 1) return "Settled";
    if (matchStatus === "4" || matchStatus === 4) return "Cancelled";
    if (matchStatus === "3" || matchStatus === 3) return "Pending";
    return "Pending";
  };

  // Pagination handlers
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const goToPage = (pageNum) => {
    setPage(pageNum);
  };

  // Generate page numbers for pagination
const getPageNumbers = () => {
  const pageNumbers = [];
  const pagesPerGroup = 3;

  // Current group calculate karo
  const currentGroup = Math.ceil(page / pagesPerGroup);

  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(
    startPage + pagesPerGroup - 1,
    totalPages
  );

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
};

  return (
    <div className="">
      {/* Pending Bet Summary Cards */}
      {/* <div className="row mb-3">
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm border-warning summary-card">
            <div className="card-body">
              <h5 className="text-warning mb-1">Today's Pending</h5>
              <h3 className="fw-bold">{todaysPending.toLocaleString()}</h3>
              <small className="text-muted">Pending bets today</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm border-danger summary-card">
            <div className="card-body">
              <h5 className="text-danger mb-1">Today's Pending Stake</h5>
              <h3 className="fw-bold">₹ {todaysStake.toLocaleString()}</h3>
              <small className="text-muted">Updated: {getCurrentDateTime()}</small>
            </div>
          </div>
        </div>
     
   
      </div> */}

      {/* View Bet Modal */}
      {showViewModal && selectedBet && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Bet Details - ID: {selectedBet._id}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>User Information</h6>
                    <p><strong>Mobile:</strong> {selectedBet.user?.mobile || 'N/A'}</p>
                    <p><strong>User ID:</strong> {selectedBet.user_id}</p>
                    
                    <h6 className="mt-3">Bet Information</h6>
                    <p><strong>Bet ID:</strong> {selectedBet._id}</p>
                    <p><strong>Bet Type:</strong> {selectedBet.bet_type}</p>
                    <p><strong>Bet On:</strong> {selectedBet.bet_on}</p>
                    <p><strong>Stake:</strong> ₹{selectedBet.stake}</p>
                    <p><strong>Odds:</strong> {selectedBet.odd}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Market Information</h6>
                    <p><strong>Event ID:</strong> {selectedBet.event_id}</p>
                    <p><strong>Market ID:</strong> {selectedBet.market_id}</p>
                    <p><strong>Sport ID:</strong> {selectedBet.sport_id}</p>
                    
                    <h6 className="mt-3">Team & Status</h6>
                    <p><strong>Team:</strong> {selectedBet.team}</p>
                    <p><strong>Team ID:</strong> {selectedBet.team_id}</p>
                    <p><strong>Status:</strong> 
                      <span className={`badge bg-${getStatusColor(selectedBet.is_settled, selectedBet.match_status)} ms-2`}>
                        {getStatusText(selectedBet.is_settled, selectedBet.match_status)}
                      </span>
                    </p>
                    <p><strong>Matched Status:</strong> {selectedBet.matched_status}</p>
                    
                    <h6 className="mt-3">Financials</h6>
                    <p><strong>Total:</strong> ₹{selectedBet.total}</p>
                    <p><strong>C Total:</strong> ₹{selectedBet.c_total}</p>
                    <p><strong>Liability:</strong> ₹{selectedBet.liability}</p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <h6>Timestamps</h6>
                    <p><strong>Created At:</strong> {formatDateTime(selectedBet.created_at)}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card border-0 rounded-4">
        <div className="card-header bg-color-black p-2 flex-mobile-wrap  text-white d-flex justify-content-between align-items-center">
          <div>
            <h3 className="card-title mb-0">All Pending List</h3>
            <small className="text-white-50">
              Total Pending: {totalBets} | Today's Pending: {todaysPending} | Today's Pending Stake: ₹ {todaysStake.toLocaleString()}
            </small>
          </div>
          <div className="d-flex gap-2">
            <button
              className="refeshbutton"
              onClick={() => setFilterVisible(prev => !prev)}
              title="Toggle Filters"
            >
              <MdFilterListAlt /> {filterVisible ? "Hide" : "Show"} Filters
            </button>
            <button
              className="refeshbutton"
              onClick={() => {
                fetchAllBets();
                calculateTodaysSummary();
              }}
              title="Refresh"
              disabled={loading}
            >
              <MdRefresh /> {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger m-3">
            {error}
            <button
              className="btn-close float-end"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {filterVisible && (
          <div className="p-3 bg-light border-bottom d-flex flex-wrap align-items-end gap-3">
            {/* Today's Filter Button */}
           

            <div>
              <small className="fw-semibold">From Date</small>
              <div className="input-group">
                <span className="input-group-text">
                  <MdCalendarToday />
                </span>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={handleStartDate}
                  max={endDate || todayStr}
                />
              </div>
            </div>

            <div>
              <small className="fw-semibold">To Date</small>
              <div className="input-group">
                <span className="input-group-text">
                  <MdCalendarToday />
                </span>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={handleEndDate}
                  min={startDate}
                  max={todayStr}
                />
              </div>
            </div>

            <div>
              <small className="fw-semibold">Mobile Number</small>
              <input
                type="text"
                className="form-control"
                placeholder="User Mobile"
                value={mobile}
                onChange={handleMobileNumber}
              />
            </div>


            <div>
              <small className="fw-semibold">Show</small>
              <select
                className="form-select"
                value={pageSize}
                onChange={handlePageSize}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
           

            <div className="d-flex align-items-end gap-2">
              <button 
                className="refeshbutton" 
                onClick={applyFilters}
                disabled={loading}
              >
                <MdSearch /> Apply
              </button>
              <button
                className="refeshbutton"
                onClick={resetFilters}
                disabled={loading}
              >
                <FaRedoAlt /> Reset
              </button>
            </div>

            <div className="w-100 mt-1">
              <small className="text-muted">
                Showing data from {new Date(appliedFilters.from).toLocaleDateString()} to {new Date(appliedFilters.to).toLocaleDateString()}
              </small>
            </div>
          </div>
        )}

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading pending bets...</p>
            </div>
          ) : (
            <>
              {bets.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No pending bets found</p>
                  <button className="btn btn-primary mt-2" onClick={resetFilters}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-striped mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>User Mobile</th>
                        <th>Bet Type</th>
                        <th>Team</th>
                        <th>Stake</th>
                        <th>Odds</th>
                        <th>Bet On</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bets.map((bet, index) => {
                        const betIsToday = isToday(bet.created_at);
                        return (
                          <tr key={bet._id}>
                            <td>{(page - 1) * appliedFilters.size + index + 1}</td>
                            <td>{bet.user?.mobile || 'N/A'}</td>
                            <td>
                              <span className="bonusbadge">{bet.bet_type}</span>
                            </td>
                            <td>{bet.team}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                ₹{bet.stake}
                                {betIsToday && (
                                  <span className="warningbadge">Today</span>
                                )}
                              </div>
                            </td>
                            <td>{bet.odd}</td>
                            <td>
                              <span className={`${bet.bet_on === 'back' ? 'activebadge' : 'inactivebadge'}`}>
                                {bet.bet_on}
                              </span>
                            </td>
                            <td>
                              <span className={`${getStatusColor(bet.is_settled, bet.match_status)}`}>
                                {getStatusText(bet.is_settled, bet.match_status)}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <div className="fw-medium">
                                  {formatDateTime(bet.created_at)}
                                </div>
                                {betIsToday && (
                                  <span className="bonusbadge">Today</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex gap-2 actions">
                                <button
                                  className="actionbutton edit"
                                  onClick={() => handleViewBet(bet._id)}
                                  title="View Details"
                                  disabled={loading}
                                >
                                  <MdVisibility />
                                </button>
                                <button
                                  className="actionbutton delete"
                                  onClick={() => handleDeleteBet(bet._id)}
                                  title="Delete Bet"
                                  disabled={loading}
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {appliedFilters.from === todayStr && appliedFilters.to === todayStr && (
                      <tfoot className="table-dark">
                        <tr>
                          <td colSpan="4" className="text-end fw-bold">Today's Pending Total:</td>
                          <td className="fw-bold text-danger">
                            ₹ {bets.reduce((sum, bet) => sum + Number(bet.stake || 0), 0).toLocaleString()}
                          </td>
                          <td colSpan="5"></td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </>
          )}
          {/* Pagination */}
        {bets.length > 0 && totalPages > 1 && (

          
          <div className="">
           <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="sohwingallentries">
                  Showing {(page - 1) * appliedFilters.size + 1} to{" "}
                  {Math.min(page * appliedFilters.size, totalBets)}
                   {/* of {totalBets} pending bets */}
              </div>
              
                 <div className="paginationall d-flex align-items-center gap-1">
                
                    <button 
                   className={`page-item ${page === 1 ? "disabled" : ""}`}
                      onClick={goToPreviousPage}
                      disabled={page === 1 || loading}
                    >
                      <FaChevronLeft />
                    </button>
               

                  {getPageNumbers().map((pageNum) => (
                      <button 
                       key={pageNum} className={`paginationnumber ${page === pageNum ? "active" : ""}`}
                        onClick={() => goToPage(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </button>
                  ))}

                    <button 
                    className={`page-item ${page === totalPages ? "disabled" : ""}`}
                      onClick={goToNextPage}
                      disabled={page === totalPages || loading}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
            </div>
          </div>
        )}
        </div>

        
      </div>
    </div>
  );
}

export default PendingBet;