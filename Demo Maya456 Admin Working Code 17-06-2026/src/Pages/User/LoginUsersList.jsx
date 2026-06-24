
import React from 'react'
import {Link} from 'react-router'
import { FaPlus } from "react-icons/fa";

function LoginUsersList() {
 const userData = [
  {
    sr: 1,
    username: "john_doe",
    mobile: "9876543210",
    password: "••••••••",
    balance: "$1,200",
    customWithdraw: false,
    customRequest: false,
    customClose: false,
    date: "2025-05-20",
    reason: "Withdrawal approved",
    status: "Active",
    statusClass: "bg-success",
  },
  {
    sr: 2,
    username: "jane_smith",
    mobile: "9123456789",
    password: "••••••••",
    balance: "$800",
    customWithdraw: false,
    customRequest: false,
    customClose: false,
    date: "2025-05-21",
    reason: "System review",
    status: "Pending",
    statusClass: "bg-warning text-dark",
  },
  {
    sr: 3,
    username: "mark99",
    mobile: "9988776655",
    password: "••••••••",
    balance: "$2,500",
    customWithdraw: false,
    customRequest: false,
    customClose: false,
    date: "2025-05-22",
    reason: "Limit exceeded",
    status: "Blocked",
    statusClass: "bg-danger",
  },
];

  return (
    <div className="LoginUsersList">
      <div className="card">
        <div className="card-header bg-color-black">
            <div className="d-flex align-items-center justify-content-between">
               <h3 className='card-title text-white'>Active User List</h3>
               <div className="buttonlist">
                  <Link to="/user/create-user" className="btn button_add d-flex justify-content-center align-items-center">
                              <FaPlus/>
                                Add List
                              </Link>
               </div>
            </div>
        </div>
        <div className="card-body">
        <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark">
            <tr>
      <th>Sr.</th>
      <th>Action</th>
      <th>User Name</th>
      <th>Mobile No</th>
      <th>Password</th>
      <th>Balance</th>
      <th>Custom Withdraw</th>
      <th>Custom Request</th>
      <th>Custom Close</th>
      <th>Date</th>
      <th>Last Login</th>
      <th>Reason</th>
      <th>Status</th>
    </tr>
        </thead>
        <tbody>
          {userData.map((user, index) => (
            <tr key={index}>
              <td>{user.sr}</td>
              <td>{user.username}</td>
              <td>{user.mobile}</td>
              <td>{user.password}</td>
              <td>{user.balance}</td>
              <td>{user.balance}</td>
              <td>{user.balance}</td>
                <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked={user.customWithdraw}
                  />
                </div>
              </td>
              <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked={user.customRequest}
                  />
                </div>
              </td>
              <td>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultChecked={user.customClose}
                  />
                </div>
              </td> 
              <td>{user.date}</td>
              <td>{user.reason}</td>
              <td>
                <span className={`badge ${user.statusClass}`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
      </div>

    </div>
  )
}

export default LoginUsersList

