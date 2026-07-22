import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { FiSearch, FiSlash, FiUserCheck } from "react-icons/fi";
import {
  FaEdit,
  FaMoneyBillWave,
  FaHandHoldingUsd,
  FaKey,
  FaChartBar,
  FaCog,
  FaCogs,
  FaPlus,
  FaUserCheck,
  FaUserTimes,
  FaUnlock,
  FaLock,
  FaRegEdit,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner, Form, Button } from "react-bootstrap";
import {
  getBlockedChildList,
  toggleUserStatus,
  toggleUserBetLock,
} from "../../Server/api";
import { CgFileDocument, CgUnblock } from "react-icons/cg";

const BlockedChildLists = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);

  const getAdminId = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return parsedUser?.admin_id || "admin";
      }
      return "admin";
    } catch (error) {
      return "admin";
    }
  };

  const fetchChildList = async (page = currentPage) => {
    try {
      setLoading(true);
      const adminId = getAdminId();

      const res = await getBlockedChildList({
        admin_id: adminId,
        page: page,
        limit: limit,
        search: searchTerm,
      });

      const response = res.data;
      if (response.success) {
        setUsers(response.data || []);
        setTotalPages(response.pagination?.total_pages || 1);
        setCurrentPage(response.pagination?.current_page || 1);
        setTotalRecords(response.pagination?.total_records || 0);
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching child list:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildList(currentPage);
  }, [currentPage, searchTerm]);

  const handleUserClick = (userId) => {
    navigate(`/child/${userId}`);
  };

  // ✅ STATUS टॉगल - FIXED
  const handleStatusToggle = async (user, e) => {
    e.stopPropagation();
    try {
      const currentStatus = user.is_blocked === "1" ? 1 : 0;
      const newStatus = currentStatus === 1 ? 0 : 1;

      // ✅ payload में role और is_blocked STRING में भेजें
      const payload = {
        admin_id: user.admin_id || user._id,
        role: user.role?.toString() || "2",
        is_blocked: newStatus.toString(),
      };

      console.log("📤 Sending payload:", payload);

      const res = await toggleUserStatus(payload);

      console.log("📥 Response:", res);

      if (res.data.success) {
        toast.success(
          `User ${newStatus === 1 ? "Blocked" : "Unblocked"} successfully!`,
        );
        fetchChildList(currentPage);
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // ✅ BET LOCK/UNLOCK - FIXED
  const handleBetToggle = async (userId, currentBetLock, e) => {
    e.stopPropagation();
    try {
      const newBetLock = currentBetLock === 1 ? 0 : 1;
      const res = await toggleUserBetLock(userId, { is_bet_lock: newBetLock });
      if (res.data.success) {
        toast.success(
          `Bet ${newBetLock === 1 ? "Locked" : "Unlocked"} successfully!`,
        );
        fetchChildList(currentPage);
      } else {
        toast.error(res.data.message || "Failed to update bet status");
      }
    } catch (error) {
      console.error("Error toggling bet lock:", error);
      toast.error("Failed to update bet status");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchChildList(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  const [optionMenu, setOptionMenu] = useState(null);
  const toggleOptionMenu = (id) => {
    setOptionMenu(optionMenu === id ? null : id);
  };
  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="card">
        {/* <div className="card-header flex-wrap-mobile bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
          <h5 className="card-title mb-0">Blocked User Lists</h5>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-light"
            >
              ⬅ Back
            </button>
          </div>
        </div> */}

        <div className="card-body">
          <div className="row mb-3 align-items-center">
            <div className="col-md-6">
              <div className="d-flex">
                <div className="input-group me-2" style={{ width: "500px" }}>
                  <Form.Control
                    type="text"
                    placeholder="Search by user id..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button onClick={handleSearch} variant="warning">
                    <FiSearch />
                  </Button>
                </div>
              </div>
            </div>

            {/* 
            <div className="col-md-1">
              <Button variant="secondary" onClick={handleClearSearch}>
                Clear
              </Button>
            </div> */}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p>Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5">
              <h5>No Data Found</h5>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>USERNAME</th>
                      <th>CREDIT REF</th>
                      <th>BALANCE</th>
                      <th>P/L</th>
                      <th>EXPOSURE</th>
                      <th>CLIENT SHARE</th>
                      <th>UP-LINE</th>
                      <th>STATUS</th>
                      <th>BET</th>
                      <th>OPTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id || user.id || index}>
                        <td>
                          <div
                            onClick={() => handleUserClick(user._id || user.id)}
                            className="text-green"
                          >
                            <span className="badge badge-warning me-1">
                              {user.admin_id
                                ? user.admin_id.charAt(0).toUpperCase() === "A"
                                  ? "C"
                                  : user.admin_id.charAt(0).toUpperCase()
                                : "-"}
                            </span>
                            {user.username || user.name}
                          </div>
                          <span>
                            [
                            {user.username
                              ? user.username.split(" ")[0].substring(0, 10)
                              : "-"}
                            ]
                          </span>
                        </td>
                        <td>{user.admin_id || "-"}</td>
                        <td>
                          ₹{Number(user.coins || user.balance || 0).toFixed(2)}
                        </td>
                        <td
                          className={
                            user.profit_loss < 0
                              ? "text-danger"
                              : "text-success"
                          }
                        >
                          ₹{Number(user.profit_loss || 0).toFixed(2)}
                        </td>
                        <td>₹{Number(user.exposure || 0).toFixed(2)}</td>
                        <td>{user.match_share || user.client_share || 0}</td>
                        <td>{user.parent_username || user.up_line || "-"}</td>
                        <td className="text-center">
                          <span
                            className="btn btn-sm p-0 border-0 bg-transparent"
                            onClick={(e) => handleStatusToggle(user, e)}
                            title={
                              user.is_blocked === "1"
                                ? "Click to Unblock"
                                : "Click to Block"
                            }
                          >
                            {user.is_blocked === "1" ? (
                              <FaLock className="text-danger" />
                            ) : (
                              <FaUnlock className="text-success" />
                            )}
                          </span>
                        </td>
                        <td className="text-center">
                          <span
                            className="btn btn-sm p-0 border-0 bg-transparent"
                            onClick={(e) =>
                              handleBetToggle(
                                user._id || user.id,
                                user.is_bet_lock,
                                e,
                              )
                            }
                            title={
                              user.is_bet_lock === 1
                                ? "Click to Unlock Bet"
                                : "Click to Lock Bet"
                            }
                          >
                            {user.is_bet_lock === 1 ? (
                              <FaLock className="text-danger" />
                            ) : (
                              <FaUnlock className="text-success" />
                            )}
                          </span>
                        </td>
                        {/* <td>
                          <div className="d-flex flex-wrap gap-1">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/child/${user._id || user.id}/edit-profile`,
                                );
                              }}
                              title="Edit Profile"
                            >
                              <FaEdit />
                            </button>

                            <button
                              className="btn btn-sm btn-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/child/${user._id || user.id}/deposit`,
                                );
                              }}
                              title="Deposit"
                            >
                              <FaMoneyBillWave />
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/child/${user._id || user.id}/withdraw`,
                                );
                              }}
                              title="Withdraw"
                            >
                              <FaHandHoldingUsd />
                            </button>

                            <button
                              className="btn btn-sm btn-info"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/child/${user._id || user.id}/reset-password`,
                                );
                              }}
                              title="Password Reset"
                            >
                              <FaKey />
                            </button>

                            <button
                              className="btn btn-sm btn-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/reports/${user._id || user.id}`);
                              }}
                              title="Reports"
                            >
                              <FaChartBar />
                            </button>

                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/settings/${user._id || user.id}`);
                              }}
                              title="Settings"
                            >
                              <FaCog />
                            </button>
                          </div>
                        </td> */}

                        <td className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            {/* Plus Menu */}
                            <div className="position-relative d-inline-block">
                              <button
                                className="buttoncommon gradient-7"
                                onClick={() =>
                                  toggleOptionMenu(user._id || user.id)
                                }
                              >
                                <FaPlus />
                              </button>

                              {optionMenu === (user._id || user.id) && (
                                <div
                                  className="dropdown-menu show"
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    zIndex: 9999,
                                  }}
                                >
                                  <button
                                    className="dropdown-item"
                                    onClick={() => {
                                      navigate(
                                        `/CreateSuperAgent/${user._id || user.id}`,
                                      );
                                      setOptionMenu(null);
                                    }}
                                  >
                                    Master
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Edit */}
                            <button
                              className="buttoncommon gradient-9"
                              onClick={() =>
                                navigate(
                                  `/child/${user._id || user.id}/edit-profile`,
                                )
                              }
                              title="Edit Profile"
                            >
                              <FaRegEdit />
                            </button>

                            {/* Deposit */}
                            <button
                              className="buttoncommon gradient-10"
                              onClick={() =>
                                navigate(
                                  `/child/${user._id || user.id}/deposit`,
                                )
                              }
                              title="Deposit"
                            >
                              <span>D</span>
                            </button>

                            {/* Withdraw */}
                            <button
                              className="buttoncommon gradient-2"
                              onClick={() =>
                                navigate(
                                  `/child/${user._id || user.id}/withdraw`,
                                )
                              }
                              title="Withdraw"
                            >
                              <span>W</span>
                            </button>

                            {/* Password */}
                            <button
                              className="buttoncommon gradient-6"
                              onClick={() =>
                                navigate(
                                  `/child/${user._id || user.id}/reset-password`,
                                )
                              }
                              title="Reset Password"
                            >
                              <span>P</span>
                            </button>

                            {/* Reports */}
                            <button
                              className="btn gradient-8 btn-rounded"
                              // onClick={() => {
                              //   setSelectedAgent(user);
                              //   setShowReportModal(true);
                              // }}
                              title="Reports"
                            >
                              <span>R</span>
                            </button>

                            {/* Settings */}
                            <button
                              className="btn gradient-4 btn-rounded"
                              // onClick={() => {
                              //   setSelectedAgent(user);
                              //   setShowSettingModal(true);
                              // }}
                              title="Settings"
                            >
                              <FaCogs />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-4">
                  {/* <div className="sohwingallentries">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, totalRecords)} of{" "}
                    {totalRecords} entries
                  </div> */}

                  <div className="paginationall d-flex align-items-center gap-1">
                    <button
                      disabled={currentPage === 1}
                      onClick={handlePrev}
                      className="btn-prev"
                    >
                      <MdOutlineKeyboardArrowLeft /> Previous
                    </button>

                    <div className="d-flex gap-1">
                      {getPageNumbers().map((page) => (
                        <div
                          key={page}
                          className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                          onClick={() => handlePageClick(page)}
                        >
                          {page}
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={handleNext}
                      className="btn-next"
                    >
                      Next <MdOutlineKeyboardArrowRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlockedChildLists;
