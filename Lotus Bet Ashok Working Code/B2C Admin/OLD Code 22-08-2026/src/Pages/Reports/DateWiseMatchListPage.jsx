import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMetchwiseReport } from "../../Server/api";

import { MdFilterListAlt, MdRemoveRedEye } from "react-icons/md";

const DatewiseMatchDetails = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [Summary, setSummary] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fillter, setFillter] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    from_date: date || "",
    to_date: date || "",
  });



  const [page, setPage] = useState(2);
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
  useEffect(() => {
    fetchDepositDetails();
  }, [currentPage, filters]);
  const fetchDepositDetails = async () => {
    setLoading(true);
    try {
      const payload = {
        from_date: filters.from_date,
        to_date: filters.to_date,
        page: currentPage,
        limit: 10,
        search: search,
      };

      const result = await getMetchwiseReport(payload);

      if (result.data.status_code === 1) {
        setData(result.data.data || []);
        setSummary(result.data.summary || {});
        setTotalPages(result.data.pagination?.total_pages || 1);
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

    setFilters({
      from_date: selectedStartDate,
      to_date: selectedEndDate,
    });
  };
  const handleReset = () => {
    setSelectedStartDate(date || "");
    setSelectedEndDate(date || "");
    setSearch("");

    setCurrentPage(1);

    setFilters({
      from_date: date || "",
      to_date: date || "",
    });

    setFilterOpen(false);
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
        <div className="card-header bg-color-black d-flex justify-content-between align-items-center">
          <h3 className="card-title text-white">
            Date wise Match List - {date}
          </h3>
          <div className="d-flex gap-2">
            <button
              className="btn btn-light"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <MdFilterListAlt /> Filter
            </button>
            <button className="btn btn-light" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* 🔍 Filter Section */}

          {filterOpen && (
            <div className="row mb-3">
              <div className="col-md-12 d-flex gap-2 align-items-end">
                <div className="w-100">
                  <label>Search</label>
                  <input
                    type="text"
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

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
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                >
                  Reset
                </button>
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
                      <th>Match Name</th>
                      <th>Total Win</th>
                      <th>Total Loss</th>
                      <th>Profit/Loss</th>
                      {/* <th>No. of Players</th> */}
                      <th>Date & Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.match_name}</td>
                          <td className="text-success">
                            ₹ {Number(item?.admin_win_amount || 0).toFixed(2)}
                          </td>

                          <td className="text-danger">
                            ₹ {Number(item?.admin_loss_amount || 0).toFixed(2)}
                          </td>
                          <td
                            style={{
                              color: item.total_pl >= 0 ? "green" : "red",
                              fontWeight: "bold",
                            }}
                          >
                           ₹ {Number(item.total_pl || 0).toFixed(2)}  {item.total_pl >= 0 ? "User Win" : "User Loss"}                          </td>
                          {/* <td>{item.no_of_players}</td> */}

                          <td>{new Date(item.date).toLocaleString("en-IN")}</td>
                          <td className="text-center">
                            <MdRemoveRedEye
                              size={22}
                              className=""
                              title="View Details"
                              onClick={() =>
                                navigate(
                                  `/datewise_bet_user_report/${item.event_id}`,
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No match records found
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
                          className={`page-item ${page === totalPages ? "disabled" : ""
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

export default DatewiseMatchDetails;
