import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

function MasterCommisssionReport() {
  const navigate = useNavigate();

  // SAMPLE DATA (later API se replace kar doge)
  const [rows] = useState([
    {
      date: "2026-01-01",
      username: "MASTER001",
      mila: { m: 20, s: 15, c: 3, matka: 12 },
      diya: { m: 10, s: 5, c: 2, total: 17 },
    },
    {
      date: "2026-01-03",
      username: "AGENT234",
      mila: { m: 25, s: 5, c: 4, matka: 10 },
      diya: { m: 8, s: 3, c: 1, total: 12 },
    },
    {
      date: "2026-01-05",
      username: "ADMIN999",
      mila: { m: 15, s: 6, c: 9, matka: 5 },
      diya: { m: 6, s: 2, c: 1, total: 9 },
    },
  ]);

  // ------------ FILTER STATES ------------
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");

  // ------------ PAGINATION ------------
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // ------------ FILTER LOGIC ------------
  const filtered = useMemo(() => {
    return rows
      .filter((r) =>
        search ? r.username.toLowerCase().includes(search.toLowerCase()) : true
      )
      .filter((r) =>
        startDate ? new Date(r.date) >= new Date(startDate) : true
      )
      .filter((r) => (endDate ? new Date(r.date) <= new Date(endDate) : true));
  }, [rows, search, startDate, endDate]);

  // ------------ PAGINATION DATA ------------
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  // ------------ TOTALS BASED ON FILTERED DATA ------------
  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        acc.milaM += r.mila.m;
        acc.milaS += r.mila.s;
        acc.milaC += r.mila.c;
        acc.milaMatka += r.mila.matka;

        acc.diyaM += r.diya.m;
        acc.diyaS += r.diya.s;
        acc.diyaC += r.diya.c;
        acc.diyaTotal += r.diya.total;

        return acc;
      },
      {
        milaM: 0,
        milaS: 0,
        milaC: 0,
        milaMatka: 0,
        diyaM: 0,
        diyaS: 0,
        diyaC: 0,
        diyaTotal: 0,
      }
    );
  }, [filtered]);

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">
          <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="card-title text-white mb-0">
                Master Commission Report
              </h3>

              <button className="backbutton" onClick={() => navigate(-1)}>
                <BsArrowLeft className="me-1" /> Back
              </button>
            </div>
          </div>

          <div className="card-body">
            {/* FILTERS */}
            <div className="row mb-4">
              <div className="col-md-4">
                <label>Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Search username..."
                  className="form-control"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead>
                  <tr style={{ background: "#b5872b", color: "#fff" }}>
                    <th rowSpan="2">DATE</th>
                    <th rowSpan="2">USERNAME</th>
                    <th colSpan="4">MILA HAI</th>
                    <th rowSpan="2">ACTION</th>
                    <th colSpan="4">DIYA HAI</th>
                  </tr>

                  <tr style={{ background: "#e3c27c" }}>
                    <th>M.COMM</th>
                    <th>S.COMM</th>
                    <th>C.COMM</th>
                    <th>MATKA.COMM</th>

                    <th>M.COMM</th>
                    <th>S.COMM</th>
                    <th>C.COMM</th>
                    <th>TOTAL</th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="py-5">
                        <strong>No Data</strong>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((r, i) => (
                      <tr key={i}>
                        <td>{r.date}</td>
                        <td>{r.username}</td>

                        <td className="text-success">{r.mila.m}</td>
                        <td className="text-success">{r.mila.s}</td>
                        <td className="text-success">{r.mila.c}</td>
                        <td className="text-success">{r.mila.matka}</td>

                        <td>-</td>

                        <td className="text-danger">{r.diya.m}</td>
                        <td className="text-danger">{r.diya.s}</td>
                        <td className="text-danger">{r.diya.c}</td>
                        <td className="text-danger">{r.diya.total}</td>
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot>
                  <tr style={{ background: "#f8f8f8", fontWeight: "bold" }}>
                    <td colSpan="2">TOTAL</td>

                    <td>{totals.milaM}</td>
                    <td>{totals.milaS}</td>
                    <td>{totals.milaC}</td>
                    <td>{totals.milaMatka}</td>

                    <td>-</td>

                    <td>{totals.diyaM}</td>
                    <td>{totals.diyaS}</td>
                    <td>{totals.diyaC}</td>
                    <td>{totals.diyaTotal}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="d-flex justify-content-between mt-3">
              <div>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="form-select w-auto"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="paginationall">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="pagination_button"
                  >
                  <MdOutlineKeyboardArrowLeft/>
                </button>

                <button
                  disabled={startIndex + limit >= filtered.length}
                  onClick={() => setPage((p) => p + 1)}
                  className="pagination_button"
                >
                  <MdOutlineKeyboardArrowRight/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MasterCommisssionReport;
