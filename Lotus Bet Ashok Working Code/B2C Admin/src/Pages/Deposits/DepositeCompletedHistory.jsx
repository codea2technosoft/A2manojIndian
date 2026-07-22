import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCompletedDepositRequests, getAllAgentsLists } from "../../Server/api";
import * as XLSX from 'xlsx';

const DepositeCompletedHistory = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeposite, setTotalDeposit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [agentsList, setAgentsList] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    agent_id: "",
    startDate: "",
    endDate: "",
  });
  const [approveTotal, setApproveTotal] = useState(0);
  const [declineTotal, setDeclineTotal] = useState(0);
  const [bonusTotal, setBonusTotal] = useState(0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "NA";
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Get full image URL
  const getImageUrl = (screenshotPath) => {
    if (!screenshotPath) return null;

    if (screenshotPath.startsWith('http://') || screenshotPath.startsWith('https://')) {
      return screenshotPath;
    }

    if (screenshotPath.includes('192.168.1.21:3001') || screenshotPath.includes('localhost')) {
      let baseUrl = imageBaseUrl || '192.168.1.21:3001/';
      baseUrl = baseUrl.replace(/\/+$/, '');
      if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'http://' + baseUrl;
      }
      let cleanPath = screenshotPath.replace(/^\/+/, '');
      cleanPath = cleanPath.replace(/^192\.168\.1\.21:3001\//, '');
      cleanPath = cleanPath.replace(/^localhost:3001\//, '');
      cleanPath = cleanPath.replace(/^http:\/\/192\.168\.1\.21:3001\//, '');
      cleanPath = cleanPath.replace(/^https:\/\/192\.168\.1\.21:3001\//, '');
      cleanPath = cleanPath.replace(/^http:\/\/localhost:3001\//, '');
      cleanPath = cleanPath.replace(/^https:\/\/localhost:3001\//, '');
      return `${baseUrl}/${cleanPath}`;
    }

    let cleanPath = screenshotPath.replace(/\\/g, '/');
    cleanPath = cleanPath.replace(/\/+/g, '/');
    cleanPath = cleanPath.replace(/^\/+/, '');

    let baseUrl = imageBaseUrl || '192.168.1.21:3001/';
    baseUrl = baseUrl.replace(/\/+$/, '');
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'http://' + baseUrl;
    }

    return `${baseUrl}/${cleanPath}`;
  };

  const navigate = useNavigate();

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
    fetchDeposits();
  }, [currentPage]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilter = () => {
    setFilters({
      keyword: "",
      status: "",
      agent_id: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
    setTimeout(() => fetchDeposits(), 100);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchDeposits();
  };

  const fetchDeposits = async (page = currentPage) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 50,
        keyword: filters.keyword || undefined,
        status: filters.status || undefined,
        agent_id: filters.agent_id || undefined,
        from_date: filters.startDate || undefined,
        to_date: filters.endDate || undefined,
      };

      const res = await getAllCompletedDepositRequests(params);

      if (res.data.success) {
        const list = res.data.data;
        setData(list);
        setTotalPages(res.data.pagination?.totalPages || 1);

        if (res.data.image_url) {
          setImageBaseUrl(res.data.image_url);
        }

        const total = list.reduce((sum, item) => sum + (item.amount || 0), 0);
        setTotalDeposit(total);

        const statusSummary = res.data.summary?.statusSummary || {};
        const approveSum = statusSummary.success?.totalAmount ||
          statusSummary.approved?.totalAmount || 0;
        const declineSum = statusSummary.rejected?.totalAmount || 0;

        let bonusSum = 0;
        list.forEach(item => {
          bonusSum += (item.bonus || 0);
        });

        setApproveTotal(approveSum);
        setDeclineTotal(declineSum);
        setBonusTotal(bonusSum);
      }
    } catch (err) {
      console.error("Deposit list fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Export Functions
  const exportToXLSM = () => {
    const exportData = data.map((item, index) => ({
      'Sr no.': (currentPage - 1) * 50 + index + 1,
      'Username': item.user?.username || item.userId?.username || "NA",
      'Transaction ID': item.transaction_id || item.transactionId || "NA",
      'Account Name': item.accountHolderName || "NA",
      'Bank Name': item.bankName || "NA",
      'Bank Account': item.accountNumber || "NA",
      'Amount': item.amount || 0,
      'Transaction Type': item.type || "Deposit",
      'Agent Name': item.agent_name || item.agentName || item.agent_id || "NA",
      'Bonus': item.bonus || 0,
      'Accepted By': item.notes || item.acceptedBy || "-",
      'Created Date': formatDateTime(item.createdAt || item.processedDate),
      'Status': item.status || "pending"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deposits");
    XLSX.writeFile(wb, `deposits_history_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToCSV = () => {
    const exportData = data.map((item, index) => ({
      'Sr no.': (currentPage - 1) * 50 + index + 1,
      'Username': item.user?.username || item.userId?.username || "NA",
      'Transaction ID': item.transaction_id || item.transactionId || "NA",
      'Account Name': item.accountHolderName || "NA",
      'Bank Name': item.bankName || "NA",
      'Bank Account': item.accountNumber || "NA",
      'Amount': item.amount || 0,
      'Transaction Type': item.type || "Deposit",
      'Agent Name': item.agent_name || item.agentName || item.agent_id || "NA",
      'Bonus': item.bonus || 0,
      'Accepted By': item.notes || item.acceptedBy || "-",
      'Created Date': formatDateTime(item.createdAt || item.processedDate),
      'Status': item.status || "pending"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deposits");
    XLSX.writeFile(wb, `deposits_history_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportToExcel = () => {
    const exportData = data.map((item, index) => ({
      'Sr no.': (currentPage - 1) * 50 + index + 1,
      'Username': item.user?.username || item.userId?.username || "NA",
      'Transaction ID': item.transaction_id || item.transactionId || "NA",
      'Account Name': item.accountHolderName || "NA",
      'Bank Name': item.bankName || "NA",
      'Bank Account': item.accountNumber || "NA",
      'Amount': item.amount || 0,
      'Transaction Type': item.type || "Deposit",
      'Agent Name': item.agent_name || item.agentName || item.agent_id || "NA",
      'Bonus': item.bonus || 0,
      'Accepted By': item.notes || item.acceptedBy || "-",
      'Created Date': formatDateTime(item.createdAt || item.processedDate),
      'Status': item.status || "pending"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Deposits");
    XLSX.writeFile(wb, `deposits_history_${new Date().toISOString().split('T')[0]}.xls`);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section>
      <div className="allcommon">
        <section className="main-inner-outer py-3">
          <div className="container-fluid">
            <div className="db-sec">
              <h2 className="common-heading">Wallet Deposit History</h2>
            </div>
            <div className="inner-wrapper">
              <div className="common-container">
                <form className="">
                  <div className="bet_status mb-0">
                    <div className="row">
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3 col-lg-2 col-sm-6">
                        <div className="position-relative">
                          <input
                            placeholder="Keyword"
                            type="text"
                            className="form-control"
                            value={filters.keyword}
                            onChange={(e) => handleFilterChange("keyword", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3 col-lg-2 col-sm-6">
                        <div className="position-relative d-flex align-items-center">
                          <select
                            aria-label="Default select example"
                            className="small_select form-select"
                            style={{ height: "2.5rem" }}
                            value={filters.status || ""}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                          >
                            <option value="">Select Status</option>
                            <option value="success">Approve</option>
                            <option value="rejected">Decline</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3 col-lg-2 col-sm-6">
                        <div className="position-relative d-flex align-items-center">
                          <div className="mb-lg-0 mb-3 flex-grow-0 pe-3 col-lg-2 col-sm-6">
                            <div className="position-relative d-flex align-items-center">
                              <select
                                aria-label="Default select example"
                                className="small_select form-select"
                                style={{ height: "2.5rem" }}
                                value={filters.agent_id || ""}
                                onChange={(e) => handleFilterChange("agent_id", e.target.value)}
                              >
                                <option value="">All Agent</option>
                                {agentsList.map((agent) => (
                                  <option key={agent._id} value={agent.admin_id}>
                                    {agent.username || agent.admin_id}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-lg-0 mb-3 flex-grow-0 pe-3 col-lg-3 col-sm-6">
                        <div className="bet-sec bet-period">
                          <label className="px-2 form-label">From</label>
                          <div className="form-group">
                            <input
                              type="date"
                              className="small_form_control form-control"
                              value={filters.startDate}
                              onChange={(e) => handleFilterChange("startDate", e.target.value)}
                            />
                            <input placeholder="00:00" disabled type="text" className="small_form_control form-control"></input>
                          </div>
                        </div>
                      </div>
                      <div className="mb-lg-0 mb-3 flex-grow-0 ps-3 col-lg-2 col-sm-6">
                        <div className="bet-sec bet-period">
                          <label className="px-2 form-label">To</label>
                          <div className="form-group">
                            <input
                              type="date"
                              className="small_form_control form-control"
                              value={filters.endDate}
                              onChange={(e) => handleFilterChange("endDate", e.target.value)}
                            />
                            <input placeholder="23:59" disabled type="text" className="small_form_control form-control"></input>
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
                                const today = new Date().toISOString().split('T')[0];
                                setFilters({ ...filters, startDate: today, endDate: today });
                                setTimeout(() => fetchDeposits(), 100);
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
                                const today = new Date();
                                const yesterday = new Date(today);
                                yesterday.setDate(yesterday.getDate() - 1);
                                setFilters({
                                  ...filters,
                                  startDate: yesterday.toISOString().split('T')[0],
                                  endDate: today.toISOString().split('T')[0]
                                });
                                setTimeout(() => fetchDeposits(), 100);
                              }}
                            >
                              From Yesterday
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-2 d-flex align-items-center col-lg-3 col-sm-6" style={{ marginBottom: 10 }}>
                        <ul className="list-unstyled mb-0 d-flex">
                          <li>
                            <button
                              type="button"
                              className="theme_dark_btn btn btn-primary"
                              style={{ marginRight: 10 }}
                              onClick={handleFilter}
                            >
                              Search
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="theme_light_btn btn btn-primary"
                              onClick={handleClearFilter}
                            >
                              Reset
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div style={{ display: "flex", justifyContent: "end" }}>
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          style={{ marginRight: 5 }}
                          onClick={exportToXLSM}
                        >
                          Export As XLSM
                        </button>
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          style={{ marginRight: 5 }}
                          onClick={exportToCSV}
                        >
                          Export As CSV
                        </button>
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          style={{ marginRight: 10 }}
                          onClick={exportToExcel}
                        >
                          Export As Excel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <section className="total-balance-sec was">
                  <div className="px-0 container-fluid">
                    <ul className="list-unstyled" style={{ background: "black" }}>
                      <li>
                        <dt>Approve Deposit Amount</dt>
                        <strong>INR {approveTotal.toFixed(2)}</strong>
                      </li>
                      <li>
                        <dt>Decline Deposit Amount</dt>
                        <strong>INR {declineTotal.toFixed(2)}</strong>
                      </li>
                      <li>
                        <dt>Total Bonus Amount</dt>
                        <strong>INR {bonusTotal.toFixed(2)}</strong>
                      </li>
                    </ul>
                  </div>
                </section>

                <div className="account-table batting-table">
                  <div className="responsive">
                    <table id="export-table" className="table">
                      <thead>
                        <tr>
                          <th scope="col">Sr no.</th>
                          <th scope="col">Username</th>
                          <th scope="col">Transaction ID</th>
                          <th scope="col">Account Name</th>
                          <th scope="col">Bank Name</th>
                          <th scope="col">Bank Account</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Transaction Type</th>
                          <th scope="col">Transaction File</th>
                          <th scope="col">Agent Name</th>
                          <th scope="col">Bonus</th>
                          <th scope="col">Accepted By</th>
                          <th scope="col">Created Date</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="14" className="text-center">Loading...</td>
                          </tr>
                        ) : data.length === 0 ? (
                          <tr>
                            <td colSpan="14" className="text-center">No deposits found</td>
                          </tr>
                        ) : (
                          data.map((item, index) => {
                            const imageUrl = getImageUrl(item.screenshot || item.screenshot_url);

                            return (
                              <tr key={item._id}>
                                <td>{(currentPage - 1) * 50 + index + 1}</td>
                                <td>{item.user?.username || item.userId?.username || "NA"}</td>
                                <td>{item.transaction_id || item.transactionId || "NA"}</td>
                                <td>{item.accountHolderName || "NA"}</td>
                                <td>{item.bankName || "NA"}</td>
                                <td>{item.accountNumber || "NA"}</td>
                                <td>₹{item.amount || 0}</td>
                                <td>{item.type || "Deposit"}</td>
                                <td className="p-0 m-0">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      style={{ width: 120, height: 100, objectFit: "contain", cursor: "pointer" }}
                                      alt="receipt"
                                      onClick={() => window.open(imageUrl, '_blank')}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = 'Image not found';
                                      }}
                                    />
                                  ) : (
                                    "No Image"
                                  )}
                                </td>
                                <td>{item.agent_name || item.agentName || item.agent_id || "NA"}</td>
                                <td>{item.bonus || 0}</td>
                                <td>{item.notes || item.acceptedBy || "-"}</td>
                                <td>{formatDateTime(item.createdAt || item.processedDate)}</td>
                                <td>
                                  <span className={`badge bg-${item.status === 'approved' || item.status === 'success' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning'}`}>
                                    {item.status || "pending"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="bottom-pagination">
                    <ul role="navigation" aria-label="Pagination">
                      <li className={`previous ${currentPage === 1 ? 'disabled' : ''}`}>
                        <a
                          className=""
                          tabIndex={-1}
                          role="button"
                          aria-disabled={currentPage === 1}
                          aria-label="Previous page"
                          rel="prev"
                          onClick={handlePrev}
                          style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                          &lt;
                        </a>
                      </li>
                      {getPageNumbers().map((page) => (
                        <li key={page} className="p-1">
                          <a
                            role="button"
                            className={currentPage === page ? "pagintion-li" : ""}
                            onClick={() => setCurrentPage(page)}
                            style={{
                              cursor: 'pointer',
                              fontWeight: currentPage === page ? 'bold' : 'normal',
                              backgroundColor: currentPage === page ? '#007bff' : 'transparent',
                              color: currentPage === page ? 'white' : 'inherit',
                              padding: '5px 10px',
                              borderRadius: '4px'
                            }}
                          >
                            {page}
                          </a>
                        </li>
                      ))}
                      <li className={`next ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <a
                          className=""
                          tabIndex={0}
                          role="button"
                          aria-disabled={currentPage === totalPages}
                          aria-label="Next page"
                          rel="next"
                          onClick={handleNext}
                          style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                          &gt;
                        </a>
                      </li>
                    </ul>
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

export default DepositeCompletedHistory;