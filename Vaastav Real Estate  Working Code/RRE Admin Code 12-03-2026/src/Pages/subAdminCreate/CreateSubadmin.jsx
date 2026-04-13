import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const API_URL = process.env.REACT_APP_API_URL;

function CreateSubadmin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    email: "",
    password: "",
    status: "active",
  });


  const [errors, setErrors] = useState({});


  const [loading, setLoading] = useState(false);


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


  const validateForm = () => {
    let newErrors = {};
    let isValid = true;


    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
      isValid = false;
    }


    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }


    if (!formData.status) {
      newErrors.status = "Status is required.";
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

    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`${API_URL}/sub-admin-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {

        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create sub-admin.");
      }


      const result = await response.json();
      if (result.success == '1') {
        Swal.fire("Success", result.message || "Sub-admin created successfully!", "success").then(() => {
          navigate("/allsubadmin");
        });

        setFormData({
          email: "",
          password: "",
          status: "active",
        });
        setErrors({});
      }
      else {
        Swal.fire("error", result.message || "Sub-admin .....!", "error");
      }

    } catch (err) {
      console.error("Error creating sub-admin:", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding_15">
      <div className="row">
        <div className="col-md-12 col-12 col-sm-12">
          <div className="card">
            <div className="card-header bg-gradientcolor">
              <div className="d-flex align-items-center justify-content-between">
                <div className="titlepage">
                  <h3>Create Sub Admin</h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 form-group" id="formEmail">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className={` ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* <div className="mb-3 form-group" id="formPassword">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className={` ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password}
                  </div>
                )}
              </div> */}

                <div className="mb-3 form-group position-relative" id="formPassword">
                  <label className="form-label">Password</label>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  {/* Eye Icon */}
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "38px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>

                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password}
                    </div>
                  )}
                </div>



                <div className="mb-4 form-group" id="formStatus">
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    className={` ${errors.status ? 'is-invalid' : ''}`}
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <div className="invalid-feedback">
                      {errors.status}
                    </div>
                  )}
                </div>

                <div className="submitbutton">
                  <button
                    type="submit"
                    className="submitbutton_design"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Sub-admin"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSubadmin;