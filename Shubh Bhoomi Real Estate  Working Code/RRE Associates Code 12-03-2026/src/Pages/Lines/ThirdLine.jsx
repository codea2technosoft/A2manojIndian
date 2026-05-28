import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Spinner, Table } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;
const LIMIT = 10000;

function ThirdLine() {
  const [lineData, setLineData] = useState({
    line_name: "Others",
    total_buysqft: 0,
    total_members: 0,
    total_active_members: 0
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const lineResponse = await fetch(
        `${API_URL}/line-three-details-associate?page=1&limit=${LIMIT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const lineResult = await lineResponse.json();

      if (lineResult.status === "1") {
        setLineData(lineResult);
        
       
        const allUsersList = [];
        
        if (lineResult.lines && Array.isArray(lineResult.lines)) {
          lineResult.lines.forEach(line => {
            if (line.users && Array.isArray(line.users)) {
              
              const usersWithLineInfo = line.users.map(user => ({
                ...user,
                line_name: line.line_name,
                line_type: line.line_type
              }));
              allUsersList.push(...usersWithLineInfo);
            }
          });
        }
        
        setAllUsers(allUsersList);
      } else {
        Swal.fire("Error", lineResult.message || "Failed to fetch line data", "error");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", `Failed to fetch data: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>{lineData.line_name || "Third Line"} - Members List</h3>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="form_design">
                <button
                  type="button"
                  className="submit_button d-flex align-items-center"
                  onClick={handleBack}
                >
                  <FaArrowLeft className="me-2" />
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading members...</p>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="text-center py-5">
              <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">No Members Found!</h4>
                <p>No members found in this line.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="card">
                <div className="card-body p-0">
                  <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto', overflowX: 'auto' }}>
                    <Table bordered hover size="sm" className="mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th>S.No</th>
                          <th>Date</th>
                          <th>User Name</th>
                          <th>Mobile</th>
                          <th>Line Name</th>
                          <th>Parent ID</th>
                          <th>User Type</th>
                          <th>KYC</th>
                          <th>Buy Sqft</th>
                          <th>Credit</th>
                          <th>Root User</th>
                        </tr>
                      </thead>

                      <tbody>
                        {allUsers.map((user, index) => (
                          <tr key={user.id}>
                            <td>{index + 1}</td>
                            <td>{user.date || '-'}</td>
                            <td>{user.username || '-'}</td>
                            <td>{user.mobile || '-'}</td>
                            <td>
                              <span className="badge bg-info">
                                {user.line_name || '-'}
                              </span>
                            </td>
                            <td>{user.parent_id || '-'}</td>
                            <td>{user.user_type || '-'}</td>
                            <td>
                              <span className={`badge ${user.kyc === 'approved' ? 'bg-success' : user.kyc === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                                {user.kyc || '-'}
                              </span>
                            </td>
                            <td>{user.buysqft || 0}</td>
                            <td>{user.credit || 0}</td>
                            <td>{user.is_root ? 'Yes' : 'No'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>

             
              <div className="mt-4 p-3 bg-light rounded">
                <div className="row">
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Total Members</h6>
                      <h4>{lineData.total_members || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Active Members</h6>
                      <h4>{lineData.total_active_members || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Total Buy Sqft</h6>
                      <h4>{lineData.total_buysqft || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Total Lines</h6>
                      <h4>{lineData.total_lines || 0}</h4>
                    </div>
                  </div>
                </div>
              </div>

             
              {lineData.lines && lineData.lines.length > 0 && (
                <div className="mt-3">
                  <h6>Line Summary:</h6>
                  <div className="row">
                    {lineData.lines.map((line, idx) => (
                      <div key={idx} className="col-md-4 mb-2">
                        <div className="card">
                          <div className="card-body p-2">
                            <strong>{line.line_name}</strong>
                            <div className="small">
                              Members: {line.total_members} | 
                              Buy Sqft: {line.total_buysqft} |
                              Active: {line.active_members || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThirdLine;