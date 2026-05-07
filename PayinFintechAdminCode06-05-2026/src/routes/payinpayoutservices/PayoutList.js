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
import { updateUserOfPartner, getPartner } from "requests/user";
const { Option } = Select;
const PayoutList = () => {
  const [titles, setTitles] = useState([{ path: "", title: "Payout Charge" }]);
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

  const columns = [
    {
      title: "Merchant Details",
      key: "full_name",
      dataIndex: "full_name",
      render: (text, record) => (
        <div>
          {/* <Link to={`${location.pathname}/${record.id}`}> */}
          <strong>{text}</strong>
          <div>
            <a href={`mailto:${record.email}`}>{record.email}</a>
          </div>
          <div>
            <a href={`tel:${record.mobile}`}>{record.mobile}</a>
          </div>
        </div>
      ),
      width: 150,
    },
    {
      title: "Payment status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <Switch
            defaultChecked={text === 0 ? false : true}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onChange={(value) => onUpdate(record.id, { status: Number(value) })}
          />
        );
      },
    },
    {
      title: "Min TA",
      dataIndex: "min_payout",
      key: "min_payout",
      render: (text, record) => {
        return (
          <InputNumber
            size="small"
            defaultValue={text}
            onChange={(value) => onUpdate(record.id, { min_payout: value })}
          />
        );
      },
    },
    {
      title: "Max TA",
      dataIndex: "max_payout",
      key: "max_payout",
      render: (text, record) => {
        return (
          <InputNumber
            size="small"
            defaultValue={text}
            onChange={(value) => onUpdate(record.id, { max_payout: value })}
          />
        );
      },
    },

    {
      title: "Set Limit",
      render: (record) => (
        <Link to={`/set-merchant-limit/${record.id}`}>
          <Button className="gradiant_btn">Set Limit</Button>
        </Link>
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
      const response = await getPartner(params.id, query);
      setRecords(response.records);
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
      await updateUserOfPartner(params.id, id, data);
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
    </div>
  );
};
export default PayoutList;
