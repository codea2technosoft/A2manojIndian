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
} from "antd";
import dayjs from "dayjs";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import { toast } from "react-toast";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import FilterDrawer from "./FilterDrawer";
import { omitBy, isEmpty } from "lodash";
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
    process.env.REACT_APP_RECORDS_PER_PAGE
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
        }
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

    {
      title: "Customer Details",
      render: (text, record) => (
        <div>
          {record.userdetails && record.userdetails.email ? (
            <div>
              <a href={`tel:${record.userdetails.email}`}>
                {record.userdetails.email}
              </a>
            </div>
          ) : null}
          {record.userdetails && record.userdetails.full_name ? (
            <div>{record.userdetails.full_name}</div>
          ) : null}
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
            <strong>GST</strong> {record.gst}
          </div>
        </>
      ),
    },

    // {
    //   title: "Amount Transfer Portal",
    //   render: (text, record) => <div>{record.portal_entry}</div>,
    // },

    // {
    //   title: "Amount Transfer Bank/ Payout",
    //   render: (text, record) => (
    //     <>
    //       <div style={{ color: "green" }}>{record.fund_tranfer}</div>
    //       <div style={{ marginTop: 10 }}>
    //         {record.fund_tranfer == "bank" ? (
    //           <div class="btn btn-primary">
    //             <Button
    //               type="primary"
    //               onClick={() => handleManageClick(record.id)}
    //             >
    //               Bank Details
    //             </Button>
    //           </div>
    //         ) : null}
    //       </div>
    //     </>
    //   ),
    // },

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
            {record.status == "inprocess" ? (
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
            )}

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

  const getData = async (query) => {
    try {
      setIsTableLoading(true);
      const response = await payoutgetPartnerSummary(query);
      console.warn(response);
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

  const onExport = async () => {
    try {
      let query = parseQueryParams(location);

      setIsTableLoading(true);
      const response = await exportOrdersPayout(query);
      // alert(response.filepath);
      if (response.filepath) {
        window.open(
          `${process.env.REACT_APP_ASSET_URL}${response.filepath}`,
          "_blank"
        );
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsTableLoading(false);
    }
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
        }
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
        }
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
        `https://api.payinfintech.com/admin/partner/resend-update-status-payout`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
        <Col xs={24} md={24} lg={8} xl={6}>
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
        <Col xs={24} md={24} lg={8} xl={6}>
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
        <Col xs={24} md={24} lg={10} xl={8}>
          <Card className="small_card">
            <Space>
              <RangePicker
                onCalendarChange={(newDates) => onChangeDates(newDates)}
              />

              <Button type="primary" size="large" onClick={onExport}>
                Export
              </Button>
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
