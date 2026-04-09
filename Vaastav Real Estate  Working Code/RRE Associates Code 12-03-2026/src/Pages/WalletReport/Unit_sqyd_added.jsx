import React, { useEffect, useState } from "react";
import { Button, Table, Row, Col, Card } from "react-bootstrap";
import { BsFiletypeXls, BsEye, BsPerson } from "react-icons/bs";
import Swal from "sweetalert2";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi2";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function Unit_sqyd_added() {
  const [projects, setProjects] = useState([]);
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ledgerData, setLedgerData] = useState(null);
  const [formData, setFormData] = useState({
    project_id: "",
    plot_id: "",
    start_date: "",
    end_date: ""
  });
  const [filteredPlots, setFilteredPlots] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter toggle state
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

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

        if (projectsData && Array.isArray(projectsData)) {
          setProjects(projectsData);
        } else if (projectsData?.data && Array.isArray(projectsData.data)) {
          setProjects(projectsData.data);
        } else if (projectsData?.status && projectsData?.data) {
          setProjects(projectsData.data);
        } else {
          setProjects([]);
        }
        setError(null);

      } catch (err) {
        console.error("Error fetching projects:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load projects. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
      } finally {
        setLoading(false);
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

      setLoading(true);
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
      } finally {
        setLoading(false);
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
    setError(null);
  };

  const handlePlotChange = (e) => {
    const plotId = e.target.value;
    setFormData(prev => ({
      ...prev,
      plot_id: plotId
    }));
  };

  const fetchLedgerData = async (page = 1) => {
    if (!formData.project_id || !formData.plot_id) {
      Swal.fire("Warning", "Please select both project and unit", "warning");
      return;
    }

    setLoading(true);
    setError(null);
    const token = getAuthToken();

    try {
      const params = new URLSearchParams({
        project_id: formData.project_id,
        plot_id: formData.plot_id,
        page: page,
        limit: 1000
      });

      if (formData.start_date) params.append("start_date", formData.start_date);
      if (formData.end_date) params.append("end_date", formData.end_date);
      if (searchQuery) params.append("search", searchQuery);

      const url = `${API_URL}/plot-area-ledger-report?${params.toString()}`;
      console.log("Fetching URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ledger data.");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "1" && data.plots && Array.isArray(data.plots)) {
        console.log("Using new response structure");
        setLedgerData(data);

        let totalItems = 0;
        data.plots.forEach(plot => {
          totalItems += (plot.commissions?.length || 0) + (plot.plot_entries?.length || 0);
        });

        setTotalPages(Math.ceil(totalItems / 10) || 1);
        setCurrentPage(page);
      }
      else {
        console.log("Unexpected response structure:", data);
        setLedgerData(null);
        Swal.fire("Info", "No data found or unexpected response format", "info");
      }

    } catch (err) {
      console.error("Fetch ledger data error:", err);
      setLedgerData(null);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch ledger data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to flatten the data for table display
  const getFlatTableData = () => {
    if (!ledgerData || !ledgerData.plots || !Array.isArray(ledgerData.plots)) {
      return [];
    }

    const flatData = [];

    // Loop through each plot
    ledgerData.plots.forEach((plotItem) => {
      const plot = plotItem.plot || {};
      const project = plotItem.project || {};

      // Add plot entries as rows (customers)
      if (plotItem.plot_entries && Array.isArray(plotItem.plot_entries)) {
        plotItem.plot_entries.forEach((entry) => {
          const newSqyd = parseFloat(entry.new_sqyd || 0);
          const oldSqyd = parseFloat(entry.old_sqyd || 0);
          const areaDistributed = (newSqyd - oldSqyd).toFixed(2);

          flatData.push({
            projectName: project.name || "-",
            unitNo: plot.plot_shop_villa_no || "-",
            name: entry.customer_name || "Customer",
            mobile: entry.customer_mobile || "-",
            oldSqyd: entry.old_sqyd || "0.00",
            newSqyd: areaDistributed,
            totalSqyd: entry.new_sqyd || "0.00",
            role: entry.level === "1" ? "Direct Customer" : `Level ${entry.level} Customer`,
            statusDate: entry.status_date || "-",
            type: 'entry',
            level: entry.level,
            rate: entry.rate,
            grossPayout: entry.gross_payout,
            netPayout: entry.net_payout
          });
        });
      }

      // Add commissions as rows
      if (plotItem.commissions && Array.isArray(plotItem.commissions)) {
        plotItem.commissions.forEach((commission) => {
          const newSqyd = parseFloat(commission.new_sqyd || 0);
          const oldSqyd = parseFloat(commission.old_sqyd || 0);
          const areaDistributed = (newSqyd - oldSqyd).toFixed(2);

          flatData.push({
            projectName: project.name || "-",
            unitNo: plot.plot_shop_villa_no || "-",
            name: commission.customer_name || `Level ${commission.level} Associate`,
            mobile: commission.customer_mobile || "-",
            oldSqyd: commission.old_sqyd || "0.00",
            newSqyd: areaDistributed,
            totalSqyd: commission.new_sqyd || "0.00",
            role: `Level ${commission.level} Commission`,
            statusDate: commission.status_date || "-",
            type: 'commission',
            level: commission.level,
            commissionAmount: commission.commission_amount
          });
        });
      }
    });

    // Sort by date if needed (oldest first)
    flatData.sort((a, b) => {
      if (a.statusDate === "-") return 1;
      if (b.statusDate === "-") return -1;
      return new Date(a.statusDate) - new Date(b.statusDate);
    });

    console.log("Flat data for table:", flatData);
    return flatData;
  };

  // Get current page data
  const getCurrentPageData = () => {
    const flatData = getFlatTableData();
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return flatData.slice(startIndex, endIndex);
  };

  // Apply search filter
  const getFilteredData = () => {
    const flatData = getFlatTableData();

    if (!searchQuery) {
      const startIndex = (currentPage - 1) * 10;
      const endIndex = startIndex + 10;
      return flatData.slice(startIndex, endIndex);
    }

    const filtered = flatData.filter(entry =>
      entry.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.mobile?.includes(searchQuery) ||
      entry.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const newTotalPages = Math.ceil(filtered.length / 10);
    if (newTotalPages !== totalPages) {
      setTotalPages(newTotalPages || 1);
    }

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return filtered.slice(startIndex, endIndex);
  };

  // Update total pages when data changes
  useEffect(() => {
    if (ledgerData) {
      const flatData = getFlatTableData();
      setTotalPages(Math.ceil(flatData.length / 10) || 1);
    }
  }, [ledgerData]);

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
    setSearchQuery("");
    setCurrentPage(1);
    setError(null);
  };

  const handleExportExcel = () => {
    const flatData = getFlatTableData();
    if (!flatData.length) return;

    const headers = [
      'SR. No.',
      'Date',
      'Role',
      'Project',
      'Unit',
      'Associate Name',
      'Associate Mobile',
      'Old Sqyd',
      'Area Added (New Sqyd)',
      'Total Sqyd',


    ];

    const rows = flatData.map((entry, index) => [
      index + 1,
      entry.statusDate,
      entry.role,
      entry.projectName,
      entry.unitNo,
      entry.name,
      entry.mobile,
      entry.oldSqyd,
      entry.newSqyd,
      entry.totalSqyd,


    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    const date = new Date().toISOString().split('T')[0];
    a.download = `unit_sqyd_report_${date}.csv`;

    a.href = url;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card bg-white">
          <div className="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <div className="titlepage">
                <h3>Unit SQYD Added To All Associates In One Unit Lists</h3>
              </div>
              <div className="d-flex gap-2">
                {getFlatTableData().length > 0 && (
                  <Button
                    variant="success"
                    onClick={handleExportExcel}
                    title="Export to Excel"
                  >
                    <BsFiletypeXls /> Export
                  </Button>
                )}
                <div className="d-block d-md-none">
                  <div className="d-flex gap-2">
                    <button
                      className={`filter-toggle-btn ${isFilterActive ? "active" : ""}`}
                      onClick={handleToggle}
                    >
                      {isFilterActive ? <MdFilterAltOff /> : <MdFilterAlt />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            {isFilterActive && (
              <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
                <div className="form-group w-100" id="searchAssociate">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, mobile or role..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}

            <div className="mb-4">
              <Row className="gy-2">
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
                      onClick={() => {
                        setCurrentPage(1);
                        fetchLedgerData();
                      }}
                      disabled={!formData.project_id || !formData.plot_id || loading}
                      className="w-100"
                    >
                      {loading ? 'Loading...' : 'View Details'}
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

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading ledger data...</p>
              </div>
            ) : ledgerData ? (
              <>
                {/* Main User Card - Show Above the Table */}
                {ledgerData.user && (
                  <Card className="mb-4 border-primary">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">
                        <BsPerson className="me-2" />
                        Main User Details
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={3}>
                          <strong>Name:</strong>
                          <p className="mb-0">{ledgerData.user.name || "-"}</p>
                        </Col>
                        <Col md={3}>
                          <strong>Mobile:</strong>
                          <p className="mb-0">{ledgerData.user.mobile || "-"}</p>
                        </Col>
                        <Col md={3}>
                          <strong>Total Area (SQYD):</strong>
                          <p className="mb-0">{parseFloat(ledgerData.user.buysqrt || 0).toFixed(2)}</p>
                        </Col>

                        <Col md={3}>
                          <strong>Email:</strong>
                          <p className="mb-0">{ledgerData.user.email || "-"}</p>
                        </Col>

                      </Row>
                    </Card.Body>
                  </Card>
                )}

                {/* Selected Plot Info */}
                {/* {ledgerData.plots && ledgerData.plots.length > 0 && (
                  <Card className="mb-4 border-info">
                    <Card.Header className="bg-info text-white">
                      <h5 className="mb-0">Selected Unit Details</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {ledgerData.plots.map((plotItem, index) => (
                          <React.Fragment key={index}>
                            <Col md={3}>
                              <strong>Project:</strong>
                              <p className="mb-0">{plotItem.project?.name || "-"}</p>
                            </Col>
                            <Col md={3}>
                              <strong>Unit No.:</strong>
                              <p className="mb-0">{plotItem.plot?.plot_shop_villa_no || "-"}</p>
                            </Col>
                            <Col md={3}>
                              <strong>Block:</strong>
                              <p className="mb-0">{plotItem.plot?.block_name || "-"}</p>
                            </Col>
                            <Col md={3}>
                              <strong>Total Area:</strong>
                              <p className="mb-0">{parseFloat(plotItem.plot?.total_area || 0).toFixed(2)} Sq.Yd</p>
                            </Col>
                          </React.Fragment>
                        ))}
                      </Row>
                    </Card.Body>
                  </Card>
                )} */}

                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>SR. No.</th>
                        <th>Date</th>
                        <th>Role</th>
                        <th>Project</th>
                        <th>Unit</th>
                        <th>Associate Name</th>
                        <th>Associate Mobile</th>
                        <th>Old SQYD</th>
                        <th>New SQYD</th>
                        <th>Total SQYD</th>


                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredData().length > 0 ? (
                        getFilteredData().map((entry, index) => {
                          const actualIndex = (currentPage - 1) * 10 + index + 1;

                          return (
                            <tr key={`${entry.type}-${index}-${entry.mobile}`}>
                              <td>{actualIndex}</td>
                              <td>{entry.statusDate}</td>
                              <td>{entry.role}</td>
                              <td>{entry.projectName}</td>
                              <td>{entry.unitNo}</td>
                              <td>{entry.name}</td>
                              <td>{entry.mobile}</td>
                              <td>{parseFloat(entry.oldSqyd).toFixed(2)}</td>
                              <td>{parseFloat(entry.newSqyd).toFixed(2)}</td>
                              <td>{parseFloat(entry.totalSqyd).toFixed(2)}</td>


                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center text-muted">
                            No matching records found
                          </td>
                        </tr>
                      )}
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
                          const maxVisiblePages = 5; // Number of visible page buttons

                          if (totalPages <= maxVisiblePages + 2) {
                            // Show all pages if total is small
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

                            // Show ellipsis if current page is > 3
                            if (currentPage > 3) {
                              pages.push(
                                <li key="ellipsis1" className="page-item disabled">
                                  <span className="page-link">...</span>
                                </li>
                              );
                            }

                            // Show pages around current page
                            const start = Math.max(2, currentPage - 1);
                            const end = Math.min(totalPages - 1, currentPage + 1);

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
                            if (totalPages > 1) {
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
              <div className="text-center py-5">
                <BsEye size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No Data Available</h5>
                <p className="text-muted">
                  Please select a project and unit to view the Unit SQYD Added
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unit_sqyd_added;