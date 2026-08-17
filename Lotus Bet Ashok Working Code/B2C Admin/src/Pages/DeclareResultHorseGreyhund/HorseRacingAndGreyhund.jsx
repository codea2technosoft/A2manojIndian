import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import {
  getmatchEvents,
  getSelectionsByMarket,
  declaresetHorseracinggreyHundResult,
  getCompleteMatchSettledResultListHorse,
  rollbackFancyNow,
  lenadenasettled,
  getseriesHorseCountryNameList,
  getseriesHorseCountryMarketNameList,
  getseriesHorseSelectionstNameList,
} from "../../Server/api";
import { getAllGames } from "../../Server/game.service";

function HorseRacingAndGreyhund() {
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
  const [countryNames, setCountryNames] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryMarketNames, setCountryMarketNames] = useState([]);
  const [selectedCountryMarket, setSelectedCountryMarket] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCountryMarkets, setLoadingCountryMarkets] = useState(false);
  const [timingList, setTimingList] = useState([]);
  const [selectedTiming, setSelectedTiming] = useState(null);
  const [selectionList, setSelectionList] = useState([]);
  const [selectedSelection, setSelectedSelection] = useState(null);
  const [loadingTimings, setLoadingTimings] = useState(false);
  const [loadingSelectionsList, setLoadingSelectionsList] = useState(false);
  const [matchData, setMatchData] = useState({
    event_id: "",
    market_id: "",
    team_id: "",
    team_name: "",
    timing: "",
    selection: "",
    timing_market_id: "",
    timing_event_id: "",
  });

  const fetchGames = async () => {
    try {
      setLoadingGames(true);
      const response = await getAllGames();
      if (response.data.success) {
        setGames(response.data.data || []);
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
      console.log("Fetch events payload =>", payload);
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
  const fetchCountryNames = async (sportId) => {
    try {
      setLoadingCountries(true);
      resetAllDependentStates();

      const response = await getseriesHorseCountryNameList({
        sport_id: sportId,
      });
      if (response && response.data) {
        if (response.data.success && response.data.data) {
          const dataArray = response.data.data;

          if (Array.isArray(dataArray) && dataArray.length > 0) {
            const formattedCountries = dataArray.map((item) => ({
              value: item.name,
              label: item.name,
              raw: item,
              sport_id: item.sport_id,
              country_id: item._id,
            }));
            setCountryNames(formattedCountries);
            console.log("Formatted countries:", formattedCountries);
          } else {
            setCountryNames([]);
          }
        } else {
          setCountryNames([]);
        }
      } else {
        setCountryNames([]);
      }
    } catch (err) {
      console.error("Error fetching country names:", err);
      setCountryNames([]);
      Swal.fire({
        icon: "error",
        title: "Error fetching countries",
        text: err.message || "Please try again",
      });
    } finally {
      setLoadingCountries(false);
    }
  };
  const fetchCountryMarketNames = async (sportId, countryName) => {
    if (!countryName) return;

    try {
      setLoadingCountryMarkets(true);
      setCountryMarketNames([]);
      setSelectedCountryMarket("");
      setTimingList([]);
      setSelectedTiming(null);
      setSelectionList([]);
      setSelectedSelection(null);

      console.log(
        "Fetching market names for sport_id:",
        sportId,
        "country:",
        countryName,
      );

      const response = await getseriesHorseCountryMarketNameList({
        sport_id: sportId,
        country_code: countryName,
      });

      if (response && response.data) {
        if (response.data.success && response.data.data) {
          const dataArray = response.data.data;

          if (Array.isArray(dataArray) && dataArray.length > 0) {
            const formattedMarkets = dataArray.map((item) => ({
              value: item.event_id,
              label: item.name,
              raw: item,
              event_id: item.event_id,
              market_id: item._id,
              name: item.name,
              countryCode: item.countryCode,
              sport_id: item.sport_id,
            }));
            setCountryMarketNames(formattedMarkets);
            console.log("Formatted markets:", formattedMarkets);
          } else {
            setCountryMarketNames([]);
          }
        } else {
          setCountryMarketNames([]);
        }
      } else {
        setCountryMarketNames([]);
      }
    } catch (err) {
      console.error("Error fetching country market names:", err);
      setCountryMarketNames([]);
      Swal.fire({
        icon: "error",
        title: "Error fetching markets",
        text: err.message || "Please try again",
      });
    } finally {
      setLoadingCountryMarkets(false);
    }
  };

  const fetchTimings = async (sportId, countryCode, name) => {
    if (!sportId || !countryCode || !name) {
      console.log("Missing required fields:", { sportId, countryCode, name });
      return;
    }

    try {
      setLoadingTimings(true);
      setTimingList([]);
      setSelectedTiming(null);
      setSelectionList([]);
      setSelectedSelection(null);

      setMatchData((prev) => ({
        ...prev,
        timing: "",
        timing_market_id: "",
        timing_event_id: "",
        team_id: "",
        team_name: "",
      }));

      console.log("Fetching timings for:", { sportId, countryCode, name });
      const response = await getseriesHorseSelectionstNameList({
        sport_id: sportId,
        country_code: countryCode,
        name: name,
      });

      if (response && response.data) {
        if (response.data.success && response.data.datatimes) {
          const dataArray = response.data.datatimes;
          if (Array.isArray(dataArray) && dataArray.length > 0) {
            const formattedTimings = dataArray.map((item, index) => ({
              value: item.marketid || item.event_id || `timing_${index}`,
              label: item.time || `Timing ${index + 1}`,
              raw: item,
              time: item.time,
              marketid: item.marketid,
              event_id: item.event_id || item.marketid,
              timing_id: item._id || item.marketid || index,
            }));
            setTimingList(formattedTimings);
            console.log("Formatted timings:", formattedTimings);
          } else {
            setTimingList([]);
            Swal.fire({
              icon: "info",
              title: "No timings available for this market",
            });
          }
        } else {
          setTimingList([]);
          if (response.data && response.data.message) {
            Swal.fire({
              icon: "info",
              title: response.data.message || "No timings available",
            });
          }
        }
      } else {
        setTimingList([]);
      }
    } catch (err) {
      console.error("Error fetching timings:", err);
      setTimingList([]);
      Swal.fire({
        icon: "error",
        title: "Error fetching timings",
        text: err.message || "Please try again",
      });
    } finally {
      setLoadingTimings(false);
    }
  };
  const fetchSelectionsByMarketId = async (marketid) => {
    if (!marketid) return;
    try {
      setLoadingSelectionsList(true);
      setSelectionList([]);
      setSelectedSelection(null);

      const res = await getSelectionsByMarket(marketid);
      if (
        res &&
        res.data &&
        res.data.success &&
        Array.isArray(res.data.teams)
      ) {
        const formattedSelections = res.data.teams.map((t) => ({
          value: t.team_id,
          label: t.team_name,
          team_id: t.team_id,
          team_name: t.team_name,
          raw: t,
          market_id: t.market_id,
        }));
        setSelectionList(formattedSelections);
      } else {
        setSelectionList([]);
        Swal.fire({
          icon: "info",
          title: "No selections found for this timing",
        });
      }
    } catch (err) {
      console.error("Error fetching selections:", err);
      setSelectionList([]);
      Swal.fire({
        icon: "error",
        title: "Error fetching selections",
        text: err.message || "Please try again",
      });
    } finally {
      setLoadingSelectionsList(false);
    }
  };
  const resetAllDependentStates = () => {
    setSelectedCountry("");
    setCountryMarketNames([]);
    setSelectedCountryMarket("");
    setTimingList([]);
    setSelectedTiming(null);
    setSelectionList([]);
    setSelectedSelection(null);
    setMatchData({
      event_id: "",
      market_id: "",
      team_id: "",
      team_name: "",
      timing: "",
      selection: "",
      timing_market_id: "",
      timing_event_id: "",
    });
  };

  const handleSportChange = (selectedOption) => {
    const sportId = selectedOption?.value;
    setSelectedSportId(sportId);
    setSelectedMatch(null);
    setSelectedEventId(null);
    setSelectedMarket("");
    setSelectedTeam("");
    setTeamList([]);
    setEvents([]);
    setCountryNames([]);
    resetAllDependentStates();

    if (sportId) {
      fetchCountryNames(sportId);
      fetchEvents(sportId);
    }
  };
  const handleCountryChange = (selectedOption) => {
    const countryName = selectedOption?.value;
    setSelectedCountry(countryName);
    setCountryMarketNames([]);
    setSelectedCountryMarket("");
    setTimingList([]);
    setSelectedTiming(null);
    setSelectionList([]);
    setSelectedSelection(null);
    setMatchData({
      event_id: "",
      market_id: "",
      team_id: "",
      team_name: "",
      timing: "",
      selection: "",
      timing_market_id: "",
      timing_event_id: "",
    });

    if (countryName && selectedSportId) {
      fetchCountryMarketNames(selectedSportId, countryName);
    }
  };
  const handleCountryMarketChange = (selectedOption) => {
    setSelectedCountryMarket(selectedOption?.value || "");
    setTimingList([]);
    setSelectedTiming(null);
    setSelectionList([]);
    setSelectedSelection(null);
    setMatchData({
      event_id: "",
      market_id: "",
      team_id: "",
      team_name: "",
      timing: "",
      selection: "",
      timing_market_id: "",
      timing_event_id: "",
    });

    if (selectedOption && selectedCountry && selectedSportId) {
      setMatchData((prev) => ({
        ...prev,
        event_id: selectedOption.event_id,
        market_id: selectedOption.market_id,
      }));
      fetchTimings(selectedSportId, selectedCountry, selectedOption.name);
    }
  };

  const handleTimingChange = (selectedOption) => {
    setSelectedTiming(selectedOption);
    setSelectionList([]);
    setSelectedSelection(null);
    setMatchData((prev) => ({
      ...prev,
      timing: selectedOption?.time || selectedOption?.label || "",
      timing_market_id: selectedOption?.marketid || "",
      timing_event_id: selectedOption?.event_id || "",
      team_id: "",
      team_name: "",
    }));

    if (selectedOption && selectedOption.marketid) {
      fetchSelectionsByMarketId(selectedOption.marketid);
    }
  };

  const handleSelectionChange = (selectedOption) => {
    setSelectedSelection(selectedOption);

    if (selectedOption) {
      setSelectedTeam(selectedOption.value);
      setMatchData((prev) => ({
        ...prev,
        team_id: selectedOption.value,
        team_name: selectedOption.team_name || selectedOption.label,
        selection: selectedOption.value,
      }));
    }
  };

  const handleDeclareResult = async () => {
    if (!selectedSportId) {
      Swal.fire({ icon: "warning", title: "Please select Sport" });
      return;
    }
    if (!selectedCountry) {
      Swal.fire({ icon: "warning", title: "Please select Country" });
      return;
    }
    if (!selectedCountryMarket) {
      Swal.fire({ icon: "warning", title: "Please select Market" });
      return;
    }
    if (!selectedTiming) {
      Swal.fire({ icon: "warning", title: "Please select Timing" });
      return;
    }
    if (!selectedSelection) {
      Swal.fire({ icon: "warning", title: "Please select Selection" });
      return;
    }
    const timingToSend =
      matchData.timing || selectedTiming?.time || selectedTiming?.label || "";
    const payload = {
      sport_id: selectedSportId,
      country: selectedCountry,
      event_id: selectedSelection?.market_id || matchData.timing_market_id,
      market_id: selectedSelection?.market_id || matchData.timing_market_id,
      timing: timingToSend,
      timing_market_id: matchData.timing_market_id,
      timing_event_id: matchData.timing_event_id,
      selection: selectedSelection?.value,
      team_id: matchData.team_id,
      team_name: matchData.team_name,
    };
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to declare result for ${matchData.team_name || selectedSelection?.label}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Declare",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setDeclareLoading(true);
      const res = await declaresetHorseracinggreyHundResult(payload);
      if (res && res.data && res.data.success) {
        await Swal.fire({
          icon: "success",
          title: res.data.message || "Result declared successfully",
          confirmButtonText: "OK",
        });
        fetchGames();
        fetchMatchResultList(page);
        resetForm();
      } else {
        Swal.fire({
          icon: "error",
          title: res?.data?.message || "Declaration failed",
        });
      }
    } catch (err) {
      console.error("Declaration error:", err);
      Swal.fire({
        icon: "error",
        title: "Server error",
        text: err.message || "Please try again",
      });
    } finally {
      setDeclareLoading(false);
    }
  };
  const resetForm = () => {
    setSelectedMatch(null);
    setSelectedEventId(null);
    setSelectedMarket("");
    setSelectedTeam("");
    setTeamList([]);
    setSelectedTiming(null);
    setSelectedSelection(null);
    setTimingList([]);
    setSelectionList([]);
    setMatchData({
      event_id: "",
      market_id: "",
      team_id: "",
      team_name: "",
      timing: "",
      selection: "",
      timing_market_id: "",
      timing_event_id: "",
    });
  };

  const fetchMatchResultList = async (pageNo) => {
    try {
      setLoadingTable(true);
      const payload = {
        admin_id: admin_id,
        page: pageNo,
        limit: limit,
      };
      const res = await getCompleteMatchSettledResultListHorse(payload);
      if (res.data.success) {
        setMarketData(res.data.results || []);
        setTotal(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Match result list error", err);
    } finally {
      setLoadingTable(false);
    }
  };
  const handleRollbacklenadenasettled = async (item) => {
    const confirm = await Swal.fire({
      title: "Settled Result?",
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

  const getPageNumbers = () => {
    let pages = [];
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + 1);
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
    label: `${event.name} (${event.time || ""})`,
    market_id: event.market_id,
  }));

  return (
    <div className="marketname">
      <div className="allcommon ">
        <div className="py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="page-title mb-0">
              Declared GreyHund & Horse Racing Result
            </h2>
          </div>
        </div>
        <div className="card-body">
          <form noValidate className="needs-validation">
            <div className="row g-3 align-items-end pb-3">
              {/* Select Sport */}
              <div className="col-12 col-md-2">
                <div className="form_latest_design w-100">
                  <label className="form-label">
                    Select Sport <span style={{ color: "red" }}>*</span>
                  </label>

                  <select
                    className="form-select"
                    value={selectedSportId || ""}
                    onChange={(e) => {
                      const selected = [
                        { value: 7, label: "Horse Racing" },
                        { value: 8, label: "Greyhound" },
                      ].find((opt) => String(opt.value) === e.target.value);

                      handleSportChange(selected);
                    }}
                  >
                    <option value="">Select Sport</option>

                    <option value="7">Horse Racing</option>
                    <option value="8">Greyhound</option>
                  </select>
                </div>
              </div>

              {/* Select Country */}
              <div className="col-12 col-md-2">
                <div className="form_latest_design w-100">
                  <label className="form-label">
                    Select Country <span style={{ color: "red" }}>*</span>
                  </label>

                  <select
                    className="form-select"
                    value={selectedCountry || ""}
                    disabled={!selectedSportId || loadingCountries}
                    onChange={(e) => {
                      const selected = countryNames.find(
                        (opt) => String(opt.value) === e.target.value,
                      );

                      handleCountryChange(selected);
                    }}
                  >
                    <option value="">
                      {loadingCountries
                        ? "Loading countries..."
                        : "Select Country"}
                    </option>

                    {!loadingCountries &&
                      countryNames.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Select Market */}
              <div className="col-12 col-md-2">
                <div className="form_latest_design w-100">
                  <label className="form-label">
                    Select Market <span style={{ color: "red" }}>*</span>
                  </label>

                  <select
                    className="form-select"
                    value={selectedCountryMarket || ""}
                    disabled={!selectedCountry || loadingCountryMarkets}
                    onChange={(e) => {
                      const selected = countryMarketNames.find(
                        (opt) => String(opt.value) === e.target.value,
                      );

                      handleCountryMarketChange(selected);
                    }}
                  >
                    <option value="">
                      {loadingCountryMarkets
                        ? "Loading markets..."
                        : "Select Market"}
                    </option>

                    {!loadingCountryMarkets &&
                      countryMarketNames.map((market) => (
                        <option key={market.value} value={market.value}>
                          {market.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Select Timing */}
              <div className="col-12 col-md-2">
                <div className="form_latest_design w-100">
                  <label className="form-label">
                    Select Timing <span style={{ color: "red" }}>*</span>
                  </label>

                  <select
                    className="form-select"
                    value={selectedTiming?.value || ""}
                    disabled={!selectedCountryMarket || loadingTimings}
                    onChange={(e) => {
                      const selected = timingList.find(
                        (opt) => String(opt.value) === e.target.value,
                      );

                      handleTimingChange(selected);
                    }}
                  >
                    <option value="">
                      {loadingTimings ? "Loading timings..." : "Select Timing"}
                    </option>

                    {!loadingTimings &&
                      timingList.map((timing) => (
                        <option key={timing.value} value={timing.value}>
                          {timing.time || timing.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Select Selection */}
              <div className="col-12 col-md-2">
                <div className="form_latest_design w-100">
                  <label className="form-label">
                    Select Selection <span style={{ color: "red" }}>*</span>
                  </label>

                  <select
                    className="form-select"
                    value={selectedSelection?.value || ""}
                    disabled={!selectedTiming || loadingSelectionsList}
                    onChange={(e) => {
                      const selected = selectionList.find(
                        (opt) => String(opt.value) === e.target.value,
                      );

                      handleSelectionChange(selected);
                    }}
                  >
                    <option value="">
                      {loadingSelectionsList
                        ? "Loading selections..."
                        : "Select Selection"}
                    </option>

                    {!loadingSelectionsList &&
                      selectionList.map((selection) => (
                        <option key={selection.value} value={selection.value}>
                          {selection.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Declare Button */}
              <div className="col-12 col-md-2">
                <div className="buttonsubmit w-100">
                  <button
                    className={`btn btn-light theme_dark_btn w-100 ${
                      isButtonDisabled ? "disabled-button" : ""
                    }`}
                    type="button"
                    disabled={declareLoading}
                    onClick={handleDeclareResult}
                  >
                    {declareLoading ? "Processing..." : "Declare"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="card-body">
          <div className="card">
            <div className="card-header bg-primary-yellow">
              <h5 className="card-title mb-0">Declared Match Result List</h5>
            </div>
            <div className="card-body table-responsive">
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
                  </tr>
                </thead>
                <tbody>
                  {loadingTable ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Loading...
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
                          <span
                            className={
                              item.result === 1
                                ? "text-success fw-bold"
                                : "text-danger fw-bold"
                            }
                          >
                            {item.result === 1 ? "Declared" : "Not Declared"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {total > limit && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="sohwingallentries"></div>
              <div className="paginationall d-flex align-items-center gap-1">
                <button
                  type="button"
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
                      className={`paginationnumber ${pageNo === page ? "active" : ""}`}
                      onClick={() => handlePageClick(pageNo)}
                    >
                      {pageNo}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
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
export default HorseRacingAndGreyhund;
