// Sidebar.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
// import { FaTrophy, FaExclamationCircle } from "react-icons/fa";
import {  FaExclamationCircle } from "react-icons/fa";
import "../../assets/scss/Sidebar.scss";
import { useNavigate } from "react-router-dom";
import { useSidebar } from '../context/SidebarContext';
import { IoClose } from "react-icons/io5";

const Sidebar = () => {
  const [openSport, setOpenSport] = useState(null);
  const [games, setGames] = useState([]);
  const [matches, setMatches] = useState([]);
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use sidebar context
  const { isMobileOpen, closeSidebar } = useSidebar();

  // const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

    const baseUrl = process.env.REACT_APP_BACKEND_API;


  // 🔹 handle sport click = fetch + toggle

  const handleSportClickdata = async (sport) => {

    // Toggle dropdown open/close

    localStorage.setItem("selectedSport", sport.name);
    localStorage.setItem("gamesid", sport.id);
    localStorage.setItem("series_id", sport.series_id);
    localStorage.setItem("sport_id", sport.sport_id);
    window.dispatchEvent(new Event("sportChanged"));

  }
  const handleSportClick = async (sport) => {
    navigate("/");

    // Toggle dropdown open/close
    const isSameSport = openSport === sport.name;
    setOpenSport(isSameSport ? null : sport.name);

    // Save selected sport
    localStorage.setItem("selectedSport", sport.name);
    localStorage.setItem("gamesid", sport.id);
    localStorage.setItem("series_id", sport.series_id);
    localStorage.setItem("sport_id", sport.sport_id);
    window.dispatchEvent(new Event("sportChanged"));

    // If clicking same sport again → hide matches
    if (isSameSport) {
      return;
    }

    // Fetch matches for the selected sport
    try {
      const response = await axios.get(`${baseUrl}/match-list?sport_id=${sport.id}`);
      if (response.data.success) {
        const matchData = response.data.data || [];
        setMatches(matchData);
        // setError("");

        // ✅ Save first match's series_id if available
        if (matchData.length > 0) {
          localStorage.setItem("series_idd_pistTime", matchData[0].series_id);
        }
      } else {
        // setError(response.data.message || "Failed to fetch matches");
        setMatches([]);
      }
    } catch (err) {
      // setError(err.message || "Something went wrong");
      setMatches([]);
    }
  };

  const handleMatchClick = async (match) => {
    // Save match data
    localStorage.setItem("series_id", match.series_id);
    localStorage.setItem("sport_id", match.sport_id);
    localStorage.setItem("isHomeClicked", "false");

    // Trigger events
    window.dispatchEvent(new Event("series_id"));
    window.dispatchEvent(new Event("bet-updated"));

    // Close mobile sidebar when match is selected
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  // 🔹 Close sidebar function for cross button
  const handleCloseSidebar = () => {
    closeSidebar();
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
          // setError(response.data.message || "Failed to fetch games");
        }
      } catch (err) {
        console.error(err);
        // setError("Server error or network issue");
      } finally {
        setLoading(false);
      }
    };
    fetchActiveGames();
  }, [baseUrl]);

  if (loading) return <div className="sidebar">Loading games...</div>;

  return (
    <div className={`sidebar ${isMobileOpen ? 'mobile-sidebar--open' : ''}`}>
      {/* Header with close button */}
      <div className="sidebar-header">
        <h3 className="d-flex">Sports  <IoClose
          className="close-icon ms-auto"
          onClick={handleCloseSidebar}
          style={{ cursor: "pointer" }}
        /></h3>

      </div>

      <ul className="sports-list">
        {games.map((sport) => (
          <li
            key={sport.name}
            className={`sport-item ${openSport === sport.name ? "active" : ""}`}
          >
            <div
              className="sport-header"
              onClick={(e) => {
                e.stopPropagation();
                handleSportClick(sport);
              }}
            >
              <span style={{ cursor: "pointer" }}>
                {sport.name}
              </span>
              <span className="arrow">
                {openSport === sport.name ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {/* 🔹 Matches Dropdown for this sport */}
            {openSport === sport.name && (
              <div className="matches-dropdown">
                {matches && matches.length > 0 ? (
                  <ul className="matches-list">
                    {matches.map((match) => (
                      <li
                        key={match._id}
                        className="match-item"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMatchClick(match);
                        }}
                      >
                        <div className="match-left"
                          onClick={(e) => {
                            handleSportClickdata(sport);
                          }}
                        >
                          <span
                            className="match-name"
                            onClick={() => navigate("/")}
                            style={{ cursor: "pointer" }}
                          >
                            {match.name}
                          </span>
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;