import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import {
  AbendedbetList
} from "../../../Server/api";
import "../../viewmatchAndFancy/Eventcss.scss";

function InPlyaRejectedBet() {
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEventBets = async (page = 1) => {
    try {
      setLoading(true);

      const payload = {
        admin_id,
        event_id,
        page,
        limit: pagination.limit,
      };
      const res = await AbendedbetList(payload);
      setBetsData(res.data.data || []);
      setPagination({
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        totalRecords: res.data.pagination.totalRecords,
        limit: res.data.pagination.limit,
      });

    } catch (err) {
      setError("Failed to fetch event bets.");
      setBetsData([]);
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
      {/* Top blue header like in image */}
      <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Cancel Bets</h4>

        <button
          className="btn btn-sm btn-light"
          onClick={() => navigate(-1)}
        >Back</button>
      </div>
      {/* Filter section */}
      {/* <div className="p-3 border-bottom">
        <div className="row g-3 align-items-end">
              <div className="col-md-3">
            <label className="form-label fw-bold">MASTER*</label>
            <select className="form-select">
              <option>SELECT MASTER</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">SUPER*</label>
            <select className="form-select">
              <option>SELECT SUPER</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">AGENT*</label>
            <select className="form-select">
              <option>SELECT AGENT</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-bold">CLIENT*</label>
            <select className="form-select">
              <option>SELECT CLIENT</option>
            </select>
          </div>
           <div className="">
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
                <th>PLACE TIME</th>
              </tr>
            </thead>
            <tbody>
              {betsData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    NO DATA FOUND
                  </td>
                </tr>
              ) : (
                betsData.map((bet, index) => (
                  <tr key={index}>
                    <td>{bet?.admin_id || "-"}</td>
                    <td>{bet?.team}</td>
                    <td className="text-danger fw-bold">
                      {bet?.bet_on?.toUpperCase()}
                    </td>
                    <td>{bet?.odd}</td>
                    <td>{bet?.stake}</td>
                    <td>{bet?.fancy_deposit}</td>
                    <td className="text-danger fw-bold">
                      Cancel
                    </td>
                    <td>{new Date(bet?.createdAt).toLocaleString()}</td>
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
            className={`btn btn-sm ${
              pagination.currentPage === page ? "btn-primary" : "btn-outline-primary"
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

export default InPlyaRejectedBet;