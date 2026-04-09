import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function CreateUser({ fetchUsers }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, mobile: value }));
      }
    } else if (name === "password") {
      if (value.length <= 20) {
        setFormData((prev) => ({ ...prev, password: value }));
      }
    } else if (name === "username") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, username: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const resetForm = () => {
    setFormData({ username: "", mobile: "", password: "" });
    setValidated(false);
    setShowPassword(false);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    
    const isValid =
      /^[A-Za-z\s]+$/.test(formData.username) &&
      /^\d{10}$/.test(formData.mobile) &&
      formData.password.length >= 6;
    
    if (!isValid) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create user");

      const result = await res.json();

      if (result.success === "1") {
        await Swal.fire({
          icon: "success",
          title: "User Added",
          text: "The user has been created successfully",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        resetForm();
        if (fetchUsers) fetchUsers();
        navigate("/all_users");
      } else {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: result.message || "Failed to add user.",
        });
      }
    } catch (err) {
      console.error("Submit Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save user.",
      });
    }
  };
  
  return (
    <div className="row mt-3">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white">Create User</h3>
            </div>
          </div>
          <div className="card-body">
            <form
              noValidate
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              onSubmit={handleSubmit}
            >
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    User Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Enter user name"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Only letters and spaces are allowed.
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Mobile <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validated && !/^\d{10}$/.test(formData.mobile)
                        ? "is-invalid"
                        : validated && /^\d{10}$/.test(formData.mobile)
                        ? "is-valid"
                        : ""
                    }`}
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    inputMode="numeric"
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please enter a valid 10-digit mobile number.
                  </div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="input-group" style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        validated && formData.password.length < 6
                          ? "is-invalid"
                          : validated && formData.password.length >= 6
                          ? "is-valid"
                          : ""
                      }`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password (minimum 6 characters)"
                      minLength="6"
                      maxLength="20"
                      required
                      style={{
                        paddingRight: '90px',
                        borderColor: validated && formData.password.length < 6 ? '#dc3545' : 
                                   validated && formData.password.length >= 6 ? '#198754' : '#ced4da'
                      }}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: showPassword ? '#0d6efd' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '6px 15px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        zIndex: '5',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = showPassword ? '#0b5ed7' : '#5c636a';
                        e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = showPassword ? '#0d6efd' : '#6c757d';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translateY(-50%) scale(0.98)';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'translateY(-50%)';
                      }}
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Password must be at least 6 characters long.
                  </div>
                </div>
                
                {/* Submit */}
                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button
                      className="button_submit btn btn-success btn-bordered waves-effect"
                      type="submit"
                      style={{
                        padding: '10px 30px',
                        fontWeight: '600',
                        fontSize: '16px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(40, 167, 69, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(40, 167, 69, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(40, 167, 69, 0.3)';
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUser;