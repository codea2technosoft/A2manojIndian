import React, { useState } from "react";
import "../viewmatchAndFancy/Eventcss.scss";

function MatchAndSessionPLReport() {
  // Static data – screenshot jaisa
  const matchData = {
    title: "OMAN V SRI LANKA A",
    match: true,
    odds: true,
    session: true,
    sessionData: [
      { id: 1, name: "14 OVER RUN OMA", declare: 111, client: "MA56392" },
      { id: 2, name: "15 OVER RUNS OMA", declare: 116, client: "" },
    ],
  };

  return (
    <div className="card mt-4">
      {/* Header */}
      <div className="card-header bg-color-black text-white d-flex justify-content-between">
        <h3 className="card-title text-white mb-0">{matchData.title}</h3>

        <div>
          <button className="btn btn-light me-2">Refresh</button>
          <button className="btn btn-primary me-2">Show</button>
          <button className="btn btn-danger">Back</button>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">

        {/* MATCH Row */}
        <div className="table-box">
          <div className="row title-row p-2">
            <div className="col-1 d-flex">
              <input type="checkbox" defaultChecked />
            </div>
            <div className="col"><b>MATCH</b></div>
          </div>
        </div>

        {/* ODDS Row */}
        <div className="table-box">
          <div className="row title-row p-2">
            <div className="col-1 d-flex">
              <input type="checkbox" defaultChecked />
            </div>
            <div className="col"><b>ODDS</b></div>
          </div>
        </div>

        {/* SESSION Header */}
        <div className="table-box mt-2">
          <div className="row title-row p-2 bg-primary text-white">
            <div className="col-1 d-flex">
              <input type="checkbox" defaultChecked />
            </div>
            <div className="col"><b>SESSION</b></div>

            <div className="col"><b>DECLARE</b></div>
            <div className="col"><b>CLIENT</b></div>
          </div>

          {/* SESSION Data Rows */}
          {matchData.sessionData.map((item) => (
            <div key={item.id} className="row p-2 border-bottom">
              <div className="col-1 d-flex">
                <input type="checkbox" defaultChecked />
              </div>

              <div className="col">{item.name}</div>
              <div className="col">{item.declare}</div>

              <div className="col">
                {item.client ? item.client : "-"}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MatchAndSessionPLReport;
