import React, { useEffect, useState } from "react";
import { getUserChildList, addUserNewTransaction, getMyLedgerTxnUser } from "../../Server/api";
import { useSearchParams } from "react-router-dom";
import { FaEye, FaChartBar, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

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

  // 3 Filters - from_date, to_date, search
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  // State for Send modal
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [transactionData, setTransactionData] = useState({
    amount: "",
    collection: "CASH",
    payment_type: "cr",
    date: new Date().toISOString().split('T')[0],
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Set default dates (last 7 days)
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const formatDateInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
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
      setIsFiltering(true);
      const res = await getUserChildList({
        role: 5,
        admin_id: master_id,
        from_date: fromDate,
        to_date: toDate,
        search: searchTerm // 3rd filter - username search
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
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  // Format date for display (DD-MM-YYYY)
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split('-');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
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
      date: new Date().toISOString().split('T')[0],
      comment: "",
    });
  };

  // Handle transaction input change
  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({
      ...prev,
      [name]: value
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
        admin_id: selectedAgent?.admin_id || localStorage.getItem("selectedAdminId"),
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
    const amountValue = selectedAgent?.amount ? selectedAgent.amount.toString() : "";
    const paymentType = selectedSection === "lena" ? "cr" : "dr";
    setTransactionData({
      amount: amountValue,
      collection: "CASH",
      payment_type: paymentType,
      date: new Date().toISOString().split('T')[0],
      comment: "",
    });
  };

  const totalAmount = users.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  return (
    <div className="card">
      <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">User Settlement</h3>
        <div className="d-flex gap-2">
          <div className="btn btn-outline-light" onClick={() => navigate(-1)}>
            Back
          </div>
        </div>
      </div>
      <div className="card-body">
        {/* 3 Filters - From Date, To Date, Username Search */}
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: '150px' }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="date"
              className="form-control form-control-sm"
              style={{ width: '150px' }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: '200px' }}
              placeholder="Search username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleFilter}
              disabled={isFiltering}
            >
              {isFiltering ? (
                <span className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </span>
              ) : (
                <><FaSearch /></>
              )}
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* In Plus (Profit) */}
          <div className="col-md-6">
            <div className="card ledger-card">
              <div className="ledger-header lena">
                <span>Client In Plus (Profit)</span>
                <span>{totals.lena.toFixed(2)}</span>
              </div>

              <div className="ledger-table-head">
                <div className="w-50">Username</div>
                <div className="w-25 text-end">Amount</div>
                <div className="w-25 text-end">Action</div>
              </div>

              {lenaList.length === 0 ? (
                <div className="no-data">No Data</div>
              ) : (
                lenaList.map((m) => (
                  <div key={m.id} className="ledger-row">
                    <div className="w-50 username-link">
                      <span>{m.username}</span>
                    </div>
                    <div className="w-25 text-end fw-semibold">
                      {m.amount ? m.amount.toFixed(2) : '0.00'}
                    </div>
                    <div className="w-25 text-end">
                      {/* <FaChartBar
                        className="action-icon"
                        onClick={() =>
                          navigate(`/Usertransaction/${m.admin_id}`)
                        }
                      /> */}
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
                        onClick={() => handleSendClick(m, "lena")}
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
          </div>

          {/* In Minus (Loss) */}
          <div className="col-md-6">
            <div className="card ledger-card">
              <div className="ledger-header dena">
                <span>Client In Minus (Loss)</span>
                <span>{totals.dena.toFixed(2)}</span>
              </div>

              <div className="ledger-table-head">
                <div className="w-50">Username</div>
                <div className="w-25 text-end">Amount</div>
                <div className="w-25 text-end">Action</div>
              </div>

              {denaList.length === 0 ? (
                <div className="no-data">No Data</div>
              ) : (
                denaList.map((m) => (
                  <div key={m.admin_id} className="ledger-row">
                    <div className="w-50 username-link">
                      <span>{m.username}</span>
                    </div>

                    <div className="w-25 text-end fw-semibold">
                      {m.amount ? m.amount.toFixed(2) : '0.00'}
                    </div>

                    <div className="w-25 text-end">
                      {/* <FaChartBar
                        className="action-icon"
                        onClick={() =>
                          navigate(`/Usertransaction/${m.admin_id}`)
                        }
                      /> */}
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
                        onClick={() => handleSendClick(m, "dena")}
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
      </div>

      {/* Send Modal - Transaction Popup */}
      {showSendModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h4 style={{ margin: 0 }}>User Transaction</h4>
              <button 
                className="btn-close"
                onClick={() => setShowSendModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold">CLIENT</label>
              <div className="form-control" style={{ backgroundColor: '#f5f5f5' }}>
                {selectedAgent?.username || 'ramrajgg'}
              </div>
            </div>

            <div className="form-group mb-3">
              <label className="fw-bold">AMOUNT</label>
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
              <label className="fw-bold">COLLECTION</label>
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
              <label className="fw-bold">PAYMENT TYPE</label>
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
              <label className="fw-bold">DATE</label>
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
              <label className="fw-bold">COMMENT</label>
              <input
                type="text"
                name="comment"
                className="form-control"
                placeholder="Enter comment"
                value={transactionData.comment}
                onChange={handleTransactionChange}
              />
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button 
                className="btn btn-secondary" 
                onClick={handleReset}
              >
                Reset
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmitTransaction}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserLedger;