import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useLocation } from 'react-router-dom';

import {
  FaInfoCircle,
  FaLock,
  FaUnlock,
  FaStickyNote,
  FaTrashAlt,
  FaEdit,
  FaWallet,
  FaGamepad,
} from "react-icons/fa";
import {
  getAllUsersList,
  deleteUser,
  clearuserexposure,
  updateUserStatus,
  depositToUser,
  withdrawFromUser,
  blockUser,
  CreateUserAdmin,
  BetBlockUnblock,
  changeMasterPasswordAgent,
  getUserExposure
} from "../../Server/api";
import { FaPlus, FaMinus, FaEye } from "react-icons/fa";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [depositType, setDepositType] = useState("admin");
  const [tableLoading, setTableLoading] = useState(false);
  const navigate = useNavigate();

  const [Adduser, setAdduser] = useState(false);
  const AdduserOpenModalall = () => setAdduser(true);
  const AdduserCloseModalall = () => setAdduser(false);
const handleOpenModalall = (user) => {
  setSelectedUser(user);
  setShowModal(true);
};

const handleCloseModalall = () => {
  setShowModal(false);
  setSelectedUser(null);
};
  const [changestatus, setChangestatus] = useState(false);
  const [status, setStatus] = useState("active");

  // Password change states
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null);

  // ===== EXPOSURE POPUP STATES =====
  const [showExposurePopup, setShowExposurePopup] = useState(false);
  const [exposureData, setExposureData] = useState([]);
  const [exposureLoading, setExposureLoading] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState('');
  // ==================================

  const [userFormData, setUserFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    exposureLimit: ""
  });
  const [userErrors, setUserErrors] = useState({});
  const [userLoading, setUserLoading] = useState(false);
  const admin_id = localStorage.getItem("admin_id");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const agentId = searchParams.get('agent_id');

  // Validate User Form
  const validateUserForm = () => {
    const errors = {};

    if (!userFormData.email || userFormData.email.trim() === "") {
      errors.email = "Please enter email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userFormData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!userFormData.username || userFormData.username.trim() === "") {
      errors.username = "Please enter username";
    } else if (userFormData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!userFormData.firstName || userFormData.firstName.trim() === "") {
      errors.firstName = "Please enter first name";
    }

    if (!userFormData.lastName || userFormData.lastName.trim() === "") {
      errors.lastName = "Please enter last name";
    }

    if (!userFormData.password) {
      errors.password = "Please enter password";
    } else if (userFormData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!userFormData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (userFormData.password !== userFormData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!userFormData.phoneNumber || userFormData.phoneNumber.trim() === "") {
      errors.phoneNumber = "Please enter phone number";
    } else if (!/^[0-9]{10}$/.test(userFormData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (!userFormData.exposureLimit || userFormData.exposureLimit.trim() === "") {
      errors.exposureLimit = "Please enter exposure limit";
    } else if (Number(userFormData.exposureLimit) <= 0) {
      errors.exposureLimit = "Exposure limit must be greater than 0";
    }

    setUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!validateUserForm()) {
      return;
    }

    try {
      setUserLoading(true);
      const payload = {
        super_admin_id: admin_id || "admin",
        agent_id: agentId || "AG6293",
        name: userFormData.username.trim(),
        password: userFormData.password,
        email: userFormData.email.trim(),
        phoneNumber: userFormData.phoneNumber.trim()
      };
      const response = await CreateUserAdmin(payload);
      if (response.data && response.data.success) {
        Swal.fire("Success!", "User created successfully!", "success");
        setAdduser(false);
        setUserFormData({
          email: "",
          username: "",
          firstName: "",
          lastName: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
          exposureLimit: ""
        });
        setUserErrors({});
        fetchUsers();
      } else {
        Swal.fire("Error", response.data?.message || "Failed to create user", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setUserLoading(false);
    }
  };

  // Handle Bet Block/Unblock for Users
  const handleBetBlockToggle = async (user, index) => {
    const currentBlockStatus = user.bet_block || 0;
    const newBlockStatus = currentBlockStatus === 0 ? 1 : 0;

    const confirm = await Swal.fire({
      title: newBlockStatus === 1 ? "Block Bet?" : "Unblock Bet?",
      text: newBlockStatus === 1
        ? "Do you really want to block betting for this user?"
        : "Do you really want to unblock betting for this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: newBlockStatus === 1 ? "Yes, Block" : "Yes, Unblock",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const payload = {
        admin_id: user.admin_id || user._id,
        bet_block: newBlockStatus
      };
      const response = await BetBlockUnblock(payload);
      if (response.data && response.data.success) {
        Swal.fire(
          newBlockStatus === 1 ? "Blocked!" : "Unblocked!",
          response.data.message || `Bet ${newBlockStatus === 1 ? 'blocked' : 'unblocked'} successfully!`,
          "success"
        );
        const updatedList = [...users];
        updatedList[index] = { ...updatedList[index], bet_block: newBlockStatus };
        setUsers(updatedList);
        fetchUsers();
      } else {
        Swal.fire("Error", response.data?.message || "Failed to update bet block status", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      Swal.fire("Error", "Please enter new password", "error");
      return;
    }
    if (newPassword.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return;
    }

    try {
      setPasswordLoading(true);
      const payload = {
        admin_id: selectedUserForPassword?.admin_id || selectedUserForPassword?._id || admin_id,
        newPassword: newPassword
      };
      const response = await changeMasterPasswordAgent(payload);
      if (response.data && response.data.success) {
        Swal.fire("Success!", "Password changed successfully!", "success");
        setChangestatus(false);
        setNewPassword("");
        setSelectedUserForPassword(null);
      } else {
        Swal.fire("Error", response.data?.message || "Failed to change password", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Open Change Status Modal with user data
  const openChangeStatusModal = (user) => {
    setSelectedUserForPassword(user);
    setNewPassword("");
    setStatus("active");
    setChangestatus(true);
  };

  const Changestatusopen = () => {
    setChangestatus(true);
  };

  const Changestatusclose = () => {
    setChangestatus(false);
    setNewPassword("");
    setSelectedUserForPassword(null);
  };

  // Filters state
  const [filters, setFilters] = useState({
    active: "",
    userId: "",
    mobile: "",
    fromDate: "",
    toDate: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = async (
    page = pagination.page,
    limit = pagination.limit,
  ) => {
    setTableLoading(true);
    try {
      const params = {
        page,
        limit,
        active: filters.active,
        userId: filters.userId,
        mobile: filters.mobile,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        agent_id: agentId || ""
      };
      const response = await getAllUsersList(params);
      if (response.data && response.data.success) {
        setUsers(response.data.data);
        setPagination((prev) => ({
          ...prev,
          page: response.data.pagination.page,
          total: response.data.pagination.totalRecords,
          totalPages: response.data.pagination.totalPages,
          limit: response.data.pagination.limit,
        }));

        if (response.data.summary) {
          setSummary({
            total_balance: response.data.summary.total_balance || 0,
            total_exposure: response.data.summary.total_exposure || 0,
            total_available_balance: response.data.summary.total_available_balance || 0,
            available_balance: response.data.summary.available_balance || 0,
            total_player_balance: response.data.summary.total_player_balance || 0
          });
        }

      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        Swal.fire("Error", "Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Grand Totals State
  const [grandTotals, setGrandTotals] = useState({
    total_credit_ref: 0,
    total_withdraw_limit: 0,
    total_balance: 0,
    total_player_exposure: 0,
    total_available_balance: 0,
    total_player_balance: 0,
    total_reference_pl: 0,
    total_current_pl: 0
  });


  const handleDeleteUser = async (userId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "User exposure will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        const result = await deleteUser(userId);
        if (result.data.success) {
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers(pagination.page);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to delete user",
          "error",
        );
      }
    }
  };

  const handleDeleteExposure = async (userId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        const result = await clearuserexposure(userId);
        if (result.data.success) {
          Swal.fire("Deleted!", "User exposure cleared.", "success");
          fetchUsers(pagination.page);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to delete exposure",
          "error"
        );
      }
    }
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
    setFilter(false);
  };

  const resetFilters = () => {
    setFilters({
      active: "",
      search: "",
      userId: "",
      mobile: "",
      name: "",
      fromDate: "",
      toDate: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchUsers(newPage, pagination.limit);
  };

  const handleOpenModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setAmount("");
    setRemarks("");
    setDepositType("admin");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await handleTransaction();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!amount || amount <= 0) {
      Swal.fire("Error", "Please enter a valid amount", "error");
      return;
    }
    try {
      let response;
      if (modalType === "add") {
        response = await depositToUser(
          selectedUser._id,
          Number(amount),
          remarks,
          depositType,
        );
      } else {
        response = await withdrawFromUser(
          selectedUser._id,
          Number(amount),
          remarks,
          depositType,
        );
      }

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          html: `
        <p>${response.data.message}</p>
        <div class="mt-3">
          <p><strong>User:</strong> ${selectedUser?.username || selectedUser?.mobile}</p>
          <p><strong>Previous Balance:</strong> ₹ ${response.data.data.previousBalance || selectedUser?.credit || 0}</p>
          <p><strong>${modalType === "add" ? "Added" : "Withdrawn"}:</strong> ₹ ${amount}</p>
        </div>
        `,
          icon: "success",
        });
        fetchUsers(pagination.page);
        handleCloseModal();
      } else {
        Swal.fire("Error", response.data.message || "Transaction failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    const confirm = await Swal.fire({
      title: isBlocked ? "Unblock User?" : "Block User?",
      text: isBlocked ? "Do you really want to unblock this user?" : "Do you really want to block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Yes, Unblock" : "Yes, Block",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await blockUser(userId);
      if (response.data.success) {
        Swal.fire(isBlocked ? "Unblocked!" : "Blocked!", response.data.message, "success");
        fetchUsers(pagination.page);
      } else {
        Swal.fire("Error", response.data.message || "Unable to update user block status", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    }
  };

  // ===== OLD FUNCTION (COMMENTED) =====
  // const handleExposureClick = (userId) => {
  //   navigate(`/user-bets-exposer-details/${userId}`, {
  //     state: { userId: userId },
  //   });
  // };
  // =====================================

  // ===== NEW: handleExposureClick for Popup =====
  // const handleExposureClick = async (userId, userName) => {
  //   try {
  //     setExposureLoading(true);
  //     setSelectedUserName(userName || 'User');

  //     const payload = {
  //       user_id: userId
  //     };

  //     const response = await getUserExposure(payload);
  //     console.log("Exposure Response:", response.data);

  //     if (response?.data?.success) {
  //       setExposureData(response.data.data || []);
  //     } else {
  //       setExposureData([]);
  //     }
  //     setShowExposurePopup(true);
  //   } catch (error) {
  //     console.error('Error fetching exposure:', error);
  //     setExposureData([]);
  //     setShowExposurePopup(true);
  //   } finally {
  //     setExposureLoading(false);
  //   }
  // };
  const handleExposureClick = async (userId, userName) => {
    try {
      setExposureLoading(true);
      setSelectedUserName(userName || 'User');

      const payload = {
        user_id: userId
      };

      const response = await getUserExposure(payload);
      console.log("Exposure Response:", response.data);

      // ✅ status_code check karo
      if (response?.data?.status_code === 1) {
        const userData = response.data.data[0];
        if (userData && userData.bets) {
          setExposureData(userData.bets);
        } else {
          setExposureData([]);
        }
      } else {
        setExposureData([]);
      }
      setShowExposurePopup(true);
    } catch (error) {
      console.error('Error fetching exposure:', error);
      setExposureData([]);
      setShowExposurePopup(true);
    } finally {
      setExposureLoading(false);
    }
  };
  // =============================================

  const handleBetSettledClick = (userId) => {
    navigate(`/user-settled-bets-details/${userId}`, {
      state: { userId: userId },
    });
  };

  const [summary, setSummary] = useState({
    total_balance: 0,
    total_exposure: 0,
    total_available_balance: 0,
    available_balance: 0,
    total_player_balance: 0
  });


  const calculateGrandTotals = (agents) => {
    if (!agents || agents.length === 0) {
      return {
        total_credit_ref: 0,
        total_withdraw_limit: 0,
        total_balance: 0,
        total_player_exposure: 0,
        total_available_balance: 0,
        total_player_balance: 0,
        total_reference_pl: 0,
        total_current_pl: 0
      };
    }

    return agents.reduce((acc, agent) => {
      acc.total_credit_ref += Number(agent.credit) || 0;
      acc.total_withdraw_limit += Number(agent.max_withdraw) || 0;
      acc.total_balance += Number(agent.credit) || 0;
      acc.total_player_exposure += Number(agent.totalExposure) || Number(agent.total_exposer) || 0;

      const credit = Number(agent.credit) || 0;
      const exposure = Number(agent.totalExposure) || Number(agent.total_exposer) || 0;
      acc.total_available_balance += (credit - exposure);

      acc.total_player_balance += Number(agent.total_amount) || 0;

      const win = Number(agent.win_amount) || 0;
      const loss = Number(agent.loss_amount) || 0;
      acc.total_reference_pl += (win - loss);
      acc.total_current_pl += (win - loss);

      return acc;
    }, {
      total_credit_ref: 0,
      total_withdraw_limit: 0,
      total_balance: 0,
      total_player_exposure: 0,
      total_available_balance: 0,
      total_player_balance: 0,
      total_reference_pl: 0,
      total_current_pl: 0
    });
  };

  return (
    <>
      {/* MAIN PAGE CONTENT */}
      <div className="allcommon">
        {/* Search and Filter Section */}
        <section className="find-member-sec py-3 pb-0 pt-0" style={{ marginTop: 5 }}>
          <div className="p-0">
            <h4 className="page-title">Clients</h4>
            <div className="row">
              <div className="mb-md-0 mb-3 col-xl-12">
                <div className="row">
                  <div className="d-flex flex-wrap col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <form id="searchForm" className="">
                      <div className="position-relative">
                        <input
                          placeholder="Find member..."
                          type="text"
                          className="form-control"
                        />
                        <button
                          type="submit"
                          className="search-btn s-btn btn btn-primary"
                        >
                          Search
                        </button>
                      </div>
                      <div className="d-flex align-items-center ps-2">
                        <label className="pe-3 mb-0 form-label">Status</label>
                        <select
                          aria-label="Default select example"
                          className="form-select"
                        >
                          <option value="">All</option>
                          <option value="active">Active</option>
                          <option value="suspend">Suspend</option>
                          <option value="locked">Locked</option>
                        </select>
                      </div>
                    </form>
                    <div className="agent-path mb-3" />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="d-flex flex-wrap justify-content-end">
                      <div className="find-member-director text-xl-end ">
                        <button className="btn" onClick={AdduserOpenModalall}>
                          <i className="fas fa-user-plus pe-1" /> Add User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="total-balance-sec d-flex justify-content-center align-items-center">
          <ul className="list-unstyled detail-header mb-2" style={{ width: "98.5%" }}>
            <li>
              <dt>Total Balance</dt>
              <strong>INR {summary.total_balance?.toFixed(2) || '0.00'}</strong>
            </li>
            <li>
              <dt>Total Exposure</dt>
              <strong>INR {summary.total_exposure?.toFixed(2) || '0.00'}</strong>
            </li>
            <li>
              <dt>Total Avail. bal.</dt>
              <strong>INR {summary.total_available_balance?.toFixed(2) || '0.00'}</strong>
            </li>
            <li>
              <dt>Balance</dt>
              <strong>INR {summary.balance?.toFixed(2) || '0.00'}</strong>
            </li>
            <li>
              <dt>Available Balance</dt>
              <strong>INR {summary.available_balance?.toFixed(2) || '0.00'}</strong>
            </li>
            <li>
              <dt>Total Player Balance</dt>
              <strong>INR {summary.total_player_balance?.toFixed(2) || '0.00'}</strong>
            </li>
          </ul>
        </section>

        <section className="find-member-sec py-3 pb-0 pt-0">
          <div className="card account-table home-table">
            <div className="home-table table-responsive">
              <table id="export-table" className="client-tabel table">
                <thead>
                  <tr>
                    <th scope="col" className="text-center">Account</th>
                    <th scope="col" className="text-center">Credit Ref.</th>
                    <th scope="col" className="text-center">Balance</th>
                    <th scope="col" className="text-center">Exposure</th>
                    <th scope="col" className="text-center">Avail. bal.</th>
                    <th scope="col" className="text-center">Exposure Limit</th>
                    <th scope="col" className="text-center">Reference P/L</th>
                    <th scope="col" className="text-center">Current P/L</th>
                    <th scope="col" className="text-center">B Lock</th>
                    <th scope="col" className="text-center">Status</th>
                    <th scope="col" className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableLoading ? (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        <div className="spinner-border text-primary"></div>
                      </td>
                    </tr>
                  ) : users && users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user._id || index}>
                        <td className="text-start">
                          <a href="#" className="text-primary">
                            <span>CL</span> {user.username || user.name || 'User'}
                          </a>
                        </td>
                        <td className="text-end">
                          <a href="#" onClick={(e) => {
                            e.preventDefault();
                            handleOpenModalall(user);
                          }} className="text-primary">
                            {user.credit || '0.00'} <i className="fas fa-pen ps-1" />
                          </a>
                        </td>
                        <td className="text-primary text-end">{user.balance || '0.00'}</td>

                        {/* ===== EXPOSURE COLUMN WITH CLICK ===== */}
                        {/* <td className="text-end">
                          <Link onClick={() => handleExposureClick(user._id, user.username || user.name)}>
                            <span className="status-suspend1">{user.totalExposure || '0.00'}</span>
                          </Link>
                        </td> */}
                        <td className="text-end">
                          <a>
                            <span
                              onClick={() => handleExposureClick(user._id, user.username || user.name)}
                              style={{ cursor: 'pointer' }}
                              className="status-suspend1"
                            >
                              {user.totalExposure || '0.00'}
                            </span>
                          </a>
                        </td>

                        {/* ====================================== */}

                        <td className="text-end">{user.avail_bal || '0.00'}</td>
                        <td className="text-end">{user.exposure_limit || '0.00'}</td>
                        <td className="text-end ul-t">
                          <span style={{ color: "red" }}>{user.reference_pl || '0.00'}</span>
                        </td>
                        <td className="text-end">
                          <span style={{ color: "green" }}>{user.current_pl || '0'}</span>
                        </td>
                        <td className="text-end b-lock">
                          <div className="">
                            <input
                              type="checkbox"
                              id={`default-checkbox-${index}`}
                              className="form-check-input"
                              checked={user.bet_block === 1 || user.block || false}
                              onChange={() => handleBetBlockToggle(user, index)}
                            />
                          </div>
                        </td>
                        <td className="text-end">
                          <strong className={
                            user.bet_block === 1
                              ? 'status-cheater'
                              : user.status === 'Active'
                                ? 'status-active'
                                : 'status-active'
                          }>
                            {user.bet_block === 1 ? "Cheater" : (user.status || 'Active')}
                          </strong>
                        </td>
                        <td className="action_link text-end">
                          <Link title="Betting Profit Loss" className="btn"
                            to={`/betting-profit-loss?admin_id=${user.admin_id || user._id}&role=${user.role || 3}`}>
                            <i className="fas fa-exchange-alt swap-icon" />
                          </Link>
                          <Link title="Betting History" className="btn"
                            to={`/betting-history?admin_id=${user.admin_id || user._id}&role=${user.role || 3}`}>
                            <i className="fas fa-th-list" />
                          </Link>
                          <a title="Change Status" className="btn" onClick={() => openChangeStatusModal(user)}>
                            <i className="fas fa-cog" />
                          </a>
                          <Link
                            title="Account Summary"
                            className="btn"
                            to={`/account-summary?admin_id=${user.admin_id || user._id}&role=${user.role || 3}`}
                          >
                            <i className="fas fa-user" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="bottom-pagination">
                <ul role="navigation" className="d-flex gap-2 align-items-center justify-content-center" aria-label="Pagination">
                  <li className="previous disabled">
                    <a className="" tabIndex={-1} role="button" aria-disabled="true" aria-label="Previous page" rel="prev" onClick={() => handlePageChange(pagination.page - 1)}>
                      &lt;
                    </a>
                  </li>
                  <li className="p-0 d-flex gap-2">
                    {[pagination.page - 1, pagination.page, pagination.page + 1]
                      .filter((p) => p > 0 && p <= pagination.totalPages)
                      .map((p) => (
                        <div className="" key={p}>
                          <a rel="canonical" role="button" className="pagintion-li" tabIndex={-1} aria-label="Page 1 is your current page" aria-current="page" onClick={() => handlePageChange(p)}>
                            {p}
                          </a>
                        </div>
                      ))}
                  </li>
                  <li className="next disabled">
                    <a className="" tabIndex={-1} role="button" aria-disabled="true" aria-label="Next page" rel="next" onClick={() => handlePageChange(pagination.page + 1)}>
                      &gt;
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add User Modal */}
      {Adduser && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={AdduserCloseModalall}
          >
            <div
              className="modal-dialog modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">Add User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={AdduserCloseModalall}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="super-admin-form" onSubmit={handleCreateUser}>
                    <div className="row">
                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Email</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter Email"
                              name="email"
                              type="email"
                              className="form-control"
                              value={userFormData.email}
                              onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                            />
                            {userErrors.email && (
                              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {userErrors.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Username</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter username"
                              name="username"
                              type="text"
                              className="form-control"
                              value={userFormData.username}
                              onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                            />
                            {userErrors.username && (
                              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {userErrors.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">First Name</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter firstName"
                              name="firstName"
                              type="text"
                              className="form-control"
                              value={userFormData.firstName}
                              onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                            />
                            {userErrors.firstName && (
                              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {userErrors.firstName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Last Name</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter lastName"
                              name="lastName"
                              type="text"
                              className="form-control"
                              value={userFormData.lastName}
                              onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                            />
                            {userErrors.lastName && (
                              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {userErrors.lastName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Password</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter Password"
                              name="password"
                              type="password"
                              className="form-control"
                              value={userFormData.password}
                              onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                            />
                            {userErrors.password && (
                              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {userErrors.password}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Confirm Password</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Confirm Password"
                              name="confirmPassword"
                              type="password"
                              className="form-control"
                              value={userFormData.confirmPassword}
                              onChange={(e) => setUserFormData({ ...userFormData, confirmPassword: e.target.value })}
                            />
                            {userErrors.confirmPassword && (
                              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {userErrors.confirmPassword}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Phone</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter Phone Number"
                              name="phone"
                              type="text"
                              className="form-control"
                              value={userFormData.phoneNumber}
                              onChange={(e) => setUserFormData({ ...userFormData, phoneNumber: e.target.value })}
                            />
                            {userErrors.phoneNumber && (
                              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {userErrors.phoneNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Exposure Limit</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter Exposure Limit"
                              name="exposureLimit"
                              type="number"
                              className="form-control"
                              value={userFormData.exposureLimit}
                              onChange={(e) => setUserFormData({ ...userFormData, exposureLimit: e.target.value })}
                            />
                            {userErrors.exposureLimit && (
                              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                {userErrors.exposureLimit}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <button type="submit" className="theme_dark_btn px-5 btn btn-primary" disabled={userLoading}>
                        {userLoading ? 'Creating...' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showModal && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleCloseModalall}
          >
            <div
              className="modal-dialog modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">Withdraw Amount Edit</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModalall}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="change-password-sec">
                    <h4 className="h4 mb-3 curent-value">
                      <label>Current :</label> <strong>{selectedUser?.credit || "0.00"}</strong>
                    </h4>
                    <div className="mb-2 d-flex align-items-center">
                      <label className="me-2">New</label>
                      <input
                        placeholder="Enter Withdraw Amount"
                        name="reference_amount"
                        type="number"
                        className="w-sm-50 form-control"
                      />
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                      <label className="me-2">Password</label>
                      <input
                        placeholder="Enter Password"
                        name="mypassword"
                        type="password"
                        className="w-sm-50 form-control"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <button type="submit" className="theme_dark_btn btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {changestatus && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={Changestatusclose}
          >
            <div
              className="modal-dialog modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">Change Password</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={Changestatusclose}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="test-status">
                    <div className="status-row d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">
                        <span>User </span> {selectedUserForPassword?.username || selectedUserForPassword?.name || 'User'}
                      </h6>
                      <small className="text-capitalize">{status}</small>
                    </div>

                    <div className="changestatus-option">
                      <ul className="list-unstyled mb-0 d-flex justify-content-around">
                        <li className={status === "active" ? "active" : ""}>
                          <button
                            type="button"
                            className="border-0 bg-transparent"
                            onClick={() => setStatus("active")}
                          >
                            <i className="far fa-check-circle" />
                            <span>Active</span>
                          </button>
                        </li>

                        <li className={status === "suspend" ? "active" : ""}>
                          <button
                            type="button"
                            className="border-0 bg-transparent"
                            onClick={() => setStatus("suspend")}
                          >
                            <i className="fas fa-ban" />
                            <span>Suspend</span>
                          </button>
                        </li>

                        <li className={status === "locked" ? "active" : ""}>
                          <button
                            type="button"
                            className="border-0 bg-transparent"
                            onClick={() => setStatus("locked")}
                          >
                            <i className="fas fa-lock" />
                            <span>Locked</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="py-3 px-3 change-status-form">
                    <form className="d-flex align-items-center" onSubmit={handleChangePassword}>
                      <div className="d-flex align-items-center f-group">
                        <label className="pe-2 mb-0 form-label">
                          Password
                        </label>
                        <div className="witherror">
                          <input
                            name="newPassword"
                            type="password"
                            placeholder="Enter New Password"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn theme_dark_btn btn-primary ms-2"
                        disabled={passwordLoading}
                      >
                        {passwordLoading ? 'Changing...' : 'Change'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== EXPOSURE POPUP MODAL ===== */}
      {/* Exposure Popup Modal */}
      {showExposurePopup && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setShowExposurePopup(false)}
          >
            <div
              className="modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content exposure-content">
                <div className="modal-header">
                  <h5 className="common-heading">
                    Exposure Information - {selectedUserName}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowExposurePopup(false)}
                  ></button>
                </div>
                <div className="">
                  {exposureLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary"></div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th className="text-center text-dark">Team</th>
                            <th className="text-center text-dark">Match Name</th>
                            <th className="text-center text-dark">Type</th>
                            <th className="text-center text-dark">Exposure</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exposureData && exposureData.length > 0 ? (
                            exposureData.map((item, index) => (
                              <tr key={item._id || index}>
                                <td className="text-center">{item.team || '-'}</td>
                                <td className="text-center">{item.game_name || '-'}</td>
                                <td className="text-center">
                                  <span>
                                    {item.bet_type || '-'}
                                  </span>
                                </td>
                                <td className="text-center fw-bold">
                                  {Math.abs(item.liability || item.stake || 0).toFixed(2)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center py-4">
                                No Records Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                        {/* Grand Total Row */}
                        {exposureData && exposureData.length > 0 && (
                          <tfoot>
                            <tr className="table-secondary">
                              <td colSpan="3" className="text-end fw-bold">
                                <strong>Grand Total</strong>
                              </td>
                              <td className="text-center fw-bold">
                                <strong>
                                  {exposureData.reduce((sum, item) => sum + Math.abs(item.liability || item.stake || 0), 0).toFixed(2)}
                                </strong>
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="theme_dark_btn btn btn-secondary"
                    onClick={() => setShowExposurePopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ================================ */}
    </>
  );
}

export default UsersList;