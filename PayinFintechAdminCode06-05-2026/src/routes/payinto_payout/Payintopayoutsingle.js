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
import { parseQueryParams, stringifyQueryParams } from "utils/url";

const { RangePicker } = DatePicker;
const antbtnlg = {
  padding: " 6.4px 15px",
  fontSize: "16px",
  borderRadius: "8px",

  height: "60px",
};
const { Option } = Select;

const Payintopayoutsingle = () => {
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
    { path: location.pathname, title: "Payin To Payout Single Report" },
  ];
  const columns = [
    {
      title: "Created at",
      key: "created_at",
      dataIndex: "created_at",
      render: (text, record) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div>
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      },
    },

    {
      title: "Order ID",
      key: "orderid",
      dataIndex: "orderid",
    },
    {
      title: "Refrence Details",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
    },

    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (text) => {
        let color = "";
        if (text === "success") {
          color = "green";
        } else if (text === "faild") {
          color = "red";
        }
        return <span style={{ color }}>{text}</span>;
      },
    },
  ];

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
      const queryParameters = new URLSearchParams(window.location.search);
      const type = queryParameters.get("getwayid");

      const apiUrl = `admin/summary/payment-payout-getway-list-payin-to-payout-single?page=${page}&per_page=${perPage}&start=${start}&end=${end}&userId=${type}`;

      const response = await api.post(apiUrl);

      const data = response.data;
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
    fetchData(getwayId, partnerId, startDate, endDate, status, dateRange);
  }, [getwayId, partnerId, startDate, endDate, status, page, perPage]);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize);
    setIsTableLoading(false);
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
      setDateRange([]);
      updateURLWithDateRange("", "");
      fetchData(getwayId, partnerId, []);
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
              <TableBar showFilter={false} placeholderInput="Search..." />
              <Link to="/report">
                <Button type="primary" size="large">
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
export default Payintopayoutsingle;
