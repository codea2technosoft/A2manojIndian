import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";

const BankAccountReject = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const token = localStorage.getItem("token");
  const limit = 10;

  const ucWords = (str) => {
    if (!str) return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchWithdrawList(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchWithdrawList(currentPage + 1);
    }
  };

  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const [FilterMobile, setFilterMobile] = useState("");
  const [FilterAccountNumber, setFilterAccountNumber] = useState("");
  const [FilterBankName, setFilterBankName] = useState("");

  // Search handlers
  const handleSearchChangeMobile = (e) => {
    const value = e.target.value;
    setFilterMobile(value);
  };

  const handleSearchChangeAccountNumber = (e) => {
    const value = e.target.value;
    setFilterAccountNumber(value);
  };

  const handleSearchChangeBankName = (e) => {
    const value = e.target.value;
    setFilterBankName(value);
  };

  const handleFilter = () => {
    // Reset to first page when applying filters
    setCurrentPage(1);
    fetchWithdrawList(1);
  };

  const handleClearFilters = () => {
    setFilterMobile("");
    setFilterAccountNumber("");
    setFilterBankName("");
    setCurrentPage(1);
    fetchWithdrawList(1);
  };

  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      // Build query parameters for server-side filtering
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add filter parameters only if they have values
      if (FilterMobile) {
        params.append("mobile", FilterMobile);
      }
      
      if (FilterAccountNumber) {
        params.append("account_number", FilterAccountNumber);
      }
      
      if (FilterBankName) {
        params.append("bank_name", FilterBankName);
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/user-rejected-bank-list?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (result.success === true || result.success === "1") {
        setWithdrawList(result.data || []);
        // Set pagination info from API response
        setTotalPages(result.totalPages || 1);
        setTotalRecords(result.totalRecords || 0);
      } else {
        setWithdrawList([]);
        setTotalPages(1);
        setTotalRecords(0);
        console.error("API Error:", result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setWithdrawList([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-color-black">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title text-white">Bank Account Rejected List</h3>
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
              <div className="card card-body bg-light">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  <div className="form_latest_design flex-grow-1">
                    <div className="label">
                      <label htmlFor="">Mobile Number</label>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={FilterMobile}
                      onChange={handleSearchChangeMobile}
                      placeholder="Filter by mobile number"
                    />
                  </div>
                  <div className="form_latest_design flex-grow-1">
                    <div className="label">
                      <label htmlFor="">Account Number</label>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={FilterAccountNumber}
                      onChange={handleSearchChangeAccountNumber}
                      placeholder="Filter by account number"
                    />
                  </div>
                  <div className="form_latest_design flex-grow-1">
                    <div className="label">
                      <label htmlFor="">Bank Name</label>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={FilterBankName}
                      onChange={handleSearchChangeBankName}
                      placeholder="Filter by bank name"
                    />
                  </div>
                  <div className="form_latest_design d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={handleFilter}
                    >
                      Apply Filters
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleClearFilters}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading rejected bank accounts...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Mobile</th>
                    <th>Account Number</th>
                    <th>IFSC Code</th>
                    <th>Bank Name</th>
                    <th>A/C Holder Name</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawList.length > 0 ? (
                    withdrawList.map((item, index) => (
                      <tr key={item._id || item.id || index}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{item.mobile || '-'}</td>
                        <td>{item.account_number || '-'}</td>
                        <td>{item.ifsc_code || '-'}</td>
                        <td>{ucWords(item.bank_name) || '-'}</td>
                        <td>{ucWords(item.account_holder_name) || '-'}</td>
                        <td>
                          <span className="badge bg-danger text-white">
                            {item.status?.toUpperCase() || 'REJECTED'}
                          </span>
                        </td>
                        <td>
                          {item.created_at 
                            ? moment(item.created_at).format("DD-MM-YYYY hh:mm A")
                            : '-'
                          }
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <p className="text-muted mb-0">No rejected bank accounts found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Info */}
            {totalRecords > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="text-muted">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} entries
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {withdrawList.length > 0 && totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-outline-primary"
                  disabled={currentPage === 1}
                  onClick={handlePrev}
                >
                  Previous
                </button>
                <span className="alllistnumber">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-primary"
                  disabled={currentPage === totalPages}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .bg-color-black {
          background-color: #343a40;
        }
        .fillterbutton {
          padding: 8px 15px;
          background-color: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: background-color 0.3s;
        }
        .fillterbutton:hover {
          background-color: #0056b3;
        }
        .form_latest_design {
          margin-bottom: 0;
        }
        .form_latest_design .label {
          margin-bottom: 5px;
          font-weight: 500;
        }
        .table th {
          white-space: nowrap;
        }
        .table td {
          vertical-align: middle;
        }
        .badge {
          padding: 5px 10px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default BankAccountReject;