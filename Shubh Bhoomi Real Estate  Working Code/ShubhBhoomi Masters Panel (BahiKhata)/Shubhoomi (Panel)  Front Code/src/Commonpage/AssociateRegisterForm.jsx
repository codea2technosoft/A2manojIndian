import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaUser,
  FaMobileAlt,
  FaWhatsapp,
  FaEnvelope,
  FaUserFriends,
  FaCalendar,
} from "react-icons/fa";
import logo from "../assets/images/logo.png";

const API_URL = process.env.REACT_APP_dashboardLogin_API_URL;

const AssociateRegisterForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const parentIdFromUrl = queryParams.get("parent_id") || "";
  const [userNameDisplay, setUserNameDisplay] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const fetchNameByMobile = async (mobile) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/check-parentid-name`, // 🔗 Endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ✅ JSON content
          },
          body: JSON.stringify({ parentid: mobile }), // ✅ Send as JSON
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "1" && data.data?.username) {
        return data.data.username;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };

  useEffect(() => {
    if (parentIdFromUrl) {
      console.log("Triggering fetch for:", parentIdFromUrl);
      fetchNameByMobile(parentIdFromUrl).then((name) => {
        console.log("Fetched Name:", name);
        if (name) {
          setUserNameDisplay(name);
        } else {
          setUserNameDisplay("Not Found");
        }
      });
    }
  }, [parentIdFromUrl]);

  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    whatsapp_number: "",
    dob: "",
    email: "",
    parent_id: parentIdFromUrl,
  });

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/state-list-front`
        );
        setStateList(res.data.data || []);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.state) return setCityList([]);
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/city-list-front`,
          { state_id: formData.state }
        );
        setCityList(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCityList([]);
      }
    };
    fetchCities();
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  const validate = () => {
    const newErrors = {};

    if (!formData.username?.trim())
      newErrors.username = "Name is required";

    if (!formData.mobile?.match(/^\d{10}$/))
      newErrors.mobile = "Valid 10-digit mobile is required";

    if (!formData.whatsapp_number?.match(/^\d{10}$/))
      newErrors.whatsapp_number = "Valid 10-digit WhatsApp number required";

    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";

    const dobErrors = validateDOB(formData);
    if (dobErrors.dob) {
      newErrors.dob = dobErrors.dob;
    }
    function isValidDOB(dateStr) {
      const regex = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/;
      const match = String(dateStr).match(regex);
      if (!match) return false;

      const day = Number(match[1]);
      const month = Number(match[2]);
      const year = Number(match[3]);

      if (month < 1 || month > 12) return false;

      const daysInMonth = [
        31,
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
        31, 30, 31, 30, 31, 31, 30, 31, 30, 31
      ];

      if (day < 1 || day > daysInMonth[month - 1]) return false;

      return true;
    }

    function validateDOB(formData) {
      const errors = {};
      const dob = String(formData.dob || "").trim();

      if (!dob) {
        errors.dob = "Date of birth is required";
        return errors;
      }

      if (!isValidDOB(dob)) {
        errors.dob = "Invalid date format (DD-MM-YYYY or DD/MM/YYYY)";
        return errors;
      }

      const separator = dob.includes("/") ? "/" : "-";
      const [day, month, year] = dob.split(separator).map(Number);
      const dateObj = new Date(year, month - 1, day);

      if (dateObj > new Date()) {
        errors.dob = "Date of birth cannot be in the future";
      }

      return errors;
    }




    return newErrors;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/associate-registers`,
        formData
      );

      if (res.data.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Associates Registered Successfully !!!",
          confirmButtonColor: "#28a745",
        }).then(() => {
          navigate("/");
        });

        // Optionally clear form
        setFormData({
          username: "",
          mobile: "",
          whatsapp_number: "",
          email: "",
          dob: "",
          parent_id: formData.parent_id,
        });
        setErrors({});
      } else {
        // 🔴 Handle case when success !== "1"
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: res.data.message || "Something went wrong!",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: err.response?.data?.message || "Server error",
      });
    }
  };

  return (
    <div className="registerform_design">
      <div className="form_deisgnall">
        <div className="logoform">
          <img src={logo} alt="logo" />
        </div>
        <h4 className="text-center">ASSOCIATE REGISTRATION FORM</h4>
        {success && <Alert variant="success">{success}</Alert>}

        <div className="formregisterformdesign">
          <Form onSubmit={handleSubmit} className="login-form text-start">
            <Row>
              {[
                {
                  name: "username",
                  label: "Name",
                  placeholder: "Name",
                  icon: <FaUser />,
                  type: "text",
                },
                {
                  name: "mobile",
                  label: "Mobile",
                  icon: <FaMobileAlt />,
                  type: "text",
                  placeholder: "Mobile",
                  maxLength: 10,
                },
                {
                  name: "whatsapp_number",
                  label: "Whatsapp Number",
                  icon: <FaWhatsapp />,
                  type: "text",
                  placeholder: "Whatsapp Number",
                  maxLength: 10,
                },
                {
                  name: "dob",
                  label: "Date of Birth",
                  icon: <FaCalendar />,
                  type: "text",
                  placeholder: "DD-MM-YYYY",
                  max: () => new Date().toISOString().split("T")[0],
                },


                {
                  name: "email",
                  label: "Email",
                  placeholder: "Email",
                  icon: <FaEnvelope />,
                  type: "email",
                },
              ].map(({ name, label, icon, type, maxLength, placeholder }) => (
                <Col md={6} key={name}>
                  <Form.Group className="profileinputbox">
                    <Form.Label>
                      {label} <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="inputfield">
                      <div className="icon_all">{icon}</div>
                      <Form.Control
                        type={type}
                        placeholder={placeholder}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        maxLength={maxLength}
                        isInvalid={!!errors[name]} // Red border if error
                      />
                    </div>
                    {errors[name] && (
                      <div className="invalid-feedback d-block">
                        {errors[name]}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              ))}

              {/* Parent ID (read-only) */}
              <Col md={6}>
                <Form.Group className="profileinputbox">
                  <Form.Label>
                    Parent ID <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="inputfield position-relative">
                    <div className="icon_all">
                      <FaUserFriends />
                    </div>
                    <Form.Control
                      type="text"
                      value={formData.parent_id}
                      disabled
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="profileinputbox">
                  <Form.Label>Name</Form.Label>
                  <div className="inputfield position-relative">
                    <div className="icon_all">
                      <FaUserFriends />
                    </div>
                    <Form.Control
                      type="text"
                      value={userNameDisplay}
                      disabled
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center margin-top-20">
              <div className="loginbutton_design">
                Already have an account?  Click Here to <a href={API_URL}>Log In</a>
              </div>
              <Button type="submit" className="submitbutton">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AssociateRegisterForm;
