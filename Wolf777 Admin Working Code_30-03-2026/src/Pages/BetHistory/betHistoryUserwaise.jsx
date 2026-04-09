import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";

function SuccessBetHistory() {
  const [allBets, setAllBets] = useState([]);
  const [allPendingBets, setAllPendingBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [loading, setLoading] = useState({ success: false, pending: false });
  const [inputFilters, setInputFilters] = useState({
    user_name: "",
    mobile: "",
    market_type: "",
    game_type: "",
    market_id: "",
  });
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const token = localStorage.getItem("token");
  const { userid } = useParams();
  const navigate = useNavigate();
  const [fillter, setFillter] = useState(false);

  const fillterdata = () => {
    setFillter((prev) => !prev);
  };
  const fetchBets = useCallback(
    async (type) => {
      const endpoint =
        type === "success"
          ? "gameloadbet-success-list-userwaise"
          : "gameloadbet-pending-list-userwaise";

      setLoading((prev) => ({ ...prev, [type]: true }));

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/${endpoint}?page=1&limit=1000&user_id=${userid}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch bets");

        const data = await res.json();
        const betsData = data.data || [];

        if (type === "success") {
          setAllBets(betsData);
          setTotalPages(Math.ceil(betsData.length / limit));
        } else {
          setAllPendingBets(betsData);
          setPendingTotalPages(Math.ceil(betsData.length / limit));
        }

        return betsData;
      } catch (error) {
        console.error(error.message);
        return [];
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    },
    [userid, token, limit]
  );

  useEffect(() => {
    const loadData = async () => {
      await fetchBets("success");
      await fetchBets("pending");
    };
    loadData();
  }, [fetchBets]);

  const handleInputChange = (e) => {
    setInputFilters({
      ...inputFilters,
      [e.target.name]: e.target.value,
    });
  };

  const filterBets = (bets, filters) => {
    const normalize = (str) =>
      str?.toString().toLowerCase().trim().replace(/\s+/g, " ") || "";

    const { user_name, mobile, market_type, game_type, market_id } = filters;

    return bets.filter((bet) => {
      const userName = normalize(bet?.user_name);
      const mobileNo = normalize(bet?.mobile);
      const marketType = normalize(toSentenceCase(bet?.market_type));
      const gameType = normalize(toSentenceCase(bet?.game_type_name));
      const marketId = normalize(bet?.market_id);

      return (
        (!user_name || userName.includes(normalize(user_name))) &&
        (!mobile || mobileNo.includes(normalize(mobile))) &&
        (!market_type || marketType.includes(normalize(market_type))) &&
        (!game_type || gameType.includes(normalize(game_type))) &&
        (!market_id || marketId.includes(normalize(market_id)))
      );
    });
  };

  const handleSearch = () => {
    const betsToFilter = activeTab === "success" ? allBets : allPendingBets;
    const filtered = filterBets(betsToFilter, inputFilters);
    const calculatedTotalPages = Math.ceil(filtered.length / limit);

    if (activeTab === "success") {
      setCurrentPage(1);
      setTotalPages(calculatedTotalPages);
    } else {
      setPendingCurrentPage(1);
      setPendingTotalPages(calculatedTotalPages);
    }

    setSearchTriggered(true);
  };

  const handleReset = () => {
    setInputFilters({
      user_name: "",
      mobile: "",
      market_type: "",
      game_type: "",
      market_id: "",
    });

    if (activeTab === "success") {
      setCurrentPage(1);
      setTotalPages(Math.ceil(allBets.length / limit));
    } else {
      setPendingCurrentPage(1);
      setPendingTotalPages(Math.ceil(allPendingBets.length / limit));
    }

    setSearchTriggered(false);
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getPaginatedBets = (bets, page, itemsPerPage) => {
    return bets.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  };
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };
  const renderTable = (bets, type) => {
    const currentPageValue =
      type === "success" ? currentPage : pendingCurrentPage;
    const totalPagesValue = type === "success" ? totalPages : pendingTotalPages;
    const paginatedBets = getPaginatedBets(bets, currentPageValue, limit);
    const isLoading = type === "success" ? loading.success : loading.pending;
    const noData = !isLoading && paginatedBets.length === 0 && searchTriggered;

    const handlePageChange = (newPage) => {
      if (type === "success") {
        setCurrentPage(newPage);
      } else {
        setPendingCurrentPage(newPage);
      }
    };

    return (
      <>
        {isLoading && <p>Loading {type} bets...</p>}

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
              {noData ? (
                <tr>
                  <td colSpan="11" className="text-center text-danger fw-bold">
                    Sorry, no data found.
                  </td>
                </tr>
              ) : (
                paginatedBets.map((bet, index) => (
                  <tr key={`${type}-${index}`}>
                    <td>{(currentPageValue - 1) * limit + index + 1}</td>
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
                      {/* {bet.bet_key} */}
                      {["choice_sp_dp_tp", "triple_pana"].includes(
                        bet.game_type_name
                      ) && bet.bet_key == 0
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
              onClick={() => handlePageChange(currentPageValue - 1)}
              disabled={currentPageValue === 1}
            >
              Previous
            </button>

            <span className="alllistnumber">
              Page {currentPageValue} of {totalPagesValue}
            </span>

            <button
              className="paginationbutton"
              onClick={() => handlePageChange(currentPageValue + 1)}
              disabled={currentPageValue === totalPagesValue}
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  const currentBets =
    activeTab === "success"
      ? filterBets(allBets, inputFilters)
      : filterBets(allPendingBets, inputFilters);

  return (
    <div className="bet_tab mt-2">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
          setSearchTriggered(false);
          setInputFilters({
            user_name: "",
            mobile: "",
            market_type: "",
            game_type: "",
            market_id: "",
          });
        }}
        id="bet-history-tabs"
        className="mb-3"
      >
        <Tab eventKey="pending" title="Pending Bets">
          <div className="betlists">
            <div className="card">
              <div className="card-header bg-color-black">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="card-title text-white">Pending Bets</h3>
                  <div className="d-flex gap-2">
                    <div className="buttonlist">
                      <div className="fillterbutton" onClick={fillterdata}>
                        <MdFilterListAlt /> Filter
                      </div>
                    </div>
                    <button
                      className="btn btn-primary ms-auto d-flex"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {fillter && (
                  <div className="row mb-2">
                    {Object.keys(inputFilters).map((key) => (
                      <div className="col-md-6 mb-2 col-lg-2 col-6" key={key}>
                        <input
                          type="text"
                          name={key}
                          className="form-control"
                          placeholder={key.replace("_", " ")}
                          value={inputFilters[key]}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}
                    <div className="col-md-6 mb-2 col-lg-2 col-6">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success me-2"
                          onClick={handleSearch}
                        >
                          Search
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {renderTable(currentBets, "pending")}
              </div>
            </div>
          </div>
        </Tab>
        <Tab eventKey="success" title="Success Bets">
          <div className="betlists">
            <div className="card">
              <div className="card-header bg-color-black">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="card-title text-white">Success Bets</h3>
                  <div className="d-flex gap-2">
                    <div className="buttonlist">
                      <div className="fillterbutton" onClick={fillterdata}>
                        <MdFilterListAlt /> Filter
                      </div>
                    </div>
                    <button
                      className="btn btn-primary ms-auto d-flex"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {fillter && (
                  <div className="row mb-2">
                    {Object.keys(inputFilters).map((key) => (
                      <div className="col-md-6 mb-2 col-lg-2 col-6" key={key}>
                        <input
                          type="text"
                          name={key}
                          className="form-control"
                          placeholder={key.replace("_", " ")}
                          value={inputFilters[key]}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}
                    <div className="col-md-2">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success me-2"
                          onClick={handleSearch}
                        >
                          Search
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {renderTable(currentBets, "success")}
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default SuccessBetHistory;
