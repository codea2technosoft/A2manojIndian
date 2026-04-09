import React, { useState, useEffect } from "react";
import "../viewmatchAndFancy/Eventcss.scss"; // keep your existing styles
import {
  getEventBetsCompleteHistory
} from "../../Server/api";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
function SessionBet() {
  const navigate = useNavigate();
  const { event_id } = useParams();
  // Static data exactly matching your screenshot
 

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 15,
  });
  const admin_id = localStorage.getItem("admin_id");
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 15;

  const getEventBets = async (page = 1) => {
    try {
      setLoading(true);

      const payload = {
        admin_id,
        event_id,
        page,
        limit: pagination.limit,
      };
      const res = await getEventBetsCompleteHistory(payload);

      setFilteredData(res.data.data || []);
      setPagination({
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        totalRecords: res.data.pagination.totalRecords,
        limit: res.data.pagination.limit,
      });

    } catch (err) {
      setError("Failed to fetch event bets.");
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (event_id) {
      getEventBets(1);
    }
  }, [event_id]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      getEventBets(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(pagination.totalPages, start + maxVisiblePages - 1);

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
    <div className="card mt-4">
      {/* Top blue header like in image */}
      <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0">SESSION BETS</h4>
        <button className="btn btn-sm btn-light"
          onClick={() => navigate(-1)}
        >Back</button>
      </div>
      {/* Filter section */}
      {/* <div className="p-3 border-bottom">
        <div className="row  align-items-end">
          <div className="col-md-2">
            <label className="form-label fw-bold">SESSIONS *</label>
            <select className="form-select" value={selectedSession}>
              <option value="all">SELECT SESSION</option>
              </select>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">MASTER*</label>
            <select className="form-select">
              <option>SELECT MASTER</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">SUPER*</label>
            <select className="form-select">
              <option>SELECT SUPER</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">AGENT*</label>
            <select className="form-select">
              <option>SELECT AGENT</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">CLIENT*</label>
            <select className="form-select">
              <option>SELECT CLIENT</option>
            </select>
          </div>

          <div className="col-md-2">
            <button class="btn btn-primary">Reset</button>
          </div>
        </div>
      </div> */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-bordered table-striped mb-0 bets-table">
            <thead className="bg-primary text-white">
              <tr>
                <th>USERNAME</th>
                <th>RUNNER NAME</th>
                <th>BET TYPE</th>
                <th>BET PRICE</th>
                <th>BET SIZE</th>
                <th>BET AMOUNT</th>
                <th>STATUS</th>
                <th>WINNER</th>
                <th>PLACE TIME</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    NO DATA FOUND
                  </td>
                </tr>
              ) : (
                filteredData.map((bet, index) => (
                  <tr key={index}>
                    <td>{bet.admin_id}</td>
                    <td>{bet.team || "N/A"}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            bet.bet_on?.toLowerCase() === "back"
                              ? "#28a745"
                              : bet.bet_on?.toLowerCase() === "lay"
                                ? "#dc3545"
                                : "#6c757d",
                          color: "#fff",
                          padding: "6px 10px",
                          fontSize: "13px",
                          borderRadius: "6px",
                        }}
                      >
                        {bet.bet_on?.toLowerCase() === "back"
                          ? "LAGAI"
                          : bet.bet_on?.toLowerCase() === "lay"
                            ? "KHAI"
                            : bet.bet_on}
                      </span>
                    </td>
                    <td>{bet.odd}</td>
                    <td>{bet.total}</td>
                    <td>{bet.stake}</td>
                    <td
                      className={
                        bet.match_status === "2"
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {bet.match_status === "2" ? "WIN" : "LOSS"}
                    </td>
                    <td>{bet.result_val}</td>
                    <td>{new Date(bet.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      {/* {pagination.totalRecords > pagination.limit && (
  <div className="d-flex justify-content-end align-items-center gap-2 p-3">
    <button
      className="btn btn-dark d-flex align-items-center"
      disabled={pagination.currentPage === 1}
      onClick={() => handlePageChange(pagination.currentPage - 1)}
    >
      <MdOutlineKeyboardArrowLeft size={22} />
    </button>

    {getPageNumbers().map((page) => (
      <button
        key={page}
        className={`btn ${
          page === pagination.currentPage ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </button>
    ))}

    <button
      className="btn btn-dark d-flex align-items-center"
      disabled={pagination.currentPage === pagination.totalPages}
      onClick={() => handlePageChange(pagination.currentPage + 1)}
    >
      <MdOutlineKeyboardArrowRight size={22} />
    </button>
  </div>
)} */}

<div className="card-footer">
  <div className="d-flex justify-content-between align-items-center mt-4">

    {/* Left Side — Showing Page Info */}
    <div className="sohwingallentries">
      Page {pagination.currentPage} of {pagination.totalPages}
    </div>

    {/* Right Side — Pagination */}
    <div className="paginationall d-flex align-items-center gap-2">

      {/* Prev Button */}
      <button
        className="btn btn-outline-primary btn-sm"
        disabled={pagination.currentPage <= 1}
        onClick={() => handlePageChange(pagination.currentPage - 1)}
      >
        <MdOutlineKeyboardArrowLeft size={18} />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          className={`btn btn-sm ${page === pagination.currentPage ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className="btn btn-outline-primary btn-sm"
        disabled={pagination.currentPage >= pagination.totalPages}
        onClick={() => handlePageChange(pagination.currentPage + 1)}
      >
        <MdOutlineKeyboardArrowRight size={18} />
      </button>

    </div>

  </div>
</div>


      </div>
    </div>
  );
}

export default SessionBet;