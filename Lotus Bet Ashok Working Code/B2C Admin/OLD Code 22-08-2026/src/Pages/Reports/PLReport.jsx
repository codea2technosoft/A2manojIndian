import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { DateWisePlReportByDate } from "../../Server/api";

const PLReportDatewiseList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 50;
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [summary, setSummary] = useState({
    total_win_amount: 0,
    total_loss_amount: 0,
    total_profit: 0
  });
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });
  const fetchReport = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        limit: 50,
        startDate: filters.from_date,
        endDate: filters.to_date,
      };
      const result = await DateWisePlReportByDate(payload);
      if (result?.data?.success) {
        setData(result.data.data || []);
        setSummary(result.data.totals || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalRecords(result.data.pagination?.total || 0);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  // ✅ Auto Fetch on Page / Filter Change
  useEffect(() => {
    fetchReport();
  }, [currentPage, filters]);

  // ✅ Apply Filter
  const handleFilter = () => {
    setCurrentPage(1);

    setFilters({
      from_date: selectedStartDate,
      to_date: selectedEndDate,
    });
  };
  const formatNumber = (num = 0) => {
    return Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  // ✅ Reset Filter
  const handleReset = () => {
    setSelectedStartDate("");
    setSelectedEndDate("");

    setCurrentPage(1);

    setFilters({
      from_date: "",
      to_date: "",
    });

    setFilterOpen(false);
  };

  // ✅ Pagination
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const getProfitLossClass = (value) => {
    return value >= 0 ? "text-success" : "text-danger";
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <section>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">
              Date wise PL report
            </h3>

            <div
              className="btn btn-light"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <MdFilterListAlt /> Filter
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* ✅ FILTER UI */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body py-2 bg-success text-light">
                  <h6 className="mb-0">Total Deposit Amount</h6>
                  <h4 className="mb-0">₹{formatNumber(summary.totalDeposit)}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card ">
                <div className="card-body py-2 bg-danger text-light">
                  <h6 className="mb-0">Total Withdraw Amount</h6>
                  <h4 className="mb-0">₹{formatNumber(summary.totalWithdraw)}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card  ">
                <div className="card-body py-2 bg-info text-light">
                  <h6 className="mb-0">Total Profit</h6>
                  <h4 className={`mb-0 ${getProfitLossClass(summary.totalProfit)}`}>
                    ₹{formatNumber(summary.totalProfit)}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {filterOpen && (
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

                <button
                  className="btn btn-primary"
                  onClick={handleFilter}
                >
                  Apply
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                  disabled={!selectedStartDate && !selectedEndDate}
                >
                  Reset
                </button>

              </div>
            </div>
          )}

          {/* ✅ LOADING */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* ✅ TABLE */}
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Deposit Amount</th>
                      <th>Withdraw Amount</th>
                      <th>Profit</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          <td>{(currentPage - 1) * 10 + index + 1}</td>
                          <td>{item.date}</td>
                          <td>₹ {item.depositAmount}</td>
                          <td>₹ {item.withdrawAmount}</td>
                          <td
                            style={{
                              color:
                                item.profit > 0
                                  ? "green"
                                  : item.profit < 0
                                    ? "red"
                                    : "black",
                              fontWeight: "bold",
                            }}
                          >
                            ₹ {Number(item.profit || 0).toFixed(2)}                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ✅ PAGINATION */}
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

export default PLReportDatewiseList;