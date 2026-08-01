import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../../User/Toast";
import { getAllActiveGames } from "../../Server/game.service";
import { FaLockOpen, FaPlayCircle, FaTv } from "react-icons/fa";
import cricket from "../../asset/image/cricket.png";
import football from "../../asset/image/football.png";
import tennis from "../../asset/image/tennis.png";

function ActiveAllGames() {
  const { sportId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showRawData, setShowRawData] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // const sportNames = {
  //   "4": "Cricket",
  //   "1": "Football",
  //   "2": "Tennis"
  // };

  const oddsData = [
    { back: 2.54, lay: 2.58 },
    { back: 4.2, lay: 4.3 },
    { back: 2.68, lay: 2.7 },
  ];

  const sportData = {
    4: {
      name: "Cricket",
      image: cricket,
    },
    1: {
      name: "Football",
      image: football,
    },
    2: {
      name: "Tennis",
      image: tennis,
    },
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllActiveGames(parseInt(sportId));
      console.log("API Response:", response);

      setApiResponse(response.data);

      if (response.data && response.data.success) {
        // Data is already grouped by series from API
        setGames(response.data.data || []);
        setError("");
      } else {
        const errorMsg = response.data?.message || "Failed to fetch games";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to fetch games";
      setError(errorMsg);
      showToast(errorMsg, "error");
      setApiResponse(err.response?.data || { error: err.message });
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

  const handleEventClick = (eventId) => {
    // URL format: /viewmatch-fancy/series_idd/null/event_id/eventId
    const eventParam = eventId || "null";
    navigate(`/viewmatch-fancy/series_idd/null/event_id/${eventParam}`);
  };

  useEffect(() => {
    if (sportId) {
      fetchGames();
    }
  }, [sportId]);

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
      <div className="text-center mt-3">
        <div className="text-danger mb-3">
          <p>
            <strong>Error:</strong> {error}
          </p>
          <p className="text-muted small">Sport ID: {sportId}</p>
          {apiResponse && (
            <pre
              className="text-start bg-light p-2 rounded"
              style={{ fontSize: "12px", maxHeight: "200px", overflow: "auto" }}
            >
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          )}
        </div>
        <button className="btn btn-primary" onClick={fetchGames}>
          Retry
        </button>
      </div>
    );

  return (
    <div className="mt-3">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
          <h3 className="sport card-title mb-0 d-flex align-items-center gap-2">
            <img
              className="sportIcon"
              src={sportData[sportId]?.image}
              alt={sportData[sportId]?.name}
            />
            {sportData[sportId]?.name || "Sports"}
          </h3>
          {/* <span className="badge bg-light text-dark">
            Total: {games.reduce((acc, series) => acc + (series.events?.length || 0), 0)} Events
          </span> */}
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <tbody>
                {games.length > 0 ? (
                  games.map((series, seriesIndex) => (
                    <React.Fragment key={series.series_id || seriesIndex}>
                      {/* Series Header - Like your image reference */}
                      <tr className="heading1">
                        <td colSpan="4">{series.series_name || "Other"}</td>
                      </tr>

                      {/* Events in this series */}
                      {series.events &&
                        series.events.map((event, eventIndex) => (
                          <tr
                            key={event._id || event.event_id || eventIndex}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEventClick(event.event_id)}
                          >
                            <td
                              className="event_id py-0"
                              style={{ width: "65%", padding: "0px 15px" }}
                            >
                              <div className="d-flex justify-content-between gap-1">
                                <div className="d-flex justify-content-between align-items-center gap-1">
                                  <FaLockOpen className="lockIcon" />
                                  <div>
                                    <div className="event_name">
                                      <FaPlayCircle className="play_btn" />{" "}
                                      {event.name || "N/A"}
                                    </div>
                                    <span className="d-block time">
                                      ({event.date_time || "N/A"})
                                    </span>
                                  </div>
                                </div>
                                <div className="other_option">
                                  <span className="my_badge bm_badge">BM</span>
                                  <span className="my_badge fancy_badge">
                                    FANCY
                                  </span>
                                  <FaTv className="my_badge tv" />
                                </div>
                              </div>
                            </td>
                            <td
                              className="py-0 box_padding px-0"
                              style={{ padding: "2px" }}
                            >
                              <div className="odds_btns_div">
                                {oddsData.map((item, index) => (
                                  <div className="odds_btn" key={index}>
                                    <button className="back">
                                      {item.back}
                                    </button>
                                    <button className="lay">{item.lay}</button>
                                  </div>
                                ))}
                              </div>
                            </td>
                            {/* <td style={{ width: '15%', padding: '10px 15px' }}>
                            <span className={event.is_inplay === 1 ? "badge bg-success" : "badge bg-secondary"}>
                              {event.is_inplay === 1 ? "In Play" : "Upcoming"}
                            </span>
                          </td>
                          <td style={{ width: '15%', padding: '10px 15px' }}>
                            <span className={event.is_completed === 1 ? "badge bg-danger" : "badge bg-primary"}>
                              {event.is_completed === 1 ? "Completed" : "Active"}
                            </span>
                          </td> */}
                          </tr>
                        ))}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <div className="text-muted">
                        No active events found for{" "}
                        {sportData[sportId] || "this sport"}
                      </div>
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
    </div>
  );
}

export default ActiveAllGames;
