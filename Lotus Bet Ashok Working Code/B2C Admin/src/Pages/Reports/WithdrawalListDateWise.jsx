import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";
import { WithdrawRequestListsByDate } from "../../Server/api";

const WithdrowDatewiseList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 50;
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
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
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });

  // const handleFilter = () => {
  //   setCurrentPage(1);
  //   fetchReport();
  // };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const [fillter, setFillter] = useState(false);
  useEffect(() => {
    fetchReport();
  }, [currentPage, filters]);
  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
  const [selectedStartDate, setselectedStartDate] = useState("");
  const [selectedEndDate, setselectedEndDate] = useState("");

  const handleSearchChangeMin = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMin(value);
  };

  const setSelectedStartDate = (e) => {
    const value = e;
    setselectedStartDate(value);
  };
  const setSelectedEndDate = (e) => {
    const value = e;
    setselectedEndDate(value);
  };
  const handleFilter = () => {
    setCurrentPage(1);

    setFilters({
      from_date: selectedStartDate,
      to_date: selectedEndDate,
    });
  };
  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,

        startDate: selectedStartDate,
        endDate: selectedEndDate,
      };
      const result = await WithdrawRequestListsByDate(params);

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
  const handleReset = () => {
    setselectedStartDate("");
    setselectedEndDate("");

    setCurrentPage(1);

    setFilters({
      from_date: "",
      to_date: "",
    });

    setFillter(false);
  };
  return (
    <section>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            {/* <h3 className="card-title">Admin Withdraw Date List</h3> */}
            <h3 className="card-title">Withdrawal Reports</h3>

            <button className="btn btn-light" onClick={fillterdata}>
              <MdFilterListAlt /> Filter
            </button>
          </div>
        </div>

        <div className="card-body">
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
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                navigate(
                                  `/withdrawalreport_datewise_details/${item.date}`,
                                )
                              }
                            >
                              View
                            </button>
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
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
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
      {/* 🔍 Date Filters */}
    </section>
  );
};

export default WithdrowDatewiseList;
