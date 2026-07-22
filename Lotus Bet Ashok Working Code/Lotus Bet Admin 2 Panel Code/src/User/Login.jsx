import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Login.scss";
import { Col, Row } from "react-bootstrap";
import newlogo from "../assets/images/logonew.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate username and password
  const validate = () => {
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

  // Direct Login - No OTP
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate username and password
    if (!validate()) return;

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
            password: password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success === true) {
        // ✅ Store all user data
        const userData = data.user || data.data?.user || {};
        const adminDetails = data.data?.admin_details || userData;
        
        // Store tokens
        localStorage.setItem("token", data.accessToken || data.token || "");
        localStorage.setItem("refreshToken", data.refreshToken || "");
        localStorage.setItem("isLoggedIn", "true");
        
        // Store user details
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("admin_id", userData.admin_id || username);
        localStorage.setItem("role", userData.role || "");
        
        // ✅ Store coins and PL values (if available)
        const coins = adminDetails.coins || userData.coins || 0;
        const runningPl = adminDetails.running_pl || userData.running_pl || 0;
        const uplinePl = adminDetails.upline_pl || userData.upline_pl || 0;
        const lifetimePl = adminDetails.lifetime_pl || userData.lifetime_pl || 0;
        
        localStorage.setItem("coins", coins.toString());
        localStorage.setItem("running_pl", runningPl.toString());
        localStorage.setItem("upline_pl", uplinePl.toString());
        localStorage.setItem("lifetime_pl", lifetimePl.toString());
        
        // Store complete data
        localStorage.setItem("userData", JSON.stringify(data.data || data));

        console.log("✅ Login Success:", {
          coins,
          runningPl,
          uplinePl,
          lifetimePl,
          admin_id: userData.admin_id
        });

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message || "Login successful",
          timer: 1000,
          showConfirmButton: false,
        });

        // Force redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        Swal.fire({
          icon: "error",
          text: data.message || "Invalid credentials. Please try again.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container overflow-hidden">
      <div className="d-flex justify-content-between align-items-center height_100vh overflow-hidden">
        <div className="logo_leftside">
          <div className="form_login">
            <a className="logo-dark" href="/">
              <img src={newlogo} alt="logo" />
            </a>
          </div>
        </div>
        <div className="overflow-hidden h-100 form_design_all">
          <div className="width_login_form">
            <div className="form_login_input">
              <form onSubmit={handleLogin} noValidate>
                {/* Username */}
                <div className="form-group mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className={`form-control h-56-px ${
                      error.username ? "error-input" : ""
                    }`}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    disabled={isLoading}
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
                      className={`form-control h-56-px ${
                        error.password ? "error-input" : ""
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

                <small className="smalltext">
                  This site is protected by reCAPTCHA and the Google{" "}
                  <a href="#">Privacy Policy</a> and{" "}
                  <a href="#">Terms of Service apply</a>.
                </small>

                {/* Submit Button */}
                <div className="form-group mb-0 text-end">
                  <button
                    type="submit"
                    className="loginbutton"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;