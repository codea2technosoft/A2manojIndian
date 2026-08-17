import React, { useState, useEffect } from "react";
import {
  getAgentsSettlementList,
  submitBankingAgentLenaDena,
} from "../Server/api";
import Swal from "sweetalert2";

function Settlement() {
  // State for creditors (dena) and debtors (lena) data
  const [creditors, setCreditors] = useState([]); // dena - positive
  const [debtors, setDebtors] = useState([]); // lena - negative
  const [loading, setLoading] = useState(false);
  const [totalData, setTotalData] = useState(null);

  // State for settle amounts
  const [settleAmounts, setSettleAmounts] = useState({});
  const [remarks, setRemarks] = useState({});
  const [password, setPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Fetch settlement data
  const fetchSettlementData = async () => {
    setLoading(true);
    try {
      const userData = getUserData();
      const payload = {
        admin_id: userData?.admin_id || "admin",
        role: 2,
      };

      console.log("Fetching settlement data with payload:", payload);

      const response = await getAgentsSettlementList(payload);
      console.log("Settlement API Response:", response);

      const apiData = response?.data;

      if (apiData && apiData.success === true) {
        const data = apiData.data || {};

        // Store total
        if (data.total) {
          setTotalData(data.total);
        }

        // Creditors = dena (positive amount) - "dena hai"
        const creditorsList = data.dena || [];
        setCreditors(creditorsList);

        // Debtors = lena (negative amount) - "lena hai"
        const debtorsList = data.lena || [];
        setDebtors(debtorsList);

        console.log(
          "Creditors (dena):",
          creditorsList.length,
          "Debtors (lena):",
          debtorsList.length,
        );
      } else {
        setCreditors([]);
        setDebtors([]);
        console.log("No settlement data available");
      }
    } catch (err) {
      console.error("Error fetching settlement data:", err);
      setCreditors([]);
      setDebtors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSettlementData();
  }, []);

  // Handle settle amount change
  const handleSettleAmountChange = (adminId, value) => {
    setSettleAmounts((prev) => ({
      ...prev,
      [adminId]: value,
    }));
  };

  // Handle remark change
  const handleRemarkChange = (adminId, value) => {
    setRemarks((prev) => ({
      ...prev,
      [adminId]: value,
    }));
  };

  // Handle Full Settle click
  const handleFullSettle = (adminId) => {
    // Find the member in creditors or debtors
    let member = creditors.find((item) => item.admin_id === adminId);
    if (!member) {
      member = debtors.find((item) => item.admin_id === adminId);
    }
    if (member) {
      const amount = Math.abs(parseFloat(member.total_amount) || 0);
      setSettleAmounts((prev) => ({
        ...prev,
        [adminId]: amount,
      }));
    }
  };

  // Handle submit settlement
  const handleSubmitSettlement = async (e) => {
    e.preventDefault();

    if (!password) {
      Swal.fire({
        icon: "warning",
        title: "Password Required",
        text: "Please enter password",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    // Collect all transactions
    const transactions = [];
    let hasError = false;

    // Check creditors (dena) - type: "credit"
    creditors.forEach((member) => {
      const amount = parseFloat(settleAmounts[member.admin_id]);
      if (amount && amount > 0) {
        const remark =
          remarks[member.admin_id] || `Settlement for ${member.username}`;
        transactions.push({
          admin_id: member.admin_id,
          amount: amount,
          type: "debit", // dena = debit
          remark: remark,
        });
      }
    });

    // Check debtors (lena) - type: "debit"
    debtors.forEach((member) => {
      const amount = parseFloat(settleAmounts[member.admin_id]);
      if (amount && amount > 0) {
        const remark =
          remarks[member.admin_id] || `Settlement for ${member.username}`;
        transactions.push({
          admin_id: member.admin_id,
          amount: amount,
          type: "credit", // lena = credit
          remark: remark,
        });
      }
    });

    if (transactions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Settlements",
        text: "Please add at least one settlement amount",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    const userData = getUserData();
    const payload = {
      admin_id: userData?.admin_id || "admin",
      password: password,
      // role: userData?.role || 1,
      role: 2,
      transactions: transactions,
    };

    console.log("Submitting settlement payload:", payload);

    setSubmitLoading(true);
    try {
      const response = await submitBankingAgentLenaDena(payload);
      console.log("Settlement submitted successfully:", response);

      const successMessage =
        response?.data?.message ||
        response?.message ||
        "Settlements processed successfully";

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: successMessage,
        confirmButtonColor: "#28a745",
        confirmButtonText: "OK",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Reset form
      setSettleAmounts({});
      setRemarks({});
      setPassword("");
      fetchSettlementData();
    } catch (error) {
      console.error("Error submitting settlements:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit settlements. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle clear all
  const handleClearAll = () => {
    setSettleAmounts({});
    setRemarks({});
    setPassword("");
  };

  // Format amount
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "0.00";
    return parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="allcommon">
        <section className="main-inner-outer py-4">
          <div className="container-fluid">
            <div className="find-member-sec search_banking_detail">
              <div className="db-sec">
                <h2 className="common-heading page-title">Settlement List</h2>
              </div>
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="allcommon">
      <section className="main-inner-outer">
        <div className="find-member-sec search_banking_detail">
          <div className="db-sec">
            <h2 className="common-heading page-title">Settlement List</h2>
          </div>
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="headinggreen">Creditors Account (dena hai)</div>
              <div className="table-responsive">
                <div className="table-responsive">
                  <table className="banking_detail_table table-color table settle_table">
                    <thead>
                      <tr>
                        <th scope="col">Account</th>
                        <th scope="col">Client (P/L)</th>
                        <th scope="col">Short Balance</th>
                        <th scope="col">Settle Amount</th>
                        <th scope="col">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {creditors && creditors.length > 0 ? (
                        creditors.map((item) => {
                          const adminId = item.admin_id;
                          const amount = parseFloat(item.total_amount) || 0;
                          return (
                            <tr key={adminId}>
                              <td>{item.username || "-"}</td>
                              <td
                                style={{ color: "green", textAlign: "right" }}
                              >
                                {formatAmount(amount)}
                              </td>
                              <td
                                style={{ textAlign: "right", color: "black" }}
                              >
                                {formatAmount(0)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <div>
                                  <input className="userinput"
                                    type="number"
                                    placeholder="Amount"
                                    value={settleAmounts[adminId] || ""}
                                    onChange={(e) =>
                                      handleSettleAmountChange(
                                        adminId,
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <button
                                    className="fullsettle"
                                    onClick={() => handleFullSettle(adminId)}
                                  >
                                    Full Settle
                                  </button>
                                </div>
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <div>
                                  <input className="userinput"
                                    type="text"
                                    placeholder="Remarks"
                                    value={remarks[adminId] || ""}
                                    onChange={(e) =>
                                      handleRemarkChange(
                                        adminId,
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            No creditors found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="headingred">Debtors Account (lena hai)</div>
              <div className="table-responsive">
                <table className="banking_detail_table table-color table settle_table">
                  <thead>
                    <tr>
                      <th scope="col">Account</th>
                      <th scope="col">Client (P/L)</th>
                      <th scope="col">Settle Amount</th>
                      <th scope="col">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtors && debtors.length > 0 ? (
                      debtors.map((item) => {
                        const adminId = item.admin_id;
                        const amount = parseFloat(item.total_amount) || 0;
                        return (
                          <tr key={adminId}>
                            <td>{item.username || "-"}</td>
                            <td style={{ color: "red", textAlign: "right" }}>
                              {formatAmount(Math.abs(amount))}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div>
                                <input className="userinput"
                                  type="number"
                                  placeholder="Amount"
                                  value={settleAmounts[adminId] || ""}
                                  onChange={(e) =>
                                    handleSettleAmountChange(
                                      adminId,
                                      e.target.value,
                                    )
                                  }
                                />
                                <button
                                  className="fullsettlered"
                                  onClick={() => handleFullSettle(adminId)}
                                >
                                  Full Settle
                                </button>
                              </div>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <div>
                                <input className="userinput"
                                  type="text"
                                  placeholder="Remarks"
                                  value={remarks[adminId] || ""}
                                  onChange={(e) =>
                                    handleRemarkChange(adminId, e.target.value)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          No debtors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>{" "}
            </div>
          </div>
          {/* <div className="inner-wrapper">
              <div
                className="common-container"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between"
                }}
              >
            
             

             
              </div>
            </div> */}
          <div
            className="paymoney d-flex justify-content-center align-items-center"
            style={{ paddingTop: 0 }}
          >
            <form
              className="paymoney_form justify-content-center"
              onSubmit={handleSubmitSettlement}
            >
              <input
                placeholder="Password"
                name="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn green-btn"
                style={{ color: "black", marginRight: 5 }}
                disabled={submitLoading}
              >
                {submitLoading ? "Processing..." : "Submit Payment"}
              </button>
              <button
                className="clear_btn btn"
                type="button"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </form>
          </div>
          <div />
        </div>
        {/* <div className="container-fluid">
        </div> */}
      </section>
    </div>
  );
}

export default Settlement;
