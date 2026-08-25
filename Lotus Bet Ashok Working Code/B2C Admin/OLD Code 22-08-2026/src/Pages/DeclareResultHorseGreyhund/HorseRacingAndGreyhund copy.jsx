// import React, { useState, useEffect } from "react";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import Select from "react-select";
// import Swal from "sweetalert2";
// import moment from "moment";
// import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
// import {

//   getmatchEvents,
//   getSelectionsByMarket,
//   declareMatchResult,
//   getAllMatchResultList,
//   rollbackFancyNow,
//   lenadenasettled
// } from "../../Server/api";
// import { getAllGames } from "../../Server/game.service";

// function HorseRacingAndGreyhund() {

//   const [marketId, setMarketId] = useState("");
//   const [selectedMatch, setSelectedMatch] = useState("");
//   const [teamList, setTeamList] = useState([]);
//   const [isButtonDisabled, setIsButtonDisabled] = useState(false);
//   const [games, setGames] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [selectedEventId, setSelectedEventId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [loadingGames, setLoadingGames] = useState(false);
//   const [loadingTable, setLoadingTable] = useState(false);
//   const [marketData, setMarketData] = useState([]);
//   const [marketList, setMarketList] = useState([]);
//   const [selectedMarket, setSelectedMarket] = useState("");
//   const [selectedTeam, setSelectedTeam] = useState("");
//   const [selectedSportId, setSelectedSportId] = useState("");
//   const [error, setError] = useState("")
//   const [btnLoading, setBtnLoading] = useState({});

//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(100);
//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const admin_id = localStorage.getItem("admin_id")
//   const [loadingSelections, setLoadingSelections] = useState(false);
//   const [declareLoading, setDeclareLoading] = useState(false);
//   const [filters, setFilters] = useState({
//     search: "",
//     status: "",
//     sport_id: "",
//   });
//   const [showFilter, setShowFilter] = useState(false);
//   const fetchGames = async () => {
//     try {
//       setLoadingGames(true);
//       const response = await getAllGames();
//       if (response.data.success) {
//         setGames(response.data.data || []);
//       }
//     } catch (err) {
//       console.error("Error fetching games:", err);
//     } finally {
//       setLoadingGames(false);
//     }
//   };

//   useEffect(() => {
//     fetchGames();
//   }, []);

//   // useEffect(() => {
//   //   if (games.length > 0) {

//   //     // const selectedId = sportId;

//   //     setSelectedSportId(selectedId);
//   //     fetchEvents(selectedId);
//   //   }
//   // }, [games, sportId]);

//   useEffect(() => {
//     fetchMatchResultList(page);
//   }, [page, limit]);

//   const setBtnLoader = (id, val) => {
//     setBtnLoading((prev) => ({ ...prev, [id]: val }));
//   };

//   const fetchEvents = async (sportId) => {
//     try {
//       setLoading(true);

//       const payload = {
//         sport_id: sportId,
//       };

//       console.log("Payload =>", payload);

//       const response = await getmatchEvents(payload);

//       if (response.data.success) {
//         setEvents(response.data.data || []);
//         setError("");
//       } else {
//         setEvents([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (selectedSportId) {
//       fetchEvents(selectedSportId);
//     }
//   }, [selectedSportId]);

//   const fetchSelectionsByMarket = async (market_id) => {
//     if (!market_id) return;

//     try {
//       setLoadingSelections(true);
//       setTeamList([]);
//       setSelectedTeam("");

//       const res = await getSelectionsByMarket(market_id);

//       if (res.data.success && Array.isArray(res.data.teams)) {
//         const formattedTeams = [
//           ...res.data.teams.map((t) => ({ value: t.team_id, label: t.team_name })),
//           { value: "abundent", label: "Abundent" }
//         ];
//         if (res.data.teams.length > 0) {
//           setSelectedTeam(res.data.teams[0].team_id);
//         }
//         setTeamList(formattedTeams);
//         if (formattedTeams.length > 0) {
//           setSelectedTeam(formattedTeams[0].value);
//         }
//       } else {
//         setTeamList([]);
//         // Swal.fire({ icon: "info", title: "No Selections Found" });
//       }
//     } catch (err) {
//       console.error("Error fetching selections:", err);
//       // Swal.fire({ icon: "error", title: "Server Error" });
//     } finally {
//       setLoadingSelections(false);
//     }
//   };

//   const handleDeclareResult = async () => {




//     if (!selectedEventId || !selectedMatch?.market_id || !selectedTeam) {
//       Swal.fire({ icon: "warning", title: "Please select all fields" });
//       return;
//     }
//     const confirm = await Swal.fire({
//       title: "Are you sure?",
//       text: "Do you really want to declare this result?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, Declare",
//       cancelButtonText: "Cancel",
//     });



//     if (!confirm.isConfirmed) return
//     const payload = {
//       match: `${selectedMatch.market_id},${selectedEventId}`,
//       market: selectedEventId,
//       selection: selectedTeam,
//       sport: selectedSportId,
//     };
//     try {
//       // setIsButtonDisabled(true);
//       setDeclareLoading(true);
//       const res = await declareMatchResult(payload);
//       if (res.data?.success) {
//         const alertRes = await Swal.fire({
//           icon: "success",
//           title: res.data.message,
//           confirmButtonText: "OK",
//         });
//         fetchGames();
//         if (alertRes.isConfirmed) {
//           fetchMatchResultList(page);
//         }
//         setSelectedMatch("");
//         setSelectedEventId("");
//         setSelectedMarket("");
//         setSelectedTeam("");
//         setTeamList([]);
//       }
//       else {
//         Swal.fire({
//           icon: "error",
//           title: res.data?.message,
//         });
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       // setIsButtonDisabled(false);
//       setDeclareLoading(false);
//     }
//   };

//   const fetchMatchResultList = async (pageNo) => {
//     try {
//       setLoadingTable(true);

//       const payload = {
//         admin_id: admin_id,
//         page: pageNo,
//         limit: limit,
//       };
//       const res = await getAllMatchResultList(payload);

//       if (res.data.success) {
//         setMarketData(res.data.results || []);
//         setTotal(res.data.pagination.total);
//         setTotalPages(res.data.pagination.totalPages);
//       }
//     } catch (err) {
//       console.error("Match result list error", err);
//     } finally {
//       setLoadingTable(false);
//     }
//   };

//   // const handleRollback = async (item) => {
//   //   const confirm = await Swal.fire({
//   //     title: "Rollback Result?",
//   //     text: item.full_team_name,
//   //     icon: "warning",
//   //     showCancelButton: true,
//   //     confirmButtonText: "Yes, Rollback",
//   //   });

//   //   if (!confirm.isConfirmed) return;

//   //   try {
//   //     setBtnLoader(item._id, true);

//   //     const res = await rollbackFancyNow({
//   //       result_id: item._id,
//   //       event_id: item.event_id,
//   //     });

//   //     if (res.data?.success) {
//   //       Swal.fire("Success", "Result rolled back", "success");
//   //       fetchMatchResultList(page); // ✅ correct refresh
//   //     } else {
//   //       Swal.fire("Error", res.data?.message || "Rollback failed", "error");
//   //     }
//   //   } catch (err) {
//   //     Swal.fire("Error", "Server error", "error");
//   //   } finally {
//   //     setBtnLoader(item._id, false);
//   //   }
//   // };

//   const handleRollbacklenadenasettled = async (item) => {
//     const confirm = await Swal.fire({
//       title: " Settled Result?",
//       text: item.full_team_name,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, settled",
//     });

//     if (!confirm.isConfirmed) return;

//     try {
//       setBtnLoader(item._id, true);

//       const res = await lenadenasettled({
//         result_id: item._id,
//         event_id: item.event_id,
//       });
//       if (res.data?.success) {
//         Swal.fire("Success", res.data.message, "success");
//         fetchMatchResultList(page);
//       } else {
//         Swal.fire("Error", res.data?.message || "Rollback failed", "error");
//       }
//     } catch (err) {
//       Swal.fire("Error", "Server error", "error");
//     } finally {
//       setBtnLoader(item._id, false);
//     }
//   };
//   const confirmAction = async (title, text) => {
//     return await Swal.fire({
//       title,
//       text,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Proceed",
//     });
//   };
//   const getPageNumbers = () => {
//     let pages = [];

//     let start = Math.max(1, page - 1);
//     let end = Math.min(totalPages, start + 1);

//     // adjust start if end reached last
//     if (end === totalPages) {
//       start = Math.max(1, totalPages - 1);
//     }
//     for (let i = start; i <= end; i++) {
//       pages.push(i);
//     }

//     return pages;
//   };
//   const handlePrev = () => {
//     if (page > 1) setPage(page - 1);
//   };
//   const handleNext = () => {
//     if (page < totalPages) setPage(page + 1);
//   };
//   const handlePageClick = (pageNo) => {
//     setPage(pageNo);
//   };

//   const matchOptions = events.map(event => ({
//     value: event.id || event.event_id,
//     // label: event.name,
//     label: `${event.name} (${event.time || ''})`, // ✅ Time add karo
//     market_id: event.market_id
//   }));
//   return (
//     <div className="marketname">
//       <div className="card">
//         <div className="card-header bg-primary-yellow">
//           <div className="d-flex justify-content-between align-items-center">
//             <h3 className="card-title mb-0">Declared Main Result</h3>
//           </div>
//         </div>
//         <div className="card-body">
//           <form noValidate className="needs-validation">
//             <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end flex-md-nowrap flex-wrap">

//               {/* 🔹 Select Sport */}
//               {/* <div className="form_latest_design w-100">
//                 <label className="form-label">
//                   Select Sport <span style={{ color: "red" }}>*</span>
//                 </label>
//                 <Select
//                   options={games.map((game) => ({
//                     value: game.id,
//                     label: game.name,
//                   }))}
//                   value={games
//                     .map(game => ({ value: game.id, label: game.name }))
//                     .find(opt => opt.value === selectedSportId)
//                   }
//                   onChange={(selectedOption) => {
//                     const sportId = selectedOption?.value;

//                     setSelectedSportId(sportId);

//                     setSelectedMatch(null);
//                     setSelectedEventId(null);
//                     setSelectedMarket("");
//                     setSelectedTeam("");
//                     setTeamList([]);
//                     setEvents([]);

//                     fetchEvents(sportId); // ✅ direct new sport id
//                   }}
//                   placeholder="Select Sport"
//                 />
//               </div> */}

//               <div className="form_latest_design w-100">
//                 <label className="form-label">
//                   Select Sport <span style={{ color: "red" }}>*</span>
//                 </label>

//                 <Select
//                   options={[
//                     {
//                       value: 7,
//                       label: "Horse Racing",
//                     },
//                     {
//                       value: 8,
//                       label: "Greyhound",
//                     },
//                   ]}
//                   value={[
//                     {
//                       value: 7,
//                       label: "Horse Racing",
//                     },
//                     {
//                       value: 8,
//                       label: "Greyhound",
//                     },
//                   ].find((opt) => opt.value === selectedSportId)}
//                   onChange={(selectedOption) => {
//                     const sportId = selectedOption?.value;

//                     setSelectedSportId(sportId);

