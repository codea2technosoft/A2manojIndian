import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { getDeletedLedgerTxn } from "../../Server/api";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";

function MasterDeletedTransactionList() {
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

   const adminId = location.state?.admin_id;
    const fetchDeletedTxns = async (adminId) => {
        if (!adminId) return;
        try {
            setLoading(true);
            const res = await getDeletedLedgerTxn({ admin_id: adminId, limit: 10 });
            if (res.data?.success) {
                setTransactions(res.data?.data?.data || []);
            } else {
                setTransactions([]);
                Swal.fire("Info", "No deleted transactions found.", "info");
            }
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (adminId) {
            fetchDeletedTxns(adminId);
        } else {
            Swal.fire("Error", "No user selected", "error");
            navigate(-1);
        }
    }, [adminId]);

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header bg-color-black d-flex justify-content-between align-items-center">
                        <h5 className="text-white mb-0">DELETED TRANSACTIONS</h5>
                        <div className="backbutton" onClick={() => navigate(-1)}>
                           Back
                        </div>
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
                                        {transactions.map((tx, i) => (
                                            <tr key={i}>
                                                <td>{new Date(tx.deleted_at).toLocaleString()}</td>
                                                <td>{tx.description || "N/A"}</td>
                                                <td className="text-danger">{tx.debit > 0 ? tx.debit.toFixed(2) : "0"}</td>
                                                <td className="text-success">{tx.credit > 0 ? tx.credit.toFixed(2) : "0"}</td>
                                                <td className={tx.balanceType === "CREDIT" ? "text-success" : "text-danger"}>
                                                    {Math.abs(tx.balance).toFixed(2)} {tx.balanceType}
                                                </td>
                                                <td>
                                                  {tx.collection_name}
                                                </td>

                                                <td>{tx.remarks}</td>

                                            </tr>
                                        ))}
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

export default MasterDeletedTransactionList;
