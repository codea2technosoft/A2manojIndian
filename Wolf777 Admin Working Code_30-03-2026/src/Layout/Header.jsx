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
import { addSuperAdminCoins } from "../Server/api"
function Header({ onToggleSidebar }) {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setUsername] = useState("");
  const [coins, setCoins] = useState(0);
  console.log("coins",coins)
  const [AdminNotifiaction, setAdminNotifiaction] = useState(0);
  const [adminData, setAdminData] = useState(null);
  const socketRef = useRef(null);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const admin_id = localStorage.getItem("admin_id");
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      if (!admin_id || !role || !token) {
        console.warn("Missing authentication data");
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const adminProfile = response.data.data.admin_profile;
        setAdminData(adminProfile);
        setUsername(adminProfile.username || "");
        setCoins(adminProfile.coins || 0);
        localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !password) {
      Swal.fire("Error", "Please enter amount and password", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await addSuperAdminCoins({
        admin_id: localStorage.getItem("admin_id"),
        password,
        coins: String(depositAmount),
      });
      const { status, message, coins } = response;
       if (status) {
        Swal.fire({
        title: "Success",
        text: message,
        icon: "success",
        confirmButtonText: "OK"
      }).then((result) => {
        if (result.isConfirmed) {
          setShowDepositModal(false);
          setCoins(coins);
          setDepositAmount("");
          setPassword("");
          fetchAdminProfile();
        }
      });   
    }else {
        Swal.fire("Error", message || "Failed to add coins", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error?.response?.data?.message,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
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
      startY = e.touches[0].clientY;
      pullStartTime = Date.now();
    };

    const onTouchMove = (e) => {
      if (window.scrollY <= 10 && e.touches[0].clientY > startY + 50) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (isRefreshing) return;

      const distance = e.changedTouches[0].clientY - startY;
      const duration = Date.now() - pullStartTime;

      if (distance > 120 && duration < 1000 && window.scrollY <= 10) {
        isRefreshing = true;

        const loader = document.createElement("div");
        loader.id = "page-refresh-loader";
        loader.style.cssText = `
          position: fixed;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99999;
          background: #fff;
          padding: 8px;
          border-radius: 50px;
        `;

        loader.innerHTML = `<div class="google-spinner"></div>`;
        document.body.appendChild(loader);

        if (!document.getElementById("pull-style")) {
          const style = document.createElement("style");
          style.id = "pull-style";
          style.innerHTML = `
            .google-spinner {
              width: 30px;
              height: 30px;
              border: 3px solid #ccc;
              border-top: 3px solid #000;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `;
          document.head.appendChild(style);
        }

        setTimeout(() => {
          document.getElementById("page-refresh-loader")?.remove();
          window.location.reload();
        }, 600);
      }
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
              src={
                isDark
                  ? `${process.env.PUBLIC_URL}/assets/images/logo.png`
                  : `${process.env.PUBLIC_URL}/assets/images/logo.png`
              }
              alt="logo"
              className="logo-lg"
              height="40"
            />
          </a>
        </div>

        <div className=" d-xl-block  d-md-block d-sm-none d-none">
          <div className="togglebutton">
            <AiOutlineMenu onClick={onToggleSidebar} />
          </div>
        </div>
        <div className="linksmode">


          {/* Coins Display */}
          <div className="coins-display d-flex gap-2">
            <div className="d-flex">
              <FaCoins className="text-warning" />
              <span className="fw-bold">Coin:</span>
            </div>
            <span className="">{coins}</span>
          </div>

          {/* <div className="chat_header_icon chat_new">
            <Link to="/adminchat">
              <IoChatbubbleEllipsesSharp />
              {AdminNotifiaction > 0 && <span> {AdminNotifiaction}</span>}
            </Link>
          </div> */}
          {/* <div className="darkmode" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </div> */}


          <div className="profilie" ref={dropdownRef}>
            <div className="profile-header" onClick={toggleDropdown}>
              {/* <div className="profileimage">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
                  alt="Avatar"
                />
              </div> */}
              <div className="desktop_device">

                <div className="name d-flex flex-column">
                  <span>{username}</span>
                  <small className="text-muted d-flex align-items-center gap-1">
                    {/* <FaCoins size={12} /> {coins} Coinsffffffffffff */}
                  </small>
                </div>
              </div>
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
                    {/* <div className="profileimage">
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
                        alt="Avatar"
                      />
                    </div> */}
                    <div className="name">
                      <div>{username}</div>
                      <small className="text-muted d-flex align-items-center gap-1">
                        {/* <FaCoins size={12} /> {coins} Coinsfffffffffff */}
                      </small>
                    </div>
                  </div>
                </div>
                <div
                  className="dropdown-item flex items-center gap-2"
                  onClick={() => setIsOpen(true)}
                >
                  <FiUser /> Change Password
                </div>
                <div className="dropdown-item flex items-center gap-2" onClick={() => setShowDepositModal(true)}>
                  <FaCoins size={14} /> Add Coins
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
      <Modal show={showDepositModal} onHide={() => setShowDepositModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Deposit Coins</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="1"
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDepositModal(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeposit} disabled={isLoading}>
            {isLoading ? "Processing..." : "Deposit"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Header;