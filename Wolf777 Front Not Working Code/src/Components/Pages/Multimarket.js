import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [Matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [matchOdds, setMatchOdds] = useState({});
    const [highlightedMarkets, setHighlightedMarkets] = useState({});

    // Use ref to track active market IDs
    const activeMarketIdsRef = useRef([]);

    // const nodeMode = process.env.NODE_ENV;
    // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

      const baseUrl = process.env.REACT_APP_BACKEND_API;


    const ODDS_API_URL = "https://cricketfancylive.shyammatka.co.in/get-match-odds-list";

    // Handle odds click
    const handleOddsClick = (price, type, marketData, teamName, marketId, runnerIndex, e) => {
        e.stopPropagation(); // Prevent match click

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

    // Fetch odds data
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

    const matchlist = useCallback(async () => {
        setLoading(true);
        const user_id = localStorage.getItem("user_id");

        try {
            const response = await axios.get(`${baseUrl}/get-user-multi-market`, {
                params: {
                    sport_id: 4,
                    user_id: user_id
                }
            });

            if (response.data.statusCode === 200) {
                const matchesData = response.data.data?.matches || [];
                setMatches(matchesData);
                setError("");

                // Extract market IDs for odds fetching
                const marketIds = matchesData
                    .map(match => match.market_id)
                    .filter(id => id && id.trim() !== "");

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
            setLoading(false);
        }
    }, [baseUrl, fetchOddsData]);

    useEffect(() => {
        matchlist();
        const interval = setInterval(matchlist, 9000);
        return () => clearInterval(interval);
    }, [matchlist]);

    // Start odds updates
    useEffect(() => {
        const oddsInterval = setInterval(updateOdds, 5000);
        return () => {
            clearInterval(oddsInterval);
        };
    }, [updateOdds]);

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "Time not set";

        const date = new Date(dateTimeString);
        if (isNaN(date.getTime())) return "Invalid date";

        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
        } else {
            return date.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
        }
    };

    // Check if match is In-Play based on is_inplay field
    const isMatchInPlay = (match) => {
        // First check the is_inplay field
        if (match.is_inplay === 1) {
            return true;
        }

        // If is_inplay is 0, check if current time is within match time window
        const now = new Date();
        const matchTime = new Date(match.date_time);

        // Match is considered in-play 30 minutes before start time and 3 hours after
        const startWindow = new Date(matchTime.getTime() - 30 * 60 * 1000);
        const endWindow = new Date(matchTime.getTime() + 3 * 60 * 60 * 1000);

        return now >= startWindow && now <= endWindow;
    };

    // Check if match is Today (excluding In-Play matches)
    const isMatchToday = (match) => {
        const matchDate = match.date_time;
        if (!matchDate) return false;

        const now = new Date();
        const matchDateTime = new Date(matchDate);
        if (isNaN(matchDateTime.getTime())) return false;

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Check if match is today AND not in-play
        const isTodayDate = matchDateTime >= today && matchDateTime < tomorrow;
        return isTodayDate && !isMatchInPlay(match);
    };

    // Check if match is Tomorrow
    const isMatchTomorrow = (match) => {
        const matchDate = match.date_time;
        if (!matchDate) return false;

        const now = new Date();
        const matchDateTime = new Date(matchDate);
        if (isNaN(matchDateTime.getTime())) return false;

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        return matchDateTime >= tomorrow && matchDateTime < dayAfterTomorrow;
    };

    // Check if match is Upcoming (beyond tomorrow)
    const isMatchUpcoming = (match) => {
        const matchDate = match.date_time;
        if (!matchDate) return false;

        const now = new Date();
        const matchDateTime = new Date(matchDate);
        if (isNaN(matchDateTime.getTime())) return false;

        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        return matchDateTime >= dayAfterTomorrow;
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

    // Sort all matches: In-Play first, then by date/time
    const sortedMatches = useMemo(() => {
        const allMatches = Array.isArray(Matches) ? Matches : [];

        // Filter out CLOSED markets
        const filteredMatches = allMatches.filter(match => {
            const marketId = match.market_id;
            return isMarketActive(marketId);
        });

        return filteredMatches.sort((a, b) => {
            const aIsInPlay = isMatchInPlay(a);
            const bIsInPlay = isMatchInPlay(b);

            // In-play matches come first
            if (aIsInPlay && !bIsInPlay) return -1;
            if (!aIsInPlay && bIsInPlay) return 1;

            // Both are either in-play or not, sort by date/time
            return new Date(a.date_time) - new Date(b.date_time);
        });
    }, [Matches, matchOdds]);

    const handleMatchClick = (match) => {
        const market_id = match.market_id || "";
        const event_id = match.event_id || "";

        // Check if match is tomorrow or upcoming
        const now = new Date();
        const matchDate = new Date(match.date_time);

        // Reset times to compare only dates
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const matchDateOnly = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());

        // Get tomorrow's date
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Check if match is tomorrow (same date as tomorrow)
        if (matchDateOnly.getTime() === tomorrow.getTime()) {
            toast.info("Market Open Tomorrow");
            return;
        }

        // Check if match is after tomorrow (future)
        if (matchDate > tomorrow) {
            toast.info("Market Closed");
            return;
        }

        if (!market_id || !event_id) {
            toast.error("Match details not available");
            return;
        }

        navigate(`/cricket/series_idd/${market_id}/event_id/${event_id}`);
            window.location.reload();

    };
    return (
        <section className="home_page">
            <div className="inplay_design">
                <div className="">
                    <div className="tabs_inplay_content">
                        {loading ? (
                            <div className="loader-container" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '200px'
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
                        ) : error ? (
                            <p className="text-center mt-3 text-danger">{error}</p>
                        ) : sortedMatches.length === 0 ? (
                            <p className="text-center mt-3">No matches found.</p>
                        ) : (
                            <div className="cricketbettingalldesign">
                                <div className="text-start-mobile">
                                    {sortedMatches.map((match, index) => {
                                        const isInPlay = isMatchInPlay(match);
                                        const marketId = match.market_id;
                                        const odds = matchOdds[marketId];

                                        // Get prices for both runners
                                        const runner1 = odds?.runners?.[0];
                                        const runner2 = odds?.runners?.[1];

                                        const prices1 = getRunnerPrices(runner1);
                                        const prices2 = getRunnerPrices(runner2);

                                        return (
                                            <div
                                                className="bet_tablearea exchange"
                                                key={match._id || match.id || index}
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => handleMatchClick(match)}
                                            >
                                                <div className="team_name d-flex">
                                                    <div className="d-flex align-items-start flex-col">
                                                        <a className="matchNameSky" style={{ display: 'inline-block' }}>
                                                            {match.name || "No Name"}
                                                        </a>
                                                        <span className="commonbtn bdr-r0"
                                                            style={{
                                                                color: isInPlay ? '#28a745' : '#6c757d',
                                                                fontSize: '12px',
                                                            }}
                                                        >
                                                            {isInPlay ? 'In-Play' : formatDateTime(match.date_time)}
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
                                                                    <span
                                                                        onClick={(e) => handleOddsClick(
                                                                            prices1.back !== "-" ? parseFloat(prices1.back) : null,
                                                                            "back",
                                                                            odds,
                                                                            "Team 1",
                                                                            marketId,
                                                                            0,
                                                                            e
                                                                        )}
                                                                        style={{
                                                                            cursor: odds?.status === "SUSPENDED" ? "not-allowed" : "pointer",
                                                                            background: highlightedMarkets[`${marketId}-0-back`]
                                                                                ? "#f8e71c"
                                                                                : "",
                                                                            fontWeight: highlightedMarkets[`${marketId}-0-back`]
                                                                                ? "bold"
                                                                                : "700",
                                                                        }}
                                                                    >
                                                                        {prices1.back}
                                                                    </span>
                                                                    <span
                                                                        onClick={(e) => handleOddsClick(
                                                                            prices1.lay !== "-" ? parseFloat(prices1.lay) : null,
                                                                            "lay",
                                                                            odds,
                                                                            "Team 1",
                                                                            marketId,
                                                                            0,
                                                                            e
                                                                        )}
                                                                        style={{
                                                                            cursor: odds?.status === "SUSPENDED" ? "not-allowed" : "pointer",
                                                                            background: highlightedMarkets[`${marketId}-0-lay`]
                                                                                ? "#26f1f8"
                                                                                : "",
                                                                            padding: "2px 5px",
                                                                            fontWeight: highlightedMarkets[`${marketId}-0-lay`]
                                                                                ? "bold"
                                                                                : "700",
                                                                        }}
                                                                    >
                                                                        {prices1.lay}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span>-</span>
                                                                    <span>-</span>
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        onClick={(e) => handleOddsClick(
                                                                            prices2.back !== "-" ? parseFloat(prices2.back) : null,
                                                                            "back",
                                                                            odds,
                                                                            "Team 2",
                                                                            marketId,
                                                                            1,
                                                                            e
                                                                        )}
                                                                        style={{
                                                                            cursor: odds?.status === "SUSPENDED" ? "not-allowed" : "pointer",
                                                                            background: highlightedMarkets[`${marketId}-1-back`]
                                                                                ? "#f8e71c"
                                                                                : "",
                                                                            fontWeight: highlightedMarkets[`${marketId}-1-back`]
                                                                                ? "bold"
                                                                                : "700",
                                                                        }}
                                                                    >
                                                                        {prices2.back}
                                                                    </span>
                                                                    <span
                                                                        onClick={(e) => handleOddsClick(
                                                                            prices2.lay !== "-" ? parseFloat(prices2.lay) : null,
                                                                            "lay",
                                                                            odds,
                                                                            "Team 2",
                                                                            marketId,
                                                                            1,
                                                                            e
                                                                        )}
                                                                        style={{
                                                                            cursor: odds?.status === "SUSPENDED" ? "not-allowed" : "pointer",
                                                                            background: highlightedMarkets[`${marketId}-1-lay`]
                                                                                ? "#26f1f8"
                                                                                : "",
                                                                            fontWeight: highlightedMarkets[`${marketId}-1-lay`]
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

                                                {/* Debug info - remove in production */}

                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </section>
    );
}