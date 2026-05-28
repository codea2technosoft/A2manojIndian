import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { EyeOutlined } from '@ant-design/icons';
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
  Popover
} from "antd";
import dayjs from "dayjs";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import { toast } from "react-toast";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import FilterDrawer from "./FilterDrawer";
import { omitBy, isEmpty } from "lodash";
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
import SelectOptionExample from "components/Elements/BaseSelect/SelectOptionExample.js";
// styles
import "assets/styles/orders.scss";
// request
import { payoutgetPartnerSummary } from "requests/statistic";
import { getOrders, exportOrdersPayout } from "requests/order";

const { RangePicker } = DatePicker;

const titles = [{ title: "Payout Transaction" }];
// const handleChange = (value) => {
//   console.log(`selected ${value}`);
// };

function TransactionPayoutList() {
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
    // company_id: "",
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
    // alert(mode);
    setmerchantSelected(mode);
    setMerchantid(mode);
  };

  //  useEffect(() => {
  //     getData(dates, MerchantId);
  //     getDatamerchant(dates);
  //   }, [dates, MerchantId]);

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
      //setLoading(true);

      const response = await getOverviewadminSummaryMerchant(filters);
      // console.warn("oppppp", response.data);
      setMerchantdatas(response.data);

      // setgsttotal(response.gsttotal);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      //setLoading(false);
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

    console.warn(currentId, currentRemark);

    // Create FormData object
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
      // console.warn(response.data.record.Ifsc);
      // setBankDetails(response.data.record)

      const query = parseQueryParams(location);
      getData(query);

      // handleChange();
      // window.location.reload();
    } catch (error) {
      console.error("Error fetching manager list:", error);
    } finally {
      setIsTableLoading(false);
    }
  };

  // const handleStatusOk = () => {
  //   setIsStatusModalVisible(false);
  // };

  // const handleStatusCancel = () => {
  //   setIsStatusModalVisible(false);
  // };

  const columns = [
    {
      title: "ID / Date",
      render: (text, record) => (
        <div>
          <strong>{record.id}</strong>
          <br></br>
          {record.created_at}
        </div>
      ),
    },

    // {
    //   title: "Customer Details",
    //   render: (text, record) => (
    //     <div>
    //       {record.userdetails && record.userdetails.email ? (
    //         <div>
    //           <a href={`tel:${record.userdetails.email}`}>
    //             {record.userdetails.email}
    //           </a>
    //         </div>
    //       ) : null}
    //       {record.userdetails && record.userdetails.full_name ? (
    //         <div>{record.userdetails.full_name}</div>
    //       ) : null}
    //     </div>
    //   ),
    // },

    {
      title: "Customer Details",
      render: (text, record) => (
        <div>
          {record.userdetails && record.userdetails.email ? (
            <div>
              <a href={`mailto:${record.userdetails.email}`}>
                {record.userdetails.email}
              </a>
            </div>
          ) : null}

          {record.userdetails && record.userdetails.full_name ? (
            <div>{record.userdetails.full_name}</div>
          ) : null}

          <div style={{ marginTop: 5 }}>
            <b>Remark:</b>

            <Popover
              content={
                <div style={{ maxWidth: 250 }}>
                  {record.remark_fintech || "No Remark Available"}
                </div>
              }
              title="Remark Details"
              trigger="click"
            >
              <span
                style={{
                  marginLeft: 8,
                  cursor: "pointer",
                  color: "#1890ff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 500,
                }}
              >
                <EyeOutlined />
                View
              </span>
            </Popover>
          </div>
        </div>
      ),
    },


    {
      title: "Transaction ID/ Order ID",
      render: (text, record) => (
        <div>
          <strong>Txn ID</strong> {record.tid}
          <br></br>
          <strong>Odr ID</strong> {record.orderid}
          <br></br>
          <strong>UTR Number</strong> {record.utr ? record.utr : "null"}
          <br></br>
          <strong>Gateway Name</strong>{" "}
          {record.getwayname ? record.getwayname : "null"}
        </div>
      ),
    },

    {
      title: "Transfer Amount",
      render: (text, record) => (
        <>
          <div>
            <strong>Amount</strong> {record.amount}
          </div>
          <div>
            <strong>Fees</strong> {record.fees}
          </div>
          <div>
            <strong>Set. Amt</strong> {record.subtotal}
          </div>
          <div>
            <strong>GST</strong> {record.gst.toFixed(2)}
          </div>
        </>
      ),
    },

    {
      title: "Action",
      render: (text, record) => {
        const getStatusColor = (status) => {
          switch (status) {
            case "success":
              return "green";
            case "faild":
              return "red";
            case "inprocess":
              return "#ff3100";
            case "pending":
              return "#c500ff";
            default:
              return "black";
          }
        };

        return (
          <>
            <div
              style={{
                color: getStatusColor(record.status),
                textTransform: "uppercase",
                fontFamily: "cursive",
                fontWeight: "900",
              }}
            >
              {record.status}
            </div>
            {/* {record.status == "inprocess" ? (
              <>
                <div class="btn btn-primary">
                  <Button
                    type="primary"
                    onClick={() => handleCheckStatus(record.orderid)}
                  >
                    Check Status
                  </Button>
                </div>
              </>
            ) : record.status == "pending" && record.transation_hit == "yes" ? (
              <div class="btn btn-primary">
                 <Button
                  type="primary"
                  onClick={() => handleResend(record.orderid)}
                >
                  ReSend
                </Button> 
              </div>
            ) : (
              <></>
            )} */}

            


            <br />
            <div class="btn btn-primary">
              <Button
                type="primary"
                onClick={() => handleManageClick(record.id)}
              >
                Bank Details
              </Button>
            </div>
            <br />
            <div class="btn btn-primary">
              <Button
                type="primary"
                onClick={() => handleManageClick1(record.id, record.remark)}
              >
                Gateway Remark
              </Button>
            </div>
            <br />
            <div class="btn btn-primary">
              <Button
                type="primary"
                onClick={() => handleStatusClick1(record.id, record.remark)}
              >
                Change Status
              </Button>
            </div>
            <br />
            {(record.status == "inprocess" ||
              record.status == "pending") ? (
              <>
                <div class="btn btn-primary">
                  <Button
                    type="primary"
                    onClick={() => handleCheckStatus(record.orderid)}
                  >
                    Check Status
                  </Button>
                </div>
              </>
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
    // alert(query);
    getData(query);
  }, [location]);

  // const getData = async (query) => {
  //   try {
  //     setIsTableLoading(true);
  //     const response = await payoutgetPartnerSummary(query);
  //     console.warn(response);
  //     setRecords(response.record);
  //     setPage(response.page);
  //     setPerPage(response.per_page);
  //     setTotalCount(response.total_records);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsTableLoading(false);
  //   }
  // };

  const getData = async (query) => {
    try {
      setIsTableLoading(true);

      // Prepare parameters in required format
      const params = {
        start: dates[0].format("YYYY-MM-DD"),
        end: dates[1].format("YYYY-MM-DD"),
        user_id: MerchantId,
        ...query,
      };

      const response = await payoutgetPartnerSummary(params);
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

  // const onExport = async (format) => {
  //   try {
  //     let query = parseQueryParams(location);
  //     setIsTableLoading(true);

  //     const response = await exportOrdersPayout(query);

  //     const text = await response.data.text();
  //     const jsonData = JSON.parse(text);

  //     const allPayouts = jsonData.data || jsonData;

  //     if (!allPayouts || !Array.isArray(allPayouts)) {
  //       toast.error("Invalid data received from server");
  //       return;
  //     }

  //     if (allPayouts.length === 0) {
  //       toast.error("No data available to export");
  //       return;
  //     }

  //     const processedData = processPayoutData(allPayouts);

  //     switch (format) {
  //       case "csv":
  //         exportPayoutsAsCSV(processedData);
  //         break;
  //       case "excel":
  //         exportPayoutsAsExcel(processedData);
  //         break;
  //       case "pdf":
  //         exportPayoutsAsPDF(processedData);
  //         break;
  //       default:
  //         exportPayoutsAsCSV(processedData);
  //     }
  //   } catch (err) {
  //     console.error("Export error:", err);
  //     toast.error("Export failed. Please try again.");
  //   } finally {
  //     setIsTableLoading(false);
  //   }
  // };

  function formatNumber(value) {
    const num = parseFloat(value) || 0;
    return num === 0 ? 0 : parseFloat(num.toFixed(2)); // number hi return karo
  }

  const onExport = async (format) => {
    try {
      let query = parseQueryParams(location);
      setIsTableLoading(true);

      // Add MerchantId to export query parameters
      const exportParams = {
        ...query,
        start: dates[0].format("YYYY-MM-DD"),
        end: dates[1].format("YYYY-MM-DD"),
        user_id: MerchantId // Add selected merchant ID
      };

      const response = await exportOrdersPayout(exportParams);

      const text = await response.data.text();
      const jsonData = JSON.parse(text);

      const allPayouts = jsonData.data || jsonData;

      if (!allPayouts || !Array.isArray(allPayouts)) {
        toast.error("Invalid data received from server");
        return;
      }

      if (allPayouts.length === 0) {
        toast.error("No data available to export");
        return;
      }

      const processedData = processPayoutData(allPayouts);

      switch (format) {
        case "csv":
          exportPayoutsAsCSV(processedData);
          break;
        case "excel":
          exportPayoutsAsExcel(processedData);
          break;
        case "pdf":
          exportPayoutsAsPDF(processedData);
          break;
        default:
          exportPayoutsAsCSV(processedData);
      }
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsTableLoading(false);
    }
  };

  const processPayoutData = (payouts) => {
    if (!Array.isArray(payouts)) {
      console.error(
        "processPayoutData: Expected array, got",
        typeof payouts,
        payouts,
      );
      return [];
    }

    return payouts.map((payout) => {
      if (!payout || typeof payout !== "object") {
        return {

          "Transaction ID": "",
          "Gateway Txn ID": "",
          "UTR Number": "",
          Mobile: "",
          "Order ID": "",
          Amount: "0.00",
          "Set. Amt": "0.00",
          "Transaction Fee": "0.00",
          "Reseller Fee": "0.00",
          GST: "0.00",
          Status: "",
          "Gateway Name": "",
          "Bank Name": "",
          "Account Number": "",
          "Beneficiary Name": "",
          "IFSC Code": "",
          Mode: "",
          "Merchant Name": "",
          "Merchant Email": "",
          "Date Time": "",
        };
      }

      return {

        "Transaction ID": payout.tid || "",
        "Gateway Txn ID": payout.getway_txnid || "",
        "UTR Number": payout.utr || "",
        "Mobile": payout.mobile || "",
        "Order ID": payout.orderid || "",
        //  "Amount": Math.round(Number(payout.amount)),
        "Amount": formatAmount(payout.amount),
        "Set. Amt": Math.round(Number(payout.subtotal)), // whole number
        "Transaction Fee": formatAmount(payout.transaction_fee),
        "Reseller Fee": formatAmount(payout.reserved_fee),
        "GST": formatAmount(payout.gst),
        "Status": formatStatus(payout.status),
        "Gateway Name": payout.getwayname || "",
        "Bank Name": payout.bankname || "",
        "Account Number": payout.accountnumber || "",
        "Beneficiary Name": payout.benificalname || "",
        "IFSC Code": payout.Ifsc || "",
        "Mode": payout.mode || "",
        "Merchant Name": payout.userdetails?.full_name || "",
        "Merchant Email": payout.userdetails?.email || "",
        "Date Time": payout.created_at || "",
      };
    });
  };

  function formatAmount(value) {
    const num = parseFloat(value) || 0;
    return num === 0 ? 0 : parseFloat(num.toFixed(2));
  }

  const formatStatus = (status) => {
    const statusMap = {
      1: "Success",
      0: "Failed",
      success: "Success",
      failed: "Failed",
      pending: "Pending",
      completed: "Completed",
      processed: "Processed",
      rejected: "Rejected",
    };
    return statusMap[status] || status || "Unknown";
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN");
    } catch {
      return dateString;
    }
  };

  const exportPayoutsAsCSV = (data) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => `"${String(row[header] || "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    downloadPayoutsFile(csvContent, "text/csv", "csv");
    toast.success("Payouts CSV exported successfully!");
  };

  const exportPayoutsAsExcel = (data) => {
    if (typeof window.XLSX === "undefined") {
      toast.error("Excel export library not loaded");
      return;
    }

    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, "Payouts");
    window.XLSX.writeFile(
      workbook,
      `payouts-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    toast.success("Payouts Excel exported successfully!");
  };

  const exportPayoutsAsPDF = (data) => {
    if (typeof window.jspdf === "undefined") {
      toast.error("PDF export library not loaded");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("landscape");

    doc.text("Payouts Export Report", 14, 15);

    const headers = [Object.keys(data[0])];
    const rows = data.map((row) => Object.values(row));

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 20,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [66, 135, 245] },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 15 },
        6: { cellWidth: 15 },
        7: { cellWidth: 15 },
        8: { cellWidth: 15 },
        9: { cellWidth: 20 },
        10: { cellWidth: 20 },
        11: { cellWidth: 15 },
        12: { cellWidth: 20 },
      },
    });

    doc.save(`payouts-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("Payouts PDF exported successfully!");
  };

  const downloadPayoutsFile = (content, mimeType, extension) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payouts-${new Date().toISOString().split("T")[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const onChangeFilter = (name, e, isMuilty = false) => {
    if (isMuilty) {
      setFilter((preState) => ({ ...preState, [name]: e.join(",") }));
    } else {
      setFilter((preState) => ({ ...preState, [name]: e }));
    }
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
        {
          //   id: keyword
        },
      );
      // alert('demo');
      console.warn(response.data.record.Ifsc);
      // return;
      //console.warn(response.data.records);
      // const data = await response.data.records.json();
      // console.warn(data);
      // const data =  response;

      setBankDetails(response.data.record);

      //  console.warn(response.data.records);
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
    const formData = new FormData();
    formData.append("orderid", id);

    setIsTableLoading(true);
    try {
      const response = await api.post(
        `https://api.payinfintech.com/webhook/payout/checkstatus`,
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
      console.error("Error checking status:", error);
    } finally {
      setIsTableLoading(false);
    }
  };
  const handleResend = async (id) => {
    const formData = new FormData();
    formData.append("orderid", id);

    setIsTableLoading(true);
    try {
      const response = await api.post(
        `https://api.payinfintech.com/webhook/payout/checkstatus`,
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
      console.error("Error checking status:", error);
    } finally {
      setIsTableLoading(false);
    }
  };

  // const handleStatusClick1 = (id, remark) => {
  //   setIsStatusModalVisible(remark);
  //   setIsStatusModalVisible(true);
  //        setCurrentId(id);
  // };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleStatusOk = () => {
    setIsStatusModalVisible(false);
    handleChange();
    // window.location.reload();
    // window.location.reload();
  };

  const handleStatusCancel = () => {
    setIsStatusModalVisible(false);
  };

  const payStatuses = [
    { value: "Pending", display: "Pending" },
    { value: "success", display: "Success" },
    { value: "inprocess", display: "Inprocess" },
    { value: "Faild", display: "Faild" },
  ];

  return (
    <div>
      <Row gutter={[8, 8]} justify={"space-between"} align={"middle"}>
        <Col xs={24} md={24} lg={8} xl={5}>
          <Card className="small_card">
            <SelectOptionExample
              options={payStatuses}
              onChange={(value) => {
                // setStatus(value);
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
        {/* <Select
          defaultValue="Please Select"
          onChange={handleInputChange}
          value={formData.status}
          style={{ width: '100%' }}
          options={[
            {
              value: 'success',
              label: 'success',
            },
            {
              value: 'failed',
              label: 'failed',
            },
          ]}
        /> */}
        <Select
          defaultValue=""
          onChange={handleInputChange}
          value={formData1.status}
          style={{ width: "100%", color: "black" }}
          options={[
            {
              value: "",
              label: "Please Select",
              disabled: true, // Make this option non-selectable
            },
            {
              value: "success",
              label: "success",
            },
            {
              value: "failed",
              label: "failed",
            },
          ]}
        />
      </Modal>
    </div>
  );
}
export default TransactionPayoutList;
