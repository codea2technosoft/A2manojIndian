import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Row, Modal, Table, Button, Switch, Tag, Col, Card } from "antd";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { TrashIcon } from "@heroicons/react/outline";
import PageTitle from "components/PageTitle";
// requests
import { getServices, deleteService, updateService } from "requests/service";

const ServiceList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const titles = [{ path: location.pathname, title: "Services" }];

  useEffect(() => {
    const query = parseQueryParams(location);
    getRecords(query);
  }, [location]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`/services/${record.id}`}>{text}</Link>
      ),
      sorter: true,
    },
    {
      title: "Modules",
      dataIndex: "modules",
      key: "modules",
      render: (text, record) => (
        <div>
          {record.modules.map((module) => (
            // <Link to={`/modules/${module.id}`}>
            <Tag color="purple" key={module.id}>
              {module.name}
            </Tag>
            // </Link>
          ))}
        </div>
      ),
      sorter: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <Switch
            checked={text === 0 ? false : true}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onChange={() => onUpdateStatus(record)}
          />
        );
      },
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Button
          danger
          type="link"
          size="small"
          onClick={() => onDelete(record.id)}
        >
          <TrashIcon width={24} height={24} />
        </Button>
      ),
    },
  ];

  const onUpdateStatus = async (data) => {
    try {
      await updateService(data.id, { status: data.status === 0 ? 1 : 0 });

      // refresh list
      navigate({
        pathname: location.pathname,
        search: stringifyQueryParams({}),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeTable = (pagination, filters, sorter, extra) => {
    console.log(pagination, filters, sorter, extra);

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

  const getRecords = async (query) => {
    try {
      const response = await getServices(query);
      setRecords(response.records);
      setPage(response.page);
      setPerPage(response.per_page);
      setTotalCount(response.total_records);
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = (id) => {
    Modal.confirm({
      title: "Warning",
      content: "Are you sure to delete this record?",
      onOk: async () => {
        await deleteService(id);
        // refresh list
        navigate({
          pathname: location.pathname,
          search: stringifyQueryParams({}),
        });
      },
    });
  };

  return (
    <div>
      <Row justify={"space-between"} align={"middle"}>
        {/* <Col lg={8} md={8} sm={24} xs={24}>
          <PageTitle titles={titles} />
        </Col> */}
        <Col lg={8} md={8} sm={24} xs={24}>
          <Card className="small_card">
            <TableBar showFilter={false} onSearch={onSearch} />
          </Card>
        </Col>
        <Col lg={6} md={8} sm={24} xs={24}>
          <Card className="small_card">
            <Link to="/services/create">
              <Button type="primary" className="ant-btn-lg w-100">
                Create new service
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        onChange={onChangeTable}
        pagination={{
          pageSize: perPage,
          total: totalCount,
          current: page,
        }}
      />
    </div>
  );
};

export default ServiceList;
