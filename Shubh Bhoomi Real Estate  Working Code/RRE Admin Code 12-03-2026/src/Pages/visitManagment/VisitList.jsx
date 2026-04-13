import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaEye } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Row,
  Col,
  Container,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;
const imageAPIURL = process.env.REACT_APP_Image_URL;

function VisitList() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const searchTimeoutRef = useRef(null);

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };
  const fetchVisits = async (
    page = 1,
    name = "",
    status = "",
    fromDate = "",
    toDate = "",
  ) => {
    // setLoading(true);
    const token = getAuthToken();
    try {
      const response = await axios.get(
        `${API_URL}/visite-list?page=${page}&limit=10&name=${name}&status=${status}&fromdate=${fromDate}&todate=${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const result = response.data;
      if (result.success === "1") {
        setVisits(result.data);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.currentPage || page);
      }
    } catch (err) {
      setError("Failed to fetch visit list.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitDetails = async (id) => {
    setLoading(true);
    const token = getAuthToken();
    try {
      const response = await axios.get(`${API_URL}/visite-view`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedVisit(response.data.data);
      setShowDetailModal(true);
    } catch (err) {
      setError("Failed to fetch visit details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits(currentPage, searchName, searchStatus);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewDetails = (id) => {
    fetchVisitDetails(id);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedVisit(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchVisits(1, value, searchStatus);
    }, 500);
  };

  const handleSearchChangeLocation = (e) => {
    const value = e.target.value;
    setSearchStatus(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchVisits(1, searchName, value);
    }, 500);
  };

  if (loading && !selectedVisit) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <>
      <div className="card mt-2">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Visit List</h5>

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

        {isFilterActive && (
          <div className="card-body pb-0">
            <div className="d-flex gap-2 flex-wrap-mobile align-items-center">
              <div className="form-group w-100" id="searchName">
                <input
                  type="text"
                  placeholder="Name"
                  value={searchName}
                  onChange={handleSearchChange}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100" id="searchStatus">
                <Form.Group className="text-dark" controlId="selectStatus">
                  <Form.Select
                    value={searchStatus}
                    className="text-dark"
                    onChange={handleSearchChangeLocation}
                  >
                    <option value="">All</option>
                    <option value="start">Start</option>
                    <option value="end">End</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="form-group w-100">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group w-100">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  setCurrentPage(1);
                  fetchVisits(1, searchName, searchStatus, fromDate, toDate);
                }}
              >
                Filter
              </Button>
            </div>
          </div>
        )}

        <div className="card-body">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Project Name</th>
                <th>Name</th>
                <th>Start Time</th>
                <th>Start Address</th>
                <th>End Time</th>
                <th>End Address</th>
                <th>Distance(KM)</th>
                <th>Per KM Amount</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visits.length === 0 && visits.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center text-danger fw-bold">
                    Sorry, no data found!
                  </td>
                </tr>
              ) : visits.length > 0 ? (
                visits.map((visit, index) => (
                  <tr key={visit.id}>
                    {/* Serial Number */}
                    <td>{(currentPage - 1) * 10 + index + 1}</td>

                    {/* Project & User */}
                    <td>{visit.project_name || "-"}</td>
                    <td>{visit.user_name || "-"}</td>

                    {/* Start Time */}
                    <td>
                      {visit.start_time
                        ? new Date(visit.start_time).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })
                        : "-"}
                    </td>

                    {/* Start Address */}
                    <td>{visit.start_address || "-"}</td>

                    {/* End Time */}
                    <td>
                      {visit.end_time
                        ? new Date(visit.end_time).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })
                        : "-"}
                    </td>

                    {/* End Address */}
                    <td>{visit.end_address || "-"}</td>

                    {/* Distance */}
                    <td>
                      {Number.isFinite(Number(visit.distance))
                        ? (Number(visit.distance) / 1000).toFixed(2) + " km"
                        : "—"}
                    </td>

                    {/* Per Kilometer Amount */}
                    <td>
                      &#8377;{" "}
                      {Number(visit.per_kilometer_amount || 0).toLocaleString(
                        "en-IN",
                        { minimumFractionDigits: 2 },
                      )}
                    </td>

                    {/* Total Amount */}
                    <td>
                      &#8377;{" "}
                      {Number(visit.amount || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    {/* Status */}
                    <td
                      style={{
                        color:
                          visit.status === "end"
                            ? "green"
                            : visit.status === "start"
                              ? "red"
                              : "inherit",
                      }}
                    >
                      {visit.status ? visit.status.toUpperCase() : "-"}
                    </td>

                    {/* Action Button */}
                    <td>
                      <Button
                        variant="info"
                        className="me-2"
                        onClick={() => handleViewDetails(visit.id)}
                      >
                        <FaEye />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center">
                    No visits found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {/* Always show first page */}
              <Pagination.Item
                active={1 === currentPage}
                onClick={() => handlePageChange(1)}
              >
                1
              </Pagination.Item>

              {/* Show ellipsis if there are pages before current page beyond page 2 */}
              {currentPage > 3 && <Pagination.Ellipsis />}

              {/* Show pages around current page */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show page if it's within 1 of current page (except page 1 which is always shown)
                if (
                  pageNumber > 1 &&
                  pageNumber < totalPages &&
                  Math.abs(pageNumber - currentPage) <= 1
                ) {
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                }
                return null;
              })}

              {/* Show ellipsis if there are pages after current page before last page */}
              {currentPage < totalPages - 2 && <Pagination.Ellipsis />}

              {/* Always show last page if there's more than 1 page */}
              {totalPages > 1 && (
                <Pagination.Item
                  active={totalPages === currentPage}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Pagination.Item>
              )}

              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      </div>

      <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">Visit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && !selectedVisit ? (
            <div className="d-flex justify-content-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            selectedVisit && (
              <div className="row">
                {/* Left Column - Basic Info */}
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">
                        Visit By : [{selectedVisit.user_name}]
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Name
                        </label>
                        <div className="fw-bold">{selectedVisit.user_name}</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Visit Purpose
                        </label>
                        <div className="fw-bold table-cell-remark">
                          {selectedVisit.visit_purpose
                            ? selectedVisit.visit_purpose
                                .charAt(0)
                                .toUpperCase() +
                              selectedVisit.visit_purpose.slice(1).toLowerCase()
                            : ""}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Status
                        </label>
                        <div>
                          <span
                            className={`badge fs-5 p-2 ${selectedVisit.status === "end" ? "bg-success" : "bg-danger"}`}
                          >
                            {selectedVisit.status}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Vehicle Type
                        </label>
                        <div className="fw-bold">
                          {selectedVisit.vehicle_type
                            ? selectedVisit.vehicle_type
                                .charAt(0)
                                .toUpperCase() +
                              selectedVisit.vehicle_type.slice(1).toLowerCase()
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">Visitor Details</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Visitor Name
                        </label>
                        <div className="fw-bold">
                          {selectedVisit.name
                            ? selectedVisit.name.charAt(0).toUpperCase() +
                              selectedVisit.name.slice(1).toLowerCase()
                            : ""}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Visitor Mobile
                        </label>
                        <div className="fw-bold">{selectedVisit.mobile}</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Investment Budget
                        </label>
                        <div className="fw-bold">
                          {selectedVisit.investment_budget !== undefined &&
                          selectedVisit.investment_budget !== null
                            ? Number(selectedVisit.investment_budget).toFixed(2)
                            : "0.00"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">Financial Details</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Per KM Amount (₹)
                        </label>
                        <div className="fw-bold">
                          ₹{selectedVisit.per_kilometer_amount}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Distance (Meter)
                        </label>
                        <div className="fw-bold">{selectedVisit.distance}</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Duration (Minutes)
                        </label>
                        <div className="fw-bold">
                          {Math.floor(selectedVisit.duration / 60)} min{" "}
                          {selectedVisit.duration % 60} sec
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Total Amount (₹)
                        </label>
                        <div className="fw-bold h5 text-primary">
                          ₹{selectedVisit.amount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">Start Details</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Date Time
                        </label>
                        <div className="fw-bold">
                          {new Date(selectedVisit.start_time).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Address
                        </label>
                        <div className="fw-bold">
                          {selectedVisit.start_address}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Visitor Image
                        </label>
                        <div style={{ position: "relative" }}>
                          <img
                            src={`${imageAPIURL}/visitImage/${selectedVisit.start_image}`}
                            alt="Start Location"
                            className="img-thumbnail"
                            style={{
                              width: "100%",
                              maxWidth: "100%",
                              cursor: "zoom-in",
                              borderRadius: "8px",
                              transition: "transform 0.3s ease",
                            }}
                            onClick={() => {
                              const zoomDiv = document.createElement("div");
                              zoomDiv.style.position = "fixed";
                              zoomDiv.style.top = "0";
                              zoomDiv.style.left = "0";
                              zoomDiv.style.width = "100vw";
                              zoomDiv.style.height = "100vh";
                              zoomDiv.style.background = "rgba(0, 0, 0, 0.95)";
                              zoomDiv.style.display = "flex";
                              zoomDiv.style.justifyContent = "center";
                              zoomDiv.style.alignItems = "center";
                              zoomDiv.style.zIndex = "9999";
                              zoomDiv.style.cursor = "zoom-out";
                              zoomDiv.style.overflow = "hidden";

                              const zoomedImg = document.createElement("img");
                              zoomedImg.src = `${imageAPIURL}/visitImage/${selectedVisit.start_image}`;
                              zoomedImg.style.width = "100%";
                              zoomedImg.style.height = "100%";
                              zoomedImg.style.objectFit = "contain"; // ✅ Image fit karega bina dabaye
                              zoomedImg.style.borderRadius = "0";
                              zoomedImg.style.transition =
                                "transform 0.3s ease";
                              zoomedImg.style.userSelect = "none";

                              zoomDiv.appendChild(zoomedImg);
                              document.body.appendChild(zoomDiv);

                              zoomDiv.onclick = () =>
                                document.body.removeChild(zoomDiv);
                            }}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Start Latitude
                        </label>
                        <div className="fw-bold">{selectedVisit.start_lat}</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Start longitude
                        </label>
                        <div className="fw-bold">
                          {selectedVisit.start_long}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card h-100">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0">End Details</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Date Time
                        </label>
                        <div className="fw-bold">
                          {new Date(selectedVisit.end_time).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Address
                        </label>
                        <div className="fw-bold">
                          {selectedVisit.end_address}
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Visit By Image
                        </label>
                        <div style={{ position: "relative" }}>
                          <img
                            src={`${imageAPIURL}/visitImage/${selectedVisit.end_image}`}
                            alt="End Location"
                            className="img-thumbnail"
                            style={{
                              width: "100%",
                              maxWidth: "100%",
                              cursor: "zoom-in",
                              borderRadius: "8px",
                              transition: "transform 0.3s ease",
                            }}
                            onClick={() => {
                              const zoomDiv = document.createElement("div");
                              zoomDiv.style.position = "fixed";
                              zoomDiv.style.top = "0";
                              zoomDiv.style.left = "0";
                              zoomDiv.style.width = "100vw";
                              zoomDiv.style.height = "100vh";
                              zoomDiv.style.background = "rgba(0, 0, 0, 0.95)";
                              zoomDiv.style.display = "flex";
                              zoomDiv.style.justifyContent = "center";
                              zoomDiv.style.alignItems = "center";
                              zoomDiv.style.zIndex = "9999";
                              zoomDiv.style.cursor = "zoom-out";
                              zoomDiv.style.overflow = "hidden";

                              const zoomedImg = document.createElement("img");
                              zoomedImg.src = `${imageAPIURL}/visitImage/${selectedVisit.end_image}`;
                              zoomedImg.style.width = "100%";
                              zoomedImg.style.height = "100%";
                              zoomedImg.style.objectFit = "contain"; // ✅ maintains image ratio
                              zoomedImg.style.borderRadius = "0";
                              zoomedImg.style.transition =
                                "transform 0.3s ease";
                              zoomedImg.style.userSelect = "none";

                              zoomDiv.appendChild(zoomedImg);
                              document.body.appendChild(zoomDiv);

                              zoomDiv.onclick = () =>
                                document.body.removeChild(zoomDiv);
                            }}
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          End Latitude
                        </label>
                        <div className="fw-bold">{selectedVisit.end_lat}</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          End longitude
                        </label>
                        <div className="fw-bold">{selectedVisit.end_long}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button
            variant="danger"
            onClick={handleCloseDetailModal}
            style={{ fontWeight: "bold", letterSpacing: "0.5px" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VisitList;
