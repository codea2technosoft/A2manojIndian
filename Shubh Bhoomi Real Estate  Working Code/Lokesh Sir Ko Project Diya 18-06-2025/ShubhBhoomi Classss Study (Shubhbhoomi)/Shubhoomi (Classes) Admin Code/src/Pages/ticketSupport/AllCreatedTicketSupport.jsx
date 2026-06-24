import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const profileImage = `${process.env.REACT_APP_Image_URL}/support_tickets/`;
const documentImage = `${process.env.REACT_APP_IMAGE_API_URL}/documents/`;

function AllCreatedTicketSupport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [TicketSupportLists, setTicketSupportLists] = useState([]);
  const navigate = useNavigate();
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };
  const fetchCreatedTicketSupport = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found. Please log in.");

      const response = await fetch(`${API_URL}/created-ticket-support-lists?page=${page}&limit=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized: Please log in again.");
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch Ticket Support.");
      }

      const data = await response.json();
      setTicketSupportLists(data.data || []);
      setTotalPages(data.data.totalPages || 1);
      setCurrentPage(page);

    } catch (err) {
      console.error(err);
      setError(err.message);
      setTicketSupportLists([]);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatedTicketSupport();
  }, []);

  const handlePageChange = (pageNumber) => {
    if (!totalPages || pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    fetchCreatedTicketSupport(pageNumber);
  };

  const handleStatusChange = (id, value) => {
    setTicketSupportLists((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: value }
          : item
      )
    );
  };

  const handleResolutionChange = (
    id,
    value
  ) => {
    setTicketSupportLists((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
            ...item,
            resolution: value,
          }
          : item
      )
    );
  };

  const updateTicketRequest = async (
    item
  ) => {
    try {
      const token = getAuthToken();
      if (!item.resolution || item.resolution.trim() === "") {
        setErrors((prev) => ({
          ...prev,
          [item.id]: "Resolution / Remark is required",
        }));
        return;
      }
      setErrors((prev) => ({
        ...prev,
        [item.id]: "",
      }));

      const payload = {
        ticket_no: item.ticket_no,
        status: item.status,
        resolution: item.resolution,
        resolved_by: "Admin",
        assigned_to: "Admin",
        resolved_at: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      };

      const response = await fetch(
        `${API_URL}/update-ticket-status`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (
        response.ok &&
        result.success === "1"
      ) {
        Swal.fire(
          "Success",
          result.message,
          "success"
        );

        fetchCreatedTicketSupport(
          currentPage
        );
        window.location.reload();
      } else {
        Swal.fire(
          "Error",
          result.message ||
          "Update failed",
          "error"
        );
      }
    } catch (err) {
      console.error(err);

      Swal.fire(
        "Error",
        err.message,
        "error"
      );
    }
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

  return (
    <div className="padding_15">
      <div className="card bg-white">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>All Ticket Support Lists</h3>
            </div>
            <marquee
              style={{
                color: "#f70707",
                fontWeight: "500"
              }}
            >
              ⚠️ Important : Admin must mark ticket as "Closed" after resolution. Otherwise customer will continue seeing it as Open/In Progress.
            </marquee>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover shadow-sm fixed-table">

              <thead className="bg-primary text-white">
                <tr>
                  <th>S.N</th>
                  <th>Ticket No</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th> Status</th>
                  <th>Attachment</th>
                  <th>Resolution</th>
                  <th>Created Date</th>
                  <th>Resulation</th>
                </tr>
              </thead>

              <tbody>
                {TicketSupportLists.length > 0 ? (
                  TicketSupportLists.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td>
                        #{item.ticket_no || "NA"}
                      </td>
                      <td className="table-cell-remark" style={{ minWidth: "350px" }}>
                        {item.subject || "NA"}
                      </td>

                      <td className="table-cell-remark" style={{ minWidth: "350px" }}>
                        {item.description || "NA"}
                      </td>
                      <td>
                        <span
                          className={`badge ${item.priority === "low"
                            ? "bg-secondary"
                            : item.priority === "medium"
                              ? "bg-info"
                              : item.priority === "high"
                                ? "bg-warning text-dark"
                                : item.priority === "urgent"
                                  ? "bg-danger"
                                  : "bg-secondary"
                            }`}
                        >
                          {item.priority || "NA"}
                        </span>
                      </td>
                      <td>
                        {item.assigned_to || "Admin"}
                      </td>
                      <td>
                        <span
                          className={`badge ${item.status === "open"
                              ? "bg-danger"
                              : item.status === "in_progress"
                                ? "bg-warning text-dark"
                                : item.status === "resolved"
                                  ? "bg-success"
                                  : item.status === "closed"
                                    ? "bg-success"
                                    : "bg-secondary"
                            }`}
                        >
                          {item.status || "NA"}
                        </span>
                      </td>
                      <td>
                        {item.attachment ? (
                          item.attachment.endsWith(".pdf") ? (
                            <a
                              href={`${profileImage}/${item.attachment}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📄 View PDF
                            </a>
                          ) : (
                            <a
                              href={`${profileImage}/${item.attachment}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`${profileImage}/${item.attachment}`}
                                width="50px"
                                height="50px"
                                style={{ objectFit: "cover", cursor: "pointer" }}
                              />
                            </a>
                          )
                        ) : (
                          "NA"
                        )}
                      </td>
                      <td style={{ minWidth: "250px" }}>
                        {item.resolution || "---"}
                      </td>
                      <td>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "NA"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: item.status === "closed" ? "#198754" : "#dc3545",
                            color: "white",
                            border: "none",
                            width: "140px",
                            textAlign: "center",
                            opacity: item.status === "closed" ? 0.85 : 1,
                            cursor: item.status === "closed" ? "not-allowed" : "pointer",
                            pointerEvents: item.status === "closed" ? "none" : "auto"
                          }}
                          data-bs-toggle={item.status === "closed" ? "" : "modal"}
                          data-bs-target={item.status === "closed" ? "" : `#editModal${item.id}`}
                          disabled={item.status === "closed"}
                        >
                          {item.status === "closed" ? "Issues Closed" : "Fix Issue"}
                        </button>
                        <div
                          className="modal fade"
                          id={`editModal${item.id}`}
                          tabIndex="-1"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modal-lg">
                            <div className="modal-content">

                              <div className="modal-header">
                                <h5 className="modal-title">

                                  <marquee
                                    style={{
                                      color: "#f70707",
                                      fontWeight: "500"
                                    }}
                                  >
                                    ⚠️ Important : Admin must mark ticket as "Closed" after resolution. Otherwise customer will continue seeing it as Open/In Progress.
                                  </marquee>
                                </h5>

                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                ></button>
                              </div>

                              <div className="modal-body">
                                <div className="mb-3">
                                  <label className="form-label">
                                    Issue Subject Details : <span style={{ color: "red" }}>*</span>
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control"
                                    value={item.subject || ""}
                                    disabled
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">
                                    Issue Descriptions : <span style={{ color: "red" }}>*</span>
                                  </label>

                                  <textarea
                                    className="form-control"
                                    rows="4"
                                    value={item.description || ""}
                                    disabled
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">
                                    Issue Priority : <span style={{ color: "red" }}>*</span>
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control"
                                    value={item.priority || ""}
                                    disabled
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">
                                    Issue Status : <span style={{ color: "red" }}>*</span>
                                  </label>

                                  <select
                                    className="form-select"
                                    value={item.status || ""}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        item.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="open">
                                      Open
                                    </option>

                                    <option value="in_progress">
                                      In Progress
                                    </option>

                                    <option value="resolved">
                                      Resolved
                                    </option>

                                    <option value="closed">
                                      Closed
                                    </option>
                                  </select>
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">
                                    Resolution / Remark <span style={{ color: "red" }}>*</span>
                                  </label>

                                  <textarea
                                    className={`form-control ${errors[item.id] ? "is-invalid" : ""}`}
                                    rows="4"
                                    placeholder="Enter Issue Resolution Details In 500 Characters Minimum."
                                    value={item.resolution || ""}
                                    onChange={(e) =>
                                      handleResolutionChange(item.id, e.target.value)
                                    }
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">
                                    Resolved By<span style={{ color: "red" }}>*</span>
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control"
                                    value="Admin"
                                    disabled
                                  />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">
                                    Resolution  Date <span style={{ color: "red" }}>*</span>
                                  </label>

                                  <input
                                    type="text"
                                    className="form-control"
                                    value={
                                      new Date().toLocaleDateString("en-GB").replace(/\//g, "-") +
                                      " " +
                                      new Date().toLocaleTimeString("en-GB")
                                    }
                                    disabled
                                  />
                                </div>

                              </div>

                              <div className="modal-footer d-flex gap-2">
                                <button
                                  type="button"
                                  className="btn btn-success w-10"
                                  data-bs-dismiss="modal"
                                >
                                  Finish / Close
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-success w-10"
                                  onClick={() => updateTicketRequest(item)}
                                >
                                  Update Ticket
                                </button>
                              </div>

                            </div>
                          </div>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

          <div className="d-flex justify-content-end ">
            <nav>
              <ul className="pagination">
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
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
                  >
                    <HiChevronRight />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AllCreatedTicketSupport;