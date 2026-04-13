import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CreateBanner() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: null,
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

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

    if (!formData.image) {
      newErrors.image = "Banner image is required.";
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = "Status is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Swal.fire({
      //   icon: "error",
      //   title: "Validation Error",
      //   text: "Please correct the errors in the form.",
      // });
      return;
    }
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("image", formData.image);
      formDataToSend.append("status", formData.status);

      const response = await fetch(`${API_URL}/banner-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create banner.");
      }


      const result = await response.json();

      if (result.success == '1') {
       
        Swal.fire("Success", result.message || "Banner created successfully!", "success").then(() => {
          navigate("/banner-list");
        });
        setFormData({
          image: null,
          status: "active",
        });
        setErrors({});
        if (imageInputRef.current) {
          imageInputRef.current.value = "";
        }

      }

    } catch (err) {
      console.error("Error creating banner:", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row className="">
        <Col md={8} lg={12}>
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create New Banner</h3>
                </div>
                <div className="d-flex">

                </div>
              </div>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3" controlId="formImage">
                  <Form.Label>Banner Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    isInvalid={!!errors.image}
                    ref={imageInputRef}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    isInvalid={!!errors.status}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.status}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="submitbutton">
                  <button
                    type="submit"
                    className="submitbutton_design"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Banner"}
                  </button>
                </div>
              </Form>
            </div>
          </div>

        </Col>
      </Row>
    </>
  );
}

export default CreateBanner;