import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import { getUserSettledBets } from "../Server/api";

function UserSettledBetsDetails() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const fetchBets = async (page = pagination.page) => {
    if (!userId) {
      Swal.fire("Error", "User ID not found", "error");
      navigate(-1);
      return;
    }

    setLoading(true);
    try {
      const response = await getUserSettledBets({
        user_id: userId,
        page: page,
        limit: pagination.limit
      });

      if (response.data.status_code === 1) {
        setBets(response.data.data);
        setPagination(prev => ({
          ...prev,
          page: page,
        }));
      } else {
        Swal.fire("Error", response.data.message || "Failed to fetch bets", "error");
      }
    } catch (error) {
      console.error("Error fetching bets:", error);
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, [userId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      fetchBets(newPage);
    }
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    let totalStake = 0;
    let totalCommission = 0;
    let settledCount = 0;
    let pendingCount = 0;

    bets.forEach(bet => {
      totalStake += bet.stake || 0;
      totalCommission += bet.comissionAmount || 0;
      if (bet.is_settled === 1) {
        settledCount++;
      } else {
        pendingCount++;
      }
    });

    return { totalStake, totalCommission, settledCount, pendingCount };
  };

  const { totalStake, totalCommission, settledCount, pendingCount } = calculateSummary();

  return (
    <>
      <div className="card">
        <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Users Settled Bets Details</h3>
          <button
            className="btn btn-light"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Summary Cards */}
        {/* {bets.length > 0 && (
          <div className="card-body border-bottom">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="alert alert-info mb-0">
                  <small className="text-muted">Total Stake</small>
                  <h5 className="mb-0">₹ {totalStake.toLocaleString('en-IN')}</h5>
                </div>
              </div>
              <div className="col-md-3">
                <div className="alert alert-warning mb-0">
                  <small className="text-muted">Total Commission</small>
                  <h5 className="mb-0">₹ {totalCommission.toLocaleString('en-IN')}</h5>
                </div>
              </div>
              <div className="col-md-3">
                <div className="alert alert-success mb-0">
                  <small className="text-muted">Settled Bets</small>
                  <h5 className="mb-0">{settledCount}</h5>
                </div>
              </div>
              <div className="col-md-3">
                <div className="alert alert-secondary mb-0">
                  <small className="text-muted">Pending Bets</small>
                  <h5 className="mb-0">{pendingCount}</h5>
                </div>
              </div>
            </div>
          </div>
        )} */}

        <div className="card-body table-responsive">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : bets.length > 0 ? (
            <>
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Match</th>
                    <th>Bet Type</th>
                    <th>Team</th>
                    <th>Yes / No</th>
                    <th>ODD</th>
                    <th>Stake</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((bet, index) => (
                    <tr key={bet._id}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>

                      <td>
                        <small>
                          {new Date(bet.created_at).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </small>
                      </td>


                      <td>{bet.event_name || '-'}</td>
                      <td className="text-capitalize">
                        <span className="badge bg-info">
                          {bet.bet_type}
                        </span>
                      </td>

                      <td>{bet.team}</td>


                      <td className="text-capitalize">
                        <span className={`badge ${bet.bet_on === 'back' ? 'bg-success' : 'bg-danger'}`}>
                          {bet.bet_on === 'back' ? 'Yes' : 'No'}
                        </span>
                      </td>

                      <td className="fw-bold">{bet.odd}</td>
                      <td className="fw-bold text-primary">₹ {bet.stake?.toLocaleString('en-IN') || 0}</td>
                       <td className="text-danger">₹ {bet.comissionAmount || 0}</td>

                    </tr>
                  ))}

                </tbody>
              </table>

              {/* Pagination */}
              {bets.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted small">
                    Page {pagination.page} | Showing {bets.length} records
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={loading || bets.length < pagination.limit}
                    >
                      Load More
                    </button>
                    {pagination.page > 1 && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={loading}
                      >
                        Previous
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <div className="mb-3">
                <FaArrowLeft size={48} className="text-muted" />
              </div>
              <h5>No bets found for this user</h5>
              <p className="text-muted">This user hasn't placed any bets yet.</p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => navigate(-1)}
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserSettledBetsDetails;