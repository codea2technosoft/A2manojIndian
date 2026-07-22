import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

/* ---------- INLINE STYLES ---------- */
const cardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "12px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const titleStyle = {
  fontSize: "13px",
  color: "#6b7280",
  fontWeight: "600",
};

const valueStyle = {
  fontSize: "15px",
  fontWeight: "500",
  wordBreak: "break-word",
};

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "700",
  marginBottom: "12px",
  borderLeft: "4px solid #2563eb",
  paddingLeft: "8px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const InfoCard = ({ title, value, color }) => (
  <div style={cardStyle}>
    <div style={titleStyle}>{title}</div>
    <div style={{ ...valueStyle, color }}>{value ?? "N/A"}</div>
  </div>
);

/* ---------- COMPONENT ---------- */
const Superagentadminview = () => {
  const { id } = useParams();
  const [superAgentData, setSuperAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/get-edit-admin-details`,
          { admin_id: id, role: 3 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setSuperAgentData(res.data.data);
        } else {
          setError("Data not found");
        }
      } catch (err) {
        setError("API Error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  if (error) return <h3 style={{ color: "red", textAlign: "center" }}>{error}</h3>;
  if (!superAgentData) return null;

  return (
    <div style={{ padding: "16px", background: "#f3f4f6", minHeight: "100vh" }}>
      <h2 style={{ textAlign: "center", fontSize: "22px" }}>
        Super Agent Full Details
      </h2>
{/* 
      <p style={{ textAlign: "center", marginBottom: "16px" }}>
        <b>ID:</b> {id}
      </p> */}

      {/* BASIC INFO */}
      <div style={{ marginBottom: "24px" }}>
        <div style={sectionTitle}>Basic Information</div>
        <div style={gridStyle}>
          <InfoCard title="Username" value={superAgentData.username} />
          <InfoCard title="Admin ID" value={superAgentData.admin_id} />
          <InfoCard title="Super Admin ID" value={superAgentData.super_admin_id} />
          <InfoCard title="Master Admin ID" value={superAgentData.master_admin_id} />
          <InfoCard title="Role" value={superAgentData.role_name} />
          <InfoCard title="Role ID" value={superAgentData.role} />
          <InfoCard title="Password" value={superAgentData.password} />
        </div>
      </div>

      {/* WALLET */}
      <div style={{ marginBottom: "24px" }}>
        <div style={sectionTitle}>Wallet & Limits</div>
        <div style={gridStyle}>
          <InfoCard title="Amount" value={superAgentData.amount} />
          <InfoCard title="Coins" value={superAgentData.coins} />
          <InfoCard title="Min Withdraw" value={superAgentData.min_withdraw} />
          <InfoCard title="Max Withdraw" value={superAgentData.max_withdraw} />
        </div>
      </div>

      {/* COMMISSION */}
      <div style={{ marginBottom: "24px" }}>
        <div style={sectionTitle}>Commission Details</div>
        <div style={gridStyle}>
          <InfoCard title="Commission Type" value={superAgentData.commission_type} />
          <InfoCard title="Commission Rate" value={`${superAgentData.commission_rate}%`} />
          <InfoCard title="Match Share" value={`${superAgentData.match_share}%`} />
          <InfoCard title="Match Commission" value={`${superAgentData.match_comm}%`} />
          <InfoCard title="Session Commission" value={`${superAgentData.session_comm}%`} />
        </div>
      </div>

      {/* ODDS */}
      <div style={{ marginBottom: "24px" }}>
        <div style={sectionTitle}>Odds & Bookmaker</div>
        <div style={gridStyle}>
          <InfoCard title="Odd Min" value={superAgentData.odd_min} />
          <InfoCard title="Odd Max" value={superAgentData.odd_max} />
          <InfoCard title="Bookmaker Min" value={superAgentData.bookmaker_min} />
          <InfoCard title="Bookmaker Max" value={superAgentData.bookmaker_max} />
        </div>
      </div>

      {/* STATUS */}
      <div style={{ marginBottom: "24px" }}>
        <div style={sectionTitle}>Account Status</div>
        <div style={gridStyle}>
          <InfoCard
            title="Active"
            value={superAgentData.active === 1 ? "YES" : "NO"}
            color={superAgentData.active === 1 ? "green" : "red"}
          />
          <InfoCard
            title="Blocked"
            value={superAgentData.is_blocked === "1" ? "YES" : "NO"}
            color={superAgentData.is_blocked === "1" ? "red" : "green"}
          />
          <InfoCard
            title="Deleted"
            value={superAgentData.is_deleted === "1" ? "YES" : "NO"}
            color={superAgentData.is_deleted === "1" ? "red" : "green"}
          />
        </div>
      </div>

      {/* TIME */}
      <div>
        <div style={sectionTitle}>Time Information</div>
        <div style={gridStyle}>
          <InfoCard
            title="Created At"
            value={new Date(superAgentData.created_at).toLocaleString()}
          />
          <InfoCard
            title="Updated At"
            value={new Date(superAgentData.updated_at).toLocaleString()}
          />
        </div>
      </div>
    </div>
  );
};

export default Superagentadminview;
