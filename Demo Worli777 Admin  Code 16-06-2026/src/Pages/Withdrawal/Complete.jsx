import React, { useEffect, useState } from "react";
import moment from "moment";
import { MdFilterListAlt } from "react-icons/md";

const Complete = ({ userId }) => {
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
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

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
  // नई लाइन:
  setIsFromDashboard(false);
};

const setSelectedEndDate = (e) => {
  const value = e;
  setselectedEndDate(value);
  // नई लाइन:
  setIsFromDashboard(false);
};

  // const handleFilter = (e) => {
  //   fetchWithdrawList();
  // };

  const handleFilter = (e) => {
  // नई लाइन:
  setCurrentPage(1);
  fetchWithdrawList(1);
};

const handleResetFilters = () => {
  setFilterUsername("");
  setFilterAccountNumber("");
  setFilterMin("");
  setFilterMax("");
  setselectedStartDate("");
  setselectedEndDate("");
  setIsFromDashboard(false);
  setCurrentPage(1);
  fetchWithdrawList(1);
};


  // const fetchWithdrawList = async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(
  //       `${process.env.REACT_APP_API_URL}/withdraw-success-list`,
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
    const urlParams = new URLSearchParams(window.location.search);
    const todaywithdraw = urlParams.get("todaywithdraw");
    const statusParam = urlParams.get("status");
    const allwithdraw = urlParams.get("allwithdraw");
    
    let startDateForFetch = selectedStartDate;
    let endDateForFetch = selectedEndDate;
    
    // यह logic change हुआ है:
    if (todaywithdraw === "yes" && !initialLoadDone && !isFromDashboard) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      startDateForFetch = formattedDate;
      endDateForFetch = formattedDate;
      
      setselectedStartDate(formattedDate);
      setselectedEndDate(formattedDate);
      setIsFromDashboard(true);
      setInitialLoadDone(true);
    }
    
    if (allwithdraw === "yes" && !isFromDashboard) {
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
      AccountNumber: FilterAccountNumber,
    };
    
    if (statusParam) {
      requestBody.status = statusParam;
    }

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/withdraw-success-list`,
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
            <h3 className="card-title text-white">Sucess Withdraw List</h3>

            {/* <div className="d-flex justify-content-between">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name / mobile / amount/bank name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}

             <div>
                    <button
                      className="btn btn-info text-white"
                      onClick={fillterdata} // Or any function you want to trigger
                    >
                      Filter
                    </button>
                   

                  </div>

            {/* <div className="buttonlist"> */}
              {/* <Link
                to="/user/create-user"
                className="btn button_add d-flex justify-content-center align-items-center"
              >
                <FaPlus />
                Add List
              </Link> */}
              {/* <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter

                 <button
                      className="btn btn-secondary"
                      onClick={handleResetFilters}  
                    >
                      Reset
                    </button>
                    
              </div> */}

        
            {/* </div> */}
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
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    {/* <th>Mobile</th> */}
                    <th>Amount (₹)</th>
                    <th>Account Number</th>
                    <th>IFSC Code</th>
                    <th>Bank Name</th>
                    <th>A/C Holder Name</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length > 0 ? (
                    filteredList.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>{ucWords(item.user_name) || "NA"}</td>
                        {/* <td>{item.mobile}</td> */}
                        <td>{item.amount || "0"}</td>
                        <td>{item.account_number || "NA"}</td>
                        <td>{item.ifsc_code || "NA"}</td>
                        <td>{item.bank_name || "NA"}</td>
                        <td>{ucWords(item.account_holder_name || "NA")}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.status === "success"
                                ? "bg-success text-white"
                                : item.status === "success"
                                ? "bg-success"
                                : "bg-success"
                            }`}
                          >
                            {item.status?.toUpperCase()}
                          </span>
                        </td>
                        <td>{item.date}</td>
                        {/* <td>{item.date_time}</td> */}
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

export default Complete;
