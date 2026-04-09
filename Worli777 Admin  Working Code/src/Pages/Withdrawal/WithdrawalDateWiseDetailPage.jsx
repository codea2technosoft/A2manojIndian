import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";

const WithdrawalDateWiseDetailPage = () => {
  const { date: defaultDateParam } = useParams();

  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(
    defaultDateParam ? new Date(defaultDateParam) : null
  );
  const [amount, setAmount] = useState("");

  const perPage = 10;
  const token = localStorage.getItem("token") || "";

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

  const [FilterUsername, setFilterUsername] = useState("");
  const [FilterAccountNumber, setFilterAccountNumber] = useState("");
  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
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

  const handleFilter = (e) => {
    fetchData();
  };
  const fetchData = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const body = {
        page: currentPage.toString(),
        date: date.toISOString().split("T")[0], // always use this fixed date
        min: FilterMin,
        max: FilterMax,
        user_name: FilterUsername,
        account_number: FilterAccountNumber,
      };
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}withdraw-list-report-all`,
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
        // const total = Number(result.totalRecords || 0);
        setTotalRecords(result.pagination.totalRecords);
        setTotalPages(result.pagination.totalPages);
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-4">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">Withdraw List</h3>
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
        <h3>All Gateway Withdraw Records</h3>
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
                {/* <th>Mobile</th> */}
                <th>Account Number</th>
                <th>Bank Name</th>
                <th>IFSC Code</th>
                <th>Amount</th>
                <th>Holder Name</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * perPage + index + 1}</td>
                  <td>{ucWords(item.user_name)}</td>
                  {/* <td>{item.mobile}</td> */}
                  <td>{item.account_number || "NA"}</td>
                  <td>{item.bank_name || "NA"}</td>
                  <td>{item.ifsc_code || "NA"}</td>
                  <td>₹ {item.amount || "0"}</td>
                  <td>{ucWords(item.account_holder_name || "NA")}</td>
                  <td>{item.status || "NA"}</td>
                  <td>{item.date}</td>
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
        <ul className=" pagination  d-flex paginationgridnew justify-content-between align-items-center mt-3">
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

export default WithdrawalDateWiseDetailPage;
