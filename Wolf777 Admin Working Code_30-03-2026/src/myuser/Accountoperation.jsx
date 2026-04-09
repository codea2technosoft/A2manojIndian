import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";

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

const Accountoperation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [operationData, setOperationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10);

  const token = localStorage.getItem("token");
  const toastShownRef = useRef(false); // Toast को track करने के लिए

  // Fetch operation data
  useEffect(() => {
    if (!toastShownRef.current) {
      toastShownRef.current = true;
    }
    fetchOperationData();
  }, [currentPage, searchTerm]);

  const fetchOperationData = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/get-account-user-operation
 `,
        {
          admin_id: id,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        const data = response.data.data || [];
        const count = response.data.count || 0;

        // Set pagination
        setTotalRecords(count);
        setTotalPages(Math.ceil(count / limit));

        // Format the data
        const formattedData = data.map((item, index) => {
          // Format date properly from API response
          const formatDateTime = (dateString) => {
            if (!dateString) return "N/A";

            try {
              const dateObj = new Date(dateString);

              // Check if date is valid
              if (isNaN(dateObj.getTime())) {
                return "Invalid Date";
              }

              // Format as DD-MM-YYYY HH:MM:SS
              const day = dateObj.getDate().toString().padStart(2, '0');
              const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
              const year = dateObj.getFullYear();
              const hours = dateObj.getHours().toString().padStart(2, '0');
              const minutes = dateObj.getMinutes().toString().padStart(2, '0');
              const seconds = dateObj.getSeconds().toString().padStart(2, '0');

              return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
            } catch (error) {
              console.error("Error formatting date:", error);
              return "Date Error";
            }
          };

          // Determine operation type color
          const getOperationType = (operation) => {
            if (!operation) return "secondary";

            const op = operation.toLowerCase();
            if (op.includes("block")) return "danger";
            if (op.includes("unblock")) return "success";
            if (op.includes("update")) return "warning";
            if (op.includes("create")) return "info";
            if (op.includes("delete")) return "dark";
            if (op.includes("password")) return "primary";
            return "secondary";
          };

          return {
            id: item._id || `item-${index}`,
            date: formatDateTime(item.created_at),
            operation: item.operation || "Operation",
            description: item.description || "No description",
            performedBy: item.performed_by?.name || "Unknown",
            performedById: item.performed_by?.admin_id || "N/A",
            adminId: item.admin_id || "N/A",
            operationType: getOperationType(item.operation || ""),
            rawDate: item.created_at
          };
        });

        setOperationData(formattedData);

        // Apply search filter
        if (searchTerm) {
          const filtered = formattedData.filter(item =>
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.adminId.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredData(filtered);
        } else {
          setFilteredData(formattedData);
        }
      } else {
        // Show only one error toast
        if (!toastShownRef.current) {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching operation data:", error);

      // Show only one error toast based on error type
      if (!toastShownRef.current) {
        if (error.response?.status === 401) {
          console.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          console.error(error.response?.data?.message);
        }
      }
    } finally {
      setLoading(false);
      toastShownRef.current = false; 
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
    toast.success("Data refreshed successfully!");
  };

  return (
    <>
      <div className="container-fluid">
        <div className="card">
          <div className="card-header bg-color-black p-2 text-white d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">
              Account Operations dd
            </h5>
            <div className="d-flex align-items-center gap-2">
              {/* <Form.Control
                type="text"
                placeholder="Search operations..."
                value={searchTerm}
                onChange={handleSearch}
                className="me-2"
                style={{ width: '250px' }}
              /> */}
              
              <button

                onClick={refreshData}
                className="backbutton"
                title="Refresh"
              >
              refresh
              </button>
              <button
                onClick={() => navigate(-1)}
                className="backbutton"
              >
                <i className="fas fa-arrow-left me-1"></i> Back
              </button>
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
                  <button
                    onClick={clearSearch}
                    className="refershbutton"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Operations Table */}
                <div className="table-responsive">
                  <Table striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th >DATE & TIME</th>
                        <th >OPERATION</th>
                        <th>DESCRIPTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedData().map((item) => (
                        <tr key={item.id}>
                          <td className="text-nowrap">
                            <div className="fw-semibold">{item.date}</div>
                          </td>
                          <td>
                            <Badge bg={item.operationType} className="w-100">
                              {item.operation}
                            </Badge>
                          </td>
                          <td>
                            <div className="mb-1">{item.description}</div>
                            {item.rawDate && (
                              <small className="text-muted">
                                <i className="far fa-clock me-1"></i>
                                {new Date(item.rawDate).toLocaleTimeString()}
                              </small>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">

                    <div className="sohwingallentries">
                      Showing {((currentPage - 1) * limit) + 1} to{" "}
                      {Math.min(currentPage * limit, filteredData.length)} of{" "}
                      {filteredData.length} entries
                      {searchTerm && " (filtered)"}
                    </div>

                    <div className="paginationall d-flex align-items-center gap-1">


                      <button
                        disabled={currentPage === 1}
                        onClick={handlePrev}
                        className=""
                      >
                        <MdOutlineKeyboardArrowLeft />
                      </button>


                      <div className="d-flex gap-1">

                        {getPageNumbers().map((page) => (
                          <div
                            key={page}
                            className={`paginationnumber ${currentPage === page ? "active" : ""
                              }`}
                            onClick={() => handlePageClick(page)}
                          >
                            {page}
                          </div>
                        ))}
                      </div>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={handleNext}
                        className=""
                      >
                        <MdOutlineKeyboardArrowRight />
                      </button>

                    </div>
                  </div>
                )}
                {/* {totalPages > 1 && (
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
                )} */}

                {/* Search Info */}
                {searchTerm && (
                  <div className="alert alert-info mt-3 py-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <small>
                        <i className="fas fa-info-circle me-1"></i>
                        Showing {filteredData.length} results for: "{searchTerm}"
                      </small>
                      <button
                        className="refreshbutton"
                        onClick={clearSearch}
                      >
                        Clear Search
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Accountoperation;