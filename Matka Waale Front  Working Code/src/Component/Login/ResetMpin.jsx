import React, { useState, useEffect } from "react";
import "./Login.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useNavigate } from "react-router-dom";
import { Outlet, Link, Await } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Container from "react-bootstrap/Container";
import Logoimg from "../../assets/img/logo.png";
import safe from "../../assets/img/safe.png";
import { UserOutlined } from "@ant-design/icons";
// import { Link } from "react-router-dom";
import { Col, Row, Form, Input } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPWAInstallProvider, { useReactPWAInstall } from "react-pwa-install";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import loading1 from "../../assets/img/loading-gif.gif";
import { Spinner } from "react-bootstrap";
import { ArrowRight, EyeSlash, EyeFill } from "react-bootstrap-icons";

function ResetMpin() {
  const mobile1 = window.innerWidth <= 768 ? true : false;
  const [loadingsplash, setloadingsplash] = useState(true);
  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setloadingsplash(false);
    }, 4000);

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
          console.log("User accepted the A2HS prompt");
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

  const [isShown, setIsShown] = useState(false);
  const [otpnumbers, otpnumber] = useState();
  const [mpinnumbers, SetMpinnumber] = useState();
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading1] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [browserId, setBrowserId] = useState("");
  const [isValidMobile, setIsValidMobile] = useState(false);
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

  function onInputChangeMPIN(e) {
    const numericValue1 = e.target.value.replace(/\D/g, "");
    e.target.value = numericValue1;
    SetMpinnumber(numericValue1);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let url = `${process.env.REACT_APP_API_URL_NODE}send-otp-Resetpin`;
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
          const res = JSON.stringify(response.data);
          const objectRes = JSON.parse(res);

          if (response.data.success == 1) {
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


  const loginChk = async (e) => {
      setLoading1(true);
    if (!otpnumbers) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "Please Enter Valid Value",
        icon: "error",
        timer: 2000,
      });
      setLoading1(false);
      return;
    }

    if (!mpinnumbers || !/^\d{5}$/.test(mpinnumbers)) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: "Please Enter a Valid MPIN (5 digits)",
        icon: "error",
        timer: 2000,
      });
      setLoading1(false);
      return;
    }

    let url = `${process.env.REACT_APP_API_URL_NODE}check-otp-resetPin`;
    const requestData = {
      mob: mobile,
      otp: otpnumbers,
      mpin: mpinnumbers,
    };

    const config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    };

    axios(config).then(function (response) {
      if (response.data.success == 1) {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "MPIN Reset Successfully",
          icon: "success",
          timer: 2000,
        }).then((result) => {
          navigate("/Login");

        });
      }
      else {
        setLoading1(false);
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "Invalid OTP",
          icon: "error",
          timer: 2000,
        });
      }

    });

  };

  const navigate = useNavigate();
  const loginverfiy = async (e) => { };
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
        <button
          variant="primary"
          onClick={handleShow}
          className="btn btn-ronded text-light pwabtn iosbtn"
        >
          {name}
        </button>
      </>
    );
  }

  return (
    <>
      <div className={`splash-screen ${loadingsplash ? "visible" : "hidden"}`}>
        <div class="logonew">
          <img src={Logoimg} className="img-fluid" />
        </div>
        <div class="safe">
          <img src={safe} className="img-fluid" />
        </div>
      </div>
      <div className="Loginpage">
        <div className="loginform position-relative">
          <div className="bg-white login-form">
            <h3 className="mb-0 fw-bold text-center">Welcome Back</h3>
            <div className="form-login-design">
              <Form
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                style={{
                  maxWidth: 600,
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
                            className="username mobilenumberinput"
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
                          {/* {isValidMobile ? <p>Valid mobile number!</p> : <p>Invalid mobile number</p>} */}
                        </div>
                      </Form.Item>
                    </Col>
                  ) : null}
                  {/* {otp && ( */}

                  {isShown ? (
                    <>
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
                        <small>Enter OTP</small>
                        <Input
                          style={{ padding: "9px" }}
                          type="Number"
                          onChange={onInputChangePassword}
                          placeholder="Enter OTP"
                        />
                      </Form.Item>
                    </Col>

                  <Col span={24} xl={24} md={24}>
                  <Form.Item
                    name="mpin"
                    rules={[
                      {
                        required: true,
                        message: "Please input your MPIN!",
                      },
                      {
                        len: 5,
                        message: "MPIN must be 5 digits",
                      },
                    ]}
                  >
                    <small>Enter MPIN</small>
                    <Input
                      style={{ padding: "9px" }}
                      type="number"
                      onChange={onInputChangeMPIN}
                      placeholder="Enter MPIN"
                      maxLength={5}
                    />
                  </Form.Item>
                  </Col>

                  </>

                  ) : null}

                  <Col span={24} xl={24} md={24}>
                    <Form.Item
                      wrapperCol={{
                        span: 16,
                      }}
                    >
                      {loading ? (
                        <div className="d-flex position-relative loginloader">
                          <img
                            src={loading1}
                            className="px-2 loaderfile"
                            style={{ width: "50px" }}
                            alt="Loading..."
                          />
                        </div>
                      ) : isShown ? (
                        <>
                          {(
                            <>
                              <button
                                type="button"
                                disabled={loading2}
                                className="btn_custum bg-green refer-button w-100 text-white send-otp btn sendotp cxy btn otp_login submit_data"
                                onClick={loginChk}
                                id="submit_data"
                                name="submit_data"
                              >
                                Login
                                {loading2 && <Spinner animation="border" />}
                              </button>
                            </>

                          )}
                        </>
                      ) : (

                        <>
                          <button
                            onClick={onSubmit}
                            type="submit"
                            className={`w-100 refer-button cxy send-otp btn sendotp text-white ${isValidMobile ? "valid-button" : ""
                              }`}
                            id="send_ottp"
                            disabled={!isValidMobile}
                          >
                            SEND OTP
                          </button>
                        </>
                      )}
                    </Form.Item>

                    {/* Modal */}
                    <div
                      className="modal fade"
                      id="exampleModal"
                      tabIndex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                              Modal title
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <p>
                              To add this app to your home screen, tap the share icon below and
                              select "Add to Home Screen."
                            </p>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button type="button" className="btn btn-primary">
                              Save changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* <Link to="/">Forget Password</Link> */}
              </Form>
              {isIOS && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResetMpin;
