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
const ResellerSettingUser = () => {
  const [titles, setTitles] = useState([{ path: "", title: "Users" }]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(150);
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisibleCommission, setIsPopupVisibleCommission] =
    useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecordCommission, setSelectedRecordCommission] =
    useState(null);
  const [isMerchantEnabled, setIsMerchantEnabled] = useState(false);
  const [isSettlementEnabled, setIsSettlementEnabled] = useState(false);
  const [isServicesEnabled, setIsServicesEnabled] = useState(false);
  const [isPayoutEnabled, setIsPayoutEnabled] = useState(false);
  const [minpayouts, minpayout] = useState();
  const [maxpayouts, maxpayout] = useState();
  const [transactionpayouts, transactionpayout] = useState();
  const [reservedpayouts, reservedpayout] = useState();
  const [maximunpayout, maximunpayouts] = useState();
  const [minpayoutvalueshows, minpayoutvalueshow] = useState([]);
  const [maxpayoutvalueshows, maxpayoutvalueshow] = useState();
  const [maxpayoutamountvalue, maxpayoutamountvalueshow] = useState();
  const [transaction_fee_rate_payoutshows, transaction_fee_rate_payoutshow] =
    useState();
  const [revered_fee_rate_payoutshows, revered_fee_rate_payoutshow] =
    useState();
  const [searchKeyword, setSearchKeyword] = useState("");
  const handleMerchantToggle = async (checked) => {
    try {
      const response = await api.post(
        "/dashbaord-payout-permission-set-manager",
        {
          type: "1",
          status: checked,
          id: selectedRecord,
        }
      );

      console.warn(
        "Add Bank API Response:",
        response.data.records.payout_permission
      );
      // minpayout(response.data.records.min_payout);
      if (response.data.records.payout_permission == "yes") {
        setIsMerchantEnabled(true);
      } else {
        setIsMerchantEnabled(false);
      }
    } catch (error) {
      console.error("Error adding bank:", error);
    }
    // };
  };

  return (
    <div className="wallet partner-user-setting">
      <Row justify="space-between" align="middle">
        <Card className="small_card">
          <PageTitle titles={titles} />
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
          <Link to="/reseller-setting">
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
            className="border-radiussec display bg1"
          >
            <Title level={3} className="mb-0">
              Payin Overview
            </Title>
            <Switch />
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border_right display bg4"
          >
            <Title level={3} className="mb-0">
              Payout Overview
            </Title>
            <Switch />
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiusthird display bg2"
          >
            <Title level={3} className="mb-0">
              Payin Transaction
            </Title>
            <Switch />
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
            className="border-radiussec display bg3"
          >
            <Title level={3} className="mb-0">
              Payout Transaction
            </Title>
            <Switch />
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border_right display bg1"
          >
            <Title level={3} className="mb-0">
              Partners List
            </Title>
            <Switch />
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiusthird display bg4"
          >
            <Title level={3} className="mb-0">
              Services
            </Title>
            <Switch />
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
            <Title level={3} className="mb-0">
              Merchant Details
            </Title>
            <Switch />
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border_right display bg3"
          >
            <Title level={3} className="mb-0">
              Partner Payout Setting
            </Title>
            <Switch />
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border-radiusthird display bg1"
          >
            <Title level={3} className="mb-0">
              Beneficially
            </Title>
            <Switch />
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
            <Title level={3} className="mb-0">
              Manual Settlements
            </Title>
            <Switch />
          </Col>
          <Col
            xs={20}
            sm={20}
            md={8}
            lg={8}
            style={{ padding: "20px" }}
            className="border_right display bg4"
          >
            <Title level={3} className="mb-0">
              Chargeback Transactions
            </Title>
            <Switch />
          </Col>
          {/* <Col xs={20} sm={20} md={8} lg={8} style={{padding: "20px" }} className='border-radiusthird display bg1'>
                        <Title level={3} className='mb-0'>Beneficially</Title>
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

export default ResellerSettingUser;
