import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAgentList } from "../Server/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function SuperAgentList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roleParam = queryParams.get("role");
  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMasterId, setSelectedMasterId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [itemsPerPage] = useState(10);

  const role = roleParam

  const showErrorToast = (msg) => toast.error(msg || "Error");
  const showSuccessToast = (msg) => toast.success(msg || "Loaded");

  // fetch agent/master data
  const fetchAgentData = async (page = 1) => {
    try {
      setLoading(true);
      setIsSearching(true);

      const payload = {
        page,
        limit: itemsPerPage,
        role,
        master_admin_id: id,
      };

      const res = await getAgentList(payload);

      if (res?.data?.success) {
        setAgentData(res.data.data || []);
        showSuccessToast(res?.data?.message);
      } else {
        setAgentData([]);
        showErrorToast(res?.data?.message);
      }
    } catch (err) {
      console.log(err);
      showErrorToast("Unable to fetch data");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSelectedMasterId(id);
      fetchAgentData();
    }
  }, [id, role]);

  const handleBack = () => navigate(-1);

  const handleNextLevel = (agentId, agentRole) => {
    // role increment: 2→3 (Master→Agent)
    navigate(`/getSuperAgent-list/${agentId}?role=${agentRole}`);
  };

  return (
    <>
      <div className="card agentmaster">
        <div className="card-header d-flex bg-primary-yellow justify-content-between align-items-center">
        <h5 className="card-title mb-0">Super Agent List</h5>
          <button className="backbutton" onClick={handleBack}>
            Back
          </button>
        </div>

        <div className="card-body">
          <div className="alert alert-info mb-3">
            <strong>Master ID:</strong> {selectedMasterId}
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Coins</th>
                  <th>Status</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading...
                    </td>
                  </tr>
                ) : agentData.length > 0 ? (
                  agentData.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{row.admin_id}</td>
                      <td>{row.username}</td>
                      <td>{row.role_name}</td>
                      <td>₹{row.coins || 0}</td>
                      <td>
                        {row.active === 1 ? (
                          <span className="activebadge">Active</span>
                        ) : (
                          <span className="inactivebadge">Inactive</span>
                        )}
                      </td>
                      {/* <td>
                        {row.role < 3 && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() =>
                              handleNextLevel(
                                row._id,
                                (parseInt(row.role) + 1).toString()
                              )
                            }
                          >
                            View Next Level
                          </Button>
                        )}
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      {isSearching ? "Searching..." : "No data found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ToastContainer theme="colored" />
    </>
  );
}

export default SuperAgentList;
