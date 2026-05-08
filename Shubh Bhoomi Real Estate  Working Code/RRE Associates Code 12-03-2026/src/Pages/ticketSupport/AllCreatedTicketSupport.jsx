import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaEdit } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;
const profileImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/support_tickets/`;
const documentImage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/documents/`;

function AllCreatedTicketSupport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [TicketSupportLists, setTicketSupportLists] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
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

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
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
              <h3>All Created Ticket Support Lists</h3>
            </div>
                <div className="createnewadmin">
              <Link
                to="/create-ticket-support"
                className="btn btn-success d-inline-flex align-items-center"
              >
                <FaPlus className="me-1" /> Create Ticket Support
              </Link>
            </div>

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
                  
                  <th>Status</th>
                  <th>Attachment</th>
                  <th>Assigned To</th>
                  <th>Resolution</th>
                  <th>Created Date</th>
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
                      <td className="table-cell-remark"  style={{ minWidth: "350px" }}>
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
                        <span
                          className={`badge ${item.status === "open"
                            ? "bg-danger"
                            : item.status === "in_progress"
                              ? "bg-warning text-dark"
                              : item.status === "resolved"
                                ? "bg-success"
                                : item.status === "closed"
                                  ? "bg-dark"
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
                       <td>
                        {item.assigned_to || "Admin"}
                      </td>
                      <td style={{ minWidth: "250px" }}>
                        {item.resolution || "---"}
                      </td>
                      <td>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString()
                          : "NA"}
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