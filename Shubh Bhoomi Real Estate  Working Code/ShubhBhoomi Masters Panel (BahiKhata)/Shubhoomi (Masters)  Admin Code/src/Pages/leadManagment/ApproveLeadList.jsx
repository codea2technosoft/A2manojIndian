import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaDownload, FaPlus } from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function ApproveLeadList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchPlotName, setSearchPlotName] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
  });

  const showCustomMessageModal = (title, text, type) => {
    setMessageModalContent({ title, text, type });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "" });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Check if token is expired
  const isTokenExpired = () => {
    try {
      const token = getAuthToken();
      if (!token) return true;
      
      // Decode the token to check expiration
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded = JSON.parse(jsonPayload);
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Token is expired if current time is greater than expiration time
      if (decoded.exp && decoded.exp < currentTime) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const fetchLeads = async (
    page = 1,
    query = "",
    orderid = "",
    mobile = "",
    plotname = ""
  ) => {
    // Check if token is expired before making API call
    if (isTokenExpired()) {
      showCustomMessageModal(
        "Session Expired",
        "Your session has expired. Please log in again.",
        "error"
      );
      setLoading(false);
      // Clear local storage and redirect to login
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
      }, 2000);
      return;
    }

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
        setLoading(false);
        return;
      }

      // Use the property-approved-list endpoint
      let url = `${API_URL}/property-approved-list?page=${page}&limit=10`;
      if (mobile) url += `&mobile=${mobile}`;
      if (query) url += `&name=${query}`;
      if (orderid) url += `&orderid=${orderid}`;
      if (plotname) url += `&plotname=${plotname}`;

      console.log("Fetching approved leads from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle 401 Unauthorized - Token expired or invalid
      if (response.status === 401) {
        showCustomMessageModal(
          "Session Expired",
          "Your session has expired. Please log in again.",
          "error"
        );
        // Clear local storage and redirect to login after 2 seconds
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userType");
          navigate("/login");
        }, 2000);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch approved leads.");
      }

      const data = await response.json();
      console.log("Approved leads data:", data);

      setLeads(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch leads error:", err);
      setError(err.message);
      if (!showMessageModal) {
        showCustomMessageModal(
          "Error",
          err.message || "An unexpected error occurred while fetching approved leads.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if token exists and is not expired before fetching
    const token = getAuthToken();
    if (!token || isTokenExpired()) {
      showCustomMessageModal(
        "Session Expired",
        "Your session has expired. Please log in again.",
        "error"
      );
      setLoading(false);
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
      }, 2000);
      return;
    }
    
    fetchLeads(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    // Check token before changing page
    if (isTokenExpired()) {
      showCustomMessageModal(
        "Session Expired",
        "Your session has expired. Please log in again.",
        "error"
      );
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
      }, 2000);
      return;
    }
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchOrder = (e) => {
    setSearchOrder(e.target.value);
  };

  const handleSearchChangeLocation = (e) => {
    setSearchMobile(e.target.value);
  };

  const handleSearchChangesearchPlotName = (e) => {
    setSearchPlotName(e.target.value);
  };

  const handleSearchClick = () => {
    // Check token before searching
    if (isTokenExpired()) {
      showCustomMessageModal(
        "Session Expired",
        "Your session has expired. Please log in again.",
        "error"
      );
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
      }, 2000);
      return;
    }
    setCurrentPage(1);
    fetchLeads(
      1,
      searchQuery.trim(),
      searchOrder,
      searchMobile.trim(),
      searchPlotName.trim()
    );
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchOrder("");
    setSearchMobile("");
    setSearchPlotName("");
    setCurrentPage(1);
    fetchLeads(1, "", "", "", "");
  };

  const handleViewLead = async (id) => {
    // Check token before viewing lead details
    if (isTokenExpired()) {
      showCustomMessageModal(
        "Session Expired",
        "Your session has expired. Please log in again.",
        "error"
      );
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
      }, 2000);
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/property-lead-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.status === 401) {
        showCustomMessageModal(
          "Session Expired",
          "Your session has expired. Please log in again.",
          "error"
        );
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userType");
          navigate("/login");
        }, 2000);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch lead details.",
          "error"
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSelectedLead(data.data);
      setShowViewModal(true);
    } catch (err) {
      showCustomMessageModal(
        "Error",
        "An error occurred while fetching lead details.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const exportAllToExcel = async () => {
   
    if (isTokenExpired()) {
      alert("Your session has expired. Please log in again.");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
      }, 2000);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login!");
        return;
      }

      let url = `${API_URL}/lead-properties-approve-exceldownload`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/csv",
        },
      });

      if (response.status === 401) {
        alert("Your session has expired. Please log in again.");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userType");
          navigate("/login");
        }, 2000);
        return;
      }

      if (!response.ok) {
        alert("Server Error: Unable to download!");
        return;
      }

      const csvData = await response.text();

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `approved_projects_${Date.now()}.csv`);
      link.click();
    } catch (error) {
      console.error("CSV Export Error:", error);
      alert("Export Failed! Try again");
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      new: "New",
      documentPending: "Document Pending",
      paymentPending: "Payment Pending",
      notInterested: "Not Interested",
      loanInprocess: "Loan In Process",
      pattaInprocess: "Patta In Process",
      termSheetPending: "Term Sheet Pending",
      agreementSignaturePending: "Agreement Signature Pending",
      pattaApplicationFormPending: "Patta Application Form Pending",
      approved: "Approved",
      unitisnotsold: "Unit is not sold",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: "bg-warning text-white",
      inprocess: "bg-info text-white",
      approved: "bg-success text-white",
      available: "bg-success text-dark",
      sold: "bg-danger",
      new: "bg-warning text-white",
      unitisnotsold: "bg-danger",
      rejected: "bg-danger text-white",
    };
    return classes[status] || "bg-secondary";
  };

  const currentDomain = window.location.host;
  const dontallowedDomains = ["master.bahikhatas.com"];

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

  if (error) {
    return (
      <div className="alert alert-danger text-center m-5" role="alert">
        {error}
        <button className="btn btn-primary ms-3" onClick={() => fetchLeads()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="userlist mt-2">
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-wrap-mobile gap-2 align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Approved Property Leads</h3>
            </div>
            <div className="d-flex gap-2 flex-wrap-mobile align-items-center justify-content-between">
              {!dontallowedDomains.includes(currentDomain) && (
                <div className="createnewadmin">
                  <button
                    className="exportexcel btn gap-2 btn-success d-inline-flex align-items-center"
                    onClick={exportAllToExcel}
                  >
                    <FaDownload />
                    Export
                  </button>
                </div>
              )}
              <div className="createnewadmin">
                <Link
                  to="/create-lead"
                  className="btn btn-success d-flex align-items-center"
                >
                  <FaPlus className="me-2" /> Add Lead
                </Link>
              </div>
              <button
                className={`filter-toggle-btn btn ${isFilterActive ? "active" : ""}`}
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

        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 flex-wrap-mobile align-items-center">
              <div className="form-group w-100" id="searchOrder">
                <input
                  type="text"
                  placeholder="Lead ID"
                  value={searchOrder}
                  onChange={handleSearchOrder}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchName">
                <input
                  type="text"
                  placeholder="Name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchLocation">
                <input
                  type="text"
                  placeholder="Customer Mobile"
                  value={searchMobile}
                  onChange={handleSearchChangeLocation}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchPlotName">
                <input
                  type="text"
                  placeholder="Unit Number"
                  value={searchPlotName}
                  onChange={handleSearchChangesearchPlotName}
                  className="form-control"
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSearchClick}
              >
                Search
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            </div>
          )}

          <div className="table-responsive">
            <Table bordered>
              <thead className="bg-primary text-white">
                <tr>
                  <th>S.N</th>
                  <th>Associate Name</th>
                  <th>Associate Mobile</th>
                  <th>Lead ID</th>
                  <th>Project Name</th>
                  <th>Block Name</th>
                  <th>Unit Number</th>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Income Source</th>
                  <th>Lead Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads?.length > 0 ? (
                  leads.map((lead, i) => (
                    <tr key={lead.id}>
                      <td>{(currentPage - 1) * 10 + i + 1}</td>
                      <td>{lead.creator_username}</td>
                      <td>{lead.creator_mobile}</td>
                      <td>{lead.order_id}</td>
                      <td>
                        {lead.project_name
                          ? lead.project_name.charAt(0).toUpperCase() +
                            lead.project_name.slice(1).toLowerCase()
                          : ""}
                      </td>
                      <td>
                        {lead.block_name
                          ? lead.block_name.charAt(0).toUpperCase() +
                            lead.block_name.slice(1).toLowerCase()
                          : ""}
                      </td>
                      <td>
                        {lead.plot_name
                          ? lead.plot_name.charAt(0).toUpperCase() +
                            lead.plot_name.slice(1).toLowerCase()
                          : ""}
                      </td>
                      <td>
                        {lead.customer_name
                          ? lead.customer_name.charAt(0).toUpperCase() +
                            lead.customer_name.slice(1).toLowerCase()
                          : ""}
                      </td>
                      <td>{lead.mobile}</td>
                      <td>{lead.income_source}</td>
                      <td>{lead.date}</td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(lead.status)} px-3 py-2`}
                          style={{ fontSize: "0.8rem" }}
                        >
                          {formatStatus(lead.status)}
                        </span>
                      </td>
                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center">
                      No approved leads found.
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

              {[1, 2, 3].map((pageNum) => {
                if (pageNum > totalPages) return null;
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

              {currentPage > 4 && totalPages > 4 && (
                <Pagination.Ellipsis disabled />
              )}

              {currentPage > 3 && currentPage < totalPages - 1 && (
                <Pagination.Item
                  active
                  onClick={() => handlePageChange(currentPage)}
                >
                  {currentPage}
                </Pagination.Item>
              )}

              {currentPage < totalPages - 2 && totalPages > 4 && (
                <Pagination.Ellipsis disabled />
              )}

              {totalPages > 3 && (
                <Pagination.Item
                  active={currentPage === totalPages}
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

      {/* View Lead Modal */}
      <Modal
        size="lg"
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Approved Property Lead Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLead ? (
            <Form>
              <div className="row">
                <div className="col-md-12">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="card-title">Customer Details</h5>
                    </div>
                    <div className="card-body p-2">
                      <Form.Group as={Row}>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Project Name:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.project_name}
                            className="fw-semibold"
                          />
                        </Col>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Block Name:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.block_name}
                            className="fw-semibold"
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row}>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Unit Number:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.plot_name}
                            className="fw-semibold"
                          />
                        </Col>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Customer Name:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.customer_name}
                            className="fw-semibold"
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row}>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Mobile Number:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.mobile}
                            className="fw-semibold"
                          />
                        </Col>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Income Source:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.income_source}
                            className="fw-semibold"
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row}>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Aadhaar Card:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.adhar_card_number}
                            className="fw-semibold"
                          />
                        </Col>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Pan Card:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.pan_card_number}
                            className="fw-semibold"
                          />
                        </Col>
                      </Form.Group>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">Document Verification</h5>
                    </div>
                    <div className="card-body p-2">
                      <div className="row">
                        <div className="col-md-4 mb-4">
                          <div className="document-card">
                            <h6 className="document-title">Aadhaar Front</h6>
                            {selectedLead.adhar_front_image ? (
                              <img
                                src={`${imageAPIURL}/lead/${selectedLead.adhar_front_image}`}
                                alt="Aadhaar Front"
                                className="img-thumbnail document-image"
                                style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/300x200/cccccc/000000?text=Aadhaar+Front";
                                }}
                              />
                            ) : (
                              <div className="document-placeholder">
                                <i className="bi bi-file-image fs-1 text-muted"></i>
                                <p className="text-muted mt-2">
                                  No image available
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-4 mb-4">
                          <div className="document-card">
                            <h6 className="document-title">Aadhaar Back</h6>
                            {selectedLead.adhar_back_image ? (
                              <img
                                src={`${imageAPIURL}/lead/${selectedLead.adhar_back_image}`}
                                alt="Aadhaar Back"
                                className="img-thumbnail document-image"
                                style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/300x200/cccccc/000000?text=Aadhaar+Back";
                                }}
                              />
                            ) : (
                              <div className="document-placeholder">
                                <i className="bi bi-file-image fs-1 text-muted"></i>
                                <p className="text-muted mt-2">
                                  No image available
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-4 mb-2">
                          <div className="document-card">
                            <h6 className="document-title">PAN Card</h6>
                            {selectedLead.pan_card_image ? (
                              <img
                                src={`${imageAPIURL}/lead/${selectedLead.pan_card_image}`}
                                alt="PAN Card"
                                className="img-thumbnail document-image"
                                style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/300x200/cccccc/000000?text=PAN+Card";
                                }}
                              />
                            ) : (
                              <div className="document-placeholder">
                                <i className="bi bi-file-image fs-1 text-muted"></i>
                                <p className="text-muted mt-2">
                                  No image available
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          ) : (
            <p>Loading details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Message Modal */}
      <Modal
        show={showMessageModal}
        onHide={() => {
          if (messageModalContent.type !== "confirmation") {
            closeCustomMessageModal();
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{messageModalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{messageModalContent.text}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              closeCustomMessageModal();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ApproveLeadList;