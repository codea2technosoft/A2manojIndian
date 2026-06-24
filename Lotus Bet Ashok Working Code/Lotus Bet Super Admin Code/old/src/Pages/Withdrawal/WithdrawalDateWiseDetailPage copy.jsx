import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

  const fetchData = async () => {
    if (!date) return;

    setLoading(true);
    try {
      const body = {
        page: currentPage.toString(),
        date: date.toISOString().split("T")[0], // always use this fixed date
      };

      if (amount.trim()) {
        body.amount = Number(amount.trim());
      }

      console.log("📤 API Body:", body);

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
        const total = Number(result.totalRecords || 0);
        setTotalRecords(total);
        setTotalPages(Math.ceil(total / perPage));
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleFilter = () => {
    setCurrentPage(1);
    fetchData(); // ✅ Just fetch data without navigating or changing URL
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="mt-4">
      <div className="d-flex align-items-center justify-content-between w-100">
        <h3>All Gateway Deposit Records</h3>

        {/* 🔍 Filter Section */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="">
            {/* <label>Amount</label> */}
            <input
              type="text"
              className="form-control"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="">
            <div className="mt-3">
              <button
                className="btn btn-primary white-space-nowrap"
                onClick={handleFilter}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
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
                <th>Bank Name</th>
                <th>IFSC Code</th>
                <th>Amount</th>
                <th>Holder Name</th>
                <th>Status</th>
                <th>DateTime</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * perPage + index + 1}</td>
                  <td>{ucWords(item.user_name)}</td>
                  <td>{item.mobile}</td>
                  <td>{item.bank_name}</td>
                  <td>{item.ifsc_code}</td>
                  <td>₹ {item.amount}</td>
                  <td>{ucWords(item.account_holder_name)}</td>
                  <td>{item.status}</td>
                  <td>{item.date_time}</td>
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

export default WithdrawalDateWiseDetailPage;
