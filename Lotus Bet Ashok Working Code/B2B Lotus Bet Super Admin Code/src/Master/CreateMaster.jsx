// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { IoCreateSharp } from "react-icons/io5";
// import Loader from "../Common/Loader";

// const CreateSuperAgentAdmin = () => {
//   const [validated, setValidated] = useState(false);
//   const navigate = useNavigate();
//   const [adminData, setAdminData] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);

//   const token = localStorage.getItem("token");

//   const generatePassword = () => {
//     const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//     const numbers = "0123456789";
//     let pass = "";
//     pass += letters[Math.floor(Math.random() * letters.length)];
//     pass += letters[Math.floor(Math.random() * letters.length)];
//     for (let i = 0; i < 4; i++) {
//       pass += numbers[Math.floor(Math.random() * numbers.length)];
//     }
//     return pass;
//   };
//   // const [formData, setFormData] = useState({
//   //   name: "",
//   //   super_admin_id: "",
//   //   admin_id: "",
//   //   coins: "",
//   //   password: "",
//   //   myCoins: "",
//   //   myMatchShare: "",
//   //   agentMatchShare: "",
//   //   myCommissionType: "bet_by_bet",
//   //   agentCommissionType: "",
//   //   myMatchComm: "",
//   //   agentMatchComm: "",
//   //   mySessionComm: "",
//   //   agentSessionComm: "",
//   //   myCasinoComm: "",
//   //   myMatkaComm: "",
//   //   agentMatkaComm: "",
//   //   reference: "",
//   //   // companyShare: ""
//   // });

//   const [formData, setFormData] = useState({
//     name: "",
//     super_admin_id: "",
//     admin_id: "",
//     coins: "",
//     password: "",
//     myCoins: "",
//     myMatchShare: "",
//     agentMatchShare: "",
//     myCommissionType: "bet_by_bet",
//     agentCommissionType: "",
//     myMatchComm: "",
//     agentMatchComm: "",
//     mySessionComm: "",
//     agentSessionComm: "",
//     myCasinoComm: "",
//     agentCasinoComm: "",
//     myMatkaComm: "",
//     agentMatkaComm: "",
//     reference: "",
//     // Ye fields add karein agar nahi hain toh
//     myFootballComm: "",
//     agentFootballComm: "",
//     myTennisComm: "",
//     agentTennisComm: "",
//     myHorseRacingComm: "",
//     agentHorseRacingComm: "",
//     myGreyhoundRacingComm: "",
//     agentGreyhoundRacingComm: "",
//     myPoliticsComm: "",
//     agentPoliticsComm: "",
//   });

//   useEffect(() => {
//     const fetchAdminData = async () => {
//       const admin_id = localStorage.getItem("admin_id");
//       const role = localStorage.getItem("role");
//       try {
//         const response = await axios.post(
//           `${process.env.REACT_APP_API_URL}/get-data`,
//           {
//             role: role,
//             admin_id: admin_id,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           },
//         );

//         if (response.data.success) {
//           const adminProfile = response.data.data.admin_profile;
//           setAdminData(adminProfile);

//           setFormData((prev) => ({
//             ...prev,
//             super_admin_id: adminProfile.super_admin_id,
//             username: adminProfile.username,
//             master_admin_id: adminProfile.admin_id,
//             myCoins: adminProfile.coins || "0",
//             myMatchShare: adminProfile.match_share || "0",
//             myCommissionType:
//               adminProfile.commission_type === "1"
//                 ? "bet_by_bet"
//                 : adminProfile.commission_type === "2"
//                   ? "match_comm"
//                   : "bet_by_bet",
//             myMatchComm: adminProfile.match_comm || "0",
//             mySessionComm: adminProfile.session_comm || "0",
//             myCasinoComm: adminProfile.casino_comm || "0",
//             myMatkaComm: adminProfile.matka_comm || "0",
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching admin data:", error);
//         toast.error("Failed to load admin data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchAdminData();
//     } else {
//       toast.error("Authentication token not found");
//       navigate("/login");
//     }
//   }, [token, navigate]);
//   useEffect(() => {
//     const checkFormValidity = () => {
//       const passwordRegex = /^[A-Z]{2}[0-9]{4}$/;
//       const coins = parseFloat(formData.coins);
//       const myCoins = parseFloat(formData.myCoins) || 0;
//       const valid =
//         formData.name.trim() !== "" &&
//         formData.coins !== "" &&
//         !isNaN(coins) &&
//         coins > 0 &&
//         coins <= myCoins &&
//         formData.agentCommissionType !== "" &&
//         // passwordRegex.test(formData.password);
//         formData.password.trim() !== "";  // ✅ Sirf empty check karo

//       setIsFormValid(valid);
//     };

//     checkFormValidity();
//   }, [formData]);
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       // password: generatePassword(),
//       password: "",
//     }));
//   }, []);
//   const allowOnlyNumbers = (e) => {
//     const key = e.key;
//     const allowedKeys = [
//       "Backspace",
//       "Delete",
//       "ArrowLeft",
//       "ArrowRight",
//       "Tab",
//     ];
//     if (!/^[0-9]$/.test(key) && !allowedKeys.includes(key)) {
//       e.preventDefault();
//     }
//   };

//   useEffect(() => {
//     if (formData.agentCommissionType === "0") {
//       // No Match Commission selected
//       setFormData((prev) => ({
//         ...prev,
//         agentMatchComm: "0",
//         agentSessionComm: "0",
//         agentFootballComm: "0",
//         agentTennisComm: "0",
//         agentHorseRacingComm: "0",
//         agentGreyhoundRacingComm: "0",
//         agentPoliticsComm: "0",
//         agentCasinoComm: "0",
//         agentMatkaComm: "0",
//       }));

