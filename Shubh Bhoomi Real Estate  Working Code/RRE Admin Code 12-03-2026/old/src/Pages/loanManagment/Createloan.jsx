import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Createloan() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    service: "",
    customer_name: "",
    mobile: "",
    income_source: "",
    adhar_number: "",
    pan_card_number: "",
    state: "",
    state_name: "",
    city: "",
    monthly_income: "",
    monthly_emi: "",
    cibil_score: "No",
    cibil_score_value: "",
    require_loan_amount: "",
    pincode: "",
    location: "",
  });

  const [files, setFiles] = useState({
    adhar_front_image: null,
    adhar_back_image: null,
    pan_card_image: null,
    current_residence_proof: null,
    permanent_address_proof: null,
    employeeProof_bussinessRegistration: null,
    salary_slip: null,
    itr: null,
    form16: null,
    bank_statement: null,
    bank_statement_current_account: null,
    gst_return: null,
    property_paper: null,
  });

  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userID, setUserID] = useState([]);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  useEffect(() => {
    const fetchStates = async () => {
      const token = getAuthToken();
      if (!token) {
        return;
      }
      try {
        const statesResponse = await fetch(`${API_URL}/state-list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const statesData = await statesResponse.json();

        console.warn("statesData", statesData);

        if (statesData.status == "1") {
          setStatesList(statesData.data);
        } else {
          console.error("Failed to fetch states:", statesData.message);

        }
      } catch (error) {
        console.error("Error fetching states:", error);

      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedStateId) {
        const token = getAuthToken();
        if (!token) {
          return;
        }

        try {
          const citiesResponse = await fetch(`${API_URL}/city-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ state_id: selectedStateId }),
          });
          const citiesData = await citiesResponse.json();
          if (citiesResponse.ok && citiesData.status === "1") {
            setCitiesList(citiesData.data);
          } else {
            setCitiesList([]);
            console.error("Failed to fetch cities:", citiesData.message);

          }
        } catch (error) {
          setCitiesList([]);
          console.error("Error fetching cities:", error);

        }
      } else {
        setCitiesList([]);
      }
    };

    fetchCities();
  }, [selectedStateId]);



  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {

        const categoriesResponse = await fetch(`${API_URL}/loan-lead-category-list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.status === "1") {
          setCategoriesList(categoriesData.data);
        } else {
          console.error("Failed to fetch categories:", categoriesData.message);
        }


        const servicesResponse = await fetch(`${API_URL}/loan-lead-service-list`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const servicesData = await servicesResponse.json();
        if (servicesData.status === "1") {
          setServicesList(servicesData.data);
        } else {
          console.error("Failed to fetch services:", servicesData.message);
        }
      } catch (error) {
        console.error("Error fetching categories or services:", error);
      }
    };

    fetchCategoriesAndServices();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0],
    }));
  };

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

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const requiredFields = [
      "category",
      "service",
      "customer_name",
      "mobile",
      "income_source",
      "adhar_number",
      "state",
      "city",
      "monthly_income",
      "require_loan_amount",
      "pincode",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = `${field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())} is required.`;
        isValid = false;
      }
    });

    const requiredFiles = ["adhar_front_image", "adhar_back_image", "pan_card_image", "current_residence_proof", "permanent_address_proof"];
    requiredFiles.forEach((fileField) => {
      if (!files[fileField]) {
        newErrors[fileField] = `${fileField.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())} is required.`;
        isValid = false;
      }
    });

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
      isValid = false;
    }

    if (formData.adhar_number && !/^\d{12}$/.test(formData.adhar_number)) {
      newErrors.adhar_number = "Adhar card number must be 12 digits.";
      isValid = false;
    }

    if (formData.pan_card_number && formData.pan_card_number.trim() !== "" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_card_number)) {
      newErrors.pan_card_number = "Invalid PAN card format.";
      isValid = false;
    }

    if (formData.monthly_income && isNaN(formData.monthly_income)) {
      newErrors.monthly_income = "Monthly income must be a number.";
      isValid = false;
    }

    if (formData.monthly_emi && isNaN(formData.monthly_emi)) {
      newErrors.monthly_emi = "Monthly EMI must be a number.";
      isValid = false;
    }

    if (formData.require_loan_amount && isNaN(formData.require_loan_amount)) {
      newErrors.require_loan_amount = "Required loan amount must be a number.";
      isValid = false;
    }

    if (formData.cibil_score === "Yes" && (!formData.cibil_score_value || isNaN(formData.cibil_score_value))) {
      newErrors.cibil_score_value = "Cibil Score Value is required when CIBIL score is 'Yes'.";
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
        navigate("/login");
        return;
      }

      const formPayload = new FormData();
      Object.keys(formData).forEach((key) => {
        formPayload.append(key, formData[key]);
      });
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          formPayload.append(key, files[key]);
        }
      });

      for (let [key, value] of formPayload.entries()) {
        console.log(key, value);
      }

      if (!formData.state_name && formData.state) {
        const stateName = statesList.find(s => s.id.toString() === formData.state.toString())?.name || "";
        formPayload.append("state_name", stateName);
      }

      if (!formData.city_name && formData.city) {
        const cityName = citiesList.find(c => c.id.toString() === formData.city.toString())?.name || "";
        formPayload.append("city_name", cityName);
      }

      const now = new Date();
      // formPayload.append("date", now.toLocaleDateString());
      // formPayload.append("date_time", now.toLocaleString());
      // formPayload.append("status", "Pending");

      const response = await fetch(`${API_URL}/loan-lead-create`, {
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
          errorData.message || "Failed to create loan lead.",
          "error"
        );
        return;
      }

      const result = await response.json();
      showCustomMessageModal(
        "Success",
        result.message || "Loan lead created successfully!",
        "success"
      );


      if (socket && socket.readyState === WebSocket.OPEN) {
        const notificationPayload = {
          user_id: userID,
          type: "loan_lead",
          message: `A new Load lead has been created for ${formData.customer_name}.`,
          action_by: "admin",
          date: new Date().toISOString()
        };
        socket.send(JSON.stringify(notificationPayload));
        console.log("📡 Notification sent via WebSocket");
      }


      setFormData({
        category: "",
        service: "",
        customer_name: "",
        mobile: "",
        income_source: "",
        adhar_number: "",
        pan_card_number: "",
        state: "",
        state_name: "",
        city: "",
        city_name: "",
        monthly_income: "",
        monthly_emi: "",
        cibil_score: "No",
        cibil_score_value: "",
        require_loan_amount: "",
        pincode: "",
        location: "",
      });
      setFiles({
        adhar_front_image: null,
        adhar_back_image: null,
        pan_card_image: null,
        current_residence_proof: null,
        permanent_address_proof: null,
        employeeProof_bussinessRegistration: null,
        salary_slip: null,
        itr: null,
        form16: null,
        bank_statement: null,
        bank_statement_current_account: null,
        gst_return: null,
        property_paper: null,
      });
      setErrors({});

      setTimeout(() => {
        navigate("/loan-list");
      }, 2000);
    } catch (err) {
      console.error("Error creating loan lead:", err);
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
    <Container className="mt-5 formselectnewdesign">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create Loan Lead</h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              <Form onSubmit={handleSubmit}>
                <div className="card_title_all mb-3">Loan Details</div>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formCategory">
                      <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="select"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        isInvalid={!!errors.category}
                      >
                        <option value="">Select Category</option>
                        {categoriesList.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formService">
                      <Form.Label>Service <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="select"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        isInvalid={!!errors.service}
                      >
                        <option value="">Select Service</option>
                        {servicesList.map((service) => (
                          <option key={service.id} value={service.name}>
                            {service.name}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">{errors.service}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="card_title_all mb-3">Customer Details</div>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formCustomerName">
                      <Form.Label>Customer Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="customer_name"
                        placeholder="Enter customer's full name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        isInvalid={!!errors.customer_name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.customer_name}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formMobile">
                      <Form.Label>Mobile Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="mobile"
                        placeholder="Enter 10-digit mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        isInvalid={!!errors.mobile}
                      />
                      <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formAdharNumber">
                      <Form.Label>Adhar Card Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="adhar_number"
                        placeholder="Enter 12-digit Adhar Card number"
                        value={formData.adhar_number}
                        onChange={handleChange}
                        isInvalid={!!errors.adhar_number}
                      />
                      <Form.Control.Feedback type="invalid">{errors.adhar_number}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formPanCardNumber">
                      <Form.Label>PAN Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="pan_card_number"
                        placeholder="Enter PAN Card number"
                        value={formData.pan_card_number}
                        onChange={handleChange}
                        isInvalid={!!errors.pan_card_number}
                      />
                      <Form.Control.Feedback type="invalid">{errors.pan_card_number}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formIncomeSource">
                      <Form.Label>Income Source <span className="text-danger">*</span></Form.Label>
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
                      <Form.Control.Feedback type="invalid">{errors.income_source}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Financial Details */}
                <div className="card_title_all mb-3">Financial Details</div>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formMonthlyIncome">
                      <Form.Label>Monthly Income <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="monthly_income"
                        placeholder="Enter monthly income"
                        value={formData.monthly_income}
                        onChange={handleChange}
                        isInvalid={!!errors.monthly_income}
                      />
                      <Form.Control.Feedback type="invalid">{errors.monthly_income}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formMonthlyEMI">
                      <Form.Label>Monthly EMI</Form.Label>
                      <Form.Control
                        type="number"
                        name="monthly_emi"
                        placeholder="Enter current monthly EMI"
                        value={formData.monthly_emi}
                        onChange={handleChange}
                        isInvalid={!!errors.monthly_emi}
                      />
                      <Form.Control.Feedback type="invalid">{errors.monthly_emi}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formRequireLoanAmount">
                      <Form.Label>Required Loan Amount <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="require_loan_amount"
                        placeholder="Enter required loan amount"
                        value={formData.require_loan_amount}
                        onChange={handleChange}
                        isInvalid={!!errors.require_loan_amount}
                      />
                      <Form.Control.Feedback type="invalid">{errors.require_loan_amount}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="align-items-end">
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formCibilScore">
                      <Form.Label>CIBIL Score <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="select"
                        name="cibil_score"
                        value={formData.cibil_score}
                        onChange={handleChange}
                        isInvalid={!!errors.cibil_score}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">{errors.cibil_score}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formCibilScoreValue">
                      <Form.Label>CIBIL Score Value</Form.Label>
                      <Form.Control
                        type="text"
                        name="cibil_score_value"
                        placeholder="Enter CIBIL score value"
                        value={formData.cibil_score_value}
                        onChange={handleChange}
                        isInvalid={!!errors.cibil_score_value}
                        disabled={formData.cibil_score === "No"}
                      />
                      <Form.Control.Feedback type="invalid">{errors.cibil_score_value}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Location Details */}
                <div className="card_title_all mb-3">Location Details</div>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="state">
                      <Form.Label>State <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        value={formData.state}
                        onChange={(e) => {
                          const selectedState = statesList.find(s => s.id === e.target.value);
                          setFormData(prev => ({
                            ...prev,
                            state: e.target.value,
                            state_name: statesList.find(s => s.id.toString() === e.target.value.toString())?.name || "",
                            city: "",
                            city_name: ""
                          }));
                          setSelectedStateId(e.target.value);
                          if (errors.state) setErrors(prev => ({ ...prev, state: null }));
                          if (errors.city) setErrors(prev => ({ ...prev, city: null }));
                        }}
                        isInvalid={!!errors.state}
                      >
                        <option value="">Select State</option>
                        {statesList.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="city">
                      <Form.Label>City <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        value={formData.city}
                        onChange={(e) => {
                          const selectedCity = citiesList.find(c => c.id.toString() === e.target.value.toString());
                          setFormData(prev => ({
                            ...prev,
                            city: e.target.value,
                            city_name: selectedCity ? selectedCity.name : ""
                          }));
                          if (errors.city) setErrors(prev => ({ ...prev, city: null }));
                        }}
                        isInvalid={!!errors.city}
                        disabled={!selectedStateId || citiesList.length === 0}
                      >
                        <option value="">Select City</option>
                        {citiesList.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formPincode">
                      <Form.Label>Pincode <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        placeholder="Enter pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        isInvalid={!!errors.pincode}
                      />
                      <Form.Control.Feedback type="invalid">{errors.pincode}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3" controlId="formLocation">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        placeholder="Enter full location address"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Customer Documents */}
                <div className="card_title_all mb-3">Customer Documents</div>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formAdharFrontImage">
                      <Form.Label>Adhar Front Image <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="adhar_front_image"
                        onChange={handleFileChange}
                        isInvalid={!!errors.adhar_front_image}
                      />
                      <Form.Control.Feedback type="invalid">{errors.adhar_front_image}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formAdharBackImage">
                      <Form.Label>Adhar Back Image <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="adhar_back_image"
                        onChange={handleFileChange}
                        isInvalid={!!errors.adhar_back_image}
                      />
                      <Form.Control.Feedback type="invalid">{errors.adhar_back_image}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formPanCardImage">
                      <Form.Label>PAN Card Image <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="pan_card_image"
                        onChange={handleFileChange}
                        isInvalid={!!errors.pan_card_image}
                      />
                      <Form.Control.Feedback type="invalid">{errors.pan_card_image}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formCurrentResidenceProof">
                      <Form.Label>Current Residence Proof <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="current_residence_proof"
                        onChange={handleFileChange}
                        isInvalid={!!errors.current_residence_proof}
                      />
                      <Form.Control.Feedback type="invalid">{errors.current_residence_proof}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formPermanentAddressProof">
                      <Form.Label>Permanent Address Proof <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="permanent_address_proof"
                        onChange={handleFileChange}
                        isInvalid={!!errors.permanent_address_proof}
                      />
                      <Form.Control.Feedback type="invalid">{errors.permanent_address_proof}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formEmployeeProof">
                      <Form.Label>Employee Proof / Business Registration</Form.Label>
                      <Form.Control
                        type="file"
                        name="employeeProof_bussinessRegistration"
                        onChange={handleFileChange}
                        isInvalid={!!errors.employeeProof_bussinessRegistration}
                      />
                      <Form.Control.Feedback type="invalid">{errors.employeeProof_bussinessRegistration}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formSalarySlip">
                      <Form.Label>Salary Slip</Form.Label>
                      <Form.Control
                        type="file"
                        name="salary_slip"
                        onChange={handleFileChange}
                        isInvalid={!!errors.salary_slip}
                      />
                      <Form.Control.Feedback type="invalid">{errors.salary_slip}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formITR">
                      <Form.Label>ITR</Form.Label>
                      <Form.Control
                        type="file"
                        name="itr"
                        onChange={handleFileChange}
                        isInvalid={!!errors.itr}
                      />
                      <Form.Control.Feedback type="invalid">{errors.itr}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formForm16">
                      <Form.Label>Form 16</Form.Label>
                      <Form.Control
                        type="file"
                        name="form16"
                        onChange={handleFileChange}
                        isInvalid={!!errors.form16}
                      />
                      <Form.Control.Feedback type="invalid">{errors.form16}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formBankStatement">
                      <Form.Label>Bank Statement (Savings Account)</Form.Label>
                      <Form.Control
                        type="file"
                        name="bank_statement"
                        onChange={handleFileChange}
                        isInvalid={!!errors.bank_statement}
                      />
                      <Form.Control.Feedback type="invalid">{errors.bank_statement}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formBankStatementCurrentAccount">
                      <Form.Label>Bank Statement (Current Account)</Form.Label>
                      <Form.Control
                        type="file"
                        name="bank_statement_current_account"
                        onChange={handleFileChange}
                        isInvalid={!!errors.bank_statement_current_account}
                      />
                      <Form.Control.Feedback type="invalid">{errors.bank_statement_current_account}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formGstReturn">
                      <Form.Label>GST Return</Form.Label>
                      <Form.Control
                        type="file"
                        name="gst_return"
                        onChange={handleFileChange}
                        isInvalid={!!errors.gst_return}
                      />
                      <Form.Control.Feedback type="invalid">{errors.gst_return}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3" controlId="formPropertyPaper">
                      <Form.Label>Property Paper</Form.Label>
                      <Form.Control
                        type="file"
                        name="property_paper"
                        onChange={handleFileChange}
                        isInvalid={!!errors.property_paper}
                      />
                      <Form.Control.Feedback type="invalid">{errors.property_paper}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="submitbutton">
                  <Button
                    type="submit"
                    className="submitbutton_design"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Loan Lead"}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Message Modal */}
      <Modal show={showMessageModal} onHide={closeCustomMessageModal} centered>
        <div className={`modal-content ${messageModalContent.type === "success" ? "border-success" : messageModalContent.type === "error" ? "border-danger" : "border-warning"
          }`}>
          <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
            <Modal.Title className={`modal-title ${messageModalContent.type === "success" ? "text-success" : messageModalContent.type === "error" ? "text-danger" : "text-warning"
              }`}>
              {messageModalContent.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-secondary">
            <p>{messageModalContent.text}</p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
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
          </Modal.Footer>
        </div>
      </Modal>
    </Container>
  );
}

export default Createloan;