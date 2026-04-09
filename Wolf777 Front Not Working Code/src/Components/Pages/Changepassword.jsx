import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  // const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


    const baseUrl = process.env.REACT_APP_BACKEND_API;

  
  const userId = localStorage.getItem("user_id");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword === passwordData.oldPassword) {
      toast.error("New password must be different from old password");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending request to:", `${baseUrl}/update-Password`);
      console.log("Data:", {
        user_id: userId,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      const res = await axios.post(`${baseUrl}/update-Password`, {
        user_id: userId,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      console.log("Response from server:", res.data);

      if (res.data?.success) {
        toast.success("Password updated successfully!");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorMessage = res.data?.message || "Failed to update password";
        toast.error(errorMessage);

        if (errorMessage.toLowerCase().includes("old password")) {
          setPasswordData((prev) => ({
            ...prev,
            oldPassword: "",
          }));
        }
      }
    } catch (err) {
      console.error("Error updating password:", err);

      let errorMessage = "Error updating password";
      if (err.response) {
        console.log("Error response data:", err.response.data);
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your connection.";
        console.log("Error request:", err.request);
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toast Container - यह सभी notifications show करेगा */}
      <ToastContainer
        position="top-right"
        autoClose={100}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
              <button
      className="backtomenu"
      onClick={() => navigate("/indexpage")}
    >
      Back To Main Menu
    </button>
      <div className="changepassword">
        
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6">
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <h4 className="mb-0">Change Password</h4>
                </div>

                <div className="card-body">
                  <form onSubmit={handlePasswordSubmit}>
                    {/* Current Password */}
                    <div className="mb-3">
                      <label className="form-label">
                        Current Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter current password"
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    {/* New Password */}
                    <div className="mb-3">
                      <label className="form-label">
                        New Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter new password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">
                      <label className="form-label">
                        Confirm New Password{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm new password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Show Password */}
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      />
                      <label className="form-check-label" htmlFor="showPassword">
                        Show Passwords
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      className="btn btn-primary w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;