//       // Errors bhi clear kar do
//       setErrors((prev) => ({
//         ...prev,
//         agentMatchComm: "",
//         agentSessionComm: "",
//         agentFootballComm: "",
//         agentTennisComm: "",
//         agentHorseRacingComm: "",
//         agentGreyhoundRacingComm: "",
//         agentPoliticsComm: "",
//         agentCasinoComm: "",
//         agentMatkaComm: "",
//       }));
//     }
//   }, [formData.agentCommissionType]);

//   // const handleChange = (e) => {
//   //     const { name, value } = e.target;

//   //     if (errors[name]) {
//   //         setErrors(prev => ({ ...prev, [name]: "" }));
//   //     }

//   //     setFormData({ ...formData, [name]: value });
//   // };

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;

//   //   if (errors[name]) {
//   //     setErrors((prev) => ({ ...prev, [name]: "" }));
//   //   }
//   //   if (name === "coins") {
//   //     if (!/^\d*$/.test(value)) return;
//   //     if (value === "") {
//   //       setFormData((prev) => ({ ...prev, coins: "" }));
//   //       return;
//   //     }
//   //     const assignCoins = Number(value);
//   //     const myCoins = Number(formData.myCoins);

//   //     if (assignCoins <= 0) {
//   //       setErrors((prev) => ({
//   //         ...prev,
//   //         coins: "Coins must be greater than 0",
//   //       }));
//   //       return;
//   //     }

//   //     if (assignCoins > myCoins) {
//   //       setErrors((prev) => ({
//   //         ...prev,
//   //         coins: `You can assign maximum ${myCoins} coins`,
//   //       }));
//   //       return;
//   //     }
//   //   }

//   //   setFormData((prev) => ({
//   //     ...prev,
//   //     [name]: value,
//   //   }));
//   // };


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//     if (name === "coins") {
//       if (!/^\d*$/.test(value)) return;
//       if (value === "") {
//         setFormData((prev) => ({ ...prev, coins: "" }));
//         return;
//       }
//       const assignCoins = Number(value);
//       const myCoins = Number(formData.myCoins);
//       if (assignCoins <= 0) {
//         setErrors((prev) => ({
//           ...prev,
//           coins: "Coins must be greater than 0",
//         }));
//         return;
//       }
//       if (assignCoins > myCoins) {
//         setErrors((prev) => ({
//           ...prev,
//           coins: `You can assign maximum ${myCoins} coins`,
//         }));
//         return;
//       }
//     }
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };


