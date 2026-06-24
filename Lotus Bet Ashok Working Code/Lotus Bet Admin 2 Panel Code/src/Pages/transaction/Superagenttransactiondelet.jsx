import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { getDeletedLedgerTxn } from "../../Server/api";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";

function Superagenttransactiondelet() {
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    // admin_id passed from AgentMaster page
    const adminId = location.state?.admin_id;
    const deletdaatlist = localStorage.getItem("deletdaat");
    // alert(deletdaatlist)
    // Fetch deleted transactions
    const fetchDeletedTxns = async (adminId) => {
        // if (!adminId) return;
        const deletdaatlist = localStorage.getItem("deletdaat");

        try {
            setLoading(true);
            // const admin_id = localStorage.getItem("admin_id");

            const res = await getDeletedLedgerTxn({ admin_id: deletdaatlist, limit: 10 });

            if (res.data?.success) {
                setTransactions(res.data?.data?.data || []);
            } else {
                setTransactions([]);
                Swal.fire("Info", "No deleted transactions found.", "info");
            }
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    // Auto fetch on mount
    useEffect(() => {
        if (adminId) {
            fetchDeletedTxns(adminId);
        } else {
            Swal.fire("Error", "No user selected", "error");
            navigate(-1); // redirect back if no admin_id
        }
    }, [adminId]);

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header bg-color-black d-flex justify-content-between align-items-center">
                        <h4 className="text-white mb-0">DELETED TRANSACTIONS</h4>
                        <Button variant="light" onClick={() => navigate(-1)}>
                            <BsArrowLeft className="me-1" /> Back
                        </Button>
                    </div>

                    <div className="card-body">
                        {loading ? (
                            <p className="text-center">Loading deleted transactions...</p>
                        ) : transactions.length > 0 ? (
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

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction, index) => {
                                            const dr = parseFloat(transaction.debit) || 0;
                                            const cr = parseFloat(transaction.credit) || 0;
                                            const balance = parseFloat(transaction.balance) || 0;
                                            const balanceType = balance >= 0 ? "CREDIT" : "DEBIT";

                                            return (
                                                <tr key={transaction._id || transaction.id || index}>
                                                    <td>
                                                        {transaction.created_at
                                                            ? new Date(transaction.created_at).toLocaleString("en-IN", {
                                                                hour: "numeric",
                                                                minute: "numeric",
                                                                second: "numeric",
                                                                hour12: true,
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                            })
                                                            : new Date().toLocaleString("en-IN", {
                                                                hour: "numeric",
                                                                minute: "numeric",
                                                                second: "numeric",
                                                                hour12: true,
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                            })}
                                                    </td>

                                                    <td>{transaction.collection_name || transaction.description || "N/A"}</td>
                                                    <td className="text-danger">
                                                        {dr > 0 ? dr.toFixed(2) : "-"}
                                                    </td>
                                                    <td className="text-success">
                                                        {cr > 0 ? cr.toFixed(2) : "-"}
                                                    </td>
                                                    <td className={balanceType === "CREDIT" ? "text-success" : "text-danger"}>
                                                        ₹ {Math.abs(balance).toFixed(2)}{" "}
                                                        {balanceType === "CREDIT" ? "(Lena)" : "(Dena)"}
                                                    </td>
                                                    {/* <td>
                                                                           {transaction.payment_type === "dr" ? "DENA" : 
                                                                           transaction.payment_type === "cr" ? "LENA" : 
                                                                           transaction.payment_type || "-"}
                                                                       </td> */}
                                                    <td>{transaction.comment || "-"}</td>
                                                    <td>{transaction.remarks || "-"}</td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="alert alert-info text-center">
                                No deleted transactions found for this user.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Superagenttransactiondelet;
