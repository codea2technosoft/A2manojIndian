import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../Common/Loader";
import { getProfitLossSummary } from "../../Server/api";

const ProfitLossMarketUsersDetails = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const navigationPayload = location.state?.payload || {};
  console.log("Received sssss:", navigationPayload);

  // Get username and type from state
  const { username, type } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, [eventId, type]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      
      const payload = {
      event_id: navigationPayload.event_id || eventId,
      admin_id: navigationPayload.admin_id,
      role: navigationPayload.role,
    };
      console.log("Sending payload to user details:", payload);

      const res = await getProfitLossSummary(payload);
      const response = res.data;

      if (response.success) {
        setUserData(response.data || []);
        setTotalAmount(response.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => Number(num || 0).toFixed(2);

  // Function to get badge color based on type
  const getTypeBadge = (type) => {
    const typeMap = {
      'admin': 'badge bg-danger',
      'super_agent': 'badge bg-warning text-dark',
      'agent': 'badge bg-info',
      'user': 'badge bg-success',
      'master': 'badge bg-primary'
    };
    return typeMap[type] || 'badge bg-secondary';
  };

  // Function to format type name
  const formatTypeName = (type) => {
    const typeMap = {
      'admin': 'Admin',
      'super_agent': 'Super Agent',
      'agent': 'Agent',
      'user': 'User',
      'master': 'Master'
    };
    return typeMap[type] || type;
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />
      <div className="card">
        {/* <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            User Details - {username || eventId}
          </h5>
          <div>
            {username && (
              <span className="badge bg-light text-dark me-2">
                {formatTypeName(type)}
              </span>
            )}
            <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div> */}
        <div className="card-body">
          {username && (
            <div className="alert alert-info mb-3">
              <strong>Showing details for: {username}</strong>
              {/* <span className="ms-2 badge bg-primary">{formatTypeName(type)}</span> */}
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>SR NO</th>
                  <th>USERNAME</th>
                  {/* <th>TYPE</th>
                  <th>EVENT</th> */}
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <Loader />
                      <p>Loading user details...</p>
                    </td>
                  </tr>
                ) : userData.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  userData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sr_no || index + 1}</td>
                      <td>
                        <strong>{item.username}</strong>
                        {/* {item.hasChild && (
                          <span className="ms-2 badge bg-secondary">Parent</span>
                        )} */}
                      </td>
                      {/* <td>
                        <span className={getTypeBadge(item.type)}>
                          {formatTypeName(item.type)}
                        </span>
                      </td> */}
                      {/* <td>{item.event || item.market || "-"}</td> */}
                      <td className={`text-end fw-bold ${item.amount < 0 ? 'text-danger' : 'text-success'}`}>
                        {formatNumber(item.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {/* <tfoot className="table-warning fw-bold">
                <tr>
                  <td colSpan="4" className="text-end">Total</td>
                  <td className="text-end">{formatNumber(totalAmount)}</td>
                </tr>
              </tfoot> */}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfitLossMarketUsersDetails;