import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";
import { FaHistory } from "react-icons/fa";
import { MdFilterListAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";


const API_URL = process.env.REACT_APP_API_URL;
function LoanLists() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [response, setResponse] = useState("");
  const [responseError, setResponseError] = useState("");
  const [documentFile, setDocumentFile] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [userName, setUserName] = useState("");
  const [leadOrderID, setleadOrderID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [UserType, setUserType] = useState("");
  const [userId, setUserId] = useState("");

  const token = localStorage.getItem("token");
  // For pagination chunk/window size
  const pageLimit = 10;

  // Calculate starting serial number for current page
  const getStartingSerialNumber = () => {
    return (currentPage - 1) * pageLimit + 1;
  };

  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
    const end = Math.min(start + pageLimit - 1, totalPages);
    let pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
  });

  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      if (window.innerWidth >= 1199) {
        setIsDesktop(true);
        setShowFilter(true); // always show filter in desktop
      } else {
        setIsDesktop(false);
        setShowFilter(false); // hide filter in mobile initially
      }
    };

    // Run on mount
    handleResize();

    // Listen to resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [searchTerm, setSearchTerm] = useState({
    name: "",
    mobile: "",
    category: "",
    service: "",
    orderid: "",
  });
  const [showMessageModal, setShowMessageModal] = useState(false);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("token");

  const showCustomMessageModal = (title, text, type) => {
    setMessageModalContent({ title, text, type });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => setShowMessageModal(false);

const fetchLeads = async (page = 1) => {
  setLoading(true);
  try {
    const query = new URLSearchParams({
      page,
      name: searchTerm.name,
      mobile: searchTerm.mobile,
      category: searchTerm.category,
      service: searchTerm.service,
      orderid: searchTerm.orderid,
    }).toString();

    const res = await fetch(`${API_URL}/loan-lead-list?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();

    setLeads(result.data || []);
    setTotalPages(result.totalPages || 1); // total pages from server
    setCurrentPage(page); // current page you requested
  } catch (error) {
    showCustomMessageModal("Error", "Failed to fetch loan leads.", "error");
  } finally {
    setLoading(false);
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

  const handlePageChange = (pageNumber) => {
    fetchLeads(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads(1);
  };

  const handleShowResponseModal = (leadId, order_id) => {
    setCurrentLeadId(leadId);
    setleadOrderID(order_id);
    setShowResponseModal(true);
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) {
      setResponseError("Response cannot be empty.");
      return;
    }
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("lead_id", currentLeadId);
      formData.append("order_id", leadOrderID);
      formData.append("response", response);
      // if (documentFile) {
      //   formData.append("document", documentFile);
      // }

      documentFile.forEach((file) => {
        formData.append("document", file);
      });

      const res = await fetch(`${API_URL}/loan-lead-response-store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to store remark.");
      setShowResponseModal(false);
      setResponse("");
      setResponseError("");
      fetchLeads(currentPage);
      // showCustomMessageModal(
      //   "Success",
      //   "Remark added successfully!",
      //   "success"
      // );
      Swal.fire({
        title: "Success",
        text: "Remark added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      ///socket
      if (socket && socket.readyState === WebSocket.OPEN) {
        const notificationPayload = {
          user_id: userId,
          type: "Add Remark",
          message: `A new added by ${userName} (${UserType}).`,
          action_by: `front${UserType}`,
          remark: response,
          order_id: leadOrderID,
          statusremark: "",
          date: new Date().toISOString(),
        };

        socket.send(JSON.stringify(notificationPayload));
        console.log("📡 Notification sent via WebSocket");
      }

    } catch (error) {
      console.error("Error storing remark:", error);
      showCustomMessageModal("Error", "Failed to add response.", "error");
    }
  };

  const handleNavigateToView = (id) => {
    navigate(`/loan-details/${id}`);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/loan-lead-category-list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [API_URL, token]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token"); // Token yaha lo

        const res = await fetch(`${API_URL}/loan-lead-service-list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await res.json();
        setServices(data.data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, [API_URL]);

  // Pagination chunk/window calculation

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3>Loan List</h3>
            </div>
            {!isDesktop && (
              <div className="d-md-block d-lg-block d-xl-none d-block d-sm-block">
                <button
                  type="button"
                  className="toggle-filter-btn"
                  onClick={toggleFilter}
                >
                  {showFilter ? <MdFilterAltOff /> : <MdFilterListAlt />}
                </button>
              </div>
            )}
            <div className="d-md-block d-lg-block d-xl-none d-block d-sm-none">
              <Link to="/create-loan">
                <Button className="btn btn-success d-inline-flex align-items-center">
                  <FaPlus className="me-2" /> Create Lead
                </Button>
              </Link>
              </div>
            <div className="d-md-none d-lg-none d-xl-block d-none d-sm-none">

              <div className="d-flex  gap-2 align-items-center">
                <div className="form_design">
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

                <div className="form_design">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={searchTerm.name}
                    onChange={(e) =>
                      setSearchTerm({
                        ...searchTerm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form_design">
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
                <div className="form_design">
                  <select
                    name="category"
                    value={searchTerm.category}
                    onChange={(e) =>
                      setSearchTerm({
                        ...searchTerm,
                        [e.target.name]: e.target.value,
                      })
                    }
                  >
                    <option value="">Categories</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form_design">
                  <select
                    name="service"
                    value={searchTerm.service}
                    onChange={(e) =>
                      setSearchTerm({
                        ...searchTerm,
                        [e.target.name]: e.target.value,
                      })
                    }
                    className="text-white"
                  >
                    <option value="">Services</option>
                    {services.map((srv, index) => (
                      <option key={index} value={srv.name}>
                        {srv.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form_design">
                  <button
                    type="button"
                    className="submit_button"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
                <Link to="/create-loan">
                  <Button className="btn btn-success d-inline-flex align-items-center">
                    <FaPlus className="me-2" /> Create Lead
                  </Button>
                </Link>
              </div>
            </div>
            
          </div>
          <div className="card-body">
            {showFilter && (
              <div className=" d-lg-block d-xl-none">

                <div className="d-flex fillter_input gap-2 align-items-center">
                  <div className="form_design">
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

                  <div className="form_design">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={searchTerm.name}
                      onChange={(e) =>
                        setSearchTerm({
                          ...searchTerm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form_design">
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
                  <div className="form_design">
                    <select
                      name="category"
                      value={searchTerm.category}
                      onChange={(e) =>
                        setSearchTerm({
                          ...searchTerm,
                          [e.target.name]: e.target.value,
                        })
                      }
                    >
                      <option value="">Categories</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form_design">
                    <select
                      name="service"
                      value={searchTerm.service}
                      onChange={(e) =>
                        setSearchTerm({
                          ...searchTerm,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="text-white"
                    >
                      <option value="">Services</option>
                      {services.map((srv, index) => (
                        <option key={index} value={srv.name}>
                          {srv.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form_design">
                    <button
                      type="button"
                      className="submit_button"
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>

                </div>
              </div>
            )
            }
            {loading ? (
              <p>Loading leads...</p>
            ) : leads.length === 0 ? (
              <p>No loan leads found.</p>
            ) : (
              <>
               <div className="table-responsive">
                 <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Lead ID</th>
                      <th>Customer Name</th>
                      <th>Mobile</th>
                      <th>Category</th>
                      <th>Services</th>
                      <th>Lead Date</th>
                      <th>Status</th>
                      <th>Remark</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={lead.id}>
                        {/* Correct serial number calculation */}
                        <td>{getStartingSerialNumber() + index}</td>
                        <td>{lead.order_id}</td>
                        <td>{toSentenceCase(lead.customer_name)}</td>
                        <td>{lead.mobile}</td>
                        <td>{toSentenceCase(lead.category)}</td>
                        <td>{toSentenceCase(lead.service)}</td>
                        <td>{lead.date}</td>
                        <td>
                          <span
                            className={`badge ${lead.status === "new"
                                ? "bg-primary"
                                : lead.status === "documentPending"
                                  ? "bg-warning text-white"
                                  : lead.status === "sanctionInProcess"
                                    ? "bg-info"
                                    : lead.status === "sanctioned"
                                      ? "backgroundgreen"
                                      : lead.status === "disbursementInProcess"
                                        ? "bg-secondary"
                                        : lead.status === "disbursed"
                                          ? "backgroundgreen"
                                          : lead.status ===
                                            "propertyOriginalDocumentPending"
                                            ? "bg-danger"
                                            : "bg-secondary"
                              }`}
                          >
                            {toSentenceCase(
                              {
                                new: "New",
                                documentPending: "Document Pending",
                                sanctionInProcess: "Sanction in Process",
                                sanctioned: "Sanctioned",
                                disbursementInProcess:
                                  "Disbursement in Process",
                                disbursed: "Disbursed",
                                propertyOriginalDocumentPending:
                                  "Property Original Document Pending",
                              }[lead.status] || lead.status
                            )}
                          </span>
                        </td>

                        <td>
                          <button
                            className="button_remark"
                            onClick={() => handleShowResponseModal(lead.id, lead.order_id)}
                          >
                            Add Remark
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
                                  onClick={() => handleNavigateToView(lead.id)}
                                >
                                  <FaEye /> View
                                </button>
                              </li>
                              <li className="dropdown-item">
                                <button
                                  className="btn view_btn btn-sm"
                                  title="View Project Details"
                                  onClick={() =>
                                    navigate(`/loan-remarks-lisst/${lead.id}/${lead.order_id}`)
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

                {/* Pagination Section - Your existing pagination code remains same */}
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
              </>
            )}
          </div>
        </div>

        {/* Response Modal */}
        <Modal
          show={showResponseModal}
          onHide={() => setShowResponseModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Remark</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleResponseSubmit}>
              <Form.Group controlId="responseTextArea" className="mb-2">
                <Form.Label>
                  Remark Description <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  isInvalid={!!responseError}
                />
                <Form.Control.Feedback type="invalid">
                  {responseError}
                </Form.Control.Feedback>
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
                              (_, i) => i !== index
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
              </Form.Group>

              <div className="d-flex justify-content-end mt-3">
                <Button variant="success" type="submit" className="ms-2">
                  &nbsp;&nbsp;&nbsp;Submit&nbsp; &nbsp;&nbsp;
                </Button>
                &nbsp;&nbsp;
                <Button
                  variant="danger"
                  onClick={() => setShowResponseModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Message Modal */}
        <Modal
          show={showMessageModal}
          onHide={closeCustomMessageModal}
          centered
        >
          <Modal.Header
            closeButton
            className={`border-top border-4 ${messageModalContent.type === "success"
                ? "border-success"
                : messageModalContent.type === "error"
                  ? "border-danger"
                  : "border-warning"
              }`}
          >
            <Modal.Title
              className={`modal-title ${messageModalContent.type === "success"
                  ? "text-success"
                  : messageModalContent.type === "error"
                    ? "text-danger"
                    : "text-warning"
                }`}
            >
              {messageModalContent.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-secondary">
            <p>{messageModalContent.text}</p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
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
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default LoanLists;