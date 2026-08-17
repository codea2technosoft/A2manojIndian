import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { MdFilterListAlt } from "react-icons/md";
import {
  updateWithdrawStatus,
  getAllPendingWithdrawRequests,
} from "../../Server/api";

const Pending = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const limit = 50;

  const ucWords = (str) => {
    if (!str) return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  const handleWithdrawAction = async (id, actionType, currentRemark = "") => {
    const { value: notes } = await Swal.fire({
      title: `${actionType === "approved" ? "Approve" : "Reject"} Withdraw`,
      input: "textarea",
      inputLabel:
        actionType === "rejected"
          ? "Reason for Rejection (Required)"
          : "Add Remark (Optional)",
      inputPlaceholder: currentRemark
        ? `Current: ${currentRemark}`
        : "Enter notes...",
      inputValue: currentRemark || "",
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionType}`,
      inputValidator: (value) => {
        if (actionType === "rejected" && !value.trim()) {
          return "Rejection reason is required!";
        }
      },
    });

    if (notes === undefined) return;

    try {
      const payload = {
        status: actionType === "approved" ? "approved" : "rejected",
        notes: notes || "",
      };

      const response = await updateWithdrawStatus(id, payload);
      const result = response.data;

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message || `Withdraw ${actionType} successfully`,
        });
        fetchWithdrawList(currentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Withdraw update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update withdraw status.",
      });
    }
  };

  const filteredList = withdrawList.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.user_name?.toLowerCase().includes(search) ||
      item.amount?.toString().includes(search) ||
      item.mobile?.toString().includes(search) ||
      item.bank_name?.toLowerCase().includes(search)
    );
  });

  const handleActionLedger = (userId, admin_id) => {
    localStorage.setItem("user_id", userId);
    localStorage.setItem("admin_id", admin_id);
    navigate(`/userwallet/${userId}`);
  };

  const [fillter, setFillter] = useState(false);
  const fillterdata = () => {
    setFillter((prev) => !prev);
  };

  const [FilterUsername, setFilterUsername] = useState("");
  const [FilterAccountNumber, setFilterAccountNumber] = useState("");
  const [FilterMin, setFilterMin] = useState("");
  const [FilterMax, setFilterMax] = useState("");
  const [selectedStartDate, setselectedStartDate] = useState("");
  const [selectedEndDate, setselectedEndDate] = useState("");

  const handleSearchChangeusername = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterUsername(value);
  };

  const handleSearchChangeAccountNumber = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterAccountNumber(value);
  };

  const handleSearchChangeMin = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMin(value);
  };

  const handleSearchChangeMax = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterMax(value);
  };

  const handleFilter = (e) => {
    fetchWithdrawList();
  };

  // const fetchWithdrawList = async (page = 1) => {
  //   setLoading(true);
  //   try {
  //     const params = {
  //       page: page,
  //       limit: limit,
  //       status: "Pending",
  //       // Add filters if needed
  //       // user_name: FilterUsername,
  //       // min: FilterMin,
  //       // max: FilterMax,
  //       // startDate: selectedStartDate,
  //       // endDate: selectedEndDate,
  //       // AccountNumber: FilterAccountNumber,
  //     };

  //     const response = await getAllPendingWithdrawRequests(params);
  //     const result = response.data;

  //     if (result.success === true) {
  //       // Map exactly what API returns
  //       const mappedData = result.data.map((item) => ({
  //         _id: item._id,
  //         user_id: item.user_id?._id || item.userId?._id,
  //         user_name: item.user_id?.username || item.userId?.username || item.userName || "",
  //         mobile: item.user_id?.mobile || item.userId?.mobile || item.mobile || "",
  //         amount: item.amount || 0,
  //         admin_id: item.admin_id || "",
  //         userId: item.user_id || item.userId,
  //         account_number: item.accountNumber || "",
  //         ifsc_code: item.ifscCode || "",
  //         bank_name: item.bankName || "",
  //         account_holder_name: item.accountHolderName || "",
  //         status: item.status || "",
  //         date_time: item.createdAt || item.requestDate || "",
  //         agent_name: item.agent_id || item.agentName || "",
  //         alltime_deposit: item.total_deposit || 0,
  //         alltime_withdrawal: item.total_withdraw || 0,
  //         remark: item.notes || item.remark || "",
  //       }));

  //       setWithdrawList(mappedData || []);
  //       setTotalPages(result.pagination?.totalPages || 1);
  //       setCurrentPage(result.pagination?.page || 1);
  //     } else {
  //       setWithdrawList([]);
  //       console.error("API Error:", result.message);
  //     }
  //   } catch (error) {
  //     console.error("Fetch Error:", error);
  //     setWithdrawList([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: limit,
        status: "Pending",
      };

      const response = await getAllPendingWithdrawRequests(params);
      const result = response.data;

      if (result.success === true) {
        // Map exactly what API returns
        const mappedData = result.data.map((item) => ({
          _id: item._id,
          user_id: item.userId, // ✅ Direct userId string hai
          user_name: item.userName || item.user_id?.username || "",
          mobile: item.mobile || item.user_id?.mobile || "",
          amount: item.amount || 0,
          // /admin_id: item.agent_id || "",
          admin_id: item.user_details?.user_id || "",
          userId: item.userId, // ✅ Direct userId
          account_number: item.accountNumber || "",
          ifsc_code: item.ifscCode || "",
          bank_name: item.bankName || "",
          account_holder_name: item.accountHolderName || "",
          status: item.status || "",
          date_time: item.createdAt || item.requestDate || "",
          agent_name: item.admin_details?.username || item.agent_id || "-",
          alltime_deposit: item.total_deposit || 0,
          alltime_withdrawal: item.total_withdraw || 0,
          remark: item.remark || item.note || "",
        }));

        setWithdrawList(mappedData || []);
        setTotalPages(result.pagination?.totalPages || 1);
        setCurrentPage(result.pagination?.page || 1);
      } else {
        setWithdrawList([]);
        console.error("API Error:", result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setWithdrawList([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="allcommon">
        <section className="main-inner-outer py-3">
          <div className="container-fluid">
            <div className="db-sec">
              <h2 className="common-heading">Wallet Withdrawal</h2>
            </div>
            <div className="inner-wrapper">
              <div className="common-container">
                <div className="account-table batting-table">
                  <div className="responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Sr no.</th>
                          <th scope="col">User Name</th>
                          <th scope="col">Account Name</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Bank Account</th>
                          <th scope="col">IFSC Code</th>
                          <th scope="col">Mobile Number</th>
                          <th scope="col">Agent Name</th>
                          <th scope="col">Alltime Deposit</th>
                          <th scope="col">Alltime Withdrawal</th>
                          <th scope="col">Created Date</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="12" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : filteredList.length > 0 ? (
                          filteredList.map((item, index) => (
                            <tr key={item._id}>
                              <td>{(currentPage - 1) * limit + index + 1}</td>
                              <td>
                                <span
                                  style={{
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    color: "blue",
                                    fontSize: 14
                                  }}
                                  onClick={() => handleActionLedger(item.user_id, item.admin_id)}
                                >
                                  {ucWords(item.user_name)}
                                </span>
                              </td>
                              <td>{ucWords(item.account_holder_name)}</td>
                              <td>{item.amount}</td>
                              <td>{item.account_number}</td>
                              <td>{item.ifsc_code}</td>
                              <td>{item.mobile || "-"}</td>
                              <td>{item.agent_name || "-"}</td>
                              <td>{item.alltime_deposit}</td>
                              <td>{item.alltime_withdrawal}</td>
                              <td>
                                {item.date_time ? moment(item.date_time).format("DD/MM/YYYY, HH:mm:ss") : "-"}
                              </td>
                              <td>
                                <div className="d-flex flex-column gap-1">
                                  <button
                                    className="btn btn-sm btn-success"
                                    style={{
                                      background: "green",
                                      color: "white",
                                      marginBottom: 4,
                                      fontSize: "12px",
                                      padding: "4px 12px"
                                    }}
                                    onClick={() =>
                                      handleWithdrawAction(item._id, "approved")
                                    }
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    style={{
                                      background: "red",
                                      color: "white",
                                      fontSize: "12px",
                                      padding: "4px 12px"
                                    }}
                                    onClick={() =>
                                      handleWithdrawAction(
                                        item._id,
                                        "rejected",
                                        item.remark
                                      )
                                    }
                                  >
                                    Decline
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="12" className="text-center">
                              No pending withdrawals found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Pending;