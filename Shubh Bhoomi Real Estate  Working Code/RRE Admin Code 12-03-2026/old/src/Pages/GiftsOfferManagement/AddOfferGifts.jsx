import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from 'react-select';
import callingleads from "../../assets/images/offer-gifts-format.csv";

const API_URL = process.env.REACT_APP_API_URL;

function CreatePlot() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_id: [],
    project_name: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

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
    const fetchProjectsList = async () => {
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

        const response = await fetch(`${API_URL}/project-list-block`, {
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
            errorData.message || "Failed to fetch projects.",
            "error"
          );
          return;
        }

        const data = await response.json();
        setProjects(data.data || []);
      } catch (err) {
        console.error("Fetch projects error:", err);
        showCustomMessageModal(
          "Error",
          err.message || "An unexpected error occurred while fetching projects.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsList();
  }, []);

  // Convert projects to react-select format
  const projectOptions = projects.map(project => ({
    value: project.id,
    label: project.name
  }));

  const handleProjectChange = (selected) => {
    setSelectedOptions(selected || []);

    // Extract IDs and Names from selected options
    const projectIds = selected.map(option => option.value);
    const projectNames = selected.map(option => option.label);

    setFormData({
      project_id: projectIds,
      project_name: projectNames
    });

    // Clear errors if any
    if (errors.project_id) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        project_id: null,
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (formData.project_id.length === 0) {
      newErrors.project_id = "Please select at least one project.";
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
        text: "Please correct the errors in the form.",
      });
      return;
    }

    if (!file) {
      Swal.fire({
        icon: "error",
        title: "No CSV File",
        text: "Please select a CSV file before submitting.",
      });
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

      // ✅ Method 1: JSON.stringify se arrays bhejna
      const uploadData = new FormData();
      uploadData.append("giftCsv", file);
      uploadData.append("project_id", JSON.stringify(formData.project_id));
      uploadData.append("project_name", JSON.stringify(formData.project_name));

      // ✅ Method 2: Agar backend ko comma separated values chahiye
      // uploadData.append("project_id", formData.project_id.join(','));
      // uploadData.append("project_name", formData.project_name.join(','));

      console.log("Project IDs Array:", formData.project_id);
      console.log("Project Names Array:", formData.project_name);
      console.log("JSON Project IDs:", JSON.stringify(formData.project_id));
      console.log("JSON Project Names:", JSON.stringify(formData.project_name));

      const response = await fetch(`${API_URL}/gift-create-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to create Offer.",
          "error"
        );
        return;
      }

      const result = await response.json();
      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message,
          confirmButtonText: "OK",
        });

        setFormData({
          project_id: [],
          project_name: [],
        });
        setSelectedOptions([]);
        setErrors({});
        setFile(null);

        setTimeout(() => {
          navigate("/all-offer-gifts");
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Something went wrong!",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error("Error creating offer:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Custom styles for react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: errors.project_id ? '#dc3545' : '#ced4da',
      '&:hover': {
        borderColor: errors.project_id ? '#dc3545' : '#ced4da'
      },
      boxShadow: 'none',
      minHeight: '38px'
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#007bff',
      color: 'white',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'white',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: 'white',
      ':hover': {
        backgroundColor: '#dc3545',
        color: 'white',
      },
    }),
  };

  return (
    <Container className="mt-2">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="titlepage">
                  <h3>Create New Offer/Gifts</h3>
                </div>

                <div className="d-flex justify-content-between">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Download Offer/Gifts Format</Tooltip>}
                  >
                    <a
                      href={callingleads}
                      className="btn btn-primary"
                      download="Offer Gifts Creation Format.csv"
                    >
                      Download Excel Format
                    </a>
                  </OverlayTrigger>
                </div>
              </div>
            </div>

            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formProjectId">
                      <Form.Label>
                        Select Projects <span className="text-danger">*</span>
                      </Form.Label>
                      
                      <Select
                        isMulti
                        options={projectOptions}
                        value={selectedOptions}
                        onChange={handleProjectChange}
                        styles={customStyles}
                        isDisabled={loading || projects.length === 0}
                        placeholder="Select projects..."
                        noOptionsMessage={() => "No projects available"}
                        loadingMessage={() => "Loading projects..."}
                        isSearchable={true}
                        closeMenuOnSelect={false}
                      />
                      
                      {errors.project_id && (
                        <div className="text-danger small mt-1">
                          {errors.project_id}
                        </div>
                      )}
                      
                      {loading && projects.length === 0 && (
                        <small className="text-muted">
                          Loading projects...
                        </small>
                      )}
                      
                      {!loading && projects.length === 0 && (
                        <small className="text-danger">
                          No projects available. Please create one first.
                        </small>
                      )}

                      {/* Debug Info */}
                      {/* <div className="mt-2 p-2 bg-light rounded">
                        <small className="text-muted">
                          <strong>Selected Projects:</strong><br />
                          IDs: [{formData.project_id.join(', ')}]<br />
                          Names: [{formData.project_name.join(', ')}]
                        </small>
                      </div> */}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formFile">
                      <Form.Label>
                        Upload CSV File <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          if (!selectedFile) return;

                          const fileExtension = selectedFile.name
                            .split(".")
                            .pop()
                            .toLowerCase();
                          if (fileExtension !== "csv") {
                            Swal.fire({
                              icon: "error",
                              title: "Invalid File",
                              text: "Only CSV files are allowed!",
                            });
                            e.target.value = null;
                            setFile(null);
                            return;
                          }
                          setFile(selectedFile);
                        }}
                      />
                      <Form.Text className="text-muted">
                        Please upload a CSV file in the correct format.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design mt-2"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Offer"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default CreatePlot;