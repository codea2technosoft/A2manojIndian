// src/Components/PlaceBet/PlaceBet.jsx
import "../../assets/scss/PlaceBet.scss";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaTv, FaExpand, FaCompress, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";

const PlaceBet = ({ bgcolor }) => {
  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tvVisible, setTvVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const iframeRef = useRef(null);
  const [showBetHistory, setShowBetHistory] = useState(false);

  const betsPerPage = 5;
  const userId = localStorage.getItem("user_id");
  const event_id = "34920885";

  // const baseUrl =
  //   process.env.NODE_ENV === "development"
  //     ? process.env.REACT_APP_BACKEND_LOCAL_API
  //     : process.env.REACT_APP_BACKEND_LIVE_API;


    const baseUrl = process.env.REACT_APP_BACKEND_API;


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

  

  return (
    <>
      <div class="bet-slip d-none d-lg-block">
        <div class=" history-header px-2 pb-0">
          <div
            className="d-flex w-100 justify-content-between align-items-center watchtv_online"
            onClick={() => setTvVisible(!tvVisible)}
          >
            <h3 className="title text-white">Watch TV</h3>
            <div className="text-white w-100 text-end tvwatch">
              <FaTv /> <span>{tvVisible ? tvVisible : ""} </span>
            </div>
          </div>
        </div>
        {tvVisible && (
          <div className="matchtv position-relative mb-1">
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
        <div class=" history-header px-2 pb-0">
          <div
            className="d-flex w-100 justify-content-between align-items-center watchtv_online"
            onClick={() => setShowBetHistory((prev) => !prev)}
            style={{ cursor: "pointer" }}
          >
            <h3 className="title text-white">Bet History</h3>

            <div className="text-white text-end">
              {showBetHistory ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>
        </div>
        <div className="betting">
          {/* <ul className="history list-unstyled">
            {currentBets.map((bet) => (
              <li
                key={bet._id} className={`history-item mb-2 placebetdesignall rounded ${bet.bet_on === "back" ? "backsuccess" : "laydesign" }`}>
                <div className="d-flex justify-content-between">
                  <strong>{bet.team}</strong>
                  <span className="text-uppercase">{bet.bet_on}</span>
                </div>
                <div className="d-flex justify-content-between small text-muted">
                  <span>Odds: {bet.odd}</span>
                  <span>Total: ₹{bet.total}</span>
                  <span>Stake: ₹{bet.stake}</span>
                </div>
              </li>
            ))}
          </ul> */}

          {showBetHistory && (
            <div className="d-none d-md-block teambet">
              <table className="table table-sm table-bordered">
                <thead>
                  <tr className="fontsizenew">
                    <th>Team</th>
                    <th>Odds</th>
                    <th>Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="text-start">
                  {currentBets.map((bet) => (
                    <tr
                      key={bet._id}
                      className={`placebetdesignall ${
                        bet.bet_on === "back" ? "backsuccess" : "laydesign"
                      }`}
                    >
                      <td>{bet.team}</td>
                      <td>{bet.odd}</td>
                      <td>
                        {bet.total} {bet.bet_on}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="pagination d-flex justify-content-between align-items-center mt-3">
                  <button
                    className="page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    ◀ Prev
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlaceBet;
