import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

function CreateAssociate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    parent_id: "",
    whatsapp_number: "",
    email: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const [parentName, setParentName] = useState("");
  const [checkingParentId, setCheckingParentId] = useState(false);

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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }

    if (name === "parent_id" && value.length === 10) {
      setCheckingParentId(true);
      setParentName("");
      try {
        const token = getAuthToken();
        if (!token) {
          showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
          setCheckingParentId(false);
          return;
        }

        const payload = {
          parentid: value,
          type: "associate"
        };

        const response = await fetch(`${API_URL}/check-parentid-name`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.status === "1" && data.data && data.data.username) {
          setParentName(data.data.username);
          setErrors((prevErrors) => ({
            ...prevErrors,
            parent_id: null,
          }));
        } else {
          setParentName("");

          setErrors((prevErrors) => ({
            ...prevErrors,
            parent_id: data.message || "Invalid Parent ID or Parent not found.",
          }));
        }
      } catch (err) {
        console.error("Error checking parent ID:", err);
        setParentName("");
        setErrors((prevErrors) => ({
          ...prevErrors,
          parent_id: "Failed to verify Parent ID. Please try again.",
        }));
      } finally {
        setCheckingParentId(false);
      }
    } else if (name === "parent_id" && value.length !== 10) {
      setParentName("");
      setErrors((prevErrors) => ({
        ...prevErrors,
        parent_id: "Parent ID must be 10 digits.",
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    const requiredFields = [
      "username", "mobile", "whatsapp_number", "parent_id", "email"
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} is required.`;
        isValid = false;
      }
    });


    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
      isValid = false;
    }

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
      isValid = false;
    }

    if (formData.whatsapp_number && !/^\d{10}$/.test(formData.whatsapp_number)) {
      newErrors.whatsapp_number = "WhatsApp number must be 10 digits.";
      isValid = false;
    }

    if (formData.parent_id && !/^\d{10}$/.test(formData.parent_id)) {
      newErrors.parent_id = "Parent ID must be 10 digits.";
      isValid = false;
    } else if (formData.parent_id && !parentName && !checkingParentId) {
      newErrors.parent_id = "Invalid Parent ID or Parent not found.";
      isValid = false;
    }
    // ✅ Date validation (key = "dob")
    if (!formData.dob || formData.dob.trim() === "") {
      newErrors.dob = "Date of birth is required";
    } else {
      const selectedDate = new Date(formData.dob);
      const today = new Date();

      // ignore time part
      // ✅ Date validation (future date allowed)
      if (!formData.dob || formData.dob.trim() === "") {
        newErrors.dob = "Date is required";
      } else {
        const selectedDate = new Date(formData.dob);

        if (isNaN(selectedDate.getTime())) {
          newErrors.dob = "Invalid date format (YYYY-MM-DD)";
        }
        // ✅ Future date check removed
      }

    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        whatsapp_number: formData.whatsapp_number,
        parent_id: formData.parent_id,
        dob: formData.dob,

      };

      const response = await fetch(`${API_URL}/Associate-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to create associate.", "error");
        return;
      }

      const result = await response.json();
      console.warn("associate", result)
      if (result.success == '1') {
        showCustomMessageModal("Success", result.message || "Associate has been created successfully", "success");
        setFormData({
          username: "",
          email: "",
          mobile: "",
          whatsapp_number: "",
          dob: "",
          parent_id: "",
        });
        setErrors({});
        setParentName("");
        setTimeout(() => {
          navigate("/all-associate-list");
        }, 3000);
      }
      else {
        showCustomMessageModal("Error", result.message || "Something went wrong", "error");
      }

    } catch (err) {
      console.error("Error creating associate:", err);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg rounded-3 mt-2">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Create New Associate</h3>
            </div>
            <div className="d-flex">

            </div>
          </div>
        </div>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter Name"
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? "is-invalid" : ""}
                  />
                  {errors.username && (
                    <div className="invalid-feedback d-block">
                      {errors.username}
                    </div>
                  )}
                </Form.Group>
              </Col>


              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "is-invalid" : ""}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>



            </Row>

            <Row>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="formMobile">
                  <Form.Label>Mobile Number <span className="text-danger">*</span></Form.Label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Enter mobile number (10 digits)"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={errors.mobile ? "is-invalid" : ""}
                    maxLength="10"
                  />
                  {errors.mobile && (
                    <div className="invalid-feedback d-block">
                      {errors.mobile}
                    </div>
                  )}
                </Form.Group>
              </Col>


              <Col md={6}>
                <Form.Group className="mb-3" controlId="formWhatsappNumber">
                  <Form.Label>WhatsApp Number <span className="text-danger">*</span></Form.Label>
                  <input
                    type="tel"
                    name="whatsapp_number"
                    placeholder="Enter WhatsApp number (10 digits)"
                    value={formData.whatsapp_number}
                    onChange={handleChange}
                    className={errors.whatsapp_number ? "is-invalid" : ""}
                    maxLength="10"
                  />
                  {errors.whatsapp_number && (
                    <div className="invalid-feedback d-block">
                      {errors.whatsapp_number}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDob">
                  <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={errors.dob ? "is-invalid" : ""}
                  />
                  {errors.dob && (
                    <div className="invalid-feedback d-block">
                      {errors.dob}
                    </div>
                  )}
                </Form.Group>
              </Col>




              <Col md={6}>
                <Form.Group className="mb-4" controlId="formParentId">
                  <Form.Label>
                    Parent ID <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="parent_id"
                    placeholder="Enter parent ID"
                    value={formData.parent_id}
                    onChange={handleChange}
                    isInvalid={!!errors.parent_id}
                    className={errors.parent_id ? "is-invalid" : ""}
                    maxLength="10"
                  />
                  {checkingParentId && <Form.Text className="text-muted">Checking Parent ID...</Form.Text>}
                  {parentName && !errors.parent_id && (
                    <Form.Text className="text-success">Parent Name: {parentName}</Form.Text>
                  )}
                  <Form.Control.Feedback type="invalid">
                    {errors.parent_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="submitbutton">
              <button
                type="submit"
                className="submitbutton_design"
                disabled={loading || checkingParentId}
              >
                {loading ? "Creating..." : "Create Associate"}
              </button>
            </div>
          </Form>
        </Card.Body>
      </Card>
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
    </>
  );
}

export default CreateAssociate;