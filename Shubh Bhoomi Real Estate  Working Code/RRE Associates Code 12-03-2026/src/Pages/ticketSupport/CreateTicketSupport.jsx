import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

function CreateTicketSupport() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const [formData, setFormData] = useState({
    status: "open",
    subject: "",
    assigned_to: "",
    priority: "",
    description: "",
  });



  const validate = () => {
    let newErrors = {};

    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.assigned_to) newErrors.assigned_to = "Please select admin";
    if (!formData.priority) newErrors.priority = "Priority is required";
    if (!formData.description) newErrors.description = "Description is required";

    setErrors(newErrors);

    // Agar errors empty hai to true return karo
    return Object.keys(newErrors).length === 0;
  };




  const [loading, setLoading] = useState(false);
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // 👈 validation fail ho to API call nahi hogi

    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`${API_URL}/create-ticket-support`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success === "1") {
        Swal.fire("Success", result.message, "success").then(() => {
          navigate("/allTicketsLists");
        });

        setFormData({
          status: "open",
          subject: "",
          assigned_to: "",
          priority: "",
          description: "",
        });
        setErrors({});
      } else {
        Swal.fire("Error", result.message || "Something went wrong", "error");
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
              </div>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
            <Row>
              {/* Subject */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="Enter Subject"
                    value={formData.subject || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.subject}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.subject}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Assigned To */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assign To (Admin)</Form.Label>
                  <Form.Select
                    name="assigned_to"
                    value={formData.assigned_to || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.assigned_to}
                  >
                    <option value="">Select Admin</option>
                    <option value="1">Ram (123)</option>
                    <option value="2">Shyam (123)</option>
                    <option value="3">Mohan (123)</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.assigned_to}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              

              {/* Priority */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.priority}
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.priority}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Status */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status || "open"}
                    onChange={handleChange}
                  >
                    <option value="open">Open</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Description */}
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={4}
                    placeholder="Enter Description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              

              {/* Submit */}
              <Col md={12} className="d-grid">
                <Button type="submit" disabled={loading} variant="success">
                  {loading ? "Creating Ticket..." : "Create Ticket"}
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