import React, { useEffect, useState } from "react";
import { Table, Spinner, Card, Accordion, Badge } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function MyTeamTree() {
  const [mobile, setMobile] = useState("");
  const [associateName, setAssociateName] = useState("");
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const [showTree, setShowTree] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");

  // Associate name check effect
  useEffect(() => {
    const fetchAssociateName = async () => {
      if (mobile.length === 10) {
        setChecking(true);
        setAssociateName("");

        try {
          const token = getAuthToken();
          if (!token) {
            Swal.fire({
              icon: "error",
              title: "Authentication Error",
              text: "Authentication token not found. Please log in again.",
            });
            setChecking(false);
            return;
          }

          const payload = {
            parentid: mobile,
            type: "associate",
          };

          const response = await fetch(`${API_URL}/check-parentid-name`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (response.ok && data.status === "1" && data.data?.username) {
            setAssociateName(data.data.username);
          } else {
            setAssociateName("");
          }
        } catch (error) {
          console.error("Error fetching associate name:", error);
          setAssociateName("");
        } finally {
          setChecking(false);
        }
      } else {
        setAssociateName("");
      }
    };

    fetchAssociateName();
  }, [mobile]);

  // Fetch tree data
  const fetchTreeData = async (e) => {
    if (e) e.preventDefault();

    if (!mobile) {
      Swal.fire({
        icon: "warning",
        title: "Missing Input",
        text: "Please enter a mobile number",
      });
      return;
    }

    setLoading(true);
    setShowTree(false);
    setTreeData(null);

    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/myteam-tree?mobile=${mobile}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "1") {
        setTreeData(response.data);
        setShowTree(true);
      } else {
        Swal.fire({
          icon: "info",
          title: "Sorry!",
          text: response.data.message || "No data found",
        });
      }
    } catch (error) {
      console.error("Error fetching tree data:", error);
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "No data found, please try another.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Recursive component to render tree
  const TreeNode = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(level < 2); // Auto-expand first 2 levels

    const getKycBadge = (kycStatus) => {
      const variants = {
        success: "success",
        pending: "warning",
        failed: "danger"
      };
      return (
        <Badge bg={variants[kycStatus] || "secondary"} className="ms-2">
          {kycStatus.toUpperCase()}
        </Badge>
      );
    };

    const getUserTypeBadge = (userType) => {
      const variants = {
        associate: "primary",
        channel: "info"
      };
      return (
        <Badge bg={variants[userType] || "secondary"} className="ms-2">
          {userType.toUpperCase()}
        </Badge>
      );
    };

    return (
      <div className="tree-node" style={{ marginLeft: level * 20 }}>
        <div 
          className={`tree-item d-flex justify-content-between align-items-center p-2 mb-1 ${level === 0 ? 'bg-light rounded' : ''}`}
        >
          <div className="d-flex align-items-center">
            {node.children && node.children.length > 0 && (
              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '25px', height: '25px', padding: 0 }}
              >
                {isOpen ? '−' : '+'}
              </button>
            )}
            <div>
              <strong>{node.username}</strong>
              <small className="text-muted d-block">Mobile: {node.mobile}</small>
              <small className="text-muted d-block">
                Level: {node.level} | Date: {node.date}
                {getKycBadge(node.kyc)}
                {getUserTypeBadge(node.user_type)}
              </small>
            </div>
          </div>
          <div className="text-end">
            <small className="text-muted">ID: {node.id}</small>
          </div>
        </div>
        
        {isOpen && node.children && node.children.length > 0 && (
          <div className="tree-children">
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Alternative table view component
  const TreeTableView = ({ tree }) => {
    const flattenTree = (nodes, level = 0) => {
      let flatList = [];
      nodes.forEach(node => {
        flatList.push({ ...node, level });
        if (node.children && node.children.length > 0) {
          flatList = [...flatList, ...flattenTree(node.children, level + 1)];
        }
      });
      return flatList;
    };

    const flatData = flattenTree(tree);

    return (
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Level</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>User Type</th>
              <th>KYC Status</th>
              <th>Join Date</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {flatData.map((item, index) => (
              <tr key={index} style={{ background: `rgba(0,0,0,${item.level * 0.03})` }}>
                <td>
                  <Badge bg="secondary">L{item.level}</Badge>
                </td>
                <td>
                  {"-".repeat(item.level)} {item.username}
                </td>
                <td>{item.mobile}</td>
                <td>
                  <Badge bg={item.user_type === 'associate' ? 'primary' : 'info'}>
                    {item.user_type}
                  </Badge>
                </td>
                <td>
                  <Badge bg={item.kyc === 'success' ? 'success' : 'warning'}>
                    {item.kyc}
                  </Badge>
                </td>
                <td>{item.date}</td>
                <td>{item.id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <div className="padding_15">
      <div className="row">
        <div className="col-md-12">
          <Card>
            <Card.Header>
              <h4 className="mb-0">My Team Tree</h4>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <Card>
                    <Card.Body>
                      <form onSubmit={fetchTreeData}>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Enter Mobile Number</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Mobile Number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            maxLength="10"
                          />
                        </div>
                        
                        <div className="text-center mb-3">
                          {checking && (
                            <p style={{ color: "gray", marginBottom: "10px" }}>
                              <Spinner animation="border" size="sm" /> Checking associate name...
                            </p>
                          )}
                          {associateName && (
                            <p style={{ color: "green", fontWeight: "bold", marginBottom: "10px" }}>
                              ✓ Name: {associateName}
                            </p>
                          )}
                        </div>

                        <div className="submitbutton">
                          <button 
                            type="submit" 
                            className="btn btn-primary w-100"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Spinner animation="border" size="sm" /> Loading...
                              </>
                            ) : (
                              'Show Tree'
                            )}
                          </button>
                        </div>
                      </form>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* Tree Display Section */}
              {showTree && treeData && (
                <div className="row mt-4">
                  <div className="col-md-12">
                    <Card>
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          Team Tree for: {treeData.parent_mobile}
                          {associateName && ` (${associateName})`}
                        </h5>
                        <Badge bg="info">
                          Total Members: {treeData.tree.reduce((count, node) => {
                            const countNodes = (n) => 1 + (n.children ? n.children.reduce((sum, child) => sum + countNodes(child), 0) : 0);
                            return count + countNodes(node);
                          }, 0)}
                        </Badge>
                      </Card.Header>
                      <Card.Body>
                        {/* Tree View */}
                        <div className="mb-4">
                          <h6>Tree Structure View:</h6>
                          <div className="tree-container border rounded p-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {treeData.tree.map((node, index) => (
                              <TreeNode key={index} node={node} />
                            ))}
                          </div>
                        </div>

                        {/* Table View */}
                        <div>
                          <h6>Table View:</h6>
                          <TreeTableView tree={treeData.tree} />
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MyTeamTree;