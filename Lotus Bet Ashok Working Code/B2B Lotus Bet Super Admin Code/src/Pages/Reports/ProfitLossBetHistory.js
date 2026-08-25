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
import { Spinner, Form, Button } from "react-bootstrap";
import { getProfitLossFancySettled } from "../../Server/api";
import Loader from "../../Common/Loader";

const ProfitLossBetHistory = () => {
  const navigate = useNavigate();
  const { marketId } = useParams();
  const location = useLocation();
  const navigationPayload = location.state?.payload || {};
  console.log("Received Payload in Bet History:", navigationPayload);

  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sport, setSport] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactionType, setTransactionType] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);
  const marketName = location.state?.marketName || marketId;

  const [total, setTotal] = useState({
    commIn: 0,
    commOut: 0,
    amount: 0,
    totalAmount: 0,
    balance: 0,
  });

  useEffect(() => {
    fetchChipStatementData(currentPage);
  }, [
    marketId,
    currentPage,
    searchTerm,
    sport,
    fromDate,
    toDate,
    transactionType,
  ]);

  const fetchChipStatementData = async (page = currentPage) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");
      const payload = {
        admin_id: navigationPayload.admin_id || loggedInAdminId,
        fancy_id: navigationPayload.market_id || marketId,
        bet_type: navigationPayload.bet_type, // Added bet_type
        event_id: navigationPayload.event_id,
        role:
          navigationPayload.role || parseInt(localStorage.getItem("role")) || 1,
        page: page,
        limit: limit,
        search: searchTerm,
        sport: sport,
        from_date: fromDate,
        to_date: toDate,
        transaction_type: transactionType,
      };

      console.log("Sending Bet History Payload:", payload);

      const response = await getProfitLossFancySettled(payload);
      if (response.data && response.data.success) {
        const data = response.data.data || [];
        setStatementData(data);
        setTotalPages(response.data.pagination?.total_pages || 1);
        setCurrentPage(response.data.pagination?.current_page || 1);
        setTotalRecords(response.data.pagination?.total_records || 0);
        calculateTotals(data);
      } else {
        const errorMsg =
          response.data?.message || "Failed to fetch bet history";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching bet history:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch bet history";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    let commIn = 0;
    let commOut = 0;
    let amount = 0;
    let totalAmount = 0;
    let balance = 0;

    data.forEach((item) => {
      commIn += Number(item.comm_in || 0);
      commOut += Number(item.comm_out || 0);
      amount += Number(item.amount || 0);
      totalAmount += Number(item.total_amount || 0);
      balance = Number(item.balance || 0);
    });

    setTotal({
      commIn,
      commOut,
      amount,
      totalAmount,
      balance: data.length > 0 ? Number(data[data.length - 1].balance || 0) : 0,
    });
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
    fetchChipStatementData(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSport("ALL");
    setFromDate("");
    setToDate("");
    setTransactionType("ALL");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm ||
    sport !== "ALL" ||
    fromDate ||
    toDate ||
    transactionType !== "ALL";

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header flex-wrap-mobile bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
          <h5 className="card-title mb-0">
            {/* Bet History - Market ID: {marketId} */}
            Bet History - {marketName || `Market ID: ${marketId}`}
          </h5>
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
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Tennis">Tennis</option>
                <option value="Horse Racing">Horse Racing</option>
                <option value="Greyhound Racing">Greyhound Racing</option>
                <option value="Kabaddi">Kabaddi</option>
                <option value="Politics">Politics</option>
                <option value="Casino">Casino</option>
              </Form.Select>
            </div>
            <div className="col-md-2">
              <Form.Select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="PROFIT_LOSS">Profit and Loss</option>
                <option value="FREE_CHIPS">Free Chips</option>
                <option value="CASH">Cash</option>
                <option value="CASH_ZERO">Cash(0)</option>
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
          </div>
          {searchTerm && (
            <div className="mb-3">
              <small className="text-muted">
                Search results for: <strong>"{searchTerm}"</strong>
              </small>
            </div>
          )} */}

          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>NO</th>
                  <th>USERNAME</th>
                  <th>RUNNER</th>
                  <th>RATE</th>
                  <th>STAKE</th>
                  <th>COMM IN</th>
                  <th>COMM OUT</th>
                  <th>TOTAL</th>
                  <th>DATE/TIME</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="table_loader">
                      <div className="text-center py-5">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : statementData.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      <h5 className="fs-6 text-dark py-5 text-center">
                        No Data Found
                      </h5>
                    </td>
                  </tr>
                ) : (
                  <>
                    {statementData.map((item, index) => {
                      const serialNo = (currentPage - 1) * limit + index + 1;
                      return (
                        <tr key={item._id || index}>
                          <td>{serialNo}</td>
                          <td>{item.username || "N/A"}</td>
                          <td>{item.team_name || "N/A"}</td>
                          <td>{item.odd || "0.00"} / {item.amount.toFixed(2)}</td>
                          <td>{formatNumber(item.stake)}</td>
                          <td>{formatNumber(item.comm_in)}</td>
                          <td>{formatNumber(item.comm_out)}</td>
                          <td
                            className={`fw-bold ${item.total >= 0 ? "text-success" : "text-danger"}`}
                          >
                            {formatNumber(item.win || 0)}
                          </td>
                          <td>{new Date(item.created_at).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 0 && (
            <div className="d-flex justify-content-center align-items-center mb-2">
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

export default ProfitLossBetHistory;
