import React, { useState, useEffect, useRef } from "react";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function MyTeamTree() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const [showTree, setShowTree] = useState(false);
  const treeRef = useRef(null);

  const getAuthToken = () => localStorage.getItem("token");

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
      const response = await axios.get(
        `${API_URL}/myteam-tree?mobile=${mobile}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "1") {
        const formattedTree = {
          name: `${response.data.parent_mobile}`,
          role: "Parent",
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
      Swal.fire("Warning !!!", "Sorry No Data Found Please Try Another.", "info");
    } finally {
      setLoading(false);
    }
  };

  const buildTreeStructure = (nodes) =>
    nodes.map((node) => ({
      name: `${node.username} (${node.mobile})`,
      role: node.user_type,
      level: node.level,
      kyc: node.kyc,
      status: node.status,
      date: node.date,
      expanded: false,
      children: buildTreeStructure(node.children || []),
    }));

  const toggleNode = (node) => {
    node.expanded = !node.expanded;
    setTreeData({ ...treeData });
  };

  const renderTree = (node, isRoot = false) => (
    <li key={node.name}>
      <span>
        <strong>{node.name}</strong>
        <br />
        <small className="text-capitalize">Role: {node.role}</small>
        {!isRoot && (
          <>
            <br />
            <small>Level: {node.level}</small>
            {/* <br />
            <small>KYC: {node.kyc}</small>*/}
            {/* <br />  */}

            <br />

            <small>SQYD: {node.buysqrt || "0.00"}</small>
            <br />


            <small>DOR: {node.date}</small>
            <br />
            <small>
              Associate Status :{" "}
              <div className="d-inline text-capitalize"
                style={{
                  color: node.status === "success" ? "green" : "red",
                }}
              >
                {node.status}
              </div>
            </small>
          </>
        )}
        {node.children && node.children.length > 0 && (
          <button
            className="toggle-btn"
            onClick={() => toggleNode(node)}
            title={node.expanded ? "Hide children" : "Show children"}
          >
            {node.expanded ? "−" : "+"}
          </button>
        )}
      </span>

      {node.expanded && node.children?.length > 0 && (
        <ul>{node.children.map((child) => renderTree(child))}</ul>
      )}
    </li>
  );

  // ✅ Center tree only once after it is first shown
  useEffect(() => {
    if (showTree && treeData && treeRef.current) {
      const el = treeRef.current;
      setTimeout(() => {
        el.scrollTo({
          left: el.scrollWidth / 2 - el.clientWidth / 2,
          top: 0,
          behavior: "smooth",
        });
      }, 300);
    }
  }, [showTree]);

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
                  <div className="col-12 col-md-4">
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
                  <div className="col-12 col-md-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Show"
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {showTree && treeData && (
                <div className="tree-wrapper" ref={treeRef}>
                  <ul className="tree">{renderTree(treeData, true)}</ul>
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