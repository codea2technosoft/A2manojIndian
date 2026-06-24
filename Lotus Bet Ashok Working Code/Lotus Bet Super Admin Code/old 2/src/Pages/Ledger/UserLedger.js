
import React, { useEffect, useState, } from "react";
import { getUserChildList } from "../../Server/api";
import { useSearchParams } from "react-router-dom";
import { FaEye, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
function UserLedger() {
    // const { search } = useLocation();
const [searchParams] = useSearchParams()
  // const query = new URLSearchParams(search);
 const master_id = searchParams.get("master_id");
  console.log(master_id,"master_id")
  const [users, setMasters] = useState([]);
  const [lenaList, setLenaList] = useState([]);
  const [denaList, setDenaList] = useState([]);
  const [clearList, setClearList] = useState([]);
  const [totals, setTotals] = useState({
    lena: 0,
    dena: 0,
    clear: 0,
  });
  const navigate = useNavigate();
  useEffect(() => {
    fetchMasters();
  }, []);
  const fetchMasters = async () => {
    try {
      // const res = await getChildList(2);
      const res = await getUserChildList({
        role: 5,
        admin_id:master_id
      });
      // setMasters(res.data?.data || []);
      const apiData = res.data.data;
      setTotals(apiData.total || {
        lena: 0,
        dena: 0,
        clear: 0,
      });

      setLenaList(apiData.lena || []);
      setDenaList(apiData.dena || []);
      setClearList(apiData.clear || []);
    } catch (err) {
      console.log(err);
    }
  };

  const totalAmount = users.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
  return (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card ledger-card">
          {/* Header */}
          <div className="ledger-header lena">
            <span>LENA</span>
            {/* <span>{totalAmount.toFixed(2)}</span> */}
            <span>{totals.lena.toFixed(2)}</span>
          </div>
          {/* Table Head */}
          <div className="ledger-table-head">
            <div className="w-50">Username</div>
            <div className="w-25 text-end">Amount</div>
            <div className="w-25 text-end">Action</div>
          </div>

          {/* Rows */}
          {lenaList.length === 0 ? (

            <div className="no-data">No Data</div>
          ) : (
            lenaList.map((m) => (
              <div key={m.id} className="ledger-row">

                <div
                  className="w-50 username-link"  >
                    
                  {/* <FaEye
                    className="action-icon"
                    onClick={() => {
                      localStorage.setItem("selectedMasterId", m.admin_id);
                      // navigate(`/super-agent-ledger`);
                          navigate(`/super-agent-ledger?master_id=${m.admin_id}`);
                    }}
                  /> */}
                  <span>{m.username}</span>
                </div>
                <div className="w-25 text-end fw-semibold">
                  {m.amount || 0}
                </div>
                <div className="w-25 text-end">
                  <FaChartBar
                    className="action-icon"
                    onClick={() =>
                      navigate(`/Usertransaction/${m.admin_id}`)
                    }
                  />
                </div>
              </div>
            ))
          )}





        </div>
      </div>

      {/* ================= DENA ================= */}
      <div className="col-md-4">
        <div className="card ledger-card">

          <div className="ledger-header dena">
            <span>DENA</span>
            {/* <span>0.00</span> */}
            <span>{totals.dena.toFixed(2)}</span>
          </div>

          <div className="ledger-table-head">
            <div className="w-75">Username</div>
            <div className="w-25 text-end">Amount</div>
            <div className="w-25 text-end">Action</div>
          </div>

          {/* <div className="no-data">No Data</div>  */}

          {denaList.length === 0 ? (
            <div className="no-data">No Data</div>
          ) : (
            denaList.map((m) => (
              <div key={m.admin_id} className="ledger-row">
                <div className="w-50 username-link">
                  {/* <FaEye
                    className="action-icon"
                    onClick={() => {
                      localStorage.setItem("selectedMasterId", m.admin_id);
                      navigate(`/super-agent-ledger`);
                    }}
                  /> */}


{/* 
  <FaEye
                    className="action-icon"
                    onClick={() => {
                      localStorage.setItem("selectedMasterId", m.admin_id);
                      // navigate(`/super-agent-ledger`);
                          navigate(`/super-agent-ledger?master_id=${m.admin_id}`);
                    }}
                  /> */}

                  <span>{m.username}</span>
                </div>

                <div className="w-25 text-end fw-semibold">
                  {m.amount || 0}
                </div>

                <div className="w-25 text-end">
                  <FaChartBar
                    className="action-icon"
                    onClick={() =>
                      navigate(`/Usertransaction/${m.admin_id}`)
                    }
                  />
                </div>
              </div>
            ))

          )}
        </div>
      </div>

      {/* ================= CLEAR ================= */}
      <div className="col-md-4">
        <div className="card ledger-card">
    <div className="ledger-header clear">
            <span>CLEAR</span>
            {/* <span>0.00</span> */}
            <span>{totals.clear.toFixed(2)}</span>

          </div>
          <div className="ledger-table-head">
            <div className="w-50">Username</div>
            <div className="w-25 text-end">Amount</div>
            <div className="w-25 text-end">Action</div>
          </div>

          {/* 
      <div className="ledger-table-head">
        <div className="w-75">Username</div>
        <div className="w-25 text-end">Amount</div>
      </div>

      <div className="no-data">No Data</div> */}

          {clearList.length === 0 ? (
            <div className="no-data">No Data</div>
          ) : (
            clearList.map((m) => (
              <div key={m.admin_id} className="ledger-row">
                <div className="w-50 username-link">
                  {/* <FaEye
                    className="action-icon"
                    onClick={() => {
                      localStorage.setItem("selectedMasterId", m.admin_id);
                      navigate(`/super-agent-ledger`);
                    }}
                  /> */}


                    <FaEye
                    className="action-icon"
                    onClick={() => {
                      localStorage.setItem("selectedMasterId", m.admin_id);
                      // navigate(`/super-agent-ledger`);
                          navigate(`/super-agent-ledger?master_id=${m.admin_id}`);
                    }}
                  />
                  <span>{m.username}</span>
                </div>

                <div className="w-25 text-end fw-semibold">
                  {m.amount || 0}
                </div>

                <div className="w-25 text-end">
                  <FaChartBar
                    className="action-icon"
                    onClick={() =>
                      navigate(`/Usertransaction/${m.admin_id}`)
                    }
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

  );
}

export default UserLedger;

