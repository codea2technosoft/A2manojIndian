import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Container, Row, Col } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { MdAirplanemodeInactive, MdAirplanemodeActive, MdOutlineUpcoming, MdUpcoming } from "react-icons/md";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function InActiveChannelList() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const searchTimeoutRef = useRef(null);
  const [editFormData, setEditFormData] = useState({
    id: "",
    username: "",
    email: "",
    mobile: "",
    whatsapp_number: "",
  });

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

  const fetchChannels = async (page = 1, name = "", location = "") => {
    // setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(
        `${API_URL}/Channel-list-inactive?page=${page}&limit=10&mobile=${name}&parent_id=${location}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          showCustomMessageModal("Authorization Error", "Unauthorized: Please log in again.", "error");
          throw new Error("Unauthorized: Please log in again.");
        }
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to fetch Channel.", "error");
        throw new Error(errorData.message || "Failed to fetch Channel.");
      }
      const data = await response.json();
      setChannels(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch Channel error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels(currentPage);
  }, [currentPage]);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewChannels = async (channelId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`${API_URL}/Channel-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: channelId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to fetch Channel details.", "error");
        throw new Error(errorData.message || "Failed to fetch Channel details.");
      }

      const data = await response.json();
      setSelectedChannels(data.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("View Channel error:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleEditChannels = async (channelId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      // Fetch Channel data
      const response = await fetch(`${API_URL}/Channel-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: channelId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to fetch Channel for editing.", "error");
        throw new Error(errorData.message || "Failed to fetch Channel for editing.");
      }

      const data = await response.json();
      const channelData = data.data;

      setSelectedChannels(channelData);

      setEditFormData({
        id: channelData.id || "",
        username: channelData.username || "",
        email: channelData.email || "",
        mobile: channelData.mobile || "",
        whatsapp_number: channelData.whatsapp_number || "",
      });

      setShowEditModal(true);
    } catch (err) {
      console.error("Edit Channel error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleUpdateChannel = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        throw new Error("Authentication token not found. Please log in.");
      }

      const payload = { ...selectedChannels };
      payload.id = editFormData.id;
      payload.username = editFormData.username;
      payload.email = editFormData.email;
      payload.mobile = editFormData.mobile;
      payload.whatsapp_number = editFormData.whatsapp_number;

      const response = await fetch(`${API_URL}/Channel-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to update Channel.", "error");
        throw new Error(errorData.message || "Failed to update Channel.");
      }

      const result = await response.json();
      if (result.success == '1') {
        showCustomMessageModal("Success", "Channel has been updated successfully!", "success");
        setShowEditModal(false);
        fetchChannels(currentPage);
      }
      else {
        showCustomMessageModal("Error", result.message || "Something went wrong", "error");
      }

    } catch (err) {
      console.error("Update Channel error:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleStatusUpdate = async (channelId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    showCustomMessageModal(
      "Confirm Status Change",
      `Do you want to change the status to ${newStatus}?`,
      "warning",
      async () => {
        setLoading(true);
        setError(null);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
            throw new Error("Authentication token not found. Please log in.");
          }

          const response = await fetch(`${API_URL}/Channel-update-status`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: channelId,
              status: newStatus,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal("Error", errorData.message || "Failed to update Channel status.", "error");
            throw new Error(errorData.message || "Failed to update Channel status.");
          }

          const result = await response.json();
          if (result.success = '1') {
            showCustomMessageModal("Success", "Channel status has been updated successfully!", "success");
            fetchChannels(currentPage);
          }
          else {
            showCustomMessageModal("Error", result.message || "Something went wrong", "error");
          }


        } catch (err) {
          console.error("Status update error:", err);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedChannels(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedChannels(null);
    setEditFormData({
      id: "",
      username: "",
      email: "",
      mobile: "",
      whatsapp_number: "",
    });

  };


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchChannels(1, value, searchLocation);
    }, 500);
  };

  const handleSearchChangeLocation = (e) => {
    const value = e.target.value;
    setSearchLocation(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchChannels(1, searchName, value);
    }, 500);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
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
              <h3>Inactive Channel List</h3>
            </div>
            <div className="d-flex gap-2">
              <div className="d-none d-md-block">


                <div className="d-flex gap-2">
                  <div className="form-group" id="searchName">
                    <input
                      type="text"
                      placeholder="Search Mobile"
                      value={searchName}
                      onChange={handleSearchChange}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group" id="searchLocation">
                    <input
                      type="text"
                      placeholder="Parent ID"
                      value={searchLocation}
                      onChange={handleSearchChangeLocation}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="createnewadmin">
                <Link to="/create-channel" className="btn btn-success d-inline-flex align-items-center">
                  <FaPlus className="me-2" /> Partner
                </Link>
              </div>
              <div className="d-block d-md-none">
                <div className="d-flex gap-2">

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
          </div>
        </div>
        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              <div className="form-group" id="searchName">
                <input
                  type="text"
                  placeholder="Search Mobile"
                  value={searchName}
                  onChange={handleSearchChange}
                  className="form-control"
                />
              </div>

              <div className="form-group" id="searchLocation">
                <input
                  type="text"
                  placeholder="Parent ID"
                  value={searchLocation}
                  onChange={handleSearchChangeLocation}
                  className="form-control"
                />
              </div>
            </div>
          )}
          <div className="table-responsive">
            <Table bordered>
              <thead className="bg-primary text-white">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Password</th>
                  <th>KYC Status</th>
                  <th>Parent Name</th>
                  <th>Parent ID</th>
                  <th>Status</th>
                  <th>Date Of Joining</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {channels.length > 0 ? (
                  channels.map((channel, i) => (
                    <tr key={channel.id}>
                      <td>{(currentPage - 1) * 10 + i + 1}</td>
                      <td>
                        {channel.username
                          ? channel.username.charAt(0).toUpperCase() + channel.username.slice(1).toLowerCase()
                          : ""}
                      </td>

                      <td>{channel.mobile}</td>
                      <td>{channel.password}</td>
                      <td
                        style={{
                          color:
                            channel.kyc?.toLowerCase() === "success"
                              ? "green"
                              : channel.kyc?.toLowerCase() === "pending"
                                ? "orange"
                                : "red",
                          fontWeight: "500",
                        }}
                      >
                        {channel.kyc
                          ? channel.kyc.charAt(0).toUpperCase() + channel.kyc.slice(1).toLowerCase()
                          : "-"}
                      </td>

                      <td>
                        {channel.parent_name
                          ? channel.parent_name.charAt(0).toUpperCase() + channel.parent_name.slice(1).toLowerCase()
                          : "-"}
                      </td>

                      <td>{channel.parent_id}</td>
                      <td>
                        <span
                          className={`badge ${channel.status === "active" ? "bg-success" : "bg-danger"
                            }`}
                        >
                          {channel.status}
                        </span>
                      </td>

                      <td>
                        {channel.date
                          ? (() => {
                            const [day, month, year] = channel.date.split("-");
                            return `${day}-${month}-${year}`;
                          })()
                          : "-"}
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
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm"
                                onClick={() => handleViewChannels(channel.id)}
                                title="View Project Details"
                              >
                                <FaEye /> View
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm"
                                title="View Project Details"
                                onClick={() => handleEditChannels(channel.id)}
                              >
                                <FaEdit /> Edit
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                variant={channel.status === "active" ? "danger" : "success"}
                                className="btn btn-sm btn-danger"
                                onClick={() => handleStatusUpdate(channel.id, channel.status)}
                              >
                                {channel.status === "active" ? <MdAirplanemodeInactive /> : <MdAirplanemodeActive />}

                                {channel.status === "active" ? "Deactivate" : "Activate"}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Channel found.
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

              {/* Always show first page */}
              <Pagination.Item
                active={1 === currentPage}
                onClick={() => handlePageChange(1)}
              >
                1
              </Pagination.Item>

              {/* Show ellipsis if there are pages before current page beyond page 2 */}
              {currentPage > 3 && (
                <Pagination.Ellipsis />
              )}

              {/* Show pages around current page */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show page if it's within 1 of current page (except page 1 which is always shown)
                if (
                  pageNumber > 1 &&
                  pageNumber < totalPages &&
                  Math.abs(pageNumber - currentPage) <= 1
                ) {
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                }
                return null;
              })}

              {/* Show ellipsis if there are pages after current page before last page */}
              {currentPage < totalPages - 2 && (
                <Pagination.Ellipsis />
              )}

              {/* Always show last page if there's more than 1 page */}
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



      {/* View Channel Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Channel Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedChannels && (
            <Row>
              <div className="col-md-12">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Name</th>
                      <td>{selectedChannels.username}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{selectedChannels.email}</td>
                    </tr>
                    <tr>
                      <th>Mobile</th>
                      <td>{selectedChannels.mobile}</td>
                    </tr>
                    <tr>
                      <th>WhatsApp No.</th>
                      <td>{selectedChannels.whatsapp_number}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showEditModal} onHide={handleCloseEditModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateChannel}>
            <Row>
              <Col md={6}>
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
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="editMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={editFormData.mobile}
                    onChange={handleEditFormChange}
                    maxLength="10"
                    required
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="editWhatsappNumber">
                  <Form.Label>WhatsApp Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="whatsapp_number"
                    value={editFormData.whatsapp_number}
                    maxLength="10"
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "Updating..." : "Update Channel"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {showMessageModal && (
        <div className="modal d-block modalshowparentdesign" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${messageModalContent.type === 'success' ? '' : messageModalContent.type === 'error' ? '' : ''}`}>
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className={`modal-title ${messageModalContent.type === 'success' ? '' : messageModalContent.type === 'error' ? '' : ''}`}>
                  {messageModalContent.title}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomMessageModal}></button>
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
                      variant={messageModalContent.type === 'warning' ? 'warning' : 'primary'}
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
                    variant={messageModalContent.type === 'success' ? 'success' : messageModalContent.type === 'error' ? 'danger' : 'primary'}
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

export default InActiveChannelList;