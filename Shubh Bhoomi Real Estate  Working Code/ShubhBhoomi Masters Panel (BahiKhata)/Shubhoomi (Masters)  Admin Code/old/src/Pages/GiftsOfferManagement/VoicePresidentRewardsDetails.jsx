import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table, Card, Button, Badge, Row, Col } from "react-bootstrap";
import { FaChevronDown, FaChevronRight, FaUserFriends, FaSitemap, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

/* =====================
   INDIVIDUAL USER ROW
===================== */
const UserRow = ({ user, level = 0, hasChildren, isOpen, onToggle, isMainUser = false, relationship = "" }) => {
  return (
    <tr style={{ 
      backgroundColor: isMainUser ? '#e3f2fd' : (level % 2 === 0 ? '#f8f9fa' : 'white'),
      borderLeft: isMainUser ? '4px solid #0d6efd' : 'none'
    }}>
      <td style={{ paddingLeft: level * 30 }}>
        {hasChildren && (
          <Button
            variant="link"
            onClick={onToggle}
            className="p-0 me-2 text-dark"
            size="sm"
          >
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </Button>
        )}
        <span className={`badge ${isMainUser ? 'bg-primary' : 'bg-secondary'} me-2`}>
          {isMainUser ? 'MAIN' : `L${level}`}
        </span>
        {relationship && (
          <Badge bg="info" className="me-1">
            {relationship === "direct_child" ? "Direct" : 
             relationship === "descendant" ? "Desc" : relationship}
          </Badge>
        )}
        {hasChildren && (
          <Badge bg="dark" pill>
            <FaUserFriends size={10} className="me-1" />
          </Badge>
        )}
      </td>
      <td>
        <strong>{user.username}</strong>
        {level > 0 && (
          <div className="text-muted" style={{ fontSize: '0.75em' }}>
            Level {level}
          </div>
        )}
      </td>
      <td>{user.mobile}</td>
      <td>
        <Badge bg="primary">{user.buysqrt || "0.00"}</Badge>
      </td>
      <td>
        <Badge bg="success">{user.child_area || user.self_area || "0.00"}</Badge>
      </td>
      <td>
        <Badge bg="warning" text="dark">{user.required || "0.00"}</Badge>
      </td>
    </tr>
  );
};

/* =====================
   BUILD HIERARCHICAL STRUCTURE
===================== */
const buildHierarchy = (users) => {
  if (!users || users.length === 0) return [];
  
  // Create a map of users by id
  const userMap = {};
  const roots = [];
  
  // First pass: create map with children array
  users.forEach(user => {
    userMap[user.id] = { ...user, children: [] };
  });
  
  // Second pass: build tree based on parent_id
  users.forEach(user => {
    if (user.parent_id) {
      // Find parent by mobile (since parent_id is mobile in your data)
      const parent = Object.values(userMap).find(u => u.mobile === user.parent_id);
      if (parent) {
        parent.children.push(userMap[user.id]);
      } else {
        // If parent not found, add as root
        roots.push(userMap[user.id]);
      }
    } else {
      roots.push(userMap[user.id]);
    }
  });
  
  return roots;
};

/* =====================
   TREE NODE COMPONENT
===================== */
const TreeNode = ({ node, level = 0 }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <>
      <UserRow
        user={node}
        level={level}
        hasChildren={hasChildren}
        isOpen={open}
        onToggle={() => setOpen(!open)}
        relationship={node.relationship}
      />
      
      {open && hasChildren && (
        <>
          {node.children.map((child, index) => (
            <TreeNode
              key={child.id || index}
              node={child}
              level={level + 1}
            />
          ))}
        </>
      )}
    </>
  );
};

/* =====================
   CONTRIBUTING USERS COMPONENT WITH TREE STRUCTURE
===================== */
const ContributingUsers = ({ users, title, level = 0, lineNumber = null }) => {
  const [open, setOpen] = useState(false);
  const [hierarchicalUsers, setHierarchicalUsers] = useState([]);

  useEffect(() => {
    if (users && users.length > 0) {
      const hierarchy = buildHierarchy(users);
      setHierarchicalUsers(hierarchy);
    }
  }, [users]);

  const hasUsers = users && users.length > 0;

  if (!hasUsers) return null;

  return (
    <>
      <tr>
        <td colSpan="6" className="p-0">
          <div style={{ paddingLeft: (level) * 30 }}>
            <div 
              className="bg-light p-2 my-2 border-start border-3 border-secondary cursor-pointer"
              onClick={() => setOpen(!open)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center">
                {open ? <FaChevronDown /> : <FaChevronRight />}
                <strong className="ms-2">
                  <FaUserFriends className="me-2" />
                  {title}
                </strong>
                <Badge bg="secondary" className="ms-2">
                  {users.length} users
                </Badge>
              </div>
            </div>
            
            {open && hierarchicalUsers.length > 0 && (
              <Table bordered hover className="mb-0 mt-2">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '15%' }}>Hierarchy</th>
                    <th>Username</th>
                    <th>Mobile</th>
                    <th>Buy SQFT</th>
                    <th>Child Area</th>
                    <th>Required</th>
                  </tr>
                </thead>
                <tbody>
                  {hierarchicalUsers.map((user, index) => (
                    <TreeNode
                      key={user.id || index}
                      node={user}
                      level={0}
                    />
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

/* =====================
   TEAM DETAIL COMPONENT
===================== */
const TeamDetail = ({ teamDetail, title, lineNumber, level = 0, totalArea, requiredArea }) => {
  const [open, setOpen] = useState(true);
  
  if (!teamDetail) return null;

  const hasContributingUsers = teamDetail.all_contributing_users && teamDetail.all_contributing_users.length > 0;
  
  return (
    <Card className="mb-4">
      <Card.Header 
        className="d-flex align-items-center justify-content-between cursor-pointer"
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer' }}
      >
        <div className="d-flex align-items-center">
          {open ? <FaChevronDown /> : <FaChevronRight />}
          <h5 className="mb-0 ms-2">
            <span className={`badge ${lineNumber === 1 ? 'bg-primary' : 'bg-success'} me-2`}>
              {title}
            </span>
            {teamDetail.username}
          </h5>
        </div>
        <div className="d-flex align-items-center">
          <div className="me-3">
            <Badge bg="success" className="me-1">
              Achieved: {teamDetail.child_area || teamDetail.buysqrt || "0.00"}
            </Badge>
            <Badge bg="warning" text="dark" className="me-1">
              Required: {requiredArea || teamDetail.required || "0.00"}
            </Badge>
          </div>
        </div>
      </Card.Header>
      
      {open && (
        <Card.Body className="p-0">
          <Table bordered hover className="mb-0">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '15%' }}>Hierarchy</th>
                <th>Username</th>
                <th>Mobile</th>
                <th>Buy SQFT</th>
                <th>Child/Self Area</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              <UserRow
                user={teamDetail}
                level={level}
                hasChildren={hasContributingUsers}
                isOpen={false}
                onToggle={() => {}}
                relationship="main"
              />
              
              {/* Contributing Users in Tree Structure */}
              {hasContributingUsers && (
                <ContributingUsers
                  users={teamDetail.all_contributing_users}
                  title={`All Contributing Users (${teamDetail.all_contributing_users.length})`}
                  level={level + 1}
                  lineNumber={lineNumber}
                />
              )}
            </tbody>
          </Table>
        </Card.Body>
      )}
    </Card>
  );
};

/* =====================
   MAIN COMPONENT
===================== */
function VoicePresidentRewardsDetails() {
  const { state } = useLocation();
  const userData = state?.userData;
  
  if (!userData) {
    return <p className="text-center mt-5">No data found</p>;
  }

  const breakdown = userData.breakdown_achieved_detail || {};
  const giftDetails = userData.gift_details || {};
  const eligibility = userData.eligibility_check || {};
  const summary = userData.all_contributing_users_summary || {};

  // Calculate overall eligibility
  const isEligible = 
    eligibility.total_buysqrt_check && 
    eligibility.max_area_check && 
    eligibility.child1_check && 
    eligibility.child2_check && 
    eligibility.self_remaining_check;

  return (
    <div className="padding_15">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Vice President Rewards Achievements – Breakdown</h4>
          <Badge bg={isEligible ? "success" : "danger"} className="px-3 py-2">
            {isEligible ? (
              <>
                <FaCheckCircle className="me-2" />
                ELIGIBLE
              </>
            ) : (
              <>
                <FaTimesCircle className="me-2" />
                NOT ELIGIBLE
              </>
            )}
          </Badge>
        </Card.Header>

        <Card.Body>
          {/* User Summary */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">User Information</h5>
                  <Badge bg="primary">Level {userData.hierarchy_level}</Badge>
                </Card.Header>
                <Card.Body>
                  <Table borderless>
                    <tbody>
                      <tr>
                        <th>Username:</th>
                        <td>
                          <strong>{userData.username}</strong>
                        </td>
                      </tr>
                      <tr>
                        <th>Mobile:</th>
                        <td>{userData.mobile}</td>
                      </tr>
                      <tr>
                        <th>Total Buy SQFT:</th>
                        <td>
                          <Badge bg="primary" style={{ fontSize: '1em' }}>
                            {userData.total_buysqrt}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="h-100">
                <Card.Header>
                  <h5 className="mb-0">Reward Details</h5>
                </Card.Header>
                <Card.Body>
                  {giftDetails ? (
                    <>
                      <div className="mb-2">
                        <strong>Offer Name:</strong> {giftDetails.offer_name}
                      </div>
                      <div className="mb-2">
                        <strong>Offer Item:</strong> {giftDetails.offer_item}
                      </div>
                      <div className="mb-2">
                        <strong>Item Amount:</strong> 
                        <div className="text-muted small">
                          {giftDetails.item_amount}
                        </div>
                      </div>
                      <div className="mb-2">
                        <strong>Area Range:</strong> 
                        <Badge bg="warning" className="ms-2">
                          {giftDetails.min_area_sqyd} - {giftDetails.max_area_sqyd} SQYD
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted">No reward details available</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Team Structure Details */}
          <Card>
            <Card.Header className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0">
                <FaSitemap className="me-2" />
                Team Structure Details
              </h5>
              <div>
                <Badge bg="info" className="me-2">
                  Total Users: {summary.total_users || 0}
                </Badge>
                <Badge bg="primary" className="me-2">
                  Line 1: {summary.child1_users || 0}
                </Badge>
                <Badge bg="success" className="me-2">
                  Line 2: {summary.child2_users || 0}
                </Badge>
                <Badge bg="warning">
                  Self: {summary.self_remaining_users || 0}
                </Badge>
              </div>
            </Card.Header>
            
            <Card.Body>
              {/* Line 1 Team */}
              <TeamDetail
                teamDetail={breakdown.child1_team_detail}
                title="Line 1 Team"
                lineNumber={1}
                level={1}
              />

              {/* Line 2 Team */}
              <TeamDetail
                teamDetail={breakdown.child2_team_detail}
                title="Line 2 Team"
                lineNumber={2}
                level={1}
              />

              {/* Self & Remaining Team */}
              <TeamDetail
                teamDetail={breakdown.self_and_remaining_detail?.self}
                title="Self & Remaining Team"
                lineNumber={3}
                level={1}
              />
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </div>
  );
}

export default VoicePresidentRewardsDetails;