import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

import {
  getAdminProfile,//agent profild data
  changeMasterPassword,
  getUserProfileData////user profil data 
} from "../../Server/api";

const AccountSummary = () => {
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
  const role = searchParams.get('role') || localStorage.getItem("role") || 2;
  
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    mobileNumber: '-',
    walletBalance: 0,
    availableToBet: 0,
    availableToWithdraw: 0,
    currentExposure: 0,
    referralCode: '',
    referralLink: ''
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation states for password
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Validation functions
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

  // Validate all fields before submission
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

  // Fetch admin profile data
  const fetchAdminProfile = async () => {
    if (!adminId) {
      console.error("No admin_id found");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        admin_id: adminId,
        role: parseInt(role) || 2
      };
      
      console.log("Fetching profile with payload:", payload);
      
      const response = await getAdminProfile(payload);
      console.log("Profile Response:", response);
      
      const profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data || {};
      
      // ✅ SIRF AGENT KA NAME
      const agentUsername = profileData.username || profileData.name || adminId;
      
      // ✅ localStorage SET KARO - SIRF USERNAME
      localStorage.setItem("headerUserName", agentUsername);
      
      console.log("Agent Username:", agentUsername);
      
      setUserData({
        name: agentUsername,
        username: agentUsername,
        mobileNumber: profileData.mobile || profileData.mobileNumber || '-',
        walletBalance: profileData.balance || profileData.walletBalance || 0,
        availableToBet: profileData.availableToBet || profileData.available_balance || 0,
        availableToWithdraw: profileData.availableToWithdraw || profileData.withdraw_balance || 0,
        currentExposure: profileData.exposure || profileData.currentExposure || 0,
        referralCode: profileData.referral_code || '0012',
        referralLink: `https://lotus77vip.com/register?referral_code=${profileData.referral_code || '0012'}`
      });
      
    } catch (error) {
      console.error("Error fetching profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load profile data",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Copied to clipboard",
        timer: 2000,
        showConfirmButton: false,
      });
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Copied to clipboard",
        timer: 2000,
        showConfirmButton: false,
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!validateAllFields()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        admin_id: adminId,
        newPassword: newPassword
      };

      console.log("Change Password Payload:", payload);

      const response = await changeMasterPassword(payload);
      console.log("Change Password Response:", response);

      const isSuccess = response?.success || response?.data?.success || false;
      const messageText = response?.message || response?.data?.message || "Password changed successfully";

      if (isSuccess) {
        setIsOpen(false);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: messageText,
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
          text: messageText || "Failed to change password",
        });
      }
    } catch (err) {
      console.error(err);
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

  return (
    <>
      <Layout activeItem="account-summary">
        <div className="inner-wrapper">
          <h2 className="common-heading">   <i className="fas fa-user" /> Account Summary</h2>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading profile...</p>
            </div>
          ) : (
            <section className="account-table w-100">
              {/* Wallet Table */}
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Wallet</th>
                      <th scope="col">Available to Bet</th>
                      <th scope="col">Funds available to withdraw</th>
                      <th scope="col">Current exposure</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Main wallet</td>
                      <td>{userData.coins || 0}</td>
                      <td>{userData.availableToWithdraw}</td>
                      <td>{userData.currentExposure}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Profile Section */}
              <div className="profile-tab">
                <div className="row">
                  <div className="col-lg-7 col-md-12">
                    <h2 className="common-heading">Profile</h2>

                    {/* User Info Table */}
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col" className="text-start">User Name</th>
                          <th scope="col" className="text-start">Mobile Number</th>
                          <th scope="col" className="text-start">Password</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-start">{userData.username}</td>
                          <td className="text-start">{userData.mobileNumber}</td>
                          <td className="text-start">
                            <a
                              className="text-decoration-none text-white btn theme_light_btn"
                              onClick={() => {
                                setIsOpen(true);
                                setSubmitted(false);
                                setOldPasswordError("");
                                setNewPasswordError("");
                                setConfirmPasswordError("");
                              }}
                            >
                              Edit <i className="fas fa-pen text-white ps-1" />
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Limits & Referral Code Table */}
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col" colSpan={6} className="text-start">
                            Limits & Referral Code
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ fontWeight: 600 }}>
                          <td className="text-start" width="25%">
                            Referral Code
                          </td>
                          <td
                            colSpan={3}
                            className="text-start"
                            style={{ cursor: "pointer", color: "#0d6efd" }}
                            onClick={() => copyToClipboard(userData.referralLink)}
                          >
                            {userData.referralLink}
                          </td>
                        </tr>
                        {/* <tr>
                          <td className="text-start" width="25%">
                            Referral Code
                          </td>
                          <td
                            colSpan={3}
                            className="text-start"
                            style={{ cursor: "pointer", color: "#0d6efd" }}
                            onClick={() => copyToClipboard(userData.referralCode)}
                          >
                            {userData.referralCode}
                          </td>
                        </tr> */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </Layout>
      
      <Modal
        show={isOpen}
        onHide={() => {
          setIsOpen(false);
          setSubmitted(false);
          setOldPasswordError("");
          setNewPasswordError("");
          setConfirmPasswordError("");
        }}
        backdrop="static">
        <div className="allcommon">
          <div className="modal-header">
            <div className="modal-title-status h4 modal-title">
              Change Password
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                setIsOpen(false);
                setSubmitted(false);
                setOldPasswordError("");
                setNewPasswordError("");
                setConfirmPasswordError("");
              }}
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
                    onClick={() => {
                      setIsOpen(false);
                      setSubmitted(false);
                      setOldPasswordError("");
                      setNewPasswordError("");
                      setConfirmPasswordError("");
                    }}
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
};

export default AccountSummary;