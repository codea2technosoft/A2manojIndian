import React, { useState, useEffect, useCallback } from "react";
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
import { TbLogin2 } from "react-icons/tb";
import Register from "../Pages/Register";
import SidebarDrawer from "./SidebarDrawer";
import icon_news from "../../assets/images/icon_news.png";

import { FaBars } from "react-icons/fa";
import Unsettlebet from '../Pages/Unsettledbet';
import BetHistory from "../../Components/Pages/Allbet ";
import { FaHome } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDemo = localStorage.getItem("isDemo");
  if (!isDemo || isDemo === "") {
    navigate("/login");
  }

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [betsOpen, setBetsOpen] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginClosing, setLoginClosing] = useState(false);
  const [RegisterClosing, setRegisterClosing] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


    const baseUrl = process.env.REACT_APP_BACKEND_API;


  const [description, setDescription] = useState("");

useEffect(() => {
  const fetchNotice = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${baseUrl}/setting-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch notice");
      }

      const result = await res.json();

      if (result?.success && result?.data?.length > 0) {
        const settings = result.data[0];

        // description set
        setDescription(settings.description);

        // localStorage me values set
        localStorage.setItem("fancy_max_bet", settings.fancy_max_bet);
        localStorage.setItem("bookmaker_max_bet", settings.bookmaker_max_bet);
      }
    } catch (err) {
      console.error("Notice fetch error:", err);
    }
  };

  fetchNotice();
  fetchProfile();
}, []);
    const userId = localStorage.getItem("user_id");

    const [error, setError] = useState("");