//                     setSelectedMatch(null);
//                     setSelectedEventId(null);
//                     setSelectedMarket("");
//                     setSelectedTeam("");
//                     setTeamList([]);
//                     setEvents([]);

//                     fetchEvents(sportId);
//                   }}
//                   placeholder="Select Sport"
//                 />
//               </div>


//               {/* 🔹 Select Match - Updated with new API call */}
//               <div className="form_latest_design w-100">
//                 <label className="form-label">
//                   Select Match <span style={{ color: "red" }}>*</span>
//                 </label>
//                 <Select
//                   options={matchOptions}
//                   value={selectedEventId ? matchOptions.find(opt => opt.value === selectedEventId) : null}
//                   onChange={(selected) => {
//                     setSelectedMatch(selected);
//                     setSelectedEventId(selected?.value);
//                     setSelectedMarket("");
//                     setSelectedTeam("");
//                     setTeamList([]);
//                     if (selected?.market_id) {
//                       fetchSelectionsByMarket(selected.market_id);
//                     } else {
//                       Swal.fire({
//                         icon: "info",
//                         title: "Market not available for this match"
//                       });
//                     }
//                   }}
//                   placeholder="Select Match"
//                   isDisabled={loadingGames}
//                   isLoading={loadingGames}
//                 />

//               </div>
//               {/* 🔹 Select Market
//               <div className="form_latest_design">
//                 <label className="form-label">
//                   Select Market<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <Select
//                   options={marketList}
//                   value={selectedMarket}
//                   onChange={(selected) => {
//                     setSelectedMarket(selected);
//                     fetchSelectionsByMarket(selected?.value);
//                   }}
//                   placeholder="Select Market"
//                   isSearchable
//                   isDisabled={!selectedEventId}
//                 />
//               </div> */}
//               {/* 🔹 Select Selection */}
//               <div className="form_latest_design w-100">
//                 <label className="form-label">
//                   Select Selection<span style={{ color: "red" }}>*</span>
//                 </label>
//                 <Select
//                   options={teamList}
//                   value={teamList.find(team => team.value === selectedTeam)}
//                   onChange={(selected) => {
//                     setSelectedTeam(selected?.value);
//                   }}
//                   placeholder={loadingSelections ? "Loading selections..." : "Select Selection"}
//                   isSearchable
//                   isDisabled={!selectedEventId || loadingSelections}
//                   isLoading={loadingSelections}
//                 />
//               </div>
//               {/* 🔹 Declare Button */}
//               <div className="buttonsubmit">
//                 <button
//                   className={`btn btn-success w-auto h-auto ${isButtonDisabled ? "disabled-button" : ""}`}
//                   type="button"
//                   // disabled={isButtonDisabled}
//                   disabled={declareLoading}
//                   onClick={handleDeclareResult}
//                 >
//                   {/* {isButtonDisabled ? "Declared" : "Declare"} */}
//                   {declareLoading ? "Processing..." : "Declare"}
//                 </button>
//               </div>

//             </div>
//           </form>

//         </div>
//         <div className="card-body">
//           <div className="card">
//             <div className="card-header bg-primary-yellow">
//               <h5 className="card-title  mb-0">
//                 Declared Match Result List
//               </h5>
//             </div>
//             <div className="card-body table-responsive">
//               <table className="table table-bordered">
//                 <thead className="table-dark">
//                   <tr>
//                     <th>Sr.No.</th>
//                     <th>Date&Time</th>
//                     <th>Game Name</th>
//                     <th>Match Name</th>
//                     <th>Market Name</th>
//                     <th>Status</th>
//                     <th>Result</th>
//                     {/* <th>Action</th> */}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loadingTable ? (
//                     <tr>
//                       <td colSpan="8" className="text-center">Loading...</td>
//                     </tr>
//                   ) : marketData.length > 0 ? (
//                     marketData.map((item, index) => (
//                       <tr key={item._id}>
//                         <td>{(page - 1) * limit + index + 1}</td>
//                         <td>{moment(item.created_at).format("DD-MM-YYYY HH:mm")}</td>
//                         <td>{item.game_name || "-"}</td>
//                         <td>{item.team_name || "-"}</td>
//                         <td>{item.full_team_name}</td>
//                         <td>
//                           <span className={item.status === 1 ? "text-success" : "text-danger"}>
//                             {item.status === 1 ? "Active" : "Inactive"}
//                           </span>
//                         </td>
//                         <td>
//                           {/* <span className={item.result === 1 ? "text-success" : "text-danger"}>
//                             {item.result === 1 ? "Win" : "Lose"}
//                           </span> */}
//                           {item.result}
//                         </td>
//                         {/* <td>
//                           <button
//                             className="btn btn-warning btn-sm"
//                             disabled={btnLoading[item._id]}
//                             onClick={() => handleRollback(item)}
//                           >
//                             {btnLoading[item._id] ? "Processing..." : "Rollback"}
//                           </button>
//                         </td> */}
//                         {/* <td>
//   {item.lenadena_settle === 1 && (
//     <button
//       className="btn btn-warning btn-sm"
//       disabled={btnLoading[item._id]}
//       onClick={() => handleRollbacklenadenasettled(item)}
//     >
//       {btnLoading[item._id] ? "Processing..." : "settled"}
//     </button>
//   )}
// </td> */}

//                         {/* <td>
//                           {item.lenadena_settle === 0 ? (
//                             <button
//                               className="btn btn-warning btn-sm"
//                               disabled={btnLoading[item._id]}
//                               onClick={() => handleRollbacklenadenasettled(item)}
//                             >
//                               {btnLoading[item._id] ? "Processing..." : "Lena Dena"}
//                             </button>
//                           ) : "Lena Dena Ho Chuka H"}
//                         </td> */}

//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="8" className="text-center">No Data Found</td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           {/* <div className="d-flex justify-content-end gap-2">
//             <button
//               className="importbutton"
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//             >
//               <MdOutlineKeyboardArrowLeft />
//             </button>
//             <span className="align-self-center">
//               {page} of {totalPages}
//             </span>
//             <button
//               className="importbutton"
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//             >
//               <MdOutlineKeyboardArrowRight />
//             </button>
//           </div> */}
//           {total > limit && (
//             <div className="d-flex justify-content-between align-items-center mt-4">

//               <div className="sohwingallentries">
//                 {/* Showing {(page - 1) * limit + 1} to{" "}
//                 {Math.min(page * limit, total)} of {total} */}
//               </div>
//               <div className="paginationall d-flex align-items-center gap-1">
//                 <button
//                   type="button"
//                   disabled={page === 1}
//                   onClick={handlePrev}
//                   className="d-flex justify-content-center align-items-center"
//                 >
//                   <MdOutlineKeyboardArrowLeft />
//                 </button>
//                 <div className="d-flex gap-1">
//                   {getPageNumbers().map((pageNo) => (
//                     <div
//                       key={pageNo}
//                       className={`paginationnumber ${pageNo === page ? "active" : ""
//                         }`}
//                       onClick={() => handlePageClick(pageNo)}
//                     >
//                       {pageNo}
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   type="button"
//                   disabled={page === totalPages}
//                   onClick={handleNext}
//                   className="d-flex justify-content-center align-items-center"
//                 >
//                   <MdOutlineKeyboardArrowRight />
//                 </button>
//               </div>
//             </div>
//           )}


//         </div>
//       </div>


//     </div>

//   );
// }

