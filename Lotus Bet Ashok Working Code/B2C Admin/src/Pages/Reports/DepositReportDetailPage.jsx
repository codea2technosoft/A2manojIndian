import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DepositRequestDetailsByDate } from "../../Server/api";

import { MdFilterListAlt } from "react-icons/md";

const DepositReportDetails = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fillter, setFillter] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDepositDetails();
  }, [currentPage, date]);

  const fetchDepositDetails = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: search,
      };

      const result = await DepositRequestDetailsByDate(date, params);
      console.log("fsdfsdfsdfsfsfs", result);
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

  const [page, setPage] = useState(1);
  const goToPage = (pageNum) => {
    setPage(pageNum);
  };
  // Pagination handlers
  const goToPreviousPage = () => {
      if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <section>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">
              Deposit Request Details - {date}
            </h3>
            <div className="d-flex gap-2">
              <div className="btn btn-light" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
              <button className="btn btn-light" onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* 🔍 Filter Section */}
          {fillter && (
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="search">Search Remarks</label>
                    </div>
                    <input
                      type="text"
                      id="search"
                      className="form-control"
                      placeholder="Search by remarks..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div>
                    <button className="btn btn-primary" onClick={handleFilter}>
                      Search
                    </button>
                  </div>
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
                      {/* <th>Opening Balance</th> */}
                      <th>Amount</th>
                      {/* <th>Closing Balance</th> */}
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
                          {/* <td>₹ {item.openingBalance}</td> */}
                          <td style={{ color: "green", fontWeight: "bold" }}>
                            ₹ {item.amount}
                          </td>
                          {/* <td>₹ {item.closingBalance}</td> */}
                          {/* <td>{item.remarks}</td> */}
                          <td>{item.date_time}</td>
                          <td>
                            <span
                              className={`badge d-inline ${
                                item.status?.toUpperCase() === "SUCCESS"
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
              {data.length > 0 && totalPages > 1 && (
                <div className="card-footer">
                  <div className="d-flex justify-content-end align-items-center flex-wrap">
                    <nav>
                      <ul className="pagination mb-0">
                        {/* Left Arrow */}
                        <li
                          className={`page-item ${page === 1 ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={goToPreviousPage}
                            disabled={page === 1 || loading}
                          >
                            &laquo;
                          </button>
                        </li>

                        {/* Current Page */}
                        <li className="page-item active">
                          <span className="page-link">{page}</span>
                        </li>

                        {/* Next Page */}
                        {page + 1 <= totalPages && (
                          <li className="page-item">
                            <button
                              className="page-link"
                              onClick={() => goToPage(page + 1)}
                              disabled={loading}
                            >
                              {page + 1}
                            </button>
                          </li>
                        )}

                        {/* Right Arrow */}
                        <li
                          className={`page-item ${
                            page === totalPages ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={goToNextPage}
                            disabled={page === totalPages || loading}
                          >
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

export default DepositReportDetails;
