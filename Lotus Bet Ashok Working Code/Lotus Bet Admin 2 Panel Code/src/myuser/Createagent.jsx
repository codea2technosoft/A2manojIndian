import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

const CreateSuperAgentAdmin = () => {
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showNullFieldsAlert, setShowNullFieldsAlert] = useState(false);
    const [nullFieldsList, setNullFieldsList] = useState([]);
    const token = localStorage.getItem("token");
    const { id } = useParams();
    
    // Alert Modal Component
    const NullFieldsAlert = () => {
        if (!showNullFieldsAlert) return null;
        
        return (
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-warning text-dark">
                            <h5 className="modal-title">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Missing Required Fields
                            </h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setShowNullFieldsAlert(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="alert alert-warning">
                                <strong>Please fill the following fields:</strong>
                            </div>
                            <ul className="list-group">
                                {nullFieldsList.map((field, index) => (
                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                        <span>
                                            <i className="fas fa-exclamation-circle text-danger me-2"></i>
                                            {field.label}
                                        </span>
                                        <span className="badge bg-danger rounded-pill">Required</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3">
                                <small className="text-muted">
                                    <i className="fas fa-info-circle me-1"></i>
                                    All fields marked with <span className="text-danger">*</span> are required
                                </small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={() => setShowNullFieldsAlert(false)}
                            >
                                <i className="fas fa-check me-1"></i>
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const blockInvalidKeys = (e) => {
        const key = e.key;
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
        
        if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
            e.preventDefault();
        }
    };

    // 🔐 Password Generator (2 CAPITAL + 4 DIGITS)
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
        username: "",
        super_admin_id: "",
        agent_id: "",
        master_admin_id: "",
        super_agent_id: "",
        coins: "",
        password: "",
        myCoins: "",
        myMatchShare: "",
        reference: "",
        company_share: "",
        myCommissionType: "",
        agentCommissionType: "",
        myMatchComm: "",
        agentMatchComm: "",
        mySessionComm: "",
        agentSessionComm: "",
        myCasinoComm: "",
        myMatkaComm: "",
        agentMatkaComm: ""
    });

    // ✅ Show alert for null fields
    const showNullFieldsAlertBox = () => {
        return true;
    };

    // Fetch Admin Data on component mount
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/get-admin-details`,
                    {
                        role: "4",
                        admin_id: id
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    const adminProfile = response.data.data.admin_profile;
                    setAdminData(adminProfile);

                    // Convert commission_type to readable format
                    let commissionTypeDisplay = "";
                    if (adminProfile.commission_type === "1") {
                        commissionTypeDisplay = "Bet By Bet";
                    } else if (adminProfile.commission_type === "0") {
                        commissionTypeDisplay = "No Match Commission";
                    } else {
                        commissionTypeDisplay = "Unknown";
                    }

                    setFormData(prev => ({
                        ...prev,
                        super_admin_id: adminProfile.super_admin_id,
                        agent_id: adminProfile.admin_id,
                        master_admin_id: adminProfile.master_admin_id,
                        super_agent_id: adminProfile.super_agent_id,
                        username: adminProfile.username,
                        myCoins: adminProfile.coins || "0",
                        myMatchShare: adminProfile.match_share || "0",
                        company_share: adminProfile.company_share || "0",
                        // reference: adminProfile.reference,
                        myCommissionType: adminProfile.commission_type,
                        myMatchComm: adminProfile.match_comm || "0",
                        mySessionComm: adminProfile.session_comm || "0",
                        myCasinoComm: adminProfile.casino_comm || "0",
                        myMatkaComm: adminProfile.matka_comm || "0"
                    }));
                } else {
                    toast.error("Failed to load admin data");
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
            navigate('/login');
        }
    }, [token, navigate, id]);

    // ✅ Generate password on initial load
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            password: generatePassword()
        }));
    }, []);

    // ✅ Check form validity whenever formData changes
    useEffect(() => {
        checkFormValidity();
    }, [formData]);

    const checkFormValidity = () => {
        const requiredFields = [
            'name',
            'coins',
            'password',
            'agentCommissionType'
        ];

        // Check if all required fields are filled
        const allRequiredFilled = requiredFields.every(field => {
            const value = formData[field];
            return value !== null && value !== undefined && value.toString().trim() !== '';
        });

        // Validate coins
        const coins = parseFloat(formData.coins);
        const myCoins = parseFloat(formData.myCoins) || 0;
        const coinsValid = !isNaN(coins) && coins > 0 && coins <= myCoins;

        // Validate password format
        const passwordRegex = /^[A-Z]{2}[0-9]{4}$/;
        const passwordValid = passwordRegex.test(formData.password);

        // Validate commission fields if bet_by_bet is selected
        let commissionValid = true;
        if (formData.agentCommissionType === "1") {
            const agentMatchComm = parseFloat(formData.agentMatchComm) || 0;
            const agentSessionComm = parseFloat(formData.agentSessionComm) || 0;
            const agentMatkaComm = parseFloat(formData.agentMatkaComm) || 0;
            const myMatchComm = parseFloat(formData.myMatchComm) || 0;
            const mySessionComm = parseFloat(formData.mySessionComm) || 0;

            const matchCommValid = !isNaN(agentMatchComm) && agentMatchComm >= 0 && agentMatchComm <= myMatchComm;
            const sessionCommValid = !isNaN(agentSessionComm) && agentSessionComm >= 0 && agentSessionComm <= mySessionComm;

            commissionValid = matchCommValid && sessionCommValid;
        }

        // Set form validity
        setIsFormValid(allRequiredFilled && coinsValid && passwordValid && commissionValid);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        // Handle agentCommissionType change
        if (name === "agentCommissionType") {
            const newFormData = { ...formData, [name]: value };

            if (value === "0") {
                newFormData.agentMatchComm = "0";
                newFormData.agentSessionComm = "0";
                newFormData.agentMatkaComm = "0";
                setErrors(prev => ({
                    ...prev,
                    agentMatchComm: "",
                    agentSessionComm: "",
                    agentMatkaComm: ""
                }));
            }
            else if (value === "1") {
                newFormData.agentMatchComm = formData.agentMatchComm || "";
                newFormData.agentSessionComm = formData.agentSessionComm || "";
                newFormData.agentMatkaComm = formData.agentMatkaComm || "";
            }

            setFormData(newFormData);
            return;
        }

        // If No Match Commission is selected, disable commission field changes
        if (formData.agentCommissionType === "0") {
            if (name === "agentMatchComm" || name === "agentSessionComm" || name === "agentMatkaComm") {
                return;
            }
        }

        // Restrict coins assignment
        if (name === "coins") {
            const myCoins = parseFloat(formData.myCoins) || 0;
            const inputValue = parseFloat(value) || 0;

            if (inputValue > myCoins) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `Cannot assign more than ${myCoins} coins`
                }));
                setFormData(prev => ({ ...prev, [name]: value }));
                return;
            }

            if (inputValue < 0) {
                setErrors(prev => ({
                    ...prev,
                    [name]: "Coins cannot be negative"
                }));
                setFormData(prev => ({ ...prev, [name]: value }));
                return;
            }
        }

        // Restrict commission fields when Bet By Bet is selected
        if (name === "agentMatchComm" || name === "agentSessionComm" || name === "agentMatkaComm") {
            const fieldPrefix = name.replace("agent", "my");
            const myValue = parseFloat(formData[fieldPrefix]) || 0;
            const inputValue = parseFloat(value) || 0;

            if (inputValue > myValue) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `Cannot exceed ${myValue}%`
                }));
                setFormData(prev => ({ ...prev, [name]: value }));
                return;
            }

            if (inputValue < 0) {
                setErrors(prev => ({
                    ...prev,
                    [name]: "Commission cannot be negative"
                }));
                setFormData(prev => ({ ...prev, [name]: value }));
                return;
            }
        }

        // Set form data
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Generate new password
    const handleGeneratePassword = () => {
        setFormData(prev => ({
            ...prev,
            password: generatePassword()
        }));
        if (errors.password) {
            setErrors(prev => ({ ...prev, password: "" }));
        }
        toast.info("New password generated!");
    };

    // ✅ Validate form before submission
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Validate name
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

        // Validate agent commission type
        if (!formData.agentCommissionType) {
            newErrors.agentCommissionType = "Please select commission type";
            isValid = false;
        }

        // Validate password format
        const passwordRegex = /^[A-Z]{2}[0-9]{4}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be 2 capital letters followed by 4 digits";
            isValid = false;
        }

        // Validate agent commission fields only if Bet By Bet is selected
        if (formData.agentCommissionType === "1") {
            const agentMatchComm = parseFloat(formData.agentMatchComm) || 0;
            const agentSessionComm = parseFloat(formData.agentSessionComm) || 0;
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

    // ✅ Reset form after successful submission
    const resetForm = () => {
        setFormData(prev => ({
            name: "",
            username: prev.username,
            super_admin_id: prev.super_admin_id,
            agent_id: prev.agent_id,
            master_admin_id: prev.master_admin_id,
            super_agent_id: prev.super_agent_id,
            coins: "",
            password: generatePassword(),
            myCoins: prev.myCoins,
            myMatchShare: prev.myMatchShare,
            company_share: prev.company_share,
            reference: prev.reference,
            myCommissionType: prev.myCommissionType,
            agentCommissionType: "",
            myMatchComm: prev.myMatchComm,
            agentMatchComm: "",
            mySessionComm: prev.mySessionComm,
            agentSessionComm: "",
            myCasinoComm: prev.myCasinoComm,
            myMatkaComm: prev.myMatkaComm,
            agentMatkaComm: ""
        }));
        setErrors({});
        setValidated(false);
        setIsFormValid(false);
    };

    // ✅ API SUBMIT - Create Super Agent Admin
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);

        // Then validate form
        if (!validateForm()) {
            toast.error("Please fill all required fields correctly");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name.trim(),
                password: formData.password,
                reference: formData.reference,
                super_admin_id: formData.super_admin_id,
                agent_id: formData.agent_id,
                master_admin_id: formData.master_admin_id,
                super_agent_id: formData.super_agent_id,
                coins: parseInt(formData.coins) || 0,
                match_share: parseFloat(formData.agentMatchShare) || 0,
                company_share: parseFloat(formData.company_share) || 0,
                commission_type: formData.agentCommissionType,
                match_comm: parseFloat(formData.agentMatchComm) || 0,
                session_comm: parseFloat(formData.agentSessionComm) || 0,
                matka_comm: parseFloat(formData.agentMatkaComm) || 0
            };

            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/create-user-admin`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.data.success) {
                toast.success("Created Successfully!!");
                resetForm();
                setTimeout(() => {
                    navigate(-2);
                }, 2000);
            } else {
                toast.error(res.data.message || "Failed to create super agent admin");
            }

        } catch (err) {
            console.error("API Error:", err);
            const errorMessage = err?.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ Auto set Agent Commission Type from My Commission Type
    useEffect(() => {
        if (formData.myCommissionType && !formData.agentCommissionType) {
            setFormData(prev => ({
                ...prev,
                agentCommissionType: prev.myCommissionType
            }));
        }
    }, [formData.myCommissionType]);

    useEffect(() => {
        // Match Commission
        if (
            formData.myMatchComm &&
            (formData.agentMatchComm === "" || formData.agentMatchComm === undefined)
        ) {
            setFormData(prev => ({
                ...prev,
                agentMatchComm: prev.myMatchComm
            }));
        }

        // Session Commission
        if (
            formData.mySessionComm &&
            (formData.agentSessionComm === "" || formData.agentSessionComm === undefined)
        ) {
            setFormData(prev => ({
                ...prev,
                agentSessionComm: prev.mySessionComm
            }));
        }
    }, [formData.myMatchComm, formData.mySessionComm]);

    // Function to get commission type display text
    const getCommissionTypeDisplay = (commissionType) => {
        if (commissionType === "1") {
            return "Bet By Bet";
        } else if (commissionType === "0") {
            return "No Match Commission";
        } else {
            return "Unknown";
        }
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
                autoClose={300}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            {/* Null Fields Alert Modal */}
            <NullFieldsAlert />

            <div className="card">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Create User Client</h5>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-success"
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
                                <label className="form-label">Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.name && (
                                    <div className="invalid-feedback d-block">{errors.name}</div>
                                )}
                            </div>

                            {/* Username */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">parent</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.username || "Loading..."}
                                    readOnly
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
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
                            </div>

                            {/* Coins to Assign */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Coins to Assign <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.coins ? 'is-invalid' : ''}`}
                                    name="coins"
                                    value={formData.coins}
                                    onChange={handleChange}
                                    onKeyDown={blockInvalidKeys}
                                    min="0"
                                    max={formData.myCoins}
                                    required
                                    disabled={isSubmitting}
                                />
                                {errors.coins && (
                                    <div className="invalid-feedback d-block">{errors.coins}</div>
                                )}
                                <small className="text-muted">Maximum you can assign: {formData.myCoins}</small>
                            </div>

                            {/* Password */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Password <span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        pattern="[A-Z]{2}[0-9]{4}"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handleGeneratePassword}
                                        disabled={isSubmitting}
                                    >
                                        <i className="fas fa-sync-alt"></i> Generate
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="invalid-feedback d-block">{errors.password}</div>
                                )}
                                <small className="text-muted">Format: 2 capital letters + 4 digits</small>
                            </div>

                                <div className="col-md-6 mb-3">
                                <label className="form-label">REFERENCE </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="reference" // ✅ Add name attribute
                                    value={formData.reference}
                                     
                                    onChange={handleChange} // ✅ Add onChange handler
                                // readOnly // ✅ Remove if you want it editable
                                // style={{ backgroundColor: "#f8f9fa" }} // ✅ Remove or adjust
                                />
                            </div>

                            {/* Divider */}
                            <div className="col-12 my-3">
                                <h5 className="border-bottom pb-2">Match & Share Info</h5>
                            </div>

                            {/* My Match Share */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">My Share (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.myMatchShare}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* Company Share */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Company Share (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.company_share}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* My Commission Type */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">My Commission Type</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={getCommissionTypeDisplay(formData.myCommissionType)}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* Agent Commission Type */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">User Commission Type <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.agentCommissionType ? 'is-invalid' : ''}`}
                                    name="agentCommissionType"
                                    value={formData.agentCommissionType}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select</option>
                                    <option value="1">Bet By Bet</option>
                                    <option value="0">No Match Commission</option>
                                </select>
                                {errors.agentCommissionType && (
                                    <div className="invalid-feedback d-block">{errors.agentCommissionType}</div>
                                )}
                            </div>

                            {/* My Match Comm */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">My Match Comm (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.myMatchComm}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* Agent Match Comm */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">User Match Comm (%)</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.agentMatchComm ? 'is-invalid' : ''}`}
                                    name="agentMatchComm"
                                    value={formData.agentMatchComm}
                                    onChange={handleChange}
                                    onKeyDown={blockInvalidKeys}
                                    min="0"
                                    max={formData.myMatchComm}
                                    step="0.01"
                                    disabled={formData.agentCommissionType === "0" || isSubmitting}
                                    style={{
                                        backgroundColor: formData.agentCommissionType === "0" ? "#f8f9fa" : ""
                                    }}
                                />
                                {errors.agentMatchComm && (
                                    <div className="invalid-feedback d-block">{errors.agentMatchComm}</div>
                                )}
                            </div>

                            {/* My Session Comm */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">My Session Comm (%)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.mySessionComm}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* Agent Session Comm */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">User Session Comm (%)</label>
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
                                    style={{
                                        backgroundColor: formData.agentCommissionType === "0" ? "#f8f9fa" : ""
                                    }}
                                />
                                {errors.agentSessionComm && (
                                    <div className="invalid-feedback d-block">{errors.agentSessionComm}</div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="col-12 text-center mt-4">
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="refreshbutton"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating...
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
            </div>
        </>
    );
};

export default CreateSuperAgentAdmin;