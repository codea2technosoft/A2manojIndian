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
  const [pendingtransactions, setpendingtransactions] = useState();
  const [pay_api_permission, setpay_api_permission] = useState();
  const [transaction, settransaction] = useState();
  const [paymentLink, setpaymentLink] = useState();
  const [dashbaord, setdashboard] = useState();
  const [all_permission, setall_permission] = useState();

  const segment = window.location.pathname.split("/");
  const partnerId = segment[2];

  useEffect(() => {
    fetchManagerList();
  }, []);
  const fetchManagerList = async () => {
    setIsTableLoading(true);
    try {
      const response = await api.post(
        "/admin/payout_permission_management/loding-data-partner-payin-data",
        {
          user_id: partnerId,
        }
      );

      console.warn(response.data.records);
      console.warn(response.data.records);
      var obj = response.data.records;

      setall_permission(obj.all_permission);
      setdashboard(obj.dashboard);
      setpaymentLink(obj.payment_link);
      settransaction(obj.transaction);
      setpay_api_permission(obj.pay_api_permission);
      // setsuccesstransaction(obj.success_transactions);
      setwidthdrawshow1(obj.instant_transfer);
      setwidthdrawshow2(obj.bulk_transfer);
      // setadd_benificially(obj.add_benificially);
      // console.warn("ppppp");
    } catch (error) {
      console.error("Error fetching manager list:", error);
    }
    setIsTableLoading(false);
  };
  const handleMerchantToggle = async (checked, type, title) => {
    // alert(type);
    if (type == "payin_all_permission") {
      var type = "payin_all_permission";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "1") {
      var type = "dashboard";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "2") {
      var type = "payment_link";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "3") {
      var type = "transaction";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "4") {
      var type = "pay_api_permission";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    }
    // alert(type);
    try {
      const response = await api.post(
        "/admin/payout_permission_management/admin-partner-payin-permission-set",
        {
          type: type,
          status: status,
          user_id: partnerId,
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
              {all_permission == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle(
                      event,
                      "payin_all_permission",
                      "payin_all_permission1"
                    )
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle(
                      event,
                      "payin_all_permission",
                      "payin_all_permission1"
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
            className="border-radiussec display bg1"
          >
            <Title level={3} className="mb-0">
              DashBoard
            </Title>
            {dashbaord == "true" ? (
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
            style={{ padding: "15px" }}
            className="border-radiusthird bg3"
          >
            <Row>
              <Col xs={20} sm={20} md={12} lg={12}>
                <Title level={5}>Payment Link</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {paymentLink == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle(event, "2", "payment_link")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle(event, "2", "payment_link")
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
              Transaction
            </Title>
            {transaction == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle(event, "3", "transaction")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle(event, "3", "transaction")
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
                <Title level={5}>Api Pay Permission</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {pay_api_permission == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle(event, "4", "pay_api_permission")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle(event, "4", "pay_api_permission")
                    }
                  />
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      {/* <div className="ant-modal-content">
        <Row>
          <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            style={{ padding: "20px" }}
            className="bg3 display border-radiussec"
          >
            <Title level={3} className="mb-0">
              Add Beneficiary
            </Title>
            {add_benificially == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle4(event, "1", "add_benificially")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle4(event, "1", "add_benificially")
                }
              />
            )}
          </Col>
        </Row>
      </div> */}
    </div>
  );
};

export default PayoutSettingUser;
