import React, { useEffect, useState } from "react";
import { MdFilterListAlt } from "react-icons/md";

function SuccessBetHistory() {
  const [allBets, setAllBets] = useState([]);
  const [bets, setBets] = useState([]);
  const [AllMarketList, setAllMarketList] = useState([]);
  const [GameRateList, setGameRateList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [inputFilters, setInputFilters] = useState({
    user_name: "",
    mobile: "",
    market_type: "",
    game_type: "",
    market_id: "",
  });
  const [searchTriggered, setSearchTriggered] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSuccessBets(currentPage);
  }, [currentPage]);
  const handleInputChange = (e) => {
    setInputFilters({
      ...inputFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const toSentenceCase = (text) => {
    if (!text) return "";
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  const paginatedBets = bets.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );
  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };
  const [FilterUsername, setFilterUsername] = useState("");
  const [FilterMarkettype, setfilterMarkettype] = useState("");
  const [FilterMarketname, setFilterMarketname] = useState("");
  const [FilterGameType, setFilterGameType] = useState("");
  const [FilterSession, setFilterSession] = useState("");
  const [selectedStartDate, setselectedStartDate] = useState("");
  const [selectedEndDate, setselectedEndDate] = useState("");
  // Search handler

  const handleSearchChangeusername = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUsername(value);
  };

  const handleChangeMarketName = (e) => {
    const value = e.target.value;
    // alert(value);
    setFilterMarketname(value);
  };
  const handleChangeGameType = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterGameType(value);
  };
  const handleChangeSession = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterSession(value);
  };
  const setSelectedStartDate = (e) => {
    const value = e;
    setselectedStartDate(value);
  };
  const setSelectedEndDate = (e) => {
    const value = e;
    setselectedEndDate(value);
  };
  const handleChangeMarkettype = (e) => {
    const value = e.target.value.toLowerCase();
    // alert(value);
    setfilterMarkettype(value);
    fetchMarketlist(value);
    fetchGametype(value);
  };
  const handleFilter = (e) => {
    fetchSuccessBets();
  };
  const fetchSuccessBets = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/gameloadbet-success-list?page=${page.toString()}&limit=${limit.toString()}&username=${FilterUsername}&markettype=${FilterMarkettype}&marketname=${FilterMarketname}&gametype=${FilterGameType}&session=${FilterSession}&startdate=${selectedStartDate}&enddate=${selectedEndDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        const betsData = data.data || [];
        setAllBets(betsData);
        setBets(betsData);
        setTotalPages(Number(data.totalNumberPage) || 1);
      } else {
        setAllBets([]);
        setBets([]);
      }
    } catch (error) {
      setAllBets([]);
      setBets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGametype = async (value) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/game-list-all?market_type=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        const betsData = data.data || [];
        setGameRateList(betsData);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const fetchMarketlist = async (value) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/market-list-all?market_type=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        const betsData = data.data || [];
        setAllMarketList(betsData);
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="betlists mt-3">
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
                  <div className="form_latest_design">
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
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Market Type</label>
                    </div>
                    <select
                      name="user_name"
                      className="form-control"
                      value={FilterMarkettype}
                      onChange={handleChangeMarkettype}
                    >
                      <option value="">Market Type</option>
                      <option value="mainmarket">Main Market</option>
                      <option value="kingstarline">King Starline</option>
                      <option value="kingjackport">King JackPot</option>
                    </select>
                  </div>
                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Market Name</label>
                    </div>
                    <select
                      name="user_name"
                      className="form-control"
                      value={FilterMarketname}
                      onChange={handleChangeMarketName}
                    >
                      <option value="">Market</option>
                      {AllMarketList.map((user, index) => (
                        <option key={index} value={user.market_id}>
                          {user.market_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form_latest_design">
                    <div className="label">
                      <label htmlFor="">Game Type</label>
                    </div>
                    <select
                      name="user_name"
                      className="form-control"
                      value={FilterGameType}
                      onChange={handleChangeGameType}
                    >
                      <option value="">Market Type</option>
                      {GameRateList.map((user, index) => (
                        <option key={index} value={user.name_slug}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form_latest_design">
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
                  <div className="form_latest_design">
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
                  <div className="form_latest_design">
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
                  <div className="form_latest_design">
                    <button
                      className="refreshbutton"
                      onClick={handleFilter}
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

        {loading && <p>Loading pending bets...</p>}
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>User Name</th>
                  {/* <th>Mobile</th> */}
                  <th>Market Type</th>
                  <th>Game Type</th>
                  <th>Market ID</th>
                  <th>Bet Key</th>
                  <th>Bet Amount</th>
                  <th>Win Amount</th>
                  <th>Session</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {!loading && allBets.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center text-danger fw-bold"
                    >
                      Sorry, no data found.
                    </td>
                  </tr>
                ) : (
                  allBets.map((bet, index) => (
                    <tr key={index}>
                      <td>{(currentPage - 1) * limit + index + 1}</td>
                      <td>
                        {bet.user_name
                          ? bet.user_name.charAt(0).toUpperCase() +
                            bet.user_name.slice(1).toLowerCase()
                          : ""}
                      </td>
                      {/* <td>{bet.mobile}</td> */}
                      <td>{toSentenceCase(bet.market_type)}</td>
                      <td>{toSentenceCase(bet.game_type_name)}</td>
                      <td>{bet.market_id}</td>
                      <td>
                        {" "}
                        {[
                          "choice_sp_dp_tp",
                          "triple_pana",
                          "penal_group",
                        ].includes(bet.game_type_name) && bet.bet_key == 0
                          ? "000"
                          : bet.bet_key}
                      </td>
                      <td>Rs {bet.bet_amount}</td>
                      <td>Rs {bet.win_amount}</td>
                      <td>
                        <span
                          className={`badge ${
                            bet.session === "open"
                              ? "bg-success"
                              : bet.session === "close"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {toSentenceCase(bet.session)}
                        </span>
                      </td>
                      {/* <td>{bet.date_time}</td> */}
                      <td>
                        {new Date(bet.date_time)
                          .toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replaceAll("/", "-")
                          .toUpperCase()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {bets.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default SuccessBetHistory;
