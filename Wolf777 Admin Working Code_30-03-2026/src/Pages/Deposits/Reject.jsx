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
    endDate: ""
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
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilter = () => {
    setFilters({
      userId: "",
      startDate: "",
      endDate: ""
    });
    setCurrentPage(1);
    setTimeout(() => fetchDepositList(1), 100);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchDepositList(1);
  };

  const fillterdata = () => {
    setFillter(prev => !prev);
  };

  const fetchDepositList = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        status: 'rejected',
        userId: filters.userId || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      };

      console.log("API Params:", params); // For debugging

      const result = await getAllDepositRequests(params);

      console.log("API Response:", result); // Debugging

      if (result.data.success) {
        const rejectedList = (result.data.data || []).filter(
          (item) => item.status?.toLowerCase() === "rejected"
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
          const total = result.data.total || result.data.count || rejectedList.length;
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

  // Pagination component
  const renderPagination = () => {
    // अगर सिर्फ एक ही पेज है तो pagination मत दिखाओ
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageClick(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageClick(1)}>1</button>
              </li>
              {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            </>
          )}

          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageClick(number)}
              >
                {number}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageClick(totalPages)}>
                  {totalPages}
                </button>
              </li>
            </>
          )}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageClick(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Deposit Reject List</h3>
            <div className="buttonlist">
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {fillter && (
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  {/* <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">User ID</label>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.userId}
                      onChange={(e) => handleFilterChange('userId', e.target.value)}
                      placeholder="Enter User ID"
                    />
                  </div> */}

                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">Start Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
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
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="refreshbutton"
                      onClick={handleFilter}
                    >
                      Apply Filter
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleClearFilter}
                    >
                      Clear
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
                          <td>
                            {item.deposit_type
                              ? item.deposit_type
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())
                                .replace("Qr", "QR")
                              : "N/A"}
                          </td>
                          <td>{item.utr || "N/A"}</td>
                          <td>
                            {item?.image ? (
                              <img
                                src={`https://payment.wolff777.co/uploads/${item.image.replace(/\\/g, "/")}`}
                                alt="deposit slip"
                                style={{ width: "70px", height: "70px", objectFit: "cover" }}
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

              {/* Pagination Section - हमेशा दिखेगा अगर totalPages > 1 */}
              {totalPages > 1 && (
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
                  <div className="text-muted mb-2 mb-md-0">
                    Page {currentPage} of {totalPages} (Total Records: {totalRecords})
                  </div>
                  {renderPagination()}
                  <div className="text-muted">
                    Showing {depositList.length} entries
                  </div>
                </div>
              )}

              {/* डिबगging के लिए - अगर totalPages 1 है तो ये दिखेगा */}
              {totalPages <= 1 && depositList.length > 0 && (
                <div className="text-center text-muted mt-3">
                  <small>Only one page available</small>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositeReject;