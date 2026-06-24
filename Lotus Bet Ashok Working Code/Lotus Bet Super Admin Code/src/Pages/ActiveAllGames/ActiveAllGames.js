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
  const [oddsDataMap, setOddsDataMap] = useState({});

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

  // Get current sport data safely
  const currentSport = sportData[sportId] || { name: "Sports", image: null };
  const sportName = currentSport.name || "Sports";
  const sportImage = currentSport.image || null;

  // Check if sport is Cricket (sport_id = "4")
  const isCricket = sportId === "4";
  setInterval(() => {
    fetchOddsData();
  }, 10000);
  // Fetch odds data for all events
  const fetchOddsData = async (events) => {
    try {
      // Collect all market IDs
      const marketIds = events
        .filter((event) => event.market_id)
        .map((event) => event.market_id)
        .join(",");

      if (!marketIds) return;

      const oddsUrl = `https://cricketapinew.shyammatka.co.in/get-match-odds-list?id=${marketIds}&sport_id=${sportId}`;
      console.log("Fetching odds from:", oddsUrl);

      const response = await axios.get(oddsUrl);
      console.log("Odds Response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        const oddsMap = {};
        response.data.forEach((market) => {
          if (market.marketId && market.runners && market.runners.length > 0) {
            const runners = market.runners;
            const oddsData = [];

            // Get first 2 runners for odds
            runners.forEach((runner, index) => {
              if (runner.ex) {
                const backPrice =
                  runner.ex.availableToBack &&
                  runner.ex.availableToBack.length > 0
                    ? runner.ex.availableToBack[0].price
                    : null;
                const layPrice =
                  runner.ex.availableToLay &&
                  runner.ex.availableToLay.length > 0
                    ? runner.ex.availableToLay[0].price
                    : null;

                oddsData.push({
                  back: backPrice,
                  lay: layPrice,
                });
              }
            });

            oddsMap[market.marketId] = oddsData;
          }
        });
        setOddsDataMap(oddsMap);
      }
    } catch (error) {
      console.error("Error fetching odds data:", error);
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllActiveGames(parseInt(sportId));
      console.log("API Response:", response);

      setApiResponse(response.data);

      if (response.data && response.data.success) {
        const gamesData = response.data.data || [];
        setGames(gamesData);
        setError("");

        // Fetch odds for all events
        const allEvents = gamesData.flatMap((series) => series.events || []);
        if (allEvents.length > 0) {
          await fetchOddsData(allEvents);
        }
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

  const handleEventClick = (eventId, seriesId) => {
    const eventParam = eventId || "null";
    const seriesParam = seriesId || "null";
    navigate(
      `/viewmatch-fancy/series_idd/${seriesParam}/event_id/${eventParam}`,
    );
  };

  const toggleGameStatus = async (eventId, currentStatus, e) => {
    e.stopPropagation();

    const action = currentStatus === 0 ? "lock" : "unlock";
    const confirmMessage =
      currentStatus === 0
        ? "ARE YOU SURE?\nThis Event Will Be Locked For Down-Line!"
        : "ARE YOU SURE?\nThis Event Will Be Unlocked For Down-Line!";

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

      const url = `${process.env.REACT_APP_API_URL}/events/${eventId}/toggle-status`;
      console.log("Toggling status for event:", eventId);
      console.log("URL:", url);

      const response = await axios.patch(
        url,
        { eventId: eventId },
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
    <div className="active_all_game">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="card">
        <div className="card-header bg-primary-yellow p-2 text-white d-flex justify-content-between align-items-center">
          <h3 className="sport card-title mb-0 d-flex align-items-center gap-2">
            {sportImage && (
              <img className="sportIcon" src={sportImage} alt={sportName} />
            )}
            {sportName}
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
                          const eventId = event.event_id;
                          const seriesId =
                            series.series_id || event.series_id || null;
                          const isLocked = event.status === 0;

                          // Get odds for this event's market
                          const eventOdds = oddsDataMap[event.market_id] || [];

                          // Create 6 boxes: [back1] [lay1] [-] [-] [back2] [lay2]
                          const oddsDisplay = [];

                          // Box 1: Runner 1 Back
                          if (
                            eventOdds.length > 0 &&
                            eventOdds[0].back !== null
                          ) {
                            oddsDisplay.push(eventOdds[0].back);
                          } else {
                            oddsDisplay.push(null);
                          }

                          // Box 2: Runner 1 Lay
                          if (
                            eventOdds.length > 0 &&
                            eventOdds[0].lay !== null
                          ) {
                            oddsDisplay.push(eventOdds[0].lay);
                          } else {
                            oddsDisplay.push(null);
                          }

                          // Box 3: NULL
                          oddsDisplay.push(null);

                          // Box 4: NULL
                          oddsDisplay.push(null);

                          // Box 5: Runner 2 Back
                          if (
                            eventOdds.length > 1 &&
                            eventOdds[1].back !== null
                          ) {
                            oddsDisplay.push(eventOdds[1].back);
                          } else {
                            oddsDisplay.push(null);
                          }

                          // Box 6: Runner 2 Lay
                          if (
                            eventOdds.length > 1 &&
                            eventOdds[1].lay !== null
                          ) {
                            oddsDisplay.push(eventOdds[1].lay);
                          } else {
                            oddsDisplay.push(null);
                          }

                          return (
                            <tr
                              key={eventId || eventIndex}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handleEventClick(eventId, seriesId)
                              }
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
                                          event._id,
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
                                      {updating === event._id ? (
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
                                    {/* Only show FANCY badge for Cricket (sport_id = "4") */}
                                    {isCricket && (
                                      <span className="my_badge fancy_badge">
                                        FANCY
                                      </span>
                                    )}
                                    <FaTv className="my_badge tv" />
                                  </div>
                                </div>
                              </td>
                              <td
                                className="py-0 box_padding px-0"
                                style={{ padding: "2px" }}
                              >
                                <div className="odds_btns_div">
                                  {oddsDisplay.map((value, index) => (
                                    <div className={`odds_btn`} key={index}>
                                      <button
                                        className={`${index % 2 === 0 ? "back" : "lay"}`}
                                      >
                                        {value !== null ? value : "-"}
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
                        No active events found for {sportName}
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
