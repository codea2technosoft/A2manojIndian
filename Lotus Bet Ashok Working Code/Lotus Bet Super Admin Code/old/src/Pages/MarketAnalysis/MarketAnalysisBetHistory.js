import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";
import { getBetHistory } from "../../Server/api";

const MarketAnalysisBetHistory = () => {
  const navigate = useNavigate();
  const { userId, marketId } = useParams();

  const [loading, setLoading] = useState(true);
  const [betHistory, setBetHistory] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  // ✅ API: बेट हिस्ट्री लाना
  const fetchBetHistory = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await getBetHistory(userId, marketId, {
        page,
        limit,
      });

      const response = res.data;
      if (response.success) {
        setBetHistory(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        setCurrentPage(response.pagination?.current_page || 1);
        setTotalRecords(response.pagination?.total_records || 0);
      } else {
        toast.error(response.message || "Failed to fetch bet history");
      }
    } catch (error) {
      console.error("Error fetching bet history:", error);
      toast.error("Failed to fetch bet history data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && marketId) {
      fetchBetHistory(currentPage);
    }
  }, [userId, marketId, currentPage]);

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

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        {/* हेडर */}
        <div className="card-header flex-wrap-mobile bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
          <h5 className="card-title mb-0">📜 Bet History</h5>
          <div className="d-flex align-items-center">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-light"
            >
              ⬅ Back
            </button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p>⏳ Loading history...</p>
            </div>
          ) : betHistory.length === 0 ? (
            <div className="text-center py-5">
              <h5>❌ No Bet History Found</h5>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>NO</th>
                      <th>USERNAME</th>
                      <th>EVENT</th>
                      <th>MARKET TYPE</th>
                      <th>SELECTION</th>
                      <th>TYPE</th>
                      <th>ODDS REQ.</th>
                      <th>STAKE</th>
                      <th>PLACE TIME</th>
                      <th>MATCHED TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {betHistory.map((bet, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{bet.username || bet.user_name || "-"}</td>
                        <td>{bet.event || bet.event_name || "FIFA World Cup"}</td>
                        <td>{bet.market_type || "BOOK_MAKER"}</td>
                        <td>{bet.selection || "-"}</td>
                        <td>
                          <span className={`badge ${bet.type === 'Back' ? 'bg-success' : 'bg-danger'}`}>
                            {bet.type || bet.bet_type || "Back"}
                          </span>
                        </td>
                        <td>{bet.odds || bet.rate || "-"}</td>
                        <td>₹{Number(bet.stake || bet.amount || 0).toFixed(2)}</td>
                        <td>
                          {bet.place_time || bet.created_at
                            ? new Date(bet.place_time || bet.created_at).toLocaleString()
                            : "-"}
                        </td>
                        <td>
                          {bet.matched_time || bet.updated_at
                            ? new Date(bet.matched_time || bet.updated_at).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* पेजिनेशन - बिल्कुल इमेज जैसा */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="sohwingallentries">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, totalRecords)} of{" "}
                    {totalRecords} entries
                  </div>

                  <div className="paginationall d-flex align-items-center gap-1">
                    <button 
                      disabled={currentPage === 1} 
                      onClick={handlePrev}
                      className="btn-prev"
                    >
                      <MdOutlineKeyboardArrowLeft /> Previous
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
                      className="btn-next"
                    >
                      Next <MdOutlineKeyboardArrowRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* CSS स्टाइल */}
      <style jsx>{`
        .bg-primary-yellow {
          background-color: #f5a623 !important;
        }
        .paginationnumber {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          border-radius: 5px;
          cursor: pointer;
          border: 1px solid #ddd;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .paginationnumber:hover {
          background-color: #f0f0f0;
        }
        .paginationnumber.active {
          background-color: #f5a623;
          color: white;
          border-color: #f5a623;
        }
        .btn-prev, .btn-next {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 15px;
          border-radius: 5px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .btn-prev:hover:not(:disabled), 
        .btn-next:hover:not(:disabled) {
          background-color: #f0f0f0;
        }
        .btn-prev:disabled, 
        .btn-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .sohwingallentries {
          color: #6c757d;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default MarketAnalysisBetHistory;