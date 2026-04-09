import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";

function CreateRoles({ fetchUsers }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    roles: "",
  });
  const [validated, setValidated] = useState(false);
  const [userType, setUserType] = useState(""); // 👈 UserType state

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/admin-profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await res.json();
        if (res.ok && result.success === "1") {
          setUserType(result.data.roles); // ✅ Set userType from API
        } else {
          Swal.fire("Error", "Failed to fetch user profile", "error");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        Swal.fire("Error", "Something went wrong", "error");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    const { email, password, confirmPassword, roles } = formData;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 4;
    if (!isEmailValid) {
      Swal.fire(
        "Invalid Email",
        "Please enter a valid email address",
        "warning"
      );
      return;
    }
    if (!isEmailValid || !isPasswordValid || !roles) {
      Swal.fire(
        "Validation Warning",
        "Please fill all required fields correctly.",
        "warning"
      );
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire(
        "Password Mismatch",
        "Passwords does not match. Please verify and try again!",
        "warning"
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          password,
          roles,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success === "1") {
        Swal.fire("Success", "Role Created Successfully", "success");
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          roles: "",
        });
        if (fetchUsers) fetchUsers();
        navigate("/all_roles");
      } else {
        Swal.fire(
          "Warning",
          result.message || "User Already Added Please Try Another",
          "warning"
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Server Error", "error");
    }
  };

  return (
    <div className="row mt-3">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white">Create Role</h3>
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
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Confirm Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                  />
                </div>

                {/* ✅ Dynamic Role Dropdown based on userType */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Select Role <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    name="roles"
                    value={formData.roles}
                    onChange={handleChange}
                    required
                    disabled={!userType} // disable until loaded
                  >
                    <option value="" disabled hidden>
                      Select Roles
                    </option>
                    {userType === "tech_admin" && (
                      <option value="admin">Admin</option>
                    )}
                    {userType === "admin" && (
                      <option value="sub_admin">Sub Admin</option>
                    )}
                  </select>
                </div>

                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button className="button_submit btn btn-success btn-bordered waves-effect" type="submit">
                      Create Role
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

export default CreateRoles;
