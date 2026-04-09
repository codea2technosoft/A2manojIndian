import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";
import { getAdminWithdrawDetailsByDate } from "../../Server/api"; // adjust path

const AdminWithdrawalDateWiseDetailPage = () => {


  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
const [FilterMobileNumber, setFilterMobileNumber] = useState("");
const [FilterMin, setFilterMin] = useState("");
const [FilterMax, setFilterMax] = useState("");
const [amount, setAmount] = useState("");
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


  // Search handler

  const handleSearchMobileNumber = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMobileNumber(value);
  };
  const handleSearchChangeMin = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMin(value);
  };
;
 
 
  const handleFilter = (e) => {
    fetchData();
  };
const fetchData = async () => {
  if (!date) return;
  setLoading(true);
  try {
    const params = {
      page: currentPage,
      mobilenumber: FilterMobileNumber || "",
      minAmount: FilterMin || "",
      maxAmount: FilterMax || "",
    };

    const result = await getAdminWithdrawDetailsByDate(date, params);

    if (result.data.success) {
      setData(result.data.data || []);
      setTotalRecords(result.data.pagination?.total || 0);
      setTotalPages(result.data.pagination?.totalPages || 1);
    } else {
      setData([]);
      setTotalPages(1);
    }
  } catch (error) {
    console.error("Error fetching withdraw details:", error);
    setData([]);
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
              All Admin Withdraw Records
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
                      <label htmlFor="">Mobile Number</label>
                    </div>
                    <input
                      type="text"
                      name="mobile_number"
                      className="form-control"
                      // placeholder="Max Amount"
                      value={FilterMobileNumber}
                      onChange={handleSearchMobileNumber}
                    />
                  </div>

                  <div className="form_latest_design">
                    <button
                      className="refreshbutton"
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
       {/* 📊 Table */}
      {loading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Mobile</th>
                <th>Open Amount</th>
                <th>Amount</th>
                <th>Close Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * perPage + index + 1}</td>
                  <td>{item.phone}</td>
                  <td>{item.openingBalance}</td>
                  <td>{item.amount}</td>
                  <td>₹ {item.closingBalance}</td>
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
