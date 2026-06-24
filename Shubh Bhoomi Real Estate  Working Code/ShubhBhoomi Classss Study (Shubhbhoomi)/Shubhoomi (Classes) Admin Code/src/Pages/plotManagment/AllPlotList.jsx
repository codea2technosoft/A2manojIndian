import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  Table,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import {
  MdAirplanemodeInactive,
  MdAirplanemodeActive,
  MdOutlineUpcoming,
  MdUpcoming,
} from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;
const allowedDomains = [
  "rajasthanirealestates.in",
  "realestate.a2logicgroup.com",
];

const dontallowedDomains = ["master.bahikhatas.com"];

const currentDomain = window.location.host;

function AllPlotList() {
  const [plots, setPlots] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [limit, setLimit] = useState(10);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [editFormData, setEditFormData] = useState({
    plot_id: "",
    project_id: "",
    project_name: "",
    block_id: "",
    block_name: "",
    property_type: "",
    plot_shop_villa_no: "",
    plot_size: "",
    plot_sqyd: "",
    plot_rate: "",
    resgistry_patta: "",
    resgistry_date: "",
    plot_hold: "",
    plot_address: "",
    status: "",
  });

  const [projectsForEdit, setProjectsForEdit] = useState([]);
  const [blocksForEdit, setBlocksForEdit] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: "",
    confirmAction: null,
  });

  const [isFilterActive, setIsFilterActive] = useState(false);

  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({
      title: "",
      text: "",
      type: "",
      confirmAction: null,
    });
  };

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const fetchProjectsListForEdit = async () => {
      setLoadingDropdowns(true);
      try {
        const token = getAuthToken();
        if (!token) {
          showCustomMessageModal(
            "Authentication Error",
            "Authentication token not found. Please log in.",
            "error",
          );
          setLoadingDropdowns(false);
          return;
        }

        const response = await fetch(`${API_URL}/project-list-block`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          showCustomMessageModal(
            "Error",
            errorData.message || "Failed to fetch projects for dropdown.",
            "error",
          );
          setLoadingDropdowns(false);
          return;
        }

        const data = await response.json();
        setProjectsForEdit(data.data || []);
      } catch (err) {
        console.error("Fetch projects for edit error:", err);
        showCustomMessageModal(
          "Error",
          err.message ||
          "An unexpected error occurred while fetching projects for edit.",
          "error",
        );
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchProjectsListForEdit();
  }, []);

  useEffect(() => {
    const fetchBlocksListForEdit = async () => {
      if (editFormData.project_id) {
        setLoadingDropdowns(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
            setLoadingDropdowns(false);
            return;
          }

          const response = await fetch(`${API_URL}/block-list-plot`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ project_id: editFormData.project_id }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            showCustomMessageModal(
              "Error",
              errorData.message || "Failed to fetch blocks for dropdown.",
              "error",
            );
            setBlocksForEdit([]);
            setLoadingDropdowns(false);
            return;
          }

          const data = await response.json();
          setBlocksForEdit(data.data || []);
        } catch (err) {
          console.error("Fetch blocks for edit error:", err);
          showCustomMessageModal(
            "Error",
            err.message ||
            "An unexpected error occurred while fetching blocks for edit.",
            "error",
          );
          setBlocksForEdit([]);
        } finally {
          setLoadingDropdowns(false);
        }
      } else {
        setBlocksForEdit([]);
      }
    };

    fetchBlocksListForEdit();
  }, [editFormData.project_id]);

  const fetchPlots = async (page = 1, query = "", projectFilter = "") => {
    setError(null);
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
        return;
      }

      const url = new URL(`${API_URL}/plot-list`);
      url.searchParams.append("page", page);
      url.searchParams.append("limit", limit);

      // Add unit no search
      if (query) {
        url.searchParams.append("plot_shop_villa_no", query);
      }

      // Add project filter
      if (projectFilter) {
        url.searchParams.append("project_name", projectFilter);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          showCustomMessageModal(
            "Authorization Error",
            "Unauthorized: Please log in again.",
            "error",
          );
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch Units.");
      }

      const data = await response.json();
      setPlots(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Fetch Units error:", err);
      setError(err.message);
      if (!showMessageModal) {
        showCustomMessageModal(
          "Error",
          err.message || "An unexpected error occurred while fetching Units.",
          "error",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots(currentPage, searchQuery, selectedProject);
  }, [currentPage, searchQuery, selectedProject]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleProjectFilterChange = (e) => {
    setSelectedProject(e.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedProject("");
    setCurrentPage(1);
  };

  const handleViewPlot = async (plotId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
        return;
      }

      const response = await fetch(`${API_URL}/plot-view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: plotId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch unit details.");
      }

      const data = await response.json();
      setSelectedPlot(data.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("View Units error:", err);
      setError(err.message);
      showCustomMessageModal(
        "Error",
        err.message ||
        "An unexpected error occurred while fetching unit details.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlot = async (plotId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
        return;
      }

      const response = await fetch(`${API_URL}/plot-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: plotId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch Units for editing.",
        );
      }

      const data = await response.json();
      const plotData = data.data;
      setSelectedPlot(plotData);

      setEditFormData({
        plot_id: plotData.id || "",
        project_id: plotData.project_id || "",
        project_name: plotData.project_name || "",
        block_id: plotData.block_id || "",
        block_name: plotData.block_name || "",
        plot_shop_villa_no: plotData.plot_shop_villa_no || "",
        plot_size: plotData.dimension || "",
        plot_sqyd: plotData.area_sqyd || "",
        plot_rate: plotData.rate || "",
        resgistry_patta: plotData.document_type || "",
        plot_address: plotData.address || "",
        status: plotData.status || "Available",
      });
      setShowEditModal(true);
    } catch (err) {
      console.error("Edit plot error:", err);
      setError(err.message);
      showCustomMessageModal(
        "Error",
        err.message ||
        "An unexpected error occurred while fetching Units for editing.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === "project_id") {
        const selectedProjectObj = projectsForEdit.find(
          (proj) => proj.id.toString() === value,
        );
        newData.project_name = selectedProjectObj
          ? selectedProjectObj.name
          : "";
        newData.block_id = "";
        newData.block_name = "";
        setBlocksForEdit([]);
      } else if (name === "block_id") {
        const selectedBlockObj = blocksForEdit.find(
          (block) => block.id.toString() === value,
        );
        newData.block_name = selectedBlockObj ? selectedBlockObj.name : "";
      }
      return newData;
    });
  };

  const handleUpdatePlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal(
          "Authentication Error",
          "Authentication token not found. Please log in.",
          "error",
        );
        return;
      }

      const payload = {
        plot_id: editFormData.plot_id,
        project_id: editFormData.project_id,
        project_name: editFormData.project_name,
        block_id: editFormData.block_id,
        block_name: editFormData.block_name,
        plot_shop_villa_no: editFormData.plot_shop_villa_no,
        dimension: parseFloat(editFormData.plot_size),
        area_sqyd: parseFloat(editFormData.plot_sqyd),
        rate: parseFloat(editFormData.plot_rate),
        document_type: editFormData.resgistry_patta,
        address: editFormData.plot_address,
        status: editFormData.status,
      };

      const response = await fetch(`${API_URL}/plot-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update Units.");
      }
      const result = await response.json();
      if (result.success == "1") {
        showCustomMessageModal(
          "Success",
          "Units updated successfully!",
          "success",
        );
        setShowEditModal(false);
        fetchPlots(currentPage, searchQuery, selectedProject);
      }
    } catch (err) {
      console.error("Update plot error:", err);
      setError(err.message);
      showCustomMessageModal(
        "Error",
        err.message || "An unexpected error occurred while updating Units.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (plotId, currentStatus) => {
    const newStatus = currentStatus === "available" ? "sold" : "available";
    showCustomMessageModal(
      "Confirm Status Change",
      `Do you want to change the status to ${newStatus}?`,
      "warning",
      async () => {
        setLoading(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
            return;
          }

          const response = await fetch(`${API_URL}/plot-status-update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: plotId, status: newStatus }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to update Units status.",
            );
          }

          const result = await response.json();

          if (result.success == "1") {
            showCustomMessageModal(
              "Success",
              "Units status updated successfully!",
              "success",
            );
            fetchPlots(currentPage, searchQuery, selectedProject);
          }
        } catch (err) {
          console.error("Status update error:", err);
          setError(err.message);
          showCustomMessageModal(
            "Error",
            err.message ||
            "An unexpected error occurred while updating plot status.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const handleDeletePlot = async (plotId) => {
    showCustomMessageModal(
      "Confirm Deletion",
      "Are you sure you want to delete this Units? This action cannot be undone.",
      "warning",
      async () => {
        setLoading(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal(
              "Authentication Error",
              "Authentication token not found. Please log in.",
              "error",
            );
            return;
          }

          const response = await fetch(`${API_URL}/plot-delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: plotId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete Units.");
          }

          showCustomMessageModal(
            "Success",
            "Units deleted successfully!",
            "success",
          );
          fetchPlots(currentPage, searchQuery, selectedProject);
        } catch (err) {
          console.error("Delete Units error:", err);
          setError(err.message);
          showCustomMessageModal(
            "Error",
            err.message || "An unexpected error occurred while deleting Units.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedPlot(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPlot(null);
    setEditFormData({
      plot_id: "",
      project_id: "",
      project_name: "",
      block_id: "",
      block_name: "",
      property_type: "",
      plot_shop_villa_no: "",
      plot_size: "",
      plot_sqyd: "",
      plot_rate: "",
      resgistry_patta: "",
      resgistry_date: "",
      plot_hold: "",
      plot_address: "",
      status: "",
    });
    setBlocksForEdit([]);
  };

  const exportAllToExcel = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Please login!");
        return;
      }
      let url = `${API_URL}/plot-excel-download`;
      const params = new URLSearchParams();

      if (searchQuery.trim() !== "") {
        params.append("plot_shop_villa_no", searchQuery);
      }

      if (selectedProject.trim() !== "") {
        params.append("project_name", selectedProject);
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/csv",
        },
      });

      if (!response.ok) {
        alert("Server Error: Unable to download!");
        return;
      }

      let filename = `unit${Date.now()}.csv`;
      if (selectedProject.trim() !== "") {
        const cleanProjectName = selectedProject.replace(/[^a-zA-Z0-9]/g, "_");
        filename = `unit_${cleanProjectName}_${Date.now()}.csv`;
      }

      const csvData = await response.text();
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      link.click();

      showCustomMessageModal(
        "Success",
        selectedProject
          ? `Data exported successfully for project: ${selectedProject}`
          : "All units data exported successfully",
        "success",
      );
    } catch (error) {
      console.error("CSV Export Error:", error);
      alert("Export Failed! Try again");
    }
  };

  const fetchProjects = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/project-list-block`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center m-5" role="alert">
        {error}
        <button className="btn btn-primary ms-3" onClick={() => fetchPlots()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="userlist mt-2">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between flex-wrap-mobile gap-2">
            <div className="titlepage">
              <h3>All Unit List</h3>
            </div>
            <div className="d-flex gap-2 align-items-center">
              {!dontallowedDomains.includes(currentDomain) && (
                <div className="createnewadmin">
                  <button
                    className="exportexcel btn gap-2 btn-success d-inline-flex align-items-center"
                    onClick={exportAllToExcel}
                    disabled={exporting}
                  >
                    <FaDownload />
                    {exporting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Exporting...
                      </>
                    ) : (
                      `Export`
                    )}
                  </button>
                </div>
              )}

              <div className="createnewadmin">
                <Link
                  to="/create-plot-manual"
                  className="btn btn-success d-flex align-items-center"
                >
                  <FaPlus className="me-2" /> Manual Add
                </Link>
              </div>

              <div className="createnewadmin">
                <Link
                  to="/create-plot"
                  className="btn btn-success d-flex align-items-center"
                >
                  <FaPlus className="me-2" /> Upload CSV
                </Link>
              </div>
              <div className="d-flex gap-2">
                <button
                  className={`filter-toggle-btn btn border boder-1 ${isFilterActive ? "active" : ""}`}
                  onClick={handleToggle}
                >
                  {isFilterActive ? (
                    <>
                      <MdFilterAltOff />
                    </>
                  ) : (
                    <>
                      <MdFilterAlt />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {isFilterActive && (
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
              <Form.Group
                controlId="projectFilterMobile"
                className="flex-grow-1"
              >
                <Form.Select
                  value={selectedProject}
                  onChange={handleProjectFilterChange}
                  style={{ minWidth: "180px" }}
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.name}>
                      {project.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group
                controlId="searchPlotMobile"
                className="d-flex flex-grow-1"
              >
                <input
                  type="text"
                  placeholder="Search by Unit No."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="form-control"
                />
                <button
                  type="button"
                  className="btn btn-primary ms-2"
                  onClick={handleSearchSubmit}
                >
                  Search
                </button>
              </Form.Group>

              {(searchQuery || selectedProject) && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          <div className="table-responsive">
            <Table bordered>
              <thead className="bg-primary text-white">
                <tr>
                  <th>ID</th>
                  <th>Project Name</th>
                  <th>Block Name</th>
                  <th>Unit No.</th>
                  <th>Road Size</th>
                  <th>Unit Type (Corner/Normal)</th>
                  <th>Facing</th>
                  <th>Unit Size</th>
                  <th>Unit Area SQMT</th>
                  <th>Unit Area(SQYD)</th>
                  <th>PLC (%)</th>
                  <th>Unit Rate(Per SQYd Rate)</th>
                  <th>Unit Price</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plots?.length > 0 ? (
                  plots.map((plot, index) => (
                    <tr key={plot.id}>
                      <td>{(currentPage - 1) * limit + (index + 1)}</td>
                      <td>{plot.project_name}</td>
                      <td>{plot.block_name}</td>
                      <td>{plot.plot_shop_villa_no}</td>
                      <td>{plot.road_size || "NA"}</td>
                      <td>{plot.unit_type || "NA"}</td>
                      <td>{plot.facing || "NA"}</td>
                      <td>{plot.dimension || "0.00"}</td>
                      <td>{plot.unit_area_sqmt || "0.00"}</td>
                      <td>{plot.area_sqyd || "0.00"}</td>
                      <td>{plot.plc_percentage || "0.00"}</td>
                      <td>{plot.rate || "0.00"}</td>
                      <td>{plot.unit_price || "0.00"}</td>
                      <td>
                        {plot.date
                          ? (() => {
                            const [day, month, year] = plot.date.split("-");
                            const formattedDate = new Date(`${year}-${month}-${day}`);
                            return !isNaN(formattedDate)
                              ? formattedDate.toLocaleDateString("en-GB")
                              : "NA";
                          })()
                          : "NA"}
                      </td>
                      <td>
                        <span
                          className={`badge ${plot.status === "available"
                              ? "bg-success"
                              : "bg-danger"
                            }`}
                        >
                          {plot.status}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn light btn-action dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <BsThreeDots size={20} />
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li className="dropdown-item">
                              <button
                                className="btn view_btn btn-sm me-1"
                                onClick={() => handleViewPlot(plot.id)}
                                title="View Project Details"
                              >
                                <FaEye /> View
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <button
                                className="btn edit_btn btn-sm me-1"
                                onClick={() => handleEditPlot(plot.id)}
                                title="Edit Project"
                              >
                                <FaEdit /> Edit
                              </button>
                            </li>
                            <li className="dropdown-item">
                              <Button
                                size="sm"
                                variant={
                                  plot.status === "available"
                                    ? "danger"
                                    : "success"
                                }
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleStatusUpdate(plot.id, plot.status)
                                }
                              >
                                {plot.status === "available" ? (
                                  <MdAirplanemodeInactive />
                                ) : (
                                  <MdAirplanemodeActive />
                                )}
                                {plot.status === "available"
                                  ? "Sold"
                                  : "Available"}
                              </Button>
                            </li>

                            <li className="dropdown-item">
                              <button
                                className="btn delete_btn btn-sm"
                                onClick={() => handleDeletePlot(plot.id)}
                                title="Delete Project"
                              >
                                <RiDeleteBin5Fill /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="16" className="text-center">
                      {searchQuery || selectedProject
                        ? "No units found with current filters."
                        : "No units found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-end">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {/* Always show first page */}
              <Pagination.Item
                active={1 === currentPage}
                onClick={() => handlePageChange(1)}
              >
                1
              </Pagination.Item>

              {/* Show ellipsis if there are pages before current page beyond page 2 */}
              {currentPage > 3 && <Pagination.Ellipsis />}

              {/* Show pages around current page */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show page if it's within 1 of current page (except page 1 which is always shown)
                if (
                  pageNumber > 1 &&
                  pageNumber < totalPages &&
                  Math.abs(pageNumber - currentPage) <= 1
                ) {
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                }
                return null;
              })}

              {/* Show ellipsis if there are pages after current page before last page */}
              {currentPage < totalPages - 2 && <Pagination.Ellipsis />}

              {/* Always show last page if there's more than 1 page */}
              {totalPages > 1 && (
                <Pagination.Item
                  active={totalPages === currentPage}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Pagination.Item>
              )}

              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      </div>

      {/* View Plot Modal */}
      <Modal
        show={showViewModal}
        onHide={handleCloseViewModal}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Unit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlot && (
            <div className="table-responsive">
              <table className="table mb-0">
                <tbody>
                  <tr>
                    <th>Project Name</th>
                    <td>{selectedPlot.project_name}</td>
                    <th>Block Name</th>
                    <td>{selectedPlot.block_name}</td>
                  </tr>

                  <tr>
                    <th>Unit No.</th>
                    <td>{selectedPlot.plot_shop_villa_no}</td>
                    <th>Road Size</th>
                    <td>{selectedPlot.road_size}</td>
                  </tr>

                  <tr>
                    <th>Unit Type (Corner/Normal)</th>
                    <td>{selectedPlot.unit_type}</td>
                    <th>Facing</th>
                    <td>{selectedPlot.facing}</td>
                  </tr>

                  <tr>
                    <th>Unit Size</th>
                    <td>{selectedPlot.dimension}</td>
                    <th>Unit Area SQMT</th>
                    <td>{selectedPlot.unit_area_sqmt}</td>
                  </tr>

                  <tr>
                    <th>Unit Area(SQYD)</th>
                    <td>{selectedPlot.area_sqyd}</td>
                    <th>PLC Percentage</th>
                    <td>{selectedPlot.plc_percentage}</td>
                  </tr>

                  <tr>
                    <th>Unit Rate(Per SQYd Rate)</th>
                    <td>{selectedPlot.rate}</td>
                    <th>Unit Price</th>
                    <td>{selectedPlot.unit_price}</td>
                  </tr>

                  <tr>
                    <th>Date</th>
                    <td>
                      {selectedPlot.date &&
                        !isNaN(new Date(selectedPlot.date).getTime())
                        ? new Date(selectedPlot.date).toLocaleDateString(
                          "en-GB",
                        )
                        : "NA"}
                    </td>

                    <th>Status</th>
                    <td>
                      <span
                        className={`badge ${selectedPlot.status === "available"
                            ? "bg-success"
                            : "bg-danger"
                          }`}
                      >
                        {selectedPlot.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Plot Modal */}
      <Modal
        show={showEditModal}
        size="lg"
        onHide={handleCloseEditModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdatePlot}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="editProjectId">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Select
                    name="project_id"
                    value={editFormData.project_id}
                    onChange={handleEditFormChange}
                    disabled={loadingDropdowns || projectsForEdit.length === 0}
                    required
                  >
                    <option value="">Select a Project</option>
                    {projectsForEdit.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Form.Select>
                  {loadingDropdowns && projectsForEdit.length === 0 && (
                    <small className="text-muted">Loading projects...</small>
                  )}
                  {!loadingDropdowns && projectsForEdit.length === 0 && (
                    <small className="text-danger">
                      No projects available.
                    </small>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6">
                {" "}
                <Form.Group className="mb-3" controlId="editBlockId">
                  <Form.Label>Block Name</Form.Label>
                  <Form.Select
                    name="block_id"
                    value={editFormData.block_id}
                    onChange={handleEditFormChange}
                    disabled={
                      !editFormData.project_id ||
                      loadingDropdowns ||
                      blocksForEdit.length === 0
                    }
                    required
                  >
                    <option value="">Select a Block</option>
                    {blocksForEdit.map((block) => (
                      <option key={block.id} value={block.id}>
                        {block.name}
                      </option>
                    ))}
                  </Form.Select>
                  {editFormData.project_id &&
                    loadingDropdowns &&
                    blocksForEdit.length === 0 && (
                      <small className="text-muted">Loading blocks...</small>
                    )}
                  {editFormData.project_id &&
                    !loadingDropdowns &&
                    blocksForEdit.length === 0 && (
                      <small className="text-danger">
                        No blocks available for this project.
                      </small>
                    )}
                </Form.Group>
              </div>
              <div className="col-md-6">
                {" "}
                <Form.Group className="mb-3" controlId="displayProjectName">
                  <Form.Label>Selected Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="project_name"
                    value={editFormData.project_name}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                {" "}
                <Form.Group className="mb-3" controlId="displayBlockName">
                  <Form.Label>Selected Block Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="block_name"
                    value={editFormData.block_name}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                {" "}
                <Form.Group className="mb-3" controlId="editPlotShopVillaNo">
                  <Form.Label>Unit/Shop/Villa No.</Form.Label>
                  <Form.Control
                    type="text"
                    name="plot_shop_villa_no"
                    value={editFormData.plot_shop_villa_no}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                {" "}
                <Form.Group className="mb-3" controlId="editPlotSize">
                  <Form.Label>Dimension</Form.Label>
                  <Form.Control
                    type="text"
                    name="plot_size"
                    value={editFormData.plot_size}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="editPlotSqYd">
                  <Form.Label>Area Sq. yard.</Form.Label>
                  <Form.Control
                    type="number"
                    name="plot_sqyd"
                    value={editFormData.plot_sqyd}
                    onChange={handleEditFormChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                {" "}
                <Form.Group className="mb-3" controlId="editPlotRate">
                  <Form.Label>Rate</Form.Label>
                  <Form.Control
                    type="number"
                    name="plot_rate"
                    value={editFormData.plot_rate}
                    onChange={handleEditFormChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                {" "}
                <Form.Group className="mb-3" controlId="editResgistryPatta">
                  <Form.Label>Document Type</Form.Label>
                  <Form.Select
                    name="resgistry_patta"
                    value={editFormData.resgistry_patta}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">Select Option</option>
                    <option value="registry">Registry</option>
                    <option value="patta">Patta</option>
                    <option value="registrywithpatta">
                      Registry with Patta
                    </option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-6">
                {" "}
                <Form.Group className="mb-3" controlId="editStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-12">
                {" "}
                <Form.Group className="mb-3" controlId="editPlotAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="plot_address"
                    value={editFormData.plot_address}
                    onChange={handleEditFormChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-12">
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Unit"}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Custom Message Modal */}
      {showMessageModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${messageModalContent.type === "success" ? "" : messageModalContent.type === "error" ? "" : ""}`}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5
                  className={`modal-title ${messageModalContent.type === "success" ? "text-white" : messageModalContent.type === "error" ? "text-white" : "text-white"}`}
                >
                  {messageModalContent.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeCustomMessageModal}
                ></button>
              </div>
              <div className="modal-body text-secondary">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {messageModalContent.confirmAction ? (
                  <>
                    <Button
                      variant={
                        messageModalContent.type === "btn-primary-custum"
                          ? "btn-primary-custum"
                          : "primary"
                      }
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
                    </Button>
                    <Button variant="danger" onClick={closeCustomMessageModal}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={
                      messageModalContent.type === "btn-primary-custum"
                        ? "btn-primary-custum"
                        : messageModalContent.type === "error"
                          ? "danger"
                          : "primary"
                    }
                    onClick={closeCustomMessageModal}
                  >
                    OK
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllPlotList;
