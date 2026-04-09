import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPlus, FaUserShield } from "react-icons/fa";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi2";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";


const API_URL = process.env.REACT_APP_API_URL;

function AllCreatedTicketSupport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [TicketSupportLists, setTicketSupportLists] = useState([]);
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };
  const fetchCreatedTicketSupport = async (page = 1) => {
    setLoading(true);  // 👈 yaha uncomment karo
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
      setTicketSupportLists([]); // 👈 API fail ho tab bhi table render ho
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false); // 👈 ye loader band karega
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
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover shadow-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th>S.N</th>
                  <th>Priority</th>
                  <th>Description</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Subject</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {TicketSupportLists.length > 0 ? (
                  TicketSupportLists.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.priority || "NA"}</td>
                      <td>{item.description || "NA"}</td>
                      <td>{item.assigned_to || "NA"}</td>
                      <td>{item.Status || "NA"}</td>
                      <td>{item.subject || "NA"}</td>
                      <td>{item.Remark || "NA"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No data found.</td>
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