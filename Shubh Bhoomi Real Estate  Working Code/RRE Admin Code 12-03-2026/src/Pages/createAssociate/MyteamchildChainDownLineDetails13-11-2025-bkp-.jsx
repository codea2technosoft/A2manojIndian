import React, { useState, useEffect } from "react";
import { Card, Badge, Spinner, Button, Accordion } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function MyTeamChildChainDownLineDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [downlineData, setDownlineData] = useState(null);
  const [selectedMobile, setSelectedMobile] = useState("");

  const getAuthToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchDownlineData = async () => {
      const urlParams = new URLSearchParams(location.search);
      const mobile = urlParams.get('mobile');

      if (!mobile) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Mobile number not provided",
        });
        navigate(-1);
        return;
      }

      setSelectedMobile(mobile);
      setLoading(true);

      try {
        const token = getAuthToken();
        const response = await axios.get(
          `${API_URL}/myteam-child-chain-down-line-details?mobile=${mobile}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "1") {
          setDownlineData(response.data);
        } else {
          Swal.fire({
            icon: "info",
            title: "No Data",
            text: response.data.message || "No downline data found",
          });
        }
      } catch (error) {
        console.error("Error fetching downline data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch downline data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDownlineData();
  }, [location, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  // Tree Node Component
  const TreeNode = ({ node, level = 0 }) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div className="tree-node">
        {/* Connector Line */}
        {level > 0 && (
          <div className="tree-connector"></div>
        )}
        
        {/* Node Content */}
        <div className={`node-content level-${level}`}>
          <div className="node-card">
            <div className="node-header">
              <strong>{node.username}</strong>
              <Badge bg="secondary">L{node.level}</Badge>
            </div>
            <div className="node-details">
              <div>📱 {node.mobile}</div>
              <div>
                <Badge bg="primary">{node.user_type}</Badge>
                {node.area && (
                  <Badge bg="success" className="ms-1">Area: {node.area}</Badge>
                )}
              </div>
              {node.date && (
                <div className="small">Joined: {node.date}</div>
              )}
              {node.kyc && (
                <div>
                  <Badge bg={node.kyc === 'success' ? 'success' : 'warning'}>
                    KYC: {node.kyc}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Children */}
        {hasChildren && (
          <div className="tree-children">
            {node.children.map((child, index) => (
              <TreeNode key={child.id || index} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Tree View Component
  const TreeView = ({ tree }) => {
    return (
      <div className="tree-container">
        <div className="tree">
          <TreeNode node={tree} />
        </div>
      </div>
    );
  };

  // Line Summary Component
  const LineSummary = ({ line }) => {
    return (
      <Accordion.Item eventKey={line.line_number.toString()}>
        <Accordion.Header>
          <div className="d-flex justify-content-between align-items-center w-100 me-3">
            <div>
              <strong>
                {line.line_number === "Others" ? "Other Lines" : `Line ${line.line_number}`}
              </strong>
              {line.root_user && (
                <span className="ms-2">
                  - {line.root_user.username} ({line.root_user.mobile})
                </span>
              )}
            </div>
            <div>
              <Badge bg="primary" className="me-2">Area: {line.total_area}</Badge>
              <Badge bg="success">Members: {line.total_members}</Badge>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          {line.tree ? (
            <TreeView tree={line.tree} />
          ) : line.other_lines_summary ? (
            <div>
              <h6>Other Lines Summary:</h6>
              {line.other_lines_summary.map((otherLine, index) => (
                <Card key={index} className="mb-3">
                  <Card.Header className="bg-secondary text-white">
                    <strong>{otherLine.root_username}</strong> (📱 {otherLine.root_mobile})
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                      <Badge bg="primary">Area: {otherLine.area}</Badge>
                      <Badge bg="success">Members: {otherLine.members}</Badge>
                    </div>
                    <div className="text-center p-3 bg-light rounded">
                      <div className="simple-tree">
                        <div className="root-node p-3 bg-primary text-white rounded mb-2">
                          <strong>Root</strong>
                          <div>{otherLine.root_username}</div>
                          <div className="small">📱 {otherLine.root_mobile}</div>
                        </div>
                        <div className="tree-branches">
                          <div className="branch left-branch">
                            <div className="branch-label">Left Side</div>
                            <div className="node-count bg-info text-white p-2 rounded">
                              ~{Math.floor(otherLine.members / 2)} members
                            </div>
                          </div>
                          <div className="branch right-branch">
                            <div className="branch-label">Right Side</div>
                            <div className="node-count bg-warning text-dark p-2 rounded">
                              ~{Math.ceil(otherLine.members / 2)} members
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : null}
        </Accordion.Body>
      </Accordion.Item>
    );
  };

  if (loading) {
    return (
      <div className="padding_15">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Loading tree structure for {selectedMobile}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="padding_15">
      <style>
        {`
          .tree-container {
            overflow-x: auto;
            padding: 20px;
          }

          .tree {
            display: inline-block;
            min-width: 100%;
          }

          .tree-node {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            margin: 10px 5px;
          }

          .tree-connector {
            width: 2px;
            height: 20px;
            background: linear-gradient(to bottom, #007bff, #28a745);
            margin-bottom: 5px;
          }

          .node-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .node-card {
            background: white;
            border: 2px solid #007bff;
            border-radius: 10px;
            padding: 12px;
            min-width: 220px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            text-align: center;
          }

          .node-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            border-color: #28a745;
          }

          .node-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .node-details {
            font-size: 0.85rem;
          }

          .node-details > div {
            margin-bottom: 4px;
          }

          .tree-children {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
            position: relative;
          }

          .tree-children::before {
            content: '';
            position: absolute;
            top: -10px;
            left: 50%;
            width: 80%;
            height: 2px;
            background: linear-gradient(to right, #007bff, #28a745);
            transform: translateX(-50%);
          }

          /* Level-based styling */
          .level-0 .node-card {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            border-width: 3px;
          }

          .level-1 .node-card {
            background: linear-gradient(135deg, #28a745, #1e7e34);
            color: white;
          }

          .level-2 .node-card {
            background: linear-gradient(135deg, #6f42c1, #5a2d9c);
            color: white;
          }

          .level-3 .node-card {
            background: linear-gradient(135deg, #e83e8c, #d91a72);
            color: white;
          }

          .level-4 .node-card {
            background: linear-gradient(135deg, #fd7e14, #e55a00);
            color: white;
          }

          /* Simple tree for others */
          .simple-tree {
            max-width: 400px;
            margin: 0 auto;
          }

          .root-node {
            max-width: 200px;
            margin: 0 auto 20px auto;
          }

          .tree-branches {
            display: flex;
            justify-content: space-around;
            gap: 20px;
          }

          .branch {
            text-align: center;
            flex: 1;
          }

          .branch-label {
            font-weight: bold;
            margin-bottom: 5px;
            color: #6c757d;
          }

          .node-count {
            max-width: 120px;
            margin: 0 auto;
          }

          .left-branch .node-count {
            background: linear-gradient(135deg, #17a2b8, #138496) !important;
            color: white !important;
          }

          .right-branch .node-count {
            background: linear-gradient(135deg, #ffc107, #e0a800) !important;
          }

          /* Responsive design */
          @media (max-width: 768px) {
            .tree-children {
              flex-direction: column;
              align-items: center;
            }
            
            .tree-branches {
              flex-direction: column;
              gap: 10px;
            }
            
            .node-card {
              min-width: 180px;
              padding: 8px;
            }
          }
        `}
      </style>

      <div className="row">
        <div className="col-md-12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <Button variant="outline-secondary" onClick={handleBack} className="me-3">
                  ← Back to Upline Chain
                </Button>
                <h4 className="mb-0 d-inline">My Team’s Child Chain Downline Details</h4>
              </div>
              <div className="text-end">
                <Badge bg="primary" className="fs-6">Mobile: {selectedMobile}</Badge>
                {downlineData?.parent_mobile && (
                  <div className="small text-muted">Parent: {downlineData.parent_mobile}</div>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {downlineData ? (
                <div>
                  {/* Summary Cards */}
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <Card className="bg-primary text-white">
                        <Card.Body className="text-center">
                          <h5>Active Lines</h5>
                          <h3>{downlineData.total_active_lines || 0}</h3>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-3">
                      <Card className="bg-success text-white">
                        <Card.Body className="text-center">
                          <h5>Total Members</h5>
                          <h3>
                            {downlineData.summary?.reduce((total, line) => total + (line.total_members || 0), 0) || 0}
                          </h3>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-3">
                      <Card className="bg-info text-white">
                        <Card.Body className="text-center">
                          <h5>Total Area</h5>
                          <h3>
                            {downlineData.summary?.reduce((total, line) => total + (line.total_area || 0), 0) || 0}
                          </h3>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-3">
                      <Card className="bg-warning text-dark">
                        <Card.Body className="text-center">
                          <h5>Total Lines</h5>
                          <h3>{downlineData.summary?.length || 0}</h3>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>

                  {/* Tree Legend */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h6 className="mb-0">Tree Color Legend</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="row text-center">
                        <div className="col-md-2">
                          <div className="legend-color bg-primary p-2 rounded text-white">Level 0</div>
                        </div>
                        <div className="col-md-2">
                          <div className="legend-color bg-success p-2 rounded text-white">Level 1</div>
                        </div>
                        <div className="col-md-2">
                          <div className="legend-color bg-purple p-2 rounded text-white">Level 2</div>
                        </div>
                        <div className="col-md-2">
                          <div className="legend-color bg-pink p-2 rounded text-white">Level 3</div>
                        </div>
                        <div className="col-md-2">
                          <div className="legend-color bg-orange p-2 rounded text-white">Level 4+</div>
                        </div>
                      </div>
                      <style>
                        {`
                          .bg-purple { background-color: #6f42c1 !important; }
                          .bg-pink { background-color: #e83e8c !important; }
                          .bg-orange { background-color: #fd7e14 !important; }
                        `}
                      </style>
                    </Card.Body>
                  </Card>

                  {/* Tree View Accordion */}
                  <Card>
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">{downlineData.message}</h5>
                    </Card.Header>
                    <Card.Body>
                      <Accordion defaultActiveKey={["0", "1"]} alwaysOpen>
                        {downlineData.summary?.map((line, index) => (
                          <LineSummary key={index} line={line} />
                        ))}
                      </Accordion>
                    </Card.Body>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>No downline data available for this user</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MyTeamChildChainDownLineDetails;