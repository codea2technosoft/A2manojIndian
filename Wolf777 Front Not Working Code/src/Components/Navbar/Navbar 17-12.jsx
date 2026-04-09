import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/Navbar.scss";
import Swal from "sweetalert2";
import userprofile from "../../assets/images/userprofile.png";
import whatsapp from "../../assets/images/whatsapp.png";
import logo from "../../assets/images/logo.png";
import { headermenu } from "../../service/api";
import axios from "axios";
import { RxSpeakerLoud } from "react-icons/rx";
import { FaWallet, FaEye, FaEyeSlash, FaSignInAlt, FaUser } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import { FaChevronDown } from "react-icons/fa";
import { MdLightMode, MdDarkMode, MdOutlineRefresh } from "react-icons/md";
import { BsBank } from "react-icons/bs";
import { Modal, Button, Form } from "react-bootstrap";
import Login from "../Pages/Login";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdSettings } from "react-icons/io";
import SetButtonValue from "../Pages/Setbuttonvalue";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPass, setShowPass] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phonenum, setPhonenum] = useState("");
  const [headermenuall, setheadermenuall] = useState([]);
  const [setting, setsetting] = useState({});
  const [loading, setLoading] = useState(true);
  const [amount, setamount] = useState("0");
  const [exp, setexp] = useState("0");
  const [showDropdown, setShowDropdown] = useState(false);
  const [theme, setTheme] = useState("light");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginClosing, setLoginClosing] = useState(false);

  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const openLogin = () => {
    setLoginClosing(false);
    setShowLoginModal(true);
  };

  const closeLogin = () => {
    setLoginClosing(true);
    setTimeout(() => {
      setShowLoginModal(false);
      setLoginClosing(false);
    }, 500);
  };

  // Fetch wallet
  const fetchwallet_amount = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
      const response = await axios.get(`${baseUrl}/wallet-amount?userId=${userId}`);
      if (response.data?.amount !== undefined) {
        setamount(response.data.amount);
        setexp(response.data.exp);
      }
    } catch (error) {
      console.error("Error fetching wallet amount:", error);
    }
  };

  // Fetch header menus
  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/menu`, {
        headers: {
          'Content-Type': 'application/json',
          // Add other headers if needed
          // 'Authorization': `Bearer ${token}`
        }
      });

      // Axios में response.data में data होता है
      if (response.data.success) {
        setheadermenuall(response.data.data);
      } else {
        console.error("API returned unsuccessful response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching header menu:", error);
    }
  };

  // Fetch user info
  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
      const response = await axios.get(`${baseUrl}/getProfil/${userId}`);
      if (response.data.success) setPhonenum(response.data.user.mobile);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${baseUrl}/general-setting`);
      if (response.data.status_code === 1) setsetting(response.data.data);
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  // On mount
  useEffect(() => {
    fetchData();

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsAuthenticated(true);
      fetchUser();
      fetchSettings();
      fetchwallet_amount();
    }
  }, []);

  // Wallet auto-update
  useEffect(() => {
    const handleWalletUpdate = () => fetchwallet_amount();
    window.addEventListener("bet-updated", handleWalletUpdate);
    return () => window.removeEventListener("bet-updated", handleWalletUpdate);
  }, []);

  // Logout
  const logout = () => {
    // Save bankDetails temporarily
    const bankDetails = localStorage.getItem("bankDetails");

    // Remove all other items from localStorage
    localStorage.clear();

    // Restore bankDetails
    if (bankDetails) {
      localStorage.setItem("bankDetails", bankDetails);
    }

    setIsAuthenticated(false);
    toast.success("Logged out successfully!");

    setTimeout(() => {
      navigate("/login");
    }, 1500); // 500ms delay
  };

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-mode", newTheme === "dark");
  };

  const token = localStorage.getItem("accessToken");

  const [showSettingModal, setShowSettingModal] = useState(false);

  const toggleSettingModal = () => {
    setShowSettingModal((prev) => !prev);
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />

      <nav className="navbar m-0">
        <div className="container-fluid">
          <div className="navbar-container w-100 d-flex justify-content-between align-items-center">
            {/* LOGO */}
            <div className="navbar-logo">
              <Link to="/">
                <img src={logo} alt="logo" />
              </Link>
            </div>

            {/* MAIN ACTIONS */}
            {token ? (
              <div className="navbar-actions">
                <button className="themeToggle" onClick={toggleTheme}>
                  {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
                </button>
                {isAuthenticated && (
                  <div className="nav-btn d-flex align-items-center gap-2">
                    <Link to="/withdrawpage" className="notification">
                      <BsBank />
                    </Link>

                    <div className="user-info-box">
                      <div className="user-balance">
                        <span className="label">Main PTI :</span>
                        <span className="amount">{Number(amount).toFixed(2)}</span>
                      </div>
                      <div className="user-exposure">
                        <span className="label">Exposure:</span>
                        <span className="amount">{Number(exp).toFixed(2)}</span>
                      </div>
                    </div>

                    <div
                      className="user-dropdown-wrapper refers"
                         onClick={fetchwallet_amount}
>
                      <MdOutlineRefresh  oncli fetchwallet_amountclassName="refreshBtn" />
                    </div>



                    <div
                      className="user-dropdown-wrapper d-none d-md-block"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <div className="d-flex gap-2 align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          {/* <button className="user-btn">
                            <div className="imgprofie">
                              <img src={userprofile} alt="userprofile" />
                            </div>
                          </button> */}
                          <FaUser />
                        </div>
                        <span className="d-md-block text-start d-none fontsizenew">
                          <small className="d-block">My Account</small>
                          {/* +91-{phonenum} */}
                        </span>
                        <FaChevronDown className="downIcon" />
                      </div>

                      <div className={`user-dropdown ${showDropdown ? "show" : ""}`}>
                        <ul>
                          <li>
                            <Link to="/bethistory">Bet History</Link>
                          </li>
                          <li>
                            <Link to="/Chat">chat</Link>
                          </li>
                          <li>
                            <Link to="/BroadCast">Notification</Link>
                          </li>
                          {/* <li>
                            <Link to="/account-details">My Profile</Link>
                          </li> */}
                          <li>
                            <Link to="/unsettledbet">Unsettled Bet</Link>
                          </li>
                          <li>
                            <Link to="/acountStatement">Account Statement</Link>
                          </li>
                          {/* <li>
                            <Link to="/Setbuttonvalue">Set Button Value</Link>
                          </li> */}
                          <li>
                            <Link to="/rules">Rules</Link>
                          </li>
                          <li>
                            <Link to="/" className="d-flex">
                              Customer Support{" "}
                              <div className="image_whatsapp">
                                <img src={whatsapp} alt="whatsapp" />
                              </div>
                            </Link>
                          </li>
                          <li className="logoutbutton" onClick={logout}>
                            Logout
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="login-header">
                  <button className="login-btn" onClick={openLogin}>
                    Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HEADER TABS */}
      <div className="custum_haeder">
        <div className="container-fluid">
          <div className="navbar-tabs">
            {headermenuall.map((menulink) => (
              <Link
                key={menulink.id}
                to={menulink.path}
                className={`tab ${location.pathname === menulink.path ? "active" : ""}`}
                onClick={() => {
                  if (menulink.label.toLowerCase() === "home") {
                    localStorage.setItem("isHomeClicked", "true");
                    window.dispatchEvent(new Event("bet-updated"));
                  }
                  // window.location.href = menulink.path;

                }}
              >
                {menulink.label}
              </Link>
            ))}

            {token && (
              <div
                className="ms-auto d-flex align-items-center gap-1 cursor-pointer"
                onClick={() => navigate("/Setbuttonvalue")}
              >
                <span>Setting</span>
                <IoMdSettings size={20} />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* LOGIN MODAL */}

      <Modal
        className={`login-modal-overlay ${
          loginClosing ? "fade-out" : "fade-in"
        }`}
        show={showLoginModal}
        // onHide={closeLogin}
        centered
      >
        <Modal.Header closeButton onHide={closeLogin}>
          <Modal.Title>User Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login closeModal={closeLogin} />
        </Modal.Body>
      </Modal>


      <Modal
        show={showSettingModal}
        onHide={toggleSettingModal}
        centered
        size="lg"
      >

        <Modal.Body>
          <SetButtonValue />
        </Modal.Body>
      </Modal>

    </>
  );
};

export default Navbar;
