// BankManagementCreate.js
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Table, Badge } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

// Environment Setup
const backendLocalApiUrl = process.env.REACT_APP_BACKEND_API;
const backendLiveApiUrl = process.env.REACT_APP_BACKEND_API;
const nodeMode = process.env.NODE_ENV;
const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

const BankManagementCreate = () => {
  const { userId } = useParams();

  // States
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [userMobile, setUserMobile] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Validation errors state
  const [fieldErrors, setFieldErrors] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: ""
  });

  // Form state
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    isDefault: false
  });

  // Get mobile from localStorage
  useEffect(() => {
    const mobile = localStorage.getItem("user_mobile");
    if (mobile) {
      setUserMobile(mobile);
    } else {
      toast.error("Mobile number not found. Please login again.");
    }
  }, []);

  // Fetch user's existing banks on component mount
  useEffect(() => {
    if (userId) {
      fetchUserBanks();
    }
  }, [userId]);

  // OTP Timer effect
  useEffect(() => {
    let interval;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // Fetch user's banks - UPDATED API
  const fetchUserBanks = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);

    try {
      const token = localStorage.getItem("accessToken");

      // Updated API endpoint and payload format
      const response = await axios.post(
        `${baseUrl}/bank-list`,  // New API endpoint
        {
          user_id: userId  // Payload in request body
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Bank list response:", response.data);

      if (response.data.success) {
        setBankList(response.data.data || []);
      } else {
        console.error("Failed to load banks:", response.data.message);
        if (showLoader) toast.error(response.data.message || "Failed to load bank list");
      }
    } catch (error) {
      console.error("Error fetching banks:", error);
      if (showLoader) toast.error(error.response?.data?.message || "Failed to load bank list");
    } finally {
      if (showLoader) setLoading(false);
      else setRefreshing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue = value;

    // Apply field-specific formatting
    if (name === 'ifscCode') {
      // Convert IFSC to uppercase and remove special characters
      processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    } else if (name === 'accountNumber') {
      // Remove non-numeric characters for account number
      processedValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'bankName' || name === 'accountHolderName') {
      // Allow letters, spaces, dots, and hyphens for name fields
      processedValue = value.replace(/[^A-Za-z\s.-]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    setFieldErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  // Validation functions
  const validateBankName = (name) => {
    if (!name.trim()) return "Bank name is required";
    if (name.trim().length < 3) return "Bank name must be at least 3 characters";
    if (name.trim().length > 50) return "Bank name must be less than 50 characters";
    if (!/^[A-Za-z\s.-]+$/.test(name)) return "Bank name can only contain letters, spaces, dots and hyphens";
    return "";
  };

  const validateAccountNumber = (accNo) => {
    if (!accNo.trim()) return "Account number is required";
    if (accNo.length < 9) return "Account number must be at least 9 digits";
    if (accNo.length > 18) return "Account number must be less than 18 digits";
    if (!/^\d+$/.test(accNo)) return "Account number can only contain digits";
    return "";
  };

  const validateIfscCode = (ifsc) => {
    if (!ifsc.trim()) return "IFSC code is required";
    if (ifsc.length !== 11) return "IFSC code must be exactly 11 characters";
    // IFSC format: First 4 letters, then 0, then 6 alphanumeric
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      return "Invalid IFSC format (e.g., SBIN0001234)";
    }
    return "";
  };

  const validateAccountHolderName = (name) => {
    if (!name.trim()) return "Account holder name is required";
    if (name.trim().length < 3) return "Account holder name must be at least 3 characters";
    if (name.trim().length > 100) return "Account holder name must be less than 100 characters";
    if (!/^[A-Za-z\s.-]+$/.test(name)) return "Name can only contain letters, spaces, dots and hyphens";
    return "";
  };

  // STEP 1: Send OTP with all bank details
  const handleSendOtp = async () => {
    // Validate all fields
    const bankNameError = validateBankName(formData.bankName);
    const accountNumberError = validateAccountNumber(formData.accountNumber);
    const ifscCodeError = validateIfscCode(formData.ifscCode);
    const accountHolderNameError = validateAccountHolderName(formData.accountHolderName);

    // Set field errors
    setFieldErrors({
      bankName: bankNameError,
      accountNumber: accountNumberError,
      ifscCode: ifscCodeError,
      accountHolderName: accountHolderNameError
    });

    // Check if any errors exist
    if (bankNameError || accountNumberError || ifscCodeError || accountHolderNameError) {
      // Focus the first field with error
      if (bankNameError) document.querySelector('[name="bankName"]')?.focus();
      else if (accountNumberError) document.querySelector('[name="accountNumber"]')?.focus();
      else if (ifscCodeError) document.querySelector('[name="ifscCode"]')?.focus();
      else if (accountHolderNameError) document.querySelector('[name="accountHolderName"]')?.focus();
      return;
    }

    // Check if mobile is available
    if (!userMobile) {
      toast.error("Mobile number not found. Please login again.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      // Send OTP with ALL bank details
      const requestData = {
        user_id: userId,
        mobile: userMobile,
        bank_name: formData.bankName.trim(),
        account_number: formData.accountNumber.replace(/\s/g, ""),
        ifsc_code: formData.ifscCode.trim().toUpperCase(),
        account_holder_name: formData.accountHolderName.trim(),
        is_default: formData.isDefault ? 1 : 0
      };

      console.log("Sending OTP with bank details:", requestData);

      const response = await axios.post(
        `${baseUrl}/send-bank-otp`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOtpSent(true);
        setOtpTimer(60);
        setCanResend(false);
        toast.success(`OTP sent to ${userMobile}`);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // STEP 2: Verify OTP - Supports 4 or 6 digits
  const handleVerifyOtp = async () => {
    // Check if OTP is 4 or 6 digits
    if (!otpInput || (otpInput.length !== 4 && otpInput.length !== 6)) {
      toast.error("Please enter valid 4 or 6-digit OTP");
      return;
    }

    setOtpVerifying(true);

    try {
      const token = localStorage.getItem("accessToken");

      // Only send user_id and otp for verification
      const verifyData = {
        user_id: userId,
        otp: otpInput
      };

      console.log("Verifying OTP:", verifyData);

      const response = await axios.post(
        `${baseUrl}/verify-bank-otp`,
        verifyData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Bank account added successfully!");

        // Reset all states
        setOtpSent(false);
        setOtpInput("");
        setFormData({
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          accountHolderName: "",
          isDefault: false
        });
        setFieldErrors({
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          accountHolderName: ""
        });

        // Refresh bank list
        await fetchUserBanks(true);

      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setOtpVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      const token = localStorage.getItem("accessToken");

      // Resend OTP with bank details again
      const requestData = {
        user_id: userId,
        mobile: userMobile,
        bank_name: formData.bankName.trim(),
        account_number: formData.accountNumber.replace(/\s/g, ""),
        ifsc_code: formData.ifscCode.trim().toUpperCase(),
        account_holder_name: formData.accountHolderName.trim(),
        is_default: formData.isDefault ? 1 : 0
      };

      const response = await axios.post(
        `${baseUrl}/send-bank-otp`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success(`OTP resent to ${userMobile}`);
        setOtpTimer(60);
        setCanResend(false);
        setOtpInput("");
      }
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  // Cancel OTP verification
  const handleCancelOtp = () => {
    setOtpSent(false);
    setOtpInput("");
    setOtpTimer(60);
    setCanResend(false);
  };

  // Delete bank account
  const handleDeleteBank = async (bankId) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) return;

    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.delete(`${baseUrl}/delete-bank/${bankId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Bank account deleted successfully");
        fetchUserBanks(true);
      }
    } catch (error) {
      toast.error("Failed to delete bank account");
    }
  };

  // Set as default bank
  const handleSetDefault = async (bankId) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${baseUrl}/set-default-bank`,
        {
          user_id: userId,
          bank_id: bankId
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Default bank updated");
        fetchUserBanks(true);
      }
    } catch (error) {
      toast.error("Failed to set default bank");
    }
  };

  // Format account number for display
  const formatAccountNumber = (accNo) => {
    if (!accNo) return "";
    if (accNo.length <= 8) return accNo;
    return accNo.slice(0, 4) + "XXXX" + accNo.slice(-4);
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="custum_card">
        <div className="custum_card_header">
          <h4 className="mb-0 custum_card_title">Add Bank Account</h4>
        </div>
          <div className="custum_card_body">
            {/* {userMobile && !otpSent && (
              <div className="alert alert-info mb-4">
                <i className="bi bi-phone me-2"></i>
                OTP will be sent to: <strong>{userMobile}</strong>
              </div>
            )} */}
               {/* Mobile Info Alert */}
         
          
          {/* STEP 1: Bank Account Form */}
          {!otpSent ? (
            <div className="mb-5">
              <div className="card_your_banks d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Bank Account Details</h5>
           
            </div>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-dark label_all">Bank Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="Enter bank name"
                        isInvalid={!!fieldErrors.bankName}
                        required
                      />
                      {fieldErrors.bankName && (
                        <Form.Text className="text-danger">
                          {fieldErrors.bankName}
                        </Form.Text>
                      )}
                      <Form.Text className="text-muted d-block">
                        Min 3, Max 50 characters (letters, spaces, dots, hyphens only)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-dark label_all">Account Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="Enter account number"
                        maxLength="18"
                        isInvalid={!!fieldErrors.accountNumber}
                        required
                      />
                      {fieldErrors.accountNumber && (
                        <Form.Text className="text-danger">
                          {fieldErrors.accountNumber}
                        </Form.Text>
                      )}
                      <Form.Text className="text-muted d-block">
                        9-18 digits only (no special characters or spaces)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-dark label_all">IFSC Code <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        placeholder="e.g., SBIN0001234"
                        style={{ textTransform: 'uppercase' }}
                        maxLength="11"
                        isInvalid={!!fieldErrors.ifscCode}
                        required
                      />
                      {fieldErrors.ifscCode && (
                        <Form.Text className="text-danger">
                          {fieldErrors.ifscCode}
                        </Form.Text>
                      )}
                      <Form.Text className="text-muted d-block">
                        Must be 11 characters: First 4 letters, then 0, then 6 alphanumeric (e.g., SBIN0001234)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-dark label_all">Account Holder Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        placeholder="Enter name as per bank records"
                        isInvalid={!!fieldErrors.accountHolderName}
                        required
                      />
                      {fieldErrors.accountHolderName && (
                        <Form.Text className="text-danger">
                          {fieldErrors.accountHolderName}
                        </Form.Text>
                      )}
                      <Form.Text className="text-muted d-block">
                        Min 3, Max 100 characters (letters, spaces, dots, hyphens only)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="isDefault"
                        label="Set as Default Account"
                        checked={formData.isDefault}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex gap-2 mt-3">
                  <button 
                    type="button" 
                    className="addbankaccount"
                    onClick={handleSendOtp}
                    disabled={submitting || !userMobile}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Sending OTP...
                      </>
                    ) : (
                      'Add Bank Account'
                    )}
                  </button>
                  
                  <button
                  className="closebutton" 
                    type="button" 
                    onClick={() => window.close()}
                  >
                    Back 
                  </button>
                </div>
              </Form>
            </div>
          ) : (
            /* STEP 2: OTP Verification Form */
            <div className="mb-5 p-4 border rounded bg-light">
              <h5 className="mb-3">Verify OTP</h5>
              <p className="text-muted mb-3">
                Please enter the 4 or 6-digit OTP sent to <strong>{userMobile}</strong>
              </p>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-dark label_all">Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                      placeholder="Enter 4 or 6-digit OTP"
                      maxLength="6"
                      autoFocus
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-end">
                  <div className="mb-3">
                    <Button 
                      variant="link" 
                      onClick={handleResendOtp}
                      disabled={!canResend}
                      className="p-0 me-3"
                    >
                      Resend OTP {!canResend && `(${otpTimer}s)`}
                    </Button>
                    <span className="text-muted">
                      {otpTimer > 0 ? `Valid for ${otpTimer}s` : "OTP expired"}
                    </span>
                  </div>
                </Col>
              </Row>
              
              <div className="d-flex gap-2 mt-3">
                <button className="resetbuttonall" 
                  onClick={handleVerifyOtp}
                  disabled={otpVerifying || (otpInput.length !== 4 && otpInput.length !== 6)}
                >
                  {otpVerifying ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Add Bank'
                  )}
                </button>
                
                <button className="resetbuttonall" 
                  onClick={handleCancelOtp}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Bank List Section */}
          <div id="bank-list-section">
            <div className="card_your_banks d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Your Saved Banks</h5>
              {bankList.length > 0 && (
                <div className="badge_custum" pill>
                  Total: {bankList.length}
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading your banks...</p>
              </div>
            ) : bankList.length > 0 ? (
              <div className="table-responsive">
                <Table striped bordered hover className="shadow-sm table_newall">
                  <thead className="">
                    <tr>
                      <th>#</th>
                      <th>Bank Name</th>
                      <th>Account Number</th>
                      <th>Holder Name</th>
                      <th>IFSC Code</th>
                      <th>Status</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {bankList.map((bank, index) => (
                      <tr key={bank.id || index}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{bank.bank_name}</strong>
                        </td>
                        <td>
                          <span title={bank.account_number}>
                            {formatAccountNumber(bank.account_number)}
                          </span>
                        </td>
                        <td>{bank.account_holder_name}</td>
                        <td>
                          <code>{bank.ifsc_code}</code>
                        </td>

                        <td>{bank.status}</td>
                        
                        {/* <td>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDeleteBank(bank.id)}
                          >
                            Delete
                          </Button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5 bg-light rounded">
                <i className="bi bi-bank2" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                <p className="mt-3 text-muted">No bank accounts added yet.</p>
              </div>
            )}

            {refreshing && (
              <div className="text-center mt-2">
                <small className="text-muted">
                  <span className="spinner-border spinner-border-sm me-1" />
                  Refreshing...
                </small>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default BankManagementCreate;