import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyLedgerTxn } from "../../Server/api";
import { FaSearch } from "react-icons/fa";
import Loader from "../../Common/Loader";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

function SuperAgentSettlementReport() {
  const { admin_id } = useParams();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("all");
  const [totals, setTotals] = useState({
    dena: 0,
    lena: 0,
    balance: 0,
  });
  const [username, setUsername] = useState("");

  // Date filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (admin_id) {
      fetchHistory();
    }
  }, [admin_id, paymentType, fromDate, toDate]); // Re-fetch when filters change

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const payload = {
        admin_id: admin_id,
        payment_type: paymentType,
        page: "1",
        limit: "1000",
      };

      // Add date filters if present
      if (fromDate) {
        payload.from_date = fromDate;
      }
      if (toDate) {
        payload.to_date = toDate;
      }

      const response = await getMyLedgerTxn(payload);

      const apiData = response.data;
      const data = apiData?.data?.data || [];

      setHistoryData(data);

      // Totals from API response
      setTotals({
        dena: apiData?.dena || 0,
        lena: apiData?.lena || 0,
        balance: apiData?.balance || 0,
      });

      if (data.length > 0 && data[0].admin_id) {
        setUsername(data[0].admin_id);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
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

  // Handle delete with confirmation
  const handleDelete = (item) => {
    if (
      window.confirm(
        `Are you sure you want to delete this transaction?\n\nDescription: ${item.comment || item.game_name || "-"}\nAmount: ${item.credit > 0 ? item.credit : item.debit}`,
      )
    ) {
      // Delete API call here
      alert("Delete functionality coming soon");
    }
  };

  // Handle payment type change
  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  // Handle search/apply filter
  const handleSearch = () => {
    fetchHistory();
  };

  // Pagination Handlers
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset filters
  const handleReset = () => {
    setFromDate("");
    setToDate("");
    // Fetch will automatically trigger due to useEffect
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="card">
      <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">
          {/* Settlement Report - {username || admin_id} */}
          Settlement Report
        </h3>
        <div className="d-flex gap-2">
          <div className="btn btn-outline-light" onClick={() => navigate(-1)}>
            Back
          </div>
        </div>
      </div>
      <div className="card-body">
        {/* Filters Row */}
        <div className="row mb-3 align-items-end gy-2">
          {/* <div className="col-md-2"> */}
          {/* <label  style={{ fontSize: '13px' }}>PAYMENT TYPE</label> */}
          {/* <select
              className="form-select form-control-sm"
              value={paymentType}
              onChange={handlePaymentTypeChange}
            >
              <option value="all">All</option> */}
          {/* <option value="cr">Payment Diya</option>
              <option value="dr">Payment Liya</option> */}

          {/* <option value="cr">Credit</option>
              <option value="dr">Debit</option>
            </select>
          </div> */}
          <div className="col-6 col-md-2">
            {/* <label  style={{ fontSize: '13px' }}>From</label> */}
            <input
              type="date"
              className="form-control form-control-sm"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            {/* <label  style={{ fontSize: '13px' }}>To</label> */}
            <input
              type="date"
              className="form-control form-control-sm"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4 d-flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleSearch}>
              <FaSearch />
            </button>
            {/* <button
              className="btn btn-secondary btn-sm"
              onClick={handleReset}
              style={{ fontSize: '13px' }}
            >
              Reset
            </button> */}
          </div>
        </div>

        {/* Summary Cards */}
        {/* <div className="row mb-3">
          <div className="col-md-4">
            <div className="card" style={{ backgroundColor: '#dc3545', color: 'white' }}>
              <div className="card-body py-2">
                <h6 className="mb-0" style={{ fontSize: '13px' }}>DENA</h6>
                <h4 className="mb-0">{totals.dena.toFixed(2)}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card" style={{ backgroundColor: '#28a745', color: 'white' }}>
              <div className="card-body py-2">
                <h6 className="mb-0" style={{ fontSize: '13px' }}>LENA</h6>
                <h4 className="mb-0">{totals.lena.toFixed(2)}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card" style={{ backgroundColor: '#17a2b8', color: 'white' }}>
              <div className="card-body py-2">
                <h6 className="mb-0" style={{ fontSize: '13px' }}>BALANCE</h6>
                <h4 className="mb-0">{totals.balance.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div> */}

        {
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-sm">
              <thead>
                <tr>
                  {/* <th>DELETE</th> */}
                  <th>NO</th>
                  <th>DESC</th>
                  <th>Type</th>
                  <th>Collection Name</th>
                  <th>DR</th>
                  <th>CR</th>
                  <th>Balance</th>
                  <th>D/C</th>
                  <th>Note</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <tr>
                      <td colSpan="7">
                        <div className="table_loader py-5 text-center">
                          {" "}
                          <Loader />
                        </div>
                      </td>
                    </tr>
                  </>
                ) : historyData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-5 text-center">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  historyData.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>

                      {/* <td>
                        <button
                          className="btn btn-link text-danger p-0"
                          style={{ fontSize: '16px', textDecoration: 'none' }}
                          onClick={() => handleDelete(item)}
                        >
                          🗑️
                        </button>
                      </td> */}
                      <td>{item.comment || "-"}</td>
                      {/* <td>{item.type || "-"}</td> */}
                       <td>
                        {item.debit > 0 ? "Debit" : item.credit > 0 ? "Credit" : "-"}
                      </td>

                      <td>{item.collection_name || "-"}</td>

                      <td>{item.debit > 0 ? item.debit.toFixed(2) : "-"}</td>
                      <td>{item.credit > 0 ? item.credit.toFixed(2) : "-"}</td>
                      <td>{item.balance ? item.balance.toFixed(2) : "-"}</td>
                      {/* <td>
                        {item.pay_type == "diya"
                          ? "CR"
                          : item.pay_type == "liya"
                            ? "DR"
                            : "-"}
                      </td> */}
                      <td>
                        {item.debit > 0 ? "D" : item.credit > 0 ? "C" : "-"}
                      </td>
                      <td>{item.remarks || "-"}</td>
                      <td>{formatDate(item.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        }

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
  );
}
export default SuperAgentSettlementReport;
