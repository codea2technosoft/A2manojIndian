import React, { useState, useEffect } from "react";
import { getSettlementReporttAll } from "../../Server/api";
import Toast from "../../User/Toast";
import { FaSearch } from "react-icons/fa";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
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
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setFromDate(formatDateInput(sevenDaysAgo));
    setToDate(formatDateInput(today));
  }, []);

  const fetchSettlementReport = async (from = "", to = "", search = "", page = 1) => {
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
        limit: itemsPerPage
      };

      const response = await getSettlementReporttAll(payload);
      console.log("API Response:", response);

      if (response.data && response.data.success === true) {
        // Set summary
        setSummary({
          lena: response.data.lena || 0,
          dena: response.data.dena || 0,
          balance: response.data.balance || 0
        });

        // Set transactions
        const allTransactions = response.data.data?.data || [];
        setTransactions(allTransactions);
        setTotalItems(response.data.data?.total || 0);
        setTotalPages(Math.ceil((response.data.data?.total || 0) / itemsPerPage));
        setCurrentPage(response.data.current_page || 1);
        setError("");
      } else {
        const errorMsg = response.data?.error?.message || "Failed to fetch settlement report";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      console.error("Error fetching settlement report:", err);
      const errorMsg = err.response?.data?.error?.message || err.message || "Failed to fetch settlement report";
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
    if (e.key === 'Enter') {
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
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Format date for display (DD-MM-YYYY)
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Format date time
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return dateTime;
    }
  };

  // Get description
  const getDescription = (transaction) => {
    if (transaction.comment) return transaction.comment;
    if (transaction.remarks) return transaction.remarks;
    if (transaction.send_to_admin_id) return `To: ${transaction.send_to_admin_id}`;
    return "N/A";
  };

  // Get type
  const getType = (transaction) => {
    if (transaction.pay_type === "liya") return "Liya";
    if (transaction.pay_type === "dena") return "Dena";
    if (transaction.type) return transaction.type;
    return "Cash";
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

  if (loading) {
    return (
      <div className="text-center mt-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading settlement report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-3">
        <div className="text-danger mb-3">
          <p><strong>Error:</strong> {error}</p>
        </div>
        <button className="btn btn-primary" onClick={() => fetchSettlementReport(fromDate, toDate, searchTerm, currentPage)}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Settlement Report</h4>
        </div>

        <div className="card-body">
          {/* Date Filters */}
          <div className="mb-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ width: '150px' }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ width: '150px' }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          {/* Search - Server Side */}
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: '250px' }}
                placeholder="Search..."
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
                  <span className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                ) : (
                  <><FaSearch /> Search</>
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
                    const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                    
                    return (
                      <tr key={transaction._id || index}>
                        <td>{serialNo}</td>
                        <td>{getDescription(transaction)}</td>
                        <td>{getType(transaction)}</td>
                        <td className="text-end">
                          <span className={isDebit ? "text-danger" : "text-success"}>
                            {Math.abs(amount).toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span className={isDebit ? "text-danger" : "text-success"}>
                            {getDC(transaction)}
                          </span>
                        </td>
                        <td>{transaction.collection_name || "-"}</td>
                        <td>{formatDateTime(transaction.created_at)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        {searchTerm ? `No transactions found for "${searchTerm}"` : "No transactions found"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              <div className="text-muted">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  « Previous
                </button>
                <span className="fw-bold">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .card-header {
          background-color: #007bff !important;
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #ced4da;
        }
        .form-control-sm {
          font-size: 0.875rem;
        }
        .badge {
          font-size: 0.9rem;
        }
        @media (max-width: 576px) {
          .d-flex.align-items-center.gap-2 {
            flex-direction: column;
            align-items: stretch !important;
          }
          .form-control {
            width: 100% !important;
          }
          .d-flex.justify-content-between {
            flex-direction: column;
            align-items: center !important;
            gap: 10px;
          }
          .d-flex.gap-4 {
            gap: 8px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default SettlementReport;