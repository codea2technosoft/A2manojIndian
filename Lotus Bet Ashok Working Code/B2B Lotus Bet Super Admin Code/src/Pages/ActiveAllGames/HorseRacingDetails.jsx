// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loader from "../../Common/Loader";
// import { importMarketGet } from "../../Server/api"; // ✅ Import API

// const HorseRacingDetails = () => {

//   const navigate = useNavigate();
//   const location = useLocation();
//   const navigationPayload = location.state?.payload || {};

//   const [loading, setLoading] = useState(true);
//   const [runners, setRunners] = useState([]);
//   const [raceInfo, setRaceInfo] = useState({});
//   const [userBets, setUserBets] = useState([]);
//   const [eventId, setEventId] = useState("");
//   const [sportId, setSportId] = useState("");

//   useEffect(() => {
//     const pathParts = location.pathname.split("/");

//     const eventIndex = pathParts.indexOf("event_id");
//     const sportIndex = pathParts.indexOf("sportId");

//     const eventId = eventIndex !== -1 ? pathParts[eventIndex + 1] : "";
//     const sportId = sportIndex !== -1 ? pathParts[sportIndex + 1] : "";

//     setEventId(eventId);
//     setSportId(sportId);

//     if (eventId && sportId) {
//       fetchMarketOdds();
//     } else {
//       toast.error("Missing event or sport ID");
//       setLoading(false);
//     }
//   }, [eventId, sportId]);

//   const fetchMarketOdds = async () => {
//     try {
//       setLoading(true);

//       // ✅ Call server API
//       const response = await importMarketGet(sportId, eventId);
//       console.warn("Market Data Response:", response);

//       // ✅ Check response structure
//       if (response.data?.status_code === 1) {
//         const data = response.data.data || [];

//         // ✅ Extract runners from response
//         const runnerList = data.map((item) => ({
//           name: item.team_name || "Unknown",
//           back: item.backOdds || 0,
//           lay: item.layOdds || 0,
//           team_id: item.team_id,
//           market_id: item.market_id,
//         }));

//         setRunners(runnerList);

//         // ✅ Race info – extract from response or navigation
//         const firstItem = data[0] || {};
//         setRaceInfo({
//           event_name: navigationPayload.venue || firstItem.market_name || "Race",
//           date: firstItem.match_start_time
//             ? new Date(firstItem.match_start_time).toLocaleDateString("en-US", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })
//             : navigationPayload.date || "",
//           time: navigationPayload.race_time || "",
//           in_play: response.data.inPlay || false,
//           race_name: firstItem.market_name || "Race",
//         });

//         // ✅ User bets (if available)
//         setUserBets(response.data.userBets || []);
//       } else {
//         toast.error(response.data?.message || "Failed to fetch market data");
//         setRunners([]);
//       }
//     } catch (error) {
//       console.error("Error fetching market odds:", error);
//       toast.error(error.response?.data?.message || "Failed to load market data");
//       setRunners([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="card">
//         <div className="card-body text-center">
//           <Loader />
//           <p className="mt-2">Loading race details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!runners.length && !loading) {
//     return (
//       <div className="card">
//         <div className="card-body text-center py-5">
//           <h5 className="text-muted">No runners found for this race</h5>
//           <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card">
//         <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
//           <h4 className="card-title mb-0">
//             {raceInfo.event_name} {raceInfo.date}
//             {raceInfo.in_play && (
//               <span className="badge bg-danger ms-2">In Play</span>
//             )}
//           </h4>
//           <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
//             Back
//           </button>
//         </div>

//         <div className="card-body">
//           {raceInfo.time && (
//             <div className="mb-2 text-muted small">{raceInfo.time}</div>
//           )}
//           {raceInfo.race_name && <h5 className="mb-3">{raceInfo.race_name}</h5>}

