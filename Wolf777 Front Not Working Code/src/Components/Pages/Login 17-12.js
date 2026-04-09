import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { makeEncryptedRequest } from "../../utils/encryption";

function Login({ closeModal }) {
  const navigate = useNavigate();
  const otpInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const nodeMode = process.env.NODE_ENV;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;
    const baseUrl = process.env.REACT_APP_BACKEND_API;


  const [Phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");

  // Start resend countdown
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Auto-focus phone input on mount
  useEffect(() => {
    if (phoneInputRef.current && !showOtpField) {
      phoneInputRef.current.focus();
    }
  }, [showOtpField]);

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsButtonDisabled(true);

    if (!Phone || Phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsButtonDisabled(false);
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
        phoneInputRef.current.select();
      }
      return;
    }

    try {
      // Using makeEncryptedRequest from utils/encryption.js
      const response = await makeEncryptedRequest(`${baseUrl}/request-otp`, {
        phone_number: Phone,
      });

      // Note: makeEncryptedRequest already decrypts the response
      if (response.success) {
        setShowOtpField(true);
        toast.success(response.message || "OTP sent successfully!", {
          position: "top-center",
          autoClose: 3000,
        });

        // Get bankDetails before clearing storage
        const bankDetails = localStorage.getItem("bankDetails");

        // Clear all localStorage
        localStorage.clear();

        // Restore bankDetails
        if (bankDetails) {
          localStorage.setItem("bankDetails", bankDetails);
        }

        setOtp("");
        setResendTimer(30); // 30s cooldown
        setTimeout(() => {
          if (otpInputRef.current) {
            otpInputRef.current.focus();
          }
        }, 100);
      } else {
        toast.error(response.message || "Failed to send OTP", {
          position: "top-center",
          autoClose: 4000,
        });
      }
    } catch (error) {
      let errorMessage = "OTP request failed";
      if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 4000,
      });
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Verify Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsButtonDisabled(true);

    // Client-side validation
    if (!otp || otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsButtonDisabled(false);
      if (otpInputRef.current) {
        otpInputRef.current.focus();
        otpInputRef.current.select();
      }
      return;
    }

    try {
      const browserId =
        localStorage.getItem("browserId") ||
        CryptoJS.lib.WordArray.random(16).toString();
      localStorage.setItem("browserId", browserId);

      // Using makeEncryptedRequest from utils/encryption.js
      const response = await makeEncryptedRequest(`${baseUrl}/verify-login`, {
        mobile: Phone,
        otp: otp,
        browserId: browserId,
        newTime: new Date().toISOString(),
      });

      // Note: makeEncryptedRequest already decrypts the response
      if (response.success) {
        const user = response.user;
        localStorage.setItem("accessToken", user.token);
        localStorage.setItem("user_id", user._id);

        toast.success(response.message || "Login successful!", {
          position: "top-center",
          autoClose: 2000,
        });

        // Delay closing modal so toast can show
        setTimeout(() => {
          closeModal();
          window.location.reload(); // Reload to update auth state
        }, 1000);
      } else {
        // Set error state
        setError(response.message || "Invalid OTP");

        // Show toast with noticeable settings
        toast.error(response.message || "Invalid OTP. Please try again.", {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Don't clear immediately - let user see what they typed
        setTimeout(() => {
          setOtp("");
          if (otpInputRef.current) {
            otpInputRef.current.focus();
            otpInputRef.current.select(); // Select text for easy retype
          }
        }, 500);
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

      // Clear OTP on network errors
      setOtp("");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = (e) => {
    e?.preventDefault();
    if (resendTimer === 0) {
      handleRequestOtp(new Event("click"));
    }
  };

  // If already logged in → close modal + redirect
  useEffect(() => {
    const token = localStorage.getItem("user_id");
    if (token) {
      closeModal();
      navigate("/");
    }
  }, []);

  const styles = {
    container: {
      padding: "30px 20px",
      width: "100%",
      maxWidth: "400px",
      margin: "auto",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      background: "#fff",
      fontFamily: "Arial, sans-serif",
    },
    title: {
      textAlign: "center",
      fontSize: "24px",
      marginBottom: "25px",
      color: "#4a2faa",
      fontWeight: "600",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontWeight: "500",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "18px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "16px",
      outline: "none",
      transition: "0.2s border-color",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      background:
        "linear-gradient(180deg, rgb(255, 199, 0) 0%, rgb(220, 228, 0) 100%), rgba(0, 0, 0, 0.73)",
      color: "#000",
      padding: "12px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
      transition: "0.3s background",
      marginBottom: "10px",
      boxSizing: "border-box",
    },
    resend: {
      textAlign: "right",
      marginBottom: "15px",
      color: resendTimer > 0 ? "#999" : "#4a2faa",
      cursor: resendTimer > 0 ? "not-allowed" : "pointer",
      fontSize: "14px",
      fontWeight: "500",
    },
    errorBox: {
      color: "#d32f2f",
      fontSize: "14px",
      marginBottom: "15px",
      padding: "10px",
      background: "#ffebee",
      borderRadius: "6px",
      textAlign: "center",
      border: "1px solid #ffcdd2",
    },
    backButton: {
      background: "transparent",
      color: "#4a2faa",
      border: "1px solid #4a2faa",
      padding: "10px",
      borderRadius: "6px",
      cursor: "pointer",
      width: "100%",
      marginTop: "10px",
      fontSize: "14px",
      fontWeight: "500",
      transition: "0.3s all",
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={showOtpField ? handleLogin : handleRequestOtp}>
        <label style={styles.label}>Mobile Number</label>
        <input
          ref={phoneInputRef}
          type="tel"
          value={Phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          disabled={showOtpField || isButtonDisabled}
          required
          placeholder="Enter 10-digit mobile number"
          style={{
            ...styles.input,
            ...(isButtonDisabled && styles.buttonDisabled),
          }}
        />

        {showOtpField && (
          <>
            <label style={styles.label}>Enter 4-digit OTP</label>
            <input
              ref={otpInputRef}
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              disabled={isButtonDisabled}
              required
              placeholder="Enter OTP"
              style={{
                ...styles.input,
                ...(isButtonDisabled && styles.buttonDisabled),
              }}
            />
            <div style={styles.resend} onClick={handleResendOtp}>
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={isButtonDisabled}
          style={{
            ...styles.button,
            ...(isButtonDisabled && styles.buttonDisabled),
          }}
        >
          {isButtonDisabled
            ? "Processing..."
            : showOtpField
            ? "Verify & Login"
            : "Send OTP"}
        </button>

        {showOtpField && (
          <button
            type="button"
            onClick={() => {
              setShowOtpField(false);
              setOtp("");
              setError("");
              setResendTimer(0);
              setTimeout(() => phoneInputRef.current?.focus(), 100);
            }}
            disabled={isButtonDisabled}
            style={styles.backButton}
            onMouseOver={(e) =>
              !isButtonDisabled && (e.target.style.background = "#f0f0f0")
            }
            onMouseOut={(e) =>
              !isButtonDisabled && (e.target.style.background = "transparent")
            }
          >
            ← Change Mobile Number
          </button>
        )}
      </form>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}

export default Login;
