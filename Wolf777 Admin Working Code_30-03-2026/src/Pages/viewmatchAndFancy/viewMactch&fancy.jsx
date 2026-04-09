import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from "axios";
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { FiClock } from "react-icons/fi";

import { getEventBetsFancy } from "../../Server/api";
import ladder from '../../asset/image/image (6).png'
// import Ladder from '../Pages/Ladder'
import Ladder from "../viewmatchAndFancy/Ladder";
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
import "../viewmatchAndFancy/ViewmatchAndfancy.scss";
import { FaArrowRight } from "react-icons/fa6";
import Clients_SessionPL from "../viewmatchAndFancy/Clients_SessionPL";
import MatchStats from "../viewmatchAndFancy/MatchStats";
import CompletedSessions from "../viewmatchAndFancy/CompletedSessions";
import Fakedata from "../viewmatchAndFancy/Fakedata";
// import Clients_SessionPL from "../Pages/Clients_SessionPL";
// import MatchStats from "../Pages/MatchStats";
// import CompletedSessions from "../Pages/CompletedSessions";
// import Fakedata from "../Pages/Fakedata";

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
const BetSlipModalContent = memo(
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

    const getTextColor = () => {
      if (betType === "back") {
        return "#155724";
      } else if (betType === "lay") {
        return "#721c24";
      }
      return "#212529";
    };

    return (
      <div className="bet-slip-modal-content">
        {/* Your existing bet slip modal content */}
      </div>
    );
  }
);

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
        <div className="fancy-quick-tr placebet">
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

