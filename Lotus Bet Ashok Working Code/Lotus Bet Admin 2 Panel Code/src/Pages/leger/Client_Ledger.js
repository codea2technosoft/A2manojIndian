import React, { useEffect, useState } from "react";
import { getChildList } from "../../Server/api";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AiOutlineBarChart } from "react-icons/ai";

function AgentLedger() {
    const [ledgerData, setLedgerData] = useState({
        lena: [],
        dena: [],
        clear: [],
        total: { lena: 0, dena: 0, clear: 0 }
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function को useEffect से पहले define करें
    const fetchLedgerData = async () => {
        const admin_id = localStorage.getItem("admin_id");
        const superagent_admin_id = localStorage.getItem("superagent_admin_id");
        console.warn("superagent_admin_id",superagent_admin_id,"admin_id",admin_id)

        try {
            setLoading(true);
            const res = await getChildList(4,superagent_admin_id || admin_id);

            // Handle the response based on your API structure
            if (res.data?.success) {
                console.log("API Response:", res.data); // Debug log
                setLedgerData({
                    lena: res.data.data?.lena || [],
                    dena: res.data.data?.dena || [],
                    clear: res.data.data?.clear || [],
                    total: res.data.data?.total || { lena: 0, dena: 0, clear: 0 }
                });
            }
        } catch (err) {
            console.error("Error fetching ledger data:", err);
        } finally {
            setLoading(false);
        }
    };

    // अब useEffect में इस function को use करें
    useEffect(() => {
        fetchLedgerData();
    }, []);

    const handleViewClick = (item, type) => {
        // Store ALL important data in localStorage
        if (item.admin_id) {
            localStorage.setItem("superagent_admin_id", item.admin_id);
        }
        localStorage.setItem("ledger_type", type);
        localStorage.setItem("current_user", JSON.stringify({
            username: item.username || "N/A",
            amount: item.amount || 0,
            role: item.role || 2,
            admin_id: item.admin_id || ""
        }));

        // Navigate based on ledger type
        navigate(`/Agenttransaction`);
    };

    const handleViewClickdata = (item, type) => {
        // Store ALL important data in localStorage
        if (item.admin_id) {
            localStorage.setItem("superagent_admin_id", item.admin_id);
        }
        localStorage.setItem("ledger_type", type);
        localStorage.setItem("current_user", JSON.stringify({
            username: item.username || "N/A",
            amount: item.amount || 0,
            role: item.role || 2,
            admin_id: item.admin_id || ""
        }));

        // Navigate based on ledger type
        navigate(`/Client_user`);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Function to render ledger section
    const renderLedgerSection = (type, title, className) => {
        const data = ledgerData[type];
        const total = ledgerData.total[type] || 0;

        return (
            <div className="col-md-4">
                <div className="card ledger-card h-100">
                    {/* Header */}
                    <div className={`ledger-header ${className}`}>
                        <span className="fw-bold">{title}</span>
                        <span className="fw-bold">{total.toFixed(2)}</span>
                    </div>

                    {/* Table Head */}
                    <div className="ledger-table-head">
                        <div className="w-50 fw-semibold">Username</div>
                        <div className="w-25 text-end">Amount</div>
                        <div className="w-25 text-end">Action</div>
                    </div>

                    {/* Rows */}
                    <div className="ledger-rows-container">
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <div key={`${type}-${index}`} className="ledger-row">
                                    <div
                                        className="w-50 fw-semibold text-primary d-flex align-items-center gap-1"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleViewClickdata(item, type)}
                                        title="View Transactions"
                                    >
                                        <div> <FaEye /></div>
                                        <span className="text-dark fw-bold"> {item.username || "N/A"}</span>
                                    </div>
                                    <div className="w-25 text-end fw-semibold">
                                        {item.amount ? Number(item.amount).toFixed(2) : "0.00"}
                                    </div>
                                    <div className="w-25 text-end">
                                        <AiOutlineBarChart
                                            className="action-icon"
                                            onClick={() => handleViewClick(item, type)}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                            title={`View ${title} Transactions`} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-data">No Data Available</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid py-3">
            <div className="row g-4">
                {renderLedgerSection("lena", "LENA", "lena")}
                {renderLedgerSection("dena", "DENA", "dena")}
                {renderLedgerSection("clear", "CLEAR", "clear")}
            </div>
        </div>
    );
}

export default AgentLedger;
