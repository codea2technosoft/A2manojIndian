import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FiSearch, FiEdit2, FiMoreVertical, FiUser, FiUserCheck,
  FiUserX, FiLock, FiTrash2, FiSlash, FiPlusCircle,
  FiMinusCircle, FiChevronLeft, FiChevronRight,
  FiChevronsLeft, FiChevronsRight, FiEye, FiEyeOff, FiCopy
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "react-bootstrap";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
function AgentMaster() {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const COPY_API_URL = process.env.REACT_APP_USER_API_URL;
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState("");
  const [itemsPerPageOptions] = useState([10, 25, 50, 100]);
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
  const superAdminRole = localStorage.getItem("role")
  const master_role = "2"
  const role = "5";
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
  const handlePrev = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchAgentData(prevPage, itemsPerPage, searchTerm, filters);
    }
  };


  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchAgentData(page, itemsPerPage, searchTerm, filters);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

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

  const fetchAgentData = async (page = currentPage, limit = itemsPerPage, search = searchTerm, filterParams = filters) => {
    try {
      setIsSearching(true);
      const requestData = {
        // master_admin_id: admin_id,
        page: page,
        limit: limit,
        role: "5",
        admin_id: adminId || null,
      };
      if (search && search.trim() !== "") {
        requestData.search = search.trim();
        setSearchTerm(search.trim());
      }
      if (filterParams.code && filterParams.code.trim() !== "") {
        requestData.code = filterParams.code.trim();
      }

      if (filterParams.name && filterParams.name.trim() !== "") {
        requestData.name = filterParams.name.trim();
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-agent-user-list`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const formattedData = response.data.data.map((agent, index) => ({
          id: agent._id,
          admin_id: agent.admin_id,
          agent_id: agent.agent_id,
          code: agent.admin_id,
          name: agent.username,
          reference: agent.reference,
          super: agent.parent_username,
          doj: new Date(agent.created_at).toLocaleDateString(),
          password: agent.password,
          admin_otp: agent.otp || "0",
          share: `${agent.match_share}%`,
          // commType: agent.commission_type === "1" ? "Flat" : "Percent",
          commType: agent.commission_type === "1" ? "BBB" :
            agent.commission_type === "0" ? "NOS" : "N/A",
          commission_type: agent.commission_type,
          commMatch: `${agent.match_comm}%`,
          commSession: `${agent.session_comm}%`,
          chips: agent.coins,
          credit: agent.credit || 0,
          status: agent.active === 1 ? "Active" : "Inactive",
          is_blocked: agent.is_blocked,
          super_agent_id: agent.super_agent_id || agent.admin_id,
          originalData: agent // Store original data for editing
        }));

        setAgentData(formattedData);
        // Update pagination info from API response
        if (response.data.pagination) {
          setPaginationData(response.data.pagination);
          setTotalItems(response.data.pagination.total_records || response.data.pagination.total);
          setTotalPages(response.data.pagination.total_pages || response.data.pagination.totalPages);
          setCurrentPage(response.data.pagination.current_page || response.data.pagination.currentPage);
          setItemsPerPage(response.data.pagination.limit || limit);
        }

        if (formattedData.length > 0) {
          // showSuccessToast(`Loaded ${formattedData.length} agents successfully`);
        } else {
          showWarningToast(response.data.message);
        }
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
      showErrorToast("Failed to load agent data. Please check your connection.");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };


  //   const fetchAdminData = async () => {
  //     try {
  //       const response = await axios.post(
  //         `${process.env.REACT_APP_API_URL}/get-agent-user-list
  //  `,
  //         {
  //           master_admin_id: admin_id,
  //           role: role,
  //           page: 1,
  //           limit: 10
  //         },
  //         {
  //           headers: {
  //             'Authorization': `Bearer ${token}`,
  //             'Content-Type': 'application/json'
  //           }
  //         }
  //       );

  //       if (response.data.success) {
  //         const adminProfile = response.data.data.admin_profile;
  //         setAdminData(adminProfile);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching admin data:", error);
  //     }
  //   };


  //  const [adminData, setAdminData] = useState({});

  // और useEffect में:
  useEffect(() => {
    fetchAgentData();
    const adminProfile = localStorage.getItem("admin_profile");
    if (adminProfile) {
      try {
        setAdminData(JSON.parse(adminProfile));
      } catch (error) {
        console.error("Error parsing admin profile:", error);
      }
    }
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


  const blockInvalidKeys = (e) => {
    const key = e.key;

    // Allowed: Only digits + backspace + tab + arrows
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

    // ❌ If key is not a digit AND not an allowed special key → block it
    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
      e.preventDefault();
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

  const toggleTablePasswordVisibility = (adminId) => {
    setShowPassword(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };


  const toggleOTPVisibility = (adminId) => {
    setShowOTP(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };

  const toggleActionDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleStatusChange = async () => {
    if (!selectedAgent) return;

    try {
      const newStatus = selectedAgent.status === "Active" ? 0 : 1;

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/update-user-status`,
        {
          admin_id: selectedAgent.admin_id,
          role: role,
          active: newStatus
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        showSuccessToast(`Agent ${newStatus === 1 ? "activated" : "deactivated"} successfully`);

        // Update local state
        setAgentData(prevData =>
          prevData.map(agent =>
            agent.id === selectedAgent.id
              ? { ...agent, status: newStatus === 1 ? "Active" : "Inactive" }
              : agent
          )
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
        `${process.env.REACT_APP_API_URL}/block-unblock-agent-user`,
        {
          admin_id: selectedAgent.admin_id,
          role: role,
          is_blocked: newBlockStatus
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success == true) {
        showSuccessToast(`Agent ${newBlockStatus == 1 ? "blocked" : "unblocked"} successfully`);

        // Update local state
        setAgentData(prevData =>
          prevData.map(agent =>
            agent.id === selectedAgent.id
              ? { ...agent, is_blocked: newBlockStatus }
              : agent
          )
        );

        setShowBlockModal(false);
        setSelectedAgent(null);
      } else {
        showErrorToast(response.data.message || "Failed to update block status");
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
        `${process.env.REACT_APP_API_URL}/delete-agent-user
 `,
        {
          admin_id: selectedAgent.admin_id,
          role: role
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
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

    // if (!passwordData.oldPassword) {
    //   showErrorToast("Please enter old password");
    //   return;
    // }

    // if (passwordData.newPassword !== passwordData.confirmPassword) {
    //   showErrorToast("New password and confirm password do not match");
    //   return;
    // }

    if (passwordData.newPassword.length < 6) {
      showErrorToast("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/change-user-password`,
        {
          admin_id: selectedAgent.admin_id,
          role: role,
          // oldPassword: selectedAgent.oldPassword,
          oldPassword: selectedAgent.password,
          newPassword: passwordData.newPassword,


          // confirmPassword: passwordData.confirmPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        showSuccessToast(response.data.message);
        setAgentData(prevData =>
          prevData.map(agent =>
            agent.id === selectedAgent.id
              ? { ...agent, password: passwordData.newPassword }
              : agent
          )
        );
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
        showErrorToast(response.data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);

      if (error.response && error.response.data) {
        console.log(error.response.data.message);
      }
    }
  };
  const handleDepositToAgent = async () => {
    if (!selectedAgent) return;

    // Validation
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
      setIsProcessing(true);
      setProcessingType("deposit");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/coins-deposit-user`,
        {
          amount: depositValue,
          admin_id: selectedAgent.admin_id,
          // master_admin_id: admin_id,
          role: role,
          // master_role: master_role,
          agent_id: selectedAgent.agent_id,
          rem_role: superAdminRole

        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        showSuccessToast(`₹${depositAmount} deposited successfully to ${selectedAgent.name}`);
        await fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        // Update local state
        setAgentData(prevData =>
          prevData.map(agent =>
            agent.id === selectedAgent.id
              ? {
                ...agent,
                chips: (Number(agent.chips) + depositValue).toString()
              }
              : agent
          )
        );

        setShowDepositModal(false);
        setSelectedAgent(null);
        setDepositAmount("");
      } else {
        if (response.data.message === "Insufficient balance in Master Admin") {
          showErrorToast("Master Admin has insufficient balance. Please add funds to your account first.");
        } else {
          showErrorToast(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error depositing amount:", error);

      if (error.response) {
        if (error.response.data && error.response.data.message === "Insufficient balance in Master Admin") {
          showErrorToast("Master Admin has insufficient balance. Please add funds to your account first.");
        } else {
          showErrorToast(error.response.data?.message || "Failed to deposit amount. Please try again.");
        }
      }
    }
    finally {
      setIsProcessing(false);
      setProcessingType("");
    }
  };

  const handleWithdrawFromAgent = async () => {
    if (!selectedAgent) return;

    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      showErrorToast("Please enter a valid amount");
      return;
    }

    const withdrawValue = parseFloat(withdrawAmount);
    if (withdrawValue > Number(selectedAgent.credit)) {
      showErrorToast(`Insufficient balance. Maximum withdrawable amount is ₹${selectedAgent.credit}`);
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingType("withdraw");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/coins-withdraw-user`,
        {
          agent_id: selectedAgent.agent_id,
          role: role,
          amount: withdrawValue,
          admin_id: selectedAgent.admin_id,
          rem_role: superAdminRole
          // master_admin_id: admin_id,
          // master_role: master_role,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        showSuccessToast(`₹${withdrawAmount} withdrawn successfully from ${selectedAgent.name}`);
        await fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        // Update local state
        setAgentData(prevData =>
          prevData.map(agent =>
            agent.id === selectedAgent.id
              ? {
                ...agent,
                chips: (Number(agent.chips) - withdrawValue).toString()
              }
              : agent
          )
        );
        setShowWithdrawModal(false);
        setSelectedAgent(null);
        setWithdrawAmount("");
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      console.error("Error withdrawing amount:", error);
      showErrorToast("Failed to withdraw amount. Please try again.");
    }
    finally {
      setIsProcessing(false);
      setProcessingType("");
    }
  };

  const handleCreateAgent = () => {
    navigate("/Clientmastermyuser");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewDetails = (agent) => {
    navigate(`/Superagentadminview/${agent.admin_id}`);
  };

  const handleUpdateSuperAgent = (agent) => {
    navigate(`/Updatesuperagentmyuser/${agent.admin_id}`);
    localStorage.setItem("super_agent_idnew", agent.agent_id);

  };
  const handleDeletedUser = () => {
    navigate("/block-users-lists");
  };
  const handleInactiveUser = () => {
    navigate("/inactive-users-lists");
  };
  const handleStatementmasterlist = (agent) => {
    navigate(`/Statementmasterlistmyuser/${agent.admin_id}`);
  };
  const handleStatementmasterlistoperation = (agent) => {
    navigate(`/Accountoperationmyuser/${agent.admin_id}`);
  };
  const handleCopyData = (agent) => {
    const textToCopy = `
USER LOGIN DETAILS
--------------------
User Code: ${agent.admin_id || "N/A"}
Password: ${agent.password || "N/A"}
Login URL:${COPY_API_URL}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showSuccessToast("USER Login details copied!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        showErrorToast("Failed to copy data");
      });
  };

  const hasActiveFilters = filters.code !== "" || filters.name !== "";

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

  if (loading) {
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
        <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0"> User Details</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={handleCreateAgent}
            >
              Create
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="d-flex">
                <div className="input-group me-2" style={{ width: "300px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search User..."
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
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={handleDeletedUser}
                  title="View Deleted Masters"
                >
                  <FiSlash className="me-1" />
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={handleInactiveUser}
                  title="View Inactive Masters"
                >
                  <FiUserX className="me-1" />
                </button>
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
                  <th rowSpan={2} className="text-center align-middle">SR.NO.</th>
                  <th rowSpan={2} className="text-center align-middle">COPY</th>
                  <th rowSpan={2} className="text-center align-middle">Action</th>
                  {/* Code */}
                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        Code
                        {filters.code && (
                          <span className="badge bg-primary ms-1">✓</span>
                        )}
                      </span>
                    </div>
                  </th>
                  {/* Name */}
                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        Name
                        {filters.name && (
                          <span className="badge bg-primary ms-1">✓</span>
                        )}
                      </span>
                    </div>
                  </th>
                  <th rowSpan={2}>Super</th>
                  <th rowSpan={2}>D.O.J</th>
                  <th rowSpan={2}>REFERENCE</th>
                  {/* <th rowSpan={2}>Password</th> */}
                  {/* <th rowSpan={2}>OTP</th> */}
                  {/* <th rowSpan={2}>Share</th> */}
                  <th colSpan={3} className="text-center">Comm %</th>
                  <th rowSpan={2}>Expo</th>
                  <th rowSpan={2}>chips</th>
                  <th rowSpan={2}>Status</th>
                  {/* <th rowSpan={2}>Blocked</th> */}
                </tr>
                <tr>
                  <th>Type</th>
                  <th>Match</th>
                  <th>Session</th>
                </tr>
              </thead>
              <tbody>
                {agentData.length > 0 ? (
                  agentData.map((row, index) => (
                    <tr key={row.id}>
                      <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="text-center">
                        <button
                          className="viewdetailsbutton"
                          onClick={() => handleCopyData(row)}
                          title="Copy User Code, OTP & Password"
                        >
                          <FiCopy size={14} />
                        </button>
                      </td>
                      <td className="text-center">
                        <div className="dropdown ms-2 position-static">
                          <div
                            className="dropdown-toggle newtoggle"
                            type="button"
                            onClick={() => toggleActionDropdown(row.id)}
                            aria-expanded={dropdownOpen === row.id}
                          >
                            <FiMoreVertical />
                          </div>
                          {dropdownOpen === row.id && (
                            <ul
                              className="dropdown-menu dropdown-menu-end show"
                              style={{
                                position: "absolute",
                                transform: "translate3d(-10px, 24px, 0px)",
                                zIndex: 1055,
                                minWidth: "220px",
                              }}
                            >
                              {/* Deposit Chips */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setDepositAmount("");
                                    setShowDepositModal(true);
                                  }}
                                >
                                  <FiPlusCircle className="me-2" />
                                  DEPOSIT
                                </div>
                              </li>
                              <li className="dropdown-item custum_new_ul"
                                onClick={() => navigate(`/Usertransaction/${row.admin_id}`)} x
                              >
                                <FiPlusCircle className="me-2" />
                                Lena Dena
                              </li>
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setWithdrawAmount("");
                                    setShowWithdrawModal(true);
                                  }}
                                >
                                  <FiMinusCircle className="me-2" />
                                  WITHDRAW
                                </div>

                              </li>
                              <li>
                                {row.status === "Active" ? (
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowStatusModal(true);
                                    }}
                                  >
                                    <FiUserX className="me-2" />
                                    INACTIVE
                                  </div>
                                ) : (
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowStatusModal(true);
                                    }}
                                  >
                                    <FiUserCheck className="me-2" />
                                    ACTIVE
                                  </div>
                                )}
                              </li>
                              <li>
                                {row.is_blocked == 1 ? (
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowBlockModal(true);
                                    }}
                                  >
                                    <FiSlash className="me-2" />
                                    UNBLOCK
                                  </div>
                                ) : (
                                  <div
                                    className="dropdown-item custum_new_ul"
                                    onClick={() => {
                                      setSelectedAgent(row);
                                      setShowBlockModal(true);
                                    }}
                                  >
                                    <FiSlash className="me-2" />
                                    BLOCK
                                  </div>
                                )}
                              </li>

                              {/* Password Change */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
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
                                  Reset Password
                                </div>
                              </li>

                              {/* Delete Agent */}
                              {/* <button
                                  className="dropdown-item text-danger"
                                  onClick={() => {
                                    setSelectedAgent(row);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  <FiTrash2 className="me-2" />
                                  DELETE AGENT
                                </button> */}


                              {/* View Details */}
                              {/* <button
                                  className="dropdown-item"
                                  onClick={() => handleViewDetails(row)}
                                >
                                  <FiUser className="me-2" />
                                  VIEW DETAILS
                                </button> */}

                              {/* Update Super Agent */}





                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => handleUpdateSuperAgent(row)}
                                >
                                  <FiUser className="me-2" />
                                  EDIT
                                </div>
                              </li>
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => handleStatementmasterlist(row)}
                                >
                                  <FiUser className="me-2" />
                                  STATEMENT
                                </div>
                              </li>
                              {/* <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                // onClick={() => handleStatementmasterlist(row)}
                                >
                                  <FiUser className="me-2" />
                                  Login Report
                                </div>
                              </li> */}
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                  onClick={() => handleStatementmasterlistoperation(row)}
                                >
                                  <FiUser className="me-2" />
                                  Account Operations
                                </div>
                              </li>
                              {/* <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                // onClick={() => handleStatementmasterlist(row)}
                                >
                                  <FiUser className="me-2" />
                                  Block Actions
                                </div>
                              </li>
                              <li>
                                <div
                                  className="dropdown-item custum_new_ul"
                                // onClick={() => handleStatementmasterlist(row)}
                                >
                                  <FiUser className="me-2" />
                                  Agent Commission Report
                                </div>
                              </li> */}
                            </ul>
                          )}
                        </div>
                      </td>
                      <td>{row.code}</td>
                      <td>{row.name}</td>
                      {/* <td className="text-center">{row.super}</td> */}
                      <td className="text-center">
                        <span>{row.originalData?.parent_username}</span>
                        <br />
                        <span>{row.originalData?.master_admin_id}</span>
                      </td>
                      {/* <td className="text-center">
  {new Date(row.originalData?.createdAt).toLocaleDateString("en-GB")}
</td> */}
                      <td className="text-center">
                        {row?.originalData?.createdAt
                          ? new Date(row.originalData.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          : "--"}
                      </td>

                      <td>{row?.reference ? row.reference : "-"}</td>

                      {/* <td className="text-center">
                        <div className="input-group input-group-sm" style={{ width: "120px" }}>
                          <input
                            type={showPassword[row.admin_id] ? "text" : "password"}
                            className="form-control form-control-sm"
                            value={row.password || ""}
                            readOnly
                            style={{ background: "white" }}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => toggleTablePasswordVisibility(row.admin_id)}
                            title={showPassword[row.admin_id] ? "Hide" : "Show"}
                          >
                            {showPassword[row.admin_id] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                          </button>
                        </div>
                      </td> */}
                      {/* <td className="text-center">
                        <div className="input-group input-group-sm" style={{ width: "100px" }}>
                          <input
                            type={showOTP[row.admin_id] ? "text" : "password"}
                            className="form-control form-control-sm"
                            value={row.admin_otp || "0"}
                            readOnly
                            style={{ background: "white" }}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => toggleOTPVisibility(row.admin_id)}
                            title={showOTP[row.admin_id] ? "Hide" : "Show"}
                          >
                            {showOTP[row.admin_id] ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                          </button>
                        </div>
                      </td> */}

                      {/* <td className="text-center">{row.share}</td> */}
                      <td className="text-center">
                        {String(row.commission_type) === "1"
                          ? "BBB"
                          : String(row.commission_type) === "0"
                            ? "NOS"
                            : "N/A"}
                      </td>



                      <td className="text-center">{row.commMatch}</td>
                      <td className="text-center">{row.commSession}</td>

                      <td
                        className="text-center text-success"
                        onClick={() => navigate("/user-exposer", { state: { user_id: row.originalData._id } })}
                      >
                        ₹{row.originalData?.exposer || "0"}
                      </td>


                      {/* <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate("/user-exposer", { state: { user_id: row.originalData?._id } })}
                      >
                        ₹{row.originalData?.exposer || "0"}
                      </button> */}

                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          {/* <span className="me-2">₹{row.credit}</span> */}
                          <span className="me-2">
                            ₹{(Number(row?.credit || 0) - Number(row?.originalData?.exposer || 0)).toFixed(2)}
                          </span>

                          <button
                            className="btn btn-sm btn-outline-success p-1 me-1"
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
                            className="btn btn-sm btn-outline-danger p-1"
                            onClick={() => {
                              setSelectedAgent(row);
                              setWithdrawAmount("");
                              setShowWithdrawModal(true);
                            }}
                            title="Withdraw Balance"
                          >
                            <FiMinusCircle size={14} />
                          </button>
                        </div>
                      </td>

                      <td className="text-center">
                        <span className={`${row.status === "Active" ? "activebadge" : "inactivebadge"}`}>
                          {row.status}
                        </span>
                      </td>
                      {/* <td className="text-center">
                        <span className={`badge ${Number(row.is_blocked) === 1 ? "bg-danger" : "bg-success"}`}>
                          {Number(row.is_blocked) === 1 ? "Blocked" : "Active"}
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
          {/* {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">





              <div className="sohwingallentries">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} entries
              </div>

              <div className="paginationall d-flex align-items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={handlePrev}
                  className="px-3"
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>

                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      // variant={currentPage === page ? "primary" : "outline-primary"}
                      className={`paginationnumber ${currentPage === page ? "active" : ""
                        }`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
                  <MdOutlineKeyboardArrowRight />
                </button>
              </div>
            </div>
          )} */}



          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="sohwingallentries d-flex align-items-center gap-3">
                {/* Items per page dropdown */}
                <div className="d-flex align-items-center gap-2">
                  <span>Show</span>
                  <select
                    className="form-select form-select-sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                      const newItemsPerPage = parseInt(e.target.value);
                      setItemsPerPage(newItemsPerPage);
                      setCurrentPage(1);
                      fetchAgentData(1, newItemsPerPage, searchTerm, filters);
                    }}
                  >
                    {itemsPerPageOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span>entries</span>
                </div>

                {/* Showing entries text */}
                <div>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} entries
                </div>
              </div>

              <div className="paginationall d-flex align-items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={handlePrev}
                  className=""
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>
                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
                  <MdOutlineKeyboardArrowRight />
                </button>
              </div>

            </div>
          )}
        </div>
        {showStatusModal && selectedAgent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                    <strong>{selectedAgent.name}</strong> ({selectedAgent.code}) to{" "}
                    <strong>{selectedAgent.status === "Active" ? "Inactive" : "Active"}</strong>?
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
        {showBlockModal && selectedAgent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                    <strong>{selectedAgent.is_blocked === 1 ? "unblock" : "block"}</strong> agent{" "}
                    <strong>{selectedAgent.name}</strong> ({selectedAgent.code})?
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
                    className={`btn ${selectedAgent.is_blocked == 1 ? "btn-success" : "btn-warning"}`}
                    onClick={handleBlockUnblock}
                  >
                    {selectedAgent.is_blocked == 1 ? "Unblock" : "Block"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
        {showPasswordModal && selectedAgent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change Password - {selectedAgent.admin_id}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setSelectedAgent(null);
                      setPasswordData({
                        oldPassword: "",
                        newPassword: "",
                        // confirmPassword: ""
                      });
                      setShowPasswords({
                        oldPassword: false,
                        newPassword: false,
                        // confirmPassword: false
                      });
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Old Password</label>
                    <div className="input-group">
                      {/* <input
                        type={showPasswords.oldPassword ? "text" : "password"}
                        className="form-control"
                        value={passwordData.oldPassword}
                        onChange={(e) => handlePasswordDataChange("oldPassword", e.target.value)}
                        placeholder="Enter old password"
                      /> */}

                      <input
                        type={showPasswords.oldPassword ? "text" : "password"}
                        className="form-control"
                        value={selectedAgent?.password || ""}
                        readOnly
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
                  {/* <div className="mb-3">
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
                  </div> */}

                  {/* Validation messages */}
                  {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                    <div className="alert alert-warning py-2">
                      <small>Password must be at least 6 characters long</small>
                    </div>
                  )}

                  {/* {passwordData.newPassword && passwordData.confirmPassword &&
                    passwordData.newPassword !== passwordData.confirmPassword && (
                      <div className="alert alert-danger py-2">
                        <small>New password and confirm password do not match</small>
                      </div>
                    )} */}

                  {/* {passwordData.newPassword && passwordData.confirmPassword &&
                    passwordData.newPassword === passwordData.confirmPassword &&
                    passwordData.newPassword.length >= 6 && (
                      <div className="alert alert-success py-2">
                        <small>Passwords match ✓</small>
                      </div>
                    )} */}

                  <div className="mt-3 p-3 border rounded" style={{ background: "#f5f5f5" }}>
                    <h6 className="fw-bold mb-2">LOGIN DETAILS</h6>
                    <div><b>Link :</b> {COPY_API_URL}</div>
                    <div><b>Username :</b> {selectedAgent?.admin_id}</div>
                    <div><b>Password :</b> {passwordData.newPassword}</div>
                  </div>
                  {/* )} */}

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
                  {/* <button
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
                  </button> */}

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePasswordChange}
                    disabled={
                      !passwordData.newPassword ||
                      passwordData.newPassword.length < 6
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

        {showDepositModal && selectedAgent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                      setIsProcessing(false);
                      setProcessingType("");
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Deposit Balance to User: <strong>{selectedAgent.name}</strong>
                  </p>
                  <p className="mb-3">
                    Current Balance: <strong>₹{selectedAgent.credit}</strong>
                  </p>
                  <div className="mb-3">
                    <label className="form-label">Deposit Amount (₹)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={depositAmount}
                      onKeyDown={blockInvalidKeys}
                      onChange={(e) => setDepositAmount(e.target.value)}

                      placeholder="Enter amount to deposit"
                      min="1"
                      step="0.01"
                    />
                    <div className="form-text">
                      Enter the amount you want to deposit to this user's account.
                    </div>
                  </div>
                  {depositAmount && !isNaN(depositAmount) && (
                    <div className="alert alert-info">
                      <strong>New Balance:</strong> ₹{(Number(selectedAgent.credit) + Number(depositAmount)).toLocaleString()}
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
                      setIsProcessing(false);
                      setProcessingType("");

                    }}
                  >
                    Cancel
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleDepositToAgent}
                    disabled={!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0}
                  >
                    <FiPlusCircle className="me-2" />
                    Deposit ₹{depositAmount || 0}
                  </button> */}

                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleDepositToAgent}
                    disabled={
                      !depositAmount ||
                      isNaN(depositAmount) ||
                      Number(depositAmount) <= 0 ||
                      (isProcessing && processingType === "deposit")
                    }
                  >
                    {isProcessing && processingType === "deposit" ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiPlusCircle className="me-2" />
                        Deposit ₹{depositAmount || 0}
                      </>
                    )}
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {showWithdrawModal && selectedAgent && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                      setIsProcessing(false);
                      setProcessingType("");

                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Withdraw Balance from User: <strong>{selectedAgent.name}</strong>
                  </p>
                  <p className="mb-3">
                    Current Balance: <strong>₹{selectedAgent.credit}</strong>
                  </p>
                  <div className="mb-3">
                    <label className="form-label">Withdraw Amount (₹)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      onKeyDown={blockInvalidKeys}
                      placeholder="Enter amount to withdraw"
                      min="1"
                      step="0.01"
                      max={selectedAgent.chips}
                    />
                    <div className="form-text">
                      Maximum withdrawable amount: ₹{selectedAgent.credit}
                    </div>
                  </div>
                  {withdrawAmount && !isNaN(withdrawAmount) && (
                    <div className="alert alert-info">
                      <strong>New Balance:</strong> ₹{(Number(selectedAgent.credit) - Number(withdrawAmount)).toLocaleString()}
                    </div>
                  )}
                  {withdrawAmount && Number(withdrawAmount) > Number(selectedAgent.credit) && (
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
                  {/* <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleWithdrawFromAgent}
                    disabled={!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > Number(selectedAgent.chips)}
                  >
                    <FiMinusCircle className="me-2" />
                    Withdraw ₹{withdrawAmount || 0}
                  </button> */}

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleWithdrawFromAgent}
                    disabled={
                      !withdrawAmount ||
                      isNaN(withdrawAmount) ||
                      Number(withdrawAmount) <= 0 ||
                      Number(withdrawAmount) > Number(selectedAgent.coins) ||
                      (isProcessing && processingType === "withdraw")
                    }
                  >
                    {isProcessing && processingType === "withdraw" ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiMinusCircle className="me-2" />
                        Withdraw ₹{withdrawAmount || 0}
                      </>
                    )}
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