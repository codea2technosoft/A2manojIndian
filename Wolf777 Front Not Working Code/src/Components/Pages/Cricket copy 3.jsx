import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from "axios";
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { FiClock } from "react-icons/fi";
import Ladder from '../Pages/Ladder'
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
import ladder from '../../assets/images/ledder.svg'
import {
  encryptData,
  decryptData,
  makeEncryptedRequest,
} from "../../utils/encryption";
import MyBets from "./Bethistory";
import Unsettledbet from "./Unsettledbet";
import Matchbets from './Matchbets'
import Fancybetall from './Fancybetall'
import Homepageslider from './Home'
import Completebet from "./Completebet";

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

// BetSlip Component for Modal
// BetSlipModalContent Component
const BetSlipModalContent = memo(({
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
  matchOddsShowCurrentExp,
  bookMakerShowCurrentExp,
  teamexposercurrent1,
  teamexposercurrent2,
  teamexposercurrent1Name,
  teamexposercurrent2Name, // ✅ इस prop को add किया
  currentExpbgColor1,
  currentExpbgColor2,
  selectednameteam,
  MatchType,
  betType,
  isModal = true,
  onAutoClose,
}) => {
  const stakeInputRef = useRef(null);
  const timeoutRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(8);

  ///////////////////////////////////////
  const navigate = useNavigate();

  // const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


    const baseUrl = process.env.REACT_APP_BACKEND_API;

  const fetchwallet_amount = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const accessToken = localStorage.getItem("accessToken");

      // Not logged in
      if (!userId || !accessToken) {
        return;
      }

      const response = await axios.get(
        `${baseUrl}/wallet-amount?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data) {
        const {
          status_code,
          amount,
          exp,
          token: serverToken, // 👈 token from backend
        } = response.data;

        // 🔐 ONE TIME LOGIN CHECK
        if (
          status_code !== 1 ||
          !serverToken ||
          serverToken !== accessToken
        ) {
          localStorage.clear();
          navigate("/login");
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching wallet amount:", error);
    }
  }, [baseUrl, navigate]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      if (onAutoClose) {
        onAutoClose();
      }
      closeBetSlip();
    }, 8000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearInterval(countdownInterval);
    };
  }, [closeBetSlip, onAutoClose]);

  useEffect(() => {
    if (stakeInputRef.current) {
      stakeInputRef.current.focus();
    }
  }, [stake]);

  const getInputBackgroundColor = () => {
    if (betType === "back") {
      return "#72bbef";
    } else if (betType === "lay") {
      return "#faa9ba";
    }
    return "#ffffff";
  };

  const getInputBorderColor = () => {
    if (betType === "back") {
      return "#28a745";
    } else if (betType === "lay") {
      return "#dc3545";
    }
    return "#ced4da";
  };

  // Function to render exposure value with team name
  const renderExposureValue = () => {
    if (!selectednameteam || (!teamexposercurrent1 && !teamexposercurrent2)) {
      return null;
    }

    const isTeam1 = teamexposercurrent1Name === selectednameteam;
    const exposureValue = isTeam1 ? teamexposercurrent1 : teamexposercurrent2;
    const teamName = isTeam1 ? teamexposercurrent1Name : teamexposercurrent2Name;
    const color = isTeam1 ? currentExpbgColor1 : currentExpbgColor2;

    if (exposureValue === 0) {
      return null;
    }

    return (
      <div className="exposure-display mt-2 p-2 rounded"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: `1px solid ${color}`,
          fontSize: '12px'
        }}>
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-white">
            {teamName} Exposure:
          </span>
          <span
            className="fw-bold"
            style={{
              color: color,
              fontSize: '13px'
            }}
          >
            {formatNumber(exposureValue)}
          </span>
        </div>
      </div>
    );
  };

  // Exposure Summary Section
  const renderExposureSummary = () => {
    if (MatchType !== "bookmaker") return null;

    const showTeam1 = Number(teamexposercurrent1) !== 0;
    const showTeam2 = Number(teamexposercurrent2) !== 0;

    // agar dono 0 ho → pura summary hi mat dikhao
    if (!showTeam1 && !showTeam2) return null;

    return (
      <div className="exposure-summary mt-3">
        <hr className="my-2" />
        <div className="row small text-muted">

          {/* Team 1 Exposure */}
          {showTeam1 && (
            <div className="col-6">
              <div
                className="text-truncate"
                title={teamexposercurrent1Name}
              >
                {teamexposercurrent1Name}:
              </div>
              <div
                className="fw-bold"
                style={{ color: currentExpbgColor1 }}
              >
                {formatNumber(teamexposercurrent1)}
              </div>
            </div>
          )}

          {/* Team 2 Exposure */}
          {showTeam2 && (
            <div className="col-6 text-end">
              <div
                className="text-truncate"
                title={teamexposercurrent2Name}
              >
                {teamexposercurrent2Name}:
              </div>
              <div
                className="fw-bold"
                style={{ color: currentExpbgColor2 }}
              >
                {formatNumber(teamexposercurrent2)}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };



  return (
    <div className="bet-slip-modal-content" onMouseEnter={fetchwallet_amount}>
      <div className="modal-header">
        <h5 className="modal-title">Place Your Bet</h5>
        <div className="d-flex align-items-center gap-2">
          <button type="button" className="btn-close" onClick={closeBetSlip}>
            <FaTimes />
          </button>
        </div>
      </div>

      <div className="modal-body">
        {/* Team Name with Exposure (Top Section) */}
        <div className="team-exposure-header mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 text-white">
              {/* {selectednameteam} */}
              {selectedOdds?.eventName || "Match Odds"}
              {/* Exposure value in parentheses like in your table */}
              {/* {teamexposercurrent1Name === selectednameteam && teamexposercurrent1 !== 0 && (
                <span className="ms-2" style={{ color: currentExpbgColor1, fontSize: '12px' }}>
                  ({formatNumber(teamexposercurrent1)})
                </span>
              )}
              {teamexposercurrent2Name === selectednameteam && teamexposercurrent2 !== 0 && (
                <span className="ms-2" style={{ color: currentExpbgColor2, fontSize: '12px' }}>
                  ({formatNumber(teamexposercurrent2)})
                </span>
              )} */}
            </h6>
            <span
              className={`text_all_bet fw-bold ${betType === "back" ? "text-success" : "text-danger"
                }`}
            >
              {
                (MatchType === "fancy" || MatchType === "bookmaker")
                  ? betType === "back"
                    ? "Yes"
                    : "No"
                  : betType === "back"
                    ? "Lagai"
                    : "Khai"
              }
            </span>
          </div>

          {/* Market Name */}
          {/* <div className="mt-1">
            <small className="text-muted">
             
            </small>
          </div> */}
        </div>

        {/* Bet Details Section */}
        <div className="bet-details mb-3" style={{
          backgroundColor: getInputBackgroundColor(),
          borderColor: getInputBorderColor(),
          fontWeight: 'bold'
        }}>
          <div className="d-flex gap-2 justify-content-between pricedesign mb-2">
            <div>
              <label htmlFor="">Price</label>
              <input
                type="text"
                className="form-control custum_form text-center"
                value={selectedOdds?.price || selectedOdds?.value || ""}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="">Size</label>
              <input
                type="text"
                className="form-control custum_form text-center"
                value={selectedOdds?.size ? formatNumber(selectedOdds.size) : "0"}
                readOnly
              />
            </div>
            <div>
              <label htmlFor="">Stake</label>
              <input
                ref={stakeInputRef}
                type="text"
                placeholder=""
                className="form-control text-center"
                value={stake}
                onChange={handleStakeChange}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>
        </div>

        {/* Exposure Information */}
        {/* <div className="exposure-info-section mb-3">
          <div className="card bg-dark border-secondary">
            <div className="card-body p-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Selected Team:</small>
                  <div className="text-white fw-bold">{selectednameteam}</div>
                </div>
                <div className="text-end">
                  <small className="text-muted">Current Exposure:</small>
                  <div 
                    className="fw-bold" 
                    style={{ 
                      color: teamexposercurrent1Name === selectednameteam ? currentExpbgColor1 : currentExpbgColor2,
                      fontSize: '14px'
                    }}
                  >
                    {formatNumber(teamexposercurrent1Name === selectednameteam ? teamexposercurrent1 : teamexposercurrent2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Timer and Place Bet Button */}
        <div className="d-flex gap-2 justify-content-between mb-2">
          <div className="timer-display">
            <FiClock />
            <span>Timer</span>
            <span>{timeLeft}s</span>
          </div>

          <div>
            <button
              type="button"
              className={`btn btn_custum_ho ${betType === 'back' ? 'btn-success' : 'btn-danger'}`}
              onClick={handlePlaceBet}
              onMouseEnter={fetchwallet_amount}
              disabled={!stake || parseInt(stake) === 0 || isPlacingBet}
            >
              {isPlacingBet ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Placing Bet...
                </>
              ) : (
                `Place ${betType === 'back' ? '' : ''} Bet`
              )}
            </button>
          </div>
        </div>

        {/* Quick Stakes */}
        <div className="quick-stakes">
          <div className="d-flex flex-wrap gap-2 justify-content-between">
            {fancyQuickStakes.map((amount) => (
              <button
                key={amount}
                className={`button_all_bet ${betType === 'back' ? 'btn-outline-success' : 'btn-outline-danger'}`}
                onClick={() => {
                  handleQuickStake(amount);
                  fetchwallet_amount();
                }}
              >
                {formatNumber(amount)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary of Exposure */}
        {renderExposureSummary()}
      </div>
    </div>
  );
});

// Original BetSlip component
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
    matchOddsShowCurrentExp,
    bookMakerShowCurrentExp,
    teamexposercurrent1,
    teamexposercurrent2,
    teamexposercurrent1Name,
    teamexposercurrent2Name, // ✅ add this
    currentExpbgColor1,
    currentExpbgColor2,
    selectednameteam,
    MatchType,
    betType,
  }) => {
    const stakeInputRef = useRef(null);

    useEffect(() => {
      if (stakeInputRef.current) {
        stakeInputRef.current.focus();
      }
    }, [stake]);

    const getBetSlipBackgroundColor = () => {
      if (betType === "back") {
        return "#72bbef";
      } else if (betType === "lay") {
        return "#ff6b6b";
      }
      return "#f8f9fa";
    };

    return (
      <div className="py-2">
        <div className="fancy-quick-tr placebet" >
          <div className="slip-back">
            <div className="">
              <div className="datanameandinput d-flex align-items-center stacksCol justify-content-end px-1">
                <div className="d-flex justify-content-end gap-2 only_pc_100 ">
                  <div className="pb-0 hideMobile">
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
                  </div>

                  <div className="pb-0 hideMobile">
                    <button
                      className="btn btn-send text-light"
                      onClick={handlePlaceBet}
                      disabled={!stake || parseInt(stake) === 0 || isPlacingBet}
                    >
                      {isPlacingBet ? <div className="btn_loader"></div> : "Place Bet"}
                    </button>
                  </div>
                </div>
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
                    {isPlacingBet ? <div className="btn_loader"></div> : "Place Bet"}
                  </button>
                </div>
              </div>
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
    betType,
  }) => {
    const stakeInputRef = useRef(null);

    useEffect(() => {
      if (stakeInputRef.current) {
        stakeInputRef.current.focus();
      }
    }, [stake]);

    return (
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
                          {isPlacingBet ? <div className="btn_loader"></div> : "Place Bet"}
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
                    {isPlacingBet ? <div className="btn_loader"></div> : "Place Bet"}
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

// Fixed BookmakerTable Component with Exposure Data
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
    bookMakerShowCurrentExp,
    teamexposercurrent1,
    teamexposercurrent2,
    teamexposercurrent1Name,
    teamexposercurrent2Name, // ✅ इस prop को add किया
    currentExpbgColor1,
    currentExpbgColor2,
    selectednameteam,
    betType,
    // ✅ New prop for bookmaker exposure data
    bookmakerExposureData = [],
    // ✅ New prop for team mapping
    matchesName = [],
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

    // ✅ Fixed: Function to get exposure amount for bookmaker team
    const getBookmakerExposure = (runnerName, selectionId) => {
      if (!bookmakerExposureData || bookmakerExposureData.length === 0) {
        return null;
      }

      // First, try to find this runner in matchesName to get team_id
      let teamId = null;

      // Check matchesName for this runner
      const matchedTeam = matchesName.find(team => {
        // Try to match by runner name or other criteria
        const teamName = team.team_name?.toLowerCase();
        const runnerNameLower = runnerName?.toLowerCase();

        return teamName && runnerNameLower &&
          (teamName.includes(runnerNameLower) ||
            runnerNameLower.includes(teamName));
      });

      if (matchedTeam) {
        teamId = matchedTeam.team_id;
      } else {
        // Fallback: Try to match by index position
        if (matchesName.length > 0) {
          // If we have multiple runners, try to match by position
          const runners = Array.isArray(markets) && markets[0]?.runners;
          if (runners && Array.isArray(runners)) {
            const runnerIndex = runners.findIndex(r => r.runnerName === runnerName);
            if (runnerIndex !== -1 && matchesName[runnerIndex]) {
              teamId = matchesName[runnerIndex].team_id;
            }
          }
        }
      }

      // Now try to find exposure data using team_id
      if (teamId) {
        const exposureItem = bookmakerExposureData.find(item =>
          item.team_id === teamId.toString()
        );

        if (exposureItem) {
          return exposureItem.amount;
        }
      }

      // Last resort: try to find by amount matching (if only one exposure item)
      if (bookmakerExposureData.length === 1) {
        return bookmakerExposureData[0].amount;
      }

      return null;
    };

    // ✅ Function to get second team name for exposure display
    const getOtherTeamName = (currentRunnerName) => {
      if (!Array.isArray(markets) || markets.length === 0) return "";

      const market = markets[0];
      if (!market || !Array.isArray(market.runners) || market.runners.length < 2) {
        return "Team 2";
      }

      const otherRunner = market.runners.find(runner => runner.runnerName !== currentRunnerName);
      return otherRunner?.runnerName || "Team 2";
    };

    return (
      <div className={`${title.toLowerCase().replace(" ", "-")} mt-2`}>
        <div className="match-odds-part mt-1">
          <div className="table-responsive">
            <table
              className="table position-relative"
              style={{ marginBottom: 0 }}
              width="100%"
            >
              <thead>
                <tr>
                  <th align="left" className="market-name-th" valign="middle">
                    <div className="d-flex height_60 justify-content-between align-items-center">
                      <p className="text_blink">
                        Bookmaker
                      </p>
                      <p className="stack-info text_blink">
                        <span className="text_blink">Max:</span><span className="text_blink"> 10000</span>
                      </p>
                    </div>
                  </th>
                  <th align="center" className="back-h" valign="middle">
                    <span>Back</span>
                  </th>
                  <th align="center" className="lay-h" valign="middle">
                    <span>Lay</span>
                  </th>
                </tr>
              </thead>



              <tbody className="">
                {Array.isArray(markets) && markets.length > 0 ? (
                  markets.slice(0, 1).map((market) =>
                    market.runners.map((runner) => {
                      const rowId = `${market.marketId}_${runner.selectionId}`;
                      const isSelected = selectedRow === rowId;

                      // ✅ Get other team name
                      const otherTeamName = getOtherTeamName(runner.runnerName);

                      // ✅ Fixed: Get exposure for this bookmaker runner
                      const exposureAmount = getBookmakerExposure(runner.runnerName, runner.selectionId);

                      return (
                        <React.Fragment key={rowId}>
                          {/* Mobile View */}
                          <tr
                            className="white-bg skyDetailsRow bookmaker d-mobile"
                            style={{ backgroundColor: "rgb(250, 248, 216)" }}
                          >
                            <td
                              align="left"
                              className="selaction_name"
                              valign="middle"
                            >
                              <div className="d-flex height_60 justify-content-between align-items-center">
                                <div>
                                  <a>{runner.runnerName}</a>
                                  {exposureAmount !== null && exposureAmount !== undefined && (
                                    <div
                                      style={{
                                        color: exposureAmount > 0 ? "#108f10ff" :
                                          exposureAmount < 0 ? "#ff0000" : "#666",
                                        display: "inline-block",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                      }}
                                      title="Exposure Amount"
                                    >
                                      {formatNumber(exposureAmount)}
                                    </div>
                                  )}
                                </div>
                                <span className="forstrongchang">
                                  <strong className="red d-flex gap-1 align-items-center">
                                    {/* ✅ Show exposure amount from API */}
                                  </strong>{" "}
                                  {bookMakerShowCurrentExp ? (
                                    teamexposercurrent1Name === runner.runnerName ? (
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
                                          "(" + formatNumber(teamexposercurrent1) + ")"
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
                                          "(" + formatNumber(teamexposercurrent2) + ")"
                                        )}
                                      </div>
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td
                              className="suspend-col d-mobile"
                              colSpan={2}
                              style={{ position: "relative" }}
                            >
                              <div className="d-flex justify-content-start">
                                {/* Back Odds - Mobile */}
                                <div
                                  className="back1 back-1 bettinggrid top"
                                  onClick={() => {
                                    if (runner.ex.availableToBack[0]?.price >= 100) return;
                                    handleOddsClick(
                                      market,
                                      "back",
                                      runner.ex.availableToBack[0]?.price,
                                      runner
                                    );
                                  }}
                                  style={{
                                    cursor: runner.status === "SUSPENDED" || runner.ex.availableToBack[0]?.price >= 100
                                      ? "not-allowed"
                                      : "pointer",
                                    color: "#000",
                                    background: highlightedMarkets[`${rowId}-back`]
                                      ? "#f8e71c"
                                      : "",
                                    transition: "background-color 0.5s ease",
                                    padding: "2px 5px",
                                    fontWeight: highlightedMarkets[`${rowId}-back`]
                                      ? "bold"
                                      : "700",
                                  }}
                                >
                                  <span
                                    style={{
                                      pointerEvents: runner.ex.availableToBack[0]?.price >= 100 ? "none" : "auto",
                                      opacity: runner.ex.availableToBack[0]?.price >= 100 ? 0.4 : 1,
                                      cursor: runner.ex.availableToBack[0]?.price >= 100 ? "not-allowed" : "pointer",
                                    }}
                                  >
                                    {runner.ex.availableToBack[0]?.price > 99
                                      ? 0
                                      : runner.ex.availableToBack[0]?.price || 0}
                                  </span>
                                  <small
                                    style={{
                                      opacity: runner.ex.availableToBack[0]?.price >= 100 ? 0.4 : 1,
                                    }}
                                  >
                                    {runner.ex.availableToBack[0]?.price > 99
                                      ? 0
                                      : formatVolume(runner.ex.availableToBack[0]?.size || 0)}
                                  </small>
                                </div>

                                {/* Lay Odds - Mobile */}
                                <div
                                  className="lay3 lay-1 bettinggrid top"
                                  onClick={() => {
                                    if (runner.ex.availableToLay[0]?.price >= 100) return;
                                    handleOddsClick(
                                      market,
                                      "lay",
                                      runner.ex.availableToLay[0]?.price,
                                      runner
                                    );
                                  }}
                                  style={{
                                    cursor: runner.status === "SUSPENDED" || runner.ex.availableToLay[0]?.price >= 100
                                      ? "not-allowed"
                                      : "pointer",
                                    color: "#000",
                                    background: highlightedMarkets[`${rowId}-lay`]
                                      ? "#26f1f8"
                                      : "",
                                    transition: "background-color 0.5s ease",
                                    padding: "2px 5px",
                                    fontWeight: highlightedMarkets[`${rowId}-lay`]
                                      ? "bold"
                                      : "700",
                                  }}
                                >
                                  <span
                                    style={{
                                      pointerEvents: runner.ex.availableToLay[0]?.price >= 100 ? "none" : "auto",
                                      opacity: runner.ex.availableToLay[0]?.price >= 100 ? 0.4 : 1,
                                      cursor: runner.ex.availableToLay[0]?.price >= 100 ? "not-allowed" : "pointer",
                                    }}
                                  >
                                    {runner.ex.availableToLay[0]?.price > 99
                                      ? 0
                                      : runner.ex.availableToLay[0]?.price || 0}
                                  </span>
                                  <small
                                    style={{
                                      opacity: runner.ex.availableToLay[0]?.price >= 100 ? 0.4 : 1,
                                    }}
                                  >
                                    {runner.ex.availableToLay[0]?.price > 99
                                      ? 0
                                      : formatVolume(runner.ex.availableToLay[0]?.size || 0)}
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

                          {/* Desktop View */}
                          <tr
                            className="white-bg skyDetailsRow bookmaker d-desk"
                            style={{ backgroundColor: "rgb(250, 248, 216)" }}
                          >
                            <td
                              align="left"
                              className="selaction_name"
                              valign="middle"
                            >
                              <div className="d-flex height_60 justify-content-between align-items-center">
                                <div>
                                  <a>{runner.runnerName}</a>
                                  {exposureAmount !== null && exposureAmount !== undefined && (
                                    <div
                                      style={{
                                        color: exposureAmount > 0 ? "#108f10ff" :
                                          exposureAmount < 0 ? "#ff0000" : "#666",
                                        display: "inline-block",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "2px 6px",
                                      }}
                                      title="Exposure Amount"
                                    >
                                      {formatNumber(exposureAmount)}
                                    </div>
                                  )}
                                </div>

                                <span className="forstrongchang">
                                  <strong className="red d-flex gap-1 align-items-center">
                                  </strong>
                                  {bookMakerShowCurrentExp ? (
                                    teamexposercurrent1Name === runner.runnerName ? (
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
                                          "(" + formatNumber(teamexposercurrent1) + ")"
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
                                          "(" + formatNumber(teamexposercurrent2) + ")"
                                        )}
                                      </div>
                                    )
                                  ) : (
                                    <></>
                                  )}
                                </span>
                              </div>
                            </td>
                            <td
                              className="suspend-col d-desk"
                              colSpan={6}
                              style={{ position: "relative" }}
                            >
                              <div className="d-flex justify-content-start">
                                {/* Back Odds - Desktop (3 levels) */}
                                {[2, 1, 0].map((index) => (
                                  <div
                                    key={`back-${index}`}
                                    className={`back1 back-${index + 1} bettinggrid top ${index > 0 ? "boxhide" : ""}`}
                                    onClick={() => {
                                      if (runner.ex.availableToBack[index]?.price >= 100) return;
                                      handleOddsClick(
                                        market,
                                        "back",
                                        runner.ex.availableToBack[index]?.price,
                                        runner
                                      );
                                    }}
                                    style={{
                                      cursor: runner.status === "SUSPENDED" || runner.ex.availableToBack[index]?.price >= 100
                                        ? "not-allowed"
                                        : "pointer",
                                      color: "#000",
                                      background: highlightedMarkets[`${rowId}-back-${index}`]
                                        ? "#f8e71c"
                                        : "",
                                      transition: "background-color 0.5s ease",
                                      padding: "2px 5px",
                                      fontWeight: highlightedMarkets[`${rowId}-back-${index}`]
                                        ? "bold"
                                        : "700",
                                    }}
                                  >
                                    <span
                                      style={{
                                        pointerEvents: runner.ex.availableToBack[index]?.price >= 100 ? "none" : "auto",
                                        opacity: runner.ex.availableToBack[index]?.price >= 100 ? 0.4 : 1,
                                        cursor: runner.ex.availableToBack[index]?.price >= 100 ? "not-allowed" : "pointer",
                                      }}
                                    >
                                      {runner.ex.availableToBack[index]?.price > 99
                                        ? 0
                                        : runner.ex.availableToBack[index]?.price || ""}
                                    </span>
                                    <small
                                      style={{
                                        opacity: runner.ex.availableToBack[index]?.price >= 100 ? 0.4 : 1,
                                      }}
                                    >
                                      {runner.ex.availableToBack[index]?.price > 99
                                        ? 0
                                        : formatVolume(runner.ex.availableToBack[index]?.size || 0)}
                                    </small>
                                  </div>
                                ))}

                                {/* Lay Odds - Desktop (3 levels) */}
                                {[0, 1, 2].map((index) => (
                                  <div
                                    key={`lay-${index}`}
                                    className={`lay3 lay-${index + 1} bettinggrid top ${index > 0 ? "boxhide" : ""}`}
                                    onClick={() => {
                                      if (runner.ex.availableToLay[index]?.price >= 100) return;
                                      handleOddsClick(
                                        market,
                                        "lay",
                                        runner.ex.availableToLay[index]?.price,
                                        runner
                                      );
                                    }}
                                    style={{
                                      cursor: runner.status === "SUSPENDED" || runner.ex.availableToLay[index]?.price >= 100
                                        ? "not-allowed"
                                        : "pointer",
                                      color: "#000",
                                      background: highlightedMarkets[`${rowId}-lay-${index}`]
                                        ? "#26f1f8"
                                        : "",
                                      transition: "background-color 0.5s ease",
                                      padding: "2px 5px",
                                      fontWeight: highlightedMarkets[`${rowId}-lay-${index}`]
                                        ? "bold"
                                        : "700",
                                    }}
                                  >
                                    <span
                                      style={{
                                        pointerEvents: runner.ex.availableToLay[index]?.price >= 100 ? "none" : "auto",
                                        opacity: runner.ex.availableToLay[index]?.price >= 100 ? 0.4 : 1,
                                        cursor: runner.ex.availableToLay[index]?.price >= 100 ? "not-allowed" : "pointer",
                                      }}
                                    >
                                      {runner.ex.availableToLay[index]?.price > 99
                                        ? 0
                                        : runner.ex.availableToLay[index]?.price || ""}
                                    </span>
                                    <small
                                      style={{
                                        opacity: runner.ex.availableToLay[index]?.price >= 100 ? 0.4 : 1,
                                      }}
                                    >
                                      {runner.ex.availableToLay[index]?.price > 99
                                        ? 0
                                        : formatVolume(runner.ex.availableToLay[index]?.size || 0)}
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

function Cricket() {


  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOpenBook, setShowOpenBook] = useState(false);
  const { notification, showNotification, closeNotification } = useNotification();

  const [stake, setStake] = useState("");
  const [placebet, setPlacebet] = useState(false);
  const [selectedOdds, setSelectedOdds] = useState(null);
  const [betType, setBetType] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSuspended, setIsSuspended] = useState(true);
  const [scorecard, setScorecard] = useState(true);
  const [openInfoId, setOpenInfoId] = useState(null);
  const [isOn, setIsOn] = useState(false);

  // Exposure/Liability State Variables
  const [teamexposercurrent1, setteamexposercurrent1] = useState(0);
  const [teamexposercurrent2, setteamexposercurrent2] = useState(0);
  const [teamexposercurrent1Name, setteamexposercurrent1Name] = useState("");
  const [teamexposercurrent2Name, setteamexposercurrent2Name] = useState(""); // ✅ दूसरी team का name
  const [currentExpbgColor1, setcurrentExpbgColor1] = useState("#108f10ff");
  const [currentExpbgColor2, setcurrentExpbgColor2] = useState("#ff0000");
  const [bettingvalueteam, setBettingvalueteam] = useState("");
  const [matchOddsShowCurrentExp, setmatchOddsShowCurrentExp] = useState(false);
  const [bookMakerShowCurrentExp, setbookMakerShowCurrentExp] = useState(false);
  const [selectednameteam, setSelectednameteam] = useState("");
  const [MatchType, setMatchType] = useState("match_odds");
  const [bgColor, setBgColor] = useState("#72bbef");
  const [stackValueteam, setStackValueteam] = useState(1);
  const [showBetHistoryModal, setShowBetHistoryModal] = useState(false);

  // NEW: State for Bet Slip Modal
  const [showBetSlipModal, setShowBetSlipModal] = useState(false);

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
  const [amount, setAmount] = useState("");

  const [activeTab, setActiveTab] = useState();

  // Add highlight state
  const [highlightedMarkets, setHighlightedMarkets] = useState({});
  const previousMarketValues = useRef({});
  const previousMatchValues = useRef({});
  const previousBookmakerValues = useRef({});
  const [isLadderOpen, setIsLadderOpen] = useState(false);

  // State for all exposure data (match odds, bookmaker, fancy)
  const [teamExposureData, setTeamExposureData] = useState({
    match_odds: [],
    bookmaker: [],
    fancy: []
  });
  const [exposureLoading, setExposureLoading] = useState(false);

  const openLadder = () => setIsLadderOpen(true);
  const closeLadder = () => setIsLadderOpen(false);

  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const seriesIndex = pathParts.indexOf("series_idd");
  const eventIndex = pathParts.indexOf("event_id");
  const series_idd = seriesIndex !== -1 ? pathParts[seriesIndex + 1] : "";
  const event_id = eventIndex !== -1 ? pathParts[eventIndex + 1] : "";

  const stakeInputRef = useRef(null);
  const navigate = useNavigate();
  const [bettingdesign, setBettingdesign] = useState(false);
  const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl =
  //   nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;


        const baseUrl = process.env.REACT_APP_BACKEND_API;


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
    getmarketteamsodds();
    fetchButtonValues();
  }, []);

  const fetchButtonValues = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const response = await axios.get(
        `${baseUrl}/get-button-value?user_id=${userId}`
      );

      if (response.data.status_code === 1 && response.data.data) {
        setButtonValues(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching button values:", error);


    }
  };
  useEffect(() => {
    fetchTeamExposureData()
  }, [])
  // Function to fetch all exposure data (match odds, bookmaker, fancy)
  const fetchTeamExposureData = useCallback(async () => {
    try {
      setExposureLoading(true);

      const userId = localStorage.getItem("user_id");
      if (!userId || !event_id) {
        console.warn("User ID or Event ID not available for exposure data");
        return;
      }

      // Fetch match odds and bookmaker exposure data
      const requestData = {
        eventid: event_id,
        user_id: userId
      };

      const [matchOddsResponse, fancyResponse] = await Promise.all([
        // Fetch match odds and bookmaker exposure
        axios.post(
          `${baseUrl}/get-teampls-data`,
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        ),
        // Fetch fancy exposure data
        axios.post(
          `${baseUrl}/my-fancy-Exposer`,
          {
            eventid: event_id,
            user_id: userId
          },
          {
            headers: {
              "Content-Type": "application/json",
            }
          }
        )
      ]);

      // Process match odds and bookmaker exposure data
      const matchOddsExposure = [];
      const bookmakerExposure = [];

      if (matchOddsResponse.data?.status_code === 1) {
        if (matchOddsResponse.data.data && Array.isArray(matchOddsResponse.data.data)) {
          matchOddsResponse.data.data.forEach(item => {
            matchOddsExposure.push({
              team_id: item.team_id,
              amount: item.amount
            });
          });
        }

        if (matchOddsResponse.data.dataBook && Array.isArray(matchOddsResponse.data.dataBook)) {
          matchOddsResponse.data.dataBook.forEach(item => {
            bookmakerExposure.push({
              team_id: item.team_id,
              amount: item.amount
            });
          });
        }
      }

      // Process fancy exposure data
      const fancyExposure = [];
      if (fancyResponse.data?.status_code === 1) {
        if (fancyResponse.data.data && Array.isArray(fancyResponse.data.data)) {
          fancyResponse.data.data.forEach(item => {
            fancyExposure.push({
              fancy_id: item.fancy_id || item.session_id,
              session_id: item.session_id,
              exp: item.exp,
              event_id: item.event_id
            });
          });
        }
      }

      setTeamExposureData({
        match_odds: matchOddsExposure,
        bookmaker: bookmakerExposure,
        fancy: fancyExposure
      });

    } catch (error) {
      console.error("Error fetching team exposure data:", error);
      setTeamExposureData({ match_odds: [], bookmaker: [], fancy: [] });
    } finally {
      setExposureLoading(false);
    }
  }, [event_id, baseUrl]);

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

  // Check authentication function
  const [showLoginModal, setShowLoginModal] = useState(false);
  const openLogin = useCallback(() => setShowLoginModal(true), []);
  const closeLogin = useCallback(() => setShowLoginModal(false), []);

  const checkAuthentication = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return false;
    }
    return true;
  }, [openLogin]);

  // ✅ FIXED: Exposure calculation function with actual team names
  const valuebettingteam = useCallback(
    (value) => {
      if (MatchType === "match_odds") {
        if (bgColor === "#72bbef") {
          // back
          const abc = parseFloat(value) * parseFloat(stackValueteam) - parseFloat(value);

          // ✅ Get other team name from Matches
          let otherTeamName = "";
          if (selectednameteam && Matches.length > 0) {
            // Selected team के अलावा दूसरी team का नाम ढूंढें
            const otherTeam = Matches.find(match =>
              match.team_name !== selectednameteam
            );
            otherTeamName = otherTeam?.team_name || "Team 2";
          }

          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name(otherTeamName); // ✅ Actual team name

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(parseInt(value));

          const color1 = "#108f10ff";
          const color2 = "#ff0000";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        } else {
          // lay
          const abc = parseFloat(value) * parseFloat(stackValueteam) - parseFloat(value);

          // ✅ Get other team name from Matches
          let otherTeamName = "";
          if (selectednameteam && Matches.length > 0) {
            const otherTeam = Matches.find(match =>
              match.team_name !== selectednameteam
            );
            otherTeamName = otherTeam?.team_name || "Team 2";
          }

          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name(otherTeamName); // ✅ Actual team name

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(parseInt(value));

          const color1 = "#ff0000";
          const color2 = "#108f10ff";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        }
        setmatchOddsShowCurrentExp(true);
        setbookMakerShowCurrentExp(false);
      } else if (MatchType === "bookmaker") {
        if (bgColor === "#72bbef") {
          // back
          const abc = (parseFloat(value) * parseFloat(stackValueteam)) / 100;

          // ✅ Get other team name from bookmakerList
          let otherTeamName = "";
          if (selectednameteam && bookmakerList.length > 0) {
            const market = bookmakerList[0];
            if (market && market.runners) {
              const otherRunner = market.runners.find(runner =>
                runner.runnerName !== selectednameteam
              );
              otherTeamName = otherRunner?.runnerName || "Team 2";
            }
          }

          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name(otherTeamName); // ✅ Actual team name

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(parseInt(value));

          const color1 = "#108f10ff";
          const color2 = "#ff0000";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        } else {
          // lay
          const abc = (parseFloat(value) * parseFloat(stackValueteam)) / 100;

          // ✅ Get other team name from bookmakerList
          let otherTeamName = "";
          if (selectednameteam && bookmakerList.length > 0) {
            const market = bookmakerList[0];
            if (market && market.runners) {
              const otherRunner = market.runners.find(runner =>
                runner.runnerName !== selectednameteam
              );
              otherTeamName = otherRunner?.runnerName || "Team 2";
            }
          }

          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name(otherTeamName); // ✅ Actual team name

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(parseInt(value));

          const color1 = "#ff0000";
          const color2 = "#108f10ff";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        }
        setbookMakerShowCurrentExp(true);
        setmatchOddsShowCurrentExp(false);
      } else if (MatchType === "fancy") {
        if (bgColor === "#72bbef") {
          // back (Yes)
          const abc = parseFloat(value);

          // ✅ For fancy, we don't have another team, so use "Opposite"
          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name("Opposite");

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(0);

          const color1 = "#108f10ff";
          const color2 = "#ff0000";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        } else {
          // lay (No)
          const abc = parseFloat(value);

          // ✅ For fancy, we don't have another team, so use "Opposite"
          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name("Opposite");

          setteamexposercurrent1(0);
          setteamexposercurrent2(parseInt(abc));

          const color1 = "#ff0000";
          const color2 = "#108f10ff";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        }
        setmatchOddsShowCurrentExp(false);
        setbookMakerShowCurrentExp(false);
      }

      setBettingvalueteam(value);
    },
    [MatchType, bgColor, stackValueteam, selectednameteam, Matches, bookmakerList]
  );

  const togglebetting = useCallback(() => {
    setBettingdesign((prev) => !prev);
  }, []);

  const togglescore = useCallback(() => {
    setScorecard((prev) => !prev);
  }, []);

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

  const formatNumber = useCallback((num) => {
    if (!num && num !== 0) return "0";

    const number = typeof num === "string" ? parseFloat(num) : num;

    if (isNaN(number)) return "0";

    return number.toString();
  }, []);

  const formatVolume = useCallback((num) => {
    if (!num && num !== 0) return "0";

    const number = typeof num === "string" ? parseFloat(num) : num;

    if (isNaN(number)) return "0";

    if (number >= 10000) {
      const millions = number / 10000;
      if (millions < 10) {
        return `${millions.toFixed(2)}m`;
      } else if (millions < 100) {
        return `${millions.toFixed(1)}m`;
      }
      return `${Math.round(millions)}m`;
    } else if (number >= 1000) {
      const thousands = number / 1000;
      if (thousands < 10) {
        return `${thousands.toFixed(2)}k`;
      } else if (thousands < 100) {
        return `${thousands.toFixed(1)}k`;
      }
      return `${Math.round(thousands)}k`;
    }

    return number.toString();
  }, []);

  const [matchesName, setMatchesName] = useState([]);
  useEffect(() => {
    if (!series_idd || series_idd === "null") return;

    getmarketteamsodds();
  }, [series_idd]);

  const getmarketteamsodds = useCallback(async () => {
    try {
      if (!series_idd) return;

      const response = await axios.post(
        `${baseUrl}/get-market-teams/${series_idd}`,
        {}
      );

      if (
        response.data?.status_code === 1 &&
        Array.isArray(response.data.data)
      ) {
        const teams = response.data.data.map(item => ({
          id: item._id,
          market_id: item.market_id,
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

  const callCountRef = useRef(0);
  const fastIntervalRef = useRef(null);
  const hourlyIntervalRef = useRef(null);

  useEffect(() => {
    // 🔹 Step 1: 100ms me 4 baar call
    fastIntervalRef.current = setInterval(() => {
      if (callCountRef.current < 2) {
        getmarketteamsodds();
        callCountRef.current += 1;
      } else {
        clearInterval(fastIntervalRef.current);

        // 🔹 Step 2: 1 hour me 1 baar call
        hourlyIntervalRef.current = setInterval(() => {
          getmarketteamsodds();
        }, 60 * 60 * 1000); // 1 hour
      }
    }, 500);

    // 🔹 Cleanup
    return () => {
      clearInterval(fastIntervalRef.current);
      clearInterval(hourlyIntervalRef.current);
    };
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
          const transformedMatches = marketData.runners.map((runner, index) => {
            let teamName = `Team ${index + 1}`;

            if (matchesName.length > 0) {
              const exactMatch = matchesName.find(team =>
                team.team_id === runner.selectionId.toString()
              );

              const indexMatch = matchesName[index];

              if (exactMatch) {
                teamName = exactMatch.team_name;
              } else if (indexMatch) {
                teamName = indexMatch.team_name;
              }
            }

            if (!teamName && runner.runnerName) {
              teamName = runner.runnerName;
            }

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
              runnerName: runner.runnerName,
              selectionId: runner.selectionId,
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
  }, [series_idd, highlightMarket, matchesName]);

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

        const userId = localStorage.getItem("user_id");
        if (!userId) {
          showNotification("User not found, please login again", "error");
          setIsPlacingBet(false);
          return;
        }

        // if (betData.min && betData.betSlip_stake < parseInt(betData.min)) {
        //   showNotification(`Minimum stake is ${betData.min}`, "warning");
        //   setIsPlacingBet(false);
        //   return;
        // }

        // if (betData.max && betData.betSlip_stake > parseInt(betData.max)) {
        //   showNotification(`Maximum stake is ${betData.max}`, "warning");
        //   setIsPlacingBet(false);
        //   return;
        // }

        const completeBetData = {
          ...betData,
          userId: userId,
          sport_id: 4,
          size: betData.size || 0,
          session_id: betData.session_id,
          fancy_id: betData.fancy_id,
          gtype: betData.gtype || "session"
        };

        const encryptedData = encryptData(completeBetData);

        const response = await axios.post(
          `${baseUrl}/place-session-bet`,
          { encryptedData },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );

        fetchTeamExposureData()

        if (response.data.encryptedResponse) {
          const decryptedResponse = decryptData(
            response.data.encryptedResponse
          );

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

            setShowBetSlipModal(false);
            closeBetSlip();
          } else {
            showNotification(
              decryptedResponse.message || "Failed to place bet",
              "error"
            );
          }
        } else {
          if (response.data.status_code === 1) {
            showNotification(
              response.data.message || "Bet placed successfully!",
              "success"
            );
            window.dispatchEvent(new Event("bet-updated"));

            if (response.data.credit) {
              localStorage.setItem("userCredit", response.data.credit);
            }

            setShowBetSlipModal(false);
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
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
          showNotification("Please login again", "error");
          setIsPlacingBet(false);
          return;
        }

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

        const completeBetData = {
          ...betData,
          user_id: userId,
          sport_id: betData.sport_id || 4,
          size: betData.size || 0
        };

        const response = await axios.post(
          `${baseUrl}/place-betpost`,
          completeBetData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );

        fetchTeamExposureData()

        if (response.data.encryptedResponse) {
          const decryptedResponse = decryptData(
            response.data.encryptedResponse
          );

          if (decryptedResponse.status_code === 1) {
            showNotification(
              decryptedResponse.message || "Bet placed successfully!",
              "success"
            );

            window.dispatchEvent(new Event("bet-updated"));

            if (decryptedResponse.credit) {
              localStorage.setItem("userCredit", decryptedResponse.credit);
            }

            setShowBetSlipModal(false);
            closeBetSlip();
          } else {
            showNotification(
              decryptedResponse.message || "Failed to place bet",
              "error"
            );
          }
        } else {
          if (response.data.status_code === 1) {
            showNotification(
              response.data.message || "Bet placed successfully!",
              "success"
            );
            window.dispatchEvent(new Event("bet-updated"));

            if (response.data.credit) {
              localStorage.setItem("userCredit", response.data.credit);
            }

            setShowBetSlipModal(false);
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
        } else if (error.response && error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
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

  const openBetSlipModal = useCallback(() => {
    const stakeValue = parseInt(stake) || 0;

    if (stakeValue === 0) {
      showNotification("Please enter a stake amount", "warning");
      return;
    }

    if (!selectedOdds) {
      showNotification("No odds selected", "warning");
      return;
    }

    setShowBetSlipModal(true);
  }, [stake, selectedOdds, showNotification]);

  const handleAutoCloseModal = useCallback(() => {
    showNotification("Bet slip timed out. Please try again.", "warning");
  }, [showNotification]);

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
    const totalAmount = stakeValue;

    if (matchType === "fancy") {
      // Fancy bet preparation
      const fancyBetData = {
        userId: userId,
        betSlip_odds: parseFloat(selectedOdds.price || selectedOdds.value),
        betSlip_stake: stakeValue,
        total: selectedOdds.size,
        bet_on: betType,
        MatchType: "fancy",
        event_id: event_id,
        sport_id: "4",
        team: selectedOdds.runnerName || selectedOdds.eventName,
        market_name: marketName,
        fancy_id: selectedOdds.market?.SelectionId || selectedOdds.selectionId || selectedOdds.rowId,
        session_id: selectedOdds.market?.session_id || selectedOdds.selectionId,
        min: selectedOdds.min || 100,
        max: selectedOdds.max || 1000,
        gtype: selectedOdds.gameType || "session"
      };

      placeSessionBet(fancyBetData);
    } else if (matchType === "bookmaker") {
      // Bookmaker bet preparation
      const teamName = selectedOdds.eventName || selectedOdds.market?.runnerName;

      // Get team_id from matchesName for bookmaker
      let teamId = null;

      if (matchesName.length > 0) {
        const matchedTeam = matchesName.find(team => {
          const teamNameLower = team.team_name?.toLowerCase();
          const runnerNameLower = teamName?.toLowerCase();

          return teamNameLower && runnerNameLower &&
            (teamNameLower.includes(runnerNameLower) ||
              runnerNameLower.includes(teamNameLower));
        });

        if (matchedTeam) {
          teamId = matchedTeam.team_id;
        } else {
          if (matchesName.length >= 2) {
            const runners = Array.isArray(bookmakerList) && bookmakerList[0]?.runners;
            if (runners && Array.isArray(runners)) {
              const runnerIndex = runners.findIndex(r => r.runnerName === teamName);
              if (runnerIndex !== -1 && matchesName[runnerIndex]) {
                teamId = matchesName[runnerIndex].team_id;
              }
            }
          }
        }
      }

      if (!teamId) {
        teamId = selectedOdds.market?.selectionId || selectedOdds.selectionId || selectedOdds.rowId;
      }

      const bookmakerBetData = {
        user_id: userId,
        betSlip_odds: parseFloat(selectedOdds.price || selectedOdds.value),
        betSlip_stake: stakeValue,
        total: totalAmount.toFixed(2),
        bet_on: betType,
        MatchType: "bookmaker",
        event_id: event_id,
        market_id: series_idd,
        sport_id: "4",
        team_id: teamId,
        team: teamName,
        market_name: marketName,
        size: selectedOdds.size || 0
      };

      placeRegularBet(bookmakerBetData);
    } else {
      // Match odds bet preparation
      const matchedTeam = matchesName.find(team => team.team_id === selectedOdds.rowId);
      const teamName = matchedTeam ? matchedTeam.team_name : selectedOdds.eventName;
      const teamId = matchedTeam ? matchedTeam.team_id : selectedOdds.rowId;

      const matchOddsBetData = {
        user_id: userId,
        betSlip_odds: parseFloat(selectedOdds.price || selectedOdds.value),
        betSlip_stake: stakeValue,
        total: totalAmount.toFixed(2),
        bet_on: betType,
        MatchType: "match_odds",
        event_id: event_id,
        market_id: series_idd,
        sport_id: "4",
        team_id: teamId,
        team: teamName,
        market_name: marketName,
        size: selectedOdds.size || 0
      };

      placeRegularBet(matchOddsBetData);
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
    matchesName,
    bookmakerList,
  ]);

  const handleOddsClick = useCallback(
    (oddsValue, type, market, oddType, rowId) => {
      if (!checkAuthentication()) return;

      if (market.status === "SUSPENDED") {
        showNotification(
          "This market is currently suspended. Betting is not allowed.",
          "warning"
        );
        return;
      }

      let teamName = market.team_name || market.runnerName || `Team ${rowId}`;

      if (matchesName.length > 0) {
        const matchedTeam = matchesName.find(team =>
          team.team_id === rowId.toString() ||
          team.selectionId === rowId.toString()
        );

        if (matchedTeam) {
          teamName = matchedTeam.team_name;
        }
      }

      setSelectednameteam(teamName);
      setMatchType("match_odds");
      setBgColor(type === "back" ? "#72bbef" : "#ff6b6b");
      setStackValueteam(oddsValue);

      const size = type === "back"
        ? market.availableToBack?.[0]?.size || 0
        : market.availableToLay?.[0]?.size || 0;

      setSelectedOdds({
        value: oddsValue,
        price: oddsValue,
        size: size,
        eventName: teamName,
        type: type,
        marketName: teamName,
        oddType: oddType,
        rowId: rowId,
        market: market,
        selectionId: market.selectionId,
        runnerName: teamName
      });
      setBetType(type);
      setPlacebet(true);
      setSelectedRow(rowId);
      setError("");
      setSuccessMessage("");
      setStake("");

      if (stake) {
        valuebettingteam(stake);
      }

      setShowBetSlipModal(true);
    },
    [checkAuthentication, showNotification, stake, valuebettingteam, matchesName]
  );

  const handleFancyOddsClick = useCallback(
    (oddsValue, type, market, clickedSide) => {
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
      const price = oddsValue;
      const size = type === "back" ? market.BackSize1 : market.LaySize1;

      // ✅ MAIN CONDITION (IMPORTANT)
      if (!price || price === 0 || !size || size === 0) {
        showNotification("Invalid odds or size", "warning");
        return; // ❌ yahin se function stop
      }

      setSelectedOdds({
        value: oddsValue,
        price: price,
        size: size,
        type: type,
        clickedSide: clickedSide,
        market: market,
        eventName: market.RunnerName || market.title,
        marketName: market.RunnerName || market.title,
        oddType: type === "back" ? "Yes" : "No",
        rowId: rowId,
        selectionId: market.SelectionId,
        runnerName: market.RunnerName,
        min: market.min,
        max: market.max,
        gameType: market.gtype || "session"
      });

      setBetType(type);
      setPlacebet(true);
      setSelectedRow(rowId);
      setError("");
      setSuccessMessage("");
      setStake("");

      setMatchType("fancy");
      setBgColor(type === "back" ? "#72bbef" : "#ff6b6b");
      setStackValueteam(1);

      if (stake) {
        valuebettingteam(stake);
      }

      // ✅ modal sirf valid price & size par hi open hoga
      setShowBetSlipModal(true);
    },
    [checkAuthentication, showNotification, stake, valuebettingteam]
  );


  const handleBookmakerOddsClick = useCallback(
    (market, type, value, runner) => {
      if (!checkAuthentication()) return;

      if (runner.status === "SUSPENDED") {
        showNotification(
          "This market is currently suspended. Betting is not allowed.",
          "warning"
        );
        return;
      }

      const rowId = `${market.marketId}_${runner.selectionId}`;

      setSelectednameteam(runner.runnerName);
      setMatchType("bookmaker");
      setBgColor(type === "back" ? "#72bbef" : "#ff6b6b");
      setStackValueteam(value);

      let size = 0;
      if (type === "back") {
        size = runner.ex?.availableToBack?.[0]?.size || 0;
      } else {
        size = runner.ex?.availableToLay?.[0]?.size || 0;
      }

      setSelectedOdds({
        eventName: runner.runnerName,
        oddType: market.marketName,
        type,
        value: value,
        price: value,
        size: size,
        rowId: rowId,
        market: { ...market, ...runner },
        selectionId: runner.selectionId,
        runnerName: runner.runnerName
      });
      setBetType(type);
      setPlacebet(true);
      setSelectedRow(rowId);
      setError("");
      setSuccessMessage("");
      setStake("");

      if (stake) {
        valuebettingteam(stake);
      }

      setShowBetSlipModal(true);
    },
    [checkAuthentication, stake, valuebettingteam, showNotification]
  );

  const closeBetSlip = useCallback(() => {
    setPlacebet(false);
    setSelectedOdds(null);
    setBetType("");
    setStake("");
    setSelectedRow(null);
    setError("");
    setSuccessMessage("");
    setmatchOddsShowCurrentExp(false);
    setbookMakerShowCurrentExp(false);
    setteamexposercurrent1(0);
    setteamexposercurrent2(0);
    setBettingvalueteam("");
    setSelectednameteam("");
    setMatchType("match_odds");
  }, []);

  const closeBetSlipModal = useCallback(() => {
    setShowBetSlipModal(false);
    closeBetSlip();
  }, [closeBetSlip]);

  const increaseStake = useCallback(() => {
    const currentStake = parseInt(stake) || 0;
    const newStake = (currentStake + 10).toString();
    setStake(newStake);

    if (selectedOdds && selectednameteam) {
      valuebettingteam(newStake);
    }
  }, [stake, selectedOdds, selectednameteam, valuebettingteam]);

  const decreaseStake = useCallback(() => {
    const currentStake = parseInt(stake) || 0;
    const newStake = currentStake > 0 ? currentStake - 10 : 0;
    setStake(newStake > 0 ? newStake.toString() : "");

    if (selectedOdds && selectednameteam && newStake > 0) {
      valuebettingteam(newStake.toString());
    }
  }, [stake, selectedOdds, selectednameteam, valuebettingteam]);

  const handleQuickStake = useCallback(
    (amount) => {
      const newStake = amount.toString();
      setStake(newStake);

      if (selectedOdds && selectednameteam) {
        valuebettingteam(newStake);
      }
    },
    [selectedOdds, selectednameteam, valuebettingteam]
  );

  const handleStakeChange = useCallback(
    (e) => {
      const value = e.target.value.replace(/\D/g, "");
      setStake(value);

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
    // getmarketteamsodds()

    try {
      setFancyLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!event_id) {
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
          data = [];
        }
      }

      if (Array.isArray(data)) {
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
            if (currentValues.LayPrice1 !== previousValues.LayPrice1) {
              highlightMarket(marketId, "lay");
            }

            if (currentValues.BackPrice1 !== previousValues.BackPrice1) {
              highlightMarket(marketId, "back");
            }
          }

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
        setfancylist([]);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setfancylist([]);
    } finally {
      setFancyLoading(false);
    }
  }, [event_id, highlightMarket]);

  const getBookmakerList = useCallback(async () => {
    const eventId = localStorage.getItem("event_id") || event_id || "34931511";
    if (!eventId) {
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

            previousBookmakerValues.current[marketId] = currentValues;
          });
        });

        setBookmakerList(bookmakerMarkets);
        setTiedList(tiedMarkets);
      } else {
        setBookmakerList([]);
        setTiedList([]);
      }
    } catch (error) {
      setBookmakerList([]);
      setTiedList([]);
    }
  }, [event_id, highlightMarket]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (isInitialLoad && series_idd && event_id) {
      const fetchAllData = async () => {
        try {
          await Promise.all([getfancylist(), getBookmakerList()]);
        } catch (error) {
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
    // matchlist,
    getfancylist,
    getBookmakerList,
  ]);

  useEffect(() => {
    const intervals = [];
    const intervalTime = showLoginModal ? 600000 : 2000;

    if (series_idd) {
      const matchInterval = setInterval(() => {
        // matchlist();
      }, intervalTime);
      intervals.push(matchInterval);
    }

    if (event_id) {
      const fancyInterval = setInterval(() => {
        getfancylist();
      }, intervalTime);
      intervals.push(fancyInterval);
    }

    const bookmakerInterval = setInterval(() => {
      getBookmakerList();
    }, intervalTime);
    intervals.push(bookmakerInterval);

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [
    showLoginModal,
    series_idd,
    event_id,
    // matchlist,
    getfancylist,
    getBookmakerList,
  ]);

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

  const MatchOddsSection = memo(() => {
    // Function to get exposure amount for match odds team
    const getMatchOddsExposure = (teamId) => {
      if (!teamExposureData.match_odds || teamExposureData.match_odds.length === 0) return null;

      const exposureItem = teamExposureData.match_odds.find(item =>
        item.team_id === teamId.toString()
      );

      if (exposureItem) {
        return exposureItem.amount;
      }

      return null;
    };

    return (
      <div className="winner_bet newdesignjan">
        <Modal show={showLoginModal} onHide={closeLogin} centered>
          <Modal.Header closeButton>
            <Modal.Title>User Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Login closeModal={closeLogin} />
          </Modal.Body>
        </Modal>

        {matchLoading && isInitialLoad ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading matches...</span>
            </div>
            <p className="mt-2">Loading matches...</p>
          </div>
        ) : (
          <>
            {/* <table
              className="table position-relative"
              width="100%"
            >
              <thead>
                <tr>
                  <th align="left" className="market-name-th" valign="middle">
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="text_blink"> match odds</p>
                      <p className="stack-info">
                        <span className="text_blink">Max:</span> <span className="text_blink">25000</span>
                      </p>
                    </div>
                  </th>
                  <th align="center" className="back-h" valign="middle">
                    <span>Lagai</span>
                  </th>
                  <th align="center" className="lay-h" valign="middle">
                    <span>Khai</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(Matches) && Matches.length > 0 ? (
                  Matches.map((market) => {
                    const exposureAmount = getMatchOddsExposure(market.id);

                    return (
                      <React.Fragment key={market.id}>
                        <tr className="game_status_new white-bg skyDetailsRow">
                          <td
                            align="left"
                            className="selaction_name"
                            valign="middle"
                          >
                            <div className="d-flex height_60 justify-content-between align-items-center">
                              <div>
                                <a href="#">{market.team_name}</a>
                                {exposureAmount !== null && exposureAmount !== undefined && (
                                  <div
                                    style={{
                                      color: exposureAmount > 0 ? "#108f10ff" : "#ff0000",
                                      display: "inline-block",
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                    }}
                                    title="Exposure Amount"
                                  >
                                    {formatNumber(exposureAmount)}
                                  </div>
                                )}
                              </div>

                              <span className="forstrongchang">
                                <strong className="red d-flex gap-1 align-items-center">
                                  {matchOddsShowCurrentExp ? (
                                    teamexposercurrent1Name === market.team_name ? (
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
                            </div>
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
                                          market.team_name,
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
                                          market.team_name,
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
                                          market.team_name,
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
                                          market.team_name,
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
                      </React.Fragment>
                    );
                  })
                ) : (
                  <Fakedata />
                )}
              </tbody>
            </table> */}
          </>
        )}
      </div>
    );
  });

  // Fancy Bets Section with Exposure Data
  const FancyBetsSection = memo(() => {
    // Function to get exposure amount for fancy market
    const getFancyExposure = (fancyId, sessionId) => {
      if (!teamExposureData.fancy || teamExposureData.fancy.length === 0) return null;

      // Try multiple ways to find the exposure
      let exposureItem = teamExposureData.fancy.find(item =>
        item.fancy_id === fancyId
      );

      if (!exposureItem) {
        exposureItem = teamExposureData.fancy.find(item =>
          item.session_id === sessionId
        );
      }

      if (!exposureItem && fancyId) {
        const numericId = fancyId.split('-').pop();
        exposureItem = teamExposureData.fancy.find(item =>
          item.session_id === numericId ||
          item.fancy_id?.endsWith(`-${numericId}`)
        );
      }

      if (exposureItem) {
        return exposureItem.exp;
      }

      return null;
    };

    return (
      <div className="fancybetcontent">
        {isLadderOpen && (
          <div className="ladder-overlay" onClick={closeLadder}>
            <div
              className="ladder-modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ladder-modal-header">
                <h4>Ladder</h4>
                <button
                  className="ladder-close-btn"
                  onClick={closeLadder}
                >
                  ×
                </button>
              </div>

              <div className="ladder-modal-body">
                <div className="ladder-table-wrapper table-responsive">
                  <Ladder />
                </div>
              </div>
            </div>
          </div>
        )}
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
                          <tr>
                            <th align="left" className="market-name-th" valign="middle">
                              <div className="d-flex height_60 justify-content-between align-items-center">
                                <p className="text-white">
                                  Fancy Bet
                                </p>
                              </div>
                            </th>
                            <th align="center" className="back-h" valign="middle">
                              <span>NO</span>
                            </th>
                            <th align="center" className="lay-h" valign="middle">
                              <span>YES</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(fancylist) && fancylist.length > 0 ? (
                            fancylist
                              .filter(market => {
                                // Filter out markets with "ball run" in RunnerName
                                if (!market.RunnerName) return false;
                                return !market.RunnerName.toLowerCase().includes("ball run");
                              })
                              .map((market) => {
                                const rowId = market.SelectionId || market.id;
                                const isSelected = selectedRow === rowId;
                                const isBackHighlighted =
                                  highlightedMarkets[`${rowId}-back`];
                                const isLayHighlighted =
                                  highlightedMarkets[`${rowId}-lay`];

                                // Get exposure for this fancy market
                                const exposureAmount = getFancyExposure(rowId, market.session_id);
                                const sessionId = market.session_id || rowId.split('-').pop();

                                return (
                                  <React.Fragment key={rowId}>
                                    <tr className="white-bg skyDetailsRow">
                                      <td align="left" className="selaction_name" valign="middle">
                                        <div className="d-flex height_60 justify-content-between align-items-center">
                                          <span>
                                            <a>{market.RunnerName}</a>
                                            <small className="max_amt">Max:{market.max || 1000}</small>
                                          </span>

                                          <span className="d-flex align-items-center gap-2">
                                            {exposureAmount !== null && exposureAmount !== undefined && (
                                              <div
                                                style={{
                                                  color: exposureAmount > 0 ? "#108f10ff" :
                                                    exposureAmount < 0 ? "#ff0000" : "#666",
                                                  display: "inline-block",
                                                  fontSize: "12px",
                                                  fontWeight: "bold",
                                                  padding: "2px 6px",
                                                  minWidth: "60px",
                                                  textAlign: "center"
                                                }}
                                                title="Fancy Exposure Amount"
                                              >
                                                {formatNumber(exposureAmount)}
                                              </div>
                                            )}
                                          </span>
                                        </div>
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
                                                {
                                                  ...market,
                                                  SelectionId: market.SelectionId,
                                                  RunnerName: market.RunnerName,
                                                  BackPrice1: market.BackPrice1,
                                                  BackSize1: market.BackSize1,
                                                  LayPrice1: market.LayPrice1,
                                                  LaySize1: market.LaySize1,
                                                  GameStatus: market.GameStatus,
                                                  min: market.min,
                                                  max: market.max,
                                                  gtype: market.gtype,
                                                  session_id: market.session_id,
                                                  fancy_id: market.fancy_id
                                                },
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
                                                {
                                                  ...market,
                                                  SelectionId: market.SelectionId,
                                                  RunnerName: market.RunnerName,
                                                  BackPrice1: market.BackPrice1,
                                                  BackSize1: market.BackSize1,
                                                  LayPrice1: market.LayPrice1,
                                                  LaySize1: market.LaySize1,
                                                  GameStatus: market.GameStatus,
                                                  min: market.min,
                                                  max: market.max,
                                                  gtype: market.gtype,
                                                  session_id: market.session_id,
                                                  fancy_id: market.fancy_id
                                                },
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
                                    </tr>
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
    );
  });

  const [showCompleted, setShowCompleted] = useState(false);
  const [isBetHistoryOpen, setIsBetHistoryOpen] = useState(false);

  return (
    <>
      <CustomNotification
        notification={notification}
        onClose={closeNotification}
      />

      <div className="newcricketpage">
        <section className="cricket_design new_game_design_myxbet padding-top-80">
          {/* <div className="switcher">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={isOn}
                onChange={(e) => setIsOn(e.target.checked)}
              />
            </div>
          </div> */}
          <div
            className={`tvall w-100 d-flex align-items-center justify-content-start p-2 gap-2 buttonall_new
    ${activeTab === "tv" ? "active" : ""}`}
            onClick={() => setActiveTab(activeTab === "tv" ? null : "tv")}
            style={{ cursor: "pointer", zIndex: 5 }}
          >
            {/* <FaTv /> */}
            <span>TV</span>
          </div>
          {/* {showToggle && (
            <div className="d-flex justify-content-between align-items-center buttondesignalltab">
              <div
                className={`text-white w-100 d-flex align-items-center justify-content-center gap-2 buttonall_new
              ${activeTab === "tv" ? "active" : ""}`}
                onClick={() => setActiveTab("tv")}
              >
                <FaTv />
                <span>Watch Live</span>
              </div>

              <div
                className={`w-100 d-flex justify-content-center align-items-center gap-2 buttonall_new
              ${activeTab === "score" ? "active" : ""}`}
                onClick={() => setActiveTab("score")}
              >
                <MdOutlineScoreboard />
                <span>Live Score</span>
              </div>
            </div>
          )} */}

          {activeTab === "tv" && (
            <>
            <div className="desktop_all">
              <div className="matchtv mt-2 position-relative">

                <div
                  className="live-tv-wrapper"
                  style={{ cursor: "pointer", zIndex: 5 }}
                  onClick={() => setActiveTab(!activeTab)}
                >
                  {/* <IoIosCloseCircleOutline size={25} color="#ff4d4f" /> */}
                  <iframe

                    src={`https://e765432.diamondcricketid.com/dtv.php?id=${event_id}&sportid=4`}
                    frameBorder="0"
                    width="100%"
                    height="400"
                    allowFullScreen
                  />
                </div>




              </div>
            </div>
            <div className="mobile_all">
              <div className="matchtv mt-2 position-relative">

                <div
                  className="live-tv-wrapper"
                  style={{ cursor: "pointer", zIndex: 5 }}
                  onClick={() => setActiveTab(!activeTab)}
                >
                  {/* <IoIosCloseCircleOutline size={25} color="#ff4d4f" /> */}
                  <iframe

                    src={`https://e765432.diamondcricketid.com/dtv.php?id=${event_id}&sportid=4`}
                    frameBorder="0"
                    width="100%"
                    height="195"
                    allowFullScreen
                  />
                </div>




              </div>
            </div>
            </>
          )}

          <div>
            <iframe
              width="100%"
              height="200"
              // src={`https://e765432.diamondcricketid.com/dtv.php?id=${event_id}&sportid=4`}
              src={`https://tv.tresting.com/lnt.php?eventid=${event_id}`}
              allowFullScreen
            />
          </div>



          {/* <div className="">
            {scorecard && (
              <>
                <iframe
                  width="100%"
                  src={`https://e765432.diamondcricketid.com/dtv.php?id=${event_id}&sportid=4`}
                  frameBorder="0"
                ></iframe>
              </>
            )}
          </div> */}

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

            {/* ✅ Fixed: BookmakerTable with exposure data and team mapping */}
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
              bookMakerShowCurrentExp={bookMakerShowCurrentExp}
              teamexposercurrent1={teamexposercurrent1}
              teamexposercurrent2={teamexposercurrent2}
              teamexposercurrent1Name={teamexposercurrent1Name}
              teamexposercurrent2Name={teamexposercurrent2Name} // ✅ Pass the second team name
              currentExpbgColor1={currentExpbgColor1}
              currentExpbgColor2={currentExpbgColor2}
              selectednameteam={selectednameteam}
              betType={betType}
              // ✅ Pass bookmaker exposure data
              bookmakerExposureData={teamExposureData.bookmaker || []}
              // ✅ Pass team mapping data
              matchesName={matchesName}
            />

            <div className="fancybetsportsbook mt-2">
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

          {/* Bet Slip Modal */}
          {showBetSlipModal && (
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <BetSlipModalContent
                    selectedOdds={selectedOdds}
                    stake={stake}
                    handleStakeChange={handleStakeChange}
                    decreaseStake={decreaseStake}
                    increaseStake={increaseStake}
                    handleQuickStake={handleQuickStake}
                    handlePlaceBet={handlePlaceBet}
                    closeBetSlip={closeBetSlipModal}
                    isPlacingBet={isPlacingBet}
                    fancyQuickStakes={fancyQuickStakes}
                    formatNumber={formatNumber}
                    matchOddsShowCurrentExp={matchOddsShowCurrentExp}
                    bookMakerShowCurrentExp={bookMakerShowCurrentExp}
                    teamexposercurrent1={teamexposercurrent1}
                    teamexposercurrent2={teamexposercurrent2}
                    teamexposercurrent1Name={teamexposercurrent1Name}
                    teamexposercurrent2Name={teamexposercurrent2Name} // ✅ Pass the second team name
                    currentExpbgColor1={currentExpbgColor1}
                    currentExpbgColor2={currentExpbgColor2}
                    selectednameteam={selectednameteam}
                    MatchType={MatchType}
                    betType={betType}
                    isModal={true}
                    onAutoClose={handleAutoCloseModal}
                  />
                </div>
              </div>
            </div>
          )}

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
                <div className="book-header">
                  <span>Book</span>
                  <button
                    className="close-btn position-relative top-0"
                    onClick={() => setShowOpenBook(false)}
                  >
                    ✕
                  </button>
                </div>

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
        {isOn && (
          <div className="amountbetalldsd mt-2">
            <div className="container-fluid">

              <div className="row align-items-center justify-content-between g-2 amount-row">

                <div className="col-auto">
                  <strong>AMOUNT:</strong>
                </div>

                <div className="col">
                  <input
                    type="number"
                    min="0"
                    list="stake-options"
                    className="form-control amount-input"
                    placeholder="Enter a number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <datalist id="stake-options">
                    <option value="100" />
                    <option value="200" />
                    <option value="500" />
                    <option value="1000" />
                    <option value="2000" />
                    <option value="5000" />
                    <option value="10000" />
                    <option value="20000" />
                    <option value="25000" />
                    <option value="50000" />
                    <option value="100000" />
                    <option value="200000" />
                  </datalist>
                </div>

                <div className="col-auto d-flex align-items-center gap-2">
                  <span className="multiplier-box">
                    <strong>8</strong>
                  </span>

                  <button
                    className="done-btn"
                    disabled={!amount}
                  >
                    DONE
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
        <Matchbets />
        <Fancybetall />
        <div className="d-flex justify-content-center align-items-center py-2">
          <button className="completed-btn" onClick={() => setShowCompleted(true)}>
            Completed Bets
          </button>
        </div>
        {showCompleted && (
          <div className="completed-overlay" onClick={() => setShowCompleted(false)}>
            <div
              className="completed-popup"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="completed-header">
                <h4>COMPLETED BETS</h4>
                <button onClick={() => setShowCompleted(false)}>✕</button>
              </div>

              <div className="completed-body">
                <Completebet />
              </div>
            </div>
          </div>
        )}

        <div className="bet-action-wrap py-2">
          <button
            className="bet-history-btn"
            onClick={() => setIsBetHistoryOpen(true)}
          >
            All Matchs
          </button>
        </div>

        {isBetHistoryOpen && (
          <div
            className="bet-history-overlay"
            onClick={() => setIsBetHistoryOpen(false)}
          >
            <div
              className="bet-history-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bet-history-header">
                <h4>All Events</h4>
                <button onClick={() => setIsBetHistoryOpen(false)}>✕</button>
              </div>

              <div className="bet-history-body">
                <div className="bet-table-scroll" onClick={() => setIsBetHistoryOpen(false)}>
                  <Homepageslider />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cricket;