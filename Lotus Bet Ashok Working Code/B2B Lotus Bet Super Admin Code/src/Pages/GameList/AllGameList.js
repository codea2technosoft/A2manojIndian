import React, { useState, useEffect } from "react";
import Toast from "../../User/Toast";
import { getAllGames, toggleGameStatus } from "../../Server/game.service";
import ToggleSwitch from "../../Common/ToggleSwitch";
import { useNavigate } from "react-router";
import { FaEye, FaUnlock } from "react-icons/fa";
import Loader from "../../Common/Loader";
import { FaLock, FaLockOpen } from "react-icons/fa";

function AllGameList() {
  const [filter, setFilter] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();
  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await getAllGames();

      if (response.data.success) {
        setGames(response.data.data || []);
        setError("");
      } else {
        setError(response.data.message);
        showToast(response.data.message, "error");
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };
  const handleView = (id) => {
    navigate(`/cricket/${id}`);
  };
  const handleActive = (id) => {
    navigate(`/active_events/${id}`);
  };
  const handleInActive = (id) => {
    navigate(`/inActive_events/${id}`);
  };
  const handleComplete = (id) => {
    navigate(`/complete_events/${id}`);
  };
  useEffect(() => {
    fetchGames();
  }, []);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  const handleStatusClick = (game) => {
    setSelectedGame(game);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedGame) return;

    try {
      setUpdating(selectedGame._id);

      const response = await toggleGameStatus(selectedGame._id);

      if (response.data.success) {
        const updatedGame = response.data.data;

        setGames((prev) =>
          prev.map((g) => (g._id === selectedGame._id ? updatedGame : g)),
        );

        showToast("Status updated successfully");
      } else {
        showToast(response.data.message, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating status", "error");
    } finally {
      setUpdating(null);
      setShowStatusModal(false);
      setSelectedGame(null);
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedGame(null);
  };

  const handleToggleGameStatus = async (game) => {
    try {
      setUpdating(game._id);

      const response = await toggleGameStatus(game._id);

      if (response.data.success) {
        const updatedGame = response.data.data;

        setGames((prev) =>
          prev.map((g) => (g._id === game._id ? updatedGame : g)),
        );

        showToast("Status updated successfully");
      } else {
        showToast(response.data.message, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating status", "error");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`${isActive ? "activebadge" : "inactivebadge"} me-2`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className="all_sport">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      <div className="card">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">All Sports List</h3>
        </div>

        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Sr</th>
                <th>Sports Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="table_loader">
                    <div className="text-center py-5">
                      <Loader />
                      {/* <h6>Loading games...</h6> */}
                    </div>
                  </td>
                </tr>
              ) : error ? (
                /* Error */
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <p className="text-danger mb-3">{error}</p>

                    <button className="btn btn-primary" onClick={fetchGames}>
                      Retry
                    </button>
                  </td>
                </tr>
              ) : games.length > 0 ? (
                games.map((game, index) => (
                  <tr key={game._id}>
                    <td>{index + 1}</td>
                    <td className="text-capitalize">
                      {game.name}
                      {/* {game.description && <small className="d-block text-muted">{game.description}</small>} */}
                    </td>
                    <td>{game.category}</td>
                    {/* <td>{getStatusBadge(game.isActive)}</td> */}
                    <td>
                      <span
                        onClick={() => handleStatusClick(game)}
                        disabled={updating === game._id}
                      >
                        {game.isActive ? (
                          <>
                            <FaUnlock
                              className="me-1 text-success"
                              title="active"
                            />
                          </>
                        ) : (
                          <>
                            <FaLock
                              className="me-1 text-danger"
                              title="Inactive"
                            />
                          </>
                        )}
                      </span>
                      {/* 
                      {updating === game._id && (
                        <span className="spinner-border spinner-border-sm ms-2"></span>
                      )} */}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 justify-content-start gap-3">
                        {/* <ToggleSwitch
                          checked={game.isActive}
                          loading={updating === game._id}
                          onChange={() => handleToggleGameStatus(game)}
                        /> */}
                        <button
                          className="btn gradient-7 btn-rounded"
                          onClick={() => handleView(game.id)}
                          title="View Matches"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-warning gradient-10 border-0"
                          onClick={() => handleActive(game.id)}
                          title="Active Events"
                        >
                          Active
                        </button>
                        <button
                          className="btn btn-sm btn-danger gradient-2 border-0"
                          onClick={() => handleInActive(game.id)}
                          title="InActive Events"
                        >
                          InActive
                        </button>
                        <button
                          className="btn btn-sm btn-success gradient-4 border-0"
                          onClick={() => handleComplete(game.id)}
                          title="Complete Events"
                        >
                          Complete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No games found
                    <br />
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
      </div>

      {showStatusModal && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Status Change</h5>

                  <button
                    className="btn-close"
                    onClick={closeStatusModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <h6>Change Status this game</h6>

                  <p className="mb-0">
                    Are you sure you want to
                    <span className="fw-bold">
                      {selectedGame?.isActive ? " Inactive " : " Active "}
                    </span>
                    this game?
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    className={`btn btn-theme`}
                    onClick={confirmStatusChange}
                  >
                    Yes, {selectedGame?.isActive ? "Inactive" : "Active"}
                  </button>
                  <button className="btn btn-dark" onClick={closeStatusModal}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default AllGameList;
