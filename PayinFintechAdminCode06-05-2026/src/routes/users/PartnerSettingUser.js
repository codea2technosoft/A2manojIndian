import React, { useEffect, useRef, useState } from "react";
import {
  Spin,
  Card,
  Space,
  Switch,
  Row,
  InputNumber,
  Button,
  Col,
  Input,
  Typography,
} from "antd";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import _ from "lodash";
import PageTitle from "components/PageTitle";
import api from "utils/api";

import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
// request
import {
  getUsersOfPartner,
  updateUserOfPartner,
  onboardUsersOfPartner,
  getPartner,
} from "requests/user";
import { toast } from "react-toast";
import { formatCurrency } from "utils/common";

const segment = window.location.pathname.split("/");
const partnerId = segment[2];

const { Title } = Typography;
const PartnerSettingUser = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [titles, setTitles] = useState([{ path: "", title: "Users" }]);
  const [widthdrawshow, setwidthdrawshow] = useState();
  const [widthdrawshow1, setwidthdrawshow1] = useState();
  const [widthdrawshow2, setwidthdrawshow2] = useState();
  const [transaction, settransaction] = useState();
  const [alltransaction, setalltransaction] = useState();
  const [pendingalltransaction, setpendingtrnasction] = useState();
  const [settlement, setsettlement] = useState();
  const [paymentlink, setpaymentlink] = useState();
  const [setting, setsetting] = useState();
  const [all_permission, setall_permission] = useState();

  useEffect(() => {
    fetchManagerList();
  }, []);
  const fetchManagerList = async () => {
    setIsTableLoading(true);
    try {
      const response = await api.get(
        "/admin/permission_management/loding-data-partner",
        {
          params: {
            user_id: partnerId,
          },
        }
      );
      // fetchManagerList();
      // console.warn(response.data.records);
      var obj = response.data.records;
      setwidthdrawshow(obj.widthdraw);
      setwidthdrawshow1(obj.transfer_to_payout);
      setwidthdrawshow2(obj.transfer_to_bank);
      settransaction(obj.transaction);
      setalltransaction(obj.all_transaction);
      setpendingtrnasction(obj.pending_trnasction);
      setsettlement(obj.settlement);
      setpaymentlink(obj.payment_link);
      setsetting(obj.setting);
      setall_permission(obj.all_permission);
      // console.warn("ppppp");
    } catch (error) {
      console.error("Error fetching manager list:", error);
    }
    setIsTableLoading(false);
  };

  const handleMerchantToggle = async (checked, type, title) => {
    if (type == "all") {
      var type = "all";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "2") {
      var type = 2;
      if (title == "Settlement") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
        }
      }
      if (title == "transfer_to_payout") {
        var all_permission = "true";
        if (checked == true) {
          var status = "true";
          var transfer_to_payout = "true";
          if (widthdrawshow2 == "true") {
            var transfer_to_bank = "true";
          } else {
            var transfer_to_bank = "false";
          }
        } else {
          var transfer_to_payout = "false";
          if (widthdrawshow2 == "true") {
            var transfer_to_bank = "true";
            var status = "true";
          } else {
            var transfer_to_bank = "false";
            var status = "false";
          }
        }
      }
      if (title == "transfer_to_bank") {
        if (checked == true) {
          var status = "true";
          var transfer_to_bank = "true";
          if (widthdrawshow1 == "true") {
            var transfer_to_payout = "true";
          } else {
            var transfer_to_payout = "false";
          }
        } else {
          var transfer_to_bank = "false";
          if (widthdrawshow1 == "true") {
            var transfer_to_payout = "true";
            var status = "true";
          } else {
            var transfer_to_payout = "false";
            var status = "false";
          }
        }
      }
    }

    try {
      const response = await api.post(
        "/admin/permission_management/admin-partner-payin-permission-set",
        {
          type,
          all_permission: all_permission,
          status: status,
          user_id: partnerId,
          transfer_to_bank: transfer_to_bank,
          transfer_to_payout: transfer_to_payout,
        }
      );
      fetchManagerList();
      var obj = response.data.records;

      try {
        setIsTableLoading(true);
      } catch (err) {
        console.log(err);
      } finally {
        setIsTableLoading(false);
      }
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle1 = async (checked, type, title) => {
    if (type == "all") {
      var type = "all";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "1") {
      var type = 1;
      if (title == "transaction") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
        }
      }
      if (title == "all_transaction") {
        var all_permission = "true";
        if (checked == true) {
          var status = "true";
          var all_transaction = "true";
          if (alltransaction == "true") {
            var pending_trnasction = "true";
          } else {
            var pending_trnasction = "false";
          }
        } else {
          var all_transaction = "false";
          if (alltransaction == "true") {
            var pending_trnasction = "true";
            var status = "true";
          } else {
            var pending_trnasction = "false";
            var status = "false";
          }
        }
      }
      if (title == "pending_trnasction") {
        if (checked == true) {
          var status = "true";
          var pending_trnasction = "true";
          if (pendingalltransaction == "true") {
            var all_transaction = "true";
          } else {
            var all_transaction = "false";
          }
        } else {
          var pending_trnasction = "false";
          if (pendingalltransaction == "true") {
            var all_transaction = "true";
            var status = "true";
          } else {
            var all_transaction = "false";
            var status = "false";
          }
        }
      }
    }

    try {
      const response = await api.post(
        "/admin/permission_management/admin-partner-payin-permission-set",
        {
          type,
          all_permission: all_permission,
          status: status,
          user_id: partnerId,
          pending_trnasction: pending_trnasction,
          all_transaction: all_transaction,
        }
      );
      fetchManagerList();
      var obj = response.data.records;

      try {
        setIsTableLoading(true);
      } catch (err) {
        console.log(err);
      } finally {
        setIsTableLoading(false);
      }
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle2 = async (checked, type, title) => {
    if (type == "all") {
      var type = "all";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "3") {
      var all_permission = "true";
      var type = 3;
      if (title == "settlement") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
        }
      }
    }

    try {
      const response = await api.post(
        "/admin/permission_management/admin-partner-payin-permission-set",
        {
          type,
          all_permission: all_permission,
          status: status,
          user_id: partnerId,
          settlement: settlement,
          payment_link: paymentlink,
        }
      );
      fetchManagerList();
      var obj = response.data.records;

      try {
        setIsTableLoading(true);
      } catch (err) {
        console.log(err);
      } finally {
        setIsTableLoading(false);
      }
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle3 = async (checked, type, title) => {
    if (type == "all") {
      var type = "all";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "4") {
      var all_permission = "true";
      var type = 4;
      if (title == "payment_link") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
        }
      }
    }

    try {
      const response = await api.post(
        "/admin/permission_management/admin-partner-payin-permission-set",
        {
          type,
          all_permission: all_permission,
          status: status,
          user_id: partnerId,
          payment_link: paymentlink,
          setting: setting,
        }
      );
      fetchManagerList();
      var obj = response.data.records;

      try {
        setIsTableLoading(true);
      } catch (err) {
        console.log(err);
      } finally {
        setIsTableLoading(false);
      }
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle4 = async (checked, type, title) => {
    if (type == "all") {
      var type = "all";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "5") {
      var all_permission = "true";
      var type = 5;
      if (title == "setting") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
        }
      }
    }

    try {
      const response = await api.post(
        "/admin/permission_management/admin-partner-payin-permission-set",
        {
          type,
          all_permission: all_permission,
          status: status,
          user_id: partnerId,
          setting: setting,
        }
      );
      fetchManagerList();
      var obj = response.data.records;

      try {
        setIsTableLoading(true);
      } catch (err) {
        console.log(err);
      } finally {
        setIsTableLoading(false);
      }
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };

  return (
    <div className="wallet partner-user-setting">
      <div className="overviewBorder">
        <Row justify="space-between" align="middle">
          {/* <Card className="small_card">
          <PageTitle titles={titles} />
        </Card> */}
          <Card className="small_card">
            <div className="d-flex align-items-center">
              <Title level={3} className="mb-0 mr-8 main-title">
                All Permission
              </Title>
              {all_permission == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle(event, "all", "all_permission")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle(event, "all", "all_permission")
                  }
                />
              )}
            </div>
          </Card>
          <Card className="small_card">
            <Link to="/payin-payout-permission">
              <Button type="primary" size="large">
                <span style={{ marginRight: "7px", fontSize: "18px" }}>
                  &larr;
                </span>{" "}
                Back
              </Button>
            </Link>
          </Card>
        </Row>
      </div>
      <div className="ant-modal-content">
        <Row>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            style={{ padding: "15px" }}
            className="border-radiussec display bg1"
          >
            <Title level={3} className="mb-0">
              Settlement
            </Title>
            {widthdrawshow == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle(event, "2", "Settlement")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle(event, "2", "Settlement")
                }
              />
            )}
          </Col>

          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            style={{ padding: "15px" }}
            className="border-radiusthird bg2"
          >
            <Row>
              <Col xs={20} sm={20} md={12} lg={12}>
                <Title level={5}>Transfer to Payout</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {widthdrawshow1 == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event1) =>
                      handleMerchantToggle(event1, "2", "transfer_to_payout")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event1) =>
                      handleMerchantToggle(event1, "2", "transfer_to_payout")
                    }
                  />
                )}
              </Col>

              <Col xs={20} sm={20} md={12} lg={12}>
                <Title level={5}>Transfer to Bank</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {widthdrawshow2 == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event2) =>
                      handleMerchantToggle(event2, "2", "transfer_to_bank")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event2) =>
                      handleMerchantToggle(event2, "2", "transfer_to_bank")
                    }
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="ant-modal-content">
        <Row>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            style={{ padding: "15px" }}
            className="border-radiussec display bg3"
          >
            <Title level={3} className="mb-0">
              Transaction
            </Title>
            {transaction == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle1(event, "1", "transaction")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle1(event, "1", "transaction")
                }
              />
            )}
          </Col>

          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            style={{ padding: "15px" }}
            className="border-radiusthird bg4"
          >
            <Row>
              <Col xs={20} sm={20} md={12} lg={12}>
                <Title level={5}>All Transaction</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {alltransaction == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle1(event, "1", "all_transaction")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle1(event, "1", "all_transaction")
                    }
                  />
                )}
              </Col>

              <Col xs={20} sm={20} md={12} lg={12}>
                <Title level={5}>Pending Transaction</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {pendingalltransaction == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle1(event, "1", "all_transaction")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle1(event, "1", "all_transaction")
                    }
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <div className="ant-modal-content">
        <Row>
          {/* <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiussec display bg1"
          >
            <Title level={3} className="mb-0">
              Settlement
            </Title>
            {settlement == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle2(event, "3", "settlement")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle2(event, "3", "settlement")
                }
              />
            )}

          </Col> */}

          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            style={{ padding: "20px" }}
            className="border-radiussec display bg4"
          >
            <Title level={3} className="mb-0">
              Payment Link
            </Title>
            {paymentlink == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle3(event, "4", "payment_link")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle3(event, "4", "payment_link")
                }
              />
            )}
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            style={{ padding: "20px" }}
            className="border-radiusthird display bg3"
          >
            <Title level={3} className="mb-0">
              Setting
            </Title>
            {setting == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle4(event, "5", "setting")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle4(event, "5", "setting")
                }
              />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PartnerSettingUser;
