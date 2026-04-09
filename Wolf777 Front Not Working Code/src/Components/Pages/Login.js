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
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [error, setError] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const mobileInputRef = useRef(null);
  const otpInputRef = useRef(null);

  const baseUrl = process.env.REACT_APP_BACKEND_API;

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Auto-focus mobile input on mount
  useEffect(() => {
    if (mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, []);

  // Focus OTP field when it appears
  useEffect(() => {
    if (showOtpField && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [showOtpField]);

  // Handle request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault(); // Prevent form submission and page reload
    setError("");
    
    // Validation
    if (!mobile || mobile.trim() === "" || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      if (mobileInputRef.current) {
        mobileInputRef.current.focus();
        mobileInputRef.current.select();
      }
      return;
    }

    setIsButtonDisabled(true);

    try {
      console.log("Sending OTP request for mobile:", mobile.trim()); // Debug log
      
      const response = await fetch(`${baseUrl}/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
        }),
      });

      const data = await response.json();
      console.log("OTP Response:", data); // Debug log

      if (data.success) {
        toast.success("OTP sent successfully!", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        
        setShowOtpField(true);
        setOtpRequested(true);
        setTimer(60); // 60 seconds timer for resend
        setOtp(""); // Clear any previous OTP
      } else {
        setError(data.message || "Failed to send OTP");
        toast.error(data.message || "Failed to send OTP", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("OTP Request Error:", error); // Debug log
      let errorMessage = "Failed to send OTP. Please try again.";
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
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Handle verify OTP and login
  const handleVerifyOtp = async (e) => {
    e.preventDefault(); // Prevent form submission
    setError("");
    setIsButtonDisabled(true);

    // Validation
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      setIsButtonDisabled(false);
      if (otpInputRef.current) {
        otpInputRef.current.focus();
        otpInputRef.current.select();
      }
      return;
    }

    try {
      // Generate or get browserId
      const browserId =
        localStorage.getItem("browserId") ||
        CryptoJS.lib.WordArray.random(16).toString();
      localStorage.setItem("browserId", browserId);

      console.log("Verifying OTP:", { mobile: mobile.trim(), otp, browserId }); // Debug log

      // Make verify OTP request
      const response = await fetch(`${baseUrl}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile.trim(),
          otp: otp,
          browserId: browserId,
        }),
      });

      const data = await response.json();
      console.log("Verify OTP Response:", data); // Debug log

      if (data.success) {
        const user = data.user;

        // Store tokens and user info
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("user_id", user._id);
        localStorage.setItem("user_mobile", mobile.trim());
        if (user.admin_id) {
          localStorage.setItem("admin_id", user.admin_id);
        }

        // Dispatch custom event for real-time token update
        window.dispatchEvent(
          new CustomEvent("authStateChange", {
            detail: {
              isAuthenticated: true,
              token: data.token,
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
        setError(data.message || "Invalid OTP");
        toast.error(data.message || "Invalid OTP", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Clear OTP on error
        setOtp("");
        if (otpInputRef.current) {
          otpInputRef.current.focus();
        }
      }
    } catch (error) {
      console.error("Verify OTP Error:", error); // Debug log
      let errorMessage = "Verification failed. Please try again.";
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
      setOtp("");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Handle mobile change
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    // Only allow numbers and limit to 10 digits
    if (value.length <= 10) {
      setMobile(value);
    }
    // Reset OTP state if mobile changes
    if (showOtpField) {
      setShowOtpField(false);
      setOtpRequested(false);
      setOtp("");
      setTimer(0);
    }
  };

  // Handle OTP change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    // Only allow numbers and limit to 6 digits (typical OTP length)
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async (e) => {
    e.preventDefault(); // Prevent any default behavior
    if (timer > 0) {
      toast.info(`Please wait ${timer} seconds before resending`, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }
    
    await handleRequestOtp(e);
  };

  // Handle back to mobile input
  const handleBackToMobile = (e) => {
    e.preventDefault(); // Prevent any default behavior
    setShowOtpField(false);
    setOtpRequested(false);
    setOtp("");
    setTimer(0);
    if (mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  };

  const handleDemoLogin = (e) => {
    e.preventDefault(); // Prevent any default behavior
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
        </div>

        {error && (
          <div className="login-error-box">
            {error}
          </div>
        )}

        <form onSubmit={showOtpField ? handleVerifyOtp : handleRequestOtp} className="login-form">
          <div className="form-group">
            <label className="form-label">Mobile number</label>
            <div className="input-wrapper">
              <Form.Control
                ref={mobileInputRef}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={mobile}
                onChange={handleMobileChange}
                disabled={isButtonDisabled || showOtpField}
                required
                placeholder="Enter Mobile Number"
                className={`login-input ${(isButtonDisabled || showOtpField) ? "login-input-disabled" : ""}`}
              />
            </div>
          </div>

          {showOtpField && (
            <>
              <div className="form-group">
                <label className="form-label">Enter OTP</label>
                <div className="input-wrapper">
                  <Form.Control
                    ref={otpInputRef}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={isButtonDisabled}
                    required
                    placeholder="Enter 4-6 digit OTP"
                    className={`login-input ${isButtonDisabled ? "login-input-disabled" : ""}`}
                  />
                </div>
              </div>
              
              <div className="otp-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <button
                  type="button"
                  className="back-button"
                  onClick={handleBackToMobile}
                  disabled={isButtonDisabled}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="resend-button"
                  onClick={handleResendOtp}
                  disabled={isButtonDisabled || timer > 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: timer > 0 ? '#999' : '#007bff',
                    cursor: timer > 0 ? 'default' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={
              isButtonDisabled || 
              (showOtpField ? otp.length < 4 : mobile.length !== 10)
            }
            className={`signin-button ${
              (isButtonDisabled || 
               (showOtpField ? otp.length < 4 : mobile.length !== 10)) 
                ? "signin-button-disabled" : ""
            }`}
          >
            {isButtonDisabled 
              ? (showOtpField ? "Verifying..." : "Sending OTP...") 
              : (showOtpField ? "Verify OTP & Login" : "Send OTP")}
          </button>

          {/* Uncomment if you want to keep demo login */}
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