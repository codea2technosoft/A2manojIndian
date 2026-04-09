import React from "react";
import { Link, useNavigate } from "react-router-dom";
import whatsapp from "../../assets/images/whatsapp.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AccountPage() {
  const navigate = useNavigate();

  // Logout function
const logout = () => {
  // Save bankDetails temporarily
  const bankDetails = localStorage.getItem("bankDetails");

  // Clear all localStorage
  localStorage.clear();

  // Restore bankDetails
  if (bankDetails) {
    localStorage.setItem("bankDetails", bankDetails);
  }

  toast.success("Logged out successfully!");

  setTimeout(() => {
    navigate("/");
            window.location.reload();

  }, 1500); // 500ms delay
};


  return (
    <>
      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="account-page">
        <h2 className="account-title">My Account</h2>

        <ul className="account-menu">
          <li>
            <Link to="/My-profile">My-profile</Link>
          </li>
          <li>
            <Link to="/bethistory">Bet History</Link>
          </li>
          <li>
            <Link to="/Chat">Chat</Link>
          </li>
          <li>
            <Link to="/BroadCast">Notification</Link>
          </li>
          <li>
            <Link to="/Setbuttonvalue">Setting</Link>
          </li>
          <li>
            <Link to="/unsettledbet">Unsettled Bet</Link>
          </li>
          <li>
            <Link to="/acountStatement">Account Statement</Link>
          </li>
          {/* <li>
            <Link to="/Setbuttonvalue">Set Button Value</Link>
          </li> */}
          <li>
            <Link to="/rules">Rules</Link>
          </li>
          <li>
            <Link to="/" className="d-flex align-items-center">
              Customer Support{" "}
              <div className="image_whatsapp ms-2">
                <img src={whatsapp} alt="whatsapp" />
              </div>
            </Link>
          </li>

          <li className="logoutbutton" onClick={logout}>
            Logout
          </li>
        </ul>
      </div>
    </>
  );
}

export default AccountPage;
