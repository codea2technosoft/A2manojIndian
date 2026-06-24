import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Pagination,
  Modal,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import youtubelogo from "../../assets/images/youtubelogo.png";
import { Link } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
const API_URL = process.env.REACT_APP_API_URL;
const projectimage = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/project/`;
const amenitiesPath = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/aminities/`;

function AllProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedimagePath, setSelectedimagePath] = useState(null);
  const [aminitiesimagePath, setaminitiesimagePath] = useState(null);
  const [imagePath, setimagepath] = useState(null);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTermName, setSearchTermName] = useState(""); // ✅ correct
  const [searchTermLocation, setSearchTermLocation] = useState("");
  const imageExtensions = /\.(jpe?g|png|gif|webp|bmp|svg)$/i;
  const filteredImages = imageList.filter((file) => imageExtensions.test(file));

  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  useEffect(() => {
    if (currentImageIndex >= filteredImages.length) {
      setCurrentImageIndex(0);
    }
  }, [filteredImages.length]);

  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("token");

  const fetchProjects = async (
    page = 1,
    name = "",
    location = "",
    status = "",
  ) => {
    // setLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/project-list-all?page=${page}&limit=9&name=${searchTermName}&location=${location}&status=${status}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await response.json();
      setProjects(data.data || []);
      setSelectedimagePath(data.imagePath);
      setimagepath(data.imagePath);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchProjects(
  //     currentPage,
  //     searchTermName,
  //     searchTermLocation,
  //     statusFilter
  //   );
  // }, [currentPage, searchTermName, searchTermLocation, statusFilter]);

  useEffect(() => {
    fetchProjects(
      currentPage,
      searchTermName,
      searchTermLocation,
      statusFilter,
    );
  }, [currentPage, searchTermName, searchTermLocation, statusFilter]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleViewProject = async (projectId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/project-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: projectId }),
      });
      const data = await response.json();
      setSelectedProject(data.data);
      setaminitiesimagePath(data.aminitiesimagePath);
      setShowViewModal(true);
    } catch (err) {
      console.error("View error:", err);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedProject(null);
  };

  const handleViewImages = (project) => {
    let images = [];
    try {
      images = project.images ? JSON.parse(project.images) : [];
    } catch (e) {
      images = [];
    }
    setImageList(images);
    setCurrentImageIndex(0);
    setShowImagesModal(true);
  };

  const handleRedirectToBlocks = (projectId) => {
    navigate(`/blocklists?project_id=${projectId}`);
  };

  const handleSearchNameChange = (e) => {
    const value = e.target.value;
    setSearchTermName(value);
    fetchProjects(currentPage, value, searchTermLocation, statusFilter);
  };
  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>All Project List</h3>
            </div>

            <div className="d-flex gap-2 align-items-center">
              <button
                type="button"
                className="toggle-filter-btn btn btn-primary"
                onClick={toggleFilter}
              >
                {showFilter ? <MdFilterAltOff /> : <MdFilterListAlt />}
              </button>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="card-body pb-0">
            <div className="d-flex flex-wrap-mobile align-items-md-center gap-2 mb-2">
              <div className="form-design w-100">
                <input
                  type="text"
                  placeholder="Project name"
                  value={searchTermName}
                  onChange={handleSearchNameChange}
                />
              </div>

              <div className="form-design w-100">
                <input
                  type="text"
                  placeholder="Search by Location"
                  value={searchTermLocation}
                  onChange={(e) => setSearchTermLocation(e.target.value)}
                />
              </div>

              <div className="form-design w-100">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="ongoing">OnGoing</option>
                  <option value="complete">Completed</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="card-body">
          <Row>
            {projects.length > 0 ? (
              projects.map((project) => {
                let imageUrls = [];
                try {
                  imageUrls = project.images ? JSON.parse(project.images) : [];
                } catch (e) {
                  imageUrls = [];
                }
                return (
                  <Col xs={12} md={6} lg={6} xl={4} key={project.id}>
                    <Card className="property_design">
                      <div className="imagedesign position-relative">
                        {imageUrls.length > 0 && (
                          <Card.Img
                            variant="top"
                            src={`${projectimage}${imageUrls[0]}`}
                            style={{ height: "180px", objectFit: "cover" }}
                          />
                        )}

                        <Link
                          to={project.youtube_links}
                          className="youtube_direct"
                        >
                          <div className="image_youtube">
                            <img src={youtubelogo} alt="youtubelogo" />
                          </div>
                        </Link>
                        <div className="badgedesign">
                          <Badge
                            bg={
                              project.project_status === "complete"
                                ? "btn_success"
                                : "btn_warning"
                            }
                          >
                            {project.project_status}
                          </Badge>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="projectname">
                          {project.name?.toUpperCase() || "-"}
                        </div>
                      </div>

                      <Card.Body>
                        <div>
                          <div className="project-details-grid">
                            <div className="detailsproperty">
                              <div className="project_details">
                                <span className="name_title">Location:</span>{" "}
                                <span> {project.location}</span>
                              </div>
                              <div className="project_details">
                                <span className="name_title">City:</span>{" "}
                                <span> {project.city_name}</span>
                              </div>
                              <div className="project_details">
                                <span className="name_title">
                                  Business Volume (%)
                                </span>{" "}
                                <span> {project.bussiness_volume}</span>
                              </div>
                              <div className="project_details">
                                <span className="name_title">
                                  Approve Authortiy
                                </span>{" "}
                                <span> {project.approve_authority}</span>
                              </div>
                              <div className="project_details">
                                <span className="name_title">
                                  Total Township Area
                                </span>
                                <span>
                                  {" "}
                                  {project.total_township_area} Sq. Yard
                                </span>
                              </div>
                              <div className="project_details">
                                <span className="name_title">
                                  Date & Timing:
                                </span>{" "}
                                <span> {project.date_time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between m-2 align-items-center">
                          <button
                            className="samebutton button_view"
                            onClick={() => handleViewProject(project.id)}
                          >
                            View Details
                          </button>

                          <button
                            className="samebutton button_image"
                            onClick={() => handleViewImages(project)}
                          >
                            View Images
                          </button>

                          <button
                            className="samebutton button_block"
                            onClick={() =>
                              navigate(`/blocklists?project_id=${project.id}`)
                            }
                          >
                            Book Unit
                          </button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            ) : (
              <Col>
                <p className="text-center">No projects found.</p>
              </Col>
            )}
          </Row>

          <Pagination className="justify-content-end">
            {/* <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        /> */}
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            {/* <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        /> */}
          </Pagination>
        </div>

        <div className="container">
          <Modal
            show={showViewModal}
            onHide={handleCloseViewModal}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Project Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedProject &&
                (() => {
                  let images = [];
                  try {
                    images = selectedProject.images
                      ? JSON.parse(selectedProject.images)
                      : [];
                  } catch (e) {
                    images = [];
                  }
                  return (
                    <div className="row g-4">
                      {/* Name */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.name}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* RERA No */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">RERA No</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.project_rera_no}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">Location</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.location}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Business Volume */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">
                            Business Volume (Lakh)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.bussiness_volume}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Authority */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">
                            Approval Authority
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.approve_authority}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* State */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">State</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.state}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.city}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Landmark */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">Landmark</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.land_mark}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Township Area */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">
                            Total Township Area (Sq. Yard)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.total_township_area}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Project Status */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">Project Status</label>
                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.project_status}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Launch Date */}
                      <div className="col-md-6 col-12">
                        <div className="custum_all">
                          <label className="form-label">Launch Date</label>

                          <input
                            type="text"
                            className="form-control"
                            value={selectedProject.date}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Map PDF */}
                      {selectedProject.map_pdf && (
                        <div className="col-md-6 col-12">
                          <div className="custum_all">
                            <label className="form-label">Map PDF</label>
                            <div>
                              <a
                                href={`${projectimage}${selectedProject.map_pdf}`}
                                className="btn_all_pdf"
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download Map PDF
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Description */}
                      <div className="col-12">
                        <div className="custum_all">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            value={
                              selectedProject.description
                                ? selectedProject.description.replace(
                                    /<[^>]+>/g,
                                    "",
                                  )
                                : ""
                            }
                            readOnly
                            rows={3}
                          />
                        </div>
                      </div>
                      {/* Thumbnail */}
                      {selectedProject.thumbnail && (
                        <div className="col-md-6 col-12">
                          <div className="custum_all">
                            <label className="form-label">Thumbnail</label>
                            <br />
                            <img
                              src={`${imagePath}${selectedProject.thumbnail}`}
                              alt="Thumbnail"
                              className="img-fluid rounded shadow-sm"
                              style={{ maxWidth: "80px" }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Project Images */}
                      {/* {selectedProject.images && (
                        <div className="col-6">
                          <label className="form-label">Project Images</label>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {JSON.parse(selectedProject.images).map(
                              (img, idx) => (
                                <img
                                  key={idx}
                                  src={`${projectimage}${img}`}
                                  alt={`Image ${idx + 1}`}
                                  className="img-thumbnail"
                                  style={{ width: "80px" }}
                                />
                              )
                            )}
                          </div>
                        </div>
                      )} */}
                      {selectedProject.images && (
                        <div className="col-6">
                          <label className="form-label">Project Images</label>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {JSON.parse(selectedProject.images)
                              .filter(
                                (img) =>
                                  img && !img.toLowerCase().endsWith(".pdf"),
                              ) // ✅ Filter non-PDF
                              .map((img, idx) => (
                                <img
                                  key={idx}
                                  src={`${projectimage}${img}`}
                                  alt={`Image ${idx + 1}`}
                                  className="img-thumbnail"
                                  style={{ width: "80px" }}
                                />
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Key Transport */}
                      {selectedProject.key_transport && (
                        <div className="col-6">
                          <label className="form-label">Key Transport</label>
                          <ul className="transport">
                            {JSON.parse(selectedProject.key_transport).map(
                              (item, idx) => (
                                <li key={idx} className="transportli">
                                  {item.name} - <span>{item.distance}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Amenities */}
                      {selectedProject.aminities && (
                        <div className="col-12">
                          <label className="form-label">Amenities</label>
                          <ul className="amenities">
                            {JSON.parse(selectedProject.aminities).map(
                              (item, idx) => (
                                <li key={idx} className="amenitiesbox">
                                  <div className="amenitiesboximage">
                                    <img
                                      src={`${amenitiesPath}${item.image}`}
                                      alt={item.name}
                                    />
                                  </div>
                                  <span>{item.name}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </Modal.Body>
          </Modal>

          {/* View Images Modal */}
          <Modal
            show={showImagesModal}
            onHide={() => setShowImagesModal(false)}
            centered
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Project Images</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              {imageList.length > 0 ? (
                <>
                  {/* <div className="view_image_all">
                    <img
                      src={`${selectedimagePath}${imageList[currentImageIndex]}`}
                      alt={`Project ${currentImageIndex + 1}`}
                    />
                  </div> */}

                  <div className="view_image_all">
                    {imageList[currentImageIndex] &&
                      /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(
                        imageList[currentImageIndex],
                      ) && (
                        <img
                          src={`${selectedimagePath}${imageList[currentImageIndex]}`}
                          alt={`Project ${currentImageIndex + 1}`}
                        />
                      )}
                  </div>

                  {/* <div className="gap-2 mt-2 d-flex justify-content-end align-items-center">
                    <Button
                      variant="outline-primary"
                      onClick={() =>
                        setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentImageIndex === 0}
                    >
                      <MdArrowBackIos />
                    </Button>
                    <p className="pagination_all">
                      {currentImageIndex + 1} / {imageList.length}
                    </p>

                    <Button
                      variant="outline-primary"
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          Math.min(prev + 1, imageList.length - 1)
                        )
                      }
                      disabled={currentImageIndex === imageList.length - 1}
                    >
                      <MdArrowForwardIos />
                    </Button>
                  </div> */}

                  <div className="gap-2 mt-2 d-flex justify-content-end align-items-center">
                    <Button
                      variant="outline-primary"
                      onClick={() =>
                        setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentImageIndex === 0}
                    >
                      <MdArrowBackIos />
                    </Button>

                    {/* ✅ Image count display (optional) */}
                    <p className="mb-0">
                      {filteredImages.length > 0
                        ? `${currentImageIndex + 1} / ${filteredImages.length}`
                        : "0 / 0"}
                    </p>

                    <Button
                      variant="outline-primary"
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          Math.min(prev + 1, filteredImages.length - 1),
                        )
                      }
                      disabled={currentImageIndex === filteredImages.length - 1}
                    >
                      <MdArrowForwardIos />
                    </Button>
                  </div>
                </>
              ) : (
                <p>No images available.</p>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AllProjectList;
