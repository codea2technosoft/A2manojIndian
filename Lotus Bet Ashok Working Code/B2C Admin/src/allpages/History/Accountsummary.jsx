import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Layout from './Layout';
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

import {
  getAdminProfile,//agent profild data
  // changeMasterPassword,
  changeMasterPasswordAgent,
  getUserProfileData,////user profil data 
  ChangeExposureLimit
} from "../../Server/api";

const AccountSummary = () => {
  const [searchParams] = useSearchParams();
  const adminId = searchParams.get('admin_id') || localStorage.getItem("admin_id");
  const role = searchParams.get('role') || localStorage.getItem("role");
  const [showExposureModal, setShowExposureModal] = useState(false);
  const [exposureLimit, setExposureLimit] = useState('');
  const [exposurePassword, setExposurePassword] = useState('');
  const [exposureLoading, setExposureLoading] = useState(false);

  // Check if current page is lifetime-PL
  const location = useLocation();
  const isLifetimePL = location.pathname.includes('/lifetime-PL');

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
  // Fetch admin profile data - Fix for exposure_limit
  // const fetchAdminProfile = async () => {
  //   if (!adminId) {
  //     console.error("No admin_id found");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const payload = {
  //       admin_id: adminId,
  //       role: parseInt(role) || 2
  //     };

  //     console.log("Fetching profile with payload:", payload);
  //     console.log("Role:", role);

  //     let response;
  //     let profileData;

  //     // Check if role is 3 (user) or 2 (agent)
  //     if (parseInt(role) === 3) {
  //       // User profile
  //       console.log("Fetching user profile data");
  //       response = await getUserProfileData(payload);
  //       console.log("User Profile Response:", response);
  //       // User data is inside admin_profile
  //       profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data || {};
  //     } else {
  //       // Agent profile (role 2 or any other)
  //       console.log("Fetching admin/agent profile data");
  //       response = await getAdminProfile(payload);
  //       console.log("Admin Profile Response:", response);
  //       profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data || {};
  //     }

  //     // Get username from profile data
  //     const username = profileData.username || profileData.name || adminId;

  //     // Set localStorage with username
  //     localStorage.setItem("headerUserName", username);

  //     console.log("Username:", username);
  //     console.log("Profile Data:", profileData);

  //     // ✅ Get exposure from exposure_limit (for user) or exposure (for agent)
  //     const exposureValue = parseInt(role) === 3
  //       ? (profileData.exposure_limit || 0)  // User: use exposure_limit
  //       : (profileData.exposure || profileData.totalExposer || 0); // Agent: use exposure or totalExposer

  //     setUserData({
  //       name: username,
  //       username: username,
  //       mobileNumber: profileData.phoneNumber || profileData.mobile || profileData.mobileNumber || '-',
  //       walletBalance: profileData.balance || profileData.walletBalance || profileData.credit || 0,
  //       availableToBet: profileData.availableToBet || profileData.available_balance || 0,
  //       availableToWithdraw: profileData.availableToWithdraw || profileData.withdraw_balance || 0,
  //       currentExposure: exposureValue, // ✅ Fixed
  //       referralCode: profileData.referral_code || '-',
  //       referralLink: `https://lotus77vip.com/home?referral_code=${profileData.referral_code || '-'}`
  //     });

  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: error.response?.data?.message || "Failed to load profile data",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Fetch admin profile data
  // const fetchAdminProfile = async () => {
  //   if (!adminId) {
  //     console.error("No admin_id found");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const payload = {
  //       admin_id: adminId,
  //       role: parseInt(role) || 2
  //     };

  //     console.log("Fetching profile with payload:", payload);
  //     console.log("Role:", role);

  //     let response;
  //     let profileData;

  //     // Check if role is 3 (user) or 2 (agent)
  //     if (parseInt(role) === 3) {
  //       // User profile
  //       console.log("Fetching user profile data");
  //       response = await getUserProfileData(payload);
  //       console.log("User Profile Response:", response);

  //       // ✅ FIX: User data is inside user_profile, not admin_profile
  //       profileData = response?.data?.data?.user_profile || response?.data?.user_profile || response?.data?.data || response?.data || {};

  //       console.log("Extracted User Profile Data:", profileData);
  //     } else {
  //       // Agent profile (role 2 or any other)
  //       console.log("Fetching admin/agent profile data");
  //       response = await getAdminProfile(payload);
  //       console.log("Admin Profile Response:", response);
  //       profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data?.data || response?.data || {};
  //     }

  //     // Get username from profile data
  //     const username = profileData.username || profileData.name || adminId;

  //     // Set localStorage with username
  //     localStorage.setItem("headerUserName", username);

  //     console.log("Username:", username);
  //     console.log("Profile Data:", profileData);

  //     // ✅ FIX: Get exposure from exposure_limit for users
  //     const exposureValue = parseInt(role) === 3
  //       ? (profileData.currentExposure  || 0)  // User: use exposure_limit
  //       : (profileData.currentExposure || profileData.currentExposure || 0); // Agent: use exposure or totalExposer

  //     setUserData({
  //       name: username,
  //       username: username,
  //       mobileNumber: profileData.phoneNumber || profileData.mobile || profileData.mobileNumber || '-',
  //       walletBalance: profileData.balance || profileData.walletBalance || profileData.credit || 0,
  //       availableToBet: profileData.availableToBet || profileData.available_balance || 0,
  //       availableToWithdraw: profileData.availableToWithdraw || profileData.withdraw_balance || 0,
  //       currentExposure: exposureValue,
  //       referralCode: profileData.referral_code || '-',
  //       referralLink: `https://lotus77vip.com/home?referral_code=${profileData.referral_code || '-'}`
  //     });

  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: error.response?.data?.message || "Failed to load profile data",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch admin profile data
  // const fetchAdminProfile = async () => {
  //   if (!adminId) {
  //     console.error("No admin_id found");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const payload = {
  //       admin_id: adminId,
  //       role: parseInt(role) || 2
  //     };

  //     console.log("Fetching profile with payload:", payload);
  //     console.log("Role:", role);

  //     let response;
  //     let profileData;

  //     // Check if role is 3 (user) or 2 (agent)
  //     if (parseInt(role) === 3) {
  //       // User profile
  //       console.log("Fetching user profile data");
  //       response = await getUserProfileData(payload);
  //       console.log("User Profile Response:", response);

  //       // ✅ User data is inside user_profile
  //       profileData = response?.data?.data?.user_profile || response?.data?.user_profile || response?.data?.data || response?.data || {};

  //       console.log("Extracted User Profile Data:", profileData);
  //     } else {
  //       // Agent profile (role 2 or any other)
  //       console.log("Fetching admin/agent profile data");
  //       response = await getAdminProfile(payload);
  //       console.log("Admin Profile Response:", response);
  //       profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data?.data || response?.data || {};
  //     }

  //     // Get username from profile data
  //     const username = profileData.username || profileData.name || adminId;

  //     // Set localStorage with username
  //     localStorage.setItem("headerUserName", username);

  //     console.log("Username:", username);
  //     console.log("Profile Data:", profileData);

  //     // ✅ ROLE 3 (USER) KE LIYE ALAG-ALAG VALUES
  //     let currentExposureValue = 0;
  //     let exposureLimitValue = 0;
  //     let formattedCurrentExposure = '0';

  //     if (parseInt(role) === 3) {
  //       // 🔥 User ke liye: currentExposure aur exposure_limit alag-alag
  //       currentExposureValue = profileData.currentExposure || profileData.total_exposure || 0;
  //       exposureLimitValue = profileData.exposure_limit || 0;

  //       // ✅ Formatted value agar available hai toh use karo
  //       if (profileData.formatted?.currentExposure) {
  //         formattedCurrentExposure = profileData.formatted.currentExposure;
  //       } else {
  //         formattedCurrentExposure = currentExposureValue;
  //       }

  //       console.log("Current Exposure:", currentExposureValue);
  //       console.log("Exposure Limit:", exposureLimitValue);
  //       console.log("Formatted Current Exposure:", formattedCurrentExposure);
  //     } else {
  //       // Agent ke liye (role 2)
  //       currentExposureValue = profileData.exposure || profileData.totalExposer || 0;
  //       exposureLimitValue = currentExposureValue; // Agent ke liye same
  //       formattedCurrentExposure = currentExposureValue;
  //     }

  //     setUserData({
  //       name: username,
  //       username: username,
  //       mobileNumber: profileData.phoneNumber || profileData.mobile || profileData.mobileNumber || '-',
  //       walletBalance: profileData.balance || profileData.walletBalance || profileData.credit || 0,
  //       availableToBet: profileData.availableToBet || profileData.available_balance || 0,
  //       availableToWithdraw: profileData.availableToWithdraw || profileData.withdraw_balance || 0,
  //       // ✅ Dono values alag-alag store karo
  //       currentExposure: formattedCurrentExposure, // Formatted value "INR 1200.00"
  //       exposureLimit: exposureLimitValue, // Raw value 5000
  //       currentExposureRaw: currentExposureValue, // Raw value 1200 (edit ke liye)
  //       referralCode: profileData.referral_code || '-',
  //       referralLink: `https://lotus77vip.com/home?referral_code=${profileData.referral_code || '-'}`
  //     });

  //   } catch (error) {
  //     console.error("Error fetching profile:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: error.response?.data?.message || "Failed to load profile data",
  //       confirmButtonText: "OK",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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
      console.log("Role:", role);

      let response;
      let profileData;

      // Check if role is 3 (user) or 2 (agent)
      if (parseInt(role) === 3) {
        // User profile
        console.log("Fetching user profile data");
        response = await getUserProfileData(payload);
        console.log("User Profile Response:", response);

        // ✅ User data is inside user_profile
        profileData = response?.data?.data?.user_profile || response?.data?.user_profile || response?.data?.data || response?.data || {};

        console.log("Extracted User Profile Data:", profileData);
      } else {
        // Agent profile (role 2 or any other)
        console.log("Fetching admin/agent profile data");
        response = await getAdminProfile(payload);
        console.log("Admin Profile Response:", response);
        profileData = response?.data?.data?.admin_profile || response?.data?.admin_profile || response?.data?.data || response?.data || {};
      }

      // Get username from profile data
      const username = profileData.username || profileData.name || adminId;

      // Set localStorage with username
      localStorage.setItem("headerUserName", username);

      console.log("Username:", username);
      console.log("Profile Data:", profileData);

      // ✅ ROLE 3 (USER) KE LIYE ALAG-ALAG VALUES
      let currentExposureValue = 0;
      let exposureLimitValue = 0;
      let formattedCurrentExposure = '0';

      if (parseInt(role) === 3) {
        // 🔥 User ke liye: currentExposure aur exposure_limit alag-alag
        currentExposureValue = profileData.currentExposure || profileData.total_exposure || 0;
        exposureLimitValue = profileData.exposure_limit || 0;

        // ✅ Formatted value agar available hai toh use karo
        if (profileData.formatted?.currentExposure) {
          formattedCurrentExposure = profileData.formatted.currentExposure;
        } else {
          formattedCurrentExposure = currentExposureValue;
        }

        console.log("Current Exposure:", currentExposureValue);
        console.log("Exposure Limit:", exposureLimitValue);
        console.log("Formatted Current Exposure:", formattedCurrentExposure);
      } else {
        // 🔥 Agent ke liye (role 2) - SIRF EK LINE CHANGE
        // ✅ Direct currentExposure use karo jo response mein aa raha hai
        currentExposureValue = profileData.currentExposure || profileData.exposure || profileData.totalExposer || 0;
        exposureLimitValue = currentExposureValue; // Agent ke liye same
        formattedCurrentExposure = currentExposureValue;

        console.log("Agent Current Exposure:", currentExposureValue);
      }

      setUserData({
        name: username,
        username: username,
        mobileNumber: profileData.phoneNumber || profileData.mobile || profileData.mobileNumber || '-',
        walletBalance: profileData.balance || profileData.walletBalance || profileData.credit || 0,
        availableToBet: profileData.availableToBet || profileData.available_balance || 0,
        availableToWithdraw: profileData.availableToWithdraw || profileData.withdraw_balance || 0,
        // ✅ Dono values alag-alag store karo
        currentExposure: formattedCurrentExposure, // Formatted value "INR 1200.00"
        exposureLimit: exposureLimitValue, // Raw value 5000
        currentExposureRaw: currentExposureValue, // Raw value 1200 (edit ke liye)
        referralCode: profileData.referral_code || '-',
        referralLink: `https://lotus77vip.com/home?referral_code=${profileData.referral_code || '-'}`
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
        newPassword: newPassword,
        oldPassword: oldPassword  // ✅ YAHAN ADD KARO
      };

      console.log("Change Password Payload:", payload);

      const response = await changeMasterPasswordAgent(payload);
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

  // Open Exposure Limit Modal
  // const openExposureModal = () => {
  //   setExposureLimit(userData.currentExposure || '');
  //   setExposurePassword('');
  //   setShowExposureModal(true);
  // };
  // Open Exposure Limit Modal - NULL set karo
  // const openExposureModal = () => {
  //   setExposureLimit(''); // ✅ Empty string / null
  //   setExposurePassword('');
  //   setShowExposureModal(true);
  // };

  // Open Exposure Limit Modal
  const openExposureModal = () => {
    // ✅ Exposure limit ka raw value show karo (5000)
    setExposureLimit(userData.exposureLimit || '');
    setExposurePassword('');
    setShowExposureModal(true);
  };


  // Handle Exposure Limit Change
  const handleExposureLimitChange = async (e) => {
    e.preventDefault();

    if (!exposureLimit || exposureLimit <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid exposure limit",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!exposurePassword || exposurePassword.trim() === '') {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter your password",
        confirmButtonText: "OK",
      });
      return;
    }

    setExposureLoading(true);
    try {
      const payload = {
        admin_id: adminId,
        exposure_limit: Number(exposureLimit),
        password: exposurePassword
      };

      console.log("Change Exposure Limit Payload:", payload);

      const response = await ChangeExposureLimit(payload);
      console.log("Change Exposure Limit Response:", response);

      if (response?.data?.success || response?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response?.data?.message || "Exposure limit updated successfully!",
          confirmButtonText: "OK",
        });
        setShowExposureModal(false);
        setExposurePassword('');
        // Refresh profile data
        fetchAdminProfile();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.message || "Failed to update exposure limit",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating exposure limit:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonText: "OK",
      });
    } finally {
      setExposureLoading(false);
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
                      <td>{Number(userData.availableToBet).toFixed(2)}</td>
                      <td>{Number(userData.availableToWithdraw).toFixed(2)}</td>
                      {/* <td>{userData.currentExposure}</td> */}
                   <td>{String(userData.currentExposure || "").replace(/^INR\s*/, "")}</td>
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

                    {/* Limits & Referral Code Table - Only for Agents (role 2) */}
                    {/* {parseInt(role) === 2 && (
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
                        </tbody>
                      </table>
                    )} */}

                    {/* ✅ ROLE 2 (AGENT) - Exposure Details */}
                    {parseInt(role) === 2 && (
                      <table className="table mt-3">
                        <thead>
                          <tr>
                            <th scope="col" colSpan={6} className="text-start">
                              Agent Details
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 🔥 Current Exposure - Agent ke liye */}
                          {/* <tr style={{ fontWeight: 600 }}>
                            <td className="text-start" width="30%">
                              Current Exposure
                            </td>
                            <td className="text-start" style={{ fontWeight: 'bold', color: '#0d6efd' }}>
                              {userData.currentExposure || 0}
                            </td>
                            <td className="text-end"></td>
                          </tr> */}

                          {/* Referral Code */}
                          <tr style={{ fontWeight: 600 }}>
                            <td className="text-start" width="30%">
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
                        </tbody>
                      </table>
                    )}

                    {/* ✅ NEW: Exposure Limit Table - Only for Users (role 3) */}
                    {/* {parseInt(role) === 3 && (
                      <table className="table mt-3">
                        <thead>
                          <tr>
                            <th scope="col" colSpan={6} className="text-start">
                              Exposure Limit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ fontWeight: 600 }}>
                            <td className="text-start" width="25%">
                              Exposure Limit
                            </td>
                            <td className="text-start" style={{ fontWeight: 'bold' }}>
                              {userData.exposure_limit || 0}
                            </td>
                            <td className="text-end">
                              <span
                                className="text-decoration-none text-white btn theme_light_btn"
                                onClick={openExposureModal}
                                style={{ cursor: 'pointer', padding: '4px 12px', fontSize: '14px' }}
                              >
                                Edit <i className="fas fa-pen text-white ps-1" />
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )} */}
                    {/* ✅ Exposure Limit Table - Only for Users (role 3) */}
                    {parseInt(role) === 3 && (
                      <table className="table mt-3">
                        <thead>
                          <tr>
                            <th scope="col" colSpan={6} className="text-start">
                              Exposure Details
                            </th>
                          </tr>
                        </thead>
                        <tbody>


                          {/* 🔥 Exposure Limit - Raw value */}
                          <tr style={{ fontWeight: 600 }}>
                            <td className="text-start" width="30%">
                              Exposure Limit
                            </td>
                            <td className="text-start" style={{ fontWeight: 'bold' }}>
                              {userData.exposureLimit || 0}
                            </td>
                            <td className="text-end">
                              <span
                                className="text-decoration-none text-white btn theme_light_btn"
                                onClick={openExposureModal}
                                style={{ cursor: 'pointer', padding: '4px 12px', fontSize: '14px' }}
                              >
                                Edit <i className="fas fa-pen text-white ps-1" />
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </Layout>

      {/* Change Password Modal */}
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

      {/* Change Exposure Limit Modal */}
      {showExposureModal && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowExposureModal(false)}
          >
            <div
              className="modal-dialog modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">Change Exposure Limit</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowExposureModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleExposureLimitChange}>
                    {/* Current Exposure Limit Display */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Exposure Limit</label>
                      <div className="form-control bg-light" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                        ₹ {userData.exposureLimit || 0}
                      </div>
                    </div>

                    {/* New Exposure Input */}
                    {/* New Exposure Input */}
                    <div className="mb-3">
                      <label className="form-label">Exposure</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter Exposure"
                        value={exposureLimit}  // ✅ Empty/null value
                        onChange={(e) => setExposureLimit(e.target.value)}
                        min="0"
                        step="1"
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter Password"
                        value={exposurePassword}
                        onChange={(e) => setExposurePassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="text-center mt-4">
                      <button
                        type="submit"
                        className="green-btn btn btn-primary"
                        disabled={exposureLoading}
                      >
                        {exposureLoading ? 'Saving...' : 'Change'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => setShowExposureModal(false)}
                        disabled={exposureLoading}
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
    </>
  );
};

export default AccountSummary;