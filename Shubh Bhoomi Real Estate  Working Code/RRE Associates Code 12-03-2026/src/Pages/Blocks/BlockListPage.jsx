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
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
const API_URL = process.env.REACT_APP_API_URL;
const blocksImages = `${process.env.REACT_APP_IMAGE_API_URL}/uploads/block/`;

function BlockListPage() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedimagePath, setSelectedimagePath] = useState(null);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("project_id");
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const imageStyle = {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    transition: "transform 0.3s ease-in-out",
  };

  const hoverStyle = {
    transform: "scale(2)",
    zIndex: 999,
    position: "relative",
  };

  const getAuthToken = () => localStorage.getItem("token");

  const fetchBlocks = async (page = 1, name = "") => {
    setLoading(true);

    try {
      const token = getAuthToken();
      const url = `${API_URL}/block-list?page=${page}&limit=10${projectId ? `&project_id=${projectId}` : ""}`;

      console.log("Final API URL:", url); // ✅ correct place
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("API Response:", data);
      setBlocks(data.data || []);
      setSelectedimagePath(data.imagePath);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks(currentPage, searchName);
  }, [currentPage, searchName]);

  const handlePageChange = (page) => setCurrentPage(page);

  // const handleSearchChange = (e) => {
  //   setSearchName(e.target.value);
  //   setCurrentPage(1);
  // };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedProject(null);
  };

  const handleViewImages = (project) => {
    const images = project.image ? [project.image] : [];
    setImageList(images);
    setCurrentImageIndex(0);
    setShowImagesModal(true);
  };

  const handleRedirectToBlocks = (projectId) => {
    navigate(`/blocklists?project_id=${projectId}`);
  };


  const filteredBlocks = blocks.filter((block) => {
    const search = searchTerm.toLowerCase();
    const statusMatch = statusFilter === "" || block.status === statusFilter;
    const searchMatch =
      block.name?.toLowerCase().includes(search) ||
      block.project_name?.toLowerCase().includes(search); // Optional: block.location
    return statusMatch && searchMatch;
  });


  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="padding_15 px-0">
      <div className="card">

        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>All Block List</h3>
            </div>
            <div className="backbutton">
              <Link to='/all-project'>Back</Link>
            </div>

          </div>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
            <div className="searchproject">
              <input
                type="text"
                placeholder="Search by project name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="searchproject">

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <hr />

          <Row xs={1} md={2} lg={2} className="g-4">
            {filteredBlocks.length > 0 ? (
              filteredBlocks.map((blocks) => {
                let imageUrls = [];
                try {
                  imageUrls = blocks.images ? JSON.parse(blocks.images) : [];
                } catch (e) {
                  imageUrls = [];
                }

                return (
                  <Col xs={12} md={4} lg={3} key={blocks.id}>
                    <div className="card position-realative blocklistbox">
                      <div className="image_card_design">

                        <img src={`${blocksImages}${blocks.image}`} alt="image" />
                        <div className="badgeblock">
                          <Badge
                            bg={blocks.status === "active" ? "custum" : "danger"}
                          >
                            {blocks.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="card-body p-0">
                        <div className="title_block">

                          <h4>Project Name:</h4>
                          <span>  {blocks.project_name?.toUpperCase() || "-"}</span>


                        </div>
                       <div className="form_details_block">
                         <div className="d-flex custum_new">
                          <h4>Block Name:</h4>{" "}
                         <span> {blocks.name?.toUpperCase() || "-"}</span>

                          {/* <strong>ID:</strong> {blocks.id}
                      <br /> */}
                          {/* <strong>Resident Commission:</strong>{" "}
                      {blocks.resident_commission}%<br />
                      <strong>Commercial Commission:</strong>{" "}
                      {blocks.commercial_commission}%<br />
                      <strong>Corner Resident Commission:</strong>{" "}
                      {blocks.corner_resident_commission}%<br />
                      <strong>Corner Commercial Commission:</strong>{" "}
                      {blocks.corner_commercial_commission}%<br />
                      <strong>Size:</strong> {blocks.project_size} sqft
                      <br />
                      <strong>Location:</strong> {blocks.location}
                      <br />
                      <strong>blocks Type:</strong> {blocks.project_type}
                      <br /> */}
                        </div>
                        <div className="d-flex custum_new">
                          <h4>Date:</h4> <span>{blocks.date_time}</span>
                        </div>

                      </div>
                       </div>
                      <div className="card-footer bg-transparent">

                        <div className="d-flex justify-content-around">

                          <button
                            className="samebutton button_image"
                            onClick={() => handleViewImages(blocks)}
                          >
                            View Images
                          </button>

                          <button
                            className="samebutton button_view"
                            onClick={() =>
                              navigate(
                                `/plot-list?project_id=${blocks.project_id}&block_id=${blocks.id}`
                              )
                            }
                          >
                            View Units
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <Col>
                <p className="text-center">No blocks found.</p>
              </Col>
            )}
          </Row>

          <Pagination className="justify-content-end pagination_design">
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



        {/* View Project Details Modal */}
        {/* View Images Modal */}
        <Modal
          show={showImagesModal}
          onHide={() => setShowImagesModal(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Blocks Images</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center p-0">
            {imageList.length > 0 ? (
              <>
                <div
                
                >
                  <img
                    src={`${blocksImages}${imageList[currentImageIndex]}`}
                    alt={`Project ${currentImageIndex + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>

                <div className="gap-2 p-2 d-flex justify-content-end align-items-center">
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      setCurrentImageIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentImageIndex === 0}
                  >
                   <MdArrowBackIos/>
                  </Button>

                  <span className="pagination_all">
                    {currentImageIndex + 1} / {imageList.length}
                  </span>

                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        Math.min(prev + 1, imageList.length - 1)
                      )
                    }
                    disabled={currentImageIndex === imageList.length - 1}
                  >
                     <MdArrowForwardIos/>
                  </Button>
                </div>
              </>
            ) : (
              <p>No images available.</p>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div >

  );
}

export default BlockListPage;
