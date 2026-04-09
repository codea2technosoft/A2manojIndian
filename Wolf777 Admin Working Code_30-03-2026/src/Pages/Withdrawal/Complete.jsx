import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";
import { getAllWithdrawRequests } from "../../Server/api"

const Complete = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState(false);
  const [filterUsername, setFilterUsername] = useState("");
  const [filterMobile, setFilterMobile] = useState(""); // Added mobile filter state
  const [filterAccountNumber, setFilterAccountNumber] = useState("");
  const [filterMin, setFilterMin] = useState("");
  const [filterMax, setFilterMax] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [totalWithdrawAmount, setTotalWithdrawAmount] = useState(0);
  const token = localStorage.getItem("token");
  const limit = 10;

  const ucWords = (str) => {
    if (!str) return "N/A";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  // Client-side filtering for table search
  const filteredList = withdrawList.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.user_name?.toLowerCase().includes(search) ||
      item.amount?.toString().includes(search) ||
      item.mobile?.toString().includes(search) ||
      item.bank_name?.toLowerCase().includes(search) ||
      item.account_number?.toString().includes(search)
    );
  });

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const toggleFilter = () => {
    setFilter((prev) => !prev);
  };

  const applyFilter = () => {
    // Reset to page 1 when applying new filters
    setCurrentPage(1);
    fetchWithdrawList(1);
  };

  const resetFilter = () => {
    setFilterUsername("");
    setFilterMobile(""); // Reset mobile filter
    setFilterAccountNumber("");
    setFilterMin("");
    setFilterMax("");
    setSelectedStartDate("");
    setSelectedEndDate("");
    setCurrentPage(1);
    fetchWithdrawList(1);
  };

  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAllWithdrawRequests({
        user_id: userId,
        page: page.toString(),
        limit: limit.toString(),
        user_name: filterUsername,
        mobile: filterMobile, // Added mobile parameter to API call
        min: filterMin,
        max: filterMax,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        status: 'Success'
      });

      const result = response.data;
      if (result.success) {
        // Map API response to your component's expected structure
        const mappedData = result.data.map(item => ({
          _id: item._id,
          mobile: item.userId?.mobile || "N/A",
          amount: item.amount,
          account_number: item.accountNumber || "N/A",
          mobile: item.mobile || "N/A",
          ifsc_code: item.ifscCode || "N/A",
          bank_name: item.bankName || "N/A",
          account_holder_name: item.accountHolderName || "N/A",
          status: item.status?.toLowerCase() || "success",
          remark: item.remark || "",
          reason: item.reason || "",
          date_time: item.createdAt,
          opening_balance: item.openingBalance,
          closing_balance: item.closingBalance,
          transaction_by: item.transactionBy,
          date: moment(item.createdAt).format("DD-MM-YYYY"),
        }));
        setTotalWithdrawAmount(result.summary?.totalWithdrawAmount || 0);
        setWithdrawList(mappedData);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        setWithdrawList([]);
        console.error("API Error:", result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setWithdrawList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white d-flex align-items-center gap-4">Success Withdraw List <div className="d-flex justify-content-end">
              <h5 className="mb-0 bg-light text-dark p-2 rounded">
                Total Deposit Amount: ₹ {totalWithdrawAmount}
              </h5>
            </div>
            </h3>
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex justify-content-end mb-2">
                {/* <h5 className="text-success">
    Total Deposit Amount: ₹ {totalWithdrawAmount}
  </h5> */}




              </div>  
               {/* <div className="form_latest_design" style={{ width: "250px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, amount, mobile, bank, account..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div> */}
              <div className="buttonlist">
                <div className="fillterbutton" onClick={toggleFilter}>
                  <MdFilterListAlt /> Filter
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {filter && (
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex flex-wrap justify-content-between align-items-end">
                  {/* Added Mobile Number Filter */}
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="mobileNumber">Mobile Number</label>
                    </div>
                    <input
                      type="text"
                      id="mobileNumber"
                      name="mobile"
                      className="form-control"
                      placeholder="Enter mobile number"
                      value={filterMobile}
                      onChange={(e) => setFilterMobile(e.target.value)}
                    />
                  </div>

                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="accountNumber">Account Number</label>
                    </div>
                    <input
                      type="text"
                      id="accountNumber"
                      name="account_number"
                      className="form-control"
                      placeholder="Enter account number"
                      value={filterAccountNumber}
                      onChange={(e) => setFilterAccountNumber(e.target.value)}
                    />
                  </div>

                  {/* <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="minAmount">Min Amount</label>
                    </div>
                    <input
                      type="number"
                      id="minAmount"
                      name="min_amount"
                      className="form-control"
                      placeholder="Min amount"
                      value={filterMin}
                      onChange={(e) => setFilterMin(e.target.value)}
                    />
                  </div>

                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="maxAmount">Max Amount</label>
                    </div>
                    <input
                      type="number"
                      id="maxAmount"
                      name="max_amount"
                      className="form-control"
                      placeholder="Max amount"
                      value={filterMax}
                      onChange={(e) => setFilterMax(e.target.value)}
                    />
                  </div> */}

                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="startDate">Start Date</label>
                    </div>
                    <input
                      type="date"
                      id="startDate"
                      className="form-control"
                      value={selectedStartDate}
                      onChange={(e) => setSelectedStartDate(e.target.value)}
                    />
                  </div>

                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="endDate">End Date</label>
                    </div>
                    <input
                      type="date"
                      id="endDate"
                      className="form-control"
                      value={selectedEndDate}
                      onChange={(e) => setSelectedEndDate(e.target.value)}
                    />
                  </div>

                  <div className="form_latest_design d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={applyFilter}
                    >
                      Apply Filter
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={resetFilter}
                    >
                      Reset
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
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>SR No.</th>
                      <th>Mobile</th>
                      <th>Amount (₹)</th>
                      <th>Account No.</th>
                      <th>Account Holder</th>
                      <th>IFSC</th>
                      <th>Bank Name</th>
                      <th>Opening Balance</th>
                      <th>Closing Balance</th>
                      <th>Status</th>
                      <th>Remark</th>
                      <th>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length > 0 ? (
                      filteredList.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{item.mobile}</td>
                          <td>₹{item.amount}</td>
                          <td>{item.account_number}</td>
                          <td>{item.account_holder_name}</td>
                          <td>{item.ifsc_code}</td>
                          <td>{item.bank_name}</td>
                          <td>₹{item.opening_balance || 0}</td>
                          <td>₹{item.closing_balance || 0}</td>
                          <td>
                            <span className={`badge ${item.status === "success" ? "bg-success text-white" : "bg-warning"}`}>
                              {item.status?.toUpperCase()}
                            </span>
                          </td>
                          <td>{item.remark || "N/A"}</td>
                          <td>{moment(item.date_time).format("DD-MM-YYYY hh:mm A")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center py-3">
                          <div className="text-muted">
                            {searchTerm || filterMobile || filterUsername || filterMin || filterMax || selectedStartDate ?
                              "No matching records found. Try different search criteria." :
                              "No successful withdrawals found."}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {filteredList.length > 0 && totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={currentPage === 1}
                      onClick={handlePrev}
                    >
                      Previous
                    </button>
                  </div>

                  <div className="alllistnumber">
                    <span className="text-muted">
                      Showing {Math.min(filteredList.length, limit)} of {totalPages * limit} entries
                    </span>
                    <span className="mx-2">|</span>
                    <span className="fw-bold">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>

                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      disabled={currentPage === totalPages}
                      onClick={handleNext}
                    >
                      Next
                    </button>
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

export default Complete;