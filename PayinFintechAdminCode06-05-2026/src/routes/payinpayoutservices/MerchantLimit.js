import React, { useEffect, useRef, useState } from "react";
import {
  Spin,
  Table,
  Switch,
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
import { updateMerchanatLimit, getMerchantCommision } from "requests/user";
const { Option } = Select;
const MerchantLimit = () => {
  const [titles, setTitles] = useState([
    { path: "", title: "Payout Comission Set" },
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

  const segment = window.location.pathname.split("/");
  console.warn(segment[2]);

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
  ];

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
      formData.append("commissiontype", "payout");

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

  const [formData, setFormData] = useState({
    startamount: null,
    endamount: null,
    type: "flat",
    commission: null,
  });

  const showModal = (merchantId) => {
    const segment = window.location.pathname.split("/");
    console.warn(segment[2]);
    setMerchantId(segment[2]);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleTypeChange = (value) => {
    handleInputChange("type", value);
  };

  const handleAddLimit = async () => {
    const requestData = {
      merchant_id: merchantId,
      startamount: formData.startamount,
      endamount: formData.endamount,
      type: formData.type,
      resellercommission: formData.resellercommission,
      transationcommission: formData.transationcommission,
      commissiontype: "payout",
    };

    try {
      const response = await api.post(
        "admin/partner/merchant-commission-store",
        requestData
      );
      console.warn("API response:", response.data);
      getRecords();
      setIsModalVisible(false);
    } catch (error) {
      console.error("API error:", error);
      console.log("hello");
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
      >
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            <Col g={12} md={12} sm={24} xs={24}>
              <Form.Item label="Start Amount">
                <InputNumber
                  value={formData.startamount}
                  onChange={(value) => handleInputChange("startamount", value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col g={12} md={12} sm={24} xs={24}>
              <Form.Item label="End Amount">
                <InputNumber
                  value={formData.endamount}
                  onChange={(value) => handleInputChange("endamount", value)}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Form.Item label="Type" style={{ width: "100%" }}>
              <Select value={formData.type} onChange={handleTypeChange}>
                <Option value="flat">Flat</Option>
                <Option value="percent">Percent</Option>
              </Select>
            </Form.Item>
          </Row>

          <Row gutter={[16, 16]}>
            <Col g={12} md={12} sm={24} xs={24}>
              <Form.Item label="Transation Commission">
                <InputNumber
                  value={formData.transationcommission}
                  onChange={(value) =>
                    handleInputChange("transationcommission", value)
                  }
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col g={12} md={12} sm={24} xs={24}>
              <Form.Item label="Reseller Commission">
                <InputNumber
                  value={formData.resellercommission}
                  onChange={(value) =>
                    handleInputChange("resellercommission", value)
                  }
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