// FIXED BookmakerTable Component
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
    currentExpbgColor1,
    currentExpbgColor2,
    selectednameteam,
    betType,
    bookmakerExposureData,
    matchesName,
    onMyBookClicktotel,
    onMyBookClick,
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

    const getExposureAmount = (runnerName) => {
      if (!bookmakerExposureData || typeof bookmakerExposureData !== 'object') {
        return 0;
      }

      if (matchesName && Array.isArray(matchesName)) {
        const team = matchesName.find(t =>
          t.team_name && runnerName &&
          t.team_name.toLowerCase() === runnerName.toLowerCase()
        );

        if (team && bookmakerExposureData[team.team_id] !== undefined) {
          return bookmakerExposureData[team.team_id];
        }

        if (team && bookmakerExposureData[team.team_id?.toString()] !== undefined) {
          return bookmakerExposureData[team.team_id.toString()];
        }
      }

      const keys = Object.keys(bookmakerExposureData);
      for (const key of keys) {
        const exposure = bookmakerExposureData[key];
        if (exposure && typeof exposure === 'object' && exposure.amount !== undefined) {
          return exposure.amount;
        }
        return exposure;
      }

      return 0;
    };

    const getExposureColor = (amount) => {
      if (!amount && amount !== 0) {
        return "#666";
      }

      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

      if (numAmount > 0) return "#108f10ff";
      if (numAmount < 0) return "#ff0000";
      return "#666";
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
                    {/* <div className="d-flex justify-content-between align-items-center">
                     <p className="text_blink"> Bookmaker</p> 
                       <p className="stack-info text_blink">
                        <span className="text_blink">Max:</span><span className="text_blink"> 10000</span>
                      </p> 

                      <button
                        className="backbutton"
                        onClick={onMyBookClick}
                      disabled={isFetchingExposure}
                      >
                        {isFetchingExposure ? (
                          <span className="spinner-border spinner-border-sm me-1"></span>
                        ) : null} 
                         My Book
                      </button>
                      <div onClick={onMyBookClicktotel} className="backbutton">Ttl Book</div>
                    </div>  */}
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
                      const teamExposure = getExposureAmount(runner.runnerName);
                      const exposureColor = getExposureColor(teamExposure);

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
                              <div className="d-flex height_60 justify-content-between align-items-center">
                                <div className="d-flex gap-2">
                                  <a>{runner.runnerName}</a>
                                  <span className="forstrongchang">
                                    <strong className="red d-flex gap-1 align-items-center">
                                      {teamExposure !== 0 && (
                                        <div
                                          style={{
                                            color: exposureColor,
                                            display: "inline-block",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            minWidth: "60px",
                                            textAlign: "start",
                                          }}
                                        >
                                          ({teamExposure > 0 ? "+" : ""}{formatNumber(teamExposure)})
                                        </div>
                                      )}
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
                                </div>
                              </div>

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
                              <div className="d-flex height_60 justify-content-between align-items-center">
                                <div className="d-flex gap-2">
                                  <a>{runner.runnerName}</a>
                                  <span className="forstrongchang">
                                    <strong className="red d-flex gap-1 align-items-center">
                                      {teamExposure !== 0 && (
                                        <div
                                          style={{
                                            color: exposureColor,
                                            display: "inline-block",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            minWidth: "60px",
                                            textAlign: "start",
                                          }}
                                        >
                                          ({teamExposure > 0 ? "+" : ""}{formatNumber(teamExposure)})
                                        </div>
                                      )}
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
                                </div>
                              </div>
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
  const [MatchType, setMatchType] = useState("match_odds");
  const [bgColor, setBgColor] = useState("#72bbef");
  const [stackValueteam, setStackValueteam] = useState(1);
  const [showBetHistoryModal, setShowBetHistoryModal] = useState(false);
  const [showBetSlipModal, setShowBetSlipModal] = useState(false);
  const [fancyExposureData, setFancyExposureData] = useState({});
  const [matchOddsExposureData, setMatchOddsExposureData] = useState({});
  const [bookmakerExposureData, setBookmakerExposureData] = useState({});
  // Ladder Modal State
  const [isLadderOpen, setIsLadderOpen] = useState(false);
  const [selectedFancyId, setSelectedFancyId] = useState(null);
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
  const [activeTab, setActiveTab] = useState("");
  const [highlightedMarkets, setHighlightedMarkets] = useState({});
  const previousMarketValues = useRef({});
  const previousMatchValues = useRef({});
  const previousBookmakerValues = useRef({});
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const seriesIndex = pathParts.indexOf("series_idd");
  const eventIndex = pathParts.indexOf("event_id");
  const series_idd = seriesIndex !== -1 ? pathParts[seriesIndex + 1] : "";
  const event_id = eventIndex !== -1 ? pathParts[eventIndex + 1] : "";

  console.warn("Extracted series_idd:", series_idd);
  console.warn("Extracted event_id:", event_id);

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

  const [showLoginModal, setShowLoginModal] = useState(false);
  const openLogin = useCallback(() => setShowLoginModal(true), []);
  const closeLogin = useCallback(() => setShowLoginModal(false), []);

  const checkAuthentication = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      openLogin();
      return false;
    }
    return true;
  }, [openLogin]);

  const valuebettingteam = useCallback(
    (value) => {
      if (MatchType === "match_odds") {
        if (bgColor === "#72bbef") {
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
      } else if (MatchType === "bookmaker") {
        if (bgColor === "#72bbef") {
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
      } else if (MatchType === "fancy") {
        if (bgColor === "#72bbef") {
          var abc = parseFloat(value);
          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name("none");

          setteamexposercurrent1(parseInt(abc));
          setteamexposercurrent2(0);

          const color1 = "#108f10ff";
          const color2 = "#ff0000";
          setcurrentExpbgColor1(color1);
          setcurrentExpbgColor2(color2);
        } else {
          var abc = parseFloat(value);
          setteamexposercurrent1Name(selectednameteam);
          setteamexposercurrent2Name("none");

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
    [MatchType, bgColor, stackValueteam, selectednameteam]
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




  const fetchMatchTotalExposure = useCallback(async () => {
    try {
      if (!event_id) {
        console.log("❌ No event_id available");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-match-total-exposer`,
        { eventid: event_id }
      );

      if (response.data?.status_code === 1) {
        const matchOddsMap = {};
        const bookmakerMap = {};

        if (Array.isArray(response.data.match_odds)) {

          response.data.match_odds.forEach(item => {
            console.log(`   Match Odds - team_id: ${item.team_id}, amount: ${item.amount}`);
            matchOddsMap[item.team_id] = item.amount;
          });
        } else {
          console.log("⚠️ match_odds is not an array or is missing");
        }

        if (response.data.bookmaker) {
          console.log("📊 Bookmaker data structure:", response.data.bookmaker);

          if (Array.isArray(response.data.bookmaker)) {
            console.log(`📈 Processing ${response.data.bookmaker.length} bookmaker items`);
            response.data.bookmaker.forEach(item => {
              console.log(`   Bookmaker - team_id: ${item.team_id}, amount: ${item.amount}`);
              bookmakerMap[item.team_id] = item.amount;
            });
          }
          else if (typeof response.data.bookmaker === 'object') {
            console.log("📊 Bookmaker is an object, processing keys:", Object.keys(response.data.bookmaker));
            Object.keys(response.data.bookmaker).forEach(key => {
              const item = response.data.bookmaker[key];
              if (item && item.team_id !== undefined) {
                console.log(`   Bookmaker - team_id: ${item.team_id}, amount: ${item.amount}`);
                bookmakerMap[item.team_id] = item.amount;
              }
            });
          }
        } else {
          console.log("⚠️ bookmaker data is missing");
        }

        console.log("✅ Final Match odds exposure map:", matchOddsMap);
        console.log("✅ Final Bookmaker exposure map:", bookmakerMap);

        setMatchOddsExposureData(matchOddsMap);
        setBookmakerExposureData(bookmakerMap);

        setTimeout(() => {
          setBookmakerList(prev => [...prev]);
        }, 100);
      } else {
        console.log("❌ API returned status_code != 1");
      }
    } catch (error) {
      console.error("❌ Error fetching match total exposure:", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  }, [event_id]);

  const role = localStorage.getItem("role");

  const admin_id = localStorage.getItem("admin_id");
  const totalexposermy = useCallback(async () => {
    try {
      if (!event_id) {
        console.log("❌ No event_id available");
        return;
      }
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-match-total-exposer-my`,
        {
          eventid: event_id,
          role: role,
          adminid: admin_id
        }
      );

      console.log("📊 Match total exposure API response:", response.data);

      if (response.data?.status_code === 1) {
        const matchOddsMap = {};
        const bookmakerMap = {};

        // Process match_odds if exists
        if (Array.isArray(response.data.match_odds)) {
          console.log(`📈 Processing ${response.data.match_odds.length} match odds items`);
          response.data.match_odds.forEach(item => {
            console.log(`   Match Odds - team_id: ${item.team_id}, amount: ${item.amount}`);
            matchOddsMap[item.team_id] = item.amount;
          });
        } else {
          console.log("⚠️ match_odds is not an array or is missing");
        }

        // NEW: Directly use response.data.data for bookmaker exposure
        if (response.data.data && typeof response.data.data === 'object') {
          console.log("📊 Direct bookmaker data from response.data.data:", response.data.data);

          // Copy all data from response.data.data to bookmakerMap
          Object.keys(response.data.data).forEach(teamId => {
            bookmakerMap[teamId] = response.data.data[teamId];
          });
        }

        console.log("✅ Final Match odds exposure map:", matchOddsMap);
        console.log("✅ Final Bookmaker exposure map:", bookmakerMap);

        setMatchOddsExposureData(matchOddsMap);
        setBookmakerExposureData(bookmakerMap);

        // Show success notification
        showNotification("Exposure data updated successfully!", "success");

        setTimeout(() => {
          setBookmakerList(prev => [...prev]);
        }, 100);
      } else {
        console.log("❌ API returned status_code != 1");
        showNotification("Failed to fetch exposure data", "error");
      }
    } catch (error) {
      console.error("❌ Error fetching match total exposure:", error);
      console.error("Error details:", error.response?.data || error.message);
      showNotification("Error fetching exposure data", "error");
    }
    //  finally {
    //   setIsFetchingExposure(false);
    // }
  }, [event_id, showNotification, role]);

  // Handler for My Book button click
  const handleMyBookClick = useCallback(() => {
    console.log("📘 My Book button clicked");
    totalexposermy();
    // totalexposermy();
  }, [totalexposermy]);

  const handleMyBookClicktolet = useCallback(() => {
    console.log("📘 My Book button clicked");
    fetchMatchTotalExposure();

    // totalexposermy();
  }, [fetchMatchTotalExposure]);




  //   const handleMyBookClick = useCallback(() => {
  //   console.log("📘 My Book button clicked");
  //   totalexposermy();
  //   // totalexposermy();
  // }, [totalexposermy]);




  const fetchFancyExposureData = useCallback(async () => {
    try {
      if (!event_id) return;

      console.log("Fetching fancy exposure data for event_id:", event_id);

      const exposurePromises = fancylist.map(async (market) => {
        const fancyId = `${event_id}-${market.SelectionId}`;

        try {
          // const response = await axios.post(
          //   `${process.env.REACT_APP_API_URL}/get-fancy-total-exposer?fancy_id=${fancyId}`
          // );

          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/get-fancy-total-exposer`,
            {
              fancy_id: fancyId,
              role: "1",
              admin_id: admin_id
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data?.status_code === 1) {
            return {
              fancyId: fancyId,
              data: response.data
            };
          }
        } catch (error) {
          console.warn(`Failed to fetch exposure for ${fancyId}:`, error);
          return null;
        }
      });

      const results = await Promise.all(exposurePromises);
      const validResults = results.filter(result => result !== null);

      const exposureMap = {};
      validResults.forEach(result => {
        exposureMap[result.fancyId] = result.data;
      });

      setFancyExposureData(exposureMap);
      console.log("Fancy exposure data loaded:", exposureMap);

    } catch (error) {
      console.error("Error fetching fancy exposure data:", error);
    }
  }, [event_id, fancylist]);

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
    console.log("matchesName state:", matchesName);
    console.log("Matches state:", Matches);
  }, [matchesName, Matches]);

  useEffect(() => {
    getmarketteamsodds()
  }, [])

  const getmarketteamsodds = useCallback(async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/market-teams-name`,
        {},
        {
          params: {
            id: series_idd,
          },
        }

      );



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

  // const matchlist = useCallback(async () => {
  //   try {
  //     setMatchLoading(true);
  //     const token = localStorage.getItem("accessToken");
  //     if (!series_idd) {
  //       console.warn("No series_idd available");
  //       return;
  //     }

  //     const response = await axios.get(
  //       `https://cricketfancylive.shyammatka.co.in/get-match-odds-list?id=${series_idd}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("Match odds API response:", response.data);

  //     if (
  //       response.data &&
  //       Array.isArray(response.data) &&
  //       response.data.length > 0
  //     ) {
  //       const marketData = response.data[0];
  //       if (
  //         marketData &&
  //         marketData.runners &&
  //         Array.isArray(marketData.runners)
  //       ) {
  //         const transformedMatches = marketData.runners.map((runner) => {
  //           let teamName = "Unknown Team";

  //           console.log("Looking for team with selectionId:", runner.selectionId);
  //           console.log("Available matchesName:", matchesName);

  //           const matchedTeam = matchesName.find(
  //             team => team.team_id.toString() === runner.selectionId.toString()
  //           );

  //           if (matchedTeam) {
  //             teamName = matchedTeam.team_name;
  //             console.log("Found team:", matchedTeam.team_name);
  //           } else {
  //             teamName = runner.runnerName || `Team ${runner.selectionId}`;
  //             console.log("Using runner name:", teamName);
  //           }

  //           const marketId = runner.selectionId;
  //           const currentValues = {
  //             backPrice0: runner.ex?.availableToBack?.[0]?.price || 0,
  //             backPrice1: runner.ex?.availableToBack?.[1]?.price || 0,
  //             backPrice2: runner.ex?.availableToBack?.[2]?.price || 0,
  //             layPrice0: runner.ex?.availableToLay?.[0]?.price || 0,
  //             layPrice1: runner.ex?.availableToLay?.[1]?.price || 0,
  //             layPrice2: runner.ex?.availableToLay?.[2]?.price || 0,
  //           };

  //           const previousValues = previousMatchValues.current[marketId];

  //           if (previousValues) {
  //             for (let i = 0; i < 3; i++) {
  //               const currentBackPrice = runner.ex?.availableToBack?.[i]?.price;
  //               const previousBackPrice = previousValues[`backPrice${i}`];
  //               if (
  //                 currentBackPrice !== previousBackPrice &&
  //                 currentBackPrice !== undefined
  //               ) {
  //                 highlightMarket(marketId, "back", i);
  //               }
  //             }

  //             for (let i = 0; i < 3; i++) {
  //               const currentLayPrice = runner.ex?.availableToLay?.[i]?.price;
  //               const previousLayPrice = previousValues[`layPrice${i}`];
  //               if (
  //                 currentLayPrice !== previousLayPrice &&
  //                 currentLayPrice !== undefined
  //               ) {
  //                 highlightMarket(marketId, "lay", i);
  //               }
  //             }
  //           }

  //           previousMatchValues.current[marketId] = currentValues;

  //           return {
  //             id: runner.selectionId,
  //             team_name: teamName,
  //             status: runner.status,
  //             lastPriceTraded: runner.lastPriceTraded,
  //             backOdds: runner.ex?.availableToBack?.[0]?.price || 0,
  //             layOdds: runner.ex?.availableToLay?.[0]?.price || 0,
  //             backSize: runner.ex?.availableToBack?.[0]?.size || 0,
  //             laySize: runner.ex?.availableToLay?.[0]?.size || 0,
  //             totalMatched: runner.totalMatched,
  //             runner: runner,
  //             availableToBack: runner.ex?.availableToBack || [],
  //             availableToLay: runner.ex?.availableToLay || [],
  //           };
  //         });
  //         setMatches(transformedMatches);
  //         setError("");
  //       } else {
  //         setError("Invalid match data format - no runners found");
  //         setMatches([]);
  //       }
  //     } else {
  //       setError(response.data?.message || "Failed to fetch matches");
  //       setMatches([]);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching matches:", err);
  //     setError(err.message || "Something went wrong");
  //     setMatches([]);
  //   } finally {
  //     setMatchLoading(false);
  //   }
  // }, [series_idd, highlightMarket, matchesName]);

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

        const completeBetData = {
          ...betData,
          userId: userId,
          sport_id: 4,
        };

        console.log("📤 Original Bet Data:", completeBetData);

        const response = await axios.post(
          `${baseUrl}/place-session-bet`,
          completeBetData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );


        if (response.data.status_code === 1) {
          showNotification(
            response.data.message || "Bet placed successfully!",
            "success"
          );
          window.dispatchEvent(new Event("bet-updated"));

          if (response.data.userAmount) {
            localStorage.setItem(
              "userCredit",
              response.data.userAmount.credit || 0
            );
          }

          setShowBetSlipModal(false);
          closeBetSlip();
        } else {
          showNotification(
            response.data.message || "Failed to place bet",
            "error"
          );
        }
      } catch (error) {
        console.error("❌ Error placing session bet:", error);

        let errorMessage = "An unexpected error occurred. Please try again.";

        if (error.response) {
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
      } catch (error) {
        console.error("❌ Error placing regular bet:", error);

        let errorMessage = "An unexpected error occurred. Please try again.";

        if (error.response && error.response.data) {
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
      console.warn("Fancy bet detected:", selectedOdds.market)
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
    console.log("Modal auto-closed after 8 seconds");
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
      team: teamName,
      market_name: marketName,
      fancy_id: selectedOdds.market?.SelectionId || selectedOdds.rowId || "123",
    };

    if (matchType === "fancy") {
      betData.fancy_id = selectedOdds.market?.SelectionId || selectedOdds.rowId;
      betData.session_id =
        selectedOdds.market?.SelectionId || selectedOdds.rowId;
    } else {
      betData.market_id = series_idd;
      betData.team_id = selectedOdds.market?.id || selectedOdds.rowId;
    }

    console.log("📤 Bet Data to send:", betData);
    console.log("🎯 Match Type:", matchType);

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
    matchesName,
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

      const teamInfo = matchesName.find(team => team.team_id === rowId.toString());
      const teamName = teamInfo ? teamInfo.team_name :
        (market.team_name || `Team ${rowId}`);

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
      const size = type === "back"
        ? market.BackSize1 || 0
        : market.LaySize1 || 0;

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

        fetchFancyExposureData();

      } else if (data && Array.isArray(data.data)) {
        setfancylist(data.data);
        fetchFancyExposureData();
      } else if (data && typeof data === "object") {
        const dataArray = Object.values(data).filter(
          (item) => item && typeof item === "object" && item.SelectionId
        );
        setfancylist(dataArray);
        fetchFancyExposureData();
      } else {
        setfancylist([]);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setfancylist([]);
    } finally {
      setFancyLoading(false);
    }
  }, [event_id, highlightMarket, fetchFancyExposureData]);

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
          await Promise.all([getfancylist(), getBookmakerList(), fetchMatchTotalExposure()]);
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
    fetchMatchTotalExposure
  ]);

  useEffect(() => {
    const intervals = [];

    const intervalTime =
      showLoginModal || isLadderOpen ? 600000 : 20000;

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

    const exposureInterval = setInterval(() => {
      fetchMatchTotalExposure();
    }, 30000);
    intervals.push(exposureInterval);

    return () => {
      intervals.forEach(clearInterval);
    };
  }, [
    showLoginModal,
    isLadderOpen,
    series_idd,
    event_id,
    // matchlist,
    getfancylist,
    getBookmakerList,
    fetchMatchTotalExposure
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

  // Ladder Modal Functions
  const openLadder = useCallback((fancyId = null) => {
    if (fancyId) {
      setSelectedFancyId(fancyId);
      localStorage.setItem("fancyId", fancyId);
    }
    setIsLadderOpen(true);
  }, []);

  const closeLadder = useCallback(() => {
    setIsLadderOpen(false);
    setSelectedFancyId(null);
    localStorage.removeItem("fancyId");
  }, []);

  // const MatchOddsSection = memo(() => {
  //   const getExposureAmount = (teamId) => {
  //     if (!matchOddsExposureData || typeof matchOddsExposureData !== 'object') {
  //       return 0;
  //     }

  //     if (matchOddsExposureData[teamId] !== undefined) {
  //       return matchOddsExposureData[teamId];
  //     }

  //     if (matchOddsExposureData[teamId?.toString()] !== undefined) {
  //       return matchOddsExposureData[teamId.toString()];
  //     }

  //     return 0;
  //   };

  //   const getExposureColor = (amount) => {
  //     if (!amount && amount !== 0) return "#666";

  //     const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  //     if (numAmount > 0) return "#108f10ff";
  //     if (numAmount < 0) return "#ff0000";
  //     return "#666";
  //   };

  //   useEffect(() => {
  //     console.log("📊 MatchOddsSection - Exposure Data:", matchOddsExposureData);
  //     console.log("📋 MatchOddsSection - Matches:", Matches);
  //   }, [matchOddsExposureData, Matches]);

  //   return (
  //     <div className="winner_bet newdesignjan">
  //       {matchLoading && isInitialLoad ? (
  //         <div className="text-center p-4">
  //           <div className="spinner-border text-primary" role="status">
  //             <span className="visually-hidden">Loading matches...</span>
  //           </div>
  //           <p className="mt-2">Loading matches...</p>
  //         </div>
  //       ) : (
  //         <>
  //           <table
  //             className="table position-relative"
  //             width="100%"
  //           >
  //             <thead >
  //               <tr>
  //                 <th align="left" className="market-name-th" valign="middle">
  //                   <div className="d-flex justify-content-between align-items-center">
  //                     <p className="text_blink"> matvvvvvvvvvvvvvvvvch odds</p>
  //                     {/* <p className="stack-info">
  //                       <span className="text_blink">Max:</span> <span className="text_blink">25000</span>
  //                     </p> */}
  //                   </div>
  //                 </th>
  //                 <th align="center" className="back-h" valign="middle">
  //                   <span>Lagai</span>
  //                 </th>
  //                 <th align="center" className="lay-h" valign="middle">
  //                   <span>Khai</span>
  //                 </th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {Array.isArray(Matches) && Matches.length > 0 ? (
  //                 Matches.map((market) => {
  //                   const teamName = market.team_name;
  //                   const teamExposure = getExposureAmount(market.id);
  //                   const exposureColor = getExposureColor(teamExposure);

  //                   return (
  //                     <React.Fragment key={market.id}>
  //                       <tr className="game_status_new white-bg skyDetailsRow">
  //                         <td
  //                           align="left"
  //                           className="selaction_name"
  //                           valign="middle"
  //                         >
  //                           <div className="d-flex height_60 justify-content-between align-items-center">
  //                             <div className="d-flex gap-2">
  //                               <a href="#">{teamName}</a>

  //                               <span className="forstrongchang">
  //                                 <strong className="red d-flex gap-1 align-items-center">
  //                                   {teamExposure !== 0 && (
  //                                     <div
  //                                       style={{
  //                                         color: exposureColor,
  //                                         display: "inline-block",
  //                                         fontSize: "12px",
  //                                         fontWeight: "bold",
  //                                         minWidth: "60px",
  //                                         textAlign: "start",
  //                                       }}
  //                                     >
  //                                       ({teamExposure > 0 ? "+" : ""}{formatNumber(teamExposure)})
  //                                     </div>
  //                                   )}
  //                                 </strong>{" "}
  //                                 {matchOddsShowCurrentExp ? (
  //                                   teamexposercurrent1Name === teamName ? (
  //                                     <div
  //                                       style={{
  //                                         color: currentExpbgColor1,
  //                                         display: "inline-block",
  //                                         marginLeft: "10px",
  //                                         fontSize: "12px",
  //                                         fontWeight: "bold",
  //                                       }}
  //                                     >
  //                                       {teamexposercurrent1 === 0 ? (
  //                                         <></>
  //                                       ) : (
  //                                         "(" +
  //                                         formatNumber(teamexposercurrent1) +
  //                                         ")"
  //                                       )}
  //                                     </div>
  //                                   ) : (
  //                                     <div
  //                                       style={{
  //                                         color: currentExpbgColor2,
  //                                         display: "inline-block",
  //                                         marginLeft: "10px",
  //                                         fontSize: "12px",
  //                                         fontWeight: "bold",
  //                                       }}
  //                                     >
  //                                       {teamexposercurrent2 === 0 ? (
  //                                         <></>
  //                                       ) : (
  //                                         "(" +
  //                                         formatNumber(teamexposercurrent2) +
  //                                         ")"
  //                                       )}
  //                                     </div>
  //                                   )
  //                                 ) : (
  //                                   <></>
  //                                 )}
  //                               </span>
  //                             </div>
  //                             {/* <span className="ladderimage" role="button" onClick={() => openLadder()}>
  //                               <img src={ladder} alt="ladder" />
  //                             </span> */}
  //                           </div>
  //                         </td>
  //                         {window.innerWidth <= 768 && (
  //                           <td
  //                             className="suspend-col d-mobile"
  //                             colSpan={2}
  //                             style={{ position: "relative" }}
  //                           >
  //                             <div className="d-flex justify-content-start">
  //                               {market.availableToBack
  //                                 .slice(0, 1)
  //                                 .map((back, index) => (
  //                                   <div
  //                                     key={index}
  //                                     className="back1 back-1 bettinggrid"
  //                                     onClick={() =>
  //                                       handleOddsClick(
  //                                         back.price,
  //                                         "back",
  //                                         market,
  //                                         teamName,
  //                                         market.id
  //                                       )
  //                                     }
  //                                     style={{
  //                                       cursor:
  //                                         market.status === "SUSPENDED"
  //                                           ? "not-allowed"
  //                                           : "pointer",
  //                                       color: "#000",
  //                                       background: highlightedMarkets[
  //                                         `${market.id}-back-${index}`
  //                                       ]
  //                                         ? "#f8e71c"
  //                                         : "",
  //                                       transition: "background-color 0.5s ease",
  //                                       padding: "2px 5px",
  //                                       fontWeight: highlightedMarkets[
  //                                         `${market.id}-back-${index}`
  //                                       ]
  //                                         ? "bold"
  //                                         : "700",
  //                                     }}
  //                                   >
  //                                     <span className="backvalue">
  //                                       {back.price}
  //                                     </span>
  //                                     <small>{formatVolume(back.size)}</small>
  //                                   </div>
  //                                 ))}
  //                               {market.availableToLay
  //                                 .slice(0, 1)
  //                                 .map((lay, index) => (
  //                                   <div
  //                                     key={index}
  //                                     className="lay3 lay-1 bettinggrid"
  //                                     onClick={() =>
  //                                       handleOddsClick(
  //                                         lay.price,
  //                                         "lay",
  //                                         market,
  //                                         teamName,
  //                                         market.id
  //                                       )
  //                                     }
  //                                   >
  //                                     <span className="backvalue" style={{}}>
  //                                       {lay.price}
  //                                     </span>
  //                                     <small>{formatVolume(lay.size)}</small>
  //                                   </div>
  //                                 ))}
  //                             </div>
  //                             {market.status === "SUSPENDED" && (
  //                               <span className="suspend-text">SUSPENDED</span>
  //                             )}
  //                           </td>
  //                         )}

  //                         {window.innerWidth > 768 && (
  //                           <td
  //                             className="suspend-col d-desk count"
  //                             colSpan={6}
  //                             style={{ position: "relative" }}
  //                           >
  //                             <div className="d-flex justify-content-start">
  //                               {market.availableToBack
  //                                 .slice(0, 3)
  //                                 .reverse()
  //                                 .map((back, index) => (
  //                                   <div
  //                                     key={index}
  //                                     className={`back1 back-${3 - index
  //                                       } bettinggrid ${index === 0
  //                                         ? "boxhide"
  //                                         : index === 1
  //                                           ? "boxhide"
  //                                           : ""
  //                                       }`}
  //                                     onClick={() =>
  //                                       handleOddsClick(
  //                                         back.price,
  //                                         "back",
  //                                         market,
  //                                         teamName,
  //                                         market.id
  //                                       )
  //                                     }
  //                                   >
  //                                     <span className="backvalue" style={{}}>
  //                                       {back.price}
  //                                     </span>
  //                                     <small>{formatVolume(back.size)}</small>
  //                                   </div>
  //                                 ))}

  //                               {market.availableToLay
  //                                 .slice(0, 3)
  //                                 .map((lay, index) => (
  //                                   <div
  //                                     key={index}
  //                                     className={`lay3 lay-${index + 1
  //                                       } bettinggrid ${index === 1
  //                                         ? "boxhide"
  //                                         : index === 2
  //                                           ? "boxhide"
  //                                           : ""
  //                                       }`}
  //                                     onClick={() =>
  //                                       handleOddsClick(
  //                                         lay.price,
  //                                         "lay",
  //                                         market,
  //                                         teamName,
  //                                         market.id
  //                                       )
  //                                     }
  //                                   >
  //                                     <span className="backvalue" style={{}}>
  //                                       {lay.price}
  //                                     </span>
  //                                     <small>{formatVolume(lay.size)}</small>
  //                                   </div>
  //                                 ))}
  //                             </div>
  //                             {market.status === "SUSPENDED" && (
  //                               <span className="suspend-text">SUSPENDED</span>
  //                             )}
  //                           </td>
  //                         )}
  //                       </tr>
  //                     </React.Fragment>
  //                   );
  //                 })
  //               ) : (
  //                 <Fakedata />
  //               )}
  //             </tbody>
  //           </table>
  //         </>
  //       )}
  //     </div>
  //   );
  // });






  const FancyBetsSection = memo(() => (
    <div className="fancybetcontent">
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
                <div className="fancybetsportsbook mt-2">
                  <div className="tabsfancycontent">
                    <div className="fancybetcontent">
                      <div>
                        <div className="tab-content-fancy">
                          <div className="indian-fancy-part skyDetailsRow">
                            <div className="table-part position-relative">
                              <table
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                className="table"
                                width="100%"
                                style={{ margin: 0 }}
                              >
                                <thead>
                                  <tr>
                                    <th align="left" className="market-name-th" valign="middle">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <p className="text_blink"> Fancy Bet</p>

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
                                    fancylist.map((market) => {
                                      const rowId = market.SelectionId || market.id;
                                      const fancyExposureKey = `${event_id}-${market.SelectionId}`;
                                      const exposureData = fancyExposureData[fancyExposureKey];
                                      const totalExposer = exposureData?.total_exposer || 0;
                                      const usersCount = exposureData?.users_count || 0;

                                      return (
                                        <tr key={rowId} className="white-bg skyDetailsRow">
                                          <td align="left" className="selaction_name" valign="middle">
                                            <div className="d-flex height_60 justify-content-between align-items-center">
                                              <div className="d-flex gap-2">
                                                <span>
                                                  <a>{market.RunnerName}</a>
                                                  <small className="max_amt">
                                                    Max:{market.max || 1000
                                                    }
                                                  </small>
                                                </span>
                                                {(totalExposer !== 0 || usersCount !== 0) && (
                                                  <small
                                                    className="exposerall"
                                                  >
                                                    <span className="totalnewall"

                                                    >({formatNumber(totalExposer)})</span>
                                                  </small>
                                                )}
                                              </div>

                                              <div className="d-flex justify-content-end align-items-center">
                                                {exposureData && totalExposer > 0 && (
                                                  <div className="exposure-info">
                                                    <span
                                                      className="ladderimage"
                                                      role="button"
                                                      onClick={() => openLadder(`${event_id}-${market.SelectionId}`)}
                                                    >
                                                      <img src={ladder} alt="ladder" />
                                                    </span>

                                                    {/* <span className="exposure-value">
                                                      {totalExposer}
                                                    </span> */}
                                                  </div>
                                                )}
                                              </div>

                                            </div>
                                          </td>
                                          <td
                                            align="center"
                                            className="padding_0"
                                            colSpan={2}
                                            valign="middle"
                                            style={{ position: "relative" }}
                                          >
                                            <div className="betbox">
                                              <a
                                                className={`td_btn pink_bg ${market.GameStatus === "SUSPENDED" ||
                                                  market.GameStatus === "BALL RUNNING"
                                                  ? "suspended-odds"
                                                  : ""
                                                  }`}
                                                onClick={() =>
                                                  market.GameStatus !== "SUSPENDED" &&
                                                  market.GameStatus !== "BALL RUNNING" &&
                                                  handleFancyOddsClick(
                                                    market.LayPrice1,
                                                    "lay",
                                                    market,
                                                    "no"
                                                  )
                                                }
                                              >
                                                <span className="novalue">
                                                  {market.LayPrice1 || 0}
                                                </span>
                                                <span className="novalue1">
                                                  {formatVolume(market.LaySize1 || 0)}
                                                </span>
                                              </a>
                                            </div>
                                            <div className="betbox" style={{ right: 0 }}>
                                              <a
                                                className={`td_btn blue_bg ${market.GameStatus === "SUSPENDED" ||
                                                  market.GameStatus === "BALL RUNNING"
                                                  ? "suspended-odds"
                                                  : ""
                                                  }`}
                                                onClick={() =>
                                                  market.GameStatus !== "SUSPENDED" &&
                                                  market.GameStatus !== "BALL RUNNING" &&
                                                  handleFancyOddsClick(
                                                    market.BackPrice1,
                                                    "back",
                                                    market,
                                                    "yes"
                                                  )
                                                }
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
                                      );
                                    })
                                  ) : (
                                    <tr className="white-bg skyDetailsRow">
                                      <td align="left" className="selaction_name" valign="middle">
                                        <div className="d-flex height_60 justify-content-between align-items-center">
                                          <span>
                                            <a>----</a>
                                            <small className="max_amt">Max:---</small>
                                          </span>
                                          <span
                                            className="ladderimage"
                                            role="button"
                                            onClick={() => openLadder()}
                                          >
                                            <img
                                              alt="ladder"
                                              src={ladder}
                                            />
                                          </span>
                                        </div>
                                      </td>
                                      <td
                                        align="center"
                                        className="padding_0"
                                        colSpan={2}
                                        valign="middle"
                                        style={{ position: "relative" }}
                                      >
                                        <div className="betbox">
                                          <a
                                            className="td_btn pink_bg "
                                          >
                                            <span className="novalue">--</span>
                                            <span className="novalue1">--</span>
                                          </a>
                                        </div>
                                        <div className="betbox" style={{ right: 0 }}>
                                          <a
                                            className="td_btn blue_bg "
                                          >
                                            <span className="novalue">--</span>
                                            <span className="novalue1">--</span>
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
    </div >
  ));







  const [showCompleted, setShowCompleted] = useState(false);
  const [isBetHistoryOpen, setIsBetHistoryOpen] = useState(false);

  useEffect(() => {
    console.log("🔍 Bookmaker exposure data updated:", bookmakerExposureData);
    console.log("📋 Bookmaker exposure keys:", Object.keys(bookmakerExposureData));
  }, [bookmakerExposureData]);

  return (
    <div className="eventallpagenewallall">
      <CustomNotification
        notification={notification}
        onClose={closeNotification}
      />

      {/* Ladder Modal */}
      {isLadderOpen && (
        <div className="modal-overlay" onClick={closeLadder}>
          <div className="ladder-modal modal_client" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title mb-0 text-white">Client Session PL</h5>
              <button className="close-btn" onClick={closeLadder}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <Ladder fancyId={selectedFancyId} />
            </div>
          </div>
        </div>
      )}
      <section className="cricket_design new_game_design_myxbet">
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
        <div
          className={`tvall w-100 d-flex align-items-center justify-content-start p-2 gap-2 buttonall_new
    ${activeTab === "tv" ? "active" : ""}`}
          onClick={() => setActiveTab(activeTab === "tv" ? null : "tv")}
          style={{ cursor: "pointer", zIndex: 5 }}
        >
          {/* <FaTv /> */}
          <span>TV</span>
        </div>
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
            // src={`https://e765432.diamondcricketid.com/sr.php?id=${event_id}&sportid=4`}
            src={`https://tv.tresting.com/lnt.php?eventid=${event_id}`}
            allowFullScreen
          />
        </div>

        {/* {activeTab === "tv" && (
          <div className="matchtv mt-2 position-relative">
            <div
              className="position-absolute top-0 end-0 p-2"
              style={{ cursor: "pointer", zIndex: 5 }}
              onClick={() => setActiveTab(null)}
            >
              <IoIosCloseCircleOutline size={25} color="#ff4d4f" />
            </div>

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
        )} */}




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
          />
        </div>

        <div className="cricketbettingalldesign eventsallbetshow">
          {/* <MatchOddsSection /> */}

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
            currentExpbgColor1={currentExpbgColor1}
            currentExpbgColor2={currentExpbgColor2}
            selectednameteam={selectednameteam}
            betType={betType}
            bookmakerExposureData={bookmakerExposureData}
            matchesName={matchesName}
            onMyBookClicktotel={handleMyBookClicktolet}
            onMyBookClick={handleMyBookClick}
          />

          <FancyBetsSection />
        </div>

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

      <Clients_SessionPL />

      <MatchStats />

      {/* <CompletedSessions /> */}
    </div>
  );
}

export default Cricket;