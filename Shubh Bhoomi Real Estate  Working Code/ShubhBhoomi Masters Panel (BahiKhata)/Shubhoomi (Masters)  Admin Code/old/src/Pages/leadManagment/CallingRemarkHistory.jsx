import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { BsThreeDots } from "react-icons/bs";
import { MdSecurityUpdateGood } from "react-icons/md";
import { SiConvertio } from "react-icons/si";
import { MdOutlineHistoryToggleOff } from "react-icons/md";
import { FaFileCsv } from "react-icons/fa6";
import { BsFiletypeXlsx } from "react-icons/bs";
import { useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function CallingRemarkHistory() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ moved inside component
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);


  const [filters, setFilters] = useState({
    remark: "",
    status: "",
    from_date: "",
    to_date: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const inputRef = useRef(null);

  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  // ✅ Edit Lead state
  const [editData, setEditData] = useState({
    id: "",
    status: "",
    remark: "",
    next_follow_up_date: "",
  });


  const handleFetch = () => {
    fetchLeads(filters, 1); // page 1 se start
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

      const res = await fetch(`${API_URL}/lead-csv-history-log?id=${id}&${params}`, {
        method: "GET", // explicitly GET method
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
    fetchLeads(filters, page);
  }, []);

  const handleSearch = () => {
    fetchLeads(filters, 1); // reset to page 1 on search
  };

  const handlePageChange = (newPage) => {
    fetchLeads(filters, newPage);
  };




  return (
    <div className="card mt-2">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="titlepage ">
          <h3 className="m-0">Calling Remark History</h3>
        </div>
        <div className="d-flex gap-2">
          <div className="d-flex gap-2">
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
          <div className="">
            <button onClick={() => navigate(-1)} className="btn btn-primary">
              ⬅ Back
            </button>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <div className="card-body">
        {isFilterActive && (
          <div className="d-flex gap-2 mb-3 mt-2 flex-wrap-mobile">
            {/* <input
              type="text"
              placeholder="Remark"
              value={filters.remark}
              onChange={(e) =>
                setFilters({ ...filters, remark: e.target.value })
              }
            /> */}
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

            {/* <input
              type="text"
              placeholder="Status"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            />
             */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="Already Purchased">Already Purchased</option>
              <option value="Call not Pickup">Call not Pickup</option>
              <option value="Customer Self Call Back When He Will Come">Customer Self Call Back When He Will Come</option>
              <option value="Details sent visit not done">Details sent visit not done</option>
              <option value="In Follow Up">In Follow Up</option>
              <option value="In Follow Up Booking Done">In Follow Up Booking Done</option>
              <option value="In Follow Up Booking Done Payment Pending">In Follow Up Booking Done Payment Pending</option>
              <option value="In Follow Up Hot">In Follow Up Hot</option>
              <option value="In Follow Up Site Visit Done Booking Pending">In Follow Up Site Visit Done Booking Pending</option>
              <option value="Invalid Mobile Number">Invalid Mobile Number</option>
              <option value="Low Budget">Low Budget</option>
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

        {/* Leads Table */}
        {listLoading ? (
          <p>Loading Calling Remark Leads...</p>
        ) : leads.length === 0 ? (
          <p>No Calling Leads found.</p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Remark</th>
                  <th>Status</th>
                  <th>Next Follow Up Date</th>
                  <th>Updated BY</th>
                  <th>Date & Timing</th>

                </tr>
              </thead>
              <tbody>
                {leads.map((lead, idx) => (
                  <tr key={lead.id || idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="table-cell-remark">
                        {toSentenceCase(lead.remark)}
                      </div>
                    </td>
                    <td>{toSentenceCase(lead.status)}</td>


                    <td>
                      {(() => {
                        const date = new Date(lead.next_follow_up_date);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
                        const year = date.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()}

                    </td>

                    <td>
                      <div className="table-cell-remark">
                        {toSentenceCase(lead.admin_email)}</div></td>

                    <td>
                      {(() => {
                        const date = new Date(lead.created_at);

                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const year = date.getFullYear();

                        let hours = date.getHours();
                        const minutes = String(date.getMinutes()).padStart(2, "0");
                        const ampm = hours >= 12 ? "PM" : "AM";
                        hours = hours % 12 || 12; // convert to 12-hour format
                        const formattedHours = String(hours).padStart(2, "0");

                        return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
                      })()}
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

    </div>
  );
}

export default CallingRemarkHistory;
