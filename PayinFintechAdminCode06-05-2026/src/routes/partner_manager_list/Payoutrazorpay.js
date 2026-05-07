import React, { useState, useEffect } from "react";
import { Select, Table, Button, Card, Row } from "antd";
import api from "utils/api";
import DatePicker from "components/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTitle from "components/PageTitle";

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

const Payoutrazorpay = () => {
  const [partnerId, setPartnerId] = useState(null);
  const [getwayId, setGetwayId] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [mode, setMode] = useState("today");
  const [dateRange, setDateRange] = useState([]);
  const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const titles = [{ path: location.pathname, title: "Payout List" }];
  const columns = [
    
    {
      title: "Status/Order.Id",
      render: (text, records) => (
        <div>
          <>
            <span style={{ color: "green" }}>Success</span>
            <br></br>
            <span style={{ color: "#ed0750" }}>{records.payment_tx_id}</span>
          </>
        </div>
      ),
    },

    {
      title: "Open Balance",
      render: (text, records) => (
        <div>
          <div>{records.open_amount}</div>
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
            <strong>Reserve Amt : </strong> {records.reserve_amount}
            <br></br>
            <strong>Management : </strong> {records.management_fee}
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
            {records.payment_type == "credit" ? (
              <span style={{ color: "green" }}>
                {records.payment_type.toUpperCase()}
              </span>
            ) : (
              <span style={{ color: "red" }}>
                {records.payment_type.toUpperCase()}
              </span>
            )}
            <br></br>
            <strong>Getway Name</strong> {records.getway_name}
            <br></br>
          </div>
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

  const fetchData = async (getwayId, partnerId, startDate, endDate, status, dateRange) => {
    setIsTableLoading(true);
    try {
      let start = "";
      let end = "";
  
      if (dateRange === "today" || !dateRange) {
        const today = new Date().toISOString().slice(0, 10);
        console.warn(today);
        start = today;
        end = today;
      } else if (Array.isArray(dateRange) && dateRange.length === 2) {
        start = dateRange[0].toISOString().slice(0, 10);
        end = dateRange[1].toISOString().slice(0, 10);
      }
  
      const queryParameters = new URLSearchParams(window.location.search);
      const type = queryParameters.get("partnerid");
  
      const response = await api.get("admin/admin-ledger-report/payout", {
        params: {
          page,
          per_page: perPage,
          isTableLoading,
          partnerid: type,
          start,
          end,
        },
      });
  
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
  }, [getwayId, partnerId, startDate, endDate, status, page, perPage, dateRange]);
  


  const handleDateRangeChange = (dates) => {
    if (dates === "today" || !dates) {
      const today = new Date().toISOString().slice(0, 10);
      console.log("Debug - today:", today);
      fetchData("", "", today, today, "", "today");
      setDateRange("today");
      console.log("Debug - dateRange after today:", dateRange);
    } else if (Array.isArray(dates) && dates.length === 2) {
      const [startDate, endDate] = dates;
      console.log("Debug - startDate:", startDate);
      console.log("Debug - endDate:", endDate);
      fetchData("", "", startDate, endDate, "");
      setDateRange(dates);
      console.log("Debug - dateRange after set:", dateRange);
    }
  };
  
  

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize);
    setIsTableLoading(false);
  };

  // const handleDateRangeChange = (dates) => {
  //   setDateRange(dates);
  //   if(dates === 'today'){
  //     fetchData('', 'today');
  //   }
  //   else{
  //     fetchData('', dates);
  //   }

  // };

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
  // const availableModes = [
  //   { key: "today", label: "Today" },
  //   { key: "yesterday", label: "Yesterday" },
  //   { key: "this_week", label: "This week" },
  //   { key: "last7days", label: "Last 7 days" },
  //   { key: "last30days", label: "Last 30 days" },
  // ];

  return (
    <div>
      <div className="overviewBorder">
        <Row justify="space-between" align="middle">
          <Card className="small_card">
            <PageTitle titles={titles} />
          </Card>
          <Link to="/partner-merchantUser-list">
            <Card className="small_card">
              <Button
                type="primary"
                size="large"
              >
                <span style={{ marginRight: "7px" }}>
                  &larr;
                </span>{" "}
                Back
              </Button>
            </Card>
          </Link>
        </Row>
      </div>
      <Card className="mb-20 mt-20">
        <Row
          gutter={[8, 8]}
          align="middle"
          style={{ justifyContent: "space-around" }}
        >
          <RangePicker onChange={handleDateRangeChange} />
        </Row>
      </Card>
      
      <Table
        className="mt-8"
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        pagination={{
          total: totalCount,
          showTotal: (total) => `Total ${total} items`,
          pageSize: perPage,
          current: page,
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
export default Payoutrazorpay;
