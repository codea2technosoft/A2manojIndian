import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../viewmatchAndFancy/Eventcss.scss";
import "../viewmatchAndFancy/Eventcss.scss";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import {
  getAllCompleteSession,
  getAllSessionBetList
} from "../../Server/api";
function CompletedSession() {
  const navigate = useNavigate();
  const { event_id } = useParams();
  // Static data exactly matching your screenshot
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 50,
  });
  const admin_id = localStorage.getItem("admin_id");
  const [betsData, setBetsData] = useState([]);
  const [sessionList, setSessionList] = useState([]); // dropdown data
  const [selectedFancy, setSelectedFancy] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchSessions = async (page = 1) => {
    try {
      setLoading(true);
      const payload = {
        admin_id,
        event_id,
        page,
        limit: pagination.limit,
      };
      const res = await getAllCompleteSession(payload);
      setSessionList(res.data.data || []);
      setPagination({
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        totalRecords: res.data.pagination.totalRecords,
        limit: res.data.pagination.limit,
      });

    } catch (err) {
      setError("Failed to fetch event bets.");
      setSessionList([]);
    } finally {
      setLoading(false);
    }
  };


 const fetchSessionBets = async (fancy_id) => {


  try {
    // setLoading(true);

    const payload = {
      admin_id,
      fancy_id:"",
      page: 1,
      limit: 20,
    };


    const res = await getAllSessionBetList(payload);

    console.log("Bets AP", res);

    setBetsData(res?.data?.data || []);
  } catch (err) {
    console.log("API Error:", err);
    setError("Failed to fetch bets.");
    setBetsData([]);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchSessionBets()
    if (event_id) {
      fetchSessions(1);
    }
  }, [event_id]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      fetchSessions(page);
    }
  };
  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    handlePageChange(page);
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
      {/* Header */}
      <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Completed Bets</h4>
        <button className="btn btn-sm btn-light"
          onClick={() => navigate(-1)}
        >Back</button>
      </div>

      {/* Filters */}
      <div className="p-3 border-bottom">
        <div className="row align-items-end">
          <div className="col-md-6">
            <label className="form-label fw-bold">Session</label>

            <select
              className="form-select"
              value={selectedFancy}
              onChange={(e) => {
                const fancy = e.target.value;
                console.log("Selected Fancy >>> ", fancy); 
                setSelectedFancy(fancy);

                if (fancy) {
                  fetchSessionBets(fancy);
                }
              }}
            >
              <option value="">Select Session</option>

              {sessionList.map((s) => (
                <option key={s.fancy_id} value={s.fancy_id}>
                  {s.runner_name}
                </option>
              ))}
            </select>
          </div>


          <div className="col-md-6">
            <label className="form-label fw-bold">SELECT CLIENT</label>
            <select className="form-select">
              <option>SELECT SUPER</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100">Reset</button>
          </div>
        </div>
      </div>
      {/* Table */}

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-bordered table-striped mb-0 bets-table">
            <thead className="bg-primary text-white">
              <tr>
                <th>Place Time</th>
                <th>RUNNER NAME</th>
                <th>USERId</th>
                <th>Bet Type</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-3">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center text-danger py-3">{error}</td>
                </tr>
              ) : betsData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-3">No Data Found</td>
                </tr>
              ) : (
                betsData.map((bet, i) => (
                  <tr key={i}>
                    <td>{bet.place_time || "-"}</td>
                    <td>{bet.runner_name || "-"}</td>
                    <td className="fw-bold">{bet.username || "-"}</td>
                    <td>{bet.bet_type || "-"}</td>
                    <td>{bet.bet_price || "-"}</td>
                    <td>{bet.bet_amount || "-"}</td>
                    <td className={bet.status === "WIN" ? "text-success fw-bold" : "text-danger fw-bold"}>
                      {bet.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">

            <div className="sohwingallentries d-flex align-items-center gap-3">
              Showing{" "}
              {pagination.totalRecords === 0
                ? 0
                : (pagination.currentPage - 1) * pagination.limit + 1}{" "}
              to{" "}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)}{" "}
              of {pagination.totalRecords} entries
            </div>

            <div className="paginationall d-flex align-items-center gap-2">
              {/* PREV */}
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={pagination.currentPage === 1}
                onClick={handlePrevPage}
              >
                <MdOutlineKeyboardArrowLeft />
              </button>

              {/* Page Numbers */}
              <div className="d-flex gap-1">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`btn btn-sm ${pagination.currentPage === page ? "btn-primary" : "btn-outline-primary"
                      }`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* NEXT */}
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={handleNextPage}
              >
                <MdOutlineKeyboardArrowRight />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default CompletedSession;
