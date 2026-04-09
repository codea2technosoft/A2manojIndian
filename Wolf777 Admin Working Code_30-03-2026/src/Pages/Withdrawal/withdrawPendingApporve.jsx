import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { getAllWithdrawRequests, updateWithdrawStatus, PreapproveupdateWithdrawStatus } from "../../Server/api";

const Pending = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const limit = 10;

  const ucWords = (str) => {
    if (!str) return ''; // Return empty string if str is null/undefined
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  // const handleAction = async (id, actionType) => {
  //   let apiUrl = `${process.env.REACT_APP_API_URL}/withdraw-status-update`;
  //   let newStatus = "";
  //   let reason = null;

  //   if (actionType === "success") {
  //     newStatus = "success";
  //   } else if (actionType === "reject") {
  //     newStatus = "reject";

  //     // Ask for reason first
  //     const { isConfirmed, value } = await Swal.fire({
  //       title: "Enter Rejection Reason",
  //       input: "textarea",
  //       inputPlaceholder: "Type your reason here...",
  //       inputAttributes: { "aria-label": "Type your reason here" },
  //       showCancelButton: true,
  //       confirmButtonText: "Submit",
  //       cancelButtonText: "Cancel",
  //       inputValidator: (value) => {
  //         if (!value) {
  //           return "You need to provide a reason!";
  //         }
  //       },
  //     });

  //     if (!isConfirmed) return; // Cancel clicked
  //     reason = value;
  //   }

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         id: id,
  //         status: newStatus,
  //         ...(reason ? { reason } : {}), // Only send reason if rejecting
  //       }),
  //     });

  //     const result = await response.json();

  //     if (result.success === "1") {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success",
  //         text: `Withdraw request ${newStatus} successfully.`,
  //         timer: 2000,
  //         showConfirmButton: false,
  //       });
  //       fetchWithdrawList(currentPage);
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Failed",
  //         text: result.message || "Action failed",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Status update error:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Something went wrong!",
  //     });
  //   }
  // };

  const handleAction = async (id, actionType, currentRemark = "") => {
    const { value: notes } = await Swal.fire({
      title: `${actionType === "approved" ? "Update Withdraw Status" : "Update Withdraw Status"}`,
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
        admin_approve: 'yes',
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


  // const handleWithdrawAction = async (id, actionType, currentRemark = "") => {
  //   const { value: notes } = await Swal.fire({
  //     title: `${actionType === "approved" ? "Approve" : "Reject"} Withdraw`,
  //     input: "textarea",
  //     inputLabel: actionType === "rejected" ? "Reason for Rejection (Required)" : "Add Remark (Optional)",
  //     inputPlaceholder: currentRemark ? `Current: ${currentRemark}` : "Enter notes...",
  //     inputValue: currentRemark || "",
  //     showCancelButton: true,
  //     confirmButtonText: `Yes, ${actionType}`,
  //     inputValidator: (value) => {
  //       if (actionType === "rejected" && !value.trim()) {
  //         return "Rejection reason is required!";
  //       }
  //     }
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
      let response;

      if (actionType === "approved") {
        // Use PreapproveupdateWithdrawStatus for approved
        response = await PreapproveupdateWithdrawStatus(id, {
          admin_approve: "yes",
          notes: notes || ""
        });
      } else {
        // Use updateWithdrawStatus for rejected
        response = await updateWithdrawStatus(id, {
          status: "rejected",
          notes: notes || ""
        });
      }

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

  const handleActionLedger = (userId, admin_id) => {

    console.log("admin_id", admin_id);
    console.log("user_id", userId);

    localStorage.setItem("user_id", userId);
    localStorage.setItem("admin_id", admin_id);

    navigate(`/userwallet/${userId}`);
  };
  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const [FilterUsername, setFilterUsername] = useState("");
  const [FilterAccountNumber, setFilterAccountNumber] = useState("");
  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
  const [selectedStartDate, setselectedStartDate] = useState("");
  const [selectedEndDate, setselectedEndDate] = useState("");
  // Search handler

  const handleSearchChangeusername = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUsername(value);
  };
  const handleSearchChangeAccountNumber = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterAccountNumber(value);
  };

  const handleSearchChangeMin = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMin(value);
  };
  const handleSearchChangeMax = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMax(value);
  };
  const setSelectedStartDate = (e) => {
    const value = e;
    setselectedStartDate(value);
  };
  const setSelectedEndDate = (e) => {
    const value = e;
    setselectedEndDate(value);
  };
  const handleFilter = (e) => {
    fetchWithdrawList();
  };
  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/withdraw-pending-approve-list`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            page: page.toString(),
            limit: limit.toString(),
            user_name: FilterUsername,
            min: FilterMin,
            max: FilterMax,
            startDate: selectedStartDate,
            endDate: selectedEndDate,
            AccountNumber: FilterAccountNumber,
          }),
        }
      );

      const result = await res.json();

      if (result.success === true) { // Changed from "1" to true
        // Map the API response to match your component's expected structure
        const mappedData = result.data.map(item => ({
          _id: item._id,
          user_id: item.userId?._id,
          user_name: item.userName || item.userId?.name,
          mobile: item.mobile || item.userId?.mobile,
          amount: item.amount,
          admin_id: item.admin_id,
          userId: item.userId,
          account_number: item.accountNumber,
          ifsc_code: item.ifscCode,
          bank_name: item.bankName,
          account_holder_name: item.accountHolderName,
          status: item.status,
          date: moment(item.createdAt).format("DD-MM-YYYY"),
          date_time: item.createdAt,
          // Add these if you have them in your API, otherwise set defaults
          total_count_deposit: item.total_count_deposit || 0,
          total_deposit: item.total_deposit || 0,
          total_count_withdraw: item.total_count_withdraw || 0,
          total_withdraw: item.total_withdraw || 0,
        }));

        setWithdrawList(mappedData || []);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        setWithdrawList([]);
        console.error("API Error:", result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">
              Withdraw Approve Pending List
            </h3>
            <div className="buttonlist">
              {/* <Link
                to="/user/create-user"
                className="btn button_add d-flex justify-content-center align-items-center"
              >
                <FaPlus />
                Add List
              </Link> */}
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {fillter && (
            <div className="row mb-2">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">User Name</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="User Name"
                      value={FilterUsername}
                      onChange={handleSearchChangeusername}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Account Number</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="User Name"
                      value={FilterAccountNumber}
                      onChange={handleSearchChangeAccountNumber}
                    />
                  </div>

                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Min Amount</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Min Amount"
                      value={FilterMin}
                      onChange={handleSearchChangeMin}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Max Amount</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Max Amount"
                      value={FilterMax}
                      onChange={handleSearchChangeMax}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Start Date</label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedStartDate}
                      onChange={(e) => setSelectedStartDate(e.target.value)}
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
                      onChange={(e) => setSelectedEndDate(e.target.value)}
                    />
                  </div>
                  <div className="form_latest_design">
                    <button
                      className="refreshbutton"
                      onClick={handleFilter} // Or any function you want to trigger
                    >
                      Filter
                    </button>
                  </div>
                  {/* <di className="form_latest_design"v>
                  <button className="btn btn-secondary">helo</button>
                </di> */}
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
                      <th>#</th>
                      <th>User Name</th>
                      <th>Mobile</th>
                      <th>Amount (₹)</th>
                      <th>Account Number</th>
                      <th>IFSC Code</th>
                      <th>Bank Name</th>
                      <th>A/C Holder Name</th>
                      <th>Deposit Count</th>
                      <th>Total Deposit</th>
                      <th>Withraw Count</th>
                      <th>Total Withdraw</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Date & Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length > 0 ? (
                      filteredList.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{ucWords(item.user_name)}</td>
                          <td>{item.mobile}</td>
                          <td>{item.amount}</td>
                          <td>{item.account_number}</td>
                          <td>{item.ifsc_code}</td>
                          <td>{item.bank_name}</td>
                          <td>{ucWords(item.account_holder_name)}</td>
                          <td>{item.total_count_deposit}</td>
                          <td>{item.total_deposit}</td>
                          <td>{item.total_count_withdraw}</td>
                          <td>{item.total_withdraw}</td>
                          <td>
                            <span
                              className={`badge ${item.status === "pending"
                                ? "bg-warning text-white"
                                : item.status === "success"
                                  ? "bg-success"
                                  : "bg-danger"
                                }`}
                            >
                              {item.status?.toUpperCase()}
                            </span>
                          </td>
                          <td>{item.date}</td>
                          {/* <td>{item.date_time}</td> */}
                          <td>
                            {moment(item.date_time).format("DD-MM-YYYY hh:mm A")}
                          </td>
                          {/* <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleAction(item._id, "success")}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleAction(item._id, "reject")}
                              >
                                Reject
                              </button>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleActionLedger(item.user_id)}
                              >
                                Ledger
                              </button>
                            </div>
                          </td> */}


                          <td className="d-flex gap-2">
                            {/* <button
  className="btn btn-sm btn-info"
  onClick={() => handleActionLedger(item.userId?._id, item.admin_id)}
>
  Ledger
</button> */}
    <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleWithdrawAction(item._id, "approved")}
                              >
                                Approve
                              </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleWithdrawAction(item._id, "rejected", item.remark)}
                            >
                              Reject
                            </button>
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => {
                                // console.log(item);
                                handleActionLedger(item.userId, item.admin_id);
                              }}
                            >
                              Ledger
                            </button>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center">
                          No pending withdrawals found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {filteredList.length > 0 && totalPages > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <button
                    className="paginationbutton"
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                  >
                    Previous
                  </button>
                  <span className="alllistnumber">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="paginationbutton"
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

export default Pending;
