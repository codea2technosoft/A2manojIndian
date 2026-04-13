import React, { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Blog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  const imageInputRef = useRef(null);

  const showCustomModal = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const closeCustomModal = () => {
    setShowModal(false);
    setModalMessage("");
    setModalType("success");
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Blog title is required.";
    if (!description.trim()) newErrors.description = "Blog description is required.";
    if (!image) newErrors.image = "A blog image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle single image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: null }));
    }
  };

  // Remove single image
  const removeImage = () => {
    setImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = ""; // Clear the file input element
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      // showCustomModal("Please correct the errors in the form.", "error");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    const authToken = getAuthToken();

    if (!authToken) {
      showCustomModal("Authentication Error", "Authentication token not found. Please log in.", "error");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/blog-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          // 'Content-Type': 'multipart/form-data' is NOT needed with FormData
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success == '1') {
          showCustomModal(result.message || "Blog post created successfully!", "success");
          setTitle("");
          setDescription("");
          setImage(null);
          if (imageInputRef.current) {
            imageInputRef.current.value = "";
          }
          setTimeout(() => {
          navigate("/blog-list");
        }, 3000);

        }

      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to create blog post.";
        showCustomModal(`Error: ${errorMessage}`, "error");
      }
    } catch (error) {
      showCustomModal(`An unexpected error occurred: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="padding_15">
      <div className="card">
          <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Create New Blog Post</h3>
            </div>
            
          </div>
        </div>
        <div className="card-body">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="blogTitle">
          <Form.Label>Title <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: null }));
            }}
            placeholder="Enter blog title"
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="blogDescription">
          <Form.Label>Description <span className="text-danger">*</span></Form.Label>
          {/* <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: null }));
              }
            }}
            config={{
              toolbar: [
                'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                'undo', 'redo'
              ],
              licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTQ0MzgzOTksImp0aSI6Ijk4MGNlZTU4LTA0ZTUtNDVkMi1iZmI4LWZmZTNjNjMwNjA4MCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjVmZjc5NDUxIn0.0ckOvFDI8r8h1g0YVW4Vlx4PmiF2bYkIaAqdSYuM_8RC8Wl3cO4jIfkMAd57z6Fo_6JPmlmDfLjafu4EnnByzQ',
            }}
          /> */}

            <Form.Control
                 as="textarea"
                  name="description"
                  value={description}
 onChange={(e) => {
              setDescription(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: null }));
            }}
                            />
          {errors.description && <div className="text-danger mt-1" style={{ fontSize: '0.875em' }}>{errors.description}</div>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="blogImage">
          <Form.Label>Blog Image <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            isInvalid={!!errors.image}
            ref={imageInputRef}
          />
          <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
          {image && (
            <div className="mt-2 position-relative d-inline-block">
              <img
                src={URL.createObjectURL(image)}
                alt="Blog Image Preview"
                className="img-thumbnail"
                style={{ width: "150px", height: "100px", objectFit: "cover" }}
              />
              <Button
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                onClick={removeImage}
                style={{ cursor: "pointer" }}
              >
                X
              </Button>
            </div>
          )}
        </Form.Group>

        <div className="submitbutton">
          <Button  type="submit" className="submitbutton_design" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Creating Blog Post...
            </>
          ) : (
            "Create Blog Post"
          )}
        </Button>
        </div>
      </Form>
        </div>
      </div>



      <Modal show={showModal} onHide={closeCustomModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className={modalType === 'success' ? 'text-success' : 'text-danger'}>
            {modalType === 'success' ? 'Success!' : 'Error!'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant={modalType === 'success' ? 'success' : 'danger'}
            onClick={closeCustomModal}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Blog;
