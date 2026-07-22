import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Card, Button, Form, Table, Row, Col } from "react-bootstrap";
import {
  createSubAdmin,
  getAllSubAdmins,
  updateSubAdmin,
  deleteSubAdmin,
  changestatusSubAdmin,
} from "../../Server/api";
import { FaCopy } from "react-icons/fa6";

const SubAdminPage = () => {
  const navigate = useNavigate();
  const [subAdmins, setSubAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    permissions: [],
  });
  // const PERMISSION_GROUPS = {
  //   "Dashboard": [
  //     { key: "homedashboard", label: "Home Dashboard" },
  //     { key: "dashboard", label: "Dashboard" }
  //   ],
  //   "User Management": [
  //     { key: "create_user", label: "Create User" },
  //     { key: "all_users", label: "All Users" },
  //     { key: "active_users", label: "Active Users" },
  //     { key: "inactive_users", label: "Inactive Users" },
  //     { key: "user_wallet", label: "User Wallet" },
  //     // { key: "login_history", label: "Login History" }
  //   ],
  //   "Transaction Management": [
  //     { key: "withdrawal_pending", label: "Withdrawal Pending" },
  //     { key: "withdrawal_complete", label: "Withdrawal Complete" },
  //     { key: "withdrawal_reject", label: "Withdrawal Reject" },
  //     { key: "deposit_pending", label: "Deposit Pending" },
  //     { key: "deposit_complete", label: "Deposit Complete" },
  //     { key: "deposit_reject", label: "Deposit Reject" },
  //     { key: "withdrawal_approve", label: "Withdrawal Approve" }
  //   ],
  //   "Bet Management": [
  //     { key: "bet_history_pending", label: "Bet History Pending" },
  //     { key: "bet_history_success", label: "Bet History Success" },
  //     { key: "all_bets", label: "All Bets" },
  //     { key: "user_bet_history", label: "User Bet History" }
  //   ],
  //   "Game Management": [
  //     { key: "sports_management", label: "Sports Management" },
  //     { key: "cricket_management", label: "Cricket Management" },
  //     { key: "event_management", label: "Event Management" },
  //     { key: "fancy_management", label: "Fancy Management" }
  //   ],
  //   "Result Declaration": [
  //     { key: "declare_main", label: "Declare Main Market" },
  //     { key: "declare_king_jack", label: "Declare King Jack" }
  //   ],
  //   "Reports & Analytics": [
  //     { key: "withdrawal_reports", label: "Withdrawal Reports" },
  //     { key: "deposit_reports", label: "Deposit Reports" },
  //     { key: "game_reports", label: "Game Reports" },
  //     { key: "ledger", label: "Ledger" }
  //   ],
  //   "Settings & Configuration": [
  //     { key: "app_settings", label: "App Settings" },
  //     { key: "color_settings", label: "Color Settings" },
  //     { key: "video_management", label: "Video Management" },
  //     { key: "slider_management", label: "Slider Management" },
  //     { key: "notification_management", label: "Notification Management" },
  //     { key: "idea_management", label: "Idea Management" }
  //   ],
  //   "Admin Management": [
  //     { key: "subadmin_management", label: "Sub Admin Management" },
  //     { key: "subadmin_permissions", label: "Sub Admin Permissions" }
  //   ]
  // };
  const PERMISSION_GROUPS = {
    Dashboard: [{ key: "dashboard", label: "Dashboard" }],

    "User Management": [
      { key: "users-list", label: "All Users" },
      { key: "active-users-list", label: "Active Users" },
      { key: "inactive-users-list", label: "Inactive Users" },
      { key: "blocked-users-list", label: "Blocked Users" },
    ],

    // "Admin Management": [
    //   { key: "subadmin_management", label: "Sub Admin" }
    // ],

    "Sport Betting": [
      { key: "inplaygame", label: "In Play Game" },
      { key: "Usertransaction", label: "Completed Game" },
      { key: "Bethistory", label: "Fancy Bets Pending" },
      { key: "Allmatchhistory", label: "All Match Pending" },
      { key: "SettledBethistory", label: "Settled Bets" },
    ],

    "Account Management": [
      { key: "bank_account_pending", label: "Pending Accounts" },
      { key: "bank_account_complete", label: "Completed Accounts" },
      { key: "bank_account_reject", label: "Rejected Accounts" },
    ],

    "Game Management": [
      { key: "sports_management", label: "Sports" },
      { key: "cricket_management", label: "Cricket" },
      { key: "active_events", label: "Active Events" },
      { key: "inactive_events", label: "Inactive Events" },
      { key: "complete_events", label: "Complete Events" },
      { key: "fancy_management_view", label: "Fancy Result" },
      { key: "declare_result", label: "Declare Result" },
      { key: "/fancy-result-list", label: "Fancy Result List" },
    ],

    "Transaction Management": [
      { key: "deposite_pending", label: "Deposit Pending" },
      { key: "deposite_complete", label: "Deposit Complete" },
      { key: "deposite_reject", label: "Deposit Reject" },

      { key: "withdrawal_pending_Approve", label: "Withdrawal PreApproved" },
      { key: "withdrawal_pending", label: "Withdrawal Pending" },
      { key: "withdrawal_complete", label: "Withdrawal Complete" },
      { key: "withdrawal_reject", label: "Withdrawal Reject" },
    ],

    Settings: [
      { key: "general_setting", label: "Admin Setting" },
      { key: "gateway-setting", label: "Gateway Setting" },
      { key: "web-seting", label: "Web Setting" },
      { key: "slider", label: "Slider" },
    ],

    Communication: [{ key: "adminchat", label: "Users Chat" }],
  };
  const loadData = async () => {
    try {
      const res = await getAllSubAdmins();
      if (res.data.success) setSubAdmins(res.data.data);
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Unable to load Sub Admins", "error");
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (/^[A-Za-z\s]*$/.test(value)) {
        setFormData({ ...formData, name: value });
      }
    } else if (name === "mobile") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, mobile: value });
      }
    } else if (name === "email") {
      setFormData({ ...formData, email: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const togglePermission = (permissionKey) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter((p) => p !== permissionKey)
        : [...prev.permissions, permissionKey],
    }));
  };
  const toggleGroupPermissions = (groupPermissions) => {
    const groupKeys = groupPermissions.map((p) => p.key);
    const allSelected = groupKeys.every((key) =>
      formData.permissions.includes(key),
    );

    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !groupKeys.includes(p))
        : [...new Set([...prev.permissions, ...groupKeys])],
    }));
  };
  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      password: "",
      permissions: [],
    });
    setValidated(false);
    setEditingId(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    try {
      const apiData = {
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        permissions: formData.permissions,
      };
      if (formData.password && formData.password.trim() !== "") {
        apiData.password = formData.password;
      }
      if (editingId) {
        const res = await updateSubAdmin(editingId, formData);
        if (res.data.success) {
          Swal.fire("Updated", "Sub Admin updated successfully", "success");
          loadData();
          setShowForm(false); // ✅ form close
          resetForm();
        }
      } else {
        const res = await createSubAdmin(apiData);
        if (res.data && res.data.success) {
          Swal.fire("Created", "Sub Admin created successfully", "success");
          loadData();
          setShowForm(false);
          resetForm();
        } else {
          Swal.fire("Error", res.data?.message || "Creation failed", "error");
        }
      }
    } catch (err) {
      if (err.response && err.response.data) {
        Swal.fire(
          "Error",
          err.response.data.message || "Something went wrong",
          "error",
        );
      } else {
        Swal.fire("Error", "Network error or server not responding", "error");
      }
    }
  };

  const handleDelete = (user_id) => {
    Swal.fire({
      title: "Delete Sub Admin?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (r) => {
      if (r.isConfirmed) {
        await deleteSubAdmin(user_id);
        loadData();
        Swal.fire("Deleted", "", "success");
      }
    });
  };

  const handleStatusChange = async (item) => {
    const newStatus = item.active === 1 ? 0 : 1;
    try {
      await changestatusSubAdmin(item._id, { active: newStatus });

      Swal.fire("Success", "Status updated", "success");
      loadData();
    } catch (err) {
      Swal.fire("Error", "Unable to update status", "error");
    }
  };
  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.username,
      mobile: item.mobile,
      email: item.email || "",
      password: "",
      permissions: item.permissions || [],
    });
    setShowForm(true);
  };
  const handleCopy = (item) => {
    const text = `
Name: ${item.admin_id}
OTP: ${item.admin_otp || "-"}
Password: ${item.password}
`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        Swal.fire("Copied!", "Credentials copied to clipboard", "success");
      })
      .catch(() => {
        Swal.fire("Error", "Failed to copy", "error");
      });
  };
  return (
    <div className="">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title">Sub Admin Management</h3>
          <div>
            <button
              className="btn btn-light me-2"
              onClick={() => {
                navigate("/create-sub_admin");
              }}
            >
              + Create Sub Admin
            </button>
            <button className="btn btn-light">Filter</button>
          </div>
        </div>
      </div>

      {showForm && (
        <Card className="p-3 mt-3">
          <h5>{editingId ? "Edit Sub Admin" : "Create Sub Admin"}</h5>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={!!editingId}
                    required
                  />
                </Form.Group>
              </Col>
              <Form.Group className="mb-3">
                <Form.Label>Email (Optional)</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email (optional)"
                  value={formData.email}
                  onChange={handleChange}
                  readOnly={!!editingId} // ✅ add this
                />
              </Form.Group>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    placeholder="Enter mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            {editingId && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength={4}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* PERMISSIONS SECTION */}
            <div className="mb-4">
              <Form.Label className="fw-bold">Assign Permissions</Form.Label>
              <div className="border rounded p-3">
                {Object.entries(PERMISSION_GROUPS).map(
                  ([groupName, permissions]) => {
                    const groupKeys = permissions.map((p) => p.key);
                    const allSelected = groupKeys.every((key) =>
                      formData.permissions.includes(key),
                    );
                    const someSelected = groupKeys.some((key) =>
                      formData.permissions.includes(key),
                    );

                    return (
                      <div key={groupName} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">{groupName}</h6>
                          <Form.Check
                            type="checkbox"
                            label="Select All"
                            checked={allSelected}
                            indeterminate={someSelected && !allSelected}
                            onChange={() => toggleGroupPermissions(permissions)}
                          />
                        </div>
                        <Row>
                          {permissions.map((permission) => (
                            <Col md={6} lg={4} key={permission.key}>
                              <Form.Check
                                type="checkbox"
                                label={permission.label}
                                checked={formData.permissions.includes(
                                  permission.key,
                                )}
                                onChange={() =>
                                  togglePermission(permission.key)
                                }
                                className="mb-2"
                              />
                            </Col>
                          ))}
                        </Row>
                        <hr />
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-1">
              <Button type="submit" className="btn btn-success">
                {editingId ? "Update" : "Create"}
              </Button>
              <Button
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card>
      )}

      {/* SUB ADMIN LIST */}
      <Card className="mt-3 p-3">
        <h5>Sub Admin List</h5>
        <div className="table-responsive">
          <Table bordered hover className="mt-2">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>Copy</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>OTP</th>
                <th>Password</th>
                {/* <th>Email</th> */}
                <th>Permissions</th>
                <th>Status</th>
                <th style={{ width: 250 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subAdmins.length ? (
                subAdmins.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>
                      <button
                        size="sm"
                        className="btn btn-info text-light"
                        onClick={() => handleCopy(item)}
                      >
                        <FaCopy />
                      </button>{" "}
                    </td>
                    <td>{item.admin_id}</td>
                    <td>{item.mobile}</td>
                    <td>{item.admin_otp || "-"}</td>
                    <td>{item.password}</td>
                    {/* <td>{item.email || '-'}</td> */}
                    <td>
                      <small>
                        {item.permissions?.length > 0
                          ? `${item.permissions.length} permissions`
                          : "No permissions"}
                      </small>
                    </td>
                    <td>
                      <span
                        className={
                          item.active === 1
                            ? "text-success fw-bold"
                            : "text-danger fw-bold"
                        }
                      >
                        {item.active === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          size="sm"
                          className="btn btn-info btn-sm"
                          //  onClick={() => handleEdit(item)}>
                          onClick={() =>
                            navigate(`/update-sub_admin/${item._id}`)
                          }
                        >
                          Edit
                        </button>

                        {/* <Button
                      size="sm"
                      className={item.activated === 1 ? "btn btn-warning ms-1" : "btn btn-success ms-1"}
                      onClick={() => handleStatusChange(item)}
                    >
                      {item.activated === 1 ? "Deactivate" : "Activate"}
                    </Button> */}

                        <button
                          onClick={() => handleStatusChange(item)}
                          className={
                            item.active === 1
                              ? "btn btn-success btn-sm"
                              : "btn btn-danger btn-sm"
                          }
                        >
                          {item.active === 1 ? "Active" : "Inactive"}
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            navigate(`/sub_admin-permission-list/${item._id}`)
                          }
                        >
                          Permissions
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default SubAdminPage;
