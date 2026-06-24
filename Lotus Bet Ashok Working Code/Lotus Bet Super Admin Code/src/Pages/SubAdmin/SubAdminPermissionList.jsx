import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { getSingleSubAdmin, updateSubAdminPermissions } from "../../Server/api";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const PermissionPage = () => {
  const { id } = useParams();
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  // const PERMISSION_GROUPS = {
  //   "Dashboard": [
  //     { key: "homedashboard", label: "Home Dashboard" },
  //     { key: "dashboard", label: "Dashboard" }
  //   ],
  //   "User Management": [
  //     { key: "create_user", label: "Create User" },
  //     { key: "all_users", label: "All Users" }
  //   ],
  //   "Finance Management": [
  //     { key: "add_money", label: "Add Money" },
  //     { key: "withdraw_request", label: "Withdraw Request" }
  //   ],
  //   "Reports": [
  //     { key: "report", label: "Report" },
  //     { key: "transaction_history", label: "Transaction History" }
  //   ],
  //   "Voucher": [
  //     { key: "gift_vouchers", label: "Gift Vouchers" }
  //   ]
  // };
const PERMISSION_GROUPS = {
  "Dashboard": [
    { key: "homedashboard", label: "Home Dashboard" },
    { key: "dashboard", label: "Dashboard" }
  ],

  "User Management": [
    { key: "create_user", label: "Create User" },
    { key: "all_users", label: "All Users" },
    { key: "active_users", label: "Active Users" },
    { key: "inactive_users", label: "Inactive Users" },
    { key: "user_wallet", label: "User Wallet" },
    { key: "login_history", label: "Login History" }
  ],

  "Transaction Management": [
    { key: "withdrawal_pending", label: "Withdrawal Pending" },
    { key: "withdrawal_complete", label: "Withdrawal Complete" },
    { key: "withdrawal_reject", label: "Withdrawal Reject" },
    { key: "deposit_pending", label: "Deposit Pending" },
    { key: "deposit_complete", label: "Deposit Complete" },
    { key: "deposit_reject", label: "Deposit Reject" },
    { key: "withdrawal_approve", label: "Withdrawal Approve" }
  ],

  "Bet Management": [
    // { key: "bet_history_pending", label: "Bet History Pending" },
    // { key: "bet_history_success", label: "Bet History Success" },
    { key: "all_bets", label: "All Bets" },
    // { key: "user_bet_history", label: "User Bet History" }
  ],

  "Game Management": [
    { key: "sports_management", label: "Sports Management" },
    { key: "cricket_management", label: "Cricket Management" },
    { key: "event_management", label: "Event Management" },
    { key: "fancy_management", label: "Fancy Management" }
  ],

  "Result Declaration": [
    { key: "declare_main", label: "Declare Main Market" },
    // { key: "declare_king_jack", label: "Declare King Jack" }
  ],

  // "Reports & Analytics": [
  //   { key: "withdrawal_reports", label: "Withdrawal Reports" },
  //   { key: "deposit_reports", label: "Deposit Reports" },
  //   { key: "game_reports", label: "Game Reports" },
  //   { key: "ledger", label: "Ledger" }
  // ],

  "Settings & Configuration": [
    { key: "app_settings", label: "App Settings" },
    // { key: "color_settings", label: "Color Settings" },
    // { key: "video_management", label: "Video Management" },
    { key: "slider_management", label: "Slider Management" },
    // { key: "notification_management", label: "Notification Management" },
    // { key: "idea_management", label: "Idea Management" }
  ],

  // "Admin Management": [
  //   { key: "subadmin_management", label: "Sub Admin Management" },
  //   { key: "subadmin_permissions", label: "Sub Admin Permissions" }
  // ]
};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getSingleSubAdmin(id);

      if (res.data.success) {
        const saved = res.data.data.permissions || [];
        const obj = {};

        // convert all keys to boolean
        Object.values(PERMISSION_GROUPS).forEach(group => {
          group.forEach(permission => {
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
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ====================================================
  //  Save Permissions (convert object → array)
  // ====================================================
  const handleSave = async () => {
    const selectedPermissions = Object.keys(permissions).filter(
      (key) => permissions[key]
    );

    const res = await updateSubAdminPermissions(id, {
      permissions: selectedPermissions
    });

    if (res.data.success) {
      Swal.fire("Success", "Permissions updated successfully", "success");
    } else {
      Swal.fire("Error", "Failed to update permissions", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="permission-page p-3">
      <Card>
        <Card.Header>
          <h5>Manage Permissions</h5>
        </Card.Header>

        <Card.Body>
          <Form>
            {Object.entries(PERMISSION_GROUPS).map(([groupName, groupPermissions]) => (
              <div key={groupName} className="mb-4">
                <h6 className="mb-2">{groupName}</h6>
                <Row>
                  {groupPermissions.map(permission => (
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
            ))}

            <Button variant="primary" onClick={handleSave}>
              Save Permissions
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PermissionPage;
