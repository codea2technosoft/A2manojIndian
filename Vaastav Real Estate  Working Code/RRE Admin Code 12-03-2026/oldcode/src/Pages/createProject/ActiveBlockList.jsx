import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { Dropdown } from 'react-bootstrap';
import { BsThreeDots } from "react-icons/bs";
import { MdAirplanemodeInactive, MdAirplanemodeActive, MdOutlineUpcoming, MdUpcoming } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function ActiveBlockList() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEdit] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedimagePath, setSelectedimagePath] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    status: "active",
    image: null,
  });
  const imageInputRef = useRef(null);


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


  const fetchBlocks = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        throw new Error("Authentication token not found. Please log in.");
      }


      const response = await fetch(
        `${API_URL}/block-list-active?page=${page}&limit=10`,
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
        showCustomMessageModal("Error", errorData.message || "Failed to fetch blocks.", "error");
        throw new Error(errorData.message || "Failed to fetch blocks.");
      }

      const data = await response.json();

      setBlocks(data.data || []);
      setSelectedimagePath(data.imagePath);
      setTotalPages(data.data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch blocks error:", err);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBlocks(currentPage);
  }, [currentPage]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  const handleViewBlock = async (blockId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`${API_URL}/block-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: blockId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to fetch block details.", "error");
        throw new Error(errorData.message || "Failed to fetch block details.");
      }

      const data = await response.json();
      setSelectedBlock(data.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("View block error:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleEditBlock = async (blockId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`${API_URL}/block-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: blockId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to fetch block for editing.", "error");
        throw new Error(errorData.message || "Failed to fetch block for editing.");
      }

      const data = await response.json();
      const blockData = data.data;
      setSelectedBlock(blockData);
      setEditFormData({
        id: blockData.id,
        name: blockData.name || "",
        status: blockData.status || "active",
        image: null,
      });
      setShowEdit(true);
    } catch (err) {
      console.error("Edit block error:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setEditFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setEditFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const handleUpdateBlock = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        throw new Error("Authentication token not found. Please log in.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("project_id", editFormData.id);
      formDataToSend.append("name", editFormData.name);
      formDataToSend.append("status", editFormData.status);
      if (editFormData.image) {
        formDataToSend.append("image", editFormData.image);
      }

      const response = await fetch(`${API_URL}/block-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,

        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to update block.", "error");
        throw new Error(errorData.message || "Failed to update block.");
      }

      showCustomMessageModal("Success", "Block updated successfully!", "success");
      setShowEdit(false);
      fetchBlocks(currentPage);
    } catch (err) {
      console.error("Update block error:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleStatusUpdate = async (blockId, currentStatus) => {
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

          const response = await fetch(`${API_URL}/block-status-update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: blockId,
              status: newStatus,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal("Error", errorData.message || "Failed to update block status.", "error");
            throw new Error(errorData.message || "Failed to update block status.");
          }
          const result = await response.json();
          if (result.success == "1") {
            showCustomMessageModal("Success", "Block status updated successfully!", "success");
            fetchBlocks(currentPage);
          }
          else {
            showCustomMessageModal("Error", result.message || "Somthing Went Wrong!", "success");
          }

          // showCustomMessageModal("Success", "Block status updated successfully!", "success");
          // fetchBlocks(currentPage);
        } catch (err) {
          console.error("Status update error:", err);
        } finally {
          setLoading(false);
        }
      }
    );
  };


  const handleDeleteBlock = async (blockId) => {
    showCustomMessageModal(
      "Confirm Deletion",
      "Are you sure you want to delete this block? This action cannot be undone.",
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

          const response = await fetch(`${API_URL}/block-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: blockId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal("Error", errorData.message || "Failed to delete block.", "error");
            throw new Error(errorData.message || "Failed to delete block.");
          }

          showCustomMessageModal("Success", "Block deleted successfully!", "success");
          fetchBlocks(currentPage);
        } catch (err) {
          console.error("Delete block error:", err);
        } finally {
          setLoading(false);
        }
      }
    );
  };


  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedBlock(null);
  };

  const handleCloseEditModal = () => {
    setShowEdit(false);
    setSelectedBlock(null);
    setEditFormData({
      id: "",
      name: "",
      status: "active",
      image: null,
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
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
    <div className="mt-2">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Active Block</h3>
            </div>
            <div className="d-flex gap-2">

              <div className="createnewadmin">
                <Link to="/create-block" className="btn btn-success d-inline-flex align-items-center">
                  <FaPlus className="me-2" /> Create New Block
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">

          <div className="table-responsive">
            <Table bordered>
              <thead className="bg-primary text-white">
                <tr>
                  <th>ID</th>
                  <th>Project Name</th>
                  <th>Block Name</th>
                  <th>Image</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blocks.length > 0 ? (
                  blocks.map((block) => (
                    <tr key={block.id}>
                      <td>{block.id}</td>
                      <td>{block.project_name}</td>
                      <td>{block.name}</td>
                      <td>
                        {block.image ? (
                          <img
                            src={`${imageAPIURL}/block/${block.image}`}
                            alt={`Block ${block.name}`}
                            style={{ width: "100px", height: "auto", borderRadius: "5px" }}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x50/cccccc/333333?text=No+Image"; }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>{block.date}</td>
                      <td>
                        <span
                          className={`badge ${block.status === "active" ? "bg-success" : "bg-danger"
                            }`}
                        >
                          {block.status}
                        </span>
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
                                className="btn view_btn btn-sm me-1"
                                onClick={() => handleViewBlock(block.id)}
                                title="View Project Details"
                              >
                                <FaEye /> View
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn edit_btn btn-sm me-1"
                                onClick={() => handleEditBlock(block.id)}
                                title="Edit Project"
                              >
                                <FaEdit /> Edit
                              </button>
                            </li>

                            <li className="dropdown-item">
                              <button
                                className="btn btn-danger btn-sm"
                                variant={block.status === "active" ? "danger" : "success"}
                                onClick={() => handleStatusUpdate(block.id, block.status)}
                              >
                                {block.status === "active" ? <MdAirplanemodeInactive /> : <MdAirplanemodeActive />}
                                {block.status === "active" ? "Deactivate" : "Activate"}
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn delete_btn btn-sm"
                                onClick={() => handleDeleteBlock(block.id)}
                                title="Delete Project"
                              >
                                <RiDeleteBin3Fill /> Delete
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
                      No blocks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>


          <div className="d-flex justify-content-end">
            <Pagination>
              {/* <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} /> */}
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
              </Pagination.Prev>
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
              </Pagination.Next>
              {/* <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          /> */}
            </Pagination>
          </div>
        </div>
      </div>




      <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Block Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBlock && (
           
            <table className="table">
              <tbody>
               
                <tr>
                  <th>Project Name</th>
                  <td>{selectedBlock.project_name}</td>
                </tr>
                <tr>
                  <th>Block Name</th>
                  <td>{selectedBlock.name}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <span
                      className={`badge ${selectedBlock.status === "active" ? "bg-success" : "bg-danger"
                        }`}
                    >
                      {selectedBlock.status}
                    </span>
                  </td>
                </tr>

                {selectedBlock.image && (
                  <tr>
                    <th>Image</th>
                    <td>
                      <img
                        src={`${imageAPIURL}/block/${selectedBlock.image}`}
                        alt={selectedBlock.name}
                        className="img-fluid rounded"
                        style={{ maxWidth: "200px" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/200x100/cccccc/333333?text=No+Image";
                        }}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Block</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateBlock}>
            <Form.Group className="mb-3" controlId="editBlockName">
              <Form.Label>Block Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editBlockStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={editFormData.status}
                onChange={handleEditFormChange}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="editBlockImage">
              <Form.Label>Block Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditFormChange}
                ref={imageInputRef}
              />
              {selectedBlock && selectedBlock.image && (
                <div className="mt-2">
                  <small className="text-muted">Current Image:</small>
                  <img
                    src={`${imageAPIURL}/block/${selectedBlock.image}`}
                    alt="Current Block"
                    className="img-thumbnail ms-2"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x50/cccccc/333333?text=No+Image"; }}
                  />
                </div>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "Updating..." : "Update Block"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                      variant={messageModalContent.type === 'btn-primary-custum' ? 'btn-primary-custum' : 'primary'}
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="danger"
                      onClick={closeCustomMessageModal}
                    >
                      Cancel
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
    </div>
  );
}

export default ActiveBlockList;
