import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt, MdRemoveRedEye } from "react-icons/md";
import { BetListsDatewise } from "../../Server/api";

const DateWiseBetLists = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
  });

  // ✅ Summary state (overall totals from API)
  const [summary, setSummary] = useState({
    total_win_amount: 0,
    total_loss_amount: 0,
    total_profit: 0,
  });

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const payload = {
        page: currentPage,
        limit: 50,
        from_date: filters.from_date,
        to_date: filters.to_date,
      };

      const result = await BetListsDatewise(payload);
      if (result?.data?.status) {
        setData(result.data.data || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
        setTotalRecords(result.data.pagination?.total || 0);

        // ✅ Store overall totals from API
        if (result.data.total) {
          setSummary({
            total_win_amount: result.data.total.total_win_amount || 0,
            total_loss_amount: result.data.total.total_loss_amount || 0,
            total_profit: result.data.total.total_profit || 0,
          });
        }
      } else {
        setData([]);
        setSummary({
          total_win_amount: 0,
          total_loss_amount: 0,
          total_profit: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [currentPage, filters]); // ✅ Re-fetch when page or filters change

  const handleFilter = () => {
    setCurrentPage(1);
    setFilters({
      from_date: selectedStartDate,
      to_date: selectedEndDate,
    });
    setFilterOpen(false); // optional: close filter panel after apply
  };

  const handleResetDateFilter = () => {
    setSelectedStartDate("");
    setSelectedEndDate("");
    setCurrentPage(1);
    setFilters({
      from_date: "",
      to_date: "",
    });
    setFilterOpen(false);
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
            <h3 className="card-title text-white">Bet Report</h3>
            <div
              className="btn btn-light"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <MdFilterListAlt /> Filter
            </div>
          </div>
        </div>

        <div className="card-body">
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
                <button className="btn btn-primary" onClick={handleFilter}>
                  Apply
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleResetDateFilter}
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* ✅ TOTAL SUMMARY ROW */}
          {!loading && (summary.total_win_amount !== 0 || summary.total_loss_amount !== 0) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              {/* USER WIN */}
              <div
                style={{
                  background: "linear-gradient(135deg, #16a34a, #22c55e)",
                  borderRadius: "14px",
                  padding: "16px",
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(34,197,94,0.2)",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  User Win
                </h5>

                <h2
                  style={{
                    marginTop: "10px",
                    fontSize: "26px",
                    fontWeight: "bold",
                  }}
                >
                  ₹ {formatCurrency(summary.total_win_amount)}
                </h2>
              </div>

              {/* USER LOSS */}
              <div
                style={{
                  background: "linear-gradient(135deg, #dc2626, #ef4444)",
                  borderRadius: "14px",
                  padding: "16px",
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(239,68,68,0.2)",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  User Loss
                </h5>

                <h2
                  style={{
                    marginTop: "10px",
                    fontSize: "26px",
                    fontWeight: "bold",
                  }}
                >
                  ₹ {formatCurrency(summary.total_loss_amount)}
                </h2>
              </div>

              {/* NET PROFIT / LOSS */}
              <div
                style={{
                  background:
                    summary.total_profit < 0
                      ? "linear-gradient(135deg, #b91c1c, #ef4444)"
                      : "linear-gradient(135deg, #15803d, #22c55e)",
                  borderRadius: "14px",
                  padding: "16px",
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow:
                    summary.total_profit < 0
                      ? "0 4px 15px rgba(239,68,68,0.2)"
                      : "0 4px 15px rgba(34,197,94,0.2)",
                }}
              >
                <h5
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  {summary.total_profit < 0 ? "Net Loss User" : "Net Profit User"}
                </h5>

                <h2
                  style={{
                    marginTop: "10px",
                    fontSize: "26px",
                    fontWeight: "bold",
                  }}
                >
                  ₹ {formatCurrency(Math.abs(summary.total_profit))}
                </h2>
              </div>
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Win Amount</th>
                      <th>Loss Amount</th>
                      <th>Profit</th>
                      <th>Matches</th>
                      <th>Players</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          <td>{(currentPage - 1) * 50 + index + 1}</td>
                          <td>{item.date}</td>
                          <td>₹ {formatCurrency(item.total_win_amount)}</td>
                          <td>₹ {formatCurrency(item.total_loss_amount)}</td>
                          <td
                            style={{
                              color:
                                item.total_profit > 0
                                  ? "green"
                                  : item.total_profit < 0
                                    ? "red"
                                    : "black",
                              fontWeight: "bold",
                            }}
                          >
                            {item.total_profit > 0 ? (
                              <>User Profit: ₹ {formatCurrency(item.total_profit)}</>
                            ) : item.total_profit < 0 ? (
                              <>User Loss: ₹ {formatCurrency(Math.abs(item.total_profit))}</>
                            ) : (
                              <>₹ 0</>
                            )}
                          </td>
                          <td>{item.no_of_matches}</td>
                          <td>{item.no_of_players}</td>
                          <td className="text-center">
                            <MdRemoveRedEye
                              size={22}
                              title="View Details"
                              onClick={() =>
                                navigate(`/datewise_match_List/${item.date}`)
                              }
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {data.length > 0 && totalPages > 1 && (
                <div className="card-footer">
                  <div className="d-flex justify-content-end align-items-center flex-wrap">
                    <nav>
                      <ul className="pagination mb-0">
                        <li
                          className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1 || loading}
                          >
                            &laquo;
                          </button>
                        </li>

                        <li className="page-item active">
                          <span className="page-link">{currentPage}</span>
                        </li>

                        {currentPage + 1 <= totalPages && (
                          <li className="page-item">
                            <button
                              className="page-link"
                              onClick={() => goToPage(currentPage + 1)}
                              disabled={loading}
                            >
                              {currentPage + 1}
                            </button>
                          </li>
                        )}

                        <li
                          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages || loading}
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

export default DateWiseBetLists;