import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  // const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

    const baseUrl = process.env.REACT_APP_BACKEND_API;


  const [phonenum, setPhonenum] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setError("User ID not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${baseUrl}/getProfil/${userId}`);

        if (response.data.success) {
          setPhonenum(response.data.user.mobile);
          setBalance(response.data.user.balance || 0);
        } else {
          setError(response.data.message || "Failed to fetch user");
        }
      } catch (err) {
        console.error(err);
        setError("Server error or network issue");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [baseUrl]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{error}</p>;

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "15px",
        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <h2 style={{ marginBottom: "25px", fontSize: "24px", color: "#2c3e50" }}>User Info</h2>

      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontWeight: "600", fontSize: "16px", marginBottom: "5px", color: "#555" }}>
          Phone Number
        </p>
        <p style={{ fontSize: "18px", fontWeight: "700", color: "#1abc9c" }}>{phonenum}</p>
      </div>

      <div>
        <p style={{ fontWeight: "600", fontSize: "16px", marginBottom: "5px", color: "#555" }}>
          Balance
        </p>
        <p style={{ fontSize: "18px", fontWeight: "700", color: "#e67e22" }}>₹ {balance}</p>
      </div>
    </div>
  );
};

export default UserProfile;
