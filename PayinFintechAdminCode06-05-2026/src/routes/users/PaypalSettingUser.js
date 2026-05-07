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
import { Link,  } from "react-router-dom";
import _ from "lodash";
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
  const [paymentLinkshow, setpaymentLinkshow] = useState();
  const [widthdrawshow1, setwidthdrawshow1] = useState();
  const [widthdrawshow2, setwidthdrawshow2] = useState();
  const [reports, setreports] = useState();
  const [pendingtransactions, setpendingtransactions] = useState();
  const [failedtransaction, setfailedtransaction] = useState();
  const [successtransaction, setsuccesstransaction] = useState();
  const [add_benificially, setadd_benificially] = useState();
  const [fund_transfer, setfund_transfer] = useState();
  const [payout_all_permission, setpayoutallpermission] = useState( );
  console.warn(payout_all_permission)

  const segment = window.location.pathname.split("/");
  const partnerId = segment[2];

  useEffect(() => {
    fetchManagerList();
  }, []);
  const fetchManagerList = async () => {
    setIsTableLoading(true);
    try {
      const response = await api.get(
        "/admin/payout_permission_management/admin-partner-paypal-permission-data/"+partnerId,
        
        // {
        //   user_id: partnerId,
        // }
      );

      console.warn(response.data.records);
      console.warn(response.data.records);
      var obj = response.data.records;

      // setpayoutallpermission(obj.all_permission);
      // // console.warn(obj.payout_all_permission)
      // setwidthdrawshow(obj.fund_transfer);
      // setreports(obj.reports);
      // setpendingtransactions(obj.pending_transactions);
      // setfailedtransaction(obj.failed_transactions);
      // setsuccesstransaction(obj.success_transactions);
      // setwidthdrawshow1(obj.instant_transfer);
      // setwidthdrawshow2(obj.bulk_transfer);
      // setadd_benificially(obj.add_benificially);



      setpayoutallpermission(obj.all_permission);
      // console.warn(obj.payout_all_permission)
      setwidthdrawshow(obj.paypal_transafer);
      setpaymentLinkshow(obj.payment_link);
      setreports(obj.reports);
      setpendingtransactions(obj.pending);
      setfailedtransaction(obj.falid);
      setsuccesstransaction(obj.success);   
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
    // alert('opopop');
    if (type == "payout_all_permission") {
      var type = "payout_all_permission";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "1") {
      var type = 1;
      // alert(title);
      if (title == "fund_transfer") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
        }
      }
      if (title == "instant_transfer") {
        var payout_all_permission = "true";
        if (checked == true) {
          console.warn(checked);
          var status = "true";
          var instant_transfer = "true";
          if (widthdrawshow1 == "true") {
            var bulk_transfer = "true";
          } else {
            var payout_all_permission = "false";
          }
        } else {
          console.warn(checked + "else");
          var instant_transfer = "false";
          if (widthdrawshow1 == "true") {
            var bulk_transfer = "true";
            var status = "true";
          } else {
            var bulk_transfer = "false";
            var status = "false";
          }
        }
      }
      if (title == "bulk_transfer") {
        if (checked == true) {
          var status = "true";
          var bulk_transfer = "true";
          if (widthdrawshow2 == "true") {
            var instant_transfer = "true";
          } else {
            var instant_transfer = "false";
          }
        } else {
          var bulk_transfer = "false";
          if (widthdrawshow2 == "true") {
            var instant_transfer = "true";
            var status = "true";
          } else {
            var instant_transfer = "false";
            var status = "false";
          }
        }
      }
    }

    try {
      const response = await api.post(
        // "/admin/payout_permission_management/admin-partner-payout-permission-set",
        "/admin/payout_permission_management/admin-partner-paypal-permission-set",
        
        {
          type,
          payout_all_permission: payout_all_permission,
          status: status,
          user_id: partnerId,
          instant_transfer: instant_transfer,
          bulk_transfer: bulk_transfer,
        }
      );
      fetchManagerList();
      var obj = response.data.records;
      var objjjjj = response.data.records.all_permission;
      setpayoutallpermission(objjjjj)

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
    // alert('opopop');
  
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
        }
    
    
    

    try {
      const response = await api.post(
        // "/admin/payout_permission_management/admin-partner-payout-permission-set",
        "/admin/payout_permission_management/admin-partner-paypal-permission-set",
        
        {
          type,
          status: status,
          user_id: partnerId,
        }
      );
      fetchManagerList();
      var obj = response.data.records;
      var objjjjj = response.data.records.all_permission;
      setpayoutallpermission(objjjjj)

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
    if (type == "payout_all_permission") {
      var type = "payout_all_permission";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "2") {
      var type = 2;
      if (title == "reports") {

        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
        }
      }
      if (title == "pending_transactions") {
        var payout_all_permission = "true";
        if (checked == true) {
          var status = "true";
          var pending_transactions = "true";
          if (pendingtransactions == "true") {
            // var failed_transactions = "true";
          } else {
            // var failed_transactions = "false";
          }
        } else {
          var pending_transactions = "false";
          if (pendingtransactions == "true") {
            // var failed_transactions = "true";
            var status = "true";
          } else {
            // var failed_transactions = "false";
            var status = "false";
          }
        }
      }
      if (title == "failed_transactions") {
        // alert(checked);
        if (checked == true) {
          var status = "true";
          var failed_transactions = "true";
          if (failed_transactions == "true") {
            // var pending_transactions = "true";
          } else {
            // var pending_transactions = "false";
          }
        } else {
          var failed_transactions = "false";
          if (failed_transactions == "true") {
            var pending_transactions = "true";
            var status = "true";
          } else {
            var pending_transactions = "false";
            var status = "false";
          }
        }
      }
      if (title == "success_transactions") {
        if (checked == true) {
          var status = "true";
          var success_transactions = "true";
          if (successtransaction == "true") {
            // var pending_transactions = "true";
          } else {
            // var pending_transactions = "false";
          }
        } else {
          var success_transactions = "false";
          if (successtransaction == "true") {
            // var pending_transactions = "true";
            var status = "true";
          } else {
            // var pending_transactions = "false";
            var status = "false";
          }
        }
      }
    }

    try {
      const response = await api.post(
        // "/admin/payout_permission_management/admin-partner-payout-permission-set",
        "/admin/payout_permission_management/admin-partner-paypal-permission-set",
        
        {
          type,
          payout_all_permission: payout_all_permission,
          status: status,
          user_id: partnerId,
          pending_transactions: pending_transactions,
          failed_transactions: failed_transactions,
          success_transactions: success_transactions,
          title:title,
        }
      );
      fetchManagerList();
      var obj = response.data.records;

      // var objjjjj = response.data.records.all_permission;
      // setpayoutallpermission(objjjjj)

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
    if (type == "payout_all_permission") {
      var type = "payout_all_permission";
      if (checked == true) {
        var status = "true";
      } else {
        var status = "false";
      }
    } else if (type == "1") {
      var add_benificially = "true";
      var type = 1;
      if (title == "add_benificially") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
        }
      }
    }

    try {
      const response = await api.post(
        // "/admin/payout_permission_management/admin-partner-payout-permission-set",
        "/admin/payout_permission_management/admin-partner-paypal-permission-set",
        {
          type,
          payout_all_permission: payout_all_permission,
          status: status,
          user_id: partnerId,
          add_benificially: add_benificially,
        }
      );
      fetchManagerList();
      var obj = response.data.records;

      //      var objjjjj = response.data.records.all_permission;
      // setpayoutallpermission(objjjjj)

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
            md={24}
            lg={24}
            style={{ padding: "15px" }}
            className="border-radiussec border-radiusthird display bgg1"
          >
            <Title level={3} className="mb-">
            Paypal Transfer
            </Title>
            {widthdrawshow == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle(event, "1", "fund_transfer")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle(event, "1", "fund_transfer")
                }
              />
            )}
          </Col>

          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{ padding: "15px" }}
            className="border-radiussec border-radiusthird1 display bg1"
          >
            <Title level={3} className="mb-0">
            Payment Link
            </Title>
            {paymentLinkshow == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle3(event, "3", "payment_link")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle3(event, "3", "payment_link")
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
            className="border-radiussec display bg4"
          >
            <Title level={3} className="mb-0">
              Reports
            </Title>
            {reports == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggle2(event, "2", "reports")
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggle2(event, "2", "reports")
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
                <Title level={5}>Pending Transaction</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {pendingtransactions == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle2(event, "2", "pending_transactions")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle2(event, "2", "pending_transactions")
                    }
                  />
                )}
              </Col>

              <Col xs={20} sm={20} md={12} lg={12}>
                <Title level={5}>Failed Transaction</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {failedtransaction == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle2(event, "2", "failed_transactions")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle2(event, "2", "failed_transactions")
                    }
                  />
                )}
              </Col>
              <Col xs={20} sm={20} md={12} lg={12}>
                <Title level={5}>Success Transaction</Title>
              </Col>

              <Col xs={4} sm={4} md={12} lg={12}>
                {successtransaction == "true" ? (
                  <Switch
                    checked="true"
                    onChange={(event) =>
                      handleMerchantToggle2(event, "2", "success_transactions")
                    }
                  />
                ) : (
                  <Switch
                    checked=""
                    onChange={(event) =>
                      handleMerchantToggle2(event, "2", "success_transactions")
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
