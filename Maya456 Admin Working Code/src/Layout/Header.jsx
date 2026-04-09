import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi"; // Profile and Logout icons
import { Link } from "react-router-dom";
import { MdNotificationsActive } from "react-icons/md";
import { io } from "socket.io-client";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


function Header({ onToggleSidebar }) {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [name, setName] = useState("");
  const [AdminNotifiaction, setAdminNotifiaction] = useState(0);
  const socketRef = useRef(null);
  const token = localStorage.getItem("token");
  const [profilePassword, setProfilePassword] = useState(""); // ye add kar do
  const [showOld, setShowOld] = useState(false);
const [showNew, setShowNew] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);


  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      const username = email.split("@")[0];
      setName(username.charAt(0).toUpperCase() + username.slice(1)); // Optional: capitalize
    }
  }, []);
  useEffect(() => {
    fetchMarkets();
    profileData();
  }, []);
  const fetchMarkets = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/chat-header-notification-count`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setAdminNotifiaction(data.totalUnseenAdmin);
    } catch (err) {
      console.error("Error fetching market list:", err);
    } finally {
    }
  };
  const profileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}admin-profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success == "1") {
        setProfilePassword(data.data.password); // store password in state
        const psd = localStorage.getItem("psd");
        if (psd != data.data.password) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        }
      }
    } catch (err) {
      console.error("Error fetching market list:", err);
    } finally {
    }
  };
useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.body.classList.toggle("dark-theme", savedMode);
  }, []);

  // Toggle function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark-theme", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.body.classList.contains("dark-theme"));
    };

    checkDarkMode(); // Initial check

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect(); // Cleanup on unmount
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!socketRef.current) {
      try {
        const socket = io("https://chatapi.maya456.com", {
          transports: ["websocket"],
          withCredentials: true,
          reconnection: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log("✅ Connected with socket ID:", socket.id);
          socket.emit("join", {
            userId: "user123",
            role: "user",
          });
        });

        socket.on("receive_messageAdminnotifiactionCount", (data) => {
          setAdminNotifiaction(data.totalUnseenAdmin);
        });

        socket.on("disconnect", () => {
          console.log("⚠️ Socket disconnected");
        });

        socket.on("connect_error", (err) => {
          console.error("❌ Connection Error:", err);
        });

        socket.on("error", (err) => {
          console.error("❌ General Socket Error:", err);
        });
      } catch (e) {
        console.error("❌ Exception in socket setup:", e);
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 Socket disconnected on unmount");
        socketRef.current = null;
      }
    };
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const handleSubmit = async () => {
  //   // console.log("Old:", oldPassword);
  //   console.log("New:", newPassword);
  //   // console.log("Confirm:", confirmPassword);

  //   // if (newPassword !== confirmPassword) {
  //   //   Swal.fire({
  //   //     icon: "error",
  //   //     title: "Failed",
  //   //     text: "Confirm Password Wrong",
  //   //   });
  //   //   return;
  //   // }

  //   let apiUrl = `${process.env.REACT_APP_API_URL}/admin-update-password`; // change endpoint
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         password: newPassword,
  //         id: "self",
  //       }),
  //     });

  //     const result = await response.json();

  //     if (result.success === "1") {
  //       localStorage.setItem("psd", result.psd);
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: "Password changed successfully.",
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Failed",
  //         text: result.message || "Password change failed",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Password change error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Something went wrong!",
  //     });
  //   }

  //   setIsOpen(false);
  // };

  const handleSubmit = async () => {
    // 1. Check if all fields filled
    if (!oldPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "All fields are required!",
      });
      return;
    }

    // 2. Old password check (API fetched password)
    if (oldPassword !== profilePassword) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Old password is incorrect!",
      });
      return;
    }

    // 3. New and Confirm password match
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "New and Confirm password do not match!",
      });
      return;
    }

    // 4. API call to update password
    let apiUrl = `${process.env.REACT_APP_API_URL}/admin-update-password`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
          id: "self",
        }),
      });

      const result = await response.json();

      if (result.success === "1") {
        localStorage.setItem("psd", result.psd);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Password changed successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        setIsOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: result.message || "Password change failed",
        });
      }
    } catch (error) {
      console.error("Password change error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };



  return (
    <div className="header" id="header">
      <div className="d-flex justify-content-between px-2 w-100">
        <div className="logo-box d-xl-none d-md-none d-sm-block">
          <Link className="logo-light" to="/dashboard">
            <img
              src={
                isDark
                  ? `${process.env.PUBLIC_URL}/assets/images/logo_dark1.png`
                  : `${process.env.PUBLIC_URL}/assets/images/logo.png`
              }
              alt="logo"
              className="logo-lg"
              height="40"
            />
          </Link>
        </div>
        <div className=" d-xl-block  d-md-block d-sm-none d-none">
          <div className="togglebutton">
            <AiOutlineMenu onClick={onToggleSidebar} />
          </div>
        </div>
        <div className="linksmode">
          <div className="darkmode" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </div>
          {/* <div className="notification chat_header_icon">
            <MdNotificationsActive />
          </div> */}
          <div className="chat_header_icon chat_new">
            <Link to="/adminchat">
              <IoChatbubbleEllipsesSharp />
              <span> {AdminNotifiaction}</span>
            </Link>
          </div>
          <div className="profilie" ref={dropdownRef}>
            <div className="profile-header" onClick={toggleDropdown}>
              <div className="profileimage">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
                  alt="Avatar"
                />
              </div>
              <div className="name desktop_device">{name}</div>
              <div
                className={`arrowprofile transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""
                  }`}
              >
                <IoIosArrowDown />
              </div>
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item mobile_device">
                  <div className="d-flex gap-2 align-items-center">
                    <div className="profileimage">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
                        alt="Avatar"
                      />
                    </div>
                    <div className="name">{name}</div>
                  </div>
                </div>
                <div
                  className="dropdown-item flex items-center gap-2"
                  onClick={() => setIsOpen(true)}
                >
                  <FiUser /> Change Password 
                </div>
                <div
                  className="dropdown-item flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <FiLogOut /> Logout
                </div>
              </div>
            )}
          </div>

          <div className="d-xl-none  d-md-none d-sm-block">
            <div className="togglebutton">
              <AiOutlineMenu onClick={onToggleSidebar} />
            </div>
          </div>
        </div>
      </div>

      {/* {isOpen && (
        <>


          <div className="modal-password">
            <div className="modal-overlay" onClick={() => setIsOpen(false)}></div>

            <div className="modal-card">
              <div className="modal-header">
                <h3 className="modal-title">Change Password</h3>
              </div>

              <div className="modal-body">
                <div className="password-input">
                  <input
                    type="password"
                    placeholder="New Password"
                    className="modal-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setIsOpen(false)}>
                  Cancel
                </button>
                <button className="btn-save" onClick={handleSubmit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )} */}

      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Verify Your Old Password & Update</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Old Password */}
          <Form.Group controlId="formOldPassword" className="mb-3 position-relative">
            <Form.Label>Old Password <span style={{ color: "red" }}>*</span> </Form.Label>
            <Form.Control
              type={showOld ? "text" : "password"}
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <span
              onClick={() => setShowOld(!showOld)}
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              {showOld ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
          </Form.Group>

          {/* New Password */}
          <Form.Group controlId="formNewPassword" className="mb-3 position-relative">
            <Form.Label>New Password <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              type={showNew ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              onClick={() => setShowNew(!showNew)}
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              {showNew ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
          </Form.Group>

          {/* Confirm Password */}
          <Form.Group controlId="formConfirmPassword" className="mb-3 position-relative">
            <Form.Label>Confirm Password <span style={{ color: "red" }}>*</span></Form.Label>
            <Form.Control
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              {showConfirm ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
            </span>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>

          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>

          <Button variant="danger" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
      
        </Modal.Footer>
      </Modal>


    </div>
  );
}

export default Header;
