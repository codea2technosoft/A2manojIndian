import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import {
  getmatchEvents,
  getSelectionsByMarket,
  declareMatchResult,
  getAllMatchResultList,
  rollbackFancyNow,

  lenadenasettled,
} from "../../Server/api";
import { getAllGames } from "../../Server/game.service";
import Loader from "../../Common/Loader";

function MainMarket() {
  const [marketId, setMarketId] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [teamList, setTeamList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [marketData, setMarketData] = useState([]);
  const [marketList, setMarketList] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSportId, setSelectedSportId] = useState("");
  const [error, setError] = useState("");
  const [btnLoading, setBtnLoading] = useState({});

  const [page, setPage] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const admin_id = localStorage.getItem("admin_id");
  const [loadingSelections, setLoadingSelections] = useState(false);
  const [declareLoading, setDeclareLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sport_id: "",
  });
  const [showFilter, setShowFilter] = useState(false);
  // const fetchGames = async () => {
  //   try {
  //     setLoadingGames(true);
  //     const response = await getAllGames();
  //     if (response.data.success) {
  //       setGames(response.data.data || []);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching games:", err);
  //   } finally {
  //     setLoadingGames(false);
  //   }
  // };

  const fetchGames = async () => {
    try {
      setLoadingGames(true);
      const response = await getAllGames();
      if (response.data.success) {
        // ✅ Filter out sport_id 7 (Horse Racing) and 8 (Greyhound Racing)
        const filteredGames = response.data.data.filter(
          (game) => game.id !== 7 && game.id !== 8
        );
        setGames(filteredGames || []);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setLoadingGames(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // useEffect(() => {
  //   if (games.length > 0) {

  //     // const selectedId = sportId;

  //     setSelectedSportId(selectedId);
  //     fetchEvents(selectedId);
  //   }
  // }, [games, sportId]);

  useEffect(() => {
    fetchMatchResultList(page);
  }, [page, limit]);

  const setBtnLoader = (id, val) => {
    setBtnLoading((prev) => ({ ...prev, [id]: val }));
  };

  const fetchEvents = async (sportId) => {
    try {
      setLoading(true);

      const payload = {
        sport_id: sportId,
      };

      console.log("Payload =>", payload);

      const response = await getmatchEvents(payload);

      if (response.data.success) {
        setEvents(response.data.data || []);
        setError("");
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (selectedSportId) {
      fetchEvents(selectedSportId);
    }
  }, [selectedSportId]);

  const fetchSelectionsByMarket = async (market_id) => {
    if (!market_id) return;

    try {
      setLoadingSelections(true);
      setTeamList([]);
      setSelectedTeam("");

      const res = await getSelectionsByMarket(market_id);

      if (res.data.success && Array.isArray(res.data.teams)) {
        const formattedTeams = [
          ...res.data.teams.map((t) => ({
            value: t.team_id,
            label: t.team_name,
          })),
          { value: "abundent", label: "Abundent" },
        ];
        if (res.data.teams.length > 0) {
          setSelectedTeam(res.data.teams[0].team_id);
        }
        setTeamList(formattedTeams);
        if (formattedTeams.length > 0) {
          setSelectedTeam(formattedTeams[0].value);
        }
      } else {
        setTeamList([]);
        // Swal.fire({ icon: "info", title: "No Selections Found" });
      }
    } catch (err) {
      console.error("Error fetching selections:", err);
      // Swal.fire({ icon: "error", title: "Server Error" });
    } finally {
      setLoadingSelections(false);
    }
  };

  const handleDeclareResult = async () => {
    if (!selectedEventId || !selectedMatch?.market_id || !selectedTeam) {
      Swal.fire({ icon: "warning", title: "Please select all fields" });
      return;
    }
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to declare this result?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Declare",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;
    const payload = {
      match: `${selectedMatch.market_id},${selectedEventId}`,
      market: selectedEventId,
      selection: selectedTeam,
      sport: selectedSportId,
    };
    try {
      // setIsButtonDisabled(true);
      setDeclareLoading(true);
      const res = await declareMatchResult(payload);
      if (res.data?.success) {
        const alertRes = await Swal.fire({
          icon: "success",
          title: res.data.message,
          confirmButtonText: "OK",
        });
        fetchGames();
        if (alertRes.isConfirmed) {
          fetchMatchResultList(page);
        }
        setSelectedMatch("");
        setSelectedEventId("");
        setSelectedMarket("");
        setSelectedTeam("");
        setTeamList([]);
      } else {
        Swal.fire({
          icon: "error",
          title: res.data?.message,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      // setIsButtonDisabled(false);
      setDeclareLoading(false);
    }
  };

  // const fetchMatchResultList = async (pageNo) => {
  //   try {
  //     setLoadingTable(true);

  //     const payload = {
  //       admin_id: admin_id,
  //       page: pageNo,
  //       limit: limit,
  //     };
  //     const res = await getAllMatchResultList(payload);

  //     if (res.data.success) {
  //       setMarketData(res.data.results || []);
  //       setTotal(res.data.pagination.total);
  //       setTotalPages(res.data.pagination.totalPages);
  //     }
  //   } catch (err) {
  //     console.error("Match result list error", err);
  //   } finally {
  //     setLoadingTable(false);
  //   }
  // };

  // const handleRollback = async (item) => {
  //   const confirm = await Swal.fire({
  //     title: "Rollback Result?",
  //     text: item.full_team_name,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Rollback",
  //   });

  //   if (!confirm.isConfirmed) return;

  //   try {
  //     setBtnLoader(item._id, true);

  //     const res = await rollbackFancyNow({
  //       result_id: item._id,
  //       event_id: item.event_id,
  //     });

  //     if (res.data?.success) {
  //       Swal.fire("Success", "Result rolled back", "success");
  //       fetchMatchResultList(page); // ✅ correct refresh
  //     } else {
  //       Swal.fire("Error", res.data?.message || "Rollback failed", "error");
  //     }
  //   } catch (err) {
  //     Swal.fire("Error", "Server error", "error");
  //   } finally {
  //     setBtnLoader(item._id, false);
  //   }
  // };

  const fetchMatchResultList = async (pageNo) => {
    try {
      setLoadingTable(true);

      const payload = {
        admin_id: admin_id,
        page: pageNo,
        limit: limit,
      };

      const res = await getAllMatchResultList(payload);

      if (res.data.success) {
        const results = res.data.results || [];

        // Sport ID 7 (Horse Racing) and 8 (Greyhound)
        // ko MainMarket listing se remove karo
        const filteredResults = results.filter(
          (item) =>
            Number(item.sport_id) !== 7 &&
            Number(item.sport_id) !== 8
        );

        setMarketData(filteredResults);

        setTotal(res.data.pagination?.total || 0);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } else {
        setMarketData([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Match result list error", err);
      setMarketData([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleRollbacklenadenasettled = async (item) => {
    const confirm = await Swal.fire({
      title: " Settled Result?",
      text: item.full_team_name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, settled",
    });

    if (!confirm.isConfirmed) return;


    try {
      setBtnLoader(item._id, true);

      const res = await lenadenasettled({
        result_id: item._id,
        event_id: item.event_id,
        sport_id: item.sport_id,
      });
      if (res.data?.success) {
        Swal.fire("Success", res.data.message, "success");
        fetchMatchResultList(page);
      } else {
        Swal.fire("Error", res.data?.message || "Rollback failed", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Server error", "error");
    } finally {
      setBtnLoader(item._id, false);
    }
  };
  const confirmAction = async (title, text) => {
    return await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Proceed",
    });
  };
  const getPageNumbers = () => {
    let pages = [];

    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + 1);

    // adjust start if end reached last
    if (end === totalPages) {
      start = Math.max(1, totalPages - 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const handlePageClick = (pageNo) => {
    setPage(pageNo);
  };

  const matchOptions = events.map((event) => ({
    value: event.id || event.event_id,
    label: event.name,
    market_id: event.market_id,
  }));

  return (
    <div className="marketname">
      <div className="card">
        <div className="card-header bg-primary-yellow">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">Declared Main Result</h3>
          </div>
        </div>

        <div className="card-body">
          <form noValidate className="needs-validation">
            <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end flex-md-nowrap flex-wrap">
              {/* 🔹 Select Sport */}
              <div className="form_latest_design">
                <label className="form-label">
                  Select Sport <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  value={selectedSportId || ""}
                  onChange={(e) => {
                    const sportId = e.target.value;

                    setSelectedSportId(sportId);

                    setSelectedMatch(null);
                    setSelectedEventId(null);
                    setSelectedMarket("");
                    setSelectedTeam("");
                    setTeamList([]);
                    setEvents([]);

                    fetchEvents(sportId);
                  }}
                >
                  <option value="">Select Sport</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🔹 Select Match */}
              {/* <div className="form_latest_design">
                <label className="form-label">
                  Select Match <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  value={selectedEventId || ""}
                  disabled={loadingGames}
                  onChange={(e) => {
                    const selected = matchOptions.find(
                      (opt) => String(opt.value) === e.target.value,
                    );

                    setSelectedMatch(selected);
                    setSelectedEventId(selected?.value);
                    setSelectedMarket("");
                    setSelectedTeam("");
                    setTeamList([]);

                    if (selected?.market_id) {
                      fetchSelectionsByMarket(selected.market_id);
                    } else {
                      Swal.fire({
                        icon: "info",
                        title: "Market not available for this match",
                      });
                    }
                  }}
                >
                  <option value="">
                    {loadingGames ? "Loading Matches..." : "Select Match"}
                  </option>

                  {matchOptions.map((match) => (
                    <option key={match.value} value={match.value}>
                      {match.label}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* 🔹 Select Match - Searchable */}
              <div className="form_latest_design">
                <label className="form-label">
                  Select Match <span className="text-danger">*</span>
                </label>

                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isLoading={loadingGames}
                  isDisabled={!selectedSportId || loadingGames}
                  isClearable={true}
                  isSearchable={true}
                  placeholder={loadingGames ? "Loading Matches..." : "Search & Select Match"}
                  options={matchOptions}
                  value={matchOptions.find(opt => String(opt.value) === String(selectedEventId)) || null}
                  onChange={(selected) => {
                    setSelectedMatch(selected);
                    setSelectedEventId(selected?.value || "");
                    setSelectedMarket("");
                    setSelectedTeam("");
                    setTeamList([]);

                    if (selected?.market_id) {
                      fetchSelectionsByMarket(selected.market_id);
                    } else if (selected) {
                      Swal.fire({
                        icon: "info",
                        title: "Market not available for this match",
                      });
                    }
                  }}
                  noOptionsMessage={() => "No matches found"}
                />
              </div>


              {/* 🔹 Select Selection */}
              <div className="form_latest_design">
                <label className="form-label">
                  Select Selection <span className="text-danger">*</span>
                </label>

                <select
                  className="form-select"
                  value={selectedTeam || ""}
                  disabled={!selectedEventId || loadingSelections}
                  onChange={(e) => {
                    setSelectedTeam(e.target.value);
                  }}
                >
                  <option value="">
                    {loadingSelections
                      ? "Loading Selections..."
                      : "Select Selection"}
                  </option>

                  {teamList.map((team) => (
                    <option key={team.value} value={team.value}>
                      {team.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🔹 Declare Button */}
              <div className="buttonsubmit">
                <button
                  className="btn btn-primary w-auto h-auto"
                  type="button"
                  disabled={declareLoading}
                  onClick={handleDeclareResult}
                >
                  {declareLoading ? "Processing..." : "Declare"}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="card-body">
          <div className="card-header p-0 bg-primary-yellow">
            <h5 className="card-title">Declared Match Result List</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Sr.No.</th>
                  <th>Date&Time</th>
                  <th>Game Name</th>
                  <th>Match Name</th>
                  <th>Market Name</th>
                  <th>Status</th>
                  <th>Result</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingTable ? (
                  <tr>
                    <td colSpan="8" className="table_loader">
                      <div className="py-5 text-center">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : marketData.length > 0 ? (
                  marketData.map((item, index) => (
                    <tr key={item._id}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>
                        {moment(item.created_at).format("DD-MM-YYYY HH:mm")}
                      </td>
                      <td>{item.game_name || "-"}</td>
                      <td>{item.team_name || "-"}</td>
                      <td>{item.full_team_name}</td>
                      <td>
                        <span
                          className={
                            item.status === 1 ? "text-success" : "text-danger"
                          }
                        >
                          {item.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {/* <span className={item.result === 1 ? "text-success" : "text-danger"}>
                            {item.result === 1 ? "Win" : "Lose"}
                          </span> */}
                        {/* {item.result} */}
                        <td>
                          <span
                            className={
                              Number(item.result) === 1
                                ? "text-success fw-bold"
                                : "text-danger fw-bold"
                            }
                          >
                            {Number(item.result) === 1 ? "Declared" : "Pending"}
                          </span>
                        </td>
                      </td>
                      {/* <td>
                          <button
                            className="btn btn-warning btn-sm"
                            disabled={btnLoading[item._id]}
                            onClick={() => handleRollback(item)}
                          >
                            {btnLoading[item._id] ? "Processing..." : "Rollback"}
                          </button>
                        </td> */}
                      {/* <td>
                      {item.lenadena_settle === 1 && (
                        <button
                          className="btn btn-warning btn-sm"
                          disabled={btnLoading[item._id]}
                          onClick={() => handleRollbacklenadenasettled(item)}
                        >
                          {btnLoading[item._id] ? "Processing..." : "settled"}
                        </button>
                      )}
                    </td> */}

                      <td>
                        {item.lenadena_settle === 0 ? (
                          <button
                            className="btn btn-warning btn-sm"
                            disabled={btnLoading[item._id]}
                            onClick={() => handleRollbacklenadenasettled(item)}
                          >
                            {btnLoading[item._id]
                              ? "Processing..."
                              : "Lena Dena"}
                          </button>
                        ) : (
                          "Lena Dena Ho Chuka H"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* <div className="d-flex justify-content-end gap-2">
            <button
              className="importbutton"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <MdOutlineKeyboardArrowLeft />
            </button>
            <span className="align-self-center">
              {page} of {totalPages}
            </span>
            <button
              className="importbutton"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <MdOutlineKeyboardArrowRight />
            </button>
          </div> */}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center my-3">
            <div className="paginationall d-flex align-items-center gap-1">
              <button disabled={currentPage === 1} onClick={handlePrev}>
                <MdKeyboardDoubleArrowLeft /> Previous
              </button>

              <div className="d-flex gap-1">
                {getPageNumbers().map((page) => (
                  <div
                    key={page}
                    className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </div>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={handleNext}
              >
                Next <MdKeyboardDoubleArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainMarket;
