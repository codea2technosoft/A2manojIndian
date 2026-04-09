import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdminDepositDetailsByDate } from "../../Server/api";
import { MdFilterListAlt } from "react-icons/md";

const AdminDepositDetails = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fillter, setFillter] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDepositDetails();
  }, [currentPage, date]);

  const fetchDepositDetails = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: search
      };

      const result = await getAdminDepositDetailsByDate(date, params);
      
      if (result.data.success) {
        setData(result.data.data || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("API error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchDepositDetails();
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const fillterdata = () => {
    setFillter(prev => !prev);
  };

  return (
    <div className="mt-3">
      <div className="card">
        <div className="card-header bg-color-black">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">
              Admin Deposit Details - {date}
            </h3>
            <div className="buttonlist">
              <div className="fillterbutton" onClick={fillterdata}>
                <MdFilterListAlt /> Filter
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* 🔍 Filter Section */}
          {fillter && (
            <div className="row mb-3">
              <div className="col-md-12">
                <div className="form-design-fillter gap-2 d-flex justify-content-between align-items-end">
                  <div className="form_latest_design w-100">
                    <div className="label">
                      <label htmlFor="search">Search Remarks</label>
                    </div>
                    <input
                      type="text"
                      id="search"
                      className="form-control"
                      placeholder="Search by remarks..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div>
                    <button
                      className="refreshbutton"
                      onClick={handleFilter}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 📊 Table Section */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Mobile</th>
                      <th>Opening Balance</th>
                      <th>Amount</th>
                      <th>Closing Balance</th>
                      {/* <th>Remarks</th> */}
                      <th>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.sr}</td>
                          <td>{item.mobile}</td>
                          <td>₹ {item.openingBalance}</td>
                          <td style={{ color: "green", fontWeight: "bold" }}>
                            ₹ {item.amount}
                          </td>
                          <td>₹ {item.closingBalance}</td>
                          {/* <td>{item.remarks}</td> */}
                          <td>{item.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No deposit records found for this date.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 📄 Pagination Controls */}
              {data.length > 0 && totalPages > 0 && (
                <ul className="d-flex justify-content-between align-items-center mt-3 pl-0">
                  <li
                    className={`paginationbutton btn btn-secondary ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={handlePrev}
                  >
                    <span>Previous</span>
                  </li>
                  <span className="alllistnumber">
                    Page {currentPage} of {totalPages}
                  </span>
                  <li
                    className={`paginationbutton btn btn-secondary ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={handleNext}
                  >
                    <span>Next</span>
                  </li>
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDepositDetails;