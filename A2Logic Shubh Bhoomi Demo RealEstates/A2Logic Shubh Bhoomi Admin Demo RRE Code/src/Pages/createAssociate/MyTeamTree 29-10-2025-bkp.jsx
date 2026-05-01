import React, { useState, useRef, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import Tree from "react-d3-tree";

const API_URL = process.env.REACT_APP_API_URL;

function MyTeamTree() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const [showTree, setShowTree] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const treeContainer = useRef(null);

  // 🔹 Auto-adjust container dimensions
  useEffect(() => {
    if (treeContainer.current) {
      const { width, height } = treeContainer.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, [showTree]);

  const getAuthToken = () => localStorage.getItem("token");

  // 🔹 Fetch Tree Data
  const fetchTreeData = async (e) => {
    e.preventDefault();
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
      const response = await axios.get(`${API_URL}/myteam-tree?mobile=${mobile}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "1") {
        const formattedTree = {
          name: response.data.parent_mobile,
          attributes: {
            Role: "Parent",
          },
          children: buildTreeStructure(response.data.tree || []),
        };

        setTreeData(formattedTree);
        setShowTree(true);
        
        // Auto-zoom after data load
        setTimeout(() => {
          if (treeContainer.current) {
            const { width } = treeContainer.current.getBoundingClientRect();
            setDimensions({ width, height: 800 });
          }
        }, 100);
      } else {
        Swal.fire({
          icon: "info",
          title: "No Data",
          text: response.data.message || "No data found for this number",
        });
      }
    } catch (error) {
      console.error("Tree fetch error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch tree data.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Recursive Tree Builder
  const buildTreeStructure = (nodes) =>
    nodes.map((node) => ({
      name: `${node.username} (${node.mobile})`,
      attributes: {
        Level: node.level,
        Type: node.user_type,
        Date: node.date,
        KYC: node.kyc,
      },
      children: buildTreeStructure(node.children || []),
    }));

  return (
    <div className="padding_15">
      <div className="row">
        <div className="col-md-12">
          <Card>
            <Card.Header>
              <h4>My Team Tree Structure View</h4>
            </Card.Header>

            <Card.Body>
              <form onSubmit={fetchTreeData} className="mb-4">
                <div className="row justify-content-center">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Mobile Number"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                    />
                  </div>
                  <div className="col-md-2">
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
                        "Show Tree"
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {showTree && treeData && (
                <div className="border rounded p-2 bg-light">
                  <div className="mb-3">
                    <small className="text-muted">
                      💡 Use mouse wheel to zoom, drag to pan, and click +/- to expand/collapse
                    </small>
                  </div>
                  <div
                    ref={treeContainer}
                    style={{
                      width: "100%",
                      height: "90vh",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      backgroundColor: "#fafafa",
                      overflow: "hidden",
                    }}
                  >
                    <Tree
                      data={treeData}
                      orientation="vertical" // Change to "horizontal" for horizontal layout
                      translate={{
                        x: dimensions.width / 3,
                        y: dimensions.height / 8
                      }}
                      zoomable={false}
                      scaleExtent={{ min: 0.1, max: 2 }} // Better zoom range
                      draggable={true}
                      pathFunc="step"
                      collapsible={true}
                      separation={{ siblings: 1.5, nonSiblings: 2 }}
                      nodeSize={{ x: 200, y: 120 }}
                      initialDepth={2} // Auto expand first 2 levels
                      renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
                        <g>
                          <rect
                            width="180"
                            height="80"
                            x="-90"
                            y="-40"
                            rx="10"
                            ry="10"
                            fill={nodeDatum.attributes?.Type === "channel" ? "#fff3cd" : "#d1ecf1"}
                            stroke="#555"
                            strokeWidth="1.5"
                          />
                          <text 
                            x="0" 
                            y="-20" 
                            textAnchor="middle" 
                            style={{ 
                              fontSize: "12px", 
                              fontWeight: "bold",
                              pointerEvents: "none"
                            }}
                          >
                            {nodeDatum.name}
                          </text>
                          <text 
                            x="0" 
                            y="0" 
                            textAnchor="middle" 
                            style={{ 
                              fontSize: "11px", 
                              fill: "#333",
                              pointerEvents: "none"
                            }}
                          >
                            Level: {nodeDatum.attributes?.Level}
                          </text>
                          <text 
                            x="0" 
                            y="15" 
                            textAnchor="middle" 
                            style={{ 
                              fontSize: "10px", 
                              fill: "#333",
                              pointerEvents: "none"
                            }}
                          >
                            Type: {nodeDatum.attributes?.Type}
                          </text>

                          {nodeDatum.children && nodeDatum.children.length > 0 && (
                            <g
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNode();
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <circle cx="0" cy="35" r="8" fill="#007bff" stroke="#333" strokeWidth="1" />
                              <text
                                x="0"
                                y="38"
                                textAnchor="middle"
                                style={{ fontSize: "10px", fontWeight: "bold", fill: "#fff" }}
                              >
                                {nodeDatum.__rd3t.collapsed ? "+" : "−"}
                              </text>
                            </g>
                          )}
                        </g>
                      )}
                      styles={{
                        links: { 
                          stroke: "#555", 
                          strokeWidth: 1.5,
                          strokeLinecap: "round"
                        },
                      }}
                    />
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