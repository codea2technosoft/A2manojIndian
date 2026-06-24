import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
const API_URL = process.env.REACT_APP_API_URL;

function CreateGallery() {

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
      newErrors.image = "Gallery image is required.";
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

      const response = await fetch(`${API_URL}/gallery-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,

        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create gallery image.");
      }

    const result = await response.json();
    if(result.success == '1')
      {
        Swal.fire("Success", result.message || "Gallery image created successfully!", "success").then(() => {
        navigate("/gallery-list");
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
      console.error("Error creating gallery image:", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row className="mt-2">
        <Col md={8} lg={12}>
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create New Gallery Image</h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formImage">
                  <Form.Label>Gallery Image</Form.Label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    isInvalid={!!errors.image}
                    className={errors.image ? "is-invalid" : ""}
                    ref={imageInputRef}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Status Select */}
                <Form.Group className="mb-4" controlId="formStatus">
                  <Form.Label>Status</Form.Label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    isInvalid={!!errors.status}
                    className={errors.status ? "is-invalid" : ""}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                  {loading ? "Creating..." : "Create Gallery Image"}
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

export default CreateGallery;