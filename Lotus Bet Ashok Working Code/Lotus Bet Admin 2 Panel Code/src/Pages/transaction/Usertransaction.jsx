import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getChildList_list, addNewTransaction, getMyLedgerTxn, deleteLedgerTxn } from "../../Server/api";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";

function Usertransaction() {
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
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const admin_id = localStorage.getItem("admin_id");
    console.log("admin_id", admin_id)
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setClientLoading(true);
            const response = await getChildList_list(5); // role = 2

            if (response.data && response.data.success) {
                const clientData = response.data.data || [];
                setClients(clientData);

                if (clientData.length === 0) {
                    Swal.fire({
                        icon: "info",
                        title: "No Clients",
                        text: "No Master Admin users found.",
                    });
                }
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Warning",
                    text: response.data?.message,
                });
            }
        } catch (err) {
            console.error("Error fetching clients:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message,
            });
        } finally {
            setClientLoading(false);
        }
    };
    //delete transactio
    const handleDeleteTxn = async (txnId) => {
        if (!formData.client || !txnId) return;

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
                transaction_id: txnId,
            });

            if (res.data?.success) {
                Swal.fire("Deleted!", res.data.message, "success");
                fetchLedgerData(formData.client, page, paymentFilter);
            }
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
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

                setPage(res.current_page || 1);
                setPerPage(res.data?.per_page || 10);
                setTotal(res.data?.total || 0);

                setSummary({
                    debit: Number(res.debit) || 0,
                    credit: Number(res.credit) || 0,
                    balance: Number(res.balance) || 0,
                    balanceType: res.balance >= 0 ? "CREDIT" : "DEBIT",
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
                    <h3 className="card-title text-white mb-0"> User  Details</h3>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="text-center border-danger">
                                <div className=" d-flex align-items-end gap-2 master-txn">
                                    <div className="w-100 text-start">
                                        <label className="">payment Type</label>
                                        <div>
                                            <select
                                                className="form-select"
                                                value={paymentFilter}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setPaymentFilter(value);
                                                    fetchLedgerData(formData.client, 1, value);
                                                }}
                                            >
                                                <option value="all">All</option>
                                                <option value="cr">Payment Credit</option>
                                                <option value="dr">Payment Debit</option>
                                            </select>


                                        </div>
                                    </div>
                                    <div className="trashbutton d-flex align-items-center gap-2"
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
                                    <span className="">DEBIT</span>
                                    <span className="text-danger">{summary.debit.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center border-danger gridnewalldesign">
                                <div className="d-flex gap-2 master-txn">
                                    <span className="">CREDIT</span>
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
                                        <th>DESCRIPTION</th>
                                        <th>DR</th>
                                        <th>CR</th>
                                        <th>BALANCE</th>
                                        <th>PAYMENT TYPE</th>
                                        <th>REMARK</th>
                                        <th>Delete</th>
                                        {/* <th>DONE BY</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ledgerData.map((transaction, index) => {
                                        const amount = parseFloat(transaction.amount) || 0;
                                        const dr = transaction.payment_type === "dr" ? amount : 0;
                                        const cr = transaction.payment_type === "cr" ? amount : 0;
                                        const balance = parseFloat(transaction.balance) || 0;
                                        const balanceType = balance >= 0 ? "CREDIT" : "DEBIT";
                                        return (
                                            <tr key={transaction.id || transaction.lenden_uuid || index}>
                                                <td>{transaction.date}</td>

                                                <td>{transaction.collection || "N/A"}</td>
                                                <td className="text-danger">{dr > 0 ? dr.toFixed(2) : "-"}</td>
                                                <td className="text-success">{cr > 0 ? cr.toFixed(2) : "-"}</td>
                                                <td className={balanceType === "CREDIT" ? "text-success" : "text-danger"}>
                                                    <strong>{Math.abs(balance).toFixed(2)}</strong>
                                                </td>
                                                <td>{transaction.payment_type === "cr" ? "CREDIT" : "DEBIT"}</td>
                                                <td>{transaction.comment || "-"}</td>
                                                <td>
                                                    <button
                                                        className="trashbutton"
                                                        onClick={() => handleDeleteTxn(transaction.transaction_id)}
                                                    >
                                                        <FaTrash size={18} className="text-danger" />
                                                    </button>
                                                </td>
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
                    {total > perPage && (
                        <div className="d-flex justify-content-between align-items-center mt-3">

                            <button
                                className="btn btn-sm btn-primary"
                                disabled={page === 1}
                                onClick={() => fetchLedgerData(formData.client, page - 1, paymentFilter)}
                            >
                                Prev
                            </button>

                            <span>
                                Page {page} / {Math.ceil(total / perPage)}
                            </span>

                            <button
                                className="btn btn-sm btn-primary"
                                disabled={page === Math.ceil(total / perPage)}
                                onClick={() => fetchLedgerData(formData.client, page + 1, paymentFilter)}
                            >
                                Next
                            </button>

                        </div>
                    )}

                </div>
            </div>
        );
    };
    const collectionOptions = ["CASH", "CHEQUE", "ONLINE TRANSFER", "CARD"];
    const paymentTypeOptions = [
        { label: "Credit", value: "cr" },
        { label: "Debit", value: "dr" }
    ];

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header bg-color-black">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="card-title text-white mb-0"> User  Transaction</h3>
                            {/* <div className="backbutton" onClick={() => navigate(-1)}>
                                <BsArrowLeft className="me-1" /> Back
                            </div> */}
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
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="refreshbutton"
                                            onClick={resetForm}
                                            disabled={loading}
                                        >
                                            Reset
                                        </button>
                                        <button
                                            className="refreshbutton"
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

export default Usertransaction;