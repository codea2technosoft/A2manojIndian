import React, { useState, useEffect } from "react";
import { Select, Table, Button, Space, Row, Card } from "antd";
import api from "utils/api";
import { useLocation, useNavigate, Link } from "react-router-dom";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import { CSVLink, CSVDownload } from "react-csv";
import DatePicker from "components/DatePicker";
const { RangePicker } = DatePicker;
const { Option } = Select;

const PaymentReport = () => {
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
  const [page, setPage] = useState(1);
  const [csvData, setCsvDataSuccess] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );

  const [totalCount, setTotalCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const titles = [
    { path: location.pathname, title: "Payment Gateway User Wise Report" },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (records) => ({}),
  };
  const columns = [
    {
      title: "Transation Details",
      width: "26%",
      render: (text, record) => (
        <div>
          <div>{record.order_number}</div>
          <div style={{ color: "#6C5DD3" }}>{record.payment_tx_id}</div>
        </div>
      ),
    },

    {
      title: "Customer Details",
      key: "email",
      width: "26%",
      dataIndex: "email",
      render: (text, record) => {
        return (
          <div>
            {record.email ? (
              <div>
                <a href={`tel:${record.email}`}>{record.email}</a>
              </div>
            ) : null}
            {record.phone ? <div>{record.phone}</div> : null}
          </div>
        );
      },
    },

    {
      title: "Amount",
      key: "total",
      width: "16%",
      dataIndex: "total",
      render: (text, record) => (
        <span>
          {record.currency} {record.total}
        </span>
      ),
    },

    {
      title: "Payment Status",
      key: "payment_status",
      dataIndex: "payment_status",
      render: (text) => {
        const statusMap = {
          1: "Awaiting",
          2: "Success",
          3: "Cancel",
          4: "Refund",
          7: "Failed",
        };
        return <div style={{ color: "#6C5DD3" }}>{statusMap[text]}</div>;
      },
    },

    {
      title: "Created at",
      key: "created_at",
      width: "16%",
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
  ];

  const fetchData = async (getwayId, partnerId, dateRange, page, perPage) => {
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
      const apiUrl = `admin/summary/payment-getway-by-total-user-wise?page=${page}&per_page=${perPage}&start=${start}&end=${end}&getwayid=${type}&userid=${useridd}`;

      const response = await api.post(apiUrl);
      const merchantData = response.data.records;
      const totalRecords = response.data.total_records;
      setRecords(merchantData);
      setPage(response.data.page);
      setPerPage(response.data.per_page);
      setTotalCount(totalRecords);
      setIsTableLoading(false);
      // setCsvDataSuccess(merchantData.map(element => ({
      //   id: element.partner_id,
      //   OrderNumber: element.order_number,
      //   Payment_tx_id: element.payment_tx_id,
      //   TotalAmount: element.total,
      // }));
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
    setIsTableLoading(false);
  };

  const handleClick = (id) => {
    // alert(id);
    const queryParameters = new URLSearchParams(window.location.search);
    const type = queryParameters.get("getwayid");
    window.location.href = `/getway-detail?getwayid=${type}`;
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
      <div className="overviewBorder">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* <PageTitle titles={titles} /> */}
        </div>
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
                {" "}
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
        rowSelection={rowSelection}
        dataSource={records}
        rowKey="id"
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
export default PaymentReport;
