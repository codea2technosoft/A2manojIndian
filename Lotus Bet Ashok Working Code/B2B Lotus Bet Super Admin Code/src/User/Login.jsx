import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { verifySuperAdminPassword } from "../Server/api";
import { Link } from "react-router-dom";
import logo from "../asset/image/logo.png";

const Login = () => {
  const [admin_id, setAdmin_Id] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

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
          }),
        },
      );
      const data = await response.json();

      if (response.ok && data.success === true) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        // localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("admin_id", data.user.admin_id);
        localStorage.setItem("role", data.user.role);
        // localStorage.setItem("check", password);

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message || "Login successful!",
          timer: 2000,
          showConfirmButton: false,
        });

        window.location.href = "/dashboard";
      } else {
        Swal.fire({
          icon: "error",
          text: data.message || "Login failed. Please try again.",
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
      <div className="d-flex justify-content-center align-items-center height_100 overflow-hidden">
        <div className="logo_leftside">
          <div className="form_login">
            <a className="logo-dark" href="/">
              <img src={logo} alt="logo" />
            </a>
          </div>
        </div>

        <div className="w-100 overflow-hidden h-100 form_design_all">
          <a
            className="logo_mobile d-lg-none d-flex justify-content-center"
            href="/"
          >
            <img src={logo} alt="logo" />
          </a>
          <div className="py-60 px-24 max-w-464-px">
            <div className="form_login_input">
              <form onSubmit={handleLogin} noValidate>
                {/* Username */}
                {/* <div className="login_content">
                  <h1>Ready to Play?</h1>
                  <p>
                    Log in to place bets on live matches, explore odds, and win
                    big.
                  </p>
                </div> */}

                <div className="form-group mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className={`form-control h-56-px ${
                      error.admin_id ? "error-input" : ""
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
                      {showPassword ? "👁️‍🗨️" : "👁️"}
                    </span>
                  </div>
                  {error.password && (
                    <span className="error-text" style={{ color: "red" }}>
                      {error.password}
                    </span>
                  )}
                </div>
                {/* <div className="terms">
                  This site is protected by reCAPTCHA and the Google{" "}
                  <Link to={"/"}> Privacy Policy</Link> and{" "}
                  <Link to={"/"}> Terms of Service</Link> apply.
                </div> */}

                {/* Submit */}
                <div className="form-group mb-0 text-end">
                  <button
                    type="submit"
                    className="loginbutton w-100"
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
