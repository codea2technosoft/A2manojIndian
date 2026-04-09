import React, { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import logo from "../../assets/images/logo.png";
// import '../../assets/scss/Login.scss'
import { useNavigate } from "react-router-dom";

function Login({ closeModal }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [otp, setOtp] = useState(false);

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


  const baseUrl = process.env.REACT_APP_BACKEND_API;




  // Auto-focus username input on mount
  useEffect(() => {
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  // Handle password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsButtonDisabled(true);

    // Validation
    if (!username || username.trim() === "") {
      toast.error("Please enter a valid username", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setIsButtonDisabled(false);
      if (usernameInputRef.current) {
        usernameInputRef.current.focus();
        usernameInputRef.current.select();
      }
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Please enter a valid password (min 6 characters)", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setIsButtonDisabled(false);
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
        passwordInputRef.current.select();
      }
      return;
    }

    try {
      // Generate or get browserId
      const browserId =
        localStorage.getItem("browserId") ||
        CryptoJS.lib.WordArray.random(16).toString();
      localStorage.setItem("browserId", browserId);

      // Make password login request using regular fetch
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: username.trim(),  // Changed from mobile to username
          password: password,
          browserId: browserId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const user = data.user;

        // Store tokens and user info
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("user_id", user._id);
        localStorage.setItem("user_username", username.trim());
        localStorage.setItem("admin_id", user.admin_id);

        // Dispatch custom event for real-time token update
        window.dispatchEvent(
          new CustomEvent("authStateChange", {
            detail: {
              isAuthenticated: true,
              token: user.token,
              userId: user._id,
            },
          })
        );

        toast.success(data.message || "Login successful!", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        localStorage.setItem("isDemo", "true");

        setTimeout(() => {
          if (closeModal) closeModal();
          navigate("/indexpage");
        }, 1500);
      } else {
        setError(data.message || "Invalid credentials");
        toast.error(data.message || "Invalid username or password", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Clear password on error
        setPassword("");
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setPassword("");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Handle username change
  const handleUsernameChange = (e) => {
    // setUsername(e.target.value);
    const value = e.target.value;

    // 10 digit limit
    if (value.length <= 10) {
      setUsername(value);
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDemoLogin = () => {
    localStorage.setItem("isDemo", "true");

    toast.success("Demo login successful! Redirecting...", {
      position: "top-center",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

    setTimeout(() => {
      if (closeModal) closeModal();
      navigate("/indexpage");
    }, 1500);
  };
  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-brand">
          <img src={logo} alt="logo" />
          {/* <h1>MILLION X</h1> */}
        </div>

        {error && (
          <div className="login-error-box">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          {/* <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <Form.Control
                ref={usernameInputRef}
                type="text"
                value={username}
                onChange={handleUsernameChange}
                disabled={isButtonDisabled}
                required
                placeholder="Enter your username"
                className={`login-input ${isButtonDisabled ? "login-input-disabled" : ""
                  }`}
              />
            </div>
          </div> */}
          <div className="form-group">
            <label className="form-label">Mobile number</label>
            <div className="input-wrapper">
              <Form.Control
                ref={usernameInputRef}
                type="number"
                value={mobile}
                onChange={handleUsernameChange}
                disabled={isButtonDisabled}
                required
                placeholder=" Mobile Number"
                className={`login-input ${isButtonDisabled ? "login-input-disabled" : ""
                  }`}
              />
            </div>
          </div>

          {otp && (
            <div className="form-group">
              <label className="form-label">OTP</label>
              <div className="input-wrapper">
                <Form.Control
                  ref={passwordInputRef}
                  type="number"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isButtonDisabled}
                  required
                  placeholder="Enter OTP"
                  className={`login-input ${isButtonDisabled ? "login-input-disabled" : ""
                    }`}
                />
              </div>
            </div>
          )}
          {/* <button
            type="submit"
            disabled={isButtonDisabled}
            className={`signin-button ${isButtonDisabled ? "signin-button-disabled" : ""
              }`}
              
              onClick={() => setOtp(true)}
          >
            {isButtonDisabled ? "Logging in..." : "Sign In"}
          </button> */}
          <button
            type="button"
            disabled={username.length !== 10} // sirf 10 digit par enable
            className={`signin-button ${username.length !== 10 ? "signin-button-disabled" : ""}`}
            onClick={() => {
              if (username.length === 10) setOtp(true); // OTP tabhi show
            }}
          >
            Sign In
          </button>
          {/* <div className="divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="demo-login-button"
            onClick={handleDemoLogin}
            disabled={isButtonDisabled}
          >
            Demo Login
          </button> */}

          <div className="terms-section">
            <div className="terms-row">
              <a href="/privacy-policy" className="terms-link">
                PRIVACY POLICY
              </a>
              <a href="/terms" className="terms-link">
                TERMS & CONDITIONS
              </a>
            </div>
            <div className="terms-row">
              <a href="/rules" className="terms-link">
                RULES & REGULATIONS
              </a>
            </div>
          </div>
        </form>

        <ToastContainer
          position="top-center"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{
            fontSize: "14px",
            top: "20px",
            zIndex: 9999,
          }}
        />



      </div>
    </div>
  );
}

export default Login;