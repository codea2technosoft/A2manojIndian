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
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingResponce, setLoadingResponce] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [showResponceModal, setShowResponceModal] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    name: "",
    mobile: ""
  });
  const [exportingAll, setExportingAll] = useState(false);
  const navigate = useNavigate();
  const getAuthToken = () => localStorage.getItem("token");
  const fetchLineData = async (page = 1) => {
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
        const allUsersData = [];
        result.lines?.forEach(line => {
          if (line.users && Array.isArray(line.users)) {
            allUsersData.push(...line.users);
          }
        });
        setAllUsers(allUsersData);
        setTotalPages(Math.ceil(allUsersData.length / LIMIT) || 1);
        setCurrentPage(page);
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

  useEffect(() => {
    fetchLineData(currentPage);
  }, [currentPage]);
  const handleExportAllToExcel = async () => {
    if (allUsers.length === 0) {
      Swal.fire("No Data", "No users found to export", "warning");
      return;
    }
    setExportingAll(true);
    try {
      let allRecords = [];
      let failedUsers = [];
      let successCount = 0;
      Swal.fire({
        title: 'Exporting Data',
        html: `Processing 0/${allUsers.length} users...<br>Please wait...`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];
        try {
          console.log(`Fetching data for user ${i + 1}: ${user.username} (ID: ${user.id})`);
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
            console.log(`Response for ${user.username}:`, result);

            if (result.status === "1" && result.records && result.records.length > 0) {
              const recordsWithUser = result.records.map(record => ({
                ...record,
                export_username: user.username,
                export_usermobile: user.mobile,
                export_user_id: user.id,
                export_line_type: user.line_type
              }));
              allRecords = [...allRecords, ...recordsWithUser];
              successCount++;
            } else {
              console.log(`No records for user: ${user.username}`);
            }
          } else {
            failedUsers.push(`${user.username} (${user.mobile})`);
          }
        } catch (error) {
          failedUsers.push(`${user.username} (${user.mobile})`);
          console.error(`Error fetching data for user ${user.username}:`, error);
        }
        Swal.update({
          html: `Processing ${i + 1}/${allUsers.length} users...<br>
                 Found records: ${allRecords.length}<br>
                 Users with data: ${successCount}`
        });
      }

      console.log("Total records fetched:", allRecords.length);
      console.log("Failed users:", failedUsers);
      if (allRecords.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Data',
          text: 'No property records found for any user',
          timer: 3000
        });
        setExportingAll(false);
        return;
      }
      const headers = [
        'S.No',
        'User Name',
        'User Mobile',
        'Line Type',
        'Date',
        'Customer Name',
        'Customer Mobile',
        'Project Name',
        'Project ID',
        'Plot No',
        'Colony Name',
        'Area (SQYD)',
        'Total Plot Area (SQYD)',
        'Rate (Per SQYD)',
        'Payable Amount (₹)',
        'Payable BV',
        'Lead ID',
        'Gross Payout (₹)',
        'TDS (₹)',
        'Net Payout (₹)',
        'Advance Balance (₹)',
        'Old Slab',
        'New Slab',
        'BV'
      ];
      const excelData = allRecords.map((record, index) => [
        index + 1,
        record.export_username || '-',
        record.export_usermobile || '-',
        record.export_line_type || '-',
        formatDate(record.date),
        record.customer_name || '-',
        record.customer_mobile || '-',
        record.project_name || '-',
        record.project_id || '-',
        record.plot_no || '-',
        record.colony_name || '-',
        record.area || 0,
        record.total_plot_area || 0,
        record.rate || 0,
        record.payable_amount || 0,
        record.payable_bv || 0,
        record.lead_id || '-',
        record.gross_payout || 0,
        record.tds || 0,
        record.net_payout || 0,
        record.advance_balance || 0,
        record.old_slab || '-',
        record.new_slab || '-',
        record.bv || 0
      ]);
      // Summary data
      const summaryHeaders = ['SUMMARY', ''];
      const summaryData = [
        ['Total Users in Line', allUsers.length],
        ['Users with Records', successCount],
        ['Users without Records', allUsers.length - successCount],
        ['Total Records', allRecords.length],
        ['Total Lines', lineData.total_lines || 0],
        ['Export Date', new Date().toLocaleString()],
        ['Export Time', new Date().toLocaleTimeString()],
        [],
        ['FAILED USERS', failedUsers.length > 0 ? failedUsers.join(', ') : 'None'],
        [],
        ['NOTE', 'This file contains all property records for all users in Third Line']
      ];
      // Create CSV content
      let csvContent = '';
      // Add summary first
      csvContent += '===== EXPORT SUMMARY =====\n';
      summaryHeaders.forEach(header => {
        csvContent += header + ',';
      });
      csvContent = csvContent.slice(0, -1) + '\n';
      summaryData.forEach(row => {
        csvContent += row.join(',') + '\n';
      });
      // Add main data
      csvContent += '\n\n===== PROPERTY RECORDS =====\n';
      csvContent += headers.join(',') + '\n';
      csvContent += excelData.map(row => row.join(',')).join('\n');
      // Create and download file
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for UTF-8 BOM
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const date = new Date();
      const fileName = `Third_Line_All_Users_Records_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Show success message
      let message = `✅ Successfully exported ${allRecords.length} records from ${successCount} users.`;
      if (failedUsers.length > 0) {
        message += `\n\n⚠️ Failed for ${failedUsers.length} users. Check summary in Excel file.`;
      }
      Swal.fire({
        icon: 'success',
        title: 'Export Complete!',
        html: message.replace(/\n/g, '<br>'),
        timer: 5000,
        showConfirmButton: true
      });
    } catch (error) {
      console.error("Error exporting all data:", error);
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
    fetchLineData(1);
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
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  // Get paginated users - अब allUsers से लो
  const getPaginatedUsers = () => {
    const startIndex = (currentPage - 1) * LIMIT;
    const endIndex = startIndex + LIMIT;
    return allUsers.slice(startIndex, endIndex);
  };
  const paginatedUsers = getPaginatedUsers();
  const totalUsers = allUsers.length || 0;
  // Root user खोजने के लिए function (Self Line से)
  const getRootUser = () => {
    const selfLine = lineData.lines?.find(line => line.line_type === "self");
    if (selfLine && selfLine.users && selfLine.users.length > 0) {
      return selfLine.users[0]; // Self Line का पहला user root user है
    }
    return null;
  };
  const rootUser = getRootUser();
  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>{lineData.line_name + "  " + " Line " + "(40)" || "Third Line"} Details </h3>
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
                  {/* YEH HAI EXPORT ALL BUTTON - Back button के पास */}
                  <div className="form_design">
                    <button
                      type="button"
                      className="submit_button btn-success d-flex align-items-center"
                      onClick={handleExportAllToExcel}
                      disabled={exportingAll}
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
                          Export All Excel
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
          {/* Statistics Cards Row */}
          <div className="row mb-">
            <div className="col-xl-3 col-md-3 col-sm-12 mb-3">
              <div className="stat-card bg-primary text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Total Lines</h6>
                    <h2 className="mb-0">{lineData.total_lines || 0}</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <FaUsers size={30} />
                  </div>
                </div>
                <p className="mb-0 mt-2 small">All lines in this group</p>
              </div>
            </div>

            <div className="col-xl-3 col-md-3 col-sm-12 mb-3">
              <div className="stat-card bg-success text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Total Members</h6>
                    <h2 className="mb-0">{lineData.total_members || 0}</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <FaUserCheck size={30} />
                  </div>
                </div>
                <p className="mb-0 mt-2 small">All members in all lines</p>
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
                <p className="mb-0 mt-2 small">Self line square feet</p>
              </div>
            </div>

            <div className="col-xl-3 col-md-3 col-sm-12 mb-3">
              <div className="stat-card bg-warning text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Total SQYD</h6>
                    <h2 className="mb-0">{lineData.total_buysqft || 0}</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <FaChartArea size={30} />
                  </div>
                </div>
                <p className="mb-0 mt-2 small">Total square feet bought</p>
              </div>
            </div>
          </div>

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

          {/* Lines Summary */}
          <div className="row mb-4">
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
          </div>

          {/* Users Table Section */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading line details...</p>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="text-center py-5">
              <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">No Users Found!</h4>
                <p>There are no users in this line.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">All Users List ({totalUsers} members)</h5>
                  <span className="badge bg-primary">Page {currentPage} of {totalPages}</span>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <Table bordered hover className="mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Username</th>
                          <th>Mobile</th>
                          <th>Parent ID</th>
                          <th>Line Type</th>
                          <th>User Type</th>
                          <th>Credit</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map((user, index) => (
                          <tr key={user.id || index}>
                            <td className="fw-bold">{(currentPage - 1) * LIMIT + index + 1}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '30px', height: '30px' }}>
                                  {user.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span>{toSentenceCase(user.username)}</span>
                              </div>
                            </td>
                            <td>
                              <a href={`tel:${user.mobile}`} className="text-decoration-none">
                                {user.mobile}
                              </a>
                            </td>
                            <td>
                              {user.parent_id ? (
                                <Badge bg="light" text="dark" className="px-2 py-1">
                                  {user.parent_id}
                                </Badge>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <Badge bg={
                                user.line_type === "self" ? "success" :
                                  user.line_type === "first" ? "primary" :
                                    user.line_type === "second" ? "warning" :
                                      user.line_type === "third" ? "danger" : "info"
                              } className="px-3 py-1">
                                {toSentenceCase(user.line_type || "line")}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={
                                user.user_type === "admin" ? "danger" :
                                  user.user_type === "channel" ? "warning" :
                                    user.user_type === "associate" ? "info" :
                                      "secondary"
                              } className="px-3 py-1">
                                {toSentenceCase(user.user_type || "associate")}
                              </Badge>
                            </td>
                            <td className="fw-bold">
                              <span className={`${user.credit > 0 ? 'text-success' : 'text-muted'}`}>
                                ₹{user.credit || 0}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                {/* Only View Details Button */}
                                <button
                                  className="btn btn-sm btn-info"
                                  disabled={!user?.id}
                                  onClick={() => navigate(`/third-lines-details/${user?.id}`)}
                                  title="View Details"
                                >
                                  <FaEye />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {totalUsers > LIMIT && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <p className="mb-0 text-muted">
                      Showing <strong>{(currentPage - 1) * LIMIT + 1}</strong> to{" "}
                      <strong>{Math.min(currentPage * LIMIT, totalUsers)}</strong> of{" "}
                      <strong>{totalUsers}</strong> users
                    </p>
                  </div>
                  <div>
                    <Pagination className="mb-0">
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="me-2"
                      />

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
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
                        disabled={currentPage === totalPages}
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