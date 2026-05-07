import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import api from "utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Button,
  InputNumber,
  message,
  Row,
  DatePicker,
  Modal,
  Card,
  Col,
  Input,
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
  getWalletPendingreport,
  exportOrders,
} from "requests/order";
const { RangePicker } = DatePicker;
const titles = [{ title: "Pending Transaction" }];
function WalletPending() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [adminDepositAmt, setadminDepositAmt] = useState(0);
  const [payintopayoutAmt, setpayintopayoutAmt] = useState(0);
  const [directAmt, setdirectAmt] = useState(0);
  const [records, setRecords] = useState([]);
  const [imageURL, setImageURL] = useState([]);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState(null);
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const config = useSelector((state) => state.config);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancellationId, setCancellationId] = useState(null);

  const segment = window.location.pathname.split("/");
  const idname = segment[2];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(null);
  const [disabledId, setDisabledId] = useState(null);
  const { id } = useParams();

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount(null);
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
      const response = await getWalletPendingreport(query, idname);
      setImageURL(response.url);
      if (response && response.data && Array.isArray(response.data)) {
        console.warn(response.data);
        setRecords(response.data);
        setadminDepositAmt(response.adminDeposit);
        setpayintopayoutAmt(response.payintopayout);
        setdirectAmt(response.direct);
        setPage(response.page);
        setPerPage(response.per_page);
        setTotalCount(response.total_records);
      } else {
        console.error("Invalid response format or data");
        alert("Invalid response format or data");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTableLoading(false);
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

  // const onExport = async () => {
  //   try {
  //     let query = parseQueryParams(location);
  //     setIsTableLoading(true);
  //     if (query.start && query.end) {
  //       const response = await exportOrders(query);
  //     } else {
  //       const today = dayjs();
  //       const defaultDateMin = today.startOf("day");
  //       const defaultDateMax = today.endOf("day");
  //       query.start = defaultDateMin.format("YYYY-MM-DD");
  //       query.end = defaultDateMax.format("YYYY-MM-DD");
  //       const response = await exportOrders(query);

  //       if (response && response.filepath) {
  //         window.open(
  //           `https://api.payinfintech.com/files/${response.filepath}`,
  //           "_blank"
  //         );
  //       } else {
  //         throw new Error("Invalid response data");
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("An error occurred. Please try again.");
  //   } finally {
  //     setIsTableLoading(false);
  //   }
  // };
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

    const token = getCookie("sob_token");
    if (!token) {
      message.error("Authentication token missing");
      return;
    }

    const payload = {
      user_id: Number(id), // URL se aaya hua ID
      settled_amount: amount,
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

      // ✅ Handle API response
      if (response.data.status) {
        message.success("Manual settlement successful");
        console.log("API Response:", response.data);
        closeModal(); // Close modal only if success
      } else {
        // status false → show message but don't close modal
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
      title: "Data",
      key: "created_at",
      dataIndex: "created_at",
    },

    {
      title: "Image",
      key: "image",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={`${imageURL}/${record.image}`}
          style={{ maxWidth: "50px", maxHeight: "50px" }}
        />
      ),
    },

    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
    },
    {
      title: "Payment Entry",
      key: "entry_type",
      dataIndex: "entry_type",
    },

    {
      title: "Mode",
      key: "mode",
      dataIndex: "mode",
    },

    {
      title: "RRN Number",
      key: "rrn_number",
      dataIndex: "rrn_number",
    },
    {
      title: "Remark",
      key: "remark",
      dataIndex: "remark",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },

    {
      title: "Verify",
      render: (record) => {
        if (record.status === "pending") {
          return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={() => handleVerify(record.id)}
                disabled={disabledId === record.id}
              >
                Verify
              </Button>
              <Button
                onClick={() => {
                  setCancellationId(record.id);
                  setIsModalVisible(true);
                }}
              >
                Cancel
              </Button>
            </div>
          );
        }
      },
    },
  ];

  const handleVerify = async (id) => {
    try {
      const confirmVerify = window.confirm(
        "Are you sure you want to verify this topup?",
      );

      if (!confirmVerify) return;
      setDisabledId(id);
      const response = await api.post(
        `admin/partner/Do-topupsuccess/${id}`,
        {},
      );
      console.warn(response.data);
      if (response.data.status == true) {
        toast.success(response.data.message);
        getRecords();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  const handleCancel = async () => {
    try {
      if (!cancellationId) {
        console.error("No record id provided for cancellation");
        return;
      }

      const response = await api.post(
        `admin/partner/Do-topupfaild/${cancellationId}`,
        {
          remark: cancelReason,
        },
      );

      console.warn(response.data);
      if (response.data.status == true) {
        toast.success(response.data.message);
        getRecords();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during verification cancellation:", error);
    }
    setIsModalVisible(false);
    setCancelReason("");
    setCancellationId(null);
  };

  return (
    <div className="wrap-orders transaction">
      {/* <PageTitle titles={titles} /> */}
      <Row gutter={[16, 16]} justify={"space-between"} align={"middle"}>
        <Col xs={24} sm={24} md={24} lg={6} xl={8}>
          <Card className="round_card">
            <TableBar
              className="mb-0"
              placeholderInput="Search Records"
              onSearch={onSearch}
              onFilter={onToggleFilter}
              isActiveFilter={isShowFilter}
              inputRef={searchRef}
              showFilter={false}
            />
          </Card>
        </Col>

        {/* <Col xs={24} sm={24} md={24} lg={12} xl={9}>
          <Card className="round_card">
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                <RangePicker
                  value={dates}
                  onCalendarChange={(newDates) => onChangeDates(newDates)}
                />
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                <Button type="primary" size="large" onClick={onExport}>
                  {" "}
                  Export{" "}
                </Button>
              </Col>
            </Row>
          </Card>
        </Col> */}

        <Col xs={24} sm={24} md={24} lg={6} xl={8}>
          <Card className="round_card">
            <Row>
              <Col xs={24} sm={24} md={24} lg={18} xl={24}>
                <RangePicker
                  value={dates}
                  onCalendarChange={(newDates) => onChangeDates(newDates)}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        {/* <Col xs={24} sm={24} md={24} lg={6} xl={6}>
          <Card className="round_card">
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Button type="primary" size="large" onClick={openModal}>
                  Payin Manual Settlement
                </Button>
              </Col>
            </Row>
          </Card>
        </Col> */}

        {/* Modal */}
        <Modal
          title="Manual Settlement"
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={closeModal}
          okText="Submit"
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter amount"
            value={amount}
            min={1} // 1 se start
            step={1}
            precision={0} // only integers
            stringMode={false} // ensure number type
            onChange={(value) => {
              // ignore invalid input
              if (typeof value === "number" && !isNaN(value) && value >= 1) {
                setAmount(value);
              } else {
                setAmount(null); // reset if character/0/negative
              }
            }}
          />
        </Modal>
      </Row>
      <Row className="gap-2 mt-2">
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <div className="payintopayoutnew box1">
            <div className="payintopayoutnew-header">Admin Deposit Amount</div>
            <div className="payintopayoutnew-body">
              <FaRupeeSign />
              {adminDepositAmt}
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <div className="payintopayoutnew box4">
            <div className="payintopayoutnew-header">
              Payin To Payout Amount
            </div>
            <div className="payintopayoutnew-body">
              <FaRupeeSign />
              {payintopayoutAmt}
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={6}>
          <div className="payintopayoutnew box3">
            <div className="payintopayoutnew-header">Direct Amount</div>
            <div className="payintopayoutnew-body">
              <FaRupeeSign />
              {directAmt}
            </div>
          </div>
        </Col>
      </Row>
      <Modal
        title="Cancel Verification"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleCancel}>
            Submit
          </Button>,
        ]}
      >
        <label>Reason for cancellation:</label>
        <Input.TextArea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </Modal>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={records}
        loading={isTableLoading}
        pagination={{
          pageSize: perPage,
          total: totalCount,
          current: page,
          onChange: (page, pageSize) =>
            onChangeTable({ current: page, pageSize: pageSize }, {}, {}, {}),
        }}
        onChange={onChangeTable}
        scroll={{
          x: true,
        }}
      />
    </div>
  );
}
export default WalletPending;
