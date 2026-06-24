import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

const API_URL = process.env.REACT_APP_API_URL;
function CreateChannel() {
  const [formData, setFormData] = useState({
   
    username: "",
    mobile: "",
    whatsapp_number: "",
    email: "",
    parent_id: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [mobile, setMobile] = useState("");

  const stateOptions = states.map((state) => ({
    value: state.id,
    label: state.name,
  }));

  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: city.name,
  }));

  const navigate = useNavigate();
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
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
    });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          showCustomMessageModal(
            "Authentication Error",
            "Authentication token not found. Please log in.",
            "error"
          );
          return;
        }

        const response = await fetch(`${API_URL}/state-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          showCustomMessageModal(
            "Error",
            errorData.message || "Failed to fetch states.",
            "error"
          );
          return;
        }
        const data = await response.json();
        setStates(data.data || []);
      } catch (err) {
        console.error("Fetch states error:", err);
        showCustomMessageModal(
          "Error",
          err.message || "An unexpected error occurred while fetching states.",
          "error"
        );
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (formData.state) {
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error"
            );
            return;
          }
          const response = await fetch(`${API_URL}/city-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ state_id: formData.state }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal(
              "Error",
              errorData.message || "Failed to fetch cities.",
              "error"
            );
            setCities([]);
            return;
          }

          const data = await response.json();
          setCities(data.data || []);
        } catch (err) {
          console.error("Fetch cities error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
              "An unexpected error occurred while fetching cities.",
            "error"
          );
          setCities([]);
        }
      } else {
        setCities([]);
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    };

    fetchCities();
  }, [formData.state]);

  const handleChange = (e) => {
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
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    const requiredFields = [
      "username",
      "mobile",
      "email",
      "whatsapp_number",
    ];
  requiredFields.forEach((field) => {
  const value = (formData[field] || "").toString().trim(); // ✅ safe conversion
  if (!value) {
    newErrors[field] = `${field
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())} is required.`;
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

    if (
      formData.whatsapp_number &&
      !/^\d{10}$/.test(formData.whatsapp_number)
    ) {
      newErrors.whatsapp_number = "WhatsApp number must be 10 digits.";
      isValid = false;
    }

   


    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill out all required fields.",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!formData.parent_id || formData.parent_id.length !== 10) {
      Swal.fire("Error", "Invalid or missing Parent ID.", "error");
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        return;
      }

      const payload = {
        status: "",
        username: formData.username,
        mobile: formData.mobile,
        password: "",
        address: "",
        state: "",
        city: "",
        area: "",
        pincode: "",
        whatsapp_number: formData.whatsapp_number,
        email: formData.email,
        dob: "",
        parent_id: formData.parent_id,
        pan_number: "",
        rera_number: "",
      };


      console.log("Sending payload:", payload);
      const response = await fetch(`${API_URL}/channel-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || result.status === false) {
        Swal.fire(
          "Error",
          result.message || "Failed to create channel",
          "error"
        );
        return;
      }

      if (
        typeof result.message === "string" &&
        result.message.toLowerCase().includes("invalid parent")
      ) {
        Swal.fire("Error", result.message, "error");
        return;
      }
      Swal.fire({
        icon: "success",
        title: "Success",
        text: result.message || "Channel created successfully!",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/all-channel-list");
      });
      setFormData({
        status: "active",
        username: "",
        mobile: "",
        password: "",
        address: "",
        state: "",
        city: "",
        area: "",
        pincode: "",
        whatsapp_number: "",
        email: "",
        dob: "",
        marriage_anniversary_date: "",
        pan_number: "",
        rera_number: "",
        parent_id: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Error creating channel:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok && data.status === "1") {
          const parentId = data.data.mobile;
          setMobile(parentId);
          setFormData((prev) => ({
            ...prev,
            parent_id: parentId,
          }));
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Create New Channel Partner</h3>
            </div>
            <div className="backbutton">
              <Link to="/all-channel-list">Back</Link>
            </div>
          </div>
        </div>
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Row>
              

              <Col md={6}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>
                    Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter Name"
                    value={formData.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
               <Col md={6}>
                <Form.Group className="mb-3" controlId="formMobile">
                  <Form.Label>
                    Mobile Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    placeholder="Enter mobile number (10 digits)"
                    value={formData.mobile}
                    onChange={handleChange}
                    isInvalid={!!errors.mobile}
                    maxLength="10"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobile}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
             

            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>
                    Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="formWhatsappNumber">
                  <Form.Label>
                    WhatsApp Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="whatsapp_number"
                    placeholder="Enter WhatsApp number (10 digits)"
                    value={formData.whatsapp_number}
                    onChange={handleChange}
                    isInvalid={!!errors.whatsapp_number}
                    maxLength="10"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.whatsapp_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            
            <Form.Group className="mb-3">
              <Form.Label>
                Parent ID <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="parent_id"
                placeholder="Enter parent ID"
                value={formData.parent_id}
                onChange={handleChange}
                disabled
              />
            </Form.Group>

            <div className="submitbutton">
              <button
                type="submit"
                className="submitbutton_design"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Channel Partner"}
              </button>
            </div>
          </Form>
        </div>
      </div>

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
}

export default CreateChannel;
