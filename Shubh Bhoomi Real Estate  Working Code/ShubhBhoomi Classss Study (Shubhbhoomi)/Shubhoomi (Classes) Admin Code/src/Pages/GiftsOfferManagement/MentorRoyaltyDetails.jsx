import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Card, Button, Badge, Accordion } from "react-bootstrap";
import { FaChevronDown, FaChevronRight, FaUserFriends, FaSitemap } from "react-icons/fa";

/* =====================
   INDIVIDUAL USER ROW
===================== */
const UserRow = ({ user, level = 0, hasChildren, isOpen, onToggle }) => {
  return (
    <tr style={{ backgroundColor: level % 2 === 0 ? '#f8f9fa' : 'white' }}>
      <td style={{ paddingLeft: level * 30 }}>
        {hasChildren && (
          <Button
            variant="link"
            onClick={onToggle}
            className="p-0 me-2"
            size="sm"
          >
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </Button>
        )}
        <span className="badge bg-secondary me-2">
          L{level + 1}
        </span>
        {hasChildren && (
          <Badge bg="info" pill>
            <FaUserFriends size={10} className="me-1" />
          </Badge>
        )}
      </td>
      <td>
        <strong>{user.username}</strong>
        {level > 0 && (
          <div className="text-muted" style={{ fontSize: '0.75em' }}>
            Level {level + 1}
          </div>
        )}
      </td>
      <td>{user.mobile}</td>
      <td>
        <Badge bg="primary">{user.buysqrt || 0}</Badge>
      </td>
      <td>
        <Badge bg="success">{user.child_area || 0}</Badge>
      </td>
      <td>
        <Badge bg="warning" text="dark">{user.required || 0}</Badge>
      </td>
    </tr>
  );
};

/* =====================
   RECURSIVE NODE COMPONENT
===================== */
const TreeNode = ({ node, level = 0, lineNumber = null }) => {
  const [open, setOpen] = useState(false);
  
  // Check if this node has Line 1 or Line 2 data
  const hasLine1 = node.line1 && (node.line1.downline || node.line1.username);
  const hasLine2 = node.line2 && (node.line2.downline || node.line2.username);
  const hasDirectDownline = node.downline && node.downline.length > 0;
  const hasAnyChildren = hasLine1 || hasLine2 || hasDirectDownline;

  return (
    <>
      {/* Main User Row */}
      <UserRow
        user={node}
        level={level}
        hasChildren={hasAnyChildren}
        isOpen={open}
        onToggle={() => setOpen(!open)}
      />

      {/* Expanded Content */}
      {open && (
        <>
          {/* Direct Downline (if exists) */}
          {hasDirectDownline && node.downline.map((child, index) => (
            <TreeNode
              key={`${node.username}_direct_${index}`}
              node={child}
              level={level + 1}
            />
          ))}

          {/* Line 1 Section */}
          {hasLine1 && (
            <tr>
              <td colSpan="6" className="p-0">
                <div style={{ paddingLeft: (level + 1) * 30 }}>
                  <div className="bg-light p-2 my-2 border-start border-3 border-primary">
                    <strong>
                      <FaSitemap className="me-2 text-primary" />
                      {node.username}'s Line 1
                    </strong>
                    <Badge bg="primary" className="ms-2">
                      {node.line1?.downline?.length || 0} members
                    </Badge>
                  </div>
                  
                  {/* Line 1's main node */}
                  {node.line1.username && (
                    <TreeNode
                      key={`${node.username}_line1_main`}
                      node={node.line1}
                      level={level + 2}
                      lineNumber={1}
                    />
                  )}
                  
                  {/* Line 1's downline */}
                  {node.line1.downline && node.line1.downline.map((child, index) => (
                    <TreeNode
                      key={`${node.username}_line1_child_${index}`}
                      node={child}
                      level={level + 2}
                    />
                  ))}
                </div>
              </td>
            </tr>
          )}

          {/* Line 2 Section */}
          {hasLine2 && (
            <tr>
              <td colSpan="6" className="p-0">
                <div style={{ paddingLeft: (level + 1) * 30 }}>
                  <div className="bg-light p-2 my-2 border-start border-3 border-success">
                    <strong>
                      <FaSitemap className="me-2 text-success" />
                      {node.username}'s Line 2
                    </strong>
                    <Badge bg="success" className="ms-2">
                      {node.line2?.downline?.length || 0} members
                    </Badge>
                  </div>
                  
                  {/* Line 2's main node */}
                  {node.line2.username && (
                    <TreeNode
                      key={`${node.username}_line2_main`}
                      node={node.line2}
                      level={level + 2}
                      lineNumber={2}
                    />
                  )}
                  
                  {/* Line 2's downline */}
                  {node.line2.downline && node.line2.downline.map((child, index) => (
                    <TreeNode
                      key={`${node.username}_line2_child_${index}`}
                      node={child}
                      level={level + 2}
                    />
                  ))}
                </div>
              </td>
            </tr>
          )}
        </>
      )}
    </>
  );
};