//   const handlePercentageChange = (e) => {
//     const { name, value } = e.target;
//     if (!/^\d*$/.test(value)) return;
//     const numValue = Number(value);
//     if (numValue < 0 || numValue > 100) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "Value must be between 0 and 100",
//       }));
//       return;
//     }
//     setErrors((prev) => ({ ...prev, [name]: "" }));

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const blockInvalidKeys = (e) => {
//     const key = e.key;
//     const allowedKeys = [
//       "Backspace",
//       "Delete",
//       "ArrowLeft",
//       "ArrowRight",
//       "Tab",
//     ];
//     if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
//       e.preventDefault();
//     }
//   };
//   const handleGeneratePassword = () => {
//     setFormData((prev) => ({
//       ...prev,
//       password: generatePassword(),
//     }));
//     if (errors.password) {
//       setErrors((prev) => ({ ...prev, password: "" }));
//     }
//     toast.info("New password generated!");
//   };
//   const validateForm = () => {
//     const newErrors = {};
//     let isValid = true;
//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required";
//       isValid = false;
//     }

//     // if (!formData.companyShare) {
//     //     newErrors.companyShare = "Company share is required";
//     //     isValid = false;
//     // }

//     // Validate coins
//     const coins = parseFloat(formData.coins);
//     const myCoins = parseFloat(formData.myCoins) || 0;

//     if (!formData.coins || isNaN(coins) || coins <= 0) {
//       newErrors.coins = "Please enter valid coins coins";
//       isValid = false;
//     } else if (coins > myCoins) {
//       newErrors.coins = `Cannot assign more than ${myCoins} coins`;
//       isValid = false;
//     }

//     if (!formData.agentCommissionType) {
//       newErrors.agentCommissionType = "Please select commission type";
//       isValid = false;
//     }

//     // Validate password format
//     const passwordRegex = /^[A-Z]{2}[0-9]{4}$/;
//     // if (!passwordRegex.test(formData.password)) {
//     //   newErrors.password =
//     //     "Password must be 2 capital letters followed by 4 digits";
//     //   isValid = false;
//     // }

//     if (!formData.password.trim()) {
//       newErrors.password = "Password is required";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // const resetForm = () => {
//   //     setFormData({
//   //         name: "",
//   //         reference: "",
//   //         super_admin_id: formData.super_admin_id,
//   //         master_admin_id: formData.master_admin_id,
//   //         coins: "",
//   //         password: generatePassword(),
//   //         myCoins: formData.myCoins,
//   //         myMatchShare: formData.myMatchShare,
//   //         agentMatchShare: "",
//   //         myCommissionType: formData.myCommissionType,
//   //         agentCommissionType: "",
//   //         myMatchComm: formData.myMatchComm,
//   //         agentMatchComm: "",
//   //         mySessionComm: formData.mySessionComm,
//   //         agentSessionComm: "",
//   //         myCasinoComm: formData.myCasinoComm,
//   //         myMatkaComm: formData.myMatkaComm,
//   //         agentMatkaComm: "",
//   //         username: formData.username
//   //     });
//   const resetForm = () => {
//     setFormData({
//       name: "",
//       reference: "",
//       super_admin_id: formData.super_admin_id,
//       master_admin_id: formData.master_admin_id,
//       coins: "",
//       password: generatePassword(),
//       myCoins: formData.myCoins,
//       myMatchShare: formData.myMatchShare,
//       agentMatchShare: "",
//       myCommissionType: formData.myCommissionType,
//       agentCommissionType: "",

//       // Cricket
//       myMatchComm: formData.myMatchComm,
//       agentMatchComm: "",

//       // Football
//       myFootballComm: formData.myFootballComm,
//       agentFootballComm: "",

//       // Tennis
//       myTennisComm: formData.myTennisComm,
//       agentTennisComm: "",

//       // Horse Racing
//       myHorseRacingComm: formData.myHorseRacingComm,
//       agentHorseRacingComm: "",

//       // Greyhound Racing
//       myGreyhoundRacingComm: formData.myGreyhoundRacingComm,
//       agentGreyhoundRacingComm: "",

//       // Politics
//       myPoliticsComm: formData.myPoliticsComm,
//       agentPoliticsComm: "",

//       // Casino
//       myCasinoComm: formData.myCasinoComm,
//       agentCasinoComm: "",

//       // Session
//       mySessionComm: formData.mySessionComm,
//       agentSessionComm: "",

//       // Matka
//       myMatkaComm: formData.myMatkaComm,
//       agentMatkaComm: "",

//       username: formData.username,
//     });

//     setErrors({});
//     setValidated(false); // ✅ Reset validated state
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setValidated(true);
//   //   if (!validateForm()) return;
//   //   setIsSubmitting(true);

//   //   try {
//   //     // const payload = {
//   //     //     name: formData.name,
//   //     //     password: formData.password,
//   //     //     admin_id: formData.master_admin_id,
//   //     //     reference: formData.reference,
//   //     //     coins: formData.coins,
//   //     //     match_share: formData.agentMatchShare,
//   //     //     commission_type: formData.agentCommissionType,
//   //     //     match_comm: formData.agentMatchComm,
//   //     //     session_comm: formData.agentSessionComm,
//   //     //     match_comm: formData.agentCommissionType === "0" ? 0 : formData.agentMatchComm,
//   //     //     session_comm: formData.agentCommissionType === "0" ? 0 : formData.agentSessionComm,

//   //     //     //chnages 22-06-2026
//   //     //     football_comm: formData.football_comm,
//   //     //     tennis_comm: formData.tennis_comm,
//   //     //     horse_racing_comm: formData.horse_racing_comm,
//   //     //     greyhound_racing_comm: formData.greyhound_racing_comm,
//   //     //     politics_comm: formData.politics_comm,
//   //     //     casino_comm: formData.casino_comm,
//   //     //     session_comm: formData.session_comm,

//   //     // };

//   //     const payload = {
//   //       name: formData.name,
//   //       password: formData.password,
//   //       admin_id: formData.master_admin_id,
//   //       reference: formData.reference,
//   //       coins: formData.coins,
//   //       match_share: formData.agentMatchShare,
//   //       commission_type: formData.agentCommissionType,

//   //       match_comm:
//   //         formData.agentCommissionType === "0" ? 0 : formData.agentMatchComm,

//   //       football_comm:
//   //         formData.agentCommissionType === "0" ? 0 : formData.agentFootballComm,

//   //       tennis_comm:
//   //         formData.agentCommissionType === "0" ? 0 : formData.agentTennisComm,

//   //       horse_racing_comm:
//   //         formData.agentCommissionType === "0"
//   //           ? 0
//   //           : formData.agentHorseRacingComm,

//   //       greyhound_racing_comm:
//   //         formData.agentCommissionType === "0"
//   //           ? 0
//   //           : formData.agentGreyhoundRacingComm,

//   //       politics_comm:
//   //         formData.agentCommissionType === "0" ? 0 : formData.agentPoliticsComm,

//   //       casino_comm:
//   //         formData.agentCommissionType === "0" ? 0 : formData.agentCasinoComm,

//   //       session_comm:
//   //         formData.agentCommissionType === "0" ? 0 : formData.agentSessionComm,

//   //       matka_comm:
//   //         formData.agentCommissionType === "0" ? 0 : formData.agentMatkaComm,
//   //     };

//   //     const res = await axios.post(
//   //       // `${process.env.REACT_APP_API_URL}/create-master-admin`,
//   //            `${process.env.REACT_APP_API_URL}/create-super-agent-admin`,
//   //       payload,
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       },
//   //     );

//   //     if (res.data.success) {
//   //       toast.success(res.data.message);
//   //       resetForm();
//   //       // setTimeout(() => {
//   //       navigate("/masters_list");
//   //       // }, 800);
//   //     } else {
//   //       toast.error(res.data.message);
//   //     }
//   //   } catch (err) {
//   //     console.log(err);
//   //     const apiMessage =
//   //       err?.response?.data?.message ||
//   //       err?.response?.data?.error ||
//   //       "Server error";

//   //     toast.error(apiMessage);
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setValidated(true);
//     if (!validateForm()) return;
//     setIsSubmitting(true);

//     try {
//       // Payload prepare karte hain
//       const payload = {
//         super_admin_id: formData.super_admin_id || formData.master_admin_id, // Super Admin ID
//         name: formData.name,
//         coins: formData.coins,
//         password: formData.password,
//         match_share: formData.agentMatchShare,
//         commission_type: formData.agentCommissionType,

//         // Match Commissions
//         match_comm:
//           formData.agentCommissionType === "0"
//             ? 0
//             : formData.agentMatchComm || 0,
//         football_comm:
//           formData.agentCommissionType === "0"
//             ? 0
//             : formData.agentFootballComm || 0,
//         tennis_comm:
//           formData.agentCommissionType === "0"
//             ? 0
//             : formData.agentTennisComm || 0,
//         horse_racing_comm:
//           formData.agentCommissionType === "0"
//             ? 0
//             : formData.agentHorseRacingComm || 0,
//         greyhound_racing_comm:
//           formData.agentCommissionType === "0"
//             ? 0
//             : formData.agentGreyhoundRacingComm || 0,
//         politics_comm:
//           formData.agentCommissionType === "0"
//             ? 0
//             : formData.agentPoliticsComm || 0,
//         casino_comm:
//           formData.agentCommissionType === "0"
//             ? 0
//             : formData.agentCasinoComm || 0,
//         session_comm:
//           formData.agentCommissionType === "0"
//             ? 0
//             : formData.agentSessionComm || 0,

//         reference: formData.reference || "",
//       };

//       // API call
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/create-super-agent-admin`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       if (res.data.success) {
//         toast.success(res.data.message);
//         resetForm();
//         //navigate("/masters_list");
//         navigate("/agent_lists");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (err) {
//       console.log(err);
//       const apiMessage =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         "Server error";

//       toast.error(apiMessage);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={500}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />

//       <div className="card">
//         <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
//           <h5 className="card-title mb-0">
//             <IoCreateSharp className="fs-2" /> Create New Super Master
//           </h5>
//           {/* <div className="d-flex gap-2">
//             <button
//               className="btn btn-outline-light"
//               onClick={() => navigate(-1)}
//               disabled={isSubmitting}
//             >
//               Back
//             </button>
//           </div> */}
//         </div>
//         {loading ? (
//           <div className="py-5 table_loader">
//             <Loader />
//           </div>
//         ) : (
//           <div className="card-body">
//             <form
//               noValidate
//               className={`needs-validation ${validated ? "was-validated" : ""}`}
//               onSubmit={handleSubmit}
//             >
//               <div className="row">
//                 {/* Name */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label d-flex align-items-center justify-content-between">
//                     Full Name* <span className="text-danger"></span>{" "}
//                     <small _ngcontent-owm-c76="">
//                       [A-Z , a-z , 0-9 , @ ] Allowed
//                     </small>
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.name ? "is-invalid" : ""}`}
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     disabled={isSubmitting}
//                   />
//                   {errors.name && (
//                     <div className="invalid-feedback d-block">
//                       {errors.name}
//                     </div>
//                   )}
//                   {validated && !formData.name.trim() && (
//                     <div className="invalid-feedback"></div>
//                   )}
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Reference</label>
//                   <input
//                     type="text"
//                     name="reference"
//                     className="form-control"
//                     value={formData.reference || ""}
//                     onChange={handleChange}
//                     disabled={isSubmitting}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Super Admin ID</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={formData.username}
//                     readOnly
//                     disabled={isSubmitting}
//                   />
//                   {/* <small className="text-muted">Super Admin ID</small> */}
//                 </div>

//                 {/* My Total Balance */}
//                 {/* <div className="col-md-6 mb-3">
//                                 <label className="form-label">My Total Balance</label>
//                                 <div className="input-group">
//                                     <input
//                                         type="number"
//                                         className="form-control"
//                                         value={formData.myCoins}
//                                         disabled
//                                         style={{ backgroundColor: "#f8f9fa" }}
//                                     />
//                                     <span className="input-group-text bg-success text-white">
//                                         <i className="fas fa-coins"></i>
//                                     </span>
//                                 </div>
//                                 {adminData && (
//                                     <small className="text-muted">
//                                         Your current balance: {adminData.amount}
//                                     </small>
//                                 )}
//                             </div> */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Coins to Assign <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.coins ? "is-invalid" : ""}`}
//                     name="coins"
//                     value={formData.coins}
//                     onChange={handleChange}
//                     max={formData.myCoins}
//                     required
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 {errors.coins && (
//                   <div className="invalid-feedback d-block">{errors.coins}</div>
//                 )}

//                 {/* ✅ Password show + editable */}
//                 {/* <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Password <span className="text-danger">*</span>
//                   </label>
//                   <div className="input-group">
//                     <input
//                       type="text"
//                       className={`form-control ${errors.password ? "is-invalid" : ""}`}
//                       name="password"
//                       value={formData.password}
//                       onKeyDown={blockInvalidKeys}
//                       onChange={handleChange}
//                       required
//                       pattern="[A-Z]{2}[0-9]{4}"
//                       title="Format: 2 capital letters followed by 4 digits"
//                       disabled={isSubmitting}
//                     readOnly
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-secondary generate_btn"
//                       onClick={handleGeneratePassword}
//                       disabled={isSubmitting}
//                     >
//                       {" "}
//                       Generate
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <div className="invalid-feedback d-block">
//                       {errors.password}
//                     </div>
//                   )}
//                   {validated &&
//                     !formData.password.match(/^[A-Z]{2}[0-9]{4}$/) && (
//                       <div className="invalid-feedback">
//                         Format: 2 capital letters + 4 digits
//                       </div>
//                     )}
//                 </div> */}

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Password <span className="text-danger">*</span>
//                   </label>
//                   <div className="input-group">
//                     <input style={{ borderRight: '0' }}
//                       type={showPassword ? "text" : "password"}
//                       className={`form-control ${errors.password ? "is-invalid" : ""}`}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       required
//                       disabled={isSubmitting}
//                     />
//                     {/* <button
//                       type="button"
//                       className="btn btn-outline-secondary"
//                       onClick={() => setShowPassword(!showPassword)}
//                       disabled={isSubmitting}
//                       style={{ border: "1px solid #ced4da" }}
//                     >
//                       {showPassword ? "🙈" : "👁️"}
//                     </button> */}

//                     <button
//                       type="button"
//                       className="btn btn-outline-secondary"
//                       onClick={() => setShowPassword(!showPassword)}
//                       disabled={isSubmitting}
//                       style={{ border: "1px solid #ced4da", fontSize: "12px", borderLeft: '0' }}
//                     >
//                       {showPassword ? "👁️‍🗨️" : "👁️"}
//                     </button>


//                   </div>
//                   {errors.password && (
//                     <div className="invalid-feedback d-block">
//                       {errors.password}
//                     </div>
//                   )}
//                   {validated && !formData.password.match(/^[A-Z]{2}[0-9]{4}$/) && (
//                     <div className="invalid-feedback">
//                       Format: 2 capital letters + 4 digits
//                     </div>
//                   )}
//                 </div>

//                 {/* Agent Match Share */}
//                 {/* <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Master Match Share (%){" "}
//                     <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.agentMatchShare ? "is-invalid" : ""}`}
//                     name="agentMatchShare"
//                     value={formData.agentMatchShare}
//                     onChange={handlePercentageChange}
//                     maxLength={3}
//                     required
//                   />

//                   {errors.agentMatchShare && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentMatchShare}
//                     </div>
//                   )}

//                   <small className="text-muted">
//                     Maximum: {formData.myMatchShare}%
//                   </small>
//                 </div> */}

//                 {/* Commission Type */}
//                 {/* <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     Commission Type <span className="text-danger">*</span>
//                   </label>

//                   <select
//                     className={`form-control ${errors.agentCommissionType ? "is-invalid" : ""}`}
//                     name="agentCommissionType"
//                     value={formData.agentCommissionType}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">Select</option>
//                     <option value="1">Bet by Bet</option>
//                     <option value="0">No Match Commission</option>
//                   </select>

//                   {errors.agentCommissionType && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentCommissionType}
//                     </div>
//                   )}
//                 </div> */}

//                 {/* Match Commission */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label"> Ratio (Cricket) </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.agentMatchComm ? "is-invalid" : ""}`}
//                     name="agentMatchComm"
//                     // value={formData.agentMatchComm}
//                     // onChange={handleChange}

//                     value={formData.agentMatchComm}
//                     onChange={handlePercentageChange}
//                     onKeyDown={blockInvalidKeys}
//                     disabled={formData.agentCommissionType === "0"}
//                     maxLength={3}
//                   />

//                   {errors.agentMatchComm && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentMatchComm}
//                     </div>
//                   )}

//                   <small className="text-muted">
//                     Maximum: {formData.myMatchComm}%
//                   </small>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label"> Football Commission </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.agentFootballComm ? "is-invalid" : ""}`}
//                     name="agentFootballComm"
//                     // value={formData.agentMatchComm}
//                     // onChange={handleChange}

//                     value={formData.agentFootballComm}
//                     onChange={handlePercentageChange}
//                     onKeyDown={blockInvalidKeys}
//                     disabled={formData.agentCommissionType === "0"}
//                     maxLength={3}
//                   />

//                   {errors.football_comm && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentFootballComm}
//                     </div>
//                   )}

//                   <small className="text-muted">
//                     Maximum: {formData.agentFootballComm}%
//                   </small>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label"> Tennis Commission </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.agentTennisComm ? "is-invalid" : ""}`}
//                     name="agentTennisComm"
//                     // value={formData.agentMatchComm}
//                     // onChange={handleChange}

//                     value={formData.agentTennisComm}
//                     onChange={handlePercentageChange}
//                     onKeyDown={blockInvalidKeys}
//                     disabled={formData.agentCommissionType === "0"}
//                     maxLength={3}
//                   />

//                   {errors.agentTennisComm && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentTennisComm}
//                     </div>
//                   )}

//                   <small className="text-muted">
//                     Maximum: {formData.agentTennisComm}%
//                   </small>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     {" "}
//                     Horse Racing Commission{" "}
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.agentHorseRacingComm ? "is-invalid" : ""}`}
//                     name="agentHorseRacingComm"
//                     // value={formData.agentMatchComm}
//                     // onChange={handleChange}

//                     value={formData.agentHorseRacingComm}
//                     onChange={handlePercentageChange}
//                     onKeyDown={blockInvalidKeys}
//                     disabled={formData.agentCommissionType === "0"}
//                     maxLength={3}
//                   />

//                   {errors.agentHorseRacingComm && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentHorseRacingComm}
//                     </div>
//                   )}

//                   <small className="text-muted">
//                     Maximum: {formData.agentHorseRacingComm}%
//                   </small>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">
//                     {" "}
//                     Greyhound Racing Commission{" "}
//                   </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.agentGreyhoundRacingComm ? "is-invalid" : ""}`}
//                     name="agentGreyhoundRacingComm"
//                     // value={formData.agentMatchComm}
//                     // onChange={handleChange}

//                     value={formData.agentGreyhoundRacingComm}
//                     onChange={handlePercentageChange}
//                     onKeyDown={blockInvalidKeys}
//                     disabled={formData.agentCommissionType === "0"}
//                     maxLength={3}
//                   />

//                   {errors.agentGreyhoundRacingComm && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentGreyhoundRacingComm}
//                     </div>
//                   )}

//                   <small className="text-muted">
//                     Maximum: {formData.agentGreyhoundRacingComm}%
//                   </small>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label"> Politics Commission </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.agentPoliticsComm ? "is-invalid" : ""}`}
//                     name="agentPoliticsComm"
//                     // value={formData.agentMatchComm}
//                     // onChange={handleChange}

//                     value={formData.agentPoliticsComm}
//                     onChange={handlePercentageChange}
//                     onKeyDown={blockInvalidKeys}
//                     disabled={formData.agentCommissionType === "0"}
//                     maxLength={3}
//                   />

//                   {errors.agentPoliticsComm && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentPoliticsComm}
//                     </div>
//                   )}

//                   <small className="text-muted">
//                     Maximum: {formData.agentPoliticsComm}%
//                   </small>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label"> Casino Commission </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.agentCasinoComm ? "is-invalid" : ""}`}
//                     name="agentCasinoComm"
//                     // value={formData.agentMatchComm}
//                     // onChange={handleChange}

//                     value={formData.agentCasinoComm}
//                     onChange={handlePercentageChange}
//                     onKeyDown={blockInvalidKeys}
//                     disabled={formData.agentCommissionType === "0"}
//                     maxLength={3}
//                   />

//                   {errors.agentCasinoComm && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentCasinoComm}
//                     </div>
//                   )}

//                   <small className="text-muted">
//                     Maximum: {formData.agentCasinoComm}%
//                   </small>
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label"> Session Commission </label>
//                   <input
//                     type="text"
//                     className={`form-control ${errors.agentSessionComm ? "is-invalid" : ""}`}
//                     name="agentSessionComm"
//                     // value={formData.agentMatchComm}
//                     // onChange={handleChange}

//                     value={formData.agentSessionComm}
//                     onChange={handlePercentageChange}
//                     onKeyDown={blockInvalidKeys}
//                     disabled={formData.agentCommissionType === "0"}
//                     maxLength={3}
//                   />

//                   {errors.agentSessionComm && (
//                     <div className="invalid-feedback d-block">
//                       {errors.agentSessionComm}
//                     </div>
//                   )}

//                   <small className="text-muted">
//                     Maximum: {formData.agentSessionComm}%
//                   </small>
//                 </div>

//                 {/* Company Share (%) */}
//                 {/* <div className="col-md-6 mb-3">
//                                 <label className="form-label">Company Share (%) <span className="text-danger">*</span></label>

//                                 <input
//                                     type="text"
//                                     className={`form-control ${errors.companyShare ? "is-invalid" : ""}`}
//                                     name="companyShare"
//                                     value={formData.companyShare}
//                                     onChange={handlePercentageChange}
//                                     onKeyDown={blockInvalidKeys}
//                                     maxLength={3}
//                                 />
//                                 {errors.companyShare && (
//                                     <div className="invalid-feedback d-block">
//                                         {errors.companyShare}
//                                     </div>
//                                 )}

//                                 <small className="text-muted">
//                                     Maximum: 100%
//                                 </small>
//                             </div> */}

//                 <div className="col-12 text-center mt-4">
//                   <div className="d-flex justify-content-start">
//                     <button
//                       type="submit"
//                       className="btn btn-primary px-4"
//                       disabled={!isFormValid || isSubmitting}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <span
//                             className="spinner-border spinner-border-sm me-2"
//                             role="status"
//                             aria-hidden="true"
//                           ></span>
//                           Submitting...
//                         </>
//                       ) : (
//                         "Submit"
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </form>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default CreateSuperAgentAdmin;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCreateSharp } from "react-icons/io5";
import Loader from "../Common/Loader";

const CreateSuperAgentAdmin = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const token = localStorage.getItem("token");

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
    coins: "",
    password: "",
    myCoins: "",
    myMatchShare: "",
    agentMatchShare: "",
    myCommissionType: "bet_by_bet",
    agentCommissionType: "",
    myMatchComm: "",
    agentMatchComm: "",
    mySessionComm: "",
    agentSessionComm: "",
    myCasinoComm: "",
    agentCasinoComm: "",
    myMatkaComm: "",
    agentMatkaComm: "",
    reference: "",
    myFootballComm: "",
    agentFootballComm: "",
    myTennisComm: "",
    agentTennisComm: "",
    myHorseRacingComm: "",
    agentHorseRacingComm: "",
    myGreyhoundRacingComm: "",
    agentGreyhoundRacingComm: "",
    myPoliticsComm: "",
    agentPoliticsComm: "",
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      const admin_id = localStorage.getItem("admin_id");
      const role = localStorage.getItem("role");
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/get-data`,
          {
            role: role,
            admin_id: admin_id,
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
          setAdminData(adminProfile);

          setFormData((prev) => ({
            ...prev,
            super_admin_id: adminProfile.super_admin_id,
            username: adminProfile.username,
            master_admin_id: adminProfile.admin_id,
            myCoins: adminProfile.coins || "0",
            myMatchShare: adminProfile.match_share || "0",
            myCommissionType:
              adminProfile.commission_type === "1"
                ? "bet_by_bet"
                : adminProfile.commission_type === "2"
                  ? "match_comm"
                  : "bet_by_bet",
            myMatchComm: adminProfile.match_comm || "0",
            mySessionComm: adminProfile.session_comm || "0",
            myCasinoComm: adminProfile.casino_comm || "0",
            myMatkaComm: adminProfile.matka_comm || "0",
          }));
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load admin data");
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
  }, [token, navigate]);

  // ✅ FIXED: Removed agentCommissionType validation
  useEffect(() => {
    const checkFormValidity = () => {
      const coins = parseFloat(formData.coins);
      const myCoins = parseFloat(formData.myCoins) || 0;
      const valid =
        formData.name.trim() !== "" &&
        formData.coins !== "" &&
        !isNaN(coins) &&
        coins > 0 &&
        coins <= myCoins &&
        // formData.agentCommissionType !== "" &&  // ← COMMENTED
        formData.password.trim() !== "";

      setIsFormValid(valid);
    };

    checkFormValidity();
  }, [formData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      password: "",
    }));
  }, []);

  const allowOnlyNumbers = (e) => {
    const key = e.key;
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (!/^[0-9]$/.test(key) && !allowedKeys.includes(key)) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (formData.agentCommissionType === "0") {
      setFormData((prev) => ({
        ...prev,
        agentMatchComm: "0",
        agentSessionComm: "0",
        agentFootballComm: "0",
        agentTennisComm: "0",
        agentHorseRacingComm: "0",
        agentGreyhoundRacingComm: "0",
        agentPoliticsComm: "0",
        agentCasinoComm: "0",
        agentMatkaComm: "0",
      }));

      setErrors((prev) => ({
        ...prev,
        agentMatchComm: "",
        agentSessionComm: "",
        agentFootballComm: "",
        agentTennisComm: "",
        agentHorseRacingComm: "",
        agentGreyhoundRacingComm: "",
        agentPoliticsComm: "",
        agentCasinoComm: "",
        agentMatkaComm: "",
      }));
    }
  }, [formData.agentCommissionType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "coins") {
      if (!/^\d*$/.test(value)) return;
      if (value === "") {
        setFormData((prev) => ({ ...prev, coins: "" }));
        return;
      }
      const assignCoins = Number(value);
      const myCoins = Number(formData.myCoins);
      if (assignCoins <= 0) {
        setErrors((prev) => ({
          ...prev,
          coins: "Coins must be greater than 0",
        }));
        return;
      }
      if (assignCoins > myCoins) {
        setErrors((prev) => ({
          ...prev,
          coins: `You can assign maximum ${myCoins} coins`,
        }));
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePercentageChange = (e) => {
    const { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;
    const numValue = Number(value);
    if (numValue < 0 || numValue > 100) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Value must be between 0 and 100",
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const blockInvalidKeys = (e) => {
    const key = e.key;
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
      e.preventDefault();
    }
  };

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

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    const coins = parseFloat(formData.coins);
    const myCoins = parseFloat(formData.myCoins) || 0;

    if (!formData.coins || isNaN(coins) || coins <= 0) {
      newErrors.coins = "Please enter valid coins";
      isValid = false;
    } else if (coins > myCoins) {
      newErrors.coins = `Cannot assign more than ${myCoins} coins`;
      isValid = false;
    }

    // ✅ COMMENTED: agentCommissionType validation
    // if (!formData.agentCommissionType) {
    //   newErrors.agentCommissionType = "Please select commission type";
    //   isValid = false;
    // }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      reference: "",
      super_admin_id: formData.super_admin_id,
      master_admin_id: formData.master_admin_id,
      coins: "",
      password: generatePassword(),
      myCoins: formData.myCoins,
      myMatchShare: formData.myMatchShare,
      agentMatchShare: "",
      myCommissionType: formData.myCommissionType,
      agentCommissionType: "",
      myMatchComm: formData.myMatchComm,
      agentMatchComm: "",
      myFootballComm: formData.myFootballComm,
      agentFootballComm: "",
      myTennisComm: formData.myTennisComm,
      agentTennisComm: "",
      myHorseRacingComm: formData.myHorseRacingComm,
      agentHorseRacingComm: "",
      myGreyhoundRacingComm: formData.myGreyhoundRacingComm,
      agentGreyhoundRacingComm: "",
      myPoliticsComm: formData.myPoliticsComm,
      agentPoliticsComm: "",
      myCasinoComm: formData.myCasinoComm,
      agentCasinoComm: "",
      mySessionComm: formData.mySessionComm,
      agentSessionComm: "",
      myMatkaComm: formData.myMatkaComm,
      agentMatkaComm: "",
      username: formData.username,
    });

    setErrors({});
    setValidated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = {
        super_admin_id: formData.super_admin_id || formData.master_admin_id,
        name: formData.name,
        coins: formData.coins,
        password: formData.password,
        match_share: formData.agentMatchShare,
        commission_type: formData.agentCommissionType,
        match_comm:
          formData.agentCommissionType === "0"
            ? 0
            : formData.agentMatchComm || 0,
        football_comm:
          formData.agentCommissionType === "0"
            ? 0
            : formData.agentFootballComm || 0,
        tennis_comm:
          formData.agentCommissionType === "0"
            ? 0
            : formData.agentTennisComm || 0,
        horse_racing_comm:
          formData.agentCommissionType === "0"
            ? 0
            : formData.agentHorseRacingComm || 0,
        greyhound_racing_comm:
          formData.agentCommissionType === "0"
            ? 0
            : formData.agentGreyhoundRacingComm || 0,
        politics_comm:
          formData.agentCommissionType === "0"
            ? 0
            : formData.agentPoliticsComm || 0,
        casino_comm:
          formData.agentCommissionType === "0"
            ? 0
            : formData.agentCasinoComm || 0,
        session_comm:
          formData.agentCommissionType === "0"
            ? 0
            : formData.agentSessionComm || 0,
        reference: formData.reference || "",
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
        toast.success(res.data.message);
        resetForm();
        navigate("/agent_lists");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Server error";
      toast.error(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <IoCreateSharp className="fs-2" /> Create New Super Master
          </h5>
        </div>
        {loading ? (
          <div className="py-5 table_loader">
            <Loader />
          </div>
        ) : (
          <div className="card-body">
            <form
              noValidate
              className={`needs-validation ${validated ? "was-validated" : ""}`}
              onSubmit={handleSubmit}
            >
              <div className="row">
                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label d-flex align-items-center justify-content-between">
                    Full Name* <span className="text-danger"></span>{" "}
                    <small _ngcontent-owm-c76="">
                      [A-Z , a-z , 0-9 , @ ] Allowed
                    </small>
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
                    <div className="invalid-feedback d-block">
                      {errors.name}
                    </div>
                  )}
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
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Super Admin ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.username}
                    readOnly
                    disabled={isSubmitting}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Coins to Assign <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.coins ? "is-invalid" : ""}`}
                    name="coins"
                    value={formData.coins}
                    onChange={handleChange}
                    max={formData.myCoins}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.coins && (
                    <div className="invalid-feedback d-block">{errors.coins}</div>
                  )}
                </div>

                {/* Password */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      style={{ borderRight: '0' }}
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      style={{ border: "1px solid #ced4da", fontSize: "12px", borderLeft: '0' }}
                    >
                      {showPassword ? "👁️‍🗨️" : "👁️"}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Match Commission - Cricket */}
                <div className="col-md-6 mb-3">
                  <label className="form-label"> PARTNERSHIP (Cricket) </label>
                  <input
                    type="text"
                    className={`form-control ${errors.agentMatchComm ? "is-invalid" : ""}`}
                    name="agentMatchComm"
                    value={formData.agentMatchComm}
                    onChange={handlePercentageChange}
                    onKeyDown={blockInvalidKeys}
                    disabled={formData.agentCommissionType === "0"}
                    maxLength={3}
                  />
                  {errors.agentMatchComm && (
                    <div className="invalid-feedback d-block">
                      {errors.agentMatchComm}
                    </div>
                  )}
                  <small className="text-muted">
                    Maximum: {formData.myMatchComm}%
                  </small>
                </div>

                {/* Football Commission */}
                <div className="col-md-6 mb-3">
                  <label className="form-label"> PARTNERSHIP (Football) </label>
                  <input
                    type="text"
                    className={`form-control ${errors.agentFootballComm ? "is-invalid" : ""}`}
                    name="agentFootballComm"
                    value={formData.agentFootballComm}
                    onChange={handlePercentageChange}
                    onKeyDown={blockInvalidKeys}
                    disabled={formData.agentCommissionType === "0"}
                    maxLength={3}
                  />
                  {errors.agentFootballComm && (
                    <div className="invalid-feedback d-block">
                      {errors.agentFootballComm}
                    </div>
                  )}
                  <small className="text-muted">
                    Maximum: {formData.myFootballComm}%
                  </small>
                </div>

                {/* Tennis Commission */}
                <div className="col-md-6 mb-3">
                  <label className="form-label"> PARTNERSHIP (Tennis) </label>
                  <input
                    type="text"
                    className={`form-control ${errors.agentTennisComm ? "is-invalid" : ""}`}
                    name="agentTennisComm"
                    value={formData.agentTennisComm}
                    onChange={handlePercentageChange}
                    onKeyDown={blockInvalidKeys}
                    disabled={formData.agentCommissionType === "0"}
                    maxLength={3}
                  />
                  {errors.agentTennisComm && (
                    <div className="invalid-feedback d-block">
                      {errors.agentTennisComm}
                    </div>
                  )}
                  <small className="text-muted">
                    Maximum: {formData.myTennisComm}%
                  </small>
                </div>

                {/* Horse Racing Commission */}
                <div className="col-md-6 mb-3">
                  <label className="form-label"> PARTNERSHIP (Horse Racing) </label>
                  <input
                    type="text"
                    className={`form-control ${errors.agentHorseRacingComm ? "is-invalid" : ""}`}
                    name="agentHorseRacingComm"
                    value={formData.agentHorseRacingComm}
                    onChange={handlePercentageChange}
                    onKeyDown={blockInvalidKeys}
                    disabled={formData.agentCommissionType === "0"}
                    maxLength={3}
                  />
                  {errors.agentHorseRacingComm && (
                    <div className="invalid-feedback d-block">
                      {errors.agentHorseRacingComm}
                    </div>
                  )}
                  <small className="text-muted">
                    Maximum: {formData.myHorseRacingComm}%
                  </small>
                </div>

                {/* Greyhound Racing Commission */}
                <div className="col-md-6 mb-3">
                  <label className="form-label"> PARTNERSHIP (Greyhound Racing) </label>
                  <input
                    type="text"
                    className={`form-control ${errors.agentGreyhoundRacingComm ? "is-invalid" : ""}`}
                    name="agentGreyhoundRacingComm"
                    value={formData.agentGreyhoundRacingComm}
                    onChange={handlePercentageChange}
                    onKeyDown={blockInvalidKeys}
                    disabled={formData.agentCommissionType === "0"}
                    maxLength={3}
                  />
                  {errors.agentGreyhoundRacingComm && (
                    <div className="invalid-feedback d-block">
                      {errors.agentGreyhoundRacingComm}
                    </div>
                  )}
                  <small className="text-muted">
                    Maximum: {formData.myGreyhoundRacingComm}%
                  </small>
                </div>

                {/* Politics Commission */}
                <div className="col-md-6 mb-3">
                  <label className="form-label"> PARTNERSHIP (Politics) </label>
                  <input
                    type="text"
                    className={`form-control ${errors.agentPoliticsComm ? "is-invalid" : ""}`}
                    name="agentPoliticsComm"
                    value={formData.agentPoliticsComm}
                    onChange={handlePercentageChange}
                    onKeyDown={blockInvalidKeys}
                    disabled={formData.agentCommissionType === "0"}
                    maxLength={3}
                  />
                  {errors.agentPoliticsComm && (
                    <div className="invalid-feedback d-block">
                      {errors.agentPoliticsComm}
                    </div>
                  )}
                  <small className="text-muted">
                    Maximum: {formData.myPoliticsComm}%
                  </small>
                </div>

                {/* Casino Commission */}
                <div className="col-md-6 mb-3">
                  <label className="form-label"> PARTNERSHIP (Casino) </label>
                  <input
                    type="text"
                    className={`form-control ${errors.agentCasinoComm ? "is-invalid" : ""}`}
                    name="agentCasinoComm"
                    value={formData.agentCasinoComm}
                    onChange={handlePercentageChange}
                    onKeyDown={blockInvalidKeys}
                    disabled={formData.agentCommissionType === "0"}
                    maxLength={3}
                  />
                  {errors.agentCasinoComm && (
                    <div className="invalid-feedback d-block">
                      {errors.agentCasinoComm}
                    </div>
                  )}
                  <small className="text-muted">
                    Maximum: {formData.myCasinoComm}%
                  </small>
                </div>

                {/* Session Commission */}
                <div className="col-md-6 mb-3">
                  <label className="form-label"> PARTNERSHIP (Session) </label>
                  <input
                    type="text"
                    className={`form-control ${errors.agentSessionComm ? "is-invalid" : ""}`}
                    name="agentSessionComm"
                    value={formData.agentSessionComm}
                    onChange={handlePercentageChange}
                    onKeyDown={blockInvalidKeys}
                    disabled={formData.agentCommissionType === "0"}
                    maxLength={3}
                  />
                  {errors.agentSessionComm && (
                    <div className="invalid-feedback d-block">
                      {errors.agentSessionComm}
                    </div>
                  )}
                  <small className="text-muted">
                    Maximum: {formData.mySessionComm}%
                  </small>
                </div>

                {/* Submit Button */}
                <div className="col-12 text-center mt-4">
                  <div className="d-flex justify-content-start">
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateSuperAgentAdmin;