// ========== FRONTEND: src/components/DepositAmountByUsers.jsx ==========

import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { deposit_amount_by_user } from "../../Server/api";

const DepositAmountByUsers = ({ userId }) => {
  const [depositList, setDepositList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchMobile, setSearchMobile] = useState("");

  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepositList(currentPage);
  }, [currentPage]);

  const handleMobileSearch = () => {
    setCurrentPage(1);
    fetchDepositList(1);
  };

  const handleClearSearch = () => {
    setSearchMobile("");
    setCurrentPage(1);
    setTimeout(() => fetchDepositList(1), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleMobileSearch();
    }
  };

  const fetchDepositList = async (page = 1) => {
    setLoading(true);
    try {
      // Query params banaen (jaise backend chahta hai)
      const params = {
        page: page,
        limit: limit
      };
      
      if (searchMobile && searchMobile.trim() !== "") {
        params.search = searchMobile.trim();
      }
      
      console.log("Sending Query Params:", params);
      const result = await deposit_amount_by_user(params);
      console.log("API Response:", result);

      if (result.data.success) {
        const depositData = (result.data.data || []).filter(
          (item) => item.status?.toLowerCase() === "success"
        );
        
        setDepositList(depositData);
        
        if (result.data.pagination) {
          setTotalPages(result.data.pagination.totalPages || 1);
          setTotalRecords(result.data.pagination.total || 0);
        } else {
          setTotalPages(1);
          setTotalRecords(depositData.length);
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

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'success') {
      return 'badge bg-success';
    } else if (statusLower === 'rejected' || statusLower === 'failed') {
      return 'badge bg-danger';
    } else if (statusLower === 'pending') {
      return 'badge bg-warning';
    }
    return 'badge bg-secondary';
  };

  const renderPagination = () => {
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
            <button className="page-link" onClick={() => handlePageClick(1)} disabled={currentPage === 1}>
              First
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={handlePrev} disabled={currentPage === 1}>
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
              <button className="page-link" onClick={() => handlePageClick(number)}>
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
            <button className="page-link" onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageClick(totalPages)} disabled={currentPage === totalPages}>
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
            <h3 className="card-title text-white">Deposited Amount By Users List</h3>
          </div>
        </div>

        <div className="card-body">
          {/* Mobile Search Bar */}
          <div className="row mb-3">
            <div className="col-md-6 mx-auto">
              <div className="input-group">
                <span className="input-group-text">
                  <MdSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Mobile Number..."
                  value={searchMobile}
                  onChange={(e) => setSearchMobile(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleMobileSearch}
                >
                  Search
                </button>
                {searchMobile && (
                  <button
                    className="btn btn-secondary"
                    onClick={handleClearSearch}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading data...</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>S.No</th>
                      <th>Date</th>
                      {/* <th>User ID</th> */}
                      <th>Mobile</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Processed By</th>
                      <th>Bonus</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {depositList.length > 0 ? (
                      depositList.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{moment(item.requestDate || item.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                          {/* <td>{item.user_id}</td> */}
                          <td>
                            <strong>{item.mobile || "N/A"}</strong>
                          </td>
                          <td>₹ {item.amount}</td>
                          <td>
                            <span className={`badge bg-${item.type === 'Deposit' ? 'info' : 'secondary'}`}>
                              {item.type}
                            </span>
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(item.status)}>
                              {item.status?.toUpperCase() || "N/A"}
                            </span>
                          </td>
                          <td>{item.processedBy || item.amountAddBy || "Admin"}</td>
                          <td>₹ {item.bonus || 0}</td>
                          {/* <td>
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => handleActionLedger(item.user_id)}
                            >
                              View Ledger
                            </button>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center py-4">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
                  <div className="text-muted mb-2 mb-md-0">
                    Page {currentPage} of {totalPages} | Total Records: {totalRecords}
                  </div>
                  {renderPagination()}
                  <div className="text-muted">
                    Showing {depositList.length} entries
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositAmountByUsers;