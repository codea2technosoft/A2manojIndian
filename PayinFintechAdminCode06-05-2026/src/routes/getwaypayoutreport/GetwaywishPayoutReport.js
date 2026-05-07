import React, { useState, useEffect } from "react";
import {
  Select,
  Table,
  Button,
  Pagination,
  Spin,
  Card,
  Row,
  Space,
} from "antd";
import api from "utils/api";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import DatePicker from "components/DatePicker";
import $ from "jquery";

import { parseQueryParams, stringifyQueryParams } from "utils/url";

const { RangePicker } = DatePicker;
const { Option } = Select;

const GetwaywishPayoutReport = () => {
  const [partnerId, setPartnerId] = useState(null);
  const [getwayId, setGetwayId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState(["today"]);
  const [records, setRecords] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );

  const [totalCount, setTotalCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const titles = [
    { path: location.pathname, title: "Payout User wise Report" },
  ];
  const columns = [
    //  {
    //     title: "Sr",
    //     render: (text, record, index) => <span>{index + 1}</span>,
    //   },
    {
      title: "Merchant Details",
      render: (text, records) => (
        <div>
          <div>
            {records.partneremail}
            <br />
            <br />
            {records.mechantemail}
          </div>
        </div>
      ),
    },
    {
      title: "Total Collection",
      render: (text, records) => (
        <div>
          <div>{records.totalAmt}</div>
        </div>
      ),
    },

    {
      title: "Gateway Charge",
      render: (text, records) => (
        <div>
          <div>{records.transaction_fee}</div>
        </div>
      ),
    },

    {
      title: "Actions",
      render: (text, record) => (
        <Link
          to={`/payout-report?getwayid=${record.getwayname}&userid=${record.Userid}`}
        >
          <Button
            type="primary"
            size="large"
            // onClick={() => handleClick(record.getwayname, record.Userid)}
            style={{ width: 65, height: 35 }}
          >
            View
          </Button>
        </Link>
      ),
    },
  ];
  const handleClick = (id, userid) => {
    window.location.href = `/payout-report?getwayid=${id}&userid=${userid}`;
  };

  const fetchData = async (keyword, dateRange) => {
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

      const apiUrl = `admin/summary/payment-payout-getway-list-user-wise?page=${page}&per_page=${perPage}&keyword=${keyword}&getwayname=${type}&start=${start}&end=${end}`;

      const response = await api.post(apiUrl);

      const merchantData = response.data.records;
      const totalRecords = response.data.total_records;
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
    fetchData(getwayId, partnerId, dateRange, page, perPage);
  }, []);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize);
    setIsTableLoading(true);
    fetchData(getwayId, dateRange, page, pageSize);
  };

  const updateURLWithDateRange = (dates) => {
    if (dates) {
      const [start, end] = dates.map((date) => date.toISOString().slice(0, 10));
      const query = new URLSearchParams(window.location.search);
      query.set("start", start);
      query.set("end", end);
      const newSearch = `?${query.toString()}`;
      window.history.pushState({}, "", newSearch);
    } else {
      const query = new URLSearchParams(window.location.search);
      query.delete("start");
      query.delete("end");
      const newSearch = `?${query.toString()}`;
      window.history.pushState({}, "", newSearch);
    }
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      updateURLWithDateRange(dates);
      fetchData(getwayId, dates);
    } else {
      setDateRange([]);
      updateURLWithDateRange([]);
      fetchData(getwayId, []);
    }
  };

  const onSearch = (searchKeyword) => {
    const query = new URLSearchParams(location.search);
    query.set("keyword", searchKeyword);
    query.set("page", 1);
    const newSearch = `?${query.toString()}`;
    window.history.pushState({}, "", newSearch);
    fetchData(searchKeyword);
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
            <Space>
              <TableBar
                onSearch={onSearch}
                showFilter={false}
                placeholderInput="Search..."
              />
              <Link to="/report">
                <Button
                  type="primary"
                  size="large"
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
export default GetwaywishPayoutReport;
