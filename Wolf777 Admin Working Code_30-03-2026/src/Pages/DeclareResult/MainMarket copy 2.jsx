import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";

import {
  getAllGames,


  getExternalEventsBySport,

  getmatchEvents,
  getMarketsByEvent,
  getSelectionsByMarket,
  declareMatchResult,
  getAllMatchResultList
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
  const searchParams = new URLSearchParams(location.search);
  const sportId = searchParams.get("sportId");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    sport_id: ""
  });
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

  // ✅ Fetch events by sport
  // const fetchEvents = async (sportId) => {
  //   if (!sportId) return;
  //   try {
  //     setLoading(true);
  //     const response = await getExternalEventsBySport(sportId);
  //     console.log("fetchevent",response)
  //     if (response.data.success && Array.isArray(response.data.events)) {
  //       setEvents(response.data.events);
  //     } else {
  //       setEvents([]);
  //       Swal.fire({ icon: "info", title: "No Active Matches" });
  //     }
  //   } catch (err) {
  //     console.error("Error fetching matches:", err);
  //     Swal.fire({ icon: "error", title: "Error fetching matches" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchEvents = async (sportId) => {
    try {
      setLoading(true);
      let allEvents = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const params = {
          page: currentPage,
          limit: 100,
          ...filters,
          sport_id: sportId
        };

        const response = await getmatchEvents(params);

        if (response.data.success && response.data.data) {
          allEvents = [...allEvents, ...response.data.data];

          // Check if there are more pages
          if (response.data.pagination) {
            hasMore = currentPage < response.data.pagination.totalPages;
            currentPage++;
          } else {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      setEvents(allEvents);
      setError("");
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchEvents();
  }, []);
 
 
 
 
  useEffect(() => {
    if (selectedSportId) {
      setFilters(prev => ({ ...prev, sport_id: selectedSportId }));
      // fetchEvents(selectedSportId);
    } else {
      setEvents([]);
    }
  }, [selectedSportId]);

  // ✅ Fetch markets by event
  const fetchMarketsByEvent = async (event_id) => {
    if (!event_id) return;
    try {
      const res = await getMarketsByEvent(event_id);
      console.log("event", res)
      if (res.data.success) {
        const formatted = res.data.markets.map((m) => ({
          value: m.market_id,
          label: m.market_name,
        }));
        setMarketList(formatted);
      } else {
        setMarketList([]);
        Swal.fire({ icon: "info", title: "No Markets Found" });
      }
    } catch (err) {
      console.error("Error fetching markets:", err);
      Swal.fire({ icon: "error", title: "Server Error" });
    }
  };

  // ✅ Fetch selections (teams) by market
  const fetchSelectionsByMarket = async (market_id) => {
    if (!market_id) return;
    try {
      const res = await getSelectionsByMarket(market_id);
      if (res.data.success) {
        const formattedTeams = res.data.teams.map((t) => ({
          value: t.team_id,
          label: t.team_name,
        }));
        setTeamList(formattedTeams);
      } else {
        setTeamList([]);
        Swal.fire({ icon: "info", title: "No Selections Found" });
      }
    } catch (err) {
      console.error("Error fetching selections:", err);
      Swal.fire({ icon: "error", title: "Server Error" });
    }
  };
  const handleDeclareResult = async () => {
    if (!selectedEventId || !selectedMarket?.value || !selectedTeam) {
      Swal.fire({ icon: "warning", title: "Please select all fields" });
      return;
    }

    const payload = {
      match: `${selectedMarket.value},${selectedEventId}`,
      market: selectedMarket.label,
      selection: selectedTeam,
      sport: selectedSportId,

    };


    try {
      setIsButtonDisabled(true);

      const res = await declareMatchResult(payload);

      Swal.fire({
        icon: "success",
        title: res.data.message,
      });
      fetchMatchResultList();

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
      });
    } finally {
      setIsButtonDisabled(false);
    }
  };
  const fetchMatchResultList = async () => {
    try {
      const params = {
        page,
        limit,
        sport_id: selectedSportId || "",
        event_id: selectedEventId || "",
        market_id: selectedMarket?.value || "",
        selection_id: selectedTeam || ""
      };

      const res = await getAllMatchResultList(params);

      if (res.data.success) {
        setMarketData(res.data.results || []);
        setTotal(res.data.total || 0);
      }

    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };
  useEffect(() => {
    fetchMatchResultList();
  }, [page, selectedSportId, selectedEventId, selectedMarket, selectedTeam]);




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
                  onChange={(selectedOption) => {
                    const selectedSportId = selectedOption?.value || "";
                    setSelectedSportId(selectedSportId);  // ⭐ SPORT ID correctly set
                    // fetchEvents(selectedSportId);
                  }}
                  placeholder="Select Sport"
                />

              </div>

              {/* 🔹 Select Match */}
              {/* <div className="form_latest_design">
                <label className="form-label">
                  Select Match <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={events.map((event) => ({
                    value: event.event_id,
                    label: `${event.name} (${moment(event.date_time).format("DD-MM-YYYY hh:mm A")})`,
                  }))}
                  value={events
                    .map((event) => ({
                      value: event.event_id,
                      label: `${event.name} (${moment(event.date_time).format("DD-MM-YYYY hh:mm A")})`,
                    }))
                    .find((opt) => opt.value === selectedEventId)}
                  onChange={(selected) => {
                    setSelectedMatch(selected);
                    setSelectedEventId(selected?.value);
                    fetchMarketsByEvent(selected?.value);
                  }}
                  placeholder="Select Match"
                />
              </div> */}
              {/* <div className="form_latest_design">
                <label className="form-label">
                  Select Match <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={events.map((event) => ({
                    value: event.id || event.event_id,
                    label: `${event.name}`,
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
                    fetchMarketsByEvent(selected?.value);
                    setSelectedMarket("");
                    setSelectedTeam("");
                    setTeamList([]);
                  }}
                  placeholder="Select Match"
                  isDisabled={!selectedSportId}
                />
                {loading && <small className="text-muted">Loading matches...</small>}
              </div> */}
              {/* 🔹 Select Market */}
              {/* <div className="form_latest_design">
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
                />
              </div> */}
              <div className="form_latest_design">
                <label className="form-label">
                  Select Market<span style={{ color: "red" }}>*</span>
                </label>

                <Select
                  // options={staticMarketOptions}
                  value={selectedMarket}
                  onChange={(selected) => {
                    setSelectedMarket(selected);
                    fetchSelectionsByMarket(selected?.value);
                  }}
                  placeholder="Select Market"
                  isSearchable
                />
              </div>


              {/* 🔹 Select Selection */}
              <div className="form_latest_design">
                <label className="form-label">
                  Select Selection<span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={teamList}
                  onChange={(selected) => {
                    setSelectedTeam(selected?.value);
                  }}
                  placeholder="Select Selection"
                  isSearchable
                />
              </div>

              {/* 🔹 Declare Button */}
              <div className="form_latest_design">
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    className={`importbutton  w-auto h-auto ${isButtonDisabled ? "disabled-button" : ""
                      }`}
                    type="button"
                    disabled={isButtonDisabled}
                    onClick={handleDeclareResult}   // ⭐ Add this
                  >
                    {isButtonDisabled ? "Declared" : "Declare"}
                  </button>

                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
      <div className="table-responsive mt-2">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Date</th>
              <th>Match Name</th>
              <th>Market Name</th>
              <th>Sport Name</th>
              <th>Selection Name</th>
              <th>Result</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {marketData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No Data Found
                </td>
              </tr>
            ) : (
              marketData.map((item, index) => (
                <tr key={item._id || index}>
                  <td>{index + 1}</td>
                  <td>{moment(item.created_at).format("DD-MM-YYYY")}</td>
                  <td>{item.event_id}</td>

                  <td>{item.market_id}</td>

                  <td>{item.sport_id}</td>

                  <td>{item.team_name}</td>

                  <td>{item.result === 1 ? "Win" : "Loss"}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Rollback Result</Tooltip>}
                    >
                      <button
                        className="btn btn-sm btn-warning"
                      // onClick={() => handleRollback(item)}
                      >
                        ↩
                      </button>
                    </OverlayTrigger>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      <div className="d-flex justify-content-end mt-2">
        <div className="paginationall">
          <button
            className=""
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <MdOutlineKeyboardArrowLeft />
          </button>

          <span className="paginationnumber">{page}</span>

          <button
            className=""
            disabled={page * limit >= total}
            onClick={() => setPage(page + 1)}
          >
            <MdOutlineKeyboardArrowRight />

          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMarket;
