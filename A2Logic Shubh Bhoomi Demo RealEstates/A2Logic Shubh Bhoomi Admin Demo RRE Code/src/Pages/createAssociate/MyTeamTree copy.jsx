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
  const treeContainer = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1.5);

  const getAuthToken = () => localStorage.getItem("token");

  // ✅ Responsive Dimensions
  useEffect(() => {
    const updateSize = () => {
      if (treeContainer.current) {
        const { width, height } = treeContainer.current.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 500) });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [showTree]);

  // ✅ Auto Zoom Fit
  useEffect(() => {
    if (showTree && treeContainer.current && treeData) {
      setTimeout(() => {
        const { width, height } = treeContainer.current.getBoundingClientRect();
        const treeWidth = 400;
        const treeHeight = 600;
        const scaleX = (width * 0.9) / treeWidth;
        const scaleY = (height * 0.9) / treeHeight;
        const autoZoom = Math.min(scaleX, scaleY, 1);
        setZoom(autoZoom);
      }, 200);
    }
  }, [showTree, treeData]);

  // ✅ Fetch Tree Data
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
    setZoom(1);

    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/myteam-tree?mobile=${mobile}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "1") {
        const formattedTree = {
          name: response.data.parent_mobile,
          attributes: { Role: "Parent" },
          children: buildTreeStructure(response.data.tree || []),
        };
        setTreeData(formattedTree);
        setShowTree(true);
      } else {
        Swal.fire({
          icon: "info",
          title: "No Data",
          text: response.data.message || "No data found",
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

  // ✅ Build Tree
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
      <div className="row justify-content-center">
        <div className="col-12 col-md-12">
          <Card>
            <Card.Header>
              <h4 className="mb-0 text-center">My Team Tree</h4>
            </Card.Header>
            <Card.Body className="p-3">
              {/* 🔹 Input Form */}
              <form onSubmit={fetchTreeData} className="mb-3">
                <div className="row g-2 justify-content-center">
                  <div className="col-8 col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Mobile Number"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                    />
                  </div>
                  <div className="col-4 col-md-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm w-100"
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : "Show"}
                    </button>
                  </div>
                </div>
              </form>

              {/* 🔹 Tree Section */}
              {showTree && treeData && (
                <div className="border rounded bg-light p-2 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">
                      Pinch to zoom • Drag to move • Tap +/- to expand
                    </small>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-info text-white btn-sm"
                        style={{
                          borderRadius: "50%",
                          width: "36px",
                          height: "36px",
                          fontWeight: "bold",
                        }}
                        onClick={() => setZoom((prev) => Math.min(prev + 0.2, 2))}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{
                          borderRadius: "50%",
                          width: "36px",
                          height: "36px",
                          fontWeight: "bold",
                        }}
                        onClick={() => setZoom((prev) => Math.max(prev - 0.2, 0.4))}
                      >
                        −
                      </button>
                    </div>
                  </div>

                  {/* 🔹 Tree Container with Scrollbar */}
                  <div
                    ref={treeContainer}
                    style={{
                       width: "100%",
    height: "70vh",
    minHeight: "400px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    overflow: "auto",          // ✅ scroll enable
    overflowX: "auto",         // ✅ horizontal scroll
    overflowY: "auto",         // ✅ vertical scroll
    touchAction: "pan-x pan-y pinch-zoom",
    position: "relative", 
                    }}
                    className="custom-scrollbar"
                  >
                    <Tree
                      data={treeData}
                      orientation="vertical"
                      translate={{
                        x: dimensions.width / 2,
                        y: 80,
                      }}
                      zoom={zoom}
                      zoomable={false}
                      scaleExtent={{ min: 0.4, max: 2 }}
                      separation={{ siblings: 1.2, nonSiblings: 1.8 }}
                      nodeSize={{
                        x: window.innerWidth < 768 ? 180 : 220,
                        y: window.innerWidth < 768 ? 120 : 140,
                      }}
                      pathFunc="step"
                      collapsible={true}
                      initialDepth={1}
                      styles={{
                        links: { stroke: "#aaa", strokeWidth: 2 },
                        nodes: { node: { padding: 10 } },
                      }}
                      renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
                        const clipId = `clip-${Math.random()
                          .toString(36)
                          .substr(2, 5)}`;
                        const isChannel =
                          nodeDatum.attributes?.Type === "channel";

                        return (
                          <g>
                            <defs>
                              <clipPath id={clipId}>
                                <rect
                                  x="-95"
                                  y="-45"
                                  width="190"
                                  height="90"
                                  rx="10"
                                />
                              </clipPath>
                            </defs>

                            <rect
                              width="200"
                              height="100"
                              x="-100"
                              y="-50"
                              rx="12"
                              fill={isChannel ? "#fff3cd" : "#d1ecf1"}
                              stroke="#555"
                              strokeWidth="1.5"
                            />

                            <g clipPath={`url(#${clipId})`}>
                              <text
                                x="0"
                                y="-25"
                                textAnchor="middle"
                                fontSize={
                                  window.innerWidth < 768 ? "11" : "13"
                                }
                                fontWeight="bold"
                                fill="#333"
                                stroke="none"
                              >
                                {nodeDatum.name}
                              </text>
                              <text
                                x="0"
                                y="-5"
                                textAnchor="middle"
                                fontSize={
                                  window.innerWidth < 768 ? "10" : "11"
                                }
                                fill="#555"
                                stroke="none"
                              >
                                Level: {nodeDatum.attributes?.Level}
                              </text>
                              <text
                                x="0"
                                y="12"
                                textAnchor="middle"
                                fontSize={
                                  window.innerWidth < 768 ? "10" : "11"
                                }
                                fill="#555"
                                stroke="none"
                              >
                                {nodeDatum.attributes?.Type}
                              </text>
                            </g>

                            {nodeDatum.children?.length > 0 && (
                              <g
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleNode();
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <circle
                                  cx="0"
                                  cy="45"
                                  r="10"
                                  fill="#007bff"
                                  stroke="#333"
                                  strokeWidth="1"
                                />
                                <text
                                  x="0"
                                  y="49"
                                  textAnchor="middle"
                                  fontSize="14"
                                  fill="white"
                                  fontWeight="bold"
                                  stroke="none"
                                >
                                  {nodeDatum.__rd3t?.collapsed ? "+" : "-"}
                                </text>
                              </g>
                            )}
                          </g>
                        );
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
