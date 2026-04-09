import React, { useEffect, useState } from "react";
import { Table, Spinner, Button, Modal } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router";

const API_URL = process.env.REACT_APP_API_URL;
function Levelwise() {
  const [levelCounts, setLevelCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem("token");

  const fetchLevelCounts = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const url = `${API_URL}/myteam-list-lavel11-count`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      console.log("API Response:", result);

      if (result.status === "1" && result.levelCounts) {
        const allLevels = [];
        for (let level = 1; level <= 11; level++) {
          const levelData = result.levelCounts.find(
            (item) => item.level === level,
          );
          if (levelData) {
            allLevels.push(levelData);
          } else {
            allLevels.push({
              level: level,
              user_count: 0,
            });
          }
        }

        setLevelCounts(allLevels);
        console.log("Processed Levels:", allLevels);
      } else {
        const defaultLevels = [];
        for (let level = 1; level <= 11; level++) {
          defaultLevels.push({
            level: level,
            user_count: 0,
          });
        }
        setLevelCounts(defaultLevels);
      }
    } catch (error) {
      console.error("Error fetching level counts:", error);
      const errorLevels = [];
      for (let level = 1; level <= 11; level++) {
        errorLevels.push({
          level: level,
          user_count: 0,
        });
      }
      setLevelCounts(errorLevels);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelClick = (level) => {
    navigate(`/levelwiselead?level=${level.level}`);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedLevel(null);
  };
  const getTotalUsers = () => {
    return levelCounts.reduce(
      (total, level) => total + (level.user_count || 0),
      0,
    );
  };

  useEffect(() => {
    fetchLevelCounts();
  }, []);

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>My Team Level (1-11)</h3>
            </div>
            <button className="btn btn-primary stats-number">{getTotalUsers()}</button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading team levels...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover>
                <thead className="">
                  <tr>
                    <th className="headinglevel">Level</th>
                    <th className="headinglevel">Team Size</th>
                    <th className="headinglevel">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {levelCounts.map((levelData) => (
                    <tr key={levelData.level}>
                      <td>
                        <strong className="level_fonts">
                          Level {levelData.level}
                        </strong>
                      </td>
                      <td>
                        <span
                          className={`badge fs-6 ${levelData.user_count === 0 ? "bg-secondary" : "bg-primary"}`}
                        >
                          {levelData.user_count || 0}
                        </span>
                      </td>
                      <td>
                        <Button
                          variant={
                            levelData.user_count === 0 ? "" : "outline-info"
                          }
                          size="sm"
                          onClick={() => handleLevelClick(levelData)}
                          className="d-flex btn btn-primary w-30 align-items-center gap-1"
                          disabled={levelData.user_count === 0}
                        >
                          <FaEye />
                          {levelData.user_count === 0
                            ? "No Data"
                            : "View Details"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* <Modal show={showDetails} onHide={handleCloseDetails} centered size="lg">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Level {selectedLevel?.level} Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedLevel && (
                        <div className="text-center">
                            <div className="mb-4">
                                <h3 className="text-primary">Level {selectedLevel.level}</h3>
                                <div className={`display-4 fw-bold ${selectedLevel.user_count === 0 ? 'text-secondary' : 'text-success'}`}>
                                    {selectedLevel.user_count || 0}
                                </div>
                                <p className="text-muted">Team Members</p>
                            </div>

                            <div className="row text-start">
                                <div className="col-6">
                                    <strong>Level Number:</strong>
                                </div>
                                <div className="col-6">
                                    {selectedLevel.level}
                                </div>

                                <div className="col-6 mt-2">
                                    <strong>User Count:</strong>
                                </div>
                                <div className="col-6 mt-2">
                                    {selectedLevel.user_count || 0}
                                </div>

                                {/* <div className="col-6 mt-2">
                                    <strong>Percentage of Total:</strong>
                                </div> 
                               
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>

                    <Button
                        variant="primary"
                        onClick={() => {
                            if (selectedLevel.user_count > 0) {
                                window.location.href = `/levelwiselead?level=${selectedLevel.level}`;
                            }
                        }}
                        disabled={selectedLevel?.user_count === 0}
                    >
                        {selectedLevel?.user_count === 0 ? 'No Members to View' : 'View Level Members'}
                    </Button>
                    <Button variant="danger" onClick={handleCloseDetails}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal> */}
      </div>
    </div>
  );
}

export default Levelwise;
