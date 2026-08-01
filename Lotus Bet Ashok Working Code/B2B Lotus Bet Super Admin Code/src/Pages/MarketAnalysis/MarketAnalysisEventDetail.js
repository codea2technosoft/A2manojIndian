import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getEventDetail, setUserMarketSetting } from "../../Server/api";

function MarketAnalysisEventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [stake, setStake] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const marketId = "8.99929765";

  // ✅ बेट हिस्ट्री डेमो डेटा (इमेज से)
  const betHistoryData = [
    {
      sr: 1,
      userName: "Demovs777",
      selection: "France - BOOKMAKER",
      rate: 400.00,
      userStake: 10000.00,
      time: "00:36:54 2026-06-21"
    },
    {
      sr: 2,
      userName: "Yashbh22",
      selection: "Portugal - BOOKMAKER",
      rate: 800.00,
      userStake: 200.00,
      time: "23:34:30 2026-06-11"
    },
    {
      sr: 3,
      userName: "Yashbh22",
      selection: "Portugal - BOOKMAKER",
      rate: 100.00,
      userStake: 15.00,
      time: "23:34:15 2026-06-11"
    }
  ];

  // ✅ API: इवेंट डिटेल लाना
  const fetchEventDetail = async (page = pagination.page) => {
    try {
      setLoading(true);
      const res = await getEventDetail(eventId, {
        page,
        limit: pagination.limit,
      });

      const response = res.data;
      if (response.success) {
        setEventData(response.data || {});
        setPagination((prev) => ({
          ...prev,
          page: response.pagination?.page || 1,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 0,
        }));
        setError("");
      } else {
        setError(response.message || "Failed to fetch event details");
        toast.error(response.message || "Failed to fetch event details");
      }
    } catch (err) {
      console.error("Error fetching event detail:", err);
      setError("Failed to fetch event details");
      toast.error("Network error: Failed to fetch event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetail(pagination.page);
    }
  }, [eventId, pagination.page]);

  // ✅ बुकमेकर पॉपअप खोलना
  const handleBookmakerClick = (team) => {
    setSelectedTeam(team);
    setShowPopup(true);
  };

  // ✅ API: दांव भेजना
  const handlePlaceBet = async () => {
    if (!stake || parseFloat(stake) <= 0) {
      toast.error("Please enter a valid amount!");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        market_id: marketId,
        market_type_id: "BOOK_MAKER",
        min_bet: "10.00",
        max_bet: "200000.00",
        max_profit: "10000000.00",
        max_market_profit: "10000000.00",
        bet_allow: 1,
        stake: stake,
        selection: selectedTeam?.name || "",
        rate: selectedTeam?.rate || "",
        event_id: eventId,
      };

      const res = await setUserMarketSetting(payload);
      if (res.data.success) {
        toast.success("✅ Bet placed successfully!");
        setShowPopup(false);
        setStake("");
        fetchEventDetail(pagination.page);
      } else {
        toast.error(res.data.message || "❌ Failed to place bet!");
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      toast.error("❌ Failed to place bet!");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ बेट हिस्ट्री पेज पर जाना
  const handleBetHistoryClick = () => {
    navigate(`/bet-history/12670/${marketId}`);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  if (loading)
    return (
      <div className="text-center mt-3">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">⏳ Loading event details...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-3 text-danger">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchEventDetail}>
          Retry
        </button>
      </div>
    );

  return (
    <div className="mt-3">
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        {/* हेडर */}
        <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
          <h3 className="card-title mb-0">
            🏆 {eventData?.name || "Event Details"}
          </h3>
          <div>
            <button
              className="btn btn-secondary me-2"
              onClick={() => navigate(-1)}
            >
              ⬅ Back
            </button>
            <button
              className="btn btn-warning"
              onClick={handleBetHistoryClick}
            >
              📜 Bet History
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* FIFA World Cup हेडर */}
          <h4 className="mb-3">🏆 FIFA World Cup</h4>

          {/* BOOKMAKER हेडर */}
          <div className="mb-3">
            <h5 className="d-inline-block bg-dark text-white px-3 py-1 rounded">
              📖 BOOKMAKER
            </h5>
          </div>

          {/* टेबल - बिल्कुल इमेज जैसा */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Team</th>
                  <th>Rate</th>
                  <th colSpan="2">BACK</th>
                  <th colSpan="2">LAY</th>
                  <th>Action</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Odds</th>
                  <th>Volume</th>
                  <th>Odds</th>
                  <th>Volume</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {eventData?.teams?.length > 0 ? (
                  eventData.teams.map((team, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{team.name}</strong>
                      </td>
                      <td>
                        <span className={team.rate < 0 ? 'text-danger' : 'text-success'}>
                          {team.rate || team.odds || "-"}
                        </span>
                      </td>
                      <td>{team.back_odds || team.back || "740"}</td>
                      <td>{team.back_volume || "100K"}</td>
                      <td>{team.lay_odds || team.lay || "370"}</td>
                      <td>{team.lay_volume || "100K"}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleBookmakerClick(team)}
                        >
                          📖 BOOKMAKER
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      ❌ No teams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* User Table - बिल्कुल इमेज जैसा */}
          <div className="mt-4">
            <h5 className="mb-3">👤 User Bets</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Sr</th>
                    <th>User Name</th>
                    <th>Selection</th>
                    <th>Rate</th>
                    <th>User Stake</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {betHistoryData.map((bet, index) => (
                    <tr key={index}>
                      <td>{bet.sr}</td>
                      <td>{bet.userName}</td>
                      <td>{bet.selection}</td>
                      <td>{bet.rate.toFixed(2)}</td>
                      <td>{bet.userStake.toFixed(2)}</td>
                      <td>{bet.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* पेजिनेशन */}
        {pagination.total > 0 && (
          <div className="card-footer">
            <div className="d-flex justify-content-between align-items-center mt-2">
              <div className="sohwingallentries">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} entries
              </div>

              <div className="paginationall d-flex align-items-center gap-1">
                <button
                  onClick={() =>
                    pagination.page > 1 && handlePageChange(pagination.page - 1)
                  }
                  disabled={pagination.page === 1}
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>
                <div className="paginationnumber">{pagination.page}</div>
                <button
                  onClick={() =>
                    pagination.page < pagination.totalPages &&
                    handlePageChange(pagination.page + 1)
                  }
                  disabled={pagination.page === pagination.totalPages}
                >
                  <MdOutlineKeyboardArrowRight />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOOKMAKER पॉपअप */}
      {showPopup && selectedTeam && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>📖 {selectedTeam.name} - BOOKMAKER</h4>
            <p>
              <strong>Rate:</strong>{" "}
              <span className={selectedTeam.rate < 0 ? 'text-danger' : 'text-success'}>
                {selectedTeam.rate || selectedTeam.odds}
              </span>
            </p>
            <p>
              <strong>Market ID:</strong> {marketId}
            </p>
            <div className="form-group">
              <label>Stake Amount:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter amount..."
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                min="10"
                max="200000"
              />
              <small className="text-muted">Min: 10.00 | Max: 200000.00</small>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={handlePlaceBet}
                disabled={submitting}
              >
                {submitting ? "⏳ Placing..." : "✅ Place Bet"}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setShowPopup(false);
                  setStake("");
                }}
              >
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS स्टाइल */}
      <style jsx>{`
        .bg-primary-yellow {
          background-color: #f5a623 !important;
        }
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .popup-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          min-width: 350px;
          max-width: 500px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }
        .popup-content h4 {
          color: #1a1a2e;
          margin-bottom: 20px;
        }
        .popup-content .form-group {
          margin-top: 15px;
        }
        .popup-content .form-group label {
          font-weight: 600;
          margin-bottom: 5px;
          display: block;
        }
        .paginationnumber {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 5px;
          cursor: pointer;
          border: 1px solid #ddd;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .paginationnumber:hover {
          background-color: #f0f0f0;
        }
        .paginationnumber.active {
          background-color: #f5a623;
          color: white;
          border-color: #f5a623;
        }
        .sohwingallentries {
          color: #6c757d;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default MarketAnalysisEventDetail;