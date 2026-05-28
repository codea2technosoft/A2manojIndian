import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Spinner, Table } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;
const LIMIT = 10000;

function SecondLine() {
  const [lineData, setLineData] = useState({
    line_info: {}
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
        `${API_URL}/line-two-details-associate?page=1&limit=${LIMIT}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const lineResult = await lineResponse.json();

      if (lineResult.status === "1") {
        setLineData(lineResult);
        const usersList = lineResult.line_info?.users || [];
        setAllUsers(usersList);
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
              <h3>{lineData.line_info?.line_name || "First Line"} - Members List</h3>
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
                            <td>{user.parent_id || '-'}</td>
                            <td>{user.user_type || '-'}</td>
                            <td>
                              <span className={`badge ${user.kyc === 'approved' ? 'bg-success' : 'bg-warning'}`}>
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

              {/* Summary Section */}
              <div className="mt-4 p-3 bg-light rounded">
                <div className="row">
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Total Members</h6>
                      <h4>{lineData.line_info?.total_members || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Active Members</h6>
                      <h4>{lineData.line_info?.active_members || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Buyers Count</h6>
                      <h4>{lineData.line_info?.buyers_count || 0}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Total Buy Sqft</h6>
                      <h4>{lineData.line_info?.total_buysqft || 0}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SecondLine;