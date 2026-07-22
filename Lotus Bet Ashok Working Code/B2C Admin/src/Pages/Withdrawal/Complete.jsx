import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";
import { getAllCompletedWithdrawalRequests, getAllAgentsLists } from "../../../src/Server/api";
import * as XLSX from 'xlsx';

const Complete = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState(false);
  const [filterUsername, setFilterUsername] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterAccountNumber, setFilterAccountNumber] = useState("");
  const [filterMin, setFilterMin] = useState("");
  const [filterMax, setFilterMax] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [totalWithdrawAmount, setTotalWithdrawAmount] = useState(0);
  const [agentsList, setAgentsList] = useState([]);
  const [declineTotal, setDeclineTotal] = useState(0); // Add this
  const [filters, setFilters] = useState({
    agent_id: "",
    startDate: "",
    endDate: "",
  });
  const token = localStorage.getItem("token");
  const limit = 50;

  const ucWords = (str) => {
    if (!str) return "N/A";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Fetch agents list
  const fetchAgents = async () => {
    try {
      const res = await getAllAgentsLists({});
      if (res.data.success) {
        setAgentsList(res.data.data || []);
      }
    } catch (err) {
      console.error("Fetch agents error:", err);
    }
  };

  useEffect(() => {
    fetchAgents();
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

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilter = () => {
    setCurrentPage(1);
    fetchWithdrawList(1);
  };

  const resetFilter = () => {
    setFilterUsername("");
    setFilterMobile("");
    setFilterAccountNumber("");
    setFilterMin("");
    setFilterMax("");
    setSelectedStartDate("");
    setSelectedEndDate("");
    setFilters({
      agent_id: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
    fetchWithdrawList(1);
  };

  // Export Functions
  const exportToXLSM = () => {
    const exportData = filteredList.map((item, index) => ({
      'Sr no.': (currentPage - 1) * limit + index + 1,
      'Username': item.user_name || "N/A",
      'Account Name': item.account_holder_name || "N/A",
      'Amount': item.amount || 0,
      'Bank Account': item.account_number || "N/A",
      'IFSC Code': item.ifsc_code || "N/A",
      'Agent Name': item.bank_name || "N/A",
      'Accepted By': item.transaction_by || "-",
      'Created Date': item.date_time ? moment(item.date_time).local().format("DD-MM-YYYY hh:mm A") : "N/A",
      'Status': item.status?.toUpperCase() || "APPROVE"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Withdrawals");
    XLSX.writeFile(wb, `withdrawals_history_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToCSV = () => {
    const exportData = filteredList.map((item, index) => ({
      'Sr no.': (currentPage - 1) * limit + index + 1,
      'Username': item.user_name || "N/A",
      'Account Name': item.account_holder_name || "N/A",
      'Amount': item.amount || 0,
      'Bank Account': item.account_number || "N/A",
      'IFSC Code': item.ifsc_code || "N/A",
      'Agent Name': item.bank_name || "N/A",
      'Accepted By': item.transaction_by || "-",
      'Created Date': item.date_time ? moment(item.date_time).local().format("DD-MM-YYYY hh:mm A") : "N/A",
      'Status': item.status?.toUpperCase() || "APPROVE"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Withdrawals");
    XLSX.writeFile(wb, `withdrawals_history_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportToExcel = () => {
    const exportData = filteredList.map((item, index) => ({
      'Sr no.': (currentPage - 1) * limit + index + 1,
      'Username': item.user_name || "N/A",
      'Account Name': item.account_holder_name || "N/A",
      'Amount': item.amount || 0,
      'Bank Account': item.account_number || "N/A",
      'IFSC Code': item.ifsc_code || "N/A",
      'Agent Name': item.bank_name || "N/A",
      'Accepted By': item.transaction_by || "-",
      'Created Date': item.date_time ? moment(item.date_time).local().format("DD-MM-YYYY hh:mm A") : "N/A",
      'Status': item.status?.toUpperCase() || "APPROVE"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Withdrawals");
    XLSX.writeFile(wb, `withdrawals_history_${new Date().toISOString().split('T')[0]}.xls`);
  };

  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: limit,
        mobile: filterMobile || undefined,
        agent_id: filters.agent_id || undefined,
        from_date: filters.startDate || selectedStartDate || undefined,
        to_date: filters.endDate || selectedEndDate || undefined,
        min: filterMin || undefined,
        max: filterMax || undefined,
      };

      const response = await getAllCompletedWithdrawalRequests(params);
      const result = response.data;

      if (result.success) {
        const mappedData = result.data.map((item) => ({
          _id: item._id,
          mobile: item.userId?.mobile || item.mobile || "N/A",
          amount: item.amount,
          account_number: item.accountNumber || "N/A",
          ifsc_code: item.ifscCode || "N/A",
          bank_name: item.bankName || "N/A",
          account_holder_name: item.accountHolderName || "N/A",
          user_name: item.userId?.user_name || item.user_name || item.userName || "N/A",
          status: item.status?.toLowerCase() || "success",
          remark: item.remark || "",
          reason: item.reason || "",
          date_time: item.createdAt,
          approved_date_time: item.approved_date_time,
          opening_balance: item.openingBalance,
          closing_balance: item.closingBalance,
          transaction_by: item.transactionBy || item.acceptedBy || "-",
          date: moment(item.createdAt).format("DD-MM-YYYY"),
          agent_name: item.agent_name || item.agentName || item.agent_id || "-",
        }));

        // Calculate totals from statusSummary
        const statusSummary = result.summary?.statusSummary || {};

        // Success/Approved total
        const approveSum = statusSummary.Success?.totalAmount ||
          statusSummary.success?.totalAmount ||
          statusSummary.approved?.totalAmount || 0;

        // Rejected total - "Rejected" string from API
        const declineSum = statusSummary.Rejected?.totalAmount ||
          statusSummary.rejected?.totalAmount || 0;

        setTotalWithdrawAmount(approveSum);
        setDeclineTotal(declineSum);

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
    <section>
      <div className="allcommon">
        <section className="main-inner-outer py-3">
          <div className="container-fluid">
            <div className="db-sec">
              <h2 className="common-heading">Wallet Withdrawal History</h2>
            </div>
            <div className="inner-wrapper">
              <div className="common-container">
                {/* Filter Section */}
                <form className="">
                  <div className="bet_status mb-0">
                    <div className="row">
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3 col-lg-2 col-sm-6">
                        <div className="position-relative">
                          <input
                            placeholder="Keyword"
                            type="text"
                            className="form-control"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3 col-lg-2 col-sm-6">
                        <div className="position-relative d-flex align-items-center">
                          <select
                            aria-label="Default select example"
                            className="small_select form-select"
                            style={{ height: "2.5rem" }}
                            value={filters.agent_id || ""}
                            onChange={(e) => handleFilterChange("agent_id", e.target.value)}
                          >
                            <option value="">Select Status</option>
                            {agentsList.map((agent) => (
                              <option key={agent._id} value={agent.admin_id}>
                                {agent.username || agent.admin_id}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3 col-lg-2 col-sm-6">
                        <div className="position-relative d-flex align-items-center">
                          <select
                            aria-label="Default select example"
                            className="small_select form-select"
                            style={{ height: "2.5rem" }}
                            value={filters.agent_id || ""}
                            onChange={(e) => handleFilterChange("agent_id", e.target.value)}
                          >
                            <option value="">Select Agent</option>
                            {agentsList.map((agent) => (
                              <option key={agent._id} value={agent.admin_id}>
                                {agent.username || agent.admin_id}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3 col-lg-3 col-sm-6">
                        <div className="bet-sec bet-period">
                          <label className="px-2 form-label">From</label>
                          <div className="form-group">
                            <input
                              type="date"
                              className="small_form_control form-control"
                              value={filters.startDate || selectedStartDate}
                              onChange={(e) => {
                                setSelectedStartDate(e.target.value);
                                handleFilterChange("startDate", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 flex-grow-0 ps-3 col-lg-3 col-sm-6">
                        <div className="bet-sec bet-period">
                          <label className="px-2 form-label">To</label>
                          <div className="form-group">
                            <input
                              type="date"
                              className="small_form_control form-control"
                              value={filters.endDate || selectedEndDate}
                              onChange={(e) => {
                                setSelectedEndDate(e.target.value);
                                handleFilterChange("endDate", e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 d-flex align-items-center col-lg-2 col-sm-6">
                        <ul className="list-unstyled mb-0 d-flex">
                          <li style={{ marginRight: 15 }}>
                            <button
                              type="button"
                              className="me-0 theme_light_btn btn btn-primary"
                              onClick={() => {
                                const today = moment().format("YYYY-MM-DD");
                                setSelectedStartDate(today);
                                setSelectedEndDate(today);
                                setFilters({ ...filters, startDate: today, endDate: today });
                              }}
                            >
                              Just For Today
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="me-0 theme_light_btn btn btn-primary"
                              onClick={() => {
                                const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
                                setSelectedStartDate(yesterday);
                                setSelectedEndDate(yesterday);
                                setFilters({ ...filters, startDate: yesterday, endDate: yesterday });
                              }}
                            >
                              From Yesterday
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="mb-lg-0 mt-2 d-flex align-items-center col-lg-2 col-sm-6">
                        <ul className="list-unstyled mb-0 d-flex">
                          <li>
                            <button
                              type="button"
                              className="theme_dark_btn btn btn-primary"
                              style={{ marginRight: 10 }}
                              onClick={applyFilter}
                            >
                              Search
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="theme_light_btn btn btn-primary"
                              onClick={resetFilter}
                            >
                              Reset
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        <button type="button" className="theme_dark_btn btn btn-primary" style={{ marginRight: 5 }} onClick={exportToXLSM}>
                          Export As XLSM
                        </button>
                        <button type="button" className="theme_dark_btn btn btn-primary" style={{ marginRight: 5 }} onClick={exportToCSV}>
                          Export As CSV
                        </button>
                        <button type="button" className="theme_dark_btn btn btn-primary" style={{ marginRight: 10 }} onClick={exportToExcel}>
                          Export As Excel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Summary Section */}
                <section className="total-balance-sec was">
                  <div className="px-0 container-fluid">
                    <ul className="list-unstyled" style={{ background: "black" }}>
                      <li>
                        <dt>Approve Withdrawal Amount</dt>
                        <strong>INR {totalWithdrawAmount.toFixed(2)}</strong>
                      </li>
                      <li>
                        <dt>Decline Withdrawal Amount</dt>
                        <strong>INR {declineTotal.toFixed(2)}</strong>
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Table Section */}
                <div className="account-table batting-table">
                  <div className="responsive">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <table id="export-table" className="table">
                        <thead>
                          <tr>
                            <th scope="col">Sr no.</th>
                            <th scope="col">Username</th>
                            <th scope="col">Account Name</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Bank Account</th>
                            <th scope="col">IFSC Code</th>
                            <th scope="col">Agent Name</th>
                            <th scope="col">Accepted By</th>
                            <th scope="col">Created Date</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredList.length > 0 ? (
                            filteredList.map((item, index) => (
                              <tr key={item._id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                <td>{item.user_name || "N/A"}</td>
                                <td>{item.account_holder_name || "N/A"}</td>
                                <td>₹{Number(item.amount || 0).toFixed(2)}</td>
                                <td>{item.account_number || "N/A"}</td>
                                <td>{item.ifsc_code || "N/A"}</td>
                                <td>{item.agent_name || "N/A"}</td>
                                <td>{item.transaction_by || "-"}</td>
                                <td>
                                  {item.date_time
                                    ? moment(item.date_time)
                                      .local()
                                      .format("DD-MM-YYYY hh:mm A")
                                    : "N/A"}
                                </td>
                                <td>
                                  <span
                                    className={`badge ${item.status === "success" || item.status === "approved" ? "text-dark" : item.status === "rejected" ? "text-dark" : "bg-warning"}`}
                                  >
                                    {item.status?.toUpperCase() || "APPROVE"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="10" className="text-center py-3">
                                <div className="text-muted">
                                  {searchTerm ||
                                    filterMobile ||
                                    filterUsername ||
                                    filterMin ||
                                    filterMax ||
                                    selectedStartDate
                                    ? "No matching records found. Try different search criteria."
                                    : "No withdrawals found."}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}

                    {/* Pagination */}
                    {!loading && filteredList.length >= 0 && (
                      <div className="card-footer d-flex justify-content-between align-items-center">
                        <span className="text-muted small">
                          Showing {(currentPage - 1) * limit + 1} to{" "}
                          {Math.min(currentPage * limit, filteredList.length)} of{" "}
                          {filteredList.length}
                        </span>

                        <ul className="custom-pagination pagination mb-0">
                          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={handlePrev}>
                              &laquo;
                            </button>
                          </li>

                          {[currentPage - 1, currentPage, currentPage + 1]
                            .filter((p) => p > 0 && p <= totalPages)
                            .map((p) => (
                              <li key={p} className={`page-item ${currentPage === p ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(p)}>
                                  {p}
                                </button>
                              </li>
                            ))}

                          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={handleNext}>
                              &raquo;
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Complete;