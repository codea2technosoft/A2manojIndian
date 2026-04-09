import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import {
  verifySuperAdminPassword,
} from "../Server/api";

const Login = () => {
  const [admin_id, setAdmin_Id] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!admin_id) {
      tempErrors.admin_id = "Username is required";
      isValid = false;
    }

    if (!password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setError(tempErrors);
    return isValid;
  };

  const validateCredentials = () => {
    let tempErrors = {};
    let isValid = true;

    if (!admin_id) {
      tempErrors.admin_id = "Username is required";
      isValid = false;
    }

    if (!password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setError(tempErrors);
    return isValid;
  };

const handleSendOtp = async (e) => {
  e.preventDefault();

  if (!validateCredentials()) return;

  try {
    setIsLoading(true);
    const payload={
     admin_id,
      password
    }
    // SIRF YAHI CHAHIYE 👇
    const res = await verifySuperAdminPassword(payload)
    
    if (res.data.success === true) {
      setIsOtpSent(true);

      Swal.fire({
        icon: "success",
        title: "OTP Sent",
        text: "Please enter OTP to continue",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: "error",
        text: res.data.message
      });
    }

  } catch (err) {
    Swal.fire({
      icon: "error",
      text: err.message,
    });
  } finally {
    setIsLoading(false);
  }
};



  const handleLogin = async (e) => {
    e.preventDefault();

    if (!otp) {
      setOtpError("OTP is required");
      return;
    }
    // if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/super-admin-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id,
            password,
            admin_otp: otp,
          }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success === true) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("admin_id", data.user.admin_id);
        localStorage.setItem("role", data.user.role);
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
        });
      //  navigate("/dashboard");
      window.location.href = "/dashboard";

      } else {
        Swal.fire({
          icon: "error",
          text: data.message,
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container overflow-hidden">
      <div className="d-flex justify-content-center align-items-center height_100 overflow-hidden">
        <div className="width_50 overflow-hidden">
          <div className="py-60 px-24 max-w-464-px">
            <div className="text-center d-flex justify-content-center mx-auto auth-logo mb-4">
              <a className="logo-dark" href="/">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                  alt="logo"
                />
              </a>
            </div>

            {/* <form onSubmit={handleLogin} noValidate> */}
            <form onSubmit={isOtpSent ? handleLogin : handleSendOtp} noValidate>
              {/* Username */}
              <div className="form-group mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control h-56-px ${error.admin_id ? "error-input" : ""
                    }`}
                  value={admin_id}
                  onChange={(e) => setAdmin_Id(e.target.value)}
                  placeholder="Enter username"
                  disabled={isLoading}
                />
                {error.admin_id && (
                  <span className="error-text" style={{ color: "red" }}>
                    {error.admin_id}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-group mb-3">
                <label className="form-label">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control h-56-px ${error.password ? "error-input" : ""
                      }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
                {error.password && (
                  <span className="error-text" style={{ color: "red" }}>
                    {error.password}
                  </span>
                )}
              </div>
              {/* <div className="mb-3">
                <label className="form-label text-white">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setOtpError("");
                  }}
                  maxLength={6}
                  placeholder="Enter 6 digit OTP"
                />

                {otpError && (
                  <small className="text-danger">{otpError}</small>
                )}
              </div> */}

              {isOtpSent && (
                <div className="mb-3">
                  <label className="form-label text-white">Enter OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setOtpError("");
                    }}
                    maxLength={6}
                    placeholder="Enter 6 digit OTP"
                  />
                  {otpError && <small className="text-danger">{otpError}</small>}
                </div>
              )}

              {/* Submit */}
              <div className="form-group mb-0 text-center">
                <button
                  type="submit"
                  className="loginbutton w-100"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : isOtpSent
                      ? "Log In"
                      : "Send OTP"}

                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


















