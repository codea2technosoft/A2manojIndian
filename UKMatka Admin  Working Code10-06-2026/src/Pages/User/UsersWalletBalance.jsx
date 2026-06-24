import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  BsCreditCard2FrontFill,
  BsTrophyFill,
  BsArrowDownCircleFill,
  BsWallet2,
  BsGraphUp,
  BsCashStack,
} from "react-icons/bs";
function UsersWalletBalance() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(null);
  const [modalAction, setModalAction] = useState(null);
  const [modalCredit, setModalCredit] = useState(0);
  const [amount, setAmount] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const walletdata = [
    {
      icon: <BsCreditCard2FrontFill size={24} className="icon" />,
      amount: "162657",
      title: "Total Credit Amount",
      colorClass: "bg-orange-gradient",
    },
    {
      icon: <BsTrophyFill size={24} className="icon" />,
      amount: "22511",
      title: "Total Win Amount",
      colorClass: "bg-info-gradient",
    },
    {
      icon: <BsArrowDownCircleFill size={24} className="icon" />,
      amount: "5322",
      title: "Total Debit Amount",
      colorClass: "bg-pink-gradient",
    },
    {
      icon: <BsWallet2 size={24} className="icon" />,
      amount: "10795",
      title: "Total Balance Amount",
      colorClass: "bg-primary-gradient",
    },
    {
      icon: <BsGraphUp size={24} className="icon" />,
      amount: "14521",
      title: "Total Profit Loss Amount",
      colorClass: "bg-light-gradient",
    },
    {
      icon: <BsCashStack size={24} className="icon" />,
      amount: "1626874",
      title: "Total Withdraw Amount",
      colorClass: "bg-green-gradient",
    },
  ];

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.success === "1") {
          setUsers(result.data);
          setFilteredUsers(result.data);
        } else {
          Swal.fire(
            "Error",
            result.message || "Failed to fetch users",
            "error"
          );
        }
      } catch (error) {
        Swal.fire("Error", "Failed to fetch users", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter((user) => {
      const userName = user.username?.toLowerCase() || "";
      const mobile = user.mobile?.toString() || "";
      return userName.includes(value) || mobile.includes(value);
    });

    setFilteredUsers(filtered);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const downloadCSV = () => {
    if (users.length === 0) {
      Swal.fire("No data", "There are no users to download.", "warning");
      return;
    }
    const headers = [
      "Sr.",
      "User Name",
      "Mobile No",
      "Pin",
      "Balance",
      "Date",
      "Status",
    ];
    const rows = users.map((user, index) => [
      index + 1,
      user.username,
      user.mobile,
      user.mpin,
      user.credit,
      new Date(user.created_at).toLocaleDateString(),
      user.status.charAt(0).toUpperCase() + user.status.slice(1),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="userwalletbalance">
      <div className="card">
        <div className="card-header bg-color-black p-3">
          <div className="d-flex align-items-center justify-content-between">
            <h3 className="card-title text-white">All Users Wallet Balance</h3>
            <button className="btn button_add btn" onClick={downloadCSV}>
              Download CSV
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row dataofcard">
            {walletdata.map((data, index) => (
    <div className="col-md-4 col-lg-4 col-xl-4 col-sm-4" key={index}>
                <div className={`box1_green gap-2 ${data.colorClass}`}>
                  <div className="icon-wrapper">{data.icon}</div>
                  <p>{data.amount}</p>
                  <small>{data.title}</small>
                </div>
              </div>
            ))}

          </div>
         <div className="row">
          <div className="col-md-12">
            <div className="form-design-fillter d-flex justify-content-end search_bar ml-auto">
                <input
                  type="text"
                  name="user_name"
                  className="form-control"
                  placeholder="Search by User Name or Mobile "
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
            </div>
          </div>
         </div>
          <div className="table-responsive">
            <table className="table table-bordered mt-4">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>User Name</th>
                  <th>Mobile No</th>
                  <th>Password</th>
                  <th>Balance</th>
                  <th>Date</th>
                  {/* <th>Reason</th> */}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td>{indexOfFirstUser + index + 1}</td>
                      <td>
                        {user.username.charAt(0).toUpperCase() +
                          user.username.slice(1).toLowerCase()}
                      </td>

                      <td>{user.mobile}</td>
                      <td>{user.mpin}</td>
                      <td>Rs {user.credit}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      {/* <td>NA</td> */}
                      <td>
                        <span
                          className={`badge ${
                            user.status === "active"
                              ? "bg-success"
                              : user.status === "pending"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="paginationbutton"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="alllistnumber">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="paginationbutton"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UsersWalletBalance;