//           {/* Odds Table */}
//           <div className="table-responsive mb-4">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th style={{ width: "40%" }}>RUNNER</th>
//                   <th className="text-center" style={{ width: "30%" }}>BACK</th>
//                   <th className="text-center" style={{ width: "30%" }}>LAY</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {runners.map((runner, idx) => (
//                   <tr key={idx}>
//                     <td><strong>{runner.name}</strong></td>
//                     <td className="text-center">{runner.back || "-"}</td>
//                     <td className="text-center">{runner.lay || "-"}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* User Bets Table */}
//           <h5 className="mb-3">User Bets</h5>
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover table-striped">
//               <thead className="table-dark">
//                 <tr>
//                   <th>User Name</th>
//                   <th>Selection</th>
//                   <th>Rate</th>
//                   <th>User Stake</th>
//                   <th>Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {userBets.length > 0 ? (
//                   userBets.map((bet, idx) => (
//                     <tr key={idx}>
//                       <td>{bet.user || "-"}</td>
//                       <td>{bet.selection || "-"}</td>
//                       <td>{bet.rate || "-"}</td>
//                       <td>{bet.stake || "-"}</td>
//                       <td>{bet.time || "-"}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr><td colSpan="5" className="text-center">No Data Found</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HorseRacingDetails;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loader from "../../Common/Loader";
// import { importMarketGet } from "../../Server/api";
// import { Col, Row } from "react-bootstrap";

// const HorseRacingDetails = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const navigationPayload = location.state?.payload || {};

//   const [loading, setLoading] = useState(true);
//   const [runners, setRunners] = useState([]);
//   const [raceInfo, setRaceInfo] = useState({});
//   const [userBets, setUserBets] = useState([]);
//   const [eventId, setEventId] = useState("");
//   const [sportId, setSportId] = useState("");

//   useEffect(() => {
//     const pathParts = location.pathname.split("/");

//     const eventIndex = pathParts.indexOf("event_id");
//     const sportIndex = pathParts.indexOf("sportId");

//     const eventId = eventIndex !== -1 ? pathParts[eventIndex + 1] : "";
//     const sportId = sportIndex !== -1 ? pathParts[sportIndex + 1] : "";

//     setEventId(eventId);
//     setSportId(sportId);

//     if (eventId && sportId) {
//       fetchMarketOdds();
//     } else {
//       toast.error("Missing event or sport ID");
//       setLoading(false);
//     }
//   }, [eventId, sportId]);

//   const fetchMarketOdds = async () => {
//     try {
//       setLoading(true);

//       const response = await importMarketGet(sportId, eventId);
//       console.warn("Market Data Response:", response);

//       if (response.data?.status_code === 1) {
//         const data = response.data.data || [];

//         // ✅ Extract runners – only team names, odds not available
//         const runnerList = data.map((item) => ({
//           name: item.team_name || "Unknown",
//           back: "-",
//           lay: "-",
//           team_id: item.team_id,
//           market_id: item.market_id,
//         }));

//         setRunners(runnerList);

//         // ✅ Race info
//         const firstItem = data[0] || {};
//         setRaceInfo({
//           event_name: navigationPayload.venue || firstItem.market_name || "Race",
//           date: firstItem.match_start_time
//             ? new Date(firstItem.match_start_time).toLocaleDateString("en-US", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//               })
//             : navigationPayload.date || "",
//           time: navigationPayload.race_time || "",
//           in_play: response.data.inPlay || false,
//           race_name: firstItem.market_name || "Race",
//         });

//         setUserBets(response.data.userBets || []);
//       } else {
//         toast.error(response.data?.message || "Failed to fetch market data");
//         setRunners([]);
//       }
//     } catch (error) {
//       console.error("Error fetching market odds:", error);
//       toast.error(error.response?.data?.message || "Failed to load market data");
//       setRunners([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="card-body text-center">
//         <Loader />
//       </div>
//     );
//   }

//   if (!runners.length && !loading) {
//     return (
//       <div className="card">
//         <div className="card-body text-center py-5">
//           <h5 className="text-muted">No runners found for this race</h5>
//           <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card event_detail">
//         <div className="card-body">
//           <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
//             <h4 className="card-title mb-0">
//               {raceInfo.event_name} {raceInfo.date}
//               {raceInfo.in_play && (
//                 <span className="badge bg-danger ms-2">In Play</span>
//               )}
//             </h4>
//             <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
//               Back
//             </button>
//           </div>

