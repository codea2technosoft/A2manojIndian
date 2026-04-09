import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { getStatementPL } from "../../Server/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Spinner,
} from "react-bootstrap";
const AllPLStatementlist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminId } = useParams();

  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("PL"); // Set default to PL

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(50);
  const [total, setTotal] = useState({
    credit: 0,
    debit: 0,
    commissionPlus: 0,
    commissionMinus: 0,
    netBalance: 0
  });
  useEffect(() => {
    fetchPLStatementData(currentPage);
  }, [adminId, currentPage, searchTerm]);


  
  const calculateTotals = (data) => {
    let credit = 0;
    let debit = 0;

    data.forEach(item => {
      if (item.type === "credit") credit += Number(item.amount || 0);
      if (item.type === "debit") debit += Number(item.amount || 0);
    });
    setTotal({
      credit,
      debit,
      commissionPlus: 0,
      commissionMinus: 0,
      netBalance: data.length
        ? Number(data[data.length - 1].after_balance_from || 0)
        : 0
    });
  };

  const fetchPLStatementData = async (page) => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");
      
      // Call getStatementPL API
      const res = await getStatementPL({
        admin_id: adminId || loggedInAdminId,
        page,
        limit,
        search: searchTerm
      });

      const response = res.data;
      if (response.success) {
        const data = response.data || [];
         setStatementData(data);
        setTotalPages(response.pagination?.total_pages || 1);
        // setCurrentPage(response.pagination?.current_page || 1);
        setTotalRecords(response.pagination?.total_records || 0);
        calculateTotals(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch P&L statement data");
    } finally {
      setLoading(false);
    }
  };

const handleModeChange = (selectedMode) => {
  setMode(selectedMode);
  if (selectedMode === "ALL") {
    
    if (adminId) {
      navigate(`/getAllstatment/${adminId}`);  
    } else {
      navigate("/getAllstatment");
    }
  }
};

  const formatNumber = (num) => Number(num || 0).toFixed(2);
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 2;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      // adjust start when near end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };
  return (
    <>
      <ToastContainer autoClose={500} theme="colored" />

      <div className="container-fluid">
        <div className="card">
          <div className="card-header flex-wrap-mobile bg-color-black p-2 text-white d-flex justify-content-between align-items-md-center gap-2">
            <h5 className="card-title mb-0"> P & L Statement</h5>

            <div className="d-flex align-items-center">
              <button onClick={() => navigate(-1)} className="backbutton">
                Back
              </button>
            </div>
          </div>

          <div className="card-body">
            <div className="row mb-3">
              <div className="d-flex justify-content-end align-items-center">
                <select
                  className="form-select w-auto"
                  value={mode}
                  onChange={(e) => handleModeChange(e.target.value)}
                >
                  <option value="ALL">All Statement</option>
                  <option value="PL">P & L Statement</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" />
                <p>Loading P&L statement data...</p>
              </div>
            ) : statementData.length === 0 ? (
              <div className="text-center py-5">
                <h5>NO DATA</h5>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-primary">
                      <tr>
                        <th>DATE</th>
                        <th>TYPE</th>
                        <th>REMARK</th>
                        <th className="text-end">OLD BAL</th>
                        <th className="text-end text-success">WIN</th>
                        <th className="text-end text-danger">LOSS</th>
                        <th className="text-end">BALANCE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statementData.map((item, index) => (
                        <tr key={index}>
                          <td>{new Date(item.created_at).toLocaleString()}</td>
                          <td>{item.tr_type}</td>
                          <td>{item.remark}</td>
                          <td className="text-end">
                            {formatNumber(item.before_balance_from)}
                          </td>
                          <td className="text-end text-success">
                            {item.win_loss === "WIN" ? formatNumber(item.amount) : "0.00"}
                          </td>
                          <td className="text-end text-danger">
                            {item.win_loss === "LOSS" ? formatNumber(item.amount) : "0.00"}
                          </td>
                          <td className="text-end fw-bold">
                            {formatNumber(item.wallet_amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                    {totalPages > 1 && (
                              <div className="d-flex justify-content-between align-items-center mt-4">
                                <div className="sohwingallentries">
                                  Showing {((currentPage - 1) * limit) + 1} to{" "}
                                  {Math.min(currentPage * limit, totalRecords)} of {totalRecords} entries
                                </div>
            
                                <div className="paginationall d-flex align-items-center gap-1">
                                  <button disabled={currentPage === 1} onClick={handlePrev}>
                                    <MdOutlineKeyboardArrowLeft />
                                  </button>
            
                                  <div className="d-flex gap-1">
                                    {getPageNumbers().map((page) => (
                                      <div
                                        key={page}
                                        className={`paginationnumber ${currentPage === page ? "active" : ""}`}
                                        onClick={() => handlePageClick(page)}
                                      >
                                        {page}
                                      </div>
                                    ))}
                                  </div>
            
                                  <button disabled={currentPage === totalPages} onClick={handleNext}>
                                    <MdOutlineKeyboardArrowRight />
                                  </button>
                                </div>
                              </div>
                            )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllPLStatementlist;