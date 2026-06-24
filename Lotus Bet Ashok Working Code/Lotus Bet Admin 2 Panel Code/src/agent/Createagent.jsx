import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateSuperAgentAdmin = () => {
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const token = localStorage.getItem("token");

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
        super_admin_id: "",
        master_admin_id: "",
        coins: "",
        password: "",
        myCoins: "",
        myMatchShare: "",
        agentMatchShare: "",
        myCommissionType: "",
        agentCommissionType: "",
        myMatchComm: "",
        agentMatchComm: "",
        mySessionComm: "",
        company_share: "",
        agentSessionComm: "",
        myCasinoComm: "",
        myMatkaComm: "",
        agentMatkaComm: "",
        username: "",
        reference: ""
    });

    const blockInvalidKeys = (e) => {
        const key = e.key;
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", ".", "Enter"];

        // Allow numbers and decimal point for numeric fields
        if ((!/^\d$/.test(key) && key !== '.') && !allowedKeys.includes(key)) {
            e.preventDefault();
        }
    };

    // Fetch Admin Data on component mount
    useEffect(() => {
        const fetchAdminData = async () => {
            const admin_id = localStorage.getItem("admin_id");
            const role = localStorage.getItem("role");

            if (!token || !admin_id || !role) {
                toast.error("Authentication required");
                navigate('/login');
                return;
            }

            try {
                // Fetch logged-in admin data
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/get-data`,
                    { role, admin_id },
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

                    // Set form data based on API response
                    setFormData(prev => ({
                        ...prev,
                        super_admin_id: adminProfile.super_admin_id || "",
                        username: adminProfile.username || "",
                        reference: adminProfile.reference || "",
                        master_admin_id: adminProfile.admin_id || "",
                        myCoins: adminProfile.coins || "0",
                        myMatchShare: adminProfile.match_share || "0",
                        myCommissionType: adminProfile.commission_type || "0",
                        myMatchComm: adminProfile.match_comm || "0",
                        mySessionComm: adminProfile.session_comm || "0",
                        company_share: adminProfile.company_share || "0",
                        myCasinoComm: adminProfile.casino_comm || "0",
                        myMatkaComm: adminProfile.matka_comm || "0"
                    }));

                    // Set agent commission type based on parent's commission type
                    if (adminProfile.commission_type) {
                        setFormData(prev => ({
                            ...prev,
                            agentCommissionType: adminProfile.commission_type
                        }));
                    }
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

        fetchAdminData();
    }, [token, navigate]);

    // ✅ Generate password on initial load
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            password: generatePassword()
        }));
    }, []);

    // ✅ Set initial agent commission values based on my commissions
    useEffect(() => {
        if (formData.myMatchComm && (!formData.agentMatchComm || formData.agentMatchComm === "")) {
            setFormData(prev => ({
                ...prev,
                agentMatchComm: formData.myMatchComm
            }));
        }
        if (formData.mySessionComm && (!formData.agentSessionComm || formData.agentSessionComm === "")) {
            setFormData(prev => ({
                ...prev,
                agentSessionComm: formData.mySessionComm
            }));
        }
    }, [formData.myMatchComm, formData.mySessionComm]);

    // ✅ Check form validity whenever formData changes
    useEffect(() => {
        checkFormValidity();
    }, [formData]);

    const checkFormValidity = () => {
        const requiredFields = [
            'name',
            'coins',
            'password',
            'agentMatchShare',
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

        // Validate agent match share
        const agentMatchShare = parseFloat(formData.agentMatchShare);
        const myMatchShare = parseFloat(formData.myMatchShare) || 0;
        const matchShareValid = !isNaN(agentMatchShare) && agentMatchShare >= 0 && agentMatchShare <= myMatchShare;

        // Validate commission fields based on agentCommissionType
        let commissionValid = true;

        if (formData.agentCommissionType === "1") { // Bet By Bet
            const agentMatchComm = parseFloat(formData.agentMatchComm);
            const agentSessionComm = parseFloat(formData.agentSessionComm);
            const myMatchComm = parseFloat(formData.myMatchComm) || 0;
            const mySessionComm = parseFloat(formData.mySessionComm) || 0;

            const matchCommValid = !isNaN(agentMatchComm) && agentMatchComm >= 0 && agentMatchComm <= myMatchComm;
            const sessionCommValid = !isNaN(agentSessionComm) && agentSessionComm >= 0 && agentSessionComm <= mySessionComm;

            commissionValid = matchCommValid && sessionCommValid;
        }

        // Set form validity
        setIsFormValid(allRequiredFilled && coinsValid && passwordValid && matchShareValid && commissionValid);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        // Handle agentCommissionType change - FIXED: Parent commission type should be fixed
        if (name === "agentCommissionType") {
            // Agent should be able to select their own commission type
            const newFormData = { ...formData, [name]: value };

            // If No Match Commission is selected, set commission fields to 0
            if (value === "0") { // No Match Commission
                newFormData.agentMatchComm = "0";
                newFormData.agentSessionComm = "0";
                newFormData.agentMatkaComm = "0";
            } else if (value === "1") { // Bet By Bet
                // If switching to Bet By Bet, set defaults if empty
                if (!newFormData.agentMatchComm || newFormData.agentMatchComm === "0") {
                    newFormData.agentMatchComm = newFormData.myMatchComm || "";
                }
                if (!newFormData.agentSessionComm || newFormData.agentSessionComm === "0") {
                    newFormData.agentSessionComm = newFormData.mySessionComm || "";
                }
            }

            setFormData(newFormData);
            return;
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
                setFormData({ ...formData, [name]: value });
                return;
            }

            if (inputValue < 0) {
                setErrors(prev => ({
                    ...prev,
                    [name]: "Coins cannot be negative"
                }));
                setFormData({ ...formData, [name]: value });
                return;
            }
        }

        // Restrict agentMatchShare
        if (name === "agentMatchShare") {
            const myMatchShare = parseFloat(formData.myMatchShare) || 0;
            const inputValue = parseFloat(value) || 0;

            if (inputValue > myMatchShare) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `Cannot exceed ${myMatchShare}%`
                }));
                setFormData({ ...formData, [name]: value });
                return;
            }

            if (inputValue < 0) {
                setErrors(prev => ({
                    ...prev,
                    [name]: "Match share cannot be negative"
                }));
                setFormData({ ...formData, [name]: value });
                return;
            }
        }

        // For Bet By Bet commission fields, validate against parent limits
        if (name === "agentMatchComm" && formData.agentCommissionType === "1") {
            const myMatchComm = parseFloat(formData.myMatchComm) || 0;
            const inputValue = parseFloat(value) || 0;

            if (inputValue > myMatchComm) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `Cannot exceed ${myMatchComm}%`
                }));
                setFormData({ ...formData, [name]: value });
                return;
            }

            if (inputValue < 0) {
                setErrors(prev => ({
                    ...prev,
                    [name]: "Match commission cannot be negative"
                }));
                setFormData({ ...formData, [name]: value });
                return;
            }
        }

        if (name === "agentSessionComm" && formData.agentCommissionType === "1") {
            const mySessionComm = parseFloat(formData.mySessionComm) || 0;
            const inputValue = parseFloat(value) || 0;

            if (inputValue > mySessionComm) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `Cannot exceed ${mySessionComm}%`
                }));
                setFormData({ ...formData, [name]: value });
                return;
            }

            if (inputValue < 0) {
                setErrors(prev => ({
                    ...prev,
                    [name]: "Session commission cannot be negative"
                }));
                setFormData({ ...formData, [name]: value });
                return;
            }
        }

        // Set form data
        setFormData({ ...formData, [name]: value });
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

        if (!formData.agentMatchShare || isNaN(agentMatchShare) || agentMatchShare < 0) {
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
            newErrors.password = "Password must be 2 capital letters followed by 4 digits";
            isValid = false;
        }

        // Validate agent commission fields based on agentCommissionType
        if (formData.agentCommissionType === "1") { // Bet By Bet
            const agentMatchComm = parseFloat(formData.agentMatchComm);
            const agentSessionComm = parseFloat(formData.agentSessionComm);
            const myMatchComm = parseFloat(formData.myMatchComm) || 0;
            const mySessionComm = parseFloat(formData.mySessionComm) || 0;

            // Validate agent match commission for Bet By Bet
            if (isNaN(agentMatchComm) || agentMatchComm < 0) {
                newErrors.agentMatchComm = "Please enter valid match commission";
                isValid = false;
            } else if (agentMatchComm > myMatchComm) {
                newErrors.agentMatchComm = `Cannot exceed ${myMatchComm}%`;
                isValid = false;
            }

            // Validate agent session commission for Bet By Bet
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
            super_admin_id: prev.super_admin_id,
            master_admin_id: prev.master_admin_id,
            coins: "",
            password: generatePassword(),
            myCoins: prev.myCoins,
            myMatchShare: prev.myMatchShare,
            agentMatchShare: "",
            myCommissionType: prev.myCommissionType,
            agentCommissionType: prev.agentCommissionType, // Keep the same commission type
            myMatchComm: prev.myMatchComm,
            agentMatchComm: prev.myMatchComm,
            mySessionComm: prev.mySessionComm,
            agentSessionComm: prev.mySessionComm,
            company_share: prev.company_share,
            reference: prev.reference,
            myCasinoComm: prev.myCasinoComm,
            myMatkaComm: prev.myMatkaComm,
            agentMatkaComm: "",
            username: prev.username
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

        // Validate form before submission
        if (!validateForm()) {
            toast.error("Please fill all required fields correctly");
            return;
        }

        if (!isFormValid) {
            toast.error("Form is not valid. Please check all fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                name: formData.name.trim(),
                password: formData.password,
                reference: formData.reference,
                super_admin_id: formData.super_admin_id,
                master_admin_id: formData.master_admin_id,
                coins: parseInt(formData.coins) || 0,
                match_share: parseFloat(formData.agentMatchShare) || 0,
                commission_type: formData.agentCommissionType,
                match_comm: parseFloat(formData.agentMatchComm) || 0,
                session_comm: parseFloat(formData.agentSessionComm) || 0,
                matka_comm: parseFloat(formData.agentMatkaComm) || 0,
                company_share: parseFloat(formData.company_share) || 0
            };

            console.log("Sending payload:", payload);

            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/create-super-agent-admin`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("SUCCESS:", res.data);
            if (res.data.success) {
                toast.success("Created Successfully!");
                resetForm();

                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            } else {
                toast.error(res.data.message || "Failed to create super agent admin");
            }

        } catch (err) {
            console.error("ERROR:", err);
            const errorMessage = err?.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
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

    const getCommissionTypeText = (type) => {
        switch (type) {
            case "1": return "Bet By Bet";
            case "0": return "No Match Commission";
            default: return "Unknown";
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
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Create Agent</h5>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-success btn-sm"
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

                            {/* Master Name */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Parent</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.username}
                                    readOnly
                                    style={{ backgroundColor: "#f8f9fa" }}
                                    disabled={isSubmitting}
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
                                <small className="text-muted">
                                    Your current balance: {formData.myCoins}
                                </small>
                            </div>

                            {/* Coins to Assign */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Coins to Assign <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.coins ? 'is-invalid' : ''}`}
                                    name="coins"
                                    value={formData.coins}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.myCoins}
                                    step="0.01"
                                    required
                                    disabled={isSubmitting}
                                    onKeyDown={blockInvalidKeys}
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
                                        title="Format: 2 capital letters followed by 4 digits"
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

                            {/* Agent Match Share */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Super Agent Match Share (%) <span className="text-danger">*</span></label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.agentMatchShare ? 'is-invalid' : ''}`}
                                    name="agentMatchShare"
                                    value={formData.agentMatchShare}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.myMatchShare}
                                    step="0.01"
                                    required
                                    disabled={isSubmitting}
                                    onKeyDown={blockInvalidKeys}
                                />
                                {errors.agentMatchShare && (
                                    <div className="invalid-feedback d-block">{errors.agentMatchShare}</div>
                                )}
                            </div>

                            {/* My Commission Type */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">My Commission Type</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={getCommissionTypeText(formData.myCommissionType)}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* Agent Commission Type */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Super Agent Commission Type <span className="text-danger">*</span>
                                </label>
                                <select
                                    className={`form-control ${errors.agentCommissionType ? 'is-invalid' : ''}`}
                                    name="agentCommissionType"
                                    value={formData.agentCommissionType}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select Commission Type</option>
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
                                <small className="text-muted">Your maximum match commission</small>
                            </div>

                            {/* Agent Match Comm */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Super Agent Match Comm (%)</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.agentMatchComm ? 'is-invalid' : ''}`}
                                    name="agentMatchComm"
                                    value={formData.agentMatchComm}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.myMatchComm}
                                    step="0.01"
                                    disabled={formData.agentCommissionType === "0" || isSubmitting}
                                    onKeyDown={blockInvalidKeys}
                                />
                                {errors.agentMatchComm && (
                                    <div className="invalid-feedback d-block">{errors.agentMatchComm}</div>
                                )}
                                {formData.agentCommissionType === "0" && (
                                    <small className="text-muted text-warning">
                                        Disabled for No Match Commission
                                    </small>
                                )}
                                {formData.agentCommissionType === "1" && (
                                    <small className="text-muted">
                                        Maximum: {formData.myMatchComm}%
                                    </small>
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
                                <small className="text-muted">Your maximum session commission</small>
                            </div>

                            {/* Agent Session Comm */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Super Agent Session Comm (%)</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.agentSessionComm ? 'is-invalid' : ''}`}
                                    name="agentSessionComm"
                                    value={formData.agentSessionComm}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.mySessionComm}
                                    step="0.01"
                                    disabled={formData.agentCommissionType === "0" || isSubmitting}
                                    onKeyDown={blockInvalidKeys}
                                />
                                {errors.agentSessionComm && (
                                    <div className="invalid-feedback d-block">{errors.agentSessionComm}</div>
                                )}
                                {formData.agentCommissionType === "0" && (
                                    <small className="text-muted text-warning">
                                        Disabled for No Match Commission
                                    </small>
                                )}
                                {formData.agentCommissionType === "1" && (
                                    <small className="text-muted">
                                        Maximum: {formData.mySessionComm}%
                                    </small>
                                )}
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

                            {/* Submit Button */}
                            <div className="col-12 text-center mt-4">
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!isFormValid || isSubmitting}
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
                                {!isFormValid && (
                                    <div className="text-danger mt-2">
                                        <small>Please fill all required fields (*) correctly to enable submit button</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateSuperAgentAdmin;