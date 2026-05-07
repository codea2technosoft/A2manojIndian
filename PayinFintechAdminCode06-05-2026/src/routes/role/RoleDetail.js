import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Divider,
  Card,
  Checkbox,
} from "antd";
import _ from "lodash";
import { assignPermissions, getRole, updateRole } from "requests/role";
import { getPermissions } from "requests/permission";
import PageTitle from "components/PageTitle";
import Loading from "components/Loading";

const RoleDetail = () => {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [titles, setTitles] = useState([{ path: "/roles", title: "Roles" }]);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingAssignPermissions, setLoadingAssignPermissions] =
    useState(false);

  const params = useParams();

  const config = useSelector((state) => state.config);

  const typeOptions = config.role_types.map((item) => {
    return { label: item.display, value: item.value };
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const record = await getRole(params.id);
      setTitles([
        { path: "/roles", title: "Roles" },
        { path: `/roles/${record.id}`, title: record.name },
      ]);
      setRecord(record);

      if (record.permissions && record.permissions.length) {
        const permissionIds = record.permissions.map((item) => item.id);
        setSelectedPermissionIds(permissionIds);
      }

      // permissions list
      let permissions = await getPermissions();
      setPermissionGroups(_.groupBy(permissions, "resource"));

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdate = async (data) => {
    try {
      setLoadingUpdate(true);
      await updateRole(params.id, data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const onTogglePermission = (permissionId) => {
    const permissionIds = [...selectedPermissionIds];
    const index = permissionIds.indexOf(permissionId);

    if (index >= 0) {
      permissionIds.splice(index, 1);
    } else {
      permissionIds.push(permissionId);
    }

    setSelectedPermissionIds(permissionIds);
  };

  const onAssignPermissions = async () => {
    try {
      setLoadingAssignPermissions(true);
      await assignPermissions(params.id, {
        permission_ids: selectedPermissionIds,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAssignPermissions(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <PageTitle titles={titles} />
          <Form layout="vertical" initialValues={record} onFinish={onUpdate}>
            <Row gutter={[16, 16]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true }]}
                >
                  <Select options={typeOptions} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end">
              <Button type="primary" loading={loadingUpdate} htmlType="submit">
                Update
              </Button>
            </Row>
          </Form>
          <Divider orientation="left" orientationMargin={0}>
            Permissions
          </Divider>
          <Row gutter={[16, 16]} className="mb-36">
            {Object.keys(permissionGroups).map((group) => (
              <Col lg={8} md={8} sm={12} xs={24} key={group}>
                <Card title={group}>
                  {permissionGroups[group].map((permission, index) => (
                    <div>
                      <Checkbox
                        key={index}
                        defaultChecked={selectedPermissionIds.includes(
                          permission.id
                        )}
                        onChange={() => onTogglePermission(permission.id)}
                      >
                        {permission.name}
                      </Checkbox>
                    </div>
                  ))}
                </Card>
              </Col>
            ))}
          </Row>
          <Row justify="end" className="mb-36">
            <Button
              type="primary"
              loading={loadingAssignPermissions}
              onClick={onAssignPermissions}
            >
              Assign permissions
            </Button>
          </Row>
        </React.Fragment>
      )}
    </div>
  );
};

export default RoleDetail;
