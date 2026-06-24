import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { getStatementAll } from "../../Server/api";
import { FiSearch } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Table, Spinner, Form, Button } from "react-bootstrap";

const AccountStatement = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();

  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sport, setSport] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactionType, setTransactionType] = useState("ALL"); // New filter

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
    fetchStatementData(currentPage);
  }, [
    adminId,
    currentPage,
    searchTerm,
    sport,
    fromDate,
    toDate,
    transactionType,
  ]);

  const fetchStatementData = async (page = currentPage) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");
      const res = await getStatementAll({
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
        search: searchTerm,
        sport: sport,
        from_date: fromDate,
        to_date: toDate,
        transaction_type: transactionType, // New parameter
      });

      const response = res.data;
      if (response.success) {
        const data = response.data || [];

        setStatementData(data);
        setTotalPages(response.pagination?.total_pages || 1);
        setCurrentPage(response.pagination?.current_page || 1);
        setTotalRecords(response.pagination?.total_records || 0);
        calculateTotals(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch statement data");
    } finally {
      setLoading(false);
    }
  };

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

      // adjust start when near end
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
    fetchStatementData(1);
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
          <h5 className="card-title mb-0">Transaction Statement</h5>

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
          {/* Filter Section */}
          <div className="row mb-3 align-items-center">
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

            {/* Transaction Type - Second */}
            {/* <div className="col-md-2">
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

            {/* Search */}
            <div className="col-md-1">
              <Button onClick={handleSearch}>
                <FiSearch />
              </Button>
            </div>

            {/* Clear Filters */}
            {/* {hasActiveFilters && (
                <div className="col-md-1">
                  <Button variant="secondary" onClick={handleClearSearch}>
                    Clear
                  </Button>
                </div>
              )} */}
          </div>

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
              <p>Loading statement data...</p>
            </div>
          ) : statementData.length === 0 ? (
            <div className="text-center py-5">
              <h5>NO DATA</h5>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>DATE</th>
                      <th>DESCRIPTION</th>
                      <th className="text-end">OLD BAL</th>
                      <th className="text-end">CR</th>
                      <th className="text-end">DR</th>
                      <th className="text-end">BALANCE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {statementData.map((item, index) => (
                      <tr key={index}>
                        {/* Date */}
                        <td>{new Date(item.created_at).toLocaleString()}</td>
                        <td>{item.remark}</td>
                        <td className="text-end">
                          {formatNumber(item.before_balance_from)}
                        </td>
                        <td className="text-end text-success">
                          {item.type === "deposit"
                            ? Number(item.amount).toFixed(2)
                            : "0"}
                        </td>

                        <td className="text-end text-danger">
                          {item.type === "withdraw"
                            ? Number(item.amount).toFixed(2)
                            : "0"}
                        </td>
                        <td className="text-end fw-bold">
                          {formatNumber(item.after_balance_from)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="sohwingallentries">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, totalRecords)} of{" "}
                    {totalRecords} entries
                  </div>

                  <div className="paginationall d-flex align-items-center gap-1">
                    <button disabled={currentPage === 1} onClick={handlePrev}>
                      <MdOutlineKeyboardArrowLeft />
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
                      <MdOutlineKeyboardArrowRight />
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

export default AccountStatement;
