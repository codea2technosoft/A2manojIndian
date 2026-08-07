import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";
import { getMarketAnalysis } from "../../Server/api";
import Loader from "../../Common/Loader";

const MarketAnalysisLists = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  const fetchMarketAnalysis = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await getMarketAnalysis({
        page,
        limit,
      });

      const response = res.data;
      if (response.success) {
        setEvents(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        setCurrentPage(response.pagination?.current_page || 1);
        setTotalRecords(response.pagination?.total_records || 0);
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

  useEffect(() => {
    fetchMarketAnalysis(currentPage);
  }, [currentPage]);

  const handleEventHeadingClick = (event) => {
    const eventId = event.event_id || event.id;
    const marketId = event.market_id || event.marketId;
    const sportId = event.sport_id || event.sportId;

    if (!eventId || !marketId || !sportId) {
      console.error("Missing navigation parameters:", {
        eventId,
        marketId,
        sportId,
      });
      toast.error("Unable to navigate: Missing required parameters");
      return;
    }

    navigate(
      `/viewmatch-fancy/series_idd/${marketId}/event_id/${eventId}/sport_id/${sportId}`,
    );
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

  // ✅ FIXED: Render Bookmaker items with amounts
  const renderBookmakerItems = (items) => {
    if (!items || items.length === 0) return null;

    return items.map((item, index) => {
      const value = item.display_amount || item.amount;

      return (
        <div key={index} className="section-item bookmaker-item">
          <span className="item-text">{item.team_name || "Bookmaker"}</span>
          {value !== null && value !== undefined && (
            <span
              className={`item-value ${parseFloat(value) < 0 ? "negative" : "positive"}`}
            >
              {value}
            </span>
          )}
        </div>
      );
    });
  };

  // Render Fancy items - Sirf fancy_name show karo
  const renderFancyItems = (items) => {
    if (!items || items.length === 0) return null;

    // Sirf wahi items jinme fancy_name hai
    const filteredItems = items.filter((item) => item.fancy_name);
    if (filteredItems.length === 0) return null;

    return filteredItems.map((item, index) => {
      const value = item.display_amount || item.amount;

      return (
        <div key={index} className="section-item">
          <span className="item-text">{item.fancy_name}</span>
          {value !== null && value !== undefined && (
            <span
              className={`item-value ${parseFloat(value) < 0 ? "negative" : "positive"}`}
            >
              {value}
            </span>
          )}
        </div>
      );
    });
  };

  // Render Match Odds items (team names with amounts)
  const renderMatchOddsItems = (items) => {
    if (!items || items.length === 0) return null;

    return items.map((item, index) => {
      const value = item.display_amount || item.amount;
      const isDraw = item.team_name?.toLowerCase().includes("draw");

      return (
        <div
          key={index}
          className={`section-item ${isDraw ? "draw-item" : ""}`}
        >
          <span className="item-text">{item.team_name || "Match Odds"}</span>
          {value !== null && value !== undefined && (
            <span
              className={`item-value ${parseFloat(value) < 0 ? "negative" : "positive"}`}
            >
              {value}
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header bg-white d-flex justify-content-between align-items-md-center gap-2">
          <h5 className="card-title mb-0">Market Analysis</h5>
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
                {events.map((event, groupIndex) => (
                  <div key={groupIndex} className="event-group mb-4">
                    <div
                      className="event-group-header clickable"
                      onClick={() => handleEventHeadingClick(event)}
                    >
                      <h4 className="event-title">
                        {event.event_name || event.name || "Unnamed"}
                      </h4>
                      {/* <div className="event-meta">
                        <span className="meta-item">
                          {event.series_name || ""}
                        </span>
                        <span className="meta-item">
                          {event.date_time || ""}
                        </span>
                      </div> */}
                    </div>

                    <div className="event-sections">
                      {event.bookmaker?.length > 0 && (
                        <table className="table table-bordered table-striped mb-3">
                          <thead>
                            <tr className="table-warning">
                              <th colSpan="2">BOOK MAKER</th>
                            </tr>
                          </thead>
                          <tbody>
                            {event.bookmaker.map((item, index) => (
                              <tr key={index}>
                                <td>{item.team_name || item.name}</td>
                                <td
                                  className={
                                    Number(item.amount) < 0
                                      ? "text-danger fw-bold"
                                      : "text-success fw-bold"
                                  }
                                >
                                  {item.amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {/* FANCY */}
                      {event.fancy?.length > 0 && (
                        <table className="table table-bordered table-striped mb-3">
                          <thead>
                            <tr className="table-warning">
                              <th colSpan="2">FANCY</th>
                            </tr>
                          </thead>
                          <tbody>
                            {event.fancy.map((item, index) => (
                              <tr key={index}>
                                <td>{item.fancy_name}</td>
                                <td
                                  className={
                                    Number(item.amount) < 0
                                      ? "text-danger fw-bold"
                                      : "text-success fw-bold"
                                  }
                                >
                                  {item.amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {/* MATCH ODDS */}
                      {event.match_odds?.length > 0 && (
                        <table className="table table-bordered table-striped mb-3">
                          <thead>
                            <tr className="table-warning">
                              <th colSpan="2">MATCH ODDS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {event.match_odds.map((item, index) => (
                              <tr key={index}>
                                <td>{item.team_name || item.name}</td>
                                <td
                                  className={
                                    Number(item.amount) < 0
                                      ? "text-danger fw-bold"
                                      : "text-success fw-bold"
                                  }
                                >
                                  {item.amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {/* GRAND TOTAL */}
                      {/* {event.totals?.grand_total !== undefined && (
                        <table className="table table-bordered">
                          <thead>
                            <tr className="table-warning">
                              <th colSpan="2">GRAND TOTAL</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Total</td>
                              <td
                                className={
                                  Number(event.totals.grand_total) < 0
                                    ? "text-danger fw-bold"
                                    : "text-success fw-bold"
                                }
                              >
                                {event.totals.grand_total}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )} */}
                    </div>
                  </div>
                ))}
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
    </>
  );
};

export default MarketAnalysisLists;
