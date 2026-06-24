import React, { useEffect, useState, useCallback } from "react";
import { Container, Card, Table, Spinner, Form, Button, Pagination, Modal, Badge } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";


function Blocklist() {
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activatingUser, setActivatingUser] = useState(null);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(10);

  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL || "http://192.168.1.12:9002/api/admin";
  const navigate = useNavigate();

  // Memoized fetch function
  const fetchInactiveUserData = useCallback(async (page = 1, search = searchTerm, pageLimit = limit) => {
    try {
      setLoading(true);
      console.log("Fetching data with:", { page, limit: pageLimit, search });

      const response = await axios.post(
        `${API_URL}/get-user-block-list`,
        {
          role: 3,
          page: page,
          limit: pageLimit,
          search: search || ""
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
        const data = response.data.data || [];
        const pagination = response.data.pagination || {
          total_records: 0,
          total_pages: 1,
          current_page: 1,
          limit: pageLimit
        };

        setInactiveUsers(data);
        setTotalRecords(pagination.total_records || 0);
        setTotalPages(pagination.total_pages || 1);
        setCurrentPage(pagination.current_page || 1);
        setLimit(pagination.limit || pageLimit);

        if (data.length === 0 && page > 1) {
          // If no data on current page, go to previous page
          fetchInactiveUserData(page - 1, search, pageLimit);
        }
      } else {
        toast.error(response.data.message || "Failed to load data");
        setInactiveUsers([]);
        setTotalRecords(0);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error(
        "Error fetching inactive users:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to load inactive users");
      setInactiveUsers([]);
      setTotalRecords(0);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [token, API_URL, searchTerm, limit]);

  // Initial fetch and refresh on search term change
  useEffect(() => {
    fetchInactiveUserData(1, searchTerm);
  }, [fetchInactiveUserData, searchTerm]);

  // Activate User Function - Fixed endpoint
  const handleActivateUser = async () => {
    if (!activatingUser) return;

    try {
      setActivationLoading(true);

      console.log("Activating user with data:", {
        admin_id: activatingUser.admin_id,
        role: "3",
        is_blocked: 0  // Changed from active: 1 to is_blocked: 0
      });

      const response = await axios.post(
        `${API_URL}/block-unblock-user`,  // Using the correct endpoint
        {
          admin_id: activatingUser.admin_id,
          role: "3",
          is_blocked: 0  // 0 means unblock/activate
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
        setTotalRecords(prev => Math.max(0, prev - 1));

        // Refresh pagination data
        if (inactiveUsers.length === 1) {
          // If this was the last user on the page
          if (currentPage > 1) {
            fetchInactiveUserData(currentPage - 1);
          } else {
            // Reset to empty state
            setInactiveUsers([]);
            setTotalPages(1);
          }
        } else {
          // Refetch current page to get updated data
          fetchInactiveUserData(currentPage);
        }

        // Close modal
        setShowActivateModal(false);
        setActivatingUser(null);
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

  // Activate multiple users - Fixed endpoint
  const handleActivateAll = async () => {
    if (inactiveUsers.length === 0) {
      toast.info("No users to activate");
      return;
    }

    if (!window.confirm(`Are you sure you want to activate all ${inactiveUsers.length} users?`)) {
      return;
    }

    try {
      setActivationLoading(true);

      // Create an array of promises for all activation requests
      const activationPromises = inactiveUsers.map(user =>
        axios.post(
          `${API_URL}/block-unblock-user`,  // Using the correct endpoint
          {
            admin_id: user.admin_id,
            role: "3",
            is_blocked: 0  // 0 means unblock/activate
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
      const allSuccess = results.every(result => result.data?.success);

      if (allSuccess) {
        toast.success(`All ${inactiveUsers.length} users activated successfully!`);

        // Clear the inactive users list
        setInactiveUsers([]);
        setTotalRecords(0);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        toast.error("Failed to activate some users. Please try individually.");
      }
    } catch (error) {
      console.error("Error activating all users:", error);
      toast.error("Failed to activate users. Please try individually.");
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
    if (currentPage !== 1) {
      fetchInactiveUserData(1);
    }
  };

  const handleLast = () => {
    if (currentPage !== totalPages) {
      fetchInactiveUserData(totalPages);
    }
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchInactiveUserData(page);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    fetchInactiveUserData(currentPage);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
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
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  // Calculate serial number
  const getSerialNumber = (index) => {
    return ((currentPage - 1) * limit) + index + 1;
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
          <Modal.Title>
            <i className="bi bi-person-check me-2"></i>
            Block User
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activatingUser && (
            <div className="text-center">
              {/* <div className="mb-4">
                <i className="bi bi-person-check-fill text-success" style={{ fontSize: '3rem' }}></i>
              </div> */}
              <h5>Are you sure you want to activate this user?</h5>
              <p className="text-muted">
                User: <strong>{activatingUser.username}</strong>
              </p>
              {/* <div className="alert alert-info">
                <small>
                  <strong>Details:</strong><br />
                  Admin ID: <Badge bg="secondary">{activatingUser.admin_id}</Badge><br />
                  Balance: ₹{parseFloat(activatingUser.amount || 0).toFixed(2)}<br />
                  Parent: {activatingUser.parent_username || "N/A"}<br />
                  Status: <Badge bg={activatingUser.is_blocked === 1 ? "danger" : "success"}>
                    {activatingUser.is_blocked === 1 ? "Blocked" : "Active"}
                  </Badge>
                </small>
              </div> */}
              <div className="alert alert-dark mb-0">
                <ul className="list-unstyled mb-0 listpopup small text-light">
                  <li className="mb-2">
                    <strong>Admin ID:</strong>{" "}
                    <Badge bg="secondary">{activatingUser.admin_id}</Badge>
                  </li>

                  <li className="mb-2">
                    <strong>Balance:</strong>{" "}
                    ₹{parseFloat(activatingUser.amount || 0).toFixed(2)}
                  </li>

                  <li className="mb-2">
                    <strong>Parent:</strong>{" "}
                    {activatingUser.parent_username || "N/A"}
                  </li>

                  <li className="d-flex align-items-center gap-2">
                    <strong>Status:</strong>
                    <div
                      className={activatingUser.is_blocked === 1 ? "activebadge" : "inactivebadge"}
                    >
                      {activatingUser.is_blocked === 1 ? "Blocked" : "Active"}
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="refreshbutton" onClick={closeActivateModal} disabled={activationLoading}>
            <i className="bi bi-x-circle me-1"></i>
            Cancel
          </button>
          <button
            className="refreshbutton submitall"
            onClick={handleActivateUser}
            disabled={activationLoading}
          >
            {activationLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Activating...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-1"></i>
                Yes, Activate User
              </>
            )}
          </button>
        </Modal.Footer>
      </Modal>

      <div className="card">
        <div className="card-header flex-wrap-mobile bg-color-black text-white d-flex justify-content-between flex-wrap-mobile align-items-center">
          <h3 className="card-title text-white mb-0">
            Blocked  List
          </h3>
          <div className="d-flex align-items-center gap-2">
            <Form.Control
              type="text"
              placeholder="Search by username or admin ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="me-2"
            />
            {/* {inactiveUsers.length > 0 && (
                <Button 
                  variant="warning" 
                  onClick={handleActivateAll}
                  size="sm"
                  disabled={activationLoading || loading}
                >
                  <i className="bi bi-people-fill me-1"></i>
                  Activate All ({inactiveUsers.length})
                </Button>
              )} */}
      <button
  onClick={() => navigate(-1)}
  className="backbutton"
  disabled={loading || activationLoading}
>
  ← Back
</button>






            {/* <button
      onClick={() => navigate(-1)}
      className="backbutton"
    >
    </button>  */}

          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading blocked users...</p>
            </div>
          ) : inactiveUsers.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="bi bi-emoji-smile text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h5>NO BLOCKED USERS FOUND</h5>
              <p className="text-muted">All users are currently active</p>
              {searchTerm && (
                <button
                  className="refreshbutton"
                  onClick={handleClearSearch}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Clear Search
                </button>
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
                      <th className="text-end">BALANCE</th>
                      <th className="text-end">COINS</th>
                      <th>PARENT USERNAME</th>
                      <th>CREATED AT</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inactiveUsers.map((user, index) => (
                      <tr key={user._id || user.admin_id || index}>
                        <td className="fw-bold">{getSerialNumber(index)}</td>
                        <td className="fw-semibold">{user.username || "N/A"}</td>
                        <td>
                          <div className="bonusbadge text-center">
                            {user.admin_id || "N/A"}
                          </div>
                        </td>
                        <td className="text-center fw-bold">
                          ₹{parseFloat(user.amount || 0).toFixed(2)}
                        </td>
                        <td className="text-center">
                          <div className="warningbadge">
                            {parseFloat(user.coins || 0).toFixed(2)}
                          </div>
                        </td>
                        <td>{user.parent_username || "N/A"}</td>
                        <td className="text-nowrap">
                          <small>{formatDateToIST(user.created_at)}</small>
                        </td>
                        <td>
                          <div className={user.is_blocked === 1 ? "activebadge  " : " inactivebadge"}>
                            <i className={`bi ${user.is_blocked === 1 ? 'bi-person-x' : 'bi-person-check'} me-1`}></i>
                            {user.is_blocked == 1 ? 'Blocked' : 'Active'}
                          </div>
                        </td>
                        <td>
                          <button
                            className="refreshbutton"
                            onClick={() => openActivateModal(user)}
                            disabled={activationLoading}
                          >
                            <i className="bi bi-check-circle me-1"></i>
                            Activate
                          </button>
                        </td>
                      </tr>
                    ))}
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

                  <div className="d-flex paginationall align-items-center gap-1">
                    {/* <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === 1 || loading || activationLoading}
                        onClick={handleFirst}
                        className="px-3"
                        title="First Page"
                      >
                        <i className="bi bi-chevron-double-left"></i>
                      </Button> */}

                    <button
                      disabled={currentPage === 1 || loading || activationLoading}
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
                          disabled={loading || activationLoading || currentPage === page}
                        >
                          {page}
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={currentPage === totalPages || loading || activationLoading}
                      onClick={handleNext}
                    >
                      <MdOutlineKeyboardArrowRight />
                    </button>

                    {/* <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === totalPages || loading || activationLoading}
                        onClick={handleLast}
                        className="px-3"
                        title="Last Page"
                      >
                        <i className="bi bi-chevron-double-right"></i>
                      </Button> */}
                  </div>

                  <div>
                    <Form.Select
                      size="sm"
                      value={limit}
                      onChange={(e) => {
                        const newLimit = parseInt(e.target.value);
                        setLimit(newLimit);
                        fetchInactiveUserData(1, searchTerm, newLimit);
                      }}
                      style={{ width: '120px' }}
                      disabled={loading || activationLoading}
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
        </div>

        <div className="card-footer">
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
                Total Blocked Users: <strong>{totalRecords}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Blocklist;