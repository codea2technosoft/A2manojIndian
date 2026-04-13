import React, { useEffect, useState } from "react";
import { Card, Badge, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function MyChainUpLine() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [associateName, setAssociateName] = useState("");
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chainData, setChainData] = useState(null);
  const [showChain, setShowChain] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");
  
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

  const fetchChainData = async (e) => {
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
    setShowChain(false);
    setChainData(null);

    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/myteam-parent-chain?mobile=${mobile}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "1") {
        setChainData(response.data);
        setShowChain(true);
      } else {
        Swal.fire({
          icon: "info",
          title: "Sorry!",
          text: response.data.message || "No data found",
        });
      }
    } catch (error) {
      console.error("Error fetching chain data:", error);
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "No data found, please try another.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle box click with URL parameters
  const handleBoxClick = (mobileNumber, userName, userType) => {
    // Navigate to details page with mobile number as URL parameter
    navigate(`/myteam-child-chain-down-line-details?mobile=${mobileNumber}`);
  };

  const ParentChain = () => {
    if (!chainData || !chainData.parents) return null;

    return (
      <div className="parent-chain-container">
        <div className="chain-flow">
          {chainData.parents.map((parent, index) => (
            <div key={parent.id} className="chain-item-wrapper">
              {index > 0 && (
                <div className="chain-connector"></div>
              )}
              <div 
                className="chain-item card shadow-sm mb-3 clickable-chain-item"
                onClick={() => handleBoxClick(parent.mobile, parent.username, parent.user_type)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <strong className="fs-5 me-2">
                          {parent.username
                            ? parent.username.charAt(0).toUpperCase() + parent.username.slice(1).toLowerCase()
                            : ""}
                        </strong>
                        <Badge bg="dark">L{parent.level}</Badge>
                      </div>
                      <div className="d-flex flex-wrap gap-2 text-muted">
                        <span>📱 {parent.mobile}</span>
                      </div>
                      {parent.parent_id && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Parent ID: {parent.parent_id}
                          </small>
                        </div>
                      )}

                      {parent.buysqrt && (
                        <div className="mt-2">
                          <small className="text-muted">
                            Total: {Number(parent.buysqrt).toFixed(2)} BuySQRT
                          </small>
                        </div>
                      )}

                      {parent.user_type && (
                        <div className="mt-2">
                          <small className="text-muted">
                            User Type: {parent.user_type?.charAt(0).toUpperCase() + parent.user_type?.slice(1).toLowerCase()}
                          </small>
                        </div>
                      )}
                    </div>
                    <div className="text-end">
                      <div className="level-indicator">
                        <Badge bg="secondary" className="fs-6">
                          Level {parent.level}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <Badge bg="info" className="click-indicator">
                          Click for Details →
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Card - Also clickable */}
        <div className="text-center mb-4">
          <div 
            className="current-user-card p-3 bg-primary text-white rounded shadow clickable-chain-item"
            onClick={() => handleBoxClick(chainData.child_mobile, associateName, "current")}
            style={{ cursor: "pointer", maxWidth: "300px", margin: "0 auto" }}
          >
            <h5 className="mb-1">Current User</h5>
            <strong className="fs-4">
              {(associateName || chainData.child_mobile)
                ? (associateName || chainData.child_mobile).charAt(0).toUpperCase() +
                (associateName || chainData.child_mobile).slice(1).toLowerCase()
                : ""}
            </strong>

            <div className="mt-1">
              <Badge bg="light" text="dark">📱 {chainData.child_mobile}</Badge>
            </div>

            <div className="mt-1">
              Total : {Number(chainData.total_buysqrt).toFixed(2)} BuySQRT
            </div>
            
            <div className="mt-2">
              <Badge bg="warning" text="dark" className="click-indicator">
                Click for Details →
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 p-3 bg-light rounded">
          <h6 className="mb-2">Chain Summary</h6>
          <div className="d-flex justify-content-center gap-3">
            <Badge bg="primary" className="fs-6">
              Total Levels: {chainData.total_levels}
            </Badge>
            <Badge bg="success" className="fs-6">
              Total Parents: {chainData.parents.length}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="padding_15">
      <style>
        {`
          .chain-flow {
            position: relative;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .chain-item-wrapper {
            position: relative;
          }
          
          .chain-connector {
            position: absolute;
            left: 50%;
            top: -15px;
            width: 2px;
            height: 30px;
            background: linear-gradient(to bottom, #007bff, #28a745);
            transform: translateX(-50%);
            z-index: 1;
          }
          
          .current-user-card {
            border: 2px solid #007bff;
            transition: all 0.3s ease;
          }
          
          .chain-item {
            transition: transform 0.2s ease;
            border-left: 4px solid #007bff;
          }
          
          .chain-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
          }
          
          .level-indicator {
            min-width: 80px;
          }
          
          .clickable-chain-item {
            transition: all 0.3s ease;
          }
          
          .clickable-chain-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15) !important;
            border-color: #28a745;
          }
          
          .click-indicator {
            font-size: 0.7rem;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
          }
        `}
      </style>

      <div className="row">
        <div className="col-md-12">
          <Card>
            <Card.Header>
              <h4 className="mb-0">My Upline Chain</h4>
            </Card.Header>
            <Card.Body>
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <Card>
                    <Card.Body>
                      <form onSubmit={fetchChainData}>
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
                            <div className="d-flex align-items-center justify-content-center">
                              <Spinner animation="border" size="sm" className="me-2" />
                              <span style={{ color: "gray" }}>Checking associate name...</span>
                            </div>
                          )}
                          {associateName && (
                            <div className="alert alert-success py-2 mb-0">
                              <strong>✓ Name:</strong> {associateName}
                            </div>
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
                                <Spinner animation="border" size="sm" className="me-2" />
                                Loading...
                              </>
                            ) : (
                              'Show Upline Chain 11 Levels'
                            )}
                          </button>
                        </div>
                      </form>
                    </Card.Body>
                  </Card>
                </div>
              </div>
              {showChain && chainData && (
                <div className="row mt-4">
                  <div className="col-md-12">
                    <Card>
                      <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                          Upline Chain for: {chainData.child_mobile}
                          {associateName && ` (${associateName})`}
                        </h5>
                        <div>
                          <Badge bg="primary" className="me-2">
                            Levels: {chainData.total_levels}
                          </Badge>
                          <Badge bg="success">
                            Parents: {chainData.parents.length}
                          </Badge>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <div className="p-3">
                          <div className="alert alert-info mb-3">
                            <strong>💡 Tip:</strong> Click on any box below to view detailed downline information for that user.
                          </div>
                          <ParentChain />
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

export default MyChainUpLine;