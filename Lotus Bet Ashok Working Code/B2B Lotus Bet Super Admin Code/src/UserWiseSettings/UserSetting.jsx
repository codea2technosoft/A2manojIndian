// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Swal from "sweetalert2";
// import Loader from "../Common/Loader";
// import {
//   getUserUmltipleMarketSetting,
//   updateUserOnlyMeMarketSetting,
//   updateMeDownlineSettingValues,
// } from "../Server/api";

// function UserSetting() {
//   const navigate = useNavigate();
//   const { adminId } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [activeSport, setActiveSport] = useState("Football");
//   const [sportsData, setSportsData] = useState([]);
//   const [settings, setSettings] = useState({});
//   const [submittingMarket, setSubmittingMarket] = useState(null);

//   // ✅ Sports sequence - Casino removed from here
//   const sportOrder = [
//     "Football",
//     "Cricket",
//     "Tennis",
//     "Horse Racing",
//     "Greyhound Racing",
//     "Kabaddi",
//     "Politics",
//     // "Casino", // Commented out - Casino hidden from UI
//   ];

//   useEffect(() => {
//     if (adminId) {
//       fetchUserSettings();
//     }
//   }, [adminId]);

//   const fetchUserSettings = async () => {
//     try {
//       setLoading(true);
//       const payload = { admin_id: adminId };
//       const response = await getUserUmltipleMarketSetting(payload);
//       console.log("User Settings Response:", response);

//       if (response.data && response.data.success) {
//         const data = response.data.data || [];
//         setSportsData(data);

//         const settingsObj = {};
//         data.forEach((sport) => {
//           const sportName = sport.sport;
//           settingsObj[sportName] = {};

//           sport.markets.forEach((market) => {
//             const marketName = market.market_name;
//             settingsObj[sportName][marketName] = {
//               minBet: market.min_bet || 0,
//               maxBet: market.max_bet || 0,
//               maxProfit: market.max_profit || 0,
//               maxMarketProfit: market.max_market_profit || 0,
//               maxLiability: market.max_liability || 0,
//               maxMarketLiability: market.max_market_liability || 0,
//               betDelay: market.bet_delay || 0,
//               commissionIn: market.commission_in || 0,
//               commissionOut: market.commission_out || 0,
//               market_id: market.market_id,
//               status: market.status || 1,
//             };
//           });
//         });

//         setSettings(settingsObj);

//         const firstSport = sportOrder.find((sport) => settingsObj[sport]);

//         if (firstSport) {
//           setActiveSport(firstSport);
//         }
//       } else {
//         toast.error(response.data?.message || "Failed to load settings");
//       }
//     } catch (error) {
//       console.error("Error fetching user settings:", error);
//       toast.error("Failed to load user settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCurrentSportSettings = () => {
//     return settings[activeSport] || {};
//   };

//   const getCurrentMarketSettings = (marketName) => {
//     const sportSettings = getCurrentSportSettings();
//     return sportSettings[marketName] || {};
//   };

//   const handleChange = (marketName, field, value) => {
//     setSettings({
//       ...settings,
//       [activeSport]: {
//         ...settings[activeSport],
//         [marketName]: {
//           ...settings[activeSport][marketName],
//           [field]: value,
//         },
//       },
//     });
//   };

//   const preparePayload = (marketName) => {
//     const marketSettings = getCurrentMarketSettings(marketName);

//     return {
//       admin_id: adminId,
//       role: localStorage.getItem("role") || "3",
//       market_id: marketSettings.market_id || marketName,
//       min_bet: parseFloat(marketSettings.minBet) || 0,
//       max_bet: parseFloat(marketSettings.maxBet) || 0,
//       max_profit: parseFloat(marketSettings.maxProfit) || 0,
//       max_market_profit: parseFloat(marketSettings.maxMarketProfit) || 0,
//       max_liability: parseFloat(marketSettings.maxLiability) || 0,
//       max_market_liability: parseFloat(marketSettings.maxMarketLiability) || 0,
//       bet_delay: parseFloat(marketSettings.betDelay) || 0,
//       commission_in: parseFloat(marketSettings.commissionIn) || 0,
//       commission_out: parseFloat(marketSettings.commissionOut) || 0,
//     };
//   };

