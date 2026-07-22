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
  FaCalendarAlt,
  FaMoneyBillWave,
  FaWallet,
  FaBalanceScale
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
  Badge,
  ProgressBar
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
  
  // Filter states
  const [filterCategoryType, setFilterCategoryType] = useState("");
  const [filterCashFlowType, setFilterCashFlowType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  
  // Summary states
  const [balanceSheet, setBalanceSheet] = useState({
    total_debit: 0,
    total_credit: 0,
    net_balance: 0,
    balance_type: "Neutral"
  });

  const [summary, setSummary] = useState({
    opening_balance: 0,
    total_online_receipts: 0,
    total_online_payments: 0,
    closing_balance: 0,
    net_transaction_flow: "Neutral",
    receipt_count: 0,
    payment_count: 0
  });
  
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
      
      if (filterCategoryType) {
        params.append('category_type', filterCategoryType);
      }
      if (filterCashFlowType) {
        params.append('cash_flow_type', filterCashFlowType);
      }
      if (fromDate) {
        params.append('fromdate', fromDate);
      }
      if (toDate) {
        params.append('todate', toDate);
      }

      const url = `${API_URL}/balancesheet-online-details?${params.toString()}`;

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
        // Set transactions from data.transactions array
        setTransactions(data.transactions || []);
        setTotalPages(data.pagination?.total_pages || 1);
        setTotalRecords(data.pagination?.total_records || 0);
        setCurrentPage(data.pagination?.current_page || page);
        
        // Set balance sheet data
        if (data.balance_sheet) {
          setBalanceSheet({
            total_debit: data.balance_sheet.total_debit || 0,
            total_credit: data.balance_sheet.total_credit || 0,
            net_balance: data.balance_sheet.net_balance || 0,
            balance_type: data.balance_sheet.balance_type || "Neutral"
          });
        }

        // Set summary data
        if (data.summary) {
          setSummary({
            opening_balance: data.summary.opening_balance || 0,
            total_online_receipts: data.summary.total_online_receipts || 0,
            total_online_payments: data.summary.total_online_payments || 0,
            closing_balance: data.summary.closing_balance || 0,
            net_transaction_flow: data.summary.net_transaction_flow || "Neutral",
            receipt_count: data.summary.receipt_count || 0,
            payment_count: data.summary.payment_count || 0
          });
        }
      } else {
        throw new Error(data.message || "Failed to load data");
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
    setFilterCategoryType("");
    setFilterCashFlowType("");
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

  // Get badge for cash flow type
  const getCashFlowBadge = (cashFlowType) => {
    if (cashFlowType === 'Inflow') {
      return { text: 'Inflow ↗', className: 'bg-success' };
    } else if (cashFlowType === 'Outflow') {
      return { text: 'Outflow ↘', className: 'bg-danger' };
    }
    return { text: cashFlowType || '-', className: 'bg-secondary' };
  };

  // Get badge for category type
  const getCategoryTypeBadge = (categoryType) => {
    if (categoryType === 'cr') {
      return { text: 'Credit', className: 'bg-success' };
    } else if (categoryType === 'dr') {
      return { text: 'Debit', className: 'bg-danger' };
    }
    return { text: categoryType || '-', className: 'bg-secondary' };
  };

  // Get badge for transaction type - FIXED
  const getTransactionTypeBadge = (transactionType) => {
    const type = transactionType?.toLowerCase() || '';
    if (type.includes('credit') || type.includes('receipt')) {
      return { text: 'Receipt', className: 'bg-success' };
    } else if (type.includes('debit') || type.includes('payment')) {
      return { text: 'Payment', className: 'bg-danger' };
    }
    return { text: transactionType || 'Online', className: 'bg-primary' };
  };

  // Calculate totals for current page
  const calculatePageTotals = () => {
    const creditTransactions = transactions.filter(t => t.category_type === 'cr' || t.cash_flow_type === 'Inflow');
    const debitTransactions = transactions.filter(t => t.category_type === 'dr' || t.cash_flow_type === 'Outflow');
    
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
    const totalPageNumbers = 7;
    
    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
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
              <h3 className="mb-1">Online Balance Sheet Details</h3>
              <p className="text-muted mb-0">
                Page {currentPage} of {totalPages} | Total Records: {totalRecords}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              {/* FILTER BUTTON */}
              <Button
                variant={showFilters ? "primary" : "outline-primary"}
                onClick={() => setShowFilters(!showFilters)}
                className="d-flex align-items-center"
              >
                {showFilters ? (
                  <>
                    <MdFilterAltOff className="me-1" />
                    <span className="d-none d-md-inline">Hide Filters</span>
                  </>
                ) : (
                  <>
                    <MdFilterAlt className="me-1" />
                    <span className="d-none d-md-inline">Show Filters</span>
                  </>
                )}
              </Button>
              
              <Link to="/account-report" className="btn btn-success d-flex align-items-center">
                <FaArrowLeft className="me-1" />
                <span className="d-none d-md-inline">Back</span>
              </Link>
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
                    <strong>Category Type</strong>
                  </Form.Label>
                  <Form.Select
                    value={filterCategoryType}
                    onChange={(e) => setFilterCategoryType(e.target.value)}
                  >
                    <option value="">All Category Types</option>
                    <option value="cr">Credit (Income)</option>
                    <option value="dr">Debit (Expense)</option>
                  </Form.Select>
                </Form.Group>
              </Col> */}
              
              {/* <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    <strong>Cash Flow Type</strong>
                  </Form.Label>
                  <Form.Select
                    value={filterCashFlowType}
                    onChange={(e) => setFilterCashFlowType(e.target.value)}
                  >
                    <option value="">All Cash Flow</option>
                    <option value="Inflow">Inflow (Receipts)</option>
                    <option value="Outflow">Outflow (Payments)</option>
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
              
              <Col md={6}>
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
                      disabled={!filterCategoryType && !filterCashFlowType && !fromDate && !toDate}
                      title="Clear All Filters"
                    >
                      <FaTimes />
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
            
            {/* Active filters indicator */}
            {(filterCategoryType || filterCashFlowType || fromDate || toDate) && (
              <div className="mt-3 pt-2 border-top">
                <small className="text-muted me-2">Active Filters:</small>
                <div className="d-flex flex-wrap gap-1">
                  {filterCategoryType && (
                    <Badge bg="info" className="d-flex align-items-center">
                      Category: {filterCategoryType === 'cr' ? 'Credit' : 'Debit'}
                      <FaTimes 
                        className="ms-1 cursor-pointer" 
                        size={10}
                        onClick={() => setFilterCategoryType("")}
                      />
                    </Badge>
                  )}
                  {filterCashFlowType && (
                    <Badge bg="primary" className="d-flex align-items-center">
                      Cash Flow: {filterCashFlowType}
                      <FaTimes 
                        className="ms-1 cursor-pointer" 
                        size={10}
                        onClick={() => setFilterCashFlowType("")}
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
        <div className="card-body">
          {/* Balance Summary Row */}
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Card className="border-success shadow-sm h-100">
                <Card.Body className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Total Online Receipts</h6>
                      <h3 className="text-success mb-0">
                        {formatCurrency(summary.total_online_receipts)}
                      </h3>
                      <small className="text-muted">
                        <FaArrowUp className="me-1" />
                        {summary.receipt_count} receipt(s)
                      </small>
                    </div>
                    <div className="text-success">
                      <FaWallet size={28} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="border-danger shadow-sm h-100">
                <Card.Body className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Total Online Payments</h6>
                      <h3 className="text-danger mb-0">
                        {formatCurrency(summary.total_online_payments)}
                      </h3>
                      <small className="text-muted">
                        <FaArrowDown className="me-1" />
                        {summary.payment_count} payment(s)
                      </small>
                    </div>
                    <div className="text-danger">
                      <FaMoneyBillWave size={28} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className={`border-3 shadow-sm h-100 ${
                summary.net_transaction_flow === 'Net Inflow' ? 'border-success' : 
                summary.net_transaction_flow === 'Net Outflow' ? 'border-danger' : 'border-info'
              }`}>
                <Card.Body className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Net Balance</h6>
                      <h3 className={
                        summary.net_transaction_flow === 'Net Inflow' ? 'text-success mb-0' : 
                        summary.net_transaction_flow === 'Net Outflow' ? 'text-danger mb-0' : 'text-info mb-0'
                      }>
                        {formatCurrency(summary.closing_balance)}
                      </h3>
                      <Badge className={
                        summary.net_transaction_flow === 'Net Inflow' ? 'bg-success' : 
                        summary.net_transaction_flow === 'Net Outflow' ? 'bg-danger' : 'bg-info'
                      }>
                        {summary.net_transaction_flow}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-muted small">Opening</div>
                      <div className="h5 mb-0 text-muted">{formatCurrency(summary.opening_balance)}</div>
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

          {/* Transactions Table - FIXED RENDERING */}
          <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Online Transactions</h5>
                <div className="text-muted">
                  Showing {transactions.length} of {totalRecords} entries
                  {transactions.length > 0 && (
                    <span className="ms-3">
                      <span className="text-success">↑ {creditCount}</span> | 
                      <span className="text-danger"> ↓ {debitCount}</span>
                    </span>
                  )}
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
                      <th width="120">Type</th>
                      <th width="120">Cash Flow</th>
                      <th width="150" className="text-end">Amount</th>
                      <th width="120">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((transaction, index) => {
                        const cashFlowBadge = getCashFlowBadge(transaction.cash_flow_type);
                        const transactionTypeBadge = getTransactionTypeBadge(transaction.transaction_type);
                        
                        return (
                          <tr key={transaction.id || index} className="align-middle">
                            <td className="text-center text-muted">
                              <strong>{(currentPage - 1) * 10 + index + 1}</strong>
                            </td>
                            <td>
                              <div className="d-flex flex-column">
                                <div className="fw-bold mb-1">
                                  {/* FIXED: Using category_name instead of transaction_type */}
                                  {transaction.category_name || 'N/A'}
                                </div>
                                <small className="text-muted mb-1">
                                  {transaction.description || 'No description'}
                                  {transaction.payee && (
                                    <>
                                      <br />
                                      <strong>Payee:</strong> {transaction.payee}
                                    </>
                                  )}
                                </small>
                                {transaction.project_name && (
                                  <small className="text-muted">
                                    <strong>Project:</strong> {transaction.project_name}
                                    {transaction.plot_name && ` - Plot: ${transaction.plot_name}`}
                                  </small>
                                )}
                              </div>
                            </td>
                            <td>
                              <Badge className={`${transactionTypeBadge.className}`}>
                                {transactionTypeBadge.text}
                              </Badge>
                              <div className="mt-1 small">
                                <Badge bg="secondary">
                                  {transaction.transaction_type || 'Online'}
                                </Badge>
                              </div>
                            </td>
                            <td>
                              <Badge className={`${cashFlowBadge.className}`}>
                                {cashFlowBadge.text}
                              </Badge>
                              <div className="mt-1 small">
                                <Badge bg={transaction.category_type === 'cr' ? 'success' : 'danger'}>
                                  {transaction.category_type === 'cr' ? 'Credit' : 'Debit'}
                                </Badge>
                              </div>
                            </td>
                            <td className="text-end">
                              <div className={`fw-bold fs-5 ${
                                transaction.cash_flow_type === 'Inflow' || transaction.category_type === 'cr' 
                                  ? 'text-success' 
                                  : 'text-danger'
                              }`}>
                                {formatCurrency(transaction.amount)}
                              </div>
                              <small className="text-muted d-block">
                                ID: {transaction.id}
                              </small>
                            </td>
                            <td>
                              <div className="text-muted">
                                {formatDate(transaction.date)}
                              </div>
                              {transaction.created_at && (
                                <small className="text-muted d-block">
                                  {new Date(transaction.created_at).toLocaleDateString()}
                                </small>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-5">
                          <div className="text-muted">
                            <FaSearch size={32} className="mb-3" />
                            <h5>No Online Transactions Found</h5>
                            <small>
                              {(fromDate || toDate || filterCashFlowType || filterCategoryType) 
                                ? "Try changing your filters or clear all filters"
                                : "No online transactions available for the selected period"}
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
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Page {currentPage} of {totalPages} | Total: {totalRecords} entries
                </small>
                <div className="d-flex align-items-center gap-2">
                  <small className="text-success">Receipts: {formatCurrency(pageCredit)}</small>
                  <span className="text-muted">|</span>
                  <small className="text-danger">Payments: {formatCurrency(pageDebit)}</small>
                </div>
              </div>
            </Card.Footer>
          </Card>

          {/* Custom Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <div className="card">
                <div className="card-body py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      <span>Page {currentPage} of {totalPages}</span>
                      <span className="mx-2">|</span>
                      <span>Total: {totalRecords} entries</span>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <button
                        className={`btn btn-sm ${currentPage === 1 ? 'btn-outline-secondary disabled' : 'btn-outline-primary'}`}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        style={{ minWidth: '40px' }}
                        title="First Page"
                      >
                        <FaAngleDoubleLeft />
                      </button>
                      
                      <button
                        className={`btn btn-sm ${currentPage === 1 ? 'btn-outline-secondary disabled' : 'btn-outline-primary'} mx-1`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ minWidth: '40px' }}
                        title="Previous Page"
                      >
                        <FaAngleLeft />
                      </button>
                      
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
                      
                      <button
                        className={`btn btn-sm ${currentPage === totalPages ? 'btn-outline-secondary disabled' : 'btn-outline-primary'} mx-1`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ minWidth: '40px' }}
                        title="Next Page"
                      >
                        <FaAngleRight />
                      </button>
                      
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
                </div>
              </div>
            </div>
          )}
        </div>
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