import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
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

  const navigate = useNavigate();

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
  const { search } = useLocation();
  const params = new URLSearchParams(search);
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
  const apiCalled = useRef(false);

  useEffect(() => {
    if (apiCalled.current) return; // pehle hi call ho chuka
    apiCalled.current = true;

    const mobilenew = params.get("mobile");
    const amount = params.get("amount");

    let url = `${process.env.REACT_APP_API_URL_NODE}login-chkotp-new-dirct`;
    const requestData = { mob: mobilenew };
    const encryptedText = encryptData(requestData);
    const datasend = { datareq: encryptedText };

    axios
      .post(url, datasend, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data.success == 1) {
          const MySwal = withReactContent(Swal);
          MySwal.fire({
            title: "Login Successfully",
            icon: "success",
            timer: 2000,
          }).then(() => {
            setOtpsend(response.data.otp);
            setuser_id(response.data.user_id);
            settoken(response.data.token);
            settokenone(response.data.tokenl);
            setdev_id(response.data.device_id);

            localStorage.setItem("userid", response.data.user_id);
            localStorage.setItem("dev_id", response.data.device_id);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("tokenl", response.data.tokenl);

            // navigate("/Home");
            window.location.href = `https://matkawaale.com/api/deposit.php?name=${response.data.name}&userid=${response.data.user_id}&amount=${amount}&contact=${mobilenew}&getaway=razorpay&type=web`;
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
  }, []);

  return (
    <></>
    // <>
    //   <div className={`splash-screen ${loadingsplash ? "visible" : "hidden"}`}>
    //     <div class="logonew">
    //       <img src={Logoimg} className="img-fluid" />
    //     </div>
    //     <div class="safe">
    //       <img src={safe} className="img-fluid" />
    //     </div>
    //     <p className="trust">
    //       Trust And Seal rpk90 Club 100% Safe And Secure
    //     </p>
    //   </div>
    //   {/* screen end */}
    //   <div className="Loginpage">
    //     <div className="overlaybgcolor"></div>
    //     <div className="loginform position-relative">
    //       <div className="width_77">
    //         <h2>
    //           {/* गली दिसावर सट्टा खेलने वाले एप्लीकेशन डाउनलोड करे! रेट 10 के 950 */}
    //           {loginTitle}
    //         </h2>
    //       </div>

    //       <div className="d-flex justify-content-center width_90">
    //         {" "}
    //         <button
    //           className="btn btn-ronded bg-white pwabtn mx-1"
    //           onClick={() => {
    //             window.location.href =
    //               "https://matkawaale.com/web_video/iphone.mp4";
    //           }}
    //         >
    //           <span className="text-danger ">
    //             iPhone मैं डाउनलोड करने के लिए वीडियो देखें
    //           </span>
    //           <br />
    //           <span className="text-danger playbtn_custum rounded-circle bg-warning p-2">
    //             <i className="bi bi-play-fill"></i>
    //           </span>
    //         </button>
    //         <button
    //           className="btn btn-ronded bg-white pwabtn  justify-content-end"
    //           style={{ marginRight: "7px" }}
    //           onClick={() => {
    //             window.location.href =
    //               "https://matkawaale.com/web_video/android.mp4";
    //           }}
    //         >
    //           <span className="text-danger">
    //             ANDROID मैं डाउनलोड करने के लिए वीडियो देखें
    //           </span>
    //           <br />
    //           <span className="text-danger playbtn_custum rounded-circle bg-warning p-2">
    //             <i className="bi bi-play-fill"></i>
    //           </span>
    //         </button>
    //       </div>

    //       <div className="logobgshape d-flex justify-content-center align-items-center ">
    //         <div className="logo ">
    //           <img src={Logoimg} width="150" />
    //         </div>
    //       </div>
    //       <div className="bg-white login-form">
    //         <h3 className="mb-0 fw-bold text-center">Welcome Back</h3>
    //         <div className="form-login-design">
    //           {/* {deviceId1}
    //         {appId1} */}
    //           <Form
    //             name="basic"
    //             labelCol={{
    //               span: 8,
    //             }}
    //             wrapperCol={{
    //               span: 16,
    //             }}
    //             style={{
    //               maxWidth: 600,
    //             }}
    //             initialValues={{
    //               remember: true,
    //             }}
    //             onFinish={onFinish}
    //             onFinishFailed={onFinishFailed}
    //             autoComplete="off"
    //           >
    //             <Row>
    //               {!isShown ? (
    //                 <Col span={24} xl={24} md={24}>
    //                   <Form.Item
    //                     name="username"
    //                     prefix={
    //                       <UserOutlined className="site-form-item-icon" />
    //                     }
    //                     rules={[
    //                       {
    //                         required: true,
    //                         message: "Please input your Number!",
    //                       },
    //                     ]}
    //                   >
    //                     <div>
    //                       <small>Moblie Number</small>
    //                       <Input
    //                         className="username"
    //                         name="mobileNum"
    //                         maxLength={10}
    //                         placeholder="Mobile Number"
    //                         value={mobile}
    //                         onChange={onInputChange}
    //                         prefix={
    //                           <UserOutlined
    //                             className="site-form-item-icon"
    //                             style={{ padding: "9px" }}
    //                           />
    //                         }
    //                       />
    //                     </div>
    //                   </Form.Item>
    //                 </Col>
    //               ) : null}

    //               {isShown ? (
    //                 <Col span={24} xl={24} md={24}>
    //                   <Form.Item
    //                     name="number"
    //                     rules={[
    //                       {
    //                         required: true,
    //                         message: "Please input your Otp!",
    //                       },
    //                     ]}
    //                   >
    //                     <Input
    //                       style={{ padding: "9px" }}
    //                       type="Number"
    //                       onChange={onInputChangePassword}
    //                       placeholder="Enter OTP"
    //                     />
    //                   </Form.Item>
    //                 </Col>
    //               ) : null}

    //               <Col span={24} xl={24} md={24}>
    //                 <Form.Item
    //                   wrapperCol={{
    //                     span: 16,
    //                   }}
    //                 >
    //                   {loading ? (
    //                     <div className="d-flex  position-relative loginloader">
    //                       <img
    //                         src={loading1}
    //                         className="px-2 loaderfile"
    //                         style={{ width: "50px" }}
    //                         alt="Loading..."
    //                       />
    //                     </div>
    //                   ) : isShown ? (
    //                     <>
    //                       <div className="d-flex align-items-center gap-2">
    //                         <button
    //                           type="button"
    //                           disabled={loading2}
    //                           className="btn_custum bg-green refer-button w-100 text-white btn-primary cxy btn otp_login submit_data"
    //                           onClick={loginChk}
    //                           id="submit_data"
    //                           name="submit_data"
    //                         >
    //                           Login
    //                           {loading2 && <Spinner animation="border" />}
    //                         </button>

    //                         <button
    //                           type="button"
    //                           disabled={loading || timer > 0}
    //                           className="btn_color_all text-white color-cls"
    //                           onClick={reSendotp}
    //                           id="submit_data"
    //                           name="submit_data"
    //                         >
    //                           {timer > 0
    //                             ? `Resend OTP in ${timer}s`
    //                             : "Resend OTP"}
    //                           {loading && <Spinner animation="border" />}
    //                         </button>
    //                       </div>
    //                     </>
    //                   ) : (
    //                     <>
    //                       <button
    //                         onClick={onSubmit}
    //                         type="submit"
    //                         className={`w-100  refer-button cxy send-otp btn sendotp text-white ${
    //                           isValidMobile ? "valid-button" : ""
    //                         }`}
    //                         id="send_ottp"
    //                         disabled={!isValidMobile}
    //                       >
    //                         SEND OTP
    //                       </button>
    //                       {/* <div className="d-flex justify-content-center">
    //                         <Link
    //                           to="/create-account"
    //                           className="mt-4 bg-green w-200"
    //                           id="submit_data"
    //                           name="submit_data"
    //                         >
    //                           Create An Account
    //                         </Link>
    //                       </div> */}
    //                     </>
    //                   )}
    //                 </Form.Item>

    //                 <div
    //                   class="modal fade"
    //                   id="exampleModal"
    //                   tabindex="-1"
    //                   aria-labelledby="exampleModalLabel"
    //                   aria-hidden="true"
    //                 >
    //                   <div class="modal-dialog">
    //                     <div class="modal-content">
    //                       <div class="modal-header">
    //                         <h5 class="modal-title" id="exampleModalLabel">
    //                           Modal title
    //                         </h5>
    //                         <button
    //                           type="button"
    //                           class="btn-close"
    //                           data-bs-dismiss="modal"
    //                           aria-label="Close"
    //                         ></button>
    //                       </div>
    //                       <div class="modal-body">
    //                         <p>
    //                           {" "}
    //                           To add this app to your home screen, tap the share
    //                           icon below and select "Add to Home Screen."
    //                         </p>
    //                       </div>
    //                       <div class="modal-footer">
    //                         <button
    //                           type="button"
    //                           class="btn btn-secondary"
    //                           data-bs-dismiss="modal"
    //                         >
    //                           Close
    //                         </button>
    //                         <button type="button" class="btn btn-primary">
    //                           Save changes
    //                         </button>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </Col>
    //             </Row>
    //           </Form>
    //           {isIOS && (
    //             <>
    //               <div className="d-flex jusitfy-content-center">
    //                 {["Install Web Application IOS"].map((placement, idx) => (
    //                   <OffCanvasExample
    //                     key={idx}
    //                     placement={placement}
    //                     name={placement}
    //                   />
    //                 ))}
    //               </div>
    //             </>
    //           )}
    //           {!isIOS && showInstallButton && (
    //             <div className="">
    //               <button
    //                 className="btn btn-ronded text-light pwabtn pwa_bbtn_color w-100 mb-2"
    //                 onClick={handleInstallClick}
    //               >
    //                 Install Application 1
    //               </button>
    //               <a
    //                 className="btn btn-ronded text-light pwabtn pwa_bbtn_color w-100"
    //                 target="_blank"
    //                 href="https://payment.matkawaale.com/matkawaale.apk"
    //                 download
    //               >
    //                 Install Application 2
    //               </a>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>
  );
}

export default Login;
