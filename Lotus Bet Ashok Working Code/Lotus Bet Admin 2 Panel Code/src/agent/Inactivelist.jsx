import React, { useEffect, useState } from "react";
import { Container, Card, Table, Spinner, Form, Button, Pagination, Modal } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";


function InactiveUserList() {

  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activatingUser, setActivatingUser] = useState(null);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);
  const [paginationData, setPaginationData] = useState({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    limit: 10
  });

  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL || "http://192.168.1.12:9002/api/admin";

  const fetchInactiveUserData = async (page = currentPage) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/get-user-inactive-list`,
        {
          role: 3,
          page: page,
          limit: limit,
          search: searchTerm
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        setInactiveUsers(response.data.data || []);

        // Set pagination data
        const pagination = response.data.pagination || {
          total_records: 0,
          total_pages: 1,
          current_page: 1,
          limit: 10
        };

        setPaginationData(pagination);
        setTotalPages(pagination.total_pages || 1);
        setTotalRecords(pagination.total_records || 0);
        setCurrentPage(pagination.current_page || 1);
        setLimit(pagination.limit || 10);

        // REMOVE THIS TOAST OR COMMENT IT OUT
        // toast.success(response.data.message || "Data loaded successfully");
      } else {
        toast.error(response.data.message || "Failed to load data");
      }
    } catch (error) {
      console.error(
        "Error fetching inactive users:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to load inactive users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveUserData(1); // Always start from page 1 on component mount
  }, [searchTerm]);

  // Activate User Function
  const handleActivateUser = async () => {
    if (!activatingUser) return;

    try {
      setActivationLoading(true);
      const response = await axios.post(
        `${API_URL}/update-client-status`,
        {
          admin_id: activatingUser.admin_id,
          role: "3", // Assuming role is always 3 for these users
          active: 1 // Activate the user (set to 1)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Activation Response:", response.data);

      if (response.data.success) {
        toast.success(response.data.message || "User activated successfully!");

        // Remove the activated user from the list
        setInactiveUsers(prevUsers =>
          prevUsers.filter(user => user.admin_id !== activatingUser.admin_id)
        );

        // Update total records count
        setTotalRecords(prev => prev - 1);

        // Show message if no users left


        // Close modal
        setShowActivateModal(false);
        setActivatingUser(null);

        // Refresh data if current page might be empty
        if (inactiveUsers.length <= 1 && currentPage > 1) {
          fetchInactiveUserData(currentPage - 1);
        } else if (inactiveUsers.length === 1) {
          // If last user on page was activated, refetch current page
          fetchInactiveUserData(currentPage);
        }
      } else {
        toast.error(response.data.message || "Failed to activate user");
      }
    } catch (error) {
      console.error(
        "Error activating user:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to activate user");
    } finally {
      setActivationLoading(false);
    }
  };

  // Activate multiple users
  const handleActivateAll = async () => {
    if (inactiveUsers.length === 0) return;

    try {
      setActivationLoading(true);

      // Create an array of promises for all activation requests
      const activationPromises = inactiveUsers.map(user =>
        axios.post(
          `${API_URL}/update-client-status`,
          {
            admin_id: user.admin_id,
            role: "3",
            active: 1
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      );

      // Execute all requests
      const results = await Promise.all(activationPromises);

      // Check all responses
      const allSuccess = results.every(result => result.data.success);

      if (allSuccess) {
        toast.success("All users activated successfully!");

        // Clear the inactive users list
        setInactiveUsers([]);
        setTotalRecords(0);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        toast.error("Failed to activate some users");
      }
    } catch (error) {
      console.error("Error activating all users:", error);
      toast.error("Failed to activate users");
    } finally {
      setActivationLoading(false);
    }
  };

  // Open activate confirmation modal
  const openActivateModal = (user) => {
    setActivatingUser(user);
    setShowActivateModal(true);
  };

  // Close modal
  const closeActivateModal = () => {
    setShowActivateModal(false);
    setActivatingUser(null);
  };

  // Pagination handlers
  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchInactiveUserData(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchInactiveUserData(currentPage - 1);
    }
  };

  const handleFirst = () => {
    fetchInactiveUserData(1);
  };

  const handleLast = () => {
    fetchInactiveUserData(totalPages);
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchInactiveUserData(page);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRefresh = () => {
    fetchInactiveUserData(currentPage);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

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

  // Format date to IST
  const formatDateToIST = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
      const istDate = new Date(date.getTime() + istOffset);

      const day = istDate.getUTCDate().toString().padStart(2, '0');
      const month = (istDate.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = istDate.getUTCFullYear();

      let hours = istDate.getUTCHours();
      const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
      const seconds = istDate.getUTCSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12;
      hours = hours.toString().padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <>
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

      {/* Activate Confirmation Modal */}
      <Modal show={showActivateModal} onHide={closeActivateModal} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Activate User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activatingUser && (
            <div className="text-center">
              <div className="mb-4">
                <i className="bi bi-person-check-fill text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5>Are you sure you want to activate this user?</h5>
              <p className="text-muted">
                User: <strong>{activatingUser.username}</strong> ({activatingUser.admin_id})
              </p>
              <div className="alert alert-info">
                <small>
                  <strong>Details:</strong><br />
                  {/* Mobile: {activatingUser.mobile || "N/A"}<br /> */}
                  Balance: ₹{parseFloat(activatingUser.amount || 0).toFixed(2)}<br />
                  Parent: {activatingUser.parent_username || "N/A"}
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="refreshbutton" onClick={closeActivateModal} disabled={activationLoading}>
            Cancel
          </button>
          <button
            className="refreshbutton"
            onClick={handleActivateUser}
            disabled={activationLoading}
          >
            {activationLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Activating...
              </>
            ) : (
              "Yes, Activate User"
            )}
          </button>
        </Modal.Footer>
      </Modal>

      <div className="container-fluid">
        <div className="card">
          <div className="card-header bg-color-black text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h3 className="card-title text-white mb-0">
              Inactive List
            </h3>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="text"
                placeholder="Search by username, mobile, or admin ID..."
                value={searchTerm}
                onChange={handleSearch}
                className="me-2"
              />
              {/* {inactiveUsers.length > 0 && (
                <Button 
                  variant="warning" 
                  onClick={handleActivateAll}
                  size="sm"
                  disabled={activationLoading}
                >
                  <i className="bi bi-people-fill me-1"></i>
                  Activate All ({inactiveUsers.length})
                </Button>
              )} */}
              <button
                onClick={() => navigate(-1)}
                className="backbutton"
              >
                ← Back
              </button>
            </div>
          </div>

          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading inactive users...</p>
              </div>
            ) : inactiveUsers.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-emoji-smile text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h5>NO INACTIVE USERS FOUND</h5>
                <p className="text-muted">All users are currently active</p>
                {searchTerm && (
                  <Button
                    variant="outline-primary"
                    onClick={handleClearSearch}
                    className="mt-2"
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>USERNAME</th>
                        <th>ADMIN ID</th>
                        {/* <th>MOBILE</th> */}
                        <th className="text-end">BALANCE</th>
                        <th className="text-end">COINS</th>
                        <th>PARENT USERNAME</th>
                        <th>CREATED AT</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inactiveUsers.map((user, index) => {
                        const serialNumber = ((currentPage - 1) * limit) + index + 1;
                        return (
                          <tr key={user._id || index}>
                            <td className="fw-bold">{serialNumber}</td>
                            <td className="fw-semibold">{user.username || "N/A"}</td>
                            <td>
                              <span className="warningbadge">
                                {user.admin_id || "N/A"}
                              </span>
                            </td>
                            {/* <td>{user.mobile || "N/A"}</td> */}
                            <td className="text-end fw-bold">
                              ₹{parseFloat(user.amount || 0).toFixed(2)}
                            </td>
                            <td className="text-end">
                              <span className="bonusbadge">
                                {parseFloat(user.coins || 0).toFixed(2)}
                              </span>
                            </td>
                            <td>{user.parent_username || "N/A"}</td>
                            <td className="text-nowrap">
                              <small>{formatDateToIST(user.created_at)}</small>
                            </td>
                            <td>
                              <span className={`badge ${user.active === 0 ? 'activebadge' : 'inactivebadge'}`}>
                                <i className={`bi ${user.active === 0 ? 'bi-person-x' : 'bi-person-check'} me-1`}></i>
                                {user.active === 0 ? 'Inactive' : 'Active'}
                              </span>
                            </td>
                            <td>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => openActivateModal(user)}
                                disabled={activationLoading}
                              >
                                <i className="bi bi-check-circle me-1"></i>
                                Activate
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {/* Enhanced Pagination UI */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="sohwingallentries">
                      Showing {((currentPage - 1) * limit) + 1} to{" "}
                      {Math.min(currentPage * limit, totalRecords)} of{" "}
                      {totalRecords} entries
                    </div>

                    <div className="paginationall d-flex align-items-center gap-1">
                      {/* <button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === 1 || loading}
                        onClick={handleFirst}
                        className="px-3"
                      >
                        <i className="bi bi-chevron-double-left"></i>
                      </button> */}

                      <button
                        disabled={currentPage === 1 || loading}
                        onClick={handlePrev}
                      >
                        <MdOutlineKeyboardArrowLeft />
                      </button>

                      <div className="d-flex gap-1">
                        {getPageNumbers().map((page) => (
                          <div
                            key={page}
                            // variant={currentPage === page ? "primary" : "outline-primary"}
                            className={`paginationnumber     ${currentPage === page ? "active" : "outline-primary"}`}

                            onClick={() => handlePageClick(page)}
                            disabled={loading}
                          >
                            {page}
                          </div>
                        ))}
                      </div>

                      <button
                        disabled={currentPage === totalPages || loading}
                        onClick={handleNext}
                      >
                        <MdOutlineKeyboardArrowRight />
                      </button>

                      {/* <button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === totalPages || loading}
                        onClick={handleLast}
                        className="px-3"
                      >
                        <i className="bi bi-chevron-double-right"></i>
                      </button> */}
                    </div>

                    <div>
                      <Form.Select
                        size="sm"
                        value={limit}
                        onChange={(e) => {
                          setLimit(parseInt(e.target.value));
                          fetchInactiveUserData(1);
                        }}
                        style={{ width: '100px' }}
                        disabled={loading}
                      >
                        <option value="5">5 / page</option>
                        <option value="10">10 / page</option>
                        <option value="20">20 / page</option>
                        <option value="50">50 / page</option>
                      </Form.Select>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card.Body>

          <Card.Footer className="bg-light">
            <div className="row align-items-center">
              <div className="col-md-6">
                <small className="text-muted">
                  <i className="bi bi-clock-history me-1"></i>
                  Last updated: {new Date().toLocaleString()}
                </small>
              </div>
              <div className="col-md-6 text-end">
                <small className="text-muted">
                  <i className="bi bi-person-x me-1"></i>
                  Total Inactive Users: <strong>{totalRecords}</strong>
                </small>
              </div>
            </div>
          </Card.Footer>
        </div>
      </div>
    </>
  );
}

export default InactiveUserList;