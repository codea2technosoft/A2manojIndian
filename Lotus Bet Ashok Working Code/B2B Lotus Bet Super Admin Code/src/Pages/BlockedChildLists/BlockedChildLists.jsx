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
  FiPlus,
} from "react-icons/fi";
import Swal from "sweetalert2";
import {
  FaCogs,
  FaEye,
  FaLock,
  FaPlus,
  FaRegEdit,
  FaUnlockAlt,
} from "react-icons/fa";
import { useNavigate, Link, useParams } from "react-router-dom";
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
import {
  getBlockedChildList,
  updateClientStatus,
  blockUnblockMaster,
  changeMasterPassword,
  // coinsDeposit,
  // coinsWithdraw,
  toggleUserBetLock,
  toggleUserBetBlockUnblock,
  toggleUserClientBetBlockUnblock,
  commonCoinDeposit,
  commonCoinWithdraw,
} from "../../Server/api";
import { CgFileDocument, CgUnblock } from "react-icons/cg";
import { FaRectangleList } from "react-icons/fa6";
import Loader from "../../Common/Loader";

function BlockedChildLists() {
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [processingType, setProcessingType] = useState("");
  const [showOTP, setShowOTP] = useState({});

  const [optionMenu, setOptionMenu] = useState(null);

  const toggleOptionMenu = (id) => {
    setOptionMenu(optionMenu === id ? null : id);
  };
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
    // api_limit:50
    // limit: 1
  });
  const [open, setOpen] = useState(false);
  const COPY_API_URL = process.env.REACT_APP_COPY_API_URL;
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
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const toggleTablePasswordVisibility = (adminId) => {
    setShowPassword((prev) => ({
      ...prev,
      [adminId]: !prev[adminId],
    }));
  };

  const handlePasswordDataChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
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
    setShowOTP((prev) => ({
      ...prev,
      [adminId]: !prev[adminId],
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

  const { adminId } = useParams();
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

  // const fetchAgentData = async (
  //   page = 1,
  //   limit = itemsPerPage,
  //   search = "",
  //   filterData = {},
  // ) => {
  //   try {
  //     setIsSearching(true);
  //     setLoading(true);
  //     const payload = {
  //       admin_id: admin_id, // Changed from master_admin_id to admin_id
  //       page: page,
  //       limit: limit,
  //       search: search || "", // Make sure search is always sent
  //       // Remove role and other filter fields if they're not needed
  //     };

  //     console.log("Payload being sent:", payload); // For debugging

  //     const response = await getBlockedChildList(payload);
  //     if (response.data.success) {
  //       const data = response.data;
  //       setAgentData(data.data || []);
  //       setTotalItems(data.pagination?.total_records || 0);
  //       setTotalPages(data.pagination?.total_pages || 1);
  //       setCurrentPage(data.pagination?.current_page || page);
  //       setSearchTerm(search);
  //       setPaginationData({
  //         total_records: data.pagination?.total_records || 0,
  //         total_pages: data.pagination?.total_pages || 1,
  //         current_page: data.pagination?.current_page || page,
  //         limit: limit,
  //       });
  //     } else {
  //       setAgentData([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching agent data:", error);
  //     setAgentData([]);
  //   } finally {
  //     setLoading(false);
  //     setIsSearching(false);
  //   }
  // };
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

  const fetchAgentData = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    filterData = {},
  ) => {
    try {
      setIsSearching(true);
      setLoading(true);
      const payload = {
        admin_id: admin_id,
        page: page,
        limit: limit,
        search: search || "",
      };

      const response = await getBlockedChildList(payload);
      if (response.data.success) {
        const data = response.data;

        // ✅ _id ko preserve karo, id nahi
        const formattedData = data.data.map((agent) => ({
          ...agent,
          _id: agent._id, // ✅ IMPORTANT: _id preserve karo
          bet_block: agent.bet_block || 0,
          coins: agent.coins || agent.amount || 0,
          total_amount: agent.total_amount || 0,
          credit_ref: agent.reference || "-",
          exposer: agent.exposer || 0,
          master_admin_id:
            agent.master_admin_id ||
            agent.super_agent_id ||
            agent.super_admin_id ||
            "-",
          match_share: agent.match_share || 0,
          admin_otp: agent.admin_otp || agent.otp || "N/A",
          role: agent.role || "N/A",
          active: agent.active || 0,
          parent_username:
            agent.parent_username ||
            agent.super_agent_username ||
            agent.super_username ||
            "N/A",
          username: agent.username || agent.name || "N/A",
          password: agent.password || "N/A",
          admin_id: agent.admin_id || "N/A",
          created_at:
            agent.created_at || agent.createdAt || new Date().toISOString(),
          is_blocked: agent.is_blocked || 0,
        }));

        setAgentData(formattedData);
        setTotalItems(data.pagination?.total_records || 0);
        setTotalPages(data.pagination?.total_pages || 1);
        setCurrentPage(data.pagination?.current_page || page);
        setSearchTerm(search);
        setPaginationData({
          total_records: data.pagination?.total_records || 0,
          total_pages: data.pagination?.total_pages || 1,
          current_page: data.pagination?.current_page || page,
          limit: limit,
        });
      } else {
        setAgentData([]);
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
      setAgentData([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAgentData(1, itemsPerPage, "", {});
    }
  }, [token, itemsPerPage]);

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

  // const handleStatusChange = async () => {
  //   if (!selectedAgent) return;

  //   try {
  //     const newStatus = selectedAgent.active === 1 ? 0 : 1;

  //     const response = await updateClientStatus(
  //       selectedAgent.admin_id,
  //       role,
  //       newStatus,
  //     );

  //     if (response.data.success) {
  //       showSuccessToast(
  //         `Agent ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
  //       );

  //       fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
  //       setShowStatusModal(false);
  //       setSelectedAgent(null);
  //     } else {
  //       // showErrorToast(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating agent status:", error);
  //     // showErrorToast("Failed to update agent status. Please try again.");
  //   }
  // };

  // const handleBlockUnblock = async () => {
  //   if (!selectedAgent) return;

  //   try {
  //     const currentBlock = Number(selectedAgent.is_blocked);
  //     const newBlockStatus = currentBlock === 1 ? 0 : 1;

  //     const response = await blockUnblockMaster(
  //       selectedAgent.admin_id,
  //       role,
  //       newBlockStatus,
  //     );
  //     console.log("resposne", response);
  //     if (response.data.success) {
  //       showSuccessToast(
  //         `Agent ${newBlockStatus === 1 ? "blocked" : "unblocked"} successfully`,
  //       );

  //       fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
  //       setShowBlockModal(false);
  //       setSelectedAgent(null);
  //     } else {
  //       // showErrorToast(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating block status:", error);
  //     // showErrorToast("Failed to update block status. Please try again.");
  //   }
  // };

  // const handleDeleteAgent = async () => {
  //   if (!selectedAgent) return;

  //   try {
  //     showWarningToast("Deleting agent...");

  //     const response = await deleteMaster(selectedAgent.admin_id, role);
  //     if (response.data.success) {
  //       showSuccessToast("Agent deleted successfully");
  //       fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
  //       setShowDeleteModal(false);
  //       setSelectedAgent(null);
  //     } else {
  //       showErrorToast(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting agent:", error);
  //     showErrorToast("Failed to delete agent. Please try again.");
  //   }
  // };

  const handleStatusChange = async () => {
    if (!selectedAgent) return;

    try {
      const newStatus = selectedAgent.active === 1 ? 0 : 1;

      const response = await updateClientStatus(
        selectedAgent.admin_id,
        role,
        newStatus,
      );

      if (response.data.success) {
        // showSuccessToast(
        //   `Agent ${newStatus === 1 ? "activated" : "deactivated"} successfully`,
        // );
        showSuccessToast(response.data.message);

        // ✅ FIX: _id se match karo, sirf wahi row update ho
        setAgentData((prevData) =>
          prevData.map((agent) =>
            agent._id === selectedAgent._id
              ? { ...agent, active: newStatus }
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
  // const handleBlockUnblock = async () => {
  //   if (!selectedAgent) return;

  //   try {
  //     const currentBlock = Number(selectedAgent.is_blocked);
  //     const newBlockStatus = currentBlock === 1 ? 0 : 1;

  //     // Call the API with proper parameters
  //     const response = await blockUnblockMaster(
  //       selectedAgent.admin_id, // admin_id
  //       String(selectedAgent.role), // role (as string)
  //       newBlockStatus, // is_blocked (0 or 1)
  //     );

  //     console.log("Block/Unblock Response:", response);
  //     if (response.data.success) {
  //       showSuccessToast(
  //         `User ${newBlockStatus === 1 ? "blocked" : "unblocked"} successfully`,
  //       );

  //       // Refresh the data
  //       fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
  //       setShowBlockModal(false);
  //       setSelectedAgent(null);
  //     } else {
  //       showErrorToast(
  //         response.data.message || "Failed to update block status",
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error updating block status:", error);
  //     showErrorToast("Failed to update block status. Please try again.");
  //   }
  // };

  const handleBlockUnblock = async () => {
    if (!selectedAgent) return;

    try {
      const currentBlock = Number(selectedAgent.is_blocked);
      const newBlockStatus = currentBlock === 1 ? 0 : 1;

      const response = await blockUnblockMaster(
        selectedAgent.admin_id,
        String(selectedAgent.role),
        newBlockStatus,
      );

      console.log("Block/Unblock Response:", response);
      if (response.data.success) {
        // showSuccessToast(
        //   `User ${newBlockStatus === 1 ? "blocked" : "unblocked"} successfully`,
        // );
        showSuccessToast(response.data.message);

        // ✅ FIX: _id se match karo, sirf wahi row update ho
        setAgentData((prevData) =>
          prevData.map((agent) =>
            agent._id === selectedAgent._id
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

  const handlePasswordChange = async () => {
    if (!selectedAgent) return;

    // Validation
    // if (!passwordData.oldPassword) {
    //   // showErrorToast("Please enter old password");
    //   return;
    // }

    // if (passwordData.newPassword !== passwordData.confirmPassword) {
    //   // showErrorToast("New password and confirm password do not match");
    //   return;
    // }

    if (passwordData.newPassword.length < 6) {
      // showErrorToast("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await changeMasterPassword({
        admin_id: selectedAgent.admin_id,
        role: role,
        oldPassword: selectedAgent.password,
        newPassword: passwordData.newPassword,
        // confirmPassword: passwordData.confirmPassword
      });

      if (response.data.success) {
        // showSuccessToast("Password updated successfully");

        // Update local state
        showSuccessToast(response.data.message);
        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
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
      }
      //  else {
      //   showErrorToast(response.data.message || "Failed to update password");
      // }
    } catch (error) {
      console.error("Error updating password:", error);

      if (error.response && error.response.data) {
        // showErrorToast(error.response.data.message || "Failed to update password");
      } else if (error.request) {
        // showErrorToast("Network error. Please check your connection.");
      } else {
        // showErrorToast("Failed to update password. Please try again.");
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
      setIsProcessing(true);
      setProcessingType("deposit");
      const userRole = localStorage.getItem("role");

      const response = await commonCoinDeposit({
        // amount: depositValue,
        // admin_id: selectedAgent.admin_id,
        // super_admin_id: selectedAgent.super_admin_id,
        // role: selectedAgent.role,
        // master_role: userRole,
        // rem_role: superAdminRole,

        amount: depositValue,
        to_admin_id: selectedAgent.admin_id,
        from_admin_id: selectedAgent.super_admin_id,
        from_role: localStorage.getItem("role"),
        to_role: selectedAgent.originalData?.role,
        remark: `Deposit to ${selectedAgent.username}`,
      });
      if (response.data.success) {
        showSuccessToast(
          `${depositAmount} deposited successfully to ${selectedAgent.username}`,
        );
        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
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
          showErrorToast(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error depositing amount:", error);
      if (error.response) {
        if (
          error.response.data?.message ===
          "Insufficient balance in Master Admin"
        ) {
          showErrorToast(
            "Master Admin has insufficient balance. Please add funds to your account first.",
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
    if (withdrawValue <= 0) {
      showErrorToast("Amount must be greater than 0");
      return;
    }

    // Check agent balance
    if (withdrawValue > Number(selectedAgent.coins)) {
      showErrorToast(
        `Insufficient balance. Maximum withdrawable amount is ${selectedAgent.coins}`,
      );
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingType("withdraw");

      const userRole = localStorage.getItem("role");

      const response = await commonCoinWithdraw({
        // amount: withdrawValue,
        // admin_id: selectedAgent.admin_id,
        // super_admin_id: selectedAgent.super_admin_id,
        // role: selectedAgent.role,
        // master_role: userRole,
        // rem_role: superAdminRole,

        amount: withdrawValue,
        admin_id: selectedAgent.admin_id,
        from_admin_id: selectedAgent.admin_id,
        to_admin_id: selectedAgent.super_admin_id,
        from_role: selectedAgent.originalData?.role?.toString(),
        to_role: localStorage.getItem("role"),
        remark: `Withdraw from ${selectedAgent.username}`,
      });

      if (response.data.success) {
        showSuccessToast(
          `${withdrawAmount} withdrawn successfully from ${selectedAgent.username}`,
        );
        fetchAgentData(currentPage, itemsPerPage, searchTerm, filters);
        setShowWithdrawModal(false);
        setSelectedAgent(null);
        setWithdrawAmount("");
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      console.error("Error withdrawing amount:", error);

      // if (error.response) {
      //   showErrorToast(error.response.data?.message);
      // }
    } finally {
      setIsProcessing(false);
      setProcessingType("");
    }
  };

  const handleCreateAgent = () => {
    navigate("/create-master");
  };

  const handleBlookMastersList = () => {
    navigate("/master-blocked-list");
  };

  const handleInactiveMasters = () => {
    navigate("/InActive-master-list");
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
  // const handleMasterClick = (id, role) => {

  //   navigate(`/getSuperAgent-list/${id}?role=${role}`);
  // };

  const handleMasterClick = (row) => {
    // localStorage.setItem("admin_id_new", row.admin_id);
    navigate(`/agent_lists/${row.admin_id}`);
  };

  // const handleCopyData = (agent) => {
  //   const textToCopy = `MASTER LOGIN DETAILS\nMaster Code: ${agent.admin_id || "N/A"}\nPassword: ${agent.password || "N/A"}\nOTP: ${agent.admin_otp || "N/A"}`;

  //   navigator.clipboard.writeText(textToCopy)
  //     .then(() => {
  //       showSuccessToast("Master login details copied!");
  //     })
  //     .catch((err) => {
  //       console.error("Failed to copy: ", err);

  //     });
  // };

  const handleCopyData = (agent) => {
    const textToCopy = `
    MASTER LOGIN DETAILS
    --------------------
    Master Code: ${agent?.admin_id || "N/A"}
    Password: ${agent?.password || "N/A"}
    OTP: ${agent?.admin_otp || "N/A"}
    Login URL: ${COPY_API_URL}
    `;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showSuccessToast("Master login details copied!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  //    const handleCopyData = (agent) => {
  //     const textToCopy = `LOGIN DETAILS Super Agent
  // Code: panel
  // Link: ${process.env.REACT_APP_API_URL_link_projet}
  // User ID: ${agent.admin_id || "N/A"}

  // Password: ${agent.password || "N/A"}
  // OTP: ${agent.admin_otp || "N/A"}`;

  //     navigator.clipboard.writeText(textToCopy)
  //       .then(() => {
  //         showSuccessToast("  login details copied!");
  //       })
  //       .catch((err) => {
  //         console.error("Failed to copy: ", err);
  //         showErrorToast("Failed to copy data");
  //       });
  //   };

  const handleLimitChange = (e) => {
    const value = Number(e.target.value);
    setItemsPerPage(value);
  };

  // Bet Block/Unblock Handler - API selection based on admin_id prefix
  // Bet Block/Unblock Handler - API selection based on admin_id prefix
  // Bet Block/Unblock Handler - API selection based on admin_id prefix
  // Bet Block/Unblock Handler - API selection based on admin_id prefix
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

      let response;

      // ✅ Check admin_id prefix to decide which API to call
      if (row.admin_id?.startsWith("SM") || row.admin_id?.startsWith("MA")) {
        response = await toggleUserBetBlockUnblock(row.admin_id, payload);
      } else if (row.admin_id?.startsWith("US")) {
        response = await toggleUserClientBetBlockUnblock(row.admin_id, payload);
      } else {
        response = await toggleUserClientBetBlockUnblock(row.admin_id, payload);
      }

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Bet ${actionText2}ed successfully for ${row.username || row.name}`,
          timer: 1500,
          showConfirmButton: false,
        });

        // ✅ FIX: _id se compare karo, id se nahi
        setAgentData((prevData) =>
          prevData.map((agent) =>
            agent._id === row._id
              ? { ...agent, bet_block: newBetBlock }
              : agent,
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

  return (
    <>
      <div className="card agentmaster">
        {/* <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Masters Lists</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={handleCreateAgent}>
              Create
            </button>
            <button className="btn btn-outline-light" onClick={handleBack}>
              Back
            </button>
          </div>
        </div> */}

        <div className="card-body">
          {/* Search and Filter Controls */}
          <div className="row mb-1">
            <div className="col-md-6">
              <div className="d-flex">
                <div className="input-group me-2" style={{ width: "500px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Blocked Super master, Master and User..."
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
                  onClick={handleBlookMastersList}
                  title="View Block Masters"
                >
                  <FiSlash className="me-1" />
                </button>

                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={handleInactiveMasters}
                  title="View Inactive Masters"
                >
                  <FiUserX className="me-1" />
                </button>
                <select
                  className="form-select form-select-sm me-2"
                  style={{ width: "90px" }}
                  value={itemsPerPage}
                  onChange={handleLimitChange}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="40">40</option>
                  <option value="50">50</option>
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
            </div> */}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th rowSpan={2} className="text-center align-middle">
                    Sr.No.
                  </th>
                  <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Username</span>
                    </div>
                  </th>
                  {/* <th rowSpan={2} className="text-center align-middle">
                    Copy
                  </th> */}
                  <th rowSpan={2}>CREDIT REF</th>
                  {/* <th rowSpan={2} className="text-center">
                    Actions
                  </th> */}
                  <th rowSpan={2}>BALANCE</th>
                  <th rowSpan={2}>P/L</th>
                  {/* <th rowSpan={2}>EXPOSURE</th> */}
                  <th rowSpan={2}>CLIENT SHARE</th>
                  <th rowSpan={2}>UP-LINE</th>
                  {/* Code */}
                  {/* <th rowSpan={2} className="position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Code</span>
                    </div>
                  </th>

                  <th rowSpan={2}>Super</th>
                  <th rowSpan={2}>D.O.J</th>
                  <th rowSpan={2}>REFERENCE</th> */}

                  {/* <th rowSpan={2}>Password</th>
                  <th rowSpan={2}>OTP</th> */}
                  {/* <th rowSpan={2}>Share(%)</th> */}
                  {/* <th colSpan={3} className="text-center">
                    Comm %
                  </th> */}
                  {/* <th rowSpan={2}>Chips</th> */}
                  {/* <th rowSpan={2}>Balance</th> */}
                  <th rowSpan={2}>Status</th>
                  <th rowSpan={2}>Bet</th>
                  <th rowSpan={2}>Options</th>
                </tr>

                {/* <tr>
                  <th>Type</th>
                  <th>Match</th>
                  <th>Session</th>
                </tr> */}
              </thead>

              {/* API Data Rows */}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11">
                      <div className="d-flex justify-content-center align-items-center py-5 table_loader">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : agentData.length > 0 ? (
                  [...agentData]
                    .sort((a, b) => {
                      const getPriority = (adminId) => {
                        if (adminId?.startsWith("SM")) return 1;
                        if (adminId?.startsWith("MA")) return 2;
                        if (adminId?.startsWith("US")) return 3;
                        return 2;
                      };

                      return getPriority(a.admin_id) - getPriority(b.admin_id);
                    }).map((row, index) => (
                    <tr key={row.id || index}>
                      <td className="text-center">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      <td>
                        <div
                          onClick={() => handleMasterClick(row)}
                          className="text-green"
                        >
                          <span className="badge badge-warning me-1">
                            {row.admin_id
                              ? row.admin_id.charAt(0).toUpperCase() === "A"
                                ? "C"
                                : row.admin_id.charAt(0).toUpperCase()
                              : "-"}
                          </span>
                          {row.username || row.name}
                        </div>

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

                      {/* <td className="text-center">
                        <button
                          className="viewdetailsbutton"
                          onClick={() => handleCopyData(row)}
                          title="Copy Master Code, OTP & Password"
                        >
                          <FiCopy size={14} />
                        </button>
                      </td> */}
                      <td>{row.admin_id || "N/A"}</td>

                      <td>{row.coins || "0"}</td>
                      <td>
                        {row.total_amount !== undefined
                          ? `${row.total_amount.toFixed(2)}`
                          : "0"}
                      </td>

                      {/* <td>0</td> */}
                      <td>{row.match_share || "0"}</td>

                      <td>
                        {row.parent_username ||
                          row.super_username ||
                          row.super_admin_id ||
                          "N/A"}
                      </td>

                      {/* <td>{row.admin_id || "N/A"}</td> */}

                      {/* <td className="text-center">

                        <span
                          onClick={() => handleMasterClick(row.admin_id, row.role)}
                          title="View Details"
                          className="viewdetailsbutton"
                        >
                          <FaEye />
                          {row.username || "N/A"}
                        </span>
                      </td> */}

                      {/* <td className="text-center">
                        <span>{row.super_admin_id || "N/A"}</span> <br />
                        <span>{row.parent_username || "N/A"}</span>
                      </td>
                      <td className="text-center">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{row?.reference ? row.reference : "-"}</td> */}
                      {/* <td className="text-center">{row.password || "N/A"}</td> */}

                      {/* <td className="text-center">
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
              </td> */}

                      {/* <td className="text-center">{row.admin_otp || "0"}</td> */}

                      {/* <td className="text-center">
                        {String(row.commission_type) === "1"
                          ? "BBB"
                          : String(row.commission_type) === "0"
                            ? "NOS"
                            : "N/A"}
                      </td>

                      <td className="text-center">{row.match_comm || "0"}</td>
                      <td className="text-center">{row.session_comm || "0"}</td> */}

                      <td className="text-center">
                        <span
                          onClick={() => {
                            setSelectedAgent(row);
                            setShowStatusModal(true);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {row.active == 0 ? (
                            <FaLock className="text-danger" title="Inactive" />
                          ) : (
                            <FaUnlockAlt
                              className="text-success"
                              title="Active"
                            />
                          )}
                        </span>
                      </td>

                      {/* <td className="text-center">
                        <span
                          onClick={() => {
                            setSelectedAgent(row);
                            setShowStatusModal(true);
                          }}
                          title={row.active ? "Inactive" : "Active"}
                        >

                          {row.status ? (
                            <>
                              <FaLock className="text-danger" />
                            </>
                          ) : (
                            <>
                              <FaUnlockAlt className="text-success" />
                            </>
                          )}
                        </span>
                      </td> */}

                      <td className="text-center">
                        <span
                          onClick={() => handleBetToggle(row)}
                          style={{ cursor: "pointer" }}
                          title={
                            row.bet_block === 1
                              ? "Click to Block Bet"
                              : "Click to Unblock Bet"
                          }
                        >
                          {row.bet_block === 1 ? (
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
                          {Number(row.is_blocked) === 1 ? "Blocked" : "UnBlock"}
                        </span>
                      </td> */}

                      <td className="text-start">
                        <div className="d-flex gap-1 justify-content-start">
                          {/* <div className="position-relative d-inline-block">
                            <button
                              className="buttoncommon gradient-7"
                              onClick={() => toggleOptionMenu(row.admin_id)}
                            >
                              <FaPlus />
                            </button>

                            {optionMenu === row.admin_id && (
                              <div
                                className="dropdown-menu show"
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  right: 0,
                                  zIndex: 9999,
                                }}
                              >
                                <button
                                  className="dropdown-item"
                                  onClick={() => {
                                    const selectedAdminId = row.admin_id;
                                    navigate(
                                      `/CreateSuperAgent/${selectedAdminId}`,
                                    );
                                    setOptionMenu(null);
                                  }}
                                >
                                  Master
                                </button>
                              </div>
                            )}
                          </div> */}

                          <div className="position-relative d-inline-block">
                            {/* ✅ Plus Button - US ke liye hide, baaki sab ke liye show */}
                            {!row.admin_id?.startsWith("US") && (
                              <button
                                className="buttoncommon gradient-7"
                                onClick={() => toggleOptionMenu(row.admin_id)}
                              >
                                <FaPlus />
                              </button>
                            )}

                            {/* ✅ Dropdown Menu with Conditions - No Fallback */}
                            {optionMenu === row.admin_id && (
                              <div
                                className="dropdown-menu show"
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  right: 0,
                                  zIndex: 9999,
                                  backgroundColor: "#ffffff",
                                  border: "1px solid #dee2e6",
                                  borderRadius: "4px",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  minWidth: "160px",
                                  padding: "4px 0",
                                  display: "block",
                                }}
                              >
                                {/* ✅ CONDITION 1: SM (Super Master) → Master Button */}
                                {row.admin_id?.startsWith("SM") && (
                                  <button
                                    className="dropdown-item"
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      padding: "8px 16px",
                                      clear: "both",
                                      fontWeight: "400",
                                      color: "#212529",
                                      textAlign: "left",
                                      textDecoration: "none",
                                      backgroundColor: "transparent",
                                      border: "0",
                                      cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor =
                                        "#f8f9fa";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor =
                                        "transparent";
                                    }}
                                    onClick={() => {
                                      const selectedAdminId = row.admin_id;
                                      navigate(
                                        `/agent_lists/create-new-master/${selectedAdminId}`,
                                      );
                                      setOptionMenu(null);
                                    }}
                                  >
                                    📋 Master
                                  </button>
                                )}

                                {/* ✅ CONDITION 2: MA (Master) → Client Button */}
                                {row.admin_id?.startsWith("MA") && (
                                  <button
                                    className="dropdown-item"
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      padding: "8px 16px",
                                      clear: "both",
                                      fontWeight: "400",
                                      color: "#212529",
                                      textAlign: "left",
                                      textDecoration: "none",
                                      backgroundColor: "transparent",
                                      border: "0",
                                      cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.backgroundColor =
                                        "#f8f9fa";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.backgroundColor =
                                        "transparent";
                                    }}
                                    onClick={() => {
                                      const selectedAdminId = row.admin_id;
                                      navigate(
                                        `/AgentMasternew/create-user/${selectedAdminId}`,
                                      );
                                      setOptionMenu(null);
                                    }}
                                  >
                                    👤 Client
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            className="buttoncommon gradient-9"
                            onClick={() => handleUpdateSuperAgent(row)}
                            title="Edit Profile"
                          >
                            <FaRegEdit />
                          </button>

                          <button
                            className="buttoncommon gradient-10"
                            onClick={() => {
                              setSelectedAgent(row);
                              setDepositAmount("");
                              setShowDepositModal(true);
                            }}
                            title=" Deposit"
                          >
                            <span>D</span>
                          </button>

                          <button
                            className="buttoncommon gradient-2"
                            // onClick={() => {
                            //   setSelectedAgent(row);
                            //   setWithdrawAmount("");
                            //   setShowWithdrawModal(true);
                            // }}
                            onClick={() => {
                              setSelectedAgent(row);
                              setWithdrawAmount("");
                              setShowWithdrawModal(true);
                            }}
                            title="Withdraw"
                          >
                            <span>W</span>
                          </button>

                          <button
                            className="buttoncommon gradient-6"
                            onClick={() => {
                              setSelectedAgent(row);
                              setPasswordData({
                                oldPassword: "",
                                newPassword: "",
                              });
                              setShowPasswordModal(true);
                            }}
                            title="Reset Password"
                          >
                            <span>P</span>
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
                            className="buttoncommon gradient-6"
                            onClick={() =>
                              navigate(`/Superagenttransaction/${row.admin_id}`)
                            }
                            title="Lena Dena"
                          >
                            L
                          </button>

                          <button
                            className="buttoncommon gradient-2"
                            onClick={() => handleOperationAccount(row)}
                            title=" Account Operation"
                          >
                            <FiUserCheck />
                          </button> */}

                          {/* <button
                            className={`buttoncommon ${row.active ? "gradient-3" : "gradient-4"}`}
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
                            className="buttoncommon gradient-10"
                            onClick={() => handleStatementmasterlist(row)}
                            title="Statement"
                          >
                            <CgFileDocument />
                          </button> */}
                          {/* <button
                            className="buttoncommon gradient-8"
                             onClick={handleInactiveMasters}
                            title="Inactive Users"
                          >
                            <FaRectangleList  />
                          </button> */}
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

          {/* ✅ ENHANCED PAGINATION UI */}
          {totalPages > 0 && (
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
                      className={`paginationnumber ${
                        currentPage === page ? "active" : ""
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
        {/* {showBlockModal && selectedAgent && (
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
                      {Number(selectedAgent.is_blocked) === 1
                        ? "unblock"
                        : "block"}
                    </strong>{" "}
                    this master?
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
                    className={`btn ${
                      Number(selectedAgent.is_blocked) === 1
                        ? "btn-success"
                        : "btn-warning"
                    }`}
                    onClick={handleBlockUnblock}
                  >
                    {Number(selectedAgent.is_blocked) === 1
                      ? "Unblock"
                      : "Block"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}

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
                    <strong>Username:</strong> {selectedAgent.username}
                  </p>
                  <p className="mb-2">
                    <strong>Admin ID:</strong> {selectedAgent.admin_id}
                  </p>
                  <p className="mb-2">
                    <strong>Role:</strong> {selectedAgent.role}
                  </p>
                  <p>
                    Current Status:{" "}
                    <strong>
                      {Number(selectedAgent.is_blocked) === 1
                        ? "Blocked"
                        : "Active"}
                    </strong>
                  </p>
                  <p>
                    Are you sure you want to{" "}
                    <strong>
                      {Number(selectedAgent.is_blocked) === 1
                        ? "unblock"
                        : "block"}
                    </strong>{" "}
                    this user?
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
                    className={`btn ${
                      Number(selectedAgent.is_blocked) === 1
                        ? "btn-success"
                        : "btn-warning"
                    }`}
                    onClick={handleBlockUnblock}
                  >
                    {Number(selectedAgent.is_blocked) === 1
                      ? "Unblock"
                      : "Block"}
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
                    {/* ✅ Sport Settings - selectedAgent ka admin_id use kar raha hai */}
                    <div className="col-6">
                      <Link
                        to={`/sport-setting/${selectedAgent?.admin_id}`}
                        className="btn gradient-3 w-100"
                        onClick={() => setShowSettingModal(false)}
                      >
                        Sport Settings
                      </Link>
                    </div>

                    {/* ✅ Baaki settings bhi same admin_id se */}
                    <div className="col-6">
                      <Link
                        to={`/user-setting/${selectedAgent?.admin_id}`}
                        className="btn gradient-9 w-100"
                        onClick={() => setShowSettingModal(false)}
                      >
                        User Settings
                      </Link>
                    </div>

                    <div className="col-6">
                      <Link
                        to={`/casino-setting/${selectedAgent?.admin_id}`}
                        className="btn gradient-1 w-100"
                        onClick={() => setShowSettingModal(false)}
                      >
                        Casino Settings
                      </Link>
                    </div>

                    <div className="col-6">
                      <Link
                       // to={`/icasino-setting/${selectedAgent?.admin_id}`}
                        to={`#`}
                        className="btn gradient-2 w-100"
                        onClick={() => setShowSettingModal(false)}
                      >
                        iCasino Settings
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Modal */}
        {/* {showDeleteModal && selectedAgent && (
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
        )} */}

        {/* {
          showPasswordModal && selectedAgent && (
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
                          setSearchInput(""); 
                        setPasswordData({
                          oldPassword: "",
                          newPassword: "",
                        });
                        setShowPasswords({
                          oldPassword: false,
                          newPassword: false,
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
                          value={selectedAgent?.password || ""}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => togglePasswordVisibility("oldPassword")}
                        >
                          {showPasswords.oldPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                      <small className="text-muted">This is your current password</small>
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
                        >
                          {showPasswords.newPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>

                      {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                        <div className="alert alert-warning py-2 mt-2">
                          <small>Password must be at least 6 characters</small>
                        </div>
                      )}
                    </div>

                     {passwordData.newPassword && passwordData.newPassword.length >= 6 && ( 
                     <div className="mt-3 p-3 border rounded" style={{ background: "#f5f5f5" }}>
                      <h6 className="fw-bold mb-2">LOGIN DETAILS</h6>
                      <div><b>Link :</b> {COPY_API_URL}</div>
                      <div><b>Username :</b> {selectedAgent?.admin_id}</div>
                      <div><b>Password :</b> {passwordData.newPassword}</div>
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
                        });
                        setShowPasswords({
                          oldPassword: false,
                          newPassword: false,
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
                        !passwordData.newPassword ||
                        passwordData.newPassword.length < 6
                      }
                    >
                      <FiLock className="me-2" />
                      Change Password
                    </button>

                   <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleCopyData}
                      disabled={!passwordData.newPassword || passwordData.newPassword.length < 6}
                    >
                      Copy Details
                    </button> 
                  </div>

                </div>
              </div>
            </div>
          )
        } */}
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
                    Reset Password - {selectedAgent.admin_id}
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

                  {/* New Password - User input */}
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
                  <h5 className="modal-title">
                    Deposit to {selectedAgent.username}
                  </h5>
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
                  {/* <p>
                    Deposit to Master: <strong>{selectedAgent.username}</strong>
                  </p>
                  <p className="mb-3">
                    Current Balance: <strong>{selectedAgent.coins}</strong>
                  </p> */}
                  <div className="mb-3">
                    <label className="form-label text-uppercase">
                      Available Amount
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAgent.coins}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="form-label">Deposit Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      onKeyDown={blockInvalidKeys}
                      placeholder="Enter amount to deposit"
                      min="1"
                      step="0.01"
                    />
                    {/* <div className="form-text">
                      Enter the amount you want to deposit to this agent's
                      account.
                    </div> */}
                  </div>
                  {depositAmount && !isNaN(depositAmount) && (
                    <div className="alert alert-info mt-2">
                      <strong>New Balance:</strong>
                      {(
                        Number(selectedAgent.coins) + Number(depositAmount)
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
                      isProcessing
                    }
                  >
                    {isProcessing && processingType === "deposit" ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
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
                  <h5 className="modal-title">
                    Withdraw from {selectedAgent.username}
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
                    Withdraw chips from Master:{" "}
                    <strong>{selectedAgent.username}</strong>
                  </p>
                  <p className="mb-3">
                    Current Balance: <strong>{selectedAgent.coins}</strong>
                  </p> */}

                  <div className="mb-3">
                    <label className="form-label text-uppercase">
                      Available Amount
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAgent.coins}
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
                          Number(selectedAgent.coins) - Number(withdrawAmount)
                        ).toLocaleString()}
                      </div>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={withdrawAmount}
                      onKeyDown={blockInvalidKeys}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount to withdraw"
                      min="1"
                      step="0.01"
                      max={selectedAgent.coins}
                    />
                    {/* <div className="form-text">
                      Maximum withdrawable amount: {selectedAgent.coins}
                    </div> */}
                  </div>

                  {/* {withdrawAmount && !isNaN(withdrawAmount) && (
                    <div className="alert alert-info mt-2">
                      <strong>New Balance:</strong>
                      {(
                        Number(selectedAgent.coins) - Number(withdrawAmount)
                      ).toLocaleString()}
                    </div>
                  )} */}

                  {withdrawAmount &&
                    Number(withdrawAmount) > Number(selectedAgent.coins) && (
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
                    disabled={
                      !withdrawAmount ||
                      isNaN(withdrawAmount) ||
                      Number(withdrawAmount) <= 0 ||
                      Number(withdrawAmount) > Number(selectedAgent.coins)
                    }
                  >
                    <FiMinusCircle className="me-2" />
                    Withdraw {withdrawAmount || 0}
                  </button> */}
                  <button
                    type="button"
                    className="btn btn-theme"
                    onClick={handleWithdrawFromAgent}
                    onKeyDown={blockInvalidKeys}
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
                    className="btn btn-primary"
                    onClick={() => {
                      // showSuccessToast("Agent updated successfully");
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

export default BlockedChildLists;