//           <Row className="mt-2">
//             <Col md={6}>
//               <div className="table-responsive">
//                 <table className="table bet_table">
//                   <thead className="table-dark">
//                     <tr>
//                       <th className="fw-bold" style={{ width: "60%" }}>
//                         {raceInfo.race_name || "Runners"}
//                       </th>
//                       <th className="text-center" style={{ width: "20%" }}>
//                         BACK
//                       </th>
//                       <th className="text-center" style={{ width: "20%" }}>
//                         LAY
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {runners.length > 0 ? (
//                       runners.map((runner, idx) => (
//                         <tr key={idx}>
//                           <td>
//                             <strong>{runner.name}</strong>
//                           </td>
//                           <td className="text-center back_bet">{runner.back}</td>
//                           <td className="text-center lay_bet">{runner.lay}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="3" className="text-center">
//                           No runners available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </Col>

//             <Col md={6}>
//               <div className="table-responsive">
//                 <table className="table table-bordered table-hover table-striped">
//                   <thead className="table-dark">
//                     <tr>
//                       <th>User Name</th>
//                       <th>Selection</th>
//                       <th>Rate</th>
//                       <th>User Stake</th>
//                       <th>Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {userBets && userBets.length > 0 ? (
//                       userBets.map((bet, idx) => (
//                         <tr key={idx}>
//                           <td>{bet.user || "-"}</td>
//                           <td>{bet.selection || "-"}</td>
//                           <td>{bet.rate || "-"}</td>
//                           <td>{bet.stake || "-"}</td>
//                           <td>{bet.time || "-"}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="text-center">
//                           <h6 className="py-5">No Data Found</h6>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </Col>
//           </Row>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HorseRacingDetails;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loader from "../../Common/Loader";
// import { importMarketGet } from "../../Server/api";
// import { Col, Row } from "react-bootstrap";
// import axios from "axios";

// const HorseRacingDetails = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const navigationPayload = location.state?.payload || {};

//   const [loading, setLoading] = useState(true);
//   const [runners, setRunners] = useState([]);
//   const [raceInfo, setRaceInfo] = useState({});
//   const [userBets, setUserBets] = useState([]);
//   const [eventId, setEventId] = useState("");
//   const [sportId, setSportId] = useState("");
//   const [marketId, setMarketId] = useState("");
//   const [apiCalled, setApiCalled] = useState(false);

//   // ✅ Extract IDs from URL
//   useEffect(() => {
//     const pathParts = location.pathname.split("/");

//     // Event ID
//     const eventIndex = pathParts.indexOf("event_id");
//     const extractedEventId = eventIndex !== -1 && pathParts[eventIndex + 1] ? pathParts[eventIndex + 1] : "";
//     setEventId(extractedEventId);

//     // ✅ Sport ID – URL me "sportId" hai (camelCase) – jo aapke URL me hai
//     const sportIndex = pathParts.indexOf("sportId");
//     const extractedSportId = sportIndex !== -1 && pathParts[sportIndex + 1] ? pathParts[sportIndex + 1] : "";
//     setSportId(extractedSportId);

//     // Market ID: try "market_id" first, fallback to "series_idd"
//     let marketIdx = pathParts.indexOf("market_id");
//     if (marketIdx === -1) marketIdx = pathParts.indexOf("series_idd");
//     const extractedMarketId = marketIdx !== -1 && pathParts[marketIdx + 1] ? pathParts[marketIdx + 1] : "";
//     setMarketId(extractedMarketId);

//     console.log("🔍 Extracted IDs:", {
//       eventId: extractedEventId,
//       sportId: extractedSportId,
//       marketId: extractedMarketId,
//       pathParts: pathParts
//     });

//     // ✅ API call tab karo jab eventId aur sportId dono available ho
//     if (extractedEventId && extractedSportId && !apiCalled) {
//       setApiCalled(true);
//       fetchMarketOdds(extractedEventId, extractedSportId, extractedMarketId);
//     } else if (!extractedEventId || !extractedSportId) {
//       // Agar IDs missing hain toh error dikhao
//       if (extractedEventId === "" || extractedSportId === "") {
//         toast.error("Missing event or sport ID in URL");
//       }
//       setLoading(false);
//     }
//   }, [location.pathname]);

//   const fetchMarketOdds = async (evId, spId, mId) => {
//     try {
//       setLoading(true);
//       console.log("🔄 Fetching data with:", { evId, spId, mId });

//       let basicData = [];
//       let marketName = "";
//       let matchStartTime = "";

//       // ✅ 1️⃣ Basic API – team names (fallback)
//       if (evId && spId) {
//         try {
//           console.log("📡 Calling importMarketGet with:", { sport_id: spId, event_id: evId });
//           const basicResponse = await importMarketGet(spId, evId);
//           console.log("📦 Basic API Response:", basicResponse);

//           let responseData = null;
//           if (basicResponse.data?.status_code === 1) {
//             responseData = basicResponse.data.data || [];
//           } else if (basicResponse.data?.success === true) {
//             responseData = basicResponse.data.data || [];
//           } else if (basicResponse.data?.data && Array.isArray(basicResponse.data.data)) {
//             responseData = basicResponse.data.data;
//           } else if (Array.isArray(basicResponse.data)) {
//             responseData = basicResponse.data;
//           }

//           if (responseData && responseData.length > 0) {
//             basicData = responseData;
//             const firstItem = basicData[0] || {};
//             marketName = firstItem.market_name || navigationPayload.venue || "Race";
//             matchStartTime = firstItem.match_start_time || "";
//             console.log("✅ Basic data loaded:", basicData.length, "runners");
//           } else {
//             console.warn("⚠️ No data in basic API response");
//           }
//         } catch (error) {
//           console.error("❌ Basic API error:", error);
//         }
//       }

//       // ✅ 2️⃣ Odds API – exactly like Cricket component
//       let oddsRunners = [];
//       if (mId && mId !== "null" && mId !== "undefined" && mId !== "") {
//         try {
//           const token = localStorage.getItem("accessToken");
//           console.log("📡 Calling odds API with marketId:", mId);

//           const oddsResponse = await axios.get(
//             `https://cricketapinew.shyammatka.co.in/horseracing-grayhond-odds?marketid=${mId}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ).catch((err) => {
//             console.error("❌ Odds API error:", err.message);
//             return { data: [] };
//           });

//           console.log("🎯 Odds API Response:", oddsResponse.data);

//           if (oddsResponse.data && Array.isArray(oddsResponse.data) && oddsResponse.data.length > 0) {
//             const market = oddsResponse.data[0];
//             if (market.runners && Array.isArray(market.runners)) {
//               oddsRunners = market.runners.map((runner) => ({
//                 name: runner.runnerName || "Unknown",
//                 back: runner.ex?.availableToBack?.[0]?.price || "-",
//                 lay: runner.ex?.availableToLay?.[0]?.price || "-",
//                 selectionId: runner.selectionId,
//               }));
//               console.log("✅ Odds data loaded:", oddsRunners.length, "runners");
//             } else {
//               console.warn("⚠️ No runners in odds response");
//             }
//           } else {
//             console.warn("⚠️ Odds API returned empty or invalid data");
//           }
//         } catch (oddsError) {
//           console.error("❌ Odds API error:", oddsError.message);
//         }
//       } else {
//         console.warn("⚠️ No marketId available, skipping odds API. mId:", mId);
//       }

//       // ✅ 3️⃣ Final runners list – prefer odds, else basic
//       let finalRunners = [];
//       if (oddsRunners.length > 0) {
//         finalRunners = oddsRunners;
//         console.log("✅ Using odds runners");
//       } else if (basicData.length > 0) {
//         finalRunners = basicData.map((item) => ({
//           name: item.team_name || "Unknown",
//           back: "-",
//           lay: "-",
//           team_id: item.team_id,
//           market_id: item.market_id,
//         }));
//         console.log("✅ Using basic runners (no odds)");
//       } else {
//         finalRunners = [{ name: "No runners available", back: "-", lay: "-" }];
//         console.warn("⚠️ No data from any source");
//       }

//       setRunners(finalRunners);

//       // ✅ 4️⃣ Race info
//       setRaceInfo({
//         event_name: navigationPayload.venue || marketName || "Race",
//         date: matchStartTime
//           ? new Date(matchStartTime).toLocaleDateString("en-US", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })
//           : navigationPayload.date || "",
//         time: navigationPayload.race_time || "",
//         in_play: false,
//         race_name: marketName || "Race",
//       });

//       setUserBets([]);

//       if (finalRunners.length === 0 || finalRunners[0].name === "No runners available") {
//         toast.warning("No runners found for this race");
//       }

//     } catch (error) {
//       console.error("💥 Fatal error in fetchMarketOdds:", error);
//       toast.error("Failed to load market data");
//       setRunners([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="card-body text-center">
//         <Loader />
//       </div>
//     );
//   }

//   if (!runners.length && !loading) {
//     return (
//       <div className="card">
//         <div className="card-body text-center py-5">
//           <h5 className="text-muted">No runners found for this race</h5>
//           <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />

//       <div className="card event_detail">
//         <div className="card-body">
//           <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
//             <h4 className="card-title mb-0">
//               {raceInfo.event_name} {raceInfo.date}
//               {raceInfo.in_play && (
//                 <span className="badge bg-danger ms-2">In Play</span>
//               )}
//             </h4>
//             <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
//               Back
//             </button>
//           </div>

//           <Row className="mt-2">
//             <Col md={6}>
//               <div className="table-responsive">
//                 <table className="table bet_table">
//                   <thead className="table-dark">
//                     <tr>
//                       <th className="fw-bold" style={{ width: "60%" }}>
//                         {raceInfo.race_name || "Runners"}
//                       </th>
//                       <th className="text-center" style={{ width: "20%" }}>
//                         BACK
//                       </th>
//                       <th className="text-center" style={{ width: "20%" }}>
//                         LAY
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {runners.length > 0 ? (
//                       runners.map((runner, idx) => (
//                         <tr key={idx}>
//                           <td>
//                             <strong>{runner.name}</strong>
//                           </td>
//                           <td className="text-center back_bet">{runner.back}</td>
//                           <td className="text-center lay_bet">{runner.lay}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="3" className="text-center">
//                           No runners available
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </Col>

//             <Col md={6}>
//               <div className="table-responsive">
//                 <table className="table table-bordered table-hover table-striped">
//                   <thead className="table-dark">
//                     <tr>
//                       <th>User Name</th>
//                       <th>Selection</th>
//                       <th>Rate</th>
//                       <th>User Stake</th>
//                       <th>Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {userBets && userBets.length > 0 ? (
//                       userBets.map((bet, idx) => (
//                         <tr key={idx}>
//                           <td>{bet.user || "-"}</td>
//                           <td>{bet.selection || "-"}</td>
//                           <td>{bet.rate || "-"}</td>
//                           <td>{bet.stake || "-"}</td>
//                           <td>{bet.time || "-"}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="text-center">
//                           <h6 className="py-5">No Data Found</h6>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </Col>
//           </Row>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HorseRacingDetails;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Common/Loader";
import { importMarketGet } from "../../Server/api";
import { Col, Row } from "react-bootstrap";
import axios from "axios";

const HorseRacingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationPayload = location.state?.payload || {};

  const [loading, setLoading] = useState(true);
  const [runners, setRunners] = useState([]);
  const [raceInfo, setRaceInfo] = useState({});
  const [userBets, setUserBets] = useState([]);
  const [eventId, setEventId] = useState("");
  const [sportId, setSportId] = useState("");
  const [marketId, setMarketId] = useState("");
  const [apiCalled, setApiCalled] = useState(false);

  // ✅ Extract IDs from URL
  useEffect(() => {
    const pathParts = location.pathname.split("/");

    const eventIndex = pathParts.indexOf("event_id");
    const extractedEventId =
      eventIndex !== -1 && pathParts[eventIndex + 1]
        ? pathParts[eventIndex + 1]
        : "";
    setEventId(extractedEventId);

    const sportIndex = pathParts.indexOf("sportId");
    const extractedSportId =
      sportIndex !== -1 && pathParts[sportIndex + 1]
        ? pathParts[sportIndex + 1]
        : "";
    setSportId(extractedSportId);

    let marketIdx = pathParts.indexOf("market_id");
    if (marketIdx === -1) marketIdx = pathParts.indexOf("series_idd");
    const extractedMarketId =
      marketIdx !== -1 && pathParts[marketIdx + 1]
        ? pathParts[marketIdx + 1]
        : "";
    setMarketId(extractedMarketId);

    console.log("🔍 Extracted IDs:", {
      eventId: extractedEventId,
      sportId: extractedSportId,
      marketId: extractedMarketId,
    });

    if (extractedEventId && extractedSportId && !apiCalled) {
      setApiCalled(true);
      fetchMarketOdds(extractedEventId, extractedSportId, extractedMarketId);
    } else if (!extractedEventId || !extractedSportId) {
      toast.error("Missing event or sport ID");
      setLoading(false);
    }
  }, [location.pathname]);

  const fetchMarketOdds = async (evId, spId, mId) => {
    try {
      setLoading(true);
      console.log("🔄 Fetching data with:", { evId, spId, mId });

      let basicData = [];
      let marketName = "";
      let matchStartTime = "";

      // ✅ 1️⃣ Basic API – team names (fallback)
      if (evId && spId) {
        try {
          const basicResponse = await importMarketGet(spId, evId);
          console.log("📦 Basic API Response:", basicResponse);

          let responseData = null;
          if (basicResponse.data?.status_code === 1) {
            responseData = basicResponse.data.data || [];
          } else if (basicResponse.data?.success === true) {
            responseData = basicResponse.data.data || [];
          } else if (
            basicResponse.data?.data &&
            Array.isArray(basicResponse.data.data)
          ) {
            responseData = basicResponse.data.data;
          } else if (Array.isArray(basicResponse.data)) {
            responseData = basicResponse.data;
          }

          if (responseData && responseData.length > 0) {
            basicData = responseData;
            const firstItem = basicData[0] || {};
            marketName =
              firstItem.market_name || navigationPayload.venue || "Race";
            matchStartTime = firstItem.match_start_time || "";
            console.log("✅ Basic data loaded:", basicData.length, "runners");
          }
        } catch (error) {
          console.error("❌ Basic API error:", error);
        }
      }

      // ✅ 2️⃣ Odds API
      let oddsRunners = [];
      if (mId && mId !== "null" && mId !== "undefined" && mId !== "") {
        try {
          const token = localStorage.getItem("accessToken");
          console.log("📡 Calling odds API with marketId:", mId);

          const oddsResponse = await axios
            .get(
              `https://cricketapinew.shyammatka.co.in/horseracing-grayhond-odds?marketid=${mId}`,
              { headers: { Authorization: `Bearer ${token}` } },
            )
            .catch((err) => {
              console.error("❌ Odds API error:", err.message);
              return { data: [] };
            });

          console.log("🎯 Odds API Response:", oddsResponse.data);

          if (
            oddsResponse.data &&
            Array.isArray(oddsResponse.data) &&
            oddsResponse.data.length > 0
          ) {
            const market = oddsResponse.data[0];
            if (market.runners && Array.isArray(market.runners)) {
              // ✅ Extract odds runners with original names
              oddsRunners = market.runners.map((runner, index) => ({
                name: runner.runnerName || "Unknown",
                back: runner.ex?.availableToBack?.[0]?.price || "-",
                lay: runner.ex?.availableToLay?.[0]?.price || "-",
                selectionId: runner.selectionId,
                originalIndex: index,
              }));
              console.log(
                "✅ Odds data loaded:",
                oddsRunners.length,
                "runners",
              );
            }
          }
        } catch (oddsError) {
          console.error("❌ Odds API error:", oddsError.message);
        }
      } else {
        console.warn("⚠️ No marketId available, skipping odds API");
      }

      // ✅ 3️⃣ MERGE: Match odds runners with basic data names
      let finalRunners = [];

      if (oddsRunners.length > 0 && basicData.length > 0) {
        // ✅ Match by index (sort_priority - 1) – basic data sorted by sort_priority
        const sortedBasicData = [...basicData].sort(
          (a, b) => (a.sort_priority || 0) - (b.sort_priority || 0),
        );

        finalRunners = oddsRunners.map((oddRunner, idx) => {
          // Try to find matching basic data by index
          let matchedName = oddRunner.name;

          // If odds runner has "Unknown" name, try to get from basic data
          if (oddRunner.name === "Unknown" || oddRunner.name === "unknown") {
            if (idx < sortedBasicData.length) {
              matchedName =
                sortedBasicData[idx].team_name || `Runner ${idx + 1}`;
            }
          }

          return {
            name: matchedName,
            back: oddRunner.back,
            lay: oddRunner.lay,
            selectionId: oddRunner.selectionId,
          };
        });

        console.log("✅ Merged runners with names");
      }
      // ✅ If only odds runners exist (no basic data)
      else if (oddsRunners.length > 0) {
        finalRunners = oddsRunners.map((runner, idx) => ({
          name: runner.name !== "Unknown" ? runner.name : `Runner ${idx + 1}`,
          back: runner.back,
          lay: runner.lay,
        }));
        console.log("✅ Using odds runners (no basic data)");
      }
      // ✅ If only basic data exists (no odds)
      else if (basicData.length > 0) {
        finalRunners = basicData.map((item) => ({
          name: item.team_name || "Unknown",
          back: "-",
          lay: "-",
          team_id: item.team_id,
          market_id: item.market_id,
        }));
        console.log("✅ Using basic runners (no odds)");
      }
      // ✅ No data at all
      else {
        finalRunners = [{ name: "No runners available", back: "-", lay: "-" }];
        console.warn("⚠️ No data from any source");
      }

      setRunners(finalRunners);

      // ✅ 4️⃣ Race info
      setRaceInfo({
        event_name: navigationPayload.venue || marketName || "Race",
        date: matchStartTime
          ? new Date(matchStartTime).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : navigationPayload.date || "",
        time: navigationPayload.race_time || "",
        in_play: false,
        race_name: marketName || "Race",
      });

      setUserBets([]);

      if (
        finalRunners.length === 0 ||
        finalRunners[0].name === "No runners available"
      ) {
        toast.warning("No runners found for this race");
      }
    } catch (error) {
      console.error("💥 Fatal error in fetchMarketOdds:", error);
      toast.error("Failed to load market data");
      setRunners([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);

    const day = d.getDate();
    const month = d.toLocaleString("en-GB", { month: "short" });

    const suffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${suffix(day)} ${month}`;
  };

  if (loading) {
    return (
      <div className="card-body text-center">
        <Loader />
      </div>
    );
  }

  if (!runners.length && !loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">No runners found for this race</h5>
          <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card event_detail">
        <div className="card-body">
          <div className="card-header bgHeader py-1 bg-primary-yellow d-flex justify-content-between align-items-center">
            <h4 className="card-title event_title mb-0">
              {raceInfo.event_name} {formatDisplayDate(raceInfo.date)}
              {raceInfo.in_play && (
                <span className="badge bg-success ms-2">In Play</span>
              )}
            </h4>
            <button className="btn btn-light" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>

          <Row className="mt-2">
            <Col md={6}>
              <div className="table-responsive">
                <table className="table bet_table">
                  <thead className="table-dark">
                    <tr>
                      <th className="fw-bold" style={{ width: "60%" }}>
                        {raceInfo.race_name || "Runners"}
                      </th>
                      <th className="text-center" style={{ width: "20%" }}>
                        BACK
                      </th>
                      <th className="text-center" style={{ width: "20%" }}>
                        LAY
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {runners.length > 0 ? (
                      runners.map((runner, idx) => (
                        <tr key={idx}>
                          <td>
                           {runner.name}
                          </td>
                          <td className="text-center back_bet">
                            {runner.back}
                          </td>
                          <td className="text-center lay_bet">{runner.lay}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No runners available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Col>

            <Col md={6}>
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>User Name</th>
                      <th>Selection</th>
                      <th>Rate</th>
                      <th>User Stake</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBets && userBets.length > 0 ? (
                      userBets.map((bet, idx) => (
                        <tr key={idx}>
                          <td>{bet.user || "-"}</td>
                          <td>{bet.selection || "-"}</td>
                          <td>{bet.rate || "-"}</td>
                          <td>{bet.stake || "-"}</td>
                          <td>{bet.time || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <h6 className="py-5">No Data Found</h6>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default HorseRacingDetails;
