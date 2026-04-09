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
  const [limit] = useState(20); // ek page me kitne items chahiye
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
  const [activeTab, setActiveTab] = useState("pending");
  const token = localStorage.getItem("token");
  const { userid } = useParams();
  const navigate = useNavigate();
  const [fillter, setFillter] = useState(false);

  const fillterdata = () => setFillter((prev) => !prev);

  // ✅ Server-side fetch
  // const fetchBets = useCallback(
  //   async (type, page = 1) => {
  //     const endpoint =
  //       type === "success"
  //         ? "gameloadbet-success-list-userwaise"
  //         : "gameloadbet-pending-list-userwaise";

  //     setLoading((prev) => ({ ...prev, [type]: true }));

  //     try {
  //       // Filters ko query params me add karna
  //       const filterParams = Object.entries(inputFilters)
  //         .filter(([key, value]) => value)
  //         .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  //         .join("&");

  //       const res = await fetch(
  //         `${process.env.REACT_APP_API_URL}/${endpoint}?page=${page}&limit=${limit}&user_id=${userid}${filterParams ? `&${filterParams}` : ""
  //         }`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       if (!res.ok) throw new Error("Failed to fetch bets");

  //       const data = await res.json();
  //       const betsData = data.data || [];
  //       const totalPageCount = data.pagination
  //         ? Math.ceil(data.pagination.total_items / limit)
  //         : 1;

  //       if (type === "success") {
  //         setAllBets(betsData);
  //         setTotalPages(totalPageCount);
  //       } else {
  //         setAllPendingBets(betsData);
  //         setPendingTotalPages(totalPageCount);
  //       }
  //     } catch (error) {
  //       console.error(error.message);
  //     } finally {
  //       setLoading((prev) => ({ ...prev, [type]: false }));
  //     }
  //   },
  //   [userid, token, limit, inputFilters]
  // );


  // ✅ Server-side fetch
const fetchBets = useCallback(
  async (type, page = 1) => {
    const endpoint =
      type === "success"
        ? "gameloadbet-success-list-userwaise"
        : "gameloadbet-pending-list-userwaise";

    setLoading((prev) => ({ ...prev, [type]: true }));

    try {
      // Filters ko query params me add karna
      const filterParams = Object.entries(inputFilters)
        .filter(([key, value]) => value)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/${endpoint}?page=${page}&limit=${limit}&user_id=${userid}${filterParams ? `&${filterParams}` : ""}`,
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

      console.warn(betsData);

      // ✅ Fix for NaN: fallback if pagination.total_items missing
      const totalRecords =
        data.pagination?.total_items ?? data.pagination?.total ?? betsData.length ?? 0;
      const totalPageCount = Math.max(Math.ceil(totalRecords / limit), totalRecords);

      if (type === "success") {
        setAllBets(betsData);
        setTotalPages(totalPageCount);
      } else {
        setAllPendingBets(betsData);
        setPendingTotalPages(totalPageCount);
      }
    } catch (error) {
      console.error(error.message);
      // fallback in case of error
      if (type === "success") setTotalPages(1);
      else setPendingTotalPages(1);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  },
  [userid, token, limit, inputFilters]
);



  useEffect(() => {
    fetchBets("success", currentPage);
    fetchBets("pending", pendingCurrentPage);
  }, [fetchBets, currentPage, pendingCurrentPage]);

  const handleInputChange = (e) => {
    setInputFilters({
      ...inputFilters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    // Search triggers fetch from server
    if (activeTab === "success") {
      setCurrentPage(1);
      fetchBets("success", 1);
    } else {
      setPendingCurrentPage(1);
      fetchBets("pending", 1);
    }
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
      fetchBets("success", 1);
    } else {
      setPendingCurrentPage(1);
      fetchBets("pending", 1);
    }
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleBack = () => navigate(-1);

  const renderTable = (bets, type) => {
    const currentPageValue = type === "success" ? currentPage : pendingCurrentPage;
    const totalPagesValue = type === "success" ? totalPages : pendingTotalPages;
    const isLoading = type === "success" ? loading.success : loading.pending;

    const handlePageChange = (newPage) => {
      if (newPage < 1 || newPage > totalPagesValue) return;

      if (type === "success") {
        setCurrentPage(newPage);
        fetchBets("success", newPage);
      } else {
        setPendingCurrentPage(newPage);
        fetchBets("pending", newPage);
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
              {bets.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan="10" className="text-center text-danger fw-bold">
                    Sorry, no data found.
                  </td>
                </tr>
              ) : (
                bets.map((bet, index) => (
                  <tr key={`${type}-${index}`}>
                    <td>{(currentPageValue - 1) * limit + index + 1}</td>
                    <td>
                      {bet.user_name
                        ? bet.user_name.charAt(0).toUpperCase() +
                        bet.user_name.slice(1).toLowerCase()
                        : ""}
                    </td>
                    <td>{toSentenceCase(bet.market_type)}</td>
                    <td>{toSentenceCase(bet.game_type_name)}</td>
                    <td>{bet.market_id}</td>
                    <td>
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
                        className={`badge ${bet.session === "open"
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
    activeTab === "success" ? allBets : allPendingBets;

  return (
    <div className="bet_tab mt-2">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k);
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
