// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loader from "../../Common/Loader";
// import { getProfitLossDetail } from "../../Server/api";

// const ProfitLossDetail = () => {
//   const { eventId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [loading, setLoading] = useState(true);
//   const [detailData, setDetailData] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [responseMeta, setResponseMeta] = useState({
//     admin_id: "",
//     role: "",
//     event_id: "",
//     level: "",
//   });

//   const navigationPayload = location.state?.payload || {};
//   console.log("Received Payload:", navigationPayload);

//   useEffect(() => {
//     fetchDetailData();
//   }, [eventId]);

//   // const fetchDetailData = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const payload = {
//   //       event_id: navigationPayload.event_id || eventId,
//   //       admin_id: navigationPayload.admin_id,
//   //       role: navigationPayload.role,
//   //     };
//   //     console.log("Sending payload:", payload);

//   //     const res = await getProfitLossDetail(payload);
//   //     const response = res.data;

//   //     // CHANGE THIS LINE - Check for status_code instead of success
//   //     if (response.status_code === 1) {
//   //       // Map the data array to match your table structure
//   //       const mappedData = response.data.map((item, index) => ({
//   //         sr_no: index + 1,
//   //         username: item.username || "N/A",
//   //         market: item.market_name || "N/A",
//   //         comm_in: item.admin_win || 0,
//   //         comm_out: item.admin_loss || 0,
//   //         amount: item.amount || 0,
//   //         total: item.total || 0,
//   //         market_id: item.market_id || "",
//   //         bet_type: item.bet_type || "",
//   //         team_name: item.team_name || "",
//   //         stake: item.stake || 0,
//   //         odd: item.odd || 0,
//   //         result_val: item.result_val || "Pending"
//   //       }));

//   //       setDetailData(mappedData);

//   //       // Calculate total from the data array
//   //       const total = mappedData.reduce((sum, item) => sum + item.total, 0);
//   //       setTotalAmount(total);

//   //       setResponseMeta({
//   //         admin_id: payload.admin_id,
//   //         role: payload.role,
//   //         event_id: payload.event_id,
//   //         level: response.level || "",
//   //       });
//   //     } else {
//   //       toast.error(response.message || "Failed to fetch detail data");
//   //     }
//   //   } catch (error) {
//   //     console.error(error);
//   //     toast.error("Failed to fetch detail data");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const fetchDetailData = async () => {
//     try {
//       setLoading(true);
//       const payload = {
//         event_id: navigationPayload.event_id || eventId,
//         admin_id: navigationPayload.admin_id,
//         role: navigationPayload.role,
//       };
//       console.log("Sending payload:", payload);

//       const res = await getProfitLossDetail(payload);
//       const response = res.data;

//       if (response.status_code === 1) {
//         const mappedData = response.data.map((item, index) => ({
//           sr_no: index + 1,
//           username: item.username || "N/A",
//           market: item.market_name || "N/A",
//           comm_in: item.admin_win || 0,
//           comm_out: item.admin_loss || 0,
//           amount: item.amount || 0,
//           total: item.total || 0,
//           market_id: item.market_id || "",
//           bet_type: item.bet_type || "",
//           team_name: item.team_name || "",
//           stake: item.stake || 0,
//           odd: item.odd || 0,
//           result_val: item.result_val || "Pending",
//           event_id: item.event_id || eventId,
//         }));

//         setDetailData(mappedData);
//         const total = mappedData.reduce((sum, item) => sum + item.total, 0);
//         setTotalAmount(total);

//         setResponseMeta({
//           admin_id: payload.admin_id,
//           role: payload.role,
//           event_id: payload.event_id,
//           level: response.level || "",
//         });
//       } else {
//         toast.error(response.message || "Failed to fetch detail data");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch detail data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatNumber = (num) => Number(num || 0).toFixed(2);

//   // const handleMarketSummaryClick = (marketId) => {
//   //   navigate(`/profit-loss-summary-market/${marketId}`);
//   // };

//   const handleMarketSummaryClick = (eventId) => {
//     const admin_id = localStorage.getItem("admin_id") || "admin";
//     const role = parseInt(localStorage.getItem("role")) || 1;
//     const payload = {
//       event_id: eventId,
//       admin_id: admin_id,
//       role: role,
//     };

//     console.log("✅ Navigating with payload:", payload);

