import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";

function Withdrawpaeg() {
  const location = useLocation();
  const current = location.pathname;

  return (
    <div className="container-fluid">
      <div className="card custom-card">
        <div className="card-header text-start">
          <div className="card-title mb-0">Withdraw</div>
        </div>

        <div className="card-body">
          <div className="d-flex gap-3">
   

            {/* Deposit Button */}
            <Link
              to="/depositPage"
              className={`custom-btn deposit-btn ${
                current === "/deposit" ? "active" : ""
              }`}
            >
              <FiArrowUpRight size={18} />
              Deposit
            </Link>

                     {/* Withdraw Button */}
            <Link
              to="/withdraw-page"
              className={`custom-btn withdraw-btn ${
                current === "/withdraw" ? "active" : ""
              }`}
            >
              <FiArrowDownLeft size={18} />
              Withdraw
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Withdrawpaeg;
