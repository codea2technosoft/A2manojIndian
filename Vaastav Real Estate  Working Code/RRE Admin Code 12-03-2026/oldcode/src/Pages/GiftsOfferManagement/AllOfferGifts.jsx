import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Button,
  Table,
  Pagination,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import { MdFilterAltOff, MdFilterAlt, MdDelete, MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiFilterFill } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaCalendar, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;

function AdminTDSReport() {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [teamLedger, setTeamLedger] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamCurrentPage, setTeamCurrentPage] = useState(1);
  const [teamTotalPages, setTeamTotalPages] = useState(1);

  // Customers section state
  const [customersLedger, setCustomersLedger] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersCurrentPage, setCustomersCurrentPage] = useState(1);
  const [customersTotalPages, setCustomersTotalPages] = useState(1);

  // Edit modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTeamEditModal, setShowTeamEditModal] = useState(false);
  const [showCustomerEditModal, setShowCustomerEditModal] = useState(false);

  const datePickerRef = useRef(null);
  const handleIconClick = () => {
    datePickerRef.current.setOpen(true);
  };
  const handleClear = () => {
    setFilterFromDate(null);
  };

  // Edit form data
  const [editFormData, setEditFormData] = useState({
    id: "",
    date_from: "",
    date_to: "",
    closing_days: "",
    gift_type: "",
    area_sqyd: "",
    offer_name: "",
    offer_item: "",
    item_amount: "",
    offer_project_name: "",
    terms_conditions: "",
  });

  const [teamEditFormData, setTeamEditFormData] = useState({
    id: "",
    date_from: "",
    date_to: "",
    closing_days: "",
    gift_type: "",
    area_sqyd: "",
    offer_name: "",
    offer_item: "",
    item_amount: "",
    offer_project_name: "",
    terms_conditions: "",
  });

  const [customerEditFormData, setCustomerEditFormData] = useState({
    id: "",
    date_from: "",
    date_to: "",
    closing_days: "",
    gift_type: "",
    area_sqyd: "",
    offer_name: "",
    offer_item: "",
    item_amount: "",
    offer_project_name: "",
    terms_conditions: "",
  });

  const [searchTerm, setSearchTerm] = useState({ amount: "", type: "" });
  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);
  const [totals, setTotals] = useState({ total_credit: 0, total_debit: 0 });
  const token = localStorage.getItem("token");

  // Separate filters for all three sections
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterToType, setFilterToType] = useState("");

  const [teamFilterFromDate, setTeamFilterFromDate] = useState("");
  const [teamFilterToDate, setTeamFilterToDate] = useState("");
  const [teamFilterToType, setTeamFilterToType] = useState("");

  // Customers section filters
  const [customersFilterFromDate, setCustomersFilterFromDate] = useState("");
  const [customersFilterToDate, setCustomersFilterToDate] = useState("");
  const [customersFilterToType, setCustomersFilterToType] = useState("");

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isTeamFilterActive, setIsTeamFilterActive] = useState(false);
  const [isCustomersFilterActive, setIsCustomersFilterActive] = useState(false);

  const pageLimit = 10;
  const toggleFilter = () => setShowFilter((prev) => !prev);
  const showCustomMessageModal = (title, text) => {
    //alert(`${title}: ${text}`);
  };

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const handleTeamToggle = () => {
    setIsTeamFilterActive(!isTeamFilterActive);
  };

  const handleCustomersToggle = () => {
    setIsCustomersFilterActive(!isCustomersFilterActive);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1199) {
        setIsDesktop(true);
        setShowFilter(true);
      } else {
        setIsDesktop(false);
        setShowFilter(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // First Section API - gift-list
  const fetchLedger = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        gift_type: searchTerm.gift_type || filterToType,
        date_from: formatDateForServer(filterFromDate),
        date_to: formatDateForServer(filterToDate),
        page,
      });
      const response = await fetch(`${API_URL}/gift-list?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success === "1") {
        setLedger(result.data || []);
        setTotalPages(result.total_pages || 1);
        setCurrentPage(result.current_page || 1);
      } else {
        showCustomMessageModal(
          "Error",
          result.message || "Failed to fetch records.",
        );
      }
    } catch (error) {
      showCustomMessageModal("Error", "Failed to fetch ledger data.");
    } finally {
      setLoading(false);
    }
  };

  // Second Section API - gift-list-team
  const fetchTeamLedger = async (page = 1) => {
    setTeamLoading(true);
    try {
      const params = new URLSearchParams({
        gift_type: searchTerm.gift_type || teamFilterToType,
        date_from: formatDateForServer(teamFilterFromDate),
        date_to: formatDateForServer(teamFilterToDate),
        page,
      });
      const response = await fetch(`${API_URL}/gift-list-team?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success === "1") {
        setTeamLedger(result.data || []);
        setTeamTotalPages(result.total_pages || 1);
        setTeamCurrentPage(result.current_page || 1);
      } else {
        showCustomMessageModal(
          "Error",
          result.message || "Failed to fetch team records.",
        );
      }
    } catch (error) {
      showCustomMessageModal("Error", "Failed to fetch team ledger data.");
    } finally {
      setTeamLoading(false);
    }
  };

  // Third Section API - gift-list-customers
  const fetchCustomersLedger = async (page = 1) => {
    setCustomersLoading(true);
    try {
      const params = new URLSearchParams({
        gift_type: searchTerm.gift_type || customersFilterToType,
        date_from: formatDateForServer(customersFilterFromDate),
        date_to: formatDateForServer(customersFilterToDate),
        page,
      });
      const response = await fetch(`${API_URL}/gift-list-customers?${params}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success === "1") {
        setCustomersLedger(result.data || []);
        setCustomersTotalPages(result.total_pages || 1);
        setCustomersCurrentPage(result.current_page || 1);
      } else {
        showCustomMessageModal(
          "Error",
          result.message || "Failed to fetch customers records.",
        );
      }
    } catch (error) {
      showCustomMessageModal("Error", "Failed to fetch customers ledger data.");
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
    fetchTeamLedger();
    fetchCustomersLedger();
  }, []);

  // Delete Self Gift API
  const deleteSelfGift = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Deleting record...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await fetch(`${API_URL}/gift-self/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: result.message || "Record deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh the self gifts list
        fetchLedger(currentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: result.message || "Failed to delete record.",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete record. Please try again.",
      });
    }
  };

  // Delete Team Gift API
  const deleteTeamGift = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Deleting record...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await fetch(`${API_URL}/gift-team/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: result.message || "Team record deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh the team gifts list
        fetchTeamLedger(teamCurrentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: result.message || "Failed to delete team record.",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete team record. Please try again.",
      });
    }
  };

  // Delete Customer Gift API
  const deleteCustomerGift = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Deleting record...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await fetch(`${API_URL}/gift-customer/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: result.message || "Customer record deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh the customers gifts list
        fetchCustomersLedger(customersCurrentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: result.message || "Failed to delete customer record.",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete customer record. Please try again.",
      });
    }
  };

  // Edit Self Gift - Open Modal
  const handleEditSelfGift = (item) => {
    setEditFormData({
      id: item.id || "",
      date_from: item.date_from || "",
      date_to: item.date_to || "",
      closing_days: item.closing_days || "",
      gift_type: item.gift_type || "",
      area_sqyd: item.area_sqyd || "",
      offer_name: item.offer_name || "",
      offer_item: item.offer_item || "",
      item_amount: item.item_amount || "",
      offer_project_name: item.offer_project_name || "",
      terms_conditions: item.terms_conditions || "",
    });
    setShowEditModal(true);
  };

  // Edit Team Gift - Open Modal
  const handleEditTeamGift = (item) => {
    setTeamEditFormData({
      id: item.id || "",
      date_from: item.date_from || "",
      date_to: item.date_to || "",
      closing_days: item.closing_days || "",
      gift_type: item.gift_type || "",
      area_sqyd: item.area_sqyd || "",
      offer_name: item.offer_name || "",
      offer_item: item.offer_item || "",
      item_amount: item.item_amount || "",
      offer_project_name: item.offer_project_name || "",
      terms_conditions: item.terms_conditions || "",
    });
    setShowTeamEditModal(true);
  };

  // Edit Customer Gift - Open Modal
  const handleEditCustomerGift = (item) => {
    setCustomerEditFormData({
      id: item.id || "",
      date_from: item.date_from || "",
      date_to: item.date_to || "",
      closing_days: item.closing_days || "",
      gift_type: item.gift_type || "",
      area_sqyd: item.area_sqyd || "",
      offer_name: item.offer_name || "",
      offer_item: item.offer_item || "",
      item_amount: item.item_amount || "",
      offer_project_name: item.offer_project_name || "",
      terms_conditions: item.terms_conditions || "",
    });
    setShowCustomerEditModal(true);
  };

  // Update Self Gift API
  const updateSelfGift = async () => {
    try {
      Swal.fire({
        title: "Please wait...",
        text: "Updating record...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await fetch(`${API_URL}/gift-self/${editFormData.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date_from: editFormData.date_from,
          date_to: editFormData.date_to,
          closing_days: editFormData.closing_days,
          gift_type: editFormData.gift_type,
          area_sqyd: editFormData.area_sqyd,
          offer_name: editFormData.offer_name,
          offer_item: editFormData.offer_item,
          item_amount: editFormData.item_amount,
          offer_project_name: editFormData.offer_project_name,
          terms_conditions: editFormData.terms_conditions,
        }),
      });

      const result = await response.json();

      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: result.message || "Record updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        setShowEditModal(false);
        // Refresh the self gifts list
        fetchLedger(currentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: result.message || "Failed to update record.",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update record. Please try again.",
      });
    }
  };

  // Update Team Gift API
  const updateTeamGift = async () => {
    try {
      Swal.fire({
        title: "Please wait...",
        text: "Updating team record...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await fetch(
        `${API_URL}/gift-team/${teamEditFormData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date_from: teamEditFormData.date_from,
            date_to: teamEditFormData.date_to,
            closing_days: teamEditFormData.closing_days,
            gift_type: teamEditFormData.gift_type,
            area_sqyd: teamEditFormData.area_sqyd,
            offer_name: teamEditFormData.offer_name,
            offer_item: teamEditFormData.offer_item,
            item_amount: teamEditFormData.item_amount,
            offer_project_name: teamEditFormData.offer_project_name,
            terms_conditions: teamEditFormData.terms_conditions,
          }),
        },
      );

      const result = await response.json();

      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: result.message || "Team record updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        setShowTeamEditModal(false);
        // Refresh the team gifts list
        fetchTeamLedger(teamCurrentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: result.message || "Failed to update team record.",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update team record. Please try again.",
      });
    }
  };

  // Update Customer Gift API
  const updateCustomerGift = async () => {
    try {
      Swal.fire({
        title: "Please wait...",
        text: "Updating customer record...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await fetch(
        `${API_URL}/gift-customer/${customerEditFormData.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date_from: customerEditFormData.date_from,
            date_to: customerEditFormData.date_to,
            closing_days: customerEditFormData.closing_days,
            gift_type: customerEditFormData.gift_type,
            area_sqyd: customerEditFormData.area_sqyd,
            offer_name: customerEditFormData.offer_name,
            offer_item: customerEditFormData.offer_item,
            item_amount: customerEditFormData.item_amount,
            offer_project_name: customerEditFormData.offer_project_name,
            terms_conditions: customerEditFormData.terms_conditions,
          }),
        },
      );

      const result = await response.json();

      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: result.message || "Customer record updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        setShowCustomerEditModal(false);
        // Refresh the customers gifts list
        fetchCustomersLedger(customersCurrentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: result.message || "Failed to update customer record.",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update customer record. Please try again.",
      });
    }
  };

  // Handle form input changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamEditFormChange = (e) => {
    const { name, value } = e.target;
    setTeamEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerEditFormChange = (e) => {
    const { name, value } = e.target;
    setCustomerEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLedger(1);
    fetchTeamLedger(1);
    fetchCustomersLedger(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchLedger(pageNumber);
    }
  };

  const handleTeamPageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= teamTotalPages) {
      fetchTeamLedger(pageNumber);
    }
  };

  const handleCustomersPageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= customersTotalPages) {
      fetchCustomersLedger(pageNumber);
    }
  };

  const getPaginationGroup = (currentPage, totalPages) => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(Math.min(pageLimit, totalPages - start))
      .fill()
      .map((_, idx) => start + idx + 1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateForServer = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleDownloadFilteredExcel = async () => {
    const token = localStorage.getItem("token");

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Generating your filtered Excel file",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const params = new URLSearchParams({
        totalPages,
        gift_type: searchTerm.gift_type || filterToType,
        date_from: formatDateForServer(filterFromDate),
        date_to: formatDateForServer(filterToDate),
      }).toString();

      const response = await fetch(
        `${API_URL}/download-property-income-self-offer-list?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to download Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `self offer lists.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Download Successful!",
        text: "Filtered Excel report has been downloaded successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Filtered Excel download failed:", error);
      Swal.fire({
        icon: "warning",
        title: "Download Failed!",
        text: "Please Check Entered From Date & To Date For Downloading Self Offers / Self Gifts Lists Report.",
      });
    }
  };

  const handleDownloadTeamFilteredExcel = async () => {
    const token = localStorage.getItem("token");

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Generating your team filtered Excel file",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const params = new URLSearchParams({
        totalPages: teamTotalPages,
        gift_type: searchTerm.gift_type || teamFilterToType,
        date_from: formatDateForServer(teamFilterFromDate),
        date_to: formatDateForServer(teamFilterToDate),
      }).toString();

      const response = await fetch(
        `${API_URL}/download-property-income-team-offer-list?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to download Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `team offer lists.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Download Successful!",
        text: "Filtered Team Excel report has been downloaded successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Filtered Team Excel download failed:", error);
      Swal.fire({
        icon: "warning",
        title: "Download Failed!",
        text: "Please Check Entered From Date & To Date For Downloading Team TDS Report.",
      });
    }
  };

  const handleDownloadCustomersFilteredExcel = async () => {
    const token = localStorage.getItem("token");

    try {
      Swal.fire({
        title: "Please wait...",
        text: "Generating your customers filtered Excel file",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const params = new URLSearchParams({
        totalPages: customersTotalPages,
        gift_type: searchTerm.gift_type || customersFilterToType,
        date_from: formatDateForServer(customersFilterFromDate),
        date_to: formatDateForServer(customersFilterToDate),
      }).toString();

      const response = await fetch(
        `${API_URL}/download-property-income-customer-offer-list?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Failed to download Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `customer offer lists.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Download Successful!",
        text: "Filtered Customers Excel report has been downloaded successfully.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Filtered Customers Excel download failed:", error);
      Swal.fire({
        icon: "warning",
        title: "Download Failed!",
        text: "Please Check Entered From Date & To Date For Downloading Customers TDS Report.",
      });
    }
  };

  return (
    <div className="padding_15">
      {/* First Section - Regular Offers/Gifts */}
      <div className="userlist mb-5">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <div className="titlepage">
              <h3>Self Offers / Self Gifts Lists</h3>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Button
                className="d-flex gap-2 border border-white"
                variant="primary"
                onClick={handleDownloadFilteredExcel}
              >
                <BsFiletypeXls className="text-white fs-6" />
                Download
              </Button>
              <div className="createnewadmin">
                <Link
                  to="/add-new-offer-gifts"
                  className="btn btn-success d-flex align-items-center"
                >
                  <FaPlus className="me-2" /> Add
                </Link>
              </div>
              <button
                className={`filter-toggle-btn ${isFilterActive ? "active" : ""}`}
                onClick={handleToggle}
              >
                {isFilterActive ? (
                  <>
                    <MdFilterAltOff />
                  </>
                ) : (
                  <>
                    <MdFilterAlt />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="card-body">
            {isFilterActive && (
              <div className="d-flex align-items-center mb-3 gap-2 flex-wrap-mobile">
                <div className="w-100 position-relative">
                  <div
                    className="position-absolute"
                    style={{ top: "10px", right: "20px" }}
                  >
                    {!filterFromDate ? (
                      <FaCalendar onClick={handleIconClick} />
                    ) : (
                      <FaTimes onClick={handleClear} />
                    )}
                  </div>
                  <DatePicker
                    ref={datePickerRef}
                    selected={filterFromDate}
                    onChange={(date) => setFilterFromDate(date)}
                    placeholderText="DD-MM-YYYY"
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    // isClearable={true}
                    showPopperArrow={false}
                  />
                </div>

                <div className="w-100 position-relative">
                  <div
                    className="position-absolute"
                    style={{ top: "10px", right: "20px" }}
                  >
                    {!filterFromDate ? (
                      <FaCalendar onClick={handleIconClick} />
                    ) : (
                      <FaTimes onClick={handleClear} />
                    )}
                  </div>
                  <DatePicker
                    ref={datePickerRef}
                    selected={filterToDate}
                    onChange={(date) => setFilterToDate(date)}
                    placeholderText="DD-MM-YYYY"
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    // isClearable={true}
                    showPopperArrow={false}
                  />
                </div>

                <Button variant="primary" onClick={() => fetchLedger(1)}>
                  <RiFilterFill /> Search
                </Button>
              </div>
            )}

            {loading ? (
              <p>Loading records...</p>
            ) : ledger.length === 0 ? (
              <p className="text-center mb-0">No records found.</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Closing Days</th>
                      <th>Gift Type</th>
                      <th>Area SQYD</th>
                      <th>Offer Name</th>
                      <th>Offer Item</th>
                      <th>Item Amount</th>
                      <th>Offer Project Name</th>
                      <th>Terms Conditions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(currentPage - 1) * pageLimit + index + 1}</td>
                        <td>{item.date_from || "-"}</td>
                        <td>{item.date_to || "-"}</td>
                        <td>{item.closing_days}</td>
                        <td>
                          {item.gift_type
                            ? item.gift_type.charAt(0).toUpperCase() +
                              item.gift_type.slice(1).toLowerCase()
                            : "-"}
                        </td>
                        <td>{item.area_sqyd || "-"}</td>
                        <td> {item.offer_name}</td>
                        <td> {item.offer_item}</td>
                        <td> {item.item_amount || 0.0}</td>
                        <td>{item.offer_project_name}</td>
                        <td> {item.terms_conditions}</td>
                        <td className="d-flex gap-1">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEditSelfGift(item)}
                            title="Edit"
                          >
                            <MdEdit />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteSelfGift(item.id)}
                            title="Delete"
                          >
                            <MdDelete />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-end mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {getPaginationGroup(currentPage, totalPages).map(
                      (item, index) => (
                        <Pagination.Item
                          key={index}
                          active={item === currentPage}
                          onClick={() => handlePageChange(item)}
                        >
                          {item}
                        </Pagination.Item>
                      ),
                    )}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Second Section - Team Offers/Gifts */}
      <div className="userlist mb-5">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <div className="titlepage">
              <h3>Team Offers / Team Gifts Lists</h3>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Button
                className="buttonpadding d-flex gap-2 border border-white"
                variant="primary"
                onClick={handleDownloadTeamFilteredExcel}
              >
                <BsFiletypeXls className="text-white fs-6" />
                Download
              </Button>
              <button
                className={`filter-toggle-btn btn btn-primary ${isTeamFilterActive ? "active" : ""}`}
                onClick={handleTeamToggle}
              >
                {isTeamFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
              </button>
            </div>
          </div>

          <div className="card-body">
            {isTeamFilterActive && (
              <div className="d-flex align-items-center mb-3 gap-2 flex-wrap-mobile">
                <div className="w-100">
                  <input
                    type="text"
                    className="form-control"
                    value={teamFilterFromDate}
                    onChange={(e) => setTeamFilterFromDate(e.target.value)}
                    placeholder="From Date (DD-MM-YYYY)"
                  />
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    className="form-control"
                    value={teamFilterToDate}
                    onChange={(e) => setTeamFilterToDate(e.target.value)}
                    placeholder="To Date (DD-MM-YYYY)"
                  />
                </div>
                {/* <Col md={6}>
                  <input
                    type="text"
                    placeholder="Gift / Offer Type"
                    className="form-control"
                    value={teamFilterToType}
                    onChange={(e) => setTeamFilterToType(e.target.value)}
                  />
                </Col> */}

                <Button variant="primary" onClick={() => fetchTeamLedger(1)}>
                  <RiFilterFill /> Search
                </Button>
              </div>
            )}

            {teamLoading ? (
              <p>Loading team records...</p>
            ) : teamLedger.length === 0 ? (
              <p className="text-center mb-0">No team records found.</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Closing Days</th>
                      <th>Gift Type</th>
                      <th>Area SQYD</th>
                      <th>Offer Name</th>
                      <th>Offer Item</th>
                      <th>Item Amount</th>
                      <th>Offer Project Name</th>
                      <th>Terms Conditions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamLedger.map((item, index) => (
                      <tr key={item.id}>
                        <td>{(teamCurrentPage - 1) * pageLimit + index + 1}</td>
                        <td>{item.date_from || "-"}</td>
                        <td>{item.date_to || "-"}</td>
                        <td>{item.closing_days}</td>
                        <td>
                          {item.gift_type
                            ? item.gift_type.charAt(0).toUpperCase() +
                              item.gift_type.slice(1).toLowerCase()
                            : "-"}
                        </td>
                        <td>{item.area_sqyd || "-"}</td>
                        <td> {item.offer_name}</td>
                        <td> {item.offer_item}</td>
                        <td> {item.item_amount || 0.0}</td>
                        <td>{item.offer_project_name}</td>
                        <td> {item.terms_conditions}</td>
                        <td className="d-flex gap-1">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEditTeamGift(item)}
                            title="Edit"
                          >
                            <MdEdit />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteTeamGift(item.id)}
                            title="Delete"
                          >
                            <MdDelete />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-end mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handleTeamPageChange(teamCurrentPage - 1)}
                      disabled={teamCurrentPage === 1}
                    />
                    {getPaginationGroup(teamCurrentPage, teamTotalPages).map(
                      (item, index) => (
                        <Pagination.Item
                          key={index}
                          active={item === teamCurrentPage}
                          onClick={() => handleTeamPageChange(item)}
                        >
                          {item}
                        </Pagination.Item>
                      ),
                    )}
                    <Pagination.Next
                      onClick={() => handleTeamPageChange(teamCurrentPage + 1)}
                      disabled={teamCurrentPage === teamTotalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Third Section - Customers Offers/Gifts */}
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <div className="titlepage">
              <h3>Customers Offers / Customers Gifts Lists</h3>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Button
                className="buttonpadding d-flex gap-2 border border-white"
                variant="primary"
                onClick={handleDownloadCustomersFilteredExcel}
              >
                <BsFiletypeXls className="text-white fs-6" />
                Download
              </Button>
              <button
                className={`filter-toggle-btn btn btn-primary ${isCustomersFilterActive ? "active" : ""}`}
                onClick={handleCustomersToggle}
              >
                {isCustomersFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
              </button>
            </div>
          </div>

          <div className="card-body">
            {isCustomersFilterActive && (
              <div className="d-flex align-items-center gap-2 flex-wrap-mobile">
                <div className="w-100">
                  <input
                    type="text"
                    className="form-control"
                    value={customersFilterFromDate}
                    onChange={(e) => setCustomersFilterFromDate(e.target.value)}
                    placeholder="From Date (DD-MM-YYYY)"
                  />
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    className="form-control"
                    value={customersFilterToDate}
                    onChange={(e) => setCustomersFilterToDate(e.target.value)}
                    placeholder="To Date (DD-MM-YYYY)"
                  />
                </div>
                {/* <Col md={6}>
                  <input
                    type="text"
                    placeholder="Gift / Offer Type"
                    className="form-control"
                    value={customersFilterToType}
                    onChange={(e) => setCustomersFilterToType(e.target.value)}
                  />
                </Col> */}

                <Button
                  variant="primary"
                  onClick={() => fetchCustomersLedger(1)}
                >
                  <RiFilterFill /> Search
                </Button>
              </div>
            )}

            
            {customersLoading ? (
              <p>Loading customers records...</p>
            ) : customersLedger.length === 0 ? (
              <p className="text-center mb-0">No customers records found.</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Closing Days</th>
                      <th>Gift Type</th>
                      <th>Area SQYD</th>
                      <th>Offer Name</th>
                      <th>Offer Item</th>
                      <th>Item Amount</th>
                      <th>Offer Project Name</th>
                      <th>Terms Conditions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersLedger.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          {(customersCurrentPage - 1) * pageLimit + index + 1}
                        </td>
                        <td>{item.date_from || "-"}</td>
                        <td>{item.date_to || "-"}</td>
                        <td>{item.closing_days}</td>
                        <td>
                          {item.gift_type
                            ? item.gift_type.charAt(0).toUpperCase() +
                              item.gift_type.slice(1).toLowerCase()
                            : "-"}
                        </td>
                        <td>{item.area_sqyd || "-"}</td>
                        <td> {item.offer_name}</td>
                        <td> {item.offer_item}</td>
                        <td> {item.item_amount || 0.0}</td>
                        <td>{item.offer_project_name}</td>
                        <td> {item.terms_conditions}</td>
                        <td className="d-flex gap-1">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleEditCustomerGift(item)}
                            title="Edit"
                          >
                            <MdEdit />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteCustomerGift(item.id)}
                            title="Delete"
                          >
                            <MdDelete />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="d-flex justify-content-end mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() =>
                        handleCustomersPageChange(customersCurrentPage - 1)
                      }
                      disabled={customersCurrentPage === 1}
                    />
                    {getPaginationGroup(
                      customersCurrentPage,
                      customersTotalPages,
                    ).map((item, index) => (
                      <Pagination.Item
                        key={index}
                        active={item === customersCurrentPage}
                        onClick={() => handleCustomersPageChange(item)}
                      >
                        {item}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() =>
                        handleCustomersPageChange(customersCurrentPage + 1)
                      }
                      disabled={customersCurrentPage === customersTotalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal for Self Gifts */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Self Gift/Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="text"
                  name="date_from"
                  value={editFormData.date_from}
                  onChange={handleEditFormChange}
                  placeholder="DD-MM-YYYY"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="text"
                  name="date_to"
                  value={editFormData.date_to}
                  onChange={handleEditFormChange}
                  placeholder="DD-MM-YYYY"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Closing Days</Form.Label>
                <Form.Control
                  type="number"
                  name="closing_days"
                  value={editFormData.closing_days}
                  onChange={handleEditFormChange}
                  placeholder="Closing Days"
                />
              </Form.Group>
            </Col>
            {/* <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gift Type</Form.Label>
                <Form.Control
                  type="text"
                  name="gift_type"
                  value={editFormData.gift_type}
                  onChange={handleEditFormChange}
                  placeholder="Gift Type"
                />
              </Form.Group>
            </Col> */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Area SQYD</Form.Label>
                <Form.Control
                  type="text"
                  name="area_sqyd"
                  value={editFormData.area_sqyd}
                  onChange={handleEditFormChange}
                  placeholder="Area SQYD"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Offer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="offer_name"
                  value={editFormData.offer_name}
                  onChange={handleEditFormChange}
                  placeholder="Offer Name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Offer Item</Form.Label>
                <Form.Control
                  type="text"
                  name="offer_item"
                  value={editFormData.offer_item}
                  onChange={handleEditFormChange}
                  placeholder="Offer Item"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="item_amount"
                  value={editFormData.item_amount}
                  onChange={handleEditFormChange}
                  placeholder="Item Amount"
                />
              </Form.Group>
            </Col>
            {/* <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Offer Project Name</Form.Label>
                <Form.Control
                  type="text"
                  name="offer_project_name"
                  value={editFormData.offer_project_name}
                  onChange={handleEditFormChange}
                  placeholder="Offer Project Name"
                />
              </Form.Group>
            </Col> */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Terms & Conditions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="terms_conditions"
                  value={editFormData.terms_conditions}
                  onChange={handleEditFormChange}
                  placeholder="Terms & Conditions"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateSelfGift}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal for Team Gifts */}
      <Modal
        show={showTeamEditModal}
        onHide={() => setShowTeamEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Team Gift/Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="text"
                  name="date_from"
                  value={teamEditFormData.date_from}
                  onChange={handleTeamEditFormChange}
                  placeholder="DD-MM-YYYY"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="text"
                  name="date_to"
                  value={teamEditFormData.date_to}
                  onChange={handleTeamEditFormChange}
                  placeholder="DD-MM-YYYY"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Closing Days</Form.Label>
                <Form.Control
                  type="number"
                  name="closing_days"
                  value={teamEditFormData.closing_days}
                  onChange={handleTeamEditFormChange}
                  placeholder="Closing Days"
                />
              </Form.Group>
            </Col>
            {/* <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gift Type</Form.Label>
                <Form.Control
                  type="text"
                  name="gift_type"
                  value={teamEditFormData.gift_type}
                  onChange={handleTeamEditFormChange}
                  placeholder="Gift Type"
                />
              </Form.Group>
            </Col> */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Area SQYD</Form.Label>
                <Form.Control
                  type="text"
                  name="area_sqyd"
                  value={teamEditFormData.area_sqyd}
                  onChange={handleTeamEditFormChange}
                  placeholder="Area SQYD"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Offer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="offer_name"
                  value={teamEditFormData.offer_name}
                  onChange={handleTeamEditFormChange}
                  placeholder="Offer Name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Offer Item</Form.Label>
                <Form.Control
                  type="text"
                  name="offer_item"
                  value={teamEditFormData.offer_item}
                  onChange={handleTeamEditFormChange}
                  placeholder="Offer Item"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="item_amount"
                  value={teamEditFormData.item_amount}
                  onChange={handleTeamEditFormChange}
                  placeholder="Item Amount"
                />
              </Form.Group>
            </Col>
            {/* <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Offer Project Name</Form.Label>
                <Form.Control
                  type="text"
                  name="offer_project_name"
                  value={teamEditFormData.offer_project_name}
                  onChange={handleTeamEditFormChange}
                  placeholder="Offer Project Name"
                />
              </Form.Group>
            </Col> */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Terms & Conditions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="terms_conditions"
                  value={teamEditFormData.terms_conditions}
                  onChange={handleTeamEditFormChange}
                  placeholder="Terms & Conditions"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowTeamEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateTeamGift}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal for Customer Gifts */}
      <Modal
        show={showCustomerEditModal}
        onHide={() => setShowCustomerEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer Gift/Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>From Date</Form.Label>
                <Form.Control
                  type="text"
                  name="date_from"
                  value={customerEditFormData.date_from}
                  onChange={handleCustomerEditFormChange}
                  placeholder="DD-MM-YYYY"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>To Date</Form.Label>
                <Form.Control
                  type="text"
                  name="date_to"
                  value={customerEditFormData.date_to}
                  onChange={handleCustomerEditFormChange}
                  placeholder="DD-MM-YYYY"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Closing Days</Form.Label>
                <Form.Control
                  type="number"
                  name="closing_days"
                  value={customerEditFormData.closing_days}
                  onChange={handleCustomerEditFormChange}
                  placeholder="Closing Days"
                />
              </Form.Group>
            </Col>
            {/* <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gift Type</Form.Label>
                <Form.Control
                  type="text"
                  name="gift_type"
                  value={customerEditFormData.gift_type}
                  onChange={handleCustomerEditFormChange}
                  placeholder="Gift Type"
                />
              </Form.Group>
            </Col> */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Area SQYD</Form.Label>
                <Form.Control
                  type="text"
                  name="area_sqyd"
                  value={customerEditFormData.area_sqyd}
                  onChange={handleCustomerEditFormChange}
                  placeholder="Area SQYD"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Offer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="offer_name"
                  value={customerEditFormData.offer_name}
                  onChange={handleCustomerEditFormChange}
                  placeholder="Offer Name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Offer Item</Form.Label>
                <Form.Control
                  type="text"
                  name="offer_item"
                  value={customerEditFormData.offer_item}
                  onChange={handleCustomerEditFormChange}
                  placeholder="Offer Item"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Item Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="item_amount"
                  value={customerEditFormData.item_amount}
                  onChange={handleCustomerEditFormChange}
                  placeholder="Item Amount"
                />
              </Form.Group>
            </Col>
            {/* <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Offer Project Name</Form.Label>
                <Form.Control
                  type="text"
                  name="offer_project_name"
                  value={customerEditFormData.offer_project_name}
                  onChange={handleCustomerEditFormChange}
                  placeholder="Offer Project Name"
                />
              </Form.Group>
            </Col> */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Terms & Conditions</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="terms_conditions"
                  value={customerEditFormData.terms_conditions}
                  onChange={handleCustomerEditFormChange}
                  placeholder="Terms & Conditions"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => setShowCustomerEditModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={updateCustomerGift}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminTDSReport;
