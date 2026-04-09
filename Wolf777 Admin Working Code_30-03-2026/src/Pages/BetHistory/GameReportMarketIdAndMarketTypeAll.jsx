import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { MdFilterListAlt } from "react-icons/md";

const GameReportMarketIdAndMarketTypeAll = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");

  const perPage = 10;

  const searchParams = new URLSearchParams(location.search);
  const defaultDate = searchParams.get("date");
  // alert(defaultDate);

  const defaultMarketType = searchParams.get("market_type");
  const defaultMarketId = searchParams.get("marketid");
  // const defaultAmount = searchParams.get("amount");
  // const defaultUTR = searchParams.get("utr");

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  // const [amount, setAmount] = useState(defaultAmount || "");
  // const [utr, setUTR] = useState(defaultUTR || "");

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
  const [FilterSession, setFilterSession] = useState("");
  const [FilterResult, setFilterResult] = useState("");
  const handleSearchChangeusername = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUsername(value);
  };

  const handleChangeSession = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterSession(value);
  };
  const handleChangeResult = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterResult(value);
  };

  const handleFilter = (e) => {
    fetchData();
  };
  const fetchData = async () => {
    if (!defaultDate || !defaultMarketType || !defaultMarketId) return;
    setLoading(true);

    try {
      const body = {
        page: currentPage.toString(),
        limit: 20,
        date: defaultDate,
        market_type: defaultMarketType,
        marketid: defaultMarketId,
        result: FilterResult,
        session: FilterSession,
        username: FilterUsername,
      };

      // if (amount.trim()) body.amount = Number(amount.trim());
      // if (mobile.trim()) body.mobile = mobile.trim();
      // if (username.trim()) body.user_name = username.trim();

      // if (amount.trim()) body.amount = Number(amount.trim());
      // if (utr.trim()) body.utr = utr.trim();

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}game-report-marketIdAndMarketTypeAll`,
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
    } catch (err) {
      console.error("API Error", err);
      setData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="card mt-3">
      <div className="card-header bg-color-black">
        <div className="d-flex align-items-center justify-content-between w-100">
          <h3 className="card-title text-white">
            Report - Market Type & Market ID
          </h3>
          <div className="d-flex align-items-center justify-content-between gap-2">
            {/* <h3 className="card-title text-white">Bet Pending List</h3> */}
            <div className="buttonlist">
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
        {/* <div className="d-flex align-items-center gap-2 mb-2"> */}
        {/* <input
            type="text"
            className="form-control"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div>
            <button className="btn btn-primary" onClick={handleFilter}>
              Apply Filter
            </button>
          </div> */}
        {/* <div> */}
        {/* </div> */}
        {/* </div> */}{" "}
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
                    value={FilterUsername}
                    onChange={handleSearchChangeusername}
                  />
                </div>

                <div className="form_latest_design w-100">
                  <div className="label">
                    <label htmlFor="">Session Type</label>
                  </div>
                  <select
                    name="user_name"
                    className="form-control"
                    value={FilterSession}
                    onChange={handleChangeSession}
                  >
                    <option value="">Session Type</option>
                    <option value="open">Open</option>
                    <option value="close">Close</option>
                  </select>
                </div>
                <div className="form_latest_design w-100">
                  <div className="label">
                    <label htmlFor="">Result</label>
                  </div>
                  <select
                    name="user_name"
                    className="form-control"
                    value={FilterResult}
                    onChange={handleChangeResult}
                  >
                    <option value="">Result</option>
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                  </select>
                </div>

                <div >
                  <button
                    className="refreshbutton"
                    onClick={handleFilter}
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
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Market ID </th>
                <th>Market Type </th>
                <th>Market Type Name</th>
                <th>Bet Key</th>
                <th>Bet Amount</th>
                <th>Win Amount</th>

                <th>Session</th>
                <th>Date & Time</th>
                <th>result</th>
                <th>P&L</th>
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
                    <td>{ucWords(item.user_name)}</td>
                    <td>{item.market_id}</td>
                    <td>{item.market_type}</td>
                    <td>
                      {" "}
                      {item.game_type_name
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </td>
                    <td>{item.bet_key}</td>
                    <td>₹ {item.bet_amount}</td>
                    <td>₹ {item.win_amount}</td>
                    <td
                      style={{
                        color:
                          item.session?.toLowerCase() === "open"
                            ? "green"
                            : item.session?.toLowerCase() === "close"
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {ucWords(item.session)}
                    </td>

                    <td>{formatDateTime(item.date_time)}</td>
                    <td>{item.result}</td>
                    <td
                      className={
                        item.profitLoss === 0
                          ? "red-text"
                          : item.profitLoss < 0
                          ? "green-text"
                          : ""
                      }
                    >
                      {item.profitLoss}
                    </td>
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

        {data.length > 0 && totalPages >= 1 && (
          <ul className="d-flex justify-content-between align-items-center mt-3 pl-0">
            <li
              className="paginationbutton btn btn-secondary"
              onClick={handlePrev}
              style={{
                cursor: "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              Previous
            </li>
            <span className="alllistnumber">
              Page {currentPage} of {totalPages}
            </span>
            <li
              className="paginationbutton btn btn-secondary"
              onClick={handleNext}
              style={{
                cursor: "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Next
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default GameReportMarketIdAndMarketTypeAll;
