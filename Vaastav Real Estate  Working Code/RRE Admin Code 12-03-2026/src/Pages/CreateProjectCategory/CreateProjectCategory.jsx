import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CreateProjectCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category_name: "",
    commission: "",
    commission_type: "multiplier",
    salary: 0,
    salary_months: 0,
    is_salary_applicable: 0,
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let val = value;

    // convert numeric fields
    if (["salary", "salary_months", "commission"].includes(name)) {
      val = value === "" ? "" : Number(value);
    }

    if (name === "is_salary_applicable") {
      val = Number(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.category_name.trim()) {
      newErrors.category_name = "Category name is required.";
      isValid = false;
    }

    if (formData.commission === "" || isNaN(formData.commission)) {
      newErrors.commission = "Valid commission required.";
      isValid = false;
    }

    if (formData.is_salary_applicable === 1) {
      if (!formData.salary || formData.salary <= 0) {
        newErrors.salary = "Salary required if applicable.";
        isValid = false;
      }

      if (!formData.salary_months || formData.salary_months <= 0) {
        newErrors.salary_months = "Salary months required.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire("Error", "Please fix validation errors", "error");
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Token missing");

      const response = await fetch(`${API_URL}/create-project-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success === "1") {
        Swal.fire("Success", result.message, "success").then(() => {
          navigate("/created-project-category-list");
        });

        setFormData({
          category_name: "",
          commission: "",
          commission_type: "multiplier",
          salary: 0,
          salary_months: 0,
          is_salary_applicable: 0,
          status: "active",
        });

      } else {
        Swal.fire("Error", result.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header bg-gradientcolor">
          <h3>Create Project Category</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* Category Name */}
            <div className="mb-3">
              <label>Category Name</label>
              <input
                type="text"
                name="category_name"
                className={`form-control ${errors.category_name && "is-invalid"}`}
                value={formData.category_name}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.category_name}</div>
            </div>

            {/* Commission */}
            <div className="mb-3">
              <label>Commission (Multiplier)</label>
              <input
                type="number"
                step="0.01"
                name="commission"
                className={`form-control ${errors.commission && "is-invalid"}`}
                value={formData.commission}
                onChange={handleChange}
                placeholder="e.g. 1.0, 0.5, 1.2"
              />
              <div className="invalid-feedback">{errors.commission}</div>
            </div>

            {/* Salary Applicable */}
            <div className="mb-3">
              <label>Salary Applicable</label>
              <select
                name="is_salary_applicable"
                className="form-control"
                value={formData.is_salary_applicable}
                onChange={handleChange}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>

            {/* Salary */}
            {formData.is_salary_applicable === 1 && (
              <>
                <div className="mb-3">
                  <label>Monthly Salary</label>
                  <input
                    type="number"
                    name="salary"
                    className={`form-control ${errors.salary && "is-invalid"}`}
                    value={formData.salary}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.salary}</div>
                </div>

                <div className="mb-3">
                  <label>Salary Months</label>
                  <input
                    type="number"
                    name="salary_months"
                    className={`form-control ${errors.salary_months && "is-invalid"}`}
                    value={formData.salary_months}
                    onChange={handleChange}
                  />
                  <div className="invalid-feedback">{errors.salary_months}</div>
                </div>
              </>
            )}

            {/* Status */}
            <div className="mb-3">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Category"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectCategory;