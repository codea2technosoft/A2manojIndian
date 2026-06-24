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
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function AllLoanList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [leadToDeleteId, setLeadToDeleteId] = useState(null);
  const [response, setResponse] = useState("");
  const [responseError, setResponseError] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [documentFile, setDocumentFile] = useState([]);
  const [userId, setUserId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    customer_name: "",
    mobile: "",
    category: "",
    service: "",
    income_source: "",
    adhar_number: "",
    pan_card_number: "",
    state: "",
    city: "",
    monthly_income: "",
    monthly_emi: "",
    cibil_score: "",
    cibil_score_value: "",
    require_loan_amount: "",
    pincode: "",
    location: "",
    pan_card_image: "",
    adhar_front_image: "",
    adhar_back_image: "",
    current_residence_proof: "",
    permanent_address_proof: "",
    employeeProof_bussinessRegistration: "",
    bank_statement: "",
    bank_statement_current_account: "",
    gst_return: "",
    property_paper: "",
    salary_slip: "",
    itr: "",
    form16: "",
  });

  const [editFiles, setEditFiles] = useState({});
  const [errors, setErrors] = useState({});

  const [searchTerm, setSearchTerm] = useState({
    name: "",
    orderid: "",
    mobile: "",
    category: "",
    service: "",
  });
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const getAuthToken = () => localStorage.getItem("token");

  const showCustomMessageModal = (title, text, type) => {
    setMessageModalContent({ title, text, type });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
  };

  const allowedDomains = [
    "admin.rajasthanirealestates.in",
    "realestateadmin.a2logicgroup.com",
  ];

  const dontallowedDomains = ["master.bahikhatas.com"];

  const currentDomain = window.location.host;

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;
        const response = await fetch(`${API_URL}/state-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch states.");
        }
        const data = await response.json();
        setStates(data.data || []);
      } catch (err) {
        console.error("Fetch states error:", err);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (editFormData.state) {
        try {
          const token = getAuthToken();
          if (!token) return;
          const response = await fetch(`${API_URL}/city-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ state_id: editFormData.state }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch cities.");
          }
          const data = await response.json();
          setCities(data.data || []);
        } catch (err) {
          console.error("Fetch cities error:", err);
        }
      } else {
        setCities([]);
        setEditFormData((prevData) => ({ ...prevData, city: "" }));
      }
    };
    fetchCities();
  }, [editFormData.state]);

  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      const token = getAuthToken();
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        const categoriesResponse = await fetch(
          `${API_URL}/loan-lead-category-list`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.status === "1") {
          setCategoriesList(categoriesData.data);
        } else {
          console.error("Failed to fetch categories:", categoriesData.message);
        }

        const servicesResponse = await fetch(
          `${API_URL}/loan-lead-service-list`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const servicesData = await servicesResponse.json();
        if (servicesData.status === "1") {
          setServicesList(servicesData.data);
        } else {
          console.error("Failed to fetch services:", servicesData.message);
        }
      } catch (error) {
        console.error("Error fetching categories or services:", error);
      }
    };

    fetchCategoriesAndServices();
  }, []);

  const fetchLeads = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found.");

      const query = new URLSearchParams({
        page,
        name: searchTerm.name,
        orderid: searchTerm.orderid,
        mobile: searchTerm.mobile,
        category: searchTerm.category,
        service: searchTerm.service,
      }).toString();

      const response = await fetch(`${API_URL}/loan-lead-list?${query}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch leads.");

      const result = await response.json();
      setLeads(result.data);
      const createrIds = result.data.map((item) => item.creater_id);
      const validIds = createrIds.filter((id) => id != null);
      const firstId = validIds.length > 0 ? validIds[0] : null;
      setUserId(firstId);

      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.currentPage || page);
    } catch (error) {
      console.error("Error fetching loan leads:", error);
      showCustomMessageModal("Error", "Failed to fetch loan leads.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleLead = async (id) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/loan-lead-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to fetch lead details.");
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching single lead:", error);
      showCustomMessageModal("Error", "Failed to fetch lead details.", "error");
      return null;
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handlePageChange = (pageNumber) => fetchLeads(pageNumber, searchQuery);
  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads(1, searchQuery);
  };

  const handleShowResponseModal = (leadId, orderId) => {
    setCurrentLeadId(leadId);
    setOrderId(orderId);
    setShowResponseModal(true);
  };

  const handleViewLead = async (id) => {
    const leadData = await fetchSingleLead(id);
    if (leadData) {
      setSelectedLead(leadData);
      setShowViewModal(true);
    }
  };

  const handleEditLead = async (id) => {
    const leadData = await fetchSingleLead(id);
    if (leadData) {
      setEditFormData({
        id: leadData.id,
        customer_name: leadData.customer_name,
        mobile: leadData.mobile,
        category: leadData.category,
        service: leadData.service,
        income_source: leadData.income_source,
        adhar_number: leadData.adhar_number,
        pan_card_number: leadData.pan_card_number,
        state: leadData.state,
        city: leadData.city,
        monthly_income: leadData.monthly_income,
        monthly_emi: leadData.monthly_emi,
        cibil_score: leadData.cibil_score,
        cibil_score_value: leadData.cibil_score_value,
        require_loan_amount: leadData.require_loan_amount,
        pincode: leadData.pincode,
        location: leadData.location,
        pan_card_image: leadData.pan_card_image || "",
        adhar_front_image: leadData.adhar_front_image || "",
        adhar_back_image: leadData.adhar_back_image || "",
        current_residence_proof: leadData.current_residence_proof || "",
        permanent_address_proof: leadData.permanent_address_proof || "",
        employeeProof_bussinessRegistration:
          leadData.employeeProof_bussinessRegistration || "",
        bank_statement: leadData.bank_statement || "",
        bank_statement_current_account:
          leadData.bank_statement_current_account || "",
        gst_return: leadData.gst_return || "",
        property_paper: leadData.property_paper || "",
        salary_slip: leadData.salary_slip || "",
        itr: leadData.itr || "",
        form16: leadData.form16 || "",
      });
      setShowEditModal(true);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e) => {
    const { name, files } = e.target;
    setEditFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  const [validationErrors, setValidationErrors] = useState({
    category: "",
    service: "",
    plot_id: "",
    customer_name: "",
    mobile: "",
    income_source: "",
    adhar_number: "",
    state: "",
    city: "",
    monthly_income: "",
    require_loan_amount: "",
    pincode: "",
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!editFormData.customer_name) {
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

    if (
      editFormData.adhar_number &&
      !/^\d{12}$/.test(editFormData.adhar_number)
    ) {
      errors.adhar_number = "Aadhar number must be 12 digits";
      isValid = false;
    }

    if (
      editFormData.pan_card_number &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(editFormData.pan_card_number)
    ) {
      errors.pan_card_number = "Invalid PAN card format";
      isValid = false;
    }

    if (editFormData.monthly_income && isNaN(editFormData.monthly_income)) {
      errors.monthly_income = "Monthly income must be a number";
      isValid = false;
    }

    if (
      editFormData.require_loan_amount &&
      isNaN(editFormData.require_loan_amount)
    ) {
      errors.require_loan_amount = "Loan amount must be a number";
      isValid = false;
    }

    if (editFormData.pincode && !/^\d{6}$/.test(editFormData.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!editFormData.customer_name || !editFormData.mobile) {
      setErrors({ customer_name: "Required", mobile: "Required" });
      return;
    }

    try {
      const token = getAuthToken();
      const formPayload = new FormData();
      Object.keys(editFormData).forEach((key) => {
        formPayload.append(key, editFormData[key]);
      });
      Object.keys(editFiles).forEach((key) => {
        formPayload.append(key, editFiles[key]);
      });

      const response = await fetch(`${API_URL}/loan-lead-update`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update project.");
      }

      const result = await response.json();

      if (result.success == "1") {
        showCustomMessageModal(
          "Success",
          "Lead updated successfully!",
          "success",
        );
        setShowEditModal(false);
        fetchLeads(currentPage, searchQuery);
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      showCustomMessageModal("Error", "Failed to update lead.", "error");
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) {
      setResponseError("Response cannot be empty.");
      return;
    }
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("lead_id", currentLeadId);
      formData.append("response", response);
      documentFile.forEach((file) => {
        formData.append("documents", file);
      });

      const res = await fetch(`${API_URL}/loan-lead-response-store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to store response.");
      setShowResponseModal(false);
      setResponse("");
      setResponseError("");
      fetchLeads(currentPage, searchQuery);
      showCustomMessageModal(
        "Success",
        "Response added successfully!",
        "success",
      );

      if (socket && socket.readyState === WebSocket.OPEN) {
        const notificationPayload = {
          user_id: userId,
          type: "loan_lead",
          message: `A response has been added for Loan Lead ${currentLeadId}.`,
          statusremark: null,
          remark: response,
          order_id: orderId,
          action_by: "admin",
        };
        socket.send(JSON.stringify(notificationPayload));

        console.warn("WebSocket dddd", notificationPayload);

        console.warn("notificationPayload", notificationPayload);
      }
    } catch (error) {
      console.error("Error storing response:", error);
      showCustomMessageModal("Error", "Failed to add response.", "error");
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

  const handleStatusUpdate = async (id, newStatus) => {
    console.log("Status change initiated:", { id, newStatus });
    const originalLead = leads.find((lead) => lead.id === id);
    const originalStatus = originalLead?.status;
    const orderId = originalLead?.order_id;

    try {
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === id ? { ...lead, status: newStatus } : lead,
        ),
      );

      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      setLoading(true);
      console.log("Making API request...");

      const response = await fetch(`${API_URL}/loan-lead-update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update lead status");
      }

      const result = await response.json();
      if (result.success == "1") {
        showCustomMessageModal(
          "Success",
          result.message || "Lead status updated successfully",
          "success",
        );
        fetchLeads(currentPage, searchQuery);

        if (socket && socket.readyState === WebSocket.OPEN) {
          const notificationPayload = {
            user_id: userId,
            type: "loan_lead",
            message: `A new loan lead status has been changed.`,
            statusremark: newStatus,
            remark: null,
            order_id: orderId,
            action_by: "admin",
          };
          socket.send(JSON.stringify(notificationPayload));
          console.log("📡 Notification sent via WebSocket");
          console.warn("WebSocket", notificationPayload);
        }
      } else {
        showCustomMessageModal(
          "Error",
          result.message || "Somthing Went Wrong",
          "error",
        );
      }
    } catch (err) {
      console.error("Status update error:", err);

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === id ? { ...lead, status: originalStatus } : lead,
        ),
      );

      showCustomMessageModal(
        "Error",
        err.message || "An error occurred while updating status",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      new: "New",
      documentPending: "Document Pending",
      sanctionInProcess: "Sanction in Process",
      sanctioned: "Sanctioned",
      disbursementInProcess: "Disbursement in Process",
      disbursed: "Disbursed",
      propertyOriginalDocumentPending: "Property Original Document Pending",
      rejected: "Rejected",
      notintersted: "Not intersted",
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: "bg-warning text-white",
      inprocess: "bg-info text-white",
      approved: "bg-success text-white",
      notInterested: "bg-danger",
      available: "bg-success text-dark",
      sold: "bg-danger",
      new: "bg-warning text-white",
    };
    return classes[status] || "bg-secondary";
  };

  const handleShowConfirmModal = (leadId) => {
    setLeadToDeleteId(leadId);
    setShowConfirmModal(true);
  };

  const handleDeleteLead = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/loan-lead-delete/${leadToDeleteId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete lead.");
      setShowConfirmModal(false);
      fetchLeads(currentPage, searchQuery);
      showCustomMessageModal(
        "Success",
        "Lead deleted successfully!",
        "success",
      );
    } catch (error) {
      console.error("Error deleting lead:", error);
      showCustomMessageModal("Error", "Failed to delete lead.", "error");
    }
  };

  const handleRemarkList = (leadId, orderid, userId) => {
    navigate(`/loan-remarks/${leadId}/${orderid}/${userId}`);
  };

  const exportAllToExcel = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login!");
        return;
      }

      let url = `${API_URL}/loan-lead-exceldownload`;

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

  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  return (
    <div className="userlist mt-2">
      <div className="card shadow-sm">
        <div className="card-header">
          <div className="d-flex flex-wrap-mobile gap-2 align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Loan Lead List</h3>
            </div>

            <div className="d-flex gap-2">
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

              <Link to="/create-loan" className="btn btn-primary">
                <FaPlus className="me-2" /> Create Lead
              </Link>
              <button
                className={`filter-toggle-btn btn ${isFilterActive ? "active" : ""}`}
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
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 flex-wrap-mobile">
              <div className="form_design w-100">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={searchTerm.name}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form_design w-100">
                <input
                  type="text"
                  name="orderid"
                  placeholder="Loan Id"
                  value={searchTerm.orderid}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form_design w-100">
                <input
                  type="number"
                  name="mobile"
                  placeholder="Mobile number"
                  value={searchTerm.mobile}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form_design w-100">
                <select
                  name="category"
                  className=""
                  value={searchTerm.category}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                >
                  <option value="">Category</option>
                  {categoriesList.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form_design w-100">
                <select
                  name="service"
                  className=""
                  value={searchTerm.service}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                >
                  <option value="">Service</option>
                  {servicesList.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form_design">
                <button
                  type="button"
                  className="submit_button btn text-white"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          )}
          {loading ? (
            <p>Loading leads...</p>
          ) : leads?.length === 0 ? (
            <p className="text-center mt-4">No loan leads found.</p>
          ) : (
            <>
              {/* <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Lead ID</th>
                    <th>Customer Name</th>
                    <th>Mobile</th>
                    <th>Category</th>
                    <th>Services</th>
                    <th>Status</th>
                    <th>Lead Date</th>
                    <th>Remark</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads && leads.map((lead, index) => (
                    <tr key={lead.id}>
                      <td>{index + 1}</td>
                      <td>{lead.order_id}</td>
                      <td>{lead.customer_name}</td>
                      <td>{lead.mobile}</td>
                      <td>{lead.category}</td>
                      <td>{lead.service}</td>
                      <td>
                        <select
                          className={`form-select custum_all_select ${getStatusBadgeClass(lead.status)}`}
                          value={lead.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            console.log('Select changed to:', newStatus);
                            await handleStatusUpdate(lead.id, newStatus);
                          }}
                          disabled={loading}
                        >
                          {["new", "documentPending", "sanctionInProcess", "sanctioned", "disbursementInProcess", "disbursed", "propertyOriginalDocumentPending"].map((status) => (
                            <option
                              key={status}
                              value={status}
                              className={getStatusBadgeClass(status)}
                            >
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{lead.date}</td>
                      <td>
                        <button
                          className="btn bg-success btn-sm me-1 text-white"
                          onClick={() => handleShowResponseModal(lead.id, lead.order_id)}
                          title="Add Response"
                        >
                          Add Remark
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
                          <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${lead.id}`}>
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
                                title="Edit Loan"
                              >
                                <FaEdit className="me-2" /> Edit
                              </button>
                            </li>

                            <li className="dropdown-item">
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemarkList(lead.id, lead.order_id, userId)}
                                title="Remark Loan Lead"
                              >
                                <FaEdit className="me-2" /> Remark History Loan
                              </button>
                            </li>

                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table> */}

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Lead ID</th>
                    <th>Customer Name</th>
                    <th>Mobile</th>
                    <th>Category</th>
                    <th>Services</th>
                    <th>Status</th>
                    <th>Lead Date</th>
                    <th>Remark</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads &&
                    leads.map((lead, index) => (
                      <tr key={lead.id}>
                        <td>{(currentPage - 1) * 10 + index + 1}</td>
                        <td>{lead.order_id}</td>
                        <td>
                          {lead.customer_name
                            ? lead.customer_name.charAt(0).toUpperCase() +
                              lead.customer_name.slice(1).toLowerCase()
                            : ""}
                        </td>

                        <td>{lead.mobile}</td>
                        <td>
                          {lead.category
                            ? lead.category.charAt(0).toUpperCase() +
                              lead.category.slice(1).toLowerCase()
                            : ""}
                        </td>

                        <td>
                          {lead.service
                            ? lead.service.charAt(0).toUpperCase() +
                              lead.service.slice(1).toLowerCase()
                            : ""}
                        </td>

                        <td>
                          <select
                            className={`form-select custum_all_select ${getStatusBadgeClass(lead.status)}`}
                            value={lead.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              console.log("Select changed to:", newStatus);
                              await handleStatusUpdate(lead.id, newStatus);
                            }}
                            disabled={loading}
                          >
                            {[
                              "new",
                              "documentPending",
                              "sanctionInProcess",
                              "sanctioned",
                              "disbursementInProcess",
                              "disbursed",
                              "propertyOriginalDocumentPending",
                              "rejected",
                              "notintersted",
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
                        </td>
                        <td>{lead.date}</td>
                        <td>
                          <button
                            className="btn bg-success btn-sm me-1 text-white"
                            onClick={() =>
                              handleShowResponseModal(lead.id, lead.order_id)
                            }
                            title="Add Response"
                          >
                            Add Remark
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
                                  title="Edit Loan"
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
                                  title="Remark Loan Lead"
                                >
                                  <FaEdit className="me-2" /> Remark History
                                  Loan
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </>
          )}
          <div className="d-flex justify-content-end">
            <nav>
              <ul className="pagination">
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous"
                  >
                    <HiOutlineChevronLeft />
                  </button>
                </li>

                {[...Array(totalPages)].map((_, index) => (
                  <li key={index + 1} className="page-item">
                    <button
                      className={`page-link ${index + 1 === currentPage ? "active" : ""}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next"
                  >
                    <HiChevronRight />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <Modal
        show={showResponseModal}
        onHide={() => {
          setShowResponseModal(false);
          setDocumentFile([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleResponseSubmit}>
            <Form.Group controlId="responseTextArea" className="mb-3">
              <Form.Label>Remark Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                isInvalid={!!responseError}
              />
              <Form.Control.Feedback type="invalid">
                {responseError}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Documents</Form.Label>
              <Form.Control
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setDocumentFile(Array.from(e.target.files))}
                multiple
              />
              {documentFile && documentFile.length > 0 && (
                <div className="mt-2">
                  <small className="text-muted">Selected files:</small>
                  <ul className="list-unstyled">
                    {documentFile.map((file, index) => (
                      <li key={index}>
                        <small>
                          {file.name} ({Math.round(file.size / 1024)} KB)
                        </small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="danger"
                onClick={() => {
                  setShowResponseModal(false);
                  setDocumentFile([]);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="ms-2"
                disabled={!response && documentFile?.length === 0}
              >
                Save Remark
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Lead Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLead && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Customer Name:</strong> {selectedLead.customer_name}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Mobile:</strong> {selectedLead.mobile}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Category:</strong> {selectedLead.category}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Service:</strong> {selectedLead.service}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Income Source:</strong> {selectedLead.income_source}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Adhar Number:</strong> {selectedLead.adhar_number}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Pan Card Number:</strong> {selectedLead.pan_card_number}
              </div>
              <div className="col-md-6 mb-3">
                <strong>State:</strong> {selectedLead.state_name}
              </div>
              <div className="col-md-6 mb-3">
                <strong>City:</strong> {selectedLead.city_name}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Monthly Income:</strong> {selectedLead.monthly_income}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Monthly EMI:</strong> {selectedLead.monthly_emi}
              </div>
              <div className="col-md-6 mb-3">
                <strong>CIBIL Score:</strong> {selectedLead.cibil_score}
              </div>
              <div className="col-md-6 mb-3">
                <strong>CIBIL Value:</strong> {selectedLead.cibil_score_value}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Required Loan:</strong>{" "}
                {selectedLead.require_loan_amount}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Pincode:</strong> {selectedLead.pincode}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Location:</strong> {selectedLead.location}
              </div>

              <hr className="my-4" />
              <h5 className="mb-3">Uploaded Documents</h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  {selectedLead.adhar_front_image && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>Adhar Front:</strong>
                      </div>
                      <img
                        src={`${imageAPIURL}/loanlead/${selectedLead.adhar_front_image}`}
                        alt={`${selectedLead.name} Main`}
                        className="img-fluid rounded mt-2"
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
                      />
                      <button
                        className="ms-2 btn btn-primary"
                        onClick={() => {
                          window.open(
                            `${imageAPIURL}/loanlead/${selectedLead.adhar_front_image}`,
                            "_blank",
                          );
                        }}
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-md-4 mb-3">
                  {selectedLead.adhar_back_image && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>Adhar Back:</strong>
                      </div>

                      <img
                        src={`${imageAPIURL}/loanlead/${selectedLead.adhar_back_image}`}
                        alt={`${selectedLead.name} Main`}
                        className="img-fluid rounded"
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
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          window.open(
                            `${imageAPIURL}/loanlead/${selectedLead.adhar_back_image}`,
                            "_blank",
                          );
                        }}
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>
                <div className="col-md-4 mb-3">
                  {selectedLead.pan_card_image && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong>PAN Card:</strong>
                      </div>

                      <img
                        src={`${imageAPIURL}/loanlead/${selectedLead.pan_card_image}`}
                        alt={`${selectedLead.name} PAN Card`}
                        className="img-fluid rounded"
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
                      />
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          window.open(
                            `${imageAPIURL}/loanlead/${selectedLead.pan_card_image}`,
                            "_blank",
                          );
                        }}
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.current_residence_proof && (
                    <div className="mb-3">
                      <strong>Current Residence Proof:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.current_residence_proof}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.bank_statement && (
                    <div className="mb-3">
                      <strong>Bank Statement:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.bank_statement}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.bank_statement_current_account && (
                    <div className="mb-3">
                      <strong>Bank Statement Current Account:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.bank_statement_current_account}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.gst_return && (
                    <div className="mb-3">
                      <strong>GST Return:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.gst_return}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.property_paper && (
                    <div className="mb-3">
                      <strong>Property Paper:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.property_paper}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.permanent_address_proof && (
                    <div className="mb-3">
                      <strong>Permanent Address Proof:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.permanent_address_proof}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.employeeProof_bussinessRegistration && (
                    <div className="mb-3">
                      <strong>Employee Proof Bussiness Registration:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.employeeProof_bussinessRegistration}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.salary_slip && (
                    <div className="mb-3">
                      <strong>Salary Slip:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.salary_slip}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.form16 && (
                    <div className="mb-3">
                      <strong>Form 16:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.form16}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  {selectedLead.itr && (
                    <div className="mb-3">
                      <strong>ITR:</strong>
                      <br />
                      <a
                        href={`${imageAPIURL}/loanlead/${selectedLead.itr}`}
                        download
                        alt={`${selectedLead.name} Main`}
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
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        className="formselectnewdesign"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Loan Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Row>
              <Col md={12}>
                <div class="card_title_all mb-3">User Details</div>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Customer Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="customer_name"
                    value={editFormData.customer_name}
                    onChange={handleEditFormChange}
                    isInvalid={!!errors.customer_name}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.customer_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Mobile*</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={editFormData.mobile}
                    onChange={handleEditFormChange}
                    isInvalid={!!validationErrors.mobile}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.mobile}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Category</Form.Label>

                  <Form.Control
                    as="select"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditFormChange}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Select Category</option>
                    {categoriesList.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Service</Form.Label>

                  <Form.Control
                    as="select"
                    name="service"
                    value={editFormData.service}
                    onChange={handleEditFormChange}
                    isInvalid={!!errors.service}
                  >
                    <option value="">Select Service</option>
                    {servicesList.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Income Source</Form.Label>
                  <Form.Control
                    as="select"
                    name="income_source"
                    value={editFormData.income_source}
                    onChange={handleEditFormChange}
                  >
                    <option value="">Select Income Source</option>
                    <option value="business">Business</option>
                    <option value="salaried">Salaried</option>
                    <option value="rent">Rent</option>
                    <option value="pension">Pension</option>
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Adhar Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="adhar_number"
                    value={editFormData.adhar_number}
                    onChange={handleEditFormChange}
                    isInvalid={!!validationErrors.adhar_number}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.adhar_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>PAN Card Number</Form.Label>
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
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    name="state"
                    value={editFormData.state}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={String(state.id)}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Select
                    name="city"
                    value={editFormData.city}
                    onChange={handleEditFormChange}
                    required
                    disabled={!editFormData.state || cities.length === 0}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Monthly Income</Form.Label>
                  <Form.Control
                    type="text"
                    name="monthly_income"
                    value={editFormData.monthly_income}
                    onChange={handleEditFormChange}
                    isInvalid={!!validationErrors.monthly_income}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.monthly_income}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Monthly EMI</Form.Label>
                  <Form.Control
                    type="text"
                    name="monthly_emi"
                    value={editFormData.monthly_emi}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>CIBIL Score</Form.Label>
                  <Form.Control
                    type="text"
                    name="cibil_score"
                    value={editFormData.cibil_score}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>CIBIL Score Value</Form.Label>
                  <Form.Control
                    type="text"
                    name="cibil_score_value"
                    value={editFormData.cibil_score_value}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Required Loan Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="require_loan_amount"
                    value={editFormData.require_loan_amount}
                    onChange={handleEditFormChange}
                    isInvalid={!!validationErrors.require_loan_amount}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.require_loan_amount}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={editFormData.pincode}
                    onChange={handleEditFormChange}
                    isInvalid={!!validationErrors.pincode}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.pincode}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* File Upload Sections */}

            <Row>
              <Col md={12}>
                <div class="card_title_all mb-3">Document Uploads</div>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Adhar Front Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="adhar_front_image"
                    onChange={handleEditFileChange}
                    accept="image/*"
                  />
                  {editFormData.adhar_front_image && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.adhar_front_image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current Image
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Adhar Back Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="adhar_back_image"
                    onChange={handleEditFileChange}
                    accept="image/*"
                  />
                  {editFormData.adhar_back_image && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.adhar_back_image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current Image
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>PAN Card Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="pan_card_image"
                    onChange={handleEditFileChange}
                    accept="image/*"
                  />
                  {editFormData.pan_card_image && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.pan_card_image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current Image
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Current Residence Proof (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="current_residence_proof"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.current_residence_proof && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.current_residence_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Permanent Address Proof (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="permanent_address_proof"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.permanent_address_proof && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.permanent_address_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>
                    Employee/Business Registration Proof (PDF)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="employeeProof_bussinessRegistration"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.employeeProof_bussinessRegistration && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.employeeProof_bussinessRegistration}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Bank Statement (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="bank_statement"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.bank_statement && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.bank_statement}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>
                    Bank Statement - Current Account (PDF)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="bank_statement_current_account"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.bank_statement_current_account && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.bank_statement_current_account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>GST Return (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="gst_return"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.gst_return && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.gst_return}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Property Paper (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="property_paper"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.property_paper && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.property_paper}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Salary Slip (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="salary_slip"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.salary_slip && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.salary_slip}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>ITR (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="itr"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.itr && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.itr}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="position-relative mb-3">
                  <Form.Label>Form 16 (PDF)</Form.Label>
                  <Form.Control
                    type="file"
                    name="form16"
                    onChange={handleEditFileChange}
                    accept=".pdf"
                  />
                  {editFormData.form16 && (
                    <div className="buttonviewallimages">
                      <a
                        href={`${imageAPIURL}/loanlead/${editFormData.form16}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Current PDF
                      </a>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="danger" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="ms-2">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this lead? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteLead}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={closeCustomMessageModal} centered>
        <Modal.Header
          closeButton
          className={`border-top border-4 ${
            messageModalContent.type === "success"
              ? "border-success"
              : messageModalContent.type === "error"
                ? "border-danger"
                : "border-warning"
          }`}
        >
          <Modal.Title
            className={`modal-title ${
              messageModalContent.type === "success"
                ? "text-success"
                : messageModalContent.type === "error"
                  ? "text-danger"
                  : "text-warning"
            }`}
          >
            {messageModalContent.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-secondary">
          <p>{messageModalContent.text}</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant={
              messageModalContent.type === "success"
                ? "success"
                : messageModalContent.type === "error"
                  ? "danger"
                  : "primary"
            }
            onClick={closeCustomMessageModal}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AllLoanList;
