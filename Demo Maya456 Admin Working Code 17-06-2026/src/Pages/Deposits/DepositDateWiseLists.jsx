import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";

const DepositReport = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0"); // 01 to 31
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 01 to 12
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchReport();
  }, [currentPage]);

  // const handleFilter = () => {
  //   setCurrentPage(1);
  //   fetchReport();
  // };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
  const [selectedStartDate, setselectedStartDate] = useState("");
  const [selectedEndDate, setselectedEndDate] = useState("");
  // Search handler

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
    fetchReport();
  };
  const fetchReport = async () => {
    setLoading(true);

    const body = {
      page: currentPage,
      min: FilterMin,
      max: FilterMax,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    };

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}deposit-list-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await res.json();
      console.log("API result:", result);

      if (result.success === "1") {
        setData(result.data || []);
        setTotalPages(Number(result.totalNumberPage) || 1);
        setTotalRecords(Number(result.totalRecords) || 0);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("API error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Deposit Reject List</h3>
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
                  <div>
                    <button
                      className="btn btn-info text-white"
                      onClick={handleFilter} // Or any function you want to trigger
                    >
                      Filter
                    </button>
                  </div>
                  {/* <di className="form_latest_design w-100"v>
                  <button className="btn btn-secondary">helo</button>
                </di> */}
                </div>
              </div>
            </div>
        )}
      {/* 🔍 Date Filters */}
      {/* <div className="d-flex gap-2 justify-content-between mb-3">
        <div></div>
        <div className="d-flex gap-2">
          <div className="searchdeteails">
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className="form-control"
              placeholderText="Select From Date"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="searchdeteails">
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              className="form-control"
              placeholderText="Select To Date"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <div className="searchdeteails align-self-end">
            <button className="btn btn-primary" onClick={handleFilter}>
              Apply Filter
            </button>
          </div>
        </div>
      </div> */}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Total Count</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * 10 + index + 1}</td>
                      {/* <td>{item._id}</td> */}
                      <td>{formatDate(item._id)}</td>

                      <td>₹ {item.totalAmount}</td>
                      <td>{item.totalCount}</td>
                      <td>
                        {/* <button
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/deposit-report/${item._id}`)}
                        >
                          View
                        </button> */}
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            navigate(`/deposit_detail/${item._id}`)
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination Controls */}
          {data.length > 0 && totalPages > 0 && (
            <ul className="d-flex justify-content-between align-items-center mt-3">
              <li
                className="paginationbutton btn btn-secondary"
                disabled={currentPage === 1}
                onClick={handlePrev}
              >
                <span>Previous</span>
              </li>
              <span className="alllistnumber">
                Page {currentPage} of {totalPages}
              </span>
              <li
                className="paginationbutton btn btn-secondary"
                disabled={currentPage === totalPages}
                onClick={handleNext}
              >
                <span>Next</span>
              </li>
            </ul>
          )}
        </>
      )}
        </div>
      </div>

    </div>
  );
};

export default DepositReport;
