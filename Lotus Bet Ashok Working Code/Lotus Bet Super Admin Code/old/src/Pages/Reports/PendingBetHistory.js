import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getChipStatementAll } from "../../Server/api";

const ChipStatement = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();

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
    adminId,
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

      const response = await getChipStatementAll({
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
        search: searchTerm,
        sport: sport,
        from_date: fromDate,
        to_date: toDate,
        transaction_type: transactionType,
      });

      console.log("Chip Statement Response:", response);

      if (response.data && response.data.success) {
        const data = response.data.data || [];
        setStatementData(data);
        setTotalPages(response.data.pagination?.total_pages || 1);
        setCurrentPage(response.data.pagination?.current_page || 1);
        setTotalRecords(response.data.pagination?.total_records || 0);
        calculateTotals(data);
      } else {
        const errorMsg =
          response.data?.message || "Failed to fetch chip statement";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error fetching chip statement:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch chip statement";
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
          <h5 className="card-title mb-0">Pending Bets</h5>

          {/* <div className="d-flex align-items-center">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-light"
            >
              Back
            </button>
          </div> */}
        </div>

        <div className="card-body">
          {/* Filter Section */}
          {/* <div className="row mb-3 align-items-center">
              
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
            </div> */}

          {/* Search Term Display */}
          {searchTerm && (
            <div className="mb-3">
              <small className="text-muted">
                Search results for: <strong>"{searchTerm}"</strong>
              </small>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p>Loading chip statement data...</p>
            </div>
          ) : statementData.length === 0 ? (
            <div className="text-center py-5">
              <h5>NO DATA</h5>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>NO</th>
                      <th>DATE</th>
                      <th>DESC</th>
                      <th>TYPE</th>
                      <th className="text-end">COMM IN</th>
                      <th className="text-end">COMM OUT</th>
                      <th className="text-end">AMOUNT</th>
                      <th className="text-end">TOTAL</th>
                      <th>D/C</th>
                      <th className="text-end">BALANCE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {statementData.map((item, index) => {
                      const serialNo = (currentPage - 1) * limit + index + 1;
                      const isCredit =
                        item.type === "credit" || item.dc === "Credit";

                      return (
                        <tr key={item._id || index}>
                          <td>{serialNo}</td>
                          <td>
                            {new Date(
                              item.created_at || item.date,
                            ).toLocaleString()}
                          </td>
                          <td>{item.remark || item.desc || "N/A"}</td>
                          <td>{item.value_update_by || "N/A"}</td>
                          <td className="text-end">
                            {formatNumber(item.comm_in || 0)}
                          </td>
                          <td className="text-end">
                            {formatNumber(item.comm_out || 0)}
                          </td>
                          <td className="text-end">
                            {formatNumber(item.amount || 0)}
                          </td>
                          <td className="text-end">
                            {formatNumber(item.before_balance_from || 0)}
                          </td>
                          <td>
                           {item.tr_type}
                          </td>
                          <td className="text-end">
                            {formatNumber(item.after_balance_from || 0)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ChipStatement;
