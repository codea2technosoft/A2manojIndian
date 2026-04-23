import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MdFilterListAlt, MdFilterAltOff } from "react-icons/md";
import { Table, Form, Spinner, Button, Modal } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_API_URL;
const LIMIT = 10;

function AssociatesBimaAchieverLists() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  
  // State and City Data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stateMap, setStateMap] = useState({});
  const [cityMap, setCityMap] = useState({});
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  
  // Update Modal States
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    user_name: "",
    user_mobile: "",
    email: "",
    date_of_birth: "",
    gender: "",
    pan_number: "",
    aadhar_number: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    nominee_name: "",
    nominee_relation: "",
    nominee_dob: "",
    // status: ""
  });
  const [updateFiles, setUpdateFiles] = useState({
    pan_image: null,
    aadhar_front_image: null,
    aadhar_back_image: null,
    profile_photo: null
  });
  const [existingImages, setExistingImages] = useState({
    pan_image_url: "",
    aadhar_front_image_url: "",
    aadhar_back_image_url: "",
    profile_photo_url: ""
  });

  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    customer_name: "",
    mobile: "",
    // status: "",
    orderid: "",
  });

  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}/uploads/bima_registration/${imagePath}`;
  };

  const getAuthToken = () => localStorage.getItem("token");

  // Fetch States
  const fetchStates = async () => {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/state-list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setStates(data.data || []);
        // Create state map for quick lookup
        const map = {};
        (data.data || []).forEach(state => {
          map[state.id] = state.name;
        });
        setStateMap(map);
        console.log("States loaded:", map);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  // Fetch ALL Cities by iterating through states
  const fetchAllCities = async () => {
    setIsLoadingCities(true);
    const token = getAuthToken();
    if (!token) {
      setIsLoadingCities(false);
      return;
    }
    
    try {
      // First get all states
      const statesRes = await fetch(`${API_URL}/state-list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const statesData = await statesRes.json();
      const allStates = statesData.data || [];
      
      console.log("Fetching cities for states:", allStates);
      
      // Fetch cities for each state
      const cityMapData = {};
      
      for (const state of allStates) {
        try {
          const res = await fetch(`${API_URL}/city-list`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ state_id: state.id }),
          });
          const data = await res.json();
          if (res.ok && data.data) {
            data.data.forEach(city => {
              cityMapData[city.id] = city.name;
            });
          }
        } catch (err) {
          console.error(`Error fetching cities for state ${state.id}:`, err);
        }
      }
      
      console.log("City Map loaded:", cityMapData);
      setCityMap(cityMapData);
      
    } catch (error) {
      console.error("Error fetching all cities:", error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Fetch Cities for a specific state (for update modal)
  const fetchCitiesForState = async (stateId) => {
    if (!stateId) {
      setCities([]);
      return;
    }
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_URL}/city-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ state_id: stateId }),
      });
      const data = await res.json();
      if (res.ok) {
        setCities(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Handle State Change in Update Modal
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setUpdateFormData(prev => ({
      ...prev,
      state: stateId,
      city: "" // Reset city when state changes
    }));
    fetchCitiesForState(stateId);
  };

  // Get State Name by ID
  const getStateName = (stateId) => {
    if (!stateId) return "-";
    // Convert to number if it's a string
    const id = parseInt(stateId);
    return stateMap[id] || stateId;
  };

  // Get City Name by ID
  const getCityName = (cityId) => {
    if (!cityId) return "-";
    // Convert to number if it's a string
    const id = parseInt(cityId);
    const cityName = cityMap[id];
    console.log(`Looking for city ${id}: found ${cityName}`);
    return cityName || cityId;
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

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const url = `${API_URL}/associate-bima-list?status=${searchTerm.status}&name=${searchTerm.customer_name}&mobile=${searchTerm.mobile}&orderid=${searchTerm.orderid}&page=${page}&limit=${LIMIT}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      
      let fetchedUsers = [];
      if (result.data && !Array.isArray(result.data)) {
        fetchedUsers = [result.data];
      } else if (Array.isArray(result.data)) {
        fetchedUsers = result.data;
      } else {
        fetchedUsers = [];
      }
      
      console.log("Fetched users:", fetchedUsers);
      
      setAllUsers(fetchedUsers);
      setUsers(fetchedUsers);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    fetchStates(); // Fetch states on component mount
    fetchAllCities(); // Fetch all cities on component mount
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  // Handle Update Button Click
  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setUpdateFormData({
      user_name: user.user_name || "",
      user_mobile: user.user_mobile || "",
      email: user.email || "",
      date_of_birth: user.date_of_birth ? user.date_of_birth.split('T')[0] : "",
      gender: user.gender || "",
      pan_number: user.pan_number || "",
      aadhar_number: user.aadhar_number || "",
      address: user.address || "",
      state: user.state || "",
      city: user.city || "",
      pincode: user.pincode || "",
      nominee_name: user.nominee_name || "",
      nominee_relation: user.nominee_relation || "",
      nominee_dob: user.nominee_dob || "",
      // status: user.status || "pending"
    });
    setExistingImages({
      pan_image_url: user.pan_image || "",
      aadhar_front_image_url: user.aadhar_front_image || "",
      aadhar_back_image_url: user.aadhar_back_image || "",
      profile_photo_url: user.profile_photo || ""
    });
    setUpdateFiles({
      pan_image: null,
      aadhar_front_image: null,
      aadhar_back_image: null,
      profile_photo: null
    });
    
    // Fetch cities for the user's state
    if (user.state) {
      fetchCitiesForState(user.state);
    } else {
      setCities([]);
    }
    
    setShowUpdateModal(true);
  };

  // Handle Update Form Input Changes
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Update File Changes
  const handleUpdateFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setUpdateFiles(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  // Submit Update Form
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      const token = getAuthToken();
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(updateFormData).forEach(key => {
        if (updateFormData[key]) {
          formData.append(key, updateFormData[key]);
        }
      });
      
      // Add files if they are selected
      if (updateFiles.pan_image) {
        formData.append("pan_image", updateFiles.pan_image);
      }
      if (updateFiles.aadhar_front_image) {
        formData.append("aadhar_front_image", updateFiles.aadhar_front_image);
      }
      if (updateFiles.aadhar_back_image) {
        formData.append("aadhar_back_image", updateFiles.aadhar_back_image);
      }
      if (updateFiles.profile_photo) {
        formData.append("profile_photo", updateFiles.profile_photo);
      }
      
      const response = await fetch(`${API_URL}/associate-bima-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Swal.fire({
          title: "Success",
          text: "User updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        });
        
        setShowUpdateModal(false);
        fetchUsers(currentPage);
      } else {
        throw new Error(data.message || "Failed to update user");
      }
    } catch (err) {
      showCustomMessageModal("Error", err.message, "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#fff3cd", color: "#856404" };
      case "approved":
        return { backgroundColor: "#d4edda", color: "#155724" };
      case "rejected":
        return { backgroundColor: "#f8d7da", color: "#721c24" };
      default:
        return { backgroundColor: "#e2e3e5", color: "#383d41" };
    }
  };

  const getPaginationGroup = () => {
    let pages = [];
    const totalPagesToShow = 7;
    const sidePages = 2;

    if (totalPages <= totalPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);

    pages.push(1);

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <div className="card mt-3">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>Bima Achiever Lists</h3>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button
                type="button"
                className="toggle-filter-btn btn btn-primary"
                onClick={toggleFilter}
              >
                {showFilter ? <MdFilterAltOff /> : <MdFilterListAlt />}
              </button>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="card-body pb-0">
            <div className="d-flex flex-wrap-mobile align-items-md-center gap-2">
              {/* <div className="form_design w-100">
                <input
                  type="text"
                  name="orderid"
                  placeholder="Lead ID"
                  value={searchTerm.orderid}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div> */}

              {/* <div className="form_design w-100">
                <select
                  name="status"
                  value={searchTerm.status}
                  onChange={(e) => {
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    });
                  }}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="form_design w-100">
                <input
                  type="text"
                  name="customer_name"
                  placeholder="Name"
                  value={searchTerm.customer_name}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div> */}

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

              <button
                type="button"
                className="submit_button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        )}

        <div className="card-body">
          {loading || isLoadingCities ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3">Loading Bima Achiever lists...</p>
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-danger fw-bold">No data found!</p>
          ) : (
            <>
              <div className="table-responsive">
                <Table bordered style={{ minWidth: "1200px" }}>
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: "5%" }}>#</th>
                      <th style={{ width: "8%" }}>User Name</th>
                      <th style={{ width: "8%" }}>Mobile</th>
                      <th style={{ width: "10%" }}>Email</th>
                      <th style={{ width: "8%" }}>DOB</th>
                      <th style={{ width: "6%" }}>Gender</th>
                      <th style={{ width: "8%" }}>PAN</th>
                      <th style={{ width: "8%" }}>Aadhar</th>
                      <th style={{ width: "12%" }}>Address</th>
                      <th style={{ width: "6%" }}>State</th>
                      <th style={{ width: "6%" }}>City</th>
                      <th style={{ width: "6%" }}>Pincode</th>
                      <th style={{ width: "8%" }}>Nominee</th>
                      <th style={{ width: "8%" }}>Relation</th>
                      <th style={{ width: "8%" }}>Nominee DOB</th>
                      <th style={{ width: "6%" }}>Status</th>
                      <th style={{ width: "10%" }}>Created At</th>
                      <th style={{ width: "8%" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{(currentPage - 1) * LIMIT + index + 1}</td>
                        <td>{toSentenceCase(user.user_name)}</td>
                        <td>{user.user_mobile}</td>
                        <td>{user.email || "-"}</td>
                        <td>{formatDate(user.date_of_birth)}</td>
                        <td>{toSentenceCase(user.gender)}</td>
                        <td>{user.pan_number || "-"}</td>
                        <td>{user.aadhar_number || "-"}</td>
                        <td>
                          <div 
                            style={{ 
                              maxWidth: "600px", 
                              wordWrap: "break-word", 
                              lineHeight: "1.4"
                            }}
                            title={user.address || "-"}
                          >
                            {user.address ? (
                              <>
                                {user.address.length > 60 ? (
                                  <>
                                    {user.address.substring(0, 60)}...
                                    <br />
                                    <small className="text-muted">
                                      {user.address.substring(60, 200)}
                                      {user.address.length > 120 && "..."}
                                    </small>
                                  </>
                                ) : (
                                  user.address
                                )}
                              </>
                            ) : "-"}
                          </div>
                        </td>
                        <td>{getStateName(user.state)}</td>
                        <td>{getCityName(user.city)}</td>
                        <td>{user.pincode || "-"}</td>
                        <td>{toSentenceCase(user.nominee_name)}</td>
                        <td>{toSentenceCase(user.nominee_relation)}</td>
                        <td>{formatDate(user.nominee_dob)}</td>
                        <td>
                          <span
                            className="badge"
                            style={getStatusStyle(user.status)}
                          >
                            {toSentenceCase(user.status)}
                          </span>
                        </td>
                        <td>{formatDateTime(user.created_at)}</td>
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
                                  title="View Details"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <FaEye /> View Details
                                </button>
                              </li>
                              <li className="dropdown-item">
                                <button
                                  className="btn edit_btn btn-sm"
                                  title="Update User"
                                  onClick={() => handleUpdateClick(user)}
                                >
                                  <FaEdit /> Update
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <Pagination>
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {getPaginationGroup().map((item, index) => (
                    <Pagination.Item
                      key={index}
                      active={item === currentPage}
                      onClick={() =>
                        typeof item === "number" ? handlePageChange(item) : null
                      }
                      disabled={item === "..."}
                      style={{ cursor: item === "..." ? "default" : "pointer" }}
                    >
                      {item}
                    </Pagination.Item>
                  ))}
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

      {/* View Details Modal - Same as before */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details - {selectedUser?.user_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Profile Photo:</strong><br />
                {selectedUser.profile_photo ? (
                  <img
                    src={getImageUrl(selectedUser.profile_photo)}
                    alt="Profile"
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/100?text=No+Image";
                    }}
                  />
                ) : (
                  "-"
                )}
              </div>
              <div className="col-md-6 mb-3">
                <strong>PAN Card:</strong><br />
                {selectedUser.pan_image ? (
                  <a href={getImageUrl(selectedUser.pan_image)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={getImageUrl(selectedUser.pan_image)}
                      alt="PAN"
                      style={{ width: "100px", height: "auto" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Aadhar Front:</strong><br />
                {selectedUser.aadhar_front_image ? (
                  <a href={getImageUrl(selectedUser.aadhar_front_image)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={getImageUrl(selectedUser.aadhar_front_image)}
                      alt="Aadhar Front"
                      style={{ width: "100px", height: "auto" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Aadhar Back:</strong><br />
                {selectedUser.aadhar_back_image ? (
                  <a href={getImageUrl(selectedUser.aadhar_back_image)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={getImageUrl(selectedUser.aadhar_back_image)}
                      alt="Aadhar Back"
                      style={{ width: "100px", height: "auto" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=No+Image";
                      }}
                    />
                  </a>
                ) : (
                  "-"
                )}
              </div>
              <div className="col-md-6 mb-3">
                <strong>User ID:</strong> {selectedUser.user_id}
              </div>
              <div className="col-md-6 mb-3">
                <strong>User Name:</strong> {selectedUser.user_name}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Mobile:</strong> {selectedUser.user_mobile}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Email:</strong> {selectedUser.email || "-"}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Date of Birth:</strong> {formatDate(selectedUser.date_of_birth)}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Gender:</strong> {toSentenceCase(selectedUser.gender)}
              </div>
              <div className="col-md-6 mb-3">
                <strong>PAN Number:</strong> {selectedUser.pan_number || "-"}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Aadhar Number:</strong> {selectedUser.aadhar_number || "-"}
              </div>
              <div className="col-12 mb-3">
                <strong>Address:</strong> 
                <div className="mt-2 p-2 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
                  {selectedUser.address || "-"}
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <strong>State:</strong> {getStateName(selectedUser.state)}
              </div>
              <div className="col-md-4 mb-3">
                <strong>City:</strong> {getCityName(selectedUser.city)}
              </div>
              <div className="col-md-4 mb-3">
                <strong>Pincode:</strong> {selectedUser.pincode || "-"}
              </div>
              <div className="col-md-4 mb-3">
                <strong>Nominee Name:</strong> {toSentenceCase(selectedUser.nominee_name)}
              </div>
              <div className="col-md-4 mb-3">
                <strong>Nominee Relation:</strong> {toSentenceCase(selectedUser.nominee_relation)}
              </div>
              <div className="col-md-4 mb-3">
                <strong>Nominee DOB:</strong> {formatDate(selectedUser.nominee_dob)}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Status:</strong>{" "}
                <span className="badge" style={getStatusStyle(selectedUser.status)}>
                  {toSentenceCase(selectedUser.status)}
                </span>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Created At:</strong> {formatDateTime(selectedUser.created_at)}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update User Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Update User - {selectedUser?.user_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitUpdate}>
            <div className="row">
              <div className="col-md-12 mb-3">
                <h5 className="border-bottom pb-2">Personal Information</h5>
              </div>
              
              <div className="col-md-6 mb-3">
                <Form.Label>User Name <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="user_name"
                  value={updateFormData.user_name}
                  onChange={handleUpdateInputChange}
                  disabled
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <Form.Label>Mobile <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="user_mobile"
                  value={updateFormData.user_mobile}
                  onChange={handleUpdateInputChange}
                  disabled
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={updateFormData.email}
                  onChange={handleUpdateInputChange}
                  disabled
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={updateFormData.date_of_birth}
                  onChange={handleUpdateInputChange}
                  disabled
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={updateFormData.gender}
                  onChange={handleUpdateInputChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
              </div>
              
              {/* <div className="col-md-6 mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={updateFormData.status}
                  onChange={handleUpdateInputChange}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </div> */}

              <div className="col-md-12 mb-3">
                <h5 className="border-bottom pb-2">Document Information</h5>
              </div>
              
              <div className="col-md-6 mb-3">
                <Form.Label>PAN Number</Form.Label>
                <Form.Control
                  type="text"
                  name="pan_number"
                  value={updateFormData.pan_number}
                  onChange={handleUpdateInputChange}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <Form.Label>Aadhar Number</Form.Label>
                <Form.Control
                  type="text"
                  name="aadhar_number"
                  value={updateFormData.aadhar_number}
                  onChange={handleUpdateInputChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <h5 className="border-bottom pb-2">Update Images (Leave empty to keep existing)</h5>
              </div>
              
              {/* <div className="col-md-3 mb-3">
                <Form.Label>Profile Photo</Form.Label>
                {existingImages.profile_photo_url && (
                  <div className="mb-2">
                    <img 
                      src={getImageUrl(existingImages.profile_photo_url)} 
                      alt="Current" 
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/50?text=No+Image";
                      }}
                    />
                    <br />
                    <small>Current Image</small>
                  </div>
                )}
                <Form.Control
                  type="file"
                  name="profile_photo"
                  accept="image/*"
                  onChange={handleUpdateFileChange}
                />
              </div> */}
              
              <div className="col-md-3 mb-3">
                <Form.Label>PAN Image</Form.Label>
                {existingImages.pan_image_url && (
                  <div className="mb-2">
                    <img 
                      src={getImageUrl(existingImages.pan_image_url)} 
                      alt="Current" 
                      style={{ width: "50px", height: "auto" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/50?text=No+Image";
                      }}
                    />
                    <br />
                    <small>Current Image</small>
                  </div>
                )}
                <Form.Control
                  type="file"
                  name="pan_image"
                  accept="image/*"
                  onChange={handleUpdateFileChange}
                />
              </div>
              
              <div className="col-md-3 mb-3">
                <Form.Label>Aadhar Front</Form.Label>
                {existingImages.aadhar_front_image_url && (
                  <div className="mb-2">
                    <img 
                      src={getImageUrl(existingImages.aadhar_front_image_url)} 
                      alt="Current" 
                      style={{ width: "50px", height: "auto" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/50?text=No+Image";
                      }}
                    />
                    <br />
                    <small>Current Image</small>
                  </div>
                )}
                <Form.Control
                  type="file"
                  name="aadhar_front_image"
                  accept="image/*"
                  onChange={handleUpdateFileChange}
                />
              </div>
              
              <div className="col-md-3 mb-3">
                <Form.Label>Aadhar Back</Form.Label>
                {existingImages.aadhar_back_image_url && (
                  <div className="mb-2">
                    <img 
                      src={getImageUrl(existingImages.aadhar_back_image_url)} 
                      alt="Current" 
                      style={{ width: "50px", height: "auto" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/50?text=No+Image";
                      }}
                    />
                    <br />
                    <small>Current Image</small>
                  </div>
                )}
                <Form.Control
                  type="file"
                  name="aadhar_back_image"
                  accept="image/*"
                  onChange={handleUpdateFileChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <h5 className="border-bottom pb-2">Address Information</h5>
              </div>
              
              <div className="col-12 mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="address"
                  value={updateFormData.address}
                  onChange={handleUpdateInputChange}
                  placeholder="Enter complete address"
                />
              </div>
              
              <div className="col-md-4 mb-3">
                <Form.Label>State <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="state"
                  value={updateFormData.state}
                  onChange={handleStateChange}
                  required
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
              
              <div className="col-md-4 mb-3">
                <Form.Label>City <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="city"
                  value={updateFormData.city}
                  onChange={handleUpdateInputChange}
                  required
                  disabled={!updateFormData.state}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
              
              <div className="col-md-4 mb-3">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={updateFormData.pincode}
                  onChange={handleUpdateInputChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <h5 className="border-bottom pb-2">Nominee Information</h5>
              </div>
              
              <div className="col-md-4 mb-3">
                <Form.Label>Nominee Name</Form.Label>
                <Form.Control
                  type="text"
                  name="nominee_name"
                  value={updateFormData.nominee_name}
                  onChange={handleUpdateInputChange}
                />
              </div>
              
              <div className="col-md-4 mb-3">
                <Form.Label>Nominee Relation</Form.Label>
                <Form.Control
                  type="text"
                  name="nominee_relation"
                  value={updateFormData.nominee_relation}
                  onChange={handleUpdateInputChange}
                />
              </div>
              
              <div className="col-md-4 mb-3">
                <Form.Label>Nominee DOB</Form.Label>
                <Form.Control
                  type="date"
                  name="nominee_dob"
                  value={updateFormData.nominee_dob}
                  onChange={handleUpdateInputChange}
                />
              </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={updateLoading}>
                {updateLoading ? "Updating..." : "Update User"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Custom Message Modal */}
      {showMessageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content border-top border-4 ${
                messageModalContent.type === "success"
                  ? "border-success"
                  : messageModalContent.type === "error"
                  ? "border-danger"
                  : "border-warning"
              }`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${
                    messageModalContent.type === "success"
                      ? "text-success"
                      : messageModalContent.type === "error"
                      ? "text-danger"
                      : "text-warning"
                  }`}
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
                    <Button variant="secondary" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                    <Button
                      variant={messageModalContent.type === "warning" ? "warning" : "primary"}
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
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

export default AssociatesBimaAchieverLists;