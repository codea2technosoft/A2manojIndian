import React from 'react';
import { FaUser, FaFileDownload, FaPlus } from 'react-icons/fa';

function PaymentReport() {
  const payments = [
    {
      id: 'PAY-001',
      property: 'Sunrise Villas, Unit 302',
      client: 'John Smith',
      date: '2023-11-15',
      amount: 25000,
      method: 'Bank Transfer',
      status: 'Completed',
      invoice: 'INV-2023-1015'
    },
    {
      id: 'PAY-002',
      property: 'Ocean View Apartments',
      client: 'Sarah Johnson',
      date: '2023-11-18',
      amount: 18500,
      method: 'Credit Card',
      status: 'Pending',
      invoice: 'INV-2023-1018'
    },
    {
      id: 'PAY-003',
      property: 'Mountain Retreat',
      client: 'Michael Brown',
      date: '2023-11-20',
      amount: 32000,
      method: 'Check',
      status: 'Overdue',
      invoice: 'INV-2023-1020'
    }
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'paid';
      case 'pending':
        return 'pending';
      case 'overdue':
        return 'overdue';
      default:
        return 'badge-secondary';
    }
  };
  return (
    <div className="payment-report-wrapper">
      <div className="card shadow-sm">
        <div className="card-header bg_design_color_header d-flex justify-content-between align-items-center">
          <h3 className="m-0"><FaUser className="me-2" /> Payment Report</h3>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table paymentreport_all table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Payment ID</th>
                  <th>Property</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.id}</td>
                      <td>{payment.property}</td>
                      <td>{payment.client}</td>
                      <td>{payment.date}</td>
                      <td className="fw-bold">${payment.amount.toLocaleString()}</td>
                      <td>{payment.method}</td>
                      <td>
                        <span className={`status-badge  ${getStatusClass(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="empty-state">
                        <FaFileDownload size={32} className="text-muted mb-2" />
                        <p className="text-muted mb-2">No payment records found</p>
                        <button className="btn btn-sm btn-primary">
                          <FaPlus className="me-1" /> Add Payment
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentReport;
