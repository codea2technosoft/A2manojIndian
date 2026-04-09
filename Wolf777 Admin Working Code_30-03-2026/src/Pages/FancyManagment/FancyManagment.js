import { Link, useParams, useLocation } from "react-router-dom"; // ✅ useLocation add karo
import React, { useState, useEffect } from "react";
import { MdFilterListAlt } from "react-icons/md";
// import { Link } from "react-router";
import axios from "axios";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

import Toast from "../../User/Toast";
import { getAllFancyMatches } from "../../Server/api";
import { useNavigate } from "react-router-dom";
function FancyManagment() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState(false);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
// Status filter: active/inactive
// Filters state
const [filters, setFilters] = useState({
  status: "", // active/inactive
  search: "", // name search
});

// Pagination state
const [pagination, setPagination] = useState({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
});

  // ✅ URL se sportId aur seriesId extract karo
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Fetch games from API
  const fetchMatches = async (page = pagination.page, limit = pagination.limit) => {
    try {
      setLoading(true);
        const params = {
      page,
      limit,
      ...filters
    };
      
     const response = await getAllFancyMatches(params);
     if (response.data.success) {
        setGames(response.data.data);
         setPagination(prev => ({
        ...prev,
        page: response.data.pagination.page,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages
      }));
        setError("");
      } else {
        setError(response.data.message || "Failed to fetch games");
        showToast(response.data.message || "Failed to fetch games", 'error');
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to fetch games");
      showToast("Network error: Failed to fetch games", 'error');
    } finally {
      setLoading(false);
    }
  };
 const applyFilters = () => {
  setPagination(prev => ({ ...prev, page: 1 }));
  fetchMatches(1, pagination.limit); // filter apply ke sath refresh
  setFilter(false);
};

  const resetFilters = () => {
    setFilters({
      status: "",
      search: "",
      userId: "",
      mobile: "",
      name: ""
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    setFilter(false);
  };

  const handleRefresh = () => {
    resetFilters();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchMatches(newPage);
  };

  // Toast helpers
  const showToast = (message, type = 'success') => setToast({ show: true, message, type });
  const hideToast = () => setToast({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchMatches();
  }, []);


 const handleView = (match) => { // ✅ Pure game object pass karein
    navigate(`/view_match/${match._id}?sportId=${match.sport_id}&seriesId=${match.series_id}`);
  };
  // // Toggle game status
  // const toggleGameStatus = async (matchId, currentStatus) => {
  //   try {
  //     setUpdating(matchId);
  //     const response = await axios.patch(
  //       `${process.env.REACT_APP_API_URL}/matches/${matchId}/toggle-status`,
  //       { matchId },
  //       {
  //         headers: { 'Content-Type': 'application/json' },
  //         withCredentials: false
  //       }
  //     );

  //     if (response.data.success) {
  //       setGames(prev =>
  //         prev.map(game =>
  //           game._id === matchId ? { ...game, status: currentStatus === 1 ? 0 : 1 } : game
  //         )
  //       );
  //       const newStatus = currentStatus === 1 ? 'deactivated' : 'activated';
  //       showToast(`Game ${newStatus} successfully`, 'success');
  //     } else {
  //       showToast(response.data.message || "Failed to update status", 'error');
  //     }
  //   } catch (err) {
  //     console.error("Error toggling game status:", err);
  //     showToast("Network error: Failed to update status", 'error');
  //   } finally {
  //     setUpdating(null);
  //   }
  // };

  // // Status badge
  // const getStatusBadge = (status) => {
  //   const isActive = status === 1; // 1 = Active, 0 = Inactive
  //   return (
  //     <span className={`fw-bold ${isActive ? 'text-success' : 'text-danger'} me-2`}>
  //       {isActive ? 'Active' : 'Inactive'}
  //     </span>
  //   );
  // };

  // // ToggleSwitch component
  // const ToggleSwitch = ({ gameId, status, disabled }) => {
  //   const isActive = status === 1;
  //   return (
  //     <div className="form-check form-switch d-flex align-items-center gap-2">
  //       <input
  //         className="form-check-input"
  //         type="checkbox"
  //         checked={isActive}
  //         onChange={() => toggleGameStatus(gameId, status)}
  //         disabled={disabled}
  //         style={{
  //           cursor: disabled ? 'not-allowed' : 'pointer',
  //         }}
  //       />
  //       <label className="form-check-label small fw-bold mb-0">
  //         {isActive ? 'Active' : 'Inactive'}
  //       </label>
  //     </div>
  //   );
  // };

  // Loading state
  if (loading) return (
    <div className="text-center mt-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading games...</p>
    </div>
  );

  // Error state
  if (error) return (
    <div className="text-center mt-3 text-danger">
      <p>{error}</p>
      <button className="btn btn-primary" onClick={fetchMatches}>Retry</button>
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
         <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">All Games List</h3>
          <div>
            <button className="refeshbutton" onClick={handleRefresh}>Refresh</button>
            <button className="fillterbutton" onClick={() => setFilter(prev => !prev)}>
              <MdFilterListAlt /> Filter
            </button>
          </div>
        </div>
      {filter && (
  <div className="card-body border-bottom">
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Search Name</label>
        <input 
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="">All</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>
      <div className="col-md-12 d-flex gap-2 mt-2">
        <button className="btn btn-primary" onClick={() => { setPagination(prev => ({...prev, page: 1})); fetchMatches(1); }}>Apply</button>
        <button className="btn btn-secondary" onClick={() => { setFilters({status:"", search:""}); setPagination(prev => ({...prev, page: 1})); fetchMatches(1); }}>Reset</button>
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
                <th>Name</th>
                {/* <th>Date&Time</th>
                <th>Status</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {games.length > 0 ? games.map((game, index) => (
                <tr key={game._id}>
                 <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td>
                   {game.name}
                  </td>
                  {/* <td> {game.created_at}</td>
                  <td>{getStatusBadge(game.status)}</td> */}
                  <td className="d-flex align-items-center gap-2">
                    <button
                      className="viewmatch"
                      onClick={() => handleView(game)} // ✅ Game object pass karein
                    >
                      View Match
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No games found
                    <br />
                    <button className="btn btn-primary mt-2" onClick={fetchMatches}>Refresh</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* {pagination.total > 0 && (
  <div className="card-footer d-flex justify-content-between align-items-center">
    <span>Page {pagination.page} of {pagination.totalPages} • Total: {pagination.total} games</span>
    <div className="d-flex gap-2">
      <button 
        className="btn btn-sm btn-outline-primary"
        onClick={() => pagination.page > 1 && fetchMatches(pagination.page - 1)}
        disabled={pagination.page === 1}
      >
        Previous
      </button>
      <button 
        className="btn btn-sm btn-outline-primary"
        onClick={() => pagination.page < pagination.totalPages && fetchMatches(pagination.page + 1)}
        disabled={pagination.page === pagination.totalPages}
      >
        Next
      </button>
    </div>
  </div>
)} */}
{pagination.total > 0 && (
  <div className="card-footer d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center">
      <span className="text-muted me-3">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)}
         {/* of {pagination.total} games */}
      </span>
    </div>
    
    <nav aria-label="Page navigation">
      <ul className="paginationall mb-0">
        {/* Previous Button */} 
        <button className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
          <span 
            className="page-link"
            onClick={() => pagination.page > 1 && handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            aria-label="Previous"
          >
           <MdOutlineKeyboardArrowLeft/>
          </span>
        </button>
        
        {/* Page Numbers */}
        {(() => {
          const pages = [];
          const totalPages = pagination.totalPages;
          const currentPage = pagination.page;
          
          // Always show first page
          pages.push(
            <button key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
              <span className="page-link" onClick={() => handlePageChange(1)}>
                1
              </span>
            </button>
          );
          if (currentPage > 3) {
            pages.push(
              <button key="ellipsis1" className="page-item disabled">
                <span className="page-link">...</span>
              </button>
            );
          }
          for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            if (i > 1 && i < totalPages) {
              pages.push(
                <button key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                  <span className="page-link" onClick={() => handlePageChange(i)}>
                    {i}
                  </span>
                </button>
              );
            }
          }
          if (currentPage < totalPages - 2) {
            pages.push(
              <button key="ellipsis2" className="page-item disabled">
                <span className="page-link">...</span>
              </button>
            );
          }
          if (totalPages > 1) {
            pages.push(
              <button key={totalPages} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                <span className="page-link" onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </span>
              </button>
            );
          }
          
          return pages;
        })()}
        
        {/* Next Button */}
        <button className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
          <span 
            className="page-link"
            onClick={() => pagination.page < pagination.totalPages && handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            aria-label="Next"
          >
                       <MdOutlineKeyboardArrowRight/>
          </span>
        </button>
      </ul>
    </nav>
  </div>
)}
      </div>
    </div>
  );
}

export default FancyManagment;