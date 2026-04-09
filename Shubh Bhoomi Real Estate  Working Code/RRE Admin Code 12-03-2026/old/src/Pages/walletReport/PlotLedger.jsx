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

function PlotLedger() {
  const [projects, setProjects] = useState([]);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ledgerData, setLedgerData] = useState(null);
  const [formData, setFormData] = useState({
    project_id: "",
    plot_id: "",
    start_date: "",
    end_date: ""
  });
  const [filteredPlots, setFilteredPlots] = useState([]);
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

  useEffect(() => {
    const fetchPlots = async () => {
      if (!formData.project_id) {
        setFilteredPlots([]);
        setPlots([]);
        return;
      }

      const token = getAuthToken();
      if (!token) return;
      try {
        const plotsResponse = await fetch(`${API_URL}/all-plot-list-by-id?project_id=${formData.project_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const plotsData = await plotsResponse.json();
        if (plotsData.status) {
          const allPlots = plotsData.data || [];
          setPlots(allPlots);
          setFilteredPlots(allPlots);
        } else {
          setPlots([]);
          setFilteredPlots([]);
        }

      } catch (err) {
        console.error("Error fetching plots:", err);
        Swal.fire("Error", "Failed to load units", "error");
      }
    };

    fetchPlots();
  }, [formData.project_id]);

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setFormData(prev => ({
      ...prev,
      project_id: projectId,
      plot_id: ""
    }));
    setLedgerData(null);
  };

  const handlePlotChange = (e) => {
    const plotId = e.target.value;
    setFormData(prev => ({
      ...prev,
      plot_id: plotId
    }));
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
    if (!formData.project_id || !formData.plot_id) {
      Swal.fire("Warning", "Please select both project and unit", "warning");
      return;
    }

    setLoading(true);
    const token = getAuthToken();

    try {
      const params = new URLSearchParams({
        project_id: formData.project_id,
        plot_id: formData.plot_id
      });

      if (formData.start_date) params.append("start_date", formData.start_date);
      if (formData.end_date) params.append("end_date", formData.end_date);

      const response = await fetch(`${API_URL}/plot-ledger-report?${params}`, {
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
      plot_id: "",
      start_date: "",
      end_date: ""
    });
    setStartDate(null);
    setEndDate(null);
    setLedgerData(null);
    setFilteredPlots([]);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionTypeBadge = (source) => {
    const badges = {
      'expenses': 'primary',
      'direct_income': 'success',
      'commission': 'warning'
    };

    const labels = {
      'expenses': 'Expense',
      'direct_income': 'Distribution Commisssion',
      'commission': 'Distribution Commisssion'
    };

    return (
      <span className={`badge bg-${badges[source] || 'secondary'}`}>
        {labels[source] || source}
      </span>
    );
  };

  const handleExportExcel = () => {
    if (!ledgerData) return;

    const headers = [
      'Date', 'Transaction ID', 'Type', 'Description',
      'Credit', 'Debit', 'Balance', 'Customer',
      'Associate', 'Unit Details'
    ];

    const rows = ledgerData.ledger.map(entry => [
      entry.date,
      entry.id,
      entry.source_table,
      entry.description,
      entry.cr,
      entry.dr,
      entry.balance,
      entry.customer ? entry.customer.name : '-',
      entry.associate ? entry.associate.name : '-',
      entry.plot ? entry.plot.full_address : '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plot_ledger_${formData.project_id}_${formData.plot_id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm mb-3">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3>Unit Ledger Report</h3>
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
                <Col md={4}>
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

                <Col md={4}>
                  <div className="form-group">
                    <label>Unit <span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      value={formData.plot_id}
                      onChange={handlePlotChange}
                      disabled={!formData.project_id}
                    >
                      <option value="">Select Unit</option>
                      {filteredPlots.map(plot => (
                        <option key={plot.id} value={plot.id}>
                          {plot.plot_shop_villa_no} - {plot.colony_name}
                          {plot.total_area ? ` (${plot.total_area} sq.yd)` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <div className="d-flex gap-2 w-100">
                    <Button
                      variant="primary"
                      onClick={fetchLedgerData}
                      disabled={!formData.project_id || !formData.plot_id || loading}
                      className="w-100"
                    >
                      {loading ? 'Loading...' : 'View Ledger'}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={handleClearFilters}
                      title="Clear all filters"
                      className="btn btn-secondary w-100"
                    >
                      Clear
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
            {ledgerData && (
              <div className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <div className="summary-item">
                          <h6 className="text-muted mb-1">Total Credit</h6>
                          <h4 className="text-success mb-0">
                            {formatCurrency(parseFloat(ledgerData.summary.total_credit))}
                          </h4>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="summary-item">
                          <h6 className="text-muted mb-1">Total Debit</h6>
                          <h4 className="text-danger mb-0">
                            {formatCurrency(parseFloat(ledgerData.summary.total_debit))}
                          </h4>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="summary-item">
                          <h6 className="text-muted mb-1">Closing Balance</h6>
                          <h4 className={`mb-0 ${parseFloat(ledgerData.summary.closing_balance) >= 0 ? 'text-primary' : 'text-danger'}`}>
                            {formatCurrency(parseFloat(ledgerData.summary.closing_balance))}
                          </h4>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            )}
            {loading ? (
              <div className="text-center py-5">
                <p className="mt-3">Loading ledger data...</p>
              </div>
            ) : ledgerData ? (
              <div className="table-responsive">
                <Table striped bordered hover className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Sr No.</th>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Unit</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Payee Name</th>
                      <th>Associate</th>
                      <th className="text-end">Credit (₹)</th>
                      <th className="text-end">Debit (₹)</th>
                      <th className="text-end">Balance (₹)</th>

                    </tr>
                  </thead>
                  <tbody>
                    {ledgerData.ledger.map((entry, index) => (
                      <tr key={index}>
                      <td>{index+1}</td>
                        <td>{entry.date ? new Date(entry.date).toLocaleDateString('en-IN') : '-'}</td>

                        <td>{entry.project.name}</td>
                        <td>{entry.plot.plot_shop_villa_no}</td>
                        <td>
                          {getTransactionTypeBadge(entry.source_table)}
                        </td>
                        <td>{entry?.category?.name}</td>
                        <td>
                          <div className="table-cell-remark">{entry.description}</div>
                        </td>

                        <td>{entry.payment.transaction_name || '-'}</td>
                        <td>
                          {entry.associate ? (
                            <div>
                              <div>{entry.associate.name}</div>
                              <small className="text-muted">{entry.associate.mobile}</small>
                            </div>
                          ) : '-'}
                        </td>

                        <td className="text-end text-success">
                          {parseFloat(entry.cr) > 0 ? formatCurrency(parseFloat(entry.cr)) : '-'}
                        </td>
                        <td className="text-end text-danger">
                          {parseFloat(entry.dr) > 0 ? formatCurrency(parseFloat(entry.dr)) : '-'}
                        </td>
                        <td className={`text-end fw-bold ${parseFloat(entry.balance) >= 0 ? 'text-primary' : 'text-danger'}`}>
                          {formatCurrency(parseFloat(entry.balance))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {ledgerData.ledger.length === 0 && (
                    <tbody>
                      <tr>
                        <td colSpan="10" className="text-center py-4">
                          No transactions found for the selected unit
                        </td>
                      </tr>
                    </tbody>
                  )}
                </Table>

              </div>
            ) : (
              <div className="text-center py-5">
                <BsEye size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No Data Available</h5>
                <p className="text-muted">
                  Please select a project and unit to view the ledger
                </p>
              </div>
            )}
          </div>
        </div>
      </div>


      <style jsx>{`
                .summary-item {
                    text-align: center;
                    padding: 15px;
                    border-radius: 8px;
                    background: #f8f9fa;
                }
                .summary-item h4 {
                    font-weight: bold;
                }
                .table th {
                    font-weight: 600;
                }
                .table td {
                    vertical-align: middle;
                }
                .badge {
                    font-size: 0.75em;
                }
            `}</style>
    </div>
  );
}

export default PlotLedger;