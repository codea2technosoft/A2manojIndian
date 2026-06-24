import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { getChildListTransaction, addNewTransaction, getMyLedgerTxn, deleteLedgerTxn } from "../../Server/api";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";

function AgentMasterTransction() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        client: "",
        amount: "",
        collection: "CASH",
        paymentType: "cr",
        date: new Date().toISOString().split("T")[0],
        comment: "",
    });
    const [validated, setValidated] = useState(false);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clientLoading, setClientLoading] = useState(true);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [ledgerData, setLedgerData] = useState([]);
    const [loadingLedger, setLoadingLedger] = useState(false);
    const [summary, setSummary] = useState({
        debit: 0,
        credit: 0,
        balance: 0,
        balanceType: "CREDIT"
    });
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(100);
    const [totalPages, setTotalPages] = useState(0);

    // Get admin_id from localStorage
    const getAdminId = () => {
        const adminIdFromStorage = localStorage.getItem("superagent_admin_id");
        return adminIdFromStorage || localStorage.getItem("admin_ids");
    };

    // Get logged in admin ID
    const getLoggedInAdminId = () => {
        return localStorage.getItem("admin_id");
    };

    useEffect(() => {
        fetchClients();

        const adminId = getAdminId();
        console.log("adminId from localStorage:", adminId);

        if (adminId) {
            console.log("Fetching ledger for adminId:", adminId);
            setFormData(prev => ({ ...prev, client: adminId }));
            handleAutoSelectClient(adminId);
        }
    }, []);




    const admin_id = localStorage.getItem("admin_id");

    const handleAutoSelectClient = async (adminId) => {
        try {
            setLoading(true);
            const response = await getChildListTransaction(3, admin_id);

            if (response.data && response.data.success) {
                const clientData = response.data.data; // This is an array of users
                console.log("API response data:", clientData);

                // Process the array of users
                const processedClients = clientData.map(user => {
                    // Calculate the ledger amount based on total_amount
                    let amount = Math.abs(user.total_amount || 0);
                    let type = "CLEAR"; // Default type

                    if (user.total_amount > 0) {
                        type = "LENA"; // Positive amount means Lena (credit)
                    } else if (user.total_amount < 0) {
                        type = "DENA"; // Negative amount means Dena (debit)
                    }

                    return {
                        admin_id: user.admin_id,
                        username: user.username,
                        amount: amount,
                        role: user.role,
                        parent_username: user.parent_username,
                        type: type,
                        total_amount: user.total_amount || 0,
                        // Add other fields you might need
                        coins: user.coins,
                        role_name: user.role_name
                    };
                });

                console.log("Processed clients data:", processedClients);
                setClients(processedClients);

                // Check if adminId exists in processed clients
                const selectedClient = processedClients.find(client => client.admin_id === adminId);

                if (selectedClient) {
                    setSelectedUserData(selectedClient);
                    setShowTable(true);
                    fetchLedgerData(adminId, 1, paymentFilter);
                } else {
                    // If admin_id not found in clients, check if it's the current user
                    const currentAdminId = getLoggedInAdminId();
                    if (adminId === currentAdminId) {
                        setSelectedUserData({
                            admin_id: adminId,
                            username: "Current User",
                            type: "CURRENT"
                        });
                        setShowTable(true);
                        fetchLedgerData(adminId, 1, paymentFilter);
                    } else {
                        // If not found at all, still show table but with minimal info
                        setSelectedUserData({
                            admin_id: adminId,
                            username: adminId,
                            type: "UNKNOWN"
                        });
                        setShowTable(true);
                        fetchLedgerData(adminId, 1, paymentFilter);
                    }
                }
            } else {
                console.log("API response not successful:", response.data);
                // Even if API fails, try to fetch ledger for the adminId
                setShowTable(true);
                fetchLedgerData(adminId, 1, paymentFilter);
            }
        } catch (err) {
            console.error("Error auto-selecting client:", err);
            toast.error("Failed to auto-select client");
            // Even on error, try to fetch ledger
            setShowTable(true);
            fetchLedgerData(adminId, 1, paymentFilter);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            setClientLoading(true);
            const response = await getChildListTransaction(3, admin_id);

            if (response.data && response.data.success) {
                const clientData = response.data.data; // This is an array of users
                console.log("Fetch Clients API response:", clientData);

                // Process the array of users
                const processedClients = clientData.map(user => {
                    // Calculate the ledger amount based on total_amount
                    let amount = Math.abs(user.total_amount || 0);
                    let type = "CLEAR"; // Default type

                    if (user.total_amount > 0) {
                        type = "LENA"; // Positive amount means Lena (credit)
                    } else if (user.total_amount < 0) {
                        type = "DENA"; // Negative amount means Dena (debit)
                    }

                    return {
                        admin_id: user.admin_id,
                        username: user.username,
                        amount: amount,
                        role: user.role,
                        parent_username: user.parent_username,
                        type: type,
                        total_amount: user.total_amount || 0,
                        // Add other fields you might need
                        coins: user.coins,
                        role_name: user.role_name
                    };
                });

                console.log("Final clients list:", processedClients);
                setClients(processedClients);

                if (processedClients.length === 0) {
                    toast.info("No users found.", {
                        position: "top-right",
                        autoClose: 500,
                    });
                }
            } else {
                toast.warning(response.data?.message || "Failed to fetch clients", {
                    position: "top-right",
                    autoClose: 500,
                });
            }
        } catch (err) {
            console.error("Error fetching clients:", err);
            toast.error(err.response?.data?.message || "Error fetching clients", {
                position: "top-right",
                autoClose: 500,
            });
        } finally {
            setClientLoading(false);
        }
    };

    const handleDeleteTxn = async (txnId, adminId) => {
        if (!txnId || !adminId) return;

        const ConfirmationToast = ({ closeToast }) => (
            <div>
                <div className="mb-2">
                    <strong>Delete Transaction?</strong>
                    <p className="mb-0">Ye transaction permanently delete ho jayega!</p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                            closeToast();
                            confirmDelete(txnId, adminId);
                        }}
                    >
                        Yes, Delete
                    </button>
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={closeToast}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );

        toast(<ConfirmationToast />, {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false,
        });
    };

    const confirmDelete = async (txnId, adminId) => {
        try {
            console.log("Deleting transaction with:", {
                ledger_id: txnId,
                admin_id: adminId
            });

            const res = await deleteLedgerTxn({
                admin_id: adminId,
                ledger_id: txnId,
            });

            console.log("Delete response:", res);

            if (res.data?.success) {
                toast.success(res.data.message || "Transaction deleted successfully", {
                    position: "top-right",
                    autoClose: 500,
                });
                // Refresh ledger data after deletion
                fetchLedgerData(adminId, currentPage, paymentFilter);
            } else {
                toast.error(res.data?.message || "Failed to delete transaction", {
                    position: "top-right",
                    autoClose: 500,
                });
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(err.response?.data?.message || "Something went wrong", {
                position: "top-right",
                autoClose: 500,
            });
        }
    };

    const [deletdaat, setdatedata] = useState("");

    useEffect(() => {
        if (deletdaat) {
            localStorage.setItem("deletdaat", deletdaat);
        }
    }, [deletdaat]);

    const fetchLedgerData = async (adminId, pageNo = 1, filter = "all") => {
        setdatedata(adminId)
        if (!adminId) return;
        try {
            setLoadingLedger(true);
            console.log("Fetching ledger for:", { adminId, pageNo, filter });

            // Prepare params - send the selected client's admin_id
            const params = {
                admin_id: adminId,  // Send the selected client's ID
                page: pageNo,
                limit: perPage
            };

            // Only add payment_type if filter is not "all"
            if (filter !== "all") {
                params.payment_type = filter;
            }

            console.log("API params for getMyLedgerTxn:", params);
            const response = await getMyLedgerTxn(params);

            console.log("Ledger response:", response);

            if (response.data?.success) {
                const res = response.data;
                console.log("Ledger data received:", res);

                // Check different response structures
                const ledgerArray = res.data?.data || res.data || res.transactions || [];
                console.log("Processed ledger array:", ledgerArray);

                setLedgerData(ledgerArray);
                setCurrentPage(res.current_page || pageNo);
                setPerPage(res.data?.per_page || perPage);

                const totalItems = res.data?.total || res.total || 0;
                const calculatedTotalPages = Math.ceil(totalItems / perPage);
                setTotalPages(calculatedTotalPages);

                // Update summary from API response
                // Check for total values in the response
                const totalData = res.total || res.data?.total || {};
                const lenaTotal = totalData.lena || res.lena || 0;
                const denaTotal = totalData.dena || res.dena || 0;
                const clearTotal = totalData.clear || res.clear || 0;

                const debit = Number(denaTotal) || 0;
                const credit = Number(lenaTotal) || 0;
                const balance = Number(res.balance) || (credit - debit);

                setSummary({
                    debit: debit,
                    credit: credit,
                    balance: balance,
                    balanceType: balance >= 0 ? "CREDIT" : "DEBIT",
                });

                console.log("Summary updated:", {
                    debit,
                    credit,
                    balance,
                    balanceType: balance >= 0 ? "CREDIT" : "DEBIT"
                });
            } else {
                console.log("No success in response:", response.data);
                setLedgerData([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.log("ledger error", err);
            toast.error(err.response?.data?.message || "Failed to fetch ledger data", {
                position: "top-right",
                autoClose: 500,
            });
            setLedgerData([]);
            setTotalPages(0);
        } finally {
            setLoadingLedger(false);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "amount") {
            if (/^\d*\.?\d{0,2}$/.test(value)) {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        } else if (name === "collection") {
            setFormData((prev) => ({ ...prev, [name]: value.toUpperCase() }));
        } else if (name === "client") {
            setFormData((prev) => ({ ...prev, [name]: value }));
            if (value) {
                const selectedClient = clients.find(client => client.admin_id === value);
                if (selectedClient) {
                    setSelectedUserData(selectedClient);
                    setShowTable(true);
                    fetchLedgerData(value, 1, paymentFilter);
                } else {
                    // If client not found in list but admin_id is provided directly
                    setSelectedUserData({ admin_id: value, username: value });
                    setShowTable(true);
                    fetchLedgerData(value, 1, paymentFilter);
                }
            } else {
                setSelectedUserData(null);
                setShowTable(false);
                setLedgerData([]);
                setSummary({
                    debit: 0,
                    credit: 0,
                    balance: 0,
                    balanceType: "CREDIT"
                });
                setTotalPages(0);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        const adminId = getAdminId();
        setFormData({
            client: adminId || "",
            amount: "",
            collection: "CASH",
            paymentType: "cr",
            date: new Date().toISOString().split("T")[0],
            comment: ""
        });
        setValidated(false);

        if (adminId) {
            fetchLedgerData(adminId, 1, paymentFilter);
        } else {
            setSelectedUserData(null);
            setShowTable(false);
            setLedgerData([]);
            setSummary({
                debit: 0,
                credit: 0,
                balance: 0,
                balanceType: "CREDIT"
            });
            setTotalPages(0);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);

        const isValid =
            formData.client.trim() !== "" &&
            formData.amount !== "" &&
            parseFloat(formData.amount) > 0 &&
            formData.collection.trim() !== "" &&
            formData.paymentType.trim() !== "" &&
            formData.date.trim() !== "";

        if (!isValid) return;

        // For transaction submission, we need to use the logged-in admin's ID
        const loggedInAdminId = getLoggedInAdminId();
        if (!loggedInAdminId) {
            toast.error("Please login again. Admin ID not found.", {
                position: "top-right",
                autoClose: 500,
            });
            return;
        }
    const admin_id = localStorage.getItem("admin_id");

        try {
            const transactionData = {
                // admin_id: loggedInAdminId,  // Logged-in user's ID
                admin_id: formData.client,  
                amount: parseFloat(formData.amount),
                collection: formData.collection,
                send_to_admin_id:admin_id,
                comment: formData.comment,
                date: formData.date,

                payment_type: formData.paymentType,
                date: formData.date
            };

            console.log("Submitting transaction:", transactionData);
            setLoading(true);
            const response = await addNewTransaction(transactionData);

            if (response.data && response.data.success) {
                toast.success(response.data.message || "Transaction Added Successfully", {
                    position: "top-right",
                    autoClose: 500,
                });

                if (formData.client) {
                    fetchLedgerData(formData.client, 1, paymentFilter);
                }

                setFormData(prev => ({
                    ...prev,
                    amount: "",
                    comment: ""
                }));
                setValidated(false);
            } else {
                toast.warning(response.data.message || "Transaction failed", {
                    position: "top-right",
                    autoClose: 500,
                });
            }
        } catch (err) {
            console.error("Submit Error:", err);
            toast.error(err.response?.data?.message || "Error adding transaction", {
                position: "top-right",
                autoClose: 500,
            });
        } finally {
            setLoading(false);
        }
    };

    // Pagination functions
    const handlePrev = () => {
        if (currentPage > 1 && formData.client) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            fetchLedgerData(formData.client, newPage, paymentFilter);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages && formData.client) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            fetchLedgerData(formData.client, newPage, paymentFilter);
        }
    };

    const handlePageClick = (page) => {
        if (page !== '...' && formData.client) {
            setCurrentPage(page);
            fetchLedgerData(formData.client, page, paymentFilter);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are less than or equal to maxVisiblePages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of visible pages
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if at the beginning
            if (currentPage <= 3) {
                start = 2;
                end = 4;
            }

            // Adjust if at the end
            if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
                end = totalPages - 1;
            }

            // Add ellipsis after first page if needed
            if (start > 2) {
                pages.push('...');
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const UserDetailsTable = () => {
        if (!showTable || !formData.client) return null;

        return (
            <div className="card mt-4">
                <div className="card-header bg-color-black">
                    <h3 className="card-title text-white mb-0">Super Agent Details</h3>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="text-center border-danger">
                                <div className="d-flex align-items-end justify-content-between gap-2 master-txn">
                                    <div className="text-start w-50">
                                        <label className="mb-2">Payment Type Filter</label>
                                        <select
                                            className="form-select"
                                            value={paymentFilter}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setPaymentFilter(value);
                                                setCurrentPage(1);
                                                fetchLedgerData(formData.client, 1, value);
                                            }}
                                        >
                                            <option value="all">All</option>
                                            <option value="cr">Payment liya</option>
                                            <option value="dr">Payment Diya</option>
                                        </select>
                                    </div>
                                    <div
                                        className="d-flex align-items-center gap-2 btn btn-danger cursor-pointer"
                                        onClick={() =>
                                            navigate("/Superagenttransactiondelet", {
                                                state: { admin_id: formData.client }
                                            })
                                        }
                                    >
                                        <div><FaTrash size={18} className="text-light" /></div> <span>Delete List</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards - Dena और Lena दोनों दिखाएं */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="text-center border-danger gridnewalldesign">
                                <div className="d-flex gap-2 master-txn">
                                    <span className="fw-bold">DENA</span>
                                    <span className="text-danger">
                                        {Number(summary.debit).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center border-danger gridnewalldesign">
                                <div className="d-flex gap-2 master-txn">
                                    <span className="fw-bold">LENA</span>
                                    <span className="text-success">
                                        {Number(summary.credit).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center border-danger gridnewalldesign">
                                <div className="d-flex gap-2 master-txn">
                                    <span className="fw-bold">BALANCE</span>
                                    <span
                                        className={summary.balanceType === "CREDIT" ? "text-success" : "text-danger"}
                                    >
                                        ₹ {Number(summary.balance).toFixed(2)}
                                        {/* {summary.balanceType === "CREDIT" ? "(Lena)" : "(Dena)"} */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loadingLedger ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading ledger transactions...</p>
                        </div>
                    ) : ledgerData && ledgerData.length > 0 ? (
                        <>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>DATE</th>
                                            <th>DESCRIPTION</th>
                                            <th>DR</th>
                                            <th>CR</th>
                                            <th>BALANCE</th>
                                            <th>PAYMENT TYPE</th>
                                            <th>REMARK</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ledgerData.map((transaction, index) => {
                                            const dr = parseFloat(transaction.debit) || 0;
                                            const cr = parseFloat(transaction.credit) || 0;
                                            const balance = parseFloat(transaction.balance) || 0;
                                            const balanceType = balance >= 0 ? "CREDIT" : "DEBIT";

                                            return (
                                                <tr key={transaction._id || transaction.id || index}
                                                    className={transaction.event_id === "MANUAL" ? "table-call" : ""}
                                                >
                                                    {/* <td>{transaction.post_date}</td> */}
                                                    <td>
  {
  transaction?.post_date
    ? new Date(transaction.post_date).toLocaleDateString("en-IN")
    : transaction?.created_at
    ? new Date(transaction.created_at).toLocaleDateString("en-IN")
    : "No Date"
}
</td>


                                                    <td>{transaction.comment || "N/A"}</td>
                                                    {/* <td className="text-danger">
                                                        {dr > 0 ? dr : "-"}
                                                    </td> */}
                                                    <td className="text-danger">
                                                        {Number(dr) > 0 ? Number(dr).toFixed(2) : "-"}
                                                    </td>

                                                    <td className="text-success">
                                                        {cr > 0 ? (cr).toFixed(2) : "-"}
                                                    </td>
                                                    <td className={balanceType === "CREDIT" ? "text-success" : "text-danger"}>
                                                        ₹ {Math.abs(balance).toFixed(2)}{" "}
                                                        {/* {balanceType === "CREDIT" ? "(Lena)" : "(Dena)"} */}
                                                    </td>
                                                    {/* <td>
                                                        {transaction.payment_type === "dr" ? "DENA" : 
                                                         transaction.payment_type === "cr" ? "LENA" : 
                                                         transaction.payment_type || "-"}
                                                    </td> */}
                                                    <td>
                                                        {transaction.pay_type}
                                                    </td>                                                    <td>{transaction.remarks || "-"}</td>
                                                    <td>
                                                        {/* केवल MANUAL event_id के लिए delete button दिखाएं */}
                                                        {/* {transaction.event_id === "MANUAL" && (
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDeleteTxn(transaction._id, transaction.admin_id)}
                                                                title="Delete Transaction"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        )} */}


                                                                                                    {transaction.send_to_admin_id &&
                                                 transaction.send_to_admin_id.length <= 6 && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleDeleteTxn(transaction._id, transaction.admin_id)
                                                        }
                                                        title="Delete Transaction"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="paginationall d-flex align-items-center gap-1 justify-content-center mt-3">
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        disabled={currentPage === 1}
                                        onClick={handlePrev}
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "6px 12px",
                                            minWidth: "36px",
                                            height: "36px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        &laquo;
                                    </button>

                                    <div className="d-flex gap-1">
                                        {getPageNumbers().map((page, index) => (
                                            <button
                                                key={index}
                                                className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-secondary"}`}
                                                onClick={() => handlePageClick(page)}
                                                disabled={page === '...'}
                                                style={{
                                                    minWidth: "36px",
                                                    height: "36px",
                                                    padding: "6px",
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        disabled={currentPage === totalPages}
                                        onClick={handleNext}
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            padding: "6px 12px",
                                            minWidth: "36px",
                                            height: "36px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        &raquo;
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="alert alert-info text-center">
                            No ledger transactions found for this user.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const collectionOptions = ["CASH", "CHEQUE", "ONLINE TRANSFER", "CARD"];
    const paymentTypeOptions = [
        // { label: "LIYA (Payment Lena)", value: "cr" },
        // { label: "DIYA (Payment Dena)", value: "dr" }


        { label: "LIYA (Payment Lena)", value: "dr" },
        { label: "DIYA (Payment Dena)", value: "cr" }
    ];

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={100}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header bg-color-black">
                            <div className="d-flex align-items-center justify-content-between">
                                <h3 className="card-title text-white mb-0">Super Agent Transaction</h3>
                                <div className="backbutton" onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
                                    <BsArrowLeft className="me-1" /> Back
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <form
                                noValidate
                                className={`needs-validation ${validated ? "was-validated" : ""}`}
                                onSubmit={handleSubmit}
                            >
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            CLIENT <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-control"
                                            name="client"
                                            value={formData.client}
                                            onChange={handleChange}
                                            required
                                            disabled={clientLoading}
                                        >
                                            <option value="">SELECT CLIENT</option>
                                            {clientLoading ? (
                                                <option value="" disabled>Loading clients...</option>
                                            ) : clients.length > 0 ? (
                                                clients.map((client) => (
                                                    <option
                                                        key={`${client.admin_id}-${client.type}`}
                                                        value={client.admin_id}
                                                    >
                                                        {client.username || client.admin_id}
                                                        {/* {client.type && ` (${client.type}: ₹${client.amount.toFixed(2)})`} */}
                                                        {/* {client.type} */}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No clients found</option>
                                            )}
                                        </select>
                                        <div className="invalid-feedback">
                                            Please select a client.
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            AMOUNT <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${validated && (!formData.amount || parseFloat(formData.amount) <= 0)
                                                ? "is-invalid"
                                                : validated && formData.amount && parseFloat(formData.amount) > 0
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            placeholder="Enter amount"
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Please enter a valid amount.
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            COLLECTION <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-control"
                                            name="collection"
                                            value={formData.collection}
                                            onChange={handleChange}
                                            disabled
                                            required
                                        >
                                            <option value="">SELECT COLLECTION</option>
                                            {collectionOptions.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            Please select a collection type.
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            PAYMENT TYPE <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className="form-control"
                                            name="paymentType"
                                            value={formData.paymentType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">SELECT PAYMENT TYPE</option>
                                            {paymentTypeOptions.map((option, index) => (
                                                <option key={index} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            Please select a payment type.
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            DATE <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                        // max={getTodayLocal()}
                                        />

                                        <div className="invalid-feedback">
                                            Please select a date.
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">
                                            COMMENT
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleChange}
                                            placeholder="Enter comment"
                                        />
                                    </div>

                                    <div className="col-md-12">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={resetForm}
                                                disabled={loading}
                                            >
                                                Reset
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Processing...
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
                    {showTable && <UserDetailsTable />}
                </div>
            </div>
        </>
    );
}

export default AgentMasterTransction;