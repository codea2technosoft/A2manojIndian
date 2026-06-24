import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Table, Pagination, Row, Col } from "react-bootstrap";

const LoanRemarkPage = () => {
  const { leadId, orderId, userId } = useParams();
  const [remarkList, setRemarkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [response, setResponse] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [responseError, setResponseError] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;
  const imageAPIURL = process.env.REACT_APP_Image_URL;

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };


  const fetchRemarks = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/loan-lead-response-list?lead_id=${leadId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success === "1") {
        setRemarkList(data.data || []);
      } else {
        setRemarkList([]);
      }
    } catch (err) {
      console.error("Error fetching remarks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRemarks();
  }, []);




  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);
      } catch (e) {
        console.log("Raw message:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setSocket(ws);

    return () => ws.close();
  }, []);



  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) {
      setResponseError("Response cannot be empty.");
      return;
    }
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("lead_id", leadId);
      formData.append("response", response);
      documentFile.forEach((file) => {
        formData.append("documents", file);
      });

      const res = await fetch(`${API_URL}/loan-lead-response-store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to store response.");
      setShowResponseModal(false);
      setResponse("");
      setResponseError("");
      fetchRemarks();
      showCustomMessageModal("Success", "Response added successfully!", "success");

      if (socket && socket.readyState === WebSocket.OPEN) {
        const notificationPayload = {
          user_id: userId,
          type: "loan_lead",
          message: `A response has been added for Loan Lead ${leadId}.`,
          statusremark: null,
          remark: response,
          order_id: orderId,
          action_by: "admin",
        };
        socket.send(JSON.stringify(notificationPayload));

        console.warn("WebSocket dddd", notificationPayload);

        console.warn("notificationPayload", notificationPayload);
      }


    } catch (error) {
      console.error("Error storing response:", error);
      showCustomMessageModal("Error", "Failed to add response.", "error");
    }
  };

  const handleShowResponseModal = () => {
    setShowResponseModal(true);
  };

  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const showCustomMessageModal = (title, text, type) => {
    setMessageModalContent({ title, text, type });
    setShowMessageModal(true);
  };


  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  var userType = localStorage.getItem("userType");

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Remarks for Loan #{leadId}</h3>
            </div>
            <div className="d-flex gap-2 align-items-center">
           
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={() => handleShowResponseModal()}
              >
                Add Remark
              </button>
                 <button
                className="btn submit_button d-flex align-items-center"
                onClick={() => navigate("/loan-list")}
              >
                Back
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading...</p>
          ) : remarkList.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Created By</th>
                    <th>Image</th>
                    <th>Remark Description</th>
                  </tr>
                </thead>
                <tbody>
                  {remarkList.map((remark, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="nowrap">{remark.date}</td>
                      <td className="nowrap">{remark.date_time?.split(" ")[1]}</td>
                      <td>{remark.created_by || "NA"}</td>
                      <td>
                        {remark.image ? (
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {remark.image.split(',').map((img, index) => (
                              <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                {img.toLowerCase().endsWith('.pdf') ? (
                                  <div style={{
                                    width: '100px',
                                    height: '100px',
                                    background: '#f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #ddd',
                                    position: 'relative'
                                  }}>
                                    <span>PDF</span>
                                  </div>
                                ) : (
                                  <img
                                    src={`${imageAPIURL}/loanlead/${img.trim()}`}
                                    alt={`Uploaded ${index + 1}`}
                                    style={{ width: "100px", height: "auto" }}
                                  />
                                )}
                                <a
                                  href={`${imageAPIURL}/loanlead/${img.trim()}`}
                                  download
                                  style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textDecoration: 'none',
                                    cursor: 'pointer'
                                  }}
                                  title="Download"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                  </svg>
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          "No Document"
                        )}
                      </td>
                      <td><textarea style={{width:"100% ",height:"100px"}} className="form-control">{remark.response}</textarea></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No remarks found for this lead.</p>
          )}
        </div>
      </div>


      <Modal show={showResponseModal} onHide={() => {
        setShowResponseModal(false);
        setDocumentFile([]);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Add Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleResponseSubmit}>
            <Form.Group controlId="responseTextArea">
              <Form.Label>Remark Description</Form.Label>
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
              {documentFile && documentFile.length > 0 && (
                <div className="mt-2">
                  <small className="text-muted">Selected files:</small>
                  <ul className="list-unstyled">
                    {documentFile.map((file, index) => (
                      <li key={index}>
                        <small>
                          {file.name} ({Math.round(file.size / 1024)} KB)
                        </small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={() => setShowResponseModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="ms-2">
                Save Remark
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>


      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${messageModalContent.type === 'success' ? 'border-success' : messageModalContent.type === 'error' ? '' : ''}`}>
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className={`modal-title ${messageModalContent.type === 'success' ? 'text-success' : messageModalContent.type === 'error' ? 'text-danger' : 'text-warning'}`}>
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

    </div>
  );
};

export default LoanRemarkPage;