// export default HorseRacingAndGreyhund;
import React, { useState, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import {
  getmatchEvents,
  getSelectionsByMarket,
  declaresetHorseracinggreyHundResult,
  getCompleteMatchSettledResultListHorse,
  rollbackFancyNow,
  lenadenasettled,
  getseriesHorseCountryNameList,
  getseriesHorseCountryMarketNameList,
  getseriesHorseSelectionstNameList
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
  const [error, setError] = useState("")
  const [btnLoading, setBtnLoading] = useState({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
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

  // New states for horse racing/greyhound
  const [countryNames, setCountryNames] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryMarketNames, setCountryMarketNames] = useState([]);
  const [selectedCountryMarket, setSelectedCountryMarket] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCountryMarkets, setLoadingCountryMarkets] = useState(false);

  // New states for Timing and Selection
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
    timing_event_id: ""
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

  // Step 1: Fetch events based on sport (kept for backward compatibility)
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

  // Step 2: Fetch country names based on sport_id
  const fetchCountryNames = async (sportId) => {
    try {
      setLoadingCountries(true);
      // Reset all dependent states
      resetAllDependentStates();

      console.log("Fetching country names for sport_id:", sportId);

      const response = await getseriesHorseCountryNameList({ sport_id: sportId });

      console.log("Country names response:", response);

      if (response && response.data) {
        if (response.data.success && response.data.data) {
          const dataArray = response.data.data;

          if (Array.isArray(dataArray) && dataArray.length > 0) {
            const formattedCountries = dataArray.map(item => ({
              value: item.name,
              label: item.name,
              raw: item,
              sport_id: item.sport_id,
              country_id: item._id
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
        text: err.message || "Please try again"
      });
    } finally {
      setLoadingCountries(false);
    }
  };

  // Step 3: Fetch country market names based on sport_id and country_name
// Step 3: Fetch country market names based on sport_id and country_name
const fetchCountryMarketNames = async (sportId, countryName) => {
  if (!countryName) return;

  try {
    setLoadingCountryMarkets(true);
    // Reset dependent states
    setCountryMarketNames([]);
    setSelectedCountryMarket("");
    setTimingList([]);
    setSelectedTiming(null);
    setSelectionList([]);
    setSelectedSelection(null);

    console.log("Fetching market names for sport_id:", sportId, "country:", countryName);

    const response = await getseriesHorseCountryMarketNameList({
      sport_id: sportId,
      country_code: countryName
    });

    console.log("Market names response:", response);

    if (response && response.data) {
      if (response.data.success && response.data.data) {
        const dataArray = response.data.data;

        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const formattedMarkets = dataArray.map(item => ({
            value: item.event_id,
            label: item.name,  // ✅ "Lingfield", "Carlisle", etc.
            raw: item,
            event_id: item.event_id,
            market_id: item._id,
            name: item.name,  // ✅ Store name separately
            countryCode: item.countryCode,
            sport_id: item.sport_id
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
      text: err.message || "Please try again"
    });
  } finally {
    setLoadingCountryMarkets(false);
  }
};

  // Step 4: Fetch timings based on sport_id, country_code, and event_id
  // const fetchTimings = async (sportId, countryCode, eventId) => {
  //   if (!sportId || !countryCode || !eventId) return;

  //   try {
  //     setLoadingTimings(true);
  //     // Reset dependent states
  //     setTimingList([]);
  //     setSelectedTiming(null);
  //     setSelectionList([]);
  //     setSelectedSelection(null);

  //     console.log("Fetching timings for:", { sportId, countryCode, eventId });

  //     // API call with proper parameters
  //     const response = await getseriesHorseSelectionstNameList({
  //       sport_id: sportId,
  //       country_code: countryCode,
  //       event_id: eventId
  //     });

  //     console.log("Timings response:", response);

  //     if (response && response.data) {
  //       if (response.data.success && response.data.datatimes) {
  //         const dataArray = response.data.datatimes;

  //         if (Array.isArray(dataArray) && dataArray.length > 0) {
  //           // Format timings from datatimes array
  //           const formattedTimings = dataArray.map((item, index) => ({
  //             value: item.marketid || item.event_id || `timing_${index}`,
  //             label: item.time || `Timing ${index + 1}`,
  //             raw: item,
  //             time: item.time,
  //             marketid: item.marketid,
  //             event_id: item.event_id,
  //             timing_id: item._id || item.marketid || index
  //           }));
  //           setTimingList(formattedTimings);
  //           console.log("Formatted timings:", formattedTimings);

  //           // Auto-select first timing
  //           if (formattedTimings.length > 0) {
  //             setSelectedTiming(formattedTimings[0]);
  //             // Store timing market_id and event_id
  //             setMatchData(prev => ({
  //               ...prev,
  //               timing_market_id: formattedTimings[0].marketid,
  //               timing_event_id: formattedTimings[0].event_id
  //             }));
  //             // Fetch selections for first timing using marketid
  //             fetchSelectionsByMarketId(formattedTimings[0].marketid);
  //           }
  //         } else {
  //           setTimingList([]);
  //           Swal.fire({
  //             icon: "info",
  //             title: "No timings available for this market"
  //           });
  //         }
  //       } else {
  //         setTimingList([]);
  //         if (response.data && response.data.message) {
  //           Swal.fire({
  //             icon: "info",
  //             title: response.data.message || "No timings available"
  //           });
  //         }
  //       }
  //     } else {
  //       setTimingList([]);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching timings:", err);
  //     setTimingList([]);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error fetching timings",
  //       text: err.message || "Please try again"
  //     });
  //   } finally {
  //     setLoadingTimings(false);
  //   }
  // };

  // Step 4: Fetch timings based on sport_id, country_code, and event_id - FIXED
 // Step 4: Fetch timings - NO AUTO-SELECT
// const fetchTimings = async (sportId, countryCode, eventId,name) => {
//   if (!sportId || !countryCode || !name  ) return;

//   try {
//     setLoadingTimings(true);
//     // Reset dependent states
//     setTimingList([]);
//     setSelectedTiming(null);  // ✅ null rakho
//     setSelectionList([]);
//     setSelectedSelection(null);  // ✅ null rakho
    
//     // Reset matchData timing fields
//     setMatchData(prev => ({
//       ...prev,
//       timing: "",
//       timing_market_id: "",
//       timing_event_id: "",
//       team_id: "",
//       team_name: ""
//     }));

//     console.log("Fetching timings for:", { sportId, countryCode, eventId });

//     const response = await getseriesHorseSelectionstNameList({
//       sport_id: sportId,
//       country_code: countryCode,
//       // event_id: eventId
//       name:name
//     });

//     console.log("Timings response:", response);

//     if (response && response.data) {
//       if (response.data.success && response.data.datatimes) {
//         const dataArray = response.data.datatimes;

//         if (Array.isArray(dataArray) && dataArray.length > 0) {
//           const formattedTimings = dataArray.map((item, index) => ({
//             value: item.marketid || item.event_id || `timing_${index}`,
//             label: item.time || `Timing ${index + 1}`,
//             raw: item,
//             time: item.time,
//             marketid: item.marketid,
//             event_id: item.marketid,
//             timing_id: item._id || item.marketid || index
//           }));
//           setTimingList(formattedTimings);
//           console.log("Formatted timings:", formattedTimings);
          
//           // ✅ AUTO-SELECT HATAO - Sirf list set karo
//           // selectedTiming null hi rahega
          
//         } else {
//           setTimingList([]);
//           Swal.fire({
//             icon: "info",
//             title: "No timings available for this market"
//           });
//         }
//       } else {
//         setTimingList([]);
//         if (response.data && response.data.message) {
//           Swal.fire({
//             icon: "info",
//             title: response.data.message || "No timings available"
//           });
//         }
//       }
//     } else {
//       setTimingList([]);
//     }
//   } catch (err) {
//     console.error("Error fetching timings:", err);
//     setTimingList([]);
//     Swal.fire({
//       icon: "error",
//       title: "Error fetching timings",
//       text: err.message || "Please try again"
//     });
//   } finally {
//     setLoadingTimings(false);
//   }
// };

// const fetchTimings = async (sportId, countryCode, name) => {
//   if (!sportId || !countryCode || !name) {
//     console.log("Missing required fields:", { sportId, countryCode, name });
//     return;
//   }

//   try {
//     setLoadingTimings(true);
//     // Reset dependent states
//     setTimingList([]);
//     setSelectedTiming(null);
//     setSelectionList([]);
//     setSelectedSelection(null);
    
//     setMatchData(prev => ({
//       ...prev,
//       timing: "",
//       timing_market_id: "",
//       timing_event_id: "",
//       team_id: "",
//       team_name: ""
//     }));

//     console.log("Fetching timings for:", { sportId, countryCode, name });

//     // ✅ API payload mein sirf name bhejo
//     const response = await getseriesHorseSelectionstNameList({
//       sport_id: sportId,
//       country_code: countryCode,
//       name: name  // ✅ Sirf name bhejo
//     });

//     console.log("Timings response:", response);

//     if (response && response.data) {
//       if (response.data.success && response.data.datatimes) {
//         const dataArray = response.data.datatimes;

//         if (Array.isArray(dataArray) && dataArray.length > 0) {
//           const formattedTimings = dataArray.map((item, index) => ({
//             value: item.marketid || item.event_id || `timing_${index}`,
//             label: item.time || `Timing ${index + 1}`,
//             raw: item,
//             time: item.time,
//             marketid: item.marketid,
//             event_id: item.event_id || item.marketid,
//             timing_id: item._id || item.marketid || index
//           }));
//           setTimingList(formattedTimings);
//           console.log("Formatted timings:", formattedTimings);
//         } else {
//           setTimingList([]);
//           Swal.fire({
//             icon: "info",
//             title: "No timings available for this market"
//           });
//         }
//       } else {
//         setTimingList([]);
//         if (response.data && response.data.message) {
//           Swal.fire({
//             icon: "info",
//             title: response.data.message || "No timings available"
//           });
//         }
//       }
//     } else {
//       setTimingList([]);
//     }
//   } catch (err) {
//     console.error("Error fetching timings:", err);
//     setTimingList([]);
//     Swal.fire({
//       icon: "error",
//       title: "Error fetching timings",
//       text: err.message || "Please try again"
//     });
//   } finally {
//     setLoadingTimings(false);
//   }
// };
// Step 4: Fetch timings - With name parameter
const fetchTimings = async (sportId, countryCode, name) => {
  if (!sportId || !countryCode || !name) {
    console.log("Missing required fields:", { sportId, countryCode, name });
    return;
  }

  try {
    setLoadingTimings(true);
    // Reset dependent states
    setTimingList([]);
    setSelectedTiming(null);
    setSelectionList([]);
    setSelectedSelection(null);
    
    setMatchData(prev => ({
      ...prev,
      timing: "",
      timing_market_id: "",
      timing_event_id: "",
      team_id: "",
      team_name: ""
    }));

    console.log("Fetching timings for:", { sportId, countryCode, name });

    // ✅ API payload mein name bhejo
    const response = await getseriesHorseSelectionstNameList({
      sport_id: sportId,
      country_code: countryCode,
      name: name  // ✅ Sirf name bhejo
    });

    console.log("Timings response:", response);

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
            timing_id: item._id || item.marketid || index
          }));
          setTimingList(formattedTimings);
          console.log("Formatted timings:", formattedTimings);
        } else {
          setTimingList([]);
          Swal.fire({
            icon: "info",
            title: "No timings available for this market"
          });
        }
      } else {
        setTimingList([]);
        if (response.data && response.data.message) {
          Swal.fire({
            icon: "info",
            title: response.data.message || "No timings available"
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
      text: err.message || "Please try again"
    });
  } finally {
    setLoadingTimings(false);
  }
};

  // Step 5: Fetch selections based on marketid - Updated to use correct API
  // const fetchSelectionsByMarketId = async (marketid) => {
  //   if (!marketid) return;

  //   try {
  //     setLoadingSelectionsList(true);
  //     setSelectionList([]);
  //     setSelectedSelection(null);

  //     console.log("Fetching selections for marketid:", marketid);

  //     // Call the correct API endpoint for horse selections
  //     const res = await getSelectionsByMarket(marketid);

  //     console.log("Selections response:", res);

  //     if (res && res.data && res.data.success && Array.isArray(res.data.teams)) {
  //       const formattedSelections = res.data.teams.map((t) => ({
  //         value: t.team_id,
  //         label: t.team_name,
  //         team_id: t.team_id,
  //         team_name: t.team_name,
  //         raw: t,
  //         market_id: t.market_id
  //       }));

  //       setSelectionList(formattedSelections);
  //       console.log("Formatted selections:", formattedSelections);

  //       if (formattedSelections.length > 0) {
  //         // Auto-select first selection
  //         setSelectedSelection(formattedSelections[0]);
  //         setMatchData(prev => ({
  //           ...prev,
  //           team_id: formattedSelections[0].value,
  //           team_name: formattedSelections[0].team_name
  //         }));
  //       }
  //     } else {
  //       setSelectionList([]);
  //       Swal.fire({
  //         icon: "info",
  //         title: "No selections found for this timing"
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error fetching selections:", err);
  //     setSelectionList([]);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error fetching selections",
  //       text: err.message || "Please try again"
  //     });
  //   } finally {
  //     setLoadingSelectionsList(false);
  //   }
  // };

  // Step 5: Fetch selections - NO AUTO-SELECT
const fetchSelectionsByMarketId = async (marketid) => {
  if (!marketid) return;

  try {
    setLoadingSelectionsList(true);
    setSelectionList([]);
    setSelectedSelection(null);  // ✅ null rakho

    console.log("Fetching selections for marketid:", marketid);

    const res = await getSelectionsByMarket(marketid);

    console.log("Selections response:", res);

    if (res && res.data && res.data.success && Array.isArray(res.data.teams)) {
      const formattedSelections = res.data.teams.map((t) => ({
        value: t.team_id,
        label: t.team_name,
        team_id: t.team_id,
        team_name: t.team_name,
        raw: t,
        market_id: t.market_id
      }));

      setSelectionList(formattedSelections);
      console.log("Formatted selections:", formattedSelections);

      // ✅ AUTO-SELECT HATAO
      // selectedSelection null hi rahega
      // User manually select karega

    } else {
      setSelectionList([]);
      Swal.fire({
        icon: "info",
        title: "No selections found for this timing"
      });
    }
  } catch (err) {
    console.error("Error fetching selections:", err);
    setSelectionList([]);
    Swal.fire({
      icon: "error",
      title: "Error fetching selections",
      text: err.message || "Please try again"
    });
  } finally {
    setLoadingSelectionsList(false);
  }
};
  // Reset all dependent states
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
      timing_event_id: ""
    });
  };

  // Handle sport selection
  const handleSportChange = (selectedOption) => {
    const sportId = selectedOption?.value;
    setSelectedSportId(sportId);

    // Reset all dependent states
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

  // Handle country selection
  const handleCountryChange = (selectedOption) => {
    const countryName = selectedOption?.value;
    setSelectedCountry(countryName);

    // Reset dependent states
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
      timing_event_id: ""
    });

    if (countryName && selectedSportId) {
      fetchCountryMarketNames(selectedSportId, countryName);
    }
  };

  // Handle country market selection
  // const handleCountryMarketChange = (selectedOption) => {
  //   setSelectedCountryMarket(selectedOption?.value || "");

  //   // Reset dependent states
  //   setTimingList([]);
  //   setSelectedTiming(null);
  //   setSelectionList([]);
  //   setSelectedSelection(null);
  //   setMatchData({
  //     event_id: "",
  //     market_id: "",
  //     team_id: "",
  //     team_name: "",
  //     timing: "",
  //     selection: "",
  //     timing_market_id: "",
  //     timing_event_id: ""
  //   });

  //   if (selectedOption && selectedCountry && selectedSportId) {
  //     // Store market info
  //     setMatchData(prev => ({
  //       ...prev,
  //       event_id: selectedOption.event_id,
  //       market_id: selectedOption.market_id
  //     }));

  //     // Fetch timings with sport_id, country_code, and event_id
  //     fetchTimings(
  //       selectedSportId,
  //       selectedCountry,
  //       selectedOption.event_id
  //     );
  //   }
  // };
  // Handle country market selection
const handleCountryMarketChange = (selectedOption) => {
  setSelectedCountryMarket(selectedOption?.value || "");

  // Reset dependent states
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
    timing_event_id: ""
  });

  if (selectedOption && selectedCountry && selectedSportId) {
    // Store market info
    setMatchData(prev => ({
      ...prev,
      event_id: selectedOption.event_id,
      market_id: selectedOption.market_id
    }));

    // ✅ Fetch timings with name (selectedOption.name)
    fetchTimings(
      selectedSportId,
      selectedCountry,
      selectedOption.name  // ✅ name send karo
    );
  }
};

  // Handle timing selection
  const handleTimingChange = (selectedOption) => {
    setSelectedTiming(selectedOption);

    // Reset selection
    setSelectionList([]);
    setSelectedSelection(null);
    setMatchData(prev => ({
      ...prev,
      timing: selectedOption?.time || selectedOption?.label || "",
      timing_market_id: selectedOption?.marketid || "",
      timing_event_id: selectedOption?.event_id || "",
      team_id: "",
      team_name: ""
    }));

    if (selectedOption && selectedOption.marketid) {
      // Fetch selections based on marketid
      fetchSelectionsByMarketId(selectedOption.marketid);
    }
  };

  // Handle selection change
  const handleSelectionChange = (selectedOption) => {
    setSelectedSelection(selectedOption);

    if (selectedOption) {
      setSelectedTeam(selectedOption.value);
      setMatchData(prev => ({
        ...prev,
        team_id: selectedOption.value,
        team_name: selectedOption.team_name || selectedOption.label,
        selection: selectedOption.value
      }));
    }
  };

  // Modified handleDeclareResult for new flow
  // const handleDeclareResult = async () => {
  //   // Validate selections based on new flow
  //   if (!selectedSportId) {
  //     Swal.fire({ icon: "warning", title: "Please select Sport" });
  //     return;
  //   }
  //   if (!selectedCountry) {
  //     Swal.fire({ icon: "warning", title: "Please select Country" });
  //     return;
  //   }
  //   if (!selectedCountryMarket) {
  //     Swal.fire({ icon: "warning", title: "Please select Market" });
  //     return;
  //   }
  //   if (!selectedTiming) {
  //     Swal.fire({ icon: "warning", title: "Please select Timing" });
  //     return;
  //   }
  //   if (!selectedSelection) {
  //     Swal.fire({ icon: "warning", title: "Please select Selection" });
  //     return;
  //   }

  //   // Prepare payload for declaration
  //   const payload = {
  //     sport_id: selectedSportId,
  //     country: selectedCountry,
  //     event_id: matchData.event_id,
  //     //market_id: matchData.market_id,
  //     market_id: selectedSelection?.market_id || matchData.timing_market_id,
  //     timing: matchData.timing,
  //     timing_market_id: matchData.timing_market_id,
  //     timing_event_id: matchData.timing_event_id,
  //     selection: selectedSelection?.value,
  //     team_id: matchData.team_id,
  //     team_name: matchData.team_name,
  //     //selection_market_id: selectedSelection?.market_id || matchData.timing_market_id
  //   };

  //   console.log("Declaration payload:", payload);

  //   const confirm = await Swal.fire({
  //     title: "Are you sure?",
  //     text: `Do you really want to declare result for ${matchData.team_name || selectedSelection?.label}?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, Declare",
  //     cancelButtonText: "Cancel",
  //   });

  //   if (!confirm.isConfirmed) return;

  //   try {
  //     setDeclareLoading(true);
  //     const res = await declaresetHorseracinggreyHundResult(payload);
  //     console.log("Declaration response:", res);

  //     if (res && res.data && res.data.success) {
  //       await Swal.fire({
  //         icon: "success",
  //         title: res.data.message || "Result declared successfully",
  //         confirmButtonText: "OK",
  //       });
  //       fetchGames();
  //       fetchMatchResultList(page);
  //       resetForm();
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: res?.data?.message || "Declaration failed",
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Declaration error:", err);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Server error",
  //       text: err.message || "Please try again"
  //     });
  //   } finally {
  //     setDeclareLoading(false);
  //   }
  // };

  // Modified handleDeclareResult - FIXED
  const handleDeclareResult = async () => {
    // Validate selections
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

    // ✅ FIX: Ensure timing is not null or undefined
    const timingToSend = matchData.timing || selectedTiming?.time || selectedTiming?.label || "";

    console.log("Timing being sent:", timingToSend);
    console.log("Selected Timing object:", selectedTiming);
    console.log("MatchData timing:", matchData.timing);

    // Prepare payload
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
      team_name: matchData.team_name
    };

    console.log("Final Declaration payload:", payload);

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
      console.log("Declaration response:", res);

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
        text: err.message || "Please try again"
      });
    } finally {
      setDeclareLoading(false);
    }
  };

  // Reset form function
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
      timing_event_id: ""
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

  // Rollback function
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

  const matchOptions = events.map(event => ({
    value: event.id || event.event_id,
    label: `${event.name} (${event.time || ''})`,
    market_id: event.market_id
  }));

  return (
    <div className="marketname">
      <div className="card">
        <div className="card-header bg-primary-yellow">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">Declared GreyHund & Horse Racing Result</h3>
          </div>
        </div>
        <div className="card-body">
          <form noValidate className="needs-validation">
            <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end flex-md-nowrap flex-wrap">

              {/* Sport Selection */}
              <div className="form_latest_design w-100">
                <label className="form-label">
                  Select Sport <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={[
                    { value: 7, label: "Horse Racing" },
                    { value: 8, label: "Greyhound" },
                  ]}
                  value={[
                    { value: 7, label: "Horse Racing" },
                    { value: 8, label: "Greyhound" },
                  ].find((opt) => opt.value === selectedSportId)}
                  onChange={handleSportChange}
                  placeholder="Select Sport"
                />
              </div>

              {/* Country Selection */}
              <div className="form_latest_design w-100">
                <label className="form-label">
                  Select Country <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={countryNames}
                  value={countryNames.find(opt => opt.value === selectedCountry)}
                  onChange={handleCountryChange}
                  placeholder={loadingCountries ? "Loading countries..." : "Select Country"}
                  isDisabled={!selectedSportId || loadingCountries}
                  isLoading={loadingCountries}
                  noOptionsMessage={() => loadingCountries ? "Loading..." : "No countries available"}
                />
              </div>

              {/* Country Market Selection */}
              <div className="form_latest_design w-100">
                <label className="form-label">
                  Select Market <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={countryMarketNames}
                  value={countryMarketNames.find(opt => opt.value === selectedCountryMarket)}
                  onChange={handleCountryMarketChange}
                  placeholder={loadingCountryMarkets ? "Loading markets..." : "Select Market"}
                  isDisabled={!selectedCountry || loadingCountryMarkets}
                  isLoading={loadingCountryMarkets}
                  noOptionsMessage={() => loadingCountryMarkets ? "Loading..." : "No markets available"}
                />
              </div>

              {/* Timing Selection */}
              {/* <div className="form_latest_design w-100">
                <label className="form-label">
                  Select Timing <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={timingList}
                  value={selectedTiming}
                  onChange={handleTimingChange}
                  placeholder={loadingTimings ? "Loading timings..." : "Select Timing"}
                  isDisabled={!selectedCountryMarket || loadingTimings}
                  isLoading={loadingTimings}
                  noOptionsMessage={() => loadingTimings ? "Loading..." : "No timings available"}
                  formatOptionLabel={(option) => (
                    <div>
                      <span>{option.time || option.label}</span>
                    </div>
                  )}
                />
              </div> */}

              <div className="form_latest_design w-100">
  <label className="form-label">
    Select Timing <span style={{ color: "red" }}>*</span>
  </label>
  <Select
    options={[
      { value: "", label: "Select Timing", isDisabled: true },  // ✅ Disabled option
      ...timingList
    ]}
    value={selectedTiming}
    onChange={handleTimingChange}
    placeholder="Select Timing"
    isDisabled={!selectedCountryMarket || loadingTimings}
    isLoading={loadingTimings}
    noOptionsMessage={() => loadingTimings ? "Loading..." : "No timings available"}
    formatOptionLabel={(option) => (
      <div>
        <span>{option.time || option.label}</span>
      </div>
    )}
  />
</div>

              {/* Selection */}
              <div className="form_latest_design w-100">
                <label className="form-label">
                  Select Selection <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  options={selectionList}
                  value={selectedSelection}
                  onChange={handleSelectionChange}
                  placeholder={loadingSelectionsList ? "Loading selections..." : "Select Selection"}
                  isDisabled={!selectedTiming || loadingSelectionsList}
                  isLoading={loadingSelectionsList}
                  noOptionsMessage={() => loadingSelectionsList ? "Loading..." : "No selections available"}
                />
              </div>

              {/* Declare Button */}
              <div className="buttonsubmit">
                <button
                  className={`btn btn-success w-auto h-auto ${isButtonDisabled ? "disabled-button" : ""}`}
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

        {/* Table Section */}
        <div className="card-body">
          <div className="card">
            <div className="card-header bg-primary-yellow">
              <h5 className="card-title mb-0">
                Declared Match Result List
              </h5>
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
                      <td colSpan="7" className="text-center">Loading...</td>
                    </tr>
                  ) : marketData.length > 0 ? (
                    marketData.map((item, index) => (
                      <tr key={item._id}>
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{moment(item.created_at).format("DD-MM-YYYY HH:mm")}</td>
                        <td>{item.game_name || "-"}</td>
                        <td>{item.team_name || "-"}</td>
                        <td>{item.full_team_name}</td>
                        <td>
                          <span className={item.status === 1 ? "text-success" : "text-danger"}>
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
                      <td colSpan="7" className="text-center">No Data Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
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