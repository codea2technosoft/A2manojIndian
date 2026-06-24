
import React, { useEffect, useState, } from "react";
import { getChildList } from "../../Server/api";
import { FaEye, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
function SuperAgentLedger() {
  const [masters, setMasters] = useState([]);
  const [lenaList, setLenaList] = useState([]);
  const [denaList, setDenaList] = useState([]);
  const [clearList, setClearList] = useState([]);
  const [searchParams] = useSearchParams();
  const masterId = searchParams.get("master_id");
  const [totals, setTotals] = useState({
    lena: 0,
    dena: 0,
    clear: 0,
  });

  const navigate = useNavigate();

  const masterIdFromURL = searchParams.get("master_id");
  // useEffect(() => {
  //   fetchMasters();
  // }, [masterId]);
  useEffect(() => {
    // Agar URL me master_id hai to use priority do
    if (masterIdFromURL) {
      localStorage.setItem("selectedMasterId", masterIdFromURL);
    }
    fetchMasters();
  }, [masterIdFromURL]);

  // const storedMasterId = localStorage.getItem("selectedMasterId");

  const fetchMasters = async () => {


    const masterId = masterIdFromURL || localStorage.getItem("selectedMasterId");

    const params = {
      role: 3,
      ...(masterId && { admin_id: masterId }) // Backend expects admin_id
    };


    try {
      // const res = await getChildList(3);
      // const res = await getChildList({
      //   role: 3,
      //   admin_id: storedMasterId
      // });

      const res = await getChildList(params);
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

  // -------- total amount --------
  const totalAmount = masters.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="row g-4">
      {/* ================= LENA ================= */}
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
          <div className="height_scroll">

            {lenaList.length === 0 ? (
              <div className="no-data">No Data</div>
            ) : (
              lenaList.map((m) => (
                <div key={m.id} className="ledger-row">
                  <div
                    className="w-50 username-link"  >
                    {/* <FaEye className="action-icon"

                      onClick={() => {
                        localStorage.setItem("selectedSuperAgent", m.admin_id);
                        navigate(`/agent-ledger`);
                      }}
                    // onClick={() => navigate(`/agent-ledger?master_id=${m.admin_id}`)}
                    /> */}
                    <FaEye
                      className="action-icon"
                      onClick={() => {
                        navigate(`/agent-ledger?superagent_id=${m.admin_id}`);
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
                      onClick={() => {
                        localStorage.setItem("selectedAdminId", m.admin_id);
                        navigate(`/Superagenttransaction/${m.admin_id}`);
                      }}
                    />
                  </div>

                </div>
              ))
            )}

          </div>
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

          <div className="height_scroll">


            {denaList.length === 0 ? (
              <div className="no-data">No Data</div>
            ) : (
              denaList.map((m) => (
                // <div key={m.admin_id} className="ledger-row">
                //   <div className="w-75">{m.username}</div>
                //   <div className="w-25 text-end fw-semibold">
                //     {m.amount || 0}
                //   </div>
                // </div>

                <div key={m.admin_id} className="ledger-row">

                  <div className="w-50 d-flex align-items-center gap-2">
                    <FaEye
                      className="action-icon"
                      onClick={() => {
                        navigate(`/agent-ledger?superagent_id=${m.admin_id}`);
                      }}
                    />
                    <span className="fw-semibold">{m.username}</span>
                  </div>

                  <div className="w-25 text-end fw-semibold">
                    {m.amount.toFixed(2) || 0}
                  </div>

                  <div className="w-25 text-end">
                    <FaChartBar
                      className="action-icon"
                      onClick={() =>
                        navigate(`/Superagenttransaction/${m.admin_id}`)
                      }
                    />
                  </div>
                </div>

              ))
            )}


          </div>
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
                      localStorage.setItem("selectedSuperAgent", m.admin_id);
                      navigate(`/agent-ledger`);
                    }}
                  /> */}


                    <FaEye
                      className="action-icon"
                      onClick={() => {
                        navigate(`/agent-ledger?superagent_id=${m.admin_id}`);
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
                        navigate(`/Superagenttransaction/${m.admin_id}`)
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

  );
}
export default SuperAgentLedger;


