import { useState, useEffect } from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEye,
  FiEyeOff
} from "react-icons/fi";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { blockMasterList, blockUnblockMaster } from "../Server/api";
import { useNavigate, useLocation } from "react-router-dom";

function BlockedAgentLists() {
  const navigate = useNavigate();
  const location = useLocation();

  const [agentData, setAgentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
   const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedMasterId, setSelectedMasterId] = useState(null);


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage,setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const admin_id = localStorage.getItem("admin_id");
  const role = "4";


  const showSuccessToast = (msg) =>
    toast.success(msg, { position: "top-right", autoClose: 500, theme: "light" });
  const showErrorToast = (msg) =>
    toast.error(msg, { position: "top-right", autoClose: 500, theme: "light" });

  useEffect(() => {


    fetchAgentData(1, itemsPerPage, "");
  }, [location]);

  const fetchAgentData = async (page = 1, limit = itemsPerPage, search = "") => {
    try {
      setLoading(true);
      setIsSearching(true);

      const payload = {
        admin_id: admin_id,
        page,
        limit,
        role,
        ...(search && { search })
      };

      const res = await blockMasterList(payload);
      if (res.data.success) {
        const data = res.data;
        setAgentData(data.data || []);
        setTotalItems(data.pagination?.total_records || 0);
        setTotalPages(data.pagination?.total_pages || 1);
        setCurrentPage(data.pagination?.current_page || page);
        setItemsPerPage(data.pagination?.limit);
        setSearchTerm(search);
      } else {
        setAgentData([]);
      }
    } catch (err) {
      console.error("Error fetching agents:", err);
      setAgentData([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };
  const openStatusModal = (agent) => {
    setSelectedAgent(agent);
    setShowStatusModal(true);
  };
  const handleLimitChange = (e) => {
    const value = Number(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
    fetchAgentData(1, value, searchTerm);
  };

 const handleBlockUnblockConfirm = async () => {
    if (!selectedAgent) return;

    try {
      const currentBlock = Number(selectedAgent.is_blocked);
      const newBlockStatus = currentBlock === 1 ? 0 : 1;
      const res = await blockUnblockMaster(selectedAgent.admin_id, role, newBlockStatus);

      if (res.data.success) {
        showSuccessToast(`Agent ${newBlockStatus === 1 ? "blocked" : "unblocked"} successfully`);
        fetchAgentData(currentPage, itemsPerPage, searchTerm);
      } else {
        showErrorToast(res.data.message);
      }
    } catch (err) {
      console.error("Error updating block status:", err);
      showErrorToast("Failed to update block status. Try again.");
    } finally {
      setShowStatusModal(false);
      setSelectedAgent(null);
    }
  };

  const handleSearch = () => {
    if (searchInput.trim() !== searchTerm) {
      fetchAgentData(1, itemsPerPage, searchInput.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    fetchAgentData(1, itemsPerPage, "");
  };

  const handleSearchInputChange = (e) => setSearchInput(e.target.value);
  const handleSearchKeyPress = (e) => { if (e.key === 'Enter') handleSearch(); };

  // Pagination handlers
  const handleNext = () => currentPage < totalPages && fetchAgentData(currentPage + 1, itemsPerPage, searchTerm);
  const handlePrev = () => currentPage > 1 && fetchAgentData(currentPage - 1, itemsPerPage, searchTerm);
  const handlePageClick = (page) => page >= 1 && page <= totalPages && fetchAgentData(page, itemsPerPage, searchTerm);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      if (end - start + 1 < maxVisiblePages) start = end - maxVisiblePages + 1;
      for (let i = start; i <= end; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handleBack = () => navigate(-1);

  const togglePassword = (adminId) => {
    setShowPassword(prev => ({ ...prev, [adminId]: !prev[adminId] }));
  };
const handleBlockUnblock = async (agent) => {
  try {
    const currentStatus = Number(agent.is_blocked);

    // toggle
    const newStatus = currentStatus === 1 ? 0 : 1;

    const res = await blockUnblockMaster(
      agent.admin_id,
      agent.role,
      newStatus
    );

    if (res.data.success) {
 

      fetchAgentData(currentPage, itemsPerPage, searchTerm, selectedMasterId);
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};


  return (
    <>
      <div className="card agentmaster">
        <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Blocked Agent Lists</h5>
          <button className="btn btn-outline-light" onClick={handleBack}>Back</button>
        </div>

        <div className="card-body">
                {/* Search */}
             { agentData.length > 0 &&(
            <div className="row mb-3">
            <div className="col-md-6">
              <div className="d-flex" style={{ width: "350px" }}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search agents..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <button className="btn btn-outline-primary" onClick={handleSearch} disabled={isSearching}>
                    <FiSearch />
                  </button>
                  {searchTerm && (
                    <button className="btn btn-outline-secondary" onClick={handleClearSearch}>Clear</button>
                  )}
                </div>
              </div>
              {searchTerm && <small className="text-muted mt-2 d-block">Search results for: <strong>"{searchTerm}"</strong></small>}
            </div>

           <div className="col-md-6">
              <div className="d-flex justify-content-end mb-3">
                <select
                  className="form-select form-select-sm"
                  style={{ width: "90px" }}
                  value={itemsPerPage}
                  onChange={handleLimitChange}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
               </select>
              </div>
            </div>
          </div>
           )}   
       

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Agent Code</th>
                  <th>Agent Name</th>
                  <th>Master Code</th>
                  <th>D.O.J</th>
                  <th>Password</th>
                  <th>Share %</th>
                  <th>Match Comm %</th>
                  <th>Session Comm %</th>
                  {/* <th>Status</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : agentData.length > 0 ? (
                  agentData.map((row, index) => (
                    <tr key={row.admin_id || index}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{row.admin_id || "N/A"}</td>
                      <td>{row.username || "N/A"}</td>
                       <td>
                        <div>{row.super_admin_id || "N/A"}</div>
                        <small>{row.parent_username || "N/A"}</small>
                      </td>
                      <td>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <input
                            type={showPassword[row.admin_id] ? "text" : "password"}
                            value={row.password || ""}
                            readOnly
                            className="form-control form-control-sm"
                          />
                          <span
                            onClick={() => togglePassword(row.admin_id)}
                            style={{ cursor: "pointer", marginLeft: "5px" }}
                          >
                            {showPassword[row.admin_id] ? <FiEyeOff /> : <FiEye />}
                          </span>
                        </div>
                      </td>

                      
                      <td>{row.match_share || "0"}</td>
                      <td>{row.match_comm || "0"}</td>
                      <td>{row.session_comm || "0"}</td>
                      {/* <td>
                        {Number(row.is_blocked) === 1 ? (
                          <span className="badge bg-danger">Blocked</span>
                        ) : (
                          <span className="badge bg-success">Active</span>
                        )}
                      </td> */}
           <td>
  <button
    className={`btn ${
      Number(row.is_blocked) === 1 ? "btn-success" : "btn-danger"
    }`}
    onClick={() => handleBlockUnblock(row)}
  >
    {Number(row.is_blocked) === 1 ? "Unblock" : "Block"}
  </button>
</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center text-muted">
                      {isSearching ? "Searching..." : "No agent data found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
             {showStatusModal && selectedAgent && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Status Change</h5>
                      </div>
                  <div className="modal-body">
                    <p className="mb-2">
                      <strong>Master Username:</strong> {selectedAgent.username}
                    </p>
                    <p className="mb-2">
                      <strong>Master Code:</strong> {selectedAgent.admin_id}
                    </p>
                    <p className="mb-2">
                      <strong>Current Status:</strong>{" "}
                      {Number(selectedAgent.is_blocked) === 1 ? (
                        <span className="badge bg-danger">Blocked</span>
                      ) : (
                        <span className="badge bg-success">Active</span>
                      )}
                    </p>
                    <p>
                      Change status to:{" "}
                      <strong>
                        {Number(selectedAgent.is_blocked) === 1 ? "Unblock (Active)" : "Block (Blocked)"}
                      </strong>
                    </p>
                  </div>
                  <div className="modal-footer">
                 
                    <button
                      type="button"
                      className={`btn ${Number(selectedAgent.is_blocked) === 1 ? "btn-success" : "btn-danger"}`}
                      onClick={handleBlockUnblockConfirm}
                    >
                      {Number(selectedAgent.is_blocked) === 1 ? "Confirm Unblock" : "Confirm Block"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="text-muted">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </span>
              <div className="d-flex gap-1">
                <Button size="sm" onClick={handlePrev} disabled={currentPage === 1}><FiChevronLeft /></Button>
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "primary" : "outline-primary"}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button size="sm" onClick={handleNext} disabled={currentPage === totalPages}><FiChevronRight /></Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={500} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
    </>
  );
}

export default BlockedAgentLists;
