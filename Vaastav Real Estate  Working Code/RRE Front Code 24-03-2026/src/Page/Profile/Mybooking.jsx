import React from 'react';
import { FaUser } from 'react-icons/fa';

function Mybooking() {
  const payments = [
    {
      productId: 'PROD-1001',
      plotNumber: 'PL-205',
      date: '2023-11-15',
      amount: '$25,000',
      status: 'Paid'
    },
    {
      productId: 'PROD-1002',
      plotNumber: 'PL-306',
      date: '2023-11-18',
      amount: '$18,500',
      status: 'Pending'
    },
    {
      productId: 'PROD-1003',
      plotNumber: 'PL-112',
      date: '2023-11-20',
      amount: '$32,000',
      status: 'Paid'
    },
    {
      productId: 'PROD-1004',
      plotNumber: 'PL-409',
      date: '2023-11-22',
      amount: '$15,750',
      status: 'Overdue'
    }
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
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
    <div className='mybooking'>
      <div className="card shadow-sm">
        <div className="card-header bg_design_color_header text-white">
          <h3 className="m-0"><FaUser className="me-2" />My Booking</h3>
        </div>
        <div className="table-responsive">
          <table className="table payment-table mb-0">
            <thead className="table-light">
              <tr>
                <th>Product ID</th>
                <th>Plot Number</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.productId}</td>
                  <td>{payment.plotNumber}</td>
                  <td>{payment.date}</td>
                  <td className="fw-bold">{payment.amount}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Mybooking;
