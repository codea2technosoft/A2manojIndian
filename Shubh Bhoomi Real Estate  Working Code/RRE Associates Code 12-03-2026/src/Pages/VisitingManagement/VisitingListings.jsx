import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { Table, Pagination } from "react-bootstrap";
import { MdFilterListAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function VisitingListings() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState({ status: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // For pagination chunk/window size
  const pageLimit = 10;

  const showCustomMessageModal = (title, text, type) => {
    alert(`${title}: ${text}`); // Simple alert for errors (replace as needed)
  };

  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      if (window.innerWidth >= 1199) {
        setIsDesktop(true);
        setShowFilter(true); // always show filter in desktop
      } else {
        setIsDesktop(false);
        setShowFilter(false); // hide filter in mobile initially
      }
    };

    // Run on mount
    handleResize();

    // Listen to resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchVisits = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        status: searchTerm.status,
      }).toString();

      const response = await fetch(`${API_URL}/visite-list?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      setVisits(result.data || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.page || 1);
    } catch (error) {
      showCustomMessageModal("Error", "Failed to fetch visits.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchVisits(pageNumber);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVisits(1);
  };

  // Pagination chunk/window calculation
  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
    return new Array(Math.min(pageLimit, totalPages - start))
      .fill()
      .map((_, idx) => start + idx + 1);
  };

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3 className="mb-0">Visiting Lists</h3>
            </div>

            {!isDesktop && (
              <div className="d-md-block d-lg-block d-xl-none d-block d-sm-block">
                <button
                  type="button"
                  className="toggle-filter-btn"
                  onClick={toggleFilter}
                >
                  {showFilter ? <MdFilterAltOff /> : <MdFilterListAlt />}
                </button>
              </div>
            )}
            <div className="d-md-none d-lg-none d-xl-block d-none d-sm-none">
              <form
                onSubmit={handleSearch}
                className="d-flex gap-2 align-items-center form_design"
              >
                <input
                  type="text"
                  name="status"
                  placeholder="Search By Status"
                  value={searchTerm.status}
                  onChange={(e) =>
                    setSearchTerm({
                      ...searchTerm,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="text-white"
                />
                <button type="submit" className="submit_button">
                  Search
                </button>
              </form>
            </div>
          </div>

          {showFilter && (
            <div className="d-lg-block d-xl-none">
              <div className="card-body pb-0">
                <form
                  onSubmit={handleSearch}
                  className="d-flex gap-2 align-items-center form_design"
                >
                  <div className="form_design w-100">
                    <input
                      type="text"
                      name="status"
                      placeholder="Search By Status"
                      value={searchTerm.status}
                      onChange={(e) =>
                        setSearchTerm({
                          ...searchTerm,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="text-white"
                    />
                  </div>
                  <button type="submit" className="submit_button">
                    Search
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="card-body">
            {loading ? (
              <p>Loading visits...</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Project Name</th>
                      <th>User Name</th>
                      <th>Vehicle Type</th>
                      <th>Total Duration</th>
                      <th>Total Distance</th>
                      <th>Total Amount</th>
                      <th>Visit Purpose</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.length === 0 ? (
                      <tr>
                        <td
                          colSpan="10"
                          className="text-center text-danger fw-bold"
                        >
                          Sorry, no data found!
                        </td>
                      </tr>
                    ) : (
                      visits.map((visit, index) => (
                        <tr key={visit.id}>
                          <td>{(currentPage - 1) * pageLimit + index + 1}</td>
                          <td>{toSentenceCase(visit.project_name)}</td>
                          <td>{toSentenceCase(visit.user_name)}</td>
                          <td>{toSentenceCase(visit.vehicle_type)}</td>
                          <td>
                            {/* {parseFloat(visit.duration/60 || 0).toFixed(2)} (Minutes) */}
                            {Math.floor(visit.duration / 60)} min{" "}
                            {visit.duration % 60} sec
                          </td>
                          {/* <td>
                            {parseFloat(visit.distance || 0).toFixed(2)} (Meter)
                          </td> */}
                          <td>
                            {(() => {
                              const m = Number(visit.distance);
                              return Number.isFinite(m)
                                ? (m / 1000).toFixed(2) + " (KM) "
                                : "—";
                            })()}
                          </td>
                          <td>₹ {parseFloat(visit.amount || 0).toFixed(2)}</td>
                          <td>
                            <div>{toSentenceCase(visit.visit_purpose)}</div>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                visit.status?.toLowerCase() === "start"
                                  ? "bg-danger"
                                  : visit.status?.toLowerCase() === "end"
                                    ? "backgroundgreen"
                                    : "bg-secondary"
                              }`}
                            >
                              {toSentenceCase(visit.status)}
                            </span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn light btn-action dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <BsThreeDots size={20} />
                              </button>
                              <ul className="dropdown-menu">
                                <li className="dropdown-item">
                                  <button
                                    className="btn view_btn btn-sm"
                                    title="View Details"
                                    onClick={() =>
                                      navigate(`/visitings-details/${visit.id}`)
                                    }
                                  >
                                    <FaEye /> View
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                {visits.length > 0 && (
                  <div className="d-flex justify-content-end">
                    <Pagination className="justify-content-center">
                      {/* Prev button */}
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />

                      {/* Page numbers chunked */}
                      {getPaginationGroup().map((item, index) => (
                        <Pagination.Item
                          key={index}
                          active={item === currentPage}
                          onClick={() => handlePageChange(item)}
                        >
                          {item}
                        </Pagination.Item>
                      ))}

                      {/* Next button */}
                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitingListings;
