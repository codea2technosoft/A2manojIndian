import React, { useEffect, useState } from "react";
import { Table, Spinner, Form, Button, Pagination } from "react-bootstrap";
import axios from "axios";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function GiftSelfToAssociateList() {
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

  // 🔐 Get token from localStorage
  const getAuthToken = () => localStorage.getItem("token");

  // 📦 Fetch data from API
  const fetchData = async (page = 1, filterData = filters) => {
    setLoading(true);
    const token = getAuthToken();

    if (!token) {
      alert("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      // 🔎 Send filters as query params
      const params = {
        page,
        limit: pagination.limit,
        mobile: filterData.mobile || "",
        buysqrt: filterData.bysqrt || "",
      };

      const response = await axios.get(`${API_URL}/gift-team-associate-list`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const resData = response.data;

      if (resData.status === "1") {
        setData(resData.data || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: resData.page,
          totalPages: Math.ceil(resData.total / resData.limit),
          totalItems: resData.total,
        }));
      } else {
        setData([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          limit: 20,
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 🕐 Initial fetch and on page change
  useEffect(() => {
    fetchData(pagination.currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage]);

  // 🧾 Handle input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 🔍 Handle filter submit
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchData(1, filters);
  };

  // ⏩ Handle pagination click
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const [isFilterActive, setIsFilterActive] = useState(false);
  const handleToggle = () => {
    setIsFilterActive(!isFilterActive);
  };

  return (
    <div className="card mt-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="titlepage">
          <h3 className="mb-0">Team Gift Associate</h3>
        </div>

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
        </div>

        {isFilterActive && (
      <div className="card-body pb-0">
          <Form onSubmit={handleFilterSubmit} className="d-flex gap-2 align-items-center flex-wrap-mobile">
            <Form.Control
              type="text"
              name="mobile"
              value={filters.mobile}
              onChange={handleFilterChange}
              placeholder="Search by Mobile"
            />
            <Form.Control
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
          </div>
        )}

        <div className="card-body">
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
                  <th>Mobile</th>
                  <th>User Name</th>
                  <th>Gifted SQYD</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>
                        {(pagination.currentPage - 1) * pagination.limit +
                          index +
                          1}
                      </td>
                      <td>{item.mobile || "N/A"}</td>
                       <td>{item.username || "N/A"}</td>
                      <td>{item.buysqrt || "N/A"}</td>
                      <td>
                        {item.created_at
                          ? new Date(item.created_at).toLocaleDateString(
                            "en-GB"
                          )
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
              <Pagination className="justify-content-end pt-2">
                <Pagination.Prev
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                />
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === pagination.currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
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
  );
}

export default GiftSelfToAssociateList;
