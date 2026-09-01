import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaCoins } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser, FiLogOut, FiMoon, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { CiLock } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import profileimage from "../asset/image/user-client.png";
import { FaAngleDoubleRight } from "react-icons/fa";
import { MdKeyboardArrowDown, MdLightMode, MdOutlineKeyboardArrowUp } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { encryptData, decryptData, generateHMAC } from "../Utils/encryption";
import newlogo from "../asset/image/logo.png";
import { addSuperAdminCoins, getAllEvents } from "../Server/api";

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
const [showPassword, setShowPassword] = useState(false);

  // ✅ Separate refs for each dropdown
  const reportDropdownRef = useRef(null);
  const masterDropdownRef = useRef(null);

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
        }
      );

      if (response.data.success && response.data.data?.admin_profile) {
        const adminProfile = response.data.data.admin_profile;

        if (adminProfile.active === 0 || adminProfile.is_blocked === "1") {
          localStorage.clear();
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
      } else {
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

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ✅ Close dropdown on outside click - Combined handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      // Close reports dropdown
      if (reportDropdownRef.current && !reportDropdownRef.current.contains(event.target)) {
        setAllReport(false);
      }

      // Close master dropdown
      if (masterDropdownRef.current && !masterDropdownRef.current.contains(event.target)) {
        setAllMaster(false);
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

  // Socket connection code remains the same...
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

  // const handleSubmit = async () => {
  //   // Password change logic remains the same...
  //   if (!oldPassword || !newPassword || !confirmPassword) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Missing Fields",
  //       text: "Please fill all password fields.",
  //     });
  //     return;
  //   }

  //   if (newPassword !== confirmPassword) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed",
  //       text: "Confirm Password Wrong",
  //     });
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     const secretKey = process.env.REACT_APP_SECRET_KEY;

  //     const requestData = { oldPassword, newPassword, confirmPassword };

  //     const encryptedData = encryptData(requestData, secretKey);
  //     const hmac = generateHMAC(encryptedData, secretKey);

  //     const token = decryptData(localStorage.getItem("token"), secretKey);

  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_URL}/change-password`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ encryptedData, hmac }),
  //       }
  //     );

  //     const text = await response.text();
  //     let resJson = {};

  //     try {
  //       resJson = JSON.parse(text);
  //     } catch (e) {
  //       throw new Error("Invalid JSON from server");
  //     }

  //     if (resJson.encryptedData) {
  //       const decrypted = decryptData(resJson.encryptedData, secretKey);

  //       if (!decrypted) {
  //         throw new Error("Failed to decrypt data");
  //       }

  //       if (decrypted.success) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Success",
  //           text: decrypted.message,
  //         });
  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Failed",
  //           text: decrypted.message,
  //         });
  //       }
  //       return;
  //     }

  //     if (resJson.message) {
  //       Swal.fire({
  //         icon: resJson.success ? "success" : "error",
  //         title: resJson.success ? "Success" : "Error",
  //         text: resJson.message,
  //       });
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Unknown response from server",
  //       });
  //     }
  //   } catch (err) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: err.message,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //     setIsOpen(false);
  //   }
  // };

  // Pull to refresh code remains the same...
 

// const handleSubmit = async () => {
//   if (!oldPassword || !newPassword || !confirmPassword) {
//     Swal.fire({
//       icon: "error",
//       title: "Missing Fields",
//       text: "Please fill all password fields.",
//     });
//     return;
//   }

//   if (newPassword !== confirmPassword) {
//     Swal.fire({
//       icon: "error",
//       title: "Failed",
//       text: "Confirm Password Wrong",
//     });
//     return;
//   }
  
//   setIsLoading(true);
//   try {
//     const token = localStorage.getItem("token");
//     const admin_id = localStorage.getItem("admin_id"); // ✅ YEH ADD KIYA
    
//     const requestData = { 
//       admin_id,        // ✅ ADDED
//       oldPassword, 
//       newPassword, 
//       confirmPassword 
//     };

//     const response = await fetch(
//       `${process.env.REACT_APP_API_URL}/change-password`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestData),
//       }
//     );

//     const resJson = await response.json();

//     if (resJson.success) {
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: resJson.message || "Password changed successfully!",
//       });
//       setIsOpen(false);
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: resJson.message || "Something went wrong",
//       });
//     }
//   } catch (err) {
//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: err.message || "Network error",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };

// const handleSubmit = async () => {
//   if (!oldPassword || !newPassword || !confirmPassword) {
//     Swal.fire({
//       icon: "error",
//       title: "Missing Fields",
//       text: "Please fill all password fields.",
//     });
//     return;
//   }

//   if (newPassword !== confirmPassword) {
//     Swal.fire({
//       icon: "error",
//       title: "Failed",
//       text: "Confirm Password Wrong",
//     });
//     return;
//   }
  
//   setIsLoading(true);
//   try {
//     const token = localStorage.getItem("token");
//     const admin_id = localStorage.getItem("admin_id");
    
//     // ✅ SIRF YEH 3 FIELDS BHEJO
//     const requestData = { 
//       admin_id,
//       oldPassword,
//       password: newPassword  // ✅ newPassword ko "password" key se bhejo
//     };

//     const response = await fetch(
//       `${process.env.REACT_APP_API_URL}/change-password`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestData),
//       }
//     );

//     const resJson = await response.json();

//     if (resJson.success) {
//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: resJson.message || "Password changed successfully!",
//       });
//       setIsOpen(false);
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//     } else {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: resJson.message || "Something went wrong",
//       });
//     }
//   } catch (err) {
//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: err.message || "Network error",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };

const handleSubmit = async () => {
  // if (!oldPassword || !newPassword || !confirmPassword) {  // ✅ OLD VALIDATION COMMENTED
  if (!newPassword || !confirmPassword) {  // ✅ SIRF NEW + CONFIRM CHECK
    Swal.fire({
      icon: "error",
      title: "Missing Fields",
      text: "Please fill all password fields.",
    });
    return;
  }

  
  // ✅ NEW: Minimum 6 characters validation
  if (newPassword.length < 6) {
    Swal.fire({
      icon: "error",
      title: "Weak Password",
      text: "Password must be at least 6 characters long.",
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
    const token = localStorage.getItem("token");
    const admin_id = localStorage.getItem("admin_id");
    
    const requestData = { 
      admin_id,
      // oldPassword,  // ✅ COMMENTED - Profile se auto lega
      password: newPassword  // ✅ Sirf new password bhejo
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      }
    );

    const resJson = await response.json();

    if (resJson.success) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: resJson.message || "Password changed successfully!",
      });
      setIsOpen(false);
      // setOldPassword("");  // ✅ COMMENTED
      setNewPassword("");
      setConfirmPassword("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: resJson.message || "Something went wrong",
      });
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message || "Network error",
    });
  } finally {
    setIsLoading(false);
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
        e.preventDefault();
      }
    };

    const onTouchEnd = (e) => {
      if (isRefreshing) return;

      const endY = e.changedTouches[0].clientY;
      const distance = endY - startY;
      const pullDuration = Date.now() - pullStartTime;

      if (distance > 120 && window.scrollY <= 10 && pullDuration < 1000) {
        isRefreshing = true;

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

        const loader = document.createElement("div");
        loader.className = "google-spinner";

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

  const searchWrapperRef = useRef(null);

  const filteredEvents = events.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        <div className="d-flex align-items-center">
          <div className=" d-xl-block  d-md-block">
            <div className="togglebutton">
              <AiOutlineMenu onClick={onToggleSidebar} />
            </div>
          </div>
          <div className="searchform">
            <div className="search-wrapper" ref={searchWrapperRef}>
              {show && search !== "" && (
                <div className="search-dropdown">
                  {filteredEvents.length ? (
                    filteredEvents.map((item) => (
                      <a key={item.id} href={item.url} className="search-item">
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
          {/* ✅ Reports Dropdown with its own ref */}
          <div className="allreport" ref={reportDropdownRef}>
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
                  <a href="/reports/account-statement">
                    <FaAngleDoubleRight /> Account Statement
                  </a>
                </li>
                <li>
                  <a href="/reports/profit-loss">
                    <FaAngleDoubleRight /> Profit Loss
                  </a>
                </li>
                <li>
                  <a href="/reports/chip-statement">
                    <FaAngleDoubleRight /> Chip Statement
                  </a>
                </li>
                <li>
                  <a href="/reports/chip-summary">
                    <FaAngleDoubleRight /> Chip Summary
                  </a>
                </li>
                <li>
                  <a href="/reports/settlement-report">
                    <FaAngleDoubleRight /> Settlement Report
                  </a>
                </li>
                <li>
                  <a href="/reports/sport-summary-report">
                    <FaAngleDoubleRight /> Sport Summary Report
                  </a>
                </li>
                <li>
                  <a href="/reports/top-clients">
                    <FaAngleDoubleRight /> Top Clients
                  </a>
                </li>
                <li>
                  <a href="/super-agent-ledger" className="blink hightlightcolor">
                    <FaAngleDoubleRight /> Settlement
                  </a>
                </li>
                <li>
                  <a href="/reports/balance-sheet">
                    <FaAngleDoubleRight /> Balance Sheet
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ✅ Users Dropdown with its own ref */}
          <div className="allreport" ref={masterDropdownRef}>
            <div className="report_design" onClick={showMaster}>
              <span>Users</span>
              {allMaster ? (
                <MdOutlineKeyboardArrowUp />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </div>
            <div
              className={`allreport_dropdown ${allMaster ? "show" : ""}`}
            >
              <ul>
                <li>
                  <Link to={'/agent_lists'}>Super Master</Link>
                </li>
                <li>
                  <Link to={'/AgentMasternew'}>Master</Link>
                </li>
                <li>
                  <Link to={'/Mastermyuser'}>Client</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="profilie" ref={dropdownRef}>
            <div className="profile-header" onClick={toggleDropdown}>
              <div className="name desktop_device">
                <div className="d-flex flex-column">
                  <span>{username}</span>
                </div>
              </div>
              <div className="profileimage">
                <img src={profileimage} alt="profileimage" />
              </div>
            </div>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-item flex items-center gap-2 balancedesign">
                  Balance: {coins}
                </div>
                <div
                  className="dropdown-item flex items-center gap-2"
                  onClick={() => setIsOpen(true)}
                >
                  <span><CiLock /></span> Change Password
                </div>
                <div
                  className="dropdown-item flex items-center gap-2"
                  onClick={() => setShowDepositModal(true)}
                >
                  <FaCoins size={14} /> Add Coins
                </div>
                <div
                  className="dropdown-item  flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <span className=""><FiLogOut className=""/></span> Logout
                </div>
                <div className="darkmode modebtn">
                  <div className="light-icon">
                    <span>Light</span>
                    <MdLightMode />
                  </div>
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
                  <div className="dark-icon">
                    <FiMoon />
                    <span>Dark </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals remain the same */}
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
  {/* ✅ OLD PASSWORD FIELD COMMENTED - Profile se auto fill hoga */}
  {/* <Form.Group style={{ position: "relative" }} className="mb-3">
    <Form.Label>Old Password</Form.Label>
    <Form.Control
      type={showPassword === "old" ? "text" : "password"}
      placeholder="Enter old password"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      disabled={isLoading}
    />
    <span
      onClick={() => setShowPassword(showPassword === "old" ? null : "old")}
      style={{
        position: "absolute",
        right: "12px",
        top: "30px",
        cursor: "pointer",
        color: "#6c757d",
        zIndex: 10,
      }}
    >
      {showPassword === "old" ? (
        <FaEyeSlash size={18} />
      ) : (
        <FaEye size={18} />
      )}
    </span>
  </Form.Group> */}

  <Form.Group style={{ position: "relative" }} className="mb-3">
    <Form.Label>New Password</Form.Label>
    <Form.Control
      type={showPassword === "new" ? "text" : "password"}
      placeholder="Enter new password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      disabled={isLoading}
    />
    <span
      onClick={() => setShowPassword(showPassword === "new" ? null : "new")}
      style={{
        position: "absolute",
        right: "12px",
        top: "30px",
        cursor: "pointer",
        color: "#6c757d",
        zIndex: 10,
      }}
    >
      {showPassword === "new" ? (
        <FaEyeSlash size={18} />
      ) : (
        <FaEye size={18} />
      )}
    </span>
  </Form.Group>
  
  <Form.Group style={{ position: "relative" }} className="mb-3">
    <Form.Label>Confirm Password</Form.Label>
    <Form.Control
      type={showPassword === "confirm" ? "text" : "password"}
      placeholder="Enter confirm password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      disabled={isLoading}
    />
    <span
      onClick={() => setShowPassword(showPassword === "confirm" ? null : "confirm")}
      style={{
        position: "absolute",
        right: "12px",
        top: "30px",
        cursor: "pointer",
        color: "#6c757d",
        zIndex: 10,
      }}
    >
      {showPassword === "confirm" ? (
        <FaEyeSlash size={18} />
      ) : (
        <FaEye size={18} />
      )}
    </span>
  </Form.Group>
</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
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
        <Form.Group
    className="mb-3"
    style={{ position: "relative" }}
>
    <Form.Label>Password</Form.Label>

    <Form.Control
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        style={{ paddingRight: "40px" }}
    />

    <span
        onClick={() => setShowPassword(!showPassword)}
        style={{
            position: "absolute",
            right: "12px",
            top: "30px",
            cursor: "pointer",
            color: "#6c757d",
            zIndex: 10,
        }}
    >
        {showPassword ? (
            <FaEyeSlash size={18} />
        ) : (
            <FaEye size={18} />
        )}
    </span>
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
// import React, { useState, useEffect, useRef } from "react";
// import { AiOutlineMenu } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import { FaMoon, FaSun, FaCoins } from "react-icons/fa";
// import { IoIosArrowDown } from "react-icons/io";
// import { FiUser, FiLogOut, FiMoon, FiRefreshCw } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import { io } from "socket.io-client";
// import { CiLock } from "react-icons/ci";
// import { FiSearch } from "react-icons/fi";
// import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
// import Swal from "sweetalert2";
// import profileimage from "../asset/image/user-client.png";
// import { FaAngleDoubleRight } from "react-icons/fa";
// import { MdKeyboardArrowDown, MdLightMode, MdOutlineKeyboardArrowUp } from "react-icons/md";

// import { Modal, Button, Form } from "react-bootstrap";
// import axios from "axios"; // Add axios import
// import { encryptData, decryptData, generateHMAC } from "../Utils/encryption";
// import newlogo from "../asset/image/logo.png";
// import { addSuperAdminCoins,getAllEvents } from "../Server/api"

// function Header({ onToggleSidebar }) {
//  const [darkMode, setDarkMode] = useState(() => {
//      return localStorage.getItem("darkMode") === "true";
//    });
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const [username, setUsername] = useState("");
//   const [coins, setCoins] = useState(0);
//   const [AdminNotifiaction, setAdminNotifiaction] = useState(0);
//   const [adminData, setAdminData] = useState(null);
//   const socketRef = useRef(null);
//   const token = localStorage.getItem("token");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const [allReport, setAllReport] = useState(false);
//   const [allMaster, setAllMaster] = useState(false);
//   const [depositAmount, setDepositAmount] = useState("");
//   const [password, setPassword] = useState("");
//   const [showDepositModal, setShowDepositModal] = useState(false);

//   const showReport = () => {
//     setAllReport((prev) => !prev);
//     setAllMaster(false);
//   };

//   const showMaster = () => {
//     setAllMaster((prev) => !prev);
//     setAllReport(false);
//   };
//   useEffect(() => {
//     fetchAdminProfile();
//   }, []);

//   // const fetchAdminProfile = async () => {
//   //   try {
//   //     const admin_id = localStorage.getItem("admin_id");
//   //     const role = localStorage.getItem("role");
//   //     const token = localStorage.getItem("token");

//   //     if (!admin_id || !role || !token) {
//   //       console.warn("Missing authentication data");
//   //       return;
//   //     }

//   //     const response = await axios.post(
//   //       `${process.env.REACT_APP_API_URL}/get-data`,
//   //       {
//   //         role: role,
//   //         admin_id: admin_id
//   //       },
//   //       {
//   //         headers: {
//   //           'Authorization': `Bearer ${token}`,
//   //           'Content-Type': 'application/json'
//   //         }
//   //       }
//   //     );

//   //     if (response.data.success && response.data.data?.admin_profile) {
//   //       const adminProfile = response.data.data.admin_profile;
//   //       setAdminData(adminProfile);
//   //       setUsername(adminProfile.username || "");
//   //       localStorage.setItem("super_agent_id", adminProfile.super_agent_id);
//   //       localStorage.setItem("super_admin_id", adminProfile.super_admin_id);
//   //       localStorage.setItem("master_admin_id", adminProfile.master_admin_id);

//   //       setCoins(adminProfile.coins || 0);

//   //       // You can also save to localStorage if needed elsewhere
//   //       localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching admin profile:", error);
//   //     // Handle error appropriately
//   //   }
//   // };


//   const handleDeposit = async () => {
//     if (!depositAmount || !password) {
//       Swal.fire("Error", "Please enter amount and password", "error");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await addSuperAdminCoins({
//         admin_id: localStorage.getItem("admin_id"),
//         password,
//         coins: String(depositAmount),
//       });
//       const { status, message, coins } = response;
//       if (status) {
//         Swal.fire({
//           title: "Success",
//           text: message,
//           icon: "success",
//           confirmButtonText: "OK"
//         }).then((result) => {
//           if (result.isConfirmed) {
//             setShowDepositModal(false);
//             setCoins(coins);
//             setDepositAmount("");
//             setPassword("");
//             fetchAdminProfile();
//           }
//         });
//       } else {
//         Swal.fire("Error", message || "Failed to add coins", "error");
//       }
//     } catch (error) {
//       Swal.fire(
//         "Error",
//         error?.response?.data?.message,
//         "error"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const fetchAdminProfile = async () => {
//     try {
//       const admin_id = localStorage.getItem("admin_id");
//       const role = localStorage.getItem("role");
//       const token = localStorage.getItem("token");

//       if (!admin_id || !role || !token) {
//         console.warn("Missing authentication data");
//         navigate("/login");
//         return;
//       }

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/get-data`,
//         {
//           role: role,
//           admin_id: admin_id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       if (response.data.success && response.data.data?.admin_profile) {
//         const adminProfile = response.data.data.admin_profile;

//         // 🔴 CHECK ACTIVE & BLOCK STATUS
//         if (adminProfile.active === 0 || adminProfile.is_blocked === "1") {
//           localStorage.clear(); // optional but recommended
//           navigate("/login");
//           return;
//         }

//         setAdminData(adminProfile);
//         setUsername(adminProfile.username || "");
//         setCoins(adminProfile.coins || 0);

//         localStorage.setItem("super_agent_id", adminProfile.super_agent_id);
//         localStorage.setItem("super_admin_id", adminProfile.super_admin_id);
//         localStorage.setItem("master_admin_id", adminProfile.master_admin_id);
//         localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
//       }
//     } catch (error) {
//       console.error("Error fetching admin profile:", error);
//       navigate("/login");
//     }
//   };
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     document.body.classList.toggle("dark-theme");
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     const checkDarkMode = () => {
//       setIsDark(document.body.classList.contains("dark-theme"));
//     };

//     checkDarkMode();

//     const observer = new MutationObserver(checkDarkMode);
//     observer.observe(document.body, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     if (darkMode) {
//       document.body.classList.add("dark-theme");
//     } else {
//       document.body.classList.remove("dark-theme");
//     }

//     localStorage.setItem("darkMode", darkMode);
//   }, [darkMode]);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = "/login";
//   };

//   useEffect(() => {
//     if (!socketRef.current) {
//       try {
//         const socket = io("https://sara777chatapi.sindoor7.com", {
//           transports: ["websocket"],
//           withCredentials: true,
//           reconnection: true,
//         });

//         socketRef.current = socket;

//         socket.on("connect", () => {
//           console.log("✅ Connected with socket ID:", socket.id);
//           socket.emit("join", {
//             userId: "user123",
//             role: "user",
//           });
//         });

//         socket.on("receive_messageAdminnotifiactionCount", (data) => {
//           setAdminNotifiaction(data.totalUnseenAdmin);
//         });

//         socket.on("disconnect", () => {
//           console.log("⚠️ Socket disconnected");
//         });

//         socket.on("connect_error", (err) => {
//           console.error("❌ Connection Error:", err);
//         });

//         socket.on("error", (err) => {
//           console.error("❌ General Socket Error:", err);
//         });
//       } catch (e) {
//         console.error("❌ Exception in socket setup:", e);
//       }
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         console.log("🔌 Socket disconnected on unmount");
//         socketRef.current = null;
//       }
//     };
//   }, []);

//   const [isOpen, setIsOpen] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSubmit = async () => {
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Missing Fields",
//         text: "Please fill all password fields.",
//       });
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: "Confirm Password Wrong",
//       });
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const secretKey = process.env.REACT_APP_SECRET_KEY;

//       const requestData = { oldPassword, newPassword, confirmPassword };

//       const encryptedData = encryptData(requestData, secretKey);
//       const hmac = generateHMAC(encryptedData, secretKey);

//       const token = decryptData(localStorage.getItem("token"), secretKey);

//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/change-password`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ encryptedData, hmac }),
//         },
//       );

//       const text = await response.text();
//       let resJson = {};

//       try {
//         resJson = JSON.parse(text);
//       } catch (e) {
//         throw new Error("Invalid JSON from server");
//       }

//       if (resJson.encryptedData) {
//         const decrypted = decryptData(resJson.encryptedData, secretKey);

//         if (!decrypted) {
//           throw new Error("Failed to decrypt data");
//         }

//         if (decrypted.success) {
//           Swal.fire({
//             icon: "success",
//             title: "Success",
//             text: decrypted.message,
//           });
//         } else {
//           Swal.fire({
//             icon: "error",
//             title: "Failed",
//             text: decrypted.message,
//           });
//         }
//         return;
//       }

//       if (resJson.message) {
//         Swal.fire({
//           icon: resJson.success ? "success" : "error",
//           title: resJson.success ? "Success" : "Error",
//           text: resJson.message,
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Unknown response from server",
//         });
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err.message,
//       });
//     } finally {
//       setIsLoading(false);
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     let startY = 0;
//     let isRefreshing = false;
//     let pullStartTime = 0;

//     const onTouchStart = (e) => {
//       if (e.touches.length === 1) {
//         startY = e.touches[0].clientY;
//         pullStartTime = Date.now();
//       }
//     };

//     const onTouchMove = (e) => {
//       if (window.scrollY <= 10 && e.touches[0].clientY > startY + 50) {
//         e.preventDefault(); // stop scroll
//       }
//     };

//     const onTouchEnd = (e) => {
//       if (isRefreshing) return;

//       const endY = e.changedTouches[0].clientY;
//       const distance = endY - startY;
//       const pullDuration = Date.now() - pullStartTime;

//       if (distance > 120 && window.scrollY <= 10 && pullDuration < 1000) {
//         isRefreshing = true;

//         // ===== LOADER WRAPPER =====
//         const loaderWrap = document.createElement("div");
//         loaderWrap.id = "page-refresh-loader";
//         loaderWrap.style.cssText = `
//         position: fixed;
//     top: 60px;
//     left: 50%;
//     transform: translateX(-50%);
//     z-index: 99999;
//     opacity: 1;
//     transition: opacity 0.2s;
//     background: #fff;
//     border-radius: 50px;
//     padding: 7px;
//       `;

//         // ===== NORMAL GOOGLE-STYLE SPINNER =====
//         const loader = document.createElement("div");
//         loader.className = "google-spinner";

//         // ===== CSS INJECT (ONCE) =====
//         if (!document.getElementById("pull-refresh-style")) {
//           const style = document.createElement("style");
//           style.id = "pull-refresh-style";
//           style.innerHTML = `
//          .google-spinner {
//     border: 3px solid #cdcdcd;
//     border-top: 3px solid #000;
//     border-radius: 50%;
//     width: 30px;
//     height: 30px;
//     animation: spin 1s linear infinite;
//     background: #fff;
// }

//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `;
//           document.head.appendChild(style);
//         }

//         loaderWrap.appendChild(loader);
//         document.body.appendChild(loaderWrap);

//         // ===== SIMULATE REFRESH =====
//         setTimeout(() => {
//           console.log("Refresh Done");
//           const el = document.getElementById("page-refresh-loader");
//           if (el) el.remove();
//           isRefreshing = true;
//           window.location.reload();
//         }, 100);
//       }

//       startY = 0;
//       pullStartTime = 0;
//     };

//     window.addEventListener("touchstart", onTouchStart, { passive: false });
//     window.addEventListener("touchmove", onTouchMove, { passive: false });
//     window.addEventListener("touchend", onTouchEnd);

//     return () => {
//       window.removeEventListener("touchstart", onTouchStart);
//       window.removeEventListener("touchmove", onTouchMove);
//       window.removeEventListener("touchend", onTouchEnd);
//     };
//   }, []);
//   const allmasterlist = useRef(null);
//   const allreportref = useRef(null);
//   useEffect(() => {
//     const handleOutside = (event) => {
//       const clickedOutsideReport =
//         allreportref.current && !allreportref.current.contains(event.target);

//       const clickedOutsideMaster =
//         allmasterlist.current && !allmasterlist.current.contains(event.target);

//       if (clickedOutsideReport) {
//         setAllReport(false);
//       }

//       if (clickedOutsideMaster) {
//         setAllMaster(false);
//       }
//     };

//     document.addEventListener("mousedown", handleOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleOutside);
//     };
//   }, []);
//   const events = [
//     {
//       id: 31345701,
//       name: "FIFA World Cup",
//       url: "/event/detail/31345701",
//     },
//     {
//       id: 33439203,
//       name: "ICC Women's T20 World Cup",
//       url: "/event/detail/33439203",
//     },
//     {
//       id: 1781349126,
//       name: "FIFA WORLD CUP 2026 XTRA MARKET",
//       url: "/event/detail/1781349126",
//     },
//     {
//       id: 35754708,
//       name: "Zimbabwe v Bangladesh",
//       url: "/event/detail/35754708",
//     },
//     {
//       id: 35761854,
//       name: "Ruzic v E Raducanu",
//       url: "/event/detail/35761854",
//     },
//     {
//       id: 35767500,
//       name: "L Midon v S Haita",
//       url: "/event/detail/35767500",
//     },
//     {
//       id: 35767846,
//       name: "Th Seyboth Wild v Coulibaly",
//       url: "/event/detail/35767846",
//     },
//     {
//       id: 35767803,
//       name: "Ni McDonald v J Martin Manzano",
//       url: "/event/detail/35767803",
//     },
//   ];
//   const [search, setSearch] = useState("");
//   const [show, setShow] = useState(false);

//   const wrapperRef = useRef(null);

//   const filteredEvents = events.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase()),
//   );

 
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setShow(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
//   return (
//     <div className="header" id="header">
//       <div className="d-flex justify-content-between px-2 w-100">
//         <div className="logo-box d-xl-none d-md-none d-sm-block">
//           <a href="/dashboard">
//             <img
//               src={isDark ? newlogo : newlogo}
//               alt="logo"
//               className="logo-lg"
//               style={{
//                 width: "50px",
//                 height: "auto",
//                 objectFit: "contain",
//                 maxWidth: "100%",
//               }}
//             />
//           </a>
//         </div>
//         <div className="d-flex align-items-center">
//           <div className=" d-xl-block  d-md-block">
//             <div className="togglebutton">
//               <AiOutlineMenu onClick={onToggleSidebar} />
//             </div>
//           </div>
//           <div className="searchform">
//             <div className="search-wrapper" ref={wrapperRef}>
//               {/* <div className="search-box">
//                 <span className="search-icon">
//                   <FiSearch />
//                 </span>

//                 <input
//                   type="text"
//                   placeholder="Search Events"
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setShow(true);
//                   }}
//                   onFocus={() => setShow(true)}
//                 />
//               </div> */}

//               {show && search !== "" && (
//                 <div className="search-dropdown">
//                   {filteredEvents.length ? (
//                     filteredEvents.map((item) => (
//                       <a key={item.id} href={item.url} className="search-item">
//                         {item.name}
//                       </a>
//                     ))
//                   ) : (
//                     <div className="no-result">No Events Found</div>
//                   )}
//                 </div>

//               )}
//             </div>
//           </div>
//         </div>
//         <div className="linksmode">
//           {/* <div className="darkmode" onClick={toggleDarkMode}>
//             {darkMode ? <FaSun /> : <FaMoon />}
//           </div> */}

//           <div className="allreport"  ref={wrapperRef}>
//             <div className="report_design" onClick={showReport}>
//               <span>Reports</span>
//               {allReport ? (
//                 <MdOutlineKeyboardArrowUp />
//               ) : (
//                 <MdKeyboardArrowDown />
//               )}
//             </div>
//             <div  className={`allreport_dropdown ${allReport ? "show" : ""}`}>
//               <ul>
//                 <li>
//                   <a href="/reports/account-statement">
//                     <FaAngleDoubleRight /> Account Statement
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/profit-loss">
//                     <FaAngleDoubleRight /> Profit Loss
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/chip-statement">
//                     <FaAngleDoubleRight /> Chip Statement
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/chip-summary">
//                     <FaAngleDoubleRight /> Chip Summary
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/settlement-report">
//                     <FaAngleDoubleRight /> Settlement Report
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/sport-summary-report">
//                     <FaAngleDoubleRight /> Sport Summary Report
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/top-clients">
//                     <FaAngleDoubleRight /> Top Clients
//                   </a>
//                 </li>

//                 {/* <li>
//                   <a href="/reports/settlement" className="blink hightlightcolor">
//                     <FaAngleDoubleRight /> Settlement
//                   </a>
//                 </li> */}

//                  <li>
//                   <a href="/super-agent-ledger" className="blink hightlightcolor">
//                     <FaAngleDoubleRight /> Settlement
//                   </a>
//                 </li>

                

//                 <li>
//                   <a href="/reports/balance-sheet">
//                     <FaAngleDoubleRight /> Balance Sheet
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="allreport" ref={wrapperRef}>
//             <div className="report_design" onClick={showMaster}>
//               <span>Users</span>
//               {allMaster ? (
//                 <MdOutlineKeyboardArrowUp />
//               ) : (
//                 <MdKeyboardArrowDown />
//               )}
//             </div>
//             <div
//               ref={allmasterlist}
//               className={`allreport_dropdown ${allMaster ? "show" : ""}`}
//             >
//               <ul>
//                 <li>
//                   <Link to={'/agent_lists'}>Super Master</Link>
//                 </li>

//                 <li>
//                   <Link to={'/AgentMasternew'}>Master</Link>
//                 </li>

//                 <li>
//                   <Link to={'/Mastermyuser'}>Client</Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           {/* Coins Display */}
//           {/* <div className="coins-display d-flex align-items-center gap-2 mx-3">
//             <FaCoins className="text-warning" />
//             <span className="fw-bold">{coins}</span>
//             <span>Coins</span>
//           </div> */}

//           {/* <div className="chat_header_icon chat_new">
//             <Link to="/adminchat">
//               <IoChatbubbleEllipsesSharp />
//               {AdminNotifiaction > 0 && <span> {AdminNotifiaction}</span>}
//             </Link>
//           </div>
//            */}
//           <div className="profilie" ref={dropdownRef}>
//             <div className="profile-header" onClick={toggleDropdown}>
//               {/* <div className="profileimage">
//                 <img
//                   src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
//                   alt="Avatar"
//                 />
//               </div> */}
//               <div className="name desktop_device">
//                 <div className="d-flex flex-column">
//                   <span>{username}</span>
//                   {/* <small className="text-muted d-flex align-items-center gap-1">
//                     <FaCoins size={12} /> {coins} Coins
//                   </small> */}
//                 </div>
//               </div>
//               <div className="profileimage">
//                 <img src={profileimage} alt="profileimage" />
//               </div>
//               {/* <div className={`arrowprofile transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}>
//                 <IoIosArrowDown />
//               </div> */}
//             </div>

//             {dropdownOpen && (
//               <div className="profile-dropdown">
//                 <div className="dropdown-item flex items-center gap-2 balancedesign">
//                   Balance: {coins}
//                 </div>
//                 {/* <div className="dropdown-item mobile_device">
//                   <div className="d-flex gap-2 align-items-center">
//                     <div className="profileimage">
//                       <img
//                         src={`${process.env.PUBLIC_URL}/assets/images/avatar-1.jpg`}
//                         alt="Avatar"
//                       />
//                     </div>
//                     <div className="name">
//                       <div>{username}</div>
//                       <small className="text-muted d-flex align-items-center gap-1">
//                         <FaCoins size={12} /> {coins} Coins
//                       </small>
//                     </div>
//                   </div>
//                 </div> */}
//                 <div
//                   className="dropdown-item flex items-center gap-2"
//                   onClick={() => setIsOpen(true)}
//                 >
//                   <span><CiLock /></span> Change Password
//                 </div>

//                 <div className="dropdown-item flex items-center gap-2"
//                   onClick={() => setShowDepositModal(true)}>
//                   <FaCoins size={14} /> Add Coins
//                 </div>
//                 <div
//                   className="dropdown-item flex items-center gap-2"
//                   onClick={handleLogout}
//                 >
//                   <span><FiLogOut /></span> Logout
//                 </div>

//                 <div className="darkmode modebtn">
//                   <div className="light-icon"> 
//                     <span>Light</span>
//                     <MdLightMode />
//                      </div>
//                     <div className="form-check form-switch m-0">
//                       <input
//                         className="form-check-input"
//                         type="checkbox"
//                         id="darkModeSwitch"
//                         checked={darkMode}
//                         onChange={toggleDarkMode}
//                         style={{ cursor: "pointer" }}
//                       />
//                     </div>

//                     <div className="dark-icon">
//                       <FiMoon  />
//                         <span>Dark </span></div>
//                   </div>

//                 {/* <div className="toggleclassnew">
//                   asa
//                 </div> */}
//               </div>
//             )}
//           </div>

//           {/* <div className="d-xl-none  d-md-none d-sm-block">
//             <div className="togglebutton">
//               <AiOutlineMenu onClick={onToggleSidebar} />
//             </div>
//           </div> */}
//         </div>
//       </div>

//       <Modal
//         show={isOpen}
//         onHide={() => setIsOpen(false)}
//         centered
//         backdrop="static"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Change Password</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Form.Group className="mb-3">
//             <Form.Label>Old Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter old password"
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//               disabled={isLoading}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>New Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               disabled={isLoading}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter confirm password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               disabled={isLoading}
//             />
//           </Form.Group>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setIsOpen(false)}
//             disabled={isLoading}
//           >
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? "Saving..." : "Save"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showDepositModal} onHide={() => setShowDepositModal(false)} centered backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>Deposit Coins</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Form.Group className="mb-3">
//             <Form.Label>Amount</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter amount"
//               value={depositAmount}
//               onChange={(e) => setDepositAmount(e.target.value)}
//               min="1"
//               disabled={isLoading}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={isLoading}
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDepositModal(false)} disabled={isLoading}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleDeposit} disabled={isLoading}>
//             {isLoading ? "Processing..." : "Deposit"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default Header;
// import React, { useState, useEffect, useRef } from "react";
// import { AiOutlineMenu } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import { FaMoon, FaSun, FaCoins } from "react-icons/fa";
// import { IoIosArrowDown } from "react-icons/io";
// import { FiUser, FiLogOut } from "react-icons/fi";
// import { Link } from "react-router-dom";
// import { io } from "socket.io-client";
// import { CiLock } from "react-icons/ci";
// import { FiSearch } from "react-icons/fi";
// import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
// import Swal from "sweetalert2";
// import profileimage from "../asset/image/user-client.png";
// import { FaAngleDoubleRight } from "react-icons/fa";
// import { MdKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

// import { Modal, Button, Form } from "react-bootstrap";
// import axios from "axios";
// import { encryptData, decryptData, generateHMAC } from "../Utils/encryption";
// import newlogo from "../asset/image/logo.png";
// import { addSuperAdminCoins, getAllEvents } from "../Server/api";

// function Header({ onToggleSidebar }) {
//   const [darkMode, setDarkMode] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const [username, setUsername] = useState("");
//   const [coins, setCoins] = useState(0);
//   const [AdminNotifiaction, setAdminNotifiaction] = useState(0);
//   const [adminData, setAdminData] = useState(null);
//   const socketRef = useRef(null);
//   const token = localStorage.getItem("token");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const [allReport, setAllReport] = useState(false);
//   const [allMaster, setAllMaster] = useState(false);
//   const [depositAmount, setDepositAmount] = useState("");
//   const [password, setPassword] = useState("");
//   const [showDepositModal, setShowDepositModal] = useState(false);

//   // ✅ New states for search
//   const [search, setSearch] = useState("");
//   const [show, setShow] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const wrapperRef = useRef(null);

//   // ✅ Refs for dropdowns
//   const allreportref = useRef(null);
//   const allmasterlist = useRef(null);

//   const showReport = () => {
//     setAllReport((prev) => !prev);
//     setAllMaster(false);
//   };

//   const showMaster = () => {
//     setAllMaster((prev) => !prev);
//     setAllReport(false);
//   };

//   useEffect(() => {
//     fetchAdminProfile();
//     fetchAllEvents(); // ✅ Fetch events on mount
//   }, []);

//   // ✅ Function to fetch all events
//   const fetchAllEvents = async (searchTerm = "") => {
//     try {
//       setSearchLoading(true);
//       const payload = {};
      
//       // If search term is provided, add it to payload
//       if (searchTerm) {
//         payload.search = searchTerm;
//       }

//       // Fetch all events without sportId and seriesId filter
//       const response = await getAllEvents(null, null, payload);
      
//       if (response?.data?.success) {
//         const allEvents = [];
//         const data = response.data.data;

//         // ✅ Extract events from inplay
//         if (data.inplay && Array.isArray(data.inplay)) {
//           data.inplay.forEach(event => {
//             allEvents.push({
//               id: event.event_id || event.id,
//               name: event.name,
//               sport_id: event.sport_id,
//               series_id: event.series_id || event.market_id || null,
//               market_id: event.market_id || null,
//               _id: event._id
//             });
//           });
//         }

//         // ✅ Extract events from competition_wise
//         if (data.competition_wise && Array.isArray(data.competition_wise)) {
//           data.competition_wise.forEach(sport => {
//             if (sport.competitions) {
//               sport.competitions.forEach(competition => {
//                 if (competition.events) {
//                   competition.events.forEach(event => {
//                     allEvents.push({
//                       id: event.event_id || event.id,
//                       name: event.name,
//                       sport_id: sport.sport_id || event.sport_id,
//                       series_id: event.series_id || competition.series_id || event.market_id || null,
//                       market_id: event.market_id || null,
//                       _id: event._id
//                     });
//                   });
//                 }
//               });
//             }
//           });
//         }

//         // ✅ Extract events from date_wise
//         if (data.date_wise && Array.isArray(data.date_wise)) {
//           data.date_wise.forEach(sport => {
//             if (sport.dates) {
//               sport.dates.forEach(dateGroup => {
//                 if (dateGroup.events) {
//                   dateGroup.events.forEach(event => {
//                     allEvents.push({
//                       id: event.event_id || event.id,
//                       name: event.name,
//                       sport_id: sport.sport_id || event.sport_id,
//                       series_id: event.series_id || event.market_id || null,
//                       market_id: event.market_id || null,
//                       _id: event._id
//                     });
//                   });
//                 }
//               });
//             }
//           });
//         }

//         setEvents(allEvents);
//       }
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   // ✅ Search with debounce
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (search.trim() !== "") {
//         fetchAllEvents(search);
//       } else {
//         fetchAllEvents(); // Fetch all events when search is empty
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounceFn);
//   }, [search]);

//   const fetchAdminProfile = async () => {
//     try {
//       const admin_id = localStorage.getItem("admin_id");
//       const role = localStorage.getItem("role");
//       const token = localStorage.getItem("token");

//       if (!admin_id || !role || !token) {
//         console.warn("Missing authentication data");
//         navigate("/login");
//         return;
//       }

//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/get-data`,
//         {
//           role: role,
//           admin_id: admin_id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       if (response.data.success && response.data.data?.admin_profile) {
//         const adminProfile = response.data.data.admin_profile;

//         if (adminProfile.active === 0 || adminProfile.is_blocked === "1") {
//           localStorage.clear();
//           navigate("/login");
//           return;
//         }

//         setAdminData(adminProfile);
//         setUsername(adminProfile.username || "");
//         setCoins(adminProfile.coins || 0);

//         localStorage.setItem("super_agent_id", adminProfile.super_agent_id);
//         localStorage.setItem("super_admin_id", adminProfile.super_admin_id);
//         localStorage.setItem("master_admin_id", adminProfile.master_admin_id);
//         localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
//       }
//     } catch (error) {
//       console.error("Error fetching admin profile:", error);
//       navigate("/login");
//     }
//   };

//   const handleDeposit = async () => {
//     if (!depositAmount || !password) {
//       Swal.fire("Error", "Please enter amount and password", "error");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await addSuperAdminCoins({
//         admin_id: localStorage.getItem("admin_id"),
//         password,
//         coins: String(depositAmount),
//       });
//       const { status, message, coins } = response;
//       if (status) {
//         Swal.fire({
//           title: "Success",
//           text: message,
//           icon: "success",
//           confirmButtonText: "OK"
//         }).then((result) => {
//           if (result.isConfirmed) {
//             setShowDepositModal(false);
//             setCoins(coins);
//             setDepositAmount("");
//             setPassword("");
//             fetchAdminProfile();
//           }
//         });
//       } else {
//         Swal.fire("Error", message || "Failed to add coins", "error");
//       }
//     } catch (error) {
//       Swal.fire(
//         "Error",
//         error?.response?.data?.message,
//         "error"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     document.body.classList.toggle("dark-theme");
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     const checkDarkMode = () => {
//       setIsDark(document.body.classList.contains("dark-theme"));
//     };

//     checkDarkMode();

//     const observer = new MutationObserver(checkDarkMode);
//     observer.observe(document.body, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });

//     return () => observer.disconnect();
//   }, []);

//   // ✅ Combined click outside handler for all dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Handle Reports dropdown
//       if (allreportref.current && !allreportref.current.contains(event.target)) {
//         setAllReport(false);
//       }

//       // Handle Users dropdown
//       if (allmasterlist.current && !allmasterlist.current.contains(event.target)) {
//         setAllMaster(false);
//       }

//       // Handle Profile dropdown
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.href = "/login";
//   };

//   useEffect(() => {
//     if (!socketRef.current) {
//       try {
//         const socket = io("https://sara777chatapi.sindoor7.com", {
//           transports: ["websocket"],
//           withCredentials: true,
//           reconnection: true,
//         });

//         socketRef.current = socket;

//         socket.on("connect", () => {
//           console.log("✅ Connected with socket ID:", socket.id);
//           socket.emit("join", {
//             userId: "user123",
//             role: "user",
//           });
//         });

//         socket.on("receive_messageAdminnotifiactionCount", (data) => {
//           setAdminNotifiaction(data.totalUnseenAdmin);
//         });

//         socket.on("disconnect", () => {
//           console.log("⚠️ Socket disconnected");
//         });

//         socket.on("connect_error", (err) => {
//           console.error("❌ Connection Error:", err);
//         });

//         socket.on("error", (err) => {
//           console.error("❌ General Socket Error:", err);
//         });
//       } catch (e) {
//         console.error("❌ Exception in socket setup:", e);
//       }
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         console.log("🔌 Socket disconnected on unmount");
//         socketRef.current = null;
//       }
//     };
//   }, []);

//   const [isOpen, setIsOpen] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSubmit = async () => {
//     if (!oldPassword || !newPassword || !confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Missing Fields",
//         text: "Please fill all password fields.",
//       });
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       Swal.fire({
//         icon: "error",
//         title: "Failed",
//         text: "Confirm Password Wrong",
//       });
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const secretKey = process.env.REACT_APP_SECRET_KEY;

//       const requestData = { oldPassword, newPassword, confirmPassword };

//       const encryptedData = encryptData(requestData, secretKey);
//       const hmac = generateHMAC(encryptedData, secretKey);

//       const token = decryptData(localStorage.getItem("token"), secretKey);

//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/change-password`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ encryptedData, hmac }),
//         },
//       );

//       const text = await response.text();
//       let resJson = {};

//       try {
//         resJson = JSON.parse(text);
//       } catch (e) {
//         throw new Error("Invalid JSON from server");
//       }

//       if (resJson.encryptedData) {
//         const decrypted = decryptData(resJson.encryptedData, secretKey);

//         if (!decrypted) {
//           throw new Error("Failed to decrypt data");
//         }

//         if (decrypted.success) {
//           Swal.fire({
//             icon: "success",
//             title: "Success",
//             text: decrypted.message,
//           });
//         } else {
//           Swal.fire({
//             icon: "error",
//             title: "Failed",
//             text: decrypted.message,
//           });
//         }
//         return;
//       }

//       if (resJson.message) {
//         Swal.fire({
//           icon: resJson.success ? "success" : "error",
//           title: resJson.success ? "Success" : "Error",
//           text: resJson.message,
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Unknown response from server",
//         });
//       }
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: err.message,
//       });
//     } finally {
//       setIsLoading(false);
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     let startY = 0;
//     let isRefreshing = false;
//     let pullStartTime = 0;

//     const onTouchStart = (e) => {
//       if (e.touches.length === 1) {
//         startY = e.touches[0].clientY;
//         pullStartTime = Date.now();
//       }
//     };

//     const onTouchMove = (e) => {
//       if (window.scrollY <= 10 && e.touches[0].clientY > startY + 50) {
//         e.preventDefault();
//       }
//     };

//     const onTouchEnd = (e) => {
//       if (isRefreshing) return;

//       const endY = e.changedTouches[0].clientY;
//       const distance = endY - startY;
//       const pullDuration = Date.now() - pullStartTime;

//       if (distance > 120 && window.scrollY <= 10 && pullDuration < 1000) {
//         isRefreshing = true;

//         const loaderWrap = document.createElement("div");
//         loaderWrap.id = "page-refresh-loader";
//         loaderWrap.style.cssText = `
//         position: fixed;
//     top: 60px;
//     left: 50%;
//     transform: translateX(-50%);
//     z-index: 99999;
//     opacity: 1;
//     transition: opacity 0.2s;
//     background: #fff;
//     border-radius: 50px;
//     padding: 7px;
//       `;

//         const loader = document.createElement("div");
//         loader.className = "google-spinner";

//         if (!document.getElementById("pull-refresh-style")) {
//           const style = document.createElement("style");
//           style.id = "pull-refresh-style";
//           style.innerHTML = `
//          .google-spinner {
//     border: 3px solid #cdcdcd;
//     border-top: 3px solid #000;
//     border-radius: 50%;
//     width: 30px;
//     height: 30px;
//     animation: spin 1s linear infinite;
//     background: #fff;
// }

//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `;
//           document.head.appendChild(style);
//         }

//         loaderWrap.appendChild(loader);
//         document.body.appendChild(loaderWrap);

//         setTimeout(() => {
//           console.log("Refresh Done");
//           const el = document.getElementById("page-refresh-loader");
//           if (el) el.remove();
//           isRefreshing = true;
//           window.location.reload();
//         }, 100);
//       }

//       startY = 0;
//       pullStartTime = 0;
//     };

//     window.addEventListener("touchstart", onTouchStart, { passive: false });
//     window.addEventListener("touchmove", onTouchMove, { passive: false });
//     window.addEventListener("touchend", onTouchEnd);

//     return () => {
//       window.removeEventListener("touchstart", onTouchStart);
//       window.removeEventListener("touchmove", onTouchMove);
//       window.removeEventListener("touchend", onTouchEnd);
//     };
//   }, []);

//   // ✅ Filtered events based on search
//   const filteredEvents = events.filter((item) =>
//     item.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   // ✅ Handle outside click for search dropdown
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
//         setShow(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="header" id="header">
//       <div className="d-flex justify-content-between px-2 w-100">
//         <div className="logo-box d-xl-none d-md-none d-sm-block">
//           <a href="/dashboard">
//             <img
//               src={isDark ? newlogo : newlogo}
//               alt="logo"
//               className="logo-lg"
//               style={{
//                 width: "50px",
//                 height: "auto",
//                 objectFit: "contain",
//                 maxWidth: "100%",
//               }}
//             />
//           </a>
//         </div>
//         <div className="d-flex align-items-center">
//           <div className=" d-xl-block  d-md-block d-sm-none d-none">
//             <div className="togglebutton">
//               <AiOutlineMenu onClick={onToggleSidebar} />
//             </div>
//           </div>
//           <div className="searchform">
//             <div className="search-wrapper" ref={wrapperRef}>
//               <div className="search-box">
//                 <span className="search-icon">
//                   <FiSearch />
//                 </span>

//                 <input
//                   type="text"
//                   placeholder="Search Events"
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setShow(true);
//                   }}
//                   onFocus={() => setShow(true)}
//                 />
//                 {searchLoading && (
//                   <span className="search-loading">
//                     <div className="spinner-border spinner-border-sm text-primary" role="status">
//                       <span className="visually-hidden">Loading...</span>
//                     </div>
//                   </span>
//                 )}
//               </div>

//               {show && search !== "" && (
//                 <div className="search-dropdown">
//                   {searchLoading ? (
//                     <div className="text-center p-2">Loading...</div>
//                   ) : filteredEvents.length ? (
//                     filteredEvents.map((item) => {
//                       // ✅ Generate dynamic URL
//                       const seriesId = item.series_id || 'null';
//                       const sportId = item.sport_id || 4;
//                       const eventId = item.id;
                      
//                       const dynamicUrl = `/viewmatch-fancy/series_idd/${seriesId}/event_id/${eventId}/sport_id/${sportId}`;
                      
//                       return (
//                         <Link
//                           key={item._id || item.id}
//                           to={dynamicUrl}
//                           className="search-item"
//                           onClick={() => {
//                             setShow(false);
//                             setSearch("");
//                           }}
//                         >
//                           {item.name}
//                         </Link>
//                       );
//                     })
//                   ) : (
//                     <div className="no-result">No Events Found</div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="linksmode">
//           <div className="allreport">
//             <div className="report_design" onClick={showReport}>
//               <span>Reports</span>
//               {allReport ? (
//                 <MdOutlineKeyboardArrowUp />
//               ) : (
//                 <MdKeyboardArrowDown />
//               )}
//             </div>
//             <div 
//               ref={allreportref}
//               className={`allreport_dropdown ${allReport ? "show" : ""}`}
//             >
//               <ul>
//                 <li>
//                   <a href="/reports/account-statement">
//                     <FaAngleDoubleRight /> Account Statement
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/profit-loss">
//                     <FaAngleDoubleRight /> Profit Loss
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/chip-statement">
//                     <FaAngleDoubleRight /> Chip Statement
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/chip-summary">
//                     <FaAngleDoubleRight /> Chip Summary
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/settlement-report">
//                     <FaAngleDoubleRight /> Settlement Report
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/sport-summary-report">
//                     <FaAngleDoubleRight /> Sport Summary Report
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/top-clients">
//                     <FaAngleDoubleRight /> Top Clients
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/super-agent-ledger" className="blink hightlightcolor">
//                     <FaAngleDoubleRight /> Settlement
//                   </a>
//                 </li>

//                 <li>
//                   <a href="/reports/balance-sheet">
//                     <FaAngleDoubleRight /> Balance Sheet
//                   </a>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="allreport">
//             <div className="report_design" onClick={showMaster}>
//               <span>Users</span>
//               {allMaster ? (
//                 <MdOutlineKeyboardArrowUp />
//               ) : (
//                 <MdKeyboardArrowDown />
//               )}
//             </div>
//             <div
//               ref={allmasterlist}
//               className={`allreport_dropdown ${allMaster ? "show" : ""}`}
//             >
//               <ul>
//                 <li>
//                   <Link to={'/agent_lists'}>Super Master</Link>
//                 </li>

//                 <li>
//                   <Link to={'/AgentMasternew'}>Master</Link>
//                 </li>

//                 <li>
//                   <Link to={'/Mastermyuser'}>Client</Link>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="profilie" ref={dropdownRef}>
//             <div className="profile-header" onClick={toggleDropdown}>
//               <div className="name desktop_device">
//                 <div className="d-flex flex-column">
//                   <span>{username}</span>
//                 </div>
//               </div>
//               <div className="profileimage">
//                 <img src={profileimage} alt="profileimage" />
//               </div>
//             </div>

//             {dropdownOpen && (
//               <div className="profile-dropdown">
//                 <div className="dropdown-item flex items-center gap-2 balancedesign">
//                   Balance: {coins}
//                 </div>
//                 <div
//                   className="dropdown-item flex items-center gap-2"
//                   onClick={() => setIsOpen(true)}
//                 >
//                   <span><CiLock /></span> Change Password
//                 </div>

//                 <div className="dropdown-item flex items-center gap-2"
//                   onClick={() => setShowDepositModal(true)}>
//                   <FaCoins size={14} /> Add Coins
//                 </div>
//                 <div
//                   className="dropdown-item flex items-center gap-2"
//                   onClick={handleLogout}
//                 >
//                   <span><FiLogOut /></span> Logout
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="d-xl-none  d-md-none d-sm-block">
//             <div className="togglebutton">
//               <AiOutlineMenu onClick={onToggleSidebar} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Change Password Modal */}
//       <Modal
//         show={isOpen}
//         onHide={() => setIsOpen(false)}
//         centered
//         backdrop="static"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Change Password</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Form.Group className="mb-3">
//             <Form.Label>Old Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter old password"
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//               disabled={isLoading}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>New Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               disabled={isLoading}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter confirm password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               disabled={isLoading}
//             />
//           </Form.Group>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setIsOpen(false)}
//             disabled={isLoading}
//           >
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
//             {isLoading ? "Saving..." : "Save"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Deposit Modal */}
//       <Modal show={showDepositModal} onHide={() => setShowDepositModal(false)} centered backdrop="static">
//         <Modal.Header closeButton>
//           <Modal.Title>Deposit Coins</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           <Form.Group className="mb-3">
//             <Form.Label>Amount</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter amount"
//               value={depositAmount}
//               onChange={(e) => setDepositAmount(e.target.value)}
//               min="1"
//               disabled={isLoading}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={isLoading}
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowDepositModal(false)} disabled={isLoading}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleDeposit} disabled={isLoading}>
//             {isLoading ? "Processing..." : "Deposit"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default Header;