import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";



const API_URL = process.env.REACT_APP_API_URL;

function CreateProjectCategory() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const [formData, setFormData] = useState({
    category_name: "",
    commission: "",
    salary: 0,
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


    // Category Name Validation
    if (!formData.category_name.trim()) {
      newErrors.category_name = "Category name is required.";
      isValid = false;
    }

    // Commission Validation
    if (!formData.commission.toString().trim()) {
      newErrors.commission = "Commission is required.";
      isValid = false;
    } else if (isNaN(formData.commission) || Number(formData.commission) < 0) {
      newErrors.commission = "Commission must be a valid non-negative number.";
      isValid = false;
    }

    // Salary Validation
    // if (!formData.salary.toString().trim()) {
    //   newErrors.salary = "Salary is required.";
    //   isValid = false;
    // } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
    //   newErrors.salary = "Salary must be a valid positive number.";
    //   isValid = false;
    // }


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

      const response = await fetch(`${API_URL}/create-project-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {

        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project-category.");
      }


      const result = await response.json();
      if (result.success == '1') {
        Swal.fire("Success", result.message || "Project-category created successfully!", "success").then(() => {
          navigate("/created-project-category-list");
        });

        setFormData({
          category_name: "",
          commission: "",
          salary: 0,
          status: "active",
        });
        setErrors({});
      }
      else {
        Swal.fire("error", result.message || "Project-category .....!", "error");
      }

    } catch (err) {
      console.error("Error creating project-category:", err);
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
                  <h3>Create Project Category </h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 form-group" id="formEmail">
                  <label className="form-label">Category Name</label>
                  <input
                    type="category_name"
                    name="category_name"
                    className={` ${errors.category_name ? 'is-invalid' : ''}`}
                    placeholder="Enter Category Name"
                    value={formData.category_name}
                    onChange={handleChange}
                  />
                  {errors.category_name && (
                    <div className="invalid-feedback">
                      {errors.category_name}
                    </div>
                  )}
                </div>



                <div className="mb-3 form-group" id="formEmail">
                  <label className="form-label">Commission in (%)</label>
                  <input
                    type="commission"
                    name="commission"
                    className={` ${errors.commission ? 'is-invalid' : ''}`}
                    placeholder="Enter commission"
                    value={formData.commission}
                    onChange={handleChange}
                  />
                  {errors.commission && (
                    <div className="invalid-feedback">
                      {errors.commission}
                    </div>
                  )}
                </div>


                <div className="mb-3 form-group" id="formEmail">
                  <label className="form-label">Salary</label>
                  <input
                    type="salary"
                    name="salary"
                    className={` ${errors.salary ? 'is-invalid' : ''}`}
                    placeholder="Enter salary"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                  {errors.salary && (
                    <div className="invalid-feedback">
                      {errors.salary}
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
                    {loading ? "Creating..." : "Create Project category"}
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

export default CreateProjectCategory;