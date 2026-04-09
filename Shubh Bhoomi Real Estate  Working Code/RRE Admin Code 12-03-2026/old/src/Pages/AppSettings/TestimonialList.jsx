import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaVideo, FaPlay, FaStar, FaUser } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col } from "react-bootstrap";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsThreeDots, BsYoutube, BsCameraVideo } from "react-icons/bs";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function TestimonialList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoThumbnails, setVideoThumbnails] = useState({});
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    degination: "",
    rating: "",
    description: "",
    image: null,
    current_image_url: "",
    vedioclips_reels: null,
    current_video_url: "",
  });

  const editImageInputRef = useRef(null);
  const editVideoInputRef = useRef(null);

  const [showMessageModal, setShowMessageModal] = useState(false);
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

  // Function to generate video thumbnail
  const generateVideoThumbnail = (videoUrl, videoId) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Capture frame at 1 second
        
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const thumbnailUrl = canvas.toDataURL('image/jpeg');
          resolve(thumbnailUrl);
        };
      };
      
      video.onerror = () => {
        resolve(null);
      };
    });
  };

  // Generate thumbnails for all videos
  useEffect(() => {
    if (testimonials.length > 0) {
      testimonials.forEach((testimonial) => {
        if (testimonial.vedioclips_reels && !videoThumbnails[testimonial.id]) {
          const videoUrl = `${imageAPIURL}/testimonial/${testimonial.vedioclips_reels}`;
          generateVideoThumbnail(videoUrl, testimonial.id).then(thumbnail => {
            if (thumbnail) {
              setVideoThumbnails(prev => ({
                ...prev,
                [testimonial.id]: thumbnail
              }));
            }
          });
        }
      });
    }
  }, [testimonials]);

  const fetchTestimonials = async (page = 1, query = "") => {
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      const url = new URL(`${API_URL}/testimonial-list`);
      url.searchParams.append("page", page);
      url.searchParams.append("limit", 10);
      if (query) {
        url.searchParams.append("name", query);
      }

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
        throw new Error(errorData.message || "Failed to fetch testimonials.");
      }

      const data = await response.json();
      setTestimonials(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Fetch testimonials error:", err);
      setError(err.message);
      if (!showMessageModal) {
        showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching testimonials.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleViewTestimonial = async (testimonialId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      const response = await fetch(`${API_URL}/testimonial-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: testimonialId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch testimonial details.");
      }

      const data = await response.json();
      setSelectedTestimonial(data.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("View testimonial error:", err);
      setError(err.message);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching testimonial details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShowVideoModal(true);
  };

  const handleEditTestimonial = async (testimonialId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      const response = await fetch(`${API_URL}/testimonial-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: testimonialId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch testimonial for editing.");
      }

      const data = await response.json();
      const testimonialData = data.data;
      setSelectedTestimonial(testimonialData);
      setEditFormData({
        id: testimonialData.id || "",
        name: testimonialData.name || "",
        degination: testimonialData.degination || "",
        rating: testimonialData.rating || "",
        description: testimonialData.description || "",
        image: null,
        current_image_url: testimonialData.image || "",
        vedioclips_reels: null,
        current_video_url: testimonialData.vedioclips_reels || "",
      });
      setShowEditModal(true);
    } catch (err) {
      console.error("Edit testimonial error:", err);
      setError(err.message);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching testimonial for editing.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditDescriptionChange = (event) => {
    const { value } = event.target;
    setEditFormData((prevData) => ({
      ...prevData,
      description: value,
    }));
  };

  const handleEditImageChange = (e) => {
    setEditFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleEditVideoChange = (e) => {
    setEditFormData((prevData) => ({
      ...prevData,
      vedioclips_reels: e.target.files[0],
    }));
  };

  const handleUpdateTestimonial = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      const data = new FormData();
      data.append("id", editFormData.id);
      data.append("name", editFormData.name);
      data.append("degination", editFormData.degination);
      data.append("rating", editFormData.rating);
      data.append("description", editFormData.description);
      if (editFormData.image) {
        data.append("image", editFormData.image);
      }
      if (editFormData.vedioclips_reels) {
        data.append("vedioclips_reels", editFormData.vedioclips_reels);
      }

      const response = await fetch(`${API_URL}/testimonial-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update testimonial.");
      }

      const result = await response.json();
      if (result.success == '1') {
        showCustomMessageModal("Success", "Testimonial updated successfully!", "success");
        setShowEditModal(false);
        fetchTestimonials(currentPage, searchQuery);
      }
      else {
        showCustomMessageModal("Error", result.message || "Something went wrong", "error");
      }

    } catch (err) {
      console.error("Update testimonial error:", err);
      setError(err.message);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred while updating testimonial.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    showCustomMessageModal(
      "Confirm Deletion",
      "Are you sure you want to delete this testimonial? This action cannot be undone.",
      "warning",
      async () => {
        setLoading(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
            return;
          }

          const response = await fetch(`${API_URL}/testimonial-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: testimonialId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete testimonial.");
          }

          showCustomMessageModal("Success", "Testimonial deleted successfully!", "success");
          fetchTestimonials(currentPage, searchQuery);
        } catch (err) {
          console.error("Delete testimonial error:", err);
          setError(err.message);
          showCustomMessageModal("Error", err.message || "An unexpected error occurred while deleting testimonial.", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedTestimonial(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedTestimonial(null);
    setEditFormData({
      id: "",
      name: "",
      degination: "",
      rating: "",
      description: "",
      image: null,
      current_image_url: "",
      vedioclips_reels: null,
      current_video_url: "",
    });
    if (editImageInputRef.current) {
      editImageInputRef.current.value = "";
    }
    if (editVideoInputRef.current) {
      editVideoInputRef.current.value = "";
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  // Function to determine video type
  const getVideoType = (filename) => {
    if (!filename) return 'Video';
    const ext = filename.split('.').pop().toLowerCase();
    
    if (filename.includes('reel') || filename.includes('reels')) {
      return 'Reel';
    } else if (filename.includes('clip') || filename.includes('clips')) {
      return 'Clip';
    } else if (ext === 'mp4' || ext === 'mov' || ext === 'avi') {
      return 'Video';
    }
    return 'Media';
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? '#FFD700' : '#ddd',
            fontSize: '18px',
            marginRight: '2px'
          }}
        >
          ★
        </span>
      );
    }
    return stars;
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
        <button className="btn btn-primary ms-3" onClick={() => fetchTestimonials()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="padding_15 userlist">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Testimonial List</h3>
            </div>
            <div className="d-flex gap-2">
              <div className="d-none d-md-block">
                <Form.Group controlId="searchTestimonial">
                  <Form.Control
                    className="w-100"
                    type="text"
                    placeholder="Search by Name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </Form.Group>
              </div>
              
              <Link to="/testimonial" className="btn btn-success d-flex align-items-center">
                <FaPlus className="me-2" /> Add Testimonial
              </Link>
              
              <div className="d-block d-md-none">
                <div className="d-flex gap-2">
                  <button
                    className={`filter-toggle-btn btn btn-primary ${isFilterActive ? "active" : ""}`}
                    onClick={handleToggle}
                  >
                    {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              <Form.Group className="w-100" controlId="searchTestimonial">
                <Form.Control
                  className="w-100"
                  type="text"
                  placeholder="Name or Designation..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </Form.Group>
            </div>
          )}
          
          <div className="table-responsive">
            <Table className="">
              <thead className="bg-primary text-white">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Rating</th>
                  <th>Image</th>
                  <th>Video/Reel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials?.length > 0 ? (
                  testimonials.map((testimonial, i) => (
                    <tr key={testimonial.id}>
                      <td>{i + 1}</td>
                      <td>{testimonial.name}</td>
                      <td>{testimonial.degination}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {renderStars(testimonial.rating)}
                          <span className="ms-2 fw-bold">({testimonial.rating})</span>
                        </div>
                      </td>
                      <td>
                        {testimonial.image ? (
                          <img
                            src={`${imageAPIURL}/testimonial/${testimonial.image}`}
                            alt={testimonial.name}
                            className="img-thumbnail"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/50x50/cccccc/000000?text=No+Image"; }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {testimonial.vedioclips_reels ? (
                          <div className="video-preview-container">
                            {/* YouTube-like video thumbnail */}
                            <div 
                              className="video-thumbnail-wrapper position-relative cursor-pointer"
                              onClick={() => handlePlayVideo(`${imageAPIURL}/testimonial/${testimonial.vedioclips_reels}`)}
                              style={{ 
                                width: "150px", 
                                height: "90px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundColor: "#000",
                                position: "relative"
                              }}
                            >
                              {/* Video thumbnail */}
                              {videoThumbnails[testimonial.id] ? (
                                <img
                                  src={videoThumbnails[testimonial.id]}
                                  alt="Video thumbnail"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                  }}
                                />
                              ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center h-100" style={{ backgroundColor: "#1a1a1a" }}>
                                  <BsYoutube size={30} color="#FF0000" />
                                  <div className="text-white small mt-1">{getVideoType(testimonial.vedioclips_reels)}</div>
                                </div>
                              )}
                              
                              {/* YouTube-like play button */}
                              <div className="position-absolute top-50 start-50 translate-middle">
                                <div className="play-button-circle" style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  backgroundColor: "rgba(255, 0, 0, 0.8)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                  transition: "all 0.3s",
                                  border: "3px solid white"
                                }}>
                                  <FaPlay color="white" />
                                </div>
                              </div>
                              
                              {/* Video duration badge (if available) */}
                              <div className="position-absolute bottom-0 end-0 m-1">
                                <span className="badge bg-dark" style={{ fontSize: "10px", opacity: 0.8 }}>
                                  {getVideoType(testimonial.vedioclips_reels)}
                                </span>
                              </div>
                            </div>
                            
                            {/* Video info */}
                            <div className="mt-1">
                              <small className="text-muted d-block">
                                {testimonial.vedioclips_reels}
                              </small>
                              <Button
                                variant="outline-info"
                                size="sm"
                                className="mt-1"
                                onClick={() => handlePlayVideo(`${imageAPIURL}/testimonial/${testimonial.vedioclips_reels}`)}
                              >
                                <FaVideo className="me-1" /> Play
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted">
                            <span className="badge bg-secondary">No Video</span>
                          </div>
                        )}
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
                                onClick={() => handleViewTestimonial(testimonial.id)}
                                title="View Testimonial Details"
                              >
                                <FaEye /> View
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm"
                                title="Edit Testimonial"
                                onClick={() => handleEditTestimonial(testimonial.id)}
                              >
                                <FaEdit /> Edit
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                              >
                                <RiDeleteBin5Fill /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No testimonials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
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

      {/* View Testimonial Modal - YouTube Style */}
     {/* View Testimonial Modal - YouTube Style */}
<Modal size="lg" show={showViewModal} onHide={handleCloseViewModal} centered>
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title>
      <FaEye className="me-2" />
      Testimonial Details
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedTestimonial && (
      <div className="row">
        <div className="col-md-7">
          {/* Basic Information Card */}
          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Basic Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold text-primary">
                    <FaUser className="me-1" /> Name
                  </label>
                  <div className="form-control bg-light">{selectedTestimonial.name}</div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold text-primary">Designation</label>
                  <div className="form-control bg-light">{selectedTestimonial.degination}</div>
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold text-primary">
                    <FaStar className="me-1" /> Rating
                  </label>
                  <div className="form-control bg-light">
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        {renderStars(selectedTestimonial.rating)}
                      </div>
                      <span className="fw-bold text-warning">{selectedTestimonial.rating} / 5</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-bold text-primary">Description</label>
                  <div
                    className="form-control bg-light"
                    style={{ 
                      minHeight: '150px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      padding: '10px'
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedTestimonial.description }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          {/* Media Section */}
          <div className="card mb-3 border-0 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Media</h5>
            </div>
            <div className="card-body">
              {/* Image Section - Updated to show like in listing */}
              {selectedTestimonial.image ? (
                <div className="mb-4">
                  <label className="form-label fw-bold text-primary d-block mb-2">
                    <FaEye className="me-1" /> Profile Image
                  </label>
                  <div className="text-center">
                    <div className="position-relative d-inline-block">
                      <img
                        src={`${imageAPIURL}/testimonial/${selectedTestimonial.image}`}
                        alt={selectedTestimonial.name}
                        className="img-thumbnail"
                        style={{ 
                          width: "150px", 
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #007bff",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/150x150/cccccc/000000?text=No+Image";
                        }}
                      />
                    </div>
                    {/* <div className="mt-2">
                      <small className="text-muted">
                        File: {selectedTestimonial.image}
                      </small>
                    </div> */}
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="form-label fw-bold text-primary d-block mb-2">
                    <FaEye className="me-1" /> Profile Image
                  </label>
                  <div className="text-center p-4 border rounded bg-light">
                    <div className="mb-3">
                      <img
                        src="https://placehold.co/100x100/cccccc/000000?text=No+Image"
                        alt="No Image"
                        className="img-thumbnail"
                        style={{ 
                          width: "100px", 
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                      />
                    </div>
                    <p className="text-muted mb-0">No image available</p>
                    <small className="text-muted">Click Edit to add an image</small>
                  </div>
                </div>
              )}

              {/* Video/Reel Section - YouTube Style */}
              {selectedTestimonial.vedioclips_reels ? (
                <div className="mb-3">
                  <label className="form-label fw-bold text-primary d-block mb-2">
                    <FaVideo className="me-1" /> Video / Reel
                  </label>
                  
                  {/* Video Type Badge */}
                  <div className="mb-2">
                    <span className={`badge ${getVideoType(selectedTestimonial.vedioclips_reels) === 'Reel' ? 'bg-danger' : 
                      getVideoType(selectedTestimonial.vedioclips_reels) === 'Clip' ? 'bg-warning text-dark' : 'bg-info'}`}>
                      {getVideoType(selectedTestimonial.vedioclips_reels)}
                    </span>
                  </div>
                  
                  {/* YouTube Style Video Player */}
                  <div 
                    className="youtube-video-player position-relative cursor-pointer"
                    onClick={() => handlePlayVideo(`${imageAPIURL}/testimonial/${selectedTestimonial.vedioclips_reels}`)}
                    style={{
                      backgroundColor: "#000",
                      borderRadius: "12px",
                      overflow: "hidden",
                      position: "relative",
                      height: "200px",
                      marginBottom: "15px"
                    }}
                  >
                    {/* Video Thumbnail */}
                    {videoThumbnails[selectedTestimonial.id] ? (
                      <img
                        src={videoThumbnails[selectedTestimonial.id]}
                        alt="Video Thumbnail"
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover",
                          opacity: 0.8
                        }}
                      />
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center h-100"
                        style={{ backgroundColor: "#0f0f0f" }}>
                        <div className="youtube-icon" style={{
                          width: "80px",
                          height: "80px",
                          backgroundColor: "#FF0000",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: "10px"
                        }}>
                          <FaPlay size={30} color="white" />
                        </div>
                        <div className="text-white" style={{ fontSize: "1.1rem" }}>
                          {getVideoType(selectedTestimonial.vedioclips_reels)}
                        </div>
                        <small className="text-muted mt-1">
                          Click to play
                        </small>
                      </div>
                    )}
                    
                    {/* YouTube Style Play Button */}
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <div className="youtube-play-button" style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 0, 0, 0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "4px solid white",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}>
                        <FaPlay size={25} color="white" />
                      </div>
                    </div>
                    
                    {/* Video Info Overlay */}
                    <div className="position-absolute bottom-0 start-0 w-100 p-3"
                      style={{
                        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                        color: "white"
                      }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{selectedTestimonial.name}</h6>
                          <small>{getVideoType(selectedTestimonial.vedioclips_reels)}</small>
                        </div>
                        <div className="text-end">
                          <small className="text-white-50">
                            {selectedTestimonial.vedioclips_reels.split('.').pop().toUpperCase()}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Details */}
                  <div className="video-details p-2 bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <strong className="text-dark">File:</strong>
                        <span className="ms-2 text-muted">{selectedTestimonial.vedioclips_reels}</span>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handlePlayVideo(`${imageAPIURL}/testimonial/${selectedTestimonial.vedioclips_reels}`)}
                      >
                        <FaPlay className="me-1" /> Play Now
                      </Button>
                    </div>
                    
                    {/* Video Info Grid */}
                    <div className="row small">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-1">
                          <span className="text-muted me-2">Type:</span>
                          <span className="fw-bold">{getVideoType(selectedTestimonial.vedioclips_reels)}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center mb-1">
                          <span className="text-muted me-2">Format:</span>
                          <span className="fw-bold">
                            {selectedTestimonial.vedioclips_reels.split('.').pop().toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="d-grid gap-2 mt-3">
                    <Button
                      variant="outline-danger"
                      className="d-flex align-items-center justify-content-center"
                      onClick={() => handlePlayVideo(`${imageAPIURL}/testimonial/${selectedTestimonial.vedioclips_reels}`)}
                    >
                      <FaVideo className="me-2" />
                      Watch {getVideoType(selectedTestimonial.vedioclips_reels).toLowerCase()}
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        // Download video
                        const link = document.createElement('a');
                        link.href = `${imageAPIURL}/testimonial/${selectedTestimonial.vedioclips_reels}`;
                        link.download = selectedTestimonial.vedioclips_reels;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download Video
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-3">
                  <label className="form-label fw-bold text-primary d-block mb-2">
                    <FaVideo className="me-1" /> Video / Reel
                  </label>
                  <div className="text-center p-4 border rounded bg-light">
                    <div className="mb-3">
                      <BsCameraVideo size={40} className="text-muted" />
                    </div>
                    <p className="text-muted mb-0">No video or reel available</p>
                    <small className="text-muted">Click Edit to add a video</small>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          {/* <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Quick Info</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6 mb-3">
                  <div className="p-2 border rounded bg-white">
                    <div className={`fw-bold ${selectedTestimonial.image ? 'text-success' : 'text-danger'}`}>
                      {selectedTestimonial.image ? '✓ Available' : '✗ Not Available'}
                    </div>
                    <small className="text-muted">Image</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="p-2 border rounded bg-white">
                    <div className={`fw-bold ${selectedTestimonial.vedioclips_reels ? 'text-success' : 'text-danger'}`}>
                      {selectedTestimonial.vedioclips_reels ? '✓ Available' : '✗ Not Available'}
                    </div>
                    <small className="text-muted">Video</small>
                  </div>
                </div>
                <div className="col-12">
                  <small className="text-muted">
                    Testimonial ID: #{selectedTestimonial.id}
                  </small>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer className="bg-light">
    <div className="d-flex justify-content-between w-100">
      <Button variant="danger" onClick={handleCloseViewModal}>
        Close
      </Button>
      <div className="d-flex gap-2">
        {selectedTestimonial?.vedioclips_reels && (
          <Button 
            variant="danger"
            onClick={() => handlePlayVideo(`${imageAPIURL}/testimonial/${selectedTestimonial.vedioclips_reels}`)}
          >
            <FaPlay className="me-2" /> Play Video
          </Button>
        )}
        <Button 
          variant="primary"
          onClick={() => {
            handleCloseViewModal();
            handleEditTestimonial(selectedTestimonial.id);
          }}
        >
          <FaEdit className="me-2" /> Edit
        </Button>
      </div>
    </div>
  </Modal.Footer>
</Modal>

      {/* Edit Testimonial Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Testimonial</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateTestimonial}>
            <Form.Group className="mb-3" controlId="editTestimonialName">
              <Form.Label>Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="editTestimonialDesignation">
              <Form.Label>Designation <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="degination"
                value={editFormData.degination}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="editTestimonialRating">
              <Form.Label>Rating (1-5) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={editFormData.rating}
                onChange={handleEditFormChange}
                min="1"
                max="5"
                step="1"
                required
              />
            </Form.Group>
            
            {/* Image Field */}
            <Form.Group className="mb-3" controlId="editTestimonialImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditImageChange}
                ref={editImageInputRef}
              />
              {editFormData.current_image_url && (
                <div className="mt-2">
                  <small className="text-muted">Current Image:</small>
                  <img
                    src={`${imageAPIURL}/testimonial/${editFormData.current_image_url}`}
                    alt="Current Testimonial"
                    className="img-thumbnail ms-2"
                    style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/cccccc/000000?text=No+Image"; }}
                  />
                </div>
              )}
              <Form.Text className="text-muted">
                Leave blank to keep current image. Max size: 5MB
              </Form.Text>
            </Form.Group>
            
            {/* Video Clips/Reels Field */}
            <Form.Group className="mb-3" controlId="editTestimonialVideo">
              <Form.Label>Video Clips / Reels (Optional)</Form.Label>
              <Form.Control
                type="file"
                name="vedioclips_reels"
                accept="video/*"
                onChange={handleEditVideoChange}
                ref={editVideoInputRef}
              />
              {editFormData.current_video_url && (
                <div className="mt-2">
                  <small className="text-muted">Current Video/Reel:</small>
                  <div 
                    className="mt-2 cursor-pointer"
                    onClick={() => handlePlayVideo(`${imageAPIURL}/testimonial/${editFormData.current_video_url}`)}
                    style={{
                      backgroundColor: "#000",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center"
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <BsYoutube color="#FF0000" size={24} />
                      <span className="text-white">{getVideoType(editFormData.current_video_url)}</span>
                    </div>
                    <Button
                      variant="outline-light"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayVideo(`${imageAPIURL}/testimonial/${editFormData.current_video_url}`);
                      }}
                    >
                      <FaVideo className="me-1" /> Preview
                    </Button>
                  </div>
                </div>
              )}
              <Form.Text className="text-muted">
                Leave blank to keep current video. Max size: 100MB. Supported: MP4, MOV, AVI, WMV, FLV
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="editTestimonialDescription">
              <Form.Label>Description <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                placeholder="Enter description"
                value={editFormData.description}
                onChange={handleEditDescriptionChange}
                required
              />
            </Form.Group>
            
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                "Update Testimonial"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* YouTube-style Video Player Modal */}
      <Modal size="lg" show={showVideoModal} onHide={handleCloseVideoModal} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>
            <BsYoutube className="me-2 text-danger" />
            Video Player
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-dark">
          {selectedVideo && (
            <div className="youtube-player-container">
              <div className="video-wrapper">
                <video
                  controls
                  autoPlay
                  style={{ width: "100%", height: "auto", maxHeight: "500px" }}
                  onError={(e) => {
                    console.error("Video loading error:", e);
                    showCustomMessageModal("Error", "Failed to load video. Please check the file URL.", "error");
                  }}
                >
                  <source src={selectedVideo} type="video/mp4" />
                  <source src={selectedVideo} type="video/mov" />
                  <source src={selectedVideo} type="video/avi" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-3 bg-dark text-white">
                <h6 className="mb-2">Now Playing:</h6>
                <p className="small text-muted mb-0">{selectedVideo.split('/').pop()}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="outline-light" onClick={handleCloseVideoModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Message Modal */}
      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${messageModalContent.type === 'success' ? 'border-success' : messageModalContent.type === 'error' ? '' : ''}`}>
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className={`modal-title ${messageModalContent.type === 'success' ? 'text-success' : messageModalContent.type === 'error' ? 'text-danger' : 'text-warning'}`}>
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
                    <Button
                      variant="secondary"
                      onClick={closeCustomMessageModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={messageModalContent.type === 'warning' ? 'warning' : 'primary'}
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
                    variant={messageModalContent.type === 'success' ? 'success' : messageModalContent.type === 'error' ? 'danger' : 'primary'}
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
      
      {/* Add CSS for YouTube-like styling */}
      <style>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .video-thumbnail-wrapper:hover .play-button-circle {
          transform: scale(1.1);
          background-color: rgba(255, 0, 0, 1);
        }
        
        .youtube-video-player:hover .youtube-play-button {
          transform: scale(1.1);
          background-color: #FF0000;
          box-shadow: 0 6px 25px rgba(255, 0, 0, 0.4);
        }
        
        .play-button-circle, .youtube-play-button {
          transition: all 0.3s ease;
        }
        
        .video-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
        }
        
        .video-wrapper video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .youtube-player-container {
          background: #000;
        }
        
        .star-rating .star.filled {
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .youtube-modal .modal-content {
          border-radius: 12px;
          overflow: hidden;
          border: none;
        }
        
        .youtube-logo {
          font-family: 'Roboto', sans-serif;
          font-weight: bold;
          letter-spacing: -0.5px;
        }
        
        .bg-gradient-dark {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
    </div>
  );
}

export default TestimonialList;