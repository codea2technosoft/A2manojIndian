import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { getSingleSubAdmin, updateSubAdminPermissions } from "../../Server/api";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const PermissionPage = () => {
  const { id } = useParams();
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const PERMISSION_GROUPS = {
    Dashboard: [{ key: "dashboard", label: "Dashboard" }],

    "User Management": [
      { key: "users-list", label: "All Users" },
      { key: "active-users-list", label: "Active Users" },
      { key: "inactive-users-list", label: "Inactive Users" },
      { key: "blocked-users-list", label: "Blocked Users" },
    ],

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
      { key: "fancy_result", label: "Fancy Result" },
      { key: "declare_result", label: "Declare Result" },
      { key: "/fancy-result-list", label: "Fancy Result List" },
    ],

    // "Transaction Management": [
    //   { key: "deposite_pending", label: "Deposit Pending" },
    //   { key: "deposite_complete", label: "Deposit Complete" },
    //   { key: "deposite_reject", label: "Deposit Reject" },
    //   { key: "deposite_report_datewise", label: " DateWise Deposit List" },
    //   { key: "withdrawal_pending_Approve", label: "Withdrawal PreApproved" },
    //   { key: "withdrawal_pending", label: "Withdrawal Pending" },
    //   { key: "withdrawal_complete", label: "Withdrawal Complete" },
    //   { key: "withdrawal_reject", label: "Withdrawal Reject" },
    //   { key: "withdrawal_report_datewise", label: "DateWise Withdrawal List" }
    // ],

    "Deposit Management": [
      { key: "deposite_pending", label: "Deposit Pending" },
      { key: "deposite_complete", label: "Deposit Complete" },
      { key: "deposite_reject", label: "Deposit Reject" },
      { key: "deposite_report_datewise", label: "DateWise Deposit List" },
    ],

    // ✅ NEW GROUP
    "Withdrawal Management": [
      { key: "withdrawal_PrApprove", label: "Withdrawal PreApproved" },
      { key: "withdrawal_pending", label: "Withdrawal Pending" },
      { key: "withdrawal_complete", label: "Withdrawal Complete" },
      { key: "withdrawal_reject", label: "Withdrawal Reject" },
      { key: "withdrawal_report_datewise", label: "DateWise Withdrawal List" },
    ],
    Settings: [
      { key: "general_setting", label: "Admin Setting" },
      { key: "gateway-setting", label: "Gateway Setting" },
      { key: "web-seting", label: "Web Setting" },
      { key: "slider", label: "Slider" },
    ],

    Reports: [
      { key: "bet_report", label: "Bet Report" },
      { key: "depositeList_report_datewise", label: "Deposit Report" },
      { key: "withdraw_report_datewise", label: "Withdraw Report" },
    ],

    Communication: [{ key: "adminchat", label: "Users Chat" }],
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getSingleSubAdmin(id);

      if (res.data.success) {
        const saved = res.data.data.permissions || [];
        const obj = {};

        // convert all keys to boolean
        Object.values(PERMISSION_GROUPS).forEach((group) => {
          group.forEach((permission) => {
            obj[permission.key] = saved.includes(permission.key);
          });
        });

        setPermissions(obj);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  // ====================================================
  //  Toggle Permission
  // ====================================================
  const handleToggle = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ====================================================
  //  Save Permissions (convert object → array)
  // ====================================================
  const handleSave = async () => {
    const selectedPermissions = Object.keys(permissions).filter(
      (key) => permissions[key],
    );

    const res = await updateSubAdminPermissions(id, {
      permissions: selectedPermissions,
    });

    if (res.data.success) {
      Swal.fire("Success", "Permissions updated successfully", "success");
    } else {
      Swal.fire("Error", "Failed to update permissions", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="card-title">Manage Permissions</h3>
          <Button variant="light" onClick={() => navigate(-1)}>
            <BsArrowLeft className="me-1" /> Back
          </Button>
        </Card.Header>

        <Card.Body>
          <Form>
            {Object.entries(PERMISSION_GROUPS).map(
              ([groupName, groupPermissions]) => (
                <div key={groupName} className="mb-4">
                  <h6 className="mb-2">{groupName}</h6>
                  <Row>
                    {groupPermissions.map((permission) => (
                      <Col md={6} lg={4} key={permission.key} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>{permission.label}</span>
                          <Form.Check
                            type="switch"
                            checked={permissions[permission.key] || false}
                            onChange={() => handleToggle(permission.key)}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <hr />
                </div>
              ),
            )}

            <Button variant="primary" onClick={handleSave}>
              Save Permissions
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </section>
  );
};

export default PermissionPage;
