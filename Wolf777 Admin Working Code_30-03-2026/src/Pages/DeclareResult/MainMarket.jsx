import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  getAllGames,
  getmatchEvents,
  getSelectionsByMarket,
  declareMatchResult,
  getAllMatchResultList,
  rollbackFancyNow,
  lenadenasettled
} from "../../Server/api";
import { useLocation } from "react-router-dom";
function MainMarket() {
  const location = useLocation();
  const [marketId, setMarketId] = useState("");
  const [selectedMatch, setSelectedMatch] = useState("");
  const [teamList, setTeamList] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);
  const [marketList, setMarketList] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedSportId, setSelectedSportId] = useState("");
  const [error, setError] = useState("")
  const [btnLoading, setBtnLoading] = useState({});
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get("sportId");
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const admin_id = localStorage.getItem("admin_id")
  const [loadingSelections, setLoadingSelections] = useState(false);
  const [declareLoading, setDeclareLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sport_id: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await getAllGames();
        if (response.data.success) {
          setGames(response.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      const firstSportId = games[0].id;

      setSelectedSportId(firstSportId);
      fetchEvents(firstSportId);
    }
  }, [games]);

  useEffect(() => {
    fetchMatchResultList(page);
  }, [page]);
  const setBtnLoader = (id, val) => {
    setBtnLoading((prev) => ({ ...prev, [id]: val }));
  };

  // ✅ Fetch events
  const fetchEvents = async (sportId) => {
    try {
      setLoading(true);
      const response = await getmatchEvents();

      if (response.data.success && Array.isArray(response.data.data)) {
        let filteredEvents = response.data.data;
        if (sportId) {
          filteredEvents = filteredEvents.filter(event =>
            event.sport_id === sportId || event.sport_id?.toString() === sportId.toString()
          );
        }

        setEvents(filteredEvents);
        setError("");

        if (filteredEvents.length === 0) {
          Swal.fire({
            icon: "info",
            title: "No Matches Found",
            text: sportId ? "No matches found for the selected sport" : "No matches available"
          });
        }
      } else {
        setEvents([]);
        Swal.fire({ icon: "info", title: "No Active Matches" });
      }
    } catch (err) {
      console.error("Error fetching matches:", err);
      Swal.fire({ icon: "error", title: "Error fetching matches" });
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
          ...res.data.teams.map((t) => ({ value: t.team_id, label: t.team_name })),
          { value: "abundent", label: "Abundent" }
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



    // Validation
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



    if (!confirm.isConfirmed) return
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
        if (alertRes.isConfirmed) {
          fetchMatchResultList(page);
        }
        setSelectedMatch("");
        setSelectedEventId("");
        setSelectedMarket("");
        setSelectedTeam("");
        setTeamList([]);
      }
      else {
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




  const fetchMatchResultList = async (pageNo = page) => {
    try {
      setLoading(true);

      const payload = {
        admin_id: admin_id,
        page: pageNo,
        limit: limit,
      };

      const res = await getAllMatchResultList(payload);

      if (res.data.success) {
        setMarketData(res.data.results || []);
        setTotal(res.data.total);
        setTotalPages(res.data.pages);
        setPage(res.data.page);
      }
    } catch (err) {
      console.error("Match result list error", err);
    } finally {
      setLoading(false);
    }
  };


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
      });

      if (res.data?.success) {
        Swal.fire("Success", "Result rolled back", "success");
        fetchMatchResultList(page); // ✅ correct refresh
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
    for (let i = 1; i <= totalPages; i++) {
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



  const matchOptions = events.map(event => ({
    value: event.id || event.event_id,
    label: event.name,
    market_id: event.market_id
  }));

  return (
    <div className="marketname">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title text-white mb-0">Declared Main Result</h3>
          </div>
        </div>
        <div className="card-body">
          <form noValidate className="needs-validation">
            <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end flex-wrap">

              {/* 🔹 Select Sport */}
              <div className="form_latest_design">
                <label className="form-label">
                  Select Sport <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={games.map((game) => ({
                    value: game.id,
                    label: game.name,
                  }))}
                  value={games
                    .map(game => ({ value: game.id, label: game.name }))
                    .find(opt => opt.value === selectedSportId)
                  }
                  onChange={(selectedOption) => {
                    const selectedSportId = selectedOption?.value || "";
                    setSelectedSportId(selectedSportId);
                    fetchEvents(selectedSportId);
                  }}
                  placeholder="Select Sport"
                />
              </div>

              {/* 🔹 Select Match - Updated with new API call */}
              <div className="form_latest_design">
                <label className="form-label">
                  Select Match <span style={{ color: "red" }}>*</span>
                </label>
                {/* <Select
                  options={events.map((event) => ({
                    value: event.id || event.event_id,
                    label: `${event.name}`,
                      market_id: event.market_id 
                  }))}
                  value={events
                    .map((event) => ({
                      value: event.id || event.event_id,
                      label: `${event.name}`,
                    }))
                    .find((opt) => opt.value === selectedEventId)}
                  onChange={(selected) => {
                    setSelectedMatch(selected);
                    setSelectedEventId(selected?.value);
                    // fetchMarketsByEvent(selected?.value);
                    setSelectedMarket("");
                    setSelectedTeam("");
                    setTeamList([]);
                     fetchSelectionsByMarket(selected?.value);
                  }}
                  placeholder="Select Match"
                  isDisabled={loading}
                  isLoading={loading}
                /> */}
                <Select
                  options={matchOptions}
                  value={matchOptions.find(opt => opt.value === selectedEventId)}
                  onChange={(selected) => {
                    setSelectedMatch(selected);
                    setSelectedEventId(selected?.value);

                    // 🔥 RESET dependent states
                    setSelectedMarket("");
                    setSelectedTeam("");
                    setTeamList([]);

                    if (selected?.market_id) {
                      fetchSelectionsByMarket(selected.market_id);
                    } else {
                      Swal.fire({
                        icon: "info",
                        title: "Market not available for this match"
                      });
                    }
                  }}

                  placeholder="Select Match"
                  isDisabled={loading}
                  isLoading={loading}
                />




                {loading && <small className="text-muted">Loading matches...</small>}
              </div>

              {/* 🔹 Select Market
              <div className="form_latest_design">
                <label className="form-label">
                  Select Market<span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={marketList}
                  value={selectedMarket}
                  onChange={(selected) => {
                    setSelectedMarket(selected);
                    fetchSelectionsByMarket(selected?.value);
                  }}
                  placeholder="Select Market"
                  isSearchable
                  isDisabled={!selectedEventId}
                />
              </div> */}

              {/* 🔹 Select Selection */}
              {/* 🔹 Select Selection */}
              <div className="form_latest_design">
                <label className="form-label">
                  Select Selection<span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={teamList}
                  value={teamList.find(team => team.value === selectedTeam)}
                  onChange={(selected) => {
                    setSelectedTeam(selected?.value);
                  }}
                  placeholder={loadingSelections ? "Loading selections..." : "Select Selection"}
                  isSearchable
                  isDisabled={!selectedEventId || loadingSelections}
                  isLoading={loadingSelections}
                />

              </div>
              {/* 🔹 Declare Button */}
              <div className="form_latest_design">
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    className={`importbutton w-auto h-auto ${isButtonDisabled ? "disabled-button" : ""}`}
                    type="button"
                    // disabled={isButtonDisabled}
                    disabled={declareLoading}
                    onClick={handleDeclareResult}
                  >
                    {/* {isButtonDisabled ? "Declared" : "Declare"} */}
                    {declareLoading ? "Processing..." : "Declare"}
                  </button>
                </div>
              </div>

            </div>
          </form>

        </div>
        <div className="card-body">
          <div className="card mt-3">
            <div className="card-header bg-color-black">
              <h5 className="card-title text-white mb-0">
                Declared Match Result List
              </h5>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Sr.No.</th>
                    <th>Date&Time</th>
                    <th>Match Name</th>
                    <th>Market Name</th>
                    <th>Status</th>
                    <th>Result</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center">Loading...</td>
                    </tr>
                  ) : marketData.length > 0 ? (
                    marketData.map((item, index) => (
                      <tr key={item._id}>
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{moment(item.created_at).format("DD-MM-YYYY HH:mm")}</td>
                        <td>{item.team_name || "-"}</td>
                        <td>{item.full_team_name}</td>
                        <td>
                          <span className={item.status === 1 ? "text-success" : "text-danger"}>
                            {item.status === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          {/* <span className={item.result === 1 ? "text-success" : "text-danger"}>
                            {item.result === 1 ? "Win" : "Lose"}
                          </span> */}
                          {item.result}
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

                        {/* <td>
                          {item.lenadena_settle === 0 ? (
                            <button
                              className="btn btn-warning btn-sm"
                              disabled={btnLoading[item._id]}
                              onClick={() => handleRollbacklenadenasettled(item)}
                            >
                              {btnLoading[item._id] ? "Processing..." : "Lena Dena"}
                            </button>
                          ) : "Lena Dena Ho Chuka H"}
                        </td> */}

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">No Data Found</td>
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
            <div className="d-flex justify-content-between align-items-center mt-4">

              <div className="sohwingallentries">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, total)} of {total}
              </div>
              <div className="paginationall d-flex align-items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={handlePrev}
                  className="d-flex justify-content-center align-items-center"
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>
                <div className="d-flex gap-1">
                  {getPageNumbers().map((pageNo) => (
                    <div
                      key={pageNo}
                      className={`paginationnumber ${pageNo === page ? "active" : ""
                        }`}
                      onClick={() => handlePageClick(pageNo)}
                    >
                      {pageNo}
                    </div>
                  ))}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={handleNext}
                  className="d-flex justify-content-center align-items-center"
                >
                  <MdOutlineKeyboardArrowRight />
                </button>
              </div>
            </div>
          )}


        </div>
      </div>


    </div>

  );
}

export default MainMarket;