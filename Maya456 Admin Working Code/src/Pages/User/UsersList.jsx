import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { OverlayTrigger, Tooltip, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";

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
  const usertype = localStorage.getItem("usertype");
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
  const handleActionUserGameRate = (user_id) => {
    navigate(`/update_rates_userWaise/${user_id}`);
  };
  const [showModalForDevice, setShowModalForDevice] = useState(null);

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
        `${process.env.REACT_APP_API_URL}/user-list?page=${currentPage}&limit=${limit}&username=${FilterUsername}&mobile=${FilterMobile}&min=${minForFetch}&max=${FilterMax}&status=${selectedValueStatus}&topwinnertoplosser=${selectedValueWinnerLosser}&color=${selectedValuecolor}&startDate=${startDateForFetch}&endDate=${endtDateForFetch}&device_id=${FilterDeviceId}`,
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

  // const fillterdata = () => {
  //   setFillter((prev) => !prev);
  // };

  const fillterdata = () => {
    setFillter((prev) => !prev);
    fetchUsers(); // Filter apply kar do immediately
  };

  const [showdeposit, setShowdeposit] = useState(false);
  const [withdraw_manage, setwithdraw_manage] = useState("no");
  const [withdraw_per_day, setSwithdraw_per_day] = useState("");
  const [withdraw_max, setwithdraw_max] = useState("");
  const [withdraw_min, setwithdraw_min] = useState("");
  const [userId, setuserId] = useState("");
  const handleCloseDeposit = () => setShowdeposit(false);

  const handleActionWithdraw = (
    userId,
    withdraw_manage,
    withdraw_per_day,
    withdraw_max,
    withdraw_min
  ) => {
    setwithdraw_manage(withdraw_manage);
    setSwithdraw_per_day(withdraw_per_day);
    setwithdraw_max(withdraw_max);
    setwithdraw_min(withdraw_min);
    setuserId(userId);
    // setSelectedUser(userId);
    setShowdeposit(true); // Open popup
  };
  const toggleValue = () => {
    setwithdraw_manage((prev) => (prev === "yes" ? "no" : "yes"));
  };
  const handleSubmitWithdraw = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/user-withdrawLimit-update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            withdraw_manage: withdraw_manage,
            withdraw_per_day: withdraw_per_day,
            withdraw_max: withdraw_max,
            withdraw_min: withdraw_min,
          }),
        }
      );

      const result = await res.json();
      if (res.ok && result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Withdraw Updated",
          text: `Successfully`,
        });
        fetchUsers();
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
  return (
    <div className="userlist mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">All Users List</h3>
            <div className="buttonlist">
              {/* <Link
                to="/user/create-user"
                className="btn button_add d-flex justify-content-center align-items-center"
              >
                <FaPlus />
                Add List
              </Link> */}
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>

            </div>
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
                      <th>Color</th>
                      <th>User Name</th>
                      <th>Mobile No</th>
                      {/* <th>Password</th> */}
                      <th>Balance</th>
                      <th>Win Amount</th>
                      <th>Loss Amount</th>
                      <th>Device ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>InActive Reason</th>
                      <th>Total Deposit</th>
                      <th>Total Deposit Count</th>
                      <th>Total Withdraw</th>
                      <th>Total Withdraw Count</th>
                      <th>Action</th>
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
                              
                            </div>{" "}
                          </td>



                           <td>
                            <div className="d-flex align-items-center">
                              {" "}
                              
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
                          {/* <td>
                            {usertype == "tech_admin"
                              ? user.mobile
                              : `${user.mobile.slice(0, 2)}${"*".repeat(
                                user.mobile.length - 5
                              )}`}
                          </td> */}

                          {/* <td>
                            {usertype === "tech_admin"
                              ? (user.mobile ? user.mobile : "**********")
                              : (user.mobile
                                ? `${user.mobile.slice(0, 2)}${"*".repeat(user.mobile.length - 5)}`
                                : "**********")}
                          </td> */}
                          <td>{user.mobile}</td>

                          {/* <td>{user.mpin ? user.mpin : "NA"}</td> */}

                          <td>Rs {user.credit}</td>
                          <td>Rs {user.win_amount}</td>
                          <td>Rs {user.loss_amount}</td>
                          {/* <td> {user.device_id}</td> */}
                          <td>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() =>
                                setShowModalForDevice(user.device_id)
                              }
                              className="p-0 ms-1 align-middle"
                            >
                              <FaInfoCircle className="text-info" />
                            </Button>

                            {/* Modal for this specific device */}
                            <Modal
                              show={showModalForDevice === user.device_id}
                              onHide={() => setShowModalForDevice(null)}
                              centered
                            >
                              <Modal.Header closeButton>
                                <Modal.Title>Device Details</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <p style={{ wordBreak: "break-all" }}>
                                  {user.device_id}
                                </p>

                                {/* Add more device info as needed */}
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant="secondary"
                                  onClick={() => setShowModalForDevice(null)}
                                >
                                  Close
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </td>
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
                          <td>{user.inactive_reason}</td>
                          <td>{user.total_deposit}</td>
                          <td>{user.total_count_deposit}</td>
                          <td>{user.total_withdraw}</td>
                          <td>{user.total_count_withdraw}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
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
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id="tooltip-add">Ledger</Tooltip>
                                }
                              >
                                <button
                                  className="actionbutton edit"
                                  onClick={() =>
                                    handleActionLedger(user.user_id)
                                  }
                                  data-tooltip=""
                                >
                                  <FaEye />
                                </button>
                              </OverlayTrigger>
                              <button
                                className="btn btn-info"
                                onClick={() =>
                                  handleActionBetHistory(user.user_id)
                                }
                              >
                                Bet History
                              </button>
                              <button
                                className="btn btn-info"
                                onClick={() =>
                                  handleActionLoginHistory(user.user_id)
                                }
                              >
                                Login History
                              </button>
                              <button
                                className="btn btn-info"
                                onClick={() =>
                                  handleActionWithdraw(
                                    user.user_id,
                                    user.withdraw_manage,
                                    user.withdraw_per_day,
                                    user.withdraw_max,
                                    user.withdraw_min
                                  )
                                }
                              >
                                Withdraw Limit
                              </button>
                              <button
                                className="btn btn-info"
                                onClick={() =>
                                  handleActionUserGameRate(user.user_id)
                                }
                              >
                                Game Rate
                              </button>
                            </div>
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
              <Modal show={showdeposit} onHide={handleCloseDeposit} centered>
                <Modal.Header>
                  <Modal.Title>Withdraw Limit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* <span>Status:</span>
                  <Button
                    variant={withdraw_manage === "yes" ? "success" : "danger"}
                    onClick={toggleValue}
                  >
                    {withdraw_manage}
                  </Button> */}
                  <span>Enable Disable:</span>
                  <Form>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      // label={withdraw_manage === "yes" ? "Yes" : "No"}
                      checked={withdraw_manage === "yes"}
                      onChange={(e) =>
                        setwithdraw_manage(e.target.checked ? "yes" : "no")
                      }
                    />
                    <span>Per Day Limit:</span>
                    <Form.Control
                      type="number"
                      id="custom-switch"
                      value={withdraw_per_day}
                      onChange={(e) => setSwithdraw_per_day(e.target.value)}
                    />
                    <span>Min Limit:</span>
                    <Form.Control
                      type="number"
                      id="custom-switch"
                      value={withdraw_min}
                      onChange={(e) => setwithdraw_min(e.target.value)}
                    />
                    <span>Max Limit:</span>
                    <Form.Control
                      type="number"
                      id="custom-switch"
                      value={withdraw_max}
                      onChange={(e) => setwithdraw_max(e.target.value)}
                    />
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseDeposit}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleSubmitWithdraw}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersList;
