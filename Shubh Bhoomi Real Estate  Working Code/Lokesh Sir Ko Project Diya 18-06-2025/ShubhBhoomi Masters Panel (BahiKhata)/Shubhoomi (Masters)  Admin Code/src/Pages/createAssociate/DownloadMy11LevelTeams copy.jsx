import React, { useEffect, useState } from "react";
import { Table, Spinner, Pagination, Form } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = process.env.REACT_APP_API_URL;
function MyAssociates() {
  const [mobile, setMobile] = useState("");
  const getAuthToken = () => localStorage.getItem("token");

  const fetchUsers = async () => {
    if (!mobile) {
      Swal.fire({
        icon: "warning",
        title: "Missing Input",
        text: "Please enter a mobile number",
      });
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/myteam-list-lavel11-excel?mobile=${mobile}`,
        { responseType: "blob" }
      );
      const text = await response.data.text();
      try {
        const json = JSON.parse(text);
        if (json.status === "0") {
          Swal.fire({
            icon: "info",
            title: "Sorry!",
            text: json.message || "No data found",
          });
          return;
        }
      } catch (e) {
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `myteam_level11_${mobile}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "No data found, please try another.",
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center",
        background: "#f9f9f9",
      }}
    >
      <h2>Download My Team Excel</h2>
      <input
        type="text"
        placeholder="Enter Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          border: "1px solid #aaa",
          borderRadius: "5px",
        }}
      />
      <button
        onClick={fetchUsers}
        style={{
          background: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Download Excel
      </button>
    </div>
  );
}

export default MyAssociates;
