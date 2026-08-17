import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import {
  FaInfoCircle,
  FaLock,
  FaUnlock,
  FaStickyNote,
  FaTrashAlt,
  FaEdit,
  FaWallet,
  FaGamepad,
} from "react-icons/fa";
import {
  getAllUsersList,
  deleteUser,
  clearuserexposure,
  updateUserStatus,
  depositToUser,
  withdrawFromUser,
  blockUser,
} from "../Server/api";
import { FaPlus, FaMinus, FaEye } from "react-icons/fa";

function Agentlist() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [depositType, setDepositType] = useState("admin");
  const [tableLoading, setTableLoading] = useState(false);
  const navigate = useNavigate();

  const [Adduser, setAdduser] = useState(false);
  const AdduserOpenModalall = () => setAdduser(true);
  const AdduserCloseModalall = () => setAdduser(false);
  const handleOpenModalall = () => setShowModal(true);
  const handleCloseModalall = () => setShowModal(false);
    const [changestatus, setChangestatus] = useState(false);
  
    const Changestatusopen = () => {
      setChangestatus(true);
    };
  
    const Changestatusclose = () => {
      setChangestatus(false);
    };
  // Filters state
  const [filters, setFilters] = useState({
    active: "",
    userId: "",
    mobile: "",
    fromDate: "",
    toDate: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const fetchUsers = async (
    page = pagination.page,
    limit = pagination.limit,
  ) => {
    // setLoading(true);
    setTableLoading(true);
    try {
      const params = {
        page,
        limit,
        active: filters.active,
        userId: filters.userId,
        mobile: filters.mobile,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };
      const response = await getAllUsersList(params);
      if (response.data && response.data.success) {
        setUsers(response.data.data);
        setPagination((prev) => ({
          ...prev,
          page: response.data.pagination.page,
          total: response.data.pagination.totalRecords,
          totalPages: response.data.pagination.totalPages,
          limit: response.data.pagination.limit,
        }));
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        Swal.fire("Error", "Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      // setLoading(false);
      setTableLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "User exposure will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        const result = await deleteUser(userId);
        if (result.data.success) {
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers(pagination.page);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to delete user",
          "error",
        );
      }
    }
  };
  const handleDeleteExposure = async (userId) => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        const result = await clearuserexposure(userId);

        if (result.data.success) {
          Swal.fire("Deleted!", "User exposure cleared.", "success");
          fetchUsers(pagination.page);
        }
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to delete exposure",
          "error"
        );
      }
    }
  };
  const applyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
    setFilter(false);
  };
  const resetFilters = () => {
    setFilters({
      active: "",
      search: "",
      userId: "",
      mobile: "",
      name: "",
      fromDate: "",
      toDate: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers(1, pagination.limit);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchUsers(newPage, pagination.limit);
  };

  const handleOpenModal = (type, user) => {
    setModalType(type);
    setSelectedUser(user);
    setAmount("");
    setRemarks("");
    setDepositType("admin");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClick = async () => {
    if (loading) return; // extra safety

    setLoading(true);
    try {
      await handleTransaction(); // tumhara original function
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleTransaction = async () => {
    if (!amount || amount <= 0) {
      Swal.fire("Error", "Please enter a valid amount", "error");
      return;
    }
    try {
      let response;
      if (modalType === "add") {
        response = await depositToUser(
          selectedUser._id,
          Number(amount),
          remarks,
          depositType,
        );
      } else {
        response = await withdrawFromUser(
          selectedUser._id,
          Number(amount),
          remarks,
          depositType,
        );
      }

      if (response.data.success) {
        Swal.fire({
          title: "Success!",
          html: `
        <p>${response.data.message}</p>
        <div class="mt-3">
          <p><strong>User:</strong> ${selectedUser?.username || selectedUser?.mobile
            }</p>
          <p><strong>Previous Balance:</strong> ₹ ${response.data.data.previousBalance || selectedUser?.credit || 0
            }</p>
          <p><strong>${modalType === "add" ? "Added" : "Withdrawn"
            }:</strong> ₹ ${amount}</p>
        </div>
        `,
          icon: "success",
        });
        fetchUsers(pagination.page);
        handleCloseModal();
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Transaction failed",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };

  const handleBlockToggle = async (userId, isBlocked) => {
    const confirm = await Swal.fire({
      title: isBlocked ? "Unblock User?" : "Block User?",
      text: isBlocked
        ? "Do you really want to unblock this user?"
        : "Do you really want to block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Yes, Unblock" : "Yes, Block",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await blockUser(userId);
      if (response.data.success) {
        Swal.fire(
          isBlocked ? "Unblocked!" : "Blocked!",
          response.data.message,
          "success",
        );
        fetchUsers(pagination.page);
      } else {
        Swal.fire(
          "Error",
          response.data.message || "Unable to update user block status",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    }
  };
  const handleExposureClick = (userId) => {
    navigate(`/user-bets-exposer-details/${userId}`, {
      state: { userId: userId },
    });
  };

  const handleBetSettledClick = (userId) => {
    navigate(`/user-settled-bets-details/${userId}`, {
      state: { userId: userId },
    });
  };
  const [summary, setSummary] = useState({
    totalBalance: '47,341,494.08',
    totalExposure: '45,035.20',
    totalAvailableBalance: '47,296,458.88',
    balance: '10,385,474.21',
    availableBalance: '57,681,933.09',
    totalPlayerBalance: '288,511.23'
  });

  return (
    <>
      <div className="allcommon">
        {/* Search and Filter Section */}
        <section className="find-member-sec py-3 pb-0 pt-0" style={{ marginTop: 5 }}>
          <div className="p-0">
            <h4 className="page-title">Clients</h4>
            <div className="row">
              <div className="mb-md-0 mb-3 col-xl-12">
                <div className="row">
                  <div className="d-flex flex-wrap col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                    <form id="searchForm" className="">
                      <div className="position-relative">
                        <input
                          placeholder="Find member..."
                          type="text"
                          className="form-control"

                        />
                        <button
                          type="submit"
                          className="search-btn s-btn btn btn-primary"
                        >
                          Search
                        </button>
                      </div>
                      <div className="d-flex align-items-center ps-2">
                        <label className="pe-3 mb-0 form-label">Status</label>
                        <select
                          aria-label="Default select example"
                          className="form-select"

                        >
                          <option value="">All</option>
                          <option value="active">Active</option>
                          <option value="suspend">Suspend</option>
                          <option value="locked">Locked</option>
                        </select>
                      </div>
                    </form>
                    <div className="agent-path mb-3" />
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="d-flex flex-wrap justify-content-end">
                      <div className="find-member-director text-xl-end ">
                        <Link to="#" className="btn" onClick={AdduserOpenModalall}>
                          <i className="fas fa-user-plus pe-1" /> Add User
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="total-balance-sec d-flex justify-content-center align-items-center">
          <ul className="list-unstyled detail-header mb-2" style={{ width: "98.5%" }}>
            <li>
              <dt>Total Balance</dt>
              <strong>INR {summary.totalBalance}</strong>
            </li>
            <li>
              <dt>Total Exposure</dt>
              <strong>
                INR <span>{summary.totalExposure}</span>
              </strong>
            </li>
            <li>
              <dt>Total Avail. bal.</dt>
              <strong>INR {summary.totalAvailableBalance}</strong>
            </li>
            <li>
              <dt>Balance</dt>
              <strong>INR {summary.balance}</strong>
            </li>
            <li>
              <dt>Available Balance</dt>
              <strong>INR {summary.availableBalance}</strong>
            </li>
            <li>
              <dt>Total Player Balance</dt>
              <strong>INR {summary.totalPlayerBalance}</strong>
            </li>
          </ul>
        </section>
        <section className="find-member-sec py-3 pb-0 pt-0">

          <div className="card account-table home-table">
            {/* <div className="card-header p-2 text-white d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">All User List</h3>
          <div className="gap-1 d-flex justify-content-between align-items-center">
            <button
              className="btn btn-light me-2"
              onClick={() => navigate("/create-users")}
            >
              Create User
            </button>
            <button
              className="btn btn-light"
              onClick={() => setFilter((prev) => !prev)}
            >
              <MdFilterListAlt /> Filter
            </button>
          </div>
        </div> */}


            {/* {filter && (
          <div className="card-body border-bottom">
            <div className="row g-3">
              <div className="col-md-4">
                <label>Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mobile"
                  value={filters.mobile}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, mobile: e.target.value }))
                  }
                />
              </div>
              <div className="col-md-2 d-flex align-items-end gap-2">
                <button className="btn btn-primary1" onClick={applyFilters}>
                  Apply
                </button>
                <button className="btn btn-secondary" onClick={resetFilters}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        )} */}
            <div className="home-table table-responsive">

              <table id="export-table" className="client-tabel table">
                <thead>
                  <tr>
                    <th scope="col" className="text-center">
                      Account
                    </th>
                    <th scope="col" className="text-center">
                      Credit Ref.
                    </th>{" "}
                    <th scope="col" className="text-center">
                      Balance
                    </th>
                    <th scope="col" className="text-center">
                      Exposure
                    </th>
                    <th scope="col" className="text-center">
                      Avail. bal.{" "}
                    </th>
                    <th scope="col" className="text-center">
                      Exposure Limit
                    </th>
                    <th scope="col" className="text-center">
                      Reference P/L
                    </th>
                    <th scope="col" className="text-center">
                      Current P/L
                    </th>
                    <th scope="col" className="text-center">
                      B Lock
                    </th>
                    <th scope="col" className="text-center">
                      Status
                    </th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td />
                    <td className="text-end">1,050.00</td>
                    <td className="text-end">0.0</td>
                    <td className="text-end">87.22</td>
                    <td className="text-end">0.00</td>
                    <td className="text-end"> 87.22</td>
                    <td className="text-end">87.22</td>
                    <td className="text-end ul-t" />
                    <td className="text-end" />
                    <td /> <td />
                  </tr>
                  <tr>
                    <td className="text-start">
                      <a href="#" className="text-primary">
                        <span>CL</span>
                      </a>
                      1820
                    </td>
                    <td className="text-end">
                      <a href="#" onClick={handleOpenModalall} className="text-primary">
                        1,050.00 <i className="fas fa-pen ps-1" />
                      </a>
                    </td>
                    <td className="text-primary text-end">2.23</td>
                    <td className="text-end">
                      <a href="/686b99e23b16954f6d69eccc/agent">
                        <span className="status-suspend1">0.00</span>
                      </a>
                    </td>
                    <td className="text-end">2.23</td>
                    <td className="text-end">200,000.00</td>
                    <td className="text-end ul-t">
                      <span style={{ color: "red" }}>1,047.77</span>
                    </td>
                    <td className="text-end">
                      <span style={{ color: "green" }}>0</span>
                    </td>
                    <td className="text-end b-lock">
                      {" "}
                      <div className="">
                        <input
                          type="checkbox"
                          id="default-checkbox"
                          className="form-check-input"
                        />
                      </div>
                    </td>
                    <td className="text-end">
                      <strong className="status-active">Active</strong>
                    </td>
                    <td className="action_link text-end">
                      <a
                        title="Betting Profit Loss"
                        className="btn"
                        href="/betting-profit-loss"
                      >
                        <i className="fas fa-exchange-alt swap-icon" />
                      </a>
                      <a
                        title="Betting History"
                        className="btn"
                        href="/betting-history"
                      >
                        <i className="fas fa-th-list" />
                      </a>

                      <a title="Change Status" className="btn" onClick={Changestatusopen}>
                        <i className="fas fa-cog" />
                      </a>
                      <a
                        title="Account Summary"
                        className="btn"
                        href="/account-summary"
                      >
                        <i className="fas fa-user" />
                      </a>
                    </td>
                  </tr>
               
                </tbody>
              </table>




            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <>

                <div className="bottom-pagination">
                  <ul role="navigation" className="d-flex gap-2 align-items-center justify-content-center" aria-label="Pagination">
                    <li className="previous disabled">
                      <a
                        className=" "
                        tabIndex={-1}
                        role="button"
                        aria-disabled="true"
                        aria-label="Previous page"
                        rel="prev"
                        onClick={() => handlePageChange(pagination.page - 1)}
                      >
                        &lt;
                      </a>
                    </li>
                    <li className="p-0 d-flex gap-2 ">
                      {[pagination.page - 1, pagination.page, pagination.page + 1]
                        .filter((p) => p > 0 && p <= pagination.totalPages)
                        .map((p) => (
                          <div className="" key={p}>
                            <a
                              rel="canonical"
                              role="button"
                              className="pagintion-li"
                              tabIndex={-1}
                              aria-label="Page 1 is your current page"
                              aria-current="page"
                              onClick={() => handlePageChange(p)}
                            >
                              {p}
                            </a>
                          </div>
                          // <li

                          //   className={`pagintion-li ${pagination.page === p ? "active" : ""
                          //     }`}
                          // >
                          //   <button
                          //     className="page-link"
                          //     onClick={() => handlePageChange(p)}
                          //   >
                          //     {p}
                          //   </button>
                          // </li>
                        ))}

                    </li>
                    <li className="next disabled">
                      <a
                        className=" "
                        tabIndex={-1}
                        role="button"
                        aria-disabled="true"
                        aria-label="Next page"
                        rel="next"
                        onClick={() => handlePageChange(pagination.page + 1)}
                      >
                        {" "}
                        &gt;
                      </a>
                    </li>
                  </ul>
                </div>

                {/* <div className="card-footer d-flex justify-content-between align-items-center">
              <span className="text-muted small">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} All users
              </span>

              <ul className="custom-pagination pagination mb-0">
                <li
                  className={`page-item ${pagination.page === 1 ? "disabled" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    &laquo;
                  </button>
                </li>

                {[pagination.page - 1, pagination.page, pagination.page + 1]
                  .filter((p) => p > 0 && p <= pagination.totalPages)
                  .map((p) => (
                    <li
                      key={p}
                      className={`pagintion-li ${pagination.page === p ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(p)}
                      >
                        {p}
                      </button>
                    </li>
                  ))}

                <li
                  className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page + 1)}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </div> */}
              </>
            )}
          </div>
        </section>
      </div>
      {Adduser && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={AdduserCloseModalall}
          >
            <div
              className="modal-dialog modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">Add User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={AdduserCloseModalall}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="super-admin-form">
                    <div className="row">
                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Email</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter Email"
                              name="email"
                              type="email"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Username</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter username"
                              name="username"
                              type="text"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">First Name</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter firstName"
                              name="firstName"
                              type="text"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Last Name</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter lastName"
                              name="lastName"
                              type="text"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Password</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter Password"
                              name="password"
                              type="password"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Confirm Password</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Confirm Password"
                              name="confirmPassword"
                              type="password"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Phone</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter Phone Number"
                              name="phone"
                              type="text"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-2 mb-md-3 col-sm-12">
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">Exposure Limit</label>
                          </div>
                          <div className="col-md-8">
                            <input
                              placeholder="Enter Exposure Limit"
                              name="exposureLimit"
                              type="number"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <button type="submit" className="theme_dark_btn px-5 btn btn-primary">
                        Create
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="allcommon">
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={handleCloseModalall}
          >
            <div
              className="modal-dialog modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="common-heading">Withdraw Amount Edit</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModalall}
                  ></button>
                </div>
                <div className="modal-body">
                  <form className="change-password-sec">
                    <h4 className="h4 mb-3 curent-value">
                      <label>Current :</label> <strong>1,050.00</strong>
                    </h4>
                    <div className="mb-2 d-flex align-items-center">
                      <label className="me-2">New</label>
                      <input
                        placeholder="Enter Withdraw Amount"
                        name="reference_amount"
                        type="number"
                        className="w-sm-50  form-control"
                      />
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                      <label className="me-2">Password</label>
                      <input
                        placeholder="Enter Password"
                        name="mypassword"
                        type="password"
                        className="w-sm-50  form-control"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <button type="submit" className="theme_dark_btn btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </form>

                </div>

              </div>
            </div>
          </div>
        </div>
      )}
      

      {changestatus && (
        <div className="allcommon">
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={Changestatusclose}
        >
          <div
            className="modal-dialog modal-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="common-heading">Change Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={Changestatusclose}
                ></button>
              </div>
              <div className="modal-body">
                  <div className="test-status">
                    <div className="status-row d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">
                        <span>Agent </span> Abhishek Gandhi
                      </h6>

                      <small className="text-capitalize">{status}</small>
                    </div>

                    <div className="changestatus-option">
                      <ul className="list-unstyled mb-0 d-flex justify-content-around">
                        <li className={status === "active" ? "active" : ""}>
                          <button
                            type="button"
                            className="border-0 bg-transparent"
                            onClick={() => setStatus("active")}
                          >
                            <i className="far fa-check-circle" />
                            <span>Active</span>
                          </button>
                        </li>

                        <li className={status === "suspend" ? "active" : ""}>
                          <button
                            type="button"
                            className="border-0 bg-transparent"
                            onClick={() => setStatus("suspend")}
                          >
                            <i className="fas fa-ban" />
                            <span>Suspend</span>
                          </button>
                        </li>

                        <li className={status === "locked" ? "active" : ""}>
                          <button
                            type="button"
                            className="border-0 bg-transparent"
                            onClick={() => setStatus("locked")}
                          >
                            <i className="fas fa-lock" />
                            <span>Locked</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="py-3 px-3 change-status-form">
                    <form
                      className="d-flex align-items-center"
                    >
                      <div className="d-flex align-items-center f-group">
                        <label className="pe-2 mb-0 form-label">
                          Password
                        </label>

                        <div className="witherror">
                          <input
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn theme_dark_btn btn-primary ms-2"
                      >
                        Change
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Agentlist;
