import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

import { FaPlus, FaMinus } from "react-icons/fa";
function UsersList() {
  const [users, setUsers] = useState([]); // full users list from API
  const [filteredUsers, setFilteredUsers] = useState([]); // users after search filter
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [ModalCredit, setModalCredit] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("token");
  const usertype = localStorage.getItem("usertype");

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/user-active-list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
      if (result.success === "1") {
        setUsers(result.data);
        setFilteredUsers(result.data);
        setCurrentPage(1); // reset to first page after fetching
      } else {
        Swal.fire("Error", result.message || "Failed to fetch users", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Handle user status toggle (active/inactive)
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/user-inactive-active-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId, status: newStatus }),
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `User status updated to ${newStatus}`,
        });

        fetchUsers();
      } else {
        throw new Error(result.message || "Failed to update status");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
      });
    }
  };

  const handleColorChange = async (userId, selectedColor) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/user-color-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId, color: selectedColor }),
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Color Updated",
          text: `Color set to ${selectedColor}`,
        });

        // Optional: refresh users
        fetchUsers();

        // Or update local state instead of re-fetch
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === userId ? { ...user, color: selectedColor } : user
          )
        );
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === userId ? { ...user, color: selectedColor } : user
          )
        );
      } else {
        throw new Error(result.message || "Failed to update color");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
      });
    }
  };

  // Search handler
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter((user) => {
      const userName = user.username?.toLowerCase() || "";
      const mobile = user.mobile?.toString() || "";
      const color = user.color?.toString() || "";
      return (
        userName.includes(value) ||
        mobile.includes(value) ||
        color.includes(value)
      );
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // reset to first page after search
  };

  // Pagination indexes for filteredUsers
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Modal open/close handlers
  const openModal = (userId, action, currentBalance) => {
    setModalCredit(currentBalance);
    setModalUserId(userId);
    setModalAction(action);
    setAmount("");
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalUserId(null);
    setModalAction(null);
    setAmount("");
  };

  // Submit amount add/withdraw
  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "Please enter a valid positive number.",
      });
      return;
    }
    if (modalAction === "withdraw" && Number(amount) > ModalCredit) {
      Swal.fire({
        icon: "error",
        title: "Invalid Amount",
        text: "Withdraw amount cannot be more than current balance.",
      });
      return;
    }

    const payload = {
      amount: Number(amount),
      user_id: modalUserId,
    };
    let url = "";
    if (modalAction === "add") {
      url = `${process.env.REACT_APP_API_URL}/user-add-amount`;
    } else if (modalAction === "withdraw") {
      url = `${process.env.REACT_APP_API_URL}/user-withdraw-amount`;
    } else {
      Swal.fire({
        icon: "error",
        title: "Action Error",
        text: "Unknown action type.",
      });
      return;
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text:
            modalAction === "add"
              ? "Amount added successfully."
              : "Amount withdrawn successfully.",
        });
        fetchUsers();
        closeModal();
        setFilteredUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === modalUserId
              ? {
                  ...user,
                  credit:
                    modalAction === "add"
                      ? user.credit + Number(amount)
                      : user.credit - Number(amount),
                }
              : user
          )
        );
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === modalUserId
              ? {
                  ...user,
                  credit:
                    modalAction === "add"
                      ? user.credit + Number(amount)
                      : user.credit - Number(amount),
                }
              : user
          )
        );
      } else {
        throw new Error(result.message || "Failed to process request");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="userlist mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Actve Users List</h3>
            {/* <Link
                to="/user/create-user"
                className="btn button_add d-flex justify-content-center align-items-center"
              >
                <FaPlus />
                Add List
              </Link> */}

            <div className="form-design-fillter d-flex justify-content-end search_bar ml-auto">
              <input
                type="text"
                name="user_name"
                className="form-control"
                placeholder="Search by Name || Mobile || Color"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <p>Loading Active Users ...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>User Name</th>
                      <th>Mobile No</th>
                      <th>Password</th>
                      <th>Balance</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((user, index) => (
                        <tr key={user._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {" "}
                              {indexOfFirstUser + index + 1}{" "}
                              <span
                                className="indicator"
                                style={{
                                  background: user.color || "transparent",
                                }}
                              ></span>
                            </div>{" "}
                          </td>
                          <td>
                            {user.username.charAt(0).toUpperCase() +
                              user.username.slice(1).toLowerCase()}
                          </td>
                          <td>
                            {usertype == "tech_admin"
                              ? user.mobile
                              : `${user.mobile.slice(0, 2)}${"*".repeat(
                                  user.mobile.length - 5
                                )}`}
                          </td>
                          <td>{user.mpin}</td>
                          <td>Rs {user.credit}</td>
                          <td>
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`userSwitch-${user.user_id}`}
                                checked={user.status === "active"}
                                onChange={() =>
                                  handleToggleStatus(user.user_id, user.status)
                                }
                                style={{ cursor: "pointer" }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`userSwitch-${user.user_id}`}
                                style={{
                                  marginLeft: "10px",
                                  fontWeight: "bold",
                                  color:
                                    user.status === "active" ? "green" : "red",
                                }}
                              >
                                {user.status === "active" ? "ON" : "OFF"}
                              </label>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {/* Color Dropdown */}
                              {/* <div className="selectcolor">
                                <select
                                  className=""
                                  value={user.color || ""}
                                  onChange={(e) =>
                                    handleColorChange(
                                      user.user_id,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select Color</option>
                                  <option value="red">Red</option>
                                  <option value="green">Green</option>
                                  <option value="blue">Blue</option>
                                </select>
                              </div> */}
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="tooltip-add">Add Amount</Tooltip>
                                }
                              >
                                <button
                                  className="actionbutton add"
                                  onClick={() =>
                                    openModal(user.user_id, "add", user.credit)
                                  }
                                >
                                  <FaPlus />
                                </button>
                              </OverlayTrigger>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="tooltip-add">
                                    Withdraw Amount
                                  </Tooltip>
                                }
                              >
                                <button
                                  className="actionbutton edit"
                                  onClick={() =>
                                    openModal(
                                      user.user_id,
                                      "withdraw",
                                      user.credit
                                    )
                                  }
                                  data-tooltip="  pending Amount"
                                >
                                  <FaMinus />
                                </button>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex paginationgridnew justify-content-between align-items-center mt-3">
                <button
                  className="paginationbutton"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="alllistnumber">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="paginationbutton"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>

              {modalOpen && (
                <div
                  className="modal fade show"
                  style={{
                    display: "block",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                  tabIndex="-1"
                  role="dialog"
                  onClick={closeModal}
                >
                  <div
                    className="modal-dialog"
                    role="document"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">
                          {modalAction === "add"
                            ? "Add Amount"
                            : "Withdraw Amount"}
                          <br />
                          <span style={{ fontSize: "15px", display: "block" }}>
                            <span style={{ color: "green" }}>
                              Current Balance: Rs{" "}
                              {ModalCredit.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                            <br />
                            {amount &&
                              (modalAction === "add" ? (
                                <span style={{ color: "green" }}>
                                  New Balance after adding: Rs{" "}
                                  {(
                                    ModalCredit + Number(amount)
                                  ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              ) : (
                                <span style={{ color: "red" }}>
                                  Remain Balance: Rs{" "}
                                  {(
                                    ModalCredit - Number(amount)
                                  ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              ))}
                          </span>
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          aria-label="Close"
                          onClick={closeModal}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <label htmlFor="amountInput" className="form-label">
                          Enter Amount
                        </label>
                        <input
                          type="text"
                          id="amountInput"
                          className="form-control"
                          value={amount}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[1-9]\d*$/.test(value) || value === "") {
                              if (
                                modalAction === "withdraw" &&
                                Number(value) > ModalCredit
                              ) {
                                return;
                              }
                              setAmount(value);
                            }
                          }}
                          placeholder="Enter amount"
                        />
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersList;
