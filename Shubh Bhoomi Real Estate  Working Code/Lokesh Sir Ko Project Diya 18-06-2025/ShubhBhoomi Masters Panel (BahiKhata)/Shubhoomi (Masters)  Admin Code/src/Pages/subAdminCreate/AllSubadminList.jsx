import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPlus, FaUserShield, FaTrash } from "react-icons/fa";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi2";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";


const API_URL = process.env.REACT_APP_API_URL;

function AllSubadminList() {

  const [subadmins, setSubadmins] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [searchEmail, setSearchEmail] = useState("");


  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const fetchSubadmins = async (page = 1, email = "") => {
    // setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }


      const response = await fetch(
        `${API_URL}/sub-admin-list?page=${page}&limit=10&email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again.");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch sub-admins.");
      }

      const data = await response.json();

      setSubadmins(data.data || []);
      setTotalPages(data.data.totalPages || 1);
      setCurrentPage(page);

    } catch (err) {
      console.error("Fetch sub-admins error:", err);
      setError(err.message);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSubadmins(currentPage, searchEmail);
  }, [currentPage, searchEmail]);


  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  const handleSearchChange = (e) => {
    setSearchEmail(e.target.value);
    setCurrentPage(1);
  };


  const handleStatusUpdate = async (subadminId, currentStatus) => {

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the status to ${currentStatus === "active" ? "inactive" : "active"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        setError(null);

        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error("Authentication token not found. Please log in.");
          }

          const newStatus = currentStatus === "active" ? "inactive" : "active";
          const response = await fetch(`${API_URL}/sub-admin-status-update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: subadminId,
              status: newStatus,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update sub-admin status.");
          }

          Swal.fire("Success", "Sub-admin status updated successfully!", "success");
          fetchSubadmins(currentPage, searchEmail);

        } catch (err) {
          console.error("Status update error:", err);
          setError(err.message);
          Swal.fire("Error", err.message, "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Delete sub-admin function
  const handleDeleteSubAdmin = async (subadminId, subadminEmail) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete sub-admin with email: ${subadminEmail}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        setError(null);

        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error("Authentication token not found. Please log in.");
          }

          const response = await fetch(`${API_URL}/delete-sub-admin`, {
            method: "delete",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: subadminId,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete sub-admin.");
          }

          Swal.fire("Deleted!", "Sub-admin has been deleted successfully!", "success");
          fetchSubadmins(currentPage, searchEmail);

        } catch (err) {
          console.error("Delete sub-admin error:", err);
          setError(err.message);
          Swal.fire("Error", err.message, "error");
        } finally {
          setLoading(false);
        }
      }
    });
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
        <button className="btn btn-primary ms-3" onClick={() => fetchSubadmins()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="padding_15">

      <div className="card bg-white">
        <div className="card-header">

          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>All Sub Admin</h3>
            </div>
            <div className="d-flex gap-2">
              <div className="d-none d-md-block">
                <div className="form-group" id="searchEmail">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="createnewadmin">
                <Link to="/create-subadmin" className="btn btn-success d-inline-flex align-items-center">
                  <FaPlus className="me-2" /> Sub-admin
                </Link>
              </div>
              <div className="d-block d-md-none">
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
          </div>
        </div>
        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              <div className="form-group w-100" id="searchEmail">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          )}
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover shadow-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th>S.N</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th colspan ="3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subadmins.length > 0 ? (
                  subadmins.map((subadmin, index) => (
                    <tr key={subadmin.id}>
                      <td>{index + 1}</td>
                      <td>{subadmin.email}</td>
                      <td>{subadmin.password}</td>
                      <td>{subadmin.date}</td>
                       
                      <td>
                        <span
                          className={`badge ${subadmin.status === "active" ? "bg-success" : "bg-danger"
                            }`}
                        >
                          {subadmin.status}
                        </span>
                      </td>

                       <td>
                        <button
                          onClick={() => handleDeleteSubAdmin(subadmin.id, subadmin.email)}
                          className="btn btn-danger btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>

                      <td>
                        <div
                          className={`activeanddeactive btn-${subadmin.status === "active" ? "danger" : "success"}`}
                          onClick={() => handleStatusUpdate(subadmin.id, subadmin.status)}
                        >
                          {subadmin.status === "active" ? "Deactivate" : "Activate"}
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/subadmin-permission/${subadmin.id}`}
                          className="btn btn-info btn-sm"
                        >
                          <FaUserShield /> Permissions
                        </Link>
                      </td>
                    
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No sub-admins found.
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

export default AllSubadminList;