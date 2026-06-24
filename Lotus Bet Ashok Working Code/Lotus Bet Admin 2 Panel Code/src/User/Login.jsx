import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Login.scss";
import { Col, Row } from "react-bootstrap";
import newlogo from "../assets/images/logonew.png"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminOtp, setAdminOtp] = useState("");
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Validate only username and password format
  const validateCredentials = () => {
    let tempErrors = {};
    let isValid = true;

    if (!username) {
      tempErrors.username = "Username is required";
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

  // Validate all fields including OTP for final login
  const validateAll = () => {
    let tempErrors = {};
    let isValid = true;

    if (!username) {
      tempErrors.username = "Username is required";
      isValid = false;
    }

    if (!password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!adminOtp) {
      tempErrors.adminOtp = "Admin OTP is required";
      isValid = false;
    }

    setError(tempErrors);
    return isValid;
  };

  // Verify master admin password
  const verifyMasterAdminPassword = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/verify-master-admin-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: username,
            password: password
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success === true) {
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.message || "Invalid admin credentials"
        };
      }
    } catch (err) {
      return {
        success: false,
        message: err.message || "Network error occurred"
      };
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    // Validate username and password format
    if (!validateCredentials()) return;

    setIsLoading(true);

    try {
      // Verify master admin password with API
      const verification = await verifyMasterAdminPassword();

      if (verification.success) {
        // Password verified successfully
        setIsOtpSent(true);

        Swal.fire({
          icon: "success",
          title: "Verified Successfully",
          text: verification.message || "Please enter your OTP to login",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Password verification failed
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: verification.message || "Invalid admin credentials",
        });

        // Clear password field for security
        setPassword("");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate all fields including OTP
    if (!validateAll()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/master-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: username,
            password,
            admin_otp: adminOtp
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
          text: data.message || "Login successful",
          timer: 1000,
          showConfirmButton: false,
        });

        window.location.href = "/dashboard";
      } else {
        Swal.fire({
          icon: "error",
          text: data.message || "Invalid OTP or credentials",
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
      <Row className="justify-content-center slign-items-center align-items-center height_100vh w-100 overflow-hidden">
        <Col md={5}>
          <div className="py-60 px-24 max-w-464-px">

            <div className="d-flex text-center d-flex justify-content-center mx-auto auth-logo mb-4">
              <a className="logo-dark" href="/">
                <img
                  src={newlogo}
                  alt="logo"
                  className="logo-lg"
                  style={{
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "15px"
                  }}
                />
              </a>
            </div>

            <form onSubmit={isOtpSent ? handleLogin : handleSendOtp} noValidate>
              {/* Username */}
              <div className="form-group mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control h-56-px ${error.username ? "error-input" : ""
                    }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  disabled={isLoading || isOtpSent}
                />
                {error.username && (
                  <span className="error-text" style={{ color: "red" }}>
                    {error.username}
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
                    disabled={isLoading || isOtpSent}
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

              {/* Admin OTP - Show only when OTP is sent */}
              {isOtpSent && (
                <div className="form-group mb-3">
                  <label className="form-label">Admin OTP</label>
                  <input
                    type="text"
                    className={`form-control h-56-px ${error.adminOtp ? "error-input" : ""
                      }`}
                    value={adminOtp}
                    onChange={(e) => setAdminOtp(e.target.value)}
                    placeholder="Enter admin OTP"
                    disabled={isLoading}
                  />
                  {error.adminOtp && (
                    <span className="error-text" style={{ color: "red" }}>
                      {error.adminOtp}
                    </span>
                  )}
                  <small className="text-muted">
                    Default OTP: 144242 (demo purpose)
                  </small>
                </div>
              )}

              {/* Submit Button */}
              <div className="form-group mb-0 text-center">
                <button
                  type="submit"
                  className="loginbutton w-100"
                  disabled={isLoading}
                >
                  {isLoading
                    ? (isOtpSent ? "Logging in..." : "Verifying...")
                    : (isOtpSent ? "Log In" : "Verify & Send OTP")}
                </button>
              </div>

              {/* Option to go back */}
              {isOtpSent && (
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => {
                      setIsOtpSent(false);
                      setAdminOtp(""); // Clear OTP field
                      // Optionally clear password for security
                      setPassword("");
                    }}
                    disabled={isLoading}
                  >
                    ← Change credentials
                  </button>
                </div>
              )}
            </form>
          </div>
        </Col>
      </Row >
    </div>
  );
};

export default Login;