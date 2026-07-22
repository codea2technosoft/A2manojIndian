
import { useState, useRef, useEffect } from "react";
import {
  FiSearch, FiEdit2, FiMoreVertical, FiUser, FiUserCheck,
  FiUserX, FiLock, FiTrash2, FiSlash, FiPlusCircle,
  FiMinusCircle, FiChevronLeft, FiChevronRight,
  FiChevronsLeft, FiChevronsRight, FiEye, FiEyeOff
} from "react-icons/fi";
import { FaEye } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "react-bootstrap";
import {
  getAgentList,
  updateClientStatus,
  blockUnblockMaster,
  deleteMaster,
  changeMasterPassword,
  coinsDeposit,
  coinsWithdraw,

} from "../Server/api"


function AgentMaster() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({
    code: "",
    name: "",
  });
  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showOTP, setShowOTP] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [paginationData, setPaginationData] = useState({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    limit: 10
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const admin_id = localStorage.getItem("admin_id");
  console.log("admin_id", admin_id)

  const role = "2";
  const token = localStorage.getItem("token");
  const dropdownRef = useRef(null);
  const actionDropdownRef = useRef(null);

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showWarningToast = (message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  const toggleTablePasswordVisibility = (adminId) => {
    setShowPassword(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };
  const handlePasswordDataChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchAgentData(nextPage, itemsPerPage, searchTerm, filters);
    }
  };
  const toggleOTPVisibility = (adminId) => {
    setShowOTP(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };


  const handlePrev = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchAgentData(prevPage, itemsPerPage, searchTerm, filters);
    }
  };

  const handleFirst = () => {
    setCurrentPage(1);
    fetchAgentData(1, itemsPerPage, searchTerm, filters);
  };

  const handleLast = () => {
    setCurrentPage(totalPages);
    fetchAgentData(totalPages, itemsPerPage, searchTerm, filters);
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchAgentData(page, itemsPerPage, searchTerm, filters);
    }
  };

