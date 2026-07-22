import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../../User/Toast";
import { getAllActiveGames } from "../../Server/game.service";
import { FaLockOpen, FaLock, FaPlayCircle, FaTv } from "react-icons/fa";
import cricket from "../../asset/image/cricket.png";
import football from "../../asset/image/football.png";
import tennis from "../../asset/image/tennis.png";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../Common/Loader";

function ActiveAllGames() {
  const { sportId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [showRawData, setShowRawData] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [updating, setUpdating] = useState(null);

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
    const eventParam = eventId || "null";
    navigate(`/viewmatch-fancy/series_idd/null/event_id/${eventParam}`);
  };

  const toggleGameStatus = async (eventId, currentStatus, e) => {
    e.stopPropagation(); // Prevent event click when clicking lock button

    // status: 0 = locked, 1 = open/unlocked
    const action = currentStatus === 0 ? "lock" : "unlock";
    const confirmMessage =
      currentStatus === 0
        ? "ARE YOU SURE?\nThis Event Will Be Locked For Down-Line!"
        : "ARE YOU SURE?\nThis Event Will Be Unlocked For Down-Line!";

    // Sweet Alert confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, do it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setUpdating(eventId);

      // Correct URL format with event ID in path
      const url = `${process.env.REACT_APP_API_URL}/events/${eventId}/toggle-status`;
      console.log("Toggling status for event:", eventId);
      console.log("URL:", url);

      const response = await axios.patch(
        url,
        { eventId: eventId }, // Payload with eventId
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        },
      );

      console.log("Toggle Status Response:", response);

      if (response.data && response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Event ${action}ed successfully!`,
          timer: 2000,
          showConfirmButton: false,
        });
        // Refresh the games list to get updated status
        await fetchGames();
      } else {
        const errorMsg = response.data?.message || `Failed to ${action} event`;
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: errorMsg,
        });
      }
    } catch (err) {
      console.error("Error toggling game status:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to toggle status";
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
      });
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    if (sportId) {
      fetchGames();
    }
  }, [sportId]);

  if (loading)
    return (
      <div className="card">
        <div className="card-header flex-wrap-mobile bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
          <h5 className="card-title mb-0">Chip Summary</h5>
        </div>
        <div className="text-center mt-3">
          <p className="mt-2">Loading games...</p>
          <Loader />
        </div>
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
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <tbody>
                {games.length > 0 ? (
                  games.map((series, seriesIndex) => (
                    <React.Fragment key={series.series_id || seriesIndex}>
                      {/* Series Header */}
                      <tr className="heading1">
                        <td colSpan="4">{series.series_name || "Other"}</td>
                      </tr>

                      {/* Events in this series */}
                      {series.events &&
                        series.events.map((event, eventIndex) => {
                          // Use _id from API response for event ID
                          const eventId = event._id || event.event_id;
                          // status: 0 = locked, 1 = open
                          const isLocked = event.status === 0;

                          return (
                            <tr
                              key={eventId || eventIndex}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleEventClick(eventId)}
                            >
                              <td
                                className="event_id py-0"
                                style={{ width: "65%", padding: "0px 15px" }}
                              >
                                <div className="d-flex justify-content-between gap-1">
                                  <div className="d-flex justify-content-between align-items-center gap-1">
                                    {/* Lock/Unlock Icon with click handler */}
                                    <div
                                      onClick={(e) =>
                                        toggleGameStatus(
                                          eventId,
                                          event.status || 0,
                                          e,
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                      title={
                                        isLocked
                                          ? "Click to unlock"
                                          : "Click to lock"
                                      }
                                    >
                                      {updating === eventId ? (
                                        <span
                                          className="spinner-border spinner-border-sm text-primary"
                                          role="status"
                                        >
                                          <span className="visually-hidden">
                                            Loading...
                                          </span>
                                        </span>
                                      ) : isLocked ? (
                                        <FaLock
                                          className="lockIcon locked"
                                          style={{ color: "red" }}
                                        />
                                      ) : (
                                        <FaLockOpen
                                          className="lockIcon unlocked"
                                          style={{ color: "green" }}
                                        />
                                      )}
                                    </div>
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
                                    <span className="my_badge bm_badge">
                                      BM
                                    </span>
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
                                      <button className="lay">
                                        {item.lay}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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

      {/* CSS for lock/unlock styling */}
      <style jsx>{`
        .lockIcon {
          font-size: 18px;
          margin-right: 8px;
          transition: all 0.3s ease;
        }
        .lockIcon.locked {
          color: red !important;
        }
        .lockIcon.unlocked {
          color: green !important;
        }
        .lockIcon:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}

export default ActiveAllGames;
