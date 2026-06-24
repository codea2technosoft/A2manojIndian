import React, { useState, useEffect } from "react";
import Toast from "../../User/Toast";
import { getAllGames, toggleGameStatus } from "../../Server/game.service";
import ToggleSwitch from "../../Common/ToggleSwitch";
import { useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";
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

  if (loading)
    return (
      <div className="text-center mt-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading games...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-3 text-danger">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchGames}>
          Retry
        </button>
      </div>
    );

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
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {games.length > 0 ? (
                games.map((game, index) => (
                  <tr key={game._id}>
                    <td>{index + 1}</td>
                    <td>
                      {game.name}
                      {/* {game.description && <small className="d-block text-muted">{game.description}</small>} */}
                    </td>
                    <td>{game.category}</td>
                    <td>{getStatusBadge(game.isActive)}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2 justify-content-center gap-3">
                        <ToggleSwitch
                          checked={game.isActive}
                          loading={updating === game._id}
                          onChange={() => handleToggleGameStatus(game)}
                        />
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleView(game.id)}
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleActive(game.id)}
                          title="Active"
                        >
                          Active
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleInActive(game.id)}
                          title="InActive"
                        >
                          InActive
                        </button>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleComplete(game.id)}
                          title="Complete"
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
    </div>
  );
}

export default AllGameList;
