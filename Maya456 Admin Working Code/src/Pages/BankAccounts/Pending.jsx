import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";

const BankAccountPending = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  const limit = 10;

  const ucWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  const handleAction = async (id, actionType) => {
    let apiUrl = `${process.env.REACT_APP_API_URL}/bankAccount-status-update`;
    let newStatus = "";
    let reason = "";

    if (actionType === "success") {
      newStatus = "success";
    } else if (actionType === "reject") {
      newStatus = "reject";

      // Ask for reason before proceeding
      const { value, isConfirmed } = await Swal.fire({
        title: "Enter Rejection Reason",
        input: "textarea",
        inputPlaceholder: "Type your reason here...",
        inputAttributes: {
          "aria-label": "Type your reason here",
        },
        showCancelButton: true,
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "You need to provide a reason!";
          }
        },
      });

      if (!isConfirmed) {
        return; // User cancelled
      }

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
          reason: reason || undefined, // send only if reject
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
  const [FilterBankName, setFilterBankName] = useState("");
  // Search handler

  const handleSearchChangeusername = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUsername(value);
  };
  const handleSearchChangeAccountNumber = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterAccountNumber(value);
  };
  const handleSearchChangeBankName = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterBankName(value);
  };
  const handleFilter = (e) => {
    fetchWithdrawList();
  };
  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/bankAccount-pending-list`,
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
            username: FilterUsername,
            AccountNumber: FilterAccountNumber,
            BankName: FilterBankName,
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

  return (
    <div className="card mt-3">
      <div className="card-header bg-color-black">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title text-white">Bank Account Pending List</h3>
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
                    <label htmlFor="">Bank Name</label>
                  </div>
                  <input
                    type="text"
                    name="user_name"
                    className="form-control"
                    value={FilterBankName}
                    onChange={handleSearchChangeBankName}
                  />
                </div>
                <div className="form_latest_design">
                  <button
                    className="btn btn-info text-white"
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
                  {/* <th>Mobile</th> */}
                  <th>Account Number</th>
                  <th>IFSC Code</th>
                  <th>Bank Name</th>
                  <th>A/C Holder Name</th>
                  <th>Status</th>
                  <th>Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawList.length > 0 ? (
                  withdrawList.map((item, index) => (
                    <tr key={item._id}>
                      <td>{(currentPage - 1) * limit + index + 1}</td>
                      <td>{ucWords(item.user_name)}</td>
                      {/* <td>{item.mobile}</td> */}
                      <td>{item.account_number}</td>
                      <td>{item.ifsc_code}</td>
                      <td>{item.bank_name}</td>
                      <td>{ucWords(item.account_holder_name)}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "pending"
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
                        {moment(item.created_at).format("DD-MM-YYYY hh:mm A")}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleAction(item._id, "success")}
                          >
                            Success
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleAction(item._id, "reject")}
                          >
                            Reject
                          </button>
                        </div>
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
  );
};

export default BankAccountPending;
