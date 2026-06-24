import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaCoins } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios"; // Add axios import
import {
  encryptData,
  decryptData,
  generateHMAC,
} from "../Utils/encryption";
import newlogo from "../assets/images/logonew.png"

function Header({ onToggleSidebar }) {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState("");
  const [coins, setCoins] = useState(0);
  const [AdminNotifiaction, setAdminNotifiaction] = useState(0);
  const [adminData, setAdminData] = useState(null);
  const socketRef = useRef(null);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // const fetchAdminProfile = async () => {
  //   try {
  //     const admin_id = localStorage.getItem("admin_id");
  //     const role = localStorage.getItem("role");
  //     const token = localStorage.getItem("token");

  //     if (!admin_id || !role || !token) {
  //       console.warn("Missing authentication data");
  //       return;
  //     }

  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/get-data`,
  //       {
  //         role: role,
  //         admin_id: admin_id
  //       },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     if (response.data.success && response.data.data?.admin_profile) {
  //       const adminProfile = response.data.data.admin_profile;
  //       setAdminData(adminProfile);
  //       setUsername(adminProfile.username || "");
  //       localStorage.setItem("super_agent_id", adminProfile.super_agent_id);
  //       localStorage.setItem("super_admin_id", adminProfile.super_admin_id);
  //       localStorage.setItem("master_admin_id", adminProfile.master_admin_id);

  //       setCoins(adminProfile.coins || 0);

  //       // You can also save to localStorage if needed elsewhere
  //       localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching admin profile:", error);
  //     // Handle error appropriately
  //   }
  // };





  const fetchAdminProfile = async () => {
    try {
      const admin_id = localStorage.getItem("admin_id");
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      if (!admin_id || !role || !token) {
        console.warn("Missing authentication data");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-data`,
        {
          role: role,
          admin_id: admin_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success && response.data.data?.admin_profile) {
        const adminProfile = response.data.data.admin_profile;

        // 🔴 CHECK ACTIVE & BLOCK STATUS
        if (adminProfile.active === 0 || adminProfile.is_blocked === "1") {
          localStorage.clear(); // optional but recommended
          navigate("/login");
          return;
        }

        setAdminData(adminProfile);
        setUsername(adminProfile.username || "");
        setCoins(adminProfile.coins || 0);

        localStorage.setItem("super_agent_id", adminProfile.super_agent_id);
        localStorage.setItem("super_admin_id", adminProfile.super_admin_id);
        localStorage.setItem("master_admin_id", adminProfile.master_admin_id);
        localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      navigate("/login");
    }
  };
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-theme");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.body.classList.contains("dark-theme"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
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
        const socket = io("https://sara777chatapi.sindoor7.com", {
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

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill all password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Confirm Password Wrong",
      });
      return;
    }
    setIsLoading(true);
    try {
      const secretKey = process.env.REACT_APP_SECRET_KEY;

      const requestData = { oldPassword, newPassword, confirmPassword };

      const encryptedData = encryptData(requestData, secretKey);
      const hmac = generateHMAC(encryptedData, secretKey);

      const token = decryptData(localStorage.getItem("token"), secretKey);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ encryptedData, hmac }),
      });

      const text = await response.text();
      let resJson = {};

      try {
        resJson = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid JSON from server");
      }

      if (resJson.encryptedData) {
        const decrypted = decryptData(resJson.encryptedData, secretKey);

        if (!decrypted) {
          throw new Error("Failed to decrypt data");
        }

        if (decrypted.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: decrypted.message
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: decrypted.message
          });
        }
        return;
      }

      if (resJson.message) {
        Swal.fire({
          icon: resJson.success ? "success" : "error",
          title: resJson.success ? "Success" : "Error",
          text: resJson.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unknown response from server",
        });
      }

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };


  useEffect(() => {
    let startY = 0;
    let isRefreshing = false;
    let pullStartTime = 0;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        pullStartTime = Date.now();
      }
    };

    const onTouchMove = (e) => {
      if (window.scrollY <= 10 && e.touches[0].clientY > startY + 50) {
        e.preventDefault(); // stop scroll
      }
    };

    const onTouchEnd = (e) => {
      if (isRefreshing) return;

      const endY = e.changedTouches[0].clientY;
      const distance = endY - startY;
      const pullDuration = Date.now() - pullStartTime;

      if (distance > 120 && window.scrollY <= 10 && pullDuration < 1000) {
        isRefreshing = true;

        // ===== LOADER WRAPPER =====
        const loaderWrap = document.createElement("div");
        loaderWrap.id = "page-refresh-loader";
        loaderWrap.style.cssText = `
        position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    opacity: 1;
    transition: opacity 0.2s;
    background: #fff;
    border-radius: 50px;
    padding: 7px;
      `;

        // ===== NORMAL GOOGLE-STYLE SPINNER =====
        const loader = document.createElement("div");
        loader.className = "google-spinner";

        // ===== CSS INJECT (ONCE) =====
        if (!document.getElementById("pull-refresh-style")) {
          const style = document.createElement("style");
          style.id = "pull-refresh-style";
          style.innerHTML = `
         .google-spinner {
    border: 3px solid #cdcdcd;
    border-top: 3px solid #000;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    background: #fff;
}

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
          document.head.appendChild(style);
        }

        loaderWrap.appendChild(loader);
        document.body.appendChild(loaderWrap);

        // ===== SIMULATE REFRESH =====
        setTimeout(() => {
          console.log("Refresh Done");
          const el = document.getElementById("page-refresh-loader");
          if (el) el.remove();
          isRefreshing = true;
          window.location.reload();
        }, 100);
      }

      startY = 0;
      pullStartTime = 0;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="header" id="header">
      <div className="d-flex justify-content-between px-2 w-100">
        <div className="logo-box d-xl-none d-md-none d-sm-block">
          <a href="/dashboard">
            <img
              src={isDark ? newlogo : newlogo}
              alt="logo"
              className="logo-lg"
              style={{
                width: "50px",
                height: "auto",
                objectFit: "contain",
                maxWidth: "100%",
              }}
            />
          </a>
        </div>
        <div className=" d-xl-block  d-md-block d-sm-none d-none">
          <div className="togglebutton">
            <AiOutlineMenu onClick={onToggleSidebar} />
          </div>
        </div>
        <div className="linksmode">
          {/* <div className="darkmode" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </div> */}

          {/* Coins Display */}
          <div className="coins-display d-flex align-items-center gap-2 mx-3">
            <FaCoins className="text-warning" />
            <span className="fw-bold">{coins}</span>
            <span>Coins</span>
          </div>

          {/* <div className="chat_header_icon chat_new">
            <Link to="/adminchat">
              <IoChatbubbleEllipsesSharp />
              {AdminNotifiaction > 0 && <span> {AdminNotifiaction}</span>}
            </Link>
          </div>
           */}
          <div className="profilie" ref={dropdownRef}>
            <div className="profile-header" onClick={toggleDropdown}>
              {/* <div className="profileimage">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
                  alt="Avatar"
                />
              </div> */}
              <div className="name desktop_device">
                <div className="d-flex flex-column">

                  <span>{username}</span>
                  <small className="text-muted d-flex align-items-center gap-1">
                    <FaCoins size={12} /> {coins} Coins
                  </small>
                </div>
              </div>
              <div className={`arrowprofile transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>
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
                    <div className="name">
                      <div>{username}</div>
                      <small className="text-muted d-flex align-items-center gap-1">
                        <FaCoins size={12} /> {coins} Coins
                      </small>
                    </div>
                  </div>
                </div>
                {/* <div
                  className="dropdown-item flex items-center gap-2"
                  onClick={() => setIsOpen(true)}
                >
                  <FiUser /> Change Password
                </div> */}
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

      <Modal show={isOpen} onHide={() => setIsOpen(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Header;