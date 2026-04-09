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
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const limit = 10;
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [isFromDashboard, setIsFromDashboard] = useState(false);

  const ucWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };



  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  const handleAction = async (id, actionType) => {
    let apiUrl = "";
    let newStatus = "";

    if (actionType === "success") {
      apiUrl = `${process.env.REACT_APP_API_URL}/withdraw-status-update`;
      newStatus = "success";
    } else if (actionType === "reject") {
      apiUrl = `${process.env.REACT_APP_API_URL}/withdraw-status-update`;
      newStatus = "reject";
    }

    // try {
    //   const response = await fetch(apiUrl, {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       id: id,
    //       status: newStatus,
    //     }),
    //   });

    //   const result = await response.json();
    //   if (result.success === "1") {
    //     alert(`Withdraw request ${newStatus} successfully.`);
    //     fetchWithdrawList(currentPage);
    //   } else {
    //     alert(result.message || "Action failed");
    //   }
    // } catch (error) {
    //   console.error("Status update error:", error);
    //   alert("Something went wrong");
    // }
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
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const handleSelectAll = () => {
    const allIds = filteredList.map((item) => item._id);
    setSelectAll(!selectAll);
    setSelectedIds(!selectAll ? allIds : []);
  };
  const handleSingleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const PendingWithdrawApprove = async () => {
    if (!selectedIds || selectedIds.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please Select.",
      });
      return;
    }
    const payload = {
      selectedIds: selectedIds, // <- spelling fix
    };
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}Pending-Withdraw-Approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      fetchWithdrawList();
      if (data?.success === "1" || data?.code === 200) {
        Swal.fire({
          icon: "success",
          title: "Checked",
          text: data.message || "✅ Checked successfully!",
        });

        // ✅ Optional: Reset form fields
      } else {
        Swal.fire({
          icon: "error",
          title: "Declaration Failed",
          text: data.message || "❌ Result declaration failed.",
        });
      }
    } catch (error) {
      console.error("Error declaring result:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "❌ Server error while declaring result.",
      });
    }
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
  // const setSelectedStartDate = (e) => {
  //   const value = e;
  //   setselectedStartDate(value);
  // };
  // const setSelectedEndDate = (e) => {
  //   const value = e;
  //   setselectedEndDate(value);
  // };

  const setSelectedStartDate = (e) => {
    const value = e;
    setselectedStartDate(value);
    // जैसे ही user manually date change करे, isFromDashboard को false कर दो
    setIsFromDashboard(false);  // <-- यह नई लाइन
  };

  const setSelectedEndDate = (e) => {
    const value = e;
    setselectedEndDate(value);
    // जैसे ही user manually date change करे, isFromDashboard को false कर दो
    setIsFromDashboard(false);  // <-- यह नई लाइन
  };

  const handleFilter = (e) => {
    // Filter button click करने पर page 1 पर reset करो
    setCurrentPage(1);  // <-- नई लाइन
    fetchWithdrawList(1);
  };

  const handleResetFilters = () => {
    setFilterUsername("");
    setFilterAccountNumber("");
    setFilterMin("");
    setFilterMax("");
    setselectedStartDate("");
    setselectedEndDate("");
    setIsFromDashboard(false);  // <-- नई लाइन
    setCurrentPage(1);
    fetchWithdrawList(1);
  };

  // const fetchWithdrawList = async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_URL}/withdraw-pending-list`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           user_id: userId,
  //           page: page.toString(),
  //           limit: limit.toString(),
  //           user_name: FilterUsername,
  //           min: FilterMin,
  //           max: FilterMax,
  //           startDate: selectedStartDate,
  //           endDate: selectedEndDate,
  //           AccountNumber: FilterAccountNumber,
  //         }),
  //       }
  //     );

  //     const result = await res.json();

  //     if (result.success === "1") {
  //       setWithdrawList(result.data || []);
  //       setTotalPages(Number(result.totalNumberPage) || 1);
  //     } else {
  //       setWithdrawList([]);
  //       console.error("API Error:", result.message);
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      // URL से query parameters पढ़ें
      const urlParams = new URLSearchParams(window.location.search);
      const todaywithdraw = urlParams.get("todaywithdraw");
      const statusParam = urlParams.get("status");
      const allwithdraw = urlParams.get("allwithdraw");
      const showCount = urlParams.get("showCount");

      // Filter form की values use करें
      let startDateForFetch = selectedStartDate;
      let endDateForFetch = selectedEndDate;

      // अगर dashboard से todaywithdraw=yes आया है
      if (todaywithdraw === "yes" && !initialLoadDone && !isFromDashboard) {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];
        startDateForFetch = formattedDate;
        endDateForFetch = formattedDate;

        setselectedStartDate(formattedDate);
        setselectedEndDate(formattedDate);
        setIsFromDashboard(true);      // <-- नई लाइन
        setInitialLoadDone(true);      // <-- नई लाइन
      }

      // अगर allwithdraw=yes है तो date clear करें
      if (allwithdraw === "yes") {
        startDateForFetch = "";
        endDateForFetch = "";
      }

      const requestBody = {
        user_id: userId,
        page: page.toString(),
        limit: limit.toString(),
        user_name: FilterUsername,
        min: FilterMin,
        max: FilterMax,
        startDate: startDateForFetch,
        endDate: endDateForFetch,
        AccountNumber: FilterAccountNumber,
      };

      // Status parameter को भी add करें
      if (statusParam) {
        requestBody.status = statusParam;
      }

      console.log("Withdraw Pending API Payload:", requestBody);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/withdraw-pending-list`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
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
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="withdraw_pending d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Withdraw Pending List</h3>
            <div className="d-flex gap-2 w-50 justify-content-end">
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
              <button className="avoidbet" onClick={PendingWithdrawApprove}>
                Approve
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {fillter && (
            <div className="row mb-2">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  <div className="form_latest_design w-100">
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
                  <div className="form_latest_design w-100">
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

                  <div className="form_latest_design w-100">
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
                  <div className="form_latest_design w-100">
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
                  <div className="form_latest_design w-100">
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
                  <div className="form_latest_design w-100">
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
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-info text-white"
                      onClick={handleFilter} // Or any function you want to trigger
                    >
                      Filter
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </button>

                  </div>
                  {/* <di className="form_latest_design w-100"v>
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
                      <th>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                        <span className="ms-1">Select All </span>
                      </th>
                      <th>User Name</th>
                      {/* <th>Mobile</th> */}
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
                      <th>Date</th>
                      <th>Date & Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length > 0 ? (
                      filteredList.map((item, index) => (
                        <tr key={item._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item._id)}
                              onChange={() => handleSingleSelect(item._id)}
                            />
                            &nbsp;{index + 1}
                          </td>
                          <td>{ucWords(item.user_name)}</td>
                          {/* <td>{item.mobile}</td> */}
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
                                ? "bg-warning text-dark"
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
                            {moment(item.date_time).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </td>
                          <td>
                            {" "}
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => handleActionLedger(item.user_id)}
                            >
                              Ledger
                            </button>
                          </td>
                          {/* <td>
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
                    </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-center">
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
