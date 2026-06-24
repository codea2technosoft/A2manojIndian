import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Container } from "react-bootstrap";
import { MdCelebration, MdDateRange, MdPerson, MdPhone, MdTrendingUp, MdTrackChanges, MdCheckCircle } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function ProprtyAwardsWinnerHistories() {
  const [eligibilityData, setEligibilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const showCustomMessageModal = (title, text) => {
    alert(`${title}: ${text}`);
  };

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
          <Container fluid>
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
                          {toSentenceCase(data.offer_name) || "Unnamed Offer"}
                        </h5>
                      </div>
                      <Badge bg={getStatusBadgeColor(data.status)} className="fs-6">
                        {data.status || "Unknown"}
                      </Badge>
                    </Card.Header>

                    <Card.Body>
                      {/* User Information */}
                      <div className="mb-4 p-3 bg-light rounded">
                        <Row>
                          <Col sm={4} className="mb-2">
                            <div className="d-flex align-items-center">
                              <MdPerson className="text-primary me-2" />
                              <div>
                                <small className="text-muted">User Name</small>
                                <div className="fw-bold">{data.user_name || "-"}</div>
                              </div>
                            </div>
                          </Col>
                          <Col sm={4} className="mb-2">
                            <div className="d-flex align-items-center">
                              <MdPhone className="text-primary me-2" />
                              <div>
                                <small className="text-muted">Mobile</small>
                                <div className="fw-bold">{data.mobile || "-"}</div>
                              </div>
                            </div>
                          </Col>

                          <Col sm={4} className="mb-2">
                            <div className="d-flex align-items-center">
                              <MdPhone className="text-primary me-2" />
                              <div>
                                <small className="text-muted">Current Offer Name</small>
                                <div className="fw-bold">{toSentenceCase(data.offer_name) || "-"}</div>
                              </div>
                            </div>
                          </Col>

                        </Row>
                        <div className="mt-2">
                          <small className="text-muted">Project</small>
                          <div className="fw-bold text-primary">{data.project_name || "-"}</div>
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
                      <div className="border-top pt-3">
                        <h6 className="text-info mb-3">
                          <MdDateRange className="me-2" />
                          Timeline
                        </h6>
                        <Row>
                          <Col sm={6} className="mb-2">
                            <div className="d-flex align-items-center">
                              <small className="text-muted d-block me-2">Start Date:</small>
                              <div className="fw-bold text-danger">
                                {formatDate(data.date_from) || "-"}
                              </div>
                            </div>
                          </Col>
                          <Col sm={6} className="mb-2">
                            <div className="d-flex align-items-center">
                              <small className="text-muted d-block me-2">End Date:</small>
                              <div className="fw-bold text-success">
                                {formatDate(data.date_to) || "-"}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>

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
            <Row className="mt-4">
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
                <Card className="shadow-sm border-0 bg-warning text-white">
                  <Card.Body className="text-center py-3">
                    <h4>
                      {eligibilityData.filter(item =>
                        calculateAchievement(item.achieved_area, item.target_area) < 100
                      ).length}
                    </h4>
                    <p className="mb-0">In Progress</p>
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
            </Row>
          </Container>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }
        .card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .border-success { border-color: #198754 !important; }
        .border-warning { border-color: #ffc107 !important; }
        .border-light { border-color: #f8f9fa !important; }
      `}</style>
    </div>
  );
}

export default ProprtyAwardsWinnerHistories;