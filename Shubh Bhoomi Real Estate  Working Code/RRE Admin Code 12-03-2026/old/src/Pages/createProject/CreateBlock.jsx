import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Card, Modal } from "react-bootstrap"; 
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CreateBlock() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectId: "",
    projectName: "",
    blockName: "", 
    status: "active",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const imageInputRef = useRef(null);

 
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
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const fetchProjectsList = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        if (!token) {
          showCustomMessageModal("Authentication Required", "Please log in to create a block.", "error");
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/project-list-block`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          showCustomMessageModal("Fetch Error", errorData.message || "Failed to load projects.", "error");
          return;
        }

        const data = await response.json();
        setProjects(data.data || []);
      } catch (err) {
        console.error("Fetch projects error:", err);
        showCustomMessageModal("Network Error", "An unexpected error occurred while fetching projects.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsList();
  }, [navigate]); 

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else if (name === "projectId") {
      const selectedProject = projects.find(proj => proj.id.toString() === value);
      setFormData((prevData) => ({
        ...prevData,
        projectId: value,
        projectName: selectedProject ? selectedProject.name : "",
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

    if (!formData.projectId) {
      newErrors.projectId = "Please select a project.";
      isValid = false;
    }

    
    if (!formData.blockName.trim()) {
      newErrors.blockName = "Block Name is required.";
      isValid = false;
    }

    if (!formData.image) {
      newErrors.image = "Block image is required.";
      isValid = false;
    }

   
    if (!formData.status || (formData.status !== "active" && formData.status !== "inactive")) {
      newErrors.status = "Please select a valid status.";
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
        showCustomMessageModal("Authentication Required", "Please log in to create a block.", "error");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("project_id", formData.projectId);
      formDataToSend.append("project_name", formData.projectName);
      formDataToSend.append("name", formData.blockName); 
      formDataToSend.append("status", formData.status);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(`${API_URL}/block-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal("Creation Failed", errorData.message || "Failed to create block.", "error");
        return;
      }

      const result = await response.json();
      showCustomMessageModal("Success", result.message || "Block created successfully!", "success");
      setFormData({
        projectId: "",
        projectName: "",
        blockName: "",
        status: "active",
        image: null,
      });
      setErrors({}); 
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      setTimeout(() => {
        navigate("/all-block-list");
      }, 2000); 

    } catch (err) {
      console.error("Error creating block:", err);
      showCustomMessageModal("Network Error", "An unexpected error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <Card className="shadow-lg rounded-3">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create New Block</h3>
                </div>
              </div>
            </div>

            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formProjectId">
                  <Form.Label>Select Project <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="select" 
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    isInvalid={!!errors.projectId} 
                    disabled={loading || projects.length === 0}
                  >
                    <option value="">Select a Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.projectId}
                  </Form.Control.Feedback>
                  {loading && projects.length === 0 && (
                    <small className="text-muted">Loading projects...</small>
                  )}
                  {!loading && projects.length === 0 && (
                    <small className="text-danger">No projects available. Please create one first.</small>
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBlockName">
                  <Form.Label>Block Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text"
                    name="blockName" 
                    placeholder="Enter block name"
                    value={formData.blockName} 
                    onChange={handleChange}
                    isInvalid={!!errors.blockName} 
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.blockName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formStatus">
                  <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    as="select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    isInvalid={!!errors.status}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.status}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formImage">
                  <Form.Label>Block Image <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    isInvalid={!!errors.image}
                    ref={imageInputRef}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Block"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
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
                {messageModalContent.confirmAction ? (
                  <>
                    <Button variant="secondary" onClick={closeCustomMessageModal}>
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
}

export default CreateBlock;