//   const handleUpdateOnlyMe = async (marketName) => {
//     try {
//       setSubmittingMarket(marketName);
//       const payload = preparePayload(marketName);

//       const response = await updateUserOnlyMeMarketSetting(payload);
//       console.log("Update Only Me Response:", response);

//       const responseData = response.data || response;

//       if (responseData.success) {
//         setSettings((prevSettings) => ({
//           ...prevSettings,
//           [activeSport]: {
//             ...prevSettings[activeSport],
//             [marketName]: {
//               ...prevSettings[activeSport][marketName],
//               minBet: payload.min_bet,
//               maxBet: payload.max_bet,
//               maxProfit: payload.max_profit,
//               maxMarketProfit: payload.max_market_profit,
//               maxLiability: payload.max_liability,
//               maxMarketLiability: payload.max_market_liability,
//               betDelay: payload.bet_delay,
//               commissionIn: payload.commission_in,
//               commissionOut: payload.commission_out,
//             },
//           },
//         }));

//         await Swal.fire({
//           icon: "success",
//           title: "Success!",
//           text: responseData.message || "Settings updated successfully",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//       } else {
//         await Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text: responseData.message || "Failed to update settings",
//           confirmButtonColor: "#d33",
//         });
//       }
//     } catch (error) {
//       console.error("Error updating settings:", error);
//       await Swal.fire({
//         icon: "error",
//         title: "Error!",
//         text:
//           error.response?.data?.message ||
//           error.message ||
//           "Error updating settings",
//         confirmButtonColor: "#d33",
//       });
//     } finally {
//       setSubmittingMarket(null);
//     }
//   };

//   const handleUpdateMeAndDownline = async (marketName) => {
//     try {
//       setSubmittingMarket(marketName);
//       const payload = preparePayload(marketName);

//       const response = await updateMeDownlineSettingValues(payload);
//       console.log("Update Me And Downline Response:", response);

//       const responseData = response.data || response;

//       if (responseData.success) {
//         setSettings((prevSettings) => ({
//           ...prevSettings,
//           [activeSport]: {
//             ...prevSettings[activeSport],
//             [marketName]: {
//               ...prevSettings[activeSport][marketName],
//               minBet: payload.min_bet,
//               maxBet: payload.max_bet,
//               maxProfit: payload.max_profit,
//               maxMarketProfit: payload.max_market_profit,
//               maxLiability: payload.max_liability,
//               maxMarketLiability: payload.max_market_liability,
//               betDelay: payload.bet_delay,
//               commissionIn: payload.commission_in,
//               commissionOut: payload.commission_out,
//             },
//           },
//         }));

//         await Swal.fire({
//           icon: "success",
//           title: "Success!",
//           text:
//             responseData.message ||
//             "Settings updated successfully for Me & Downline",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//       } else {
//         await Swal.fire({
//           icon: "error",
//           title: "Error!",
//           text: responseData.message || "Failed to update settings",
//           confirmButtonColor: "#d33",
//         });
//       }
//     } catch (error) {
//       console.error("Error updating settings:", error);
//       await Swal.fire({
//         icon: "error",
//         title: "Error!",
//         text:
//           error.response?.data?.message ||
//           error.message ||
//           "Error updating settings",
//         confirmButtonColor: "#d33",
//       });
//     } finally {
//       setSubmittingMarket(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="card">
//         <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
//           <h3 className="card-title mb-0">User Setting</h3>
//           <div className="d-flex gap-2">
//             <button className="btn btn-light" onClick={() => navigate(-1)}>
//               Back
//             </button>
//           </div>
//         </div>
//         <div className="card-body text-center">
//           <Loader />
//         </div>
//       </div>
//     );
//   }

//   if (Object.keys(settings).length === 0 || sportsData.length === 0) {
//     return (
//       <div className="card">
//         <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
//           <h3 className="card-title mb-0">User Setting</h3>
//           <div className="d-flex gap-2">
//             <button
//               className="btn btn-outline-light"
//               onClick={() => navigate(-1)}
//             >
//               Back
//             </button>
//           </div>
//         </div>
//         <div className="card-body text-center py-5">
//           <h5 className="text-muted">No settings found for this user</h5>
//           <button className="btn btn-primary mt-3" onClick={fetchUserSettings}>
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentSportMarkets = getCurrentSportSettings();
//   const marketNames = Object.keys(currentSportMarkets);

