// src/components/Navbar/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import './Navbar.scss';
import axios from "axios";
import Swal from "sweetalert2";
import { IoMdClose } from "react-icons/io";
import CryptoJS from "crypto-js";

const Navbar = () => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  var baseUrl;
  if (nodeMode === "development") {
    baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }
  const location = useLocation();
  const [Phone, setPhone] = useState();
  const [twofactor_code, settwofactor_code] = useState();
  const [otp, setOtp] = useState(false);
  const [secretCode, setSecretCode] = useState();
  const [ipAddress, setIpAddress] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const Menu = [
    { id: "home", label: "Home", path: "/" },
    { id: "inplay", label: "In-Play", path: "/inplay" },
    { id: "multimarkets", label: "Multi Markets", path: "/multi-markets" },
    { id: "cricket", label: "Cricket", path: "/cricket" },
    { id: "vimaan", label: "Vimaan", path: "/vimaan" }, // Aviator game
    { id: "tennis", label: "Tennis", path: "/tennis" },
    { id: "soccer", label: "Soccer", path: "/football" }, // soccer/football
    { id: "horse", label: "Horse Racing", path: "/horse-racing" },
    { id: "greyhound", label: "Greyhound Racing", path: "/greyhound-racing" },
    { id: "basketball", label: "Basketball", path: "/basketball" },
    { id: "lottery", label: "Lottery", path: "/lottery" },
    { id: "casino", label: "Live Casino", path: "/casino" },
    { id: "tips", label: "Tips & Previews", path: "/tips" },
  ];

  const [login, setLogin] = useState(false);
  const encryptData = (data, secretKey) => {
    const jsonString = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
    return encryptedData;
  };

  const generateHMAC = (data, secretKey) => {
    return CryptoJS.HmacSHA256(data, secretKey).toString(CryptoJS.enc.Base64);
  };
  const handleSubmit = async (e) => {
    let secretKey = process.env.REACT_APP_SECRET_KEY;
    let newTime = time.toString();
    e.preventDefault();
    setIsButtonDisabled(true);
    const PhoneTelNum = Phone;
    if (!PhoneTelNum) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your phone",
      });
      setIsButtonDisabled(false);
    } else if (Phone.length !== 10) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a correct phone number",
      });
      setIsButtonDisabled(false);
    } else {
      try {
        const generateRandomAlphanumeric = (length) => {
          const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
          let result = "";
          const charactersLength = characters.length;
          for (let i = 0; i < length; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }
          return result;
        };

        const requestData = {
          PhoneTelNum,
          ipAddress,
          deviceName,
          newTime,
        };

        const encryptedRequest = encryptData(requestData, secretKey);
        const hmac = generateHMAC(encryptedRequest, newTime);
        const dataToSend = { encryptedData: encryptedRequest, hmac };

        const response = await axios.post(
          `${baseUrl}/user-login-send-tats`,
          dataToSend,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { status, msg, secret } = response.data;
        if (status === 101) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: msg,
          });
          setIsButtonDisabled(false);
        } else if (status === 200) {

          setOtp(true);
          setSecretCode(secret);
        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong",
        });
        console.error(e);
        setIsButtonDisabled(false);
      }
    }
  };
  const loginmodal = () => {
    setLogin(true);
  }

  const closebutton = () => {
    setLogin(false);
  };
  
  const setError = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Invalid Number",
      confirmation: true,
    });
  };
  return (
    <>
      <nav className="navbar m-0 p-0">
        <div className="container-fluid">
          <div className="navbar-container w-100 d-flex justify-content-between align-items-center">
            <div className="navbar-logo">
              <Link to="/">
                <h2>Booki</h2>
              </Link>
            </div>
            <div className="navbar-actions">
              <button className="login-btn" onClick={() => loginmodal()}>Login</button>
              <button className="join-btn">Join Now</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="custum_haeder">
        <div className="container-fluid">
          <div className="navbar-tabs">
            {Menu.map(menulink => (
              <Link
                key={menulink.id}
                to={menulink.path}
                className={`tab ${location.pathname === menulink.path ? 'active' : ''}`}
              >
                {menulink.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {login && (
        <div className="login-container">
          <div className="login-grid">
            <div className="overlay-login"></div>
            <div className="login-grid-design"></div>
            <div className="closebutton" onClick={closebutton}><IoMdClose /></div>

            <div className="login-content">
              <div className="login-header">
                <h2>Welcome Back</h2>
                <p>Sign in to access your account</p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="input-group">
                  <span className="input-icon">👤</span>
                  <input
                    name="mobile"
                    type="tel"
                    placeholder="Mobile Number"
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (e.target.value.length > 10) {
                        setError(true);
                      }
                    }}
                    required
                  />
                </div>
                <div className="input-group">
                  {otp && (

                    <><span className="input-icon">🔒</span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"

                        placeholder="Enter OTP"
                        onChange={(e) => settwofactor_code(e.target.value)}
                        required
                      />
                 
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                     </>
                  )}
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    Remember me
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>

                <button type="submit" className="login-button">
                  Login
                </button>
              </form>

              <div className="social-login">
                <p>or continue with</p>
                <div className="social-buttons">
                  <button className="social-btn google">G</button>
                  <button className="social-btn facebook">F</button>
                  <button className="social-btn github">Git</button>
                </div>
              </div>

              <div className="signup-link">
                <p>Don't have an account? <a href="#">Sign up</a></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;  