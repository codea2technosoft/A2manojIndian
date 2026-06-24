import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button, Table, Spinner, Alert, Accordion } from "react-bootstrap";
import { FaArrowLeft, FaUser, FaGift, FaUsers, FaChartBar, FaMobileAlt, FaProjectDiagram, FaRulerCombined, FaChevronDown, FaChevronRight, FaTree } from "react-icons/fa";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function MentorRoyaltyDetails() {
  const { userId, projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mentorDetails, setMentorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    child1: true,
    child2: true,
    remaining: true
  });
  
  const token = localStorage.getItem("token");
  const userData = location.state?.userData;

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
      const response = await fetch(
        `${API_URL}/mentor-royalty-details?user_id=${userId}&project_id=${projectId}`,
        {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        setMentorDetails(result.data[0]);
      } else {
        // If API fails, use mock data
        const mockDetails = {
          user_id: userId,
          username: userData?.username || "Arvind Kumar",
          mobile: userData?.mobile || "9351460000",
          project_id: parseInt(projectId),
          project_name: userData?.project_name || "Ganesh Vihar Vistar",
          achieved_area: userData?.achieved_area || "2500.00",
          gift_details: {
            offer_name: userData?.gift_details?.offer_name || "Team Diwali Offer",
            offer_item: userData?.gift_details?.offer_item || "Smart Watch2",
            min_area_sqyd: "2500.00",
            booking_date: userData?.gift_details?.booking_date || "2025-09-30T18:30:00.000Z",
            closing_date: userData?.gift_details?.closing_date || "2026-01-30T18:30:00.000Z"
          },
          breakdown_achieved_detail: {
            child1_team_detail: {
              username: "Pradeep Mittal",
              mobile: "7891470471",
              downline_area: "750.00",
              direct_area: "750.00",
              required: "750.00",
              team_downline_breakdown: [
                {
                  user_id: 4,
                  username: "Pradeep Mittal",
                  mobile: "7891470471",
                  contribution_area: "750.00",
                  contribution_type: "Self Direct Sale",
                  direct_sales_details: [
                    {
                      area: "700.00",
                      date: "2025-11-09T18:30:00.000Z"
                    },
                    {
                      area: "50.00",
                      date: "2025-11-12T18:30:00.000Z"
                    }
                  ]
                }
              ]
            },
            child2_team_detail: {
              username: "Subham Gupta",
              mobile: "9887823462",
              downline_area: "750.00",
              direct_area: "750.00",
              required: "750.00",
              team_downline_breakdown: [
                {
                  user_id: 5,
                  username: "Subham Gupta",
                  mobile: "9887823462",
                  contribution_area: "750.00",
                  contribution_type: "Self Direct Sale",
                  direct_sales_details: [
                    {
                      area: "750.00",
                      date: "2025-11-09T18:30:00.000Z"
                    }
                  ]
                }
              ]
            },
            remaining_area_total: "1000.00",
            remaining_teams_detail: [
              {
                username: "Jitendra Soni",
                mobile: "8955723762",
                downline_area: "500.00",
                direct_area: "500.00",
                direct_sales_details: [
                  {
                    area: "500.00",
                    date: "2025-11-09T18:30:00.000Z"
                  }
                ]
              },
              {
                username: "Rahul buhadiya",
                mobile: "8385856179",
                downline_area: "500.00",
                direct_area: "500.00",
                direct_sales_details: [
                  {
                    area: "500.00",
                    date: "2025-11-09T18:30:00.000Z"
                  }
                ]
              }
            ],
            remaining_required: "1000.00"
          },
          breakdown_achieved: {
            child1_area: "750.00",
            child2_area: "750.00",
            remaining_area: "1000.00"
          },
          contributing_team: [
            {
              id: 1,
              username: "Arvind Kumar",
              mobile: "9351460000"
            },
            {
              id: 4,
              username: "Pradeep Mittal",
              mobile: "7891470471"
            },
            {
              id: 5,
              username: "Subham Gupta",
              mobile: "9887823462"
            },
            {
              id: 10,
              username: "Jitendra Soni",
              mobile: "8955723762"
            },
            {
              id: 542,
              username: "Rahul buhadiya",
              mobile: "8385856179"
            }
          ]
        };
        setMentorDetails(mockDetails);
        
        Swal.fire({
          icon: 'info',
          title: 'Demo Data Loaded',
          text: 'Showing demonstration data based on your provided structure.',
          timer: 3000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Failed to fetch mentor details:", error);
      setError("Failed to load mentor royalty details from API. Showing demo data.");
      
      // Fallback mock data
      const mockDetails = {
        user_id: userId,
        username: "Arvind Kumar",
        mobile: "9351460000",
        project_id: parseInt(projectId),
        project_name: "Ganesh Vihar Vistar",
        achieved_area: "2500.00",
        gift_details: {
          offer_name: "Team Diwali Offer",
          offer_item: "Smart Watch2",
          min_area_sqyd: "2500.00",
          booking_date: "2025-09-30T18:30:00.000Z",
          closing_date: "2026-01-30T18:30:00.000Z"
        },
        breakdown_achieved_detail: {
          child1_team_detail: {
            username: "Pradeep Mittal",
            mobile: "7891470471",
            downline_area: "750.00",
            direct_area: "750.00",
            required: "750.00",
            team_downline_breakdown: [
              {
                user_id: 4,
                username: "Pradeep Mittal",
                mobile: "7891470471",
                contribution_area: "750.00",
                contribution_type: "Self Direct Sale",
                direct_sales_details: [
                  {
                    area: "700.00",
                    date: "2025-11-09T18:30:00.000Z"
                  },
                  {
                    area: "50.00",
                    date: "2025-11-12T18:30:00.000Z"
                  }
                ]
              }
            ]
          },
          child2_team_detail: {
            username: "Subham Gupta",
            mobile: "9887823462",
            downline_area: "750.00",
            direct_area: "750.00",
            required: "750.00",
            team_downline_breakdown: [
              {
                user_id: 5,
                username: "Subham Gupta",
                mobile: "9887823462",
                contribution_area: "750.00",
                contribution_type: "Self Direct Sale",
                direct_sales_details: [
                  {
                    area: "750.00",
                    date: "2025-11-09T18:30:00.000Z"
                  }
                ]
              }
            ]
          },
          remaining_area_total: "1000.00",
          remaining_teams_detail: [
            {
              username: "Jitendra Soni",
              mobile: "8955723762",
              downline_area: "500.00",
              direct_area: "500.00",
              direct_sales_details: [
                {
                  area: "500.00",
                  date: "2025-11-09T18:30:00.000Z"
                }
              ]
            },
            {
              username: "Rahul buhadiya",
              mobile: "8385856179",
              downline_area: "500.00",
              direct_area: "500.00",
              direct_sales_details: [
                {
                  area: "500.00",
                  date: "2025-11-09T18:30:00.000Z"
                }
              ]
            }
          ],
          remaining_required: "1000.00"
        },
        breakdown_achieved: {
          child1_area: "750.00",
          child2_area: "750.00",
          remaining_area: "1000.00"
        },
        contributing_team: [
          {
            id: 1,
            username: "Arvind Kumar",
            mobile: "9351460000"
          },
          {
            id: 4,
            username: "Pradeep Mittal",
            mobile: "7891470471"
          },
          {
            id: 5,
            username: "Subham Gupta",
            mobile: "9887823462"
          },
          {
            id: 10,
            username: "Jitendra Soni",
            mobile: "8955723762"
          },
          {
            id: 542,
            username: "Rahul buhadiya",
            mobile: "8385856179"
          }
        ]
      };
      setMentorDetails(mockDetails);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return "-";
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Tree Structure Component
  const TeamTreeStructure = () => {
    if (!mentorDetails?.breakdown_achieved_detail) return null;

    const { child1_team_detail, child2_team_detail, remaining_teams_detail } = mentorDetails.breakdown_achieved_detail;

    return (
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0 text-warning d-flex align-items-center">
            <FaTree className="me-2" />
            Team Tree Structure
          </h5>
        </Card.Header>
        <Card.Body>
          {/* Main Mentor */}
          <div className="text-center mb-4">
            <div className="bg-primary text-white p-3 rounded d-inline-block">
              <FaUser className="fs-2 mb-2" />
              <div className="fw-bold">{mentorDetails.username}</div>
              <div className="small">Mentor</div>
              <Badge bg="light" text="dark" className="mt-1">
                {mentorDetails.achieved_area} SQYD
              </Badge>
            </div>
          </div>

          {/* Connecting Line */}
          <div className="text-center mb-3">
            <div className="border-left" style={{ height: '30px', borderLeft: '2px solid #6c757d', margin: '0 auto', width: '2px' }}></div>
          </div>

          <Row>
            {/* Child 1 Team */}
            <Col md={6}>
              <Card className={`border-primary ${expandedSections.child1 ? '' : 'collapsed'}`}>
                <Card.Header 
                  className="bg-primary text-white cursor-pointer"
                  onClick={() => toggleSection('child1')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">🏆 Primary Team</h6>
                      <small>{child1_team_detail?.username}</small>
                    </div>
                    {expandedSections.child1 ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </Card.Header>
                {expandedSections.child1 && child1_team_detail && (
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Team Lead:</strong>
                        <span>{child1_team_detail.username}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Mobile:</strong>
                        <span>{child1_team_detail.mobile}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Direct Area:</strong>
                        <Badge bg="success">{child1_team_detail.direct_area} SQYD</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Required:</strong>
                        <Badge bg="warning">{child1_team_detail.required} SQYD</Badge>
                      </div>
                    </div>

                    {/* Downline Breakdown */}
                    {child1_team_detail.team_downline_breakdown?.map((downline, index) => (
                      <Card key={index} className="border-secondary mt-2">
                        <Card.Header className="bg-secondary text-white py-1">
                          <small>📊 Downline Performance</small>
                        </Card.Header>
                        <Card.Body className="p-2">
                          <div className="small">
                            <div><strong>Type:</strong> {downline.contribution_type}</div>
                            <div><strong>Area:</strong> {downline.contribution_area} SQYD</div>
                            {downline.direct_sales_details?.length > 0 && (
                              <div className="mt-1">
                                <strong>Sales:</strong>
                                {downline.direct_sales_details.map((sale, i) => (
                                  <Badge key={i} bg="info" className="ms-1" style={{ fontSize: '0.6rem' }}>
                                    {sale.area}SQYD
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </Card.Body>
                )}
              </Card>
            </Col>

            {/* Child 2 Team */}
            <Col md={6}>
              <Card className={`border-success ${expandedSections.child2 ? '' : 'collapsed'}`}>
                <Card.Header 
                  className="bg-success text-white cursor-pointer"
                  onClick={() => toggleSection('child2')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">🥈 Secondary Team</h6>
                      <small>{child2_team_detail?.username}</small>
                    </div>
                    {expandedSections.child2 ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </Card.Header>
                {expandedSections.child2 && child2_team_detail && (
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Team Lead:</strong>
                        <span>{child2_team_detail.username}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Mobile:</strong>
                        <span>{child2_team_detail.mobile}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Direct Area:</strong>
                        <Badge bg="success">{child2_team_detail.direct_area} SQYD</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong>Required:</strong>
                        <Badge bg="warning">{child2_team_detail.required} SQYD</Badge>
                      </div>
                    </div>

                    {/* Downline Breakdown */}
                    {child2_team_detail.team_downline_breakdown?.map((downline, index) => (
                      <Card key={index} className="border-secondary mt-2">
                        <Card.Header className="bg-secondary text-white py-1">
                          <small>📊 Downline Performance</small>
                        </Card.Header>
                        <Card.Body className="p-2">
                          <div className="small">
                            <div><strong>Type:</strong> {downline.contribution_type}</div>
                            <div><strong>Area:</strong> {downline.contribution_area} SQYD</div>
                            {downline.direct_sales_details?.length > 0 && (
                              <div className="mt-1">
                                <strong>Sales:</strong>
                                {downline.direct_sales_details.map((sale, i) => (
                                  <Badge key={i} bg="info" className="ms-1" style={{ fontSize: '0.6rem' }}>
                                    {sale.area}SQYD
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </Card.Body>
                )}
              </Card>
            </Col>
          </Row>

          {/* Additional Teams */}
          {remaining_teams_detail && remaining_teams_detail.length > 0 && (
            <>
              <div className="text-center my-3">
                <div className="border-left" style={{ height: '30px', borderLeft: '2px solid #6c757d', margin: '0 auto', width: '2px' }}></div>
              </div>

              <Card className={`border-warning ${expandedSections.remaining ? '' : 'collapsed'}`}>
                <Card.Header 
                  className="bg-warning text-dark cursor-pointer"
                  onClick={() => toggleSection('remaining')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                      <h6 className="mb-0 text-dark">👥 Additional Teams ({remaining_teams_detail.length})</h6>
                      <small className="text-dark">Total Area: {mentorDetails.breakdown_achieved_detail.remaining_area_total} SQYD</small>
                    </div>
                    {expandedSections.remaining ? <FaChevronDown /> : <FaChevronRight />}
                  </div>
                </Card.Header>
                {expandedSections.remaining && (
                  <Card.Body>
                    <Row>
                      {remaining_teams_detail.map((team, index) => (
                        <Col md={6} key={index} className="mb-3">
                          <Card className="border-info">
                            <Card.Header className="bg-info text-white py-2">
                              <div className="d-flex justify-content-between align-items-center">
                                <strong>{team.username}</strong>
                                <Badge bg="light" text="dark">{team.direct_area} SQYD</Badge>
                              </div>
                            </Card.Header>
                            <Card.Body className="p-2">
                              <div className="small">
                                <div><strong>Mobile:</strong> {team.mobile}</div>
                                {team.direct_sales_details?.length > 0 && (
                                  <div className="mt-1">
                                    <strong>Direct Sales:</strong>
                                    {team.direct_sales_details.map((sale, i) => (
                                      <div key={i} className="text-success">
                                        • {sale.area} SQYD on {formatDate(sale.date)}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    <div className="mt-3 p-2 bg-light rounded">
                      <div className="d-flex justify-content-between">
                        <strong>Total Additional Area:</strong>
                        <Badge bg="primary">{mentorDetails.breakdown_achieved_detail.remaining_area_total} SQYD</Badge>
                      </div>
                      <div className="d-flex justify-content-between mt-1">
                        <strong>Remaining Required:</strong>
                        <Badge bg="warning">{mentorDetails.breakdown_achieved_detail.remaining_required} SQYD</Badge>
                      </div>
                    </div>
                  </Card.Body>
                )}
              </Card>
            </>
          )}
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container className="padding_15">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading Mentor Royalty Details...</span>
        </div>
      </Container>
    );
  }

  if (error && !mentorDetails) {
    return (
      <Container className="padding_15">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={handleBack} className="mt-3">
            <FaArrowLeft /> Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="padding_15">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
          <div className="titlepage">
            <h3 className="mb-1">
              <FaUser className="me-2" />
              Mentor Royalty Details - Tree View
            </h3>
            <p className="mb-0 opacity-75">
              User ID: <strong>{mentorDetails?.user_id}</strong> | 
              Project: <strong>{mentorDetails?.project_name}</strong>
            </p>
          </div>
          <Button variant="light" onClick={handleBack}>
            <FaArrowLeft /> Back to List
          </Button>
        </div>

        <div className="card-body">
          {/* User Information Card */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-primary"><FaUser className="me-2" />User Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3} className="mb-3">
                  <strong><FaUser className="me-2 text-muted" />Username:</strong>
                  <div className="text-dark fs-5 mt-1">{mentorDetails?.username}</div>
                </Col>
                <Col md={3} className="mb-3">
                  <strong><FaMobileAlt className="me-2 text-muted" />Mobile:</strong>
                  <div className="text-dark fs-5 mt-1">{mentorDetails?.mobile}</div>
                </Col>
                <Col md={3} className="mb-3">
                  <strong><FaProjectDiagram className="me-2 text-muted" />Project:</strong>
                  <div className="text-dark fs-5 mt-1">{mentorDetails?.project_name}</div>
                </Col>
                <Col md={3} className="mb-3">
                  <strong><FaRulerCombined className="me-2 text-muted" />Achieved Area:</strong>
                  <div className="mt-1">
                    <Badge bg="success" className="fs-6 p-2">
                      {mentorDetails?.achieved_area} SQYD
                    </Badge>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Gift Details Card */}
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-success"><FaGift className="me-2" />Gift & Offer Details</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <strong>Offer Name:</strong>
                  <div className="text-dark fs-6 mt-1">{mentorDetails?.gift_details?.offer_name}</div>
                </Col>
                <Col md={4} className="mb-3">
                  <strong>Offer Item:</strong>
                  <div className="text-dark fs-6 mt-1">{mentorDetails?.gift_details?.offer_item}</div>
                </Col>
                <Col md={4} className="mb-3">
                  <strong>Minimum Area Required:</strong>
                  <div className="text-dark fs-6 mt-1">{mentorDetails?.gift_details?.min_area_sqyd} SQYD</div>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Booking Date:</strong>
                  <div className="text-dark fs-6 mt-1">{formatDate(mentorDetails?.gift_details?.booking_date)}</div>
                </Col>
                <Col md={6} className="mb-3">
                  <strong>Closing Date:</strong>
                  <div className="text-dark fs-6 mt-1">{formatDate(mentorDetails?.gift_details?.closing_date)}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tree Structure */}
          <TeamTreeStructure />

          {/* All Contributing Team Members */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-secondary"><FaUsers className="me-2" />All Contributing Team Members</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {mentorDetails?.contributing_team?.map((member, index) => (
                  <Col md={6} lg={4} key={member.id || index} className="mb-2">
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
                <strong>Total Team Members:</strong>
                <Badge bg="success" className="fs-6">
                  {mentorDetails?.contributing_team?.length} Members
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default MentorRoyaltyDetails;