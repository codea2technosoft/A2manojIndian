import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { SelectMastertList, addNewTransaction, getMyLedgerTxn, deleteLedgerTxn } from "../../Server/api";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useParams } from "react-router-dom";
function AgentTransction() {
    const navigate = useNavigate();
    const { master_id } = useParams();
    const admin_id=localStorage.getItem("admin_id")
    const [formData, setFormData] = useState({
        client: "",
        amount: "",
        collection: "CASH",
        paymentType: "cr",
        date: new Date().toISOString().split("T")[0],
        comment: "",
    });
    //    const selectedSuperAgentId = localStorage.getItem("selectedSuperAgentId");
    // console.log("selectedsuperagentId", selectedSuperAgentId)
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
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    useEffect(() => {
        fetchClients();
    }, []);

    // const fetchClients = async () => {
    //     try {
    //         setClientLoading(true);
    //         const response = await getChildList(4);

    //         if (response.data && response.data.success) {
    //             const clientData = response.data.data || [];
    //             setClients(clientData);
    //              if (clientData.length > 0 && master_id) {
    //                 const selectedClient = clientData.find(
    //                     (c) => c.admin_id === master_id
    //                 );
    //                 if (selectedClient) {
    //                     setFormData((prev) => ({
    //                         ...prev,
    //                         client: selectedClient.admin_id,
    //                     }));
    //                     setSelectedUserData(selectedClient);
    //                     setShowTable(true);
    //                     fetchLedgerData(selectedClient.admin_id, 1, paymentFilter);
    //                 }
    //             }
    //             if (clientData.length === 0) {
    //                 Swal.fire({
    //                     icon: "info",
    //                     title: "No Clients",
    //                     text: "No Master Admin users found.",
    //                 });
    //             }
    //         } else {
    //             Swal.fire({
    //                 icon: "warning",
    //                 title: "Warning",
    //                 text: response.data?.message,
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Error fetching clients:", err);
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             text: err.response?.data?.message,
    //         });
    //     } finally {
    //         setClientLoading(false);
    //     }
    // };

    const fetchClients = async () => {
        try {
            setClientLoading(true);

            const response = await SelectMastertList({ role: 4 });

            if (response.data?.success) {
                const apiData = response.data.data || [];
                console.log("API Data:", apiData);
                const role3Users = apiData.filter(user => user.role === 4);
                setClients(role3Users);
                // Auto select if master_id exists
                if (master_id && role3Users.length > 0) {
                    const selectedClient = role3Users.find(
                        (c) => String(c.admin_id) === String(master_id)
                    );

                    if (selectedClient) {
                        setFormData((prev) => ({
                            ...prev,
                            client: selectedClient.admin_id,
                        }));

                        setSelectedUserData(selectedClient);
                        setShowTable(true);
                        fetchLedgerData(selectedClient.admin_id, 1, paymentFilter);
                    } else {
                        Swal.fire({
                            icon: "warning",
                            title: "Super Agent Not Found",
                            text: "The specified Super Agent ID was not found.",
                        });
                    }
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setClientLoading(false);
        }
    };







    //delete transactio
    const handleDeleteTxn = async (ledger_id) => {
        // if (!formData.client || !ledger_id) return;

        const confirm = await Swal.fire({
            icon: "warning",
            title: "Delete Transaction?",
            text: "Ye transaction permanently delete ho jayega!",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
        });
        if (!confirm.isConfirmed) return;
        try {
            const res = await deleteLedgerTxn({
                admin_id: formData.client,
                ledger_id: ledger_id,
            });
            if (res.data?.success) {
                Swal.fire("Deleted!", res.data.message, "success");
                fetchLedgerData(formData.client, currentPage, paymentFilter);
            }
        } catch (err) {
            Swal.fire(
                "Error",
                err.response?.data?.message,
                "error"
            );
        }
    };

    const fetchLedgerData = async (adminId, pageNo = 1, filter = "all") => {
        if (!adminId) return;

        try {
            setLoadingLedger(true);

            const response = await getMyLedgerTxn({
                admin_id: adminId,
                payment_type: filter,
                page: pageNo,
                limit: 10
            });

            if (response.data?.success) {
                const res = response.data;

                setLedgerData(res.data?.data || []);


                setCurrentPage(res.current_page || 1);
                setItemsPerPage(res.data?.per_page || 10);
                setTotalItems(res.data?.total || 0);

                // setSummary({
                //     debit: Number(res.debit) || 0,
                //     credit: Number(res.credit) || 0,
                //     balance: Number(res.balance) || 0,
                //     balanceType: res.balance >= 0 ? "CREDIT" : "DEBIT",
                // });
                setSummary({
                    debit: Number(res.dena) || 0,   // DIYA
                    credit: Number(res.lena) || 0, // LIYA
                    balance: Number(res.balance) || 0,
                    balanceType: res.balance >= 0 ? "LIYA" : "DIYA"
                });

            }
        } catch (err) {
            console.log("ledger error", err);
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
                    fetchLedgerData(value, paymentFilter);
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
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData({
            client: "",
            amount: "",
            collection: "CASH",
            paymentType: "cr",
            date: new Date().toISOString().split("T")[0],
            comment: ""
        });
        setValidated(false);
        setSelectedUserData(null);
        setShowTable(false);
        setLedgerData([]);
        setSummary({
            debit: 0,
            credit: 0,
            balance: 0,
            balanceType: "CREDIT"
        });
    };
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 3;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (end - start < maxVisiblePages - 1) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }

        return pages;
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            fetchLedgerData(formData.client, currentPage - 1, paymentFilter);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            fetchLedgerData(formData.client, currentPage + 1, paymentFilter);
        }
    };

    const handlePageClick = (page) => {
        fetchLedgerData(formData.client, currentPage, paymentFilter);

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

        setLoading(true);
        try {
            const transactionData = {
                send_to_admin_id:admin_id,
                admin_id: formData.client,
                amount: parseFloat(formData.amount),
                collection: formData.collection,
                comment: formData.comment,
                payment_type: formData.paymentType,
                date: formData.date
            };

            const response = await addNewTransaction(transactionData);

            if (response.data && response.data.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Transaction Added",
                    text: response.data.message,
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                if (formData.client) {
                    fetchLedgerData(formData.client);
                }

                setFormData(prev => ({
                    ...prev,
                    amount: "",
                    collection: "CASH",
                    paymentType: "cr",
                    date: new Date().toISOString().split("T")[0],
                    comment: ""
                }));
                setValidated(false);
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: response.data.message,
                });
            }
        } catch (err) {
            console.error("Submit Error:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const UserDetailsTable = () => {
        if (!selectedUserData || !showTable) return null;
        return (
            <div className="card mt-4">
                <div className="card-header bg-color-black">
                    <h5 className="text-white mb-0">Agent Transaction Details</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="text-center border-danger">
                                <div className="master-txn gap-2 mb-3 d-flex align-items-end">
                                    <div className="w-100 text-start">
                                        <label className="text-uppercase fw-bold">payment Type</label>
                                        <select
                                            className="form-select"
                                            value={paymentFilter}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setPaymentFilter(value);
                                                fetchLedgerData(formData.client, 1, value);
                                            }}>
                                            <option value="all">All</option>
                                            {/* <option value="cr">Payment Credit</option>
                                            <option value="dr">Payment Debit</option> */}
                                            <option value="dr">Payment Liya</option>
                                            <option value="cr">Payment Diya</option>

                                        </select>

                                    </div>
                                    <div className="trashbutton"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            navigate("/Superagenttransactiondelet", {
                                                state: { admin_id: formData.client }
                                            })
                                        }
                                    >
                                        <FaTrash size={18} className="text-danger" />
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="text-center border-danger gridnewalldesign">
                                <div className="d-flex gap-2 master-txn">
                                    <span className="">DENA</span>
                                    <span className="text-danger">{summary.debit.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center border-danger gridnewalldesign">
                                <div className="d-flex gap-2 master-txn">
                                    <span className="">LENA</span>
                                    <span className="text-success">{summary.credit.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center border-danger gridnewalldesign">
                                <div className="d-flex gap-2 master-txn">
                                    <span className="">BALANCE</span>
                                    <span className="text-success">   {summary.balance.toFixed(2)}</span>
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
                    ) : ledgerData.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>DATE</th>
                                        <th>Delete</th>
                                        <th>DESCRIPTION</th>
                                        <th>DR</th>
                                        <th>CR</th>
                                        <th>BALANCE</th>
                                        <th>PAYMENT TYPE</th>
                                        <th>REMARK</th>
                                        {/* <th>DONE BY</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ledgerData.map((transaction, index) => {
                                        // const amount = parseFloat(transaction.amount) || 0;
                                        // const dr = transaction.payment_type === "dr" ? amount : 0;
                                        // const cr = transaction.payment_type === "cr" ? amount : 0;
                                        const balance = parseFloat(transaction.balance) || 0;

                                        const dr = Number(transaction.debit) || 0;
                                        const cr = Number(transaction.credit) || 0;



                                        const balanceType = balance >= 0 ? "CREDIT" : "DEBIT";
                                        return (
                                            <tr key={transaction.id || transaction.lenden_uuid || index}>
                                                <td>
                                                    <td>
                                                        {new Date(transaction.created_at).toLocaleString("en-IN", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })}
                                                    </td>
                                                </td>

                                                <td>
                                                    {transaction.event_id === "MANUAL" && transaction.send_to_admin_id === admin_id && (
                                                        <button
                                                            className="trashbutton"
                                                            onClick={() => handleDeleteTxn(transaction._id)}
                                                        >
                                                            <FaTrash size={18} />
                                                        </button>
                                                    )}
                                                </td>
                                                <td>{transaction.comment || "N/A"}</td>
                                                <td className="text-danger">{dr.toFixed(2)}</td>
                                                <td className="text-success">{cr.toFixed(2)}</td>
                                                <td className={balanceType === "CREDIT" ? "text-success" : "text-danger"}>
                                                    <strong>{Math.abs(balance).toFixed(2)}</strong>
                                                </td>
                                                {/* <td>{transaction.payment_type === "cr" ? "CREDIT" : "DEBIT"}</td> */}
                                                <td>
                                                    {/* {transaction.credit > 0 ? "LIYA" : "DIYA"} */}
                                                    {transaction.pay_type}
                                                </td>

                                                <td>{transaction.remarks || "-"}</td>
                                                {/* <td>
                                                    {admin_id }
                                                </td> */}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                    ) : (
                        <div className="alert alert-info text-center">
                            No ledger transactions found for this user.
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="sohwingallentries">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                                {Math.min(currentPage * itemsPerPage, totalItems)}
                            </div>

                            <div className="paginationall d-flex align-items-center gap-1">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={handlePrev}
                                    className="d-flex justify-content-center align-items-center"
                                >
                                    <MdOutlineKeyboardArrowLeft />
                                </button>

                                <div className="d-flex gap-1">
                                    {getPageNumbers().map((page) => (
                                        <div
                                            key={page}
                                            className={`paginationnumber ${currentPage === page ? "active" : ""
                                                }`}
                                            onClick={() => handlePageClick(page)}
                                        >
                                            {page}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={handleNext}
                                    className="d-flex justify-content-center align-items-center"
                                >
                                    <MdOutlineKeyboardArrowRight />
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    };
    const collectionOptions = ["CASH", "CHEQUE", "ONLINE TRANSFER", "CARD"];
    // const paymentTypeOptions = [
    //     { label: "Credit", value: "cr" },
    //     { label: "Debit", value: "dr" }
    // ];
    const paymentTypeOptions = [
        { label: "PAYMENT LIYA", value: "dr" },
        { label: "PAYMENT DIYA", value: "cr" }
    ];

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header bg-color-black">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="card-title text-white mb-0">Agent Transaction</h3>
                            <button className="backbutton" onClick={() => navigate(-1)}>
                                <BsArrowLeft className="me-1" /> Back
                            </button>
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
                                        CLIENT <span style={{ color: "red" }}>*</span>
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
                                                    key={client._id}
                                                    value={client.admin_id}
                                                >
                                                    {client.username}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>No clients found</option>
                                        )}
                                    </select>
                                    <div className="valid-feedback">Looks good!</div>
                                    <div className="invalid-feedback">
                                        Please select a client.
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        AMOUNT <span style={{ color: "red" }}>*</span>
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
                                    <div className="valid-feedback">Looks good!</div>
                                    <div className="invalid-feedback">
                                        Please enter a valid amount.
                                    </div>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        COLLECTION <span style={{ color: "red" }}>*</span>
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
                                        PAYMENT TYPE <span style={{ color: "red" }}>*</span>
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
                                        DATE <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        disabled
                                        required
                                        max={new Date().toISOString().split("T")[0]}
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
                                    <div className="d-flex justify-content-end gap-2 formfooter">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={resetForm}
                                            disabled={loading}
                                        >
                                            Reset
                                        </button>
                                        <button
                                            className="button_submit"
                                            type="submit"
                                            disabled={loading || clientLoading}
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
    );
}

export default AgentTransction;