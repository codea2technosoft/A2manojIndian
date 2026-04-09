import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./Withdraw.scss";

const Withdraw = () => {
  const navigate = useNavigate();

  // Environment variables
  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  // State management
  const [withdrawData, setWithdrawData] = useState({
    amount: "",
    accountNo: "",
    ifsc: "",
    bankName: "",
    accountHolderName: ""
  });
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [betHistory, setBetHistory] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    amount: "",
    accountNo: "",
    ifsc: "",
    bankName: "",
    accountHolderName: ""
  });

  // Check authentication and fetch data on component mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }
    
    fetchWalletBalance();
    fetchBetHistory();
  }, [navigate]);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const response = await axios.get(
        `${baseUrl}/wallet-amount?userId=${userId}`
      );
      
      if (response.data && response.data.amount !== undefined) {
        setWalletBalance(response.data.amount);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  // Fetch bet history
  const fetchBetHistory = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      // Mock data for bet history - replace with actual API call
      const mockBetHistory = [];
      setBetHistory(mockBetHistory);
    } catch (error) {
      console.error("Error fetching bet history:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setWithdrawData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (value.trim() !== "" && fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle input blur to validate individual fields
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "amount":
        if (!value || value.trim() === "" || isNaN(Number(value)) || Number(value) <= 0) {
          error = "Please enter a valid amount";
        } else if (Number(value) < 500) {
          error = "Minimum withdrawal amount is ₹500";
        } else if (Number(value) > walletBalance) {
          error = "Insufficient wallet balance";
        }
        break;

      case "bankName":
        if (!value || value.trim() === "") {
          error = "Bank name is required";
        } else if (value.trim().length < 2) {
          error = "Bank name must be at least 2 characters";
        }
        break;

      case "accountHolderName":
        if (!value || value.trim() === "") {
          error = "Account holder name is required";
        } else if (value.trim().length < 2) {
          error = "Account holder name must be at least 2 characters";
        }
        break;

      case "accountNo":
        const cleanAccountNo = value.replace(/\s/g, "");
        if (!cleanAccountNo || cleanAccountNo === "") {
          error = "Account number is required";
        } else if (!/^\d+$/.test(cleanAccountNo)) {
          error = "Please enter a valid account number (digits only)";
        } else if (cleanAccountNo.length < 9) {
          error = "Account number must be at least 9 digits";
        } else if (cleanAccountNo.length > 18) {
          error = "Account number cannot exceed 18 digits";
        }
        break;

      case "ifsc":
        const cleanIfsc = value.trim().toUpperCase();
        if (!cleanIfsc || cleanIfsc === "") {
          error = "IFSC code is required";
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
          error = "Please enter a valid IFSC code (Format: ABCD0123456)";
        }
        break;

      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Check if form has any errors
  const hasFormErrors = () => {
    return Object.values(fieldErrors).some(error => error !== "") ||
           Object.values(withdrawData).some(value => value.trim() === "");
  };

  // Validate all form fields
  const validateForm = () => {
    // First validate all fields
    Object.keys(withdrawData).forEach(field => {
      validateField(field, withdrawData[field]);
    });

    // Check if any errors exist
    const hasErrors = Object.values(fieldErrors).some(error => error !== "");
    
    // Check if all fields are filled
    const allFieldsFilled = Object.values(withdrawData).every(value => 
      value && value.toString().trim() !== ""
    );

    return !hasErrors && allFieldsFilled;
  };

  // Handle form submission - FIXED VERSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Submit button clicked");
    
    if (isSubmitting) {
      console.log("Already submitting, returning...");
      return;
    }
    
    setIsSubmitting(true);
    console.log("isSubmitting set to true");

    // Validate form
    const isValid = validateForm();
    console.log("Form validation result:", isValid);
    console.log("Field errors:", fieldErrors);
    console.log("Form data:", withdrawData);

    if (!isValid) {
      console.log("Form validation failed");
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = localStorage.getItem("user_id");
      console.log("User ID:", userId);
      
      const requestData = {
        user_id: userId,
        amount: Number(withdrawData.amount),
        bank_name: withdrawData.bankName.trim(),
        account_holder_name: withdrawData.accountHolderName.trim(),
        account_number: withdrawData.accountNo.replace(/\s/g, ""),
        ifsc_code: withdrawData.ifsc.trim().toUpperCase(),
        mobile: localStorage.getItem("mobile") || "0000000000",
      };

      console.log("Sending withdrawal request:", requestData);

      const response = await axios.post(
        `${baseUrl}/withdraw`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      console.log("Withdrawal API Response:", response.data);

      if (response.data.status_code === 200 || response.data.success === "1" || response.data.message?.includes("successfully")) {
        
        Swal.fire({
          icon: "success",
          title: "Withdrawal Successful!",
          html: `
            <div style="text-align: center;">
              <div style="font-size: 2rem; color: #27ae60; margin-bottom: 15px;">✅</div>
              <h3 style="color: #27ae60; margin-bottom: 15px;">${response.data.message || "Withdrawal request submitted successfully!"}</h3>
              ${response.data.data ? `
                <div style="text-align: left; background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${response.data.data.transaction_id || 'N/A'}</p>
                  <p style="margin: 5px 0;"><strong>Withdrawn Amount:</strong> ₹${response.data.data.withdrawn_amount || withdrawData.amount}</p>
                  <p style="margin: 5px 0;"><strong>Available Balance:</strong> ₹${response.data.data.available_balance || (walletBalance - withdrawData.amount)}</p>
                </div>
              ` : ''}
              <p style="color: #666; font-size: 0.9rem;">Your funds will be transferred within 24-48 hours.</p>
            </div>
          `,
          confirmButtonText: "OK",
          confirmButtonColor: "#27ae60",
        }).then(() => {
          // Reset form and field errors
          setWithdrawData({
            amount: "",
            accountNo: "",
            ifsc: "",
            bankName: "",
            accountHolderName: ""
          });
          setFieldErrors({
            amount: "",
            accountNo: "",
            ifsc: "",
            bankName: "",
            accountHolderName: ""
          });

          // Refresh balance
          fetchWalletBalance();
        });

      } else {
        throw new Error(response.data.message || "Withdrawal failed");
      }

    } catch (error) {
      console.error("Withdrawal error:", error);
      
      let errorMessage = "Failed to submit withdrawal request. Please try again.";
      
      if (error.response) {
        const responseData = error.response.data;
        
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
        
        console.error("Server response:", responseData);
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }
      
      Swal.fire({
        icon: "error",
        title: "Withdrawal Failed",
        text: errorMessage,
        confirmButtonText: "OK",
        confirmButtonColor: "#e74c3c",
      });
    } finally {
      setIsSubmitting(false);
      console.log("isSubmitting set to false");
    }
  };

  // Helper function to get input class name based on field error
  const getInputClassName = (fieldName) => {
    return fieldErrors[fieldName] ? "form-input error-border" : "form-input";
  };

  // Check if button should be disabled
  const isSubmitDisabled = () => {
    return isSubmitting || 
           walletBalance < 500 || 
           hasFormErrors() ||
           Object.values(withdrawData).some(value => !value || value.toString().trim() === "");
  };

  return (
    <div className="withdraw-page">
      <div className="withdraw-grid-container">
        
        {/* Left Column - Withdraw Form */}
        <div className="withdraw-form-section">
          <div className="form-container">
            {/* Header */}
            <div className="withdraw-header">
              <h1>Withdraw Funds</h1>
            </div>

            {/* Balance Info */}
            <div className="balance-info">
              <div className="balance-label">Available Balance</div>
              <div className="balance-amount">₹{walletBalance}</div>
            </div>

            {/* Withdraw Form */}
            <form onSubmit={handleSubmit} className="withdraw-form" noValidate>
              {/* Bank Name */}
              <div className="form-group">
                <label htmlFor="bankName">Bank Name</label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={withdrawData.bankName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Enter bank name"
                  className={getInputClassName("bankName")}
                />
                {fieldErrors.bankName && (
                  <div className="field-error-message">{fieldErrors.bankName}</div>
                )}
              </div>

              {/* Account Holder Name */}
              <div className="form-group">
                <label htmlFor="accountHolderName">Account Holder Name</label>
                <input
                  type="text"
                  id="accountHolderName"
                  name="accountHolderName"
                  value={withdrawData.accountHolderName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Enter account holder name"
                  className={getInputClassName("accountHolderName")}
                />
                {fieldErrors.accountHolderName && (
                  <div className="field-error-message">{fieldErrors.accountHolderName}</div>
                )}
              </div>

              {/* Amount */}
              <div className="form-group">
                <label htmlFor="amount">Enter Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={withdrawData.amount}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Enter amount"
                  className={getInputClassName("amount")}
                  min="500"
                  max={walletBalance}
                  step="1"
                />
                {fieldErrors.amount && (
                  <div className="field-error-message">{fieldErrors.amount}</div>
                )}
                <div className="amount-hint">
                  {/* Minimum: ₹500 | Maximum: ₹{walletBalance} */}
                </div>
              </div>

              {/* Account Number */}
              <div className="form-group">
                <label htmlFor="accountNo">Bank Account Number</label>
                <input
                  type="text"
                  id="accountNo"
                  name="accountNo"
                  value={withdrawData.accountNo}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Enter account number"
                  className={getInputClassName("accountNo")}
                  inputMode="numeric"
                />
                {fieldErrors.accountNo && (
                  <div className="field-error-message">{fieldErrors.accountNo}</div>
                )}
              </div>

              {/* IFSC Code */}
              <div className="form-group">
                <label htmlFor="ifsc">IFSC Code</label>
                <input
                  type="text"
                  id="ifsc"
                  name="ifsc"
                  value={withdrawData.ifsc}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="Enter IFSC code"
                  className={getInputClassName("ifsc")}
                  style={{ textTransform: "uppercase" }}
                />
                {fieldErrors.ifsc && (
                  <div className="field-error-message">{fieldErrors.ifsc}</div>
                )}
                <div className="ifsc-hint">
                  Format: ABCD0123456
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${isSubmitDisabled() ? 'disabled' : ''}`}
                // disabled={isSubmitDisabled()}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  "Submit Withdrawal"
                )}
              </button>

              {/* {walletBalance < 500 && (
                <div className="insufficient-balance">
                  Minimum withdrawal amount is ₹500. Your current balance is insufficient.
                </div>
              )} */}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Withdraw;