import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMarketAnalysis } from "../../Server/api";
import Loader from "../../Common/Loader";
import axios from "axios";

const Multimarket = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);
  const [oddsDataMap, setOddsDataMap] = useState({});
  const [fancyOddsMap, setFancyOddsMap] = useState({});

  const fetchMarketAnalysis = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await getMarketAnalysis({
        page,
        limit,
      });

      const response = res.data;
      if (response.success) {
        const eventData = response.data || [];
        setEvents(eventData);
        setTotalPages(response.pagination?.total_pages || 1);
        setCurrentPage(response.pagination?.current_page || 1);
        setTotalRecords(response.pagination?.total_records || 0);

        const marketIds = eventData
          .filter(event => event.market_id || event.marketId)
          .map(event => event.market_id || event.marketId)
          .join(",");

        if (marketIds) {
          fetchOddsData(marketIds);
        }

        // Fetch fancy odds for each event
        eventData.forEach((event) => {
          const eventId = event.event_id || event.id;
          const sportId = event.sport_id || event.sportId || 4;
          const marketId = event.market_id || event.marketId;
          if (eventId) {
            fetchFancyOddsData(eventId, sportId, marketId);
          }
        });
      } else {
        toast.error(response.message || "Failed to fetch market data");
      }
    } catch (error) {
      console.error("Error fetching market analysis:", error);
      toast.error("Failed to fetch market analysis data");
    } finally {
      setLoading(false);
    }
  };

  const fetchOddsData = async (marketIds) => {
    try {
      const sportId = events[0]?.sport_id || events[0]?.sportId || 4;
      const oddsUrl = `https://cricketfancylive.shyammatka.co.in/get-match-odds-list?id=${marketIds}&sport_id=${sportId}`;

      const response = await axios.get(oddsUrl);

      if (response.data && Array.isArray(response.data)) {
        const oddsMap = {};
        response.data.forEach((market) => {
          if (market.marketId && market.runners) {
            const runners = market.runners.map((runner) => ({
              name: runner.runnerName || runner.name || "",
              back: runner.ex?.availableToBack?.[0]?.price || null,
              lay: runner.ex?.availableToLay?.[0]?.price || null,
              backSize: runner.ex?.availableToBack?.[0]?.size || null,
              laySize: runner.ex?.availableToLay?.[0]?.size || null,
            }));
            oddsMap[market.marketId] = runners;
          }
        });
        setOddsDataMap(oddsMap);
      }
    } catch (error) {
      console.error("Error fetching odds data:", error);
    }
  };

  // Fetch fancy odds data
  const fetchFancyOddsData = async (eventId, sportId, marketId) => {
    try {
      const fancyUrl = `https://cricketfancylive.shyammatka.co.in/get-fancy-list-guruji?id=${eventId}&sport_id=${sportId}`;
      console.log("Fetching fancy odds from:", fancyUrl);

      const response = await axios.get(fancyUrl);

      if (response.data && Array.isArray(response.data)) {
        const fancyData = response.data.map((item) => ({
          runnerName: item.RunnerName || "",
          backPrice: item.BackPrice1 || null,
          backSize: item.BackSize1 || null,
          layPrice: item.LayPrice1 || null,
          laySize: item.LaySize1 || null,
          gtype: item.gtype || "",
          min: item.min || "",
          max: item.max || "",
        }));
        
        setFancyOddsMap(prev => ({
          ...prev,
          [marketId]: fancyData
        }));
      }
    } catch (error) {
      console.error("Error fetching fancy odds data:", error);
    }
  };

  useEffect(() => {
    fetchMarketAnalysis(currentPage);
  }, [currentPage]);

  // Polling every 10 seconds
  useEffect(() => {
    if (events.length === 0) return;

    const marketIds = events
      .filter(event => event.market_id || event.marketId)
      .map(event => event.market_id || event.marketId)
      .join(",");

    if (!marketIds) return;

    // const intervalId = setInterval(() => {
      fetchOddsData(marketIds);
      // Refresh fancy odds too
      events.forEach((event) => {
        const eventId = event.event_id || event.id;
        const sportId = event.sport_id || event.sportId || 4;
        const marketId = event.market_id || event.marketId;
        if (eventId) {
          fetchFancyOddsData(eventId, sportId, marketId);
        }
      });
    // }, 10000);

    // return () => clearInterval(intervalId);
  }, [events]);

  const handleEventHeadingClick = (event) => {
    const eventId = event.event_id || event.id;
    const marketId = event.market_id || event.marketId;
    const sportId = event.sport_id || event.sportId;

    if (!eventId || !marketId || !sportId) {
      toast.error("Unable to navigate: Missing required parameters");
      return;
    }

    navigate(
      `/viewmatch-fancy/series_idd/${marketId}/event_id/${eventId}/sport_id/${sportId}`,
    );
  };

  // B Button click handler
  const handleBButtonClick = (event, e) => {
    e.stopPropagation();
    const marketId = event.market_id || event.marketId;
    const eventName = event.event_name || event.name || "Unknown Event";

    if (!marketId) {
      toast.error("Market ID not found");
      return;
    }

    navigate(`/reports/multimarket-bet-history/${event.event_id}`, {
      state: {
        eventName: eventName,
        eventId: event.event_id || event.id,
        sportId: event.sport_id || event.sportId
      }
    });
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  // Helper: format size (e.g. 1500000 → 1500K)
  const formatSize = (size) => {
    if (size === null || size === undefined || size === "") return null;
    const num = Number(size);
    if (isNaN(num)) return size;
    if (num >= 1000000) return (num / 1000).toFixed(0) + "K";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num;
  };

  // Reusable Odds Cell (BACK / LAY / SUSPENDED)
  const OddsCell = ({ back, lay, backSize, laySize }) => {
    const hasBack = back !== null && back !== undefined && back !== "";
    const hasLay = lay !== null && lay !== undefined && lay !== "";
    const isSuspended = !hasBack && !hasLay;

    if (isSuspended) {
      return (
        <div className="odds-cells suspended-row">
          <div className="suspended-box">
            <span className="suspended-text">SUSPENDED</span>
          </div>
        </div>
      );
    }

    return (
      <div className="odds-cells">
        <div className="back-cell">
          <span className="price">{hasBack ? back : "-"}</span>
          {hasBack && backSize && (
            <span className="size">{formatSize(backSize)}</span>
          )}
        </div>
        <div className="lay-cell">
          <span className="price">{hasLay ? lay : "-"}</span>
          {hasLay && laySize && (
            <span className="size">{formatSize(laySize)}</span>
          )}
        </div>
      </div>
    );
  };

  // MATCH ODDS Layout
  const renderMatchOddsLayout = (matchOdds, marketId, eventName) => {
    if (!matchOdds || matchOdds.length === 0) return null;

    const oddsData = oddsDataMap[marketId] || [];

    const teamsWithOdds = matchOdds.map((item) => {
      const teamName = item.team_name || item.name || "";
      const amount = item.display_amount || item.amount || 0;

      const runner = oddsData.find(o =>
        o.name?.toLowerCase().includes(teamName.toLowerCase()) ||
        teamName.toLowerCase().includes(o.name?.toLowerCase() || "")
      );

      return {
        name: teamName,
        amount: amount,
        back: runner?.back || null,
        lay: runner?.lay || null,
        backSize: runner?.backSize || null,
        laySize: runner?.laySize || null,
        isDraw: teamName.toLowerCase().includes("draw"),
      };
    });

    const mainTeams = teamsWithOdds.filter(t => !t.isDraw);
    const drawTeam = teamsWithOdds.find(t => t.isDraw);

    return (
      <div className="match-odds-container">
        <div className="match-odds-header">
          <span className="odds-title">MATCH ODDS</span>
          <div className="odds-header-labels">
            <span className="back-label">BACK</span>
            <span className="lay-label">LAY</span>
          </div>
        </div>

        {mainTeams.map((team, index) => (
          <div key={index} className="team-odds-row">
            <div className="team-info">
              <span className="team-name">{team.name}</span>
              <span className={`team-amount ${Number(team.amount) < 0 ? 'negative' : 'positive'}`}>
                {team.amount}
              </span>
            </div>
            <OddsCell
              back={team.back}
              lay={team.lay}
              backSize={team.backSize}
              laySize={team.laySize}
            />
          </div>
        ))}

        {drawTeam && (
          <div className="team-odds-row draw-row">
            <div className="team-info">
              <span className="team-name">{drawTeam.name}</span>
              <span className={`team-amount ${Number(drawTeam.amount) < 0 ? 'negative' : 'positive'}`}>
                {drawTeam.amount}
              </span>
            </div>
            <OddsCell
              back={drawTeam.back}
              lay={drawTeam.lay}
              backSize={drawTeam.backSize}
              laySize={drawTeam.laySize}
            />
          </div>
        )}
      </div>
    );
  };

  // BOOKMAKER Layout
  const renderBookmakerLayout = (bookmaker, marketId) => {
    if (!bookmaker || bookmaker.length === 0) return null;

    const oddsData = oddsDataMap[marketId] || [];

    const teamsWithOdds = bookmaker.map((item) => {
      const teamName = item.team_name || item.name || "";
      const amount = item.display_amount || item.amount || 0;

      const runner = oddsData.find(o =>
        o.name?.toLowerCase().includes(teamName.toLowerCase()) ||
        teamName.toLowerCase().includes(o.name?.toLowerCase() || "")
      );

      return {
        name: teamName,
        amount: amount,
        back: runner?.back || null,
        lay: runner?.lay || null,
        backSize: runner?.backSize || null,
        laySize: runner?.laySize || null,
      };
    });

    return (
      <div className="bookmaker-container">
        <div className="bookmaker-header">
          <span className="odds-title">BOOK MAKER</span>
          <div className="odds-header-labels">
            <span className="back-label">BACK</span>
            <span className="lay-label">LAY</span>
          </div>
        </div>

        {teamsWithOdds.map((team, index) => (
          <div key={index} className="team-odds-row">
            <div className="team-info">
              <span className="team-name">{team.name}</span>
              <span className={`team-amount ${Number(team.amount) < 0 ? 'negative' : 'positive'}`}>
                {team.amount}
              </span>
            </div>
            <OddsCell
              back={team.back}
              lay={team.lay}
              backSize={team.backSize}
              laySize={team.laySize}
            />
          </div>
        ))}
      </div>
    );
  };

  // FANCY Layout
  const renderFancyLayout = (fancyItems, marketId) => {
    if (!fancyItems || fancyItems.length === 0) return null;

    const filteredItems = fancyItems.filter(item => item.fancy_name);
    if (filteredItems.length === 0) return null;

    const fancyOdds = fancyOddsMap[marketId] || [];

    return (
      <div className="fancy-container">
        <div className="fancy-header">
          <span className="odds-title">FANCY</span>
          <div className="odds-header-labels">
            <span className="back-label">Back</span>
            <span className="lay-label">Lay</span>
          </div>
        </div>
        {filteredItems.map((item, index) => {
          const amount = item.display_amount || item.amount || 0;
          const fancyName = item.fancy_name;

          const matchingOdds = fancyOdds.find(o =>
            o.runnerName?.toLowerCase().includes(fancyName.toLowerCase()) ||
            fancyName.toLowerCase().includes(o.runnerName?.toLowerCase() || "")
          );

          const backValue = matchingOdds?.backPrice ?? null;
          const layValue = matchingOdds?.layPrice ?? null;
          const backSize = matchingOdds?.backSize ?? null;
          const laySize = matchingOdds?.laySize ?? null;

          return (
            <div key={index} className="fancy-item-row">
              <div className="fancy-info">
                <span className="fancy-name">{fancyName}</span>
                <span className={`fancy-amount ${Number(amount) < 0 ? 'negative' : 'positive'}`}>
                  {amount}
                </span>
              </div>
              <OddsCell
                back={backValue}
                lay={layValue}
                backSize={backSize}
                laySize={laySize}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header bg-white d-flex justify-content-between align-items-md-center gap-2">
          <h5 className="card-title mb-0">Multi Market Analysis</h5>
          {totalRecords > 0 && (
            <span className="badge bg-secondary">Total: {totalRecords}</span>
          )}
        </div>

        <div className="card-body">
          <div className="market-analysis-container">
            {loading ? (
              <div className="table_loader text-center py-5">
                <Loader />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-5">
                <h5>No Data To Display</h5>
              </div>
            ) : (
              <>
                {events.map((event, groupIndex) => {
                  const marketId = event.market_id || event.marketId;

                  return (
                    <div key={groupIndex} className="event-group mb-4">
                      {/* Event Header - Clickable with B Button */}
                      <div className="event-group-header">
                        <div
                          className="event-title-wrapper clickable"
                          onClick={() => handleEventHeadingClick(event)}
                        >
                          <h4 className="event-title">
                            {event.event_name || event.name || "Unnamed"}
                          </h4>
                        </div>
                        {/* B Button */}
                        <button
                          className="betlist-btn"
                          onClick={(e) => handleBButtonClick(event, e)}
                          title="View Multimarket Bet History"
                        >
                          B
                        </button>
                      </div>

                      <div className="event-sections">
                        {/* BOOK MAKER */}
                        {event.bookmaker?.length > 0 &&
                          renderBookmakerLayout(event.bookmaker, marketId)
                        }

                        {/* FANCY */}
                        {event.fancy?.length > 0 &&
                          renderFancyLayout(event.fancy, marketId)
                        }

                        {/* MATCH ODDS */}
                        {event.match_odds?.length > 0 &&
                          renderMatchOddsLayout(event.match_odds, marketId, event.event_name)
                        }
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center my-3">
            <div className="paginationall d-flex align-items-center gap-1">
              <button disabled={currentPage === 1} onClick={handlePrev}>
                <MdKeyboardDoubleArrowLeft /> Previous
              </button>

              <div className="d-flex gap-1">
                {getPageNumbers().map((page) => (
                  <div
                    key={page}
                    className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </div>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={handleNext}
              >
                Next <MdKeyboardDoubleArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSS Styles */}
      <style jsx="true">{`
        .event-group {
          border: 1px solid #dee2e6;
          border-radius: 6px;
          overflow: hidden;
          background: #fff;
          margin-bottom: 16px;
        }

        .event-group-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #f8f9fa;
          border-bottom: 2px solid #dee2e6;
        }

        .event-title-wrapper {
          flex: 1;
          cursor: pointer;
        }

        .event-title-wrapper:hover {
          opacity: 0.8;
        }

        .event-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #000;
        }

        /* B Button Styles */
     

        /* Match Odds & Bookmaker & Fancy */
        .match-odds-container,
        .bookmaker-container,
        .fancy-container {
          border: 1px solid #dee2e6;
          border-radius: 4px;
          margin: 8px;
          overflow: hidden;
        }

        .match-odds-header,
        .bookmaker-header,
        .fancy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 12px;
          background-color: #fff3cd;
          border-bottom: 1px solid #dee2e6;
          font-weight: bold;
        }

        .odds-title {
          font-weight: 700;
          font-size: 13px;
          color: #000;
        }

        .odds-header-labels {
          display: flex;
          width: 140px;
          flex-shrink: 0;
        }

        .back-label,
        .lay-label {
          flex: 1;
          text-align: center;
          font-weight: 600;
          font-size: 12px;
        }

        .back-label {
          color: #28a745;
        }

        .lay-label {
          color: #dc3545;
        }

        .team-odds-row,
        .fancy-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 8px;
          border-bottom: 1px solid #f0f0f0;
          background: #fff;
          min-height: 48px;
        }

        .team-odds-row:last-child,
        .fancy-item-row:last-child {
          border-bottom: none;
        }

        .team-odds-row.draw-row {
          background: #f8f9fa;
        }

        .team-info,
        .fancy-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          flex: 1;
          min-width: 0;
          padding-right: 8px;
        }

        .team-name,
        .fancy-name {
          font-weight: 500;
          font-size: 13px;
          color: #000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .team-amount,
        .fancy-amount {
          font-weight: 600;
          font-size: 13px;
        }

        .team-amount.positive,
        .fancy-amount.positive {
          color: #28a745;
        }

        .team-amount.negative,
        .fancy-amount.negative {
          color: #dc3545;
        }

        /* ===== BACK / LAY CELLS (exact look from screenshot) ===== */
        .odds-cells {
          display: flex;
          width: 140px;
          flex-shrink: 0;
          height: 42px;
        }

        .back-cell,
        .lay-cell {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-weight: 700;
          line-height: 1.1;
        }

        .back-cell {
          background-color: #a7d8f0; /* light blue */
          border-right: 1px solid #fff;
        }

        .lay-cell {
          background-color: #f8b4c4; /* light pink */
        }

        .back-cell .price,
        .lay-cell .price {
          font-size: 15px;
          color: #000;
        }

        .back-cell .size,
        .lay-cell .size {
          font-size: 11px;
          color: #333;
          font-weight: 500;
        }

        /* ===== SUSPENDED ===== */
        .odds-cells.suspended-row {
          width: 140px;
        }

        .suspended-box {
          width: 100%;
          height: 42px;
          background-color: #0703002e; 
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .suspended-text {
          color: #c41e3a;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .clickable {
          cursor: pointer;
        }

        .clickable:hover {
          opacity: 0.8;
        }

        /* Pagination */
        .paginationall {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .paginationall button {
          padding: 6px 12px;
          border: 1px solid #dee2e6;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .paginationall button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .paginationnumber {
          padding: 6px 12px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          cursor: pointer;
          min-width: 36px;
          text-align: center;
        }

        .paginationnumber.active {
          background: #007bff;
          color: #fff;
          border-color: #007bff;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .odds-header-labels,
          .odds-cells,
          .odds-cells.suspended-row {
            width: 110px;
          }

          .match-odds-container,
          .bookmaker-container,
          .fancy-container {
            margin: 4px 2px;
          }

          .team-odds-row,
          .fancy-item-row {
            padding: 4px 6px;
            min-height: 44px;
          }

          .team-name,
          .fancy-name {
            font-size: 12px;
          }

          .team-amount,
          .fancy-amount {
            font-size: 12px;
          }

          .back-cell .price,
          .lay-cell .price {
            font-size: 13px;
          }

          .back-cell .size,
          .lay-cell .size {
            font-size: 10px;
          }

          .suspended-text {
            font-size: 11px;
          }

          .event-group-header {
            padding: 9px 9px;
          }

          .market-analysis-container .event-group-header .event-title {
            font-size: 13px;
          }

          .btn-b-event {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .odds-header-labels,
          .odds-cells,
          .odds-cells.suspended-row {
            width: 96px;
          }

          .back-cell .price,
          .lay-cell .price {
            font-size: 12px;
          }

          .suspended-text {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default Multimarket;