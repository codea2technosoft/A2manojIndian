import React from "react";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };
  const items = [
    {
      label: "Statement",
      path: "/getAllstatment",
      bg: "bg-primary-blue",
    },
    {
      label: "Account Operations",
      path: "/getAllAccountOperation",
      bg: "bg-royal-purple",
    },
    {
      label: "Profit & Loss",
      path: "/my-profit-loss",
      bg: "bg-violet-magenta",
    },
  ];

  return (
    <div className="card">
      <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">Admin Setting</h3>
      </div>
      <div className="card-body">
        <div className="items-wrapper">
          <div className="items-grid">
            {items.map((item, i) => (
              <button
                onClick={() => handleRedirect(item.path)}
                className={`item-card  ${item.bg}`}
                key={i}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
