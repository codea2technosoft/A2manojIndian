import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getAllDepositRequests } from "../../Server/api";

const DepositeReject = ({ userId }) => {
  const [depositList, setDepositList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fillter, setFillter] = useState(false);
  const [filters, setFilters] = useState({
    userId: "",
    startDate: "",
    endDate: "",
  });

  const limit = 50;
  const navigate = useNavigate();

  const ucWords = (str) => {
    if (!str || typeof str !== "string") return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchDepositList(currentPage);
  }, [currentPage, userId]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilter = () => {
    setFilters({
      userId: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
    setTimeout(() => fetchDepositList(1), 100);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchDepositList(1);
  };

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const fetchDepositList = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        status: "rejected",
        userId: filters.userId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };

      console.log("API Params:", params); // For debugging

      const result = await getAllDepositRequests(params);

      console.log("API Response:", result); // Debugging

      if (result.data.success) {
        const rejectedList = (result.data.data || []).filter(
          (item) => item.status?.toLowerCase() === "rejected",
        );
        setDepositList(rejectedList);

        // Fix: सही तरीके से pagination data set करें
        if (result.data.pagination) {
          setTotalPages(result.data.pagination.totalPages || 1);
          setTotalRecords(result.data.pagination.totalRecords || 0);
        } else if (result.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
          setTotalRecords(result.pagination.totalRecords || 0);
        } else {
          // अगर pagination नहीं है तो total pages calculate करें
          const total =
            result.data.total || result.data.count || rejectedList.length;
          const calculatedPages = Math.ceil(total / limit);
          setTotalPages(calculatedPages || 1);
          setTotalRecords(total);
        }
      } else {
        setDepositList([]);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setDepositList([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const handleActionLedger = (user_id) => {
    navigate(`/ledger/${user_id}`);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <section>
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title">Deposit Reject List</h3>
            <div className="btn btn-light" onClick={fillterdata}>
              <MdFilterListAlt /> Filter
            </div>
          </div>
        </div>

        <div className="card-body">
          {fillter && (
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">User ID</label>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.userId}
                      onChange={(e) =>
                        handleFilterChange("userId", e.target.value)
                      }
                      placeholder="Enter User ID"
                    />
                  </div>

                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">Start Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.startDate}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">End Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.endDate}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handleFilter}>
                      Search
                    </button>
                  </div>
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
                      {/* <th>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                        <span className="ms-1">Select All</span>
                      </th> */}
                      <th>S.No</th>
                      <th>Date</th>
                      <th>Order ID</th>

                      <th>User Mobile</th>
                      <th>Amount</th>
                      <th>Gateway Name</th>
                      <th>Gateway Type</th>
                      <th>UTR NO</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depositList.length > 0 ? (
                      depositList.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{item.date_time}</td>
                          <td>{item.order_id}</td>

                          <td>{item.mobile || "N/A"}</td>
                          <td>₹ {item.amount}</td>

                          <td>{item.getway_name || "N/A"}</td>
                          <td>{item.deposit_type || "N/A"}</td>
                          <td>{item.utr || "N/A"}</td>
                          <td>
                            {item?.image ? (
                              <img
                                src={`https://payment.lovebite247.com/uploads/${item.image.replace(/\\/g, "/")}`}
                                alt="deposit slip"
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              "No Image"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalRecords > 0 && (
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, totalRecords)} of{" "}
                    {totalRecords}
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
    </section>
  );
};

export default DepositeReject;
