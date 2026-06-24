import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MdFilterListAlt, MdFilterAltOff } from "react-icons/md";
import { Table, Form, Spinner, Button, Modal } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Pagination } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_API_URL;
const LIMIT = 10;

function AssociatesBonusAchieverFormEntriesLists() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    customer_name: "",
    mobile: "",
    orderid: "",
  });

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}/uploads/bonus_registration/${imagePath}`;
  };

  const getAuthToken = () => localStorage.getItem("token");

  // ========== DOWNLOAD PDF FUNCTION ==========
  const downloadBima = async (id) => {
    if (!id) {
      alert("ID not found");
      return;
    }
    
    try {
      const token = getAuthToken();
      const url = `${API_URL}/bonus-download/${id}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `Bonus_Document_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error("Download error:", error);
      alert("PDF download nahi ho paaya");
    }
  };

  // ========== UPLOAD PDF FUNCTION ==========
  const uploadPDF = async (id, file) => {
    if (!file || file.type !== 'application/pdf') {
      alert("Sirf PDF file upload karein");
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const token = getAuthToken();
      const url = `${API_URL}/bonus-upload-pdf/${id}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      Swal.fire({
        title: "Success",
        text: "PDF uploaded successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error("Upload error:", error);
      alert("PDF upload nahi ho paaya");
    }
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

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const url = `${API_URL}/admin-bonus-reg-form-list?status=${searchTerm.status}&name=${searchTerm.customer_name}&mobile=${searchTerm.mobile}&orderid=${searchTerm.orderid}&page=${page}&limit=${LIMIT}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      
      let fetchedUsers = [];
      if (result.data && !Array.isArray(result.data)) {
        fetchedUsers = [result.data];
      } else if (Array.isArray(result.data)) {
        fetchedUsers = result.data;
      } else {
        fetchedUsers = [];
      }
      
      setAllUsers(fetchedUsers);
      setUsers(fetchedUsers);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  const toSentenceCase = (text) => {
    if (!text || typeof text !== 'string') return "-";
    if (text.trim() === "") return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
      case 0:
      case "0":
        return { backgroundColor: "#fff3cd", color: "#856404" };
      case "approved":
      case 1:
      case "1":
        return { backgroundColor: "#d4edda", color: "#155724" };
      case "rejected":
      case 2:
      case "2":
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      default:
        return { backgroundColor: "#e2e3e5", color: "#383d41" };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
      case "1":
      case "approved":
        return "Approved";
      case 2:
      case "2":
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const getPaginationGroup = () => {
    let pages = [];
    const totalPagesToShow = 7;
    const sidePages = 2;

    if (totalPages <= totalPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);

    pages.push(1);

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const displayUsers = users.length === 0 && !loading ? [] : users;

  return (
    <>
      <div className="card mt-3">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>Welcome Bonus Achiever Entry Form Lists</h3>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button
                type="button"
                className="toggle-filter-btn btn btn-primary"
                onClick={toggleFilter}
              >
                {showFilter ? <MdFilterAltOff /> : <MdFilterListAlt />}
              </button>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="card-body pb-0">
            <div className="d-flex flex-wrap-mobile align-items-md-center gap-2">
              <div className="form_design w-100">
                <input
                  type="number"
                  name="mobile"
                  placeholder="Mobile number"
                  value={searchTerm.mobile}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="button"
                className="submit_button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        )}

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3">Loading Welcome Bonus Lists...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table bordered style={{ minWidth: "1200px" }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: "5%" }}>#</th>
                      <th style={{ width: "8%" }}>User Name</th>
                      <th style={{ width: "8%" }}>Mobile</th>
                      <th style={{ width: "10%" }}>Email</th>
                      <th style={{ width: "8%" }}>DOB</th>
                      <th style={{ width: "6%" }}>Gender</th>
                      <th style={{ width: "8%" }}>PAN</th>
                      <th style={{ width: "8%" }}>Aadhar</th>
                      <th style={{ width: "12%" }}>Address</th>
                      <th style={{ width: "6%" }}>State</th>
                      <th style={{ width: "6%" }}>City</th>
                      <th style={{ width: "6%" }}>Pincode</th>
                      <th style={{ width: "8%" }}>Nominee</th>
                      <th style={{ width: "8%" }}>Relation</th>
                      <th style={{ width: "8%" }}>Nominee DOB</th>
                      <th style={{ width: "6%" }}>Status</th>
                      <th style={{ width: "10%" }}>Created At</th>
                      <th style={{ width: "12%" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayUsers.length === 0 ? (
                      <tr>
                        <td colSpan="18" className="text-center text-danger fw-bold py-4">
                          No data found!
                        </td>
                      </tr>
                    ) : (
                      displayUsers.map((user, index) => (
                        <tr key={user.id}>
                          <td>{(currentPage - 1) * LIMIT + index + 1}</td>
                          <td>{toSentenceCase(user.user_name)}</td>
                          <td>{user.user_mobile}</td>
                          <td>{user.email || "-"}</td>
                          <td>{formatDate(user.date_of_birth)}</td>
                          <td>{toSentenceCase(user.gender)}</td>
                          <td>{user.pan_number || "-"}</td>
                          <td>{user.aadhar_number || "-"}</td>
                          <td>
                            <div 
                              style={{ 
                                maxWidth: "600px", 
                                wordWrap: "break-word", 
                                lineHeight: "1.4"
                              }}
                              title={user.address || "-"}
                            >
                              {user.address ? (
                                <>
                                  {user.address.length > 60 ? (
                                    <>
                                      {user.address.substring(0, 60)}...
                                      <br />
                                      <small className="text-muted">
                                        {user.address.substring(60, 200)}
                                        {user.address.length > 120 && "..."}
                                      </small>
                                    </>
                                  ) : (
                                    user.address
                                  )}
                                </>
                              ) : "-"}
                            </div>
                          </td>
                          <td>{user.state_name || user.state || "-"}</td>
                          <td>{user.city_name || user.city || "-"}</td>
                          <td>{user.pincode || "-"}</td>
                          <td>{toSentenceCase(user.nominee_name)}</td>
                          <td>{toSentenceCase(user.nominee_relation)}</td>
                          <td>{formatDate(user.nominee_dob)}</td>
                          <td>
                            <span
                              className="badge"
                              style={getStatusStyle(user.status)}
                            >
                              {getStatusText(user.status)}
                            </span>
                           </td>
                           <td>{formatDateTime(user.created_at)}</td>
                           <td>
                            <div className="dropdown">
                              <button
                                className="btn light btn-action dropdown-toggle"
                                type="button"
                                id={`dropdownMenuButton-${user.id}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <BsThreeDots size={20} />
                              </button>
                              <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${user.id}`}>
                                <li className="dropdown-item">
                                  <button
                                    className="btn view_btn btn-sm w-100"
                                    onClick={() => handleViewUser(user)}
                                  >
                                    <FaEye /> View Details
                                  </button>
                                </li>
                                <li className="dropdown-item">
                                  <button
                                    className="btn btn-success btn-sm w-100"
                                    onClick={() => downloadBima(user.id)}
                                  >
                                    📥 Download PDF
                                  </button>
                                </li>
                                <li className="dropdown-item">
                                  <input
                                    type="file"
                                    accept="application/pdf"
                                    id={`upload-${user.id}`}
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) uploadPDF(user.id, file);
                                      e.target.value = null;
                                    }}
                                  />
                                  <button 
                                    className="btn btn-primary btn-sm w-100"
                                    onClick={() => document.getElementById(`upload-${user.id}`).click()}
                                  >
                                    📤 Upload PDF
                                  </button>
                                </li>
                              </ul>
                            </div>
                           </td>
                         </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>

              {displayUsers.length > 0 && (
                <div className="d-flex justify-content-end mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {getPaginationGroup().map((item, index) => (
                      <Pagination.Item
                        key={index}
                        active={item === currentPage}
                        onClick={() =>
                          typeof item === "number" ? handlePageChange(item) : null
                        }
                        disabled={item === "..."}
                        style={{ cursor: item === "..." ? "default" : "pointer" }}
                      >
                        {item}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details - {selectedUser?.user_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>PAN Card:</strong><br />
                {selectedUser.pan_image_url || selectedUser.pan_image ? (
                  <a href={selectedUser.pan_image_url || getImageUrl(selectedUser.pan_image)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selectedUser.pan_image_url || getImageUrl(selectedUser.pan_image)}
                      alt="PAN"
                      style={{ width: "100px", height: "auto" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Aadhar Front:</strong><br />
                {selectedUser.aadhar_front_image_url || selectedUser.aadhar_front_image ? (
                  <a href={selectedUser.aadhar_front_image_url || getImageUrl(selectedUser.aadhar_front_image)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selectedUser.aadhar_front_image_url || getImageUrl(selectedUser.aadhar_front_image)}
                      alt="Aadhar Front"
                      style={{ width: "100px", height: "auto" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Aadhar Back:</strong><br />
                {selectedUser.aadhar_back_image_url || selectedUser.aadhar_back_image ? (
                  <a href={selectedUser.aadhar_back_image_url || getImageUrl(selectedUser.aadhar_back_image)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selectedUser.aadhar_back_image_url || getImageUrl(selectedUser.aadhar_back_image)}
                      alt="Aadhar Back"
                      style={{ width: "100px", height: "auto" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div className="col-md-6 mb-3">
                <strong>User Name:</strong> {selectedUser.user_name}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Mobile:</strong> {selectedUser.user_mobile}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Email:</strong> {selectedUser.email || "-"}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Date of Birth:</strong> {formatDate(selectedUser.date_of_birth)}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Gender:</strong> {toSentenceCase(selectedUser.gender)}
              </div>
              <div className="col-md-6 mb-3">
                <strong>PAN Number:</strong> {selectedUser.pan_number || "-"}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Aadhar Number:</strong> {selectedUser.aadhar_number || "-"}
              </div>
              <div className="col-12 mb-3">
                <strong>Address:</strong> 
                <div className="mt-2 p-2 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
                  {selectedUser.address || "-"}
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <strong>State:</strong> {selectedUser.state_name || selectedUser.state || "-"}
              </div>
              <div className="col-md-4 mb-3">
                <strong>City:</strong> {selectedUser.city_name || selectedUser.city || "-"}
              </div>
              <div className="col-md-4 mb-3">
                <strong>Pincode:</strong> {selectedUser.pincode || "-"}
              </div>
              <div className="col-md-4 mb-3">
                <strong>Nominee Name:</strong> {toSentenceCase(selectedUser.nominee_name)}
              </div>
              <div className="col-md-4 mb-3">
                <strong>Nominee Relation:</strong> {toSentenceCase(selectedUser.nominee_relation)}
              </div>
              <div className="col-md-4 mb-3">
                <strong>Nominee DOB:</strong> {formatDate(selectedUser.nominee_dob)}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Status:</strong>{" "}
                <span className="badge" style={getStatusStyle(selectedUser.status)}>
                  {getStatusText(selectedUser.status)}
                </span>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Created At:</strong> {formatDateTime(selectedUser.created_at)}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Message Modal */}
      {showMessageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content border-top border-4 ${
                messageModalContent.type === "success"
                  ? "border-success"
                  : messageModalContent.type === "error"
                  ? "border-danger"
                  : "border-warning"
              }`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${
                    messageModalContent.type === "success"
                      ? "text-success"
                      : messageModalContent.type === "error"
                      ? "text-danger"
                      : "text-warning"
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
                    <Button variant="secondary" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                    <Button
                      variant={messageModalContent.type === "warning" ? "warning" : "primary"}
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
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

export default AssociatesBonusAchieverFormEntriesLists;