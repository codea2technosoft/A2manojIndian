import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  FiEdit,
} from "react-icons/fi";

// ✅ YEH SAHI TARIKA HAI - FaUnlockAlt ko fa se import karo
import { FaFileAlt, FaLock, FaUnlock, FaUnlockAlt } from "react-icons/fa";

import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FaCogs } from "react-icons/fa";
import Loader from "../Common/Loader";
import { FaRectangleList } from "react-icons/fa6";
import { toggleUserClientBetBlockUnblock } from "../Server/api";

function AgentMaster() {
  const navigate = useNavigate();
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState("");
  const [itemsPerPageOptions] = useState([10, 20, 30, 40, 50]);
  const [showOTP, setShowOTP] = useState({});
  const [showPassword, setShowPassword] = useState({});
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
    limit: 50,
  });
  const [open, setOpen] = useState(false);
  const { adminId } = useParams();
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
  const superAdminRole = localStorage.getItem("role");
  const master_role = "2";
  const role = "5";
  const token = localStorage.getItem("token");
  const dropdownRef = useRef(null);
  const actionDropdownRef = useRef(null);

  // const settingButtons = [
  //   {
  //     title: "User Settings",
  //     path: "/user-setting",
  //     className: "gradient-9",
  //   },
  //   {
  //     title: "Casino Settings",
  //     path: "/casino-setting",
  //     className: "gradient-1",
  //   },
  //   {
  //     title: "iCasino Settings",
  //     path: "/icasino-setting",
  //     className: "gradient-2",
  //   },
  //   {
  //     title: "Sport Settings",
  //     path: "/sport-setting",
  //     className: "gradient-3",
  //   },
  // ];
  const getSettingButtons = (adminId) => [
    {
      title: "User Settings",
      path: `/user-setting/${adminId}`,
      className: "gradient-9",
    },
    {
      title: "Casino Settings",
      path: `/casino-setting/${adminId}`,
      className: "gradient-1",
    },
    {
      title: "iCasino Settings",
      path: `/icasino-setting/${adminId}`,
      className: "gradient-2",
    },
    {
      title: "Sport Settings",
      path: `/sport-setting/${adminId}`,
      className: "gradient-3",
    },
  ];
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

  const handleOperationAccount = (agent) => {
    navigate(`/master_operation/${agent.admin_id}`);
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

  const fetchAgentData = async (
    page = currentPage,
    limit = itemsPerPage,
    search = searchTerm,
    filterParams = filters,
  ) => {
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        // const formattedData = response.data.data.map((agent, index) => ({
        //   id: agent._id,
        //   admin_id: agent.admin_id,
        //   agent_id: agent.agent_id,
        //   code: agent.admin_id,
        //   name: agent.username,
        //   reference: agent.reference,
        //   super: agent.parent_username,
        //   doj: new Date(agent.created_at).toLocaleDateString(),
        //   password: agent.password,
        //   admin_otp: agent.otp || "0",
        //   share: `${agent.match_share}%`,
        //   // commType: agent.commission_type === "1" ? "Flat" : "Percent",
        //   commType:
        //     agent.commission_type === "1"
        //       ? "BBB"
        //       : agent.commission_type === "0"
        //         ? "NOS"
        //         : "N/A",
        //   commission_type: agent.commission_type,
        //   commMatch: `${agent.match_comm}%`,
        //   commSession: `${agent.session_comm}%`,
        //   chips: agent.coins,
        //   credit: agent.credit || 0,
        //   status: agent.active === 1 ? "Active" : "Inactive",
        //   is_blocked: agent.is_blocked,
        //   super_agent_id: agent.super_agent_id || agent.admin_id,
        //   originalData: agent, // Store original data for editing
        // }));

        const formattedData = response.data.data.map((agent, index) => ({
          id: agent._id,
          admin_id: agent.admin_id,
          bet_block: agent.bet_block || 0,
          agent_id: agent.agent_id,
          code: agent.admin_id,
          name: agent.username,
          username: agent.username,
          reference: agent.reference,
          super:
            agent.parent_username ||
            agent.super_agent_username ||
            agent.super_username,
          doj: new Date(agent.created_at).toLocaleDateString(),
          password: agent.password,
          admin_otp: agent.otp || "0",
          share: `${agent.match_share}`,
          commType:
            agent.commission_type === "1"
              ? "BBB"
              : agent.commission_type === "0"
                ? "NOS"
                : "N/A",
          commission_type: agent.commission_type,
          commMatch: `${agent.match_comm}`,
          commSession: `${agent.session_comm}`,
          chips: agent.coins || agent.credit || 0,
          credit: agent.credit || 0,
          coins: agent.coins || agent.credit || 0, // ✅ ADD - Balance ke liye
          total_amount: agent.total_amount || 0, // ✅ ADD - P/L ke liye
          credit_ref: agent.reference || "-", // ✅ ADD - Credit Ref ke liye
          exposer: agent.exposer || "-", // ✅ ADD - Exposer ke liye
          master_admin_id:
            agent.master_admin_id ||
            agent.agent_id ||
            agent.super_agent_id ||
            "-", // ✅ ADD - UP-Line ke liye
          status: agent.active === 1 ? "Active" : "Inactive",
          is_blocked: agent.is_blocked,
          super_agent_id: agent.super_agent_id || agent.admin_id,
          originalData: agent,
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
          showWarningToast(response.data.message);
        }
      } else {
        showErrorToast(response.data.message);
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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const blockInvalidKeys = (e) => {
    const key = e.key;

    // Allowed: Only digits + backspace + tab + arrows
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];

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
    setShowPassword((prev) => ({
      ...prev,
      [adminId]: !prev[adminId],
    }));
  };

  const toggleOTPVisibility = (adminId) => {
    setShowOTP((prev) => ({
      ...prev,
      [adminId]: !prev[adminId],
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
        // showSuccessToast(
        //   `Agent ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
        // );
        showSuccessToast(response.data.message);

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
        `${process.env.REACT_APP_API_URL}/block-unblock-agent-user`,
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
        // showSuccessToast(
        //   `Agent ${newBlockStatus == 1 ? "blocked" : "unblocked"} successfully`,
        // );
        showSuccessToast(response.data.message);

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
        `${process.env.REACT_APP_API_URL}/delete-agent-user
 `,
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
        // showSuccessToast("Agent deleted successfully");
        showSuccessToast(response.data.message);
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
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        showSuccessToast(response.data.message);
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
          rem_role: superAdminRole,
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
          `${depositAmount} deposited successfully to ${selectedAgent.name}`,
        );
        await fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
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
        if (response.data.message === "Insufficient balance in Master Admin") {
          showErrorToast(
            "Master Admin has insufficient balance. Please add funds to your account first.",
          );
        } else {
          showErrorToast(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error depositing amount:", error);

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
      }
    } finally {
      setIsProcessing(false);
      setProcessingType("");
    }
  };

  const handleWithdrawFromAgent = async () => {
    if (!selectedAgent) return;

    if (
      !withdrawAmount ||
      isNaN(withdrawAmount) ||
      Number(withdrawAmount) <= 0
    ) {
      showErrorToast("Please enter a valid amount");
      return;
    }

    const withdrawValue = parseFloat(withdrawAmount);
    if (withdrawValue > Number(selectedAgent.credit)) {
      showErrorToast(
        `Insufficient balance. Maximum withdrawable amount is ${selectedAgent.credit}`,
      );
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
          rem_role: superAdminRole,
          // master_admin_id: admin_id,
          // master_role: master_role,
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
          `${withdrawAmount} withdrawn successfully from ${selectedAgent.name}`,
        );
        await fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        // Update local state
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
        showErrorToast(response.data.message);
      }
    } catch (error) {
      console.error("Error withdrawing amount:", error);
      showErrorToast("Failed to withdraw amount. Please try again.");
    } finally {
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
    navigate(`/Mastermyuser/Superagentadminview/${agent.admin_id}`);
  };

  const handleUpdateSuperAgent = (agent) => {
    navigate(`/Mastermyuser/update-myuser/${agent.admin_id}`);
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
    navigator.clipboard
      .writeText(textToCopy)
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
    fetchAgentData();
  }, [token, adminId]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
      if (
        actionDropdownRef.current &&
        !actionDropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Bet Block/Unblock Handler
  const handleBetToggle = async (row) => {
    try {
      const newBetBlock = row.bet_block === 1 ? 0 : 1;
      const actionText = newBetBlock === 1 ? "OPEN" : "LOCK";
      const actionText2 = newBetBlock === 1 ? "open" : "lock";

      // ✅ SweetAlert Confirmation
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `You want to ${actionText2} bet for ${row.username || row.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: `Yes, ${actionText} it!`,
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      const payload = {
        admin_id: row.admin_id,
        bet_block: newBetBlock,
      };

      const response = await toggleUserClientBetBlockUnblock(
        row.admin_id,
        payload,
      );

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Bet ${actionText2}ed successfully for ${row.username || row.name}`,
          timer: 1500,
          showConfirmButton: false,
        });

        // Update local state
        setAgentData((prevData) =>
          prevData.map((agent) =>
            agent.id === row.id ? { ...agent, bet_block: newBetBlock } : agent,
          ),
        );
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed!",
          text: response.data.message || "Failed to update bet status",
        });
      }
    } catch (error) {
      console.error("Error toggling bet lock:", error);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update bet status. Please try again.",
      });
    }
  };

  return (
    <>
      <div className="card agentmaster">
        {/* <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0"> User Details</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={handleCreateAgent}>
              Create
            </button>
          </div>
        </div> */}

        <div className="card-body">
          <div className="row mb-1">
            <div className="col-md-6">
              <div className="d-flex">
                <div className="input-group me-2" style={{ width: "500px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search User..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <button
                    className="btn btn-warning"
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
                    <span className="badge bg-info me-2">Filters Active</span>
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
            {/* <div className="col-md-6">
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
                <select
                  className="form-select form-select-sm me-2"
                  style={{ width: "90px" }}
                  value={itemsPerPage}
                  onChange={(e) => {
                    const newItemsPerPage = parseInt(e.target.value);
                    setItemsPerPage(newItemsPerPage);
                    setCurrentPage(1);
                    fetchAgentData(1, newItemsPerPage, searchTerm, filters);
                  }}
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {hasActiveFilters && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleClearAllFilters}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>  */}
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th rowSpan={2} className="text-center align-middle">
                    SR.NO.
                  </th>
                  {/* Name */}
                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        Username
                        {filters.name && (
                          <span className="badge bg-primary ms-1">✓</span>
                        )}
                      </span>
                    </div>
                  </th>
                  <th rowSpan={2} className="text-center align-middle">
                    COPY
                  </th>
                  {/* <th rowSpan={2} className="text-center align-middle">
                    Action
                  </th> */}
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

                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Credit Ref</span>
                    </div>
                  </th>

                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Balance</span>
                    </div>
                  </th>

                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>P/L</span>
                    </div>
                  </th>

                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Exposer</span>
                    </div>
                  </th>

                  {/* <th rowSpan={2}>Super</th>
                  <th rowSpan={2}>D.O.J</th>
                  <th rowSpan={2}>REFERENCE</th> */}
                  {/* <th rowSpan={2}>Password</th> */}
                  {/* <th rowSpan={2}>OTP</th> */}
                  <th rowSpan={2}>Client(%) Share</th>
                  <th rowSpan={2}>UP-Line</th>
                  {/* <th rowSpan={2}>Share</th> */}
                  {/* <th colSpan={3} className="text-center">
                    Comm %
                  </th>
                  <th rowSpan={2}>Expo</th>
                  <th rowSpan={2}>chips</th> */}
                  <th rowSpan={2}>Status</th>
                  <th rowSpan={2}>Bet</th>
                  <th rowSpan={2}>Options</th>
                  {/* <th rowSpan={2}>Blocked</th> */}
                </tr>
                {/* <tr>
                  <th>Type</th>
                  <th>Match</th>
                  <th>Session</th>
                </tr> */}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="13">
                      <div className="d-flex justify-content-center align-items-center py-5 table_loader">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : agentData.length > 0 ? (
                  agentData.map((row, index) => (
                    <tr key={row.id}>
                      <td className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td>
                        <span className="badge badge-warning me-1">C</span>
                        {row.name}
                        <br />
                        <span>
                          [
                          {(() => {
                            const name = row.username || row.name || "";
                            const firstWord = name.split(" ")[0];
                            return firstWord.length > 10
                              ? firstWord.substring(0, 10)
                              : firstWord;
                          })()}
                          ]
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="viewdetailsbutton"
                          onClick={() => handleCopyData(row)}
                          title="Copy User Code, OTP & Password"
                        >
                          <FiCopy size={14} />
                        </button>
                      </td>
                      {/* <td className="text-center">
                        <div className="dropdown ms-2 position-static"> */}
                      {/* <div
                            className="dropdown-toggle newtoggle"
                            type="button"
                            onClick={() => toggleActionDropdown(row.id)}
                            aria-expanded={dropdownOpen === row.id}
                          >
                            <FiMoreVertical />
                          </div> */}
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
                              Deposit
                            </div>
                          </li>
                          <li>
                            <div
                              className="dropdown-item custum_new_ul"
                              onClick={() =>
                                navigate(`/Usertransaction/${row.admin_id}`)
                              }
                              x
                            >
                              <FiPlusCircle className="me-2" />
                              Lena Dena
                            </div>
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
                              Withdraw
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
                                Inactive
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
                                Active
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
                                Unblock
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
                                Block
                              </div>
                            )}
                          </li>

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
                              Edit
                            </div>
                          </li>
                          <li>
                            <div
                              className="dropdown-item custum_new_ul"
                              onClick={() => handleStatementmasterlist(row)}
                            >
                              <FaFileAlt className="me-2" />
                              Statement
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
                              onClick={() =>
                                handleStatementmasterlistoperation(row)
                              }
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
                      {/* </div>
                      </td> */}
                      {/* <td>{row.code}</td> */}

                      {/* <td className="text-center">{row.super}</td> */}

                      {/* <td className="text-center">
                        <span>{row.originalData?.parent_username}</span>
                        <br />
                        <span>{row.originalData?.master_admin_id}</span>
                      </td> */}
                      <td>{row.admin_id || "N/A"}</td>
                      <td>{row.credit_ref || "-"}</td>
                      {/* <td>{row.coins || "-"}</td> */}
                      <td>{row.coins != null ? Number(row.coins).toFixed(2) : "-"}</td>
                      {/* <td>{row.total_amount || "-"}</td> */}
                      <td>{row.total_amount != null ? Number(row.total_amount).toFixed(2) : "-"}</td>
                      {/* <td>{Number(row.exposer).toFixed(2) || "-"}</td>*/}
                      <td>
                        {row.exposer != null && !isNaN(Number(row.exposer))
                          ? Number(row.exposer).toFixed(2)
                          : "-"}
                      </td>
                      {/* <td className="text-center">
  {new Date(row.originalData?.createdAt).toLocaleDateString("en-GB")}
</td> */}
                      {/* <td className="text-center">
                        {row?.originalData?.createdAt
                          ? new Date(row.originalData.createdAt).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )
                          : "--"}
                      </td>

                      <td>{row?.reference ? row.reference : "-"}</td> */}

                      <td className="text-center">{row.share}</td>


                      {/* <td className="text-center">{row.master_admin_id}</td> */}

                      <td className="text-center">
                        {row.master_admin_id && row.master_admin_id !== "-" && row.master_admin_id !== "" ? (
                          row.master_admin_id?.startsWith("SM") ? (
                            <span className="clickable"
                              onClick={() => navigate(`/AgentMasternew/${row.master_admin_id}`)}
                            >
                              {row.master_admin_id}
                            </span>
                          ) : row.master_admin_id?.startsWith("MA") ? (
                            <span className="clickable"
                              onClick={() => navigate(`/Mastermyuser/${row.master_admin_id}`)}
                            >
                              {row.master_admin_id}
                            </span>
                          ) : (
                            row.master_admin_id
                          )
                        ) : (
                          "admin"
                        )}
                      </td>

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
                      {/* <td className="text-center">
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
                        onClick={() =>
                          navigate("/user-exposer", {
                            state: { user_id: row.originalData._id },
                          })
                        }
                      >
                        {Number(row.originalData?.exposer || 0).toFixed(2)}
                      </td> */}

                      {/* <button
                        className="btn btn-sm btn-primary"
                        onClick={() => navigate("/user-exposer", { state: { user_id: row.originalData?._id } })}
                      >
                        {row.originalData?.exposer || "0"}
                      </button> */}

                      {/* <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center"> */}
                      {/* <span className="me-2">{row.credit}</span> */}
                      {/* <div className="me-2 w-50">

                            {(
                              Number(row?.credit || 0) -
                              Number(row?.originalData?.exposer || 0)
                            ).toFixed(2)}
                          </div> */}

                      {/* <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-success"
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
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                setSelectedAgent(row);
                                setWithdrawAmount("");
                                setShowWithdrawModal(true);
                              }}
                              title="Withdraw Balance"
                            >
                              <FiMinusCircle size={14} />
                            </button>
                          </div> */}
                      {/* </div>
                      </td> */}

                      <td className="text-center">
                        <span
                          onClick={() => {
                            setSelectedAgent(row);
                            setShowStatusModal(true);
                          }}
                          title={
                            // row.status === "Active"
                            //   ? "Lock User"
                            //   : "Unlock User"
                            row.status ? "Inactive" : "Active"

                          }
                        >
                          {row.status === "Active" ? (
                            <FaUnlock className="text-success" />
                          ) : (
                            <FaLock className="text-danger" />
                          )}
                        </span>
                      </td>

                      {/* <td className="text-center">
                        <span
                          onClick={() => {
                            setSelectedAgent(row);
                            setShowStatusModal(true);
                          }}
                          title={
                            row.status === "Active"
                              ? "Lock User"
                              : "Unlock User"
                          }
                        >
                          {row.status === "Active" ? (
                            <FaUnlock className="text-success" />
                          ) : (
                            <FaLock className="text-danger" />
                          )}
                        </span>
                      </td> */}

                      <td className="text-center">
                        <span
                          onClick={() => handleBetToggle(row)}
                          style={{ cursor: "pointer" }}
                          title={
                            row.bet_block === 0
                              ? "Click to Block Bet"
                              : "Click to Unblock Bet"
                          }
                        >
                          {row.bet_block === 0 ? (
                            <FaUnlockAlt
                              className="lock_button text-success"
                              title="Bet Open"
                            />
                          ) : (
                            <FaLock
                              className="lock_button text-danger"
                              title="Bet Locked"
                            />
                          )}
                        </span>
                      </td>
                      {/* <td className="text-center">
                        <span className={`badge ${Number(row.is_blocked) === 1 ? "bg-danger" : "bg-success"}`}>
                          {Number(row.is_blocked) === 1 ? "Blocked" : "Active"}
                        </span>
                      </td> */}

                      <td className="text-center">
                        <div className="d-flex gap-1 justify-content-center">
                          <button
                            className="btn btn-warning btn-sm gradient-9 btn-rounded "
                            onClick={() => handleUpdateSuperAgent(row)}
                            title="EDIT PROFILE"
                          >
                            <FiEdit />
                          </button>

                          <button
                            className="btn gradient-10 btn-rounded"
                            onClick={() => {
                              setSelectedAgent(row);
                              setDepositAmount("");
                              setShowDepositModal(true);
                            }}
                            title=" DEPOSIT"
                          >
                            <span>D</span>
                            {/* <FiPlusCircle /> */}
                          </button>

                          <button
                            className="btn gradient-2 btn-rounded"
                            onClick={() => {
                              setSelectedAgent(row);
                              setWithdrawAmount("");
                              setShowWithdrawModal(true);
                            }}
                            title="WITHDRAW"
                          >
                            <span>W</span>
                            {/* <FiMinusCircle /> */}
                          </button>

                          <button
                            className="btn gradient-6 btn-rounded"
                            onClick={() => {
                              setSelectedAgent(row);
                              setPasswordData({
                                oldPassword: "",
                                newPassword: "",
                              });
                              setShowPasswordModal(true);
                            }}
                            title="RESET PASSWORD"
                          >
                            <span>P</span>
                            {/* <FiLock /> */}
                          </button>

                          {/* <button
                            className="btn gradient-8 btn-rounded"
                            onClick={() => {
                              setShowReportModal(true);
                            }}
                            title="REPORTS"
                          >
                            <span>R</span>
                          </button>

                          <button
                            className="btn gradient-4 btn-rounded"
                            onClick={() => {
                              setShowSettingModal(true);
                            }}
                            title="SETTINGS"
                          >
                            <FaCogs />
                          </button> */}

                          <button
                            className="btn gradient-8 btn-rounded"
                            onClick={() => {
                              setSelectedAgent(row); // ✅ YEH ADD KARO
                              setShowReportModal(true);
                            }}
                            title="REPORTS"
                          >
                            <span>R</span>
                          </button>

                          <button
                            className="btn gradient-4 btn-rounded"
                            onClick={() => {
                              setSelectedAgent(row); // ✅ YEH ADD KARO
                              setShowSettingModal(true);
                            }}
                            title="SETTINGS"
                          >
                            <FaCogs />
                          </button>

                          {/* <button
                            className="btn btn-success btn-sm  btn-rounded"
                            onClick={() =>
                              navigate(`/master-transaction/${row.admin_id}`)
                            }
                            title="Lena Dena"
                          >
                            <FiPlusCircle />
                          </button>

                          <button
                            className="btn gradient-6  btn-rounded"
                            onClick={() => handleOperationAccount(row)}
                            title=" Account Operation"
                          >
                            <FiUserCheck />
                          </button> */}

                          {/* <button
                            className={`btn btn-rounded btn-sm ${row.active ? "btn-danger" : "btn-success"}`}
                            onClick={() => {
                              setSelectedAgent(row);
                              setShowStatusModal(true);
                            }}
                            title={row.active ? "Inactive" : "Active"}
                            title="Inactive"
                          >
                            {row.active ? (
                              <>
                                <FiUserX />
                              </>
                            ) : (
                              <>
                                <FiUserCheck />
                              </>
                            )}
                          </button> */}

                          {/* <button
                            className={`btn btn-sm btn-rounded ${Number(row.is_blocked)
                              ? "btn-success"
                              : "btn-danger"
                              }`}
                            onClick={() => {
                              setSelectedAgent(row);
                              setShowBlockModal(true);
                            }}
                            title={Number(row.is_blocked) ? "Unblock" : "Block"}
                          >
                            <FiSlash />
                          </button>

                          <button
                            className="btn gradient-4 btn-rounded"
                            onClick={() => handleStatementmasterlist(row)}
                            title="Statement"
                          >
                            <FaFileAlt />
                          </button>*/}

                          <button
                            className="buttoncommon gradient-8"
                            onClick={handleInactiveUser}
                            title="Inactive Users"
                          >
                            <FaRectangleList />
                          </button>

                          <button
                            className={`btn btn-sm btn-rounded ${Number(row.is_blocked)
                              ? "btn-success"
                              : "btn-danger"
                              }`}
                            onClick={() => {
                              setSelectedAgent(row);
                              setShowBlockModal(true);
                            }}
                            title={Number(row.is_blocked) ? "Unblock" : "Block"}
                          >
                            <FiSlash />
                          </button>
                        </div>
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

          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <div className="paginationall d-flex align-items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={handlePrev}
                  className="d-flex justify-content-center align-items-center gap-1"
                >
                  <MdKeyboardDoubleArrowLeft />
                  Previous
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
                  className="d-flex justify-content-center align-items-center gap-1"
                >
                  Next <MdKeyboardDoubleArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>

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
                      {selectedAgent.status === "Active"
                        ? "Inactive"
                        : "Active"}
                    </strong>
                    ?
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => {
                      setShowStatusModal(false);
                      setSelectedAgent(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-theme"
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
                    <strong>{selectedAgent.name}</strong> ({selectedAgent.code}
                    )?
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
        {/* {showPasswordModal && selectedAgent && (
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

                  <div className="mt-3 p-3 border rounded" style={{ background: "#f5f5f5" }}>
                    <h6 className="fw-bold mb-2">LOGIN DETAILS</h6>
                    <div><b>Link :</b> {COPY_API_URL}</div>
                    <div><b>Username :</b> {selectedAgent?.admin_id}</div>
                    <div><b>Password :</b> {passwordData.newPassword}</div>
                  </div>
           

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
        )} */}
        {showPasswordModal && selectedAgent && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {/* Reset Password - {selectedAgent.admin_id} */}
                    Reset Password
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
                    }}
                  />
                </div>
                <div className="modal-body">
                  {/* Dummy inputs to prevent auto-fill */}
                  <input type="text" style={{ display: "none" }} />
                  <input type="password" style={{ display: "none" }} />

                  {/* Old Password - Backend value */}
                  <div className="mb-3">
                    <label className="form-label">Old Password</label>
                    <div className="input-group">
                      <input
                        type={showPasswords.oldPassword ? "text" : "password"}
                        className="form-control"
                        value={selectedAgent.password}
                        disabled
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility("oldPassword")}
                      >
                        {showPasswords.oldPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                    <small className="text-muted">Current password</small>
                  </div>
                  <div>
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                      <input
                        type={showPasswords.newPassword ? "text" : "password"}
                        className="form-control"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password (min. 6 characters)"
                        autoComplete="new-password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => togglePasswordVisibility("newPassword")}
                      >
                        {showPasswords.newPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-theme"
                    onClick={handlePasswordChange}
                    disabled={
                      !passwordData.newPassword ||
                      passwordData.newPassword.length < 6
                    }
                  >
                    Reset Password
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDepositModal && selectedAgent && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Deposit to {selectedAgent.name}
                  </h5>
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
                  {/* <p>
                    Deposit Balance to User :{" "}
                    <strong>{selectedAgent.name}</strong>
                  </p>
                  <p className="mb-3">
                    Current Balance: <strong>{selectedAgent.credit}</strong>
                  </p> */}
                  <div className="mb-3">
                    <label className="form-label text-uppercase">
                      Available Amount
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAgent.credit}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="form-label">Deposit Amount</label>
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
                    {/* <div className="form-text">
                      Enter the amount you want to deposit to this user's
                      account.
                    </div> */}
                  </div>
                  {depositAmount && !isNaN(depositAmount) && (
                    <div className="alert alert-info mt-2">
                      <strong>New Balance:</strong>
                      {(
                        Number(selectedAgent.credit) + Number(depositAmount)
                      ).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-theme"
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiPlusCircle className="me-2" />
                        Deposit {depositAmount || 0}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark"
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
                    Deposit {depositAmount || 0}
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        )}

        {showWithdrawModal && selectedAgent && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Withdraw from {selectedAgent.name}
                  </h5>
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
                  {/* <p>
                    Withdraw Balance from User :{" "}
                    <strong>{selectedAgent.name}</strong>
                  </p>
                  <p className="mb-3">
                    Current Balance: <strong>{selectedAgent.credit}</strong>
                  </p> */}
                  <div className="mb-3">
                    <label className="form-label text-uppercase">
                      Available Amount
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAgent.credit}
                      disabled
                    />
                  </div>
                  <div>
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="form-label text-uppercase">
                        Withdraw Amount{" "}
                      </label>
                      <div className="text-muted remaining text-uppercase">
                        Remaining balance :
                        {(
                          Number(selectedAgent.credit) - Number(withdrawAmount)
                        ).toLocaleString()}
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      onKeyDown={blockInvalidKeys}
                      placeholder="Enter amount to withdraw"
                      min="1"
                      step="0.01"
                      max={selectedAgent.credit}
                    />
                    {/* <div className="form-text">
                      Maximum withdrawable amount: {selectedAgent.credit}
                    </div> */}
                  </div>
                  {/* {withdrawAmount && !isNaN(withdrawAmount) && (
                    <div className="alert alert-info mt-2">
                      <strong>New Balance:</strong>
                      {(
                        Number(selectedAgent.credit) - Number(withdrawAmount)
                      ).toLocaleString()}
                    </div>
                  )} */}
                  {withdrawAmount &&
                    Number(withdrawAmount) > Number(selectedAgent.credit) && (
                      <div className="alert alert-danger mt-2">
                        <strong>Error:</strong> Withdraw amount cannot exceed
                        current balance
                      </div>
                    )}
                </div>
                <div className="modal-footer">
                  {/* <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleWithdrawFromAgent}
                    disabled={!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > Number(selectedAgent.chips)}
                  >
                    <FiMinusCircle className="me-2" />
                    Withdraw {withdrawAmount || 0}
                  </button> */}

                  <button
                    type="button"
                    className="btn btn-theme"
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
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiMinusCircle className="me-2" />
                        Withdraw {withdrawAmount || 0}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setSelectedAgent(null);
                      setWithdrawAmount("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedAgent(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
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

        {showReportModal && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reports</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowReportModal(false)}
                  ></button>
                </div>

                <div className="modal-body modal_buttons">
                  <div className="row g-1">
                    <div className="col-6">
                      <Link
                        to={
                          selectedAgent?.admin_id
                            ? `/reports/settlement-report/${selectedAgent.admin_id}`
                            : `/reports/settlement-report`
                        }
                        className="btn gradient-1 w-100"
                      >
                        Settlement Report
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link
                        to={
                          selectedAgent?.admin_id
                            ? `/reports/account-statement/${selectedAgent.admin_id}`
                            : `/reports/account-statement`
                        }
                        className="btn gradient-2 w-100"
                      >
                        Account Statement
                      </Link>
                    </div>

                    <div className="col-6">
                      <Link
                        to={
                          selectedAgent?.admin_id
                            ? `/reports/chip-statement/${selectedAgent.admin_id}`
                            : `/reports/chip-statement`
                        }
                        className="btn gradient-3 w-100"
                      >
                        Chip Statement
                      </Link>
                    </div>

                    <div className="col-6">
                      <Link
                        to={
                          selectedAgent?.admin_id
                            ? `/reports/chip-summary/${selectedAgent.admin_id}`
                            : `/reports/chip-summary`
                        }
                        className="btn gradient-4 w-100"
                      >
                        Chip Summary
                      </Link>
                    </div>

                    <div className="col-6">
                      <Link
                        to={
                          selectedAgent?.admin_id
                            ? `/reports/profit-loss/${selectedAgent.admin_id}`
                            : `/reports/profit-loss`
                        }
                        className="btn gradient-5 w-100"
                      >
                        Profit Loss
                      </Link>
                    </div>

                    <div className="col-6">
                      <Link
                        to={
                          selectedAgent?.admin_id
                            ? `/reports/sport-summary-report/${selectedAgent.admin_id}`
                            : `/reports/sport-summary-report`
                        }
                        className="btn gradient-6 w-100"
                      >
                        Sports Profit Loss
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link
                        to={
                          selectedAgent?.admin_id
                            ? `/reports/bet-history-details/${selectedAgent.admin_id}`
                            : `/reports/bet-history-details`
                        }
                        className="btn gradient-7 w-100"
                      >
                        Bets History
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link
                        to={
                          selectedAgent?.admin_id
                            ? `/reports/pending-bet-history/${selectedAgent.admin_id}`
                            : `/reports/pending-bet-history`
                        }
                        className="btn gradient-8 w-100"
                      >
                        Pending Bets
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* {showSettingModal && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Settings</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowSettingModal(false)}
                  />
                </div>

                <div className="modal-body modal_buttons">
                  <div className="row g-1">
                    {settingButtons.map((item, index) => (
                      <div className="col-6" key={index}>
                        <Link
                          to={`${item.path}/${adminId}`}
                          className={`btn ${item.className} w-100`}
                          onClick={() => setShowSettingModal(false)}
                        >
                          {item.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )} */}
        {showSettingModal && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Settings - {selectedAgent?.username || selectedAgent?.name}
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowSettingModal(false)}
                  />
                </div>

                <div className="modal-body modal_buttons">
                  <div className="row g-1">
                    <div className="col-6">
                      <Link
                        to={`/user-setting/${selectedAgent?.admin_id}`}
                        className="btn gradient-9 w-100"
                        onClick={() => setShowSettingModal(false)}
                      >
                        User Settings
                      </Link>
                    </div>

                    {/* <div className="col-6">
                      <Link
                        to={`/casino-setting/${selectedAgent?.admin_id}`}
                        className="btn gradient-1 w-100"
                        onClick={() => setShowSettingModal(false)}
                      >
                        Casino Settings
                      </Link>
                    </div> */}

                    {/* <div className="col-6">
                      <Link
                        to={`#`}
                        className="btn gradient-2 w-100"
                        onClick={() => setShowSettingModal(false)}
                      >
                        iCasino Settings
                      </Link>
                    </div> */}

                    <div className="col-6">
                      <Link
                        to={`/sport-setting/${selectedAgent?.admin_id}`}
                        className="btn gradient-3 w-100"
                        onClick={() => setShowSettingModal(false)}
                      >
                        Sport Settings
                      </Link>
                    </div>
                  </div>
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
