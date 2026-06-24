import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const DepositeComplete = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");
  const limit = 10;

  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [isFromDashboard, setIsFromDashboard] = useState(false);

  const ucWords = (str) => {
    if (!str || typeof str !== "string") return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

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

  const renderBankFields = (item) => {
    if (item.deposit_type === "qr_code") {
      return (
        <td>
          <strong>Gateway Name:</strong> {ucWords(item.getway_name) || "-"}{" "}
          <br />
          <strong>UPI:</strong> {item.upi_id || "-"}
        </td>
      );
    } else if (item.deposit_type === "bank_account") {
      return (
        <td>
          <strong>Gateway Name:</strong> {item.getway_name || "-"} <br />
          <strong>Account No:</strong> {item.account_number || "-"} <br />
          <strong>IFSC:</strong> {item.ifsc || "-"} <br />
          <strong>Bank:</strong> {ucWords(item.bank_name) || "-"}
        </td>
      );
    } else {
      return <td>-</td>; // fallback for unknown types
    }
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
  // const handleFilter = (e) => {
  //   fetchWithdrawList();
  // };

  const setSelectedStartDate = (e) => {
    const value = e;
    setselectedStartDate(value);
    setIsFromDashboard(false); // यह नई लाइन
  };

  const setSelectedEndDate = (e) => {
    const value = e;
    setselectedEndDate(value);
    setIsFromDashboard(false); // यह नई लाइन
  };

  // handleFilter में change:
  const handleFilter = (e) => {
    setCurrentPage(1); // यह नई लाइन
    fetchWithdrawList(1);
  };

  // const fetchWithdrawList = async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_URL}deposit-success-list`,
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
  //       // console.error("API Error:", result.message);
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //   const fetchWithdrawList = async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     // URL से query parameters पढ़ें
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const todaydeposit = urlParams.get("todaydeposit");
  //     const statusParam = urlParams.get("status");
  //     const alldeposit = urlParams.get("alldeposit");

  //     // Filter form की values use करें
  //     let startDateForFetch = selectedStartDate;
  //     let endDateForFetch = selectedEndDate;

  //     // अगर dashboard से todaydeposit=yes आया है
  //     if (todaydeposit === "yes") {
  //       const today = new Date();
  //       const formattedDate = today.toISOString().split("T")[0];
  //       startDateForFetch = formattedDate;
  //       endDateForFetch = formattedDate;

  //       // Filter form में भी दिखाने के लिए state update करें
  //       if (selectedStartDate === "") {
  //         setselectedStartDate(formattedDate);
  //       }
  //       if (selectedEndDate === "") {
  //         setselectedEndDate(formattedDate);
  //       }
  //     }

  //     // अगर alldeposit=yes है तो date clear करें
  //     if (alldeposit === "yes") {
  //       startDateForFetch = "";
  //       endDateForFetch = "";
  //     }

  //     const requestBody = {
  //       user_id: userId,
  //       page: page.toString(),
  //       limit: limit.toString(),
  //       user_name: FilterUsername,
  //       min: FilterMin,
  //       max: FilterMax,
  //       startDate: startDateForFetch,
  //       endDate: endDateForFetch,
  //       AccountNumber: FilterAccountNumber,
  //     };

  //     // Status parameter को भी add करें (deposit-success-list API को status की जरूरत होगी)
  //     if (statusParam) {
  //       requestBody.status = statusParam;
  //     }

  //     console.log("Deposite Complete API Payload:", requestBody);

  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_URL}deposit-success-list`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(requestBody),
  //       }
  //     );

  //     const result = await res.json();

  //     if (result.success === "1") {
  //       setWithdrawList(result.data || []);
  //       setTotalPages(Number(result.totalNumberPage) || 1);
  //     } else {
  //       setWithdrawList([]);
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // नया reset function:
  const handleResetFilters = () => {
    setFilterUsername("");
    setFilterMin("");
    setFilterMax("");
    setselectedStartDate("");
    setselectedEndDate("");
    setIsFromDashboard(false);
    setCurrentPage(1);
    fetchWithdrawList(1);
  };

  // Updated fetchWithdrawList function:
  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const todaydeposit = urlParams.get("todaydeposit");
      const statusParam = urlParams.get("status");
      const alldeposit = urlParams.get("alldeposit");

      let startDateForFetch = selectedStartDate;
      let endDateForFetch = selectedEndDate;

      // यह logic change करो:
      if (todaydeposit === "yes" && !initialLoadDone && !isFromDashboard) {
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];
        startDateForFetch = formattedDate;
        endDateForFetch = formattedDate;

        setselectedStartDate(formattedDate);
        setselectedEndDate(formattedDate);
        setIsFromDashboard(true);
        setInitialLoadDone(true);
      }

      if (alldeposit === "yes" && !isFromDashboard) {
        startDateForFetch = "";
        endDateForFetch = "";
        setselectedStartDate("");
        setselectedEndDate("");
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
        // AccountNumber: FilterAccountNumber, // यह comment out है
      };

      // Status parameter को भी add करें
      if (statusParam) {
        requestBody.status = statusParam;
      }

      console.log("Deposit Complete API Payload:", requestBody);

      // API URL में / add करो अगर missing है
      const apiUrl = `${process.env.REACT_APP_API_URL}/deposit-success-list`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await res.json();

      console.log("Deposit Complete API Response:", result);

      if (result.success === "1") {
        setWithdrawList(result.data || []);
        setTotalPages(Number(result.totalNumberPage) || 1);
      } else {
        setWithdrawList([]);
        console.log("API Error or no data:", result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setWithdrawList([]);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  const handleActionLedger = (user_id) => {
    navigate(`/ledger/${user_id}`);
  };
  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Deposit Completed List</h3>
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
                      // placeholder="User Name"
                      value={FilterUsername}
                      onChange={handleSearchChangeusername}
                    />
                  </div>
                  {/* <div className="form_latest_design">
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
                  </div> */}

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
                  <div className="form_latest_design d-flex gap-2">
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
                      <th>Amount</th>
                      <th>Order ID</th>
                      {/* <th>Account / UPI Info</th>
                      <th>ScreenShoot</th> */}
                      {/* <th>Status</th> */}
                      <th>Date & Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawList.length > 0 ? (
                      withdrawList.map((item, index) => (
                        <tr key={item._id}>
                          <td>{index + 1}</td>
                          <td>{ucWords(item.user_name)}</td>
                          {/* <td>{item.mobile}</td> */}
                          <td>₹ {item.amount}</td>
                          <td>{item.order_id}</td>
                          {/* {renderBankFields(item)} */}


                          {/* <td>
                            <a
                              href={`https://ankmatka.com/PaymentApi/uploads/${item.image}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`https://ankmatka.com/PaymentApi/uploads/${item.image}`}
                                width="100px"
                              />
                            </a>
                          </td> */}

                          {/* <td>
                            <span
                              className={`badge ${
                                item.status === "pending"
                                  ? "bg-warning text-dark"
                                  : item.status === "success"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {item.status?.toUpperCase()}
                            </span>
                          </td> */}

                          <td>
                            {moment(item.created_at).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
                          </td>
                          <td>
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
                        <td colSpan="7" className="text-center">
                          No Data Found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {withdrawList.length > 0 && totalPages > 0 && (
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

export default DepositeComplete;
