import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaEdit } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

function CreateTicketSupport() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    status: "open",
    subject: "",
    assigned_to: "Admin",
    priority: "",
    description: "",
    attachment: null,
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachment") {
      const file = files[0];
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];

      if (file && !allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          attachment: "Only PDF, JPG, JPEG, PNG files are allowed",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        attachment: file,
      }));

      setErrors((prev) => ({
        ...prev,
        attachment: "",
      }));

      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.subject)
      newErrors.subject = "Subject is required";

    if (!formData.priority)
      newErrors.priority = "Priority is required";

    if (!formData.description)
      newErrors.description = "Description is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const token = getAuthToken();

      if (!token)
        throw new Error("Authentication token not found.");
      const sendData = new FormData();

      sendData.append("status", formData.status);
      sendData.append("subject", formData.subject);
      sendData.append("assigned_to", formData.assigned_to);
      sendData.append("priority", formData.priority);
      sendData.append("description", formData.description);

      if (formData.attachment) {
        sendData.append("attachment", formData.attachment);
      }

      const response = await fetch(
        `${API_URL}/create-ticket-support`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: sendData,
        }
      );

      const result = await response.json();

      if (response.ok && result.status == "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message || "Support ticket created successfully",
        }).then(() => {
          navigate("/created-ticket-support-list");
        });

        setFormData({
          status: "open",
          subject: "",
          assigned_to: "1",
          priority: "",
          description: "",
          attachment: null,
        });

        setErrors({});
      } else {
        Swal.fire(
          "Error",
          result.message || "Something went wrong",
          "error"
        );
      }
    } catch (err) {
      console.error(err);

      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding_15">
      <div className="row">
        <div className="col-md-12 col-12 col-sm-12">
          <div className="card">
            <div className="card-header bg-gradientcolor">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create Ticket Support</h3>
                </div>
                  <Link
                to="/created-ticket-support-list"
                className="btn btn-secondary d-inline-flex align-items-center"
              >
                ← Go To Ticket Lists
              </Link>
              </div>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Subject */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ticket  Subject <span style={{ color: "red" }}>*</span></Form.Label>

                      <Form.Control
                        type="text"
                        name="subject"
                        placeholder="Enter Subject"
                        value={formData.subject}
                        onChange={handleChange}
                        isInvalid={!!errors.subject}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.subject}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ticket  Assign To (Admin) <span style={{ color: "red" }}>*</span></Form.Label>

                      <Form.Select
                        name="assigned_to"
                        value={formData.assigned_to}
                        disabled
                      >
                        <option value="1">Admin
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ticket  Priority <span style={{ color: "red" }}>*</span></Form.Label>

                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        isInvalid={!!errors.priority}
                      >
                        <option value="">
                          Select Priority 
                        </option>
                        <option value="low">Low</option>
                        <option value="medium">
                          Medium
                        </option>
                        <option value="high">High</option>
                        <option value="urgent">
                          Urgent
                        </option>
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        {errors.priority}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Status */}
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ticket  Status <span style={{ color: "red" }}>*</span></Form.Label>

                      <Form.Select
                        name="status"
                        value={formData.status}
                        disabled
                      >
                        <option value="open">
                          Open
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ticket  Description <span style={{ color: "red" }}>*</span></Form.Label>

                      <Form.Control
                        as="textarea"
                        name="description"
                        rows={4}
                        placeholder="Enter Ticket (Issues Description) Minimum 500 Characters."
                        value={formData.description}
                        onChange={handleChange}
                        isInvalid={!!errors.description}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Ticket  Upload File (PDF/Image) <span style={{ color: "red" }}>*</span>
                      </Form.Label>

                      <Form.Control
                        type="file"
                        name="attachment"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleChange}
                        isInvalid={!!errors.attachment}
                      />
                      <Form.Text className="text-muted">
                        Allowed: PDF, JPG, JPEG, PNG
                      </Form.Text>

                      <Form.Control.Feedback type="invalid">
                        {errors.attachment}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="d-grid">
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="success"
                    >
                      {loading
                        ? "Creating Ticket..."
                        : "Create Ticket"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTicketSupport;