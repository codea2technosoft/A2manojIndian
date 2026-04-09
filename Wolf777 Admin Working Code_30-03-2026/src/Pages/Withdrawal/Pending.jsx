import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { getAllWithdrawRequests, updateWithdrawStatus } from "../../Server/api";

const Pending = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    user_name: "",
    mobileNumber: "",
    min: "",
    max: "",
  });

  const [fillter, setFillter] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const limit = 10;
  const navigate = useNavigate();

  const ucWords = (str) => str.replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAllWithdrawRequests({
        page,
        limit,
        user_name: filters.user_name,
        mobileNumber: filters.mobileNumber,
        min: filters.min,
        max: filters.max,
      });

      const result = response.data;
      if (result.success) {
        const mappedData = result.data.map((item) => ({
          _id: item._id,
          user_id: item.userId?._id,
          user_name: item.userName,
          mobile: item.userId?.mobile || "N/A",
          ifscCode: item.ifscCode || "N/A",
          amount: item.amount,
          mobile: item.mobile,
          account_holder_name: item.accountHolderName,
          accountNumber: item.accountNumber,
          bank_name: item.bankName,
          status: item.status.toLowerCase(),
          // date_time: item.requestDate,
          date: moment(item.requestDate).format("DD-MM-YYYY"),
          remark: item.remark,
        }));
        const pendingData = mappedData.filter((item) => item.status === "pending");
        setWithdrawList(pendingData);
        setTotalPages(result.pagination.totalPages || 1);
      } else {
        setWithdrawList([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchWithdrawList(1);
  };

  // const handleSelectAll = () => {
  //   const allIds = withdrawList.map((item) => item._id);
  //   setSelectAll(!selectAll);
  //   setSelectedIds(!selectAll ? allIds : []);
  // };

  // const handleSingleSelect = (id) => {
  //   setSelectedIds((prev) =>
  //     prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  //   );
  // };
  const handleWithdrawAction = async (id, actionType, currentRemark = "") => {
    const { value: notes } = await Swal.fire({
      title: `${actionType === "approved" ? "Approve" : "Reject"} Withdraw`,
      input: "textarea",
      inputLabel: actionType === "rejected" ? "Reason for Rejection (Required)" : "Add Remark (Optional)",
      inputPlaceholder: currentRemark ? `Current: ${currentRemark}` : "Enter notes...",
      inputValue: currentRemark || "",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionType}`,
      inputValidator: (value) => {
        if (actionType === "rejected" && !value.trim()) {
          return "Rejection reason is required!";
        }
      }
    });

    if (notes === undefined) return; // cancelled

    try {
      const response = await updateWithdrawStatus(id, {
        status: actionType,
        notes: notes || "",
      });

      const result = response.data;
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message,
        });
        fetchWithdrawList(currentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Withdraw update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update withdraw status.",
      });
    }
  };
  // const handleWithdrawAction = async (id, actionType) => {
  //   const { value: notes } = await Swal.fire({
  //     title: `${actionType === "approved" ? "Approve" : "Reject"} Withdraw`,
  //     input: "textarea",
  //     inputLabel: "Add Notes (optional)",
  //     inputPlaceholder: "Enter reason or notes...",
  //     showCancelButton: true,
  //     confirmButtonText: `Yes, ${(actionType)}`,
  //   });

  //   if (notes === undefined) return; // cancelled

  //   try {
  //     const response = await updateWithdrawStatus(id, {
  //       status: actionType,
  //       notes: notes || "",
  //     });

  //     const result = response.data;
  //     if (result.success) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: result.message,
  //       });
  //       fetchWithdrawList(currentPage);
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: result.message || "Something went wrong",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Withdraw update error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Failed to update withdraw status.",
  //     });
  //   }
  // };



  const handleActionLedger = (user_id) => {
    navigate(`/ledger/${user_id}`);
  };

  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="withdraw_pending d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Withdraw Pending List</h3>
            <div className="d-flex gap-2 w-50 justify-content-end">
              <div className="fillterbutton" onClick={() => setFillter(!fillter)}>
                <MdFilterListAlt /> Filter
              </div>
              {/* <button className="avoidbet" onClick={PendingWithdrawApprove}>
                Approve
              </button> */}
            </div>
          </div>
        </div>
        <div className="card-body">
          {fillter && (
            <div className="row mb-2">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  {/* <div className="form_latest_design w-100">
                    <label>User Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.user_name}
                      onChange={(e) =>
                        setFilters({ ...filters, user_name: e.target.value })
                      }
                    />
                  </div> */}
                  <div className="form_latest_design w-100">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.mobileNumber}
                      onChange={(e) =>
                        setFilters({ ...filters, mobileNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="form_latest_design w-100">
                    <label>Min Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      value={filters.min}
                      onChange={(e) =>
                        setFilters({ ...filters, min: e.target.value })
                      }
                    />
                  </div>
                  <div className="form_latest_design w-100">
                    <label>Max Amount</label>
                    <input
                      type="test"
                      className="form-control"
                      value={filters.max}
                      onChange={(e) =>
                        setFilters({ ...filters, max: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <button className="refreshbutton" onClick={handleFilter}>
                      Filter
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
                      <th>Sr.No</th>
                      <th>Mobile</th>
                      <th>Amount (₹)</th>
                      <th>Bank Name</th>
                      <th>IFSC Code</th>
                      <th>A/C Holder</th>
                      <th>Account Number</th>
                      <th>Date & Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawList.length > 0 ? (
                      withdrawList.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{item.mobile}</td>
                          <td>{item.amount}</td>
                          <td>{item.bank_name}</td>
                          <td>{item.ifscCode}</td>
                          <td>{item.account_holder_name}</td>
                          <td>{item.accountNumber}</td>

                          <td>{moment(item.date_time).format("DD-MM-YYYY HH:mm:ss")}</td>
                          <td className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleWithdrawAction(item._id, "approved", item.remark)}
                            >
                              Approve
                            </button>

                            {/* <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleWithdrawAction(item._id, "rejected", item.remark)}
                            >
                              Reject
                            </button> */}

                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => handleActionLedger(item.user_id)}
                            >
                              Ledger
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No pending withdrawals found.
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pending;
