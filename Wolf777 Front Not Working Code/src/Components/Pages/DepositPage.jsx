import React, { useState, useEffect } from "react";
import { FaCaretLeft, FaCopy, FaPlusCircle, FaCheck, FaQrcode, FaFilter } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2"; // Add this import

import paytm from '../../assets/images/paytm.png';
import upi from '../../assets/images/upi.png';
import banktransfer from '../../assets/images/banktransfer.png';

// 🔹 API Environment Setup
// const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
// const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
// const nodeMode = process.env.NODE_ENV;
// const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

const baseUrl = process.env.REACT_APP_BACKEND_API;


function DepositPage({ fetchwallet_amount }) {
    const [amount, setAmount] = useState("");
    const [activePaymentMethod, setActivePaymentMethod] = useState(0);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [utrNumber, setUtrNumber] = useState("");
    const [scannerLists, setScannerLists] = useState([]);
    const [selectedScanner, setSelectedScanner] = useState(null);
    
    // Add state for deposit settings
    const [depositSettings, setDepositSettings] = useState({
        min_deposit: "",
        max_deposit: ""
    });

    const quickAmounts = [500, 1000, 2000, 5000, 10000];

    const paymentMethods = [
        { name: "UPI", icon: upi, details: { "UPI ID": "example@upi", "Account Holder": "Sudin Das" } },
        { name: "Bank Transfer", icon: banktransfer, details: { "Bank Name": "HDFC Bank", "Account Number": "1234567890", "IFSC Code": "HDFC0001234" } },
        { name: "Paytm", icon: paytm, details: { "Paytm Number": "9876543210", "Account Holder": "Sudin Das" } }
    ];

    const currentMethod = paymentMethods[activePaymentMethod];
    const userId = localStorage.getItem("user_id");

    const handleQuickAmount = (val) => setAmount(val.toString());

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
            setShowSuccess(true);
            toast.success("Screenshot uploaded!");
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    // -------------------- Fetch Deposit Settings --------------------
    const fetchDepositSettings = async () => {
        try {
            const response = await axios.get(`${baseUrl}/setting-list`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            console.log("Settings response:", response.data); // Debug log

            if (response.data?.success && response.data.data && response.data.data.length > 0) {
                const settings = response.data.data[0]; // Get the first item from array
                setDepositSettings({
                    min_deposit: settings.min_deposit || "100",
                    max_deposit: settings.max_deposit || "1000000"
                });
            }
        } catch (error) {
            console.error("Error fetching deposit settings:", error);
        }
    };

    // -------------------- Deposit API --------------------
    const handleDeposit = async () => {
        if (!amount) return toast.error("Please enter an amount");

        // First fetch the latest settings
        try {
            const settingsResponse = await axios.get(`${baseUrl}/setting-list`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            console.log("Deposit validation settings:", settingsResponse.data); // Debug log

            if (settingsResponse.data?.success && settingsResponse.data.data && settingsResponse.data.data.length > 0) {
                const settings = settingsResponse.data.data[0]; // Get the first item from array
                const minDeposit = Number(settings.min_deposit) || 100;
                const maxDeposit = Number(settings.max_deposit) || 1000000;
                const depositAmount = Number(amount);

                console.log("Min Deposit:", minDeposit, "Max Deposit:", maxDeposit, "Amount:", depositAmount); // Debug log

                // Check minimum deposit
                if (depositAmount < minDeposit) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Amount',
                        html: `Minimum deposit amount is <strong>₹${minDeposit.toLocaleString()}</strong><br>Your amount: ₹${depositAmount.toLocaleString()}`,
                        confirmButtonColor: '#d33',
                    });
                    return;
                }

                // Check maximum deposit
                if (depositAmount > maxDeposit) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid Amount',
                        html: `Maximum deposit amount is <strong>₹${maxDeposit.toLocaleString()}</strong><br>Your amount: ₹${depositAmount.toLocaleString()}`,
                        confirmButtonColor: '#d33',
                    });
                    return;
                }
            }
        } catch (error) {
            console.error("Error checking deposit limits:", error);
            // Continue with default validation if settings fetch fails
            if (Number(amount) < 100) return toast.error("Minimum deposit is ₹100");
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("amount", Number(amount));
            formData.append("user_id", userId);
          const mobile =   localStorage.getItem("user_mobile");
           const admin_id = localStorage.getItem("admin_id");
            const url = "https://payment.wolff777.co/deposit.php?name="+admin_id+"&userid="+admin_id+"&amount="+amount+"&contact="+mobile;

           window.location.href = url;

            // if (utrNumber) formData.append("utr_number", utrNumber);
            // if (uploadedFile) formData.append("screenshot", uploadedFile);

            // const response = await axios.post(
            //     `${baseUrl}/user-deposit`,
            //     formData,
            //     {
            //         headers: {
            //             "Content-Type": "multipart/form-data",
            //             Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            //         },
            //     }
            // );

            // if (response.data.status_code === 200) {
            //     toast.success(response.data.message || `₹${amount} deposited successfully!`);
            //     setAmount("");
            //     setUtrNumber("");
            //     setUploadedFile(null);
            //     setActivePaymentMethod(0);
            //     setShowSuccess(false);
            //     fetchwallet_amount();
            //     fetchTransactionHistory();
            // } else {
            //     toast.error(response.data.message);
            // }
        } catch (error) {
            console.error("Deposit error:", error);
            toast.error(error.response?.data?.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    function currency(n) {
        return n?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // -------------------- Fetch Scanner Lists --------------------
    const fetchScannerLists = async () => {
        try {
            const response = await axios.get(`${baseUrl}/scanner-lists`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (response.data?.success && Array.isArray(response.data.data)) {
                setScannerLists(response.data.data);
                if (response.data.data.length > 0) {
                    setSelectedScanner(response.data.data[0]);
                }
            }
        } catch (error) {
            toast.error("Failed to load payment options");
        }
    };

    useEffect(() => {
        fetchScannerLists();
        fetchTransactionHistory();
        fetchDepositSettings(); // Fetch deposit settings on component mount
    }, []);

    // -------------------- Transaction Filters --------------------
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    // Calculate date 1 month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const oneMonthAgoStr = oneMonthAgo.toISOString().slice(0, 10);

    // Default values - last 1 month
    const defaultFrom = oneMonthAgoStr;
    const defaultTo = todayStr;

    const [showFilters, setShowFilters] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [appliedFilters, setAppliedFilters] = useState({
        from: defaultFrom,
        to: defaultTo,
        size: 10
    });

    const formatDateForAPI = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const year = d.getFullYear();
        return `${month}-${day}-${year}`;
    };

    // -------------------- Fetch Transaction History --------------------
    const fetchTransactionHistory = async () => {
        if (!userId) return;
        try {
            setLoading(true);

            // If dates are empty, use default values (last 1 month)
            const startDate = fromDate && toDate
                ? formatDateForAPI(fromDate)
                : formatDateForAPI(defaultFrom);

            const endDate = fromDate && toDate
                ? formatDateForAPI(toDate)
                : formatDateForAPI(defaultTo);

            const params = {
                userId,
                start_date: startDate,
                end_date: endDate,
                page: currentPage,
                limit: appliedFilters.size
            };

            const res = await axios.get(`${baseUrl}/deposit-history`, { params });

            if (res.data?.success) {
                const list = Array.isArray(res.data.data) ? res.data.data : [];
                setTransactions(list);
                setTotalItems(res.data.total || list.length);
                setTotalPages(Math.max(1, Math.ceil((res.data.total || list.length) / appliedFilters.size)));
            } else {
                setTransactions([]);
                setTotalItems(0);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("Error fetching deposit history:", error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // -------------------- Filter Handlers --------------------
    const applyFilters = () => {
        // If dates are empty, use default values (last 1 month)
        const newFrom = fromDate || defaultFrom;
        const newTo = toDate || defaultTo;

        setAppliedFilters({
            from: newFrom,
            to: newTo,
            size: pageSize
        });
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFromDate("");
        setToDate("");
        setPageSize(10);
        setAppliedFilters({
            from: defaultFrom,
            to: defaultTo,
            size: 10
        });
        setCurrentPage(1);
    };

    const goToPage = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };

    const getPageNumbers = () => {
        const pages = [];
        const max = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + max - 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    useEffect(() => {
        fetchTransactionHistory();
    }, [currentPage, appliedFilters]);
    const validateUTR = (utr) => {
        const utrRegex = /^[A-Za-z0-9]{12,22}$/;
        return utrRegex.test(utr);
    };



    // -------------------- JSX --------------------
    return (
        <div className="deposit-page">
            <ToastContainer position="top-center" autoClose={2000} />

            {/* Header */}
            <div className="page-header-container">
                <div className="header-content">
                    <button className="back-btn"><FaCaretLeft size={20} /></button>
                    <h1 className="page-title">Deposit Funds</h1>
                </div>
            </div>

            <div className="page-container">
                <div className="content-wrapper">

                    {/* Deposit Card */}
                    <div className="deposit-card">
                        <div className="card-header-primary">
                            <h2 className="card-title">Add Funds to Wallet</h2>
                            <p className="card-subtitle">
                                {depositSettings.min_deposit && depositSettings.max_deposit ? (
                                    <>Minimum: ₹{Number(depositSettings.min_deposit).toLocaleString()} | Maximum: ₹{Number(depositSettings.max_deposit).toLocaleString()} | Instant processing after verification</>
                                ) : (
                                    <>Minimum deposit: ₹100 | Instant processing after verification</>
                                )}
                            </p>
                        </div>
                        <div className="card-body">
                            {/* Amount Input */}
                            <div className="form-section">
                                <label className="form-label">Enter Amount (₹)</label>
                                <input
                                    className="amount-input"
                                    placeholder="0"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min={depositSettings.min_deposit || "100"}
                                    max={depositSettings.max_deposit}
                                />
                                <div className="quick-amounts-section">
                                    <div className="quick-buttons-grid">
                                        {quickAmounts.map((val) => (
                                            <button
                                                key={val}
                                                className={`quick-amount-btn ${parseInt(amount) === val ? 'active' : ''}`}
                                                onClick={() => handleQuickAmount(val)}
                                            >
                                                ₹{val.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method - QR Code Scanner */}
                            {/* {selectedScanner && (
                                <div className="card mb-3">
                                    <div className="card-header">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <FaQrcode className="qr-icon" />
                                            <p className="qr-text">
                                                Scan & Pay ({selectedScanner.name})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="card-body text-center">
                                        <img
                                            src={selectedScanner.image_url.replace(/\\/g, "/")}
                                            alt={selectedScanner.name}
                                            className="qr-image"
                                            style={{ maxWidth: "220px", borderRadius: "10px" }}
                                        />
                                    </div>
                                </div>
                            )} */}

                            {/* UTR Number Input */}
                            {/* <div className="form-section">
                                <label className="form-label">Transaction / UTR Number</label>
                                <input
                                    id="utrNumber"
                                    className="form-control"
                                    placeholder="Enter UTR / Transaction Number"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={utrNumber}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, ""); // only numbers
                                        if (value.length <= 12) {
                                            setUtrNumber(value);
                                        }
                                    }}
                                    minLength={12}
                                    maxLength={22}
                                    required
                                />

                                <small className="text-muted">
                                    UTR must be 12 alphanumeric characters
                                </small>
                            </div> */}


                            {/* Screenshot Upload */}
                            {/* <div className="form-section">
                                <label className="form-label">Upload Payment Proof</label>
                                <div className="upload-area" onClick={() => document.querySelector('input[type="file"]').click()}>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
                                    <FaPlusCircle className="upload-icon" />
                                    <p className="upload-text">Click to upload screenshot (JPEG/PNG)</p>
                                    {uploadedFile && <div className="upload-success"><FaCheck /> {uploadedFile.name} uploaded</div>}
                                </div>
                            </div> */}

                            <button
                                className="deposit-btn"
                                onClick={handleDeposit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : `Deposit ₹${(amount || 0).toLocaleString()}`}
                            </button>
                        </div>
                    </div>

                    {/* Transaction History with Filters */}
                    <div className="transaction-history mt-4">
                        <div className="card">
                            <div className="card-header bg-white p-2">
                                <div className="d-flex justify-content-between w-100 align-items-center ">
                                    <h4 className="mb-0 card-title p-0 fw-normal">Deposit History</h4>
                                    <button
                                        className="fillterbutton_all"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
                                    </button>
                                </div>

                            </div>
                            <div className="card-body">
                                  {showFilters && (
                            <div className="filter-section p-3 bg-light rounded mb-3">
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label">From Date</label>
                                        <input 
                                            type="date" 
                                            className="form-control" 
                                            value={fromDate} 
                                            onChange={(e) => setFromDate(e.target.value)}
                                            max={toDate || todayStr}
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
                                            max={todayStr}
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
                                            disabled={loading}
                                        >
                                            Apply Filters
                                        </button>
                                        <button 
                                            className="btn btn-outline-secondary" 
                                            onClick={resetFilters}
                                            disabled={loading}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="table-responsive">
                            <table className="table table-hover table-bordered">
                                <thead className="table-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Status</th>
                                        <th>Remark</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>From</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                <div className="loader-6">
                                                    <div className="set-one">
                                                        <div className="circle"></div>
                                                        <div className="circle circle1"></div>
                                                    </div>
                                                    <div className="set-two">
                                                        <div className="circle circle2"></div>
                                                        <div className="circle circle3"></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted py-4">
                                                No transactions found
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((t, i) => {
                                            // Determine badge color based on status
                                            let badgeClass = "bg-warning";
                                            if (t.status === "Success" || t.status === "Completed") {
                                                badgeClass = "bg-success";
                                            } else if (t.status === "Failed" || t.status === "Rejected") {
                                                badgeClass = "bg-danger";
                                            } else if (t.status === "Processing") {
                                                badgeClass = "bg-info";
                                            }

                                            // Format date
                                            const formattedDate = t.createdAt 
                                                ? new Date(t.createdAt).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })
                                                : "N/A";

                                            return (
                                                <tr key={t.id || i}>
                                                    <td>{(currentPage-1)*appliedFilters.size + i + 1}</td>
                                                    <td>
                                                        <span className={`badge ${badgeClass}`}>
                                                            {t.status || "Pending"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div>{t.remark || "N/A"}</div>
                                                        {t.transactionId && (
                                                            <small className="text-muted d-block">
                                                                Transaction ID: {t.transactionId}
                                                            </small>
                                                        )}
                                                    </td>
                                                    <td className={`fw-bold ${
                                                        t.type === "Credit" || t.type === "Deposit" 
                                                        ? "text-success" 
                                                        : "text-danger"
                                                    }`}>
                                                        ₹{currency(t.amount)}
                                                    </td>
                                                    <td>{formattedDate}</td>
                                                    <td>{t.from || "N/A"}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                            
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                        <p className="text-muted mb-0">
                                            Showing {(currentPage-1)*appliedFilters.size + 1} to{" "}
                                            {Math.min(currentPage * appliedFilters.size, totalItems)} of{" "}
                                            {totalItems} entries
                                        </p>
                                    </div>
                                    <ul className="pagination mb-0">
                                        <li className={`page-item ${currentPage===1?"disabled":""}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={()=>goToPage(currentPage-1)}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {getPageNumbers().map(p=>(
                                            <li 
                                                key={p} 
                                                className={`page-item ${currentPage===p?"active":""}`}
                                            >
                                                <button 
                                                    className="page-link" 
                                                    onClick={()=>goToPage(p)}
                                                >
                                                    {p}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage===totalPages?"disabled":""}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={()=>goToPage(currentPage+1)}
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
        </div>
    );
}

export default DepositPage;