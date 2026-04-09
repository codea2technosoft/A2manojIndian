import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { CaseTransactionReport } from "../../Server/api";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

function CasetransactionReport() {
  const navigate = useNavigate();
   const admin_id = localStorage.getItem("admin_id");
  const [ledgerData, setLedgerData] = useState([]);
  const [summary, setSummary] = useState({
    debit: 0,
    credit: 0,
    balance: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [showFilter, setShowFilter] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchTransactionList(1, "", "", "");
  }, []);

  const fetchTransactionList = async (page = 1, search = "", from = "", to = "") => {
    try {

      setIsSearching(true);
      const payload = {
        admin_id,
        from_date: from !== undefined ? from : fromDate,
        to_date: to !== undefined ? to : toDate,
        search: search !== undefined ? search : searchTerm,
      };

      const response = await CaseTransactionReport(payload);

      if (response.data?.success) {
        const result = response.data;
        setLedgerData(result.data || []);
        setSummary({
          credit: result.summary.total_credit,
          debit: result.summary.total_debit,
          balance: result.summary.total_amount,
        });
        setCurrentPage(result.pagination.page);
        setItemsPerPage(result.pagination.limit);
        setTotalItems(result.pagination.total);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message,
      });
    } finally {
      setIsSearching(false);
    }
  };

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
  // useEffect(() => {
  //   if (!fromDate && !toDate && !searchInput) {
  //     fetchTransactionList(1, "", "", "");
  //   }
  // }, [fromDate, toDate, searchInput]);

  const handleRefresh = () => {
    setFromDate("");
    setToDate("");
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);

    // pass empty filter forcefully
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
          <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">All case transaction List</h3>
            <div>
              <button className="refeshbutton" onClick={() => setShowFilter(!showFilter)}> {showFilter ? "Hide Filter" : "Show Filter"}</button>
            </div>
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
                      placeholder="Enter username..."
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
                    {(fromDate || toDate) && (
                      <button
                        className="refreshbutton"
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


            {/* ACTIVE FILTERS DISPLAY */}
            {/* {(fromDate || toDate || searchTerm) && (
              <div className="mb-3 d-flex align-items-center gap-2">
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
                    User: {searchTerm}
                  </span>
                )}
              </div>
            )} */}

            {/* SUMMARY */}
            <div className="alert alert-info d-flex justify-content-between">
              <span><strong>Total Credit:</strong> ₹{summary.credit}</span>
              <span><strong>Total Debit:</strong> ₹{summary.debit}</span>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>DATE & TIME</th>
                    <th>USER NAME</th>
                    <th>CREDIT</th>
                    <th>DEBIT</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerData.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <span className="text-muted">No Data Found</span>
                      </td>
                    </tr>
                  ) : (
                    ledgerData.map((transaction, index) => {
                      const debit = Number(transaction.credit) || 0;
                      const credit = Number(transaction.debit) || 0;
                      return (
                        <tr key={index}>
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
                          <td>
                            {/* <span>{transaction.user_name || "-"}</span> */}
                               <span>{transaction.admin_id}</span> 
                          </td>
                          <td className="text-success fw-bold">
                            {credit > 0 ? `₹${credit.toFixed(2)}` : "-"}
                          </td>
                          <td className="text-danger fw-bold">
                            {debit > 0 ? `₹${debit.toFixed(2)}` : "-"}
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
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
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