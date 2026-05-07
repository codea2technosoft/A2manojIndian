import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Row,
  Select,
  Spin,
  Table,
  Button,
  Modal,
  Card,
  Col,
  Space,
} from "antd";
import TableBar from "components/TableBar";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "utils/api";
import PageTitle from "components/PageTitle";
import { Delete } from "react-iconly";
const { Option } = Select;

const BeneficiallyData = () => {
  const config = useSelector((state) => state.config);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState(null);
 
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const segment = window.location.pathname.split("/");
  console.warn(segment[2]);

  const columns = [
    {
      title: "Beneficiary Name",
      key: "name",
      dataIndex: "name",
    },

    {
      title: "Account Number",
      key: "account_number",
      dataIndex: "account_number",
    },

    {
      title: "IFSC Code",
      key: "ifsc_code",
      dataIndex: "ifsc_code",
    },

    {
      title: "Bank Name",
      key: "bank_name",
      dataIndex: "bank_name",
    },

    // {
    //   title: "Status",
    //   render: (text, record) => (
    //     <div style={{ color: "blue" }}>
    //       {record.status ? <div>{record.status}</div> : null}
    //     </div>
    //   ),
    // },

    {
      title: "Status",
      render: (text, record) => (
        <div>
          {record.status === "success" && (
            <CheckCircleOutlined style={{ color: "green" }} />
          )}
          {record.status === "failed" && (
            <CloseCircleOutlined style={{ color: "red" }} />
          )}
          {record.status === "pending" && (
            <ClockCircleOutlined style={{ color: "orange" }} />
          )}
        </div>
      ),
    },

    {
      title: "Verify",
      render: (record) => {
        if (record.status === "pending") {
          return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={() => handleVerify(record.id)}>Verify</Button>
              <Button
                type="link"
                size="small"
                onClick={() => onDelete(record.id)}
              >
                <Delete set="light" primaryColor="red" />
              </Button>
            </div>
          );
        } else {
          return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ color: "green" }}>Verified</div>
              <Button
                type="link"
                size="small"
                onClick={() => onDelete(record.id)}
              >
                <Delete set="light" primaryColor="red" />
              </Button>
            </div>
          );
        }
      },
    },
  ];

  const fetchManagerList = async (keyword = "", currentPage = 1) => {
    setIsTableLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    let status = urlParams.get("status");

    try {
      const response = await api.get(`/beneficiary-data/${segment[2]}`, {
        params: { keyword, page: currentPage, status },
      });

      const data = response.data;
      console.log(data);

      setRecords(data.records);
      setPage(data.page);
      setPerPage(data.per_page);
      setTotalCount(data.total_records);
    } catch (error) {
      console.error("Error fetching BeneficiaryList:", error);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    const queryParams = parseQueryParams(location);
    fetchManagerList(queryParams.keyword || "", queryParams.page || 1, status);
  }, [location.search, status]);

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

    fetchManagerList(keyword);
  };

  const parseQueryParams = (location) => {
    const searchParams = new URLSearchParams(location.search);
    const queryParams = {};
    for (let [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    return queryParams;
  };

  const stringifyQueryParams = (queryParams) => {
    const searchParams = new URLSearchParams();
    for (let key in queryParams) {
      searchParams.set(key, queryParams[key]);
    }
    return searchParams.toString();
  };

  const handleVerify = async (id) => {
    try {
      const response = await api.get("beneficiary-data-success", {
        params: { id },
      });
      if (response.data.message === "success" && response.data.records) {
        const updatedData = data.map((item) => {
          if (item.id === id) {
            return { ...item, status: "success", ...response.data.records };
          }
          return item;
        });
        setData(updatedData);
        console.log("Verification successful");
        fetchManagerList();
      } else {
        console.error("Verification failed");
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  const onDelete = (id) => {
    Modal.confirm({
      title: "Warning",
      content: "Are you sure to delete this record?",
      onOk: async () => {
        await api.post("/beneficiary-data-delete", { id });
        // refresh list
        navigate({
          pathname: location.pathname,
          search: stringifyQueryParams({}),
        });
      },
    });
  };

  const onChangePaymentStatus = (value) => {
    let query = parseQueryParams(location);

    if (value.target.value != " ") {
      query = {
        ...query,
        status: value.target.value,
      };
    } else {
      delete query.status;
    }

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
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

  const titles = [{ title: "Beneficially" }];

  return (
    <div className="wrap-orders">
      {/* <PageTitle titles={titles} /> */}
      <div className="overviewBorder">
        <Row justify="space-between">
          <Col xs={24} md={10} lg={6}>
            <Card className="small_card">
              <TableBar showFilter={false} onSearch={onSearch} />
            </Card>
          </Col>
          <Col xs={24} md={14} lg={8} xl={7}>
            <Card className="small_card">
              <Row justify={"space-between"} align={"middle"}>
                <Col md={14}>
                  <select
                    onChange={(value) => onChangePaymentStatus(value)}
                    className="payout-select"
                  >
                    <option value=" ">Status</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                  </select>
                </Col>
                <Col md={9}>
                  <Link to="/payin-payout">
                    <Button type="primary" size="large">
                      <span style={{ marginRight: "7px", fontSize: "18px" }}>
                        &larr;
                      </span>{" "}
                      Back
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
      <Spin spinning={isTableLoading}>
        <Table
          style={{ marginTop: "10px" }}
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
      </Spin>
    </div>
  );
};
export default BeneficiallyData;
