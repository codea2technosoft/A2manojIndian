import React, { useEffect, useState } from "react";
import axios from "axios";
import Setpin from "../../assets/img/mpin.gif";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Col, Row, Form, Input } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function Setmpin() {
  // const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [mpinValue, setMpinValue] = useState("");
  const [isValidMpin, setIsValidMpin] = useState(false);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("userid");
  const devid = localStorage.getItem("dev_id");

  const getprofile = async () => {
    const apiUrl = `${process.env.REACT_APP_API_URL_NODE}user-profile`;
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      device_id: devid,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setMpinValue(data.mpin);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getprofile();
  }, []);

  const handleSetMpin = async () => {
    const user_id = localStorage.getItem("userid");

    // if (mpin.length !== 5) {
    //   setErrorMessage("MPIN must be exactly 5 digits.");
    //   return;
    // }

    // if (mpin !== confirmMpin) {
    //   setErrorMessage("MPIN and Confirm MPIN do not match.");
    //   return;
    // }
    if (mpin == "A12345") {
      setErrorMessage("Please Enter Other Number");
      return;
    }

    const requestData = {
      user_id,
      mpin,
    };
    const config = {
      method: "POST",
      url: `${process.env.REACT_APP_API_URL_NODE}mpin-set`,
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    };

    try {
      const response = await axios(config);
      if (response.data.success == false) {
        Swal.fire({
          title: "Error!",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "Retry",
          confirmButtonColor: "#d33",
          backdrop: true,
        });
      } else {
        Swal.fire({
          title: "Success!",
          text: "MPIN set successfully!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
          backdrop: true,
        });
        navigate("/Home");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to set MPIN. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
        confirmButtonColor: "#d33",
        backdrop: true,
      });

      // Optionally, also update the error message state
      setErrorMessage("Failed to set MPIN. Please try again.");
    }
  };
  const handleChangeMpin = (e) => {
    const input = e.target.value;
    // Allow alphabets, special characters, and only number 6
    setmpin(input);
    setMessage(checkStrength(input));
  };
  const [mpin, setmpin] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("black");
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
    <div>
      <section id="Help">
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6 offset-md-3 col-12">
              <div className="w-50 mx-auto referfriend">
                <img src={Setpin} className="img-fluid" alt="Set MPIN" />
              </div>
              <div className="refer_whatsapp">
                <div className="">
                  <div
                    className="refercodedesign text-center border_custum"
                    role="alert"
                  >
                    Set MPIN
                  </div>
                  <div className="row refer_field d-flex justify-content-between align-items-center">
                    <div className="align-items-center col-12">
                      <div className="refercode_new">
                        <div className="refercode gap-2">
                          <div className="row">
                            <div className="col-md-12">
                              <p className="text-center">
                                आपका पिछला MPIN {mpinValue}
                              </p>
                              <div className="row align-items-center">
                                {/* <div className="col-12">
                                  <label
                                    htmlFor=""
                                    className="form-label text-dark"
                                  >
                                    Enter MPIN
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Enter MPIN"
                                    name="mpin"
                                    className="form-control bonusreportinput"
                                    value={mpin}
                                    onChange={(e) => {
                                      if (/^\d{0,5}$/.test(e.target.value)) {
                                        setMpin(e.target.value);
                                      }
                                    }}
                                    maxLength={5}
                                  />
                                </div>
                                <div className="col-12">
                                  <label
                                    htmlFor=""
                                    className="form-label text-dark"
                                  >
                                    Confirm MPIN
                                  </label>
                                  <input
                                    type="number"
                                    required
                                    placeholder="Confirm MPIN"
                                    name="confirmMpin"
                                    className="form-control bonusreportinput"
                                    value={confirmMpin}
                                    onChange={(e) => {
                                      if (/^\d{0,5}$/.test(e.target.value)) {
                                        setConfirmMpin(e.target.value);
                                      }
                                    }}
                                    minLength={5}
                                    maxLength={5}
                                  />
                                </div> */}
                                <div>
                                  <small>
                                    <span
                                      style={{
                                        color: "black",
                                        fontWeight: "600",
                                      }}
                                    >
                                      UPDATE MPIN
                                    </span>{" "}
                                    <span style={{ color: "red" }}>
                                      (ex.A12345)
                                    </span>
                                  </small>
                                  <Input
                                    className="MPIN"
                                    name="mobileNum"
                                    maxLength={10}
                                    placeholder="MPIN"
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
                                </div>
                                {errorMessage && (
                                  <div className="col-12 mt-2 text-danger">
                                    {errorMessage}
                                  </div>
                                )}
                                <div className="col-12 mt-4">
                                  <button
                                    type="button"
                                    className="playgames bonsureport w-100"
                                    onClick={handleSetMpin}
                                    disabled={!isValidMpin}
                                  >
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
