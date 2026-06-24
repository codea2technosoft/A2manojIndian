import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";

const DepositGatewayWiseAll = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 10;

  const ucWords = (str) => {
    if (!str) return "NA";

    return str
      .replace(/[_-]/g, " ") // Replace snake_case or kebab-case with space
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // 🟢 Get query params
  const searchParams = new URLSearchParams(location.search);
  const defaultDateParam = searchParams.get("date"); // e.g. "2025-07-09"
  const defaultGatewayName = searchParams.get("getwayname"); // e.g. "rohit"
  const defaultAmount = searchParams.get("amount");
  const defaultUTR = searchParams.get("utr");

  const [amount, setAmount] = useState(defaultAmount || "");
  const [utr, setUTR] = useState(defaultUTR || "");
  const [UserName, setUserName] = useState("");
  const [mobile, setMobile] = useState("");

  const token = localStorage.getItem("token") || "";
  const { date } = useParams();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // const handleFilter = () => {
  //   setCurrentPage(1);

  //   const newSearch = new URLSearchParams();
  //   if (defaultDateParam) newSearch.set("date", defaultDateParam);
  //   if (defaultGatewayName) newSearch.set("getwayname", defaultGatewayName);
  //   if (amount.trim()) newSearch.set("amount", amount.trim());
  //   if (utr.trim()) newSearch.set("utr", utr.trim());

  //   navigate(`/deposit-list-report-getway-wise-all?${newSearch.toString()}`);

  //   setTimeout(fetchData, 0);
  // };

  // const handleFilter = () => {
  //   setCurrentPage(1);
  //   const newSearch = new URLSearchParams(location.search);
  //   if (defaultDateParam) newSearch.set("date", date);
  //   if (amount.trim()) newSearch.set("amount", amount.trim());
  //   else newSearch.delete("amount");

  //   if (utr.trim()) newSearch.set("utr", utr.trim());
  //   else newSearch.delete("utr");
  //   if (newSearch.get("getwayname") === null && defaultGatewayName) {
  //     newSearch.set("getwayname", defaultGatewayName);
  //   }
  //   // navigate(`/admin-deposit-detail?${newSearch.toString()}`);
  //   setTimeout(fetchData, 0);
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

  const [FilterUsername, setFilterUsername] = useState("");
  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");

  // Search handler

  const handleSearchChangeusername = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUsername(value);
  };

  const handleSearchChangeMin = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMin(value);
  };
  const handleSearchChangeMax = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMax(value);
  };
  const handleFilter = (e) => {
    fetchData();
  };
  const fetchData = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const body = {
        page: currentPage.toString(),
        date: date,
        min: FilterMin,
        max: FilterMax,
        username: FilterUsername,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}admin-deposit-datewiseAll`,
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
        setTotalPages(result.totalPages);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">All Admin Deposit Records</h3>
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
                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="">User Name</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      placeholder="User Name"
                      value={FilterUsername}
                      onChange={handleSearchChangeusername}
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
                      placeholder="Min Amount"
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
                      placeholder="Max Amount"
                      value={FilterMax}
                      onChange={handleSearchChangeMax}
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
          </div>
        )}

        {/* Table */}
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Mobile</th>
                  <th>Open Amount</th>
                  <th>Amount</th>
                  <th>Close Amount</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * perPage + index + 1}</td>
                      <td>{item.username}</td>
                      <td>{item.mobile}</td>
                      <td>₹ {item.open_amount}</td>
                      <td style={{ color: "green" }}>₹ {item.amount}</td>
                      <td>₹ {item.close_amount}</td>
                      <td>{item.remark}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {data.length > 0 && totalPages >= 1 && (
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

export default DepositGatewayWiseAll;
