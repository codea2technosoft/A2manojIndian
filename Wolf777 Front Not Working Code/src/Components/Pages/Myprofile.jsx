import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, CardHeader, Card, CardTitle, CardBody } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";

const Myprofile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [rateDifference, setRateDifference] = useState("0");
    const [updatingRate, setUpdatingRate] = useState(false);

    // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    // const nodeMode = process.env.NODE_ENV;
    // const baseUrl =
    //     nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

    const baseUrl = process.env.REACT_APP_BACKEND_API;


    const [showModal, setShowModal] = useState(false);
    const userId = localStorage.getItem("user_id");
    const navigate = useNavigate();

    // Fetch Profile
    useEffect(() => {


        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        if (!userId) {
            setError("User ID not found");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${baseUrl}/profile`, {
                id: userId,
            });
            if (res.data?.success && res.data?.data) {
                setProfile(res.data.data);
                // Set rate difference from profile if available
                if (res.data.data.rate_difference !== undefined) {
                    setRateDifference(res.data.data.rate_difference.toString());
                }
                setError("");
            } else {
                setProfile(null);
                setError("No profile data found");
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    // Handle password input changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    // Handle rate difference change
    const handleRateChange = (e) => {
        setRateDifference(e.target.value);
    };

    // Update rate difference
    const handleUpdateRate = async () => {
        if (!userId) {
            toast.error("User ID not found");
            return;
        }

        // Validate rate difference
        const rateValue = parseInt(rateDifference);
        if (isNaN(rateValue) || rateValue < 0 || rateValue > 6) {
            // toast.error("Please select a valid rate difference (0, 1, or 2)");
            return;
        }

        try {
            setUpdatingRate(true);

            const res = await axios.post(`${baseUrl}/rate-difference`, {
                user_id: userId,
                rate_difference: rateDifference.toString() // Ensure it's a string
            });

            if (res.data?.success) {
                toast.success("Rate difference updated successfully!");
                fetchProfile();

                // Update local profile state
                if (profile) {
                    setProfile({
                        ...profile,
                        rate_difference: rateDifference
                    });
                }
            } else {
                const errorMessage = res.data?.message || "Failed to update rate difference";
                toast.success(errorMessage);
            }
        } catch (err) {
            console.error("Error updating rate difference:", err);
            let errorMessage = "Error updating rate difference";

            if (err.response) {
                errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = "No response from server. Please check your connection.";
            }

            toast.error(errorMessage);
        } finally {
            setUpdatingRate(false);
        }
    };

    // Submit new password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        if (passwordData.newPassword === passwordData.oldPassword) {
            toast.error("New password must be different from old password");
            return;
        }

        try {
            const res = await axios.post(`${baseUrl}/update-Password`, {
                user_id: userId,
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword,
            });

            if (res.data?.success) {
                toast.success("Password updated successfully!");
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setShowModal(false);
            } else {
                const errorMessage = res.data?.message || "Failed to update password";
                toast.error(errorMessage);

                if (errorMessage.toLowerCase().includes("old password")) {
                    setPasswordData(prev => ({
                        ...prev,
                        oldPassword: ""
                    }));
                }
            }
        } catch (err) {
            console.error("Error updating password:", err);
            let errorMessage = "Error updating password";

            if (err.response) {
                errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
            } else if (err.request) {
                errorMessage = "No response from server. Please check your connection.";
            }

            toast.error(errorMessage);
        }
    };

    return (
        <div className="profilepage">
            <ToastContainer position="top-right" autoClose={500} />

            {/* Main Container */}
            <div className="container-fluid">
                {loading ? (
                    <p style={{ color: "#fff", textAlign: "center" }}>Loading profile...</p>
                ) : error ? (
                    <p style={{ color: "#e63946" }}>{error}</p>
                ) : profile ? (
                    <div className="">
                        <button
                            className="backtomenu"
                            onClick={() => navigate("/indexpage")}
                        >
                            Back To Main Menu
                        </button>
                        <div className="row g-4">
                            {/* Rate Information Card */}
                            <div className="col-12 col-md-6">
                                <div className="card h-100">
                                    <div className="card-header custum_bg fw-semibold">
                                        Rate Information
                                    </div>

                                    <div className="card-body">
                                        <strong>Rate Difference:</strong>

                                        <div className="d-flex gap-2 mt-2 w-100 align-items-center">
                                            <select
                                                className="form-select w-100"
                                                value={rateDifference}
                                                onChange={handleRateChange}
                                                disabled={updatingRate}
                                            >
                                                <option value="0">0</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>

                                            <div className="">
                                                <button
                                                    className="update_button"
                                                    onClick={() => {
                                                        handleUpdateRate();
                                                        fetchProfile();
                                                    }}
                                                    disabled={updatingRate}
                                                >
                                                    {updatingRate ? "Updating..." : "Update"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Display current rate difference from profile */}
                                        {profile.rate_difference !== undefined && (
                                            <div className="mt-3 text-muted small">
                                                Current setting: {profile.rate_difference}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information Card */}
                            <div className="col-12 col-md-6">
                                <div className="card h-100">
                                    <div className="card-header fw-semibold custum_bg">
                                        Personal Information
                                    </div>

                                    <div className="card-body">
                                        <div className="row mb-2">
                                            <div className="col-5 text-muted">Client Name:</div>
                                            <div className="col-7 fw-semibold">{profile.username || "N/A"}</div>
                                        </div>

                                        <div className="row mb-2">
                                            <div className="col-5 text-muted">Client Code:</div>
                                            <div className="col-7 fw-semibold">{profile.admin_id || "N/A"}</div>
                                        </div>

                                        {/* <div className="row mb-2">
                                            <div className="col-5 text-muted">Exposure:</div>
                                            <div className="col-7 fw-semibold">0</div>
                                        </div> */}

                                        {/* Display Rate Difference in personal info if you want */}
                                        <div className="row mb-2">
                                            <div className="col-5 text-muted">Rate Difference:</div>
                                            <div className="col-7 fw-semibold">
                                                {profile.rate_difference !== undefined ? profile.rate_difference : "Not set"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p style={{ color: "#8d99ae" }}>No profile data available.</p>
                )}

                {/* Change Password Button */}
                {/* <div className="changepassword mt-4">
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}
                    >
                        Change Password
                    </button>
                </div> */}
            </div>

            {/* Change Password Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePasswordSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Old Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" variant="success">
                            Update Password
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Myprofile;