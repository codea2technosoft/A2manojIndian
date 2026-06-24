import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";

const AdminWithdrawalDateWiseDetailPage = () => {
  const { date: defaultDateParam } = useParams();

  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // const [date, setDate] = useState(
  //   defaultDateParam ? new Date(defaultDateParam) : null
  // );
  const [amount, setAmount] = useState("");
  const [username, setusername] = useState("");
  const [mobile, setmobile] = useState("");

  const perPage = 10;
  const token = localStorage.getItem("token") || "";

  const { date } = useParams();

  const ucWords = (str) => {
    if (!str) return "NA";
    return str
      .replace(/[_-]/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // const handleFilter = () => {
  //   setCurrentPage(1);
  //   fetchData(); // ✅ Just fetch data without navigating or changing URL
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
  const [FilterUserName, setFilterUserName] = useState("");
  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
  const [selectedStartDate, setselectedStartDate] = useState("");
  const [selectedEndDate, setselectedEndDate] = useState("");
  // Search handler

  const handleSearchChangeUserName = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUserName(value);
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
    fetchData();
  };
  const fetchData = async () => {
    if (!date) return;
    // alert("opopop");
    setLoading(true);
    try {
      const body = {
        page: currentPage.toString(),
        date: date, // always use this fixed date
        min: FilterMin,
        max: FilterMax,
        username: FilterUserName,
      };

      console.log("📤 API Body:", body);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}admin-withdraw-datewiseAll`,
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
      console.log("✅ API Response:", result);

      if (result.success === "1") {
        setData(result.data || []);
        const total = Number(result.totalRecords || 0);
        setTotalRecords(result.totalRecords);
        setTotalPages(result.totalNumberPage);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
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
              Withdraw Approve Pending List
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
                      <label htmlFor="">User Name</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Min Amount"
                      value={FilterUserName}
                      onChange={handleSearchChangeUserName}
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
      <div className="d-flex align-items-center justify-content-between">
        <h3>All Admin Withdraw Records</h3>
      </div>

      {/* 📊 Table */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
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
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * perPage + index + 1}</td>
                  <td>{ucWords(item.username)}</td>
                  <td>{item.mobile}</td>
                  <td>{item.open_amount}</td>
                  <td style={{ color: "red" }}>{item.amount}</td>
                  <td>₹ {item.close_amount}</td>
                  <td>{item.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No records found.</p>
      )}

      {/* ⏮️ Pagination */}
      {data.length > 0 && totalPages >= 1 && (
        <ul className=" pagination  d-flex justify-content-between align-items-center mt-3">
          <li
            className="pagination "
            disabled={currentPage === 1}
            onClick={handlePrev}
          >
            <span> Previous</span>
          </li>
          <li>
            <div class="d-flex gap-2 alllistnumber">
              Page
              <div>
                <div class=" active">
                  {currentPage} of {totalPages}
                </div>
              </div>
            </div>
          </li>

          <li
            className="pagination "
            disabled={currentPage === totalPages}
            onClick={handleNext}
          >
            <span>Next</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default AdminWithdrawalDateWiseDetailPage;
