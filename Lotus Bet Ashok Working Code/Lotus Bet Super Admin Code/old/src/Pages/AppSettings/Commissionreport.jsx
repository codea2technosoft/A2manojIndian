import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

function CasetransactionReport() {
  const navigate = useNavigate();
  const admin_id = localStorage.getItem("admin_id");
  const [ledgerData, setLedgerData] = useState([]);
  const [summary, setSummary] = useState({
    match_com: 0,
    sec_com: 0,
    total_com: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // Track which row is being updated

  // ==================================================
  // 📌 FETCH TRANSACTION LIST
  // ==================================================
  const fetchTransactionList = async (page = 1, search = "", from = "", to = "") => {
    try {
      setIsSearching(true);
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      if (!admin_id || !role || !token) {
        console.warn("Missing authentication data");
        navigate("/login");
        return;
      }

      const payload = {
        role: role,
        parent_id: admin_id,
        send_to_admin_id: admin_id,
        from_date: from,
        to_date: to,
        search: search,
        page: page,
        limit: itemsPerPage
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/commission-report`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data?.success) {
        const result = response.data;
        setLedgerData(result.data || []);
        
        setSummary({
          match_com: result.summary?.match_com || 0,
          sec_com: result.summary?.sec_com || 0,
          total_com: result.summary?.total_com || 0,
        });
        
        setCurrentPage(result.page || page);
        setTotalItems(result.total || 0);
        setTotalPages(result.totalPages || 1);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to fetch transaction data",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // ==================================================
  // 📌 COMMISSION REPORT UPDATE FUNCTION
  // ==================================================
  const commissionreportupdate = async (event_id, adminId) => {
    try {
      setUpdatingId(event_id); // Set updating state for this row
      
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      if (!admin_id || !role || !token) {
        console.warn("Missing authentication data");
        navigate("/login");
        return;
      }

      const payload = {
        role: role,
        admin_id: adminId,
        event_id: event_id
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/commission-report-update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Commission report updated successfully",
          timer: 2000,
          showConfirmButton: false
        });
        
        // Refresh the data after successful update
        fetchTransactionList(currentPage, searchTerm, fromDate, toDate);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data?.message || "Failed to update commission report",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to update commission report",
      });
    } finally {
      setUpdatingId(null); // Clear updating state
    }
  };

  useEffect(() => {
    fetchTransactionList(1, "", "", "");
  }, []);

  // ==================================================
  // 📌 SEARCH HANDLERS
  // ==================================================
  const handleSearch = () => {
    if (!searchInput.trim()) return;
    setSearchTerm(searchInput);
    setCurrentPage(1);
    fetchTransactionList(1, searchInput, fromDate, toDate);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
    fetchTransactionList(1, "", fromDate, toDate);
  };

  // ==================================================
  // 📌 FILTER HANDLER
  // ==================================================
  const handleFilter = () => {
    setCurrentPage(1);
    fetchTransactionList(1, searchTerm, fromDate, toDate);
  };

  // ==================================================
  // 📌 CLEAR FILTERS
  // ==================================================
  const handleRefresh = () => {
    setFromDate("");
    setToDate("");
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
    fetchTransactionList(1, "", "", "");
  };

  // ==================================================
  // 📌 PAGINATION HANDLERS
  // ==================================================
  const handlePageClick = (page) => {
    fetchTransactionList(page, searchTerm, fromDate, toDate);
  };

  const handlePrev = () => {
    if (currentPage > 1) fetchTransactionList(currentPage - 1, searchTerm, fromDate, toDate);
  };

  const handleNext = () => {
    if (currentPage < totalPages) fetchTransactionList(currentPage + 1, searchTerm, fromDate, toDate);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };
  
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-primary-yellow p-2 text-white d-flex justify-content-between align-items-center">
            <h3 className="card-title text-dark mb-0">Commission Report</h3>
            <div>
        <button
  className="btn btn-sm bg-primary-blue"
  onClick={() => window.location.href = "/commission-histry"}
>
  History
</button>
            </div>
            {/* <div>
              <button className="btn btn-sm btn-light" onClick={() => setShowFilter(!showFilter)}> 
                {showFilter ? "Hide Filter" : "Show Filter"}
              </button>
            </div> */}
          </div>
          <div className="card-body">
            {showFilter && (
              <div className="row mb-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label mb-1">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label mb-1">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label mb-1">Search User</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter username or admin ID..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleSearch}
                      disabled={isSearching || !searchInput.trim()}
                    >
                      <FiSearch />
                    </button>
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleClearSearch}
                        type="button"
                      >
                        <RxCross2 />
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary flex-grow-1"
                      onClick={handleFilter}
                      disabled={isSearching}
                    >
                      Apply Filter
                    </button>
                    {(fromDate || toDate || searchTerm) && (
                      <button
                        className="btn btn-secondary"
                        onClick={handleRefresh}
                        type="button"
                      >
                        Refresh
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {(fromDate || toDate || searchTerm) && (
              <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
                <span className="fw-bold">Active Filters:</span>
                {fromDate && (
                  <span className="badge bg-light text-dark p-2">
                    From: {new Date(fromDate).toLocaleDateString()}
                  </span>
                )}
                {toDate && (
                  <span className="badge bg-light text-dark p-2">
                    To: {new Date(toDate).toLocaleDateString()}
                  </span>
                )}
                {searchTerm && (
                  <span className="badge bg-light text-dark p-2">
                    Search: "{searchTerm}"
                  </span>
                )}
              </div>
            )}

            {/* SUMMARY CARDS */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card  primary-blue">
                  <div className="card-body">
                    <h6 className="card-title">Match Commission</h6>
                    <h4 className="mb-0">₹{summary.match_com.toFixed(2)}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card  success-green">
                  <div className="card-body">
                    <h6 className="card-title">Session Commission</h6>
                    <h4 className="mb-0">₹{summary.sec_com.toFixed(2)}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card royal-purple">
                  <div className="card-body">
                    <h6 className="card-title">Total Commission</h6>
                    <h4 className="mb-0">₹{summary.total_com.toFixed(2)}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>DATE & TIME</th>
                    <th>USER ID</th>
                    <th>Match Name</th>
                    <th>MATCH COM</th>
                    <th>Session COM</th>
                    <th>TOTAL COM</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <span className="text-muted">No Data Found</span>
                      </td>
                    </tr>
                  ) : (
                    ledgerData.map((transaction) => {
                      const isUpdating = updatingId === transaction.event_id;
                      
                      return (
                        <tr key={transaction._id}>
                          <td>
                            {new Date(transaction.created_at).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </td>
                          <td>{transaction.admin_id || "-"}</td>
                          <td>{transaction.match_name || "-"}</td>
                          <td className="text-primary fw-bold">
                            ₹{transaction.match_com?.toFixed(2) || "0.00"}
                          </td>
                          <td className="text-success fw-bold">
                            ₹{transaction.sec_com?.toFixed(2) || "0.00"}
                          </td>
                          <td className="text-info fw-bold">
                            ₹{transaction.total_com?.toFixed(2) || "0.00"}
                          </td>
                          <td>
                            {transaction.is_settle === 'yes' ? (
                              <span className="badge bg-success">
                                Settled
                              </span>
                            ) : (
                              <button
                                className="settlementnowbutton"
                                onClick={() => commissionreportupdate(transaction.event_id, transaction._id)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                    Updating...
                                  </>
                                ) : (
                                  'Settle Now'
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                  Showing {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                </div>
                <div className="paginationall d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                  >
                    <MdOutlineKeyboardArrowLeft />
                  </button>
                  <div className="d-flex gap-1">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => handlePageClick(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={currentPage === totalPages}
                    onClick={handleNext}
                  >
                    <MdOutlineKeyboardArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CasetransactionReport;