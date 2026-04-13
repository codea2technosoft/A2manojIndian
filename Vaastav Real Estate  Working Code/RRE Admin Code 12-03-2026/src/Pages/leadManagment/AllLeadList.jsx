import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaDownload, FaPlus } from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { MdAirplanemodeInactive, MdAirplanemodeActive } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function AllLeadList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchPlotName, setSearchPlotName] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResponceModal, setShowResponceModal] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingResponce, setLoadingResponce] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [documentFile, setDocumentFile] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [statusUpdateDate, setStatusUpdateDate] = useState("");

  const userType = localStorage.getItem("userType");

  const [editFormData, setEditFormData] = useState({
    id: "",
    project_id: "",
    block_id: "",
    plot_id: "",
    customer_name: "",
    mobile: "",
    income_source: "",
    adhar_card_number: "",
    pan_card_number: "",
    adharfront: null,
    adharback: null,
    pancard: null,
    lead_date: "",
  });

  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const incomeSourceOptions = [
    { value: "", label: "Select Income Source" },
    { value: "business", label: "Business" },
    { value: "salaried", label: "Salaried" },
    { value: "rent", label: "Rent" },
    { value: "pension", label: "Pension" },
    { value: "other", label: "Other" },
  ];

  const [projectsForEdit, setProjectsForEdit] = useState([]);
  const [blocksForEdit, setBlocksForEdit] = useState([]);
  const [plotsForEdit, setPlotsForEdit] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
    showDateInput: false,
    status: "",
    selectedDate: "",
  });

  const showCustomMessageModal = (
    title,
    text,
    type,
    confirmAction = null,
    showDateInput = false,
    status = "",
  ) => {
    // Reset date when opening modal
    if (
      showDateInput &&
      (status === "approved" || status === "unitisnotsold")
    ) {
      setStatusUpdateDate(new Date().toISOString().split("T")[0]);
    } else {
      setStatusUpdateDate("");
    }

    setMessageModalContent({
      title,
      text,
      type,
      confirmAction,
      showDateInput,
      status,
    });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = (keepDate = false) => {
    setShowMessageModal(false);
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
      showDateInput: false,
      status: "",
      selectedDate: "",
    });
    if (!keepDate) {
      setStatusUpdateDate("");
    }
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const allowedDomains = [
    "admin.rajasthanirealestates.in",
    "realestateadmin.a2logicgroup.com",
  ];

  const dontallowedDomains = ["admin.khataaareportts.com"];

  const currentDomain = window.location.host;

  useEffect(() => {
    const fetchProjectsListForEdit = async () => {
      setLoadingDropdowns(true);
      try {
        const token = getAuthToken();
        if (!token) {
          showCustomMessageModal(
            "Authentication Error",
            "Authentication token not found. Please log in.",
            "error",
          );
          setLoadingDropdowns(false);
          return;
        }

        const response = await fetch(`${API_URL}/project-list-block`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          showCustomMessageModal(
            "Error",
            errorData.message || "Failed to fetch projects for dropdown.",
            "error",
          );
          setLoadingDropdowns(false);
          return;
        }

        const data = await response.json();
        setProjectsForEdit(data.data || []);
      } catch (err) {
        console.error("Fetch projects for edit error:", err);
        showCustomMessageModal(
          "Error",
          err.message ||
            "An unexpected error occurred while fetching projects for edit.",
          "error",
        );
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchProjectsListForEdit();
  }, []);

  useEffect(() => {
    const fetchBlocksListForEdit = async () => {
      if (editFormData.project_id) {
        setLoadingDropdowns(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
            setLoadingDropdowns(false);
            return;
          }

          const response = await fetch(`${API_URL}/block-list-plot`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ project_id: editFormData.project_id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal(
              "Error",
              errorData.message || "Failed to fetch blocks for dropdown.",
              "error",
            );
            setBlocksForEdit([]);
            setLoadingDropdowns(false);
            return;
          }

          const data = await response.json();
          setBlocksForEdit(data.data || []);
        } catch (err) {
          console.error("Fetch blocks for edit error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
              "An unexpected error occurred while fetching blocks for edit.",
            "error",
          );
          setBlocksForEdit([]);
        } finally {
          setLoadingDropdowns(false);
        }
      } else {
        setBlocksForEdit([]);
        setPlotsForEdit([]);
      }
    };

    fetchBlocksListForEdit();
  }, [editFormData.project_id]);

  useEffect(() => {
    const fetchPlotsForEdit = async () => {
      if (editFormData.block_id) {
        setLoadingDropdowns(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
            setLoadingDropdowns(false);
            return;
          }

          const response = await fetch(`${API_URL}/property-lead-plot-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ block_id: editFormData.block_id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal(
              "Error",
              errorData.message || "Failed to fetch units for dropdown.",
              "error",
            );
            setPlotsForEdit([]);
            setLoadingDropdowns(false);
            return;
          }

          const data = await response.json();
          setPlotsForEdit(data.data || []);
        } catch (err) {
          console.error("Fetch units for edit error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
              "An unexpected error occurred while fetching units for edit.",
            "error",
          );
          setPlotsForEdit([]);
        } finally {
          setLoadingDropdowns(false);
        }
      } else {
        setPlotsForEdit([]);
      }
    };

    fetchPlotsForEdit();
  }, [editFormData.block_id]);

  const fetchLeads = async (
    page = 1,
    query = "",
    orderid = "",
    mobile = "",
    status = "",
    plotname = "",
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
        setLoading(false);
        return;
      }

      let url = `${API_URL}/property-lead-list?page=${page}&limit=10`;
      if (mobile) url += `&mobile=${mobile}`;
      if (query) url += `&name=${query}`;
      if (orderid) url += `&orderid=${orderid}`;
      if (plotname) url += `&plotname=${plotname}`;
      if (status) url += `&status=${status}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          showCustomMessageModal(
            "Authorization Error",
            "Unauthorized: Please log in again.",
            "error",
          );
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch leads.");
      }

      const data = await response.json();

      setLeads(data.data || []);
      setUserId(data?.data?.length > 0 ? data.data[0].creater_id : null);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Fetch leads error:", err);
      setError(err.message);
      if (!showMessageModal) {
        showCustomMessageModal(
          "Error",
          err.message || "An unexpected error occurred while fetching leads.",
          "error",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchOrder = (e) => {
    setSearchOrder(e.target.value);
  };

  const handleSearchChangeLocation = (e) => {
    setSearchMobile(e.target.value);
  };

  const handleSearchChangesearchPlotName = (e) => {
    setSearchPlotName(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchLeads(
      1,
      searchQuery.trim(),
      searchOrder,
      searchMobile.trim(),
      statusFilter,
      searchPlotName.trim(),
    );
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchOrder("");
    setSearchMobile("");
    setSearchPlotName("");
    setStatusFilter("");
    setCurrentPage(1);
    fetchLeads(1, "", "", "", "", "");
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchLeads(
      1,
      searchQuery.trim(),
      searchOrder,
      searchMobile.trim(),
      status,
      searchPlotName.trim(),
    );
  };

  const handleViewLead = async (id) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/property-lead-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch lead details.",
          "error",
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSelectedLead(data.data);
      setShowViewModal(true);
    } catch (err) {
      showCustomMessageModal(
        "Error",
        "An error occurred while fetching lead details.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleEditLead = async (id) => {
  //   setLoadingEdit(true);
  //   try {
  //     const token = getAuthToken();
  //     const response = await fetch(`${API_URL}/property-lead-edit`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ id }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       showCustomMessageModal("Error", errorData.message || "Failed to fetch lead details for edit.", "error");
  //       setLoadingEdit(false);
  //       return;
  //     }

  //     const data = await response.json();
  //     const leadData = data.data;

  //     setEditFormData({
  //       id: leadData.id,
  //       project_id: leadData.project_id,
  //       block_id: leadData.block_id,
  //       plot_id: leadData.plot_id,
  //       customer_name: leadData.customer_name,
  //       mobile: leadData.mobile,
  //       income_source: leadData.income_source,
  //       adhar_card_number: leadData.adhar_card_number,
  //       pan_card_number: leadData.pan_card_number,
  //       adharfront: leadData.adhar_front_image || null,
  //       adharback: leadData.adhar_back_image || null,
  //       pancard: leadData.pan_card_image || null,
  //       date: leadData.date || "",
  //     });

  //     setShowEditModal(true);
  //   } catch (err) {
  //     showCustomMessageModal("Error", "An unexpected error occurred while fetching lead details for edit.", "error");
  //   } finally {
  //     setLoadingEdit(false);
  //   }
  // };

  const handleEditLead = async (id) => {
    setLoadingEdit(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/property-lead-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch lead details for edit.",
          "error",
        );
        setLoadingEdit(false);
        return;
      }

      const data = await response.json();
      const leadData = data.data;

      let formattedDate = "";
      if (leadData.date) {
        const [day, month, year] = leadData.date.split("-");
        formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      setEditFormData({
        id: leadData.id,
        project_id: leadData.project_id,
        block_id: leadData.block_id,
        plot_id: leadData.plot_id,
        customer_name: leadData.customer_name,
        mobile: leadData.mobile,
        income_source: leadData.income_source,
        adhar_card_number: leadData.adhar_card_number,
        pan_card_number: leadData.pan_card_number,
        adharfront: leadData.adhar_front_image || null,
        adharback: leadData.adhar_back_image || null,
        pancard: leadData.pan_card_image || null,
        lead_date: formattedDate,
      });

      setShowEditModal(true);
    } catch (err) {
      showCustomMessageModal(
        "Error",
        "An unexpected error occurred while fetching lead details for edit.",
        "error",
      );
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleResponseLead = async (id, orderid) => {
    setLoadingResponce(true);
    try {
      setLeadId(id);
      setOrderId(orderid);
      setShowResponceModal(true);
    } catch (err) {
      showCustomMessageModal(
        "Error",
        "An unexpected error occurred while fetching lead details for edit.",
        "error",
      );
    } finally {
      setLoadingResponce(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    setLoadingResponce(true);
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("lead_id", leadId);
      formData.append("response", responseText);

      documentFile.forEach((file) => {
        formData.append("document", file);
      });

      const response = await fetch(`${API_URL}/property-lead-response-store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        showCustomMessageModal(
          "Success",
          "Response submitted successfully",
          "success",
        );
        setShowResponceModal(false);
        setResponseText("");
        setDocumentFile([]);
      } else {
        throw new Error(data.message || "Failed to submit response");
      }

      if (socket && socket.readyState === WebSocket.OPEN) {
        const notificationPayload = {
          user_id: userId,
          type: "property_lead",
          message: `A response has been added for Property Lead ${leadId}.`,
          statusremark: null,
          remark: responseText,
          order_id: orderId,
          action_by: "admin",
          date: new Date().toISOString(),
        };
        socket.send(JSON.stringify(notificationPayload));
        console.warn("notificationPayload", notificationPayload);
      }
    } catch (err) {
      showCustomMessageModal("Error", err.message, "error");
    } finally {
      setLoadingResponce(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setEditFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const [validationErrors, setValidationErrors] = useState({
    project_id: "",
    block_id: "",
    plot_id: "",
    customer_name: "",
    mobile: "",
    adhar_card_number: "",
    pan_card_number: "",
    adharfront: "",
    adharback: "",
    pancard: "",
    lead_date: "",
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!editFormData.project_id) {
      errors.project_id = "Project is required";
      isValid = false;
    }

    if (!editFormData.block_id) {
      errors.block_id = "Block is required";
      isValid = false;
    }

    if (!editFormData.plot_id) {
      errors.plot_id = "Unit is required";
      isValid = false;
    }

    if (
      !editFormData.customer_name ||
      editFormData.customer_name.trim() === ""
    ) {
      errors.customer_name = "Customer name is required";
      isValid = false;
    }

    if (!editFormData.mobile) {
      errors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(editFormData.mobile)) {
      errors.mobile = "Mobile number must be 10 digits";
      isValid = false;
    }

    if (!editFormData.adhar_card_number) {
      errors.adhar_card_number = "Aadhaar number is required";
      isValid = false;
    } else if (!/^\d{12}$/.test(editFormData.adhar_card_number)) {
      errors.adhar_card_number = "Aadhaar must be 12 digits";
      isValid = false;
    }

    if (!editFormData.pan_card_number) {
      errors.pan_card_number = "PAN number is required";
      isValid = false;
    } else if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(editFormData.pan_card_number)) {
      errors.pan_card_number = "Invalid PAN format (e.g., ABCDE1234F)";
      isValid = false;
    }

    if (
      editFormData.adharfront &&
      typeof editFormData.adharfront !== "string"
    ) {
      if (editFormData.adharfront.size > 2 * 1024 * 1024) {
        errors.adharfront = "File size must be less than 2MB";
        isValid = false;
      }
      if (
        !["image/jpeg", "image/png", "application/pdf"].includes(
          editFormData.adharfront.type,
        )
      ) {
        errors.adharfront = "Only JPEG, PNG, or PDF files are allowed";
        isValid = false;
      }
    }
    setValidationErrors(errors);
    return isValid;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoadingEdit(true);
    try {
      const token = getAuthToken();
      const formData = new FormData();

      for (const key in editFormData) {
        if (editFormData[key] !== null) {
          if (typeof editFormData[key] !== "string") {
            formData.append(key, editFormData[key]);
          } else if (
            key !== "adharfront" &&
            key !== "adharback" &&
            key !== "pancard"
          ) {
            formData.append(key, editFormData[key]);
          }
        }
      }

      const selectedProject = projectsForEdit.find(
        (p) => p.id === parseInt(editFormData.project_id),
      );
      if (selectedProject)
        formData.append("project_name", selectedProject.name);

      const selectedBlock = blocksForEdit.find(
        (b) => b.id === parseInt(editFormData.block_id),
      );
      if (selectedBlock) formData.append("block_name", selectedBlock.name);

      const selectedPlot = plotsForEdit.find(
        (p) => p.id === parseInt(editFormData.plot_id),
      );
      if (selectedPlot)
        formData.append("plot_name", selectedPlot.plot_shop_villa_no);

      const response = await fetch(`${API_URL}/property-lead-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update lead.");
      }

      const result = await response.json();

      if (result.success == "1") {
        showCustomMessageModal(
          "Success",
          result.message || "Lead updated successfully.",
          "success",
        );
        setShowEditModal(false);
        fetchLeads(currentPage, searchQuery);
      } else {
        showCustomMessageModal("Error", result.message, "error");
      }
    } catch (err) {
      showCustomMessageModal("Error", err.message, "error");
    } finally {
      setLoadingEdit(false);
    }
  };

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);
      } catch (e) {
        console.log("Raw message:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  const bookProperty = async (projectId, blockId, plotId, userId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/book-now`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: projectId,
          block_id: blockId,
          plot_id: plotId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to book the property.");
      }
      const result = await response.json();
      showCustomMessageModal(
        "Success",
        result.message || "Property booked successfully.",
        "success",
      );
    } catch (err) {
      console.error("Book property error:", err);
      showCustomMessageModal(
        "Error",
        err.message || "An error occurred while booking the property.",
        "error",
      );
    }
  };

  const handleStatusUpdate = async (id, newStatus, orderId) => {
    console.warn("newStatus", newStatus);

    if (
      newStatus === "approved" ||
      newStatus === "notInterested" ||
      newStatus === "unitisnotsold"
    ) {
      const currentLead = leads.find((lead) => lead.id === id);
      if (
        currentLead &&
        (currentLead.status === "approved" ||
          currentLead.status === "notInterested")
      ) {
        showCustomMessageModal(
          "Status Not Changeable",
          "The status cannot be changed from 'Approved' or 'Not Interested'.",
          "error",
        );
        return;
      }
    }

    showCustomMessageModal(
      "Confirm Status Change",
      `Are you sure you want to change the status to ${formatStatus(newStatus)}?`,
      "confirmation",
      async (selectedDate) => {
        setLoading(true);
        try {
          const token = getAuthToken();

          // Create payload
          const payload = {
            id,
            status: newStatus,
          };

          // Add status_date only for approved and unitisnotsold statuses
          if (
            (newStatus === "approved" || newStatus === "unitisnotsold") &&
            selectedDate
          ) {
            payload.status_date = selectedDate;
          }

          console.log("Sending payload:", payload);

          const response = await fetch(
            `${API_URL}/property-lead-update-status`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to update lead status.",
            );
          }

          const result = await response.json();

          closeCustomMessageModal();
          showCustomMessageModal(
            "Success",
            result.message || "Lead status updated successfully.",
            "success",
          );
          fetchLeads(currentPage, searchQuery);

          if (newStatus === "approved") {
            const leadToBook = leads.find((lead) => lead.id === id);
            if (leadToBook) {
              await bookProperty(
                leadToBook.project_id,
                leadToBook.block_id,
                leadToBook.plot_id,
                leadToBook.creater_id,
              );
            }
          }

          if (socket && socket.readyState === WebSocket.OPEN) {
            const notificationPayload = {
              user_id: userId,
              type: "loan_lead",
              message: `Loan lead ${orderId} status changed to ${newStatus}.`,
              statusremark: newStatus,
              remark: null,
              order_id: orderId,
              action_by: "admin",
              date: new Date().toISOString(),
              status_date:
                newStatus === "approved" || newStatus === "unitisnotsold"
                  ? selectedDate
                  : null,
            };
            socket.send(JSON.stringify(notificationPayload));
          }
        } catch (err) {
          closeCustomMessageModal();
          showCustomMessageModal(
            "Error",
            err.message || "An error occurred while updating status.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
      newStatus === "approved" || newStatus === "unitisnotsold", // Show date input only for these statuses
      newStatus,
    );
  };

  const handleDeleteLead = (id) => {
    showCustomMessageModal(
      "Confirm Deletion",
      "Are you sure you want to delete this lead? This action cannot be undone.",
      "confirmation",
      async () => {
        setLoading(true);
        try {
          const token = getAuthToken();
          const response = await fetch(`${API_URL}/property-lead-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete lead.");
          }

          const result = await response.json();
          showCustomMessageModal(
            "Success",
            result.message || "Lead deleted successfully.",
            "success",
          );
          fetchLeads(currentPage, searchQuery);
        } catch (err) {
          showCustomMessageModal(
            "Error",
            err.message || "An error occurred while deleting lead.",
            "error",
          );
        } finally {
          setLoading(false);
          closeCustomMessageModal();
        }
      },
    );
  };

  const handleRemarkList = (leadId, orderid, userId) => {
    navigate(`/lead-remarks/${leadId}/${orderid}/${userId}`);
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: "bg-warning text-white",
      inprocess: "bg-info text-white",
      approved: "bg-success text-white",
      available: "bg-success text-dark",
      sold: "bg-danger",
      new: "bg-warning text-white",
      unitisnotsold: "bg-danger",
    };
    return classes[status] || "bg-secondary";
  };

  const formatStatus = (status) => {
    const statusMap = {
      new: "New",
      documentPending: "Document Pending",
      paymentPending: "Payment Pending",
      notInterested: "Not Interested",
      loanInprocess: "Loan In Process",
      pattaInprocess: "Patta In Process",
      termSheetPending: "Term Sheet Pending",
      agreementSignaturePending: "Agreement Signature Pending",
      pattaApplicationFormPending: "Patta Application Form Pending",
      approved: "Approved",
      unitisnotsold: "Unit is not sold",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  };

  const exportAllToExcel = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login!");
        return;
      }

      let url = `${API_URL}/property-lead-exceldownload`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/csv",
        },
      });

      if (!response.ok) {
        alert("Server Error: Unable to download!");
        return;
      }

      const csvData = await response.text();

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `projects_${Date.now()}.csv`);
      link.click();
    } catch (error) {
      console.error("CSV Export Error:", error);
      alert("Export Failed! Try again");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center m-5" role="alert">
        {error}
        <button className="btn btn-primary ms-3" onClick={() => fetchLeads()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="userlist mt-2">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>All Property Lead</h3>
            </div>
            <div className="d-flex gap-2 align-items-center">
              {!dontallowedDomains.includes(currentDomain) && (
                <div className="createnewadmin">
                  <button
                    className="exportexcel btn gap-2 btn-success d-inline-flex align-items-center"
                    onClick={exportAllToExcel}
                    disabled={exporting}
                  >
                    <FaDownload />
                    {exporting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Exporting All...
                      </>
                    ) : (
                      "Export"
                    )}
                  </button>
                </div>
              )}

              <div className="createnewadmin">
                <Link
                  to="/create-lead"
                  className="btn btn-success d-flex align-items-center"
                >
                  <FaPlus className="me-2" /> Add Lead
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
        </div>

        <div className="card-body">
          <div className="d-flex gap-2 justify-content-end align-items-center">
            <div className="d-none d-md-block">
              <div className="d-flex gap-2 align-items-center">
                {/* <div className="form-group" id="searchOrder">
                  <input
                    type="text"
                    placeholder="Lead ID"
                    value={searchOrder}
                    onChange={handleSearchOrder}
                    className="form-control"
                  />
                </div>

                <div className="form-group" id="searchName">
                  <input
                    type="text"
                    placeholder="Name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="form-control"
                  />
                </div>

                <div className="form-group" id="searchLocation">
                  <input
                    type="text"
                    placeholder="Customer Mobile"
                    value={searchMobile}
                    onChange={handleSearchChangeLocation}
                    className="form-control"
                  />
                </div>

                <div className="form-group" id="searchPlotName">
                  <input
                    type="text"
                    placeholder="Unit Number"
                    value={searchPlotName}
                    onChange={handleSearchChangesearchPlotName}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <select
                    className="form-select text-dark"
                    value={statusFilter}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                  >
                    <option value="">All Status</option>
                    {[
                      "new",
                      "documentPending",
                      "paymentPending",
                      "notInterested",
                      "loanInprocess",
                      "pattaInprocess",
                      "termSheetPending",
                      "agreementSignaturePending",
                      "pattaApplicationFormPending",
                      "approved",
                      "unitisnotsold",
                      "rejected",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-info text-white d-flex align-items-center"
                  onClick={handleSearchClick}
                >
                  Search
                </button> */}
              </div>
            </div>
          </div>

          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              <div className="form-group w-100" id="searchOrder">
                <input
                  type="text"
                  placeholder="Lead ID"
                  value={searchOrder}
                  onChange={handleSearchOrder}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchName">
                <input
                  type="text"
                  placeholder="Name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchLocation">
                <input
                  type="text"
                  placeholder="Customer Mobile"
                  value={searchMobile}
                  onChange={handleSearchChangeLocation}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchPlotName">
                <input
                  type="text"
                  placeholder="Unit Number"
                  value={searchPlotName}
                  onChange={handleSearchChangesearchPlotName}
                  className="form-control"
                />
              </div>

              <div className="w-100 ">
                <select
                  className="form-select w-100 text-dark"
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <option value="">All Status</option>
                  {[
                    "new",
                    "documentPending",
                    "paymentPending",
                    "notInterested",
                    "loanInprocess",
                    "pattaInprocess",
                    "termSheetPending",
                    "agreementSignaturePending",
                    "pattaApplicationFormPending",
                    "approved",
                    "unitisnotsold",
                    "rejected",
                  ].map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-info text-white d-flex align-items-center"
                onClick={handleSearchClick}
              >
                Search
              </button>

              {/* <button
                className="btn bg-secondary d-flex align-items-center text-white"
                onClick={handleClearSearch}
              >
                Clear
              </button> */}
            </div>
          )}

          <div className="table-responsive">
            <Table bordered>
              <thead className="bg-primary text-white">
                <tr>
                  <th>S.N</th>
                  <th>Associate Name</th>
                  <th>Associate Mobile</th>
                  <th>Lead ID</th>
                  <th>Project Name</th>
                  <th>Block Name</th>
                  <th>Unit Number</th>
                  <th>Customer Name</th>
                  <th>Mobile Number</th>
                  <th>Income Source</th>
                  <th>Lead Date</th>
                  <th>Status</th>
                  <th>Remark</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads?.length > 0 ? (
                  leads.map((lead, i) => (
                    <tr key={lead.id}>
                      <td>{(currentPage - 1) * 10 + i + 1}</td>
                      <td>{lead.creator_username}</td>
                      <td>{lead.creator_mobile}</td>
                      <td>{lead.order_id}</td>
                      <td>
                        {lead.project_name
                          ? lead.project_name.charAt(0).toUpperCase() +
                            lead.project_name.slice(1).toLowerCase()
                          : ""}
                      </td>

                      <td>
                        {lead.block_name
                          ? lead.block_name.charAt(0).toUpperCase() +
                            lead.block_name.slice(1).toLowerCase()
                          : ""}
                      </td>

                      <td>
                        {lead.plot_name
                          ? lead.plot_name.charAt(0).toUpperCase() +
                            lead.plot_name.slice(1).toLowerCase()
                          : ""}
                      </td>

                      <td>
                        {lead.customer_name.charAt(0).toUpperCase() +
                          lead.customer_name.slice(1).toLowerCase()}
                      </td>

                      <td>{lead.mobile}</td>
                      <td>{lead.income_source}</td>
                      <td>{lead.date}</td>
                      <td>
                        <div className="w-100">
                          <select
                            className={`form-select custum_mnew custum_all_select ${getStatusBadgeClass(lead.status)}`}
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusUpdate(
                                lead.id,
                                e.target.value,
                                lead.order_id,
                              )
                            }
                            disabled={
                              lead.status === "approved" ||
                              lead.status === "notInterested" ||
                              lead.status == "unitisnotsold"
                            }
                          >
                            {[
                              "new",
                              "documentPending",
                              "paymentPending",
                              "notInterested",
                              "loanInprocess",
                              "pattaInprocess",
                              "termSheetPending",
                              "agreementSignaturePending",
                              "pattaApplicationFormPending",
                              "approved",
                              "unitisnotsold",
                              "rejected",
                            ].map((status) => (
                              <option
                                key={status}
                                value={status}
                                className={getStatusBadgeClass(status)}
                              >
                                {formatStatus(status)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn bg-success btn-sm me-1 dark-text"
                          onClick={() =>
                            handleResponseLead(lead.id, lead.order_id)
                          }
                          title="Remark Lead"
                          disabled={loadingResponce}
                        >
                          {loadingResponce ? "Loading..." : "Add Remark"}
                        </button>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn light btn-action dropdown-toggle"
                            type="button"
                            id={`dropdownMenuButton-${lead.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <BsThreeDots size={20} />
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby={`dropdownMenuButton-${lead.id}`}
                          >
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm me-1"
                                onClick={() => handleViewLead(lead.id)}
                                title="View Lead Details"
                              >
                                <FaEye className="me-2" /> View
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn edit_btn btn-sm me-1"
                                onClick={() => handleEditLead(lead.id)}
                                title="Edit Lead"
                              >
                                <FaEdit className="me-2" /> Edit
                              </button>
                            </li>

                            <li className="dropdown-item">
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleRemarkList(
                                    lead.id,
                                    lead.order_id,
                                    userId,
                                  )
                                }
                                title="Remark History Lead"
                              >
                                <FaEdit className="me-2" /> Remark History Lead
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="14" className="text-center">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      </div>

      {/* View Lead Modal */}
      <Modal
        size="lg"
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Property Lead Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLead ? (
            <Form>
              <div className="row">
                <div className="col-md-12">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="card-title">Customer Details</h5>
                    </div>
                    <div className="card-body p-2">
                      <Form.Group as={Row}>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Project Name:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.project_name}
                            className="fw-semibold"
                          />
                        </Col>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Block Name:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.block_name}
                            className="fw-semibold"
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row}>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Unit Number:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.plot_name}
                            className="fw-semibold"
                          />
                        </Col>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Customer Name:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.customer_name}
                            className="fw-semibold"
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row}>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Mobile Number:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.mobile}
                            className="fw-semibold"
                          />
                        </Col>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Income Source:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.income_source}
                            className="fw-semibold"
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row}>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Aadhaar Card:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.adhar_card_number}
                            className="fw-semibold"
                          />
                        </Col>
                        <Form.Label column sm="3" xs="6" className="text-muted">
                          Pan Card:
                        </Form.Label>
                        <Col sm="3" xs="6">
                          <Form.Control
                            plaintext
                            readOnly
                            defaultValue={selectedLead.pan_card_number}
                            className="fw-semibold"
                          />
                        </Col>
                      </Form.Group>
                    </div>
                  </div>
                </div>

                {/* Right Column - Document Images */}
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">Document Verification</h5>
                    </div>
                    <div className="card-body p-2">
                      <div className="row">
                        {/* Aadhaar Front */}
                        <div className="col-md-4 mb-4">
                          <div className="document-card">
                            <h6 className="document-title">Aadhaar Front</h6>
                            {selectedLead.adhar_front_image ? (
                              <img
                                src={`${imageAPIURL}/lead/${selectedLead.adhar_front_image}`}
                                alt="Aadhaar Front"
                                className="img-thumbnail document-image"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/300x200/cccccc/000000?text=Aadhaar+Front";
                                }}
                              />
                            ) : (
                              <div className="document-placeholder">
                                <i className="bi bi-file-image fs-1 text-muted"></i>
                                <p className="text-muted mt-2">
                                  No image available
                                </p>
                              </div>
                            )}

                            <a
                              href={`${imageAPIURL}/lead/${selectedLead.adhar_front_image}`}
                              download={`${selectedLead.name}_PAN_${selectedLead.adhar_front_image}`}
                              alt={`${selectedLead.name} Main`}
                              target="_blank"
                              className="ms-2 btn btn-primary"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "150px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/200x150/cccccc/000000?text=No+Main+Image";
                              }}
                            >
                              Download
                            </a>
                          </div>
                        </div>

                        {/* Aadhaar Back */}
                        <div className="col-md-4 mb-4">
                          <div className="document-card">
                            <h6 className="document-title">Aadhaar Back</h6>
                            {selectedLead.adhar_back_image ? (
                              <img
                                src={`${imageAPIURL}/lead/${selectedLead.adhar_back_image}`}
                                alt="Aadhaar Back"
                                className="img-thumbnail document-image"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/300x200/cccccc/000000?text=Aadhaar+Back";
                                }}
                              />
                            ) : (
                              <div className="document-placeholder">
                                <i className="bi bi-file-image fs-1 text-muted"></i>
                                <p className="text-muted mt-2">
                                  No image available
                                </p>
                              </div>
                            )}

                            <a
                              href={`${imageAPIURL}/lead/${selectedLead.adhar_back_image}`}
                              download={`${selectedLead.name}_PAN_${selectedLead.adhar_back_image}`}
                              alt={`${selectedLead.name} Main`}
                              target="_blank"
                              className="ms-2 btn btn-primary"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "150px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/200x150/cccccc/000000?text=No+Main+Image";
                              }}
                            >
                              Download
                            </a>
                          </div>
                        </div>

                        {/* PAN Card */}
                        <div className="col-md-4 mb-2">
                          <div className="document-card">
                            <h6 className="document-title">PAN Card</h6>
                            {selectedLead.pan_card_image ? (
                              <img
                                src={`${imageAPIURL}/lead/${selectedLead.pan_card_image}`}
                                alt="PAN Card"
                                className="img-thumbnail document-image"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/300x200/cccccc/000000?text=PAN+Card";
                                }}
                              />
                            ) : (
                              <div className="document-placeholder">
                                <i className="bi bi-file-image fs-1 text-muted"></i>
                                <p className="text-muted mt-2">
                                  No image available
                                </p>
                              </div>
                            )}
                            <a
                              href={`${imageAPIURL}/lead/${selectedLead.pan_card_image}`}
                              download
                              target="_blank"
                              className="ms-2 btn btn-primary"
                              style={{ maxWidth: "200px" }}
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          ) : (
            <p>Loading details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Lead Modal */}
      <Modal
        size="lg"
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        className="formselectnewdesign"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Property Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="editProjectId">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Select
                    name="project_id"
                    value={editFormData.project_id}
                    onChange={handleEditFormChange}
                    disabled={loadingDropdowns || projectsForEdit.length === 0}
                    required
                  >
                    <option value="">Select a Project</option>
                    {projectsForEdit.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Form.Select>
                  {loadingDropdowns && projectsForEdit.length === 0 && (
                    <small className="text-muted">Loading projects...</small>
                  )}
                  {!loadingDropdowns && projectsForEdit.length === 0 && (
                    <small className="text-danger">
                      No projects available.
                    </small>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="editBlockId">
                  <Form.Label>Block Name</Form.Label>
                  <Form.Select
                    name="block_id"
                    value={editFormData.block_id}
                    onChange={handleEditFormChange}
                    disabled={
                      !editFormData.project_id ||
                      loadingDropdowns ||
                      blocksForEdit.length === 0
                    }
                    required
                  >
                    <option value="">Select a Block</option>
                    {blocksForEdit.map((block) => (
                      <option key={block.id} value={block.id}>
                        {block.name}
                      </option>
                    ))}
                  </Form.Select>
                  {editFormData.project_id &&
                    loadingDropdowns &&
                    blocksForEdit.length === 0 && (
                      <small className="text-muted">Loading blocks...</small>
                    )}
                  {editFormData.project_id &&
                    !loadingDropdowns &&
                    blocksForEdit.length === 0 && (
                      <small className="text-danger">
                        No blocks available for this project.
                      </small>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="editBlockId">
                  <Form.Label>Unit Number</Form.Label>
                  <Form.Select
                    name="plot_id"
                    value={editFormData.plot_id}
                    onChange={handleEditFormChange}
                    disabled={!editFormData.block_id || loadingDropdowns}
                    required
                  >
                    <option value="">Select Unit</option>
                    {plotsForEdit.map((plot) => (
                      <option key={plot.id} value={plot.id}>
                        {plot.plot_shop_villa_no}
                      </option>
                    ))}
                  </Form.Select>
                  {editFormData.block_id &&
                    loadingDropdowns &&
                    plotsForEdit.length === 0 && (
                      <small className="text-muted">Loading Unit...</small>
                    )}
                  {editFormData.block_id &&
                    !loadingDropdowns &&
                    plotsForEdit.length === 0 && (
                      <small className="text-danger">
                        No Unit available for this Block.
                      </small>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="customer_name"
                    value={editFormData.customer_name}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="mobile"
                    value={editFormData.mobile}
                    onChange={handleEditFormChange}
                    maxLength={10}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Income Source</Form.Label>
                  <Form.Control
                    as="select"
                    name="income_source"
                    value={editFormData.income_source}
                    onChange={handleEditFormChange}
                  >
                    {incomeSourceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhaar Card Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="adhar_card_number"
                    value={editFormData.adhar_card_number}
                    onChange={handleEditFormChange}
                    maxLength={12}
                    isInvalid={!!validationErrors.adhar_card_number}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.adhar_card_number}
                  </Form.Control.Feedback>
                  <Form.Text muted>Format: 123456789123 (4-4-4)</Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pan Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="pan_card_number"
                    value={editFormData.pan_card_number}
                    onChange={handleEditFormChange}
                    isInvalid={!!validationErrors.pan_card_number}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.pan_card_number}
                  </Form.Control.Feedback>
                  <Form.Text muted>
                    Format: ABCDE1234F (5 letters, 4 digits, 1 letter)
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Booking Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="lead_date"
                    value={editFormData.lead_date}
                    onChange={handleEditFormChange}
                    isInvalid={!!validationErrors.lead_date}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhaar Front</Form.Label>
                  <Form.Control
                    type="file"
                    name="adharfront"
                    onChange={handleEditFormChange}
                  />
                  {editFormData.adharfront && (
                    <div className="mt-2">
                      {typeof editFormData.adharfront === "string" ? (
                        <>
                          <p>Current File:</p>
                          <img
                            src={`${imageAPIURL}/lead/${editFormData.adharfront}`}
                            alt="Aadhaar Front"
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentNode.innerHTML = `<a href="${editFormData.adharfront}" target="_blank" rel="noopener noreferrer">View Current File</a>`;
                            }}
                          />
                        </>
                      ) : (
                        <p>New file selected: {editFormData.adharfront.name}</p>
                      )}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhaar Back</Form.Label>
                  <Form.Control
                    type="file"
                    name="adharback"
                    onChange={handleEditFormChange}
                  />
                  {editFormData.adharback && (
                    <div className="mt-2">
                      {typeof editFormData.adharback === "string" ? (
                        <>
                          <p>Current File:</p>
                          <img
                            src={`${imageAPIURL}/lead/${editFormData.adharback}`}
                            alt="Aadhaar Back"
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentNode.innerHTML = `<a href="${editFormData.adharback}" target="_blank" rel="noopener noreferrer">View Current File</a>`;
                            }}
                          />
                        </>
                      ) : (
                        <p>New file selected: {editFormData.adharback.name}</p>
                      )}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pan Card</Form.Label>
                  <Form.Control
                    type="file"
                    name="pancard"
                    onChange={handleEditFormChange}
                  />
                  {editFormData.pancard && (
                    <div className="mt-2">
                      {typeof editFormData.pancard === "string" ? (
                        <>
                          <p>Current File:</p>
                          <img
                            src={`${imageAPIURL}/lead/${editFormData.pancard}`}
                            alt="Pan Card"
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.parentNode.innerHTML = `<a href="${editFormData.pancard}" target="_blank" rel="noopener noreferrer">View Current File</a>`;
                            }}
                          />
                        </>
                      ) : (
                        <p>New file selected: {editFormData.pancard.name}</p>
                      )}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Button variant="primary" type="submit" disabled={loadingEdit}>
              {loadingEdit ? "Updating..." : "Update Lead"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Response Lead Modal */}
      <Modal
        show={showResponceModal}
        onHide={() => {
          setShowResponceModal(false);
          setDocumentFile([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitResponse}>
            <Form.Group className="mb-3">
              <Form.Label>Remark Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Documents</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocumentFile(Array.from(e.target.files))}
                multiple
              />
              {documentFile?.length > 0 && (
                <div className="mt-2">
                  <small className="text-muted">Selected files:</small>
                  <ul className="list-unstyled">
                    {documentFile.map((file, index) => (
                      <li key={index}>
                        <small>{file.name}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loadingResponce}
              >
                {loadingResponce ? "Submitting..." : "Submit Remark"}
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  setShowResponceModal(false);
                  setDocumentFile([]);
                }}
                disabled={loadingResponce}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Message Modal */}
      <Modal
        show={showMessageModal}
        onHide={() => {
          if (messageModalContent.type !== "confirmation") {
            closeCustomMessageModal();
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{messageModalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <p>{messageModalContent.text}</p>

            {messageModalContent.showDateInput &&
              (messageModalContent.status === "approved" ||
                messageModalContent.status === "unitisnotsold" ||
                messageModalContent.status === "rejected") && (
                <Form.Group className="mt-3">
                  <Form.Label>
                    Status Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={statusUpdateDate}
                    onChange={(e) => {
                      setStatusUpdateDate(e.target.value);
                    }}
                    required
                    min="2020-01-01"
                    max={new Date().toISOString().split("T")[0]}
                  />
                  <Form.Text className="text-muted">
                    Select the date when this status change is effective.
                  </Form.Text>
                </Form.Group>
              )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {messageModalContent.type === "confirmation" && (
            <Button
              variant="primary"
              onClick={() => {
                if (
                  (messageModalContent.status === "approved" ||
                    messageModalContent.status === "unitisnotsold" ||
                    messageModalContent.status === "rejected") &&
                  !statusUpdateDate
                ) {
                  alert("Please select a date for status change.");
                  return;
                }

                if (messageModalContent.confirmAction) {
                  messageModalContent.confirmAction(statusUpdateDate);
                }
              }}
            >
              Confirm
            </Button>
          )}

          <Button
            variant="success"
            onClick={() => {
              closeCustomMessageModal();
            }}
          >
            {messageModalContent.type === "confirmation" ? "Cancel" : "Close"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AllLeadList;
