import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import { getUserSettledBets } from "../Server/api";

function MatchMarketBets() {
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

  // ✅ URL se event_id (params) aur user_id (query) lo
  const { id } = useParams(); // ✅ Sirf EK BAAR declare karo
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");

  console.log("🔍 Event ID (from URL):", id);
  console.log("🔍 User ID (from query):", userId);

  const fetchBets = async (page = pagination.page) => {
    if (!id) {
      Swal.fire("Error", "Event ID not found", "error");
      navigate(-1);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        event_id: id,
        user_id: userId,
        page: page,
        limit: pagination.limit
      };

      console.log("📤 Sending payload:", payload);

      const response = await getUserSettledBets(payload);

      console.log("📥 Bets Response:", response);

      if (response.data.status_code === 1) {
        setBets(response.data.data || []);
        setPagination(prev => ({
          ...prev,
          page: page,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0
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

  // ✅ userId change par bhi fetch karo
  useEffect(() => {
    if (id) {
      fetchBets();
    }
  }, [id, userId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
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
      if (bet.is_settled === 1 || bet.is_settled === "Yes") {
        settledCount++;
      } else {
        pendingCount++;
      }
    });

    return { totalStake, totalCommission, settledCount, pendingCount };
  };

  const { totalStake, totalCommission, settledCount, pendingCount } = calculateSummary();

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      <section className="main-inner-outer py-4">
        <section className="account-table">
          <div className="container-fluid">
            <div className="db-sec d-flex justify-content-between align-items-center mb-2">
              <button
                type="button"
                className="green-btn btn btn-primary"
                onClick={() => window.close()}
              >
                Close
              </button>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Sports</th>
                        <th scope="col">Match Name</th>
                        <th scope="col">Client</th>
                        <th scope="col">Odds</th>
                        <th scope="col">Stake</th>
                        <th scope="col">Place Time</th>
                        <th scope="col">IP</th>
                        <th scope="col">PnL</th>
                        <th scope="col">Bet Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bets.length > 0 ? (
                        bets.map((bet, index) => (
                          <tr key={bet._id || bet.id || index}>
                            <td className="text-start">{bet.game_name || "-"}</td>
                            <td>{bet.market_name || bet.event_name || "-"}</td>
                            <td>{bet.user_name || bet.client || bet.username || "-"}</td>
                            <td>{bet.odd || "-"}</td>
                            <td>{bet.stake || 0}</td>
                            <td>{formatDate(bet.placed || bet.created_at || bet.placeTime)}</td>
                            <td>{bet.ip || bet.ip_address || "-"}</td>
                            <td className="text-end">
                              {isNaN(Number(bet.liability))
                                ? "0.00"
                                : Number(bet.liability).toFixed(2)}
                            </td>
                            <td>{bet.bet_type || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="11" className="text-center py-4">
                            No bets found for this event
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </section>
    </>
  );
}

export default MatchMarketBets;