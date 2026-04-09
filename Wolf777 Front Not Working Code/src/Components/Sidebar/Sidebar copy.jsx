import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { FaTrophy, FaExclamationCircle } from "react-icons/fa";
import "./Sidebar.scss";

const Sidebar = () => {
  const [openSport, setOpenSport] = useState(null);
  const [games, setGames] = useState([]);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showMatches, setShowMatches] = useState(false); // 👈 toggle matches section

  const nodeMode = process.env.NODE_ENV;
  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const baseUrl =
    nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  // 🔹 handle sport click = fetch + toggle
  const handleSportClick = async (sport) => {
    // Toggle dropdown open/close
    setOpenSport(openSport === sport.name ? null : sport.name);

    // Save selected sport
    localStorage.setItem("selectedSport", sport.name);
    localStorage.setItem("gamesid", sport.id);
    localStorage.setItem("series_id", sport.series_id);
    localStorage.setItem("sport_id", sport.sport_id);
    window.dispatchEvent(new Event("sportChanged"));

    // If clicking same sport again → hide matches
    if (openSport === sport.name) {
      // setShowMatches(false);
      return;
    }

    // Fetch matches
    try {
      const response = await axios.get(`${baseUrl}/match-list?sport_id=${sport.id}`);
      if (response.data.success) {
        setMatches(response.data.data || []);
        setError("");
        setShowMatches(true); // 👈 show matches when data comes
      } else {
        setError(response.data.message || "Failed to fetch matches");
        setMatches([]);
        setShowMatches(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setMatches([]);
      setShowMatches(true);
    }
  };

  // 🔹 Fetch games list on mount
  useEffect(() => {
    const fetchActiveGames = async () => {
      try {
        const response = await axios.get(`${baseUrl}/game-list`);
        if (response.data.success && response.data.data) {
          const activeGames = response.data.data.filter((g) => g.Active);
          setGames(activeGames);
        } else {
          setError(response.data.message || "Failed to fetch games");
        }
      } catch (err) {
        console.error(err);
        setError("Server error or network issue");
      } finally {
        setLoading(false);
      }
    };
    fetchActiveGames();
  }, [baseUrl]);

  if (loading) return <div className="sidebar">Loading games...</div>;
  if (error && !showMatches) return <div className="sidebar">Error: {error}</div>;

  return (
    <div className="sidebar">
      <h3>Sports</h3>
      <ul className="sports-list">
        {games.map((sport) => (
          <li
            key={sport.name}
            className={`sport-item ${openSport === sport.name ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSportClick(sport);
            }}
          >
            <div className="sport-header">
              <span style={{ cursor: "pointer" }}>{sport.name}</span>
              <span className="arrow">
                {openSport === sport.name ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* 🔹 Toggle Matches Section */}
      {showMatches && (
        <div className="matches-section">
          <div className="matches-header">
            <FaTrophy className="icon trophy" />
            <h3>Matches</h3>
          </div>

          {matches && matches.length > 0 ? (
            <ul className="matches-list">
              {matches.map((match) => (
                <li key={match._id} className="match-item">
                  <div
                    className="match-left"
                    onClick={(e) => {
                      handleSportClick(match); // <- single match pass karein, "matches" nahi
                    }}
                  >
                    <span className="icon cricket">🏏</span>
                    <span className="match-name">{match.name}</span>
                  </div>
                </li>
              ))}
            </ul>

          ) : (
            <div className="no-matches">
              <FaExclamationCircle className="icon" />
              <p>No matches available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
