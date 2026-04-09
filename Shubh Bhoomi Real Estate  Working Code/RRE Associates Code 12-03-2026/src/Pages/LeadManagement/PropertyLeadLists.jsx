import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MdFilterListAlt, MdFilterAltOff } from "react-icons/md";
import { Table, Form, Spinner, Button, Modal } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Pagination } from "react-bootstrap";
const API_URL = process.env.REACT_APP_API_URL;
const LIMIT = 1;
function PropertyLeadLists() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingResponce, setLoadingResponce] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showResponceModal, setShowResponceModal] = useState(false);
  const [documentFile, setDocumentFile] = useState([]);
  const [userName, setUserName] = useState("");
  const [leadOrderID, setleadOrderID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [UserType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
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

  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const [searchTerm, setSearchTerm] = useState({
    customer_name: "",
    mobile: "",
    status: "",
    orderid: "",
  });
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("token");
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    console.warn(searchTerm.level);
    try {
      const token = getAuthToken();
      let formattedDate = "";

      if (searchTerm.date !== "") {
        formattedDate = formatDate(searchTerm.date);
      }
      const url = `${API_URL}/property-lead-list?status=${searchTerm.status}&name=${searchTerm.customer_name}&mobile=${searchTerm.mobile}&orderid=${searchTerm.orderid}&page=${page}&limit=${LIMIT}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      const fetchedUsers = result.data || [];
      setAllUsers(fetchedUsers);
      setUsers(fetchedUsers);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    fetchUsers();
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
    if (!text) return "-";
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
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleCreateClick = () => {
    navigate("/create-property-lead");
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "documentPending":
        return { backgroundColor: "#fff3cd", color: "#856404" }; // yellow
      case "loanInprocess":
        return { backgroundColor: "#cce5ff", color: "#004085" }; // blue
      case "approved":
        return { backgroundColor: "#d4edda", color: "#155724" }; // green
      case "notInterested":
        return { backgroundColor: "#f8d7da", color: "#721c24" }; // red
      default:
        return { backgroundColor: "#e2e3e5", color: "#383d41" }; // grey
    }
  };

  const handleResponseLead = async (id, order_id) => {
    setLoadingResponce(true);
    try {
      setLeadId(id);
      setleadOrderID(order_id);
      setShowResponceModal(true);
    } catch (err) {
      showCustomMessageModal(
        "Error",
        "An unexpected error occurred while fetching lead details for edit.",
        "error",
      );
    } finally {
      setLoadingResponce(false);
    }
  };

  ////socket
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    //const ws = new WebSocket("wss://realestatesocket.a2logicgroup.com");
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);
    ws.onopen = () => {
      console.log("✅ WebSocket connection established");
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Message from server:", data);
      } catch (e) {
        console.log("📩 Raw message:", event.data);
      }
    };
    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };
    setSocket(ws);

    return () => ws.close();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserId(data.data.id); // ✅ store userId
          setUserName(data.data.username); // ✅ store name
          setUserType(data.data.user_type); // ✅ store name
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
  useEffect(() => {
    if (userId) {
    }
  }, [userId, userName]);

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    setLoadingResponce(true);
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("lead_id", leadId);
      formData.append("order_id", leadOrderID);
      formData.append("response", responseText);
      documentFile.forEach((file) => {
        formData.append("document", file);
      });

      const response = await fetch(`${API_URL}/property-lead-response-store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // showCustomMessageModal(
        //   "Success",
        //   "Response submitted successfully",
        //   "success"
        // );

        Swal.fire({
          title: "Success",
          text: "Remark added successfully!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        });

        ///socket
        if (socket && socket.readyState === WebSocket.OPEN) {
          const notificationPayload = {
            user_id: userId,
            type: "Add Remark",
            message: `A new added by ${userName} (${UserType}).`,
            action_by: `front${UserType}`,
            remark: responseText,
            order_id: leadOrderID,
            statusremark: "",
            date: new Date().toISOString(),
          };

          socket.send(JSON.stringify(notificationPayload));
          console.log("📡 Notification sent via WebSocket");
        }

        setShowResponceModal(false);
        setResponseText("");
      } else {
        throw new Error(data.message || "Failed to submit response");
      }
    } catch (err) {
      showCustomMessageModal("Error", err.message, "error");
    } finally {
      setLoadingResponce(false);
    }

    const closeCustomMessageModal = () => {
      setShowMessageModal(false);
      setMessageModalContent({
        title: "",
        text: "",
        type: "",
        confirmAction: null,
      });
    };
  };

  // Pagination logic - Only this part is added
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

  return (
    <>
      <div className="card mt-3">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>Property Leads</h3>
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
                  type="text"
                  name="orderid"
                  placeholder="Lead ID"
                  value={searchTerm.orderid}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form_design w-100">
                <select
                  name="status"
                  value={searchTerm.status}
                  onChange={(e) => {
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    });
                  }}
                >
                  <option value="">All Status</option>
                  <option value="new">New</option>
                  <option value="documentPending">Document Pending</option>
                  <option value="paymentPending">Payment Pending</option>
                  <option value="notInterested">Not Interested</option>
                  <option value="loanInprocess">Loan In Process</option>
                  <option value="pattaInprocess">Patta In Process</option>
                  <option value="termSheetPending">Term Sheet Pending</option>
                  <option value="agreementSignaturePending">
                    Agreement Signature Pending
                  </option>
                  <option value="pattaApplicationFormPending">
                    Patta Application Form Pending
                  </option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              <div className="form_design w-100">
                <input
                  type="text"
                  name="customer_name"
                  placeholder="Name"
                  value={searchTerm.customer_name}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>
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
              <p className="mt-3">Loading my properties leads...</p>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-danger fw-bold">No data found!</p>
          ) : (
            <>
              <div className="table-responsive">
                <Table bordered>
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Lead ID</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Income Source</th>
                      <th>Project Name</th>
                      <th>Block Name</th>
                      <th>Unit Name</th>
                      <th>Lead Date</th>
                      <th>Status</th>
                      <th>Remark</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{(currentPage - 1) * LIMIT + index + 1}</td>
                        <td>{user.order_id}</td>
                        <td>{toSentenceCase(user.customer_name)}</td>

                        <td>{user.mobile}</td>
                        <td>{toSentenceCase(user.income_source)}</td>
                        <td>{toSentenceCase(user.project_name)}</td>
                        <td>{toSentenceCase(user.block_name)}</td>
                        <td>{toSentenceCase(user.plot_name)}</td>
                        <td>{user.date_time}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.status === "new"
                                ? "bg-primary"
                                : user.status === "documentPending"
                                  ? "bg-warning text-dark"
                                  : user.status === "paymentPending"
                                    ? "bg-info"
                                    : user.status === "notInterested"
                                      ? "bg-danger"
                                      : user.status === "loanInprocess"
                                        ? "bg-secondary"
                                        : user.status === "pattaInprocess"
                                          ? "bg-dark"
                                          : user.status === "termSheetPending"
                                            ? "bg-warning text-dark"
                                            : user.status ===
                                                "agreementSignaturePending"
                                              ? "bg-info"
                                              : user.status ===
                                                  "pattaApplicationFormPending"
                                                ? "bg-secondary"
                                                : user.status === "approved"
                                                  ? "bg-success"
                                                  : "bg-secondary"
                            }`}
                          >
                            {toSentenceCase(user.status)}
                          </span>
                        </td>

                        <td>
                          <button
                            className="button_remark"
                            onClick={() =>
                              handleResponseLead(user.id, user.order_id)
                            }
                            title="Remark Lead"
                            disabled={loadingResponce}
                          >
                            {loadingResponce ? "Loading..." : "Add Remark"}
                          </button>
                        </td>

                        <td>
                          <div className="dropdown">
                            <button
                              className="btn light btn-action dropdown-toggle"
                              type="button"
                              id="dropdownMenuButton"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <BsThreeDots size={20} />
                            </button>
                            <ul
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton"
                            >
                              <li className="dropdown-item">
                                <button
                                  className="btn view_btn btn-sm"
                                  title="View Project Details"
                                  onClick={() =>
                                    navigate(
                                      `/property-lead-details/${user.id}`,
                                    )
                                  }
                                >
                                  <FaEye /> View
                                </button>
                              </li>
                              <li className="dropdown-item">
                                <button
                                  className="btn view_btn btn-sm"
                                  title="View Project Details"
                                  onClick={() =>
                                    navigate(
                                      `/property-lead-remarks-lisst/${user.id}/$${user.order_id}`,
                                    )
                                  }
                                >
                                  <FaHistory /> Remark History Lead
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Updated Pagination Section */}
              <div className="d-flex justify-content-end">
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
            </>
          )}
        </div>
      </div>

      <Modal
        show={showResponceModal}
        onHide={() => {
          setShowResponceModal(false);
          setDocumentFile([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitResponse}>
            <Form.Group className="mb-3">
              <Form.Label>
                Remark Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Documents</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocumentFile(Array.from(e.target.files))}
                multiple
              />
              <div className="row">
                {documentFile?.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">Selected files:</small>
                    <ul className="list-unstyled d-flex flex-wrap">
                      <div className="row">
                        {documentFile.map((file, index) => (
                          <React.Fragment
                            key={index}
                            className="me-2 mb-2 "
                            style={{ listStyle: "none" }}
                          >
                            {/* Preview */}
                            <div className="col-md-2 position-relative">
                              {file.type.startsWith("image/") && (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="img-thumbnail"
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute"
                                style={{
                                  top: 0,
                                  right: 0,
                                  borderRadius: "50%",
                                  padding: "0 5px",
                                }}
                                onClick={() => {
                                  const newFiles = documentFile.filter(
                                    (_, i) => i !== index,
                                  );
                                  setDocumentFile(newFiles);
                                }}
                              >
                                &times;
                              </button>
                            </div>
                            <small
                              className="d-block text-truncate"
                              style={{ maxWidth: "100px" }}
                            >
                              {file.name}
                            </small>
                          </React.Fragment>
                        ))}
                      </div>
                    </ul>
                  </div>
                )}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loadingResponce}
              >
                {loadingResponce ? "Submitting..." : "Submit"}
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  setShowResponceModal(false);
                  setDocumentFile([]);
                }}
                disabled={loadingResponce}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
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
                    <Button
                      variant="secondary"
                      onClick={closeCustomMessageModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={
                        messageModalContent.type === "warning"
                          ? "warning"
                          : "primary"
                      }
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

export default PropertyLeadLists;
