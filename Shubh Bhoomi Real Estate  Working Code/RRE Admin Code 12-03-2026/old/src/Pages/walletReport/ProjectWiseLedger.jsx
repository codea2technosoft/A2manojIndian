import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Table, Pagination, Row, Col, Card } from "react-bootstrap";
import { BsFiletypeXls, BsEye } from "react-icons/bs";
import { FaCalendar, FaTimes, FaFilter } from "react-icons/fa";
import { MdFilterAltOff, MdFilterAlt } from "react-icons/md";
import { RiFilterFill } from "react-icons/ri";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = process.env.REACT_APP_API_URL;

function ProjectWiseLedger() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ledgerData, setLedgerData] = useState(null);
  const [formData, setFormData] = useState({
    project_id: "",
    start_date: "",
    end_date: ""
  });

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  
  useEffect(() => {
    const fetchProjects = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const projectsResponse = await fetch(`${API_URL}/project-list-block`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const projectsData = await projectsResponse.json();
        if (projectsData.status) {
          setProjects(projectsData.data || []);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        Swal.fire("Error", "Failed to load projects", "error");
      }
    };

    fetchProjects();
  }, []);
 
  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setFormData(prev => ({
      ...prev,
      project_id: projectId,
    }));
    setLedgerData(null);
  };
  
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start && end) {
      setFormData(prev => ({
        ...prev,
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0]
      }));
    }
  };
  
  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setFormData(prev => ({
      ...prev,
      start_date: "",
      end_date: ""
    }));
    setShowDateFilter(false);
  };
  
  const fetchLedgerData = async () => {
    if (!formData.project_id) {
      Swal.fire("Warning", "Please select a project", "warning");
      return;
    }
    setLoading(true);
    const token = getAuthToken();

    try {
      const params = new URLSearchParams({
        project_id: formData.project_id,
      });
      if (formData.start_date) params.append("start_date", formData.start_date);
      if (formData.end_date) params.append("end_date", formData.end_date);
      
      const response = await fetch(`${API_URL}/project_wise-ledger-report?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success === "1") {
        setLedgerData(data.data);
        Swal.fire("Success", "Ledger data loaded successfully", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to load ledger data", "error");
      }

    } catch (err) {
      console.error("Error fetching ledger data:", err);
      Swal.fire("Error", "Failed to load ledger data", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearFilters = () => {
    setFormData({
      project_id: "",
      start_date: "",
      end_date: ""
    });
    setStartDate(null);
    setEndDate(null);
    setLedgerData(null);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const handleExportExcel = () => {
    if (!ledgerData) return;
    
    const headers = [
      'Plot No', 'Block', 'Customer', 'Associate', 
      'Total Credit (₹)', 'Total Debit (₹)', 'Balance (₹)', 'Total Value (₹)'
    ];

    const rows = ledgerData.plots_ledger.map(item => [
      item.plot.plot_shop_villa_no,
      item.plot.block_name,
      item.customer.name,
      item.associate.name,
      item.financials.total_credit,
      item.financials.total_debit,
      item.financials.balance,
      item.financials.total_value
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_wise_ledger_report_${formData.project_id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm mb-3">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3>Project Wise Ledger Report</h3>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="success"
                onClick={handleExportExcel}
                disabled={!ledgerData}
                title="Export to Excel"
              >
                <BsFiletypeXls /> Export
              </Button>
            </div>
          </div>

          <div className="card-body">
            <div className="mb-4">
              <Row>
                <Col md={3}>
                  <div className="form-group">
                    <label>Project <span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      value={formData.project_id}
                      onChange={handleProjectChange}
                    >
                      <option value="">Select Project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="form-group">
                    <label>Date Range</label>
                    <div className="d-flex align-items-center">
                      <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={handleDateChange}
                        isClearable={true}
                        placeholderText="Select date range"
                        className="form-control"
                        dateFormat="dd/MM/yyyy"
                      />
                      {(startDate || endDate) && (
                        <Button
                          variant="link"
                          className="ms-2 p-0 text-danger"
                          onClick={clearDateFilter}
                          title="Clear date filter"
                        >
                          <FaTimes />
                        </Button>
                      )}
                    </div>
                  </div>
                </Col>
               
                <Col md={3} className="d-flex align-items-end">
                  <div className="d-flex gap-2 w-100">
                    <Button
                      variant="primary"
                      onClick={fetchLedgerData}
                      disabled={!formData.project_id || loading}
                      className="w-100"
                    >
                      {loading ? 'Loading...' : 'View Ledger'}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={handleClearFilters}
                      title="Clear all filters"
                    >
                      Clear
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
            
            {ledgerData && (
              <>
                {/* Project Info */}
                <div className="mb-3">
                  <Card className="bg-light">
                    <Card.Body>
                      <h5 className="mb-0">Project: {ledgerData.project.name}</h5>
                      {ledgerData.filters.date_range_applied && (
                        <small className="text-muted">
                          Date Range: {ledgerData.filters.start_date || 'Start'} to {ledgerData.filters.end_date || 'End'}
                        </small>
                      )}
                    </Card.Body>
                  </Card>
                </div>

                {/* Summary Cards */}
                <div className="mb-4">
                  <Row>
                    <Col md={3}>
                      <Card className="shadow-sm">
                        <Card.Body>
                          <div className="summary-item">
                            <h6 className="text-muted mb-1">Total Plots</h6>
                            <h4 className="text-primary mb-0">
                              {ledgerData.summary.total_plots}
                            </h4>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="shadow-sm">
                        <Card.Body>
                          <div className="summary-item">
                            <h6 className="text-muted mb-1">Total Credit</h6>
                            <h4 className="text-success mb-0">
                              {formatCurrency(parseFloat(ledgerData.summary.total_credit))}
                            </h4>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="shadow-sm">
                        <Card.Body>
                          <div className="summary-item">
                            <h6 className="text-muted mb-1">Total Debit</h6>
                            <h4 className="text-danger mb-0">
                              {formatCurrency(parseFloat(ledgerData.summary.total_debit))}
                            </h4>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="shadow-sm">
                        <Card.Body>
                          <div className="summary-item">
                            <h6 className="text-muted mb-1">Total Balance</h6>
                            <h4 className="text-info mb-0">
                              {formatCurrency(parseFloat(ledgerData.summary.total_balance))}
                            </h4>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </>
            )}
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading ledger data...</p>
              </div>
            ) : ledgerData ? (
              <div className="table-responsive">
                <Table striped bordered hover className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr No.</th>
                      <th>Plot No.</th>
                      <th>Block</th>
                      <th>Customer Name</th>
                      <th>Customer Mobile</th>
                      <th>Associate Name</th>
                      <th>Associate Mobile</th>
                      <th>Total Credit (₹)</th>
                      <th>Total Debit (₹)</th>
                      <th>Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerData.plots_ledger.map((item, index) => (
                      <tr key={item.plot.id || index}>
                        <td>{index + 1}</td>
                        <td>{item.plot.plot_shop_villa_no}</td>
                        <td>{item.plot.block_name}</td>
                        <td>{item.customer.name}</td>
                        <td>{item.customer.mobile}</td>
                        <td>{item.associate.name}</td>
                        <td>{item.associate.mobile}</td>
                        <td className="text-success">
                          {formatCurrency(parseFloat(item.financials.total_credit))}
                        </td>
                        <td className="text-danger">
                          {formatCurrency(parseFloat(item.financials.total_debit))}
                        </td>
                        <td className={parseFloat(item.financials.balance) >= 0 ? 'text-primary' : 'text-danger'}>
                          {formatCurrency(parseFloat(item.financials.balance))}
                        </td>
                     
                      </tr>
                    ))}
                    {ledgerData.plots_ledger.length === 0 && (
                      <tr>
                        <td colSpan="12" className="text-center py-4">
                          No plots found for the selected project
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5">
                <BsEye size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No Data Available</h5>
                <p className="text-muted">
                  Please select a project to view the ledger
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .summary-item {
          text-align: center;
          padding: 10px;
          border-radius: 8px;
        }
        .summary-item h4 {
          font-weight: bold;
          margin: 0;
        }
        .summary-item h6 {
          margin-bottom: 5px;
        }
        .table th {
          font-weight: 600;
          white-space: nowrap;
        }
        .table td {
          vertical-align: middle;
        }
        .badge {
          font-size: 0.75em;
          padding: 0.35em 0.65em;
        }
      `}</style>
    </div>
  );
}

export default ProjectWiseLedger;