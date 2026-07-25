import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap"; 
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import {
  changeMasterPassword,
  getSettings,
  UpdateSettings
} from "../Server/api";

function Myprofile() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const adminId = localStorage.getItem("admin_id");
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // State for deposit/withdraw settings
  const [minDeposit, setMinDeposit] = useState("");
  const [maxDeposit, setMaxDeposit] = useState("");
  const [minWithdraw, setMinWithdraw] = useState("");
  const [maxWithdraw, setMaxWithdraw] = useState("");
  const [settingsId, setSettingsId] = useState(""); // Store settings _id
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSubmitted, setSettingsSubmitted] = useState(false);

  const handleShow = () => {
    setShowModal(true);
    fetchSettings(); // Fetch settings when modal opens
  };
  
  const handleClose = () => {
    setShowModal(false);
    // Reset form
    setMinDeposit("");
    setMaxDeposit("");
    setMinWithdraw("");
    setMaxWithdraw("");
    setSettingsId("");
    setSettingsSubmitted(false);
  };

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Fetch settings from API
  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const response = await getSettings();
      console.log("Settings Response:", response);
      
      // Handle different response structures
      const data = response?.data || response;
      
      if (data?.success || response?.success) {
        // data.data is an array, get the first element
        const settingsArray = data.data || response?.data || [];
        const settings = settingsArray[0] || {};
        
        console.log("Settings object:", settings);
        
        // Store the settings ID
        setSettingsId(settings?._id || "");
        
        // Set values from API response - using the correct field names
        setMinDeposit(settings?.min_deposit || "");
        setMaxDeposit(settings?.max_deposit || "");
        setMinWithdraw(settings?.min_withdraw || "");
        setMaxWithdraw(settings?.max_withdraw || "");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data?.message || "Failed to fetch settings",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load settings. Please try again.",
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  // Handle update settings submit
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsSubmitted(true);

    // Validate fields
    if (!minDeposit || !maxDeposit || !minWithdraw || !maxWithdraw) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields are required",
      });
      return;
    }

    // Validate numeric values
    if (isNaN(minDeposit) || isNaN(maxDeposit) || isNaN(minWithdraw) || isNaN(maxWithdraw)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields must be valid numbers",
      });
      return;
    }

    // Validate min < max for deposit
    if (parseFloat(minDeposit) >= parseFloat(maxDeposit)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Min Deposit must be less than Max Deposit",
      });
      return;
    }

    // Validate min < max for withdraw
    if (parseFloat(minWithdraw) >= parseFloat(maxWithdraw)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Min Withdraw must be less than Max Withdraw",
      });
      return;
    }

    // Check if settingsId exists
    if (!settingsId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Settings ID not found. Please refresh and try again.",
      });
      return;
    }

    // Get admin_id from localStorage
    const adminIdFromStorage = localStorage.getItem("admin_id");
    
    if (!adminIdFromStorage) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Admin ID not found. Please login again.",
      });
      return;
    }

    setSettingsLoading(true);
    try {
      // Prepare payload with id, admin_id, and all fields
      const payload = {
        id: settingsId, // The _id from the settings object
        admin_id: adminIdFromStorage,
        min_deposit: minDeposit,
        max_deposit: maxDeposit,
        min_withdraw: minWithdraw,
        max_withdraw: maxWithdraw,
      };

      console.log("Update Settings Payload:", payload);

      const response = await UpdateSettings(payload);
      console.log("Update Response:", response);

      // Check response
      const isSuccess = response?.success || response?.data?.success || false;
      const message = response?.message || response?.data?.message || "Settings updated successfully";

      if (isSuccess) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          confirmButtonText: "OK",
        });
        handleClose(); // Close modal
        // Refresh settings after update
        fetchSettings();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message || "Failed to update settings",
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      let errorMessage = "An error occurred while updating settings";
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  // Validation functions for password
  const validateOldPasswordField = (password) => {
    if (!password || password.trim() === "") {
      return "Please enter Old Password";
    }
    return "";
  };

  const validateNewPasswordField = (password) => {
    if (!password || password.trim() === "") {
      return "Please enter new password";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const validateConfirmPasswordField = (password, newPass) => {
    if (!password || password.trim() === "") {
      return "Please enter confirm password";
    }
    if (password !== newPass) {
      return "Passwords do not match";
    }
    return "";
  };

  const validateAllFields = () => {
    const oldPassError = validateOldPasswordField(oldPassword);
    const newPassError = validateNewPasswordField(newPassword);
    const confirmPassError = validateConfirmPasswordField(confirmPassword, newPassword);
    
    setOldPasswordError(oldPassError);
    setNewPasswordError(newPassError);
    setConfirmPasswordError(confirmPassError);
    
    if (oldPassword === newPassword && oldPassword !== "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "New password cannot be same as old password",
        confirmButtonText: "OK",
      });
      return false;
    }
    
    return !oldPassError && !newPassError && !confirmPassError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!validateAllFields()) {
      return;
    }

    const adminIdFromStorage = localStorage.getItem("admin_id");
    
    if (!adminIdFromStorage) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Admin ID not found. Please login again.",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        admin_id: adminIdFromStorage,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };

      console.log("Sending payload:", payload);

      const response = await changeMasterPassword(payload);
      console.log("Full Response:", response);

      const isSuccess = response?.success || response?.data?.success || false;
      const message = response?.message || response?.data?.message || "Password changed successfully";

      if (isSuccess) {
        setIsOpen(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: message,
          confirmButtonText: "OK",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOldPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");
        setSubmitted(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message || "Failed to change password",
        });
      }
    } catch (err) {
      console.error("Error changing password:", err);
      let errorMessage = "An error occurred while changing password";
      
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setSubmitted(false);
  };

  return (
    <>
      <div className='allcommon'>
        <section className="py-4 main-inner-outer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="inner-wrapper">
                  <h2>Profile</h2>
                  <div className="account-table w-100">
                    <div className="profile-tab table-color">
                      <div className="row">
                        <div className="col-md-7">
                          <div className="responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th scope="col" colSpan={4} className="text-start">
                                    About You
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-start" width="25%">
                                    First Name
                                  </td>
                                  <td className="text-start" colSpan={3}>
                                    {/* Add your first name data here */}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-start" width="25%">
                                    Last Name
                                  </td>
                                  <td className="text-start" colSpan={3} />
                                </tr>
                                <tr>
                                  <td className="text-start" width="25%">
                                    Birthday
                                  </td>
                                  <td className="text-start" colSpan={3}>
                                    -----
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-start" width="25%">
                                    Email
                                  </td>
                                  <td className="text-start" colSpan={3} />
                                </tr>
                                <tr>
                                  <td className="text-start" width="25%">
                                    Password
                                  </td>
                                  <td className="text-start">************</td>
                                  <td className="p-2">
                                    <button
                                      className="text-decoration-none theme_dark_btn"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleOpenModal();
                                      }}>
                                      Edit <i className="fas fa-pen text-white ps-1" />
                                    </button>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-start" width="25%">
                                    Exposure
                                  </td>
                                  <td className="text-start" colSpan={3}>
                                    0
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-start" width="25%">
                                    Time Zone
                                  </td>
                                  <td className="text-start" colSpan={3}>
                                    Asia/Kolkata
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th scope="col" colSpan={4} className="text-start">
                                    Contact Details
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-start">Primary Number</td>
                                  <td className="text-start"> 0</td>
                                </tr>
                              </tbody>
                            </table>
                            <table className="table">
                              <thead>
                                <tr>
                                  <th scope="col" colSpan={2} className="text-start">
                                    Set Deposit / Withdraw Limit Setting
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <button
                                      type="button"
                                      className="theme_light_btn btn btn-primary btn btn-primary"
                                      onClick={handleShow}
                                    >
                                      Edit
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Deposit/Withdraw Settings Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={handleClose}
        >
          <div
            className="modal-dialog modal-lg"
            style={{ marginTop: '100px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="border-0 pb-0 modal-header">
                <div className="modal-title-status modal-title h4">
                  Set Deposit / Withdraw Limit
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleClose}
                />
              </div>
              <div className="modal-body">
                <div>
                  <form onSubmit={handleSettingsSubmit}>
                    <div className="row">
                      <div className="mb-2 col-lg-6 col-md-6 col-sm-12">
                        <div className="row">
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                              Min Deposit
                            </span>
                            <input
                              placeholder="Min Deposit"
                              name="minDeposit"
                              type="number"
                              className="mt-1 form-control"
                              value={minDeposit}
                              onChange={(e) => setMinDeposit(e.target.value)}
                              disabled={settingsLoading}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 col-lg-6 col-md-6 col-sm-12">
                        <div className="row">
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                              Max Deposit
                            </span>
                            <input
                              placeholder="Max Deposit"
                              name="maxDeposit"
                              type="number"
                              className="mt-1 form-control"
                              value={maxDeposit}
                              onChange={(e) => setMaxDeposit(e.target.value)}
                              disabled={settingsLoading}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 col-lg-6 col-md-6 col-sm-12">
                        <div className="row">
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                              Min Withdraw
                            </span>
                            <input
                              placeholder="Min Withdraw"
                              name="minWithdraw"
                              type="number"
                              className="mt-1 form-control"
                              value={minWithdraw}
                              onChange={(e) => setMinWithdraw(e.target.value)}
                              disabled={settingsLoading}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 col-lg-6 col-md-6 col-sm-12">
                        <div className="row">
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                              Max Withdraw
                            </span>
                            <input
                              placeholder="Max Withdraw"
                              name="maxWithdraw"
                              type="number"
                              className="mt-1 form-control"
                              value={maxWithdraw}
                              onChange={(e) => setMaxWithdraw(e.target.value)}
                              disabled={settingsLoading}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end align-items-center mt-1">
                      <button
                        type="submit"
                        className="green-btn btn btn-primary"
                        style={{ color: "black" }}
                        disabled={settingsLoading}
                      >
                        {settingsLoading ? "Saving..." : "Submit"}
                      </button>
                      <button
                        type="button"
                        className="theme_light_btn btn btn-primary btn btn-primary"
                        style={{ marginLeft: 10 }}
                        onClick={handleClose}
                        disabled={settingsLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      <Modal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        backdrop="static"
      >
        <div className="allcommon">
          <div className="modal-header">
            <div className="modal-title-status h4 modal-title">
              Change Password
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="test-status border-0">
              <form
                className="change-password-sec"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="d-flex mb-2">
                  <label className="form-label">Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    className={`form-control ${submitted && oldPasswordError ? 'is-invalid' : ''}`}
                    placeholder="Enter Old Password"
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      if (submitted) {
                        setOldPasswordError(validateOldPasswordField(e.target.value));
                      }
                    }}
                    disabled={isLoading}
                  />
                  {submitted && oldPasswordError && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {oldPasswordError}
                    </div>
                  )}
                </div>

                <div className="d-flex mb-2">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className={`form-control ${submitted && newPasswordError ? 'is-invalid' : ''}`}
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (submitted) {
                        setNewPasswordError(validateNewPasswordField(e.target.value));
                        if (confirmPassword) {
                          setConfirmPasswordError(validateConfirmPasswordField(confirmPassword, e.target.value));
                        }
                      }
                    }}
                    disabled={isLoading}
                  />
                  {submitted && newPasswordError && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {newPasswordError}
                    </div>
                  )}
                </div>

                <div className="d-flex mb-2">
                  <label className="form-label">New Password Confirm</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${submitted && confirmPasswordError ? 'is-invalid' : ''}`}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (submitted) {
                        setConfirmPasswordError(validateConfirmPasswordField(e.target.value, newPassword));
                      }
                    }}
                    disabled={isLoading}
                  />
                  {submitted && confirmPasswordError && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {confirmPasswordError}
                    </div>
                  )}
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="green-btn btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Change"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Myprofile;