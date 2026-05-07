import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Space, Row, Col, Card, Table, DatePicker, Modal, Select } from "antd";
import dayjs from "dayjs";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import { toast } from "react-toast";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
// import FilterDrawer from "./FilterDrawer";
import { omitBy, isEmpty } from "lodash";

import {
  ChevronDownIcon,
  RefreshIcon,
  MenuAlt1Icon,
  ViewGridIcon,
} from "@heroicons/react/outline";
import { BaseSelect } from "components/Elements";
// import OrderCardView from "./OrderCardView";
// import OrderListView from "./OrderListView";
import api from "utils/api";
// styles
import "assets/styles/orders.scss";
// request
import { payoutgetPartnerSummary } from "requests/statistic";
import { getOrders, exportOrders } from "requests/order";
import {fetchData1} from 'requests/user';

const { RangePicker } = DatePicker;

const titles = [{ title: "Payout Transaction" }];
// const handleChange = (value) => {
//   console.log(`selected ${value}`);
// };





function TransactionPaypalList() {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
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
  const [modalContent, setModalContent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentRemark, setCurrentRemark] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [formData1, setFormData] = useState({
    // company_id: "",
    status: ""

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
      console.error('No ID available');
      return;
    }
    if (!formData1.status) {
      console.error('No status available');
      return;
    }

    console.warn(currentId, currentRemark);

    // Create FormData object
    const formData = new FormData();
    formData.append('id', currentId);
    formData.append('status', formData1.status);

    setIsTableLoading(true);
    try {
      const response = await api.post(`admin/partner/payout-partners-change-status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.warn(response.data.record.Ifsc);
      // setBankDetails(response.data.record)
  
        // const query = parseQueryParams(location);
        // getRecords(query);
      
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
    { title: 'PayPal ID', dataIndex: 'paypal_id', key: 'paypal_id' },
    {
      title: 'Captures',
      key: 'captures',
      render: (text, records) => (
        <>
          <strong>Id:</strong> {records.captures_id} <br />
          <strong>Amount:</strong> {records.captures_amount} <br />
          <strong>C.code:</strong> {records.captures_currency_code} <br />
          <stront>Status:</stront> {records.captures_status}
        </>
      ),
    },
    {
      title: 'User Details',
      key: 'user',
      render: (text, records) => (
        <>
          {records.user ? (
            <>
              <strong>Name:</strong> {records.user.full_name} <br />
              <strong>Email:</strong> {records.user.email} <br/>
              <strong>Mobile:</strong> {records.user.mobile}
            </>
          ) : (
            'null'
          )}
        </>
      ),
    },
    {
      title: 'Payer',
      key: 'payer',
      render: (text, records) => (
        <>
          <strong>Email:</strong> {records.payer_email_address} <br />
          <strong>PayerId:</strong> {records.payer_payer_id}
        </>
      ),
    },
    {
      title: 'PayPal',
      key: 'paypal',
      render: (text, records) => (
        <>
          <strong>Email:</strong> {records.paypal_email_address} <br />
          <strong>Status:</strong> {records.paypal_account_status}
        </>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (text, records) => (
        <div className="text-center">
          <span className={getStatusClass(records.captures_status)}>{records.captures_status}</span>
        </div>
      ),
    },
  ];


  useEffect(() => {
    const query = parseQueryParams(location);
    getRecords(query);
  }, [location]); 

  const getRecords = async (query) => {
    try {
      setIsTableLoading(true);
      const response = await fetchData1(query, page, perPage);
      setRecords(response.records);
      setPage(response.page);
      setPerPage(response.per_page);
      console.warn("response.total_records",response.totalcount)
      setTotalCount(response.totalcount);
    } catch (err) {
      console.log(err);
    } finally {
      setIsTableLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED': return 'badge bg-success';
      case 'PENDING': return 'badge bg-warning text-dark';
      case 'FAILED': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  const onChangeTable = (pagination, filters, sorter, extra) => {
    let query = parseQueryParams(location);
    query = {
      ...query,
      page: pagination.current,
      per_page: pagination.pageSize,
    };
  console.warn("query",query)
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
  
    // Update the pagination state
    setPage(pagination.current);
    setPerPage(pagination.pageSize);
  
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
      const response = await exportOrders(query);
      window.open(
        `${process.env.REACT_APP_ASSET_URL}${response.filepath}`,
        "_blank"
      );
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
  // const handleStatusClick1 = (id, remark) => {
  //   setIsStatusModalVisible(remark);
  //   setIsStatusModalVisible(true);
  //        setCurrentId(id);
  // };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  // const disabledRowIds = [436, 438];

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectedRowKeys(selectedRowKeys);
  //   ;
  //   },
  //   getCheckboxProps: (records) => {
  //     return {
  //       disabled: disabledRowIds.includes(records.id),
  //     };
  //   },
  // };

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


  return (
    <div>
      <Row gutter={[8, 8]} justify={"space-between"} align={"middle"}>
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

      {/* <Table
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        onChange={onChangeTable}
        rowKey="id"
        pagination={{
          pageSize: perPage,
          total: totalCount,
          current: page,
        }}
        scroll={{
          x: true,
        }}
      /> */}

<Table
  columns={columns}
  dataSource={records}
  rowKey="id"
  loading={isTableLoading}
  onChange={onChangeTable}
  pagination={{
    current: page,
    pageSize: perPage,
    total: totalCount,
  }}
  scroll={{ x: true }} // or any other scroll setting you need
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

      <Modal title="Reason" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>{modalContent}</p>
      </Modal>

      <Modal title="Select Option" visible={isStatusModalVisible} onOk={handleStatusOk} onCancel={handleStatusCancel}>
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
          style={{ width: '100%', color: 'black' }}
          options={[
            {
              value: '',
              label: 'Please Select',
              disabled: true, // Make this option non-selectable
            },
            {
              value: 'success',
              label: 'success',
            },
            {
              value: 'failed',
              label: 'failed',
            },
          ]}
        />

      </Modal>
    </div>
  );
}
export default TransactionPaypalList;
