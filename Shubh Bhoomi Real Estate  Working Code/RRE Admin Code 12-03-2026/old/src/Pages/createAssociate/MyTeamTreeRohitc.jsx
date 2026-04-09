import React, { useState, useEffect } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function MyTeamTree() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const [showTree, setShowTree] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");

  // ✅ Fetch Tree Data
  const fetchTreeData = async (e) => {
    e.preventDefault();
    if (!mobile) {
      Swal.fire("Missing Input", "Please enter a mobile number", "warning");
      return;
    }

    setLoading(true);
    setTreeData(null);
    setShowTree(false);

    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/myteam-tree?mobile=${mobile}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "1") {
        const formattedTree = {
          name: `${response.data.parent_mobile}`,
          role: "Parent",
          level: "0",
          children: buildTreeStructure(response.data.tree || []),
          expanded: false,
        };
        setTreeData(formattedTree);
        setShowTree(true);
      } else {
        Swal.fire("No Data", response.data.message || "No data found", "info");
      }
    } catch (error) {
      console.error("Tree fetch error:", error);
      Swal.fire("Error", "Failed to fetch tree data", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Build Tree Recursively
  const buildTreeStructure = (nodes) =>
    nodes.map((node) => ({
      name: `${node.username} (${node.mobile})`,
      role: node.user_type,
      level: node.level,
      date: node.date,
      kyc: node.kyc,
      expanded: false,
      children: buildTreeStructure(node.children || []),
    }));

  // ✅ Toggle node expansion
  const toggleNode = (node) => {
    node.expanded = !node.expanded;
    setTreeData({ ...treeData });
  };

  // ✅ Recursive Tree Renderer
 // ✅ Recursive Tree Renderer with nesting border level
const renderTree = (node, level = 0) => (
  <li>
    <div className={`member-card level-${level}`}>
      <h6>{node.name}</h6>
      <p className="mb-1">{node.role}</p>
      <small>Level: {node.level}</small>

      {node.children && node.children.length > 0 && (
        <button
          className="toggle-btn"
          onClick={() => toggleNode(node)}
          title={node.expanded ? "Hide children" : "Show children"}
        >
          {node.expanded ? "−" : "+"}
        </button>
      )}
    </div>

    {node.expanded && node.children && node.children.length > 0 && (
      <ul className="nested">
        {node.children.map((child, idx) => (
          <React.Fragment key={idx}>
            {renderTree(child, level + 1)}
          </React.Fragment>
        ))}
      </ul>
    )}
  </li>
);


  return (
    <div className="padding_15">
      <div className="row justify-content-center">
        <div className="col-12 col-md-12">
          <Card>
            <Card.Header>
              <h4 className="mb-0 text-center">My Family Tree</h4>
            </Card.Header>
            <Card.Body>
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

              {/* ✅ Family Tree Section */}
              {showTree && treeData && (
                <div className="family-tree-wrapper">
                  <ul className="family-tree">{renderTree(treeData)}</ul>
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
