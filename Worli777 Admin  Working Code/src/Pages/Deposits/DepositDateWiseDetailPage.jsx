import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";

const DepositGatewayWiseView = () => {
  const { date: defaultDateParam } = useParams();
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  const formatDate = (dateStr) => {
    if (!dateStr) return "NA";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0"); // 01 to 31
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 01 to 12
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(
    defaultDateParam ? new Date(defaultDateParam) : null
  );
  const [getwayname, setGetwayname] = useState("");

  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // const handleFilter = () => {
  //   setCurrentPage(1);
  //   fetchData();
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
  const [FilterGetwayName, setFilterGetwayName] = useState("");
  // Search handler

  const handleSearchChangeMin = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMin(value);
  };
  const handleSearchChangeMax = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMax(value);
  };
  const handleSearchChangeGetwayName = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterGetwayName(value);
  };

  const handleFilter = (e) => {
    fetchData();
  };
  const fetchData = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const body = {
        date: date.toISOString().split("T")[0],
        page: currentPage,
        min: FilterMin,
        max: FilterMax,
      };

      if (FilterGetwayName.trim() !== "") {
        body.getwayname = FilterGetwayName.trim();
      }

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}deposit-list-report-getway`,
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
  return (
    <div className="mt-4">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">
              Deposit Gateway-wise Summary
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

        {fillter && (
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Getway Name</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Min Amount"
                      value={FilterGetwayName}
                      onChange={handleSearchChangeGetwayName}
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
          </div>
        )}
      </div>

      {/* Table Rendering with Pagination */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Gateway Name</th>
              <th>Total Amount</th>
              <th>Total Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * perPage + index + 1}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.getway_name || "NA"}</td>
                  <td>₹ {item.totalAmount}</td>
                  <td>{item.totalCount}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        navigate(
                          `/deposit_list_report_getway_wise_all?date=${item.date}&getway_name=${item.getway_name}`
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
                <td colSpan="6" className="text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {/* ✅ Pagination Controls */}
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
  );
};

export default DepositGatewayWiseView;
