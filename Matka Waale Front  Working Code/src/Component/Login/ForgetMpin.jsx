import React, { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useNavigate } from "react-router-dom";
import { Outlet, Link, Await } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Logoimg from "../../assets/img/logo.png";
import safe from "../../assets/img/safe.png";
import { UserOutlined } from "@ant-design/icons";
import { Col, Row, Form, Input } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import loading1 from "../../assets/img/loading-gif.gif";
import { Spinner } from "react-bootstrap";
import generateHMAC from "../../generateHMAC.jsx";
import CryptoJS from "crypto-js";

function Login() {
  const mobile1 = window.innerWidth <= 768 ? true : false;
  const [loadingsplash, setloadingsplash] = useState(true);
  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setloadingsplash(false);
    }, 10);
    return () => clearTimeout(splashTimeout);
  }, [mobile1]);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(true);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    const beforeInstallPromptHandler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };
    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler
      );
    };
  }, []);

  useEffect(() => {
    const userid = localStorage.getItem("userid");
    if (userid) {
      navigate("/Home");
    }
    const isAppInstalled = localStorage.getItem("isAppInstalled");
    if (isAppInstalled) {
      setShowInstallButton(false);
    }
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          localStorage.setItem("isAppInstalled", "true");
          setShowInstallButton(false);
        } else {
          console.log("User dismissed the A2HS prompt");
        }

        setDeferredPrompt(null);
      });
    }
  };

  useEffect(() => {
    let browserIdd = Cookies.get("browserId");

    if (!browserIdd) {
      browserIdd = uuidv4();
      Cookies.set("browserId", browserIdd, { expires: 7 });
    }
    setBrowserId(browserIdd);
  }, []);

  const [otp, setOtp] = useState(false);
  const onFinish = (values) => {
    // console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const otpboxshow = () => {
    setOtp(true);
  };

  sessionStorage.setItem("token", "");
  const [user, setUserts] = useState({
    mobile: "",
  });

  const [motp, setMotp] = useState({
    mobile: "9782140792",
    otp: "123456",
  });

  const [otpsand, setOtpsend] = useState(null);
  const [useridd, setuser_id] = useState(null);
  const [usertoken, settoken] = useState(null);
  const [tokenone, settokenone] = useState(null);
  const [devid, setdev_id] = useState(null);
  const [isShown, setIsShown] = useState(false);
  const [otpnumbers, otpnumber] = useState();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading1] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [browserId, setBrowserId] = useState("");
  const [loginTitle, setloginTitle] = useState("");
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(false);
  const [timer, setTimer] = useState(0);
  // const [isValidMobile, setIsValidMobile] = useState(false);

  const [isValidMobile, setIsValidMobile] = useState(false);
  const [isValidMpin, setIsValidMpin] = useState(false);
  const [mobile, mobilenumber] = useState("");

  function onInputChange(e) {
    const mobileNumber = e.target.value.replace(/\D/g, "");
    mobilenumber(mobileNumber);
    const isValid = /^[0-9]{10}$/.test(mobileNumber);
    setIsValidMobile(isValid);
  }
  function onInputChangePassword(e) {
    const numericValue = e.target.value.replace(/\D/g, "");
    e.target.value = numericValue;
    otpnumber(numericValue);
  }
  const [RefCode, setRefCode] = useState();
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("reffercode");
    if (code) {
      setRefCode(code);
    } else {
      setRefCode("withoutrefcode");
    }
  }, []);
  const key = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECUREKEYAPI);
  const iv = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECUREKEYAPIIV);
  const encryptData = (data) => {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString(); // This automatically returns a Base64 encoded string
  };
  const onSubmit = async (e) => {
    if (mpin == "A12345") {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "Wrong MPIN",
        icon: "error",
        timer: 2000,
      });
      return;
    }
    if (timer > 0) return;
    setTimer(60);
    e.preventDefault();
    try {
      setLoading(true);
      let url = `${process.env.REACT_APP_API_URL_NODE}login-new-enc-nnew-potal-mpin-update`;
      const requestData = {
        mob: mobile,
        mpin: mpin,
        dev_id: browserId,
        app_id: process.env.REACT_APP_API_ID,
        RefCode: RefCode,
      };

      const encryptedText = encryptData(requestData);
      const datasend = { datareq: encryptedText };

      const config = {
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        data: datasend,
      };

      axios(config)
        .then(function (response) {
          const res = JSON.stringify(response.data);
          const objectRes = JSON.parse(res);
          if (response.data.success == 1) {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
              title: "Login Successfully",
              icon: "success",
              timer: 2000,
            }).then((result) => {
              setOtpsend(response.data.otp);
              setuser_id(response.data.user_id);
              settoken(response.data.token);
              settokenone(response.data.tokenl);
              setdev_id(response.data.device_id);

              localStorage.setItem("userid", response.data.user_id);
              localStorage.setItem("dev_id", response.data.device_id);
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("tokenl", response.data.tokenl);

              navigate("/Home");
            });
          } else if (response.data.success == 2) {
            setIsShown(true);
          } else if (response.data.success == 3) {
            setIsShown(false);
            const MySwal = withReactContent(Swal);
            MySwal.fire({
              title: response.data.message,
              icon: "error",
              timer: 2000,
            });
          } else {
            setIsShown(false);
          }
        })
        .catch(function (error) {
          console.error("There was a problem with the fetch operation:", error);
          setIsShown(false);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setIsShown(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const reSendotp = async (e) => {
    if (timer > 0) return;
    setTimer(60);
    try {
      let url = `${process.env.REACT_APP_API_URL_NODE}login-new`;
      const requestData = {
        mob: mobile,
        dev_id: browserId,
        app_id: process.env.REACT_APP_API_ID,
      };

      const config = {
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      };

      axios(config)
        .then(function (response) {
          if (response.data.success === "1") {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
              title: "Otp Send",
              icon: "success",
              timer: 2000,
            });
          } else {
            const MySwal = withReactContent(Swal);
            MySwal.fire({
              title: response.data.message,
              icon: "error",
              timer: 2000,
            });
          }
        })
        .catch(function (error) {
          console.error("There was a problem with the fetch operation:", error);
          setIsShown(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setIsShown(false);
      setLoading(false);
    }
  };

  const loginChk = async (e) => {
    setLoading1(true);

    let url = `${process.env.REACT_APP_API_URL_NODE}login-chkotp-new-enc`;
    const requestData = {
      mob: mobile,
      otp: otpnumbers,
      mpin: mpin,
    };
    const encryptedText = encryptData(requestData);
    const datasend = { datareq: encryptedText };
    const config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: datasend,
    };

    axios(config).then(function (response) {
      if (response.data.success == 1) {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "Login Successfully",
          icon: "success",
          timer: 2000,
        }).then((result) => {
          setOtpsend(response.data.otp);
          setuser_id(response.data.user_id);
          settoken(response.data.token);
          settokenone(response.data.tokenl);
          setdev_id(response.data.device_id);

          localStorage.setItem("userid", response.data.user_id);
          localStorage.setItem("dev_id", response.data.device_id);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("tokenl", response.data.tokenl);

          navigate("/Home");
        });
      } else {
        setLoading1(false);
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "Invalid Otp",
          icon: "error",
          timer: 2000,
        });
      }
    });
  };
  useEffect(() => {
    loaduser1();
  }, []);
  const loaduser1 = async () => {
    let url = `${process.env.REACT_APP_API_URL_NODE}basic-details`;

    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
    };

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      // console.log(data);

      const basicdet = data.data.login_page_title || "";
      // console.warn("oppppp", basicdet);
      localStorage.setItem("ref_status", data.data.ref_status);
      setloginTitle(data.data.login_page_title || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const navigate = useNavigate();
  const loginverfiy = async (e) => {};
  function OffCanvasExample({ name, ...props }) {
    const [show, setShow] = useState(false);
    const [fullscreen, setFullscreen] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    function handleShownew(breakpoint) {
      setShow(breakpoint);

      setFullscreen(true);
    }
    return (
      <>
        <Offcanvas show={show} onHide={handleClose} {...props}>
          <Offcanvas.Header>
            <Offcanvas.Title className="text-white border-bottom-custum">
              {" "}
              Add To Home Screen
            </Offcanvas.Title>
            <div
              className="col-md-2 cancelbtn"
              onClick={() => handleShownew(false)}
            >
              {" "}
              Cancel{" "}
            </div>
          </Offcanvas.Header>
          <Offcanvas.Body className="text-white">
            <p className="text-center text-white content-pwa">
              This website has app functionality. Add it to your home screen to
              use it in fullscreen and while offline.
            </p>
            <div>
              <ul className="list-style-none">
                <li className="d-flex ">
                  <i class="bi bi-box-arrow-up arrowcolor"></i>
                  <span>1 Press the 'Share' button</span>
                </li>
                <li>
                  <i class="bi bi-plus-square"></i>
                  <span>2 Press 'Add to Home Screen'</span>
                </li>
              </ul>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
        <Button
          variant="primary"
          onClick={handleShow}
          className="btn btn-ronded text-light pwabtn"
        >
          {name}
        </Button>
      </>
    );
  }

  const [mpin, setmpin] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("black");

  const handleChangeMpin = (e) => {
    const input = e.target.value;
    // Allow alphabets, special characters, and only number 6
    setmpin(input);
    setMessage(checkStrength(input));
  };
  // const checkStrength = (pwd) => {
  //   // Regex checks
  //   const hasLetter = /[a-zA-Z]/.test(pwd);
  //   const hasNumber = /[0-9]/.test(pwd);
  //   const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);

  //   // if (pwd.length < 6) {
  //   //   return "Too short (min 6 chars)";
  //   // } else
  //   if (hasLetter && hasNumber && hasSpecial && pwd.length >= 6) {
  //     setColor("green");
  //     setIsValidMpin(true);
  //     return "Very Strong";
  //   } else if (
  //     (hasLetter && hasNumber) ||
  //     (hasLetter && hasSpecial) ||
  //     (hasNumber && hasSpecial)
  //   ) {
  //     setColor("orange");
  //     setIsValidMpin(false);
  //     return "Strong";
  //   } else {
  //     setColor("red");
  //     setIsValidMpin(false);
  //     return "Weak";
  //   }
  // };
  // const checkStrength = (pwd) => {
  //   // Regex checks (only alphabets and numbers allowed)
  //   const hasLetter = /[a-zA-Z]/.test(pwd);
  //   const hasNumber = /[0-9]/.test(pwd);
  //   const hasSpecial = /[^a-zA-Z0-9]/.test(pwd); // will detect invalid chars

  //   // ❌ if contains special chars → invalid
  //   if (hasSpecial) {
  //     setColor("red");
  //     setIsValidMpin(false);
  //     return "Only alphabets and numbers allowed";
  //   }

  //   // ✅ password rules
  //   if (hasLetter && hasNumber && pwd.length >= 6) {
  //     setColor("green");
  //     setIsValidMpin(true);
  //     return "Very Strong";
  //   } else if (hasLetter || hasNumber) {
  //     setColor("orange");
  //     setIsValidMpin(false);
  //     return "Weak";
  //   } else {
  //     setColor("red");
  //     setIsValidMpin(false);
  //     return "Invalid";
  //   }
  // };
  const checkStrength = (pwd) => {
    // Regex checks (only alphabets and numbers allowed)
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd); // detect invalid chars
    const hasRepeat = /(.)\1/.test(pwd); // detect repeated consecutive chars

    // ❌ if contains special chars → invalid
    if (hasSpecial) {
      setColor("red");
      setIsValidMpin(false);
      return "Only AlphaNumberic Allowed";
    }

    // ❌ if repeated chars → invalid
    if (hasRepeat) {
      setColor("red");
      setIsValidMpin(false);
      return "Repeated Not Allowed";
    }

    // ✅ password rules
    if (hasLetter && hasNumber && pwd.length >= 6) {
      setColor("green");
      setIsValidMpin(true);
      return "Perfect 👍";
    } else if (hasLetter || hasNumber) {
      setColor("orange");
      setIsValidMpin(false);
      return "Weak";
    } else {
      setColor("red");
      setIsValidMpin(false);
      return "Invalid";
    }
  };

  return (
    <>
      <div className={`splash-screen ${loadingsplash ? "visible" : "hidden"}`}>
        <div class="logonew">
          <img src={Logoimg} className="img-fluid" />
        </div>
        <div class="safe">
          <img src={safe} className="img-fluid" />
        </div>
        <p className="trust">Trust And Seal matkawaale Club 100% Safe And Secure</p>
      </div>
      {/* screen end */}
      <div className="Loginpage">
        <div className="overlaybgcolor"></div>
        <div className="loginform position-relative">
          {/* <div className="width_77">
            <h2>
             
              {loginTitle}
            </h2>
          </div> */}

          {/* <div className="d-flex justify-content-center width_90">
            {" "}
            <button
              className="btn btn-ronded bg-white pwabtn mx-1"
              onClick={() => {
                window.location.href =
                  "https://matkawaale.com/web_video/iphone.mp4";
              }}
            >
              <span className="text-danger ">
                iPhone मैं डाउनलोड करने के लिए वीडियो देखें
              </span>
              <br />
              <span className="text-danger playbtn_custum rounded-circle bg-warning p-2">
                <i className="bi bi-play-fill"></i>
              </span>
            </button>
            <button
              className="btn btn-ronded bg-white pwabtn  justify-content-end"
              style={{ marginRight: "7px" }}
              onClick={() => {
                window.location.href =
                  "https://matkawaale.com/web_video/android.mp4";
              }}
            >
              <span className="text-danger">
                ANDROID मैं डाउनलोड करने के लिए वीडियो देखें
              </span>
              <br />
              <span className="text-danger playbtn_custum rounded-circle bg-warning p-2">
                <i className="bi bi-play-fill"></i>
              </span>
            </button>
          </div> */}

          <div className="logobgshape d-flex justify-content-center align-items-center ">
            <div className="logo ">
              <img src={Logoimg} width="150" />
            </div>
          </div>
          <div className="bg-white login-form">
            <h3 className="mb-0 fw-bold text-center">Welcome Back</h3>
            <div className="form-login-design">
              {/* {deviceId1}
            {appId1} */}
              <Form
                name="basic"
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Row>
                  {!isShown ? (
                    <Col span={24} xl={24} md={24}>
                      <Form.Item
                        name="username"
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input your Number!",
                          },
                        ]}
                      >
                        <div>
                          <small>Moblie Number</small>
                          <Input
                            className="username"
                            name="mobileNum"
                            maxLength={10}
                            placeholder="Mobile Number"
                            value={mobile}
                            onChange={onInputChange}
                            prefix={
                              <UserOutlined
                                className="site-form-item-icon"
                                style={{ padding: "9px" }}
                              />
                            }
                          />
                        </div>
                      </Form.Item>
                    </Col>
                  ) : null}
                  {!isShown ? (
                    <Col span={24} xl={24} md={24}>
                      <Form.Item
                        name="mpin"
                        prefix={
                          <UserOutlined className="site-form-item-icon" />
                        }
                        rules={[
                          {
                            required: true,
                            message: "Please input your Mpin!",
                          },
                        ]}
                      >
                        <div>
                          {/* <small>New MPIN</small> */}
                          <small>
                            New MPIN{" "}
                            <span style={{ color: "red" }}>(ex.A12345)</span>
                          </small>
                          <Input
                            className="mpin"
                            name="mobileNum"
                            maxLength={10}
                            placeholder="New MPIN"
                            value={mpin}
                            onChange={handleChangeMpin}
                            prefix={
                              <UserOutlined
                                className="site-form-item-icon"
                                style={{ padding: "9px" }}
                              />
                            }
                          />
                          <p style={{ color: color }}>
                            <b>{message}</b>
                          </p>
                          {/* <Input
                            className="mpin"
                            name="mobileNum"
                            maxLength={10}
                            placeholder="Mpin"
                            value={mpin}
                            onChange={handleChangeMpin}
                            prefix={
                              <UserOutlined
                                className="site-form-item-icon"
                                style={{ padding: "9px" }}
                              />
                            }
                            addonAfter={<p style={{ color }}>{message}</p>} // 👈 message inside input border
                          /> */}
                        </div>
                      </Form.Item>
                    </Col>
                  ) : null}

                  {isShown ? (
                    <Col span={24} xl={24} md={24}>
                      <Form.Item
                        name="number"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Otp!",
                          },
                        ]}
                      >
                        <Input
                          style={{ padding: "9px" }}
                          type="Number"
                          onChange={onInputChangePassword}
                          placeholder="Enter OTP"
                        />
                      </Form.Item>
                    </Col>
                  ) : null}

                  <Col span={24} xl={24} md={24}>
                    <Form.Item
                      wrapperCol={{
                        span: 24,
                      }}
                    >
                      {loading ? (
                        <div className="d-flex  position-relative loginloader">
                          <img
                            src={loading1}
                            className="px-2 loaderfile"
                            style={{ width: "50px" }}
                            alt="Loading..."
                          />
                        </div>
                      ) : isShown ? (
                        <>
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              disabled={loading2}
                              className="btn_custum bg-green refer-button w-100 text-white btn-primary cxy btn otp_login submit_data"
                              onClick={loginChk}
                              id="submit_data"
                              name="submit_data"
                            >
                              Login
                              {loading2 && <Spinner animation="border" />}
                            </button>
                          </div>
                          <div
                            type="button"
                            disabled={loading || timer > 0}
                            className="btn_color_all color-cls"
                            onClick={reSendotp}
                            id="submit_data"
                            name="submit_data"
                            style={{
                              width: "122px",
                              marginTop: "10px",
                            }}
                          >
                            {timer > 0
                              ? `Resend OTP in ${timer}s`
                              : "Resend OTP"}
                            {loading && <Spinner animation="border" />}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* <button
                            onClick={onSubmit}
                            type="submit"
                            className={`w-100  refer-button cxy send-otp btn sendotp text-white ${
                              isValidMobile ? "valid-button" : ""
                            }`}
                            id="send_ottp"
                            disabled={!isValidMobile}
                          >
                            Login
                          </button> */}
                          <button
                            onClick={onSubmit}
                            type="submit"
                            className={`w-100 refer-button cxy send-otp btn sendotp text-white ${
                              isValidMobile && isValidMpin ? "valid-button" : ""
                            }`}
                            id="send_ottp"
                            disabled={!isValidMobile || !isValidMpin} // ✅ both conditions checked
                          >
                            Login
                          </button>
                          {/* <div className="d-flex justify-content-center">
                            <Link
                              to="/create-account"
                              className="mt-4 bg-green w-200"
                              id="submit_data"
                              name="submit_data"
                            >
                              Create An Account
                            </Link>
                          </div> */}
                        </>
                      )}
                    </Form.Item>

                    <div
                      class="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                              Modal title
                            </h5>
                            <button
                              type="button"
                              class="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="modal-body">
                            <p>
                              {" "}
                              To add this app to your home screen, tap the share
                              icon below and select "Add to Home Screen."
                            </p>
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              class="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button type="button" class="btn btn-primary">
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Form>
              {/* {isIOS && (
                <>
                  <div className="d-flex jusitfy-content-center">
                    {["Install Web Application IOS"].map((placement, idx) => (
                      <OffCanvasExample
                        key={idx}
                        placement={placement}
                        name={placement}
                      />
                    ))}
                  </div>
                </>
              )} */}
              {/* {!isIOS && showInstallButton && (
                <div className="">
                  <button
                    className="btn btn-ronded text-light pwabtn pwa_bbtn_color w-100 mb-2"
                    onClick={handleInstallClick}
                  >
                    Install Application 1
                  </button>
                  <a
                    className="btn btn-ronded text-light pwabtn pwa_bbtn_color w-100"
                    target="_blank"
                    href="https://matkawaale.com//apk/khelomatka.apk"
                    download
                  >
                    Install Application 2
                  </a>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
