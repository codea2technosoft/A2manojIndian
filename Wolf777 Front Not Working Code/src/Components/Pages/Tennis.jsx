import { IoMdInformationCircleOutline } from "react-icons/io";
import axios from "axios";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Swal from 'sweetalert2';
import { Row, Col, InputGroup, Badge, Button, Modal, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTv, FaExpand, FaCompress } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOutlineScoreboard } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";


function Tennis() {
  const [stake, setStake] = useState("");
  const [placebet, setPlacebet] = useState(false);
  const [selectedOdds, setSelectedOdds] = useState(null);
  const [betType, setBetType] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSuspended, setIsSuspended] = useState(true);
  const [scorecard, setScorecard] = useState(false);
  const [openInfoId, setOpenInfoId] = useState(null);

  const toggleInfo = (id) => {
    setOpenInfoId(openInfoId === id ? null : id);
  };


  const [fancybet, setFancybet] = useState('fancybetall');
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [myBets, setMyBets] = useState([]);
  const [showMyBets, setShowMyBets] = useState(false);
  const [betsLoading, setBetsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [Matches, setMatches] = useState([]);
  const [bookmakerList, setBookmakerList] = useState([]);
  const [tiedList, setTiedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fancylist, setfancylist] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [fancyLoading, setFancyLoading] = useState(false);

  const stakeInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [bettingdesign, setBettingdesign] = useState(false)
  const nodeMode = process.env.NODE_ENV;
  // const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  // const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  // const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

    const baseUrl = process.env.REACT_APP_BACKEND_API;


  // Quick stake amounts
  const quickStakes = [10, 20, 50, 100, 200, 500, 1000, 1500, 2000];

  const savedValues = JSON.parse(localStorage.getItem("buttonValues"));
  const fancyQuickStakes = savedValues && savedValues.length > 0
    ? savedValues.map(Number)
    : [10, 20, 50, 100, 200, 500, 1000, 1500, 2000];

  const tabsinner = ["ALL", "Fancy", "Line Markets", "Ball by Ball", "Meter Markets", "Khado Markets"];
  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tvVisible, setTvVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const iframeRef = useRef(null);

  const betsPerPage = 5;
  const userId = localStorage.getItem("user_id");
  const event_id = "34920885";

  const togglebetting = () => {
    setBettingdesign(prev => !prev);
  }
  const togglescore = () => {
    setScorecard(prev => !prev);
  }
         

  // Fetch user bets
  const fetchMyBets = async () => {
    try {
      if (!userId) return;
      const res = await axios.post(`${baseUrl}/my-bets`, { user_id: userId });
      if (res.data?.status_code === 1 && Array.isArray(res.data.data)) {
        setBets(res.data.data);
      } else {
        setBets([]);
      }
    } catch (error) {
      console.error("Error fetching bets:", error);
      setBets([]);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMyBets();
  }, []);

  // Listen for bet update event
  useEffect(() => {
    const handleBetUpdate = () => {
      fetchMyBets();
    };
    window.addEventListener("bet-updated", handleBetUpdate);
    return () => window.removeEventListener("bet-updated", handleBetUpdate);
  }, []);

  const totalPages = Math.ceil(bets.length / betsPerPage);
  const start = (currentPage - 1) * betsPerPage;
  const currentBets = bets.slice(start, start + betsPerPage);

  const toggleFullScreen = () => {
    const iframeEl = iframeRef.current;
    if (!iframeEl) return;
    if (!document.fullscreenElement) {
      iframeEl.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleExitFullScreen = () => setIsFullScreen(false);
    document.addEventListener("fullscreenchange", handleExitFullScreen);
    return () => {
      document.removeEventListener("fullscreenchange", handleExitFullScreen);
    };
  }, []);
  // Get match list - FIXED VERSION
  const matchlist = useCallback(async () => {
    const market_iddata = localStorage.getItem("series_idd");

    try {
      // setMatchLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`https://cricketfancylive.shyammatka.co.in/get-match-odds-list?id=${market_iddata}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Match Odds API Response:", response.data);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const marketData = response.data[0];

        if (marketData && marketData.runners && Array.isArray(marketData.runners)) {
          // Properly transform the API data
          const transformedMatches = marketData.runners.map(runner => {
            // Get team name based on selectionId or use runner name if available
            let teamName = "Unknown Team";
            if (runner.selectionId === 7461) {
              teamName = "Pakistan";
            } else if (runner.selectionId === 349) {
              teamName = "South Africa";
            } else {
              teamName = `Team ${runner.selectionId}`;
            }

            // Get back and lay odds with proper fallbacks
            const backOdds = runner.ex?.availableToBack?.[0]?.price || 0;
            const layOdds = runner.ex?.availableToLay?.[0]?.price || 0;
            const backSize = runner.ex?.availableToBack?.[0]?.size || 0;
            const laySize = runner.ex?.availableToLay?.[0]?.size || 0;

            return {
              id: runner.selectionId,
              team_name: teamName,
              status: runner.status,
              lastPriceTraded: runner.lastPriceTraded,
              backOdds: backOdds,
              layOdds: layOdds,
              backSize: backSize,
              laySize: laySize,
              totalMatched: runner.totalMatched,
              runner: runner,
              // Store all available odds for display
              availableToBack: runner.ex?.availableToBack || [],
              availableToLay: runner.ex?.availableToLay || []
            };
          });

          setMatches(transformedMatches);
          setError("");
          console.log("Transformed Matches:", transformedMatches);
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
      // setMatchLoading(false);
    }
  }, []);

  // Rest of your existing functions remain the same...
  const toggleMyBets = () => {
    if (!showMyBets) {
    }
    setShowMyBets(!showMyBets);
  };

  const placeSessionBet = async (betData) => {
    try {
      setError("");
      setSuccessMessage("");
      // setIsPlacingBet(true);

      console.log("Sending bet data:", betData);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please login again',
          timer: 3000,
          showConfirmButton: false
        });
        return;
      }

      const response = await axios.post(
        `${baseUrl}/place-session-bet`, betData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        }
      );

      console.log("API Response:", response.data);

      if (response.data.status_code === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || "Bet placed successfully!",
          timer: 3000,
          showConfirmButton: false
        });
        window.dispatchEvent(new Event("bet-updated"));

        if (response.data.credit) {
          console.log("Updated credit:", response.data.credit);
          localStorage.setItem('userCredit', response.data.credit);
        }

        if (response.data.win_amount) {
          console.log("Potential win amount:", response.data.win_amount);
        }

        closeBetSlip();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: response.data.message || "Failed to place bet",
          timer: 3000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error placing session bet:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      // setIsPlacingBet(false);
    }
  };

  const placeRegularBet = async (betData) => {
    try {
      setError("");
      setSuccessMessage("");
      // setIsPlacingBet(true);

      console.log("Sending regular bet data:", betData);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please login again',
          timer: 3000,
          showConfirmButton: false
        });
        return;
      }

      const response = await axios.post(
        `${baseUrl}/place-betpost`,
        betData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000
        }
      );

      console.log("Regular Bet API Response:", response.data);

      if (response.data.status_code === 1) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.data.message || "Bet placed successfully!",
          timer: 3000,
          showConfirmButton: false
        });

        window.dispatchEvent(new Event("bet-updated"));

        if (response.data.credit) {
          console.log("Updated credit:", response.data.credit);
          localStorage.setItem('userCredit', response.data.credit);
        }

        closeBetSlip();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: response.data.message || "Failed to place bet",
          timer: 3000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error placing regular bet:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      }

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      // setIsPlacingBet(false);
    }
  };

  // const getMatchType = () => {
  //   if (!selectedOdds) return "match_odds";

  //   if (selectedOdds.market?.RunnerName || selectedOdds.clickedSide) {
  //     return "fancy";
  //   }

  //   if (selectedOdds.market?.nat) {
  //     return "bookmaker";
  //   }

  //   return "match_odds";
  // };


   const getMatchType = () => {
    if (!selectedOdds) {
      console.warn("No selected odds - returning match_odds");
      return "match_odds";
    }

    console.log("🔍 Analyzing match type for:", {
      market: selectedOdds.market,
      oddType: selectedOdds.oddType,
      eventName: selectedOdds.eventName,
      marketName: selectedOdds.marketName
    });

    // Fancy bets
    if (selectedOdds.market?.RunnerName || selectedOdds.clickedSide) {
      console.warn("✅ Match Type: FANCY");
      return "fancy";
    }

    // Bookmaker 
    const isBookmaker = selectedOdds.market?.marketName?.toLowerCase().includes('bookmaker') ||
      selectedOdds.oddType?.toLowerCase().includes('bookmaker') ||
      selectedOdds.market?.marketType === 'BOOK_MAKER';

    if (isBookmaker) {
      console.warn("✅ Match Type: BOOKMAKER");
      return "bookmaker";
    }

    // Tied match
    const isTied = selectedOdds.market?.marketName?.toLowerCase().includes('tied') ||
      selectedOdds.oddType?.toLowerCase().includes('tied');

    if (isTied) {
      console.warn("✅ Match Type: TIED");
      return "tied";
    }

    console.warn("✅ Match Type: MATCH_ODDS");
    return "match_odds";
  };
  const getMarketName = () => {
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
  };

  const handlePlaceBet = () => {
    const stakeValue = parseInt(stake) || 0;

    if (stakeValue === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Stake',
        text: 'Please enter a stake amount',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    if (!selectedOdds) {
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'No odds selected',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const userId = localStorage.getItem("user_id");
    const event_id = localStorage.getItem("event_id") || "event_id";

    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'User Error',
        text: 'User ID not found. Please login again.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const matchType = getMatchType();
    const marketName = getMarketName();
    const betData = {
      ...(matchType === "fancy"
        ? { userId: userId }
        : { user_id: userId }
      ),
      betSlip_odds: parseFloat(selectedOdds.value),
      betSlip_stake: stakeValue,
      total: stakeValue,
      bet_on: betType,
      MatchType: matchType,
      event_id: event_id,
      market_id:
        selectedOdds.market?.SelectionId ||
        selectedOdds.market?.sid ||
        selectedOdds.market?.id ||
        selectedOdds.market?.selectionId ||
        "1.249372751",
      sport_id: "4",
      team_id: selectedOdds.market?.id || selectedOdds.rowId || "12391119",
      team: selectedOdds.eventName || "India",
      market_name: marketName,
      fancy_id:
        selectedOdds.market?.SelectionId || selectedOdds.rowId || "123"
    };

    console.log("Final bet data:", betData);

    if (matchType === "fancy") {
      placeSessionBet(betData);
    } else {
      placeRegularBet(betData);
    }
  };

  const handleOddsClick = (oddsValue, type, market, oddType, rowId) => {
    if (placebet && selectedRow === rowId) {
      closeBetSlip();
      return;
    }

    setSelectedOdds({
      value: oddsValue,
      eventName: market.runnerName || market.team_name,
      type: type,
      marketName: market.runnerName || market.team_name,
      oddType: oddType,
      rowId: rowId,
      market: market
    });
    setBetType(type);
    setPlacebet(true);
    setSelectedRow(rowId);
    setError("");
    setSuccessMessage("");
    setStake("");
  }

  const handleFancyOddsClick = (oddsValue, type, market, clickedSide) => {
    if (market.GameStatus === "SUSPENDED") {
      Swal.fire({
        icon: 'warning',
        title: 'Market Suspended',
        text: 'This market is currently suspended. Betting is not allowed.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const rowId = market.SelectionId || market.id;
    if (placebet && selectedRow === rowId) {
      closeBetSlip();
      return;
    }

    setSelectedOdds({
      value: oddsValue,
      type: type,
      clickedSide: clickedSide,
      market: market,
      eventName: market.RunnerName || market.title,
      marketName: market.RunnerName || market.title,
      oddType: type === 'back' ? 'Yes' : 'No',
      rowId: rowId,
    });

    setBetType(type);
    setPlacebet(true);
    setSelectedRow(rowId);
    setError("");
    setSuccessMessage("");
    setStake("");
  }

  const handleBookmakerOddsClick = (market, type, value, runner) => {
    if (placebet && selectedRow === `${market.marketId}_${runner.selectionId}`) {
      closeBetSlip();
      return;
    }

    setSelectedOdds({
      eventName: runner.runnerName,
      oddType: market.marketName,
      type,
      value,
      rowId: `${market.marketId}_${runner.selectionId}`,
      market: { ...market, ...runner }
    });
    setBetType(type);
    setPlacebet(true);
    setSelectedRow(`${market.marketId}_${runner.selectionId}`);
    setError("");
    setSuccessMessage("");
    setStake("");
  }

  const closeBetSlip = () => {
    setPlacebet(false);
    setSelectedOdds(null);
    setBetType('');
    setStake("");
    setSelectedRow(null);
    setError("");
    setSuccessMessage("");
  }

  const increaseStake = () => {
    const currentStake = parseInt(stake) || 0;
    setStake((currentStake + 10).toString());
  };

  const decreaseStake = () => {
    const currentStake = parseInt(stake) || 0;
    const newStake = currentStake > 0 ? currentStake - 10 : 0;
    setStake(newStake > 0 ? newStake.toString() : "");
  };

  const handleQuickStake = (amount) => {
    setStake(amount.toString());
  }

  const handleStakeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setStake(value);
  };

  useEffect(() => {
    if (stakeInputRef.current) {
      stakeInputRef.current.focus();
    }
  }, [stake]);

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  const fancybetshow = (tabsvalue) => {
    setFancybet(tabsvalue);
  }

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  // Get fancy list
  const getfancylist = useCallback(async () => {
    const event_id = localStorage.getItem("event_id") ;

    try {
      // setFancyLoading(true);
      const response = await axios.get(`https://cricketfancylive.shyammatka.co.in/get-fancy-list?id=${event_id}`);
      // const response = await axios.get(`https://apileo.leobook.in/get-fancy-list?id=34924384`);
      console.log("Fancy list response:", response.data);

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
        setfancylist(data);
      } else if (data && Array.isArray(data.data)) {
        setfancylist(data.data);
      } else if (data && typeof data === 'object') {
        const dataArray = Object.values(data).filter(item =>
          item && typeof item === 'object' && item.SelectionId
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
      // setFancyLoading(false);
    }
  }, []);

  // Get bookmaker list and separate by market type
  const getBookmakerList = useCallback(async () => {
    const event_id = localStorage.getItem("event_id") || "34931511";
    try {
      // setLoading(true);
      const response = await axios.get(
        `https://cricketfancylive.shyammatka.co.in/get-book-maker-list?id=${event_id}`
      );

      console.log("Bookmaker API Response:", response.data);

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
        const bookmakerMarkets = data.filter(market =>
          market.marketName && (
            market.marketName.toLowerCase().includes('bookmaker') ||
            market.marketName.toLowerCase().includes('over')
          )
        );
        const tiedMarkets = data.filter(market =>
          market.marketName && market.marketName.toLowerCase().includes('tied')
        );

        setBookmakerList(bookmakerMarkets);
        setTiedList(tiedMarkets);

        console.log("Bookmaker Markets:", bookmakerMarkets);
        console.log("Tied Markets:", tiedMarkets);
      } else {
        console.warn("Bookmaker response is not an array:", data);
        setBookmakerList([]);
        setTiedList([]);
      }
    } catch (error) {
      console.error("Error fetching bookmaker list:", error);
      setBookmakerList([]);
      setTiedList([]);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = () => {
      matchlist();
      getfancylist();
      getBookmakerList();
    };
    fetchAllData();
    const interval = setInterval(fetchAllData, 3000);
    return () => clearInterval(interval);
  }, [matchlist, getfancylist, getBookmakerList]);


    


  // Common Bet Slip Component
  const BetSlip = () => (
    <div className="fancy-quick-tr placebet">
      <div className="slip-back">
        <div className="container">
          <div className="d-flex justify-content-between">
            <div className="datanameandinput text-start">
              <p className="mb-0 eventnameall">{selectedOdds?.eventName}</p>
              <p className="mb-0 betname_desig">{selectedOdds?.oddType && `${selectedOdds.oddType} - `}{selectedOdds?.type?.toUpperCase()} @ {selectedOdds?.value}</p>
            </div>
            <div className="datanameandinput d-flex align-items-center stacksCol">
              <button className="stakeactionminus btn betButtonMinus" onClick={decreaseStake}>-</button>

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
              <button className="stakeactionplus btn betButtonPlus float-end" onClick={increaseStake}>+</button>
            </div>
          </div>

          <div className="row ps-2 pe-2 pb-0 padddingZero">
            <div className="col p-1 pb-0 hideMobile">
              <button className="btn btn-block btn-cancel" onClick={closeBetSlip}>Cancel  </button>
            </div>



            <div className="col p-1 pb-0 hideMobile">
              <button
                className="btn btn-send"
                onClick={handlePlaceBet}
                disabled={!stake || parseInt(stake) === 0 || isPlacingBet}
              >
                {isPlacingBet ? "Placing..." : "Place Bet"}
              </button>
            </div>
          </div>

          <div className="d-flex stackbutton pt-0 pb-0 slip-back-br">
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

          <div className="mt-0 p-2 pb-0 pt-0 stackbutton padddingZero hideDesktop">
            <div className="datanameandinput">
              <button className="btn btn-block btn-cancel" onClick={closeBetSlip}>Cancel 100</button>
            </div>
            <div className="datanameandinput">
              <button
                className="btn btn-send"
                onClick={handlePlaceBet}
                disabled={!stake || parseInt(stake) === 0 || isPlacingBet}
              >
                {isPlacingBet ? "Placing..." : "Place Bet"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Fancy Bet Slip Component
  const FancyBetSlip = () => (
    <div className="fancy-quick-tr placebet">
      <div className="slip-back">
        <div className="container">
          <div className="row">
            <div className="col-4">
              <p className="mb-1"><strong>{selectedOdds?.eventName}</strong></p>
              <p className="mb-1">
                {selectedOdds?.oddType} - {selectedOdds?.type?.toUpperCase()} @ {selectedOdds?.value}
              </p>
            </div>
            <div className="col text-right d-flex align-items-center p-1 stacksCol">
              <div className="odds-display text-center w-100">
                <small>Odds</small>
                <div className="odds-value">{selectedOdds?.value}</div>
              </div>
            </div>

            <div className="col text-right d-flex align-items-center p-1 stacksCol">
              <button className="stakeactionminus btn betButtonMinus" onClick={decreaseStake}>-</button>
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
              <button className="stakeactionplus btn betButtonPlus float-end" onClick={increaseStake}>+</button>
            </div>

          </div>

          <div className="row ps-2 pe-2 pb-0 padddingZero">
            <div className="col p-1 pb-0 hideMobile">
              <button className="btn btn-block btn-cancel" onClick={closeBetSlip}>Cancel </button>
            </div>


            <div className="col p-1 pb-0 hideMobile">
              <button
                className="btn btn-send"
                onClick={handlePlaceBet}
                disabled={!stake || parseInt(stake) === 0 || isPlacingBet}
              >
                {isPlacingBet ? "Placing..." : "Place Bet"}
              </button>
            </div>
          </div>

          <div className="row p-2 stackbutton pt-0 pb-0 slip-back-br">
            {fancyQuickStakes.map((amount) => (
              <div key={amount} className="col p-1">
                <button
                  className="btn btn-block fancy-quick-btn"
                  onClick={() => handleQuickStake(amount)}
                >
                  {formatNumber(amount)}
                </button>
              </div>
            ))}
          </div>

          <div className="row mt-0 p-2 pb-0 pt-0 stackbutton padddingZero hideDesktop">
            <div className="col-6 p-1 pb-0">
              <button className="btn btn-block btn-cancel" onClick={closeBetSlip}>Cancel </button>
            </div>
            <div className="col-6 p-1 pb-0">
              <button
                className="btn btn-send"
                onClick={handlePlaceBet}
                disabled={!stake || parseInt(stake) === 0 || isPlacingBet}
              >
                {isPlacingBet ? "Placing..." : "Place Bet"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // My Bets Component
  const MyBetsComponent = () => (
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
  );

  // Bookmaker Table Component
  const BookmakerTable = ({ markets, title }) => (
    <div className={`${title.toLowerCase().replace(' ', '-')} mt-2`}>
      <div className="card-matchodds outer-divs">
        <strong className="match-odds outer-div1">
          {title}
          <span onClick={() => setOpen(true)} className="marketinfo ml-2">
            <IoMdInformationCircleOutline />
          </span>
        </strong>

        <div className="cashout-container outer-div2">
          {/* Cashout functionality can be added here */}
        </div>

        <span className="matched-count pull-right outer-div4">
          {/* Matched <strong>€ 89.3K</strong> */}
        </span>
      </div>

      {loading ? (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading {title}...</span>
          </div>
          <p className="mt-2">Loading {title}...</p>
        </div>
      ) : (
        <table className='table text-start mb-0'>
          <thead>
            <tr>
              <th>
                 <div id="minMaxBox" className="d-table-inline justify-content-center d-md-none fancy-info matchoddsminmax">
                    <p>
                      Min/Max <span id="minMaxInfo">1-0</span>
                    </p>
                  </div> 
              </th>

              <th colSpan={2}>
                <div className="d-flex justify-content-center">
                  <div className="back gradientcolorback">Back</div>
                  <div className="lay gradientcolorlay">Lay</div>
                </div>
              </th>
              <th colSpan={2} className='position-relative  d-none d-md-table-cell'>
                <dl className="fancy-info matchoddsminmax bookmakerminmax">
                  <dt>Min/Max</dt>
                </dl>
              </th>
            </tr>
          </thead>

          <tbody className='position-relative'>
            {Array.isArray(markets) && markets.length > 0 ? (
              markets.map((market) => (
                market.runners.map((runner) => (
                  <tr key={`${market.marketId}_${runner.selectionId}`} className="game_status_new">
                    <td className="team-name team-width bookmakerNameRunner">
                      <div className="eventname_design">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="match-name">{runner.runnerName}</span>
                          {/* <span className="d-md-none d-block match-name position-relative">
                            <FaInfoCircle
                              size={15}
                              color="#0dcaf0"
                              style={{ cursor: "pointer" }}
                              onClick={() => toggleInfo(market.SelectionId)}
                            />
                            {openInfoId === market.SelectionId && (
                              <div className="text-center text-muted mt-1   justify-content-center basgefont z-2 position-absolute top-2 lef-0 bg-white">
                                <div className="d-flex justify-content-center"> Min/Max:</div>
                                 <span> {market.min || 100}/{market.max || 1000}</span>
                              </div>
                            )}
                          </span> */}
                        </div>
                      </div>
                    </td>

                    <td colSpan={2}>
                      <div className="d-flex position-relative">
                        <dl className="back-gradient">
                          <dd className="count boxhide">
                            <span
                              className="back text-center text-decoration-none"
                              onClick={() => handleBookmakerOddsClick(market, "back", runner.ex.availableToBack[0]?.price || 0, runner)}
                              style={{ cursor: runner.status === "SUSPENDED" ? 'not-allowed' : 'pointer' }}
                            >
                              {/* <span className="match-inn-txt-top d-block">{runner.ex.availableToBack[0]?.price || 0}</span> */}
                              {/* <span className="amount">{runner.ex.availableToBack[0]?.size || 0}</span> */}
                            </span>
                          </dd>
                          <dd className="count boxhide">
                            <span
                              className="back text-center text-decoration-none"
                              onClick={() => handleBookmakerOddsClick(market, "back", runner.ex.availableToBack[1]?.price || 0, runner)}
                              style={{ cursor: runner.status === "SUSPENDED" ? 'not-allowed' : 'pointer' }}
                            >
                              {/* <span className="match-inn-txt-top d-block">{runner.ex.availableToBack[1]?.price || 0}</span>
                              <span className="amount">{runner.ex.availableToBack[1]?.size || 0}</span> */}
                            </span>
                          </dd>
                          <dd className="count">
                            <span
                              className="back text-center text-decoration-none"
                              onClick={() => handleBookmakerOddsClick(market, "back", runner.ex.availableToBack[2]?.price || 0, runner)}
                              style={{ cursor: runner.status === "SUSPENDED" ? 'not-allowed' : 'pointer' }}
                            >
                              <span className="match-inn-txt-top d-block">{runner.ex.availableToBack[2]?.price || 0}</span>
                              <span className="amount">{runner.ex.availableToBack[2]?.size || 0}</span>
                            </span>
                          </dd>
                        </dl>

                        <dl className="lay-gradient">
                          <dd className="count">
                            <span
                              className="lay text-center text-decoration-none"
                              onClick={() => handleBookmakerOddsClick(market, "lay", runner.ex.availableToLay[0]?.price || 0, runner)}
                              style={{ cursor: runner.status === "SUSPENDED" ? 'not-allowed' : 'pointer' }}
                            >
                              <span className="match-inn-txt-top d-block">{runner.ex.availableToLay[0]?.price || 0}</span>
                              <span className="amount">{runner.ex.availableToLay[0]?.size || 0}</span>
                            </span>
                          </dd>
                          <dd className="count boxhide">
                            <span
                              className="lay text-center text-decoration-none"
                              onClick={() => handleBookmakerOddsClick(market, "lay", runner.ex.availableToLay[1]?.price || 0, runner)}
                              style={{ cursor: runner.status === "SUSPENDED" ? 'not-allowed' : 'pointer' }}
                            >
                              {/* <span className="match-inn-txt-top d-block">{runner.ex.availableToLay[1]?.price || 0}</span>
                              <span className="amount">{runner.ex.availableToLay[1]?.size || 0}</span> */}
                            </span>
                          </dd>
                          <dd className="count boxhide">
                            <span
                              className="lay text-center text-decoration-none"
                              onClick={() => handleBookmakerOddsClick(market, "lay", runner.ex.availableToLay[2]?.price || 0, runner)}
                              style={{ cursor: runner.status === "SUSPENDED" ? 'not-allowed' : 'pointer' }}
                            >
                              {/* <span className="match-inn-txt-top d-block">{runner.ex.availableToLay[2]?.price || 0}</span>
                              <span className="amount">{runner.ex.availableToLay[2]?.size || 0}</span> */}
                            </span>
                          </dd>
                        </dl>

                        {runner.status === "SUSPENDED" && (
                          <div className="suspend-bookmaker-externa suspended">
                            <span className="stats-text">Suspended</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td colSpan={2} className=" d-none d-md-table-cell text-center" >
                      <div className="min-max text-muted" style={{ fontSize: '12px' }}>
                        100 / 10000
                      </div>
                    </td>
                  </tr>
                ))
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  <p className="text-muted">No {title} available</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {placebet && selectedOdds && markets.some(market =>
        market.runners.some(runner => `${market.marketId}_${runner.selectionId}` === selectedRow)
      ) && (
          <div className="custom-td blue-bet-slip-back mt-2">
            <BetSlip />
          </div>
        )}
    </div>
  );

  return (
    <section className='cricket_design'>
      <div className="scroredesign d-md-flex d-none justify-content-between align-items-center">
        <div className="scorecard">
          scrore Card
        </div>
        <div onClick={togglescore} className="d-flex justify-content-between align-items-center togglebuttonscore gap-2">
          <MdOutlineScoreboard />
          <span>Scrore Card</span>
        </div>
      </div>
      <div className="d-md-block d-none">
        {scorecard && (
          <>
            <iframe width="100%" src="https://demo.livestream11.com/user/826879750/Android/103.59.75.127/6fe6abb1-df21-4446-af41-3de426ba11d7" frameborder="0"></iframe>
          </>
        )}
      </div>
      {/* Success Message Display */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
        </div>
      )}

      {/* My Bets Section */}
      <MyBetsComponent />
      <div class="d-block d-md-none history-header px-2 pb-0 mb-1 cricketpagemobile">
        <div className="d-flex  justify-content-between align-items-center watchtv_online p-2">
          <div className="bethistroydesign">
            <h3 className="title text-white">Bet Histroy</h3>
          </div>
          <div className="text-white d-flex align-items-center gap-2" onClick={() => setTvVisible(!tvVisible)}>
            <FaTv /><span>{tvVisible ? <span className="">TV</span> : <span className="">TV</span>} </span>
          </div>
          <div onClick={togglebetting} className="mybetdesign">My Bet</div>
          <div onClick={togglescore} className="d-flex justify-content-between align-items-center togglebuttonscore">
            <MdOutlineScoreboard />
            <span className="">Scrore Card</span>
          </div>
        </div>
        {tvVisible && (
          <div className="matchtv mt-2 position-relative">
            <div
              className="closetv position-absolute top-0 end-0 p-2"
              style={{ cursor: "pointer", zIndex: 5 }}
              onClick={() => setTvVisible(false)}
            >
              <IoIosCloseCircleOutline size={25} color="#ff4d4f" />
            </div>

            <div
              className="fullscreen-btn position-absolute top-0 start-0 p-2"
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
            ></iframe>
          </div>
        )}
        {scorecard && (
          <>
            <iframe width="100%" src="https://demo.livestream11.com/user/826879750/Android/103.59.75.127/6fe6abb1-df21-4446-af41-3de426ba11d7" frameborder="0"></iframe>
          </>
        )}
      </div>
      {bettingdesign && (
        <div className="betting betting_bet">
          <table className="table text-start table-sm table-bordered">
            <thead >
              <tr>
                <th className="text-start">Team</th>
                <th className="text-start">Odds</th>
                <th className="text-start">Total (₹)</th>
              </tr>
            </thead>
            <tbody >
              {currentBets.map((bet) => (
                <tr
                  key={bet._id}
                  className={`placebetdesignall  ${bet.bet_on === "back" ? "backsuccess" : "laydesign"
                    }`}
                >
                  <td className="text-start">{bet.team}</td>
                  <td className="text-start">{bet.odd}</td>
                  <td className="text-start">{bet.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Winner Section - Match Odds - FIXED DISPLAY */}
      <div className='winner_bet'>
        <div className="card-matchodds outer-divs">
          <strong className="match-odds outer-div1">
            match odds
            <span onClick={() => setOpen(true)} className="marketinfo ml-2">
              <IoMdInformationCircleOutline />
            </span>
          </strong>

          <div className="cashout-container outer-div2">
            {/* Cashout functionality can be added here */}
          </div>

          <span className="matched-count pull-right outer-div4">
            {/* Matched <strong>€ 89.3K</strong> */}
          </span>
        </div>

        {matchLoading ? (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading matches...</span>
            </div>
            <p className="mt-2">Loading matches...</p>
          </div>
        ) : (
          // <table className='table text-start mb-0'>
          //   {/* <thead>
          //     <tr>
          //       <th colSpan={2}></th>
          //       <th><div className="back backlay">Back</div></th>
          //       <th><div className="lay backlay">Lay<div className="min-max text-muted" style={{ fontSize: '12px' }}>
          //                 100 / 10000
          //               </div></div></th>

          //     </tr>
          //   </thead> */}
          //   <thead><tr><th colspan="3" class="boxhide"></th><th colspan="3" class="mobileshow p-1"><div id="minMaxBox" class=" fancy-info matchoddsminmax"><p>Min/Max    <span id="minMaxInfo">1-0</span></p></div></th><th><div class="back backlay">Back</div></th><th><div class="lay backlay">Lay</div></th><th colspan="2" class="boxhide"><div id="minMaxBox" class=" fancy-info matchoddsminmax"><p>Min/Max  <span id="minMaxInfo">1-0</span></p></div></th></tr></thead>
          //   <tbody className='position-relative'>
          //     {Array.isArray(Matches) && Matches.length > 0 ? (
          //       Matches.map((market) => (
          //         <React.Fragment key={market.id}>
          //           <tr className='game_status_new'>
          //             <td className="td-event-name" colSpan={4}>
          //               <div className='eventname_design'>
          //                 <span className="match-name">{market.team_name}</span>
          //                 <span className="in_play">{market.status}</span>
          //               </div>
          //             </td>

          //             {/* Back Odds - Show all available back odds */}
          //             <td className="count">
          //               <div className="d-flex">
          //                 {market.availableToBack.slice(0, 3).map((back, index) => (
          //                   <span
          //                     key={index}
          //                     className={`back bettinggrid me-1 back-${index} me-1 ${index === 0 ? 'boxhide' : index === 1 ? 'boxhide' : ''
          //                       }`}
          //                     onClick={() => handleOddsClick(back.price, 'back', market, market.team_name, market.id)}
          //                     style={{ cursor: 'pointer' }}
          //                   >
          //                     <span className='backvalue'>{back.price}</span>
          //                     <small>{formatNumber(back.size)}</small>
          //                   </span>
          //                 ))}
          //               </div>
          //             </td>

          //             {/* Lay Odds - Show all available lay odds */}
          //             <td className="count">
          //               <div className="d-flex">
          //                 {market.availableToLay.slice(0, 3).map((lay, index) => (
          //                   <span
          //                     key={index}
          //                     className={`lay bettinggrid  me-1 lay-${index} me-1 ${index === 1 ? 'boxhide' : index === 2 ? 'boxhide' : ''
          //                       }`}
          //                     onClick={() => handleOddsClick(lay.price, 'lay', market, market.team_name, market.id)}
          //                     style={{ cursor: 'pointer' }}
          //                   >
          //                     <span className='backvalue'>{lay.price}</span>
          //                     <small>{formatNumber(lay.size)}</small>
          //                   </span>
          //                 ))}
          //               </div>
          //             </td>


          //           </tr>

          //           {/* Bet slip for match odds */}
          //           {placebet && selectedOdds && selectedRow === market.id && (
          //             <tr>
          //               <td colSpan="6" className="custom-td blue-bet-slip-back">
          //                 <BetSlip />
          //               </td>
          //             </tr>
          //           )}
          //         </React.Fragment>
          //       ))
          //     ) : (
          //       <tr>
          //         <td colSpan="6" className="text-center">
          //           <p className="text-muted">No matches available</p>
          //         </td>
          //       </tr>
          //     )}
          //   </tbody>
          // </table>
          <table className="table text-start mb-0">
            <thead>
              <tr>

                <th colspan="4" class="">
                  <div id="minMaxBox" className="d-table-inline d-md-none justify-content-center fancy-info matchoddsminmax">
                    <p>
                      Min/Max <span id="minMaxInfo">1-0</span>
                    </p>
                  </div>
                </th>

                {/* Back header */}
                <th colspan="3">
                  <div className="back backlay ml-auto">Back</div>
                </th>

                {/* Lay header */}
                <th colSpan="3">
                  <div className="lay_cusutm mr-auto">
                    <div className="lay backlay">Lay</div>
                    <div id="minMaxBox" className="fancy-info matchoddsminmax d-none d-md-block">
                      <p>
                        Min/Max <span id="minMaxInfo">1-0</span>
                      </p>
                    </div>
                  </div>
                </th>

                {/* Desktop Min/Max */}

              </tr>
            </thead>

            <tbody className="position-relative">
              {Array.isArray(Matches) && Matches.length > 0 ? (
                Matches.map((market) => (
                  <React.Fragment key={market.id}>
                    <tr className="game_status_new">
                      {/* Team Name and Status */}
                      <td class="td-event-name" colspan="4">
                        <div className="eventname_design">
                          <span className="match-name">{market.team_name}</span>
                          {/* <span className="in_play">{market.status}</span> */}
                        </div>
                      </td>

                      {/* Back Odds */}
                      <td colspan="3" class="count">
                        <div className="d-flex justify-content-start">
                          {market.availableToBack.slice(0, 3).map((back, index) => (
                            <span
                              key={index}
                              className={`back bettinggrid back-${index} ${index === 0 ? 'boxhide' : index === 1 ? 'boxhide' : ''
                                }`}
                              onClick={() =>
                                handleOddsClick(back.price, 'back', market, market.team_name, market.id)
                              }
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="backvalue">{back.price}</span>
                              <small>{formatNumber(back.size)}</small>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Lay Odds */}
                      <td colspan="3" class="count">
                        <div className="d-flex justify-content-start">
                          {market.availableToLay.slice(0, 3).map((lay, index) => (
                            <span
                              key={index}
                              className={`lay bettinggrid  lay-${index} ${index === 1 ? 'boxhide' : index === 2 ? 'boxhide' : ''
                                }`}
                              onClick={() =>
                                handleOddsClick(lay.price, 'lay', market, market.team_name, market.id)
                              }
                              style={{ cursor: 'pointer' }}
                            >
                              <span className="backvalue">{lay.price}</span>
                              <small>{formatNumber(lay.size)}</small>
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>

                    {/* Bet Slip Row */}
                    {placebet && selectedOdds && selectedRow === market.id && (
                      <tr>
                        <td colSpan="12" className="custom-td blue-bet-slip-back">
                          <BetSlip />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center">
                    <p className="text-muted">No matches available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        )}
      </div>

      {/* Bookmaker Section */}
      <BookmakerTable markets={bookmakerList} title="Bookmaker" />

      {/* Tied Match Section */}
      {/* <BookmakerTable markets={tiedList} title="Tied Match" /> */}

      {/* Fancy Bets & Sportsbook Section */}
      <div className="fancybetsportsbook mt-2">
        <div className="tabsfancy">
          <button
            className={`buttontabefancy fancybetbutton ${fancybet === "fancybetall" ? 'active' : ''}`}
            onClick={() => fancybetshow("fancybetall")}
          >
            Fancybet
            <span onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
              <IoMdInformationCircleOutline />
            </span>
          </button>
          <button
            className={`buttontabefancy sportsbookbutton ${fancybet === "sportsbookall" ? 'active' : ''}`}
            onClick={() => fancybetshow("sportsbookall")}
          >
            Sportsbook
            <span onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
              <IoMdInformationCircleOutline />
            </span>
          </button>
        </div>

        <div className="tabsfancycontent">
          {fancybet === 'fancybetall' && (
            <div className="fancybetcontent">
              <div className="headinggame">
                <ul className="special_bets-tab">
                  {tabsinner.map((tab) => (
                    <li
                      key={tab}
                      className={selectedTab === tab ? "select" : ""}
                      onClick={() => handleTabClick(tab)}
                    >
                      <span>{tab}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="tab-content-fancy">
                  {selectedTab === "ALL" && (
                    <>
                      {fancyLoading ? (
                        <div className="text-center p-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading fancy bets...</span>
                          </div>
                          <p className="mt-2">Loading fancy bets...</p>
                        </div>
                      ) : (
                        <table className="table text-start mb-0">
                          <thead>
                            <tr>
                              {/* Min/Max (visible only on mobile) */}


                              {/* Empty spacing on desktop */}
                              <th colSpan={1} className=""></th>
                              <th className=""></th>

                              {/* Yes / No headers */}
                              <th>
                                <div className="d-flex">
                                  <div className="lay backlay lay_game w-100">No</div>
                                  <div className="back backlay lay_game w-100">Yes</div>
                                </div>
                              </th>

                              <th className="d-none d-md-table-cell d-flex d-md-table-cell">
                                Min/Max
                              </th>

                            </tr>
                          </thead>
                          <tbody className="position-relative">
                            {Array.isArray(fancylist) && fancylist.length > 0 ? (
                              fancylist.map((market) => (
                                <React.Fragment key={market.SelectionId}>
                                  <tr className="game_status_new">
                                    <td className="td-event-name" >
                                      <div className="d-flex justify-content-between align-items-center flex-wrap-mobile">
                                        <div className="eventname_design">
                                          <span className="match-name"  >{market.RunnerName}</span>
                                        </div>

                                      
                                      </div>
                                    </td>
                                    <td>
                                        <span className="d-md-block d-none match-name">Book</span>
                                        <span className="d-md-none d-block match-name position-relative">
                                          <FaInfoCircle
                                            size={15}
                                            color="#0dcaf0"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => toggleInfo(market.SelectionId)}
                                          />
                                          {openInfoId === market.SelectionId && (
                                            <div className="text-center text-muted mt-1  basgefont z-2 position-absolute top-2 lef-0 bg-white">
                                              <div>
                                                Min/Max:</div> {market.min || 100}/{market.max || 1000}
                                            </div>
                                          )}
                                        </span></td>


                                    <td className="count">
                                      <div className="d-flex position-relative">
                                        {market.GameStatus === "SUSPENDED" && (
                                          <div className="suspended-overlay-fancy">
                                            <span className="suspended-text-fancy">SUSPENDED</span>
                                          </div>
                                        )}
                                        <span
                                          className={`lay bettinggrid lay-0 ${market.GameStatus === "SUSPENDED" ? 'suspended-odds' : ''}`}
                                          onClick={() => handleFancyOddsClick(market.LayPrice1, "lay", market, "no")}
                                          style={{ cursor: market.GameStatus === "SUSPENDED" ? 'not-allowed' : 'pointer' }}
                                        >
                                          <span className="backvalue">{market.LayPrice1}</span>
                                          <small>{market.LaySize1}</small>
                                        </span>
                                        <span
                                          className={`back bettinggrid back-2 ${market.GameStatus === "SUSPENDED" ? 'suspended-odds' : ''}`}
                                          onClick={() => handleFancyOddsClick(market.BackPrice1, "back", market, "yes")}
                                          style={{ cursor: market.GameStatus === "SUSPENDED" ? 'not-allowed' : 'pointer' }}
                                        >
                                          <span className="backvalue">{market.BackPrice1}</span>
                                          <small>{market.BackSize1}</small>
                                        </span>
                                      </div>
                                    </td>
                                    <td className="verticalmiddle d-none d-md-table-cell d-flex d-md-table-cell">
                                      <div className="small text-muted mt-1 text-center">
                                        {market.min || 100}/{market.max || 1000}
                                      </div>
                                    </td>

                                  </tr>

                                  {/* Bet slip for fancy bets */}
                                  {placebet && selectedOdds && selectedRow === (market.SelectionId || market.id) && (
                                    <tr>
                                      <td colSpan="5" className="custom-td blue-bet-slip-back">
                                        <FancyBetSlip />
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  <p className="text-muted">No fancy bets available</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}
                    </>
                  )}

                  {/* Other Tabs Content */}
                  {selectedTab === "Fancy" && (
                    <div className="text-center p-4">
                      <p className="text-muted">Fancy bets content will be displayed here</p>
                    </div>
                  )}
                  {selectedTab === "Line Markets" && (
                    <div className="text-center p-4">
                      <p className="text-muted">Line Markets content will be displayed here</p>
                    </div>
                  )}
                  {selectedTab === "Ball by Ball" && (
                    <div className="text-center p-4">
                      <p className="text-muted">Ball by Ball content will be displayed here</p>
                    </div>
                  )}
                  {selectedTab === "Meter Markets" && (
                    <div className="text-center p-4">
                      <p className="text-muted">Meter Markets content will be displayed here</p>
                    </div>
                  )}
                  {selectedTab === "Khado Markets" && (
                    <div className="text-center p-4">
                      <p className="text-muted">Khado Markets content will be displayed here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {fancybet === 'sportsbookall' && (
            <div className="sportsbookcontent text-center p-4">
              <p className="text-muted">Sportsbook content will be displayed here</p>
            </div>
          )}
        </div>
      </div>

      {/* Information Modal */}
    </section>
  );
}

export default Tennis;