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
import TableBar from "components/TableBar";
import { toast } from "react-toast";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { getOverviewadminmerchantList } from "requests/statistic";

import { BaseSelect } from "components/Elements";
import api from "utils/api";
import "assets/styles/orders.scss";
import { payoutgetPartnerSummary } from "requests/statistic";

const { RangePicker } = DatePicker;

const titles = [{ title: "Account Payout Report" }];

function TransactionAccountPayoutReporttList() {
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

  // State for submit button
  const [submitStartDate, setSubmitStartDate] = useState(null);
  const [submitEndDate, setSubmitEndDate] = useState(null);
  const [submitRecords, setSubmitRecords] = useState([]);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const onSetmerchant = (mode) => {
    setmerchantSelected(mode);
    setMerchantid(mode);
  };

  // Handle date change for submit
  const handleSubmitDateChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      setSubmitStartDate(dates[0]);
      setSubmitEndDate(dates[1]);
    } else {
      setSubmitStartDate(null);
      setSubmitEndDate(null);
    }
  };

  // Submit function to call API
  const handleSubmit = async () => {
    if (!MerchantId) {
      toast.error("Please select a merchant first");
      return;
    }

    if (!submitStartDate || !submitEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    setIsSubmitLoading(true);
    try {
      const formattedStartDate = submitStartDate.format("YYYY-MM-DD");
      const formattedEndDate = submitEndDate.format("YYYY-MM-DD");

      const response = await api.get(
        `admin/partner/payout-partners-list-accountwaise?start=${formattedStartDate}&end=${formattedEndDate}&merchantid=${MerchantId}`
      );

      console.log("API Response:", response.data);

      // Set response to table
      if (response.data && response.data.record) {
        setSubmitRecords(response.data.record);
        setTotalCount(response.data.total_records || response.data.record.length);
      } else if (response.data && Array.isArray(response.data)) {
        setSubmitRecords(response.data);
        setTotalCount(response.data.length);
      } else if (response.data && response.data.data) {
        setSubmitRecords(response.data.data);
        setTotalCount(response.data.total || response.data.data.length);
      } else {
        setSubmitRecords([]);
        setTotalCount(0);
      }

      toast.success("Data fetched successfully");
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch data");
      setSubmitRecords([]);
      setTotalCount(0);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  useEffect(() => {
    getDatamerchant(dates);
  }, [dates]);

  // useEffect(() => {
  //   const query = parseQueryParams(location);
  //   getData(query);
  // }, [location, dates, MerchantId]);

  const getDatamerchant = async (dates) => {
    try {
      const filters = {
        start: dates[0].format("YYYY-MM-DD"),
        end: dates[1].format("YYYY-MM-DD"),
      };
      const response = await getOverviewadminmerchantList(filters);
      setMerchantdatas(response.data);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
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

      // const query = parseQueryParams(location);
      // getData(query);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error fetching manager list:", error);
      toast.error("Failed to update status");
    } finally {
      setIsTableLoading(false);
    }
  };

  const columns = [
     {
    title: "S.No",
    key: "index",
    render: (text, record, index) => (
      <div>
        <strong>{index + 1}.</strong>
      </div>
    ),
  },

   

  {
  title: "Account Details",
  render: (text, record) => (
    <div style={{ lineHeight: "1.6" }}>
      <div><strong>Account No:</strong> {record.accountnumber || "-"}</div>
      <div><strong>Bank:</strong> {record.bankname || "-"}</div>
      <div><strong>Name:</strong> {record.benificalname || "-"}</div>
      <div><strong>IFSC:</strong> {record.Ifsc || "-"}</div>
    </div>
  ),
},

    {
      title: "Total Amount",
      render: (text, record) => (
        <div>
          <strong>₹</strong> {record.total_amount}
          <br></br>
        </div>
      ),
    },
    

    
    {
      title: "Sub Total Amount",
      render: (text, record) => (
        <div>
          <strong>₹</strong> {record.total_subtotal}
          <br></br>
        </div>
      ),
    },


     
   {
  title: "Action",
  render: (text, record) => (
    <Button
      type="primary"
      onClick={() => navigate(`/transaction-account-payout-report-details/${record.accountnumber}`)}
    >
      View Details
    </Button>
  ),
}

    

    // {
    //   title: "Transfer Amount",
    //   render: (text, record) => (
    //     <>
    //       <div>
    //         <strong>Amount</strong> {record.amount}
    //       </div>
    //       <div>
    //         <strong>Fees</strong> {record.fees}
    //       </div>
    //       <div>
    //         <strong>Set. Amt</strong> {record.subtotal}
    //       </div>
    //       <div>
    //         <strong>GST</strong> {record.gst}
    //       </div>
    //     </>
    //   ),
    // },

    // {
    //   title: "Action",
    //   render: (text, record) => {
    //     const getStatusColor = (status) => {
    //       switch (status) {
    //         case "success":
    //           return "green";
    //         case "faild":
    //           return "red";
    //         case "inprocess":
    //           return "#ff3100";
    //         case "pending":
    //           return "#c500ff";
    //         default:
    //           return "black";
    //       }
    //     };

    //     return (
    //       <>
    //         <div
    //           style={{
    //             color: getStatusColor(record.status),
    //             textTransform: "uppercase",
    //             fontFamily: "cursive",
    //             fontWeight: "900",
    //           }}
    //         >
    //           {record.status}
    //         </div>
    //         {record.status == "inprocess" ? (
    //           <>
    //             <div class="btn btn-primary">
    //               <Button
    //                 type="primary"
    //                 onClick={() => handleCheckStatus(record.orderid)}
    //               >
    //                 Check Status
    //               </Button>
    //             </div>
    //           </>
    //         ) : record.status == "pending" && record.transation_hit == "yes" ? (
    //           <div class="btn btn-primary">
    //           </div>
    //         ) : (
    //           <></>
    //         )}

    //         <br />
    //         <div class="btn btn-primary">
    //           <Button
    //             type="primary"
    //             onClick={() => handleManageClick(record.id)}
    //           >
    //             Bank Details
    //           </Button>
    //         </div>
    //         <br />
    //         <div class="btn btn-primary">
    //           <Button
    //             type="primary"
    //             onClick={() => handleManageClick1(record.id, record.remark)}
    //           >
    //             Gateway Remark
    //           </Button>
    //         </div>
    //         <br />
    //         <div class="btn btn-primary">
    //           <Button
    //             type="primary"
    //             onClick={() => handleStatusClick1(record.id, record.remark)}
    //           >
    //             Change Status
    //           </Button>
    //         </div>
    //       </>
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    const query = parseQueryParams(location);
    // getData(query);
  }, [location]);

  // const getData = async (query) => {
  //   try {
  //     setIsTableLoading(true);
  //     const params = {
  //       start: dates[0].format("YYYY-MM-DD"),
  //       end: dates[1].format("YYYY-MM-DD"),
  //       user_id: MerchantId,
  //       ...query,
  //     };

  //     const response = await payoutgetPartnerSummary(params);
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
        },
      );
      console.warn(response.data.record.Ifsc);

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
    const formData = new FormData();
    formData.append("orderid", id);

    setIsTableLoading(true);
    try {
      const response = await api.post(
        `https://api.click4pay.in/webhook/payout/checkstatus`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      // const query = parseQueryParams(location);
      // getData(query);
      toast.success("Status checked successfully");
    } catch (error) {
      console.error("Error checking status:", error);
      toast.error("Failed to check status");
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
        `https://api.click4pay.in/admin/partner/resend-update-status-payout`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      // const query = parseQueryParams(location);
      // getData(query);
      toast.success("Resend successful");
    } catch (error) {
      console.error("Error checking status:", error);
      toast.error("Failed to resend");
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

  return (
    <div>
      <Row gutter={[8, 8]} justify={"space-between"} align={"middle"}>
        {/* <Col xs={24} sm={24} md={24} lg={8} xl={5}>
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
        </Col> */}

        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
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
        </Col>

        <Col xs={24} md={24} lg={8} xl={8}>
          <RangePicker
            onChange={handleSubmitDateChange}
            format="YYYY-MM-DD"
            allowClear={true}
            onClear={() => {
              setSubmitStartDate(null);
              setSubmitEndDate(null);
              setSubmitRecords([]);
              setTotalCount(0);
            }}
            placeholder={['Start Date', 'End Date']}
            style={{ width: '250px' }}  // Width 350px
            size="large"  // Large size
          />


        </Col>
        <Col xs={24} md={24} lg={4} xl={4}>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            loading={isSubmitLoading}
          >
            Submit
          </Button>

        </Col>
      </Row>

      <Table
        loading={isSubmitLoading || isTableLoading}
        dataSource={submitRecords.length > 0 ? submitRecords : records}
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
export default TransactionAccountPayoutReporttList;