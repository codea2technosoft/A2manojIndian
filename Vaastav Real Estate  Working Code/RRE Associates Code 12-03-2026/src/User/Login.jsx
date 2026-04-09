import React, { useState,useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import logo from "../assets/images/logo.png";
import imageplot from "../assets/images/loginimage.jpg";
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import "./Admin.scss";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


 

  
 useEffect(() => {
    const autoLogin = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const mobileParam = queryParams.get("mobile");
      const passwordParam = queryParams.get("pssword"); // Note: Typo "pssword"

      if (mobileParam && passwordParam) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/loginAssociateChannel`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ mobile: mobileParam, password: passwordParam }), // Use correct keys
            }
          );

          const data = await response.json();

          if (response.ok && data.success === "1") {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.data.username); // Optional

            const username = data.data.username;
            const sentenceCaseName =
              username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

            Swal.fire({
              title: "Login Successful!",
              html: `Welcome : ${sentenceCaseName}`,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              timerProgressBar: true,
            }).then(() => {
              window.location.href = "/my-team";
              // window.location.href = "/dashboard";
            });

            setError({});
          } else {
            let errorMessage = "Invalid mobile or password.";
            if (data.message === "not exist or inactive") {
              errorMessage = "Your account is blocked. Please contact admin.";
            }
            setError({ form: errorMessage });
          }
        } catch (err) {
          console.error("Login Error:", err);
          setError({ form: "Something went wrong. Try again later." });
        }
      }
    };

    autoLogin(); // Call the async function
  }, []);

    useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const token = localStorage.getItem("token");

    if (isLoggedIn === "true" && token) {
      // ✅ Already logged in, redirect to dashboard
      navigate("/my-team");
      //navigate("/dashboard");
    }
  }, []);
  

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!mobile) {
      tempErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      tempErrors.mobile = "Enter valid 10-digit mobile number";
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

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/loginAssociateChannel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, password }), // ✅ fixed here
        }
      );

      const data = await response.json();

      // if (response.ok && data.success == "1") {
      //   localStorage.setItem("isLoggedIn", "true");
      //   localStorage.setItem("token", data.token);

      //   // ✅ Save the name from response OR use mobile as fallback
      //   localStorage.setItem("username", data.data.username);
      //   const username = data.data.username;
      //   const sentenceCaseName =
      //     username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
      //   // localStorage.setItem("userType", data.data.user_type);

      //   Swal.fire({
      //     title: "Login Successful!",
      //     html: `Welcome : ${sentenceCaseName}`, // ✅ fixed here
      //     icon: "success",
      //     timer: 1500,
      //     showConfirmButton: false,
      //     timerProgressBar: true,
      //   }).then(() => {
      //     window.location.href = "/dashboard";
      //   });

      //   setError({});
      // } else {
      //   setError({ form: data.message || "Invalid mobile or password." });
      // }
      if (response.ok && data.success == "1") {
        // Login success
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.token);

        const username = data.data.username;
        const sentenceCaseName =
          username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

        Swal.fire({
          title: "Login Successful!",
          html: `Welcome : ${sentenceCaseName}`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          window.location.href = "/my-team";
          // /window.location.href = "/dashboard";
        });

        setError({});
      } else {
        // 👇 Error message logic here
        let errorMessage = "Invalid mobile or password.";

        // ✅ Check if message is exactly this
        if (data.message === "not exist or inactive") {
          errorMessage = "Your account is blocked. Please contact admin.";
        }

        setError({ form: errorMessage });
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError({ form: "Something went wrong. Try again later." });
    }

    localStorage.getItem("username");
    localStorage.getItem("token");
    localStorage.getItem("isLoggedIn");
  };

  return (
    <>
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
                  <label htmlFor="mobile">Mobile Number</label>
                  <input
                    type="text"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={` ${error.mobile ? "is-invalid" : ""}`}
                    placeholder="Enter your mobile number"
                  />
                  {error.mobile && (
                    <div className="text-danger small">{error.mobile}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={` ${error.password ? "is-invalid" : ""}`}
                      placeholder="Enter your password"
                      style={{ paddingRight: "40px" }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </div>
                  {error.password && (
                    <div className="text-danger small">{error.password}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Log In
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
      <div className="d-flex h-100">
        <div className="width_50 d-none d-lg-block bg-login">
          <div className="loginimage">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/loginbg.png`}
              alt="Login"
            />
          </div>
        </div>

        <div className="width_50 bg-white d-flex align-items-center justify-content-center">
          <div className="px-4" style={{ width: "100%", maxWidth: "420px" }}>
            <div className="text-center mb-4">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                alt="Logo"
                style={{ maxWidth: "150px" }}
              />
            </div>

            {error.form && (
              <div className="alert alert-danger">{error.form}</div>
            )}

            <form onSubmit={handleLogin} noValidate>
              <div className="form-group mb-3">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="text"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={`form-control ${error.mobile ? "is-invalid" : ""}`}
                  placeholder="Enter your mobile number"
                />
                {error.mobile && (
                  <div className="text-danger small">{error.mobile}</div>
                )}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-control ${
                      error.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your password"
                    style={{ paddingRight: "40px" }}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
                {error.password && (
                  <div className="text-danger small">{error.password}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div> */}
    </>
  );
};

export default Login;
