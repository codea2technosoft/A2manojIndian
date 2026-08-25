import React, { useState, useRef, useEffect } from "react";
import "./Headerall.scss";
import { Modal, Button, Form } from "react-bootstrap";
import { FiUser, FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import {  useLocation } from "react-router-dom";
import { Link } from "react-router";
export default function Header() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const token = localStorage.getItem("token");
    const adminId = localStorage.getItem("adminId");
    const [isLoading, setIsLoading] = useState(false);
    const toggleDropdownall = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setOpen((prev) => !prev);
    };

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
    useEffect(() => {
        document.addEventListener("click", closeDropdown);
        return () => document.removeEventListener("click", closeDropdown);
    }, []);

    
      const handleLogout = () => {
        // ✅ SWAL CONFIRMATION - OPTIONAL
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
            // ✅ CLEAR LOCAL STORAGE
            localStorage.clear();
            sessionStorage.clear();
    
            // ✅ FORCE REDIRECT TO LOGIN
            window.location.href = "/login";
    
            // ✅ EXTRA SAFETY - PAGE RELOAD
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        });
      };
    
      


    const handleSubmit = async () => {
        try {
            console.log("Submit Clicked");

            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/change-user-password-admin`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        admin_id: adminId,
                        oldPassword,
                        newPassword,
                        confirmPassword,

                    }),
                }
            );
            const data = await response.json();
            if (data.success) {
                setIsOpen(false); // Modal Close
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: data.message,
                    confirmButtonText: "OK",
                });
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message,
                });
            }
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <>
            <header className="top-header">
                <div className="logo">
                    <Link to="/dashboard">
                        <img src="https://dummyimage.com/160x45/000/fff&text=VIP+999" alt="" />
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
                        <li className="active">
                            <Link to="/dashboard">Dashboard</Link>
                        </li>

                        <li>
                            <Link to="/agent-list">Clients</Link>
                        </li>

                        <li className="dropdown">
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("report")}
                            >
                                <Link to="/my-account-statement">My Report</Link>
                                {/* <span className={`arrow ${activeDropdown === "report" ? "rotate" : ""}`}>▼</span> */}
                                <span className={`arrow ${activeDropdown === "report" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "report" ? "show" : ""}>
                                <li><Link to="/my-account-statement">Account Statement</Link></li>
                                <li><Link to="/aprofitDownline">Profit/Loss by Downline</Link></li>
                                <li><Link to="/adownlinesportspl">Match Profit Loss</Link></li>
                                <li><Link to="/aprofitMarket">Profit/Loss Report by Market</Link></li>
                                <li><Link to="/profit-loss-sports">Profit/Loss Sports Wise</Link></li>
                                <li><Link to="/aprofitplayer">Profit/Loss Report by Player</Link></li>
                                <li><Link to="/aprofitCasino">Casino Profit/Loss Report by Date</Link></li>
                                <li><Link to="/report/aura">Profit/Loss Aura Casino Bets</Link></li>
                                <li><Link to="/report/international">Profit/Loss International Casino Bets</Link></li>
                                <li><Link to="/report/gap">Profit/Loss Gap Casino Bets</Link></li>
                            </ul>
                        </li>

                        <li>
                            <Link to="/betlist">BetList</Link>
                        </li>

                        <li>
                            <Link to="/bet-live-list">BetListLive</Link>
                        </li>

                        <li>
                            <Link to="/riskmangement">Risk Management</Link>
                        </li>

                        <li className="dropdown">
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("deposit")}
                            >
                                <Link to="/Admindeposit">Deposit</Link>
                                <span className={`arrow ${activeDropdown === "deposit" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "deposit" ? "show" : ""}>
                                <li><Link to="/Admindeposit">Wallet Deposit</Link></li>
                                <li><Link to="/deposite_pending">Deposit History</Link></li>
                            </ul>
                        </li>

                        <li className="dropdown">
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("withdrawal")}
                            >
                                <Link to="/withdrawal_pending_Approve">Withdrawal</Link>
                                <span className={`arrow ${activeDropdown === "withdrawal" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "withdrawal" ? "show" : ""}>
                                <li><Link to="/withdrawal_pending_Approve">Wallet Withdrawal</Link></li>
                                <li><Link to="/withdrawal_complete">Withdrawal History</Link></li>
                            </ul>
                        </li>

                        <li className="dropdown">
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

                        <li className="dropdown">
                            <div
                                className="mobile-title"
                                onClick={() => toggleDropdownall("bank")}
                            >
                                <Link to="/banks">Bank</Link>
                                <span className={`arrow ${activeDropdown === "bank" ? "rotate" : ""}`}></span>
                            </div>
                            <ul className={activeDropdown === "bank" ? "show" : ""}>
                                <li><Link to="/banks">Bank</Link></li>
                                <li><Link to="/sms">SMS</Link></li>
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
                                <li><Link to="/sport-control">Sport Control</Link></li>
                                <li><Link to="/casino-control">Casino Control</Link></li>
                                <li><Link to="/slider_lists">Banner Manager</Link></li>
                                <li><Link to="/offer">Offer</Link></li>
                            </ul>
                        </li>
                    </ul>
                </nav>

                <div className="d-flex align-items-center justify-content-end user-btn col-lg-1 col-sm-3 col-4">
                    <div className="d-flex">
                        {/* Download/Export Icon */}
                        <Link to="/Admindeposit">
                            <div className="header-count cursor-pointer" style={{ cursor: 'pointer', marginRight: '5px' }}>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" color="white" height="14" width="14" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
                                    <path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
                                </svg>
                                <span>0</span>
                            </div>
                        </Link>
                        {/* Upload/Import Icon */}
                        <Link to="/withdrawal_pending_Approve">
                            <div className="header-count cursor-pointer" style={{ cursor: 'pointer' }}>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" color="white" height="14" width="14" xmlns="http://www.w3.org/2000/svg" style={{ color: 'white' }}>
                                    <path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
                                </svg>
                                <span>0</span>
                            </div>
                        </Link>

                        {/* Notification/Message Icon */}
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
                        {/* Button */}
                        <button className="dropdown-btn" onClick={toggleDropdown}>
                            mavip <span className="arrow">▼</span>
                        </button>

                        {/* Menu */}
                        {open && (
                            <div className="dropdown-menu-custom">

                                {/* Balance Section */}
                                <div className="dropdown-item balance-item">
                                    <div className="balance-left">
                                        <span>Main</span>
                                        <strong>INR 10,385,474.21</strong>
                                    </div>
                                    <button className="refresh-btn"><span>
                                        ⟳</span></button>
                                </div>

                                <div className="divider"></div>

                                {/* Items */}
                                <div className="dropdown-item">
                                    <Link to="/my-profile">
                                        <ArrowLong />Profile
                                    </Link>
                                </div>
                                <div className="dropdown-item" onClick={() => setIsOpen(true)}><ArrowLong />Change Password</div>
                                <div className="dropdown-item">
                                    <Link to="/set-limit-setting">
                                        <ArrowLong />Set Deposit / Withdraw Limit Setting
                                    </Link>
                                </div>
                                {/* <div className="dropdown-item logout">
                                    <Link to="/login" onClick={() => {
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("adminId");
                                    }}>
                                        <ArrowLong />Logou
                                    </Link>
                                </div> */}


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
                            onClick={() => setIsOpen(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="test-status border-0">

                            <form
                                className="change-password-sec"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                            >
                                <div className="d-flex mb-2">
                                    <label className="form-label">Old Password</label>

                                    <input
                                        type="password"
                                        name="oldPassword"
                                        className="form-control"
                                        placeholder="Enter Old Password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="d-flex mb-2">
                                    <label className="form-label">New Password</label>

                                    <input
                                        type="password"
                                        name="newPassword"
                                        className="form-control"
                                        placeholder="Enter New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="d-flex mb-2">
                                    <label className="form-label">New Password Confirm</label>

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="text-center mt-4">
                                    <button
                                        type="submit"
                                        className="green-btn btn btn-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Saving..." : "Change"}
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