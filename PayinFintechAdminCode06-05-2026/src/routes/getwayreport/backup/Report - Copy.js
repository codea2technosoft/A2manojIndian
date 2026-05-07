import React, { useState, useEffect } from "react";
import { Select, Table, Button, Card, Row, Col, Tabs } from "antd";
import api from "utils/api";
import DatePicker from "components/DatePicker";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { DownloadOutlined } from "@ant-design/icons";
import { toast } from "react-toast";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTitle from "components/PageTitle";
import dayjs from "dayjs";
import GatewayReport from "../../../src/routes/getwayreport/GetwayReport";
import PaymentPayoutReport from "../../../src/routes/getwaypayoutreport/PaymentPayoutReport";
import Payintopayout  from "../../../src/routes/payinto_payout/Payintopayout";
const { RangePicker } = DatePicker;
const antbtnlg = {
  padding: " 6.4px 15px",
  fontSize: "16px",
  borderRadius: "8px",

  height: "60px",
};
const { Option } = Select;

const Report = () => {
  const [partnerId, setPartnerId] = useState(null);
  const [getwayId, setGetwayId] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [totalCollection, settotalCollection] = useState([]);
  const [totalManagementfees, settotalManagementfees] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [dateRange, setDateRange] = useState([]);
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );

  const [totalCount, setTotalCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const titles = [{ path: location.pathname, title: "Payment Gateway Report" }];
  
  const columns = [
    {
      title: "Gateway Name",
      render: (text, records) => (
        <div>
          <div>{records[0].getway_name}</div>
        </div>
      ),
    },

    {
      title: "Total Collection",
      render: (text, records) => (
        <div>
          <div>{records[0].totalAmt}</div>
        </div>
      ),
    },

    {
      title: "Gateway Charge",
      render: (text, records) => (
        <div>
          <div>{records[0].management_fee}</div>
        </div>
      ),
    },

    {
      title: "Actions",
      render: (text, record) => (
        <Link to={`/getway-detail?getwayid=${record[0].getway_name}`}>
          <Button
            type="primary"
            size="large"
            // onClick={() => handleClick(record[0].getway_name)}
            style={{ width: 65, height: 35 }}
          >
            View
          </Button>
        </Link>
      ),
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };
  const onChangeTable = (pagination) => {
    console.log(pagination);

    let query = parseQueryParams(location);
    query = {
      ...query,
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  };

  const fetchData = async (isTableLoading, keyword, dateRange) => {
    setIsTableLoading(true);

    try {
      let start, end;
      if (Array.isArray(dateRange) && dateRange.length === 2) {
        start = dateRange[0].toISOString().slice(0, 10);
        end = dateRange[1].toISOString().slice(0, 10);
      } else {
        start = "";
        end = "";
      }

      const apiUrl = `admin/summary/payment-getway-list?page=${page}&per_page=${perPage}&start=${start}&end=${end}`;
      const response = await api.post(apiUrl);
      const data = response.data.totalCollection;
      const merchantData = response.data.records;
      const totalCollection = response.data.totalCollection;
      const totalManagementfees = response.data.totalManagementfees;
      const totalRecords = response.data.total_records;
      setRecords(merchantData);
      setPage(response.data.page);
      setPerPage(response.data.per_page);
      setTotalCount(totalRecords);
      settotalCollection(totalCollection);
      settotalManagementfees(totalManagementfees);
      setIsTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(getwayId, partnerId, dateRange, page, perPage);
    handleDateRangeChange();
  }, []);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize);
    setIsTableLoading(false);
  };

  const handleClick = (id) => {
    window.location.href = `/getway-detail?getwayid=${id}`;
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
      fetchData(getwayId, partnerId, dates);
    } else {
      const today = new Date();
      const start = today.toISOString().slice(0, 10);
      const end = today.toISOString().slice(0, 10);
      setDateRange([today, today]);
      updateURLWithDateRange(start, end);
      fetchData(getwayId, partnerId, [today, today]);
    }
  };

  const onSearch = (keyword) => {
    let query = parseQueryParams(location.search);

    query = {
      ...query,
      page: 1,
      keyword: keyword,
    };

    fetchData(keyword);
  };
  const availableModes = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "this_week", label: "This week" },
    { key: "last7days", label: "Last 7 days" },
    { key: "last30days", label: "Last 30 days" },
  ];

  const items = [
    {
      key: "1",
      label: "PayIN",
      children: (
        <>
          <GatewayReport />
        </>
      ),
    },
    {
      key: "2",
      label: "Payout",
      children: (
        <>
          <PaymentPayoutReport />
        </>
      ),
    },

    {
      key: "3",
      label: "PayIn to Payout",
      children: (
        <>
          <Payintopayout  />
        </>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        indicatorSize={(origin) => origin - 16}
      />
    </div>
  );
};
export default Report;
