import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Card,
  Col,
  Row,
  Statistic,
  Button,
  Spin,
  Space,
  Select,
} from "antd";
import DatePicker from "components/DatePicker";
import dayjs from "dayjs";
import { formatCurrency } from "utils/common";
// request
import { getOverviewadminSummaryPayin } from "requests/statistic";
import { toast } from "react-toast";
import { CurrencyRupeeIcon } from "@heroicons/react/outline";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { getOverviewadminSummaryMerchant } from "requests/statistic";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const OverviewCardByDate = (props) => {
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [mode, setMode] = useState("today");
  const [data, setData] = useState({});
  const [payincount, setpayincount] = useState({});
  const [payinAmt, setpayinAmt] = useState({});
  const [payincountfail, setpayincountfail] = useState({});
  const [payinAmtfail, setpayinAmtfail] = useState({});
  const [payincountrefund, setpayincountrefund] = useState({});
  const [payinAmtrefund, setpayinAmtrefund] = useState({});
  const [payincountPending, setpayincountPending] = useState({});
  const [payinAmtPending, setpayinAmtPending] = useState({});
  const [payinAmtSubtotal, setpayinAmtSubtotal] = useState({});
  const [records_payintopayout_settle, setrecords_payintopayout_settle] =
    useState({});
  const [payinCommissionAmt, setpayinCommissionAmt] = useState({});
  const [payinAmtComission, setpayinAmtComission] = useState({});
  const [payinAmtReseller, setpayinAmtReseller] = useState({});
  const [payinAmtGst, setpayinAmtGst] = useState({});
  const [Merchantdatas, setMerchantdatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [merchantSelected, setmerchantSelected] = useState(
    "Please Select Merchant"
  );
  const { Option } = Select;
  const [MerchantId, setMerchantid] = useState(null);
  const onSetmerchant = (mode) => {
    // alert(mode);
    setmerchantSelected(mode);
    setMerchantid(mode);
  };
  useEffect(() => {
    getData(dates, MerchantId);
    getDatamerchant(dates);
  }, [dates, MerchantId]);
  const availableModes = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    // { key: "last7days", label: "Last 7 days" },
    { key: "last30days", label: "Last 30 days" },
    // { key: "last90days", label: "Last 90 days" },
  ];

  useEffect(() => {
    getData(dates);
  }, [dates]);

  const getData = async (dates) => {
    try {
      setLoading(true);
      const filters = {
        start: dates[0].format("YYYY-MM-DD"),
        end: dates[1].format("YYYY-MM-DD"),
        MerchantId: MerchantId,
      };

      const response = await getOverviewadminSummaryPayin(filters);

      setpayincount(response.payincount);
      setpayinAmt(response.payinAmt);
      setpayincountfail(response.payincountFail);
      setpayinAmtfail(response.payinAmtFail);
      setpayincountrefund(response.payincountrefund);
      setpayinAmtrefund(response.payinAmtrefund);
      setpayincountPending(response.payincountPending);
      setpayinAmtPending(response.payinAmtPending);
      setrecords_payintopayout_settle(response.records_payintopayout_settle);
      setpayinAmtSubtotal(response.payinAmtSubtotal);
      setpayinCommissionAmt(response.payinCommissionAmt);
      setpayinAmtComission(response.payinAmtComission);
      setpayinAmtReseller(response.payinAmtReseller);
      setpayinAmtGst(response.payinAmtGst);

      // setgsttotal(response.gsttotal);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSetDatesByDatePicker = (dates) => {
    setMode("custom");
    setDates(dates);
  };

  const onSetDatesByMode = (mode) => {
    setMode(mode);

    if (mode === "today") {
      setDates([dayjs(), dayjs()]);
    } else if (mode === "yesterday") {
      setDates([dayjs().subtract(1, "day"), dayjs().subtract(1, "day")]);
    } else if (mode === "last7days") {
      setDates([dayjs().subtract(7, "day"), dayjs()]);
    } else if (mode === "last30days") {
      setDates([dayjs().subtract(30, "day"), dayjs()]);
    } else if (mode === "last90days") {
      setDates([dayjs().subtract(90, "day"), dayjs()]);
    }
  };
  const getDatamerchant = async (dates) => {
    try {
      const filters = {
        start: dates[0].format("YYYY-MM-DD"),
        end: dates[1].format("YYYY-MM-DD"),
      };
      setLoading(true);

      const response = await getOverviewadminSummaryMerchant(filters);
      // console.warn("oppppp", response.data);
      setMerchantdatas(response.data);

      // setgsttotal(response.gsttotal);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-24">
        <div className="overviewBorder">
          <Row gutter={[8, 8]} align="middle" justify={"space-between"}>
            <Col xs={24} sm={24} md={24} lg={11} xl={9}>
              <Card className="small_card filter">
                {availableModes.map((item) => (
                  <div className="filter_buttons">
                    <Button
                      className="btn-today"
                      size="large"
                      type={mode == item.key ? "primary" : "default"}
                      onClick={() => onSetDatesByMode(item.key)}
                    >
                      {item.label}
                    </Button>
                  </div>
                ))}
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={6}>
              <Card className="small_card">
                <Select
                  className="filter_selects bg-transparent"
                  size="large"
                  style={{ width: "100%" }}
                  value={merchantSelected}
                  onChange={onSetmerchant}
                >
                  {Merchantdatas &&
                    Merchantdatas.map((item) => (
                      <Option key={item.key} value={item.id}>
                        {item.email}
                      </Option>
                    ))}
                </Select>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={10} xl={7}>
              <Card className="small_card">
                <RangePicker
                  value={dates}
                  onCalendarChange={(newDates) =>
                    onSetDatesByDatePicker(newDates)
                  }
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <h2>Pay-in</h2>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box1 stats">
              <div className="data">
                <div className="icon">
                  <FaArrowRightArrowLeft set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">{JSON.stringify(payincount)}</p>
                </div>
              </div>
              <div className="title">
                <p className="name">No of Success Transaction</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box2 stats">
              <div className="data">
                <div className="icon">
                  <FaRupeeSign set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">{parseFloat(payinAmt).toFixed(2)}</p>
                </div>
              </div>
              <div className="title">
                <p className="name">Success Transaction Amount</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box4 stats">
              <div className="data">
                <div className="icon">
                  <FaRupeeSign set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">{JSON.stringify(payincountfail)}</p>
                </div>
              </div>
              <div className="title">
                <p className="name">Failed Transaction Count</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box3 stats">
              <div className="data">
                <div className="icon">
                  <FaRupeeSign set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">{parseFloat(payinAmtfail).toFixed(2)}</p>
                </div>
              </div>
              <div className="title">
                <p className="name">Failed Transaction Amount</p>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box1 stats">
              <div className="data">
                <div className="icon">
                  <FaArrowRightArrowLeft set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">{JSON.stringify(payincountrefund)}</p>
                </div>
              </div>
              <div className="title">
                <p className="name">No of Success Refund Transaction</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box2 stats">
              <div className="data">
                <div className="icon">
                  <FaRupeeSign set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">
                    {parseFloat(payinAmtrefund).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">Success Refund Transaction Amount</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box4 stats">
              <div className="data">
                <div className="icon">
                  <FaRupeeSign set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">{JSON.stringify(payincountPending)}</p>
                </div>
              </div>
              <div className="title">
                <p className="name">Pending Transaction Count</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box3 stats">
              <div className="data">
                <div className="icon">
                  <FaRupeeSign set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">
                    {parseFloat(payinAmtPending).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">Pending Transaction Amount</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box1 stats">
              <div className="data">
                <div className="icon">
                  <FaRupeeSign set="light" width={36} height={36} />
                </div>

                <div>
                  <p className="value">
                    {parseFloat(payinCommissionAmt).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">Success Transaction Commission Amount</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box2 stats">
              <div className="data">
                <div className="icon">
                  <FaRupeeSign set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">
                    {parseFloat(payinAmtSubtotal).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">
                  Success Transaction Without Commission Amount
                </p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box4 stats">
              <div className="data">
                <div className="icon">
                  <FaRupeeSign set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">
                    {parseFloat(records_payintopayout_settle).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">Payin to Payout Settlement Amount</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

OverviewCardByDate.propTypes = {};

export default OverviewCardByDate;
