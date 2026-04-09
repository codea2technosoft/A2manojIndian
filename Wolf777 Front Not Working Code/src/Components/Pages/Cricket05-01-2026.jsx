import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from "axios";
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  Row,
  Col,
  InputGroup,
  Badge,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTv, FaExpand, FaCompress } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOutlineScoreboard } from "react-icons/md";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import "../../New.scss";
import Login from "../Pages/Login";
import { FaArrowRight } from "react-icons/fa6";
import Fakedata from "./Fakedata";
import {
  encryptData,
  decryptData,
  makeEncryptedRequest,
} from "../../utils/encryption";
import MyBets from "./Bethistory";
import Unsettledbet from "./Unsettledbet";

// Custom Notification Component
const CustomNotification = memo(({ notification, onClose }) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [notification.show]);

  if (!notification.show) return null;

  const getBackgroundColor = () => {
    switch (notification.type) {
      case "error":
        return "#dc3545";
      case "success":
        return "#28a745";
      case "warning":
        return "#ffc107";
      case "info":
        return "#17a2b8";
      default:
        return "#17a2b8";
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "error":
        return "❌";
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        padding: "15px 20px",
        borderRadius: "5px",
        color: "white",
        zIndex: 9999,
        backgroundColor: getBackgroundColor(),
        minWidth: "300px",
        maxWidth: "400px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "20px" }}>{getIcon()}</span>
        <span>{notification.message}</span>
      </div>
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "20px",
          cursor: "pointer",
          marginLeft: "10px",
          padding: "0",
          lineHeight: "1",
        }}
      >
        ×
      </button>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
});

