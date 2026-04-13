import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import {
  MdAirplanemodeInactive,
  MdAirplanemodeActive,
  MdOutlineUpcoming,
  MdUpcoming,
} from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import Select from "react-select";

import * as XLSX from "xlsx";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const profileImage = `${process.env.REACT_APP_Image_URL}/profile/`;

const allowedDomains = [
  "admin.rajasthanirealestates.in",
  "realestateadmin.a2logicgroup.com",
];

const dontallowedDomains = ["master.bahikhatas.com"];

const currentDomain = window.location.host;

function AllAssociateList() {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [exporting, setExporting] = useState(false);
  const searchTimeoutRef = useRef(null);

  // State and City related states
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [editFormData, setEditFormData] = useState({
    id: "",
    username: "",
    email: "",
    mobile: "",
    whatsapp_number: "",
    parent_id: "",
    state: "",
    city: "",
    area: "",
    dob: "",
    marriage_anniversary_date: "",
    rera_number: "",
    address: "",
    pincode: "",
    pan_number: "",
    adhar_number: "",
    adhar_fornt_image: null,
    adhar_back_image: null,
    pan_card_image: null,
  });

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const [currentParentId, setCurrentParentId] = useState("");

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
    });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  // Fetch States
  const fetchStates = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const response = await fetch(`${API_URL}/state-list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setStates(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  // Fetch Cities based on State
  const fetchCities = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    try {
      const token = getAuthToken();
      if (!token) return;
      const response = await fetch(`${API_URL}/city-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ state_id: stateId }),
      });
      const data = await response.json();
      if (response.ok) {
        setCities(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (editFormData.state) {
      fetchCities(editFormData.state);
    } else {
      setCities([]);
    }
  }, [editFormData.state]);

  const stateOptions = states.map((state) => ({
    value: state.id,
    label: state.name,
  }));

  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: city.name,
  }));

  const fetchCurrentParentId = async (userId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(
        `${API_URL}/get-current-parent-from-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to fetch current parent ID:", errorData.message);
        return null;
      }

      const data = await response.json();
      if (data.success === "1") {
        return data.data.current_parent_id;
      }
      return null;
    } catch (err) {
      console.error("Fetch current parent ID error:", err);
      return null;
    }
  };

  const fetchAssociates = async (
    page = 1,
    username = "",
    mobile = "",
    location = "",
  ) => {
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
        throw new Error("Authentication token not found. Please log in.");
      }

      let url = `${API_URL}/Associate-list?page=${page}&limit=10`;
      if (username) url += `&username=${username}`;
      if (mobile) url += `&mobile=${mobile}`;
      if (location) url += `&parent_id=${location}`;

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
          throw new Error("Unauthorized: Please log in again.");
        }
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch associates.",
          "error",
        );
        throw new Error(errorData.message || "Failed to fetch associates.");
      }
      const data = await response.json();

      setAssociates(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch associates error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociates(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const exportAllToExcel = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login!");
        return;
      }

      let url = `${API_URL}/Associate-excel-download`;
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
      link.setAttribute("download", `associates_${Date.now()}.csv`);
      link.click();
    } catch (error) {
      console.error("CSV Export Error:", error);
      alert("Export Failed! Try again");
    }
  };

  // const handleViewAssociate = async (associateId) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const token = getAuthToken();
  //     if (!token) {
  //       showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
  //       throw new Error("Authentication token not found. Please log in.");
  //     }

  //     const response = await fetch(`${API_URL}/Associate-view`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ id: associateId }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       showCustomMessageModal("Error", errorData.message || "Failed to fetch associate details.", "error");
  //       throw new Error(errorData.message || "Failed to fetch associate details.");
  //     }

  //     const data = await response.json();
  //     setSelectedAssociate(data.data);
  //     setShowViewModal(true);
  //   } catch (err) {
  //     console.error("View associate error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleViewAssociate = async (associateId) => {
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
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`${API_URL}/Associate-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: associateId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch associate details.",
          "error",
        );
        throw new Error(
          errorData.message || "Failed to fetch associate details.",
        );
      }

      const data = await response.json();
      setSelectedAssociate(data.data);

      // ✅ अगर state ID है तो cities fetch करें
      if (data.data?.state) {
        await fetchCities(data.data.state);
      }

      setShowViewModal(true);
    } catch (err) {
      console.error("View associate error:", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleEditAssociate = async (associateId) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const token = getAuthToken();
  //     if (!token) {
  //       throw new Error("Authentication token not found. Please log in.");
  //     }

  //     const response = await fetch(`${API_URL}/Associate-view`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ id: associateId }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       showCustomMessageModal("Error", errorData.message || "Failed to fetch associate for editing.", "error");
  //       throw new Error(errorData.message || "Failed to fetch associate for editing.");
  //     }

  //     const data = await response.json();
  //     const associateData = data.data;
  //     setSelectedAssociate(associateData);

  //     const currentParent = await fetchCurrentParentId(associateData.id);
  //     setCurrentParentId(currentParent || "");

  //     setEditFormData({
  //       id: associateData.id || "",
  //       username: associateData.username || "",
  //       email: associateData.email || "",
  //       mobile: associateData.mobile || "",
  //       whatsapp_number: associateData.whatsapp_number || "",
  //       parent_id: associateData.parent_id || "",
  //       state: associateData.state?.id || "",
  //       city: associateData.city?.id || "",
  //       area: associateData.area || "",
  //       dob: associateData.dob || "",
  //       marriage_anniversary_date: associateData.marriage_anniversary_date || "",
  //       rera_number: associateData.rera_number || "",
  //       address: associateData.address || "",
  //       pincode: associateData.pincode || "",
  //       pan_number: associateData.pan_number || "",
  //       adhar_number: associateData.adhar_number || "",
  //       adhar_front_image: null,
  //       adhar_back_image: null,
  //       pan_card_image: null,
  //     });

  //     setShowEditModal(true);
  //   } catch (err) {
  //     console.error("Edit associate error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleEditAssociate = async (associateId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`${API_URL}/Associate-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: associateId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch associate for editing.",
          "error",
        );
        throw new Error(
          errorData.message || "Failed to fetch associate for editing.",
        );
      }

      const data = await response.json();
      const associateData = data.data;
      setSelectedAssociate(associateData);

      const currentParent = await fetchCurrentParentId(associateData.id);
      setCurrentParentId(currentParent || "");

      // ✅ यहाँ state और city को Number में convert करें
      const stateId = associateData.state ? Number(associateData.state) : "";
      const cityId = associateData.city ? Number(associateData.city) : "";

      setEditFormData({
        id: associateData.id || "",
        username: associateData.username || "",
        email: associateData.email || "",
        mobile: associateData.mobile || "",
        whatsapp_number: associateData.whatsapp_number || "",
        parent_id: associateData.parent_id || "",
        state: stateId, // ✅ Number में
        city: cityId, // ✅ Number में
        area: associateData.area || "",
        dob: associateData.dob || "",
        marriage_anniversary_date:
          associateData.marriage_anniversary_date || "",
        rera_number: associateData.rera_number || "",
        address: associateData.address || "",
        pincode: associateData.pincode || "",
        pan_number: associateData.pan_number || "",
        adhar_number: associateData.adhar_number || "",
        adhar_fornt_image: null,
        adhar_back_image: null,
        pan_card_image: null,
      });

      // ✅ state set होने के बाद cities fetch करें
      if (stateId) {
        await fetchCities(stateId);
      }

      setShowEditModal(true);
    } catch (err) {
      console.error("Edit associate error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({
        ...editFormData,
        [fieldName]: file,
      });
    }
  };

  // const handleUpdateAssociate = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const token = getAuthToken();
  //     if (!token) {
  //       showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
  //       throw new Error("Authentication token not found. Please log in.");
  //     }

  //     const formData = new FormData();

  //     // Append all fields
  //     formData.append('id', editFormData.id);
  //     formData.append('username', editFormData.username || '');
  //     formData.append('email', editFormData.email || '');
  //     formData.append('mobile', editFormData.mobile || '');
  //     formData.append('whatsapp_number', editFormData.whatsapp_number || '');
  //     formData.append('parent_id', editFormData.parent_id || '');
  //     formData.append('state', editFormData.state || '');
  //     formData.append('city', editFormData.city || '');
  //     formData.append('area', editFormData.area || '');
  //     formData.append('dob', editFormData.dob || '');
  //     formData.append('marriage_anniversary_date', editFormData.marriage_anniversary_date || '');
  //     formData.append('rera_number', editFormData.rera_number || '');
  //     formData.append('address', editFormData.address || '');
  //     formData.append('pincode', editFormData.pincode || '');
  //     formData.append('pan_number', editFormData.pan_number || '');
  //     formData.append('adhar_number', editFormData.adhar_number || '');

  //     // Append images if they are new files
  //     if (editFormData.adhar_front_image instanceof File) {
  //       formData.append('adhar_front_image', editFormData.adhar_front_image);
  //     }
  //     if (editFormData.adhar_back_image instanceof File) {
  //       formData.append('adhar_back_image', editFormData.adhar_back_image);
  //     }
  //     if (editFormData.pan_card_image instanceof File) {
  //       formData.append('pan_card_image', editFormData.pan_card_image);
  //     }

  //     const response = await fetch(`${API_URL}/Associate-update`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       showCustomMessageModal("Error", errorData.message || "Failed to update associate.", "error");
  //       throw new Error(errorData.message || "Failed to update associate.");
  //     }

  //     const result = await response.json();
  //     if (result.success == '1') {
  //       showCustomMessageModal("Success", "Associate has been updated successfully!", "success");
  //       setShowEditModal(false);
  //       fetchAssociates(currentPage);
  //     } else {
  //       showCustomMessageModal("Error", result.message || "Something went wrong", "error");
  //     }
  //   } catch (err) {
  //     console.error("Update associate error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpdateAssociate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Error", "Token not found", "error");
        return;
      }

      const formData = new FormData();

      // ✅ ID form-data mein bhej
      formData.append("id", editFormData.id);
      formData.append("username", editFormData.username || "");
      formData.append("email", editFormData.email || "");
      formData.append("mobile", editFormData.mobile || "");
      formData.append("whatsapp_number", editFormData.whatsapp_number || "");
      formData.append("parent_id", editFormData.parent_id || "");
      formData.append("state", editFormData.state || "");
      formData.append("city", editFormData.city || "");
      formData.append("area", editFormData.area || "");
      formData.append("dob", editFormData.dob || "");
      formData.append(
        "marriage_anniversary_date",
        editFormData.marriage_anniversary_date || "",
      );
      formData.append("rera_number", editFormData.rera_number || "");
      formData.append("address", editFormData.address || "");
      formData.append("pincode", editFormData.pincode || "");
      formData.append("pan_number", editFormData.pan_number || "");
      formData.append("adhar_number", editFormData.adhar_number || "");

      // ✅ Files
      if (editFormData.adhar_fornt_image instanceof File) {
        formData.append("adhar_fornt_image", editFormData.adhar_fornt_image);
      }
      if (editFormData.adhar_back_image instanceof File) {
        formData.append("adhar_back_image", editFormData.adhar_back_image);
      }
      if (editFormData.pan_card_image instanceof File) {
        formData.append("pan_card_image", editFormData.pan_card_image);
      }

      // ✅ URL - Bilkul profile-update jaisa, koi :id nahi
      const response = await fetch(`${API_URL}/Associate-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success === "1") {
        showCustomMessageModal("Success", "Updated successfully!", "success");
        setShowEditModal(false);
        fetchAssociates(currentPage);
      } else {
        showCustomMessageModal("Error", result.message, "error");
      }
    } catch (err) {
      console.error(err);
      showCustomMessageModal("Error", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (associateId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    showCustomMessageModal(
      "Confirm Status Change",
      `Do you want to change the status to ${newStatus}?`,
      "warning",
      async () => {
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
            throw new Error("Authentication token not found. Please log in.");
          }

          const response = await fetch(`${API_URL}/Associate-update-status`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: associateId,
              status: newStatus,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal(
              "Error",
              errorData.message || "Failed to update associate status.",
              "error",
            );
            throw new Error(
              errorData.message || "Failed to update associate status.",
            );
          }

          const result = await response.json();
          if ((result.success = "1")) {
            showCustomMessageModal(
              "Success",
              "Associate status has been updated successfully!",
              "success",
            );
            fetchAssociates(currentPage);
          } else {
            showCustomMessageModal(
              "Error",
              result.message || "Something went wrong",
              "error",
            );
          }
        } catch (err) {
          console.error("Status update error:", err);
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedAssociate(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAssociate(null);
    setCurrentParentId("");
    setEditFormData({
      id: "",
      username: "",
      email: "",
      mobile: "",
      whatsapp_number: "",
      parent_id: "",
      state: "",
      city: "",
      area: "",
      dob: "",
      marriage_anniversary_date: "",
      rera_number: "",
      address: "",
      pincode: "",
      pan_number: "",
      adhar_number: "",
      adhar_fornt_image: null,
      adhar_back_image: null,
      pan_card_image: null,
    });
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleSearchChangeName = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchChangeMobile = (e) => {
    setSearchMobile(e.target.value);
  };

  const handleSearchChangeLocation = (e) => {
    setSearchLocation(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchAssociates(
      1,
      searchName.trim(),
      searchMobile.trim(),
      searchLocation.trim(),
    );
  };

  const handleDeleteAssociate = async (associateId, associateName) => {
    showCustomMessageModal(
      "Confirm Delete",
      `Are you sure you want to delete associate "${associateName}"? This action cannot be undone.`,
      "warning",
      async () => {
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
            throw new Error("Authentication token not found. Please log in.");
          }

          const response = await fetch(`${API_URL}/delete-associate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: associateId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal(
              "Error",
              errorData.message || "Failed to delete associate.",
              "error",
            );
            throw new Error(errorData.message || "Failed to delete associate.");
          }

          const result = await response.json();
          if (result.status == "1") {
            showCustomMessageModal(
              "Success",
              "Associate has been deleted successfully!",
              "success",
            );
            fetchAssociates();
          } else {
            showCustomMessageModal(
              "Error",
              result.message || "Something went wrong",
              "error",
            );
          }
        } catch (err) {
          console.error("Delete associate error:", err);
        } finally {
          setLoading(false);
        }
      },
    );
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

  return (
    <>
      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex flex-wrap-mobile gap-2 align-items-center justify-content-between">
            <div className="titlepage">
              <h3>All Associate List</h3>
            </div>

            <div className="d-flex gap-2">
              <>
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
              </>

              <div className="createnewadmin">
                <Link
                  to="/create-associate"
                  className="btn btn-success d-inline-flex align-items-center"
                >
                  <FaPlus className="me-2" /> Add New
                </Link>
              </div>

              <>
                {!allowedDomains.includes(currentDomain) && (
                  <div className="createnewadmin">
                    <Link
                      to="/create-associate-by-uploading-csv"
                      className="btn btn-success d-inline-flex align-items-center"
                    >
                      <FaPlus className="me-2" /> Upload CSV
                    </Link>
                  </div>
                )}
              </>
              <button
                className={`filter-toggle-btn btn ${isFilterActive ? "active" : ""}`}
                onClick={handleToggle}
              >
                {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 flex-wrap-mobile expencelistwrap">
              <div className="form-group w-100" id="searchName">
                <input
                  type="text"
                  placeholder="Search Name"
                  value={searchName}
                  onChange={handleSearchChangeName}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchMobile">
                <input
                  type="text"
                  placeholder="Search Mobile"
                  value={searchMobile}
                  onChange={handleSearchChangeMobile}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchLocation">
                <input
                  type="text"
                  placeholder="Parent ID"
                  value={searchLocation}
                  onChange={handleSearchChangeLocation}
                  className="form-control"
                />
              </div>

              <button className="btn btn-primary" onClick={handleSearchClick}>
                Search
              </button>
            </div>
          )}

          <div className="table-responsive">
            <Table bordered>
              <thead className="bg-primary text-white">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Password</th>
                  <th>KYC Status</th>
                  <th>Parent Name</th>
                  <th>Parent ID</th>
                  <th>Self Sqyd</th>
                  <th>Team Sqyd</th>
                  <th>Self Gift Sqyd</th>
                  <th>Team Gift Sqyd</th>
                  <th>Total Sqyd</th>
                  <th>Status</th>
                  <th>Date Of Joining</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {associates.length > 0 ? (
                  associates.map((associate, i) => (
                    <tr key={associate.id}>
                      <td>{(currentPage - 1) * 10 + i + 1}</td>
                      <td>
                        {associate.username
                          ? associate.username.charAt(0).toUpperCase() +
                            associate.username.slice(1).toLowerCase()
                          : ""}
                      </td>
                      <td>{associate.mobile || "NA"}</td>
                      <td>{associate.password || "NA"}</td>
                      <td>
                        {associate.kyc
                          ? associate.kyc.charAt(0).toUpperCase() +
                            associate.kyc.slice(1).toLowerCase()
                          : ""}
                      </td>
                      <td>
                        {associate.parent_name
                          ? associate.parent_name.charAt(0).toUpperCase() +
                            associate.parent_name.slice(1)
                          : "NA"}
                      </td>
                      <td>{associate.parent_id}</td>
                      <td>{associate.self_sqyd || 0.0}</td>
                      <td>{associate.team_sqyd || 0.0}</td>
                      <td>{associate.self_gift_sqyd || 0.0}</td>
                      <td>{associate.team_gift_sqyd || 0.0}</td>
                      <td>{associate.total_sqyd || 0.0}</td>
                      <td>
                        <span
                          className={`badge ${associate.status === "active" ? "bg-success" : "bg-danger"}`}
                        >
                          {associate.status}
                        </span>
                      </td>
                      <td>{associate.date || "NA"}</td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn light btn-action dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <BsThreeDots size={20} />
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm"
                                onClick={() =>
                                  handleViewAssociate(associate.id)
                                }
                              >
                                <FaEye /> View
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm"
                                onClick={() =>
                                  handleEditAssociate(associate.id)
                                }
                              >
                                <FaEdit /> Edit
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleStatusUpdate(
                                    associate.id,
                                    associate.status,
                                  )
                                }
                              >
                                {associate.status === "active" ? (
                                  <MdAirplanemodeInactive />
                                ) : (
                                  <MdAirplanemodeActive />
                                )}
                                {associate.status === "active"
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn btn-sm text-danger"
                                onClick={() =>
                                  handleDeleteAssociate(
                                    associate.id,
                                    associate.username,
                                  )
                                }
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  backgroundColor: "transparent",
                                }}
                              >
                                <RiDeleteBin5Fill className="text-danger" />{" "}
                                <span className="text-danger">Delete</span>
                              </button>
                            </li>
                            {associate.status !== "inactive" && (
                              <li className="dropdown-item">
                                <a
                                  href={`${process.env.REACT_APP_API_ASSCIATELOGIN_URL}/login?mobile=${associate.mobile}&pssword=${associate.password}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn view_btn btn-sm"
                                >
                                  <FaEdit /> Login
                                </a>
                              </li>
                            )}
                            <li className="dropdown-item">
                              <Link
                                to={`/team-list/${associate.mobile}?name=${encodeURIComponent(associate.username)}`}
                                className="btn view_btn btn-sm"
                              >
                                <FaEye /> View Teams
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="15" className="text-center">
                      No associates found.
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
              <Pagination.Item
                active={1 === currentPage}
                onClick={() => handlePageChange(1)}
              >
                1
              </Pagination.Item>
              {currentPage > 3 && <Pagination.Ellipsis />}
              {currentPage > 2 && (
                <Pagination.Item
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  {currentPage - 1}
                </Pagination.Item>
              )}
              {currentPage !== 1 && currentPage !== totalPages && (
                <Pagination.Item active>{currentPage}</Pagination.Item>
              )}
              {currentPage < totalPages - 1 && (
                <Pagination.Item
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {currentPage + 1}
                </Pagination.Item>
              )}
              {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
              {totalPages > 1 && (
                <Pagination.Item
                  active={totalPages === currentPage}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Pagination.Item>
              )}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      </div>

      {/* View Associate Modal */}
      <Modal
        show={showViewModal}
        onHide={handleCloseViewModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Associate Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAssociate && (
            <Row>
              <div className="col-md-12">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Associate Name</th>
                      <td>{selectedAssociate.username}</td>
                    </tr>
                    <tr>
                      <th>Associate Email</th>
                      <td>{selectedAssociate.email}</td>
                    </tr>
                    <tr>
                      <th>Associate Mobile</th>
                      <td>{selectedAssociate.mobile}</td>
                    </tr>
                    <tr>
                      <th>Associate WhatsApp No</th>
                      <td>{selectedAssociate.whatsapp_number}</td>
                    </tr>
                    <tr>
                      <th>Associate Parent ID</th>
                      <td>{selectedAssociate.parent_id}</td>
                    </tr>
                    <tr>
                      <th>Associate State</th>
                      <td>
                        {selectedAssociate.state
                          ? states.find(
                              (s) => s.id === Number(selectedAssociate.state),
                            )?.name || selectedAssociate.state
                          : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Associate City</th>
                      <td>
                        {(() => {
                          if (!selectedAssociate.city) return "NA";
                          const cityId = Number(selectedAssociate.city);
                          const cityObj = cities.find((c) => c.id === cityId);
                          return cityObj
                            ? cityObj.name
                            : `City ID: ${selectedAssociate.city}`;
                        })()}
                      </td>
                    </tr>
                    <tr>
                      <th>Associate Area</th>
                      <td>{selectedAssociate.area}</td>
                    </tr>
                    <tr>
                      <th>Associate Date of Birth</th>
                      <td>
                        {selectedAssociate.dob
                          ? (() => {
                              const date = new Date(selectedAssociate.dob);
                              if (!isNaN(date.getTime())) {
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0",
                                );
                                const month = String(
                                  date.getMonth() + 1,
                                ).padStart(2, "0");
                                const year = date.getFullYear();
                                return `${day}-${month}-${year}`;
                              }
                              return selectedAssociate.dob;
                            })()
                          : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Associate Marriage Anniversary Date</th>
                      <td>
                        {selectedAssociate.marriage_anniversary_date
                          ? (() => {
                              const date = new Date(
                                selectedAssociate.marriage_anniversary_date,
                              );
                              if (!isNaN(date.getTime())) {
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0",
                                );
                                const month = String(
                                  date.getMonth() + 1,
                                ).padStart(2, "0");
                                const year = date.getFullYear();
                                return `${day}-${month}-${year}`;
                              }
                              return selectedAssociate.marriage_anniversary_date;
                            })()
                          : "NA"}
                      </td>
                    </tr>
                    <tr>
                      <th>Associate Rera Number</th>
                      <td>{selectedAssociate.rera_number}</td>
                    </tr>
                    <tr>
                      <th>Associate Address</th>
                      <td>{selectedAssociate.address}</td>
                    </tr>
                    <tr>
                      <th>Associate Pincode</th>
                      <td>{selectedAssociate.pincode}</td>
                    </tr>
                    <tr>
                      <th>Associate Pan Number</th>
                      <td>{selectedAssociate.pan_number}</td>
                    </tr>
                    <tr>
                      <th>Associate AAdhar Number</th>
                      <td>{selectedAssociate.adhar_number}</td>
                    </tr>
                    <tr>
                      <th>Associate AAdhar Front Image</th>
                      <td>
                        {selectedAssociate.adhar_fornt_image && (
                          <img
                            src={`${profileImage}${selectedAssociate.adhar_fornt_image}`}
                            alt="Adhar Front"
                            style={{
                              width: "100px",
                              height: "auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              window.open(
                                `${process.env.profileImage}/${selectedAssociate.adhar_fornt_image}`,
                                "_blank",
                              )
                            }
                          />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Associate AAdhar Back Image</th>
                      <td>
                        {selectedAssociate.adhar_back_image && (
                          <img
                            src={`${profileImage}${selectedAssociate.adhar_back_image}`}
                            alt="Adhar Back"
                            style={{
                              width: "100px",
                              height: "auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              window.open(
                                `${process.env.profileImage}/${selectedAssociate.adhar_back_image}`,
                                "_blank",
                              )
                            }
                          />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Associate Pan Card Image</th>
                      <td>
                        {selectedAssociate.pan_card_image && (
                          <img
                            src={`${profileImage}${selectedAssociate.pan_card_image}`}
                            alt="Pan Card"
                            style={{
                              width: "100px",
                              height: "auto",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              window.open(
                                `${process.env.profileImage}/${selectedAssociate.pan_card_image}`,
                                "_blank",
                              )
                            }
                          />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Associate Modal */}
      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Associate Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateAssociate}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={editFormData.username}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={editFormData.mobile}
                    onChange={handleEditFormChange}
                    maxLength="10"
                    required
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate WhatsApp Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="whatsapp_number"
                    value={editFormData.whatsapp_number}
                    maxLength="10"
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Current Parent Id</Form.Label>
                  <Form.Control
                    type="tel"
                    name="parent_id"
                    value={editFormData.parent_id}
                    maxLength="10"
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Associate Old Parent ID (From History)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={currentParentId || "Not Updated Till Date"}
                    readOnly
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">
                    <span style={{ color: "red" }}>
                      This is the old parent ID from the previous update
                      history.
                    </span>
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h5>Additional Details</h5>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Area</Form.Label>
                  <Form.Control
                    type="text"
                    name="area"
                    value={editFormData.area}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Pin Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={editFormData.pincode}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={editFormData.dob}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Marriage Anniversary Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="marriage_anniversary_date"
                    value={editFormData.marriage_anniversary_date}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate State</Form.Label>
                  <Select
                    options={stateOptions}
                    value={stateOptions.find(
                      (opt) => opt.value === editFormData.state,
                    )}
                    onChange={(selectedOption) =>
                      setEditFormData({
                        ...editFormData,
                        state: selectedOption?.value,
                        city: "",
                      })
                    }
                    placeholder="Select State"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate City</Form.Label>
                  <Select
                    options={cityOptions}
                    value={cityOptions.find(
                      (opt) => opt.value === Number(editFormData.city),
                    )}
                    onChange={(selectedOption) =>
                      setEditFormData({
                        ...editFormData,
                        city: selectedOption?.value,
                      })
                    }
                    isDisabled={!editFormData.state}
                    placeholder="Select City"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate RERA Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="rera_number"
                    value={editFormData.rera_number}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate PAN Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="pan_number"
                    value={editFormData.pan_number}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Aadhar Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="adhar_number"
                    value={editFormData.adhar_number}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h5>Document Images</h5>

            {/* <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Front Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'adhar_front_image')} />
                  {selectedAssociate?.adhar_front_image && !(editFormData.adhar_front_image instanceof File) && (
                    <div className="mt-2">
                      <img src={`${profileImage}${selectedAssociate.adhar_front_image}`} alt="Aadhar Front" style={{ width: '100px', cursor: 'pointer' }} className="img-thumbnail" onClick={() => openImageModal(`${profileImage}${selectedAssociate.adhar_front_image}`)} />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Aadhar Back Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'adhar_back_image')} />
                  {selectedAssociate?.adhar_back_image && !(editFormData.adhar_back_image instanceof File) && (
                    <div className="mt-2">
                      <img src={`${profileImage}${selectedAssociate.adhar_back_image}`} alt="Aadhar Back" style={{ width: '100px', cursor: 'pointer' }} className="img-thumbnail" onClick={() => openImageModal(`${profileImage}${selectedAssociate.adhar_back_image}`)} />
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>PAN Card Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'pan_card_image')} />
                  {selectedAssociate?.pan_card_image && !(editFormData.pan_card_image instanceof File) && (
                    <div className="mt-2">
                      <img src={`${profileImage}${selectedAssociate.pan_card_image}`} alt="PAN Card" style={{ width: '100px', cursor: 'pointer' }} className="img-thumbnail" onClick={() => openImageModal(`${profileImage}${selectedAssociate.pan_card_image}`)} />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row> */}

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Aadhar Front Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "adhar_fornt_image")}
                  />
                  {selectedAssociate?.adhar_fornt_image &&
                    !(editFormData.adhar_fornt_image instanceof File) && (
                      <div className="mt-2">
                        <img
                          src={`${profileImage}${selectedAssociate.adhar_fornt_image}`}
                          alt="Aadhar Front"
                          style={{ width: "100px", cursor: "pointer" }}
                          className="img-thumbnail"
                          onClick={() =>
                            openImageModal(
                              `${profileImage}${selectedAssociate.adhar_fornt_image}`,
                            )
                          }
                        />
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate Aadhar Back Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "adhar_back_image")}
                  />
                  {selectedAssociate?.adhar_back_image &&
                    !(editFormData.adhar_back_image instanceof File) && (
                      <div className="mt-2">
                        <img
                          src={`${profileImage}${selectedAssociate.adhar_back_image}`}
                          alt="Aadhar Back"
                          style={{ width: "100px", cursor: "pointer" }}
                          className="img-thumbnail"
                          onClick={() =>
                            openImageModal(
                              `${profileImage}${selectedAssociate.adhar_back_image}`,
                            )
                          }
                        />
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Associate PAN Card Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "pan_card_image")}
                  />
                  {selectedAssociate?.pan_card_image &&
                    !(editFormData.pan_card_image instanceof File) && (
                      <div className="mt-2">
                        <img
                          src={`${profileImage}${selectedAssociate.pan_card_image}`}
                          alt="PAN Card"
                          style={{ width: "100px", cursor: "pointer" }}
                          className="img-thumbnail"
                          onClick={() =>
                            openImageModal(
                              `${profileImage}${selectedAssociate.pan_card_image}`,
                            )
                          }
                        />
                      </div>
                    )}
                </Form.Group>
              </Col>
            </Row>

            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Associate"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Image Preview Modal */}
      {showImageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Document Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowImageModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedImage}
                  alt="Full View"
                  className="img-fluid"
                  style={{ maxHeight: "80vh" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Message Modal */}
      {showMessageModal && (
        <div
          className="modal d-block modalshowparentdesign"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title">{messageModalContent.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeCustomMessageModal}
                ></button>
              </div>
              <div className="modal-body text-secondary">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {messageModalContent.confirmAction ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
                    </Button>
                    <Button variant="danger" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                  </>
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AllAssociateList;
