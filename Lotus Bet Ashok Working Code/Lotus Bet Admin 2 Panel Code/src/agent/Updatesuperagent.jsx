import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

const CreateSuperAgentAdmin = () => {
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [matchShareError, setMatchShareError] = useState("");
    const [matchCommError, setMatchCommError] = useState("");
    const [sessionCommError, setSessionCommError] = useState("");
    const token = localStorage.getItem("token");
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        myMatchShare: "",
        agentMatchShare: "",
        myCommissionType: "1",
        agentCommissionType: "",
        myMatchComm: "",
        agentMatchComm: "",
        mySessionComm: "",
        agentSessionComm: "",
        agentCasinoComm: "",
        agentMatkaComm: "",
    });

    // Fetch Admin Data on component mount
    useEffect(() => {
        const fetchAdminData = async () => {
            if (!token) {
                toast.error("Authentication token not found");
                navigate('/login');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/get-edit-admin-details`,
                    {
                        role: "3",
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
                    const adminProfile = response.data.data;
                    
                    if (adminProfile) {
                        setAdminData(adminProfile);

                        setFormData(prev => ({
                            ...prev,
                            username: adminProfile.username || "",
                            name: adminProfile.name || "",
                            myMatchShare: adminProfile.match_share || "0",
                            myCommissionType: adminProfile.commission_type,
                            myMatchComm: adminProfile.match_comm || "0",
                            mySessionComm: adminProfile.session_comm || "0",
                            agentMatchShare: adminProfile.match_share || "0",
                            agentCommissionType: adminProfile.commission_type,
                            agentMatchComm: adminProfile.match_comm || "0",
                            agentSessionComm: adminProfile.session_comm || "0"
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
                toast.error("Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [token, navigate, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear validation errors when user starts typing
        if (name === "agentMatchShare") {
            setMatchShareError("");
        }
        if (name === "agentMatchComm") {
            setMatchCommError("");
        }
        if (name === "agentSessionComm") {
            setSessionCommError("");
        }

        // If commission type is changed to "NO MATCH COMMISSION"
        if (name === "agentCommissionType") {
            if (value === "0") { // Changed from "2" to "0" based on your options
                // Disable and set MATCH COMM and SESSION COMM to 0
                setFormData(prev => ({
                    ...prev,
                    [name]: value,
                    agentMatchComm: "0",
                    agentSessionComm: "0"
                }));
                // Clear errors when NO MATCH COMMISSION is selected
                setMatchCommError("");
                setSessionCommError("");
            } else {
                // For other commission types, keep existing values
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
            }
        } else {
            // For other fields
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Real-time validation for match share
        if (name === "agentMatchShare" && adminData) {
            const matchShare = parseFloat(value);
            const adminMatchShare = parseFloat(adminData?.match_share || 0);
            
            if (!isNaN(matchShare) && matchShare > adminMatchShare) {
                setMatchShareError(`Match share cannot exceed your match share (${adminMatchShare}%)`);
            } else {
                setMatchShareError("");
            }
        }

        // Real-time validation for match commission
        if (name === "agentMatchComm" && adminData && formData.agentCommissionType === "1") {
            const matchComm = parseFloat(value);
            const adminMatchComm = parseFloat(adminData?.match_comm || 0);
            
            if (!isNaN(matchComm) && matchComm > adminMatchComm) {
                setMatchCommError(`Match commission cannot exceed your match commission (${adminMatchComm}%)`);
            } else {
                setMatchCommError("");
            }
        }

        // Real-time validation for session commission
        if (name === "agentSessionComm" && adminData && formData.agentCommissionType === "1") {
            const sessionComm = parseFloat(value);
            const adminSessionComm = parseFloat(adminData?.session_comm || 0);
            
            if (!isNaN(sessionComm) && sessionComm > adminSessionComm) {
                setSessionCommError(`Session commission cannot exceed your session commission (${adminSessionComm}%)`);
            } else {
                setSessionCommError("");
            }
        }
    };

    const admin_id = localStorage.getItem("admin_id");
    const master_role = localStorage.getItem("role");
    const role = "3"; // Super Agent role

    // ✅ API SUBMIT - Create Super Agent Admin
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Clear previous validation errors
        setMatchShareError("");
        setMatchCommError("");
        setSessionCommError("");

        // Validation
        if (!formData.username || formData.username.toString().trim() === "") {
            toast.error("Please enter name");
            return;
        }
        
        if (!formData.agentMatchShare || formData.agentMatchShare.toString().trim() === "" || isNaN(formData.agentMatchShare)) {
            toast.error("Please enter valid match share");
            return;
        }
        
        const matchShare = parseFloat(formData.agentMatchShare);
        if (matchShare < 0 || matchShare > 100) {
            toast.error("Match share must be between 0 and 100");
            return;
        }
        
        // Validate agent match share is less than or equal to admin's match share
        const adminMatchShare = parseFloat(adminData?.match_share || 0);
        if (matchShare > adminMatchShare) {
            const errorMsg = `Match share cannot exceed your match share (${adminMatchShare}%)`;
            toast.error(errorMsg);
            setMatchShareError(errorMsg);
            return;
        }
        
        if (!formData.agentCommissionType || formData.agentCommissionType.toString().trim() === "") {
            toast.error("Please select commission type");
            return;
        }
        
        if (formData.agentCommissionType === "1") {
            // BET BY BET validation
            if (!formData.agentMatchComm || formData.agentMatchComm.toString().trim() === "" || isNaN(formData.agentMatchComm)) {
                toast.error("Please enter valid match commission");
                return;
            }
            
            const matchComm = parseFloat(formData.agentMatchComm);
            if (matchComm < 0 || matchComm > 100) {
                toast.error("Match commission must be between 0 and 100");
                return;
            }
            
            // Validate agent match commission is less than or equal to admin's match commission
            const adminMatchComm = parseFloat(adminData?.match_comm || 0);
            if (matchComm > adminMatchComm) {
                const errorMsg = `Match commission cannot exceed your match commission (${adminMatchComm}%)`;
                toast.error(errorMsg);
                setMatchCommError(errorMsg);
                return;
            }
            
            if (!formData.agentSessionComm || formData.agentSessionComm.toString().trim() === "" || isNaN(formData.agentSessionComm)) {
                toast.error("Please enter valid session commission");
                return;
            }
            
            const sessionComm = parseFloat(formData.agentSessionComm);
            if (sessionComm < 0 || sessionComm > 100) {
                toast.error("Session commission must be between 0 and 100");
                return;
            }
            
            // Validate agent session commission is less than or equal to admin's session commission
            const adminSessionComm = parseFloat(adminData?.session_comm || 0);
            if (sessionComm > adminSessionComm) {
                const errorMsg = `Session commission cannot exceed your session commission (${adminSessionComm}%)`;
                toast.error(errorMsg);
                setSessionCommError(errorMsg);
                return;
            }
        }
        
        // Validate casino commission
        if (formData.agentCasinoComm && formData.agentCasinoComm.toString().trim() !== "") {
            const casinoComm = parseFloat(formData.agentCasinoComm);
            if (isNaN(casinoComm) || casinoComm < 0 || casinoComm > 100) {
                toast.error("Casino commission must be between 0 and 100");
                return;
            }
        }
        
        // Validate matka commission
        if (formData.agentMatkaComm && formData.agentMatkaComm.toString().trim() !== "") {
            const matkaComm = parseFloat(formData.agentMatkaComm);
            if (isNaN(matkaComm) || matkaComm < 0 || matkaComm > 100) {
                toast.error("Matka commission must be between 0 and 100");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            // Prepare payload based on your API response structure
            const payload = {
                username: formData.username.toString().trim(),
                match_share: parseFloat(formData.agentMatchShare) || 0,
                commission_type: formData.agentCommissionType,
                match_comm: parseFloat(formData.agentMatchComm) || 0,
                session_comm: parseFloat(formData.agentSessionComm) || 0,
                casino_comm: parseFloat(formData.agentCasinoComm) || 0,
                matka_comm: parseFloat(formData.agentMatkaComm) || 0,
                role: role,
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
                toast.success("Created Successfully!!");

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

    /////////////////////////////////////
    const [AdminData, setAdminDataNEW] = useState("")
    useEffect(() => {
        const fetchAdminData = async () => {
            const admin_id = localStorage.getItem("admin_id");
            const role = localStorage.getItem("role");

            try {
                // Fetch logged-in admin data
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/get-data`,
                    {
                        role: role,
                        admin_id: admin_id
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
                    setAdminDataNEW(adminProfile);
                 
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
    }, []);

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
        if (type == "1") return "BET BY BET";
        if (type == "0") return "NO MATCH COMMISSION";
        return "BET BY BET";
    };

    // Check if NO MATCH COMMISSION is selected
    const isNoMatchCommission = formData.agentCommissionType === "0";
    
    // Check if any validation errors exist
    const hasValidationErrors = matchShareError || matchCommError || sessionCommError;
   
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
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0">Create Agent Admin</h3>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-light"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">

                            {/* USER INFO Section */}
                            <div className="col-12 mb-4">
                                <h6 className="border-bottom pb-2">USER INFO</h6>
                            </div>

                            {/* NAME */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter name"
                                />
                            </div>

                            {/* USERNAME */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">User Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={AdminData.username}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    placeholder="Enter username"
                                />
                            </div>

                      
                            {/* MATCH AND SHARE INFO Section */}
                            <div className="col-12 my-4">
                                <h6 className="border-bottom pb-2">MATCH AND SHARE INFO</h6>
                            </div>

                            {/* MY MATCH SHARE */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">My Share</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${AdminData.match_share}%`}
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* MATCH SHARE (Agent) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MATCH SHARE</label>
                                <input
                                    type="number"
                                    className={`form-control ${matchShareError ? 'is-invalid' : ''}`}
                                    name="agentMatchShare"
                                    value={formData.agentMatchShare}
                                    onChange={handleChange}
                                    placeholder="Enter match share"
                                />
                                {matchShareError && (
                                    <div className="invalid-feedback d-block">
                                        {matchShareError}
                                    </div>
                                )}
                                {!matchShareError && formData.agentMatchShare && adminData && (
                                    <div className="form-text">
                                        Your match share: {adminData.match_share}%
                                    </div>
                                )}
                            </div>

                            {/* MY COMMISSION TYPE */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MY COMMISSION TYPE</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={getCommissionTypeText(AdminData.commission_type)}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* COMMISSION TYPE (Agent) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">COMMISSION TYPE</label>
                                <select
                                    className="form-select"
                                    name="agentCommissionType"
                                    value={formData.agentCommissionType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="1">BET BY BET</option>
                                    <option value="0">NO MATCH COMMISSION</option>
                                </select>
                            </div>

                            {/* MY MATCH COMM */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MY MATCH COMM</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${AdminData.match_comm}%`}
                                    disabled
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* MATCH COMM (Agent) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MATCH COMM</label>
                                <input
                                    type="number"
                                    className={`form-control ${matchCommError ? 'is-invalid' : ''} ${isNoMatchCommission ? 'bg-light' : ''}`}
                                    name="agentMatchComm"
                                    value={formData.agentMatchComm}
                                    onChange={handleChange}
                                    disabled={isNoMatchCommission || isSubmitting}
                                    placeholder={isNoMatchCommission ? "Disabled for NO MATCH COMMISSION" : "Enter match commission"}
                                    style={isNoMatchCommission ? { backgroundColor: "#e9ecef", cursor: "not-allowed" } : {}}
                                />
                                {matchCommError && (
                                    <div className="invalid-feedback d-block">
                                        {matchCommError}
                                    </div>
                                )}
                                {!matchCommError && formData.agentMatchComm && adminData && formData.agentCommissionType === "1" && (
                                    <div className="form-text">
                                        Your match commission: {adminData.match_comm}%
                                    </div>
                                )}
                                {isNoMatchCommission && (
                                    <small className="text-muted">Disabled for NO MATCH COMMISSION (set to 0)</small>
                                )}
                            </div>

                            {/* MY SESSION COMM */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MY SESSION COMM</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={`${AdminData.session_comm}%`}
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* SESSION COMM (Agent) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">SESSION COMM</label>
                                <input
                                    type="number"
                                    className={`form-control ${sessionCommError ? 'is-invalid' : ''} ${isNoMatchCommission ? 'bg-light' : ''}`}
                                    name="agentSessionComm"
                                    value={formData.agentSessionComm}
                                    onChange={handleChange}
                                    disabled={isNoMatchCommission || isSubmitting}
                                    placeholder={isNoMatchCommission ? "Disabled for NO MATCH COMMISSION" : "Enter session commission"}
                                    style={isNoMatchCommission ? { backgroundColor: "#e9ecef", cursor: "not-allowed" } : {}}
                                />
                                {sessionCommError && (
                                    <div className="invalid-feedback d-block">
                                        {sessionCommError}
                                    </div>
                                )}
                                {!sessionCommError && formData.agentSessionComm && adminData && formData.agentCommissionType === "1" && (
                                    <div className="form-text">
                                        Your session commission: {adminData.session_comm}%
                                    </div>
                                )}
                                {isNoMatchCommission && (
                                    <small className="text-muted">Disabled for NO MATCH COMMISSION (set to 0)</small>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="col-12 text-center mt-4">
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={isSubmitting || hasValidationErrors}
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