import React, { useState } from "react";

const AccountDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSave = () => {
    if (!oldPass || !newPass || !confirmPass) {
      alert("Please fill all fields");
      return;
    }
    if (newPass !== confirmPass) {
      alert("New passwords do not match");
      return;
    }

    // API call here
    console.log("Password Updated:", { oldPass, newPass });

    // Show success message
    alert("Password updated successfully!");
    
    setShowModal(false);
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleCancel = () => {
    setShowModal(false);
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  };

  return (
    <div className="main_section REportsPage">
      <div className="card">
        <header className="card-header">
          <i className="fas fa-user-circle"></i>
          Account Details
        </header>

        <div className="card-body">
          <dl className="acc-info">
            <div className="info-item">
              <dt>Name</dt>
              <dd>Ashok Sharma</dd>
            </div>

            <div className="info-item">
              <dt>Commission</dt>
              <dd>0</dd>
            </div>

            <div className="info-item">
              <dt>Rolling Commission</dt>
              <dd>
                <i className="fas fa-eye fa-lg eye-icon"></i>
              </dd>
            </div>

            <div className="info-item">
              <dt>Agent Rolling Commission</dt>
              <dd>
                <i className="fas fa-eye fa-lg eye-icon"></i>
              </dd>
            </div>

            <div className="info-item">
              <dt>Currency</dt>
              <dd>IRP</dd>
            </div>

            <div className="info-item">
              <dt>Partnership</dt>
              <dd>100</dd>
            </div>

            <div className="info-item">
              <dt>Mobile Number</dt>
              <dd>000000</dd>
            </div>

            <div className="info-item">
              <dt>Password</dt>
              <dd className="password-edit">
                *********
                <span
                  className="edit-btn"
                  onClick={() => setShowModal(true)}
                >
                  Edit <i className="fas fa-pencil-alt"></i>
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Password Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>
              <i className="fas fa-lock"></i> Edit Password
            </h3>

            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Enter your current password"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Enter your new password"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm your new password"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;