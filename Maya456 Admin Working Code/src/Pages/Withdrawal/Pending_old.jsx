import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from 'moment';

const Pending = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const limit = 10;

  const ucWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/withdraw-pending-list`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            page: page.toString(),
            limit: limit.toString(),
          }),
        }
      );

      const result = await res.json();

      if (result.success === "1") {
        setWithdrawList(result.data || []);
        setTotalPages(Number(result.totalNumberPage) || 1);
      } else {
        console.error("API Error:", result.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawList(currentPage);
  }, [currentPage, userId]);

  const handleAction = async (id, actionType) => {
    let apiUrl = "";
    let newStatus = "";

    if (actionType === "success") {
      apiUrl = `${process.env.REACT_APP_API_URL}/withdraw-status-update`;
      newStatus = "success";
    } else if (actionType === "reject") {
      apiUrl = `${process.env.REACT_APP_API_URL}/withdraw-status-update`;
      newStatus = "reject";
    }

    // try {
    //   const response = await fetch(apiUrl, {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       id: id,
    //       status: newStatus,
    //     }),
    //   });

    //   const result = await response.json();
    //   if (result.success === "1") {
    //     alert(`Withdraw request ${newStatus} successfully.`);
    //     fetchWithdrawList(currentPage);
    //   } else {
    //     alert(result.message || "Action failed");
    //   }
    // } catch (error) {
    //   console.error("Status update error:", error);
    //   alert("Something went wrong");
    // }
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (result.success === "1") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Withdraw request ${newStatus} successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        fetchWithdrawList(currentPage);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: result.message || "Action failed",
        });
      }
    } catch (error) {
      console.error("Status update error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
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

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>Withdraw Pending List</h3>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name / mobile / amount/bank name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>User Name</th>
                <th>Mobile</th>
                <th>Amount (₹)</th>
                <th>Account Number</th>
                <th>IFSC Code</th>
                <th>Bank Name</th>
                <th>A/C Holder Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? (
                filteredList.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * limit + index + 1}</td>
                    <td>{ucWords(item.user_name)}</td>
                    <td>{item.mobile}</td>
                    <td>{item.amount}</td>
                    <td>{item.account_number}</td>
                    <td>{item.ifsc_code}</td>
                    <td>{item.bank_name}</td>
                    <td>{ucWords(item.account_holder_name)}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === "pending"
                            ? "bg-warning text-white"
                            : item.status === "success"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {item.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>{item.date}</td>
                    {/* <td>{item.date_time}</td> */}
                    <td>{moment(item.date_time).format('DD-MM-YYYY hh:mm A')}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleAction(item._id, "success")}
                        >
                          Success
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleAction(item._id, "reject")}
                        >
                          Reject
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

          {/* Pagination Controls */}
          {filteredList.length > 0 && totalPages > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="paginationbutton"
                disabled={currentPage === 1}
                onClick={handlePrev}
              >
                Previous
              </button>
                            <span className="alllistnumber">

                Page {currentPage} of {totalPages}
              </span>
              <button
                className="paginationbutton"
                disabled={currentPage === totalPages}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pending;
