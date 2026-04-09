import React from "react";
import { useNavigate } from "react-router-dom";

export default function Setting() {
  const navigate = useNavigate();

const handleRedirect = (path) => {
  navigate(path);
};
const items = [
  {
    label: "STATEMENT",
    path: "/getAllstatment",
  },
  // {
  //   label: "ACCOUNT OPERATIONS",
  //   path: "/getAllAccountOperation",
  // },
  {
    label: "PROFIT & LOSS",
    path: "/my-profit-loss",
  },
];

  return (
    <div className="items-wrapper">
  <div className="items-grid">
    {items.map((item, i) => (
      <button
      onClick={() => handleRedirect(item.path)}
      className="item-card"
      key={i}
      >
        {item.label}
      </button>
    ))}
  </div>
</div>

  );
}
