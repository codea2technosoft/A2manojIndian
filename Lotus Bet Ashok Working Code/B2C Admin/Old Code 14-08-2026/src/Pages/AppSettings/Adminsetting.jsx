import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import { CiSettings } from "react-icons/ci";
import Heading from '../../Layout/Heading'
import password from '../../asset/image/changepass.png'
import transferuser from '../../asset/image/transferuser.png'
import setting from '../../asset/image/setting.png'
import { useNavigate } from "react-router-dom";
import {
    changeMasterPassword,
} from "../../Server/api";


function Adminsetting() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const token = localStorage.getItem("token");
    const adminId = localStorage.getItem("admin_id");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Validation states
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

    const toggleDropdownall = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    // Validate all fields before submission
    const validateAllFields = () => {
        const oldPassError = validateOldPasswordField(oldPassword);
        const newPassError = validateNewPasswordField(newPassword);
        const confirmPassError = validateConfirmPasswordField(confirmPassword, newPassword);

        setOldPasswordError(oldPassError);
        setNewPasswordError(newPassError);
        setConfirmPasswordError(confirmPassError);

        // Check if old and new passwords are same
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

        // Validate all fields
        if (!validateAllFields()) {
            return;
        }

        setIsLoading(true);
        try {
            // Using the imported changeMasterPassword API function
            const response = await changeMasterPassword({
                admin_id: adminId,
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            });

            console.log("Full Response:", response);

            // Check if response is successful - handling both response structures
            const isSuccess = response?.success || response?.data?.success || false;
            const message = response?.message || response?.data?.message || "Password changed successfully";

            if (isSuccess) {
                setIsOpen(false); // Modal Close
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: message,
                    confirmButtonText: "OK",
                });
                // Reset form
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

            // Handle specific error cases
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
        // Reset password fields and errors when opening modal
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOldPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");
        setSubmitted(false);
    };

    return (
        <div>
            <Heading title="Admin Setting" />
            <div className="setting_dashboard">
                <div className="setting_dashboard_block">
                    <h2 className="common-heading">General Settings</h2>
                    <ul>
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleOpenModal();
                                }}
                            >
                                <figure>
                                    <img
                                        src={password}
                                        alt="Change Password"
                                    />
                                </figure>
                            </a>
                        </li>
                        <li>
                            <a
                                href="/transfer-agent"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/transfer-agent");  // ✅ SIRF YAHAN CHANGE
                                }}
                            >
                                <figure>
                                    <img
                                        src={transferuser}
                                        alt="Promotional"
                                        style={{ height: 130, width: "100%" }}
                                    />
                                </figure>
                            </a>
                        </li>

                        <li>
                            <a
                                href="/admin-general-settings"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/admin-general-settings");
                                }}
                            >
                                <figure>
                                    <img
                                        src={setting}
                                        alt="setting"
                                        style={{ height: 130, width: "100%" }}
                                    />
                                </figure>
                            </a>
                        </li>

                    </ul>
                </div>
            </div>

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
        </div>
    )
}

export default Adminsetting;