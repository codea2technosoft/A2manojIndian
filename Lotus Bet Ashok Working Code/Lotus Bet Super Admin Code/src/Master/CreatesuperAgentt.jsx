import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const CreateSuperAgentAdmin = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const generatePassword = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let pass = "";
    pass += letters[Math.floor(Math.random() * letters.length)];
    pass += letters[Math.floor(Math.random() * letters.length)];
    for (let i = 0; i < 4; i++) {
      pass += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return pass;
  };

  const [formData, setFormData] = useState({
    name: "",
    super_admin_id: "",
    admin_id: "",
    master_admin_id: "",
    coins: "",
    password: "",
    myCoins: "",
    myMatchShare: "",
    agentMatchShare: "",
    myCommissionType: "bet_by_bet",
    agentCommissionType: "",
    myMatchComm: "",
    agentMatchComm: "",

    agentFootballComm: "",
    myFootballComm: "",

    // Football
    myFootballComm: "",
    agentFootballComm: "",

    // Tennis
    myTennisComm: "",
    agentTennisComm: "",

    // Horse Racing
    myHorseRacingComm: "",
    agentHorseRacingComm: "",

    // Greyhound Racing
    myGreyhoundRacingComm: "",
    agentGreyhoundRacingComm: "",

    // Politics
    myPoliticsComm: "",
    agentPoliticsComm: "",

    // Casino
    myCasinoComm: "",
    agentCasinoComm: "",

    // Session
    mySessionComm: "",
    agentSessionComm: "",

    mySessionComm: "",
    agentSessionComm: "",
    myCasinoComm: "",
    myMatkaComm: "",
    agentMatkaComm: "",
    username: "",
    companyShare: "",
    reference: "",
  });
  useEffect(() => {
    const fetchAdminData = async () => {
      const role = localStorage.getItem("role");

      try {
        // Fetch logged-in admin data
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/get-admin-details`,
          {
            role: "2",
            admin_id: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.data.success) {
          const adminProfile = response.data.data.admin_profile;
          const matchComm = parseFloat(adminProfile.match_comm) || 0;
          const sessionComm = parseFloat(adminProfile.session_comm) || 0;
          let autoCommissionType = "0";
          if (matchComm > 0 || sessionComm > 0) {
            autoCommissionType = "1"; // Bet by Bet
          }

          setAdminData(adminProfile);
          setFormData((prev) => ({
            ...prev,
            super_admin_id: adminProfile.super_admin_id,
            admin_id: adminProfile.admin_id,
            username: adminProfile.username,
            master_admin_id: adminProfile.master_admin_id,
            myCoins: adminProfile.coins || "0",
            myMatchShare: adminProfile.match_share || "0",
            // myCommissionType: adminProfile.commission_type === "1" ? "bet_by_bet" :
            // agentMatchComm: adminProfile.match_comm || "0",

            myFootballComm: adminProfile.football_comm || "0",
            agentFootballComm: "",

            myTennisComm: adminProfile.tennis_comm || "0",
            agentTennisComm: "",

            myHorseRacingComm: adminProfile.horse_racing_comm || "0",
            agentHorseRacingComm: "",

            myGreyhoundRacingComm: adminProfile.greyhound_racing_comm || "0",
            agentGreyhoundRacingComm: "",

            myPoliticsComm: adminProfile.politics_comm || "0",
            agentPoliticsComm: "",

            myCasinoComm: adminProfile.casino_comm || "0",
            agentCasinoComm: "",

            myMatchComm: adminProfile.match_comm || "0",
            agentMatchComm: "",

            agentSessionComm: "",
            // adminProfile.commission_type === "2" ? "match_comm" : "bet_by_bet",
            myCommissionType: adminProfile.commission_type || "1",
            companyShare: adminProfile.company_share || "0",
            //myMatchComm: adminProfile.match_comm || "0",
            mySessionComm: adminProfile.session_comm || "0",
            myCasinoComm: adminProfile.casino_comm || "0",
            myMatkaComm: adminProfile.matka_comm || "0",
            agentCommissionType: autoCommissionType,
          }));

          // toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAdminData();
    } else {
      toast.error("Authentication token not found");
      navigate("/login");
    }
  }, [token, navigate, id]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      password: generatePassword(),
    }));
  }, []);
  useEffect(() => {
    checkFormValidity();
  }, [formData]);

  const checkFormValidity = () => {
    const requiredFields = [
      "name",
      "coins",
      "password",
      "agentMatchShare",
      "agentCommissionType",
    ];

    const allRequiredFilled = requiredFields.every((field) => {
      const value = formData[field];
      return (
        value !== null && value !== undefined && value.toString().trim() !== ""
      );
    });

    const coins = parseFloat(formData.coins);
    const myCoins = parseFloat(formData.myCoins) || 0;
    const coinsValid = !isNaN(coins) && coins > 0 && coins <= myCoins;

    const passwordRegex = /^[A-Z]{2}[0-9]{4}$/;
    const passwordValid = passwordRegex.test(formData.password);

    const agentMatchShare = parseFloat(formData.agentMatchShare);
    const myMatchShare = parseFloat(formData.myMatchShare) || 0;
    const matchShareValid =
      !isNaN(agentMatchShare) &&
      agentMatchShare >= 0 &&
      agentMatchShare <= myMatchShare;

    let commissionValid = true;
    if (formData.agentCommissionType === "1") {
      const agentMatchComm = parseFloat(formData.agentMatchComm);
      const agentSessionComm = parseFloat(formData.agentSessionComm);
      const myMatchComm = parseFloat(formData.myMatchComm) || 0;

      const agentFootballComm = parseFloat(formData.agentFootballComm);
      const agentTennisComm = parseFloat(formData.agentTennisComm);
      const agentHorseRacingComm = parseFloat(formData.agentHorseRacingComm);
      const agentGreyhoundRacingComm = parseFloat(
        formData.agentGreyhoundRacingComm,
      );
      const agentPoliticsComm = parseFloat(formData.agentPoliticsComm);
      const agentCasinoComm = parseFloat(formData.agentCasinoComm);
      //const agentSessionComm = parseFloat(formData.agentSessionComm);

      const myFootballComm = parseFloat(formData.myFootballComm) || 0;
      const myTennisComm = parseFloat(formData.myTennisComm) || 0;
      const myHorseRacingComm = parseFloat(formData.myHorseRacingComm) || 0;
      const myGreyhoundRacingComm =
        parseFloat(formData.myGreyhoundRacingComm) || 0;
      const myPoliticsComm = parseFloat(formData.myPoliticsComm) || 0;
      const myCasinoComm = parseFloat(formData.myCasinoComm) || 0;
      const mySessionComm = parseFloat(formData.mySessionComm) || 0;

      const matchCommValid =
        !isNaN(agentMatchComm) &&
        agentMatchComm >= 0 &&
        agentMatchComm <= myMatchComm;
      const sessionCommValid =
        !isNaN(agentSessionComm) &&
        agentSessionComm >= 0 &&
        agentSessionComm <= mySessionComm;

      commissionValid = matchCommValid && sessionCommValid;
    } else if (formData.agentCommissionType === "0") {
      commissionValid = true;
    }
    setIsFormValid(
      allRequiredFilled &&
        coinsValid &&
        passwordValid &&
        matchShareValid &&
        commissionValid,
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "agentCommissionType") {
      const newFormData = { ...formData, [name]: value };

      if (value === "0") {
        newFormData.agentMatchComm = "0";
        newFormData.agentFootballComm = "0";
        newFormData.agentTennisComm = "0";
        newFormData.agentHorseRacingComm = "0";
        newFormData.agentGreyhoundRacingComm = "0";
        newFormData.agentPoliticsComm = "0";
        newFormData.agentCasinoComm = "0";
        newFormData.agentSessionComm = "0";
        newFormData.agentMatkaComm = "0";
      }
      setFormData(newFormData);
      return;
    }
    if (name === "coins") {
      const myCoins = parseFloat(formData.myCoins) || 0;
      const inputValue = parseFloat(value) || 0;
      if (inputValue > myCoins) {
        setErrors((prev) => ({
          ...prev,
          [name]: `Cannot assign more than ${myCoins} coins`,
        }));
        setFormData((prev) => ({ ...prev, [name]: value }));
        return;
      }

      if (inputValue < 0) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Coins cannot be negative",
        }));
        setFormData((prev) => ({ ...prev, [name]: value }));
        return;
      }
    }

    if (name === "agentMatchShare") {
      const myMatchShare = parseFloat(formData.myMatchShare) || 0;
      const inputValue = parseFloat(value) || 0;

      if (inputValue > myMatchShare) {
        setErrors((prev) => ({
          ...prev,
          [name]: `Cannot exceed ${myMatchShare}%`,
        }));
        setFormData((prev) => ({ ...prev, [name]: value }));
        return;
      }

      if (inputValue < 0) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Match share cannot be negative",
        }));
        setFormData((prev) => ({ ...prev, [name]: value }));
        return;
      }
    }

    // Set form data
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Generate new password
  const handleGeneratePassword = () => {
    setFormData((prev) => ({
      ...prev,
      password: generatePassword(),
    }));
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
    toast.info("New password generated!");
  };

  // ✅ Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validate required fields
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // Validate coins
    const coins = parseFloat(formData.coins);
    const myCoins = parseFloat(formData.myCoins) || 0;

    if (!formData.coins || isNaN(coins) || coins <= 0) {
      newErrors.coins = "Please enter valid coins";
      isValid = false;
    } else if (coins > myCoins) {
      newErrors.coins = `Cannot assign more than ${myCoins} coins`;
      isValid = false;
    }

    // Validate agent match share
    const agentMatchShare = parseFloat(formData.agentMatchShare);
    const myMatchShare = parseFloat(formData.myMatchShare) || 0;

    if (
      !formData.agentMatchShare ||
      isNaN(agentMatchShare) ||
      agentMatchShare < 0
    ) {
      newErrors.agentMatchShare = "Please enter valid match share";
      isValid = false;
    } else if (agentMatchShare > myMatchShare) {
      newErrors.agentMatchShare = `Cannot exceed ${myMatchShare}%`;
      isValid = false;
    }

    // Validate agent commission type
    if (!formData.agentCommissionType) {
      newErrors.agentCommissionType = "Please select commission type";
      isValid = false;
    }

    // Validate password format
    const passwordRegex = /^[A-Z]{2}[0-9]{4}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 2 capital letters followed by 4 digits";
      isValid = false;
    }

    // Validate agent commission fields if bet_by_bet is selected
    if (formData.agentCommissionType === "1") {
      const agentMatchComm = parseFloat(formData.agentMatchComm);
      const agentSessionComm = parseFloat(formData.agentSessionComm);
      const myMatchComm = parseFloat(formData.myMatchComm) || 0;
      const mySessionComm = parseFloat(formData.mySessionComm) || 0;

      if (isNaN(agentMatchComm) || agentMatchComm < 0) {
        newErrors.agentMatchComm = "Please enter valid match commission";
        isValid = false;
      } else if (agentMatchComm > myMatchComm) {
        newErrors.agentMatchComm = `Cannot exceed ${myMatchComm}%`;
        isValid = false;
      }

      if (isNaN(agentSessionComm) || agentSessionComm < 0) {
        newErrors.agentSessionComm = "Please enter valid session commission";
        isValid = false;
      } else if (agentSessionComm > mySessionComm) {
        newErrors.agentSessionComm = `Cannot exceed ${mySessionComm}%`;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };
  const resetForm = () => {
    setFormData((prev) => ({
      name: "",
      super_admin_id: prev.super_admin_id,
      master_admin_id: prev.master_admin_id,
      admin_id: prev.admin_id,
      username: prev.username,
      coins: "",
      password: generatePassword(),
      myCoins: prev.myCoins,
      myMatchShare: prev.myMatchShare,
      agentMatchShare: "",
      myCommissionType: prev.myCommissionType,
      agentCommissionType: "",
      myMatchComm: prev.myMatchComm,
      agentMatchComm: "",
      mySessionComm: prev.mySessionComm,
      agentSessionComm: "",
      myCasinoComm: prev.myCasinoComm,
      myMatkaComm: prev.myMatkaComm,
      agentMatkaComm: "",

      // Cricket
      myMatchComm: prev.myMatchComm,
      agentMatchComm: "",

      // Football
      myFootballComm: prev.myFootballComm,
      agentFootballComm: "",

      // Tennis
      myTennisComm: prev.myTennisComm,
      agentTennisComm: "",

      // Horse Racing
      myHorseRacingComm: prev.myHorseRacingComm,
      agentHorseRacingComm: "",

      // Greyhound Racing
      myGreyhoundRacingComm: prev.myGreyhoundRacingComm,
      agentGreyhoundRacingComm: "",

      // Politics
      myPoliticsComm: prev.myPoliticsComm,
      agentPoliticsComm: "",

      // Casino
      myCasinoComm: prev.myCasinoComm,
      agentCasinoComm: "",

      // Session
      mySessionComm: prev.mySessionComm,
      agentSessionComm: "",
    }));
    setErrors({});
    setValidated(false);
    setIsFormValid(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);

    // Check if form is valid
    if (!isFormValid) {
      toast.error("Please fill all required fields correctly");
      validateForm(); // Show errors
      return;
    }
    if (parseInt(formData.coins) > parseInt(formData.myCoins)) {
      toast.error("You cannot assign more coins than you have");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        password: formData.password,
        super_admin_id: formData.super_admin_id,
        reference: formData.reference,
        // admin_id: formData.admin_id,
        master_admin_id: formData.admin_id,
        coins: parseInt(formData.coins) || 0,
        match_share: parseFloat(formData.agentMatchShare) || 0,
        commission_type: formData.agentCommissionType,
        //match_comm: parseFloat(formData.agentMatchComm) || 0,

        football_comm:
          formData.agentCommissionType === "0"
            ? 0
            : parseFloat(formData.agentFootballComm) || 0,

        tennis_comm:
          formData.agentCommissionType === "0"
            ? 0
            : parseFloat(formData.agentTennisComm) || 0,

        horse_racing_comm:
          formData.agentCommissionType === "0"
            ? 0
            : parseFloat(formData.agentHorseRacingComm) || 0,

        greyhound_racing_comm:
          formData.agentCommissionType === "0"
            ? 0
            : parseFloat(formData.agentGreyhoundRacingComm) || 0,

        politics_comm:
          formData.agentCommissionType === "0"
            ? 0
            : parseFloat(formData.agentPoliticsComm) || 0,

        casino_comm:
          formData.agentCommissionType === "0"
            ? 0
            : parseFloat(formData.agentCasinoComm) || 0,

        //session_comm: parseFloat(formData.agentSessionComm) || 0,
        match_comm:
          formData.agentCommissionType === "0"
            ? 0
            : parseFloat(formData.agentMatchComm) || 0,
        session_comm:
          formData.agentCommissionType === "0"
            ? 0
            : parseFloat(formData.agentSessionComm) || 0,
        matka_comm: parseFloat(formData.agentMatkaComm) || 0,
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-super-agent-admin`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (res.data.success) {
        // toast.success(res.data.message, {
        //     position: "top-right",
        //     autoClose: 500,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        // });

        resetForm();

        navigate("/agent_lists");
      }
      //  else {
      //     toast.error(res.data.message);
      // }
    } catch (err) {
      console.error("ERROR:", err);
      const errorMessage = err?.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePercentageChange = (e) => {
    const { name, value } = e.target;

    // allow empty
    if (value === "") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // only number + decimal
    if (!/^\d*\.?\d*$/.test(value)) return;

    const numValue = parseFloat(value);

    // ❌ 100 se zyada nahi
    if (numValue > 100) {
      setErrors((prev) => ({ ...prev, [name]: "Value cannot exceed 100%" }));
      return;
    }

    // ✅ API limit check
    let maxAllowed = 100;

    if (name === "agentMatchShare") {
      maxAllowed = parseFloat(formData.myMatchShare) || 0;
    }
    if (name === "agentMatchComm") {
      maxAllowed = parseFloat(formData.myMatchComm) || 0;
    }
    if (name === "agentSessionComm") {
      maxAllowed = parseFloat(formData.mySessionComm) || 0;
    }

    if (numValue > maxAllowed) {
      setErrors((prev) => ({
        ...prev,
        [name]: `Cannot exceed ${maxAllowed}%`,
      }));
      return;
    }

    // ✅ all good
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ IMPROVED blockInvalidKeys function:
  const blockInvalidKeys = (e) => {
    // Only block these keys for percentage fields
    const percentageFields = [
      "agentMatchShare",
      "agentMatchComm",
      "agentSessionComm",
      "agentMatkaComm",
    ];

    if (percentageFields.includes(e.target.name)) {
      const currentValue = e.target.value;
      const newValue = currentValue + e.key;
      if (!isNaN(newValue) && parseFloat(newValue) > 100) {
        e.preventDefault();
        return;
      }
      // Allow: numbers, backspace, delete, tab, arrow keys, decimal point (only one)
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ];

      // Check if key is a number
      if (e.key >= "0" && e.key <= "9") {
        return; // Allow numbers
      }

      // Allow decimal point but only one
      if (e.key === "." && !e.target.value.includes(".")) {
        return; // Allow first decimal point
      }

      // Check if it's an allowed special key
      if (allowedKeys.includes(e.key)) {
        return; // Allow special keys
      }

      // Block everything else
      e.preventDefault();
    }
  };

  const handleRatioChange = (e) => {
    const { name, value } = e.target;

    // Empty allow
    if (value === "") {
      setFormData((prev) => ({
        ...prev,
        [name]: "",
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
      return;
    }

    // Only numbers
    if (!/^\d*$/.test(value)) return;

    const inputValue = Number(value);

    let maxAllowed = 0;

    switch (name) {
      case "agentMatchComm":
        maxAllowed = Number(formData.myMatchComm) || 0;
        break;

      case "agentFootballComm":
        maxAllowed = Number(formData.myFootballComm) || 0;
        break;

      case "agentTennisComm":
        maxAllowed = Number(formData.myTennisComm) || 0;
        break;

      case "agentHorseRacingComm":
        maxAllowed = Number(formData.myHorseRacingComm) || 0;
        break;

      case "agentGreyhoundRacingComm":
        maxAllowed = Number(formData.myGreyhoundRacingComm) || 0;
        break;

      case "agentPoliticsComm":
        maxAllowed = Number(formData.myPoliticsComm) || 0;
        break;

      case "agentCasinoComm":
        maxAllowed = Number(formData.myCasinoComm) || 0;
        break;

      case "agentSessionComm":
        maxAllowed = Number(formData.mySessionComm) || 0;
        break;

      case "agentMatkaComm":
        maxAllowed = Number(formData.myMatkaComm) || 0;
        break;

      default:
        maxAllowed = 100;
    }

    if (inputValue < 0) return;

    if (inputValue > maxAllowed) {
      setErrors((prev) => ({
        ...prev,
        [name]: `Maximum allowed is ${maxAllowed}`,
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="card">
        <div className="card-header bg-primary-yellow p-2 text-white d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Create Super Agent</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Back
            </button>
          </div>
        </div>
        <div className="card-body">
          <form
            noValidate
            className={`needs-validation ${validated ? "was-validated" : ""}`}
            onSubmit={handleSubmit}
          >
            <div className="row">
              {/* Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <div className="invalid-feedback d-block">{errors.name}</div>
                )}
                {validated && !formData.name.trim() && (
                  <div className="invalid-feedback">Name is required</div>
                )}
              </div>

              {/* Super Admin ID (Read-only from API) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">PARENT</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username || "Loading..."}
                  readOnly
                  style={{ backgroundColor: "#f8f9fa" }}
                  disabled={isSubmitting}
                />
                {/* <small className="text-muted">Current Super Agent ID: {formData.admin_id}</small> */}
              </div>

              {/* My Total Balance */}
              <div className="col-md-6 mb-3">
                <label className="form-label">My Total Balance</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    value={formData.myCoins}
                    disabled
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                  <span className="input-group-text bg-success text-white">
                    <i className="fas fa-coins"></i>
                  </span>
                </div>
                {/* {adminData && (
                                    <small className="text-muted">
                                        Your current balance: {adminData.amount}
                                    </small>
                                )} */}
              </div>

              {/* Coins to Assign */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Coins to Assign <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.coins ? "is-invalid" : ""}`}
                  name="coins"
                  value={formData.coins}
                  onChange={handleChange}
                  onKeyDown={blockInvalidKeys}
                  min="0"
                  max={formData.myCoins}
                  // onKeyDown={(e) => {
                  //     if (Number(e.target.value + e.key) > Number(formData.myCoins)) {
                  //         e.preventDefault();
                  //     }
                  // }}
                  required
                  disabled={isSubmitting}
                />
                {errors.coins && (
                  <div className="invalid-feedback d-block">{errors.coins}</div>
                )}
                {validated && !formData.coins && (
                  <div className="invalid-feedback">
                    Please enter valid coins
                  </div>
                )}
                <small className="text-muted">
                  Maximum you can assign: {formData.myCoins}
                </small>
              </div>

              {/* ✅ Password show + editable */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    pattern="[A-Z]{2}[0-9]{4}"
                    title="Format: 2 capital letters followed by 4 digits"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleGeneratePassword}
                    disabled={isSubmitting}
                  > Generate
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
                {validated &&
                  !formData.password.match(/^[A-Z]{2}[0-9]{4}$/) && (
                    <div className="invalid-feedback">
                      Format: 2 capital letters + 4 digits
                    </div>
                  )}
                {/* <small className="text-muted">Format: 2 capital letters + 4 digits</small> */}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Reference</label>
                <input
                  type="text"
                  name="reference"
                  className="form-control"
                  value={formData.reference || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ backgroundColor: "#fff" }}
                />
              </div>

              {/* Divider */}
              <div className="col-12 my-3">
                <h5 className="border-bottom pb-2">Match & Share Info</h5>
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Company Share (%)</label>
                <input
                  type="text"
                  className="form-control"
                  name="companyShare"
                  value={formData.companyShare || ""}
                  onKeyDown={blockInvalidKeys}
                  readOnly
                  disabled
                />
              </div>
              {/* My Match Share (From API) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">My Share (%)</label>
                <input
                  type="text"
                  className="form-control"
                  onKeyDown={blockInvalidKeys}
                  value={formData.myMatchShare}
                  disabled
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Agent Match Share */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  {" "}
                  Super Agent Match Share (%){" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.agentMatchShare ? "is-invalid" : ""}`}
                  name="agentMatchShare"
                  value={formData.agentMatchShare}
                  // onChange={handleChange}
                  onChange={handlePercentageChange}
                  onKeyDown={blockInvalidKeys}
                  min="0"
                  max={formData.myMatchShare}
                  step="0.01"
                  required
                  disabled={isSubmitting}
                />
                {errors.agentMatchShare && (
                  <div className="invalid-feedback d-block">
                    {errors.agentMatchShare}
                  </div>
                )}
                {validated && !formData.agentMatchShare && (
                  <div className="invalid-feedback">
                    Please enter agent match share
                  </div>
                )}
              </div>

              {/* My Commission Type (From API) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">My Commission Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={
                    formData.myCommissionType === "bet_by_bet"
                      ? "Bet By Bet"
                      : "Match Commission"
                  }
                  disabled
                  style={{ backgroundColor: "#f8f9fa" }}
                />
              </div>

              {/* Agent Commission Type */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Agent Commission Type <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.agentCommissionType ? "is-invalid" : ""}`}
                  name="agentCommissionType"
                  value={formData.agentCommissionType}
                  onKeyDown={blockInvalidKeys}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select</option>
                  <option value="1">Bet By Bet</option>
                  <option value="0">No Match Commission</option>
                </select>
                {errors.agentCommissionType && (
                  <div className="invalid-feedback d-block">
                    {errors.agentCommissionType}
                  </div>
                )}
                {validated && !formData.agentCommissionType && (
                  <div className="invalid-feedback">
                    Please select commission type
                  </div>
                )}
              </div>

              {/* My Match Comm (From API) */}
              {/* <div className="col-md-6 mb-3">
                                <label className="form-label">My Match Comm (%)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.myMatchComm}
                                    onKeyDown={blockInvalidKeys}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div> */}

              {/* Agent Match Comm */}
              {/* <div className="col-md-6 mb-3">
                                <label className="form-label"> Super Agent Match Comm (%)</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.agentMatchComm ? 'is-invalid' : ''}`}
                                    name="agentMatchComm"
                                    value={formData.agentMatchComm} */}
              {/* onChange={handleChange}*/}
              {/* onChange={handlePercentageChange}
                                    onKeyDown={blockInvalidKeys}
                                    min="0"
                                    max={formData.myMatchComm}
                                    step="0.01"
                                    disabled={formData.agentCommissionType === "0" || isSubmitting}
                                />
                                {errors.agentMatchComm && (
                                    <div className="invalid-feedback d-block">{errors.agentMatchComm}</div>
                                )}
                                {formData.agentCommissionType === "0" && (
                                    <small className="text-muted text-warning">
                                        Disabled for Match Commission type
                                    </small>
                                )}
                            </div> */}

              {/* My Session Comm (From API) */}
              {/* <div className="col-md-6 mb-3">
                                <label className="form-label">My Session Comm (%)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    onKeyDown={blockInvalidKeys}
                                    value={formData.mySessionComm}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div> */}

              {/* Agent Session Comm */}
              {/* <div className="col-md-6 mb-3">
                                <label className="form-label">Agent Session Comm (%)</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.agentSessionComm ? 'is-invalid' : ''}`}
                                    name="agentSessionComm"
                                    value={formData.agentSessionComm}
                                    onKeyDown={blockInvalidKeys}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.mySessionComm}
                                    step="0.01"
                                    disabled={formData.agentCommissionType === "0" || isSubmitting}
                                />
                                {errors.agentSessionComm && (
                                    <div className="invalid-feedback d-block">{errors.agentSessionComm}</div>
                                )}
                                {formData.agentCommissionType === "0" && (
                                    <small className="text-muted text-warning">
                                        Disabled for Match Commission type
                                    </small>
                                )}
                            </div> */}

              <div className="col-md-12 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <label className="fw-bold mb-0">RATIO (CRICKET) :</label>

                  <small className="fw-bold">
                    AVAILABLE PARTNERSHIP: {formData.myMatchComm}
                  </small>
                </div>

                <div className="row">
                  {/* Left Input */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control ${errors.agentMatchComm ? "is-invalid" : ""}`}
                      name="agentMatchComm"
                      value={formData.agentMatchComm}
                      onChange={handleRatioChange}
                      min="0"
                      max={Number(formData.myMatchComm) - 1}
                      disabled={
                        formData.agentCommissionType === "0" || isSubmitting
                      }
                    />

                    {errors.agentMatchComm && (
                      <div className="invalid-feedback d-block">
                        {errors.agentMatchComm}
                      </div>
                    )}
                  </div>

                  {/* Right Input */}
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.myMatchComm}
                      disabled
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <label className="fw-bold mb-0">RATIO (Session) :</label>

                  <small className="fw-bold">
                    AVAILABLE PARTNERSHIP: {formData.mySessionComm}
                  </small>
                </div>

                <div className="row">
                  {/* Left Input */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control ${errors.agentSessionComm ? "is-invalid" : ""}`}
                      name="agentSessionComm"
                      value={formData.agentSessionComm}
                      onChange={handleRatioChange}
                      min="0"
                      max={Number(formData.mySessionComm) - 1}
                      disabled={
                        formData.agentCommissionType === "0" || isSubmitting
                      }
                    />

                    {errors.agentMatchComm && (
                      <div className="invalid-feedback d-block">
                        {errors.agentSessionComm}
                      </div>
                    )}
                  </div>

                  {/* Right Input */}
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.mySessionComm}
                      disabled
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <label className="fw-bold mb-0">Ratio (Football) :</label>
                  <small className="fw-bold">
                    AVAILABLE PARTNERSHIP: {formData.myFootballComm}
                  </small>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control ${errors.agentFootballComm ? "is-invalid" : ""}`}
                      name="agentFootballComm"
                      value={formData.agentFootballComm}
                      onChange={handleRatioChange}
                      min="0"
                      max={Number(formData.mySessionComm) - 1}
                      disabled={
                        formData.agentCommissionType === "0" || isSubmitting
                      }
                    />
                    {errors.agentFootballComm && (
                      <div className="invalid-feedback d-block">
                        {errors.myFootballComm}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.myFootballComm}
                      disabled
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <label className="fw-bold mb-0">Ratio (Tennis) :</label>
                  <small className="fw-bold">
                    AVAILABLE PARTNERSHIP: {formData.myTennisComm}
                  </small>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control ${errors.agentTennisComm ? "is-invalid" : ""}`}
                      name="agentTennisComm"
                      value={formData.agentTennisComm}
                      onChange={handleRatioChange}
                      min="0"
                      max={Number(formData.mySessionComm) - 1}
                      disabled={
                        formData.agentCommissionType === "0" || isSubmitting
                      }
                    />
                    {errors.agentTennisComm && (
                      <div className="invalid-feedback d-block">
                        {errors.myTennisComm}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.myTennisComm}
                      disabled
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <label className="fw-bold mb-0">Ratio (Horse Racing) :</label>
                  <small className="fw-bold">
                    AVAILABLE PARTNERSHIP: {formData.myHorseRacingComm}
                  </small>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control ${errors.agentHorseRacingComm ? "is-invalid" : ""}`}
                      name="agentHorseRacingComm"
                      value={formData.agentHorseRacingComm}
                      onChange={handleRatioChange}
                      min="0"
                      max={Number(formData.mySessionComm) - 1}
                      disabled={
                        formData.agentCommissionType === "0" || isSubmitting
                      }
                    />
                    {errors.agentHorseRacingComm && (
                      <div className="invalid-feedback d-block">
                        {errors.myHorseRacingComm}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.myHorseRacingComm}
                      disabled
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <label className="fw-bold mb-0">
                    Ratio (Greyhound Racing) :
                  </label>
                  <small className="fw-bold">
                    AVAILABLE PARTNERSHIP: {formData.myGreyhoundRacingComm}
                  </small>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control ${errors.agentGreyhoundRacingComm ? "is-invalid" : ""}`}
                      name="agentGreyhoundRacingComm"
                      value={formData.agentGreyhoundRacingComm}
                      onChange={handleRatioChange}
                      min="0"
                      max={Number(formData.mySessionComm) - 1}
                      disabled={
                        formData.agentCommissionType === "0" || isSubmitting
                      }
                    />
                    {errors.agentGreyhoundRacingComm && (
                      <div className="invalid-feedback d-block">
                        {errors.myGreyhoundRacingComm}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.myGreyhoundRacingComm}
                      disabled
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <label className="fw-bold mb-0">Ratio (Politics) :</label>
                  <small className="fw-bold">
                    AVAILABLE PARTNERSHIP: {formData.myPoliticsComm}
                  </small>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control ${errors.agentPoliticsComm ? "is-invalid" : ""}`}
                      name="agentPoliticsComm"
                      value={formData.agentPoliticsComm}
                      onChange={handleRatioChange}
                      min="0"
                      max={Number(formData.mySessionComm) - 1}
                      disabled={
                        formData.agentCommissionType === "0" || isSubmitting
                      }
                    />
                    {errors.agentPoliticsComm && (
                      <div className="invalid-feedback d-block">
                        {errors.myPoliticsComm}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.myPoliticsComm}
                      disabled
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <label className="fw-bold mb-0">Ratio (Casino) :</label>
                  <small className="fw-bold">
                    AVAILABLE PARTNERSHIP: {formData.myCasinoComm}
                  </small>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className={`form-control ${errors.agentCasinoComm ? "is-invalid" : ""}`}
                      name="agentCasinoComm"
                      value={formData.agentCasinoComm}
                      onChange={handleRatioChange}
                      min="0"
                      max={Number(formData.mySessionComm) - 1}
                      disabled={
                        formData.agentCommissionType === "0" || isSubmitting
                      }
                    />
                    {errors.agentCasinoComm && (
                      <div className="invalid-feedback d-block">
                        {errors.myCasinoComm}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.myCasinoComm}
                      disabled
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-12 text-center mt-4">
                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-success px-5"
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
                {/* {!isFormValid && (
                                    <div className="text-danger mt-2">
                                        <small>Please fill all required fields (*) correctly to enable submit button</small>
                                    </div>
                                )} */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSuperAgentAdmin;
