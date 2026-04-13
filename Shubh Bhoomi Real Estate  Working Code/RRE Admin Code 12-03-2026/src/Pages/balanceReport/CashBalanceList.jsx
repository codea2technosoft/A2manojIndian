import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaArrowUp, 
  FaArrowDown, 
  FaSearch, 
  FaTimes,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaCalendarAlt
} from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  Table,
  Card,
  Row,
  Col,
  InputGroup,
  Badge
} from "react-bootstrap";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function OnlineCreditList() {
  // State management
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [summary, setSummary] = useState(null);
  
  // Filter states
  const [filterType, setFilterType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  
  // Modal states
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({
    title: "",
    text: "",
    type: ""
  });

  // Show custom modal
  const showCustomMessageModal = (title, text, type) => {
    setMessageModalContent({ title, text, type });
    setShowMessageModal(true);
  };

  const closeCustomMessageModal = () => {
    setShowMessageModal(false);
  };

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch transactions with pagination and filters
  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Build URL with query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 100000000000);
      
      if (filterType) {
        params.append('type', filterType);
      }
      if (fromDate) {
        params.append('fromdate', fromDate);
      }
      if (toDate) {
        params.append('todate', toDate);
      }

      const url = `${API_URL}/balancesheet-cash-details?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch transactions");
      }

      const data = await response.json();
      
      if (data.status === "1") {
        setTransactions(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalRecords(data.pagination?.total || 0);
        setCurrentPage(data.pagination?.currentPage || page);
        setSummary(data.summary || null);
      } else {
        throw new Error("Failed to load data");
      }
    } catch (err) {
      showCustomMessageModal("Error", err.message, "error");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and when filters change
  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  // Handle filter application
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchTransactions(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilterType("");
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
    setTimeout(() => fetchTransactions(1), 100);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  // Get badge for transaction type
  const getTypeBadge = (type) => {
    const badges = {
      'cash': { text: 'Cash', className: 'bg-info' },
      'credit': { text: 'Credit', className: 'bg-warning text-dark' },
      'online': { text: 'Online', className: 'bg-primary' }
    };
    return badges[type] || { text: type || '-', className: 'bg-secondary' };
  };

  // Calculate totals for current page
  const calculatePageTotals = () => {
    const creditTransactions = transactions.filter(t => t.category_type === 'cr');
    const debitTransactions = transactions.filter(t => t.category_type === 'dr');
    
    const pageCredit = creditTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const pageDebit = debitTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    return { 
      pageCredit, 
      pageDebit,
      creditCount: creditTransactions.length,
      debitCount: debitTransactions.length
    };
  };

  const { pageCredit, pageDebit, creditCount, debitCount } = calculatePageTotals();

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const totalPageNumbers = 7; // Total pagination buttons to show
    
    if (totalPages <= totalPageNumbers) {
      // Show all pages if total pages are less than totalPageNumbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      let startPage, endPage;
      
      if (currentPage <= 4) {
        startPage = 1;
        endPage = totalPageNumbers - 1;
        pages.push(...Array.from({ length: endPage }, (_, i) => startPage + i));
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        startPage = totalPages - totalPageNumbers + 2;
        pages.push(1);
        pages.push('...');
        pages.push(...Array.from({ length: totalPageNumbers - 2 }, (_, i) => startPage + i));
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
        pages.push(1);
        pages.push('...');
        pages.push(...Array.from({ length: 5 }, (_, i) => startPage + i));
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Validate date range
  const validateDateRange = () => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      if (from > to) {
        showCustomMessageModal("Invalid Date Range", "From date cannot be greater than To date", "error");
        return false;
      }
    }
    return true;
  };

  // Handle apply filters with validation
  const handleApplyFiltersWithValidation = () => {
    if (!validateDateRange()) {
      return;
    }
    handleApplyFilters();
  };

  // Quick date filters
  const applyQuickDateFilter = (days) => {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - days);
    
    setFromDate(fromDate.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
    
    setCurrentPage(1);
    setTimeout(() => fetchTransactions(1), 100);
  };

  // Apply current month filter
  const applyCurrentMonthFilter = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setFromDate(firstDay.toISOString().split('T')[0]);
    setToDate(lastDay.toISOString().split('T')[0]);
    
    setCurrentPage(1);
    setTimeout(() => fetchTransactions(1), 100);
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

  return (
    <>
      <div className="card mt-2">
        {/* Header with Filter Button */}
        <div className="card-header bg-white">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h3 className="mb-1">Total Cash Balance Sheet Details </h3>
              <p className="text-muted mb-0">
                Page {currentPage} of {totalPages} | Total Records: {totalRecords}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              {/* FILTER BUTTON */}
             
              
              <Link to="/account-report" className="btn btn-success d-flex align-items-center">
                <FaArrowLeft className="me-1" />
                <span className="d-none d-md-inline">Back</span>
              </Link>

               <Button
                variant={showFilters ? "primary" : "outline-primary"}
                onClick={() => setShowFilters(!showFilters)}
                className="d-flex align-items-center"
              >
                {showFilters ? (
                  <>
                    <MdFilterAltOff className="me-1" />
                    <span className="d-none d-md-inline"></span>
                  </>
                ) : (
                  <>
                    <MdFilterAlt className="me-1" />
                    <span className="d-none d-md-inline"></span>
                  </>
                )}
              </Button>
              
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="card-body border-bottom bg-light">
            <Row className="g-3 align-items-end">
              {/* <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Payment Type</strong>
                  </Form.Label>
                  <Form.Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">All Payment Types</option>
                    <option value="cash">Cash</option>
                    <option value="credit">Credit</option>
                    <option value="online">Online</option>
                  </Form.Select>
                </Form.Group>
              </Col> */}
              
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>
                      <FaCalendarAlt className="me-1" />
                      From Date
                    </strong>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    max={toDate || undefined}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>
                      <FaCalendarAlt className="me-1" />
                      To Date
                    </strong>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    min={fromDate || undefined}
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <div className="d-flex flex-column">
                  <div className="d-flex gap-2 mb-2">
                    <Button 
                      variant="primary" 
                      onClick={handleApplyFiltersWithValidation}
                      className="flex-grow-1"
                    >
                      <FaSearch className="me-2" />
                      Apply Filters
                    </Button>
                    
                    <Button 
                      variant="outline-danger" 
                      onClick={handleClearFilters}
                      disabled={!filterType && !fromDate && !toDate}
                      title="Clear All Filters"
                    >
                      <FaTimes />
                    </Button>
                  </div>
                  
                  {/* Quick date filters */}
                  {/* <div className="d-flex flex-wrap gap-1">
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      onClick={() => applyQuickDateFilter(7)}
                    >
                      7 Days
                    </Button>
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      onClick={() => applyQuickDateFilter(30)}
                    >
                      30 Days
                    </Button>
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      onClick={applyCurrentMonthFilter}
                    >
                      This Month
                    </Button>
                  </div> */}
                </div>
              </Col>
            </Row>
            
            {/* Active filters indicator */}
            {(filterType || fromDate || toDate) && (
              <div className="mt-3 pt-2 border-top">
                <small className="text-muted me-2">Active Filters:</small>
                <div className="d-flex flex-wrap gap-1">
                  {filterType && (
                    <Badge bg="primary" className="d-flex align-items-center">
                      Type: {filterType}
                      <FaTimes 
                        className="ms-1 cursor-pointer" 
                        size={10}
                        onClick={() => setFilterType("")}
                      />
                    </Badge>
                  )}
                  {fromDate && (
                    <Badge bg="success" className="d-flex align-items-center">
                      From: {fromDate}
                      <FaTimes 
                        className="ms-1 cursor-pointer" 
                        size={10}
                        onClick={() => setFromDate("")}
                      />
                    </Badge>
                  )}
                  {toDate && (
                    <Badge bg="warning" text="dark" className="d-flex align-items-center">
                      To: {toDate}
                      <FaTimes 
                        className="ms-1 cursor-pointer" 
                        size={10}
                        onClick={() => setToDate("")}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="card-body">
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Card className="border-success shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Total Credit</h6>
                        <h3 className="text-success mb-0">
                          ₹{parseFloat(summary.total_credit_amount || 0).toLocaleString('en-IN')}
                        </h3>
                        <small className="text-muted">
                          {summary.total_credit_entries} entries
                        </small>
                      </div>
                      <div className="text-success">
                        <FaArrowUp size={28} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className="border-danger shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Total Debit</h6>
                        <h3 className="text-danger mb-0">
                          ₹{parseFloat(summary.total_debit_amount || 0).toLocaleString('en-IN')}
                        </h3>
                        <small className="text-muted">
                          {summary.total_debit_entries} entries
                        </small>
                      </div>
                      <div className="text-danger">
                        <FaArrowDown size={28} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                <Card className={`border-3 shadow-sm ${
                  summary.balance_status === 'Positive' ? 'border-success' : 'border-danger'
                }`}>
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-muted mb-1">Net Balance</h6>
                        <h3 className={
                          summary.net_balance >= 0 ? 'text-success mb-0' : 'text-danger mb-0'
                        }>
                          ₹{Math.abs(summary.net_balance || 0).toLocaleString('en-IN')}
                        </h3>
                        <Badge className={
                          summary.balance_status === 'Positive' ? 'bg-success' : 'bg-danger'
                        }>
                          {summary.balance_status} Balance
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="text-muted small">Total</div>
                        <div className="h3 mb-0">{summary.total_entries}</div>
                        <div className="text-muted small">Entries</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Date Range Info */}
            {(fromDate || toDate) && (
              <div className="alert alert-info mb-3 py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Date Range:</strong>
                    {fromDate && <span className="ms-2">From: <strong>{fromDate}</strong></span>}
                    {toDate && <span className="ms-2">To: <strong>{toDate}</strong></span>}
                  </div>
                  <Button 
                    variant="outline-info" 
                    size="sm"
                    onClick={() => {
                      setFromDate("");
                      setToDate("");
                      setCurrentPage(1);
                      fetchTransactions(1);
                    }}
                  >
                    Clear Date Filter
                  </Button>
                </div>
              </div>
            )}

            {/* Balance Sheet Layout */}
            <Row>
              {/* Credit Column */}
              <Col lg={6} className="mb-4">
                <Card className="h-100 border-success shadow-sm">
                  <Card.Header className="bg-success text-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0 d-flex align-items-center">
                          <FaArrowUp className="me-2" />
                          Credit (Income)
                          <Badge bg="light" text="success" className="ms-2">
                            {creditCount} entries
                          </Badge>
                        </h5>
                      </div>
                      <div className="text-end">
                        <div className="text-white small">Page Total: ₹{pageCredit.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </Card.Header>
                  
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th width="60" className="text-center">#</th>
                            <th>Transaction Details</th>
                            <th width="150" className="text-end">Amount</th>
                            <th width="120">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {creditCount > 0 ? (
                            transactions
                              .filter(t => t.category_type === 'cr')
                              .map((transaction, index) => {
                                const badge = getTypeBadge(transaction.type);
                                return (
                                  <tr key={transaction.id} className="align-middle">
                                    <td className="text-center text-muted">
                                      <strong>{(currentPage - 1) * 10 + index + 1}</strong>
                                    </td>
                                    <td>
                                      <div className="d-flex flex-column">
                                        <div className="d-flex align-items-center">
                                          <Badge className={`${badge.className} me-2`}>
                                            {badge.text}
                                          </Badge>
                                          <strong>{transaction.category_name}</strong>
                                        </div>
                                        <small className="text-muted mt-1">
                                          {transaction.payee || transaction.description}
                                        </small>
                                        <small className="text-muted">
                                          {transaction.project_name} - {transaction.plot_name}
                                        </small>
                                      </div>
                                    </td>
                                    <td className="text-end">
                                      <div className="text-success fw-bold">
                                        ₹{parseFloat(transaction.amount).toLocaleString('en-IN')}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-muted">
                                        {formatDate(transaction.date)}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-5">
                                <div className="text-muted">
                                  <FaArrowUp size={32} className="mb-3" />
                                  <h5>No Credit Transactions</h5>
                                  <small>
                                    {(fromDate || toDate || filterType) 
                                      ? "Try changing your filters"
                                      : "No transactions found"}
                                  </small>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                  
                  <Card.Footer className="bg-light py-2">
                    <div className="d-flex justify-content-center">
                      <small className="text-muted">
                        Showing {creditCount} of {summary.total_credit_entries} total credit entries
                      </small>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>

              {/* Debit Column */}
              <Col lg={6} className="mb-4">
                <Card className="h-100 border-danger shadow-sm">
                  <Card.Header className="bg-danger text-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0 d-flex align-items-center">
                          <FaArrowDown className="me-2" />
                          Debit (Expenses)
                          <Badge bg="light" text="danger" className="ms-2">
                            {debitCount} entries
                          </Badge>
                        </h5>
                      </div>
                      <div className="text-end">
                        <div className="text-white small">Page Total: ₹{pageDebit.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </Card.Header>
                  
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th width="60" className="text-center">#</th>
                            <th>Transaction Details</th>
                            <th width="150" className="text-end">Amount</th>
                            <th width="120">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {debitCount > 0 ? (
                            transactions
                              .filter(t => t.category_type === 'dr')
                              .map((transaction, index) => {
                                const badge = getTypeBadge(transaction.type);
                                return (
                                  <tr key={transaction.id} className="align-middle">
                                    <td className="text-center text-muted">
                                      <strong>{(currentPage - 1) * 10 + index + 1}</strong>
                                    </td>
                                    <td>
                                      <div className="d-flex flex-column">
                                        <div className="d-flex align-items-center">
                                          <Badge className={`${badge.className} me-2`}>
                                            {badge.text}
                                          </Badge>
                                          <strong>{transaction.category_name}</strong>
                                        </div>
                                        <small className="text-muted mt-1">
                                          {transaction.payee || transaction.description}
                                        </small>
                                        <small className="text-muted">
                                          {transaction.project_name} - {transaction.plot_name}
                                        </small>
                                      </div>
                                    </td>
                                    <td className="text-end">
                                      <div className="text-danger fw-bold">
                                        ₹{parseFloat(transaction.amount).toLocaleString('en-IN')}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-muted">
                                        {formatDate(transaction.date)}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <tr>
                              <td colSpan={4} className="text-center py-5">
                                <div className="text-muted">
                                  <FaArrowDown size={32} className="mb-3" />
                                  <h5>No Debit Transactions</h5>
                                  <small>
                                    {(fromDate || toDate || filterType) 
                                      ? "Try changing your filters"
                                      : "No transactions found"}
                                  </small>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                  
                  <Card.Footer className="bg-light py-2">
                    <div className="d-flex justify-content-center">
                      <small className="text-muted">
                        Showing {debitCount} of {summary.total_debit_entries} total debit entries
                      </small>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>

            {/* Custom Pagination */}
            {totalPages > 1 && (
              <div className="mt-4">
                <div className="card">
                  <div className="card-body py-2">
                    <div className="d-flex justify-content-between align-items-center">
                      {/* Left side - Page info */}
                      <div className="text-muted">
                        <span>Page {currentPage} of {totalPages}</span>
                        <span className="mx-2">|</span>
                        <span>Total: {totalRecords} entries</span>
                      </div>
                      
                      {/* Middle - Pagination buttons */}
                      <div className="d-flex align-items-center">
                        {/* First page */}
                        <button
                          className={`btn btn-sm ${currentPage === 1 ? 'btn-outline-secondary disabled' : 'btn-outline-primary'}`}
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                          style={{ minWidth: '40px' }}
                          title="First Page"
                        >
                          <FaAngleDoubleLeft />
                        </button>
                        
                        {/* Previous page */}
                        <button
                          className={`btn btn-sm ${currentPage === 1 ? 'btn-outline-secondary disabled' : 'btn-outline-primary'} mx-1`}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={{ minWidth: '40px' }}
                          title="Previous Page"
                        >
                          <FaAngleLeft />
                        </button>
                        
                        {/* Page numbers */}
                        {getPaginationNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={`dots-${index}`} className="mx-1" style={{ minWidth: '30px', textAlign: 'center' }}>
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                              onClick={() => handlePageChange(page)}
                              style={{ minWidth: '40px' }}
                            >
                              {page}
                            </button>
                          )
                        ))}
                        
                        {/* Next page */}
                        <button
                          className={`btn btn-sm ${currentPage === totalPages ? 'btn-outline-secondary disabled' : 'btn-outline-primary'} mx-1`}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          style={{ minWidth: '40px' }}
                          title="Next Page"
                        >
                          <FaAngleRight />
                        </button>
                        
                        {/* Last page */}
                        <button
                          className={`btn btn-sm ${currentPage === totalPages ? 'btn-outline-secondary disabled' : 'btn-outline-primary'}`}
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          style={{ minWidth: '40px' }}
                          title="Last Page"
                        >
                          <FaAngleDoubleRight />
                        </button>
                      </div>
                      
                      {/* Right side - Go to page */}
                      <div className="d-flex align-items-center">
                        <span className="text-muted me-2">Go to:</span>
                        <div className="input-group input-group-sm" style={{ width: '120px' }}>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            min="1"
                            max={totalPages}
                            defaultValue={currentPage}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const page = parseInt(e.target.value);
                                if (page >= 1 && page <= totalPages) {
                                  handlePageChange(page);
                                }
                              }
                            }}
                            style={{ textAlign: 'center' }}
                          />
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                              const input = e.target.closest('.input-group').querySelector('input');
                              const page = parseInt(input.value);
                              if (page >= 1 && page <= totalPages) {
                                handlePageChange(page);
                              }
                            }}
                          >
                            Go
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="mt-2">
                      <div className="progress" style={{ height: '4px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ width: `${(currentPage / totalPages) * 100}%` }}
                          aria-valuenow={currentPage}
                          aria-valuemin={1}
                          aria-valuemax={totalPages}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={closeCustomMessageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{messageModalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{messageModalContent.text}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeCustomMessageModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OnlineCreditList;