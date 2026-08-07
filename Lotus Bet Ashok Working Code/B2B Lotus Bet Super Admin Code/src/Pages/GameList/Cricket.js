import React, { useState, useEffect, useRef } from "react";

import {
  MdFilterListAlt,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import Toast from "../../User/Toast";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

import {
  refreshMatches,
  importEvent,
  getAllMatches,
  toggleMatchStatus,
  deleteMatch,
} from "../../Server/Tennis.service";
import {
  FaEye,
  FaTrashAlt,
  FaDownload,
  FaSpinner,
  FaList,
  FaSearch,
  FaUnlock,
  FaLock,
} from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import Loader from "../../Common/Loader";
function Cricketlist() {
  const actionRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const sport_id = id;
  console.log("Sport ID:", sport_id);

  const [filter, setFilter] = useState(false);
  const [gameName, setGameName] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [importing, setImporting] = useState(null);

  const [showMatchesModal, setShowMatchesModal] = useState(false);
  const [seriesMatches, setSeriesMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const fetchGames = async (
    page = pagination.page,
    limit = pagination.limit,
  ) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sport_id: sport_id,
        ...filters,
      };
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === undefined) {
          delete params[key];
        }
      });
      const response = await getAllMatches(params);
      if (response.data.success) {
        setGames(response.data.data || []);
        setGameName(response.data.game_name || "");
        setPagination((prev) => ({
          ...prev,
          page: response.data.pagination.page,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        }));
        setError("");
      } else {
        setError(response.data.message);
        showToast(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
      showToast("Network error: Failed to fetch games", "error");
    } finally {
      setLoading(false);
    }
  };
  const getSeriesMatches = async (seriesId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://apileo.leobook.in/get-matches?series_id=${seriesId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response;
    } catch (error) {
      console.error("Error fetching series matches:", error);
      throw error;
    }
  };
  const fetchSeriesMatches = async (seriesId, seriesName) => {
    try {
      setLoadingMatches(true);
      setSelectedSeries({ id: seriesId, name: seriesName });
      const response = await getSeriesMatches(seriesId);
      if (response.data && Array.isArray(response.data)) {
        setSeriesMatches(response.data);
        setShowMatchesModal(true);
      } else if (response.data.success) {
        setSeriesMatches(response.data.data || []);
        setShowMatchesModal(true);
      } else {
        showToast(response.data?.message || "Failed to fetch matches", "error");
      }
    } catch (err) {
      console.error("Error fetching series matches:", err);
      showToast("Network error: Failed to fetch matches", "error");
    } finally {
      setLoadingMatches(false);
    }
  };

  const deleteMatchHandler = async (matchId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this match?"))
        return;

      const response = await deleteMatch(matchId);
      if (response.data.success) {
        setGames((prev) => prev.filter((game) => game._id !== matchId));
        showToast("Match deleted successfully", "success");
      } else {
        showToast(response.data.message || "Failed to delete match", "error");
      }
    } catch (err) {
      console.error("Error deleting match:", err);
      showToast("Network error: Failed to delete match", "error");
    }
  };
  const [actionOpen, setActionOpen] = useState(null);

  const toggleAction = (id) => {
    setActionOpen((prev) => (prev === id ? null : id));
  };

  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchGames(1, pagination.limit);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      search: "",
      name: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));

    setFilter(false);

    fetchGames(1, pagination.limit);
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const params = {
        id: sport_id,
      };
      console.log("Sending Params =>", params);
      const { data } = await refreshMatches(params);
      if (data.success) {
        await fetchGames(1, pagination.limit);
        showToast(`${data.addedCount} new matches added`, "success");
      } else {
        showToast("Refresh failed", "error");
      }
    } catch (err) {
      console.error("Refresh error:", err);
      showToast("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchGames(newPage, pagination.limit);
  };

  const handleImportEvent = async (game) => {
    try {
      if (!game.sport_id || !game.series_id) {
        showToast("Sport ID or Series ID missing for this match", "error");
        return;
      }
      setImporting(sport_id);
      const response = await importEvent(sport_id, game.series_id);

      if (response.data.success) {
        showToast(
          response.data.message || "Events imported successfully!",
          "success",
        );
        fetchGames(pagination.page, pagination.limit);
      } else {
        showToast(response.data.message || "Failed to import events", "error");
      }
    } catch (err) {
      console.error("Error importing events:", err);
      showToast(
        err.response?.data?.message || "Network error: Failed to import events",
        "error",
      );
    } finally {
      setImporting(null);
    }
  };

  // Toast helpers
  const showToast = (message, type = "success") =>
    setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchGames();
  }, []);

  // Toggle game status
  const toggleGameStatus = async (matchId, currentStatus) => {
    try {
      setUpdating(matchId);
      const response = await toggleMatchStatus(matchId);

      if (response.data.success) {
        setGames((prev) =>
          prev.map((game) =>
            game._id === matchId
              ? { ...game, status: currentStatus === 1 ? 0 : 1 }
              : game,
          ),
        );
        const newStatus = currentStatus === 1 ? "deactivated" : "activated";
        showToast(`Game ${newStatus} successfully`, "success");
      } else {
        showToast(response.data.message || "Failed to update status", "error");
      }
    } catch (err) {
      console.error("Error toggling game status:", err);
      showToast("Network error: Failed to update status", "error");
    } finally {
      setUpdating(null);
    }
  };
  const handleLimitChange = (e) => {
    const newLimit = Number(e.target.value);

    setPagination((prev) => ({
      ...prev,
      page: 1,
      limit: newLimit,
    }));

    fetchGames(1, newLimit);
  };
  // Status badge
  const getStatusBadge = (status) => {
    const isActive = status === 1;
    return (
      <span
        className={`fw-bold ${isActive ? "activebadge" : "inactivebadge"} me-2`}
      >
        {/* {isActive ? 'Active' : 'Inactive'} */}
      </span>
    );
  };

  // ToggleSwitch component
  const ToggleSwitch = ({ gameId, status, disabled }) => {
    const isActive = status === 1;
    return (
      <div className="form-check form-switch d-flex align-items-center gap-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={isActive}
          onChange={() => toggleGameStatus(gameId, status)}
          disabled={disabled}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        />
      </div>
    );
  };
  const handlePageClick = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchGames(page, pagination.itemsPerPage);
    }
  };
  const handleView = (game) => {
    navigate(
      `/view_event/${game._id}?sportId=${game.sport_id}&seriesId=${game.series_id}`,
    );
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;
    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(
        1,
        pagination.currentPage - Math.floor(maxVisiblePages / 2),
      );
      let end = Math.min(pagination.totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date Error";
    }
  };

  return (
    <div className="cricket">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
          <h3 className="card-title mb-0">
            {gameName ? `${gameName} Matches` : "All Match List"}
          </h3>

          <div className="d-flex align-items-center gap-2">
            <h3 className="card-title mb-0"></h3>

            <button
              title="Refresh Matches"
              className="btn btn-dark gradient-10 border-0"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? <FaSpinner className="fa-spin" /> : <FaDownload />}
            </button>

            {/* <button
              className="btn btn-light"
              onClick={() => setFilter((prev) => !prev)}
            >
              <MdFilterListAlt /> Filter
            </button> */}

            {/* <select
              className="form-select"
              style={{ width: "90px" }}
              value={pagination.limit}
              onChange={handleLimitChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select> */}
            <button
              className="btn btn-outline-light"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
        {/* 
        {filter && (
          <div className="card-body border-bottom"> */}
        {/* <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">Filter Matches</h6>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setFilter(false)}
              >
                ← Back
              </button>
            </div> */}

        {/* </div>
        )} */}

        {/* Table */}
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              {/* <label className="form-label">Status</label> */}
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
            <div className="col-md-3">
              {/* <label className="form-label">Search</label> */}
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
            <div className="col-md-3 d-flex align-items-end gap-2">
              <button className="btn btn-primary" onClick={applyFilters}>
                <FaSearch />
              </button>
              {/* <button className="btn btn-secondary" onClick={resetFilters}>
                  Reset
                </button> */}
            </div>
          </div>
          <div className="table-responsive mt-2">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Sr</th>
                  <th>Match lists</th>
                  {/* <th>Series ID</th> */}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="table_loader">
                      <div className="text-center py-5">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4">
                      <div className="text-center mt-3 text-danger">
                        <p>{error}</p>
                        <button
                          className="btn btn-primary"
                          onClick={fetchGames}
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : games.length > 0 ? (
                  games.map((game, index) => (
                    <tr key={game._id}>
                      <td>
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td>
                        <strong>{game.name}</strong>
                      </td>
                      {/* <td>
                    <code>{game.series_id}</code>
                    <div className="text-muted small mt-1">
                      Markets: {game.marketCount || 0}
                    </div>
                  </td> */}
                      <td>
                        {/* {getStatusBadge(game.status)} */}
                        {/* <div className="">
                          {game.status === 1 ? (
                            <span className="activebadge">Active</span>
                          ) : (
                            <span className="inactivebadge">Inactive</span>
                          )}
                        </div> */}

                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={` ${
                              game.status === 1 ? "text-success" : "text-danger"
                            }`}
                            onClick={() =>
                              toggleGameStatus(game._id, game.status)
                            }
                            disabled={updating === game._id}
                          >
                            {game.status === 1 ? (
                              <>
                                <FaUnlock className="me-1" title="Active" />
                              </>
                            ) : (
                              <>
                                <FaLock className="me-1" title="InActive" />
                              </>
                            )}
                          </span>

                          {updating === game._id && (
                            <div className="spinner-border spinner-border-sm text-primary"></div>
                          )}
                        </div>
                      </td>
                      {/* <td>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <button
                        className="viewbutton"
                        onClick={() => fetchSeriesMatches(game.series_id, game.name)}
                        title="View Series Matches"
                        disabled={loadingMatches}
                      >
                        <FaList /> View Matches
                      </button>
                      
                      <button
                        className="importbutton"
                        onClick={() => handleImportEvent(game)}
                        disabled={importing === game._id || !game.sport_id || !game.series_id}
                      >
                        {importing === game._id ? (
                          <>
                            <FaSpinner className="spinner" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <FaDownload /> Import
                          </>
                        )}
                      </button>
                      
                      <div className="d-flex align-items-center gap-1">
                        <ToggleSwitch
                          gameId={game._id}
                          status={game.status}
                          disabled={updating === game._id}
                        />
                        {updating === game._id && (
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleView(game)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteMatchHandler(game._id)}
                        title="Delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td> */}
                      <td
                        className="d-flex align-items-center gap-2 "
                        ref={actionRef}
                      >
                        <div className="actions">
                          {/* <button
                          className="actionbutton edit"
                          onClick={() => deleteMatchHandler(game._id)}
                          title="Delete"
                        >
                          <FaTrashAlt />
                        </button> */}

                          <button
                            className="btn gradient-10 btn-rounded"
                            onClick={() => handleImportEvent(game)}
                            title="Import"
                            disabled={
                              importing === game._id ||
                              !game.sport_id ||
                              !game.series_id
                            }
                          >
                            {importing === game._id ? (
                              <FaSpinner className="spinner fa-spin" />
                            ) : (
                              <FaDownload />
                            )}
                          </button>

                          <button
                            className="btn gradient-7 btn-rounded"
                            onClick={() => handleView(game)}
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {/* <div className="d-flex align-items-center gap-1">
                            <ToggleSwitch
                              gameId={game._id}
                              status={game.status}
                              disabled={updating === game._id}
                            />
                            {updating === game._id && (
                              <div className="spinner-border spinner-border-sm text-primary" />
                            )}
                          </div> */}
                        </div>

                        <div className="d-flex flex-wrap align-items-center gap-2 position-relative">
                          <div
                            className="dropdown position-relative"
                            ref={actionRef}
                          >
                            <button
                              className="btn btn-icon btn-sm"
                              onClick={() => toggleAction(game._id)}
                              aria-expanded={actionOpen === game._id}
                            >
                              <BsThreeDotsVertical />
                            </button>

                            {actionOpen === game._id && (
                              <ul className="dropdown-menu_csut dropdown-menu-end show">
                                <li>
                                  {/* <button
                                  className="dropdownmenu_li"
                                  onClick={() => {
                                    handleImportEvent(game);
                                    setActionOpen(null);
                                  }}
                                  disabled={
                                    importing === game._id ||
                                    !game.sport_id ||
                                    !game.series_id
                                  }
                                >
                                  {importing === game._id ? (
                                    <>
                                      <FaSpinner className="spinner" />{" "}
                                      Importing...
                                    </>
                                  ) : (
                                    <>
                                      <FaDownload /> Import
                                    </>
                                  )}
                                </button> */}

                                  <button
                                    className="dropdownmenu_li text-danger"
                                    onClick={() => {
                                      deleteMatchHandler(game._id);
                                      setActionOpen(null);
                                    }}
                                  >
                                    <FaTrashAlt /> Delete
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdownmenu_li"
                                    onClick={() =>
                                      fetchSeriesMatches(
                                        game.series_id,
                                        game.name,
                                      )
                                    }
                                    title="View Series Matches"
                                    disabled={loadingMatches}
                                  >
                                    <FaList /> View Matches
                                  </button>
                                </li>
                              </ul>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="text-muted">No matches found</div>
                      <button
                        className="btn btn-primary mt-2"
                        onClick={fetchGames}
                      >
                        Refresh
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
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
        </div>
      </div>

      <Modal
        show={showMatchesModal}
        onHide={() => setShowMatchesModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary-yellow">
          <Modal.Title>
            {selectedSeries?.name || "Series"} Matches
            {selectedSeries?.id && (
              <div className="small text-light text-start mt-1">
                Series ID: {selectedSeries.id}
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingMatches ? (
            <div className="text-center p-4">
              <Loader />
              <p className="mt-2">Loading matches...</p>
            </div>
          ) : seriesMatches.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Sr</th>
                    <th>Match Name</th>
                    <th>Country</th>
                    <th>Date & Time</th>
                    <th>Markets</th>
                    <th>Event ID</th>
                  </tr>
                </thead>
                <tbody>
                  {seriesMatches.map((match, index) => (
                    <tr key={match.event?.id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{match.event?.name || "N/A"}</strong>
                      </td>
                      <td>{match.event?.countryCode || "N/A"}</td>
                      <td>
                        {match.event?.openDate
                          ? formatDate(match.event.openDate)
                          : "N/A"}
                      </td>
                      <td>
                        <span className="badge bg-info d-inline">
                          {match.marketCount || 0}
                        </span>
                      </td>
                      <td>
                        <code className="small">
                          {match.event?.id || "N/A"}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">No matches found for this series</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div className="text-muted small">
              Total Matches: {seriesMatches.length}
            </div>
            <Button variant="danger" onClick={() => setShowMatchesModal(false)}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Cricketlist;
