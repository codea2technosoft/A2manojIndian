import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Football from "./Football";
import casino from "../../assets/images/casino.jpg";
import Cricketicon from "../../assets/images/cricketicon.png";
import Tennis from "./Tennis";
import { Link } from "react-router-dom";
import { sliderAPI, settingsAPI } from "../../service/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import nodata from "../../assets/images/nodata.webp";
import { MdPushPin } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";

export default function Home() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabsdesign, setTabsdesign] = useState("");
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [series, setseries] = useState("");
  const [apidata, setapidata] = useState(false);
  const [balance, setBalance] = useState(0);
  const [selectedSport, setSelectedSport] = useState(
    localStorage.getItem("selectedSport") || ""
  );

  const [matchesLoading, setMatchesLoading] = useState(false);
  const [pinnedMatches, setPinnedMatches] = useState([]);
  const [pinnedMatchesLoading, setPinnedMatchesLoading] = useState(false);

  // New states for odds
  const [matchOdds, setMatchOdds] = useState({});
  const [highlightedMarkets, setHighlightedMarkets] = useState({});

  // Use ref to track active market IDs
  const activeMarketIdsRef = useRef([]);

  const navigate = useNavigate();
  const isHomeClickeddata = localStorage.getItem("isHomeClicked");

  // const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


    const baseUrl = process.env.REACT_APP_BACKEND_API;


  const ODDS_API_URL = "https://cricketfancylive.shyammatka.co.in/get-match-odds-list";

  const [notice, setNotice] = useState(null);
  const fetchNotice = async () => {
    try {
      const response = await axios.get(`${baseUrl}/manage-notice`);

      if (response.data.success) {
        setNotice(response.data.data.description); // 👈 yahin API set ho rahi hai
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  useEffect(() => {
    fetchNotice();
  }, []);

  // Format date and time - UPDATED VERSION
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "TBD";

    const date = new Date(dateTimeString);
    const now = new Date();

    // Check if it's today
    const isToday = date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    // Check if it's tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();

    if (isToday) {
      // ✅ Today: Show "Today" + Time
      return `Today ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else if (isTomorrow) {
      // ✅ Tomorrow: Show "Tomorrow" + Time
      return `Tomorrow ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else {
      // ✅ Other days: Show Full Date + Time
      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const user_id = localStorage.getItem("user_id");

  // Check if match is in play - UPDATED VERSION
  const isMatchInPlay = (matchDate) => {
    if (!matchDate) return false;
    const now = new Date();
    const matchDateTime = new Date(matchDate);

    // Match is in play if current time is within 30 minutes before to 3 hours after match start
    const startWindow = new Date(matchDateTime.getTime() - 30 * 60 * 1000);
    const endWindow = new Date(matchDateTime.getTime() + 3 * 60 * 60 * 1000);

    return now >= startWindow && now <= endWindow;
  };

  // Handle odds click
  const handleOddsClick = (price, type, marketData, teamName, marketId, runnerIndex) => {
    if (marketData?.status === "SUSPENDED") {
      toast.info("Market is suspended");
      return;
    }

    // Highlight the clicked market
    const highlightKey = `${marketId}-${runnerIndex}-${type}`;
    setHighlightedMarkets(prev => ({
      ...prev,
      [highlightKey]: true
    }));

    // Remove highlight after 500ms
    setTimeout(() => {
      setHighlightedMarkets(prev => ({
        ...prev,
        [highlightKey]: false
      }));
    }, 500);
  };

  // Fetch odds data - हर 1 सेकंड में कॉल होगा
  const fetchOddsData = useCallback(async (marketIds) => {
    if (!marketIds || marketIds.length === 0) return {};

    try {
      const response = await axios.get(`${ODDS_API_URL}?id=${marketIds.join(',')}`);
      if (response.data && Array.isArray(response.data)) {
        const oddsData = {};
        response.data.forEach(market => {
          if (market && market.marketId) {
            oddsData[market.marketId] = {
              marketId: market.marketId,
              status: market.status,
              runners: market.runners || [],
              totalMatched: market.totalMatched,
              lastUpdate: new Date().toISOString()
            };
          }
        });
        return oddsData;
      }
    } catch (err) {
      console.error("Error fetching odds:", err);
    }
    return {};
  }, []);

  // Function to update odds every 1 second
  const updateOdds = useCallback(async () => {
    const marketIds = activeMarketIdsRef.current;

    // Filter out already closed markets
    const activeMarketIds = marketIds.filter(marketId => {
      const marketData = matchOdds[marketId];
      return !marketData || marketData.status !== "CLOSED";
    });

    if (activeMarketIds.length === 0) return;

    try {
      const oddsData = await fetchOddsData(activeMarketIds);
      setMatchOdds(prev => ({
        ...prev,
        ...oddsData
      }));
    } catch (err) {
      console.error("Error updating odds:", err);
    }
  }, [fetchOddsData, matchOdds]);

  // Fetch pinned matches - wrapped in useCallback
  const fetchPinnedMatches = useCallback(async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        setPinnedMatches([]);
        return;
      }

      setPinnedMatchesLoading(true);
      const response = await axios.get(`${baseUrl}/get-user-multi-market`, {
        params: {
          user_id: user_id,
          sport_id: 4,
        },
      });

      if (response.data.statusCode === 200 || response.data.success) {
        const data = response.data.data || response.data;

        let matches = [];

        if (Array.isArray(data.matches)) {
          matches = data.matches;
        } else if (Array.isArray(data)) {
          matches = data;
        } else if (data && typeof data === "object") {
          matches = [data];
        }

        const transformedPinnedMatches = matches.map((match) => ({
          match_id: match.match_id || match._id,
          name: match.name || match.match_name || "No Name",
          date_time: match.date_time || match.match_date || match.created_at,
          market_id: match.market_id || "",
          event_id: match.event_id || match.match_id,
          sport_id: match.sport_id || 4,
          isPinned: true, // Add this flag to easily check
        }));

        setPinnedMatches(transformedPinnedMatches);
      } else {
        setPinnedMatches([]);
      }
    } catch (error) {
      console.error("Error fetching pinned matches:", error);
      setPinnedMatches([]);
    } finally {
      setPinnedMatchesLoading(false);
    }
  }, [baseUrl]);

  // Enhanced handlePinMatch function with optimistic updates
  const handlePinMatch = async (eventId, seriesItem, matchName, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        return;
      }

      const currentMatch = {
        match_id: eventId,
        name: matchName || seriesItem?.name || "Match",
        date_time: seriesItem?.date_time || new Date().toISOString(),
        market_id: seriesItem?.market_id || "",
        event_id: eventId,
        sport_id: 4,
      };

      const isPinned = pinnedMatches.some((pm) => pm.event_id === eventId);

      // Optimistic update - immediately update UI
      if (isPinned) {
        // Remove from pinned matches
        setPinnedMatches((prev) =>
          prev.filter((pm) => pm.event_id !== eventId)
        );
      } else {
        // Add to pinned matches
        setPinnedMatches((prev) => [
          ...prev,
          { ...currentMatch, isPinned: true },
        ]);
      }

      let response;
      if (isPinned) {
        // UNPIN - Send DELETE request
        response = await axios.delete(`${baseUrl}/multi-market-remove`, {
          data: {
            match_id: eventId,
            user_id: user_id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        // PIN - Send POST request
        response = await axios.post(`${baseUrl}/multi-market`, {
          match_id: eventId,
          user_id: user_id,
          sport_id: 4,
          match_name: matchName || seriesItem?.name || "Match",
          match_date: seriesItem?.date_time || new Date().toISOString(),
        });
      }

      if (!response.data.success) {
        // If server request failed, revert optimistic update
        await fetchPinnedMatches(); // Fetch actual state from server
      }
    } catch (error) {
      console.error("Error pinning/unpinning match:", error);
      // Revert optimistic update on error
      await fetchPinnedMatches(); // Fetch actual state from server
    }
  };

  // Get match name
  const getMatchName = (match, seriesItem) => {
    return seriesItem?.name || match.name || "No Name";
  };

  // Get event ID
  const getEventId = (match, seriesItem) => {
    return seriesItem?.event_id || match.event_id || match._id;
  };

  // Check if match is pinned
  const isMatchPinned = (eventId) => {
    return pinnedMatches.some((pm) => pm.event_id === eventId);
  };

  // Get best back and lay prices for a runner
  const getRunnerPrices = (runner) => {
    if (!runner) return { back: "-", lay: "-" };

    const bestBack = runner.ex?.availableToBack?.[0]?.price || runner.lastPriceTraded;
    const bestLay = runner.ex?.availableToLay?.[0]?.price || runner.lastPriceTraded;

    // Simple formatting - just convert to string
    return {
      back: bestBack ? bestBack.toString() : "-",
      lay: bestLay ? bestLay.toString() : "-"
    };
  };

  // Check if market is active
  const isMarketActive = useCallback((marketId) => {
    const marketData = matchOdds[marketId];
    if (!marketData) return true; // If no data yet, assume active

    // Don't show if market is CLOSED
    return marketData.status !== "CLOSED";
  }, [matchOdds]);

  // Fetch all data
  const fetchData = async () => {
    try {
      const sliderResponse = await axios.get(`${baseUrl}/sliders`);

      if (sliderResponse.data.success) {
        const images = sliderResponse.data.data.map((slide) =>
          slide.image.replace(/\\/g, "/")
        );
        setSliderImages(images);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch active games
  const fetchActiveGames = async () => {
    try {
      const response = await axios.get(`${baseUrl}/game-list`);
      if (response.data.success && response.data.data) {
        const activeGames = response.data.data.filter((g) => g.Active);
        setGames(activeGames);

        if (selectedSport) {
          const sportExists = activeGames.some(
            (game) => game.name.toLowerCase() === selectedSport.toLowerCase()
          );
          if (sportExists) setTabsdesign(selectedSport);
          else if (activeGames.length > 0) setTabsdesign(activeGames[0].name);
        } else if (activeGames.length > 0) setTabsdesign(activeGames[0].name);
      } else {
        setError(response.data.message || "Failed to fetch games");
      }
    } catch (err) {
      setError("Server error or network issue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([fetchData(), fetchActiveGames()]);
    };
    initializeData();
  }, [baseUrl]);

  useEffect(() => {
    const updateSport = () => {
      const newSport = localStorage.getItem("selectedSport");
      setSelectedSport(newSport);
      if (newSport) setTabsdesign(newSport);
    };
    window.addEventListener("sportChanged", updateSport);
    return () => window.removeEventListener("sportChanged", updateSport);
  }, []);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      fetchPinnedMatches();
    }
  }, [fetchPinnedMatches]);

  const handleTabChange = (sportName, game) => {
    setTabsdesign(sportName);
    localStorage.setItem("selectedSport", sportName);
    localStorage.setItem("gamesid", game.id);
    setSelectedSport(sportName);
  };

  const [series_id, setSelectedseries_id] = useState(
    localStorage.getItem("series_id") || ""
  );
  const [Matches, setMatches] = useState([]);
  const [isHomeClicked, setIsHomeClicked] = useState(
    localStorage.getItem("isHomeClicked") === "true"
  );

  useEffect(() => {
    const updateSport = () => {
      const newSport = localStorage.getItem("series_id");
      setSelectedseries_id(newSport);
    };
    window.addEventListener("series_id", updateSport);
    return () => window.removeEventListener("series_id", updateSport);
  }, []);

  // Match fetching logic - FIXED VERSION
  useEffect(() => {
    const matchlist = async () => {
      // setMatchesLoading(true);

      const sport_id = localStorage.getItem("gamesid");
      const isHomeClicked = localStorage.getItem("isHomeClicked");

      let url;

      // Check if isHomeClicked is "false" or undefined/empty
      if (isHomeClicked === "false") {
        url = `${baseUrl}/series-ids?sport_id=${sport_id || 4
          }&series_id=${series_id}`;
        setapidata(true);
      } else {
        // This will fetch ALL matches (both in-play and upcoming)
        url = `${baseUrl}/series-ids-index?sport_id=${sport_id || 4}`;
        setapidata(false);
      }

      try {
        const response = await axios.get(url);

        if (response.data.statusCode === 200) {
          let data = response.data.data.matches || [];
          let series = response?.data?.data?.matches?.[0]?.series ?? [];
          setseries(series);

          const inPlay = [];
          const others = [];

          data.forEach((match) => {
            if (match.series && match.series.length > 0) {
              const inPlaySeries = match.series.filter((m) =>
                isMatchInPlay(m.date_time)
              );
              const otherSeries = match.series.filter(
                (m) => !isMatchInPlay(m.date_time)
              );

              if (inPlaySeries.length > 0)
                inPlay.push({ ...match, series: inPlaySeries });

              if (otherSeries.length > 0)
                others.push({ ...match, series: otherSeries });
            } else {
              others.push(match);
            }
          });

          const sortedMatches = [...inPlay, ...others];
          setMatches(sortedMatches);
          setError("");

          // Extract market IDs for odds fetching
          const marketIds = [];
          sortedMatches.forEach((match) => {
            if (match.series && Array.isArray(match.series)) {
              match.series.forEach((seriesItem) => {
                if (seriesItem.market_id && !marketIds.includes(seriesItem.market_id)) {
                  marketIds.push(seriesItem.market_id);
                }
              });
            }
          });

          // Update active market IDs ref
          activeMarketIdsRef.current = marketIds;

          // Fetch initial odds data
          if (marketIds.length > 0) {
            const oddsData = await fetchOddsData(marketIds);
            setMatchOdds(oddsData);
          }
        } else {
          setError(response.data.message || "Failed to fetch matches");
          setMatches([]);
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
        setMatches([]);
      } finally {
        // setMatchesLoading(false);
      }
    };

    let timer1, timer2;

    // Always fetch matches when component mounts or dependencies change
    timer1 = setTimeout(matchlist, 0);

    // Add a second fetch to ensure data is loaded
    timer2 = setTimeout(matchlist, 100);

    // Auto-refresh every 30 seconds
    const interval = setInterval(matchlist, 3000000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, [
    series_id,
    localStorage.getItem("isHomeClicked"),
    localStorage.getItem("gamesid"),
  ]);

  // Separate in-play and upcoming matches with market filtering
  const [inPlayMatches, setInPlayMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);

  useEffect(() => {
    const inPlay = [];
    const upcoming = [];

    Matches.forEach((match) => {
      if (match.series && match.series.length > 0) {
        match.series.forEach((seriesItem) => {
          const marketId = seriesItem.market_id;

          // Check if market is active (not CLOSED)
          if (!isMarketActive(marketId)) {
            return; // Skip CLOSED markets
          }

          if (isMatchInPlay(seriesItem.date_time)) {
            inPlay.push({
              ...match,
              series: [seriesItem],
            });
          } else {
            upcoming.push({
              ...match,
              series: [seriesItem],
            });
          }
        });
      }
    });

    setInPlayMatches(inPlay);
    setUpcomingMatches(upcoming);
  }, [Matches, matchOdds]);

  // Start 1-second odds updates
  useEffect(() => {
    // Start 1-second interval for odds updates
    const oddsInterval = setInterval(updateOdds, 500000);

    return () => {
      clearInterval(oddsInterval);
    };
  }, [updateOdds]);

  // Enhanced PinIcon component with proper state handling
  const PinIcon = ({ eventId, seriesItem, matchName }) => {
    const [isPinned, setIsPinned] = useState(() => isMatchPinned(eventId));
    const [isProcessing, setIsProcessing] = useState(false);

    // Update isPinned when pinnedMatches changes
    useEffect(() => {
      setIsPinned(isMatchPinned(eventId));
    }, [pinnedMatches, eventId]);

    const handleClick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isProcessing) return;

      setIsProcessing(true);
      const newPinnedState = !isPinned;

      // Optimistic update
      setIsPinned(newPinnedState);

      try {
        await handlePinMatch(eventId, seriesItem, matchName, e);
      } catch (error) {
        // Revert on error
        setIsPinned(!newPinnedState);
      } finally {
        setIsProcessing(false);
      }
    };

    return (
      <div
        className="d-flex align-items-center pin"
        onClick={handleClick}
        title={isPinned ? "Remove from multi-market" : "Add to multi-market"}
        style={{
          color: isPinned ? "#4CAF50" : "#666",
          fontSize: "18px",
          cursor: isProcessing ? "not-allowed" : "pointer",
          opacity: isProcessing ? 0.6 : 1,
        }}
      >
        <MdPushPin />
        {isProcessing && (
          <span className="ms-1" style={{ fontSize: "10px" }}>
            ...
          </span>
        )}
      </div>
    );
  };

  // Handle match click with null checking
  const handleMatchClick = (series_idd, event_id, e) => {
    e.preventDefault();

    // Check if both series_idd and event_id are valid (not null or undefined)
    if (!series_idd || series_idd === "null" || !event_id || event_id === "null") {
      console.error("Invalid navigation parameters:", { series_idd, event_id });
      // toast.error("Cannot navigate: Missing match data");
      // return;
    }

    // Navigate only if both parameters are valid
    navigate(`/cricket/series_idd/${series_idd}/event_id/${event_id}`);
    localStorage.setItem("event_id", event_id);
    // window.location.reload();

  };

  if (loading)
    return (
      <div className="loader-6">
        <div className="set-one">
          <div className="circle "></div>
          <div className="circle circle1"></div>
        </div>
        <div className="set-two">
          <div className="circle circle2"></div>
          <div className="circle circle3"></div>
        </div>
      </div>
    );

  // Common table component - Show all matches
  const GameTable = ({ gameName }) => (
    <Link className="text-decoration-none">
      <div className="cricketbettingalldesign new_design_we P-2">
        <div className="headericricet">
          <div className="image_cricketnew">
            <img src={Cricketicon} alt="Cricketicon" />
          </div>
          <h3>  Cricket</h3>
        </div>
        <div style={{ marginBottom: "10px" }}>
          {/* Loading State */}
          {matchesLoading ? (
            <div className="matches-loader">
              <div className="loader-6">
                <div className="set-one">
                  <div className="circle "></div>
                  <div className="circle circle1"></div>
                </div>
                <div className="set-two">
                  <div className="circle circle2"></div>
                  <div className="circle circle3"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* In-Play Matches Section */}
              {inPlayMatches.length > 0 && (
                <div className="in-play-section">
                  {inPlayMatches.map((match) =>
                    match.series && match.series.length > 0
                      ? match.series.map((seriesItem) => {
                        const matchName = getMatchName(match, seriesItem);
                        const eventId = getEventId(match, seriesItem);
                        const marketId = seriesItem.market_id;
                        const odds = matchOdds[marketId];

                        // Get series name
                        const seriesName = seriesItem.series_name || match.series_name || "";

                        // Get prices for both runners
                        const runner1 = odds?.runners?.[0];
                        const runner2 = odds?.runners?.[1];

                        const prices1 = getRunnerPrices(runner1);
                        const prices2 = getRunnerPrices(runner2);

                        return (
                          <div
                            className="bet_tablearea bgnewcolorgradient new_design_we exchange in-play-match"
                            key={`${match._id}-${seriesItem._id}`}
                          >
                            <div className="team_name d-flex inplayhomepa">
                              <div
                                className="d-flex align-items-center flex-direction-mobile"
                                onClick={(e) => {
                                  const series_idd = seriesItem.market_id;
                                  const event_id = seriesItem.event_id || eventId;

                                  // Use the new handler with null checking
                                  handleMatchClick(series_idd, event_id, e);
                                }}
                              >
                                <div>
                                  <a
                                    className="matchNameSky"
                                    style={{
                                      display: "inline-block",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {matchName}
                                  </a>
                                  {seriesName && (
                                    <div className="series-name" style={{
                                      fontSize: "10px",
                                      color: "#fff",
                                      marginBottom: "0px",
                                      fontWeight: "500"
                                    }}>
                                      {seriesName}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="date_match_new">
                                  <CiCalendarDate className="text-white" /> <span>{formatDateTime(seriesItem.date_time)}</span>
                                </div>
                                <div className="date_match_new">

                                  {isMatchInPlay(seriesItem.date_time) ? (
                                    <span className="status-badge status-live">
                                      <span className="status-dot" />
                                      <span className="status-text">INPLAY</span>
                                    </span>
                                  ) : (
                                    formatDateTime(seriesItem.date_time)
                                  )}
                                </div>
                                <div className="btn-col menucate">
                                  <span className="game-fancy position-relative">BM</span>
                                  <span className="game-sp position-relative">F</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                      : null
                  )}
                </div>
              )}

              {/* Upcoming Matches Section - This will show ALL upcoming matches */}
              {upcomingMatches.length > 0 && (
                <div className="upcoming-section">
                  {upcomingMatches.map((match) =>
                    match.series && match.series.length > 0
                      ? match.series.map((seriesItem) => {
                        const matchName = getMatchName(match, seriesItem);
                        const eventId = getEventId(match, seriesItem);
                        const marketId = seriesItem.market_id;
                        const odds = matchOdds[marketId];

                        // Get series name
                        const seriesName = seriesItem.series_name || match.series_name || "";

                        // Get prices for both runners
                        const runner1 = odds?.runners?.[0];
                        const runner2 = odds?.runners?.[1];

                        const prices1 = getRunnerPrices(runner1);
                        const prices2 = getRunnerPrices(runner2);

                        return (
                          <div
                            className="bet_tablearea bgnewcolorgradient new_design_we exchange in-play-match"
                            key={`${match._id}-${seriesItem._id}`}
                          >
                            <div className="team_name d-flex inplayhomepa">
                              <div className="d-flex align-items-center flex-direction-mobile"
                                onClick={(e) => {
                                  const series_idd = seriesItem.market_id;
                                  const event_id = seriesItem.event_id || eventId;

                                  // Use the new handler with null checking
                                  handleMatchClick(series_idd, event_id, e);
                                }}
                              >
                                {/* Series Name - Added above match name */}


                                <div>
                                  <a
                                    className="matchNameSky"
                                    style={{
                                      display: "inline-block",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {matchName}
                                  </a>
                                  {seriesName && (
                                    <div className="series-name" style={{
                                      fontSize: "10px",
                                      color: "#fff",
                                      fontWeight: "500"
                                    }}>
                                      {seriesName}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="date_match_new">
                                  <CiCalendarDate className="text-white" /> <span>{formatDateTime(seriesItem.date_time)}</span>
                                </div>
                                <div className="btn-col">
                                  <span className="game-fancy position-relative">F</span>
                                  <span className="game-sp position-relative">S</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                      : null
                  )}
                </div>
              )}

              {/* No Data Found */}
              {inPlayMatches.length === 0 && upcomingMatches.length === 0 && (
                <div className="nodatafound">
                  {/* <img src={nodata} alt="nodata" /> */}
                  <p>No matches available</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <section className="home_page">
      <div className="slider-container">
        <Slider {...settings}>
          {sliderImages.map((img, idx) => (
            <div key={idx} className="homepageslider">
              <img
                src={img}
                alt={`slide-${idx}`}
                className="slide-image"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="tabs_homepage">
        {/* <div className="tabsbutton">
          {games.map((game) => (
            <button
              key={game._id}
              className={`tabdesignall ${tabsdesign === game.name ? "active" : ""
                }`}
              onClick={() => {
                handleTabChange(game.name, game);
                window.dispatchEvent(new Event("bet-updated"));
              }}
            >
              {game.name.charAt(0).toUpperCase() + game.name.slice(1)}
            </button>
          ))}
        </div> */}

        <div className="content">
          {games.map(
            (game) =>
              tabsdesign === game.name && (
                <GameTable key={game._id} gameName={game.name} />
              )
          )}
        </div>
      </div>

      <ToastContainer />
    </section>
  );
}