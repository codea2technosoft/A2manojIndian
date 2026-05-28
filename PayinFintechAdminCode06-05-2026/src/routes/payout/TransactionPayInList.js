import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Space,
  Row,
  Col,
  Card,
  Table,
  DatePicker,
  Modal,
  Select,
  Dropdown,
} from "antd";
import dayjs from "dayjs";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import { toast } from "react-toast";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import FilterDrawer from "./FilterDrawer";
import { omitBy, isEmpty } from "lodash";
import SelectOptionExample from "components/Elements/BaseSelect/SelectOptionExamplePayin.js";
import { getOverviewadminSummaryMerchant } from "requests/statistic";
import {
  ChevronDownIcon,
  RefreshIcon,
  MenuAlt1Icon,
  ViewGridIcon,
} from "@heroicons/react/outline";
import { BaseSelect } from "components/Elements";
import OrderCardView from "./OrderCardView";
import OrderListView from "./OrderListView";
import api from "utils/api";
// styles
import "assets/styles/orders.scss";
// request
import {
  payingetPartnerSummary,
  payingetPartnerSummaryExport,
} from "requests/statistic";
import { getOrders, exportOrders } from "requests/order";
// import * as XLSX from "xlsx";

const { RangePicker } = DatePicker;

const titles = [{ title: "Payin Transaction" }];

function TransactionPayInList() {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState();
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE,
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const searchRef = useRef(null);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [filter, setFilter] = useState(null);
  const [BankDetails, setBankDetails] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const [modal2Open, setModal2Open] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentRemark, setCurrentRemark] = useState(null);

  const [formData1, setFormData] = useState({
    status: "",
  });

  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [mode, setMode] = useState("today");

  const [Merchantdatas, setMerchantdatas] = useState([]);
  const [MerchantId, setMerchantid] = useState(null);

  const { Option } = Select;

  const [merchantSelected, setmerchantSelected] = useState(
    "Please Select Merchant",
  );

  const onSetmerchant = (mode) => {
    setmerchantSelected(mode);
    setMerchantid(mode);
  };

  useEffect(() => {
    getDatamerchant(dates);
  }, [dates]);

  useEffect(() => {
    const query = parseQueryParams(location);
    getData(query);
  }, [location, dates, MerchantId]);

  const getDatamerchant = async (dates) => {
    try {
      const filters = {
        start: dates[0].format("YYYY-MM-DD"),
        end: dates[1].format("YYYY-MM-DD"),
      };
      const response = await getOverviewadminSummaryMerchant(filters);
      setMerchantdatas(response.data);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const config = useSelector((state) => state.config);

  const handleStatusClick1 = (id, remark) => {
    setCurrentId(id);
    setCurrentRemark(remark);
    setIsStatusModalVisible(true);
  };

  const handleInputChange = (value) => {
    setFormData({ ...formData1, status: value });
  };

  const handleChange = async (status) => {
    if (!currentId) {
      console.error("No ID available");
      return;
    }
    if (!formData1.status) {
      console.error("No status available");
      return;
    }

    const formData = new FormData();
    formData.append("id", currentId);
    formData.append("status", formData1.status);

    setIsTableLoading(true);
    try {
      const response = await api.post(
        `admin/partner/payout-partners-change-status`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const query = parseQueryParams(location);
      getData(query);
    } catch (error) {
      console.error("Error fetching manager list:", error);
    } finally {
      setIsTableLoading(false);
    }
  };

  const columns = [
    {
      title: "ID / Date",
      render: (text, record) => {
        const [date, time] = record.created_at.split(" ");
        return (
          <div>
            <strong>{record.id}</strong>
            <br />
            {date}
            <br />
            {time}
          </div>
        );
      },
    },
    {
      title: "Merchant / Customer Details",
      render: (text, record) => (
        <div style={{ lineHeight: "1.6" }}>
          <div style={{ marginBottom: "12px" }}>
            <h4 style={{ marginBottom: "6px", color: "#1677ff" }}>
              <u>Merchant Details</u>
            </h4>
            <div>
              <strong>Name:</strong> {record.user.full_name}
            </div>
            <div>
              <strong>Mobile:</strong>{" "}
              <a href={`tel:${record.user.mobile}`}>{record.user.mobile}</a>
            </div>
            <div>
              <strong>Email:</strong> {record.user.email || "NA"}
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: "6px", color: "#52c41a" }}>
              <u>Customer Details</u>
            </h4>
            <div>
              <strong>Name:</strong> {record.name}
            </div>
            <div>
              <strong>Mobile:</strong>{" "}
              <a href={`tel:${record.phone}`}>{record.phone}</a>
            </div>
            <div>
              <strong>Email:</strong> {record.email || "NA"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Transaction ID/ Order ID",
      render: (text, record) => (
        <div>
          <strong>G.Txn ID</strong> {record.getway_order_id}
          <br></br>
          <strong>Odr Number</strong> {record.order_number}
          <br></br>
          <strong>Gateway Name </strong> {record.getway_name}
          <br></br>
          <strong>Payment Method </strong>
          {record.paymentMethod
            ?.replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()) || "NA"}
          <br />
        </div>
      ),
    },
    {
      title: "Transfer Amount",
      render: (text, record) => (
        <>
          <div>
            <strong>Amount : </strong> {record.total}
          </div>
          <div>
            <strong>Trnx Charges : </strong> {record.commission || "0.00"}
          </div>
          <div>
            <strong>Reseller Charges : </strong>{" "}
            {record.reseller_commission || "0.00"}
          </div>
          <div>
            <strong>GST : </strong> {record.gst || "0.00"}
          </div>
          <div>
            <strong>Settled Amount : </strong> {record.subtotal || "0.00"}
          </div>
        </>
      ),
    },
    {
      title: "Status",
      render: (text, record) => {
        const getStatusColor = (status) => {
          switch (status) {
            case 2:
              return "green";
            case 7:
              return "red";
            case 4:
              return "#0a64f5";
            case 1:
              return "#c500ff";
            default:
              return "black";
          }
        };

        return (
          <>
            <div
              style={{
                color: getStatusColor(record.payment_status),
                textTransform: "uppercase",
                fontFamily: "cursive",
                fontWeight: "900",
              }}
            >
              {record.payment_status == 1 ? (
                <>Pending</>
              ) : record.payment_status == 2 ? (
                <>Success</>
              ) : record.payment_status == 4 ? (
                <>
                  <sapn>Refund</sapn>
                  <br></br>
                  <span style={{ color: "#4e838c" }}>
                    R.ID: {record.refund_id}
                  </span>
                  <br></br>
                  <span style={{ color: "#4e838c" }}>
                    R.G.ID: {record.refund_getway_id}
                  </span>
                </>
              ) : record.payment_status == 7 ? (
                <>Faild</>
              ) : (
                <></>
              )}
            </div>
            {record.payment_status == 1 ? (
              <div class="btn btn-primary">
                <Button
                  type="primary"
                  onClick={() => handleCheckStatus(record.order_number)}
                >
                  Check Status
                </Button>
              </div>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const query = parseQueryParams(location);
    getData(query);
  }, [location]);

  const getData = async (query) => {
    try {
      setIsTableLoading(true);
      const params = {
        start: dates[0].format("YYYY-MM-DD"),
        end: dates[1].format("YYYY-MM-DD"),
        user_id: MerchantId,
        ...query,
      };

      const response = await payingetPartnerSummary(params);
      setRecords(response.record);
      setPage(response.page);
      setPerPage(response.per_page);
      setTotalCount(response.total_records);
    } catch (err) {
      console.log(err);
    } finally {
      setIsTableLoading(false);
    }
  };

  const onChangeTable = (pagination) => {
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

  const onToggleFilter = () => {
    setIsShowFilter(!isShowFilter);
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

  const onChangeDates = (dates) => {
    let query = parseQueryParams(location);

    if (dates) {
      query = {
        ...query,
        created_at_date_min: dayjs(dates[0]).format("YYYY-MM-DD"),
        created_at_date_max: dayjs(dates[1]).format("YYYY-MM-DD"),
      };
    } else {
      delete query.created_at_date_min;
      delete query.created_at_date_max;
    }

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  };

  function formatNumber(value) {
    const num = parseFloat(value) || 0;
    return num === 0 ? 0 : parseFloat(num.toFixed(2)); // number hi return karo
  }

  const onExport = async (format) => {
    try {
      setIsTableLoading(true);

      const params = {
        // start: dates[0].format("YYYY-MM-DD"),
        // end: dates[1].format("YYYY-MM-DD"),
        user_id: MerchantId,
        ...parseQueryParams(location),
      };

      console.log("Export params:", params);

      const response = await payingetPartnerSummaryExport(params);
      const allOrders = response.record || [];

      if (!Array.isArray(allOrders)) {
        toast.error("Invalid data received from server");
        return;
      }

      if (allOrders.length === 0) {
        toast.error("No data available to export");
        return;
      }

      console.log("Export data (first record):", allOrders[0]);

      const processedData = processOrderData(allOrders);

      switch (format) {
        case "csv":
          exportOrdersAsCSV(processedData);
          break;
        case "excel":
          exportOrdersAsExcel(processedData);
          break;
        case "pdf":
          exportOrdersAsPDF(processedData);
          break;
        default:
          exportOrdersAsCSV(processedData);
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsTableLoading(false);
    }
  };

  // UPDATED processOrderData FUNCTION
  const processOrderData = (orders) => {
    if (!Array.isArray(orders)) {
      console.error(
        "processOrderData: Expected array, got",
        typeof orders,
        orders,
      );
      return [];
    }

    return orders.map((order, index) => {
      if (!order || typeof order !== "object") {
        return {
          // 'S.No': index + 1,
          // 'ID': '',
          // 'G.Txn ID': '',
          "Odr Number": "",
          // 'Transaction ID': '',
          "Customer Name": "",
          "Customer Phone": "",
          "Customer Email": "",
          "Merchant Name": "",
          "Merchant Phone": "",
          "Merchant Email": "",
          "Gateway Name": "",
          "Payment Method": "",
          Amount: "0.00",
          "Transaction Charges": "0.00",
          "Reseller Charges": "0.00",
          GST: "0.00",
          "Settled Amount": "0.00",
          Status: "",
          Date: "",
          Time: "",
        };
      }

      // Debug log
      console.log(`Order ${index + 1} user data:`, order.user);

      // Extract merchant details
      const merchantName = order.user?.full_name || "NA";
      const merchantPhone = order.user?.mobile || "NA";
      const merchantEmail = order.user?.email || "NA";

      // Extract customer details
      const customerName = order.name || "NA";
      const customerPhone = order.phone || "NA";
      const customerEmail = order.email || "NA";

      // Parse date and time
      let date = "NA";
      let time = "NA";
      if (order.created_at) {
        const [datePart, timePart] = order.created_at.split(" ");
        date = datePart || "NA";
        time = timePart || "NA";
      }

      // Format payment method
      const paymentMethod = order.paymentMethod
        ? order.paymentMethod
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : "NA";

      // Format status
      const status =
        order.payment_status == 1
          ? "Pending"
          : order.payment_status == 2
            ? "Success"
            : order.payment_status == 4
              ? "Refund"
              : order.payment_status == 7
                ? "Failed"
                : "NA";

      return {
        "Odr Number": order.order_number || "NA",
        "Customer Name": customerName,
        "Customer Phone": customerPhone,
        "Customer Email": customerEmail,
        "Merchant Name": merchantName,
        "Merchant Phone": merchantPhone,
        "Merchant Email": merchantEmail,
        "Gateway Name": order.getway_name || "NA",
        "Payment Method": paymentMethod,
        // "Amount": order.total ? parseFloat(order.total).toFixed(2) : "0.00",
        Amount: formatNumber(order.total),
        "Transaction Charges": formatNumber(order.commission),
        "Reseller Charges": formatNumber(order.reseller_commission),
        GST: formatNumber(order.gst),
        "Settled Amount": formatNumber(order.subtotal),
        Status: status,
        Date: date,
        Time: time,
      };
    });
  };

  const exportOrdersAsCSV = (data) => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => `"${String(row[header] || "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    downloadOrdersFile(csvContent, "text/csv", "csv");
    toast.success("Orders CSV exported successfully!");
  };

  const exportOrdersAsExcel = (data) => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    if (typeof window.XLSX === "undefined") {
      toast.error("Excel export library not loaded");
      return;
    }

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Payin Transactions",
    );

    const fileName = `payin-transactions-${new Date().toISOString().split("T")[0]}.xlsx`;
    window.XLSX.writeFile(workbook, fileName);

    toast.success("Orders Excel exported successfully!");
  };

  const exportOrdersAsPDF = (data) => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    if (typeof window.jspdf === "undefined") {
      toast.error("PDF export library not loaded");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Payin Transactions Export Report", 14, 15);

    const headers = [Object.keys(data[0])];
    const rows = data.map((row) => Object.values(row));

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 135, 245] },
      margin: { top: 20 },
    });

    const fileName = `payin-transactions-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
    toast.success("Orders PDF exported successfully!");
  };

  const downloadOrdersFile = (content, mimeType, extension) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payin-transactions-${new Date().toISOString().split("T")[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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

  const fetchManagerList = async (id) => {
    setIsTableLoading(true);
    try {
      const response = await api.post(
        `/manager/summary/payout-transaction-bank-details/${id}`,
        {},
      );
      setBankDetails(response.data.record);
    } catch (error) {
      console.error("Error fetching manager list:", error);
    }
    setIsTableLoading(false);
  };

  const handleManageClick = (record) => {
    fetchManagerList(record);
    setModal2Open(true);
  };

  const handleManageClick1 = (id, remark) => {
    setModalContent(remark);
    setIsModalVisible(true);
  };

  const handleCheckStatus = async (id) => {
    setIsTableLoading(true);
    try {
      const response = await api.get(
        `https://api.payinfintech.com/webhook/payment/ChkOrderStatus/${id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      const query = parseQueryParams(location);
      getData(query);
    } catch (error) {
      console.error("Error checking status:", error);
    } finally {
      setIsTableLoading(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleStatusOk = () => {
    setIsStatusModalVisible(false);
    handleChange();
  };

  const handleStatusCancel = () => {
    setIsStatusModalVisible(false);
  };

  const payStatuses = [
    { value: "1", display: "Pending" },
    { value: "2", display: "Success" },
    { value: "4", display: "Refund" },
    { value: "7", display: "Faild" },
  ];

  return (
    <div>
      <Row gutter={[8, 8]} justify={"space-between"} align={"middle"}>
        <Col xs={24} md={24} lg={8} xl={5}>
          <Card className="small_card">
            <SelectOptionExample
              options={payStatuses}
              onChange={(value) => {
                onChangePaymentStatus(value);
              }}
            />
          </Card>
        </Col>
        <Col xs={24} md={24} lg={8} xl={5}>
          <Card className="small_card">
            <TableBar
              placeholderInput="Customer details/ Merchant details"
              children={
                <Space className="mb-8 action-button">
                  <BaseSelect
                    options={config.pay_statuses}
                    optionLabel="display"
                    optionValue="value"
                    defaultText="Status"
                    selected=""
                    style={{ width: 230 }}
                    onChange={(value) => onChangePaymentStatus(value)}
                  />
                </Space>
              }
              onSearch={onSearch}
              onFilter={onToggleFilter}
              isActiveFilter={isShowFilter}
              inputRef={searchRef}
              showFilter={false}
            />
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24} lg={11} xl={7}>
          <Card className="small_card">
            <Select
              className="filter_selects bg-transparent"
              size="large"
              style={{ width: "100%" }}
              value={merchantSelected}
              onChange={onSetmerchant}
            >
              {Merchantdatas &&
                Merchantdatas.map((item) => (
                  <Option key={item.key} value={item.id}>
                    {item.email}
                  </Option>
                ))}
            </Select>
          </Card>
        </Col>

        <Col xs={24} md={24} lg={10} xl={7}>
          <Card className="small_card">
            <Space>
              <RangePicker
                onCalendarChange={(newDates) => onChangeDates(newDates)}
              />

              <Dropdown
                placement="bottomRight"
                menu={{
                  items: [
                    {
                      key: "excel",
                      label: "Export as Excel",
                      onClick: () => onExport("excel"),
                    },
                    {
                      key: "csv",
                      label: "Export as CSV",
                      onClick: () => onExport("csv"),
                    },
                    {
                      key: "pdf",
                      label: "Export as PDF",
                      onClick: () => onExport("pdf"),
                    },
                  ],
                }}
                trigger={["click"]}
              >
                <Button type="primary" size="large">
                  Export
                </Button>
              </Dropdown>
            </Space>
          </Card>
        </Col>
      </Row>

      <Table
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        onChange={onChangeTable}
        rowKey={"id"}
        pagination={{
          pageSize: perPage,
          total: totalCount,
          current: page,
        }}
        scroll={{
          x: true,
        }}
      />

      <Modal
        title="Payout Overview Bank Details"
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
      >
        <div className="d-flex border-new justify-content-between">
          <div className="border_second">Getway Name</div>
          <div className="toggle_class">{BankDetails.getwayname}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="border_second">
            <label>Bank Name</label>
          </div>
          <div className="toggle_class">{BankDetails.bankname}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="border_second">Mode</div>
          <div className="toggle_class">{BankDetails.mode}</div>
        </div>

        <div className="d-flex justify-content-between">
          <div className="border_second">IfSC</div>
          <div className="toggle_class">{BankDetails.Ifsc}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="border_second">Account Number</div>
          <div className="toggle_class">{BankDetails.accountnumber}</div>
        </div>
      </Modal>

      <Modal
        title="Reason"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{modalContent}</p>
      </Modal>

      <Modal
        title="Select Option"
        visible={isStatusModalVisible}
        onOk={handleStatusOk}
        onCancel={handleStatusCancel}
      >
        <Select
          defaultValue=""
          onChange={handleInputChange}
          value={formData1.status}
          style={{ width: "100%", color: "black" }}
          options={[
            {
              value: "",
              label: "Please Select",
              disabled: true,
            },
            {
              value: "2",
              label: "success",
            },
            {
              value: "7",
              label: "failed",
            },
          ]}
        />
      </Modal>
    </div>
  );
}
export default TransactionPayInList;
