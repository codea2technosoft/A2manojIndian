import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Spinner,
} from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [editDocumentName, setEditDocumentName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [documentToDeleteId, setDocumentToDeleteId] = useState(null);

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

  const fetchDocuments = async (page = 1) => {
    setLoading(true);
    try {
      const authToken = getAuthToken();
      const headers = {
        "Content-Type": "application/json",
      };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${API_URL}/realstate-website-document-list?page=${page}&limit=${itemsPerPage}`,
        {
          method: "GET",
          headers: headers,
        },
      );

      if (response.ok) {
        const result = await response.json();
        setDocuments(result.data || []);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(page);
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch documents:", errorData);
        showCustomMessageModal(
          "Error",
          `Failed to fetch documents: ${errorData.message || response.statusText}`,
          "error",
        );
      }
    } catch (error) {
      console.error("Network or unexpected error during fetch:", error);
      showCustomMessageModal(
        "Error",
        `An unexpected error occurred: ${error.message}`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewClick = (document) => {
    setViewingDocument(document);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingDocument(null);
  };

  const handleEditClick = (document) => {
    setEditingDocument(document);
    setEditDocumentName(document.name);
    setSelectedFiles([]);
    setShowEditModal(true);
  };

  const handleUpdateDocument = async (event) => {
    event.preventDefault();
    if (!editingDocument) return;

    if (!editDocumentName.trim()) {
      showCustomMessageModal(
        "Validation Error",
        "Document name cannot be empty.",
        "warning",
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", editDocumentName);

    selectedFiles.forEach((file) => {
      formData.append("document", file);
    });

    try {
      const authToken = getAuthToken();
      const headers = {};
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${API_URL}/realstate-website-document-update/${editingDocument.id}`,
        {
          method: "POST",
          headers: headers,
          body: formData,
        },
      );

      if (response.ok) {
        showCustomMessageModal(
          "Success",
          "Document updated successfully!",
          "success",
        );
        setShowEditModal(false);
        fetchDocuments(currentPage);
      } else {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          `Update failed: ${errorData.message || response.statusText}`,
          "error",
        );
      }
    } catch (error) {
      console.error("Network or unexpected error during update:", error);
      showCustomMessageModal(
        "Error",
        `An unexpected error occurred during update: ${error.message}`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingDocument(null);
    setEditDocumentName("");
    setSelectedFiles([]);
  };

  const handleDeleteClick = (documentId) => {
    setDocumentToDeleteId(documentId);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDeleteId) return;

    setLoading(true);

    try {
      const authToken = getAuthToken();
      const headers = {};
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${API_URL}/realstate-website-document-delete/${documentToDeleteId}`,
        {
          method: "DELETE",
          headers: headers,
        },
      );

      if (response.ok) {
        showCustomMessageModal(
          "Success",
          "Document deleted successfully!",
          "success",
        );
        setShowDeleteConfirmModal(false);
        fetchDocuments(currentPage);
      } else {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          `Deletion failed: ${errorData.message || response.statusText}`,
          "error",
        );
      }
    } catch (error) {
      console.error("Network or unexpected error during delete:", error);
      showCustomMessageModal(
        "Error",
        `An unexpected error occurred during delete: ${error.message}`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(false);
    setDocumentToDeleteId(null);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  return (
    <div className="card mt-2">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="titlepage">
            <h3 className="mb-0">Document List</h3>
          </div>
          <Link to="/add-document" className="btn btn-primary">
            <FaPlus className="me-2" />
            Add Document
          </Link>
        </div>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
            <p className="mt-2">Loading documents...</p>
          </div>
        ) : documents && documents.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No documents found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Name</th>
                  <th>Document URL</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <Spinner animation="border" size="sm" />
                      <div>Loading...</div>
                    </td>
                  </tr>
                ) : documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <tr key={doc._id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{doc.name}</td>

                      <td>
                        {doc.image
                          ? doc.image.split(",").map((img, i) => (
                              <a
                                key={i}
                                href={`${imageAPIURL}/websiteDocumentUpload/${img.trim()}`}
                                target="_blank"
                              >
                                View File
                              </a>
                            ))
                          : "No Document"}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleViewClick(doc)}
                        >
                          <FaEye />
                        </button>

                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEditClick(doc)}
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteClick(doc.id)}
                        >
                          <RiDeleteBin3Fill />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-end mt-4">
            <Pagination className="d-flex">
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className=""
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                  className={`${index + 1 === currentPage ? "text-white" : "bg-white"}`}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className=""
              />
            </Pagination>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Document Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingDocument && (
            <>
              <p>
                <strong>Document Name:</strong> {viewingDocument.name}
              </p>
              <hr />
              <p>
                <strong>Files:</strong>
              </p>
              {viewingDocument.image && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {viewingDocument.image.split(",").map((img, index) => (
                    <div key={index} style={{ textAlign: "center" }}>
                      {img.toLowerCase().endsWith(".pdf") ? (
                        <div
                          style={{
                            width: "100px",
                            height: "100px",
                            background: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #ddd",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>PDF</span>
                        </div>
                      ) : (
                        <img
                          src={`${imageAPIURL}/websiteDocumentUpload/${img.trim()}`}
                          alt={`Document ${index + 1}`}
                          style={{
                            maxWidth: "100px",
                            height: "auto",
                            border: "1px solid #ddd",
                          }}
                        />
                      )}
                      <a
                        href={`${imageAPIURL}/websiteDocumentUpload/${img.trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-link mt-1"
                      >
                        Open File
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Document</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateDocument}>
          <Modal.Body>
            <Form.Group controlId="editDocumentName" className="mb-3">
              <Form.Label>Document Name</Form.Label>
              <Form.Control
                type="text"
                value={editDocumentName}
                onChange={(e) => setEditDocumentName(e.target.value)}
                placeholder="Enter new document name"
                required
              />
            </Form.Group>

            <Form.Group controlId="editDocumentFiles" className="mb-3">
              <Form.Label>Existing Document Files</Form.Label>
              {editingDocument && editingDocument.image ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {editingDocument.image.split(",").map((img, index) => (
                    <div key={index} style={{ textAlign: "center" }}>
                      {img.toLowerCase().endsWith(".pdf") ? (
                        <div
                          style={{
                            width: "100px",
                            height: "100px",
                            background: "#f5f5f5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #ddd",
                          }}
                        >
                          <span style={{ fontSize: "1.2rem" }}>PDF</span>
                        </div>
                      ) : (
                        <img
                          src={`${imageAPIURL}/websiteDocumentUpload/${img.trim()}`}
                          alt={`Document ${index + 1}`}
                          style={{
                            maxWidth: "100px",
                            height: "auto",
                            border: "1px solid #ddd",
                          }}
                        />
                      )}
                      <a
                        href={`${imageAPIURL}/websiteDocumentUpload/${img.trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-link mt-1"
                      >
                        Open File
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No existing files.</p>
              )}
            </Form.Group>

            <Form.Group controlId="newDocumentFiles">
              <Form.Label>Upload New Document Files (Optional)</Form.Label>
              <Form.Control type="file" multiple onChange={handleFileChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmModal}
        onHide={handleCloseDeleteConfirmModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this document? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirmModal}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Message Modal */}
      <Modal show={showMessageModal} onHide={closeCustomMessageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title
            className={
              messageModalContent.type === "success"
                ? "text-success"
                : messageModalContent.type === "warning"
                  ? "text-warning"
                  : "text-danger"
            }
          >
            {messageModalContent.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageModalContent.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeCustomMessageModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DocumentList;
