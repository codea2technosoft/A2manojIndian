import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from "react-icons/md";
import { getProfitLossPL } from "../../Server/api";
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
  const [eventId, setEventId] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  // Grand total and page total from API
  const [grandTotal, setGrandTotal] = useState(null);
  const [pageTotal, setPageTotal] = useState(null);

  useEffect(() => {
    fetchPLStatementData(currentPage);
  }, [adminId, currentPage]);

  const fetchPLStatementData = async (page) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");

      // Build payload - send only what's needed
      const payload = {
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
      };

      // Add filters only if they have values
      if (sport && sport !== "ALL") payload.sport = sport; // Send sport as text
      if (fromDate) payload.from_date = fromDate;
      if (toDate) payload.to_date = toDate;
      if (eventId) payload.event_id = eventId;
      if (searchTerm) payload.search = searchTerm;

      console.log("Sending payload:", payload);

      const res = await getProfitLossPL(payload);

      const response = res.data;
      if (response.success) {
        const data = response.data || [];
        setStatementData(data);
        setTotalPages(response.pagination?.total_pages || 1);
        setTotalRecords(response.pagination?.total_records || 0);

        // Store grand total and page total
        if (response.grand_total) {
          setGrandTotal(response.grand_total);
        }
        if (response.page_total) {
          setPageTotal(response.page_total);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch P&L statement data");
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
    fetchPLStatementData(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSport("ALL");
    setFromDate("");
    setToDate("");
    setEventId("");
    setCurrentPage(1);
  };



  const handleSummaryClick = (eventId) => {
    const admin_id =  localStorage.getItem("admin_id") || "admin";
    const role =  parseInt(localStorage.getItem("role")) || 1;
  const payload = {
    event_id: eventId,
    admin_id: admin_id,
    role: role
  };
  
  console.log("✅ Navigating with payload:", payload);
  
  navigate(`/reports/profit-loss-summary-event/${eventId}`, {
    state: { 
      payload: payload
    }
  });
};

  const handleDetailClick = (eventId) => {
    navigate(`/reports/profit-loss-detail/${eventId}`);
  };

  const hasActiveFilters = searchTerm || sport !== "ALL" || fromDate || toDate || eventId;

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        <div className="card-header flex-wrap-mobile bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
          <h5 className="card-title mb-0">Profit Loss</h5>
        </div>

        <div className="card-body">
          <div className="row mb-3 align-items-center gy-2">
            <div className="col-md-2">
              <Form.Select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
              >
                <option value="ALL">All Sports</option>
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

            {/* Search Input */}
            {/* <div className="col-md-1">
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}

            {/* Search Button */}
            <div className="col-md-1">
              <Button onClick={handleSearch} className="w-100">
                <FiSearch />
              </Button>
            </div>

            {/* Clear Button
            <div className="col-md-1">
              <Button variant="secondary" onClick={handleClearSearch} className="w-100">
                Clear
              </Button>
            </div> */}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-3">
              <small className="text-muted">
                Active filters:
                {sport !== "ALL" && <span className="ms-2">🏏 Sport: <strong>{sport}</strong></span>}
                {eventId && <span className="ms-2">🎯 Event ID: <strong>{eventId}</strong></span>}
                {fromDate && <span className="ms-2">📅 From: <strong>{fromDate}</strong></span>}
                {toDate && <span className="ms-2">📅 To: <strong>{toDate}</strong></span>}
                {searchTerm && <span className="ms-2">🔍 <strong>"{searchTerm}"</strong></span>}
              </small>
            </div>
          )}

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>SR NO</th>
                  <th>EVENT ID</th>
                  <th>SPORT</th>
                  <th>EVENT</th>
                  <th className="text-end">COMM IN</th>
                  <th className="text-end">COMM OUT</th>
                  <th className="text-end">AMOUNT</th>
                  {/* <th className="text-end">TOTAL</th> */}
                  <th className="text-end">Info</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8">
                      <div className="text-center py-5 mt-1">
                        <p>Loading P&L statement data...</p>
                        <Loader className="mt-2" />
                      </div>
                    </td>
                  </tr>
                ) : statementData.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <h5 className="fs-6 text-dark py-5 text-center">
                        No Data Found
                      </h5>
                    </td>
                  </tr>
                ) : (
                  <>
                    {statementData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.sr_no}</td>
                        <td>{item.event_id}</td>
                        <td>{item.sport}</td>
                        <td>{item.event}</td>
                        <td className="text-end">
                          {formatNumber(item.comm_in)}
                        </td>
                        <td className="text-end">
                          {formatNumber(item.comm_out)}
                        </td>
                        <td className="text-end">
                          {formatNumber(item.amount)}
                        </td>
                        {/* <td className="text-end">
                          {formatNumber(item.total)}
                        </td> */}
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            {/* S Button - Summary */}
                            <button
                              className="btn gradient-4 btn-rounded"
                              onClick={() => handleSummaryClick(item.event_id)}
                              title="View Summary"
                            >
                              S
                            </button>
                            {/* D Button - Detail */}
                            <button
                              className="buttoncommon gradient-2"
                              onClick={() => handleDetailClick(item.event_id)}
                              title="View Detail"
                              handleSummaryClick
                            >
                              D
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Page Total Row */}
                    {/* {pageTotal && (
                      <tr className="table-warning fw-bold">
                        <td colSpan="4" className="text-end">Page Total</td>
                        <td className="text-end">{formatNumber(pageTotal.comm_in)}</td>
                        <td className="text-end">{formatNumber(pageTotal.comm_out)}</td>
                        <td className="text-end">{formatNumber(pageTotal.amount)}</td>
                        <td className="text-end">{formatNumber(pageTotal.total)}</td>
                      </tr>
                    )} */}
                  </>
                )}
              </tbody>
              {/* Grand Total Footer */}
              {/* {grandTotal && !loading && statementData.length > 0 && (
                <tfoot className="table-dark fw-bold">
                  <tr>
                    <td colSpan="4" className="text-end">Grand Total</td>
                    <td className="text-end">{formatNumber(grandTotal.comm_in)}</td>
                    <td className="text-end">{formatNumber(grandTotal.comm_out)}</td>
                    <td className="text-end">{formatNumber(grandTotal.amount)}</td>
                    <td className="text-end">{formatNumber(grandTotal.total)}</td>
                  </tr>
                </tfoot>
              )} */}
            </table>

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
      </div>
    </>
  );
};

export default ProfitLoss;