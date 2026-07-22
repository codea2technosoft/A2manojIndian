import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBetHistoryDetails } from "../../Server/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import Loader from "../../Common/Loader";

const BetHistoryDetails = () => {
  const navigate = useNavigate();
  const { roundId, eventTypeId } = useParams();

  const [loading, setLoading] = useState(true);
  const [betData, setBetData] = useState([]);
  const [roundInfo, setRoundInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  useEffect(() => {
    if (roundId && eventTypeId) {
      fetchBetHistory();
    }
  }, [roundId, eventTypeId, currentPage]);

  const fetchBetHistory = async () => {
    try {
      setLoading(true);
      const payload = {
        round_id: roundId,
        event_type_id: eventTypeId,
        page: currentPage,
        limit: limit,
      };

      const res = await getBetHistoryDetails(payload);
      const response = res.data;

      if (response.status) {
        const data = response.data;
        const betHistory = data.bet_history || {};
        const round = data.round || {};

        setBetData(betHistory.data || []);
        setRoundInfo(round);
        setTotalPages(betHistory.last_page || 1);
        setTotalRecords(betHistory.total || 0);
        setCurrentPage(betHistory.current_page || 1);
      } else {
        toast.error(response.error?.message || "Failed to fetch bet history");
      }
    } catch (error) {
      console.error("Error fetching bet history:", error);
      toast.error("Failed to fetch bet history");
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "-";
    }
  };

  const formatNumber = (num) => {
    return Number(num || 0).toFixed(2);
  };

  // Get status label
  const getStatusLabel = (status) => {
    if (status === 1) return "Active";
    if (status === 0) return "Inactive";
    return "Unknown";
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Bet History</h5>
          {/* <div className="d-flex gap-2">
            <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
              Back
            </button>
          </div> */}
        </div>

        <div className="card-body">
          {/* Round Info */}
          {roundInfo && (
            <div className="row mb-3">
              <div className="col-md-3">
                <small className="text-muted">Round ID</small>
                <p className="fw-bold">{roundInfo.round_id || "-"}</p>
              </div>
              <div className="col-md-3">
                <small className="text-muted">Event Type</small>
                <p className="fw-bold">{roundInfo.event_type_name || "-"}</p>
              </div>
              <div className="col-md-3">
                <small className="text-muted">Market Type</small>
                <p className="fw-bold">{roundInfo.market_type || "-"}</p>
              </div>
              <div className="col-md-3">
                <small className="text-muted">Status</small>
                <p className="fw-bold">
                  <span
                    className={`badge ${roundInfo.status === 1 ? "bg-success" : "bg-danger"}`}
                  >
                    {roundInfo.status === 1 ? "Active" : "Closed"}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: "50px" }}>NO</th>
                  <th>USERNAME</th>
                  <th>RUNNER NAME</th>
                  <th>ROUND ID</th>
                  <th>ODDS</th>
                  <th>STAKES</th>
                  <th>RESULT</th>
                  <th>STATUS</th>
                  <th>DATE/TIME</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colspan="10">
                      <div className="text-center py-5 mt-1">
                        <p>Loading bet history...</p>
                        <Loader className="mt-2" />
                      </div>
                    </td>
                  </tr>
                ) : betData.length === 0 ? (
                  <tr>
                    <td colspan="10">
                      <h5 className="fs-6 text-dark py-5 text-center">
                        No Data Found
                      </h5>
                    </td>
                  </tr>
                ) : (
                  <>
                    <tbody>
                      {betData.map((item, index) => {
                        const isWin = item.pnl && parseFloat(item.pnl) > 0;
                        const isLoss = item.pnl && parseFloat(item.pnl) < 0;
                        const resultValue = item.result || item.pnl || 0;

                        return (
                          <tr key={item.id || index}>
                            <td>{(currentPage - 1) * limit + index + 1}</td>
                            <td>
                              {item.user?.username || "-"}
                            </td>
                            <td>
                              {item.runner_name || "-"}
                            </td>
                            <td>
                              {item.round_id || "-"}
                            </td>
                            <td
                              style={{ textAlign: "right", fontSize: "12px" }}
                            >
                              {item.odd || "0"}
                            </td>
                            <td
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {formatNumber(item.stake)}
                            </td>
                            <td
                            >
                              <span
                                className={`badge ${isWin ? "bg-success" : isLoss ? "bg-danger" : "bg-secondary"}`}
                              >
                                {formatNumber(resultValue)}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${item.status === 1 ? "bg-success" : "bg-warning"}`}
                              >
                                {getStatusLabel(item.status)}
                              </span>
                            </td>
                            <td>
                              {formatDate(item.created_at)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-4">
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
        </div>
      </div>
    </>
  );
};

export default BetHistoryDetails;
