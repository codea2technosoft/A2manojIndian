import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { getStatementPL } from "../../Server/api";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner, Form, Button } from "react-bootstrap";
import Loader from "../../Common/Loader";

const ProfitLoss = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminId } = useParams();

  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sport, setSport] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);
  const [total, setTotal] = useState({
    credit: 0,
    debit: 0,
    commissionPlus: 0,
    commissionMinus: 0,
    netBalance: 0,
  });

  useEffect(() => {
    fetchPLStatementData(currentPage);
  }, [adminId, currentPage, searchTerm, sport, fromDate, toDate]);

  const calculateTotals = (data) => {
    let credit = 0;
    let debit = 0;

    data.forEach((item) => {
      if (item.type === "credit") credit += Number(item.amount || 0);
      if (item.type === "debit") debit += Number(item.amount || 0);
    });
    setTotal({
      credit,
      debit,
      commissionPlus: 0,
      commissionMinus: 0,
      netBalance: data.length
        ? Number(data[data.length - 1].after_balance_from || 0)
        : 0,
    });
  };

  const fetchPLStatementData = async (page) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");

      // Call getStatementPL API with filters
      const res = await getStatementPL({
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
        search: searchTerm,
        sport: sport,
        from_date: fromDate,
        to_date: toDate,
      });

      const response = res.data;
      if (response.success) {
        const data = response.data || [];
        setStatementData(data);
        setTotalPages(response.pagination?.total_pages || 1);
        setTotalRecords(response.pagination?.total_records || 0);
        calculateTotals(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch P&L statement data");
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (selectedMode) => {
    if (selectedMode === "ALL") {
      if (adminId) {
        navigate(`/getAllstatment/${adminId}`);
      } else {
        navigate("/getAllstatment");
      }
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
    fetchPLStatementData(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSport("ALL");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || sport !== "ALL" || fromDate || toDate;

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header flex-wrap-mobile bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
          <h5 className="card-title mb-0">Profit Loss</h5>

          <div className="d-flex align-items-center gap-2">
            {/* <select
                className="form-select w-auto"
                onChange={(e) => handleModeChange(e.target.value)}
                defaultValue="PL"
              >
                <option value="ALL">All Statement</option>
                <option value="PL">P & L Statement</option>
              </select>*/}

            {/* <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-light"
            >
              Back
            </button> */}
          </div>
        </div>

        <div className="card-body">
          <div className="row mb-3 align-items-center gy-2">
            {/* <div className="col-md-2">
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
              </div> */}

            {/* From Date */}
            <div className="col-md-2">
              <Form.Control
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            {/* To Date */}
            <div className="col-md-2">
              <Form.Control
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Search Button */}
            <div className="col-md-1">
              <Button onClick={handleSearch}>
                <FiSearch />
              </Button>
            </div>
          </div>

          {/* Search Term Display */}
          {searchTerm && (
            <div className="mb-3">
              <small className="text-muted">
                Search results for: <strong>"{searchTerm}"</strong>
              </small>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>DATE</th>
                  <th>TYPE</th>
                  <th>REMARK</th>
                  <th className="text-end">OLD BAL</th>
                  <th className="text-end text-success">WIN</th>
                  <th className="text-end text-danger">LOSS</th>
                  <th className="text-end">BALANCE</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colspan="10">
                      <div className="text-center py-5 mt-1">
                        <p>Loading P&L statement data...</p>
                        <Loader className="mt-2" />
                      </div>
                    </td>
                  </tr>
                ) : statementData.length === 0 ? (
                  <tr>
                    <td colspan="10">
                      <h5 className="fs-6 text-dark py-5 text-center">
                        No Data Found
                      </h5>
                    </td>
                  </tr>
                ) : (
                  <>
                    {statementData.map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.created_at).toLocaleString()}</td>
                        <td>{item.tr_type}</td>
                        <td>{item.remark}</td>
                        <td className="text-end">
                          {formatNumber(item.before_balance_from)}
                        </td>
                        <td className="text-end text-success">
                          {item.win_loss === "WIN"
                            ? formatNumber(item.amount)
                            : "0.00"}
                        </td>
                        <td className="text-end text-danger">
                          {item.win_loss === "LOSS"
                            ? formatNumber(item.amount)
                            : "0.00"}
                        </td>
                        <td className="text-end">
                          {formatNumber(item.wallet_amount)}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>

            {totalPages > 0 && (
              <div className="d-flex justify-content-center align-items-center mt-4">
                {/* <div className="sohwingallentries">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, totalRecords)} of{" "}
                {totalRecords} entries
              </div> */}

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

export default ProfitLoss;
