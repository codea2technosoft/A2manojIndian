import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../Server/api";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";

function CreateUser({ fetchUsers }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    email: "",
    // password: "",
  });
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, mobile: value }));
      }
    } else if (name === "username") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, username: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({ username: "", mobile: "", email: "", password: "" });
    setValidated(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    const isValid =
      /^[A-Za-z\s]+$/.test(formData.username) &&
      /^\d{10}$/.test(formData.mobile) &&
      formData.email.includes("@") 
      // && formData.password.length >= 4;
      

    if (!isValid) return;

    try {
      const response = await createUser(formData);
      if (response.data && response.data.success) {
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
          text: response.data.message || "Failed to add user.",
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
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white mb-0">Create User</h3>
              <Button variant="light" onClick={() => navigate(-1)}>
                <BsArrowLeft className="me-1" /> Back
              </Button>
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
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter a valid email address.
                  </div>
                </div>

                {/* <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  <div className="invalid-feedback">
                    Password must be at least 4 characters long.
                  </div>
                </div> */}

                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button
                      className="button_submit"
                      type="submit"
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
