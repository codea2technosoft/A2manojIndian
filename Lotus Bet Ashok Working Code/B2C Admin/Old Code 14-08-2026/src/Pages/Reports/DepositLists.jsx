import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MdFilterListAlt, MdRemoveRedEye } from "react-icons/md";
import { DepositRequestListsByDate } from "../../Server/api";

const DepositReportdateWiseList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [fillter, setFillter] = useState(false);
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    limit: 10,
  });

  const goToPage = (pageNum) => {
    setPage(pageNum);
  };
  // Pagination handlers
  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  useEffect(() => {
    fetchReport();
  }, [currentPage, filters]);

  // ✅ new
  const handleFilter = () => {
    setCurrentPage(1);

    setFilters((prev) => ({
      ...prev,
      from_date: selectedStartDate,
      to_date: selectedEndDate,
    }));
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
  const handleReset = () => {
    setSelectedStartDate("");
    setSelectedEndDate("");

    setCurrentPage(1);

    setFilters({
      from_date: "",
      to_date: "",
      limit: 10,
    });

    setFillter(false);
  };
  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        from_date: filters.from_date,
        to_date: filters.to_date,
        limit: filters.limit,
      };
      const result = await DepositRequestListsByDate(params);
      if (result.data.success) {
        setData(result.data.data || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalRecords(result.data.pagination?.total || 0);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching withdraw summary:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            {/* <h3 className="card-title text-white">Datewise Deposite List</h3> */}
            <h3 className="card-title text-white">Deposit Reports</h3>
            <div className="">
              <div className="btn btn-light" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {fillter && (
            <div className="row mb-3">
              <div className="col-md-12 d-flex gap-2 align-items-end">
                <div className="w-100">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedStartDate}
                    onChange={(e) => setSelectedStartDate(e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedEndDate}
                    onChange={(e) => setSelectedEndDate(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary" onClick={handleFilter}>
                  Apply
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Total Amount</th>
                      <th>Total Count</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          <td>{(currentPage - 1) * 10 + index + 1}</td>
                          <td>{item.date}</td>
                          <td>₹ {item.totalAmount}</td>
                          <td>{item.totalCount}</td>
                          {/* <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            navigate(
                              `/deposit_detail/${item.date}`
                            )
                          }
                        >
                          View
                        </button>
                      </td> */}
                          <td className="text-center">
                            <MdRemoveRedEye
                              size={22}
                              className=""
                              title="View Details"
                              onClick={() =>
                                navigate(
                                  `/date_wise_deposit_detail/${item.date}`,
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ✅ Pagination Controls */}
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
      {/* 🔍 Date Filters */}
    </section>
  );
};

export default DepositReportdateWiseList;
