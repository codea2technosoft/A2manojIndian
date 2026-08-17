import React, { useState, useRef, useEffect } from "react";
import "./Headerall.scss";
import { Modal, Button, Form } from "react-bootstrap";
import { FiUser, FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../asset/image/logo.png"
import { IoMdArrowDropdown } from "react-icons/io";
import {
  changeMasterPassword,
} from "../Server/api";


export default function Header({ depositPending = 0, withdrawPending = 0 }) {
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
 
    // Toggle dropdown - closes others when opening a new one
    const toggleDropdownall = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    const toggleDropdown = () => {
        setOpen((prev) => !prev);
    };

    // Close custom dropdown when clicking outside
    const closeDropdown = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
        }
    };

    const ArrowLong = () => (
        <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginRight: "5px" }}
        >
            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
        </svg>
    );

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close navigation dropdowns
            const dropdowns = document.querySelectorAll('.dropdown');
            let clickedInsideDropdown = false;

            dropdowns.forEach(dropdown => {
                if (dropdown.contains(event.target)) {
                    clickedInsideDropdown = true;
                }
            });

            if (!clickedInsideDropdown) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Close custom dropdown
    useEffect(() => {
        document.addEventListener("click", closeDropdown);
        return () => document.removeEventListener("click", closeDropdown);
    }, []);

    // Close all dropdowns when route changes
    useEffect(() => {
        setActiveDropdown(null);
        setMobileMenu(false);
        setOpen(false);
    }, [location.pathname]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const header = document.querySelector('.top-header');
            const hamburger = document.querySelector('.hamburger');

            if (mobileMenu && header && !header.contains(event.target)) {
                setMobileMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [mobileMenu]);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, logout!"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        });
    };

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

        // Get fresh adminId from localStorage
        const adminIdFromStorage = localStorage.getItem("admin_id");
        
        // Check if adminId exists
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
            // Prepare payload
            const payload = {
                admin_id: adminIdFromStorage,
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            };

            console.log("Sending payload:", payload); // Debug log

            // Using the imported changeMasterPassword API function
            const response = await changeMasterPassword(payload);

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
        <>
            <header className="top-header">
                <div className="logo">
                    <Link to="/dashboard">
                        <img src={logo} alt="" />
                    </Link>
                </div>

                <div
                    className={`hamburger ${mobileMenu ? "active" : ""}`}
                    onClick={() => setMobileMenu(!mobileMenu)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <nav className={mobileMenu ? "active" : ""}>
                    <ul>
                        <li className={location.pathname === "/dashboard" ? "active" : ""}>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>

                        <li className={location.pathname === "/agent-list" ? "active" : ""}>
                            <Link to="/agent-list">Clients</Link>
                        </li>

                        <li className={`dropdown ${[
                            "/my-account-statement",
                            "/pl-by-downline",
                            "/match-profit-loss",
                            "/pl-by-market",
                            "/profit-loss-sports",
                            "/pl-report-by-player",
                            "/casino-profit-loss-by-date",
                            "/report/aura",
                            "/report/international",
                            "/pl-gap-casino-bets",
                        ].includes(location.pathname)
                            ? "active"
                            : ""
                            }`} >
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("report")}
                            >
                                <Link to="/my-account-statement">My Report</Link>
                                <span className={`arrow ${activeDropdown === "report" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "report" ? "show" : ""}>
                                <li><Link to="/my-account-statement">Account Statement</Link></li>
                                <li><Link to="/pl-by-downline">Profit/Loss by Downline</Link></li>
                                <li><Link to="/match-profit-loss">Match Profit Loss</Link></li>
                                <li><Link to="/pl-by-market">Profit/Loss Report by Market</Link></li>
                                <li><Link to="/match-profit-loss">Profit/Loss Sports Wise</Link></li>
                                <li><Link to="/pl-report-by-player">Profit/Loss Report by Player</Link></li>
                                <li><Link to="/casino-profit-loss-by-date">Casino Profit/Loss Report by Date</Link></li>
                                <li><Link to="pl-aura-casino-bets">Profit/Loss Aura Casino Bets</Link></li>
                                <li><Link to="/pl-international-casino-bets">Profit/Loss International Casino Bets</Link></li>
                                <li><Link to="/pl-gap-casino-bets">Profit/Loss Gap Casino Bets</Link></li>
                            </ul>
                        </li>

                        <li className={location.pathname === "/betlist" ? "active" : ""}>
                            <Link to="/betlist">BetList</Link>
                        </li>

                        <li className={location.pathname === "/bet-live-list" ? "active" : ""}>
                            <Link to="/bet-live-list">BetListLive</Link>
                        </li>

                        <li className={location.pathname === "/riskmangement" ? "active" : ""}>
                            <Link to="/riskmangement">Risk Management</Link>
                        </li> 

                        <li className={`dropdown ${["/Admindeposit", "/deposite_completed_history"].includes(location.pathname)
                            ? "active"
                            : ""
                            }`}>
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("deposit")}
                            >
                                <Link to="/Admindeposit">Deposit</Link>
                                <span className={`arrow ${activeDropdown === "deposit" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "deposit" ? "show" : ""}>
                                <li><Link to="/Admindeposit">Wallet Deposit</Link></li>
                                <li><Link to="/deposite_completed_history">Deposit History</Link></li>
                            </ul>
                        </li>

                        <li className={`dropdown ${["/withdrawal_pending_Approve", "/withdrawal_complete"].includes(location.pathname) ? "active" : ""}`}>
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("withdrawal")}
                            >
                                <Link to="/withdrawal_pending_Approve">Withdrawal</Link>
                                <span className={`arrow ${activeDropdown === "withdrawal" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "withdrawal" ? "show" : ""}>
                                <li ><Link to="/withdrawal_pending_Approve" >Wallet Withdrawal</Link></li>
                                <li><Link to="/withdrawal_complete">Withdrawal History</Link></li>
                            </ul>
                        </li>

                        <li className={`dropdown ${["/banking", "/settlement"].includes(location.pathname)
                            ? "active"
                            : ""
                            }`}>
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("banking")}
                            >
                                <Link to="/banking">Banking</Link>
                                <span className={`arrow ${activeDropdown === "banking" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "banking" ? "show" : ""}>
                                <li><Link to="/banking">Banking D/W</Link></li>
                                <li><Link to="/settlement">Settlement</Link></li>
                            </ul>
                        </li>

                        <li className={`dropdown ${["/banks", "/sms"].includes(location.pathname)
                            ? "active"
                            : ""
                            }`}>
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("bank")}
                            >
                                <Link to="/banks">Bank</Link>
                                <span className={`arrow ${activeDropdown === "bank" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "bank" ? "show" : ""}>
                                <li><Link to="/banks">Bank</Link></li>
                                <li><Link to="/comming-soon">SMS</Link></li>
                            </ul>
                        </li>

                        <li>
                            <Link to="/general-setting">Setting</Link>
                        </li>

                        <li className="dropdown">
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("other")}
                            >
                                <Link to="/sport-control">Other</Link>
                                <span className={`arrow ${activeDropdown === "other" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "other" ? "show" : ""}>
                                <li><Link to="/comming-soon">Sport Control</Link></li>
                                <li><Link to="/comming-soon">Casino Control</Link></li>
                                <li><Link to="/slider_lists">Banner Manager</Link></li>
                                <li><Link to="/comming-soon">Offer</Link></li>
                                {/* <li><Link to="/offer">Offer</Link></li> */}
                            </ul>
                        </li>

                        <li className="dropdown">
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("Sport Management")}
                            >
                                <a href="/">Sport Management</a>
                                <span className={`arrow ${activeDropdown === "Sport Management" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "Sport Management" ? "show" : ""}>
                                <li><a href="/sports">Sports</a></li>
                                <li><a href="/cricket">cricket</a></li>
                                <li><a href="/view_match">Declare Fancy Results </a></li>
                                <li><a href="/declare_result">Declare Match Results </a></li>
                                <li><a href="/declare_result_horsegreyhund">Declare Horse & Greyhound Results </a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>

                <div className="d-flex align-items-center justify-content-end user-btn col-lg-1 col-sm-3 col-4">
                    <div className="d-flex">
                        <Link to="/Admindeposit">
                            <div className="header-count cursor-pointer" style={{ cursor: 'pointer', marginRight: '5px' }}>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" color="white" height="14" width="14" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
                                    <path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
                                </svg>
                                <span>{depositPending}</span>
                            </div>
                        </Link>

                        <Link to="/withdrawal_pending_Approve">
                            <div className="header-count cursor-pointer" style={{ cursor: 'pointer' }}>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" color="white" height="14" width="14" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
                                    <path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
                                </svg>
                                <span>{withdrawPending}</span>
                            </div>
                        </Link>

                        <div className="header-count cursor-pointer" style={{ cursor: 'pointer' }}>
                            <Link to="/adminchat">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" color="white" height="14" width="14" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
                                    <path d="M12 2C6.486 2 2 6.486 2 12v4.143C2 17.167 2.897 18 4 18h1a1 1 0 0 0 1-1v-5.143a1 1 0 0 0-1-1h-.908C4.648 6.987 7.978 4 12 4s7.352 2.987 7.908 6.857H19a1 1 0 0 0-1 1V18c0 1.103-.897 2-2 2h-2v-1h-4v3h6c2.206 0 4-1.794 4-4 1.103 0 2-.833 2-1.857V12c0-5.514-4.486-10-10-10z"></path>
                                </svg>
                               <span>0</span>
                            </Link>
                        </div>
                    </div>
                    <div className="custom-dropdown" ref={dropdownRef}>
                        <button className="dropdown-btn" onClick={toggleDropdown}>
                            MALotus77VIP <span className="arrow"><IoMdArrowDropdown/></span>
                        </button>
                        {open && (
                            <div className="dropdown-menu-custom">
                                <div className="dropdown-item balance-item">
                                    <div className="balance-left">
                                        <span>Main</span>
                                        <strong>INR 10,385,474.21</strong>
                                    </div>
                                    <button className="refresh-btn"><span>⟳</span></button>
                                </div>

                                <div className="divider"></div>

                                <div className="dropdown-item">
                                    <Link to="/my-profile" onClick={() => setOpen(false)}>
                                        <ArrowLong />Profile
                                    </Link>
                                </div>
                                <div className="dropdown-item" onClick={(e) => {
                                    e.preventDefault();
                                    handleOpenModal();
                                }}>
                                    <ArrowLong />Change Password
                                </div>
                                <div className="dropdown-item">
                                    <Link to="/my-profile" onClick={() => setOpen(false)}>
                                        <ArrowLong />Set Deposit / Withdraw Limit Setting
                                    </Link>
                                </div>

                                <div
                                    className="dropdown-item flex items-center gap-2 text-danger"
                                    onClick={handleLogout}
                                >
                                    <FiLogOut /> Logout
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

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