import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Table, Modal, Button } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2"; // Add this import

import banktransfer from "../../assets/images/banktransfer.png";
import upi from "../../assets/images/upi.png";
import { encryptData, decryptData } from "../../utils/encryption";

// Environment Setup
const backendLocalApiUrl =
  process.env.REACT_APP_BACKEND_API;

const backendLiveApiUrl =
  process.env.REACT_APP_BACKEND_API;

const nodeMode = process.env.NODE_ENV;

const baseUrl =
  nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

const WithdrawSection = () => {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAccountTab, setActiveAccountTab] = useState("bank"); // bank | upi
const navigate = useNavigate();
  // Add state for withdrawal settings
  const [withdrawSettings, setWithdrawSettings] = useState({
    min_withdraw: "",
    max_withdraw: ""
  });

  // Bank list state
  const [userBanks, setUserBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // View states
  const [showUpiForm, setShowUpiForm] = useState(false);

  // -------------------- Fetch Withdrawal Settings --------------------
  const fetchWithdrawSettings = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`${baseUrl}/setting-list`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Withdraw settings response:", response.data);

      if (response.data?.success && response.data.data && response.data.data.length > 0) {
        const settings = response.data.data[0]; // Get the first item from array
        setWithdrawSettings({
          min_withdraw: settings.min_withdraw || "100",
          max_withdraw: settings.max_withdraw || "1000000"
        });
      }
    } catch (error) {
      console.error("Error fetching withdraw settings:", error);
    }
  };

  // Fetch user's banks
const fetchUserBanks = async () => {
  try {
    setLoadingBanks(true);
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("accessToken");

    if (!userId || !token) {
      console.log("User not logged in or token missing");
      setUserBanks([]);
      return;
    }

    const response = await axios.post(
      `${baseUrl}/user-success-bank-list`,
      {
        user_id: userId
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Bank list response:", response.data); // Debug log

    if (response.data.success && response.data.data) {
      // ✅ FIX: Map _id to id for consistency
      const formattedBanks = response.data.data.map(bank => ({
        ...bank,
        id: bank._id  // Add id field using _id from API
      }));
      
      setUserBanks(formattedBanks);
      
      // If there's a previously selected bank, check if it still exists
      if (selectedBankId) {
        const bankExists = formattedBanks.some(bank => bank.id === selectedBankId);
        if (!bankExists) {
          setSelectedBankId("");
          setSelectedBankDetails(null);
        }
      }
    } else {
      setUserBanks([]);
    }
  } catch (error) {
    console.error("Error fetching user banks:", error);
    toast.error("Failed to load bank list");
    setUserBanks([]);
  } finally {
    setLoadingBanks(false);
  }
};

  

  // Handle bank selection
  const handleBankSelect = (e) => {
    const bankId = e.target.value;
    setSelectedBankId(bankId);
    
    if (bankId) {
      const bank = userBanks.find(b => b.id === bankId);
      setSelectedBankDetails(bank);
    } else {
      setSelectedBankDetails(null);
    }
  };

  const handleAddBank = () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      // Open new page with user_id in the route
      // window.open(`/add-bank/${userId}`, '_blank');
      navigate(`/add-bank/${userId}`);
    } else {
      toast.error("User not authenticated");
    }
  };
  useEffect(() => {
    fetchUserBanks();
    fetchWithdrawSettings(); // Fetch withdraw settings
    
    // Refresh banks when tab comes into focus
    const handleFocus = () => {
      fetchUserBanks();
    };   
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Predefined amount buttons
  const amountButtons = [500, 1000, 1500, 2500, 3000, 4000, 5000];

  // Withdrawal History State
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Default dates for last 1 month
  const getDefaultDates = () => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const oneMonthAgoStr = oneMonthAgo.toISOString().slice(0, 10);

    return { defaultFrom: oneMonthAgoStr, defaultTo: todayStr };
  };

  const { defaultFrom, defaultTo } = getDefaultDates();

  // Fetch Withdrawal History
  const fetchWithdrawHistory = async () => {
    try {
      setLoadingHistory(true);
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("accessToken");

      if (!userId) {
        console.log("User not logged in");
        setWithdrawHistory([]);
        return;
      }

      const startDate = fromDate || defaultFrom;
      const endDate = toDate || defaultTo;

      const params = {
        userId: userId,
        start_date: formatDateForAPI(startDate),
        end_date: formatDateForAPI(endDate),
        page: currentPage,
        limit: pageSize,
      };

      const response = await axios.get(`${baseUrl}/withdraw-history`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const list = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setWithdrawHistory(list);
        setTotalItems(response.data.total || list.length);
        setTotalPages(
          Math.max(
            1,
            Math.ceil((response.data.total || list.length) / pageSize)
          )
        );
      } else {
        setWithdrawHistory([]);
        setTotalItems(0);
        setTotalPages(1);
        toast.warning(response.data.message || "No withdrawal history found");
      }
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
      setWithdrawHistory([]);
      toast.error("Failed to load withdrawal history");
    } finally {
      setLoadingHistory(false);
    }
  };

  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const currency = (n) => {
    return n?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Main Withdraw Function
  // const handleWithdraw = async () => {
  //   if (!amount) {
  //     toast.error("Please enter withdrawal amount");
  //     return;
  //   }

  //   // Check if bank is selected
  //   // if (!selectedBankId || !selectedBankDetails) {
  //   //   toast.warn("Please select a bank account");
  //   //   return;
  //   // }

  //   // First fetch the latest settings for validation
  //   try {
  //     const settingsResponse = await axios.get(`${baseUrl}/setting-list`, {}, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });

  //     console.log("Withdraw validation settings:", settingsResponse.data);

  //     if (settingsResponse.data?.success && settingsResponse.data.data && settingsResponse.data.data.length > 0) {
  //       const settings = settingsResponse.data.data[0];
  //       const minWithdraw = Number(settings.min_withdraw) || 100;
  //       const maxWithdraw = Number(settings.max_withdraw) || 1000000;
  //       const withdrawAmount = Number(amount);

  //       console.log("Min Withdraw:", minWithdraw, "Max Withdraw:", maxWithdraw, "Amount:", withdrawAmount);

  //       // Check minimum withdrawal
  //       if (withdrawAmount < minWithdraw) {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Invalid Amount',
  //           html: `Minimum withdrawal amount is <strong>₹${minWithdraw.toLocaleString()}</strong><br>Your amount: ₹${withdrawAmount.toLocaleString()}`,
  //           confirmButtonColor: '#d33',
  //         });
  //         return;
  //       }

  //       // Check maximum withdrawal
  //       if (withdrawAmount > maxWithdraw) {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Invalid Amount',
  //           html: `Maximum withdrawal amount is <strong>₹${maxWithdraw.toLocaleString()}</strong><br>Your amount: ₹${withdrawAmount.toLocaleString()}`,
  //           confirmButtonColor: '#d33',
  //         });
  //         return;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error checking withdrawal limits:", error);
  //     // Continue with basic validation if settings fetch fails
  //     const minAmount = 100;
  //     if (Number(amount) < minAmount) {
  //       toast.error(`Minimum withdrawal amount is ₹${minAmount}`);
  //       return;
  //     }
  //   }

  //   // Proceed with withdrawal
  //   setIsSubmitting(true);

  //   try {
  //     const userId = localStorage.getItem("user_id");
  //     const token = localStorage.getItem("accessToken");
  //     const mobile = localStorage.getItem("mobile") || "0000000000";
  //     const requestData = {
  //       user_id: userId,
  //       amount: Number(amount),
  //       bank_id: selectedBankId,
  //       bank_name: selectedBankDetails.bank_name,
  //       account_holder_name: selectedBankDetails.account_holder_name,
  //       account_number: selectedBankDetails.account_number,
  //       ifsc_code: selectedBankDetails.ifsc_code,
  //       mobile: mobile,
  //     };

  //     const encryptedData = encryptData(requestData);
  //     const response = await axios.post(
  //       `${baseUrl}/withdraw`,
  //       { encryptedData },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.data.encryptedResponse) {
  //       const decryptedResponse = decryptData(response.data.encryptedResponse);
  //       if (
  //         decryptedResponse.status_code === 200 ||
  //         decryptedResponse.success === "1" ||
  //         decryptedResponse.success === true
  //       ) {
  //         toast.success(
  //           decryptedResponse.message ||
  //           "Withdrawal request submitted successfully!"
  //         );
  //         setAmount("");
  //         setSelectedBankId("");
  //         setSelectedBankDetails(null);
  //         fetchWithdrawHistory();
  //       } else {
  //         throw new Error(decryptedResponse.message || "Withdrawal failed");
  //       }
  //     } else {
  //       if (
  //         response.data.status_code === 200 ||
  //         response.data.success === "1"
  //       ) {
  //         toast.success(
  //           response.data.message ||
  //           "Withdrawal request submitted successfully!"
  //         );
  //         setAmount("");
  //         setSelectedBankId("");
  //         setSelectedBankDetails(null);
  //         fetchWithdrawHistory();
  //       } else {
  //         throw new Error(response.data.message || "Withdrawal failed");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Withdrawal error:", error);
  //     let errorMessage = "Failed to submit withdrawal request";

  //     if (
  //       error.response &&
  //       error.response.data &&
  //       error.response.data.encryptedResponse
  //     ) {
  //       try {
  //         const decryptedError = decryptData(
  //           error.response.data.encryptedResponse
  //         );
  //         errorMessage = decryptedError.message || errorMessage;
  //       } catch (e) {
  //         errorMessage = "Failed to process error response";
  //       }
  //     } else if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.message) {
  //       errorMessage = error.message;
  //     }

  //     toast.error(errorMessage);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };


  // Main Withdraw Function
const handleWithdraw = async () => {
  if (!amount) {
    toast.error("Please enter withdrawal amount");
    return;
  }

  // Check if bank is selected
  if (!selectedBankId || !selectedBankDetails) {
    toast.warn("Please select a bank account");
    return;
  }
  // First fetch the latest settings for validation
  try {
    const settingsResponse = await axios.get(`${baseUrl}/setting-list`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log("Withdraw validation settings:", settingsResponse.data);
    if (settingsResponse.data?.success && settingsResponse.data.data && settingsResponse.data.data.length > 0) {
      const settings = settingsResponse.data.data[0];
      const minWithdraw = Number(settings.min_withdraw) || 100;
      const maxWithdraw = Number(settings.max_withdraw) || 1000000;
      const withdrawAmount = Number(amount);
      console.log("Min Withdraw:", minWithdraw, "Max Withdraw:", maxWithdraw, "Amount:", withdrawAmount);

      // Check minimum withdrawal
      if (withdrawAmount < minWithdraw) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Amount',
          html: `Minimum withdrawal amount is <strong>₹${minWithdraw.toLocaleString()}</strong><br>Your amount: ₹${withdrawAmount.toLocaleString()}`,
          confirmButtonColor: '#d33',
        });
        return;
      }

      // Check maximum withdrawal
      if (withdrawAmount > maxWithdraw) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Amount',
          html: `Maximum withdrawal amount is <strong>₹${maxWithdraw.toLocaleString()}</strong><br>Your amount: ₹${withdrawAmount.toLocaleString()}`,
          confirmButtonColor: '#d33',
        });
        return;
      }
    }
  } catch (error) {
    console.error("Error checking withdrawal limits:", error);
    // Continue with basic validation if settings fetch fails
    const minAmount = 100;
    if (Number(amount) < minAmount) {
      toast.error(`Minimum withdrawal amount is ₹${minAmount}`);
      return;
    }
  }

  // Proceed with withdrawal
  setIsSubmitting(true);

  try {
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("accessToken");
    const mobile = localStorage.getItem("mobile") || "0000000000";

    const requestData = {
      user_id: userId,
      amount: Number(amount),
      bank_id: selectedBankId,
      bank_name: selectedBankDetails.bank_name, 
      account_holder_name: selectedBankDetails.account_holder_name,
      account_number: selectedBankDetails.account_number,
      ifsc_code: selectedBankDetails.ifsc_code,     
      mobile: mobile,
    };

    console.log("Withdraw request payload:", requestData); 

    const encryptedData = encryptData(requestData);

    const response = await axios.post(
      `${baseUrl}/withdraw`,
      { encryptedData },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.encryptedResponse) {
      const decryptedResponse = decryptData(response.data.encryptedResponse);
      if (
        decryptedResponse.status_code === 200 ||
        decryptedResponse.success === "1" ||
        decryptedResponse.success === true
      ) {
        toast.success(
          decryptedResponse.message ||
          "Withdrawal request submitted successfully!"
        );
        setAmount("");
        setSelectedBankId("");
        setSelectedBankDetails(null);
        fetchWithdrawHistory();
      } else {
        throw new Error(decryptedResponse.message || "Withdrawal failed");
      }
    } else {
      if (
        response.data.status_code === 200 ||
        response.data.success === "1"
      ) {
        toast.success(
          response.data.message ||
          "Withdrawal request submitted successfully!"
        );
        setAmount("");
        setSelectedBankId("");
        setSelectedBankDetails(null);
        fetchWithdrawHistory();
      } else {
        throw new Error(response.data.message || "Withdrawal failed");
      }
    }
  } catch (error) {
    console.error("Withdrawal error:", error);
    let errorMessage = "Failed to submit withdrawal request";

    if (
      error.response &&
      error.response.data &&
      error.response.data.encryptedResponse
    ) {
      try {
        const decryptedError = decryptData(
          error.response.data.encryptedResponse
        );
        errorMessage = decryptedError.message || errorMessage;
      } catch (e) {
        errorMessage = "Failed to process error response";
      }
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  // Filter handlers
  const applyFilters = () => {
    setCurrentPage(1);
    fetchWithdrawHistory();
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setPageSize(10);
    setCurrentPage(1);
    setTimeout(() => {
      fetchWithdrawHistory();
    }, 100);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxPages - 1);

    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Effects
  useEffect(() => {
    fetchWithdrawHistory();
  }, [currentPage, pageSize]);

  // Inline card style
  const cardStyle = {
    width: "110px",
    height: "110px",
    borderRadius: "12px",
    border: "2px solid #e5e5e5",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px",
    cursor: "pointer",
    transition: "0.25s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };

  const imgStyle = {
    width: "60%",
    height: "auto",
    objectFit: "contain",
  };

  // Amount button style
  const amountButtonStyle = {
    padding: "8px 16px",
    border: "2px solid #e5e5e5",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    fontSize: "14px",
    margin: "4px",
  };

  const selectedAmountButtonStyle = {
    ...amountButtonStyle,
    borderColor: "#007bff",
    background: "#007bff",
    color: "#fff",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,123,255,0.3)",
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();

    if (
      statusLower === "success" ||
      statusLower === "completed" ||
      statusLower === "approved"
    ) {
      return <span className="badge bg-success">Success</span>;
    } else if (statusLower === "pending" || statusLower === "processing") {
      return <span className="badge bg-warning">Pending</span>;
    } else if (
      statusLower === "failed" ||
      statusLower === "rejected" ||
      statusLower === "cancelled"
    ) {
      return <span className="badge bg-danger">Failed</span>;
    } else {
      return <span className="badge bg-secondary">{status || "Pending"}</span>;
    }
  };

  return (
    <div className="withdrawsection">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="main_section ReportsPage mt-3">
        <div className="p-mobile-1">
          <div className="card">
            <div className="card-header account-detail-head">
              <span>Withdraw 24×7</span>
            </div>

            <div className="card-body account-stat-body">
              <div className="row">
                {/* Amount Section */}
                <div className="col-md-12">
                  <label
                    style={{
                      fontWeight: "bold",
                      marginBottom: "10px",
                      display: "block",
                    }}
                  >
                    Withdrawal Amount
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    inputMode="number"
                    placeholder="Enter Amount"
                    value={amount}
                    maxLength={10}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    style={{ marginBottom: "15px" }}
                  />

                  {/* Show min/max limits */}
                  {withdrawSettings.min_withdraw && withdrawSettings.max_withdraw && (
                    <div className="alert alert-info py-2 mb-3">
                      <small>
                        <strong>Withdrawal Limits:</strong> Min: ₹{Number(withdrawSettings.min_withdraw).toLocaleString()} | 
                        Max: ₹{Number(withdrawSettings.max_withdraw).toLocaleString()}
                      </small>
                    </div>
                  )}

                  {/* Quick Select Buttons */}
                  <div style={{ marginBottom: "20px" }}>
                    <label
                      style={{
                        fontWeight: "bold",
                        marginBottom: "10px",
                        display: "block",
                      }}
                    >
                      Quick Select
                    </label>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {amountButtons.map((amt) => (
                        <button
                          key={amt}
                          style={
                            amount === amt.toString()
                              ? selectedAmountButtonStyle
                              : amountButtonStyle
                          }
                          onClick={() => setAmount(amt.toString())}
                          onMouseEnter={(e) => {
                            if (amount !== amt.toString()) {
                              e.currentTarget.style.borderColor = "#007bff";
                              e.currentTarget.style.transform =
                                "translateY(-2px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(0,123,255,0.2)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (amount !== amt.toString()) {
                              e.currentTarget.style.borderColor = "#e5e5e5";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }
                          }}
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="card mt-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Bank Details</h6>
                        <button
                          className="addbank"
                          onClick={handleAddBank}
                        >
                          + Add Bank
                        </button>
                      </div>

                      {loadingBanks ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : userBanks.length > 0 ? (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Select Bank Account</Form.Label>
                            <Form.Select
                              value={selectedBankId}
                              onChange={handleBankSelect}
                            >
                              <option value="">-- Select Bank Account --</option>
                              {userBanks.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                  {bank.bank_name} - {bank.account_number}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>

                          {selectedBankDetails && (
                            <div className="mt-3 table_all">
                              <Table bordered className="mb-0">
                                <tbody>
                                  <tr>
                                    <th style={{ width: "30%" }}>Bank Name</th>
                                    <td>{selectedBankDetails.bank_name}</td>
                                  </tr>
                                  <tr>
                                    <th>Account Holder</th>
                                    <td>{selectedBankDetails.account_holder_name}</td>
                                  </tr>
                                  <tr>
                                    <th>Account Number</th>
                                    <td>{selectedBankDetails.account_number}</td>
                                  </tr>
                                  <tr>
                                    <th>IFSC Code</th>
                                    <td>{selectedBankDetails.ifsc_code}</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted mb-3">
                            No bank accounts added yet.
                          </p>
                          <button
                            className="btn btn-primary"
                            onClick={handleAddBank}
                          >
                            Add Your First Bank Account
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Withdraw Button */}
                <div className="col-md-12 mt-4">
                  <button
                    className="btn btn-primary instant"
                    disabled={isSubmitting || !selectedBankId}
                    onClick={handleWithdraw}
                    style={{
                      padding: "12px 30px",
                      fontSize: "16px",
                      fontWeight: "600",
                      borderRadius: "8px",
                      minWidth: "200px",
                      opacity: selectedBankId ? 1 : 0.5,
                    }}
                    title={
                      !selectedBankId
                        ? "Please select a bank account first"
                        : ""
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Processing...
                      </>
                    ) : (
                      "Withdraw Now"
                    )}
                  </button>

                  {!selectedBankId && (
                    <div className="alert alert-warning mt-2" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Please select a bank account before withdrawing.
                    </div>
                  )}
                </div>
              </div>

              {/* Withdrawal History Table */}
              <div className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Withdrawal History</h5>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>
                </div>

                {/* Filters */}
                {showFilters && (
                  <div className="card card-body mb-3 bg-light">
                    <div className="row g-3">
                      <div className="col-md-3">
                        <label className="form-label">From Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          max={toDate || new Date().toISOString().slice(0, 10)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">To Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          min={fromDate}
                          max={new Date().toISOString().slice(0, 10)}
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">Show</label>
                        <select
                          className="form-select"
                          value={pageSize}
                          onChange={(e) => setPageSize(Number(e.target.value))}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                        </select>
                      </div>
                      <div className="col-md-4 d-flex align-items-end gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={applyFilters}
                          disabled={loadingHistory}
                        >
                          Apply Filters
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={resetFilters}
                          disabled={loadingHistory}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Table */}
                <Table
                  responsive
                  className="table-striped table-bordered table-hover withdraw_page"
                >
                  <thead className="table-primary ">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      {/* <th>Bank Details</th> */}
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingHistory ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : withdrawHistory.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No withdrawal history found
                        </td>
                      </tr>
                    ) : (
                      withdrawHistory.map((item, index) => {
                        const formattedDateTime = item.createdAt
                          ? new Date(item.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : "N/A";

                        return (
                          <tr key={item.id || index}>
                            <td>{(currentPage - 1) * pageSize + index + 1}</td>
                            <td>
                              <div>{formattedDateTime.split(",")[0]}</div>
                              <small className="text-muted">
                                {formattedDateTime.split(",")[1]}
                              </small>
                            </td>
                            <td className="fw-bold text-danger">
                              ₹{currency(item.amount)}
                            </td>
                            <td>{getStatusBadge(item.status)}</td>
                            {/* <td>
                              <div className="small">
                                {item.bank_name || "N/A"}
                                {item.account_number && (
                                  <div className="text-muted">
                                    <small>
                                      Acc: {item.account_number.slice(0, 4)}
                                      XXXX
                                      {item.account_number.slice(-4)}
                                    </small>
                                  </div>
                                )}
                              </div>
                            </td> */}
                            <td>
                              <div>
                                {item.remark || "User Requested Withdraw"}
                              </div>
                              <small className="text-muted d-block mt-1">
                                <i className="bi bi-arrow-up-right me-1"></i>
                                {item.from || "Transaction"}
                              </small>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <p className="text-muted mb-0">
                        Showing {(currentPage - 1) * pageSize + 1} to{" "}
                        {Math.min(currentPage * pageSize, totalItems)} of{" "}
                        {totalItems} entries
                      </p>
                    </div>
                    <ul className="pagination mb-0">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>

                      {getPageNumbers().map((page) => (
                        <li
                          key={page}
                          className={`page-item ${currentPage === page ? "active" : ""
                            }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawSection;