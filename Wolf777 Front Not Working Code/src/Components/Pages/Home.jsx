import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { sliderAPI } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

    const baseUrl = process.env.REACT_APP_BACKEND_API;

  useEffect(() => {
    const matchlist = async () => {
      try {
        setMatchesLoading(true);
        setError(null);
        const sport_id = localStorage.getItem("gamesid") || 4;
        const matchUrl = `${baseUrl}/series-ids-index?sport_id=${sport_id}`;
        const sliderUrl = `${baseUrl}/sliders`;
        const sliderRes = await fetch(sliderUrl);
        const sliderData = await sliderRes.json();
        if (sliderData.success) {
          const images = sliderData.data.map(slide =>
            slide.image.replace(/\\/g, "/")
          );
          setSliderImages(images);
        }
        const matchRes = await fetch(matchUrl);
        const matchData = await matchRes.json();
        if (matchData.success) {
          setMatches(matchData.data || []);
        } else {
          setError("Failed to fetch matches");
        }
      } catch (err) {
        setError("Error fetching matches: " + err.message);
        console.error(err);
      } finally {
        setMatchesLoading(false);
        setLoading(false);
      }
    };
    matchlist();
  }, [baseUrl]);

  const { inPlayMatches, upcomingMatches } = useMemo(() => {
    const inPlay = [];
    const upcoming = [];

    matches.forEach(match => {
      if ((match)) {
        inPlay.push(match);
      } else {
        upcoming.push(match);
      }
    });

    return { inPlayMatches: inPlay, upcomingMatches: upcoming };
  }, [matches]);

  const handleMatchClick = (series_idd, event_id, e) => {
    e.preventDefault();

    if (!series_idd || !event_id) {
      console.error("Invalid navigation parameters:", { series_idd, event_id });
      return;
    }
    navigate(`/cricket/series_idd/${series_idd}/event_id/${event_id}`);
    localStorage.setItem("event_id", event_id);

    // 🔔 notify other components (same tab)
    window.dispatchEvent(new Event("eventIdUpdated"));

  };
  const formatMatchName = (match) => {
    if (match.teams && match.teams.length >= 2) {
      return `${match.teams[0]} vs ${match.teams[1]}`;
    }
    return match.match_name || "Match";
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
const token = localStorage.getItem("accessToken");
  if (loading) {
    return (
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
    );
  }

  // Common table component - Show all matches
  const GameTable = ({ gameName }) => (
    <Link className="text-decoration-none"   style={{ pointerEvents: token ? "auto" : "none", opacity: token }}
>
      <div className="cricketbettingalldesign new_design_we P-2">
        <div className="headericricet">
          <div className="image_cricketnew">
            <img src={require("../../assets/images/cricketicon.png")} alt="Cricketicon" />
          </div>
          <h3>Cricket</h3>
        </div>
        <div style={{ marginBottom: "10px" }}>
          {matchesLoading ? (
            <div className="matches-loader">
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
          ) : (
            <>
              {/* In-Play Matches Section */}
              {inPlayMatches.length > 0 && (
                <div className="in-play-section">
                  <div className="inplay-header">
                    <span className="status-dot"></span>
                  </div>

                  {inPlayMatches.map((match) => {
                    // ❌ market_id null / undefined / empty → kuch bhi render mat karo
                    if (!match.market_id) return null;
                    const matchName = formatMatchName(match);
                    const seriesName = match.series_name || "";
                    return (
                      <div
                        className="bet_tablearea bgnewcolorgradient new_design_we exchange in-play-match"
                        key={match._id || match.event_id}
                      >
                        <div
                          className="team_name d-flex inplayhomepa"
                          onClick={(e) =>
                            handleMatchClick(
                              match.market_id,
                              match.event_id,
                              e
                            )
                          }
                        >
                          <div className="d-flex align-items-center flex-direction-mobile">
                            <div>
                              <a
                                className="matchNameSky"
                                style={{ display: "inline-block", cursor: "pointer" }}
                              >
                                {match.name}
                              </a>
                              {seriesName && (
                                <div
                                  className="series-name"
                                  style={{
                                    fontSize: "10px",
                                    color: "#fff",
                                    marginBottom: "0px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {seriesName}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="date_match_new">
                              <CiCalendarDate className="text-white" />
                              <span>{match.date_time}</span>
                            </div>
                            <div className="date_match_new">
                              {match.open_status === 1 ? (
                                <span className="status-badge status-live menucate">
                                  <span className="status-dot"></span>
                                  <span className="status-text">CRICKET</span>
                                </span>
                              ) : (
                                <span className="status-badge status-upcoming ">
                                  <span className="status-dot"></span>
                                  <span className="status-text">UPCOMING</span>
                                </span>
                              )}
                            </div>
                            <div className="btn-col menucate">
                              <span className="game-fancy position-relative">BM</span>
                              <span className="game-sp position-relative">F</span>
                            </div>
                          </div>
                        </div>

                        {/* Show odds if available */}

                        {match.odds && (
                          <div className="odds-section">
                            {/* odds UI */}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}




              {/* No Data Found */}
              {inPlayMatches.length === 0 && upcomingMatches.length === 0 && !matchesLoading && (
                <div className="no-data-found">
                  <img
                    src={require("../../assets/images/nodata.webp")}
                    alt="No data"
                    style={{ width: "100px", opacity: 0.5 }}
                  />
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
          {/* {sliderImages.map((img, idx) => ( */}
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
        <div className="content">
          <GameTable gameName="cricket" />
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </section>
  );
}