import React, { useState, useEffect } from "react";
import {
  Select,
  Table,
  Button,
  Pagination,
  Spin,
  Space,
  Card,
  Row,
} from "antd";
import api from "utils/api";
import DatePicker from "components/DatePicker";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toast";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTitle from "components/PageTitle";
import { CSVLink } from "react-csv";

const { Option } = Select;
const { RangePicker } = DatePicker;
const PayoutReport = () => {
  const [partnerId, setPartnerId] = useState(null);
  const [getwayId, setGetwayId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [csvData, setCsvDataSuccess] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );

  const [totalCount, setTotalCount] = useState(0);
  const [dateRange, setDateRange] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const titles = [
    { path: location.pathname, title: "Payout User Wise Report" },
  ];
  const columns = [
    {
      title: "Payment Method",
      render: (text, records) => (
        <div>
          <div>
            {records.id}
            <br />
            <div>{new Date(records.created_at).toLocaleDateString()}</div>
            <div>{new Date(records.created_at).toLocaleTimeString()}</div>
          </div>
        </div>
      ),
    },

    {
      title: "Bank Details",
      render: (text, records) => (
        <div>
          <div>
            {records.accountnumber}
            <br />
            {records.bankname}
            <br />
            {records.Ifsc}
            <br />
            {records.mode}
            <br />
          </div>
        </div>
      ),
    },

    {
      title: "Transaction Details",
      render: (text, records) => (
        <div>
          <div>
            {records.orderid}
            <br />
            {records.tid}
            <br />
          </div>
        </div>
      ),
    },
    {
      title: "Amount",
      render: (text, records) => (
        <div>
          <div>
            <p>
              Total {records.amount}
              <br />
            </p>
            <p>
              Settled Amt {records.subtotal}
              <br />
            </p>
            <p>
              Fees Amt {records.fees}
              <br />
            </p>
            <p>
              GST Amt {records.gst}
              <br />
            </p>
          </div>
        </div>
      ),
    },

    {
      title: "Status",
      render: (text, records) => (
        <div>
          {records.status === "success" && (
            <CheckCircleOutlined style={{ color: "green" }} />
          )}
          {records.status === "failed" && (
            <CloseCircleOutlined style={{ color: "red" }} />
          )}
          {records.status === "pending" && (
            <ClockCircleOutlined style={{ color: "orange" }} />
          )}
        </div>
      ),
    },
  ];

  const fetchData = async (isTableLoading) => {
    try {
      let start, end;
      if (Array.isArray(dateRange) && dateRange.length === 2) {
        start = dateRange[0].toISOString().slice(0, 10);
        end = dateRange[1].toISOString().slice(0, 10);
      } else {
        start = "";
        end = "";
      }

      const queryParameters = new URLSearchParams(window.location.search);
      const type = queryParameters.get("getwayid");
      const useridd = queryParameters.get("userid");

      const apiUrl = `admin/summary/payment-payout-getway-list-user-wise-single?page=${page}&per_page=${perPage}&start=${start}&end=${end}&getwayid=${type}&userid=${useridd}`;

      const response = await api.post(apiUrl);
      const merchantData = response.data.records;
      const totalRecords = response.data.total_records;
      setRecords(merchantData);
      setPage(response.data.page);
      setPerPage(response.data.per_page);
      setTotalCount(totalRecords);
      setIsTableLoading(false);
      setCsvDataSuccess(
        merchantData.map((element) => ({
          UserName: element.userdetails.full_name,
          OrderNumber: element.orderid,
          TotalAmount: element.subtotal,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(getwayId, partnerId, dateRange, page, perPage);
  }, [getwayId, partnerId, dateRange, page, perPage]);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize);
    setIsTableLoading(false);
  };

  const handleClick = (id) => {
    // alert(id);
    const queryParameters = new URLSearchParams(window.location.search);
    const type = queryParameters.get("getwayid");
    window.location.href = `/payoutuserwise-report?getwayid=${type}`;
  };

  const updateURLWithDateRange = (start, end) => {
    const query = new URLSearchParams(window.location.search);
    query.set("start", start);
    query.set("end", end);
    const newSearch = `?${query.toString()}`;
    window.history.pushState({}, "", newSearch);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      const [start, end] = dates.map((date) => date.toISOString().slice(0, 10));
      setDateRange(dates);
      updateURLWithDateRange(start, end);
      fetchData(getwayId, partnerId, dates, page, perPage);
    } else {
      setDateRange([]);
      updateURLWithDateRange("", "");
      fetchData(getwayId, partnerId, [], page, perPage);
    }
  };

  return (
    <div>
      {/* <div style={{ display: "flex", justifyContent: "space-between" }}> */}
      {/* <PageTitle titles={titles} /> */}
      {/* Select components */}
      {/* </div> */}
      <div className="overviewBorder">
        <Row gutter={[8, 8]} justify={"space-between"} align={"middle"}>
          <Card className="small_card">
            <Space>
              <RangePicker onChange={handleDateRangeChange} />
              <Button type="primary" size="large">
                Export
              </Button>
            </Space>
          </Card>
          <Card className="small_card">
            <CSVLink data={csvData}>
              <Button type="primary" size="large">
                Download Csv
              </Button>
            </CSVLink>
          </Card>
          <Card className="small_card">
            <Space>
              <TableBar showFilter={false} placeholderInput="Search..." />
              <Link>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => handleClick(records.getway_name)}
                >
                  <span style={{ marginRight: "7px"}}>
                    &larr;
                  </span>{" "}
                  Back
                </Button>
              </Link>
            </Space>
          </Card>
        </Row>
      </div>

      <Table
        className="mt-8"
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        pagination={{
          total: totalCount,
          showTotal: (total) => `Total ${total}  items`,
          // pageSize: perPage,
          // current: page,
          onChange: handlePageChange,
          showLoading: isTableLoading,
        }}
        scroll={{
          x: true,
        }}
      />
    </div>
  );
};
export default PayoutReport;
