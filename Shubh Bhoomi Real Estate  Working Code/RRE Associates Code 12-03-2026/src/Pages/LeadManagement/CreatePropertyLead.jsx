import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function CreatePropertyLead() {
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
    lead_date: "",
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

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialProjectId = params.get("project_id") || "";

  const currentLocation = useLocation();
  const project_id = params.get("project_id");
  const block_id = params.get("block_id");
  const urlProjectId = params.get("project_id") || "";
  const urlBlockId = params.get("block_id") || "";
  const urlPlotId = params.get("plot_id") || "";
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [UserType, setUserType] = useState("");

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

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserId(data.data.id); 
          setUserName(data.data.username); 
          setUserType(data.data.user_type); 
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
  useEffect(() => {
    if (userId) {
    }
  }, [userId, userName]);

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

        const response = await fetch(`${API_URL}/property-lead-project-list`, {
          method: "POST",
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

        const matchedProject = data.data.find((project) => project.id == urlProjectId);

        setFormData((prev) => ({
          ...prev,
          project_name: matchedProject ? matchedProject.name : "",
        }));

      } catch (err) {
       
        showCustomMessageModal(
          "Error",
          err.message ||
          "An unexpected error occurred while fetching projects.",
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

          const response = await fetch(`${API_URL}/block-lead-project-list`, {
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

          const matchedBlock = data.data.find((block) => block.id == urlBlockId);

          setFormData((prev) => ({
            ...prev,
            block_name: matchedBlock ? matchedBlock.name : "",
          }));
        } catch (err) {
          console.error("Fetch blocks error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
            "An unexpected error occurred while fetching blocks.",
            "error"
          );
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
            showCustomMessageModal(
              "Error",
              errorData.message || "Failed to fetch units.",
              "error"
            );
            setPlots([]);
            return;
          }

          const data = await response.json();
          setPlots(data.data || []);
          const matchedPlot = data.data.find((plot) => plot.id == urlPlotId);

          setFormData((prev) => ({
            ...prev,
            plot_name: matchedPlot ? matchedPlot.plot_shop_villa_no : "",
          }));
        } catch (err) {
          console.error("Fetch units error:", err);
          showCustomMessageModal(
            "Error",
            err.message || "An unexpected error occurred while fetching units.",
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

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      console.log("✅ WebSocket connection established");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Message from server:", data);
      } catch (e) {
        console.log("📩 Raw message:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === "project_id") {
        const selectedProjectObj = projects.find(
          (proj) => proj.id.toString() === value
        );
        newData.project_name = selectedProjectObj
          ? selectedProjectObj.name
          : "";
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
        newData.plot_name = selectedPlotObj
          ? selectedPlotObj.plot_shop_villa_no
          : "";
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
      "pan_card_number",
      "lead_date",
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

    
    // if (!files.adharfront) {
    //   newErrors.adharfront = "Aadhar front image is required.";
    //   isValid = false;
    // }
    // if (!files.adharback) {
    //   newErrors.adharback = "Aadhar back image is required.";
    //   isValid = false;
    // }
    // if (!files.pancard) {
    //   newErrors.pancard = "PAN card image is required.";
    //   isValid = false;
    // }

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
      isValid = false;
    }

    if (
      formData.adhar_card_number &&
      !/^\d{12}$/.test(formData.adhar_card_number)
    ) {
      newErrors.adhar_card_number = "Aadhar card number must be 12 digits.";
      isValid = false;
    }

    if (!formData.pan_card_number) {
      newErrors.pan_card_number = "PAN Card number is required.";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_card_number)) {
      newErrors.pan_card_number =
        "Enter a valid PAN number (e.g., ABCDE1234F).";
    }

    if (
      formData.pan_card_number &&
      formData.pan_card_number.trim() !== "" &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.pan_card_number.trim())
    ) {
      newErrors.pan_card_number =
        "Invalid PAN card format. Example: ABCDE1234F";
      isValid = false;
    }

    if (!formData.lead_date) {
  newErrors.lead_date = "Lead date is required.";
  isValid = false;
}


    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        Swal.fire({
          title: "Authentication Error",
          text: "Please log in again.",
          icon: "error",
        });
        return;
      }

      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, formData[key]);
      });

      // Append files if available
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

      const result = await response.json();

      if (!response.ok) {
        console.log("Error Response:", result);
        Swal.fire({
          title: "Error",
          text: result.message || "Failed to create lead.",
          icon: "error",
        });
        return;
      }

      Swal.fire({
        title: "Success",
        text: result.message || "Lead created successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      if (socket && socket.readyState === WebSocket.OPEN) {
        const notificationPayload = {
          user_id: userId,
          type: "property_lead",
          message: `A new property lead has been created by ${userName} (${UserType}).`,
          action_by: `front${UserType}`,
          remark: `${formData.project_name}, ${formData.block_name}, ${formData.plot_name}`,
          statusremark: "",
          order_id: "",
          date: new Date().toISOString(),
        };

        socket.send(JSON.stringify(notificationPayload));
        console.log("📡 Notification sent via WebSocket");
      }

      // Reset form
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
        lead_date: "",
      });

      setFiles({
        adharfront: null,
        adharback: null,
        pancard: null,
      });

      setTimeout(() => navigate("/property-lead-list"), 2000);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Something went wrong!",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlProjectId) {
      setFormData((prev) => ({
        ...prev,
        project_id: urlProjectId,
      }));
    }
  }, [urlProjectId]);

  useEffect(() => {
    if (urlBlockId) {
      setFormData((prev) => ({
        ...prev,
        block_id: urlBlockId,
      }));
    }
  }, [urlBlockId]);

  useEffect(() => {
    if (urlPlotId) {
      setFormData((prev) => ({
        ...prev,
        plot_id: urlPlotId,
      }));
    }
  }, [urlPlotId]);

  const matchedPlots = plots.filter(
    (plot) => plot.id == urlPlotId 
  );
  const matchedBlocks = blocks.filter(
    (block) => block.id == urlBlockId 
  );
  const matchedProjects = projects.filter(
    (project) => project.id == urlProjectId
  );





  console.warn(urlPlotId);
  // alert(matchedPlots);

  return (
    <Container className="mt-3">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create Property Lead</h3>
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
                        value={String(formData.project_id || "")} // ensure string
                        onChange={handleChange}
                        isInvalid={!!errors.project_id}
                      >
                        {matchedProjects.map((project) => (
                          <option key={project.urlProjectId} value={project.urlProjectId}>
                            {project.name}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.project_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
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

                      >
                        {matchedBlocks.map((block) => (
                          <option key={block.urlBlockId} value={block.urlBlockId}>
                            {block.name}
                          </option>
                        ))}
                      </Form.Control>

                      <Form.Control.Feedback type="invalid">
                        {errors.block_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPlotId">
                      <Form.Label>
                        Select Units <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="plot_id"
                        value={formData.plot_id}
                        onChange={handleChange}
                        isInvalid={!!errors.plot_id}

                      >
                        {matchedPlots.map((plot) => (
                          <option key={plot.urlPlotId} value={plot.urlPlotId}>
                            {plot.plot_shop_villa_no}
                          </option>
                        ))}
                      </Form.Control>

                      <Form.Control.Feedback type="invalid">
                        {errors.plot_id}
                      </Form.Control.Feedback>
                    </Form.Group>
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
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, ""); // सिर्फ नंबर
                          if (onlyDigits.length <= 10) {
                            setFormData((prev) => ({
                              ...prev,
                              mobile: onlyDigits,
                            }));
                          }
                        }}
                        isInvalid={!!errors.mobile}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.mobile}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
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
                        <option value="business">
                          Self-employed / Business
                        </option>
                        <option value="salaried">Salaried (Job)</option>
                        <option value="rent">Rental Income</option>
                        <option value="pension">
                          Pension / Retirement Income
                        </option>
                        <option value="other">Other Sources</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.income_source}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                 
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formAdhar">
                      <Form.Label>
                        Aadhar Card Number{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="adhar_card_number"
                        placeholder="Enter 12-digit Aadhar number"
                        value={formData.adhar_card_number}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, "");
                          if (onlyDigits.length <= 12) {
                            setFormData((prev) => ({
                              ...prev,
                              adhar_card_number: onlyDigits,
                            }));
                          }
                        }}
                        isInvalid={!!errors.adhar_card_number}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.adhar_card_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  

                  <Col md={6}>
                    <Form.Group
                      className="mb-3"
                      controlId="formAdharFrontImage"
                    >
                      <Form.Label>
                        Aadhar Front Image 
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

                  {/* Adhar Back Image */}
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formAdharBackImage">
                      <Form.Label>
                        Aadhar Back Image 
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
                  
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPanCardNumber">
                      <Form.Label>
                        PAN Card Number <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="pan_card_number"
                        placeholder="Enter PAN Card number"
                        value={formData.pan_card_number}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "pan_card_number",
                              value: e.target.value.toUpperCase(), 
                            },
                          })
                        }
                        isInvalid={!!errors.pan_card_number}
                        maxLength={10}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pan_card_number}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>


                  {/* Pan Card Image */}
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formPanCardImage">
                      <Form.Label>
                        PAN Card Image 
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



                   <Col md={6}>
                    <Form.Group className="mb-3" controlId="formLeadDate">
                      <Form.Label>
                        Lead Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="lead_date"
                        value={formData.lead_date}
                        onChange={handleChange}
                        isInvalid={!!errors.lead_date}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lead_date}
                      </Form.Control.Feedback>
                      <small className="text-muted">
                        Select the date when this lead was generated
                      </small>
                    </Form.Group>
                  </Col>

                </Row>

                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Property Lead"}
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
              className={`modal-content border-top border-4 ${messageModalContent.type === "success"
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
                    <Button
                      variant="secondary"
                      onClick={closeCustomMessageModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={
                        messageModalContent.type === "warning"
                          ? "warning"
                          : "primary"
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

export default CreatePropertyLead;
