
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCurrencyRupee } from "react-icons/md";
import moment from "moment";
import { FiSearch } from "react-icons/fi";
import { getMyLedger } from "../../Server/api";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

function MyLedger() {
  const navigate = useNavigate();
  const admin_id = localStorage.getItem("admin_id");
  // ---------------- STATES ----------------
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    lena: 0,
    dena: 0,
    balance: 0,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [showFilters, setShowFilters] = useState(false);


  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totalRecords, setTotalRecords] = useState(0);


  // ---------------- API CALL ----------------
  const fetchLedger = async () => {
    try {
      setLoading(true);

      const payload = {
        admin_id,
        page,
        limit,
        search: searchTerm,
        start_date: startDate,
        end_date: endDate,
      };
      const res = await getMyLedger(payload);

      if (res?.data?.success) {
        setRows(res.data.data?.data || []);
        setTotalRecords(res.data.data.total || 0);
        const safeNumber = (val) => Number(val) ? Number(val) : 0;
        setSummary({
          lena: safeNumber(res.data.lena),
          dena: safeNumber(res.data.dena),
          balance: safeNumber(res.data.balance),
        });
      } else {
        setRows([]);
      }
    } catch (err) {
      console.error("Ledger Error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLedger();
  }, [page, limit, searchTerm, startDate, endDate]);
  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
    setPage(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };


  // ---------------- DATE FILTER ----------------
  const applyDateFilter = () => {
    if (startDate && endDate && startDate > endDate) {
      alert("Start date cannot be greater than end date");
      return;
    }
    setPage(1);
    fetchLedger();
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
    fetchLedger();
  };

  const totalPages = Math.ceil(totalRecords / limit);


  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 2;

    let start = page;
    let end = page + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };


  // const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-color-black d-flex justify-content-between align-items-center">
            <h3 className="text-white mb-0">MY LEDGER</h3>

            <div className="d-flex gap-2">

              {/* FILTER TOGGLE BUTTON */}
              {/* <button
                className="btn btn-success btn-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button> */}

              <div className="btn btn-success btn-sm" onClick={() => navigate(-1)}>
                Back
              </div>
            </div>
          </div>
          {/* {showFilters && (
            <div className="row mt-4 mb-3">

              <div className="col-md-3">
                <label>Search</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <button className="btn btn-primary" onClick={handleSearch}>
                    <FiSearch />
                  </button>
                  {searchTerm && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

           
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

              <div className="col-md-3 gap-2 d-flex align-items-end">
                <button className="importbutton" onClick={applyDateFilter}>
                  Apply
                </button>
                <button className="importbutton" onClick={clearDateFilter}>
                  Clear
                </button>
              </div>
            </div>
          )} */}
          <div className="card-body">
            <div className="row text-center">
              <div className="col-md-4 col-4 text-success">
                <div className="myLadger">
                  <h6>LENA </h6>
                  <MdCurrencyRupee /> {summary.lena.toFixed(2)}
                </div>
              </div>
              <div className="col-md-4 col-4 text-danger">
                <div className="myLadger">
                  <h6> DENA</h6>
                  <MdCurrencyRupee /> {summary.dena.toFixed(2)}
                </div>
              </div>
              <div className="col-md-4 col-4">
                <div className="myLadger">
                  <h6>BALANCE</h6>
                  <span
                    className={
                      summary.balance >= 0 ? "text-success" : "text-danger"
                    }
                  >
                    <MdCurrencyRupee /> {Math.abs(summary.balance).toFixed(2)}{" "}
                    {summary.balance < 0 && "DENA"}
                  </span>
                </div>
              </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th>DATE</th>
                    <th>DR</th>
                    <th>CR</th>
                    <th>BALANCE</th>
                    <th>PAYMENT TYPE</th>
                    <th>REMARK</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">Loading...</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan="5">No Data</td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r._id}>
                        <td>
                          {new Date(r.created_at).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                        <td className="text-danger fw-bold">
                          {r.debit > 0 ? r.debit.toFixed(2) : "-"}
                        </td>
                        <td className="text-success fw-bold">
                          {r.credit > 0 ? r.credit.toFixed(2) : "-"}
                        </td>
                        <td
                          className={
                            r.balance >= 0
                              ? "text-success fw-bold"
                              : "text-danger fw-bold"
                          }
                        >
                          {r.balance.toFixed(2)}
                        </td>
                        <td>{r.comment}</td>
                        <td>{r.remarks}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalRecords > limit && (
              <div className="paginationall d-flex justify-content-end align-items-center gap-1 mt-4">

                {/* PREV BUTTON */}
                <button
                  className=""
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>

                {/* PAGE NUMBERS */}
                <div className="d-flex gap-1">
                  {getPageNumbers().map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`paginationnumber ${page === num ? "active" : ""}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* NEXT BUTTON */}
                <button
                  className=""
                  disabled={page >= totalPages || rows.length === 0}
                  onClick={() => setPage(page + 1)}
                >
                  <MdOutlineKeyboardArrowRight />
                </button>

              </div>
            )}



          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLedger;
