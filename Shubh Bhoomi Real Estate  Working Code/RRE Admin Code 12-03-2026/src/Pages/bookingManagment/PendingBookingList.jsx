import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function PendingBookingList() {
  const [pendingBooking, setPendingBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchTerm, setSearchTerm] = useState({
    project_name: "",
    block_name: "",
    plot_name: "",
    user_mobile: "",
  });

  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

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

  const fetchPendingBooking = async (page = 1, params = {}) => {
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
        return;
      }

      const query = new URLSearchParams({
        page,
        project_name: searchTerm.project_name,
        block_name: searchTerm.block_name,
        plot_name: searchTerm.plot_name,
        user_mobile: searchTerm.user_mobile,
      }).toString();

      const url = new URL(`${API_URL}/pending-book-list?${query}`);

      const response = await fetch(url.toString(), {
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
        throw new Error(
          errorData.message || "Failed to fetch Pending Booking.",
        );
      }

      const data = await response.json();
      setPendingBooking(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Fetch pending booking error:", err);
      setError(err.message);
      showCustomMessageModal(
        "Error",
        err.message ||
          "An unexpected error occurred while fetching Pending Booking.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBooking(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/booking/${id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        showCustomMessageModal("Success", data.message, "success");
        fetchPendingBooking(currentPage, searchQuery);
      } else {
        showCustomMessageModal(
          "Error",
          data.message || "Failed to update status",
          "error",
        );
      }
    } catch (err) {
      console.error("Update Status Error:", err);
      showCustomMessageModal("Error", "Something went wrong", "error");
    }
  };

  const handleUpdateStatusClick = (id, status) => {
    showCustomMessageModal(
      "Confirm Status Change",
      `Are you sure you want to change the status to '${status}'?`,
      "warning",
      () => updateStatus(id, status),
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPendingBooking(1, searchQuery);
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
        <button
          className="btn btn-primary ms-3"
          onClick={() => fetchPendingBooking()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="userlist mt-2">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="titlepage">
              <h3>Pending Booking List</h3>
            </div>

            <div className="d-flex gap-2">
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

        {isFilterActive && (
          <div className="card-body pb-0">
            <div className="d-flex gap-2 flex-wrap-mobile align-items-center">
              <div className="form_design w-100">
                <input
                  type="text"
                  name="project_name"
                  placeholder="Project Name"
                  value={searchTerm.project_name}
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
                  name="block_name"
                  placeholder="Block Name"
                  value={searchTerm.block_name}
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
                  name="plot_name"
                  placeholder="Unit Number"
                  value={searchTerm.plot_name}
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
                  name="user_mobile"
                  placeholder="Mobile"
                  value={searchTerm.user_mobile}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form_design">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card-body">
          <div className="table-responsive">
            <Table bordered hover>
              <thead className="bg-primary text-white">
                <tr>
                  <th>#</th>
                  <th>Project Name</th>
                  <th>Block Name</th>
                  <th>Unit Number</th>
                  <th>User Name</th>
                  <th>User Mobile</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingBooking?.length > 0 ? (
                  pendingBooking.map((pendingbooked, i) => (
                    <tr key={pendingbooked.id}>
                      <td>{(currentPage - 1) * 10 + (i + 1)}</td>
                      <td>{pendingbooked.project_name}</td>
                      <td>{pendingbooked.block_name}</td>
                      <td>{pendingbooked.plot_name}</td>
                      <td>{pendingbooked.user_name}</td>
                      <td>{pendingbooked.user_mobile}</td>
                      <td>{pendingbooked.booking_date}</td>
                      <td>
                        <span className="badge bg-warning">
                          {pendingbooked.status}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn light btn-action dropdown-toggle"
                            type="button"
                            id={`dropdownMenuButton-${pendingbooked.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <BsThreeDots size={20} />
                          </button>

                          <ul
                            className="dropdown-menu"
                            aria-labelledby={`dropdownMenuButton-${pendingbooked.id}`}
                          >
                            {/* The onClick for all buttons must be changed */}

                            <li className="dropdown-item">
                              <button
                                className="btn btn-sm btn-info w-100"
                                onClick={() =>
                                  handleUpdateStatusClick(
                                    pendingbooked.id,
                                    "booked_pending",
                                  )
                                }
                              >
                                Booked Pending
                              </button>
                            </li>

                            <li className="dropdown-item">
                              <button
                                className="btn btn-sm btn-danger w-100"
                                onClick={() =>
                                  handleUpdateStatusClick(
                                    pendingbooked.id,
                                    "cancelled",
                                  )
                                }
                              >
                                Cancelled
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-danger fw-bold">
                      No Pending Booking found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-end">
            <div className="d-flex justify-content-end">
              <Pagination>
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />

                {/* Compact Pagination View */}
                {totalPages > 5 ? (
                  <>
                    <Pagination.Item
                      active={currentPage === 1}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </Pagination.Item>

                    {currentPage > 3 && <Pagination.Ellipsis disabled />}

                    {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                      .filter((page) => page > 1 && page < totalPages)
                      .map((page) => (
                        <Pagination.Item
                          key={page}
                          active={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Pagination.Item>
                      ))}

                    {currentPage < totalPages - 2 && (
                      <Pagination.Ellipsis disabled />
                    )}

                    <Pagination.Item
                      active={currentPage === totalPages}
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Pagination.Item>
                  </>
                ) : (
                  [...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))
                )}

                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          </div>
        </div>
      </div>
      {showMessageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${
                messageModalContent.type === "success"
                  ? "border-success"
                  : messageModalContent.type === "error"
                    ? ""
                    : ""
              }`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${
                    messageModalContent.type === "success"
                      ? ""
                      : messageModalContent.type === "error"
                        ? ""
                        : ""
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
              <div className="modal-footer justify-content-end">
                {messageModalContent.confirmAction ? (
                  <>
                    <Button variant="danger" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                    <Button
                      variant={
                        messageModalContent.type === "success"
                          ? "success"
                          : "primary"
                      }
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
    </div>
  );
}

export default PendingBookingList;
