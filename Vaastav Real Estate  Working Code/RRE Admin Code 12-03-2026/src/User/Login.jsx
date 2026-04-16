import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Admin.scss";
import logo from "../assets/images/logo.png";
import imageplot from "../assets/images/loginimage.jpg";
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const validate = () => {
    let tempErrors = {};
    let isValid = true;
    if (!email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is invalid";
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
    if (!validate()) {
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success === "1") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        Swal.fire({
          title: "<strong>Login Successful!</strong>",
          html: `<p style="margin-top: 10px;">Welcome, ${email}</p>`,
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          width: "22em",
          customClass: {
            popup: "custom-swal",
            title: "custom-swal-title",
            icon: "custom-swal-icon",
          },
          didClose: () => {
            //navigate("/dashboard");
            //window.location.href = "/all-associate-list";
            window.location.href = "/dashboard";
          },
        });

        setError({});
      } else {
        setError({ form: data.message || "Invalid email or password." });
      }
    } catch (err) {
      setError((prevError) => ({
        ...prevError,
        password: "Invalid Password",
      }));
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <div className="adminlogin">
        <div className="d-flex login_form align-items-center">
          <div className="quotes">
            <h2>Welcome to Vaastav Real Estate</h2>
            <p>
              Log in to access exclusive property listings, manage your account,
              and connect with trusted agents across Rajasthan.
            </p>
          </div>
          <div className="imagelogin">
            <img src={imageplot} alt="imageplot" />
          </div>
          <div className="login-wrapper">
            <div className="form_design">
              <div className="logo_login">
                <img src={logo} alt="logo" />
              </div>
              <h2>Welcome Back</h2>
              <p>Let’s login to grab amazing deal</p>
              {error.form && (
                <div className="alert alert-danger">{error.form}</div>
              )}
              <form
                onSubmit={handleLogin}
                noValidate
                className="login-form text-start"
              >
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={` h-56-px ${error.email ? "error-input" : ""}`}
                    placeholder="Enter your email"
                  />
                  {error.email && (
                    <span className="error-text" style={{ color: "red" }}>
                      {error.email}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={` h-56-px ${
                        error.password ? "error-input" : ""
                      }`}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{ paddingRight: "40px" }}
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {error.password && (
                    <span className="error-text" style={{ color: "red" }}>
                      {error.password}
                    </span>
                  )}
                </div>

                <div className="form-options">
                  <label>
                    <input type="checkbox" defaultChecked /> Remember me
                  </label>
                </div>

                <button className="login-btn" type="submit">
                  Login
                </button>
              </form>

              {/* <div className="signup-text">
            Don’t have an account? <a href="#">Sign Up</a>
          </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="login-container overflow-hidden">
    <div className="d-flex h-100 overflow-hidden">
      <div className="width_50 height_100vh d-none d-lg-block bg-login overflow-hidden rounded-left">
        <div className="loginimage">
          <img
            src={`${process.env.PUBLIC_URL}/assets/images/loginbg.png`}
            alt="Login Background"
          />
        </div>
      </div>
      <div className="width_50 bg-white overflow-hidden d-flex align-items-center justify-content-center height_100vh">
        <div className="py-60 px-24 max-w-464-px mx-auto">
          <div className="text-center mx-auto auth-logo mb-4">
            <a className="logo-dark" href="/">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                alt="logo"
              />
            </a>
          </div>
          {error.form && (
            <div className="alert alert-danger">{error.form}</div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div className="form-group mb-3">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-control h-56-px ${error.email ? "error-input" : ""
                  }`}
                placeholder="Enter your email"
              />
              {error.email && (
                <span className="error-text" style={{ color: "red" }}>
                  {error.email}
                </span>
              )}
            </div>

            <div className="form-group mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control h-56-px ${error.password ? "error-input" : ""
                    }`}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ paddingRight: "40px" }}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") setShowPassword(!showPassword);
                  }}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    userSelect: "none",
                    fontSize: "18px",
                    color: "#555",
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

              <a
                className="text-muted forgetpassword d-flex justify-content-end mt-1"
                href="/"
              >
                <small>Forgot password?</small>
              </a>
            </div>

            <div className="my-3">
              <div className="form-group d-flex align-items-start mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="checkbox-signin"
                  defaultChecked
                />
                <label
                  className="form-check-label ms-2"
                  htmlFor="checkbox-signin"
                >
                  By logging in, you agree to the Terms & Conditions and our
                  Privacy Policy.
                </label>
              </div>
            </div>
            <div className="form-group mb-0 text-center">
              <button type="submit" className="loginbutton w-100">
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div> */}
    </div>
  );
};
export default Login;
