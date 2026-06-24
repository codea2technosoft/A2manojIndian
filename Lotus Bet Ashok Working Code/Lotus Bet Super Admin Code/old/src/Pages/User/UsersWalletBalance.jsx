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
  const { id } = useParams();
  const location = useLocation();
  const userData = location.state?.user;

  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [summary, setSummary] = useState(null);

  // Default filters - सभी "All" रखें
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
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 50,
    total: 0,
    totalPages: 1,
  });

  /* ================= FETCH TRANSACTIONS ================= */
  const fetchTransactions = async (page = 1, shouldResetPage = false) => {
    try {
      setLoadingTransactions(true);

      let params = {
        page: shouldResetPage ? 1 : page,
        limit: itemsPerPage,
      };

      // ❗ "All" value को backend में न भेजें
      if (filterBy && filterBy !== "All") {
        params.transactionBy = filterBy;
      }

      if (typeFilter && typeFilter !== "All") {
        params.type = typeFilter;
      }

      if (statusFilter && statusFilter !== "All") {
        params.status = statusFilter;
      }

      if (searchText.trim()) {
        params.search = searchText.trim();
      }

      if (startDate) {
        params.startDate = startDate.toISOString().split("T")[0];
      }

      if (endDate) {
        params.endDate = endDate.toISOString().split("T")[0];
      }

      console.log("Fetching transactions with params:", params);

      const res = await getUserTransactions(id, params);

      if (res.data.success) {
        const data = res.data.data || [];
        const paginationData = res.data.pagination || {};
        const summaryData = res.data.summary || {};

        console.log("Fetched data:", {
          count: data.length,
          pagination: paginationData,
          summary: summaryData,
        });

        setTransactions(data);
        setPagination(paginationData);
        setSummary(summaryData);
        setCurrentPage(paginationData.currentPage || 1);
        setTotalPages(paginationData.totalPages || 1);
        setTotalItems(paginationData.total || 0);

        // Set user info from first transaction if available
        if (data.length > 0 && data[0].userId && !userInfo) {
          setUserInfo(data[0].userId);
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

    // Initial fetch - All transactions without any filters
    fetchTransactions(1, true);
  }, [id]); // Only run when id changes

  /* ================= FILTER CHANGE HANDLERS ================= */
  const handleFilterChange = () => {
    // When any filter changes, reset to page 1
    setCurrentPage(1);
    fetchTransactions(1, true);
  };

  // Separate useEffect for filter changes
  useEffect(() => {
    if (id) {
      // Reset to page 1 when filters change
      setCurrentPage(1);
      const timeoutId = setTimeout(() => {
        fetchTransactions(1, true);
      }, 300); // Debounce for better UX

      return () => clearTimeout(timeoutId);
    }
  }, [filterBy, typeFilter, statusFilter, itemsPerPage]);

  /* ================= HANDLERS ================= */
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTransactions(1, true);
  };

  const handleClearFilters = () => {
    setFilterBy("All");
    setTypeFilter("All");
    setStatusFilter("All");
    setSearchText("");
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
    setItemsPerPage(50);

    // Fetch all transactions without any filters
    fetchTransactions(1, true);

    Swal.fire({
      icon: "success",
      title: "Filters Cleared",
      text: "Showing all transactions",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchTransactions(page, false);
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
    // Don't call fetch here - useEffect will handle it
  };

  const handleRefresh = () => {
    fetchTransactions(currentPage, false);
    Swal.fire({
      icon: "success",
      title: "Refreshed",
      text: "Transactions data refreshed",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  const handleExport = () => {
    // Export functionality
    Swal.fire("Info", "Export feature will be implemented soon", "info");
  };

  /* ================= RENDER PAGINATION ================= */
  const renderPagination = () => {
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

  return (
    <div className="userwalletbalance container-fluid py-3">
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="text-center">
          <h3 className="mb-0">Transaction History</h3>
          {userInfo && (
            <p className="text-muted mb-0">
              User: {userInfo.username || userInfo.name || userInfo.phoneNumber}
              {userInfo.email && ` | ${userInfo.email}`}
            </p>
          )}
        </div>
        {/* <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={handleRefresh}
            disabled={loadingTransactions}
            title="Refresh"
          >
            <BsArrowClockwise className={loadingTransactions ? "spin" : ""} />
          </button>
          <button
            className="btn btn-success"
            onClick={handleExport}
          >
            <BsDownload className="me-2" />
            Export
          </button>
        </div> */}
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
       <div className="card-header bg-primary-yellow p-2 text-white d-flex justify-content-between align-items-center">
      <h3 className="card-title mb-0">
            Transactions
            {isFilterActive() && <small className="ms-2">(Filtered)</small>}
          </h3>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filter
            </button>

            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              <BsArrowLeft className="me-1" />
              Back
            </button>
          </div>

          {/* <div className="text-white">
            {loadingTransactions ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} transactions
              </>
            )}
          </div> */}
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
                  onChange={(e) => {
                    setFilterBy(e.target.value);
                    handleFilterChange();
                  }}
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
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    handleFilterChange();
                  }}
                >
                  <option value="All">All Types</option>
                  <option value="Deposit">Deposit</option>
                  <option value="Withdraw">Withdraw</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    handleFilterChange();
                  }}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Success">Success</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* <div className="col-md-2">
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
              </div> */}

              {/* Date Range Filters */}
              <div className="col-md-2">
                <label className="form-label">Start Date</label>
                <div className="input-group w-100">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      handleFilterChange();
                    }}
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
                    onChange={(date) => {
                      setEndDate(date);
                      handleFilterChange();
                    }}
                    className="form-control w-100"
                    placeholderText="End Date"
                    dateFormat="dd/MM/yyyy"
                    minDate={startDate}
                    maxDate={new Date()}
                  />
                </div>
              </div>

              {/* <div className="col-md-1 d-flex align-items-end">
                <button
                  className="btn btn-primary"
                  onClick={() => fetchTransactions(1, true)}
                  disabled={loadingTransactions}
                >
                  {loadingTransactions ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      <BsArrowClockwise className="me-2" />
                      Filter
                    </>
                  )}
                </button>
              </div> */}
            </div>
          </div>
        )}

        <div className="card-body table-responsive">
          {loadingTransactions && transactions.length === 0 ? (
            <div className="text-center p-5">
              <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
              ></div>
              <p className="mt-3">Loading all transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
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
                  {transactions.map((t, index) => (
                    <tr key={t._id} className="align-middle">
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        <span
                          className={`badge ${
                            t.type === "Deposit" ? "bg-success" : "bg-warning"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td>
                        <strong>₹ {t.amount?.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            t.transactionBy === "Admin"
                              ? "bg-danger"
                              : "bg-primary"
                          }`}
                        >
                          {t.transactionBy}
                        </span>
                      </td>
                      <td>₹ {t.openingBalance?.toLocaleString() || "0"}</td>
                      <td>₹ {t.closingBalance?.toLocaleString() || "0"}</td>
                      <td>
                        <span
                          className={`badge ${
                            t.status === "Success"
                              ? "bg-success"
                              : t.status === "Pending"
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td>
                        {new Date(t.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        {t.utrNumber ? (
                          <code className="bg-light p-1 rounded">
                            {t.utrNumber}
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

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="card-footer">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <div className="d-flex align-items-center">
                        <span className="me-2">Show:</span>
                        <select
                          className="form-select form-select-sm w-auto"
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <span className="ms-2">entries</span>
                      </div>
                    </div>
                    <div className="col-md-4">{renderPagination()}</div>
                    <div className="col-md-4 text-end">
                      <small className="text-muted">
                        Page {currentPage} of {totalPages} • {totalItems} total
                        records
                      </small>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add CSS for spinner animation */}
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
