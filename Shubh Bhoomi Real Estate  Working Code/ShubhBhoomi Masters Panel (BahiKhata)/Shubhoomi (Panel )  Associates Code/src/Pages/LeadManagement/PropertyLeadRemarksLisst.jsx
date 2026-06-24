import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";

const PropertyLeadRemarksLisst = () => {
  const { leadId, orderId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [UserType, setUserType] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  const [remarkList, setRemarkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [documentFile, setDocumentFile] = useState([]);
  const [response, setResponse] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [responseError, setResponseError] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;
  const imageAPIURL = process.env.REACT_APP_IMAGE_API_URL;

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const fetchRemarks = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/property-lead-response-list?lead_id=${leadId}`,
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

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
    });
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

  // const handleResponseSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!response.trim()) {
  //     setResponseError("Response cannot be empty.");
  //     return;
  //   }
  //   try {
  //     const token = getAuthToken();
  //     const formData = new FormData();
  //     formData.append("lead_id", leadId);
  //     formData.append("response", response);
  //     if (documentFile) {
  //       formData.append("document", documentFile);
  //     }

  //     const res = await fetch(`${API_URL}/property-lead-response-store`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     if (!res.ok) throw new Error("Failed to store response.");
  //     setShowResponseModal(false);
  //     setResponse("");
  //     setResponseError("");
  //     fetchRemarks();
  //     showCustomMessageModal(
  //       "Success",
  //       "Response added successfully!",
  //       "success"
  //     );
  //   } catch (error) {
  //     console.error("Error storing response:", error);
  //     showCustomMessageModal("Error", "Failed to add response.", "error");
  //   }
  // };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) {
      setResponseError("Remark cannot be empty.");
      return;
    }
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("lead_id", leadId);
      formData.append("response", response);
      formData.append("order_id", orderId);
      // if (documentFile) {
      //   formData.append("document", documentFile);
      // }
      documentFile.forEach((file) => {
        formData.append("document", file);
      });

      const res = await fetch(`${API_URL}/property-lead-response-store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to store response.");

      const data = await res.json(); // <---- Parse JSON

      if (data.success == "1") {
        //  alert("Success block executed", data.message);
        setShowResponseModal(false);
        setResponse("");
        setResponseError("");
        fetchRemarks();
        // showCustomMessageModal(
        //   "Success",
        //   data.message || "Remark added successfully!",
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
            remark: response,
            order_id: orderId,
            statusremark: "",
            date: new Date().toISOString(),
          };

          socket.send(JSON.stringify(notificationPayload));
          console.log("📡 Notification sent via WebSocket");
        }
      } else {
        console.log("Failure block executed", data.message);
        showCustomMessageModal(
          "Error",
          data.message || "Failed to add response.",
          "error"
        );
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

  var userType = localStorage.getItem("userType");

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Remarks for Lead #{leadId}</h3>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={() => navigate("/property-lead-list")}
              >
                Back
              </button>
              <button
                className="btn btn-success d-flex align-items-center"
                onClick={() => handleShowResponseModal()}
              >
                Add Remark
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
                    <th>Image</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Created By</th>
                    <th>Remark Description</th>
                  </tr>
                </thead>
                <tbody>
                  {remarkList.map((remark, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      {/* <td>
                        {remark.image
                          ? (() => {
                              const fileUrl = `${imageAPIURL}/uploads/loanlead/${remark.image}`;
                              const ext = remark.image
                                .split(".")
                                .pop()
                                .toLowerCase();

                              if (ext === "pdf") {
                                return (
                                  <>
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ marginRight: "10px" }}
                                    >
                                      View PDF
                                    </a>
                                  </>
                                );
                              } else if (
                                ["jpg", "jpeg", "png", "gif", "bmp"].includes(
                                  ext
                                )
                              ) {
                                return (
                                  <>
                                    <img
                                      src={fileUrl}
                                      alt="Uploaded"
                                      style={{
                                        width: "100px",
                                        height: "auto",
                                        marginRight: "10px",
                                      }}
                                    />
                                    <br />
                                    <a href={fileUrl} download target="_blank">
                                      View Image
                                    </a>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <a
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ marginRight: "10px" }}
                                    >
                                      View File
                                    </a>
                                    <a href={fileUrl} download>
                                      Download File
                                    </a>
                                  </>
                                );
                              }
                            })()
                          : "No Image or File"}
                      </td> */}

                      <td>
                        {/* {remark.image ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            {remark.image.split(",").map((img, index) => (
                              <div
                                key={index}
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
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
                                      position: "relative",
                                    }}
                                  >
                                    <span>PDF</span>
                                  </div>
                                ) : (
                                  <img
                                    src={`${imageAPIURL}/uploads/loanlead/${img.trim()}`} // <-- FIXED
                                    alt={`Uploaded ${index + 1}`}
                                    style={{ width: "100px", height: "auto" }}
                                  />
                                )}
                                <a
                                  href={`${imageAPIURL}/uploads/loanlead/${img.trim()}`} // <-- FIXED
                                  download
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    background: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textDecoration: "none",
                                    cursor: "pointer",
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
                        )} */}
                        {remark.image ? (
                          <div className="remark-images">
                            {remark.image.split(",").map((img, index) => {
                              const trimmedImg = img.trim().toLowerCase();
                              const isPDF = trimmedImg.endsWith(".pdf");

                              return (
                                <div
                                  key={index}
                                  className="remark-image-wrapper"
                                >
                                  {isPDF ? (
                                    <div className="pdf-placeholder">
                                      <span>PDF</span>
                                    </div>
                                  ) : (
                                    <div className="image_all_design_new">
                                      <img
                                        src={`${imageAPIURL}/uploads/loanlead/${trimmedImg}`}
                                        alt={`Uploaded ${index + 1}`}
                                        className="remark-image"
                                      />
                                    </div>
                                  )}

                                  <a
                                    href={`${imageAPIURL}/uploads/loanlead/${trimmedImg}`}
                                    download
                                    className="download-btn"
                                    title="Download"
                                    target="_blank"
                                    rel="noopener noreferrer"
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
                                      <line
                                        x1="12"
                                        y1="15"
                                        x2="12"
                                        y2="3"
                                      ></line>
                                    </svg>
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span>No Files</span>
                        )}
                      </td>

                      <td className="nowrap">{remark.date}</td>
                      <td className="nowrap">
                        {remark.date_time?.split(" ")[1]}
                      </td>
                      <td>{remark.created_by || "NA"}</td>
                      <td>
                        <div className="table-cell-remark">
                          {toSentenceCase(remark.lead_response)}
                        </div>
                      </td>
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

      <Modal
        show={showResponseModal}
        onHide={() => setShowResponseModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleResponseSubmit}>
            <Form.Group controlId="responseTextArea" className="mb-3">
              <Form.Label>
                Remark Descriptions <span className="text-danger">*</span>
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

            {/* <Form.Group className="mb-3">
              <Form.Label>Document</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocumentFile(e.target.files[0])}
              />
              {documentFile && (
                <small className="text-muted">
                  Selected: {documentFile.name}
                </small>
              )}
            </Form.Group> */}

            <Form.Group className="mb-3">
              <Form.Label>Documents</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocumentFile(Array.from(e.target.files))}
                multiple
              />
              {/* {documentFile?.length > 0 && (
                <div className="mt-2">
                  <small className="text-muted">Selected files:</small>
                  <ul className="list-unstyled">
                    {documentFile.map((file, index) => (
                      <li key={index}>
                        <small>{file.name}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              <div className="row">
                {documentFile.map((file, index) => (
                  <React.Fragment
                    key={index}
                    className="me-2 mb-2 position-relative row"
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
                            width: "100%",
                            height: "100%",
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
                      <small
                        className="d-block text-truncate"
                        style={{ maxWidth: "100px" }}
                      >
                        {file.name}
                      </small>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" type="submit" className="">
                Submit
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
    </div>
  );
};

export default PropertyLeadRemarksLisst;
