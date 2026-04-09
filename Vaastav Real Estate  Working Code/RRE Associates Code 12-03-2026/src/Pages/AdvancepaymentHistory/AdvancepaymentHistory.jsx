import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Pagination } from "react-bootstrap";
import { MdFilterListAlt, MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function AdvancepaymentHistory() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState({ amount: "", type: "" });
  const [showFilter, setShowFilter] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1199);
  const token = localStorage.getItem("token");

  const pageLimit = 10;

  // Toggle filter panel
  const toggleFilter = () => setShowFilter((prev) => !prev);

  // Alert for errors
  const showCustomMessageModal = (title, text) => {
    alert(`${title}: ${text}`);
  };

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1199) {
        setIsDesktop(true);
        setShowFilter(true);
      } else {
        setIsDesktop(false);
        setShowFilter(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch visits data
  const fetchVisits = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        amount: searchTerm.amount,
        type: searchTerm.type,
      }).toString();

      const response = await fetch(`${API_URL}/associate-advance-payment-list?${query}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (result.success === "1") {
        setVisits(result.data || []);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.page || 1);
      } else {
        showCustomMessageModal("Error", result.message || "Failed to fetch records.");
      }
    } catch (error) {
      showCustomMessageModal("Error", "Failed to fetch visits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVisits(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      fetchVisits(pageNumber);
    }
  };

  // Pagination logic - Only this part is added
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

  // Helper to format text
  const toSentenceCase = (text) => {
    if (!text) return "-";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatAmount = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toFixed(2);
  };


  return (
    <div className="padding_15">
      <div className="userlist">
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center gap-2">
            <h3>Advance Payments</h3>

            {/* Toggle Filter Button for Mobile */}
            {!isDesktop && (
              <button type="button" className="toggle-filter-btn" onClick={toggleFilter}>
                {showFilter ? <MdFilterAltOff /> : <MdFilterListAlt />}
              </button>
            )}

            {/* Search Form for Desktop */}
            {isDesktop && (
              <form onSubmit={handleSearch} className="d-flex gap-2 align-items-center form_design " >
                <input
                  type="text"
                  name="amount"
                  placeholder="Search By Amount"
                  value={searchTerm.amount}
                  onChange={(e) => setSearchTerm({ ...searchTerm, [e.target.name]: e.target.value })}
                />
                <input
                  type="text"
                  name="type"
                  placeholder="Search By Type"
                  value={searchTerm.type}
                  onChange={(e) => setSearchTerm({ ...searchTerm, [e.target.name]: e.target.value })}
                />
                <button type="submit" className="submit_button">Search</button>
              </form>
            )}
          </div>

          <div className="card-body">
            {/* Filter Panel for Mobile */}
            {showFilter && !isDesktop && (
              <form onSubmit={handleSearch} className="d-flex gap-2 align-items-center mb-3">
                <input
                  type="text"
                  name="amount"
                  placeholder="Search By Amount"
                  value={searchTerm.amount}
                  onChange={(e) => setSearchTerm({ ...searchTerm, [e.target.name]: e.target.value })}
                />
                <input
                  type="text"
                  name="type"
                  placeholder="Search By Type"
                  value={searchTerm.type}
                  onChange={(e) => setSearchTerm({ ...searchTerm, [e.target.name]: e.target.value })}
                />
                <button type="submit" className="submit_button">Search</button>
              </form>
            )}

            {loading ? (
              <p>Loading records...</p>
            ) : visits.length === 0 ? (
              <p>No records found.</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Name</th>
                      <th>Mobile</th>

                      <th>Amount</th>
                      <th>Type</th>
                      <th>Created Date</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((visit, index) => (
                      <tr key={visit.id}>
                        <td>{(currentPage - 1) * pageLimit + index + 1}</td>
                        <td>{toSentenceCase(visit.category_name)}</td>
                        <td>{toSentenceCase(visit.name)}</td>
                        <td>{visit.associate_mobile || "-"}</td>
                        <td>₹ {formatAmount(visit.amount) || "0.00"}</td>
                        <td>{toSentenceCase(visit.type)}</td>
                        <td>{formatDate(visit.date)}</td>
                        <td class="table-cell-remark">{toSentenceCase(visit.description)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Updated Pagination */}
                <div className="d-flex justify-content-end mt-3">
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

export default AdvancepaymentHistory;