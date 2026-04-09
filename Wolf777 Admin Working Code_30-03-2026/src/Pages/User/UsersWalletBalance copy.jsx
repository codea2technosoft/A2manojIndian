import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  BsCreditCard2FrontFill,
  BsArrowDownCircleFill,
  BsCashStack,
  BsArrowLeft,
  BsSearch,
  BsDownload,
  BsFilter,
  BsCalendar,
  BsChevronLeft,
  BsChevronRight,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsArrowClockwise,
} from "react-icons/bs";
import { getUserTransactions } from "../../Server/api";
import { FiFilter } from "react-icons/fi";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UsersWalletBalance() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.user;

  const adminId = localStorage.getItem("admin_id");
  const id = localStorage.getItem("user_id");
  
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [summary, setSummary] = useState(null);

  // Default filters
  const [filterBy, setFilterBy] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  /* ================= FETCH ALL TRANSACTIONS ================= */
  const fetchAllTransactions = async () => {
    try {
      setLoadingTransactions(true);

      if (!id || !adminId) {
        Swal.fire("Error", "User ID or Admin ID not found", "error");
        return;
      }

      const res = await getUserTransactions(id, {
        admin_id: adminId,
        page: 1,
        limit: 1000
      });

      if (res.data.success) {
        const data = res.data.data || [];
        const summaryData = res.data.summary || {};

        console.log("Fetched all transactions:", data.length);
        console.log("Sample transaction:", data[0]);
        
        setAllTransactions(data);
        setFilteredTransactions(data);
        setSummary(summaryData);

        if (data.length > 0 && data[0].user_id && !userInfo) {
          setUserInfo({ id: data[0].user_id });
        }
      } else {
        Swal.fire(
          "Error",
          res.data.message || "Failed to fetch transactions",
          "error"
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to fetch transactions",
        "error"
      );
    } finally {
      setLoadingTransactions(false);
    }
  };

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    if (!id) {
      Swal.fire("Error", "User ID not found", "error");
      navigate("/users");
      return;
    }

    fetchAllTransactions();
  }, [id]);

  /* ================= APPLY FILTERS (CLIENT SIDE) ================= */
  const applyFilters = () => {
    let filtered = [...allTransactions];

    // Filter by Transaction By (User/Admin)
    if (filterBy !== "All") {
      filtered = filtered.filter(t => {
        const transactionBy = t.payment_gateway_type || t.transactionBy || t.added_by;
        return transactionBy === filterBy;
      });
    }

    // Filter by Type - Fixed based on API response
    if (typeFilter !== "All") {
      filtered = filtered.filter(t => {
        // Bet filter
        if (typeFilter === "Bet") {
          return t.tr_type === "Bet";
        }
        
        // Deposit filter - based on value_update_by or type
        if (typeFilter === "credit") {
          return t.value_update_by === "Deposit" || 
                 t.type === "deposit" || 
                 t.tr_type === "credit";
        }
        
        // Withdraw filter - based on value_update_by or type
        if (typeFilter === "debit") {
          return t.value_update_by === "Withdraw" || 
                 t.type === "withdraw" || 
                 t.tr_type === "debit";
        }
        
        return true;
      });
    }

    // Filter by Status - Fixed for your status values
    if (statusFilter !== "All") {
      filtered = filtered.filter(t => {
        const status = (t.tr_status || t.status || "").toString().toLowerCase();
        
        if (statusFilter === "Success") {
          return status === "success" || t.status === 0;
        } else if (statusFilter === "Pending") {
          return status === "pending";
        } else if (statusFilter === "Rejected") {
          return status === "rejected" || status === "failed";
        }
        return true;
      });
    }

    // Filter by Search Text
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(t => 
        (t.remark && t.remark.toLowerCase().includes(searchLower)) ||
        (t.transaction_id && t.transaction_id.toLowerCase().includes(searchLower)) ||
        (t.utrNumber && t.utrNumber.toLowerCase().includes(searchLower))
      );
    }

    // Filter by Date Range
    if (startDate) {
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      filtered = filtered.filter(t => {
        const date = new Date(t.created_at || t.createdAt).setHours(0, 0, 0, 0);
        return date >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      filtered = filtered.filter(t => {
        const date = new Date(t.created_at || t.createdAt).getTime();
        return date <= end;
      });
    }

    // Update filtered transactions
    setFilteredTransactions(filtered);
    setCurrentPage(1);
    updateSummary(filtered);
    
    // Debug log
    console.log(`Filter applied - Type: ${typeFilter}, Found: ${filtered.length} transactions`);
  };

  /* ================= UPDATE SUMMARY ================= */
  const updateSummary = (filteredData) => {
    let totalDeposit = 0;
    let totalWithdraw = 0;

    filteredData.forEach(t => {
      const amount = t.amount || 0;
      
      // Check if it's a deposit (based on value_update_by or type)
      if (t.value_update_by === "Deposit" || t.type === "deposit" || t.tr_type === "credit") {
        const status = (t.tr_status || t.status || "").toString().toLowerCase();
        if (status === "success" || t.status === 0) {
          totalDeposit += amount;
        }
      }
      
      // Check if it's a withdrawal (based on value_update_by or type)
      if (t.value_update_by === "Withdraw" || t.type === "withdraw" || t.tr_type === "debit") {
        const status = (t.tr_status || t.status || "").toString().toLowerCase();
        if (status === "success" || t.status === 0) {
          totalWithdraw += amount;
        }
      }
    });

    setSummary({
      totalSuccessDeposit: totalDeposit,
      totalSuccessWithdraw: totalWithdraw,
      netBalance: totalDeposit - totalWithdraw,
      totalTransactions: filteredData.length
    });
  };

  /* ================= FILTER CHANGE HANDLERS ================= */
  useEffect(() => {
    if (allTransactions.length > 0) {
      applyFilters();
    }
  }, [filterBy, typeFilter, statusFilter, searchText, startDate, endDate]);

  /* ================= HANDLERS ================= */
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleClearFilters = () => {
    setFilterBy("All");
    setTypeFilter("All");
    setStatusFilter("All");
    setSearchText("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
    
    setFilteredTransactions(allTransactions);
    updateSummary(allTransactions);

    Swal.fire({
      icon: "success",
      title: "Filters Cleared",
      text: "Showing all transactions",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handlePageChange = (page) => {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchAllTransactions();
    Swal.fire({
      icon: "success",
      title: "Refreshed",
      text: "Transactions data refreshed",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  /* ================= GET CURRENT PAGE ITEMS ================= */
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  /* ================= RENDER PAGINATION ================= */
  const renderPagination = () => {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    return (
      <nav aria-label="Transaction pagination">
        <ul className="pagination justify-content-center mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              title="First Page"
            >
              <BsChevronDoubleLeft />
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous Page"
            >
              <BsChevronLeft />
            </button>
          </li>

          {pages}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next Page"
            >
              <BsChevronRight />
            </button>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Last Page"
            >
              <BsChevronDoubleRight />
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  /* ================= CHECK IF FILTERS ARE ACTIVE ================= */
  const isFilterActive = () => {
    return (
      filterBy !== "All" ||
      typeFilter !== "All" ||
      statusFilter !== "All" ||
      searchText.trim() !== "" ||
      startDate !== null ||
      endDate !== null
    );
  };

  /* ================= HELPER FUNCTIONS FOR DISPLAY ================= */
  const getDisplayType = (transaction) => {
    if (transaction.tr_type === "Bet") return "Bet";
    if (transaction.value_update_by === "Deposit" || transaction.type === "deposit" || transaction.tr_type === "credit") 
      return "Deposit";
    if (transaction.value_update_by === "Withdraw" || transaction.type === "withdraw" || transaction.tr_type === "debit") 
      return "Withdraw";
    return transaction.tr_type || "N/A";
  };

  const getTypeBadgeColor = (transaction) => {
    const type = getDisplayType(transaction);
    if (type === "Deposit") return "bg-success";
    if (type === "Withdraw") return "bg-warning";
    if (type === "Bet") return "bg-info";
    return "bg-secondary";
  };

  const getStatusBadgeColor = (transaction) => {
    const status = (transaction.tr_status || transaction.status || "").toString().toLowerCase();
    if (status === "success" || transaction.status === 0) 
      return "bg-success";
    if (status === "pending") 
      return "bg-warning";
    if (status === "rejected" || status === "failed") 
      return "bg-danger";
    return "bg-secondary";
  };

  const getDisplayStatus = (transaction) => {
    const status = transaction.tr_status || transaction.status;
    if (status === 0 || status === "0" || status === "Success" || status === "success") 
      return "Success";
    if (status === "pending" || status === "Pending") 
      return "Pending";
    if (status === "rejected" || status === "Rejected" || status === "failed") 
      return "Rejected";
    return status || "N/A";
  };

  const currentItems = getCurrentPageItems();
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Calculate stats for display
  const betCount = allTransactions.filter(t => t.tr_type === "Bet").length;
  const depositCount = allTransactions.filter(t => t.value_update_by === "Deposit" || t.type === "deposit" || t.tr_type === "credit").length;
  const withdrawCount = allTransactions.filter(t => t.value_update_by === "Withdraw" || t.type === "withdraw" || t.tr_type === "debit").length;

  return (
    <div className="userwalletbalance container-fluid py-3">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-center">
          <h3 className="mb-0">Transaction History</h3>
          {userData && (
            <p className="text-muted mb-0">
              User: {userData.username || userData.name || userData.phoneNumber}
              {userData.email && ` | ${userData.email}`}
            </p>
          )}
        </div>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={handleRefresh}
            disabled={loadingTransactions}
            title="Refresh"
          >
            <BsArrowClockwise className={loadingTransactions ? "spin" : ""} />
          </button>
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success p-3 text-white">
            <div className="d-flex align-items-center">
              <BsCreditCard2FrontFill size={28} className="me-3" />
              <div>
                <h6 className="mb-1">Total Deposit</h6>
                <h3 className="mb-0">
                  ₹ {summary?.totalSuccessDeposit?.toLocaleString() || "0"}
                </h3>
                <small>Success transactions only</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-warning p-3 text-white">
            <div className="d-flex align-items-center">
              <BsArrowDownCircleFill size={28} className="me-3" />
              <div>
                <h6 className="mb-1">Total Withdraw</h6>
                <h3 className="mb-0">
                  ₹ {summary?.totalSuccessWithdraw?.toLocaleString() || "0"}
                </h3>
                <small>Success transactions only</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-info p-3 text-white">
            <div className="d-flex align-items-center">
              <BsCashStack size={28} className="me-3" />
              <div>
                <h6 className="mb-1">Net Balance</h6>
                <h3 className="mb-0">
                  ₹ {summary?.netBalance?.toLocaleString() || "0"}
                </h3>
                <small>Deposit - Withdraw</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TRANSACTIONS TABLE ================= */}
      <div className="card">
        <div className="card-header bg-dark p-2 text-white d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">
            Transactions
            {isFilterActive() && (
              <small className="ms-2">(Filtered: {filteredTransactions.length} records)</small>
            )}
          </h3>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
              <BsArrowLeft className="me-1" />
              Back
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card-body border-bottom">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <div className="flex-grow-1">
              <input
                type="text"
                className="form-control"
                placeholder="Search by remarks or transaction ID..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <BsSearch className="me-2" />
              Search
            </button>
          </form>
        </div>

        {/* Filters (Collapsible) */}
        {showFilters && (
          <div className="card-body border-bottom">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Transaction By</label>
                <select
                  className="form-select"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="All">All (User + Admin)</option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Transaction Type</label>
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="credit">Deposit</option>
                  <option value="debit">Withdraw</option>
                  <option value="Bet">Bet</option>
                </select>
                <small className="text-muted d-block mt-1">
                  Total: {allTransactions.length} | 
                  Bet: {betCount} | Deposit: {depositCount} | Withdraw: {withdrawCount}
                </small>
              </div>

              <div className="col-md-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Records Per Page</label>
                <select
                  className="form-select"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Start Date</label>
                <div className="input-group w-100">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    className="form-control"
                    placeholderText="Start Date"
                    dateFormat="dd/MM/yyyy"
                    maxDate={endDate || new Date()}
                  />
                </div>
              </div>

              <div className="col-md-2">
                <label className="form-label">End Date</label>
                <div className="input-group">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    className="form-control w-100"
                    placeholderText="End Date"
                    dateFormat="dd/MM/yyyy"
                    minDate={startDate}
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>

            {/* Filter Stats */}
            <div className="row mt-2">
              <div className="col-12">
                <small className="text-info">
                  Showing {filteredTransactions.length} of {allTransactions.length} transactions
                  {typeFilter !== "All" && ` | Type: ${typeFilter === "credit" ? "Deposit" : typeFilter === "debit" ? "Withdraw" : "Bet"}`}
                  {statusFilter !== "All" && ` | Status: ${statusFilter}`}
                </small>
              </div>
            </div>

            {/* Clear Filters Button */}
            {isFilterActive() && (
              <div className="row mt-3">
                <div className="col-12">
                  <button
                    className="btn btn-warning"
                    onClick={handleClearFilters}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="card-body table-responsive">
          {loadingTransactions && allTransactions.length === 0 ? (
            <div className="text-center p-5">
              <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
              ></div>
              <p className="mt-3">Loading all transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center p-5">
              <h5>No transactions found</h5>
              <p className="text-muted">
                {isFilterActive()
                  ? "No transactions match your filters"
                  : "This user has no transactions yet"}
              </p>
              {isFilterActive() && (
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleClearFilters}
                >
                  Show All Transactions
                </button>
              )}
            </div>
          ) : (
            <>
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Transaction By</th>
                    <th>Opening</th>
                    <th>Closing</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th>UTR/Ref No</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((t, index) => (
                    <tr key={t._id} className="align-middle">
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <span className={`badge ${getTypeBadgeColor(t)}`}>
                          {getDisplayType(t)}
                        </span>
                      </td>
                      <td>
                        <strong>₹ {t.amount?.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            t.payment_gateway_type === "Admin" ||
                            t.transactionBy === "Admin" ||
                            t.added_by === "Admin"
                              ? "bg-danger"
                              : "bg-primary"
                          }`}
                        >
                          {t.payment_gateway_type || 
                           t.transactionBy || 
                           t.added_by || 
                           (t.admin_id ? "Admin" : "User")}
                        </span>
                      </td>
                      <td>₹ {t.before_balance_from?.toLocaleString() || t.openingBalance?.toLocaleString() || "0"}</td>
                      <td>₹ {t.wallet_amount?.toLocaleString() || t.closingBalance?.toLocaleString() || "0"}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeColor(t)}`}>
                          {getDisplayStatus(t)}
                        </span>
                      </td>
                      <td>
                        {new Date(t.created_at || t.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        {t.transaction_id || t.utrNumber ? (
                          <code className="bg-light p-1 rounded">
                            {t.transaction_id || t.utrNumber}
                          </code>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {t.remark ? (
                          <span title={t.remark}>
                            {t.remark.length > 30
                              ? t.remark.substring(0, 30) + "..."
                              : t.remark}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{" "}
                    {filteredTransactions.length} transactions
                  </small>
                </div>
                <div>
                  {renderPagination()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CSS for spinner */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default UsersWalletBalance;