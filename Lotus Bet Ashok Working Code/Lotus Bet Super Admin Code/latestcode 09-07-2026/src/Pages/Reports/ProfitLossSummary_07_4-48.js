import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    fetchSummaryData();
  }, [eventId]);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      const payload = { event_id: eventId ,type:'super_agent'};
      console.log("Sending payload:", payload);
      
      const res = await getProfitLossSummary(payload);
      const response = res.data;
      if (response.success) {
        setSummaryData(response.data || []);
        setTotalAmount(response.total || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch summary data");
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

  // Handle username click - Navigate to market summary page with event_id
  const handleUsernameClick = (username, type) => {
    // Navigate to market summary page with event_id
    navigate(`/reports/profit-loss-summary-market/${eventId}`, {
      state: { 
        username: username,
        type: type 
      }
    });
  };

  // Get unique usernames with their types and total amounts
  const getUniqueUsernames = () => {
    const unique = {};
    summaryData.forEach(item => {
      if (!unique[item.username]) {
        unique[item.username] = {
          username: item.username,
          type: item.type,
          amount: 0
        };
      }
      unique[item.username].amount += item.amount;
    });
    return Object.values(unique);
  };

  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Summary - Event ID: {eventId}</h5>
          <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="card-body">
          {/* Username Cards - Clickable */}
          {/* <div className="row mb-4">
            {getUniqueUsernames().map((item, index) => (
              <div key={index} className="col-md-3 col-sm-6 mb-2">
                <div 
                  className="card border-primary shadow-sm" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleUsernameClick(item.username, item.type)}
                >
                  <div className="card-body text-center py-2">
                    <h6 className="mb-0 text-primary">{item.username}</h6>
                    <span className={`fw-bold ${item.amount < 0 ? 'text-danger' : 'text-success'}`}>
                      {formatNumber(item.amount)}
                    </span>
                    <br />
                    <span className="badge bg-secondary mt-1">
                      {formatTypeName(item.type)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>SR NO</th>
                  <th>USERNAME</th>
                  {/* <th>TYPE</th> */}
                  <th className="text-end">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <Loader />
                      <p>Loading summary...</p>
                    </td>
                  </tr>
                ) : summaryData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  summaryData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sr_no || index + 1}</td>
                      <td>
                        <strong 
                          style={{ cursor: 'pointer', color: '#0d6efd' }}
                          onClick={() => handleUsernameClick(item.username, item.type)}
                        >
                          {item.username}
                        </strong>
                        {/* {item.hasChild && (
                          <span className="ms-2 badge bg-secondary">Parent</span>
                        )} */}
                      </td>
                      {/* <td>
                        <span className={getTypeBadge(item.type)}>
                          {formatTypeName(item.type)}
                        </span>
                      </td> */}
                      <td className={`text-end fw-bold ${item.amount < 0 ? 'text-danger' : 'text-success'}`}>
                        {formatNumber(item.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {/* <tfoot className="table-warning fw-bold">
                <tr>
                  <td colSpan="3" className="text-end">Total</td>
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

export default ProfitLossSummary;