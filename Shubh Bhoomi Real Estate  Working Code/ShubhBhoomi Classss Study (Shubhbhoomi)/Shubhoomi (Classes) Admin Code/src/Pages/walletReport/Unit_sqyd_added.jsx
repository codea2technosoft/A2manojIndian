import React, { useEffect, useState } from "react";
import { Button, Table, Row, Col } from "react-bootstrap";
import { BsFiletypeXls } from "react-icons/bs";
import { CgUnavailable } from "react-icons/cg";
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

  // Pagination state - AllSubadminList ke jaise
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter toggle state - AllSubadminList ke jaise
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

        if (projectsData.status) {
          setProjects(projectsData.data || []);
        }

      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
        Swal.fire("Error", "Failed to load projects", "error");
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
        setError("Failed to load units");
        Swal.fire("Error", "Failed to load units", "error");
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
        limit: 10
      });

      if (formData.start_date) params.append("start_date", formData.start_date);
      if (formData.end_date) params.append("end_date", formData.end_date);
      if (searchQuery) params.append("search", searchQuery);

      const url = `${API_URL}/plot-area-ledger-report?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again.");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch ledger data.");
      }

      const data = await response.json();

      if (data.success === "1") {
        // API रिस्पॉन्स को ट्रांसफ़ॉर्म करें
        const transformedData = transformAPIResponse(data.data);
        setLedgerData(transformedData);
        setTotalPages(data.data.totalPages || 1);
        setCurrentPage(page);
      } else {
        throw new Error(data.message || "Failed to load ledger data");
      }

    } catch (err) {
      console.error("Fetch ledger data error:", err);
      setError(err.message);
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // नया ट्रांसफ़ॉर्मेशन फ़ंक्शन
  const transformAPIResponse = (apiData) => {
    if (!apiData || !apiData.users_with_area) {
      return apiData;
    }

    // users_with_area को hierarchy में कन्वर्ट करें
    const hierarchy = apiData.users_with_area.map(user => ({
      name: user.name,
      mobile: user.mobile,
      buysqrt: user.buysqrt,
      area_distributed: user.total_area_distributed,
      role: user.role,
      hierarchy_levels: user.hierarchy_levels
    }));

    return {
      ...apiData,
      area_distribution: [{
        hierarchy: hierarchy
      }]
    };
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
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    if (!ledgerData) return;

    const headers = [
      'SR. No.',
      'Project',
      'Unit',
      'Associates Name',
      'Associates Mobile',
      'Old Sqyd',
      'New Sqyd',
      'Total Sqyd'
    ];

    const rows = ledgerData.area_distribution?.[0]?.hierarchy?.map((entry, index) => {
      // Old Sqyd की गणना: buysqrt - area_distributed
      const oldSqyd = parseFloat(entry.buysqrt || 0) - parseFloat(entry.area_distributed || 0);

      return [
        index + 1,
        ledgerData.project?.name || '-',
        ledgerData.plot?.plot_shop_villa_no || '-',
        entry.name || '-',
        entry.mobile || '-',
        oldSqyd > 0 ? oldSqyd.toFixed(2) : '0.00',
        entry.area_distributed || '0.00',
        entry.buysqrt || '0.00'
      ];
    }) || [];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    // फ़ाइल नाम में तारीख भी जोड़ें
    const date = new Date().toISOString().split('T')[0];
    a.download = `unit_sqyd_report_${ledgerData.project?.name || 'project'}_${ledgerData.plot?.plot_shop_villa_no || 'unit'}_${date}.csv`;

    a.href = url;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // AllSubadminList ke exact pagination handlers
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      fetchLedgerData(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };


  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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

  if (error && !ledgerData) {
    return (
      <div className="alert alert-danger text-center m-5" role="alert">
        {error}
        <button className="btn btn-primary ms-3" onClick={() => fetchLedgerData()}>
          Retry
        </button>
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
                <h3 style={{whiteSpace:"wrap"}}>Unit AQYD Added To All Associates In One Unit Lists</h3>
              </div>
              <div className="d-flex gap-2">
                {/* <div className="d-none d-md-block">
                  <div className="form-group" id="searchAssociate">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search associate..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div> */}

                <Button
                  variant="success"
                  onClick={handleExportExcel}
                  disabled={!ledgerData}
                  title="Export to Excel"
                >
                  <BsFiletypeXls /> Export
                </Button>

                <div className="d-block d-md-none">
                  <div className="d-flex gap-2">
                    <button
                      className={`filter-toggle-btn btn ${isFilterActive ? "active" : ""}`}
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
                    placeholder="Search associate..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <Row className="gy-2">
                <Col md={5}>
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

                <Col md={5}>
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

                <Col md={2} className="d-flex align-items-end">
                  <div className="d-flex gap-2 w-100">
                    <Button
                      variant="primary"
                      onClick={() => {
                        setCurrentPage(1);
                        fetchLedgerData();
                      }}
                      disabled={!formData.project_id || !formData.plot_id || loading}
                    >
                      {loading ? 'Loading...' : 'View Details'}
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>

            {loading ? (
              <div className="text-center py-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading ledger data...</p>
              </div>
            ) : ledgerData ? (
              <>
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>SR. No.</th>
                        <th>Date</th>
                        <th>Project</th>
                        <th>Unit</th>
                        <th>Associates Name</th>
                        <th>Associates Mobile</th>
                        <th>Old Sqyd</th>
                        <th>New Sqyd</th>
                        {/* <th>Total Sqyd</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {ledgerData?.users_with_area?.length > 0 ? (
                        // सभी यूज़र्स को प्रोसेस करें
                        (() => {
                          let globalSerialNumber = 1; // ग्लोबल सीरियल नंबर काउंटर

                          return ledgerData.users_with_area.flatMap((user) => {
                            const rows = [];

                            // 1. पहले plot_entries से डेटा लें (अगर हैं तो)
                            if (user.plot_entries?.length > 0) {
                              user.plot_entries.forEach((entry) => {
                                rows.push(
                                  <tr key={`plot-${user.user_id}-${entry.entry_id}`}>
                                    <td>{globalSerialNumber++}</td> {/* पोस्ट-इन्क्रीमेंट */}
                                    <td>{formatDate(entry.status_date)}</td>
                                    <td>{ledgerData.project?.name || "-"}</td>
                                    <td>{ledgerData.plot?.plot_shop_villa_no || "-"}</td>
                                    <td>{user.name || "-"}</td>
                                    <td>{user.mobile || "-"}</td>
                                    <td>{entry.old_sqyd || "0.00"}</td>
                                    <td>{entry.new_sqyd || "0.00"}</td>
                                    {/* <td>
                                      {(Number(entry.old_sqyd) + Number(entry.new_sqyd)).toFixed(2)}
                                    </td> */}

                                  </tr>
                                );
                              });
                            }

                            // 2. फिर commissions से डेटा लें (अगर हैं तो)
                            if (user.commissions?.length > 0) {
                              user.commissions.forEach((commission) => {
                                rows.push(
                                  <tr key={`commission-${user.user_id}-${commission.commission_id}`}>
                                    <td>{globalSerialNumber++}</td> {/* पोस्ट-इन्क्रीमेंट */}
                                    <td>{formatDate(commission.status_date)}</td>
                                    <td>{ledgerData.project?.name || "-"}</td>
                                    <td>{ledgerData.plot?.plot_shop_villa_no || "-"}</td>
                                    <td>{commission.associate_name || user.name || "-"}</td>
                                    <td>{commission.associate_mobile || user.mobile || "-"}</td>
                                    <td>{commission.old_sqyd || "0.00"}</td>
                                    <td>{commission.new_sqyd || "0.00"}</td>

                                    {/* <td>
                                      {(Number(commission.old_sqyd) + Number(commission.new_sqyd)).toFixed(2)}
                                    </td> */}


                                  </tr>
                                );
                              });
                            }

                            return rows;
                          });
                        })()
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center text-muted">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* AllSubadminList ke exact pagination */}
                <div className="d-flex justify-content-end mt-3">
                  <nav>
                    <ul className="pagination">
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <HiOutlineChevronLeft />
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li key={index + 1} className="page-item">
                          <button
                            className={`page-link ${index + 1 === currentPage ? "active" : ""}`}
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className="page-item">
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
              </>
            ) : (
              <div className="text-center py-3">
                <CgUnavailable size={35} className="text-muted mb-2" />
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