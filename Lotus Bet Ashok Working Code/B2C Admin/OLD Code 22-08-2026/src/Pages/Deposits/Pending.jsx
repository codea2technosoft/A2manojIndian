import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import Swal from "sweetalert2";
import { getAllDepositRequests, updateDepositStatus } from "../../Server/api";

const DepositePending = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeposite, setTotalDeposit] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    mobile: "",
    startDate: "",
    endDate: "",
  });

  const [fillter, setFillter] = useState(false);
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

  const navigate = useNavigate();

  useEffect(() => {
    fetchDeposits();
  }, [currentPage]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSelectAll = () => {
    const allIds = data.map((item) => item._id);
    setSelectAll(!selectAll);
    setSelectedIds(!selectAll ? allIds : []);
  };

  const handleClearFilter = () => {
    setFilters({
      mobile: "",
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

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const fetchDeposits = async (page = currentPage) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 50,
        mobile: filters.mobile || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: "success",
      };

      const res = await getAllDepositRequests(params);

      if (res.data.success) {
        const list = res.data.data;
        setData(list);
        setTotalRecords(res.data.totalRecords || list.length);
        setTotalPages(res.data.totalPages || 1);
        const total = list.reduce((sum, item) => sum + (item.amount || 0), 0);
        setTotalDeposit(total);
        
        // Calculate totals for summary cards
        let approveSum = 0;
        let declineSum = 0;
        let bonusSum = 0;
        
        list.forEach(item => {
          if (item.status === 'approved') approveSum += (item.amount || 0);
          if (item.status === 'rejected') declineSum += (item.amount || 0);
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

  const handleOpenStatusModal = async (id) => {
    const { value: formValues } = await Swal.fire({
      showCloseButton: true,
      title: "Update Deposit Status",
      html: `
      <div style="display:flex; flex-direction:column; gap:10px; text-align:left">
        <div class="mb-3">
        <label for="statusSelect" class="form-label">Status</label>
        <select id="statusSelect" class="form-select">
          <option value="">Select Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        </div>

      <div class="mb-3">
        <label for="notesInput" class="form-label">Admin Remark:</label>
        <textarea 
          id="notesInput"
          class="form-control"
          placeholder="Enter remark for user"
          rows="5"
        ></textarea>
      </div>
        
        <div id="errorMessage" style="color: red; display: none; font-size: 14px;">
          Remark is required when rejecting
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      didOpen: () => {
        const statusSelect = document.getElementById("statusSelect");
        const notesInput = document.getElementById("notesInput");
        const errorMessage = document.getElementById("errorMessage");

        statusSelect.addEventListener("change", function () {
          if (this.value === "rejected") {
            errorMessage.style.display = "block";
            notesInput.placeholder = "Enter rejection reason (required)";
          } else {
            errorMessage.style.display = "none";
            notesInput.placeholder = "Enter remark (optional)";
          }
        });
      },
      preConfirm: () => {
        const status = document.getElementById("statusSelect").value;
        const notes = document.getElementById("notesInput").value;

        if (!status) {
          Swal.showValidationMessage("Please select a status");
          return false;
        }

        if (status === "rejected" && !notes.trim()) {
          Swal.showValidationMessage("Please provide a reason for rejection");
          return false;
        }

        return { status, notes };
      },
    });

    if (formValues) {
      const { status, notes } = formValues;
      try {
        const res = await updateDepositStatus([id], {
          status: status.toLowerCase(),
          notes: notes.trim(),
        });
        if (res.data.success) {
          Swal.fire("Success", `Deposit ${status} successfully`, "success");
          fetchDeposits();
        } else {
          Swal.fire("Error", res.data.message || "Failed to update", "error");
        }
      } catch (err) {
        console.error("Update error:", err);
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Generate page numbers
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
                            value={filters.mobile}
                            onChange={(e) => handleFilterChange("mobile", e.target.value)}
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
                            <option value="pending">Pending</option>
                            <option value="approved">Approve</option>
                            <option value="rejected">Decline</option>
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
                              value={filters.startDate}
                              onChange={(e) => handleFilterChange("startDate", e.target.value)}
                            />
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
                        >
                          Export As XLSM
                        </button>
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          style={{ marginRight: 5 }}
                        >
                          Export As CSV
                        </button>
                        <button
                          type="button"
                          className="theme_dark_btn btn btn-primary"
                          style={{ marginRight: 10 }}
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
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="15" className="text-center">Loading...</td>
                          </tr>
                        ) : data.length === 0 ? (
                          <tr>
                            <td colSpan="15" className="text-center">No pending deposits found</td>
                          </tr>
                        ) : (
                          data.map((item, index) => (
                            <tr key={item._id}>
                              <td>{(currentPage - 1) * 50 + index + 1}</td>
                              <td>{item.userId?.username || item.userId?.mobile || "NA"}</td>
                              <td>{item.transactionId || "NA"}</td>
                              <td>{item.accountName || "NA"}</td>
                              <td>{item.bankName || "NA"}</td>
                              <td>{item.bankAccount || "NA"}</td>
                              <td>₹{item.amount || 0}</td>
                              <td>{item.transactionType || "Deposit"}</td>
                              <td className="p-0 m-0">
                                {item.receipt ? (
                                  <img
                                    src={item.receipt}
                                    style={{ width: 120, height: 100, objectFit: "contain" }}
                                    alt="receipt"
                                  />
                                ) : (
                                  "No Image"
                                )}
                              </td>
                              <td>{item.agentName || item.agentId?.username || "NA"}</td>
                              <td>{item.bonus || 0}</td>
                              <td>{item.acceptedBy || "-"}</td>
                              <td>{formatDateTime(item.createdAt)}</td>
                              <td>
                                <span className={`badge bg-${item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning'}`}>
                                  {item.status || "pending"}
                                </span>
                              </td>
                              <td>
                                {item.status === 'pending' && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleOpenStatusModal(item._id)}
                                  >
                                    Update Status
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
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

export default DepositePending;