//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={500}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />

//       <div className="card">
//         <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
//           <h3 className="card-title mb-0">User Setting</h3>
//           <div className="d-flex gap-2">
//             <button className="btn btn-light" onClick={() => navigate(-1)}>
//               Back
//             </button>
//           </div>
//         </div>
//         <div className="card-body">
//           <div className="setting_btns d-flex flex-nowrap overflow-auto gap-2 mb-3">
//             {sportOrder.map((sport) => {
//               if (settings[sport]) {
//                 return (
//                   <button
//                     key={sport}
//                     className={`btn ${activeSport === sport ? "active btn-warning" : "btn-light"}`}
//                     onClick={() => setActiveSport(sport)}
//                   >
//                     {sport}
//                   </button>
//                 );
//               }
//               return null;
//             })}
//           </div>

//           {loading ? (
//             <div className="text-center">
//               <Loader />
//             </div>
//           ) : marketNames.length > 0 ? (
//             marketNames.map((marketName, index) => {
//               const market = currentSportMarkets[marketName];
//               const isThisMarketSubmitting = submittingMarket === marketName;

//               return (
//                 <div
//                   key={marketName}
//                   className={`user_setting ${
//                     index !== marketNames.length - 1
//                       ? "border-bottom pb-3 mb-3"
//                       : ""
//                   }`}
//                 >
//                   <h5 className="market_name fw-bold mb-3">
//                     {marketName.replace(/_/g, " ")}
//                   </h5>
//                   <div className="row">
//                     <div className="col-md-4 mb-3">
//                       <label>Min Bet</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={market.minBet || ""}
//                         onChange={(e) =>
//                           handleChange(marketName, "minBet", e.target.value)
//                         }
//                         placeholder="Enter min bet"
//                       />
//                     </div>

//                     <div className="col-md-4 mb-3">
//                       <label>Max Bet</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={market.maxBet || ""}
//                         onChange={(e) =>
//                           handleChange(marketName, "maxBet", e.target.value)
//                         }
//                         placeholder="Enter max bet"
//                       />
//                     </div>

//                     <div className="col-md-4 mb-3">
//                       <label>Max Profit</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={market.maxProfit || ""}
//                         onChange={(e) =>
//                           handleChange(marketName, "maxProfit", e.target.value)
//                         }
//                         placeholder="Enter max profit"
//                       />
//                     </div>

//                     <div className="col-md-4 mb-3">
//                       <label>Max Market Profit</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={market.maxMarketProfit || ""}
//                         onChange={(e) =>
//                           handleChange(
//                             marketName,
//                             "maxMarketProfit",
//                             e.target.value,
//                           )
//                         }
//                         placeholder="Enter max market profit"
//                       />
//                     </div>

//                     <div className="col-md-4 mb-3">
//                       <label>Max Liability</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={market.maxLiability || ""}
//                         onChange={(e) =>
//                           handleChange(
//                             marketName,
//                             "maxLiability",
//                             e.target.value,
//                           )
//                         }
//                         placeholder="Enter max liability"
//                       />
//                     </div>

//                     <div className="col-md-4 mb-3">
//                       <label>Max Market Liability</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={market.maxMarketLiability || ""}
//                         onChange={(e) =>
//                           handleChange(
//                             marketName,
//                             "maxMarketLiability",
//                             e.target.value,
//                           )
//                         }
//                         placeholder="Enter max market liability"
//                       />
//                     </div>

//                     <div className="col-md-4 mb-3">
//                       <label>Bet Delay</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={market.betDelay || ""}
//                         onChange={(e) =>
//                           handleChange(marketName, "betDelay", e.target.value)
//                         }
//                         placeholder="Enter bet delay"
//                       />
//                     </div>

//                     <div className="col-md-4 mb-3">
//                       <label>Commission In</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={market.commissionIn || ""}
//                         onChange={(e) =>
//                           handleChange(
//                             marketName,
//                             "commissionIn",
//                             e.target.value,
//                           )
//                         }
//                         placeholder="Enter commission in"
//                       />
//                     </div>

//                     <div className="col-md-4 mb-3">
//                       <label>Commission Out</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={market.commissionOut || ""}
//                         onChange={(e) =>
//                           handleChange(
//                             marketName,
//                             "commissionOut",
//                             e.target.value,
//                           )
//                         }
//                         placeholder="Enter commission out"
//                       />
//                     </div>

//                     <div className="col-md-12">
//                       <div className="d-flex gap-2 mt-2">
//                         <button
//                           className="btn btn-primary text-dark"
//                           onClick={() => handleUpdateMeAndDownline(marketName)}
//                           disabled={isThisMarketSubmitting}
//                         >
//                           {isThisMarketSubmitting ? (
//                             <>
//                               <span
//                                 className="spinner-border spinner-border-sm me-2"
//                                 role="status"
//                               >
//                                 <span className="visually-hidden">
//                                   Loading...
//                                 </span>
//                               </span>
//                               Updating...
//                             </>
//                           ) : (
//                             "Update Me And Down-line"
//                           )}
//                         </button>

//                         <button
//                           className="btn btn-primary text-dark"
//                           onClick={() => handleUpdateOnlyMe(marketName)}
//                           disabled={isThisMarketSubmitting}
//                         >
//                           {isThisMarketSubmitting ? (
//                             <>
//                               <span
//                                 className="spinner-border spinner-border-sm me-2"
//                                 role="status"
//                               >
//                                 <span className="visually-hidden">
//                                   Loading...
//                                 </span>
//                               </span>
//                               Updating...
//                             </>
//                           ) : (
//                             "Update Only Me"
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="text-center py-3">
//               <p className="text-muted">No markets found for this sport</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default UserSetting;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Loader from "../Common/Loader";
import {
  getUserUmltipleMarketSetting,
  updateUserOnlyMeMarketSetting,
  updateMeDownlineSettingValues,
} from "../Server/api";

function UserSetting() {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSport, setActiveSport] = useState("Football");
  const [sportsData, setSportsData] = useState([]);
  const [settings, setSettings] = useState({});
  const [submittingOnlyMe, setSubmittingOnlyMe] = useState(null);
  const [submittingMeDownline, setSubmittingMeDownline] = useState(null);

  const sportOrder = [
    "Football",
    "Cricket",
    "Tennis",
    "Horse Racing",
    "Greyhound Racing",
    "Kabaddi",
    "Politics",
  ];

  useEffect(() => {
    if (adminId) {
      fetchUserSettings();
    }
  }, [adminId]);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      const payload = { admin_id: adminId };
      const response = await getUserUmltipleMarketSetting(payload);
      console.log("User Settings Response:", response);

      if (response.data && response.data.success) {
        const data = response.data.data || [];
        setSportsData(data);

        const settingsObj = {};
        data.forEach((sport) => {
          const sportName = sport.sport;
          settingsObj[sportName] = {
            sport_id: sport.sport_id,
            markets: {}
          };

          sport.markets.forEach((market) => {
            const marketName = market.market_name;
            settingsObj[sportName].markets[marketName] = {
              minBet: market.min_bet || 0,
              maxBet: market.max_bet || 0,
              maxProfit: market.max_profit || 0,
              maxMarketProfit: market.max_market_profit || 0,
              maxLiability: market.max_liability || 0,
              maxMarketLiability: market.max_market_liability || 0,
              betDelay: market.bet_delay || 0,
              commissionIn: market.commission_in || 0,
              commissionOut: market.commission_out || 0,
              market_id: market.market_id,
              status: market.status || 1,
            };
          });
        });

        setSettings(settingsObj);

        const firstSport = sportOrder.find((sport) => settingsObj[sport]);
        if (firstSport) {
          setActiveSport(firstSport);
        }
      } else {
        toast.error(response.data?.message || "Failed to load settings");
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
      toast.error("Failed to load user settings");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSportSettings = () => {
    return settings[activeSport] || { sport_id: null, markets: {} };
  };

  const getCurrentMarketSettings = (marketName) => {
    const sportSettings = getCurrentSportSettings();
    return sportSettings.markets?.[marketName] || {};
  };

  const handleChange = (marketName, field, value) => {
    setSettings({
      ...settings,
      [activeSport]: {
        ...settings[activeSport],
        markets: {
          ...settings[activeSport]?.markets,
          [marketName]: {
            ...settings[activeSport]?.markets?.[marketName],
            [field]: value,
          },
        },
      },
    });
  };

  const preparePayload = (marketName) => {
    const marketSettings = getCurrentMarketSettings(marketName);
    const sportSettings = getCurrentSportSettings();

    return {
      admin_id: adminId,
      role: localStorage.getItem("role") || "3",
      market_id: marketSettings.market_id || marketName,
      sport_id: sportSettings.sport_id,
      min_bet: parseFloat(marketSettings.minBet) || 0,
      max_bet: parseFloat(marketSettings.maxBet) || 0,
      max_profit: parseFloat(marketSettings.maxProfit) || 0,
      max_market_profit: parseFloat(marketSettings.maxMarketProfit) || 0,
      max_liability: parseFloat(marketSettings.maxLiability) || 0,
      max_market_liability: parseFloat(marketSettings.maxMarketLiability) || 0,
      bet_delay: parseFloat(marketSettings.betDelay) || 0,
      commission_in: parseFloat(marketSettings.commissionIn) || 0,
      commission_out: parseFloat(marketSettings.commissionOut) || 0,
    };
  };

  const handleUpdateOnlyMe = async (marketName) => {
    try {
      setSubmittingOnlyMe(marketName);
      const payload = preparePayload(marketName);

      const response = await updateUserOnlyMeMarketSetting(payload);
      console.log("Update Only Me Response:", response);

      const responseData = response.data || response;

      if (responseData.success) {
        setSettings((prevSettings) => ({
          ...prevSettings,
          [activeSport]: {
            ...prevSettings[activeSport],
            markets: {
              ...prevSettings[activeSport]?.markets,
              [marketName]: {
                ...prevSettings[activeSport]?.markets?.[marketName],
                minBet: payload.min_bet,
                maxBet: payload.max_bet,
                maxProfit: payload.max_profit,
                maxMarketProfit: payload.max_market_profit,
                maxLiability: payload.max_liability,
                maxMarketLiability: payload.max_market_liability,
                betDelay: payload.bet_delay,
                commissionIn: payload.commission_in,
                commissionOut: payload.commission_out,
              },
            },
          },
        }));

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: responseData.message || "Settings updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: responseData.message || "Failed to update settings",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message ||
          error.message ||
          "Error updating settings",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmittingOnlyMe(null);
    }
  };

  const handleUpdateMeAndDownline = async (marketName) => {
    try {
      setSubmittingMeDownline(marketName);
      const payload = preparePayload(marketName);

      const response = await updateMeDownlineSettingValues(payload);
      console.log("Update Me And Downline Response:", response);

      const responseData = response.data || response;

      if (responseData.success) {
        setSettings((prevSettings) => ({
          ...prevSettings,
          [activeSport]: {
            ...prevSettings[activeSport],
            markets: {
              ...prevSettings[activeSport]?.markets,
              [marketName]: {
                ...prevSettings[activeSport]?.markets?.[marketName],
                minBet: payload.min_bet,
                maxBet: payload.max_bet,
                maxProfit: payload.max_profit,
                maxMarketProfit: payload.max_market_profit,
                maxLiability: payload.max_liability,
                maxMarketLiability: payload.max_market_liability,
                betDelay: payload.bet_delay,
                commissionIn: payload.commission_in,
                commissionOut: payload.commission_out,
              },
            },
          },
        }));

        await Swal.fire({
          icon: "success",
          title: "Success!",
          text:
            responseData.message ||
            "Settings updated successfully for Me & Downline",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error!",
          text: responseData.message || "Failed to update settings",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message ||
          error.message ||
          "Error updating settings",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSubmittingMeDownline(null);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">User Setting</h3>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
        <div className="card-body text-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (Object.keys(settings).length === 0 || sportsData.length === 0) {
    return (
      <div className="card">
        <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">User Setting</h3>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
        <div className="card-body text-center py-5">
          <h5 className="text-muted">No settings found for this user</h5>
          <button className="btn btn-primary mt-3" onClick={fetchUserSettings}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentSportSettings = getCurrentSportSettings();
  const marketNames = currentSportSettings.markets ? Object.keys(currentSportSettings.markets) : [];

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="card">
        <div className="card-header bgHeader bg-primary-yellow d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">User Setting</h3>
          <div className="d-flex gap-2">
            <button className="btn btn-light" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="setting_btns d-flex flex-nowrap overflow-auto gap-2 mb-3">
            {sportOrder.map((sport) => {
              if (settings[sport]) {
                return (
                  <button
                    key={sport}
                    className={`btn ${activeSport === sport ? "active btn-warning" : "btn-light"}`}
                    onClick={() => setActiveSport(sport)}
                  >
                    {sport}
                  </button>
                );
              }
              return null;
            })}
          </div>

          {loading ? (
            <div className="text-center">
              <Loader />
            </div>
          ) : marketNames.length > 0 ? (
            marketNames.map((marketName, index) => {
              const market = currentSportSettings.markets[marketName];
              const isOnlyMeSubmitting = submittingOnlyMe === marketName;
              const isMeDownlineSubmitting = submittingMeDownline === marketName;

              return (
                <div
                  key={marketName}
                  className={`user_setting ${
                    index !== marketNames.length - 1
                      ? "border-bottom pb-3 mb-3"
                      : ""
                  }`}
                >
                  <h5 className="market_name fw-bold mb-3">
                    {marketName.replace(/_/g, " ")}
                  </h5>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label>Min Bet</label>
                      <input
                        type="number"
                        className="form-control"
                        value={market.minBet || ""}
                        onChange={(e) =>
                          handleChange(marketName, "minBet", e.target.value)
                        }
                        placeholder="Enter min bet"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label>Max Bet</label>
                      <input
                        type="number"
                        className="form-control"
                        value={market.maxBet || ""}
                        onChange={(e) =>
                          handleChange(marketName, "maxBet", e.target.value)
                        }
                        placeholder="Enter max bet"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label>Max Profit</label>
                      <input
                        type="number"
                        className="form-control"
                        value={market.maxProfit || ""}
                        onChange={(e) =>
                          handleChange(marketName, "maxProfit", e.target.value)
                        }
                        placeholder="Enter max profit"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label>Max Market Profit</label>
                      <input
                        type="number"
                        className="form-control"
                        value={market.maxMarketProfit || ""}
                        onChange={(e) =>
                          handleChange(
                            marketName,
                            "maxMarketProfit",
                            e.target.value,
                          )
                        }
                        placeholder="Enter max market profit"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label>Max Liability</label>
                      <input
                        type="number"
                        className="form-control"
                        value={market.maxLiability || ""}
                        onChange={(e) =>
                          handleChange(
                            marketName,
                            "maxLiability",
                            e.target.value,
                          )
                        }
                        placeholder="Enter max liability"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label>Max Market Liability</label>
                      <input
                        type="number"
                        className="form-control"
                        value={market.maxMarketLiability || ""}
                        onChange={(e) =>
                          handleChange(
                            marketName,
                            "maxMarketLiability",
                            e.target.value,
                          )
                        }
                        placeholder="Enter max market liability"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label>Bet Delay</label>
                      <input
                        type="number"
                        className="form-control"
                        value={market.betDelay || ""}
                        onChange={(e) =>
                          handleChange(marketName, "betDelay", e.target.value)
                        }
                        placeholder="Enter bet delay"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label>Commission In</label>
                      <input
                        type="number"
                        className="form-control"
                        value={market.commissionIn || ""}
                        onChange={(e) =>
                          handleChange(
                            marketName,
                            "commissionIn",
                            e.target.value,
                          )
                        }
                        placeholder="Enter commission in"
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label>Commission Out</label>
                      <input
                        type="number"
                        className="form-control"
                        value={market.commissionOut || ""}
                        onChange={(e) =>
                          handleChange(
                            marketName,
                            "commissionOut",
                            e.target.value,
                          )
                        }
                        placeholder="Enter commission out"
                      />
                    </div>

                    <div className="col-md-12">
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-primary text-dark"
                          onClick={() => handleUpdateMeAndDownline(marketName)}
                          disabled={isMeDownlineSubmitting}
                        >
                          {isMeDownlineSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </span>
                              Updating...
                            </>
                          ) : (
                            "Update Me And Down-line"
                          )}
                        </button>

                        <button
                          className="btn btn-primary text-dark"
                          onClick={() => handleUpdateOnlyMe(marketName)}
                          disabled={isOnlyMeSubmitting}
                        >
                          {isOnlyMeSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </span>
                              Updating...
                            </>
                          ) : (
                            "Update Only Me"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-3">
              <p className="text-muted">No markets found for this sport</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserSetting;