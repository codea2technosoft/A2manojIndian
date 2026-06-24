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

        const transformedData = [
          { title: "Not Interested", value: getCount("Not Interested"), icon: "BiSupport" },
          { title: "Already Purchased", value: getCount("Already Purchased"), icon: "BiSupport" },
          { title: "Looking in Low Budget", value: getCount("Looking in Low Budget"), icon: "BiSupport" },
          { title: "Looking in Different Location", value: getCount("Looking in Different Location"), icon: "BiSupport" },
          { title: "In Follow Up Hot", value: getCount("In Follow Up Hot"), icon: "BiSupport" },
          { title: "Looking in Commercial Use", value: getCount("Looking in Commercial Use"), icon: "BiSupport" },
          { title: "Details sent visit not done", value: getCount("Details sent visit not done"), icon: "BiSupport" },
          { title: "Call not Pickup", value: getCount("Call not Pickup"), icon: "BiSupport" },
          { title: "In Follow Up", value: getCount("In Follow Up"), icon: "BiSupport" },
          { title: "In Follow Up Booking Done", value: getCount("In Follow Up Booking Done"), icon: "BiSupport" },
          { title: "Invalid Mobile Number", value: getCount("Invalid Mobile Number"), icon: "BiSupport" },
          { title: "M Profile", value: getCount("M Profile"), icon: "BiSupport" },
          { title: "In Follow Up Site Visit Done Booking Pending", value: getCount("In Follow Up Site Visit Done Booking Pending"), icon: "BiSupport" },
          { title: "In Follow Up Booking Done Payment Pending", value: getCount("In Follow Up Booking Done Payment Pending"), icon: "BiSupport" },
          { title: "New", value: getCount("New"), icon: "BiSupport" },
        ];

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
        <Row className="g-4">
          {dashboardData.length > 0 ? (
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
            <Col xs={12}>
              <div className="text-center text-muted mt-5">No dashboard data available.</div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default CallingLeadReport;
