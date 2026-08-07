import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaCoins,
  FaToggleOff,
  FaToggleOn,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { CiLock } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { IoChatbubbleEllipsesSharp, IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import profileimage from "../asset/image/user-client.png";
import { FaAngleDoubleRight } from "react-icons/fa";
import { MdKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios"; // Add axios import
import { encryptData, decryptData, generateHMAC } from "../Utils/encryption";
import newlogo from "../asset/image/logo.png";
import { addSuperAdminCoins } from "../Server/api";

function Header({ onToggleSidebar }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
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
  const [allReport, setAllReport] = useState(false);
  const [allMaster, setAllMaster] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [password, setPassword] = useState("");
  const [showDepositModal, setShowDepositModal] = useState(false);

  const showReport = () => {
    setAllReport((prev) => !prev);
    setAllMaster(false);
  };

  const showMaster = () => {
    setAllMaster((prev) => !prev);
    setAllReport(false);
  };
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
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            setShowDepositModal(false);
            setCoins(coins);
            setDepositAmount("");
            setPassword("");
            fetchAdminProfile();
          }
        });
      } else {
        Swal.fire("Error", message || "Failed to add coins", "error");
      }
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

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
          admin_id: admin_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
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
    setDarkMode((prev) => !prev);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

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

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ encryptedData, hmac }),
        },
      );

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
            text: decrypted.message,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: decrypted.message,
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
  const allmasterlist = useRef(null);
  const allreportref = useRef(null);
  useEffect(() => {
    const handleOutside = (event) => {
      const clickedOutsideReport =
        allreportref.current && !allreportref.current.contains(event.target);

      const clickedOutsideMaster =
        allmasterlist.current && !allmasterlist.current.contains(event.target);

      if (clickedOutsideReport) {
        setAllReport(false);
      }

      if (clickedOutsideMaster) {
        setAllMaster(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);
  const events = [
    {
      id: 31345701,
      name: "FIFA World Cup",
      url: "/event/detail/31345701",
    },
    {
      id: 33439203,
      name: "ICC Women's T20 World Cup",
      url: "/event/detail/33439203",
    },
    {
      id: 1781349126,
      name: "FIFA WORLD CUP 2026 XTRA MARKET",
      url: "/event/detail/1781349126",
    },
    {
      id: 35754708,
      name: "Zimbabwe v Bangladesh",
      url: "/event/detail/35754708",
    },
    {
      id: 35761854,
      name: "Ruzic v E Raducanu",
      url: "/event/detail/35761854",
    },
    {
      id: 35767500,
      name: "L Midon v S Haita",
      url: "/event/detail/35767500",
    },
    {
      id: 35767846,
      name: "Th Seyboth Wild v Coulibaly",
      url: "/event/detail/35767846",
    },
    {
      id: 35767803,
      name: "Ni McDonald v J Martin Manzano",
      url: "/event/detail/35767803",
    },
  ];
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);

  const wrapperRef = useRef(null);

  const filteredEvents = events.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [activeSearch, setActiveSearch] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShow(false);
        setActiveSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeDropdown = () => {
    setAllReport(false);
    setAllMaster(false);
  };

  return (
    <div className="header" id="header">
      <div className="container-fluid">
        <div className="d-flex justify-content-between w-100">
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
          <div className="d-flex align-items-center">
            <div className=" d-xl-block  d-md-block">
              <div className="togglebutton">
                <AiOutlineMenu onClick={onToggleSidebar} />
              </div>
            </div>
            <div className="searchform">
              <div
                className={`search-wrapper ${activeSearch ? "active" : ""}`}
                onClick={() => setActiveSearch(true)}
                ref={wrapperRef}
              >
                <div className="search-box">
                  <span className="search-icon">
                    <FiSearch />
                  </span>

                  <input
                    type="text"
                    placeholder="Search Events"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShow(true);
                    }}
                    onFocus={() => setShow(true)}
                  />
                </div>

                {activeSearch && (
                  <button
                    type="button"
                    className="search_close"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSearch(false);
                      setShow(false);
                      setSearch("");
                    }}
                  >
                    <IoClose />
                  </button>
                )}

                {show && search !== "" && (
                  <div className="search-dropdown">
                    {filteredEvents.length ? (
                      filteredEvents.map((item) => (
                        <a
                          key={item.id}
                          href={item.url}
                          className="search-item"
                        >
                          {item.name}
                        </a>
                      ))
                    ) : (
                      <div className="no-result">No Events Found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="linksmode">
            <div className="allreport">
              <div className="report_design" onClick={showReport}>
                <span>Reports</span>
                {allReport ? (
                  <MdOutlineKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )}
              </div>
              <div className={`allreport_dropdown ${allReport ? "show" : ""}`}>
                <ul>
                  <li>
                    <Link
                      to={"/reports/account-statement"}
                      onClick={closeDropdown}
                    >
                      <FaAngleDoubleRight /> Account Statement
                    </Link>
                  </li>

                  <li>
                    <Link to={"/reports/profit-loss"} onClick={closeDropdown}>
                      <FaAngleDoubleRight /> Profit Loss
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={"/reports/chip-statement"}
                      onClick={closeDropdown}
                    >
                      <FaAngleDoubleRight /> Chip Statement
                    </Link>
                  </li>

                  <li>
                    <Link to={"/reports/chip-summary"} onClick={closeDropdown}>
                      <FaAngleDoubleRight /> Chip Summary
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={"/reports/settlement-report"}
                      onClick={closeDropdown}
                    >
                      <FaAngleDoubleRight /> Settlement Report
                    </Link>
                  </li>

                  <li>
                    <Link
                      to={"/reports/sport-summary-report"}
                      onClick={closeDropdown}
                    >
                      <FaAngleDoubleRight /> Sport Summary Report
                    </Link>
                  </li>

                  <li>
                    <Link to={"/reports/top-clients"} onClick={closeDropdown}>
                      <FaAngleDoubleRight /> Top Clients
                    </Link>
                  </li>

                  {/* <li>
                  <Link to="/reports/settlement" className="blink hightlightcolor">
                    <FaAngleDoubleRight /> Settlement
                  </Link>
                </li> */}

                  <li>
                    <Link
                      to={"/settlement"}
                      onClick={closeDropdown}
                      className="blink hightlightcolor"
                    >
                      <FaAngleDoubleRight /> Settlement
                    </Link>
                  </li>

                  <li>
                    <Link to={"/reports/balance-sheet"} onClick={closeDropdown}>
                      <FaAngleDoubleRight /> Balance Sheet
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="allreport">
              <div className="report_design" onClick={showMaster}>
                <span>Users</span>
                {allMaster ? (
                  <MdOutlineKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )}
              </div>
              <div
                ref={allmasterlist}
                className={`allreport_dropdown ${allMaster ? "show" : ""}`}
              >
                <ul>
                  <li>
                    <Link to={"/agent_lists"} onClick={closeDropdown}>
                      Super Master
                    </Link>
                  </li>

                  <li>
                    <Link to={"/AgentMasternew"} onClick={closeDropdown}>
                      Master
                    </Link>
                  </li>

                  <li>
                    <Link to={"/Mastermyuser"} onClick={closeDropdown}>
                      Client
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* Coins Display */}
            {/* <div className="coins-display d-flex align-items-center gap-2 mx-3">
            <FaCoins className="text-warning" />
            <span className="fw-bold">{coins}</span>
            <span>Coins</span>
          </div> */}

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
                    {/* <small className="text-muted d-flex align-items-center gap-1">
                    <FaCoins size={12} /> {coins} Coins
                  </small> */}
                  </div>
                </div>
                <div className="profileimage">
                  <img src={profileimage} alt="profileimage" />
                </div>
                {/* <div className={`arrowprofile transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>
                <IoIosArrowDown />
              </div> */}
              </div>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-item flex items-center gap-2 balancedesign">
                    Balance: {coins}
                  </div>
                  {/* <div className="dropdown-item mobile_device">
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
                </div> */}
                  <div
                    className="dropdown-item flex items-center gap-2"
                    onClick={() => setIsOpen(true)}
                  >
                    <span>
                      <CiLock />
                    </span>{" "}
                    Change Password
                  </div>

                  <div
                    className="dropdown-item flex items-center gap-2"
                    onClick={() => setShowDepositModal(true)}
                  >
                    <FaCoins size={14} /> Add Coins
                  </div>
                  <div
                    className="dropdown-item flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <span>
                      <FiLogOut />
                    </span>{" "}
                    Logout
                  </div>
                  <div className="darkmode modebtn">
                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="darkModeSwitch"
                        checked={darkMode}
                        onChange={toggleDarkMode}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* <div className="d-xl-none  d-md-none d-sm-block">
            <div className="togglebutton">
              <AiOutlineMenu onClick={onToggleSidebar} />
            </div>
          </div> */}
          </div>
        </div>
      </div>

      <Modal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        centered
        backdrop="static"
      >
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
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="dark"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDepositModal}
        onHide={() => setShowDepositModal(false)}
        centered
        backdrop="static"
      >
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
          <Button
            variant="primary"
            onClick={handleDeposit}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Deposit"}
          </Button>
          <Button
            variant="dark"
            onClick={() => setShowDepositModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Header;
