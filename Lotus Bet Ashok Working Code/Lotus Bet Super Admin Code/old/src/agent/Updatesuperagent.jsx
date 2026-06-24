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
                            myCommissionType: adminProfile.commission_type || "1",
                            myMatchComm: adminProfile.match_comm || "0",
                            mySessionComm: adminProfile.session_comm || "0",
                            agentMatchShare: adminProfile.match_share || "0",
                            agentCommissionType: adminProfile.commission_type || "1",
                            agentMatchComm: adminProfile.match_comm || "0",
                            agentSessionComm: adminProfile.session_comm || "0"
                        }));
                        toast.success("Admin data loaded successfully!");
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

        // If commission type is changed to "NO MATCH COMMISSION"
        // if (name === "agentCommissionType") {
        //     if (value === "0") {
        //         // Disable and set MATCH COMM and SESSION COMM to 0
        //         setFormData(prev => ({
        //             ...prev,
        //             [name]: value,
        //             agentMatchComm: "0",
        //             agentSessionComm: "0"
        //         }));
        //     } else {
        //         setFormData(prev => ({
        //             ...prev,
        //             [name]: value
        //         }));
        //     }
        // } else {
        //     // For other fields
        //     setFormData(prev => ({
        //         ...prev,
        //         [name]: value
        //     }));
        // }

        if (name === "agentCommissionType") {
            if (value === "0") { 
                setFormData(prev => ({
                    ...prev,
                    agentCommissionType: value,
                    agentMatchComm: "0",
                    agentSessionComm: "0"
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    agentCommissionType: value
                }));
            }
            return;
        }
           const percentFields = [
        "agentMatchShare",
        "agentMatchComm",
        "agentSessionComm"
    ];

    if (percentFields.includes(name)) {
        let num = Number(value);

        if (num > 100) num = 100;
        if (num < 0) num = 0;

        setFormData(prev => ({
            ...prev,
            [name]: num.toString()
        }));
        return;
    }


    };
  const blockInvalidKeys = (e) => {
    const key = e.key;

    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
        e.preventDefault();
    }
};
    const admin_id = localStorage.getItem("admin_id");
    const master_role = localStorage.getItem("role");
    const role = "3"; // Super Agent role

    // ✅ API SUBMIT - Create Super Agent Admin
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare payload based on your API response structure
            const payload = {
                username: formData.username.trim(),
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
            if (res.data.success) {
                navigate(-1);
            } else {
                toast.error(res.data.message);
            }

        } catch (err) {
            const errorMessage = err?.response?.data?.message;
            console.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
// localStorage.setItem("selectedMasterId", m.admin_id)
   const master_id = localStorage.getItem("master_admin_id");
 console.log("get master id",master_id)
    const [AdminData, setAdminDataNEW] = useState("")
 
useEffect(() => {
    const fetchAdminData = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/get-admin-details`,
                {
                    role: "2",
                    admin_id: master_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (response.data.success) {
                setAdminDataNEW(response.data.data.admin_profile);
            }
        } catch (err) {
            console.error("Master admin fetch error", err);
        }
    };

    fetchAdminData();
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
    const getCommissionTypeText = (type) => {
        if (type === "1") return "BET BY BET";
        if (type === "0") return "NO MATCH COMMISSION";
        return "BET BY BET";
    };
    // % validation (0–100)
 

    // Check if NO MATCH COMMISSION is selected
    const isNoMatchCommission = formData.agentCommissionType === "0";

    return (
        <>
            <div className="card">
                <div className="card-header bg-primary-yellow p-2 text-white d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Update Super — {formData.username}</h5>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-success btn-sm"
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
                                <h5 className="border-bottom pb-2">USER INFO</h5>
                            </div>

                            {/* NAME */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">NAME</label>
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
                                <label className="form-label">USERNAME</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    // name="username"
                                    value={AdminData.username}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    placeholder="Enter username"
                                />
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
                                    value={`${AdminData.match_share ?? 0}%`}
                                    style={{ backgroundColor: "#f8f9fa" }}
                                />
                            </div>

                            {/* MATCH SHARE (Agent) */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">MATCH SHARE</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="agentMatchShare"
                                    value={formData.agentMatchShare}
                                    onChange={handleChange}
                                    onKeyDown={blockInvalidKeys}
                                    placeholder="Enter match share"
                                />
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
                                    type="text"
                                    className="form-control"
                                    name="agentMatchComm"
                                    value={formData.agentMatchComm}
                                    onKeyDown={blockInvalidKeys}
                                    onChange={handleChange}
                                    disabled={isNoMatchCommission || isSubmitting}
                                    placeholder={isNoMatchCommission ? "Disabled for NO MATCH COMMISSION" : "Enter match commission"}
                                    style={isNoMatchCommission ? { backgroundColor: "#e9ecef", cursor: "not-allowed" } : {}}
                                />
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
                                    type="text"
                                    className="form-control"
                                    name="agentSessionComm"
                                    value={formData.agentSessionComm}
                                    onChange={handleChange}
                                    onKeyDown={blockInvalidKeys}
                                    disabled={isNoMatchCommission || isSubmitting}
                                    placeholder={isNoMatchCommission ? "Disabled for NO MATCH COMMISSION" : "Enter session commission"}
                                    style={isNoMatchCommission ? { backgroundColor: "#e9ecef", cursor: "not-allowed" } : {}}
                                />
                                {isNoMatchCommission && (
                                    <small className="text-muted">Disabled for NO MATCH COMMISSION (set to 0)</small>
                                )}
                            </div>



                            {/* MATKA COMM (Agent) */}

                            {/* Submit Button */}
                            <div className="col-12 text-center mt-4">
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-5"
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