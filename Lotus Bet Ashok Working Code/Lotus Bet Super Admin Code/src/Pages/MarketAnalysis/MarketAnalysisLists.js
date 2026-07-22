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
      console.error("Missing navigation parameters:", { eventId, marketId, sportId });
      toast.error("Unable to navigate: Missing required parameters");
      return;
    }

    navigate(
      `/viewmatch-fancy/series_idd/${marketId}/event_id/${eventId}/sport_id/${sportId}`
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
            <span className={`item-value ${parseFloat(value) < 0 ? 'negative' : 'positive'}`}>
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
    const filteredItems = items.filter(item => item.fancy_name);
    if (filteredItems.length === 0) return null;

    return filteredItems.map((item, index) => {
      const value = item.display_amount || item.amount;
      
      return (
        <div key={index} className="section-item">
          <span className="item-text">{item.fancy_name}</span>
          {value !== null && value !== undefined && (
            <span className={`item-value ${parseFloat(value) < 0 ? 'negative' : 'positive'}`}>
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
      const isDraw = item.team_name?.toLowerCase().includes('draw');
      
      return (
        <div key={index} className={`section-item ${isDraw ? 'draw-item' : ''}`}>
          <span className="item-text">{item.team_name || "Match Odds"}</span>
          {value !== null && value !== undefined && (
            <span className={`item-value ${parseFloat(value) < 0 ? 'negative' : 'positive'}`}>
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
            <span className="badge bg-secondary">
              Total: {totalRecords}
            </span>
          )}
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-5">
              <h5>No Data To Display</h5>
            </div>
          ) : (
            <>
              <div className="market-analysis-container">
                {events.map((event, groupIndex) => (
                  <div key={groupIndex} className="event-group mb-4">
                    <div 
                      className="event-group-header clickable"
                      onClick={() => handleEventHeadingClick(event)}
                    >
                      <h3 className="event-title">
                        {event.event_name || event.name || "Unnamed"}
                        <span className="click-icon">→</span>
                      </h3>
                      <div className="event-meta">
                        <span className="meta-item">{event.series_name || ""}</span>
                        <span className="meta-item">{event.date_time || ""}</span>
                      </div>
                    </div>

                    <div className="event-sections">
                      {/* BOOK MAKER Section - Team names with amounts */}
                      {event.bookmaker && event.bookmaker.length > 0 && (
                        <div className="section-container">
                          <div className="section-header">
                            <h6 className="section-title">BOOK MAKER</h6>
                          </div>
                          <div className="section-items">
                            {renderBookmakerItems(event.bookmaker)}
                          </div>
                        </div>
                      )}

                      {/* FANCY Section - fancy_name with amounts */}
                      {event.fancy && event.fancy.length > 0 && (
                        <div className="section-container">
                          <div className="section-header">
                            <h6 className="section-title">FANCY</h6>
                          </div>
                          <div className="section-items">
                            {renderFancyItems(event.fancy)}
                          </div>
                        </div>
                      )}

                      {/* MATCH ODDS Section - team names with amounts */}
                      {event.match_odds && event.match_odds.length > 0 && (
                        <div className="section-container">
                          <div className="section-header">
                            <h6 className="section-title">MATCH ODDS</h6>
                          </div>
                          <div className="section-items">
                            {renderMatchOddsItems(event.match_odds)}
                          </div>
                        </div>
                      )}

                      {/* Grand Total */}
                      {event.totals && event.totals.grand_total !== undefined && (
                        <div className="section-container total-section">
                          <div className="section-header total-header">
                            <h6 className="section-title">GRAND TOTAL</h6>
                          </div>
                          <div className="section-items">
                            <div className="section-item total-item">
                              <span className="item-text total-label">Total</span>
                              <span className={`item-value ${parseFloat(event.totals.grand_total) < 0 ? 'negative' : 'positive'}`}>
                                {event.totals.grand_total}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
                  <div className="text-muted small">
                    Showing {events.length} of {totalRecords} records
                  </div>
                  <div className="paginationall d-flex align-items-center gap-1">
                    <button 
                      className="pagination-btn"
                      disabled={currentPage === 1} 
                      onClick={handlePrev}
                    >
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
                      className="pagination-btn"
                      disabled={currentPage === totalPages}
                      onClick={handleNext}
                    >
                      Next <MdKeyboardDoubleArrowRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .event-group {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
          margin-bottom: 20px;
          transition: box-shadow 0.3s ease;
        }

        .event-group:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }

        .event-group-header {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 14px 24px;
          border-bottom: 2px solid #dee2e6;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .event-group-header.clickable:hover {
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          padding-left: 30px;
          padding-right: 30px;
        }

        .event-group-header.clickable:active {
          transform: scale(0.99);
        }

        .event-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .event-meta {
          display: flex;
          gap: 20px;
          margin-top: 6px;
          font-size: 13px;
          color: #6c757d;
          flex-wrap: wrap;
        }

        .meta-item {
          background: rgba(108, 117, 125, 0.1);
          padding: 2px 10px;
          border-radius: 4px;
        }

        .click-icon {
          font-size: 18px;
          color: #007bff;
          opacity: 0;
          transition: all 0.3s ease;
          transform: translateX(-10px);
        }

        .event-group-header.clickable:hover .click-icon {
          opacity: 1;
          transform: translateX(0);
        }

        .event-sections {
          padding: 0;
        }

        .section-container {
          border-bottom: 1px solid #e9ecef;
        }

        .section-container:last-child {
          border-bottom: none;
        }

        .section-header {
          background: #ffffff;
          padding: 10px 24px;
          border-bottom: 1px solid #f1f3f5;
        }

        .section-title {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          color: #495057;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .section-items {
          padding: 4px 0;
        }

        .section-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 24px;
          border-bottom: 1px solid #f8f9fa;
          cursor: default;
          transition: all 0.2s ease;
        }

        .section-item:hover {
          background-color: #fafafa;
        }

        .section-item:last-child {
          border-bottom: none;
        }

        .section-item.draw-item {
          background-color: #fafafa;
          border-left: 3px solid #ffc107;
        }

        .section-item.draw-item:hover {
          background-color: #f5f5f5;
        }

        .section-item.bookmaker-item {
          padding: 8px 24px;
        }

        .section-item.bookmaker-item .item-text {
          font-weight: 400;
        }

        .section-item.total-item {
          background-color: #f8f9fa;
          border-top: 2px solid #dee2e6;
          font-weight: 600;
          padding: 12px 24px;
        }

        .section-item.total-item:hover {
          background-color: #f1f3f5;
        }

        .total-section {
          border-top: 2px solid #dee2e6;
          margin-top: 4px;
        }

        .total-header {
          background: #f8f9fa;
        }

        .item-text {
          font-size: 15px;
          font-weight: 500;
          color: #2c3e50;
        }

        .section-item.draw-item .item-text {
          color: #6c757d;
          font-weight: 400;
        }

        .total-label {
          font-weight: 700;
          color: #2c3e50;
        }

        .item-value {
          font-weight: 600;
          font-family: 'Courier New', monospace;
          font-size: 15px;
          padding: 4px 12px;
          border-radius: 4px;
          background: #f8f9fa;
          min-width: 80px;
          text-align: right;
        }

        .item-value.positive {
          color: #28a745;
        }

        .item-value.negative {
          color: #dc3545;
        }

        .paginationall {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pagination-btn {
          padding: 8px 16px;
          border: 1px solid #dee2e6;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 500;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #007bff;
          color: white;
          border-color: #007bff;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,123,255,0.3);
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .paginationnumber {
          padding: 8px 14px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 36px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          background: #fff;
        }

        .paginationnumber:hover {
          background: #007bff;
          color: white;
          border-color: #007bff;
          transform: translateY(-1px);
        }

        .paginationnumber.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0,123,255,0.3);
        }

        .badge {
          font-size: 13px;
          padding: 6px 12px;
        }

        @media (max-width: 768px) {
          .event-title {
            font-size: 17px;
          }

          .event-meta {
            flex-direction: column;
            gap: 4px;
            font-size: 12px;
          }
          
          .section-item {
            padding: 8px 16px;
            flex-wrap: wrap;
            gap: 6px;
          }
          
          .item-text {
            font-size: 14px;
          }

          .item-value {
            font-size: 13px;
            min-width: 60px;
          }
          
          .event-group-header {
            padding: 10px 16px;
          }
          
          .section-header {
            padding: 8px 16px;
          }
          
          .section-title {
            font-size: 12px;
          }

          .click-icon {
            font-size: 16px;
          }
        }

        @media (max-width: 576px) {
          .section-item {
            padding: 6px 12px;
            flex-direction: column;
            align-items: flex-start;
          }

          .item-text {
            font-size: 13px;
          }
          
          .item-value {
            font-size: 12px;
            min-width: 50px;
            padding: 2px 8px;
          }
          
          .pagination-btn,
          .paginationnumber {
            padding: 6px 10px;
            font-size: 12px;
          }

          .event-title {
            font-size: 15px;
          }

          .click-icon {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default MarketAnalysisLists;