const fetchProfile = async () => {
    if (!userId) {
        setError("User ID not found");
        return;
    }

    try {
        setLoading(true);

        const res = await axios.post(`${baseUrl}/profile`, {
            id: userId,
        });

        if (res.data?.success && res.data?.data) {

            const profileData = res.data.data;

            // 🔴 CHECK ACTIVE & BLOCK STATUS
            if (profileData.active === 0) {
                localStorage.clear(); // optional but recommended
                navigate("/login");
                return;
            }

            // setProfile(profileData);

            if (profileData.rate_difference !== undefined) {
                // setRateDifference(profileData.rate_difference.toString());
            }

            setError("");
        } else {
            // setProfile(null);
            setError("No profile data found");
        }

    } catch (err) {
        console.error("Error fetching profile:", err);
        navigate("/login"); // optional if API fails
        setError("Failed to load profile");
    } finally {
        setLoading(false);
    }
};

  // Check authentication status
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    const isAuth = !!(token);
    setIsAuthenticated(isAuth);
    return isAuth;
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const isDemo = localStorage.getItem("isDemo");

    if (!accessToken && !isDemo) {
      navigate("/login");
    }

  }, [navigate]);


  // Fetch wallet amount
  const fetchwallet_amount = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const accessToken = localStorage.getItem("accessToken");

      if (!userId || !accessToken) {
        setamount("0");
        setexp("0");
        return;
      }

      const response = await axios.get(
        `${baseUrl}/wallet-amount?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data) {
        const {
          status_code,
          amount,
          exp,
          token: serverToken,
        } = response.data;

        if (
          status_code !== 1 ||
          !serverToken ||
          serverToken !== accessToken
        ) {
          console.warn("Token mismatch or session expired");
          localStorage.clear();
          navigate("/login");
          return;
        }

        setamount(amount?.toString() || "0");
        setexp(exp?.toString() || "0");
      }
    } catch (error) {
      console.error("Error fetching wallet amount:", error);
      setamount("0");
      setexp("0");
    }
  }, [baseUrl, navigate]);

  // Fetch user info
  const fetchUser = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("accessToken");

      if (!userId || !token) return;

      const response = await axios.get(`${baseUrl}/getProfil/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setPhonenum(response.data.user.mobile);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }, [baseUrl]);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/general-setting`);
      if (response.data.status_code === 1) {
        setsetting(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  }, [baseUrl]);

  // Fetch header menus
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/menu`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setheadermenuall(response.data.data);
      } else {
        console.error("API returned unsuccessful response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching header menu:", error);
    }
  }, [baseUrl]);

  // Handle successful login
  const handleLoginSuccess = useCallback(() => {
    checkAuthStatus();
    if (checkAuthStatus()) {
      fetchUser();
      fetchSettings();
      fetchwallet_amount();
    }
    closeLogin();
  }, [checkAuthStatus, fetchUser, fetchSettings, fetchwallet_amount]);

  // Open login modal
  const openLogin = () => {
    setLoginClosing(false);
    setShowLoginModal(true);
  };

  // Close login modal
  const closeLogin = () => {
    setLoginClosing(true);
    setTimeout(() => {
      setShowLoginModal(false);
      setLoginClosing(false);
    }, 300);
  };

  // Open Register modal
  const openRegister = () => {
    setRegisterClosing(false);
    setShowRegisterModal(true);
  };

  // Close Register modal
  const closeRegister = () => {
    setLoginClosing(true);
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegisterClosing(false);
    }, 300);
  };

  // Logout function
  const logout = () => {
    const bankDetails = localStorage.getItem("bankDetails");
    localStorage.clear();

    if (bankDetails) {
      localStorage.setItem("bankDetails", bankDetails);
    }

    setIsAuthenticated(false);
    setamount("0");
    setexp("0");

    window.dispatchEvent(new CustomEvent('authStateChange', {
      detail: { isAuthenticated: false, token: null, userId: null }
    }));

    toast.success("Logged out successfully!");

    setTimeout(() => {
      navigate("/");
    }, 100);
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

  // Initial load and auth check
  useEffect(() => {
    fetchData();
    const isAuth = checkAuthStatus();

    if (isAuth) {
      fetchUser();
      fetchSettings();
      fetchwallet_amount();
    }
  }, [checkAuthStatus, fetchData, fetchUser, fetchSettings, fetchwallet_amount]);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      const isAuth = checkAuthStatus();
      if (isAuth) {
        fetchUser();
        fetchSettings();
        fetchwallet_amount();
      } else {
        setamount("0");
        setexp("0");
      }
    };

    const handleLoginSuccessEvent = () => {
      handleLoginSuccess();
    };

    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'user_id') {
        setTimeout(() => {
          handleAuthChange();
        }, 100);
      }
    };

    const handleWalletUpdate = () => {
      if (isAuthenticated) {
        fetchwallet_amount();
      }
    };

    window.addEventListener('authStateChange', handleAuthChange);
    window.addEventListener('loginSuccess', handleLoginSuccessEvent);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bet-updated', handleWalletUpdate);

    return () => {
      window.removeEventListener('authStateChange', handleAuthChange);
      window.removeEventListener('loginSuccess', handleLoginSuccessEvent);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bet-updated', handleWalletUpdate);
    };
  }, [isAuthenticated, checkAuthStatus, fetchUser, fetchSettings, fetchwallet_amount, handleLoginSuccess]);

  // Refresh wallet on click
  const handleRefreshWallet = () => {
    if (isAuthenticated) {
      fetchwallet_amount();
      toast.info("Wallet balance refreshed!");
    }
  };

  // IMPROVED PULL-TO-REFRESH FOR ALL PAGES
  // IMPROVED PULL-TO-REFRESH WITH LOADER
  // IMPROVED PULL-TO-REFRESH WITH LOADER


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
        }, 500);
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

  // useEffect(() => {
  //   let startY = 0;
  //   let isRefreshing = false;

  //   // ===== LOADER CREATE ONCE (BY DEFAULT READY) =====
  //   let loaderWrap = document.getElementById("page-refresh-loader");

  //   if (!loaderWrap) {
  //     loaderWrap = document.createElement("div");
  //     loaderWrap.id = "page-refresh-loader";
  //     loaderWrap.style.cssText = `
  //          position: fixed;
  //     top: 60px;
  //     left: 50%;
  //     transform: translateX(-50%);
  //     z-index: 99999;
  //     opacity: 1;
  //     transition: opacity 0.2s;
  //     background: #fff;
  //     border-radius: 50px;
  //     padding: 7px;
  //     `;

  //     const loader = document.createElement("div");
  //     loader.className = "google-spinner";
  //     loaderWrap.appendChild(loader);
  //     document.body.appendChild(loaderWrap);
  //   }

  //   // ===== CSS (NO NONE, ALWAYS READY) =====
  //   if (!document.getElementById("pull-refresh-style")) {
  //     const style = document.createElement("style");
  //     style.id = "pull-refresh-style";
  //     style.innerHTML = `
  //      .google-spinner {
  //     border: 3px solid #cdcdcd;
  //     border-top: 3px solid #000;
  //     border-radius: 50%;
  //     width: 35px;
  //     height: 35px;
  //     animation: spin 1s linear infinite;
  //     background: #fff;
  // }
  //       @keyframes spin {
  //         0% { transform: rotate(0deg); }
  //         100% { transform: rotate(360deg); }
  //       }
  //     `;
  //     document.head.appendChild(style);
  //   }

  //   const onTouchStart = (e) => {
  //     startY = e.touches[0].clientY;
  //   };

  //   const onTouchMove = (e) => {
  //     if (window.scrollY <= 10 && e.touches[0].clientY > startY + 50) {
  //       e.preventDefault();
  //       loaderWrap.style.opacity = "1"; // 👈 SHOW IMMEDIATELY
  //     }
  //   };

  //   const onTouchEnd = (e) => {
  //     if (isRefreshing) return;

  //     const distance = e.changedTouches[0].clientY - startY;

  //     if (distance > 120 && window.scrollY <= 10) {
  //       isRefreshing = true;

  //       setTimeout(() => {
  //         window.location.reload(); // 🔥 DIRECT RELOAD
  //       }, 300);
  //     } else {
  //       loaderWrap.style.opacity = "0";
  //     }

  //     startY = 0;
  //   };

  //   window.addEventListener("touchstart", onTouchStart, { passive: false });
  //   window.addEventListener("touchmove", onTouchMove, { passive: false });
  //   window.addEventListener("touchend", onTouchEnd);

  //   return () => {
  //     window.removeEventListener("touchstart", onTouchStart);
  //     window.removeEventListener("touchmove", onTouchMove);
  //     window.removeEventListener("touchend", onTouchEnd);
  //   };
  // }, []);



  const toggleSettingModal = () => {
    setShowSettingModal((prev) => !prev);
  };

  const StatusBar = ({ coins = 0.64, expo = 0 }) => {
    return (
      <>
        {isAuthenticated ? (
          <div className="status-bar">
            <div className="">
              <div className="navbar-actions">
                {isAuthenticated && (
                  <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                    <div className="d-flex align-items-center gap-1">
                      <span className="label-green">Main PTI:</span>
                      <span className="value-green" id="coins">
                        {((Number(amount) || 0) - (Number(exp) || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className="divider-vertical"></div>

                    <div className="d-flex align-items-center gap-1">
                      <span
                        className="label-red"
                        onClick={() => setBetsOpen(true)}
                      >
                        Exposure:
                      </span>

                      <span className="value-red" id="expo">{Number(exp).toFixed(2)}</span>
                    </div>
                    <button
                      className="btn bg-dark btn-outline-danger btn-sm text-blink"
                      onClick={() => setShowCompleted(true)}
                    >
                      Bets
                    </button>
                  </div>
                )}
              </div>

              {betsOpen && (
                <div className="bets-overlay" onClick={() => setBetsOpen(false)}>
                  <div
                    className="bets-modal-box"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bets-modal-header">
                      <h4>Your Exposure Details</h4>
                      <button
                        className="bets-close-btn"
                        onClick={() => setBetsOpen(false)}
                      >
                        ×
                      </button>
                    </div>
                    <div className="bets-modal-body">
                      <Unsettlebet />
                    </div>
                  </div>
                </div>
              )}

              {showCompleted && (
                <div className="completed-overlay" onClick={() => setShowCompleted(false)}>
                  <div
                    className="completed-popup"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="completed-header">
                      <h4>Your Exposure Details</h4>
                      <button onClick={() => setShowCompleted(false)}>✕</button>
                    </div>

                    <div className="completed-body">
                      <BetHistory />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="status-bar">
            <div className="">
              <div className="navbar-actions">
                <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                  <div className="d-flex align-items-center gap-1">
                    <span className="label-green">Main PTI:</span>
                    <span className="value-green" id="coins">0</span>
                  </div>
                  <div className="divider-vertical"></div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="label-red">Exposure:</span>
                    <span className="value-red" id="expo">0</span>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm text-blink"
                    onClick={() => navigate("/login")}
                  >
                    Bets
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  const [isScrolled, setIsScrolled] = useState(false);
useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />

      <nav className={`navbar m-0 ${isScrolled ? "navbar-scrolled" : ""}`}>

        <div className="container-fluid">
          <div className="navbar-container w-100 d-flex justify-content-between align-items-center">
            {/* LOGO */}

            <Link to="/indexpage" className="text-white">
              <FaHome className="fs-2" />
            </Link>
            <div className="navbar-logo">
              <Link to="/indexpage">
                <img src={logo} alt="logo" />
              </Link>
            </div>

            {/* MAIN ACTIONS */}
            {isAuthenticated ? (
              <div className="navbar-actions">
                <button
                  className="btn text-white"
                  onClick={() => setSidebarOpen(true)}
                >
                  <FaBars size={20} />
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2" onClick={() => {
                localStorage.clear();

              }}>
                <div className="login-header">
                  <Link to="/login" className="login-btn">
                    Login <TbLogin2 className="ms-1" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <StatusBar coins={0.64} expo={0} />
        <div class="news-ticker">
          <span class="news-icon">
            <img src={icon_news} alt="icon_news" />
          </span>

          <marquee class="marqueelink" behavior="scroll" direction="left">{description}
          </marquee>
        </div>
      </nav>

      <SidebarDrawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        logout={logout}
      />

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div
          className={`custom-login-overlay ${loginClosing ? "fade-out" : "fade-in"}`}
          onClick={closeLogin}
        >
          <div
            className={`custom-login-modal ${loginClosing ? "slide-down" : "slide-up"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="custom-login-header">
              <h4>User Login</h4>
              <button className="model-close-btn" onClick={closeLogin}>
                ×
              </button>
            </div>
            <div className="custom-login-body">
              <Login
                closeModal={closeLogin}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Register MODAL */}
      {showRegisterModal && (
        <div
          className={`custom-login-overlay ${loginClosing ? "fade-out" : "fade-in"}`}
          onClick={closeRegister}
        >
          <div
            className={`custom-login-modal ${loginClosing ? "slide-down" : "slide-up"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="custom-login-header">
              <h4>User Register</h4>
              <button className="model-close-btn" onClick={closeRegister}>
                ×
              </button>
            </div>
            <div className="custom-login-body">
              <Register
                closeModal={closeRegister}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          </div>
        </div>
      )}

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