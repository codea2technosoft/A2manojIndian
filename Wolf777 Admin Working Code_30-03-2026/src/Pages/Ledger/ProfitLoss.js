import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import moment from "moment";
import {
  FiSearch
} from "react-icons/fi";
import { getMatchLedger } from "../../Server/api";

function ProfitAndLoss() {
  const navigate = useNavigate();
  // ---------------- STATES ----------------
  const admin_id = localStorage.getItem("admin_id");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false); 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
  });
  const hasActiveFilters = searchTerm !== "";
  const [totalRecords, setTotalRecords] = useState(0);
  const [summary, setSummary] = useState({
    lena: 0,
    dena: 0,
    balance: 0,
  });

  // ---------------- API CALL ----------------
  const fetchMatchLedger = async () => {
    try {
      setLoading(true);
      setIsSearching(true);
      const payload = {
        admin_id,
        page,
        limit,
        // start_date: startDate,
        // end_date: endDate,
        // search: searchTerm,
        from_date: startDate,
        to_date: endDate,
        search: searchTerm,
      };

      const res = await getMatchLedger(payload);
      if (res?.data?.success) {
        setRows(res.data.data?.data || []);
        setTotalRecords(res.data.data?.total || 0);
        setSummary({
          lena: res.data.lena?.toFixed(2) || 0,
          dena: res.data.dena?.toFixed(2) || 0,
          balance: res.data.balance || 0,
        });
      } else {
        setRows([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Match Ledger Error:", error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // ---------------- USE EFFECT ----------------
  useEffect(() => {
    fetchMatchLedger();
  }, [page, limit, searchTerm]);

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearAllFilters = () => {
    if (filters.code !== "" || filters.name !== "") {
      setFilters({ code: "", name: "" });
      fetchMatchLedger(1, itemsPerPage, searchTerm, { code: "", name: "" });
    }
  };

  const applyDateFilter = () => {
    if (startDate && endDate && startDate > endDate) {
      alert("Start Date cannot be greater than End Date");
      return;
    }
    setPage(1);
    fetchMatchLedger(); // Fetch data with new date filters
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
    fetchMatchLedger(); // Fetch data without date filters
  };

  // ---------------- PAGINATION ----------------
  const totalPages =
    limit === "all" ? 1 : Math.ceil(totalRecords / Number(limit));

  // ---------------- JSX ----------------
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white mb-0">MATCH LEDGER</h3>

              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>

                <div
                  className="backbutton"
                  onClick={() => navigate(-1)}
                >
                  <BsArrowLeft className="me-1" /> Back
                </div>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="card-body border-bottom">
              <div className="row mb-3">
                <div className="col-md-3">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3 mt-4 gap-2">
                  <button
                    className="refreshbuttonall"
                    onClick={applyDateFilter}
                  >
                    Apply Filters
                  </button>
                  <button
                    className="refreshbuttonall"
                    onClick={clearDateFilter}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>          
            </div>
          )}

          <div className="mt-2">
            <h5 className="totalprofitloss">
              TOTAL:{" "}
              <span
                style={{
                  color: summary.balance >= 0 ? "#28a745" : "#dc3545",
                }}
              >
                {summary.balance?.toFixed(2)}
              </span>
            </h5>
          </div>
              
          <div className="card-body">
            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Event Name</th>
                    <th>Winner</th>
                    <th>CR</th>
                    <th>DR</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-4">
                        <strong>Loading...</strong>
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-4">
                        <strong>No Data Found</strong>
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r._id}>
                        <td>
                          {moment(r.created_at).format("DD-MM-YYYY")}
                        </td>

                        <td>{r.comment}</td>

                        <td>
                          <span className="fw-bold text-primary">
                            {r.winner || "-"}
                          </span>
                        </td>

                        <td className="fw-bold text-success">
                          {r.credit?.toFixed(2) > 0 ? r.credit.toFixed(2) : "-"}
                        </td>

                        <td className="fw-bold text-danger">
                          {r.debit?.toFixed(2) > 0 ? r.debit.toFixed(2) : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalRecords > limit && (
              <div className="d-flex justify-content-end mt-3 gap-2">
                <button
                  className="btn btn-light"
                  disabled={page <= 1}
                  onClick={() => setPage(prev => prev - 1)}
                >
                  <MdOutlineKeyboardArrowLeft size={20} />
                </button>

                <span className="px-3 py-2 border rounded">
                  {page} / {totalPages}
                </span>

                <button
                  className="btn btn-light"
                  disabled={page >= totalPages}
                  onClick={() => setPage(prev => prev + 1)}
                >
                  <MdOutlineKeyboardArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfitAndLoss;