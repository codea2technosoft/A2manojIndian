import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getSeriesHorseRacingCountryNameAll,
  getSeriesHorseRacingCountryMatchListAll,
} from "../../Server/api";
import Loader from "../../Common/Loader";
import Horserace from "../../asset/image/horse.png";
import { FaTv } from "react-icons/fa";

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
  const getCountryCode = (country) =>
    country.name || country.competitionRegion || country._id;
  const getCountryDisplayName = (country) =>
    country.name || country.competitionRegion || country._id;

const formatDisplayDate = (date) => {
  if (!date) return "N/A";

  let d;

  // Date object / timestamp
  if (date instanceof Date || typeof date === "number") {
    d = new Date(date);
  }

  // String date
  else if (typeof date === "string") {
    let value = date.trim();

    // DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = value.match(
      /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/
    );

    if (dmyMatch) {
      const [, day, month, year] = dmyMatch;

      d = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
    } else {
      // ISO, YYYY-MM-DD, YYYY-MM-DD HH:mm:ss, etc.
      d = new Date(value.replace(" ", "T"));
    }
  }

  if (!d || isNaN(d.getTime())) {
    return "N/A";
  }

  const day = d.getDate();

  const suffix =
    day > 3 && day < 21
      ? "th"
      : ["th", "st", "nd", "rd"][day % 10] || "th";

  const month = d.toLocaleString("en-US", {
    month: "short",
  });

  return `${day}${suffix} ${month}`;
};


  // ✅ Handle Race Time Click - Navigate to new page with both event_id and market_id
  const handleRaceTimeClick = (match, dataTime) => {
    // dataTime has { time, marketid }
    navigate(`/race-detail/${match.event_id}/${dataTime.marketid}`, {
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

  const countryNames = {
    AU: "AUS",
    ZA: "RSA",
    FR: "FRA",
    GB: "UK",
    IE: "IRE",
    US: "USA",
    NZ: "NZ",
  };

  const getCountryName = (code) => countryNames[code] || code;

  // if (loading) {
  //   return (
  //     <div className="card">
  //       <div className="card-body text-center">
  //         <Loader />
  //         <p className="mt-2">Loading Games...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-body">
          <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
            <h3 className="sport card-title py-0 mb-0 d-flex align-items-center gap-2 text-uppercase">
              <img className="sportIcon" src={Horserace} alt="Horse Racing" />
              Horse Racing
            </h3>
          </div>

          {countries.length > 0 && (
            <div className="country-tabs">
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

          {/* ✅ Matches List */}
          {loading ? (
            <div className="card table_loader">
              <div className="card-body text-center py-5">
                <Loader />
              </div>
            </div>
          ) : matchesLoading ? (
            <div className="card table_loader">
              <div className="text-center py-5">
                <Loader />
                {/* <p>Loading matches...</p> */}
              </div>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No matches found</h5>
            </div>
          ) : (
            <div className="matches-list">
              {matches.map((match) => {
                const dataTimes = match.datatimes || [];

                return (
                  <div key={match._id || match.event_id} className="horse">
                    {/* ✅ Venue Name + Date */}
                    <div className="match-card d-flex gap-1 align-items-center mb-1">
                      <h5 className="event_name mb-0">
                        <FaTv className="my_badge tv" />
                        {match.name || match.venue || "N/A"}
                      </h5>
                      <span className="event_date">
                        ({getCountryName(activeCountry)})
                      </span>
                      <span className="event_date">
                        {formatDisplayDate(match.date_time || match.date)}
                      </span>
                    </div>

                    {/* ✅ Race Times as Clickable Buttons */}
                    {dataTimes.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {dataTimes.map((dt, idx) => (
                          <span
                            key={idx}
                            className="game_time"
                            // onClick={() => handleRaceTimeClick(match, dt)}

                            // onClick={() => navigate(
                            //                         `/race-detail/series_idd/${match.market_id
                            //                         }/event_id/${match.event_id}/id/${match.sport_id}}`
                            //                     )
                            //                 }
                            onClick={() =>
                              navigate(
                                `/race-detail/series_idd/${match.market_id}/event_id/${match.event_id}/sportId/${match.sport_id}`,
                              )
                            }
                          >
                            {dt.time}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small">
                        No race times available
                      </p>
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
