import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function AddDocument() {
  const [documentName, setDocumentName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const [errors, setErrors] = useState({
    documentName: "",
    files: ""
  });

  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
  });

  const navigate = useNavigate();

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

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleNameChange = (event) => {
    setDocumentName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let newErrors = {
      documentName: "",
      files: ""
    };

    if (!documentName.trim()) {
      newErrors.documentName = "Document name is required";
    }

    if (selectedFiles.length === 0) {
      newErrors.files = "Please select at least one file";
    }

    setErrors(newErrors);

    if (newErrors.documentName || newErrors.files) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", documentName);

    selectedFiles.forEach((file) => {
      formData.append("document", file);
    });

    try {
      const authToken = getAuthToken();
      const headers = {};

      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_URL}/realstate-website-document-upload`, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      const result = await response.json();

      if (result.success == "1") {
        Swal.fire("Success", result.message || "Documents uploaded successfully!", "success")
          .then(() => {
            navigate("/document-upload");
          });

        setDocumentName("");
        setSelectedFiles([]);
        setErrors({ documentName: "", files: "" });

      } else {
        console.error("Upload failed:", result);
      }

    } catch (error) {
      console.error("Network or unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="titlepage">
              <h3 className="mb-0">Add Official Documents</h3>
            </div>
          </div>
        </div>

        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={12} className="mb-4">
                <Form.Group controlId="formDocumentName">
                  <Form.Label>Document Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter document name"
                    value={documentName}
                    onChange={handleNameChange}
                  />

                  {/* Error */}
                  {errors.documentName && (
                    <div style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                      {errors.documentName}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label>Upload Documents</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileChange}
                  />

                  {/* Error */}
                  {errors.files && (
                    <div style={{ color: "red", fontSize: "13px", marginTop: "5px" }}>
                      {errors.files}
                    </div>
                  )}

                  {selectedFiles.length > 0 && (
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Selected files:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {selectedFiles.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Upload Documents"}
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Modal (unchanged) */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/3 p-6 border-t-4">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-bold">
                {messageModalContent.title}
              </h5>
              <button onClick={closeCustomMessageModal}>X</button>
            </div>
            <div className="text-gray-700 mb-6">
              <p>{messageModalContent.text}</p>
            </div>
            <div className="flex justify-center">
              <Button onClick={closeCustomMessageModal}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddDocument;