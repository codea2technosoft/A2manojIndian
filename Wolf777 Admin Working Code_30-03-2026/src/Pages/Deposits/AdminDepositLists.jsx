import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt, MdRefresh, MdToday } from "react-icons/md";
import { FaChevronLeft, FaChevronRight, FaRedoAlt } from "react-icons/fa";
import { getAllgetAllDepositList } from "../../Server/api";

const AdminDepositReport = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  // State declarations
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // Store all data for today's calculation
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [todaysDeposit, setTodaysDeposit] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [error, setError] = useState(null);

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

  const [filters, setFilters] = useState({
    mobile: "",
    startDate: "",
    endDate: ""
  });

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

  // Filter handlers
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilter = () => {
    setFilters({
      mobile: "",
      startDate: "",
      endDate: ""
    });
    setCurrentPage(1);
    fetchReport();
    setError(null);
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    fetchReport();
  };

  // Add today's filter button
  const handleTodayFilter = () => {
    const today = getTodayDate();
    setFilters({
      mobile: "",
      startDate: today,
      endDate: today
    });
    setCurrentPage(1);
    // Fetch immediately when today filter is clicked
    fetchReport(1, today, today);
  };

  const toggleFilter = () => {
    setShowFilter(prev => !prev);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
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

  // Calculate today's deposit from ALL data (not just current page)
  const calculateTodaysDeposit = async () => {
    try {
      const today = getTodayDate();
      console.log("Calculating today's deposit for date:", today);

      // Fetch ALL today's data in one call
      const params = {
        page: 1,
        limit: 1000, // Large limit to get all today's data
        type: "Deposit",
        startDate: today,
        endDate: today
      };

      const res = await getAllgetAllDepositList(params);

      if (res.data?.success) {
        const result = res.data;
        const todayData = result.data || [];
        console.log("Today's data count:", todayData.length);

        // Calculate total today's deposit
        const todayTotal = todayData.reduce((sum, item) => {
          const amount = Number(item.amount || item.depositAmount || 0);
          console.log("Item amount:", amount);
          return sum + amount;
        }, 0);

        console.log("Today's total deposit:", todayTotal);
        setTodaysDeposit(todayTotal);
      } else {
        console.log("No today's data found");
        setTodaysDeposit(0);
      }
    } catch (error) {
      console.error("Error calculating today's deposit:", error);
      setTodaysDeposit(0);
    }
  };

  // API call to fetch report data
  const fetchReport = useCallback(async (page = currentPage, startDate = filters.startDate, endDate = filters.endDate) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: 10,
        type: "Deposit",
        mobile: filters.mobile || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      console.log("Fetching with params:", params);

      const res = await getAllgetAllDepositList(params);

      if (res.data?.success) {
        const result = res.data;
        const reportData = result.data || [];

        console.log("API response data:", reportData);

        setData(reportData);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalRecords(result.pagination?.total || 0);

        // Calculate total deposit from current page data
        const total = reportData.reduce((sum, item) => {
          return sum + Number(item.amount || item.depositAmount || 0);
        }, 0);
        setTotalDeposit(total);

        // If no date filters applied, calculate today's deposit
        if (!filters.startDate && !filters.endDate) {
          await calculateTodaysDeposit();
        } else {
          // If filtering for today, show sum of filtered data
          const today = getTodayDate();
          if (startDate === today && endDate === today) {
            const todayTotal = reportData.reduce((sum, item) => {
              return sum + Number(item.amount || item.depositAmount || 0);
            }, 0);
            setTodaysDeposit(todayTotal);
          } else {
            // Fetch today's deposit separately
            await calculateTodaysDeposit();
          }
        }

        setError(null);
      } else {
        setData([]);
        setTotalDeposit(0);
        setTodaysDeposit(0);
        setTotalPages(1);
        setTotalRecords(0);
        setError(res.data?.message || "No deposit records found");
      }
    } catch (error) {
      console.error("Deposit API Error:", error);
      setData([]);
      setTotalDeposit(0);
      setTodaysDeposit(0);
      setError(error.response?.data?.message || "Failed to load deposit records");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  // Fetch data when page changes
  useEffect(() => {
    fetchReport();
  }, [currentPage, fetchReport]);

  // Initial fetch and calculate today's deposit
  useEffect(() => {
    fetchReport(1);
  }, []);

  // Recalculate today's deposit every minute
  useEffect(() => {
    const interval = setInterval(() => {
      calculateTodaysDeposit();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-3">
      {/* Total Deposit Summary Cards */}
      <div className="row mb-3">
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm border-success summary-card">
            <div className="card-body">
              <h5 className="text-success mb-1">Total Deposit</h5>
              <h3 className="fw-bold">₹ {totalDeposit.toLocaleString()}</h3>
              <small className="text-muted">Current page total</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center shadow-sm border-primary summary-card">
            <div className="card-body">
              <h5 className="text-primary mb-1">Today's Deposit</h5>
              <h3 className="fw-bold">₹ {todaysDeposit.toLocaleString()}</h3>
              <small className="text-muted">Updated: {getCurrentDateTime()}</small>
            </div>
          </div>
        </div>


      </div>

      {/* Main Report Card */}
      <div className="card shadow-lg border-0 rounded-4">
        {/* Card Header */}
       <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">Deposit List</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light d-flex align-items-center gap-1"
              onClick={toggleFilter}
              title="Toggle Filters"
            >
              <MdFilterListAlt /> {showFilter ? "Hide" : "Show"} Filters
            </button>
            <button
              className="btn btn-outline-light d-flex align-items-center gap-1"
              onClick={() => {
                fetchReport();
                calculateTodaysDeposit();
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

        {/* Card Body */}
        <div className="card-body p-0">
          {/* Filter Section */}
          {showFilter && (
            <div className="p-3 bg-light border-bottom d-flex flex-wrap align-items-end gap-3">
              {/* Mobile Filter */}
              <div className="form_latest_design">
                <small className="fw-semibold">Mobile Number</small>
                <input
                  type="text"
                  className="form-control"
                  value={filters.mobile}
                  onChange={(e) => handleFilterChange('mobile', e.target.value)}
                  placeholder="Enter mobile number"
                />
              </div>

              {/* Start Date Filter */}
              <div className="form_latest_design">
                <small className="fw-semibold">Start Date</small>
                <input
                  type="date"
                  className="form-control"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  max={getTodayDate()}
                />
              </div>

              {/* End Date Filter */}
              <div className="form_latest_design">
                <small className="fw-semibold">End Date</small>
                <input
                  type="date"
                  className="form-control"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  max={getTodayDate()}
                  min={filters.startDate}
                />
              </div>

              {/* Today's Filter Button */}


              {/* Filter Buttons */}
              <div className="d-flex align-items-end gap-2">
                <button
                  className="btn btn-primary d-flex align-items-center gap-2"
                  onClick={handleApplyFilter}
                  disabled={loading}
                >
                  Apply Filter
                </button>
                <button
                  className="btn btn-secondary d-flex align-items-center gap-2"
                  onClick={handleClearFilter}
                  disabled={loading}
                >
                  <FaRedoAlt /> Reset
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading deposit records...</p>
            </div>
          ) : (
            <>
              {/* Data Table */}
              {data.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No deposit records found</p>
                  <button className="btn btn-primary mt-2" onClick={handleClearFilter}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-striped mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Date & Time</th>
                        <th>Mobile</th>
                        <th>Opening</th>
                        <th>Amount</th>
                        <th>Closing</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => {
                        const depositAmount = Number(item.amount || item.depositAmount || 0);
                        const itemIsToday = isToday(item.createdAt || item.date);

                        return (
                          <tr key={`${item.id || item._id || index}-${currentPage}`}>
                            <td>{(currentPage - 1) * 10 + index + 1}</td>
                            <td>
                              <div className="d-flex flex-column">
                                <div className="fw-medium">
                                  {formatDateTime(item.created_at)}
                                </div>
                              </div>
                            </td>
                            <td className="fw-medium">{item.mobile || item.phone || item.userId || "N/A"}</td>
                            <td>₹ {Number(item.openingBalance || 0).toLocaleString()}</td>
                            <td className="fw-semibold text-success">
                              <div className="d-flex align-items-center gap-2">
                                ₹ {depositAmount.toLocaleString()}
                              </div>
                            </td>
                            <td>₹ {Number(item.closingBalance || 0).toLocaleString()}</td>
                            <td>
                              <span className={`badge bg-${item.status === 'success' || item.status === 'completed' ? 'success' :
                                item.status === 'pending' ? 'warning' :
                                  item.status === 'failed' ? 'danger' : 'info'}`}>
                                {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Completed'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {filters.startDate && filters.endDate && (
                      <tfoot className="table-dark">
                        <tr>
                          <td colSpan="4" className="text-end fw-bold">Filtered Total:</td>
                          <td className="fw-bold text-success">
                            ₹ {data.reduce((sum, item) => sum + Number(item.amount || item.depositAmount || 0), 0).toLocaleString()}
                          </td>
                          <td colSpan="2"></td>
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
        {data.length > 0 && totalPages > 1 && (
          <div className="card-footer">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted">
                  Showing {(currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(currentPage * 10, totalRecords)} of {totalRecords} entries
                </span>
              </div>

              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1 || loading}
                    >
                      <FaChevronLeft />
                    </button>
                  </li>

                  {getPageNumbers().map((pageNum) => (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => goToPage(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages || loading}
                    >
                      <FaChevronRight />
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
};

export default AdminDepositReport;