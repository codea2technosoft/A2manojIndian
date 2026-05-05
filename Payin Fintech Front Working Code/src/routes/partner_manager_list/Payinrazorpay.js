import React, { useState, useEffect } from "react";
import { Select, Table, Button, Card, Row } from "antd";
import api from "utils/api";
import DatePicker from "components/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { DownloadOutlined } from "@ant-design/icons";
import { toast } from "react-toast";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTitle from "components/PageTitle";
import $ from "jquery";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const antbtnlg = {
  padding: " 6.4px 15px",
  fontSize: "16px",
  borderRadius: "8px",

  height: "60px",
};
const { Option } = Select;
const url = new URL(window.location.href);
const partnerId = url.searchParams.get("partnerid");

const Payinrazorpay = () => {
  const [partnerId, setPartnerId] = useState(null);
  const [getwayId, setGetwayId] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);

  const [currentPage, setCurrentPage] = useState();
  const [usersPerPage] = useState();
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [mode, setMode] = useState("today");
  const [dateRange, setDateRange] = useState([]);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );

  const [totalCount, setTotalCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const titles = [{ path: location.pathname, title: "Payin List" }];
  const columns = [
    // {
    //   title: 'Merchant Details',
    //   render: (text, records) => (
    //     <div>
    //       <div>
    //         {/* <strong>Merchant Email</strong>{records.merchant_email} */}
    //         {records && <a href={`mailto:${records.partner_email}`}>{records.partner_email}</a>}<br></br>
    //         {records && <a href={`mailto:${records.merchant_email}`}>{records.merchant_email}</a>}<br></br>
    //         {records && <a href={`mailto:${records.manager_email}`}>{records.manager_email}</a>}
    //       </div>
    //     </div>
    //   )
    // },

    {
      title: "Open Balance",
      render: (text, records) => (
        <div>
          <div>
            {records.payment_type == "debit"
              ? (records.closing_amount + records.amount).toFixed(2)
              : (
                  records.closing_amount -
                  records.amount +
                  records.management_fee +
                  records.reserve_amount +
                  records.chargeback
                ).toFixed(2)}
          </div>
        </div>
      ),
    },

    {
      title: "Amount",
      render: (text, records) => (
        <div>
          <div>
            {records.amount}
            <br></br>
          </div>
        </div>
      ),
    },

    {
      title: "Closing Balance",
      render: (text, records) => (
        <div>
          <div>{records.closing_amount}</div>
        </div>
      ),
    },

    {
      title: "Fees/Charges",
      render: (text, records) => (
        <div>
          <div>
            <strong>Charg :</strong> {records.chargeback}
            <br />
            <strong>RM: </strong> {records.reserve_amount}
            <br />
            <strong>Mang: </strong> {records.management_fee}
            <br></br>
          </div>
        </div>
      ),
    },
    {
      title: "Getway Name",
      render: (text, records) => (
        <div>
          <div>
            <strong>Type : </strong>
            {records.payment_type == "debit" ? (
              <span style={{ color: "red" }}>
                {records.payment_type.toUpperCase()}
              </span>
            ) : (
              <span style={{ color: "green" }}>
                {records.payment_type.toUpperCase()}
              </span>
            )}
            <br></br>
            <strong>Getway Name </strong>
            {records.getway_name == "payintopayout" ? (
              <span style={{ color: "#c91850" }}>
                {records.getway_name.toUpperCase()}
              </span>
            ) : (
              <span style={{ color: "#981ac9" }}>
                {records.getway_name.toUpperCase()}
              </span>
            )}
            <br></br>
          </div>
        </div>
      ),
    },

    {
      title: "Customer Details",
      render: (text, records) => (
        <div>
          <div>
            {records.merchant_orders && (
              <a href={`mailto:${records.merchant_orders.email}`}>
                {records.merchant_orders.email}
              </a>
            )}
            <br></br>
            {records.merchant_orders && records.merchant_orders.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Status/Txn.Id",
      render: (text, records) => (
        <div>
          {records.payment_type == "credit" ? (
            records.merchant_orders &&
            records.merchant_orders.payment_status == "1" ? (
              <span style={{ color: "red" }}>Pending</span>
            ) : records.merchant_orders &&
              records.merchant_orders.payment_status == "2" ? (
              <>
                <span style={{ color: "green" }}>Success</span>
                <br></br>
                <span style={{ color: "#ed0750" }}>
                  {records.payment_tx_id}
                </span>
              </>
            ) : (
              <span style={{ color: "red" }}>Fail</span>
            ) //
          ) : (
            <>
              <span style={{ color: "green" }}>Success</span>
              <br></br>
              <span style={{ color: "#ed0750" }}>{records.payment_tx_id}</span>
            </>
          )}
        </div>
      ),
    },

    {
      title: "Created at",
      render: (text, records) => (
        <div>
          <div>
            {records.date} {records.time} {records.day}
          </div>
        </div>
      ),
    },
  ];

  const fetchData = async (isTableLoading, keyword, dateRange) => {
    setIsTableLoading(true);
    // alert(dateRange);
    try {
      let start, end;

      if (dateRange === "today") {
        //  alert(dateRange);
        start = new Date().toISOString().slice(0, 10);
        end = start;
      } else if (dateRange === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        start = end = yesterday.toISOString().slice(0, 10);
      } else if (dateRange === "thisWeek") {
        const currentDate = new Date();
        const firstDayOfWeek = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay())
        );
        start = firstDayOfWeek.toISOString().slice(0, 10);
        end = new Date().toISOString().slice(0, 10);
      } else if (dateRange === "last7Days") {
        const currentDate = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        start = sevenDaysAgo.toISOString().slice(0, 10);
        end = new Date().toISOString().slice(0, 10);
      } else if (dateRange === "last30Days") {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        start = thirtyDaysAgo.toISOString().slice(0, 10);
        end = new Date().toISOString().slice(0, 10);
      } else if (Array.isArray(dateRange) && dateRange.length === 2) {
        start = dateRange[0].toISOString().slice(0, 10);
        end = dateRange[1].toISOString().slice(0, 10);
      } else {
        // Default to fetching all records
        start = "";
        end = "";
      }
      const queryParameters = new URLSearchParams(window.location.search);
      const type = queryParameters.get("partnerid");
      const response = await api.get("admin/admin-ledger-report/payin", {
        params: {
          page,
          per_page: perPage,
          isTableLoading,
          partnerid: type,
        },
        start: start,
        end: end,
      });

      const data = response.data;

      const merchantData = response.data.records;
      const totalRecords = response.data.total_record;
      setRecords(merchantData);
      setPage(response.data.page);

      setPerPage(response.data.per_page);
      setTotalCount(totalRecords);
      setIsTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(getwayId, partnerId, startDate, endDate, status, dateRange);
  }, [getwayId, partnerId, startDate, endDate, status, page, perPage]);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates === "today") {
      fetchData("", "today");
    } else {
      fetchData("", dates);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize);
    setIsTableLoading(false);
  };

  const onSearch = (keyword) => {
    let query = parseQueryParams(location.search);
    // alert(query);
    query = {
      ...query,
      page: 1,
      keyword: keyword,
    };

    navigate.push({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });

    fetchData(keyword);
  };
  const availableModes = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "this_week", label: "This week" },
    { key: "last7days", label: "Last 7 days" },
    { key: "last30days", label: "Last 30 days" },
  ];

  return (
    <div>
      <div className="overviewBorder">
        <Row justify="space-between" align="middle">
          <Card className="small_card">
            <PageTitle titles={titles} />
          </Card>
          <Link to="/partner-merchantUser-list">
            <Card className="small_card">
              <Button type="primary" size="large">
                <span style={{ marginRight: "7px" }}>&larr;</span> Back
              </Button>
            </Card>
          </Link>
        </Row>
      </div>

      <Table
        className="mt-8"
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        pagination={{
          total: totalCount,
          showTotal: (total) => `Total ${total} items`,
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
export default Payinrazorpay;
