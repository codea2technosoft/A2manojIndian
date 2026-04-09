import React, { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function AddDocument() {
  const [documentName, setDocumentName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
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


    if (!documentName.trim()) {
      showCustomMessageModal("Validation Error", "Please enter a document name.", "warning");
      return;
    }

    if (selectedFiles.length === 0) {
      showCustomMessageModal("Validation Error", "Please select at least one document to upload.", "warning");
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
      }
      );

      const result = await response.json();
      if (result.success == "1") {
        Swal.fire("Success", result.message || "Documents uploaded successfully!", "success").then(() => {
          navigate("/document-upload");
        });
        setDocumentName("");
        setSelectedFiles([]);

      } else {
        const errorData = await response.json();
        console.error("Upload failed:", errorData);

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
    <div class="card-body">
           <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={12} className="mb-4">
                <Form.Group controlId="formDocumentName">
                  <Form.Label className="block text-gray-700 text-sm font-bold mb-2">Document Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter document name"
                    value={documentName}
                    onChange={handleNameChange}
                    className=""
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label className="block text-gray-700 text-sm font-bold mb-2">Upload Documents</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className=""
                  />
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
              <Button
                type="submit"
                className=""
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  "Upload Documents"
                )}
              </Button>
            </div>
          </Form>
    </div>
</div>


   

      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-1/3 p-6 border-t-4"
            style={{ borderColor: messageModalContent.type === 'success' ? '#10B981' : messageModalContent.type === 'error' ? '#EF4444' : '#F59E0B' }}>
            <div className="flex justify-between items-center mb-4">
              <h5 className={`text-lg font-bold ${messageModalContent.type === 'success' ? 'text-green-600' : messageModalContent.type === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
                {messageModalContent.title}
              </h5>
              <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Close" onClick={closeCustomMessageModal}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="text-gray-700 mb-6">
              <p>{messageModalContent.text}</p>
            </div>
            <div className="flex justify-center">
              <Button
                variant={messageModalContent.type === 'success' ? 'success' : messageModalContent.type === 'error' ? 'danger' : 'primary'}
                onClick={closeCustomMessageModal}
                className={`py-2 px-4 rounded-lg font-semibold ${messageModalContent.type === 'success' ? 'bg-green-500 hover:bg-green-600' :
                  messageModalContent.type === 'error' ? 'bg-red-500 hover:bg-red-600' :
                    'bg-blue-500 hover:bg-blue-600'
                  } text-white transition duration-150 ease-in-out`}
              >
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
