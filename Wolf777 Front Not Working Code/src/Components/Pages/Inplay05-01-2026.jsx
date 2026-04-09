import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("inplay");
  const [series_id, setSelectedseries_id] = useState(
    localStorage.getItem("series_id") || ""
  );
  const [Matches, setMatches] = useState([]);
  const [matchOdds, setMatchOdds] = useState({});
  const [loading, setLoading] = useState(true);
  const [highlightedMarkets, setHighlightedMarkets] = useState({});
  
  // Use ref to track active market IDs
  const activeMarketIdsRef = useRef([]);

  // const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

    const baseUrl = process.env.REACT_APP_BACKEND_API;


  const ODDS_API_URL = "https://cricketfancylive.shyammatka.co.in/get-match-odds-list";

  useEffect(() => {
    const updateSport = () => {
      setSelectedseries_id(localStorage.getItem("series_id"));
    };
    window.addEventListener("series_id", updateSport);
    return () => window.removeEventListener("series_id", updateSport);
  }, []);

  // Define handleTabClick function
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
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
    if (marketIds.length === 0) return;

    try {
      const oddsData = await fetchOddsData(marketIds);
      setMatchOdds(prev => ({
        ...prev,
        ...oddsData
      }));
    } catch (err) {
      console.error("Error updating odds:", err);
    }
  }, [fetchOddsData]);

  // Main match list function
  const matchlist = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/series-ids-index?sport_id=4`);

      if (response.data.statusCode === 200) {
        const matchesData = response.data.data.matches || [];
        setMatches(matchesData);
        setError("");

        // Extract market IDs
        const marketIds = [];
        matchesData.forEach(match => {
          if (match.series && Array.isArray(match.series)) {
            match.series.forEach(series => {
              if (series.market_id && !marketIds.includes(series.market_id)) {
                marketIds.push(series.market_id);
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
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, fetchOddsData]);

  // useEffect for initial load and periodic match list update
  useEffect(() => {
    matchlist();
    // Match list को हर 30 सेकंड में अपडेट करें
    const matchInterval = setInterval(matchlist, 30004440);
    
    return () => {
      clearInterval(matchInterval);
    };
  }, [matchlist]);

  // useEffect for 1-second odds updates
  useEffect(() => {
    // Start 1-second interval for odds updates
    const oddsInterval = setInterval(updateOdds, 500000);
    
    return () => {
      clearInterval(oddsInterval);
    };
  }, [updateOdds]);

  // Format date time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Time TBD";
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Check if match is in play
  const isMatchInPlay = (matchDate) => {
    if (!matchDate) return false;
    const now = new Date();
    const matchDateTime = new Date(matchDate);
    if (isNaN(matchDateTime.getTime())) return false;

    const startWindow = new Date(matchDateTime.getTime() - 30 * 60 * 1000);
    const endWindow = new Date(matchDateTime.getTime() + 3 * 60 * 60 * 1000);
    return now >= startWindow && now <= endWindow;
  };

  // Filter matches based on active tab
 // Filter matches based on active tab
const filteredMatches = useMemo(() => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const filtered = Matches.flatMap((match) =>
    (match.series || []).filter((seriesItem) => {
      if (!seriesItem || !seriesItem.date_time) return false;

      const matchDate = new Date(seriesItem.date_time);
      if (isNaN(matchDate.getTime())) return false;

      // Check if market is CLOSED
      const marketId = seriesItem.market_id;
      const marketData = matchOdds[marketId];
      if (marketData?.status === "CLOSED") {
        return false; // Skip CLOSED markets
      }

      switch (activeTab) {
        case "inplay":
          return isMatchInPlay(seriesItem.date_time);
        case "today":
          return matchDate >= today && matchDate < tomorrow;
        case "tomorrow":
          return matchDate >= tomorrow && matchDate < dayAfterTomorrow;
        default:
          return false;
      }
    })
  );

  // Update active market IDs based on filtered matches
  const filteredMarketIds = filtered.map(item => item.market_id).filter(id => id);
  activeMarketIdsRef.current = filteredMarketIds;

  return filtered;
}, [Matches, activeTab, matchOdds]); // Added matchOdds to dependency array

  // Get best back and lay prices for a runner
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

  return (
    <section className="home_page">
      <div className="inplay_design">
        <div className="">
          <div className="d-flex tabs_design">
            <div className={`inplay_tabs ${activeTab === "inplay" ? "active" : ""}`}>
              <button onClick={() => handleTabClick("inplay")}>In-Play</button>
            </div>
            <div className={`inplay_tabs ${activeTab === "today" ? "active" : ""}`}>
              <button onClick={() => handleTabClick("today")}>Today</button>
            </div>
            <div className={`inplay_tabs ${activeTab === "tomorrow" ? "active" : ""}`}>
              <button onClick={() => handleTabClick("tomorrow")}>Tomorrow</button>
            </div>
          </div>

          <div className="tabs_inplay_content">
            {loading ? (
              <div className="loader-container" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}>
                <div className="loader-6">
                  <div className="set-one">
                    <div className="circle"></div>
                    <div className="circle circle1"></div>
                  </div>
                  <div className="set-two">
                    <div className="circle circle2"></div>
                    <div className="circle circle3"></div>
                  </div>
                </div>
              </div>
            ) : filteredMatches.length === 0 ? (
              <p className="text-center mt-3">No matches found.</p>
            ) : (
              <>
                <div className="cricketbettingalldesign">
                  <div>
                    {filteredMatches.map((seriesItem, index) => {
                      const marketId = seriesItem.market_id;
                      const odds = matchOdds[marketId];

                      // Get prices for both runners
                      const runner1 = odds?.runners?.[0];
                      const runner2 = odds?.runners?.[1];

                      const prices1 = getRunnerPrices(runner1);
                      const prices2 = getRunnerPrices(runner2);
                      
                      return (
                        <div
                          className="bet_tablearea exchange"
                          key={seriesItem._id || index}
                        >
                          <div className="team_name d-flex">
                            <div
                              className="d-flex gap-md-2 align-items-md-center align-items-start flex-col-mobile"
                              onClick={() => {
                                if (activeTab === "tomorrow") {
                                  toast.info("Market Closed");
                                  return;
                                }

                                const series_idd = seriesItem.market_id;
                                const event_id = seriesItem.event_id;

                                navigate(`/cricket/series_idd/${series_idd}/event_id/${event_id}`);
                                    window.location.reload();

                              }}
                            >
                              <a
                                className="matchNameSky"
                                style={{
                                  display: "inline-block",
                                  cursor: "pointer",
                                }}
                              >
                                {seriesItem.name || "No Name"}
                              </a>

                              <span>
                                <a>
                                  {activeTab === "inplay" &&
                                    isMatchInPlay(seriesItem.date_time) ? (
                                    <span className="commonbtn bdr-r0">
                                      In-Play
                                    </span>
                                  ) : (
                                    <span className="commonbtn bdr-r0">
                                      {formatDateTime(seriesItem.date_time)}
                                    </span>
                                  )}
                                </a>
                              </span>
                            </div>

                            <div className="btn-col">
                              <span className="game-fancy">F</span>
                              <span className="game-sp">S</span>
                            </div>
                          </div>

                          <div className="odds-row d-desk">
                            <table tabIndex="0">
                              <tbody>
                                <tr>
                                  <td>
                                    <span onClick={() =>
                                      handleOddsClick(
                                        prices1.back !== "-" ? parseFloat(prices1.back) : null,
                                        "back",
                                        odds,
                                        "Team 1",
                                        marketId,
                                        0
                                      )
                                    }
                                      style={{
                                        cursor: odds?.status === "SUSPENDED" ? "not-allowed" : "pointer",
                                        background: highlightedMarkets[`${marketId}-0-back`]
                                          ? "#f8e71c"
                                          : "",
                                        fontWeight: highlightedMarkets[`${marketId}-0-back`]
                                          ? "bold"
                                          : "700",
                                      }}>
                                      {prices1.back}
                                    </span>
                                    <span onClick={() =>
                                      handleOddsClick(
                                        prices1.lay !== "-" ? parseFloat(prices1.lay) : null,
                                        "lay",
                                        odds,
                                        "Team 1",
                                        marketId,
                                        0
                                      )
                                    }
                                      style={{
                                        cursor: odds?.status === "SUSPENDED" ? "not-allowed" : "pointer",
                                        background: highlightedMarkets[`${marketId}-0-lay`]
                                          ? "#26f1f8"
                                          : "",
                                        padding: "2px 5px",
                                        fontWeight: highlightedMarkets[`${marketId}-0-lay`]
                                          ? "bold"
                                          : "700",
                                      }}>
                                      {prices1.lay}
                                    </span>
                                  </td>
                                  <td>
                                    <span>-</span>
                                    <span>-</span>
                                  </td>
                                  <td>
                                    <span
                                      onClick={() =>
                                        handleOddsClick(
                                          prices2.back !== "-" ? parseFloat(prices2.back) : null,
                                          "back",
                                          odds,
                                          "Team 2",
                                          marketId,
                                          1
                                        )
                                      }
                                      style={{
                                        cursor: odds?.status === "SUSPENDED"
                                          ? "not-allowed"
                                          : "pointer",
                                        background: highlightedMarkets[
                                          `${marketId}-1-back`
                                        ]
                                          ? "#f8e71c"
                                          : "",
                                        fontWeight: highlightedMarkets[
                                          `${marketId}-1-back`
                                        ]
                                          ? "bold"
                                          : "700",
                                      }}>
                                      {prices2.back}
                                    </span>
                                    <span
                                      onClick={() =>
                                        handleOddsClick(
                                          prices2.lay !== "-" ? parseFloat(prices2.lay) : null,
                                          "lay",
                                          odds,
                                          "Team 2",
                                          marketId,
                                          1
                                        )
                                      }
                                      style={{
                                        cursor: odds?.status === "SUSPENDED"
                                          ? "not-allowed"
                                          : "pointer",
                                        background: highlightedMarkets[
                                          `${marketId}-1-lay`
                                        ]
                                          ? "#26f1f8"
                                          : "",
                                        fontWeight: highlightedMarkets[
                                          `${marketId}-1-lay`
                                        ]
                                          ? "bold"
                                          : "700",
                                      }}
                                    >
                                      {prices2.lay}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
}