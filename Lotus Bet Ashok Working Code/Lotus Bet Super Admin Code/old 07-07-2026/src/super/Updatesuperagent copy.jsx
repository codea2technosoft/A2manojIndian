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
    const token = localStorage.getItem("token");
    const { id } = useParams();

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
        role_name: "", // Changed from role_name
        myMatchShare: "",
        agentMatchShare: "",
        myCommissionType: "1", // Changed to match API (1 for bet_by_bet, 2 for match_comm)
        agentCommissionType: "",
        myMatchComm: "",
        agentMatchComm: "",
        mySessionComm: "",
        agentSessionComm: "",
        // myCasinoComm: "",
        agentCasinoComm: "",
        // myMatkaComm: "",
        agentMatkaComm: "",
        password: generatePassword()
    });

    // Fetch Admin Data on component mount
    useEffect(() => {
        const fetchAdminData = async () => {
            const role = localStorage.getItem("role");

            // Check if token exists
            if (!token) {
                toast.error("Authentication token not found");
                navigate('/login');
                setLoading(false);
                return;
            }

            try {
                // Fetch logged-in admin data
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/get-edit-admin-details`,
                    {
                        // role: "3",
                        // admin_id: id

                        role: "4",
                        admin_id: id,
                        // master_admin_id: "ASFT78220",
                        master_role: "2",
                        // superagent_id: "ASFT38611",


                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log("Admin data response:", response.data);

                if (response.data.success) {
                    const adminProfile = response.data.data;

                    // Set admin data only if it exists
                    if (adminProfile) {
                        setAdminData(adminProfile);

                        // Set form data based on API response
                        setFormData(prev => ({
                            ...prev,
                            username: adminProfile.username || "",
                            role_name: adminProfile.role_name || "",
                            myMatchShare: adminProfile.match_share || "0",
                            myCommissionType: adminProfile.commission_type || "1",
                            myMatchComm: adminProfile.match_comm || "0",
                            mySessionComm: adminProfile.session_comm || "0",
                            // myCasinoComm: adminProfile.casino_comm || "0",
                            // myMatkaComm: adminProfile.matka_comm || "0"
                        }));
                        toast.success("Admin data loaded successfully!");
                    } else {
                        toast.error("No admin profile data found");
                        // Set default values if no profile
                        setFormData(prev => ({
                            ...prev,
                            myMatchShare: "0",
                            myCommissionType: "1",
                            myMatchComm: "0",
                            mySessionComm: "0",
                            // myCasinoComm: "0",
                            // myMatkaComm: "0"
                        }));
                    }
                } else {
                    toast.error("Failed to load admin data");
                    // Set default values on error
                    setFormData(prev => ({
                        ...prev,
                        myMatchShare: "0",
                        myCommissionType: "1",
                        myMatchComm: "0",
                        mySessionComm: "0",
                        // myCasinoComm: "0",
                        // myMatkaComm: "0"
                    }));
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
                toast.error("Failed to load admin data");
                // Set default values on error
                setFormData(prev => ({
                    ...prev,
                    myMatchShare: "0",
                    myCommissionType: "1",
                    myMatchComm: "0",
                    mySessionComm: "0",
                    // myCasinoComm: "0",
                    // myMatkaComm: "0"
                }));
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        // Handle agentCommissionType change
        if (name === "agentCommissionType") {
            const newFormData = { ...formData, [name]: value };

            // If Match Commission is selected (value "2"), set commission fields to 0
            if (value === "2") {
                newFormData.agentMatchComm = "0";
                newFormData.agentSessionComm = "0";
                newFormData.agentCasinoComm = "0";
                newFormData.agentMatkaComm = "0";
            }

            setFormData(newFormData);
            return;
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
                return;
            }

            if (inputValue < 0) {
                setErrors(prev => ({
                    ...prev,
                    [name]: "Match share cannot be negative"
                }));
                return;
            }
        }

        // Restrict commission percentages
        const commissionFields = ["agentMatchComm", "agentSessionComm", "agentCasinoComm", "agentMatkaComm"];
        if (commissionFields.includes(name)) {
            const myField = `my${name.replace("agent", "")}`;
            const myValue = parseFloat(formData[myField]) || 0;
            const inputValue = parseFloat(value) || 0;

            if (inputValue > myValue) {
                setErrors(prev => ({
                    ...prev,
                    [name]: `Cannot exceed ${myValue}%`
                }));
                return;
            }

            if (inputValue < 0) {
                setErrors(prev => ({
                    ...prev,
                    [name]: "Cannot be negative"
                }));
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

        // Validate agent commission fields if bet_by_bet is selected
        if (formData.agentCommissionType === "1") {
            const fieldsToValidate = [
                { name: "agentMatchComm", myName: "myMatchComm", label: "Match Commission" },
                { name: "agentSessionComm", myName: "mySessionComm", label: "Session Commission" },
                // { name: "agentCasinoComm", myName: "myCasinoComm", label: "Casino Commission" },
            ];

            fieldsToValidate.forEach(field => {
                const agentValue = parseFloat(formData[field.name]);
                const myValue = parseFloat(formData[field.myName]) || 0;

                if (isNaN(agentValue) || agentValue < 0) {
                    newErrors[field.name] = `Please enter valid ${field.label.toLowerCase()}`;
                    isValid = false;
                } else if (agentValue > myValue) {
                    newErrors[field.name] = `Cannot exceed ${myValue}%`;
                    isValid = false;
                }
            });
        }

        setErrors(newErrors);
        return isValid;
    };

    // ✅ Reset form after successful submission
    const resetForm = () => {
        setFormData(prev => ({
            name: "",
            username: prev.username || "",
            username: prev.username || "",
            role_name: prev.role_name || "",
            myMatchShare: prev.myMatchShare || "0",
            agentMatchShare: "",
            myCommissionType: prev.myCommissionType || "1",
            agentCommissionType: "",
            myMatchComm: prev.myMatchComm || "0",
            agentMatchComm: "",
            mySessionComm: prev.mySessionComm || "0",
            agentSessionComm: "",
            // myCasinoComm: prev.myCasinoComm || "0",
            agentCasinoComm: "",
            agentMatkaComm: "",
            password: generatePassword()
        }));
        setErrors({});
        setValidated(false);
    };

    const admin_id = localStorage.getItem("admin_id");
    const master_role = localStorage.getItem("role");
    const role = "3"; // Super Agent role

    // ✅ API SUBMIT - Create Super Agent Admin
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);
        setIsSubmitting(true);

        // Validate form
        if (!validateForm()) {
            setIsSubmitting(false);
            toast.error("Please fix the errors in the form");
            return;
        }

        try {
            // Prepare payload based on your API response structure
            const payload = {
                username: formData.name.trim(),
                // username: formData.username.trim(),
                password: formData.password,
                match_share: parseFloat(formData.agentMatchShare) || 0,
                commission_type: formData.agentCommissionType,
                match_comm: parseFloat(formData.agentMatchComm) || 0,
                session_comm: parseFloat(formData.agentSessionComm) || 0,
                casino_comm: parseFloat(formData.agentCasinoComm) || 0,
                matka_comm: parseFloat(formData.agentMatkaComm) || 0,
                role: "4", // Super Agent role
                admin_id: id,
                amount: 0,
                coins: 0,
                min_withdraw: 0,
                max_withdraw: 0,
                odd_min: 0,
                odd_max: 0,
                bookmaker_min: 0,
                bookmaker_max: 0,
                commission_rate: 0
            };

            console.log("Sending payload:", payload);

            // Use the correct endpoint
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/update-new-client`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("API Response:", res.data);
            if (res.data.success) {
                toast.success("Super Agent Admin Created Successfully!");

                // Reset form after successful submission
                resetForm();

                // Navigate back after 2 seconds
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

    // Helper function to get commission type display text
    const getCommissionTypeText = (type) => {
        if (type === "1") return "BET BY BET";
        if (type === "2") return "NO MATCH COMMISSION";
        return "BET BY BET";
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
                 <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
      <h3 className="card-title mb-0">Create Super Agent Admin</h3>
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

                            {/* USER INFO Section */}
                            <div className="col-12 mb-4">
                                <h5 className="border-bottom pb-2">USER INFO</h5>
                            </div>

                            {/* NAME */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">NAME <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Enter name"
                                />
                                {errors.name && (
                                    <div className="invalid-feedback d-block">{errors.name}</div>
                                )}
                            </div>

                            {/* USERNAME */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">USERNAME <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.role_name ? 'is-invalid' : ''}`}
                                    name="role_name"
                                    value={formData.role_name}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                    placeholder="Enter username"
                                />
                                {errors.role_name && (
                                    <div className="invalid-feedback d-block">{errors.role_name}</div>
                                )}
                            </div>



                            {/* MATCH AND SHARE INFO Section */}
                            <div className="col-12 my-4">
                                <h5 className="border-bottom pb-2">MATCH AND SHARE INFO</h5>
                            </div>

                            {/* MY MATCH SHARE */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MY MATCH SHARE</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${formData.myMatchShare}%`}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                                <small className="text-muted">Your current match share</small>
                            </div>

                            {/* MATCH SHARE (Agent) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MATCH SHARE <span className="text-danger">*</span></label>
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
                                    placeholder="Enter match share"
                                />
                                {errors.agentMatchShare && (
                                    <div className="invalid-feedback d-block">{errors.agentMatchShare}</div>
                                )}
                                <small className="text-muted">Max: {formData.myMatchShare}%</small>
                            </div>

                            {/* MY COMMISSION TYPE */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MY COMMISSION TYPE</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={getCommissionTypeText(formData.myCommissionType)}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* COMMISSION TYPE (Agent) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">COMMISSION TYPE <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.agentCommissionType ? 'is-invalid' : ''}`}
                                    name="agentCommissionType"
                                    value={formData.agentCommissionType}
                                    onChange={handleChange}
                                    required
                                    disabled={isSubmitting}
                                >
                                    <option value="">Select</option>
                                    <option value="1">BET BY BET</option>
                                    <option value="2">NO MATCH COMMISSION</option>
                                </select>
                                {errors.agentCommissionType && (
                                    <div className="invalid-feedback d-block">{errors.agentCommissionType}</div>
                                )}
                            </div>

                            {/* MY MATCH COMM */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MY MATCH COMM</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${formData.myMatchComm}%`}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* MATCH COMM (Agent) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MATCH COMM</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.agentMatchComm ? 'is-invalid' : ''}`}
                                    name="agentMatchComm"
                                    value={formData.agentMatchComm}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.myMatchComm}
                                    step="0.01"
                                    disabled={formData.agentCommissionType === "2" || isSubmitting}
                                    placeholder="Enter match commission"
                                />
                                {errors.agentMatchComm && (
                                    <div className="invalid-feedback d-block">{errors.agentMatchComm}</div>
                                )}
                                {formData.agentCommissionType === "2" && (
                                    <small className="text-muted text-warning">
                                        Disabled for NO MATCH COMMISSION type
                                    </small>
                                )}
                                <small className="text-muted">Max: {formData.myMatchComm}%</small>
                            </div>

                            {/* MY SESSION COMM */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MY SESSION COMM</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${formData.mySessionComm}%`}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* SESSION COMM (Agent) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">SESSION COMM</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.agentSessionComm ? 'is-invalid' : ''}`}
                                    name="agentSessionComm"
                                    value={formData.agentSessionComm}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.mySessionComm}
                                    step="0.01"
                                    disabled={formData.agentCommissionType === "2" || isSubmitting}
                                    placeholder="Enter session commission"
                                />
                                {errors.agentSessionComm && (
                                    <div className="invalid-feedback d-block">{errors.agentSessionComm}</div>
                                )}
                                {formData.agentCommissionType === "2" && (
                                    <small className="text-muted text-warning">
                                        Disabled for NO MATCH COMMISSION type
                                    </small>
                                )}
                                <small className="text-muted">Max: {formData.mySessionComm}%</small>
                            </div>

                            {/* MY CASINO COMM */}
                            {/* <div className="col-md-6 mb-3">
                                <label className="form-label">MY CASINO COMM</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${formData.myCasinoComm}%`}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div> */}

                            {/* CASINO COMM (Agent) */}
                            {/* <div className="col-md-6 mb-3">
                                <label className="form-label">CASINO COMM</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.agentCasinoComm ? 'is-invalid' : ''}`}
                                    name="agentCasinoComm"
                                    value={formData.agentCasinoComm}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.myCasinoComm}
                                    step="0.01"
                                    disabled={formData.agentCommissionType === "2" || isSubmitting}
                                    placeholder="Enter casino commission"
                                />
                                {errors.agentCasinoComm && (
                                    <div className="invalid-feedback d-block">{errors.agentCasinoComm}</div>
                                )}
                                {formData.agentCommissionType === "2" && (
                                    <small className="text-muted text-warning">
                                        Disabled for NO MATCH COMMISSION type
                                    </small>
                                )}
                                <small className="text-muted">Max: {formData.myCasinoComm}%</small>
                            </div> */}

                            {/* MY MATKA COMM */}
                            {/* <div className="col-md-6 mb-3">
                                <label className="form-label">MY MATKA COMM</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${formData.myMatkaComm}%`}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div> */}

                            {/* MATKA COMM (Agent) */}
                            {/* <div className="col-md-6 mb-3">
                                <label className="form-label">MATKA COMM</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.agentMatkaComm ? 'is-invalid' : ''}`}
                                    name="agentMatkaComm"
                                    value={formData.agentMatkaComm}
                                    onChange={handleChange}
                                    min="0"
                                    max={formData.myMatkaComm}
                                    step="0.01"
                                    disabled={formData.agentCommissionType === "2" || isSubmitting}
                                    placeholder="Enter matka commission"
                                />
                                {errors.agentMatkaComm && (
                                    <div className="invalid-feedback d-block">{errors.agentMatkaComm}</div>
                                )}
                                {formData.agentCommissionType === "2" && (
                                    <small className="text-muted text-warning">
                                        Disabled for NO MATCH COMMISSION type
                                    </small>
                                )}
                                <small className="text-muted">Max: {formData.myMatkaComm}%</small>
                            </div> */}

                            {/* Submit Button */}
                            <div className="col-12 text-center mt-4">
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-5"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            "submit"
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