/* =====================
   MAIN COMPONENT
===================== */
function MentorRoyaltyDetails() {
  const { state } = useLocation();
  const userData = state?.userData;
  
  const [line1Open, setLine1Open] = useState(true);
  const [line2Open, setLine2Open] = useState(true);

  if (!userData) {
    return <p className="text-center mt-5">No data found</p>;
  }

  const breakdown = userData.breakdown_achieved_detail || {};
  
  // // Sample data structure for reference
  // const sampleDataStructure = {
  //   child1_team_detail: {
  //     username: "MainUser1",
  //     mobile: "9876543210",
  //     buysqrt: "1500",
  //     child_area: "800",
  //     required: "2000",
  //     downline: [
  //       {
  //         username: "Child1",
  //         mobile: "1111111111",
  //         buysqrt: "500",
  //         child_area: "200",
  //         required: "600",
  //         // This child can also have its own lines
  //         line1: {
  //           username: "Child1_Line1",
  //           mobile: "2222222222",
  //           buysqrt: "300",
  //           child_area: "150",
  //           required: "400",
  //           downline: [
  //             {
  //               username: "GrandChild1",
  //               mobile: "3333333333",
  //               buysqrt: "100",
  //               child_area: "50",
  //               required: "150"
  //             }
  //           ]
  //         },
  //         line2: {
  //           username: "Child1_Line2",
  //           mobile: "4444444444",
  //           buysqrt: "400",
  //           child_area: "180",
  //           required: "500"
  //         }
  //       }
  //     ],
  //     line1: {
  //       username: "Line1_Main",
  //       mobile: "5555555555",
  //       buysqrt: "1200",
  //       child_area: "600",
  //       required: "1500",
  //       downline: [
  //         {
  //           username: "Line1_Child1",
  //           mobile: "6666666666",
  //           buysqrt: "400",
  //           child_area: "200",
  //           required: "500"
  //         }
  //       ]
  //     },
  //     line2: {
  //       username: "Line2_Main",
  //       mobile: "7777777777",
  //       buysqrt: "1000",
  //       child_area: "500",
  //       required: "1200"
  //     }
  //   },
  //   child2_team_detail: {
  //     // Similar structure for Line 2
  //   }
  // };

  return (
    <div className="padding_15">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">2.1 Mentor Royalty Achievements Lists – Breakdown</h4>
          <Badge bg="info">
            <FaSitemap className="me-1" />
            Hierarchical View
          </Badge>
        </Card.Header>

        <Card.Body>
          {/* User Summary */}
          <Table bordered className="mb-4">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{userData.username}</td>
                <th>Mobile</th>
                <td>{userData.mobile}</td>
              </tr>
              <tr>
                <th>Total Buy SQYD</th>
                <td>
                  <Badge bg="primary" style={{ fontSize: '1em' }}>
                    {userData.total_buysqrt}
                  </Badge>
                </td>
                <th>Required</th>
                <td>
                  <Badge bg="warning" text="dark" style={{ fontSize: '1em' }}>
                    {userData.gift_details?.min_area_sqyd || "N/A"}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </Table>

          {/* LINE 1 */}
          <Card className="mb-4">
            <Card.Header 
              className="d-flex align-items-center justify-content-between cursor-pointer"
              onClick={() => setLine1Open(!line1Open)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center">
                {line1Open ? <FaChevronDown /> : <FaChevronRight />}
                <h5 className="mb-0 ms-2">
                  <span className="badge bg-primary me-2">Line 1</span>
                  {/* Team Structure */}
                </h5>
              </div>
              <Badge bg="light" text="dark">
                Click to {line1Open ? 'collapse' : 'expand'}
              </Badge>
            </Card.Header>
            
            {line1Open && (
              <Card.Body className="p-0">
                <Table bordered hover className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '15%' }}>Hierarchy</th>
                      <th>Username</th>
                      <th>Mobile</th>
                      <th>Buy SQYD</th>
                      <th>Child Area</th>
                      <th>Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.child1_team_detail ? (
                      <TreeNode 
                        node={breakdown.child1_team_detail} 
                        level={0} 
                        lineNumber={1}
                      />
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-3 text-danger fw-bold">
                          No data available for Line 1
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            )}
          </Card>

          {/* LINE 2 */}
          <Card>
            <Card.Header 
              className="d-flex align-items-center justify-content-between cursor-pointer"
              onClick={() => setLine2Open(!line2Open)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center">
                {line2Open ? <FaChevronDown /> : <FaChevronRight />}
                <h5 className="mb-0 ms-2">
                  <span className="badge bg-success me-2">Line 2</span>
                  {/* Team Structure */}
                </h5>
              </div>
              <Badge bg="light" text="dark">
                Click to {line2Open ? 'collapse' : 'expand'}
              </Badge>
            </Card.Header>
            
            {line2Open && (
              <Card.Body className="p-0">
                <Table bordered hover className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: '15%' }}>Hierarchy</th>
                      <th>Username</th>
                      <th>Mobile</th>
                      <th>Buy SQYD</th>
                      <th>Child Area</th>
                      <th>Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.child2_team_detail ? (
                      <TreeNode 
                        node={breakdown.child2_team_detail} 
                        level={0} 
                        lineNumber={2}
                      />
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-3">
                          No data available for Line 2
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            )}
          </Card>
        </Card.Body>
      </Card>
    </div>
  );
}

export default MentorRoyaltyDetails;