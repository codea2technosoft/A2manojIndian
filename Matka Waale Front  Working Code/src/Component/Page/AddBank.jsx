import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import loadingwithdraww from "../../assets/img/loading-gif.gif";
import Swal from "sweetalert2";
import $ from "jquery";
import { fetchwalletamount } from "../../common.js";
import { Spinner } from "react-bootstrap";
import { Container } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { Button, Form, Input, message, Row, Col, Spin } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddBank() {
  const navigate = useNavigate();
  const [walletAmount, setWalletAmount] = useState(null);
  const [users, setUsers] = useState([]);
  const [WithdrawOtp, setWithdrawOtp] = useState([]);
  const [user, setUsers1] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [winamount, setwinamount] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loadingwithdraw, setLoadingwithdraw] = useState(false);
  const [loadingwallet, setLoadingwallet] = useState(false);
  const [msgwallet, setmsgwallet] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loadingbutton, setLoadingbutton] = useState(false);

  const [form] = Form.useForm();

  const onFinish = () => {
    // message.success('Submit success!');
  };

  const onFinishFailed = () => {
    message.error("Submit failed!");
  };

  useEffect(() => {
    loaduser();
    loaduser1();
    getuser();
    app_manager();
  }, []);

  const app_manager = async () => {
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");

    let url = `${process.env.REACT_APP_API_URL_NODE}app-manager`;

    const requestBody = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      // market_id: gameid,
      dev_id: dev_id,
    };

    axios
      .post(url, requestBody)
      .then(function (response) {
        setWithdrawOtp(response.data.data.withdraw_otp);
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  };

  const getuser = async () => {
    const user_id = localStorage.getItem("userid");
    const devid = localStorage.getItem("dev_id");
    const apiUrl = `${process.env.REACT_APP_API_URL_NODE}user-profile`;
    const requestBody = JSON.stringify({
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      device_id: devid,
    });

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "1") {
          fetchwalletamount(setWalletAmount);
          $(".expenseAmtt").html(" ");
          $(".expenseAmtt").html(data.credit);
          setUserData(data);
        } else {
          console.error("API Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [paginate, setpaginate] = useState(1);
  const [loadbuttonshow, setloadbuttonshow] = useState();
  let firstNumbers = [];

  const shoot = () => {
    loaduser();
  };

  const loaduser = async () => {
    // alert()
    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    setLoadingwallet(true);
    let url = `${process.env.REACT_APP_API_URL_NODE}wallet-report`;
    const requestBody = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
      paginate: paginate,
    };

    axios
      .post(url, requestBody)
      .then(function (response) {
        const msgwallet = response.data.data;
        setmsgwallet(msgwallet);
        if (response.data.success === "1") {
          const objectRes = response.data.data;
          setpaginate(response.data.pagination);
          var count = paginate * 10;

          setloadbuttonshow(count);
          let merged = firstNumbers.concat(objectRes);
          let mer = users.concat(objectRes);
          setUsers(mer);
        } else {
          let mer = [];
          setUsers(mer);
        }
      })
      .finally(() => {
        setLoadingwallet(false);
        setIsLoading(false);
      });
  };

  const loaduser1 = async () => {
    const user_id = localStorage.getItem("userid");
    setLoadingwithdraw(true);
    let url = `${process.env.REACT_APP_API_URL_NODE}get-all-bank-account`;
    const requestBody = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
    };

    var config = {
      method: "POST",
      url: url,
      body: requestBody,
    };
    axios
      .post(url, requestBody, config)
      .then(function (response) {
        const res = JSON.stringify(response.data.data);
        console.warn(res);
        const msg = response.data.message;
        var winamount = response.data.winAmount;
        setwinamount(winamount);
        if (res != undefined) {
          const objectRes = JSON.parse(res);
          setUsers1(objectRes);
        }
      })
      .finally(() => {
        setLoadingwithdraw(false);
      });
  };

  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiid, setupiid] = useState("");
  const [inputError, setInputError] = useState(false);
  const [bankNameError, setBankNameError] = useState(false);
  const [accountHolderNameError, setAccountHolderNameError] = useState(false);
  const [accountNumberError, setAccountNumberError] = useState(false);
  const [ifscCodeError, setIfscCodeError] = useState(false);
  const [upiidError, setupiidError] = useState(false);
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [confirmAccountNumberError, setConfirmAccountNumberError] =
    useState(false);
  const [otp, setotp] = useState("");
  const [otpError, setotpError] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const intervalRef = useRef(null);

  const handleClicksend = () => {
    if (!isButtonClicked) {
      setIsButtonClicked(true);
      handleWithdrawal();
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        clearInterval(intervalRef.current);
        setIsButtonClicked(false);
      }, 3000);
    }
  };

  const handleClicksendotp = async () => {
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);
    const user_id = localStorage.getItem("userid");
    const requestData = { user_id: user_id };
    const url = `${process.env.REACT_APP_API_URL_NODE}send-otp-withdraw`;

    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (data.success == 1) {
        Swal.fire({
          title: data.message,
          icon: "success",
          timer: 2000,
        });

        let timeLeft = 60;
        setTimer(timeLeft);

        const countdown = setInterval(() => {
          timeLeft -= 1;
          setTimer(timeLeft);
          if (timeLeft <= 0) {
            clearInterval(countdown);
            setIsButtonDisabled(false);
            setTimer(60);
          }
        }, 1000);
      } else {
        Swal.fire({
          title: data.message,
          timer: 3000,
          icon: "error",
        });
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire({
        title: "An error occurred. Please try again.",
        timer: 3000,
        icon: "error",
      });
      setIsButtonDisabled(false);
    }
  };

  const handleWithdrawal = async () => {
    try {
      setLoadingbutton(true);
      const errors = [];
      setInputError(false);
      setBankNameError(false);
      setAccountHolderNameError(false);
      setAccountNumberError(false);
      setIfscCodeError(false);
      setupiidError(false);
      setotpError(false);

      if (accountNumber != confirmAccountNumber) {
        setConfirmAccountNumberError(true);
        toast.error("Account number and confirm account number do not match");
        return;
      }

      const bankNamePattern = /^[A-Za-z\s]+$/;
      const accountHolderNamePattern = /^[A-Za-z\s]+$/;
      const accountNumberPattern = /^\d+$/;
      const ifscCodePattern = /^[A-Za-z\s\d]+$/;

      if (!bankName.match(bankNamePattern)) {
        setBankNameError(true);
        errors.push("Please enter a valid bank name (letters and spaces only)");
      }
      if (WithdrawOtp == "yes") {
        if (!otp) {
          setotpError(true);
          errors.push("Please enter a Valid OTP");
        }
      }

      if (!accountNumber.match(accountNumberPattern)) {
        setAccountNumberError(true);
        errors.push("Please enter a valid account number (8-18 digits)");
      }

      if (!accountHolderName.match(accountHolderNamePattern)) {
        setAccountHolderNameError(true);
        errors.push(
          "Please enter a valid account holder name (letters and spaces only)",
        );
      }

      if (!ifscCode.match(ifscCodePattern)) {
        setIfscCodeError(true);
        errors.push("Please enter a valid IFSC code (e.g., ABCD1234567)");
      }
      // if (!upiid) {
      //   setupiidError(true);
      //   errors.push("Please enter a valid UPI ID");
      // }
      if (!upiid || !upiid.includes("@")) {
        setupiidError(true);
        errors.push("Please enter valid UPI ID (example: 9876543210@paytm)");
      }

      if (errors.length > 0) {
        const errorMessage = errors.join("\n");
        console.error(errorMessage);
        return;
      }

      const user_id = localStorage.getItem("userid");
      const dev_id = localStorage.getItem("dev_id");
      const requestData = {
        app_id: process.env.REACT_APP_API_ID,
        user_id: user_id,
        account_holder: accountHolderName,
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        upi_id: upiid,
        otp: otp,
      };

      const url = `${process.env.REACT_APP_API_URL_NODE}add-bank-account`;
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      };

      const response = await fetch(url, config);
      const data = await response.json();
      if (data.success == 1) {
        setLoading3(false);
        setIsButtonDisabled(true);
        Swal.fire({
          title: data.message,
          icon: "success",
          timer: 10000,
        }).then((result) => {
          navigate(0);
        });
      } else {
        Swal.fire({
          title: data.message,
          timer: 10000,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error handling Account Add:", error);
    } finally {
      setLoadingbutton(false);
    }
  };

  return (
    <>
      <section className="marginBottom mt-5 pt-5">
        <Container fluid className="p-0 margin-bottom-70">
          <div className="homecontainer">
            <div className="tab_content_one position-relative">
              <div className="justify-content-center d-flex mb-1">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/wallet")}
                >
                  Back
                </button>
              </div>
              <center>
                <h3 className="text-dark text-center">Bank Account Details</h3>
                <div className="p-2">
                  <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    className="position-relative"
                  >
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          label="Bank Name"
                          rules={[{ required: true }]}
                        >
                          <Input
                            type="text"
                            placeholder="Bank Name"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className={`form-control ${
                              bankNameError ? "is-invalid" : ""
                            }`}
                          />
                          {bankNameError && (
                            <div className="invalid-feedback">
                              Please enter a valid bank name
                            </div>
                          )}
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          label="Account Holder Name"
                          rules={[{ required: true }]}
                        >
                          <Input
                            type="text"
                            placeholder="Account Holder Name"
                            value={accountHolderName}
                            onChange={(e) =>
                              setAccountHolderName(e.target.value)
                            }
                            className={`form-control ${
                              accountHolderNameError ? "is-invalid" : ""
                            }`}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          label="Account Number"
                          rules={[{ required: true }]}
                        >
                          <Input
                            type="text"
                            placeholder="Account Number"
                            value={accountNumber}
                            onChange={(e) =>
                              setAccountNumber(
                                e.target.value.replace(/\D/g, ""),
                              )
                            }
                            className={`form-control ${
                              accountNumberError ? "is-invalid" : ""
                            }`}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          label="Confirm Account"
                          rules={[{ required: true }]}
                        >
                          <Input
                            type="text"
                            placeholder="Confirm Account Number"
                            value={confirmAccountNumber}
                            onChange={(e) =>
                              setConfirmAccountNumber(
                                e.target.value.replace(/\D/g, ""),
                              )
                            }
                            className={`form-control ${
                              confirmAccountNumberError ? "is-invalid" : ""
                            }`}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          label="IFSC Code"
                          rules={[{ required: true }]}
                        >
                          <Input
                            type="text"
                            placeholder="IFSC Code"
                            value={ifscCode}
                            onChange={(e) =>
                              setIfscCode(e.target.value.toUpperCase())
                            }
                            className={`form-control ${
                              ifscCodeError ? "is-invalid" : ""
                            }`}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          label="UPI ID (Example 1111111111@ybl)"
                          rules={[{ required: true }]}
                        >
                          <Input
                            type="text"
                            placeholder="UPI ID (Example 1111111111@ybl)"
                            value={upiid}
                            onChange={(e) =>
                              setupiid(e.target.value.toUpperCase())
                            }
                            className={`form-control ${
                              upiidError ? "is-invalid" : ""
                            }`}
                          />
                          {upiidError && (
                            <div className="invalid-feedback">
                              Please enter a valid UPI ID example 1111111111@ybl
                            </div>
                          )}
                        </Form.Item>
                      </Col>
                      {WithdrawOtp == "yes" ? (
                        <Col span={24}>
                          <Form.Item label="OTP">
                            <div className="d-flex align-items-center gap-2">
                              <Input
                                type="text"
                                placeholder="OTP"
                                value={otp}
                                onChange={(e) =>
                                  setotp(e.target.value.replace(/\D/g, ""))
                                }
                                className={`form-control ${
                                  otpError ? "is-invalid" : ""
                                }`}
                              />
                              <Button
                                disabled={isButtonDisabled}
                                className="btn_color_all text-white color-cls"
                                onClick={handleClicksendotp}
                              >
                                {isButtonDisabled
                                  ? `Wait ${timer}s`
                                  : "Send OTP"}
                              </Button>
                            </div>
                          </Form.Item>
                        </Col>
                      ) : (
                        <></>
                      )}
                    </Row>

                    <Form.Item className="text-center">
                      <Button
                        disabled={isButtonClicked || loadingbutton}
                        className="btn_color_all text-white"
                        onClick={handleClicksend}
                      >
                        Submit{" "}
                        {loadingbutton && (
                          <Spin size="small" style={{ marginLeft: "5px" }} />
                        )}
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </center>
            </div>
            <div className="table-responsive tablemargin">
              <p className="text-center mt-2 requesthistory">Bank Details</p>
              <Table
                striped
                bordered
                hover
                className="tablehistory position-relative"
              >
                <thead>
                  <tr>
                    <th>S No</th>
                    <th>Bank Name</th>
                    <th>AccountHolder Name</th>
                    <th>Account Number </th>
                    <th>IFSC Code</th>
                    <th>UPI ID</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody className="tbodyhistroy">
                  {user.length > 0 ? (
                    user.map((value, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{value.bank_name}</td>
                          <td>{value.account_holder}</td>
                          <td>{value.account_number}</td>
                          <td>{value.ifsc_code}</td>
                          <td>{value.upi_id}</td>
                          <td className="text-success">
                            <span
                              style={{
                                color:
                                  value.status === "approved" ? "green" : "red",
                              }}
                            >
                              {value.status}
                            </span>
                          </td>
                          <td>{value.date_time}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center nodataavl">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Container>
      </section>
      {loading2 && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
      {loading3 && (
        <div className="spinner-wrapper">
          <div className="loadernew2"></div>
        </div>
      )}
    </>
  );
}
