import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from "react-bootstrap";
import {
  FaArrowLeft, FaUser, FaGift, FaUsers, FaChartBar, FaMobileAlt,
  FaProjectDiagram, FaRulerCombined, FaTree, FaCrown, FaStar, FaAward
} from "react-icons/fa";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL || "https://realestateapi.a2logicgroup.com/adminapi";

function VoicePresidentRewardsDetails() {
  const { userId, projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [mentorDetails, setMentorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");



  useEffect(() => {
    if (userId && projectId && userId !== "undefined" && projectId !== "undefined") {
      fetchMentorRoyaltyDetails();
    } else {
      setError("Invalid user ID or project ID");
      setLoading(false);
    }
  }, [userId, projectId]);

  const fetchMentorRoyaltyDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Correct endpoint: mantor-offer
      const response = await fetch(
        `${API_URL}/vice-president-rewards-lists?user_id=${userId}&project_id=${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        setMentorDetails(result.data[0]);
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      console.error("Failed to fetch mentor details:", err);
      setError("Failed to load data from server. Showing demo data.");

      // Set mock data on error
      setMentorDetails();

      Swal.fire({
        icon: "info",
        title: "Demo Mode",
        text: "Showing sample data for demonstration.",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return "-";
    }
  };

  const handleBack = () => navigate(-1);

  // Hierarchical Tree Component
  const HierarchicalTreeStructure = () => {
    if (!mentorDetails?.breakdown_achieved_detail) return null;

    const { child1_team_detail, child2_team_detail, remaining_teams_detail } = mentorDetails.breakdown_achieved_detail;

    return (
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0 text-white d-flex align-items-center">
            <FaTree className="me-2" />
            Hierarchical Team Tree Structure
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="management-tree" style={{ padding: "20px", backgroundColor: "#fff" }}>
            <div className="mgt-container">
              <div className="mgt-wrapper">
                {/* Main Mentor */}
                <div className="mgt-item">
                  <div className="mgt-item-parent">
                    <div className="person">
                      <div className="bg-primary text-white p-3 rounded text-center" style={{ minWidth: "200px" }}>
                        <FaCrown className="fs-2 mb-2" />
                        <div className="fw-bold">{mentorDetails.username}</div>
                        <div className="small">Main Mentor</div>
                        <Badge bg="light" text="dark" className="mt-1">
                          {mentorDetails.achieved_area} SQYD
                        </Badge>
                        <div className="small mt-1">{mentorDetails.mobile}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mgt-item-children">
                    {/* Child 1 */}
                    {child1_team_detail && (
                      <div className="mgt-item-child">
                        <div className="mgt-item">
                          <div className="mgt-item-parent">
                            <div className="person">
                              <div className="bg-success text-white p-2 rounded text-center" style={{ minWidth: "180px" }}>
                                <FaStar className="mb-1" />
                                <div className="fw-bold">{child1_team_detail.username}</div>
                                <div className="small">Primary Team</div>
                                <Badge bg="light" text="dark" className="mt-1" style={{ fontSize: "0.7rem" }}>
                                  {child1_team_detail.direct_area} SQYD
                                </Badge>
                                <div className="small mt-1">{child1_team_detail.mobile}</div>
                              </div>
                            </div>
                          </div>
                          <div className="mgt-item-children">
                            {child1_team_detail.team_downline_breakdown?.map((d, i) => (
                              <div className="mgt-item-child" key={i}>
                                <div className="person">
                                  <div className="bg-info text-white p-2 rounded text-center" style={{ minWidth: "160px" }}>
                                    <FaUser className="mb-1" />
                                    <div className="fw-bold">{d.username}</div>
                                    <div className="small">Downline</div>
                                    <div className="small">{d.mobile}</div>
                                    <Badge bg="light" text="dark" className="mt-1" style={{ fontSize: "0.6rem" }}>
                                      {d.contribution_area} SQYD
                                    </Badge>
                                    <div className="small mt-1" style={{ fontSize: "0.7rem" }}>
                                      {d.contribution_type}
                                    </div>
                                    {d.direct_sales_details?.map((s, j) => (
                                      <div key={j} className="small" style={{ fontSize: "0.6rem" }}>
                                        • {s.area} SQYD
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Child 2 */}
                    {child2_team_detail && (
                      <div className="mgt-item-child">
                        <div className="mgt-item">
                          <div className="mgt-item-parent">
                            <div className="person">
                              <div className="bg-warning text-dark p-2 rounded text-center" style={{ minWidth: "180px" }}>
                                <FaAward className="mb-1" />
                                <div className="fw-bold">{child2_team_detail.username}</div>
                                <div className="small">Secondary Team</div>
                                
                                <Badge bg="light" text="dark" className="mt-1" style={{ fontSize: "0.7rem" }}>
                                  {child2_team_detail.direct_area} SQYD
                                </Badge>
                                <div className="small mt-1">{child2_team_detail.mobile}</div>
                              </div>
                            </div>
                          </div>
                          <div className="mgt-item-children">
                            {child2_team_detail.team_downline_breakdown?.map((d, i) => (
                              <div className="mgt-item-child" key={i}>
                                <div className="person">
                                  <div className="bg-secondary text-white p-2 rounded text-center" style={{ minWidth: "160px" }}>
                                    <FaUser className="mb-1" />
                                    <div className="fw-bold">{d.username}</div>
                                    <div className="small">Downline</div>
                                                                        <div className="small">{d.mobile}</div>

                                    <Badge bg="light" text="dark" className="mt-1" style={{ fontSize: "0.6rem" }}>
                                      {d.contribution_area} SQYD
                                    </Badge>
                                    <div className="small mt-1" style={{ fontSize: "0.7rem" }}>
                                      {d.contribution_type}
                                    </div>
                                    {d.direct_sales_details?.map((s, j) => (
                                      <div key={j} className="small" style={{ fontSize: "0.6rem" }}>
                                        • {s.area} SQYD
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Remaining Teams */}
                    {remaining_teams_detail && remaining_teams_detail.length > 0 && (
                      <div className="mgt-item-child">
                        <div className="mgt-item">
                          <div className="mgt-item-parent">
                            <div className="person">
                              <div className="bg-info text-white p-2 rounded text-center" style={{ minWidth: "180px" }}>
                                <FaUsers className="mb-1" />
                                <div className="fw-bold">Additional Teams</div>
                                <div className="small">{remaining_teams_detail.length} Members</div>
                                <Badge bg="light" text="dark" className="mt-1" style={{ fontSize: "0.7rem" }}>
                                  {mentorDetails.breakdown_achieved_detail.remaining_area_total} SQYD
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="mgt-item-children">
                            {remaining_teams_detail.map((team, i) => (
                              <div className="mgt-item-child" key={i}>
                                <div className="person">
                                  <div className="bg-light text-dark border p-2 rounded text-center" style={{ minWidth: "160px" }}>
                                    <FaUser className="mb-1 text-primary" />
                                    <div className="fw-bold" style={{ fontSize: "0.9rem" }}>{team.username}</div>
                                    <div className="small text-muted">Team Member</div>
                                    <Badge bg="primary" className="mt-1" style={{ fontSize: "0.6rem" }}>
                                      {team.direct_area} SQYD
                                    </Badge>
                                    <div className="small mt-1" style={{ fontSize: "0.7rem" }}>{team.mobile}</div>
                                    {team.direct_sales_details?.map((s, j) => (
                                      <div key={j} className="small text-success" style={{ fontSize: "0.6rem" }}>
                                        • {s.area} SQYD
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            .management-tree { background-color: #fff; font-family: inherit; padding: 20px; }
            .mgt-container { flex-grow: 1; overflow: auto; justify-content: center; }
            .mgt-wrapper { display: flex; }
            .mgt-item { display: flex; flex-direction: column; margin: auto; }
            .mgt-item-parent { margin-bottom: 50px; position: relative; display: flex; justify-content: center; }
            .mgt-item-parent:after {
              position: absolute; content: ''; width: 2px; height: 25px; bottom: 0; left: 50%;
              background-color: #6c757d; transform: translateY(100%);
            }
            .mgt-item-children { display: flex; justify-content: center; }
            .mgt-item-child { padding: 0 15px; position: relative; }
            .mgt-item-child:before, .mgt-item-child:after {
              content: ''; position: absolute; background-color: #6c757d; left: 0;
            }
            .mgt-item-child:before { left: 50%; top: 0; transform: translateY(-100%); width: 2px; height: 25px; }
            .mgt-item-child:after { top: -23px; transform: translateY(-100%); height: 2px; width: 100%; }
            .mgt-item-child:first-child:after { left: 50%; width: 50%; }
            .mgt-item-child:last-child:after { width: calc(50% + 1px); }
            .person { text-align: center; }
          `}</style>
        </Card.Body>
      </Card>
    );
  };

  // Loading
  if (loading) {
    return (
      <Container className="padding_15">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading Vice President Details...</span>
        </div>
      </Container>
    );
  }

  // No Data
  if (!mentorDetails) {
    return (
      <Container className="padding_15">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || "No mentor details available."}</p>
          <Button variant="primary" onClick={handleBack}>
            <FaArrowLeft /> Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  // Main Render
  return (
    <Container className="padding_15">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <div className="titlepage">
            <h3 className="mb-1">
              <FaTree className="me-2" />
              Vice President Details - Tree View
            </h3>
            <p className="mb-0 opacity-75">
              User ID: <strong>{mentorDetails.user_id}</strong> | Project: <strong>{mentorDetails.project_name}</strong>
            </p>
          </div>
          <Button variant="light" onClick={handleBack}>
            <FaArrowLeft /> Back
          </Button>
        </div>

        <div className="card-body">
          {/* User Info */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-white"><FaUser className="me-2" />User Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <strong><FaUser className="me-2 text-muted" />Username:</strong>
                  <div className="text-dark fs-5 mt-1">{mentorDetails.username}</div>
                </Col>
                <Col md={3} className="mb-3">
                  <strong><FaMobileAlt className="me-2 text-muted" />Mobile:</strong>
                  <div className="text-dark fs-5 mt-1">{mentorDetails.mobile}</div>
                </Col>
                <Col md={3} className="mb-3">
                  <strong><FaProjectDiagram className="me-2 text-muted" />Project:</strong>
                  <div className="text-dark fs-5 mt-1">{mentorDetails.project_name}</div>
                </Col>
                <Col md={3} className="mb-3">
                  <strong><FaRulerCombined className="me-2 text-muted" />Achieved Area:</strong>
                  <div className="mt-1">
                    <Badge bg="success" className="fs-6 p-2">{mentorDetails.achieved_area} SQYD</Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Gift Details */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-white"><FaGift className="me-2" />Gift & Offer Details</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <strong>Offer Name:</strong>
                  <div className="text-dark fs-6 mt-1">{mentorDetails.gift_details?.offer_name}</div>
                </Col>
                <Col md={4} className="mb-3">
                  <strong>Offer Item:</strong>
                  <div className="text-dark fs-6 mt-1">{mentorDetails.gift_details?.offer_item}</div>
                </Col>
                <Col md={4} className="mb-3">
                  <strong>Min Area:</strong>
                  <div className="text-dark fs-6 mt-1">{mentorDetails.gift_details?.min_area_sqyd} SQYD</div>
                </Col>
                {/* <Col md={6} className="mb-3">
                  <strong>Booking Date:</strong>
                  <div className="text-dark fs-6 mt-1">{formatDate(mentorDetails.gift_details?.booking_date)}</div>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Closing Date:</strong>
                  <div className="text-dark fs-6 mt-1">{formatDate(mentorDetails.gift_details?.closing_date)}</div>
                </Col> */}
              </Row>
            </Card.Body>
          </Card>

          {/* Tree Structure */}
          <HierarchicalTreeStructure />

          {/* Contributing Team */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-white"><FaUsers className="me-2" />All Contributing Team Members</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {mentorDetails.contributing_team?.map((member) => (
                  <Col md={6} lg={4} key={member.id} className="mb-2">
                    <div className="d-flex align-items-center p-2 border rounded">
                      <FaUser className="me-2 text-primary" />
                      <div>
                        <div className="fw-bold">{member.username}</div>
                        <small className="text-muted">{member.mobile}</small>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded mt-3">
                <strong>Total Members:</strong>
                <Badge bg="success" className="fs-6">
                  {mentorDetails.contributing_team?.length} Members
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default VoicePresidentRewardsDetails;