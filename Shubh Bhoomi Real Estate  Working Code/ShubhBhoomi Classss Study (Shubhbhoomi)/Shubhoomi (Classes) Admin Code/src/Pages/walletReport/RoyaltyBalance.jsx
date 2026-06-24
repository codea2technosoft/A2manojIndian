import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
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
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function RoyaltyBalance() {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const searchTimeoutRef = useRef(null);
  const [editFormData, setEditFormData] = useState({
    id: "",
    username: "",
    email: "",
    mobile: "",
    whatsapp_number: "",
    parent_id: "",
  });

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

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

  const fetchAssociates = async (page = 1, name = "", location = "") => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        throw new Error("Authentication token not found. Please log in.");
      }

      let url = `${API_URL}/Associate-list-active?page=${page}&limit=10`;
      if (name) url += `&mobile=${name}`;
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
            "error"
          );
          throw new Error("Unauthorized: Please log in again.");
        }
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to fetch associates.",
          "error"
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

  const handleViewAssociate = async (associateId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
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
          "error"
        );
        throw new Error(
          errorData.message || "Failed to fetch associate details."
        );
      }

      const data = await response.json();
      setSelectedAssociate(data.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("View associate error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAssociate = async (associateId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      // Fetch associate data
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
          "error"
        );
        throw new Error(
          errorData.message || "Failed to fetch associate for editing."
        );
      }

      const data = await response.json();
      const associateData = data.data;

      setSelectedAssociate(associateData);

      setEditFormData({
        id: associateData.id || "",
        username: associateData.username || "",
        email: associateData.email || "",
        mobile: associateData.mobile || "",
        whatsapp_number: associateData.whatsapp_number || "",
        parent_id: associateData.parent_id || "",
      });

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

  const handleUpdateAssociate = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error"
        );
        throw new Error("Authentication token not found. Please log in.");
      }

      const payload = { ...selectedAssociate };
      payload.id = editFormData.id;
      payload.username = editFormData.username;
      payload.email = editFormData.email;
      payload.mobile = editFormData.mobile;
      payload.whatsapp_number = editFormData.whatsapp_number;
      payload.parent_id = editFormData.parent_id;

      const response = await fetch(`${API_URL}/Associate-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showCustomMessageModal(
          "Error",
          errorData.message || "Failed to update associate.",
          "error"
        );
        throw new Error(errorData.message || "Failed to update associate.");
      }

      const result = await response.json();
      if (result.success == "1") {
        showCustomMessageModal(
          "Success",
          "Associate has been updated successfully!",
          "success"
        );
        setShowEditModal(false);
        fetchAssociates(currentPage);
      } else {
        showCustomMessageModal(
          "Error",
          result.message || "Something went wrong",
          "error"
        );
      }
    } catch (err) {
      console.error("Update associate error:", err);
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
              "error"
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
              "error"
            );
            throw new Error(
              errorData.message || "Failed to update associate status."
            );
          }

          const result = await response.json();
          if ((result.success = "1")) {
            showCustomMessageModal(
              "Success",
              "Associate status has been updated successfully!",
              "success"
            );
            fetchAssociates(currentPage);
          } else {
            showCustomMessageModal(
              "Error",
              result.message || "Something went wrong",
              "error"
            );
          }
        } catch (err) {
          console.error("Status update error:", err);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedAssociate(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAssociate(null);
    setEditFormData({
      id: "",
      username: "",
      email: "",
      mobile: "",
      whatsapp_number: "",
    });
  };

  const handleSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchChangeLocation = (e) => {
    setSearchLocation(e.target.value);
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchAssociates(1, searchName.trim(), searchLocation.trim());
  };

  const handleClearSearch = () => {
    setSearchName("");
    setSearchLocation("");
    setCurrentPage(1);
    fetchAssociates(1, "", "");
  };

  const royaltyData = [
    { id: 1, balance: 2500 },
    { id: 2, balance: 10000 },
    { id: 3, balance: 20000 },
    { id: 4, balance: 40000 },
    { id: 5, balance: "Same Level" },
    { id: 6, balance: "Same Level" },
  ];

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
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Royalty Balance List</h3>
            </div>
            <div className="d-md-block d-none">
              <div className="d-flex gap-2">
                <div className="form-group" id="searchName">
                  <input
                    type="text"
                    placeholder="Search Balance"
                    value={searchName}
                    onChange={handleSearchChange}
                    className="form-control"
                  />
                </div>
{/* 
                <div className="form-group" id="searchLocation">
                  <input
                    type="text"
                    placeholder="Parent ID"
                    value={searchLocation}
                    onChange={handleSearchChangeLocation}
                    className="form-control"
                  />
                </div> */}

                <button className="btn btn-primary" onClick={handleSearchClick}>
                  Search
                </button>

                {/* <button
                  className="btn btn-secondary"
                  onClick={handleClearSearch}
                >
                  Clear
                </button> */}

                <div className="createnewadmin">
                  <Link
                    to="/account-report"
                    className="btn btn-success d-inline-flex align-items-center"
                  >
                    <FaArrowLeft className="me-2" /> Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              <div className="form-group w-100" id="searchName">
                <input
                  type="text"
                  placeholder="Search Mobile"
                  value={searchName}
                  onChange={handleSearchChange}
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

              <button className="btn btn-secondary" onClick={handleClearSearch}>
                Clear
              </button>
            </div>
          )}
          <div className="table-responsive">
            <Table bordered>
              <thead className="bg-primary text-white">
                <tr>
                  <th>Sr No.</th>
                  <th>Royalty Balance(SQYD)</th>
                </tr>
              </thead>
             <tbody>
          {royaltyData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.balance}</td>
            </tr>
          ))}
        </tbody>
            </Table>
          </div>

         
        </div>
      </div>
    </>
  );
}

export default RoyaltyBalance;
