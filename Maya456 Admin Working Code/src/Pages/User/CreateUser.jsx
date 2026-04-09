import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function CreateUser({ fetchUsers }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    mobile: "",
    mpin: "",
  });
  const [validated, setValidated] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, mobile: value }));
      }
    } else if (name === "mpin") {
      if (/^\d{0,4}$/.test(value)) {
        setFormData((prev) => ({ ...prev, mpin: value }));
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
    setFormData({ username: "", mobile: "", mpin: "" });
    setValidated(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    const isValid =
      /^[A-Za-z\s]+$/.test(formData.username) &&
      /^\d{10}$/.test(formData.mobile) &&
      /^\d{4}$/.test(formData.mpin);

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
        // Success case
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
        // API returned failure even if HTTP status is 200
        Swal.fire({
          icon: "warning", // or "error" if you prefer
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
                    M-Pin <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      validated && !/^\d{4}$/.test(formData.mpin)
                        ? "is-invalid"
                        : validated && /^\d{4}$/.test(formData.mpin)
                        ? "is-valid"
                        : ""
                    }`}
                    name="mpin"
                    value={formData.mpin}
                    onChange={handleChange}
                    placeholder="Enter 4-digit M-Pin"
                    maxLength="4"
                    inputMode="numeric"
                    required
                  />
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Please enter a valid 4-digit M-Pin.
                  </div>
                </div>
                {/* Submit */}
                <div className="col-md-12">
                  <div className="d-flex justify-content-end">
                    <button
                      className="button_submit btn btn-success btn-bordered waves-effect"
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
