import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Modal, Table, Button, Switch, Space, Col, Card } from "antd";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import { TrashIcon, PencilAltIcon, LoginIcon } from "@heroicons/react/outline";
import PageTitle from "components/PageTitle";
import UserCreateForm from "routes/users/UserCreateForm";
import UserUpdateForm from "./UserUpdateForm";
import { useSelector } from "react-redux";
// requests
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  assignUsersToParent,
  unassignUsersFromParent,
  fetchUserAccessToken,
} from "requests/user";
import UserAssignForm from "./UserAssignForm";
import moment from "moment";
import { removeCookie, setCookie } from "utils/cookie";
import { FaFileAlt } from "react-icons/fa";

const UserList = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [visibleCreateForm, setVisibleCreateForm] = useState(false);
  const [visibleUpdateForm, setVisibleUpdateForm] = useState(false);
  const [visibleAssignForm, setVisibleAssignForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const authUser = useSelector((state) => state.auth.authUser);

  const location = useLocation();
  const navigate = useNavigate();
  const titles = [{ path: location.pathname, title: "Users" }];

  // UserList.js - onViewLogs function change karo
  const onViewLogs = (userId) => {
    // ✅ Correct path - /users-logs (not /user-logs)
    navigate(`/users-logs/${userId}`);
  };


  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   sorter: true,
    // },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <Link to={`${location.pathname}/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return <div>{record.full_name || ""}</div>;
      },
    },
    {
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
      render: (text, record) => {
        return <div>{record.client_name || ""}</div>;
      },
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text, record) => {
        return <div>{record.role?.name || ""}</div>;
      },
    },

    {
      title: "Parent",
      dataIndex: "parent_id",
      key: "parent_id",
      render: (text, record) => {
        if (record.parent) {
          return (
            <div>
              <Link to={`/users/${record.parent.id}`}>
                {record.parent.full_name}
              </Link>
              <div
                className="pointer danger"
                onClick={() => onUnassign(record.id)}
              >
                <small>Detach</small>
              </div>
            </div>
          );
        }

        return null;
      },
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (text, record) => {
    //     return (
    //       <Switch
    //         checked={text === 0 ? false : true}
    //         checkedChildren="Active"
    //         unCheckedChildren="Inactive"
    //         onChange={(value) => onUpdateStatus(record.id, value)}
    //       />
    //     );
    //   },
    // },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => {
        return <div>{moment(text).format("YYYY-MM-DD HH:mm")}</div>;
      },
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => onEdit(record)}>
            <PencilAltIcon width={24} height={24} />
          </Button>

          <Button type="primary"
            size="small"
            onClick={() => onViewLogs(record.id)}>
            Login History
          </Button>

          {/* <Button type="link" size="small" onClick={() => onAccessMerchantDashboard(record.id)}>
            <LoginIcon width={24} height={24} />
          </Button> */}
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

  useEffect(() => {
    const query = parseQueryParams(location);
    getRecords(query);
  }, [location]);

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
      const response = await getUsers(query);
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
      await createUser(data);
      // refresh list
      navigate({
        pathname: location.pathname,
        search: stringifyQueryParams({}),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onEdit = (data) => {
    setSelectedUser(data);
    onToggleUpdateForm();
  };



  const onToggleUpdateForm = () => {
    // in case hide update form, set selected currency is null
    if (visibleUpdateForm) setSelectedUser(null);

    setVisibleUpdateForm(!visibleUpdateForm);
  };

  const onUpdate = async (data) => {
    try {
      await updateUser(selectedUser.id, data);

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
        await deleteUser(id);
        // refresh list
        navigate({
          pathname: location.pathname,
          search: stringifyQueryParams({}),
        });
      },
    });
  };

  const onToggleAssignForm = () => {
    setVisibleAssignForm(!visibleAssignForm);
  };

  const onRefresh = () => {
    const query = parseQueryParams(location);
    getRecords(query);
  };

  const onAssign = async (data) => {
    try {
      const userIds = [...selectedRowKeys];

      await assignUsersToParent({
        user_ids: userIds,
        parent_id: data.parent_id,
      });

      onRefresh();
    } catch (err) {
      console.log(err);
    }
  };

  const onUnassign = (id) => {
    Modal.confirm({
      title: "Are you sure?",
      onOk: async () => {
        try {
          const userIds = [id];

          await unassignUsersFromParent({
            user_ids: userIds,
          });

          onRefresh();
        } catch (err) {
          console.log(err);
        }
      },
    });
  };

  const onUpdateStatus = (id, status) => {
    Modal.confirm({
      title: `Are you sure to ${status ? "enable" : "disable"} this user?`,
      onOk: async () => {
        try {
          await updateUser(id, { status: status });

          onRefresh();
        } catch (err) {
          console.log(err);
        }
      },
    });
  };

  const disabledRowIds = [436, 438];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      ;
    },
    getCheckboxProps: (record) => {
      return {
        disabled: disabledRowIds.includes(record.id),
      };
    },
  };

  return (
    <div>
      <div className="overviewBorder">
        <Row gutter={[8, 8]} align={"middle"} justify={"space-between"}>
          {/* <PageTitle titles={titles} /> */}
          <Col xs={24} sm={24} md={12} lg={5} xl={5}>
            <Card className="small_card">
              <Button
                className="h-50"
                disabled={!selectedRowKeys.length}
                type="default"
                onClick={onToggleAssignForm}
              >
                Assign to Partner
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={5}>
            <Card className="small_card">
              <Button
                type="primary"
                onClick={onToggleCreateForm}
                className="h-50"
              >
                Create new Users
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} xl={7}>
            <Card className="small_card">
              <TableBar showFilter={false} onSearch={onSearch} />
            </Card>
          </Col>
        </Row>
      </div>

      <Table
        rowSelection={rowSelection}
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
      <UserCreateForm
        visible={visibleCreateForm}
        onClose={onToggleCreateForm}
        onSubmit={onCreate}
      />
      <UserAssignForm
        visible={visibleAssignForm}
        onClose={onToggleAssignForm}
        onSubmit={onAssign}
      />
      {selectedUser && (
        <UserUpdateForm
          record={{ ...selectedUser, role: selectedUser.role.id }}
          visible={visibleUpdateForm}
          onClose={onToggleUpdateForm}
          onSubmit={onUpdate}
        />
      )}
    </div>
  );
};

export default UserList;
