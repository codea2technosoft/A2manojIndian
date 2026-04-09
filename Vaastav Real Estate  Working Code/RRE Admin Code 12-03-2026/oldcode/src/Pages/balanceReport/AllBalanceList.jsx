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
  FaBalanceScale,
  FaChartLine,
  FaChartPie,
  FaBuilding,
  FaLayerGroup
} from "react-icons/fa";
import {
  Modal,
  Button,
  Form,
  Table,
  Card,
  Row,
  Col,
  Badge,
  ProgressBar,
  Accordion
} from "react-bootstrap";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const API_URL = process.env.REACT_APP_API_URL;

function BalanceSheetReport() {
  // State management
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  // Filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  
  // Balance sheet data states
  const [balanceSheet, setBalanceSheet] = useState({
    assets: { total_receipts: 0, description: "" },
    liabilities: { total_payments: 0, description: "" },
    equity: { net_profit_loss: 0, description: "" }
  });
  
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
    balance_status: "Neutral"
  });
  
  const [transactions, setTransactions] = useState({
    all_transactions: [],
    grouped: {
      credits: [],
      debits: []
    }
  });
  
  const [transactionCounts, setTransactionCounts] = useState({
    total: 0,
    credits: 0,
    debits: 0
  });
  
  const [period, setPeriod] = useState({
    from: "",
    to: "",
    days_covered: ""
  });
  
  const [filtersApplied, setFiltersApplied] = useState({
    project: "",
    plot: "",
    date_range: { from: "", to: "" }
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

  // Fetch balance sheet data
  const fetchBalanceSheet = async (page = 1) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Build URL with query parameters
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      
      if (fromDate) {
        params.append('fromdate', fromDate);
      }
      if (toDate) {
        params.append('todate', toDate);
      }

      const url = `${API_URL}/total-balancesheet-cash-and-online-details?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch balance sheet");
      }

      const data = await response.json();
      
      if (data.status === "1") {
        // Set all data from response
        setBalanceSheet(data.balance_sheet || {});
        setSummary(data.summary || {});
        setTransactions(data.transactions || { all_transactions: [], grouped: { credits: [], debits: [] } });
        setTransactionCounts(data.transaction_counts || {});
        setPeriod(data.period || {});
        setFiltersApplied(data.filters_applied || {});
        setTotalPages(data.pagination?.total_pages || 1);
        setTotalRecords(data.pagination?.total_records || 0);
        setCurrentPage(data.pagination?.current_page || page);
        
      } else {
        throw new Error(data.message || "Failed to load balance sheet");
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
    fetchBalanceSheet(currentPage);
  }, [currentPage]);

  // Handle filter application
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchBalanceSheet(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setCurrentPage(1);
    setTimeout(() => fetchBalanceSheet(1), 100);
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
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // Get badge for transaction type
  const getTransactionTypeBadge = (type) => {
    if (type === 'online') {
      return { text: 'Online', className: 'bg-primary' };
    } else if (type === 'cash') {
      return { text: 'Cash', className: 'bg-warning text-dark' };
    }
    return { text: type || 'N/A', className: 'bg-secondary' };
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

  // Get badge for balance sheet category
  const getBalanceSheetCategoryBadge = (category) => {
    if (category === 'income') {
      return { text: 'Income', className: 'bg-success' };
    } else if (category === 'expense') {
      return { text: 'Expense', className: 'bg-danger' };
    }
    return { text: category || 'Other', className: 'bg-secondary' };
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

  // Calculate percentage for progress bars
  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
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
              <h3 className="mb-1">Total Balance Sheet  (Cash + Online)  Report</h3>
              {/* <p className="text-muted mb-0">
                <FaBalanceScale className="me-2" />
                Period: {formatDate(period.from)} to {formatDate(period.to)}
              </p> */}
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
              <Col md={4}>
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
              
              <Col md={4}>
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
              
              <Col md={4}>
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
                      disabled={!fromDate && !toDate}
                      title="Clear All Filters"
                    >
                      <FaTimes />
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
            
            {/* Active filters indicator */}
            {(fromDate || toDate) && (
              <div className="mt-3 pt-2 border-top">
                <small className="text-muted me-2">Active Filters:</small>
                <div className="d-flex flex-wrap gap-1">
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

        {/* Balance Sheet Overview */}
        <div className="card-body">
          {/* Period Summary */}
          <Card className="mb-4 border-info">
            {/* <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Period Summary
              </h5>
            </Card.Header> */}
            {/* <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="bg-light p-2 rounded">
                        <FaCalendarAlt size={24} className="text-info" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted">Report Period</small>
                      <h6 className="mb-0">{period.days_covered || 'Not specified'}</h6>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="bg-light p-2 rounded">
                        <FaBuilding size={24} className="text-primary" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted">Project</small>
                      <h6 className="mb-0">{filtersApplied.project || 'All Projects'}</h6>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="bg-light p-2 rounded">
                        <FaLayerGroup size={24} className="text-success" />
                      </div>
                    </div>
                    <div>
                      <small className="text-muted">Plot</small>
                      <h6 className="mb-0">{filtersApplied.plot || 'All Plots'}</h6>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body> */}
          </Card>

          {/* Financial Summary Cards */}
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Card className="border-success shadow-sm h-100">
                <Card.Body className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Total Income (Assets)</h6>
                      <h3 className="text-success mb-0">
                        {formatCurrency(balanceSheet.assets?.total_receipts || summary.total_income)}
                      </h3>
                      <small className="text-muted">
                        <FaArrowUp className="me-1" />
                        {transactionCounts.credits} credit transaction(s)
                      </small>
                      <div className="mt-2">
                        <small className="text-muted">{balanceSheet.assets?.description}</small>
                      </div>
                    </div>
                    <div className="text-success">
                      <FaWallet size={32} />
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
                      <h6 className="text-muted mb-1">Total Expenses (Liabilities)</h6>
                      <h3 className="text-danger mb-0">
                        {formatCurrency(balanceSheet.liabilities?.total_payments || summary.total_expense)}
                      </h3>
                      <small className="text-muted">
                        <FaArrowDown className="me-1" />
                        {transactionCounts.debits} debit transaction(s)
                      </small>
                      <div className="mt-2">
                        <small className="text-muted">{balanceSheet.liabilities?.description}</small>
                      </div>
                    </div>
                    <div className="text-danger">
                      <FaMoneyBillWave size={32} />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className={`border-3 shadow-sm h-100 ${
                summary.balance_status === 'Surplus' ? 'border-success' : 
                summary.balance_status === 'Deficit' ? 'border-danger' : 'border-info'
              }`}>
                <Card.Body className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-1">Net Profit/Loss (Equity)</h6>
                      <h3 className={
                        summary.net_balance >= 0 ? 'text-success mb-0' : 'text-danger mb-0'
                      }>
                        {formatCurrency(balanceSheet.equity?.net_profit_loss || summary.net_balance)}
                      </h3>
                      <Badge className={
                        summary.balance_status === 'Surplus' ? 'bg-success' : 
                        summary.balance_status === 'Deficit' ? 'bg-danger' : 'bg-info'
                      }>
                        {summary.balance_status}
                      </Badge>
                      <div className="mt-2">
                        <small className="text-muted">{balanceSheet.equity?.description}</small>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-light p-2 rounded">
                        <FaBalanceScale size={28} className="text-primary" />
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Financial Ratios */}
          {/* <Card className="mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <FaChartPie className="me-2" />
                Financial Analysis
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Income Percentage</small>
                      <small>
                        {calculatePercentage(
                          balanceSheet.assets?.total_receipts || summary.total_income,
                          (balanceSheet.assets?.total_receipts || summary.total_income) + 
                          (balanceSheet.liabilities?.total_payments || summary.total_expense)
                        )}%
                      </small>
                    </div>
                    <ProgressBar 
                      now={calculatePercentage(
                        balanceSheet.assets?.total_receipts || summary.total_income,
                        (balanceSheet.assets?.total_receipts || summary.total_income) + 
                        (balanceSheet.liabilities?.total_payments || summary.total_expense)
                      )} 
                      variant="success"
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small>Expense Percentage</small>
                      <small>
                        {calculatePercentage(
                          balanceSheet.liabilities?.total_payments || summary.total_expense,
                          (balanceSheet.assets?.total_receipts || summary.total_income) + 
                          (balanceSheet.liabilities?.total_payments || summary.total_expense)
                        )}%
                      </small>
                    </div>
                    <ProgressBar 
                      now={calculatePercentage(
                        balanceSheet.liabilities?.total_payments || summary.total_expense,
                        (balanceSheet.assets?.total_receipts || summary.total_income) + 
                        (balanceSheet.liabilities?.total_payments || summary.total_expense)
                      )} 
                      variant="danger"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Card className="text-center border-0 bg-light">
                    <Card.Body>
                      <h2 className="text-success">{transactionCounts.credits}</h2>
                      <small className="text-muted">Credit Transactions</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center border-0 bg-light">
                    <Card.Body>
                      <h2 className="text-danger">{transactionCounts.debits}</h2>
                      <small className="text-muted">Debit Transactions</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center border-0 bg-light">
                    <Card.Body>
                      <h2 className="text-primary">{transactionCounts.total}</h2>
                      <small className="text-muted">Total Transactions</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card> */}

          {/* Transaction Details */}
          <Accordion defaultActiveKey="0" className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h5 className="mb-0">
                  <FaChartLine className="me-2" />
                  Transaction Details ({transactionCounts.total} transactions)
                </h5>
              </Accordion.Header>
              <Accordion.Body>
                <Card>
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead className="table-light">
                          <tr>
                            <th width="60" className="text-center">#</th>
                            <th>Transaction Details</th>
                            <th width="100">Type</th>
                            <th width="120">Category</th>
                            <th width="120">Flow</th>
                            <th width="150" className="text-end">Amount</th>
                            <th width="120">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.all_transactions?.length > 0 ? (
                            transactions.all_transactions.map((transaction, index) => {
                              const transactionTypeBadge = getTransactionTypeBadge(transaction.type);
                              const categoryTypeBadge = getCategoryTypeBadge(transaction.category_type);
                              const balanceSheetCategoryBadge = getBalanceSheetCategoryBadge(transaction.balance_sheet_category);
                              
                              return (
                                <tr key={transaction.id || index} className="align-middle">
                                  <td className="text-center text-muted">
                                    <strong>{(currentPage - 1) * 10 + index + 1}</strong>
                                  </td>
                                  <td>
                                    <div className="d-flex flex-column">
                                      <div className="fw-bold mb-1">
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
                                    <Badge className={`${transactionTypeBadge.className} mb-1`}>
                                      {transactionTypeBadge.text}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge className={`${balanceSheetCategoryBadge.className}`}>
                                      {balanceSheetCategoryBadge.text}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge className={`${categoryTypeBadge.className}`}>
                                      {categoryTypeBadge.text}
                                    </Badge>
                                    <div className="mt-1 small">
                                      <small className="text-muted">{transaction.transaction_nature}</small>
                                    </div>
                                  </td>
                                  <td className="text-end">
                                    <div className={`fw-bold fs-5 ${
                                      transaction.category_type === 'cr' 
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
                              <td colSpan={7} className="text-center py-5">
                                <div className="text-muted">
                                  <FaSearch size={32} className="mb-3" />
                                  <h5>No Transactions Found</h5>
                                  <small>
                                    {(fromDate || toDate) 
                                      ? "Try changing your filters or clear all filters"
                                      : "No transactions available for the selected period"}
                                  </small>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* Balance Sheet Equation */}
          <Card className="mb-4 border-dark">
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">
                <FaBalanceScale className="me-2" />
                Balance Sheet Equation
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <h4 className="mb-3">Assets = Liabilities + Equity</h4>
                <div className="d-flex justify-content-center align-items-center flex-wrap">
                  <div className="border p-3 m-2 rounded bg-success bg-opacity-10">
                    <h5 >
                      {formatCurrency(balanceSheet.assets?.total_receipts || summary.total_income)}
                    </h5>
                    <small className="text-muted">Total Assets</small>
                  </div>
                  <div className="mx-3">
                    <h3>=</h3>
                  </div>
                  <div className="border p-3 m-2 rounded bg-danger bg-opacity-10">
                    <h5 className="text-danger mb-0">
                      {formatCurrency(balanceSheet.liabilities?.total_payments || summary.total_expense)}
                    </h5>
                    <small className="text-muted">Total Liabilities</small>
                  </div>
                  <div className="mx-3">
                    <h3>+</h3>
                  </div>
                  <div className="border p-3 m-2 rounded bg-info bg-opacity-10">
                    <h5>
                      {formatCurrency(balanceSheet.equity?.net_profit_loss || summary.net_balance)}
                    </h5>
                    <small className="text-muted">Equity</small>
                  </div>
                </div>
                <div className="mt-4">
                  <h5 className={
                    Math.abs(
                      (balanceSheet.assets?.total_receipts || summary.total_income) - 
                      ((balanceSheet.liabilities?.total_payments || summary.total_expense) + 
                       (balanceSheet.equity?.net_profit_loss || summary.net_balance))
                    ) < 1 ? 'text-success' : 'text-danger'
                  }>
                    {Math.abs(
                      (balanceSheet.assets?.total_receipts || summary.total_income) - 
                      ((balanceSheet.liabilities?.total_payments || summary.total_expense) + 
                       (balanceSheet.equity?.net_profit_loss || summary.net_balance))
                    ) < 1 ? '✓ Balance Sheet is Balanced' : '✗ Balance Sheet Imbalance'}
                  </h5>
                </div>
              </div>
            </Card.Body>
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

export default BalanceSheetReport;