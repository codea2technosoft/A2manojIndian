import React, { useState } from "react";
import "./Login.scss";
import logo from "../assets/images/logo.png";
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate, Navigate } from "react-router-dom";
import imageplot from '../assets/images/loginimage.jpg';

function Login() {
  const [passwordshow, setpasswordshow] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  // ✅ Already logged in redirect
  if (localStorage.getItem("isLoggedIn") === "true") {
    return <Navigate to="/" replace />;
  }

  const togglepasswordshow = () => {
    setpasswordshow((prev) => !prev);
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;
    if (!mobile) {
      tempErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      tempErrors.mobile = "Enter a valid 10-digit mobile number";
      isValid = false;
    }
    if (!password) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    // if (!captcha) {
    //   tempErrors.captcha = "Captcha is required";
    //   isValid = false;
    // }
    setError(tempErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/login-web-customer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success === "1") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.data.username);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        Swal.fire({
          title: "<strong>Login Successful!</strong>",
          html: `<p style="margin-top: 10px;">Welcome, ${mobile}</p>`,
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
        }).then(() => {
          navigate("/my-dashboard/profile"); 
        });

        setError({});
      } 
      else {
  let clientMessage = "Something went wrong. Please try again.";

  if (data.success === "3") {
    clientMessage = "Mobile number or Password is incorrect. Please verify and try again.";
  } else if (data.message) {
    clientMessage = data.message;
  }

  setError({ form: clientMessage });
}

    } catch (err) {
      console.error("Login error:", err);
      setError({ password: "Invalid Password" });
    }
  };

  return (
    <div className="adminlogin">
      <div className="d-flex login_form align-items-center">
        <div className="quotes">
          <h2>Welcome to Shubh Bhoomi Real Estate</h2>
          <p>
            Log in to access exclusive property listings, manage your account,
            and connect with trusted agents across Rajasthan.
          </p>
        </div>
       <div className='imagelogin'>
                   <img src={imageplot} alt="imageplot" />
                </div>
        <div className="login-wrapper">
          <div className="form_design">
            <div className="logo_login">
              <img src={logo} alt="logo" />
            </div>
            <h2>Welcome Back</h2>
            <p>Let’s login to grab amazing deal</p>

            <form className="login-form text-start" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Mobile No</label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                {error.mobile && (
                  <small className="text-danger">{error.mobile}</small>
                )}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type={passwordshow ? "text" : "password"}
                  autoComplete="off"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="passwordhideshow">
                  <button type="button" onClick={togglepasswordshow}>
                    {passwordshow ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {error.password && (
                  <small className="text-danger">{error.password}</small>
                )}
              </div>

              {/* <div className="form-options">
                <label>
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <a href="#">Forgot Password?</a>
              </div> */}

              {error.form && <p className="text-danger">{error.form}</p>}

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
  );
}

export default Login;
