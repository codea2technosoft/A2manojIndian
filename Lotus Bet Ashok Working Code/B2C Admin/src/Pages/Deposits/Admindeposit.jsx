import React, { useEffect, useState } from "react";
import { MdFilterListAlt } from "react-icons/md";
import Swal from "sweetalert2";
import { getAllDepositRequests, updateDepositStatus } from "../../Server/api";

const AdminDepositList = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalDepositAmount, setTotalDepositAmount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mobileFilter, setMobileFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState({ from_date: "", to_date: "", mobile: "" });
  const [imageBaseUrl, setImageBaseUrl] = useState("");

  const limit = 50;

  // Format date and time as shown in image: 05/07/2026, 17:38:17
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0";
    return Number(amount).toLocaleString("en-IN");
  };

  const getImageUrl = (screenshotPath) => {
    if (!screenshotPath) return null;
    let cleanPath = screenshotPath.replace(/\\/g, '/');
    cleanPath = cleanPath.replace(/\/+/g, '/');
    cleanPath = cleanPath.replace(/^\/+/, '');
    if (screenshotPath.startsWith('http://') || screenshotPath.startsWith('https://')) {
      return screenshotPath;
    }
    let baseUrl = imageBaseUrl;
    baseUrl = baseUrl.replace(/\/+$/, '');
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'http://' + baseUrl;
    }
    const url = `${baseUrl}/${cleanPath}`;
    return url;
  };

  // Fetch deposits from API
  // const fetchDeposits = async () => {
  //   setLoading(true);
  //   try {
  //     const params = {
  //       page: currentPage,
  //       limit,
  //       from_date: activeFilters.from_date,
  //       to_date: activeFilters.to_date,
  //       mobile: activeFilters.mobile,
  //       status: "pending",
  //     };

  //     const response = await getAllDepositRequests(params);

  //     if (response?.data?.success) {
  //       setDeposits(response.data.data || []);
  //       setTotalPages(response.data.pagination?.totalPages || 1);
  //       setTotalRecords(response.data.pagination?.total || 0);
  //       setTotalDepositAmount(response.data.summary?.totalDepositAmount || 0);
  //       setImageBaseUrl(response.data.image_url || 'http://192.168.1.21:3001');
  //     } else {
  //       setDeposits([]);
  //       setTotalPages(1);
  //       setTotalRecords(0);
  //       setTotalDepositAmount(0);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching deposit list:", error);
  //     setDeposits([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch deposits from API
  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
        from_date: activeFilters.from_date,
        to_date: activeFilters.to_date,
        mobile: activeFilters.mobile,
        status: "pending",
      };

      const response = await getAllDepositRequests(params);

      if (response?.data?.success) {
        setDeposits(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalRecords(response.data.pagination?.total || 0);
        setTotalDepositAmount(response.data.summary?.totalDepositAmount || 0);
        // Set imageBaseUrl from response
        if (response.data.image_url) {
          setImageBaseUrl(response.data.image_url);
        }
      } else {
        setDeposits([]);
        setTotalPages(1);
        setTotalRecords(0);
        setTotalDepositAmount(0);
      }
    } catch (error) {
      console.error("Error fetching deposit list:", error);
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  };


  // Update deposit status with modal
  // const handleOpenStatusModal = async (id) => {
  //   const { value: formValues } = await Swal.fire({
  //     showCloseButton: true,
  //     title: "Update Deposit Status",
  //     html: `
  //       <div style="display:flex; flex-direction:column; gap:10px; text-align:left">
  //         <div class="mb-3">
  //           <label for="statusSelect" class="form-label">Status</label>
  //           <select id="statusSelect" class="form-select">
  //             <option value="">Select Status</option>
  //             <option value="approved">Approve</option>
  //             <option value="rejected">Decline</option>
  //           </select>
  //         </div>
  //         <div class="mb-3">
  //           <label for="notesInput" class="form-label">Admin Remark:</label>
  //           <textarea 
  //             id="notesInput"
  //             class="form-control"
  //             placeholder="Enter remark for user"
  //             rows="3"
  //           ></textarea>
  //         </div>
  //         <div id="errorMessage" style="color: red; display: none; font-size: 14px;">
  //           Remark is required when rejecting
  //         </div>
  //       </div>
  //     `,
  //     focusConfirm: false,
  //     showCancelButton: true,
  //     confirmButtonText: "Update",
  //     didOpen: () => {
  //       const statusSelect = document.getElementById("statusSelect");
  //       const notesInput = document.getElementById("notesInput");
  //       const errorMessage = document.getElementById("errorMessage");

  //       statusSelect.addEventListener("change", function () {
  //         if (this.value === "rejected") {
  //           errorMessage.style.display = "block";
  //           notesInput.placeholder = "Enter rejection reason (required)";
  //         } else {
  //           errorMessage.style.display = "none";
  //           notesInput.placeholder = "Enter remark (optional)";
  //         }
  //       });
  //     },
  //     preConfirm: () => {
  //       const status = document.getElementById("statusSelect").value;
  //       const notes = document.getElementById("notesInput").value;

  //       if (!status) {
  //         Swal.showValidationMessage("Please select a status");
  //         return false;
  //       }

  //       if (status === "rejected" && !notes.trim()) {
  //         Swal.showValidationMessage("Please provide a reason for rejection");
  //         return false;
  //       }

  //       return { status, notes };
  //     },
  //   });

  //   if (formValues) {
  //     const { status, notes } = formValues;
  //     try {
  //       const res = await updateDepositStatus([id], {
  //         status: status.toLowerCase(),
  //         notes: notes.trim(),
  //       });
  //       if (res.data.success) {
  //         Swal.fire("Success", `Deposit ${status} successfully`, "success");
  //         fetchDeposits();
  //       } else {
  //         Swal.fire("Error", res.data.message || "Failed to update", "error");
  //       }
  //     } catch (err) {
  //       console.error("Update error:", err);
  //       Swal.fire("Error", "Something went wrong", "error");
  //     }
  //   }
  // };

  // Update deposit status with modal
  const handleOpenStatusModal = async (id, action) => {
    // action = 'approve' or 'reject'
    const isApprove = action === 'approve';
    const statusLabel = isApprove ? 'Approve' : 'Decline';
    const statusValue = isApprove ? 'approved' : 'rejected';

    const { value: formValues } = await Swal.fire({
      showCloseButton: true,
      title: `${statusLabel} Request?`,
      width: 400, // 👈 Choti size
      padding: '20px',
      html: `
        <div style="padding: 5px 0;">
          <div style="margin-bottom: 15px; text-align:center;">
           
          </div>
          <div style="text-align:left; margin-bottom: 10px;">
            <label style="font-weight:600; display:block; margin-bottom:5px; font-size:13px;">Admin Remark:</label>
            <textarea 
              id="notesInput"
              style="width:100%; padding:8px; border:1px solid #ddd; border-radius:6px; min-height:60px; font-size:13px;"
              placeholder="${isApprove ? 'Enter remark (optional)' : 'Enter rejection reason (required)'}"
            ></textarea>
          </div>
          ${!isApprove ? `
            <div style="color:#dc3545; font-size:12px; text-align:left; padding:6px 10px; background:#fff3f3; border-radius:4px; border-left:3px solid #dc3545;">
              ⚠️ Remark is required when rejecting
            </div>
          ` : ''}
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: statusLabel,
      confirmButtonColor: isApprove ? '#28a745' : '#dc3545',
      cancelButtonColor: '#dc3545',
      buttonsStyling: true,
      preConfirm: () => {
        const notes = document.getElementById("notesInput").value;

        if (!isApprove && !notes.trim()) {
          Swal.showValidationMessage("Please provide a reason for rejection");
          return false;
        }

        return { status: statusValue, notes: notes.trim() };
      },
    });

    if (formValues) {
      const { status, notes } = formValues;
      try {
        const res = await updateDepositStatus([id], {
          status: status,
          notes: notes,
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

  useEffect(() => {
    fetchDeposits();
  }, [currentPage, activeFilters]);

  const applyFilters = () => {
    setCurrentPage(1);
    setActiveFilters({
      from_date: startDate,
      to_date: endDate,
      mobile: mobileFilter,
    });
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setMobileFilter("");
    setCurrentPage(1);
    setActiveFilters({ from_date: "", to_date: "", mobile: "" });
    setFilterOpen(false);
  };

  const goToPage = (page) => setCurrentPage(page);
  const goPrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <section>
      <div className="allcommon">
        <section className="find-member-sec py-3">
          <div className="container-fluid">
            <div className="db-sec">
              <h2 className="common-heading">Wallet Deposit</h2>
            </div>
            <div className="inner-wrapper">
              <div className="common-container">
                {/* Filter Section */}
                {/* <div className="row mb-3">
                  <div className="col-md-12">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => setFilterOpen(!filterOpen)}
                    >
                      <MdFilterListAlt /> Filter
                    </button>
                  </div>
                </div> */}

                {filterOpen && (
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <div className="d-flex flex-wrap gap-2 align-items-end">
                        <div className="flex-grow-1" style={{ minWidth: "150px" }}>
                          <label>Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div className="flex-grow-1" style={{ minWidth: "150px" }}>
                          <label>End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                        <div className="flex-grow-1" style={{ minWidth: "150px" }}>
                          <label>Mobile Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter mobile number"
                            value={mobileFilter}
                            onChange={(e) => setMobileFilter(e.target.value)}
                          />
                        </div>
                        <div>
                          <button className="btn btn-primary me-2" onClick={applyFilters}>
                            Apply
                          </button>
                          <button className="btn btn-secondary" onClick={resetFilters}>
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="account-table batting-table">
                  <div className="responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Sr no.</th>
                         
                          <th scope="col">UserName</th>
                           <th scope="col">UTR</th>
                          <th scope="col">Transaction ID</th>
                          <th scope="col">Account Name</th>
                          <th scope="col">Bank Name</th>
                          <th scope="col">Bank Account</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Transaction Type</th>
                          <th scope="col">Transaction File</th>
                          <th scope="col">Receipt Date</th>
                          <th scope="col">Agent Name</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="12" className="text-center">Loading...</td>
                          </tr>
                        ) : deposits.length === 0 ? (
                          <tr>
                            <td colSpan="12" className="text-center">No Record Found.</td>
                          </tr>
                        ) : (
                          deposits.map((deposit, idx) => {
                            const imageUrl = getImageUrl(deposit.screenshot);
                            return (
                              <tr key={deposit._id}>
                                <td>{(currentPage - 1) * limit + idx + 1}</td>
                                <td>{deposit.user.username || "-"}</td>
                                <td>{deposit.utr || "-"}</td>
                                <td>{deposit.transaction_id || "-"}</td>
                                <td>{deposit.accountHolderName || "-"}</td>
                                <td>{deposit.bankName || "-"}</td>
                                <td>{deposit.accountNumber || "-"}</td>
                                <td>{formatCurrency(deposit.amount)}</td>
                                <td>{deposit.type || "Deposit"}</td>
                                <td>
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      style={{ width: 50, height: 50, objectFit: "contain", cursor: 'pointer' }}
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
                                <td>{formatDateTime(deposit.createdAt || deposit.requestDate)}</td>
                                <td>{deposit.agent_name || "-"}</td>
                                {/* <td>
                                  {deposit.status === 'pending' ? (
                                    <div className="d-flex gap-1">
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleOpenStatusModal(deposit._id)}
                                      >
                                        Approve
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleOpenStatusModal(deposit._id)}
                                      >
                                        Decline
                                      </button>
                                    </div>
                                  ) : (
                                    <span className={`badge ${deposit.status === 'approved' || deposit.status === 'success'
                                        ? 'bg-success'
                                        : 'bg-danger'
                                      }`}>
                                      {deposit.status || "pending"}
                                    </span>
                                  )}
                                </td> */}

                                <td>
                                  {deposit.status === 'pending' ? (
                                    <div className="d-flex gap-1">
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleOpenStatusModal(deposit._id, 'approve')}
                                      >
                                        Approve
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleOpenStatusModal(deposit._id, 'reject')}
                                      >
                                        Decline
                                      </button>
                                    </div>
                                  ) : (
                                    <span className={`badge ${deposit.status === 'approved' || deposit.status === 'success'
                                      ? 'bg-success'
                                      : 'bg-danger'
                                      }`}>
                                      {deposit.status || "pending"}
                                    </span>
                                  )}
                                </td>

                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
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
                            onClick={goPrev}
                            style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                          >
                            &lt;
                          </a>
                        </li>
                        {[...Array(totalPages).keys()].map((num) => (
                          <li key={num + 1} className="p-1">
                            <a
                              role="button"
                              className={currentPage === num + 1 ? "pagintion-li" : ""}
                              onClick={() => goToPage(num + 1)}
                              style={{
                                cursor: 'pointer',
                                fontWeight: currentPage === num + 1 ? 'bold' : 'normal',
                                backgroundColor: currentPage === num + 1 ? '#007bff' : 'transparent',
                                color: currentPage === num + 1 ? 'white' : 'inherit',
                                padding: '5px 10px',
                                borderRadius: '4px'
                              }}
                            >
                              {num + 1}
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
                            onClick={goNext}
                            style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                          >
                            &gt;
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AdminDepositList;