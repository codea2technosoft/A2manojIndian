import React, { useState, useEffect } from "react";
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

  // Add state for withdrawal settings
  const [withdrawSettings, setWithdrawSettings] = useState({
    min_withdraw: "",
    max_withdraw: ""
  });

  // Bank form state
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    holderName: "",
    isBankDetailsSet: false,
  });

  // Bank details modal state
  const [showBankModal, setShowBankModal] = useState(false);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);

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

  // Load bank details from API on component mount
  useEffect(() => {
    fetchUserBankDetails();
    fetchWithdrawSettings(); // Fetch withdraw settings
  }, []);

  // Fetch Bank Details Function
  const fetchUserBankDetails = async () => {
    try {
      setLoadingBankDetails(true);
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("accessToken");

      if (!userId || !token) {
        console.log("User not logged in or token missing");
        setLoadingBankDetails(false);
        return;
      }

      const requestData = {
        id: userId
      };

      const response = await axios.post(
        `${baseUrl}/user-bank-details`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let bankDetails = null;

      if (response.data && response.data.data) {
        bankDetails = response.data.data;
      } else if (response.data) {
        bankDetails = response.data;
      }

      if (bankDetails) {
        setBankForm({
          bankName: bankDetails.bank_name || "",
          accountNumber: bankDetails.account_number || "",
          ifsc: bankDetails.ifsc_code || "",
          holderName: bankDetails.account_holder_name || "",
          isBankDetailsSet: !!(bankDetails.bank_name && bankDetails.account_number)
        });
      } else {
        setBankForm({
          bankName: "",
          accountNumber: "",
          ifsc: "",
          holderName: "",
          isBankDetailsSet: false,
        });
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      toast.error("Failed to load bank details");
      setBankForm({
        bankName: "",
        accountNumber: "",
        ifsc: "",
        holderName: "",
        isBankDetailsSet: false,
      });
    } finally {
      setLoadingBankDetails(false);
    }
  };

  // Update bank details via API
  const updateBankDetails = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("accessToken");

      if (!userId || !token) {
        toast.error("User not authenticated");
        return false;
      }

      // Validate all fields
      const missingFields = [];
      if (!bankForm.bankName.trim()) missingFields.push("Bank Name");
      if (!bankForm.accountNumber.trim()) missingFields.push("Account Number");
      if (!bankForm.ifsc.trim()) missingFields.push("IFSC Code");
      if (!bankForm.holderName.trim()) missingFields.push("Holder Name");

      if (missingFields.length > 0) {
        toast.warn(`Please fill: ${missingFields.join(", ")}`);
        return false;
      }

      const requestData = {
        user_id: userId,
        bank_name: bankForm.bankName.trim(),
        account_holder_name: bankForm.holderName.trim(),
        ifsc_code: bankForm.ifsc.trim().toUpperCase(),
        account_number: bankForm.accountNumber.replace(/\s/g, "")
      };

      console.warn("Request Data:", requestData);

      const response = await axios.post(
        `${baseUrl}/bank-details-update`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      let updateResult = null;
      updateResult = response.data;

      if (updateResult.success || updateResult.status_code === 200) {
        toast.success("Bank details saved successfully!");
        return true;
      } else {
        throw new Error(updateResult.message || "Failed to update bank details");
      }
    } catch (error) {
      console.error("Error updating bank details:", error);
      toast.error(error.message || "Something went wrong");
      return false;
    }
  };

  // Handle bank details save from modal
  const handleSaveBankDetails = async () => {
    try {
      setIsSubmitting(true);
      const success = await updateBankDetails();

      if (success) {
        setShowBankModal(false);
        // Refresh bank details
        fetchUserBankDetails();
      }
    } catch (error) {
      toast.error("Failed to save bank details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditBank = () => {
    setShowBankModal(true);
  };

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
  const handleWithdraw = async () => {
    if (!amount) {
      toast.error("Please enter withdrawal amount");
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

    // Check if bank details are complete
    if (!bankForm.isBankDetailsSet) {
      toast.warn("Please add your bank details first");
      setShowBankModal(true);
      return;
    }

    const missingFields = [];
    if (!bankForm.bankName) missingFields.push("Bank Name");
    if (!bankForm.accountNumber) missingFields.push("Account Number");
    if (!bankForm.ifsc) missingFields.push("IFSC Code");
    if (!bankForm.holderName) missingFields.push("Holder Name");

    if (missingFields.length > 0) {
      toast.warn(`Please complete bank details: ${missingFields.join(", ")}`);
      setShowBankModal(true);
      return;
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
        bank_name: bankForm.bankName.trim(),
        account_holder_name: bankForm.holderName.trim(),
        account_number: bankForm.accountNumber.replace(/\s/g, ""),
        ifsc_code: bankForm.ifsc.trim().toUpperCase(),
        mobile: mobile,
      };

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

      {/* Bank Details Section - Display Current Bank Details */}


      <div className="main_section REportsPage mt-3">
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
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Bank Details</h6>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setShowBankModal(true)}
                        >
                          {bankForm.bankName ? "Edit Bank" : "Add Bank"}
                        </button>
                      </div>

                      {bankForm.bankName ? (
                        <div className="mt-3">
                          <Table bordered className="mb-0">
                            <tbody>
                              <tr>
                                <th style={{ width: "30%" }}>Bank Name</th>
                                <td>{bankForm.bankName}</td>
                              </tr>
                              <tr>
                                <th>Account Holder</th>
                                <td>{bankForm.holderName}</td>
                              </tr>
                              <tr>
                                <th>Account Number</th>
                                <td>{bankForm.accountNumber}</td>
                              </tr>
                              <tr>
                                <th>IFSC Code</th>
                                <td>{bankForm.ifsc}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-muted mt-3 mb-0">
                          No bank details added. Please add bank details to withdraw.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Withdraw Button */}
                <div className="col-md-12 mt-4">
                  <button
                    className="btn btn-primary instant"
                    disabled={isSubmitting || !bankForm.isBankDetailsSet}
                    onClick={handleWithdraw}
                    style={{
                      padding: "12px 30px",
                      fontSize: "16px",
                      fontWeight: "600",
                      borderRadius: "8px",
                      minWidth: "200px",
                      opacity: bankForm.isBankDetailsSet ? 1 : 0.5,
                    }}
                    title={
                      !bankForm.isBankDetailsSet
                        ? "Please add bank details first"
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

                  {!bankForm.isBankDetailsSet && (
                    <div className="alert alert-warning mt-2" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Please add your bank details before withdrawing.
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
                  className="table-striped table-bordered table-hover"
                >
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Bank Details</th>
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
                            <td>
                              <div className="small">
                                {bankForm.bankName || "N/A"}
                                {bankForm.accountNumber && (
                                  <div className="text-muted">
                                    <small>
                                      Acc: {bankForm.accountNumber.slice(0, 4)}
                                      XXXX
                                      {bankForm.accountNumber.slice(-4)}
                                    </small>
                                  </div>
                                )}
                              </div>
                            </td>
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

      {/* Bank Details Modal */}
      <Modal show={showBankModal} onHide={() => setShowBankModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{bankForm.bankName ? "Edit Bank Account" : "Add Bank Account"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Bank Name *</Form.Label>
            <Form.Control
              name="bankName"
              value={bankForm.bankName}
              onChange={handleBankChange}
              placeholder="Enter bank name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Account Number *</Form.Label>
            <Form.Control
              name="accountNumber"
              value={bankForm.accountNumber}
              onChange={handleBankChange}
              placeholder="Enter account number"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>IFSC Code *</Form.Label>
            <Form.Control
              name="ifsc"
              value={bankForm.ifsc}
              onChange={handleBankChange}
              placeholder="Enter IFSC code"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Account Holder Name *</Form.Label>
            <Form.Control
              name="holderName"
              value={bankForm.holderName}
              onChange={handleBankChange}
              placeholder="Enter account holder name"
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBankModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSaveBankDetails}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Bank Details"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WithdrawSection;