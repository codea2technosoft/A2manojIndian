import { useState, useRef, useEffect } from "react";

import {
  FiSearch,
  FiEdit2,
  FiMoreVertical,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiLock,
  FiTrash2,
  FiSlash,
  FiPlusCircle,
  FiMinusCircle,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEye,
  FiEyeOff,
  FiCopy,
  MdBlock,
  FiEdit,
  FiFileText,
  FiDollarSign,
  FiActivity,
  FiSettings,
  FiShield,
  FiBarChart2,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AgentMaster() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(null);
  const [showOtp, setShowOtp] = useState(null);

  const handleClick = (row) => {
    localStorage.setItem("admin_id_new", row.admin_id);
    navigate("/AgentMasternew");
  };

  const [openFilter, setOpenFilter] = useState(null);
  const [filters, setFilters] = useState({
    code: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    rowId: null,
  });
  const [currentRowData, setCurrentRowData] = useState(null);
  const buttonRefs = useRef({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [paginationData, setPaginationData] = useState({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    limit: 10,
  });

  const admin_id = localStorage.getItem("admin_id");
  const master_role = localStorage.getItem("role");
  const role = "3";
  const token = localStorage.getItem("token");
  const dropdownRef = useRef(null);
  const actionDropdownRef = useRef(null);

  // Custom toast functions
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

  // ============================
  // PASSWORD VISIBILITY HANDLERS
  // ============================
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlePasswordDataChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================
  // PAGINATION HANDLERS
  // ============================
  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchAgentData(nextPage, itemsPerPage, searchTerm, filters);
    }
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
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = end - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // ============================
  // FETCH AGENT DATA
  // ============================
  const fetchAgentData = async (
    page = currentPage,
    limit = itemsPerPage,
    search = searchTerm,
    filterParams = filters,
  ) => {
    try {
      setIsSearching(true);

      const requestData = {
        admin_id: admin_id,
        page: page,
        limit: limit,
        role: role,
      };

      // Add search term if provided
      if (search && search.trim() !== "") {
        requestData.search = search.trim();
        setSearchTerm(search.trim());
      }

      // Add filters if provided
      if (filterParams.code && filterParams.code.trim() !== "") {
        requestData.code = filterParams.code.trim();
      }

      if (filterParams.name && filterParams.name.trim() !== "") {
        requestData.name = filterParams.name.trim();
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-user-list`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        // Map API data to match your table structure
        const formattedData = response.data.data.map((agent, index) => ({
          id: agent._id,
          admin_id: agent.admin_id,
          code: agent.admin_id,
          name: agent.username,
          master_admin_id: agent.master_admin_id,
          master_username: agent.master_username,
          parent_coins: agent.parent_coins,
          parent_username: agent.parent_username,
          reference: agent.reference,
          super: "Yes",
          doj: new Date(agent.created_at).toLocaleDateString(),
          password: agent.password,
          admin_otp: agent.admin_otp,
          share: `${agent.match_share}%`,
          commission_type: agent.commission_type == "0" ? "NOS" : "BBB",
          commMatch: `${agent.match_comm}%`,
          commSession: `${agent.session_comm}%`,
          chips: agent.coins,
          status: agent.active === 1 ? "Active" : "Inactive",
          is_blocked: agent.is_blocked,
          originalData: agent, // Store original data for editing
        }));

        setAgentData(formattedData);

        // Update pagination info from API response
        if (response.data.pagination) {
          setPaginationData(response.data.pagination);
          setTotalItems(
            response.data.pagination.total_records ||
              response.data.pagination.total,
          );
          setTotalPages(
            response.data.pagination.total_pages ||
              response.data.pagination.totalPages,
          );
          setCurrentPage(
            response.data.pagination.current_page ||
              response.data.pagination.currentPage,
          );
          setItemsPerPage(response.data.pagination.limit || limit);
        }

        if (formattedData.length > 0) {
          // showSuccessToast(`Loaded ${formattedData.length} agents successfully`);
        } else {
          // showWarningToast("No agents found with the current filters");
        }
      } else {
        showErrorToast(response.data.message || "Failed to load agent data");
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
      showErrorToast(
        "Failed to load agent data. Please check your connection.",
      );
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // ============================
  // FETCH ADMIN DATA
  // ============================
  const fetchAdminData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-user-list`,
        {
          master_admin_id: admin_id,
          role: role,
          page: 1,
          limit: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        const adminProfile = response.data.data.admin_profile;
        setAdminData(adminProfile);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    // Initialize data fetching
    fetchAdminData();
    fetchAgentData();
  }, [token]);

  // ============================
  // SEARCH & FILTER HANDLERS
  // ============================
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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ============================
  // FILTER HANDLERS
  // ============================
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

  // ============================
  // DROPDOWN HANDLERS
  // ============================
  const toggleActionDropdown = (row, event) => {
    const buttonElement = event.currentTarget;
    const rect = buttonElement.getBoundingClientRect();

    // Calculate position for dropdown (button के ठीक नीचे)
    const top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;

    // If clicking the same row, close dropdown
    if (dropdownOpen === row.id) {
      setDropdownOpen(null);
      setCurrentRowData(null);
      setDropdownPosition({ top: 0, left: 0, rowId: null });
    } else {
      setDropdownOpen(row.id);
      setCurrentRowData(row);
      setDropdownPosition({
        top: top + 5, // थोड़ा spacing नीचे
        left: left,
        rowId: row.id,
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(event.target) &&
        !event.target.closest(".dropdown-toggle.newtoggle")
      ) {
        setDropdownOpen(null);
        setCurrentRowData(null);
        setDropdownPosition({ top: 0, left: 0, rowId: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============================
  // ACTION HANDLERS
  // ============================
  const handleStatusChange = async () => {
    if (!selectedAgent) return;

    try {
      const newStatus = selectedAgent.status === "Active" ? 0 : 1;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/update-client-status`,
        {
          admin_id: selectedAgent.admin_id,
          role: role,
          active: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        showSuccessToast(
          `Agent ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
        );

        // Update local state
        setAgentData((prevData) =>
          prevData.map((agent) =>
            agent.id === selectedAgent.id
              ? { ...agent, status: newStatus === 1 ? "Active" : "Inactive" }
              : agent,
          ),
        );

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
      const newBlockStatus = selectedAgent.is_blocked == 1 ? 0 : 1;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/block-unblock-user`,
        {
          admin_id: selectedAgent.admin_id,
          role: role,
          is_blocked: newBlockStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success == true) {
        showSuccessToast(
          `Agent ${newBlockStatus == 1 ? "blocked" : "unblocked"} successfully`,
        );

        // Update local state
        setAgentData((prevData) =>
          prevData.map((agent) =>
            agent.id === selectedAgent.id
              ? { ...agent, is_blocked: newBlockStatus }
              : agent,
          ),
        );

        setShowBlockModal(false);
        setSelectedAgent(null);
      } else {
        showErrorToast(
          response.data.message || "Failed to update block status",
        );
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/delete-user`,
        {
          admin_id: selectedAgent.admin_id,
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        showSuccessToast("Agent deleted successfully");
        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        setShowDeleteModal(false);
        setSelectedAgent(null);
      } else {
        showErrorToast(response.data.message || "Failed to delete agent");
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/change-user-password-admin`,
        {
          admin_id: selectedAgent.admin_id,
          role: role,
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        showSuccessToast("Password updated successfully");

        // Update local state
        setAgentData((prevData) =>
          prevData.map((agent) =>
            agent.id === selectedAgent.id
              ? { ...agent, password: passwordData.newPassword }
              : agent,
          ),
        );

        setShowPasswordModal(false);
        setSelectedAgent(null);
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
      } else {
        showErrorToast(response.data.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);

      if (error.response && error.response.data) {
        showErrorToast(
          error.response.data.message || "Failed to update password",
        );
      } else if (error.request) {
        showErrorToast("Network error. Please check your connection.");
      } else {
        showErrorToast("Failed to update password. Please try again.");
      }
    }
  };
  const rem_role = localStorage.getItem("role");

  const handleDepositToAgent = async () => {
    if (isSubmitting) return;

    if (!selectedAgent) return;

    // Validation
    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
      showErrorToast("Please enter a valid amount");
      return;
    }

    // Additional validation for decimal amounts
    const depositValue = parseFloat(depositAmount);
    if (depositValue <= 0) {
      showErrorToast("Amount must be greater than 0");
      return;
    }

    try {
      setIsSubmitting(true); // 🔒 lock submit

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/coins-deposit`,
        {
          amount: depositValue,
          admin_id: selectedAgent.admin_id,
          master_admin_id: admin_id,
          role: role,
          rem_role: Number(rem_role),
          master_role: master_role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        showSuccessToast(
          `₹${depositAmount} deposited successfully to ${selectedAgent.name}`,
        );

        // Update local state - add deposit amount to chips
        setAgentData((prevData) =>
          prevData.map((agent) =>
            agent.id === selectedAgent.id
              ? {
                  ...agent,
                  chips: (Number(agent.chips) + depositValue).toString(),
                }
              : agent,
          ),
        );

        setShowDepositModal(false);
        setSelectedAgent(null);
        setDepositAmount("");
      } else {
        // Handle insufficient balance error
        if (response.data.message === "Insufficient balance in Master Admin") {
          showErrorToast(
            "Master Admin has insufficient balance. Please add funds to your account first.",
          );
        } else {
          showErrorToast(response.data.message || "Failed to deposit amount");
        }
      }
    } catch (error) {
      console.error("Error depositing amount:", error);

      // Handle different error scenarios
      if (error.response) {
        if (
          error.response.data &&
          error.response.data.message === "Insufficient balance in Master Admin"
        ) {
          showErrorToast(
            "Master Admin has insufficient balance. Please add funds to your account first.",
          );
        } else {
          showErrorToast(
            error.response.data?.message ||
              "Failed to deposit amount. Please try again.",
          );
        }
      } else if (error.request) {
        showErrorToast("Network error. Please check your connection.");
      } else {
        showErrorToast("Failed to deposit amount. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // 🔓 unlock submit
    }
  };
  const handleWithdrawFromAgent = async () => {
    if (isSubmitting) return;

    if (!selectedAgent) return;

    // Validation
    if (
      !withdrawAmount ||
      isNaN(withdrawAmount) ||
      Number(withdrawAmount) <= 0
    ) {
      showErrorToast("Please enter a valid amount");
      return;
    }

    // Check if agent has sufficient balance
    const withdrawValue = parseFloat(withdrawAmount);
    if (withdrawValue > Number(selectedAgent.chips)) {
      showErrorToast(
        `Insufficient balance. Maximum withdrawable amount is ₹${selectedAgent.chips}`,
      );
      return;
    }

    try {
      setIsSubmitting(true); // 🔒 lock submit

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/coins-withdraw`,
        {
          amount: withdrawValue,
          admin_id: selectedAgent.admin_id,
          master_admin_id: admin_id,
          role: role,
          rem_role: rem_role,
          master_role: master_role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        showSuccessToast(
          `₹${withdrawAmount} withdrawn successfully from ${selectedAgent.name}`,
        );

        // Update local state - subtract withdraw amount from chips
        setAgentData((prevData) =>
          prevData.map((agent) =>
            agent.id === selectedAgent.id
              ? {
                  ...agent,
                  chips: (Number(agent.chips) - withdrawValue).toString(),
                }
              : agent,
          ),
        );

        setShowWithdrawModal(false);
        setSelectedAgent(null);
        setWithdrawAmount("");
      } else {
        showErrorToast(response.data.message || "Failed to withdraw amount");
      }
    } catch (error) {
      console.error("Error withdrawing amount:", error);
      showErrorToast("Failed to withdraw amount. Please try again.");
    } finally {
      setIsSubmitting(false); // 🔓 unlock submit
    }
  };

  // ============================
  // NAVIGATION HANDLERS
  // ============================
  const handleCreateAgent = () => {
    navigate("/createagent");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewDetails = (agent) => {
    navigate(`/Superagentadminview/${agent.admin_id}`);
  };

  const handleUpdateSuperAgent = (agent) => {
    navigate(`/Updatesuperagent/${agent.admin_id}`);
  };

  const handleStatementmasterlist = (agent) => {
    navigate(`/Statementmasterlist/${agent.admin_id}`);
  };
  const handleViewClick = (agent) => {
    // Store ALL important data in localStorage
    if (agent.admin_id) {
      localStorage.setItem("superagent_admin_id", agent.admin_id);
    }
    // localStorage.setItem("ledger_type", type);
    // localStorage.setItem("current_user", JSON.stringify({
    //     username: item.username || "N/A",
    //     amount: item.amount || 0,
    //     role: item.role || 2,
    //     admin_id: item.admin_id || ""
    // }));

    // Navigate based on ledger type
    navigate(`/Superagenttransaction`);
  };
  const handleAccountoperation = (agent) => {
    navigate(`/Accountoperation/${agent.admin_id}`);
  };

  const handleCopyData = (agent) => {
    const textToCopy = `LOGIN DETAILS Super Agent
Code: panel
Link: ${process.env.REACT_APP_API_URL_link_projet}
User ID: ${agent.admin_id || "N/A"}

Password: ${agent.password || "N/A"}
OTP: ${agent.admin_otp || "N/A"}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showSuccessToast("  login details copied!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        showErrorToast("Failed to copy data");
      });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.code !== "" || filters.name !== "";

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card agentmaster">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Super Agent List</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={handleCreateAgent}>
              Create
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Search and Filter Controls */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="d-flex">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search agents..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <button
                    className="btn btn-outline-success py-1 border border-dark"
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <FiSearch className="text-dark" />
                  </button>
                  {(searchTerm || hasActiveFilters) && (
                    <button
                      className="btn btn-outline-success"
                      type="button"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {hasActiveFilters && (
                  <div className="d-flex align-items-center">
                    <span className="badge bg-info me-2">Filters Active</span>
                  </div>
                )}
              </div>

              {searchTerm && (
                <div className="mt-2">
                  {/* <small className="text-muted">
                    Search results for: <strong>"{searchTerm}"</strong>
                  </small> */}
                </div>
              )}
            </div>

            <div className="col-md-8">
              <div className="d-flex mt-2 justify-content-end gap-2 align-items-center">
                {/* Clear all filters button */}
                {hasActiveFilters && (
                  <button
                    className="refreshbutton"
                    onClick={handleClearAllFilters}
                  >
                    Clear All Filters
                  </button>
                )}

                <button
                  className="btn btn-danger btn-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/Inactivelist")}
                >
                  <FiUserX />
                </button>

                <button
                  className="btn btn-warning btn-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/Blocklist")}
                >
                  <FiLock />
                </button>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th rowSpan={2} className="text-center align-middle">
                    #
                  </th>
                  <th rowSpan={2}>copy</th>
                  <th rowSpan={2}>Actions</th>
                  <th rowSpan={2}>Code</th>
                  <th rowSpan={2}>Name</th>
                  <th rowSpan={2}>Master</th>
                  <th rowSpan={2}>Reference</th>
                  <th rowSpan={2}>D.O.J</th>
                  {/* <th rowSpan={2}>Password</th>
                  <th rowSpan={2}>Otp</th> */}
                  <th rowSpan={2}>Share</th>
                  <th colSpan={3} className="text-center">
                    Comm %
                  </th>
                  <th rowSpan={2}>Chip</th>
                  <th rowSpan={2}>Status</th>
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
                    <tr key={row.id}>
                      <td className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="text-center">
                        <button
                          className="viewdetailsbutton"
                          onClick={() => handleCopyData(row)}
                          title="Copy Agent Code, OTP & Password"
                        >
                          <FiCopy size={14} />
                        </button>
                      </td>
                      <td className="text-center">
                        <div
                          className="dropdown-toggle newtoggle"
                          style={{ cursor: "pointer", display: "inline-block" }}
                          onClick={(e) => toggleActionDropdown(row, e)}
                          ref={(el) => (buttonRefs.current[row.id] = el)}
                        >
                          <FiMoreVertical />
                        </div>
                      </td>
                      <td>{row.code}</td>
                      <td className="view_btn" onClick={() => handleClick(row)}>
                        <div>
                          <FaEye className="text-dark" />
                        </div>
                        {row.name}
                      </td>
                      <td className="text-center">
                        {row.master_admin_id}
                        <br></br>
                        {row.master_username}
                      </td>
                      <td className="text-center">{row.reference}</td>
                      <td className="text-center">{row.doj}</td>
                      {/* <td className="text-center">
                        <div className=" d-flex">
                          <span className="custuminput">
                            {showPassword === row.id ? row.password : "****"}
                          </span>
                          <span
                            className="showhidepassword"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setShowPassword(showPassword === row.id ? null : row.id)
                            }
                          >
                            {showPassword === row.id ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                      </td> */}
                      {/* <td className="text-center">
                        <div className="d-flex">
                          <span className="custuminput" style={{ minWidth: "50px" }}>
                            {showOtp === row.id ? row.admin_otp : "****"}
                          </span>
                          <span
                            className="showhidepassword"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setShowOtp(showOtp === row.id ? null : row.id)
                            }
                          >
                            {showOtp === row.id ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                      </td> */}
                      <td className="text-center">{row.share}</td>
                      <td className="text-center">{row.commission_type}</td>
                      <td className="text-center">{row.commMatch}</td>
                      <td className="text-center">{row.commSession}</td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          {/* <span className="me-2">₹{row.chips}</span> */}
                          <span className="me-2">
                            ₹{Number(row.chips).toFixed(2)}
                          </span>

                          <div
                            className="chipsbutton"
                            onClick={() => {
                              setSelectedAgent(row);
                              setDepositAmount("");
                              setShowDepositModal(true);
                            }}
                            title="Deposit Balance"
                          >
                            <FiPlusCircle size={14} />
                          </div>
                          <div
                            className="chipsbutton"
                            onClick={() => {
                              setSelectedAgent(row);
                              setWithdrawAmount("");
                              setShowWithdrawModal(true);
                            }}
                            title="Withdraw Balance"
                          >
                            <FiMinusCircle size={14} />
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${row.status === "Active" ? "activebadge" : "inactivebadge"}`}
                        >
                          {row.status}
                        </span>
                      </td>
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} entries
              </div>

              <div className="paginationall d-flex align-items-center gap-1">
                <button disabled={currentPage === 1} onClick={handlePrev}>
                  &laquo;
                </button>

                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <div
                      key={page}
                      className={`paginationnumber ${currentPage === page ? "active" : "outline-primary"}`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </div>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Dropdown Menu (Outside table but positioned at button location) */}
      {dropdownOpen && currentRowData && (
        <div
          ref={actionDropdownRef}
          className="dropdown-menu show dropdown_custom"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {/* Deposit Chips */}
          <div
            className="dropdown-item custum_new_ul"
            onClick={() => {
              setSelectedAgent(currentRowData);
              setDepositAmount("");
              setShowDepositModal(true);
              setDropdownOpen(null);
              setCurrentRowData(null);
              setDropdownPosition({ top: 0, left: 0, rowId: null });
            }}
          >
            <FiPlusCircle className="me-2" />
            Deposit
          </div>
          <div
            className="dropdown-item custum_new_ul"
            onClick={() => {
              setSelectedAgent(currentRowData);
              setWithdrawAmount("");
              setShowWithdrawModal(true);
              setDropdownOpen(null);
              setCurrentRowData(null);
              setDropdownPosition({ top: 0, left: 0, rowId: null });
            }}
          >
            <FiMinusCircle className="me-2" />
            Withdraw
          </div>

          {currentRowData.status === "Active" ? (
            <div
              className="dropdown-item custum_new_ul text-danger"
              onClick={() => {
                setSelectedAgent(currentRowData);
                setShowStatusModal(true);
                setDropdownOpen(null);
                setCurrentRowData(null);
                setDropdownPosition({ top: 0, left: 0, rowId: null });
              }}
            >
              <FiUserX className="me-2" />
              Inactive
            </div>
          ) : (
            <div
              className="dropdown-item custum_new_ul text-success"
              onClick={() => {
                setSelectedAgent(currentRowData);
                setShowStatusModal(true);
                setDropdownOpen(null);
                setCurrentRowData(null);
                setDropdownPosition({ top: 0, left: 0, rowId: null });
              }}
            >
              <FiUserCheck className="me-2" />
              Active
            </div>
          )}

          {currentRowData.is_blocked == 1 ? (
            <div
              className="dropdown-item custum_new_ul text-success"
              onClick={() => {
                setSelectedAgent(currentRowData);
                setShowBlockModal(true);
                setDropdownOpen(null);
                setCurrentRowData(null);
                setDropdownPosition({ top: 0, left: 0, rowId: null });
              }}
            >
              <FiSlash className="me-2" />
              Unblock
            </div>
          ) : (
            <div
              className="dropdown-item custum_new_ul text-warning"
              onClick={() => {
                setSelectedAgent(currentRowData);
                setShowBlockModal(true);
                setDropdownOpen(null);
                setCurrentRowData(null);
                setDropdownPosition({ top: 0, left: 0, rowId: null });
              }}
            >
              <FiSlash className="me-2" />
              Block
            </div>
          )}

          <div
            className="dropdown-item custum_new_ul"
            onClick={() => {
              setSelectedAgent(currentRowData);
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
              setDropdownOpen(null);
              setCurrentRowData(null);
              setDropdownPosition({ top: 0, left: 0, rowId: null });
            }}
          >
            <FiLock className="me-2" />
            Reset Password
          </div>

          <div
            className="dropdown-item custum_new_ul"
            onClick={() => {
              handleUpdateSuperAgent(currentRowData);
              setDropdownOpen(null);
              setCurrentRowData(null);
              setDropdownPosition({ top: 0, left: 0, rowId: null });
            }}
          >
            <FiEdit className="me-2" />
            Edit
          </div>
          <div
            className="dropdown-item custum_new_ul"
            onClick={() => {
              handleStatementmasterlist(currentRowData);
              setDropdownOpen(null);
              setCurrentRowData(null);
              setDropdownPosition({ top: 0, left: 0, rowId: null });
            }}
          >
            <FiFileText className="me-2" />
            Statement
          </div>
          <div
            className="dropdown-item custum_new_ul"
            onClick={() => {
              handleViewClick(currentRowData);
              setDropdownOpen(null);
              setCurrentRowData(null);
              setDropdownPosition({ top: 0, left: 0, rowId: null });
            }}
          >
            <FiDollarSign className="me-2" />
            Lena dena
          </div>

          <div className="dropdown-item custum_new_ul">
            <FiActivity className="me-2" />
            Login Report
          </div>
          <div
            className="dropdown-item custum_new_ul"
            onClick={() => {
              handleAccountoperation(currentRowData);
              setDropdownOpen(null);
              setCurrentRowData(null);
              setDropdownPosition({ top: 0, left: 0, rowId: null });
            }}
          >
            <FiSettings className="me-2" />
            Account Operations
          </div>
          <div className="dropdown-item custum_new_ul">
            <FiShield className="me-2" />
            Block Actions
          </div>
          <div className="dropdown-item custum_new_ul">
            <FiBarChart2 className="me-2" />
            Agent Commission Report
          </div>
        </div>
      )}

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
                <p>
                  Are you sure you want to change the status of agent{" "}
                  <strong>{selectedAgent.name}</strong> ({selectedAgent.code})
                  to{" "}
                  <strong>
                    {selectedAgent.status === "Active" ? "Inactive" : "Active"}
                  </strong>
                  ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
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
                <h5 className="modal-title">Confirm Block/Unblock</h5>
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
                <p>
                  Are you sure you want to{" "}
                  <strong>
                    {selectedAgent.is_blocked === 1 ? "unblock" : "block"}
                  </strong>{" "}
                  agent <strong>{selectedAgent.name}</strong> (
                  {selectedAgent.code})?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setShowBlockModal(false);
                    setSelectedAgent(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`${selectedAgent.is_blocked == 1 ? "submitbutton" : " refreshbutton"}`}
                  onClick={handleBlockUnblock}
                >
                  {selectedAgent.is_blocked == 1 ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAgent && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
                  <strong className="text-danger">
                    This action cannot be undone.
                  </strong>
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
        <>
          {" "}
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Change Password - {selectedAgent.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setSelectedAgent(null);
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
                        onChange={(e) =>
                          handlePasswordDataChange(
                            "oldPassword",
                            e.target.value,
                          )
                        }
                        placeholder="Enter old password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility("oldPassword")}
                        title={
                          showPasswords.oldPassword
                            ? "Hide password"
                            : "Show password"
                        }
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
                        onChange={(e) =>
                          handlePasswordDataChange(
                            "newPassword",
                            e.target.value,
                          )
                        }
                        placeholder="Enter new password (min. 6 characters)"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility("newPassword")}
                        title={
                          showPasswords.newPassword
                            ? "Hide password"
                            : "Show password"
                        }
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
                        type={
                          showPasswords.confirmPassword ? "text" : "password"
                        }
                        className="form-control"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordDataChange(
                            "confirmPassword",
                            e.target.value,
                          )
                        }
                        placeholder="Confirm new password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                        title={
                          showPasswords.confirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
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
                  {passwordData.newPassword &&
                    passwordData.newPassword.length < 6 && (
                      <div className="alert alert-warning py-2">
                        <small>
                          Password must be at least 6 characters long
                        </small>
                      </div>
                    )}

                  {passwordData.newPassword &&
                    passwordData.confirmPassword &&
                    passwordData.newPassword !==
                      passwordData.confirmPassword && (
                      <div className="alert alert-danger py-2">
                        <small>
                          New password and confirm password do not match
                        </small>
                      </div>
                    )}

                  {passwordData.newPassword &&
                    passwordData.confirmPassword &&
                    passwordData.newPassword === passwordData.confirmPassword &&
                    passwordData.newPassword.length >= 6 && (
                      <div className="alert alert-success py-2">
                        <small>Passwords match ✓</small>
                      </div>
                    )}

                  <div className="row text-uppercase fw-bold">
                    <span className="mb-1">New Password</span>
                    <div className="col-md-12">
                      <span>Current Password:</span>
                      <span className="ms-2">{selectedAgent.password}</span>
                    </div>
                    <div className="col-md-12">
                      <span>Code:</span>
                      <span className="ms-2">{selectedAgent.code}</span>
                    </div>
                    <div className="col-md-12">
                      <span>Current OTP:</span>
                      <span className="ms-2">{selectedAgent.admin_otp}</span>
                    </div>
                    <div className="col-md-12">
                      <span> Link:</span>
                      <span className="ms-2">
                        ${process.env.REACT_APP_API_URL_link_projet}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setSelectedAgent(null);
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
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-info"
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
        </>
      )}

      {/* Deposit Modal */}
      {showDepositModal && selectedAgent && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Deposit </h5>
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
                  Deposit Balance to agent:{" "}
                  <strong>{selectedAgent.name}</strong>
                </p>
                <p className="mb-3">
                  Parent Balance: <strong>₹{selectedAgent.parent_coins}</strong>
                </p>
                <p className="mb-3">
                  Current Balance: <strong>₹{selectedAgent.chips}</strong>
                </p>

                <div className="mb-3">
                  <label className="form-label">Deposit Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount to deposit"
                    min="1"
                    step="0.01"
                  />
                  <div className="form-text">
                    Enter the amount you want to deposit to this agent's
                    account.
                  </div>
                </div>
                {depositAmount && !isNaN(depositAmount) && (
                  <div className="alert alert-info">
                    <strong>New Balance:</strong> ₹
                    {(
                      Number(selectedAgent.chips) + Number(depositAmount)
                    ).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
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
                  disabled={isSubmitting}

                  // disabled={!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0}
                >
                  <FiPlusCircle className="me-2" />
                  {/* Deposit ₹{depositAmount || 0} */}
                  {isSubmitting ? "Processing..." : "Deposit"}
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
                <h5 className="modal-title">Withdraw Balance</h5>
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
                  Withdraw Balance from agent:{" "}
                  <strong>{selectedAgent.name}</strong>
                </p>
                <p className="mb-3">
                  Parent Balance: <strong>₹{selectedAgent.parent_coins}</strong>
                </p>
                <p className="mb-3">
                  Current Balance: <strong>₹{selectedAgent.chips}</strong>
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
                    max={selectedAgent.chips}
                  />
                  <div className="form-text">
                    Maximum withdrawable amount: ₹{selectedAgent.chips}
                  </div>
                </div>
                {withdrawAmount && !isNaN(withdrawAmount) && (
                  <div className="alert alert-info">
                    <strong>New Balance:</strong> ₹
                    {(
                      Number(selectedAgent.chips) - Number(withdrawAmount)
                    ).toLocaleString()}
                  </div>
                )}
                {withdrawAmount &&
                  Number(withdrawAmount) > Number(selectedAgent.chips) && (
                    <div className="alert alert-danger">
                      <strong>Error:</strong> Withdraw amount cannot exceed
                      current balance
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
                    Number(withdrawAmount) > Number(selectedAgent.chips)
                  }
                >
                  <FiMinusCircle className="me-2" />
                  {/* Withdraw ₹{withdrawAmount || 0} */}
                  {isSubmitting ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedAgent && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
                <p>
                  Edit functionality would go here for agent:{" "}
                  {selectedAgent.name}
                </p>
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
