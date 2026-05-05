import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPlus, FaUserShield, FaDownload } from "react-icons/fa";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi2";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";


const API_URL = process.env.REACT_APP_API_URL;
function CreateProjectCategoryList() {
  const [subadmins, setSubadmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const fetchSubadmins = async (page = 1, category_name = "") => {
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }
      const response = await fetch(
        `${API_URL}/created-project-category-lists?page=${page}&limit=10&email=${category_name}`,
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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Now",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28a745",  // Green for Delete
      cancelButtonColor: "#dc3545",   // Red for Cancel

    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        setError(null);

        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error("Authentication token not found.");
          }

          const response = await fetch(`${API_URL}/project-category-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Delete failed");
          }
          Swal.fire("Deleted!", "Category deleted successfully.", "success");
          fetchSubadmins(currentPage, searchEmail);
        } catch (err) {
          console.error("Delete error:", err);
          setError(err.message);
          Swal.fire("Error", err.message, "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };


  const handleEditSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`${API_URL}/project-category-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editData.id,
          category_name: editData.category_name,
          commission: editData.commission,
          salary: editData.salary || 0,
          is_salary_applicable: editData.is_salary_applicable,
          salary_months: editData.salary_months || 0,
          status: editData.status || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }

      Swal.fire("Success", "Category updated successfully!", "success");
      setShowEditModal(false);
      fetchSubadmins(currentPage, searchEmail);
    } catch (err) {
      console.error("Edit error:", err);
      setError(err.message);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const downloadCSV = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(
        `${API_URL}/created-project-category-lists?page=1&limit=10000&email=${searchEmail}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data for CSV download.");
      }

      const data = await response.json();
      const categories = data.data || [];

      if (categories.length === 0) {
        Swal.fire("No Data", "No project categories found to download.", "info");
        return;
      }

      const headers = ["Category ID", "Category Name", "Salary", "Salary Months", "Commission (%)", "Commission Type", "Is Salary Applicable", "Status", "Date"];

      const rows = categories.map((category) => [
        category.id ?? "",
        category.category_name ?? "",
        category.salary ?? 0,        // Fix: 0 show karega, blank nahi
        category.salary_months ?? 0,  // Fix: 0 show karega, blank nahi

        category.commission ?? 0,
        category.commission_type ?? "",

        category.is_salary_applicable == 1 ? "Yes" : "No",
        category.status ?? "",
        new Date(category.created_at).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => {
          if (cell === undefined || cell === null) return '""';
          return `"${String(cell).replace(/"/g, '""')}"`;
        }).join(","))
        .join("\n");

      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute("download", `project_categories_${new Date().toISOString().slice(0, 19)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      Swal.fire("Success", "CSV file downloaded successfully!", "success");
    } catch (err) {
      console.error("CSV download error:", err);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
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
              <h3>All Created Project Category Lists</h3>
            </div>
            <div className="d-flex gap-2">
              <div>
                <button
                  className="btn btn-success d-inline-flex align-items-center"
                  onClick={downloadCSV}
                >
                  <FaDownload className="me-2" /> Export
                </button> &nbsp;&nbsp;
                <Link to="/create-project-category" className="btn btn-success d-inline-flex align-items-center">
                  <FaPlus className="me-2" /> Add
                </Link>
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
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover shadow-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th>S.N</th>
                  <th>Categories Name</th>

                  <th>Salaries</th>
                  <th>Salary Months</th>


                  <th>Commissions</th>
                  <th>Commission Type</th>

                  <th>Is Salary Applicable</th>
                  <th>Status</th>
                  <th>Date & Timing</th>
                  <th>Actions</th>

                </tr>
              </thead>
              <tbody>
                {subadmins.length > 0 ? (
                  subadmins.map((subadmin, index) => (
                    <tr key={subadmin.id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>
                          {subadmin.category_name?.charAt(0).toUpperCase() + subadmin.category_name?.slice(1).toLowerCase()}
                        </strong>
                      </td>
                      <td className="text-danger"><strong>{Number(subadmin.salary).toFixed(2)}</strong></td>
                      <td className="text-danger"><strong>{subadmin.salary_months}</strong></td>


                      <td className="text-success">  <strong>{Number(subadmin.commission).toFixed(2)}</strong></td>
                      <td className="text-success">
                        <strong>
                          {subadmin.commission_type?.charAt(0).toUpperCase() + subadmin.commission_type?.slice(1).toLowerCase()}
                        </strong>
                      </td>

                      <td>
                        {subadmin.is_salary_applicable === 1 ? (
                          <span className="text-success fw-bold">Yes</span>
                        ) : (
                          <span className="text-danger fw-bold">No</span>
                        )}</td>
                      <td>
                        <span
                          className={`badge ${subadmin.status === "active" ? "bg-success" : "bg-danger"}`}
                        >
                          {subadmin.status}
                        </span>
                      </td>

                      <td>
                        {(() => {
                          const date = new Date(subadmin.created_at);
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const year = date.getFullYear();
                          let hours = date.getHours();
                          const minutes = String(date.getMinutes()).padStart(2, '0');
                          const seconds = String(date.getSeconds()).padStart(2, '0');
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          hours = hours % 12;
                          hours = hours ? hours : 12;
                          const formattedHours = String(hours).padStart(2, '0');

                          return `${day}-${month}-${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
                        })()}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(subadmin.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setEditData(subadmin);
                              setShowEditModal(true);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Created Project Category Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {showEditModal && (
            <div className="modal d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Category</h5>
                    <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                  </div>

                  <div className="modal-body">
                    Category Name
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Category Name Like : Luxury Villas"
                      value={editData?.category_name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, category_name: e.target.value })
                      }
                    />

                    Commission (%)
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Commission in % Like 1.0"
                      value={editData?.commission || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, commission: e.target.value })
                      }
                    />

                    {/* Salary Applicable */}
                    <label>Salary Applicable</label>
                    <select
                      className="form-control mb-2"
                      value={editData?.is_salary_applicable || 0}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          is_salary_applicable: Number(e.target.value),
                        })
                      }
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>

                    {/* Salary */}
                    {editData?.is_salary_applicable === 1 && (
                      <>
                        Salary
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Salary Like 50000"
                          value={editData?.salary || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, salary: e.target.value })
                          }
                        />

                        {/* Salary Months */}
                        Salary Months
                        <input
                          type="number"
                          className="form-control mb-2"
                          placeholder="Like : 1"
                          value={editData?.salary_months || ""}
                          onChange={(e) =>
                            setEditData({ ...editData, salary_months: e.target.value })
                          }
                        />
                      </>
                    )}

                    {/* Status */}
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={editData?.status || "active"}
                      onChange={(e) =>
                        setEditData({ ...editData, status: e.target.value })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-danger" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button className="btn btn-success" onClick={handleEditSubmit}>
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


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

export default CreateProjectCategoryList;