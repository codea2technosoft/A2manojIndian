import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Card,
  Col,
  Row,
  Statistic,
  Button,
  Select,
  Spin,
  Space,
} from "antd";
import DatePicker from "components/DatePicker";
import dayjs from "dayjs";
import { formatCurrency } from "utils/common";
// request
import { getOverviewadminSummary } from "requests/statistic";
import { getOverviewadminSummaryMerchant } from "requests/statistic";
import { toast } from "react-toast";
import { CurrencyRupeeIcon } from "@heroicons/react/outline";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const OverviewCardByDate = (props) => {
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [mode, setMode] = useState("today");
  const [merchantSelected, setmerchantSelected] = useState(
    "Please Select Merchant"
  );
  const [MerchantId, setMerchantid] = useState(null);
  const [data, setData] = useState({});
  const [payincount, setpayincount] = useState({});
  const [payinAmt, setpayinAmt] = useState({});
  const [payintobank, setpayintobank] = useState({});
  const [payintopayout, setpayintopayout] = useState({});
  const [payouttobankcount, setpayouttobankcount] = useState({});
  const [payouttobankSuccess, setpayouttobankSuccess] = useState({});
  const [payouttobankFail, setpayouttobankFail] = useState({});
  const [loadFund, setloadFund] = useState({});
  const [payouttobankFailCount, setpayouttobankFailCount] = useState({});
  const [gsttotal, setgsttotal] = useState({});
  const [resellerComsiion, setresellerComsiion] = useState({});
  const [adminComsiion, setadminComsiion] = useState({});
  const [payouttobankPendingcount, setpayouttobankPendingcount] = useState({});
  const [payouttobankPendingSum, setpayouttobankPendingSum] = useState({});
  const [Merchantdatas, setMerchantdatas] = useState([]);
  const [payouttobankinprocesscount, setpayouttobankinprocesscount] = useState(
    {}
  );
  const [payouttobankinprocessSum, setpayouttobankinprocessSum] = useState({});

  const { Option } = Select;

  const [loading, setLoading] = useState(false);

  const availableModes = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    // { key: "last7days", label: "Last 7 days" },
    { key: "last30days", label: "Last 30 days" },
    // { key: "last90days", label: "Last 90 days" },
  ];

  useEffect(() => {
    getData(dates, MerchantId);
    getDatamerchant(dates);
  }, [dates, MerchantId]);

  const getData = async (dates, MerchantId) => {
    try {
      setLoading(true);
      const filters = {
        start: dates[0].format("YYYY-MM-DD"),
        end: dates[1].format("YYYY-MM-DD"),
        MerchantId: MerchantId,
      };

      const response = await getOverviewadminSummary(filters);

      // setpayincount(response.payincount);
      // setpayinAmt(response.payinAmt);
      // setpayintobank(response.payintobank);
      // setpayintopayout(response.payintopayout);
      setpayouttobankSuccess(response.payouttobankSuccess);
      setpayouttobankcount(response.payouttobankcount);
      setpayouttobankFail(response.payouttobankFail);
      setloadFund(response.loadFund);
      setpayouttobankFailCount(response.payouttobankFailCount);
      setgsttotal(response.gsttotal);
      setresellerComsiion(response.resellerComsiion);
      setadminComsiion(response.adminComsiion);
      setpayouttobankPendingcount(response.payouttobankPendingcount);
      setpayouttobankPendingSum(response.payouttobankPendingSum);
      setpayouttobankinprocesscount(response.payouttobankinprocesscount);
      setpayouttobankinprocessSum(response.payouttobankinprocessSum);

      // setgsttotal(response.gsttotal);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
  const onSetmerchant = (mode) => {
    // alert(mode);
    setmerchantSelected(mode);
    setMerchantid(mode);
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

      <h2>PayOut</h2>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box1 stats">
              <div className="data">
                <div className="icon">
                  <FaArrowRightArrowLeft set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">{JSON.stringify(payouttobankcount)}</p>
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
                  <p className="value">
                    {parseFloat(payouttobankSuccess).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">Success Transaction Amount</p>
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
                    {parseFloat(payouttobankFail).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">Failed Transaction Amount</p>
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
                  <p className="value">{parseFloat(loadFund).toFixed(2)}</p>
                </div>
              </div>
              <div className="title">
                <p className="name">Load Fund</p>
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
                  <p className="value">
                    {JSON.stringify(payouttobankFailCount)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">No of Failed Transaction</p>
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
                  <p className="value">{parseFloat(gsttotal).toFixed(2)}</p>
                </div>
              </div>
              <div className="title">
                <p className="name">GST Amount</p>
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
                    {parseFloat(adminComsiion).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">Commission Amount</p>
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
                    {parseFloat(resellerComsiion).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">Reseller Amount</p>
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
                  <p className="value">
                    {JSON.stringify(payouttobankinprocesscount)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">No of InProcess Transaction</p>
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
                    {parseFloat(payouttobankinprocessSum).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">InProcess Amount</p>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6}>
            <Card className="box3 stats">
              <div className="data">
                <div className="icon">
                  <FaArrowRightArrowLeft set="light" width={36} height={36} />
                </div>
                <div>
                  <p className="value">
                    {JSON.stringify(payouttobankPendingcount)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">No of Pending Transaction</p>
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
                    {parseFloat(payouttobankPendingSum).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="title">
                <p className="name">Pending Amount</p>
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
