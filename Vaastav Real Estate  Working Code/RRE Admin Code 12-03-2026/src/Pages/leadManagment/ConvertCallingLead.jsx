import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";


const API_URL = process.env.REACT_APP_API_URL;

function ConvertCallingLead() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    block_id: "",
    block_name: "",
    plot_id: "",
    plot_name: "",
    customer_name: "",
    mobile: "",
    income_source: "",
    adhar_card_number: "",
    pan_card_number: "",
  });

  const [files, setFiles] = useState({
    adharfront: null,
    adharback: null,
    pancard: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [plots, setPlots] = useState([]);
  const [userID, setUserID] = useState([]);


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

  const getAuthUser = () => {
    return localStorage.getItem("userType");
  };


  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;
        const res = await fetch(`${API_URL}/lead-csv-edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();
        if (res.ok && data?.status === "1" && data?.data?.length > 0) {
          const lead = data.data[0];
          setFormData((prev) => ({
            ...prev,
            id: lead.id,
            customer_name: lead.name || "",
            mobile: lead.mobile || "",
          }));
        } else {
          console.error("Failed to fetch lead details:", data?.message);
        }
      } catch (err) {
        console.error("Error fetching lead details:", err);
      }
    };

    if (id) fetchLeadDetails();
  }, [id]);


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
            setBlocks([]);
            setPlots([]);
            return;
          }

          const data = await response.json();
          setBlocks(data.data || []);
        } catch (err) {
          console.error("Fetch blocks error:", err);
          // showCustomMessageModal(
          //   "Error",
          //   err.message || "An unexpected error occurred while fetching blocks.",
          //   "error"
          // );
          setBlocks([]);
          setPlots([]);
        } finally {
          setLoading(false);
        }
      } else {
        setBlocks([]);
        setPlots([]);
        setFormData((prev) => ({
          ...prev,
          block_id: "",
          block_name: "",
          plot_id: "",
          plot_name: "",
        }));
      }
    };

    fetchBlocksList();
  }, [formData.project_id]);


  useEffect(() => {
    const fetchPlotsList = async () => {
      if (formData.block_id) {
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

          const response = await fetch(`${API_URL}/property-lead-plot-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ block_id: formData.block_id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            // showCustomMessageModal(
            //   "Error",
            //   errorData.message || "Failed to fetch plots.",
            //   "error"
            // );
            setPlots([]);
            return;
          }

          const data = await response.json();
          setPlots(data.data || []);
        } catch (err) {
          console.error("Fetch plots error:", err);
          showCustomMessageModal(
            "Error",
            err.message || "An unexpected error occurred while fetching plots.",
            "error"
          );
          setPlots([]);
        } finally {
          setLoading(false);
        }
      } else {
        setPlots([]);
        setFormData((prev) => ({
          ...prev,
          plot_id: "",
          plot_name: "",
        }));
      }
    };

    fetchPlotsList();
  }, [formData.block_id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === "project_id") {
        const selectedProjectObj = projects.find(
          (proj) => proj.id.toString() === value
        );
        newData.project_name = selectedProjectObj ? selectedProjectObj.name : "";
        newData.block_id = "";
        newData.block_name = "";
        newData.plot_id = "";
        newData.plot_name = "";
      } else if (name === "block_id") {
        const selectedBlockObj = blocks.find(
          (block) => block.id.toString() === value
        );
        newData.block_name = selectedBlockObj ? selectedBlockObj.name : "";
        newData.plot_id = "";
        newData.plot_name = "";
      } else if (name === "plot_id") {
        const selectedPlotObj = plots.find(
          (plot) => plot.id.toString() === value
        );
        newData.plot_name = selectedPlotObj ? selectedPlotObj.plot_shop_villa_no : "";
      }
      return newData;
    });

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: selectedFiles[0],
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const requiredFields = [
      "project_id",
      "block_id",
      "plot_id",
      "customer_name",
      "mobile",
      "income_source",
      "adhar_card_number",
    ];

    requiredFields.forEach((field) => {
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

    // File validation
    if (!files.adharfront) {
      newErrors.adharfront = "Adhar front image is required.";
      isValid = false;
    }
    if (!files.adharback) {
      newErrors.adharback = "Adhar back image is required.";
      isValid = false;
    }
    if (!files.pancard) {
      newErrors.pancard = "PAN card image is required.";
      isValid = false;
    }

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
      isValid = false;
    }

    if (formData.adhar_card_number && !/^\d{12}$/.test(formData.adhar_card_number)) {
      newErrors.adhar_card_number = "Adhar card number must be 12 digits.";
      isValid = false;
    }

    if (formData.pan_card_number && formData.pan_card_number.trim() !== "" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_card_number)) {
      newErrors.pan_card_number = "Invalid PAN card format.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  const fetchProfile = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserID(data.data.id);

    } catch (err) {
      console.error("Fetch Profile error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // const ws = new WebSocket("wss://realestatesocket.a2logicgroup.com");
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);
      } catch (e) {
        console.log("Raw message:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setSocket(ws);

    return () => ws.close();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "Form Incomplete",
        text: "Some required fields are missing or invalid. Please review the highlighted fields and try again.",
        confirmButtonText: "Got it!",
        confirmButtonColor: "#d33",
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

      const formPayload = new FormData();
      formPayload.append("project_id", formData.project_id);
      formPayload.append("project_name", formData.project_name);
      formPayload.append("block_id", formData.block_id);
      formPayload.append("block_name", formData.block_name);
      formPayload.append("plot_id", formData.plot_id);
      formPayload.append("plot_name", formData.plot_name);
      formPayload.append("customer_name", formData.customer_name);
      formPayload.append("mobile", formData.mobile);
      formPayload.append("income_source", formData.income_source);
      formPayload.append("adhar_card_number", formData.adhar_card_number);
      formPayload.append("pan_card_number", formData.pan_card_number);


      if (files.adharfront) formPayload.append("adharfront", files.adharfront);
      if (files.adharback) formPayload.append("adharback", files.adharback);
      if (files.pancard) formPayload.append("pancard", files.pancard);

      const response = await fetch(`${API_URL}/property-lead-create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to create lead.",
          "error"
        );
        return;
      }

      const result = await response.json();
      // showCustomMessageModal(
      //   "Success",
      //   result.message || "Calling Lead Converted Successfully !",
      //   "success"
      // );

      Swal.fire({
        title: "Success",
        text: result.message || "Calling Lead Converted Successfully!",
        icon: "success",
        timer: 3000,
        showConfirmButton: false
      });




      if (socket && socket.readyState === WebSocket.OPEN) {
        const notificationPayload = {
          user_id: userID,
          type: "property_lead",
          message: `A new property lead has been created for ${formData.customer_name}.`,
          action_by: "admin",
          date: new Date().toISOString()
        };
        socket.send(JSON.stringify(notificationPayload));
        console.log("📡 Notification sent via WebSocket");
      }

      setFormData({
        project_id: "",
        project_name: "",
        block_id: "",
        block_name: "",
        plot_id: "",
        plot_name: "",
        customer_name: "",
        mobile: "",
        income_source: "",
        adhar_card_number: "",
        pan_card_number: "",
      });
      setFiles({
        adharfront: null,
        adharback: null,
        pancard: null,
      });
      setErrors({});
      setBlocks([]);
      setPlots([]);

      setTimeout(() => {
        navigate("/lead-list");
      }, 2000);
    } catch (err) {
      console.error("Error creating lead:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container className="mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Convert Calling Lead To Property Lead</h3>
                </div>
                <div className="">
                  <button onClick={() => navigate(-1)} className="btn btn-primary">
                    ⬅ Back
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={4}>
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
                    </Form.Group>
                  </Col>

                  {/* Block Dropdown */}
                  <Col md={4}>
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
                        disabled={!formData.project_id || loading}
                      >
                        <option value="">Select a Block</option>
                        {blocks.length > 0 ? (
                          blocks.map((block) => (
                            <option key={block.id} value={block.id}>
                              {block.name}
                            </option>
                          ))
                        ) : (
                          <option value="NA">
                            NA
                          </option>
                        )}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.block_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Plot Dropdown */}
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formPlotId">
                      <Form.Label>
                        Select Plot <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="plot_id"
                        value={formData.plot_id}
                        onChange={handleChange}
                        isInvalid={!!errors.plot_id}
                        disabled={!formData.block_id || loading}
                      >
                        <option value="">Select a Plot</option>
                        {plots.length > 0 ? (
                          plots.map((plot) => (
                            <option key={plot.id} value={plot.id}>
                              {plot.plot_shop_villa_no}
                            </option>
                          ))
                        ) : (
                          <option value="NA">
                            NA
                          </option>
                        )}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.plot_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  {/* Customer Name */}
                  <Col md={12}>
                    <div className="card_title_all">
                      Custumer Details
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formCustomerName">
                      <Form.Label>
                        Customer Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="customer_name"
                        placeholder="Enter customer's full name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        isInvalid={!!errors.customer_name}
                        readOnly
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.customer_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Mobile Number */}
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formMobile">
                      <Form.Label>
                        Mobile Number <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="mobile"
                        placeholder="Enter 10-digit mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        isInvalid={!!errors.mobile}
                        readOnly
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.mobile}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <div className="card_title_all">
                      Custumer Document
                    </div>
                  </Col>
                  {/* Income Source */}
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formIncomeSource">
                      <Form.Label>
                        Income Source <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="income_source"
                        value={formData.income_source}
                        onChange={handleChange}
                        isInvalid={!!errors.income_source}
                      >
                        <option value="">Select Income Source</option>
                        <option value="business">Business</option>
                        <option value="salaried">Salaried</option>
                        <option value="rent">Rent</option>
                        <option value="pension">Pension</option>
                        <option value="other">Other</option>

                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.income_source}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Adhar Card Number */}
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formAdharCardNumber">
                      <Form.Label>
                        Adhar Card Number <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="adhar_card_number"
                        placeholder="Enter 12-digit Adhar Card number"
                        value={formData.adhar_card_number}
                        onChange={handleChange}
                        isInvalid={!!errors.adhar_card_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.adhar_card_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* PAN Card Number */}
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formPanCardNumber">
                      <Form.Label>
                        PAN Card Number
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="pan_card_number"
                        placeholder="Enter PAN Card number"
                        value={formData.pan_card_number}
                        onChange={handleChange}
                        isInvalid={!!errors.pan_card_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pan_card_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  {/* Adhar Front Image */}
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formAdharFrontImage">
                      <Form.Label>
                        Adhar Front Image <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="adharfront"
                        onChange={handleFileChange}
                        isInvalid={!!errors.adharfront}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.adharfront}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>


                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formAdharBackImage">
                      <Form.Label>
                        Adhar Back Image <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="adharback"
                        onChange={handleFileChange}
                        isInvalid={!!errors.adharback}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.adharback}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>


                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formPanCardImage">
                      <Form.Label>
                        PAN Card Image <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="pancard"
                        onChange={handleFileChange}
                        isInvalid={!!errors.pancard}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pancard}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Convert To Property Lead"}
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
                    <Button variant="danger" onClick={closeCustomMessageModal}>
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
    </Container>
  );
}

export default ConvertCallingLead;