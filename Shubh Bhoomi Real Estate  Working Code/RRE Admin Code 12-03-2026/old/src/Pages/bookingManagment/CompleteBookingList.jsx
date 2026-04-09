import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Pagination } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function CompleteBookingList() {
  const [pendingBooking, setPendingBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState({
    project_name: "",
    block_name: "",
    plot_name: "",
    user_mobile: "",
  });

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
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchPendingBooking = async (page = 1, query = "") => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }


      const query = new URLSearchParams({
        page,
        project_name: searchTerm.project_name,
        block_name: searchTerm.block_name,
        plot_name: searchTerm.plot_name,
        user_mobile: searchTerm.user_mobile,
      }).toString();

      const url = new URL(`${API_URL}/complete-booking-list?${query}`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          showCustomMessageModal("Authorization Error", "Unauthorized: Please log in again.", "error");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch Complete Booking.");
      }

      const data = await response.json();
      setPendingBooking(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Fetch Complete booking error:", err);
      setError(err.message);
      if (!showMessageModal) {
        showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching Complete Booking.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBooking(currentPage, searchQuery);
  }, [currentPage, searchQuery]);




  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPendingBooking(1, searchQuery);
  };



  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
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
        <button className="btn btn-primary ms-3" onClick={() => fetchPendingBooking()}>
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
              <h3>Complete Booking List</h3>
            </div>
            <div className="d-none d-md-block">
              <div className="d-flex gap-2">
                <div className="form_design">
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

                <div className="form_design">
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

                <div className="form_design">
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

                <div className="form_design">
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
                    className="searchbutton"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="d-block d-md-none">
              <div className="d-flex gap-2">
                
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
        </div>

        <div className="card-body">
              {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
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
                    className="searchbutton"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
            </div>
          )}
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
                </tr>
              </thead>
              <tbody>
                {pendingBooking?.length > 0 ? (
                  pendingBooking.map((pendingbooked, i) => (
                    <tr key={pendingbooked.id}>
                      <td>{(currentPage - 1) * 10 + (i + 1)}</td>
                      <td>{pendingbooked.project_name || "-"}</td>
                      <td>{pendingbooked.block_name || "-"}</td>
                      <td>{pendingbooked.plot_name || "-"}</td>
                      <td>{pendingbooked.user_name || "-"}</td>
                      <td>{pendingbooked.user_mobile || "-"}</td>
                      <td>{pendingbooked.booking_date || "-"}</td>
                      <td>
                        <span className="badge bg-warning">{pendingbooked.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center text-danger fw-bold">
                      No Complete Booking found.
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
      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${messageModalContent.type === "success"
                ? "border-success"
                : messageModalContent.type === "error"
                  ? "border-danger"
                  : "border-warning"
                }`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${messageModalContent.type === "success"
                    ? "text-success"
                    : messageModalContent.type === "error"
                      ? "text-danger"
                      : "text-warning"
                    }`}
                >
                  {messageModalContent.title}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomMessageModal}></button>
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
    </div>
  );
}

export default CompleteBookingList;