const getPageNumbers = () => {
  const pageNumbers = [];
  const maxVisiblePages = 3;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    // adjust start when near end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
  }

  return pageNumbers;
};

  const fetchAgentData = async (page = 1, limit = 10, search = "", filterData = {}) => {
    try {
      setIsSearching(true);
      setLoading(true);
      const payload = {
        page: page,
        limit: limit,
        role: role,
        master_admin_id: admin_id,
        ...(search && { search: search }),
        ...(filterData.code && { code: filterData.code }),
        ...(filterData.name && { name: filterData.name })
      };
      const response = await getAgentList(payload);
      if (response.data.success) {
        const data = response.data;
        setAgentData(data.data || []);
        setTotalItems(data.pagination?.total_records || 0);
        setTotalPages(data.pagination?.total_pages || 1);
        setCurrentPage(data.pagination?.current_page || page);
        setSearchTerm(search);

        setPaginationData({
          total_records: data.pagination?.total_records || 0,
          total_pages: data.pagination?.total_pages || 1,
          current_page: data.pagination?.current_page || page,
          limit: data.pagination?.limit || limit
        });

        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
        setAgentData([]);
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
      showErrorToast("Failed to load agents. Please try again.");
      setAgentData([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchAgentData();
  }, [token]);

  const handleSearch = () => {
    if (searchInput.trim() !== searchTerm) {
      fetchAgentData(1, itemsPerPage, searchInput.trim(), filters);
    }
  };

  const handleClearSearch = () => {
    if (searchTerm !== "" || filters.code !== "" || filters.name !== "") {
      setSearchInput("");
      setFilters({ code: "", name: "" });
      fetchAgentData(1, itemsPerPage, "", { code: "", name: "" });
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleFilter = (key) => {
    setOpenFilter(openFilter === key ? null : key);
  };

  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleFilterSearch = () => {
    setOpenFilter(null);
    fetchAgentData(1, itemsPerPage, searchTerm, filters);
  };

  const handleCancel = (key) => {
    setFilters({ ...filters, [key]: "" });
    setOpenFilter(null);
  };

  const handleClearAllFilters = () => {
    if (filters.code !== "" || filters.name !== "") {
      setFilters({ code: "", name: "" });
      fetchAgentData(1, itemsPerPage, searchTerm, { code: "", name: "" });
    }
  };

  const toggleActionDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleStatusChange = async () => {
    if (!selectedAgent) return;

    try {
      const newStatus = selectedAgent.active === 1 ? 0 : 1;

      const response = await updateClientStatus(
        selectedAgent.admin_id,
        role,
        newStatus
      );

      if (response.data.success) {
        showSuccessToast(
          `Agent ${newStatus === 1 ? "activated" : "deactivated"} successfully`
        );

        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        setShowStatusModal(false);
        setSelectedAgent(null);
      } else {
        showErrorToast(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating agent status:", error);
      showErrorToast("Failed to update agent status. Please try again.");
    }
  };

  const handleBlockUnblock = async () => {
    if (!selectedAgent) return;

    try {
      const currentBlock = Number(selectedAgent.is_blocked);
      const newBlockStatus = currentBlock === 1 ? 0 : 1;

      const response = await blockUnblockMaster(
        selectedAgent.admin_id,
        role,
        newBlockStatus
      );

      if (response.data.success) {
        showSuccessToast(
          `Agent ${newBlockStatus === 1 ? "blocked" : "unblocked"} successfully`
        );

        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        setShowBlockModal(false);
        setSelectedAgent(null);
      } else {
        showErrorToast(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating block status:", error);
      showErrorToast("Failed to update block status. Please try again.");
    }
  };


  const handleDeleteAgent = async () => {
    if (!selectedAgent) return;

    try {
      showWarningToast("Deleting agent...");

      const response = await deleteMaster(selectedAgent.admin_id, role);
      if (response.data.success) {
        showSuccessToast("Agent deleted successfully");
        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        setShowDeleteModal(false);
        setSelectedAgent(null);
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      showErrorToast("Failed to delete agent. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedAgent) return;

    // Validation
    if (!passwordData.oldPassword) {
      showErrorToast("Please enter old password");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast("New password and confirm password do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showErrorToast("Password must be at least 6 characters long");
      return;
    }

    try {
      // const response = await axios.post(
      //   `${process.env.REACT_APP_API_URL}/change-user-password-admin`,
      //   {
      //     admin_id: selectedAgent.admin_id,
      //     role: role,
      //     oldPassword: passwordData.oldPassword,
      //     newPassword: passwordData.newPassword,
      //     confirmPassword: passwordData.confirmPassword
      //   },
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // );
      const response = await changeMasterPassword({
        admin_id: selectedAgent.admin_id,
        role: role,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      if (response.data.success) {
        showSuccessToast("Password updated successfully");

        // Update local state
        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        setShowPasswordModal(false);
        setSelectedAgent(null);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setShowPasswords({
          oldPassword: false,
          newPassword: false,
          confirmPassword: false
        });
      } else {
        showErrorToast(response.data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);

      if (error.response && error.response.data) {
        showErrorToast(error.response.data.message || "Failed to update password");
      } else if (error.request) {
        showErrorToast("Network error. Please check your connection.");
      } else {
        showErrorToast("Failed to update password. Please try again.");
      }
    }
  };

  const handleDepositToAgent = async () => {
    if (!selectedAgent) return;

    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      showErrorToast("Please enter a valid amount");
      return;
    }

    const depositValue = parseFloat(depositAmount);
    if (depositValue <= 0) {
      showErrorToast("Amount must be greater than 0");
      return;
    }

    try {
      const userRole = localStorage.getItem("role");

      const response = await coinsDeposit({
        amount: depositValue,
        admin_id: selectedAgent.admin_id,
        super_admin_id: selectedAgent.super_admin_id,
        role: selectedAgent.role,
        master_role: userRole
      });
      if (response.data.success) {
        showSuccessToast(`₹${depositAmount} deposited successfully to ${selectedAgent.username}`);
        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        setShowDepositModal(false);
        setSelectedAgent(null);
        setDepositAmount("");
      } else {
        // Handle insufficient balance error
        if (response.data.message === "Insufficient balance in Master Admin") {
          showErrorToast("Master Admin has insufficient balance. Please add funds to your account first.");
        } else {
          showErrorToast(response.data.message || "Failed to deposit amount");
        }
      }
    } catch (error) {
      console.error("Error depositing amount:", error);

      if (error.response) {
        if (error.response.data?.message === "Insufficient balance in Master Admin") {
          showErrorToast("Master Admin has insufficient balance. Please add funds to your account first.");
        } else {
          showErrorToast(error.response.data?.message || "Failed to deposit amount. Please try again.");
        }
      } else if (error.request) {
        showErrorToast("Network error. Please check your connection.");
      } else {
        showErrorToast("Failed to deposit amount. Please try again.");
      }
    }
  };

  const handleWithdrawFromAgent = async () => {
    if (!selectedAgent) return;

    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      showErrorToast("Please enter a valid amount");
      return;
    }

    const withdrawValue = parseFloat(withdrawAmount);
    if (withdrawValue <= 0) {
      showErrorToast("Amount must be greater than 0");
      return;
    }

    // Check agent balance
    if (withdrawValue > Number(selectedAgent.coins)) {
      showErrorToast(
        `Insufficient balance. Maximum withdrawable amount is ₹${selectedAgent.coins}`
      );
      return;
    }

    try {
      const userRole = localStorage.getItem("role");

      const response = await coinsWithdraw({
        amount: withdrawValue,
        admin_id: selectedAgent.admin_id,
        super_admin_id: selectedAgent.super_admin_id,
        role: selectedAgent.role,
        master_role: userRole
      });

      if (response.data.success) {
        showSuccessToast(
          `₹${withdrawAmount} withdrawn successfully from ${selectedAgent.username}`
        );
        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        setShowWithdrawModal(false);
        setSelectedAgent(null);
        setWithdrawAmount("");
      } else {
        showErrorToast(response.data.message || "Failed to withdraw amount");
      }
    } catch (error) {
      console.error("Error withdrawing amount:", error);

      if (error.response) {
        showErrorToast(error.response.data?.message || "Failed to withdraw amount. Please try again.");
      } else if (error.request) {
        showErrorToast("Network error. Please check your connection.");
      } else {
        showErrorToast("Failed to withdraw amount. Please try again.");
      }
    }
  };


  const handleCreateAgent = () => {
    navigate("/create-master");
  };




  const handleBack = () => {
    navigate(-1);
  };

  const handleOperationAccount = (agent) => {
    navigate(`/master_operation/${agent.admin_id}`);
  };

  const handleUpdateSuperAgent = (agent) => {
    navigate(`/Updatemaster/${agent.admin_id}`);
  };

  const handleStatementmasterlist = (agent) => {
    navigate(`/Statementmasterlist/${agent.admin_id}`);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.code !== "" || filters.name !== "";

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleMasterClick = (id, role) => {

    navigate(`/getSuperAgent-list/${id}?role=${role}`);
  };
  if (loading && agentData.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card agentmaster">
      <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
        <h5 className="card-title mb-0">Masters Lists</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={handleCreateAgent}
            >
              Create
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Search and Filter Controls */}
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="d-flex">
                <div className="input-group me-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search master..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <FiSearch />
                  </button>
                  {(searchTerm || hasActiveFilters) && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {hasActiveFilters && (
                  <div className="d-flex align-items-center">
                    <span className="badge bg-info me-2">
                      Filters Active
                    </span>
                  </div>
                )}
              </div>

              {searchTerm && (
                <div className="mt-2">
                  <small className="text-muted">
                    Search results for: <strong>"{searchTerm}"</strong>
                  </small>
                </div>
              )}
            </div>

            <div className="col-md-6">
              <div className="d-flex justify-content-end align-items-center">
                {/* Clear all filters button */}
                {hasActiveFilters && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleClearAllFilters}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th rowSpan={2} className="text-center align-middle">#</th>
                  <th rowSpan={2} className="text-center">Actions</th>

                  {/* Code */}
                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        Code
                      </span>
                    </div>
                  </th>
                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        Name
                      </span>
                    </div>
                  </th>

                  <th rowSpan={2}>Super</th>
                  <th rowSpan={2}>D.O.J</th>
                  <th rowSpan={2}>Password</th>
                  <th rowSpan={2}>OTP</th>
                  <th rowSpan={2}>Share(%)</th>
                  <th colSpan={3} className="text-center">Comm %</th>
                  <th rowSpan={2}>Chips</th>
                  {/* <th rowSpan={2}>Balance</th> */}
                  <th rowSpan={2}>Status</th>
                  {/* <th rowSpan={2}>Blocked</th> */}
                </tr>

                <tr>
                  <th>Type</th>
                  <th>Match</th>
                  <th>Session</th>
                </tr>
              </thead>

              {/* API Data Rows */}
              <tbody>
                {agentData.length > 0 ? (
                  agentData.map((row, index) => (
                    <tr key={row.id || index}>
                      <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>

                      {/* <td className="text-center position-relative">
                       
                        <div className="d-flex justify-content-center">
                          <div className="dropdown ms-2">
                            <button
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              onClick={() => toggleActionDropdown(row.id || index)}
                              aria-expanded={dropdownOpen === (row.id || index)}
                            >
                              <FiMoreVertical />
                            </button>
                            {dropdownOpen === (row.id || index) && (
                              <div
                                ref={actionDropdownRef}
                                className="dropdown-menu show"
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  zIndex: 1000,
                                  minWidth: "220px"
                                }}
                              >

                                <button
                                  className="dropdown-item text-success"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setDepositAmount("");
                                    setShowDepositModal(true);
                                  }}
                                >
                                  <FiPlusCircle className="me-2" />
                                  DEPOSIT
                                </button>

                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setWithdrawAmount("");
                                    setShowWithdrawModal(true);
                                  }}
                                >
                                  <FiMinusCircle className="me-2" />
                                  WITHDRAW
                                </button>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setWithdrawAmount("");
                                    setShowWithdrawModal(true);
                                  }}
                                >
                                  <FiMinusCircle className="me-2" />
                                  LOGIN REPORT
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleOperationAccount(row)}
                                >
                                  <FiUserCheck className="me-2" />
                                  ACCOUNT OPERATION
                                </button>
                                <div className="dropdown-divider"></div>

                                {row.active === 1 ? (
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowStatusModal(true);
                                    }}
                                  >
                                    <FiUserX className="me-2" />
                                    MAKE INACTIVE
                                  </button>
                                ) : (
                                  <button
                                    className="dropdown-item text-success"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowStatusModal(true);
                                    }}
                                  >
                                    <FiUserCheck className="me-2" />
                                    MAKE ACTIVE
                                  </button>
                                )}


                                {Number(row.is_blocked) === 1 ? (
                                  <button
                                    className="dropdown-item text-success"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowBlockModal(true);
                                    }}
                                  >
                                    <FiSlash className="me-2" />
                                    Unblock Master
                                  </button>
                                ) : (
                                  <button
                                    className="dropdown-item text-warning"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowBlockModal(true);
                                    }}
                                  >
                                    <FiSlash className="me-2" />
                                    Block Master
                                  </button>
                                )}


                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setPasswordData({
                                      oldPassword: "",
                                      newPassword: "",
                                      confirmPassword: ""
                                    });
                                    setShowPasswords({
                                      oldPassword: false,
                                      newPassword: false,
                                      confirmPassword: false
                                    });
                                    setShowPasswordModal(true);
                                  }}
                                >
                                  <FiLock className="me-2" />
                                  RESET PASSWORD
                                </button>

                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <FiTrash2 className="me-2" />
                                  Delete Master
                                </button>

                                <div className="dropdown-divider"></div>

                                {/* <button
                                  className="dropdown-item"
                                  onClick={() => handleViewDetails(row)}
                                >
                                  <FiUser className="me-2" />
                                  VIEW DETAILS
                                </button> 

                                <button
                                  className="dropdown-item"
                                  onClick={() => handleUpdateSuperAgent(row)}
                                >
                                  <FiUser className="me-2" />
                                  Edit
                                </button>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleStatementmasterlist(row)}
                                >
                                  <FiUser className="me-2" />
                                  STATEMENT
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td> */}
                      <td className="text-center">
                        <div className="dropdown ms-2 position-static">
                          <div
                            className="dropdown-toggle newtoggle"
                            type="button"
                            onClick={() => toggleActionDropdown(row.id || index)}
                            aria-expanded={dropdownOpen === (row.id || index)}
                          >
                            <FiMoreVertical />
                          </div>

                          {dropdownOpen === (row.id || index) && (
                            <ul
                              className="dropdown-menu dropdown-menu-end show"
                              style={{
                                position: "absolute",
                                transform: "translate3d(-10px, 24px, 0px)",
                                zIndex: 1055,
                                minWidth: "220px",
                              }}
                            >
                              {/* DEPOSIT */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setDepositAmount("");
                                    setShowDepositModal(true);
                                    toggleActionDropdown(null);
                                  }}
                                >
                                  <FiPlusCircle className="me-2" />
                                  DEPOSIT
                                </div>
                              </li>

                              {/* WITHDRAW */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setWithdrawAmount("");
                                    setShowWithdrawModal(true);
                                    toggleActionDropdown(null);
                                  }}
                                >
                                  <FiMinusCircle className="me-2" />
                                  WITHDRAW
                                </div>
                              </li>

                              {/* LOGIN REPORT */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    toggleActionDropdown(null);
                                  }}
                                >
                                  <FiMinusCircle className="me-2" />
                                  LOGIN REPORT
                                </div>
                              </li>

                              {/* ACCOUNT OPERATION */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => {
                                    handleOperationAccount(row);
                                    toggleActionDropdown(null);
                                  }}
                                >
                                  <FiUserCheck className="me-2" />
                                  ACCOUNT OPERATION
                                </div>
                              </li>


                              {/* ACTIVE / INACTIVE */}
                              <li>
                                {row.active === 1 ? (
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowStatusModal(true);
                                      toggleActionDropdown(null);
                                    }}
                                  >
                                    <FiUserX className="me-2" />
                                    MAKE INACTIVE
                                  </div>
                                ) : (
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowStatusModal(true);
                                      toggleActionDropdown(null);
                                    }}
                                  >
                                    <FiUserCheck className="me-2" />
                                    MAKE ACTIVE
                                  </div>
                                )}
                              </li>

                              {/* BLOCK / UNBLOCK */}
                              <li>
                                {Number(row.is_blocked) === 1 ? (
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowBlockModal(true);
                                      toggleActionDropdown(null);
                                    }}
                                  >
                                    <FiSlash className="me-2" />
                                    Unblock Master
                                  </div>
                                ) : (
                                  <div
                                    className="dropdown-item custum_new_ul "
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowBlockModal(true);
                                      toggleActionDropdown(null);
                                    }}
                                  >
                                    <FiSlash className="me-2" />
                                    Block Master
                                  </div>
                                )}
                              </li>

                              {/* RESET PASSWORD */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setPasswordData({
                                      oldPassword: "",
                                      newPassword: "",
                                      confirmPassword: "",
                                    });
                                    setShowPasswords({
                                      oldPassword: false,
                                      newPassword: false,
                                      confirmPassword: false,
                                    });
                                    setShowPasswordModal(true);
                                    toggleActionDropdown(null);
                                  }}
                                >
                                  <FiLock className="me-2" />
                                  RESET PASSWORD
                                </div>
                              </li>

                              {/* DELETE */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul "
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setShowDeleteModal(true);
                                    toggleActionDropdown(null);
                                  }}
                                >
                                  <FiTrash2 className="me-2" />
                                  Delete Master
                                </div>
                              </li>


                              {/* EDIT */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => {
                                    handleUpdateSuperAgent(row);
                                    toggleActionDropdown(null);
                                  }}
                                >
                                  <FiUser className="me-2" />
                                  Edit
                                </div>
                              </li>

                              {/* STATEMENT */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => {
                                    handleStatementmasterlist(row);
                                    toggleActionDropdown(null);
                                  }}
                                >
                                  <FiUser className="me-2" />
                                  STATEMENT
                                </div>
                              </li>
                            </ul>
                          )}
                        </div>
                      </td>

                      <td>{row.admin_id || "N/A"}</td>

                      <td className="text-center">

                        <span
                          onClick={() => handleMasterClick(row.admin_id, row.role)}
                          title="View Details"
                          className="viewdetailsbutton"
                        >
                          <FaEye />
                          {row.username || "N/A"}
                        </span>
                      </td>

                      <td className="text-center">
                        <span>{row.super_admin_id || "N/A"}</span> <br />
                        <span>{row.parent_username || "N/A"}</span>
                      </td>


                      <td className="text-center">
                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      {/* <td className="text-center">{row.password || "N/A"}</td> */}

                      <td className="text-center">
                        <div className="d-flex" style={{ width: "120px" }}>
                          <input
                            type={showPassword[row.admin_id] ? "text" : "password"}
                            className="custuminput"
                            value={row.password || ""}
                            readOnly
                            
                          />
                          <button
                            className="showhidepassword"
                            type="button"
                            onClick={() => toggleTablePasswordVisibility(row.admin_id)}
                            title={showPassword[row.admin_id] ? "Hide" : "Show"}
                          >
                            {showPassword[row.admin_id] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                          </button>
                        </div>
                      </td>

                      <td className="text-center">
                        <div className="d-flex" style={{ width: "100px" }}>
                          <input
                            type={showOTP[row.admin_id] ? "text" : "password"}
                            className="custuminput"
                            value={row.admin_otp || "0"}
                            readOnly
                            
                          />
                          <button
                            className="showhidepassword"
                            type="button"
                            onClick={() => toggleOTPVisibility(row.admin_id)}
                            title={showOTP[row.admin_id] ? "Hide" : "Show"}
                          >
                            {showOTP[row.admin_id] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                          </button>
                        </div>
                      </td>

                      {/* <td className="text-center">{row.admin_otp || "0"}</td> */}

                      <td className="text-center">{row.match_share || "0"}</td>

                      <td className="text-center">
                        {Number(row.commission_type) === "1"
                          ? "BBB"
                          : Number(row.commission_type) === "0"
                            ? "NOS"
                            : "N/A"}
                      </td>


                      <td className="text-center">{row.match_comm || "0"}</td>
                      <td className="text-center">{row.session_comm || "0"}</td>
                      <td className="text-center">
                        <div className="align-items-center justify-content-center">
                          <span className="me-2">₹{row.coins || "0"}</span>
                          <br />

                          <button
                            className="chipsbutton"
                            onClick={() => {
                              setSelectedAgent(row);
                              setDepositAmount("");
                              setShowDepositModal(true);
                            }}
                            title="Deposit Balance"
                          >
                            <FiPlusCircle size={14} />
                          </button>
                          <button
                            className="chipsbutton"
                            onClick={() => {
                              setSelectedAgent(row);
                              setWithdrawAmount("");
                              setShowWithdrawModal(true);
                            }}
                            title="Withdraw"
                          >
                            <FiMinusCircle size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        {row.active === 1 ? (
                          <span className="activebadge">Active</span>
                        ) : (
                          <span className="inactivebadge">Inactive</span>
                        )}
                      </td>

                      {/* <td className="text-center">
                        <span className={`badge ${Number(row.is_blocked) === 1 ? "bg-danger" : "bg-success"}`}>
                          {Number(row.is_blocked) === 1 ? "Blocked" : "UnBlock"}
                        </span>
                      </td> */}

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16" className="text-center text-muted">
                      {isSearching ? "Searching..." : "No agent data found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ ENHANCED PAGINATION UI */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="sohwingallentries">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                   {/* of{" "}  {totalItems} entries */}
                </div>

              <div className="paginationall d-flex align-items-center gap-1">
                {/* <div
                
                  disabled={currentPage === 1}
                  onClick={handleFirst}
                  className="px-3"
                >
                  
                </div> */}

                <button
                
                  disabled={currentPage === 1}
                  onClick={handlePrev}
                  className="px-3"
                >
                <MdOutlineKeyboardArrowLeft />

                </button>

                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <div
                      key={page}
                      className={`paginationnumber ${currentPage === page ? "active" : ""
                        }`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </div>
                  ))}
                </div>
                <button
               
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                  className="px-3"
                >
                  <MdOutlineKeyboardArrowRight/>
                </button>

                {/* <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={handleLast}
                  className="px-3"
                >
                  Last
                </Button> */}
              </div>
            </div>
          )}
        </div>

        {/* Status Change Modal */}
        {showStatusModal && selectedAgent && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Status Change</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedAgent(null);
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  <p className="mb-2">
                    <strong>Master Username:</strong> {selectedAgent.username}
                  </p>

                  <p className="mb-2">
                    <strong>Master Code:</strong>{" "}
                    {selectedAgent.code || selectedAgent.admin_id}
                  </p>

                  <p>
                    Status change to:
                    <strong>
                      {selectedAgent.active === 1 ? "Inactive" : "Active"}
                    </strong>
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedAgent(null);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleStatusChange}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Block/Unblock Modal */}
        {showBlockModal && selectedAgent && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Block / Unblock</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowBlockModal(false);
                      setSelectedAgent(null);
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  <p className="mb-2">
                    <strong>Master Username:</strong> {selectedAgent.username}
                  </p>

                  <p className="mb-2">
                    <strong>Master Code:</strong>{" "}
                    {selectedAgent.code || selectedAgent.admin_id}
                  </p>

                  <p>
                    Are you sure you want to{" "}
                    <strong>
                      {Number(selectedAgent.is_blocked) === 1 ? "unblock" : "block"}
                    </strong>{" "}
                    this master?
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowBlockModal(false);
                      setSelectedAgent(null);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className={`btn ${Number(selectedAgent.is_blocked) === 1
                      ? "btn-success"
                      : "btn-warning"
                      }`}
                    onClick={handleBlockUnblock}
                  >
                    {Number(selectedAgent.is_blocked) === 1 ? "Unblock" : "Block"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Delete Modal */}
        {showDeleteModal && selectedAgent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedAgent(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete agent{" "}
                    <strong>{selectedAgent.name}</strong> ({selectedAgent.code})?
                    <br />
                    <strong className="text-danger">This action cannot be undone.</strong>
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedAgent(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteAgent}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && selectedAgent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change Password - {selectedAgent.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setSelectedAgent(null);
                      setPasswordData({
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                      setShowPasswords({
                        oldPassword: false,
                        newPassword: false,
                        confirmPassword: false
                      });
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Old Password</label>
                    <div className="input-group">
                      <input
                        type={showPasswords.oldPassword ? "text" : "password"}
                        className="form-control"
                        value={passwordData.oldPassword}
                        onChange={(e) => handlePasswordDataChange("oldPassword", e.target.value)}
                        placeholder="Enter old password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility("oldPassword")}
                        title={showPasswords.oldPassword ? "Hide password" : "Show password"}
                      >
                        {showPasswords.oldPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                      <input
                        type={showPasswords.newPassword ? "text" : "password"}
                        className="form-control"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordDataChange("newPassword", e.target.value)}
                        placeholder="Enter new password (min. 6 characters)"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility("newPassword")}
                        title={showPasswords.newPassword ? "Hide password" : "Show password"}
                      >
                        {showPasswords.newPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                    <div className="form-text">
                      Password must be at least 6 characters long
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={showPasswords.confirmPassword ? "text" : "password"}
                        className="form-control"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordDataChange("confirmPassword", e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility("confirmPassword")}
                        title={showPasswords.confirmPassword ? "Hide password" : "Show password"}
                      >
                        {showPasswords.confirmPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Validation messages */}
                  {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                    <div className="alert alert-warning py-2">
                      <small>Password must be at least 6 characters long</small>
                    </div>
                  )}

                  {passwordData.newPassword && passwordData.confirmPassword &&
                    passwordData.newPassword !== passwordData.confirmPassword && (
                      <div className="alert alert-danger py-2">
                        <small>New password and confirm password do not match</small>
                      </div>
                    )}

                  {passwordData.newPassword && passwordData.confirmPassword &&
                    passwordData.newPassword === passwordData.confirmPassword &&
                    passwordData.newPassword.length >= 6 && (
                      <div className="alert alert-success py-2">
                        <small>Passwords match ✓</small>
                      </div>
                    )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setSelectedAgent(null);
                      setPasswordData({
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                      setShowPasswords({
                        oldPassword: false,
                        newPassword: false,
                        confirmPassword: false
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePasswordChange}
                    disabled={
                      !passwordData.oldPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword ||
                      passwordData.newPassword.length < 6 ||
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                  >
                    <FiLock className="me-2" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deposit Modal */}
        {showDepositModal && selectedAgent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Deposit</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowDepositModal(false);
                      setSelectedAgent(null);
                      setDepositAmount("");
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Deposit to agent: <strong>{selectedAgent.username}</strong>
                  </p>
                  <p className="mb-3">
                    Current Balance: <strong>₹{selectedAgent.coins}</strong>
                  </p>
                  <div className="mb-3">
                    <label className="form-label">Deposit Amount (₹)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="Enter amount to deposit"
                      min="1"
                      step="0.01"
                    />
                    <div className="form-text">
                      Enter the amount you want to deposit to this agent's account.
                    </div>
                  </div>
                  {depositAmount && !isNaN(depositAmount) && (
                    <div className="alert alert-info">
                      <strong>New Balance:</strong> ₹{(Number(selectedAgent.coins) + Number(depositAmount)).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDepositModal(false);
                      setSelectedAgent(null);
                      setDepositAmount("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleDepositToAgent}
                    disabled={!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0}
                  >
                    <FiPlusCircle className="me-2" />
                    Deposit ₹{depositAmount || 0}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && selectedAgent && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Withdraw Chips</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setSelectedAgent(null);
                      setWithdrawAmount("");
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Withdraw chips from agent: <strong>{selectedAgent.username}</strong>
                  </p>
                  <p className="mb-3">
                    Current Balance: <strong>₹{selectedAgent.coins}</strong>
                  </p>
                  <div className="mb-3">
                    <label className="form-label">Withdraw Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount to withdraw"
                      min="1"
                      step="0.01"
                      max={selectedAgent.amount}
                    />
                    <div className="form-text">
                      Maximum withdrawable amount: ₹{selectedAgent.coins}
                    </div>
                  </div>

                  {withdrawAmount && !isNaN(withdrawAmount) && (
                    <div className="alert alert-info">
                      <strong>New Balance:</strong>{" "}
                      ₹{(Number(selectedAgent.coins) - Number(withdrawAmount)).toLocaleString()}
                    </div>
                  )}

                  {withdrawAmount && Number(withdrawAmount) > Number(selectedAgent.coins) && (
                    <div className="alert alert-danger">
                      <strong>Error:</strong> Withdraw amount cannot exceed current balance
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setSelectedAgent(null);
                      setWithdrawAmount("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleWithdrawFromAgent}
                    disabled={
                      !withdrawAmount ||
                      isNaN(withdrawAmount) ||
                      Number(withdrawAmount) <= 0 ||
                      Number(withdrawAmount) > Number(selectedAgent.coins)
                    }
                  >
                    <FiMinusCircle className="me-2" />
                    Withdraw ₹{withdrawAmount || 0}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Edit Modal */}
        {showEditModal && selectedAgent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Agent</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedAgent(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Edit functionality would go here for agent: {selectedAgent.name}</p>
                  {/* Add your edit form fields here */}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedAgent(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      showSuccessToast("Agent updated successfully");
                      setShowEditModal(false);
                      setSelectedAgent(null);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default AgentMaster;