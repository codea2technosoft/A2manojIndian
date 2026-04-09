import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";
import { getAllWithdrawRequests } from "../../Server/api"

const Reject = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const limit = 10;

  const ucWords = (str) => {
    if (!str) return "N/A";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  const filteredList = withdrawList.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.user_name?.toLowerCase().includes(search) ||
      item.amount?.toString().includes(search) ||
      item.mobile?.toString().includes(search) ||
      item.bank_name?.toLowerCase().includes(search)
    );
  });

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const [FilterUsername, setFilterUsername] = useState("");
  const [FilterAccountNumber, setFilterAccountNumber] = useState("");
  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");

  // const handleSearchChangeusername = (e) => {
  //   const value = e.target.value.toLowerCase();
  //   setFilterUsername(value);
  // };

  const handleSearchChangeAccountNumber = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterAccountNumber(value);
  };

  // const handleSearchChangeMin = (e) => {
  //   const value = e.target.value.toLowerCase();
  //   setFilterMin(value);
  // };

  // const handleSearchChangeMax = (e) => {
  //   const value = e.target.value.toLowerCase();
  //   setFilterMax(value);
  // };

  const handleSetSelectedStartDate = (e) => {
    const value = e.target.value;
    setSelectedStartDate(value);
  };

  const handleSetSelectedEndDate = (e) => {
    const value = e.target.value;
    setSelectedEndDate(value);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchWithdrawList(1);
  };

  const handleClearFilter = () => {
    setFilterUsername("");
    setFilterAccountNumber("");
    setFilterMin("");
    setFilterMax("");
    setSelectedStartDate("");
    setSelectedEndDate("");
    setCurrentPage(1);
    setTimeout(() => fetchWithdrawList(1), 100);
  };

  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAllWithdrawRequests({
        user_id: userId,
        page: page.toString(),
        limit: limit.toString(),
        user_name: FilterUsername,
        min: FilterMin,
        max: FilterMax,
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        status: 'Rejected'
      });

      const result = response.data;
      if (result.success) {
        const mappedData = result.data.map(item => ({
          _id: item._id,
          user_name: item.userId?.name || item.userName || "N/A",
          mobile: item.userId?.mobile || "N/A",
          amount: item.amount,
          mobile: item.mobile,
          account_number: item.accountNumber || "N/A",
          ifsc_code: item.ifscCode || "N/A",
          bank_name: item.bankName || "N/A",
          account_holder_name: item.accountHolderName || "N/A",
          status: item.status,
          remark: item.remark || "",
          reason: item.reason || "",
          date_time: item.createdAt || item.date_time,
        }));

        const rejectedData = mappedData.filter(item => 
          item.status && item.status.toLowerCase() === "rejected"
        );
        setWithdrawList(rejectedData);
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
            <h3 className="card-title text-white">Withdraw Rejected List</h3>
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
                 
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Account Number</label>
                    </div>
                    <input
                      type="text"
                      name="account_number"
                      className="form-control"
                      value={FilterAccountNumber}
                      onChange={handleSearchChangeAccountNumber}
                      placeholder="Enter account number"
                    />
                  </div>
                  {/* <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Min Amount</label>
                    </div>
                    <input
                      type="number"
                      name="min_amount"
                      className="form-control"
                      value={FilterMin}
                      onChange={handleSearchChangeMin}
                      placeholder="Min amount"
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Max Amount</label>
                    </div>
                    <input
                      type="number"
                      name="max_amount"
                      className="form-control"
                      value={FilterMax}
                      onChange={handleSearchChangeMax}
                      placeholder="Max amount"
                    />
                  </div> */}
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Start Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedStartDate}
                      onChange={handleSetSelectedStartDate}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">End Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedEndDate}
                      onChange={handleSetSelectedEndDate}
                    />
                  </div>
                  <div className="form_latest_design d-flex gap-2">
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
                      <th>Sr No</th>       
                      <th>Mobile</th>
                      <th>Amount (₹)</th>
                      <th>Account Number</th>
                      <th>IFSC Code</th>
                      <th>Bank Name</th>
                      <th>A/C Holder Name</th>
                      <th>Rejection Reason</th>
                      <th>Status</th>
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
                          <td>{item.ifsc_code}</td>
                          <td>{item.bank_name}</td>
                          <td>{ucWords(item.account_holder_name)}</td>
                          <td>
                            <div style={{ maxWidth: "200px", wordWrap: "break-word" }}>
                              <strong className="text-danger">
                                {item.remark || item.reason || "No reason provided"}
                              </strong>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-danger text-white">
                              {item.status?.toUpperCase() || "REJECTED"}
                            </span>
                          </td>
                          <td>
                            {moment(item.date_time).format("DD-MM-YYYY hh:mm A")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="text-center py-3">
                          <div className="text-muted">
                            {searchTerm || FilterUsername || FilterMin || FilterMax || selectedStartDate ?
                              "No matching records found. Try different search criteria." :
                              "No rejected withdrawals found."}
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
                  <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                  >
                    Previous
                  </button>
                  <span className="text-muted">
                    Page {currentPage} of {totalPages} • Total: {filteredList.length}
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm"
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
      </div>
    </div>
  );
};

export default Reject;