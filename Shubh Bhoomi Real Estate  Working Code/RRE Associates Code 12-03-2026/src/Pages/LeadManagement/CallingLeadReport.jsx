import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // navigation for status click
import { Container, Row, Col } from "react-bootstrap";
import { BiSupport } from "react-icons/bi";
import { MdIncompleteCircle } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

// Map string names to actual React Icon components
const iconMap = {
  BiSupport: BiSupport,
};

const CallingLeadReport = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [completeCount, setCompleteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // States for custom message modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Define all possible statuses (this will always be shown)
  const getAllStatuses = () => {
    return [
      { title: "Not Interested", icon: "BiSupport" },
      { title: "Already Purchased", icon: "BiSupport" },
      { title: "Looking in Low Budget", icon: "BiSupport" },
      { title: "Looking in Different Location", icon: "BiSupport" },
      { title: "In Follow Up Hot", icon: "BiSupport" },
      { title: "Looking in Commercial Use", icon: "BiSupport" },
      { title: "Details sent visit not done", icon: "BiSupport" },
      { title: "Call not Pickup", icon: "BiSupport" },
      { title: "In Follow Up", icon: "BiSupport" },
      { title: "In Follow Up Booking Done", icon: "BiSupport" },
      { title: "Invalid Mobile Number", icon: "BiSupport" },
      { title: "M Profile", icon: "BiSupport" },
      { title: "In Follow Up Site Visit Done Booking Pending", icon: "BiSupport" },
      { title: "In Follow Up Booking Done Payment Pending", icon: "BiSupport" },
      { title: "New", icon: "BiSupport" },
    ];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) {
          showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
          return;
        }

        const response = await fetch(`${API_URL}/calling-lead-report`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            showCustomMessageModal("Authorization Error", "Unauthorized: Please log in again.", "error");
          } else {
            const errorData = await response.json();
            showCustomMessageModal("Error", errorData.message || "Failed to fetch dashboard data.", "error");
          }
          throw new Error(response.statusText);
        }

        const rawData = await response.json();

        const getCount = (status) => {
          return rawData.data?.find((item) => item.status === status)?.count || 0;
        };

        // Get all statuses and map with counts (will always show all statuses even if count is 0)
        const allStatuses = getAllStatuses();
        const transformedData = allStatuses.map(status => ({
          title: status.title,
          value: getCount(status.title),
          icon: status.icon
        }));

        setDashboardData(transformedData);
        setCompleteCount(rawData.complete_count || 0);
      } catch (err) {
        console.error("Fetch dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Empty state component with structure (will show all cards with 0 values)
  const AllStatusCards = () => {
    const allStatuses = getAllStatuses();
    
    return (
      <>
        {allStatuses.map((status, index) => {
          const IconComponent = iconMap[status.icon];
          return (
            <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
              <div
                className={`card bg_card_design clickable-card`}
                onClick={() => navigate(`/upload-property-lead-csv?status=${encodeURIComponent(status.title)}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body gap-2 d-flex align-items-center justify-content-start">
                  {IconComponent && (
                    <div className="icon_dashboard">
                      <IconComponent size={50} className="text-white" />
                    </div>
                  )}
                  <div>
                    <div className="card-title text-dark">{status.title}</div>
                    <div className="card-text">0</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  // Custom Modal Component
  const CustomMessageModal = () => {
    if (!showMessageModal) return null;
    
    return (
      <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{messageModalContent.title}</h5>
              <button type="button" className="btn-close" onClick={closeCustomMessageModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>{messageModalContent.text}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeCustomMessageModal}>
                Close
              </button>
              {messageModalContent.confirmAction && (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    messageModalContent.confirmAction();
                    closeCustomMessageModal();
                  }}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="padding_15">
      <div className="dashboard">
        {/* Total Calling Leads Card - Always visible */}
        <Row>
          <Col xl={12}>
            <div className="stats-card">
              <div className="d-flex align-items-center gap-2 card-body text-center p-2">
                <div className="stats-icon">
                  <MdIncompleteCircle className="fs-2 text-white"></MdIncompleteCircle>
                </div>
                <div className="d-flex align-items-center justify-content-between w-100">
                  <h6 className="stats-label">Total Calling Leads</h6>
                  <h2 className="stats-number">{completeCount}</h2>
                </div>
              </div>
              <div className="stats-decor"></div>
            </div>
          </Col>
        </Row>
        <hr />
        
        {/* Status Cards Grid - Always shows all cards */}
        <Row className="g-4">
          {dashboardData.length > 0 ? (
            // Show data from API with actual counts (could be 0)
            dashboardData.map((item, index) => {
              const IconComponent = iconMap[item.icon];
              return (
                <div key={index} className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                  <div
                    className={`card bg_card_design clickable-card`}
                    onClick={() => navigate(`/upload-property-lead-csv?status=${encodeURIComponent(item.title)}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body gap-2 d-flex align-items-center justify-content-start">
                      {IconComponent && (
                        <div className="icon_dashboard">
                          <IconComponent size={50} className="text-white" />
                        </div>
                      )}
                      <div>
                        <div className="card-title text-dark">{item.title}</div>
                        <div className="card-text">{item.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Show all status cards with 0 values when no API data yet
            <AllStatusCards />
          )}
        </Row>
        
        {/* Show info message when all counts are zero */}
        {dashboardData.length > 0 && dashboardData.every(item => item.value === 0) && (
          <Row className="mt-4">
            <Col xs={12}>
              <div className="alert alert-info text-center">
                <strong>Information:</strong> All lead status counts are zero. Upload leads to see statistics.
              </div>
            </Col>
          </Row>
        )}
      </div>
      
      {/* Render custom modal */}
      <CustomMessageModal />
    </div>
  );
};

export default CallingLeadReport;