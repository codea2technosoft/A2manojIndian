import React, { useState, useEffect, useRef } from "react";
import { Card, Badge, Spinner, Button, Accordion } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

function MyTeamChildChainDownLineDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [downlineData, setDownlineData] = useState(null);
  const [selectedMobile, setSelectedMobile] = useState("");
  const [lineStates, setLineStates] = useState({}); // CHANGED: single state for all lines

  const getAuthToken = () => localStorage.getItem("token");

  /* ------------------------------------------------------------------ */
  /*  FETCH DATA & INITIALIZE ALL LINES                               */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchDownlineData = async () => {
      const urlParams = new URLSearchParams(location.search);
      const mobile = urlParams.get("mobile");

      if (!mobile) {
        Swal.fire({ icon: "error", title: "Error", text: "Mobile number not provided" });
        navigate(-1);
        return;
      }

      setSelectedMobile(mobile);
      setLoading(true);

      try {
        const token = getAuthToken();
        const response = await axios.get(
          `${API_URL}/myteam-child-chain-down-line-details?mobile=${mobile}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.status === "1") {
          const data = response.data;
          const initialLineStates = {};

          // Process all lines (Line 1, Line 2, Other lines)
          data.summary?.forEach(line => {
            if (line.tree && line.root_user?.mobile) {
              // Recursive function to set all nodes as collapsed
              const collapseTree = (node) => ({
                ...node,
                expanded: false, // All nodes collapsed by default
                children: node.children?.map(collapseTree)
              });

              initialLineStates[line.root_user.mobile] = collapseTree(line.tree);
            }

            // Process other_lines inside Others line
            if (line.other_lines) {
              line.other_lines.forEach(otherLine => {
                if (otherLine.tree && otherLine.root_user?.mobile) {
                  const collapseTree = (node) => ({
                    ...node,
                    expanded: false,
                    children: node.children?.map(collapseTree)
                  });

                  initialLineStates[otherLine.root_user.mobile] = collapseTree(otherLine.tree);
                }
              });
            }
          });

          setLineStates(initialLineStates);
          setDownlineData(data);
        } else {
          Swal.fire({ icon: "info", title: "No Data", text: response.data.message || "No downline data found" });
        }
      } catch (error) {
        console.error("Error fetching downline data:", error);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to fetch downline data" });
      } finally {
        setLoading(false);
      }
    };

    fetchDownlineData();
  }, [location, navigate]);

  const handleBack = () => navigate(-1);

  /* ------------------------------------------------------------------ */
  /*  TREE RENDERING (unified for all lines)                          */
  /* ------------------------------------------------------------------ */
  const treeRef = useRef(null);

  // ---------- Unified toggle for ALL lines ----------
  const toggleNode = (rootMobile, nodePath) => {
    const toggleAtPath = (tree, path) => {
      if (path.length === 0) {
        return {
          ...tree,
          expanded: !tree.expanded,
          children: tree.children?.map((child, index) =>
            toggleAtPath(child, [...path, index])
          ),
        };
      }

      const [head, ...rest] = path;
      return {
        ...tree,
        children: tree.children?.map((child, index) =>
          index === head ? toggleAtPath(child, rest) : child
        ),
      };
    };

    setLineStates((prev) => ({
      ...prev,
      [rootMobile]: toggleAtPath(prev[rootMobile], nodePath),
    }));
  };

  const renderNode = (node, isRoot = false, rootMobile = null, nodePath = []) => (
    <li key={`${node.username}-${node.mobile || ""}-${nodePath.join('-')}`}>
      <span
        className={`node-content ${isRoot
            ? "root"
            : node.user_type?.includes("Leader")
              ? "leader"
              : node.user_type?.includes("Group")
                ? "group"
                : "member"
          }`}
      >
        <strong>{node.username}</strong>
        <br />
        <small><strong>Role:</strong> {node.user_type}</small>
        <br />
        <small><strong>Area:</strong> {node.area ?? 0} SQYD</small>

        {!isRoot && (
          <>
            <br />
            <small><strong>Level:</strong> {node.level}</small>
            {node.contribution_type && (
              <>
                <br />
                <small><strong>Type:</strong> {node.contribution_type}</small>
              </>
            )}
            {node.direct_sales?.length > 0 && (
              <div className="direct-sales">
                {node.direct_sales.map((s, i) => (
                  <div key={i} className="sale-item">• {s.area} SQYD</div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Toggle button */}
        {node.children?.length > 0 && (
          <button
            className="toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (rootMobile) {
                toggleNode(rootMobile, nodePath);
              }
            }}
            title={node.expanded ? "Hide children" : "Show children"}
          >
            {node.expanded ? <FaMinus /> : <FaPlus />}
          </button>
        )}
      </span>

      {/* Children */}
      {node.expanded && node.children?.length > 0 && (
        <ul>
          {node.children.map((child, idx) =>
            renderNode(child, false, rootMobile, [...nodePath, idx])
          )}
        </ul>
      )}
    </li>
  );

  /* ------------------------------------------------------------------ */
  /*  UNIFIED TREE VIEW COMPONENT                                     */
  /* ------------------------------------------------------------------ */
  const TreeView = ({ tree, rootMobile }) => {
    if (!tree.username) {
      return (
        <div className="text-center p-4 bg-light rounded">
          <p className="text-muted">Tree data not available</p>
        </div>
      );
    }

    return (
      <div className="tree-wrapper" ref={treeRef}>
        <ul className="tree">{renderNode(tree, true, rootMobile)}</ul>
      </div>
    );
  };

  /* ------------------------------------------------------------------ */
  /*  LINE SUMMARY (Accordion item) - UNIFIED                         */
  /* ------------------------------------------------------------------ */
  const LineSummary = ({ line }) => (
    <Accordion.Item eventKey={line.line_number?.toString() ?? "others"}>
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
            <Badge bg="primary" className="me-2">
              Area: {line.total_area}
            </Badge>
            <Badge bg="success">Members: {line.total_members}</Badge>
          </div>
        </div>
      </Accordion.Header>

      <Accordion.Body className="p-0">
        {/* ---------- MAIN LINE TREE (Line 1, Line 2) ---------- */}
        {line.tree && line.root_user?.mobile ? (
          <TreeView
            tree={lineStates[line.root_user.mobile] || line.tree}
            rootMobile={line.root_user.mobile}
          />
        ) : line.other_lines ? (
          // ---------- OTHER LINES ----------
          <div className="p-3">
            <h6 className="mb-3">Other Lines (Family Trees)</h6>

            {line.other_lines.map((other, idx) => (
              <Card key={idx} className="mb-4 shadow-sm">
                <Card.Header className="bg-secondary text-white d-flex justify-content-between align-items-center">
                  <strong>{other.root_user?.username || "Unknown User"}</strong>
                  <small>Phone: {other.root_user?.mobile || "N/A"}</small>
                </Card.Header>

                <Card.Body className="p-0">
                  <div className="d-flex justify-content-between p-3 bg-light border-bottom">
                    <Badge bg="primary">Area: {other.total_area || 0}</Badge>
                    <Badge bg="success">Members: {other.total_members || 0}</Badge>
                  </div>

                  {/* FULL FAMILY TREE */}
                  {other.root_user?.mobile && (
                    <TreeView
                      tree={lineStates[other.root_user.mobile] || other.tree}
                      rootMobile={other.root_user.mobile}
                    />
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted">No tree data available</p>
          </div>
        )}
      </Accordion.Body>
    </Accordion.Item>
  );

  /* ------------------------------------------------------------------ */
  /*  LOADING STATE                                                    */
  /* ------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------ */
  /*  MAIN RENDER                                                      */
  /* ------------------------------------------------------------------ */
  return (
    <div className="padding_15">
      {/* ------------------- INJECT CSS ------------------- */}
      <style>
        {`
          /* ==== TREE WRAPPER ==== */
          .tree-wrapper {
            width: 100%;
            height: 80vh;
            overflow: auto;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 20px;
            background: #f8f9fa;
            display: flex;
            justify-content: start;
            align-items: flex-start;
            scroll-behavior: smooth;
          }
          .tree-wrapper::-webkit-scrollbar { height: 10px; width: 10px; }
          .tree-wrapper::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
          .tree-wrapper::-webkit-scrollbar-thumb:hover { background: #999; }

          /* ==== TREE STRUCTURE ==== */
          .tree, .tree ul, .tree li { list-style: none; margin: 0; padding: 0; position: relative; }
          .tree { text-align: center; white-space: nowrap; }
          .tree, .tree ul { display: table; width: 100%; }
          .tree li { display: table-cell; padding: .5em 0; vertical-align: top; position: relative; }
          .tree li:before { outline: solid 1px #666; content: ""; left: 0; position: absolute; right: 0; top: 0; }
          .tree li:first-child:before { left: 50%; }
          .tree li:last-child:before { right: 50%; }

          .tree span {
            border: solid .1em #666;
            border-radius: .2em;
            display: inline-block;
            margin: 0 .2em .5em;
            padding: .4em .8em;
            background: #e3f2fd;
            position: relative;
            min-width: 150px;
            transition: background .3s ease;
            text-align: center;
          }
          .tree span:hover { background: #bbdefb; }

          .tree ul:before, .tree span:before {
            outline: solid 1px #666;
            content: "";
            height: .5em;
            left: 50%;
            position: absolute;
          }
          .tree ul:before { top: -.5em; }
          .tree span:before { top: -.55em; }
          .tree > li:before, .tree > li > span:before { outline: none; }

          /* ==== NODE CONTENT ==== */
          .node-content strong { text-transform: capitalize; }
          .node-content.root { background: #1976d2; color:#fff; }
          .node-content.leader { background: #388e3c; color:#fff; }
          .node-content.group  { background: #7b1fa2; color:#fff; }
          .node-content.member { background: #f57c00; color:#fff; }

          .direct-sales { margin-top: .4rem; font-size: .75rem; }
          .sale-item { margin: .1rem 0; }

          /* ==== TOGGLE BUTTON ==== */
          .toggle-btn {
            margin-left: 6px;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-size: 14px;
            line-height: 22px;
            cursor: pointer;
            vertical-align: middle;
            transition: background .3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .toggle-btn:hover { background: #0056b3; }

          @media (max-width: 768px) {
            .tree-wrapper { height: 60vh; }
          }
        `}
      </style>

      <div className="row">
        <div className="col-md-12">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div>
                <Button variant="outline-secondary" onClick={handleBack} className="me-3">
                  Back to Upline Chain
                </Button>
                <h4 className="mb-0 d-inline">My Team's Child Chain Downline Details</h4>
              </div>
              <div className="text-end">
                <Badge bg="primary" className="fs-6">
                  Mobile: {selectedMobile}
                </Badge>
                {downlineData?.parent_mobile && (
                  <div className="small text-muted">Parent: {downlineData.parent_mobile}</div>
                )}
              </div>
            </Card.Header>

            <Card.Body>
              {downlineData ? (
                <>
                  {/* ---------- SUMMARY CARDS ---------- */}
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
                            {downlineData.summary?.reduce(
                              (t, l) => t + (l.total_members || 0),
                              0
                            ) || 0}
                          </h3>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-3">
                      <Card className="bg-info text-white">
                        <Card.Body className="text-center">
                          <h5>Total Area</h5>
                          <h3>
                            {(
                              downlineData.summary?.reduce(
                                (t, l) => t + (Number(l.total_area) || 0),
                                0
                              ) || 0
                            ).toFixed(2)}
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

                  {/* ---------- ACCORDION WITH TREES ---------- */}
                  <Card>
                    <Card.Header className="bg-light">
                      <h5 className="mb-0">{downlineData.message}</h5>
                    </Card.Header>
                    <Card.Body>
                      <Accordion defaultActiveKey={["0"]} alwaysOpen>
                        {downlineData.summary?.map((line, idx) => (
                          <LineSummary key={idx} line={line} />
                        ))}
                      </Accordion>
                    </Card.Body>
                  </Card>
                </>
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