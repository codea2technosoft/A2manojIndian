import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getSeriesHorseRacingCountryNameAll,
  getSeriesHorseRacingCountryMatchListAll,
} from "../../Server/api";
import Loader from "../../Common/Loader";
import Horserace from '../../asset/image/football.png'

const HorseRacing = () => {
  const navigate = useNavigate();  
  const { adminId } = useParams();

  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [activeCountry, setActiveCountry] = useState("");
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  // ✅ Fetch Countries
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await getSeriesHorseRacingCountryNameAll({
        sport_id: "7",
      });
      console.log("Countries Response:", response);

      if (response.data && response.data.success) {
        const data = response.data.data || [];
        setCountries(data);
        if (data.length > 0) {
          const firstCountryCode = data[0].name; // "AU", "FR", etc.
          setActiveCountry(firstCountryCode);
          fetchMatches(firstCountryCode);
        }
      } else {
        toast.error(response.data?.message || "Failed to fetch countries");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Matches by Country
  const fetchMatches = async (countryCode) => {
    try {
      setMatchesLoading(true);
      const response = await getSeriesHorseRacingCountryMatchListAll({
        sport_id: "7",
        country_code: countryCode,
      });
      console.log("Matches Response:", response);

      if (response.data && response.data.success) {
        // ✅ Actual response data array
        const data = response.data.data || [];
        setMatches(data);
      } else {
        toast.error(response.data?.message || "Failed to fetch matches");
        setMatches([]);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to fetch matches");
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  // ✅ Handle Country Tab Click
  const handleCountryClick = (countryCode) => {
    setActiveCountry(countryCode);
    fetchMatches(countryCode);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // ✅ Helpers
  const getCountryCode = (country) => country.name || country.competitionRegion || country._id;
  const getCountryDisplayName = (country) => country.name || country.competitionRegion || country._id;

  // ✅ Format date from "07/07/2026, 03:49:00 pm" or similar
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "-";
    try {
      // If it's already in readable format, just remove time part
      if (dateString.includes(",")) {
        const parts = dateString.split(",");
        return parts[0].trim(); // "07/07/2026"
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ✅ Handle Race Time Click
  const handleRaceTimeClick = (match, dataTime) => {
    // dataTime has { time, marketid }
    navigate(`/horse-racing-market/${dataTime.marketid}`, {
      state: {
        payload: {
          event_id: match.event_id,
          market_id: dataTime.marketid,
          sport_id: "7",
          country_code: activeCountry,
          venue: match.name,
          race_time: dataTime.time,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <Loader />
          <p className="mt-2">Loading horse racing data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">
            <img className="sportIcon" src={Horserace} alt="Horse Racing" />Horse Racing</h3>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* ✅ Country Tabs */}
          {countries.length > 0 && (
            <div className="country-tabs mb-4">
              <ul className="nav nav-tabs">
                {countries.map((country) => {
                  const code = getCountryCode(country);
                  const displayName = getCountryDisplayName(country);
                  return (
                    <li className="nav-item" key={country._id || code}>
                      <button
                        className={`nav-link ${activeCountry === code ? "active" : ""}`}
                        onClick={() => handleCountryClick(code)}
                      >
                        {displayName}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* ✅ Matches List - Layout like image */}
          {matchesLoading ? (
            <div className="text-center py-5">
              <Loader />
              <p>Loading matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No matches found for this country</h5>
            </div>
          ) : (
            <div className="matches-list">
              {matches.map((match) => {
                // ✅ datatimes array se times extract karo
                const dataTimes = match.datatimes || [];

                return (
                  <div
                    key={match._id || match.event_id}
                    className="match-card mb-3 p-3 border rounded"
                  >
                    {/* ✅ Venue Name + Date */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-0 fw-bold">
                        {match.name || match.venue || "N/A"}
                      </h5>
                      <span className="text-muted small">
                        {formatDisplayDate(match.date_time || match.date)}
                      </span>
                    </div>

                    {/* ✅ Race Times as Clickable Buttons */}
                    {dataTimes.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {dataTimes.map((dt, idx) => (
                          <button
                            key={idx}
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleRaceTimeClick(match, dt)}
                          >
                            {dt.time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small">No race times available</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HorseRacing;