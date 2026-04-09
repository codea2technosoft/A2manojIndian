import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Form,
  Button,
  Pagination
} from "react-bootstrap";

const Statementmasterlist = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(5);
  const [paginationData, setPaginationData] = useState({
    total_records: 0,
    total_pages: 1,
    current_page: 1,
    limit: 10
  });

  const [total, setTotal] = useState({
    credit: 0,
    debit: 0,
    commissionPlus: 0,
    commissionMinus: 0,
    netBalance: 0
  });

  const token = localStorage.getItem("token");

  // ============================
  // FETCH DATA WITH PAGINATION
  // ============================
  useEffect(() => {
    if (adminId) {
      fetchStatementData();
    }
  }, [adminId, currentPage, searchTerm]);

  const fetchStatementData = async () => {
    try {
      setLoading(true);
      const loggedInAdminId = localStorage.getItem("admin_id");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-statement-user`,
        {
          admin_id: adminId || loggedInAdminId,
          page: currentPage,
          limit: limit,
          search: searchTerm
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const data = response.data.data || [];
        const pagination = response.data.pagination || {
          total_records: 0,
          total_pages: 1,
          current_page: 1,
          limit: 10
        };

        // Set pagination data
        setPaginationData(pagination);
        setTotalPages(pagination.total_pages || 1);
        setTotalRecords(pagination.total_records || 0);
        setCurrentPage(pagination.current_page || 1);
        setLimit(pagination.limit || 10);

        // Format the data
        const formattedData = data.map((item, index) => {
          const isSender = item.from_admin_id === (adminId || loggedInAdminId);
          const isReceiver = item.to_admin_id === (adminId || loggedInAdminId);

          let description = item.remark || "Transaction";
          let credit = 0;
          let debit = 0;
          let commissionPlus = 0;
          let commissionMinus = 0;

          if (isReceiver) credit = parseFloat(item.amount) || 0;
          if (isSender) debit = parseFloat(item.amount) || 0;

          // Get old balance
          const oldBalance = isSender
            ? parseFloat(item.before_balance_from) || 0
            : parseFloat(item.before_balance_to) || 0;

          // Get new balance
          const newBalance = isSender
            ? parseFloat(item.after_balance_from) || 0
            : parseFloat(item.after_balance_to) || 0;

          // Format date
          const dateObj = item.created_at ? new Date(item.created_at) : null;
          const formattedDate = dateObj
            ? `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}:${dateObj.getSeconds().toString().padStart(2, '0')}`
            : "N/A";

          return {
            id: item._id || `item-${index}`,
            date: formattedDate,
            description: description,
            oldBalance: oldBalance,
            credit: credit,
            debit: debit,
            commissionPlus: commissionPlus,
            commissionMinus: commissionMinus,
            balance: newBalance,
            type: item.type || "transaction",
            from: item.from_admin_id || "N/A",
            to: item.to_admin_id || "N/A",
            amount: item.amount || 0
          };
        });

        setStatementData(formattedData);
        setFilteredData(formattedData);
        calculateTotals(formattedData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching statement data:", error);
      if (error.response?.status === 401) {
        console.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        console.error(error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // TOTAL CALCULATION
  // ============================
  const calculateTotals = (data) => {
    const totals = {
      credit: 0,
      debit: 0,
      commissionPlus: 0,
      commissionMinus: 0,
      netBalance: 0
    };

    data.forEach(item => {
      totals.credit += parseFloat(item.credit) || 0;
      totals.debit += parseFloat(item.debit) || 0;
      totals.commissionPlus += parseFloat(item.commissionPlus) || 0;
      totals.commissionMinus += parseFloat(item.commissionMinus) || 0;
    });

    // Net balance is last transaction's balance
    if (data.length > 0) {
      totals.netBalance = parseFloat(data[data.length - 1].balance) || 0;
    }

    setTotal(totals);
  };

  // ============================
  // SEARCH FUNCTIONALITY
  // ============================
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // ============================
  // PAGINATION HANDLERS
  // ============================
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleFirst = () => {
    setCurrentPage(1);
  };

  const handleLast = () => {
    setCurrentPage(totalPages);
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatNumber = (num) => {
    return parseFloat(num || 0).toFixed(2);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = end - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <>
 

      <div className="container-fluid">
        <div className="card">
          <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Transaction Statement</h5>
            <div className="d-flex align-items-center">
              {/* <Form.Control
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={handleSearch}
                className="me-2"
                style={{ width: '250px' }}
              /> */}
              <button
                onClick={() => navigate(-1)}
                className="backbutton"              >
                Back
              </button>
                   <button
                  className="backbutton"
                  onClick={() => navigate(`/profitandloss/${adminId}`)}
                >
                  P&L
                </button>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading statement data...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-5">
                <h5>NO DATA</h5>
                <p className="text-muted">No transaction records found</p>
                {searchTerm && (
                  <Button
                    variant="outline-primary"
                    onClick={() => setSearchTerm("")}
                    className="mt-2"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>DATE</th>
                        <th>DESCRIPTION</th>
                        <th className="text-end">OLD BAL</th>
                        <th className="text-end">CR</th>
                        <th className="text-end">DR</th>
                        <th className="text-end">COMM+</th>
                        <th className="text-end">COMM-</th>
                        <th className="text-end">BALANCE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={item.id}>
                          <td className="text-nowrap">{item.date}</td>
                          <td>
                            <div>{item.description}</div>
                            <small className="text-muted">
                              From: {item.from} | To: {item.to} | Type: {item.type}
                            </small>
                          </td>
                          <td className="text-end">{formatNumber(item.oldBalance)}</td>
                          <td className="text-end text-success fw-semibold">
                            {item.credit > 0 ? `+${formatNumber(item.credit)}` : "0.00"}
                          </td>
                          <td className="text-end text-danger fw-semibold">
                            {item.debit > 0 ? `-${formatNumber(item.debit)}` : "0.00"}
                          </td>
                          <td className="text-end">
                            {formatNumber(item.commissionPlus)}
                          </td>
                          <td className="text-end">
                            {formatNumber(item.commissionMinus)}
                          </td>
                          <td className="text-end fw-bold">
                            {formatNumber(item.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-secondary">
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">TOTAL</td>
                        <td className="text-end fw-bold text-success">
                          +{formatNumber(total.credit)}
                        </td>
                        <td className="text-end fw-bold text-danger">
                          -{formatNumber(total.debit)}
                        </td>
                        <td className="text-end fw-bold">
                          {formatNumber(total.commissionPlus)}
                        </td>
                        <td className="text-end fw-bold">
                          {formatNumber(total.commissionMinus)}
                        </td>
                        <td className="text-end fw-bold text-primary">
                          {formatNumber(total.netBalance)}
                        </td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>

                {/* ✅ ENHANCED PAGINATION UI */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">

                    <div className="sohwingallentries">
                      Showing {((currentPage - 1) * limit) + 1} to{" "}
                      {Math.min(currentPage * limit, totalRecords)} of{" "}
                      {totalRecords} entries

                    </div>

                    <div className="paginationall d-flex align-items-center gap-1">


                      <button
                        disabled={currentPage === 1}
                        onClick={handleFirst}
                        className=""
                      >
                        <MdOutlineKeyboardArrowLeft />
                      </button>


                      <div className="d-flex gap-1">

                        {getPageNumbers().map((page) => (
                          <div
                            key={page}
                            className={`paginationnumber ${currentPage === page ? "active" : ""
                              }`}
                            onClick={() => handlePageClick(page)}
                          >
                            {page}
                          </div>
                        ))}
                      </div>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={handleNext}
                        className=""
                      >
                        <MdOutlineKeyboardArrowRight />
                      </button>

                    </div>
                  </div>
                )}

                {/* {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <span className="text-muted">
                        Showing {((currentPage - 1) * limit) + 1} to{" "}
                        {Math.min(currentPage * limit, totalRecords)} of{" "}
                        {totalRecords} entries
                      </span>
                    </div>
                    
                    <div className="d-flex align-items-center gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={handleFirst}
                        className="px-3"
                      >
                        First
                      </Button>
                      
                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={handlePrev}
                        className="px-3"
                      >
                        &laquo; Prev
                      </Button>
                      
                      <div className="d-flex gap-1">
                        {getPageNumbers().map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "primary" : "outline-primary"}
                            size="sm"
                            onClick={() => handlePageClick(page)}
                            className="px-3"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={handleNext}
                        className="px-3"
                      >
                        Next &raquo;
                      </Button>
                      
                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={handleLast}
                        className="px-3"
                      >
                        Last
                      </Button>
                    </div>
                    
             
                  </div>
                )} */}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Statementmasterlist;