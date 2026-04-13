import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import callingleads from "../../assets/images/block_creation_format.csv";
import { FaFileDownload } from "react-icons/fa";
const API_URL = process.env.REACT_APP_API_URL;

function CreatePlot() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    // block_id: "",
    // block_name: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [file, setFile] = useState(null);
  // const [blocks, setBlocks] = useState([]);

  const [selectedProjectCommissionData, setSelectedProjectCommissionData] =
    useState(null);

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
            "error",
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
            "error",
          );
          return;
        }

        const data = await response.json();
        setProjects(data.data || []);
      } catch (err) {
        console.error("Fetch projects error:", err);
        showCustomMessageModal(
          "Error",
          err.message ||
            "An unexpected error occurred while fetching projects.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsList();
  }, []);

  // useEffect(() => {
  //   const fetchBlocksList = async () => {
  //     if (formData.project_id) {
  //       setLoading(true);
  //       try {
  //         const token = getAuthToken();
  //         if (!token) {
  //           showCustomMessageModal(
  //             "Authentication Error",
  //             "Authentication token not found. Please log in.",
  //             "error"
  //           );
  //           return;
  //         }

  //         const response = await fetch(`${API_URL}/block-list-plot`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //           body: JSON.stringify({ project_id: formData.project_id }),
  //         });

  //         if (!response.ok) {
  //           const errorData = await response.json();
  //           showCustomMessageModal(
  //             "Error",
  //             errorData.message || "Failed to fetch blocks.",
  //             "error"
  //           );
  //           setBlocks([]);
  //           return;
  //         }

  //         const data = await response.json();
  //         setBlocks(data.data || []);
  //       } catch (err) {
  //         console.error("Fetch blocks error:", err);
  //         showCustomMessageModal(
  //           "Error",
  //           err.message || "An unexpected error occurred while fetching blocks.",
  //           "error"
  //         );
  //         setBlocks([]);
  //       } finally {
  //         setLoading(false);
  //       }
  //     } else {
  //       setBlocks([]);
  //       setFormData((prev) => ({ ...prev, block_id: "", block_name: "" }));
  //     }
  //   };

  //   fetchBlocksList();
  // }, [formData.project_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === "project_id") {
        const selectedProjectObj = projects.find(
          (proj) => proj.id.toString() === value,
        );
        newData.project_name = selectedProjectObj
          ? selectedProjectObj.name
          : "";
        // newData.block_id = "";
        // newData.block_name = "";
        setSelectedProjectCommissionData(selectedProjectObj || null);
      }
      // else if (name === "block_id") {
      //   const selectedBlockObj = blocks.find(
      //     (block) => block.id.toString() === value
      //   );
      //   newData.block_name = selectedBlockObj ? selectedBlockObj.name : "";
      // }

      return newData;
    });

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

    const directRequiredFields = ["project_id", "block_id"];

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showCustomMessageModal(
        "Validation Error",
        "Please correct the errors in the form.",
        "error",
      );
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
          "error",
        );
        return;
      }

      const uploadData = new FormData();
      uploadData.append("blockCsv", file);
      uploadData.append("project_id", formData.project_id);
      uploadData.append("project_name", formData.project_name);
      // uploadData.append("block_id", formData.block_id);
      // uploadData.append("block_name", formData.block_name);
      if (
        formData.property_type === "registry" ||
        formData.property_type === "registrywithpatta"
      ) {
        uploadData.append("resgistry_date", formData.resgistry_date || "");
      }

      const response = await fetch(`${API_URL}/block-import`, {
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
          errorData.message || "Failed to create plot.",
          "error",
        );
        return;
      }

      const result = await response.json();
      if (result.status == "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message,
          confirmButtonText: "OK",
        });

        setFormData({
          project_id: "",
          project_name: "",
          block_id: "",
          block_name: "",
        });
        setErrors({});
        // setBlocks([]);
        setSelectedProjectCommissionData(null);
        setFile(null);

        setTimeout(() => {
          navigate("/all-block-list");
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
      console.error("Error creating plot:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Create New Blocks</h3>
            </div>

            <div className="d-flex justify-content-between">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Download Blocks Creation CSV Format</Tooltip>}
              >
                <a
                  href={callingleads}
                  className="btn btn-primary"
                  download="Blocks Creation Format.csv"
                >
                  Download CSV Format
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
                    Select Project <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="project_id"
                    value={formData.project_id}
                    onChange={handleChange}
                    isInvalid={!!errors.project_id}
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
                    {errors.project_id}
                  </Form.Control.Feedback>
                  {loading && projects.length === 0 && (
                    <small className="text-muted">Loading projects...</small>
                  )}
                  {!loading && projects.length === 0 && (
                    <small className="text-danger">
                      No projects available. Please create one first.
                    </small>
                  )}
                </Form.Group>
              </Col>

              {/* <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBlockId">
                      <Form.Label>
                        Select Block <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="block_id"
                        value={formData.block_id}
                        onChange={handleChange}
                        isInvalid={!!errors.block_id}
                        disabled={!formData.project_id || loading || blocks.length === 0}
                      >
                        <option value="">Select a Block</option>
                        {blocks.map((block) => (
                          <option key={block.id} value={block.id}>
                            {block.name}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.block_id}
                      </Form.Control.Feedback>
                      {formData.project_id && loading && blocks.length === 0 && (
                        <small className="text-muted">Loading blocks...</small>
                      )}
                      {formData.project_id && !loading && blocks.length === 0 && (
                        <small className="text-danger">
                          No blocks available for this project. Please create one
                          first.
                        </small>
                      )}
                    </Form.Group>
                  </Col> */}
            </Row>
            <input
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
            <div className="submitbutton">
              <Button
                type="submit"
                className="submitbutton_design mt-2"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Blocks"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreatePlot;
