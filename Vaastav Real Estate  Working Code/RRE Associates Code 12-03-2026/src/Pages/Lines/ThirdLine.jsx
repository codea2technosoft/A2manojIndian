import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MdFilterListAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import {
  Table,
  Form,
  Spinner,
  Badge,
  Container,
  Button,
  Modal,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { FaArrowLeft, FaPlus, FaFileExcel } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEye, FaEdit, FaUsers, FaUserCheck, FaShoppingCart, FaChartArea, FaUser } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import {
  MdAirplanemodeInactive,
  MdAirplanemodeActive,
  MdOutlineUpcoming,
  MdUpcoming,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;
const LIMIT = 10;

function ThirdLine() {
  const [lineData, setLineData] = useState({
    lines: [],
    line_name: "",
    total_lines: 0,
    total_members: 0,
    total_buysqft: 0,
    self_buysqft: 0,
    contains_self_line: false
  });
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [allPropertyRecords, setAllPropertyRecords] = useState([]);
  const [exportingAll, setExportingAll] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    name: "",
    mobile: ""
  });
  
  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem("token");

  // Fetch line data and property records together
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const url = `${API_URL}/line-three-details-associate?page=${page}&limit=${LIMIT}`;
      console.log("Fetching URL:", url);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const result = await response.json();
      console.log("API Response:", result);
      
      if (result.status === "1") {
        setLineData(result);
        
        // Collect all users from all lines
        const allUsersData = [];
        result.lines?.forEach(line => {
          if (line.users && Array.isArray(line.users)) {
            allUsersData.push(...line.users);
          }
        });
        
        setAllUsers(allUsersData);
        setTotalPages(Math.ceil(allUsersData.length / LIMIT) || 1);
        setCurrentPage(page);
        
        // Automatically fetch property records for all users
        await fetchAllPropertyRecords(allUsersData);
      } else {
        Swal.fire("Error", result.message || "Failed to fetch line data", "error");
      }
    } catch (error) {
      console.error("Error fetching line data:", error);
      Swal.fire("Error", `Failed to fetch line data: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch property records for all users
  const fetchAllPropertyRecords = async (usersList) => {
    if (!usersList || usersList.length === 0) return;
    
    setLoadingRecords(true);
    
    try {
      let allRecords = [];
      
      for (let i = 0; i < usersList.length; i++) {
        const user = usersList[i];
        
        try {
          const token = getAuthToken();
          const response = await fetch(
            `${API_URL}/view-user-property-record?user_id=${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            if (result.status === "1" && result.records && result.records.length > 0) {
              const recordsWithUser = result.records.map(record => ({
                ...record,
                user_name: user.username,
                user_mobile: user.mobile,
                user_id: user.id,
                line_type: user.line_type
              }));
              allRecords = [...allRecords, ...recordsWithUser];
            }
          }
        } catch (error) {
          console.error(`Error fetching data for user ${user.username}:`, error);
        }
      }
      
      setAllPropertyRecords(allRecords);
      
    } catch (error) {
      console.error("Error fetching property records:", error);
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Function to calculate running total for area
  const getRecordsWithRunningTotal = () => {
    let runningAreaTotal = 0;
    
    return allPropertyRecords.map((record) => {
      // Sirf area add karo
      runningAreaTotal += Number(record.area) || 0;
      
      return {
        ...record,
        running_area_total: runningAreaTotal
      };
    });
  };

  const handleExportAllToExcel = async () => {
    if (allPropertyRecords.length === 0) {
      Swal.fire("No Data", "No property records found to export", "warning");
      return;
    }
    
    setExportingAll(true);
    
    try {
      const headers = [
        'S.No',
        'Approved Date',
        'Associate Name',
        'Associate Mobile',
        'Customer Name',
        'Customer Mobile',
        'Project Name',
        'Plot No',
        'Block Name',
        'Area (SQYD)',
        'Total Plot Area (SQYD)',
        'Lead ID',
      ];

      // Running total ke saath export data
      let runningTotal = 0;
      const excelData = allPropertyRecords.map((record, index) => {
        runningTotal += Number(record.area) || 0;
        
        return [
          index + 1,
          formatDate(record.date),
          record.user_name || '-',
          record.user_mobile || '-',
          record.customer_name || '-',
          record.customer_mobile || '-',
          record.project_name || '-',
          record.plot_no || '-',
          record.colony_name || '-',
          record.area || 0,
          runningTotal.toFixed(2),
          record.lead_id || '-',
        ];
      });

      // Summary
      const uniqueUsers = [...new Set(allPropertyRecords.map(r => r.user_id))].length;
      const finalTotal = runningTotal;
      
      const summaryData = [
        ['Total Users with Records', uniqueUsers],
        ['Total Property Records', allPropertyRecords.length],
        ['Final Total Area', finalTotal.toFixed(2)],
        ['Total Lines', lineData.total_lines || 0],
        ['Export Date', new Date().toLocaleString()],
      ];

      let csvContent = '===== EXPORT SUMMARY =====\n';
      summaryData.forEach(row => {
        csvContent += row.join(',') + '\n';
      });
      
      csvContent += '\n\n===== PROPERTY RECORDS =====\n';
      csvContent += headers.join(',') + '\n';
      csvContent += excelData.map(row => row.join(',')).join('\n');
      
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const date = new Date();
      const fileName = `Third_Line_Property_Records_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      Swal.fire({
        icon: 'success',
        title: 'Export Complete!',
        html: `✅ Successfully exported ${allPropertyRecords.length} records<br>Final Total Area: ${finalTotal.toFixed(2)} SQYD`,
        timer: 3000
      });
      
    } catch (error) {
      console.error("Error exporting data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: error.message || 'Failed to export data. Please try again.'
      });
    } finally {
      setExportingAll(false);
    }
  };

  const handleSearch = (e) => {
    fetchData(1);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
 const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  // Root user खोजने के लिए function (Self Line से)
  const getRootUser = () => {
    const selfLine = lineData.lines?.find(line => line.line_type === "self");
    if (selfLine && selfLine.users && selfLine.users.length > 0) {
      return selfLine.users[0];
    }
    return null;
  };
  
  const rootUser = getRootUser();

  // Headers with Running Total - Sirf 14 columns (Line Type ke saath)
  const propertyHeaders = [
    'S.No',
    'Approved Date',
    'Associate Name',
    'Associate Mobile',
    'Customer Name',
    'Customer Mobile',
    'Project Name',
    'Plot No',
    'Block Name',
    'Area (SQYD)',
    'Total Plot Area (SQYD)',
    'Lead ID',
  ];

  // Pagination for property records
  const recordsPerPage = 20;
  const totalRecordPages = Math.ceil(allPropertyRecords.length / recordsPerPage);
  
  // Records with running total
  const recordsWithRunningTotal = getRecordsWithRunningTotal();
  const paginatedRecords = recordsWithRunningTotal.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const uniqueUsersCount = [...new Set(allPropertyRecords.map(r => r.user_id))].length;
  const finalTotal = allPropertyRecords.reduce((sum, record) => sum + (Number(record.area) || 0), 0);

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>{lineData.line_name || "Third Line"} - Property Records</h3>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="d-md-none d-block d-sm-block">
                <button
                  type="button"
                  className="toggle-filter-btn"
                  onClick={toggleFilter}
                >
                  {showFilter ? <MdFilterAltOff /> : <MdFilterListAlt />}
                </button>
              </div>
              <div className="d-md-block d-none d-sm-none">
                <div className="d-flex gap-2">
                  {/* Export Button */}
                  <div className="form_design">
                    <button
                      type="button"
                      className="submit_button btn-success d-flex align-items-center"
                      onClick={handleExportAllToExcel}
                      disabled={exportingAll || allPropertyRecords.length === 0}
                      style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                    >
                      {exportingAll ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <FaFileExcel className="me-2" />
                          Export to Excel
                        </>
                      )}
                    </button>
                  </div>

                  {/* Back Button */}
                  <div className="form_design">
                    <button
                      type="button"
                      className="submit_button d-flex align-items-center"
                      onClick={handleBack}
                    >
                      <FaArrowLeft className="me-2" />
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Summary Cards */}
          {/* <div className="row mb-4">
            <div className="col-xl-3 col-md-3 col-sm-12 mb-3">
              <div className="stat-card bg-primary text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Users with Records</h6>
                    <h2 className="mb-0">{uniqueUsersCount}</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <FaUsers size={30} />
                  </div>
                </div>
                <p className="mb-0 mt-2 small">Users who have property records</p>
              </div>
            </div>

            <div className="col-xl-3 col-md-3 col-sm-12 mb-3">
              <div className="stat-card bg-success text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Total Records</h6>
                    <h2 className="mb-0">{allPropertyRecords.length}</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <FaHistory size={30} />
                  </div>
                </div>
                <p className="mb-0 mt-2 small">Total property records</p>
              </div>
            </div>

            <div className="col-xl-3 col-md-3 col-sm-12 mb-3">
              <div className="stat-card bg-info text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Self SQYD</h6>
                    <h2 className="mb-0">{lineData.self_buysqft || 0}</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <FaShoppingCart size={30} />
                  </div>
                </div>
                <p className="mb-0 mt-2 small">Self line square yards</p>
              </div>
            </div>

            <div className="col-xl-3 col-md-3 col-sm-12 mb-3">
              <div className="stat-card bg-warning text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Final Total Area</h6>
                    <h2 className="mb-0">{finalTotal.toFixed(2)}</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <FaChartArea size={30} />
                  </div>
                </div>
                <p className="mb-0 mt-2 small">Total area (SQYD)</p>
              </div>
            </div>
          </div> */}

          {/* Root User Card */}
          {rootUser && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-primary">
                  <div className="card-header bg-primary text-white d-flex align-items-center">
                    <FaUser className="me-2" />
                    <h5 className="mb-0">Root User Information</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light p-2 rounded me-3">
                            <FaUser className="text-primary" />
                          </div>
                          <div>
                            <small className="text-muted">Name</small>
                            <h6 className="mb-0">{rootUser.username || "N/A"}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light p-2 rounded me-3">
                            <i className="fas fa-phone text-primary"></i>
                          </div>
                          <div>
                            <small className="text-muted">Mobile</small>
                            <h6 className="mb-0">{rootUser.mobile || "N/A"}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light p-2 rounded me-3">
                            <i className="fas fa-id-card text-primary"></i>
                          </div>
                          <div>
                            <small className="text-muted">User ID</small>
                            <h6 className="mb-0">{rootUser.id || "N/A"}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light p-2 rounded me-3">
                            <i className="fas fa-rupee-sign text-primary"></i>
                          </div>
                          <div>
                            <small className="text-muted">Credit Balance</small>
                            <h6 className="mb-0">₹{rootUser.credit || 0}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lines Summary - Uncomment if needed */}
          {/* <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Lines Summary</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table bordered hover>
                      <thead className="table-dark">
                        <tr>
                          <th>Line Type</th>
                          <th>Line Name</th>
                          <th>Total Members</th>
                          <th>Buyers Count</th>
                          <th>Total SQYD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lineData.lines?.map((line, index) => (
                          <tr key={index}>
                            <td>
                              <Badge bg={
                                line.line_type === "self" ? "success" :
                                  line.line_type === "first" ? "primary" :
                                    line.line_type === "second" ? "warning" :
                                      line.line_type === "third" ? "danger" : "info"
                              }>
                                {toSentenceCase(line.line_type || "line")}
                              </Badge>
                            </td>
                            <td>{line.line_name || "N/A"}</td>
                            <td>{line.total_members || 0}</td>
                            <td>{line.buyers_count || 0}</td>
                            <td>{line.total_buysqft || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Loading State */}
          {loading || loadingRecords ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading property records...</p>
            </div>
          ) : allPropertyRecords.length === 0 ? (
            <div className="text-center py-5">
              <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">No Property Records Found!</h4>
                <p>No property records found for any user in this line.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Property Records Table with Running Total - Sirf 14 columns */}
              <div className="card">
                {/* <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <FaHistory className="me-2" />
                    Property Records
                  </h5>
                  <span className="badge bg-light text-dark">
                    Page {currentPage} of {totalRecordPages}
                  </span>
                </div> */}
                <div className="card-body p-0">
                  <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto', overflowX: 'auto' }}>
                    <Table bordered hover size="sm" className="mb-0" style={{ minWidth: '1800px' }}>
                      <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr>
                          {propertyHeaders.map((header, idx) => (
                            <th key={idx}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRecords.length > 0 ? (
                          paginatedRecords.map((record, index) => (
                            <tr key={`${record.lead_id}-${index}`}>
                              <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                              <td>{formatDate(record.date)}</td>
                              <td>{record.user_name || '-'}</td>
                              <td>{record.user_mobile || '-'}</td>
                            
                              <td>{record.customer_name || '-'}</td>
                              <td>{record.customer_mobile || '-'}</td>
                              <td>{record.project_name || '-'}</td>
                              <td>{record.plot_no || '-'}</td>
                              <td>{record.colony_name || '-'}</td>
                              <td>{record.area || 0}</td>
                              <td className="fw-bold text-primary">{record.running_area_total.toFixed(2)}</td>
                           
                              <td>{record.lead_id || '-'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={propertyHeaders.length} className="text-center py-4">
                              No property records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Pagination for Property Records */}
              {totalRecordPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <p className="mb-0 text-muted">
                      Showing <strong>{(currentPage - 1) * recordsPerPage + 1}</strong> to{" "}
                      <strong>{Math.min(currentPage * recordsPerPage, allPropertyRecords.length)}</strong> of{" "}
                      <strong>{allPropertyRecords.length}</strong> records
                    </p>
                  </div>
                  <div>
                    <Pagination className="mb-0">
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="me-2"
                      />
                      {Array.from({ length: Math.min(5, totalRecordPages) }, (_, i) => {
                        let pageNum;
                        if (totalRecordPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalRecordPages - 2) {
                          pageNum = totalRecordPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Pagination.Item
                            key={pageNum}
                            active={pageNum === currentPage}
                            onClick={() => handlePageChange(pageNum)}
                            className="mx-1"
                          >
                            {pageNum}
                          </Pagination.Item>
                        );
                      })}
                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalRecordPages}
                        className="ms-2"
                      />
                    </Pagination>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThirdLine;