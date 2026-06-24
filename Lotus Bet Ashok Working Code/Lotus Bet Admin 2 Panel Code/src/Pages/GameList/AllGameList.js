import React, { useState, useEffect } from "react";
import { MdFilterListAlt } from "react-icons/md";
import axios from "axios";
import Toast from "../../User/Toast";
import { getAllGames, toggleGameStatus } from "../../Server/api";

function AllGameList() {
  const [filter, setFilter] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' }); // ✅ Toast state

  // const fetchGames = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/allgamelist`);
  //     if (response.data.success) {
  //       setGames(response.data.data || []);
  //       setError("");
  //     } else {
  //       setError(response.data.message || "Failed to fetch games");
  //        showToast(response.data.message || "Failed to fetch games", 'error');

  //     }
  //   } catch (err) {
  //     console.error("Error fetching games:", err);
  //     setError("Failed to fetch games");
  //      showToast("Network error: Failed to fetch games", 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // 

  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await getAllGames(); // ✅ SIMPLE CALL

      if (response.data.success) {
        setGames(response.data.data || []);
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch games");
        showToast(response.data.message || "Failed to fetch games", 'error');
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
      // showToast("Network error: Failed to fetch games", 'error');
    } finally {
      setLoading(false);
    }
  };
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', type: '' });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleToggleGameStatus = async (gameId, currentActiveStatus ) => {
    try {
      setUpdating(gameId);
      const response = await toggleGameStatus(gameId);

      if (response.data.success) {
        setGames(prev =>
          prev.map(game =>
            game._id === gameId ? { ...game, Active: !currentActiveStatus  } : game
          )
        );
        //  showToast(response.data.message, 'success');
        // CORRECTED: Clear status message
const newStatus = !currentActiveStatus;
showToast(`Game ${newStatus ? 'activated' : 'deactivated'} successfully`);

      } else {
        showToast(response.data.message || "Failed to update status", 'error');
      }
    } catch (err) {
      console.error("Error toggling game status:", err);
    } finally {
      setUpdating(null);
    }
  };

const getStatusBadge = (Active) => {
  return (
    <span className={`fw-bold ${Active ? 'text-success' : 'text-danger'} me-2`}>
      {Active ? 'Active' : 'Inactive'}
    </span>
  );
};


  // CORRECTED: ToggleSwitch with clear logic
const ToggleSwitch = ({ gameId, Active, disabled }) => {
  return (
    <div className="form-check form-switch d-flex align-items-center gap-2">
      <input
        className="form-check-input"
        type="checkbox"
        checked={Active} // true = ON (Active)
        onChange={() => handleToggleGameStatus(gameId, Active)}
        disabled={disabled}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
    </div>
  );
};


  // Rest of your component remains same...
  if (loading) return (
    <div className="text-center mt-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading games...</p>
    </div>
  );

  if (error) return (
    <div className="text-center mt-3 text-danger">
      <p>{error}</p>
      <button className="btn btn-primary" onClick={fetchGames}>Retry</button>
    </div>
  );

  return (
    <div className="mt-3">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <div className="card">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">All Sports List</h3>
          <div>
            <button className="btn btn-info me-2" onClick={fetchGames}>Refresh</button>
            <button
              className="btn btn-outline-light"
              onClick={() => setFilter(prev => !prev)}
            >
              <MdFilterListAlt /> Filter
            </button>
          </div>
        </div>

        {filter && (
          <div className="card-body">
            <div className="d-flex gap-2">
              <input type="text" className="form-control" placeholder="Search by game name" />
              <select className="form-control">
                <option value="">All Categories</option>
                <option value="sports">Sports</option>
                <option value="casino">Casino</option>
                <option value="arcade">Arcade</option>
              </select>
              <select className="form-control">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="btn btn-info">Filter</button>
            </div>
          </div>
        )}

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
              {games.length > 0 ? games.map((game, index) => (
                <tr key={game._id}>
                  <td>{index + 1}</td>
                  <td>
                    {game.name}
                    {/* {game.description && <small className="d-block text-muted">{game.description}</small>} */}
                  </td>
                  <td>{game.category}</td>
                  <td>{getStatusBadge(game.Active)}</td>
                  <td>
                    <ToggleSwitch
                      gameId={game._id}
                      Active={game.Active}
                      disabled={updating === game._id}
                    />
                  {updating === game._id && (
  <div className="spinner-border spinner-border-sm text-primary ms-2" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No games found
                    <br />
                    <button className="btn btn-primary mt-2" onClick={fetchGames}>Refresh</button>
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