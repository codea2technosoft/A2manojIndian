import React, { useEffect, useState } from "react";
import {
  getUserChildList,
  addUserNewTransaction,
  getMyLedgerTxnUser,
} from "../../Server/api";
import { useSearchParams } from "react-router-dom";
import { FaEye, FaChartBar, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../Common/Loader";

function UserLedger() {
  const [searchParams] = useSearchParams();
  const master_id = searchParams.get("master_id");
  console.log(master_id, "master_id");
  const [users, setMasters] = useState([]);
  const [lenaList, setLenaList] = useState([]);
  const [denaList, setDenaList] = useState([]);
  const [clearList, setClearList] = useState([]);
  const [totals, setTotals] = useState({
    lena: 0,
    dena: 0,
    clear: 0,
  });

  // Date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  // State for Send modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [transactionData, setTransactionData] = useState({
    amount: "",
    collection: "CASH",
    payment_type: "cr",
    date: new Date().toISOString().split("T")[0],
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const formatUsername = (username) => {
    if (!username) return "N/A";
    return username.replace(/_/g, " ");
  };

  // Set default dates (last 7 days)
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatDateInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setFromDate(formatDateInput(sevenDaysAgo));
    setToDate(formatDateInput(today));
  }, []);

  useEffect(() => {
    if (fromDate && toDate && master_id) {
      fetchMasters();
    }
  }, [master_id, fromDate, toDate]);

  const fetchMasters = async () => {
    try {
      setLoading(true);
      setIsFiltering(true);
      const res = await getUserChildList({
        role: 5,
        admin_id: master_id,
        from_date: fromDate,
        to_date: toDate,
      });
      const apiData = res.data.data;
      setTotals(
        apiData.total || {
          lena: 0,
          dena: 0,
          clear: 0,
        },
      );
      setLenaList(apiData.lena || []);
      setDenaList(apiData.dena || []);
      setClearList(apiData.clear || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  };

  // Handle Filter button click
  const handleFilter = () => {
    if (fromDate && toDate && master_id) {
      fetchMasters();
    } else if (!master_id) {
      alert("Master ID not found");
    } else {
      alert("Please select both From and To dates");
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleFilter();
    }
  };

  // Handle Send button click - with section parameter
  const handleSendClick = (agent, section) => {
    setSelectedAgent(agent);
    setSelectedSection(section);
    setShowSendModal(true);

    // In Plus (Profit) -> "cr" (Payment Diya)
    // In Minus (Loss) -> "dr" (Payment Liya)
    const paymentType = section === "lena" ? "cr" : "dr";
    const amountValue = agent?.amount ? agent.amount.toString() : "";

    setTransactionData({
      amount: amountValue,
      collection: "CASH",
      payment_type: paymentType,
      date: new Date().toISOString().split("T")[0],
      comment: "",
    });
  };

  // Handle transaction input change
  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit transaction - using addUserNewTransaction API
  const handleSubmitTransaction = async () => {
    if (!transactionData.amount || !transactionData.date) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all required fields",
        confirmButtonColor: "#d33",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        send_to_admin_id: "admin",
        admin_id:
          selectedAgent?.admin_id || localStorage.getItem("selectedAdminId"),
        amount: parseFloat(transactionData.amount),
        collection: transactionData.collection,
        comment: transactionData.comment || "",
        date: transactionData.date,
        payment_type: transactionData.payment_type,
      };

      const response = await addUserNewTransaction(payload);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Transaction added successfully!",
          timer: 3000,
          showConfirmButton: true,
          confirmButtonColor: "#28a745",
        });
        setShowSendModal(false);
        setSelectedAgent(null);
        fetchMasters();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: response.data.message || "Failed to add transaction",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error adding transaction",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Reset
  const handleReset = () => {
    const amountValue = selectedAgent?.amount
      ? selectedAgent.amount.toString()
      : "";
    const paymentType = selectedSection === "lena" ? "cr" : "dr";
    setTransactionData({
      amount: amountValue,
      collection: "CASH",
      payment_type: paymentType,
      date: new Date().toISOString().split("T")[0],
      comment: "",
    });
  };

  // Format date for display (DD-MM-YYYY)
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const totalAmount = users.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  return (
    <>
      <div className="card py-1">
        <div className="card-header border-0 flex-wrap-mobile bg-primary-yellow d-flex justify-content-between align-items-md-center gap-2">
          <h3 className="card-title mb-0">Balance Sheet</h3>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: "150px" }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: "150px" }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="btn btn-primary"
              onClick={handleFilter}
              disabled={isFiltering}
            >
              {isFiltering ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </span>
              ) : (
                <>
                  <FaSearch />
                </>
              )}
            </button>
            <div className="btn btn-outline-light" onClick={() => navigate(-1)}>
              Back
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="card-body">
          {loading ? (
            <div className="py-5">
              <Loader />
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card ledger-card">
                  <div className="ledger-header card-header py-2 lena">
                    <h3 className="card-title mb-0">Client In Plus (Profit)</h3>
                    <span className="text-success">
                      {totals.lena.toFixed(2)}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="table-responsive height_scroll">
                      <table className="table table-bordered table-hover table-striped align-middle mb-0">
                        <thead className="table-light sticky_top">
                          <tr>
                            <th>Username</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {lenaList.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center py-4">
                                No Data
                              </td>
                            </tr>
                          ) : (
                            lenaList.map((m, index) => (
                              <tr key={m.id || index}>
                                <td>
                                  <span className="fw-semibold">
                                    {formatUsername(m.username)}
                                  </span>
                                </td>

                                <td className="fw-bold text-success">
                                  {Number(m.amount || 0).toFixed(2)}
                                </td>

                                <td>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      navigate(
                                        `/reports/user-settlement-report/${m.admin_id}`,
                                      )
                                    }
                                    title="History"
                                  >
                                    H
                                  </button>

                                  {/* <button
                  className="btn btn-sm btn-success ms-2"
                  onClick={() => handleSendClick(m, "lena")}
                  title="Send"
                >
                  S
                </button> */}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* In Minus (Loss) */}
              <div className="col-md-6">
                <div className="card ledger-card">
                  <div className="ledger-header card-header py-2 dena">
                    <h3 className="card-title mb-0">Client In Minus (Loss)</h3>
                    <span className="text-danger">
                      {totals.dena.toFixed(2)}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive height_scroll">
                      <table className="table table-bordered table-hover table-striped align-middle mb-0">
                        <thead className="table-light sticky_top">
                          <tr>
                            <th>Username</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {denaList.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center py-4">
                                No Data
                              </td>
                            </tr>
                          ) : (
                            denaList.map((m, index) => (
                              <tr key={m.admin_id || index}>
                                <td>
                                  <span className="fw-semibold">
                                    {formatUsername(m.username)}
                                  </span>
                                </td>

                                <td className="fw-bold text-danger">
                                  {Number(m.amount || 0).toFixed(2)}
                                </td>

                                <td>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      navigate(
                                        `/reports/user-settlement-report/${m.admin_id}`,
                                      )
                                    }
                                    title="Statement"
                                  >
                                    S
                                  </button>

                                  {/* <button
                  className="btn btn-sm btn-success ms-2"
                  onClick={() => handleSendClick(m, "dena")}
                  title="Send"
                >
                  S
                </button> */}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* CLEAR */}
              {/* <div className="col-md-4">
            <div className="card ledger-card">
              <div className="ledger-header clear">
                <span>CLEAR</span>
                <span>{totals.clear.toFixed(2)}</span>
              </div>
              <div className="ledger-table-head">
                <div className="w-50">Username</div>
                <div className="w-25 text-end">Amount</div>
                <div className="w-25 text-end">Action</div>
              </div>

              {clearList.length === 0 ? (
                <div className="no-data">No Data</div>
              ) : (
                clearList.map((m) => (
                  <div key={m.admin_id} className="ledger-row">
                    <div className="w-50 username-link">
                      <div>
                        <FaEye
                          className="action-icon"
                          onClick={() => {
                            localStorage.setItem(
                              "selectedMasterId",
                              m.admin_id,
                            );
                            navigate(
                              `/super-agent-ledger?master_id=${m.admin_id}`,
                            );
                          }}
                        />
                      </div>
                      <span>{m.username}</span>
                    </div>

                    <div className="w-25 text-end fw-semibold">
                      {m.amount ? m.amount.toFixed(2) : '0.00'}
                    </div>

                    <div className="w-25 text-end">
                      <FaChartBar
                        className="action-icon"
                        onClick={() =>
                          navigate(`/Usertransaction/${m.admin_id}`)
                        }
                      />
                      <button
                        className="btn btn-sm btn-info ms-1"
                        onClick={() => navigate(`/user-settlement-report/${m.admin_id}`)}
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        title="History"
                      >
                        H
                      </button>
                      <button
                        className="btn btn-sm btn-success ms-1"
                        onClick={() => handleSendClick(m, "clear")}
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        title="Send"
                      >
                        S
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div> */}
            </div>
          )}
        </div>

        {showSendModal && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div
                  className={`modal-header ${
                    selectedSection === "lena" ? "client-plus" : "client-minus"
                  }`}
                >
                  <h5 className="modal-title">User Transaction</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowSendModal(false);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label>CLIENT</label>
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#f5f5f5" }}
                    >
                      {selectedAgent?.username || "ramrajgg"}
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label>AMOUNT</label>
                    <input
                      type="number"
                      name="amount"
                      className="form-control"
                      placeholder="Enter amount"
                      value={transactionData.amount}
                      onChange={handleTransactionChange}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>COLLECTION</label>
                    <select
                      name="collection"
                      className="form-control"
                      value={transactionData.collection}
                      onChange={handleTransactionChange}
                    >
                      <option value="CASH">CASH</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK">BANK</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label>PAYMENT TYPE</label>
                    <select
                      name="payment_type"
                      className="form-control"
                      value={transactionData.payment_type}
                      onChange={handleTransactionChange}
                    >
                      <option value="cr">Credit</option>
                      <option value="dr">Debit</option>

                      {/* <option value="cr">Payment Diya</option>
                <option value="dr">Payment Liya</option> */}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label>DATE</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={transactionData.date}
                      onChange={handleTransactionChange}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label>COMMENT</label>
                    <input
                      type="text"
                      name="comment"
                      className="form-control"
                      placeholder="Enter comment"
                      value={transactionData.comment}
                      onChange={handleTransactionChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn btn-theme"
                    onClick={handleSubmitTransaction}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserLedger;
