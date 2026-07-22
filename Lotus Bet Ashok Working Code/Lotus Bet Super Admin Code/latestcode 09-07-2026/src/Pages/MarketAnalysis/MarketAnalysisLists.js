import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner, Form, Button } from "react-bootstrap";
import { getMarketAnalysis } from "../../Server/api";

const MarketAnalysisLists = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  const fetchMarketAnalysis = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await getMarketAnalysis({
        page,
        limit,
        search: searchTerm,
        from_date: fromDate,
        to_date: toDate,
      });

      const response = res.data;
      if (response.success) {
        setEvents(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        setCurrentPage(response.pagination?.current_page || 1);
        setTotalRecords(response.pagination?.total_records || 0);
      } else {
        toast.error(response.message || "Failed to fetch market data");
      }
    } catch (error) {
      console.error("Error fetching market analysis:", error);
      toast.error("Failed to fetch market analysis data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketAnalysis(currentPage);
  }, [currentPage, searchTerm, fromDate, toDate]);

  const handleEventClick = (eventId) => {
    navigate(`/event/detail/${eventId}`);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMarketAnalysis(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header bg-white d-flex justify-content-between align-items-md-center gap-2">
          <h5 className="card-title mb-0">Market Analysis</h5>
          <div className="d-flex align-items-center">
            {/* <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-light"
            >
              ⬅ Back
            </button> */}
          </div>
        </div>

        <div className="card-body">
          {/* फिल्टर सेक्शन */}
          {/* <div className="row mb-3 align-items-center gy-2">
            <div className="col-md-3">
              <Form.Control
                type="text"
                placeholder="🔍 Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-md-1">
              <Button onClick={handleSearch}>
                <FiSearch />
              </Button>
            </div>
            <div className="col-md-1">
              <Button variant="secondary" onClick={handleClearSearch}>
                Clear
              </Button>
            </div>
          </div> */}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p> Loading...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-5">
              <h5>No Data To Display</h5>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Event Name</th>
                      <th>Country</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event, index) => (
                      <tr
                        key={event.id || event._id}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEventClick(event.id || event._id)}
                      >
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>
                          <strong>{event.name || event.event_name}</strong>
                        </td>
                        <td>{event.country || event.team || "-"}</td>
                        <td>{event.date_time || event.created_at || "-"}</td>
                        <td>
                          <span
                            className={`badge ${event.status === 1 ? "bg-success" : "bg-danger"}`}
                          >
                            {event.status === 1 ? "✅ Active" : "❌ Inactive"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event.id || event._id);
                            }}
                          >
                            👁️ View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 0 && (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <div className="paginationall d-flex align-items-center gap-1">
                    <button disabled={currentPage === 1} onClick={handlePrev}>
                      <MdKeyboardDoubleArrowLeft /> Previous
                    </button>

                    <div className="d-flex gap-1">
                      {getPageNumbers().map((page) => (
                        <div
                          key={page}
                          className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                          onClick={() => handlePageClick(page)}
                        >
                          {page}
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={handleNext}
                    >
                      Next <MdKeyboardDoubleArrowRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MarketAnalysisLists;
