import React, { useState, useEffect, useRef } from "react";
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/scss/Login.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

function Login({ closeModal }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [error, setError] = useState("");

  const mobileInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


    const baseUrl = process.env.REACT_APP_BACKEND_API;


  // Auto-focus mobile input on mount
  useEffect(() => {
    if (mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, []);

  // If already logged in → close modal
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // if (token) {
    //   closeModal();
    // }
  }, [closeModal]);

  // Handle password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsButtonDisabled(true);

    // Validation
    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsButtonDisabled(false);
      if (mobileInputRef.current) {
        mobileInputRef.current.focus();
        mobileInputRef.current.select();
      }
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Please enter a valid password (min 6 characters)", {
        position: "top-center",
        autoClose: 3000,
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
          mobile: mobile,
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
        localStorage.setItem("user_mobile", mobile);

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
        });

        // Delay closing modal so toast can show
        setTimeout(() => {
          closeModal();
          // window.location.reload();
        }, 500);
        window.location.href="/rule";
      } else {
        setError(data.message || "Invalid credentials");
        toast.error(data.message || "Invalid mobile number or password", {
          position: "top-center",
          autoClose: 4000,
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
      let errorMessage = "Login failed";
      if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
      });
      setPassword("");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Handle mobile number change
  const handleMobileChange = (e) => {
    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="login-container">
      {error && <div className="login-error-box">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="floating-group">
          <FloatingLabel
            controlId="floatingMobile"
            label="Mobile Number"
            className="mb-3"
          >
            <Form.Control
              ref={mobileInputRef}
              type="tel"
              value={mobile}
              onChange={handleMobileChange}
              disabled={isButtonDisabled}
              required
              placeholder="Enter 10-digit mobile number"
              className={`login-input-new ${
                isButtonDisabled ? "login-input-disabled" : ""
              }`}
            />
          </FloatingLabel>
        </div>

        <div className="floating-group">
          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="mb-3"
          >
            <Form.Control
              ref={passwordInputRef}
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={isButtonDisabled}
              required
              placeholder="Enter your password"
              className={`login-input ${
                isButtonDisabled ? "login-input-disabled" : ""
              }`}
            />
          </FloatingLabel>
        </div>

        <label className="age-check d-flex gap-2 align-items-start">
          <input type="checkbox" defaultChecked required />I confirm that I am
          18+ and understand the risks involved in betting.
        </label>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`login-button ${
            isButtonDisabled ? "login-button-disabled" : ""
          }`}
        >
          {isButtonDisabled ? "Logging in..." : "Login"}
        </button>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={5000}
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
  );
}

export default Login;  