import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  Container,
  Card,
  Spinner,
  Form,
  Button,
  Badge
} from "react-bootstrap";
import { getAccountOperation } from "../Server/api"
const OperationAccount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10);

  const token = localStorage.getItem("token");

  // Fetch operation data
  useEffect(() => {
    fetchOperationData();
  }, [currentPage, searchTerm]);

  const fetchOperationData = async () => {
    try {
      setLoading(true);

      const response = await getAccountOperation({
        admin_id: id
      });


      if (response.data.success) {
        const apiData = response.data.data || [];

        const formatted = apiData.map((item) => {
          const dateObj = new Date(item.created_at);

          return {
            id: item._id,
            date: dateObj.toLocaleDateString(),
            rawDate: item.created_at,
            operation: item.operation,
            operationType: "primary",   // badge color — change if needed
            description: item.description,
            performedBy: item?.performed_by?.name || "-",
            performedById: item?.performed_by?.admin_id || "-",
            adminId: item.admin_id

          };
        });

        setFilteredData(formatted);
        setTotalRecords(formatted.length);
        setTotalPages(Math.ceil(formatted.length / limit));
      }
    } catch (error) {
      console.error("Error fetching operation data:", error);
      if (error.response?.status === 401) navigate("/login");
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };



  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // Pagination handlers
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleFirst = () => {
    setCurrentPage(1);
  };

  const handleLast = () => {
    setCurrentPage(totalPages);
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = end - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredData.slice(startIndex, endIndex);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Refresh data
  const refreshData = () => {
    fetchOperationData();
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="container-fluid">
        <div className="card agentmaster">
          <div className="card-header bg-primary-yellow p-2 text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
              Account Operations
            </h5>
            
            <div className="d-lg-block d-none">
              <div className="d-flex align-items-center gap-2">
                {/* <div
                  onClick={refreshData}
                  size="sm"
                  title="Refresh"
                  className="refeshbutton"
                >
                  Refresh
                </div> */}
                <div
                  onClick={() => navigate(-1)}
                  className="backbutton"
                >
                  Back
                </div>
              </div>
            </div>


          </div>
         
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading operation logs...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                <h5>NO OPERATION RECORDS FOUND</h5>
                <p className="text-muted">
                  {searchTerm ? "No matching operations found for your search" : "No operation logs available"}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline-primary"
                    onClick={clearSearch}
                    className="mt-2"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Summary Stats */}
                {/* <div className="row mb-4">
                  <div className="col-md-3">
                    <Card className="border-success">
                      <Card.Body className="py-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">TOTAL OPERATIONS</small>
                            <h4 className="mb-0">{totalRecords}</h4>
                          </div>
                          <i className="fas fa-list-alt fa-2x text-success"></i>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-md-3">
                    <Card className="border-info">
                      <Card.Body className="py-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">DISPLAYING</small>
                            <h4 className="mb-0">{Math.min(limit, filteredData.length)}</h4>
                          </div>
                          <i className="fas fa-eye fa-2x text-info"></i>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="col-md-6">
                    <Card className="border-primary">
                      <Card.Body className="py-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">SEARCH RESULTS</small>
                            <h4 className="mb-0">{searchTerm ? filteredData.length : "All records"}</h4>
                          </div>
                          <i className="fas fa-search fa-2x text-primary"></i>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                </div> */}

                {/* Operations Table */}
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th width="150">DATE & TIME</th>
                        <th width="150">OPERATION</th>
                        <th>DESCRIPTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedData().map((item) => (
                        <tr key={item.id}>
                          <td className="text-nowrap">
                            <small>{item.date}</small>
                          </td>
                          <td>
                            <div bg={item.operationType} className="w-100">
                              {item.operation}
                            </div>
                          </td>
                          <td>
                            <div className="mb-1">{item.description}</div>
                            <small className="text-muted">
                              <i className="far fa-clock me-1"></i>
                              {new Date(item.rawDate).toLocaleTimeString()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <span className="text-muted">
                        Showing {((currentPage - 1) * limit) + 1} to{" "}
                        {Math.min(currentPage * limit, filteredData.length)} of{" "}
                        {filteredData.length} entries
                        {searchTerm && " (filtered)"}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={handleFirst}
                        className="px-3"
                      >
                        <i className="fas fa-angle-double-left"></i>
                      </Button>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={handlePrev}
                        className="px-3"
                      >
                        <i className="fas fa-angle-left"></i> Prev
                      </Button>

                      <div className="d-flex gap-1">
                        {getPageNumbers().map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "primary" : "outline-primary"}
                            size="sm"
                            onClick={() => handlePageClick(page)}
                            className="px-3"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={handleNext}
                        className="px-3"
                      >
                        Next <i className="fas fa-angle-right"></i>
                      </Button>

                      <Button
                        variant="outline-primary"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={handleLast}
                        className="px-3"
                      >
                        <i className="fas fa-angle-double-right"></i>
                      </Button>
                    </div>

                    <div>
                      <Form.Select
                        size="sm"
                        style={{ width: '80px' }}
                        value={limit}
                        disabled
                      >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </Form.Select>
                    </div>
                  </div>
                )}

                {/* Search Info */}
                {searchTerm && (
                  <div className="alert alert-info mt-3 py-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <small>
                        <i className="fas fa-info-circle me-1"></i>
                        Showing {filteredData.length} results for: "{searchTerm}"
                      </small>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={clearSearch}
                      >
                        Clear Search
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>    
        </div>
      </div >
    </>
  );
}

export default OperationAccount;