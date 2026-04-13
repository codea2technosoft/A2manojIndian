import React, { useEffect, useState } from "react";
import { Table, Pagination } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

function NotificationsLists() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ type: "" });
  const [type, setType] = useState("");

  const token = localStorage.getItem("token");
  const pageLimit = 10;

  const getPaginationGroup = () => {
    let pages = [];
    const totalPagesToShow = 7;
    const sidePages = 2;
    
    if (totalPages <= totalPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);

    pages.push(1);

    if (startPage > 2) {
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: pageLimit,
        type,
      }).toString();

      const response = await fetch(`${API_URL}/notification-data?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      
      console.log("API Response:", result); // Debugging के लिए
      
      // Different possible response structures handle करें
      setLeads(result.data || result.notifications || result.leads || []);
      
      // Total pages calculate करें
      const total = result.total || result.totalRecords || result.count || 0;
      setTotalRecords(total);
      const calculatedTotalPages = Math.ceil(total / pageLimit);
      setTotalPages(calculatedTotalPages || 1);
      
      // Current page set करें
      setCurrentPage(page);

    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    fetchLeads(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLeads(1);
  };

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  function formatWord(word) {
    if (!word) return "";
    const spaced = word.replace(/([a-z])([A-Z])/g, "$1 $2");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
  }

  useEffect(() => {
    fetchLeads(1);
  }, []);

  function formatLabel(label) {
    if (!label) return "-";
    return label
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Calculate starting serial number for current page
  const getStartingSerialNumber = () => {
    return (currentPage - 1) * pageLimit + 1;
  };

  // Calculate ending serial number for current page
  const getEndingSerialNumber = () => {
    return Math.min(currentPage * pageLimit, totalRecords);
  };

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
              <h3>Notifications List</h3>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <p>Loading notifications...</p>
            ) : leads.length === 0 ? (
              <div className="table-responsive">
                 <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Lead ID</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Action By</th>
                      <th>Date Time</th>
                      <th>Message</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                         <td colSpan={8} className="text-center">No Data Found </td>
                      </tr>
                  </tbody>
                </Table>
               </div>
            ) : (
              <>
               <div className="table-responsive">
                 <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Lead ID</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Action By</th>
                      <th>Date Time</th>
                      <th>Message</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={lead.id || lead._id || index}>
                        <td>{getStartingSerialNumber() + index}</td>
                        <td>{lead.order_id || lead.leadId || "-"}</td>
                        <td>{formatLabel(lead.type) || "-"}</td>
                        <td>{formatWord(lead.statusremark || lead.status) || "-"}</td>
                        <td>{toSentenceCase(lead.action_by || lead.actionBy) || "-"}</td>
                        <td>
                          {(() => {
                            if (!lead.date_time && !lead.dateTime) return "-";
                            try {
                              const dateString = lead.date_time || lead.dateTime || lead.createdAt;
                              const date = new Date(dateString.replace(" ", "T"));
                              
                              if (isNaN(date.getTime())) return "-";
                              
                              const formattedDate =
                                date
                                  .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                  .replace(/\//g, "-") +
                                " " +
                                date.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                });
                              return formattedDate;
                            } catch (error) {
                              return "-";
                            }
                          })()}
                        </td>
                        <td>
                          <div className="table-cell-remark" style={{maxWidth:"350px"}}>
                            {lead.message || "-"}
                          </div>
                        </td>
                        <td>
                          <div className="table-cell-remark">
                            {formatWord(lead.remark) || "-"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
               </div>

                {/* Pagination Section */}
                <div className="d-flex justify-content-between align-items-center">
                  <div className="pagination-info">
                    Showing {getStartingSerialNumber()} to {getEndingSerialNumber()} of {totalRecords} entries
                  </div>
                  
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {getPaginationGroup().map((item, index) => (
                      <Pagination.Item
                        key={index}
                        active={item === currentPage}
                        onClick={() => typeof item === 'number' ? handlePageChange(item) : null}
                        disabled={item === '...'}
                        style={{ cursor: item === '...' ? 'default' : 'pointer' }}
                      >
                        {item}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsLists;