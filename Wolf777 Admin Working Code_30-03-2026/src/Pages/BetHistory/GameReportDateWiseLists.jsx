import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";

const GameReportDateWiseLists = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  // const formatDate = (dateStr) => {
  //   if (!dateStr) return "NA";
  //   const date = new Date(dateStr);
  //   const day = String(date.getDate()).padStart(2, "0"); // 01 to 31
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // 01 to 12
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${day}-${month}-${year}`; // or change order if needed
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchReport();
  }, [currentPage]);

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

  const [selectedStartDate, setselectedStartDate] = useState("");
  const [selectedEndDate, setselectedEndDate] = useState("");
  // Search handler
  const setSelectedStartDate = (e) => {
    const value = e;
    setselectedStartDate(value);
  };
  const setSelectedEndDate = (e) => {
    const value = e;
    setselectedEndDate(value);
  };
  const handleFilter = () => {
    setCurrentPage(1);
    fetchReport();
  };
  const fetchReport = async () => {
    setLoading(true);

    const body = {
      page: currentPage,
    };
    if (selectedStartDate) {
      body.startdate = moment(selectedStartDate).format("DD-MM-YYYY");
    }

    if (selectedEndDate) {
      body.enddate = moment(selectedEndDate).format("DD-MM-YYYY");
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}game-report-datewaise`,
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
            <h3 className="card-title text-white">Win Bet List</h3>
            <div className="buttonlist">
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
            </div>
          </div>
        </div>

        {fillter && (
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  <div className="d-flex justify-content-start gap-3 w-100">
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
                  </div>
                  <div className="form_latest_design">
                    <button
                      className="refreshbutton"
                      onClick={handleFilter}
                    >
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card-body">
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
                      <th>Total Win Amount</th>
                      <th>Total Win Count</th>
                      <th>Total Loss Amount</th>
                      <th>Total Loss Count</th>
                      <th>Total P&L </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          <td>{(currentPage - 1) * 10 + index + 1}</td>
                          {/* <td>{item._id}</td> */}
                          {/* <td>{formatDate(item._id)}</td> */}
                          <td>
                            {moment(item._id, "DD-MM-YYYY").format(
                              "DD-MM-YYYY"
                            )}
                          </td>

                          <td>₹ {item.winTotalAmount}</td>
                          <td>{item.winTotalCount}</td>

                          <td>₹ {item.lossTotalAmount}</td>
                          <td>{item.lossTotalCount}</td>
                          <td
                            style={{
                              color: item.profitLoss <= 0 ? "red" : "green",
                            }}
                          >
                            {item.profitLoss}
                          </td>

                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                navigate(
                                  `/game_report_marketTypewaise/${item._id}`
                                )
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
            </>
          )}
          {/* ✅ Pagination Controls */}
          {data.length > 0 && totalPages > 0 && (
            <ul className="d-flex justify-content-between align-items-center mt-3 pl-0">
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
        </div>
      </div>
    </div>
  );
};

export default GameReportDateWiseLists;
