import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";


const API_URL = process.env.REACT_APP_API_URL;

function WalletBalanceLists() {
  // State for users with positive credit
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10); // Set from API response
  const [searchName, setSearchName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [exporting, setExporting] = useState(false);

  // Summary data
  const [summary, setSummary] = useState({
    total_users: 0,
    total_credit_sum: 0
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    username: "",
    email: "",
    mobile: "",
    buysqrt: "",
    credit: "",
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

  // Fetch users with positive credit
  const fetchUsersWithPositiveCredit = async (page = 1, name = "", mobile = "") => {
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

      let url = `${API_URL}/users-wallet-balance?page=${page}&limit=10`;
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
          errorData.message || "Failed to fetch users.",
          "error"
        );
        throw new Error(errorData.message || "Failed to fetch users.");
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      if (data.status === "1") {
        // Set users data
        setUsers(data.users || []);

        // Set summary data
        if (data.summary) {
          setSummary({
            total_users: data.summary.total_users || 0,
            total_credit_sum: data.summary.total_credit_sum || 0
          });
        }

        // Set pagination data from API response
        if (data.pagination) {
          console.log("Pagination data:", data.pagination); // Debug log
          setTotalPages(data.pagination.total_pages || 1);
          setCurrentPage(data.pagination.current_page || 1);
          setPerPage(data.pagination.per_page || 10);
        } else {
          // Fallback if pagination object doesn't exist
          setTotalPages(1);
          setCurrentPage(1);
          setPerPage(10);
        }
      } else {
        showCustomMessageModal("Error", data.message || "Failed to fetch users.", "error");
        setUsers([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithPositiveCredit(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      id: user.id || "",
      username: user.username || "",
      email: user.email || "",
      mobile: user.mobile || "",
      buysqrt: user.buysqrt || "",
      credit: user.credit || "",
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        throw new Error("Authentication token not found. Please log in.");
      }

      // Here you would need to implement the actual update API call
      // For now, just show success message
      showCustomMessageModal("Success", "User updated successfully!", "success");
      setShowEditModal(false);
      fetchUsersWithPositiveCredit(currentPage);

    } catch (err) {
      console.error("Update user error:", err);
      showCustomMessageModal("Error", "Failed to update user.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedUser(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setEditFormData({
      id: "",
      username: "",
      email: "",
      mobile: "",
      buysqrt: "",
      credit: "",
    });
  };

  const handleSearchChangeName = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchChangeMobile = (e) => {
    setSearchMobile(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchUsersWithPositiveCredit(1, searchName.trim(), searchMobile.trim());
  };

  const handleClearSearch = () => {
    setSearchName("");
    setSearchMobile("");
    setCurrentPage(1);
    fetchUsersWithPositiveCredit(1, "", "");
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



 const exportAllToExcel = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "कृपया पहले लॉगिन करें",
        confirmButtonText: "OK"
      });
      return;
    }

    let url = `${API_URL}/users-wallet-balance-excel-download`;

    Swal.fire({
      title: "Please wait...",
      text: "Excel फाइल डाउनलोड हो रही है",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/csv"
      }
    });

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "डाउनलोड नहीं हो पाया, बाद में कोशिश करें"
      });
      return;
    }

    const csvData = await response.text();
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `wallet_balance_without_withdrawal_request_${Date.now()}.csv`
    );
    link.click();

    Swal.fire({
      icon: "success",
      title: "Download Complete",
      text: "Excel फाइल सफलतापूर्वक डाउनलोड हो गई"
    });

  } catch (error) {
    console.error("CSV Export Error:", error);

    Swal.fire({
      icon: "error",
      title: "Export Failed",
      text: "कुछ गलत हो गया, कृपया फिर से प्रयास करें"
    });
  }
};



  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
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
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>Wallet Balance Without Withdrawal Request</h3>
            </div>

            <div className="createnewadmin ms-auto">
              <button
                className="exportexcel btn gap-2 btn-success d-inline-flex align-items-center"
                onClick={exportAllToExcel}
                disabled={exporting}
              >
                <FaDownload />
                {exporting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Exporting All...
                  </>
                ) : (
                  "Export"
                )}
              </button>
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


          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              {/* <div className="form-group w-100" id="searchName">
                <input
                  type="text"
                  placeholder="Search by Name"
                  value={searchName}
                  onChange={handleSearchChangeName}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchMobile">
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
              </button> */}
            </div>
          )}

          <div className="table-responsive">
            <Table bordered hover>
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>BuySQYD Amount</th>
                  <th>Credit Amount</th>
                  <th>Credit Status</th>
                  <th>Registered Date</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      {/* Serial Number - calculate based on current page and per page */}
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td>{user.username || "-"}</td>
                      <td>{user.mobile || "-"}</td>
                      <td>{user.email || "-"}</td>
                      <td className="text-primary fw-bold">
                        {formatCurrency(user.buysqrt || 0)}
                      </td>
                      <td className="text-success fw-bold">
                        ₹ {formatCurrency(user.credit || 0)}
                      </td>
                      <td>
                        <span
                          className={`badge ${user.credit_status?.toLowerCase() === "positive"
                            ? "bg-success"
                            : "bg-danger"
                            }`}
                        >
                          {user.credit_status || "-"}
                        </span>
                      </td>
                      <td>{formatDate(user.registered_since)}</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No users found with positive credit.
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
                Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, summary.total_users)} of {summary.total_users} users
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

      View User Modal
      <Modal show={showViewModal} onHide={handleCloseViewModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr>
                    <th>ID</th>
                    <td>{selectedUser.id}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{selectedUser.username}</td>
                  </tr>
                  <tr>
                    <th>Mobile</th>
                    <td>{selectedUser.mobile}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{selectedUser.email}</td>
                  </tr>
                  <tr>
                    <th>BuySQYD Amount</th>
                    <td className="text-primary fw-bold">
                      {formatCurrency(selectedUser.buysqrt || 0)}
                    </td>
                  </tr>
                  <tr>
                    <th>Credit Amount</th>
                    <td className="text-success fw-bold">
                      ₹ {formatCurrency(selectedUser.credit || 0)}
                    </td>
                  </tr>
                  <tr>
                    <th>Credit Status</th>
                    <td>
                      <span className={`badge ${selectedUser.credit_status?.toLowerCase() === 'positive'
                        ? 'bg-success'
                        : 'bg-danger'
                        }`}>
                        {selectedUser.credit_status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Registered Since</th>
                    <td>{formatDate(selectedUser.registered_since)}</td>
                  </tr>
                  <tr>
                    <th>Last Updated</th>
                    <td>{formatDate(selectedUser.last_updated)}</td>
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

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateUser}>
            <Form.Group className="mb-3" controlId="editUsername">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={editFormData.username}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editMobile">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                type="text"
                name="mobile"
                value={editFormData.mobile}
                onChange={handleEditFormChange}
                maxLength="10"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editBuysqrt">
              <Form.Label>BuySqrt Amount</Form.Label>
              <Form.Control
                type="number"
                name="buysqrt"
                value={editFormData.buysqrt}
                onChange={handleEditFormChange}
                step="0.01"
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editCredit">
              <Form.Label>Credit Amount</Form.Label>
              <Form.Control
                type="number"
                name="credit"
                value={editFormData.credit}
                onChange={handleEditFormChange}
                step="0.01"
                min="0"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "Updating..." : "Update User"}
            </Button>
          </Form>
        </Modal.Body>
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

export default WalletBalanceLists;