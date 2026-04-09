import React, { useState, useEffect } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import { HiOutlineChevronLeft, HiChevronRight } from "react-icons/hi";

const API_URL = process.env.REACT_APP_API_URL;

function UnitSQYDLedger() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchDetails, setSearchDetails] = useState(null);
  const [summary, setSummary] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const getAuthToken = () => localStorage.getItem("token");

  const fetchData = async (e) => {
    e.preventDefault();
    if (!mobile) {
      Swal.fire("Missing Input", "Please enter a mobile number", "warning");
      return;
    }

    setLoading(true);
    setTableData([]);
    setSearchDetails(null);
    setSummary(null);
    setCurrentPage(1); // Reset to first page on new search

    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/myteam-tree-with-sales-child?mobile=${mobile}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "1") {
        setSearchDetails(response.data.search_details);
        setSummary(response.data.summary);
        const allUsers = response.data.users_with_data || [];
        const formattedData = [];

        allUsers.forEach(user => {
          if (user.transactions?.commissions?.length > 0) {
            user.transactions.commissions.forEach(comm => {
              formattedData.push({
                srNo: formattedData.length + 1,
                parentName: user.parent_username,
                parentMobile: user.parent_mobile,
                project_name: comm.project_name,
                blockNo: comm.block_name || "N/A",
                unitNo: comm.unit_no || "N/A",
                unitSqyd: comm.unit_sqyd || "0.00",
                associateName: comm.associate_name,
                associateMobile: comm.associate_mobile,
                customer_name: comm.customer_name,
                customer_mobile: comm.customer_mobile,
                levelNo: comm.level,
                oldSqyd: comm.old_sqyd,
                new_sqyd: comm.new_sqyd,
                currentSqyd: comm.current_sqyd,
                totalSqyd: comm.total_sqyd,
                date: comm.date,
                type: "Commission"
              });
            });
          }
          if (user.transactions?.direct_sales?.length > 0) {
            user.transactions.direct_sales.forEach(sale => {
              formattedData.push({
                srNo: formattedData.length + 1,
                parentName: user.parent_username,
                parentMobile: user.parent_mobile,
                project_name: sale.project_name,
                blockNo: sale.block_name || "N/A",
                unitNo: sale.unit_no || "N/A",
                unitSqyd: sale.unit_sqyd || "0.00",
                associateName: sale.associate_name,
                associateMobile: sale.associate_mobile,
                customer_name: sale.customer_name,
                customer_mobile: sale.customer_mobile,
                levelNo: sale.level,
                oldSqyd: sale.old_sqyd,
                new_sqyd: sale.new_sqyd,
                currentSqyd: sale.current_sqyd,
                totalSqyd: sale.total_sqyd,
                date: sale.date,
                type: "Direct Sale"
              });
            });
          }
        });

        // 🔥 FINAL FIX: Total SQYD (new_sqyd) ke according ascending order
        const sortedData = [...formattedData].sort((a, b) => {
          const valA = parseFloat(a.new_sqyd) || 0;
          const valB = parseFloat(b.new_sqyd) || 0;
          return valA - valB; // Ascending order
        });

        console.log("Sorted Data:", sortedData.map(item => item.new_sqyd));
        setTableData(sortedData);
        setTotalPages(Math.ceil(sortedData.length / itemsPerPage) || 1);
      } else {
        Swal.fire("No Data", response.data.message || "No data found", "info");
      }
    } catch (error) {
      console.error("Data fetch error:", error);
      Swal.fire("Warning !!!", "Sorry No Data Found Please Try Another.", "info");
    } finally {
      setLoading(false);
    }
  };

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tableData.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const downloadExcel = () => {
    if (tableData.length === 0) {
      Swal.fire("No Data", "No data available to download", "warning");
      return;
    }

    const excelData = tableData.map((row, index) => ({
      'Sr No': index + 1,
      'Date': new Date(row.date).toLocaleDateString(),
      'Parent Mobile': row.parentMobile || 'NA',
      'Project Name': row.project_name,
      'Block No': row.blockNo || 'NA',
      'Unit No': row.unitNo,
      'Unit SQYD': parseFloat(row.unitSqyd).toFixed(2),
      'Associate Name': row.associateName,
      'Associate Mobile': row.associateMobile,
      'Customer Name': row.customer_name || 'NA',
      'Customer Mobile': row.customer_mobile || 'NA',
      'Level No': row.levelNo,
      'Old SQYD': parseFloat(row.oldSqyd).toFixed(2),
      'Current SQYD': parseFloat(row.unitSqyd).toFixed(2),
      'Total SQYD': parseFloat(row.new_sqyd).toFixed(2)
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Unit SQYD Ledger");
    const fileName = `Unit_SQYD_Ledger_${mobile}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    Swal.fire("Success", "Excel file downloaded successfully!", "success");
  };

  return (
    <div className="padding_15">
      <div className="row justify-content-center">
        <div className="col-12 col-md-12">
          <Card>
            <Card.Header>
              <h4 className="mb-0 text-center">Unit SQYD Ledger Report</h4>
            </Card.Header>
            <Card.Body>
              <form onSubmit={fetchData} className="mb-3">
                <div className="row g-2 justify-content-center">
                  <div className="col-8 col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Mobile Number"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                    />
                  </div>
                  <div className="col-4 col-md-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-sm w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Show Details"
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {searchDetails && (
                <div className="alert alert-info mb-3">
                  <strong>Search Details:</strong> {searchDetails.username} ({searchDetails.mobile})
                  {searchDetails.has_transactions && " - Has Transactions"}
                </div>
              )}

              {summary && (
                <div className="row mb-3">
                  <div className="col-md-3">
                    <div className="alert alert-success p-2 text-center">
                      <small>Total Users</small>
                      <h6>{summary.total_users_in_tree}</h6>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="alert alert-warning p-2 text-center">
                      <small>With Transactions</small>
                      <h6>{summary.users_with_transactions}</h6>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="alert alert-primary p-2 text-center">
                      <small>Direct Sales</small>
                      <h6>{summary.total_direct_sales}</h6>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="alert alert-secondary p-2 text-center">
                      <small>Commissions</small>
                      <h6>{summary.total_commissions}</h6>
                    </div>
                  </div>
                </div>
              )}

              {tableData.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, tableData.length)} to{" "}
                    {Math.min(currentPage * itemsPerPage, tableData.length)} of {tableData.length} entries
                  </div>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={downloadExcel}
                  >
                    <i className="fas fa-download me-1"></i>
                    Download Excel
                  </button>
                </div>
              )}

              {tableData.length > 0 ? (
                <>
                  <div className="table-responsive">
                    <Table striped bordered hover size="sm" className="mt-3">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th>Sr No</th>
                          <th>Date</th>
                          <th>Parent Mobile</th>
                          <th>Parent Name</th>
                          <th>Customer Name</th>
                          <th>Customer Mobile</th>
                           <th>Associate Name</th>
                          <th>Associate Mobile</th>

                          <th>Project Name</th>
                          <th>Block No</th>
                          <th>Unit No</th>
                          <th>Unit SQYD</th>
                         
                          <th>Level No</th>
                          <th>Old SQYD</th>
                          <th>Current SQYD</th>
                          <th>Total SQYD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageData().map((row, index) => {
                          const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;
                          return (
                            <tr key={index}>
                              <td>{actualIndex}</td>
                              <td>{new Date(row.date).toLocaleDateString()}</td>
                              <td>{row.parentMobile || "NA"}</td>
                              <td>{row.parent_username || "NA"}</td>
                              <td>{row.customer_name || "NA"}</td>
                              <td>{row.customer_mobile || "NA"}</td>
                                <td>{row.associateName}</td>
                              <td>{row.associateMobile}</td>

                              <td>{row.project_name || "NA"}</td>
                              <td>{row.blockNo}</td>
                              <td>{row.unitNo}</td>
                              <td className="text-end">{parseFloat(row.unitSqyd).toFixed(2)}</td>
                            
                              <td className="text-center">{row.levelNo}</td>
                              <td className="text-end">{parseFloat(row.oldSqyd).toFixed(2)}</td>
                              <td className="text-end">{parseFloat(row.unitSqyd).toFixed(2)}</td>
                              <td className="text-end">{parseFloat(row.new_sqyd).toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="d-flex justify-content-end mt-3">
                      <nav>
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <HiOutlineChevronLeft />
                            </button>
                          </li>

                          {(() => {
                            const pages = [];
                            const maxVisiblePages = 3; // Show 3 pages in the middle

                            if (totalPages <= 5) {
                              // If total pages are 5 or less, show all
                              for (let i = 1; i <= totalPages; i++) {
                                pages.push(
                                  <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                                    <button
                                      className="page-link"
                                      onClick={() => handlePageChange(i)}
                                    >
                                      {i}
                                    </button>
                                  </li>
                                );
                              }
                            } else {
                              // Always show first page
                              pages.push(
                                <li key={1} className={`page-item ${1 === currentPage ? 'active' : ''}`}>
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(1)}
                                  >
                                    1
                                  </button>
                                </li>
                              );

                              // Show ellipsis if current page > 3
                              if (currentPage > 3) {
                                pages.push(
                                  <li key="ellipsis1" className="page-item disabled">
                                    <span className="page-link">...</span>
                                  </li>
                                );
                              }

                              // Show pages around current page
                              let start = Math.max(2, currentPage - 1);
                              let end = Math.min(totalPages - 1, currentPage + 1);

                              // Adjust to always show 3 pages in the middle
                              if (currentPage <= 3) {
                                start = 2;
                                end = 4;
                              } else if (currentPage >= totalPages - 2) {
                                start = totalPages - 3;
                                end = totalPages - 1;
                              }

                              for (let i = start; i <= end; i++) {
                                if (i > 1 && i < totalPages) {
                                  pages.push(
                                    <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                                      <button
                                        className="page-link"
                                        onClick={() => handlePageChange(i)}
                                      >
                                        {i}
                                      </button>
                                    </li>
                                  );
                                }
                              }

                              // Show ellipsis if current page < totalPages - 2
                              if (currentPage < totalPages - 2) {
                                pages.push(
                                  <li key="ellipsis2" className="page-item disabled">
                                    <span className="page-link">...</span>
                                  </li>
                                );
                              }

                              // Always show last page
                              pages.push(
                                <li key={totalPages} className={`page-item ${totalPages === currentPage ? 'active' : ''}`}>
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(totalPages)}
                                  >
                                    {totalPages}
                                  </button>
                                </li>
                              );
                            }

                            return pages;
                          })()}

                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <HiChevronRight />
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                !loading && searchDetails && (
                  <div className="alert alert-warning text-center">
                    No transaction data found for this mobile number
                  </div>
                )
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default UnitSQYDLedger;