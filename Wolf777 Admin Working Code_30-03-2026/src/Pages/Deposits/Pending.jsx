
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import Swal from "sweetalert2";
import {
  getAllDepositRequests,
  updateDepositStatus,
} from "../../Server/api";

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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

  // ✅ CHANGE #1: Default pending list show
  const fetchDeposits = async (page = currentPage) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        mobile: filters.mobile || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: "pending" 
      };


      const res = await getAllDepositRequests(params);

      if (res.data.success) {
        const list = res.data.data;
        setData(list);
        setTotalRecords(res.data.totalRecords || list.length);
        setTotalPages(res.data.totalPages || 1);
        const total = list.reduce((sum, item) => sum + (item.amount || 0), 0);
        setTotalDeposit(total);
      }
    } catch (err) {
      console.error("Deposit list fetch error:", err);
    } finally {
      setLoading(false);
    }
  };


 const handleOpenStatusModal = async (id) => {
  const { value: formValues } = await Swal.fire({
    title: "Update Deposit Status",
    html: `
      <div style="display:flex; flex-direction:column; gap:10px; text-align:left">
        <label>Status:</label>
        <select id="statusSelect" class="swal2-select">
          <option value="">Select Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <label>Admin Remark:</label>
        <textarea 
          id="notesInput" 
          class="swal2-textarea" 
          placeholder="Enter remark for user"
          rows="3"
        ></textarea>
        
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
      
      statusSelect.addEventListener("change", function() {
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
        notes: notes.trim() 
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
  // const PendingDepositApprove = async () => {
  //   if (!selectedIds.length) {
  //     return Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Please select at least one deposit.",
  //     });
  //   }

  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: `You are approving ${selectedIds.length} deposit request(s)!`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Approve",
  //   }).then(async (result) => {
  //     if (!result.isConfirmed) return;

  //     try {
  //       await updateDepositStatus(selectedIds, { status: "approved" });


  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: "Selected deposits approved successfully!",
  //       });

  //       fetchDeposits();
  //       setSelectedIds([]);
  //       setSelectAll(false);
  //     } catch (error) {
  //       console.error("Error approving:", error);
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Something went wrong while approving deposits.",
  //       });
  //     }
  //   });
  // };


  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Pending Deposit List</h3>
            <div className="buttonlist">
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
              {/* <button className="avoidbet" onClick={PendingDepositApprove}>
                Approve
              </button> */}
            </div>
          </div>
        </div>

        <div className="card-body">
          {fillter && (
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end flex-wrap">

                  {/* Mobile Filter */}
                  <div className="form_latest_design w-100">
                    <div className="label"><label>User Mobile</label></div>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.mobile}
                      onChange={(e) => handleFilterChange("mobile", e.target.value)}
                      placeholder="Enter mobile number"
                    />
                  </div>

                  {/* Start Date */}
                  <div className="form_latest_design w-100">
                    <div className="label"><label>Start Date</label></div>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    />
                  </div>

                  {/* End Date */}
                  <div className="form_latest_design w-100">
                    <div className="label"><label>End Date</label></div>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    />
                  </div>

                  <div className="d-flex gap-2 mt-2">
                    <button className="refreshbutton" onClick={handleFilter}>
                      Apply Filter
                    </button>
                    <button className="refreshbutton" onClick={handleClearFilter}>
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
                      
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(currentPage - 1) * 10 + index + 1}</td>
                         <td>{item.date_time}</td>
                         <td>{item.order_id}</td>
                          
                          <td>{item.mobile || "N/A"}</td>
                            <td>₹ {item.amount}</td>
                           
                            <td>{item.getway_name || "N/A"}</td>
                            <td>{item.deposit_type || "N/A"}</td>
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
                          
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleOpenStatusModal(item._id)}
                            >
                              Change Status
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {data.length > 0 && totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <span className="text-muted">
                    Page {currentPage} of {totalPages} (Total: {totalRecords})
                  </span>

                  <button
                    className="btn btn-outline-primary"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
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

export default DepositePending;
