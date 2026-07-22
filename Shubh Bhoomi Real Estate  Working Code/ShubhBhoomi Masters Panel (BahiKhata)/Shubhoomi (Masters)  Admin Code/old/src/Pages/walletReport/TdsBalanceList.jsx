import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function SuccessfulWithdrawals() {
  // State for successful withdrawal requests
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");

  // Summary data
  const [summary, setSummary] = useState({
    total_requests: 0,
    total_amount: 0,
    total_tds: 0,
    total_net_payment: 0
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch successful withdrawal requests
  const fetchSuccessfulWithdrawals = async (page = 1, name = "", mobile = "") => {
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

      let url = `${API_URL}/users-success-balance?page=${page}&limit=10`;
      if (name) url += `&name=${name}`;
      if (mobile) url += `&mobile=${mobile}`;

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
          errorData.message || "Failed to fetch successful withdrawals.",
          "error"
        );
        throw new Error(errorData.message || "Failed to fetch successful withdrawals.");
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      if (data.success === "1") {
        // Set withdrawals data
        setWithdrawals(data.data || []);

        // Calculate summary from data
        const totalAmount = data.data.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const totalTds = data.data.reduce((sum, item) => sum + parseFloat(item.tds || 0), 0);
        const totalNetPayment = data.data.reduce((sum, item) => sum + parseFloat(item.net_payment || 0), 0);
        
        setSummary({
          total_requests: data.total || 0,
          total_amount: totalAmount,
          total_tds: totalTds,
          total_net_payment: totalNetPayment
        });

        // Set pagination data from API response
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
        setPerPage(10); // Assuming limit is 10
        
      } else {
        showCustomMessageModal("Error", data.message || "Failed to fetch successful withdrawals.", "error");
        setWithdrawals([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Fetch successful withdrawals error:", err);
      setWithdrawals([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuccessfulWithdrawals(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewWithdrawal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedWithdrawal(null);
  };

  const handleSearchChangeName = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchChangeMobile = (e) => {
    setSearchMobile(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchSuccessfulWithdrawals(1, searchName.trim(), searchMobile.trim());
  };

  const handleClearSearch = () => {
    setSearchName("");
    setSearchMobile("");
    setCurrentPage(1);
    fetchSuccessfulWithdrawals(1, "", "");
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'bg-success';
      case 'approved':
        return 'bg-info';
      case 'rejected':
        return 'bg-danger';
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
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

  return (
    <>
      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>TDS  Balance</h3>
            </div>
            <div className="d-md-block d-none">
              <div className="d-flex gap-2">
                <div className="createnewadmin">
                  <Link
                    to="/account-report"
                    className="btn btn-success d-inline-flex align-items-center"
                  >
                    <FaArrowLeft className="me-2" /> Back
                  </Link>
                </div>
                <button
                  className={`filter-toggle-btn btn ${isFilterActive ? "btn-secondary" : "btn-outline-secondary"
                    }`}
                  onClick={handleToggle}
                >
                  {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
                </button>
              </div>
            </div>

            <div className="d-block d-md-none">
              <div className="d-flex gap-2">
                <div className="createnewadmin">
                  <Link to="/account-report" className="btn btn-success d-inline-flex align-items-center">
                    <FaArrowLeft className="me-2" /> Back
                  </Link>
                </div>
                <button
                  className={`filter-toggle-btn btn ${isFilterActive ? "btn-secondary" : "btn-outline-secondary"
                    }`}
                  onClick={handleToggle}
                >
                  {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Summary Stats */}
          {/* <div className="row mb-4">
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h6 className="card-title">Total Successful Requests</h6>
                  <h4 className="mb-0">{summary.total_requests}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h6 className="card-title">Total Amount</h6>
                  <h4 className="mb-0">₹ {formatCurrency(summary.total_amount)}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-warning text-white">
                <div className="card-body text-center">
                  <h6 className="card-title">Total TDS Deducted</h6>
                  <h4 className="mb-0">₹ {formatCurrency(summary.total_tds)}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h6 className="card-title">Total Net Payment</h6>
                  <h4 className="mb-0">₹ {formatCurrency(summary.total_net_payment)}</h4>
                </div>
              </div>
            </div>
          </div> */}

          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
              <div className="form-group" style={{ flex: "1", minWidth: "200px" }}>
                <input
                  type="text"
                  placeholder="Search by Name"
                  value={searchName}
                  onChange={handleSearchChangeName}
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ flex: "1", minWidth: "200px" }}>
                <input
                  type="text"
                  placeholder="Search by Mobile"
                  value={searchMobile}
                  onChange={handleSearchChangeMobile}
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
            <Table bordered hover>
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Withdrawal ID</th>
                  <th>User Name</th>
                  <th>Mobile</th>
                  <th>Bank Details</th>
                  <th>Holder Name</th>
                  {/* <th>Request Amount</th> */}
                  <th>TDS</th>
                  {/* <th>Net Payment</th> */}
                  <th>Status</th>
                  <th>Completion Date</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.length > 0 ? (
                  withdrawals.map((withdrawal, index) => (
                    <tr key={withdrawal.id}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td className="fw-bold">{withdrawal.withdraw_id || "-"}</td>
                      <td>{withdrawal.username || "-"}</td>
                      <td>{withdrawal.mobile || "-"}</td>
                      <td>
                        <small className="d-block">
                          <strong>Bank:</strong> {withdrawal.bank_name || "-"}
                        </small>
                        <small className="d-block">
                          <strong>Account:</strong> {withdrawal.account_number || "-"}
                        </small>
                        <small className="d-block">
                          <strong>IFSC:</strong> {withdrawal.ifsc_code || "-"}
                        </small>
                      </td>
                      <td>{withdrawal.account_holder_name}</td>
                      {/* <td className="text-primary fw-bold">
                        ₹ {formatCurrency(withdrawal.amount || 0)}
                      </td> */}
                      <td className="text-danger">
                        ₹ {formatCurrency(withdrawal.tds || 0)}
                        <br />
                        <small>({withdrawal.tds_percent || "0.00"}%)</small>
                      </td>
                      {/* <td className="text-success fw-bold">
                        ₹ {formatCurrency(withdrawal.net_payment || 0)}
                      </td> */}
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(withdrawal.status)}`}
                        >
                          {withdrawal.status?.toUpperCase() || "-"}
                        </span>
                      </td>
                      <td>{formatDate(withdrawal.updated_at)}</td>
                      {/* <td>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleViewWithdrawal(withdrawal)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No successful withdrawal requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination - Show only if totalPages > 1 */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, summary.total_requests)} of {summary.total_requests} requests
              </div>
              <div>
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

                  {/* Generate page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={pageNum === currentPage}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  })}

                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Withdrawal Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Successful Withdrawal Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWithdrawal && (
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Withdrawal ID</th>
                    <td className="fw-bold">{selectedWithdrawal.withdraw_id}</td>
                  </tr>
                  <tr>
                    <th>User Name</th>
                    <td>{selectedWithdrawal.username}</td>
                  </tr>
                  <tr>
                    <th>User ID</th>
                    <td>{selectedWithdrawal.user_id}</td>
                  </tr>
                  <tr>
                    <th>Mobile</th>
                    <td>{selectedWithdrawal.mobile}</td>
                  </tr>
                  <tr>
                    <th>Account Holder</th>
                    <td>{selectedWithdrawal.account_holder_name}</td>
                  </tr>
                  <tr>
                    <th>Bank Name</th>
                    <td>{selectedWithdrawal.bank_name}</td>
                  </tr>
                  <tr>
                    <th>Account Number</th>
                    <td>{selectedWithdrawal.account_number}</td>
                  </tr>
                  <tr>
                    <th>IFSC Code</th>
                    <td>{selectedWithdrawal.ifsc_code}</td>
                  </tr>
                  <tr>
                    <th>Request Amount</th>
                    <td className="text-primary fw-bold">₹ {formatCurrency(selectedWithdrawal.amount)}</td>
                  </tr>
                  <tr>
                    <th>TDS ({selectedWithdrawal.tds_percent}%)</th>
                    <td className="text-danger">₹ {formatCurrency(selectedWithdrawal.tds)}</td>
                  </tr>
                  <tr>
                    <th>Amount After TDS</th>
                    <td>₹ {formatCurrency(selectedWithdrawal.amount_after_tds)}</td>
                  </tr>
                  <tr>
                    <th>Advance Payment</th>
                    <td>₹ {formatCurrency(selectedWithdrawal.advance_payment)}</td>
                  </tr>
                  <tr>
                    <th>Advance Payment Used</th>
                    <td>₹ {formatCurrency(selectedWithdrawal.advance_payment_used)}</td>
                  </tr>
                  <tr>
                    <th>Net Payment</th>
                    <td className="text-success fw-bold">₹ {formatCurrency(selectedWithdrawal.net_payment)}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(selectedWithdrawal.status)}`}>
                        {selectedWithdrawal.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Completed Date</th>
                    <td>{formatDate(selectedWithdrawal.updated_at)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Message Modal */}
      {showMessageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${messageModalContent.type === "success"
                  ? "border-success"
                  : "border-danger"
                }`}
            >
              <div className="modal-header">
                <h5
                  className={`modal-title ${messageModalContent.type === "success"
                      ? "text-success"
                      : "text-danger"
                    }`}
                >
                  {messageModalContent.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeCustomMessageModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer">
                {messageModalContent.confirmAction ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={closeCustomMessageModal}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={
                      messageModalContent.type === "success"
                        ? "success"
                        : "danger"
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

export default SuccessfulWithdrawals;