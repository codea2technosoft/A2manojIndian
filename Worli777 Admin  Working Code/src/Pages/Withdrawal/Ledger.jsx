import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";

const Pending = ({ userId }) => {
  const [withdrawList, setWithdrawList] = useState([]);
  const [ProfileList, setProfileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  const limit = 50;
  const lastSegment = window.location.pathname.split("/").pop();
  const ucWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const fetchWithdrawList = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}ledger-list`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: lastSegment,
          page: page.toString(),
          limit: limit.toString(),
        }),
      });

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
  const fetchProfileList = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}user-view?user_id=${lastSegment}`,
        {
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (result.success === "1") {
        setProfileList(result.data || []);
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
    fetchProfileList();
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
      {/* <div className="d-flex justify-content-between mb-3">
        <h3>Ledger</h3>
        <span>Total Deposit : {ProfileList.total_deposit}</span>
        <span>Total Deposit Count : {ProfileList.total_count_deposit}</span>
        <span>Total Withdraw : {ProfileList.total_withdraw}</span>
        <span>Total Withdraw Count : {ProfileList.total_count_withdraw}</span>
        //coment code  <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> */}
      <div className="card">
        <div className="card-header bg-dark text-white">
          <div className="d-flex justify-content-between align-items-center  ">
            <div className="card-title text-white">Ledger</div>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div className="d-flex flex-wrap justify-content-between w-100 mb-2 gap-2">
              <div className="bg-white p-2 rounded-2 border border-success border-opacity-25">
                <span className="text-muted small">Total Deposit:</span>
                <span className="ms-1 fw-semibold text-dark">
                  {ProfileList.total_deposit}
                </span>
              </div>

              <div className="bg-white p-2 rounded-2 border border-primary border-opacity-25">
                <span className="text-muted small">Deposit Count:</span>
                <span className="ms-1 fw-semibold text-dark">
                  {ProfileList.total_count_deposit}
                </span>
              </div>

              <div className="bg-white p-2 rounded-2 border border-danger border-opacity-25">
                <span className="text-muted small">Total Withdraw:</span>
                <span className="ms-1 fw-semibold text-dark">
                  {ProfileList.total_withdraw}
                </span>
              </div>

              <div className="bg-white p-2 rounded-2 border border-warning border-opacity-25">
                <span className="text-muted small">Withdraw Count:</span>
                <span className="ms-1 fw-semibold text-dark">
                  {ProfileList.total_count_withdraw}
                </span>
              </div>
              <div className="bg-white p-2 rounded-2 border border-warning border-opacity-25">
                <span className="text-muted small">Wallet Balance:</span>
                <span className="ms-1 fw-semibold text-dark">
                  {ProfileList.credit}
                </span>
              </div>
              <div className="bg-white p-2 rounded-2 border border-warning border-opacity-25">
                <span className="text-muted small">PL:</span>
                <span
                  className={`ms-1 fw-semibold ${
                    ProfileList.total_deposit -
                      ProfileList.total_withdraw -
                      ProfileList.credit >=
                    0
                      ? "text-success"
                      : "text-danger"
                  }`}
                >
                  {ProfileList.total_deposit -
                    ProfileList.total_withdraw -
                    ProfileList.credit}
                </span>
              </div>
            </div>
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
                      {/* <th>User Name</th> */}
                      {/* <th>Mobile</th> */}
                      <th>Type</th>
                      <th>Open Amount</th>
                      <th>Amount</th>
                      <th>Close Amount</th>
                      <th>Perticular</th>
                      <th>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length > 0 ? (
                      filteredList.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          {/* <td>{ucWords(item.username)}</td> */}
                          {/* <td>{item.mobile}</td> */}
                          <td
                            style={{
                              color: item.type === "deposit" ? "green" : "red",
                            }}
                          >
                            {item.type.charAt(0).toUpperCase() +
                              item.type.slice(1)}
                          </td>
                          <td>{item.open_amount}</td>
                          <td>{item.amount}</td>
                          <td>{item.close_amount}</td>
                          <td>{item.remark}</td>

                          <td>
                            {moment(item.date_time).format(
                              "DD-MM-YYYY hh:mm A"
                            )}
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
                <div className="d-flex paginationgridnew justify-content-between align-items-center mt-3">
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
      </div>
    </div>
  );
};

export default Pending;
