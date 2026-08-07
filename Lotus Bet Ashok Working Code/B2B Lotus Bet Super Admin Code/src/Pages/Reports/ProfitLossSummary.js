// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loader from "../../Common/Loader";
// import { getProfitLossSummary } from "../../Server/api";

// const ProfitLossSummary = () => {
//   const { eventId } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [summaryData, setSummaryData] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [responseMeta, setResponseMeta] = useState({
//     admin_id: "",
//     role: "",
//     event_id: "",
//     level: "",
//   });

//   const location = useLocation();
//   const navigationPayload = location.state?.payload || {};
//   console.log("Received Payload:", navigationPayload);

//   useEffect(() => {
//     fetchSummaryData();
//   }, [eventId]);

//   // const fetchSummaryData = async () => {
//   //   try {
//   //     setLoading(true);
//   //      const admin_id = localStorage.getItem("admin_id") || "admin";
//   //     const role = parseInt(localStorage.getItem("role")) || 1;
//   //     const payload = { event_id: eventId ,admin_id:admin_id,role:role};
//   //     console.log("Sending payload:", payload);

//   //     const res = await getProfitLossSummary(payload);
//   //     const response = res.data;
//   //     if (response.success) {
//   //       setSummaryData(response.data || []);
//   //       setTotalAmount(response.total || 0);
//   //     }
//   //   } catch (error) {
//   //     console.error(error);
//   //     toast.error("Failed to fetch summary data");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   //   const fetchSummaryData = async () => {
//   //   try {
//   //     setLoading(true);

//   //   const admin_id = responseMeta.admin_id || localStorage.getItem("admin_id") || "admin";
//   //   const role = responseMeta.role || parseInt(localStorage.getItem("role")) || 1;

//   //     const payload = { event_id: eventId};
//   //     console.log("Sending payload:", payload);

//   //     const res = await getProfitLossSummary(payload);
//   //     const response = res.data;
//   //     if (response.success) {
//   //       setSummaryData(response.data || []);
//   //       setTotalAmount(response.total || 0);

//   //       // ✅ SIRF YEH 3 LINES ADD KARO
//   //       setResponseMeta({
//   //         admin_id: response.admin_id || admin_id,
//   //         role: response.role || role,
//   //         event_id: response.event_id || eventId,
//   //         level: response.level || ""
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error(error);
//   //     toast.error("Failed to fetch summary data");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchSummaryData = async () => {
//     try {
//       setLoading(true);

//       const payload = {
//         event_id: navigationPayload.event_id || eventId,
//         admin_id: navigationPayload.admin_id,
//         role: navigationPayload.role,
//       };

//       console.log("Sending payload:", payload);

//       const res = await getProfitLossSummary(payload);
//       const response = res.data;

//       if (response.success) {
//         setSummaryData(response.data || []);
//         setTotalAmount(response.total || 0);

//         setResponseMeta({
//           admin_id: payload.admin_id,
//           role: payload.role,
//           event_id: payload.event_id,
//           level: response.level || "",
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch summary data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatNumber = (num) => Number(num || 0).toFixed(2);

//   // Function to get badge color based on type
//   // const getTypeBadge = (type) => {
//   //   const typeMap = {
//   //     'admin': 'badge bg-danger',
//   //     'super_agent': 'badge bg-warning text-dark',
//   //     'agent': 'badge bg-info',
//   //     'user': 'badge bg-success',
//   //     'master': 'badge bg-primary'
//   //   };
//   //   return typeMap[type] || 'badge bg-secondary';
//   // };

//   // // Function to format type name
//   // const formatTypeName = (type) => {
//   //   const typeMap = {
//   //     'admin': 'Admin',
//   //     'super_agent': 'Super Agent',
//   //     'agent': 'Agent',
//   //     'user': 'User',
//   //     'master': 'Master'
//   //   };
//   //   return typeMap[type] || type;
//   // };

//   // Handle username click - Navigate to market summary page with event_id
//   // Handle username click - Response se data le kar bhejo
//   // Handle username click - Response se data le kar bhejo
//   // const handleUsernameClick = (username, itemAdminId, itemRole) => {
//   //   const event_id = responseMeta.event_id || eventId;
//   //   const payload = {
//   //     username: username,
//   //     event_id: event_id,
//   //     sport_id: 4,
//   //     admin_id: itemAdminId,
//   //     role: itemRole
//   //   };

//   //   console.log("✅ Navigating with payload:", payload);

//   //   navigate(`/reports/profit-loss-summary-market/${eventId}`, {
//   //     state: {
//   //       payload: payload
//   //     }
//   //   });
//   // };

//   const handleUsernameClick = (username, itemAdminId, itemRole) => {
//     const payload = {
//       username,
//       event_id: responseMeta.event_id,
//       // sport_id: 4,
//       admin_id: itemAdminId,
//       role: itemRole,
//     };

//     console.log("Navigating with payload:", payload);

//     navigate(`/reports/profit-loss-summary-market/${responseMeta.event_id}`, {
//       state: {
//         payload,
//       },
//     });
//   };

//   // Get unique usernames with their types and total amounts
//   const getUniqueUsernames = () => {
//     const unique = {};
//     summaryData.forEach((item) => {
//       if (!unique[item.username]) {
//         unique[item.username] = {
//           username: item.username,
//           type: item.type,
//           amount: 0,
//         };
//       }
//       unique[item.username].amount += item.amount;
//     });
//     return Object.values(unique);
//   };

//   return (
//     <>
//       <ToastContainer autoClose={500} theme="colored" />
//       <div className="card">
//         <div className="card-header bg-primary-yellow align-items-center d-flex justify-content-between align-items-md-center gap-2">
//           <h3 className="card-title mb-0">Summary - Event ID: {eventId}</h3>
//           <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
//             Back
//           </button>
//         </div>
//         <div className="card-body">
//           {/* Username Cards - Clickable */}
//           {/* <div className="row mb-4">
//             {getUniqueUsernames().map((item, index) => (
//               <div key={index} className="col-md-3 col-sm-6 mb-2">
//                 <div 
//                   className="card border-primary shadow-sm" 
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => handleUsernameClick(item.username, item.type)}
//                 >
//                   <div className="card-body text-center py-2">
//                     <h6 className="mb-0 text-primary">{item.username}</h6>
//                     <span className={`fw-bold ${item.amount < 0 ? 'text-danger' : 'text-success'}`}>
//                       {formatNumber(item.amount)}
//                     </span>
//                     <br />
//                     <span className="badge bg-secondary mt-1">
//                       {formatTypeName(item.type)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div> */}

//           {/* Table */}
//           <div className="table-responsive">
//             <table className="table table-bordered table-hover">
//               <thead className="table-dark">
//                 <tr>
//                   <th>SR NO</th>
//                   <th>USERNAME</th>
//                   {/* <th>TYPE</th> */}
//                   <th>AMOUNT</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="4" className="table_loader">
//                     <div  className="text-center py-5">
//                       <Loader />
//                       {/* <p>Loading summary...</p> */}
//                     </div>
//                     </td>
//                   </tr>
//                 ) : summaryData.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="text-center py-5">
//                       No Data Found
//                     </td>
//                   </tr>
//                 ) : (
//                   summaryData.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.sr_no || index + 1}</td>
//                       <td>
//                         <div className="hover_user"
//                           // onClick={() => handleUsernameClick(item.username, item.type.item.admin_id,item.role,item.event_id,item.sport_id)}
//                           onClick={() =>
//                             handleUsernameClick(
//                               item.username,
//                               item.admin_id,
//                               item.role,
//                             )
//                           }
//                         >
//                           {item.username}
//                         </div>
//                         {/* {item.hasChild && (
//                           <span className="ms-2 badge bg-secondary">Parent</span>
//                         )} */}
//                       </td>
//                       {/* <td>
//                         <span className={getTypeBadge(item.type)}>
//                           {formatTypeName(item.type)}
//                         </span>
//                       </td> */}
//                       <td
//                         className={`fw-bold ${item.amount < 0 ? "text-danger" : "text-success"}`}
//                       >
//                         {formatNumber(item.amount)}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//               {/* <tfoot className="table-warning fw-bold">
//                 <tr>
//                   <td colSpan="3" className="text-end">Total</td>
//                   <td className="text-end">{formatNumber(totalAmount)}</td>
//                 </tr>
//               </tfoot> */}
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProfitLossSummary;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Common/Loader";
import { getProfitLossSummary } from "../../Server/api";

const ProfitLossSummary = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [responseMeta, setResponseMeta] = useState({
    admin_id: "",
    role: "",
    event_id: "",
    level: "",
  });

  const location = useLocation();
  const navigationPayload = location.state?.payload || {};
  console.log("Received Payload:", navigationPayload);

  useEffect(() => {
    fetchSummaryData();
  }, [eventId]);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);

      const payload = {
        event_id: navigationPayload.event_id || eventId,
        admin_id: navigationPayload.admin_id,
        role: navigationPayload.role,
      };

      console.log("Sending payload:", payload);

      const res = await getProfitLossSummary(payload);
      const response = res.data;

      if (response.success) {
        setSummaryData(response.data || []);
        // ✅ FIX: Use grand_total.amount instead of response.total
        if (response.grand_total) {
          setTotalAmount(response.grand_total.amount || 0);
        } else if (response.total) {
          setTotalAmount(response.total || 0);
        }

        setResponseMeta({
          admin_id: payload.admin_id,
          role: payload.role,
          event_id: payload.event_id,
          level: response.level || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch summary data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => Number(num || 0).toFixed(2);

  const handleUsernameClick = (username, itemAdminId, itemRole) => {
    const payload = {
      username,
      event_id: responseMeta.event_id,
      admin_id: itemAdminId,
      role: itemRole,
    };

    console.log("Navigating with payload:", payload);

    navigate(`/reports/profit-loss-summary-market/${responseMeta.event_id}`, {
      state: {
        payload,
      },
    });
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />
      <div className="card">
        <div className="card-header bg-primary-yellow align-items-center d-flex justify-content-between align-items-md-center gap-2">
          <h3 className="card-title mb-0">Summary - Event ID: {eventId}</h3>
          <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="card-body">
          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  {/* <th>SR NO</th> */}
                  <th>USERNAME</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="table_loader">
                      <div className="text-center py-5">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : summaryData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-5">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  summaryData.map((item, index) => (
                    <tr key={index}>
                      {/* <td>{item.sr_no || index + 1}</td> */}
                      <td>
                        <div
                          className="hover_user"
                          onClick={() =>
                            handleUsernameClick(
                              item.username,
                              item.admin_id,
                              item.role,
                            )
                          }
                        >
                          {item.username}
                        </div>
                      </td>
                      <td
                        className={`fw-bold ${item.amount < 0 ? "text-danger" : "text-success"}`}
                      >
                        {formatNumber(item.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {/* Total Footer */}
              {!loading && summaryData.length > 0 && (
                <tfoot className="table-striped fw-bold">
                  <tr>
                    <td colSpan="1" className="text-start">Total</td>
                    <td className={ totalAmount < 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                      {formatNumber(totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfitLossSummary;