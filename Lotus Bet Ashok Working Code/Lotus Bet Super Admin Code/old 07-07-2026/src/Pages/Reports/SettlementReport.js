import React, { useState, useEffect } from "react";
import { getSettlementReporttAll } from "../../Server/api";
import Toast from "../../User/Toast";
import { FaSearch } from "react-icons/fa";
import Loader from "../../Common/Loader";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

function SettlementReport() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [summary, setSummary] = useState({ lena: 0, dena: 0, balance: 0 });

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Pagination
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  // Set default dates (last 7 days)
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatDateInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setFromDate(formatDateInput(sevenDaysAgo));
    setToDate(formatDateInput(today));
  }, []);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const fetchSettlementReport = async (
    from = "",
    to = "",
    search = "",
    page = 1,
  ) => {
    try {
      setLoading(true);
      setError("");

      const admin_id = localStorage.getItem("admin_id");
      const payload = {
        admin_id: admin_id,
        from_date: from,
        to_date: to,
        search: search,
        page: page,
        limit: itemsPerPage,
      };

      const response = await getSettlementReporttAll(payload);
      console.log("API Response:", response);

      if (response.data && response.data.success === true) {
        // Set summary
        setSummary({
          lena: response.data.lena || 0,
          dena: response.data.dena || 0,
          balance: response.data.balance || 0,
        });

        // Set transactions from data.data
        const allTransactions = response.data.data?.data || [];
        setTransactions(allTransactions);
        setCurrentPage(response.data.current_page || 1);
        setTotalPages(response.data.data?.per_page ? Math.ceil(response.data.total / response.data.per_page) : 1);
        setTotalItems(response.data.data?.total || 0);
        setError("");
      } else {
        const errorMsg =
          response.data?.error?.message || "Failed to fetch settlement report";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      console.error("Error fetching settlement report:", err);
      const errorMsg =
        err.response?.data?.error?.message ||
        err.message ||
        "Failed to fetch settlement report";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Handle Search - Server side
  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1);
    if (fromDate && toDate) {
      fetchSettlementReport(fromDate, toDate, searchTerm, 1);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Fetch when dates change
  useEffect(() => {
    if (fromDate && toDate) {
      setSearchTerm("");
      setCurrentPage(1);
      fetchSettlementReport(fromDate, toDate, "", 1);
    }
  }, [fromDate, toDate]);

  // Fetch when page changes
  useEffect(() => {
    if (fromDate && toDate && currentPage > 1) {
      fetchSettlementReport(fromDate, toDate, searchTerm, currentPage);
    }
  }, [currentPage]);

  // Pagination Handlers
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Format date time
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    try {
      const date = new Date(dateTime);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return dateTime;
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // Get description
  const getDescription = (transaction) => {
    if (transaction.comment) return transaction.comment;
    if (transaction.remarks) return transaction.remarks;
    return "N/A";
  };

  // Get type
  const getType = (transaction) => {
    if (transaction.pay_type === "liya") return "Liya";
    if (transaction.pay_type === "diya") return "Diya";
    if (transaction.type === "admin") return "Admin";
    if (transaction.type === "mirror_entry") return "Mirror Entry";
    return transaction.type || "Cash";
  };

  // Get amount
  const getAmount = (transaction) => {
    if (transaction.debit > 0) return -transaction.debit;
    if (transaction.credit > 0) return transaction.credit;
    return 0;
  };

  // Get D/C
  const getDC = (transaction) => {
    if (transaction.debit > 0) return "Debit";
    if (transaction.credit > 0) return "Credit";
    return "-";
  };

  // Calculate serial number safely
  const getSerialNumber = (index) => {
    const page = currentPage || 1;
    const perPage = itemsPerPage || 10;
    return (page - 1) * perPage + index + 1;
  };

  if (loading) {
    return (
      <div className="card-body text-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-3">
        <div className="text-danger mb-3">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() =>
            fetchSettlementReport(fromDate, toDate, searchTerm, currentPage)
          }
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
          <h3 className="sport card-title mb-0 d-flex align-items-center gap-2">
            Settlement Report
          </h3>
          {/* Summary */}
          <div className="d-flex gap-3">
            <span className="badge bg-success">Lena: {summary.lena.toFixed(2)}</span>
            <span className="badge bg-danger">Dena: {summary.dena.toFixed(2)}</span>
            <span className="badge bg-primary">Balance: {summary.balance.toFixed(2)}</span>
          </div>
        </div>

        <div className="card-body">
          {/* Date Filters */}
          <div className="mb-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ width: "150px" }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ width: "150px" }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />

              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: "250px" }}
                placeholder="Search by admin_id, event_id, remarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSearching}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </span>
                ) : (
                  <>
                    <FaSearch />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>NO</th>
                  <th>DESC</th>
                  <th>TYPE</th>
                  <th className="text-end">AMOUNT</th>
                  <th>D/C</th>
                  <th>NOTE</th>
                  <th>TIME/DATE</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => {
                    const amount = getAmount(transaction);
                    const isDebit = amount < 0;
                    const serialNo = getSerialNumber(index);

                    return (
                      <tr key={transaction._id || index}>
                        <td>{serialNo}</td>
                        <td>{getDescription(transaction)}</td>
                        <td>{getType(transaction)}</td>
                        <td className="text-end">
                          <span
                            className={isDebit ? "text-danger" : "text-success"}
                          >
                            {Math.abs(amount).toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={isDebit ? "text-danger" : "text-success"}
                          >
                            {getDC(transaction)}
                          </span>
                        </td>
                        <td>
                          {transaction.collection_name || transaction.remarks || "-"}
                        </td>
                        <td>{formatDateTime(transaction.created_at)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        {searchTerm
                          ? `No transactions found for "${searchTerm}"`
                          : "No transactions found"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <div className="paginationall d-flex align-items-center gap-1">
                <button disabled={currentPage === 1} onClick={handlePrev}>
                  <MdKeyboardDoubleArrowLeft /> Previous
                </button>

                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <div
                      key={page}
                      className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </div>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
                  Next <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettlementReport;