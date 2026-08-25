import React, { useState } from "react";
import Swal from "sweetalert2";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import Loginimage from '../asset/image/loginimage.png'
import {
  verifySuperAdminPassword,
} from "../Server/api";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";


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
      const payload = {
        admin_id,
        password
      }
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

    // ✅ CHANGE 1: OTP check COMMENT karo
    // if (!otp) {
    //   setOtpError("OTP is required");
    //   return;
    // }

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
            // ✅ CHANGE 2: admin_otp COMMENT karo
            // admin_otp: otp,
          }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success === true) {
        // const permissions = Array.isArray(data.user.permissions)
        //   ? data.user.permissions
        //   : [];
        // if (data.user.user_type === "subadmin" && permissions.length === 0) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Access Denied",
        //     text: "No permissions assigned to this SubAdmin",
        //   });
        //   return;
        // }
        const expiryTime = new Date().getTime() + 30 * 60 * 1000;
        // const expiryTime = Date.now() + 60000; // 1 minute

        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("admin_id", data.user.admin_id);
        localStorage.setItem("user_type", data.user.user_type);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("expiryTime", expiryTime);
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
        });
        //  navigate("/dashboard");
        // window.location.href = "/dashboard";
        // console.log(data);
        // return;
        // if (data.user.user_type === "admin") {
        //   // window.location.href = "/dashboard";
        //   // alert('loginjs');
        //   navigate("/dashboard");
        // } else if (data.user.user_type === "subadmin") {
        //   // window.location.href = "/Dashboard"; 
        //   navigate("/Dashboard");
        // } else {
        //   window.location.href = "/";
        // }

        if (data.user.user_type === "admin") {
          window.location.href = "/dashboard";
        } else if (data.user.user_type === "subadmin") {
          window.location.href = "/Dashboard";
        } else {
          window.location.href = "/";
        }


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
      <div className="container">
        <div className="h-100 align-items-center justify-content-center row">
          <div className="col-md-11">
            <div className="row  align-items-center justify-content-center ">
              <div className="col-md-7">
                <div className="loginiamge">
                  <img src={Loginimage} alt="loginimage" />
                </div>
              </div>
              <div className="col-md-5">
                <div className="text-center d-flex justify-content-center mx-auto auth-logo mb-4">
                  <a className="logo-dark" href="/">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                      alt="logo"
                    />
                  </a>
                </div>
                <div className="box_login">
                  <div className="d-flex flex-column align-items-center mb-4">
                    <h5 className="m-0">Welcome</h5>
                    <span>Login in to you account to continue</span>
                  </div>

                  {/* ✅ CHANGE 3: Purani form line COMMENT karo */}
                  {/* <form onSubmit={isOtpSent ? handleLogin : handleSendOtp} noValidate> */}

                  {/* ✅ NAYI FORM LINE - Sirf handleLogin */}
                  <form onSubmit={handleLogin} noValidate>

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
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                      {error.password && (
                        <span className="error-text" style={{ color: "red" }}>
                          {error.password}
                        </span>
                      )}
                    </div>

                    {/* ✅ VERIFICATION CODE WALA PURA COMMENT HAI - YEH RAHENE DO */}
                    {/* <div className="mb-2 position-relative">
                      <label className="form-label">Verification Code</label>
                    <input
                      keyboardtype="numeric"
                      autoComplete="off"
                      maxLength={4}
                      name="validateCode"
                      placeholder="ValidationCode"
                      type="number"
                      className="login-input  form-control"
                    />
                    <div
                      className="position-absolute top-0 flex items-center h-40px ml-2 space-x-3px start-icon"
                      style={{ left: 10 }}
                    >
                      {" "}
                      <span className=" position-absolute  translate-middle-y top-50 icon-content text-18 text-black-400 top-3 left-3 z-10 icon-shield">
                        <i className="icon-flag-bangladesh path1 z-10 text-18" />
                      </span>
                    </div>
                    <canvas
                      className="position-absolute translate-middle-y top-50 canvas-img"
                      id="authenticateImage"
                    />
                  </div> */}

                    {/* ✅ OTP WALA PURA COMMENT HAI - YEH RAHENE DO */}
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

                    {/* ✅ OTP FIELD WALA PURA COMMENT HAI - YEH RAHENE DO */}
                    {/* {isOtpSent && (
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
                  )} */}

                    {/* Submit */}
                    <div className="form-group mb-0 text-center">
                      <button
                        type="submit"
                        className="btn buttonlogin"
                        disabled={isLoading}
                      >
                        {/* ✅ CHANGE 4: Purana text COMMENT karo */}
                        {/* {isLoading ? "Processing..." : isOtpSent ? "Log In" : "Send OTP"} */}

                        {/* ✅ NAYA TEXT - Sirf Login */}
                        {isLoading ? "Processing..." : "Login"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;