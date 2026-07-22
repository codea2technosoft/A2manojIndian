import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Modal, Button, Table, Pagination } from "react-bootstrap";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function TdsCRList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");

  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settleTransaction, setSettleTransaction] = useState(null);

  const [department, setDepartment] = useState("");
  const [remark, setRemark] = useState("");

  const [summary, setSummary] = useState({
    total_requests: 0,
    total_amount: 0,
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
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

  const fetchTdsCRList = async (page = 1, name = "", mobile = "") => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
        throw new Error("Authentication token not found. Please log in.");
      }

      let url = `${API_URL}/tds-cr-list?page=${page}&limit=10`;
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
            "error",
          );
          throw new Error("Unauthorized: Please log in again.");
        }
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch TDS CR list.",
          "error",
        );
        throw new Error(errorData.message || "Failed to fetch TDS CR list.");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "1") {
        setTransactions(data.data || []);
        const totalAmount = data.data.reduce(
          (sum, item) => sum + parseFloat(item.amount || 0),
          0,
        );

        setSummary({
          total_requests: data.total || 0,
          total_amount: totalAmount,
        });

        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.page || 1);
        setPerPage(10);
      } else {
        showCustomMessageModal(
          "Error",
          data.message || "Failed to fetch TDS CR list.",
          "error",
        );
        setTransactions([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Fetch TDS CR list error:", err);
      setTransactions([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTdsCRList(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedTransaction(null);
  };

  const handleSearchChangeName = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchChangeMobile = (e) => {
    setSearchMobile(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchTdsCRList(1, searchName.trim(), searchMobile.trim());
  };

  const handleClearSearch = () => {
    setSearchName("");
    setSearchMobile("");
    setCurrentPage(1);
    fetchTdsCRList(1, "", "");
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleConfirmSettlement = async () => {
    if (!department) {
      showCustomMessageModal(
        "Validation Error",
        "Please select department",
        "error",
      );
      return;
    }

    try {
      const token = getAuthToken();

      const response = await fetch(`${API_URL}/settlement-cr-tds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expense_id: settleTransaction.id,
          remark: remark,
          settled_by: department,
        }),
      });

      const data = await response.json();

      if (data.status === "1") {
        showCustomMessageModal(
          "Success",
          "TDS CR Settled Successfully",
          "success",
        );

        // ✅ Refresh List after settlement
        fetchTdsCRList(currentPage);

        handleCloseSettleModal();
      } else {
        showCustomMessageModal(
          "Error",
          data.message || "Settlement Failed",
          "error",
        );
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
              <h3>TDS CR Report</h3>
            </div>
            <div className="d-block">
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
                  className={`filter-toggle-btn btn btn-primary ${
                    isFilterActive ? "active" : ""
                  }`}
                  onClick={handleToggle}
                >
                  {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isFilterActive && (
          <div className="card-body pb-0">
            <div className="d-flex gap-2 mb-3 flex-wrap">
              <div
                className="form-group"
                style={{ flex: "1", minWidth: "200px" }}
              >
                <input
                  type="text"
                  placeholder="Search by Name"
                  value={searchName}
                  onChange={handleSearchChangeName}
                  className="form-control"
                />
              </div>

              <div
                className="form-group"
                style={{ flex: "1", minWidth: "200px" }}
              >
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
          </div>
        )}

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total Transactions</h6>
                  <h4 className="card-text">{summary.total_requests}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title text-muted">Total Amount</h6>
                  <h4 className="card-text text-success">
                    ₹ {formatCurrency(summary.total_amount)}
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
                  <th>Project Name</th>
                  <th>Unit/Shop No</th>
                  <th>Category</th>
                  <th>Amount (₹)</th>
                  <th>Date</th>
                  <th>Payee</th>
                  <th>Settled To</th>
                  <th>Expense Name</th>
                  <th>Expense Mobile</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={transaction.id}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td className="fw-bold">
                        {transaction.project_name || "-"}
                      </td>
                      <td>{transaction.plot_shop_villa_no || "-"}</td>
                      <td>
                        <span className="badge bg-success">
                          {transaction.category_name}
                        </span>
                      </td>
                      <td className="text-primary fw-bold">
                        ₹ {formatCurrency(transaction.amount || 0)}
                      </td>
                      <td>{formatDate(transaction.date)}</td>
                      <td>{transaction.payee || "-"}</td>
                      <td>{transaction.settled_by || "-"}</td>
                      <td>{transaction.expense_name || "-"}</td>
                      <td>{transaction.associate_mobile || "-"}</td>
                      <td>
                        <small>{transaction.description || "-"}</small>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            View
                          </button>

                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleOpenSettleModal(transaction)}
                          >
                            Settle
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No TDS CR transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="text-muted">
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, summary.total_requests)} of{" "}
                {summary.total_requests} transactions
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

      <Modal
        show={showViewModal}
        onHide={handleCloseViewModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>TDS CR Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Transaction ID</th>
                    <td className="fw-bold">{selectedTransaction.id}</td>
                  </tr>
                  <tr>
                    <th>Project Name</th>
                    <td>{selectedTransaction.project_name}</td>
                  </tr>
                  <tr>
                    <th>Project ID</th>
                    <td>{selectedTransaction.project_id}</td>
                  </tr>
                  <tr>
                    <th>Unit/Shop No</th>
                    <td>{selectedTransaction.plot_shop_villa_no}</td>
                  </tr>
                  <tr>
                    <th>Unit ID</th>
                    <td>{selectedTransaction.plot_id}</td>
                  </tr>
                  <tr>
                    <th>Category Name</th>
                    <td>
                      <span className="badge bg-success">
                        {selectedTransaction.category_name}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Category Type</th>
                    <td className="text-uppercase">
                      {selectedTransaction.category_type}
                    </td>
                  </tr>
                  <tr>
                    <th>Amount</th>
                    <td className="text-primary fw-bold">
                      ₹ {formatCurrency(selectedTransaction.amount)}
                    </td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td>{formatDate(selectedTransaction.date)}</td>
                  </tr>
                  <tr>
                    <th>Payee</th>
                    <td>{selectedTransaction.payee}</td>
                  </tr>
                  <tr>
                    <th>Expense Name</th>
                    <td>{selectedTransaction.expense_name}</td>
                  </tr>
                  <tr>
                    <th>Associate Mobile</th>
                    <td>{selectedTransaction.associate_mobile || "-"}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>{selectedTransaction.description}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseViewModal}>
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
              className={`modal-content ${
                messageModalContent.type === "success"
                  ? "border-success"
                  : "border-danger"
              }`}
            >
              <div className="modal-header">
                <h5
                  className={`modal-title ${
                    messageModalContent.type === "success"
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
          <Modal.Title>Settle TDS CR Transaction</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {settleTransaction && (
            <>
              <p>
                <b>Transaction:</b> #{settleTransaction.id}
              </p>
              <p>
                <b>Amount:</b> ₹ {formatCurrency(settleTransaction.amount)}
              </p>

              <div className="form-group mb-3">
                <label>Select Department</label>
                <select
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">-- Select Department --</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Management">Management</option>
                  <option value="Admin">Admin</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

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
          <Button variant="danger" onClick={handleCloseSettleModal}>
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

export default TdsCRList;
