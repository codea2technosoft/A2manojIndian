import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { MdFilterListAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import {
  Table,
  Spinner,
  Badge,
  ProgressBar,
  Pagination,
} from "react-bootstrap";
import { 
  FaArrowLeft, 
  FaChartArea, 
  FaUser, 
  FaGift, 
  FaMoneyBill, 
  FaPercentage, 
  FaEye,
  FaExternalLinkAlt 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;
const LIMIT = 10;

function TotalAchievedBuySqydDetails() {
  const [reportData, setReportData] = useState({
    summary: {},
    breakdown: {},
    user_info: {},
    records: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    name: "",
    mobile: ""
  });
  
  const navigate = useNavigate();

  const getAuthToken = () => localStorage.getItem("token");

  const fetchReportData = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const url = `${API_URL}/assocaite-total-area-report?page=${page}&limit=${LIMIT}`;

      console.log("Fetching URL:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      console.log("API Response:", result);

      if (result.status === "1") {
        setReportData({
          summary: result.summary || {},
          breakdown: result.breakdown || {},
          user_info: result.user_info || {},
          records: result.records || []
        });
        
        const totalRecords = result.records?.length || 0;
        setTotalPages(Math.ceil(totalRecords / LIMIT) || 1);
        setCurrentPage(page);
      } else {
        Swal.fire("Error", result.message || "Failed to fetch report data", "error");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      Swal.fire("Error", `Failed to fetch report data: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(currentPage);
  }, [currentPage]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  // Click handlers for cards
  const handleGiftAreaClick = () => {
    navigate("/self-gifts-lists");
  };

  const handleDirectIncomeClick = () => {
    navigate("/property-income-list");
  };

  const handleParentCommissionClick = () => {
    navigate("/child-commission");
  };

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    return parseFloat(num).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const calculatePercentage = (value) => {
    if (!reportData.summary.total_area || reportData.summary.total_area === 0) return 0;
    return (value / reportData.summary.total_area) * 100;
  };

  const getUserArray = () => {
    if (!reportData.user_info || Object.keys(reportData.user_info).length === 0) {
      return [];
    }
    
    return [{
      ...reportData.user_info,
      status: "active",
      email: "-",
    }];
  };

  const userArray = getUserArray();

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>Total Achieved Buy SQYD Report</h3>
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
          {/* User Information Card */}
          {reportData.user_info && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-primary">
                  <div className="card-header bg-primary text-white d-flex align-items-center">
                    <FaUser className="me-2" />
                    <h5 className="mb-0">User Information</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light p-2 rounded me-3">
                            <FaUser className="text-primary" />
                          </div>
                          <div>
                            <small className="text-muted">Name</small>
                            <h6 className="mb-0">{reportData.user_info.username || "-"}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light p-2 rounded me-3">
                            <i className="fas fa-phone text-primary"></i>
                          </div>
                          <div>
                            <small className="text-muted">Mobile</small>
                            <h6 className="mb-0">{reportData.user_info.mobile || "-"}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-light p-2 rounded me-3">
                            <i className="fas fa-id-card text-primary"></i>
                          </div>
                          <div>
                            <small className="text-muted">User ID</small>
                            <h6 className="mb-0">{reportData.user_info.id || "-"}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Statistics Cards */}
          <div className="row mb-4">
            <div className="col-xl-6 col-md-6 col-sm-12 mb-3">
              <div className="stat-card bg-primary text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Total Area (SQYD)</h6>
                    <h2 className="mb-0">{formatNumber(reportData.summary.total_area)}</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <FaChartArea size={30} />
                  </div>
                </div>
                <p className="mb-0 mt-2 small">Total achieved buy area</p>
              </div>
            </div>

            {/* <div className="col-xl-4 col-md-6 col-sm-12 mb-3">
              <div className="stat-card bg-success text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Total Records</h6>
                    <h2 className="mb-0">{reportData.summary.total_records || 0}</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <i className="fas fa-list" style={{ fontSize: "30px" }}></i>
                  </div>
                </div>
                <p className="mb-0 mt-2 small">Total transaction records</p>
              </div>
            </div> */}

            <div className="col-xl-6 col-md-6 col-sm-12 mb-3">
              <div className="stat-card bg-info text-white p-4 rounded shadow-sm">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-uppercase mb-1">Report Type</h6>
                    <h2 className="mb-0">Single User</h2>
                  </div>
                  <div className="icon-circle bg-white bg-opacity-25 p-3 rounded-circle">
                    <i className="fas fa-file-alt" style={{ fontSize: "30px" }}></i>
                  </div>
                </div>
                <p className="mb-0 mt-2 small">Individual user report</p>
              </div>
            </div>
          </div>

          {/* Breakdown Section - CLICKABLE CARDS */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Area Breakdown</h5>
                  <small className="text-muted">Click on cards to view detailed lists</small>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* Gift Area - CLICKABLE */}
                    <div className="col-xl-4 col-md-4 col-sm-12 mb-4">
                      <div 
                        className="card h-100 border-left-gift clickable-card"
                        onClick={handleGiftAreaClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-gift p-2 rounded me-3">
                                <FaGift className="text-white" />
                              </div>
                              <div>
                                <h6 className="mb-0">Gift Area</h6>
                                <small className="text-muted">Bonus/Gift area</small>
                              </div>
                            </div>
                            <FaExternalLinkAlt className="text-success" />
                          </div>
                          <h2 className="mb-3">{formatNumber(reportData.summary.breakdown?.direct_income_area || 0)} SQYD</h2>
                       
                          <div className="mt-2 d-flex justify-content-between align-items-center">
                          
                            <small className="text-success fw-bold">View Details →</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Direct Income Area - CLICKABLE */}
                    <div className="col-xl-4 col-md-4 col-sm-12 mb-4">
                      <div 
                        className="card h-100 border-left-income clickable-card"
                        onClick={handleDirectIncomeClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-income p-2 rounded me-3">
                                <FaMoneyBill className="text-white" />
                              </div>
                              <div>
                                <h6 className="mb-0">Direct Income Area</h6>
                                <small className="text-muted">Direct commission area</small>
                              </div>
                            </div>
                            <FaExternalLinkAlt className="text-info" />
                          </div>
                          <h2 className="mb-3">{formatNumber(reportData.summary.breakdown?.gift_area || 0)} SQYD</h2>
                         
                          <div className="mt-2 d-flex justify-content-between align-items-center">
                           
                            <small className="text-info fw-bold">View Details →</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parent Commission Area - CLICKABLE */}
                    <div className="col-xl-4 col-md-4 col-sm-12 mb-4">
                      <div 
                        className="card h-100 border-left-commission clickable-card"
                        onClick={handleParentCommissionClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-commission p-2 rounded me-3">
                                <FaPercentage className="text-white" />
                              </div>
                              <div>
                                <h6 className="mb-0">Parent Commission Area</h6>
                                <small className="text-muted">Parent referral commission</small>
                              </div>
                            </div>
                            <FaExternalLinkAlt className="text-warning" />
                          </div>
                          <h2 className="mb-3">{formatNumber(reportData.summary.breakdown?.parent_commission_area || 0)} SQYD</h2>
                       
                          <div className="mt-2 d-flex justify-content-between align-items-center">
                           
                            <small className="text-warning fw-bold">View Details →</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                 
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>

      {/* CSS for custom styling */}
      <style jsx>{`
        .border-left-gift {
          border-left: 4px solid #28a745 !important;
        }
        .border-left-income {
          border-left: 4px solid #17a2b8 !important;
        }
        .border-left-commission {
          border-left: 4px solid #ffc107 !important;
        }
        .bg-gift {
          background-color: #28a745;
        }
        .bg-income {
          background-color: #17a2b8;
        }
        .bg-commission {
          background-color: #ffc107;
        }
        .stat-card {
          transition: transform 0.3s;
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
        .icon-circle {
          transition: all 0.3s;
        }
        .stat-card:hover .icon-circle {
          transform: scale(1.1);
        }
        .avatar-circle {
          font-weight: bold;
          font-size: 14px;
        }
        .clickable-card {
          transition: all 0.3s;
          border: 1px solid #dee2e6;
        }
        .clickable-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          border-color: #0d6efd;
        }
        .clickable-card.border-left-gift:hover {
          border-left-color: #28a745 !important;
          box-shadow: 0 10px 20px rgba(40, 167, 69, 0.2);
        }
        .clickable-card.border-left-income:hover {
          border-left-color: #17a2b8 !important;
          box-shadow: 0 10px 20px rgba(23, 162, 184, 0.2);
        }
        .clickable-card.border-left-commission:hover {
          border-left-color: #ffc107 !important;
          box-shadow: 0 10px 20px rgba(255, 193, 7, 0.2);
        }
      `}</style>
    </div>
  );
}

export default TotalAchievedBuySqydDetails;