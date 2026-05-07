import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Space,
  Row,
  Divider,
  DatePicker,
  InputNumber,
  message,
  Modal,
  Card,
  Col,
  Select,
  Input,
  Dropdown,
} from "antd";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { toast } from "react-toast";
import { omitBy, isEmpty, debounce } from "lodash";
import { Table } from "antd";

// styles
import "assets/styles/orders.scss";
// request
import {
  getOrders,
  getManualSettlementsPayinListsreport,
  exportOrders,
} from "requests/order";

const { RangePicker } = DatePicker;

const titles = [{ title: "All Transaction" }];

function ManualSettlementsPayin() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [adminDepositAmt, setadminDepositAmt] = useState(0);
  const [payintopayoutAmt, setpayintopayoutAmt] = useState(0);
  const [directAmt, setdirectAmt] = useState(0);
  const [PayinSettlmentAmt, setPayinSettlmentAmt] = useState(0);
  const [records, setRecords] = useState([]);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [imageURL, setImageURL] = useState([]);

  const config = useSelector((state) => state.config);

  const segment = window.location.pathname.split("/");
  const idname = segment[2];

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const [mode, setMode] = useState(null);
  const [rrnNumber, setRrnNumber] = useState("");
  const { Option } = Select;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(null);
  const { id } = useParams();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount(null);
    setMode(null);
    setRrnNumber("");
  };

  useEffect(() => {
    const query = parseQueryParams(location);
    if (query.start && query.end) {
      getRecords(query);
    } else {
      const today = dayjs();
      const defaultDateMin = today.startOf("day");
      const defaultDateMax = today.endOf("day");
      query.start = defaultDateMin.format("YYYY-MM-DD");
      query.end = defaultDateMax.format("YYYY-MM-DD");
      setFilter(query);
      getRecords(query);
    }
  }, [location]);

  const getRecords = async (query) => {
    try {
      setIsTableLoading(true);
      const response = await getManualSettlementsPayinListsreport(
        query,
        idname,
      );
      setImageURL(response.url);
      setRecords(response.data);
      setadminDepositAmt(response.adminDeposit);
      setpayintopayoutAmt(response.payintopayout);
      setPayinSettlmentAmt(response.PayinManualSettlement);
      setdirectAmt(response.direct);
      setPage(response.page);
      setPerPage(response.per_page);
      setTotalCount(response.total_records);
    } catch (err) {
      console.log(err);
    } finally {
      setIsTableLoading(false);
    }
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  const handleSubmit = async () => {
    if (!amount) {
      message.error("Please enter amount");
      return;
    }

    if (!mode) {
      message.error("Please select payment mode");
      return;
    }

    if (!rrnNumber) {
      message.error("Please enter RRN number");
      return;
    }

    const token = getCookie("sob_token");
    if (!token) {
      message.error("Authentication token missing");
      return;
    }

    const payload = {
      user_id: Number(id),
      settled_amount: amount,
      mode: mode,
      rrn_number: rrnNumber,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}admin/partner/payin-manual-settlement`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.data.status) {
        message.success("Manual settlement successful");
        console.log("API Response:", response.data);

        let query = parseQueryParams(location);
        query.page = 1;

        if (!query.start || !query.end) {
          const today = dayjs();
          const defaultDateMin = today.startOf("day");
          const defaultDateMax = today.endOf("day");
          query.start = defaultDateMin.format("YYYY-MM-DD");
          query.end = defaultDateMax.format("YYYY-MM-DD");
        }

        navigate({
          pathname: location.pathname,
          search: stringifyQueryParams(query),
        });

        setTimeout(() => {
          getRecords(query);
        }, 100);

        closeModal();
      } else {
        message.error(response.data.message || "Settlement failed");
      }
    } catch (error) {
      console.error("API Error:", error);

      if (error.response?.status === 401) {
        message.error("Invalid or expired token");
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Something went wrong");
      }
    }
  };

  const onRefresh = () => {
    setView("list");
    setTimeout(() => {
      navigate({
        pathname: location.pathname,
        search: stringifyQueryParams({}),
      });
      if (searchRef.current?.input.value) {
        searchRef.current.handleReset();
      }
    }, 1000);
  };

  // Fixed Export Function
  const onExport = async (format) => {
    try {
      setExportLoading(true);
      setIsTableLoading(true);

      // Get all query parameters
      let query = parseQueryParams(location);

      // Remove pagination parameters - we want ALL data
      delete query.page;
      delete query.per_page;

      // Ensure dates are included
      if (!query.start || !query.end) {
        // Use current dates from state
        if (dates && dates[0] && dates[1]) {
          query.start = dates[0].format("YYYY-MM-DD");
          query.end = dates[1].format("YYYY-MM-DD");
        } else {
          const today = dayjs();
          const defaultDateMin = today.startOf("day");
          const defaultDateMax = today.endOf("day");
          query.start = defaultDateMin.format("YYYY-MM-DD");
          query.end = defaultDateMax.format("YYYY-MM-DD");
        }
      }

      // Add user_id if available
      if (id) {
        query.user_id = id;
      }

      // Add export format
      query.export = format;

      // Build query string
      const queryString = Object.keys(query)
        .filter(
          (key) =>
            query[key] !== undefined &&
            query[key] !== null &&
            query[key] !== "",
        )
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`,
        )
        .join("&");

      const exportUrl = `https://api.payinfintech.com/admin/partner/Payin-Manual-Settlement-Export?${queryString}`;

      console.log("Payin Export URL:", exportUrl);

      // Get token
      const token = getCookie("sob_token");

      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      // Fetch JSON data from API
      const response = await axios({
        url: exportUrl,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        timeout: 30000,
      });

      console.log("API Response:", response.data);

      if (!response.data || !response.data.status) {
        throw new Error(response.data?.message || "Failed to fetch data");
      }

      const apiData = response.data.data || [];

      if (!Array.isArray(apiData) || apiData.length === 0) {
        toast.error("No data available to export");
        return;
      }

      console.log("Data received for export:", apiData.length, "records");

      // Process data for export
      const processedData = processExportDataFromAPI(apiData);

      // Export based on format
      switch (format.toLowerCase()) {
        case "csv":
          exportAsCSV(processedData);
          break;
        case "excel":
          exportAsExcel(processedData);
          break;
        case "pdf":
          exportAsPDF(processedData);
          break;
        default:
          exportAsCSV(processedData);
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error(err.message || "Export failed. Please try again.");
      throw err;
    } finally {
      setExportLoading(false);
      setIsTableLoading(false);
    }
  };

  // Function to process API JSON data
  const processExportDataFromAPI = (data) => {
    if (!Array.isArray(data)) {
      console.error(
        "processExportDataFromAPI: Expected array, got",
        typeof data,
      );
      return [];
    }

    return data.map((record, index) => {
      if (!record || typeof record !== "object") {
        return {
          "Order ID": "",
          Amount: "0.00",
          Mode: "",
          UTR: "",
          Date: "",
        };
      }

      return {
        "Order ID": record.orderid || "",
        Amount: formatAmount(record.amount),
        Mode: formatMode(record.mode),
        UTR: record.utr || "",
        Date: record.created_at || "",
      };
    });
  };

  // Alternative export function if needed

  function formatAmount(value) {
    const num = parseFloat(value) || 0;
    return num === 0 ? 0 : parseFloat(num.toFixed(2));
  }

  const onExportAlternative = async (format) => {
    try {
      setExportLoading(true);

      // Get data from existing API without pagination
      let query = parseQueryParams(location);

      // Remove pagination
      delete query.page;
      delete query.per_page;

      // Ensure dates are included
      if (!query.start || !query.end) {
        if (dates && dates[0] && dates[1]) {
          query.start = dates[0].format("YYYY-MM-DD");
          query.end = dates[1].format("YYYY-MM-DD");
        } else {
          const today = dayjs();
          const defaultDateMin = today.startOf("day");
          const defaultDateMax = today.endOf("day");
          query.start = defaultDateMin.format("YYYY-MM-DD");
          query.end = defaultDateMax.format("YYYY-MM-DD");
        }
      }

      if (id) {
        query.user_id = id;
      }

      console.log("Fetching data for client-side export:", query);

      const response = await getManualSettlementsPayinListsreport(
        query,
        idname,
      );
      const exportData = response.data || [];

      if (!exportData || !Array.isArray(exportData)) {
        toast.error("No data available to export");
        return;
      }

      if (exportData.length === 0) {
        toast.error("No data available to export");
        return;
      }

      console.log("Exporting", exportData.length, "records");

      const processedData = exportData.map((record, index) => ({
        "Sr No": index + 1,
        Date: record.created_at || "",
        "Order ID": record.orderid || "",
        Amount: formatAmount(record.amount),
        Mode: formatMode(record.mode),
        UTR: record.utr || "",
      }));

      switch (format.toLowerCase()) {
        case "csv":
          exportAsCSV(processedData);
          break;
        case "excel":
          exportAsExcel(processedData);
          break;
        case "pdf":
          exportAsPDF(processedData);
          break;
        default:
          exportAsCSV(processedData);
      }
    } catch (err) {
      console.error("Client-side export error:", err);
      toast.error(err.message || "Export failed. Please try again.");
      throw err;
    } finally {
      setExportLoading(false);
    }
  };

  const formatNumber = (value) => {
    if (!value && value !== 0) return "0.00";
    const num = parseFloat(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const formatMode = (mode) => {
    if (!mode) return "";
    return String(mode).toUpperCase();
  };

  const exportAsCSV = (data) => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = String(row[header] || "");
              const escapedValue = value.replace(/"/g, '""');
              return `"${escapedValue}"`;
            })
            .join(","),
        ),
      ].join("\n");

      downloadFile(csvContent, "text/csv", "csv");
      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error("CSV export error:", error);
      throw error;
    }
  };

  const exportAsExcel = (data) => {
    if (typeof window.XLSX === "undefined") {
      toast.error("Excel export library not loaded");
      throw new Error("Excel library not loaded");
    }

    if (data.length === 0) {
      toast.error("No data to export");
      throw new Error("No data");
    }

    try {
      const worksheet = window.XLSX.utils.json_to_sheet(data);
      const workbook = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Manual Settlements",
      );
      window.XLSX.writeFile(
        workbook,
        `manual-settlements-${dayjs().format("YYYY-MM-DD")}.xlsx`,
      );
      toast.success("Excel exported successfully!");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel file");
      throw error;
    }
  };

  const exportAsPDF = (data) => {
    if (typeof window.jspdf === "undefined") {
      toast.error("PDF export library not loaded");
      throw new Error("PDF library not loaded");
    }

    if (data.length === 0) {
      toast.error("No data to export");
      throw new Error("No data");
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("landscape");

      // Title
      doc.setFontSize(16);
      doc.text("Payin Manual Settlements Report", 14, 15);

      // Date range info
      doc.setFontSize(10);
      const query = parseQueryParams(location);
      const dateRange =
        query.start && query.end
          ? `${query.start} to ${query.end}`
          : "All Dates";
      doc.text(`Date Range: ${dateRange}`, 14, 25);

      // if (id) {
      //   doc.text(`User ID: ${id}`, 14, 32);
      // }

      // Summary info
      doc.text(`Total Records: ${data.length}`, 14, 39);
      doc.text(`Total Amount: ₹${PayinSettlmentAmt}`, 14, 46);

      // Prepare table data
      const headers = [Object.keys(data[0])];
      const rows = data.map((row) => Object.values(row));

      // Create table with auto column widths
      doc.autoTable({
        head: headers,
        body: rows,
        startY: 55,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 135, 245] },
        margin: { top: 55 },
      });

      // Save PDF
      doc.save(`manual-settlements-${dayjs().format("YYYY-MM-DD")}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF file");
      throw error;
    }
  };

  const downloadFile = (content, mimeType, extension) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payin-manual-settlements-${dayjs().format("YYYY-MM-DD")}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handle export with fallback
  const handleExport = async (format) => {
    try {
      await onExport(format);
    } catch (error) {
      console.log("Direct API export failed, trying client-side export");
      try {
        await onExportAlternative(format);
      } catch (fallbackError) {
        console.error("Both export methods failed:", fallbackError);
        toast.error("Export failed. Please try again.");
      }
    }
  };

  const onChangeTable = (pagination, filters, sorter, extra) => {
    let query = parseQueryParams(location);
    query = {
      ...query,
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    if (sorter.order) {
      query = {
        ...query,
        order_by: sorter.field,
        order_type: sorter.order === "ascend" ? "asc" : "desc",
      };
    } else {
      delete query.order_by;
      delete query.order_type;
    }

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  };

  const onSaveFilter = () => {
    const saveFilterData = omitBy(filter, isEmpty);
    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(saveFilterData),
    });
  };

  const onSearch = (keyword) => {
    let query = parseQueryParams(location);
    query = {
      ...query,
      page: 1,
      keyword: keyword,
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  };

  const onToggleFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

  const onChangeFilter = (name, e, isMuilty = false) => {
    if (isMuilty) {
      setFilter((preState) => ({ ...preState, [name]: e.join(",") }));
    } else {
      setFilter((preState) => ({ ...preState, [name]: e }));
    }
  };

  const onChangeView = (value) => {
    setView(value);
  };

  const onChangePaymentStatus = (value) => {
    let query = parseQueryParams(location);

    if (value) {
      query = {
        ...query,
        payment_status: value,
      };
    } else {
      delete query.payment_status;
    }

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  };

  const onChangeDates = (dates) => {
    setDates(dates);
    let query = parseQueryParams(location);

    if (dates && dates[0] && dates[1]) {
      query.start = dayjs(dates[0]).startOf("day").format("YYYY-MM-DD");
      query.end = dayjs(dates[1]).endOf("day").format("YYYY-MM-DD");
    } else {
      delete query.start;
      delete query.end;
    }

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  };

  const columns = [
    {
      title: "SR No",
      key: "srno",
      render: (_, __, index) => {
        // Calculate SR No based on pagination
        const currentPage = page || 1;
        const pageSize = perPage || 10;
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Date",
      key: "created_at",
      dataIndex: "created_at",
      sorter: true,
    },
    {
      title: "Order ID",
      key: "orderid",
      dataIndex: "orderid",
      sorter: true,
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
      sorter: true,
      render: (amount) => (
        <span>
          <FaRupeeSign style={{ fontSize: "12px", marginRight: "4px" }} />
          {amount}
        </span>
      ),
    },
    {
      title: "Mode",
      key: "mode",
      dataIndex: "mode",
      sorter: true,
      render: (mode) => (
        <span style={{ textTransform: "uppercase" }}>{mode}</span>
      ),
    },
    {
      title: "UTR",
      key: "utr",
      dataIndex: "utr",
      sorter: true,
    },
  ];

  return (
    <div className="wrap-orders transaction">
      <Row gutter={[16, 16]} justify={"space-between"} align={"middle"}>
        <Col xs={24} sm={24} md={24} lg={6} xl={8}>
          <Card className="round_card">
            <Row>
              <Col xs={24} sm={24} md={24} lg={18} xl={24}>
                <RangePicker
                  value={dates}
                  onCalendarChange={(newDates) => onChangeDates(newDates)}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card className="round_card">
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Button type="primary" size="large" onClick={openModal} block>
                  Payin Manual Settlement
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Export Button - Added to existing layout */}
        <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card className="round_card">
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Dropdown
                  placement="bottomRight"
                  menu={{
                    items: [
                      {
                        key: "csv",
                        label: "Export as CSV",
                        onClick: () => handleExport("csv"),
                      },

                      {
                        key: "excel",
                        label: "Export as Excel",
                        onClick: () => handleExport("excel"),
                      },

                      {
                        key: "pdf",
                        label: "Export as PDF",
                        onClick: () => handleExport("pdf"),
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={exportLoading}
                    disabled={exportLoading}
                  >
                    {exportLoading ? "Exporting..." : "Export"}
                  </Button>
                </Dropdown>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12} xl={8}>
          <div className="payintopayoutnew box3">
            <div className="payintopayoutnew-header">
              Payin Manual Settlement Amount
            </div>
            <div className="payintopayoutnew-body">
              <FaRupeeSign />
              {PayinSettlmentAmt}
            </div>
          </div>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={records}
        loading={isTableLoading}
        pagination={{
          pageSize: perPage,
          total: totalCount,
          current: page,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) =>
            onChangeTable({ current: page, pageSize: pageSize }, {}, {}, {}),
        }}
        onChange={onChangeTable}
        scroll={{
          x: true,
        }}
      />

      {/* Modal */}
      <Modal
        title="Manual Settlement"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        okText="Submit"
        cancelText="Cancel"
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Select Mode *
          </label>
          <Select
            style={{ width: "100%" }}
            placeholder="Select payment mode"
            value={mode}
            onChange={(value) => setMode(value)}
          >
            <Option value="rtgs">RTGS</Option>
            <Option value="imps">IMPS</Option>
            <Option value="neft">NEFT</Option>
          </Select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            RRN Number *
          </label>
          <Input
            placeholder="Enter RRN number"
            value={rrnNumber}
            onChange={(e) => setRrnNumber(e.target.value)}
            maxLength={20}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>Amount *</label>
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter amount"
            value={amount}
            min={1}
            step={1}
            precision={0}
            stringMode={false}
            onChange={(value) => {
              if (typeof value === "number" && !isNaN(value) && value >= 1) {
                setAmount(value);
              } else {
                setAmount(null);
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ManualSettlementsPayin;
