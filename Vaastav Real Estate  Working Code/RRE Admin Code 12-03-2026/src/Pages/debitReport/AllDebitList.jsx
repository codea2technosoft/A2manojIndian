import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Table, Pagination, Button } from "react-bootstrap";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function AllDebit() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchType, setSearchType] = useState(""); // cr or dr
  const [searchDate, setSearchDate] = useState("");
  const searchTimeoutRef = useRef(null);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });
  const [isFilterActive, setIsFilterActive] = useState(false);
  
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
    });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchTransactions = async (page = 1, type = "", date = "") => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        throw new Error("Authentication token not found. Please log in.");
      }

      let url = `${API_URL}/total-debit-details?page=${page}&limit=10`;
      if (type) url += `&category_type=${type}`;
      if (date) url += `&date=${date}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          showCustomMessageModal(
            "Authorization Error",
            "Unauthorized: Please log in again.",
            "error"
          );
          throw new Error("Unauthorized: Please log in again.");
        }
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch transactions.",
          "error"
        );
        throw new Error(errorData.message || "Failed to fetch transactions.");
      }
      const data = await response.json();
      setTransactions(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalRecords(data.total || 0);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Fetch transactions error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearchDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchTransactions(1, searchType.trim(), searchDate.trim());
  };

  const handleClearSearch = () => {
    setSearchType("");
    setSearchDate("");
    setCurrentPage(1);
    fetchTransactions(1, "", "");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Get badge for category_type
  const getCategoryTypeBadge = (categoryType) => {
    switch(categoryType) {
      case 'cr':
        return { text: 'Credit', className: 'bg-success' };
      case 'dr':
        return { text: 'Debit', className: 'bg-danger' };
      default:
        return { text: categoryType || '-', className: 'bg-secondary' };
    }
  };

  // Get badge for type (cash)
  const getTypeBadge = (type) => {
    switch(type) {
      case 'cash':
        return { text: 'Cash', className: 'bg-info' };
      case 'online':
        return { text: 'Online', className: 'bg-primary' };
      default:
        return { text: type || '-', className: 'bg-secondary' };
    }
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    return transactions.reduce((total, transaction) => {
      return total + parseFloat(transaction.amount || 0);
    }, 0);
  };

  // Calculate net balance (credit - debit)
  const calculateNetBalance = () => {
    let creditTotal = 0;
    let debitTotal = 0;
    
    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount || 0);
      if (transaction.category_type === 'cr') {
        creditTotal += amount;
      } else if (transaction.category_type === 'dr') {
        debitTotal += amount;
      }
    });
    
    return { creditTotal, debitTotal, netBalance: creditTotal - debitTotal };
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const netBalance = calculateNetBalance();

  return (
    <>
      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3> Total Debit List Details </h3>
              
            </div>
            <div className="d-md-block d-none">
              <div className="d-flex gap-2">
                {/* <div className="form-group" id="searchType">
                  <select
                    className="form-control"
                    value={searchType}
                    onChange={handleSearchTypeChange}
                  >
                    <option value="">All Types</option>
                    <option value="cr">Credit</option>
                    <option value="dr">Debit</option>
                  </select>
                </div>

                <div className="form-group" id="searchDate">
                  <input
                    type="date"
                    value={searchDate}
                    onChange={handleSearchDateChange}
                    className="form-control"
                  />
                </div>

                <button className="btn btn-primary" onClick={handleSearchClick}>
                  Search
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={handleClearSearch}
                >
                  Clear
                </button> */}

                <div className="createnewadmin">
                  <Link
                    to="/account-report"
                    className="btn btn-success d-inline-flex align-items-center"
                  >
                    <FaArrowLeft className="me-2" /> Back
                  </Link>
                </div>
              </div>
            </div>
            <div className="d-block d-md-none">
              <div className="d-flex gap-2">
                <button
                  className={`filter-toggle-btn ${
                    isFilterActive ? "active" : ""
                  }`}
                  onClick={handleToggle}
                >
                  {isFilterActive ? (
                    <>
                      <MdFilterAltOff />
                    </>
                  ) : (
                    <>
                      <MdFilterAlt />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              <div className="form-group w-100" id="searchType">
                <select
                  className="form-control"
                  value={searchType}
                  onChange={handleSearchTypeChange}
                >
                  <option value="">All Types</option>
                  <option value="cr">Credit</option>
                  <option value="dr">Debit</option>
                </select>
              </div>

              <div className="form-group w-100" id="searchDate">
                <input
                  type="date"
                  value={searchDate}
                  onChange={handleSearchDateChange}
                  className="form-control"
                />
              </div>

              <button className="btn btn-primary" onClick={handleSearchClick}>
                Search
              </button>

              <button className="btn btn-secondary" onClick={handleClearSearch}>
                Clear
              </button>
            </div>
          )}
          <div className="table-responsive">
            <Table bordered>
              <thead className="bg-primary text-white">
                <tr>
                  <th>ID</th>
                  <th>Transaction Type</th>
                  <th>Payment Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Payee</th>
                  <th>Description</th>
                  <th>Project</th>
                  <th>Plot</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction, i) => {
                    const categoryTypeBadge = getCategoryTypeBadge(transaction.category_type);
                    const typeBadge = getTypeBadge(transaction.type);
                    
                    return (
                      <tr key={transaction.id}>
                        <td>{(currentPage - 1) * 10 + i + 1}</td>
                        <td>
                          <span className={`badge ${categoryTypeBadge.className}`}>
                            {categoryTypeBadge.text}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${typeBadge.className}`}>
                            {typeBadge.text}
                          </span>
                        </td>
                        <td>{transaction.category_name || "-"}</td>
                        <td>
                          <span className={transaction.category_type === 'cr' ? 'text-success' : 'text-danger'}>
                            ₹{parseFloat(transaction.amount || 0).toLocaleString()}
                          </span>
                        </td>
                        <td>{transaction.payee || "-"}</td>
                        <td>{transaction.description || "-"}</td>
                        <td>{transaction.project_name || "-"}</td>
                        <td>{transaction.plot_name || "-"}</td>
                        <td>{formatDate(transaction.date)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No cash transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />

              <Pagination.Item
                active={1 === currentPage}
                onClick={() => handlePageChange(1)}
              >
                1
              </Pagination.Item>

              {currentPage > 3 && <Pagination.Ellipsis />}

              {currentPage > 2 && (
                <Pagination.Item
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  {currentPage - 1}
                </Pagination.Item>
              )}

              {currentPage !== 1 && currentPage !== totalPages && (
                <Pagination.Item active>{currentPage}</Pagination.Item>
              )}

              {currentPage < totalPages - 1 && (
                <Pagination.Item
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {currentPage + 1}
                </Pagination.Item>
              )}

              {currentPage < totalPages - 2 && <Pagination.Ellipsis />}

              {totalPages > 1 && (
                <Pagination.Item
                  active={totalPages === currentPage}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Pagination.Item>
              )}

              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div
          className="modal d-block modalshowparentdesign"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${
                messageModalContent.type === "success"
                  ? ""
                  : messageModalContent.type === "error"
                  ? ""
                  : ""
              }`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${
                    messageModalContent.type === "success"
                      ? ""
                      : messageModalContent.type === "error"
                      ? ""
                      : ""
                  }`}
                >
                  {messageModalContent.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeCustomMessageModal}
                ></button>
              </div>
              <div className="modal-body text-secondary">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {messageModalContent.confirmAction ? (
                  <>
                    <Button
                      variant={
                        messageModalContent.type === "btn-primary-custum"
                          ? "btn-primary-custum"
                          : "primary"
                      }
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
                    </Button>
                    <Button variant="danger" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={
                      messageModalContent.type === "success"
                        ? "success"
                        : messageModalContent.type === "error"
                        ? "danger"
                        : "primary"
                    }
                    onClick={closeCustomMessageModal}
                  >
                    OK
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AllDebit;