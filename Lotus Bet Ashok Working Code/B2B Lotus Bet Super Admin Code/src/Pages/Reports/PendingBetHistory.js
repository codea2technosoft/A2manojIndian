import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button } from "react-bootstrap";
import { getEventBetsPendingAll } from "../../Server/api";
import Loader from "../../Common/Loader";

const PendingBets = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const location = useLocation();
  const navigationPayload = location.state?.payload || {};

  const [loading, setLoading] = useState(true);
  const [betsData, setBetsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sport, setSport] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [betType, setBetType] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  useEffect(() => {
    fetchPendingBets(currentPage);
  }, [currentPage, searchTerm, sport, fromDate, toDate, betType]);

  const fetchPendingBets = async (page = currentPage) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");

       // ✅ URL se admin_id lo
    const getAdminIdFromURL = () => {
      const path = window.location.pathname;
      const parts = path.split('/');
      return parts[parts.length - 1];
    };
    const admin_id_from_url = getAdminIdFromURL();


      const payload = {
       // admin_id: navigationPayload.admin_id || loggedInAdminId || adminId,
       admin_id: admin_id_from_url,
        role:
          navigationPayload.role || parseInt(localStorage.getItem("role")) || 1,
        page: page,
        limit: limit,
        search: searchTerm,
        sport: sport,
        from_date: fromDate,
        to_date: toDate,
        bet_type: betType,
      };

      console.log("Sending Pending Bets Payload:", payload);

      const response = await getEventBetsPendingAll(payload);
      console.log("Pending Bets Response:", response);

      if (response.data && response.data.status_code === 1) {
        const data = response.data.data || [];
        setBetsData(data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setCurrentPage(response.data.pagination?.currentPage || 1);
        setTotalRecords(response.data.pagination?.totalRecords || 0);
      } else {
        const errorMsg =
          response.data?.message || "Failed to fetch pending bets";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching pending bets:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch pending bets";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => Number(num || 0).toFixed(2);

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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPendingBets(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSport("ALL");
    setFromDate("");
    setToDate("");
    setBetType("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm || sport !== "ALL" || fromDate || toDate || betType !== "ALL";

  const getSportName = (sportId) => {
    const sports = {
      1: "Football",
      2: "Cricket",
      3: "Tennis",
      4: "Horse Racing",
      5: "Greyhound Racing",
      6: "Kabaddi",
      7: "Casino",
      8: "Politics",
    };
    return sports[sportId] || "N/A";
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header  bg-primary-yellow d-flex justify-content-between align-items-center gap-2">
          <h5 className="card-title mb-0">Pending Bets</h5>
          <div className="d-flex align-items-center">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-light"
            >
              Back
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* <div className="row mb-3 align-items-center">
            <div className="col-md-2">
              <Form.Control
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Form.Select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
              >
                <option value="ALL">ALL</option>
                <option value="1">Football</option>
                <option value="2">Cricket</option>
                <option value="3">Tennis</option>
                <option value="4">Horse Racing</option>
                <option value="5">Greyhound Racing</option>
                <option value="6">Kabaddi</option>
                <option value="7">Casino</option>
                <option value="8">Politics</option>
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Form.Select
                value={betType}
                onChange={(e) => setBetType(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="match_odds">Match Odds</option>
                <option value="bookmaker">Bookmaker</option>
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-md-1">
              <Button onClick={handleSearch}>
                <FiSearch />
              </Button>
            </div>
            {hasActiveFilters && (
              <div className="col-md-1">
                <Button variant="secondary" onClick={handleClearSearch}>
                  Clear
                </Button>
              </div>
            )}
          </div> */}

          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>NO</th>
                  <th>USERNAME</th>
                  <th>EVENT ID</th>
                  <th>EVENT NAME</th>
                  <th>MARKET TYPE</th>
                  <th>SELECTION</th>
                  <th>TYPE</th>
                  <th>ODDS REQ.</th>
                  <th className="text-end">STAKE</th>
                  <th>Total</th>
                  <th>PLACE TIME</th>
                  <th>MATCHED TIME</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="12" className="table_loader">
                      <div className="text-center py-5">
                        {/* <p>Loading pending bets...</p> */}
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : betsData.length === 0 ? (
                  <tr>
                    <td colSpan="12">
                      <h5 className="fs-6 text-dark py-5 text-center">
                        No Pending Bets Found
                      </h5>
                    </td>
                  </tr>
                ) : (
                  <>
                    {betsData.map((item, index) => {
                      const serialNo = (currentPage - 1) * limit + index + 1;
                      return (
                        <tr key={item._id || index}>
                          <td>{serialNo}</td>
                          <td>{item.username || "-"}</td>
                          <td>{item.event_id}</td>
                          <td>{item.event_name || "-"}</td>
                          <td>{item.bet_type || "N/A"}</td>
                          <td>{item.team || "N/A"}</td>
                          <td>{item.bet_on || "N/A"}</td>
                          <td>{item.odd || 0}</td>
                          <td className="text-end">
                            {item.stake || 0}
                           
                          </td>
                          <td> {item.total || 0}</td>
                          <td>{new Date(item.created_at).toLocaleString()}</td>
                          <td>
                            {item.matched_status === "matched"
                              ? new Date(item.created_at).toLocaleString()
                              : "Pending"}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {/* PAGINATION */}
          {totalPages > 0 && (
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
    </>
  );
};

export default PendingBets;
