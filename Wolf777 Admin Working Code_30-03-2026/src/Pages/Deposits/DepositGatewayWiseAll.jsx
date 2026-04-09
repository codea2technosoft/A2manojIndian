import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";

const DepositGatewayWiseAll = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [datas, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limitPages, setLimitPages] = useState();
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
  const defaultGatewayName = searchParams.get("getway_name"); // e.g. "rohit"
  const defaultAmount = searchParams.get("amount");
  const defaultUTR = searchParams.get("utr");

  const [amount, setAmount] = useState(defaultAmount || "");
  const [utr, setUTR] = useState(defaultUTR || "");

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const [FilterUsername, setFilterUsername] = useState("");
  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
  const [FilteOrderID, setSelectedValueFilteOrderID] = useState("");
  const [FilterGetwayName, setSelectedValueGatewayName] = useState("");
  const [FilterUTR, setFilterUTR] = useState("");
  // Search handler

  const handleSearchChangeusername = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUsername(value);
  };
  const handleSearchChangeUTR = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUTR(value);
  };
  const handleSearchChangeMin = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMin(value);
  };
  const handleSearchChangeMax = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMax(value);
  };
  const handleSearchChangOrderID = (e) => {
    const value = e.target.value;
    setSelectedValueFilteOrderID(value);
  };
  const handleSearchChangeGetwayName = (e) => {
    const value = e.target.value;
    setSelectedValueGatewayName(value);
  };

  const handleFilter = (e) => {
    fetchData();
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const fetchData = async () => {
    if (!defaultDateParam) return;
    // alert(defaultGatewayName);
    setLoading(true);
    try {
      const body = {
        page: currentPage.toString(),
        date: defaultDateParam,
        user_name: FilterUsername,
        min: FilterMin,
        max: FilterMax,
        UTR: FilterUTR,
        OrderID: FilteOrderID,
        FilterGetwayName: defaultGatewayName,
      };

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}deposit-list-report-getway-wise-all`,
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
      // console.log("API Response:", result);

      if (result.success === "1") {
        setData(result.data);
        setCurrentPage(result.pagination.currentPage); // reset to first page after fetching
        setTotalPages(result.pagination.totalPages); // reset to first page after fetching
        setLimitPages(result.pagination.limit); // reset to first page after fetching
      } else {
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("API Error:", error);
      // setData([]);
      // setTotalPages(1);
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
              All Gateway Deposit Records
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
                      // placeholder="User Name"
                      value={FilterUsername}
                      onChange={handleSearchChangeusername}
                    />
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">UTR</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="UTR"
                      value={FilterUTR}
                      onChange={handleSearchChangeUTR}
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
                      <label htmlFor="">Order ID</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Max Amount"
                      value={FilteOrderID}
                      onChange={handleSearchChangOrderID}
                    />
                  </div>
                  {/* <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">GeteWay Name</label>
                    </div>
                    <input
                      type="text"
                      name="user_name"
                      className="form-control"
                      // placeholder="Max Amount"
                      value={FilterGetwayName}
                      onChange={handleSearchChangeGetwayName}
                    />
                  </div> */}

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

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>User Name</th>
              {/* <th>Mobile</th> */}
              <th>UTR</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Order ID</th>
              <th>Gateway</th>
              <th>Deposit Type</th>
              <th>DateTime</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : datas.length > 0 ? (
              datas.map((item, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * perPage + index + 1}</td>
                  <td>{ucWords(item.user_name)}</td>
                  {/* <td>{item.mobile}</td> */}
                  <td>{item.utr}</td>
                  <td>₹ {item.amount}</td>
                  <td>{item.status}</td>
                  <td>{item.order_id}</td>
                  <td>{item.getway_name}</td>
                  <td>{ucWords(item.deposit_type)}</td>
                  <td>{item.date_time}</td>
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

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="paginationbutton"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="alllistnumber">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="paginationbutton"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DepositGatewayWiseAll;
