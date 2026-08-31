import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyLedgerTxnUser } from "../../Server/api";
import { FaSearch } from "react-icons/fa";
import Loader from "../../Common/Loader";

function UserSettlementReport() {
  const { admin_id } = useParams();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("all");
  const [totals, setTotals] = useState({
    dena: 0,
    lena: 0,
    balance: 0,
  });
  const [username, setUsername] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (admin_id) {
      fetchHistory();
    }
  }, [admin_id, paymentType, fromDate, toDate]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const payload = {
        admin_id: admin_id,
        payment_type: paymentType,
        page: "1",
        limit: "1000",
      };

      if (fromDate) {
        payload.from_date = fromDate;
      }
      if (toDate) {
        payload.to_date = toDate;
      }

      const response = await getMyLedgerTxnUser(payload);

      const apiData = response.data;
      const data = apiData?.data?.data || [];

      setHistoryData(data);

      setTotals({
        dena: apiData?.dena || 0,
        lena: apiData?.lena || 0,
        balance: apiData?.balance || 0,
      });

      if (data.length > 0 && data[0].admin_id) {
        setUsername(data[0].admin_id);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    if (
      window.confirm(
        `Are you sure you want to delete this transaction?\n\nDescription: ${item.comment || item.game_name || "-"}\nAmount: ${item.credit > 0 ? item.credit : item.debit}`,
      )
    ) {
      alert("Delete functionality coming soon");
    }
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handleSearch = () => {
    fetchHistory();
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="card">
      <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">
          {/* Account Statement - {username || admin_id} */}
          Account Statement
        </h3>
        <div className="d-flex gap-2">
          <div className="btn btn-outline-light" onClick={() => navigate(-1)}>
            Back
          </div>
        </div>
      </div>
      <div className="card-body">
        {/* Filters Row */}
        <div className="row mb-3 align-items-end gy-2">
          <div className="col-6 col-md-2">
            {/* <label >PAYMENT TYPE</label> */}
            <select
              className="form-select form-control-sm"
              value={paymentType}
              onChange={handlePaymentTypeChange}
            >
              <option value="all">All</option>
              {/* <option value="cr">Payment Diya</option>
              <option value="dr">Payment Liya</option> */}
              <option value="cr">Credit</option>
              <option value="dr">Debit</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            {/* <label >From</label> */}
            <input
              type="date"
              className="form-control form-control-sm"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            {/* <label >To</label> */}
            <input
              type="date"
              className="form-control form-control-sm"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4 d-flex gap-2">
            <button className="btn btn-primary" onClick={handleSearch}>
              <FaSearch />
            </button>
            {/* <button className="btn btn-secondary btn-sm" onClick={handleReset}>
              Reset
            </button> */}
          </div>
        </div>

        {/* Summary Cards */}
        {/* <div className="row mb-3">
          <div className="col-md-4">
            <div className="card" style={{ backgroundColor: '#dc3545', color: 'white' }}>
              <div className="card-body py-2">
                <h6 className="mb-0">DENA</h6>
                <h4 className="mb-0">{totals.dena.toFixed(2)}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card" style={{ backgroundColor: '#28a745', color: 'white' }}>
              <div className="card-body py-2">
                <h6 className="mb-0">LENA</h6>
                <h4 className="mb-0">{totals.lena.toFixed(2)}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card" style={{ backgroundColor: '#17a2b8', color: 'white' }}>
              <div className="card-body py-2">
                <h6 className="mb-0">BALANCE</h6>
                <h4 className="mb-0">{totals.balance.toFixed(2)}</h4>
              </div>
            </div>
          </div>
        </div> */}

        {
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-sm">
              <thead>
                <tr>
                  {/* <th>DATE</th>
                  <th>DESCRIPTION</th>
                  <th>DR</th>
                  <th>CR</th>
                  <th>BALANCE</th>
                  <th>PAYMENT TYPE</th>
                  <th>REMARK</th> */}
                  <th>NO</th>
                  <th>DESC</th>
                  <th>Type</th>
                  <th>Collection Name</th>
                  <th>DR</th>
                  <th>CR</th>
                  <th>Balance</th>
                  <th>D/C</th>
                  <th>Note</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    <tr>
                      <td className="table_loader" colSpan="8">
                        <div className="py-5">
                          <Loader />
                        </div>
                      </td>
                    </tr>
                  </>
                ) : historyData.length === 0 ? (
                  <tr>
                    <td className="text-center py-5" colSpan="8">
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  historyData.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>

                      {/* <td>
                        <button
                          className="btn btn-link text-danger p-0"
                          style={{ fontSize: '16px', textDecoration: 'none' }}
                          onClick={() => handleDelete(item)}
                        >
                          🗑️
                        </button>
                      </td> */}
                      {/* <td>{item.comment || "-"}</td>
                      <td>{item.collection_name || "-"}</td>
                      <td>{item.balance ? item.balance.toFixed(2) : "-"}</td>
                      <td>
                        {item.pay_type == "diya"
                          ? "CR"
                          : item.pay_type == "liya"
                            ? "DR"
                            : "-"}
                      </td>
                      <td>{item.remarks || "-"}</td>
                      <td>{formatDate(item.created_at)}</td> */}

                      <td>{item.comment || "-"}</td>
                      {/* <td>{item.type || "-"}</td> */}
                      <td>
                        {item.debit > 0 ? "Debit" : item.credit > 0 ? "Credit" : "-"}
                      </td>
                      <td>{item.collection_name || "-"}</td>
                      <td>{item.debit > 0 ? item.debit.toFixed(2) : "-"}</td>
                      <td>{item.credit > 0 ? item.credit.toFixed(2) : "-"}</td>
                      <td>{item.balance ? item.balance.toFixed(2) : "-"}</td>
                      {/* <td>
                        {item.pay_type == "diya"
                          ? "CR"
                          : item.pay_type == "liya"
                            ? "DR"
                            : "-"}
                      </td> */}
                      <td>
                        {item.debit > 0 ? "D" : item.credit > 0 ? "C" : "-"}
                      </td>
                      <td>{item.remarks || "-"}</td>
                      <td>{formatDate(item.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  );
}
export default UserSettlementReport;
