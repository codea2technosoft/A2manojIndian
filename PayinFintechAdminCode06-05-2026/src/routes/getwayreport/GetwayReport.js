import React, { useState, useEffect } from "react";
import { Select, Table, Button, Card, Row, Col } from "antd";
import api from "utils/api";
import DatePicker from "components/DatePicker";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { DownloadOutlined } from "@ant-design/icons";
import { toast } from "react-toast";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTitle from "components/PageTitle";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const antbtnlg = {
  padding: " 6.4px 15px",
  fontSize: "16px",
  borderRadius: "8px",

  height: "60px",
};
const { Option } = Select;

const GetwayReport = () => {
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

  return (
    <div>
      {/* <PageTitle titles={titles} /> */}
      <Row gutter={[8, 8]} align="middle" justify={"space-around"}>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Card className="small_card">
            <RangePicker onChange={handleDateRangeChange} />
          </Card>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Card className="small_card">
            {totalCollection && totalCollection[0] ? (
              <div className="border-new collection">
                <h5 className="fs-18">
                  Total Collection
                </h5>
                <span>INR {totalCollection[0].totalCollection}</span>
              </div>
            ) : (
              <div>No data available</div>
            )}
          </Card>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Card className="small_card">
            {totalManagementfees && totalManagementfees[0] ? (
              <div className="border-new comission">
                <h5 className="fs-18">
                  Total Comission
                </h5>
                <span>INR {totalManagementfees[0].management_fee}</span>
              </div>
            ) : (
              <div>No data available</div>
            )}
          </Card>
        </Col>
        <Col xl={6} lg={6} md={12} sm={24} xs={24}>
          <Card className="small_card">
            <TableBar
              onSearch={onSearch}
              showFilter={false}
              placeholderInput="Search..."
              // inputRef={searchRef}
            />
          </Card>
        </Col>
      </Row>
      <Table
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        style={{ marginTop: "1rem" }}
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
