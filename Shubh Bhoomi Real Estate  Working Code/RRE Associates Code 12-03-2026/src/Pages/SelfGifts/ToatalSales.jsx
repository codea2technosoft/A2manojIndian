import React, { useEffect, useState } from "react";
import { Table, Spinner, Form, Button, Pagination } from "react-bootstrap";
import axios from "axios";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
const API_URL = process.env.REACT_APP_API_URL;

function ToatalSales() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    mobile: "",
    bysqrt: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20,
  });
  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };
  // Get token from localStorage
  const getAuthToken = () => localStorage.getItem("token");

  // Fetch data from API
  const fetchData = async (page = 1, filterData = filters) => {
    setLoading(true);
    const token = getAuthToken();

    if (!token) {
      alert("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      // Send filters as query params
      const params = {
        page,
        limit: pagination.limit,
        mobile: filterData.mobile || "",
        buysqrt: filterData.bysqrt || "", // ✅ must match API param
      };

      const response = await axios.get(
        `${API_URL}/giftself-to-associate-by-admin-list`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        },
      );

      if (response.data.success === true) {
        setData(response.data.data || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: response.data.pagination.page,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.total,
        }));
      } else {
        setData([]);
        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        }));
      }
    } catch (error) {
      console.error("API Error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and fetch when page changes
  useEffect(() => {
    fetchData(pagination.currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  // Handle input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchData(1, filters);
  };

  // Handle pagination click
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  // Pagination logic - Only this part is added
  const getPaginationGroup = () => {
    let pages = [];
    const totalPagesToShow = 7;
    const sidePages = 2;

    if (pagination.totalPages <= totalPagesToShow) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let startPage = Math.max(2, pagination.currentPage - sidePages);
    let endPage = Math.min(
      pagination.totalPages - 1,
      pagination.currentPage + sidePages,
    );

    pages.push(1);

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < pagination.totalPages - 1) {
      pages.push("...");
    }

    if (pagination.totalPages > 1) {
      pages.push(pagination.totalPages);
    }

    return pages;
  };

  return (
    <div className="padding_15">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="titlepage">
              <h3 className="mb-0">Toatal Sales</h3>
            </div>
            <div className="d-block d-md-none">
              <button
                className={`filter-toggle-btn btn-primary btn ${isFilterActive ? "active" : ""}`}
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
            <Form
              onSubmit={handleFilterSubmit}
              className="d-none d-md-flex gap-2"
            >
              <Form.Control
                type="text"
                name="mobile"
                className="fillter_input"
                value={filters.mobile}
                onChange={handleFilterChange}
                placeholder="Search by Mobile"
              />
              <Form.Control
                type="text"
                name="bysqrt"
                className="fillter_input"
                value={filters.bysqrt}
                onChange={handleFilterChange}
                placeholder="Search by SQYD"
              />
              <Button variant="primary" type="submit">
                Search
              </Button>
            </Form>
          </div>
        </div>

        <div className="card-body">
          {isFilterActive && (
            <Form
              onSubmit={handleFilterSubmit}
              className="d-flex flex-wrap-mobile gap-2 mb-2"
            >
              <Form.Control
                className="w-100"
                type="text"
                name="mobile"
                value={filters.mobile}
                onChange={handleFilterChange}
                placeholder="Search by Mobile"
              />
              <Form.Control
                className="w-100"
                type="text"
                name="bysqrt"
                value={filters.bysqrt}
                onChange={handleFilterChange}
                placeholder="Search by SQYD"
              />
              <Button variant="primary" type="submit">
                Search
              </Button>
            </Form>
          )}
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading data...</p>
            </div>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Mobile</th>

                    <th>Gifted SQYD</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={item.user_id || index}>
                        <td>
                          {(pagination.currentPage - 1) * pagination.limit +
                            index +
                            1}
                        </td>
                        <td>{item.username || "N/A"}</td>
                        <td>{item.mobile || "N/A"}</td>

                        <td>{item.buysqrt || "N/A"}</td>
                        <td>
                          {item.date
                            ? new Date(item.date).toLocaleDateString("en-GB")
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {pagination.totalPages > 1 && (
                <Pagination className="justify-content-center">
                  <Pagination.Prev
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  />
                  {getPaginationGroup().map((item, index) => (
                    <Pagination.Item
                      key={index}
                      active={item === pagination.currentPage}
                      onClick={() =>
                        typeof item === "number" ? handlePageChange(item) : null
                      }
                      disabled={item === "..."}
                      style={{ cursor: item === "..." ? "default" : "pointer" }}
                    >
                      {item}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  />
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ToatalSales;
