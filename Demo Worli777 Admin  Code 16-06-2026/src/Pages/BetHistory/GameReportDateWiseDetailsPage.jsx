import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const GameReportDateWiseDetailsPage = () => {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();
  const perPage = 10;

  const { date } = useParams();
  const [dates, setDate] = useState("");

  useEffect(() => {
    if (date && moment(date, "YYYY-MM-DD", true).isValid()) {
      setDate(moment.utc(date).format("DD-MM-YYYY")); // Use UTC to avoid timezone shift
    } else {
      setDate(moment().format("DD-MM-YYYY")); // fallback
    }
    fetchData(date);
  }, [date]);

  const fetchData = async (date) => {
    if (!date) return;
    setLoading(true);
    try {
      const body = {
        date: date,
        page: currentPage,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}game-report-marketTypewaise`,
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
      console.log("API Response:", result);

      if (result.success === "1") {
        setData(result.data || []);
        const total = Number(result.totalRecords || 0);
        setTotalRecords(total);
        setTotalPages(Math.ceil(total / perPage));
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("API Error:", error);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {

  // }, [currentPage, dates]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="card mt-3">
      <div className="card-header bg-color-black">
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="card-title text-white">
            Game Report Market Type Waise
          </h3>
          <div className="button_design">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Total Win Amount</th>
                <th>Total Win Count</th>
                <th>Total Loss Amount</th>
                <th>Total Loss Count</th>
                <th>P&L</th>
                {/* <th>Date</th> */}
                <th>Market Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td>₹{item.winTotalAmount || 0}</td>
                      <td>{item.winTotalCount}</td>
                      <td>₹{item.lossTotalAmount || 0}</td>
                      <td>{item.lossTotalCount}</td>
                      <td
                        style={{
                          color: item.profitLoss <= 0 ? "red" : "green",
                        }}
                      >
                        {item.profitLoss}
                      </td>
                      {/* <td>{formattedDate}</td> */}
                      <td>{item.market_type}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            navigate(
                              `/game_report_marketIdwaise/${item.market_type}?date=${date}&markettype=${item.market_type}`
                            )
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {data.length > 0 && totalPages > 0 && (
            <ul className="d-flex paginationgridnew justify-content-between align-items-center mt-3">
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

export default GameReportDateWiseDetailsPage;
