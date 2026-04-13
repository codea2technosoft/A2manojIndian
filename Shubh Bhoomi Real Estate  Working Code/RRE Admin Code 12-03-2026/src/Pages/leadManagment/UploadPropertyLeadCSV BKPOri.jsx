import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import callingleads from "../../assets/images/Lead Formate.csv";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { BsThreeDots } from "react-icons/bs";
import { MdSecurityUpdateGood } from "react-icons/md";
import { SiConvertio } from "react-icons/si";
import { MdOutlineHistoryToggleOff } from "react-icons/md";
import { FaFileCsv } from "react-icons/fa6";
import { BsFiletypeXlsx } from "react-icons/bs";
import { useLocation } from "react-router-dom";

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function UploadPropertyLeadCSV() {
   const location = useLocation();
   const [status, setStatus] = useState("");
  const navigate = useNavigate(); 
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const [showEditModal, setShowEditModal] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    mobile: "",
    requirement: "",
    status: "",
    from_date: "",
    to_date: "",
  });
    useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status"); 
    if (statusParam) {
      
      console.warn("statusParam",statusParam);
      setIsFilterActive(true);
      
       setFilters((prev) => ({
        ...prev,
        status: statusParam,
      }));
     fetchLeads(
      { ...filters, status: statusParam }, 
      page
    );
    }else{
 console.warn("wanning data",filters);
    fetchLeads(filters, page);
    }
   
  }, [location.search]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef(null);

  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const [editData, setEditData] = useState({
    id: "",
    status: "",
    remark: "",
    next_follow_up_date: "",
    followup_time: "",
  });


  const handleFetch = () => {
    fetchLeads(filters, 1);
  };

  const toSentenceCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };


  const fetchLeads = async (searchParams = {}, currentPage = 1) => {
    setListLoading(true);
    try {
      const params = new URLSearchParams({
        ...searchParams,
        page: currentPage,
      }).toString();

      const res = await fetch(`${API_URL}/lead-csv-list?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data?.status === "1") {
        setLeads(data.data || []);
        setPage(currentPage);
        setTotalPages(data.totalPages || 1);
      } else {
        Swal.fire("Error", data?.message || "Failed to fetch leads", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Network error while fetching leads", "error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
  }, []);

  const handleSearch = () => {
    fetchLeads(filters, 1);
    const payload = {
      from_date: filters.from_date ? new Date(filters.from_date).toISOString() : null,
      to_date: filters.to_date ? new Date(filters.to_date).toISOString() : null,
    };
  };

  const handlePageChange = (newPage) => {
    fetchLeads(filters, newPage);
  };
  const handleUploadSubmit = async () => {
    if (!file) {
      Swal.fire("Warning", "Please select a CSV file!", "warning");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("leadCsv", file);

      const res = await fetch(`${API_URL}/lead-create-csv`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data?.success === "1") {
        Swal.fire("Success", data?.message || "CSV uploaded successfully!", "success");
        setShowModal(false);
        setFile(null);
        fetchLeads(filters, page);
      } else {
        Swal.fire("Error", data?.message || "Failed to upload CSV", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Network error while uploading CSV", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditLead = async (leadId) => {
    try {
      const res = await fetch(`${API_URL}/lead-csv-edit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: leadId }) 
      });

      const data = await res.json();

      if (res.ok && data?.status === "1" && data?.data?.length > 0) {
        const lead = data.data[0];

        setEditData({
          id: lead.id,
          name: lead.name || "",
          mobile: lead.mobile || "",
          alt_mobile: lead.alt_mobile || "",
          city: lead.city || "",
          job_title: lead.job_title || "",
          budget: lead.budget || "",
          requirement: lead.requirement || "",
          status: lead.status || "",
          remark: lead.remark || "",
          followup_time: lead.followup_time || "",
          next_follow_up_date: lead.next_follow_up_date || "",
          assign_by_subadmin: lead.assign_by_subadmin || "",
          assign_by_subadmin_email: lead.assign_by_subadmin_email || ""
        });

        setShowEditModal(true);
      } else {
        Swal.fire("Error", data?.message || "Failed to fetch lead details", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Network error while fetching lead details", "error");
    }
  };

  const handleUpdateLead = async () => {
    try {
      const res = await fetch(`${API_URL}/lead-csv-update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();

      if (res.ok && data?.success === "1") {
        Swal.fire("Success", data?.message || "Lead updated successfully!", "success");
        setShowEditModal(false);
        fetchLeads(filters, page);
      } else {
        Swal.fire("Error", data?.message || "Failed to update lead", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Network error while updating lead", "error");
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/lead-csv-list-export`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json(); // JSON data
      const ws = XLSX.utils.json_to_sheet(json.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Leads");
      XLSX.writeFile(wb, "leads.xlsx");
    } catch (err) {
      console.error(err);
      alert("Excel download failed");
    }
  };



  return (
    <div className="card mt-2">
      <div className="card-header flex-mobile-wrap flex-direction-colunm-mobile d-flex justify-content-between align-items-center">
        <div className="titlepage ">
          <h3 className="m-0">Social Media Leads </h3>
        </div>
        <div className="d-flex gap-2">
          <Button onClick={() => setShowModal(true)}> 
              <FaFileCsv className="fs-5 d-flex gap-1" />  Upload CSV</Button>
          <Button variant="success" className="d-flex gap-1 align-items-center fw-bold" onClick={handleDownloadExcel}>
            <BsFiletypeXlsx className="fs-5 " />
            Download Excel
          </Button>

          <button
            className={`filter-toggle-btn btn ${isFilterActive ? "active" : ""}`}
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
      {/* Search Filters */}
      <div className="card-body">
        {isFilterActive && (
          <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
            <input
              type="text"
              placeholder="Name"
              value={filters.name}
              onChange={(e) =>
                setFilters({ ...filters, name: e.target.value })
              }
            />
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
            />
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mobile"
              value={filters.mobile}
              onChange={(e) =>
                setFilters({ ...filters, mobile: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Requirement"
              value={filters.requirement}
              onChange={(e) =>
                setFilters({ ...filters, requirement: e.target.value })
              }
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="Already Purchased">Already Purchased</option>
              <option value="Call not Pickup">Call not Pickup</option>
              <option value="Customer Self Call Back When He Will Come">Customer Self Call Back When He Will Come</option>
              <option value="In Follow Up">In Follow Up</option>
              <option value="Details sent visit not done">Details sent visit not done</option>
              <option value="In Follow Up Booking Done">In Follow Up Booking Done</option>
              <option value="In Follow Up Booking Done Payment Pending">In Follow Up Booking Done Payment Pending</option>
              <option value="In Follow Up Hot">In Follow Up Hot</option>
              <option value="In Follow Up Site Visit Done Booking Pending">In Follow Up Site Visit Done Booking Pending</option>
              <option value="Invalid Mobile Number">Invalid Mobile Number</option>
              <option value="Looking in Commercial Use">Looking in Commercial Use</option>
              <option value="Looking in Different Location">Looking in Different Location</option>
              <option value="Looking in Low Budget">Looking in Low Budget</option>
              <option value="M Profile">M Profile</option>
              <option value="Not Interested">Not Interested</option>
              <option value="Not Responding">Not Responding</option>
              <option value="New">New</option>
            </select>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        )}
        {listLoading ? (
          <p>Loading leads...</p>
        ) : leads.length === 0 ? (
          <p>No leads found.</p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Alt Mobile</th>
                  <th>City</th>
                  <th>Lead Date</th>
                  <th>Budget</th>
                  <th>Assign By</th>
                  <th>Assign To</th>
                  <th>Job Title</th>
                  <th>PlatForm</th>
                  <th>Requirement</th>
                  <th>Remark</th>
                  <th>Status</th>
                  <th>Next Follow Up Date</th>
                  <th>Next Follow Up Timing</th>
                  <th>Action</th>
                 
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, idx) => (
                  <tr key={lead.id || idx}>
                    <td>{((page - 1) * 100) + idx + 1}</td>
                    <td>{toSentenceCase(lead.name)}</td>
                    <td>{lead.mobile}</td>
                    <td>{lead.alt_mobile}</td>
                    <td>{toSentenceCase(lead.city)}</td>
                    <td>
                      {(() => {
                        const date = new Date(lead.lead_date);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const year = date.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()}
                    </td>
                    <td>{toSentenceCase(lead.budget)}</td>
                    <td>
                      <div className="table-cell-remark">
                        {lead.assign_by_subadmin_email ? lead.assign_by_subadmin_email : "NA"}
                      </div>
                    </td>

                    <td>
                      <div className="table-cell-remark">
                        {lead.assign_to_subadmin_email ? lead.assign_to_subadmin_email : "NA"}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-remark">
                        {toSentenceCase(lead.job_title)}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-remark">
                        {toSentenceCase(lead.plat_form)}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-remark">
                        {toSentenceCase(lead.requirement)}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-remark">
                        {toSentenceCase(lead.remark)}
                      </div>
                    </td>
                    <td>
                      <strong
                        style={{
                          color: lead.status === "New" ? "green" : "red",
                          fontWeight: "bold"
                        }}
                      >
                        {toSentenceCase(lead.status)}
                      </strong>
                    </td>

                    <td>
                      {(() => {
                        const date = new Date(lead.next_follow_up_date);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const year = date.getFullYear();
                        const formattedDate = `${day}-${month}-${year}`;
                        const today = new Date();
                        const todayDay = today.getDate();
                        const todayMonth = today.getMonth();
                        const todayYear = today.getFullYear();
                        let color = "black";
                        if (date.getFullYear() === todayYear && date.getMonth() === todayMonth && date.getDate() === todayDay) {
                          color = "green";
                        } else if (date < today) {
                          color = "red";
                        }
                        return <span style={{ color }}>{formattedDate}</span>;
                      })()}
                    </td>
                    <td>
                      {lead.followup_time
                        ? (() => {
                          const followUpDate = new Date(lead.next_follow_up_date);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          followUpDate.setHours(0, 0, 0, 0);

                          let color = "black";
                          if (followUpDate.getTime() === today.getTime()) {
                            color = "green";
                          } else if (followUpDate < today) {
                            color = "red";
                          }

                          const [hourStr, min] = lead.followup_time.split(":");
                          let hour = parseInt(hourStr);
                          const ampm = hour >= 12 ? "PM" : "AM";
                          hour = hour % 12;
                          if (hour === 0) hour = 12;
                          const time12 = `${String(hour).padStart(2, "0")}:${min} ${ampm}`;

                          return <span style={{ color }}>{time12}</span>;
                        })()
                        : "-"}
                    </td>
                    <td className="d-flex gap-2">
                      <div className="dropdown">
                        <button
                          className="btn light btn-action dropdown-toggle"
                          type="button"
                          id={`dropdownMenuButton-${lead.id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <BsThreeDots size={20} />
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${lead.id}`}>
                          <li className="dropdown-item">
                            <button
                              className="btn view_btn btn-sm me-1"
                              onClick={() => handleEditLead(lead.id)}
                              title="Update"
                            >
                              <MdSecurityUpdateGood className="me-2" /> Update
                            </button>
                          </li>
                          <li className="dropdown-item">
                            <button
                              className="btn edit_btn btn-sm me-1"
                              onClick={() => navigate(`/convert-calling-lead/${lead.id}`)}
                              title="Convert"
                            >
                              <SiConvertio className="me-2" /> Convert
                            </button>
                          </li>
                          <li className="dropdown-item">
                            <button
                              className="btn btn-danger btn-sm"
                              title="Calling Remark History"
                              onClick={() => navigate(`/calling-remark-history/${lead.id}`)}
                            >
                              <MdOutlineHistoryToggleOff className="me-2" /> Calling Remark History
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </Table>
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-2 gap-2">
              <Button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Prev
              </Button>
              <span className="align-self-center">
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
      {/* CSV Upload Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Property Social Media Leads CSV</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <input
            type="file"
            accept=".csv"
            ref={inputRef}
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />
          <Button onClick={() => inputRef.current && inputRef.current.click()}>
            {file ? "Change CSV" : "Select CSV"}
          </Button>
          <p className="mt-2">{file ? file.name : "No file selected"}</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <div className="downloadtemplate">
              <a href={callingleads} download="Lead Formate.csv">
                <Button variant="success">
                  Download Excel Template
                </Button>
              </a>
            </div>

            <div className="d-flex gap-2">
              <Button
                variant="success"
                disabled={loading}
                onClick={handleUploadSubmit}
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
              <Button variant="danger" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* ✅ Edit Lead Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Calling Leads</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editData.status || ""}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="text-dark"
              >
                <option value="">All Status</option>
                <option value="Already Purchased">Already Purchased</option>
                <option value="Call not Pickup">Call not Pickup</option>
                <option value="Customer Self Call Back When He Will Come">Customer Self Call Back When He Will Come</option>
                <option value="In Follow Up">In Follow Up</option>
                <option value="Details sent visit not done">Details sent visit not done</option>
                <option value="In Follow Up Booking Done">In Follow Up Booking Done</option>
                <option value="In Follow Up Booking Done Payment Pending">In Follow Up Booking Done Payment Pending</option>
                <option value="In Follow Up Hot">In Follow Up Hot</option>
                <option value="In Follow Up Site Visit Done Booking Pending">In Follow Up Site Visit Done Booking Pending</option>
                <option value="Invalid Mobile Number">Invalid Mobile Number</option>
                <option value="Looking in Commercial Use">Looking in Commercial Use</option>
                <option value="Looking in Different Location">Looking in Different Location</option>
                <option value="Looking in Low Budget">Looking in Low Budget</option>
                <option value="M Profile">M Profile</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Not Responding">Not Responding</option>
                <option value="New">New</option>

              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Remark</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editData.remark}
                onChange={(e) => setEditData({ ...editData, remark: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Next Follow Up Date</Form.Label>
              <Form.Control
                type="date"
                value={editData.next_follow_up_date}
                onChange={(e) =>
                  setEditData({ ...editData, next_follow_up_date: e.target.value })
                }
              />
            </Form.Group>
          </Form>

          <Form.Group className="mb-2">
            <Form.Label>Next Follow Up Time</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="time"
                value={editData.followup_time || ""} 
                onChange={(e) =>
                  setEditData({ ...editData, followup_time: e.target.value || null })
                }
                placeholder="NA" 
              />
              <button
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={() =>
                  setEditData({ ...editData, followup_time: null })
                }
              >
                NA
              </button>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdateLead}>
            Update
          </Button>
          <Button variant="danger" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default UploadPropertyLeadCSV;
