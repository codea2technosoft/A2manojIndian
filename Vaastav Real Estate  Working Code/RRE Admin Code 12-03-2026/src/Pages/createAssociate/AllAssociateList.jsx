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

import * as XLSX from "xlsx";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
const API_URL = process.env.REACT_APP_API_URL;

const allowedDomains = [
  "admin.rajasthanirealestates.in",
  "realestateadmin.a2logicgroup.com",
];

const dontallowedDomains = ["admin.khataaareportts.com"];

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

  // New state for current parent ID
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

  // Get current parent ID API call
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

      console.warn("datattaatt", data);

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

  // const exportAllToExcel = async () => {
  //   setExporting(true);
  //   try {
  //     const token = getAuthToken();
  //     if (!token) {
  //       showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
  //       return;
  //     }

  //     let url = `${API_URL}/Associate-excel-download`;
  //     if (searchMobile) url += `&mobile=${searchMobile}`;
  //     if (searchName) url += `&name=${searchName}`;
  //     if (searchLocation) url += `&parent_id=${searchLocation}`;

  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       showCustomMessageModal("Error", errorData.message || "Failed to fetch associates.", "error");
  //       return;
  //     }

  //     const data = await response.json();
  //     const allAssociates = data.data || [];
  //     const worksheet = XLSX.utils.json_to_sheet(allAssociates.map(associate => ({
  //       "SL No.": allAssociates.indexOf(associate) + 1,
  //       "ID": associate.id,
  //       "Name": associate.username,
  //       "Mobile": associate.mobile,
  //       "KYC Status": associate.kyc,
  //       "Parent Name": associate.parent_name,
  //       "Parent ID": associate.parent_id,
  //       "Status": associate.status,
  //       "Date of Joining": associate.date,
  //       "Email": associate.email,
  //       "WhatsApp": associate.whatsapp_number
  //     })));

  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Associates");
  //     XLSX.writeFile(workbook, `All_Associates_${new Date().toISOString().split('T')[0]}.xlsx`);

  //   } catch (err) {
  //     console.error("Export error:", err);
  //     showCustomMessageModal("Error", "Failed to export associates.", "error");
  //   } finally {
  //     setExporting(false);
  //   }
  // };

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
          "error",
        );
        throw new Error(
          errorData.message || "Failed to fetch associate for editing.",
        );
      }

      const data = await response.json();
      const associateData = data.data;

      setSelectedAssociate(associateData);

      // Fetch current parent ID
      const currentParent = await fetchCurrentParentId(associateData.id);
      setCurrentParentId(currentParent || "");

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
          "error",
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
          "error",
        );
        throw new Error(errorData.message || "Failed to update associate.");
      }

      const result = await response.json();
      if (result.success == "1") {
        showCustomMessageModal(
          "Success",
          "Associate has been updated successfully!",
          "success",
        );
        setShowEditModal(false);
        fetchAssociates(currentPage);
      } else {
        showCustomMessageModal(
          "Error",
          result.message || "Something went wrong",
          "error",
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
    });
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

  const handleClearSearch = () => {
    setSearchName("");
    setSearchMobile("");
    setSearchLocation("");
    setCurrentPage(1);
    fetchAssociates(1, "", "");
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
          <div className="d-flex gap-2 align-items-center justify-content-between">
            <div className="titlepage">
              <h3>All Associate List</h3>
            </div>

            <div className="d-none d-md-none d-lg-none d-xl-block">
              <div className="d-flex gap-2 align-items-center">
                {/* <div className="form-group" id="searchName">
                  <input
                    type="text"
                    placeholder="Search Name"
                    value={searchName}
                    onChange={handleSearchChangeName}
                    className="form-control"
                  />
                </div>

                <div className="form-group" id="searchMobile">
                  <input
                    type="text"
                    placeholder="Search Mobile"
                    value={searchMobile}
                    onChange={handleSearchChangeMobile}
                    className="form-control"
                  />
                </div>

                <div className="form-group" id="searchLocation">
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
                </button> */}

                {/* <button
                  className="clearbutton"
                  onClick={handleClearSearch}
                >
                  Clear
                </button> */}

                {/* <div className="createnewadmin">
                  <button
                    className="exportexcel btn gap-2 btn-success d-inline-flex align-items-center"
                    onClick={exportAllToExcel}
                    disabled={exporting}
                  >
                    <FaDownload />
                    {exporting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Exporting All...
                      </>
                    ) : (
                      "Export"
                    )}
                  </button>
                </div> */}

                <>
                  {/* {!dontallowedDomains.includes(currentDomain) && (
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
                  )} */}
                </>

                <div className="createnewadmin">
                  <Link
                    to="/create-associate"
                    className="btn btn-success d-inline-flex align-items-center"
                  >
                    <FaPlus className="me-2" /> Add New
                  </Link>
                </div>

                {/* <div className="createnewadmin">
                  <Link to="/create-associate-by-uploading-csv" className="btn btn-success d-inline-flex align-items-center">
                    <FaPlus className="me-2" /> Upload CSV
                  </Link>
                </div> */}

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

            <div className="d-block d-md-block d-lg-block d-xl-none">
              <div className="d-flex gap-2 align-items-center">
                <div className="createnewadmin">
                  <Link
                    to="/create-associate"
                    className="btn btn-success d-inline-flex align-items-center"
                  >
                    <FaPlus className="me-2" /> Associate
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

            {/* <div className="d-flex">
              <Link to="/create-associate" className="btn btn-success d-inline-flex align-items-center">
                <FaPlus className="me-2" /> Create New Associate
              </Link>
            </div> */}
          </div>
        </div>
        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile expencelistwrap">
              <div className="form-group" id="searchName">
                <input
                  type="text"
                  placeholder="Search Name"
                  value={searchName}
                  onChange={handleSearchChangeName}
                  className="form-control"
                />
              </div>

              <div className="form-group" id="searchMobile">
                <input
                  type="text"
                  placeholder="Search Mobile"
                  value={searchMobile}
                  onChange={handleSearchChangeMobile}
                  className="form-control"
                />
              </div>

              <div className="form-group" id="searchLocation">
                <input
                  type="text"
                  placeholder="Parent ID"
                  value={searchLocation}
                  onChange={handleSearchChangeLocation}
                  className="form-control"
                />
              </div>

              <div className="d-flex gap-2 align-items-center justify-content-end">
                <button className="btn btn-primary" onClick={handleSearchClick}>
                  Search
                </button>

                {/* <button
                  className="btn btn-secondary"
                  onClick={handleClearSearch}
                >
                  Clear
                </button> */}
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

                {/* <button
                  className="exportexcel"
                  onClick={exportAllToExcel}
                  disabled={exporting}
                >
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
                    "Export to Excel"
                  )}
                </button> */}
              </div>
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
                  {/* <th>Sold SQYD</th>
                  <th>Reward Qualify</th>
                  <th>Royalty Qualify</th>
                  <th>Advance Payment</th> */}
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
                      {/* <td>
                         {associate.username.charAt(0).toUpperCase() + associate.username.slice(1).toLowerCase()}
</td>

                      <td>{associate.mobile}</td>
                      <td>{associate.password}</td>
                      <td>{associate.kyc.charAt(0).toUpperCase() + associate.kyc.slice(1).toLowerCase()}</td>
                      <td>{associate.parent_name.charAt(0).toUpperCase()+associate.parent_name }</td> */}

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
                      {/* <td>{associate.buysqrt || 0.00}</td>
                      <td>{associate.parent_id}</td>
                      <td>{associate.parent_id}</td>
                      <td>{associate.advance_payment || 0.00}</td> */}
                      <td>
                        <span
                          className={`badge ${
                            associate.status === "active"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
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
                                title="View Project Details"
                              >
                                <FaEye /> View
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm"
                                title="View Project Details"
                                onClick={() =>
                                  handleEditAssociate(associate.id)
                                }
                              >
                                <FaEdit /> Edit
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                variant={
                                  associate.status === "active"
                                    ? "danger"
                                    : "success"
                                }
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
                            {associate.status !== "inactive" && (
                              <li className="dropdown-item">
                                {/*<a
                                    href={`https://dashboard.rajasthanirealestates.in/login?mobile=${associate.mobile}&pssword=${associate.password}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn view_btn btn-sm"
                                    title="View Project Details"
                                  >
                                    <FaEdit /> Login
                                  </a>*/}

                                <a
                                  href={`${process.env.REACT_APP_API_ASSCIATELOGIN_URL}/login?mobile=${associate.mobile}&pssword=${associate.password}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn view_btn btn-sm"
                                  title="View Project Details"
                                >
                                  <FaEdit /> Login
                                </a>
                              </li>
                            )}

                            <li className="dropdown-item">
                              <Link
                                to={`/team-list/${associate.mobile}?name=${encodeURIComponent(associate.username)}`}
                                className="btn view_btn btn-sm"
                                title="View Project Details"
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
                    <td colSpan="6" className="text-center">
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
                      <th>Name</th>
                      <td>{selectedAssociate.username}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{selectedAssociate.email}</td>
                    </tr>
                    <tr>
                      <th>Mobile</th>
                      <td>{selectedAssociate.mobile}</td>
                    </tr>
                    <tr>
                      <th>WhatsApp No.</th>
                      <td>{selectedAssociate.whatsapp_number}</td>
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

      <Modal
        show={showEditModal}
        onHide={handleCloseEditModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Associate Parent IDS & Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateAssociate}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="editUsername">
                  <Form.Label>Name</Form.Label>
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
                <Form.Group className="mb-3" controlId="editEmail">
                  <Form.Label>Email</Form.Label>
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
                <Form.Group className="mb-3" controlId="editMobile">
                  <Form.Label>Mobile</Form.Label>
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
                <Form.Group className="mb-3" controlId="editWhatsappNumber">
                  <Form.Label>WhatsApp Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="whatsapp_number"
                    value={editFormData.whatsapp_number}
                    maxLength="10"
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="editParentId">
                  <Form.Label>Current Parent Id</Form.Label>
                  <Form.Control
                    type="tel"
                    name="parent_id"
                    value={editFormData.parent_id}
                    maxLength="10"
                    onChange={handleEditFormChange}
                  />
                </Form.Group>
              </Col>

              {/* Current Parent ID Display */}
              <Col md={6}>
                <Form.Group className="mb-3" controlId="currentParentId">
                  <Form.Label>Old Parent ID (From History)</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentParentId || "Not Updated Till Date"}
                    readOnly
                    placeholder="Loading..."
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

      {showMessageModal && (
        <div
          className="modal d-block modalshowparentdesign"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${messageModalContent.type === "success" ? "" : messageModalContent.type === "error" ? "" : ""}`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${messageModalContent.type === "success" ? "" : messageModalContent.type === "error" ? "" : ""}`}
                >
                  {messageModalContent.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
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
                      variant={
                        messageModalContent.type === "btn-primary-custum"
                          ? "btn-primary-custum"
                          : "primary"
                      }
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
