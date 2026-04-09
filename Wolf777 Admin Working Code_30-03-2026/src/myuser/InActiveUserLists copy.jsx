import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "react-bootstrap";
import { UserInactiveList, updateClientStatus } from "../Server/api";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
function InActiveUserLists() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filters, setFilters] = useState({
    code: "",
    name: "",
  });
  const role = "5";

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const fetchInactiveMasters = async (page = 1, limit = 10, search = "") => {
    try {
      setIsSearching(true);
      setLoading(true);
      const payload = {
        role: role,
        page: page,
        limit: limit,
        ...(search && { search: search })
      };

      const response = await UserInactiveList(payload);

      if (response.data.success) {
        const data = response.data;
        setMasterData(data.data || []);
        const total = data.pagination?.total_records || 0;
        const pages = data.pagination?.total_pages || 1;
        const current = data.pagination?.current_page || page;


        setTotalItems(total);
        setTotalPages(pages);

        // IMPORTANT FIX
        if (pages === 0) {
          setCurrentPage(1);
        } else {
          setCurrentPage(current);
        }
        // setTotalItems(data.pagination?.total_records || 0);

        // setTotalPages(data.pagination?.total_pages || 1);

        // setCurrentPage(data.pagination?.current_page || page);

        setSearchTerm(search);

        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message);
        setMasterData([]);
      }
    } catch (error) {
      console.error("Error fetching inactive masters:", error);
      setMasterData([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };
  const handleStatusChange = async () => {
    if (!selectedAgent) return;

    try {
      const newStatus = selectedAgent.active === 1 ? 0 : 1;

      const response = await updateClientStatus(
        selectedAgent.admin_id,
        role,
        1,
        newStatus
      );

      if (response.data.success) {
        showSuccessToast(
          `Agent ${newStatus === 1 ? "activated" : "deactivated"} successfully`
        );

        fetchInactiveMasters(currentPage, itemsPerPage, searchTerm, filters);
        setShowStatusModal(false);
        setSelectedAgent(null);
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      console.error("Error updating agent status:", error);
      showErrorToast("Failed to update agent status. Please try again.");
    }
  };

  useEffect(() => {
    fetchInactiveMasters();
  }, [token]);

  const handleSearch = () => {
    if (searchInput.trim() !== searchTerm) {
      fetchInactiveMasters(1, itemsPerPage, searchInput.trim());
    }
  };

  const handleClearSearch = () => {
    if (searchTerm !== "") {
      setSearchInput("");
      fetchInactiveMasters(1, itemsPerPage, "");
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Pagination handlers
  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchInactiveMasters(nextPage, itemsPerPage, searchTerm);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      fetchInactiveMasters(prev, itemsPerPage, searchTerm);
    }
  };
  const handleFirst = () => {
    setCurrentPage(1);
    fetchInactiveMasters(1, itemsPerPage, searchTerm);
  };

  const handleLast = () => {
    setCurrentPage(totalPages);
    fetchInactiveMasters(totalPages, itemsPerPage, searchTerm);
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchInactiveMasters(page, itemsPerPage, searchTerm);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 2; // show 5 visible pages

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + max - 1);

    if (end - start < max - 1) {
      start = Math.max(1, end - max + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };


  // Navigation handler
  const handleBack = () => {
    navigate(-1);
  };

  if (loading && masterData.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card agentmaster">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Inactive User List</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={handleBack}
            >
              Back
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Search Controls */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="d-flex">
                <div className="input-group me-2" style={{ width: "300px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search inactive master..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    <FiSearch />
                  </button>
                  {searchTerm && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {searchTerm && (
                <div className="mt-2">
                  <small className="text-muted">
                    Search results for: <strong>"{searchTerm}"</strong>
                  </small>
                </div>
              )}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th className="text-center">#</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Super Admin</th>
                  <th>Date of Joining</th>
                  <th>Password</th>
                  <th>OTP</th>
                  <th>Share(%)</th>
                  <th>Commission Type</th>
                  <th>Match Comm(%)</th>
                  <th>Session Comm(%)</th>
                  <th>Chips</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {masterData.length > 0 ? (
                  masterData.map((row, index) => (
                    <tr key={row.id || index}>
                      <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{row.admin_id || "N/A"}</td>
                      <td>{row.username || "N/A"}</td>
                      <td>
                        <div>{row.super_admin_id || "N/A"}</div>
                        <small>{row.parent_username || "N/A"}</small>
                      </td>
                      <td>
                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td>
                        <div className="input-group input-group-sm" style={{ width: "120px" }}>
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            value={row.password || ""}
                            readOnly
                            style={{ background: "white" }}
                          />
                        </div>
                      </td>
                      <td>{row.admin_otp || "0"}</td>
                      <td className="text-center">{row.match_share || "0"}</td>
                      <td className="text-center">
                        {String(row.commission_type) === "1" ? "BBB" :
                          String(row.commission_type) === "0" ? "NOS" :
                            "N/A"}
                      </td>
                      <td className="text-center">{row.match_comm || "0"}</td>
                      <td className="text-center">{row.session_comm || "0"}</td>
                      <td className="text-center">₹{row.coins || "0"}</td>
                      <td>
                        <span className="badge bg-danger me-2">Inactive</span>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            setSelectedAgent(row);
                            setShowStatusModal(true);
                          }}
                          title="Activate Master"
                        >
                          Activate
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center text-muted">
                      {isSearching ? "Searching..." : "No inactive masters found"}
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

                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setShowStatusModal(false);
                        setSelectedAgent(null);
                      }}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <p className="mb-2">
                      <strong>Master Username:</strong> {selectedAgent.username}
                    </p>

                    <p className="mb-2">
                      <strong>Master Code:</strong>{" "}
                      {selectedAgent.code || selectedAgent.admin_id}
                    </p>

                    <p>
                      Status change to:
                      <strong>
                        {selectedAgent.active === 1 ? "Inactive" : "Active"}
                      </strong>
                    </p>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowStatusModal(false);
                        setSelectedAgent(null);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleStatusChange}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {/* Pagination */}
          {/* {totalPages > 1 && (
  <div className="d-flex justify-content-between align-items-center mt-4">
    

    <div>
      <span className="text-muted">
        Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
        {totalItems} entries
      </span>
    </div>
    <div className="d-flex align-items-center gap-2">

      <button
        variant="outline-primary"
        size="sm"
        disabled={currentPage === 1}
        onClick={handlePrev}
        className="px-3"
      >
        « Previous
      </button>

      <button
        variant="outline-primary"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={handleNext}
        className="px-3"
      >
        Next »
      </button>

    </div>
  </div>
)} */}



          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              {/* <div className="sohwingallentries d-flex align-items-center gap-3"> */}
              {/* Items per page dropdown */}
              {/* <div className="d-flex align-items-center gap-2">
        <span>Show</span>
        <select
          className="form-select form-select-sm"
          value={itemsPerPage}
          onChange={(e) => {
            const newItemsPerPage = parseInt(e.target.value);
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
            fetchAgentData(1, newItemsPerPage, searchTerm, filters);
          }}
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div> */}

              {/* Showing entries text */}
              {/* <div>
        Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
        {totalItems} entries
      </div> */}
              {/* </div> */}
              <div className="paginationall d-flex align-items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={handlePrev}
                  className="px-3"
                >
                  <MdOutlineKeyboardArrowLeft />
                </button>
                <div className="d-flex gap-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
         <button
  onClick={handleNext}
  disabled={currentPage >= totalPages || totalPages === 0}
>
  <MdOutlineKeyboardArrowRight />
</button>

              </div>
            </div>
          )}

        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default InActiveUserLists;