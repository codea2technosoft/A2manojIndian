import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Modal, Button, Form, Table, Pagination, Row, Col } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { MdAirplanemodeInactive, MdAirplanemodeActive, MdOutlineUpcoming, MdUpcoming } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
const API_URL = process.env.REACT_APP_API_URL;
function InActivePlotList() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
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


  const showCustomMessageModal = (title, text, type, confirmAction = null) => {
    setMessageModalContent({ title, text, type, confirmAction });
    setShowMessageModal(true);
  };


  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: "", text: "", type: "", confirmAction: null });
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
          showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
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
          showCustomMessageModal("Error", errorData.message || "Failed to fetch projects for dropdown.", "error");
          setLoadingDropdowns(false);
          return;
        }

        const data = await response.json();
        setProjectsForEdit(data.data || []);
      } catch (err) {
        console.error("Fetch projects for edit error:", err);
        showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching projects for edit.", "error");
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
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
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
            showCustomMessageModal("Error", errorData.message || "Failed to fetch blocks for dropdown.", "error");
            setBlocksForEdit([]);
            setLoadingDropdowns(false);
            return;
          }

          const data = await response.json();
          setBlocksForEdit(data.data || []);
        } catch (err) {
          console.error("Fetch blocks for edit error:", err);
          showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching blocks for edit.", "error");
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


  const fetchPlots = async (page = 1, query = "") => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
        return;
      }

      const url = new URL(`${API_URL}/plot-list-inactive`);
      url.searchParams.append("page", page);
      url.searchParams.append("limit", 10);
      if (query) {
        url.searchParams.append("plot_shop_villa_no", query);
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
          showCustomMessageModal("Authorization Error", "Unauthorized: Please log in again.", "error");
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch plots.");
      }

      const data = await response.json();

      setPlots(data.data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Fetch plots error:", err);
      setError(err.message);
      if (!showMessageModal) {
        showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching plots.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlots(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleViewPlot = async (plotId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
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
      console.error("View unit error:", err);
      setError(err.message);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching unit details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlot = async (plotId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
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
        throw new Error(errorData.message || "Failed to fetch unit for editing.");
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
      console.error("Edit unit error:", err);
      setError(err.message);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred while fetching unit for editing.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (name === "project_id") {
        const selectedProjectObj = projectsForEdit.find(proj => proj.id.toString() === value);
        newData.project_name = selectedProjectObj ? selectedProjectObj.name : "";
        newData.block_id = "";
        newData.block_name = "";
        setBlocksForEdit([]);
      } else if (name === "block_id") {
        const selectedBlockObj = blocksForEdit.find(block => block.id.toString() === value);
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
        showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
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
        throw new Error(errorData.message || "Failed to update unit.");
      }
      const result = await response.json();
      if (result.success == '1') {
        showCustomMessageModal("Success", "unit updated successfully!", "success");
        setShowEditModal(false);
        fetchPlots(currentPage, searchQuery);
      }

    } catch (err) {
      console.error("Update unit error:", err);
      setError(err.message);
      showCustomMessageModal("Error", err.message || "An unexpected error occurred while updating unit.", "error");
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
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
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
            throw new Error(errorData.message || "Failed to update unit status.");
          }

          const result = await response.json();

          if (result.success == "1") {
            showCustomMessageModal("Success", "Unit status updated successfully!", "success");
            fetchPlots(currentPage, searchQuery);
          }

        } catch (err) {
          console.error("Status update error:", err);
          setError(err.message);
          showCustomMessageModal("Error", err.message || "An unexpected error occurred while updating unit status.", "error");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleDeletePlot = async (plotId) => {
    showCustomMessageModal(
      "Confirm Deletion",
      "Are you sure you want to delete this unit? This action cannot be undone.",
      "warning",
      async () => {
        setLoading(true);
        try {
          const token = getAuthToken();
          if (!token) {
            showCustomMessageModal("Authentication Error", "Authentication token not found. Please log in.", "error");
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
            throw new Error(errorData.message || "Failed to delete unit.");
          }

          showCustomMessageModal("Success", "Unit deleted successfully!", "success");
          fetchPlots(currentPage, searchQuery);
        } catch (err) {
          console.error("Delete unit error:", err);
          setError(err.message);
          showCustomMessageModal("Error", err.message || "An unexpected error occurred while deleting unit.", "error");
        } finally {
          setLoading(false);
        }
      }
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
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
    <div className="userlist">
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="titlepage">
              <h3>Available Unit List</h3>
            </div>
            <div className="d-flex gap-2">
              <Form.Group controlId="searchPlot">
                <input
                  type="text"
                  placeholder="Search by unit/shop/villa no."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </Form.Group>
              <div className="createnewadmin">
                <Link to="/create-plot" className="btn btn-success d-flex align-items-center">
                  <FaPlus className="me-2" /> Add New Unit
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <Table bordered >
              <thead className="bg-primary text-white">
                <tr>
                  <th>ID</th>
                  <th>Project Name</th>
                  <th>Block Name</th>
                  <th>Unit/Shop/Villa No.</th>
                  <th>Dimensions</th>
                  <th>Rate</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plots?.length > 0 ? (
                 plots.map((plot, index) => (
                    <tr key={plot.id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                      <td>{plot.project_name}</td>
                      <td>{plot.block_name}</td>
                      <td>{plot.plot_shop_villa_no}</td>
                      <td>{plot.dimension}</td>
                      <td>{plot.rate}</td>
                      <td>
                         <div className="table-cell-remark">
                        {plot.address}
                         </div>
                        
                        </td>
                      <td>{plot.date}</td>
                      <td>
                        <span
                          className={`badge ${plot.status === "available" ? "bg-success" : "bg-danger"
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
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
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
                                variant={plot.status === "available" ? "danger" : "success"}
                                className="btn btn-danger btn-sm"
                                onClick={() => handleStatusUpdate(plot.id, plot.status)}
                              >

                                {plot.status === "available" ? <MdAirplanemodeInactive /> : <MdAirplanemodeActive />}
                                {plot.status === "available" ? "Sold" : "Available"}
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
                    <td colSpan="9" className="text-center">
                      No Units found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-end">
            <Pagination>
              {/* <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} /> */}
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
             
            </Pagination>
          </div>
        </div>
      </div>




      {/* View Plot Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Unit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlot && (
            <div>

              <table className="table">
                <tbody>
                  <tr>
                    <th>Project Name</th>
                    <td>{selectedPlot.project_name}</td>
                  </tr>
                  <tr>
                    <th>Block Name</th>
                    <td>{selectedPlot.block_name}</td>
                  </tr>
                  
                  <tr>
                    <th>Unit/Shop/Villa No.</th>
                    <td>{selectedPlot.plot_shop_villa_no}</td>
                  </tr>
                  <tr>
                    <th>Dimensions</th>
                    <td>{selectedPlot.dimension}</td>
                  </tr>
                  <tr>
                    <th>Area Sq. Yd.</th>
                    <td>{selectedPlot.area_sqyd}</td>
                  </tr>
                  <tr>
                    <th>Rate</th>
                    <td>{selectedPlot.rate}</td>
                  </tr>
                  <tr>
                    <th>Addesss</th>
                    <td>
                        <div className="table-cell-remark">

                      {selectedPlot.address}
                        </div>
                      </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <span
                        className={`badge ${selectedPlot.status === "availables" ? "bg-success" : "bg-danger"
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
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Plot Modal */}
      <Modal show={showEditModal} size="lg" onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdatePlot}>
            <div className="row">
              <div className="col-md-6"> <Form.Group className="mb-3" controlId="editProjectId">
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
                <small className="text-danger">No projects available.</small>
              )}
            </Form.Group></div>
              <div className="col-md-6">  <Form.Group className="mb-3" controlId="editBlockId">
              <Form.Label>Block Name</Form.Label>
              <Form.Select
                name="block_id"
                value={editFormData.block_id}
                onChange={handleEditFormChange}
                disabled={!editFormData.project_id || loadingDropdowns || blocksForEdit.length === 0}
                required
              >
                <option value="">Select a Block</option>
                {blocksForEdit.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
              </Form.Select>
              {editFormData.project_id && loadingDropdowns && blocksForEdit.length === 0 && (
                <small className="text-muted">Loading blocks...</small>
              )}
              {editFormData.project_id && !loadingDropdowns && blocksForEdit.length === 0 && (
                <small className="text-danger">No blocks available for this project.</small>
              )}
            </Form.Group></div>
              <div className="col-md-6"> <Form.Group className="mb-3" controlId="displayProjectName">
              <Form.Label>Selected Project Name</Form.Label>
              <Form.Control
                type="text"
                name="project_name"
                value={editFormData.project_name}
                readOnly
                disabled
              />
            </Form.Group></div>
              <div className="col-md-6">
           
            <Form.Group className="mb-3" controlId="displayBlockName">
              <Form.Label>Selected Block Name</Form.Label>
              <Form.Control
                type="text"
                name="block_name"
                value={editFormData.block_name}
                readOnly
                disabled
              />
            </Form.Group></div>
              <div className="col-md-6">  <Form.Group className="mb-3" controlId="editPlotShopVillaNo">
              <Form.Label>Unit/Shop/Villa No.</Form.Label>
              <Form.Control
                type="text"
                name="plot_shop_villa_no"
                value={editFormData.plot_shop_villa_no}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group></div>
              <div className="col-md-6"> 
            <Form.Group className="mb-3" controlId="editPlotSize">
              <Form.Label>Dimension</Form.Label>
              <Form.Control
                type="text"
                name="plot_size"
                value={editFormData.plot_size}
                onChange={handleEditFormChange}
                required
              
              />
            </Form.Group></div>
              <div className="col-md-6"> <Form.Group className="mb-3" controlId="editPlotSqYd">
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
            </Form.Group></div>
              <div className="col-md-6">  <Form.Group className="mb-3" controlId="editPlotRate">
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
            </Form.Group></div>
              <div className="col-md-6">  <Form.Group className="mb-3" controlId="editResgistryPatta">
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
                <option value="registrywithpatta">Registry with Patta</option>
              </Form.Select>
            </Form.Group></div>
              <div className="col-md-6">
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
            </Form.Group></div>
              <div className="col-md-6">   <Form.Group className="mb-3" controlId="editStatus">
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
            </Form.Group></div>
              <div className="col-md-12">
                <div className="d-flex justify-content-end">
<Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "Updating..." : "Update Unit"}
            </Button>
                </div>
              </div>
            </div>
           

          



         
           
          
          
        
         
            
          </Form>
        </Modal.Body>
      </Modal>


      {showMessageModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${messageModalContent.type === 'success' ? '' : messageModalContent.type === 'error' ? '' : ''}`}>
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className={`modal-title ${messageModalContent.type === 'success' ? 'text-white' : messageModalContent.type === 'error' ? 'text-white' : 'text-white'}`}>
                  {messageModalContent.title}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeCustomMessageModal}></button>
              </div>
              <div className="modal-body text-secondary">
                <p>{messageModalContent.text}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {messageModalContent.confirmAction ? (
                  <>
                   
                    <Button
                      variant={messageModalContent.type === 'btn-primary-custum' ? 'btn-primary-custum' : 'primary'}
                      onClick={() => {
                        messageModalContent.confirmAction();
                        closeCustomMessageModal();
                      }}
                    >
                      Confirm
                    </Button>
                     <Button
                      variant="danger"
                      onClick={closeCustomMessageModal}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={messageModalContent.type === 'success' ? 'success' : messageModalContent.type === 'error' ? 'danger' : 'primary'}
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

export default InActivePlotList;
