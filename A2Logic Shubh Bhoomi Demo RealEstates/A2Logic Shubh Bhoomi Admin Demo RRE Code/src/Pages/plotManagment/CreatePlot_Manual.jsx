import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const API_URL = process.env.REACT_APP_API_URL;

function CreatePlot() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    block_id: "",
    block_name: "",
    property_type: "", // Renamed from resgistry_patta
    plot_shop_villa_no: "",
    plot_size: "", // Keep as string for "50x40" format
    // plot_sqyd: "",
    plot_rate: "",
    plot_address: "",
    status: "available",
    plc_percentage: "",
    resgistry_date: "", // Initialize resgistry_date
    plot_hold: "", // Initialize plot_hold
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
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
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Effect to fetch projects list
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

  // Effect to fetch blocks list based on selected project
  useEffect(() => {
    const fetchBlocksList = async () => {
      if (formData.project_id) {
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

          const response = await fetch(`${API_URL}/block-list-plot`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ project_id: formData.project_id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal(
              "Error",
              errorData.message || "Failed to fetch blocks.",
              "error"
            );
            setBlocks([]); // Clear blocks on error
            return;
          }

          const data = await response.json();
          setBlocks(data.data || []);
        } catch (err) {
          console.error("Fetch blocks error:", err);
          showCustomMessageModal(
            "Error",
            err.message || "An unexpected error occurred while fetching blocks.",
            "error"
          );
          setBlocks([]); // Clear blocks on error
        } finally {
          setLoading(false);
        }
      } else {
        setBlocks([]);
        setFormData((prev) => ({ ...prev, block_id: "", block_name: "" }));
      }
    };

    fetchBlocksList();
  }, [formData.project_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === "project_id") {
        const selectedProjectObj = projects.find(
          (proj) => proj.id.toString() === value
        );
        newData.project_name = selectedProjectObj ? selectedProjectObj.name : "";
        newData.block_id = ""; // Reset block when project changes
        newData.block_name = ""; // Reset block name
        setSelectedProjectCommissionData(selectedProjectObj || null);
      } else if (name === "block_id") {
        const selectedBlockObj = blocks.find(
          (block) => block.id.toString() === value
        );
        newData.block_name = selectedBlockObj ? selectedBlockObj.name : "";
      }

      // Handle numerical inputs for plot_sqyd and plot_rate
      // if (name === "plot_sqyd" || name === "plot_rate") {
      //   newData[name] = value === "" ? "" : parseFloat(value);
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

    const directRequiredFields = [
      "project_id",
      "block_id",
      "property_type", // Now checking property_type
      "plot_shop_villa_no",
      "plot_size",
      // "plot_sqyd",
      "plot_rate",
      "plot_address",
      "road_size",
      "facing",
      "status"
    ];

    directRequiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && !formData[field].trim())
      ) {
        newErrors[field] = `${field
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())} is required.`;
        isValid = false;
      }
    });

    // Specific validation for plot_sqyd and plot_rate to be positive numbers
    // if (formData.plot_sqyd !== "" && (isNaN(formData.plot_sqyd) || parseFloat(formData.plot_sqyd) <= 0)) {
    //   newErrors.plot_sqyd = "Area Sq. Yd. must be a positive number.";
    //   isValid = false;
    // }

    if (formData.plot_rate !== "" && (isNaN(formData.plot_rate) || parseFloat(formData.plot_rate) <= 0)) {
      newErrors.plot_rate = "Rate must be a positive number.";
      isValid = false;
    }

    if (
      formData.project_id &&
      (!formData.project_name || !formData.project_name.trim())
    ) {
      newErrors.project_id =
        newErrors.project_id || "Selected project name could not be determined.";
      isValid = false;
    }
    if (
      formData.block_id &&
      (!formData.block_name || !formData.block_name.trim())
    ) {
      newErrors.block_id =
        newErrors.block_id || "Selected block name could not be determined.";
      isValid = false;
    }


    const dimensionPattern = /^\s*(\d+)\s*[xX]\s*(\d+)\s*$/;
    const dimensionFields = ["plot_size"];

    dimensionFields.forEach((field) => {
      const value = formData[field];
      if (value && !dimensionPattern.test(value)) {
        newErrors[field] = `${field
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())} must be in format like "50x40".`;
        isValid = false;
      }
    });



    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showCustomMessageModal(
        "Validation Error",
        "Please correct the errors in the form.",
        "error"
      );
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
        project_id: formData.project_id,
        project_name: formData.project_name,
        block_id: formData.block_id,
        block_name: formData.block_name,
        document_type: formData.property_type, // Corrected field name
        plot_shop_villa_no: formData.plot_shop_villa_no,
        dimension: formData.plot_size, // Send as string, not parseFloat
        // area_sqyd: parseFloat(formData.plot_sqyd),
        rate: parseFloat(formData.plot_rate),
        address: formData.plot_address,
        status: formData.status,
        road_size: formData.road_size,
        unit_type: formData.unit_type,
        facing: formData.facing,
        plc_percentage: formData.plc_percentage,
      };

      // Conditionally add resgistry_date to payload
      if (formData.property_type === "registry" || formData.property_type === "registrywithpatta") {
        payload.resgistry_date = formData.resgistry_date;
      }

      const response = await fetch(`${API_URL}/plot-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to create plot.",
          "error"
        );
        return;
      }

      const result = await response.json();
      showCustomMessageModal(
        "Success",
        result.message || "Plot created successfully!",
        "success"
      );

      // Reset form data after successful submission
      setFormData({
        project_id: "",
        project_name: "",
        block_id: "",
        block_name: "",
        property_type: "", // Reset this too
        plot_shop_villa_no: "",
        plot_size: "",
        // plot_sqyd: "",
        plot_rate: "",
        resgistry_date: "",
        plot_hold: "",
        plot_address: "",
        plc_percentage: "",
        road_size: "",
        unit_type: "",
        facing: "",
        status: "available", // Default status back to 'available'
      });
      setErrors({});
      setBlocks([]); // Clear blocks specific to the previous project
      setSelectedProjectCommissionData(null);

      setTimeout(() => {
        navigate("/all-plot");
      }, 2000);
    } catch (err) {
      console.error("Error creating plot:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // This function seems unused in the provided JSX for commission display.
  // Keeping it as is, but it's not impacting the form submission errors.
  const getCurrentCommission = () => {
    if (!selectedProjectCommissionData || !formData.property_type) return "N/A";

    switch (formData.property_type) {
      case "Resident":
        return `${selectedProjectCommissionData.resident_commission || 0}`;
      case "Commercial":
        return `${selectedProjectCommissionData.commercial_commission || 0}`;
      case "Corner Resident":
        return `${selectedProjectCommissionData.corner_resident_commission || 0
          }`;
      case "Corner Commercial":
        return `${selectedProjectCommissionData.corner_commercial_commission || 0
          }`;
      default:
        return "N/A";
    }
  };

  return (
    <div className="mt-2">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between flex-wrap-mobile gap-2">
                <div className="titlepage">
                  <h3>Create New Plot/Shop/Villa</h3>
                </div>
                <button
                  className="btn btn-primary d-flex gap-1"
                  onClick={() => navigate(-1)}
                >
                  <IoMdArrowRoundBack />
                  Back
                </button>
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
                        as="select" // Use Form.Control as="select" for better styling
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

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formBlockId">
                      <Form.Label>
                        Select Block <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="select" // Use Form.Control as="select"
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
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotShopVillaNo">
                      <Form.Label>
                        Plot/Shop/Villa No. <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="plot_shop_villa_no"
                        placeholder="e.g., A-101, Shop-5, Villa-B2"
                        value={formData.plot_shop_villa_no}
                        onChange={handleChange}
                        isInvalid={!!errors.plot_shop_villa_no}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.plot_shop_villa_no}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotSize">
                      <Form.Label>
                        Dimensions <span className="text-danger">*</span>
                        <span className="text-muted ms-2">(e.g., 50x40)</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="plot_size"
                        placeholder="e.g., 50x40"
                        value={formData.plot_size}
                        onChange={handleChange}
                        isInvalid={!!errors.plot_size}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.plot_size}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotSize">
                      <Form.Label>
                        PLC (%)
                        <span className="text-muted ms-2">(e.g., 50)</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="plc_percentage"
                        placeholder="e.g., 50"
                        value={formData.plc_percentage}
                        onChange={handleChange}
                        isInvalid={!!errors.plc_percentage}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.plc_percentage}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotSqYd">
                      <Form.Label>
                        Area Sq. Yd. <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="plot_sqyd"
                        placeholder="e.g., 133"
                        value={formData.plot_sqyd}
                        onChange={handleChange}
                        isInvalid={!!errors.plot_sqyd}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.plot_sqyd}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col> */}
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotSqYd">
                      <Form.Label>
                        Road Size <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="road_size"
                        placeholder="e.g., 30 feet"
                        value={formData.road_size}
                        onChange={handleChange}
                        isInvalid={!!errors.road_size}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.road_size}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotSqYd">
                      <Form.Label>
                        Unit Type
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="unit_type"
                        placeholder="e.g., corner"
                        value={formData.unit_type}
                        onChange={handleChange}
                        isInvalid={!!errors.unit_type}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.unit_type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  {/* <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotSqYd">
                      <Form.Label>
                        Facing <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="facing"
                        placeholder="e.g., east"
                        value={formData.facing}
                        onChange={handleChange}
                        isInvalid={!!errors.facing}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.facing}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col> */}


                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotFacing">
                      <Form.Label>
                        Facing <span className="text-danger">*</span>
                      </Form.Label>

                      <Form.Select
                        name="facing"
                        value={formData.facing}
                        onChange={handleChange}
                        isInvalid={!!errors.facing}
                      >
                        <option value="">Select Facing</option>
                        <option value="east">East</option>
                        <option value="west">West</option>
                        <option value="north">North</option>
                        <option value="south">South</option>
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        {errors.facing}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotRate">
                      <Form.Label>
                        Rate <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="plot_rate"
                        placeholder="e.g., 5000"
                        value={formData.plot_rate}
                        onChange={handleChange}
                        isInvalid={!!errors.plot_rate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.plot_rate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPropertyType">
                      <Form.Label>
                        Document Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="select" // Use Form.Control as="select"
                        name="property_type" // Changed name to property_type
                        value={formData.property_type}
                        onChange={handleChange}
                        isInvalid={!!errors.property_type}
                      >
                        <option value="">Select Option</option>
                        <option value="registry">Registry</option>
                        <option value="patta">Patta</option>
                        <option value="registrywithpatta">
                          Registry with Patta
                        </option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.property_type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formStatus">
                      <Form.Label>
                        Status <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="select" // Use Form.Control as="select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        isInvalid={!!errors.status}
                      >
                        <option value="available">Available</option>
                        <option value="sold">Sold</option> {/* Changed from inactive to sold for clarity */}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.status}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4" controlId="formPlotAddress">
                  <Form.Label>
                    Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="plot_address"
                    placeholder="Enter full plot address"
                    value={formData.plot_address}
                    onChange={handleChange}
                    isInvalid={!!errors.plot_address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.plot_address}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Plot"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${messageModalContent.type === "success"
                ? "border-success"
                : messageModalContent.type === "error"
                  ? "border-danger"
                  : "border-warning"
                }`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${messageModalContent.type === "success"
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
                    <Button variant="secondary" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                    <Button
                      variant={
                        messageModalContent.type === "warning" ? "warning" : "primary"
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

export default CreatePlot;