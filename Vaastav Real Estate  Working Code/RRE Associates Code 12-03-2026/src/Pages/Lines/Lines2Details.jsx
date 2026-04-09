import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, Button, Spinner, Badge,
  Table, Modal
} from "react-bootstrap";
import { FaArrowLeft, FaPrint, FaDownload, FaEye, FaFileInvoiceDollar } from "react-icons/fa";
import Swal from "sweetalert2";

const API_URL = process.env.REACT_APP_API_URL;

function Lines2Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const getAuthToken = () => localStorage.getItem("token");
  const fetchPropertyRecords = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(
        `${API_URL}/view-user-property-record?user_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("API Response:", result);

      if (result.status === "1") {
        setPropertyData(result);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || 'Failed to fetch property records',
        });
      }
    } catch (error) {
      console.error("Error fetching property records:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load property records. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPropertyRecords();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/second-line");
  };


  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!propertyData || !propertyData.records) return;

    const headers = [
      'Date', 'Customer Name', 'Customer Mobile', 'Project',
      'Plot No', 'Area (SQYD)', 'Rate', 'Payable Amount', 'Payable BV'
    ];

    const csvData = propertyData.records.map(record => [
      new Date(record.date).toLocaleDateString(),
      `"${record.customer_name}"`,
      record.customer_mobile,
      `"${record.project_name}"`,
      record.plot_no,
      record.area,
      record.rate,
      record.payable_amount,
      record.payable_bv
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `Property_Records_${id}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(num);
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    return parseFloat(num).toLocaleString('en-IN');
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading property records...</p>
        </div>
      </Container>
    );
  }

  if (!propertyData) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3 className="text-muted">No property records found</h3>
          <p className="text-muted mb-4">Unable to load property records for this user.</p>
          <Button variant="primary" onClick={handleBack}>
            <FaArrowLeft className="me-2" /> Go Back
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="padding_15">
      <div className="card">

        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <div className="titlepage">
              <h3>{propertyData.records?.[0]?.user_username || "User"} - Property Details</h3>
              <div className="mt-3 d-flex flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <span className="me-2">Associate:</span>
                  <strong>{propertyData.records[0]?.user_username || "N/A"}</strong>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">Mobile:</span>
                  <strong>{propertyData.records[0]?.user_mobile || "N/A"}</strong>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">Total Records:</span>
                  <Badge bg="info">{propertyData.total_records}</Badge>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="d-md-block d-none d-sm-none">
                <div className="d-flex gap-2 align-items-center">
                  <Button variant="outline-danger" onClick={handleExportCSV} className="submit_button">
                    <FaDownload className="me-1" /> CSV
                  </Button>
                  <Button variant="outline-primary" onClick={handleBack} className="submit_button">
                    <FaArrowLeft className="me-1" /> Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <Row className="mb-4">

            <Col md={3} sm={6}>
              <Card className="h-100 border-success">
                <Card.Body className="text-center">
                  <div className="text-muted small mb-1">Total Area</div>
                  <h3 className="text-success">{formatNumber(propertyData.totals?.total_area)} SQYD</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 border-warning">
                <Card.Body className="text-center">
                  <div className="text-muted small mb-1">Total Amount</div>
                  <h3 className="text-warning">{formatCurrency(propertyData.totals?.total_payable_amount)}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 border-info">
                <Card.Body className="text-center">
                  <div className="text-muted small mb-1">Total BV</div>
                  <h3 className="text-info">{propertyData.totals?.total_bv || 0}</h3>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} sm={6}>
              <Card className="h-100 border-primary">
                <Card.Body className="text-center">
                  <div className="text-muted small mb-1">Total Records</div>
                  <h3 className="text-primary">{propertyData.total_records}</h3>
                </Card.Body>
              </Card>
            </Col>

          </Row>

          {/* Records Table */}
          <Card className="mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0 d-flex align-items-center">
                <FaFileInvoiceDollar className="me-2" />
                Property Transactions ({propertyData.total_records})
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {propertyData.records && propertyData.records.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Project</th>
                        <th>Plot Details</th>
                        <th className="text-end">Area</th>
                        <th className="text-end">Rate</th>
                        <th className="text-end">Amount</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propertyData.records.map((record, index) => (
                        <tr key={record.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="small">{formatDate(record.date)}</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                              Lead: {record.lead_id}
                            </div>
                          </td>
                          <td>
                            <div>
                              {record.customer_name
                                ? record.customer_name
                                  .toLowerCase()
                                  .replace(/^\w/, (c) => c.toUpperCase())
                                : "-"}
                            </div>

                            <div className="text-muted small">{record.customer_mobile}</div>
                          </td>
                          <td>
                            <div>{record.project_name}</div>
                            <Badge bg="secondary" className="mt-1">
                              ID: {record.project_id}
                            </Badge>
                          </td>
                          <td>
                            <div>{record.plot_no}</div>
                            <div className="text-muted small">{record.colony_name}</div>
                          </td>
                          <td className="text-end">
                            <div>{formatNumber(record.area)} SQYD</div>
                            <div className="text-muted small">
                              Total: {formatNumber(record.total_plot_area)}
                            </div>
                          </td>
                          <td className="text-end">
                            ₹{formatNumber(record.rate)}
                          </td>
                          <td className="text-end">
                            <div className="fw-bold text-success">
                              {formatCurrency(record.payable_amount)}
                            </div>
                            <div className="text-muted small">
                              BV: <Badge bg="warning" className="py-0 px-1">{record.payable_bv}</Badge>
                            </div>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => handleViewDetails(record)}
                              title="View Full Details"
                            >
                              <FaEye />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-light">
                      <tr>
                        <td colSpan="5" className="text-end fw-bold">Totals:</td>
                        <td className="text-end fw-bold">
                          {formatNumber(propertyData.totals?.total_area)} SQYD
                        </td>
                        <td></td>
                        <td className="text-end fw-bold text-success">
                          {formatCurrency(propertyData.totals?.total_payable_amount)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <h4 className="text-muted">No property records found</h4>
                  <p>This user doesn't have any property transactions yet.</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Record Details Modal */}
          <Modal
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Transaction Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedRecord && (
                <Row>
                  <Col md={6}>
                    <h6 className="border-bottom pb-2 mb-3">Customer Information</h6>
                    <div className="mb-2">
                      <strong>Name:</strong> {selectedRecord.customer_name}
                    </div>
                    <div className="mb-2">
                      <strong>Mobile:</strong> {selectedRecord.customer_mobile}
                    </div>
                    <div className="mb-3">
                      <strong>Lead ID:</strong> {selectedRecord.lead_id}
                    </div>

                    <h6 className="border-bottom pb-2 mb-3 mt-4">Property Details</h6>
                    <div className="mb-2">
                      <strong>Project:</strong> {selectedRecord.project_name}
                    </div>
                    <div className="mb-2">
                      <strong>Plot No:</strong> {selectedRecord.plot_no}
                    </div>
                    <div className="mb-2">
                      <strong>Colony:</strong> {selectedRecord.colony_name}
                    </div>
                    <div className="mb-3">
                      <strong>Total Plot Area:</strong> {formatNumber(selectedRecord.total_plot_area)} SQYD
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 className="border-bottom pb-2 mb-3">Transaction Details</h6>
                    <div className="mb-2">
                      <strong>Transaction Area:</strong> {formatNumber(selectedRecord.area)} SQYD
                    </div>
                    <div className="mb-2">
                      <strong>Rate:</strong> ₹{formatNumber(selectedRecord.rate)} Per SQYD
                    </div>
                    <div className="mb-2">
                      <strong>Slab Range:</strong>
                      <div className="small">
                        Old: {selectedRecord.old_slab}<br />
                        New: {selectedRecord.new_slab}
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong>BV Details:</strong>
                      <div className="small">
                        BV: {selectedRecord.bv}<br />
                        Payable BV: {selectedRecord.payable_bv}
                      </div>
                    </div>

                    <h6 className="border-bottom pb-2 mb-3 mt-4">Payment Details</h6>
                    <div className="mb-2">
                      <strong>Gross Payout:</strong> {formatCurrency(selectedRecord.gross_payout)}
                    </div>
                    <div className="mb-2">
                      <strong>TDS:</strong> {formatCurrency(selectedRecord.tds)}
                    </div>
                    <div className="mb-2">
                      <strong>Net Payout:</strong> {formatCurrency(selectedRecord.net_payout)}
                    </div>
                    <div className="mb-3">
                      <strong>Advance Balance:</strong> {formatCurrency(selectedRecord.advance_balance)}
                    </div>
                    <div className="p-2 bg-light rounded">
                      <strong>Payable Amount:</strong>
                      <span className="fs-5 text-success ms-2">
                        {formatCurrency(selectedRecord.payable_amount)}
                      </span>
                    </div>
                  </Col>
                </Row>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Lines2Details;