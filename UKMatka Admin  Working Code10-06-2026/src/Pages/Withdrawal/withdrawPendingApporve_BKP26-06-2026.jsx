import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";

const Pending = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [checkingStatusId, setCheckingStatusId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const limit = 10;

  const ucWords = (str) => {
    if (!str) return "NA";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  const handleAction = async (id, actionType) => {
    let apiUrl = `${process.env.REACT_APP_API_URL}/withdraw-status-update`;
    let newStatus = "";
    let reason = null;

    if (actionType === "success") {
      newStatus = "success";
    } else if (actionType === "reject") {
      newStatus = "reject";

      const { isConfirmed, value } = await Swal.fire({
        title: "Enter Rejection Reason",
        input: "textarea",
        inputPlaceholder: "Type your reason here...",
        inputAttributes: { "aria-label": "Type your reason here" },
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "You need to provide a reason!";
          }
        },
      });

      if (!isConfirmed) return;
      reason = value;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: newStatus,
          ...(reason ? { reason } : {}),
        }),
      });

      const result = await response.json();

      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Withdraw request ${newStatus} successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        fetchWithdrawList(currentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: result.message || "Action failed",
        });
      }
    } catch (error) {
      console.error("Status update error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
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

  const handleActionLedger = (user_id) => {
    navigate(`/ledger/${user_id}`);
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

      if (result.success === "1") {
        setWithdrawList(result.data || []);
        setTotalPages(Number(result.totalNumberPage) || 1);
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

 
  const processGatewayPayout = async (payoutData) => {
    try {
      // Validate payout data
      if (!payoutData || !payoutData.amount) {
        throw new Error("Invalid payout data");
      }

      const params = new URLSearchParams({
        amount: payoutData.amount || 0,
        userid: payoutData.user_id || '',
        user_name: payoutData.user_name || '',
        mobile: payoutData.mobile || '',
        account_number: payoutData.account_number || '',
        bank_name: payoutData.bank_name || '',
        ifsc_code: payoutData.ifsc_code || '',
        account_holder_name: payoutData.account_holder_name || '',
        orderid: payoutData.orderid || payoutData._id || ''
      });

      const externalUrl = `https://payment.rcbmatka.com/payout/index.php?${params.toString()}`;
      console.log("Gateway URL:", externalUrl);
      
      const externalResponse = await fetch(externalUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const externalData = await externalResponse.json();
      console.warn("Gateway Response:", externalData);
      return externalData;
    } catch (error) {
      console.error("Error processing gateway payout:", error);
      throw error;
    }
  };

 
  const handleGatewayPayout = async (item) => {
    try {
      const result = await Swal.fire({
        title: "Gateway Payout",
        text: `Are you sure you want to process payout of ₹${item.amount} for ${item.user_name} via Gateway?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Process",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545"
      });

      if (!result.isConfirmed) return;

      // Show loading
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Process gateway payout
      const externalData = await processGatewayPayout(item);
      Swal.close();

      // Handle response
      if (externalData.success || externalData.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Payout processed via Gateway successfully.",
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: "#28a745"
        });
        fetchWithdrawList(currentPage);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: externalData.message || "Gateway processing failed",
          confirmButtonColor: "#dc3545"
        });
      }
    } catch (error) {
      console.error("Gateway processing error:", error);
      Swal.close();
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while processing Gateway payout.",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  
  const handleCheckStatus = async (id) => {
    setCheckingStatusId(id);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/payout-by-getway-checkstatus`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id
        }),
      });

      const data = await response.json();

      if (data.success === "1") {
        await Swal.fire({
          icon: "success",
          title: "Success",
          confirmButtonColor: "#28a745",
        });
        await fetchWithdrawList(currentPage);
        setCheckingStatusId(null);
      } else if (data.success === "2") {
        await Swal.fire({
          icon: "warning",
          title: "Pending",
          confirmButtonColor: "#94a728",
        });
        await fetchWithdrawList(currentPage);
        setCheckingStatusId(null);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.message || "Failed to check status",
          confirmButtonColor: "#dc3545",
        });
        await fetchWithdrawList(currentPage);
        setCheckingStatusId(null);
      }
    } catch (error) {
      console.error("Status check error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while checking status.",
        confirmButtonColor: "#dc3545",
      });
      await fetchWithdrawList(currentPage);
      setCheckingStatusId(null);
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
                      className="btn btn-info text-white"
                      onClick={handleFilter}
                    >
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
                      <th>#</th>
                      <th>User Name</th>
                      <th>Amount (₹)</th>
                      <th>Account Number</th>
                      <th>IFSC Code</th>
                      <th>Bank Name</th>
                      <th>A/C Holder Name</th>
                      <th>Deposit Count</th>
                      <th>Withdraw Payment Type</th>
                      <th>Total Deposit</th>
                      <th>Withraw Count</th>
                      <th>Total Withdraw</th>
                      <th>Status</th>
                      <th>Gateway Status</th>
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
                          <td>{item.amount || "NA"}</td>
                          <td>{item.account_number || "NA"}</td>
                          <td>{item.ifsc_code || "NA"}</td>
                          <td>{item.bank_name || "NA"}</td>
                          <td>{ucWords(item.account_holder_name || "NA")}</td>
                          <td>{item.total_count_deposit || "NA"}</td>
                          <td>
                            {item.withdraw_payment_type
                              ? item.withdraw_payment_type.replace(/_/g, " ")
                              : "NA"}
                          </td>
                          <td>{item.total_deposit || "NA"}</td>
                          <td>{item.total_count_withdraw || "NA"}</td>
                          <td>{item.total_withdraw || "NA"}</td>
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

                          <td>
                            <span
                              className={`badge ${item.getway_status == "pending" || !item.getway_status
                                ? "bg-warning text-white"
                                : item.getway_status == "success"
                                  ? "bg-success"
                                  : item.getway_status == "failed"
                                    ? "bg-danger"
                                    : "bg-secondary"
                                }`}
                            >
                              {item.getway_status?.toUpperCase() || "N/A"}
                            </span>
                          </td>
                          <td>{item.date}</td>
                          <td>
                            {moment(item.date_time).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              {!item.getway_status ? (
                                <>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() =>
                                      handleAction(item._id, "success")
                                    }
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleGatewayPayout(item)}
                                  >
                                    Gateway
                                  </button>
                                </>
                              ) : (
                                <button
                                  className="btn btn-sm btn-info"
                                  onClick={() => handleCheckStatus(item._id)}
                                  disabled={checkingStatusId === item._id}
                                >
                                  {checkingStatusId === item._id ? "Checking..." : "Check Status"}
                                </button>
                              )}

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
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="17" className="text-center">
                          No Data Found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {filteredList.length > 0 && totalPages > 0 && (
                <div className="d-flex paginationgridnew justify-content-between align-items-center mt-3">
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