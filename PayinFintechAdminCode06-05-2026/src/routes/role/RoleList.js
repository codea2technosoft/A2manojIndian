import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Typography, Row, Modal, Table, Button, Card } from "antd";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { getRoles, createRole, deleteRole } from "requests/role";
import RoleCreateForm from "routes/role/RoleCreateForm";
import { TrashIcon } from "@heroicons/react/outline";
import PageTitle from "components/PageTitle";

const { Title } = Typography;

const RoleList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [visibleCreateForm, setVisibleCreateForm] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const titles = [{ path: "/roles", title: "Roles" }];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to={`${location.pathname}/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
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

  useEffect(() => {
    const query = parseQueryParams(location);
    getRecords(query);
  }, [location]);

  const onChangePagination = (page, pageSize) => {
    let query = parseQueryParams(location);
    query = {
      ...query,
      page,
      per_page: pageSize,
    };

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
      const response = await getRoles(query);
      setRecords(response.records);
      setPage(response.page);
      setPerPage(response.per_page);
      setTotalCount(response.total_records);
    } catch (err) {
      console.log(err);
    }
  };

  const onToggleCreateForm = () => {
    setVisibleCreateForm(!visibleCreateForm);
  };

  const onCreate = async (data) => {
    try {
      await createRole(data);

      // refresh list
      navigate({
        pathname: location.pathname,
        search: stringifyQueryParams({}),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = (id) => {
    Modal.confirm({
      title: "Warning",
      content: "Are you sure to delete this record?",
      onOk: async () => {
        await deleteRole(id);
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
          {/* <PageTitle titles={titles} /> */}
          <Card className="small_card">
            <Button
              type="primary"
              onClick={onToggleCreateForm}
              className="h-50"
            >
              Create new role
            </Button>
          </Card>
          <Card className="small_card">
            <TableBar showFilter={false} onSearch={onSearch} />
          </Card>
        </Row>

      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        pagination={{
          pageSize: perPage,
          total: totalCount,
          current: page,
          onChange: onChangePagination,
        }}
      />
      <RoleCreateForm
        visible={visibleCreateForm}
        onClose={onToggleCreateForm}
        onSubmit={onCreate}
      />
    </div>
  );
};

export default RoleList;
