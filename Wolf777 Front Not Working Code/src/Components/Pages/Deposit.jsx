import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DepositPage.scss";
import Swal from "sweetalert2";
import axios from "axios";

const DepositPage = () => {
    const navigate = useNavigate();

    // Environment variables
    // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    // const nodeMode = process.env.NODE_ENV;
    // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


      const baseUrl = process.env.REACT_APP_BACKEND_API;


    // State management
    const [depositAmount, setDepositAmount] = useState("");
    const [buttonValues, setButtonValues] = useState([100, 500, 1000, 2000, 5000, 10000]);
    const [loading, setLoading] = useState(false);
    const [walletAmount, setWalletAmount] = useState(0);

    // Check authentication and fetch data on component mount
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            navigate("/login");
            return;
        }

        fetchWalletAmount();
    }, [navigate]);

    // 🔹 Fetch wallet amount
    const fetchWalletAmount = async () => {
        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) return;

            const response = await axios.get(
                `${baseUrl}/wallet-amount?userId=${userId}`
            );
            setWalletAmount(response.data.amount || 0);
        } catch (error) {
            console.error("Error fetching wallet amount:", error);
        }
    };

    // 🔹 Handle Quick Amount Selection
    const handleQuickAmount = (amount) => {
        setDepositAmount(amount.toString());
    };

    // 🔹 Handle Deposit Submission
    const handleDepositSubmit = async () => {
        if (!depositAmount || Number(depositAmount) <= 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Please enter a valid deposit amount",
            });
            return;
        }

        const userId = localStorage.getItem("user_id");
        setLoading(true);

        try {
            const requestData = {
                amount: Number(depositAmount),
                user_id: userId
            };

            console.log("Sending deposit request:", requestData);

            const response = await axios.post(
                `${baseUrl}/user-deposit`,
                {
                    amount: Number(depositAmount),
                    user_id: userId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                    }
                }
            );

            console.log("Deposit API Response:", response.data);

            // Access the response data correctly
            const responseData = response.data;

            // Check for success based on status_code from response data
            if (responseData.status_code === 200 || responseData.status_code === 201) {
                Swal.fire({
                    icon: "success",
                    title: "Deposit Successful",
                    text: responseData.message || `₹${depositAmount} deposited successfully!`,
                });
                setDepositAmount("");
                fetchWalletAmount(); // Refresh wallet amount
            } else if (responseData.status_code === 400) {
                Swal.fire({
                    icon: "error",
                    title: "Validation Error",
                    text: responseData.message || "Invalid amount provided",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Deposit Failed",
                    text: responseData.message || "Something went wrong",
                });
            }
        } catch (error) {
            console.error("Deposit error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to deposit. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="deposit-page">
            <div className="container">
                <div className="deposit-content">
                    <div className="deposit-section">
                        <div className="page-header">
                            <h1>Deposit Funds</h1>
                            <p>Add money to your wallet instantly</p>
                        </div>
                        
                        <div className="wallet-info">
                            <h3>Current Balance</h3>
                            <div className="wallet-amount">₹{walletAmount}</div>
                        </div>

                        <div className="deposit-form">
                            <div className="form-group">
                                <label>Enter Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter deposit amount"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    min="1"
                                />
                            </div>

                            <div className="quick-amounts-section">
                                <h4>Quick Amounts</h4>
                                <div className="quick-buttons-grid">
                                    {buttonValues.map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            className="quick-amount-btn"
                                            onClick={() => handleQuickAmount(amount)}
                                        >
                                            ₹{amount}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="btn btn-success deposit-btn"
                                onClick={handleDepositSubmit}
                                disabled={loading || !depositAmount || Number(depositAmount) <= 0}
                            >
                                {loading ? "Processing..." : "Deposit Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepositPage;