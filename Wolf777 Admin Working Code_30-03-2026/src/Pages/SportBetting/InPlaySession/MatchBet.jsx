
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  InPlayGetmatchbetPending,
} from "../../../Server/api";


import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

function InPlayMatchBet() {
  const navigate = useNavigate();
  const { event_id } = useParams();
  const admin_id = localStorage.getItem("admin_id");
  const [filteredData, setFilteredData] = useState([]);
  const [myBook, setMyBook] = useState([]);
  const [totalBook, setTotalBook] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 15
  });

  const getEventBets = async (page = 1) => {
    try {
      setLoading(true);

      const payload = {
        admin_id,
        event_id,
        page,
        limit: pagination.pageSize,
      };

      const res = await InPlayGetmatchbetPending(payload);

      setFilteredData(res.data.data || []);

      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalRecords: res.data.totalRecords,
        pageSize: pagination.pageSize,
      });

    } catch (err) {
      setError("Failed to fetch event bets.");
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };


  // const getBookData = async () => {
  //   try {
  //     const payload = {
  //       admin_id,
  //       eventid: event_id
  //     };

  //     const ttlRes = await fetMatchExposerMyBook(payload)

  //     setTotalBook(ttlRes.data.data || []);

  //   } catch (err) {
  //     console.error("Exposer Fetch Error:", err);
  //   }
  // };
  useEffect(() => {
    if (event_id) {
      getEventBets(1);
      // getBookData();
    }
  }, [event_id]);


  const formatNumber = (num) => {
    if (num === null || num === undefined) return "0.00";
    return typeof num === 'number' ? num.toFixed(2) : num;
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }) + " " + date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };


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

      {/* 🔷 Header (MATCH BOOK + BACK BUTTON) */}
      <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">MATCH BETS</h5>
        <button className="btn btn-sm btn-light"
          onClick={() => navigate(-1)}>
          Back</button>
      </div>

      {/* 🔷 Runner Book Section */}
      {/* <table className="table table-bordered mb-0">
        <thead className="bg-primary text-white">
          <tr>
            <th>RUNNER</th>
            <th>MY BOOK</th>
            <th>TOTAL BOOK</th>
          </tr>
        </thead>
        <tbody>
          {myBook.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-danger fw-bold">
                No Runner Book Found
              </td>
            </tr>
          ) : (
            myBook.map((item, i) => (
              <tr key={i}>
                <td>{item.runner}</td>
                <td className={item.my_book < 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                  {formatNumber(item.my_book)}
                </td>
                <td className={totalBook[i]?.total_book < 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                  {formatNumber(totalBook[i]?.total_book)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table> */}


      {/* <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        FILTER BETS
      </div>

      <div className="p-3 border-bottom">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label fw-bold">MASTER*</label>
            <select className="form-select">
              <option>NO OPTIONS</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">SUPER*</label>
            <select className="form-select">
              <option>NO OPTIONS</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">AGENT*</label>
            <select className="form-select">
              <option>NO OPTIONS</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-bold">CLIENT*</label>
            <select className="form-select">
              <option>NO OPTIONS</option>
            </select>
          </div>

          <div className="mt-2">
            <button className="btn btn-sm btn-secondary">Reset</button>
          </div>

        </div>
      </div> */}
      {/* <div className="bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        MATCH BETS
      </div> */}

      <div className="table-responsive">
        {loading ? (
          <p className="text-center p-3">Loading...</p>
        ) : (
          <table className="table table-bordered table-striped mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th className="text-white">PLACE TIME</th>
                <th className="text-white">USERNAME</th>
                <th className="text-white">RUNNER NAME</th>
                <th className="text-white">BET ON</th>
                <th className="text-white">BET TYPE</th>
                <th className="text-white">BET PRICE</th>
                <th className="text-white">BET VALUE</th>
                <th className="text-white">BET AMOUNT</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-danger fw-bold">
                    No Bets Found
                  </td>
                </tr>
              ) : (
                filteredData.map((bet, index) => (
                  <tr key={index}>
                    <td>{formatDate(bet.place_time || bet.created_at)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {bet.admin_id}
                      </div>
                    </td>
                    <td>{bet.runner_name || bet.team || "N/A"}</td>
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
                    <td>{bet.bet_type}</td>
                    <td>{formatNumber(bet.bet_price || bet.odd)}</td>
                    <td>{formatNumber(bet.bet_value || bet.total)}</td>
                    <td>{formatNumber(bet.bet_amount || bet.stake || bet.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        )}
      </div>
      {pagination.totalRecords > pagination.limit && (
        <div className="d-flex justify-content-center align-items-center gap-2 p-3">
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
              className={`btn ${page === pagination.currentPage ? "btn-primary" : "btn-outline-primary"
                }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            className="btn btn-dark d-flex align-items-center"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            <MdOutlineKeyboardArrowRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
export default InPlayMatchBet;
