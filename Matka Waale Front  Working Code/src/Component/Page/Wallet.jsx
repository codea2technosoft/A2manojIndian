import React, { useState, useRef, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import axios from "axios";
import Table from "react-bootstrap/Table";
import loading1 from "../../assets/img/loading-gif.gif";
import loadingwithdraww from "../../assets/img/loading-gif.gif";
import Swal from "sweetalert2";
import Tab from "react-bootstrap/Tab";
import Logo from "../../assets/img/logo.png";
import $ from "jquery";
import { fetchwalletamount } from "../../common.js";
import { Spinner } from "react-bootstrap";
import { Container } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { Button, Form, Input, message, Space, Modal } from "antd";
import Withdrawhistory from "./Withdrawhistory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Wallet() {
  const navigate = useNavigate();
  const [walletAmount, setWalletAmount] = useState(null);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const [selectedOption, setSelectedOption] = useState(true);
  const [amountvalue, setvalue] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUsers1] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userData, setUserData] = useState(null);
  const [appmanager, setAppmanager] = useState({ min_deposit: 0 });
  const [minredeem, setMinredeem] = useState(null);
  const [Deposit, setDeposit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [winamount, setwinamount] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [loadingwithdraw, setLoadingwithdraw] = useState(false);
  const [loadingwallet, setLoadingwallet] = useState(false);
  const [msg, setmsg] = useState("");
  const [msgwallet, setmsgwallet] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const isButtonLoading = useRef(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [loadingbutton, setLoadingbutton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valueswithdraw, setValueswithdraw] = useState([]);
  const [WithdrawOtp, setWithdrawOtp] = useState([]);

  const changevalue = (e) => {
    setvalue(e.target.value);
  };
  const handleButtonClickdeposit = (amount) => {
    // setSelectedAmount(amount);
    setInputValuedeposit(amount);
  };

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };
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
        var min_redeem = response.data.data.min_redeem;
        var mindeposit = response.data.data.min_deposit;
        setMinredeem(min_redeem);
        setDeposit(mindeposit);
        setWithdrawOtp(response.data.data.withdraw_otp);

        const res = JSON.stringify(response.data.data);
        const objectRes = JSON.parse(res);
        setAppmanager(objectRes);
        setIsLoading(false);
      })
      .catch(function (error) {
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
        // console.warn(response.data.success);
        const msgwallet = response.data.data;
        setmsgwallet(msgwallet);
        // var winamount = response.data.winAmount;
        // setwinamount(winamount);

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
    const dev_id = localStorage.getItem("dev_id");
    setLoadingwithdraw(true);
    let url = `${process.env.REACT_APP_API_URL_NODE}withdrawl-history`;
    const requestBody = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      dev_id: dev_id,
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
        const msg = response.data.message;
        var winamount = response.data.winAmount;
        setwinamount(winamount);
        if (res != undefined) {
          const objectRes = JSON.parse(res);
          setUsers1(objectRes);
          // console.warn(objectRes);
        }
      })
      .finally(() => {
        setLoadingwithdraw(false);
      });
  };

  const user_id = localStorage.getItem("userid");
  const dev_id = localStorage.getItem("dev_id");
  const [inputValuedeposit, setInputValuedeposit] = useState("");

  const handleDeposit = () => {
    if (!inputValuedeposit) {
      toast.error("Please enter a valid Value !");
      return;
    }
    if (parseInt(Deposit) > parseInt(inputValuedeposit)) {
      toast.error(`Minimum Deposit Amount ${appmanager.min_deposit}`);
      return;
    }
    try {
      if (inputValuedeposit) {
        setLoading(true);
        const apiUrl = `https://matkawaale.com/api/deposit.php?name=${userData.name}&userid=${user_id}&amount=${inputValuedeposit}&contact=${userData.mob}&getaway=razorpay&type=web`;
        window.location.href = apiUrl;
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setLoading(false);
    }
  };

  const handleUTRPyament = () => {
    try {
      // setLoading(true);
      const apiUrl = `https://matkawaale.com/api/mdeposit.php?name=${userData.name}&userid=${user_id}&contact=${userData.mob}`;
      window.location.href = apiUrl;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setLoading(false);
    }
  };

  // Withdrawal Api
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [upi_id, setupi_id] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [inputError, setInputError] = useState(false);
  const [bankNameError, setBankNameError] = useState(false);
  const [accountHolderNameError, setAccountHolderNameError] = useState(false);
  const [accountNumberError, setAccountNumberError] = useState(false);
  const [ifscCodeError, setIfscCodeError] = useState(false);
  const [mobilnumbererror, setMobileNumberError] = useState(false);
  const [amounttrerror, setAmountError] = useState(false);
  const [upiidError, setupiidError] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);
  // const [bankName, setBankName] = useState('');
  const [accountHolderNameBank, setAccountHolderNameBank] = useState("");
  const [accountNumberBank, setAccountNumberBank] = useState("");
  const [accountNumberBank1, setAccountNumberBank1] = useState("");
  const [ifscCodeBank, setIfscCodeBank] = useState("");
  const [filteredValues, setFilteredValues] = useState([]);
  const [showList, setShowList] = useState(true);
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [confirmAccountNumberError, setConfirmAccountNumberError] =
    useState(false);
  const [otp, setotp] = useState("");
  const [otpError, setotpError] = useState(false);
  const [timer, setTimer] = useState(60);
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  const fetchBankData = async () => {
    try {
      const userId = localStorage.getItem("userid");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL_NODE}get-success-bank-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            app_id: process.env.REACT_APP_API_ID,
            user_id: userId,
          }),
        },
      );

      const data = await response.json();
      console.warn("API Response:", data);

      if (data.success === 1 && Array.isArray(data.data)) {
        setBankList(data.data);
      } else {
        toast.error("Failed to fetch bank details.");
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
    }
  };

  const handleBankSelection = (bank) => {
    setSelectedBank(bank);
    setBankName(bank.bank_name);
    setAccountHolderName(bank.account_holder);
    setAccountNumber(bank.account_number);
    setupi_id(bank.upi_id);
    setIfscCode(bank.ifsc_code);
    setShowList(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClicksend = () => {
    if (!isButtonClicked) {
      setIsButtonClicked(true);
      handleWithdrawal();

      // Clear previous interval
      clearInterval(intervalRef.current);

      // Set a new interval to reset isButtonClicked after 3 seconds
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

  // const handleWithdrawal = async () => {
  //   try {
  //     setLoadingbutton(true);
  //     const errors = [];
  //     setInputError(false);
  //     setBankNameError(false);
  //     setAccountHolderNameError(false);
  //     setAccountNumberError(false);
  //     setIfscCodeError(false);
  //     setupiidError(false);
  //     setotpError(false);

  //     const amountPattern = /^\d+(\.\d{1,2})?$/;
  //     const bankNamePattern = /^[A-Za-z\s]+$/;
  //     const accountHolderNamePattern = /^[A-Za-z\s]+$/;
  //     const accountNumberPattern = /^\d+$/;
  //     const ifscCodePattern = /^[A-Za-z\s\d]+$/;

  //     if (!bankName.match(bankNamePattern)) {
  //       setBankNameError(true);
  //       errors.push("Please enter a valid bank name (letters and spaces only)");
  //     }

  //     if (!accountNumber.match(accountNumberPattern)) {
  //       setAccountNumberError(true);
  //       errors.push("Please enter a valid account number (8-18 digits)");
  //     }
  //     // if (!upi_id) {
  //     //   setupiidError(true);
  //     //   errors.push("Please enter a valid UPI ID");
  //     // }
  //     if (!upi_id || !upi_id.includes("@")) {
  //       setupiidError(true);
  //       errors.push("Please enter valid UPI ID (example: 9876543210@paytm)");
  //     }
  //     if (WithdrawOtp == "yes") {
  //       if (!otp) {
  //         setotpError(true);
  //         errors.push("Please enter a Valid OTP");
  //       }
  //     } else {
  //       setotp("0000");
  //     }

  //     if (!accountHolderName.match(accountHolderNamePattern)) {
  //       setAccountHolderNameError(true);
  //       errors.push(
  //         "Please enter a valid account holder name (letters and spaces only)",
  //       );
  //     }

  //     if (!ifscCode.match(ifscCodePattern)) {
  //       setIfscCodeError(true);
  //       errors.push("Please enter a valid IFSC code (e.g., ABCD1234567)");
  //     }
  //     if (!inputValue.match(amountPattern)) {
  //       setInputError(true);
  //       errors.push("Please enter a valid amount (e.g., 500 or 500.00)");
  //     }
  //     if (errors.length > 0) {
  //       const errorMessage = errors.join("\n");
  //       console.error(errorMessage);
  //       return;
  //     }

  //     const user_id = localStorage.getItem("userid");
  //     const dev_id = localStorage.getItem("dev_id");
  //     const requestData = {
  //       app_id: process.env.REACT_APP_API_ID,
  //       user_id: user_id,
  //       amount: parseInt(inputValue),
  //       account_holder: accountHolderName,
  //       bank_name: bankName,
  //       upi_id: upi_id,
  //       account_number: accountNumber,
  //       ifsc_code: ifscCode,
  //       otp: otp,
  //     };

  //     const url = `${process.env.REACT_APP_API_URL_NODE}deduct-withdrawweb`;
  //     const config = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     };

  //     const response = await fetch(url, config);
  //     const data = await response.json();
  //     if (data.success == 1) {
  //       setLoading3(false);
  //       setIsButtonDisabled(true);
  //       Swal.fire({
  //         title: data.message,
  //         icon: "success",
  //         timer: 2000,
  //       }).then((result) => {
  //         navigate(0);
  //       });
  //     } else {
  //       Swal.fire({
  //         title: data.message,
  //         timer: 3000,
  //         icon: "error",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error handling withdrawal:", error);
  //   } finally {
  //     setLoadingbutton(false);
  //   }
  // };


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

    const amountPattern = /^\d+(\.\d{1,2})?$/;
    const bankNamePattern = /^[A-Za-z\s]+$/;
    const accountHolderNamePattern = /^[A-Za-z\s]+$/;
    const accountNumberPattern = /^\d+$/;
    const ifscCodePattern = /^[A-Za-z\s\d]+$/;

    // Amount validation - FIX: Check for minimum amount
    if (!inputValue || inputValue.trim() === "") {
      setInputError(true);
      errors.push("Please enter an amount");
    } else if (!inputValue.match(amountPattern)) {
      setInputError(true);
      errors.push("Please enter a valid amount (e.g., 500 or 500.00)");
    } else if (parseInt(inputValue) < 1) {
      setInputError(true);
      errors.push("Insufficient Balance. Please Enter A Lower Withdrawal Amount And Then Try !!!");
    }

    if (!bankName.match(bankNamePattern)) {
      setBankNameError(true);
      errors.push("Please enter a valid bank name (letters and spaces only)");
    }

    if (!accountNumber.match(accountNumberPattern)) {
      setAccountNumberError(true);
      errors.push("Please enter a valid account number (8-18 digits)");
    }
    
    if (!upi_id || !upi_id.includes("@")) {
      setupiidError(true);
      errors.push("Please enter valid UPI ID (example: 9876543210@paytm)");
    }
    
    if (WithdrawOtp == "yes") {
      if (!otp) {
        setotpError(true);
        errors.push("Please enter a Valid OTP");
      }
    } else {
      setotp("0000");
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
    
    if (errors.length > 0) {
      const errorMessage = errors.join("\n");
      console.error(errorMessage);
      
      // Show Sweet Alert for first error
      Swal.fire({
        title: "Error!",
        text: errors[0],
        icon: "error",
        timer: 10000,
        showConfirmButton: true,
      });
      return;
    }

    const user_id = localStorage.getItem("userid");
    const dev_id = localStorage.getItem("dev_id");
    const requestData = {
      app_id: process.env.REACT_APP_API_ID,
      user_id: user_id,
      amount: parseInt(inputValue),
      account_holder: accountHolderName,
      bank_name: bankName,
      upi_id: upi_id,
      account_number: accountNumber,
      ifsc_code: ifscCode,
      otp: otp,
    };

    const url = `${process.env.REACT_APP_API_URL_NODE}deduct-withdrawweb`;
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
        title: "Success!",
        text: data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then((result) => {
        navigate(0);
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: data.message,
        icon: "error",
        timer: 5000,
        showConfirmButton: true,
      });
    }
  } catch (error) {
    console.error("Error handling withdrawal:", error);
    Swal.fire({
      title: "Error!",
      text: "Something went wrong. Please try again.",
      icon: "error",
      timer: 5000,
      showConfirmButton: true,
    });
  } finally {
    setLoadingbutton(false);
  }
};
  const handleButtonClick = (amount) => {
    setInputValue(amount);
  };

  // ------transferpoints Api ------- //

  const [mobilnumber, setmobilNumber] = useState("");
  const [amounttr, setAmounttr] = useState("");
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(false);
  const isButtonLoading1 = useRef(false);
  const [isButtonVisible1, setIsButtonVisible1] = useState(true);
  const [loadingbuttontf, setLoadingbuttontf] = useState(false);

  const OnnumberChange = (e) => {
    let mobilnumbers = e.target.value;
    mobilnumbers = mobilnumbers.replace(/\D/g, "");
    mobilnumbers = mobilnumbers.slice(0, 10);
    setmobilNumber(mobilnumbers);
  };

  const OnamountChange = (e) => {
    let amount = e.target.value;
    amount = amount.slice(0, 6);
    setAmounttr(amount);
  };

  const [isButtonClickedtf, setIsButtonClickedtf] = useState(false);
  // const intervalRef = useRef(null);

  const handleClicktransferpoints = () => {
    if (!isButtonClicked) {
      setIsButtonClickedtf(true);
      transferpoints();

      // Clear previous interval
      clearInterval(intervalRef.current);

      // Set a new interval to reset isButtonClicked after 3 seconds
      intervalRef.current = setInterval(() => {
        clearInterval(intervalRef.current);
        setIsButtonClickedtf(false);
      }, 3000);
    }
  };

  const transferpoints = async () => {
    setLoadingbuttontf(true);

    const errors = [];

    const mobilNumberRegex = /^\d+$/;
    const amountRegex = /^\d+$/;

    if (!mobilNumberRegex.test(mobilnumber)) {
      setMobileNumberError(true);
      errors.push("Please enter a valid number");
    }

    if (!otp) {
      setotpError(true);
      errors.push("Please enter a Valid OTP");
    }

    if (!amountRegex.test(amounttr)) {
      setAmountError(true);
      errors.push("Please enter a valid Amount");
    }

    try {
      let url = `${process.env.REACT_APP_API_URL_NODE}transfer`;
      const requestData = {
        user_id: user_id,
        devName: "web",
        amount: amounttr,
        rec_mob: mobilnumber,
        otp: otp,
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

        setIsButtonDisabled1(true);
        if (data.status == "1") {
          getuser();
          loaduser();
          setLoading2(false);
          setShowSubmitButton(false);
          setOpen(false);
          toast.success(data.message);
          navigate(0);
        } else {
          toast.error(data.message);
          // navigate(0)
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      // });
    } catch (error) {
      console.error("User Name Update:", error);
    } finally {
      setLoadingbuttontf(false);
    }
  };

  // const fetchData = async () => {
  //   const userId = localStorage.getItem("userid");
  //   let url = `${process.env.REACT_APP_API_URL_NODE}user-deduct-list`;
  //   const requestData = {
  //     user_id: userId,
  //   };
  //   const config = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(requestData),
  //   };

  //   try {
  //     const response = await fetch(url, config);
  //     const responseData = await response.json();
  //     if (responseData.success === '1') {
  //       const userDeductData = responseData.data;
  //       console.warn(responseData);
  //       setValueswithdraw(userDeductData);
  //     } else {
  //       // Handle error response
  //       console.error("Error fetching data:", responseData.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  useEffect(() => {
    if (valueswithdraw) {
      setFilteredValues(
        valueswithdraw.filter(
          (item) =>
            item.bank_name &&
            bankName &&
            item.bank_name.toLowerCase().includes(bankName.toLowerCase()),
        ),
      );
    }
  }, [bankName, valueswithdraw]);

  // const datavalue = async (value, id) => {
  //   setShowList(false);
  //   setBankName(value.bank_name);
  //   setAccountHolderName(value.account_holder);
  //   setAccountNumber(value.account_no);
  //   setIfscCode(value.ifsc);
  //   const userId = localStorage.getItem("userid");
  //   let url = `${process.env.REACT_APP_API_URL_NODE}bank-details`;
  //   const requestData = {
  //     app_id: process.env.REACT_APP_API_ID,
  //     user_id: user_id,
  //     id: id
  //   };

  //   const config = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(requestData),
  //   };
  //   try {
  //     const response = await fetch(url, config)
  //     const bankDetails = response.data && response.data.data;

  //     // const account_holder_name = response.data.data.account_holder;
  //     setAccountHolderNameBank(bankDetails.account_holder || '');
  //     setAccountNumberBank(bankDetails.account_number || '');
  //     setIfscCodeBank(bankDetails.ifsc_code || '');
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  return (
    <>
      <Space>
        <Button
          disabled={isButtonDisabled1}
          type="primary"
          onClick={() => {
            Modal.confirm({
              title: "Confirm",
              content: "Bla bla ...",
              footer: (_, { Submit }) => (
                <>
                  <Submit />
                </>
              ),
            });
          }}
        >
          Open Modal Confirm
        </Button>
      </Space>
      {/* {showSubmitButton && */}
      <Modal
        open={open}
        title="Transfer"
        onOk={handleOk}
        className="model-transferpoint"
        onCancel={handleCancel}
        footer={(_, {}) => (
          <>
            <div>
              <Button
                disabled={isButtonClickedtf || loadingbuttontf}
                type=""
                htmlType="submit"
                className="btn_color_all text-white"
                onClick={handleClicktransferpoints}
              >
                Submit
                {loadingbuttontf && (
                  <Spinner
                    animation="border"
                    style={{
                      marginLeft: "8px",
                      width: "25px",
                      height: "25px",
                      marginTop: "7px",
                    }}
                  />
                )}
              </Button>
            </div>
          </>
        )}
      >
        <div className="logo d-flex justify-content-center w-100 logomodel">
          <img src={Logo} />
        </div>
        <p className="pointsid text-white p-2 text-center">
          यहां से आप अपने POINT अपने दोस्तो की ID मैं डाल सकते हो
        </p>
        <Input
          placeholder="Enter Mobile Number"
          value={mobilnumber}
          onChange={OnnumberChange}
          type="number"
          className={`form-control ${
            mobilnumbererror ? "is-invalid" : ""
          } mb-2`}
        />
        {mobilnumbererror && (
          <div className="invalid-feedback">Please enter a valid Number</div>
        )}
        <Input
          placeholder="Amount"
          type="number"
          value={amounttr}
          maxLength={6}
          onChange={OnamountChange}
          className={`form-control ${amounttrerror ? "is-invalid" : ""}`}
        />
        {amounttrerror && (
          <div className="invalid-feedback">Please enter a valid Amount</div>
        )}

        <div className="d-flex align-items-center gap-2 mt-2">
          <Input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setotp(e.target.value.replace(/\D/g, ""))}
            className={`form-control ${otpError ? "is-invalid" : ""}`}
          />
          <Button
            disabled={isButtonDisabled}
            className="btn_color_all text-white color-cls"
            onClick={handleClicksendotp}
          >
            {isButtonDisabled ? `Wait ${timer}s` : "Send OTP"}
          </Button>
        </div>
      </Modal>
      <section id="wallet" className="margin-bottom-88 mb-0">
        <Container className="p-0 margin-bottom-70">
          <div className="homecontainer">
            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey="first"
              className="w-100"
            >
              <div className="">
                <div className="tabs_wallet">
                  <Nav variant="pills" className="tabslinks">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="first"
                        className="text-center AddPoint"
                      >
                        Add Point
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="second"
                        className="text-center Withdraw"
                      >
                        Withdraw
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </div>
              <div>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <div style={{ color: "red", padding: "10px" }}>
                      {/* कृपया केवल दिए गए अकाउंट में ही पेमेंट करें। यदि कोई
                      व्यक्ति अपनी तरफ से किसी पुराने अकाउंट में पेमेंट करता है,
                      तो उसका पेमेंट Add नहीं होगा और इसके लिए वह स्वयं
                      जिम्मेदार होगा। कृपया 200 रुपये से कम जमा न करें। */}
                    </div>
                    <div className="tab_content_one position-relative">
                      <div className="addfundwallet">
                        <div className="bankicon">
                          <Icon.Bank />
                        </div>
                        <input
                          type="Number"
                          value={inputValuedeposit}
                          onChange={(e) => setInputValuedeposit(e.target.value)}
                          required
                          className="form-control addamountinput"
                          placeholder="Add Amount"
                        />
                      </div>
                      <div className="button-amount d-flex flex-wrap">
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClickdeposit("200")}
                        >
                          ₹ 200
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClickdeposit("500")}
                        >
                          ₹ 500
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClickdeposit("1000")}
                        >
                          ₹ 1000
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClickdeposit("1500")}
                        >
                          ₹ 1500
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClickdeposit("2000")}
                        >
                          ₹ 2000
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClickdeposit("5000")}
                        >
                          ₹ 5000
                        </button>
                      </div>
                      <p className="description mt-2 text-danger">
                        {appmanager && appmanager.dep_message}
                      </p>
                      <center>
                        {/* <h5>Win Amount :<strong>0</strong></h5> */}
                        <div className="d-flex justify-content-between mt-2">
                          <button
                            className=" btnaddpoints"
                            disabled={loading}
                            onClick={handleDeposit}
                          >
                            Add Points
                            {loading && <Spinner animation="border" />}
                          </button>

                          {/* <button
                            className=" btnaddpoints UTIpayment"
                            onClick={handleUTRPyament}
                          >
                            UTR Payment
                          </button> */}

                          <button
                            className="transferpoints"
                            onClick={showModal}
                          >
                            Transfer Points
                          </button>
                        </div>
                        <div className="d-flex justify-content-center radiobtn"></div>
                      </center>
                    </div>
                    <div className="table-responsive">
                      <p className="text-center mt-2 requesthistory">
                        Wallet History
                      </p>

                      <Table striped bordered hover className="tablehistory">
                        <thead>
                          <tr>
                            <th>Sr No</th>
                            <th>Pay Mode</th>
                            <th>Date</th>
                            <th>Points </th>
                            <th>Closing Balance </th>
                            <th>Status </th>
                          </tr>
                        </thead>
                        <tbody className="position-relative">
                          {loadingwallet ? (
                            <>
                              <div className="loadernew">
                                <img
                                  src={loading1}
                                  className="px-2 loaderfile"
                                  style={{ width: "50px" }}
                                  alt="Loading..."
                                />
                              </div>
                            </>
                          ) : users.length > 0 ? (
                            users &&
                            users.map((values, index) => {
                              const dateTime = new Date(values.datetime);
                              const formattedDate = `${dateTime.getDate()}-${
                                dateTime.getMonth() + 1
                              }-${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>
                                    {values.remark} {values.market}
                                  </td>
                                  <td>{values.datetime}</td>
                                  <td>{values.amount}</td>
                                  <td>{values.closing_balance}</td>
                                  <td className="text-success">
                                    {" "}
                                    <span
                                      style={{
                                        color:
                                          values.status === "Success"
                                            ? "green"
                                            : "red",
                                      }}
                                    >
                                      {values.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan="10"
                                className="text-center nodataavl"
                              >
                                {" "}
                                No data available or something went wrong.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                      {users && users.length >= loadbuttonshow ? (
                        <div className="d-flex justify-content-center loadmore">
                          <button
                            className="btn btn-primary w-50  mx-auto text-center"
                            onClick={shoot}
                          >
                            Load More
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    {/* <div style={{ color: "red", padding: "10px" }}>
                      सर, आप कम से कम ₹200 निकाल सकते हैं और आप 24*7 पैसे निकाल
                      सकते हैं।
                    </div> */}
                    <div className="tab_content_one position-relative">
                      <div className="addfundwallet mt-3">
                        <div className="bankicon">
                          <Icon.Bank />
                        </div>
                        <input
                          type="Number"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className={`form-control ${
                            inputError ? "is-invalid" : ""
                          } addamountinput`}
                          placeholder="Withdraw"
                        />
                        {inputError && (
                          <div className="invalid-feedback">
                            Please enter a valid amount (e.g., 500 or 500.00)
                          </div>
                        )}
                      </div>
                      <div className="button-amount d-flex flex-wrap">
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClick("200")}
                        >
                          ₹ 200
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClick("500")}
                        >
                          ₹ 500
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClick("1000")}
                        >
                          ₹ 1000
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClick("1500")}
                        >
                          ₹ 1500
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClick("2000")}
                        >
                          ₹ 2000
                        </button>
                        <button
                          className="btn-amount"
                          onClick={() => handleButtonClick("5000")}
                        >
                          ₹ 5000
                        </button>
                      </div>
                      <center>
                        <p className="description mt-2 text-danger text-center">
                          आप सिर्फ जीता हुआ पैसा ही अपने अकाउंट में निकाल सकते
                          हो
                        </p>
                        {/* <p className="description mt-2 text-danger text-center">
                          Withdraw Time :- सुबह 10 से रात 10 बजे तक
                        </p> */}
                        <p className="text-center winamount">
                          Win Amount :- {winamount}
                        </p>
                        <p className="text-dark text-center">
                          Bank Account Details
                        </p>
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate("/add-bank")}
                        >
                          Add Bank Account
                        </button>
                        <div className="d-flex justify-content-center radiobtn"></div>
                        <div className="p-2">
                          <Form
                            name="basic"
                            labelCol={{
                              span: 6,
                            }}
                            wrapperCol={{
                              span: 16,
                            }}
                            layout="horizontal"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            className="position-relative"
                          >
                            <Form.Item
                              className="mb-2"
                              label="Bank Name"
                              rules={[{ required: true }]}
                            >
                              <Input
                                type="text"
                                placeholder="Bank Name"
                                value={bankName}
                                onChange={(e) => {
                                  setBankName(e.target.value);
                                  setShowList(true);
                                }}
                                onClick={fetchBankData}
                                className={`form-control ${
                                  bankNameError ? "is-invalid" : ""
                                }`}
                              />
                              {bankList &&
                                Array.isArray(bankList) &&
                                bankList.length > 0 && (
                                  <ul className="details_list">
                                    {bankList
                                      .filter((bank) =>
                                        bank.bank_name
                                          ?.toLowerCase()
                                          .includes(bankName.toLowerCase()),
                                      )
                                      .map((bank, index) => (
                                        <li
                                          key={index}
                                          onClick={() =>
                                            handleBankSelection(bank)
                                          }
                                        >
                                          {bank.bank_name}
                                        </li>
                                      ))}
                                  </ul>
                                )}
                            </Form.Item>

                            <Form.Item
                              className="mb-2"
                              label="Account Holder Name"
                              rules={[
                                { required: true },
                                {
                                  pattern: /^[a-zA-Z\s]*$/,
                                  message:
                                    "Only letters and spaces are allowed",
                                },
                                { type: "string" },
                              ]}
                            >
                              <Input
                                type="text"
                                placeholder="Account Holder Name"
                                value={
                                  accountHolderName || accountHolderNameBank
                                }
                                onChange={(e) =>
                                  setAccountHolderName(e.target.value)
                                }
                                readOnly
                                className={`form-control ${
                                  accountHolderNameError ? "is-invalid" : ""
                                }`}
                              />
                              {accountHolderNameError && (
                                <div className="invalid-feedback">
                                  Please enter a valid account holder name
                                  (letters and spaces only)
                                </div>
                              )}
                            </Form.Item>

                            <Form.Item
                              className="mb-2"
                              label="Account Number"
                              rules={[{ required: true }, { type: "string" }]}
                            >
                              <Input
                                type="text"
                                placeholder="Account Number"
                                value={accountNumber}
                                onChange={(e) => {
                                  const input = e.target.value.replace(
                                    /\D/g,
                                    "",
                                  );
                                  const limitedInput = input.slice(0, 18);
                                  setAccountNumber(limitedInput);
                                }}
                                readOnly
                                className={`form-control ${
                                  accountNumberError ? "is-invalid" : ""
                                }`}
                              />
                              {accountNumberError && (
                                <div className="invalid-feedback">
                                  Please enter a valid account number (numbers
                                  only)
                                </div>
                              )}
                            </Form.Item>

                            <Form.Item
                              className="mb-2"
                              label="IFSC Code"
                              rules={[
                                { required: true },
                                { type: "uri", warningOnly: true },
                                { type: "string" },
                              ]}
                            >
                              <Input
                                type="text"
                                placeholder="IFSC Code"
                                value={ifscCode || ifscCodeBank}
                                onChange={(e) => {
                                  const input = e.target.value.replace(
                                    /[^a-zA-Z0-9]/g,
                                    "",
                                  );
                                  const limitedInput = input.slice(0, 20);
                                  const upperCaseInput =
                                    limitedInput.toUpperCase();
                                  setIfscCode(upperCaseInput);
                                }}
                                readOnly
                                className={`form-control ${
                                  ifscCodeError ? "is-invalid" : ""
                                }`}
                              />
                              {ifscCodeError && (
                                <div className="invalid-feedback">
                                  Please enter a valid IFSC code (e.g.,
                                  ABCD1234567)
                                </div>
                              )}
                            </Form.Item>
                            <Form.Item
                              className="mb-2"
                              label="UPI ID (example 1111111111@ybl)"
                              rules={[
                                { required: true },
                                { type: "uri", warningOnly: true },
                                { type: "string" },
                              ]}
                            >
                              <Input
                                type="text"
                                placeholder="UPI ID"
                                value={upi_id}
                                onChange={(e) => {
                                  setupi_id(e.target.value);
                                }}
                                className={`form-control ${
                                  upiidError ? "is-invalid" : ""
                                }`}
                              />
                              {upiidError && (
                                <div className="invalid-feedback">
                                  Please enter a valid UPI ID example
                                  1111111111@ybl
                                </div>
                              )}
                            </Form.Item>
                            {WithdrawOtp == "yes" ? (
                              <Form.Item className="mb-2" label="OTP">
                                <div className="d-flex align-items-center gap-2">
                                  <Input
                                    type="text"
                                    placeholder="OTP"
                                    value={otp}
                                    onChange={(e) => {
                                      const input = e.target.value.replace(
                                        /\D/g,
                                        "",
                                      );
                                      const limitedInput = input.slice(0, 30);
                                      setotp(limitedInput);
                                    }}
                                    className={`form-control ${
                                      otpError ? "is-invalid" : ""
                                    }`}
                                  />
                                  <Button
                                    disabled={isButtonDisabled}
                                    type=""
                                    htmlType="submit"
                                    className="btn_color_all text-white color-cls"
                                    onClick={handleClicksendotp}
                                  >
                                    {isButtonDisabled
                                      ? `Wait ${timer}s`
                                      : "Send OTP"}
                                  </Button>
                                </div>
                                {otpError && (
                                  <div className="invalid-feedback">
                                    Please enter a valid OTP
                                  </div>
                                )}
                              </Form.Item>
                            ) : (
                              <></>
                            )}

                            {isButtonVisible ? (
                              <Form.Item>
                                <Space>
                                  <Button
                                    disabled={isButtonClicked || loadingbutton}
                                    type=""
                                    htmlType="submit"
                                    className="btn_color_all text-white"
                                    onClick={handleClicksend}
                                  >
                                    Withdrawal
                                    {loadingbutton && (
                                      <Spinner
                                        animation="border"
                                        style={{
                                          marginLeft: "5px",
                                          width: "15px",
                                          height: "15px",
                                          marginTop: "15px",
                                        }}
                                      />
                                    )}
                                  </Button>
                                </Space>
                              </Form.Item>
                            ) : (
                              <div
                                className="d-flex justify-content-center position-relative"
                                style={{ left: "0" }}
                              >
                                <img
                                  src={loadingwithdraww}
                                  className="px-2 loaderfile"
                                  style={{ width: "50px" }}
                                />
                              </div>
                            )}
                          </Form>
                        </div>
                      </center>
                    </div>
                    <div className="table-responsive">
                      <p className="text-center mt-2 requesthistory">
                        Withdraw History
                      </p>
                      <Table
                        striped
                        bordered
                        hover
                        className="tablehistory position-relative"
                      >
                        <thead>
                          <tr>
                            <th>S No</th>
                            <th>Pay Mode</th>
                            <th>Date</th>
                            <th>Points </th>
                            <th>Status </th>
                          </tr>
                        </thead>
                        <tbody className="tbodyhistroy">
                          {user.length > 0 ? (
                            user &&
                            user.map((value, index) => {
                              const dateTime = new Date(value.created_at);
                              const formattedDate = `${dateTime.getDate()}-${
                                dateTime.getMonth() + 1
                              }-${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>Bank Account</td>
                                  <td>{formattedDate}</td>
                                  <td>{value.tr_value}</td>
                                  <td className="text-success">
                                    {" "}
                                    <span
                                      style={{
                                        color:
                                          value.status === "Success"
                                            ? "green"
                                            : "red",
                                      }}
                                    >
                                      {value.tr_status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan="10"
                                className="text-center nodataavl"
                              >
                                {" "}
                                No data available or something went wrong.
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {loadingwithdraw && (
                          <div className="loadernew">
                            <img
                              src={loading1}
                              className="px-2 loaderfile"
                              style={{ width: "50px" }}
                              alt="Loading..."
                            />
                          </div>
                        )}
                      </Table>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
        </Container>
        <ToastContainer />
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
