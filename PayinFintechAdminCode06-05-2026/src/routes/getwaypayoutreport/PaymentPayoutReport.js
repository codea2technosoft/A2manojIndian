import React, { useState, useEffect } from "react";
import { Select, Table, Button, Card, Row, Col } from "antd";
import api from "utils/api";
import DatePicker from "components/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { DownloadOutlined } from "@ant-design/icons";
import { toast } from "react-toast";
import TableBar from "components/TableBar";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTitle from "components/PageTitle";
import $ from "jquery";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { Option } = Select;

const GetwayReport = () => {
  const [partnerId, setPartnerId] = useState(null);
  const [getwayId, setGetwayId] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [records, setRecords] = useState([]);
  const [GrandtotalManagementfees, setGrandtotalManagementfees] = useState([]);
  const [GrandtotalCollection, setGrandtotalCollection] = useState([]);
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
  // const onSetDatesByDatePicker = (dates) => {
  //   setMode('custom');
  //   setDates(dates);

  // }
  const [totalCount, setTotalCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const titles = [{ path: location.pathname, title: "Payment Payout Report" }];
  const columns = [
    {
      title: "Gateway Name",
      render: (text, records) => (
        <div>
          <div>{records.getwayname}</div>
        </div>
      ),
    },

    {
      title: "Total Collection",
      render: (text, records) => (
        <div>
          <div>{records.subtotal1}</div>
        </div>
      ),
    },

    {
      title: "Gateway Charge",
      render: (text, records) => (
        <div>
          <div> {records.transaction_fee1}</div>
        </div>
      ),
    },

    {
      title: "Actions",
      render: (text, record) => (
        <Link to={`/payoutuserwise-report?getwayid=${record.getwayname}`}>
          <Button
            type="primary"
            size="large"
            // onClick={() => handleClick(record.getwayname)}
            style={{ width: 65, height: 35 }}
          >
            View
          </Button>
        </Link>
      ),
    },
  ];
  const handleClick = (id) => {
    window.location.href = `/payoutuserwise-report?getwayid=${id}`;
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

      const apiUrl = `admin/summary/payment-payout-getway-list?page=${page}&per_page=${perPage}&start=${start}&end=${end}`;

      const response = await api.post(apiUrl);

      const data = response.data;
      const merchantData = response.data.records;
      const totalRecords = response.data.total_records;
      const GrandtotalManagementfees = response.data.GrandtotalManagementfees;
      const GrandtotalCollection = response.data.GrandtotalCollection;

      setRecords(merchantData);
      setPage(response.data.page);
      setPerPage(response.data.per_page);
      setTotalCount(totalRecords);
      setGrandtotalManagementfees(GrandtotalManagementfees);
      setGrandtotalCollection(GrandtotalCollection);
      setIsTableLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(getwayId, partnerId, dateRange, page, perPage);
  }, []);

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
      {/* <PageTitle titles={titles} /> */}
      {/* <Card className='mb-24'>
        <Row gutter={[8, 8]} align='middle' style={{ justifyContent: 'space-around' }}>
         
          <RangePicker onChange={handleDateRangeChange} />
        </Row>
      </Card> */}
      <Row gutter={[8, 8]} align="middle" justify={"space-around"}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Card className="small_card">
            <RangePicker onChange={handleDateRangeChange} />
          </Card>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Card className="small_card">
            <div className="border-new collection">
              <h5 className="fs-18" style={{ color: "#fff" }}>
                Total Collection
              </h5>
              <span>INR {GrandtotalCollection}</span>
            </div>
          </Card>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Card className="small_card">
            <div className="border-new comission">
              <h5 className="fs-18" style={{ color: "#fff" }}>
                Total Comission
              </h5>
              <span>INR {GrandtotalManagementfees}</span>
            </div>
          </Card>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Card className="small_card">
            <TableBar
              showFilter={false}
              placeholderInput="Search..."
              // inputRef={searchRef}
            />
          </Card>
        </Col>
      </Row>
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
export default GetwayReport;