//     navigate(`/reports/profit-loss-summary-event/${eventId}`, {
//       state: {
//         payload: payload,
//       },
//     });
//   };

//   // const handleBetHistoryClick = (marketId) => {

//   //   navigate(`/reports/profit-loss-bet-history/${marketId}`);
//   // };

//   const handleBetHistoryClick = (marketId, betType) => {
//     const admin_id = localStorage.getItem("admin_id") || "admin";
//     const role = parseInt(localStorage.getItem("role")) || 1;

//     const payload = {
//       market_id: marketId,
//       admin_id: admin_id,
//       role: role,
//       event_id: eventId,
//       bet_type: betType,
//       page: 1,
//       limit: 50,
//       search: "",
//       from_date: "",
//       to_date: "",
//     };

//     console.log("✅ Bet History Payload:", payload);

//     navigate(`/reports/profit-loss-bet-history/${marketId}`, {
//       state: {
//         payload: payload,
//       },
//     });
//   };

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />
//       <div className="card">
//         <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center gap-2">
//           <h3 className="card-title mb-0">Detail - Event ID: {eventId}</h3>
//           <button
//             className="btn btn-outline-light"
//             onClick={() => navigate(-1)}
//           >
//             Back
//           </button>
//         </div>
//         <div className="card-body">
//           <div className="table-responsive">
//             <table className="table table-striped table-bordered table-hover">
//               <thead className="table-dark">
//                 <tr>
//                   <th>NO</th>
//                   <th>USERNAME</th>
//                   <th>MARKET</th>
//                   <th>COMM IN</th>
//                   <th>COMM OUT</th>
//                   <th>AMOUNT</th>
//                   <th>TOTAL</th>
//                   <th className="text-center">ACTION</th>
//                 </tr>
//               </thead>
//               <thead className="table-secondary fw-bold">
//                 <tr>
//                   <td>#</td>
//                   <td colSpan="5">Total</td>
//                   <td>{formatNumber(totalAmount)}</td>
//                   <td></td>
//                 </tr>
//               </thead>

//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="8" className="table_loader">
//                       <div className="text-center py-5">
//                         <Loader />
//                       </div>
//                     </td>
//                   </tr>
//                 ) : detailData.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="text-center py-5">
//                       No Data Found
//                     </td>
//                   </tr>
//                 ) : (
//                   detailData.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.sr_no}</td>
//                       <td>{item.username}</td>
//                       <td>{item.market}</td>
//                       <td>{formatNumber(item.comm_in)}</td>
//                       <td>{formatNumber(item.comm_out)}</td>
//                       <td
//                         className={`fw-bold ${item.amount >= 0 ? "text-success" : "text-danger"}`}
//                       >
//                         {formatNumber(item.amount)}
//                       </td>
//                       <td>{formatNumber(item.total)}</td>
//                       <td>
//                         <div className="d-flex justify-content-start gap-1">
//                           {/* <button
//                             className="btn btn-sm btn-success"
//                             onClick={() => handleMarketSummaryClick(item.market_id)}
//                             title="View Market Summary"
//                           >
//                             S
//                           </button> */}

//                           <button
//                             className="btn gradient-4 btn-rounded"
//                             onClick={() =>
//                               handleMarketSummaryClick(item.event_id)
//                             }
//                             title="View Summary"
//                           >
//                             S
//                           </button>

//                           <button
//                             className="buttoncommon gradient-3"
//                             onClick={() =>
//                               handleBetHistoryClick(
//                                 item.market_id,
//                                 item.bet_type,
//                               )
//                             }
//                             title="View Bet History"
//                           >
//                             B
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProfitLossDetail;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Common/Loader";
import { getProfitLossDetail } from "../../Server/api";

const ProfitLossDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const eventName = location.state?.eventName || "";
  const [responseMeta, setResponseMeta] = useState({
    admin_id: "",
    role: "",
    event_id: "",
    level: "",
  });

  const navigationPayload = location.state?.payload || {};
  console.log("Received Payload:", navigationPayload);

  useEffect(() => {
    fetchDetailData();
  }, [eventId]);

  const fetchDetailData = async () => {
    try {
      setLoading(true);
      const payload = {
        event_id: navigationPayload.event_id || eventId,
        admin_id: navigationPayload.admin_id,
        role: navigationPayload.role,
      };
      console.log("Sending payload:", payload);

      const res = await getProfitLossDetail(payload);
      const response = res.data;

      if (response.status_code === 1) {
        const mappedData = response.data.map((item, index) => ({
          sr_no: index + 1,
          username: item.username || "N/A",
          market: item.market_name || "N/A",
          comm_in: item.admin_win || 0,
          comm_out: item.admin_loss || 0,
          amount: item.amount || 0,
          total: item.total || 0,
          market_id: item.market_id || "",
          bet_type: item.bet_type || "",
          team_name: item.team_name || "",
          stake: item.stake || 0,
          odd: item.odd || 0,
          result_val: item.result_val || "Pending",
          event_id: item.event_id || eventId,
        }));

        setDetailData(mappedData);
        
        // ✅ FIX: Calculate total from 'amount' field, not 'total'
        const total = mappedData.reduce((sum, item) => sum + item.amount, 0);
        setTotalAmount(total);

        setResponseMeta({
          admin_id: payload.admin_id,
          role: payload.role,
          event_id: payload.event_id,
          level: response.level || "",
        });
      } else {
        toast.error(response.message || "Failed to fetch detail data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch detail data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => Number(num || 0).toFixed(2);

  const handleMarketSummaryClick = (eventId) => {
    const admin_id = localStorage.getItem("admin_id") || "admin";
    const role = parseInt(localStorage.getItem("role")) || 1;
    const payload = {
      event_id: eventId,
      admin_id: admin_id,
      role: role,
    };

    console.log("✅ Navigating with payload:", payload);

    navigate(`/reports/profit-loss-summary-event/${eventId}`, {
      state: {
        payload: payload,
         eventName: eventName, 
      },
    });
  };

  const handleBetHistoryClick = (marketId, betType) => {
    const admin_id = localStorage.getItem("admin_id") || "admin";
    const role = parseInt(localStorage.getItem("role")) || 1;

    const payload = {
      market_id: marketId,
      admin_id: admin_id,
      role: role,
      event_id: eventId,
      bet_type: betType,
      page: 1,
      limit: 50,
      search: "",
      from_date: "",
      to_date: "",
    };

    console.log("✅ Bet History Payload:", payload);

    navigate(`/reports/profit-loss-bet-history/${marketId}`, {
      state: {
        payload: payload,
      },
    });
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />
      <div className="card">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center gap-2">
          {/* <h3 className="card-title mb-0">Detail - Event ID: {eventId}</h3> */}
              <h3 className="card-title mb-0">
            Profit Loss Of  {eventName ? `- ${eventName}` : `- Event ID: ${eventId}`}
          </h3>
          <button
            className="btn btn-outline-light"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>NO</th>
                  <th>USERNAME</th>
                  <th>MARKET</th>
                  <th>COMM IN</th>
                  <th>COMM OUT</th>
                  <th>AMOUNT</th>
                  <th>TOTAL</th>
                  <th className="text-center">INFO</th>
                </tr>
              </thead>
              <thead className="table-secondary fw-bold">
                <tr>
                  <td>#</td>
                  <td colSpan="4">Total</td>
                  <td>{formatNumber(totalAmount)}</td>
                  <td></td>
                  <td></td>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="table_loader">
                      <div className="text-center py-5">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : detailData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  detailData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sr_no}</td>
                      <td>{item.username}</td>
                      <td>{item.market}</td>
                      <td>{formatNumber(item.comm_in)}</td>
                      <td>{formatNumber(item.comm_out)}</td>
                      <td
                        className={`fw-bold ${item.amount >= 0 ? "text-success" : "text-danger"}`}
                      >
                        {formatNumber(item.amount)}
                      </td>
                      <td>{formatNumber(item.total)}</td>
                      <td>
                        <div className="d-flex justify-content-start gap-1">
                          <button
                            className="btn gradient-4 btn-rounded"
                            onClick={() =>
                              handleMarketSummaryClick(item.event_id)
                            }
                            title="View Summary"
                          >
                            S
                          </button>

                          <button
                            className="buttoncommon gradient-3"
                            onClick={() =>
                              handleBetHistoryClick(
                                item.market_id,
                                item.bet_type,
                              )
                            }
                            title="View Bet History"
                          >
                            B
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfitLossDetail;