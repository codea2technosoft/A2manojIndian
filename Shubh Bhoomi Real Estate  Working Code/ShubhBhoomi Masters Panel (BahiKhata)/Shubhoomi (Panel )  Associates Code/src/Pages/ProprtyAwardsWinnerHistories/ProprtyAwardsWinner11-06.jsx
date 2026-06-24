import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Container } from "react-bootstrap";
import { MdCelebration, MdDateRange, MdPerson, MdPhone, MdTrendingUp, MdTrackChanges, MdCheckCircle } from "react-icons/md";
import {
  FaGift
} from "react-icons/fa";
import Endimage from '../../assets/images/end.png'
import Start from '../../assets/images/start.png'

const API_URL = process.env.REACT_APP_API_URL;

function ProprtyAwardsWinnerHistories() {
  const [eligibilityData, setEligibilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [giftList, setGiftList] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const token = localStorage.getItem("token");
  const getAuthToken = () => localStorage.getItem("token");

  const showCustomMessageModal = (title, text) => {
    alert(`${title}: ${text}`);
  };
  const [dashboard, setDashboard] = useState({
    todayAssociate: 0,
    todayChannel: 0,
    activeProject: 0,
    activeBlock: 0,
    activePlot: 0,
    totalAssociate: 0,
    totalChannel: 0,
    totalTeamCount: 0,
    total_property: 0,
    total_lead_loan: 0,
    ongoingProject: 0,
    completeProject: 0,
    total_sqyd_self_sales: 0,
    total_sqyd_team_sales: 0,
    total_sqyd_channel_sales: 0,
    total_self_sales_earning: 0,
    total_team_sales_earning: 0,
    total_channel_sales_earning: 0,
    total_loan_earning: 0,
  });
  // Fetch eligibility data
  const fetchEligibilityData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/assiciate-gift-eligibility`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success) {
        // Convert single object to array for consistent mapping
        const data = result.data && result.data.length > 0 ? result.data : [];
        setEligibilityData(Array.isArray(data) ? data : [data]);
      } else {
        showCustomMessageModal("Error", result.message || "Failed to fetch eligibility data.");
      }
    } catch (error) {
      showCustomMessageModal("Error", "Failed to fetch eligibility data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibilityData();
  }, []);

  // Helper functions
  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Calculate achievement percentage and status
  const calculateAchievement = (achieved, target) => {
    if (!target || target === 0) return 0;
    return ((achieved / target) * 100).toFixed(1);
  };

  const getAchievementStatus = (achieved, target) => {
    const percentage = calculateAchievement(achieved, target);
    if (percentage >= 100) return "success";
    if (percentage >= 75) return "warning";
    return "danger";
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'eligible':
        return 'success';
      case 'completed':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Card background based on achievement
  const getCardVariant = (achieved, target) => {
    const percentage = calculateAchievement(achieved, target);
    if (percentage >= 100) return "success";
    if (percentage >= 75) return "warning";
    return "light";
  };
  useEffect(() => {
    const fetchGiftList = async () => {
      try {
        setLoadingGifts(true);
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/gift-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Fetched Gift List:", data);

        if (data.success === "1" && data.data && data.data.length > 0) {
          // Sort by area_sqyd in ascending order (choti se badi value)
          const sortedGifts = [...data.data].sort((a, b) =>
            parseFloat(a.area_sqyd) - parseFloat(b.area_sqyd)
          );
          setGiftList(sortedGifts);
        }
      } catch (error) {
        console.error("Gift list fetch error:", error);
      } finally {
        setLoadingGifts(false);
      }
    };

    fetchGiftList();
  }, []);
  const GiftProgressBar = () => {
    if (loadingGifts) {
      return (
        <div className="gift-progress-loading">
          <div className="gift-spinner" role="status">
            <span className="gift-spinner-text">Loading gifts...</span>
          </div>
          <p className="gift-loading-text">Loading gift progress...</p>
        </div>
      );
    }

    if (giftList.length === 0) {
      return (
        <div className="gift-progress-empty">
          <FaGift size={40} className="gift-empty-icon" />
          <p className="gift-empty-text">No gifts available at the moment</p>
        </div>
      );
    }

    const currentSqyd = parseFloat(dashboard.total_sqyd_self_sales) || 0;
    const maxSqyd = parseFloat(giftList[giftList.length - 1]?.area_sqyd) || Math.max(...giftList.map(g => parseFloat(g.area_sqyd)));

    return (
      <div className="gift-progress-wrapper">
        {/* <div className="gift-progress-header">
          {eligibilityData.map((data, index) => (
            <>
              <h5 className="gift-progress-title">
              <FaGift className="gift-title-icon" />
              <div key={index}>
                {toSentenceCase(data.offer_name) || "Unnamed Offer"}
              </div>
           </h5>

                <Badge bg={getStatusBadgeColor(data.status)} className="fs-6">
                  {data.status || "Unknown"}
                </Badge>
              </>
          ))}
          </div> */}

        <div className="gift-progress-container">
          <div className="gift-progress-track">
            {/* Progress Line */}
            <div className="gift-progress-line">
              <div
                className="gift-progress-fill"
              // style={{ 
              //   width: `${Math.min((currentSqyd / maxSqyd) * 100, 100)}%` 
              // }}
              ></div>
            </div>

            {/* Gift Steps with Flexbox Layout */}
            <div className="gift-steps-scroll-container">
              <div className="gift-steps-flex-container">
                 <div className="gift-step-flex-item gift-step-blank">
                  <div className="gift-step-content-wrapper">
                    <div className="gift-step-marker gift-step-marker-blank">
                      <span>
                        <img src={Start} alt="Start" width="50" />
                      </span>
                    </div>
                    <div className="gift-step-content">
                      <div className="gift-step-name">Start Point</div>


                    </div>
                  </div>
                </div>
                {giftList.map((gift, index) => {
                  const giftSqyd = parseFloat(gift.area_sqyd);
                  const isCompleted = currentSqyd >= giftSqyd;
                  const isCurrent = currentSqyd < giftSqyd &&
                    (index === 0 || currentSqyd >= parseFloat(giftList[index - 1]?.area_sqyd));
                  const progressPercentage = (giftSqyd / maxSqyd) * 100;

                  return (
                    <div
                      key={gift.id || index}
                      className={`gift-step-flex-item ${isCompleted ? 'gift-step-completed' : ''} ${isCurrent ? 'gift-step-current' : ''}`}
                    // style={{ flex: `0 0 ${progressPercentage}%` }}
                    >
                      <div className="gift-step-content-wrapper">
                        <div className={`${isCurrent ? 'gift-step-marker bg-success' : 'gift-step-marker'}`}>
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <div className="gift-step-content">
                          <div className=" gift-step-name">{gift.offer_name}</div>
                          <div className="gift-step-target">{gift.offer_item || `Gift ${index + 1}`}</div>
                          <div className="gift-step-target"><strong className="text-dark"> {giftSqyd} SQYD</strong></div>
                          {isCompleted && (
                            <div className="gift-step-achieved">
                              <small>Completed!</small>
                            </div>
                          )}
                          {/* {isCurrent && (
                            <div className="gift-step-pending">
                              <small>{Math.max(0, giftSqyd - currentSqyd).toFixed(2)} SQYD to go</small>
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="gift-step-flex-item gift-step-blank">
                  <div className="gift-step-content-wrapper">
                    <div className="gift-step-marker gift-step-marker-blank">
                      <span>
                        <img src={Endimage} alt="Endimage" width="50" />
                      </span>
                    </div>
                    <div className="gift-step-content">
                      <div className="gift-step-name">End Point</div>
                       
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        {/* <div className="gift-progress-summary">
          <div className="gift-summary-grid">
            <div className="gift-summary-item">
              <div className="gift-summary-count">{giftList.length}</div>
              <div className="gift-summary-label">Total Gifts</div>
            </div>
            <div className="gift-summary-item">
              <div className="gift-summary-count gift-summary-completed">
                {giftList.filter(gift => currentSqyd >= parseFloat(gift.area_sqyd)).length}
              </div>
              <div className="gift-summary-label">Completed</div>
            </div>
            <div className="gift-summary-item">
              <div className="gift-summary-count gift-summary-remaining">
                {giftList.filter(gift => currentSqyd < parseFloat(gift.area_sqyd)).length}
              </div>
              <div className="gift-summary-label">Remaining</div>
            </div>
          </div>
        </div> */}


      </div>
    );
  };
  return (
    <div className="padding_15">
      <div className="userlist">
        {/* Header Section */}
        <div className="card shadow-sm mb-4 border-0 bg-gradient-primary">
          <div className="card-body text-center text-white py-4">
            <MdCelebration size={40} className="mb-3" />
            <h2 className="mb-2">🎁 Offer / Rewards Eligibility Current Status 🎁</h2>
            <p className="mb-2">Track your performance and eligibility for exciting rewards</p>
            <div className="alert alert-warning d-inline-block mb-0 py-1 px-3">
              <small>
                <i>Current offer and eligibility may change as per target achievement</i>
              </small>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading eligibility data...</p>
          </div>
        ) : eligibilityData.length === 0 ? (
          <div className="card shadow-sm text-center py-5">
            <div className="card-body">
              <MdCelebration size={50} className="text-muted mb-3" />
              <h5 className="text-muted">No eligibility data found</h5>
              <p className="text-muted">You don't have any active offers at the moment.</p>
            </div>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {eligibilityData.map((data, index) => (
                <Col xl={12} lg={12} md={12} key={data.user_id || index}>
                  <Card
                    className={`shadow-sm h-100 border-${getCardVariant(data.achieved_area, data.target_area)}`}
                  >
                    <Card.Header className={`bg-${getCardVariant(data.achieved_area, data.target_area)} text-white d-flex justify-content-between align-items-center`}>
                      <div>
                        <h5 className="mb-0">
                          <MdCelebration className="me-2" />
                          {/* {toSentenceCase(data.offer_name) || "Unnamed Offer"} */}
                          Self Offer For You
                        </h5>
                      </div>
                      <Badge bg={getStatusBadgeColor(data.status)} className="fs-6">
                        {data.status || "Unknown"}
                      </Badge>
                    </Card.Header>

                    <Card.Body>
                       <div className="border-top pt-3">
                        <h6 className="text-info mb-3">
                          <MdDateRange className="me-2" />
                          Timeline
                        </h6>
                        <Row>
                          <Col sm={4} className="mb-2">
                            <div className="d-flex align-items-center">
                              <small className="text-muted d-block me-2">Start Date:</small>
                              <div className="fw-bold text-danger">
                                {formatDate(data.date_from) || "-"}
                              </div>
                            </div>
                          </Col>
                          <Col sm={4} className="mb-2">
                            <div className="d-flex align-items-center">
                              <small className="text-muted d-block me-2">Qualify Date:</small>
                              <div className="fw-bold text-info">
                                {formatDate(data.completed_on) || "-"}
                              </div>
                            </div>
                          </Col>
                          <Col sm={4} className="mb-2">
                            <div className="d-flex align-items-center">
                              <small className="text-muted d-block me-2">End Date:</small>
                              <div className="fw-bold text-success">
                                {formatDate(data.date_to) || "-"}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      {/* User Information */}
                      <div className="card my-2">
                        <div className="card-body  shadow-none">
                          <GiftProgressBar />
                        </div>

                      </div>

                      {/* Performance Metrics */}
                      <div className="mb-4 p-3 border rounded">
                        <h6 className="text-primary mb-3">
                          <MdTrackChanges className="me-2" />
                          Performance Metrics
                        </h6>
                        <Row className="text-center">

                          <Col sm={4} className="mb-3">
                            <div className="border-end">
                              <small className="text-muted d-block">Target Area</small>
                              <div className="fw-bold fs-5 text-danger">{data.target_area || "0"} SQYD</div>
                            </div>
                          </Col>
                          <Col sm={4} className="mb-3">
                            <div>
                              <small className="text-muted d-block">Achieved Area</small>
                              <div className="fw-bold fs-5 text-success">{data.achieved_area || "0"} SQYD</div>
                            </div>
                          </Col>
                        </Row>

                        {/* Achievement Status */}
                        <div className="text-center mt-3">
                          {calculateAchievement(data.achieved_area, data.target_area) >= 100 ? (
                            <div className="text-success">
                              <div className="d-flex align-items-center justify-content-center mb-1">
                                <MdCheckCircle className="me-1" />
                                <strong>Target Achieved! You are eligible for the reward.</strong>
                              </div>
                              <small className="text-danger fw-bold">
                                🏅 Finally, Award will be distributed End Date on : {formatDate(data.date_to) || "-"}
                              </small>
                            </div>
                          ) : (
                            <div className="text-warning">
                              <strong>
                                {data.target_area - data.achieved_area} SQYD remaining to achieve target
                              </strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timeline Section */}
                     

                      {/* Additional Information */}

                    </Card.Body>

                    <Card.Footer className="bg-transparent">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Last Updated: {formatDate(new Date())}
                        </small>
                        <MdTrendingUp
                          className={`text-${getAchievementStatus(data.achieved_area, data.target_area)} fs-5`}
                        />
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
            <Row className="g-4 mt-2">
              {eligibilityData.map((data, index) => (
                <Col xl={12} lg={12} md={12} key={data.user_id || index}>
                  <Card
                    className={`shadow-sm h-100 border-${getCardVariant(data.achieved_area, data.target_area)}`}
                  >
                    <Card.Header className={`bg-${getCardVariant(data.achieved_area, data.target_area)} text-white d-flex justify-content-between align-items-center`}>
                      <div>
                        <h5 className="mb-0">
                          <MdCelebration className="me-2" />
                          {/* {toSentenceCase(data.offer_name) || "Unnamed Offer"} */}
                                                  Team Offer For You

                        </h5>
                      </div>
                      <Badge bg={getStatusBadgeColor(data.status)} className="fs-6">
                        {data.status || "Unknown"}
                      </Badge>
                    </Card.Header>

                    <Card.Body>
                       <div className="border-top pt-3">
                        <h6 className="text-info mb-3">
                          <MdDateRange className="me-2" />
                          Timeline
                        </h6>
                        <Row>
                          <Col sm={4} className="mb-2">
                            <div className="d-flex align-items-center">
                              <small className="text-muted d-block me-2">Start Date:</small>
                              <div className="fw-bold text-danger">
                                {formatDate(data.date_from) || "-"}
                              </div>
                            </div>
                          </Col>
                          <Col sm={4} className="mb-2">
                            <div className="d-flex align-items-center">
                              <small className="text-muted d-block me-2">Qualify Date:</small>
                              <div className="fw-bold text-info">
                                {formatDate(data.completed_on) || "-"}
                              </div>
                            </div>
                          </Col>
                          <Col sm={4} className="mb-2">
                            <div className="d-flex align-items-center">
                              <small className="text-muted d-block me-2">End Date:</small>
                              <div className="fw-bold text-success">
                                {formatDate(data.date_to) || "-"}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      {/* User Information */}
                      <div className="card my-2">
                        <div className="card-body  shadow-none">
                          <GiftProgressBar />
                        </div>

                      </div>

                      {/* Performance Metrics */}
                      <div className="mb-4 p-3 border rounded">
                        <h6 className="text-primary mb-3">
                          <MdTrackChanges className="me-2" />
                          Performance Metrics
                        </h6>
                        <Row className="text-center">

                          <Col sm={4} className="mb-3">
                            <div className="border-end">
                              <small className="text-muted d-block">Target Area</small>
                              <div className="fw-bold fs-5 text-danger">{data.target_area || "0"} SQYD</div>
                            </div>
                          </Col>
                          <Col sm={4} className="mb-3">
                            <div>
                              <small className="text-muted d-block">Achieved Area</small>
                              <div className="fw-bold fs-5 text-success">{data.achieved_area || "0"} SQYD</div>
                            </div>
                          </Col>
                        </Row>

                        {/* Achievement Status */}
                        <div className="text-center mt-3">
                          {calculateAchievement(data.achieved_area, data.target_area) >= 100 ? (
                            <div className="text-success">
                              <div className="d-flex align-items-center justify-content-center mb-1">
                                <MdCheckCircle className="me-1" />
                                <strong>Target Achieved! You are eligible for the reward.</strong>
                              </div>
                              <small className="text-danger fw-bold">
                                🏅 Finally, Award will be distributed End Date on : {formatDate(data.date_to) || "-"}
                              </small>
                            </div>
                          ) : (
                            <div className="text-warning">
                              <strong>
                                {data.target_area - data.achieved_area} SQYD remaining to achieve target
                              </strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timeline Section */}
                     

                      {/* Additional Information */}

                    </Card.Body>

                    <Card.Footer className="bg-transparent">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Last Updated: {formatDate(new Date())}
                        </small>
                        <MdTrendingUp
                          className={`text-${getAchievementStatus(data.achieved_area, data.target_area)} fs-5`}
                        />
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Summary Stats */}
            {/* <Row className="mt-4">
              <Col md={3}>
                <Card className="shadow-sm border-0 bg-primary text-white">
                  <Card.Body className="text-center py-3">
                    <h4>{eligibilityData.length}</h4>
                    <p className="mb-0">Total Offers</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow-sm border-0 bg-success text-white">
                  <Card.Body className="text-center py-3">
                    <h4>
                      {eligibilityData.filter(item =>
                        calculateAchievement(item.achieved_area, item.target_area) >= 100
                      ).length}
                    </h4>
                    <p className="mb-0">Completed</p>
                  </Card.Body>
                </Card>
              </Col>
          
              <Col md={3}>
                <Card className="shadow-sm border-0 bg-info text-white">
                  <Card.Body className="text-center py-3">
                    <h4>
                      {eligibilityData.filter(item => item.status === 'Eligible').length}
                    </h4>
                    <p className="mb-0">Eligible</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row> */}
          </>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .bg-gradient-primary {
              background: linear-gradient(45deg, #262f55, #078ac8);
        }
        
        .border-success { border-color: #198754 !important; }
        .border-warning { border-color: #ffc107 !important; }
        .border-light { border-color: #f8f9fa !important; }
      `}</style>
    </div>
  );
}

export default ProprtyAwardsWinnerHistories;