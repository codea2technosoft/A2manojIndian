import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";

import { FaPlus, FaMinus, FaEye } from "react-icons/fa";
function UsersList() {
  const [users, setUsers] = useState([]); // full users list from API
  const [filteredUsers, setFilteredUsers] = useState([]); // users after search filter
  const [loading, setLoading] = useState(true);

  const usersPerPage = 20;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [ModalCredit, setModalCredit] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch users from API

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

  const handleActionLedger = (user_id) => {
    navigate(`/Ledger/${user_id}`);
  };
  const handleActionBetHistory = (user_id) => {
    navigate(`/bet_history_userwaise/${user_id}`);
  };
  const handleActionLoginHistory = (user_id) => {
    navigate(`/login_history/${user_id}`);
  };

  const [FilterUsername, setFilterUsername] = useState("");
  const [FilterMobile, setFilterMobile] = useState("");
  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
  const [selectedValueStatus, setSelectedValueStatus] = useState("");
  const [selectedValueWinnerLosser, setSelectedValueWinnerLosser] =
    useState("");
  const [selectedValuecolor, setSelectedValuecolor] = useState("");
  const [selectedStartDate, setselectedStartDate] = useState("");
  const [selectedEndDate, setselectedEndDate] = useState("");
  const [FilterDeviceId, setFilterDeviceId] = useState("");
  // Search handler

  const handleSearchChangeusername = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUsername(value);
  };
  const handleSearchChangeMobile = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMobile(value);
  };
  const handleSearchChangeDeviceId = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterDeviceId(value);
  };
  const handleSearchChangeMin = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMin(value);
  };
  const handleSearchChangeMax = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMax(value);
  };
  const handleChangeStatus = (e) => {
    const value = e.target.value;
    setSelectedValueStatus(value);
  };
  const handleChangeWinnerLosser = (e) => {
    const value = e.target.value;
    setSelectedValueWinnerLosser(value);
  };
  const handleChangecolor = (e) => {
    const value = e.target.value;
    setSelectedValuecolor(value);
  };
  const setSelectedStartDate = (e) => {
    const value = e;
    setselectedStartDate(value);
  };
  const setSelectedEndDate = (e) => {
    const value = e;
    setselectedEndDate(value);
  };
  const handleFilter = (e) => {
    fetchUsers();
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(10);
  const [limit, setLimitPages] = useState(10);
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);
  const { userid } = useParams();
  const fetchUsers = async () => {
    setLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const todayuser = urlParams.get("todayuser");
    const yestardayuser = urlParams.get("yestardayuser");
    const zerobalance = urlParams.get("zerobalance");
    // console.warn(selectedStartDate);
    let startDateForFetch = selectedStartDate;
    let endtDateForFetch = selectedEndDate;
    let minForFetch = FilterMin;
    if (!selectedStartDate) {
      if (todayuser != null) {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];
        startDateForFetch = today.toISOString().split("T")[0];
      }
      if (yestardayuser != null) {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        startDateForFetch = today.toISOString().split("T")[0];
        endtDateForFetch = today.toISOString().split("T")[0];
      }
    }
    if (!FilterMin) {
      if (zerobalance != null) {
        minForFetch = 0;
      }
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/login-history-list?page=${currentPage}&limit=${limit}&user_id=${userid}`,
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
        // alert(result.pagination.totalPages);
        setUsers(result.data);
        setFilteredUsers(result.data);
        setCurrentPage(result.pagination.page); // reset to first page after fetching
        settotalPages(result.pagination.totalPages); // reset to first page after fetching
        setLimitPages(result.pagination.limit); // reset to first page after fetching
      } else {
        setUsers([]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div className="userlist mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Login History</h3>
            <button
              className="btn btn-primary ms-auto d-flex"
              onClick={handleBack}
            >
              Back
            </button>
            {/* <div className="buttonlist">
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
            </div> */}
          </div>
        </div>

        {fillter && (
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="form-design-fillter many_field gap-2 d-flex align-items-end flex-wrap">
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">User Name</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="User Name"
                      value={FilterUsername}
                      onChange={handleSearchChangeusername}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">User Mobile</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Mobile"
                      value={FilterMobile}
                      onChange={handleSearchChangeMobile}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Device ID</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Mobile"
                      value={FilterDeviceId}
                      onChange={handleSearchChangeDeviceId}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Min Amount</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Min Amount"
                      value={FilterMin}
                      onChange={handleSearchChangeMin}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Max Amount</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Max Amount"
                      value={FilterMax}
                      onChange={handleSearchChangeMax}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Select</label>
                    </div>
                    <select
                      className="form-select"
                      onChange={handleChangeStatus}
                      value={selectedValueStatus}
                    >
                      <option value="">Select</option>
                      <option value="active">Active</option>
                      <option value="inactive">InActive</option>
                    </select>
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Result</label>
                    </div>
                    <select
                      className="form-select"
                      onChange={handleChangeWinnerLosser}
                      value={selectedValueWinnerLosser}
                    >
                      <option value="">Select</option>
                      <option value="top_winner">Top Winner</option>
                      <option value="top_losser">Top Losser</option>
                    </select>
                  </div>

                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Color</label>
                    </div>
                    <select
                      className="form-select"
                      onChange={handleChangecolor}
                      value={selectedValuecolor}
                    >
                      <option value="">Select Color</option>
                      <option value="red">Red</option>
                      <option value="orange">Orange</option>
                      <option value="violet">Violet</option>
                      <option value="yellow">Yellow</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                    </select>{" "}
                  </div>

                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Start Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedStartDate}
                      onChange={(e) => setSelectedStartDate(e.target.value)}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">End Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedEndDate}
                      onChange={(e) => setSelectedEndDate(e.target.value)}
                    />
                  </div>
                  <div className="form_latest_design">
                    <button
                      className="btn btn-info text-white"
                      onClick={handleFilter} // Or any function you want to trigger
                    >
                      Filter
                    </button>
                  </div>
                  {/* <di className="form_latest_design"v>
                  <button className="btn btn-secondary">helo</button>
                </di> */}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card-body">
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr.</th>
                      <th>Device ID</th>
                      <th>Device Info</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr key={user._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {" "}
                              {index + 1}{" "}
                              <span
                                className="indicator"
                                style={{
                                  background: user.color || "transparent",
                                }}
                              ></span>
                            </div>{" "}
                          </td>

                          <td> {user.device_id}</td>
                          <td> {user.device_info}</td>
                          <td>
                            {(() => {
                              const date = new Date(user.created_at);
                              const day = String(date.getDate()).padStart(
                                2,
                                "0"
                              );
                              const month = String(
                                date.getMonth() + 1
                              ).padStart(2, "0"); // months are 0-indexed
                              const year = date.getFullYear();
                              return `${day}-${month}-${year}`;
                            })()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
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
