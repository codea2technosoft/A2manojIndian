import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Toast from "../../User/Toast";
import { getAllActiveGames } from "../../Server/game.service";
import {
  FaLockOpen,
  FaLock,
  FaPlayCircle,
  FaTv,
  FaArrowDown,
  FaArrowUp,
  FaSyncAlt,
} from "react-icons/fa";
import cricket from "../../asset/image/cricket.png";
import football from "../../asset/image/football.png";
import tennis from "../../asset/image/tennis.png";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../../Common/Loader";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
import { getDashboardClientList, getAllEvents } from "../../Server/api";

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
  const [open, setOpen] = useState(true);

  const [plData, setPlData] = useState({
    running_pl: 0,
    lifetime_pl: 0,
    upline_pl: 0,
  });
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);
  const pollingIntervalRef = useRef(null);
  const isInitialLoadDone = useRef(false);
  const [gamesLoading, setGamesLoading] = useState(false);
  const seriesId = searchParams.get("seriesId");

  const [adminProfile, setAdminProfile] = useState(null);
  const [role2Count, setRole2Count] = useState(0);
  const [counts, setCounts] = useState({});
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

  const [cardValues, setCardValues] = useState({
    balance: 0,
    running_pl: 0,
    upline_pl: 0,
    lifetime_pl: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    is_completed: "",
    is_inplay: "",
  });

  const [apiData, setApiData] = useState({
    inplay: [],
    competition_wise: [],
    date_wise: [],
  });

  const getSafeValue = (key, defaultValue = 0) => {
    try {
      const value = localStorage.getItem(key);
      if (value === null || value === undefined || value === "") {
        return defaultValue;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  };

  const getCardConfig = () => {
    const coins = getSafeValue("coins", 0);
    const runningPl = getSafeValue("running_pl", 0);
    const uplinePl = getSafeValue("upline_pl", 0);
    const lifetimePl = getSafeValue("lifetime_pl", 0);

    return [
      {
        label: "BALANCE",
        value: coins,
        valueIcon: "",
        icon: <FaSyncAlt />,
        bg: "#6394c9",
      },
      // {
      //   label: "UPLINE PL",
      //   value: uplinePl,
      //   valueIcon: uplinePl >= 0 ? <FaCircleArrowUp /> : <FaCircleArrowDown />,
      //   icon: <FaSyncAlt />,
      //   bg: uplinePl >= 0 ? "#28a745" : "#fa0e0e",
      // },
      // {
      //   label: "RUNNING PL",
      //   value: runningPl,
      //   valueIcon: runningPl >= 0 ? <FaCircleArrowUp /> : <FaCircleArrowDown />,
      //   icon: <FaSyncAlt />,
      //   bg: runningPl >= 0 ? "#28a745" : "#fa0e0e",
      // },
      // {
      //   label: "LIFETIME PL",
      //   value: lifetimePl,
      //   valueIcon:
      //     lifetimePl >= 0 ? <FaCircleArrowUp /> : <FaCircleArrowDown />,
      //   icon: <FaSyncAlt />,
      //   bg: "#6b00ff",
      // },

      {
        label: "RUNNING PL",
        value: plData?.running_pl || 0,
        valueIcon:
          (plData?.running_pl || 0) >= 0 ? (
            <FaCircleArrowUp />
          ) : (
            <FaCircleArrowDown />
          ),
        icon: <FaSyncAlt />,
        bg: (plData?.running_pl || 0) >= 0 ? "#28a745" : "#fa0e0e",
      },
      {
        label: "LIFETIME PL",
        value: plData?.lifetime_pl || 0,
        valueIcon:
          (plData?.lifetime_pl || 0) >= 0 ? (
            <FaCircleArrowUp />
          ) : (
            <FaCircleArrowDown />
          ),
        icon: <FaSyncAlt />,
        bg: "#6b00ff",
      },
    ];
  };
  const cardConfig = getCardConfig();

  const admin_id = localStorage.getItem("admin_id");

  const updateCardValues = () => {
    const coins = getSafeValue("coins", 0);
    const runningPl = getSafeValue("running_pl", 0);
    const uplinePl = getSafeValue("upline_pl", 0);
    const lifetimePl = getSafeValue("lifetime_pl", 0);

    setCardValues({
      balance: coins,
      running_pl: runningPl,
      upline_pl: uplinePl,
      lifetime_pl: lifetimePl,
    });
  };

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 100,
    totalItems: 0,
    totalPages: 1,
  });

  const loadAllData = async () => {
    if (isFetchingRef.current) {
      console.log("⏳ Load already in progress, skipping...");
      return;
    }

    try {
      isFetchingRef.current = true;

      console.log("📡 Loading data...", {
        sportId,
        seriesId,
        isInitial: !isInitialLoadDone.current,
        timestamp: new Date().toISOString(),
      });

      const [dashboardRes, eventsRes] = await Promise.all([
        getDashboardClientList(admin_id),

        getAllEvents(sportId, seriesId, {
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          search: filters.search,
          status: 1,
          is_completed: filters.is_completed,
          is_inplay: filters.is_inplay,
        }),
      ]);

      if (!isMountedRef.current) return;

      // ✅ Process dashboard data
      if (dashboardRes?.data?.success) {
        const adminDetails = dashboardRes.data.data.admin_details || {};
        const plData = dashboardRes.data.data.pl_data || {};

        const coins = adminDetails.coins || 0;
        const runningPl = adminDetails.running_pl || 0;
        const uplinePl = adminDetails.upline_pl || 0;
        const lifetimePl = adminDetails.lifetime_pl || 0;

        localStorage.setItem("coins", coins.toString());
        localStorage.setItem("running_pl", runningPl.toString());
        localStorage.setItem("upline_pl", uplinePl.toString());
        localStorage.setItem("lifetime_pl", lifetimePl.toString());

        setAdminProfile(adminDetails);
        setPlData(plData);
        setRole2Count(dashboardRes.data.data.role_2_count || 0);
        setCounts(dashboardRes.data.data.counts || {});
        updateCardValues();

        console.log("✅ Dashboard Data Loaded:", {
          coins,
          runningPl,
          uplinePl,
          lifetimePl,
          admin_id: adminDetails.admin_id,
        });
      }

      if (eventsRes?.data?.success) {
        const data = eventsRes.data.data;

        setApiData({
          inplay: data.inplay || [],
          competition_wise: data.competition_wise || [],
          date_wise: data.date_wise || [],
        });

        if (eventsRes.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            currentPage: eventsRes.data.pagination.page || 1,
            itemsPerPage: eventsRes.data.pagination.limit || 10,
            totalItems: eventsRes.data.pagination.total || 0,
            totalPages: eventsRes.data.pagination.totalPages || 1,
          }));
        }

        setError("");
      }

      isInitialLoadDone.current = true;
      console.log("✅ Data loaded successfully", {
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      if (isMountedRef.current) {
        isFetchingRef.current = false;
        setLoading(false);
        setGamesLoading(false);
      }
    }
  };

  if (!isInitialLoadDone.current) {
    loadAllData();
  }

  pollingIntervalRef.current = setInterval(() => {
    if (!isFetchingRef.current && isInitialLoadDone.current) {
      console.log("🔄 Polling API every 10 seconds...");
      loadAllData();
    } else if (isFetchingRef.current) {
      console.log("⏳ Skipping poll - API call already in progress");
    }
  }, 10000);

  // Get current sport data safely
  const currentSport = sportData[sportId] || { name: "Sports", image: null };
  const sportName = currentSport.name || "Sports";
  const sportImage = currentSport.image || null;

  // Check if sport is Cricket (sport_id = "4")
  const isCricket = sportId === "4";
  // setInterval(() => {
  //   fetchOddsData();
  // }, 500);
  useEffect(() => {
    if (sportId) {
      fetchGames();
    }
  }, [sportId]);

  // Naya useEffect - Odds polling with longer interval
  useEffect(() => {
    if (games.length === 0) return;

    const allEvents = games.flatMap((series) => series.events || []);
    if (allEvents.length === 0) return;

    // Pehli baar fetch karo
    fetchOddsData(allEvents);

    // Ab 10 seconds ke interval par fetch karo (500ms nahi!)
    const intervalId = setInterval(() => {
      const currentEvents = games.flatMap((series) => series.events || []);
      if (currentEvents.length > 0) {
        fetchOddsData(currentEvents);
      }
    }, 10000); // 10 seconds - smooth performance!

    // Cleanup
    return () => clearInterval(intervalId);
  }, [games]); // games pe depend karega

  // Fetch odds data for all events
  const fetchOddsData = async (events) => {
    try {
      // Collect all market IDs
      const marketIds = events
        .filter((event) => event.market_id)
        .map((event) => event.market_id)
        .join(",");

      if (!marketIds) return;

      const oddsUrl = `https://cricketfancylive.shyammatka.co.in/get-match-odds-list?id=${marketIds}&sport_id=${sportId}`;
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

  const handleEventClick = (eventId, seriesId, marketId) => {
    // /  alert(marketId);
    const eventParam = eventId || "null";
    const seriesParam = seriesId || "null";

    navigate(
      // `/viewmatch-fancy/series_idd/${seriesParam}/event_id/${eventParam}`,
      `/viewmatch-fancy/series_idd/${marketId}/event_id/${eventParam}/sport_id/${sportId}`,
    );
  };

  const toggleGameStatus = async (eventId, currentStatus, e) => {
    e.stopPropagation();

    const action = currentStatus === 0 ? "unlock" : "lock";
    const confirmMessage =
      currentStatus === 0
        ? "ARE YOU SURE?\nThis Event Will Be Unlocked For Down-Line!"
        : "ARE YOU SURE?\nThis Event Will Be Locked For Down-Line!";

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

  const formatMatchDate = (date) => {
    if (!date) return "N/A";

    // Example: 31/03/2025, 06:30:00 pm
    const [datePart, timePart] = date.split(", ");

    if (!datePart || !timePart) return "N/A";

    const [day, month, year] = datePart.split("/").map(Number);

    let [time, meridian] = timePart.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (meridian.toLowerCase() === "pm" && hours !== 12) {
      hours += 12;
    }
    if (meridian.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    const d = new Date(year, month - 1, day, hours, minutes);

    const formattedDay = d.toLocaleString("en-GB", { day: "2-digit" });
    const formattedMonth = d.toLocaleString("en-GB", { month: "short" });
    const formattedTime = d.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${formattedDay} ${formattedMonth} ${formattedTime}`;
  };

  useEffect(() => {
    if (sportId) {
      fetchGames();
    }
  }, [sportId]);

  return (
    <div className="active_all_game">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <button onClick={() => setOpen(!open)} className="btn btn_collpse w-100">
        {open ? <FaArrowDown /> : <FaArrowUp />}
      </button>

      <div className={`content  ${open ? "open" : ""}`}>
        <div className="row g-2 mt-0">
          {cardConfig.map((item, index) => (
            <div key={index} className="col-6 col-sm-6 col-md-4">
              <div
                className="card_dashboard shadow-sm"
                style={{
                  background: item.bg,
                }}
                onClick={() => {
                  if (item.route) {
                    navigate(item.route);
                  }
                }}
              >
                <div className="card-body d-flex justify-content-between">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <h5>{item.value}</h5>
                        <h6>
                          {item.valueIcon && (
                            <span className="d-flex">{item.valueIcon}</span>
                          )}
                        </h6>
                      </div>
                      <h6>{item.label}</h6>
                    </div>
                  </div>
                  <div className="card-icon">
                    <span>{item.icon}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="card-header bgHeader d-flex bg-primary-yellow justify-content-between align-items-center">
            <h3 className="sport card-title py-0 mb-0 d-flex align-items-center gap-2 text-uppercase">
              {sportImage && (
                <img className="sportIcon" src={sportImage} alt={sportName} />
              )}
              {sportName}
            </h3>
          </div>

          <div className="table-responsive sport-section">
            <table className="table table-bordered mb-0">
              <tbody>
                {loading ? (
                  <tr>
                    <td className="table_loader">
                      <div className="text-center py-5">
                        {/* <span className="mt-2">Loading games...</span> */}
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <div className="text-center mt-3">
                    <div className="text-danger mb-3">
                      <p>
                        <strong>Error:</strong> {error}
                      </p>
                      <p className="text-muted small">Sport ID: {sportId}</p>
                      {apiResponse && (
                        <pre
                          className="text-start bg-light p-2 rounded"
                          style={{
                            fontSize: "12px",
                            maxHeight: "200px",
                            overflow: "auto",
                          }}
                        >
                          {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                      )}
                    </div>
                    <button className="btn btn-primary" onClick={fetchGames}>
                      Retry
                    </button>
                  </div>
                ) : games.length > 0 ? (
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
                                handleEventClick(
                                  eventId,
                                  seriesId,
                                  event.market_id,
                                )
                              }
                            >
                              <td
                                className="event_id w-100"
                                // style={{ width: "65%", padding: "0px 15px" }}
                              >
                                <div className="row">
                                  <div className="col-md-5">
                                    <div className="d-flex justify-content-start align-items-center gap-1">
                                      <div
                                        className="ms-1"
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
                                      <div className="matchName">
                                        <div className="event_name">
                                          <div className="game_name_main">
                                            <FaPlayCircle className="play_btn" />{" "}
                                            {event.name || "N/A"}
                                          </div>
                                          <span className="d-block time">
                                            (
                                            {formatMatchDate(
                                              event.date_time || "N/A",
                                            )}
                                            )
                                          </span>
                                        </div>

                                        {Number(event.total_exposure) !== 0 && (
                                          <span
                                            className="d-block time"
                                            style={{
                                              color:
                                                Number(event.total_exposure) > 0
                                                  ? "green"
                                                  : "red",
                                              fontWeight: "600",
                                            }}
                                          >
                                            (
                                            {Number(event.total_exposure) > 0
                                              ? `+${event.total_exposure}`
                                              : event.total_exposure}
                                            )
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-2">
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
                                  <div className="col-md-5">
                                    <div className="odds_btns_div">
                                      <div className="odds_btn">
                                        {oddsDisplay.map((value, index) => (
                                          <button
                                            key={index}
                                            className={`${index % 2 === 0 ? "back" : "lay"}`}
                                          >
                                            {value !== null ? value : "-"}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              {/* <td
                                className="py-0 box_padding px-0"
                                style={{ padding: "2px" }}
                              ></td> */}
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
