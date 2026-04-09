import React, { useEffect, useState, useCallback } from "react";
import {
  MdFilterListAlt,
  MdVisibility,
  MdDelete,
  MdRefresh,
  MdSearch,
  MdCalendarToday,
} from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaRedoAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { getAllBets, getBetById, deleteBets } from "../../Server/api";
import {
  BsArrowDownCircleFill,
  BsArrowLeft,
  BsCashStack,
  BsCreditCard2FrontFill,
} from "react-icons/bs";

import { useNavigate } from "react-router-dom";

// Helper function to format date for API
const formatDateForAPI = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`; // DD-MM-YYYY format as per your example
};

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
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
    const ampm = hours >= 12 ? "PM" : "AM";

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

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    return false;
  }
};

function BetList() {
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
    end_date: "",
  });

  const navigate = useNavigate();
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
    is_settled: "",
  });

  // Add today's deposit summary state if needed
  const [todaysBets, setTodaysBets] = useState(0);
  const [todaysStake, setTodaysStake] = useState(0);

  // Fetch bets function with useCallback to prevent infinite re-renders
  const fetchAllBets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare params with filters
      const params = {
        page,
        limit: appliedFilters.size,
      };

      // Add date filters - always include dates
      const startDateFilter = formatDateForAPI(appliedFilters.from);
      const endDateFilter = formatDateForAPI(appliedFilters.to);

      params.start_date = startDateFilter;
      params.end_date = endDateFilter;

      // Add other filters if they have values
      if (appliedFilters.mobile) params.mobile = appliedFilters.mobile;
      if (appliedFilters.bet_type) params.bet_type = appliedFilters.bet_type;
      if (appliedFilters.is_settled !== "")
        params.is_settled = appliedFilters.is_settled;

      // Add event_id from filters object if exists
      if (filters.event_id) params.event_id = filters.event_id;

      console.log("Fetching bets with params:", params); // Debug log

      const res = await getAllBets(params);
      console.log("API Response:", res?.data); // Debug log

      if (res?.data?.success) {
        setBets(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalBets(res.data.total || 0);
        setError(null);

        // Calculate today's bets and stake if filtering for today
        if (
          appliedFilters.from === todayStr &&
          appliedFilters.to === todayStr
        ) {
          const todayData = res.data.data || [];
          const todayBetsCount = todayData.length;
          const todayStakeTotal = todayData.reduce((sum, bet) => {
            return sum + Number(bet.stake || 0);
          }, 0);

          setTodaysBets(todayBetsCount);
          setTodaysStake(todayStakeTotal);
        } else {
          // Otherwise, fetch today's data separately
          calculateTodaysSummary();
        }
      } else {
        setBets([]);
        setTotalPages(1);
        setTotalBets(0);
        setTodaysBets(0);
        setTodaysStake(0);
        setError(res?.data?.message || "No bets found");
      }
    } catch (error) {
      console.log("Error fetching bets:", error);
      const errorMsg = error.response?.data?.message || "Failed to load bets";
      setError(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  }, [page, appliedFilters]);

  // Calculate today's bets summary
  const calculateTodaysSummary = async () => {
    try {
      const today = getTodayDate();
      console.log("Calculating today's summary for date:", today);

      // Fetch today's bets data
      const params = {
        page: 1,
        limit: 100,
        start_date: formatDateForAPI(today),
        end_date: formatDateForAPI(today),
      };

      const res = await getAllBets(params);

      if (res?.data?.success) {
        const todayData = res.data.data || [];
        const todayBetsCount = todayData.length;
        const todayStakeTotal = todayData.reduce((sum, bet) => {
          return sum + Number(bet.stake || 0);
        }, 0);

        console.log("Today's bets count:", todayBetsCount);
        console.log("Today's total stake:", todayStakeTotal);

        setTodaysBets(todayBetsCount);
        setTodaysStake(todayStakeTotal);
      } else {
        console.log("No today's data found");
        setTodaysBets(0);
        setTodaysStake(0);
      }
    } catch (error) {
      console.error("Error calculating today's summary:", error);
      setTodaysBets(0);
      setTodaysStake(0);
    }
  };

  useEffect(() => {
    fetchAllBets();
  }, [fetchAllBets]);

  const handleMobileNumber = (e) => {
    const value = e.target.value;
    setMobile(value);
    setFilters((prev) => ({ ...prev, mobile: value }));
  };

  const handleBetType = (e) => {
    const value = e.target.value;
    setBetType(value);
    setFilters((prev) => ({ ...prev, bet_type: value }));
  };

  const handleEventId = (e) => {
    const value = e.target.value;
    setEventId(value);
    setFilters((prev) => ({ ...prev, event_id: value }));
  };

  const handleIsSettled = (e) => {
    const value = e.target.value;
    setIsSettled(value);
    setFilters((prev) => ({ ...prev, is_settled: value }));
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
      is_settled: isSettledFilter, // Pass as string
    });
    setPage(1);
  };

  useEffect(() => {
    if (!filterVisible) return;

    // Date validation
    if (startDate && endDate && startDate > endDate) return;

    const debounce = setTimeout(() => {
      applyFilters();
    }, 400); // debounce for mobile typing

    return () => clearTimeout(debounce);
  }, [startDate, endDate, mobile, isSettled, pageSize]);

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
        Swal.fire(
          "Error",
          res?.data?.message || "Failed to load bet details",
          "error"
        );
      }
    } catch (error) {
      console.log("Error fetching bet details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load bet details",
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
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteBets(betId);
        if (res?.data?.success) {
          Swal.fire(
            "Deleted!",
            "Bet has been deleted successfully.",
            "success"
          );
          fetchAllBets(); // Refresh the list
        } else {
          Swal.fire(
            "Error",
            res?.data?.message || "Failed to delete bet",
            "error"
          );
        }
      } catch (error) {
        console.log("Error deleting bet:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to delete bet",
        });
      }
    }
  };

  // Get status badge color
  const getStatusColor = (isSettled, matchStatus) => {
    if (isSettled === "1" || isSettled === 1) return "activebadge";
    if (matchStatus === "4" || matchStatus === 4) return "inactivebadege"; // Match cancelled
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
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="container">
      {/* Summary Cards - similar to AdminDepositReport */}
      {/* <div className="row mb-3">
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm border-primary summary-card">
            <div className="card-body">
              <h5 className="text-primary mb-1">Today's Bets</h5>
              <h3 className="fw-bold">{todaysBets.toLocaleString()}</h3>
              <small className="text-muted">Total bets placed today</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm border-success summary-card">
            <div className="card-body">
              <h5 className="text-success mb-1">Today's Stake</h5>
              <h3 className="fw-bold">₹ {todaysStake.toLocaleString()}</h3>
              <small className="text-muted">Updated: {getCurrentDateTime()}</small>
            </div>
          </div>
        </div>
   
      </div> */}
      <div className="card">
        <div className="card-header bg-color-black p-2">
          <h3 class="card-title text-white mb-0">Bet History</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="card bg_color_success p-3 text-white">
                <div className="d-flex align-items-center">
                  <BsCreditCard2FrontFill size={28} className="me-3" />
                  <div>
                    <h6 className="mb-1"> Total Bets</h6>
                    <h3 className="mb-0">{totalBets}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg_color_danger p-3 text-white">
                <div className="d-flex align-items-center">
                  <BsArrowDownCircleFill size={28} className="me-3" />
                  <div>
                    <h6 className="mb-1"> Today's Bets</h6>
                    <h3 className="mb-0">{todaysBets}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg_color_info p-3 text-white">
                <div className="d-flex align-items-center">
                  <BsCashStack size={28} className="me-3" />
                  <div>
                    <h6 className="mb-1">Today's Stake</h6>
                    <h3 className="mb-0">₹ {todaysStake.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* View Bet Modal */}
      {showViewModal && selectedBet && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">
                  Bet Details - ID: {selectedBet._id}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold d-inline border-bottom mt-1">
                      User Information
                    </h6>
                    <p className="mb-1">
                      <strong>Mobile:</strong>{" "}
                      {selectedBet.user?.mobile || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>User ID:</strong> {selectedBet.user_id}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold d-inline border-bottom mt-1">Bet Information</h6>
                    <p className="mb-1">
                      <strong>Bet ID:</strong> {selectedBet._id}
                    </p>
                    <p className="mb-1">
                      <strong>Bet Type:</strong> {selectedBet.bet_type}
                    </p>
                    <p className="mb-1">
                      <strong>Bet On:</strong> {selectedBet.bet_on}
                    </p>
                    <p className="mb-1">
                      <strong>Stake:</strong> ₹{selectedBet.stake}
                    </p>
                    <p className="mb-1">
                      <strong>Odds:</strong> {selectedBet.odd}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold d-inline border-bottom mt-1">Market Information</h6>
                    <p className="mb-1">
                      <strong>Event ID:</strong> {selectedBet.event_id}
                    </p>
                    <p className="mb-1">
                      <strong>Market ID:</strong> {selectedBet.market_id}
                    </p>
                    <p className="mb-1">
                      <strong>Sport ID:</strong> {selectedBet.sport_id}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold d-inline border-bottom mt-1">Team & Status</h6>
                    <p className="mb-1">
                      <strong>Team:</strong> {selectedBet.team}
                    </p>
                    <p className="mb-1">
                      <strong>Team ID:</strong> {selectedBet.team_id}
                    </p>
                    <p className="mb-1">
                      <strong>Status:</strong>
                      <span
                        className={`${getStatusColor(
                          selectedBet.is_settled,
                          selectedBet.match_status
                        )} ms-2`}
                      >
                        {getStatusText(
                          selectedBet.is_settled,
                          selectedBet.match_status
                        )}
                      </span>
                    </p>
                    <p className="mb-1">
                      <strong>Matched Status:</strong>{" "}
                      {selectedBet.matched_status}
                    </p>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold d-inline border-bottom mt-1">Financials</h6>
                    <p className="mb-1">
                      <strong>Total:</strong> ₹{selectedBet.total}
                    </p>
                    <p className="mb-1">
                      <strong>C Total:</strong> ₹{selectedBet.c_total}
                    </p>
                    <p className="mb-1">
                      <strong>Liability:</strong> ₹{selectedBet.liability}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold d-inline border-bottom mt-1">Timestamps</h6>
                    <p className="mb-1">
                      <strong>Created At:</strong> <span>{formatDateTime(selectedBet.created_at)}</span>

                    </p>
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

      <div className="card shadow-lg border-0 rounded-4">
     <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">All Bets List</h5>
          <div className="d-flex gap-2">
            <button
              className="filterbutton"
              onClick={() => setFilterVisible((prev) => !prev)}
              title="Toggle Filters"
            >
              <MdFilterListAlt /> Filter
            </button>
            <button
              className="backbutton"
              title="Back"
              onClick={() => navigate("/dashboard")}
            >
              {/* <MdRefresh /> {loading ? "Loading..." : "Refresh"} */}
              <BsArrowLeft className="me-1" />
              Back
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
          <div className="card-body border-bottom">
            <div className="row">
              <div className="col-md-3">
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

              <div className="col-md-3">
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

              <div className="col-md-3">
                <small className="fw-semibold">Mobile Number</small>
                <input
                  type="text"
                  className="form-control"
                  placeholder="User Mobile"
                  value={mobile}
                  onChange={handleMobileNumber}
                />
              </div>

              <div className="col-md-3">
                <small className="fw-semibold">Settled Status</small>
                <select
                  className="form-select"
                  value={isSettled}
                  onChange={handleIsSettled}
                >
                  <option value="">All</option>
                  <option value="0">Not Settled (Pending)</option>
                  <option value="1">Settled</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading bets...</p>
            </div>
          ) : (
            <>
              {bets.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No bets found</p>
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
                            <td>
                              {(page - 1) * appliedFilters.size + index + 1}
                            </td>
                            <td>{bet.user?.mobile || "N/A"}</td>
                            <td>
                              <span className="warningbadge">
                                {bet.bet_type}
                              </span>
                            </td>
                            <td>{bet.team}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                ₹{bet.stake}
                              </div>
                            </td>
                            <td>{bet.odd}</td>
                            <td>
                              <span
                                className={`${bet.bet_on === "back"
                                    ? "activebadge"
                                    : "inactivebadge"
                                  }`}
                              >
                                {bet.bet_on}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`${getStatusColor(
                                  bet.is_settled,
                                  bet.match_status
                                )}`}
                              >
                                {getStatusText(
                                  bet.is_settled,
                                  bet.match_status
                                )}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <div className="fw-medium">
                                  {formatDateTime(bet.created_at)}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="actions">
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
                    {appliedFilters.from === todayStr &&
                      appliedFilters.to === todayStr && (
                        <tfoot className="table-dark">
                          <tr>
                            <td colSpan="4" className="text-end fw-bold">
                              Today's Total:
                            </td>
                            <td className="fw-bold text-success">
                              ₹{" "}
                              {bets
                                .reduce(
                                  (sum, bet) => sum + Number(bet.stake || 0),
                                  0
                                )
                                .toLocaleString()}
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
        </div>

        {/* Pagination */}
        {bets.length > 0 && totalPages > 1 && (
          <div className="card-footer">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="mb-2 mb-md-0">
                <span className="text-muted">
                  Showing {(page - 1) * appliedFilters.size + 1} to{" "}
                  {Math.min(page * appliedFilters.size, totalBets)} of{" "}
                  {totalBets} bets
                </span>
              </div>

              <nav>
                <ul className="pagination mb-0">
                  {/* Left Arrow */}
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={goToPreviousPage}
                      disabled={page === 1 || loading}
                    >
                      &laquo;
                    </button>
                  </li>

                  {/* Current Page */}
                  <li className="page-item active">
                    <span className="page-link">{page}</span>
                  </li>

                  {/* Next Page */}
                  {page + 1 <= totalPages && (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => goToPage(page + 1)}
                        disabled={loading}
                      >
                        {page + 1}
                      </button>
                    </li>
                  )}

                  {/* Right Arrow */}
                  <li
                    className={`page-item ${page === totalPages ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={goToNextPage}
                      disabled={page === totalPages || loading}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BetList;