// Custom Notification Hook
const useNotification = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ show: true, message, type });
  }, []);

  const closeNotification = useCallback(() => {
    setNotification({ show: false, message: "", type: "" });
  }, []);

  return { notification, showNotification, closeNotification };
};
const getBetSlipBackgroundColor = (betType) => {
  switch (betType) {
    case "back":
      return "#72bbef"; // Blue
    case "lay":
      return "#ff6b6b"; // Red
    default:
      return "#f8f9fa"; // Default
  }
};
const BetSlip = memo(
  ({
    selectedOdds,
    stake,
    handleStakeChange,
    decreaseStake,
    increaseStake,
    handleQuickStake,
    handlePlaceBet,
    closeBetSlip,
    isPlacingBet,
    fancyQuickStakes,
    formatNumber,
    // ADDED: Exposure props ONLY for Match Odds and Bookmaker
    matchOddsShowCurrentExp,
    bookMakerShowCurrentExp,
    teamexposercurrent1,
    teamexposercurrent2,
    teamexposercurrent1Name,
    currentExpbgColor1,
    currentExpbgColor2,
    selectednameteam,
    MatchType,
    // ADDED: Bet type for background color
    betType,
  }) => {
    const stakeInputRef = useRef(null);

    useEffect(() => {
      if (stakeInputRef.current) {
        stakeInputRef.current.focus();
      }
    }, [stake]);

    // Determine background color based on bet type
    const getBetSlipBackgroundColor = () => {
      if (betType === "back") {
        return "#72bbef"; // Blue background for back bets
      } else if (betType === "lay") {
        return "#ff6b6b"; // Red background for lay bets
      }
      return "#f8f9fa"; // Default background
    };

    return (
      // <div style={{ backgroundColor: getBetSlipBackgroundColor(), borderRadius: '5px', padding: '10px' }}>
      <div
        style={{ backgroundColor: betType === "back" ? "#72bbef" : "#faa9ba" }}
        className="py-2"
      >
        <div className="fancy-quick-tr placebet">
          <div className="slip-back">
            <div className="">
              {/* ADDED: Exposure Display ONLY for Match Odds and Bookmaker */}
              {/* {(matchOddsShowCurrentExp || bookMakerShowCurrentExp) &&
                selectednameteam && (
                  <div className="row d-flex justify-content-between align-items-center mb-2 px-2">
                    <div className="col-6">
                      <small style={{ fontSize: "12px", fontWeight: "bold" }}>
                        Exposure for {selectednameteam} (
                        {MatchType === "match_odds" ? "Match" : "Bookmaker"}):
                      </small>
                    </div>
                    <div className="col-6 text-end">
                      {teamexposercurrent1Name === selectednameteam ? (
                        <div
                          style={{
                            color: currentExpbgColor1,
                            fontSize: "14px",
                            fontWeight: "bold",
                            display: "inline-block",
                          }}
                        >
                          {teamexposercurrent1 === 0 ? (
                            <></>
                          ) : (
                            "(" + formatNumber(teamexposercurrent1) + ")"
                          )}
                        </div>
                      ) : (
                        <div
                          style={{
                            color: currentExpbgColor2,
                            fontSize: "14px",
                            fontWeight: "bold",
                            display: "inline-block",
                          }}
                        >
                          {teamexposercurrent2 === 0 ? (
                            <></>
                          ) : (
                            "(" + formatNumber(teamexposercurrent2) + ")"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )} */}

              <div className="datanameandinput d-flex align-items-center stacksCol justify-content-end px-1">
                <div className="d-flex justify-content-end gap-2 only_pc_100 ">
                  <div className="pb-0 hideMobile">
                    <button
                      className="btn btn-block btn-cancel"
                      onClick={closeBetSlip}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="">
                    <input
                      type="text"
                      placeholder="0"
                      className="stakeinput input-Betslip text-center selectodd"
                      value={selectedOdds?.value}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      className="stakeactionminus btn betButtonMinus"
                      onClick={decreaseStake}
                    >
                      -
                    </button>
                    <input
                      ref={stakeInputRef}
                      type="text"
                      placeholder="0"
                      className="stakeinput input-Betslip text-center"
                      value={stake}
                      onChange={handleStakeChange}
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <button
                      className="stakeactionplus btn betButtonPlus float-end"
                      onClick={increaseStake}
                    >
                      +
                    </button>
                  </div>

                  <div className="pb-0 hideMobile">
                    <button
                      className="btn btn-send text-light"
                      onClick={handlePlaceBet}
                      disabled={!stake || parseInt(stake) === 0 || isPlacingBet}
                    >
                      {isPlacingBet ? <div class="btn_loader"></div> : "Place Bet"}
                    </button>
                  </div>
                </div>
              </div>

              <div className=" d-flex stackbutton pt-0 pb-0 slip-back-br">
                {fancyQuickStakes.map((amount) => (
                  <div key={amount} className="fancy_design_button p-1">
                    <button
                      className="btn btn-block fancy-quick-btn"
                      onClick={() => handleQuickStake(amount)}
                    >
                      {formatNumber(amount)}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-0 mb-2 p-0 stackbutton padddingZero hideDesktop">
                <div className="datanameandinput w-100 d-flex gap-2 p-1">
                  <button
                    className="btn btn-block btn-cancel col"
                    onClick={closeBetSlip}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-send col"
                    onClick={handlePlaceBet}
                    disabled={!stake || parseInt(stake) === 0 || isPlacingBet}
                  >
                    {isPlacingBet ? <div class="btn_loader"></div> : "Place Bet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const FancyBetSlip = memo(
  ({
    selectedOdds,
    stake,
    handleStakeChange,
    decreaseStake,
    increaseStake,
    handleQuickStake,
    handlePlaceBet,
    closeBetSlip,
    isPlacingBet,
    fancyQuickStakes,
    formatNumber,
    // ADDED: Bet type for background color
    betType,
  }) => {
    const stakeInputRef = useRef(null);

    useEffect(() => {
      if (stakeInputRef.current) {
        stakeInputRef.current.focus();
      }
    }, [stake]);

    // Determine background color based on bet type
    const getBetSlipBackgroundColor = () => {
      if (betType === "back") {
        return "#72bbef"; // Blue background for back bets
      } else if (betType === "lay") {
        return "#faa9ba"; // Red background for lay bets
      }
      return "#f8f9fa"; // Default background
    };

    return (
      // <div style={{ backgroundColor: getBetSlipBackgroundColor(), borderRadius: '5px', padding: '10px' }}>
      <>
        <div
          style={{
            backgroundColor: betType === "back" ? "#72bbef" : "#faa9ba",
            color: "white",
          }}
        >
          <div className="fancy-quick-tr placebet p-1">
            <div className="slip-back">
              <div className="">
                <div className="d-flex justify-content-end gap-2 only_pc_100">
                  <div className="hideMobile">
                    <button
                      className="btn btn-block btn-cancel"
                      onClick={closeBetSlip}
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="text-right d-flex align-items-center px-1 stacksCol">
                    <div className="odds-display text-center w-100">
                      <input
                        type="text"
                        className="stakeinput input-Betslip text-center selectodd"
                        value={selectedOdds?.value}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </div>
                  </div>
                  <div className="px-1">
                    <div className="d-flex align-items-center">
                      <button
                        className="stakeactionminus btn betButtonMinus"
                        onClick={decreaseStake}
                      >
                        -
                      </button>
                      <input
                        ref={stakeInputRef}
                        type="text"
                        placeholder="0"
                        className="stakeinput input-Betslip text-center"
                        value={stake}
                        onChange={handleStakeChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      <button
                        className="stakeactionplus btn betButtonPlus float-end"
                        onClick={increaseStake}
                      >
                        +
                      </button>
                      <div className="px-1 pb-0 hideMobile">
                        <button
                          className="btn btn-send"
                          onClick={handlePlaceBet}
                          disabled={
                            !stake || parseInt(stake) === 0 || isPlacingBet
                          }
                        >
                          {isPlacingBet ? <div class="btn_loader"></div> : "Place Bet"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex  stackbutton pt-0 pb-0 slip-back-br">
                  {fancyQuickStakes.map((amount) => (
                    <div
                      key={amount}
                      className="fancy_design_button px-1 pt-1 "
                    >
                      <button
                        className="btn btn-block fancy-quick-btn"
                        onClick={() => handleQuickStake(amount)}
                      >
                        {formatNumber(amount)}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-0 my-1 gap-2 p-1 stackbutton padddingZero hideDesktop">
                  <button
                    className="btn btn-block btn-cancel col"
                    onClick={closeBetSlip}
                  >
                    Cancel
                  </button>

                  <button
                    className="btn btn-send col"
                    onClick={handlePlaceBet}
                    disabled={!stake || parseInt(stake) === 0 || isPlacingBet}
                  >
                    {isPlacingBet ? <div class="btn_loader"></div> : "Place Bet"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

// Memoized My Bets Component
const MyBetsComponent = memo(({ showMyBets, betsLoading, myBets }) => (
  <div className="my-bets-section mt-2">
    {showMyBets && (
      <div className="bets-container">
        {betsLoading ? (
          <div className="text-center p-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your bets...</p>
          </div>
        ) : myBets.length > 0 ? (
          ""
        ) : (
          <div className="text-center p-3">
            <p className="text-muted">No bets placed yet</p>
          </div>
        )}
      </div>
    )}
  </div>
));

function Cricket() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOpenBook, setShowOpenBook] = useState(false);

  const { notification, showNotification, closeNotification } =
    useNotification();

  const [stake, setStake] = useState("");
  const [placebet, setPlacebet] = useState(false);
  const [selectedOdds, setSelectedOdds] = useState(null);
  const [betType, setBetType] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSuspended, setIsSuspended] = useState(true);
  const [scorecard, setScorecard] = useState(false);
  const [openInfoId, setOpenInfoId] = useState(null);

  // ADDED: Exposure/Liability State Variables
  const [teamexposercurrent1, setteamexposercurrent1] = useState(0);
  const [teamexposercurrent2, setteamexposercurrent2] = useState(0);
  const [teamexposercurrent1Name, setteamexposercurrent1Name] = useState("");
  const [teamexposercurrent2Name, setteamexposercurrent2Name] = useState("");
  const [currentExpbgColor1, setcurrentExpbgColor1] = useState("#108f10ff");
  const [currentExpbgColor2, setcurrentExpbgColor2] = useState("#ff0000");
  const [bettingvalueteam, setBettingvalueteam] = useState("");
  const [matchOddsShowCurrentExp, setmatchOddsShowCurrentExp] = useState(false);
  const [bookMakerShowCurrentExp, setbookMakerShowCurrentExp] = useState(false);
  const [selectednameteam, setSelectednameteam] = useState("");
  // alert(selectednameteam)
  const [MatchType, setMatchType] = useState("match_odds");
  const [bgColor, setBgColor] = useState("#72bbef");
  const [stackValueteam, setStackValueteam] = useState(1);
  const [showBetHistoryModal, setShowBetHistoryModal] = useState(false);

  const toggleInfo = useCallback(
    (id) => {
      setOpenInfoId(openInfoId === id ? null : id);
    },
    [openInfoId]
  );

  const [fancybet, setFancybet] = useState("fancybetall");
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [myBets, setMyBets] = useState([]);
  const [showMyBets, setShowMyBets] = useState(false);
  const [betsLoading, setBetsLoading] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  const [open, setOpen] = useState(false);
  const [Matches, setMatches] = useState([]);
  const [bookmakerList, setBookmakerList] = useState([]);
  const [tiedList, setTiedList] = useState([]);
  const [fancylist, setfancylist] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [fancyLoading, setFancyLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [activeTab, setActiveTab] = useState("");

  // Add highlight state
  const [highlightedMarkets, setHighlightedMarkets] = useState({});
  const previousMarketValues = useRef({});
  const previousMatchValues = useRef({});
  const previousBookmakerValues = useRef({});
  //////////////////////////////////////////

  const location = useLocation();

  // Extract parameters from path format: /cricket/series_idd-1.251333655/event_id-35028414
  const pathParts = location.pathname.split("/");

  const seriesIndex = pathParts.indexOf("series_idd");
  const eventIndex = pathParts.indexOf("event_id");

  const series_idd = seriesIndex !== -1 ? pathParts[seriesIndex + 1] : "";
  const event_id = eventIndex !== -1 ? pathParts[eventIndex + 1] : "";

  console.warn("Extracted series_idd:", series_idd);
  console.warn("Extracted event_id:", event_id);

  ///////////////////////////////////////////////

  const stakeInputRef = useRef(null);
  const navigate = useNavigate();
  const [bettingdesign, setBettingdesign] = useState(false);
  const nodeMode = process.env.NODE_ENV;
  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const baseUrl =
    nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const [eventId, setEventId] = useState("");

  useEffect(() => {
    const storedEventId = localStorage.getItem("event_id");
    if (storedEventId) {
      setEventId(storedEventId);
    }

    const handleBetUpdated = () => {
      const updatedEventId = localStorage.getItem("event_id") || "";
      setEventId(updatedEventId);
    };

    window.addEventListener("bet-updated", handleBetUpdated);
    return () => window.removeEventListener("bet-updated", handleBetUpdated);
  }, []);

  const quickStakes = [100, 200, 50, 100, 200, 500, 1000, 1500, 2000];

  const [fancyQuickStakes, setButtonValues] = useState([]);
  useEffect(() => {
    fetchButtonValues();
  }, []);

  const fetchButtonValues = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const response = await axios.get(
        `${baseUrl}/get-button-value?user_id=${userId}`
      );
      console.log("Fetch Button Value Response:", response.data);

      if (response.data.status_code === 1 && response.data.data) {
        setButtonValues(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching button values:", error);
    }
  };

  const tabsinner = [
    "ALL",
    "Fancy",
    "Line Markets",
    "Ball by Ball",
    "Meter Markets",
    "Khado Markets",
  ];
  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tvVisible, setTvVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const iframeRef = useRef(null);

  const betsPerPage = 5;
  const userId = localStorage.getItem("user_id");

  // Check authentication function - ONLY for click handlers
  const [showLoginModal, setShowLoginModal] = useState(false);
  const openLogin = useCallback(() => setShowLoginModal(true), []);
  const closeLogin = useCallback(() => setShowLoginModal(false), []);

  // Fixed checkAuthentication function
  const checkAuthentication = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      openLogin();
      return false;
    }
    return true;
  }, [openLogin]);

  // ADDED: Exposure calculation function
  const valuebettingteam = useCallback(
    (value) => {
      if (MatchType === "match_odds") {
        if (bgColor === "#72bbef") {
          // back
          var abc =
            parseFloat(value) * parseFloat(stackValueteam) - parseFloat(value);
          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name("none");

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(parseInt(value));

          const color1 = "#108f10ff";
          const color2 = "#ff0000";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        } else {
          // lay
          var abc =
            parseFloat(value) * parseFloat(stackValueteam) - parseFloat(value);
          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name("none");

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(parseInt(value));

          const color1 = "#ff0000";
          const color2 = "#108f10ff";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        }
        setmatchOddsShowCurrentExp(true);
        setbookMakerShowCurrentExp(false);
      } else {
        if (bgColor === "#72bbef") {
          // back
          var abc = (parseFloat(value) * parseFloat(stackValueteam)) / 100;
          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name("none");

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(parseInt(value));

          const color1 = "#108f10ff";
          const color2 = "#ff0000";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        } else {
          // lay
          var abc = (parseFloat(value) * parseFloat(stackValueteam)) / 100;
          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name("none");

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(parseInt(value));

          const color1 = "#ff0000";
          const color2 = "#108f10ff";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        }
        setbookMakerShowCurrentExp(true);
        setmatchOddsShowCurrentExp(false);
      }

      setBettingvalueteam(value);
    },
    [MatchType, bgColor, stackValueteam, selectednameteam]
  );

  // Optimized callbacks with useCallback
  const togglebetting = useCallback(() => {
    setBettingdesign((prev) => !prev);
  }, []);

  const togglescore = useCallback(() => {
    setScorecard((prev) => !prev);
  }, []);

  // Add highlight function
  const highlightMarket = useCallback((marketId, type, index = null) => {
    const highlightKey =
      index !== null ? `${marketId}-${type}-${index}` : `${marketId}-${type}`;

    setHighlightedMarkets((prev) => ({
      ...prev,
      [highlightKey]: true,
    }));

    setTimeout(() => {
      setHighlightedMarkets((prev) => {
        const newState = { ...prev };
        delete newState[highlightKey];
        return newState;
      });
    }, 250);
  }, []);

  const fetchMyBets = useCallback(async () => {
    try {
      if (!userId) return;
      setBetsLoading(true);
      const res = await axios.post(`${baseUrl}/my-bets`, { user_id: userId });
      if (res.data?.status_code === 1 && Array.isArray(res.data.data)) {
        setBets(res.data.data);
      } else {
        setBets([]);
      }
    } catch (error) {
      console.error("Error fetching bets:", error);
      setBets([]);
    } finally {
      setBetsLoading(false);
    }
  }, [userId, baseUrl]);

  useEffect(() => {
    fetchMyBets();
  }, [fetchMyBets]);

  useEffect(() => {
    const handleBetUpdate = () => {
      fetchMyBets();
    };
    window.addEventListener("bet-updated", handleBetUpdate);
    return () => window.removeEventListener("bet-updated", handleBetUpdate);
  }, [fetchMyBets]);

  const totalPages = Math.ceil(bets.length / betsPerPage);
  const start = (currentPage - 1) * betsPerPage;
  const currentBets = bets.slice(start, start + betsPerPage);

  const toggleFullScreen = useCallback(() => {
    const iframeEl = iframeRef.current;
    if (!iframeEl) return;
    if (!document.fullscreenElement) {
      iframeEl.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  }, []);

  useEffect(() => {
    const handleExitFullScreen = () => setIsFullScreen(false);
    document.addEventListener("fullscreenchange", handleExitFullScreen);
    return () => {
      document.removeEventListener("fullscreenchange", handleExitFullScreen);
    };
  }, []);

  // UPDATED: Format number with k/m suffixes
  const formatNumber = useCallback((num) => {
    if (!num && num !== 0) return "0";

    // Convert to number if it's a string
    const number = typeof num === "string" ? parseFloat(num) : num;

    // Handle non-numeric values
    if (isNaN(number)) return "0";

    // For stake amounts (no k/m formatting)
    return number.toString();
  }, []);

  // NEW: Format volume/size numbers with k/m suffixes
  const formatVolume = useCallback((num) => {
    if (!num && num !== 0) return "0";

    // Convert to number if it's a string
    const number = typeof num === "string" ? parseFloat(num) : num;

    // Handle non-numeric values
    if (isNaN(number)) return "0";

    // Format with k and m suffixes
    if (number >= 10000) {
      // For millions
      const millions = number / 10000;
      if (millions < 10) {
        return `${millions.toFixed(2)}m`; // 1.25m, 2.50m
      } else if (millions < 100) {
        return `${millions.toFixed(1)}m`; // 10.5m, 25.5m
      }
      return `${Math.round(millions)}m`; // 100m, 250m
    } else if (number >= 1000) {
      // For thousands
      const thousands = number / 1000;
      if (thousands < 10) {
        return `${thousands.toFixed(2)}k`; // 1.25k, 5.50k
      } else if (thousands < 100) {
        return `${thousands.toFixed(1)}k`; // 10.5k, 55.5k
      }
      return `${Math.round(thousands)}k`; // 100k, 250k
    }

    // For numbers less than 1000, return as is
    return number.toString();
  }, []);

  const [matchesName, setMatchesName] = useState([]);
  console.warn("99999999", matchesName)
  const getmarketteamsodds = useCallback(async () => {
    try {
      if (!series_idd) return;

      const response = await axios.post(
        `${baseUrl}/get-market-teams/${series_idd}`,
        {}
      );

      console.log("API Response:", response.data);

      if (
        response.data?.status_code === 1 &&
        Array.isArray(response.data.data)
      ) {
        const teams = response.data.data.map(item => ({
          id: item._id,
          team_name: item.team_name,
          team_id: item.team_id,
        }));

        setMatchesName(teams);
        setError("");
      } else {
        setMatchesName([]);
        setError("No teams found");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setMatchesName([]);
    }
  }, [series_idd, baseUrl]);


  useEffect(() => {
    getmarketteamsodds();
  }, [getmarketteamsodds]);

  const matchlist = useCallback(async () => {
    try {
      setMatchLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!series_idd) {
        console.warn("No series_idd available");
        return;
      }

      const response = await axios.get(
        `https://cricketfancylive.shyammatka.co.in/get-match-odds-list?id=${series_idd}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const marketData = response.data[0];
        if (
          marketData &&
          marketData.runners &&
          Array.isArray(marketData.runners)
        ) {
          const transformedMatches = marketData.runners.map((runner) => {
            let teamName = "Unknown Team";
            if (runner.selectionId === 7461) {
              teamName = "Pakistan";
            } else if (runner.selectionId === 349) {
              teamName = "South Africa";
            } else {
              teamName = `Team ${runner.selectionId}`;
            }

            // Track value changes for match odds
            const marketId = runner.selectionId;
            const currentValues = {
              backPrice0: runner.ex?.availableToBack?.[0]?.price || 0,
              backPrice1: runner.ex?.availableToBack?.[1]?.price || 0,
              backPrice2: runner.ex?.availableToBack?.[2]?.price || 0,
              layPrice0: runner.ex?.availableToLay?.[0]?.price || 0,
              layPrice1: runner.ex?.availableToLay?.[1]?.price || 0,
              layPrice2: runner.ex?.availableToLay?.[2]?.price || 0,
            };

            const previousValues = previousMatchValues.current[marketId];

            if (previousValues) {
              // Check back prices
              for (let i = 0; i < 3; i++) {
                const currentBackPrice = runner.ex?.availableToBack?.[i]?.price;
                const previousBackPrice = previousValues[`backPrice${i}`];
                if (
                  currentBackPrice !== previousBackPrice &&
                  currentBackPrice !== undefined
                ) {
                  highlightMarket(marketId, "back", i);
                }
              }

              // Check lay prices
              for (let i = 0; i < 3; i++) {
                const currentLayPrice = runner.ex?.availableToLay?.[i]?.price;
                const previousLayPrice = previousValues[`layPrice${i}`];
                if (
                  currentLayPrice !== previousLayPrice &&
                  currentLayPrice !== undefined
                ) {
                  highlightMarket(marketId, "lay", i);
                }
              }
            }

            // Update previous values
            previousMatchValues.current[marketId] = currentValues;

            return {
              id: runner.selectionId,
              team_name: teamName,
              status: runner.status,
              lastPriceTraded: runner.lastPriceTraded,
              backOdds: runner.ex?.availableToBack?.[0]?.price || 0,
              layOdds: runner.ex?.availableToLay?.[0]?.price || 0,
              backSize: runner.ex?.availableToBack?.[0]?.size || 0,
              laySize: runner.ex?.availableToLay?.[0]?.size || 0,
              totalMatched: runner.totalMatched,
              runner: runner,
              availableToBack: runner.ex?.availableToBack || [],
              availableToLay: runner.ex?.availableToLay || [],
            };
          });
          setMatches(transformedMatches);
          setError("");
        } else {
          setError("Invalid match data format - no runners found");
          setMatches([]);
        }
      } else {
        setError(response.data?.message || "Failed to fetch matches");
        setMatches([]);
      }
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError(err.message || "Something went wrong");
      setMatches([]);
    } finally {
      setMatchLoading(false);
    }
  }, [series_idd, highlightMarket]);

  const toggleMyBets = useCallback(() => {
    setShowMyBets(!showMyBets);
  }, [showMyBets]);

  const placeSessionBet = useCallback(
    async (betData) => {
      try {
        setIsPlacingBet(true);
        setError("");
        setSuccessMessage("");

        const token = localStorage.getItem("accessToken");
        if (!token) {
          showNotification("Please login again", "error");
          return;
        }

        // Validation जोड़ें
        if (!betData.betSlip_stake || betData.betSlip_stake <= 0) {
          showNotification("Please enter a valid bet amount!", "warning");
          setIsPlacingBet(false);
          return;
        }

        if (!betData.betSlip_odds || betData.betSlip_odds <= 0) {
          showNotification("Odds value is invalid!", "warning");
          setIsPlacingBet(false);
          return;
        }

        // Add userId and other required fields
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          showNotification("User not found, please login again", "error");
          setIsPlacingBet(false);
          return;
        }

        const completeBetData = {
          ...betData,
          userId: userId,
          sport_id: 4, // Default for cricket
        };

        console.log("📤 Original Bet Data:", completeBetData);

        // ✅ Encrypt the data
        const encryptedData = encryptData(completeBetData);
        console.log(
          "🔐 Encrypted Bet Data:",
          encryptedData.substring(0, 50) + "..."
        );

        // ✅ Send encrypted request
        const response = await axios.post(
          `${baseUrl}/place-session-bet`,
          { encryptedData }, // ✅ Send ONLY encrypted data
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );

        console.log("📥 Raw Response:", response.data);

        // ✅ Check if response is encrypted
        if (response.data.encryptedResponse) {
          // Decrypt the response
          const decryptedResponse = decryptData(
            response.data.encryptedResponse
          );
          console.log("✅ Decrypted Response:", decryptedResponse);

          if (decryptedResponse.status_code === 1) {
            showNotification(
              decryptedResponse.message || "Bet placed successfully!",
              "success"
            );
            window.dispatchEvent(new Event("bet-updated"));

            if (decryptedResponse.userAmount) {
              localStorage.setItem(
                "userCredit",
                decryptedResponse.userAmount.credit || 0
              );
            }

            closeBetSlip();
          } else {
            showNotification(
              decryptedResponse.message || "Failed to place bet",
              "error"
            );
          }
        } else {
          // Handle non-encrypted response (for backward compatibility)
          console.warn("⚠️ Response is NOT encrypted!");
          if (response.data.status_code === 1) {
            showNotification(
              response.data.message || "Bet placed successfully!",
              "success"
            );
            window.dispatchEvent(new Event("bet-updated"));

            if (response.data.credit) {
              localStorage.setItem("userCredit", response.data.credit);
            }

            closeBetSlip();
          } else {
            showNotification(
              response.data.message || "Failed to place bet",
              "error"
            );
          }
        }
      } catch (error) {
        console.error("❌ Error placing session bet:", error);

        let errorMessage = "An unexpected error occurred. Please try again.";

        // Handle encrypted error response
        if (
          error.response &&
          error.response.data &&
          error.response.data.encryptedResponse
        ) {
          try {
            const decryptedError = decryptData(
              error.response.data.encryptedResponse
            );
            errorMessage = decryptedError.message || errorMessage;
          } catch (e) {
            errorMessage = "Failed to process error response";
          }
        } else if (error.response) {
          errorMessage =
            error.response.data?.message ||
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        }

        showNotification(errorMessage, "error");
      } finally {
        setIsPlacingBet(false);
      }
    },
    [baseUrl, showNotification]
  );

  const placeRegularBet = useCallback(
    async (betData) => {
      try {
        setIsPlacingBet(true);
        setError("");
        setSuccessMessage("");

        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("user_id"); // ✅ Add this line

        if (!token || !userId) {
          showNotification("Please login again", "error");
          setIsPlacingBet(false);
          return;
        }

        // Validation जोड़ें
        const requiredFields = [
          "betSlip_stake",
          "betSlip_odds",
          "bet_on",
          "event_id",
          "market_id",
          "team_id",
          "team",
        ];

        const missingFields = [];
        requiredFields.forEach((field) => {
          if (!betData[field]) {
            missingFields.push(field);
          }
        });

        if (missingFields.length > 0) {
          showNotification(
            `Missing required fields: ${missingFields.join(", ")}`,
            "error"
          );
          setIsPlacingBet(false);
          return;
        }

        if (betData.betSlip_stake <= 0) {
          showNotification("Bet amount must be greater than 0", "warning");
          setIsPlacingBet(false);
          return;
        }

        // ✅ Prepare complete data with user_id
        const completeBetData = {
          ...betData,
          user_id: userId, // ✅ Backend expects "user_id" not "userId"
          sport_id: betData.sport_id || 4, // Default for cricket
        };

        console.log("📤 Original Bet Data:", completeBetData);

        // ✅ Encrypt the data
        const encryptedData = encryptData(completeBetData);
        console.log(
          "🔐 Encrypted Bet Data sent:",
          encryptedData.substring(0, 50) + "..."
        );

        // ✅ Send encrypted request
        const response = await axios.post(
          `${baseUrl}/place-betpost`,
          { encryptedData }, // ✅ Send ONLY encrypted data
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );

        console.log("📥 Raw Response:", response.data);

        // ✅ Check if response is encrypted
        if (response.data.encryptedResponse) {
          // ✅ Decrypt the response
          const decryptedResponse = decryptData(
            response.data.encryptedResponse
          );
          console.log("✅ Decrypted Response:", decryptedResponse);

          if (decryptedResponse.status_code === 1) {
            showNotification(
              decryptedResponse.message || "Bet placed successfully!",
              "success"
            );
            window.dispatchEvent(new Event("bet-updated"));

            if (decryptedResponse.credit) {
              localStorage.setItem("userCredit", decryptedResponse.credit);
            }

            closeBetSlip();
          } else {
            showNotification(
              decryptedResponse.message || "Failed to place bet",
              "error"
            );
          }
        } else {
          // ✅ Handle non-encrypted response (for backward compatibility)
          console.warn("⚠️ Response is NOT encrypted!");
          if (response.data.status_code === 1) {
            showNotification(
              response.data.message || "Bet placed successfully!",
              "success"
            );
            window.dispatchEvent(new Event("bet-updated"));

            if (response.data.credit) {
              localStorage.setItem("userCredit", response.data.credit);
            }

            closeBetSlip();
          } else {
            showNotification(
              response.data.message || "Failed to place bet",
              "error"
            );
          }
        }
      } catch (error) {
        console.error("❌ Error placing regular bet:", error);

        let errorMessage = "An unexpected error occurred. Please try again.";

        // ✅ Handle encrypted error response
        if (
          error.response &&
          error.response.data &&
          error.response.data.encryptedResponse
        ) {
          try {
            const decryptedError = decryptData(
              error.response.data.encryptedResponse
            );
            errorMessage = decryptedError.message || errorMessage;
          } catch (e) {
            console.error("❌ Error decrypting error response:", e);
            errorMessage = "Failed to process error response";
          }
        } else if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
          console.log("📥 Error response data:", error.response.data);
        } else if (error.request) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        }

        console.log("💬 Showing error to user:", errorMessage);
        showNotification(errorMessage, "error");
      } finally {
        setIsPlacingBet(false);
      }
    },
    [baseUrl, showNotification]
  );

  const getMatchType = useCallback(() => {
    if (!selectedOdds) {
      return "match_odds";
    }

    if (selectedOdds.market?.RunnerName || selectedOdds.clickedSide) {
      return "fancy";
    }

    const isBookmaker =
      selectedOdds.market?.marketName?.toLowerCase().includes("bookmaker") ||
      selectedOdds.oddType?.toLowerCase().includes("bookmaker") ||
      selectedOdds.market?.marketType === "BOOK_MAKER";

    if (isBookmaker) {
      return "bookmaker";
    }

    const isTied =
      selectedOdds.market?.marketName?.toLowerCase().includes("tied") ||
      selectedOdds.oddType?.toLowerCase().includes("tied");

    if (isTied) {
      return "tied";
    }

    return "match_odds";
  }, [selectedOdds]);

  const getMarketName = useCallback(() => {
    if (!selectedOdds) return "match_odds";

    if (selectedOdds.market?.RunnerName) {
      return selectedOdds.market.RunnerName;
    }

    if (selectedOdds.market?.nat) {
      return selectedOdds.market.nat;
    }

    if (selectedOdds.eventName) {
      return selectedOdds.eventName;
    }

    return "match_odds";
  }, [selectedOdds]);

  const handlePlaceBet = useCallback(() => {
    const stakeValue = parseInt(stake) || 0;

    if (stakeValue === 0) {
      showNotification("Please enter a stake amount", "warning");
      return;
    }

    if (!selectedOdds) {
      showNotification("No odds selected", "warning");
      return;
    }

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      showNotification("User ID not found. Please login again.", "error");
      return;
    }

    const matchType = getMatchType();
    const marketName = getMarketName();

    // Calculate total amount
    const totalAmount = stakeValue;

    // Get team name from matchesName if available
    let teamName = "Unknown Team";
    if (selectedOdds.rowId && matchesName.length > 0) {
      const matchedTeam = matchesName.find(team => team.team_id === selectedOdds.rowId);
      if (matchedTeam) {
        teamName = matchedTeam.team_name;
      } else if (selectedOdds.eventName) {
        teamName = selectedOdds.eventName;
      }
    } else if (selectedOdds.eventName) {
      teamName = selectedOdds.eventName;
    }

    const betData = {
      ...(matchType === "fancy" ? { userId: userId } : { user_id: userId }),
      betSlip_odds: parseFloat(selectedOdds.value),
      betSlip_stake: stakeValue,
      total: totalAmount.toFixed(2),
      bet_on: betType,
      MatchType: matchType,
      event_id: event_id,
      market_id: series_idd,
      sport_id: "4",
      team_id: selectedOdds.market?.id || selectedOdds.rowId || "12391119",
      team: teamName, // Updated to use dynamic team name
      market_name: marketName,
      fancy_id: selectedOdds.market?.SelectionId || selectedOdds.rowId || "123",
    };

    // Fancy bet के लिए अतिरिक्त फील्ड्स
    if (matchType === "fancy") {
      betData.fancy_id = selectedOdds.market?.SelectionId || selectedOdds.rowId;
      betData.session_id =
        selectedOdds.market?.SelectionId || selectedOdds.rowId;
    } else {
      betData.market_id = series_idd;
      betData.team_id = selectedOdds.market?.id || selectedOdds.rowId;
    }

    if (matchType === "fancy") {
      placeSessionBet(betData);
    } else {
      placeRegularBet(betData);
    }
  }, [
    stake,
    selectedOdds,
    betType,
    getMatchType,
    getMarketName,
    placeSessionBet,
    placeRegularBet,
    showNotification,
    event_id,
    series_idd,
    matchesName, // Added matchesName to dependencies
  ]);

  // FIXED: handleOddsClick - REMOVED toggle functionality
  // FIXED: handleOddsClick - REMOVED toggle functionality
  const handleOddsClick = useCallback(
    (oddsValue, type, market, oddType, rowId) => {
      // Check authentication before allowing click - ONLY HERE
      if (!checkAuthentication()) return;

      if (market.status === "SUSPENDED") {
        showNotification(
          "This market is currently suspended. Betting is not allowed.",
          "warning"
        );
        return;
      }

      // Find team name from matchesName
      const teamInfo = matchesName.find(team => team.team_id === rowId);
      const teamName = teamInfo ? teamInfo.team_name : market.team_name;

      // SET EXPOSURE CALCULATION DATA
      setSelectednameteam(teamName);
      setMatchType("match_odds");
      setBgColor(type === "back" ? "#72bbef" : "#ff6b6b");
      setStackValueteam(oddsValue);

      setSelectedOdds({
        value: oddsValue,
        eventName: teamName, // Updated to use dynamic teamName
        type: type,
        marketName: teamName,
        oddType: oddType,
        rowId: rowId,
        market: market,
      });
      setBetType(type);
      setPlacebet(true);
      setSelectedRow(rowId);
      setError("");
      setSuccessMessage("");
      setStake("");

      // Calculate initial exposure if stake exists
      if (stake) {
        valuebettingteam(stake);
      }
    },
    [checkAuthentication, showNotification, stake, valuebettingteam, matchesName] // Added matchesName to dependencies
  );

  // FIXED: handleFancyOddsClick - REMOVED toggle functionality
  const handleFancyOddsClick = useCallback(
    (oddsValue, type, market, clickedSide) => {
      // Check authentication before allowing click - ONLY HERE
      if (!checkAuthentication()) return;

      if (
        market.GameStatus === "SUSPENDED" ||
        market.GameStatus === "BALL RUNNING"
      ) {
        showNotification(
          "This market is currently suspended. Betting is not allowed.",
          "warning"
        );
        return;
      }

      const rowId = market.SelectionId || market.id;

      // REMOVED toggle functionality - don't close if already open
      // if (placebet && selectedRow === rowId) {
      //   closeBetSlip();
      //   return;
      // }

      setSelectedOdds({
        value: oddsValue,
        type: type,
        clickedSide: clickedSide,
        market: market,
        eventName: market.RunnerName || market.title,
        marketName: market.RunnerName || market.title,
        oddType: type === "back" ? "Yes" : "No",
        rowId: rowId,
      });

      setBetType(type);
      setPlacebet(true);
      setSelectedRow(rowId);
      setError("");
      setSuccessMessage("");
      setStake("");
    },
    [checkAuthentication, showNotification]
  );

  // FIXED: Bookmaker Odds Click Handler - REMOVED toggle functionality
  const handleBookmakerOddsClick = useCallback(
    (market, type, value, runner) => {
      // Check authentication before allowing click - ONLY HERE
      if (!checkAuthentication()) return;

      const rowId = `${market.marketId}_${runner.selectionId}`;

      // REMOVED toggle functionality - don't close if already open
      // if (placebet && selectedRow === rowId) {
      //   closeBetSlip();
      //   return;
      // }

      // SET EXPOSURE CALCULATION DATA FOR BOOKMAKER
      setSelectednameteam(runner.runnerName);
      setMatchType("bookmaker");
      setBgColor(type === "back" ? "#72bbef" : "#ff6b6b");
      setStackValueteam(value);

      setSelectedOdds({
        eventName: runner.runnerName,
        oddType: market.marketName,
        type,
        value,
        rowId: rowId,
        market: { ...market, ...runner },
      });
      setBetType(type);
      setPlacebet(true);
      setSelectedRow(rowId);
      setError("");
      setSuccessMessage("");
      setStake("");

      // Calculate initial exposure if stake exists
      if (stake) {
        valuebettingteam(stake);
      }
    },
    [checkAuthentication, stake, valuebettingteam]
  );

  // UPDATED: closeBetSlip with exposure reset
  const closeBetSlip = useCallback(() => {
    setPlacebet(false);
    setSelectedOdds(null);
    setBetType("");
    setStake("");
    setSelectedRow(null);
    setError("");
    setSuccessMessage("");

    // RESET EXPOSURE DISPLAY
    setmatchOddsShowCurrentExp(false);
    setbookMakerShowCurrentExp(false);
    setteamexposercurrent1(0);
    setteamexposercurrent2(0);
    setBettingvalueteam("");
    setSelectednameteam("");
  }, []);

  // UPDATED: increaseStake with exposure calculation
  const increaseStake = useCallback(() => {
    const currentStake = parseInt(stake) || 0;
    const newStake = (currentStake + 10).toString();
    setStake(newStake);

    // Calculate exposure
    if (selectedOdds && selectednameteam) {
      valuebettingteam(newStake);
    }
  }, [stake, selectedOdds, selectednameteam, valuebettingteam]);

  // UPDATED: decreaseStake with exposure calculation
  const decreaseStake = useCallback(() => {
    const currentStake = parseInt(stake) || 0;
    const newStake = currentStake > 0 ? currentStake - 10 : 0;
    setStake(newStake > 0 ? newStake.toString() : "");

    // Calculate exposure
    if (selectedOdds && selectednameteam && newStake > 0) {
      valuebettingteam(newStake.toString());
    }
  }, [stake, selectedOdds, selectednameteam, valuebettingteam]);

  // UPDATED: handleQuickStake with exposure calculation
  const handleQuickStake = useCallback(
    (amount) => {
      const newStake = amount.toString();
      setStake(newStake);

      // Calculate exposure
      if (selectedOdds && selectednameteam) {
        valuebettingteam(newStake);
      }
    },
    [selectedOdds, selectednameteam, valuebettingteam]
  );

  // UPDATED: handleStakeChange with exposure calculation
  const handleStakeChange = useCallback(
    (e) => {
      const value = e.target.value.replace(/\D/g, "");
      setStake(value);

      // Calculate exposure when stake changes
      if (selectedOdds && selectednameteam && value) {
        valuebettingteam(value);
      }
    },
    [selectedOdds, selectednameteam, valuebettingteam]
  );

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  }, []);

  const fancybetshow = useCallback((tabsvalue) => {
    setFancybet(tabsvalue);
  }, []);

  const handleTabClick = useCallback((tabName) => {
    setSelectedTab(tabName);
  }, []);

  const getfancylist = useCallback(async () => {
    try {
      setFancyLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!event_id) {
        console.warn("No event_id available");
        return;
      }

      const response = await axios.get(
        `https://cricketfancylive.shyammatka.co.in/get-fancy-list?id=${event_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = response.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (err) {
          console.error("Error parsing fancy JSON:", err);
          data = [];
        }
      }

      if (Array.isArray(data)) {
        // Track value changes and highlight
        data.forEach((market) => {
          const marketId = market.SelectionId || market.id;
          const currentValues = {
            LayPrice1: market.LayPrice1,
            BackPrice1: market.BackPrice1,
            LaySize1: market.LaySize1,
            BackSize1: market.BackSize1,
          };

          const previousValues = previousMarketValues.current[marketId];

          if (previousValues) {
            // Check if LayPrice1 changed
            if (currentValues.LayPrice1 !== previousValues.LayPrice1) {
              highlightMarket(marketId, "lay");
            }

            // Check if BackPrice1 changed
            if (currentValues.BackPrice1 !== previousValues.BackPrice1) {
              highlightMarket(marketId, "back");
            }
          }

          // Update previous values
          previousMarketValues.current[marketId] = currentValues;
        });

        setfancylist(data);
      } else if (data && Array.isArray(data.data)) {
        setfancylist(data.data);
      } else if (data && typeof data === "object") {
        const dataArray = Object.values(data).filter(
          (item) => item && typeof item === "object" && item.SelectionId
        );
        setfancylist(dataArray);
      } else {
        console.warn("Fancy response format not recognized:", data);
        setfancylist([]);
      }
    } catch (err) {
      console.error("Error fetching fancy list:", err);
      setError(err.message || "Something went wrong");
      setfancylist([]);
    } finally {
      setFancyLoading(false);
    }
  }, [event_id, highlightMarket]);

  const getBookmakerList = useCallback(async () => {
    const eventId = localStorage.getItem("event_id") || event_id || "34931511";
    if (!eventId) {
      console.warn("No eventId available for bookmaker");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        `https://cricketfancylive.shyammatka.co.in/get-book-maker-list?id=${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = response.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (err) {
          console.error("Error parsing bookmaker JSON:", err);
          data = [];
        }
      }

      if (Array.isArray(data)) {
        const bookmakerMarkets = data.filter(
          (market) =>
            market.marketName &&
            (market.marketName.toLowerCase().includes("bookmaker") ||
              market.marketName.toLowerCase().includes("over"))
        );
        const tiedMarkets = data.filter(
          (market) =>
            market.marketName &&
            market.marketName.toLowerCase().includes("tied")
        );

        // Track bookmaker value changes
        bookmakerMarkets.forEach((market) => {
          market.runners?.forEach((runner) => {
            const marketId = `${market.marketId}_${runner.selectionId}`;
            const currentValues = {
              backPrice0: runner.ex?.availableToBack?.[0]?.price || 0,
              backPrice1: runner.ex?.availableToBack?.[1]?.price || 0,
              backPrice2: runner.ex?.availableToBack?.[2]?.price || 0,
              layPrice0: runner.ex?.availableToLay?.[0]?.price || 0,
              layPrice1: runner.ex?.availableToLay?.[1]?.price || 0,
              layPrice2: runner.ex?.availableToLay?.[2]?.price || 0,
            };

            const previousValues = previousBookmakerValues.current[marketId];

            if (previousValues) {
              // Check back prices
              for (let i = 0; i < 3; i++) {
                const currentBackPrice = runner.ex?.availableToBack?.[i]?.price;
                const previousBackPrice = previousValues[`backPrice${i}`];
                if (
                  currentBackPrice !== previousBackPrice &&
                  currentBackPrice !== undefined
                ) {
                  highlightMarket(marketId, "back", i);
                }
              }

              // Check lay prices
              for (let i = 0; i < 3; i++) {
                const currentLayPrice = runner.ex?.availableToLay?.[i]?.price;
                const previousLayPrice = previousValues[`layPrice${i}`];
                if (
                  currentLayPrice !== previousLayPrice &&
                  currentLayPrice !== undefined
                ) {
                  highlightMarket(marketId, "lay", i);
                }
              }
            }

            // Update previous values
            previousBookmakerValues.current[marketId] = currentValues;
          });
        });

        setBookmakerList(bookmakerMarkets);
        setTiedList(tiedMarkets);
      } else {
        console.warn("Bookmaker response is not an array:", data);
        setBookmakerList([]);
        setTiedList([]);
      }
    } catch (error) {
      console.error("Error fetching bookmaker list:", error);
      setBookmakerList([]);
      setTiedList([]);
    }
  }, [event_id, highlightMarket]);

  const token = localStorage.getItem("accessToken");

  // Initial data fetch on component mount
  useEffect(() => {
    if (isInitialLoad && series_idd && event_id) {
      console.log("Initial data fetch triggered");
      const fetchAllData = async () => {
        try {
          await Promise.all([matchlist(), getfancylist(), getBookmakerList()]);
        } catch (error) {
          console.error("Error in initial data fetch:", error);
        } finally {
          setIsInitialLoad(false);
        }
      };

      fetchAllData();
    }
  }, [
    isInitialLoad,
    series_idd,
    event_id,
    matchlist,
    getfancylist,
    getBookmakerList,
  ]);
  // alert(showLoginModal)
  // Set up intervals for real-time updates ONLY after initial load
  useEffect(() => {
    const intervals = [];

    // interval time decide karo
    // const intervalTime = showLoginModal ? 60000 : 2000;
    const intervalTime = showLoginModal ? 60000 : 2000;

    // Match odds interval
    if (series_idd) {
      const matchInterval = setInterval(() => {
        matchlist();
      }, intervalTime);
      intervals.push(matchInterval);
    }

    // Fancy list interval
    if (event_id) {
      const fancyInterval = setInterval(() => {
        getfancylist();
      }, intervalTime);
      intervals.push(fancyInterval);
    }

    // Bookmaker interval
    const bookmakerInterval = setInterval(() => {
      getBookmakerList();
    }, intervalTime);
    intervals.push(bookmakerInterval);

    // Cleanup
    return () => {
      intervals.forEach(clearInterval);
    };
  }, [
    showLoginModal,   // 🔥 important dependency
    series_idd,
    event_id,
    matchlist,
    getfancylist,
    getBookmakerList,
  ]);


  // Force initial fetch when parameters change
  useEffect(() => {
    if (series_idd && event_id) {
      setIsInitialLoad(true);
    }
  }, [series_idd, event_id]);

  useEffect(() => {
    if (location.pathname === "/cricket") {
      const key = "cricketPageReloaded_v1";
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, "1");
        setTimeout(() => window.location.reload(), 5);
      }
    }
  }, [location.pathname]);
  const BookmakerTable = memo(
    ({
      markets,
      title,
      selectedRow,
      placebet,
      selectedOdds,
      handleBookmakerOddsClick,
      closeBetSlip,
      handlePlaceBet,
      handleStakeChange,
      decreaseStake,
      increaseStake,
      handleQuickStake,
      isPlacingBet,
      stake,
      fancyQuickStakes,
      formatNumber,
      showNotification,
      highlightedMarkets,
      formatVolume,
      // ADDED: Exposure props for Bookmaker
      bookMakerShowCurrentExp,
      teamexposercurrent1,
      teamexposercurrent2,
      teamexposercurrent1Name,
      currentExpbgColor1,
      currentExpbgColor2,
      selectednameteam,
      // ADDED: Bet type for background color
      betType,
    }) => {
      const handleOddsClick = (market, type, price, runner) => {
        if (runner.status === "SUSPENDED") {
          showNotification(
            "This market is currently suspended. Betting is not allowed.",
            "warning"
          );
          return;
        }

        if (!price || price === 0) return;

        handleBookmakerOddsClick(market, type, price, runner);
      };

      return (
        <div className={`${title.toLowerCase().replace(" ", "-")} mt-2`}>
          <div className="match-odds-part mt-1">
            <div className="card-matchodds">
              <strong
                className="match-odds"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfoModal(true);
                }}
                style={{ cursor: "pointer" }}
              >
                Bookmaker{" "}
                <span className="marketinfo ml-2" style={{ cursor: "pointer" }}>
                  <FaInfoCircle />
                </span>
                <span className="marketinfo ml-2"></span>
              </strong>
              <span className="matched-count pull-right">
                Matched <strong>€ 5.8M</strong>
              </span>
            </div>

            <div className="table-responsive">
              <table
                className="table position-relative"
                style={{ marginBottom: 0 }}
                width="100%"
              >
                <thead>
                  <tr style={{ backgroundColor: "rgb(250, 248, 216)" }}>
                    <th align="left" className="market-name-th" valign="middle">
                      <p className="stack-info d-mobile">
                        <span>Min/Max</span> 50-10000
                      </p>
                    </th>
                    <th align="center" className="back-h" valign="middle">
                      <span>Back</span>
                    </th>
                    <th align="center" className="lay-h" valign="middle">
                      <span>Lay</span>
                      <p
                        className="stack-info d-desk"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "4px",
                        }}
                      >
                        <span>Min/Max</span> 50-10000
                      </p>
                    </th>
                  </tr>
                </thead>

                <tbody className="">
                  {Array.isArray(markets) && markets.length > 0 ? (
                    markets.slice(0, 1).map((market) =>
                      market.runners.map((runner) => {
                        const rowId = `${market.marketId}_${runner.selectionId}`;
                        const isSelected = selectedRow === rowId;

                        return (
                          <React.Fragment key={rowId}>
                            <tr
                              className="white-bg skyDetailsRow d-mobile"
                              style={{ backgroundColor: "rgb(250, 248, 216)" }}
                            >
                              <td
                                align="left"
                                className="selaction_name"
                                valign="middle"
                              >
                                <a>{runner.runnerName}</a>
                                <span className="forstrongchang">
                                  <strong className="red d-flex gap-1 align-items-center">
                                    <FaArrowRight />
                                  </strong>{" "}
                                  {bookMakerShowCurrentExp ? (
                                    teamexposercurrent1Name ===
                                      runner.runnerName ? (
                                      <div
                                        style={{
                                          color: currentExpbgColor1,
                                          display: "inline-block",
                                          marginLeft: "10px",
                                          fontSize: "12px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {teamexposercurrent1 === 0 ? (
                                          <></>
                                        ) : (
                                          "(" +
                                          formatNumber(teamexposercurrent1) +
                                          ")"
                                        )}
                                      </div>
                                    ) : (
                                      <div
                                        style={{
                                          color: currentExpbgColor2,
                                          display: "inline-block",
                                          marginLeft: "10px",
                                          fontSize: "12px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {teamexposercurrent2 === 0 ? (
                                          <></>
                                        ) : (
                                          "(" +
                                          formatNumber(teamexposercurrent2) +
                                          ")"
                                        )}
                                      </div>
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </span>

                                {/* ADDED: Exposure display for bookmaker - Mobile */}
                              </td>
                              <td
                                className="suspend-col d-mobile"
                                colSpan={2}
                                style={{ position: "relative" }}
                              >
                                <div className="d-flex justify-content-start">
                                  <div
                                    className="back1 back-1 bettinggrid"
                                    onClick={() =>
                                      handleOddsClick(
                                        market,
                                        "back",
                                        runner.ex.availableToBack[0]?.price,
                                        runner
                                      )
                                    }
                                    style={{
                                      cursor:
                                        runner.status === "SUSPENDED"
                                          ? "not-allowed"
                                          : "pointer",
                                      color: "#000",
                                      background: highlightedMarkets[
                                        `${rowId}-back`
                                      ]
                                        ? "#f8e71c"
                                        : "",
                                      transition: "background-color 0.5s ease",
                                      padding: "2px 5px",
                                      fontWeight: highlightedMarkets[
                                        `${rowId}-back`
                                      ]
                                        ? "bold"
                                        : "700",
                                    }}
                                  >
                                    <span style={{}}>
                                      {runner.ex.availableToBack[0]?.price || 0}
                                    </span>
                                    <small>
                                      {formatVolume(
                                        runner.ex.availableToBack[0]?.size || 0
                                      )}
                                    </small>
                                  </div>

                                  <div
                                    className="lay3 lay-1 bettinggrid"
                                    onClick={() =>
                                      handleOddsClick(
                                        market,
                                        "lay",
                                        runner.ex.availableToLay[0]?.price,
                                        runner
                                      )
                                    }
                                    style={{
                                      cursor:
                                        runner.status === "SUSPENDED"
                                          ? "not-allowed"
                                          : "pointer",
                                      color: "#000",
                                      background: highlightedMarkets[
                                        `${rowId}-lay`
                                      ]
                                        ? "#26f1f8"
                                        : "",
                                      transition: "background-color 0.5s ease",
                                      padding: "2px 5px",
                                      fontWeight: highlightedMarkets[
                                        `${rowId}-lay`
                                      ]
                                        ? "bold"
                                        : "700",
                                    }}
                                  >
                                    <span style={{}}>
                                      {runner.ex.availableToLay[0]?.price || 0}
                                    </span>
                                    <small>
                                      {formatVolume(
                                        runner.ex.availableToLay[0]?.size || 0
                                      )}
                                    </small>
                                  </div>
                                </div>

                                {runner.status === "SUSPENDED" && (
                                  <span className="suspend-text">
                                    SUSPENDED
                                  </span>
                                )}
                              </td>
                            </tr>

                            <tr
                              className="white-bg skyDetailsRow d-desk"
                              style={{ backgroundColor: "rgb(250, 248, 216)" }}
                            >
                              <td
                                align="left"
                                className="selaction_name"
                                valign="middle"
                              >
                                <a>{runner.runnerName}</a>
                                <span className="forstrongchang">
                                  <strong className="red d-flex gap-1 align-items-center">
                                    <FaArrowRight />{" "}
                                    {bookMakerShowCurrentExp ? (
                                      teamexposercurrent1Name ===
                                        runner.runnerName ? (
                                        <div
                                          style={{
                                            color: currentExpbgColor1,
                                            display: "inline-block",
                                            marginLeft: "10px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {teamexposercurrent1 === 0 ? (
                                            <></>
                                          ) : (
                                            "(" +
                                            formatNumber(teamexposercurrent1) +
                                            ")"
                                          )}
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            color: currentExpbgColor2,
                                            display: "inline-block",
                                            marginLeft: "10px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {teamexposercurrent2 === 0 ? (
                                            <></>
                                          ) : (
                                            "(" +
                                            formatNumber(teamexposercurrent2) +
                                            ")"
                                          )}
                                        </div>
                                      )
                                    ) : (
                                      <></>
                                    )}
                                  </strong>
                                </span>

                                {/* ADDED: Exposure display for bookmaker - Desktop */}
                              </td>
                              <td
                                className="suspend-col d-desk"
                                colSpan={6}
                                style={{ position: "relative" }}
                              >
                                <div className="d-flex justify-content-start">
                                  {[2, 1, 0].map((index) => (
                                    <div
                                      key={`back-${index}`}
                                      className={`back1 back-${index + 1
                                        } bettinggrid ${index > 0 ? "boxhide" : ""
                                        }`}
                                      onClick={() =>
                                        handleOddsClick(
                                          market,
                                          "back",
                                          runner.ex.availableToBack[index]
                                            ?.price,
                                          runner
                                        )
                                      }
                                      style={{
                                        cursor:
                                          runner.status === "SUSPENDED"
                                            ? "not-allowed"
                                            : "pointer",
                                        color: "#000",
                                        background: highlightedMarkets[
                                          `${rowId}-back-${index}`
                                        ]
                                          ? "#f8e71c"
                                          : "",
                                        transition:
                                          "background-color 0.5s ease",
                                        padding: "2px 5px",
                                        fontWeight: highlightedMarkets[
                                          `${rowId}-back-${index}`
                                        ]
                                          ? "bold"
                                          : "700",
                                      }}
                                    >
                                      <span style={{}}>
                                        {runner.ex.availableToBack[index]
                                          ?.price || ""}
                                      </span>
                                      <small>
                                        {formatVolume(
                                          runner.ex.availableToBack[index]
                                            ?.size || 0
                                        )}
                                      </small>
                                    </div>
                                  ))}

                                  {[0, 1, 2].map((index) => (
                                    <div
                                      key={`lay-${index}`}
                                      className={`lay3 lay-${index + 1
                                        } bettinggrid ${index > 0 ? "boxhide" : ""
                                        }`}
                                      onClick={() =>
                                        handleOddsClick(
                                          market,
                                          "lay",
                                          runner.ex.availableToLay[index]
                                            ?.price,
                                          runner
                                        )
                                      }
                                      style={{
                                        cursor:
                                          runner.status === "SUSPENDED"
                                            ? "not-allowed"
                                            : "pointer",
                                        color: "#000",
                                        background: highlightedMarkets[
                                          `${rowId}-lay-${index}`
                                        ]
                                          ? "#26f1f8"
                                          : "",
                                        transition:
                                          "background-color 0.5s ease",
                                        padding: "2px 5px",
                                        fontWeight: highlightedMarkets[
                                          `${rowId}-lay-${index}`
                                        ]
                                          ? "bold"
                                          : "700",
                                      }}
                                    >
                                      <span style={{}}>
                                        {runner.ex.availableToLay[index]
                                          ?.price || ""}
                                      </span>
                                      <small>
                                        {formatVolume(
                                          runner.ex.availableToLay[index]
                                            ?.size || 0
                                        )}
                                      </small>
                                    </div>
                                  ))}
                                </div>

                                {runner.status === "SUSPENDED" && (
                                  <span className="suspend-text">
                                    SUSPENDED
                                  </span>
                                )}
                              </td>
                            </tr>

                            {placebet && isSelected && (
                              <tr>
                                <td
                                  colSpan={window.innerWidth <= 768 ? 3 : 7}
                                  className="custom-td blue-bet-slip-back p-0"
                                >
                                  <div className="">
                                    <BetSlip
                                      selectedOdds={selectedOdds}
                                      stake={stake}
                                      handleStakeChange={handleStakeChange}
                                      decreaseStake={decreaseStake}
                                      increaseStake={increaseStake}
                                      handleQuickStake={handleQuickStake}
                                      handlePlaceBet={handlePlaceBet}
                                      closeBetSlip={closeBetSlip}
                                      isPlacingBet={isPlacingBet}
                                      fancyQuickStakes={fancyQuickStakes}
                                      formatNumber={formatNumber}
                                      // ADDED: Exposure props for Bookmaker
                                      matchOddsShowCurrentExp={false}
                                      bookMakerShowCurrentExp={
                                        bookMakerShowCurrentExp
                                      }
                                      teamexposercurrent1={teamexposercurrent1}
                                      teamexposercurrent2={teamexposercurrent2}
                                      teamexposercurrent1Name={
                                        teamexposercurrent1Name
                                      }
                                      currentExpbgColor1={currentExpbgColor1}
                                      currentExpbgColor2={currentExpbgColor2}
                                      selectednameteam={selectednameteam}
                                      MatchType="bookmaker"
                                      betType={betType}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )
                  ) : (
                    <Fakedata />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  );
  // Winner Section - Match Odds Component
  const MatchOddsSection = memo(() => (
    <div className="winner_bet">
      <Modal show={showLoginModal} onHide={closeLogin} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login closeModal={closeLogin} />
        </Modal.Body>
      </Modal>
      <div className="card-matchodds outer-divs">
        <strong
          className="match-odds outer-div1"
          onClick={(e) => {
            e.stopPropagation();
            setShowInfoModal(true);
          }}
          style={{ cursor: "pointer" }}
        >
          match odds
          <span className="marketinfo ml-2" style={{ cursor: "pointer" }}>
            <FaInfoCircle />
          </span>
        </strong>
        <span className="matched-count pull-right outer-div4">
          {/* Matched <strong>€ 89.3K</strong> */}
        </span>
      </div>

      {matchLoading && isInitialLoad ? (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading matches...</span>
          </div>
          <p className="mt-2">Loading matches...</p>
        </div>
      ) : (
        <>
          <table
            className="table position-relative"
            border="0"
            cellPadding="0"
            cellSpacing="0"
            style={{ position: "relative", marginBottom: 0 }}
            width="100%"
          >
            <thead>
              <tr>
                <th align="left" className="market-name-th" valign="middle">
                  <p className="stack-info d-mobile">
                    <span>Min/Max</span> 100-25000
                  </p>
                </th>
                <th align="center" className="back-h" valign="middle">
                  <span>Back</span>
                </th>
                <th align="center" className="lay-h" valign="middle">
                  <span>Lay</span>
                  <p
                    className="stack-info d-desk"
                    style={{ position: "absolute", top: "5px", right: "4px" }}
                  >
                    <span>Min/Max</span> 100-25000
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(Matches) && Matches.length > 0 ? (
                Matches.map((market) => {
                  // Find team name from matchesName
                  const teamInfo = matchesName.find(team => team.team_id === market.id);
                  const teamName = teamInfo ? teamInfo.team_name : market.team_name;

                  return (
                    <React.Fragment key={market.id}>
                      <tr className="game_status_new white-bg skyDetailsRow">
                        <td
                          align="left"
                          className="selaction_name"
                          valign="middle"
                        >
                          <a href="#">{teamName}</a>

                          <span className="forstrongchang">
                            <strong className="red d-flex gap-1 align-items-center">
                              <FaArrowRight />{" "}
                              {matchOddsShowCurrentExp ? (
                                teamexposercurrent1Name === teamName ? (
                                  <div
                                    style={{
                                      color: currentExpbgColor1,
                                      display: "inline-block",
                                      marginLeft: "10px",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {teamexposercurrent1 === 0 ? (
                                      <></>
                                    ) : (
                                      "(" +
                                      formatNumber(teamexposercurrent1) +
                                      ")"
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      color: currentExpbgColor2,
                                      display: "inline-block",
                                      marginLeft: "10px",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {teamexposercurrent2 === 0 ? (
                                      <></>
                                    ) : (
                                      "(" +
                                      formatNumber(teamexposercurrent2) +
                                      ")"
                                    )}
                                  </div>
                                )
                              ) : (
                                <></>
                              )}
                            </strong>
                          </span>
                        </td>
                        {window.innerWidth <= 768 && (
                          <td
                            className="suspend-col d-mobile"
                            colSpan={2}
                            style={{ position: "relative" }}
                          >
                            <div className="d-flex justify-content-start">
                              {market.availableToBack
                                .slice(0, 1)
                                .map((back, index) => (
                                  <div
                                    key={index}
                                    className="back1 back-1 bettinggrid"
                                    onClick={() =>
                                      handleOddsClick(
                                        back.price,
                                        "back",
                                        market,
                                        teamName, // Updated to use dynamic teamName
                                        market.id
                                      )
                                    }
                                    style={{
                                      cursor:
                                        market.status === "SUSPENDED"
                                          ? "not-allowed"
                                          : "pointer",
                                      color: "#000",
                                      background: highlightedMarkets[
                                        `${market.id}-back-${index}`
                                      ]
                                        ? "#f8e71c"
                                        : "",
                                      transition: "background-color 0.5s ease",
                                      padding: "2px 5px",
                                      fontWeight: highlightedMarkets[
                                        `${market.id}-back-${index}`
                                      ]
                                        ? "bold"
                                        : "700",
                                    }}
                                  >
                                    <span className="backvalue">
                                      {back.price}
                                    </span>
                                    <small>{formatVolume(back.size)}</small>
                                  </div>
                                ))}
                              {market.availableToLay
                                .slice(0, 1)
                                .map((lay, index) => (
                                  <div
                                    key={index}
                                    className="lay3 lay-1 bettinggrid"
                                    onClick={() =>
                                      handleOddsClick(
                                        lay.price,
                                        "lay",
                                        market,
                                        teamName, // Updated to use dynamic teamName
                                        market.id
                                      )
                                    }
                                    style={{
                                      cursor:
                                        market.status === "SUSPENDED"
                                          ? "not-allowed"
                                          : "pointer",
                                      color: "#000",
                                      background: highlightedMarkets[
                                        `${market.id}-lay-${index}`
                                      ]
                                        ? "#26f1f8"
                                        : "",
                                      transition: "background-color 0.5s ease",
                                      padding: "2px 5px",
                                      fontWeight: highlightedMarkets[
                                        `${market.id}-lay-${index}`
                                      ]
                                        ? "bold"
                                        : "700",
                                    }}
                                  >
                                    <span className="backvalue" style={{}}>
                                      {lay.price}
                                    </span>
                                    <small>{formatVolume(lay.size)}</small>
                                  </div>
                                ))}
                            </div>
                            {market.status === "SUSPENDED" && (
                              <span className="suspend-text">SUSPENDED</span>
                            )}
                          </td>
                        )}

                        {window.innerWidth > 768 && (
                          <td
                            className="suspend-col d-desk count"
                            colSpan={6}
                            style={{ position: "relative" }}
                          >
                            <div className="d-flex justify-content-start">
                              {market.availableToBack
                                .slice(0, 3)
                                .reverse()
                                .map((back, index) => (
                                  <div
                                    key={index}
                                    className={`back1 back-${3 - index
                                      } bettinggrid ${index === 0
                                        ? "boxhide"
                                        : index === 1
                                          ? "boxhide"
                                          : ""
                                      }`}
                                    onClick={() =>
                                      handleOddsClick(
                                        back.price,
                                        "back",
                                        market,
                                        teamName, // Updated to use dynamic teamName
                                        market.id
                                      )
                                    }
                                    style={{
                                      cursor:
                                        market.status === "SUSPENDED"
                                          ? "not-allowed"
                                          : "pointer",
                                      color: "#000",
                                      background: highlightedMarkets[
                                        `${market.id}-back-${index}`
                                      ]
                                        ? "#f8e71c"
                                        : "",
                                      transition: "background-color 0.5s ease",
                                      padding: "2px 5px",
                                      fontWeight: highlightedMarkets[
                                        `${market.id}-back-${index}`
                                      ]
                                        ? "bold"
                                        : "700",
                                    }}
                                  >
                                    <span className="backvalue" style={{}}>
                                      {back.price}
                                    </span>
                                    <small>{formatVolume(back.size)}</small>
                                  </div>
                                ))}

                              {market.availableToLay
                                .slice(0, 3)
                                .map((lay, index) => (
                                  <div
                                    key={index}
                                    className={`lay3 lay-${index + 1
                                      } bettinggrid ${index === 1
                                        ? "boxhide"
                                        : index === 2
                                          ? "boxhide"
                                          : ""
                                      }`}
                                    onClick={() =>
                                      handleOddsClick(
                                        lay.price,
                                        "lay",
                                        market,
                                        teamName, // Updated to use dynamic teamName
                                        market.id
                                      )
                                    }
                                    style={{
                                      cursor:
                                        market.status === "SUSPENDED"
                                          ? "not-allowed"
                                          : "pointer",
                                      color: "#000",
                                      background: highlightedMarkets[
                                        `${market.id}-lay-${index}`
                                      ]
                                        ? "#26f1f8"
                                        : "",
                                      transition: "background-color 0.5s ease",
                                      padding: "2px 5px",
                                      fontWeight: highlightedMarkets[
                                        `${market.id}-lay-${index}`
                                      ]
                                        ? "bold"
                                        : "700",
                                    }}
                                  >
                                    <span className="backvalue" style={{}}>
                                      {lay.price}
                                    </span>
                                    <small>{formatVolume(lay.size)}</small>
                                  </div>
                                ))}
                            </div>
                            {market.status === "SUSPENDED" && (
                              <span className="suspend-text">SUSPENDED</span>
                            )}
                          </td>
                        )}
                      </tr>

                      {placebet && selectedOdds && selectedRow === market.id && (
                        <tr>
                          <td
                            colSpan={window.innerWidth <= 768 ? 3 : 7}
                            className="custom-td blue-bet-slip-back p-0"
                          >
                            <div className="">
                              <BetSlip
                                selectedOdds={selectedOdds}
                                stake={stake}
                                handleStakeChange={handleStakeChange}
                                decreaseStake={decreaseStake}
                                increaseStake={increaseStake}
                                handleQuickStake={handleQuickStake}
                                handlePlaceBet={handlePlaceBet}
                                closeBetSlip={closeBetSlip}
                                isPlacingBet={isPlacingBet}
                                fancyQuickStakes={fancyQuickStakes}
                                formatNumber={formatNumber}
                                // ADDED: Exposure props for Match Odds
                                matchOddsShowCurrentExp={matchOddsShowCurrentExp}
                                bookMakerShowCurrentExp={false}
                                teamexposercurrent1={teamexposercurrent1}
                                teamexposercurrent2={teamexposercurrent2}
                                teamexposercurrent1Name={teamexposercurrent1Name}
                                currentExpbgColor1={currentExpbgColor1}
                                currentExpbgColor2={currentExpbgColor2}
                                selectednameteam={selectednameteam}
                                MatchType="match_odds"
                                betType={betType}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <Fakedata />
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  ));

  // Fancy Bets Section - WITHOUT exposure display
  const FancyBetsSection = memo(() => (
    <div className="fancybetcontent">
      <div className="headinggame">
        {/* <ul className="special_bets-tab">
          {tabsinner.map((tab) => (
            <li
              key={tab}
              className={selectedTab === tab ? "select" : ""}
              onClick={() => handleTabClick(tab)}
            >
              <span>{tab}</span>
            </li>
          ))}
        </ul> */}
      </div>

      <div>
        <div className="tab-content-fancy">
          {selectedTab === "ALL" && (
            <>
              {fancyLoading && isInitialLoad ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">
                      Loading fancy bets...
                    </span>
                  </div>
                  <p className="mt-2">Loading fancy bets...</p>
                </div>
              ) : (
                <div className="indian-fancy-part skyDetailsRow">
                  <div className="table-part position-relative">
                    <table
                      border="0"
                      cellPadding="0"
                      cellSpacing="0"
                      className="table"
                      style={{ margin: 0 }}
                      width="100%"
                    >
                      <thead>
                        <tr className="fancy-row">
                          <th
                            align="center"
                            className="f-col-1"
                            valign="middle"
                            width="50%"
                          ></th>
                          <th align="center" valign="middle" width="10%"></th>
                          <th
                            align="center"
                            className="pink_bg f-col-3"
                            valign="middle"
                            width="18%"
                          >
                            No
                          </th>
                          <th
                            align="center"
                            className="blue_bg f-col-3"
                            valign="middle"
                            width="18%"
                          >
                            Yes
                          </th>
                          <th
                            align="center"
                            className="d-desk f-col-4"
                            valign="middle"
                            width="25%"
                          >
                            Min/Max
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(fancylist) && fancylist.length > 0 ? (
                          fancylist.map((market) => {
                            const rowId = market.SelectionId || market.id;
                            const isSelected = selectedRow === rowId;

                            // Check if this market should be highlighted
                            const isBackHighlighted =
                              highlightedMarkets[`${rowId}-back`];
                            const isLayHighlighted =
                              highlightedMarkets[`${rowId}-lay`];

                            return (
                              <React.Fragment key={rowId}>
                                <tr>
                                  <td
                                    align="left"
                                    className="time-text"
                                    style={{
                                      padding: "1px 8px",
                                      color: "#000",
                                      fontWeight: "bold",
                                    }}
                                    valign="middle"
                                  >
                                    <div>{market.RunnerName}</div>
                                    <small>
                                      <strong className="red d-flex gap-1 align-items-center">
                                        <FaArrowRight />{" "}
                                        {market.currentScore || 0}
                                      </strong>
                                    </small>
                                  </td>
                                  <td
                                    align="left"
                                    className="team_name"
                                    style={{ position: "relative" }}
                                    valign="middle"
                                  >
                                    <span className="icon-help d-mobile">
                                      <FaInfoCircle
                                        size={15}
                                        color="#0dcaf0"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          toggleInfo(market.SelectionId)
                                        }
                                      />
                                      {openInfoId === market.SelectionId && (
                                        <div className="text-center text-muted mt-1 basgefont z-2 position-absolute top-2 lef-0 bg-white">
                                          <div>Min/Max:</div>{" "}
                                          {market.min || 100}/
                                          {market.max || 1000}
                                        </div>
                                      )}
                                    </span>
                                    <button className="d-desk bg_book" onClick={() => setShowOpenBook(true)}>
                                      Book
                                    </button>
                                  </td>
                                  <td
                                    align="center"
                                    className="padding_0"
                                    colSpan="2"
                                    style={{ position: "relative" }}
                                    valign="middle"
                                  >
                                    <div className="betbox">
                                      <a
                                        className={`td_btn pink_bg ${market.GameStatus === "SUSPENDED" ||
                                          market.GameStatus === "BALL RUNNING"
                                          ? "suspended-odds"
                                          : ""
                                          }`}
                                        onClick={() =>
                                          handleFancyOddsClick(
                                            market.LayPrice1,
                                            "lay",
                                            market,
                                            "no"
                                          )
                                        }
                                        style={{
                                          cursor:
                                            market.GameStatus === "SUSPENDED" ||
                                              market.GameStatus === "BALL RUNNING"
                                              ? "not-allowed"
                                              : "pointer",
                                          transition:
                                            "background-color 0.5s ease",
                                          background: isLayHighlighted
                                            ? "#f8e71c"
                                            : "",
                                          fontWeight: isLayHighlighted
                                            ? "bold"
                                            : "normal",
                                        }}
                                      >
                                        <span className="novalue">
                                          {market.LayPrice1 || 0}
                                        </span>
                                        <span className="novalue1">
                                          {formatVolume(market.LaySize1 || 0)}
                                        </span>
                                      </a>
                                    </div>
                                    <div
                                      className="betbox"
                                      style={{ right: 0 }}
                                    >
                                      <a
                                        className={`td_btn blue_bg ${market.GameStatus === "SUSPENDED" ||
                                          market.GameStatus === "BALL RUNNING"
                                          ? "suspended-odds"
                                          : ""
                                          }`}
                                        onClick={() =>
                                          handleFancyOddsClick(
                                            market.BackPrice1,
                                            "back",
                                            market,
                                            "yes"
                                          )
                                        }
                                        style={{
                                          cursor:
                                            market.GameStatus === "SUSPENDED" ||
                                              market.GameStatus === "BALL RUNNING"
                                              ? "not-allowed"
                                              : "pointer",
                                          transition:
                                            "background-color 0.5s ease",
                                          background: isBackHighlighted
                                            ? "#26f1f8"
                                            : "",
                                          fontWeight: isBackHighlighted
                                            ? "bold"
                                            : "normal",
                                        }}
                                      >
                                        <span className="novalue">
                                          {market.BackPrice1 || 0}
                                        </span>
                                        <span className="novalue1">
                                          {formatVolume(market.BackSize1 || 0)}
                                        </span>
                                      </a>
                                    </div>
                                    {(market.GameStatus === "SUSPENDED" ||
                                      market.GameStatus === "BALL RUNNING") && (
                                        <div className="suspend-text">
                                          {market.GameStatus === "SUSPENDED"
                                            ? "SUSPENDED"
                                            : "BALL RUNNING"}
                                        </div>
                                      )}
                                  </td>
                                  <td
                                    align="center"
                                    className="d-desk"
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: "bold",
                                      whiteSpace: "nowrap",
                                      verticalAlign: "middle",
                                      textAlign: "center",
                                    }}
                                    valign="middle"
                                  >
                                    {market.min || 100}-{market.max || 1000}
                                  </td>
                                </tr>

                                {placebet && isSelected && (
                                  <tr>
                                    <td
                                      colSpan="5"
                                      style={{
                                        backgroundColor:
                                          getBetSlipBackgroundColor(betType),
                                      }}
                                      className="custom-td blue-bet-slip-back p-0"
                                    >
                                      <div className="">
                                        <FancyBetSlip
                                          selectedOdds={selectedOdds}
                                          stake={stake}
                                          handleStakeChange={handleStakeChange}
                                          decreaseStake={decreaseStake}
                                          increaseStake={increaseStake}
                                          handleQuickStake={handleQuickStake}
                                          handlePlaceBet={handlePlaceBet}
                                          closeBetSlip={closeBetSlip}
                                          isPlacingBet={isPlacingBet}
                                          fancyQuickStakes={fancyQuickStakes}
                                          formatNumber={formatNumber}
                                          betType={betType}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                        ) : (
                          <Fakedata />
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {selectedTab === "Fancy" && (
            <div className="text-center p-4">
              <p className="text-muted">
                Fancy bets content will be displayed here
              </p>
            </div>
          )}
          {selectedTab === "Line Markets" && (
            <div className="text-center p-4">
              <p className="text-muted">
                Line Markets content will be displayed here
              </p>
            </div>
          )}
          {selectedTab === "Ball by Ball" && (
            <div className="text-center p-4">
              <p className="text-muted">
                Ball by Ball content will be displayed here
              </p>
            </div>
          )}
          {selectedTab === "Meter Markets" && (
            <div className="text-center p-4">
              <p className="text-muted">
                Meter Markets content will be displayed here
              </p>
            </div>
          )}
          {selectedTab === "Khado Markets" && (
            <div className="text-center p-4">
              <p className="text-muted">
                Khado Markets content will be displayed here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <CustomNotification
        notification={notification}
        onClose={closeNotification}
      />
      <section className="cricket_design">
        <div className="scroredesign d-md-flex d-none justify-content-between align-items-center">
          <div className="scorecard">Score Card</div>
          <div
            onClick={togglescore}
            className="d-flex justify-content-between align-items-center togglebuttonscore gap-2"
          >
            <MdOutlineScoreboard />
            <span>Score Card</span>
          </div>
        </div>

        <div className="d-block d-md-none px-2 pb-0  cricketpagemobile border-0">
          <div className="d-flex justify-content-between align-items-center watchtv_online headermobileall">
            <div
              className="bethistroydesign"
              onClick={() => setShowBetHistoryModal(true)}
            >
              <h3 className="title text-white mb-0">Bet History</h3>
            </div>

            {/* <div className="text-white" onClick={() => setActiveTab("alltoggle")}> <FaTv /></div> */}
            <div
              className="text-white"
              style={{ cursor: "pointer" }}
              onClick={() => setShowToggle((prev) => !prev)}
            >
              <FaTv size={20} />
            </div>
          </div>
        </div>

        {showToggle && (
          <div className="d-flex justify-content-between align-items-center buttondesignalltab">
            {/* TV BUTTON */}
            <div
              className={`text-white w-100 d-flex align-items-center justify-content-center gap-2 buttonall_new
              ${activeTab === "tv" ? "active" : ""}`}
              onClick={() => setActiveTab("tv")}
            >
              <FaTv />
              <span>Watch Live</span>
            </div>

            {/* SCORE BUTTON */}
            <div
              className={`w-100 d-flex justify-content-center align-items-center gap-2 buttonall_new
              ${activeTab === "score" ? "active" : ""}`}
              onClick={() => setActiveTab("score")}
            >
              <MdOutlineScoreboard />
              <span>Live Score</span>
            </div>
          </div>
        )}

        {/* TV VIEW */}
        {activeTab === "tv" && (
          <div className="matchtv mt-2 position-relative">
            {/* CLOSE BUTTON */}
            <div
              className="position-absolute top-0 end-0 p-2"
              style={{ cursor: "pointer", zIndex: 5 }}
              onClick={() => setActiveTab(null)}
            >
              <IoIosCloseCircleOutline size={25} color="#ff4d4f" />
            </div>

            {/* FULLSCREEN BUTTON */}
            <div
              className="position-absolute top-0 start-0 p-2"
              style={{ cursor: "pointer", zIndex: 5 }}
              onClick={toggleFullScreen}
            >
              {isFullScreen ? (
                <FaCompress size={22} color="#fff" />
              ) : (
                <FaExpand size={22} color="#fff" />
              )}
            </div>

            <iframe
              ref={iframeRef}
              src={`https://dtv.diamondapi.uk/ctv/index.html?eventId=${event_id}`}
              title="Live Match"
              width="100%"
              height="200"
              style={{
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#000",
              }}
              allowFullScreen
            />
          </div>
        )}

        {/* SCORE VIEW */}
        {activeTab === "score" && (
          <iframe
            width="100%"
            height="200"
            src="https://demo.livestream11.com/user/826879750/Android/103.59.75.127/6fe6abb1-df21-4446-af41-3de426ba11d7"
            frameBorder="0"
          />
        )}

        <div className="d-md-block d-none">
          {scorecard && (
            <>
              <iframe
                width="100%"
                src="https://demo.livestream11.com/user/826879750/Android/103.59.75.127/6fe6abb1-df21-4446-af41-3de426ba11d7"
                frameBorder="0"
              ></iframe>
            </>
          )}
        </div>

        {successMessage && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage("")}
            ></button>
          </div>
        )}

        {activeTab === "mybet" && (
          <div className="betting betting_bet">
            <table className="table position-relative text-start table-sm table-bordered">
              <thead>
                <tr>
                  <th className="text-start">Team</th>
                  <th className="text-start">Odds</th>
                  <th className="text-start">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {currentBets.map((bet) => (
                  <tr
                    key={bet._id}
                    className={`placebetdesignall ${bet.bet_on === "back" ? "backsuccess" : "laydesign"
                      }`}
                  >
                    <td className="text-start">{bet.team}</td>
                    <td className="text-start">{bet.odd}</td>
                    <td className="text-start">
                      {bet.total} {bet.bet_on}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Add Pagination Controls Here */}
            {totalPages > 1 && (
              <div className="pagination d-flex justify-content-between align-items-center mt-3 p-2">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ◀ Prev
                </button>

                <div className="page-info">
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next ▶
                </button>
              </div>
            )}

            {currentBets.length === 0 && (
              <div className="text-center p-3">
                <p className="text-muted">No bets found</p>
              </div>
            )}
          </div>
        )}
        <div>
          <MyBetsComponent
            showMyBets={showMyBets}
            betsLoading={betsLoading}
            myBets={myBets}
          />
        </div>

        <div className="cricketbettingalldesign">
          <MatchOddsSection />

          <BookmakerTable
            markets={bookmakerList}
            title="Bookmaker"
            selectedRow={selectedRow}
            placebet={placebet}
            selectedOdds={selectedOdds}
            handleBookmakerOddsClick={handleBookmakerOddsClick}
            closeBetSlip={closeBetSlip}
            handlePlaceBet={handlePlaceBet}
            handleStakeChange={handleStakeChange}
            decreaseStake={decreaseStake}
            increaseStake={increaseStake}
            handleQuickStake={handleQuickStake}
            isPlacingBet={isPlacingBet}
            stake={stake}
            fancyQuickStakes={fancyQuickStakes}
            formatNumber={formatNumber}
            showNotification={showNotification}
            highlightedMarkets={highlightedMarkets}
            formatVolume={formatVolume}
            // ADDED: Exposure props for Bookmaker
            bookMakerShowCurrentExp={bookMakerShowCurrentExp}
            teamexposercurrent1={teamexposercurrent1}
            teamexposercurrent2={teamexposercurrent2}
            teamexposercurrent1Name={teamexposercurrent1Name}
            currentExpbgColor1={currentExpbgColor1}
            currentExpbgColor2={currentExpbgColor2}
            selectednameteam={selectednameteam}
            betType={betType}
          />

          <div className="fancybetsportsbook mt-2">
            <div className="tabsfancy">
              <button
                style={{ cursor: "pointer" }}
                className={`buttontabefancy fancybetbutton ${fancybet === "fancybetall" ? "active" : ""
                  }`}
                onClick={() => {
                  fancybetshow("fancybetall");
                  setShowInfoModal(true);
                }}
              >
                Fancybet
                <span>
                  <FaInfoCircle />
                </span>
              </button>
              {/* <button
                className={`buttontabefancy sportsbookbutton ${fancybet === "sportsbookall" ? 'active' : ''}`}
                onClick={() => fancybetshow("sportsbookall")}
              >
                Sportsbook
                <span onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
                  <IoMdInformationCircleOutline />
                </span>
              </button> */}
            </div>

            <div className="tabsfancycontent">
              {fancybet === "fancybetall" && <FancyBetsSection />}

              {fancybet === "sportsbookall" && (
                <div className="sportsbookcontent text-center p-4">
                  <p className="text-muted">
                    Sportsbook content will be displayed here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showBetHistoryModal && (
          <div
            className="bet-history-overlay"
            onClick={() => setShowBetHistoryModal(false)}
          >
            <div
              className="bet-history-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h4>Bet History</h4>
                <button
                  className="close-btn"
                  onClick={() => setShowBetHistoryModal(false)}
                >
                  ✕
                </button>
              </div>
              <Unsettledbet />
            </div>
          </div>
        )}

        {showInfoModal && (
          <div
            className="info-modal-overlay"
            onClick={() => setShowInfoModal(false)}
          >
            <div className="info-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="mb-0">Cricket Rules & Information</h5>
                <FaTimes
                  className="close-icon"
                  onClick={() => setShowInfoModal(false)}
                />
              </div>

              <div className="modal-body">
                <p>
                  1. Cricket General :- If a ball is not bowled during a
                  competition, series or match then all bets will be void except
                  for those on any market that has been unconditionally
                  determined.
                </p>

                <p>
                  2. Cricket General :- If a match is shortened by weather, all
                  bets will be settled according to the official result.
                </p>

                <p>
                  3. Cricket General :- In the event of a match being decided by
                  a bowl-off or toss of the coin, all bets will be void.
                </p>

                <p>
                  4. Cricket Test matches :- If a match starts but is later
                  abandoned for any reason other than weather, bets may be void.
                </p>

                <p>
                  5. In case anyone is found using 2 different IDs and logging
                  in from same IP his winning will be cancelled.
                </p>

                <p>
                  6. Cricket Test matches :- If the match is not completed
                  within five days, bets will be void.
                </p>

                <p>
                  7. Cricket Limited Over matches :- If match is declared{" "}
                  <strong>No Result</strong>, bets will be void.
                </p>

                <p>
                  8. Cricket Limited Over matches :- New toss on reserve day
                  will void late bets.
                </p>

                <p>
                  9. Rain / reduced overs rules apply as per session criteria.
                </p>

                <p>
                  10. Multiple Bets :- Same time multiple bets by same user will
                  be void.
                </p>
              </div>
              <div className="modal-footer fixed-footer">
                <button
                  className="ok-btn"
                  onClick={() => setShowInfoModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {showOpenBook && (
          <div className="book-backdrop">
            <div className="book-modal">
              {/* HEADER */}
              <div className="book-header">
                <span>Book</span>
                <button
                  className="close-btn position-relative top-0"
                  onClick={() => setShowOpenBook(false)}
                >
                  ✕
                </button>
              </div>

              {/* TABLE */}
              <table className="book-table">
                <thead>
                  <tr>
                    <th>Runs</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="2" className="no-data">
                      No data!
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Cricket;
