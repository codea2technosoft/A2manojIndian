import React, { useEffect, useRef, useState } from "react";
import {
  Spin,
  Table,
  Space,
  Switch,
  Row,
  InputNumber,
  Button,
  Card,
  Col,
  Input,
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
const url = new URL(window.location.href);
const partnerId = url.searchParams.get("partnerid");

const { Title } = Typography;
const ManagerSettingUser = () => {
  const [titles, setTitles] = useState([{ path: "", title: "Users" }]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [payingoverview, setpayingoverview] = useState();
  const [payoutoverview, setpayoutoverview] = useState();
  const [payintransaction, setpayintransaction] = useState();
  const [payouttransaction, setpayouttransaction] = useState();
  const [partnerslist, setpartnerslist] = useState();
  const [services, setservices] = useState();
  const [merchantdetails, setmerchantdetails] = useState();
  const [partnerpayoutsetting, setpartnerpayoutsetting] = useState();
  const [benificially, setbenificially] = useState();
  const [manualsettlement, setmanualsettlement] = useState();
  const [chargebacktransaction, setchargebacktransaction] = useState();
  const [all_manager_permission, setall_permission] = useState();
  const [isTableLoading, setIsTableLoading] = useState(true);

  const url = new URL(window.location.href);
  const partnerId = url.searchParams.get("partnerid");
  // alert(partnerId)
  // console.warn(partnerId);
  useEffect(() => {
    fetchManagerList();
  }, []);
  const fetchManagerList = async () => {
    setIsTableLoading(true);
    try {
      const response = await api.get(
        "/admin/manager_permission_management/loding-data-manager",
        {
          params: {
            user_id: partnerId,
          },
        }
      );

      // fetchManagerList();
      // console.warn(response.data.records);
      var obj = response.data.records;

      console.warn(obj);
      setpayingoverview(obj.paying_overview);
      setpayoutoverview(obj.payout_overview);
      setpayintransaction(obj.payin_transaction);
      setpayouttransaction(obj.payout_transaction);
      setpartnerslist(obj.partners_list);
      setservices(obj.services);
      setmerchantdetails(obj.merchant_details);
      setpartnerpayoutsetting(obj.partner_payout_setting);
      setbenificially(obj.benificially);
      setmanualsettlement(obj.manual_settlement);
      setchargebacktransaction(obj.chargeback_transaction);
      setall_permission(obj.all_manager_permission);
      // console.warn(obj.all_manager_permission)

      // console.warn("ppppp");
    } catch (error) {
      console.error("Error fetching manager list:", error);
    }
    setIsTableLoading(false);
  };

  const handleMerchantToggle = async (checked, type, title) => {
    if (type == "all_manager") {
      var all_manager_permission = "true";
      var type = "all_manager";
      if (title == "all_manager_permission") {
        if (title == true) {
          var status = "true";
        } else {
          var status = "false";
          var all_manager_permission = "false";
        }
      }
    } else if (type == "1") {
      var paying_overview = "true";
      var type = 1;
      if (title == "paying_overview") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var paying_overview = "false";
        }
      }
    }

    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          paying_overview: paying_overview,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle1 = async (checked, type, title) => {
    if (type == "2") {
      var payout_overview = "true";
      var type = 2;
      if (title == "payout_overview") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var payout_overview = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          payout_overview: payout_overview,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle2 = async (checked, type, title) => {
    if (type == "3") {
      var payin_transaction = "true";
      var type = 3;
      if (title == "payin_transaction") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var payin_transaction = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          payin_transaction: payin_transaction,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle3 = async (checked, type, title) => {
    if (type == "4") {
      var payout_transaction = "true";
      var type = 4;
      if (title == "payout_transaction") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var payout_transaction = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          payout_transaction: payout_transaction,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle4 = async (checked, type, title) => {
    if (type == "5") {
      var partners_list = "true";
      var type = 5;
      if (title == "partners_list") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var partners_list = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          partners_list: partners_list,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle5 = async (checked, type, title) => {
    if (type == "6") {
      var services = "true";
      var type = 6;
      if (title == "services") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var services = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          services: services,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle7 = async (checked, type, title) => {
    if (type == "7") {
      var merchant_details = "true";
      var type = 7;
      if (title == "merchant_details") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var merchant_details = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          merchant_details: merchant_details,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle8 = async (checked, type, title) => {
    if (type == "8") {
      var partner_payout_setting = "true";
      var type = 8;
      if (title == "partner_payout_setting") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var partner_payout_setting = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          partner_payout_setting: partner_payout_setting,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle9 = async (checked, type, title) => {
    if (type == "9") {
      var benificially = "true";
      var type = 9;
      if (title == "benificially") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var benificially = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          benificially: benificially,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle10 = async (checked, type, title) => {
    if (type == "10") {
      var manual_settlement = "true";
      var type = 10;
      if (title == "manual_settlement") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var manual_settlement = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          manual_settlement: manual_settlement,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggle11 = async (checked, type, title) => {
    if (type == "11") {
      var chargeback_transaction = "true";
      var type = 11;
      if (title == "chargeback_transaction") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var chargeback_transaction = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          chargeback_transaction: chargeback_transaction,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  const handleMerchantToggleall = async (checked, type, title) => {
    if (type == "12") {
      var all_manager_permission = "true";
      var type = 12;
      if (title == "all_manager_permission") {
        if (checked == true) {
          var status = "true";
        } else {
          var status = "false";
          var all_manager_permission = "false";
        }
      }
    }
    try {
      const response = await api.post(
        "/admin/manager_permission_management/admin-manager-payin-permission-set",
        {
          type,
          all_manager_permission: all_manager_permission,
          status: status,
          user_id: partnerId,
          all_manager_permission: all_manager_permission,
        }
      );
      fetchManagerList();
    } catch (error) {
      console.error("Error adding bank:", error);
    }
  };
  return (
    <div className="wallet partner-user-setting">
      <Row justify="space-between" align="middle">
        <Card className="small_card">
          <PageTitle titles={titles} />
        </Card>
        <Card className="small_card">
          <div className="d-flex align-items-center">
            <Title level={3} className="mb-0 mr-8 main-title">
              All Permission
            </Title>
            {/* <Switch style={{ marginLeft: "10px" }}
                        onChange={event => handleMerchantToggle(event, 'all', 'all_permission')}
                    /> */}
            {all_manager_permission == "true" ? (
              <Switch
                checked="true"
                onChange={(event) =>
                  handleMerchantToggleall(
                    event,
                    "12 ",
                    "all_manager_permission"
                  )
                }
              />
            ) : (
              <Switch
                checked=""
                onChange={(event) =>
                  handleMerchantToggleall(event, "12", "all_manager_permission")
                }
              />
            )}
          </div>
        </Card>
        {/* <TableBar
                    onSearch={onSearch}
                    showFilter={false}
                    placeholderInput="Search..."
                    inputRef={searchRef}
                /> */}

        {/* <Button
                    type='primary'
                    size='large'
                    disabled={!selectedRowKeys.length}
                    onClick={onOnboardingUsers}
                >
                    Onboarding
                </Button> */}
        <Card className="small_card">
          <Link to="/manager-setting">
            <Button
              type="primary"
              size="large"
            >
              <span style={{ marginRight: "7px", fontSize: "18px" }}>
                &larr;
              </span>{" "}
              Back
            </Button>
          </Link>
        </Card>
      </Row>

      <div className="ant-modal-content">
        <Row>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiussec display bg3"
          >
            <Title level={4} className="mb-0">
              Payin Overview
            </Title>
            <div className="switchbtn-sec">
              {payingoverview == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle(event, "1", "paying_overview")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle(event, "1", "paying_overview")
                  }
                />
              )}
            </div>
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border_right display bg2"
          >
            <Title level={4} className="mb-0">
              Payout Overview
            </Title>
            <div className="switchbtn-sec">
              {payoutoverview == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle1(event, "2", "payout_overview")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle1(event, "2", "payout_overview")
                  }
                />
              )}
            </div>
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiusthird display bg1"
          >
            <Title level={4} className="mb-0">
              Payin Transaction
            </Title>
            <div className="switchbtn-sec">
              {payintransaction == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle2(event, "3", "payin_transaction")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle2(event, "3", "payin_transaction")
                  }
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
      <div className="ant-modal-content">
        <Row>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiussec display bg4"
          >
            <Title level={4} className="mb-0">
              Payout Transaction
            </Title>
            <div className="switchbtn-sec">
              {payouttransaction == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle3(event, "4", "payout_transaction")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle3(event, "4", "payout_transaction")
                  }
                />
              )}
            </div>
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border_right display bg1"
          >
            <Title level={4} className="mb-0">
              Partners List
            </Title>
            <div className="switchbtn-sec">
              {partnerslist == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle4(event, "5", "partners_list")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle4(event, "5", "partners_list")
                  }
                />
              )}
              <br />
              <Link to={`/manager-setting-partners-lists`}>
                <Button className="btnmange" type="primary">
                  Manage
                </Button>
              </Link>
            </div>
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiusthird display bg2"
          >
            <Title level={4} className="mb-0">
              Services
            </Title>
            <div className="switchbtn-sec">
              {services == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle5(event, "6", "services")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle5(event, "6", "services")
                  }
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
      <div className="ant-modal-content">
        <Row>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiussec display bg1"
          >
            <Title level={4} className="mb-0">
              Merchant Details
            </Title>
            <div className="switchbtn-sec">
              {merchantdetails == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle7(event, "7", "merchant_details")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle7(event, "7", "merchant_details")
                  }
                />
              )}
              <br />
              <Link to={`/manager-setting-detail`}>
                <Button className="btnmange" type="primary">
                  Manage
                </Button>
              </Link>
            </div>
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border_right display bg2"
          >
            <Title level={4} className="mb-0">
              Partner Payout Setting
            </Title>
            <div className="switchbtn-sec">
              {partnerpayoutsetting == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle8(event, "8", "partner_payout_setting")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle8(event, "8", "partner_payout_setting")
                  }
                />
              )}
              <br />
              <Link to={`/partner-payout-setting`}>
                <Button className="btnmange" type="primary">
                  Manage
                </Button>
              </Link>
            </div>
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiusthird display bg3"
          >
            <Title level={4} className="mb-0">
              Beneficially
            </Title>
            <div className="switchbtn-sec">
              {benificially == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle9(event, "9", "benificially")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle9(event, "9", "benificially")
                  }
                />
              )}
              <br />
              <Link to={`/beneficially`}>
                <Button className="btnmange" type="primary">
                  Manage
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
      <div className="ant-modal-content">
        <Row>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiussec display bg2"
          >
            <Title level={4} className="mb-0">
              Manual Settlements
            </Title>
            <div className="switchbtn-sec">
              {manualsettlement == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle10(event, "10", "manual_settlement")
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle10(event, "10", "manual_settlement")
                  }
                />
              )}
              <br />
              <Link to={`/manual-settlements`}>
                <Button className="btnmange" type="primary">
                  Manage
                </Button>
              </Link>
            </div>
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border_right display bg4"
          >
            <Title level={4} className="mb-0">
              Chargeback Transactions
            </Title>
            <div className="switchbtn-sec">
              {chargebacktransaction == "true" ? (
                <Switch
                  checked="true"
                  onChange={(event) =>
                    handleMerchantToggle11(
                      event,
                      "11",
                      "chargeback_transaction"
                    )
                  }
                />
              ) : (
                <Switch
                  checked=""
                  onChange={(event) =>
                    handleMerchantToggle11(
                      event,
                      "11",
                      "chargeback_transaction"
                    )
                  }
                />
              )}
              <br />
              <Link to={`/chargeback-transactions`}>
                <Button className="btnmange" type="primary">
                  Manage
                </Button>
              </Link>
            </div>
          </Col>
          {/* <Col xs={20} sm={20} md={8} lg={8} style={{padding: "20px" }} className='border-radiusthird display bg3'>
                        <Title level={4} className='mb-0'>Beneficially</Title>
                        <Switch
                        />
                    </Col> */}
        </Row>
      </div>

      {/* <Spin spinning={isTableLoading}>
                <Table
                    style={{ marginTop: '10px' }}
                    // rowSelection={rowSelection}
                    dataSource={records}
                    columns={columns}
                    onChange={onChangeTable}
                    rowKey={'id'}
                    pagination={{
                        pageSize: perPage,
                        total: totalCount,
                        current: page,
                    }}
                    scroll={{
                        x: true
                    }}
                />
            </Spin> */}
    </div>
  );
};

export default ManagerSettingUser;
