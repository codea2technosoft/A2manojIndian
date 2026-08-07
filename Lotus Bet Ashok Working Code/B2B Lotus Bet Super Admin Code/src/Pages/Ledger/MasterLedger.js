import React, { useEffect, useState } from "react";
import { getChildList } from "../../Server/api";
import { FaEye, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MasterLedger() {
  const [masters, setMasters] = useState([]);
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
      const res = await getChildList({
        role: 2,
      });
      // setMasters(res.data?.data || []);
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
    }
  };

  const totalAmount = masters.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  return (
    <div className="row g-4">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-primary-yellow d-flex justify-content-between align-items-center">
            <h3 className="card-title  mb-0">Master-ledger</h3>
            <div className="d-flex gap-2">
              <div
                className="btn btn-outline-light"
                onClick={() => navigate(-1)}
              >
                Back
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="card ledger-card">
                  {/* Header */}
                  <div className="ledger-header lena">
                    <span>In Plus (Profit)</span>
                    {/* <span>{totalAmount.toFixed(2)}</span> */}
                    <span>{totals.lena.toFixed(2)}</span>
                  </div>
                  {/* Table Head */}
                  <div className="ledger-table-head">
                    <div className="w-50">Username</div>
                    <div className="w-25 text-end">Amount</div>
                    <div className="w-25 text-end">Action</div>
                  </div>
                  <div className="height_scroll">
                    {/* Rows */}
                    {lenaList.length === 0 ? (
                      <div className="no-data">No Data</div>
                    ) : (
                      lenaList.map((m) => (
                        <div key={m.id} className="ledger-row">
                          <div className="w-50 username-link">
                            <FaEye
                              className="action-icon"
                              onClick={() => {
                                localStorage.setItem(
                                  "selectedMasterId",
                                  m.admin_id,
                                );
                                // navigate(`/super-agent-ledger`);
                                navigate(
                                  `/settlement?master_id=${m.admin_id}`,
                                );
                              }}
                            />
                            <span>{m.username}</span>
                          </div>
                          <div className="w-25 text-end fw-semibold">
                            {m.amount.toFixed(2) || 0}
                          </div>
                          <div className="w-25 text-end">
                            <FaChartBar
                              className="action-icon"
                              onClick={() =>
                                navigate(`/master-transaction/${m.admin_id}`)
                              }
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card ledger-card">
                  <div className="ledger-header dena">
                    <span>In Minus (Loss)</span>
                    {/* <span>0.00</span> */}
                    <span>{totals.dena.toFixed(2)}</span>
                  </div>

                  <div className="ledger-table-head">
                    <div className="w-75">Username</div>
                    <div className="w-25 text-end">Amount</div>
                    <div className="w-25 text-end">Action</div>
                  </div>

                  {/* <div className="no-data">No Data</div>  */}
                  <div className="height_scroll">
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

                            <FaEye
                              className="action-icon"
                              onClick={() => {
                                localStorage.setItem(
                                  "selectedMasterId",
                                  m.admin_id,
                                );
                                // navigate(`/super-agent-ledger`);
                                navigate(
                                  `/settlement?master_id=${m.admin_id}`,
                                );
                              }}
                            />

                            <span>{m.username}</span>
                          </div>

                          <div className="w-25 text-end fw-semibold">
                            {m.amount.toFixed(2) || 0}
                          </div>

                          <div className="w-25 text-end">
                            <FaChartBar
                              className="action-icon"
                              onClick={() =>
                                navigate(`/master-transaction/${m.admin_id}`)
                              }
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

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
                  <div className="height_scroll">
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
                                localStorage.setItem(
                                  "selectedMasterId",
                                  m.admin_id,
                                );
                                // navigate(`/super-agent-ledger`);
                                navigate(
                                  `/super-agent-ledger?master_id=${m.admin_id}`,
                                );
                              }}
                            />
                            <span>{m.username}</span>
                          </div>

                          <div className="w-25 text-end fw-semibold">
                            {m.amount.toFixed(2) || 0}
                          </div>

                          <div className="w-25 text-end">
                            <FaChartBar
                              className="action-icon"
                              onClick={() =>
                                navigate(`/master-transaction/${m.admin_id}`)
                              }
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MasterLedger;
