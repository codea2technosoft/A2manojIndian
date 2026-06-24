import React from "react";
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();

  const items = [
    { label: "STATEMENT", path: "/statement" },
    { label: "ACCOUNT OPERATIONS", path: "/AccountOperation" },
    { label: "PROFIT & LOSS", path: "/Profit_Loss" },
    // { label: "SEARCH CLIENT", path: "/Searchlient" },
  ];

  return (
    <div style={containerStyle}>
      {items.map((item, index) => (
        <div
          key={index}
          style={buttonStyle}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default MyComponent;

// 🔽 Styles
const containerStyle = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
  padding: "20px",
  background: "#f5f5f5",
};

const buttonStyle = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "14px 24px",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  minWidth: "180px",
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
};
