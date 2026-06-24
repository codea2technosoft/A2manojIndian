import React, { useEffect, useState } from "react";
import { Table, Pagination } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL;

function NotificationsLists() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState({ orderid: "" });

  const token = localStorage.getItem("token");
  const pageLimit = 10;

  const getPaginationGroup = () => {
    const start = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
    const end = Math.min(start + pageLimit - 1, totalPages);
    let pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
      }).toString();

      const response = await fetch(`${API_URL}/notification-data?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setLeads(result.data || []);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(result.page || 1);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    fetchLeads(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads(1);
  };

  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  React.useEffect(() => {
    fetchLeads(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <div className="titlepage">
                <h3>Notifications List</h3>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <div className="form_design">

              <input
                type="text"
                name="orderid"
                placeholder="Type "
                value={searchTerm.orderid}
                onChange={(e) =>
                  setSearchTerm({ ...searchTerm, [e.target.name]: e.target.value })
                }
              />
              </div>
              <button className="submit_button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <p>Loading notifications...</p>
            ) : leads.length === 0 ? (
              <p>No notification found.</p>
            ) : (
              <>
               <div className="table-responsive">
                 <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Mobile</th>
                      <th>Category</th>
                      <th>Services</th>
                    
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={lead.id}>
                        <td>{(currentPage - 1) * pageLimit + index + 1}</td>
                        <td>{lead.order_id || "-"}</td>
                        <td>{toSentenceCase(lead.customer_name)}</td>
                        <td>{lead.mobile || "-"}</td>
                        <td>{toSentenceCase(lead.category)}</td>
                        <td>{toSentenceCase(lead.service)}</td>
                       
                      </tr>
                    ))}
                  </tbody>
                </Table>
               </div>

                <div className="d-flex justify-content-end">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {getPaginationGroup().map((item) => (
                      <Pagination.Item
                        key={item}
                        active={item === currentPage}
                        onClick={() => handlePageChange(item)}
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
