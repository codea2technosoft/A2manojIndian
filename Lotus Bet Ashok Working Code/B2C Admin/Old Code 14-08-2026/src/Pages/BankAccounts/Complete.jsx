import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdFilterListAlt, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

const BankAccountComplete = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const token = localStorage.getItem("token");
  const limit = 50;

  const ucWords = (str) => {
    return str?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  const [fillter, setFillter] = useState(false);
  const [FilterMobile, setFilterMobile] = useState(""); // Changed from FilterUsername
  const [FilterAccountNumber, setFilterAccountNumber] = useState("");
  const [FilterBankName, setFilterBankName] = useState("");

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

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

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

    const handlePageClick = (page) => {
    setCurrentPage(page);
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
        `${process.env.REACT_APP_API_URL}/user-success-bank-list?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await res.json();
      console.log("API Response:", result);

      // Check for success (adjust based on your API response format)
      if (
        result.success === true ||
        result.success === "1" ||
        result.success === 1
      ) {
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

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Bank Account Completed List</h3>
          <div className="btn btn-light" onClick={fillterdata}>
            <MdFilterListAlt /> Filter
          </div>
        </div>
      </div>

      <div className="card-body p-2">
        {fillter && (
          <div className="row mb-3">
            <div className="col-md-12">
              <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                <div className="form_latest_design flex-grow-1">
                  <div className="label">
                    <label>Mobile Number</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by mobile..."
                    value={FilterMobile}
                    onChange={handleSearchChangeMobile}
                  />
                </div>
                <div className="form_latest_design flex-grow-1">
                  <div className="label">
                    <label>Account Number</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by account number..."
                    value={FilterAccountNumber}
                    onChange={handleSearchChangeAccountNumber}
                  />
                </div>
                <div className="form_latest_design flex-grow-1">
                  <div className="label">
                    <label>Bank Name</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by bank name..."
                    value={FilterBankName}
                    onChange={handleSearchChangeBankName}
                  />
                </div>
                <div className="form_latest_design d-flex gap-2">
                  <button className="btn btn-primary" onClick={handleFilter}>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading completed bank accounts...</p>
          </div>
        ) : (
          <div className="">
            <div className="table-responsive">
              <table className="table table-bordered">
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
                      <tr key={item._id}>
                        <td>{(currentPage - 1) * limit + index + 1}</td>
                        <td>{item.mobile || "NA"}</td>
                        <td>{item.account_number}</td>
                        <td>{item.ifsc_code}</td>
                        <td>{item.bank_name}</td>
                        <td>{ucWords(item.account_holder_name)}</td>
                        <td>
                          <span className="badge bg-success text-white">
                            {item.status?.toUpperCase() || "SUCCESS"}
                          </span>
                        </td>
                        <td>
                          {moment(item.created_at).format("DD-MM-YYYY hh:mm A")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <p className="text-muted mb-0">
                          No completed bank accounts found.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
                <div className="showingallentries">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, totalRecords)} of{" "}
                  {totalRecords} entries
                </div>

                <div className="paginationall d-flex align-items-center gap-1">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                  >
                    <MdOutlineKeyboardArrowLeft />
                  </button>

                  <div className="d-flex gap-1">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => handlePageClick(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    disabled={currentPage === totalPages}
                    onClick={handleNext}
                  >
                    <MdOutlineKeyboardArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>    
    </div>
  );
};

export default BankAccountComplete;
