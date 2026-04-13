import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://realestateapi.a2logicgroup.com/adminapi";
const IMAGE_API_URL =
  process.env.REACT_APP_Image_URL || "https://realestateapi.a2logicgroup.com/";

function Aminities() {
  const [aminities, setAminities] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const fetchAminities = async (page = currentPage, limit = itemsPerPage) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        alert(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/aminities-list?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch amenities");
      }
      const data = await response.json();

      if (data && data.data) {
        setAminities(data.data);
        setTotalItems(data.total || data.count || data.data.length);
        setTotalPages(
          data.totalPages ||
            Math.ceil((data.total || data.data.length) / limit),
        );
        setCurrentPage(data.currentPage || page);
      } else {
        setAminities([]);
        setTotalItems(0);
        setTotalPages(0);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = getAuthToken();
    const formPayload = new FormData();
    formPayload.append("name", formData.name);

    if (formData.image) {
      formPayload.append("image", formData.image);
    }

    let url;
    if (formData.id) {
      url = `${API_URL}/aminities-update`;
      formPayload.append("id", formData.id);
    } else {
      url = `${API_URL}/aminities-create`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save amenity");
      }

      const result = await response.json();

      if (result.success == "1") {
        Swal.fire({
          title: "Success!",
          text: formData.id
            ? "Amenity updated successfully!"
            : "Amenity created successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        setFormData({ id: null, name: "", image: null });
        fetchAminities(1);
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = getAuthToken();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/aminities-delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete amenity");
      }

      const result = await response.json();
      if (result.status == "1") {
        Swal.fire({
          title: "Deleted!",
          text: "Amenity has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });

        if (aminities.length === 1 && currentPage > 1) {
          fetchAminities(currentPage - 1);
        } else {
          fetchAminities(currentPage);
        }
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (amenity) => {
    setFormData({
      id: amenity.id,
      name: amenity.name,
      image: null,
    });
  };

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchAminities(pageNumber, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    fetchAminities(1, newLimit);
  };

  useEffect(() => {
    fetchAminities();
  }, []);

  return (
    <div className="mt-2">
      <div className="card mb-4">
        <div className="card-header">
          <div className="titlepage">
            <h3>{formData.id ? "Edit Amenity" : "Create New Amenity"}</h3>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2 flex-wrap-mobile">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="w-100">
              <label htmlFor="amenityName" className="form-label">
                Amenity Name
              </label>
              <input
                type="text"
                className="form-control"
                id="amenityName"
                value={formData.name}
                placeholder="Create New Amenity"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="w-100">
              <label htmlFor="amenityImage" className="form-label">
                Amenity Image
              </label>
              <input
                type="file"
                className="form-control"
                id="amenityImage"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                required={!formData.id}
              />
            </div>
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary mt-md-4"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : formData.id
                    ? "Update Amenity"
                    : "Create Amenity"}
              </button>
            </div>
            {formData.id && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setFormData({ id: null, name: "", image: null })}
                disabled={loading}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>List of Amenities</span>
        </div>
        <div className="card-body">
          {loading && <p>Loading amenities...</p>}
          {!loading && error && <p className="text-danger">{error}</p>}
          {!loading && aminities.length === 0 && <p>No amenities found.</p>}
          {!loading && aminities.length > 0 && (
            <>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aminities.map((amenity, index) => (
                      <tr key={amenity.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          {amenity.image && (
                            <img
                              src={`${IMAGE_API_URL}/aminities/${amenity.image}`}
                              alt={amenity.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </td>
                        <td>{amenity.name}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(amenity)}
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(amenity.id)}
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Amenities pagination">
                  <ul className="pagination justify-content-end mt-4">
                    {/* Previous Page */}
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        &laquo;
                      </button>
                    </li>

                    {/* Always show first page */}
                    <li
                      className={`page-item ${currentPage === 1 ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => paginate(1)}>
                        1
                      </button>
                    </li>

                    {/* Show ellipsis if current page is far from start */}
                    {currentPage > 4 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}

                    {/* Show pages around current page */}
                    {Array.from(
                      { length: Math.min(5, totalPages - 2) },
                      (_, i) => {
                        let pageNumber;
                        if (currentPage <= 3) {
                          pageNumber = i + 2;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 5 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        if (pageNumber > 1 && pageNumber < totalPages) {
                          return (
                            <li
                              key={pageNumber}
                              className={`page-item ${pageNumber === currentPage ? "active" : ""}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => paginate(pageNumber)}
                              >
                                {pageNumber}
                              </button>
                            </li>
                          );
                        }
                        return null;
                      },
                    )}

                    {/* Show ellipsis if current page is far from end */}
                    {currentPage < totalPages - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}

                    {/* Always show last page if there's more than 1 page */}
                    {totalPages > 1 && (
                      <li
                        className={`page-item ${currentPage === totalPages ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </li>
                    )}

                    {/* Next Page */}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>

                  <div className="text-end mt-2">
                    <small className="text-muted">
                      Page {currentPage} of {totalPages} • {totalItems} total
                      items
                    </small>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Aminities;
