import React, { useState } from "react";
import Swal from "sweetalert2";
import { Button, Form, Row, Col } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { createSubAdmin } from "../../Server/api";

const CreateSubAdmin = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    permissions: []
  });

  // ✅ SAME CONFIG (match SubAdminPage)
  const PERMISSION_GROUPS = {
    "Dashboard": [{ key: "dashboard", label: "Dashboard" }],

    "User Management": [
      { key: "users-list", label: "All Users" },
      { key: "active-users-list", label: "Active Users" },
      { key: "inactive-users-list", label: "Inactive Users" },
      { key: "blocked-users-list", label: "Blocked Users" }
    ],

    "Sport Betting": [
      { key: "inplaygame", label: "In Play Game" },
      { key: "Usertransaction", label: "Completed Game" },
      { key: "Bethistory", label: "Fancy Bets Pending" },
      { key: "Allmatchhistory", label: "All Match Pending" },
      { key: "SettledBethistory", label: "Settled Bets" }
    ],

    "Account Management": [
      { key: "bank_account_pending", label: "Pending Accounts" },
      { key: "bank_account_complete", label: "Completed Accounts" },
      { key: "bank_account_reject", label: "Rejected Accounts" }
    ],

    "Game Management": [
      { key: "sports_management", label: "Sports" },
      { key: "cricket_management", label: "Cricket" },
      { key: "active_events", label: "Active Events" },
      { key: "inactive_events", label: "Inactive Events" },
      { key: "complete_events", label: "Complete Events" },
      { key: "fancy_management_view", label: "Fancy Result" },
      { key: "declare_result", label: "Declare Result" },
      { key: "/fancy-result-list", label: "Fancy Result List" }
    ],

    "Transaction Management": [
      { key: "deposite_pending", label: "Deposit Pending" },
      { key: "deposite_complete", label: "Deposit Complete" },
      { key: "deposite_reject", label: "Deposit Reject" },
      { key: "withdrawal_pending_Approve", label: "Withdrawal PreApproved" },
      { key: "withdrawal_pending", label: "Withdrawal Pending" },
      { key: "withdrawal_complete", label: "Withdrawal Complete" },
      { key: "withdrawal_reject", label: "Withdrawal Reject" }
    ],

    "Settings": [
      { key: "general_setting", label: "Admin Setting" },
      { key: "gateway-setting", label: "Gateway Setting" },
      { key: "web-seting", label: "Web Setting" },
      { key: "slider", label: "Slider" }
    ],

    "Communication": [
      { key: "adminchat", label: "Users Chat" }
    ],
    "Reports": [
  { key: "bet_report", label: "Bet Report" },
  { key: "depositeList_report_datewise", label: "Deposit Report" },
  { key: "withdraw_report_datewise", label: "Withdraw Report" }
],
  };

  // ✅ INPUT HANDLE
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  // ✅ SINGLE PERMISSION
  const togglePermission = (permissionKey) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  // ✅ GROUP SELECT (same as SubAdminPage)
  const toggleGroupPermissions = (groupPermissions) => {
    const groupKeys = groupPermissions.map(p => p.key);
    const allSelected = groupKeys.every(key =>
      formData.permissions.includes(key)
    );

    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !groupKeys.includes(p))
        : [...new Set([...prev.permissions, ...groupKeys])]
    }));
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (!formData.name || !formData.mobile) {
      Swal.fire("Error", "Please fill all fields", "error");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      Swal.fire("Error", "Invalid mobile number", "error");
      return;
    }

    if (formData.permissions.length === 0) {
      Swal.fire("Error", "Select at least one permission", "error");
      return;
    }

    try {
      const apiData = {
        name: formData.name,
        mobile: formData.mobile,
        // email: formData.email,
        permissions: formData.permissions
      };

      if (formData.password?.trim()) {
        apiData.password = formData.password;
      }

      console.log("CREATE DATA:", apiData);

      const res = await createSubAdmin(apiData);

      if (res.data.success) {
        Swal.fire("Success", res.data.message, "success");

        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          permissions: []
        });

        navigate("/sub_admin");
      } else {
        Swal.fire("Error", res.data.message, "error");
      }

    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Server Error", "error");
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card">

          {/* HEADER */}
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="card-title">Create Sub Admin</h3>
            <Button variant="light" onClick={() => navigate(-1)}>
              <BsArrowLeft /> Back
            </Button>
          </div>

          {/* BODY */}
          <div className="card-body">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      maxLength="10"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* PERMISSIONS */}
              <div className="mb-4">
                <Form.Label className="fw-bold">Permissions</Form.Label>

                {Object.entries(PERMISSION_GROUPS).map(([groupName, permissions]) => {
                  const groupKeys = permissions.map(p => p.key);
                  const allSelected = groupKeys.every(key => formData.permissions.includes(key));

                  return (
                    <div key={groupName} className="border p-3 mb-3 rounded">
                      <div className="d-flex justify-content-between">
                        <h6>{groupName}</h6>
                        <Form.Check
                          type="checkbox"
                          label="Select All"
                          checked={allSelected}
                          onChange={() => toggleGroupPermissions(permissions)}
                        />
                      </div>

                      <Row>
                        {permissions.map(p => (
                          <Col md={4} key={p.key}>
                            <Form.Check
                              type="checkbox"
                              label={p.label}
                              checked={formData.permissions.includes(p.key)}
                              onChange={() => togglePermission(p.key)}
                            />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  );
                })}
              </div>

              <div className="text-end">
                <Button type="submit" className="btn btn-success">
                  Create
                </Button>
              </div>

            </Form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateSubAdmin;