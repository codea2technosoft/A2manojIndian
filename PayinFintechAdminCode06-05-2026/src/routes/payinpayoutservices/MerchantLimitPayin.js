import React, { useEffect, useRef, useState } from "react";
import { TrashIcon, PencilAltIcon } from "@heroicons/react/outline";
import {
  Spin,
  Table,
  Switch,
  Space,
  message,
  Row,
  InputNumber,
  Button,
  Card,
  Modal,
  Form,
  Select,
  Col,
} from "antd";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import _ from "lodash";
import PageTitle from "components/PageTitle";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import api from "utils/api";

// request
import { updateMerchanatLimit, getMerchantCommision,deletemerchantlimitpayin } from "requests/user";
const { Option } = Select;
const MerchantLimit = () => {
  const [titles, setTitles] = useState([
    { path: "", title: "PayIn Comission Set" },
  ]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [merchantId, setMerchantId] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const searchRef = useRef(null);
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [form] = Form.useForm(); // Form instance for validation


  const segment = window.location.pathname.split("/");
  console.warn(segment[2]);

  const onDelete = (id) => {
      Modal.confirm({
        title: "Warning",
        content: "Are you sure to delete this record?",
        onOk: async () => {
          try {
            await deletemerchantlimitpayin(id);
            message.success('Record deleted successfully!');
            onRefresh();
          } catch (err) {
            console.log(err);
            message.error('Failed to delete record');
          }
        },
      });
    };


  const columns = [
    {
      title: "Min TA",
      dataIndex: "startamount",
      key: "startamount",
      render: (text, record) => {
        return (
          <InputNumber
            size="small"
            defaultValue={text}
            onChange={(value) => onUpdate(record.id, { startamount: value })}
          />
        );
      },
    },

    {
      title: "Max TA",
      dataIndex: "endamount",
      key: "endamount",
      render: (text, record) => {
        return (
          <InputNumber
            size="small"
            defaultValue={text}
            onChange={(value) => onUpdate(record.id, { endamount: value })}
          />
        );
      },
    },

    {
      title: "Type",
      key: "type",
      dataIndex: "type",
       render: (text) => toSentenceCase(text)
    },

    {
      title: "Transaction fee (%)",
      dataIndex: "transationcommission",
      key: "transationcommission",
      render: (text, record) => {
        return (
          <InputNumber
            size="small"
            defaultValue={text}
            onChange={(value) =>
              onUpdate(record.id, { transationcommission: value })
            }
          />
        );
      },
    },
    {
      title: "Reseller fee (%)",
      dataIndex: "resellercommission",
      key: "resellercommission",
      render: (text, record) => {
        return (
          <InputNumber
            size="small"
            defaultValue={text}
            onChange={(value) =>
              onUpdate(record.id, { resellercommission: value })
            }
          />
        );
      },
    },


       {
      title: "Payment Method",
      key: "paymentMethod",
      dataIndex: "paymentMethod",
      render: (text) => toSentenceCase(text)
    },

    {
          title: "Actions",
          render: (text, record) => (
            <Space>
              <Button
                danger
                type="link"
                size="small"
                onClick={() => onDelete(record.id)}
              >
                <TrashIcon width={24} height={24} />
              </Button>
            </Space>
          ),
        },


  ];

  const toSentenceCase = (str) => {
  return str
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};


  useEffect(() => {
    const query = parseQueryParams(location);
    getRecords(query);
  }, [location]);

  const getRecords = async (query) => {
    try {
      const segment = window.location.pathname.split("/");
      console.warn(segment[2]);
      const merchantIDClient = segment[2];

      setIsTableLoading(true);

      const formData = new FormData();
      formData.append("merchant_id", merchantIDClient);
      formData.append("commissiontype", "payin");

      const response = await api.post(
        "/admin/partner/merchant-commission-list",
        formData,
        {}
      );

      console.warn(response.data.data);
      setRecords(response.data.data);
      setPage(response.page);
      setPerPage(response.per_page);
      setTotalCount(response.total_records);
    } catch (err) {
      console.log(err);
    } finally {
      setIsTableLoading(false);
    }
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

  const showModal = (merchantId) => {
    const segment = window.location.pathname.split("/");
    console.warn(segment[2]);
    setMerchantId(segment[2]);
    setIsModalVisible(true);
    // Reset form with default values when modal opens
    form.setFieldsValue({
      startamount: null,
      endamount: null,
      type: "flat",
      paymentMethod: "upi",
      transationcommission: null,
      resellercommission: null,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Remove individual handleInputChange functions since form will handle state

  const handleAddLimit = async () => {
    if (btnLoading) return;

    try {
      // Validate all fields
      const values = await form.validateFields();
      
      const requestData = {
        merchant_id: merchantId,
        startamount: values.startamount,
        endamount: values.endamount,
        type: values.type,
        paymentMethod: values.paymentMethod,
        resellercommission: values.resellercommission,
        transationcommission: values.transationcommission,
        commissiontype: "payin",
      };

      setBtnLoading(true);

      const response = await api.post(
        "admin/partner/merchant-commission-store",
        requestData
      );
      
      console.warn("API response:", response.data);
      message.success("Limit added successfully!");
      getRecords();
      setIsModalVisible(false);
      
    } catch (error) {
      if (error.errorFields) {
        // Form validation errors - Antd will automatically show these
        console.log("Form validation failed");
      } else {
        // API error
        console.error("API error:", error);
        message.error("Failed to add limit");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  const onRefresh = () => {
    let query = parseQueryParams(location);
    query = {
      page: 1,
      keyword: "",
    };

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });

    if (searchRef.current?.input.value) {
      searchRef.current.handleReset();
    }
  };

  const onChangeTable = (pagination) => {
    console.log(pagination);

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

  const onUpdate = _.debounce(async (id, data) => {
    try {
      setIsTableLoading(true);
      await updateMerchanatLimit(id, data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsTableLoading(false);
    }
  }, 500);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div>
      <div className="overviewBorder">
        <Row justify="space-between" align="middle">
          <Card className="small_card">
            <PageTitle titles={titles} />
          </Card>
          <Card className="small_card">
            <Button type="primary" onClick={() => showModal()}>
              Add Limit
            </Button>
          </Card>
          <Card className="small_card">
            <Link to="/payin-payout">
              <Button type="primary" size="large">
                <span style={{ marginRight: "7px", fontSize: "18px" }}>
                  &larr;
                </span>{" "}
                Back
              </Button>
            </Link>
          </Card>
        </Row>
      </div>
      <Spin spinning={isTableLoading}>
        <Table
          style={{ marginTop: "10px" }}
          dataSource={records}
          columns={columns}
          onChange={onChangeTable}
          rowKey={"id"}
          scroll={{
            x: true,
          }}
        />
      </Spin>
      
      <Modal
        title="Add Limit"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleAddLimit}
        okButtonProps={{ loading: btnLoading }}
      >
        <Form 
          layout="vertical"
          form={form}
          // Remove onFinish to prevent double validation
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item 
                label="Start Amount"
                name="startamount"
                rules={[
                  { 
                    required: true, 
                    message: "Please enter start amount" 
                  }
                ]}
              >
                <InputNumber
                  placeholder="Enter Start Amount"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="End Amount"
                name="endamount"
                rules={[
                  { 
                    required: true, 
                    message: "Please enter end amount" 
                  }
                ]}
              >
                <InputNumber
                  placeholder="Enter End Amount"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item 
                label="Type" 
                name="type"
                rules={[{ required: true, message: "Please select type" }]}
              >
                <Select placeholder="Select Type">
                  <Option value="flat">Flat</Option>
                  <Option value="percent">Percent</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item 
                label="Payment Methods" 
                name="paymentMethod"
                rules={[{ required: true, message: "Please select payment method" }]}
              >
                <Select placeholder="Select Payment Method">
                  <Option value="debit_card">Debit Card</Option>
                  <Option value="credit_card">Credit Card</Option>
                  <Option value="upi">UPI</Option>
                  <Option value="qr_code">QR Code</Option>
                  <Option value="net_banking">Net Banking</Option>
                  <Option value="wallet">Wallet</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item 
                label="Transaction Commission"
                name="transationcommission"
                rules={[
                  { 
                    required: true, 
                    message: "Please enter transaction commission" 
                  }
                ]}
              >
                <InputNumber
                  placeholder="Enter Transaction Commission"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item 
                label="Reseller Commission"
                name="resellercommission"
                rules={[
                  { 
                    required: true, 
                    message: "Please enter reseller commission" 
                  }
                ]}
              >
                <InputNumber
                  placeholder="Enter Reseller Commission"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
export default MerchantLimit;