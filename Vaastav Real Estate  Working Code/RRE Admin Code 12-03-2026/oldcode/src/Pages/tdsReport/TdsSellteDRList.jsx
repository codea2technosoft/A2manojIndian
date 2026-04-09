import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Modal, Button, Table, Pagination } from "react-bootstrap";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function TdsSellteDRList() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchWithdrawId, setSearchWithdrawId] = useState("");
  const [searchUserId, setSearchUserId] = useState("");

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

  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settleTransaction, setSettleTransaction] = useState(null);

  const [department, setDepartment] = useState("");
  const [remark, setRemark] = useState("");

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

  const fetchTdsDRList = async (page = 1, withdrawId = "", userId = "") => {
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

      let url = `${API_URL}/dr-settlement-report?page=${page}&limit=10`;
      if (withdrawId) url += `&withdraw_id=${withdrawId}`;
      if (userId) url += `&user_id=${userId}`;

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
          errorData.message || "Failed to fetch TDS DR list.",
          "error"
        );
        throw new Error(errorData.message || "Failed to fetch TDS DR list.");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "1") {
        setWithdrawals(data.data || []);


        setSummary({
          total_requests: data.total || 0,
          total_amount: data.total_tds_amount || 0,
          total_tds: 0,
          total_net_payment: 0
        });

        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
        setPerPage(10);
      } else {
        showCustomMessageModal("Error", data.message || "Failed to fetch TDS DR list.", "error");
        setWithdrawals([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Fetch TDS DR list error:", err);
      setWithdrawals([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTdsDRList(currentPage);
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

  const handleSearchChangeWithdrawId = (e) => {
    setSearchWithdrawId(e.target.value);
  };

  const handleSearchChangeUserId = (e) => {
    setSearchUserId(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchTdsDRList(1, searchWithdrawId.trim(), searchUserId.trim());
  };

  const handleClearSearch = () => {
    setSearchWithdrawId("");
    setSearchUserId("");
    setCurrentPage(1);
    fetchTdsDRList(1, "", "");
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

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

  const handleConfirmSettlement = async () => {
    if (!department) {
      showCustomMessageModal("Validation Error", "Please select department", "error");
      return;
    }

    if (!settleTransaction || !settleTransaction.withdraw_id) {
      showCustomMessageModal("Validation Error", "Withdrawal ID not found", "error");
      return;
    }

    try {
      const token = getAuthToken();

      const response = await fetch(`${API_URL}/settlement-dr-tds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          withdraw_id: settleTransaction.withdraw_id,
          remark: remark,
          department: department,
        }),
      });

      const data = await response.json();

      if (data.status === "1") {
        showCustomMessageModal("Success", "TDS DR Settled Successfully", "success");

        fetchTdsDRList(currentPage);

        handleCloseSettleModal();
      } else {
        showCustomMessageModal("Error", data.message || "Settlement Failed", "error");
      }
    } catch (error) {
      console.error("Settlement Error:", error);
      showCustomMessageModal("Error", "Something went wrong", "error");
    }
  };

  const handleOpenSettleModal = (transaction) => {
    setSettleTransaction(transaction);
    setDepartment("");
    setRemark("");
    setShowSettleModal(true);
  };

  const handleCloseSettleModal = () => {
    setShowSettleModal(false);
    setSettleTransaction(null);
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
              <h3>TDS DR Report</h3>
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
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
              <div className="form-group" style={{ flex: "1", minWidth: "200px" }}>
                <input
                  type="text"
                  placeholder="Search by Withdrawal ID"
                  value={searchWithdrawId}
                  onChange={handleSearchChangeWithdrawId}
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ flex: "1", minWidth: "200px" }}>
                <input
                  type="text"
                  placeholder="Search by User ID"
                  value={searchUserId}
                  onChange={handleSearchChangeUserId}
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


          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total Withdrawals Count</h6>
                  <h4 className="card-text">{summary.total_requests}</h4>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total TDS Amount</h6>
                  <h4 className="card-text">₹ {formatCurrency(summary.total_amount)}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total Withdrawal Amount</h6>
                  <h4 className="card-text">
                    ₹ {formatCurrency(
                      withdrawals.reduce((sum, item) => sum + parseFloat(item.withdrawal_amount || 0), 0)
                    )}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <Table bordered hover>
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Withdrawal ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>TDS Amount</th>
                  <th>TDS %</th>
                  <th>Amount After TDS</th>
                  <th>Net Payment</th>
                  <th>Remark</th>
                  <th>Settled To</th>
                  <th>Settled Date</th>
                  <th>Withdrawal Amount</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.length > 0 ? (
                  withdrawals.map((withdrawal, index) => (
                    <tr key={withdrawal.withdraw_id}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td className="fw-bold">{withdrawal.withdraw_id || "-"}</td>
                      <td>{withdrawal.username || "-"}</td>
                      <td>{withdrawal.mobile || "-"}</td>
                      <td className="text-primary fw-bold">
                        ₹ {formatCurrency(withdrawal.tds_amount || 0)}
                      </td>
                      <td>{withdrawal.tds_percent || "0"}%</td>
                      <td>₹ {formatCurrency(withdrawal.amount_after_tds || 0)}</td>
                      <td>₹ {formatCurrency(withdrawal.net_payment || 0)}</td>
                      <td>{withdrawal.remark || "-"}</td>
                      <td>{withdrawal.settled_by || "-"}</td>
                      <td>{withdrawal.settled_date || "-"}</td>
                      <td>₹ {formatCurrency(withdrawal.withdrawal_amount || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No TDS DR transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, summary.total_requests)} of {summary.total_requests} withdrawals
              </div>
              <div>
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />

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
          <Modal.Title>Withdrawal Details</Modal.Title>
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
                    <th>User ID</th>
                    <td>{selectedWithdrawal.user_id}</td>
                  </tr>
                  <tr>
                    <th>Account Holder Name</th>
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
                    <th>Request Date</th>
                    <td>{formatDate(selectedWithdrawal.created_at)}</td>
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

      <Modal show={showSettleModal} onHide={handleCloseSettleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Settle TDS DR Transaction</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {settleTransaction && (
            <>
              <p>
                <b>Transaction ID:</b> #{settleTransaction.withdraw_id}
              </p>
              <p>
                <b>User:</b> {settleTransaction.username} ({settleTransaction.user_id})
              </p>
              <p>
                <b>Amount:</b> ₹ {formatCurrency(settleTransaction.amount)}
              </p>
              <p>
                <b>TDS:</b> ₹ {formatCurrency(settleTransaction.tds)}
              </p>
              <p>
                <b>Net Payable:</b> ₹ {formatCurrency(settleTransaction.net_payment)}
              </p>

              {/* Department Dropdown */}
              <div className="form-group mb-3">
                <label>Select Department *</label>
                <select
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">-- Select Department --</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Management">Management</option>
                  <option value="Admin">Admin</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              {/* Remark Box */}
              <div className="form-group mb-3">
                <label>Remark</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter settlement remark..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                ></textarea>
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSettleModal}>
            Cancel
          </Button>

          <Button variant="success" onClick={handleConfirmSettlement}>
            Confirm Settlement
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TdsSellteDRList;