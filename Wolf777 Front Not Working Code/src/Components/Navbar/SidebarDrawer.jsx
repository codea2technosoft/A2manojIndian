import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png'
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaKey,
  FaInfoCircle,
  FaMoneyBill,
  FaDice,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.scss";

const SidebarDrawer = ({ open, onClose, logout }) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <div className={`sidebar-drawer ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="navbar-logo">
            <Link to="/indexpage">
              <img src={logo} alt="logo" />
            </Link>
          </div>

          <button onClick={onClose}>×</button>
        </div>
        <ul className="sidebar-menu">
          <li><Link to="/main/matches" onClick={onClose}><FaHome /> IN PLAY</Link></li>
          <li><Link to="/My-profile" onClick={onClose}><FaUser /> PROFILE</Link></li>
          <li><Link to="/statementaccount" onClick={onClose}><FaFileAlt /> STATEMENT</Link></li>
          <li><Link to="/AllBetHistory" onClick={onClose}><FaFileAlt /> All  BET HISTORY </Link></li>
                    {/* <li><Link to="/ledger" onClick={onClose}><FaMoneyBill /> MY LEDGER</Link></li> */}

          {/* <li><Link to="/changepassword" onClick={onClose}><FaKey /> PASSWORD</Link></li> */}
          <li><Link to="/rules" onClick={onClose}><FaInfoCircle /> RULES</Link></li>
          <li><Link to="/setbuttonvalue" onClick={onClose}><FaInfoCircle /> Custom Stak Buttons</Link></li>
          {/* <li><Link to="/" onClick={onClose}><FaDice /> CASINO</Link></li> */}

          <li className="logout" onClick={logout}>
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      </div>
    </>
  );
};

export default SidebarDrawer;
