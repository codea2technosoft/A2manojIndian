import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Table, Badge,
  Button, Tabs, Tab, ProgressBar, Alert,
  Spinner, Accordion, ListGroup
} from 'react-bootstrap';
import {
  FaArrowLeft, FaTrophy, FaCheckCircle, FaTimesCircle,
  FaUsers, FaRupeeSign, FaMapMarkerAlt, FaFileAlt,
  FaStar, FaCrown, FaMedal, FaAward, FaUserFriends
} from 'react-icons/fa';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';

const API_URL = process.env.REACT_APP_API_URL;

const LifeTimeRewardsWinnerListsDetails = () => {
  const { user_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [selectedRewardIndex, setSelectedRewardIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('rewards');

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');

        // Check if data is passed in state
        if (location.state?.userData) {
          setUserData(location.state.userData);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const response = await fetch(`${API_URL}/lifetime-rewards-winner-details/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.success) {
          setUserData(result.data);
        } else {
          console.error('Failed to fetch user details:', result.message);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user_id, location.state]);

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatArea = (area) => {
    if (!area) return '0 sqyd';
    const num = parseFloat(area);
    return `${num.toLocaleString('en-IN')} sqyd`;
  };

  const getRewardBadgeColor = (index) => {
    const colors = [
      'primary', 'success', 'warning', 'info',
      'danger', 'dark', 'secondary', 'light'
    ];
    return colors[index % colors.length];
  };

  const getStatusIcon = (status) => {
    if (status === 'PASS' || status === 'ELIGIBLE') {
      return <BsCheckCircleFill className="text-success me-1" />;
    }
    return <BsXCircleFill className="text-danger me-1" />;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading lifetime Rewards details...</p>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body className="text-center">
            <h4 className="text-danger">User data not found</h4>
            <p className="text-muted">Unable to load lifetime Rewards details</p>
            <Link to="/life-time-rewards-winner-lists">
              <Button variant="primary" className="mt-3">
                <FaArrowLeft className="me-2" />
                Back to Winners List
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const currentReward = userData.all_rewards?.[selectedRewardIndex] || {};
  const distributionCheck = currentReward.distribution_check_30_30_40 || {};
  const teamDetails = currentReward.team_details || {};

  return (
    <Container fluid className="py-3 px-4">

      {/* Header with Back Button */}
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">
                <FaTrophy className="text-warning me-2" />
                Lifetime Rewards Details
              </h3>
            </div>

            <Link to="/life-time-rewards-winner-lists">
              <Button variant="primary" size="sm" className="mb-2">
                <FaArrowLeft className="me-1" /> Back to List
              </Button>
            </Link>
          </div>
        </Card.Header>
      </Card>

      {/* Stats Cards Row */}
      {/* <Row className="my-4">
        <Col md={3} sm={6}>
          <Card className="text-center border-primary h-100">
            <Card.Body>
              <h6 className="text-muted">Total Team</h6>
              <h3 className="text-primary">
                <FaUsers className="me-2" />
                {teamDetails.total_children || 0}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center border-success h-100">
            <Card.Body>
              <h6 className="text-muted">Total Buy SQYD</h6>
              <h3 className="text-success">
                {formatArea(userData.total_buysqrt)}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <h6 className="text-muted">Eligible Rewards</h6>
              <h3 className="text-warning">
                <FaTrophy className="me-2" />
                {userData.total_eligible_rewards || 0}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center border-info h-100">
            <Card.Body>
              <h6 className="text-muted">Current Rewards</h6>
              <h5 className="text-info mb-0">
                {currentReward.eligible_reward?.offer_item || 'N/A'}
              </h5>
              <small className="text-success">
                {formatCurrency(currentReward.eligible_reward?.item_amount)}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

      {/* Main Content Row - Two Columns Side by Side */}
      <Row>
        {/* Left Column - User Info & Rewards List */}
        <Col lg={12} className="mb-4">
          {/* User Profile Card */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="bg-gradient-primary rounded-circle p-2 d-inline-block mb-2">
                  <FaTrophy className="fs-1 text-info" />
                </div>
                <h4 className="mb-1">{userData.username}</h4>
              </div>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Mobile:</strong> {userData.mobile}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Total Buy SQYD:</strong> {formatArea(userData.total_buysqrt)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Total Eligible Rewards:</strong> {userData.total_eligible_rewards}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Total Team Members:</strong> {teamDetails.total_children || 0}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Rewards Progress - Table Format */}
          <Card className="shadow-sm">
            {/* <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaAward className="me-2" />
                Rewards Progress
              </h5>
            </Card.Header> */}
            <Card.Body className="p-0">
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table hover bordered size="sm" className="mb-0">
                  <thead className="sticky-top bg-light">
                    <tr>
                      <th>Sr no.</th>
                      <th>Date</th>
                      <th>Level</th>
                      <th>Reward Item</th>
                      <th>Required Area</th>
                      <th>Amount</th>
                      <th>Status</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {userData.all_rewards?.map((reward, index) => (
                      <tr
                        key={reward.reward_index}
                        onClick={() => setSelectedRewardIndex(index)}
                        className={selectedRewardIndex === index ? 'table-primary' : ''}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <span>
                            {reward.reward_index}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {reward.buysqrt_updated_at
                              ? new Date(reward.buysqrt_updated_at)
                                .toLocaleDateString('en-GB')
                              : "-"
                            }
                          </div>
                        </td>
                        <td>
                          <Badge bg="success">
                            Level {reward.reward_index}
                          </Badge>
                        </td>
                        <td>
                          <strong>{reward.eligible_reward?.offer_item}</strong>
                        </td>
                        <td>{formatArea(reward.eligible_reward?.area_sqyd)}</td>
                        <td>
                          <span className="text-success fw-bold">
                            {formatCurrency(reward.eligible_reward?.item_amount)}
                          </span>
                        </td>
                        <td>
                          <Badge bg="success">
                            <FaCheckCircle className="me-1" />
                            ELIGIBLE
                          </Badge>
                        </td>

                        {/* <td>
                          <Button
                            variant={selectedRewardIndex === index ? "primary" : "outline-primary"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRewardIndex(index);
                            }}
                          >
                            View
                          </Button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Tabs Content */}
        {/* <Col lg={12}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4 reward-tabs"
            fill
          >
            <Tab eventKey="rewards" title={<><FaTrophy /> Rewards Details</>}>
              <Card className="shadow-sm">
                <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-light">
                    <FaStar className="me-2" />
                    Reward {selectedRewardIndex + 1} Details
                  </h5>
                  <Badge bg="light" text="dark" className="fs-6">
                    Level {currentReward.reward_index}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="p-3 bg-light rounded mb-3">
                        <h6 className="text-muted mb-2">Rewards Information</h6>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Offer Item:</span>
                          <strong className="text-primary">
                            {currentReward.eligible_reward?.offer_item || 'N/A'}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Item Amount:</span>
                          <strong className="text-success fs-5">
                            {formatCurrency(currentReward.eligible_reward?.item_amount)}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Required Area:</span>
                          <strong>
                            {formatArea(currentReward.eligible_reward?.area_sqyd)}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>User's Buy SQYD:</span>
                          <strong>
                            {formatArea(currentReward.user_buysqrt)}
                          </strong>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="p-3 bg-light rounded mb-3">
                        <h6 className="text-muted mb-2">Distribution Status</h6>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span>Overall Status:</span>
                          <Badge bg="success" className="fs-6">
                            {getStatusIcon(distributionCheck.overall_status)}
                            {distributionCheck.overall_status || 'N/A'}
                          </Badge>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Required Total Area:</span>
                          <strong>
                            {formatArea(distributionCheck.required_total_area)}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total Achieved:</span>
                          <strong className="text-success">
                            {formatArea(distributionCheck.self_remaining_check?.total_achieved)}
                          </strong>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <h6 className="text-muted mb-2">
                      <FaFileAlt className="me-2" />
                      Terms & Conditions
                    </h6>
                    <Alert variant="info" className="bg-light">
                      <p className="mb-0">
                        {currentReward.eligible_reward?.terms_conditions || 'No terms specified'}
                      </p>
                    </Alert>
                  </div>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="distribution" title={<><FaUsers /> Distribution Check</>}>
              <Card className="shadow-sm">
                <Card.Header className="bg-warning text-white">
                  <h5 className="mb-0">
                    <FaCheckCircle className="me-2" />
                    30-30-40 Distribution Check
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <Card className="h-100 border-success">
                        <Card.Header className="bg-success text-white">
                          <h6 className="mb-0">Top Leg 1 (30%)</h6>
                        </Card.Header>
                        <Card.Body>
                          {distributionCheck.child1_check ? (
                            <>
                              <div className="d-flex align-items-center mb-2">
                                <span>Status:</span>
                                <Badge bg="success" className="ms-2">
                                  {getStatusIcon(distributionCheck.child1_check.status)}
                                  {distributionCheck.child1_check.status}
                                </Badge>
                              </div>
                              <p className="mb-1">
                                <strong>Name:</strong> {distributionCheck.child1_check.child_name}
                              </p>
                              <p className="mb-1">
                                <strong>Mobile:</strong> {distributionCheck.child1_check.child_mobile}
                              </p>
                              <div className="progress mb-2">
                                <div
                                  className="progress-bar bg-success"
                                  style={{
                                    width: `${Math.min(100, (distributionCheck.child1_check.achieved / distributionCheck.child1_check.required) * 100)}%`
                                  }}
                                >
                                  {formatArea(distributionCheck.child1_check.achieved)} / {formatArea(distributionCheck.child1_check.required)}
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-muted">No data available</p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card className="h-100 border-success">
                        <Card.Header className="bg-success text-white">
                          <h6 className="mb-0">Top Leg 2 (30%)</h6>
                        </Card.Header>
                        <Card.Body>
                          {distributionCheck.child2_check ? (
                            <>
                              <div className="d-flex align-items-center mb-2">
                                <span>Status:</span>
                                <Badge bg="success" className="ms-2">
                                  {getStatusIcon(distributionCheck.child2_check.status)}
                                  {distributionCheck.child2_check.status}
                                </Badge>
                              </div>
                              <p className="mb-1">
                                <strong>Name:</strong> {distributionCheck.child2_check.child_name}
                              </p>
                              <p className="mb-1">
                                <strong>Mobile:</strong> {distributionCheck.child2_check.child_mobile}
                              </p>
                              <div className="progress mb-2">
                                <div
                                  className="progress-bar bg-success"
                                  style={{
                                    width: `${Math.min(100, (distributionCheck.child2_check.achieved / distributionCheck.child2_check.required) * 100)}%`
                                  }}
                                >
                                  {formatArea(distributionCheck.child2_check.achieved)} / {formatArea(distributionCheck.child2_check.required)}
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-muted">No data available</p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={4}>
                      <Card className="h-100 border-info">
                        <Card.Header className="bg-info text-white">
                          <h6 className="mb-0">Self & Other Legs (40%)</h6>
                        </Card.Header>
                        <Card.Body>
                          {distributionCheck.self_remaining_check ? (
                            <>
                              <div className="d-flex align-items-center mb-2">
                                <span>Status:</span>
                                <Badge bg="success" className="ms-2">
                                  {getStatusIcon(distributionCheck.self_remaining_check.status)}
                                  {distributionCheck.self_remaining_check.status}
                                </Badge>
                              </div>
                              <p className="mb-1">
                                <strong>Self Area:</strong> {formatArea(distributionCheck.self_remaining_check.self_area)}
                              </p>
                              <p className="mb-1">
                                <strong>Remaining Children:</strong> {distributionCheck.self_remaining_check.remaining_children_count}
                              </p>
                              <p className="mb-1">
                                <strong>Required:</strong> {formatArea(distributionCheck.self_remaining_check.required)}
                              </p>
                              <div className="progress mb-2">
                                <div
                                  className="progress-bar bg-info"
                                  style={{
                                    width: `${Math.min(100, (distributionCheck.self_remaining_check.total_achieved / distributionCheck.self_remaining_check.required) * 100)}%`
                                  }}
                                >
                                  {formatArea(distributionCheck.self_remaining_check.total_achieved)} / {formatArea(distributionCheck.self_remaining_check.required)}
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className="text-muted">No data available</p>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="team" title={<><FaUserFriends /> Team Details</>}>
              <Card className="shadow-sm">
                <Card.Header className="bg-dark text-white">
                  <h5 className="mb-0">
                    <FaUsers className="me-2" />
                    Team Structure
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-4">
                    <h6 className="text-success mb-3">
                      <FaCrown className="me-2" />
                      Top 2 Performers
                    </h6>
                    <Row>
                      {teamDetails.top_two_children?.map((child, index) => (
                        <Col md={6} key={child.user_id} className="mb-3">
                          <Card className="border-success h-100">
                            <Card.Body>
                              <div className="d-flex align-items-center">
                                <div className="bg-success rounded-circle p-2 me-3">
                                  <FaUserFriends className="text-white" />
                                </div>
                                <div>
                                  <h6 className="mb-1">{child.username}</h6>
                                  <p className="text-muted small mb-1">
                                    Mobile: {child.mobile}
                                  </p>
                                  <Badge bg="success">
                                    Performance: {formatArea(child.buysqrt)}
                                  </Badge>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div>
                    <h6 className="text-muted mb-3">Other Team Members</h6>
                    <div className="table-responsive">
                      <Table bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Buy SQYD</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamDetails.remaining_children?.map((child, index) => (
                            <tr key={child.user_id}>
                              <td>{index + 1}</td>
                              <td>{child.username}</td>
                              <td>{child.mobile}</td>
                              <td>
                                <Badge bg={parseFloat(child.buysqrt) > 0 ? 'info' : 'secondary'}>
                                  {formatArea(child.buysqrt)}
                                </Badge>
                              </td>
                              <td>
                                {parseFloat(child.buysqrt) > 0 ? (
                                  <Badge bg="success">Active</Badge>
                                ) : (
                                  <Badge bg="warning">Inactive</Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col> */}
      </Row>

      {/* CSS Styles */}
      <style jsx="true">{`
        .reward-tier-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .rewards-progress-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .rewards-progress-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .rewards-progress-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        .rewards-progress-container::-webkitScrollbar-thumb:hover {
          background: #555;
        }
        
        .border-gradient {
          border: 2px solid;
          border-image: linear-gradient(45deg, #007bff, #28a745) 1;
        }
      `}</style>
    </Container>
  );
};

export default LifeTimeRewardsWinnerListsDetails;