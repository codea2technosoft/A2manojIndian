import React, { useState, useEffect } from "react";
import { Select, Table, Button, Card, Row, Col} from "antd";
import api from "utils/api";
import DatePicker from "components/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { DownloadOutlined } from "@ant-design/icons";
import { toast } from "react-toast";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTitle from "components/PageTitle";
import { getOrders, getWalletPendingreport, exportOrders } from 'requests/order';
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

const Payoutrazorpay = () => {
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
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );

  const [totalCount, setTotalCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const titles = [{ path: location.pathname, title: "User Payout List" }];
  
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

    // {
    //   title: "Open Balance",
    //   render: (text, records) => (
    //     <div>
    //       <div>
            
    //         {records.payment_type == "credit"
    //           ? (records.closing_amount - records.sub_total).toFixed(2)
    //           : 
    //             records.closing_amount + records.amount}
    //       </div>
    //     </div>
    //   ),
    // },

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
      title: "Transaction Types",
      render: (text, records) => (
        <div>
          <div>
            {/* {records.payment_type}<br></br> */}
            {/* <strong>Type : </strong> */}
            {records.payment_type == "credit" ? (
              <span style={{ color: "green" }}>
                {records.payment_type.toUpperCase()}
              </span>
            ) : (
              <span style={{ color: "red" }}>
                {records.payment_type.toUpperCase()}
              </span>
            )}
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
      const response = await api.get("payout-ledger", {
        params: {
          page,
          per_page: perPage,
          isTableLoading,
        },
        start: start,
        end: end,
      });

      // const data = response.data;
      // console.warn(data);
      const merchantData = response.data.records;
      const totalRecords = response.data.total_record;
      setRecords(merchantData);
      setPage(response.data.page);
      console.warn(response.data.page);
      setPerPage(response.data.per_page);
      setTotalCount(totalRecords);
      setIsTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(getwayId, startDate, endDate, status, dateRange);
  }, [getwayId, startDate, endDate, status, page, perPage]);

  // const handleDateRangeChange = (dates) => {
  //   setDateRange(dates);
  //   if (dates === "today") {
  //     fetchData("", "today");
  //   } else {
  //     fetchData("", dates);
  //   }
  // };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize);
    setIsTableLoading(false);
  };

  const onChangeDates = (dates) => {
    setDateRange(dates);
    let query = parseQueryParams(location);

    if (dates && dates[0] && dates[1]) {
        query.created_at_date_min = dayjs(dates[0]).startOf('day').format('YYYY-MM-DD');
        query.created_at_date_max = dayjs(dates[1]).endOf('day').format('YYYY-MM-DD');
    } else {
        delete query.created_at_date_min;
        delete query.created_at_date_max;
    }

    navigate({
        pathname: location.pathname,
        search: stringifyQueryParams(query),
    });
};


const onExport = async () => {
  try {
      let query = parseQueryParams(location);
      setIsTableLoading(true);
      if (query.created_at_date_min && query.created_at_date_max) {
          const response = await exportOrders(query);
          if (response && response.filepath) {
              window.open(`https://api.payinfintech.com/files/${response.filepath}`, '_blank');
          } else {
              throw new Error('Invalid response data');
          }
      } else {
          const today = dayjs();
          const defaultDateMin = today.startOf('day');
          const defaultDateMax = today.endOf('day');
          query.created_at_date_min = defaultDateMin.format('YYYY-MM-DD');
          query.created_at_date_max = defaultDateMax.format('YYYY-MM-DD');
          const response = await exportOrders(query);

          if (response && response.filepath) {
              window.open(`https://api.payinfintech.com/files/${response.filepath}`, '_blank');
          } else {
              throw new Error('Invalid response data');
          }
      }
  } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
  } finally {
      setIsTableLoading(false);
  }
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
        <Col xs={24} sm={24} md={24} lg={6} xl={8}>
          <Card className="round_card">
            <PageTitle titles={titles} />
          </Card>
        </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={9}>
                    <Card className="round_card">
                        <Row gutter={[8,8]}>
                            <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                                <RangePicker value={dates} onCalendarChange={(newDates) => onChangeDates(newDates)}/>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <Button type="primary" size="large" onClick={onExport}> Export </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
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
export default Payoutrazorpay;
