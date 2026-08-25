import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { updateSubAdmin, getAllSubAdmins } from "../../Server/api";

const UpdateSubAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    // email: "",
    password: "",
    permissions: [],
  });

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getAllSubAdmins();
        const user = res.data.data.find((u) => u._id === id);
        if (user) {
          setFormData({
            name: user.username,
            mobile: user.mobile,
            // email: user.email || "",
            password: "",
            permissions: user.permissions || [],
          });
        }
      } catch (err) {
        console.error("Error loading data:", err);
        Swal.fire("Error", "Failed to load user data", "error");
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, mobile: value });
      }
    } else if (name === "name") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, name: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    // Validation
    const isValid =
      /^[A-Za-z\s]+$/.test(formData.name) && /^\d{10}$/.test(formData.mobile);

    if (!isValid) return;

    try {
      const updateData = {
        name: formData.name,
        mobile: formData.mobile,
        // email: formData.email,
        permissions: formData.permissions,
      };

      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }
      const res = await updateSubAdmin(id, updateData);
      if (res.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Sub Admin Updated Successfully",
          timer: 1000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        navigate("/sub_admin");
      }
    } catch (err) {
      console.error("Update Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Update Failed",
      });
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title">Update Sub Admin</h3>
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
                    Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly
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

                {/* <div className="col-md-6 mb-3">
                  <label className="form-label">Email (Optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div> */}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                  <small className="text-muted">
                    Only enter if you want to change the password
                  </small>
                </div>

                <div className="col-md-12">
                  <div className="d-flex justify-content-end gap-2">
                    <button className="button_submit" type="submit">
                      Update
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
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
};

export default UpdateSubAdmin;
