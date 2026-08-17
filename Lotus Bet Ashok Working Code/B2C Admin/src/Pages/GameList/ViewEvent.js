import { Link, useParams, useLocation } from "react-router-dom"; // ✅ useLocation add karo
import React, { useState, useEffect } from "react";
import { MdFilterListAlt } from "react-icons/md";
import axios from "axios";
import Toast from "../../User/Toast";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import {
  getAllEvents,
  toggleEventStatus,
  getExternalEvents,
  importMarket,
} from "../../Server/api";

function ViewEvent() {
  const [filter, setFilter] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [importingMarket, setImportingMarket] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get("sportId");
  const seriesId = searchParams.get("seriesId");
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const limit = 50;
  // Fetch games from API
  const fetchEvents = async (
    page = pagination.page,
    limit = pagination.limit,
  ) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...filters,
      };
      // const response = await getAllEvents(sportId, seriesId, params);
      const response = await getExternalEvents(sportId, seriesId, params);
      console.log("getexternalEvent", response);
      if (response.data.success) {
        setEvents(response.data.data || []);

        // const apiEvents = response.data.data || [];

        // const filteredEvents = apiEvents.filter(
        //   (ev) => String(ev.series_id) === String(seriesId)
        // );

        // setEvents(filteredEvents);

        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            page: response.data.pagination.page,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages,
          }));
        }
        setError("");
      } else {
        setError(response.data.message);
        showToast(response.data.message, "error");
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
      showToast("Network error: Failed to fetch games", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleImportMarket = async (eventId) => {
    try {
      setImportingMarket(eventId);

      const response = await importMarket(sportId, eventId);
      showToast(
        response.data.message,
        response.data.success ? "success" : "error",
      );
    } catch (err) {
      showToast(err.response?.data?.message || "Server error", "error");
    } finally {
      setImportingMarket(null);
    }
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchEvents(1, pagination.limit);
    setFilter(false);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      search: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchEvents(1, pagination.limit);
    setFilter(false);
  };

  const handleRefresh = () => {
    // Reset filters
    setFilters({
      status: "",
      search: "",
    });
    // Reset to page 1
    setPagination((prev) => ({ ...prev, page: 1 }));
    // Fetch data
    fetchEvents(1, pagination.limit);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchEvents(newPage, pagination.limit);
  };
  useEffect(() => {
    if (sportId && seriesId) {
      fetchEvents(pagination.page, pagination.limit);
    }
  }, [sportId, seriesId, pagination.page]);

  // Toast helpers
  const showToast = (message, type = "success") =>
    setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: "", type: "" });

  // useEffect(() => {
  //   fetchEvents();
  // }, [sportId, seriesId]); // ✅ sportId ya seriesId change pe phir se fetch hoga

  const toggleEventStatusHandler = async (eventId, currentStatus) => {
    try {
      setUpdating(eventId);
      const response = await toggleEventStatus(eventId); // ✅ direct API function call

      if (response.data.success) {
        setEvents((prev) =>
          prev.map((ev) =>
            ev._id === eventId
              ? { ...ev, status: currentStatus === 1 ? 0 : 1 }
              : ev,
          ),
        );
        const newStatus = currentStatus === 1 ? "deactivated" : "activated";
        showToast(`Event ${newStatus} successfully`, "success");
      } else {
        showToast(response.data.message);
      }
    } catch (err) {
      console.error("Error toggling event status:", err);
      // showToast("Network error: Failed to update status", 'error');
    } finally {
      setUpdating(null);
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    const isActive = status === 1;
    return (
      <span
        className={`fw-bold ${isActive ? "text-success" : "text-danger"} me-2`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };
  //   const handleView = (game) => { // ✅ Pure game object pass karein
  //   navigate(`/view_event/${game._id}?sportId=${game.sport_id}&seriesId=${game.series_id}`);
  // };

  // ToggleSwitch component
  const ToggleSwitch = ({ gameId, status, disabled }) => {
    const isActive = status === 1;
    return (
      <div className="form-check form-switch d-flex align-items-center gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isActive}
          onChange={() => toggleEventStatusHandler(gameId, status)}
          disabled={disabled}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />
        {/* <label className="form-check-label small fw-bold mb-0">
          {isActive ? 'Active' : 'Inactive'}
        </label> */}
      </div>
    );
  };

  // Loading state
  if (loading)
    return (
      <div className="text-center mt-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading games...</p>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="text-center mt-3 text-danger">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchEvents}>
          Retry
        </button>
      </div>
    );

  return (
    <section>
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      <div className="allcommon">
        <div className="py-3 gap-2 flex-wrap-mobile d-flex justify-content-between align-items-center">
          <h3 className="page-title">All Event List</h3>
          <div className="d-flex gap-2">
            {/* <button className="btn btn-info me-2" onClick={handleRefresh}>Refresh</button> */}
            <button
              className="btn btn-dark"
              onClick={() => window.history.back()}
            >
              Back
            </button>
            <button
              className="btn btn-light theme_dark_btn"
              onClick={() => setFilter((prev) => !prev)}
            >
              <MdFilterListAlt /> Filter
            </button>
          </div>
        </div>
        {filter && (
          <div className="card-body border-bottom pb-3">
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="">All Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search matches..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>
              <div className="col-md-2 d-flex align-items-end gap-2">
                <button className="btn btn-primary" onClick={applyFilters}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Sr</th>
                <th>Teams Name</th>
                <th>Date&Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((events, index) => (
                  <tr key={events._id}>
                    <td>
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td>
                      <strong>{events.name}</strong>
                    </td>
                    <td>
                      {" "}
                      <strong>{events.date_time}</strong>
                    </td>
                    <td>{getStatusBadge(events.status)}</td>
                    <td className="d-flex align-items-center gap-2">
                      {/* <button className="btn btn-import">Import Market</button> */}
                      <button
                        className="importbutton"
                        onClick={() => handleImportMarket(events.event_id)}
                        disabled={importingMarket === events.event_id}
                      >
                        {importingMarket === events.event_id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Importing...
                          </>
                        ) : (
                          "Import Market"
                        )}
                      </button>
                      <ToggleSwitch
                        gameId={events._id || events.id || events.event_id}
                        status={events.status}
                        disabled={
                          updating ===
                          (events._id || events.id || events.event_id)
                        }
                      />
                      {updating === events._id && (
                        <div
                          className="spinner-border spinner-border-sm text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                      {/* <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleView(game)}
                    >
                      <FaEye />
                    </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No games found
                    <br />
                    <button className="refreshbuttonall" onClick={fetchEvents}>
                      Refresh
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-md-center mt-4 flex-wrap gap-2">
              <div className="showingallentries">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, totalRecords)} of {totalRecords}{" "}
                entries
              </div>

              <div className="paginationall d-flex align-items-center gap-1">
                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={currentPage === 1}
                  onClick={handlePrev}
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>

                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
                  <MdOutlineKeyboardArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ViewEvent;
