import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import wallet from "../assets/images/wallet.png";

const API_URL = process.env.REACT_APP_API_URL;
// const WS_URL = process.env.REACT_APP_WS_URL;

function Header({ onToggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profile, setProfile] = useState({});
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchProfile = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("current password is ", data.data.password);
      setCurrentPassword(data.data.password);
      setName(data.data.name);
      setuserEmail(data.data.email);
    } catch (err) {
      console.error("Fetch Profile error:", err);
    }
  };


  const fetchCount = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/notification-count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.warn("data notification", data.data);
      setUnreadCount(data.data?.[0]?.unseen_count || 0);
    } catch (err) {
      console.error("Fetch Profile error:", err);
    }
  };

  useEffect(() => {
    fetchCount();
    fetchProfile();
  }, []);


  const handleBellClick = () => {
    setUnreadCount(0);
    navigate("/notification-list");
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const handleShowProfileModal = () => {
    setShowProfileModal(true);
    setDropdownOpen(false);
  };

  const handleShowChangePasswordModal = () => {
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordErrors({});
    setShowChangePasswordModal(true);
    setDropdownOpen(false);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!newPassword) {
      errors.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long.";
    }
    if (!confirmNewPassword) {
      errors.confirmNewPassword = "Confirm password is required.";
    }
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "New password and confirm password do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) {
      return;
    }
    setIsPasswordChanging(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setIsPasswordChanging(false);
        showCustomMessageModal("Authentication Error", "No authentication token found. Please log in again.", "error");
        return;
      }
      const response = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword, name: name }),
      });
      if (response.ok) {
        const result = await response.json();
        showCustomMessageModal(result.message || "Password changed successfully!", "success");
        handleCloseChangePasswordModal();
        fetchProfile();
      } else {
        const errorData = await response.json();
        showCustomMessageModal(`Error: ${errorData.message || "Failed to change password."}`, "error");
      }
    } catch (error) {
      console.error("Change password error:", error);
      showCustomMessageModal(`An unexpected error occurred: ${error.message}`, "error");
    } finally {
      setIsPasswordChanging(false);
    }
  };


  useEffect(() => {
    const socket = new WebSocket(process.env.REACT_APP_WS_URL);

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      const token = localStorage.getItem("token");
      if (token) {
        socket.send(JSON.stringify({ type: "auth", token }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Incoming socket data:", data);

        if (data.event === "receive_message") {
          console.log("🔔 Received Notification:", data);

          if (Array.isArray(data.rows)) {
            setNotifications((prev) => [...data.rows, ...prev]);
          }

          fetchCount();
        }

        if (data.event === "notification_count") {
          console.log("🔢 Updated total count:", data.count);
          setUnreadCount(data.count || 0);
        }
      } catch (err) {
        console.error("Socket parse error:", err);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);


  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true); // show custom button
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); // show native install dialog
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      alert("App installed successfully ✅");
    } else {
      alert("Installation dismissed ❌");
    }
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  return (
    <div className="header" id="header">
      <div className="d-flex justify-content-between px-2 w-100 gap-1 align-items-center">
        <div className="logo-box d-xl-none d-md-none d-sm-block">
          <Link className="logo-light" to="/dashboard">
            <img src={`${process.env.PUBLIC_URL}/assets/images/logo.png`} alt="logo" className="logo-lg" />
          </Link>
        </div>
        <div className="d-flex gap-2 align-items-center">
          {showInstall && (
            <button
              onClick={handleInstallClick}
              className="pwabutton"
            >
              Install App
            </button>
          )}
          <div className=" d-xl-block d-md-block d-sm-none d-none">
            <div className="togglebutton">
              <AiOutlineMenu onClick={onToggleSidebar} />
            </div>
          </div>
          <div className="desktop-show">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <div className="wallet">
                <div className="">
                  <div className="credit_amount">
                    <Link
                      to="/admin-wallet-report"
                      className="gap-2 wallet-link d-flex align-items-center text-decoration-none"
                    >
                      <div className="walletimage">
                        <img src={wallet} alt="wallet" />
                      </div>
                      <div className="text-dark">
                        <div className="referdetailscontent text-center">
                          <p className="mb-1 d-none d-md-block">Wallet Ledger</p>
                          <h3 className="m-0 fw-normal text-success">
                                                        
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>



        <div className="linksmode">
          <div className="d-xl-block position-relative">
            <div className="allheader border-0" onClick={handleBellClick} style={{ cursor: "pointer" }}>
              <FaBell />
              {unreadCount > 0 && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          <div className="profilie" ref={dropdownRef}>
            <div className="profile-header" onClick={toggleDropdown}>
              <div className="profileimage">
                <img src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`} alt="Avatar" />
              </div>
              <div className="name desktop_device">{userEmail}</div>
              <div className={`arrowprofile transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>
                <IoIosArrowDown />
              </div>
            </div>
            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item mobile_device">
                  <div className="d-flex gap-2 align-items-center">
                    <div className="profileimage">
                      <img src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`} alt="Avatar" />
                    </div>
                    <div className="name">{name}</div>
                  </div>
                </div>
                <div className="dropdown-item d-flex align-items-center gap-1" onClick={handleShowProfileModal}>
                  <FiUser />
                  Profile
                </div>
                <div className="dropdown-item d-flex align-items-center gap-1" onClick={handleShowChangePasswordModal}>
                  <FiLock />
                  Change Password
                </div>
                <div className="dropdown-item d-flex align-items-center gap-1" onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </div>
              </div>
            )}
          </div>

          <div className="d-xl-none d-md-none d-sm-block">
            <div className="togglebutton">
              <AiOutlineMenu onClick={onToggleSidebar} />
            </div>
          </div>
        </div>
      </div>

      {/* Profile View Modal */}
      <Modal show={showProfileModal} onHide={handleCloseProfileModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Profile Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="userNameDisplay">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3" controlId="userEmailDisplay">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" value={userEmail} readOnly />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProfileModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showChangePasswordModal} onHide={handleCloseChangePasswordModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordErrors.newPassword) setPasswordErrors(prev => ({ ...prev, newPassword: null }));
                }}
                isInvalid={!!passwordErrors.newPassword}
                placeholder="Enter new password"
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.newPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmNewPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  if (passwordErrors.confirmNewPassword) setPasswordErrors(prev => ({ ...prev, confirmNewPassword: null }));
                }}
                isInvalid={!!passwordErrors.confirmNewPassword}
                placeholder="Confirm new password"
              />
              <Form.Control.Feedback type="invalid">
                {passwordErrors.confirmNewPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={isPasswordChanging}>
              {isPasswordChanging ? "Changing..." : "Change Password"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${messageModalContent.type === 'success' ? 'border-success' : messageModalContent.type === 'error' ? '' : ''}`}>
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className={`modal-title ${messageModalContent.type === 'success' ? 'text-success' : messageModalContent.type === 'error' ? 'text-danger' : 'text-warning'}`}>
                  {messageModalContent.title}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomMessageModal}></button>
              </div>
              <div className="modal-body text-secondary">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {messageModalContent.confirmAction ? (
                  <>
                    <Button variant="secondary" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                    <Button
                      variant={messageModalContent.type === 'warning' ? 'warning' : 'primary'}
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={messageModalContent.type === 'success' ? 'success' : messageModalContent.type === 'error' ? 'danger' : 'primary'}
                    onClick={closeCustomMessageModal}
                  >
                    OK
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;