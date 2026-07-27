import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import {
  FaInfoCircle,
  FaLock,
  FaUnlock,
  FaStickyNote,
  FaTrashAlt,
  FaEdit,
  FaWallet,
  FaGamepad,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  getAllUsersList,
  deleteUser,
  clearuserexposure,
  updateUserStatus,
  depositToUser,
  withdrawFromUser,
  blockUser,
  CreateAgentAdmin,
  getAgentList,
  BetBlockUnblock,
  changeMasterPasswordAgentStatus,
  changeMasterPasswordAgent,
  GetAgentMarketList,
  AgentMarketStatusUpdate,
  getUserExposure,
} from "../Server/api";
import { FaPlus, FaMinus, FaEye } from "react-icons/fa";

function AgentLists() {
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
  const [AmountEdit, setAmountEdit] = useState(false);
  const AdduserOpenModalall = () => setAdduser(true);
  const AdduserCloseModalall = () => setAdduser(false);
  const AmountEditOpenModalall = () => setAmountEdit(true);
  const AmountEditCloseModalall = () => setAmountEdit(false);
  const [status, setStatus] = useState("active");
  const [agentErrors, setAgentErrors] = useState({});
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editType, setEditType] = useState("");

  // Get admin_id from localStorage
  const admin_id = localStorage.getItem("admin_id");

  // Password change states
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [selectedAgentForPassword, setSelectedAgentForPassword] =
    useState(null);

  // Block Market states
  const [blockMarketModal, setBlockMarketModal] = useState(false);
  const [marketList, setMarketList] = useState([]);
  const [marketLoading, setMarketLoading] = useState(false);
  const [selectedAgentForMarket, setSelectedAgentForMarket] = useState(null);

  // Block Market confirmation states
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [remark, setRemark] = useState("");
  const [actionType, setActionType] = useState(""); // "active" or "inactive"

  // ===== NEW: Exposure Popup States =====
  const [showExposurePopup, setShowExposurePopup] = useState(false);
  const [exposureData, setExposureData] = useState([]);
  const [exposureLoading, setExposureLoading] = useState(false);
  const [selectedAgentName, setSelectedAgentName] = useState("");
  // ======================================

  // Agent form states
  const [agentFormData, setAgentFormData] = useState({
    super_admin_id: admin_id || "",
    name: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    agent_comm: 0,
  });

  // Validate Agent Form - Pure JavaScript validation
  // Validate Agent Form - Sirf Alert ke saath
  // Validate Agent Form
  const validateAgentForm = () => {
    const errors = {};

    // Username validation
    if (!agentFormData.name || agentFormData.name.trim() === "") {
      errors.name = "Please enter username";
    }


    //  if (!agentFormData.agent_comm || agentFormData.agent_comm.trim() === "") {
    //   errors.agent_comm = "Please agent comm";
    // }


    // First Name validation (optional - agar required hai toh)
    // if (!agentFormData.firstName || agentFormData.firstName.trim() === "") {
    //   errors.firstName = "Please enter firstName";
    // }

    // Last Name validation (optional - agar required hai toh)
    // if (!agentFormData.lastName || agentFormData.lastName.trim() === "") {
    //   errors.lastName = "Please enter lastName";
    // }

    // Password validation
    if (!agentFormData.password) {
      errors.password = "Please enter password";
    }

    // Confirm Password validation
    if (!agentFormData.confirmPassword) {
      errors.confirmPassword = "Please enter confirm password";
    } else if (agentFormData.password !== agentFormData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setAgentErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const [agentList, setAgentList] = useState([]);
  const [agentLoading, setAgentLoading] = useState(false);

  // ===== SERVER SIDE FILTER STATES =====
  const [filters, setFilters] = useState({
    username: "",      // Search by username
    status: "",        // Filter by status
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

  // ===== SERVER SIDE FETCH AGENT LIST WITH FILTERS =====
  const fetchAgentList = async (
    page = pagination.page,
    limit = pagination.limit
  ) => {
    try {
      setAgentLoading(true);
      const payload = {
        admin_id: admin_id || "admin",
        page: page,
        limit: limit,
        // Server side filters - these will be sent to backend
        username: filters.username || "",   // Search by username
        status: filters.status || "",       // Filter by status (Active/Cheater)
      };
      const response = await getAgentList(payload);
      if (response.data && response.data.success) {
        setAgentList(response.data.data || []);

        // Update pagination from server response
        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.current_page || 1,
            limit: response.data.pagination.limit || 50,
            total: response.data.pagination.total_records || 0,
            totalPages: response.data.pagination.total_pages || 1,
          });
        }

        // Set summary
        if (response.data.summary) {
          setSummary({
            total_balance: response.data.summary.total_balance || "0.00",
            total_exposure: response.data.summary.total_exposure || "0.00",
            total_available_balance:
              response.data.summary.total_available_balance || "0.00",
            balance: response.data.summary.balance || "0.00",
            available_balance:
              response.data.summary.available_balance || "0.00",
            total_player_balance:
              response.data.summary.total_player_balance || "0.00",
          });
        }
      } else if (Array.isArray(response.data)) {
        setAgentList(response.data);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setAgentLoading(false);
    }
  };

  // ===== APPLY SERVER SIDE FILTERS =====
  const applyServerFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchAgentList(1, pagination.limit);
    setFilter(false);
  };

  // ===== RESET SERVER SIDE FILTERS =====
  const resetServerFilters = () => {
    setFilters({
      username: "",
      status: "",
      active: "",
      userId: "",
      mobile: "",
      fromDate: "",
      toDate: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchAgentList(1, pagination.limit);
  };

  // Calculate Grand Totals
  const calculateGrandTotals = () => {
    if (!agentList || agentList.length === 0) {
      return {
        credit_ref: 0,
        withdraw_limit: 0,
        balance: 0,
        player_exposure: 0,
        available_balance: 0,
        total_player_balance: 0,
        reference_pl: 0,
        current_pl: 0,
      };
    }

    return agentList.reduce(
      (acc, agent) => {
        acc.credit_ref += Number(agent.credit_ref) || 0;
        acc.withdraw_limit += Number(agent.withdraw_limit) || 0;
        acc.balance += Number(agent.balance) || 0;
        acc.player_exposure += Number(agent.player_exposure) || 0;
        acc.available_balance += Number(agent.available_balance) || 0;
        acc.total_player_balance += Number(agent.total_player_balance) || 0;
        acc.reference_pl += Number(agent.reference_pl) || 0;
        acc.current_pl += Number(agent.current_pl) || 0;
        return acc;
      },
      {
        credit_ref: 0,
        withdraw_limit: 0,
        balance: 0,
        player_exposure: 0,
        available_balance: 0,
        total_player_balance: 0,
        reference_pl: 0,
        current_pl: 0,
      },
    );
  };

  const grandTotals = calculateGrandTotals();

  // Handle Create Agent
  const handleCreateAgent = async (e) => {
    e.preventDefault();

    if (!validateAgentForm()) {
      return;
    }

    try {
      setAgentLoading(true);
      const payload = {
        super_admin_id: admin_id || "",
        name: agentFormData.name.trim(),
        password: agentFormData.password,
        agent_comm: agentFormData.agent_comm,
      };
      const response = await CreateAgentAdmin(payload);
      if (response.data && response.data.success) {
        Swal.fire("Success!", "Agent created successfully!", "success");
        setAdduser(false);
        setAgentFormData({
          super_admin_id: admin_id || "",
          name: "",
          firstName: "",
          lastName: "",
          password: "",
          confirmPassword: "",
          agent_comm: 0,
        });
        setAgentErrors({});
        fetchAgentList();
      } else {
        Swal.fire(
          "Error",
          response.data?.message || "Failed to create agent",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setAgentLoading(false);
    }
  };

  // Handle Bet Block/Unblock
  const handleBetBlockToggle = async (agent, index) => {
    const currentBlockStatus = agent.bet_block || 0;
    const newBlockStatus = currentBlockStatus === 0 ? 1 : 0;

    const confirm = await Swal.fire({
      title: newBlockStatus === 1 ? "Block Bet?" : "Unblock Bet?",
      text:
        newBlockStatus === 1
          ? "Do you really want to block betting for this agent?"
          : "Do you really want to unblock betting for this agent?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: newBlockStatus === 1 ? "Yes, Block" : "Yes, Unblock",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setAgentLoading(true);
      const payload = {
        admin_id: agent.admin_id || agent._id,
        bet_block: newBlockStatus,
      };
      const response = await BetBlockUnblock(payload);
      if (response.data && response.data.success) {
        Swal.fire(
          newBlockStatus === 1 ? "Blocked!" : "Unblocked!",
          response.data.message ||
          `Bet ${newBlockStatus === 1 ? "blocked" : "unblocked"} successfully!`,
          "success",
        );

        // Update local state
        const updatedList = [...agentList];
        updatedList[index] = {
          ...updatedList[index],
          bet_block: newBlockStatus,
          status: newBlockStatus === 1 ? "Cheater" : "Active",
        };
        setAgentList(updatedList);

      } else {
        Swal.fire(
          "Error",
          response.data?.message || "Failed to update bet block status",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setAgentLoading(false);
    }
  };

  // Handle Change Password
  // const handleChangePassword = async (e) => {
  //   e.preventDefault();

  //   if (!newPassword) {
  //     Swal.fire("Error", "Please enter new password", "error");
  //     return;
  //   }
  //   if (newPassword.length < 6) {
  //     Swal.fire("Error", "Password must be at least 6 characters", "error");
  //     return;
  //   }

  //   try {
  //     setPasswordLoading(true);
  //     const payload = {
  //       admin_id:
  //         selectedAgentForPassword?.admin_id ||
  //         selectedAgentForPassword?._id ||
  //         admin_id,
  //       newPassword: newPassword,
  //     };
  //     const response = await changeMasterPasswordAgent(payload);
  //     if (response.data && response.data.success) {
  //       Swal.fire("Success!", "Password changed successfully!", "success");
  //       setChangestatus(false);
  //       setNewPassword("");
  //       setSelectedAgentForPassword(null);
  //     } else {
  //       Swal.fire(
  //         "Error",
  //         response.data?.message || "Failed to change password",
  //         "error",
  //       );
  //     }
  //   } catch (error) {
  //     Swal.fire(
  //       "Error",
  //       error.response?.data?.message || "Something went wrong",
  //       "error",
  //     );
  //   } finally {
  //     setPasswordLoading(false);
  //   }
  // };


  // Handle Change Password
  // Handle Change Password - AgentLists.jsx
  // Handle Change Password - AgentLists.jsx
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
        admin_id: selectedAgentForPassword?.admin_id || selectedAgentForPassword?._id || admin_id,
        newPassword: newPassword,
        status: status  // ✅ YEH LINE ADD KARO - status payload mein bhejo
      };
      console.log("Payload:", payload); // Debug ke liye
      const response = await changeMasterPasswordAgentStatus(payload);
      if (response.data && response.data.success) {
        Swal.fire("Success!", "Status changed successfully!", "success");
        setChangestatus(false);
        setNewPassword("");
        setSelectedAgentForPassword(null);
        fetchAgentList(); // Refresh list
      } else {
        Swal.fire("Error", response.data?.message || "Failed to change Status", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setPasswordLoading(false);
    }
  };


  // Open Change Status Modal with agent data
  const openChangeStatusModal = (agent) => {
    setSelectedAgentForPassword(agent);
    setNewPassword("");
    setConfirmNewPassword("");
    setStatus("active");
    setChangestatus(true);
  };

  // Fetch Market List
  const fetchMarketList = async (agent) => {
    try {
      setMarketLoading(true);
      setSelectedAgentForMarket(agent);
      const payload = {
        agent_id: agent.admin_id || agent._id,
      };
      const response = await GetAgentMarketList(payload);
      if (response.data && response.data.success) {
        setMarketList(response.data.data || []);
        setBlockMarketModal(true);
      } else {
        Swal.fire(
          "Error",
          response.data?.message || "Failed to fetch market list",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setMarketLoading(false);
    }
  };

  // Handle Market Status Update with Confirmation
  const handleMarketStatusUpdate = (item, currentStatus) => {
    setSelectedMarket(item);
    setActionType(currentStatus === 1 ? "inactive" : "active");
    setRemark("");
    setConfirmModal(true);
  };

  // Confirm Market Status Update
  const confirmMarketStatusUpdate = async () => {
    if (!remark || remark.trim() === "") {
      Swal.fire("Error", "Please enter a remark", "error");
      return;
    }

    const newStatus = actionType === "active" ? 1 : 0;

    try {
      const payload = {
        agent_id:
          selectedAgentForMarket?.admin_id || selectedAgentForMarket?._id,
        market_id: selectedMarket?.market_id || selectedMarket?.id,
        status: newStatus,
        bet_remark: remark.trim(),
      };
      const response = await AgentMarketStatusUpdate(payload);
      if (response.data && response.data.success) {
        Swal.fire(
          actionType === "active" ? "Activated!" : "Inactivated!",
          response.data.message ||
          `Market ${actionType === "active" ? "activated" : "inactivated"} successfully!`,
          "success",
        );
        setConfirmModal(false);
        setRemark("");
        setSelectedMarket(null);
        await fetchMarketList(selectedAgentForMarket);
      } else {
        Swal.fire(
          "Error",
          response.data?.message || "Failed to update market status",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAgentList();
  }, []);

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
          "error",
        );
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchAgentList(newPage, pagination.limit);
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
          <p><strong>User:</strong> ${selectedUser?.username || selectedUser?.mobile
            }</p>
          <p><strong>Previous Balance:</strong> ₹ ${response.data.data.previousBalance || selectedUser?.credit || 0
            }</p>
          <p><strong>${modalType === "add" ? "Added" : "Withdrawn"
            }:</strong> ₹ ${amount}</p>
        </div>
        `,
          icon: "success",
        });
        fetchUsers(pagination.page);
        handleCloseModal();
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Transaction failed",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    const confirm = await Swal.fire({
      title: isBlocked ? "Unblock User?" : "Block User?",
      text: isBlocked
        ? "Do you really want to unblock this user?"
        : "Do you really want to block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Yes, Unblock" : "Yes, Block",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await blockUser(userId);
      if (response.data.success) {
        Swal.fire(
          isBlocked ? "Unblocked!" : "Blocked!",
          response.data.message,
          "success",
        );
        fetchUsers(pagination.page);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Unable to update user block status",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  const handleExposureClick = async (agentId, agentName, adminId) => {
    try {
      setExposureLoading(true);
      setSelectedAgentName(agentName || 'Agent');

      const payload = {
        agent_id: adminId || agentId
      };

      const response = await getUserExposure(payload);
      console.log("Exposure Response:", response.data);

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

  const handleBetSettledClick = (userId) => {
    navigate(`/user-settled-bets-details/${userId}`, {
      state: { userId: userId },
    });
  };

  const [summary, setSummary] = useState({
    total_balance: "0.00",
    total_exposure: "0.00",
    total_available_balance: "0.00",
    balance: "0.00",
    available_balance: "0.00",
    total_player_balance: "0.00",
  });

  const [changestatus, setChangestatus] = useState(false);

  const Changestatusopen = () => {
    setChangestatus(true);
  };

  const Changestatusclose = () => {
    setChangestatus(false);
    setNewPassword("");
    setSelectedAgentForPassword(null);
  };

  return (
    <>
      <div className="allcommon">
        {/* Search and Filter Section */}
        <section
          className="find-member-sec py-3 pb-0 pt-0"
          style={{ marginTop: 5 }}
        >
          <div className="p-0 container-fluid">
            <h4 className="page-title">Clients</h4>
            <div className="row">
              <div className="mb-md-0 mb-3 col-xl-12">
                <div className="row">
                  <div className="d-flex flex-wrap col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <form id="searchForm" className="">

                      <div className="position-relative d-flex align-items-center gap-2" >
                        <input
                          placeholder="Find member..."
                          type="text"
                          className="form-control"
                          value={filters.username}
                          onChange={(e) => setFilters({ ...filters, username: e.target.value })}
                        />

                      </div>

                      <div className="d-flex align-items-center ps-2 gap-2">
                        <label className="pe-3 mb-0 form-label">Status</label>
                        <select
                          aria-label="Default select example"
                          className="form-select h-auto"
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                          <option value="">All</option>
                          <option value="active">Active</option>
                          {/* <option value="cheater">Cheater</option> */}
                          <option value="suspend">Suspend</option>
                          <option value="locked">Locked</option>
                        </select>

                        <button
                          type="button"
                          className="btn btn-primary py-2"
                          // className="search-btn s-btn btn btn-primary"
                          onClick={applyServerFilters}
                        >
                          Search
                        </button>
                        <button
                          className="btn btn-secondary me-2 align-items-center d-flex"
                          onClick={resetServerFilters}
                        >
                          <i className="fas fa-undo me-1"></i> Reset
                        </button>
                      </div>



                    </form>
                    <div className="agent-path mb-3" />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="d-flex flex-wrap justify-content-end">
                      {/* ===== RESET FILTER BUTTON ===== */}

                      <div className="find-member-director text-xl-end ">
                        <button className="btn" onClick={AdduserOpenModalall}>
                          <i className="fas fa-user-plus pe-1" /> Add Agent
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
          <ul
            className="list-unstyled detail-header mb-2"
            style={{ width: "100%" }}
          >
            <li>
              <dt>Total Balance</dt>
              <strong>INR {summary.total_balance}</strong>
            </li>
            <li>
              <dt>Total Exposure</dt>
              <strong>INR {summary.total_exposure}</strong>
            </li>
            <li>
              <dt>Total Avail. bal.</dt>
              <strong>INR {summary.total_available_balance}</strong>
            </li>
            <li>
              <dt>Balance</dt>
              <strong>INR {summary.balance}</strong>
            </li>
            <li>
              <dt>Available Balance</dt>
              <strong>INR {summary.available_balance}</strong>
            </li>
            <li>
              <dt>Total Player Balance</dt>
              <strong>INR {summary.total_player_balance}</strong>
            </li>
          </ul>
        </section>

        <div className="account-table home-table">
          <table
            id="export-table"
            className="client-tabel table table-striped"
          >
            <thead>
              <tr>
                <th scope="col" className="text-center">
                  Account
                </th>
                <th scope="col" className="text-center">
                  Credit Ref.
                </th>
                <th scope="col" className="text-center">
                  Withdraw Limit
                </th>
                <th scope="col" className="text-center">
                  Balance
                </th>
                <th scope="col" className="text-center">
                  Player Exposure
                </th>
                <th scope="col" className="text-center">
                  Avail. bal.
                </th>
                <th scope="col" className="text-center">
                  Player Balance
                </th>
                <th scope="col" className="text-center">
                  Reference P/L
                </th>
                <th scope="col" className="text-center">
                  Current P/L
                </th>
                <th scope="col" className="text-center">
                  B Lock
                </th>
                <th scope="col" className="text-center">
                  Status
                </th>
                <th scope="col" className="text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td scope="col" className="text-center">
                  {/* <strong>Total</strong> */}
                </td>
                <td scope="col" className="text-center">
                  <strong>
                    {(grandTotals.credit_ref - grandTotals.player_exposure).toFixed(2)}
                  </strong>
                </td>
                <td scope="col" className="text-center">
                  <strong>{grandTotals.withdraw_limit.toFixed(2)}</strong>
                </td>
                <td scope="col" className="text-center">
                  <strong>{grandTotals.balance.toFixed(2)}</strong>
                </td>
                <td scope="col" className="text-center">
                  <strong>{grandTotals.player_exposure.toFixed(2)}</strong>
                </td>
                <td scope="col" className="text-center">
                  <strong>{grandTotals.available_balance.toFixed(2)}</strong>
                </td>
                <td scope="col" className="text-center">
                  <strong>
                    {grandTotals.total_player_balance.toFixed(2)}
                  </strong>
                </td>
                <td scope="col" className="text-center">
                  {/* <strong>{grandTotals.total_amount}</strong> */}
                </td>
                <td scope="col" className="text-center">
                  {/* <strong>{grandTotals.current_pl.toFixed(2)}</strong> */}
                </td>
                <td scope="col" className="text-center"></td>
                <td scope="col" className="text-center"></td>
                <td scope="col" className="text-center"></td>
              </tr>
              {agentList.length > 0 ? (
                agentList.map((agent, index) => (
                  <tr key={index}>
                    <td className="text-start">
                      <Link to={`/users-list?agent_id=${agent.admin_id}`}>
                        <span>AG</span>
                        {agent.name || agent.username}
                      </Link>
                    </td>

                    <td className="text-end">
                      <Link
                        to="#"
                        className="text-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedAgent(agent);
                          setEditType("credit");
                        }}
                      >
                        {/* {(agent.credit_ref - agent.player_exposure).toFixed(2)} */}
                        {(agent.credit_ref).toFixed(2)}
                        <i className="fas fa-pen ps-1" />
                      </Link>
                    </td>
                    <td className="text-end">
                      <Link
                        to="#"
                        className="text-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedAgent(agent);
                          setEditType("withdraw");
                        }}
                      >
                        {agent.withdraw_limit || "0.00"}{" "}
                        <i className="fas fa-pen ps-1" />
                      </Link>
                    </td>
                    <td className="text-primary text-end">
                      {agent.balance || "0.00"}
                    </td>
                    <td className="text-end">
                      <Link onClick={() => handleExposureClick(agent.admin_id)}>
                        <span className="status-suspend1">{agent.player_exposure || '0.00'}</span>
                      </Link>
                    </td>
                    <td className="text-end">
                      {agent.available_balance || "0.00"}
                    </td>
                    <td className="text-end">
                      {agent.total_player_balance || "0.00"}
                    </td>
                    <td className={`text-end  ${Number(agent.total_amount) <= 0 ? "ul-t" : "ul-t2"
                      }`}>
                      <span>
                        {agent.total_amount || "0.00"}
                      </span>
                    </td>
                    <td className="text-end">
                      <span style={{ color: "green" }}>
                        {agent.current_pl || "0.00"}
                      </span>
                    </td>
                    <td className="text-end b-lock">
                      <div className="">
                        <input
                          type="checkbox"
                          id={`default-checkbox-${index}`}
                          className="form-check-input"
                          checked={
                            agent.bet_block === 1 || agent.block || false
                          }
                          onChange={() => handleBetBlockToggle(agent, index)}
                        />
                      </div>
                    </td>
                    <td className="text-end">
                      <strong
                        className={
                          agent.bet_block === 1
                            ? "status-cheater"
                            : agent.status === "active"
                              ? "status-active"
                              : "status-active"
                        }
                      >
                        {agent.bet_block === 1
                          ? "Cheater"
                          : agent.status || "active"}
                      </strong>
                    </td>
                    <td className="action_link text-end">
                      <Link
                        to={`/betting-profit-loss?admin_id=${agent.admin_id || agent._id}&role=${agent.role || 2}`}
                        className="btn"
                        title="Betting Profit Loss"
                      >
                        <i className="fas fa-exchange-alt swap-icon" />
                      </Link>

                      <Link
                        to={`/betting-history?admin_id=${agent.admin_id || agent._id}&role=${agent.role || 2}`}
                        className="btn"
                        title="Betting History"
                      >
                        <i className="fas fa-th-list" />
                      </Link>

                      <a
                        title="Change Status"
                        className="btn"
                        onClick={() => openChangeStatusModal(agent)}
                      >
                        <i className="fas fa-cog" />
                      </a>

                      <Link
                        to={`/account-summary?admin_id=${agent.admin_id || agent._id}&role=${agent.role || 2}`}
                        className="btn"
                        title="Account Summary"
                      >
                        <i className="fas fa-user" />
                      </Link>

                      <a
                        title="Block Market"
                        className="btn"
                        onClick={() => fetchMarketList(agent)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fas fa-lock" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-4">
                    {agentLoading ? (
                      <div className="spinner-border text-primary"></div>
                    ) : (
                      "No agents found"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="bottom-pagination d-flex justify-content-center align-items-center">
              {/* <span className="text-muted small">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} All users
              </span> */}

              <ul className="pagination mb-0 gap-0">
                <li
                  className={`previous ${pagination.page === 1 ? "disabled" : ""
                    }`}
                >
                  <Link
                    className=""
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    <FaChevronLeft />
                  </Link>
                </li>

                {[pagination.page - 1, pagination.page, pagination.page + 1]
                  .filter((p) => p > 0 && p <= pagination.totalPages)
                  .map((p) => (
                    <li
                      key={p}
                      className={`p-0 ${pagination.page === p ? "active" : ""
                        }`}
                    >
                      <Link
                        className="pagintion-li"
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </Link>
                    </li>
                  ))}

                <li
                  className={`next ${pagination.page === pagination.totalPages ? "disabled" : ""
                    }`}
                >
                  <Link
                    className=""
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    <FaChevronRight />
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modals - All existing modals remain unchanged */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add" ? "Add Balance" : "Withdraw Balance"} -{" "}
            {selectedUser?.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <div className="alert alert-info">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Current Balance:</span>
                <span className="h5 mb-0">₹ {selectedUser?.credit || 0}</span>
              </div>
              {modalType === "withdraw" && (
                <div className="mt-2 small text-muted">
                  Available to withdraw: ₹ {selectedUser?.credit || 0}
                </div>
              )}
            </div>
          </div>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Amount{" "}
                {modalType === "withdraw" &&
                  `(Max: ₹ ${selectedUser?.credit || 0})`}
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={
                  modalType === "withdraw" ? selectedUser?.credit : undefined
                }
                min="0"
                step="0.01"
              />
              {modalType === "withdraw" && selectedUser?.credit > 0 && (
                <div className="mt-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setAmount(selectedUser.credit)}
                  >
                    Use Max Balance
                  </button>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter remarks (optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>

            {amount > 0 && (
              <div className="alert alert-warning">
                <div className="d-flex justify-content-between">
                  <span>Current Balance:</span>
                  <span>₹ {selectedUser?.credit || 0}</span>
                </div>
                <div className="d-flex justify-content-between mt-1">
                  <span>
                    {modalType === "add"
                      ? "Amount to Add:"
                      : "Amount to Withdraw:"}
                  </span>
                  <span>₹ {amount}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between fw-bold">
                  <span>New Balance:</span>
                  <span>
                    ₹{" "}
                    {modalType === "add"
                      ? (selectedUser?.credit || 0) + Number(amount)
                      : (selectedUser?.credit || 0) - Number(amount)}
                  </span>
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100 align-items-center">
            <div className="text-muted small">
              User ID: {selectedUser?.user_id}
            </div>
            <div className="d-flex gap-2">
              <Button variant="danger" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant={modalType === "add" ? "success" : "warning"}
                onClick={handleClick}
                disabled={
                  loading ||
                  (modalType === "withdraw" &&
                    Number(amount) > (selectedUser?.credit || 0))
                }
              >
                {loading ? (
                  "Processing..."
                ) : modalType === "add" ? (
                  <>
                    <FaPlus className="me-1" /> Add ₹ {amount || 0}
                  </>
                ) : (
                  <>Withdraw ₹ {amount || 0}</>
                )}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {changestatus && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={Changestatusclose}
          >
            <div
              className="modal-dialog modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">Change Sttaus</h5>
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
                        <span className="me-1">Agent </span>{" "}
                        {selectedAgentForPassword?.name ||
                          selectedAgentForPassword?.username ||
                          "Agent"}
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
                    <form
                      className="d-flex align-items-center"
                      onSubmit={handleChangePassword}
                    >
                      <div className="d-flex align-items-center f-group">
                        <label className="pe-2 mb-0 form-label">Password</label>
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
                        {passwordLoading ? "Changing..." : "Change"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Market Modal */}
      {blockMarketModal && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setBlockMarketModal(false)}
          >
            <div
              className="modal-dialog modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">
                    Block Market -{" "}
                    {selectedAgentForMarket?.name ||
                      selectedAgentForMarket?.username ||
                      "Agent"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setBlockMarketModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {marketLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary"></div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th className="text-center">S.No.</th>
                            <th className="text-center">Betfair ID</th>
                            <th className="text-center">Name</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marketList && marketList.length > 0 ? (
                            marketList.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {item.betfair_id || item.market_id || "-"}
                                </td>
                                <td className="text-center">
                                  {item.name || item.market_name || "-"}
                                </td>
                                <td className="text-center">
                                  <span
                                    className={
                                      item.status === 1
                                        ? "text-success"
                                        : "text-danger"
                                    }
                                  >
                                    {item.status === 1
                                      ? `${item.name || "Market"} is ON`
                                      : `${item.name || "Market"} is OFF`}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <div className="form-check form-check-inline form-switch ps-0">
                                    <input
                                      type="checkbox"
                                      className="form-check-input ms-0"
                                      checked={item.status === 1}
                                      onChange={() =>
                                        handleMarketStatusUpdate(
                                          item,
                                          item.status,
                                        )
                                      }
                                    />
                                    <label
                                      title=""
                                      className="form-check-label"
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center py-4">
                                No markets found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setConfirmModal(false)}
          >
            <div
              className="modal-dialog modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">
                    {actionType === "active" ? "Activate" : "InActive"} Match
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setConfirmModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Remark</label>
                    <textarea
                      style={{ height: "70px" }}
                      type="text"
                      className="form-control"
                      placeholder="Enter remark..."
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    <h6 className="mb-3">
                      You Want to{" "}
                      {actionType === "active" ? "Active" : "InActive"} This
                      Match?
                    </h6>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        className="green-btn me-3 btn btn-primary"
                        onClick={confirmMarketStatusUpdate}
                      >
                        Confirm
                      </button>
                      <button
                        className="green-btn btn btn-primary"
                        onClick={() => setConfirmModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {Adduser && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={AdduserCloseModalall}
          >
            <div
              className="modal-dialog modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">Add Agent</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={AdduserCloseModalall}
                  ></button>
                </div>
                <div className="modal-body">
                  <form
                    className="super-admin-form"
                    onSubmit={handleCreateAgent}
                  >
                    <div className="row">
                      <div className="mb-3 col-sm-12">
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
                              value={agentFormData.name}
                              onChange={(e) =>
                                setAgentFormData({
                                  ...agentFormData,
                                  name: e.target.value,
                                })
                              }
                            />
                            {agentErrors.name && (
                              <div
                                style={{
                                  color: "#dc3545",
                                  fontSize: "14px",
                                  marginTop: "5px",
                                }}
                              >
                                {agentErrors.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 col-sm-12">
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
                              value={agentFormData.firstName}
                              onChange={(e) =>
                                setAgentFormData({
                                  ...agentFormData,
                                  firstName: e.target.value,
                                })
                              }
                            />
                            {agentErrors.firstName && (
                              <div
                                style={{
                                  color: "#dc3545",
                                  fontSize: "14px",
                                  marginTop: "5px",
                                }}
                              >
                                {agentErrors.firstName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 col-sm-12">
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
                              value={agentFormData.lastName}
                              onChange={(e) =>
                                setAgentFormData({
                                  ...agentFormData,
                                  lastName: e.target.value,
                                })
                              }
                            />
                            {agentErrors.lastName && (
                              <div
                                style={{
                                  color: "#dc3545",
                                  fontSize: "14px",
                                  marginTop: "5px",
                                }}
                              >
                                {agentErrors.lastName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 col-sm-12">
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
                              value={agentFormData.password}
                              onChange={(e) =>
                                setAgentFormData({
                                  ...agentFormData,
                                  password: e.target.value,
                                })
                              }
                            />
                            {agentErrors.password && (
                              <div
                                style={{
                                  color: "#dc3545",
                                  fontSize: "14px",
                                  marginTop: "5px",
                                }}
                              >
                                {agentErrors.password}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">
                              Confirm Password
                            </label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter confirm password"
                              name="confirmPassword"
                              type="password"
                              className="form-control"
                              value={agentFormData.confirmPassword}
                              onChange={(e) =>
                                setAgentFormData({
                                  ...agentFormData,
                                  confirmPassword: e.target.value,
                                })
                              }
                            />
                            {agentErrors.confirmPassword && (
                              <div
                                style={{
                                  color: "#dc3545",
                                  fontSize: "14px",
                                  marginTop: "5px",
                                }}
                              >
                                {agentErrors.confirmPassword}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 col-sm-12">
                      <div className="row">
                        <div className="col-md-4">
                          <label className="form-label">Agent Comm (%)</label>
                        </div>
                        <div className="col-md-8">
                          <input
                            placeholder="Enter Agent Comm"
                            name="agent_comm"
                            type="text"
                            className="form-control"
                            value={agentFormData.agent_comm}
                            onChange={(e) =>
                              setAgentFormData({
                                ...agentFormData,
                                agent_comm: e.target.value,
                              })
                            }
                          />
                          {agentErrors.agent_comm && (
                            <div
                              style={{
                                color: "#dc3545",
                                fontSize: "14px",
                                marginTop: "5px",
                              }}
                            >
                              {agentErrors.agent_comm}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-center">
                      <button
                        type="submit"
                        className="theme_dark_btn px-5 btn btn-primary"
                        disabled={agentLoading}
                      >
                        {agentLoading ? "Creating..." : "Create"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exposure Popup Modal */}
      {showExposurePopup && (
        <div className="allcommon newwidthallsames">
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowExposurePopup(false)}
          >
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content exposure-content">
                <div className="modal-header ">
                  <h2 className="common-heading">
                    Exposure Information - {selectedAgentName}
                  </h2>
                </div>
                <div className="modal-body">
                  {exposureLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary"></div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th className="text-center text-dark">
                              Match Name
                            </th>
                            <th className="text-center text-dark">
                              Market/FancyName
                            </th>
                            <th className="text-center text-dark">Type</th>
                            <th className="text-center text-dark">Exposure</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exposureData && exposureData.length > 0 ? (
                            <>
                              {exposureData.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-center">{item.team || '-'}</td>
                                  <td className="text-center">{item.game_name || '-'}</td>
                                  <td className="text-center">{item.bet_type || '-'}</td>
                                  <td className="text-center fw-bold">
                                    {Math.abs(item.total || 0).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                              <tr className="table-secondary">
                                <td colSpan="3" className="text-end fw-bold">
                                  <strong>Grand Total</strong>
                                </td>
                                <td className="text-center fw-bold text-danger">
                                  <strong>
                                    {exposureData.reduce((sum, item) => sum + Math.abs(item.total || 0), 0).toFixed(2)}
                                  </strong>
                                </td>
                              </tr>
                            </>
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center py-4">
                                No Records Found
                              </td>
                            </tr>
                          )}
                        </tbody>
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

      {showWithdrawModal && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowExposurePopup(false)}
          ></div>
          <div
            role="dialog"
            aria-modal="true"
            className="fade change-status-modal modal show"
            tabIndex="-1"
            style={{ display: "block", paddingLeft: "15px" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="p-0 pb-2 modal-header">
                  <div className="modal-title-status h4 modal-title">
                    {editType === "credit"
                      ? "Credit Reference Edit"
                      : "Withdraw Amount Edit"}
                  </div>

                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowWithdrawModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="test-status border-0 text-start">
                    <form className="change-password-sec">
                      <h4 className="h4 mb-3 curent-value">
                        <label>Current :</label>{" "}
                        <strong>
                          {editType === "credit"
                            ? selectedAgent?.credit_ref || "0.00"
                            : selectedAgent?.withdraw_limit || "0.00"}
                        </strong>
                      </h4>

                      <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">New</label>

                        <input
                          placeholder={editType === "credit" ? "Enter Credit Reference" : "Enter Withdraw Amount"}
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
                        <button
                          type="submit"
                          className="theme_dark_btn btn btn-primary"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AgentLists;