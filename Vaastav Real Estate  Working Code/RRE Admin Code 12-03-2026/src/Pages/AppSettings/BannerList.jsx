import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Form, Button, Table, Pagination, Container, Row, Col, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import { MdAirplanemodeInactive, MdAirplanemodeActive, MdOutlineUpcoming, MdUpcoming } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function BannerList() {

  const [banners, setBanners] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedBanner, setSelectedBanner] = useState(null);

  const [selectedimagePath, setSelectedimagePath] = useState(null);

  const [editFormData, setEditFormData] = useState({
    id: "",
    image: null,
    status: "active",
  });

  const imageInputRef = useRef(null);


  const getAuthToken = () => {
    return localStorage.getItem("token");
  };


  const fetchBanners = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(
        `${API_URL}/banner-list?page=${page}&limit=10`,
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
        throw new Error(errorData.message || "Failed to fetch banners.");
      }

      const data = await response.json();

      setBanners(data.data || []);
      setSelectedimagePath(data.imagePath);
      setTotalPages(data.data.totalPages || 1);
      setCurrentPage(page);

    } catch (err) {
      console.error("Fetch banners error:", err);
      setError(err.message);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBanners(currentPage);
  }, [currentPage]);


  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };


  const handleEditBanner = async (bannerId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const response = await fetch(`${API_URL}/banner-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: bannerId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch banner for editing.");
      }

      const data = await response.json();
      const bannerData = data.data;
      setSelectedBanner(bannerData);
      setEditFormData({
        id: bannerData.id,
        image: null,
        status: bannerData.status || "active",
      });
      setShowEditModal(true);


    } catch (err) {
      console.error("Edit banner error:", err);
      setError(err.message);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };


  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setEditFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setEditFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("id", editFormData.id);
      formDataToSend.append("status", editFormData.status);
      if (editFormData.image) {
        formDataToSend.append("image", editFormData.image);
      }

      const response = await fetch(`${API_URL}/banner-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,

        },
        body: formDataToSend,
      });



      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update banner.");
      }
      const result = await response.json()
      if (result.success == '1') {
        Swal.fire("Success", "Banner has been successfully updated.", "success");
        setShowEditModal(false);
        fetchBanners(currentPage);
      }
    } catch (err) {
      console.error("Update banner error:", err);
      setError(err.message);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };


  const handleStatusUpdate = async (bannerId, currentStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the status to ${currentStatus === "active" ? "inactive" : "active"
        }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Change",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#28a745", // Green
      cancelButtonColor: "#dc3545",  // Red
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
          const response = await fetch(`${API_URL}/banner-status-update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              id: bannerId,
              status: newStatus,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update banner status.");
          }

          Swal.fire("Success", "Banner status updated successfully!", "success");
          fetchBanners(currentPage);
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


  const handleDeleteBanner = async (bannerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        setError(null);
        try {
          const token = getAuthToken();
          if (!token) {
            throw new Error("Authentication token not found. Please log in.");
          }

          const response = await fetch(`${API_URL}/banner-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: bannerId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete banner.");
          }

          Swal.fire("Deleted!", "The banner has been deleted.", "success");
          fetchBanners(currentPage);
        } catch (err) {
          console.error("Delete banner error:", err);
          setError(err.message);
          Swal.fire("Error", err.message, "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };


  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedBanner(null);
    setEditFormData({
      id: "",
      image: null,
      status: "active",
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
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
        <button className="btn btn-primary ms-3" onClick={() => fetchBanners()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="card mt-2">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>All Banners</h3>
            </div>
            <div className="d-flex">
              <Link to="/banner" className="btn btn-success d-inline-flex align-items-center">
                <FaPlus className="me-2" /> Add New Banner
              </Link>
            </div>
          </div>
        </div>
        <div className="card-body">

          <div className="table-responsive">
            <Table bordered >
              <thead className="bg-primary text-white">
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.length > 0 ? (
                  banners.map((banner, i) => (
                    <tr key={banner.id}>
                      <td>{i + 1}</td>
                      <td>
                        {banner.image ? (
                          <img
                            src={`${imageAPIURL}/banner/${banner.image}`}
                            alt={`Banner ${banner.id}`}
                            style={{ width: "100px", height: "auto", borderRadius: "5px" }}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x50/cccccc/333333?text=No+Image"; }}
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${banner.status === "active" ? "bg-success" : "bg-danger"
                            }`}
                        >
                          {banner.status}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn light btn-action dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <BsThreeDots size={20} />
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">

                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm"
                                title="View Project Details"
                                onClick={() => handleEditBanner(banner.id)}
                              >
                                <FaEdit /> Edit
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleStatusUpdate(banner.id, banner.status)}
                              >
                                {banner.status === "active" ? <MdAirplanemodeInactive /> : <MdAirplanemodeActive />}

                                {banner.status === "active" ? "Deactivate" : "Activate"}
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm"
                                onClick={() => handleDeleteBanner(banner.id)}
                                title="View Project Details"
                              >
                                <RiDeleteBin5Fill /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>



                        {/* <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm edit_btn"
                            onClick={() => handleEditBanner(banner.id)}
                          >
                            <FaEdit />
                          </button>
                          <Button
                            variant={banner.status === "active" ? "danger" : "success"}
                            size="sm"
                            className=""
                            onClick={() => handleStatusUpdate(banner.id, banner.status)}
                          >
                            {banner.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                          <button
                            className="btn btn-sm delete_btn"
                            onClick={() => handleDeleteBanner(banner.id)}
                          >
                            <RiDeleteBin5Fill />
                          </button>
                        </div> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No banners found.
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





      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateBanner}>
            <Form.Group className="mb-3" controlId="editBannerImage">
              <Form.Label>Banner Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditFormChange}
                ref={imageInputRef}
              />
              {selectedBanner && selectedBanner.image && (
                <div className="mt-2">
                  <small className="text-muted">Current Image:</small>
                  <img
                    src={`${imageAPIURL}/banner/${selectedBanner.image}`}
                    alt="Current Banner"
                    className="img-thumbnail ms-2"
                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x50/cccccc/333333?text=No+Image"; }}
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-4" controlId="editBannerStatus">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={editFormData.status}
                onChange={handleEditFormChange}
                required
              >
                <option value="">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "Updating..." : "Update Banner"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BannerList;