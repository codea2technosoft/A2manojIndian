import React, { useEffect, useRef, useState } from "react";
import {
  Spin,
  Table,
  Space,
  Switch,
  Row,
  InputNumber,
  Button,
  div,
  Col,
  Card,
  Typography,
} from "antd";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import _ from "lodash";
import PageTitle from "components/PageTitle";
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
import api from "utils/api";

const { Title } = Typography;
const PayoutSettingUser = () => {
  const [titles, setTitles] = useState([{ path: "", title: "Users" }]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [payingoverview, setpayingoverview] = useState();
  const [payoutoverview, setpayoutoverview] = useState();
  const [payintransaction, setpayintransaction] = useState();
  const [payouttransaction, setpayouttransaction] = useState();
  const [partnerslist, setpartnerslist] = useState();
  const [widthdrawshow, setwidthdrawshow] = useState();
  const [widthdrawshow1, setwidthdrawshow1] = useState();
  const [widthdrawshow2, setwidthdrawshow2] = useState();
  const [reports, setreports] = useState();
  const [api_pay_permission, setapi_pay_permission] = useState();
  const [dashboard, setdashboard] = useState();
  const [ledger, setledger] = useState();
  const [wallet_topup, setwallet_topup] = useState();
  const [add_benificially, setadd_benificially] = useState();
  const [fund_transfer, setfund_transfer] = useState();
  const [payout_all_permission, setpayoutallpermission] = useState();

  const segment = window.location.pathname.split("/");
  const partnerId = segment[2];

  useEffect(() => {
    fetchManagerList();
  }, []);
  const fetchManagerList = async () => {
    setIsTableLoading(true);
    try {
      const response = await api.post(
        "/admin/payout_permission_management/loding-data-partner-payout-data",
        {
          user_id: partnerId,
        }
      );

      console.warn(response.data.records);
      console.warn(response.data.records);
      var obj = response.data.records;

      setpayoutallpermission(obj.payout_all_permission);
      setwidthdrawshow(obj.fund_transfer);
      setreports(obj.reports);
      setapi_pay_permission(obj.Api_pay_permission);
      setdashboard(obj.dashboard);
      setledger(obj.ledger);
      setwallet_topup(obj.wallet_topup);
      setwidthdrawshow1(obj.instant_transfer);
      setwidthdrawshow2(obj.bulk_transfer);
      setadd_benificially(obj.add_benificially);
      // console.warn("ppppp");
    } catch (error) {
      console.error("Error fetching manager list:", error);
    }
    setIsTableLoading(false);
  };
  const handleMerchantToggle = async (checked, type, title) => {
    if (type == "payout_all_permission") {
      var type = "payout_all_permission";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "1") {
      var type = "dashbaord";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "2") {
      var type = "add_benificially";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "3") {
      var type = "reports";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "4") {
      var type = "wallet_topup";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "5") {
      var type = "ledger";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "6") {
      var type = "Api_pay_permission";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "7") {
      var type = "fund_transfer";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "8") {
      var type = "instant_transfer";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "9") {
      var type = "bulk_transfer";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    }

    try {
      const response = await api.post(
        "/admin/payout_permission_management/admin-partner-payout-permission-set",
        {
          type: type,
          // payout_all_permission: payout_all_permission,
          status: status,
          user_id: partnerId,
          // instant_transfer: instant_transfer,
          // bulk_transfer: bulk_transfer,
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
          {/* <PageTitle titles={titles} /> */}
          <Card className="small_card">
            <div className="d-flex align-items-center">
              <Title level={3} className="mb-0 mr-8 main-title">
                All Permission
              </Title>
              {/* <Switch style={{ marginLeft: "10px" }}
                        onChange={event => handleMerchantToggle(event, 'all', 'all_permission')}
                    /> */}
              {payout_all_permission == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle(
                      event,
                      "payout_all_permission",
                      "payout_all_permission1"
                    )
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle(
                      event,
                      "payout_all_permission",
                      "payout_all_permission1"
                    )
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
            className="bg3 display border-radiussec"
          >
            <Title level={3} className="mb-0">
              Dashboard
            </Title>
            {dashboard == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle(event, "1", "dashboard")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle(event, "1", "dashboard")
                }
              />
            )}
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            style={{ padding: "3px" }}
            className="border-radiusthird bg3"
          >
            <Title level={4} className="mb-0">
              Add Beneficiary
            </Title>
            {add_benificially == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle(event, "2", "add_benificially")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle(event, "2", "add_benificially")
                }
              />
            )}
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
            className="border-radiussec display bg1"
          >
            <Title level={3} className="mb-0">
              Fund Transfer
            </Title>
            {widthdrawshow == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle(event, "7", "fund_transfer")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle(event, "7", "fund_transfer")
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
            className="border-radiusthird bg3"
          >
            <Row>
              <Col xs={20} sm={20} md={12} lg={12}>
                <Title level={5}>Instant Transfer</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {widthdrawshow1 == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle(event, "8", "instant_transfer")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle(event, "8", "instant_transfer")
                    }
                  />
                )}
              </Col>

              <Col xs={20} sm={20} md={12} lg={12}>
                <Title level={5}>Bulk Transfer</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {widthdrawshow2 == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle(event, "9", "bulk_transfer")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle(event, "9", "bulk_transfer")
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
            className="border-radiussec display bg4"
          >
            <Title level={3} className="mb-0">
              Reports
            </Title>
            {reports == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle(event, "3", "reports")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle(event, "3", "reports")
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
                <Title level={3}>Wallet Topup</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {wallet_topup == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle(event, "4", "wallet_topup")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle(event, "4", "wallet_topup")
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
            className="border-radiussec display bg4"
          >
            <Title level={3} className="mb-0">
              Ledger
            </Title>
            {ledger == "true" ? (
              <Switch
                checked="true"
                onChange={(event) => handleMerchantToggle(event, "5", "ledger")}
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) => handleMerchantToggle(event, "5", "ledger")}
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
                <Title level={3}>Api Pay Permission</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {api_pay_permission == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle(event, "6", "api_pay_permission")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle(event, "6", "api_pay_permission")
                    }
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PayoutSettingUser;
