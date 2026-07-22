import React, { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Testimonial() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    degination: "",
    rating: "",
    description: "",
    image: null,
    video_clips_reels: null,
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

  const imageInputRef = useRef(null);
  const videoClipsReelsInputRef = useRef(null);

  const showCustomMessageModal = (title, text, type) => {
    setMessageModalContent({ title, text, type, confirmAction: null });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

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

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prevData) => ({
      ...prevData,
      description: data,
    }));
    if (errors.description) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description: null,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Image size should be less than 5MB",
        }));
        return;
      }
      
      // Validate image type
      if (!file.type.startsWith('image/')) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Please upload a valid image file",
        }));
        return;
      }
      
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
    
    if (errors.image) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: null,
      }));
    }
  };

  const handleVideoClipsReelsChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate video clips/reels size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          video_clips_reels: "Video/Reel size should be less than 100MB",
        }));
        return;
      }
      
      // Validate video type for both clips and reels
      const validVideoTypes = [
        'video/mp4', 
        'video/mov', 
        'video/avi', 
        'video/wmv', 
        'video/flv',
        'video/quicktime',
        'video/x-msvideo'
      ];
      
      if (!validVideoTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          video_clips_reels: "Please upload MP4, MOV, AVI, WMV, or FLV video files only",
        }));
        return;
      }
      
      setFormData((prevData) => ({
        ...prevData,
        video_clips_reels: file,
      }));
    }
    
    if (errors.video_clips_reels) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        video_clips_reels: null,
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!formData.degination.trim()) {
      newErrors.designation = "Designation is required.";
      isValid = false;
    }
    if (!formData.rating || isNaN(formData.rating) || parseFloat(formData.rating) < 1 || parseFloat(formData.rating) > 5) {
      newErrors.rating = "Rating must be a number between 1 and 5.";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    }
    if (!formData.image) {
      newErrors.image = "Image is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("degination", formData.degination);
    data.append("rating", formData.rating);
    data.append("description", formData.description);
    
    if (formData.image) {
      data.append("image", formData.image);
    }
    
    if (formData.video_clips_reels) {
      data.append("vedioclips_reels", formData.video_clips_reels);
    }

    try {
      const response = await fetch(`${API_URL}/testimonial-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success == '1') {
          showCustomMessageModal("Success", result.message || "Testimonial created successfully!", "success")
          setFormData({
            name: "",
            degination: "",
            rating: "",
            description: "",
            image: null,
            video_clips_reels: null,
          });
          
          // Clear all file inputs
          if (imageInputRef.current) imageInputRef.current.value = "";
          if (videoClipsReelsInputRef.current) videoClipsReelsInputRef.current.value = "";
          
          setTimeout(() => {
            navigate("/testimonial-list");
          }, 3000);
        }

      } else {
        const errorData = await response.json();
        showCustomMessageModal("Error", errorData.message || "Failed to create testimonial.", "error");
      }
    } catch (err) {
      console.error("Error creating testimonial:", err);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Create New Testimonial</h3>
            </div>
            <div className="d-flex">
            </div>
          </div>
        </div>
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    placeholder="Enter name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDesignation">
                  <Form.Label>Designation <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="degination"
                    value={formData.degination}
                    onChange={handleChange}
                    isInvalid={!!errors.degination}
                    placeholder="e.g., CEO, Customer"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.degination}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formRating">
                  <Form.Label>Rating (1-5) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    isInvalid={!!errors.rating}
                    min="1"
                    max="5"
                    step="1"
                    placeholder="Enter rating (1 to 5)"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rating}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formImage">
                  <Form.Label>Image <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    isInvalid={!!errors.image}
                    ref={imageInputRef}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Max size: 5MB, Supported formats: JPEG, PNG, GIF
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3" controlId="formVideoClipsReels">
                  <Form.Label>Video Clips / Reels (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    name="video_clips_reels"
                    accept="video/*"
                    onChange={handleVideoClipsReelsChange}
                    isInvalid={!!errors.video_clips_reels}
                    ref={videoClipsReelsInputRef}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.video_clips_reels}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Max size: 100MB, Supported formats: MP4, MOV, AVI, WMV, FLV
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4" controlId="formDescription">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              {errors.description && (
                <div className="text-danger mt-1" style={{ fontSize: "0.875em" }}>
                  {errors.description}
                </div>
              )}
            </Form.Group>

            <div className="submitbutton">
              <Button
                type="submit"
                className="submitbutton_design"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  "Create Testimonial"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>

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
                <Button
                  variant={messageModalContent.type === 'success' ? 'success' : messageModalContent.type === 'error' ? 'danger' : 'primary'}
                  onClick={closeCustomMessageModal}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Testimonial;