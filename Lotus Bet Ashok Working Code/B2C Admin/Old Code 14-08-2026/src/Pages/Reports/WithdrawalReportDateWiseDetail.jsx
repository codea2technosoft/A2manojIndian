import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { withdrawRequestDetailsByDate } from "../../Server/api";
import { MdFilterListAlt } from "react-icons/md";

const WithdrawalDateWiseDetailPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fillter, setFillter] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const limit = 50;
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });
  useEffect(() => {
    fetchDepositDetails();
  }, [currentPage, filters]);

  const fetchDepositDetails = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,

        from_date: filters.from_date,
        to_date: filters.to_date,
      };

      const result = await withdrawRequestDetailsByDate(date, params);
      if (result.data.success) {
        setData(result.data.data || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("API error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchDepositDetails();
    setFilters({
      from_date: selectedStartDate,
      to_date: selectedEndDate,
    });
  };
  const handleReset = () => {
    setSearch("");
    setSelectedStartDate("");
    setSelectedEndDate("");

    setCurrentPage(1);

    setFilters({
      from_date: "",
      to_date: "",
    });

    setFillter(false);
  };
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  return (
    <section>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">
              Admin Withdraw Details - {date}
            </h3>
            <div className="gap-2 d-flex">
              <button className="btn btn-light" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </button>
              <button className="btn btn-light" onClick={() => navigate(-1)}>
                ← Back
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* 🔍 Filter Section */}
          {fillter && (
            <div className="card p-3 mb-3 shadow-sm border-0">
              <div className="row g-3 align-items-end">
                {/* Start Date */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedEndDate}
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="col-md-3 d-flex gap-2">
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleFilter}
                  >
                    Apply
                  </button>

                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 📊 Table Section */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Mobile</th>
                      <th>Opening Balance</th>
                      <th>Amount</th>
                      <th>Closing Balance</th>
                      {/* <th>Remarks</th> */}
                      <th>Date & Time</th>
                      <th>status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.sr}</td>
                          <td>{item.mobile}</td>
                          <td>₹ {item.openingBalance}</td>
                          <td style={{ color: "green", fontWeight: "bold" }}>
                            ₹ {item.amount}
                          </td>
                          <td>₹ {Number(item.closingBalance || 0).toFixed(2)}</td>     
                                               {/* <td>{item.remarks}</td> */}
                          <td>{item.date}</td>
                          <td>
                            <span
                              className={`badge ${item.status?.toUpperCase() === "SUCCESS"
                                  ? "bg-success"
                                  : item.status?.toUpperCase() === "REJECTED"
                                    ? "bg-danger"
                                    : "bg-secondary"
                                }`}
                            >
                              {item.status?.toUpperCase()}
                            </span>
                          </td>{" "}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No deposit records found for this date.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 📄 Pagination Controls */}
              {data.length >= 0 && (
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, data.length)} of{" "}
                    {data.length}
                  </span>

                  <ul className="custom-pagination pagination mb-0">
                    {/* Prev */}
                    <li
                      className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        &laquo;
                      </button>
                    </li>

                    {/* Pages */}
                    {[currentPage - 1, currentPage, currentPage + 1]
                      .filter((p) => p > 0 && p <= totalPages)
                      .map((p) => (
                        <li
                          key={p}
                          className={`page-item ${currentPage === p ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(p)}
                          >
                            {p}
                          </button>
                        </li>
                      ))}

                    {/* Next */}
                    <li
                      className={`page-item ${currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default WithdrawalDateWiseDetailPage;
