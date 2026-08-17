import React, { useEffect, useState } from "react";
import { MdFilterListAlt } from "react-icons/md";
import { getadminwithdrawlist } from "../../Server/api";

const AdminDepositList = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalDepositAmount, setTotalDepositAmount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mobileFilter, setMobileFilter] = useState(""); // New state for mobile filter
  const [activeFilters, setActiveFilters] = useState({ from_date: "", to_date: "", mobile: "" });

  const limit = 50;

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        limit,
        from_date: activeFilters.from_date,
        to_date: activeFilters.to_date,
        mobile: activeFilters.mobile, // Include mobile in API payload
      };
      const response = await getadminwithdrawlist(payload);
      if (response?.data?.success) {
        setDeposits(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalRecords(response.data.pagination?.total || 0);
        setTotalDepositAmount(response.data.summary?.totalDepositAmount || 0);
      } else {
        setDeposits([]);
        setTotalPages(1);
        setTotalRecords(0);
        setTotalDepositAmount(0);
      }
    } catch (error) {
      console.error("Error fetching deposit list:", error);
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [currentPage, activeFilters]);

  const applyFilters = () => {
    setCurrentPage(1);
    setActiveFilters({
      from_date: startDate,
      to_date: endDate,
      mobile: mobileFilter,
    });
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setMobileFilter("");
    setCurrentPage(1);
    setActiveFilters({ from_date: "", to_date: "", mobile: "" });
    setFilterOpen(false);
  };

  const goToPage = (page) => setCurrentPage(page);
  const goPrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    let date;

    // ISO format (contains T and Z)
    if (dateString.includes('T') && dateString.includes('Z')) {
      date = new Date(dateString);
    }
    // Custom format: DD-MM-YYYY HH:MM:SS
    else if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
      const [day, month, yearTime] = dateString.split('-');
      const [year, time] = yearTime.split(' ');
      const [hour, minute, second] = time.split(':');

      date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
    } else {
      date = new Date(dateString);
    }

    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleString("en-IN", {
        hour12: true,   // 👈 yahi change hai
      });
  };
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0.00";
    return Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <section>
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title text-white">Admin Withdrawal List</h3>
            <button className="btn btn-light" onClick={() => setFilterOpen(!filterOpen)}>
              <MdFilterListAlt /> Filter
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Filter Panel */}
          {filterOpen && (
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="d-flex flex-wrap gap-2 align-items-end">
                  <div className="flex-grow-1" style={{ minWidth: "150px" }}>
                    <label>Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: "150px" }}>
                    <label>End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: "150px" }}>
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter mobile number"
                      value={mobileFilter}
                      onChange={(e) => setMobileFilter(e.target.value)}
                    />
                  </div>
                  <div>
                    <button className="btn btn-primary me-2" onClick={applyFilters}>
                      Apply
                    </button>
                    <button className="btn btn-secondary" onClick={resetFilters}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          {!loading && deposits.length > 0 && (
            <div className="alert alert-info mb-3">
              <strong>Total Withdrawal (₹):</strong> {formatCurrency(totalDepositAmount)} &nbsp;|&nbsp;
              <strong>Total Records:</strong> {totalRecords}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <p>Loading Withdrawal...</p>
          ) : (
            <>
              {/* Table */}
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Date & Time</th>
                      <th>Mobile</th>
                      {/* <th>Account Holder</th> */}
                      <th>Opening Balance</th>
                      <th>Closing Balance</th>
                      <th>Amount (₹)</th>
                      {/* <th>Bonus (₹)</th> */}
                      <th>Status</th>
                      <th>Remark</th>
                      {/* <th>Processed By</th> */}
                      {/* <th>Notes</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {deposits.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No Withdrawal found
                        </td>
                      </tr>
                    ) : (
                      deposits.map((deposit, idx) => (
                        <tr key={deposit._id}>
                          <td>{(currentPage - 1) * limit + idx + 1}</td>
                          <td>{formatDateTime(deposit.date_time || deposit.createdAt)}</td>
                          <td>
                            {deposit.mobile || "-"}
                          </td>
                          {/* <td>{deposit.accountHolderName || "-"}</td> */}
                          <td>{Number(deposit.openingBalance || 0).toFixed(2)}</td>
                          <td>{Number(deposit.closingBalance || 0).toFixed(2)}</td>
                          <td className="text-end">{formatCurrency(deposit.amount)}</td>
                          {/* <td className="text-end">{formatCurrency(deposit.bonus)}</td> */}
                          <td>
                            <span
                              className={`badge ${deposit.status === "Success" ? "bg-success" : "bg-danger"
                                }`}
                            >
                              {deposit.status}
                            </span>
                          </td>
                          <td>{deposit.remark || "-"}</td>

                          {/* <td>{deposit.processedBy || "-"}</td> */}
                          {/* <td>{deposit.notes || "-"}</td> */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="card-footer">
                  <div className="d-flex justify-content-end">
                    <nav>
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={goPrev} disabled={currentPage === 1}>
                            &laquo;
                          </button>
                        </li>
                        {[...Array(totalPages).keys()].map((num) => (
                          <li key={num + 1} className={`page-item ${currentPage === num + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => goToPage(num + 1)}>
                              {num + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={goNext} disabled={currentPage === totalPages}>
                            &raquo;
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDepositList;